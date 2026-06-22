"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface GlobalSearchBarProps {
  initialQuery?: string;
  initialType?: string;
  showTabs?: boolean;
}

export function GlobalSearchBar({
  initialQuery = "",
  initialType = "all",
  showTabs = false,
}: GlobalSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${type}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث في القرآن الكريم والأحاديث النبوية..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pr-10 text-base focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
        {showTabs && (
          <div className="flex items-center justify-between gap-3">
            <Tabs value={type} onValueChange={setType}>
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="quran">القرآن</TabsTrigger>
                <TabsTrigger value="hadith">الأحاديث</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button type="submit">
              <Search className="ml-2 size-4" />
              بحث
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
