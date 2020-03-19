import { Module } from '@nestjs/common';

import { ConferencesController } from './conferences.controller';
import { ConferencesService } from './conferences.service';
import { ConferencesQueries } from './conferences.queries';
import { DatabaseModule } from '../database';

@Module({
    imports: [DatabaseModule],
    controllers: [ConferencesController],
    providers: [ConferencesService, ConferencesQueries],
})
export class ConferencesModule {}
