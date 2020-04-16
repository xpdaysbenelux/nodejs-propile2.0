import { IsString, IsNotEmpty, IsDateString, IsUUID } from 'class-validator';

export class UpdateProgramRequest {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsDateString()
    readonly date: string;

    @IsDateString()
    readonly startTime: string;

    @IsDateString()
    readonly endTime: string;

    @IsUUID()
    readonly conferenceId: string;
}
