// API Configuration for ACAR Labs Backend
const API_BASE_URL = '/api';

// Types
export interface Address {
    id: number;
    province: string;
    canton: string;
    parish: string;
    street: string;
    reference: string;
    country: string;
    city: string;
}

export interface Clinic {
    id: number;
    name: string;
    ruc: string;
    address_id: number;
    address?: Address;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    estimated_time: string;
    clinic_id: number;
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    verified_email: string;
    rol: {
        id: number;
        name: string;
    };
    clinic: Clinic;
}

export interface Appointment {
    id: number;
    scheduled_date: string;
    status: 'pending' | 'process' | 'canceled';
    clinic_id: number;
    customer_id: number;
    employee_id: number;
    service_id: number;
    laboratory_results: unknown[];
    clinic: Clinic;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    identification_number: string;
    gender: string;
    verified_email: string;
    clinic: Clinic;
    address?: Address;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    provider: 'employee' | 'customer';
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// API Error class
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Generic fetch wrapper
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new ApiError(response.status, data.message || 'Error en la petición');
    }

    return data;
}

// ==================== AUTH ====================

export const auth = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await fetchApi<LoginResponse>('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('provider', response.provider);
        }

        return response;
    },

    registerCustomer: async (data: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        date_of_birth?: string;
        identification_number: string;
        gender: string;
        clinic_id: number;
    }): Promise<ApiResponse<Customer>> => {
        return fetchApi('/register-customer', {
            method: 'POST',
            body: JSON.stringify({ ...data, verified_email: 'process' }),
        });
    },

    logout: async (): Promise<void> => {
        try {
            await fetchApi('/logout', { method: 'POST' });
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('provider');
        }
    },

    resetPassword: async (email: string): Promise<void> => {
        return fetchApi('/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    isAuthenticated: (): boolean => {
        return typeof window !== 'undefined' && !!localStorage.getItem('token');
    },

    getProvider: (): string | null => {
        return typeof window !== 'undefined' ? localStorage.getItem('provider') : null;
    },
};

// ==================== CLINICS ====================

export const clinics = {
    getAll: async (): Promise<ApiResponse<Clinic[]>> => {
        return fetchApi('/clinics');
    },

    getById: async (id: number): Promise<ApiResponse<Clinic>> => {
        return fetchApi(`/clinics/${id}`);
    },
};

// ==================== SERVICES ====================

export const services = {
    getAll: async (): Promise<ApiResponse<Service[]>> => {
        return fetchApi('/services');
    },

    getById: async (id: number): Promise<ApiResponse<Service>> => {
        return fetchApi(`/services/${id}`);
    },
};

// ==================== APPOINTMENTS ====================

export const appointments = {
    getAll: async (): Promise<ApiResponse<Appointment[]>> => {
        return fetchApi('/appointments');
    },

    getById: async (id: number): Promise<ApiResponse<Appointment>> => {
        return fetchApi(`/appointments/${id}`);
    },

    create: async (data: {
        scheduled_date: string;
        status: string;
        clinic_id: number;
        customer_id: number;
        employee_id: number;
        service_id: number;
    }): Promise<ApiResponse<Appointment>> => {
        return fetchApi('/appointments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (
        id: number,
        data: Partial<Appointment>
    ): Promise<ApiResponse<Appointment>> => {
        return fetchApi(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    cancel: async (id: number): Promise<ApiResponse<Appointment>> => {
        return fetchApi(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'canceled' }),
        });
    },
};

// ==================== CUSTOMERS ====================

export const customers = {
    getAll: async (): Promise<ApiResponse<Customer[]>> => {
        return fetchApi('/customers');
    },

    getById: async (id: number): Promise<ApiResponse<Customer>> => {
        return fetchApi(`/customers/${id}`);
    },

    update: async (
        id: number,
        data: Partial<Customer>
    ): Promise<ApiResponse<Customer>> => {
        return fetchApi(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};

// ==================== ADDRESSES ====================

export const addresses = {
    getAll: async (): Promise<ApiResponse<Address[]>> => {
        return fetchApi('/addresses');
    },

    getById: async (id: number): Promise<ApiResponse<Address>> => {
        return fetchApi(`/addresses/${id}`);
    },
};

export default {
    auth,
    clinics,
    services,
    appointments,
    customers,
    addresses,
};
