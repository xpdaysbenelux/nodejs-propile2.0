import { Module } from '@nestjs/common';

import { ProgramController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { ProgramsQueries } from './programs.queries';
import { DatabaseModule } from '../database';

@Module({
    imports: [DatabaseModule],
    controllers: [ProgramController],
    providers: [ProgramsService, ProgramsQueries],
})
export class ProgramsModule {}
