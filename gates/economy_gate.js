// ECONOMY GATE (7/19/26, LIFE session) — scarcity must stay lawful. FACTORY
// LAW gate for bohemia_economy. Proves:
//   1. CONSERVATION: across simulated days, stock delta EXACTLY equals
//      produced - consumed (nothing appears from nowhere, nothing vanishes
//      unaccounted), and no stock ever goes negative
//   2. PRICE IS MONOTONE in scarcity: less supply never gets cheaper; the
//      hyperbolic last-week ramp is capped at the siege ratio
//   3. GROUNDED CONSTANTS: needs sit inside real human ranges (water 3-6
//      L/day band around our 4, food ~2000 kcal = 1 ration/day)
//   4. a dark suburb block produces zero grid power (CLUSTERED POWER LAW)
//   5. FACTION_ECONOMY ships EMPTY (contents-Paolo's), and the numeraire is
//      a mechanism placeholder (the commodity money is [PENDING Paolo])
//   6. determinism per seed
const E = require('../engine/bohemia_economy.js');
const A = require('../engine/bohemia_agents.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// population off the real agent factory
const feet = Array.from({ length: 22 }, () => ({ x: 0, y: 0, w: 10, h: 10 }));
const agents = A.agentsForBlock(7, feet, [{ district: 'commercial', dir: 'E', dist: 1 }], null);

// ---- conservation over 30 days ---------------------------------------------
const led = E.makeLedger(7, agents.length, feet.length);
let conserved = true, nonNegative = true;
for (let d = 0; d < 30; d++) {
  const before = { ...led.stocks };
  const f = E.advanceDay(led, agents);
  for (const good in E.GOODS) {
    const delta = (led.stocks[good] - before[good]);
    const expect = (f.produced[good] || 0) - (f.consumed[good] || 0);
    if (Math.abs(delta - expect) > 0.01) conserved = false;
    if (led.stocks[good] < 0) nonNegative = false;
  }
}
ok('CONSERVATION: stock delta === produced - consumed, 30 days', conserved);
ok('no stock ever goes negative (shortfall logged instead)', nonNegative);
ok('shortfalls are recorded when need outruns stock', (() => {
  const l2 = E.makeLedger(7, 500, 2);           // 500 people, 2 houses: starves fast
  for (let d = 0; d < 10; d++) E.advanceDay(l2, []);
  return Object.keys(l2.flows.shortfall).length > 0;
})());

// ---- price monotone in scarcity --------------------------------------------
let monotone = true;
let last = -Infinity;
for (let days = 60; days >= 0; days--) {
  const m = E.scarcityMult(days);
  if (m < last - 1e-9) monotone = false;        // supply falls -> price never falls
  last = m;
}
ok('price is MONOTONE in scarcity (less supply never cheaper)', monotone);
ok('siege cap holds (multiplier <= 40, the Sarajevo band)', E.scarcityMult(0) <= 40 && E.scarcityMult(0.1) <= 40);
ok('abundance is base price (30+ days supply -> 1x)', E.scarcityMult(45) === 1);

// ---- grounded constants -----------------------------------------------------
ok('water need in the real band (3..6 L/day)', E.GOODS.water.need >= 3 && E.GOODS.water.need <= 6);
ok('food need is ~2000 kcal (1 ration/day)', E.GOODS.food.need === 1);
ok('meds are the top value-to-weight class', E.GOODS.meds.base > E.GOODS.food.base && E.GOODS.meds.base > E.GOODS.fuel.base);

// ---- clustered power law ----------------------------------------------------
const dark = E.makeLedger(3, 40, 20);
ok('a dark block holds zero grid power (12% CLUSTERED POWER)', dark.stocks.power === 0);

// ---- contents-Paolo's -------------------------------------------------------
ok('FACTION_ECONOMY table EMPTY (contents-Paolo\'s)', Object.keys(E.FACTION_ECONOMY).length === 0);
ok('numeraire is the salvage placeholder (money is [PENDING Paolo])', E.NUMERAIRE === 'salvage');

// ---- determinism ------------------------------------------------------------
const l3 = E.makeLedger(99, 50, 22), l4 = E.makeLedger(99, 50, 22);
for (let d = 0; d < 5; d++) { E.advanceDay(l3, agents); E.advanceDay(l4, agents); }
ok('ledger is deterministic per seed', JSON.stringify(l3) === JSON.stringify(l4));

console.log('ECONOMY GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
