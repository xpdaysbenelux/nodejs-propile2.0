import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { DatabaseModule } from '../database';
import { Config } from '../config';
import { SessionsQueries } from './sessions.queries';
import { MailerModule } from '../mailer/mailer.module';

@Module({
    imports: [
        DatabaseModule,
        JwtModule.register({
            secret: Config.jwt.secret,
        }),
        MailerModule,
    ],
    controllers: [SessionsController],
    providers: [SessionsService, SessionsQueries],
})
export class SessionsModule {}
