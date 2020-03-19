import { IsString, IsDate, ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { RoomRequest } from './room.dto';

export class CreateConferenceRequest {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly startDate: string;

    @IsString()
    @IsNotEmpty()
    readonly endDate: string;

    @ArrayNotEmpty()
    readonly rooms: RoomRequest[];
}
