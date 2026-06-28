"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: () => void;
  size?: "sm" | "default";
}

export function FavoriteButton({
  isFavorited,
  onToggle,
  size = "sm",
}: FavoriteButtonProps) {
  return (
    <Button
      variant="ghost"
      size={size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      title={isFavorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
    >
      <Heart
        className={`size-4 transition-colors ${
          isFavorited
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground hover:text-red-400"
        }`}
      />
    </Button>
  );
}
