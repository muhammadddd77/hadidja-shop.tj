import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../services/supabase";
import { authService } from "../services/authService";
import { Profile, UserRole } from "../types";

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  role: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ role: UserRole; profile: Profile }>;
  signUp: (email: string, pass: string, name: string, phone?: string) => Promise<{ role: UserRole; profile: Profile }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth session
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          const local = localStorage.getItem("hadidja_local_session");
          if (local && mounted) {
            const { user: localProf } = JSON.parse(local);
            setUser({ id: localProf.id, email: localProf.email });
            setProfile(localProf);
          }
          if (mounted) setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          const prof = await authService.getProfile(session.user.id);
          if (mounted) setProfile(prof);
        }
      } catch (err) {
        console.warn("Auth initialization warning:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;
          if (session?.user) {
            setUser(session.user);
            const prof = await authService.getProfile(session.user.id);
            if (mounted) setProfile(prof);
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      );

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    const res = await authService.signIn(email, pass);

    if (!res.profile) {
      throw new Error("Профиль пользователя не найден. Проверьте аккаунт в Supabase.");
    }

    setUser(res.user);
    setProfile(res.profile);
    return { role: res.profile.role, profile: res.profile };
  };

  const signUp = async (email: string, pass: string, name: string, phone: string = "") => {
    const res = await authService.signUp(email, pass, name, phone);

    // With email confirmation enabled, Supabase may create the account
    // without starting a session. In that case profile access is blocked by RLS.
    if (!res.profile) {
      setUser(null);
      setProfile(null);
      throw new Error(
        "Аккаунт создан, но вход пока не выполнен. Подтвердите email по письму от Supabase. Если письмо не пришло, нужно настроить SMTP."
      );
    }

    setUser(res.user);
    setProfile(res.profile);
    return { role: res.profile.role, profile: res.profile };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) throw new Error("Не авторизован");
    const updated = await authService.updateProfile(profile.id, updates);
    setProfile(updated);
    return updated;
  };

  const role = profile?.role || null;
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
