import { UserRole } from '../user/user.types';

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO extends LoginDTO {
    name: string;
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
}

export interface TokenResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
    accessToken: string;
    refreshToken: string;
}

export interface DecodedTokenPayload extends TokenPayload {
    exp: number;
    iat: number;
}
