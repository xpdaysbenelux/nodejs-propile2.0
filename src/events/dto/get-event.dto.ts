import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { BaseEntityResponse } from '../../_shared/dto';
import { RoomResponse } from '../../rooms/dto/get-room.dto';
import { SessionResponse } from '../../sessions/dto';
import { EventTitle } from '../constants';
import { ProgramResponse } from '../../programs/dto';

export class EventResponse extends BaseEntityResponse {
    readonly spanRow: boolean;
    readonly program: ProgramResponse;
    readonly title: EventTitle;
    readonly session: SessionResponse;
    readonly room: RoomResponse;
    readonly startTime: Date;
    readonly endTime: Date;
    readonly comment: string;
}

export class EventIdParam {
    @ApiProperty({ required: true })
    @IsUUID('4')
    readonly eventId: string;
}
