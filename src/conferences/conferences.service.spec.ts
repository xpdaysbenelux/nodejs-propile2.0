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

import { ConferencesService } from './conferences.service';
import { ConferenceRepository } from '../database';
import { createTestUserSession, createTestConference } from '../_util/testing';
import { ConferenceNameAlreadyInUse } from './errors';

describe('ConferencesService', () => {
    let conferencesService: ConferencesService;

    const conferencesRepository = mock(ConferenceRepository);

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
});
