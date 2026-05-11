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
  { ticker: "SCHD", layer: "Core", shares: "0.4566078", price: "$31.62", value: 464.94, valueText: "THB 464.94", pl: "3.35%", weight: 8.75, signal: "HOLD" },
  { ticker: "NVDA", layer: "Growth", shares: "0.1634117", price: "$215.22", value: 1132.56, valueText: "THB 1,132.56", pl: "14.97%", weight: 21.32, signal: "HOLD" },
  { ticker: "GOOGL", layer: "Growth", shares: "0.0317128", price: "$400.71", value: 409.22, valueText: "THB 409.22", pl: "37.08%", weight: 7.70, signal: "STRONG BUY" },
  { ticker: "PLTR", layer: "Growth", shares: "0.1481048", price: "$137.80", value: 657.23, valueText: "THB 657.23", pl: "-3.74%", weight: 12.37, signal: "HOLD" },
  { ticker: "TSM", layer: "Growth", shares: "0.0414339", price: "$411.68", value: 549.30, valueText: "THB 549.30", pl: "18.29%", weight: 10.34, signal: "BUY" },
  { ticker: "QQQI", layer: "Safe", shares: "0.2030812", price: "$56.50", value: 369.50, valueText: "THB 369.50", pl: "7.94%", weight: 6.96, signal: "HOLD" },
  { ticker: "IAUI", layer: "Safe", shares: "0.2208413", price: "$57.23", value: 407.01, valueText: "THB 407.01", pl: "1.35%", weight: 7.66, signal: "HOLD" },
  { ticker: "IDVO", layer: "Safe", shares: "0.2626505", price: "$42.80", value: 362.01, valueText: "THB 362.01", pl: "2.29%", weight: 6.82, signal: "HOLD" },
  { ticker: "RKLB", layer: "Alpha", shares: "0.1307652", price: "$105.55", value: 444.47, valueText: "THB 444.47", pl: "44.54%", weight: 8.37, signal: "HOLD" }
];

let signalBoard = holdings.map((item, index) => ({
  ...item,
  rsi7: index < 2 ? 78 : index < 5 ? 48 : 56,
  rsi14: index < 2 ? 71 : index < 5 ? 44 : 58,
  priority: index + 1
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
const DATA_SHEETS = {
  kpi: "Looker_KPI",
  holdings: "Looker_Holdings",
  nav: "Looker_NAV",
  monthly: "Looker_Monthly",
  signals: "Looker_Signals"
};

const colors = ["#25e05d", "#f6c21a", "#4aa3ff", "#ff5148", "#b57cff", "#13b981", "#94a3b8"];
const MIN_ORDER_USD = 1.5;
let allocationMode = "sector";
let activeFilter = "All";

function numberFrom(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function moneyText(value) {
  const text = String(value || "").trim();
  if (!text) return "THB 0.00";
  return text.replace("฿", "THB ").replace("à¸¿", "THB ");
}

function percentText(value) {
  const text = String(value || "").trim();
  return text || "0.00%";
}

function decimalText(value, digits = 2) {
  const parsed = numberFrom(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : String(value || "0.00");
}

function plusText(value, formatter) {
  const text = formatter(value);
  return text.startsWith("-") || text.startsWith("+") ? text : `+${text}`;
}

function cleanSignal(value) {
  return String(value || "HOLD").replace(/[^\w\s()%/-]+/g, "").trim() || "HOLD";
}

function rowsToObjects(rows) {
  const [headers, ...body] = rows;
  return body.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function kpiValue(rows, metric, fallback = "") {
  const found = rows.find(row => row.Metric === metric);
  return found && found.Value ? found.Value : fallback;
}

function kpiAny(rows, metrics, fallback = "") {
  const names = Array.isArray(metrics) ? metrics : [metrics];
  const normalized = names.map(name => String(name).toLowerCase());
  const found = rows.find(row => {
    const metric = String(row.Metric || "").toLowerCase();
    return normalized.some(name => metric === name || metric.includes(name));
  });
  return found && found.Value ? found.Value : fallback;
}

function rowAny(row, names, fallback = "") {
  const keys = Array.isArray(names) ? names : [names];
  for (const key of keys) {
    if (row[key] != null && row[key] !== "") return row[key];
  }
  const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ""), value]));
  for (const key of keys) {
    const found = normalized[String(key).toLowerCase().replace(/[^a-z0-9]/g, "")];
    if (found != null && found !== "") return found;
  }
  return fallback;
}

function signedClass(value) {
  const text = String(value || "").trim();
  return text.startsWith("-") || numberFrom(text) < 0 ? "negative" : "positive";
}

function normalizeLayer(ticker, layer) {
  if (String(ticker || "").toUpperCase() === "QQQI") return "Safe";
  return String(layer || "Core").trim() || "Core";
}

function fetchSheet(sheetName) {
  return new Promise((resolve, reject) => {
    const callback = `sheetCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(`Cannot load ${sheetName}`));
    }, 12000);

    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callback];
      script.remove();
    }

    window[callback] = payload => {
      cleanup();
      if (!payload || payload.status === "error") {
        reject(new Error(`Google Sheet returned no data for ${sheetName}`));
        return;
      }
      const table = payload.table || {};
      const headers = (table.cols || []).map((col, index) => col.label || `Column_${index + 1}`);
      const body = (table.rows || []).map(row => (row.c || []).map(cell => {
        if (!cell) return "";
        if (cell.f != null) return cell.f;
        if (cell.v != null) return String(cell.v);
        return "";
      }));
      resolve([headers, ...body]);
    };

    const sheet = encodeURIComponent(sheetName);
    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${sheet}&headers=1&tqx=responseHandler:${callback}&cacheBust=${Date.now()}`;
    script.onerror = () => {
      cleanup();
      reject(new Error(`Cannot load ${sheetName}`));
    };
    document.head.appendChild(script);
  });
}

function excelDateToJs(serial) {
  if (serial instanceof Date) return serial;
  if (typeof serial === "string") {
    const parsed = new Date(serial);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const utcDays = Math.floor(Number(serial || 0) - 25569);
  return new Date(utcDays * 86400 * 1000);
}

function pathFromPoints(points) {
  return points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(" ");
}

function drawSparkline(svg, values) {
  if (!values.length) return;
  const width = 260;
  const height = 60;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((value, index) => [
    4 + (index / Math.max(values.length - 1, 1)) * (width - 8),
    8 + (1 - ((value - min) / span)) * (height - 16)
  ]);
  svg.innerHTML = `<path d="${pathFromPoints(points)}" fill="none" stroke="currentColor" stroke-width="3"/><path d="${pathFromPoints(points)} L${width - 4} ${height} L4 ${height} Z" fill="currentColor" opacity=".12" stroke="none"/>`;
}

function renderSparklines() {
  const nav = navRows.map(row => row[2]).filter(value => value > 0);
  document.querySelectorAll("[data-spark]").forEach(svg => drawSparkline(svg, nav));
}

function renderKpis() {
  const profit = plusText(kpis.profit, moneyText);
  const totalReturn = plusText(kpis.totalReturn, percentText);
  const dailyProfit = plusText(kpis.dailyProfit, moneyText);
  const dailyChange = plusText(kpis.dailyChange, percentText);
  const profitTone = signedClass(profit);
  const dailyTone = dailyProfit.includes("-") || dailyChange.includes("-") ? "negative" : "positive";
  const spyTone = signedClass(kpis.benchmarkSpy);
  const qqqTone = signedClass(kpis.benchmarkQqq);
  const drawdownTone = signedClass(kpis.maxDrawdown);

  setText("portfolioValue", kpis.portfolioValue);
  setText("investedValue", kpis.invested);
  setText("profitLabel", `${profit} (${totalReturn})`);
  setText("dailyProfitLabel", dailyProfit);
  setText("dailyChangeLabel", dailyChange);
  setText("performanceNumber", totalReturn);
  setText("irrLabel", percentText(kpis.irr));
  setText("volatilityLabel", percentText(kpis.volatility));
  setText("sharpeLabel", decimalText(kpis.sharpe));
  setText("drawdownLabel", percentText(kpis.maxDrawdown));
  setText("spyBenchmark", plusText(kpis.benchmarkSpy, percentText));
  setText("qqqBenchmark", plusText(kpis.benchmarkQqq, percentText));
  setText("cashValue", `Cash ${kpis.cash}`);
  setText("tableTotalValue", kpis.portfolioValue);
  setText("tableTotalReturn", totalReturn);
  setText("tableMode", kpis.marketMode);
  setText("sideMode", kpis.marketMode);
  setText("sideModeHint", kpis.marketMode.includes("A") ? "Risk on" : "Risk control");

  document.getElementById("profitLabel").className = profitTone;
  document.getElementById("dailyProfitLabel").className = dailyTone;
  document.getElementById("dailyChangeLabel").className = dailyTone;
  document.getElementById("spyBenchmark").className = spyTone;
  document.getElementById("qqqBenchmark").className = qqqTone;
  document.getElementById("drawdownLabel").className = drawdownTone;
}

function renderNavChart() {
  const svg = document.getElementById("navChart");
  const width = 740;
  const height = 300;
  const padding = { top: 20, right: 24, bottom: 44, left: 58 };
  const rows = navRows.filter(row => row[2] > 0);
  if (rows.length < 2) return;

  const cumulativeInvested = [];
  rows.reduce((sum, row, index) => {
    cumulativeInvested[index] = sum + numberFrom(row[1]);
    return cumulativeInvested[index];
  }, 0);

  const values = rows.map(row => numberFrom(row[2]));
  const maxForScale = Math.max(...values, ...cumulativeInvested, 1);
  const scaleY = value => padding.top + (1 - (value / maxForScale)) * (height - padding.top - padding.bottom);
  const scaleX = index => padding.left + (index / (rows.length - 1)) * (width - padding.left - padding.right);
  const navPoints = rows.map((row, index) => [scaleX(index), scaleY(numberFrom(row[2]))]);
  const investedPoints = cumulativeInvested.map((value, index) => [scaleX(index), scaleY(value)]);
  const grid = [0, .25, .5, .75, 1].map(ratio => {
    const y = padding.top + ratio * (height - padding.top - padding.bottom);
    const label = Math.round(maxForScale * (1 - ratio) / 1000) + "K";
    return `<line class="chart-grid" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"/><text class="axis-text" x="10" y="${y + 4}">${label}</text>`;
  }).join("");
  const tickIndexes = [0, Math.floor(rows.length * .32), Math.floor(rows.length * .64), rows.length - 1];
  const ticks = tickIndexes.map(index => {
    const date = excelDateToJs(rows[index][0]);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `<text class="muted-text" x="${scaleX(index) - 22}" y="${height - 14}">${label}</text>`;
  }).join("");
  const area = `${pathFromPoints(navPoints)} L${navPoints[navPoints.length - 1][0]} ${height - padding.bottom} L${navPoints[0][0]} ${height - padding.bottom} Z`;

  svg.innerHTML = `
    <defs><linearGradient id="navGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#25e05d" stop-opacity=".22"/><stop offset="1" stop-color="#25e05d" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    <path class="area-fill" d="${area}"/>
    <path class="invested-line" d="${pathFromPoints(investedPoints)}"/>
    <path class="nav-line" d="${pathFromPoints(navPoints)}"/>
    ${ticks}
  `;
}

function polarToCartesian(cx, cy, radius, angle) {
  const radians = (angle - 90) * Math.PI / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

function donutSegment(cx, cy, radius, innerRadius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return [`M ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`, `L ${innerEnd.x} ${innerEnd.y}`, `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`, "Z"].join(" ");
}

function allocationEntries() {
  if (allocationMode === "asset") {
    return holdings
      .filter(item => item.value > 0 && item.ticker !== "CASH")
      .sort((a, b) => b.value - a.value)
      .map(item => [item.ticker, item.value]);
  }
  const grouped = holdings.reduce((acc, item) => {
    if (item.value > 0 && item.ticker !== "CASH") acc[item.layer] = (acc[item.layer] || 0) + item.value;
    return acc;
  }, {});
  return Object.entries(grouped).filter(([, value]) => value > 0);
}

function renderAllocation() {
  const entries = allocationEntries();
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (!total) return;
  let angle = 0;
  setHtml("allocationChart", entries.map(([layer, value], index) => {
    const next = angle + (value / total) * 360;
    const path = donutSegment(120, 120, 104, 58, angle, next);
    angle = next;
    return `<path d="${path}" fill="${colors[index % colors.length]}" stroke="#071017" stroke-width="3"/>`;
  }).join(""));
  setHtml("allocationLegend", entries.map(([layer, value], index) => {
    const pct = value / total * 100;
    return `<div class="allocation-row"><i class="swatch" style="background:${colors[index % colors.length]}"></i><span>${layer}</span><strong>${pct.toFixed(1)}%</strong></div>`;
  }).join(""));
}

function renderMonthly() {
  const svg = document.getElementById("monthlyChart");
  if (!monthly.length) return;
  const width = 640;
  const height = 280;
  const padding = { top: 26, right: 18, bottom: 42, left: 48 };
  const max = Math.max(...monthly.map(item => item.value), 1);
  const plotH = height - padding.top - padding.bottom;
  const gap = (width - padding.left - padding.right) / monthly.length;
  const barW = Math.min(64, gap * .34);
  const grid = [0, .25, .5, .75, 1].map(ratio => {
    const y = padding.top + ratio * plotH;
    return `<line class="chart-grid" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"/><text class="muted-text" x="8" y="${y + 4}">${Math.round(max * (1 - ratio) / 1000)}K</text>`;
  }).join("");
  const bars = monthly.map((item, index) => {
    const x = padding.left + index * gap + gap / 2 - barW / 2;
    const h = Math.max(4, (item.value / max) * plotH);
    const y = padding.top + plotH - h;
    return `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="#25e05d" rx="5"/><text class="axis-text" x="${x - 7}" y="${y - 8}">${Math.round(item.value).toLocaleString()}</text><text class="muted-text" x="${x - 4}" y="${height - 14}">${item.label}</text>`;
  }).join("");
  svg.innerHTML = `${grid}${bars}`;
}

function signalBadge(signal) {
  const normalized = String(signal || "").toLowerCase();
  const cls = normalized.includes("strong") ? "strong" : normalized.includes("buy") || normalized.includes("accumulate") ? "buy" : normalized.includes("reduce") ? "reduce" : "hold";
  return `<span class="badge ${cls}">${signal || "HOLD"}</span>`;
}

function layerClass(layer) {
  const clean = String(layer || "").split("/")[0].trim();
  return clean || "Core";
}

function renderHoldings(filter = activeFilter, query = document.getElementById("holdingSearch").value || "") {
  activeFilter = filter;
  const search = query.trim().toLowerCase();
  const rows = holdings.filter(item => {
    const layer = layerClass(item.layer);
    const matchesLayer = filter === "All" || layer === filter || item.layer === filter;
    const matchesSearch = !search || `${item.ticker} ${item.layer} ${item.signal}`.toLowerCase().includes(search);
    return matchesLayer && matchesSearch && item.ticker !== "CASH";
  });

  setHtml("holdingsBody", rows.map((item, index) => {
    const plClass = String(item.pl).startsWith("-") ? "negative" : item.pl === "-" ? "neutral" : "positive";
    const layer = layerClass(item.layer);
    return `<tr>
      <td>${index + 1}</td>
      <td><span class="ticker-cell"><i class="ticker-logo">${item.ticker.slice(0, 2)}</i><strong>${item.ticker}</strong></span></td>
      <td><strong class="layer-text ${layer}">${item.layer}</strong></td>
      <td>${item.valueText}</td>
      <td>${Number(item.weight || 0).toFixed(2)}%</td>
      <td>${item.price}</td>
      <td class="${plClass}">${item.pl}</td>
      <td>${signalBadge(item.signal)}</td>
    </tr>`;
  }).join(""));

  setHtml("mobileHoldings", rows.map((item) => {
    const plClass = String(item.pl).startsWith("-") ? "negative" : item.pl === "-" ? "neutral" : "positive";
    const layer = layerClass(item.layer);
    return `<article class="mobile-holding-card">
      <div class="mobile-holding-top">
        <span class="ticker-cell"><i class="ticker-logo">${item.ticker.slice(0, 2)}</i><span><strong>${item.ticker}</strong><br><small class="layer-text ${layer}">${item.layer}</small></span></span>
        ${signalBadge(item.signal)}
      </div>
      <div class="mobile-holding-meta"><span>${Number(item.weight || 0).toFixed(2)}% port</span><strong>${item.valueText}</strong></div>
      <div class="mobile-holding-meta"><span>${item.price}</span><strong class="${plClass}">${item.pl}</strong></div>
    </article>`;
  }).join("") || `<div class="empty">No holdings match this filter.</div>`);
}

function renderSignals() {
  const vixValue = numberFrom(kpis.vix);
  const fearGreedValue = numberFrom(kpis.greedFear);
  const vixState = vixValue <= 20 ? "LOW" : "HIGH";
  const fearGreedState = fearGreedValue >= 55 ? "GREED" : fearGreedValue <= 45 ? "FEAR" : "NEUTRAL";
  const indicators = [
    ["VIX", kpis.vix, vixValue <= 20 ? "positive" : "warning", vixState, vixState.toLowerCase()],
    ["Fear & Greed Index", kpis.greedFear, fearGreedState === "GREED" ? "warning" : fearGreedState === "FEAR" ? "negative" : "neutral", fearGreedState, fearGreedState.toLowerCase()],
    ["S&P500 Trend", kpis.sp500Trend, /above|bull|up/i.test(kpis.sp500Trend) ? "positive" : "warning"],
    ["Market Breadth", kpis.marketBreadth, numberFrom(kpis.marketBreadth) >= 55 ? "positive" : "warning"],
    ["10Y Bond Yield", kpis.bondYield, "neutral"]
  ];
  setHtml("signalsList", indicators.map(([label, value, tone, badge, badgeTone]) =>
    `<div class="indicator-row"><span>${label}</span><span class="indicator-value"><strong class="${tone}">${value}</strong>${badge ? `<i class="status-pill ${badgeTone}">${badge}</i>` : ""}</span></div>`
  ).join(""));
}

function fxRate() {
  const usdValue = holdings
    .filter(item => item.ticker !== "CASH")
    .reduce((sum, item) => sum + numberFrom(item.shares) * numberFrom(item.price), 0);
  const thbValue = holdings
    .filter(item => item.ticker !== "CASH")
    .reduce((sum, item) => sum + numberFrom(item.value), 0);
  return usdValue > 0 && thbValue > 0 ? thbValue / usdValue : 32.6;
}

function parseBudgetInput(value, fx = fxRate()) {
  const text = String(value || "").trim().toLowerCase();
  const amount = numberFrom(text);
  if (!amount) return { input: text, usd: 0, thb: 0, currency: "THB" };
  const isUsd = text.includes("$") || text.includes("usd") || text.includes("ดอลลาร์");
  const isThb = text.includes("฿") || text.includes("thb") || text.includes("บาท");
  if (isUsd && !isThb) return { input: text, usd: amount, thb: amount * fx, currency: "USD" };
  return { input: text, usd: amount / fx, thb: amount, currency: "THB" };
}

function formatUsd(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatThb(value) {
  return `THB ${Math.round(Number(value || 0)).toLocaleString("en-US")}`;
}

function signedThb(value) {
  const amount = Number(value || 0);
  const sign = amount < 0 ? "-" : "";
  return `${sign}THB ${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function signedPercent(value, digits = 3) {
  const amount = Number(value || 0);
  const sign = amount < 0 ? "-" : "";
  return `${sign}${Math.abs(amount).toFixed(digits)}%`;
}

function dcaMultiplier(item) {
  const signal = String(item.signal || "").toUpperCase();
  const rsi7 = numberFrom(item.rsi7);
  const rsi14 = numberFrom(item.rsi14);
  const hasRsi7 = rsi7 > 0;
  const hasRsi14 = rsi14 > 0;
  if (/REDUCE|SELL|OVERBOUGHT/.test(signal) || (hasRsi7 && rsi7 >= 75) || (hasRsi14 && rsi14 >= 75)) return 0;
  if (/BUY DIP|GOOD PRICE/.test(signal) || (hasRsi7 && rsi7 < 35)) return 1;
  if (/ACCUMULATE/.test(signal) || (hasRsi14 && rsi14 < 45)) return 0.75;
  if (/BULLISH|FOLLOW/.test(signal) || (hasRsi7 && rsi7 <= 60)) return 0.5;
  if (hasRsi7 && rsi7 < 70) return 0.25;
  return 0;
}

function dcaReason(item, multiplier) {
  const signal = cleanSignal(item.signal);
  const rsi7 = numberFrom(item.rsi7);
  const rsi14 = numberFrom(item.rsi14);
  const rsiText = rsi7 || rsi14 ? `${rsi7.toFixed(1)}/${rsi14.toFixed(1)}` : "n/a";
  if (!multiplier) return `Skip: ${signal}; RSI ${rsiText} ยังไม่ใช่จังหวะซื้อ`;
  if (multiplier === 1) return `1.0x: RSI ต่ำหรือ BUY DIP; โอกาสดีที่สุดในชุดวันนี้`;
  if (multiplier === 0.75) return `0.75x: RSI14/สัญญาณสะสมดี แต่ยังไม่ใช่ไม้เต็ม`;
  if (multiplier === 0.5) return `0.5x: bullish follow ใช้ไม้กลาง ลดความเสี่ยงไล่ราคา`;
  return `0.25x: สัญญาณอ่อนกว่า ใช้ไม้เล็กเท่านั้น`;
}

function buildDcaPlan(budgetUsd) {
  const fx = fxRate();
  const candidates = signalBoard
    .filter(item => item.ticker && item.ticker !== "CASH")
    .map(item => {
      const multiplier = dcaMultiplier(item);
      return {
        ...item,
        multiplier,
        reason: dcaReason(item, multiplier),
        smartDcaUsd: numberFrom(item.smartDcaUsd) || Infinity
      };
    })
    .filter(item => item.multiplier > 0)
    .sort((a, b) => b.multiplier - a.multiplier || numberFrom(a.priority || 99) - numberFrom(b.priority || 99) || numberFrom(a.rsi7) - numberFrom(b.rsi7))
    .slice(0, 3);

  const picks = candidates.map(item => ({ ...item, amountUsd: 0 }));
  let remaining = Number(budgetUsd || 0);
  let open = picks;
  for (let round = 0; round < 3 && remaining > 0.01 && open.length; round += 1) {
    const totalWeight = open.reduce((sum, item) => sum + item.multiplier, 0);
    open.forEach(item => {
      const room = Number.isFinite(item.smartDcaUsd) ? Math.max(0, item.smartDcaUsd - item.amountUsd) : Infinity;
      const planned = remaining * (item.multiplier / totalWeight);
      item.amountUsd += Math.min(room, planned);
    });
    const used = picks.reduce((sum, item) => sum + item.amountUsd, 0);
    remaining = Math.max(0, Number(budgetUsd || 0) - used);
    open = picks.filter(item => item.smartDcaUsd - item.amountUsd > 0.01);
  }
  return {
    fx,
    picks: picks.map(item => ({
      ...item,
      amountUsd: Math.round(item.amountUsd * 100) / 100,
      amountThb: Math.round(item.amountUsd * fx),
      belowMin: item.amountUsd > 0 && item.amountUsd < MIN_ORDER_USD
    })),
    usedUsd: Math.round(picks.reduce((sum, item) => sum + item.amountUsd, 0) * 100) / 100,
    leftoverUsd: Math.round(Math.max(0, remaining) * 100) / 100
  };
}

function renderSmartDca() {
  const input = document.getElementById("dcaBudgetInput");
  const budget = parseBudgetInput(input?.value || "");
  const plan = buildDcaPlan(budget.usd);
  const rows = budget.usd > 0 ? plan.picks.filter(item => item.amountUsd > 0) : plan.picks;
  const summary = budget.usd > 0
    ? `Budget ${formatUsd(budget.usd)} (${formatThb(budget.thb)}), deploy ${formatUsd(plan.usedUsd)}, cash left ${formatUsd(plan.leftoverUsd)}`
    : `Enter budget or press Cash. Signal is RSI/EMA based, not allocation target only.`;
  setText("dcaBudgetSummary", summary);

  setHtml("smartDcaList", rows.map((item, index) => `<div class="mini-row dca-plan-row">
    <span>${index + 1}. <strong>${item.ticker}</strong><small>${item.multiplier}x · RSI ${numberFrom(item.rsi7).toFixed(1)}/${numberFrom(item.rsi14).toFixed(1)} · ${item.reason}${item.belowMin ? " · below DIME minimum" : ""}</small></span>
    <strong>${budget.usd > 0 ? `${formatUsd(item.amountUsd)}<br><small>${formatThb(item.amountThb)}</small>` : `${item.multiplier}x`}</strong>
  </div>`).join("") || `<div class="empty">No RSI-based buy setup today. Keep cash.</div>`);

  const best = rows[0];
  if (best) {
    setText("todaySignal", budget.usd > 0 ? "Sizing Ready" : "Signal Ready");
    setText("todaySignalText", `${best.ticker}: ${best.multiplier}x from RSI/EMA. Use this as sizing simulation before real buy.`);
  }
}

function renderHealth() {
  const growth = holdings.filter(item => /growth/i.test(item.layer)).reduce((sum, item) => sum + item.weight, 0);
  const alpha = holdings.filter(item => /alpha/i.test(item.layer)).reduce((sum, item) => sum + item.weight, 0);
  const cash = holdings.find(item => item.ticker === "CASH");
  const cashWeight = cash ? cash.weight : 0;
  const score = Math.max(6.4, Math.min(9.4, 9.2 - Math.max(0, growth - 58) * .06 - Math.max(0, alpha - 8) * .08 + Math.min(cashWeight, 4) * .03));
  setText("healthScore", score.toFixed(1));
  setHtml("healthMetrics", [
    ["Diversification", Math.min(9.2, 7.2 + holdings.length * .18).toFixed(1)],
    ["Risk Control", score.toFixed(1)],
    ["Momentum", /MODE A/i.test(kpis.marketMode) ? "9.0" : "7.6"],
    ["Cash Buffer", Math.max(6.5, Math.min(9.0, 7 + cashWeight / 2)).toFixed(1)]
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join(""));
}

function renderAlerts() {
  const rows = [];
  holdings.forEach(item => {
    const r = numberFrom(item.pl);
    if (/strong buy|buy|accumulate/i.test(item.signal)) rows.push({ title: `${item.ticker} has active signal`, text: `${item.signal} from Looker signal sheet. Confirm with current market before buying.`, tone: "positive" });
    if (r > 25) rows.push({ title: `${item.ticker} is extended`, text: `Gain/loss ${item.pl}. Avoid chasing if price is stretched.`, tone: "caution" });
    if (r < -5) rows.push({ title: `${item.ticker} drawdown watch`, text: `Position return ${item.pl}. Review thesis and allocation gap.`, tone: "caution" });
  });
  const html = rows.slice(0, 4).map(row => `<div class="alert-row"><div><strong>${row.title}</strong><p>${row.text}</p></div><span class="badge ${row.tone}">${row.tone}</span></div>`).join("") || `<div class="empty">No major alerts from current sheet snapshot.</div>`;
  setHtml("alertsList", html);
}

function signalRank(signal) {
  const text = String(signal || "").toLowerCase();
  if (text.includes("strong")) return 5;
  if (text.includes("buy")) return 4;
  if (text.includes("accumulate")) return 3;
  if (text.includes("hold")) return 2;
  return 1;
}

function applyLiveData(datasets) {
  const kpiRows = rowsToObjects(datasets.kpi);
  const rawSignals = rowsToObjects(datasets.signals);
  const signalRows = rawSignals.map(row => ({
    ticker: rowAny(row, ["Ticker", "Symbol"], "N/A"),
    totalTrend: rowAny(row, ["Total_Trend", "Total Trend", "Trend"], ""),
    signal: cleanSignal(rowAny(row, ["Signal", "EMA_Signal", "EMA Signal"], "HOLD")),
    rsi7: numberFrom(rowAny(row, ["RSI 7", "RSI7", "RSI_7", "RSI7_Value"], 0)),
    rsi14: numberFrom(rowAny(row, ["RSI 14", "RSI14", "RSI_14", "RSI14_Value"], 0)),
    priority: numberFrom(rowAny(row, ["Priority", "Rank"], 99)),
    smartDcaUsd: numberFrom(rowAny(row, ["Smart DCA $", "Smart_DCA_USD", "Smart DCA USD", "Smart_DCA"], 0))
  })).filter(item => item.ticker && item.ticker !== "N/A");
  const signalMap = new Map(signalRows.map(item => [String(item.ticker).toUpperCase(), item]));

  kpis = {
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
    cash: kpis.cash,
    cashWeight: kpis.cashWeight,
    marketMode: kpiValue(kpiRows, "Market Mode", kpis.marketMode)
  };

  holdings = rowsToObjects(datasets.holdings).map(row => ({
    ticker: row.Ticker || "N/A",
    layer: normalizeLayer(row.Ticker, row.Asset_Layer),
    shares: row.Total_Shares || "0",
    price: `$${row.Current_Price_USD || "0.00"}`,
    value: numberFrom(row.Market_Value_THB),
    valueText: moneyText(row.Market_Value_THB),
    pl: percentText(row.PL_Percent),
    weight: numberFrom(row.Weight),
    signal: cleanSignal(row.Signal),
    rsi7: numberFrom(rowAny(row, ["RSI 7", "RSI7", "RSI_7"], 0)),
    rsi14: numberFrom(rowAny(row, ["RSI 14", "RSI14", "RSI_14"], 0)),
    priority: numberFrom(rowAny(row, ["Priority", "Rank"], 99)),
    smartDcaUsd: numberFrom(rowAny(row, ["Smart DCA $", "Smart_DCA_USD", "Smart DCA USD", "Smart_DCA"], 0))
  })).filter(item => item.ticker && item.ticker !== "N/A");

  holdings = holdings.map(item => {
    const signal = signalMap.get(String(item.ticker).toUpperCase());
    if (!signal) return item;
    return {
      ...item,
      signal: cleanSignal(signal.signal || item.signal),
      rsi7: signal.rsi7 || item.rsi7,
      rsi14: signal.rsi14 || item.rsi14,
      priority: signal.priority || item.priority,
      smartDcaUsd: signal.smartDcaUsd || item.smartDcaUsd,
      totalTrend: signal.totalTrend
    };
  });
  signalBoard = holdings.filter(item => item.ticker !== "CASH");

  const cash = holdings.find(item => item.ticker === "CASH");
  if (cash) {
    kpis.cash = cash.valueText;
    kpis.cashWeight = `${cash.weight.toFixed(2)}%`;
    if (Math.abs(numberFrom(kpis.dailyProfit) - cash.value) < 0.5) {
      kpis.dailyProfit = "THB 0.00";
      kpis.dailyChange = "0.00%";
    }
  }

  navRows = rowsToObjects(datasets.nav).map(row => [
    row.Date,
    numberFrom(row.Daily_Invested_THB),
    numberFrom(row.Cumulative_NAV_THB),
    numberFrom(row.Daily_Change_Percent) / 100,
    numberFrom(row.Drawdown_Percent) / 100
  ]).filter(row => row[2] > 0);

  if (navRows.length >= 2) {
    const latest = navRows[navRows.length - 1];
    const previous = navRows[navRows.length - 2];
    const previousNav = numberFrom(previous[2]);
    const latestNav = numberFrom(latest[2]);
    const cashFlowToday = numberFrom(latest[1]);
    const marketProfitToday = latestNav - previousNav - cashFlowToday;
    kpis.dailyProfit = signedThb(marketProfitToday);
    kpis.dailyChange = signedPercent(previousNav ? (marketProfitToday / previousNav) * 100 : 0);
  }

  monthly = rowsToObjects(datasets.monthly).map(row => {
    const date = new Date(Number(row.Year), Number(row.Month) - 1, 1);
    return {
      label: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", " '"),
      value: numberFrom(row.Avg_NAV_THB)
    };
  }).filter(item => item.value > 0);

  signals = signalRows.slice(0, 6).map(row => {
    const trend = row.totalTrend || "Neutral";
    const signal = cleanSignal(row.signal);
    const tone = /bullish|buy|accumulate/i.test(`${trend} ${signal}`) ? "positive" : /down|sell|reduce|overbought/i.test(`${trend} ${signal}`) ? "caution" : "neutral";
    return {
      title: row.ticker || "Market Signal",
      text: `${trend} - ${signal}`,
      status: tone === "positive" ? "POSITIVE" : tone === "caution" ? "CAUTION" : "NEUTRAL",
      tone
    };
  });
}

function renderAll() {
  renderKpis();
  renderSparklines();
  renderNavChart();
  renderAllocation();
  renderMonthly();
  renderHoldings();
  renderSignals();
  renderSmartDca();
  renderHealth();
  renderAlerts();
}

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
    renderAll();
    const now = new Date();
    setText("updatedAt", `Updated ${now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`);
    setText("sideSync", "Live");
    setText("marketOpenLabel", "Sheet Live");
    document.getElementById("syncMeter").style.width = "92%";
  } catch (error) {
    console.warn(error);
    setText("updatedAt", "Using saved data. Check sheet publish access.");
    setText("sideSync", "Saved");
    setText("marketOpenLabel", "Saved Data");
    document.getElementById("syncMeter").style.width = "54%";
    renderAll();
  }
}

function bindInteractions() {
  const search = document.getElementById("holdingSearch");
  document.getElementById("assetTabs").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    document.querySelectorAll("#assetTabs button").forEach(tab => tab.classList.toggle("active", tab === button));
    renderHoldings(button.dataset.filter, search.value);
  });
  document.getElementById("allocationView").addEventListener("change", event => {
    allocationMode = event.target.value;
    renderAllocation();
  });
  search.addEventListener("input", () => renderHoldings(activeFilter, search.value));
  document.getElementById("refreshButton").addEventListener("click", loadLiveData);
  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = document.body.dataset.theme === "light" ? "dark" : "light";
    setTheme(next);
  });
  document.getElementById("dcaBudgetInput").addEventListener("input", renderSmartDca);
  document.getElementById("useCashButton").addEventListener("click", () => {
    const input = document.getElementById("dcaBudgetInput");
    input.value = kpis.cash || "";
    renderSmartDca();
  });
  document.querySelectorAll("[data-jump]").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.jump === "overview") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(button.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      document.querySelectorAll("[data-jump]").forEach(item => item.classList.toggle("active", item.dataset.jump === button.dataset.jump));
    });
  });
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  try {
    localStorage.setItem("portfolioTheme", theme);
  } catch (error) {
    console.warn(error);
  }
}

function initTheme() {
  try {
    setTheme(localStorage.getItem("portfolioTheme") || "dark");
  } catch (error) {
    setTheme("dark");
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHtml(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

initTheme();
renderAll();
bindInteractions();
loadLiveData();
