import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConferenceIdParam {
    @ApiProperty({ required: true })
    @IsUUID('4')
    readonly conferenceId: string;
}
