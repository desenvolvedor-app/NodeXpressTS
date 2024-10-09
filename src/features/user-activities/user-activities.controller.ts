import { Response } from 'express';

import { asyncHandler } from '../../common/utils/async.util';
import { ForbiddenError, NotFoundError } from '../../common/utils/error.util';
import { AuthRequest } from '../auth/auth.types';
import { UserRole } from '../user/user.types';
import { UserActivitiesService } from './user-activities.service';

export class UserActivitiesController {
    constructor(private userActivitiesService = new UserActivitiesService()) {}

    private ensureAuthenticated(req: AuthRequest): void {
        if (!req.user) {
            throw new ForbiddenError('You do not have permission to perform this action');
        }
    }

    private ensureAdmin(req: AuthRequest): void {
        this.ensureAuthenticated(req);
        if (req.user?.role !== UserRole.ADMIN) {
            throw new ForbiddenError('Access denied: Admins only');
        }
    }

    getUserActivities = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        this.ensureAdmin(req);

        const { userId } = req.params;
        if (!userId) {
            throw new NotFoundError('User ID not provided');
        }

        const activities = await this.userActivitiesService.getUserActivities(userId);
        res.status(200).json(activities);
    });
}
