import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    UserRepository,
    RoleRepository,
    SessionRepository,
} from './repositories';
import { User, Role, Session } from './entities';
import { Config } from '../config';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...Config.database,
            entities: [Role, User, Session],
        }),
        TypeOrmModule.forFeature([
            RoleRepository,
            UserRepository,
            SessionRepository,
        ]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
