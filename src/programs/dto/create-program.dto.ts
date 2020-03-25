import { IsString, IsNotEmpty } from 'class-validator';
import { Conference } from '../../database';

export class CreateProgramRequest {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    readonly date: string;

    @IsString()
    @IsNotEmpty()
    readonly startTime: string;

    @IsString()
    @IsNotEmpty()
    readonly endTime: string;

    @IsNotEmpty()
    readonly conference: Conference;
}
