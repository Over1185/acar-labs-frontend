'use client';

import { User } from './types';

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

export default function ClinicOwnerDashboard({ user, onLogout }: DashboardProps) {
    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Clinic Owner Dashboard</h1>
            <p>Welcome, {user.name}. Management features coming soon.</p>
            <button onClick={onLogout} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Logout</button>
        </div>
    );
}
