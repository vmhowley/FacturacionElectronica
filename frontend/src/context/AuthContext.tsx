import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import axios from '../api';

interface UserProfile {
    id: number;
    username: string;
    role: string;
    tenant_id: number;
    tenant_name: string;
}

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    needsMFA: boolean;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    signOut: async () => { },
    isAdmin: false,
    needsMFA: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [needsMFA, setNeedsMFA] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            setProfile(res.data);
        } catch (err) {
            console.error('Error fetching profile', err);
        }
    };

    useEffect(() => {
        // Helper to safely check MFA
        const checkMFA = async (session: Session | null) => {
            if (!session) return false;
            try {
                if (!supabase.auth.mfa) {
                   console.warn("Supabase MFA API not available");
                   return false;
                }
                const { data: mfaData, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
                if (error) {
                    console.error("MFA Check Error:", error);
                    return false;
                }
                if (mfaData && mfaData.currentLevel === 'aal1' && mfaData.nextLevel === 'aal2') {
                    return true;
                }
            } catch (err) {
                console.error("MFA Check Crash:", err);
            }
            return false;
        };

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session) {
                 const needs2FA = await checkMFA(session);
                 setNeedsMFA(needs2FA);
                 await fetchProfile();
            } else {
                 setNeedsMFA(false);
                 setProfile(null);
            }
            setLoading(false);
        }).catch(err => {
            console.error("Session restore error:", err);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session) {
                const needs2FA = await checkMFA(session);
                setNeedsMFA(needs2FA);
                // We don't await here because onAuthStateChange is an event listener
                // and we don't want to block UI updates if profile takes time,
                // BUT for consistency we can manage loading if needed.
                // However, the initial load is critical.
                fetchProfile(); 
            } else {
                setProfile(null);
                setNeedsMFA(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ 
            session, 
            user, 
            profile, 
            loading, 
            signOut,
            isAdmin: profile?.role === 'admin',
            needsMFA
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
