import { PagingQuery, PagingMeta } from 'src/_shared/dto';
import { IsOptional, IsEnum } from 'class-validator';

import { ConferenceResponse } from './get-conference.dto';

export enum ConferencesSortColumns {
    Name = 'name',
    StartDate = 'startDate',
    EndDate = 'endDate',
}

export class GetConferencesRequestQuery extends PagingQuery {
    @IsOptional()
    @IsEnum(ConferencesSortColumns)
    readonly sortBy?: ConferencesSortColumns;
}

export class GetConferencesResponse {
    readonly meta: PagingMeta;
    readonly data: ConferenceResponse[];
}
