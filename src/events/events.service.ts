import { Injectable } from '@nestjs/common';
import { parseISO, isAfter } from 'date-fns';

import {
    EventRepository,
    Event,
    ProgramRepository,
    RoomRepository,
    SessionRepository,
} from '../database';
import { CreateEventRequest } from './dto/create-event.dto';
import { IUserSession } from '../_shared/constants';
import { ProgramNotFoud } from '../programs/errors';
import { RoomNotFound } from '../rooms/errors';
import { SessionNotFound } from '../sessions/errors';
import { EndTimeMustBeLaterThanStartTime, EventNotFound } from './errors';
import { UpdateEventRequest } from './dto';

@Injectable()
export class EventsService {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly programRepository: ProgramRepository,
        private readonly roomRepository: RoomRepository,
        private readonly sessionRepository: SessionRepository,
    ) {}

    async createEvent(
        body: CreateEventRequest,
        user: IUserSession,
    ): Promise<string> {
        const {
            spanRow,
            programId,
            title,
            startTime,
            endTime,
            comment,
            roomId,
            sessionId,
        } = body;
        const eventStartTime = parseISO(startTime);
        const eventEndTime = parseISO(endTime);

        const event = new Event();

        const [program, room, session] = await Promise.all([
            this.programRepository.findOne({
                id: programId,
            }),
            this.roomRepository.findOne({
                id: roomId,
            }),
            this.sessionRepository.findOne({
                id: sessionId,
            }),
        ]);

        if (!program) {
            throw new ProgramNotFoud();
        }
        event.program = program;

        if (roomId) {
            if (!room) {
                throw new RoomNotFound();
            }
            event.room = room;
        } else event.room = null;

        if (sessionId) {
            if (!session) {
                throw new SessionNotFound();
            }
            event.session = session;
        } else event.session = null;

        if (title) event.title = title;
        else event.title = null;

        if (!isAfter(eventEndTime, eventStartTime)) {
            throw new EndTimeMustBeLaterThanStartTime();
        }
        event.startTime = eventStartTime;
        event.endTime = eventEndTime;
        event.spanRow = spanRow;
        event.comment = comment;
        event.createdBy = user.email;
        event.createdAt = new Date();

        await this.eventRepository.save(event);
        return event.id;
    }

    async updateEvent(
        body: UpdateEventRequest,
        eventId: string,
        user: IUserSession,
    ): Promise<string> {
        const {
            spanRow,
            programId,
            title,
            startTime,
            endTime,
            comment,
            roomId,
            sessionId,
        } = body;
        const eventStartTime = parseISO(startTime);
        const eventEndTime = parseISO(endTime);

        const [existingEvent, program, room, session] = await Promise.all([
            this.eventRepository.findOne({ id: eventId }),
            this.programRepository.findOne({
                id: programId,
            }),
            this.roomRepository.findOne({
                id: roomId,
            }),
            this.sessionRepository.findOne({
                id: sessionId,
            }),
        ]);

        if (!existingEvent) throw new EventNotFound();

        if (!program) {
            throw new ProgramNotFoud();
        }
        existingEvent.program = program;

        if (roomId) {
            if (!room) {
                throw new RoomNotFound();
            }
            existingEvent.room = room;
        } else existingEvent.room = null;

        if (sessionId) {
            if (!session) {
                throw new SessionNotFound();
            }
            existingEvent.session = session;
        } else existingEvent.session = null;

        if (title) existingEvent.title = title;
        else existingEvent.title = null;

        if (!isAfter(eventEndTime, eventStartTime)) {
            throw new EndTimeMustBeLaterThanStartTime();
        }
        existingEvent.startTime = eventStartTime;
        existingEvent.endTime = eventEndTime;
        existingEvent.spanRow = spanRow;
        existingEvent.comment = comment;
        existingEvent.createdBy = user.email;
        existingEvent.createdAt = new Date();

        await this.eventRepository.save(existingEvent);
        return existingEvent.id;
    }

    async deleteEvent(eventId: string): Promise<string> {
        const existingEvent = await this.eventRepository.findOne({
            where: { id: eventId },
        });
        if (!existingEvent) {
            throw new EventNotFound();
        }

        await this.eventRepository.delete(eventId);
        return eventId;
    }
}
