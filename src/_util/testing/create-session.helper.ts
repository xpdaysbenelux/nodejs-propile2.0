import { DeepPartial } from 'typeorm';
import * as faker from 'faker';

import { Session } from '../../database/entities';
import { createTestUser } from './create-user.helper';
import { mergeDeepLeft } from 'ramda';

export function createTestSession(overrides?: DeepPartial<Session>): Session {
    const session = new Session();

    session.title = faker.lorem.sentence();
    session.subTitle = faker.lorem.sentence();
    session.firstPresenter = createTestUser();
    session.secondPresenter = createTestUser();
    session.xpFactor = Math.round(faker.random.number(10));
    session.description = faker.lorem.sentences(15);

    return mergeDeepLeft(overrides, session) as Session;
}
