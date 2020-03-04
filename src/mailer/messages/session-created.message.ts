import { Config } from '../../config';
import { MandrillMessage } from './index';

export function sessionCreatedForFirstPresenterMessage(
    data: SessionCreatedMessage,
): MandrillMessage {
    console.log('session created, mail firstPresenter:', data.email);

    // Todo Slugify url
    const url = `${data.frontendUrl}/auth/login`;
    return {
        subject: `${Config.brandName}: session created`,
        html: `<p>
            Congratulations, you created the session "${data.sessionTitle}" with yourself as main presenter. Log in at <a href="${url}" >${Config.brandName}</a> to view and edit your session.
        </p>`,
        to: [{ email: data.email }],
    };
}

export function sessionCreatedForSecondPresenterMessage(
    data: SessionCreatedMessage,
): MandrillMessage {
    console.log('session created, mail secondPresenter:', data.email);

    // Todo Slugify url
    const url = `${data.frontendUrl}/auth/login`;
    return {
        subject: `${Config.brandName}: session created`,
        html: `<p>
        The session "${data.sessionTitle}" was created by ${data.emailMainPresenter} with yourself as second presenter. Log in at <a href="${url}" >${Config.brandName}</a> to view and edit your session.
        </p>`,
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
