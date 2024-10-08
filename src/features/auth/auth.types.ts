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
