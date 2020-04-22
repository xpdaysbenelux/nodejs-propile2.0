import { Test } from '@nestjs/testing';
import * as faker from 'faker';

import { SortDirection } from '../_shared/constants';
import { ConferenceRepository, DatabaseModule } from '../database';
import { ConferencesQueries } from './conferences.queries';
import { GetConferencesRequestQuery, ConferencesSortColumns } from './dto';

describe('ConferenceQueries', () => {
    let conferenceRepository: ConferenceRepository;
    let conferenceQueries: ConferencesQueries;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [ConferencesQueries],
        }).compile();

        conferenceQueries = module.get(ConferencesQueries);
        conferenceRepository = module.get(ConferenceRepository);
    });

    afterAll(() => {
        conferenceRepository.manager.connection.close();
    });

    describe('getConference', () => {
        it('should return the requested conference correctly', async () => {
            const result = await conferenceQueries.getConference(
                '81bdc928-b92d-4111-91f9-3ef93e203e88',
            );

            const { startDate, endDate, ...withoutDates } = result;
            expect(withoutDates).toMatchSnapshot();
        });

        it('should return nothing if the requested conference does not exist', async () => {
            const result = await conferenceQueries.getConference(
                faker.random.uuid(),
            );

            expect(result).toMatchSnapshot();
        });
    });

    describe('getConferences', () => {
        const testQueries: GetConferencesRequestQuery[] = [
            {},
            { search: 'Conference' },
            { search: '2' },
            {
                sortBy: ConferencesSortColumns.Name,
                sortDirection: SortDirection.Ascending,
            },
        ];

        testQueries.forEach((query, index) => {
            it(`should return a paged list of conferences: #${index}`, async () => {
                const result = await conferenceQueries.getConferences(query);

                const withoutDatesList = result.data.map(entry => {
                    const { startDate, endDate, ...withoutDates } = entry;
                    return withoutDates;
                });
                expect({
                    data: withoutDatesList,
                    meta: result.meta,
                }).toMatchSnapshot();
            });
        });

        it('should return an empty list if no conferences are found', async () => {
            const result = await conferenceQueries.getConferences({
                search: 'jibbrishsearch',
            });
            expect(result).toMatchSnapshot();
        });
    });
});
