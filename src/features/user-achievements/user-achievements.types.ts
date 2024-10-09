import mongoose, { Document } from 'mongoose';

export type HackathonParticipation = {
    title: string;
    date: Date;
    position: string;
};

export interface IUserAchievementDocument extends Document {
    userId: mongoose.Types.ObjectId;
    hackathons: HackathonParticipation[];
    badges: string[];
    points: number;
    level: number;
}
