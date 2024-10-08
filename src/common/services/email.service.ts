import nodemailer from 'nodemailer';

export class EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    private emailTemplate(content: string) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        min-height: 100vh;
                    }
                    .wrapper {
                        display: table;
                        width: 100%;
                        height: 100vh;
                        background-color: #f5f5f5;
                    }
                    .container {
                        display: table-cell;
                        vertical-align: middle;
                        text-align: center;
                    }
                    .content {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 40px 20px;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 24px;
                        margin: 20px 0;
                        background-color: #007bff;
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 12px;
                        color: #666;
                    }
                    .url-text {
                        word-break: break-all;
                        font-size: 14px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="container">
                        <div class="content">
                            ${content}
                            <div class="footer">
                                <p>This email was sent by Lovyi. If you didn't request this, please ignore.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    async sendEmail(to: string, subject: string, htmlContent: string) {
        const mailOptions = {
            from: 'Lovyi Support <support@lovyi.com>',
            to,
            subject,
            html: this.emailTemplate(htmlContent),
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendVerificationEmail(email: string, token: string) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const html = `
            <h2>Email Verification</h2>
            <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p>If the button doesn't work, copy and paste this link:</p>
            <p class="url-text">${verificationUrl}</p>
        `;
        await this.sendEmail(email, 'Verify Your Email Address', html);
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const html = `
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link:</p>
            <p class="url-text">${resetUrl}</p>
        `;
        await this.sendEmail(email, 'Reset Your Password', html);
    }

    async sendLockedAccountEmail(email: string) {
        const html = `
            <h2>Account Locked</h2>
            <p>Your account has been locked due to multiple failed login attempts.</p>
            <p>For your security, please wait 30 minutes before trying again or contact support for immediate assistance.</p>
        `;
        await this.sendEmail(email, 'Account Locked - Security Alert', html);
    }
}
