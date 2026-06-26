# My Portfolio Monitor 2026 - Project Context

Use this file first in future Codex sessions to reduce repeated context and token use.

## Purpose

Personal US stock/ETF portfolio dashboard powered by Google Sheets. The app is a static GitHub Pages web app for quickly checking:

- Portfolio value, invested amount, profit/loss, daily change, IRR, volatility, Sharpe, drawdown
- Allocation by ticker/layer and target gaps
- Portfolio holdings with shares, price, average cost, value, gain/loss, target weight, signal, RSI 7/14
- Smart DCA candidates from the sheet signal board
- Monthly DCA rhythm and average active monthly contribution
- Return simulator / My Goal scenarios

## Current Repository

- Local path: `C:\Users\golf_\OneDrive\Documents\My Portfolio Monitor 2026`
- Git remote: `https://github.com/damrongsukch/my-portfolio-monitor-2026.git`
- Main site: `https://damrongsukch.github.io/my-portfolio-monitor-2026/`
- Branch: `main`
- App type: static HTML/CSS/JS, no build step required

## Main Files

- `index.html` - page structure, sidebar/bottom nav, inline compatibility patches, cache-busted CSS/JS links
- `styles.css` - all responsive styling, desktop/mobile layouts, holdings cards, charts, theme
- `script.js` - data loading, Google Sheet parsing, rendering, Smart DCA, holdings, charts, goal simulator
- `assets/` - local logo files for tickers
- `PRODUCT.md` - product/design intent notes, currently untracked
- `PROJECT_CONTEXT.md` - this handoff/context file

## Data Source

The web app reads published Google Sheets through GViz JSONP.

`script.js` uses:

```js
const DATA_SHEETS = {
  kpi: "Looker_KPI",
  holdings: "Looker_Holdings",
  nav: "Looker_NAV",
  monthly: "Looker_Monthly",
  signals: "Looker_Signals"
};
```

Expected sheet responsibilities:

- `Looker_KPI` - top-level metrics and market mode
- `Looker_Holdings` - portfolio holdings, shares, price, avg cost, value, PL, weights, targets
- `Looker_NAV` - NAV/history for equity curve
- `Looker_Monthly` - monthly contribution / month rhythm chart
- `Looker_Signals` - signal board, RSI, priority, Smart DCA cap, Final_Action

## Signal Priority

Smart DCA and holdings signals should use this priority:

1. `Final_Action`
2. `Signal`
3. `EMA_Signal`

This is intentional. `Final_Action` is the user-approved action logic from Google Sheet. If `Final_Action` is blank, the app falls back safely so the web app does not break.

## Smart DCA Logic

Smart DCA should not invent size from RSI alone.

Current intended behavior:

- Parse explicit sizing from `Final_Action`, for example `BUY 0.25x`, `BUY 0.50x`, `BUY 0.75x`, `BUY 1x`
- Exclude `WAIT`, `HOLD`, `REDUCE`, `SELL`, `NO BUY`, `AVOID`
- Use target gap, priority, and RSI only to rank candidates with eligible actions
- Respect `Smart_DCA_USD` as a per-stock cap when present
- Show reason/source in the UI so it is clear whether sizing came from `Final_Action` or fallback

Important display detail:

- `BUY 0.75x` must display with the decimal point, not `BUY 075x`
- Mobile holding gain/loss percent should include sign, for example `+0.76%` or `-1.19%`

## UI Preferences / Design Direction

User preference: professional premium, clear, practical, not playful.

Key UI rules established through prior iterations:

- Desktop holdings should look sharp, table-like, and premium
- Mobile holdings should be stacked and readable with no overlapping text
- Mobile holdings order: asset info, gain/loss, Price / Avg / Value, target meter, RSI + signal
- Layer pills should be color-coded:
  - Core: green
  - Growth: yellow
  - Income: blue
  - Alpha: red
- Allocation donut center should show stock count, e.g. `12 Stocks` and `Invested`, based on actual holdings count
- Allocation legend should show all tickers, not collapse into `Others`
- RSI text color:
  - RSI below 30: red
  - RSI above 70: green
- Monthly Performance should show:
  - Start month
  - Avg active monthly contribution
  - Current month count, not fixed `4/12`
  - Running total
- Avoid horizontal scroll on mobile except where unavoidable for large tables

## Deployment Workflow

No build command is required. After editing static files:

```powershell
git status --short
node --check script.js
git diff --check
git add index.html styles.css script.js assets
git commit -m "Short clear message"
git push origin main
```

Then verify GitHub Pages with a cache-busting query:

```powershell
Invoke-WebRequest -Uri "https://damrongsukch.github.io/my-portfolio-monitor-2026/?v=<commit>" -UseBasicParsing
```

Also check that `index.html` references the new cache version for `script.js` / `styles.css` after JS or CSS changes.

## Recent Important Commits

- `b5bbb2f` - Show signed mobile gain percent
- `708933d` - Use Final Action for Smart DCA sizing
- `76a8058` - Improve responsive UX and sync states

## Current Untracked Items To Avoid Accidentally Committing

These may exist locally and should not be committed unless the user explicitly asks:

- `.agents/`
- `.impeccable/`
- `PRODUCT.md`
- `output/`

## Common Checks Before Saying Done

1. `node --check script.js`
2. `git diff --check`
3. Verify mobile holding cards do not overlap at around 435px width
4. Verify production URL with cache-bust after push
5. Confirm Smart DCA reads `Final_Action` before `Signal` / `EMA_Signal`
6. Confirm positive mobile PL percent has `+`

## User Working Style

- User prefers direct implementation when they say "แก้ไขได้เลย", "ลุย", or "deploy"
- Keep Thai responses concise and practical
- Mention exactly what changed and whether it was deployed
- If deployment is requested and checks pass, commit and push to `main`
- Do not over-explain generic finance; focus on the actual dashboard and sheet logic

