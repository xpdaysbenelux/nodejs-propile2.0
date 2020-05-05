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
import { SessionNotFound } from 'src/sessions/errors';
import { EndTimeMustBeLaterThanStartTime } from './errors';

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
        console.log('service', body);
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

        const program = await this.programRepository.findOne({
            id: programId,
        });
        if (!program) {
            throw new ProgramNotFoud();
        }
        event.program = program;

        if (roomId) {
            const room = await this.roomRepository.findOne({
                id: roomId,
            });
            if (!room) {
                throw new RoomNotFound();
            }
            event.room = room;
        } else event.room = null;

        if (sessionId) {
            const session = await this.sessionRepository.findOne({
                id: sessionId,
            });
            if (!session) {
                throw new SessionNotFound();
            }
            event.session = session;
        } else event.session = null;

        if (title) event.title = title;
        else event.title = null;

        if (isAfter(eventEndTime, eventStartTime)) {
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
}
