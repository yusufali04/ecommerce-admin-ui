import { Credentials, Tenant, TenantFormValues, UserFormValues } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = "/api/auth";
const CATALOG_SERVICE = "/api/catalog";
// Auth service
export const login = (credentials: Credentials) => api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getTenants = (queryString: string) => api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const updateTenant = (tenantId: string, tenantData: TenantFormValues) => api.patch(`${AUTH_SERVICE}/tenants/${tenantId}`, tenantData);
export const createTenant = (tenantData: Tenant) => api.post(`/tenants`, tenantData);
export const createUser = (userData: UserFormValues) => api.post(`/users`, userData);
export const updateUser = (userId: string, userData: UserFormValues) => api.patch(`${AUTH_SERVICE}/users/${userId}`, userData);

// Catalog Service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`)
export const getProducts = (queryString: string) => api.get(`${CATALOG_SERVICE}/products?${queryString}`);
export const createProduct = (data: FormData) => api.post(`${CATALOG_SERVICE}/products`, data, {
    headers: { "Content-Type": "multipart/form-data" }
});