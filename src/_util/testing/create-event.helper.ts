import { DeepPartial } from 'typeorm';
import { mergeDeepLeft } from 'ramda';
import * as faker from 'faker';

import { Event } from '../../database';
import { createTestProgram } from './create-program.helper';
import { createShortTestSession } from './create-session.helper';
import { createTestRoom } from './create-room.helper';
import { EventTitle } from '../../events/constants';

export function createTestTitleEvent(overrides?: DeepPartial<Event>): Event {
    const event = new Event();

    event.spanRow = true;
    event.title = faker.random.arrayElement(Object.values(EventTitle));
    event.program = createTestProgram();
    event.startTime = faker.date.future();
    event.endTime = faker.date.future();
    event.session = null;
    event.room = null;
    event.comment = null;

    return mergeDeepLeft(overrides, event) as Event;
}

export function createTestSessionEvent(overrides?: DeepPartial<Event>): Event {
    const event = new Event();

    event.spanRow = false;
    event.title = null;
    event.program = createTestProgram();
    event.startTime = faker.date.future();
    event.endTime = faker.date.future();
    event.session = createShortTestSession();
    event.room = createTestRoom();
    event.comment = null;

    return mergeDeepLeft(overrides, event) as Event;
}
