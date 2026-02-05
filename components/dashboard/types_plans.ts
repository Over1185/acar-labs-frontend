export interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string; // The backend might return string or number, based on typical Laravel API responses check types.ts
    billing_cycle: string;
    features: string[];
    is_active: boolean;
}
