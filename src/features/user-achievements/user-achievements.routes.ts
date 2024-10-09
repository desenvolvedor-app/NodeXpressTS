import { Router } from 'express';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validator.middleware';
import { UserAchievementsController } from './user-achievements.controller';
import { UserAchievementsSchema } from './user-achievements.schema';
import { UserAchievementsService } from './user-achievements.service';

const router = Router();
const userAchievementsController = new UserAchievementsController(new UserAchievementsService());

/**
 * @swagger
 * components:
 *   schemas:
 *     HackathonParticipation:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *           example: "Hackathon Championship 2023"
 *         date:
 *           type: string
 *           format: date
 *           example: "2023-06-12"
 *         position:
 *           type: string
 *           enum: [1st, 2nd, 3rd, Participant, Finalist]
 *           example: "1st"
 *       required:
 *         - title
 *         - date
 *         - position
 *
 *     UserAchievementsInputDTO:
 *       type: object
 *       properties:
 *         hackathons:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HackathonParticipation'
 *         badges:
 *           type: array
 *           items:
 *             type: string
 *           maxItems: 50
 *           example: ["JavaScript Master", "Hackathon Winner"]
 *         points:
 *           type: integer
 *           minimum: 0
 *           example: 1000
 *         level:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *       required:
 *         - points
 *         - level
 *       example:
 *         hackathons:
 *           - title: "Hackathon Championship 2023"
 *             date: "2023-06-12"
 *             position: "1st"
 *         badges:
 *           - "JavaScript Master"
 *           - "Hackathon Winner"
 *         points: 1000
 *         level: 5
 *
 * tags:
 *   - name: User Achievements
 *     description: API to manage user achievements.
 */

/**
 * @swagger
 * /api/user-achievements:
 *   get:
 *     summary: Get the current user's achievements
 *     tags: [User Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the user's achievements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAchievementsInputDTO'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, userAchievementsController.getUserAchievements);

/**
 * @swagger
 * /api/user-achievements:
 *   put:
 *     summary: Update the current user's achievements
 *     tags: [User Achievements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAchievementsInputDTO'
 *     responses:
 *       200:
 *         description: Achievements updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAchievementsInputDTO'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put(
    '/',
    authMiddleware,
    validateRequest(UserAchievementsSchema),
    userAchievementsController.updateUserAchievements,
);

export const userAchievementsRoutes = router;
