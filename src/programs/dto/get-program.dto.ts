import { IsUUID } from 'class-validator';

import { BaseEntityResponse } from '../../_shared/dto';
import { ConferenceResponse } from '../../conferences/dto';
import { RoomResponse } from '../../rooms/dto/get-room.dto';

export class ProgramResponse extends BaseEntityResponse {
    readonly title: string;
    readonly date: Date;
    readonly startTime: Date;
    readonly endTime: Date;
    readonly conference: ConferenceResponse;
    readonly events?: EventResponse[];
}

class EventResponse {
    readonly title: string;
    readonly spanRow: boolean;
    readonly startTime: Date;
    readonly endTime: Date;
    readonly room: RoomResponse;
}

export class ProgramIdParam {
    @IsUUID('4')
    readonly programId: string;
}
