const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "../script.js"), "utf8");
const start = source.indexOf("function dcaSizing(item)");
const end = source.indexOf("function healthActionItems(", start);
assert(start >= 0 && end > start, "DCA functions must exist");
const context = {
  holdings: [], signalBoard: [], MIN_ORDER_USD: 1.5,
  numberFrom: value => Number(value) || 0,
  cleanSignal: value => String(value || "").trim(),
  fxRate: () => 32,
  targetWeight: item => Number(item.targetA) || 0,
  targetGap: item => (Number(item.targetA) || 0) - (Number(item.weight) || 0),
  formatUsd: value => "$" + Number(value).toFixed(2)
};
vm.createContext(context);
vm.runInContext(source.slice(start, end), context);
context.holdings = [
  { ticker: "VOO", valueUsd: 100, weight: 10, targetA: 25 },
  { ticker: "SPMO", valueUsd: 150, weight: 15, targetA: 20 },
  { ticker: "NVDA", valueUsd: 750, weight: 75, targetA: 5 },
  { ticker: "MSFT", valueUsd: 0, weight: 0, targetA: 10 }
];
const regular = context.buildRegularDcaPlan(50);
assert.deepEqual(Array.from(regular.picks, item => item.ticker), ["VOO", "SPMO"]);
assert.equal(regular.picks[0].deficitUsd, 162.5, "Use the whole $1,000 portfolio, not just approved holdings");
assert(regular.usedUsd <= 50);
assert(Math.abs(regular.usedUsd + regular.leftoverUsd - 50) < 0.001);
assert.equal(context.buildRegularDcaPlan(0).picks.length, 0);
assert.equal(context.buildRegularDcaPlan(1).picks.length, 0);
for (const budget of [2, 10, 50, 100, 1000]) {
  const plan = context.buildRegularDcaPlan(budget);
  assert(plan.usedUsd <= budget);
  for (const item of plan.picks) {
    assert(item.amountUsd >= 1.5 && item.amountUsd <= item.deficitUsd);
    assert(!["MSFT", "NVDA", "CASH"].includes(item.ticker));
  }
}
context.signalBoard = [
  { ...context.holdings[0], signal: "BUY 1.00x", signalSource: "Final_Action", smartDcaUsd: 12 },
  { ...context.holdings[1], signal: "BUY DIP", signalSource: "Signal" },
  { ticker: "MSFT", targetA: 10, signal: "BUY 1.00x", signalSource: "Final_Action" }
];
const tactical = context.buildDcaPlan(50);
assert.deepEqual(Array.from(tactical.picks, item => item.ticker), ["VOO"]);
assert.equal(tactical.usedUsd, 12);
assert.equal(tactical.leftoverUsd, 38);
assert.equal(context.dcaMultiplier({ signal: "1.00x", signalSource: "Final_Action" }), 0);
assert.equal(context.dcaMultiplier({ signal: "HOLD BUY 1.00x", signalSource: "Final_Action" }), 0);
assert.equal(context.dcaMultiplier({ signal: "BUY 0.50x", signalSource: "Final_Action" }), 0.5);
context.signalBoard = [];
assert.equal(context.buildDcaPlan(50).picks.length, 0);
assert(context.buildRegularDcaPlan(50).picks.length > 0, "Regular DCA must not depend on tactical signals");
console.log("DCA tests passed: holdings only, whole-portfolio deficits, budgets, minimum orders and tactical gating.");
