import { Document, Types } from 'mongoose';

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

export interface UserProfileDocument extends Document {
    userId: Types.ObjectId;
    bio?: string;
    skills?: string[];
    social_links?: SocialLinks;
    privacy: {
        profileVisibility: ProfileVisibility;
        showEmail: boolean;
    };
}
