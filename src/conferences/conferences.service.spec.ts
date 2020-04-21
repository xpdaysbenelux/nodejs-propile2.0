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
import { Connection, Not, EntityManager } from 'typeorm';

import { ConferencesService } from './conferences.service';
import { ConferenceRepository } from '../database';
import { createTestUserSession, createTestConference } from '../_util/testing';
import {
    ConferenceNameAlreadyInUse,
    ConferenceNotFoud,
    ConferenceMustHaveAtLeastTwoRooms,
} from './errors';

describe('ConferencesService', () => {
    let conferencesService: ConferencesService;

    const conferenceRepository = mock(ConferenceRepository);
    const connection = mock(Connection);

    const body = {
        name: faker.lorem.sentence(),
        startDate: faker.date.future().toString(),
        endDate: faker.date.future().toString(),
        rooms: [
            {
                name: 'Room 1',
                maxParticipants: faker.random.number(50),
            },
            {
                name: 'Room 2',
                maxParticipants: faker.random.number(50),
            },
        ],
    };
    const currentUser = createTestUserSession();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConferencesService,
                {
                    provide: getCustomRepositoryToken(ConferenceRepository),
                    useValue: instance(conferenceRepository),
                },
                {
                    provide: Connection,
                    useValue: instance(connection),
                },
            ],
        }).compile();

        conferencesService = module.get(ConferencesService);
    });

    afterEach(() => {
        reset(conferenceRepository);
    });

    describe('createConference', () => {
        it('should create a conference with an original title', async () => {
            when(
                conferenceRepository.findOne(
                    objectContaining({ name: body.name }),
                ),
            ).thenResolve(null);

            await conferencesService.createConference(body, currentUser);

            verify(
                conferenceRepository.save(
                    objectContaining({
                        name: body.name,
                        startDate: parseISO(body.startDate),
                        endDate: parseISO(body.endDate),
                        rooms: body.rooms,
                        createdBy: currentUser.email,
                    }),
                ),
            ).once();
        });

        it('should throw an error because a conference with the given name already exists', async () => {
            when(
                conferenceRepository.findOne(
                    objectContaining({ name: body.name }),
                ),
            ).thenResolve(createTestConference({ name: body.name }));

            await expect(
                conferencesService.createConference(body, currentUser),
            ).rejects.toThrowError(ConferenceNameAlreadyInUse);
        });
    });

    describe('updateConference', () => {
        it('should update the conference correctly #1', async () => {
            const transactionManager = mock(EntityManager);
            const conferenceId = faker.random.uuid();
            const newName = faker.name.title();
            const existingConference = createTestConference({
                id: conferenceId,
                rooms: body.rooms,
            });

            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: { id: conferenceId },
                        relations: ['rooms'],
                    }),
                ),
            ).thenResolve(existingConference);

            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(conferenceId),
                            newName,
                        },
                    }),
                ),
            ).thenResolve(null);

            when(
                connection.transaction(anything()),
            ).thenCall(async (callback: Function) =>
                callback(instance(transactionManager)),
            );

            const updateBody = body;
            updateBody.name = newName;

            await conferencesService.updateConference(
                updateBody,
                conferenceId,
                currentUser,
            );

            verify(transactionManager.save(anything())).once();
            verify(transactionManager.remove([])).never();
        });

        it('should update a conference correctly #2', async () => {
            const transactionManager = mock(EntityManager);
            const conferenceId = faker.random.uuid();

            const existingConference = createTestConference({
                id: conferenceId,
                rooms: [
                    {
                        id: faker.random.uuid(),
                        name: 'Room 1',
                        maxParticipants: faker.random.number(50),
                    },
                    {
                        id: faker.random.uuid(),
                        name: 'Room 2',
                        maxParticipants: faker.random.number(50),
                    },
                    {
                        id: faker.random.uuid(),
                        name: faker.name.title(),
                        maxParticipants: faker.random.number(50),
                    },
                ],
            });

            const updateBody = {
                name: existingConference.name,
                startDate: existingConference.startDate.toISOString(),
                endDate: existingConference.endDate.toISOString(),
                rooms: [
                    {
                        id: existingConference.rooms[0].id,
                        name: 'Room 1',
                        maxParticipants:
                            existingConference.rooms[0].maxParticipants,
                    },
                    {
                        id: existingConference.rooms[1].id,
                        name: 'Room 2',
                        maxParticipants:
                            existingConference.rooms[1].maxParticipants,
                    },
                ],
            };

            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: { id: conferenceId },
                        relations: ['rooms'],
                    }),
                ),
            ).thenResolve(existingConference);

            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(conferenceId),
                            name: updateBody.name,
                        },
                    }),
                ),
            ).thenResolve(null);

            when(
                connection.transaction(anything()),
            ).thenCall(async (callback: Function) =>
                callback(instance(transactionManager)),
            );

            await conferencesService.updateConference(
                updateBody,
                conferenceId,
                currentUser,
            );

            verify(transactionManager.save(anything())).once();
            verify(transactionManager.remove(anything())).once();
        });

        it('should throw an error when the new rooms array length is less then two', async () => {
            const conferenceId = faker.random.uuid();

            const existingConference = createTestConference({
                id: conferenceId,
            });

            const updateBody = {
                name: existingConference.name,
                startDate: existingConference.startDate.toISOString(),
                endDate: existingConference.endDate.toISOString(),
                rooms: [
                    {
                        id: existingConference.rooms[0].id,
                        name: 'Room 1',
                        maxParticipants:
                            existingConference.rooms[0].maxParticipants,
                    },
                ],
            };

            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: { id: conferenceId },
                        relations: ['rooms'],
                    }),
                ),
            ).thenResolve(existingConference);

            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(conferenceId),
                            name: updateBody.name,
                        },
                    }),
                ),
            ).thenResolve(null);

            await expect(
                conferencesService.updateConference(
                    updateBody,
                    conferenceId,
                    currentUser,
                ),
            ).rejects.toThrowError(ConferenceMustHaveAtLeastTwoRooms);
        });

        it('should throw an error when the conference is not found', async () => {
            const conferenceId = faker.random.uuid();

            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: { id: conferenceId },
                        relations: ['rooms'],
                    }),
                ),
            ).thenResolve(null);

            await expect(
                conferencesService.updateConference(
                    body,
                    conferenceId,
                    currentUser,
                ),
            ).rejects.toThrowError(ConferenceNotFoud);
        });

        it('should throw an error when a conference with the new name already exist', async () => {
            const conferenceId = faker.random.uuid();
            const existingConference = createTestConference({
                id: conferenceId,
            });
            const conferenceWithSameTitle = createTestConference({
                name: body.name,
            });

            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: { id: conferenceId },
                        relations: ['rooms'],
                    }),
                ),
            ).thenResolve(existingConference);

            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(conferenceId),
                            name: body.name,
                        },
                    }),
                ),
            ).thenResolve(conferenceWithSameTitle);

            await expect(
                conferencesService.updateConference(
                    body,
                    conferenceId,
                    currentUser,
                ),
            ).rejects.toThrowError(ConferenceNameAlreadyInUse);
        });
    });

    describe('deleteConference', () => {
        it("should delete a conference and it's underlaying tree of elements correctly", async () => {
            const conference = createTestConference({
                id: faker.random.uuid(),
            });
            when(
                conferenceRepository.findOne(
                    objectContaining({
                        where: { id: conference.id },
                        relations: ['rooms'],
                    }),
                ),
            ).thenResolve(conference);

            await conferencesService.deleteConference(conference.id);
            verify(conferenceRepository.delete(conference.id)).once();
        });
        it('should thow an error when the conference does not exist', async () => {
            when(conferenceRepository.findOne(anything())).thenResolve(null);

            await expect(
                conferencesService.deleteConference(faker.random.uuid()),
            ).rejects.toThrowError(ConferenceNotFoud);
        });
    });
});
