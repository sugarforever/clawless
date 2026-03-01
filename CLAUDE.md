# Clawless

Tauri v2 desktop app for browsing and resuming OpenClaw sessions across all channels.

## Why

Messaging channels (Telegram, WhatsApp, Slack) don't let you re-enter old OpenClaw sessions. Once a conversation scrolls away, you lose context and can't continue where you left off. Clawless solves this by connecting directly to the OpenClaw gateway, listing all historical sessions from every channel, and letting you open any one to continue chatting.

## Architecture

See @ARCHITECTURE.md for full design. Key points:

- Connects to OpenClaw gateway via WebSocket at `localhost:18789`
- No channel plugin needed; uses the same protocol as the Mac menubar app
- Gateway methods: `sessions.list`, `chat.history`, `chat.send`, `chat.abort`
- Push events: `chat` (streaming deltas/finals), `agent` (tool events), `tick` (heartbeat)

## Tech Stack

- **Tauri v2** (Rust backend, web frontend)
- **SvelteKit** (frontend framework)
- **TypeScript** (strict, no `any`)
- **Tailwind CSS** (styling)

## Project Structure

```
src/
  lib/
    gateway.ts          # WebSocket client, reconnection, auth
    sessions.ts         # Session list, search, sort
    chat.ts             # Send/receive/stream messages
    types.ts            # Protocol types
  routes/
    +layout.svelte      # App shell with sidebar
    sessions/+page.svelte   # Session browser
    chat/[key]/+page.svelte # Chat view
  components/
    SessionList.svelte
    ChatMessage.svelte
    ChatInput.svelte
    StreamingText.svelte
src-tauri/                # Rust/Tauri backend
```

## Build & Dev Commands

- Install deps: `pnpm install`
- Dev: `pnpm tauri dev`
- Build: `pnpm tauri build`
- Type-check: `pnpm check`
- Format: `pnpm format`

## Coding Style

- TypeScript strict mode; avoid `any`
- Svelte 5 runes (`$state`, `$derived`, `$effect`) over legacy stores
- Prefer composition over inheritance
- Keep components under 200 lines; extract helpers when they grow
- Use Tailwind utility classes; avoid custom CSS unless necessary
- Brief comments only for non-obvious logic

## Gateway Protocol Reference

Frame format (JSON over WebSocket):
```
Request:  { type: "req", id: string, method: string, params: object }
Response: { type: "res", id: string, ok: boolean, payload: object }
Event:    { type: "event", event: string, payload: object, seq: number }
```

Connection flow: connect → send `Connect` request → receive `HelloOk` with auth token and features.

Chat event states: `delta` (streaming chunk), `final` (complete), `aborted`, `error`.

## OpenClaw Reference Files

When investigating gateway protocol details, read these files in the OpenClaw repo (`../openclaw/`):

- `src/gateway/server-chat.ts` — chat method implementations
- `src/gateway/server-methods/sessions.ts` — session list/resolve/preview
- `src/gateway/protocol/` — protocol frame types
- `apps/macos/Sources/OpenClaw/GatewayConnection.swift` — Mac app WS client (reference impl)
- `src/config/sessions/types.ts` — SessionEntry type definition

## Design Principles

- Session resumption is the core feature; optimize for browsing and re-entering old conversations
- Always generate idempotency keys (UUID) for `chat.send` to prevent duplicates
- Handle WebSocket disconnection gracefully with auto-reconnect
- Show streaming text as it arrives; don't wait for final
- Keep the UI minimal and fast; this is a power-user tool
