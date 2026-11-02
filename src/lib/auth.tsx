import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { syncCustomerProfile, getCustomerProfile, type CustomerProfile } from "@/lib/customer-service";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  customerProfile: CustomerProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: Error | null; needsEmailVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "aiel_mock_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  const loadProfile = async (currentUser: User) => {
    try {
      const profile = await getCustomerProfile(currentUser);
      if (profile) setCustomerProfile(profile);
    } catch (e) {
      console.warn("Could not load customer profile:", e);
    }
  };

  useEffect(() => {
    // If Supabase is configured with a valid key, use live Supabase Auth
    if (isConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user);
        }
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await syncCustomerProfile(currentUser);
          await loadProfile(currentUser);
        } else {
          setCustomerProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline / Local mock mode fallback if Supabase credentials are pending
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          setUser(parsed);
        }
      } catch (e) {
        console.warn("Failed to load local user session:", e);
      }
      setLoading(false);
      return undefined;
    }
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    if (isConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (!error && data.user) {
        await syncCustomerProfile(data.user);
        await loadProfile(data.user);
      }
      return { error };
    } else {
      // Mock sign-in for preview fallback
      const mockUser = {
        id: "mock-" + Date.now(),
        email,
        user_metadata: { full_name: email.split("@")[0] },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;

      setUser(mockUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      return { error: null };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (isConfigured) {
      const redirectUrl =
        typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName || email.split("@")[0],
          },
          emailRedirectTo: redirectUrl,
        },
      });
      const needsEmailVerification = !data.session;
      if (!error && data.user) {
        await syncCustomerProfile(data.user);
        await loadProfile(data.user);
      }
      return { error, needsEmailVerification };
    } else {
      // Mock sign-up
      const mockUser = {
        id: "mock-" + Date.now(),
        email,
        user_metadata: { full_name: fullName || email.split("@")[0] },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;

      setUser(mockUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      return { error: null, needsEmailVerification: false };
    }
  };

  const signInWithGoogle = async () => {
    if (isConfigured) {
      const redirectUrl =
        typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      return { error };
    }
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    if (isConfigured) {
      const redirectUrl =
        typeof window !== "undefined" ? `${window.location.origin}/account` : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });
      return { error };
    }
    return { error: null };
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      setUser(null);
      setSession(null);
      setCustomerProfile(null);
    }
  };

  const reloadProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        customerProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        signOut,
        reloadProfile,
        isConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
