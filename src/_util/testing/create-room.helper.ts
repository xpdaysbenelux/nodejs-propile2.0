import { DeepPartial } from 'typeorm';
import { mergeDeepLeft } from 'ramda';
import * as faker from 'faker';

import { Room } from '../../database';

export function createTestRoom(overrides?: DeepPartial<Room>): Room {
    const room = new Room();

    room.name = faker.lorem.word();
    room.maxParticipants = Math.round(faker.random.number(50));
    room.location = faker.lorem.sentences(2);

    return mergeDeepLeft(overrides, room) as Room;
}
