import { BadRequestException, NotFoundException } from '@nestjs/common';

export class EndTimeMustBeLaterThanStartTime extends BadRequestException {
    constructor() {
        super(
            'The end time of an event must be later than the start time!',
            'END_TIME_LATER_THEN_START_TIME',
        );
    }
}

export class EventNotFound extends NotFoundException {
    constructor() {
        super('The event was not found.', 'EVENT_NOT_FOUND');
    }
}
