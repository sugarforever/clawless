# Clawless - Architecture Design

## Problem

Messaging channels (Telegram, WhatsApp, Slack) don't support re-entering old OpenClaw sessions. Once a conversation scrolls away, you lose context and can't resume it meaningfully.

## Solution

Clawless is a Tauri desktop app that connects to the local OpenClaw gateway, lists all historical sessions, and lets you open any session to continue the conversation.

## Integration: Gateway WebSocket Protocol

Clawless does **not** need to be an OpenClaw channel plugin. The gateway already exposes a full WebSocket protocol that the Mac menubar app uses. Clawless connects the same way.

```
┌─────────────┐     WebSocket      ┌──────────────────────┐
│  Clawless   │ ◄──────────────► │  OpenClaw Gateway    │
│  (Tauri)    │  localhost:18789   │  (already running)   │
│             │                    │                      │
│  - Session  │  sessions.list     │  ~/.openclaw/agents/  │
│    browser  │  chat.history      │    <id>/sessions/    │
│  - Chat UI  │  chat.send         │      sessions.json   │
│  - Streamed │  chat events       │      *.jsonl         │
│    replies  │  chat.abort        │                      │
└─────────────┘                    └──────────────────────┘
```

## Gateway Protocol (JSON over WebSocket)

### Connection

1. Connect to `ws://localhost:18789`
2. Send `Connect` request with client metadata
3. Receive `HelloOk` with server version, features, snapshot, auth token

### Frame Types

```
Request:  { type: "req",   id, method, params }
Response: { type: "res",   id, ok, payload, error? }
Event:    { type: "event", event, payload, seq }
```

### Key Methods

| Method | Purpose | Params |
|--------|---------|--------|
| `sessions.list` | List all sessions | `{ limit?, includeGlobal?, search?, includeLastMessage? }` |
| `sessions.preview` | Get last messages | `{ keys: string[], limit?, maxChars? }` |
| `chat.history` | Full message history | `{ sessionKey, limit? }` |
| `chat.send` | Send user message | `{ sessionKey, message, thinking?, attachments?, idempotencyKey }` |
| `chat.abort` | Cancel active run | `{ sessionKey, runId? }` |

### Push Events

| Event | Purpose |
|-------|---------|
| `chat` | Streaming deltas + final messages |
| `agent` | Tool invocations, lifecycle (if `tool-events` capability) |
| `tick` | Heartbeat |

### Chat Event States

- `delta` - streaming text chunk from assistant
- `final` - complete message with usage stats
- `aborted` - run was cancelled
- `error` - with errorMessage

## Session Data Model

Sessions are keyed by structured strings:

```
main                              # Default DM session
discord:channel:general           # Discord channel
telegram:direct:12345             # Telegram DM
matrix:channel:!roomId:server     # Matrix room
agent:<id>:subagent:<childKey>    # Subagent
```

Each SessionEntry contains:

```typescript
{
  sessionId: string;        // UUID, maps to JSONL transcript file
  updatedAt: number;        // ms timestamp
  chatType?: "direct" | "group" | "channel" | "thread";
  channel?: string;         // originating channel
  displayName?: string;
  label?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  modelOverride?: string;
  // ...more metadata
}
```

## App Architecture

```
src/
  lib/
    gateway.ts          # WebSocket client, reconnection, auth
    sessions.ts         # Session list, search, sort
    chat.ts             # Send/receive/stream messages
    types.ts            # Protocol types
  routes/
    +layout.svelte      # App shell, sidebar
    sessions/
      +page.svelte      # Session browser (list + search + filters)
    chat/[key]/
      +page.svelte      # Chat view for a specific session
  components/
    SessionList.svelte   # Filterable session list
    ChatMessage.svelte   # Single message bubble
    ChatInput.svelte     # Message composer
    StreamingText.svelte # Renders streaming deltas
```

### Tech Stack

- **Tauri v2** - Desktop shell (Rust backend, web frontend)
- **SvelteKit** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Core Flows

**1. Session Browser**
```
App starts → gateway.connect() → sessions.list({ includeGlobal: true })
→ render sorted list (by updatedAt desc)
→ user clicks session → navigate to /chat/[sessionKey]
```

**2. Open Session & View History**
```
Navigate to /chat/[key] → chat.history({ sessionKey, limit: 200 })
→ render messages (user/assistant/tool)
→ subscribe to push events for this sessionKey
```

**3. Send Message**
```
User types message → chat.send({ sessionKey, message, idempotencyKey: uuid() })
→ receive chat delta events → append streaming text
→ receive chat final event → finalize message, show usage
```

**4. Abort**
```
User clicks stop → chat.abort({ sessionKey })
→ receive chat aborted event → mark run as cancelled
```

## Key Advantages Over Channel Plugins

1. **Zero config** - No channel registration, no allowlist, no pairing. Just connect to the gateway.
2. **Full session access** - See sessions from ALL channels (Telegram, Discord, Slack, etc.), not just its own.
3. **Session resumption** - The whole point. Pick any session and continue.
4. **Streaming** - Real-time token-by-token output via WebSocket events.
5. **Same protocol as Mac app** - Battle-tested, maintained by core team.

## Prerequisites

- OpenClaw gateway must be running locally (port 18789)
- Gateway auth token (provided in `HelloOk` handshake)

## Reference Files in OpenClaw

| File | What to study |
|------|--------------|
| `src/gateway/server-chat.ts` | Chat method implementations |
| `src/gateway/server-methods/sessions.ts` | Session list/resolve/preview |
| `src/gateway/protocol/` | Protocol frame types |
| `apps/macos/Sources/OpenClaw/GatewayConnection.swift` | Mac app WS client (reference impl) |
| `src/config/sessions/types.ts` | SessionEntry type definition |
