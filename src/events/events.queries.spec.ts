import { Test } from '@nestjs/testing';
import * as faker from 'faker';

import { EventRepository, DatabaseModule } from '../database';
import { EventsQueries } from './events.queries';

describe('EventsQueries', () => {
    let eventRepository: EventRepository;
    let eventsQueries: EventsQueries;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [EventsQueries],
        }).compile();

        eventsQueries = module.get(EventsQueries);
        eventRepository = module.get(EventRepository);
    });

    afterAll(() => {
        eventRepository.manager.connection.close();
    });

    describe('getEvent', () => {
        it('should return the requested event correctly', async () => {
            const result = await eventsQueries.getEvent(
                '6ee1e9e0-1b79-49dd-b326-09e992430c31',
            );

            const { startTime, endTime, program, ...withoutDates } = result;
            expect(withoutDates).toMatchSnapshot();
        });

        it('should return nothing if the requested event does not exist', async () => {
            const result = await eventsQueries.getEvent(faker.random.uuid());

            expect(result).toMatchSnapshot();
        });
    });

    describe('getEvents', () => {
        it('should return the requested events by program id', async () => {
            const result = await eventsQueries.getEvents(
                '3185e221-73ca-4b5a-93a9-1cc2d0b5df76',
            );

            const withoutDatesList = result.map(entry => {
                const { startTime, endTime, program, ...withoutDates } = entry;
                return withoutDates;
            });

            expect(withoutDatesList).toMatchSnapshot();
        });

        it('should return nothing if there are no events found for the given program id', async () => {
            const result = await eventsQueries.getEvents(faker.random.uuid());

            expect(result).toMatchSnapshot();
        });
    });
});
