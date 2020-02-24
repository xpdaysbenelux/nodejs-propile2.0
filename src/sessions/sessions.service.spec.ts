import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import {
    mock,
    instance,
    reset,
    anything,
    when,
    objectContaining,
    verify,
} from 'ts-mockito';
import { JwtService } from '@nestjs/jwt';
import * as faker from 'faker';

import { SessionsService } from './sessions.service';
import { SessionRepository, UserRepository, RoleRepository } from '../database';
import {
    createTestUser,
    createTestRole,
    createTestSession,
} from '../_util/testing';
import { MailerService } from '../mailer/mailer.service';
import { SessionTitleAlreadyInUse } from './errors';
import {
    registerMessage,
    sessionCreatedForFirstPresenterMessage,
    sessionCreatedForSecondPresenterMessage,
} from '../mailer/messages';

describe('SessionsService', () => {
    let sessionsService: SessionsService;

    const sessionRepository = mock(SessionRepository);
    const jwtService = mock(JwtService);
    const userRepository = mock(UserRepository);
    const roleRepository = mock(RoleRepository);
    const mailerService = mock(MailerService);

    const body = {
        title: faker.lorem.sentence(),
        subTitle: faker.lorem.sentence(),
        emailFirstPresenter: faker.internet.email(),
        emailSecondPresenter: faker.internet.email(),
        xpFactor: Math.round(faker.random.number(10)),
        description: faker.lorem.sentences(15),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SessionsService,
                {
                    provide: MailerService,
                    useValue: instance(mailerService),
                },
                {
                    provide: JwtService,
                    useValue: instance(jwtService),
                },
                {
                    provide: getCustomRepositoryToken(SessionRepository),
                    useValue: instance(sessionRepository),
                },
                {
                    provide: getCustomRepositoryToken(UserRepository),
                    useValue: instance(userRepository),
                },
                {
                    provide: getCustomRepositoryToken(RoleRepository),
                    useValue: instance(roleRepository),
                },
            ],
        }).compile();

        sessionsService = module.get(SessionsService);
    });

    afterEach(() => {
        reset(sessionRepository);
    });

    describe('createSession', () => {
        /**
         * A session with an original title gets created.
         * The first presenter is already an active user. The second presenter is a new user.
         */
        it('should create a session with an original title', async () => {
            when(sessionRepository.findOne(anything())).thenResolve(null);
            const firstPresenter = createTestUser({
                id: 'blabla',
                email: body.emailFirstPresenter,
            });
            when(
                userRepository.findOne(
                    objectContaining({ email: body.emailFirstPresenter }),
                ),
            ).thenResolve(firstPresenter);
            when(
                userRepository.findOne(
                    objectContaining({ email: body.emailSecondPresenter }),
                ),
            ).thenResolve(null);
            when(roleRepository.findOne(anything())).thenResolve(
                createTestRole({ isDefault: true }),
            );
            const resetToken = faker.random.alphaNumeric(10);
            when(jwtService.signAsync(anything(), anything())).thenResolve(
                resetToken,
            );

            const origin = 'http://test.com';
            await sessionsService.createSession(body, origin);

            verify(
                sessionRepository.save(
                    objectContaining({
                        firstPresenter,
                        title: body.title,
                        subTitle: body.subTitle,
                        secondPresenter: { email: body.emailSecondPresenter },
                        xpFactor: body.xpFactor,
                        description: body.description,
                    }),
                ),
            ).once();
            verify(
                mailerService.sendMail(
                    objectContaining(
                        registerMessage({
                            email: body.emailSecondPresenter,
                            resetToken,
                            frontendUrl: origin,
                        }),
                    ),
                ),
            ).once();
            verify(
                mailerService.sendMail(
                    objectContaining(
                        sessionCreatedForFirstPresenterMessage({
                            email: body.emailFirstPresenter,
                            frontendUrl: origin,
                            sessionTitle: body.title,
                        }),
                    ),
                ),
            ).once();
            verify(
                mailerService.sendMail(
                    objectContaining(
                        sessionCreatedForSecondPresenterMessage({
                            email: body.emailSecondPresenter,
                            emailMainPresenter: body.emailFirstPresenter,
                            frontendUrl: origin,
                            sessionTitle: body.title,
                        }),
                    ),
                ),
            ).once();
        });

        it('should throw an error when a session with given title that already exists', async () => {
            when(
                sessionRepository.findOne(
                    objectContaining({ title: body.title }),
                ),
            ).thenResolve(createTestSession({ title: body.title }));

            await expect(
                sessionsService.createSession(body, 'origin'),
            ).rejects.toThrowError(SessionTitleAlreadyInUse);
        });
    });
});
