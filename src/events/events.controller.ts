import {
    Body,
    UseGuards,
    Controller,
    Post,
    Get,
    Param,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EventsService } from './events.service';
import { EventsQueries } from './events.queries';
import { UserSession, RequiredPermissions } from '../_shared/decorators';
import { IUserSession } from '../_shared/constants';
import {
    AuthenticatedGuard,
    RequiredPermissionsGuard,
} from '../_shared/guards';
import { CreateEventRequest, EventResponse, EventIdParam } from './dto';
import { ProgramIdParam } from '../programs/dto';

@UseGuards(AuthenticatedGuard)
@Controller('/programs/:programId/events')
@ApiTags('events')
export class EventController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly eventsQueries: EventsQueries,
    ) {}

    @RequiredPermissions({ programs: { view: true, edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get(':eventId')
    getEvent(@Param() params: EventIdParam): Promise<EventResponse> {
        return this.eventsQueries.getEvent(params.eventId);
    }

    @RequiredPermissions({ programs: { view: true, edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get()
    getEvents(@Param() params: ProgramIdParam): Promise<EventResponse[]> {
        console.log('events', params.programId);
        return this.eventsQueries.getEvents(params.programId);
    }

    @RequiredPermissions({ programs: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Post()
    async createEvent(
        @Body() body: CreateEventRequest,
        @UserSession() session: IUserSession,
    ): Promise<EventResponse> {
        const eventId = await this.eventsService.createEvent(body, session);
        return this.eventsQueries.getEvent(eventId);
    }

    @RequiredPermissions({ programs: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Put(':eventId')
    async updateEvent(
        @Body() body: CreateEventRequest,
        @Param() params: EventIdParam,
        @UserSession() session: IUserSession,
    ): Promise<EventResponse> {
        const eventId = await this.eventsService.updateEvent(
            body,
            params.eventId,
            session,
        );
        return this.eventsQueries.getEvent(eventId);
    }
}
