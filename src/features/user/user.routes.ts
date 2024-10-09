import { Router } from 'express';

import { authMiddleware, authorizeRoles } from '../../common/middleware/auth.middleware';
import { adminActionLimiter } from '../../common/middleware/rate-limiter.middleware';
import { validateRequest } from '../../common/middleware/validator.middleware';
import { UserController } from './user.controller';
import { updateUserRoleSchema, updateUserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserRole } from './user.types';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

/**
 * @swagger
 * components:
 *   schemas:
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
 *     UserRole:
 *       type: string
 *       enum: [USER, ADMIN, MODERATOR]
 *     CreateUserDTO:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
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
 * tags:
 *   - name: User
 *     description: Operations related to users in the system.
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieves a list of all users (Admin only)
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
 * /api/users/{id}:
 *   get:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieves a specific user's details by their ID (Admin or Self)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/:id', authMiddleware, userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Updates user details by their ID (Admin or Self)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDTO'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', authMiddleware, validateRequest(updateUserSchema), userController.updateUserDetails);

/**
 * @swagger
 * /api/users/{id}/deactivate:
 *   put:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Deactivates a user account by their ID (Admin or Self)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User account deactivated successfully
 */
router.put('/:id/deactivate', authMiddleware, userController.deactivateUser);

/**
 * @swagger
 * /api/users/{id}/activate:
 *   put:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Reactivates a user account by their ID (Admin or Self)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User account reactivated successfully
 */
router.put('/:id/activate', authMiddleware, userController.activateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a user account by their ID (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/:id', adminActionLimiter, authMiddleware, authorizeRoles(UserRole.ADMIN), userController.deleteUser);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     summary: Updates user role by their ID (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
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
 */
router.put(
    '/:id/role',
    adminActionLimiter,
    authMiddleware,
    authorizeRoles(UserRole.ADMIN),
    validateRequest(updateUserRoleSchema),
    userController.updateUserRole,
);

export const userRoutes = router;
