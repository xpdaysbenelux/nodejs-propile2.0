import { Injectable } from '@nestjs/common';

import { SessionRepository, Session } from '../database';
import { SessionResponse } from './dto';
import { GetSessionsResponse } from './dto/get-sessions.dto';
import { SelectQueryBuilder } from 'typeorm';

const sessionFields = [
    'session.id',
    'session.createdAt',
    'session.title',
    'session.subTitle',
    'session.xpFactor',
    'session.description',
    'session.shortDescription',
    'session.sessionState',
    'session.goal',
    'session.type',
    'session.topic',
    'session.maxParticipants',
    'session.duration',
    'session.laptopsRequired',
    'session.otherLimitations',
    'session.roomSetup',
    'session.neededMaterials',
    'session.expierenceLevel',
    'session.outline',
    'session.materialDescription',
    'session.materialUrl',
    'firstPresenter.id',
    'firstPresenter.email',
    'secondPresenter.id',
    'secondPresenter.email',
];

@Injectable()
export class SessionsQueries {
    constructor(private readonly sessionRepository: SessionRepository) {}

    async getSession(sessionId: string): Promise<SessionResponse> {
        return this.sessionRepository
            .createQueryBuilder('session')
            .select(sessionFields)
            .where('session.id = :sessionId', { sessionId })
            .innerJoin('session.firstPresenter', 'firstPresenter')
            .leftJoin('session.secondPresenter', 'secondPresenter')
            .getOne();
        // TODO leftJoin voor intendedAudience
    }

    async getSessions(): Promise<GetSessionsResponse> {
        const [sessions, totalCount] = await this.selectSessionColumns(
            this.sessionRepository.createQueryBuilder('session'),
        ).getManyAndCount();

        return {
            meta: {
                count: sessions.length,
                totalCount,
                skip: null,
            },
            data: sessions,
        };
    }

    private selectSessionColumns(
        queryBuilder: SelectQueryBuilder<Session>,
    ): SelectQueryBuilder<Session> {
        return queryBuilder
            .select(sessionFields)
            .innerJoin('session.firstPresenter', 'firstPresenter')
            .leftJoin('session.secondPresenter', 'secondPresenter');
    }
}
