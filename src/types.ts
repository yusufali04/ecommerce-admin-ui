export type Credentials = {
    email: string,
    password: string
}

export interface Tenant {
    id: number;
    name: string;
    address: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    tenant?: Tenant;
    updatedAt?: string;
}