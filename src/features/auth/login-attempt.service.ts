import { EmailService } from '../../common/services/email.service';
import { AppError } from '../../common/utils/error.util';
import { IUserDocument } from '../user/user.types';

export class LoginAttemptService {
    private MAX_FAILED_LOGIN_ATTEMPTS = 5;
    private emailService = new EmailService();

    async handleFailedLogin(user: IUserDocument): Promise<void> {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= this.MAX_FAILED_LOGIN_ATTEMPTS) {
            user.isLocked = true;

            await this.emailService.sendLockedAccountEmail(user.email);
        }

        await user.save();
    }

    async resetFailedLoginAttempts(user: IUserDocument): Promise<void> {
        if (user.failedLoginAttempts > 0) {
            user.failedLoginAttempts = 0;
            user.isLocked = false;
            await user.save();
        }
    }

    async unlockAccount(user: IUserDocument): Promise<void> {
        if (user.isLocked) {
            user.isLocked = false;
            user.failedLoginAttempts = 0;
            await user.save();

            //await this.emailService.sendAccountUnlockedEmail(user.email);
        }
    }

    checkAccountLock(user: IUserDocument): void {
        if (user.isLocked) {
            throw new AppError(
                'Your account is locked due to multiple failed login attempts. Please reset your password.',
                403,
            );
        }
    }
}
