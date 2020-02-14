import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
    UserRepository,
    RoleRepository,
    User,
    SessionRepository,
    Session,
} from '../database';
import { CreateSessionRequest } from './dto/create-session.dto';
import { MailerService } from '../mailer/mailer.service';
import { SessionTitleAlreadyInUse } from './errors';
import {
    registerMessage,
    sessionCreatedForFirstPresenterMessage,
    sessionCreatedForSecondPresenterMessage,
} from '../mailer/messages';

@Injectable()
export class SessionsService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly sessionRepository: SessionRepository,
    ) {}

    async createSession(
        body: CreateSessionRequest,
        origin: string,
    ): Promise<void> {
        const {
            title,
            subTitle,
            emailFirstPresenter,
            emailSecondPresenter,
            xpFactor,
            description,
        } = body;

        // Check for unique title
        const existingSession = await this.sessionRepository.findOne({
            title,
        });
        if (existingSession) {
            throw new SessionTitleAlreadyInUse();
        }

        const session = new Session();
        session.title = title;
        session.subTitle = subTitle;
        session.xpFactor = xpFactor;
        session.description = description;

        const presenterEmails = emailSecondPresenter
            ? [emailFirstPresenter, emailSecondPresenter]
            : [emailFirstPresenter];
        const presenters = await Promise.all(
            presenterEmails.map(email => this.getPossiblyExistingUser(email)),
        );

        session.firstPresenter = presenters[0];
        session.secondPresenter = presenters[1];
        await this.sessionRepository.save(session);

        this.sendSessionCreatedMails(body, presenters, origin);
    }

    /**
     * Check if a user with the given email exists, if so, return that user.
     * If there is no user found for email, create a new one.
     * Does not save the user to the database.
     * @param email Email of the new presenter
     */
    private async getPossiblyExistingUser(email: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ email });

        if (existingUser) {
            return existingUser;
        }

        const newUser = new User();
        newUser.email = email;
        const defaultRole = await this.roleRepository.findOne({
            isDefault: true,
        });
        newUser.roles = [defaultRole];
        newUser.resetToken = await this.createResetTokenForPresenter(email);
        return newUser;
    }

    private async createResetTokenForPresenter(email: string): Promise<string> {
        const resetToken = await this.jwtService.signAsync(
            { email },
            { expiresIn: '1d' },
        );
        return resetToken;
    }

    private sendSessionCreatedMails(
        body: CreateSessionRequest,
        presenters: User[],
        origin: string,
    ): void {
        // Mail the presenter(s) to notify that he was assigned to a new session
        this.mailerService.sendMail(
            sessionCreatedForFirstPresenterMessage({
                email: body.emailFirstPresenter,
                sessionTitle: body.title,
                frontendUrl: origin,
            }),
        );
        if (body.emailSecondPresenter) {
            this.mailerService.sendMail(
                sessionCreatedForSecondPresenterMessage({
                    email: body.emailSecondPresenter,
                    sessionTitle: body.title,
                    frontendUrl: origin,
                    emailMainPresenter: body.emailFirstPresenter,
                }),
            );
        }
        // If the presenter is a new user, we want to send him a registration email
        presenters
            .filter(presenter => !presenter.id)
            .forEach(presenter =>
                this.mailerService.sendMail(
                    registerMessage(
                        presenter.email,
                        presenter.resetToken,
                        origin,
                    ),
                ),
            );
    }
}
