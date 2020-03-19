import { IsString, IsDate, ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { RoomRequest } from './room.dto';

export class CreateConferenceRequest {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsDate()
    @IsNotEmpty()
    readonly startDate: Date;

    @IsDate()
    @IsNotEmpty()
    readonly endDate: Date;

    @ArrayNotEmpty()
    readonly rooms: RoomRequest[];
}
