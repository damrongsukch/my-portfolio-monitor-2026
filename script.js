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
  { ticker: "SPMO", layer: "Core", shares: "0.1112111", price: "$143.81", value: 515.03, valueText: "THB 515.03", pl: "26.53%", weight: 9.70, signal: "STRONG BUY" },
  { ticker: "NVDA", layer: "Growth", shares: "0.1634117", price: "$215.22", value: 1132.56, valueText: "THB 1,132.56", pl: "14.97%", weight: 21.32, signal: "HOLD" },
  { ticker: "GOOGL", layer: "Growth", shares: "0.0317128", price: "$400.71", value: 409.22, valueText: "THB 409.22", pl: "37.08%", weight: 7.70, signal: "STRONG BUY" },
  { ticker: "MSFT", layer: "Growth", shares: "0", price: "$407.77", value: 0, valueText: "THB 0.00", pl: "0.00%", weight: 0, signal: "BUY DIP" },
  { ticker: "AVGO", layer: "Growth", shares: "0", price: "$419.30", value: 0, valueText: "THB 0.00", pl: "0.00%", weight: 0, signal: "ACCUMULATE" },
  { ticker: "PLTR", layer: "Growth", shares: "0.1481048", price: "$137.80", value: 657.23, valueText: "THB 657.23", pl: "-3.74%", weight: 12.37, signal: "HOLD" },
  { ticker: "TSM", layer: "Growth", shares: "0.0414339", price: "$411.68", value: 549.30, valueText: "THB 549.30", pl: "18.29%", weight: 10.34, signal: "BUY" },
  { ticker: "QQQI", layer: "Income", shares: "0.2030812", price: "$56.50", value: 369.50, valueText: "THB 369.50", pl: "7.94%", weight: 6.96, signal: "HOLD" },
  { ticker: "IAUI", layer: "Income", shares: "0.2208413", price: "$57.23", value: 407.01, valueText: "THB 407.01", pl: "1.35%", weight: 7.66, signal: "HOLD" },
  { ticker: "RKLB", layer: "Growth", shares: "0.1307652", price: "$105.55", value: 444.47, valueText: "THB 444.47", pl: "44.54%", weight: 8.37, signal: "HOLD" }
];

let signalBoard = holdings.map((item, index) => ({
  ...item,
  rsi7: item.ticker === "MSFT" ? 36.9 : item.ticker === "AVGO" ? 48.3 : item.ticker === "IAUI" ? 68.7 : index < 2 ? 78 : index < 5 ? 48 : 56,
  rsi14: item.ticker === "MSFT" ? 48.2 : item.ticker === "AVGO" ? 51.4 : item.ticker === "IAUI" ? 60.3 : index < 2 ? 71 : index < 5 ? 44 : 58,
  priority: index + 1,
  smartDcaUsd: item.ticker === "MSFT" ? 11.88 : item.ticker === "AVGO" ? 15.53 : item.ticker === "IAUI" ? 7.3 : item.smartDcaUsd || 0
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
const DATA_SHEETS = { kpi: "Looker_KPI", holdings: "Looker_Holdings", nav: "Looker_NAV", monthly: "Looker_Monthly", trades: "Trade_Log", signals: "Looker_Signals", watchlist: "Watchlist" };
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
let indicatorTimeframe = "Daily";
let liveDataLoading = false;
let lastLiveSyncMs = 0;
let signalUniverse = [];
let sheetWatchlistRows = [];

const logoDomains = { VOO: "vanguard.com", SPMO: "invesco.com", VXUS: "vanguard.com", SCHD: "schwab.com", NVDA: "nvidia.com", GOOGL: "google.com", META: "meta.com", MSFT: "microsoft.com", AVGO: "broadcom.com", TSM: "tsmc.com", LLY: "lilly.com", PLTR: "palantir.com", QQQI: "neosfunds.com", IAUI: "neosfunds.com", MLPI: "neosfunds.com", RKLB: "rocketlabusa.com" };
const logoUrls = { VOO: "./assets/logos/vanguard.svg", SPMO: "./assets/logos/spmo.png", VXUS: "./assets/logos/vanguard.svg", SCHD: "./assets/logos/schd.svg", NVDA: "https://cdn.simpleicons.org/nvidia/76B900", GOOGL: "./assets/logos/google.svg", META: "https://cdn.simpleicons.org/meta/0866FF", AVGO: "https://cdn.simpleicons.org/broadcom/CC092F", TSM: "./assets/logos/tsmc.png", LLY: "./assets/logos/lly.svg", PLTR: "https://cdn.simpleicons.org/palantir/FFFFFF", QQQI: "./assets/logos/neos.jpg", IAUI: "./assets/logos/neos.jpg", MLPI: "./assets/logos/neos.jpg", RKLB: "./assets/logos/rklb.jpg" };
const watchlistLogoUrls = { GLDM: "./assets/logos/watchlist/gldm.gif", MLPI: "./assets/logos/neos.jpg", MSFT: "./assets/logos/watchlist/msft.ico", AVGO: "./assets/logos/watchlist/avgo.png", META: "./assets/logos/watchlist/meta.ico", PLTR: "./assets/logos/watchlist/pltr.ico", RKLB: "./assets/logos/watchlist/rklb.ico", AMD: "./assets/logos/watchlist/amd.png", SPCX: "./assets/logos/watchlist/spcx.png", QDTE: "./assets/logos/watchlist/roundhill.svg", SPYI: "./assets/logos/neos.jpg", DIVO: "./assets/logos/watchlist/divo.png", IWMI: "./assets/logos/neos.jpg", NIHI: "./assets/logos/neos.jpg", MLPD: "./assets/logos/watchlist/mlpd.ico", ROCQ: "./assets/logos/watchlist/jpmorgan.svg", O: "./assets/logos/watchlist/o.png", DRAM: "./assets/logos/watchlist/roundhill.svg" };
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
  AMD: { name: "Advanced Micro Devices", type: "US stock", theme: "Semiconductors" }
};

function numberFrom(value) { const cleaned = String(value ?? "").replace(/[^0-9.-]/g, ""); const parsed = Number(cleaned); return Number.isFinite(parsed) ? parsed : 0; }
function moneyText(value) { const text = String(value || "").trim(); return text ? text.replace("\u0e3f", "THB ").replace("\u00e0\u00b8\u00bf", "THB ") : "THB 0.00"; }
function percentText(value) { return String(value || "").trim() || "0.00%"; }
function decimalText(value, digits = 2) { return numberFrom(value).toFixed(digits); }
function plusText(value, formatter) { const text = formatter(value); return text.startsWith("-") || text.startsWith("+") ? text : `+${text}`; }
function cleanSignal(value) { return String(value || "HOLD").replace(/[^\w\s().%/-]+/g, "").trim() || "HOLD"; }
function rowsToObjects(rows) { const [headers, ...body] = rows; return body.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]))); }
function kpiValue(rows, metric, fallback = "") { const found = rows.find(row => row.Metric === metric); return found && found.Value ? found.Value : fallback; }
function kpiAny(rows, metrics, fallback = "") { const names = (Array.isArray(metrics) ? metrics : [metrics]).map(name => String(name).toLowerCase()); const found = rows.find(row => names.some(name => String(row.Metric || "").toLowerCase().includes(name))); return found && found.Value ? found.Value : fallback; }
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
function assetKind(ticker) { const symbol = String(ticker || "").toUpperCase(); return watchlistProfiles[symbol]?.type || (/VOO|SPMO|VXUS|SCHD|QQQI|IAUI|MLPI|GLDM/i.test(symbol) ? "ETF" : "US stock"); }
function activeTargetKey() { return /MODE\s*B|MODE_B|\bB\b/i.test(kpis.marketMode) ? "targetB" : "targetA"; }
function targetWeight(item) { const preferred = numberFrom(item[activeTargetKey()]); const fallback = numberFrom(item.targetWeight); return preferred || fallback || 0; }
function targetGap(item) { const target = targetWeight(item); return target ? target - numberFrom(item.weight) : 0; }
function targetStatus(item) {
  const target = targetWeight(item);
  if (!target) return { label: "Set target", tone: "neutral", gap: 0 };
  const gap = targetGap(item);
  if (gap >= 1) return { label: "Underweight", tone: "positive", gap };
  if (gap <= -1) return { label: "Overweight", tone: "caution", gap };
  return { label: "On target", tone: "neutral", gap };
}
function targetCell(item) {
  const target = targetWeight(item);
  const status = targetStatus(item);
  if (!target) return `<span class="target-cell neutral"><strong>Set target</strong><small>${kpis.marketMode}</small></span>`;
  const sign = status.gap > 0 ? "+" : "";
  return `<span class="target-cell ${status.tone}"><strong>${target.toFixed(1)}%</strong><small>${status.label} ${sign}${status.gap.toFixed(1)}%</small></span>`;
}
function targetMeter(item, className = "holding-target") {
  const target = targetWeight(item);
  const weight = numberFrom(item.weight);
  const status = targetStatus(item);
  const fill = target ? Math.max(4, Math.min(100, (weight / target) * 100)) : 0;
  const targetLabel = target ? `${target.toFixed(1)}%` : "Set";
  return `<span class="${className} ${status.tone}" style="--target-fill:${fill.toFixed(0)}%"><strong>${weight.toFixed(1)} <small>/ ${targetLabel}</small></strong><i><b></b></i><em>Target ${targetLabel}</em></span>`;
}
function indicatorTrend(item) { return cleanSignal(item.totalTrend || item.signal || "Trend n/a"); }
function rsiTone(value) {
  const rsi = numberFrom(value);
  if (!Number.isFinite(rsi) || rsi <= 0) return "neutral";
  if (rsi > 70) return "overbought";
  if (rsi < 30) return "oversold";
  if (rsi < 50) return "watch";
  return "neutral";
}
function rsiValue(value) {
  const rsi = numberFrom(value);
  return `<span class="rsi-value ${rsiTone(rsi)}">${rsi.toFixed(1)}</span>`;
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
function renderKpis() { const profit = signedCurrencyFromThb(kpis.profit), totalReturn = plusText(kpis.totalReturn, percentText), dailyProfit = signedCurrencyFromThb(kpis.dailyProfit), dailyChange = plusText(kpis.dailyChange, percentText); setText("portfolioValue", formatCurrencyFromThb(kpis.portfolioValue)); setText("investedValue", formatCurrencyFromThb(kpis.invested)); setText("profitLabel", `${profit} (${totalReturn})`); setText("dailyProfitLabel", dailyProfit); setText("dailyChangeLabel", dailyChange); setText("performanceNumber", totalReturn); setText("irrLabel", percentText(kpis.irr)); setText("volatilityLabel", percentText(kpis.volatility)); setText("sharpeLabel", decimalText(kpis.sharpe)); setText("drawdownLabel", percentText(kpis.maxDrawdown)); setText("spyBenchmark", plusText(kpis.benchmarkSpy, percentText)); setText("qqqBenchmark", plusText(kpis.benchmarkQqq, percentText)); setText("cashValue", `Cash ${formatCurrencyFromThb(kpis.cash)}`); setText("tableTotalValue", formatCurrencyFromThb(kpis.portfolioValue)); setText("tableDayProfit", dailyProfit); setText("tableDayChange", dailyChange); setSignedTone("tableDayReturn", kpis.dailyChange); setText("tableTotalProfit", profit); setText("tableTotalReturn", totalReturn); setSignedTone("tableTotalGain", kpis.totalReturn); setText("tableMode", kpis.marketMode); setText("sideMode", kpis.marketMode); setText("sideModeHint", kpis.marketMode.includes("A") ? "Risk on" : "Risk control"); ["profitLabel", "dailyProfitLabel", "dailyChangeLabel", "performanceNumber", "spyBenchmark", "qqqBenchmark", "drawdownLabel"].forEach(id => { const el = document.getElementById(id); if (el) setSignedTone(id, el.textContent); }); }
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
  const displayReturn = periodReturnText();
  setText("performanceNumber", displayReturn);
  setText("performanceInvestedLabel", "Invested capital");
  setText("performanceRangeLabel", `${periodRangeText(rows)} | Cost basis ${formatCurrencyFromThb(kpis.invested)}`);
  setSignedTone("performanceNumber", displayReturn);
  svg.innerHTML = `<defs><linearGradient id="navGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#25e05d" stop-opacity=".22"/><stop offset="1" stop-color="#25e05d" stop-opacity="0"/></linearGradient></defs>${yAxis}<path class="area-fill" d="${area}"/><path class="invested-line" d="${pathFromPoints(investedPoints)}"/><path class="nav-line" d="${pathFromPoints(navPoints)}"/><circle cx="${navPoints.at(-1)[0]}" cy="${navPoints.at(-1)[1]}" r="5" fill="#25e05d" stroke="#071017" stroke-width="3"/><text class="axis-text" x="${padding.left}" y="${height - 14}">${performancePeriod}</text><text class="axis-text" text-anchor="end" x="${width - padding.right}" y="${height - 14}">${formatCurrencyFromThb(end)}</text>`;
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
  const width = 760;
  const height = Math.max(230, rows.length * 26 + 46);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const padding = { top: 28, right: 112, bottom: 28, left: 108 };
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
    return `<g class="drift-row ${tone}"><text class="drift-label" x="${padding.left - 12}" y="${(y + 4).toFixed(1)}" text-anchor="end">${row.item.ticker}</text><rect class="drift-bar" x="${barX.toFixed(1)}" y="${(y - 7).toFixed(1)}" width="${barW.toFixed(1)}" height="14" rx="7"/><circle class="drift-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/><text class="drift-value" x="${width - padding.right + 14}" y="${(y - 2).toFixed(1)}">${row.gap > 0 ? "+" : ""}${row.gap.toFixed(1)}%</text><text class="drift-sub" x="${width - padding.right + 14}" y="${(y + 12).toFixed(1)}"><tspan class="drift-status">${status}</tspan><tspan class="drift-ratio"> · ${row.weight.toFixed(1)}/${row.target.toFixed(1)}%</tspan></text></g>`;
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
function renderHoldings(filter = activeFilter, query = document.getElementById("holdingSearch")?.value || "") {
  activeFilter = filter || "All";
  const search = String(query || "").trim().toLowerCase();
  const rows = holdings.filter(item => {
    const layer = layerClass(item.layer);
    const matchesLayer = activeFilter === "All" || layer === activeFilter;
    const matchesSearch = !search || `${item.ticker} ${item.layer} ${item.signal}`.toLowerCase().includes(search);
    return matchesLayer && matchesSearch && item.ticker !== "CASH";
  }).sort(compareHoldings);
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
  if (/WAIT|HOLD|REDUCE|SELL|NO BUY|AVOID/.test(signal)) return { multiplier: 0, source: item.signalSource || "Signal" };
  const explicit = signal.match(/(?:^|\s)(1(?:\.0+)?|0?\.(?:25|5|50|75))\s*X\b/i);
  if (explicit) return { multiplier: Math.min(1, numberFrom(explicit[1])), source: item.signalSource || "Final_Action" };
  if (/STARTER/.test(signal)) return { multiplier: 0.25, source: "Signal fallback" };
  if (/SUPER BUY|STRONG BUY|BUY DIP|GOOD PRICE/.test(signal)) return { multiplier: 1, source: "Signal fallback" };
  if (/ACCUMULATE/.test(signal)) return { multiplier: 0.5, source: "Signal fallback" };
  if (/BUY|BULLISH|FOLLOW/.test(signal)) return { multiplier: 0.25, source: "Signal fallback" };
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
  if (!best) return;
  const gap = targetGap(best);
  const signal = cleanSignal(best.signal);
  setText("todaySignal", budgetUsd > 0 ? "Sizing Ready" : `${best.ticker} ${best.multiplier}x`);
  setHtml("todaySignalText", `<span class="signal-summary">${signal}</span><span class="signal-chips"><b>${best.ticker}</b><b>${best.multiplier.toFixed(2)}x</b><b>Score ${best.rankScore.toFixed(0)}</b><b>RSI ${rsiPair(best)}</b><b>${gap > 0 ? `Under +${gap.toFixed(1)}%` : gap < 0 ? `Over ${Math.abs(gap).toFixed(1)}%` : "On target"}</b></span>${dcaReasonMarkup(best)}`);
}
function renderSmartDca() {
  const input = document.getElementById("dcaBudgetInput");
  const budget = parseBudgetInput(input?.value || "");
  const plan = buildDcaPlan(budget.usd);
  const rows = budget.usd > 0 ? plan.picks.filter(item => item.amountUsd > 0) : plan.picks;
  const ruleNote = `<span class="dca-rule-note">Signal order: Final_Action first, then Signal, then EMA_Signal. Ranking uses target gap, priority and RSI.</span>`;
  setHtml("dcaBudgetSummary", budget.usd > 0
    ? `${ruleNote}<span class="dca-summary-title">Final_Action sizing: allocate ${formatUsd(plan.usedUsd)} from ${formatUsd(budget.usd)} and keep ${formatUsd(plan.leftoverUsd)} in cash.</span><span class="dca-figures"><b>Budget ${formatUsd(budget.usd)}</b><b>Allocate ${formatUsd(plan.usedUsd)}</b><b>Cash left ${formatUsd(plan.leftoverUsd)}</b><b>Min ${formatUsd(MIN_ORDER_USD)}</b></span>`
    : `${ruleNote}<span class="dca-empty-hint">Enter USD. Sizing follows explicit BUY 0.25x / 0.50x / 0.75x / 1.00x from the sheet when available.</span>`);
  setHtml("smartDcaList", rows.map((item, index) => `<div class="mini-row dca-plan-row"><span>${index + 1}. <strong>${item.ticker}</strong><small class="dca-action-line">${cleanSignal(item.signal)} <b>Score ${item.rankScore.toFixed(0)}</b></small>${dcaReasonMarkup(item)}${item.belowMin ? `<small class="dca-minimum-warning">Below DIME minimum</small>` : ""}</span><strong>${budget.usd > 0 ? formatUsd(item.amountUsd) : `${item.multiplier.toFixed(2)}x`}<small>${item.multiplier.toFixed(2)}x weight</small></strong></div>`).join("") || `<div class="empty">No eligible Final_Action today. Keep cash.</div>`);
  renderTodaySignal(rows[0], budget.usd);
}
function holdingValueUsd(item) { const direct = numberFrom(item.valueUsd); return direct > 0 ? direct : numberFrom(item.value) / Math.max(fxRate(), 1); }
function buildRebalancePlan(budgetUsd) {
  const budget = Math.max(0, numberFrom(budgetUsd));
  const eligible = holdings.filter(item => item.ticker && item.ticker !== "CASH" && targetWeight(item) > 0);
  const totalValue = eligible.reduce((sum, item) => sum + holdingValueUsd(item), 0);
  const targets = eligible.map(item => ({ ...item, currentUsd: holdingValueUsd(item), deficitUsd: Math.max(0, (totalValue + budget) * targetWeight(item) / 100 - holdingValueUsd(item)) })).filter(item => item.deficitUsd > .01);
  const totalDeficit = targets.reduce((sum, item) => sum + item.deficitUsd, 0);
  const picks = targets.map(item => ({ ...item, amountUsd: totalDeficit ? Math.min(item.deficitUsd, budget * item.deficitUsd / totalDeficit) : 0 })).filter(item => item.amountUsd > .01).sort((a, b) => b.amountUsd - a.amountUsd);
  const allocated = picks.reduce((sum, item) => sum + item.amountUsd, 0);
  return { budget, totalDeficit, picks, allocated, cash: Math.max(0, budget - allocated) };
}
function renderRebalancePlanner() {
  const input = document.getElementById("rebalanceBudgetInput");
  const budget = numberFrom(input?.value || 0);
  const plan = buildRebalancePlan(budget);
  setHtml("rebalanceSummary", budget > 0
    ? `MODE target: allocate <strong>${formatUsd(plan.allocated)}</strong> of ${formatUsd(plan.budget)} to reduce underweight positions. No sell orders are suggested.`
    : `Enter a USD budget to see purchases that move the portfolio toward ${kpis.marketMode} targets.`);
  setHtml("rebalanceList", plan.picks.slice(0, 4).map(item => `<div class="rebalance-row"><span><strong>${item.ticker}</strong><small>${targetStatus(item).label} ${Math.max(0, targetGap(item)).toFixed(1)}% · target ${targetWeight(item).toFixed(1)}%</small></span><strong>${formatUsd(item.amountUsd)}<small>${(item.amountUsd / Math.max(plan.budget, 1) * 100).toFixed(0)}% of budget</small></strong></div>`).join("") || `<div class="empty">No underweight target positions available for this budget.</div>`);
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
  if (hotRsi) actions.push({ tone: "warning", title: `${hotRsi.item.ticker} RSI is hot`, detail: `RSI7 ${numberFrom(hotRsi.item.rsi7).toFixed(1)} / RSI14 ${numberFrom(hotRsi.item.rsi14).toFixed(1)}. Consider smaller sizing.` });
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
  select.innerHTML = priced.map(item => `<option value="${item.ticker}">${item.ticker} · &#36;${alertPriceUsd(item).toFixed(2)}</option>`).join("");
  if (priced.some(item => item.ticker === previousTicker)) select.value = previousTicker;
  const alerts = readPriceAlerts().filter(alert => priced.some(item => item.ticker === alert.ticker));
  if (!alerts.length && priced.length) { const seeded = defaultPriceAlerts(); savePriceAlerts(seeded); return renderPriceAlerts(); }
  list.innerHTML = alerts.map(alert => {
    const item = priced.find(row => row.ticker === alert.ticker);
    const current = alertPriceUsd(item);
    const triggered = alert.direction === "below" ? current <= alert.target : current >= alert.target;
    return `<div class="price-alert-row ${triggered ? "triggered" : "ready"}"><span><strong>${alert.ticker}</strong><small>&#36;${current.toFixed(2)} now · ${alert.direction} &#36;${Number(alert.target).toFixed(2)}</small></span><b>${triggered ? "Triggered" : "Watching"}</b><button type="button" data-remove-price-alert="${alert.id}" aria-label="Remove ${alert.ticker} price alert" title="Remove alert">×</button></div>`;
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
  if (sheetWatchlistRows.length) return sheetWatchlistRows.map(item => ({ ...item, ticker: normalizeTickerInput(item.ticker) })).filter(item => item.ticker);
  return defaultWatchlistTickers().map(ticker => ({ ticker, reason: signalUniverse.some(item => String(item.ticker).toUpperCase() === ticker) ? "From signal sheet" : "Starter watchlist", source: "local" }));
}
function saveInterestWatchlist(items) {
  const unique = [];
  const seen = new Set();
  items.forEach(item => {
    const ticker = normalizeTickerInput(item.ticker);
    if (!ticker || seen.has(ticker)) return;
    seen.add(ticker);
    unique.push({ ticker, reason: item.reason || "Watching", price: numberFrom(item.price), low52: numberFrom(item.low52), high52: numberFrom(item.high52), target: numberFrom(item.target), sweetSpot: numberFrom(item.sweetSpot), nearestSupport: numberFrom(item.nearestSupport), note: String(item.note || "").trim().slice(0, 120), addedAt: item.addedAt || Date.now() });
  });
  try { localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(unique)); } catch (error) { console.warn(error); }
}
function defaultWatchlistTickers() {
  const held = new Set(holdings.filter(item => numberFrom(item.shares) > 0 || numberFrom(item.value) > 0).map(item => String(item.ticker).toUpperCase()));
  const candidates = signalUniverse.filter(item => item.ticker && !held.has(String(item.ticker).toUpperCase()))
    .sort((a, b) => (numberFrom(a.priority) || 99) - (numberFrom(b.priority) || 99))
    .map(item => String(item.ticker).toUpperCase());
  const fallback = ["MSFT", "AVGO", "META", "PLTR", "RKLB"].filter(ticker => !held.has(ticker));
  return [...new Set(candidates.length ? candidates : fallback)].slice(0, 6);
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
function renderInterestWatchlist() {
  const list = document.getElementById("watchlistItems");
  if (!list) return;
  const tickers = readInterestWatchlist();
  const options = document.getElementById("watchlistTickerOptions");
  const knownTickers = [...new Set([...signalUniverse, ...holdings].map(item => normalizeTickerInput(item.ticker)).filter(Boolean))].sort();
  if (options) options.innerHTML = knownTickers.map(ticker => `<option value="${ticker}"></option>`).join("");
  setText("watchlistCount", `${tickers.length} tickers`);
  setText("watchlistStatus", tickers.length ? `${tickers.length} interested stocks` : "Add stocks you want to follow");
  list.innerHTML = tickers.map(saved => {
    const baseItem = watchlistDataSource(saved.ticker);
    const item = { ...baseItem, ...saved, held: baseItem.held, inSheet: baseItem.inSheet || saved.source === "sheet" };
    const sheetPrice = alertPriceUsd(item);
    const manualPrice = numberFrom(saved.price);
    const price = sheetPrice > 0 ? sheetPrice : manualPrice;
    const day = numberFrom(item.dayChangePercent);
    const signal = cleanSignal(item.signal || "No sheet signal");
    const trend = indicatorTrend(item);
    const hasRsi = numberFrom(item.rsi7) > 0 || numberFrom(item.rsi14) > 0;
    const hasSheetData = !!item.signal || price > 0 || hasRsi;
    const savedReason = saved.reason === "From signal sheet" && !hasSheetData ? "Starter watchlist" : saved.reason;
    const profile = watchlistProfiles[item.ticker] || {};
    const name = profile.name || item.name || "Research idea";
    const theme = profile.theme || item.layer || "Watchlist";
    const priceText = price > 0 ? formatUsd(price) : "Lookup ready";
    const dayText = price > 0 ? `${plusText(day, percentText)} today` : "Open links for live quote";
    const savedTarget = numberFrom(saved.target);
    const low52 = numberFrom(saved.low52);
    const high52 = numberFrom(saved.high52);
    const sweetSpot = numberFrom(saved.sweetSpot);
    const nearestSupport = numberFrom(saved.nearestSupport);
    const rangePos = watchlistRangePosition(price, low52, high52);
    const opportunityData = watchlistOpportunity(price, savedTarget, sweetSpot, low52, high52);
    const opportunity = `<span class="watchlist-opportunity ${opportunityData.tone}">${opportunityData.label}</span>`;
    const details = [["Price", price > 0 ? formatUsd(price) : "Not set"], ["52W low/high", low52 > 0 && high52 > 0 ? `${formatUsd(low52)} / ${formatUsd(high52)}` : "Not set"], ["Target price", savedTarget > 0 ? formatUsd(savedTarget) : "Not set"], ["Nearest support (20D)", nearestSupport > 0 ? formatUsd(nearestSupport) : "Not set"], ["Sweet spot", sweetSpot > 0 ? formatUsd(sweetSpot) : "Not set"]].map(([label, value]) => `<span><small>${label}</small><b>${value}</b></span>`).join("");
    const footer = `<div class="watchlist-row-actions">${opportunity}<div class="watchlist-link-row">${watchlistLinksHtml(item.ticker)}</div></div>`;
    return `<article class="watchlist-stock-row ${signedClass(day)}"><div class="watchlist-stock-main">${tickerLogo(item.ticker)}<span><strong>${item.ticker}<b class="watchlist-type-chip">${assetKind(item.ticker)}</b></strong><small>${name}</small><em>${item.held ? "Already in portfolio" : savedReason || "Watching"} &middot; ${theme}</em></span></div><div class="watchlist-stock-body"><div class="watchlist-stock-meta"><span><b>${priceText}</b><small>${dayText}</small></span><span><b>${signal}</b><small>${trend}</small></span><span class="watchlist-rsi-meta"><small>RSI 7 / 14 (${indicatorTimeframe})</small><b>${hasRsi ? `${rsiValue(item.rsi7)}<span class="rsi-separator">/</span>${rsiValue(item.rsi14)}` : "n/a"}</b></span></div><div class="watchlist-detail-grid">${details}</div>${saved.note ? `<div class="watchlist-note">${escapeHtml(saved.note)}</div>` : ""}${rangePos != null ? `<div class="watchlist-range" style="--watch-range:${rangePos.toFixed(0)}%"><span><b></b></span><small>52W range ${rangePos.toFixed(0)}%</small></div>` : ""}${footer}</div></article>`;
  }).join("") || `<div class="empty">Add tickers you are interested in. If the ticker exists in Looker_Signals or holdings, live data will show here.</div>`;
  const suggestions = document.getElementById("watchlistSuggestions");
  if (suggestions) suggestions.innerHTML = watchlistSignalCandidates().map(item => `<button type="button" data-add-watch="${item.ticker}">${item.ticker}<small>${cleanSignal(item.signal)}</small></button>`).join("") || `<span class="empty-inline">No new signal candidates outside the current portfolio.</span>`;
  renderSweetSpotAlerts(tickers);
}
function renderSweetSpotAlerts(tickers) {
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
function renderGoal() {
  const startValue = numberFrom(kpis.portfolioValue);
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
  setHtml("goalReturnShiftLabel", `Stress return <small>${annualReturn.toFixed(1)}% -> ${nominalStressReturn.toFixed(1)}%</small>`);
  setHtml("goalBaseValue", `Current portfolio <strong>${formatThb(startValue)}</strong>`);
  setText("goalBearValue", shortThb(endBear));
  setText("goalSafeValue", shortThb(endSafe));
  setText("goalBullValue", shortThb(endBull));
  setText("goalPrincipalValue", formatThb(principal));
  setText("goalProfitValue", formatThb(estimatedProfit));
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
    invested: moneyText(kpiValue(kpiRows, "Total Invested THB", kpis.invested)),
    profit: moneyText(kpiValue(kpiRows, "Total Profit THB", kpis.profit)),
    totalReturn: percentText(kpiValue(kpiRows, "Total Return %", kpis.totalReturn)),
    irr: percentText(kpiValue(kpiRows, "IRR", kpis.irr)),
    volatility: percentText(kpiAny(kpiRows, ["Volatility (Daily)", "Daily Volatility", "Volatility"], kpis.volatility)),
    sharpe: kpiAny(kpiRows, ["Sharpe Ratio", "Sharpe"], kpis.sharpe),
    maxDrawdown: percentText(kpiAny(kpiRows, ["Max Drawdown", "Maximum Drawdown"], kpis.maxDrawdown)),
    benchmarkSpy: percentText(kpiAny(kpiRows, ["vs S&P500", "SPY", "S&P500"], kpis.benchmarkSpy)),
    benchmarkQqq: percentText(kpiAny(kpiRows, ["vs NASDAQ", "QQQ", "NASDAQ"], kpis.benchmarkQqq)),
    vix: kpiAny(kpiRows, "VIX", kpis.vix),
    greedFear: kpiAny(kpiRows, ["Greed & Fear", "Fear & Greed", "Fear Greed"], kpis.greedFear),
    sp500Trend: kpiAny(kpiRows, ["S&P500 Trend", "S&P 500 Trend", "SP500 Trend"], kpis.sp500Trend),
    marketBreadth: percentText(kpiAny(kpiRows, ["Market Breadth", "Breadth"], kpis.marketBreadth)),
    bondYield: percentText(kpiAny(kpiRows, ["10Y Bond Yield", "10Y Yield", "Bond Yield"], kpis.bondYield)),
    dailyProfit: moneyText(kpiValue(kpiRows, "Daily Profit THB", kpis.dailyProfit)),
    dailyChange: percentText(kpiValue(kpiRows, "Daily Change %", kpis.dailyChange)),
    marketMode: kpiValue(kpiRows, "Market Mode", kpis.marketMode)
  };

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
      targetA: numberFrom(rowAny(row, ["Target_A", "Target A", "Target Weight A"], item.targetA || 0)),
      targetB: numberFrom(rowAny(row, ["Target_B", "Target B", "Target Weight B"], item.targetB || 0)),
      targetWeight: numberFrom(rowAny(row, ["Target_Weight", "Target Weight", "Target"], item.targetWeight || 0))
    };
  });
}
function renderAll() { renderKpis(); renderSparklines(); renderNavChart(); renderAllocation(); renderDriftChart(); renderMonthly(); renderHoldings(activeFilter); renderMobileSummary(); renderSignals(); renderSmartDca(); renderRebalancePlanner(); renderHealth(); renderAlerts(); renderInterestWatchlist(); renderGoal(); }
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
      ["watchlist", DATA_SHEETS.watchlist]
    ];
    const results = await Promise.allSettled(sheetEntries.map(([, sheet]) => fetchSheet(sheet)));
    sheetState = Object.fromEntries(sheetEntries.map(([key], index) => [key, results[index].status === "fulfilled" ? "live" : "unavailable"]));
    const coreReady = ["kpi", "holdings", "nav", "monthly"].every(key => sheetState[key] === "live");
    if (!coreReady) {
      const missing = ["kpi", "holdings", "nav", "monthly"].filter(key => sheetState[key] !== "live");
      throw new Error(`Incomplete sheet sync: ${missing.join(", ")}`);
    }
    const datasets = Object.fromEntries(sheetEntries.map(([key], index) => [key, results[index].status === "fulfilled" ? results[index].value : [["Ticker", "Signal", "RSI7", "RSI14"]]]));
    applyLiveData(datasets);
    enrichHoldingsFromSheet(datasets.holdings);
    renderAll();
    updateSyncIntegrityUi();
    const now = new Date();
    const freshness = dataFreshness(now);
    const signalsLive = sheetState.signals === "live";
    updateFreshnessUi(freshness);
    setText("updatedAt", freshness.label);
    setText("syncStatusText", !signalsLive ? "Portfolio synced, signals unavailable" : freshness.stale ? "Sheet synced; market data may be stale" : "Live sheet sync complete");
    setText("portfolioSyncMeta", "Portfolio live");
    setText("signalSyncMeta", signalsLive ? "Signals live" : "Signals unavailable | fallback active");
    setText("navSyncMeta", `NAV live | Trades ${sheetState.trades === "live" ? "live" : "fallback"}`);
    setText("sideSync", freshness.stale ? "Stale" : signalsLive ? "Live" : "Partial");
    setText("marketOpenLabel", freshness.stale ? "Sheet Stale" : signalsLive ? "Sheet Live" : "Sheet Partial");
    if (syncBanner) syncBanner.dataset.state = !signalsLive ? "partial" : freshness.stale ? "stale" : "live";
    if (retryButton) retryButton.hidden = signalsLive && !freshness.stale;
    const meter = document.getElementById("syncMeter");
    if (meter) meter.style.width = signalsLive ? "100%" : "76%";
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
  document.getElementById("rebalanceBudgetInput")?.addEventListener("input", renderRebalancePlanner);
  ["goalMonthlyDca", "goalAnnualReturn", "goalMonths", "goalExtraDca", "goalReturnShift"].forEach(id => document.getElementById(id)?.addEventListener("input", renderGoal));
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
  document.getElementById("watchlistItems")?.addEventListener("click", event => {
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
      watchlist: "./watchlist.html"
    };
    window.location.href = routes[page] || "./index.html";
  }));
  document.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", () => {
    const target = button.dataset.jump || "overview";
    if (document.body.classList.contains("goal-page")) {
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
if (!document.body.classList.contains("goal-page")) {
  const initialTarget = ["portfolio", "analysis", "dca", "alerts"].includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "overview";
  setAppView(initialTarget === "portfolio" ? "portfolio" : "overview", initialTarget, false);
}
loadLiveData();
startLiveAutoRefresh();
