import { Test } from '@nestjs/testing';
import * as faker from 'faker';

import { ProgramRepository, DatabaseModule } from '../database';
import { ProgramsQueries } from './programs.queries';
import { SortDirection } from '../_shared/constants';
import {
    GetProgramsRequestQuery,
    ProgramsSortColumns,
} from './dto/get-programs.dto';

describe('ProgramsQueries', () => {
    let programRepository: ProgramRepository;
    let programsQueries: ProgramsQueries;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [ProgramsQueries],
        }).compile();

        programsQueries = module.get(ProgramsQueries);
        programRepository = module.get(ProgramRepository);
    });

    afterAll(() => {
        programRepository.manager.connection.close();
    });

    describe('getProgram', () => {
        it('should return the requested program correctly', async () => {
            const result = await programsQueries.getProgram(
                '3185e221-73ca-4b5a-93a9-1cc2d0b5df76',
            );

            const { startTime, endTime, date, ...withoutDates } = result;
            expect(withoutDates).toMatchSnapshot();
        });

        it('should return nothing if the requested program does not exist', async () => {
            const result = await programsQueries.getProgram(
                faker.random.uuid(),
            );

            expect(result).toMatchSnapshot();
        });
    });

    describe('getPrograms', () => {
        const testQueries: GetProgramsRequestQuery[] = [
            {},
            { search: 'planning' },
            { search: 'program' },
            {
                sortBy: ProgramsSortColumns.Date,
                sortDirection: SortDirection.Ascending,
            },
        ];

        testQueries.forEach((query, index) => {
            it(`should return a paged list of programs: #${index}`, async () => {
                const result = await programsQueries.getPrograms(query);

                const withoutDatesList = result.data.map(entry => {
                    const { startTime, endTime, date, ...withoutDates } = entry;
                    return withoutDates;
                });
                expect({
                    data: withoutDatesList,
                    meta: result.meta,
                }).toMatchSnapshot();
            });
        });

        it('should return an empty list if no programs are found', async () => {
            const result = await programsQueries.getPrograms({
                search: 'jibbrishsearch',
            });
            expect(result).toMatchSnapshot();
        });
    });
});
