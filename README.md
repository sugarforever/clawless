# Clawless 🦞

**Your conversations don't end when you close a chat window.**

Clawless is a desktop companion for [OpenClaw](https://github.com/nichochar/openclaw) — the AI assistant that lives across your messaging apps. It gives you one place to browse, search, and resume every conversation you've ever had with OpenClaw, no matter which channel it started in.

Telegram, Discord, Slack, WhatsApp — Clawless sees them all.

## The Problem

You asked OpenClaw something brilliant in a Telegram group last Tuesday. Now you need to pick up that thread, but it's buried under 400 messages about lunch plans. The channel apps don't let you re-enter old AI sessions. That context is effectively gone.

## The Fix

Clawless connects directly to the OpenClaw gateway and pulls in every session from every channel. Click one, and you're back in the conversation — with full history, streaming replies, and image attachments.

- **All channels, one sidebar** — Telegram, Discord, Slack, WhatsApp, Matrix, cron jobs, direct sessions
- **Search everything** — find sessions by name, content, or channel
- **Resume instantly** — pick any session and continue chatting
- **Real-time streaming** — responses appear token by token
- **Image attachments** — send images from your desktop, see them inline
- **Manage agents** — create, configure, and switch between OpenClaw agents

## Quick Start

Make sure the [OpenClaw gateway](https://github.com/nichochar/openclaw) is running, then:

```bash
pnpm install
pnpm tauri dev
```

Green dot in the sidebar = connected. Pick a session and go.

## Download

Grab the latest release from [GitHub Releases](https://github.com/sugarforever/clawless/releases) — available for macOS, Windows, and Linux.

## Development

| Command | What it does |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm tauri dev` | Run in dev mode |
| `pnpm tauri build` | Build production app |
| `pnpm check` | Type-check |

## License

MIT
