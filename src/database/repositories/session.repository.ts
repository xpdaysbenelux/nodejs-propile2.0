import { EntityRepository, Repository } from 'typeorm';

import { Session } from '../entities/session.entity';

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
    // Todo test
    findSessionsByPresenter(presenterId: string): Promise<Session[]> {
        return this.find({
            where: [
                { firstPresenter: { id: presenterId } },
                { secondPresenter: { id: presenterId } },
            ],
        });
    }
}
