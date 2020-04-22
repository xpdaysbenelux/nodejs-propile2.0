import {
    mock,
    reset,
    instance,
    objectContaining,
    when,
    verify,
    anything,
} from 'ts-mockito';
import * as faker from 'faker';
import { TestingModule, Test } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { parseISO } from 'date-fns';
import { Not } from 'typeorm';

import { ProgramsService } from './programs.service';
import { ProgramRepository, ConferenceRepository } from '../database';
import {
    createFullTestConference,
    createTestUserSession,
    createTestProgram,
} from '../_util/testing';
import {
    ProgramTitleAlreadyInUse,
    ProgramDateMustBeBetweenConferenceDates,
    StartEndTimeDatesMustBeSameAsProgramDate,
    ProgramNotFoud,
} from './errors';
import { ConferenceNotFoud } from '../conferences/errors';

describe('ProgramsService', () => {
    let programsService: ProgramsService;

    const programRepository = mock(ProgramRepository);
    const conferenceRepository = mock(ConferenceRepository);

    const body = {
        title: faker.lorem.sentence(),
        date: '2020-04-02T00:00:00',
        startTime: '2020-04-02T08:00:00',
        endTime: '2020-04-02T20:00:00',
        conferenceId: faker.random.uuid(),
    };
    const currentUser = createTestUserSession();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProgramsService,
                {
                    provide: getCustomRepositoryToken(ProgramRepository),
                    useValue: instance(programRepository),
                },
                {
                    provide: getCustomRepositoryToken(ConferenceRepository),
                    useValue: instance(conferenceRepository),
                },
            ],
        }).compile();

        programsService = module.get(ProgramsService);
    });

    afterEach(() => {
        reset(programRepository);
        reset(conferenceRepository);
    });

    describe('createProgram', () => {
        it('should create a program with an original title', async () => {
            when(
                programRepository.findOne(
                    objectContaining({ title: body.title }),
                ),
            ).thenResolve(null);
            when(
                conferenceRepository.findOne(
                    objectContaining({ id: body.conferenceId }),
                ),
            ).thenResolve(
                createFullTestConference({
                    startDate: parseISO('2020-04-01T10:00:00'),
                    endDate: parseISO('2020-04-04T10:00:00'),
                }),
            );

            await programsService.createProgram(body, currentUser);

            verify(
                programRepository.save(
                    objectContaining({
                        title: body.title,
                        date: parseISO(body.date),
                        startTime: parseISO(body.startTime),
                        endTime: parseISO(body.endTime),
                        createdBy: currentUser.email,
                    }),
                ),
            ).once();
        });

        it('should throw an error because a program with this title already exists', async () => {
            when(
                programRepository.findOne(
                    objectContaining({ title: body.title }),
                ),
            ).thenResolve(createTestProgram({ title: body.title }));

            await expect(
                programsService.createProgram(body, currentUser),
            ).rejects.toThrowError(ProgramTitleAlreadyInUse);
        });

        it('should throw an error because the program date is not one of or between the conference dates', async () => {
            when(
                programRepository.findOne(
                    objectContaining({ title: body.title }),
                ),
            ).thenResolve(null);
            when(
                conferenceRepository.findOne(
                    objectContaining({ id: body.conferenceId }),
                ),
            ).thenResolve(
                createFullTestConference({
                    startDate: parseISO('2020-03-31T10:00:00'),
                    endDate: parseISO('2020-04-01T10:00:00'),
                }),
            );

            await expect(
                programsService.createProgram(body, currentUser),
            ).rejects.toThrowError(ProgramDateMustBeBetweenConferenceDates);
        });

        it('should throw an error because the startTime date is not the same as the program date', async () => {
            when(
                programRepository.findOne(
                    objectContaining({ title: body.title }),
                ),
            ).thenResolve(null);
            when(
                conferenceRepository.findOne(
                    objectContaining({ id: body.conferenceId }),
                ),
            ).thenResolve(
                createFullTestConference({
                    startDate: parseISO('2020-04-01T10:00:00'),
                    endDate: parseISO('2020-04-04T10:00:00'),
                }),
            );

            const createBody = {
                title: body.title,
                date: body.date,
                startTime: '2020-04-03T08:00:00',
                endTime: body.endTime,
                conferenceId: body.conferenceId,
            };

            await expect(
                programsService.createProgram(createBody, currentUser),
            ).rejects.toThrowError(StartEndTimeDatesMustBeSameAsProgramDate);
        });
    });

    describe('updateProgram', () => {
        it('should update the program correctly #1', async () => {
            const programId = faker.random.uuid();
            const conference = createFullTestConference({
                id: body.conferenceId,
                startDate: parseISO('2020-04-01T10:00:00'),
                endDate: parseISO('2020-04-04T10:00:00'),
            });
            const exisitingProgram = createTestProgram({
                id: programId,
                conference,
                date: body.date,
                startTime: '2020-04-02T10:00:00',
                endTime: '2020-04-02T19:00:00',
            });

            when(
                programRepository.findOne(
                    objectContaining({
                        where: { id: programId },
                        relations: ['events'],
                    }),
                ),
            ).thenResolve(exisitingProgram);

            when(
                programRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(programId),
                            title: body.title,
                        },
                    }),
                ),
            ).thenResolve(null);

            when(conferenceRepository.findOne(conference.id)).thenResolve(
                conference,
            );

            await programsService.updateProgram(body, programId, currentUser);
            verify(
                programRepository.save(
                    objectContaining({
                        title: body.title,
                        date: parseISO(body.date),
                        startTime: parseISO(body.startTime),
                        endTime: parseISO(body.endTime),
                    }),
                ),
            ).once();
        });

        it('should update the program correctly #2', async () => {
            const programId = faker.random.uuid();
            const conference = createFullTestConference({
                id: body.conferenceId,
                startDate: parseISO('2020-04-01T10:00:00'),
                endDate: parseISO('2020-04-04T10:00:00'),
            });
            const exisitingProgram = createTestProgram({
                id: programId,
                conference,
                date: '2020-04-03T02:00:00',
                startTime: '2020-04-03T10:00:00',
                endTime: '2020-04-03T19:00:00',
            });

            when(
                programRepository.findOne(
                    objectContaining({
                        where: { id: programId },
                        relations: ['events'],
                    }),
                ),
            ).thenResolve(exisitingProgram);

            when(
                programRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(programId),
                            title: body.title,
                        },
                    }),
                ),
            ).thenResolve(null);

            when(conferenceRepository.findOne(conference.id)).thenResolve(
                conference,
            );

            await programsService.updateProgram(body, programId, currentUser);
            verify(
                programRepository.save(
                    objectContaining({
                        title: body.title,
                        date: parseISO(body.date),
                        startTime: parseISO(body.startTime),
                        endTime: parseISO(body.endTime),
                    }),
                ),
            ).once();
        });

        it('should throw an error because the program date is not one of or between the conference dates', async () => {
            const programId = faker.random.uuid();
            const conference = createFullTestConference({
                id: body.conferenceId,
                startDate: parseISO('2020-04-01T10:00:00'),
                endDate: parseISO('2020-04-04T10:00:00'),
            });
            const exisitingProgram = createTestProgram({
                id: programId,
                conference,
                date: '2020-04-04T02:00:00',
                startTime: '2020-04-04T10:00:00',
                endTime: '2020-04-04T19:00:00',
            });
            console.log('error', exisitingProgram);

            const updateBody = {
                title: body.title,
                date: '2020-04-10T02:00:00',
                startTime: '2020-04-10T02:00:00',
                endTime: '2020-04-10T02:00:00',
                conferenceId: conference.id,
            };

            when(
                programRepository.findOne(
                    objectContaining({
                        where: { id: programId },
                        relations: ['events'],
                    }),
                ),
            ).thenResolve(exisitingProgram);

            when(
                programRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(programId),
                            title: body.title,
                        },
                    }),
                ),
            ).thenResolve(null);

            when(conferenceRepository.findOne(conference.id)).thenResolve(
                conference,
            );

            await expect(
                programsService.updateProgram(
                    updateBody,
                    programId,
                    currentUser,
                ),
            ).rejects.toThrowError(ProgramDateMustBeBetweenConferenceDates);
        });

        it('should throw an error when the program is not found', async () => {
            const programId = faker.random.uuid();

            when(
                programRepository.findOne(
                    objectContaining({
                        where: { id: programId },
                        relations: ['events'],
                    }),
                ),
            ).thenResolve(null);

            await expect(
                programsService.updateProgram(body, programId, currentUser),
            ).rejects.toThrowError(ProgramNotFoud);
        });

        it('should throw an error when a program with the same name already exists', async () => {
            const programId = faker.random.uuid();
            const exisitingProgram = createTestProgram({
                id: programId,
                date: '2020-04-04T10:00:00',
                startTime: '2020-04-04T10:00:00',
                endTime: '2020-04-04T19:00:00',
            });

            when(
                programRepository.findOne(
                    objectContaining({
                        where: { id: programId },
                        relations: ['events'],
                    }),
                ),
            ).thenResolve(exisitingProgram);

            when(
                programRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(programId),
                            title: body.title,
                        },
                    }),
                ),
            ).thenResolve(createTestProgram({ title: body.title }));

            await expect(
                programsService.updateProgram(body, programId, currentUser),
            ).rejects.toThrowError(ProgramTitleAlreadyInUse);
        });

        it('should throw an error when the conference is not found', async () => {
            const programId = faker.random.uuid();
            const exisitingProgram = createTestProgram({
                id: programId,
                date: '2020-04-04T10:00:00',
                startTime: '2020-04-04T10:00:00',
                endTime: '2020-04-04T19:00:00',
            });

            when(
                programRepository.findOne(
                    objectContaining({
                        where: { id: programId },
                        relations: ['events'],
                    }),
                ),
            ).thenResolve(exisitingProgram);

            when(
                programRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(programId),
                            title: body.title,
                        },
                    }),
                ),
            ).thenResolve(null);

            when(conferenceRepository.findOne(body.conferenceId)).thenResolve(
                null,
            );

            await expect(
                programsService.updateProgram(body, programId, currentUser),
            ).rejects.toThrowError(ConferenceNotFoud);
        });
    });

    describe('deleteProgram', () => {
        it("should delete a program and it's underlaying events correctly", async () => {
            const program = createTestProgram({
                id: faker.random.uuid(),
            });

            when(
                programRepository.findOne(
                    objectContaining({
                        where: { id: program.id },
                        relations: ['events'],
                    }),
                ),
            ).thenResolve(program);

            await programsService.deleteProgram(program.id);
            verify(programRepository.delete(program.id)).once();
        });

        it('should throw an error when the program does not exist', async () => {
            when(programRepository.findOne(anything())).thenResolve(null);

            await expect(
                programsService.deleteProgram(faker.random.uuid()),
            ).rejects.toThrowError(ProgramNotFoud);
        });
    });
});
