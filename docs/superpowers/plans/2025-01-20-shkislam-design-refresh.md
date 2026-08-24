# SHK Islam Design Refresh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the DESIGN.md terracotta/parchment design system to every surface of the app: palette, sidebar, chat, cards, and content pages — zero new dependencies, zero functional changes, purely visual.

**Architecture:** Token-first CSS variable swap in `globals.css` propagates to all shadcn components automatically. Then targeted restyles on each page/component via Tailwind className changes. ai-elements chat components reskinned but their streaming logic untouched.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, shadcn/ui (radix-vega), ai-elements (custom chat primitives), Tajawal + Uthmanic + Inter fonts.

## Global Constraints

- Single accent only: terracotta `#B4552D` (light), `#D97A4A` (dark)
- No new npm packages — zero dependencies added
- No shadcn/ui component source files modified — only their usage via `className`
- No ai-elements props/API changed — only styling
- All interactive elements must have `:hover` (background shift) and `:active` (`scale-[0.98]`)
- `min-h-[100dvh]` only — no `h-screen` anywhere
- RTL preserved: `lang="ar"`, `dir="rtl"`, sidebar on start (right)
- Placeholder text "سوف ادهشك!" removed from all visible surfaces
- Mobile-first: action buttons (copy, favorite, export) must be always visible on mobile (`opacity-100`); `group-hover` fade only on `md:`+
- All shadows tinted sepia (`#3A2E22`), never pure black
- Reduced motion gating: wrap all entry animations in `@media (prefers-reduced-motion: no-preference)`

---

## File Structure

| File | Responsibility |
|---|---|
| `app/globals.css` | All CSS custom properties (tokens). One source of truth for colors, shadows, radii. |
| `app/layout.tsx` | Root layout — wraps app in ThemeProvider. Grain overlay div added here. |
| `src/components/app-sidebar.tsx` | Sidebar nav — shadcn sidebar wrapper. New active state + leather binding colors. |
| `app/page.tsx` | Chat homepage — ai-elements chat thread, empty state, input dock. |
| `src/components/verse-card.tsx` | Quran ayah card — transparent background, action bar below text, tafsir expand. |
| `src/components/hadith-card.tsx` | Hadith card — unified surface, dot+label grade badges, action bar. |
| `app/quran/page.tsx` | Surah index — 4-col grid with muted badges and color-coded revelation. |
| `app/hadith/page.tsx` | Book index — 2-book editorial split layout. |
| `app/themes/page.tsx` | Themes grid — broken layout with `col-span-2` and top-border tints. |
| `app/favorites/page.tsx` | Favorites — sticky group headers, empty state, more whitespace. |
| `app/about/page.tsx` | About page — source cards grid instead of list. |

---

### Task 1: Palette Foundation

**Goal:** Swap all CSS custom properties to the terracotta/parchment system. Every downstream component inherits instantly.

**Files:**
- Modify: `app/globals.css`
- Verify: `bun run lint`, `bun run build`

**Interfaces:**
- Consumes: nothing (this is the root)
- Produces: All `--*` CSS variables now emit warm parchment/terracotta/umber values instead of greyscale. Dark mode block emits umber+lit-clay.

- [ ] **Step 1: Replace light-mode tokens**

Replace the entire `:root { ... }` block with:

```css
:root {
  --background: #F5F0E6;
  --foreground: #3A2E22;
  --card: #FAF7F0;
  --card-foreground: #3A2E22;
  --popover: #FAF7F0;
  --popover-foreground: #3A2E22;
  --primary: #B4552D;
  --primary-foreground: #FAF7F0;
  --secondary: #EDE7DB;
  --secondary-foreground: #3A2E22;
  --muted: #E8E0D2;
  --muted-foreground: #8A7D6E;
  --accent: #F0E9DC;
  --accent-foreground: #3A2E22;
  --destructive: #9B2C2C;
  --destructive-foreground: #FAF7F0;
  --border: #DDD5C5;
  --input: #DDD5C5;
  --ring: #B4552D;
  --sidebar: #2B2118;
  --sidebar-foreground: #E8D9C3;
  --sidebar-primary: #D97A4A;
  --sidebar-primary-foreground: #2B2118;
  --sidebar-accent: #3D3024;
  --sidebar-accent-foreground: #FAF7F0;
  --sidebar-border: #4A3B2E;
  --sidebar-ring: #D97A4A;
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: 0.5rem;
  --shadow-2xs: 0 1px 2px 0px hsl(25 20% 18% / 0.03);
  --shadow-xs: 0 1px 2px 0px hsl(25 20% 18% / 0.03);
  --shadow-sm: 0 1px 3px 0px hsl(25 20% 18% / 0.04);
  --shadow: 0 1px 3px 0px hsl(25 20% 18% / 0.05);
  --shadow-md: 0 4px 12px -2px hsl(25 20% 18% / 0.06);
  --shadow-lg: 0 8px 20px -4px hsl(25 20% 18% / 0.07);
  --shadow-xl: 0 12px 28px -6px hsl(25 20% 18% / 0.08);
  --shadow-2xl: 0 16px 40px -8px hsl(25 20% 18% / 0.09);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}
```

- [ ] **Step 2: Replace dark-mode tokens**

Replace the entire `.dark { ... }` block with:

```css
.dark {
  --background: #1E1710;
  --foreground: #E8D9C3;
  --card: #282018;
  --card-foreground: #E8D9C3;
  --popover: #282018;
  --popover-foreground: #E8D9C3;
  --primary: #D97A4A;
  --primary-foreground: #1E1710;
  --secondary: #3D3024;
  --secondary-foreground: #E8D9C3;
  --muted: #352A1F;
  --muted-foreground: #A08A6E;
  --accent: #3D3024;
  --accent-foreground: #E8D9C3;
  --destructive: #EF4444;
  --destructive-foreground: #FAF7F0;
  --border: #4A3B2E;
  --input: #4A3B2E;
  --ring: #D97A4A;
  --sidebar: #16100C;
  --sidebar-foreground: #E8D9C3;
  --sidebar-primary: #E88F60;
  --sidebar-primary-foreground: #16100C;
  --sidebar-accent: #2B2118;
  --sidebar-accent-foreground: #FAF7F0;
  --sidebar-border: #3D3024;
  --sidebar-ring: #E88F60;
  --shadow-2xs: 0 1px 2px 0px hsl(30 25% 10% / 0.04);
  --shadow-xs: 0 1px 2px 0px hsl(30 25% 10% / 0.04);
  --shadow-sm: 0 1px 3px 0px hsl(30 25% 10% / 0.05);
  --shadow: 0 1px 3px 0px hsl(30 25% 10% / 0.06);
  --shadow-md: 0 4px 12px -2px hsl(30 25% 10% / 0.07);
  --shadow-lg: 0 8px 20px -4px hsl(30 25% 10% / 0.08);
  --shadow-xl: 0 12px 28px -6px hsl(30 25% 10% / 0.09);
  --shadow-2xl: 0 16px 40px -8px hsl(30 25% 10% / 0.10);
}
```

- [ ] **Step 3: Replace callout colors**

In the `@layer base` area, replace callout colors to match the new palette. The `callout-quran-ayah` and `callout-hadith` classes must use terracotta:

```css
.callout-quran-ayah {
  border-color: var(--primary);
  background: var(--accent);
}

.callout-hadith {
  border-color: var(--primary);
  background: var(--card);
}
```

Keep `.callout-info`, `.callout-warning`, `.callout-error` as-is (they are semantic).

- [ ] **Step 4: Verify build**

Run: `bun run lint`
Expected: Pass (ESLint only, no typecheck since strict:false)

Run: `bun run build`
Expected: Pass (static analysis, no runtime errors from CSS)

- [ ] **Step 5: Visual check**

Run: `bun run dev`
Open `http://localhost:3000`. Confirm: sidebar is dark umber, main area is warm parchment, text is sepia brown instead of grey/black.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "design: swap palette to terracotta-parchment system"
```

---

### Task 2: Sidebar Restyling

**Goal:** Make the sidebar feel like a leather binding. Active nav gets terracotta start-edge rule. "New chat" button restyled.

**Files:**
- Modify: `src/components/app-sidebar.tsx`
- Verify: visual check in dev server

**Interfaces:**
- Consumes: shadcn `Sidebar`, `SidebarMenuButton`, etc. (already styled by CSS tokens)
- Produces: Active nav items render with `border-r-2 border-sidebar-primary` and `text-sidebar-primary` in RTL.

- [ ] **Step 1: Add active state className to nav items**

Find the `navItems.map` block. The existing code:

```tsx
<SidebarMenuButton
  asChild
  isActive={active}
  tooltip={item.label}
  className="text-sm"
>
```

Change the `className` to include the active styling:

```tsx
<SidebarMenuButton
  asChild
  isActive={active}
  tooltip={item.label}
  className={cn(
    "text-sm transition-colors duration-150",
    active && "border-r-2 border-sidebar-primary text-sidebar-primary bg-sidebar-accent"
  )}
>
```

This adds:
- `border-r-2 border-sidebar-primary` — terracotta start-edge rule (RTL: right edge)
- `text-sidebar-primary` — terracotta text for active item
- `bg-sidebar-accent` — subtle leather fill
- `transition-colors duration-150` — smooth hover

- [ ] **Step 2: Restyle "New chat" button**

Find the "محادثة جديدة" button. Current code:

```tsx
<Button asChild variant="outline" className="mt-3 w-full justify-start gap-2 text-sm">
  <Link href="/">
    <MessageSquare className="size-4" />
    <span className="truncate">محادثة جديدة</span>
  </Link>
</Button>
```

Replace with:

```tsx
<Button
  asChild
  variant="outline"
  className="mt-3 w-full justify-start gap-2 text-sm border-primary/40 text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-150"
>
  <Link href="/">
    <MessageSquare className="size-4 stroke-[1.5]" />
    <span className="truncate">محادثة جديدة</span>
  </Link>
</Button>
```

- [ ] **Step 3: Standardize icon stroke width**

In the logo block, change:
```tsx
<Image ... className="rounded-sm shrink-0" />
```
to:
```tsx
<Image ... className="rounded-sm shrink-0" />
```
(no change needed for Image)

In the theme toggle block, add `stroke-[1.5]` to both `Sun` and `Moon` icons.

In nav items, change:
```tsx
<item.icon className="size-4" />
```
to:
```tsx
<item.icon className="size-4 stroke-[1.5]" />
```

- [ ] **Step 4: Verify and commit**

Run: `bun run lint`
Expected: Pass

Visual check: Active page should have terracotta right-border and terracotta text. "New chat" should have terracotta border and text.

```bash
git add src/components/app-sidebar.tsx
git commit -m "design: leather-binding sidebar with terracotta active rule"
```

---

### Task 3: Chat Page Redesign

**Goal:** Make the homepage feel like scholarly correspondence, not a generic AI demo. Empty state redesigned. Messages restyled. Input dock polished.

**Files:**
- Modify: `app/page.tsx`
- Verify: visual check, `bun run lint`

**Interfaces:**
- Consumes: `Conversation`, `Message`, `MessageContent`, `MessageResponse`, `PromptInput`, `PromptInputTextarea`, `PromptInputSubmit`, `Tool`, `Shimmer`, `CopyButton`
- Produces: No exported interfaces changed — only JSX structure and className props.

- [ ] **Step 1: Redesign empty state**

Replace the empty state JSX block (the entire `messages.length === 0 ? (...)`) with:

```tsx
<div className="flex flex-col items-center justify-center flex-1 py-24 text-center gap-8">
  {/* CSS ornament — two hairlines + rotated square */}
  <div className="relative w-12 h-12 flex items-center justify-center mb-2">
    <div className="absolute w-full h-px bg-primary/30" />
    <div className="absolute h-full w-px bg-primary/30" />
    <div className="size-3 rotate-45 bg-primary/20" />
  </div>

  <div className="flex flex-col items-center gap-3">
    <h1 className="font-arabic text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
      ما الذي تريد أن تتعلمه؟
    </h1>
    <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
      اسأل عن آية أو حديث أو مسألة، وسأجيبك بمصادر من القرآن والسنة
    </p>
  </div>

  <div className="flex flex-wrap justify-center gap-2 w-full max-w-lg">
    {suggestedPrompts.map((prompt) => (
      <button
        key={prompt}
        type="button"
        onClick={() => setInput(prompt)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-lg border border-border bg-card px-4 py-2.5 text-start hover:bg-secondary"
      >
        {prompt}
      </button>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Restyle message containers**

Find the user message rendering block in the `messages.map()`:

```tsx
<Message from={msg.role} key={i} className="group/message relative">
  <MessageContent>
    <MessageResponse>{msg.content}</MessageResponse>
  </MessageContent>
```

Wrap it in a conditional so user turns get a subtle well and assistant turns stay plain:

```tsx
{msg.type === "message" && (
  <div className={cn(msg.role === "user" && "flex justify-end")}>
    <Message
      from={msg.role}
      key={i}
      className={cn(
        "group/message relative max-w-[70ch]",
        msg.role === "user" && "bg-muted/60 rounded-xl px-5 py-3"
      )}
    >
      <MessageContent>
        <MessageResponse className={cn(msg.role === "assistant" && "text-foreground leading-relaxed")}>
          {msg.content}
        </MessageResponse>
      </MessageContent>
      {msg.role === "assistant" && (
        <div className="mt-2 opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-150">
          <div className="absolute left-0">
            <CopyButton text={msg.content.trim()} variant="ghost" size="icon" />
          </div>
        </div>
      )}
    </Message>
  </div>
)}
```

- `user` turns: right-aligned (`flex justify-end`), `bg-muted/60` well with `rounded-xl px-5 py-3`
- `assistant` turns: left-aligned, no container, plain text with `leading-relaxed`
- Copy button: `opacity-100 md:opacity-0 md:group-hover/message:opacity-100` — always visible on mobile

- [ ] **Step 3: Replace loading shimmer**

Find:
```tsx
{status == "loading" && (
  <Shimmer duration={3} spread={3}>
    سوف ادهشك!
  </Shimmer>
)}
```

Replace with:

```tsx
{status === "loading" && (
  <div className="space-y-3 my-4 animate-pulse">
    <div className="h-4 bg-muted rounded-md w-3/4" />
    <div className="h-4 bg-muted rounded-md w-1/2" />
    <div className="h-20 bg-muted rounded-xl w-full border-r-2 border-primary/30" />
  </div>
)}
```

This removes the placeholder text "سوف ادهشك!" and uses neutral skeleton blocks shaped like message + callout.

- [ ] **Step 4: Redesign input dock**

Find the input dock block (the div after `</Conversation>`):

```tsx
<div className="max-w-3xl mx-auto w-full px-4 pb-4 pt-2">
  <PromptInput onSubmit={handleSubmit} className="relative w-full">
    <PromptInputTextarea
      value={input}
      placeholder="اكتب سؤالك هنا..."
      onChange={(e) => setInput(e.currentTarget.value)}
      className="pr-12 rounded-2xl border bg-card shadow-none"
    />
    <PromptInputSubmit
      status={status === "loading" ? "submitted" : "ready"}
      disabled={!input.trim() || status === "loading"}
      className="absolute bottom-1 right-1"
    />
  </PromptInput>
  <p className="mt-2 text-center text-xs text-muted-foreground/70">
    قد يخطئ الذكاء الاصطناعي، تحقق من المصادر
  </p>
</div>
```

Replace with:

```tsx
<div className="max-w-3xl mx-auto w-full px-4 pb-4 pt-2">
  <div className="bg-card rounded-2xl border border-input shadow-sm p-2">
    <PromptInput onSubmit={handleSubmit} className="relative w-full">
      <PromptInputTextarea
        value={input}
        placeholder="اكتب سؤالك هنا..."
        onChange={(e) => setInput(e.currentTarget.value)}
        className="pr-14 rounded-xl border-0 bg-transparent shadow-none resize-none min-h-[44px] max-h-[200px] placeholder:text-muted-foreground"
      />
      <PromptInputSubmit
        status={status === "loading" ? "submitted" : "ready"}
        disabled={!input.trim() || status === "loading"}
        className="absolute bottom-2 right-2 size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
      />
    </PromptInput>
  </div>
  <p className="mt-2 text-center text-xs text-muted-foreground/60">
    قد يخطئ الذكاء الاصطناعي، تحقق من المصادر
  </p>
</div>
```

- [ ] **Step 5: Verify and commit**

Run: `bun run lint`
Expected: Pass

Visual check: Empty state shows ornament + new headline. User messages have subtle well. Input dock has rounded-2xl parchment well with terracotta send button. No "سوف ادهشك!" visible.

```bash
git add app/page.tsx
git commit -m "design: chat homepage — correspondence feel, new empty state, polished input"
```

---

### Task 4: VerseCard Redesign

**Goal:** Quran ayah cards become transparent text on the page with an action bar below. Mobile actions always visible. Tafsir gets terracotta start-rule.

**Files:**
- Modify: `src/components/verse-card.tsx`
- Verify: visual check on `/quran/1`, `bun run lint`

**Interfaces:**
- Consumes: `Card`, `CardContent`, `Button`, `ChevronDown`, `ChevronUp`, `CopyButton`, `ExportModal`, `FavoriteButton`
- Produces: `VerseCard` component — same props, new DOM structure.

- [ ] **Step 1: Rewrite VerseCard JSX**

Replace the entire return statement of `VerseCard` with:

```tsx
return (
  <div className="group relative py-5 border-b border-border last:border-b-0">
    {/* Ayah text */}
    <Link href={`/quran