import { Injectable } from '@nestjs/common';
import { parseISO, isWithinInterval, isSameDay } from 'date-fns';

import { EventRepository, Event } from '../database';
import { CreateEventRequest } from './dto/create-event.dto';
import { IUserSession } from '../_shared/constants';

@Injectable()
export class EventsService {
    constructor(private readonly eventRepository: EventRepository) {}

    async createEvent(
        body: CreateEventRequest,
        session: IUserSession,
    ): Promise<string> {
        return '';
    }
}
