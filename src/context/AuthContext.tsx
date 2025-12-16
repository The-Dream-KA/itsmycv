'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [loading, setLoading] = useState<boolean>(() => !initialUser);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        let isMounted = true;

        const syncUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!isMounted) return;
            if (error || !user) {
                setUser(null);
            } else {
                setUser(user);
            }
            setLoading(false);
        };

        void syncUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            void syncUser();
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    const value: AuthContextValue = {
        user,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
