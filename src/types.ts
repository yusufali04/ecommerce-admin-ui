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

export type ProductAttribute = {
    name: string;
    value: string | boolean;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    priceConfiguration: PriceConfiguration;
    attributes: ProductAttribute[];
    tenantId: string;
    categoryId: Category;
    image: string;
    isPublished: string;
}

export interface CategoryPriceConfiguration {
    priceType: "base" | "additional";
    availableOptions: string[];
}

export interface Promo {
    _id?: string;
    code: string;
    title: string;
    tenantId?: string;
    discount: string;
    validUpto: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Customer {
    _id: string;
    firstName: string;
    lastName: string
}

export type Topping = {
    _id: string;
    name: string;
    price: number;
    image: string;
    isAvailable: boolean;
}

export interface CartItem extends Pick<Product, '_id' | 'name' | 'image' | 'priceConfiguration'> {
    chosenConfiguration: {
        priceConfiguration: {
            [key: string]: string
        };
        selectedToppings: Topping[];
    };
    qty: number;
}

export enum PaymentMode {
    CASH = "cash",
    CARD = "card"
}
export enum OrderStatus {
    RECEIVED = "received",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    PREPARED = "prepared",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered"
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}

export interface Order {
    _id: string
    cart: CartItem[];
    customerId: Customer;
    total: number;
    discount: number;
    taxes: number;
    deliveryCharges: number;
    address: string;
    tenantId: string;
    comment?: string;
    paymentMode: PaymentMode;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentReferenceId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum OrderEvents {
    ORDER_CREATE = "ORDER_CREATE",
    PAYMENT_STATUS_UPDATE = "PAYMENT_STATUS_UPDATE",
    ORDER_STATUS_UPDATE = "ORDER_STATUS_UPDATE"
}