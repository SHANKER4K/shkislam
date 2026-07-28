# Chat UI — Design Spec

> Frontend-only chat interface using `ai-elements` components. Backend integration deferred.

## Architecture

- **Route:** `app/chat/page.tsx` — client component
- **API:** `app/api/chat/route.ts` — Next.js route handler (stub placeholder, later proxies to `localhost:8000`)
- **Components:** `conversation`, `message`, `prompt-input` from `ai-elements` (shadcn registry)
- **State:** plain `useState` + `fetch` (no `useChat` or `@ai-sdk/react`)

## Data flow

```
User types → PromptInput onSubmit
  → fetch POST /api/chat { message }
  → app/api/chat/route.ts (stub returns { response: "..." })
  → append assistant message to local state
  → Conversation re-renders
```

Later: swap the route handler to proxy to `POST http://localhost:8000/chat` with the same format.

## Backend contract (future)

```
POST /api/chat
Request:  { message: string }
Response: { response: string }
```

The stub returns a hardcoded Arabic response so the UI is testable immediately.

## UI Layout

- Full-height conversation area with auto-scroll
- Fixed input bar at bottom: `PromptInputTextarea` + `PromptInputSubmit`
- Empty state when no messages: icon + "ابدأ محادثة" / "Start a conversation"
- User messages right-aligned, assistant messages left-aligned (RTL flow)
- Support markdown rendering via `MessageResponse`

## RTL

The site is `dir="rtl"`. ai-elements/shadcn components inherit RTL from the document — no extra styling needed.

## Navbar

Add a chat link to the existing navbar. Icon: `MessageCircle` or `Bot`.

## Non-goals (v1)

- No streaming (added later by user)
- No attachments / file uploads
- No model selector
- No conversation persistence
- No branch / retry / copy actions
