const SHEET_ID = "1rV26pJqw8rMNO0nplvE9K0gsMCotfZ4dgvXs5kgRFDk";
const PAGE_SIZE = 50;
const logos = { VOO: "./assets/logos/vanguard.svg", SPMO: "./assets/logos/spmo.png", VXUS: "./assets/logos/vanguard.svg", SCHD: "./assets/logos/schd.svg", NVDA: "https://cdn.simpleicons.org/nvidia/76B900", GOOGL: "./assets/logos/google.svg", META: "https://cdn.simpleicons.org/meta/0866FF", AVGO: "https://cdn.simpleicons.org/broadcom/CC092F", TSM: "./assets/logos/tsmc.png", LLY: "./assets/logos/lly.svg", PLTR: "https://cdn.simpleicons.org/palantir/FFFFFF", QQQI: "./assets/logos/neos.jpg", IAUI: "./assets/logos/neos.jpg", MLPI: "./assets/logos/neos.jpg", RKLB: "./assets/logos/rklb.jpg" };
let trades = [];
let page = 1;

function numberFrom(value) { return Number(String(value == null ? 0 : value).replace(/[^\d.-]/g, "")) || 0; }
function fmtThb(value) { return "THB " + numberFrom(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtUsd(value) { return "$" + numberFrom(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function dateFrom(value) { const date = new Date(String(value || "")); return Number.isNaN(date.getTime()) ? null : date; }
function dateLabel(value) { return value ? value.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"; }
function monthKey(date) { return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0"); }
function monthLabel(key) { const parts = key.split("-").map(Number); return new Date(parts[0], parts[1] - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }); }
function logo(ticker) { const src = logos[ticker]; return src ? '<img class="history-logo" src="' + src + '" alt="" onerror="this.style.display=\'none\'">' : '<span class="history-fallback">' + ticker.slice(0, 2) + '</span>'; }
function rowAny(row, names, fallback) { for (const key of names) if (row[key] != null && row[key] !== "") return row[key]; return fallback; }
function fetchSheet(sheetName = "Trade_Log") {
  return new Promise((resolve, reject) => {
    const callback = "tradeHistory_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    const element = document.createElement("script");
    const timeout = setTimeout(() => { cleanup(); reject(new Error("Trade Log timed out")); }, 12000);
    function cleanup() { clearTimeout(timeout); delete window[callback]; element.remove(); }
    window[callback] = payload => { cleanup(); const table = payload && payload.table; if (!table) { reject(new Error("Trade Log unavailable")); return; } const headers = (table.cols || []).map((col, index) => col.label || "Column_" + index); resolve((table.rows || []).map(row => Object.fromEntries(headers.map((header, index) => [header, row.c && row.c[index] ? (row.c[index].f != null ? row.c[index].f : row.c[index].v) : ""])))); };
    element.src = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?sheet=" + encodeURIComponent(sheetName) + "&headers=1&tqx=responseHandler:" + callback + "&cacheBust=" + Date.now();
    element.onerror = () => { cleanup(); reject(new Error("Trade Log unavailable")); };
    document.head.appendChild(element);
  });
}
function normalizedRows(rows) {
  return rows.map(row => {
    const date = dateFrom(rowAny(row, ["Date", "Transaction Date"], ""));
    const rawType = String(rowAny(row, ["Transaction Type", "Transaction_Type", "Type"], "Buy")).trim();
    const ticker = String(rowAny(row, ["Ticker", "Symbol"], "N/A")).toUpperCase(); return { date, timestamp: date ? date.getTime() : 0, ticker, type: /^sell$/i.test(rawType) ? "Sell" : /^buy$/i.test(rawType) ? "Buy" : rawType || "Other", shares: numberFrom(rowAny(row, ["Shares", "Quantity"], 0)), priceUsd: numberFrom(rowAny(row, ["Price/Share ($)", "Price Per Share", "Price"], 0)), totalUsd: numberFrom(rowAny(row, ["Total Amount (USD)", "Total_Amount_USD"], 0)), totalThb: numberFrom(rowAny(row, ["Total Amount (THB)", "Total_Amount_THB"], 0)) };
  }).filter(item => item.date && item.ticker !== "N/A").sort((a, b) => b.timestamp - a.timestamp);
}
function currentPriceMap(rows) { return new Map(rows.map(row => [String(rowAny(row, ["Ticker", "Symbol"], "")).trim().toUpperCase(), numberFrom(rowAny(row, ["Current_Price_USD", "Current Price USD", "Price"], 0))]).filter(([ticker, price]) => ticker && price > 0)); }
function priceChange(item) { const current = currentPrices.get(item.ticker); if (!current || !item.priceUsd) return null; const amount = current - item.priceUsd, percent = amount / item.priceUsd * 100; return { amount, percent }; }
function signedUsd(value) { return (value > 0 ? "+" : "") + fmtUsd(value); }
function signedPercent(value) { return (value > 0 ? "+" : "") + numberFrom(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"; }
function populateFilters() {
  const month = document.getElementById("historyMonthFilter"), ticker = document.getElementById("historyTickerFilter");
  const keepMonth = month.value || "All", keepTicker = ticker.value || "All";
  const months = [...new Set(trades.map(item => monthKey(item.date)))].sort().reverse(), tickers = [...new Set(trades.map(item => item.ticker))].sort();
  month.innerHTML = '<option value="All">All months</option>' + months.map(value => '<option value="' + value + '">' + monthLabel(value) + '</option>').join("");
  ticker.innerHTML = '<option value="All">All assets</option>' + tickers.map(value => '<option value="' + value + '">' + value + '</option>').join("");
  month.value = months.includes(keepMonth) ? keepMonth : "All"; ticker.value = tickers.includes(keepTicker) ? keepTicker : "All";
}
function filtered() {
  const month = document.getElementById("historyMonthFilter").value, ticker = document.getElementById("historyTickerFilter").value, type = document.getElementById("historyTypeFilter").value;
  return trades.filter(item => (month === "All" || monthKey(item.date) === month) && (ticker === "All" || item.ticker === ticker) && (type === "All" || item.type === type));
}
function render() {
  populateFilters();
  const rows = filtered(), buys = rows.filter(item => item.type === "Buy"), total = buys.reduce((sum, item) => sum + item.totalThb, 0), latest = rows[0], pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  page = Math.min(page, pageCount);
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  document.getElementById("historySummary").innerHTML = [["Transactions", rows.length], ["Buy total", fmtThb(total)], ["Average order", fmtThb(buys.length ? total / buys.length : 0)], ["Latest activity", latest ? dateLabel(latest.date) : "-"]].map(item => '<div class="history-summary-item"><span>' + item[0] + '</span><strong>' + item[1] + '</strong></div>').join("");
  document.getElementById("historyCount").textContent = rows.length + " transaction" + (rows.length === 1 ? "" : "s") + " · Showing " + (visible.length ? ((page - 1) * PAGE_SIZE + 1) + "–" + ((page - 1) * PAGE_SIZE + visible.length) : "0");
  const empty = '<tr><td colspan="7">No transactions match these filters.</td></tr>';
  document.getElementById("historyTableBody").innerHTML = visible.map(item => { const change = priceChange(item), changeClass = !change ? "neutral" : change.amount > 0 ? "positive" : change.amount < 0 ? "negative" : "neutral", changeMarkup = change ? '<strong>' + signedUsd(change.amount) + '</strong><small>' + signedPercent(change.percent) + '</small>' : '<strong>-</strong>'; return '<tr><td>' + dateLabel(item.date) + '</td><td><span class="history-asset">' + logo(item.ticker) + '<strong>' + item.ticker + '</strong></span></td><td><span class="history-type ' + item.type.toLowerCase() + '">' + item.type + '</span></td><td>' + item.shares.toFixed(6) + '</td><td>' + fmtUsd(item.priceUsd) + '</td><td class="history-change ' + changeClass + '">' + changeMarkup + '</td><td><strong>' + fmtThb(item.totalThb) + '</strong><small>' + fmtUsd(item.totalUsd) + '</small></td></tr>'; }).join("") || empty;
  document.getElementById("historyMobileList").innerHTML = visible.map(item => '<article class="history-mobile-item"><div><span class="history-mobile-date">' + dateLabel(item.date) + '</span><span class="history-type ' + item.type.toLowerCase() + '">' + item.type + '</span></div><div class="history-mobile-main">' + logo(item.ticker) + '<strong>' + item.ticker + '</strong><span>' + item.shares.toFixed(6) + ' shares at ' + fmtUsd(item.priceUsd) + '</span><b>' + fmtThb(item.totalThb) + '</b></div></article>').join("") || '<div class="empty">No transactions match these filters.</div>';
  document.getElementById("historyPageLabel").textContent = "Page " + page + " of " + pageCount;
  document.getElementById("historyPrevious").disabled = page === 1;
  document.getElementById("historyNext").disabled = page === pageCount;
}
function resetAndRender() { page = 1; render(); }
document.getElementById("historyMonthFilter").addEventListener("change", resetAndRender);
document.getElementById("historyTickerFilter").addEventListener("change", resetAndRender);
document.getElementById("historyTypeFilter").addEventListener("change", resetAndRender);
document.getElementById("historyClearFilters").addEventListener("click", () => { ["historyMonthFilter", "historyTickerFilter", "historyTypeFilter"].forEach(id => document.getElementById(id).value = "All"); resetAndRender(); });
document.getElementById("historyPrevious").addEventListener("click", () => { page--; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
document.getElementById("historyNext").addEventListener("click", () => { page++; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
Promise.all([fetchSheet("Trade_Log"), fetchSheet("Looker_Holdings")]).then(([tradeRows, holdingRows]) => { trades = normalizedRows(tradeRows); currentPrices = currentPriceMap(holdingRows); document.getElementById("historyStatus").textContent = "Trade Log synced · " + trades.length + " records"; render(); }).catch(error => { document.getElementById("historyStatus").textContent = "Trade Log unavailable"; document.getElementById("historyTableBody").innerHTML = '<tr><td colspan="7">Could not load Trade Log. Try again shortly.</td></tr>'; });