import nodemailer from 'nodemailer';

export class EmailService {
    private transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
            user: 'support@lovyi.com',
            pass: 'G@briel123',
        },
    });

    async sendEmail(to: string, subject: string, html: string) {
        const mailOptions = {
            from: 'support@lovyi.com',
            to,
            subject,
            html,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendVerificationEmail(email: string, token: string) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const html = `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>`;
        await this.sendEmail(email, 'Email Verification', html);
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const html = `<p>Click the following link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`;
        await this.sendEmail(email, 'Password Reset', html);
    }
}
