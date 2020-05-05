import { BadRequestException, NotFoundException } from '@nestjs/common';

export class EndTimeMustBeLaterThanStartTime extends BadRequestException {
    constructor() {
        super(
            'The end time of an event must be later than the start time!',
            'END_TIME_LATER_THEN_START_TIME',
        );
    }
}
