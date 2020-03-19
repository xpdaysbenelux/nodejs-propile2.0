import { IsString, IsDate, ArrayNotEmpty } from 'class-validator';
import { RoomRequest } from './room.dto';

export class CreateConferenceRequest {
    @IsString()
    readonly name: string;

    @IsDate()
    readonly startDate: Date;

    @IsDate()
    readonly endDate: Date;

    @ArrayNotEmpty()
    readonly rooms: RoomRequest[];
}
