import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    UserRepository,
    RoleRepository,
    SessionRepository,
    ProgramRepository,
    PersonaRepository,
    ConferenceRepository,
    RoomRepository,
} from './repositories';
import {
    User,
    Role,
    Session,
    Persona,
    Conference,
    Program,
    Room,
    Event,
} from './entities';
import { Config } from '../config';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...Config.database,
            entities: [
                Role,
                User,
                Session,
                Conference,
                Program,
                Room,
                Event,
                Persona,
            ],
        }),
        TypeOrmModule.forFeature([
            RoleRepository,
            UserRepository,
            SessionRepository,
            ConferenceRepository,
            ProgramRepository,
            PersonaRepository,
            RoomRepository,
        ]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
