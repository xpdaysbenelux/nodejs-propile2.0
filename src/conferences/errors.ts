import { BadRequestException } from '@nestjs/common';

export class ConferenceNameAlreadyInUse extends BadRequestException {
    constructor() {
        super(
            'A conference with this name already exists.',
            'CONFERENCE_NAME_ALREADY_IN_USE',
        );
    }
}
