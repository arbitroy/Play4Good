'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = 'auth=true; max-age=0;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict';
        router.push('/auth');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}
