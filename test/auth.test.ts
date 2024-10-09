import { Server } from 'http';

import mongoose from 'mongoose';
import request from 'supertest';

import { createServer } from '../src/server';

describe('Auth API', () => {
    let server: Server;
    let shutdown: () => Promise<void>;

    const uniqueEmail = `test${Date.now()}@example.com`;
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
        const serverInstance = await createServer(0);
        server = serverInstance.server;
        shutdown = serverInstance.shutdown;
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await shutdown();
    });
    it('should register a new user', async () => {
        const newUser = {
            name: 'Test User',
            email: uniqueEmail,
            password: 'password123',
        };

        const response = await request(server).post('/api/auth/register').send(newUser).expect(201);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body.user).toHaveProperty('email', uniqueEmail);

        // Save tokens for later tests
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
    });

    it('should return 409 Conflict for duplicate email', async () => {
        const newUser = {
            name: 'Test User',
            email: uniqueEmail,
            password: 'password123',
        };

        const response = await request(server).post('/api/auth/register').send(newUser).expect(409);

        expect(response.body).toHaveProperty('message', 'Email already exists');
    });

    it('should login an existing user', async () => {
        const loginData = {
            email: uniqueEmail,
            password: 'password123',
        };

        const response = await request(server).post('/api/auth/login').send(loginData).expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body.user).toHaveProperty('email', uniqueEmail);

        // Save tokens for later tests
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
    });

    it('should return 401 for invalid login', async () => {
        const loginData = {
            email: 'invalid@example.com',
            password: 'wrongpassword',
        };

        await request(server).post('/api/auth/login').send(loginData).expect(401);
    });

    // Test Refresh Token functionality
    it('should refresh the access token with refresh token', async () => {
        const response = await request(server).post('/api/auth/refresh-token').send({ refreshToken }).expect(200);

        expect(response.body).toHaveProperty('accessToken');
        accessToken = response.body.accessToken;
    });

    // Test Request Email Verification
    it('should send a verification email', async () => {
        const response = await request(server)
            .post('/api/auth/request-verification')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body.message).toBe('Verification email sent successfully');
    });

    // Test Request Password Reset
    it('should send a password reset email', async () => {
        const response = await request(server)
            .post('/api/auth/request-password-reset')
            .send({ email: uniqueEmail })
            .expect(200);

        expect(response.body.message).toBe('Password reset email sent.');
    });

    /*
    it('should reset the password', async () => {
        const response = await request(server)
            .post('/api/auth/reset-password')
            .send({ token: 'valid-reset-token', newPassword: 'newpassword123' })
            .expect(200);

        expect(response.body.message).toBe('Password reset successfully');
    });
    */

    // Test access to protected route with valid token
    it('should access a protected route with valid token', async () => {
        await request(server).get('/api/user-profile/me').set('Authorization', `Bearer ${accessToken}`).expect(200);
    });

    // Test access to protected route with invalid token
    it('should return 401 for protected route without valid token', async () => {
        await request(server).get('/api/user-profile//me').set('Authorization', 'Bearer invalidtoken').expect(401);
    });
});
