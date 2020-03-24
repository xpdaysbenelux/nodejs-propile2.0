import { BadRequestException } from '@nestjs/common';

export class ConferenceNameAlreadyInUse extends BadRequestException {
    constructor() {
        super(
            'A conference with this name already exists.',
            'CONFERENCE_NAME_ALREADY_IN_USE',
        );
    }
}

export class ConferenceMustHaveAtLeastTwoRooms extends BadRequestException {
    constructor() {
        super(
            'A conference must have at least two rooms.',
            'CONFERENCE_MUST_HAVE_AT_LEAST_TWO_ROOMS',
        );
    }
}
