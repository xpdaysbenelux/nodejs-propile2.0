import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SessionsService } from './sessions.service';
import { CreateSessionRequest } from './dto';
import { Origin } from '../_shared/decorators';

@Controller('sessions')
@ApiTags('sessions')
export class SessionsController {
    constructor(private readonly sessionService: SessionsService) {}

    @Post()
    async createSession(
        @Body() body: CreateSessionRequest,
        @Origin() origin: string,
    ): Promise<void> {
        await this.sessionService.createSession(body, origin);
    }
}
