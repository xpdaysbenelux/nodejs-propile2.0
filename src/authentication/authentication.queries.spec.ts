import { Test, TestingModule } from '@nestjs/testing';

import { AuthenticationQueries } from './authentication.queries';
import { DatabaseModule, UserRepository } from '../database';

describe('AuthenticationQueries', () => {
    let userRepository: UserRepository;
    let authQueries: AuthenticationQueries;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [AuthenticationQueries],
        }).compile();

        authQueries = module.get(AuthenticationQueries);
        userRepository = module.get(UserRepository);
    });

    afterAll(() => {
        userRepository.manager.connection.close();
    });

    describe('composeUserSession', () => {
        it(`should return the correct user`, async () => {
            const userId = 'c4cb4582-1e97-4e3e-9d49-c744c8c1a229';
            const result = await authQueries.composeUserSession(userId);
            expect(result).toMatchSnapshot();
        });

        it('should return no user if not found', async () => {
            const userId = '63440b0f-59b3-473e-bf87-2c05136cc005';
            const result = await authQueries.composeUserSession(userId);
            expect(result).toMatchSnapshot();
        });
    });

    describe('getLoggedInUser', () => {
        it(`should return the correct user`, async () => {
            const userId = 'c4cb4582-1e97-4e3e-9d49-c744c8c1a229';
            const result = await authQueries.getAuthenticatedUser(userId);
            expect(result).toMatchSnapshot();
        });

        it('should return no user if not found', async () => {
            const userId = '63440b0f-59b3-473e-bf87-2c05136cc005';
            const result = await authQueries.getAuthenticatedUser(userId);
            expect(result).toMatchSnapshot();
        });
    });
});
