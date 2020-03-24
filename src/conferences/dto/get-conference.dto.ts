import { IsUUID } from 'class-validator';

import { BaseEntityResponse } from '../../_shared/dto';

export class ConferenceResponse extends BaseEntityResponse {
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly rooms: RoomResponse[];
}

class RoomResponse {
    readonly id: string;
    readonly name: string;
    readonly maxParticipants: number;
}

export class ConferenceIdParam {
    @IsUUID('4')
    readonly conferenceId: string;
}
