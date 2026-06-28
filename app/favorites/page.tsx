"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, BookOpen, MessageCircle } from "lucide-react";
import { useFavorites, type FavoriteItem, type FavoriteAyah, type FavoriteHadith } from "@/src/lib/use-favorites";

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
          <Heart className="size-6 text-red-500 fill-red-500" />
          <h1 className="text-2xl font-bold">المفضلة</h1>
          <span className="text-sm text-muted-foreground">
            ({favorites.length})
          </span>
        </div>

        {favorites.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Heart className="size-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-lg">لم تضف أي عنصر إلى المفضلة بعد</p>
            <p className="text-sm mt-1">اضغط على أيقونة القلب بجانب أي آية أو حديث لإضافته</p>
            <div className="flex justify-center gap-4 mt-6">
              <Link href="/quran">
                <Button variant="outline" size="sm">
                  <BookOpen className="size-4 ml-1" /> تصفح القرآن
                </Button>
              </Link>
              <Link href="/hadith">
                <Button variant="outline" size="sm">
                  <MessageCircle className="size-4 ml-1" /> تصفح الأحاديث
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
                <Link href={`/quran/${group.surahNumber}`}>
                  <h3 className="font-arabic text-lg font-semibold mb-3 text-primary hover:underline">
                    {surahName}
                  </h3>
                </Link>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <Card key={item.id} className="border shadow-sm">
                      <CardContent className="p-3 flex items-start gap-3">
                        <Link
                          href={`/quran/${item.surahNumber}/${item.verseNumber}`}
                          className="flex-1 min-w-0"
                        >
                          <div className="font-quran leading-loose text-foreground text-lg">
                            {item.textUthmani}
                            <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-arabic font-semibold mx-1 align-middle">
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
                      </CardContent>
                    </Card>
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
                <Link href={`/hadith/${group.bookSlug}`}>
                  <h3 className="font-arabic text-lg font-semibold mb-3 text-primary hover:underline">
                    {bookName}
                  </h3>
                </Link>
                {Object.entries(group.chapters).map(([chapterTitle, items]) => (
                  <div key={chapterTitle} className="mb-3">
                    <h4 className="font-arabic text-sm font-medium text-muted-foreground mb-2 px-1">
                      {chapterTitle}
                    </h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <Card key={item.id} className="border shadow-sm">
                          <CardContent className="p-3 flex items-start gap-3">
                            <Link
                              href={`/hadith/${item.bookSlug}/${item.hadithId}`}
                              className="flex-1 min-w-0"
                            >
                              <div className="font-arabic leading-relaxed text-foreground text-sm line-clamp-2">
                                {item.text}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  حديث رقم {item.hadithId}
                                </Badge>
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
                          </CardContent>
                        </Card>
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
