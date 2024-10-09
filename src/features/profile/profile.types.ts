import mongoose, { Document } from 'mongoose';

export enum ProfileVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export interface SocialLinks {
    github?: string;
    linkedin?: string;
    website?: string;
}

export interface UserProfileDTO {
    bio?: string;
    skills?: string[];
    social_links?: SocialLinks;
    privacy?: {
        profileVisibility: ProfileVisibility;
        showEmail: boolean;
    };
}

export interface IUserProfile extends Document {
    userId: mongoose.Types.ObjectId;
    bio?: string;
    skills: string[];
    social_links: SocialLinks;
    location?: string;
    jobTitle?: string;
    company?: string;
}
