import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { mergeDeepLeft } from 'ramda';

import { ProgramRepository, Program } from '../database';
import {
    ProgramResponse,
    GetProgramsRequestQuery,
    GetProgramsResponse,
    ProgramsSortColumns,
} from './dto';
import { SortDirection } from '../_shared/constants';

const programFields = [
    'program.id',
    'program.title',
    'program.date',
    'program.startTime',
    'program.endTime',
    'conference.id',
    'conference.name',
];

@Injectable()
export class ProgramsQueries {
    constructor(private readonly programRepository: ProgramRepository) {}

    async getProgram(programId: string): Promise<ProgramResponse> {
        return this.programRepository
            .createQueryBuilder('program')
            .select(programFields)
            .where('program.id = :programId', { programId })
            .innerJoin('program.conference', 'conference')
            .getOne();
    }

    async getPrograms(
        requestQuery: GetProgramsRequestQuery,
    ): Promise<GetProgramsResponse> {
        const defaultQuery: GetProgramsRequestQuery = {
            skip: 0,
            take: 20,
            sortBy: ProgramsSortColumns.Title,
            sortDirection: SortDirection.Descending,
            search: '',
        };

        const query = mergeDeepLeft(requestQuery, defaultQuery);

        const [programs, totalCount] = await this.selectProgramColumns(
            this.programRepository.createQueryBuilder('program'),
        )
            .orderBy(`program.${query.sortBy}`, query.sortDirection)
            .take(query.take)
            .skip(query.skip)
            .where('program.title ILIKE :search', {
                search: `%${query.search}%`,
            })
            .getManyAndCount();

        return {
            meta: {
                count: programs.length,
                totalCount,
                skip: query.skip,
            },
            data: programs,
        };
    }

    private selectProgramColumns(
        queryBuilder: SelectQueryBuilder<Program>,
    ): SelectQueryBuilder<Program> {
        return queryBuilder
            .select(programFields)
            .innerJoin('program.conference', 'conference');
    }
}
