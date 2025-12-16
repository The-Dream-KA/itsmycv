/**
 * Server-side authentication utilities
 * @module lib/auth
 */

import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

/**
 * Check if the current user is authenticated (server-side only)
 * @returns Promise<boolean> - True if user is authenticated, false otherwise
 * 
 * @security CRITICAL - This function must only be called in Server Components
 * to prevent client-side authentication state leakage.
 */
export async function isUserAuthenticated(): Promise<boolean> {
    try {
        const supabase = await createClient();
        // SECURITY: Use getUser() to verify with Supabase Auth server
        const { data: { user }, error } = await supabase.auth.getUser();
        return !error && !!user;
    } catch (error) {
        console.error('[AUTH] Error checking authentication:', error);
        return false;
    }
}

/**
 * Retrieve a VERIFIED user from Supabase Auth (server-side only)
 * @returns Promise<User | null> - Verified user or null when unauthenticated
 */
export async function getVerifiedUser(): Promise<User | null> {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            return null;
        }
        return user;
    } catch (error) {
        console.error('[AUTH] Error fetching verified user:', error);
        return null;
    }
}
