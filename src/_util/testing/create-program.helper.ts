import { DeepPartial } from 'typeorm';
import { mergeDeepLeft } from 'ramda';
import * as faker from 'faker';

import { Program } from '../../database';
import { createFullTestConference } from './create-conference.helper';

export function createTestProgram(overrides?: DeepPartial<Program>): Program {
    const program = new Program();

    program.title = faker.lorem.sentence();
    program.date = faker.date.future();
    program.startTime = faker.date.future();
    program.endTime = faker.date.future();
    program.conference = createFullTestConference();

    return mergeDeepLeft(overrides, program) as Program;
}
