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

export interface UserFormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    tenantId: number;
}

export type FieldData = {
    name: string[];
    value?: string;
}

export type TenantFormValues = {
    name: string;
    address: string;
}

export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    _id?: string;
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: Category;
    image: string;
    isPublished: string;
}