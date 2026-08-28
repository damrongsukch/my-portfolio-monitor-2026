const SHEET_ID = "1rV26pJqw8rMNO0nplvE9K0gsMCotfZ4dgvXs5kgRFDk";
const PAGE_SIZE = 50;
const logos = { VOO: "./assets/logos/vanguard.svg", SPMO: "./assets/logos/spmo.png", VXUS: "./assets/logos/vanguard.svg", SCHD: "./assets/logos/schd.svg", NVDA: "https://cdn.simpleicons.org/nvidia/76B900", GOOGL: "./assets/logos/google.svg", META: "https://cdn.simpleicons.org/meta/0866FF", AVGO: "https://cdn.simpleicons.org/broadcom/CC092F", TSM: "./assets/logos/tsmc.png", LLY: "./assets/logos/lly.svg", PLTR: "https://cdn.simpleicons.org/palantir/FFFFFF", QQQI: "./assets/logos/neos.jpg", IAUI: "./assets/logos/neos.jpg", MLPI: "./assets/logos/neos.jpg", RKLB: "./assets/logos/rklb.jpg" };

let trades = [];
let currentPrices = new Map();
let page = 1;
let activeRange = "all";

function numberFrom(value) { return Number(String(value == null ? 0 : value).replace(/[^\d.-]/g, "")) || 0; }
function fmtThb(value) { return "THB " + numberFrom(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtUsd(value) { return "$" + numberFrom(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtCompactThb(value) { return "THB " + numberFrom(value).toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function dateFrom(value) {
  const date = new Date(String(value || ""));
  return Number.isNaN(date.getTime()) ? null : date;
}
function dateLabel(value) { return value ? value.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"; }
function monthKey(date) { return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0"); }
function monthLabel(key) { const parts = key.split("-").map(Number); return new Date(parts[0], parts[1] - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }); }
function shortMonthLabel(key) { const parts = key.split("-").map(Number); return new Date(parts[0], parts[1] - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", " '"); }
function logo(ticker) { const src = logos[ticker]; return src ? '<img class="history-logo" src="' + src + '" alt="" onerror="this.style.display=\'none\'">' : '<span class="history-fallback">' + ticker.slice(0, 2) + '</span>'; }
function rowAny(row, names, fallback) { for (const key of names) if (row[key] != null && row[key] !== "") return row[key]; return fallback; }
function signedUsd(value) { return (value > 0 ? "+" : "") + fmtUsd(value); }
function signedPercent(value) { return (value > 0 ? "+" : "") + numberFrom(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"; }
function signedPricePercent(value) { return (value > 0 ? "+" : "") + numberFrom(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"; }

function fetchSheet(sheetName = "Trade_Log") {
  return new Promise((resolve, reject) => {
    const callback = "tradeHistory_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    const element = document.createElement("script");
    const timeout = setTimeout(() => { cleanup(); reject(new Error(sheetName + " timed out")); }, 12000);
    function cleanup() { clearTimeout(timeout); delete window[callback]; element.remove(); }
    window[callback] = payload => {
      cleanup();
      const table = payload && payload.table;
      if (!table) { reject(new Error(sheetName + " unavailable")); return; }
      const headers = (table.cols || []).map((col, index) => col.label || "Column_" + index);
      resolve((table.rows || []).map(row => Object.fromEntries(headers.map((header, index) => [header, row.c && row.c[index] ? (row.c[index].f != null ? row.c[index].f : row.c[index].v) : ""]))));
    };
    element.src = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?sheet=" + encodeURIComponent(sheetName) + "&headers=1&tqx=responseHandler:" + callback + "&cacheBust=" + Date.now();
    element.onerror = () => { cleanup(); reject(new Error(sheetName + " unavailable")); };
    document.head.appendChild(element);
  });
}

function normalizedRows(rows) {
  return rows.map(row => {
    const date = dateFrom(rowAny(row, ["Date", "Transaction Date"], ""));
    const rawType = String(rowAny(row, ["Transaction Type", "Transaction_Type", "Type"], "Buy")).trim();
    const ticker = String(rowAny(row, ["Ticker", "Symbol"], "N/A")).trim().toUpperCase();
    return {
      date,
      timestamp: date ? date.getTime() : 0,
      ticker,
      type: /^sell$/i.test(rawType) ? "Sell" : /^buy$/i.test(rawType) ? "Buy" : rawType || "Other",
      shares: numberFrom(rowAny(row, ["Shares", "Quantity"], 0)),
      priceUsd: numberFrom(rowAny(row, ["Price/Share ($)", "Price Per Share", "Price"], 0)),
      totalUsd: numberFrom(rowAny(row, ["Total Amount (USD)", "Total_Amount_USD"], 0)),
      totalThb: numberFrom(rowAny(row, ["Total Amount (THB)", "Total_Amount_THB"], 0))
    };
  }).filter(item => item.date && item.ticker !== "N/A").sort((a, b) => b.timestamp - a.timestamp);
}

function currentPriceMap(rows) {
  return new Map(rows.map(row => [String(rowAny(row, ["Ticker", "Symbol"], "")).trim().toUpperCase(), numberFrom(rowAny(row, ["Current_Price_USD", "Current Price USD", "Price"], 0))]).filter(([ticker, price]) => ticker && price > 0));
}

function priceComparison(item) {
  const current = currentPrices.get(item.ticker);
  if (item.type !== "Buy" || !current || !item.priceUsd || !item.shares) return null;
  const perShare = current - item.priceUsd;
  return { current, amount: perShare * item.shares, percent: perShare / item.priceUsd * 100 };
}

function priceMarkup(item) {
  const comparison = priceComparison(item);
  if (!comparison) return '<strong>' + fmtUsd(item.priceUsd) + '</strong><small>Current unavailable</small>';
  const tone = comparison.percent > 0 ? "positive" : comparison.percent < 0 ? "negative" : "neutral";
  return '<strong>' + fmtUsd(item.priceUsd) + '</strong><small class="' + tone + '">Now ' + fmtUsd(comparison.current) + ' (' + signedPricePercent(comparison.percent) + ')</small>';
}

function profitMarkup(item) {
  const comparison = priceComparison(item);
  if (!comparison) return { className: "neutral", html: '<strong>-</strong><small>Buy orders only</small>' };
  const className = comparison.amount > 0 ? "positive" : comparison.amount < 0 ? "negative" : "neutral";
  return { className, html: '<strong>' + signedUsd(comparison.amount) + '</strong><small>' + signedPercent(comparison.percent) + '</small>' };
}

function rangeStart(rows) {
  if (activeRange === "all") return null;
  const latest = rows.reduce((max, item) => Math.max(max, item.timestamp), 0);
  if (!latest) return null;
  const days = activeRange === "this-month" ? null : activeRange === "30d" ? 30 : 90;
  const start = new Date(latest);
  if (activeRange === "this-month") {
    start.setDate(1); start.setHours(0, 0, 0, 0);
    return start.getTime();
  }
  return latest - days * 24 * 60 * 60 * 1000;
}

function populateFilters() {
  const month = document.getElementById("historyMonthFilter"), ticker = document.getElementById("historyTickerFilter");
  const keepMonth = month.value || "All", keepTicker = ticker.value || "All";
  const months = [...new Set(trades.map(item => monthKey(item.date)))].sort().reverse();
  const tickers = [...new Set(trades.map(item => item.ticker))].sort();
  month.innerHTML = '<option value="All">All months</option>' + months.map(value => '<option value="' + value + '">' + monthLabel(value) + '</option>').join("");
  ticker.innerHTML = '<option value="All">All assets</option>' + tickers.map(value => '<option value="' + value + '">' + value + '</option>').join("");
  month.value = months.includes(keepMonth) ? keepMonth : "All";
  ticker.value = tickers.includes(keepTicker) ? keepTicker : "All";
}

function filtered() {
  const month = document.getElementById("historyMonthFilter").value;
  const ticker = document.getElementById("historyTickerFilter").value;
  const type = document.getElementById("historyTypeFilter").value;
  const start = rangeStart(trades);
  return trades.filter(item =>
    (month === "All" || monthKey(item.date) === month) &&
    (ticker === "All" || item.ticker === ticker) &&
    (type === "All" || item.type === type) &&
    (!start || item.timestamp >= start)
  );
}

function updateQuickButtons() {
  document.querySelectorAll("#historyQuickFilters button").forEach(button => button.classList.toggle("active", button.dataset.range === activeRange));
}

function renderMonthlyInsight(rows) {
  const container = document.getElementById("historyMonthStats");
  const title = document.getElementById("historyMonthTitle");
  if (!container || !title) return;
  const selectedMonth = document.getElementById("historyMonthFilter").value;
  const buys = rows.filter(item => item.type === "Buy");
  const key = selectedMonth !== "All" ? selectedMonth : (buys[0] ? monthKey(buys[0].date) : null);
  const monthBuys = key ? buys.filter(item => monthKey(item.date) === key) : [];
  const total = monthBuys.reduce((sum, item) => sum + item.totalThb, 0);
  const top = Object.values(monthBuys.reduce((map, item) => {
    map[item.ticker] = map[item.ticker] || { ticker: item.ticker, total: 0 };
    map[item.ticker].total += item.totalThb;
    return map;
  }, {})).sort((a, b) => b.total - a.total)[0];
  title.textContent = key ? shortMonthLabel(key) : "No activity";
  container.innerHTML = [
    ["Buy total", fmtThb(total)],
    ["Orders", monthBuys.length],
    ["Avg order", fmtThb(monthBuys.length ? total / monthBuys.length : 0)],
    ["Top asset", top ? top.ticker + " · " + fmtCompactThb(top.total) : "-"]
  ].map(item => '<div class="history-mini"><span>' + item[0] + '</span><strong>' + item[1] + '</strong></div>').join("");
}

function renderAssetSpend(rows) {
  const container = document.getElementById("historyAssetSpend");
  if (!container) return;
  const groups = Object.values(rows.filter(item => item.type === "Buy").reduce((map, item) => {
    map[item.ticker] = map[item.ticker] || { ticker: item.ticker, totalThb: 0, totalUsd: 0, shares: 0, count: 0 };
    map[item.ticker].totalThb += item.totalThb;
    map[item.ticker].totalUsd += item.totalUsd;
    map[item.ticker].shares += item.shares;
    map[item.ticker].count += 1;
    return map;
  }, {})).sort((a, b) => b.totalThb - a.totalThb);
  if (!groups.length) { container.innerHTML = '<div class="empty">No buy orders in this view.</div>'; return; }
  const max = Math.max(...groups.map(group => group.totalThb), 1);
  container.innerHTML = groups.map(group => {
    const avg = group.shares ? group.totalUsd / group.shares : 0;
    const width = Math.max(3, Math.round(group.totalThb / max * 100));
    return '<div class="history-spend-row"><span class="history-spend-asset">' + logo(group.ticker) + '<b>' + group.ticker + '</b></span><span class="history-spend-track"><i style="width:' + width + '%"></i></span><strong>' + fmtThb(group.totalThb) + '<small>' + group.count + ' buys · Avg ' + fmtUsd(avg) + '</small></strong></div>';
  }).join("");
}

function renderInsights(rows) {
  renderMonthlyInsight(rows);
  renderAssetSpend(rows);
}

function render() {
  populateFilters();
  updateQuickButtons();
  const rows = filtered();
  const buys = rows.filter(item => item.type === "Buy");
  const total = buys.reduce((sum, item) => sum + item.totalThb, 0);
  const latest = rows[0];
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  page = Math.min(page, pageCount);
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  document.getElementById("historySummary").innerHTML = [["Transactions", rows.length], ["Buy total", fmtThb(total)], ["Average order", fmtThb(buys.length ? total / buys.length : 0)], ["Latest activity", latest ? dateLabel(latest.date) : "-"]].map(item => '<div class="history-summary-item"><span>' + item[0] + '</span><strong>' + item[1] + '</strong></div>').join("");
  renderInsights(rows);
  document.getElementById("historyCount").textContent = rows.length + " transaction" + (rows.length === 1 ? "" : "s") + " · Showing " + (visible.length ? ((page - 1) * PAGE_SIZE + 1) + "-" + ((page - 1) * PAGE_SIZE + visible.length) : "0");
  const empty = '<tr><td colspan="7">No transactions match these filters.</td></tr>';
  document.getElementById("historyTableBody").innerHTML = visible.map(item => {
    const profit = profitMarkup(item);
    return '<tr><td>' + dateLabel(item.date) + '</td><td><span class="history-asset">' + logo(item.ticker) + '<strong>' + item.ticker + '</strong></span></td><td><span class="history-type ' + item.type.toLowerCase() + '">' + item.type + '</span></td><td>' + item.shares.toFixed(6) + '</td><td class="history-price-cell">' + priceMarkup(item) + '</td><td class="history-change ' + profit.className + '">' + profit.html + '</td><td><strong>' + fmtThb(item.totalThb) + '</strong><small>' + fmtUsd(item.totalUsd) + '</small></td></tr>';
  }).join("") || empty;
  document.getElementById("historyMobileList").innerHTML = visible.map(item => {
    const comparison = priceComparison(item);
    const profit = profitMarkup(item);
    const now = comparison ? fmtUsd(comparison.current) : "-";
    const comparisonClass = comparison ? profit.className : "neutral";
    return '<article class="history-mobile-item"><div><span class="history-mobile-date">' + dateLabel(item.date) + '</span><span class="history-type ' + item.type.toLowerCase() + '">' + item.type + '</span></div><div class="history-mobile-main">' + logo(item.ticker) + '<strong>' + item.ticker + '</strong><span>' + item.shares.toFixed(6) + ' shares</span><b>' + fmtThb(item.totalThb) + '</b></div><div class="history-mobile-stats"><span>Buy<strong>' + fmtUsd(item.priceUsd) + '</strong></span><span>Now<strong>' + now + '</strong></span><span class="' + comparisonClass + '">P/L<strong>' + (comparison ? signedUsd(comparison.amount) : '-') + '</strong><small>' + (comparison ? signedPercent(comparison.percent) : '') + '</small></span></div></article>';
  }).join("") || '<div class="empty">No transactions match these filters.</div>';
  document.getElementById("historyPageLabel").textContent = "Page " + page + " of " + pageCount;
  document.getElementById("historyPrevious").disabled = page === 1;
  document.getElementById("historyNext").disabled = page === pageCount;
}

function resetAndRender() { page = 1; render(); }
document.getElementById("historyMonthFilter").addEventListener("change", () => { activeRange = "all"; resetAndRender(); });
document.getElementById("historyTickerFilter").addEventListener("change", resetAndRender);
document.getElementById("historyTypeFilter").addEventListener("change", resetAndRender);
document.getElementById("historyClearFilters").addEventListener("click", () => { ["historyMonthFilter", "historyTickerFilter", "historyTypeFilter"].forEach(id => document.getElementById(id).value = "All"); activeRange = "all"; resetAndRender(); });
document.getElementById("historyPrevious").addEventListener("click", () => { page--; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
document.getElementById("historyNext").addEventListener("click", () => { page++; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
document.querySelectorAll("#historyQuickFilters button").forEach(button => button.addEventListener("click", () => { activeRange = button.dataset.range || "all"; document.getElementById("historyMonthFilter").value = "All"; resetAndRender(); }));

Promise.all([fetchSheet("Trade_Log"), fetchSheet("Looker_Holdings")]).then(([tradeRows, holdingRows]) => {
  trades = normalizedRows(tradeRows);
  currentPrices = currentPriceMap(holdingRows);
  document.getElementById("historyStatus").textContent = "Trade Log synced · " + trades.length + " records · Current prices loaded";
  render();
}).catch(() => {
  document.getElementById("historyStatus").textContent = "Trade Log unavailable";
  document.getElementById("historyTableBody").innerHTML = '<tr><td colspan="7">Could not load Trade Log. Try again shortly.</td></tr>';
});
