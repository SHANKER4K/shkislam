"use client";

import { CheckIcon } from "lucide-react";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const PROVIDER_COLORS: Record<string, string> = {
  opencode: "bg-blue-500",
  dahl: "bg-amber-500",
  "hermes(nousresearch)": "bg-emerald-500",
};

/* ─────────── ModelSelector (Popover root) ─────────── */

export const ModelSelector = Popover;
export const ModelSelectorTrigger = PopoverTrigger;

export const ModelSelectorContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    className={cn("w-80 p-0 rounded-xl!", className)}
    align="start"
    side="top"
    {...props}
  >
    <Command className="rounded-xl!">{children}</Command>
  </PopoverContent>
));
ModelSelectorContent.displayName = "ModelSelectorContent";

/* ─────────── Command wrappers ─────────── */

export const ModelSelectorInput = React.forwardRef<
  React.ElementRef<typeof CommandInput>,
  React.ComponentPropsWithoutRef<typeof CommandInput>
>(({ className, ...props }, ref) => (
  <CommandInput
    ref={ref}
    className={cn("border-none!", className)}
    {...props}
  />
));
ModelSelectorInput.displayName = "ModelSelectorInput";

export const ModelSelectorList = React.forwardRef<
  React.ElementRef<typeof CommandList>,
  React.ComponentPropsWithoutRef<typeof CommandList>
>(({ className, ...props }, ref) => (
  <CommandList ref={ref} className={cn(className)} {...props} />
));
ModelSelectorList.displayName = "ModelSelectorList";

export const ModelSelectorEmpty = CommandEmpty;

export type ModelSelectorGroupProps = React.ComponentPropsWithoutRef<
  typeof CommandGroup
>;

export const ModelSelectorGroup = React.forwardRef<
  React.ElementRef<typeof CommandGroup>,
  ModelSelectorGroupProps
>(({ className, ...props }, ref) => (
  <CommandGroup ref={ref} className={cn(className)} {...props} />
));
ModelSelectorGroup.displayName = "ModelSelectorGroup";

export type ModelSelectorItemProps =
  & Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, "onSelect" | "value">
  & {
    onSelect?: () => void;
    value: string; // search filter value
  };

export const ModelSelectorItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  ModelSelectorItemProps
>(({ onSelect, ...props }, ref) => {
  return (
    <CommandItem
      ref={ref}
      {...props}
      onSelect={() => onSelect?.()}
    >
      {props.children}
      <CheckIcon className="ms-auto size-4 opacity-0 group-data-[checked=true]/command-item:opacity-100" />
    </CommandItem>
  );
});
ModelSelectorItem.displayName = "ModelSelectorItem";

/* ─────────── Visual helpers ─────────── */

export function ModelSelectorLogo({
  provider,
}: {
  provider?: string | null;
}) {
  if (!provider) {
    return <div className="size-4 rounded-full bg-muted" />;
  }
  const color = PROVIDER_COLORS[provider] ?? "bg-slate-500";
  const initial = provider[0]?.toUpperCase() ?? "?";
  return (
    <span
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white",
        color
      )}
      title={provider}
    >
      {initial}
    </span>
  );
}

export function ModelSelectorLogoGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <span className="flex -space-x-1 rtl:space-x-reverse">{children}</span>;
}

export function ModelSelectorName({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("truncate text-sm font-medium", className)}>
      {children}
    </span>
  );
}
