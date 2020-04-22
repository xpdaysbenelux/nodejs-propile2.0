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

    describe('getSessions', () => {
        it('should return a paged list of sessions', async () => {
            const list = await sessionsQueries.getSessions();
            expect(list).toMatchSnapshot();
        });
    });
});
