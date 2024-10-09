import { Router } from 'express';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validator.middleware';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsSchema } from './user-settings.schema';
import { UserSettingsService } from './user-settings.service';

const router = Router();
const userSettingsController = new UserSettingsController(new UserSettingsService());

/**
 * @swagger
 * components:
 *   schemas:
 *     PrivacySettingsDTO:
 *       type: object
 *       properties:
 *         profileVisibility:
 *           type: string
 *           enum: [public, private]
 *           description: The visibility of the user's profile
 *         showEmail:
 *           type: boolean
 *           description: Whether to show the user's email
 *         showActivity:
 *           type: boolean
 *           description: Whether to show the user's activity status
 *       example:
 *         profileVisibility: public
 *         showEmail: false
 *         showActivity: true
 *
 *     NotificationSettingsDTO:
 *       type: object
 *       properties:
 *         emailNotifications:
 *           type: boolean
 *           description: Whether email notifications are enabled
 *         pushNotifications:
 *           type: boolean
 *           description: Whether push notifications are enabled
 *       example:
 *         emailNotifications: true
 *         pushNotifications: false
 *
 *     UserSettingsInputDTO:
 *       type: object
 *       properties:
 *         privacy:
 *           $ref: '#/components/schemas/PrivacySettingsDTO'
 *         notificationSettings:
 *           $ref: '#/components/schemas/NotificationSettingsDTO'
 *         theme:
 *           type: string
 *           enum: [light, dark]
 *           description: The theme of the application
 *         language:
 *           type: string
 *           enum: [en, es, fr, de, it, pt, ru, zh]
 *           description: Preferred language for the application
 *       example:
 *         privacy:
 *           profileVisibility: public
 *           showEmail: false
 *           showActivity: true
 *         notificationSettings:
 *           emailNotifications: true
 *           pushNotifications: false
 *         theme: light
 *         language: en
 *
 * tags:
 *   - name: User Settings
 *     description: API to manage user settings.
 */

/**
 * @swagger
 * /api/user-settings:
 *   get:
 *     summary: Get user settings
 *     tags: [User Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSettingsInputDTO'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, userSettingsController.getUserSettings);

/**
 * @swagger
 * /api/user-settings:
 *   put:
 *     summary: Update user settings
 *     tags: [User Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSettingsInputDTO'
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSettingsInputDTO'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put('/', authMiddleware, validateRequest(UserSettingsSchema), userSettingsController.updateUserSettings);

export const userSettingsRoutes = router;
