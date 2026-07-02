# My Portfolio Monitor 2026 - Machine Handoff

Last reviewed: 2026-07-02

## Project Summary

My Portfolio Monitor 2026 is a static portfolio dashboard powered by published Google Sheets data. It has no build step and is deployed with GitHub Pages.

- Repository: `https://github.com/damrongsukch/my-portfolio-monitor-2026`
- Production: `https://damrongsukch.github.io/my-portfolio-monitor-2026/`
- Default branch: `main`
- Current local path: `C:\Users\golf_\OneDrive\Documents\My Portfolio Monitor 2026`
- Stack: HTML, CSS, vanilla JavaScript, SVG charts, Google Sheets GViz JSONP

## Source Of Truth

The Google Sheet is the source of truth for portfolio values, holdings, targets, signals, RSI, NAV, and monthly contributions.

- Spreadsheet ID: `1rV26pJqw8rMNO0nplvE9K0gsMCotfZ4dgvXs5kgRFDk`
- Required published tabs:
  - `Looker_KPI`
  - `Looker_Holdings`
  - `Looker_NAV`
  - `Looker_Monthly`
  - `Looker_Signals`

Signal fallback order must remain:

1. `Final_Action`
2. `Signal`
3. `EMA_Signal`

The dashboard intentionally reads public GViz endpoints. Never add passwords, API keys, brokerage credentials, or private account data to this repository.

## Important Files

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure, navigation, metadata, favicon declarations, cache-busted asset links |
| `styles.css` | Desktop/mobile layouts, themes, tables, cards, responsive rules |
| `script.js` | Sheet loading, parsing, calculations, rendering, charts, Smart DCA, simulator |
| `assets/favicon.*` | Browser tab and device icons |
| `assets/logos/` | Local ticker logos for SCHD, TSM, NEOS funds, and RKLB |
| `PROJECT_CONTEXT.md` | Short operational context for future Codex sessions |
| `PROJECT_HANDOFF.md` | Full migration and recovery guide |
| `PORTFOLIO_HISTORY.md` | Local portfolio history and comparison notes; currently not tracked |
| `PRODUCT.md` | Local product/design direction; currently not tracked |

## External Runtime Dependencies

The deployed app needs browser access to:

- `docs.google.com` for GViz sheet data
- `cdn.simpleicons.org` for selected ticker logos
- Google/Clearbit fallback logo endpoints when a primary logo fails

Local assets are preferred for logos that previously rendered poorly.

## Move To A New Computer

### 1. Install tools

- Git
- A modern browser such as Chrome or Edge
- Node.js, recommended for `node --check script.js`
- Python 3, optional but convenient for the local static server

### 2. Clone

```powershell
git clone https://github.com/damrongsukch/my-portfolio-monitor-2026.git
Set-Location .\my-portfolio-monitor-2026
```

### 3. Restore local-only files

Copy these separately from the old computer if they are still needed because they are not all tracked by Git:

- `PORTFOLIO_HISTORY.md`
- `PRODUCT.md`
- `.agents/`
- `.impeccable/`
- `output/`

Do not copy `.git/` into a fresh clone.

### 4. Run locally

Use a free port. Port `4173` may already belong to another local project.

```powershell
python -m http.server 4174 --bind 127.0.0.1
```

Open `http://127.0.0.1:4174/`.

### 5. Confirm data access

The top banner should change from loading to `Google Sheet synced`, and Market Status should show `Sheet Live`. If it does not:

1. Confirm the Sheet is published and accessible.
2. Confirm the five tab names have not changed.
3. Check the browser console for GViz or network errors.
4. Confirm `SHEET_ID` and `DATA_SHEETS` near the top of `script.js`.

## Development Workflow

Before editing:

```powershell
git status --short
git pull --ff-only origin main
```

After editing:

```powershell
node --check script.js
git diff --check
git status --short
```

Stage only intended files. Do not use `git add .` while local-only folders are present.

```powershell
git add -- index.html styles.css script.js assets PROJECT_HANDOFF.md
git commit -m "Describe the change"
git push origin main
```

GitHub Pages deploys from `main`. Verify with a cache-busting URL:

```text
https://damrongsukch.github.io/my-portfolio-monitor-2026/?v=<commit>
```

## Cache And Favicon Notes

- Update query versions in `index.html` whenever CSS, JavaScript, or favicon assets change.
- The favicon has SVG, PNG, ICO, shortcut-icon, and Apple touch-icon fallbacks.
- Browser tab icons are aggressively cached. Use a new cache key and then hard refresh or close/reopen the tab.

## Functional QA Checklist

- Production page returns HTTP 200.
- Header shows `Sheet Live` after data loads.
- No relevant console errors or framework error overlays.
- Desktop holdings show 8 columns, including Day and Total Gain/Loss.
- Footer totals show value, day amount/percent, and total amount/percent.
- Positive and negative values have explicit signs and correct colors.
- Mobile holdings do not overlap around 435 px width.
- Layer filters and holdings sorting work.
- RSI below 30 is red; RSI above 70 is green.
- Smart DCA uses explicit `Final_Action` sizing when available.
- Allocation donut uses the actual invested holding count.
- Light and dark themes remain readable.
- Browser tab displays the portfolio chart icon, not a letter fallback.

## Current Workspace Notes

At the 2026-07-02 audit, the tracked application files passed JavaScript syntax and whitespace checks. The following local changes/items existed and should be reviewed deliberately rather than committed automatically:

- `PROJECT_CONTEXT.md` has a local addition referencing `PORTFOLIO_HISTORY.md`.
- `PORTFOLIO_HISTORY.md` is untracked.
- `PRODUCT.md`, `.agents/`, `.impeccable/`, and `output/` are local-only/untracked.

## Recovery

If production breaks after a change:

```powershell
git log --oneline -10
git revert <bad-commit>
git push origin main
```

Prefer `git revert` over destructive reset so the deployment history remains auditable.

## Working With Codex

Start a new session with:

```text
Read PROJECT_CONTEXT.md and PROJECT_HANDOFF.md, then continue work on My Portfolio Monitor 2026.
```

For portfolio allocation decisions, also read `PORTFOLIO_HISTORY.md` if it was restored to the new computer.
