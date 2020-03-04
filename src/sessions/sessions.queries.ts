import { SessionRepository, Session } from '../database';
import { SessionResponse } from './dto';
import { Injectable } from '@nestjs/common';
import { GetSessionsResponse } from './dto/get-sessions.dto';

const sessionDetailFields = [
    'session.id',
    'session.createdAt',
    'session.title',
    'session.subTitle',
    'session.xpFactor',
    'session.description',
    'session.shortDescription',
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
    'firstPresenter.email',
    'secondPresenter.email',
];

@Injectable()
export class SessionsQueries {
    constructor(private readonly sessionRepository: SessionRepository) {}

    async getSessionsByUser(userId: string): Promise<GetSessionsResponse> {
        const [sessions, totalCount] = await this.sessionRepository
            .createQueryBuilder('session')
            .select(sessionDetailFields)
            .where(
                'firstPresenter.id = :userId OR secondPresenter.id = :userId',
                { userId },
            )
            .innerJoin('session.firstPresenter', 'firstPresenter')
            .leftJoin('session.secondPresenter', 'secondPresenter')
            .getManyAndCount();

        return {
            meta: {
                count: sessions.length,
                totalCount,
                skip: null,
            },
            data: sessions,
        };
    }

    async getSession(sessionId: string): Promise<SessionResponse> {
        return this.sessionRepository
            .createQueryBuilder('session')
            .select(sessionDetailFields)
            .where('session.id = :sessionId', { sessionId })
            .innerJoin('session.firstPresenter', 'firstPresenter')
            .leftJoin('session.secondPresenter', 'secondPresenter')
            .getOne();
        // leftJoin voor intendedAudience
    }
}
