let navRows = [
  [46098,66.25498349563254,65.54880171494062,0,0],[46099,56.150858308896865,121.39221337639256,-0.004690347335134643,0],[46100,0,119.345620745,-0.01685934026960054,-0.01685934026960054],[46101,292.8144215590037,405.313515900941,-0.05736721934432154,0],[46102,0,405.313515900941,0,0],[46103,0,405.313515900941,0,0],[46104,82.21995793395871,483.0771110697756,-0.010994853589371243,0],[46105,227.753469127404,711.8797439561399,0.002171834961579854,0],[46106,498.9336527820509,1224.930287455628,0.019830443045036426,0],[46107,229.80017511498605,1418.2469920963683,-0.02978411983756863,0],[46108,51.589928723848246,1452.907083644384,-0.0119371571173282,0],[46109,0,1436.768069529703,-0.011108084127581564,-0.011108084127581564],[46110,0,1436.768069529703,0,-0.011108084127581564],[46111,74.52339116090401,1505.7150052985462,-0.0038812495282458826,0],[46112,291.4294,1853.8608347884808,-0.0051,0],[46113,0,1876.9636979908005,0.012462026689805904,0],[46114,0,1879.8015466101824,0.0015119358048424076,0],[46115,0,1882.6817332587452,0.0015321759117375114,0],[46116,0,1880.088298439733,-0.0013775216348029008,-0.0013775216348029008],[46117,0,1880.088298439733,0,-0.0013775216348029008],[46118,416.6273352208,2304.8233840886405,0.004312430663408739,0],[46119,0,2296.7295306321603,-0.003511702246842948,-0.003511702246842948],[46120,0,2709.536741302776,0.17973697170906897,0],[46121,0,2710.508900742524,0.0003587917539292929,0],[46122,0,2727.5700400211267,0.00629444134049105,0],[46123,0,2727.5700400211267,0,0],[46124,0,2736.7450424214044,0.0033638008431147734,0],[46125,274.05801149414003,3022.0567729487125,0.004112081636662455,0],[46126,0,3081.0995102015218,0.01953726937935699,-0.0008012840278320221],[46127,0,3108.4147075244464,0.008865405752876206,0],[46128,0,3117.173757330765,0.00281785110111463,0],[46129,0,3175.103937448087,0.018584199864086985,0],[46130,0,3175.103937448087,0,0],[46131,0,3174.1153947454372,-0.0003113418401805944,-0.0003113418401805944],[46132,0,3161.503187937336,-0.003973455668618748,-0.004283560405799598],[46133,0,3150.2215779796966,-0.003568432257378128,-0.007836707068049243],[46134,400.2216890995499,3630.9917798032498,0.02556915782910124,0],[46135,0,3602.684668605876,-0.007795972261580684,-0.007795972261580684],[46136,336.15291180430313,3983.469672595845,0.012388564720802247,0],[46137,0,3982.210530115173,-0.0003160918957998243,-0.0003160918957998243],[46138,0,3982.210530115173,0,-0.0003160918957998243],[46139,0,4023.9428453945375,0.010479685833726438,0],[46140,0,3985.163864411158,-0.009637060582946026,-0.009637060582946026],[46141,0,3995.20668294222,0.002520051589533696,-0.007141294883252816],[46142,351.1072617629201,4370.235924649188,0.005987670186422254,0],[46143,129.99998540299956,4513.059646149445,0.0029343349691783862,0],[46144,0,4514.861523356245,0.0003992584517107455,0],[46145,0,4514.861523356245,0,0],[46146,0,4943.279138362874,0.09489053269747968,0],[46147,0,5045.199087860011,0.020617882713961252,0],[46148,0,5166.599503708072,0.02406256199882783,0],[46149,0,5166.255293064811,-0.00006662228086659492,-0.00006662228086659492],[46150,0,5310.83306694159,0.027985023130943736,0]
];

let holdings = [
  { ticker: "SPMO", layer: "Core", shares: "0.1112111", price: "$143.81", value: 515.03, valueText: "\u0e3f515.03", pl: "26.53%", weight: 9.70, signal: "STRONG BUY" },
  { ticker: "SCHD", layer: "Core", shares: "0.4566078", price: "$31.62", value: 464.94, valueText: "\u0e3f464.94", pl: "3.35%", weight: 8.75, signal: "HOLD" },
  { ticker: "NVDA", layer: "Growth", shares: "0.1634117", price: "$215.22", value: 1132.56, valueText: "\u0e3f1,132.56", pl: "14.97%", weight: 21.32, signal: "HOLD" },
  { ticker: "GOOGL", layer: "Growth", shares: "0.0317128", price: "$400.71", value: 409.22, valueText: "\u0e3f409.22", pl: "37.08%", weight: 7.70, signal: "STRONG BUY" },
  { ticker: "PLTR", layer: "Growth", shares: "0.1481048", price: "$137.80", value: 657.23, valueText: "\u0e3f657.23", pl: "-3.74%", weight: 12.37, signal: "HOLD" },
  { ticker: "TSM", layer: "Growth", shares: "0.0414339", price: "$411.68", value: 549.30, valueText: "\u0e3f549.30", pl: "18.29%", weight: 10.34, signal: "BUY" },
  { ticker: "QQQI", layer: "Growth", shares: "0.2030812", price: "$56.50", value: 369.50, valueText: "\u0e3f369.50", pl: "7.94%", weight: 6.96, signal: "HOLD" },
  { ticker: "IAUI", layer: "Safe", shares: "0.2208413", price: "$57.23", value: 407.01, valueText: "\u0e3f407.01", pl: "1.35%", weight: 7.66, signal: "HOLD" },
  { ticker: "IDVO", layer: "Safe", shares: "0.2626505", price: "$42.80", value: 362.01, valueText: "\u0e3f362.01", pl: "2.29%", weight: 6.82, signal: "HOLD" },
  { ticker: "RKLB", layer: "Alpha", shares: "0.1307652", price: "$105.55", value: 444.47, valueText: "\u0e3f444.47", pl: "44.54%", weight: 8.37, signal: "HOLD" },
  { ticker: "CASH", layer: "Safe", shares: "0.0000000", price: "$0.00", value: 0, valueText: "\u0e3f0.00", pl: "-", weight: 0, signal: "HOLD" }
];

let signals = [
  { title: "US Market Trend", text: "MODE A active, broad trend supportive", status: "BULLISH", tone: "bullish" },
  { title: "Momentum", text: "Most growth holdings above trend filters", status: "POSITIVE", tone: "positive" },
  { title: "Volatility", text: "Daily volatility 1.90%", status: "CAUTION", tone: "caution" },
  { title: "Max Drawdown", text: "Current max drawdown -1.69%", status: "NEUTRAL", tone: "neutral" },
  { title: "Smart DCA", text: "Strong buy signals visible on selected holdings", status: "ACTIVE", tone: "positive" }
];

let monthly = [
  { label: "Mar '26", value: 869.76 },
  { label: "Apr '26", value: 3044.47 },
  { label: "May '26", value: 4896.87 }
];

let kpis = {
  portfolioValue: "\u0e3f5,311.28",
  invested: "\u0e3f4,700.03",
  profit: "\u0e3f611.25",
  totalReturn: "13.01%",
  irr: "361.54%",
  dailyProfit: "\u0e3f161.75",
  dailyChange: "2.955%",
  cash: "\u0e3f0.00",
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

const colors = ["#0b4f9f", "#2f9e55", "#e5a91a", "#6d63c7", "#98a2b3", "#3b82f6", "#14b8a6"];

function excelDateToJs(serial) {
  if (serial instanceof Date) return serial;
  if (typeof serial === "string") {
    const parsed = new Date(serial);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const utcDays = Math.floor(serial - 25569);
  return new Date(utcDays * 86400 * 1000);
}

function numberFrom(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function percentText(value) {
  const text = String(value || "").trim();
  return text ? text : "0.00%";
}

function moneyText(value) {
  const text = String(value || "").trim();
  return text || "\u0e3f0.00";
}

function plusMoneyText(value) {
  const text = moneyText(value);
  return text.startsWith("-") || text.startsWith("+") ? text : `+${text}`;
}

function plusPercentText(value) {
  const text = percentText(value);
  return text.startsWith("-") || text.startsWith("+") ? text : `+${text}`;
}

function cleanSignal(value) {
  return String(value || "HOLD").replace(/[^\w\s()%/-]+/g, "").trim() || "HOLD";
}

async function fetchSheet(sheetName) {
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

function rowsToObjects(rows) {
  const [headers, ...body] = rows;
  return body.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function kpiValue(rows, metric, fallback = "") {
  const found = rows.find(row => row.Metric === metric);
  return found && found.Value ? found.Value : fallback;
}

function pathFromPoints(points) {
  return points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(" ");
}

function scalePoints(data, width, height, padding, valueGetter) {
  const values = data.map(valueGetter);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return data.map((row, index) => {
    const x = padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
    const y = padding.top + (1 - ((valueGetter(row) - min) / span)) * (height - padding.top - padding.bottom);
    return [x, y];
  });
}

function drawSparkline(svg, values, color = "currentColor") {
  const width = 260;
  const height = 44;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((value, index) => [
    4 + (index / (values.length - 1)) * (width - 8),
    6 + (1 - ((value - min) / span)) * (height - 12)
  ]);
  svg.innerHTML = `<path d="${pathFromPoints(points)}" fill="none" stroke="${color}" stroke-width="3"/>`;
}

function renderSparklines() {
  const nav = navRows.map(row => row[2]);
  document.querySelectorAll("[data-spark]").forEach((svg, index) => {
    const data = index === 0 ? nav : nav.map((value, i) => value - (navRows[i][1] * 5));
    drawSparkline(svg, data, "currentColor");
  });
}

function renderKpis() {
  document.getElementById("portfolioValue").textContent = kpis.portfolioValue;
  document.getElementById("investedLabel").textContent = `vs invested ${kpis.invested}`;
  document.getElementById("profitLabel").textContent = `${plusMoneyText(kpis.profit)} (${plusPercentText(kpis.totalReturn)})`;
  document.getElementById("gainValue").textContent = plusMoneyText(kpis.profit);
  document.getElementById("dailyProfitLabel").textContent = `${plusMoneyText(kpis.dailyProfit)} today`;
  document.getElementById("returnValue").textContent = plusPercentText(kpis.totalReturn);
  document.getElementById("irrLabel").textContent = `IRR ${kpis.irr}`;
  document.getElementById("dailyChangeLabel").textContent = `Daily change ${plusPercentText(kpis.dailyChange)}`;
  document.getElementById("cashValue").textContent = kpis.cash;
  document.getElementById("cashWeightLabel").textContent = `${kpis.cashWeight} of portfolio`;
  document.getElementById("marketModeLabel").textContent = `Market mode ${kpis.marketMode}`;
  document.getElementById("tableTotalValue").textContent = kpis.portfolioValue;
  document.getElementById("tableTotalReturn").textContent = plusPercentText(kpis.totalReturn);
  document.getElementById("tableMode").textContent = kpis.marketMode;
}

function renderNavChart() {
  const svg = document.getElementById("navChart");
  const width = 740;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 48, left: 66 };
  const cumulativeInvested = [];
  navRows.reduce((sum, row, index) => {
    cumulativeInvested[index] = sum + row[1];
    return cumulativeInvested[index];
  }, 0);
  const values = navRows.map(row => row[2]);
  const maxForScale = Math.max(...values, ...cumulativeInvested);
  const scaleY = value => padding.top + (1 - (value / maxForScale)) * (height - padding.top - padding.bottom);
  const navPoints = navRows.map((row, index) => [
    padding.left + (index / (navRows.length - 1)) * (width - padding.left - padding.right),
    scaleY(row[2])
  ]);
  const investedPoints = cumulativeInvested.map((value, index) => [
    padding.left + (index / (cumulativeInvested.length - 1)) * (width - padding.left - padding.right),
    scaleY(value)
  ]);
  const min = 0;
  const max = Math.ceil(maxForScale / 1000) * 1000;
  const grid = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const y = padding.top + ratio * (height - padding.top - padding.bottom);
    const label = Math.round(max * (1 - ratio) / 1000) + "K";
    return `<line class="chart-grid" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"/><text class="axis-text" x="16" y="${y + 4}">${label}</text>`;
  }).join("");
  const ticks = [0, 14, 31, 45, navRows.length - 1].map(index => {
    const date = excelDateToJs(navRows[index][0]);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const x = padding.left + (index / (navRows.length - 1)) * (width - padding.left - padding.right);
    return `<text class="muted-text" x="${x - 22}" y="${height - 16}">${label}</text>`;
  }).join("");
  const area = `${pathFromPoints(navPoints)} L${navPoints[navPoints.length - 1][0]} ${height - padding.bottom} L${navPoints[0][0]} ${height - padding.bottom} Z`;
  svg.innerHTML = `
    <defs><linearGradient id="navGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0f4fd8" stop-opacity=".14"/><stop offset="1" stop-color="#0f4fd8" stop-opacity="0"/></linearGradient></defs>
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
  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");
}

function renderAllocation() {
  const grouped = holdings.reduce((acc, item) => {
    acc[item.layer] = (acc[item.layer] || 0) + item.value;
    return acc;
  }, {});
  const entries = Object.entries(grouped).filter(([, value]) => value > 0);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  let angle = 0;
  document.getElementById("allocationChart").innerHTML = entries.map(([layer, value], index) => {
    const next = angle + (value / total) * 360;
    const path = donutSegment(120, 120, 104, 56, angle, next);
    angle = next;
    return `<path d="${path}" fill="${colors[index]}" stroke="#fff" stroke-width="3"/>`;
  }).join("");
  document.getElementById("allocationLegend").innerHTML = entries.map(([layer, value], index) => {
    const pct = (value / total * 100).toFixed(1);
    return `<div class="allocation-row"><i class="swatch" style="background:${colors[index]}"></i><span>${layer}</span><strong>${pct}%</strong></div>`;
  }).join("") + `<div class="allocation-row"><i></i><span>Total</span><strong>100.0%</strong></div>`;
}

function renderMonthly() {
  const svg = document.getElementById("monthlyChart");
  const width = 640;
  const height = 280;
  const padding = { top: 22, right: 18, bottom: 42, left: 46 };
  const max = Math.max(...monthly.map(item => item.value));
  const plotH = height - padding.top - padding.bottom;
  const barW = 42;
  const gap = (width - padding.left - padding.right) / monthly.length;
  const grid = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const y = padding.top + ratio * plotH;
    return `<line class="chart-grid" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"/><text class="muted-text" x="6" y="${y + 4}">${Math.round(max * (1 - ratio) / 1000)}K</text>`;
  }).join("");
  const bars = monthly.map((item, index) => {
    const x = padding.left + index * gap + gap / 2 - barW / 2;
    const h = (item.value / max) * plotH;
    const y = padding.top + plotH - h;
    const benchH = h * 0.72;
    const benchY = padding.top + plotH - benchH;
    return `
      <rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="#2f9e55" rx="3"/>
      <rect x="${x + barW + 10}" y="${benchY}" width="${barW}" height="${benchH}" fill="#b8bec8" rx="3"/>
      <text class="axis-text" x="${x - 5}" y="${y - 8}">\u0e3f${Math.round(item.value).toLocaleString()}</text>
      <text class="muted-text" x="${x + 4}" y="${height - 14}">${item.label}</text>
    `;
  }).join("");
  svg.innerHTML = `${grid}${bars}`;
}

function signalBadge(signal) {
  const normalized = signal.toLowerCase();
  const cls = normalized.includes("strong") ? "strong" : normalized.includes("buy") ? "buy" : normalized.includes("reduce") ? "reduce" : "hold";
  return `<span class="badge ${cls}">${signal}</span>`;
}

function renderHoldings(filter = "All", query = "") {
  const search = query.trim().toLowerCase();
  const filtered = holdings.filter(item => {
    const matchesLayer = filter === "All" || item.layer === filter;
    const matchesSearch = !search || `${item.ticker} ${item.layer} ${item.signal}`.toLowerCase().includes(search);
    return matchesLayer && matchesSearch;
  });
  document.getElementById("holdingsBody").innerHTML = filtered.map(item => {
    const plClass = item.pl.startsWith("-") ? "negative" : item.pl === "-" ? "" : "positive";
    return `<tr>
      <td><strong>${item.ticker}</strong></td>
      <td>${item.layer}</td>
      <td>${item.shares}</td>
      <td>${item.price}</td>
      <td>${item.valueText}</td>
      <td>${item.weight.toFixed(2)}%</td>
      <td class="${plClass}">${item.pl}</td>
      <td>${signalBadge(item.signal)}</td>
    </tr>`;
  }).join("");
}

function renderSignals() {
  const icons = {
    bullish: `<path d="M5 15l5-5 3 3 6-7"/><path d="M14 6h5v5"/>`,
    positive: `<path d="M5 19V9M12 19V5M19 19v-8"/><path d="M5 9l7-4 7 6"/>`,
    caution: `<path d="M12 7v6"/><path d="M12 17h.01"/>`,
    neutral: `<path d="M12 22s8-4 8-11V6l-8-3-8 3v5c0 7 8 11 8 11z"/>`
  };
  document.getElementById("signalsList").innerHTML = signals.map(signal => `
    <div class="signal-row">
      <div class="signal-icon ${signal.tone === "caution" ? "amber-bg" : signal.tone === "neutral" ? "neutral-bg" : "green-bg"}" style="background:${signal.tone === "caution" ? "#e9a20d" : signal.tone === "neutral" ? "#64748b" : "#2f9e55"}"><svg viewBox="0 0 24 24">${icons[signal.tone] || icons.positive}</svg></div>
      <div><h3>${signal.title}</h3><p>${signal.text}</p></div>
      <span class="status ${signal.tone}">${signal.status}</span>
      <svg class="chev" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
    </div>
  `).join("");
}

function applyLiveData(datasets) {
  const kpiRows = rowsToObjects(datasets.kpi);
  kpis = {
    portfolioValue: moneyText(kpiValue(kpiRows, "Portfolio Value THB", kpis.portfolioValue)),
    invested: moneyText(kpiValue(kpiRows, "Total Invested THB", kpis.invested)),
    profit: moneyText(kpiValue(kpiRows, "Total Profit THB", kpis.profit)),
    totalReturn: percentText(kpiValue(kpiRows, "Total Return %", kpis.totalReturn)),
    irr: percentText(kpiValue(kpiRows, "IRR", kpis.irr)),
    dailyProfit: moneyText(kpiValue(kpiRows, "Daily Profit THB", kpis.dailyProfit)),
    dailyChange: percentText(kpiValue(kpiRows, "Daily Change %", kpis.dailyChange)),
    cash: kpis.cash,
    cashWeight: kpis.cashWeight,
    marketMode: kpiValue(kpiRows, "Market Mode", kpis.marketMode)
  };

  const holdingRows = rowsToObjects(datasets.holdings);
  holdings = holdingRows.map(row => ({
    ticker: row.Ticker || "N/A",
    layer: row.Asset_Layer || "Core",
    shares: row.Total_Shares || "0",
    price: `$${row.Current_Price_USD || "0.00"}`,
    value: numberFrom(row.Market_Value_THB),
    valueText: moneyText(row.Market_Value_THB),
    pl: percentText(row.PL_Percent),
    weight: numberFrom(row.Weight),
    signal: cleanSignal(row.Signal)
  }));

  const cash = holdings.find(item => item.ticker === "CASH");
  if (cash) {
    kpis.cash = cash.valueText;
    kpis.cashWeight = `${cash.weight.toFixed(2)}%`;
  }

  navRows = rowsToObjects(datasets.nav).map(row => [
    row.Date,
    numberFrom(row.Daily_Invested_THB),
    numberFrom(row.Cumulative_NAV_THB),
    numberFrom(row.Daily_Change_Percent) / 100,
    numberFrom(row.Drawdown_Percent) / 100
  ]).filter(row => row[2] > 0);

  monthly = rowsToObjects(datasets.monthly).map(row => {
    const date = new Date(Number(row.Year), Number(row.Month) - 1, 1);
    return {
      label: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", " '"),
      value: numberFrom(row.Avg_NAV_THB)
    };
  }).filter(item => item.value > 0);

  signals = rowsToObjects(datasets.signals).slice(0, 5).map(row => {
    const trend = row.Total_Trend || "Neutral";
    const signal = cleanSignal(row.EMA_Signal);
    const tone = /bullish|buy|accumulate/i.test(`${trend} ${signal}`) ? "positive" : /down|sell|reduce/i.test(`${trend} ${signal}`) ? "caution" : "neutral";
    return {
      title: row.Ticker || "Market Signal",
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
}

async function loadLiveData() {
  const status = document.getElementById("dataStatus");
  status.textContent = "Loading Google Sheet...";
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
    document.getElementById("updatedAt").textContent = now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    status.textContent = "Live from Google Sheet";
  } catch (error) {
    status.textContent = "Using saved data";
    console.warn(error);
  }
}

function bindInteractions() {
  let filter = "All";
  const search = document.getElementById("holdingSearch");
  document.getElementById("assetTabs").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    filter = button.dataset.filter;
    document.querySelectorAll("#assetTabs button").forEach(tab => tab.classList.toggle("active", tab === button));
    renderHoldings(filter, search.value);
  });
  search.addEventListener("input", () => renderHoldings(filter, search.value));
  document.getElementById("refreshButton").addEventListener("click", () => {
    loadLiveData();
  });
}

renderAll();
bindInteractions();
loadLiveData();
