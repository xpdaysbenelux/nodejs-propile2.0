import { Config } from '../../config';
import { MandrillMessage } from './index';

export function registerMessage(data: RegisterMessage): MandrillMessage {
    const url = `${data.frontendUrl}/auth/register/${data.resetToken}`;
    return {
        subject: `${Config.brandName} portal - Invitation`,
        html: `<p>
            You have been invited to the ${Config.brandName} portal. Complete your <a href="${url}">registration</a> by choosing a password.
        </p>`,
        to: [{ email: data.email }],
    };
}

interface RegisterMessage {
    email: string;
    resetToken: string;
    frontendUrl: string;
}
