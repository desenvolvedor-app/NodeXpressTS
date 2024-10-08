import { User } from './user.model';
import { AppError } from '../../common/utils/error.util';
import { UpdateUserDTO, UserRoleUpdateDTO } from './user.types';

export class UserService {
    async getUserProfile(userId: string) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async updateUser(userId: string, updateData: UpdateUserDTO) {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        if (updateData.email) {
            const existingUser = await User.findOne({
                email: updateData.email,
                _id: { $ne: userId },
            });
            if (existingUser) {
                throw new AppError('Email already in use', 400);
            }
        }

        Object.assign(user, updateData);
        await user.save();

        return user.toObject({
            transform: (_, ret) => {
                delete ret.password;
                return ret;
            },
        });
    }

    async deleteUser(userId: string) {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            throw new AppError('User not found', 404);
        }
    }

    // Missing function to get all users
    async getAllUsers() {
        const users = await User.find().select('-password');
        if (!users) {
            throw new AppError('No users found', 404);
        }
        return users;
    }

    // Missing function to update the role of a user
    async updateUserRole(userId: string, newRole: UserRoleUpdateDTO['role']) {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        user.role = newRole;
        await user.save();

        return user.toObject({
            transform: (_, ret) => {
                delete ret.password;
                return ret;
            },
        });
    }
}
