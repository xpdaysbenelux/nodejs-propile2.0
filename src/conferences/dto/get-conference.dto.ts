import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityResponse } from '../../_shared/dto';
import { RoomResponse } from '../../rooms/dto/get-room.dto';

export class ConferenceResponse extends BaseEntityResponse {
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly rooms: RoomResponse[];
}
