// Enum representing user roles
export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
}

// DTO for updating user details (name, email)
export interface UpdateUserDTO {
    name?: string;
    email?: string;
}

// DTO representing the user object
export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

// DTO for updating user role
export interface UserRoleUpdateDTO {
    role: UserRole;
}
