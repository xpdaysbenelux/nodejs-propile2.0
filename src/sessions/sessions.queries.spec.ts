import { Test } from '@nestjs/testing';
import * as faker from 'faker';

import { SessionRepository, DatabaseModule } from '../database';
import { SessionsQueries } from './sessions.queries';

describe('SessionsQueries', () => {
    let sessionRepository: SessionRepository;
    let sessionsQueries: SessionsQueries;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [SessionsQueries],
        }).compile();

        sessionsQueries = module.get(SessionsQueries);
        sessionRepository = module.get(SessionRepository);
    });

    afterAll(() => {
        sessionRepository.manager.connection.close();
    });

    describe('getSession', () => {
        it('should return the requested session correctly', async () => {
            const result = await sessionsQueries.getSession(
                '8c87028d-31f6-414b-b02d-e7431b6a7243',
            );
            expect(result).toMatchSnapshot();
        });

        it('should return nothing if the requested session does not exist', async () => {
            const result = await sessionsQueries.getSession(
                faker.random.uuid(),
            );
            expect(result).toMatchSnapshot();
        });
    });

    describe('getSessionsByUser', () => {
        it('should return a list of sessions from the requested user', async () => {
            const list = await sessionsQueries.getSessionsByUser(
                '45c2c554-b06a-4209-aba8-b097cb5f8566',
            );
            expect(list).toMatchSnapshot();
        });

        it('should return an empty list if no sessions for the requested user are found', async () => {
            const list = await sessionsQueries.getSessionsByUser(
                'c356fce8-9f95-4c69-9e71-8f4d74f49b8f',
            );
            expect(list).toMatchSnapshot();
        });

        it('should return an empty list if the requested user does not exist', async () => {
            const result = await sessionsQueries.getSessionsByUser(
                faker.random.uuid(),
            );
            expect(result).toMatchSnapshot();
        });
    });
});
