import { BadRequestException } from '@nestjs/common';

export class SessionTitleAlreadyInUse extends BadRequestException {
    constructor() {
        super(
            'A session with this title already exists',
            'SESSION_TITLE_ALREADY_IN_USE',
        );
    }
}
