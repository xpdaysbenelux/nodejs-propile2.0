import {
    mock,
    reset,
    instance,
    objectContaining,
    when,
    verify,
} from 'ts-mockito';
import { TestingModule, Test } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { parseISO } from 'date-fns';
import * as faker from 'faker';

import {
    EventRepository,
    ProgramRepository,
    SessionRepository,
    RoomRepository,
} from '../database';
import { EventsService } from './events.service';
import {
    createTestUserSession,
    createTestProgram,
    createTestRoom,
    createShortTestSession,
} from '../_util/testing';
import { ProgramNotFoud } from '../programs/errors';
import { RoomNotFound } from '../rooms/errors';
import { SessionNotFound } from '../sessions/errors';
import { EndTimeMustBeLaterThanStartTime } from './errors';
import { EventTitle } from './constants';

describe('EventsService', () => {
    let eventsService: EventsService;

    const eventRepository = mock(EventRepository);
    const programRepository = mock(ProgramRepository);
    const sessionRepository = mock(SessionRepository);
    const roomRepository = mock(RoomRepository);

    const titleBody = {
        spanRow: true,
        title: EventTitle.CoffeeBreak,
        startTime: '2020-04-02T10:00:00',
        endTime: '2020-04-02T10:30:00',
        comment: faker.lorem.words(5),
        programId: faker.random.uuid(),
        sessionId: null,
        roomId: null,
    };
    const sessionBody = {
        spanRow: true,
        title: null,
        startTime: '2020-04-02T10:00:00',
        endTime: '2020-04-02T10:30:00',
        comment: null,
        programId: faker.random.uuid(),
        sessionId: faker.random.uuid(),
        roomId: faker.random.uuid(),
    };
    const currentUser = createTestUserSession();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getCustomRepositoryToken(EventRepository),
                    useValue: instance(eventRepository),
                },
                {
                    provide: getCustomRepositoryToken(ProgramRepository),
                    useValue: instance(programRepository),
                },
                {
                    provide: getCustomRepositoryToken(SessionRepository),
                    useValue: instance(sessionRepository),
                },
                {
                    provide: getCustomRepositoryToken(RoomRepository),
                    useValue: instance(roomRepository),
                },
            ],
        }).compile();

        eventsService = module.get(EventsService);
    });

    afterEach(() => {
        reset(eventRepository);
        reset(programRepository);
    });

    describe('createEvent', () => {
        it('should create an event correctly #1', async () => {
            const selectedProgram = createTestProgram({
                id: titleBody.programId,
            });

            when(
                programRepository.findOne(
                    objectContaining({ id: titleBody.programId }),
                ),
            ).thenResolve(selectedProgram);

            await eventsService.createEvent(titleBody, currentUser);
            verify(
                eventRepository.save(
                    objectContaining({
                        title: titleBody.title,
                        spanRow: titleBody.spanRow,
                        program: selectedProgram,
                        startTime: parseISO(titleBody.startTime),
                        endTime: parseISO(titleBody.endTime),
                        comment: titleBody.comment,
                        createdBy: currentUser.email,
                    }),
                ),
            ).once();
        });

        it('should create an event correctly #2', async () => {
            const selectedProgram = createTestProgram({
                id: titleBody.programId,
            });
            const selectedRoom = createTestRoom({ id: sessionBody.roomId });
            const selectedSession = createShortTestSession({
                id: sessionBody.sessionId,
            });

            when(
                programRepository.findOne(
                    objectContaining({ id: sessionBody.programId }),
                ),
            ).thenResolve(selectedProgram);
            when(
                roomRepository.findOne(
                    objectContaining({ id: sessionBody.roomId }),
                ),
            ).thenResolve(selectedRoom);
            when(
                sessionRepository.findOne(
                    objectContaining({ id: sessionBody.sessionId }),
                ),
            ).thenResolve(selectedSession);

            await eventsService.createEvent(sessionBody, currentUser);
            verify(
                eventRepository.save(
                    objectContaining({
                        program: selectedProgram,
                        spanRow: sessionBody.spanRow,
                        startTime: parseISO(sessionBody.startTime),
                        endTime: parseISO(sessionBody.endTime),
                        room: selectedRoom,
                        session: selectedSession,
                        comment: sessionBody.comment,
                        createdBy: currentUser.email,
                    }),
                ),
            ).once();
        });

        it('should throw an error when the program is not found', async () => {
            when(
                programRepository.findOne(
                    objectContaining({ id: titleBody.programId }),
                ),
            ).thenResolve(null);

            await expect(
                eventsService.createEvent(titleBody, currentUser),
            ).rejects.toThrowError(ProgramNotFoud);
        });

        it('should throw an error when the room is not found', async () => {
            when(
                programRepository.findOne(
                    objectContaining({ id: sessionBody.programId }),
                ),
            ).thenResolve(createTestProgram({ id: sessionBody.programId }));
            when(
                roomRepository.findOne(
                    objectContaining({ id: sessionBody.roomId }),
                ),
            ).thenResolve(null);

            await expect(
                eventsService.createEvent(sessionBody, currentUser),
            ).rejects.toThrowError(RoomNotFound);
        });

        it('should throw an error when the session is not found', async () => {
            when(
                programRepository.findOne(
                    objectContaining({ id: sessionBody.programId }),
                ),
            ).thenResolve(createTestProgram({ id: sessionBody.programId }));
            when(
                roomRepository.findOne(
                    objectContaining({ id: sessionBody.roomId }),
                ),
            ).thenResolve(createTestRoom({ id: sessionBody.roomId }));
            when(
                sessionRepository.findOne(
                    objectContaining({ id: sessionBody.sessionId }),
                ),
            ).thenResolve(null);

            await expect(
                eventsService.createEvent(sessionBody, currentUser),
            ).rejects.toThrowError(SessionNotFound);
        });

        it('should throw an error when the start time is later than the end time', async () => {
            when(
                programRepository.findOne(
                    objectContaining({ id: sessionBody.programId }),
                ),
            ).thenResolve(createTestProgram({ id: sessionBody.programId }));
            when(
                roomRepository.findOne(
                    objectContaining({ id: sessionBody.roomId }),
                ),
            ).thenResolve(createTestRoom({ id: sessionBody.roomId }));
            when(
                sessionRepository.findOne(
                    objectContaining({ id: sessionBody.sessionId }),
                ),
            ).thenResolve(
                createShortTestSession({ id: sessionBody.sessionId }),
            );

            const createBody = {
                spanRow: true,
                title: null,
                startTime: '2020-04-02T11:00:00',
                endTime: '2020-04-02T10:30:00',
                comment: null,
                programId: sessionBody.programId,
                sessionId: sessionBody.sessionId,
                roomId: sessionBody.roomId,
            };

            await expect(
                eventsService.createEvent(createBody, currentUser),
            ).rejects.toThrowError(EndTimeMustBeLaterThanStartTime);
        });
    });
});