import { DeepPartial } from 'typeorm';
import { mergeDeepLeft } from 'ramda';
import * as faker from 'faker';

import { Conference } from '../../database';
import { createTestRoom } from './create-room.helper';

export function createTestConference(
    overrides?: DeepPartial<Conference>,
): Conference {
    const conference = new Conference();

    conference.name = faker.lorem.sentence();
    conference.startDate = faker.date.future();
    conference.endDate = faker.date.future();
    conference.rooms = [createTestRoom(), createTestRoom()];

    return mergeDeepLeft(overrides, conference) as Conference;
}
