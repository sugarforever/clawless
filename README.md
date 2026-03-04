# Clawless

A Tauri v2 desktop app for browsing and resuming OpenClaw sessions across all channels.

## Prerequisites

- [OpenClaw](https://github.com/nichochar/openclaw) gateway running locally on port 18789
- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)

## Getting Started

```bash
pnpm install
pnpm tauri dev
```

The app connects to `ws://localhost:18789` on launch. If the gateway is running, you'll see a green status dot in the sidebar.

## User Guide

### Connecting to the Gateway

Clawless automatically connects to the OpenClaw gateway at startup. The connection status is shown in the sidebar header:

- **Green dot** — connected
- **Red dot** — disconnected

Click the status indicator to expand connection settings. Enter a custom gateway URL (e.g. `ws://192.168.1.10:18789`) and click **Connect** to switch gateways.

### Browsing Sessions

The **Sessions** tab (default view) lists all historical sessions from every channel — Telegram, Discord, Slack, WhatsApp, Matrix, and direct sessions. Sessions are sorted by most recently updated.

- **Search** — type in the search box at the top to filter sessions by name, label, or key.
- **Channel icons** — each session shows an icon indicating its originating channel.
- **Agent badges** — sessions belonging to a specific agent display a small badge with the agent ID.
- **Last message preview** — the most recent message is shown beneath the session name.

Click any session to open its chat history.

### Chatting

Once you open a session, the chat view loads the message history and subscribes to live updates.

- **Send a message** — type in the input at the bottom and press Enter (or click Send).
- **Streaming replies** — assistant responses appear token-by-token as they stream in.
- **Abort** — click the stop button while a response is streaming to cancel the current run.

Every message sent includes an idempotency key to prevent duplicates.

### Managing Agents

Switch to the **Agents** tab in the sidebar to view and manage OpenClaw agents.

- **Agent list** — all agents are shown as cards. The default ("main") agent is pinned at the top with a badge.
- **Create an agent** — click **New Agent** at the top-right. Fill in a name and optional workspace path, then click **Save**.
- **Edit an agent** — click the pencil icon on any agent card. Update the name, workspace, or model, then save.
- **Delete an agent** — click the trash icon (not available for the default agent). Click again to confirm deletion.

### Refreshing Data

Click the refresh icon (circular arrows) in the sidebar header to reload the session list from the gateway.

## Build for Production

```bash
pnpm tauri build
```

This produces a native app bundle in `src-tauri/target/release/bundle/`.

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm tauri dev` | Run in development mode |
| `pnpm tauri build` | Build production app |
| `pnpm check` | Type-check with svelte-check |
| `pnpm format` | Format code with Prettier |

## Tech Stack

- **Tauri v2** — Rust backend, web frontend
- **SvelteKit** — frontend framework (Svelte 5 runes)
- **TypeScript** — strict mode
- **Tailwind CSS** — utility-first styling
