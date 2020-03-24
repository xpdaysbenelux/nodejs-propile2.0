import { Injectable } from '@nestjs/common';
import { mergeDeepLeft } from 'ramda';
import { SelectQueryBuilder } from 'typeorm';

import { ConferenceRepository, Conference } from '../database';
import {
    ConferenceResponse,
    GetConferencesRequestQuery,
    GetConferencesResponse,
    ConferencesSortColumns,
} from './dto';
import { SortDirection } from '../_shared/constants';

const conferenceFields = [
    'conference.id',
    'conference.name',
    'conference.startDate',
    'conference.endDate',
    'rooms.id',
    'rooms.name',
    'rooms.maxParticipants',
];

@Injectable()
export class ConferencesQueries {
    constructor(private readonly conferenceRepository: ConferenceRepository) {}

    async getConference(conferenceId: string): Promise<ConferenceResponse> {
        return this.conferenceRepository
            .createQueryBuilder('conference')
            .select(conferenceFields)
            .where('conference.id = :conferenceId', { conferenceId })
            .innerJoin('conference.rooms', 'rooms')
            .getOne();
    }

    async getConferences(
        requestQuery: GetConferencesRequestQuery,
    ): Promise<GetConferencesResponse> {
        const defaultQuery: GetConferencesRequestQuery = {
            skip: 0,
            take: 20,
            sortBy: ConferencesSortColumns.Name,
            sortDirection: SortDirection.Descending,
            search: '',
        };

        const query = mergeDeepLeft(requestQuery, defaultQuery);

        const [conferences, totalCount] = await this.selectConferenceColumns(
            this.conferenceRepository.createQueryBuilder('conference'),
        )
            .orderBy(`conference.${query.sortBy}`, query.sortDirection)
            .take(query.take)
            .skip(query.skip)
            .where('conference.name ILIKE :search', {
                search: `%${query.search}%`,
            })
            .getManyAndCount();

        return {
            meta: {
                count: conferences.length,
                totalCount,
                skip: query.skip,
            },
            data: conferences,
        };
    }

    private selectConferenceColumns(
        queryBuilder: SelectQueryBuilder<Conference>,
    ): SelectQueryBuilder<Conference> {
        return queryBuilder
            .select(conferenceFields)
            .innerJoin('conference.rooms', 'rooms');
    }
}
