import { Injectable } from '@nestjs/common';

import { RoomRepository, Room } from '../database';

@Injectable()
export class RoomsService {
    constructor(private readonly roomRepository: RoomRepository) {}

    async deleteRoomsFromConference(conferenceId: string): Promise<string> {
        const rooms = await this.roomRepository.find({
            where: {
                id: conferenceId || null,
            },
        });

        console.log('delete rooms', rooms);

        await this.roomRepository.remove(rooms);

        return conferenceId;
    }
}
