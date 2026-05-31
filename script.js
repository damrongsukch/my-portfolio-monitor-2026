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
  { ticker: "RKLB", layer: "Alpha", shares: "0.1307652", price: "$105.55", value: 444.47, valueText: "THB 444.47", pl: "44.54%", weight: 8.37, signal: "HOLD" }
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
  { label: "Mar '26", value: 869.76 },
  { label: "Apr '26", value: 3044.47 },
  { label: "May '26", value: 4896.87 }
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
const DATA_SHEETS = { kpi: "Looker_KPI", holdings: "Looker_Holdings", nav: "Looker_NAV", monthly: "Looker_Monthly", signals: "Looker_Signals" };
const colors = ["#25e05d", "#f6c21a", "#4aa3ff", "#ff5148", "#b57cff", "#13b981", "#94a3b8", "#38bdf8", "#fb7185", "#a3e635", "#f97316", "#22d3ee", "#e879f9", "#facc15", "#60a5fa", "#34d399"];
const MIN_ORDER_USD = 1.5;
const GOAL_INFLATION_RATE = 3;
let allocationMode = "sector";
let activeFilter = "All";
let performancePeriod = "YTD";
let currencyMode = "THB";
let holdingsSort = { key: "preferred", direction: "asc" };
let indicatorTimeframe = "Daily";

const logoDomains = { SPMO: "invesco.com", SCHD: "schwabassetmanagement.com", NVDA: "nvidia.com", GOOGL: "google.com", META: "meta.com", MSFT: "microsoft.com", AVGO: "broadcom.com", TSM: "tsmc.com", LLY: "lilly.com", PLTR: "palantir.com", QQQI: "neosfunds.com", IAUI: "ishares.com", MLPI: "neosfunds.com", RKLB: "rocketlabusa.com" };
const preferredHoldingOrder = ["SPMO", "SCHD", "NVDA", "GOOGL", "META", "AVGO", "TSM", "LLY", "PLTR", "QQQI", "IAUI", "MLPI", "RKLB"];
const preferredHoldingRank = new Map(preferredHoldingOrder.map((ticker, index) => [ticker, index]));

function numberFrom(value) { const cleaned = String(value ?? "").replace(/[^0-9.-]/g, ""); const parsed = Number(cleaned); return Number.isFinite(parsed) ? parsed : 0; }
function moneyText(value) { const text = String(value || "").trim(); return text ? text.replace("\u0e3f", "THB ").replace("\u00e0\u00b8\u00bf", "THB ") : "THB 0.00"; }
function percentText(value) { return String(value || "").trim() || "0.00%"; }
function decimalText(value, digits = 2) { return numberFrom(value).toFixed(digits); }
function plusText(value, formatter) { const text = formatter(value); return text.startsWith("-") || text.startsWith("+") ? text : `+${text}`; }
function cleanSignal(value) { return String(value || "HOLD").replace(/[^\w\s()%/-]+/g, "").trim() || "HOLD"; }
function rowsToObjects(rows) { const [headers, ...body] = rows; return body.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]))); }
function kpiValue(rows, metric, fallback = "") { const found = rows.find(row => row.Metric === metric); return found && found.Value ? found.Value : fallback; }
function kpiAny(rows, metrics, fallback = "") { const names = (Array.isArray(metrics) ? metrics : [metrics]).map(name => String(name).toLowerCase()); const found = rows.find(row => names.some(name => String(row.Metric || "").toLowerCase().includes(name))); return found && found.Value ? found.Value : fallback; }
function rowAny(row, names, fallback = "") { for (const key of (Array.isArray(names) ? names : [names])) if (row[key] != null && row[key] !== "") return row[key]; const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ""), value])); for (const key of (Array.isArray(names) ? names : [names])) { const found = normalized[String(key).toLowerCase().replace(/[^a-z0-9]/g, "")]; if (found != null && found !== "") return found; } return fallback; }
function signedClass(value) { const text = String(value || "").trim(); return text.startsWith("-") || numberFrom(text) < 0 ? "negative" : "positive"; }
function normalizeLayer(ticker, layer) { if (String(ticker || "").toUpperCase() === "QQQI") return "Income"; return layerClass(layer); }
function layerClass(layer) { const clean = String(layer || "").split("/")[0].trim().toLowerCase(); if (clean === "growth") return "Growth"; if (clean === "safe" || clean === "income" || clean === "defensive income") return "Income"; if (clean === "alpha") return "Alpha"; return "Core"; }
function tickerLogo(ticker) { const symbol = String(ticker || "").trim().toUpperCase(); const fallback = symbol.slice(0, 2) || "--"; const domain = logoDomains[symbol]; if (!domain) return `<i class="ticker-logo">${fallback}</i>`; const url = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`; return `<i class="ticker-logo has-logo" style="overflow:hidden;flex:0 0 auto"><img src="${url}" alt="${symbol} logo" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;background:#fff" onerror="this.parentElement.classList.remove('has-logo');this.parentElement.textContent='${fallback}'"></i>`; }
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
function setHtml(id, value) { const el = document.getElementById(id); if (el) el.innerHTML = value; }
function formatCurrencyFromThb(valueThb) { const amount = numberFrom(valueThb); if (currencyMode === "USD") return `$${(amount / fxRate()).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; return formatThb(amount); }
function signedCurrencyFromThb(valueThb) { const amount = numberFrom(valueThb); const sign = amount < 0 ? "-" : "+"; const absolute = Math.abs(amount); const text = currencyMode === "USD" ? `$${(absolute / fxRate()).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : formatThb(absolute); return `${sign}${text}`; }
function formatCurrencyFromUsd(valueUsd) { const amount = numberFrom(valueUsd); if (currencyMode === "USD") return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; return formatThb(amount * fxRate()); }
function holdingGainThb(item) { const pct = numberFrom(item.pl) / 100; if (Number.isFinite(numberFrom(item.costBasisUsd)) && numberFrom(item.costBasisUsd) > 0) return (numberFrom(item.valueUsd) - numberFrom(item.costBasisUsd)) * fxRate(); return pct > -0.99 ? numberFrom(item.value) - (numberFrom(item.value) / (1 + pct)) : 0; }
function assetKind(ticker) { return /SPMO|SCHD|QQQI|IAUI|MLPI/i.test(ticker) ? "ETF" : "US stock"; }
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
function indicatorTrend(item) { return cleanSignal(item.totalTrend || item.signal || "Trend n/a"); }
function indicatorCell(item) { return `<span class="indicator-cell compact"><strong>${numberFrom(item.rsi7).toFixed(1)} / ${numberFrom(item.rsi14).toFixed(1)}</strong></span>`; }
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
function renderSparklines() { const nav = navRows.map(row => row[2]).filter(value => value > 0); document.querySelectorAll("[data-spark]").forEach(svg => drawSparkline(svg, nav)); }
function renderKpis() { const profit = signedCurrencyFromThb(kpis.profit), totalReturn = plusText(kpis.totalReturn, percentText), dailyProfit = signedCurrencyFromThb(kpis.dailyProfit), dailyChange = plusText(kpis.dailyChange, percentText); setText("portfolioValue", formatCurrencyFromThb(kpis.portfolioValue)); setText("investedValue", formatCurrencyFromThb(kpis.invested)); setText("profitLabel", `${profit} (${totalReturn})`); setText("dailyProfitLabel", dailyProfit); setText("dailyChangeLabel", dailyChange); setText("performanceNumber", totalReturn); setText("irrLabel", percentText(kpis.irr)); setText("volatilityLabel", percentText(kpis.volatility)); setText("sharpeLabel", decimalText(kpis.sharpe)); setText("drawdownLabel", percentText(kpis.maxDrawdown)); setText("spyBenchmark", plusText(kpis.benchmarkSpy, percentText)); setText("qqqBenchmark", plusText(kpis.benchmarkQqq, percentText)); setText("cashValue", `Cash ${formatCurrencyFromThb(kpis.cash)}`); setText("tableTotalValue", formatCurrencyFromThb(kpis.portfolioValue)); setText("tableTotalReturn", totalReturn); setText("tableMode", kpis.marketMode); setText("sideMode", kpis.marketMode); setText("sideModeHint", kpis.marketMode.includes("A") ? "Risk on" : "Risk control"); ["profitLabel", "dailyProfitLabel", "dailyChangeLabel", "spyBenchmark", "qqqBenchmark", "drawdownLabel"].forEach(id => { const el = document.getElementById(id); if (el) el.className = signedClass(el.textContent); }); }
function navDateMs(row) { const date = sheetDate(row[0]); return Number.isNaN(date.getTime()) ? 0 : date.getTime(); }
function filteredNavRows() { const rows = navRows.filter(row => row[2] > 0).sort((a, b) => navDateMs(a) - navDateMs(b)); if (rows.length < 2 || performancePeriod === "ALL") return rows; const last = navDateMs(rows.at(-1)); const days = performancePeriod === "6M" ? 183 : performancePeriod === "1Y" ? 365 : null; if (days) return rows.filter(row => navDateMs(row) >= last - days * 86400000); const year = new Date(last || Date.now()).getFullYear(); return rows.filter(row => new Date(navDateMs(row)).getFullYear() === year); }
function renderNavChart() { const svg = document.getElementById("navChart"); if (!svg) return; const width = 740, height = 300, padding = { top: 20, right: 24, bottom: 44, left: 58 }; const rows = filteredNavRows(); if (rows.length < 2) return; const cumulativeInvested = []; rows.reduce((sum, row, index) => cumulativeInvested[index] = sum + numberFrom(row[1]), 0); const values = rows.map(row => numberFrom(row[2])); const maxForScale = Math.max(...values, ...cumulativeInvested, 1); const scaleY = value => padding.top + (1 - (value / maxForScale)) * (height - padding.top - padding.bottom); const scaleX = index => padding.left + (index / (rows.length - 1)) * (width - padding.left - padding.right); const navPoints = rows.map((row, index) => [scaleX(index), scaleY(numberFrom(row[2]))]); const investedPoints = cumulativeInvested.map((value, index) => [scaleX(index), scaleY(value)]); const area = `${pathFromPoints(navPoints)} L${navPoints.at(-1)[0]} ${height - padding.bottom} L${navPoints[0][0]} ${height - padding.bottom} Z`; const end = numberFrom(rows.at(-1)[2]); const displayReturn = plusText(kpis.totalReturn, percentText); setText("performanceNumber", displayReturn); svg.innerHTML = `<defs><linearGradient id="navGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#25e05d" stop-opacity=".22"/><stop offset="1" stop-color="#25e05d" stop-opacity="0"/></linearGradient></defs><path class="area-fill" d="${area}"/><path class="invested-line" d="${pathFromPoints(investedPoints)}"/><path class="nav-line" d="${pathFromPoints(navPoints)}"/><circle cx="${navPoints.at(-1)[0]}" cy="${navPoints.at(-1)[1]}" r="5" fill="#25e05d" stroke="#071017" stroke-width="3"/><text class="axis-text" x="${padding.left}" y="${height - 14}">${performancePeriod}</text><text class="axis-text" x="${width - 150}" y="${height - 14}">${formatCurrencyFromThb(end)}</text>`; }
function polarToCartesian(cx, cy, radius, angle) { const radians = (angle - 90) * Math.PI / 180; return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) }; }
function donutSegment(cx, cy, radius, innerRadius, startAngle, endAngle) { const start = polarToCartesian(cx, cy, radius, endAngle), end = polarToCartesian(cx, cy, radius, startAngle), innerStart = polarToCartesian(cx, cy, innerRadius, endAngle), innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle), largeArc = endAngle - startAngle <= 180 ? 0 : 1; return [`M ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`, `L ${innerEnd.x} ${innerEnd.y}`, `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`, "Z"].join(" "); }
function allocationEntries() { if (allocationMode === "asset") { const entries = holdings.filter(item => item.value > 0 && item.ticker !== "CASH").sort((a, b) => b.value - a.value).map(item => [item.ticker, item.value]); if (entries.length <= 10) return entries; const top = entries.slice(0, 10); const others = entries.slice(10).reduce((sum, [, value]) => sum + value, 0); return others > 0 ? [...top, ["Others", others]] : top; } const grouped = holdings.reduce((acc, item) => { if (item.value > 0 && item.ticker !== "CASH") acc[layerClass(item.layer)] = (acc[layerClass(item.layer)] || 0) + item.value; return acc; }, {}); return Object.entries(grouped).filter(([, value]) => value > 0); }
function allocationLabelSvg(name, percent, point) {
  const label = String(name || "");
  const x = point.x.toFixed(1), y = point.y.toFixed(1);
  return `<text class="allocation-label" x="${x}" y="${y}"><tspan x="${x}" dy="0">${label}</tspan><tspan x="${x}" dy="13">${percent.toFixed(1)}%</tspan></text>`;
}
function renderAllocation() {
  const entries = allocationEntries();
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (!total) return;
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
    const labelRadius = allocationMode === "asset" ? 132 : 128;
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
function buildMonthlyContributions(nav, monthlyRows) {
  const grouped = new Map();
  nav.forEach(row => {
    const date = sheetDate(row[0]);
    if (Number.isNaN(date.getTime())) return;
    const invested = numberFrom(row[1]);
    grouped.set(monthKey(date), (grouped.get(monthKey(date)) || 0) + invested);
  });
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
function renderMonthly() { const svg = document.getElementById("monthlyChart"); if (!svg || !monthly.length) return; const width = 760, height = 320, padding = { top: 38, right: 24, bottom: 58, left: 24 }, max = Math.max(...monthly.map(item => item.value), 1), plotH = height - padding.top - padding.bottom, gap = (width - padding.left - padding.right) / monthly.length, barW = Math.min(34, gap * .5); svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.innerHTML = monthly.map((item, index) => { const x = padding.left + index * gap + gap / 2 - barW / 2, h = item.value > 0 ? Math.max(4, (item.value / max) * plotH) : 2, y = padding.top + plotH - h, labelX = x + barW / 2; return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" fill="#25e05d" opacity="${item.value > 0 ? "1" : ".2"}" rx="5"/><text class="axis-text monthly-value" x="${labelX.toFixed(1)}" y="${(y - 8).toFixed(1)}">${monthlyAmount(item.value)}</text><text class="muted-text monthly-label" x="${labelX.toFixed(1)}" y="${height - 25}">${item.label.split(" ")[0]}</text><text class="muted-text monthly-year" x="${labelX.toFixed(1)}" y="${height - 10}">${item.label.split(" ")[1] || ""}</text>`; }).join(""); }
function signalBadge(signal) { const normalized = String(signal || "").toLowerCase(); const cls = normalized.includes("strong") ? "strong" : normalized.includes("buy") || normalized.includes("accumulate") ? "buy" : normalized.includes("reduce") ? "reduce" : "hold"; return `<span class="badge ${cls}">${signal || "HOLD"}</span>`; }

function renderHoldings(filter = activeFilter, query = document.getElementById("holdingSearch")?.value || "") {
  activeFilter = filter || "All";
  const search = String(query || "").trim().toLowerCase();
  const rows = holdings.filter(item => {
    const layer = layerClass(item.layer);
    const matchesLayer = activeFilter === "All" || layer === activeFilter;
    const matchesSearch = !search || `${item.ticker} ${item.layer} ${item.signal}`.toLowerCase().includes(search);
    return matchesLayer && matchesSearch && item.ticker !== "CASH";
  }).sort(compareHoldings);
  setHtml("holdingsBody", rows.map((item) => { const plClass = String(item.pl).startsWith("-") ? "negative" : item.pl === "-" ? "neutral" : "positive"; const gain = signedCurrencyFromThb(holdingGainThb(item)); return `<tr class="holding-row ${plClass}"><td><span class="ticker-cell">${tickerLogo(item.ticker)}<span><strong>${item.ticker}</strong><small>${assetKind(item.ticker)} <b>${Number(item.weight || 0).toFixed(1)}%</b></small></span></span></td><td>${targetCell(item)}</td><td class="mono">${numberFrom(item.shares).toFixed(7)}</td><td>${formatCurrencyFromUsd(item.avgCostUsd)}</td><td>${formatCurrencyFromUsd(item.currentPriceUsd || item.price)}</td><td class="value-cell">${formatCurrencyFromThb(item.value)}</td><td class="${plClass}"><strong>${gain}</strong><small>${item.pl}</small></td><td>${signalBadge(item.signal)}</td><td>${indicatorCell(item)}</td></tr>`; }).join("") || `<tr><td colspan="9">No holdings match this filter.</td></tr>`);
  setHtml("mobileHoldings", rows.map(item => { const plClass = String(item.pl).startsWith("-") ? "negative" : item.pl === "-" ? "neutral" : "positive"; const layer = layerClass(item.layer); const gain = signedCurrencyFromThb(holdingGainThb(item)); return `<article class="mobile-holding-card ${plClass}"><div class="mobile-holding-top"><span class="ticker-cell">${tickerLogo(item.ticker)}<span><strong>${item.ticker}</strong><br><small>${assetKind(item.ticker)} <b>${Number(item.weight || 0).toFixed(1)}%</b> - <span class="layer-text ${layer}">${layer.toUpperCase()}</span> · Target ${targetWeight(item) ? `${targetWeight(item).toFixed(1)}%` : "Set target"}</small></span></span><span class="mobile-signal">${signalBadge(item.signal)}</span></div><div class="holding-metrics"><div><span>Shares</span><strong>${numberFrom(item.shares).toFixed(7)}</strong></div><div><span>RSI 7 / RSI 14</span><strong>${numberFrom(item.rsi7).toFixed(1)} / ${numberFrom(item.rsi14).toFixed(1)}</strong></div><div><span>Avg cost</span><strong>${formatCurrencyFromUsd(item.avgCostUsd)}</strong></div><div><span>Current price</span><strong>${formatCurrencyFromUsd(item.currentPriceUsd || item.price)}</strong></div><div><span>Value</span><strong>${formatCurrencyFromThb(item.value)}</strong></div></div><div class="mobile-holding-meta"><span>Gain / Loss</span><strong class="${plClass}">${gain}<small>${item.pl}</small></strong></div></article>`; }).join("") || `<div class="empty">No holdings match this filter.</div>`);
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
function xirr() { return null; }
function dcaMultiplier(item) { const signal = String(item.signal || "").toUpperCase(); const rsi7 = numberFrom(item.rsi7), rsi14 = numberFrom(item.rsi14); if (/REDUCE|SELL|OVERBOUGHT/.test(signal) || rsi7 >= 75 || rsi14 >= 75) return 0; if (/BUY DIP|GOOD PRICE/.test(signal) || rsi7 < 35) return 1; if (/ACCUMULATE/.test(signal) || rsi14 < 45) return 0.75; if (/BULLISH|FOLLOW/.test(signal) || rsi7 <= 60) return 0.5; if (rsi7 < 70) return 0.25; return 0; }
function dcaReason(item, multiplier) { const signal = cleanSignal(item.signal); const rsi7 = numberFrom(item.rsi7), rsi14 = numberFrom(item.rsi14); if (!multiplier) return `Skip: ${signal}; RSI ${rsi7.toFixed(1)}/${rsi14.toFixed(1)} is not a clean buy setup`; if (multiplier === 1) return "1.0x: RSI dip or BUY DIP signal; best opportunity tier today"; if (multiplier === 0.75) return "0.75x: accumulation signal is good, but not a full-size entry"; if (multiplier === 0.5) return "0.5x: bullish follow; use medium size to avoid chasing price"; return "0.25x: weaker setup; use only a small starter size"; }

function buildDcaPlan(budgetUsd) {
  const fx = fxRate();
  const candidates = signalBoard.filter(item => item.ticker && item.ticker !== "CASH").map(item => ({ ...item, multiplier: dcaMultiplier(item), smartDcaUsd: numberFrom(item.smartDcaUsd) || Infinity, targetGap: targetGap(item) })).filter(item => item.multiplier > 0).sort((a, b) => b.multiplier - a.multiplier || Math.max(0, b.targetGap) - Math.max(0, a.targetGap) || numberFrom(a.priority || 99) - numberFrom(b.priority || 99) || numberFrom(a.rsi7) - numberFrom(b.rsi7)).slice(0, 3);
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
  return { fx, deployRatio: requestedUsd > 0 ? 1 : 0, picks: picks.map(item => ({ ...item, reason: `${dcaReason(item, item.multiplier)}${item.targetGap > 0 ? `; under target by ${item.targetGap.toFixed(1)}%` : ""}`, amountUsd: Math.round(item.amountUsd * 100) / 100, amountThb: Math.round(item.amountUsd * fx), belowMin: item.amountUsd > 0 && item.amountUsd < MIN_ORDER_USD })), usedUsd: Math.round(usedRaw * 100) / 100, leftoverUsd: Math.round(Math.max(0, requestedUsd - usedRaw) * 100) / 100 };
}

function renderTodaySignal(best, budgetUsd) {
  if (!best) return;
  const gap = targetGap(best);
  const signal = cleanSignal(best.signal);
  setText("todaySignal", budgetUsd > 0 ? "Sizing Ready" : `${best.ticker} ${best.multiplier}x`);
  setHtml("todaySignalText", `<span class="signal-summary">${signal}</span><span class="signal-chips"><b>${best.ticker}</b><b>${best.multiplier}x</b><b>RSI ${numberFrom(best.rsi7).toFixed(1)} / ${numberFrom(best.rsi14).toFixed(1)}</b><b>${gap > 0 ? `Under +${gap.toFixed(1)}%` : gap < 0 ? `Over ${Math.abs(gap).toFixed(1)}%` : "On target"}</b></span><span class="signal-note">${best.reason}</span>`);
}
function renderSmartDca() { const input = document.getElementById("dcaBudgetInput"); const budget = parseBudgetInput(input?.value || ""); const plan = buildDcaPlan(budget.usd); const rows = budget.usd > 0 ? plan.picks.filter(item => item.amountUsd > 0) : plan.picks; setHtml("dcaBudgetSummary", budget.usd > 0 ? `<span class="dca-summary-title">Today's plan: use ${formatUsd(plan.usedUsd)} from ${formatUsd(budget.usd)} and keep ${formatUsd(plan.leftoverUsd)} in cash</span><span class="dca-figures"><b>Budget ${formatUsd(budget.usd)}</b><b>Use ${formatUsd(plan.usedUsd)}</b><b>Cash left ${formatUsd(plan.leftoverUsd)}</b><b>Min ${formatUsd(MIN_ORDER_USD)}</b></span>` : "Enter USD only, such as 10 or $10. Ranking uses Signal + RSI."); setHtml("smartDcaList", rows.map((item, index) => `<div class="mini-row dca-plan-row"><span>${index + 1}. <strong>${item.ticker}</strong><small>${item.multiplier}x - ${signalReason(item)} - ${item.reason}${item.belowMin ? " - below DIME minimum" : ""}</small></span><strong>${budget.usd > 0 ? formatUsd(item.amountUsd) : `${item.multiplier}x`}</strong></div>`).join("") || `<div class="empty">No clean RSI-based buy setup today. Keep cash.</div>`); renderTodaySignal(rows[0], budget.usd); }
function renderHealth() { const growth = holdings.filter(item => /growth/i.test(item.layer)).reduce((sum, item) => sum + item.weight, 0); const alpha = holdings.filter(item => /alpha/i.test(item.layer)).reduce((sum, item) => sum + item.weight, 0); const cash = holdings.find(item => item.ticker === "CASH"); const cashWeight = cash ? cash.weight : 0; const score = Math.max(6.4, Math.min(9.4, 9.2 - Math.max(0, growth - 58) * .06 - Math.max(0, alpha - 8) * .08 + Math.min(cashWeight, 4) * .03)); setText("healthScore", score.toFixed(1)); setHtml("healthMetrics", [["Diversification", Math.min(9.2, 7.2 + holdings.length * .18).toFixed(1)], ["Risk Control", score.toFixed(1)], ["Momentum", /MODE A/i.test(kpis.marketMode) ? "9.0" : "7.6"], ["Cash Buffer", Math.max(6.5, Math.min(9.0, 7 + cashWeight / 2)).toFixed(1)]].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")); }
function renderAlerts() { const rows = []; holdings.forEach(item => { const r = numberFrom(item.pl); const signal = cleanSignal(item.signal); const status = targetStatus(item); if (/strong buy|buy|accumulate/i.test(signal)) rows.push({ title: `${item.ticker} has an active entry signal`, text: `${signal} from the Looker signal sheet. Check live market conditions before buying.`, tone: "positive" }); if (status.gap >= 1.5) rows.push({ title: `${item.ticker} is under target`, text: `${kpis.marketMode} target is ${targetWeight(item).toFixed(1)}%, current weight is ${numberFrom(item.weight).toFixed(1)}%.`, tone: "positive" }); if (status.gap <= -2) rows.push({ title: `${item.ticker} is over target`, text: `${kpis.marketMode} target is ${targetWeight(item).toFixed(1)}%, current weight is ${numberFrom(item.weight).toFixed(1)}%.`, tone: "caution" }); if (r > 25) rows.push({ title: `${item.ticker} is extended`, text: `Position return is ${item.pl}. Avoid chasing and review target weight.`, tone: "caution" }); if (r < -5) rows.push({ title: `${item.ticker} needs drawdown review`, text: `Position return is ${item.pl}. Review thesis and allocation gap.`, tone: "caution" }); }); document.querySelectorAll(".alert-dot").forEach(button => button.dataset.count = String(Math.min(rows.length, 9))); setHtml("alertsList", rows.slice(0, 5).map(row => `<div class="alert-row"><div><strong>${row.title}</strong><p>${row.text}</p></div><span class="badge ${row.tone}">${row.tone}</span></div>`).join("") || `<div class="empty">No major alerts from the latest sheet snapshot.</div>`); }
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
  setHtml("goalBaseValue", `Current portfolio <strong>${formatThb(startValue)}</strong>`);
  setText("goalBearValue", shortThb(endBear));
  setText("goalSafeValue", shortThb(endSafe));
  setText("goalBullValue", shortThb(endBull));
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
  const signalRows = rawSignals.map(row => ({
    ticker: rowAny(row, ["Ticker", "Symbol"], "N/A"),
    totalTrend: rowAny(row, ["Total_Trend", "Total Trend", "Trend", "EMA_Trend", "EMA Trend", "Price_vs_EMA", "Price vs EMA"], ""),
    signal: cleanSignal(rowAny(row, ["Signal", "EMA_Signal", "EMA Signal"], "HOLD")),
    rsi7: numberFrom(rowAny(row, ["RSI 7", "RSI7", "RSI_7", "RSI7_Value"], 0)),
    rsi14: numberFrom(rowAny(row, ["RSI 14", "RSI14", "RSI_14", "RSI14_Value"], 0)),
    priority: numberFrom(rowAny(row, ["Priority", "Rank"], 99)),
    smartDcaUsd: numberFrom(rowAny(row, ["Smart DCA $", "Smart_DCA_USD", "Smart DCA USD", "Smart_DCA"], 0))
  })).filter(item => item.ticker && item.ticker !== "N/A");
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
    value: numberFrom(row.Market_Value_THB),
    valueText: moneyText(row.Market_Value_THB),
    pl: percentText(row.PL_Percent),
    weight: numberFrom(row.Weight),
    targetA: numberFrom(rowAny(row, ["Target_A", "Target A", "Target Weight A"], 0)),
    targetB: numberFrom(rowAny(row, ["Target_B", "Target B", "Target Weight B"], 0)),
    targetWeight: numberFrom(rowAny(row, ["Target_Weight", "Target Weight", "Target"], 0)),
    signal: cleanSignal(row.Signal),
    rsi7: numberFrom(rowAny(row, ["RSI 7", "RSI7", "RSI_7"], 0)),
    rsi14: numberFrom(rowAny(row, ["RSI 14", "RSI14", "RSI_14"], 0)),
    priority: numberFrom(rowAny(row, ["Priority", "Rank"], 99)),
    smartDcaUsd: numberFrom(rowAny(row, ["Smart DCA $", "Smart_DCA_USD", "Smart DCA USD", "Smart_DCA"], 0))
  })).filter(item => item.ticker && item.ticker !== "N/A").map(item => {
    const signal = signalMap.get(String(item.ticker).toUpperCase());
    return signal ? { ...item, signal: cleanSignal(signal.signal || item.signal), rsi7: signal.rsi7 || item.rsi7, rsi14: signal.rsi14 || item.rsi14, priority: signal.priority || item.priority, smartDcaUsd: signal.smartDcaUsd || item.smartDcaUsd, totalTrend: signal.totalTrend } : item;
  });

  signalBoard = holdings.filter(item => item.ticker !== "CASH");
  const cash = holdings.find(item => item.ticker === "CASH");
  if (cash) {
    kpis.cash = cash.valueText;
    kpis.cashWeight = `${cash.weight.toFixed(2)}%`;
  }
  navRows = rowsToObjects(datasets.nav).map(row => [row.Date, numberFrom(row.Daily_Invested_THB), numberFrom(row.Cumulative_NAV_THB), numberFrom(row.Daily_Change_Percent) / 100, numberFrom(row.Drawdown_Percent) / 100]).filter(row => row[2] > 0);
  monthly = buildMonthlyContributions(navRows, rowsToObjects(datasets.monthly));
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
      targetA: numberFrom(rowAny(row, ["Target_A", "Target A", "Target Weight A"], item.targetA || 0)),
      targetB: numberFrom(rowAny(row, ["Target_B", "Target B", "Target Weight B"], item.targetB || 0)),
      targetWeight: numberFrom(rowAny(row, ["Target_Weight", "Target Weight", "Target"], item.targetWeight || 0))
    };
  });
}
function renderAll() { renderKpis(); renderSparklines(); renderNavChart(); renderAllocation(); renderMonthly(); renderHoldings(activeFilter); renderSignals(); renderSmartDca(); renderHealth(); renderAlerts(); renderGoal(); }
async function loadLiveData() {
  setText("sideSync", "Loading");
  setText("marketOpenLabel", "Sheet Loading");
  try {
    const [kpi, holdingsData, nav, monthlyData, signalsData] = await Promise.all([
      fetchSheet(DATA_SHEETS.kpi),
      fetchSheet(DATA_SHEETS.holdings),
      fetchSheet(DATA_SHEETS.nav),
      fetchSheet(DATA_SHEETS.monthly),
      fetchSheet(DATA_SHEETS.signals)
    ]);
    applyLiveData({ kpi, holdings: holdingsData, nav, monthly: monthlyData, signals: signalsData });
    enrichHoldingsFromSheet(holdingsData);
    renderAll();
    const now = new Date();
    setText("updatedAt", `Updated ${now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`);
    setText("sideSync", "Live");
    setText("marketOpenLabel", "Sheet Live");
    const meter = document.getElementById("syncMeter");
    if (meter) meter.style.width = "92%";
  } catch (error) {
    console.warn(error);
    setText("updatedAt", "Using saved data. Check sheet publish access.");
    setText("sideSync", "Saved");
    setText("marketOpenLabel", "Saved Data");
    renderAll();
  }
}
function jumpToAlerts() { const alerts = document.getElementById("alerts"); const card = document.querySelector(".alerts-card"); alerts?.scrollIntoView({ behavior: "smooth", block: "start" }); document.querySelectorAll("[data-jump]").forEach(item => item.classList.toggle("active", item.dataset.jump === "alerts")); if (card) { card.classList.add("flash-focus"); window.setTimeout(() => card.classList.remove("flash-focus"), 1200); } }
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
    document.querySelectorAll("#assetTabs button").forEach(tab => tab.classList.toggle("active", tab === button));
    renderHoldings(button.dataset.filter || "All", search?.value || "");
  });
  document.querySelector(".period-tabs")?.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    performancePeriod = button.dataset.period || button.textContent.trim() || "YTD";
    document.querySelectorAll(".period-tabs button").forEach(tab => tab.classList.toggle("active", tab === button));
    renderNavChart();
  });
  document.getElementById("allocationView")?.addEventListener("change", event => {
    allocationMode = event.target.value;
    renderAllocation();
  });
  search?.addEventListener("input", () => renderHoldings(activeFilter, search.value));
  document.getElementById("refreshButton")?.addEventListener("click", loadLiveData);
  document.getElementById("notificationButton")?.addEventListener("click", jumpToAlerts);
  document.getElementById("themeToggle")?.addEventListener("click", () => setTheme(document.body.dataset.theme === "light" ? "dark" : "light"));
  document.getElementById("currencyToggle")?.addEventListener("click", () => setCurrencyMode(currencyMode === "THB" ? "USD" : "THB"));
  document.getElementById("dcaBudgetInput")?.addEventListener("input", renderSmartDca);
  ["goalMonthlyDca", "goalAnnualReturn", "goalMonths"].forEach(id => document.getElementById(id)?.addEventListener("input", renderGoal));
  document.getElementById("useCashButton")?.addEventListener("click", () => {
    const input = document.getElementById("dcaBudgetInput");
    if (!input) return;
    input.value = `$${(numberFrom(kpis.cash) / fxRate()).toFixed(2)}`;
    renderSmartDca();
  });
  document.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", () => {
    if (button.dataset.jump === "overview") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(button.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.querySelectorAll("[data-jump]").forEach(item => item.classList.toggle("active", item.dataset.jump === button.dataset.jump));
  }));
}
function setTheme(theme) { document.body.dataset.theme = theme; try { localStorage.setItem("portfolioTheme", theme); } catch (error) { console.warn(error); } }
function initTheme() { try { setTheme(localStorage.getItem("portfolioTheme") || "dark"); } catch (error) { setTheme("dark"); } }

initTheme();
initCurrency();
renderAll();
bindInteractions();
loadLiveData();
