import { Controller, UseGuards, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RequiredPermissions, UserSession } from '../_shared/decorators';
import {
    RequiredPermissionsGuard,
    AuthenticatedGuard,
} from '../_shared/guards';
import { ConferencesService } from './conferences.service';
import {
    CreateConferenceRequest,
    ConferenceResponse,
    ConferenceIdParam,
} from './dto';
import { IUserSession } from '../_shared/constants';
import { ConferencesQueries } from './conferences.queries';

@UseGuards(AuthenticatedGuard)
@Controller('conferences')
@ApiTags('conferences')
export class ConferencesController {
    constructor(
        private readonly conferencesService: ConferencesService,
        private readonly conferenceQueries: ConferencesQueries,
    ) {}

    @RequiredPermissions({ conferences: { view: true, edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get(':conferenceId')
    getConference(
        @Param() params: ConferenceIdParam,
    ): Promise<ConferenceResponse> {
        return this.conferenceQueries.getConference(params.conferenceId);
    }

    @RequiredPermissions({ conferences: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Post()
    async createConference(
        @Body() body: CreateConferenceRequest,
        @UserSession() session: IUserSession,
    ): Promise<ConferenceResponse> {
        const conferenceId = await this.conferencesService.createConference(
            body,
            session,
        );
        return this.conferenceQueries.getConference(conferenceId);
    }
}
