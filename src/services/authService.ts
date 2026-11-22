import { supabase, isSupabaseConfigured } from "./supabase";
import { Profile } from "../types";

export const authService = {
  // Sign In with Email & Password
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      // Local fallback for testing before setting up Supabase account
      return this._localSignIn(email, password);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) throw error;
    const profile = await this.getProfile(data.user.id);
    return { session: data.session, user: data.user, profile };
  },

  // Sign Up with Name & Email
  async signUp(email: string, password: string, fullName: string, phone: string = "") {
    if (!isSupabaseConfigured()) {
      return this._localSignUp(email, password, fullName, phone);
    }

    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim()
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error("Не удалось создать пользователя");

    // Profile is automatically created via Supabase PostgreSQL Trigger `on_auth_user_created`
    let profile = await this.getProfile(data.user.id);
    if (!profile) {
      // Direct fallback if trigger is delayed
      const role = cleanEmail === "muhammadganiev235@gmail.com" ? "admin" : "user";
      const { data: createdProf, error: pErr } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: cleanEmail,
          full_name: fullName.trim(),
          phone: phone.trim(),
          role
        })
        .select()
        .single();
      if (!pErr && createdProf) profile = createdProf as Profile;
    }

    return { session: data.session, user: data.user, profile };
  },

  // Sign Out
  async signOut() {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem("hadidja_local_session");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Reset Password via Email
  async resetPassword(email: string) {
    if (!isSupabaseConfigured()) {
      return { message: "Ссылка для сброса пароля отправлена на " + email };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return { message: "Инструкция отправлена на ваш email" };
  },

  // Update Password
  async updatePassword(newPassword: string) {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { success: true };
  },

  // Update Profile details
  async updateProfile(userId: string, updates: Partial<Profile>) {
    if (!isSupabaseConfigured()) {
      return this._localUpdateProfile(userId, updates);
    }

    // Role cannot be updated by user (enforced by RLS)
    const { role, id, ...safeUpdates } = updates;
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...safeUpdates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  // Get Profile by ID
  async getProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured()) {
      return this._localGetProfile(userId);
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return null;
    return data as Profile;
  },

  // ==========================================================================
  // Local Fallback Helpers (Active when .env is not yet configured)
  // Ensures zero crashes & 100% testability out of the box
  // ==========================================================================
  _localSignIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    const usersStr = localStorage.getItem("hadidja_mock_users") || "[]";
    const users = JSON.parse(usersStr);

    let user = users.find((u: any) => u.email === cleanEmail);
    if (!user) {
      if (cleanEmail === "muhammadganiev235@gmail.com" || cleanEmail === "admin@hadidja.tj") {
        user = {
          id: "admin-muhammad-01",
          email: cleanEmail,
          full_name: "Мухаммад (Владелец)",
          phone: "+992 88 600 65 28",
          role: "admin",
          avatar_url: ""
        };
        users.push(user);
        localStorage.setItem("hadidja_mock_users", JSON.stringify(users));
      } else {
        throw new Error("Пользователь с таким email не найден");
      }
    }

    const session = {
      access_token: "mock-jwt-" + Date.now(),
      user: { id: user.id, email: user.email }
    };
    localStorage.setItem("hadidja_local_session", JSON.stringify({ session, user }));
    return { session, user: { id: user.id, email: user.email }, profile: user as Profile };
  },

  _localSignUp(email: string, password: string, fullName: string, phone: string) {
    const cleanEmail = email.trim().toLowerCase();
    const usersStr = localStorage.getItem("hadidja_mock_users") || "[]";
    const users = JSON.parse(usersStr);

    if (users.some((u: any) => u.email === cleanEmail)) {
      throw new Error("Пользователь с таким email уже зарегистрирован");
    }

    const role = cleanEmail === "muhammadganiev235@gmail.com" ? "admin" : "user";
    const newUser: Profile = {
      id: "usr-" + Date.now(),
      email: cleanEmail,
      full_name: fullName.trim(),
      phone: phone.trim(),
      role: role as "admin" | "user",
      avatar_url: "",
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("hadidja_mock_users", JSON.stringify(users));

    const session = {
      access_token: "mock-jwt-" + Date.now(),
      user: { id: newUser.id, email: newUser.email }
    };
    localStorage.setItem("hadidja_local_session", JSON.stringify({ session, user: newUser }));
    return { session, user: { id: newUser.id, email: newUser.email }, profile: newUser };
  },

  _localGetProfile(userId: string): Profile | null {
    const sessionStr = localStorage.getItem("hadidja_local_session");
    if (sessionStr) {
      try {
        const { user } = JSON.parse(sessionStr);
        if (user && user.id === userId) return user as Profile;
      } catch (e) {}
    }
    const usersStr = localStorage.getItem("hadidja_mock_users") || "[]";
    const users = JSON.parse(usersStr);
    return users.find((u: any) => u.id === userId) || null;
  },

  _localUpdateProfile(userId: string, updates: Partial<Profile>): Profile {
    const usersStr = localStorage.getItem("hadidja_mock_users") || "[]";
    const users = JSON.parse(usersStr);
    const idx = users.findIndex((u: any) => u.id === userId);
    let updated: Profile;

    if (idx !== -1) {
      updated = { ...users[idx], ...updates, id: userId };
      users[idx] = updated;
      localStorage.setItem("hadidja_mock_users", JSON.stringify(users));
    } else {
      updated = {
        id: userId,
        email: "user@hadidja.tj",
        full_name: "Пользователь",
        role: "user",
        ...updates
      } as Profile;
    }

    const sessionStr = localStorage.getItem("hadidja_local_session");
    if (sessionStr) {
      const parsed = JSON.parse(sessionStr);
      parsed.user = updated;
      localStorage.setItem("hadidja_local_session", JSON.stringify(parsed));
    }

    return updated;
  }
};
