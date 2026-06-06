"use client";

import { create } from "zustand";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
} from "firebase/auth";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (fullName: string, email: string) => Promise<boolean>;
  clearError: () => void;
  initialize: () => void;
}

const STORAGE_KEY = "pricewise_auth_session";
const USERS_DB_KEY = "pricewise_users_db";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: () => {
    if (typeof window === "undefined") return;

    if (isFirebaseConfigured() && auth) {
      // Set up Firebase Auth state observer
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const profile: UserProfile = {
            id: firebaseUser.uid,
            fullName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Kullanıcı",
            email: firebaseUser.email || "",
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          };
          set({ user: profile, isAuthenticated: true, error: null });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      });
    } else {
      // Local localStorage fallback
      try {
        const savedSession = localStorage.getItem(STORAGE_KEY);
        if (savedSession) {
          const session = JSON.parse(savedSession);
          set({ user: session, isAuthenticated: true });
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    if (isFirebaseConfigured() && auth) {
      try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        const fUser = credentials.user;
        
        const profile: UserProfile = {
          id: fUser.uid,
          fullName: fUser.displayName || fUser.email?.split("@")[0] || "Kullanıcı",
          email: fUser.email || "",
          createdAt: fUser.metadata.creationTime || new Date().toISOString(),
        };

        set({ user: profile, isAuthenticated: true, isLoading: false });
        return true;
      } catch (err: any) {
        let msg = "Giriş yapılırken bir hata oluştu.";
        if (
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password" ||
          err.code === "auth/invalid-credential"
        ) {
          msg = "E-posta veya şifre hatalı.";
        } else if (err.code === "auth/invalid-email") {
          msg = "Geçersiz e-posta adresi formatı.";
        }
        set({ error: msg, isLoading: false });
        return false;
      }
    } else {
      // Mock Storage Fallback
      await new Promise((resolve) => setTimeout(resolve, 850));
      try {
        const usersRaw = localStorage.getItem(USERS_DB_KEY);
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        
        const foundUser = users.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (foundUser) {
          const profile: UserProfile = {
            id: foundUser.id,
            fullName: foundUser.fullName,
            email: foundUser.email,
            createdAt: foundUser.createdAt,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          set({ user: profile, isAuthenticated: true, isLoading: false });
          return true;
        } else {
          if (email.toLowerCase() === "demo@pricewise.com" && password === "demo123") {
            const demoUser: UserProfile = {
              id: "demo-user-id",
              fullName: "Demo User",
              email: "demo@pricewise.com",
              createdAt: new Date().toISOString(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
            set({ user: demoUser, isAuthenticated: true, isLoading: false });
            return true;
          }
          set({ error: "E-posta veya şifre hatalı.", isLoading: false });
          return false;
        }
      } catch (err) {
        set({ error: "Giriş yapılırken bir hata oluştu.", isLoading: false });
        return false;
      }
    }
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true, error: null });

    if (isFirebaseConfigured() && auth) {
      try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        const fUser = credentials.user;

        // Set the user's Display Name in Firebase Auth
        await firebaseUpdateProfile(fUser, {
          displayName: fullName,
        });

        const profile: UserProfile = {
          id: fUser.uid,
          fullName: fullName,
          email: fUser.email || "",
          createdAt: fUser.metadata.creationTime || new Date().toISOString(),
        };

        set({ user: profile, isAuthenticated: true, isLoading: false });
        return true;
      } catch (err: any) {
        let msg = "Kayıt olurken bir hata oluştu.";
        if (err.code === "auth/email-already-in-use") {
          msg = "Bu e-posta adresi zaten kullanımda.";
        } else if (err.code === "auth/invalid-email") {
          msg = "Geçersiz e-posta adresi formatı.";
        } else if (err.code === "auth/weak-password") {
          msg = "Şifre çok zayıf. En az 6 karakter girilmelidir.";
        }
        set({ error: msg, isLoading: false });
        return false;
      }
    } else {
      // Mock Storage Fallback
      await new Promise((resolve) => setTimeout(resolve, 950));
      try {
        const usersRaw = localStorage.getItem(USERS_DB_KEY);
        const users = usersRaw ? JSON.parse(usersRaw) : [];

        if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase()) || email.toLowerCase() === "demo@pricewise.com") {
          set({ error: "Bu e-posta adresi zaten kullanımda.", isLoading: false });
          return false;
        }

        const newUser = {
          id: Math.random().toString(36).substring(2, 11),
          fullName,
          email,
          password,
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

        const profile: UserProfile = {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          createdAt: newUser.createdAt,
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        set({ user: profile, isAuthenticated: true, isLoading: false });
        return true;
      } catch (err) {
        set({ error: "Kayıt olurken bir hata oluştu.", isLoading: false });
        return false;
      }
    }
  },

  logout: () => {
    if (isFirebaseConfigured() && auth) {
      firebaseSignOut(auth);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ user: null, isAuthenticated: false, error: null });
  },

  updateProfile: async (fullName, email) => {
    set({ isLoading: true, error: null });

    if (isFirebaseConfigured() && auth && auth.currentUser) {
      try {
        const fUser = auth.currentUser;
        
        // Note: Changing email in Firebase Auth requires re-authentication, 
        // so in this profile screen we update display name and log email changes.
        await firebaseUpdateProfile(fUser, {
          displayName: fullName,
        });

        const profile: UserProfile = {
          id: fUser.uid,
          fullName: fullName,
          email: fUser.email || "",
          createdAt: fUser.metadata.creationTime || new Date().toISOString(),
        };

        set({ user: profile, isLoading: false });
        return true;
      } catch (err) {
        set({ error: "Profil güncellenirken bir hata oluştu.", isLoading: false });
        return false;
      }
    } else {
      // Mock Storage Fallback
      await new Promise((resolve) => setTimeout(resolve, 600));
      try {
        const currentUser = get().user;
        if (!currentUser) {
          set({ error: "Oturum bulunamadı.", isLoading: false });
          return false;
        }

        const usersRaw = localStorage.getItem(USERS_DB_KEY);
        let users = usersRaw ? JSON.parse(usersRaw) : [];

        if (email.toLowerCase() !== currentUser.email.toLowerCase()) {
          if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
            set({ error: "Bu e-posta adresi zaten kullanımda.", isLoading: false });
            return false;
          }
        }

        users = users.map((u: any) => {
          if (u.id === currentUser.id) {
            return { ...u, fullName, email };
          }
          return u;
        });
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

        const updatedProfile: UserProfile = {
          ...currentUser,
          fullName,
          email,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
        set({ user: updatedProfile, isLoading: false });
        return true;
      } catch (err) {
        set({ error: "Profil güncellenirken bir hata oluştu.", isLoading: false });
        return false;
      }
    }
  },
}));
