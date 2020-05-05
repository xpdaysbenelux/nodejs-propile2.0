import { Module } from '@nestjs/common';

import { EventController } from './events.controller';
import { EventsService } from './events.service';
import { EventsQueries } from './events.queries';
import { DatabaseModule } from '../database';

@Module({
    imports: [DatabaseModule],
    controllers: [EventController],
    providers: [EventsService, EventsQueries],
})
export class EventsModule {}
