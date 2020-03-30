import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

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

    @IsString()
    @IsNotEmpty()
    readonly conferenceId: string;
}
