import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

import { EventRepository, Event } from '../database';
import { EventResponse } from './dto';

const eventFields = [
    'event.id',
    'event.title',
    'event.spanRow',
    'event.comment',
    'event.startTime',
    'event.endTime',
    'program.id',
    'program.title',
    'program.date',
    'program.startTime',
    'program.endTime',
    'room.id',
    'room.name',
    'room.maxParticipants',
    'session.id',
    'session.title',
    'session.duration',
    'session.maxParticipants',
];

@Injectable()
export class EventsQueries {
    constructor(private readonly eventRepository: EventRepository) {}

    async getEvent(eventId: string): Promise<EventResponse> {
        return this.eventRepository
            .createQueryBuilder('event')
            .select(eventFields)
            .where('event.id = :eventId', { eventId })
            .innerJoin('event.program', 'program')
            .leftJoin('event.room', 'room')
            .leftJoin('event.session', 'session')
            .getOne();
    }

    async getEvents(programId: string): Promise<EventResponse[]> {
        /* const events = this.eventRepository
            .createQueryBuilder('event')
            .select(eventFields)
            .where('event.program.id = :programId', { programId })
            .innerJoin('event.program', 'program')
            .leftJoin('event.room', 'room')
            .leftJoin('event.session', 'session')
            .getManyAndCount(); */

        const [events] = await this.selectEventsColumns(
            this.eventRepository.createQueryBuilder('event'),
        )
            .where('event.program.id = :programId', { programId })
            .getManyAndCount();
        return events;
    }

    private selectEventsColumns(
        queryBuilder: SelectQueryBuilder<Event>,
    ): SelectQueryBuilder<Event> {
        return queryBuilder
            .select(eventFields)
            .innerJoin('event.program', 'program')
            .leftJoin('event.room', 'room')
            .leftJoin('event.session', 'session');
    }
}
