"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, BookOpen, MessageCircle } from "lucide-react";
import { useFavorites, type FavoriteAyah, type FavoriteHadith } from "@/src/lib/use-favorites";

type GroupedAyahs = Record<string, { surahNumber: number; items: FavoriteAyah[] }>;
type GroupedHadiths = Record<string, { bookSlug: string; chapters: Record<string, FavoriteHadith[]> }>;

function groupAyahs(items: FavoriteAyah[]): GroupedAyahs {
  const map: GroupedAyahs = {};
  for (const item of items) {
    const key = item.surahNameAr;
    if (!map[key]) map[key] = { surahNumber: item.surahNumber, items: [] };
    map[key].items.push(item);
  }
  return map;
}

function groupHadiths(items: FavoriteHadith[]): GroupedHadiths {
  const map: GroupedHadiths = {};
  for (const item of items) {
    const bk = item.bookNameAr;
    if (!map[bk]) map[bk] = { bookSlug: item.bookSlug, chapters: {} };
    const ch = item.chapterTitle || "عام";
    if (!map[bk].chapters[ch]) map[bk].chapters[ch] = [];
    map[bk].chapters[ch].push(item);
  }
  return map;
}

export default function FavoritesPage() {
  const { favorites, removeFavorite, isFavorite } = useFavorites();

  const ayahFavs = favorites.filter((f): f is FavoriteAyah => f.type === "ayah");
  const hadithFavs = favorites.filter((f): f is FavoriteHadith => f.type === "hadith");
  const ayahGroups = groupAyahs(ayahFavs);
  const hadithGroups = groupHadiths(hadithFavs);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="size-6 text-primary fill-primary" />
          <h1 className="font-arabic text-3xl font-bold">المفضلة</h1>
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
            {favorites.length}
          </span>
        </div>

        {favorites.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <Heart className="size-16 mx-auto mb-4 text-muted-foreground/20" />
            <h3 className="font-arabic text-xl font-bold mb-2">لم تضف أي شيء بعد</h3>
            <p className="text-sm mt-1">اضغط على أيقونة القلب بجانب أي آية أو حديث لإضافته</p>
            <div className="flex justify-center gap-3 mt-6">
              <Link href="/quran">
                <Button className="rounded-lg bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] transition-all duration-150" size="sm">
                  <BookOpen className="size-4 ml-1 stroke-[1.5]" /> تصفح القرآن
                </Button>
              </Link>
              <Link href="/hadith">
                <Button variant="outline" className="rounded-lg border border-input hover:bg-secondary transition-colors duration-150" size="sm">
                  <MessageCircle className="size-4 ml-1 stroke-[1.5]" /> تصفح الأحاديث
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Ayahs */}
        {ayahFavs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="size-5" /> الآيات القرآنية
            </h2>
            {Object.entries(ayahGroups).map(([surahName, group]) => (
              <div key={surahName} className="mb-6">
                <div className="sticky top-0 bg-background py-2 z-10 border-b border-border mb-3">
                  <Link href={`/quran/${group.surahNumber}`}>
                    <h3 className="font-arabic text-lg font-semibold text-primary hover:underline">
                      {surahName}
                    </h3>
                  </Link>
                </div>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="bg-card rounded-lg p-4 flex items-start gap-3">
                      <Link
                        href={`/quran/${item.surahNumber}/${item.verseNumber}`}
                        className="flex-1 min-w-0"
                      >
                        <div className="font-quran leading-loose text-foreground text-lg">
                          {item.textUthmani}
                          <span className="inline-flex items-center justify-center size-6 rounded-full bg-muted text-foreground text-xs font-arabic font-semibold mx-1 align-middle">
                            {item.verseNumber}
                          </span>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(item.id)}
                      >
                        <Trash2 className="size-4 text-muted-foreground hover:text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Hadiths */}
        {hadithFavs.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="size-5" /> الأحاديث النبوية
            </h2>
            {Object.entries(hadithGroups).map(([bookName, group]) => (
              <div key={bookName} className="mb-6">
                <div className="sticky top-0 bg-background py-2 z-10 border-b border-border mb-3">
                  <Link href={`/hadith/${group.bookSlug}`}>
                    <h3 className="font-arabic text-lg font-semibold text-primary hover:underline">
                      {bookName}
                    </h3>
                  </Link>
                </div>
                {Object.entries(group.chapters).map(([chapterTitle, items]) => (
                  <div key={chapterTitle} className="mb-3">
                    <h4 className="font-arabic text-sm font-medium text-muted-foreground mb-2 px-1">
                      {chapterTitle}
                    </h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="bg-card rounded-lg p-4 flex items-start gap-3">
                          <Link
                            href={`/hadith/${item.bookSlug}/${item.hadithId}`}
                            className="flex-1 min-w-0"
                          >
                            <div className="font-arabic leading-relaxed text-foreground text-sm line-clamp-2">
                              {item.text}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                                حديث رقم {item.hadithId}
                              </span>
                              {item.narrator && (
                                <span className="text-xs text-muted-foreground">
                                  {item.narrator.slice(0, 30)}
                                </span>
                              )}
                            </div>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFavorite(item.id)}
                          >
                            <Trash2 className="size-4 text-muted-foreground hover:text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
