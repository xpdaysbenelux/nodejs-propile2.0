import { DeepPartial } from 'typeorm';
import * as faker from 'faker';

import { Session } from '../../database/entities';
import { createTestUser } from './create-user.helper';
import { mergeDeepLeft } from 'ramda';
import {
    SessionState,
    SessionType,
    SessionTopic,
    SessionDuration,
    SessionExpierenceLevel,
} from '../../sessions/constants';

export function createShortTestSession(
    overrides?: DeepPartial<Session>,
): Session {
    const session = new Session();

    session.title = faker.lorem.sentence();
    session.subTitle = faker.lorem.sentence();
    session.firstPresenter = createTestUser();
    session.secondPresenter = createTestUser();
    session.xpFactor = Math.round(faker.random.number(10));
    session.description = faker.lorem.sentences(10);

    return mergeDeepLeft(overrides, session) as Session;
}

export function createFullTestSession(
    overrides?: DeepPartial<Session>,
): Session {
    const session = createShortTestSession(overrides);

    session.sessionState = faker.random.arrayElement(
        Object.values(SessionState),
    );
    session.shortDescription = faker.lorem.sentences(3);
    session.goal = faker.lorem.sentences(3);
    session.type = faker.random.arrayElement(Object.values(SessionType));
    session.topic = faker.random.arrayElement(Object.values(SessionTopic));
    session.maxParticipants = Math.round(faker.random.number(50));
    session.duration = faker.random.arrayElement(
        Object.values(SessionDuration),
    );
    session.laptopsRequired = faker.random.boolean();
    session.otherLimitations = faker.lorem.sentences(2);
    session.intendedAudience = [];
    session.roomSetup = faker.lorem.sentences(2);
    session.neededMaterials = faker.lorem.sentences(2);
    session.expierenceLevel = faker.random.arrayElement(
        Object.values(SessionExpierenceLevel),
    );
    session.outline = faker.lorem.sentences(2);
    session.materialDescription = faker.lorem.sentences(3);
    session.materialUrl = faker.lorem.sentences(2);

    return mergeDeepLeft(overrides, session) as Session;
}
