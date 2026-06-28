"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

const STORAGE_KEY = "shk-favorites";

export interface FavoriteAyah {
  id: string; // `ayah-{surahNumber}-{verseNumber}`
  type: "ayah";
  surahNumber: number;
  verseNumber: number;
  textUthmani: string;
  surahNameAr: string;
  timestamp: number;
}

export interface FavoriteHadith {
  id: string; // `hadith-{hadithId}`
  type: "hadith";
  hadithId: number;
  text: string;
  narrator: string | null;
  grade: string;
  bookNameAr: string;
  bookSlug: string;
  chapterTitle?: string;
  chapterOrder?: number;
  timestamp: number;
}

export type FavoriteItem = FavoriteAyah | FavoriteHadith;

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "id" | "timestamp">) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (item: Omit<FavoriteItem, "id" | "timestamp">) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

function makeId(item: Omit<FavoriteItem, "id" | "timestamp">): string {
  const ayah = item as FavoriteAyah;
  const hadith = item as FavoriteHadith;
  return item.type === "ayah"
    ? `ayah-${ayah.surahNumber}-${ayah.verseNumber}`
    : `hadith-${hadith.hadithId}`;
}

function saveData(favorites: FavoriteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const addFavorite = useCallback(
    (item: Omit<FavoriteItem, "id" | "timestamp">) => {
      const id = makeId(item);
      setFavorites((prev) => {
        if (prev.some((f) => f.id === id)) return prev;
        const next = [
          { ...item, id, timestamp: Date.now() } as FavoriteItem,
          ...prev,
        ];
        saveData(next);
        return next;
      });
    },
    [],
  );

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      saveData(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, "id" | "timestamp">) => {
      const id = makeId(item);
      setFavorites((prev) => {
        if (prev.some((f) => f.id === id)) {
          const next = prev.filter((f) => f.id !== id);
          saveData(next);
          return next;
        }
        const next = [
          { ...item, id, timestamp: Date.now() } as FavoriteItem,
          ...prev,
        ];
        saveData(next);
        return next;
      });
    },
    [],
  );

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const value = useMemo(
    () => ({ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }),
    [favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
