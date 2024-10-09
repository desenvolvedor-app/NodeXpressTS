import mongoose from 'mongoose';

import { AppError, NotFoundError } from '../../common/utils/error.util';
import { User } from './user.model';
import { CreateUserDTO, UpdateUserDTO, UserRole } from './user.types';

export class UserService {
    constructor() {}

    async getAllUsers() {
        return await User.find();
    }

    async getUserById(userId: string | mongoose.Types.ObjectId) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new AppError('Invalid user ID format', 400); // Invalid ID format
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    async getUserByEmail(email: string) {
        if (!email || typeof email !== 'string') {
            throw new AppError('Invalid email format', 400); // Ensure valid email
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    async createUser(userData: CreateUserDTO) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new AppError('Email already exists', 409); // 409 Conflict is more appropriate
        }

        const user = new User(userData);
        await user.save();
        return user;
    }

    async updateUserDetails(userId: string, updatedData: UpdateUserDTO) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new AppError('Invalid user ID format', 400); // Invalid ID format
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        Object.assign(user, updatedData);
        await user.save();
        return user;
    }

    async deactivateUser(userId: string) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new AppError('Invalid user ID format', 400); // Invalid ID format
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.isActive === false) {
            throw new AppError('User is already deactivated', 400); // Bad request
        }

        user.isActive = false;
        await user.save();
        return user;
    }

    async activateUser(userId: string) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new AppError('Invalid user ID format', 400); // Invalid ID format
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.isActive === true) {
            throw new AppError('User is already active', 400); // Bad request
        }

        user.isActive = true;
        await user.save();
        return user;
    }

    async deleteUser(userId: string) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new AppError('Invalid user ID format', 400); // Invalid ID format
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        await User.deleteOne({ _id: userId });
        return { message: 'User account deleted successfully' };
    }

    async updateUserRole(userId: string, newRole: UserRole) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new AppError('Invalid user ID format', 400); // Invalid ID format
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!Object.values(UserRole).includes(newRole)) {
            throw new AppError('Invalid role', 400); // 400 Bad Request for invalid role
        }

        user.role = newRole;
        await user.save();
        return user;
    }
}
