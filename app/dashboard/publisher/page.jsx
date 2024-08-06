'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setRole } from '../../store/sessionSlice';
import { ContentManager } from '../../components/ContentManager';
import { SessionSwitcher } from '../../components/SessionSwitcher';

export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, role } = useSelector(state => state.session);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        } else {
            dispatch(setRole(role));
        }
    }, [user, role, router, dispatch]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h1>
                <SessionSwitcher />
            </div>
            <ContentManager />
        </div>
    );
}