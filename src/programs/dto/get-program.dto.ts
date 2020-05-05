import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityResponse } from '../../_shared/dto';
import { ConferenceResponse } from '../../conferences/dto';

export class ProgramResponse extends BaseEntityResponse {
    readonly title: string;
    readonly date: Date;
    readonly startTime: Date;
    readonly endTime: Date;
    readonly conference: ConferenceResponse;
}

export class ProgramIdParam {
    @ApiProperty({ required: true })
    @IsUUID('4')
    readonly programId: string;
}
