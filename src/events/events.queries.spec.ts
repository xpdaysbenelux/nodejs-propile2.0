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

            const { startTime, endTime, ...withoutDates } = result;
            expect(withoutDates).toMatchSnapshot();
        });

        it('should return nothing if the requested event does not exist', async () => {
            const result = await eventsQueries.getEvent(faker.random.uuid());

            expect(result).toMatchSnapshot();
        });
    });
});
