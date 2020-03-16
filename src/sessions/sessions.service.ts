import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
    UserRepository,
    RoleRepository,
    User,
    SessionRepository,
    Session,
    PersonaRepository,
} from '../database';
import { CreateSessionRequest } from './dto/create-session.dto';
import { MailerService } from '../mailer/mailer.service';
import {
    SessionTitleAlreadyInUse,
    SessionNotFound,
    SessionEditNotAllowed,
    SessionPresenterEmailsMustDiffer,
} from './errors';
import {
    registerMessage,
    sessionCreatedForFirstPresenterMessage,
    sessionCreatedForSecondPresenterMessage,
} from '../mailer/messages';
import { UpdateSessionRequest } from './dto';
import { IUserSession } from '../_shared/constants';
import { UserState } from '../_shared/constants';
import { In } from 'typeorm';

@Injectable()
export class SessionsService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly personaRepository: PersonaRepository,
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

        if (emailFirstPresenter === emailSecondPresenter) {
            throw new SessionPresenterEmailsMustDiffer();
        }
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

    async updateSession(
        body: UpdateSessionRequest,
        sessionId: string,
        user: IUserSession,
    ): Promise<string> {
        const {
            emailFirstPresenter,
            emailSecondPresenter,
            sessionState,
            personaIds,
        } = body;

        const existingSession = await this.sessionRepository.findOne({
            where: { id: sessionId },
            relations: [
                'firstPresenter',
                'secondPresenter',
                'intendedAudience',
            ],
        });
        if (!existingSession) {
            throw new SessionNotFound();
        }

        if (emailFirstPresenter === emailSecondPresenter) {
            throw new SessionPresenterEmailsMustDiffer();
        }
        if (
            emailFirstPresenter !== user.email &&
            emailSecondPresenter !== user.email &&
            !this.checkAdminRightsOnSession(user)
        ) {
            throw new SessionEditNotAllowed();
        }

        if (this.checkAdminRightsOnSession(user)) {
            existingSession.sessionState = sessionState || null;

            existingSession.firstPresenter = await this.userRepository.findOne({
                email: emailFirstPresenter,
            });

            existingSession.secondPresenter =
                (await this.userRepository.findOne({
                    email: emailSecondPresenter,
                })) || null;
        }

        const personas = personaIds
            ? await this.personaRepository.find({ id: In(personaIds) })
            : [];
        if (personas.length) existingSession.intendedAudience = personas;

        existingSession.updatedBy = user.email;

        await this.sessionRepository.save(
            this.getRemainingUpdateValues(existingSession, body),
        );

        return existingSession.id;
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
        newUser.state = UserState.Registering;
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
            .filter(presenter => presenter.state === UserState.Registering)
            .forEach(presenter =>
                this.mailerService.sendMail(
                    registerMessage({
                        email: presenter.email,
                        resetToken: presenter.resetToken,
                        frontendUrl: origin,
                    }),
                ),
            );
    }

    // We want to check if the user has admin rights to edit certain values of a session
    private checkAdminRightsOnSession(user: IUserSession): boolean {
        return user.permissions.sessions.admin;
    }

    private getRemainingUpdateValues(
        existingSession: Session,
        request: UpdateSessionRequest,
    ): Session {
        const session: Session = existingSession;

        session.subTitle = request.subTitle || null;
        session.description = request.description;
        session.xpFactor = request.xpFactor || 0;
        session.shortDescription = request.shortDescription || null;
        session.goal = request.goal || null;
        session.type = request.type || null;
        session.topic = request.topic || null;
        session.maxParticipants = request.maxParticipants || 50;
        session.duration = request.duration || null;
        session.laptopsRequired = request.laptopsRequired;
        session.otherLimitations = request.otherLimitations || null;
        session.roomSetup = request.roomSetup || null;
        session.neededMaterials = request.neededMaterials || null;
        session.expierenceLevel = request.expierenceLevel || null;
        session.outline = request.outline || null;
        session.materialDescription = request.materialDescription || null;
        session.materialUrl = request.materialUrl || null;

        return session;
    }
}
