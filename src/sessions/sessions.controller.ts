import {
    Controller,
    Post,
    Body,
    Param,
    UseGuards,
    Get,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SessionsService } from './sessions.service';
import {
    CreateSessionRequest,
    UpdateSessionRequest,
    SessionIdParam,
    SessionResponse,
} from './dto';
import {
    Origin,
    RequiredPermissions,
    UserSession,
} from '../_shared/decorators/';
import { RequiredPermissionsGuard } from '../_shared/guards';
import { IUserSession } from '../_shared/constants';
import { SessionsQueries } from './sessions.queries';
import { UserIdParam } from '../users/dto';
import { GetSessionsResponse } from './dto/get-sessions.dto';

@Controller('sessions')
@ApiTags('sessions')
export class SessionsController {
    constructor(
        private readonly sessionService: SessionsService,
        private readonly sessionQueries: SessionsQueries,
    ) {}

    @RequiredPermissions({ sessions: { view: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get(':sessionId')
    getSession(@Param() params: SessionIdParam): Promise<SessionResponse> {
        return this.sessionQueries.getSession(params.sessionId);
    }

    @RequiredPermissions({ sessions: { view: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get()
    getSessions(): Promise<GetSessionsResponse> {
        return this.sessionQueries.getSessions();
    }

    @Post()
    async createSession(
        @Body() body: CreateSessionRequest,
        @Origin() origin: string,
    ): Promise<SessionResponse> {
        const newSessionId = await this.sessionService.createSession(
            body,
            origin,
        );
        return this.sessionQueries.getSession(newSessionId);
    }

    @RequiredPermissions({ sessions: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Put(':sessionId')
    async updateSession(
        @Body() body: UpdateSessionRequest,
        @Param() params: SessionIdParam,
        @UserSession() userSession: IUserSession,
    ): Promise<SessionResponse> {
        const sessionId = await this.sessionService.updateSession(
            body,
            params.sessionId,
            userSession,
        );
        return this.sessionQueries.getSession(sessionId);
    }
}
