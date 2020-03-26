import { IsUUID } from 'class-validator';

import { BaseEntityResponse } from '../../_shared/dto';
import { RoomResponse } from '../../rooms/dto/get-room.dto';

export class ConferenceResponse extends BaseEntityResponse {
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly rooms: RoomResponse[];
}

export class ConferenceIdParam {
    @IsUUID('4')
    readonly conferenceId: string;
}
