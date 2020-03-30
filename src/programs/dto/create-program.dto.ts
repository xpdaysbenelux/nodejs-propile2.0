import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { Conference } from '../../database';

export class CreateProgramRequest {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDateString()
    @IsNotEmpty()
    readonly date: string;

    @IsDateString()
    @IsNotEmpty()
    readonly startTime: string;

    @IsDateString()
    @IsNotEmpty()
    readonly endTime: string;

    @IsNotEmpty()
    readonly conferenceId: string;
}
