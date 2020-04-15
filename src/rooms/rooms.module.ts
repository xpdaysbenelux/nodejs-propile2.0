import { Module } from '@nestjs/common';

import { RoomsService } from './rooms.service';
import { DatabaseModule } from '../database';

@Module({
    imports: [DatabaseModule],
    providers: [RoomsService],
})
export class RoomsModule {}
