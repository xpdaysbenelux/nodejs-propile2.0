import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SessionsModule } from './sessions/sessions.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConferencesModule } from './conferences/conferences.module';
import { ProgramsModule } from './programs/programs.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
    imports: [
        AuthenticationModule,
        MailerModule,
        RolesModule,
        UsersModule,
        SessionsModule,
        ProgramsModule,
        ConferencesModule,
        RoomsModule,
    ],
})
export class AppModule {}
