import { httpClient, ApiResponse } from "./http-client";

// ============================================
// Types
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  stock?: number;
  minStock?: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  visits: number;
  lastVisit?: string;
}

export interface Appointment {
  id: number;
  clientId: number;
  clientName: string;
  serviceId: number;
  serviceName: string;
  professionalId: number;
  professionalName: string;
  date: string;
  time: string;
  duration: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  salonName: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// API Service
// ============================================

export const api = {
  // Auth
  auth: {
    login: (credentials: LoginCredentials) =>
      httpClient.post<AuthResponse>("/auth/login", credentials),
    
    register: (data: RegisterData) =>
      httpClient.post<AuthResponse>("/auth/register", data),
    
    logout: () =>
      httpClient.post("/auth/logout"),
    
    me: () =>
      httpClient.get<User>("/auth/me"),
  },

  // Users
  users: {
    list: () =>
      httpClient.get<User[]>("/users/list"),
    
    getById: (id: number) =>
      httpClient.get<User>(`/users/${id}`),
    
    update: (id: number, data: Partial<User>) =>
      httpClient.put<User>(`/users/${id}`, data),
    
    delete: (id: number) =>
      httpClient.delete(`/users/${id}`),
  },

  // Products
  products: {
    list: () =>
      httpClient.get<Product[]>("/products/list"),
    
    getById: (id: number) =>
      httpClient.get<Product>(`/products/list/${id}`),
    
    create: (data: Omit<Product, "id">) =>
      httpClient.post<Product>("/products", data),
    
    update: (id: number, data: Partial<Product>) =>
      httpClient.put<Product>(`/products/${id}`, data),
    
    delete: (id: number) =>
      httpClient.delete(`/products/${id}`),
  },

  // Product Categories
  categories: {
    list: () =>
      httpClient.get<ProductCategory[]>("/products-categories/list"),
    
    getById: (id: number) =>
      httpClient.get<ProductCategory>(`/products-categories/list/${id}`),
  },

  // Clients
  clients: {
    list: () =>
      httpClient.get<Client[]>("/clients/list"),
    
    getById: (id: number) =>
      httpClient.get<Client>(`/clients/${id}`),
    
    create: (data: Omit<Client, "id" | "visits">) =>
      httpClient.post<Client>("/clients", data),
    
    update: (id: number, data: Partial<Client>) =>
      httpClient.put<Client>(`/clients/${id}`, data),
    
    delete: (id: number) =>
      httpClient.delete(`/clients/${id}`),
  },

  // Appointments
  appointments: {
    list: (date?: string) =>
      httpClient.get<Appointment[]>("/appointments/list", date ? { date } : undefined),
    
    getById: (id: number) =>
      httpClient.get<Appointment>(`/appointments/${id}`),
    
    create: (data: Omit<Appointment, "id" | "clientName" | "serviceName" | "professionalName">) =>
      httpClient.post<Appointment>("/appointments", data),
    
    update: (id: number, data: Partial<Appointment>) =>
      httpClient.put<Appointment>(`/appointments/${id}`, data),
    
    cancel: (id: number) =>
      httpClient.put<Appointment>(`/appointments/${id}/cancel`),
    
    confirm: (id: number) =>
      httpClient.put<Appointment>(`/appointments/${id}/confirm`),
  },

  // Reports
  reports: {
    dashboard: () =>
      httpClient.get<{
        appointmentsToday: number;
        activeClients: number;
        monthlyRevenue: number;
        occupancyRate: number;
      }>("/reports/dashboard"),
    
    monthly: (month: string) =>
      httpClient.get<{
        revenue: number;
        newClients: number;
        appointments: number;
        services: number;
        topServices: Array<{ name: string; count: number; revenue: number }>;
        topProfessionals: Array<{ name: string; services: number; revenue: number }>;
      }>(`/reports/monthly/${month}`),
  },
};

export default api;
