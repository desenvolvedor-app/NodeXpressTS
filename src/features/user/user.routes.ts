import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { authMiddleware, authorizeRoles } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validator.middleware';
import { updateUserSchema, updateUserRoleSchema } from './user.schema';
import { UserRole } from './user.types';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [USER, ADMIN, MODERATOR]
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *     UpdateUserDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     UpdateUserRoleDTO:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Get user profile
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Update user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDTO'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put('/profile', authMiddleware, validateRequest(updateUserSchema), userController.updateProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Get all users (Admin only)
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', authMiddleware, authorizeRoles(UserRole.ADMIN), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{userId}/role:
 *   patch:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Update user role (Admin only)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRoleDTO'
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.patch(
    '/:userId/role',
    authMiddleware,
    authorizeRoles(UserRole.ADMIN),
    validateRequest(updateUserRoleSchema),
    userController.updateUserRole,
);

export const userRoutes = router;
