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
import { omit } from 'ramda';
import { Not } from 'typeorm';

import { SessionsService } from './sessions.service';
import {
    SessionRepository,
    UserRepository,
    RoleRepository,
    PersonaRepository,
} from '../database';
import {
    createTestUser,
    createTestRole,
    createShortTestSession,
    createTestUserSession,
    createFullTestSession,
} from '../_util/testing';
import {
    SessionState,
    SessionType,
    SessionTopic,
    SessionDuration,
    SessionExpierenceLevel,
} from './constants';
import { MailerService } from '../mailer/mailer.service';
import {
    SessionTitleAlreadyInUse,
    SessionEditNotAllowed,
    SessionNotFound,
} from './errors';
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
    const personaRepository = mock(PersonaRepository);
    const mailerService = mock(MailerService);

    const createBody = {
        title: faker.lorem.sentence(),
        subTitle: faker.lorem.sentence(),
        emailFirstPresenter: faker.internet.email(),
        emailSecondPresenter: faker.internet.email(),
        xpFactor: Math.round(faker.random.number(10)),
        description: faker.lorem.sentences(15),
    };

    const updateBody = {
        title: faker.lorem.sentence(),
        subTitle: faker.lorem.sentence(),
        emailFirstPresenter: faker.internet.email(),
        emailSecondPresenter: faker.internet.email(),
        xpFactor: Math.round(faker.random.number(10)),
        description: faker.lorem.sentences(10),
        sessionState: faker.random.arrayElement(Object.values(SessionState)),
        shortDescription: faker.lorem.sentences(3),
        goal: faker.lorem.sentences(3),
        type: faker.random.arrayElement(Object.values(SessionType)),
        topic: faker.random.arrayElement(Object.values(SessionTopic)),
        maxParticipants: Math.round(faker.random.number(50)),
        duration: faker.random.arrayElement(Object.values(SessionDuration)),
        laptopsRequired: faker.random.boolean(),
        otherLimitations: faker.lorem.sentences(2),
        intendedAudience: [],
        roomSetup: faker.lorem.sentences(2),
        neededMaterials: faker.lorem.sentences(2),
        expierenceLevel: faker.random.arrayElement(
            Object.values(SessionExpierenceLevel),
        ),
        outline: faker.lorem.sentences(2),
        materialDescription: faker.lorem.sentences(3),
        materialUrl: faker.lorem.sentences(2),
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
                {
                    provide: getCustomRepositoryToken(PersonaRepository),
                    useValue: instance(personaRepository),
                },
            ],
        }).compile();

        sessionsService = module.get(SessionsService);
    });

    afterEach(() => {
        reset(sessionRepository);
        reset(roleRepository);
        reset(userRepository);
        reset(jwtService);
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
                email: createBody.emailFirstPresenter,
            });
            when(
                userRepository.findOne(
                    objectContaining({ email: createBody.emailFirstPresenter }),
                ),
            ).thenResolve(firstPresenter);
            when(
                userRepository.findOne(
                    objectContaining({
                        email: createBody.emailSecondPresenter,
                    }),
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
            await sessionsService.createSession(createBody, origin);

            verify(
                sessionRepository.save(
                    objectContaining({
                        firstPresenter,
                        title: createBody.title,
                        subTitle: createBody.subTitle,
                        secondPresenter: {
                            email: createBody.emailSecondPresenter,
                        },
                        xpFactor: createBody.xpFactor,
                        description: createBody.description,
                    }),
                ),
            ).once();
            verify(
                mailerService.sendMail(
                    objectContaining(
                        registerMessage({
                            email: createBody.emailSecondPresenter,
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
                            email: createBody.emailFirstPresenter,
                            frontendUrl: origin,
                            sessionTitle: createBody.title,
                        }),
                    ),
                ),
            ).once();
            verify(
                mailerService.sendMail(
                    objectContaining(
                        sessionCreatedForSecondPresenterMessage({
                            email: createBody.emailSecondPresenter,
                            emailMainPresenter: createBody.emailFirstPresenter,
                            frontendUrl: origin,
                            sessionTitle: createBody.title,
                        }),
                    ),
                ),
            ).once();
        });

        it('should throw an error when a session with given title that already exists', async () => {
            when(
                sessionRepository.findOne(
                    objectContaining({ title: createBody.title }),
                ),
            ).thenResolve(createShortTestSession({ title: createBody.title }));

            await expect(
                sessionsService.createSession(createBody, 'origin'),
            ).rejects.toThrowError(SessionTitleAlreadyInUse);
        });
    });

    describe('updateSession', () => {
        it('should update the session correctly as first presenter', async () => {
            const session = createFullTestSession();
            const currentUser = createTestUserSession(session.firstPresenter);

            when(
                sessionRepository.findOne(
                    objectContaining({ where: { id: session.id } }),
                ),
            ).thenResolve(session);
            when(
                sessionRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(session.id),
                            title: updateBody.title,
                        },
                    }),
                ),
            ).thenResolve(undefined);

            updateBody.title = session.title;
            updateBody.emailFirstPresenter = session.firstPresenter.email;

            await sessionsService.updateSession(
                updateBody,
                session.id,
                currentUser,
            );

            const expectedSave = {
                ...omit(
                    [
                        'emailFirstPresenter',
                        'emailSecondPresenter',
                        'sessionState',
                    ],
                    updateBody,
                ),
            };

            verify(
                sessionRepository.save(objectContaining(expectedSave)),
            ).once();
        });

        it('should update the session correctly as admin user', async () => {
            const session = createFullTestSession();
            const adminUser = createTestUserSession({
                permissions: {
                    sessions: { edit: true, view: true, admin: true },
                },
            });
            const firstPresenter = createTestUser({
                email: session.firstPresenter.email,
            });
            const secondPresenter = createTestUser({
                email: updateBody.emailSecondPresenter,
            });

            updateBody.title = session.title;

            when(
                sessionRepository.findOne(
                    objectContaining({ where: { id: session.id } }),
                ),
            ).thenResolve(session);
            when(
                sessionRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(session.id),
                            title: updateBody.title,
                        },
                    }),
                ),
            ).thenResolve(undefined);
            when(
                userRepository.findOne(
                    objectContaining({ email: updateBody.emailFirstPresenter }),
                ),
            ).thenResolve(firstPresenter);
            when(
                userRepository.findOne(
                    objectContaining({
                        email: updateBody.emailSecondPresenter,
                    }),
                ),
            ).thenResolve(secondPresenter);

            await sessionsService.updateSession(
                updateBody,
                session.id,
                adminUser,
            );

            const expectedSave = {
                ...omit(
                    ['emailFirstPresenter', 'emailSecondPresenter'],
                    updateBody,
                ),
                firstPresenter,
                secondPresenter,
            };

            verify(
                sessionRepository.save(objectContaining(expectedSave)),
            ).once();
        });

        it('should throw an error because user has no rights to edit the session', async () => {
            const session = createFullTestSession();
            const currentUser = createTestUserSession({
                permissions: { sessions: { admin: false } },
            });

            when(
                sessionRepository.findOne(
                    objectContaining({ where: { id: session.id } }),
                ),
            ).thenResolve(session);
            when(
                sessionRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(session.id),
                            title: updateBody.title,
                        },
                    }),
                ),
            ).thenResolve(undefined);

            await expect(
                sessionsService.updateSession(
                    updateBody,
                    session.id,
                    currentUser,
                ),
            ).rejects.toThrowError(SessionEditNotAllowed);
        });

        it('should throw an error because the user is no presenter and has no admin rights to edit the session', async () => {
            const session = createFullTestSession();
            const currentUser = createTestUserSession({
                permissions: { sessions: { admin: false } },
            });

            when(
                sessionRepository.findOne(
                    objectContaining({ where: { id: session.id } }),
                ),
            ).thenResolve(session);
            when(
                sessionRepository.findOne(
                    objectContaining({
                        where: {
                            id: Not(session.id),
                            title: updateBody.title,
                        },
                    }),
                ),
            ).thenResolve(undefined);
            if (
                session.firstPresenter.email === currentUser.email ||
                session.secondPresenter.email === currentUser.email
            ) {
                currentUser.email = faker.internet.email();
            }

            await expect(
                sessionsService.updateSession(
                    updateBody,
                    session.id,
                    currentUser,
                ),
            ).rejects.toThrowError(SessionEditNotAllowed);
        });
        it('should throw an error because the session does not exist', async () => {
            const session = createFullTestSession();
            const currentUser = createTestUserSession({
                permissions: { sessions: { admin: false } },
            });

            await expect(
                sessionsService.updateSession(
                    updateBody,
                    session.id,
                    currentUser,
                ),
            ).rejects.toThrowError(SessionNotFound);
        });
    });
});
