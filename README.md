# CUA: AI Orchestration Engine ✨

An advanced AI orchestration engine to manage a family of AI agents, execute complex workflows, and configure system behavior through an interactive command-line interface and configuration panels.

This application provides a powerful front-end to control and visualize a Triple-LLM (Gemini, OpenAI, Abacus) architecture, orchestrating a family of specialized AI agents to perform complex software development and deployment tasks.

---

## Key Features

- **Triple-LLM Control Center**: Initiate, configure, and monitor complex missions using a dynamic blend of Gemini, OpenAI, and Abacus models.
- **Live Agentic Core**: Engage in real-time, comparative conversations with AI agents, viewing responses from all three LLMs simultaneously.
- **Inference & Ledger**: A searchable repository of all completed orchestrations (SPAs), allowing you to review, re-enact, and share context from past missions.
- **Dynamic Orchestration Visualization**: Watch in real-time as the master orchestrator (LYRA) breaks down missions and delegates tasks to the appropriate agents.
- **Agentic Nexus CLI**: An in-app terminal for direct interaction with the CUA ecosystem.
- **Rich Content Display**: A custom document renderer (`NeonDoc`) supports formatted text, code blocks, callouts, and more for detailed agent profiles and plans.
- **Live API Integration**: Connects to a live backend at `https://api.andiegogiap.com` to drive orchestration workflows and persist data.

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom neon-glow effects
- **Terminal**: XTerm.js
- **Build**: No build step required. The app uses modern browser features (ESM via importmap) for a build-free development experience.

---

# CUSTOM INSTRUCTIONS: Gemini Pages Deploy v1

**Purpose**
Enable any client (IDE plugin, SPA, backend job, WordPress, CI) to publish or update static agent pages by POSTing HTML to the orchestrator endpoint. Keep secrets server-side. Support dev proxies without leaking tokens.

---

## Contract

* **Endpoint (direct):** `POST https://api.andiegogiap.com/v1/gemini/pages`
* **Auth:** `Authorization: Bearer <API_BEARER_TOKEN>` (server-side only)
* **Content-Type:** `application/json`
* **Idempotency:** Same `slug` overwrites the existing page file.
* **Publish path:** `https://andiegogiap.com/gemini/<slug>.html`

### Request (JSON)

```json
{
  "slug": "agent-dashboard",           // kebab-case; becomes agent-dashboard.html
  "title": "Agent Dashboard v2",       // optional; used in <title> if your template does
  "html": "<!doctype html> ... </html>"// full HTML string (caller is responsible for safety)
}
```

### Success Response (JSON)

```json
{
  "status": "success",
  "message": "Deployment successful",
  "endpoint": "https://api.andiegogiap.com/v1/gemini/pages",
  "path": "/www/wwwroot/andiegogiap.com/gemini/agent-dashboard.html",
  "public_url": "https://andiegogiap.com/gemini/agent-dashboard.html",
  "content_hash": "<sha256-of-html>"
}
```

### Error Response (JSON)

```json
{
  "error": "Unauthorized | html required (string) | ...",
  "statusCode": 401
}
```

---

## Environment & Security

* **Never** ship the bearer token to browsers or client apps. Inject it **server-side** (proxy or backend).
* Required env vars (server/CI):

```
API_BASE_URL=https://api.andiegogiap.com
API_BEARER_TOKEN=***secret***
```

* Optional:

```
PAGES_DIR=/www/wwwroot/andiegogiap.com/gemini   # already configured on server
```

---

## Routing Rules

* **Direct (backend/CI):** call `https://api.andiegogiap.com/v1/gemini/pages` with Bearer header.
* **Dev proxy (SPAs):** route `/orch/*` → `https://api.andiegogiap.com/*` and inject the Bearer at the dev server (Vite `server.proxy`) or at Nginx (`/gemini/orch/*`).

  * Frontend calls `/orch/v1/gemini/pages` with **no** token; proxy adds `Authorization`.

---

## Client Examples

### cURL (backend/CI)

```bash
curl -i "$API_BASE_URL/v1/gemini/pages" \
  -X POST \
  -H "Authorization: Bearer $API_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "slug":"agent-dashboard",
    "title":"Agent Dashboard v2",
    "html":"<!doctype html><html><head><meta charset=\"utf-8\"><title>Agent Dashboard v2</title></head><body><h1>Updated</h1></body></html>"
  }'
```

### Node (server)

```js
import fetch from "node-fetch";
const res = await fetch(process.env.API_BASE_URL + "/v1/gemini/pages", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.API_BEARER_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    slug: "agent-dashboard",
    title: "Agent Dashboard v2",
    html: "<!doctype html>...</html>"
  })
});
if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
const out = await res.json();
console.log("Published:", out.public_url);
```

### Frontend (SPA via dev/edge proxy)

```ts
// Vite dev proxy or Nginx edge injects the bearer
async function deployPage(slug: string, title: string, html: string) {
  const res = await fetch("/orch/v1/gemini/pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, title, html })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

### WordPress (WPGetAPI)

* API: Base `https://api.andiegogiap.com`, headers include `Authorization: Bearer <token>` and `Content-Type: application/json`.
* Endpoint: `POST /v1/gemini/pages`

```php
$response = wpgetapi_endpoint('andiegogiap_api','gemini_pages', array(
  'body' => array(
    'slug' => 'agent-dashboard',
    'title' => 'Agent Dashboard v2',
    'html' => '<!doctype html>...</html>'
  )
));
```

---

## Output Discipline (for assistants/agents)

When an agent performs a deploy:

* **Speak:** short confirmation + public URL.
* **Artifacts:** include `public_url` and `content_hash`.
* **Telemetry:** only on error (status code + hint).

Example agent reply:

```
Deployed **agent-dashboard** → https://andiegogiap.com/gemini/agent-dashboard.html
```

---

## Validation & Safety

* Ensure `html` is a **complete** document (`<!doctype html>`, `<html>`, `<head>`, `<body>`).
* Keep `slug` to `[a-z0-9-]` only; system will sanitize.
* If overwriting, agents should mention “updated existing page”.

---

## Quick Tests

* Health: `curl -I https://andiegogiap.com/gemini/agent-dashboard.html` → `200`
* JSON shape: ensure `public_url` present on success.
* 401 test: call without token server-side → expect 401 (never do this in a browser).

---

## Versioning

* Add request header `X-CI-Version: 2025-08-11` so clients can detect server changes.
* Keep these instructions under the tag: `Gemini Pages Deploy v1`.

---

## Failure Playbook

* **404**: route not mounted — ensure API exposes `POST /v1/gemini/pages`.
* **401**: missing/invalid bearer — fix proxy or server env.
* **403/405**: wrong method or blocked by WAF — confirm POST and path.
* **5xx**: check server logs and directory write permissions.

---

## Optional (CI Command)

Define a CI job named “Deploy Agent Page”:

* Inputs: `slug`, `title`, `html_path`
* Step: read `html_path`, POST to `/v1/gemini/pages` with bearer
* Output: echo `public_url`

---
