import { BadRequestException } from '@nestjs/common';

export class ProgramNameAlreadyInUse extends BadRequestException {
    constructor() {
        super(
            'A program with this name already exists.',
            'PROGRAM_NAME_ALREADY_IN_USE',
        );
    }
}

export class ProgramDateMustBeBetweenConferenceDates extends BadRequestException {
    constructor() {
        super(
            "The program it's date must be one of or between the conference dates.",
            'PROGRAM_DATE_MUST_BE_BETWEEN_CONFERENCE_DATES',
        );
    }
}
