import { Credentials, Tenant, TenantFormValues, UserFormValues } from "../types";
import { api } from "./client";

// Auth service
export const login = (credentials: Credentials) => api.post('/auth/login', credentials);
export const self = () => api.get('/auth/self');
export const logout = () => api.post('/auth/logout');
export const getUsers = (queryString: string) => api.get(`/users?${queryString}`);
export const getTenants = (queryString: string) => api.get(`/tenants?${queryString}`);
export const updateTenant = (tenantId: string, tenantData: TenantFormValues) => api.patch(`/tenants/${tenantId}`, tenantData);
export const createTenant = (tenantData: Tenant) => api.post('/tenants', tenantData);
export const createUser = (userData: UserFormValues) => api.post('/users', userData);
export const updateUser = (userId: string, userData: UserFormValues) => api.patch(`/users/${userId}`, userData);