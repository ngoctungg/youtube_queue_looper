# Copilot Instructions

## Project Overview

**YouTube Queue Looper** is a lightweight Firefox browser extension that injects a **Loop Playlist** button into YouTube's queue/playlist side panel. When enabled, it automatically restarts the queue from the first video after the last video finishes.

## Project Structure

```
youtube_queue_looper/
├── content_script.js   # All extension logic injected into youtube.com pages
├── manifest.json       # WebExtension manifest (MV2) — metadata, permissions, content script declaration
├── icons/
│   └── icon.png        # Extension icon (64×64)
├── package.json        # Dev dependencies (web-ext-plugin)
├── package-lock.json
└── webpack.config.mjs  # Webpack config using web-ext-plugin
```

## Development Workflow

### Prerequisites

- Node.js v18 or later
- Firefox
- `web-ext` CLI (`npm install -g web-ext` or use via `npx`)

### Setup & Running

```bash
npm install
npx web-ext run --source-dir .
```

This loads the extension in a temporary Firefox profile for live testing against `youtube.com`.

### Manual Testing

All functional testing is manual in Firefox:

1. Open a YouTube video that has a queue/playlist in the side panel.
2. Verify the loop icon appears in the queue panel action bar.
3. Click the icon — it should highlight (active state).
4. Let the last video in the queue end — playback should jump back to the first video.
5. Click again to disable looping.

There is no automated test suite; validate changes manually in Firefox before submitting.

## Key Patterns & Conventions

### `content_script.js`

- **Single file** — all logic lives in `content_script.js`. Keep it that way unless the file grows significantly.
- Uses **`MutationObserver`** (not polling) to react to YouTube DOM changes:
  - One observer watches the playlist panel to inject (or re-inject) the custom loop button when needed.
  - A second observer watches the YouTube play/pause button's `title` attribute to detect when a video ends (`title === "Replay"`).
- The loop button is injected only when YouTube's native loop button (`ytd-playlist-loop-button-renderer`) is absent.
- YouTube custom elements used: `ytd-playlist-panel-video-renderer`, `ytd-playlist-loop-button-renderer`, `ytd-playlist-panel-renderer`.
- SVG icons are inlined directly in the JS, using YouTube's own icon style so the button blends with the native UI.
- The script is wrapped in a `setTimeout(..., 2000)` to wait for YouTube's dynamic content to render before attaching observers.

### Manifest

- Uses **Manifest Version 2** (MV2) — required for Firefox Add-ons compatibility.
- `content_scripts` match `*://*.youtube.com/*` with `run_at: document_idle`.
- No background scripts, no extra permissions.

### Style

- Plain vanilla JavaScript — no frameworks or build steps required for the extension itself.
- Keep the code minimal and self-contained.
- Follow the existing code style: `let`/`const`, template literals, arrow functions where appropriate.
- Avoid adding new dependencies unless strictly necessary.
