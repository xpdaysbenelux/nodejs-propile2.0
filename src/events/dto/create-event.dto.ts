import {
    IsOptional,
    IsBoolean,
    IsUUID,
    IsEnum,
    IsString,
    IsDateString,
} from 'class-validator';
import { EventTitle } from '../constants';

export class CreateEventRequest {
    @IsBoolean()
    readonly spanRow: boolean;

    @IsUUID()
    readonly programId: string;

    @IsOptional()
    @IsEnum(EventTitle)
    readonly title: EventTitle;

    @IsOptional()
    @IsUUID()
    readonly sessionId: string;

    @IsOptional()
    @IsUUID()
    readonly roomId: string;

    @IsOptional()
    @IsString()
    readonly comment: string;

    @IsDateString()
    readonly startTime: string;

    @IsDateString()
    readonly endTime: string;
}
