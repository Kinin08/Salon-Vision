"use client";

import useSWR, { SWRConfiguration } from "swr";
import { api, User, Product, Client, Appointment, ProductCategory } from "./api";

// ============================================
// SWR Fetchers
// ============================================

const fetchers = {
  users: () => api.users.list().then((res) => res.data),
  products: () => api.products.list().then((res) => res.data),
  categories: () => api.categories.list().then((res) => res.data),
  clients: () => api.clients.list().then((res) => res.data),
  appointments: (date?: string) => api.appointments.list(date).then((res) => res.data),
  dashboard: () => api.reports.dashboard().then((res) => res.data),
  me: () => api.auth.me().then((res) => res.data),
};

// ============================================
// Custom Hooks
// ============================================

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 5000,
};

export function useUsers(config?: SWRConfiguration) {
  return useSWR<User[] | undefined>("users", fetchers.users, {
    ...defaultConfig,
    ...config,
  });
}

export function useProducts(config?: SWRConfiguration) {
  return useSWR<Product[] | undefined>("products", fetchers.products, {
    ...defaultConfig,
    ...config,
  });
}

export function useCategories(config?: SWRConfiguration) {
  return useSWR<ProductCategory[] | undefined>("categories", fetchers.categories, {
    ...defaultConfig,
    ...config,
  });
}

export function useClients(config?: SWRConfiguration) {
  return useSWR<Client[] | undefined>("clients", fetchers.clients, {
    ...defaultConfig,
    ...config,
  });
}

export function useAppointments(date?: string, config?: SWRConfiguration) {
  return useSWR<Appointment[] | undefined>(
    date ? `appointments-${date}` : "appointments",
    () => fetchers.appointments(date),
    {
      ...defaultConfig,
      ...config,
    }
  );
}

export function useDashboard(config?: SWRConfiguration) {
  return useSWR<{
    appointmentsToday: number;
    activeClients: number;
    monthlyRevenue: number;
    occupancyRate: number;
  } | undefined>("dashboard", fetchers.dashboard, {
    ...defaultConfig,
    ...config,
  });
}

export function useCurrentUser(config?: SWRConfiguration) {
  return useSWR<User | undefined>("me", fetchers.me, {
    ...defaultConfig,
    ...config,
  });
}

// ============================================
// Auth Hook
// ============================================

export function useAuth() {
  const { data: user, error, isLoading, mutate } = useCurrentUser();

  const login = async (email: string, password: string) => {
    const response = await api.auth.login({ email, password });
    if (response.data?.token) {
      localStorage.setItem("auth_token", response.data.token);
      await mutate();
    }
    return response;
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    salonName: string;
    password: string;
  }) => {
    const response = await api.auth.register(data);
    if (response.data?.token) {
      localStorage.setItem("auth_token", response.data.token);
      await mutate();
    }
    return response;
  };

  const logout = async () => {
    await api.auth.logout();
    localStorage.removeItem("auth_token");
    await mutate(undefined);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    login,
    register,
    logout,
  };
}
