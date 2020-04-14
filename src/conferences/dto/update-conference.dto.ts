import { IsUUID, IsString, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoomRequest } from '.';

export class UpdateConferenceRequest {
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
