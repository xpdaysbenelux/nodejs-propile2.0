import { IsOptional, IsEnum } from 'class-validator';

import { PagingQuery, PagingMeta } from '../../_shared/dto';
import { SessionResponse } from './get-session.dto';

export enum SessionsSortColumns {
    Title = 'title',
    State = 'state',
}

export class GetSessionsRequestQuery extends PagingQuery {
    @IsOptional()
    @IsEnum(SessionsSortColumns)
    readonly sortBy?: SessionsSortColumns;
}

export class GetSessionsResponse {
    readonly meta: PagingMeta;
    readonly data: SessionResponse[];
}
