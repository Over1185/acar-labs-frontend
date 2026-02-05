/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Role {
    id: number;
    name: string;
}

export interface Clinic {
    id: number;
    name: string;
    status: string;
    ruc?: string;
    address?: {
        province: string;
        country: string;
        city: string;
        canton: string;
    };
    services?: any[];
    employees?: any[];
}

export interface Employee {
    id: number;
    user_id: number;
    clinic_id: number;
    role_id: number;
    status: string;
    clinic: Clinic;
    role: Role;
}

export interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    employees?: Employee[];
}

export interface Service {
    id: number;
    clinic_id?: number;
    name: string;
    description: string;
    price: number;
    estimated_time: number;
    is_active: boolean;
}

export interface Appointment {
    id: number;
    scheduled_date: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
    clinic: {
        id: number;
        name: string;
    };
    service: Service;
    employee?: {
        name: string;
    };
    laboratoryResults?: {
        id: number;
        test_type: string;
        result: string;
    }[];
    created_at: string;
}
