import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    UserRepository,
    RoleRepository,
    SessionRepository,
    PersonaRepository,
    ConferenceRepository,
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
            PersonaRepository,
        ]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
