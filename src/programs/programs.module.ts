import { Module } from '@nestjs/common';

import { ProgramController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { ProgramQueries } from './programs.queries';
import { DatabaseModule } from '../database';

@Module({
    imports: [DatabaseModule],
    controllers: [ProgramController],
    providers: [ProgramsService, ProgramQueries],
})
export class ProgramsModule {}
