import { IsOptional, IsEnum } from 'class-validator';

import { PagingQuery, PagingMeta } from '../../_shared/dto';
import { ProgramResponse } from './get-program.dto';

export enum ProgramsSortColumns {
    Title = 'title',
    Date = 'date',
    StartTime = 'startTime',
    EndTime = 'endTime',
}

export class GetProgramsRequestQuery extends PagingQuery {
    @IsOptional()
    @IsEnum(ProgramsSortColumns)
    readonly sortBy?: ProgramsSortColumns;
}

export class GetProgramsResponse {
    readonly meta: PagingMeta;
    readonly data: ProgramResponse[];
}
