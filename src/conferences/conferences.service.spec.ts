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
import { Connection, Not } from 'typeorm';

import { ConferencesService } from './conferences.service';
import { ConferenceRepository } from '../database';
import { createTestUserSession, createTestConference } from '../_util/testing';
import { ConferenceNameAlreadyInUse, ConferenceNotFoud } from './errors';

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
        it('should update the conference name correctly', async () => {
            const conferenceId = faker.random.uuid();
            const newName = faker.name.title();
            const existingConference = createTestConference({
                id: conferenceId,
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

            const updateBody = body;
            updateBody.name = newName;

            await conferencesService.updateConference(
                updateBody,
                conferenceId,
                currentUser,
            );

            verify(
                conferenceRepository.save(
                    objectContaining({
                        conferenceId,
                        newName,
                        updatedBy: currentUser.email,
                    }),
                ),
            ).once();
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
