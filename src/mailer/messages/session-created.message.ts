import { Config } from '../../config';
import { MandrillMessage } from './index';

export function sessionCreatedForFirstPresenterMessage(
    data: SessionCreatedMessage,
): MandrillMessage {
    // Todo Slugify url
    const url = `${data.frontendUrl}/session/${data.sessionTitle}`;
    return {
        subject: `${Config.brandName} session created`,
        text: `Congratulations, you created a session with you as main presenter. Log in or sign up at ${Config.brandName} via ${url} to view and edit your session.`,
        to: [{ email: data.email }],
    };
}

export function sessionCreatedForSecondPresenterMessage(
    data: SessionCreatedMessage,
): MandrillMessage {
    // Todo Slugify url
    const url = `${data.frontendUrl}/session/${data.sessionTitle}`;
    return {
        subject: `${Config.brandName} session created`,
        text: `The session ${data.sessionTitle} has been created by ${data.emailMainPresenter} with you as second presenter. Log in or sign up at ${Config.brandName} via ${url} to view and edit your session.`,
        to: [{ email: data.email }],
    };
}

interface SessionCreatedMessage {
    email: string;
    /**
     * In case mail for second presenter, we want to add a reference to the first presenter.
     */
    emailMainPresenter?: string;
    frontendUrl: string;
    sessionTitle: string;
}
