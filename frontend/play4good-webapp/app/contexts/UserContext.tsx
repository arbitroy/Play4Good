'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

type User = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
};

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    loadUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const loadUser = async () => {
        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`);
            if (response.ok) {
                const userData = await response.json();
                setUser({
                    id: userData.id,
                    username: userData.username,
                    firstName: userData.first_name.String,
                    lastName: userData.last_name.String,
                    email: userData.email,
                    avatarUrl: userData.avatar_url.String,
                });
            }
        } catch (error) {
            console.error('Error loading user:', error);
            setUser(null);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loadUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}