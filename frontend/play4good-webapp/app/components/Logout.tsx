'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();
    const api_url = process.env.NEXT_PUBLIC_API_URL;

    const handleLogout = async () => {
        try {
            // Call logout endpoint to invalidate token
            await fetch(`${api_url}/api/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            // Clear session storage
            sessionStorage.clear();
            
            // Redirect to login page
            router.push('/auth');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}