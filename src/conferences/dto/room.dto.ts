import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class RoomRequest {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsInt()
    @IsNotEmpty()
    readonly maxParticipants: number;

    @IsString()
    @IsOptional()
    readonly location?: string;
}
