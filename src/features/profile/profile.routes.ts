import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validator.middleware';
import { UserProfileSchema } from './profile.schema';

const router = Router();
const profileController = new ProfileController();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfileInput:
 *       type: object
 *       properties:
 *         bio:
 *           type: string
 *           example: "Full Stack Developer"
 *         skills:
 *           type: array
 *           items:
 *             type: string
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
 *             website:
 *               type: string
 *               format: url
 *               example: "https://johndoe.dev"
 *         privacy:
 *           type: object
 *           properties:
 *             profileVisibility:
 *               type: string
 *               enum: [public, private]
 *               example: "public"
 *             showEmail:
 *               type: boolean
 *               example: false
 */

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Get the current user's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileInput'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, profileController.getProfile);

/**
 * @swagger
 * /api/profile/me:
 *   put:
 *     summary: Update the current user's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileInput'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put('/me', authMiddleware, validateRequest(UserProfileSchema), profileController.updateProfile);

/**
 * @swagger
 * /api/profile/{userId}:
 *   get:
 *     summary: Get another user's public profile
 *     tags:
 *       - Profile
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
 *               $ref: '#/components/schemas/UserProfileInput'
 *       403:
 *         description: Profile is private
 *       404:
 *         description: Profile not found
 */
router.get('/:userId', profileController.getPublicProfile);

export const profileRoutes = router;
