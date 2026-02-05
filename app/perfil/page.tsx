/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserDashboard from '@/components/dashboard/UserDashboard';
import ClinicOwnerDashboard from '@/components/dashboard/ClinicOwnerDashboard';
import EmployeeDashboard from '@/components/dashboard/EmployeeDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { User } from '@/components/dashboard/types';

type DashboardRole = 'user' | 'employee' | 'owner' | 'admin';

export default function UnifiedDashboardPage() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentRole, setCurrentRole] = useState<DashboardRole>('user');

    useEffect(() => {
        fetchUser();

        // Escuchar evento de actualización de usuario (disparado desde UserDashboard)
        const handleUserUpdate = () => {
            fetchUser();
        };

        window.addEventListener('user-updated', handleUserUpdate);

        return () => {
            window.removeEventListener('user-updated', handleUserUpdate);
        };
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${apiUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('auth_token');
                    router.push('/login');
                }
                throw new Error('Error al cargar el perfil');
            }

            const data = await response.json();
            const userData = data.data || data;
            setUser(userData);

            // Determine Role Logic
            let detectedRole: DashboardRole = 'user';

            if (userData.employees && userData.employees.length > 0) {
                // Check the first employee record (assuming single active employment usually)
                const employee = userData.employees[0];
                const roleName = employee.role?.name?.toUpperCase();

                if (roleName === 'OWNER') {
                    detectedRole = 'owner';
                } else if (roleName === 'ADMIN') {
                    detectedRole = 'admin';
                } else {
                    // Doctor, Nurse, Staff, etc.
                    detectedRole = 'employee';
                }
            }

            setCurrentRole(detectedRole);

        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (token) {
                await fetch(`${apiUrl}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
        } finally {
            localStorage.removeItem('auth_token');
            router.push('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            {currentRole === 'user' && <UserDashboard user={user} onLogout={handleLogout} />}
            {currentRole === 'owner' && <ClinicOwnerDashboard user={user} onLogout={handleLogout} />}
            {currentRole === 'employee' && <EmployeeDashboard user={user} onLogout={handleLogout} />}
            {currentRole === 'admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
        </>
    );
}
