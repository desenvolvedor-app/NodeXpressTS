import { Router } from 'express';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { publicProfileLimiter } from '../../common/middleware/rate-limiter.middleware';
import { validateRequest } from '../../common/middleware/validator.middleware';
import { UserProfileController } from './user-profile.controller';
import { UserProfileSchema } from './user-profile.schema';

const router = Router();
const userProfileController = new UserProfileController();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfileInputDTO:
 *       type: object
 *       properties:
 *         bio:
 *           type: string
 *           maxLength: 500
 *           example: "Full Stack Developer"
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           maxItems: 20
 *           example: ["JavaScript", "Node.js", "React"]
 *         social_links:
 *           type: object
 *           properties:
 *             github:
 *               type: string
 *               format: url
 *               example: "https://github.com/johndoe"
 *             linkedin:
 *               type: string
 *               format: url
 *               example: "https://linkedin.com/in/johndoe"
 *             twitter:
 *               type: string
 *               example: "@johndoe"
 *             website:
 *               type: string
 *               format: url
 *               example: "https://johndoe.dev"
 *         location:
 *           type: string
 *           example: "San Francisco"
 *         jobTitle:
 *           type: string
 *           example: "Software Engineer"
 *         company:
 *           type: string
 *           example: "TechCorp"
 * tags:
 *   - name: User Profile
 *     description: API to manage user profile.
 */

/**
 * @swagger
 * /api/user-profile/me:
 *   get:
 *     summary: Get the current user's profile
 *     tags:
 *       - User Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileInputDTO'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, userProfileController.getProfile);

/**
 * @swagger
 * /api/user-profile/me:
 *   put:
 *     summary: Update the current user's profile
 *     tags:
 *       - User Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileInputDTO'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileInputDTO'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/me', authMiddleware, validateRequest(UserProfileSchema), userProfileController.updateProfile);

/**
 * @swagger
 * /api/user-profile/{userId}:
 *   get:
 *     summary: Get another user's public profile
 *     tags:
 *       - User Profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose public profile is to be retrieved
 *     responses:
 *       200:
 *         description: Successful response with the public profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileInputDTO'
 *       403:
 *         description: Profile is private
 *       404:
 *         description: Profile not found
 */
router.get('/:userId', publicProfileLimiter, userProfileController.getPublicProfile);

export const userProfileRoutes = router;
