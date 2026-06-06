"use client";

import { create } from "zustand";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { useAuthStore } from "./useAuthStore";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

interface FavoritesState {
  favorites: string[];
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  initializeFavorites: () => void;
}

const FAVORITES_KEY = "pricewise_favorites";

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  initializeFavorites: async () => {
    if (typeof window === "undefined") return;
    
    // Load local cache first
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        set({ favorites: JSON.parse(saved) });
      }
    } catch (err) {}

    const currentUser = useAuthStore.getState().user;
    if (isFirebaseConfigured() && db && currentUser) {
      try {
        const favoritesCol = collection(db, "users", currentUser.id, "favorites");
        const snapshot = await getDocs(favoritesCol);
        const fbFavorites = snapshot.docs.map((docVal) => docVal.id);
        set({ favorites: fbFavorites });
      } catch (err) {
        console.error("PriceWise: Failed to load favorites from Firestore:", err);
      }
    }
  },

  addFavorite: async (productId) => {
    const current = get().favorites;
    if (current.includes(productId)) return;
    
    const updated = [...current, productId];
    set({ favorites: updated });

    const currentUser = useAuthStore.getState().user;
    if (isFirebaseConfigured() && db && currentUser) {
      try {
        await setDoc(doc(db, "users", currentUser.id, "favorites", productId), {
          favoritedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("PriceWise: Failed to write favorite to Firestore:", err);
      }
    } else {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    }
  },

  removeFavorite: async (productId) => {
    const current = get().favorites;
    const updated = current.filter((id) => id !== productId);
    set({ favorites: updated });

    const currentUser = useAuthStore.getState().user;
    if (isFirebaseConfigured() && db && currentUser) {
      try {
        await deleteDoc(doc(db, "users", currentUser.id, "favorites", productId));
      } catch (err) {
        console.error("PriceWise: Failed to delete favorite from Firestore:", err);
      }
    } else {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    }
  },

  isFavorite: (productId) => {
    return get().favorites.includes(productId);
  },
}));
