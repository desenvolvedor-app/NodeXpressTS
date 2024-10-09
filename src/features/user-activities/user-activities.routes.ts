import { Router } from 'express';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { UserActivitiesController } from './user-activities.controller';
import { UserActivitiesService } from './user-activities.service';

const router = Router();
const userActivitiesController = new UserActivitiesController(new UserActivitiesService());

/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [LOGIN, LOGOUT, PASSWORD_CHANGE, PROFILE_UPDATE, POST_CREATED, COMMENT_ADDED, PROJECT_STARTED, ACHIEVEMENT_UNLOCKED]
 *           example: "LOGIN"
 *         description:
 *           type: string
 *           maxLength: 200
 *           example: "User logged in successfully"
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             ip: "192.168.1.1"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2023-06-12T10:34:23.456Z"
 *
 *     UserActivityInputDTO:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [LOGIN, LOGOUT, PASSWORD_CHANGE, PROFILE_UPDATE, POST_CREATED, COMMENT_ADDED, PROJECT_STARTED, ACHIEVEMENT_UNLOCKED]
 *           example: "LOGIN"
 *         description:
 *           type: string
 *           maxLength: 200
 *           example: "User logged in successfully"
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             ip: "192.168.1.1"
 *       required:
 *         - type
 *         - description
 *
 * tags:
 *   - name: User Activities
 *     description: API to manage user activities.
 */

/**
 * @swagger
 * /api/user-activities/{userId}:
 *   get:
 *     summary: Get user activities
 *     tags: [User Activities]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose activities is to be retrieved
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the user's activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/:userId', authMiddleware, userActivitiesController.getUserActivities);

export const userActivitiesRoutes = router;
