"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "shk-reading-progress";

interface ChapterProgress {
  read: number[];
  last: number | null;
}

type ProgressData = Record<string, ChapterProgress>;

interface ReadingProgressContextType {
  markRead: (bookSlug: string, chapterOrder: number, hadithNumber: number) => void;
  markUnread: (bookSlug: string, chapterOrder: number, hadithNumber: number) => void;
  isRead: (bookSlug: string, chapterOrder: number, hadithNumber: number) => boolean;
  getChapterReadSet: (bookSlug: string, chapterOrder: number) => Set<number>;
  getLastRead: (bookSlug: string, chapterOrder: number) => number | null;
}

const ReadingProgressContext = createContext<ReadingProgressContextType | null>(null);

function k(bookSlug: string, chapterOrder: number) {
  return `${bookSlug}/${chapterOrder}`;
}

function saveData(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function ReadingProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProgressData>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });

  const markRead = useCallback(
    (bookSlug: string, chapterOrder: number, hadithNumber: number) => {
      setData((prev) => {
        const key = k(bookSlug, chapterOrder);
        const ch = prev[key] || { read: [], last: null };
        if (ch.read.includes(hadithNumber)) return prev;
        const next = {
          ...prev,
          [key]: { read: [...ch.read, hadithNumber], last: hadithNumber },
        };
        saveData(next);
        return next;
      });
    },
    [],
  );

  const markUnread = useCallback(
    (bookSlug: string, chapterOrder: number, hadithNumber: number) => {
      setData((prev) => {
        const key = k(bookSlug, chapterOrder);
        const ch = prev[key];
        if (!ch) return prev;
        const next = {
          ...prev,
          [key]: {
            read: ch.read.filter((n) => n !== hadithNumber),
            last:
              ch.last === hadithNumber
                ? ch.read.length > 1
                  ? ch.read[ch.read.length - 2]
                  : null
                : ch.last,
          },
        };
        saveData(next);
        return next;
      });
    },
    [],
  );

  const isRead = useCallback(
    (bookSlug: string, chapterOrder: number, hadithNumber: number) => {
      const key = k(bookSlug, chapterOrder);
      return (data[key]?.read || []).includes(hadithNumber);
    },
    [data],
  );

  const getChapterReadSet = useCallback(
    (bookSlug: string, chapterOrder: number) => {
      const key = k(bookSlug, chapterOrder);
      return new Set(data[key]?.read || []);
    },
    [data],
  );

  const getLastRead = useCallback(
    (bookSlug: string, chapterOrder: number) => {
      const key = k(bookSlug, chapterOrder);
      return data[key]?.last ?? null;
    },
    [data],
  );

  return (
    <ReadingProgressContext.Provider
      value={{ markRead, markUnread, isRead, getChapterReadSet, getLastRead }}
    >
      {children}
    </ReadingProgressContext.Provider>
  );
}

export function useReadingProgress() {
  const ctx = useContext(ReadingProgressContext);
  if (!ctx)
    throw new Error(
      "useReadingProgress must be used within ReadingProgressProvider",
    );
  return ctx;
}
