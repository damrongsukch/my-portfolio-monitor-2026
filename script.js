let benchmarkRows = [];
let benchmarkQqqRows = [];
let actualPortfolioReturns = [];
let benchmarkCompare = { portfolio: 0, spyReturn: 0, spyVsPort: 0, qqqReturn: 0, qqqVsPort: 0 };
let cashflowBenchmark = { portfolio: 0, spy: 0, qqq: 0, invested: 0 };
let cashflowPurchases = [];
let performanceVerified = false;

let navRows = [
  [46098, 66.25, 65.55, 0, 0],
  [46105, 227.75, 711.88, 0.002, 0],
  [46112, 291.42, 1853.86, -0.005, 0],
  [46120, 0, 2709.54, 0.18, 0],
  [46128, 0, 3117.17, 0.003, 0],
  [46136, 336.15, 3983.47, 0.012, 0],
  [46144, 0, 4514.86, 0.0004, 0],
  [46150, 0, 5310.83, 0.028, 0]
];

let holdings = [
  { ticker: "SPMO", layer: "Core", shares: "0.1112111", price: "$143.81", value: 515.03, valueText: "THB 515.03", pl: "26.53%", weight: 9.70, signal: "HOLD" },
  { ticker: "NVDA", layer: "Growth", shares: "0.1634117", price: "$215.22", value: 1132.56, valueText: "THB 1,132.56", pl: "14.97%", weight: 21.32, signal: "HOLD" },
  { ticker: "GOOGL", layer: "Growth", shares: "0.0317128", price: "$400.71", value: 409.22, valueText: "THB 409.22", pl: "37.08%", weight: 7.70, signal: "HOLD" },
  { ticker: "PLTR", layer: "Growth", shares: "0.1481048", price: "$137.80", value: 657.23, valueText: "THB 657.23", pl: "-3.74%", weight: 12.37, signal: "HOLD" },
  { ticker: "TSM", layer: "Growth", shares: "0.0414339", price: "$411.68", value: 549.30, valueText: "THB 549.30", pl: "18.29%", weight: 10.34, signal: "BUY" },
  { ticker: "QQQI", layer: "Income", shares: "0.2030812", price: "$56.50", value: 369.50, valueText: "THB 369.50", pl: "7.94%", weight: 6.96, signal: "HOLD" },
  { ticker: "IAUI", layer: "Income", shares: "0.2208413", price: "$57.23", value: 407.01, valueText: "THB 407.01", pl: "1.35%", weight: 7.66, signal: "HOLD" },
  { ticker: "RKLB", layer: "Growth", shares: "0.1307652", price: "$105.55", value: 444.47, valueText: "THB 444.47", pl: "44.54%", weight: 8.37, signal: "HOLD" }
];

let signalBoard = holdings.map((item) => ({
  ...item,
  rsi7: 0,
  rsi14: 0,
  priority: 99,
  smartDcaUsd: 0,
  signalSource: "Fallback"
}));

let signals = [
  { title: "US Market Trend", text: "MODE A active, broad trend supportive", status: "BULLISH", tone: "positive" },
  { title: "Momentum", text: "Most growth holdings above trend filters", status: "POSITIVE", tone: "positive" },
  { title: "Volatility", text: "Daily volatility from sheet", status: "CAUTION", tone: "caution" },
  { title: "Max Drawdown", text: "Drawdown is inside guardrail", status: "NEUTRAL", tone: "neutral" }
];

let monthly = [
  { label: "Mar '26", value: 1506.42 },
  { label: "Apr '26", value: 1092.99 },
  { label: "May '26", value: 2403.46 },
  { label: "Jun '26", value: 5411.99 },
  { label: "Jul '26", value: 3628.52 },
  { label: "Aug '26", value: 3346.99 }
];

let kpis = {
  portfolioValue: "THB 5,311.28",
  invested: "THB 4,700.03",
  profit: "THB 611.25",
  totalReturn: "13.01%",
  irr: "361.54%",
  volatility: "3.41%",
  sharpe: "4.93",
  maxDrawdown: "-1.69%",
  benchmarkSpy: "3.63%",
  benchmarkQqq: "1.79%",
  vix: "17.28",
  greedFear: "68",
  sp500Trend: "Above EMA200",
  marketBreadth: "62%",
  bondYield: "4.28%",
  dailyProfit: "THB 161.75",
  dailyChange: "2.955%",
  cash: "THB 0.00",
  cashWeight: "0.00%",
  marketMode: "MODE A"
};

const SHEET_ID = "1rV26pJqw8rMNO0nplvE9K0gsMCotfZ4dgvXs5kgRFDk";
const DATA_SHEETS = { kpi: "Looker_KPI", holdings: "Looker_Holdings", nav: "Looker_NAV", monthly: "Looker_Monthly", trades: "Trade_Log", signals: "Looker_Signals", watchlist: "Watchlist", benchmark: "Benchmark_SPY", qqq: "Benchmark_QQQ", compare: "Dashboard", actualReturns: "Actual_Portfolio_Returns", cashflowCompare: "Cashflow_Benchmark_Compare" };
const colors = ["#25e05d", "#f6c21a", "#4aa3ff", "#ff5148", "#b57cff", "#13b981", "#94a3b8", "#38bdf8", "#fb7185", "#a3e635", "#f97316", "#22d3ee", "#e879f9", "#facc15", "#60a5fa", "#34d399"];
const MIN_ORDER_USD = 1.5;
const GOAL_INFLATION_RATE = 3;
const LIVE_REFRESH_MS = 60000;
const PRICE_ALERTS_STORAGE_KEY = "portfolioPriceAlerts";
const WATCHLIST_STORAGE_KEY = "portfolioInterestWatchlist";
let allocationMode = "sector";
let activeFilter = "All";
let performancePeriod = "ALL";
let currencyMode = "THB";
let holdingsSort = { key: "preferred", direction: "asc" };
let holdingsPerformancePeriod = "all";
let indicatorTimeframe = "Daily";
let liveDataLoading = false;
let lastLiveSyncMs = 0;
let signalUniverse = [];
let sheetWatchlistRows = [];
let watchlistFilter = "all";
let watchlistSort = "interest";
let watchlistTheme = "all";
let watchlistDensity = "compact";
let benchmarkReturnPeriod = "weekly";
let benchmarkRangePeriod = "ALL";
let benchmarkPlanStart = "2026-09-02";
let benchmarkVisible = { spy: true, qqq: true };
let benchmarkComparisonMode = "cashflow";

const logoDomains = { VOO: "vanguard.com", SPMO: "invesco.com", VXUS: "vanguard.com", SCHD: "schwab.com", NVDA: "nvidia.com", GOOGL: "google.com", META: "meta.com", MSFT: "microsoft.com", AVGO: "broadcom.com", TSM: "tsmc.com", LLY: "lilly.com", PLTR: "palantir.com", QQQI: "neosfunds.com", IAUI: "neosfunds.com", MLPI: "neosfunds.com", RKLB: "rocketlabusa.com" };
const logoUrls = { VOO: "./assets/logos/vanguard.svg", SPMO: "./assets/logos/spmo.png", VXUS: "./assets/logos/vanguard.svg", SCHD: "./assets/logos/schd.svg", NVDA: "https://cdn.simpleicons.org/nvidia/76B900", GOOGL: "./assets/logos/google.svg", META: "https://cdn.simpleicons.org/meta/0866FF", AVGO: "https://cdn.simpleicons.org/broadcom/CC092F", TSM: "./assets/logos/tsmc.png", LLY: "./assets/logos/lly.svg", PLTR: "https://cdn.simpleicons.org/palantir/FFFFFF", QQQI: "./assets/logos/neos.jpg", IAUI: "./assets/logos/neos.jpg", MLPI: "./assets/logos/neos.jpg", RKLB: "./assets/logos/rklb.jpg" };
const watchlistLogoUrls = { GLDM: "./assets/logos/watchlist/gldm.gif", MLPI: "./assets/logos/neos.jpg", MSFT: "./assets/logos/watchlist/msft.ico", AVGO: "./assets/logos/watchlist/avgo.png", META: "./assets/logos/watchlist/meta.ico", PLTR: "./assets/logos/watchlist/pltr.ico", RKLB: "./assets/logos/watchlist/rklb.ico", AMD: "./assets/logos/watchlist/amd.png", SPCX: "./assets/logos/watchlist/spcx.png", QDTE: "./assets/logos/watchlist/roundhill.svg", SPYI: "./assets/logos/neos.jpg", DIVO: "./assets/logos/watchlist/divo.png", IWMI: "./assets/logos/neos.jpg", NIHI: "./assets/logos/neos.jpg", MLPD: "./assets/logos/watchlist/mlpd.ico", ROCQ: "./assets/logos/watchlist/jpmorgan.png", O: "./assets/logos/watchlist/o.png", DRAM: "./assets/logos/watchlist/roundhill.svg", SMH: "./assets/logos/watchlist/vaneck.png", VDE: "./assets/logos/vanguard.svg", XLE: "./assets/logos/watchlist/gldm.gif" };
const preferredHoldingOrder = ["VOO", "SPMO", "VXUS", "SCHD", "IAUI", "QQQI", "NVDA", "GOOGL", "TSM", "LLY"];
const preferredHoldingRank = new Map(preferredHoldingOrder.map((ticker, index) => [ticker, index]));
const watchlistProfiles = {
  GLDM: { name: "SPDR Gold MiniShares Trust", type: "ETF", theme: "Gold exposure" },
  MLPI: { name: "MLP / income idea", type: "ETF", theme: "Income watch" },
  MSFT: { name: "Microsoft", type: "US stock", theme: "Mega-cap software" },
  AVGO: { name: "Broadcom", type: "US stock", theme: "AI infrastructure" },
  META: { name: "Meta Platforms", type: "US stock", theme: "Digital advertising / AI" },
  PLTR: { name: "Palantir", type: "US stock", theme: "AI software" },
  RKLB: { name: "Rocket Lab", type: "US stock", theme: "Space / launch systems" },
  AMD: { name: "Advanced Micro Devices", type: "US stock", theme: "Semiconductors" },
  SPCX: { name: "SPAC and new issue ETF", type: "ETF", theme: "Growth watch" },
  QDTE: { name: "Roundhill N-100 0DTE Covered Call ETF", type: "ETF", theme: "Income watch" },
  SPYI: { name: "NEOS S&P 500 High Income ETF", type: "ETF", theme: "Income watch" },
  DIVO: { name: "Amplify CWP Enhanced Dividend Income ETF", type: "ETF", theme: "Dividend income" },
  IWMI: { name: "NEOS Russell 2000 High Income ETF", type: "ETF", theme: "Small-cap income" },
  NIHI: { name: "NEOS Nasdaq-100 High Income ETF", type: "ETF", theme: "Income watch" },
  MLPD: { name: "Global X MLP & Energy Infrastructure Covered Call ETF", type: "ETF", theme: "Energy income" },
  ROCQ: { name: "JPMorgan Nasdaq Equity Premium Income ETF", type: "ETF", theme: "Income watch" },
  O: { name: "Realty Income", type: "US stock", theme: "REIT income" },
  DRAM: { name: "Roundhill DRAM ETF", type: "ETF", theme: "Semiconductors" },
  SMH: { name: "VanEck Semiconductor ETF", type: "ETF", theme: "Semiconductors" },
  VDE: { name: "Vanguard Energy Index Fund ETF", type: "ETF", theme: "Energy" },
  XLE: { name: "Energy Select Sector SPDR Fund", type: "ETF", theme: "Energy" }
};

function numberFrom(value) { const cleaned = String(value ?? "").replace(/[^0-9.-]/g, ""); const parsed = Number(cleaned); return Number.isFinite(parsed) ? parsed : 0; }
function moneyText(value) { const text = String(value || "").trim(); return text ? text.replace("\u0e3f", "THB ").replace("\u00e0\u00b8\u00bf", "THB ") : "THB 0.00"; }
function percentText(value) { const text = String(value ?? "").trim(); if (!text) return "0.00%"; if (text.includes("%")) return text; const amount = numberFrom(value); const percent = Math.abs(amount) <= 1 ? amount * 100 : amount; return `${percent.toFixed(2)}%`; }
function decimalText(value, digits = 2) { return numberFrom(value).toFixed(digits); }
function plusText(value, formatter) { const text = formatter(value); return text.startsWith("-") || text.startsWith("+") ? text : `+${text}`; }
function cleanSignal(value) { return String(value || "HOLD").replace(/[^\w\s().%/-]+/g, "").trim() || "HOLD"; }
function rowsToObjects(rows) { const [headers, ...body] = rows; return body.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]))); }
function kpiCellValue(row, fallback = "") { return row && (row.Value || row.Display_Value) ? (row.Value || row.Display_Value) : fallback; }
function kpiValue(rows, metric, fallback = "") { return kpiCellValue(rows.find(row => row.Metric === metric), fallback); }
function kpiAny(rows, metrics, fallback = "") { const names = (Array.isArray(metrics) ? metrics : [metrics]).map(name => String(name).toLowerCase()); return kpiCellValue(rows.find(row => names.some(name => String(row.Metric || "").toLowerCase().includes(name))), fallback); }
function rowAny(row, names, fallback = "") { for (const key of (Array.isArray(names) ? names : [names])) if (row[key] != null && row[key] !== "") return row[key]; const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ""), value])); for (const key of (Array.isArray(names) ? names : [names])) { const found = normalized[String(key).toLowerCase().replace(/[^a-z0-9]/g, "")]; if (found != null && found !== "") return found; } return fallback; }
function signedClass(value) { const text = String(value || "").trim(); return text.startsWith("-") || numberFrom(text) < 0 ? "negative" : "positive"; }
function normalizeLayer(ticker, layer) { if (String(ticker || "").toUpperCase() === "QQQI") return "Income"; return layerClass(layer); }
function layerClass(layer) { const clean = String(layer || "").split("/")[0].trim().toLowerCase(); if (clean === "growth") return "Growth"; if (clean === "defense" || clean === "defensive") return "Defense"; if (clean === "safe" || clean === "income" || clean === "defensive income") return "Income"; if (clean === "alpha") return "Growth"; return "Core"; }
function tickerLogo(ticker) {
  const symbol = String(ticker || "").trim().toUpperCase();
  const fallback = symbol.slice(0, 2) || "--";
  const primary = watchlistLogoUrls[symbol] || logoUrls[symbol];
  if (!primary) return `<i class="ticker-logo">${fallback}</i>`;
  return `<i class="ticker-logo has-logo logo-${symbol.toLowerCase()}" data-text-fallback="${fallback}"><img src="${primary}" alt="${symbol} logo" loading="lazy" referrerpolicy="no-referrer" onerror="if(this.parentElement){this.parentElement.classList.remove('has-logo');this.parentElement.textContent=this.parentElement.dataset.textFallback||'${fallback}'}"></i>`;
}
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
function setHtml(id, value) { const el = document.getElementById(id); if (el) el.innerHTML = value; }
function setSignedTone(id, value) { const el = document.getElementById(id); if (!el) return; el.classList.remove("positive", "negative"); el.classList.add(signedClass(value)); }
function formatCurrencyFromThb(valueThb) { const amount = numberFrom(valueThb); if (currencyMode === "USD") return `$${(amount / fxRate()).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; return formatThb(amount); }
function signedCurrencyFromThb(valueThb) { const amount = numberFrom(valueThb); const sign = amount < 0 ? "-" : "+"; const absolute = Math.abs(amount); const text = currencyMode === "USD" ? `$${(absolute / fxRate()).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : formatThb(absolute); return `${sign}${text}`; }
function formatCurrencyFromUsd(valueUsd) { const amount = numberFrom(valueUsd); if (currencyMode === "USD") return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; return formatThb(amount * fxRate()); }
function signedCurrencyFromUsd(valueUsd) { const amount = numberFrom(valueUsd); const sign = amount < 0 ? "-" : "+"; return `${sign}${formatCurrencyFromUsd(Math.abs(amount))}`; }
function holdingGainThb(item) { const pct = numberFrom(item.pl) / 100; if (Number.isFinite(numberFrom(item.costBasisUsd)) && numberFrom(item.costBasisUsd) > 0) return (numberFrom(item.valueUsd) - numberFrom(item.costBasisUsd)) * fxRate(); return pct > -0.99 ? numberFrom(item.value) - (numberFrom(item.value) / (1 + pct)) : 0; }
function assetKind(ticker) { const symbol = String(ticker || "").toUpperCase(); return watchlistProfiles[symbol]?.type || (/VOO|SPMO|VXUS|SCHD|QQQI|IAUI|MLPI|GLDM|SMH|VDE|XLE/i.test(symbol) ? "ETF" : "US stock"); }
function activeTargetKey() { return /MODE\s*B|MODE_B|\bB\b/i.test(kpis.marketMode) ? "targetB" : "targetA"; }
function targetWeight(item) { const preferred = numberFrom(item[activeTargetKey()]); const fallback = numberFrom(item.targetWeight); return preferred || fallback || 0; }
function targetGap(item) { const target = targetWeight(item); return target ? target - numberFrom(item.weight) : 0; }
function targetStatus(item) {
  const target = targetWeight(item);
  if (target <= 0) return { label: item.ticker === "CASH" ? "Cash reserve" : "No new buys", tone: "neutral", gap: 0 };
  const gap = targetGap(item);
  if (gap >= 1) return { label: "Underweight", tone: "positive", gap };
  if (gap <= -1) return { label: "Overweight", tone: "caution", gap };
  return { label: "On target", tone: "neutral", gap };
}
function targetCell(item) {
  const target = targetWeight(item);
  const status = targetStatus(item);
  if (target <= 0) return `<span class="target-cell neutral"><strong>0.0%</strong><small>${status.label}</small></span>`;
  const sign = status.gap > 0 ? "+" : "";
  return `<span class="target-cell ${status.tone}"><strong>${target.toFixed(1)}%</strong><small>${status.label} ${sign}${status.gap.toFixed(1)}%</small></span>`;
}
function targetMeter(item, className = "holding-target") {
  const target = targetWeight(item);
  const weight = numberFrom(item.weight);
  const status = targetStatus(item);
  const fill = target > 0 ? Math.max(4, Math.min(100, (weight / target) * 100)) : 0;
  const targetLabel = `${target.toFixed(1)}%`;
  return `<span class="${className} ${status.tone}" style="--target-fill:${fill.toFixed(0)}%"><strong>${weight.toFixed(1)} <small>/ ${targetLabel}</small></strong><i><b></b></i><em>${status.label}</em></span>`;
}
function indicatorTrend(item) { return cleanSignal(item.totalTrend || item.signal || "Trend n/a"); }
function hasValidRsi(value) {
  const rsi = numberFrom(value);
  return Number.isFinite(rsi) && rsi > 0 && rsi <= 100;
}
function rsiTone(value) {
  const rsi = numberFrom(value);
  if (!hasValidRsi(rsi)) return "neutral";
  if (rsi > 70) return "overbought";
  if (rsi < 30) return "oversold";
  if (rsi < 50) return "watch";
  return "neutral";
}
function rsiValue(value) {
  const rsi = numberFrom(value);
  return `<span class="rsi-value ${rsiTone(rsi)}">${hasValidRsi(rsi) ? rsi.toFixed(1) : "--"}</span>`;
}
function rsiPair(item) { return `${rsiValue(item.rsi7)} <span class="rsi-separator">/</span> ${rsiValue(item.rsi14)}`; }
function indicatorCell(item) { return `<span class="indicator-cell compact"><strong>${rsiPair(item)}</strong></span>`; }
function signalReason(item) { const gap = targetGap(item); return `${indicatorTimeframe}: RSI7 ${numberFrom(item.rsi7).toFixed(1)}, RSI14 ${numberFrom(item.rsi14).toFixed(1)}, ${indicatorTrend(item)}, ${gap > 0 ? `under target ${gap.toFixed(1)}%` : gap < 0 ? `over target ${Math.abs(gap).toFixed(1)}%` : "near target"}, ${kpis.marketMode}`; }
function compareHoldings(a, b) {
  const dir = holdingsSort.direction === "asc" ? 1 : -1;
  if (holdingsSort.key === "preferred") {
    const rankA = preferredHoldingRank.get(String(a.ticker || "").toUpperCase()) ?? preferredHoldingOrder.length;
    const rankB = preferredHoldingRank.get(String(b.ticker || "").toUpperCase()) ?? preferredHoldingOrder.length;
    return rankA === rankB ? numberFrom(b.value) - numberFrom(a.value) : (rankA - rankB) * dir;
  }
  const valueFor = item => {
    if (holdingsSort.key === "target") return targetGap(item);
    if (holdingsSort.key === "pl") return numberFrom(item.pl);
    if (holdingsSort.key === "dayPl") return numberFrom(item.dayChangePercent);
    if (holdingsSort.key === "rsi") return numberFrom(item.rsi7);
    if (holdingsSort.key === "signal") return dcaMultiplier(item) * 100 - numberFrom(item.rsi7);
    if (holdingsSort.key === "shares") return numberFrom(item.shares);
    return numberFrom(item.value);
  };
  return (valueFor(a) - valueFor(b)) * dir;
}
function setCurrencyMode(mode) { currencyMode = mode === "USD" ? "USD" : "THB"; const button = document.getElementById("currencyToggle"); if (button) button.textContent = currencyMode; try { localStorage.setItem("portfolioCurrency", currencyMode); } catch (error) { console.warn(error); } renderAll(); }
function initCurrency() { try { currencyMode = localStorage.getItem("portfolioCurrency") === "USD" ? "USD" : "THB"; } catch (error) { currencyMode = "THB"; } const button = document.getElementById("currencyToggle"); if (button) button.textContent = currencyMode; }

function fetchSheet(sheetName) {
  return new Promise((resolve, reject) => {
    const callback = `sheetCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => { cleanup(); reject(new Error(`Cannot load ${sheetName}`)); }, 12000);
    function cleanup() { window.clearTimeout(timeout); delete window[callback]; script.remove(); }
    window[callback] = payload => { cleanup(); if (!payload || payload.status === "error") { reject(new Error(`Google Sheet returned no data for ${sheetName}`)); return; } const table = payload.table || {}; const headers = (table.cols || []).map((col, index) => col.label || `Column_${index + 1}`); const body = (table.rows || []).map(row => (row.c || []).map(cell => !cell ? "" : cell.f != null ? cell.f : cell.v != null ? String(cell.v) : "")); resolve([headers, ...body]); };
    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&headers=1&tqx=responseHandler:${callback}&cacheBust=${Date.now()}`;
    script.onerror = () => { cleanup(); reject(new Error(`Cannot load ${sheetName}`)); };
    document.head.appendChild(script);
  });
}

function excelDateToJs(serial) { if (serial instanceof Date) return serial; if (typeof serial === "string") { const parsed = new Date(serial); if (!Number.isNaN(parsed.getTime())) return parsed; } return new Date(Math.floor(Number(serial || 0) - 25569) * 86400000); }
function pathFromPoints(points) { return points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(" "); }
function drawSparkline(svg, values) { if (!values.length) return; const width = 260, height = 60, min = Math.min(...values), max = Math.max(...values), span = max - min || 1; const points = values.map((value, index) => [4 + (index / Math.max(values.length - 1, 1)) * (width - 8), 8 + (1 - ((value - min) / span)) * (height - 16)]); svg.innerHTML = `<path d="${pathFromPoints(points)}" fill="none" stroke="currentColor" stroke-width="3"/><path d="${pathFromPoints(points)} L${width - 4} ${height} L4 ${height} Z" fill="currentColor" opacity=".12" stroke="none"/>`; }
function renderSparklines() { const nav = completeNavRows().map(row => numberFrom(row[2])).filter(value => value > 0); document.querySelectorAll("[data-spark]").forEach(svg => drawSparkline(svg, nav)); }
function renderKpis() { const profit = signedCurrencyFromThb(kpis.profit), totalReturn = plusText(kpis.totalReturn, percentText), dailyProfit = signedCurrencyFromThb(kpis.dailyProfit), dailyChange = plusText(kpis.dailyChange, percentText), spyBenchmark = kpis.benchmarkSpy ? plusText(kpis.benchmarkSpy, percentText) : "Not verified", qqqBenchmark = kpis.benchmarkQqq ? plusText(kpis.benchmarkQqq, percentText) : "Not verified"; setText("portfolioValue", formatCurrencyFromThb(kpis.portfolioValue)); setText("investedValue", formatCurrencyFromThb(kpis.invested)); setText("profitLabel", `${profit} (${totalReturn})`); setText("dailyProfitLabel", dailyProfit); setText("dailyChangeLabel", dailyChange); setText("performanceNumber", plusText(kpis.totalReturn, percentText)); setText("performanceMethod", "Total return (cost basis)"); setText("irrLabel", percentText(kpis.irr)); setText("volatilityLabel", percentText(kpis.volatility)); setText("sharpeLabel", decimalText(kpis.sharpe)); setText("drawdownLabel", percentText(kpis.maxDrawdown)); setText("spyBenchmark", spyBenchmark); setText("qqqBenchmark", qqqBenchmark); setText("cashValue", `Cash ${formatCurrencyFromThb(kpis.cash)}`); setText("tableTotalValue", formatCurrencyFromThb(kpis.portfolioValue)); setText("tableDayProfit", dailyProfit); setText("tableDayChange", dailyChange); setSignedTone("tableDayReturn", kpis.dailyChange); setText("tableTotalProfit", profit); setText("tableTotalReturn", totalReturn); setSignedTone("tableTotalGain", kpis.totalReturn); setText("tableMode", kpis.marketMode); setText("sideMode", kpis.marketMode); setText("sideModeHint", kpis.marketMode.includes("A") ? "Risk on" : "Risk control"); ["profitLabel", "dailyProfitLabel", "dailyChangeLabel", "performanceNumber", "drawdownLabel"].forEach(id => { const el = document.getElementById(id); if (el) setSignedTone(id, el.textContent); }); }
function navDateMs(row) { const date = sheetDate(row[0]); return Number.isNaN(date.getTime()) ? 0 : date.getTime(); }
function completeNavRows() {
  const rows = navRows.filter(row => numberFrom(row[2]) > 0).sort((a, b) => navDateMs(a) - navDateMs(b)).map(row => [...row]);
  const currentValue = numberFrom(kpis.portfolioValue);
  if (!rows.length || currentValue <= 0) return rows;

  const last = rows.at(-1);
  const lastDate = sheetDate(last[0]);
  const today = new Date();
  const sameDay = lastDate.getFullYear() === today.getFullYear() && lastDate.getMonth() === today.getMonth() && lastDate.getDate() === today.getDate();
  if (sameDay) {
    last[2] = currentValue;
  } else {
    rows.push([today, 0, currentValue, numberFrom(kpis.dailyChange) / 100, 0]);
  }
  return rows;
}
function navRowsWithInvested() {
  const rows = completeNavRows();
  const targetInvested = numberFrom(kpis.invested);
  const rawContributions = rows.map(row => Math.max(0, numberFrom(row[1])));
  const rawTotal = rawContributions.reduce((sum, value) => sum + value, 0);
  const scale = rawTotal > 0 && targetInvested > 0 ? targetInvested / rawTotal : 1;
  let runningInvested = 0;
  return rows.map((row, index) => {
    runningInvested += rawContributions[index] * scale;
    return { row, invested: runningInvested || targetInvested };
  });
}
function filteredNavSeries() {
  const series = navRowsWithInvested();
  if (series.length < 2 || performancePeriod === "ALL") return series;
  const last = navDateMs(series.at(-1).row);
  const daysByPeriod = { "1M": 31, "3M": 92, "6M": 183 };
  const days = daysByPeriod[performancePeriod];
  if (!days) return series;
  const filtered = series.filter(item => navDateMs(item.row) >= last - days * 86400000);
  return filtered.length >= 2 ? filtered : series.slice(-2);
}
function filteredNavRows() {
  return filteredNavSeries().map(item => item.row);
}
function periodReturnText() {
  return plusText(kpis.totalReturn, percentText);
}
function periodRangeText(rows) {
  if (!rows || rows.length < 2) return `Current cost basis ${formatCurrencyFromThb(kpis.invested)}`;
  const start = sheetDate(rows[0][0]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const end = sheetDate(rows.at(-1)[0]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${performancePeriod} range ${start} - ${end}`;
}
function renderNavChart() {
  const svg = document.getElementById("navChart");
  if (!svg) return;
  const width = 740, height = 300, padding = { top: 20, right: 24, bottom: 44, left: 58 };
  const series = filteredNavSeries();
  const rows = series.map(item => item.row);
  if (rows.length < 2) return;
  const values = rows.map(row => numberFrom(row[2]));
  const investedValues = series.map(item => item.invested);
  const scaleValues = [...values, ...investedValues].filter(value => Number.isFinite(value));
  const minValue = Math.min(...scaleValues);
  const maxValue = Math.max(...scaleValues);
  const rawSpan = Math.max(maxValue - minValue, maxValue * 0.015, 1);
  const domainMin = Math.max(0, minValue - rawSpan * 0.35);
  const domainMax = maxValue + rawSpan * 0.18;
  const scaleY = value => padding.top + (1 - ((value - domainMin) / Math.max(domainMax - domainMin, 1))) * (height - padding.top - padding.bottom);
  const scaleX = index => padding.left + (index / (rows.length - 1)) * (width - padding.left - padding.right);
  const navPoints = rows.map((row, index) => [scaleX(index), scaleY(numberFrom(row[2]))]);
  const investedPoints = investedValues.map((value, index) => [scaleX(index), scaleY(value)]);
  const yTicks = [domainMax, domainMin + (domainMax - domainMin) / 2, domainMin]
    .map(value => ({ value, y: scaleY(value) }));
  const yAxis = yTicks.map(tick => `<g><line class="chart-grid" x1="${padding.left}" x2="${width - padding.right}" y1="${tick.y.toFixed(1)}" y2="${tick.y.toFixed(1)}"/><text class="axis-text y-axis-text" x="${padding.left - 10}" y="${(tick.y + 4).toFixed(1)}" text-anchor="end">${monthlyAmount(tick.value)}</text></g>`).join("");
  const area = `${pathFromPoints(navPoints)} L${navPoints.at(-1)[0]} ${height - padding.bottom} L${navPoints[0][0]} ${height - padding.bottom} Z`;
  const end = numberFrom(rows.at(-1)[2]);
  const displayReturn = plusText(kpis.totalReturn, percentText);
  setText("performanceNumber", displayReturn);
  setText("performanceMethod", "Total return (cost basis)");
  setText("performanceInvestedLabel", "Invested capital");
  setText("performanceRangeLabel", `${periodRangeText(rows)} | Value ${formatCurrencyFromThb(end)} | Invested ${formatCurrencyFromThb(kpis.invested)}`);
  setSignedTone("performanceNumber", displayReturn);
  svg.innerHTML = `<defs><linearGradient id="navGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#25e05d" stop-opacity=".22"/><stop offset="1" stop-color="#25e05d" stop-opacity="0"/></linearGradient></defs>${yAxis}<path class="area-fill" d="${area}"/><path class="invested-line" d="${pathFromPoints(investedPoints)}"/><path class="nav-line" d="${pathFromPoints(navPoints)}"/><circle cx="${navPoints.at(-1)[0]}" cy="${navPoints.at(-1)[1]}" r="5" fill="#25e05d" stroke="#071017" stroke-width="3"/><text class="axis-text" x="${padding.left}" y="${height - 14}">${performancePeriod}</text><text class="axis-text" text-anchor="end" x="${width - padding.right}" y="${height - 14}">${formatCurrencyFromThb(end)}</text>`;
}
function benchmarkDateKey(value) {
  const date = sheetDate(value);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
function isoWeekEnd(year, week) {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() || 7) - 1) + (week - 1) * 7);
  monday.setUTCDate(monday.getUTCDate() + 6);
  return monday;
}
function actualPortfolioAnchors(startDate) {
  // Historical NAV includes snapshots made before removed trades; use the audited weekly returns for this legacy period.
  const weekly = actualPortfolioReturns
    .filter(row => row.interval === "weekly")
    .map(row => ({ ...row, week: Number(String(row.period).replace(/\D/g, "")) }))
    .filter(row => row.week > 0 && row.week <= 53 && Math.abs(row.portfolioReturn) > 0.00001 && Number.isFinite(row.portfolioPnl))
    .sort((left, right) => left.week - right.week);
  if (!weekly.length) return [];
  let cumulativePnl = 0;
  const anchors = [{ date: startDate, value: 0 }];
  weekly.forEach(row => {
    const rate = row.portfolioReturn / 100;
    cumulativePnl += row.portfolioPnl;
    const inferredCapital = Math.abs(row.portfolioPnl / rate);
    anchors.push({ date: isoWeekEnd(startDate.getUTCFullYear(), row.week), value: cumulativePnl / inferredCapital * 100 });
  });
  if (anchors.length > 1) anchors.at(-1).value = benchmarkCompare.portfolio;
  return anchors;
}
function interpolatePortfolioAnchor(anchors, date) {
  if (!anchors.length || date <= anchors[0].date) return anchors[0]?.value || 0;
  for (let index = 1; index < anchors.length; index++) {
    const previous = anchors[index - 1], next = anchors[index];
    if (date <= next.date) {
      const span = Math.max(1, next.date - previous.date);
      const progress = Math.max(0, Math.min(1, (date - previous.date) / span));
      return previous.value + (next.value - previous.value) * progress;
    }
  }
  return anchors.at(-1).value;
}
function benchmarkPlanDate() {
  const date = validSheetDate(benchmarkPlanStart);
  return date || new Date("2026-09-02T00:00:00");
}
function benchmarkRangeDays() {
  return { "1M": 31, "3M": 92, "6M": 183 }[benchmarkRangePeriod] || 0;
}
function filterBenchmarkSeriesByRange(series, options = {}) {
  const days = benchmarkRangeDays();
  const planStart = benchmarkPlanDate();
  const ranged = benchmarkRangePeriod === "PLAN"
    ? series.filter(point => point.date >= planStart)
    : !days || series.length < 2 ? series : series.filter(point => point.date.getTime() >= series.at(-1).date.getTime() - days * 86400000);
  const filtered = ranged.length >= 2 ? ranged : series.slice(-2);
  if (!options.rebase || filtered.length < 2) return filtered;
  const base = filtered[0];
  const relative = (value, baseline) => ((1 + value / 100) / Math.max(.01, 1 + baseline / 100) - 1) * 100;
  return filtered.map(point => ({ ...point, portfolio: relative(point.portfolio, base.portfolio), spy: relative(point.spy, base.spy), qqq: relative(point.qqq, base.qqq) }));
}
function benchmarkRangeText(series) {
  if (!series.length) return "Live sheet history";
  const prefix = benchmarkRangePeriod === "ALL" ? "All" : benchmarkRangePeriod === "PLAN" ? "Since plan" : benchmarkRangePeriod;
  const start = benchmarkDateLabel(series[0].date);
  const end = benchmarkDateLabel(series.at(-1).date);
  return `${prefix} ${start} - ${end}`;
}
function benchmarkSeries() {
  const spyPrices = new Map(benchmarkRows.map(row => [benchmarkDateKey(row[0]), numberFrom(row[1])]).filter(([, value]) => value > 0));
  const qqqPrices = new Map(benchmarkQqqRows.map(row => [benchmarkDateKey(row[0]), numberFrom(row[1])]).filter(([, value]) => value > 0));
  const nav = [...navRowsWithInvested()].sort((a, b) => navDateMs(a.row) - navDateMs(b.row));
  const anchors = actualPortfolioAnchors(sheetDate(nav[0]?.row[0]));
  let firstSpy = 0, firstQqq = 0, fallbackPortfolioFactor = 1;
  const series = [];
  nav.forEach(item => {
    const { row, invested } = item;
    const spyPrice = spyPrices.get(benchmarkDateKey(row[0]));
    const qqqPrice = qqqPrices.get(benchmarkDateKey(row[0]));
    if (!(spyPrice > 0) || !(qqqPrice > 0) || invested <= 0) return;
    if (!firstSpy) firstSpy = spyPrice;
    if (!firstQqq) firstQqq = qqqPrice;
    const date = sheetDate(row[0]);
    const fallbackDaily = numberFrom(row[3]);
    fallbackPortfolioFactor *= 1 + fallbackDaily;
    const lastAnchor = anchors.at(-1);
    const priorPortfolio = series.at(-1)?.portfolio || 0;
    // Audited weekly returns own historical performance. Extend only beyond their latest week with the live daily NAV return.
    const portfolio = anchors.length > 1 && date <= lastAnchor.date
      ? interpolatePortfolioAnchor(anchors, date)
      : anchors.length > 1
        ? ((1 + priorPortfolio / 100) * (1 + fallbackDaily) - 1) * 100
        : (fallbackPortfolioFactor - 1) * 100;
    const previousPortfolio = series.at(-1)?.portfolio || 0;
    const portfolioDaily = series.length ? ((1 + portfolio / 100) / (1 + previousPortfolio / 100) - 1) * 100 : 0;
    series.push({ date, portfolio, spy: (spyPrice / firstSpy - 1) * 100, qqq: (qqqPrice / firstQqq - 1) * 100, portfolioDaily, spyDaily: series.length ? (spyPrice / (series.at(-1).spyPrice || spyPrice) - 1) * 100 : 0, qqqDaily: series.length ? (qqqPrice / (series.at(-1).qqqPrice || qqqPrice) - 1) * 100 : 0, spyPrice, qqqPrice });
  });
  if (!performanceVerified) return series;
  const rawPortfolio = series.at(-1)?.portfolio || 0, rawSpy = series.at(-1)?.spy || 0, rawQqq = series.at(-1)?.qqq || 0;
  const portfolioScale = rawPortfolio ? benchmarkCompare.portfolio / rawPortfolio : 1, spyScale = rawSpy ? benchmarkCompare.spyReturn / rawSpy : 1, qqqScale = rawQqq ? benchmarkCompare.qqqReturn / rawQqq : 1;
  return series.map(point => ({ ...point, portfolio: point.portfolio * portfolioScale, spy: point.spy * spyScale, qqq: point.qqq * qqqScale }));
}
function benchmarkDateLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function benchmarkScaleDomain(values, step = 5) {
  const low = Math.min(...values, 0);
  const high = Math.max(...values, 0);
  const min = Math.floor(low / step) * step;
  const max = Math.ceil(high / step) * step;
  return { min: Math.min(0, min), max: Math.max(step, max), step };
}
function benchmarkTicks(domain) {
  const count = Math.round((domain.max - domain.min) / domain.step);
  return Array.from({ length: count + 1 }, (_, index) => domain.min + index * domain.step);
}
function benchmarkAxis(value) { const digits = Number.isInteger(value) ? 0 : Math.abs(value) < 10 ? 1 : 0; return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`; }
function niceTickStep(rawStep) {
  const rough = Math.max(.01, Math.abs(rawStep));
  const power = 10 ** Math.floor(Math.log10(rough));
  const scaled = rough / power;
  const multiplier = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return multiplier * power;
}
function cashflowScaleDomain(values) {
  const clean = values.map(numberFrom).filter(Number.isFinite);
  if (!clean.length) return { min: 0, max: 100, step: 25 };
  const minValue = Math.min(...clean), maxValue = Math.max(...clean);
  if (benchmarkRangePeriod === "ALL" || minValue <= 0) {
    const highest = Math.max(maxValue, 1);
    const step = niceTickStep(highest / 4);
    return { min: 0, max: Math.ceil(highest * 1.08 / step) * step, step };
  }
  const span = Math.max(maxValue - minValue, maxValue * .025, 1);
  const paddedMin = Math.max(0, minValue - span * .22);
  const paddedMax = maxValue + span * .22;
  const step = niceTickStep((paddedMax - paddedMin) / 4);
  let min = Math.floor(paddedMin / step) * step;
  let max = Math.ceil(paddedMax / step) * step;
  if (max - min < step * 3) { min = Math.max(0, min - step); max += step; }
  return { min, max, step };
}
function cashflowAxis(value) {
  const amount = currencyMode === "USD" ? numberFrom(value) : numberFrom(value) * fxRate();
  const prefix = currencyMode === "USD" ? "$" : "THB ";
  return `${prefix}${Math.round(amount).toLocaleString("en-US")}`;
}
function cashflowValue(value) { return formatCurrencyFromUsd(value); }
function benchmarkPercent(value) { const amount = numberFrom(value); return `${amount > 0 ? "+" : ""}${amount.toFixed(2)}%`; }
function benchmarkValueLabel(value) { const amount = numberFrom(value); return `${amount > 0 ? "+" : ""}${amount.toFixed(2)}%`; }
function parseBenchmarkCompare(rows, portfolioReturn) {
  const compare = { ...benchmarkCompare, portfolio: numberFrom(portfolioReturn) };
  rows.forEach(row => {
    const cells = row.map(value => String(value || "").trim());
    const assetIndex = cells.findIndex(value => /S&P 500 \(SPY\)/i.test(value) || /NASDAQ \(QQQ\)/i.test(value));
    if (assetIndex < 0) return;
    const asset = cells[assetIndex];
    const returned = numberFrom(cells[assetIndex + 1]);
    const vsPort = numberFrom(cells[assetIndex + 2]);
    if (/S&P 500/i.test(asset)) { compare.spyReturn = returned; compare.spyVsPort = vsPort; }
    if (/NASDAQ/i.test(asset)) { compare.qqqReturn = returned; compare.qqqVsPort = vsPort; }
  });
  return compare;
}
function parseCashflowBenchmark(rows) {
  const summary = rows.slice(1, 12).map(row => ({ portfolio: numberFrom(row[1]), spy: numberFrom(row[2]), qqq: numberFrom(row[3]) }));
  // Google Visualization infers the first column as a date and drops the text labels.
  const current = summary.find(row => row.portfolio > 0 && row.spy > 0 && row.qqq > 0 && (Math.abs(row.portfolio - row.spy) > .01 || Math.abs(row.portfolio - row.qqq) > .01));
  const invested = summary.find(row => row.portfolio > 0 && row.spy > 0 && row.qqq > 0 && Math.abs(row.portfolio - row.spy) < .01 && Math.abs(row.portfolio - row.qqq) < .01);
  cashflowPurchases = rows.slice(1).map(row => ({ date: sheetDate(row[0]), amount: numberFrom(row[3]), spyUnits: numberFrom(row[5]), qqqUnits: numberFrom(row[7]) })).filter(row => !Number.isNaN(row.date.getTime()) && Math.abs(row.amount) > 0.0001 && Math.abs(row.spyUnits) > 0.000001 && Math.abs(row.qqqUnits) > 0.000001).sort((left, right) => left.date - right.date);
  if (!current) return;
  cashflowBenchmark = { ...current, invested: invested ? invested.portfolio : 0 };
}
function cashflowDollar(value) { return `$${numberFrom(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function cashflowInvestedBaseline() {
  return benchmarkRangePeriod === "PLAN" ? cashflowPurchases.filter(purchase => purchase.date >= benchmarkPlanDate()).reduce((sum, purchase) => sum + purchase.amount, 0) : cashflowBenchmark.invested;
}
function renderBenchmarkComparisonSummary(mode = benchmarkComparisonMode, values = null) {
  const summary = document.getElementById("cashflowComparisonSummary");
  if (!summary) return;
  const isCashflow = mode === "cashflow";
  summary.classList.toggle("mode-value", isCashflow);
  summary.classList.toggle("mode-performance", !isCashflow);
  const data = values || (isCashflow ? cashflowBenchmark : { portfolio: benchmarkCompare.portfolio, spy: benchmarkCompare.spyReturn, qqq: benchmarkCompare.qqqReturn });
  const portfolio = numberFrom(data.portfolio);
  if (!Number.isFinite(portfolio)) { summary.hidden = true; return; }
  const visibleBenchmarks = isCashflow ? { spy: true, qqq: true } : benchmarkVisible;
  const baseline = isCashflow ? cashflowInvestedBaseline() : 0;
  if (isCashflow && !(baseline > 0)) { summary.hidden = true; return; }
  const valueLabel = value => isCashflow ? cashflowValue(value) : benchmarkPercent(value);
  const returnLabel = value => isCashflow ? benchmarkPercent((value / baseline - 1) * 100) : performanceVerified ? "TWR" : "Historical only";
  const diffLabel = difference => isCashflow ? `${cashflowValue(Math.abs(difference))} (${(Math.abs(difference) / baseline * 100).toFixed(2)}%)` : `${Math.abs(difference).toFixed(2)}%`;
  const comparison = (label, key) => {
    const value = numberFrom(data[key]);
    if (!visibleBenchmarks[key] || !Number.isFinite(value)) return "";
    const difference = portfolio - value;
    const tone = difference >= 0 ? "positive" : "negative";
    return `<div class="cashflow-summary-item ${key}"><span>${label}</span><strong>${valueLabel(value)}</strong><small>${returnLabel(value)}</small><em class="${tone}">${difference >= 0 ? "Ahead" : "Behind"} ${diffLabel(difference)}</em></div>`;
  };
  const metric = (label, value, tone = "") => `<div class="cashflow-summary-item metric"><span>${label}</span><strong class="${tone}">${value}</strong><small>Portfolio metric</small></div>`;
  const portfolioItem = `<div class="cashflow-summary-item portfolio"><span>Portfolio</span><strong>${valueLabel(portfolio)}</strong><small>${returnLabel(portfolio)}</small><em>${isCashflow ? "Actual value" : performanceVerified ? "Portfolio TWR" : "Awaiting reconciliation"}</em></div>`;
  if (isCashflow) {
    const investedItem = `<div class="cashflow-summary-item invested"><span>Invested capital</span><strong>${cashflowValue(baseline)}</strong><small>Same Buy dates</small><em>Cost basis</em></div>`;
    summary.innerHTML = `${portfolioItem}${investedItem}${comparison("S&P 500", "spy")}${comparison("NASDAQ", "qqq")}`;
  } else {
    summary.innerHTML = `${portfolioItem}${comparison("S&P 500", "spy")}${comparison("NASDAQ", "qqq")}${metric("IRR", percentText(kpis.irr), signedClass(kpis.irr))}${metric("Volatility", percentText(kpis.volatility))}${metric("Sharpe Ratio", decimalText(kpis.sharpe))}${metric("Max Drawdown", percentText(kpis.maxDrawdown), "negative")}`;
  }
  summary.hidden = false;
}
function bindBenchmarkHover(svg, series, options) {
  const readout = document.getElementById("benchmarkChartReadout");
  if (!svg || !readout || !series?.length) return;
  const keys = options.keys || ["portfolio", "spy", "qqq"];
  const visible = options.visible || { portfolio: true, spy: true, qqq: true };
  const format = options.format || benchmarkPercent;
  const namespace = "http://www.w3.org/2000/svg";
  let hover = svg.querySelector(".benchmark-hover");
  if (!hover) {
    hover = document.createElementNS(namespace, "g");
    hover.setAttribute("class", "benchmark-hover");
    hover.setAttribute("hidden", "");
    const line = document.createElementNS(namespace, "line");
    line.setAttribute("class", "benchmark-crosshair");
    line.setAttribute("y1", String(options.top));
    line.setAttribute("y2", String(options.bottom));
    hover.append(line);
    keys.forEach(key => {
      const dot = document.createElementNS(namespace, "circle");
      dot.setAttribute("class", `benchmark-hover-dot ${key}`);
      dot.dataset.benchmarkHover = key;
      dot.setAttribute("r", "4");
      hover.append(dot);
    });
    svg.append(hover);
  }
  const render = index => {
    const point = series[Math.max(0, Math.min(series.length - 1, index))];
    const values = keys.filter(key => visible[key] !== false).map(key => {
      const label = key === "portfolio" ? "Portfolio" : key === "spy" ? "S&P 500" : "NASDAQ";
      return `<span class="${key}">${label} <strong>${format(point[key])}</strong></span>`;
    }).join("");
    const difference = point.portfolio - point.spy;
    const relation = difference >= 0 ? `Portfolio leads S&P 500 ${format(Math.abs(difference))}` : `S&P 500 leads portfolio ${format(Math.abs(difference))}`;
    readout.innerHTML = `<span class="benchmark-readout-date">${benchmarkDateLabel(point.date)}</span><div class="benchmark-readout-values">${values}</div><b class="${difference >= 0 ? "positive" : "negative"}">${relation}</b>`;
    const pointX = options.x(index);
    const line = hover.querySelector(".benchmark-crosshair");
    if (line) ["x1", "x2"].forEach(attribute => line.setAttribute(attribute, pointX.toFixed(1)));
    hover.querySelectorAll("[data-benchmark-hover]").forEach(dot => {
      const key = dot.dataset.benchmarkHover;
      dot.hidden = visible[key] === false;
      dot.setAttribute("cx", pointX.toFixed(1));
      dot.setAttribute("cy", options.y(point[key]).toFixed(1));
    });
    hover.hidden = false;
  };
  svg.onpointermove = event => {
    const rect = svg.getBoundingClientRect();
    const svgX = (event.clientX - rect.left) / Math.max(rect.width, 1) * options.width;
    const ratio = (svgX - options.left) / Math.max(options.right - options.left, 1);
    render(Math.round(Math.max(0, Math.min(1, ratio)) * (series.length - 1)));
  };
  svg.onpointerleave = () => { hover.hidden = true; };
  render(series.length - 1);
}
function cashflowLineSeries() {
  const base = benchmarkSeries();
  const purchases = benchmarkRangePeriod === "PLAN" ? cashflowPurchases.filter(purchase => purchase.date >= benchmarkPlanDate()) : cashflowPurchases;
  if (base.length < 2 || !purchases.length) return [];
  const lots = [];
  let purchaseIndex = 0;
  const raw = base.map(point => {
    while (purchaseIndex < purchases.length && purchases[purchaseIndex].date <= point.date) {
      lots.push({ ...purchases[purchaseIndex], portfolioBase: point.portfolio });
      purchaseIndex += 1;
    }
    const portfolio = lots.reduce((sum, lot) => sum + lot.amount * (1 + point.portfolio / 100) / Math.max(.01, 1 + lot.portfolioBase / 100), 0);
    const spy = lots.reduce((sum, lot) => sum + lot.spyUnits * point.spyPrice, 0);
    const qqq = lots.reduce((sum, lot) => sum + lot.qqqUnits * point.qqqPrice, 0);
    return { date: point.date, portfolio, spy, qqq };
  }).filter(point => point.portfolio > 0 && point.spy > 0 && point.qqq > 0);
  const last = raw.at(-1);
  if (!last) return [];
  if (benchmarkRangePeriod === "PLAN") return filterBenchmarkSeriesByRange(raw);
  const scale = { portfolio: cashflowBenchmark.portfolio / last.portfolio, spy: cashflowBenchmark.spy / last.spy, qqq: cashflowBenchmark.qqq / last.qqq };
  return filterBenchmarkSeriesByRange(raw.map(point => ({ ...point, portfolio: point.portfolio * scale.portfolio, spy: point.spy * scale.spy, qqq: point.qqq * scale.qqq })));
}
function renderCashflowBenchmarkChart() {
  const svg = document.getElementById("benchmarkPerformanceChart");
  const series = cashflowLineSeries();
  if (!svg) return;
  if (series.length < 2) { svg.innerHTML = '<text class="benchmark-empty" x="450" y="126" text-anchor="middle">Waiting for cash-flow comparison from the live sheet</text>'; return; }
  const width = 900, height = 252, padding = { top: 20, right: 160, bottom: 38, left: 78 }, values = series.flatMap(point => [point.portfolio, point.spy, point.qqq]), domain = cashflowScaleDomain(values);
  const plotWidth = width - padding.left - padding.right, plotHeight = height - padding.top - padding.bottom;
  const x = index => padding.left + index / Math.max(series.length - 1, 1) * plotWidth, y = value => padding.top + (1 - (value - domain.min) / Math.max(domain.max - domain.min, .01)) * plotHeight;
  const ticks = benchmarkTicks(domain), grid = ticks.map(value => `<g><line class="benchmark-grid" x1="${padding.left}" x2="${width - padding.right}" y1="${y(value).toFixed(1)}" y2="${y(value).toFixed(1)}"/><text class="benchmark-axis" x="${padding.left - 12}" y="${(y(value) + 4).toFixed(1)}" text-anchor="end">${cashflowAxis(value)}</text></g>`).join(""), marks = Array.from({ length: 6 }, (_, index) => Math.round(index * (series.length - 1) / 5)), dates = marks.map(index => `<text class="benchmark-axis benchmark-date" x="${x(index).toFixed(1)}" y="${height - 11}" text-anchor="middle">${benchmarkDateLabel(series[index].date)}</text>`).join("");
  const points = key => series.map((point, index) => [x(index), y(point[key])]);
  const portfolioPoints = points("portfolio"), spyPoints = points("spy"), qqqPoints = points("qqq");
  const latest = series.at(-1), endX = width - padding.right + 10;
  const labels = [
    { key: "portfolio", name: "Portfolio", y: y(latest.portfolio), value: latest.portfolio },
    { key: "spy", name: "S&P 500", y: y(latest.spy), value: latest.spy },
    { key: "qqq", name: "NASDAQ", y: y(latest.qqq), value: latest.qqq }
  ].sort((left, right) => left.y - right.y);
  labels.forEach((label, index) => { label.labelY = Math.max(padding.top + 8, label.y, index ? labels[index - 1].labelY + 18 : padding.top + 8); });
  for (let index = labels.length - 1; index >= 0; index -= 1) {
    const ceiling = index === labels.length - 1 ? height - padding.bottom - 8 : labels[index + 1].labelY - 18;
    labels[index].labelY = Math.min(labels[index].labelY, ceiling);
  }
  const endLabels = labels.map(label => `<path class="benchmark-label-leader ${label.key}" d="M ${width - padding.right + 3} ${label.y.toFixed(1)} L ${endX - 3} ${(label.labelY - 3).toFixed(1)}"/><text class="benchmark-end-label ${label.key}" x="${endX}" y="${label.labelY.toFixed(1)}">${label.name} ${cashflowValue(label.value)}</text>`).join("");
  svg.setAttribute("viewBox", "0 0 900 252");
  renderBenchmarkComparisonSummary("cashflow", series.at(-1));
  svg.innerHTML = `${grid}<path class="benchmark-line portfolio" d="${pathFromPoints(portfolioPoints)}"/><path class="benchmark-line spy" d="${pathFromPoints(spyPoints)}"/><path class="benchmark-line qqq" d="${pathFromPoints(qqqPoints)}"/>${[ ["portfolio", portfolioPoints], ["spy", spyPoints], ["qqq", qqqPoints] ].map(([key, points]) => `<circle class="benchmark-end ${key}" cx="${points.at(-1)[0]}" cy="${points.at(-1)[1]}" r="3"/>`).join("")}${endLabels}${dates}`;
  setText("benchmarkRangeLabel", cashflowInvestedBaseline() > 0 ? `${benchmarkRangeText(series)} / ${cashflowValue(cashflowInvestedBaseline())} invested` : benchmarkRangeText(series));
}
function benchmarkBucketLabel(bucket, period) {
  if (bucket.label) return bucket.label;
  if (period === "daily") return benchmarkDateLabel(bucket.date);
  if (period === "monthly") return bucket.date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", " '");
  if (period === "quarterly") return `Q${Math.floor(bucket.date.getMonth() / 3) + 1} '${String(bucket.date.getFullYear()).slice(-2)}`;
  return String(bucket.date.getFullYear());
}
function isoWeekNumber(date) {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil(((utc - yearStart) / 86400000 + 1) / 7);
}
function benchmarkReturnBucketKey(value) { return String(value || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase(); }
function benchmarkReturnBuckets(series, period) {
  const actualInterval = period === "weekly" || period === "monthly" ? period : "";
  const actualBuckets = actualPortfolioReturns.filter(row => row.interval === actualInterval);
  if (actualBuckets.length) {
    const bucketLabel = date => period === "weekly" ? `W${isoWeekNumber(date)}` : date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const groups = new Map();
    series.forEach(point => {
      const label = bucketLabel(point.date);
      const key = benchmarkReturnBucketKey(label);
      const group = groups.get(key) || { date: point.date, label, portfolioFactor: 1, spyFactor: 1, qqqFactor: 1 };
      group.date = point.date;
      group.portfolioFactor *= 1 + point.portfolioDaily / 100;
      group.spyFactor *= 1 + point.spyDaily / 100;
      group.qqqFactor *= 1 + point.qqqDaily / 100;
      groups.set(key, group);
    });
    const audited = new Map(actualBuckets.map(row => {
      const label = period === "weekly" ? `W${row.period.replace(/\D/g, "")}` : row.period;
      return [benchmarkReturnBucketKey(label), row];
    }));
    const latestAudited = Math.max(...actualBuckets.map(row => Number(String(row.period).replace(/\D/g, ""))).filter(Number.isFinite));
    return [...groups.values()]
      .filter(group => audited.has(benchmarkReturnBucketKey(group.label)) || (period === "weekly" && isoWeekNumber(group.date) > latestAudited))
      .map(group => {
        const source = audited.get(benchmarkReturnBucketKey(group.label));
        return {
          date: group.date,
          label: group.label,
          portfolioDaily: source ? source.portfolioReturn : (group.portfolioFactor - 1) * 100,
          spyDaily: source ? source.spyReturn : (group.spyFactor - 1) * 100,
          qqqDaily: (group.qqqFactor - 1) * 100
        };
      });
  }
  if (period === "daily") return series.slice(-45).map(point => ({ ...point }));
  const groups = new Map();
  series.forEach(point => {
    const date = point.date;
    const key = period === "monthly" ? `${date.getFullYear()}-${date.getMonth()}` : period === "quarterly" ? `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}` : String(date.getFullYear());
    const current = groups.get(key) || { date, portfolioFactor: 1, spyFactor: 1, qqqFactor: 1 };
    current.date = date; current.portfolioFactor *= 1 + point.portfolioDaily / 100; current.spyFactor *= 1 + point.spyDaily / 100; current.qqqFactor *= 1 + point.qqqDaily / 100; groups.set(key, current);
  });
  return [...groups.values()].map(bucket => ({ date: bucket.date, portfolioDaily: (bucket.portfolioFactor - 1) * 100, spyDaily: (bucket.spyFactor - 1) * 100, qqqDaily: (bucket.qqqFactor - 1) * 100 }));
}function renderBenchmarkCharts() {
  const performanceSvg = document.getElementById("benchmarkPerformanceChart"), returnsSvg = document.getElementById("benchmarkReturnsChart");
  if (!performanceSvg || !returnsSvg) return;
  const isCashflow = benchmarkComparisonMode === "cashflow";
  const provisionalPerformance = !performanceVerified && !isCashflow;
  const cashflowSummary = document.getElementById("cashflowComparisonSummary");
  if (cashflowSummary) cashflowSummary.hidden = false;
  const title = document.getElementById("benchmarkTitle");
  const subtitle = document.getElementById("benchmarkSubtitle");
  const footnote = document.getElementById("benchmarkFootnote");
  const valueModeLabel = document.getElementById("benchmarkValueModeLabel");
  if (title) title.innerHTML = isCashflow ? 'Portfolio value vs benchmarks <span class="benchmark-method">(same Buy dates)</span>' : provisionalPerformance ? 'Returns vs benchmarks <span class="benchmark-method">(history awaiting reconciliation)</span>' : 'Returns vs benchmarks <span class="benchmark-method">(TWR)</span>';
  if (subtitle) subtitle.textContent = isCashflow ? "What the same deposits would be worth in the portfolio, S&P 500, or NASDAQ." : provisionalPerformance ? "Historical return series is available to review, but it is not a confirmed performance figure yet." : "Compare portfolio performance without deposits or withdrawals distorting the result.";
  if (footnote) { const planText = benchmarkRangePeriod === "PLAN"; footnote.textContent = provisionalPerformance ? "Use Value (THB) for the confirmed comparison based on the same Buy dates." : planText ? (isCashflow ? "Value mode reviews Buy amounts from " + benchmarkDateLabel(benchmarkPlanDate()) + " onward." : "Performance is reset at " + benchmarkDateLabel(benchmarkPlanDate()) + " to review the current plan.") : isCashflow ? "Value mode applies each recorded Buy amount on the same date to the portfolio, SPY, and QQQ." : "Returns are time-weighted (TWR), so deposits and withdrawals do not distort performance."; }
  if (valueModeLabel) valueModeLabel.textContent = `Value (${currencyMode})`;
  document.querySelectorAll("[data-benchmark-mode]").forEach(button => { const isPerformance = button.dataset.benchmarkMode === "twr"; const active = button.dataset.benchmarkMode === benchmarkComparisonMode; button.classList.toggle("active", active); button.disabled = false; button.title = isPerformance && !performanceVerified ? "Historical performance is available for review but awaits reconciliation" : ""; button.setAttribute("aria-pressed", String(active)); });
  document.querySelectorAll("[data-benchmark-range]").forEach(button => { const active = button.dataset.benchmarkRange === benchmarkRangePeriod; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
  const planInput = document.getElementById("benchmarkPlanStart");
  if (planInput && planInput.value !== benchmarkPlanStart) planInput.value = benchmarkPlanStart;
  document.querySelectorAll("#benchmark [data-benchmark-toggle]").forEach(button => { button.disabled = isCashflow; button.classList.toggle("disabled", isCashflow); });
  performanceSvg.setAttribute("aria-label", isCashflow ? "Portfolio value compared with matching investments in S and P 500 and NASDAQ" : provisionalPerformance ? "Provisional portfolio return history awaiting reconciliation" : "Portfolio time-weighted return compared with S and P 500 and NASDAQ");
  if (isCashflow) renderCashflowBenchmarkChart();
  const series = filterBenchmarkSeriesByRange(benchmarkSeries(), { rebase: true });
  if (series.length < 2) { const message = '<text class="benchmark-empty" x="450" y="126" text-anchor="middle">Waiting for benchmark history from the live sheet</text>'; if (!isCashflow) performanceSvg.innerHTML = message; returnsSvg.innerHTML = message.replace('126', '115'); return; }
  const width = 900, height = 252, padding = { top: 20, right: 142, bottom: 38, left: 62 }, allValues = series.flatMap(point => [point.portfolio, ...(benchmarkVisible.spy ? [point.spy] : []), ...(benchmarkVisible.qqq ? [point.qqq] : [])]), domain = benchmarkScaleDomain(allValues, 10);
  const plotWidth = width - padding.left - padding.right, plotHeight = height - padding.top - padding.bottom, x = index => padding.left + index / Math.max(series.length - 1, 1) * plotWidth, y = value => padding.top + (1 - (value - domain.min) / Math.max(domain.max - domain.min, .01)) * plotHeight;
  const ticks = benchmarkTicks(domain), portfolioPoints = series.map((point, index) => [x(index), y(point.portfolio)]), spyPoints = series.map((point, index) => [x(index), y(point.spy)]), qqqPoints = series.map((point, index) => [x(index), y(point.qqq)]);
  const spyVisible = benchmarkVisible.spy, qqqVisible = benchmarkVisible.qqq;
  document.querySelectorAll("[data-benchmark-toggle]").forEach(button => { const visible = benchmarkVisible[button.dataset.benchmarkToggle]; button.classList.toggle("active", visible); button.setAttribute("aria-pressed", String(visible)); });
  const grid = ticks.map(value => `<g><line class="benchmark-grid" x1="${padding.left}" x2="${width - padding.right}" y1="${y(value).toFixed(1)}" y2="${y(value).toFixed(1)}"/><text class="benchmark-axis" x="${padding.left - 12}" y="${(y(value) + 4).toFixed(1)}" text-anchor="end">${benchmarkAxis(value)}</text></g>`).join(""), marks = Array.from({ length: 6 }, (_, index) => Math.round(index * (series.length - 1) / 5)), dates = marks.map(index => `<text class="benchmark-axis benchmark-date" x="${x(index).toFixed(1)}" y="${height - 11}" text-anchor="middle">${benchmarkDateLabel(series[index].date)}</text>`).join(""), zero = y(0), endX = width - padding.right + 10, latest = series.at(-1), spyLabelY = Math.min(height - padding.bottom - 8, y(latest.spy) + 14), portfolioLabelY = Math.max(padding.top + 12, y(latest.portfolio) - 8);
  if (!isCashflow) { renderBenchmarkComparisonSummary("twr", series.at(-1)); setText("benchmarkRangeLabel", benchmarkRangeText(series)); performanceSvg.setAttribute("viewBox", "0 0 900 252"); performanceSvg.innerHTML = `${grid}<line class="benchmark-zero" x1="${padding.left}" x2="${width - padding.right}" y1="${zero.toFixed(1)}" y2="${zero.toFixed(1)}"/><path class="benchmark-line portfolio" d="${pathFromPoints(portfolioPoints)}"/>${spyVisible ? `<path class="benchmark-line spy" d="${pathFromPoints(spyPoints)}"/><circle class="benchmark-end spy" cx="${spyPoints.at(-1)[0]}" cy="${spyPoints.at(-1)[1]}" r="3"/><text class="benchmark-end-label spy" x="${endX}" y="${spyLabelY.toFixed(1)}">S&amp;P 500 ${benchmarkPercent(latest.spy)}</text>` : ""}${qqqVisible ? `<path class="benchmark-line qqq" d="${pathFromPoints(qqqPoints)}"/><circle class="benchmark-end qqq" cx="${qqqPoints.at(-1)[0]}" cy="${qqqPoints.at(-1)[1]}" r="3"/><text class="benchmark-end-label qqq" x="${endX}" y="${(y(latest.qqq) + 4).toFixed(1)}">NASDAQ ${benchmarkPercent(latest.qqq)}</text>` : ""}<circle class="benchmark-end portfolio" cx="${portfolioPoints.at(-1)[0]}" cy="${portfolioPoints.at(-1)[1]}" r="3"/><text class="benchmark-end-label portfolio" x="${endX}" y="${portfolioLabelY.toFixed(1)}">Portfolio ${benchmarkPercent(latest.portfolio)}</text>${dates}`; bindBenchmarkHover(performanceSvg, series, { x, y, width, left: padding.left, right: width - padding.right, top: padding.top, bottom: height - padding.bottom, keys: ["portfolio", "spy", "qqq"], visible: { portfolio: true, spy: spyVisible, qqq: qqqVisible }, format: benchmarkPercent }); }
  const intervalLabel = benchmarkReturnPeriod.charAt(0).toUpperCase() + benchmarkReturnPeriod.slice(1);
  setText("benchmarkReturnsTitle", `Recent ${benchmarkReturnPeriod} returns`);
  document.getElementById("benchmarkReturnsLegend")?.setAttribute("aria-label", `${intervalLabel} returns chart legend`);
  returnsSvg.setAttribute("aria-label", `${intervalLabel} portfolio, S and P 500, and NASDAQ returns`);
  const allBuckets = benchmarkReturnBuckets(series, benchmarkReturnPeriod);
  const returnWindow = benchmarkReturnPeriod === "daily" ? 31 : benchmarkReturnPeriod === "weekly" ? 13 : allBuckets.length;
  const buckets = allBuckets.slice(-returnWindow);
  const returnsHeight = 230, returnsPadding = { top: 18, right: 30, bottom: 38, left: 62 }, actualBenchmarkBuckets = benchmarkReturnPeriod === "weekly" || benchmarkReturnPeriod === "monthly", qqqReturnsVisible = qqqVisible, returnDomain = benchmarkScaleDomain(buckets.flatMap(point => [point.portfolioDaily, ...(spyVisible ? [point.spyDaily] : []), ...(qqqReturnsVisible ? [point.qqqDaily] : [])]), 10);
  document.querySelectorAll(".benchmark-returns-card [data-benchmark-toggle=qqq]").forEach(button => { button.hidden = false; });
  const dailyY = value => returnsPadding.top + (1 - (value - returnDomain.min) / Math.max(returnDomain.max - returnDomain.min, .01)) * (returnsHeight - returnsPadding.top - returnsPadding.bottom), dailyZero = dailyY(0), barStep = (width - returnsPadding.left - returnsPadding.right) / Math.max(buckets.length, 1), barWidth = Math.max(3, Math.min(15, barStep * .26));
  const returnGrid = benchmarkTicks(returnDomain).map(value => `<g><line class="benchmark-grid" x1="${returnsPadding.left}" x2="${width - returnsPadding.right}" y1="${dailyY(value).toFixed(1)}" y2="${dailyY(value).toFixed(1)}"/><text class="benchmark-axis" x="${returnsPadding.left - 12}" y="${(dailyY(value) + 4).toFixed(1)}" text-anchor="end">${benchmarkAxis(value)}</text></g>`).join(""), showBucketValues = benchmarkReturnPeriod !== "daily" && barStep >= 42;
  const bars = buckets.map((point, index) => { const center = returnsPadding.left + index * barStep + barStep / 2; return [{ key: "portfolio", value: point.portfolioDaily, x: center - barWidth * 1.5 - 1 }, ...(spyVisible ? [{ key: "spy", value: point.spyDaily, x: center - barWidth / 2 }] : []), ...(qqqReturnsVisible ? [{ key: "qqq", value: point.qqqDaily, x: center + barWidth / 2 + 1 }] : [])].map(item => { const itemY = dailyY(item.value), labelY = item.value >= 0 ? Math.max(returnsPadding.top + 11, itemY - 7) : Math.min(returnsHeight - returnsPadding.bottom - 4, itemY + 14), labelX = item.x + barWidth / 2 + (actualBenchmarkBuckets ? (item.key === "portfolio" ? -3 : item.key === "qqq" ? 3 : 0) : 0), labelAnchor = actualBenchmarkBuckets ? (item.key === "portfolio" ? "end" : item.key === "qqq" ? "start" : "middle") : "middle", showDailyPortfolioValue = benchmarkReturnPeriod === "daily" && item.key === "portfolio" && index % 2 === 0, label = showBucketValues || showDailyPortfolioValue ? `<text class="benchmark-bar-label ${item.value >= 0 ? "positive" : "negative"}" x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="${labelAnchor}">${benchmarkValueLabel(item.value)}</text>` : ""; return `<rect class="benchmark-bar ${item.key}" x="${item.x.toFixed(1)}" y="${Math.min(itemY, dailyZero).toFixed(1)}" width="${barWidth}" height="${Math.max(1, Math.abs(itemY - dailyZero)).toFixed(1)}"/>${label}`; }).join(""); }).join("");
  const returnMarkCount = Math.min(buckets.length, benchmarkReturnPeriod === "daily" ? 7 : buckets.length), returnLabels = Array.from({ length: returnMarkCount }, (_, index) => Math.round(index * Math.max(buckets.length - 1, 0) / Math.max(returnMarkCount - 1, 1))).map(index => { const center = returnsPadding.left + index * barStep + barStep / 2; return `<text class="benchmark-axis benchmark-date" text-anchor="middle" x="${center.toFixed(1)}" y="${returnsHeight - 10}">${benchmarkBucketLabel(buckets[index], benchmarkReturnPeriod)}</text>`; }).join("");
  returnsSvg.innerHTML = `${returnGrid}${bars}${returnLabels}`;
  const spyDifference = benchmarkCompare.portfolio - benchmarkCompare.spyReturn;
  const qqqDifference = benchmarkCompare.portfolio - benchmarkCompare.qqqReturn;
  const comparisonText = difference => (difference >= 0 ? "Ahead " : "Behind ") + Math.abs(difference).toFixed(2) + "% (cost basis)";
  if (performanceVerified) {
    setText("spyBenchmark", benchmarkPercent(benchmarkCompare.spyReturn));
    setText("spyBenchmarkDelta", comparisonText(spyDifference));
    setText("qqqBenchmark", benchmarkPercent(benchmarkCompare.qqqReturn));
    setText("qqqBenchmarkDelta", comparisonText(qqqDifference));
    setSignedTone("spyBenchmark", benchmarkCompare.spyReturn);
    setSignedTone("qqqBenchmark", benchmarkCompare.qqqReturn);
    setSignedTone("spyBenchmarkDelta", spyDifference);
    setSignedTone("qqqBenchmarkDelta", qqqDifference);
  } else {
    setText("spyBenchmark", "Not verified");
    setText("qqqBenchmark", "Not verified");
    setText("spyBenchmarkDelta", "Performance history needs reconciliation");
    setText("qqqBenchmarkDelta", "Performance history needs reconciliation");
  }
  if (!isCashflow) setText("benchmarkRangeLabel", `${benchmarkDateLabel(series[0].date)} - ${benchmarkDateLabel(series.at(-1).date)}`);
}
function polarToCartesian(cx, cy, radius, angle) { const radians = (angle - 90) * Math.PI / 180; return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) }; }
function donutSegment(cx, cy, radius, innerRadius, startAngle, endAngle) { const start = polarToCartesian(cx, cy, radius, endAngle), end = polarToCartesian(cx, cy, radius, startAngle), innerStart = polarToCartesian(cx, cy, innerRadius, endAngle), innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle), largeArc = endAngle - startAngle <= 180 ? 0 : 1; return [`M ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`, `L ${innerEnd.x} ${innerEnd.y}`, `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`, "Z"].join(" "); }
function allocationEntries() { if (allocationMode === "asset") return holdings.filter(item => item.value > 0 && item.ticker !== "CASH").sort((a, b) => b.value - a.value).map(item => [item.ticker, item.value]); const grouped = holdings.reduce((acc, item) => { if (item.value > 0 && item.ticker !== "CASH") acc[layerClass(item.layer)] = (acc[layerClass(item.layer)] || 0) + item.value; return acc; }, {}); return Object.entries(grouped).filter(([, value]) => value > 0); }
function allocationLabelSvg(name, percent, point) {
  const label = String(name || "");
  const x = point.x.toFixed(1), y = point.y.toFixed(1);
  return `<text class="allocation-label" x="${x}" y="${y}"><tspan x="${x}" dy="0">${label}</tspan><tspan x="${x}" dy="13">${percent.toFixed(1)}%</tspan></text>`;
}
function renderAllocation() {
  const entries = allocationEntries();
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (!total) return;
  const isAsset = allocationMode === "asset";
  const center = document.querySelector(".donut-center");
  if (center) {
    const strong = center.querySelector("strong");
    const span = center.querySelector("span");
    if (strong) strong.textContent = isAsset ? `${entries.length} ${entries.length === 1 ? "Stock" : "Stocks"}` : "100%";
    if (span) span.textContent = "Invested";
  }
  let angle = 0;
  const cx = 150, cy = 150, radius = 116, innerRadius = 64;
  const paths = [];
  const labels = [];
  entries.forEach(([name, value], index) => {
    const percent = value / total * 100;
    const next = angle + percent * 3.6;
    const path = donutSegment(cx, cy, radius, innerRadius, angle, next);
    paths.push(`<path d="${path}" fill="${colors[index % colors.length]}" stroke="#071017" stroke-width="3"/>`);
    const mid = angle + (next - angle) / 2;
    const labelRadius = isAsset ? 132 : 128;
    const labelPoint = polarToCartesian(cx, cy, labelRadius, mid);
    labels.push(allocationLabelSvg(name, percent, labelPoint));
    angle = next;
  });
  setHtml("allocationChart", `${paths.join("")}${labels.join("")}`);
  setHtml("allocationLegend", entries.map(([layer, value], index) => `<div class="allocation-row"><i class="swatch" style="background:${colors[index % colors.length]}"></i><span>${layer}</span><strong>${(value / total * 100).toFixed(1)}%</strong></div>`).join(""));
}
function monthKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function monthLabel(key) { const [year, month] = key.split("-").map(Number); return new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", " '"); }
function addMonths(date, offset) { return new Date(date.getFullYear(), date.getMonth() + offset, 1); }
function monthlyAmount(value) { return Math.round(numberFrom(value)).toLocaleString("en-US"); }
function renderMonthlySummary() {
  const activeMonths = monthly.filter(item => numberFrom(item.value) > 0);
  const total = monthly.reduce((sum, item) => sum + numberFrom(item.value), 0);
  const activeTotal = activeMonths.reduce((sum, item) => sum + numberFrom(item.value), 0);
  const average = activeMonths.length ? activeTotal / activeMonths.length : 0;
  const startLabel = activeMonths[0]?.label || "-";
  setHtml("monthlySummary", `
    <div class="monthly-summary-item"><span>Start</span><strong>${startLabel}</strong></div>
    <div class="monthly-summary-item primary"><span>Avg buy</span><strong>THB ${monthlyAmount(average)}</strong></div>
    <div class="monthly-summary-item"><span>Active months</span><strong>${activeMonths.length}</strong></div>
    <div class="monthly-summary-item"><span>Buy total</span><strong>THB ${monthlyAmount(total)}</strong></div>
  `);
}
function buildMonthlyPurchases(tradeRows, nav, monthlyRows) {
  const grouped = new Map();
  tradeRows.forEach(row => {
    const type = String(rowAny(row, ["Transaction Type", "Transaction_Type", "Type"], "")).trim().toLowerCase();
    if (type !== "buy") return;
    const date = validSheetDate(rowAny(row, ["Date", "Transaction Date"], ""));
    if (!date) return;
    const amount = numberFrom(rowAny(row, ["Total Amount (THB)", "Total_Amount_THB", "Total Amount THB"], 0));
    if (amount <= 0) return;
    grouped.set(monthKey(date), (grouped.get(monthKey(date)) || 0) + amount);
  });
  if (!grouped.size) {
    nav.forEach(row => {
      const date = validSheetDate(row[0]);
      if (!date) return;
      const invested = numberFrom(row[1]);
      grouped.set(monthKey(date), (grouped.get(monthKey(date)) || 0) + invested);
    });
  }
  if (!grouped.size) {
    monthlyRows.forEach(row => {
      const year = Number(rowAny(row, ["Year"], 0)), month = Number(rowAny(row, ["Month"], 0));
      if (!year || !month) return;
      const value = numberFrom(rowAny(row, ["Monthly_Invested_THB", "Invested_THB", "Total_Invested_THB", "Deposit_THB", "Avg_NAV_THB"], 0));
      grouped.set(monthKey(new Date(year, month - 1, 1)), value);
    });
  }
  const latest = [...grouped.keys()].sort().at(-1);
  const end = latest ? new Date(Number(latest.slice(0, 4)), Number(latest.slice(5, 7)) - 1, 1) : new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const key = monthKey(addMonths(end, index - 11));
    return { label: monthLabel(key), value: grouped.get(key) || 0 };
  });
}
function renderMonthly() {
  const svg = document.getElementById("monthlyChart");
  if (!svg || !monthly.length) return;
  renderMonthlySummary();
  const isCompact = window.matchMedia("(max-width: 680px)").matches;
  const width = isCompact ? 640 : 960;
  const height = isCompact ? 300 : 340;
  const padding = isCompact
    ? { top: 34, right: 30, bottom: 54, left: 22 }
    : { top: 36, right: 54, bottom: 58, left: 32 };
  const monthlyTotal = monthly.reduce((sum, item) => sum + numberFrom(item.value), 0);
  let runningCapital = 0;
  const investedSeries = monthly.map(item => {
    runningCapital += numberFrom(item.value);
    return runningCapital;
  });
  const max = Math.max(...monthly.map(item => item.value), ...investedSeries, 1);
  const plotH = height - padding.top - padding.bottom;
  const gap = (width - padding.left - padding.right) / monthly.length;
  const barW = Math.min(isCompact ? 30 : 38, gap * .52);
  const pointFor = (value, index) => [
    padding.left + index * gap + gap / 2,
    padding.top + (1 - numberFrom(value) / max) * plotH
  ];
  const investedPoints = investedSeries.map(pointFor);
  const bars = monthly.map((item, index) => {
    const x = padding.left + index * gap + gap / 2 - barW / 2;
    const h = item.value > 0 ? Math.max(4, (item.value / max) * plotH) : 2;
    const y = padding.top + plotH - h;
    const labelX = x + barW / 2;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" fill="#25e05d" opacity="${item.value > 0 ? "1" : ".2"}" rx="5"/><text class="axis-text monthly-value" x="${labelX.toFixed(1)}" y="${(y - 8).toFixed(1)}">${monthlyAmount(item.value)}</text><text class="muted-text monthly-label" x="${labelX.toFixed(1)}" y="${height - 25}">${item.label.split(" ")[0]}</text><text class="muted-text monthly-year" x="${labelX.toFixed(1)}" y="${height - 10}">${item.label.split(" ")[1] || ""}</text>`;
  }).join("");
  const lastPoint = investedPoints.at(-1);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `${bars}<path class="monthly-invested-line" d="${pathFromPoints(investedPoints)}"/><circle class="monthly-invested-dot" cx="${lastPoint[0].toFixed(1)}" cy="${lastPoint[1].toFixed(1)}" r="4"/><text class="monthly-invested-end" x="${(lastPoint[0] - 12).toFixed(1)}" y="${Math.max(18, lastPoint[1] - 14).toFixed(1)}">THB ${monthlyAmount(investedSeries.at(-1))}</text>`;
}
function signalMeta(signal) {
  const text = cleanSignal(signal);
  const normalized = text.toLowerCase();
  if (normalized.includes("wait")) return { cls: "wait", help: "Wait for a better entry condition" };
  if (normalized.includes("reduce") || normalized.includes("sell")) return { cls: "reduce", help: "Reduce or review position size" };
  if (normalized.includes("hold")) return { cls: "hold", help: "Hold and monitor the current position" };
  if (normalized.includes("starter")) return { cls: "starter", help: "Starter position only" };
  if (normalized.includes("buy") || normalized.includes("accumulate")) return { cls: "buy", help: "Entry signal from Final Action" };
  return { cls: "hold", help: "Signal from the latest sheet" };
}
function signalBadge(signal) { const text = cleanSignal(signal); const meta = signalMeta(text); return `<span class="badge ${meta.cls}" tabindex="0" title="${meta.help}" aria-label="${text}. ${meta.help}">${text}</span>`; }

function driftRows() {
  return holdings
    .filter(item => item.ticker && item.ticker !== "CASH" && numberFrom(item.shares) > 0 && targetWeight(item) > 0)
    .map(item => ({ item, gap: targetGap(item), target: targetWeight(item), weight: numberFrom(item.weight), value: numberFrom(item.value) }))
    .sort((a, b) => {
      const tickerA = String(a.item.ticker || "").toUpperCase();
      const tickerB = String(b.item.ticker || "").toUpperCase();
      const rankA = preferredHoldingRank.get(tickerA) ?? preferredHoldingOrder.length;
      const rankB = preferredHoldingRank.get(tickerB) ?? preferredHoldingOrder.length;
      return rankA === rankB ? b.value - a.value : rankA - rankB;
    });
}
function renderDriftChart() {
  const svg = document.getElementById("driftChart");
  setText("driftModeLabel", `${kpis.marketMode} target`);
  if (!svg) return;
  const rows = driftRows();
  if (!rows.length) {
    svg.innerHTML = `<text class="axis-text" x="380" y="150" text-anchor="middle">No target data available</text>`;
    setHtml("driftSummary", `<span>No target gaps found in the latest holdings sheet.</span>`);
    return;
  }
  const width = 1080;
  const height = Math.max(230, rows.length * 26 + 46);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const padding = { top: 28, right: 320, bottom: 28, left: 150 };
  const center = padding.left + (width - padding.left - padding.right) / 2;
  const rowGap = (height - padding.top - padding.bottom) / rows.length;
  const maxGap = Math.max(5, Math.ceil(Math.max(...rows.map(row => Math.abs(row.gap))) / 2) * 2);
  const scale = value => center + (value / maxGap) * ((width - padding.left - padding.right) / 2);
  const axisTicks = [-maxGap, -maxGap / 2, 0, maxGap / 2, maxGap];
  const tickMarkup = axisTicks.map(value => {
    const x = scale(value);
    return `<g><line class="drift-grid" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${padding.top - 8}" y2="${height - padding.bottom + 4}"/><text class="axis-text" x="${x.toFixed(1)}" y="${height - 6}" text-anchor="middle">${value > 0 ? "+" : ""}${value.toFixed(0)}%</text></g>`;
  }).join("");
  const rowMarkup = rows.map((row, index) => {
    const y = padding.top + index * rowGap + rowGap / 2;
    const x = scale(row.gap);
    const barX = Math.min(center, x);
    const barW = Math.max(3, Math.abs(x - center));
    const tone = row.gap >= 1 ? "under" : row.gap <= -1 ? "over" : "near";
    const status = row.gap >= 1 ? "Add" : row.gap <= -1 ? "Pause" : "Hold";
    return `<g class="drift-row ${tone}"><text class="drift-label" x="${padding.left - 12}" y="${(y + 4).toFixed(1)}" text-anchor="end">${row.item.ticker}</text><rect class="drift-bar" x="${barX.toFixed(1)}" y="${(y - 7).toFixed(1)}" width="${barW.toFixed(1)}" height="14" rx="7"/><circle class="drift-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/><text class="drift-value" x="${width - padding.right + 14}" y="${(y + 4).toFixed(1)}">${row.gap > 0 ? "+" : ""}${row.gap.toFixed(1)}%<tspan class="drift-status"> ${status}</tspan><tspan class="drift-ratio"> &middot; ${row.weight.toFixed(1)}/${row.target.toFixed(1)}%</tspan></text></g>`;
  }).join("");
  svg.innerHTML = `${tickMarkup}<line class="drift-zero" x1="${center.toFixed(1)}" x2="${center.toFixed(1)}" y1="${padding.top - 10}" y2="${height - padding.bottom + 5}"/>${rowMarkup}`;
  const under = rows.find(row => row.gap >= 1);
  const over = rows.find(row => row.gap <= -1);
  const near = rows.filter(row => Math.abs(row.gap) < 1).length;
  setHtml("driftSummary", [
    under ? `<span class="positive"><small>Needs capital</small><b>${under.item.ticker}</b><em>Under target ${under.gap.toFixed(1)}%</em></span>` : `<span><small>Needs capital</small><b>None</b><em>No major underweight names</em></span>`,
    over ? `<span class="negative"><small>Pause buys</small><b>${over.item.ticker}</b><em>Over target ${Math.abs(over.gap).toFixed(1)}%</em></span>` : `<span><small>Pause buys</small><b>None</b><em>No major overweight names</em></span>`,
    `<span><small>Balanced</small><b>${near}</b><em>Near target within 1%</em></span>`
  ].join(""));
}
const holdingPeriodCodes = ["7d", "1m", "3m", "6m", "ytd", "1y", "5y"];
function periodReturnAliases(period) {
  const upper = String(period).toUpperCase();
  return [
    period,
    upper,
    `${period}%`,
    `${upper}%`,
    `${period} %`,
    `${upper} %`,
    `${period} return`,
    `${upper} Return`,
    `${period} return %`,
    `${upper} Return %`,
    `${period} return (%)`,
    `${upper} Return (%)`,
    `Return_${upper}`,
    `Return ${upper}`,
    `${upper}_Return`,
    `${upper} Return`,
    `Performance_${upper}`,
    `Performance ${upper}`,
    `Perf_${upper}`,
    `Perf ${upper}`
  ];
}
const holdingsPerformancePeriodAliases = Object.fromEntries(holdingPeriodCodes.map(period => [period, periodReturnAliases(period)]));
function normalizedReturnNumber(value) {
  if (value == null || value === "") return null;
  const raw = String(value).trim();
  const amount = numberFrom(value);
  if (!Number.isFinite(amount)) return null;
  if (raw.includes("%")) return amount;
  return Math.abs(amount) <= 1 ? amount * 100 : amount;
}
function holdingPeriodReturnsFromRow(row) {
  return Object.fromEntries(Object.entries(holdingsPerformancePeriodAliases).map(([period, aliases]) => [period, normalizedReturnNumber(rowAny(row, aliases, null))]));
}
function holdingsPerformancePeriodAvailable(period, rows = holdings) {
  const normalized = String(period || "all").toLowerCase();
  if (normalized === "1d" || normalized === "all") return true;
  return rows.some(item => Number.isFinite(item.periodReturns?.[normalized]));
}
function normalizeHoldingsPerformancePeriod(period, rows = holdings) {
  const normalized = String(period || "all").toLowerCase();
  return holdingsPerformancePeriodAvailable(normalized, rows) ? normalized : "all";
}
function holdingsPerformanceMetric(item) {
  const period = normalizeHoldingsPerformancePeriod(holdingsPerformancePeriod);
  if (period === "1d") return numberFrom(item.dayChangePercent);
  if (period === "all") return numberFrom(item.pl);
  const value = item.periodReturns?.[period];
  return Number.isFinite(value) ? value : null;
}
function holdingsPerformanceLabel(value) { return `${value > 0 ? "+" : ""}${value.toFixed(Math.abs(value) >= 10 ? 1 : 2)}%`; }
function holdingsPerformanceBreakpoints(values) {
  const maxAbs = Math.max(...values.map(value => Math.abs(numberFrom(value))), 1);
  const step = niceTickStep(maxAbs / 2);
  const limit = Math.max(step * 2, Math.ceil(maxAbs / step) * step);
  return [-limit, -limit / 2, 0, limit / 2, limit];
}
function holdingsPerformanceTone(value) {
  if (value < -4) return "loss-strong";
  if (value < -1) return "loss";
  if (value < 1) return "flat";
  if (value < 5) return "gain";
  return "gain-strong";
}
function treemapSplit(items, x, y, width, height, vertical = width >= height) {
  if (!items.length) return [];
  if (items.length === 1) return [{ item: items[0], x, y, width, height }];
  const total = items.reduce((sum, entry) => sum + entry.size, 0);
  let leftTotal = 0;
  let splitIndex = 0;
  for (; splitIndex < items.length - 1; splitIndex += 1) {
    const nextTotal = leftTotal + items[splitIndex].size;
    if (Math.abs(total / 2 - nextTotal) > Math.abs(total / 2 - leftTotal) && splitIndex > 0) break;
    leftTotal = nextTotal;
  }
  const left = items.slice(0, Math.max(1, splitIndex));
  const right = items.slice(Math.max(1, splitIndex));
  const leftRatio = left.reduce((sum, entry) => sum + entry.size, 0) / Math.max(total, .01);
  if (vertical) {
    const leftWidth = width * leftRatio;
    return [...treemapSplit(left, x, y, leftWidth, height, false), ...treemapSplit(right, x + leftWidth, y, width - leftWidth, height, false)];
  }
  const topHeight = height * leftRatio;
  return [...treemapSplit(left, x, y, width, topHeight, true), ...treemapSplit(right, x, y + topHeight, width, height - topHeight, true)];
}
function renderHoldingsTreemap(rows) {
  const map = document.getElementById("holdingsTreemap");
  const scale = document.getElementById("holdingsPerformanceScale");
  if (!map) return;
  const entries = rows
    .filter(item => numberFrom(item.value) > 0 && numberFrom(item.shares) > 0)
    .map(item => ({ item, size: Math.max(1, numberFrom(item.value)), performance: holdingsPerformanceMetric(item) }))
    .filter(entry => Number.isFinite(entry.performance))
    .sort((a, b) => b.size - a.size);
  holdingsPerformancePeriod = normalizeHoldingsPerformancePeriod(holdingsPerformancePeriod, rows);
  document.querySelectorAll("[data-holdings-period]").forEach(button => {
    const period = String(button.dataset.holdingsPeriod || "").toLowerCase();
    const available = holdingsPerformancePeriodAvailable(period, rows);
    const active = period === holdingsPerformancePeriod;
    button.disabled = !available;
    button.classList.toggle("disabled", !available);
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.title = available ? "" : "Add this return column to Looker_Holdings to enable it";
  });
  if (!entries.length) {
    map.innerHTML = `<div class="empty">No holdings performance data available.</div>`;
    if (scale) scale.innerHTML = "";
    return;
  }
  const values = entries.map(entry => entry.performance);
  const markers = holdingsPerformanceBreakpoints(values);
  if (scale) scale.innerHTML = markers.map(value => `<span class="${holdingsPerformanceTone(value)}">${holdingsPerformanceLabel(value)}</span>`).join("");
  const rects = treemapSplit(entries, 0, 0, 100, 100).filter(rect => rect.width > .5 && rect.height > .5);
  map.innerHTML = rects.map(rect => {
    const value = rect.item.performance;
    const ticker = escapeHtml(rect.item.item.ticker);
    const label = holdingsPerformanceLabel(value);
    const title = `${ticker} ${label} | ${formatCurrencyFromThb(rect.item.item.value)}`;
    return `<button class="treemap-tile ${holdingsPerformanceTone(value)}" type="button" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}" style="left:${rect.x.toFixed(3)}%;top:${rect.y.toFixed(3)}%;width:${rect.width.toFixed(3)}%;height:${rect.height.toFixed(3)}%"><strong>${ticker}</strong><span>${label}</span></button>`;
  }).join("");
}
function renderHoldings(filter = activeFilter, query = document.getElementById("holdingSearch")?.value || "") {
  activeFilter = filter || "All";
  const search = String(query || "").trim().toLowerCase();
  const rows = holdings.filter(item => {
    const layer = layerClass(item.layer);
    const matchesLayer = activeFilter === "All" || layer === activeFilter;
    const matchesSearch = !search || `${item.ticker} ${item.layer} ${item.signal}`.toLowerCase().includes(search);
    return matchesLayer && matchesSearch && item.ticker !== "CASH";
  }).sort(compareHoldings);
  renderHoldingsTreemap(rows);
  setHtml("holdingsBody", rows.map((item) => {
    const plClass = String(item.pl).startsWith("-") ? "negative" : item.pl === "-" ? "neutral" : "positive";
    const dayPlClass = signedClass(item.dayChangePercent);
    const layer = layerClass(item.layer);
    const gain = signedCurrencyFromThb(holdingGainThb(item));
    const dayGain = signedCurrencyFromUsd(item.dayChangeUsd);
    return `<tr class="holding-row compact ${plClass}"><td><span class="ticker-cell holding-asset">${tickerLogo(item.ticker)}<span><strong>${item.ticker}<b class="layer-text ${layer}">${layer.toUpperCase()}</b></strong><small>${numberFrom(item.shares).toFixed(6)} shares</small></span></span></td><td class="price-cell"><strong>${formatCurrencyFromUsd(item.currentPriceUsd || item.price)}</strong><small>Avg ${formatCurrencyFromUsd(item.avgCostUsd)}</small></td><td class="value-cell">${formatCurrencyFromThb(item.value)}</td><td class="gain-cell day-gain-cell ${dayPlClass}"><strong>${dayGain}</strong><small>${plusText(item.dayChangePercent, percentText)}</small></td><td class="gain-cell ${plClass}"><strong>${gain}</strong><small>${plusText(item.pl, percentText)}</small></td><td>${targetMeter(item)}</td><td>${signalBadge(item.signal)}</td><td>${indicatorCell(item)}</td></tr>`;
  }).join("") || `<tr><td colspan="8"><div class="empty">No holdings match. Clear the search or choose All.</div></td></tr>`);
  setHtml("mobileHoldings", rows.map(item => {
    const plClass = String(item.pl).startsWith("-") ? "negative" : item.pl === "-" ? "neutral" : "positive";
    const dayPlClass = signedClass(item.dayChangePercent);
    const layer = layerClass(item.layer);
    const gain = signedCurrencyFromThb(holdingGainThb(item));
    const signal = signalMeta(item.signal);
    const gainPercent = plusText(item.pl, percentText);
    const daySummary = `${signedCurrencyFromUsd(item.dayChangeUsd)} (${plusText(item.dayChangePercent, percentText)})`;
    return `<article class="mobile-holding-card compact ${plClass}" data-ticker="${item.ticker}"><div class="mobile-holding-strip"><div class="mobile-asset">${tickerLogo(item.ticker)}<span><strong>${item.ticker}<b class="layer-text ${layer}">${layer.toUpperCase()}</b></strong><small>${numberFrom(item.shares).toFixed(6)} shares</small></span></div><div class="mobile-gain ${plClass}"><strong>${gain}</strong><small>${gainPercent}</small></div><div class="mobile-stat mobile-price"><span>Price</span><strong>${formatCurrencyFromUsd(item.currentPriceUsd || item.price)}</strong></div><div class="mobile-stat mobile-avg"><span>Avg</span><strong>${formatCurrencyFromUsd(item.avgCostUsd)}</strong></div><div class="mobile-stat mobile-value"><span>Value</span><strong>${formatCurrencyFromThb(item.value)}</strong></div>${targetMeter(item, "mobile-target")}</div><div class="mobile-holding-detail"><span class="mobile-day-change">Day <b class="${dayPlClass}">${daySummary}</b></span><span class="mobile-rsi">RSI ${rsiPair(item)}</span><span class="mobile-signal ${signal.cls}" tabindex="0" title="${signal.help}">${cleanSignal(item.signal)}</span></div></article>`;
  }).join("") || `<div class="empty">No holdings match. Clear the search or choose All.</div>`);
}

function renderMobileSummary() {
  const el = document.getElementById("mobileSummary");
  if (!el) return;
  const top = signalBoard
    .filter(item => item.ticker && item.ticker !== "CASH")
    .map(item => ({ ...item, multiplier: dcaMultiplier(item) }))
    .filter(item => item.multiplier > 0)
    .sort((a, b) => b.multiplier - a.multiplier || numberFrom(a.priority || 99) - numberFrom(b.priority || 99))[0];
  el.innerHTML = [
    ["Value", kpis.portfolioValue],
    ["Return", plusText(kpis.totalReturn, percentText)],
    ["Cash", kpis.cash],
    ["Top Buy", top ? `${top.ticker} ${top.multiplier.toFixed(2)}x` : "Wait"]
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
}
function renderSignals() { const vixValue = numberFrom(kpis.vix), fearGreedValue = numberFrom(kpis.greedFear); const indicators = [["VIX", kpis.vix, vixValue <= 20 ? "positive" : "warning"], ["Fear & Greed Index", kpis.greedFear, fearGreedValue >= 55 ? "warning" : fearGreedValue <= 45 ? "negative" : "neutral"], ["S&P500 Trend", kpis.sp500Trend, /above|bull|up/i.test(kpis.sp500Trend) ? "positive" : "warning"], ["Market Breadth", kpis.marketBreadth, numberFrom(kpis.marketBreadth) >= 55 ? "positive" : "warning"], ["10Y Bond Yield", kpis.bondYield, "neutral"]]; setHtml("signalsList", indicators.map(([label, value, tone]) => `<div class="indicator-row"><span>${label}</span><span class="indicator-value"><strong class="${tone}">${value}</strong></span></div>`).join("")); }
function fxRate() { const usdValue = holdings.filter(item => item.ticker !== "CASH").reduce((sum, item) => sum + numberFrom(item.shares) * numberFrom(item.price), 0); const thbValue = holdings.filter(item => item.ticker !== "CASH").reduce((sum, item) => sum + numberFrom(item.value), 0); return usdValue > 0 && thbValue > 0 ? thbValue / usdValue : 32.6; }
function parseBudgetInput(value, fx = fxRate()) { const text = String(value || "").trim().toLowerCase(); const amount = numberFrom(text); if (!amount) return { input: text, usd: 0, thb: 0, currency: "USD" }; return { input: text, usd: amount, thb: amount * fx, currency: "USD" }; }
function formatUsd(value) { return `$${Number(value || 0).toFixed(2)}`; }
function formatThb(value) { return `THB ${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function signedThb(value) { const amount = Number(value || 0); return `${amount < 0 ? "-" : ""}THB ${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function signedPercent(value, digits = 3) { const amount = Number(value || 0); return `${amount < 0 ? "-" : ""}${Math.abs(amount).toFixed(digits)}%`; }
function shortThb(value) { const amount = numberFrom(value); if (amount >= 1000000) return `THB ${(amount / 1000000).toFixed(amount >= 10000000 ? 1 : 2)}M`; if (amount >= 1000) return `THB ${Math.round(amount).toLocaleString("en-US")}`; return formatThb(amount); }
function axisThb(value) { const amount = numberFrom(value); if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`; if (amount >= 1000) return `${Math.round(amount / 1000)}k`; return Math.round(amount).toLocaleString("en-US"); }
function fullAmount(value) { return Math.round(numberFrom(value)).toLocaleString("en-US"); }
function monthAxisLabel(month) { if (!month) return "Now"; return month % 12 === 0 ? `M${month} (Y${month / 12})` : `M${month}`; }
function sheetDate(value) { if (value instanceof Date) return value; if (typeof value === "number") return new Date(Date.UTC(1899, 11, 30) + value * 86400000); const parsed = new Date(String(value || "")); return Number.isNaN(parsed.getTime()) ? new Date() : parsed; }
function validSheetDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") {
    const date = new Date(Date.UTC(1899, 11, 30) + value * 86400000);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const parsed = new Date(String(value || ""));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function marketBusinessDaysSince(latest, now) {
  const cursor = new Date(latest.getFullYear(), latest.getMonth(), latest.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let days = 0;
  while (cursor < today) {
    cursor.setDate(cursor.getDate() + 1);
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) days += 1;
  }
  return days;
}
function dataFreshness(now = new Date(), syncVerb = "Synced") {
  const latest = navRows.map(row => validSheetDate(row[0])).filter(Boolean).sort((a, b) => b - a)[0];
  const syncLabel = `${syncVerb} ${now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}`;
  if (!latest) return { label: `Market close unavailable | ${syncLabel}`, stale: true, businessDays: Infinity };
  const businessDays = marketBusinessDaysSince(latest, now);
  const marketLabel = latest.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return { label: `Market close ${marketLabel} | ${syncLabel}`, stale: businessDays > 1, businessDays };
}
function updateFreshnessUi(freshness) {
  const meta = document.getElementById("freshnessMeta");
  if (!meta) return;
  meta.textContent = freshness.label;
  meta.classList.toggle("stale", freshness.stale);
}
function syncIntegrityIssues() {
  const issues = [];
  const portfolioValue = numberFrom(kpis.portfolioValue);
  const holdingsValue = holdings.filter(item => item.ticker !== "CASH").reduce((sum, item) => sum + numberFrom(item.value), 0);
  if (portfolioValue > 0 && holdingsValue > 0) {
    const gap = Math.abs(portfolioValue - holdingsValue);
    if (gap > Math.max(100, portfolioValue * 0.015)) issues.push("KPI/Holdings gap " + formatCurrencyFromThb(gap));
  }
  const latest = navRows.map(row => validSheetDate(row[0])).filter(Boolean).sort((a, b) => b - a)[0];
  if (latest && marketBusinessDaysSince(latest, new Date()) > 1) issues.push("NAV behind market close");
  return issues;
}
function updateSyncIntegrityUi() {
  const meta = document.getElementById("syncIntegrityMeta");
  if (!meta) return;
  const issues = syncIntegrityIssues();
  meta.textContent = issues.length ? "Check: " + issues.join(" | ") : "Cross-check passed";
  meta.classList.toggle("warning", issues.length > 0);
  meta.classList.toggle("ok", issues.length === 0);
}
function dcaSizing(item) {
  const signal = cleanSignal(item.signal).toUpperCase();
  if (item.signalSource !== "Final_Action") return { multiplier: 0, source: item.signalSource || "No verified action" };
  if (/WAIT|HOLD|REDUCE|SELL|NO BUY|AVOID/.test(signal)) return { multiplier: 0, source: item.signalSource || "Signal" };
  const explicit = signal.match(/(?:^|\s)(1(?:\.0+)?|0?\.(?:25|5|50|75))\s*X\b/i);
  if (explicit) return { multiplier: Math.min(1, numberFrom(explicit[1])), source: item.signalSource || "Final_Action" };
  return { multiplier: 0, source: item.signalSource || "Signal" };
}
function dcaMultiplier(item) { return dcaSizing(item).multiplier; }
function dcaRankScore(item) {
  const multiplier = dcaMultiplier(item);
  const gap = Math.max(-5, Math.min(10, targetGap(item)));
  const priority = numberFrom(item.priority || 99);
  const rsi7 = numberFrom(item.rsi7);
  const rsiQuality = rsi7 < 30 ? 10 : rsi7 < 45 ? 7 : rsi7 <= 65 ? 3 : rsi7 > 75 ? -10 : 0;
  return multiplier * 100 + gap * 5 + Math.max(0, 20 - priority) + rsiQuality;
}
function dcaReason(item, multiplier) {
  const sizing = dcaSizing(item);
  const gap = targetGap(item);
  const cap = Number.isFinite(item.smartDcaUsd) ? `cap ${formatUsd(item.smartDcaUsd)}` : "no sheet cap";
  return `${sizing.source}: ${multiplier.toFixed(2)}x; ${gap > 0 ? `under target ${gap.toFixed(1)}%` : gap < 0 ? `over target ${Math.abs(gap).toFixed(1)}%` : "on target"}; priority ${numberFrom(item.priority || 99)}; ${cap}`;
}

function dcaReasonChips(item) {
  const sizing = dcaSizing(item);
  const gap = targetGap(item);
  const rsi7 = numberFrom(item.rsi7);
  const target = gap > 0 ? `Under ${gap.toFixed(1)}%` : gap < 0 ? `Over ${Math.abs(gap).toFixed(1)}%` : "On target";
  const rsi = rsi7 < 30 ? `RSI7 ${rsi7.toFixed(1)} low` : rsi7 > 70 ? `RSI7 ${rsi7.toFixed(1)} high` : `RSI7 ${rsi7.toFixed(1)}`;
  const cap = Number.isFinite(item.smartDcaUsd) ? `Cap ${formatUsd(item.smartDcaUsd)}` : "No cap";
  return [sizing.source, target, rsi, `Priority ${numberFrom(item.priority || 99)}`, cap];
}
function dcaReasonMarkup(item) {
  return `<span class="dca-reason-chips">${dcaReasonChips(item).map(label => `<b>${label}</b>`).join("")}</span>`;
}

function buildDcaPlan(budgetUsd) {
  const fx = fxRate();
  const candidates = signalBoard.filter(item => item.ticker && item.ticker !== "CASH").map(item => ({ ...item, multiplier: dcaMultiplier(item), smartDcaUsd: numberFrom(item.smartDcaUsd) || Infinity, targetGap: targetGap(item), rankScore: dcaRankScore(item) })).filter(item => item.multiplier > 0).sort((a, b) => b.rankScore - a.rankScore || numberFrom(a.priority || 99) - numberFrom(b.priority || 99)).slice(0, 3);
  const picks = candidates.map(item => ({ ...item, amountUsd: 0 }));
  const requestedUsd = Math.max(0, Number(budgetUsd || 0));
  let remaining = requestedUsd;
  let open = picks.filter(item => item.multiplier > 0 && item.smartDcaUsd > 0);
  for (let round = 0; round < 12 && remaining > 0.005 && open.length; round += 1) {
    const totalWeight = open.reduce((sum, item) => sum + item.multiplier, 0);
    if (totalWeight <= 0) break;
    let spent = 0;
    open.forEach(item => { const room = Number.isFinite(item.smartDcaUsd) ? Math.max(0, item.smartDcaUsd - item.amountUsd) : remaining; const add = Math.min(room, remaining * (item.multiplier / totalWeight)); item.amountUsd += add; spent += add; });
    if (spent <= 0.005) break;
    remaining = Math.max(0, remaining - spent);
    open = picks.filter(item => item.smartDcaUsd - item.amountUsd > 0.01);
  }
  const usedRaw = picks.reduce((sum, item) => sum + item.amountUsd, 0);
  return { fx, deployRatio: requestedUsd > 0 ? 1 : 0, picks: picks.map(item => ({ ...item, reason: dcaReason(item, item.multiplier), amountUsd: Math.round(item.amountUsd * 100) / 100, amountThb: Math.round(item.amountUsd * fx), belowMin: item.amountUsd > 0 && item.amountUsd < MIN_ORDER_USD })), usedUsd: Math.round(usedRaw * 100) / 100, leftoverUsd: Math.round(Math.max(0, requestedUsd - usedRaw) * 100) / 100 };
}

function renderTodaySignal(best, budgetUsd) {
  const details = document.getElementById("todayActionDetails");
  const reasons = document.getElementById("todayActionReasons");
  const rank = document.getElementById("todayActionRank");
  if (!best) {
    setText("todaySignal", "No action today");
    setText("todaySignalText", "No eligible buy signal. Keep cash available.");
    if (rank) rank.textContent = "No candidate";
    if (details) details.innerHTML = "";
    if (reasons) reasons.innerHTML = "";
    return;
  }
  const gap = targetGap(best);
  const signal = cleanSignal(best.signal);
  const amount = budgetUsd > 0 && Number(best.amountUsd) > 0 ? formatUsd(best.amountUsd) : `${best.multiplier.toFixed(2)}x size`;
  const gapText = gap > 0 ? `Under target ${gap.toFixed(1)}%` : gap < 0 ? `Over target ${Math.abs(gap).toFixed(1)}%` : "On target";
  setText("todaySignal", budgetUsd > 0 ? "Sizing ready" : "Candidate ready");
  setText("todaySignalText", `${signal} ${best.ticker} - ${amount}`);
  if (rank) rank.textContent = `Top pick - ${best.ticker}`;
  if (details) setHtml("todayActionDetails", `<div><span>Buy</span><strong>${best.ticker}</strong></div><div><span>Suggested</span><strong>${amount}</strong></div><div><span>Target gap</span><strong class="${gap >= 0 ? "positive" : "negative"}">${gapText}</strong></div>`);
  if (reasons) setHtml("todayActionReasons", `<span>Why it ranks first</span>${dcaReasonMarkup(best)}`);
}function renderSmartDca() {
  const input = document.getElementById("dcaBudgetInput");
  const budget = parseBudgetInput(input?.value || "");
  const plan = buildDcaPlan(budget.usd);
  const rows = budget.usd > 0 ? plan.picks.filter(item => item.amountUsd > 0) : plan.picks;
  const ruleNote = `<span class="dca-rule-note">Only an explicit Final_Action such as BUY 0.25x to 1.00x can create an order. Target gap, priority and RSI rank approved actions.</span>`;
  setHtml("dcaBudgetSummary", budget.usd > 0
    ? `${ruleNote}<span class="dca-summary-title">Final_Action sizing: allocate ${formatUsd(plan.usedUsd)} from ${formatUsd(budget.usd)} and keep ${formatUsd(plan.leftoverUsd)} in cash.</span><span class="dca-figures"><b>Budget ${formatUsd(budget.usd)}</b><b>Allocate ${formatUsd(plan.usedUsd)}</b><b>Cash left ${formatUsd(plan.leftoverUsd)}</b><b>Min ${formatUsd(MIN_ORDER_USD)}</b></span>`
    : `${ruleNote}<span class="dca-empty-hint">Enter USD. Sizing follows explicit BUY 0.25x / 0.50x / 0.75x / 1.00x from the sheet when available.</span>`);
  setHtml("smartDcaList", rows.map((item, index) => `<div class="mini-row dca-plan-row"><span>${index + 1}. <strong>${item.ticker}</strong><small class="dca-action-line">${cleanSignal(item.signal)} <b>Score ${item.rankScore.toFixed(0)}</b></small>${dcaReasonMarkup(item)}${item.belowMin ? `<small class="dca-minimum-warning">Below DIME minimum</small>` : ""}</span><strong>${budget.usd > 0 ? formatUsd(item.amountUsd) : `${item.multiplier.toFixed(2)}x`}<small>${item.multiplier.toFixed(2)}x weight</small></strong></div>`).join("") || `<div class="empty">No eligible Final_Action today. Keep cash.</div>`);
  renderTodaySignal(rows[0], budget.usd);
  renderRebalancePlanner(budget.usd, plan);
}
function holdingValueUsd(item) { const direct = numberFrom(item.valueUsd); return direct > 0 ? direct : numberFrom(item.value) / Math.max(fxRate(), 1); }
function buildRebalancePlan(budgetUsd, approvedTickers = []) {
  const budget = Math.max(0, numberFrom(budgetUsd));
  const approved = new Set(approvedTickers.map(ticker => String(ticker).toUpperCase()));
  const eligible = holdings.filter(item => item.ticker && item.ticker !== "CASH" && approved.has(String(item.ticker).toUpperCase()) && targetWeight(item) > 0);
  const totalValue = eligible.reduce((sum, item) => sum + holdingValueUsd(item), 0);
  const targets = eligible.map(item => ({ ...item, currentUsd: holdingValueUsd(item), deficitUsd: Math.max(0, (totalValue + budget) * targetWeight(item) / 100 - holdingValueUsd(item)) })).filter(item => item.deficitUsd > .01);
  const totalDeficit = targets.reduce((sum, item) => sum + item.deficitUsd, 0);
  const picks = targets.map(item => ({ ...item, amountUsd: totalDeficit ? Math.min(item.deficitUsd, budget * item.deficitUsd / totalDeficit) : 0 })).filter(item => item.amountUsd > .01).sort((a, b) => b.amountUsd - a.amountUsd);
  const allocated = picks.reduce((sum, item) => sum + item.amountUsd, 0);
  return { budget, totalDeficit, picks, allocated, cash: Math.max(0, budget - allocated) };
}
function renderRebalancePlanner(sharedBudget, signalPlan = buildDcaPlan(sharedBudget)) {
  const input = document.getElementById("dcaBudgetInput");
  const budget = Number.isFinite(sharedBudget) ? sharedBudget : parseBudgetInput(input?.value || "").usd;
  const approvedTickers = signalPlan.picks.filter(item => item.multiplier > 0).map(item => item.ticker);
  const plan = buildRebalancePlan(budget, approvedTickers);
  setText("rebalanceBudgetLabel", formatUsd(plan.budget));
  if (!approvedTickers.length) {
    setHtml("rebalanceSummary", "No eligible <strong>Final_Action</strong> today. Target gaps remain visible in Portfolio drift, but no purchase allocation is proposed.");
    setHtml("rebalanceList", `<div class="empty">No eligible buy action today. Keep the budget in cash.</div>`);
    return;
  }
  setHtml("rebalanceSummary", budget > 0
    ? `MODE target: allocate <strong>${formatUsd(plan.allocated)}</strong> of ${formatUsd(plan.budget)} to reduce underweight positions. No sell orders are suggested.`
    : `Enter a USD budget to see purchases that move the portfolio toward ${kpis.marketMode} targets.`);
  const deployedPercent = plan.budget > 0 ? Math.min(100, plan.allocated / plan.budget * 100) : 0;
  const allocationOverview = budget > 0 ? `<div class="allocation-overview"><div><span>Allocation progress</span><strong>${deployedPercent.toFixed(0)}% deployed</strong></div><div class="allocation-progress" aria-label="${deployedPercent.toFixed(0)} percent of budget allocated"><i style="width:${deployedPercent.toFixed(1)}%"></i></div><small>${formatUsd(plan.allocated)} allocated · ${formatUsd(plan.cash)} left in cash</small></div>` : "";
  setHtml("rebalanceList", allocationOverview + (plan.picks.slice(0, 4).map(item => `<div class="rebalance-row"><span><strong>${item.ticker}</strong><small>${targetStatus(item).label} ${Math.max(0, targetGap(item)).toFixed(1)}% &middot; target ${targetWeight(item).toFixed(1)}%</small></span><strong>${formatUsd(item.amountUsd)}<small>${(item.amountUsd / Math.max(plan.budget, 1) * 100).toFixed(0)}% of budget</small></strong></div>`).join("") || `<div class="empty">No underweight target positions available for this budget.</div>`));
}
function healthActionItems(activeHoldings, cashWeight) {
  const actions = [];
  const overweight = activeHoldings
    .map(item => ({ item, gap: targetGap(item), target: targetWeight(item) }))
    .filter(entry => entry.target && entry.gap <= -1)
    .sort((a, b) => a.gap - b.gap)[0];
  const underweight = activeHoldings
    .map(item => ({ item, gap: targetGap(item), target: targetWeight(item), priority: numberFrom(item.priority || 99) }))
    .filter(entry => entry.target && entry.gap >= 1)
    .sort((a, b) => b.gap - a.gap || a.priority - b.priority)[0];
  const hotRsi = activeHoldings
    .filter(item => numberFrom(item.rsi7) > 70 || numberFrom(item.rsi14) > 70)
    .sort((a, b) => Math.max(numberFrom(b.rsi7), numberFrom(b.rsi14)) - Math.max(numberFrom(a.rsi7), numberFrom(a.rsi14)))[0];
  if (overweight) actions.push({ tone: "caution", title: `${overweight.item.ticker} over target`, detail: `${numberFrom(overweight.item.weight).toFixed(1)}% vs target ${overweight.target.toFixed(1)}%. Pause new buys first.` });
  if (underweight) actions.push({ tone: "positive", title: `${underweight.item.ticker} needs capital`, detail: `${underweight.gap.toFixed(1)}% under target. Prioritize with Smart DCA.` });
  if (hotRsi) actions.push({ tone: "warning", title: `${hotRsi.ticker} RSI is hot`, detail: `RSI7 ${numberFrom(hotRsi.rsi7).toFixed(1)} / RSI14 ${numberFrom(hotRsi.rsi14).toFixed(1)}. Consider smaller sizing.` });
  if (cashWeight < 1) actions.push({ tone: "neutral", title: "Cash buffer is low", detail: `Cash is ${cashWeight.toFixed(1)}% of portfolio. New buys depend on fresh deposits.` });
  return actions.slice(0, 3);
}
function renderHealth() {
  const activeHoldings = holdings.filter(item => item.ticker !== "CASH" && numberFrom(item.shares) > 0);
  const layerWeights = activeHoldings.reduce((map, item) => {
    const layer = layerClass(item.layer);
    map[layer] = (map[layer] || 0) + numberFrom(item.weight);
    return map;
  }, { Core: 0, Defense: 0, Growth: 0, Income: 0 });
  const core = layerWeights.Core || 0;
  const defense = layerWeights.Defense || 0;
  const growth = layerWeights.Growth || 0;
  const income = layerWeights.Income || 0;
  const cash = holdings.find(item => item.ticker === "CASH");
  const cashWeight = cash ? cash.weight : 0;
  const diversification = Math.min(9.2, 7.2 + activeHoldings.length * .18);
  const riskControl = Math.max(6.4, Math.min(9.4, 9.2 - Math.max(0, growth - 42) * .05 - Math.max(0, income - 25) * .03 + Math.min(core + defense, 65) * .006 + Math.min(cashWeight, 4) * .03));
  const momentum = /MODE A/i.test(kpis.marketMode) ? 9 : 7.6;
  const cashBuffer = Math.max(6.5, Math.min(9, 7 + cashWeight / 2));
  const score = (diversification + riskControl + momentum + cashBuffer) / 4;
  setText("healthScore", score.toFixed(1));
  const scoreLabel = score >= 8.5 ? "Strong" : score >= 7 ? "Balanced" : "Needs review";
  setText("healthScoreLabel", scoreLabel);
  setHtml("healthScoreSummary", `<span>${scoreLabel} portfolio setup</span><strong>${activeHoldings.length} active holdings</strong><small>${kpis.marketMode} - ${cashWeight.toFixed(1)}% cash</small>`);
  const ring = document.querySelector(".health-ring");
  if (ring) ring.style.setProperty("--health-fill", `${Math.round(score * 10)}%`);
  const metrics = [
    ["Diversification", diversification, `${activeHoldings.length} active holdings; capped at 9.2`],
    ["Risk Control", riskControl, `Core ${core.toFixed(1)}%, Defense ${defense.toFixed(1)}%, Growth ${growth.toFixed(1)}%, Income ${income.toFixed(1)}%, Cash ${cashWeight.toFixed(1)}%`],
    ["Momentum", momentum, `Based on ${kpis.marketMode}`],
    ["Cash Buffer", cashBuffer, `Cash weight ${cashWeight.toFixed(1)}%`]
  ];
  setHtml("healthMetrics", metrics.map(([label, value, help]) => `<div class="health-metric" title="${help}"><span><b>${label}</b><small>${help}</small></span><strong>${value.toFixed(1)}</strong></div>`).join(""));
  setHtml("healthActions", healthActionItems(activeHoldings, cashWeight).map(action => `<div class="health-action ${action.tone}"><b>${action.title}</b><span>${action.detail}</span></div>`).join(""));
  const latestHealthDate = navRows.map(row => validSheetDate(row[0])).filter(Boolean).sort((a, b) => b - a)[0];
  setText("healthAsOf", latestHealthDate
    ? `Scored using market close ${latestHealthDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.`
    : "Based on the latest synced portfolio.");
}
function alertPriceUsd(item) { return numberFrom(item.currentPriceUsd || item.price); }
function defaultPriceAlerts() { return holdings.filter(item => item.ticker && alertPriceUsd(item) > 0).slice(0, 2).map((item, index) => ({ id: `${item.ticker}-${index}`, ticker: item.ticker, direction: index ? "above" : "below", target: Number((alertPriceUsd(item) * (index ? 1.08 : .94)).toFixed(2)) })); }
function readPriceAlerts() { try { const stored = JSON.parse(localStorage.getItem(PRICE_ALERTS_STORAGE_KEY) || "null"); return Array.isArray(stored) ? stored : defaultPriceAlerts(); } catch (error) { return defaultPriceAlerts(); } }
function savePriceAlerts(alerts) { try { localStorage.setItem(PRICE_ALERTS_STORAGE_KEY, JSON.stringify(alerts)); } catch (error) { console.warn(error); } }
function renderPriceAlerts() {
  const select = document.getElementById("priceAlertTicker");
  const list = document.getElementById("priceAlertList");
  if (!select || !list) return;
  const previousTicker = select.value;
  const priced = holdings.filter(item => item.ticker && alertPriceUsd(item) > 0);
  select.innerHTML = priced.map(item => `<option value="${item.ticker}">${item.ticker} &middot; &#36;${alertPriceUsd(item).toFixed(2)}</option>`).join("");
  if (priced.some(item => item.ticker === previousTicker)) select.value = previousTicker;
  const alerts = readPriceAlerts().filter(alert => priced.some(item => item.ticker === alert.ticker));
  if (!alerts.length && priced.length) { const seeded = defaultPriceAlerts(); savePriceAlerts(seeded); return renderPriceAlerts(); }
  list.innerHTML = alerts.map(alert => {
    const item = priced.find(row => row.ticker === alert.ticker);
    const current = alertPriceUsd(item);
    const triggered = alert.direction === "below" ? current <= alert.target : current >= alert.target;
    return `<div class="price-alert-row ${triggered ? "triggered" : "ready"}"><span><strong>${alert.ticker}</strong><small>&#36;${current.toFixed(2)} now &middot; ${alert.direction} &#36;${Number(alert.target).toFixed(2)}</small></span><b>${triggered ? "Triggered" : "Watching"}</b><button type="button" data-remove-price-alert="${alert.id}" aria-label="Remove ${alert.ticker} price alert" title="Remove alert">&times;</button></div>`;
  }).join("") || `<div class="empty">Add a price level to start watching.</div>`;
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])); }
function normalizeTickerInput(value) { return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9.-]/g, "").slice(0, 12); }
function sheetWatchlistUrl() { return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`; }
function parseWatchlistSheet(rows) {
  return rowsToObjects(rows).map(row => {
    const ticker = normalizeTickerInput(rowAny(row, ["Ticker", "Symbol"], ""));
    if (!ticker) return null;
    return {
      ticker,
      name: rowAny(row, ["Name", "Company", "Asset"], ""),
      type: rowAny(row, ["Type", "Asset Type", "Kind"], ""),
      price: numberFrom(rowAny(row, ["Price", "Current Price", "Current_Price_USD", "Price USD"], 0)),
      low52: numberFrom(rowAny(row, ["52W Low", "52 Week Low", "Low 52", "52W_Low"], 0)),
      high52: numberFrom(rowAny(row, ["52W High", "52 Week High", "High 52", "52W_High"], 0)),
      target: numberFrom(rowAny(row, ["Target Price", "Target", "Target USD", "Target_Price"], 0)),
      sweetSpot: numberFrom(rowAny(row, ["Sweet Spot", "SweetSpot", "Sweet Spot USD", "Sweet_Spot"], 0)),
      signal: cleanSignal(rowAny(row, ["Signal", "Watchlist Signal"], "WATCH")),
      totalTrend: rowAny(row, ["Trend", "Watchlist Trend", "Total Trend"], ""),
      rsi7: numberFrom(rowAny(row, ["RSI 7", "RSI7", "RSI_7"], 0)),
      rsi14: numberFrom(rowAny(row, ["RSI 14", "RSI14", "RSI_14"], 0)),
      nearestSupport: numberFrom(rowAny(row, ["Nearest Support (20D)", "Nearest Support", "Support", "Support Price", "Nearest_Support"], 0)),
      reason: rowAny(row, ["Reason", "Status", "Tag"], "From Watchlist sheet"),
      note: rowAny(row, ["Note", "Notes", "Thesis"], ""),
      source: "sheet"
    };
  }).filter(Boolean);
}
function readLocalWatchlist() {
  try {
    const stored = JSON.parse(localStorage.getItem(WATCHLIST_STORAGE_KEY) || "null");
    if (Array.isArray(stored)) return stored.map(item => typeof item === "string" ? { ticker: normalizeTickerInput(item), reason: "Watching", source: "local" } : { ...item, ticker: normalizeTickerInput(item.ticker), source: item.source || "local" }).filter(item => item.ticker);
  } catch (error) { console.warn(error); }
  return [];
}
function readInterestWatchlist() {
  const byTicker = new Map();
  const add = item => {
    const ticker = normalizeTickerInput(item?.ticker);
    if (!ticker) return;
    const existing = byTicker.get(ticker) || {};
    byTicker.set(ticker, { ...existing, ...item, ticker, source: item.source || existing.source || "local" });
  };
  defaultWatchlistTickers().forEach(ticker => add({
    ticker,
    reason: signalUniverse.some(item => String(item.ticker).toUpperCase() === ticker) ? "From signal sheet" : "Starter watchlist",
    source: "default"
  }));
  readLocalWatchlist().forEach(add);
  sheetWatchlistRows.forEach(item => add({ ...item, ticker: normalizeTickerInput(item.ticker), source: "sheet" }));
  return [...byTicker.values()];
}
function saveInterestWatchlist(items) {
  const unique = [];
  const seen = new Set();
  items.forEach(item => {
    const ticker = normalizeTickerInput(item.ticker);
    if (!ticker || seen.has(ticker)) return;
    seen.add(ticker);
    unique.push({ ticker, interest: Math.max(0, Math.min(5, Math.round(numberFrom(item.interest)))), reason: item.reason || "Watching", price: numberFrom(item.price), low52: numberFrom(item.low52), high52: numberFrom(item.high52), target: numberFrom(item.target), sweetSpot: numberFrom(item.sweetSpot), nearestSupport: numberFrom(item.nearestSupport), note: String(item.note || "").trim().slice(0, 120), addedAt: item.addedAt || Date.now() });
  });
  try { localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(unique)); } catch (error) { console.warn(error); }
}
function defaultWatchlistTickers() {
  const held = new Set(holdings.filter(item => numberFrom(item.shares) > 0 || numberFrom(item.value) > 0).map(item => String(item.ticker).toUpperCase()));
  const signalCandidates = signalUniverse.filter(item => item.ticker && !held.has(String(item.ticker).toUpperCase()))
    .sort((a, b) => (numberFrom(a.priority) || 99) - (numberFrom(b.priority) || 99))
    .map(item => String(item.ticker).toUpperCase());
  const profileCandidates = Object.keys(watchlistProfiles).filter(ticker => !held.has(ticker));
  const fallback = ["MSFT", "AVGO", "META", "PLTR", "RKLB", "AMD", "GLDM", "MLPI", "SPCX", "QDTE", "SPYI", "DIVO", "IWMI", "NIHI", "MLPD", "ROCQ", "O", "DRAM"].filter(ticker => !held.has(ticker));
  return [...new Set([...signalCandidates, ...profileCandidates, ...fallback])];
}
function watchlistDataSource(ticker) {
  const symbol = normalizeTickerInput(ticker);
  const holding = holdings.find(item => String(item.ticker).toUpperCase() === symbol);
  const signal = signalUniverse.find(item => String(item.ticker).toUpperCase() === symbol);
  return { ...(watchlistProfiles[symbol] || {}), ...(signal || {}), ...(holding || {}), ticker: symbol, held: !!holding && (numberFrom(holding.shares) > 0 || numberFrom(holding.value) > 0), inSheet: !!signal || !!holding };
}
function watchlistSignalCandidates() {
  const watched = new Set(readInterestWatchlist().map(item => item.ticker));
  const held = new Set(holdings.filter(item => numberFrom(item.shares) > 0 || numberFrom(item.value) > 0).map(item => String(item.ticker).toUpperCase()));
  return signalUniverse.filter(item => item.ticker && !watched.has(String(item.ticker).toUpperCase()) && !held.has(String(item.ticker).toUpperCase()))
    .sort((a, b) => (numberFrom(a.priority) || 99) - (numberFrom(b.priority) || 99))
    .slice(0, 8);
}
function stockResearchLinks(ticker) {
  const symbol = encodeURIComponent(normalizeTickerInput(ticker));
  const isEtf = /VOO|SPMO|VXUS|SCHD|QQQI|IAUI|MLPI/i.test(symbol);
  return [
    { label: "Yahoo", href: `https://finance.yahoo.com/quote/${symbol}` },
    { label: "TradingView", href: `https://www.tradingview.com/symbols/${symbol}/` },
    { label: isEtf ? "ETF.com" : "Nasdaq", href: isEtf ? `https://www.etf.com/${symbol}` : `https://www.nasdaq.com/market-activity/stocks/${symbol.toLowerCase()}` }
  ];
}
function watchlistRangePosition(price, low, high) {
  if (!(price > 0 && low > 0 && high > low)) return null;
  return Math.max(0, Math.min(100, ((price - low) / (high - low)) * 100));
}
function watchlistOpportunity(price, target, sweetSpot, low, high) {
  if (!(price > 0)) return { label: "Price needed", tone: "neutral" };
  if (sweetSpot > 0 && price <= sweetSpot) return { label: "In sweet spot", tone: "positive" };
  if (sweetSpot > 0 && price <= sweetSpot * 1.03) return { label: "Near sweet spot", tone: "watch" };
  if (target > 0 && price <= target) return { label: "Under target", tone: "positive" };
  if (target > 0 && price > target) return { label: "Above target", tone: "negative" };
  const pos = watchlistRangePosition(price, low, high);
  if (pos != null && pos <= 25) return { label: "Near 52W low", tone: "positive" };
  if (pos != null && pos >= 80) return { label: "Near 52W high", tone: "negative" };
  return { label: "Watching", tone: "neutral" };
}
function stockDetailStats(item, price, hasRsi) {
  const stats = [
    ["Type", assetKind(item.ticker)],
    ["Portfolio", item.held ? `${numberFrom(item.weight).toFixed(1)}% weight` : "Not held"],
    ["Target", targetWeight(item) ? `${targetWeight(item).toFixed(1)}%` : "No target"],
    ["Priority", numberFrom(item.priority) && numberFrom(item.priority) < 99 ? `#${numberFrom(item.priority).toFixed(0)}` : "n/a"]
  ];
  if (price > 0) stats.unshift(["Price", formatUsd(price)]);
  if (hasRsi) stats.push(["RSI", `${numberFrom(item.rsi7).toFixed(1)} / ${numberFrom(item.rsi14).toFixed(1)}`]);
  return stats;
}
function watchlistLinksHtml(ticker) {
  return stockResearchLinks(ticker).map(link => `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join("");
}
function watchlistInterestRating(ticker, value) {
  const interest = Math.max(0, Math.min(5, Math.round(numberFrom(value))));
  const stars = [1, 2, 3, 4, 5].map(star => `<button type="button" data-watchlist-star="${star}" data-watchlist-star-ticker="${ticker}" aria-label="Rate ${ticker} ${star} of 5" aria-pressed="${star <= interest}" title="${star} of 5"><span aria-hidden="true">★</span></button>`).join("");
  return `<div class="watchlist-interest"><small>Interest</small><div class="watchlist-stars" role="group" aria-label="Interest rating for ${ticker}">${stars}</div></div>`;
}
function renderInterestWatchlist() {
  const list = document.getElementById("watchlistItems");
  if (!list) return;
  const tickers = readInterestWatchlist();
  const options = document.getElementById("watchlistTickerOptions");
  const knownTickers = [...new Set([...signalUniverse, ...holdings].map(item => normalizeTickerInput(item.ticker)).filter(Boolean))].sort();
  if (options) options.innerHTML = knownTickers.map(ticker => `<option value="${ticker}"></option>`).join("");
  setText("watchlistCount", `${tickers.length} tickers`);
  setText("watchlistStatus", tickers.length ? `${tickers.length} stocks` : "Add stocks");
  list.innerHTML = tickers.map(saved => {
    const baseItem = watchlistDataSource(saved.ticker);
    const item = { ...baseItem, ...saved, held: baseItem.held, inSheet: baseItem.inSheet || saved.source === "sheet" };
    const price = alertPriceUsd(item) > 0 ? alertPriceUsd(item) : numberFrom(saved.price);
    const day = numberFrom(item.dayChangePercent);
    const signal = cleanSignal(item.signal || "No sheet signal");
    const hasRsi = hasValidRsi(item.rsi7) && hasValidRsi(item.rsi14);
    const profile = watchlistProfiles[item.ticker] || {};
    const name = profile.name || item.name || "Research idea";
    const theme = profile.theme || item.layer || "Watchlist";
    const priceText = price > 0 ? formatUsd(price) : "Waiting for quote";
    const dayText = price > 0 ? (Math.abs(day) < 0.005 ? "No intraday move" : `${plusText(day, percentText)} today`) : "Waiting for live quote";
    const savedTarget = numberFrom(saved.target), low52 = numberFrom(saved.low52), high52 = numberFrom(saved.high52), sweetSpot = numberFrom(saved.sweetSpot), nearestSupport = numberFrom(saved.nearestSupport);
    const rangePos = watchlistRangePosition(price, low52, high52);
    const opportunityData = watchlistOpportunity(price, savedTarget, sweetSpot, low52, high52);
    const opportunity = `<span class="watchlist-opportunity ${opportunityData.tone}">${opportunityData.label}</span>`;
    const interest = Math.max(0, Math.min(5, Math.round(numberFrom(saved.interest))));
    const kind = assetKind(item.ticker) === "ETF" ? "etf" : "stock";
    const missing = price <= 0 || !hasRsi;
    const details = [["Price", price > 0 ? formatUsd(price) : "Waiting for data"], ["Sheet signal", signal], ["52W low/high", low52 > 0 && high52 > 0 ? `${formatUsd(low52)} / ${formatUsd(high52)}` : "Waiting for data"], ["Target price", savedTarget > 0 ? formatUsd(savedTarget) : "Not set"], ["Nearest support (20D)", nearestSupport > 0 ? formatUsd(nearestSupport) : "Not set"], ["Sweet spot", sweetSpot > 0 ? formatUsd(sweetSpot) : "Not set"]].map(([label, value]) => `<span><small>${label}</small><b>${value}</b></span>`).join("");
    const range = rangePos != null ? `<div class="watchlist-range" style="--watch-range:${rangePos.toFixed(0)}%"><span><b></b></span><small>Price position in 52W range: ${rangePos.toFixed(0)}%</small></div>` : "";
    return `<article class="watchlist-stock-row ${signedClass(day)}" data-watchlist-ticker="${item.ticker}" data-watchlist-price="${price}" data-watchlist-sweet="${sweetSpot > 0 && price > 0 && price <= sweetSpot * 1.03}" data-watchlist-support="${rangePos != null && rangePos <= 25}" data-watchlist-interest="${interest}" data-watchlist-kind="${kind}" data-watchlist-theme="${escapeHtml(theme.toLowerCase())}" data-watchlist-missing="${missing}" data-watchlist-rank="${opportunityData.tone === "positive" ? 0 : opportunityData.tone === "watch" ? 1 : opportunityData.tone === "neutral" ? 2 : 3}"><div class="watchlist-stock-main">${tickerLogo(item.ticker)}<span><strong>${item.ticker}<b class="watchlist-type-chip">${assetKind(item.ticker)}</b></strong><small>${name}</small><em>${item.held ? "Already in portfolio" : saved.reason || "Watching"} &middot; ${theme}</em></span></div><div class="watchlist-stock-body"><div class="watchlist-stock-meta"><span><b>${priceText}</b><small>${dayText}</small></span><span class="watchlist-primary-status" title="Sheet signal: ${escapeHtml(signal)}">${opportunity}</span><span class="watchlist-rsi-meta"><small>RSI 7 / 14 (${indicatorTimeframe})</small><b>${hasRsi ? `${rsiValue(item.rsi7)}<span class="rsi-separator">/</span>${rsiValue(item.rsi14)}` : "Waiting for data"}</b></span></div><div class="watchlist-expanded-content"><div class="watchlist-detail-grid">${details}</div>${saved.note ? `<div class="watchlist-note">${escapeHtml(saved.note)}</div>` : ""}${range}<div class="watchlist-link-row">${watchlistLinksHtml(item.ticker)}</div></div><div class="watchlist-row-actions">${watchlistInterestRating(item.ticker, interest)}<button class="watchlist-details-toggle" type="button" data-watchlist-details="${item.ticker}" aria-expanded="false">Details</button></div></div></article>`;
  }).join("") || `<div class="empty">Add tickers you are interested in. If the ticker exists in Looker_Signals or holdings, live data will show here.</div>`;
  const rows = [...list.querySelectorAll(".watchlist-stock-row")];
  const themes = [...new Set(rows.map(row => row.dataset.watchlistTheme).filter(Boolean))].sort();
  const themeSelect = document.getElementById("watchlistTheme");
  if (themeSelect) { themeSelect.innerHTML = `<option value="all">All themes</option>${themes.map(themeName => `<option value="${escapeHtml(themeName)}">${escapeHtml(themeName.replace(/\b\w/g, letter => letter.toUpperCase()))}</option>`).join("")}`; if (!themes.includes(watchlistTheme)) watchlistTheme = "all"; themeSelect.value = watchlistTheme; }
  setText("watchlistReadyCount", rows.filter(row => Number(row.dataset.watchlistRank) <= 1).length);
  setText("watchlistSupportCount", rows.filter(row => row.dataset.watchlistSupport === "true").length);
  setText("watchlistHighInterestCount", rows.filter(row => Number(row.dataset.watchlistInterest) === 0).length);
  renderSweetSpotAlerts(tickers);
  refreshWatchlistView();
}
function refreshWatchlistView() {
  const list = document.getElementById("watchlistItems");
  if (!list) return;
  const rows = [...list.querySelectorAll(".watchlist-stock-row")];
  rows.forEach(row => {
    const isSweet = row.dataset.watchlistSweet === "true";
    const isSupport = row.dataset.watchlistSupport === "true";
    const isEtf = row.dataset.watchlistKind === "etf";
    const isStock = row.dataset.watchlistKind === "stock";
    const isHighInterest = Number(row.dataset.watchlistInterest) >= 4;
    const isMissing = row.dataset.watchlistMissing === "true";
    const matchesFilter = watchlistFilter === "sweet" ? isSweet : watchlistFilter === "support" ? isSupport : watchlistFilter === "etf" ? isEtf : watchlistFilter === "stock" ? isStock : watchlistFilter === "high-interest" ? isHighInterest : watchlistFilter === "missing" ? isMissing : true;
    row.hidden = !matchesFilter || !(watchlistTheme === "all" || row.dataset.watchlistTheme === watchlistTheme);
  });
  rows.sort((left, right) => {
    if (watchlistSort === "interest") return Number(right.dataset.watchlistInterest) - Number(left.dataset.watchlistInterest) || Number(left.dataset.watchlistRank) - Number(right.dataset.watchlistRank) || left.dataset.watchlistTicker.localeCompare(right.dataset.watchlistTicker);
    if (watchlistSort === "ticker") return left.dataset.watchlistTicker.localeCompare(right.dataset.watchlistTicker);
    if (watchlistSort === "price") return Number(right.dataset.watchlistPrice) - Number(left.dataset.watchlistPrice) || left.dataset.watchlistTicker.localeCompare(right.dataset.watchlistTicker);
    return Number(left.dataset.watchlistRank) - Number(right.dataset.watchlistRank) || Number(left.dataset.watchlistPrice) - Number(right.dataset.watchlistPrice) || left.dataset.watchlistTicker.localeCompare(right.dataset.watchlistTicker);
  }).forEach(row => list.appendChild(row));
  const visible = rows.filter(row => !row.hidden);
  setText("watchlistCount", visible.length === rows.length ? `${visible.length} tickers` : `${visible.length} of ${rows.length} tickers`);
  document.querySelectorAll("[data-watchlist-filter]").forEach(button => { const active = button.dataset.watchlistFilter === watchlistFilter; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
  document.querySelectorAll("[data-watchlist-density]").forEach(button => { const active = button.dataset.watchlistDensity === watchlistDensity; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
  list.classList.toggle("is-detail", watchlistDensity === "detail");
  const sortSelect = document.getElementById("watchlistSort");
  if (sortSelect) sortSelect.value = watchlistSort;
}function renderSweetSpotAlerts(tickers) {
  const list = document.getElementById("watchlistSweetSpotAlerts");
  if (!list) return;
  const alerts = tickers.map(saved => {
    const baseItem = watchlistDataSource(saved.ticker);
    const item = { ...baseItem, ...saved, held: baseItem.held, inSheet: baseItem.inSheet || saved.source === "sheet" };
    const livePrice = alertPriceUsd(item);
    const price = livePrice > 0 ? livePrice : numberFrom(saved.price);
    const sweetSpot = numberFrom(saved.sweetSpot);
    if (!(price > 0 && sweetSpot > 0 && price <= sweetSpot)) return null;
    return { ticker: item.ticker, name: watchlistProfiles[item.ticker]?.name || item.name || "Watchlist idea", price, sweetSpot, distance: ((price / sweetSpot) - 1) * 100 };
  }).filter(Boolean);
  setText("watchlistSweetSpotCount", `${alerts.length} ${alerts.length === 1 ? "alert" : "alerts"}`);
  list.innerHTML = alerts.map(alert => `<div class="sweet-spot-alert"><div><strong>${alert.ticker}</strong><small>${escapeHtml(alert.name)}</small></div><div><b>${formatUsd(alert.price)}</b><small>Sweet spot ${formatUsd(alert.sweetSpot)}</small></div><span class="watchlist-opportunity positive">At sweet spot</span><em>${alert.distance.toFixed(1)}% vs sweet spot</em></div>`).join("") || `<div class="empty-inline">No watchlist prices are at or below their sweet spot right now.</div>`;
}

function renderAlerts() {
  const rows = [];
  holdings.forEach(item => {
    const r = numberFrom(item.pl);
    const signal = cleanSignal(item.signal);
    const status = targetStatus(item);
    if (/strong buy|buy|accumulate/i.test(signal)) rows.push({ title: `${item.ticker} has an active entry signal`, text: `${signal} from the Looker signal sheet. Check live market conditions before buying.`, tone: "positive" });
    if (status.gap >= 1.5) rows.push({ title: `${item.ticker} is under target`, text: `${kpis.marketMode} target is ${targetWeight(item).toFixed(1)}%, current weight is ${numberFrom(item.weight).toFixed(1)}%.`, tone: "positive" });
    if (status.gap <= -2) rows.push({ title: `${item.ticker} is over target`, text: `${kpis.marketMode} target is ${targetWeight(item).toFixed(1)}%, current weight is ${numberFrom(item.weight).toFixed(1)}%.`, tone: "caution" });
    if (r > 25) rows.push({ title: `${item.ticker} is extended`, text: `Position return is ${item.pl}. Avoid chasing and review target weight.`, tone: "caution" });
    if (r < -5) rows.push({ title: `${item.ticker} needs drawdown review`, text: `Position return is ${item.pl}. Review thesis and allocation gap.`, tone: "caution" });
  });
  document.querySelectorAll(".alert-dot").forEach(button => button.dataset.count = String(Math.min(rows.length, 9)));
  setHtml("alertsList", rows.slice(0, 5).map(row => `<div class="alert-row"><div><strong>${row.title}</strong><p>${row.text}</p></div><span class="badge ${row.tone}">${row.tone}</span></div>`).join("") || `<div class="empty">No major alerts from the latest sheet snapshot.</div>`);
  renderPriceAlerts();
}
function projectGoalSeries(startValue, monthlyDca, annualReturn, totalMonths) {
  const months = Math.max(1, Math.round(totalMonths));
  const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
  let value = numberFrom(startValue);
  const points = [{ month: 0, value }];
  for (let month = 1; month <= months; month += 1) {
    value = value * (1 + monthlyReturn) + monthlyDca;
    points.push({ month, value });
  }
  return points;
}
function goalPath(points, maxValue, width, height, padding) {
  const x = point => padding.left + (point.month / Math.max(points.at(-1).month, 1)) * (width - padding.left - padding.right);
  const y = point => padding.top + (1 - point.value / Math.max(maxValue, 1)) * (height - padding.top - padding.bottom);
  return points.map((point, index) => `${index ? "L" : "M"}${x(point).toFixed(1)} ${y(point).toFixed(1)}`).join(" ");
}
function goalMonthlyDcaRequired(startValue, targetValue, annualReturn, months) {
  if (targetValue <= startValue) return 0;
  let low = 0, high = Math.max(1000, (targetValue - startValue) / Math.max(months, 1) * 4);
  while (projectGoalSeries(startValue, high, annualReturn, months).at(-1).value < targetValue && high < 10000000) high *= 2;
  for (let index = 0; index < 48; index += 1) {
    const mid = (low + high) / 2;
    if (projectGoalSeries(startValue, mid, annualReturn, months).at(-1).value >= targetValue) high = mid;
    else low = mid;
  }
  return Math.ceil(high / 100) * 100;
}
function renderGoal() {
  const startValue = numberFrom(kpis.portfolioValue);
  const targetValue = Math.max(0, numberFrom(document.getElementById("goalTarget")?.value || 1000000));
  const monthlyDca = Math.max(0, numberFrom(document.getElementById("goalMonthlyDca")?.value || 3500));
  const annualReturn = numberFrom(document.getElementById("goalAnnualReturn")?.value || 12);
  const months = Math.max(1, Math.min(480, numberFrom(document.getElementById("goalMonths")?.value || 120)));
  const realReturn = annualReturn - GOAL_INFLATION_RATE;
  const bearReturn = realReturn - 5;
  const bullReturn = realReturn + 5;
  const bear = projectGoalSeries(startValue, monthlyDca, bearReturn, months);
  const safe = projectGoalSeries(startValue, monthlyDca, realReturn, months);
  const bull = projectGoalSeries(startValue, monthlyDca, bullReturn, months);
  const endBear = bear.at(-1).value, endSafe = safe.at(-1).value, endBull = bull.at(-1).value;
  const principal = startValue + monthlyDca * months;
  const estimatedProfit = endSafe - principal;
  const extraDcaPercent = Math.max(0, numberFrom(document.getElementById("goalExtraDca")?.value || 25));
  const returnShift = numberFrom(document.getElementById("goalReturnShift")?.value || -3);
  const boostDca = monthlyDca * (1 + extraDcaPercent / 100);
  const boostEnd = projectGoalSeries(startValue, boostDca, realReturn, months).at(-1).value;
  const stressReturn = realReturn + returnShift;
  const stressEnd = projectGoalSeries(startValue, monthlyDca, stressReturn, months).at(-1).value;
  const nominalStressReturn = annualReturn + returnShift;
  const reachMonth = targetValue > 0 ? safe.find(point => point.value >= targetValue)?.month : 0;
  const requiredMonthlyDca = targetValue > 0 ? goalMonthlyDcaRequired(startValue, targetValue, realReturn, months) : 0;
  const targetProgress = targetValue > 0 ? Math.min(100, startValue / targetValue * 100) : 0;
  setHtml("goalReturnShiftLabel", `Stress return <small>${annualReturn.toFixed(1)}% -> ${nominalStressReturn.toFixed(1)}%</small>`);
  setText("goalReturnAssumption", `${annualReturn.toFixed(1)}% nominal - ${GOAL_INFLATION_RATE.toFixed(1)}% inflation = ${realReturn.toFixed(1)}% real`);
  setHtml("goalBaseValue", `Current portfolio <strong>${formatThb(startValue)}</strong>`);
  setText("goalBearValue", shortThb(endBear));
  setText("goalSafeValue", shortThb(endSafe));
  setText("goalBullValue", shortThb(endBull));
  setText("goalPrincipalValue", formatThb(principal));
  setText("goalProfitValue", formatThb(estimatedProfit));
  setHtml("goalTargetSummary", `<div><span>Goal</span><strong>${formatThb(targetValue)}</strong><small>${targetProgress.toFixed(1)}% funded today</small></div><div><span>Safe plan</span><strong>${reachMonth != null ? monthAxisLabel(reachMonth) : "After horizon"}</strong><small>${reachMonth != null ? `Target reached in ${reachMonth} months` : `Does not reach target within ${monthAxisLabel(months)}`}</small></div><div><span>DCA needed</span><strong>${formatThb(requiredMonthlyDca)} / mo</strong><small>To reach the goal by ${monthAxisLabel(months)}</small></div>`);
  setHtml("goalWhatIf", `<div class="goal-whatif-head"><span>What-if at ${monthAxisLabel(months)}</span><small>Adjust the inputs on the left</small></div><div class="goal-whatif-grid"><div><span>Base plan</span><strong>${shortThb(endSafe)}</strong><small>${realReturn.toFixed(1)}% real return</small></div><div><span>+${extraDcaPercent.toFixed(0)}% DCA</span><strong>${shortThb(boostEnd)}</strong><small class="positive">${signedCurrencyFromThb(boostEnd - endSafe)} vs base</small></div><div><span>${annualReturn.toFixed(1)}% -> ${nominalStressReturn.toFixed(1)}%</span><strong>${shortThb(stressEnd)}</strong><small class="${stressEnd >= endSafe ? "positive" : "negative"}">${signedCurrencyFromThb(stressEnd - endSafe)} vs base</small></div></div>`);
  const svg = document.getElementById("goalChart");
  if (!svg) return;
  const width = 760, height = 340, padding = { top: 34, right: 72, bottom: 46, left: 54 };
  const maxValue = Math.max(...[...bear, ...safe, ...bull].map(point => point.value), 1);
  const yTicks = [0.33, 0.66, 1].map(ratio => maxValue * ratio);
  const markCount = Math.min(months, 5);
  const monthMarks = Array.from({ length: markCount + 1 }, (_, index) => Math.round(index * months / markCount));
  const endX = width - padding.right;
  const endY = padding.top + (1 - endSafe / maxValue) * (height - padding.top - padding.bottom);
  svg.innerHTML = `<defs><linearGradient id="goalFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity=".12"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient></defs>${yTicks.map(value => { const y = padding.top + (1 - value / maxValue) * (height - padding.top - padding.bottom); return `<path class="goal-grid" d="M${padding.left} ${y.toFixed(1)}H${width - padding.right}"/><text class="goal-axis" x="${padding.left - 10}" y="${(y + 4).toFixed(1)}">${axisThb(value)}</text>`; }).join("")}<path class="goal-fill" d="${goalPath(bull, maxValue, width, height, padding)} L${width - padding.right} ${height - padding.bottom} L${padding.left} ${height - padding.bottom}Z"/><path class="goal-line bear" d="${goalPath(bear, maxValue, width, height, padding)}"/><path class="goal-line safe" d="${goalPath(safe, maxValue, width, height, padding)}"/><path class="goal-line bull" d="${goalPath(bull, maxValue, width, height, padding)}"/>${monthMarks.map(month => { const x = padding.left + (month / months) * (width - padding.left - padding.right); return `<text class="goal-axis bottom" x="${x.toFixed(1)}" y="${height - 16}">${monthAxisLabel(month)}</text>`; }).join("")}<g class="goal-end-group" transform="translate(${endX.toFixed(1)} ${endY.toFixed(1)})"><text class="goal-end" x="-10" y="-8" text-anchor="end">${fullAmount(endSafe)}</text><circle class="goal-dot" cx="0" cy="0" r="4"/></g>`;
}
function applyLiveData(datasets) {
  const kpiRows = rowsToObjects(datasets.kpi);
  const rawSignals = rowsToObjects(datasets.signals);
  indicatorTimeframe = kpiAny(kpiRows, ["Indicator Timeframe", "RSI Timeframe", "Signal Timeframe", "Timeframe"], indicatorTimeframe) || "Daily";
  const signalRows = rawSignals.map(row => {
    const finalAction = rowAny(row, ["Final_Action", "Final Action"], "");
    const standardSignal = rowAny(row, ["Signal"], "");
    const emaSignal = rowAny(row, ["EMA_Signal", "EMA Signal"], "");
    return {
      ticker: rowAny(row, ["Ticker", "Symbol"], "N/A"),
      totalTrend: rowAny(row, ["Total_Trend", "Total Trend", "Trend", "EMA_Trend", "EMA Trend", "Price_vs_EMA", "Price vs EMA"], ""),
      signal: cleanSignal(finalAction || standardSignal || emaSignal || "HOLD"),
      signalSource: finalAction ? "Final_Action" : standardSignal ? "Signal" : emaSignal ? "EMA_Signal" : "Fallback",
      rsi7: numberFrom(rowAny(row, ["RSI 7", "RSI7", "RSI_7", "RSI7_Value"], 0)),
      rsi14: numberFrom(rowAny(row, ["RSI 14", "RSI14", "RSI_14", "RSI14_Value"], 0)),
      priority: numberFrom(rowAny(row, ["Priority", "Rank"], 99)),
      smartDcaUsd: numberFrom(rowAny(row, ["Smart DCA $", "Smart_DCA_USD", "Smart DCA USD", "Smart_DCA"], 0)),
      currentPriceUsd: numberFrom(rowAny(row, ["Current_Price_USD", "Current Price USD", "Price", "Close"], 0)),
      dayChangePercent: percentText(rowAny(row, ["Day_Change_Percent", "Day Change Percent", "Day Change %", "Change %"], "0.00%"))
    };
  }).filter(item => item.ticker && item.ticker !== "N/A");
  signalUniverse = signalRows;
  sheetWatchlistRows = parseWatchlistSheet(datasets.watchlist || []);
  const signalMap = new Map(signalRows.map(item => [String(item.ticker).toUpperCase(), item]));

  kpis = {
    ...kpis,
    portfolioValue: moneyText(kpiValue(kpiRows, "Portfolio Value THB", kpis.portfolioValue)),
    invested: moneyText(kpiAny(kpiRows, ["Current Cost Basis THB", "Total Invested THB"], kpis.invested)),
    profit: moneyText(kpiAny(kpiRows, ["Unrealized Profit THB", "Total Profit THB"], kpis.profit)),
    totalReturn: percentText(kpiAny(kpiRows, ["Dashboard ROI (Cost Basis) %", "ROI (Cost Basis) %", "Total Return %"], kpis.totalReturn)),
    irr: percentText(kpiValue(kpiRows, "IRR", kpis.irr)),
    volatility: percentText(kpiAny(kpiRows, ["Volatility (Daily)", "Daily Volatility", "Volatility"], kpis.volatility)),
    sharpe: kpiAny(kpiRows, ["Sharpe Ratio", "Sharpe"], kpis.sharpe),
    maxDrawdown: percentText(kpiAny(kpiRows, ["Max Drawdown", "Maximum Drawdown"], kpis.maxDrawdown)),
    benchmarkSpy: kpiAny(kpiRows, ["vs S&P500", "SPY", "S&P500"], ""),
    benchmarkQqq: kpiAny(kpiRows, ["vs NASDAQ", "QQQ", "NASDAQ"], ""),
    vix: kpiAny(kpiRows, "VIX", kpis.vix),
    greedFear: kpiAny(kpiRows, ["Greed & Fear", "Fear & Greed", "Fear Greed"], kpis.greedFear),
    sp500Trend: kpiAny(kpiRows, ["S&P500 Trend", "S&P 500 Trend", "SP500 Trend"], kpis.sp500Trend),
    marketBreadth: percentText(kpiAny(kpiRows, ["Market Breadth", "Breadth"], kpis.marketBreadth)),
    bondYield: percentText(kpiAny(kpiRows, ["10Y Bond Yield", "10Y Yield", "Bond Yield"], kpis.bondYield)),
    dailyProfit: moneyText(kpiValue(kpiRows, "Daily Profit THB", kpis.dailyProfit)),
    dailyChange: percentText(kpiValue(kpiRows, "Daily Change %", kpis.dailyChange)),
    marketMode: kpiValue(kpiRows, "Market Mode", kpis.marketMode)
  };

  performanceVerified = /^verified$/i.test(kpiValue(kpiRows, "Performance Data Status", ""));
  benchmarkCompare = performanceVerified ? parseBenchmarkCompare(datasets.compare || [], kpis.totalReturn) : { portfolio: 0, spyReturn: 0, spyVsPort: 0, qqqReturn: 0, qqqVsPort: 0 };
  if (!performanceVerified) benchmarkComparisonMode = "cashflow";
  parseCashflowBenchmark(datasets.cashflowCompare || []);

  holdings = rowsToObjects(datasets.holdings).map(row => ({
    ticker: row.Ticker || "N/A",
    layer: normalizeLayer(row.Ticker, row.Asset_Layer),
    shares: rowAny(row, ["Total_Shares", "Total Shares", "Shares"], "0"),
    price: `$${rowAny(row, ["Current_Price_USD", "Current Price USD", "Price"], "0.00")}`,
    avgCostUsd: numberFrom(rowAny(row, ["Avg_Cost_USD", "Avg Cost USD", "Average Cost USD"], 0)),
    currentPriceUsd: numberFrom(rowAny(row, ["Current_Price_USD", "Current Price USD", "Price"], 0)),
    valueUsd: numberFrom(rowAny(row, ["Market_Value_USD", "Market Value USD"], 0)),
    costBasisUsd: numberFrom(rowAny(row, ["Cost_Basis_USD", "Cost Basis USD"], 0)),
    dayChangePercent: percentText(rowAny(row, ["Day_Change_Percent", "Day Change Percent", "Day Change %"], "0.00%")),
    dayChangeUsd: numberFrom(rowAny(row, ["Day_Change_Total_USD", "Day Change Total USD", "Day Gain Loss USD"], 0)),
    periodReturns: holdingPeriodReturnsFromRow(row),
    value: numberFrom(row.Market_Value_THB),
    valueText: moneyText(row.Market_Value_THB),
    pl: percentText(row.PL_Percent),
    weight: numberFrom(row.Weight),
    targetA: numberFrom(rowAny(row, ["Target_A", "Target A", "Target Weight A"], 0)),
    targetB: numberFrom(rowAny(row, ["Target_B", "Target B", "Target Weight B"], 0)),
    targetWeight: numberFrom(rowAny(row, ["Target_Weight", "Target Weight", "Target"], 0)),
    signal: cleanSignal(row.Signal),
    signalSource: row.Signal ? "Looker_Holdings" : "Fallback",
    rsi7: numberFrom(rowAny(row, ["RSI 7", "RSI7", "RSI_7"], 0)),
    rsi14: numberFrom(rowAny(row, ["RSI 14", "RSI14", "RSI_14"], 0)),
    priority: numberFrom(rowAny(row, ["Priority", "Rank"], 99)),
    smartDcaUsd: numberFrom(rowAny(row, ["Smart DCA $", "Smart_DCA_USD", "Smart DCA USD", "Smart_DCA"], 0))
  })).filter(item => item.ticker && item.ticker !== "N/A").map(item => {
    const signal = signalMap.get(String(item.ticker).toUpperCase());
    return signal ? { ...item, signal: cleanSignal(signal.signal || item.signal), signalSource: signal.signalSource || item.signalSource, rsi7: signal.rsi7 || item.rsi7, rsi14: signal.rsi14 || item.rsi14, priority: signal.priority || item.priority, smartDcaUsd: signal.smartDcaUsd || item.smartDcaUsd, totalTrend: signal.totalTrend } : item;
  });

  signalBoard = holdings.filter(item => item.ticker !== "CASH");
  const cash = holdings.find(item => item.ticker === "CASH");
  if (cash) {
    kpis.cash = cash.valueText;
    kpis.cashWeight = `${cash.weight.toFixed(2)}%`;
  }
  navRows = rowsToObjects(datasets.nav).map(row => [row.Date, numberFrom(row.Daily_Invested_THB), numberFrom(row.Cumulative_NAV_THB), numberFrom(row.Daily_Change_Percent) / 100, numberFrom(row.Drawdown_Percent) / 100]).filter(row => row[2] > 0);
  benchmarkRows = rowsToObjects(datasets.benchmark || []).map(row => [row.Date, numberFrom(row.Close)]).filter(row => row[1] > 0);
  benchmarkQqqRows = rowsToObjects(datasets.qqq || []).map(row => [row.Date, numberFrom(row.Close)]).filter(row => row[1] > 0);
  actualPortfolioReturns = rowsToObjects(datasets.actualReturns || []).map(row => ({ period: String(row.Period || ""), interval: String(row.Interval || "").toLowerCase(), portfolioReturn: numberFrom(row.Portfolio_Return_Percent), portfolioPnl: numberFrom(row.Portfolio_PnL_USD), spyReturn: numberFrom(row.SPY_Return_Percent) })).filter(row => row.period && row.interval);
  // The comparison table is the source of truth: it uses the shared Mar 17 baseline.
  // CSV returns remain available for the weekly and monthly bars only.
  monthly = buildMonthlyPurchases(rowsToObjects(datasets.trades), navRows, rowsToObjects(datasets.monthly));
}
function enrichHoldingsFromSheet(rows) {
  const source = rowsToObjects(rows);
  const meta = new Map(source.map(row => [String(row.Ticker || "").toUpperCase(), row]));
  holdings = holdings.map(item => {
    const row = meta.get(String(item.ticker || "").toUpperCase());
    if (!row) return item;
    return {
      ...item,
      avgCostUsd: numberFrom(row.Avg_Cost_USD),
      currentPriceUsd: numberFrom(row.Current_Price_USD),
      valueUsd: numberFrom(row.Market_Value_USD),
      costBasisUsd: numberFrom(row.Cost_Basis_USD),
      dayChangePercent: percentText(rowAny(row, ["Day_Change_Percent", "Day Change Percent", "Day Change %"], item.dayChangePercent || "0.00%")),
      dayChangeUsd: numberFrom(rowAny(row, ["Day_Change_Total_USD", "Day Change Total USD", "Day Gain Loss USD"], item.dayChangeUsd || 0)),
      periodReturns: holdingPeriodReturnsFromRow(row),
      targetA: numberFrom(rowAny(row, ["Target_A", "Target A", "Target Weight A"], item.targetA || 0)),
      targetB: numberFrom(rowAny(row, ["Target_B", "Target B", "Target Weight B"], item.targetB || 0)),
      targetWeight: numberFrom(rowAny(row, ["Target_Weight", "Target Weight", "Target"], item.targetWeight || 0))
    };
  });
}
function renderAll() { renderKpis(); renderSparklines(); renderNavChart(); renderAllocation(); renderBenchmarkCharts(); renderDriftChart(); renderMonthly(); renderHoldings(activeFilter); renderMobileSummary(); renderSignals(); renderSmartDca(); renderHealth(); renderAlerts(); renderInterestWatchlist(); renderGoal(); }
async function loadLiveData() {
  if (liveDataLoading) return;
  liveDataLoading = true;
  document.body.classList.add("is-loading");
  const syncBanner = document.getElementById("syncBanner");
  if (syncBanner) syncBanner.dataset.state = "loading";
  setText("sideSync", "Loading");
  setText("marketOpenLabel", "Sheet Loading");
  setText("updatedAt", "Refreshing portfolio data");
  setText("syncStatusText", "Loading live sheet data...");
  setText("portfolioSyncMeta", "Portfolio data");
  setText("signalSyncMeta", "Signals");
  setText("navSyncMeta", "NAV + Trade Log");
  setText("freshnessMeta", "Checking freshness");
  const retryButton = document.getElementById("syncRetryButton");
  if (retryButton) retryButton.hidden = true;
  let sheetState = {};
  try {
    const sheetEntries = [
      ["kpi", DATA_SHEETS.kpi],
      ["holdings", DATA_SHEETS.holdings],
      ["nav", DATA_SHEETS.nav],
      ["monthly", DATA_SHEETS.monthly],
      ["trades", DATA_SHEETS.trades],
      ["signals", DATA_SHEETS.signals],
      ["watchlist", DATA_SHEETS.watchlist],
      ["benchmark", DATA_SHEETS.benchmark],
      ["qqq", DATA_SHEETS.qqq],
      ["compare", DATA_SHEETS.compare],
      ["actualReturns", DATA_SHEETS.actualReturns],
      ["cashflowCompare", DATA_SHEETS.cashflowCompare]
    ];
    const results = await Promise.allSettled(sheetEntries.map(([, sheet]) => fetchSheet(sheet)));
    sheetState = Object.fromEntries(sheetEntries.map(([key], index) => [key, results[index].status === "fulfilled" ? "live" : "unavailable"]));
    const coreReady = ["kpi", "holdings", "nav", "monthly"].every(key => sheetState[key] === "live");
    const datasets = Object.fromEntries(sheetEntries.map(([key], index) => [key, results[index].status === "fulfilled" ? results[index].value : [["Ticker", "Signal", "RSI7", "RSI14"]]]));
    const liveWatchlist = parseWatchlistSheet(datasets.watchlist || []);
    if (liveWatchlist.length) {
      sheetWatchlistRows = liveWatchlist;
      renderInterestWatchlist();
    }
    applyLiveData(datasets);
    enrichHoldingsFromSheet(datasets.holdings);
    renderAll();
    updateSyncIntegrityUi();
    const now = new Date();
    const freshness = dataFreshness(now);
    const signalsLive = sheetState.signals === "live";
    const syncPartial = !coreReady || !signalsLive;
    updateFreshnessUi(freshness);
    setText("updatedAt", freshness.label);
    setText("syncStatusText", syncPartial ? "Sheet synced with partial tabs; showing all available live data" : freshness.stale ? "Sheet synced; market data may be stale" : "Live sheet sync complete");
    setText("portfolioSyncMeta", "Portfolio live");
    setText("signalSyncMeta", signalsLive ? "Signals live" : "Signals unavailable | fallback active");
    setText("navSyncMeta", `NAV live | Trades ${sheetState.trades === "live" ? "live" : "fallback"}`);
    setText("sideSync", freshness.stale ? "Stale" : syncPartial ? "Partial" : "Live");
    setText("marketOpenLabel", freshness.stale ? "Sheet Stale" : syncPartial ? "Sheet Partial" : "Sheet Live");
    if (syncBanner) syncBanner.dataset.state = syncPartial ? "partial" : freshness.stale ? "stale" : "live";
    if (retryButton) retryButton.hidden = !syncPartial && !freshness.stale;
    const meter = document.getElementById("syncMeter");
    if (meter) meter.style.width = syncPartial ? "76%" : "100%";
  } catch (error) {
    console.warn(error);
    const statusText = key => sheetState[key] === "live" ? "live" : "unavailable";
    const anyLive = Object.values(sheetState).includes("live");
    const freshness = dataFreshness(new Date(), "Checked");
    updateFreshnessUi(freshness);
    setText("updatedAt", "Using saved data. Check sheet publish access.");
    setText("sideSync", anyLive ? "Partial" : "Saved");
    setText("marketOpenLabel", anyLive ? "Sheet Partial" : "Saved Data");
    if (syncBanner) syncBanner.dataset.state = anyLive ? "partial" : "saved";
    setText("syncStatusText", anyLive ? "Sync incomplete. Showing the last complete snapshot." : "Live sync unavailable. Showing saved data.");
    setText("portfolioSyncMeta", `KPI ${statusText("kpi")} | Holdings ${statusText("holdings")}`);
    setText("signalSyncMeta", `Signals ${statusText("signals")}`);
    setText("navSyncMeta", `NAV ${statusText("nav")} | Trade Log ${statusText("trades")}`);
    if (retryButton) retryButton.hidden = false;
    renderAll();
    updateSyncIntegrityUi();
  } finally {
    lastLiveSyncMs = Date.now();
    liveDataLoading = false;
    document.body.classList.remove("is-loading");
  }
}
function startLiveAutoRefresh() {
  window.setInterval(() => { if (!document.hidden) loadLiveData(); }, LIVE_REFRESH_MS);
  const refreshIfNeeded = () => {
    if (!document.hidden && Date.now() - lastLiveSyncMs >= LIVE_REFRESH_MS / 2) loadLiveData();
  };
  document.addEventListener("visibilitychange", refreshIfNeeded);
  window.addEventListener("focus", refreshIfNeeded);
}
function setActiveNavigation(target) {
  document.querySelectorAll("[data-jump]").forEach(item => item.classList.toggle("active", item.dataset.jump === target));
}
function scrollToSection(target, behavior) {
  const element = target === "alerts" ? document.querySelector(".alerts-card") : document.getElementById(target);
  if (!element) return;
  const topbar = document.querySelector(".topbar")?.getBoundingClientRect().height || 78;
  const offset = topbar + 16;
  const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);
  window.scrollTo({ top, behavior });
}
function setAppView(view, target = "overview", smooth = true) {
  const nextView = view === "portfolio" ? "portfolio" : "overview";
  document.body.dataset.view = nextView;
  setActiveNavigation(nextView === "portfolio" ? "portfolio" : target);
  const behavior = smooth ? "smooth" : "auto";
  window.requestAnimationFrame(() => {
    if (nextView === "portfolio" || target === "overview") window.scrollTo({ top: 0, behavior });
    else scrollToSection(target, behavior);
  });
}
function jumpToAlerts() { const card = document.querySelector(".alerts-card"); setAppView("overview", "alerts"); if (card) { card.classList.add("flash-focus"); window.setTimeout(() => card.classList.remove("flash-focus"), 1200); } }
function bindInteractions() {
  const search = document.getElementById("holdingSearch");
  document.querySelector(".holdings-card thead")?.addEventListener("click", event => {
    const button = event.target.closest("[data-sort]");
    if (!button) return;
    const key = button.dataset.sort;
    holdingsSort = { key, direction: holdingsSort.key === key && holdingsSort.direction === "desc" ? "asc" : "desc" };
    document.querySelectorAll("[data-sort]").forEach(item => item.classList.toggle("active", item === button));
    renderHoldings(activeFilter, search?.value || "");
  });
  document.getElementById("assetTabs")?.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    document.querySelectorAll("#assetTabs button").forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    renderHoldings(button.dataset.filter || "All", search?.value || "");
  });
  document.querySelectorAll("[data-holdings-period]").forEach(button => button.addEventListener("click", () => { if (button.disabled) return; holdingsPerformancePeriod = button.dataset.holdingsPeriod || "all"; renderHoldings(activeFilter, search?.value || ""); }));
  document.querySelectorAll("[data-benchmark-toggle]").forEach(button => button.addEventListener("click", () => { const key = button.dataset.benchmarkToggle; benchmarkVisible[key] = !benchmarkVisible[key]; renderBenchmarkCharts(); }));
  document.querySelectorAll("[data-benchmark-mode]").forEach(button => button.addEventListener("click", () => { benchmarkComparisonMode = button.dataset.benchmarkMode === "cashflow" ? "cashflow" : "twr"; renderBenchmarkCharts(); }));
  document.querySelectorAll("[data-benchmark-range]").forEach(button => button.addEventListener("click", () => { benchmarkRangePeriod = button.dataset.benchmarkRange || "ALL"; renderBenchmarkCharts(); }));
  document.getElementById("benchmarkPlanStart")?.addEventListener("change", event => { const value = event.target.value; if (!validSheetDate(value)) return; benchmarkPlanStart = value; benchmarkRangePeriod = "PLAN"; renderBenchmarkCharts(); });
  document.querySelector(".benchmark-return-tabs")?.addEventListener("click", event => {
    const button = event.target.closest("[data-benchmark-period]");
    if (!button) return;
    benchmarkReturnPeriod = button.dataset.benchmarkPeriod || "daily";
    document.querySelectorAll("[data-benchmark-period]").forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });
    renderBenchmarkCharts();
  });
  document.querySelector(".period-tabs")?.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    performancePeriod = button.dataset.period || button.textContent.trim() || "YTD";
    document.querySelectorAll(".period-tabs button").forEach(tab => { const selected = tab === button; tab.classList.toggle("active", selected); tab.setAttribute("aria-pressed", String(selected)); });
    renderNavChart();
  });
  document.getElementById("allocationView")?.addEventListener("change", event => {
    allocationMode = event.target.value;
    renderAllocation();
  });
  search?.addEventListener("input", () => renderHoldings(activeFilter, search.value));
  document.getElementById("refreshButton")?.addEventListener("click", loadLiveData);
  document.getElementById("syncRetryButton")?.addEventListener("click", loadLiveData);
  document.getElementById("notificationButton")?.addEventListener("click", jumpToAlerts);
  document.getElementById("themeToggle")?.addEventListener("click", () => setTheme(document.body.dataset.theme === "light" ? "dark" : "light"));
  document.getElementById("currencyToggle")?.addEventListener("click", () => setCurrencyMode(currencyMode === "THB" ? "USD" : "THB"));
  document.getElementById("dcaBudgetInput")?.addEventListener("input", renderSmartDca);
  ["goalTarget", "goalMonthlyDca", "goalAnnualReturn", "goalMonths", "goalExtraDca", "goalReturnShift"].forEach(id => document.getElementById(id)?.addEventListener("input", renderGoal));
  document.getElementById("priceAlertForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const ticker = document.getElementById("priceAlertTicker")?.value;
    const direction = document.getElementById("priceAlertDirection")?.value === "above" ? "above" : "below";
    const target = numberFrom(document.getElementById("priceAlertTarget")?.value);
    if (!ticker || target <= 0) return;
    const alerts = readPriceAlerts();
    alerts.push({ id: `${ticker}-${Date.now()}`, ticker, direction, target });
    savePriceAlerts(alerts);
    document.getElementById("priceAlertTarget").value = "";
    renderPriceAlerts();
  });
  document.getElementById("priceAlertList")?.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-price-alert]");
    if (!button) return;
    savePriceAlerts(readPriceAlerts().filter(alert => alert.id !== button.dataset.removePriceAlert));
    renderPriceAlerts();
  });
  document.getElementById("watchlistForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const tickerInput = document.getElementById("watchlistTicker");
    const reasonInput = document.getElementById("watchlistReason");
    const priceInput = document.getElementById("watchlistPrice");
    const lowInput = document.getElementById("watchlistLow52");
    const highInput = document.getElementById("watchlistHigh52");
    const targetInput = document.getElementById("watchlistTarget");
    const sweetSpotInput = document.getElementById("watchlistSweetSpot");
    const supportInput = document.getElementById("watchlistNearestSupport");
    const noteInput = document.getElementById("watchlistNote");
    const ticker = normalizeTickerInput(tickerInput?.value);
    if (!ticker) return;
    const items = readInterestWatchlist().filter(item => item.ticker !== ticker);
    items.unshift({ ticker, reason: reasonInput?.value || "Watching", price: numberFrom(priceInput?.value), low52: numberFrom(lowInput?.value), high52: numberFrom(highInput?.value), target: numberFrom(targetInput?.value), sweetSpot: numberFrom(sweetSpotInput?.value), nearestSupport: numberFrom(supportInput?.value), note: noteInput?.value || "", addedAt: Date.now() });
    saveInterestWatchlist(items);
    if (tickerInput) tickerInput.value = "";
    renderInterestWatchlist();
  });
  document.getElementById("watchlistFilterTabs")?.addEventListener("click", event => {
    const button = event.target.closest("[data-watchlist-filter]");
    if (!button) return;
    watchlistFilter = button.dataset.watchlistFilter || "all";
    refreshWatchlistView();
  });
  document.getElementById("watchlistSort")?.addEventListener("change", event => { watchlistSort = event.target.value || "interest"; refreshWatchlistView(); });
  document.getElementById("watchlistTheme")?.addEventListener("change", event => { watchlistTheme = event.target.value || "all"; refreshWatchlistView(); });
  document.querySelectorAll("[data-watchlist-density]").forEach(button => button.addEventListener("click", () => { watchlistDensity = button.dataset.watchlistDensity || "compact"; refreshWatchlistView(); }));
  document.getElementById("watchlistItems")?.addEventListener("click", event => {
    const starButton = event.target.closest("[data-watchlist-star]");
    if (starButton) {
      const ticker = normalizeTickerInput(starButton.dataset.watchlistStarTicker);
      const interest = Math.max(1, Math.min(5, Math.round(numberFrom(starButton.dataset.watchlistStar))));
      const items = readInterestWatchlist().map(item => item.ticker === ticker ? { ...item, interest } : item);
      saveInterestWatchlist(items);
      renderInterestWatchlist();
      return;
    }
    const detailsButton = event.target.closest("[data-watchlist-details]");
    if (detailsButton) { const row = detailsButton.closest(".watchlist-stock-row"); const expanded = row?.classList.toggle("is-expanded"); detailsButton.setAttribute("aria-expanded", String(expanded)); detailsButton.textContent = expanded ? "Hide details" : "Details"; return; }
    const button = event.target.closest("[data-remove-watch]");
    if (!button) return;
    saveInterestWatchlist(readInterestWatchlist().filter(item => item.ticker !== button.dataset.removeWatch));
    renderInterestWatchlist();
  });
  document.getElementById("watchlistSuggestions")?.addEventListener("click", event => {
    const button = event.target.closest("[data-add-watch]");
    if (!button) return;
    const ticker = normalizeTickerInput(button.dataset.addWatch);
    const items = readInterestWatchlist().filter(item => item.ticker !== ticker);
    items.unshift({ ticker, reason: "From signal sheet", addedAt: Date.now() });
    saveInterestWatchlist(items);
    renderInterestWatchlist();
  });
  document.getElementById("useCashButton")?.addEventListener("click", () => {
    const input = document.getElementById("dcaBudgetInput");
    if (!input) return;
    input.value = `$${(numberFrom(kpis.cash) / fxRate()).toFixed(2)}`;
    renderSmartDca();
  });
  document.querySelectorAll("[data-page]").forEach(button => button.addEventListener("click", () => {
    const page = button.dataset.page;
    const routes = {
      goal: "./goal.html",
      history: "./history.html?v=20260829-watchlist-page",
      watchlist: "./watchlist.html",
       dca: "./dca.html"
    };
    window.location.href = routes[page] || "./index.html";
  }));
  document.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", () => {
    const target = button.dataset.jump || "overview";
    if (document.body.classList.contains("goal-page") || document.body.classList.contains("dca-page")) {
      window.location.href = target === "overview" ? "./index.html" : `./index.html#${target}`;
      return;
    }
    setAppView(target === "portfolio" ? "portfolio" : "overview", target);
  }));
}
function setTheme(theme) { document.body.dataset.theme = theme; try { localStorage.setItem("portfolioTheme", theme); } catch (error) { console.warn(error); } }
function initTheme() { try { setTheme(localStorage.getItem("portfolioTheme") || "dark"); } catch (error) { setTheme("dark"); } }

initTheme();
initCurrency();
renderAll();
bindInteractions();
if (document.body.classList.contains("dca-page")) {
  setActiveNavigation("dca");
} else if (!document.body.classList.contains("goal-page")) {
  const initialTarget = ["portfolio", "analysis", "dca", "alerts"].includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "overview";
  setAppView(initialTarget === "portfolio" ? "portfolio" : "overview", initialTarget, false);
}
loadLiveData();
startLiveAutoRefresh();
