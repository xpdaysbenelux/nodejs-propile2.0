import { DeepPartial } from 'typeorm';
import { mergeDeepLeft } from 'ramda';
import * as faker from 'faker';

import { Event } from '../../database';
import { createTestProgram } from './create-program.helper';
import { createShortTestSession } from './create-session.helper';
import { createTestRoom } from './create-room.helper';
import { EventTitle } from '../../events/constants';

export function createTestEvent(overrides?: DeepPartial<Event>): Event {
    const event = new Event();

    event.spanRow = false;
    event.title = null;
    event.program = null;
    event.startTime = faker.date.future();
    event.endTime = faker.date.future();
    event.session = null;
    event.room = null;
    event.comment = null;

    return mergeDeepLeft(overrides, event) as Event;
}
