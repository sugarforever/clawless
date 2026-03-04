# Protocol Issues

The gateway client (`src/lib/gateway.ts`, `src/lib/types.ts`) does not match the OpenClaw gateway protocol (v3). These must be fixed before the app can connect.

Reference: `../openclaw/src/gateway/protocol/schema/frames.ts`

## 1. Connect params structure is wrong

**File:** `src/lib/gateway.ts:93-97`, `src/lib/types.ts:29-33`

Current:
```ts
{ client: 'clawless', version: '0.1.0', capabilities: ['tool-events'] }
```

Gateway expects:
```ts
{
  minProtocol: 3,
  maxProtocol: 3,
  client: {
    id: 'clawless',
    displayName: 'Clawless',
    version: '0.1.0',
    platform: 'tauri',
    mode: 'operator'
  },
  role: 'operator',
  auth: { token: '<gateway-token>' }
}
```

`client` must be an object with `id`, `version`, `platform`, `mode` (all required). `minProtocol`/`maxProtocol` are required for version negotiation. `auth.token` is required unless connecting from loopback with local auth.

## 2. Method name `Connect` should be `connect`

**File:** `src/lib/gateway.ts:93`

The gateway matches method names case-sensitively. `"Connect"` will be rejected with "first request must be connect". Must be lowercase `"connect"`.

## 3. Response frame shape mismatch

**File:** `src/lib/types.ts:10-16`, `src/lib/gateway.ts:149`

Current code reads `res.payload`. The gateway sends successful responses with `res.result` (not `payload`). Error responses send `res.error` as an object `{ code, message, details? }`, not a plain string.

The `HelloOk` response also has a different shape than defined — it includes `protocol`, `server: { version, connId }`, and a `snapshot` object.

Update `Response` type:
```ts
interface Response {
  type: 'res';
  id: string;
  ok: boolean;
  result?: unknown;       // success payload (not "payload")
  error?: {               // error detail (not a string)
    code: number;
    message: string;
    details?: unknown;
  };
}
```

## 4. Event frame type is `evt`, not `event`

**File:** `src/lib/types.ts:18-23`, `src/lib/gateway.ts:47`

Current code checks `frame.type === 'event'`. The gateway sends `frame.type === 'evt'`. All events will be silently dropped until this is fixed.

## 5. No auth token in connect handshake

**File:** `src/lib/gateway.ts:90-103`

The gateway token is never sent. The app needs to either:
- Accept a token from user settings and include it in `auth: { token }` in the connect params
- Or rely on loopback + local auth mode (fragile assumption)

Currently `token` is read from the `HelloOk` response (`res.token`), but the gateway doesn't issue tokens in `HelloOk` — it expects the client to provide one.

## 6. `thinking` param type mismatch

**File:** `src/lib/chat.ts:18`

`thinking` is typed as `boolean`. The gateway expects a string: `"low"`, `"medium"`, or `"high"`.

## 7. CLAUDE.md protocol reference is incorrect

**File:** `CLAUDE.md:66-72`

The documented frame format and connection flow have the same errors listed above (capitalized method name, `payload` instead of `result`, `event` instead of `evt`). Update to match the actual protocol so future AI-assisted work doesn't repeat these mistakes.
