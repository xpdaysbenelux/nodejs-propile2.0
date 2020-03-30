import {
    mock,
    reset,
    instance,
    objectContaining,
    when,
    verify,
} from 'ts-mockito';
import * as faker from 'faker';
import { TestingModule, Test } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { parseISO } from 'date-fns';

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
} from './errors';

describe('ProgramsService', () => {
    let programsService: ProgramsService;

    const programsRepository = mock(ProgramRepository);
    const conferenceRepository = mock(ConferenceRepository);

    const createBody = {
        title: faker.lorem.sentence(),
        date: '2020-04-02T00:00:00.000Z',
        startTime: '2020-04-02T08:00:00.000Z',
        endTime: '2020-04-02T20:00:00.000Z',
        conferenceId: faker.random.uuid(),
    };
    const currentUser = createTestUserSession();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProgramsService,
                {
                    provide: getCustomRepositoryToken(ProgramRepository),
                    useValue: instance(programsRepository),
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
        reset(programsRepository);
        reset(conferenceRepository);
    });

    describe('CreateProgram', () => {
        it('should create a program with an original title', async () => {
            when(
                programsRepository.findOne(
                    objectContaining({ title: createBody.title }),
                ),
            ).thenResolve(null);
            when(
                conferenceRepository.findOne(
                    objectContaining({ id: createBody.conferenceId }),
                ),
            ).thenResolve(
                createFullTestConference({
                    startDate: parseISO('2020-04-01T10:00:00.000Z'),
                    endDate: parseISO('2020-04-04T10:00:00.000Z'),
                }),
            );

            await programsService.createProgram(createBody, currentUser);

            verify(
                programsRepository.save(
                    objectContaining({
                        title: createBody.title,
                        date: parseISO(createBody.date),
                        startTime: parseISO(createBody.startTime),
                        endTime: parseISO(createBody.endTime),
                        createdBy: currentUser.email,
                    }),
                ),
            ).once();
        });

        it('should throw an error because a program with this title already exists', async () => {
            when(
                programsRepository.findOne(
                    objectContaining({ title: createBody.title }),
                ),
            ).thenResolve(createTestProgram({ title: createBody.title }));

            await expect(
                programsService.createProgram(createBody, currentUser),
            ).rejects.toThrowError(ProgramTitleAlreadyInUse);
        });

        it('should throw an error because the program date is not one of or between the conference dates', async () => {
            when(
                programsRepository.findOne(
                    objectContaining({ title: createBody.title }),
                ),
            ).thenResolve(null);
            when(
                conferenceRepository.findOne(
                    objectContaining({ id: createBody.conferenceId }),
                ),
            ).thenResolve(
                createFullTestConference({
                    startDate: parseISO('2020-03-31T10:00:00.000Z'),
                    endDate: parseISO('2020-04-01T10:00:00.000Z'),
                }),
            );

            await expect(
                programsService.createProgram(createBody, currentUser),
            ).rejects.toThrowError(ProgramDateMustBeBetweenConferenceDates);
        });

        it('should throw an error because the startTime date is not the same as the program date', async () => {
            when(
                programsRepository.findOne(
                    objectContaining({ title: createBody.title }),
                ),
            ).thenResolve(null);
            when(
                conferenceRepository.findOne(
                    objectContaining({ id: createBody.conferenceId }),
                ),
            ).thenResolve(
                createFullTestConference({
                    startDate: parseISO('2020-04-01T10:00:00.000Z'),
                    endDate: parseISO('2020-04-04T10:00:00.000Z'),
                }),
            );

            createBody.startTime = '2020-04-03T08:00:00.000Z';

            await expect(
                programsService.createProgram(createBody, currentUser),
            ).rejects.toThrowError(StartEndTimeDatesMustBeSameAsProgramDate);
        });
    });
});
