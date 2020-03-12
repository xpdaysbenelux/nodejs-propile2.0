import {
    BadRequestException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';

export class SessionNotFound extends NotFoundException {
    constructor() {
        super('The session was not found.', 'SESSION_NOT_FOUND');
    }
}

export class SessionTitleAlreadyInUse extends BadRequestException {
    constructor() {
        super(
            'A session with this title already exists.',
            'SESSION_TITLE_ALREADY_IN_USE',
        );
    }
}

export class SessionPresenterEmailsMustDiffer extends BadRequestException {
    constructor() {
        super(
            'The email addresses of the presenters cannot be the same.',
            'SESSION_PRESENTERS_EMAILS_MUST_DIFFER',
        );
    }
}

export class SessionEditNotAllowed extends ForbiddenException {
    constructor() {
        super(
            "You don't have the rights to edit this session.",
            'SESSION_EDIT_NOT_ALLOWED',
        );
    }
}
