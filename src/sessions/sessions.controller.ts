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

    /**
     * Gets the sessions from a specific user.
     * @param userId
     */
    @RequiredPermissions({ sessions: { view: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get(':userId')
    getSessionsOfUser(
        @Param() params: UserIdParam,
    ): Promise<GetSessionsResponse> {
        return this.sessionQueries.getSessionsByUser(params.userId);
    }

    @RequiredPermissions({ sessions: { view: true, edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get(':sessionId')
    getSessionById(
        @Param() params: SessionIdParam,
        @UserSession() session: IUserSession,
    ): Promise<SessionResponse> {
        return this.sessionQueries.getSession(params.sessionId);
    }

    @Post()
    async createSession(
        @Body() body: CreateSessionRequest,
        @Origin() origin: string,
    ): Promise<void> {
        await this.sessionService.createSession(body, origin);
    }

    @RequiredPermissions({ sessions: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Put(':sessionId')
    async updateSession(
        @Body() body: UpdateSessionRequest,
        @Param() params: SessionIdParam,
        @UserSession() userSession: IUserSession,
    ): Promise<string> {
        const sessionId = await this.sessionService.updateSession(
            body,
            params.sessionId,
            userSession,
        );
        return sessionId;
    }
}
