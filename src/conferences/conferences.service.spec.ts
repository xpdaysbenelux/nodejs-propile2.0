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

import { ConferencesService } from './conferences.service';
import { ConferenceRepository } from '../database';
import { createTestUserSession, createTestConference } from '../_util/testing';
import { ConferenceNameAlreadyInUse, ConferenceNotFoud } from './errors';
import { Connection } from 'typeorm';

describe('ConferencesService', () => {
    let conferencesService: ConferencesService;

    const conferencesRepository = mock(ConferenceRepository);
    const connection = mock(Connection);

    const createBody = {
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

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConferencesService,
                {
                    provide: getCustomRepositoryToken(ConferenceRepository),
                    useValue: instance(conferencesRepository),
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
        reset(conferencesRepository);
    });

    describe('createConference', () => {
        it('should create a conference with an original title', async () => {
            const currentUser = createTestUserSession();

            when(
                conferencesRepository.findOne(
                    objectContaining({ name: createBody.name }),
                ),
            ).thenResolve(null);

            await conferencesService.createConference(createBody, currentUser);

            verify(
                conferencesRepository.save(
                    objectContaining({
                        name: createBody.name,
                        startDate: parseISO(createBody.startDate),
                        endDate: parseISO(createBody.endDate),
                        rooms: createBody.rooms,
                        createdBy: currentUser.email,
                    }),
                ),
            ).once();
        });

        it('should throw an error because a conference with the given name already exists', async () => {
            const currentUser = createTestUserSession();

            when(
                conferencesRepository.findOne(
                    objectContaining({ name: createBody.name }),
                ),
            ).thenResolve(createTestConference({ name: createBody.name }));

            await expect(
                conferencesService.createConference(createBody, currentUser),
            ).rejects.toThrowError(ConferenceNameAlreadyInUse);
        });
    });

    describe('deleteConference', () => {
        it("should delete a conference and it's underlaying tree of elements correctly", async () => {
            const conference = createTestConference({
                id: faker.random.uuid(),
            });
            when(
                conferencesRepository.findOne(
                    objectContaining({
                        where: { id: conference.id },
                        relations: ['rooms'],
                    }),
                ),
            ).thenResolve(conference);

            await conferencesService.deleteConference(conference.id);
            verify(conferencesRepository.delete(conference.id)).once();
        });
        it('should thow an error when the conference does not exist', async () => {
            when(conferencesRepository.findOne(anything())).thenResolve(null);

            await expect(
                conferencesService.deleteConference(faker.random.uuid()),
            ).rejects.toThrowError(ConferenceNotFoud);
        });
    });
});
