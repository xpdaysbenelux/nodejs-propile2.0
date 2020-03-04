import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    UserRepository,
    RoleRepository,
    SessionRepository,
    PersonaRepository,
} from './repositories';
import { User, Role, Session, Persona } from './entities';
import { Config } from '../config';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...Config.database,
            entities: [Role, User, Session, Persona],
        }),
        TypeOrmModule.forFeature([
            RoleRepository,
            UserRepository,
            SessionRepository,
            PersonaRepository,
        ]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
