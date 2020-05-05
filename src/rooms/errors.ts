import { NotFoundException } from '@nestjs/common';

export class RoomNotFound extends NotFoundException {
    constructor() {
        super('The room was not found.', 'ROOM_NOT_FOUND');
    }
}
