import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { UserRepository, User } from '../database';
import { ResetPasswordRequest, RequestPasswordResetRequest } from './dto';
import { ResetTokenInvalid, ResetTokenExpired } from './errors';
import { UserState } from '../_shared/constants';
import { MailerService } from '../mailer/mailer.service';
import { requestPasswordResetMessage } from '../mailer/messages';
import { canActivateWithUserState } from '../_shared/guards';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
    ) {}

    async login(email: string, password: string): Promise<User> {
        // Try to find the user
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new UnauthorizedException();
        }

        // Check if user is active
        canActivateWithUserState(user.state, [UserState.Active]);

        // Given password should match the stored hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async requestPasswordReset(
        body: RequestPasswordResetRequest,
        origin: string,
    ): Promise<void> {
        const { email } = body;

        // If the user is not found, just do nothing
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            console.info(
                `Request password reset done for unknown email: ${email}`,
            );
            return;
        }

        // Add resetToken to the user
        const resetToken = await this.jwtService.signAsync(
            { email },
            { expiresIn: '1d' },
        );
        user.resetToken = resetToken;
        user.updatedBy = user.email;
        await this.userRepository.save(user);

        // Send mail to inform user
        this.mailerService.sendMail(
            requestPasswordResetMessage(email, resetToken, origin),
        );
    }

    async resetPassword(body: ResetPasswordRequest): Promise<void> {
        const { newPassword, resetToken } = body;

        // Check if token is still valid
        try {
            await this.jwtService.verifyAsync(resetToken);
        } catch (error) {
            console.error(error);
            if (error instanceof TokenExpiredError) {
                throw new ResetTokenExpired();
            }
            throw new ResetTokenInvalid();
        }

        // Check if token is linked to a user
        const decoded = this.jwtService.decode(resetToken) as { email: string };
        const user = await this.userRepository.findOne({
            resetToken,
        });
        if (!user || user.email !== decoded.email) {
            throw new ResetTokenInvalid();
        }

        // Check if the user is not inactive
        canActivateWithUserState(user.state, [
            UserState.Active,
            UserState.Registering,
        ]);

        // Update the user in the database
        const hashedPassword = await this.hashPassword(newPassword);
        user.state = UserState.Active;
        user.password = hashedPassword;
        user.resetToken = null;
        user.updatedBy = user.email;

        await this.userRepository.save(user);
    }

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}
