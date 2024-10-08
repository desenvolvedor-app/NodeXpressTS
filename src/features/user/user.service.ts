import { NotFoundError } from '../../common/utils/error.util';
import { User } from './user.model';
import { CreateUserDTO, UpdateUserDTO, UserRole } from './user.types';

export class UserService {
    constructor() {}

    async getAllUsers() {
        return await User.find();
    }

    async getUserById(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    async createUser(userData: CreateUserDTO) {
        // Add any necessary validations (e.g., password strength, email uniqueness)
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const user = new User(userData);
        await user.save();
        return user;
    }

    async updateUserDetails(userId: string, updatedData: UpdateUserDTO) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        Object.assign(user, updatedData);
        await user.save();
        return user;
    }

    async deactivateUser(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.isActive === false) {
            throw new Error('User is already deactivated');
        }

        user.isActive = false;
        await user.save();
        return user;
    }

    async activateUser(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.isActive === true) {
            throw new Error('User is already active');
        }

        user.isActive = true;
        await user.save();
        return user;
    }

    async deleteUser(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        await User.deleteOne({ _id: userId });
        return { message: 'User account deleted successfully' };
    }

    async updateUserRole(userId: string, newRole: UserRole) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!Object.values(UserRole).includes(newRole)) {
            throw new Error('Invalid role');
        }

        user.role = newRole;
        await user.save();
        return user;
    }
}
