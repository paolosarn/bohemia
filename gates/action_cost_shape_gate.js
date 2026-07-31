/* ============================================================================
   ACTION COST SHAPE GATE (7/31/26, LAB lane)

   Paolo 7/31: "And sure the time cost shit sounds good" — the SHAPE of Bohemia's
   action clock is canon. Law: laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md

   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so this exists the same turn the
   law was written. It holds three separate things, and the third is the one that
   actually matters:

     1. THE LAW IS STILL THE LAW. Six clauses, still in the file, still saying
        what they said.
     2. THE SHAPE IS STILL DEMONSTRABLE. The lab page that produced the shape is
        driven LIVE in a real browser and made to prove all four mechanical
        claims — a fixed cost under changing condition, condition as the divisor,
        a hard floor implying a hard ceiling, and thresholds rather than slopes.
        The law is evidence-backed or it is an opinion.
     3. NOBODY HAS STARTED BUILDING IT. This addendum reads exactly like
        permission to go implement an action-cost table, and it is NOT. Clause 4
        of laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md reserves the
        table to Paolo. So this gate sweeps engine/ for a lane that has quietly
        started one, and it checks that the law's own [PENDING Paolo] items have
        not been filled in.

   Requires playwright (installed globally in this environment).
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LAW = 'laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md';
const PAGE = 'slices/lab/BOHEMIA_LAB_CDDA_ACTION_COST_7_31_26.html';
const TIME_LAW = 'laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md';
const CAMP_LAW = 'laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md';

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const near = (a, b, eps) => Math.abs(a - b) <= (eps === undefined ? 0.01 : eps);

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

console.log('='.repeat(74));
console.log('ACTION COST SHAPE GATE — the shape is canon, the numbers are not,');
console.log('                         and nobody has started building it');
console.log('='.repeat(74));

/* ==========================================================================
   PART A — THE LAW IS STILL THE LAW
   ========================================================================== */
const lawPath = path.join(ROOT, LAW);
ok('A1 the law exists', fs.existsSync(lawPath));
if (!fs.existsSync(lawPath)) { console.log('  cannot continue without the law'); process.exit(1); }
const law = fs.readFileSync(lawPath, 'utf8');

ok('A2 it quotes his actual ruling, verbatim', /sure the time cost shit sounds good/i.test(law));
ok('A3 it is dated and marked LOCKED', /7\/31\/26, LOCKED/.test(law));

/* the six clauses, each by the claim it makes rather than by its number, so a
   renumbering cannot silently drop one */
const CLAUSES = [
  ['1 the cost is FIXED', /CLAUSE 1[^\n]*FIXED/i],
  ['2 denominated finer than the clock', /CLAUSE 2[^\n]*FINER THAN THE CLOCK/i],
  ['3 condition is the DIVISOR', /CLAUSE 3[^\n]*DIVISOR/i],
  ['4 the divisor has a hard FLOOR', /CLAUSE 4[^\n]*FLOOR/i],
  ['5 THRESHOLDS, not slopes', /CLAUSE 5[^\n]*THRESHOLDS, NOT SLOPES/i],
  ['6 the two clocks stay TWO', /CLAUSE 6[^\n]*TWO CLOCKS STAY TWO/i]
];
CLAUSES.forEach(([what, re]) => ok('A4 clause ' + what + ' is still in the law', re.test(law)));

ok('A5 the law says on its own face that it does NOT write a cost',
   /does not write a single action cost/i.test(law));
ok('A6 and it cites the clause that reserves the table to Paolo',
   law.indexOf('BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md') > 0);
ok('A7 it names the lab page the shape came from', law.indexOf(path.basename(PAGE)) > 0);
ok('A8 it keeps NO DAMAGE BEFORE THE DIAL', /NO DAMAGE BEFORE THE DIAL/.test(law));

/* the laws it depends on must still exist — a citation to a deleted file is rot */
[TIME_LAW, CAMP_LAW, PAGE].forEach((f, i) => {
  ok('A9.' + (i + 1) + ' the cited file exists: ' + path.basename(f),
     fs.existsSync(path.join(ROOT, f)));
});

/* THE PENDINGS ARE STILL PENDING. If a lane fills one of these in, the law has
   been quietly upgraded into permission and the gate must say so. */
const PENDINGS = [
  ['the denomination (clause 2)', /Bohemia's unit is \*\*\[PENDING Paolo\]\*\*/],
  ['the ceiling number (clause 4)', /\*\*Bohemia's ceiling number is \[PENDING Paolo\]\.\*\*/],
  ['the action list and costs', /action list and what\s+each action costs are still \*\*\[PENDING Paolo\]\*\*/]
];
PENDINGS.forEach(([what, re]) =>
  ok('A10 STILL PENDING, not quietly filled in: ' + what, re.test(law)));

/* clause 6 must agree with the camp law it points at, or the two clocks have
   drifted apart in exactly the way clause 6 exists to prevent */
const camp = fs.existsSync(path.join(ROOT, CAMP_LAW)) ? fs.readFileSync(path.join(ROOT, CAMP_LAW), 'utf8') : '';
ok('A11 the camp law still says the buff burns on STEPS and the day on ACTIONS',
   /step/i.test(camp) && /clause 17/i.test(camp));
ok('A12 clause 6 records the divergence as a CHOICE, so nobody "fixes" it later',
   /It is a choice/.test(law));

/* ==========================================================================
   PART B — NOBODY HAS STARTED BUILDING IT
   The check the law most needs, because the law reads like a green light.
   ========================================================================== */
/* `ext` is a parameter and not a hardcoded /\.js$/, because hardcoding it is the
   bug this gate shipped with for exactly one mutation round: B3 hunts a LINK from
   a shipped surface, shipped surfaces are HTML, and a walker that only collected
   .js could never see one. It passed a planted link and I only found out by
   mutating it. Every check in this file was mutated for that reason. */
function walk(dir, ext, out) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full, { withFileTypes: true })) {
    if (f.isDirectory()) continue;
    if (ext.test(f.name)) out.push(path.join(dir, f.name));
  }
  return out;
}
const engineFiles = walk('engine', /\.js$/, []);
/* An action-cost TABLE is a structure keyed by action name with a time value.
   The test is a STRUCTURE, never a mention: gates that hunt words instead of
   shapes trip on their own disclaimers, which this repo has now proved three
   separate times (lab_gate A10, A12 and A24). */
const TABLE_SHAPE = /(ACTION_COSTS?|COST_TABLE|ACTION_MINUTES|ACTION_MOVES|ACTION_BEATS)\s*[:=]\s*[[{]/;
const builders = engineFiles.filter(f => TABLE_SHAPE.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
ok('B1 no engine module has started an action-cost table' +
   (builders.length ? ' (' + builders.join(', ') + ')' : ''), builders.length === 0);

/* and the law itself must not have grown one either */
ok('B2 the law does not contain a cost table of its own', !TABLE_SHAPE.test(law));

/* the lab page is a REFERENCE and stays unreachable from anything shipped —
   lab_gate owns this, but the law now points at the page by name, so a second
   pair of eyes on the one thing that would turn a reference into a feature */
const shipped = walk('slices', /\.(html|js)$/, []).concat(engineFiles)
  .filter(f => f.indexOf('slices/lab/') !== 0);
const linkers = shipped.filter(f => /slices\/lab\/|BOHEMIA_LAB_[A-Z0-9_]+\.html/
  .test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
ok('B3 the lab page the law cites is still not reachable from a shipped surface' +
   (linkers.length ? ' (' + linkers.join(', ') + ')' : ''), linkers.length === 0);

/* ==========================================================================
   PART C — THE SHAPE IS STILL DEMONSTRABLE, LIVE
   The law is four mechanical claims. Each one is played in a real browser
   against the page's own functions, so this is evidence and not assertion.
   ========================================================================== */
(async () => {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(ROOT, PAGE));
    await page.waitForFunction(() => !!window.LAB, { timeout: 15000 });

    /* --- CLAUSE 1: the cost is FIXED --- */
    const fixed = await page.evaluate(() => {
      const L = window.LAB, out = [];
      [[0, 0, 0], [100, 20, 60], [2000, 60, 120]].forEach(c => {
        L.reset();
        L.setCondition({ overloadPct: c[0], pain: c[1], thirst: c[2] });
        out.push(L.ACTIONS.map(a => L.actionMoves(a)));
      });
      return out;
    });
    ok('C1 clause 1 LIVE: the cost is identical across three completely different ' +
       'conditions', JSON.stringify(fixed[0]) === JSON.stringify(fixed[1]) &&
       JSON.stringify(fixed[1]) === JSON.stringify(fixed[2]));

    /* --- CLAUSE 2: denominated finer than the clock --- */
    const fine = await page.evaluate(() => {
      const L = window.LAB;
      L.reset();
      return { perTick: L.CDDA.MOVES_PER_TURN, oneMinute: L.movesForMinutes(1) };
    });
    ok('C2 clause 2 LIVE: the cost unit is finer than the tick by ' + fine.perTick + 'x',
       fine.perTick > 1 && fine.oneMinute === fine.perTick * 60);

    /* --- CLAUSE 3: condition is the divisor --- */
    const divisor = await page.evaluate(() => {
      const L = window.LAB, job = L.ACTIONS[2], o = {};
      L.reset(); o.fresh = L.costMinutes(job); o.freshSpeed = L.speed();
      L.setCondition({ pain: 50 }); o.half = L.costMinutes(job); o.halfSpeed = L.speed();
      return o;
    });
    ok('C3 clause 3 LIVE: halving the condition exactly doubles the time on the same ' +
       'fixed cost (' + divisor.fresh.toFixed(0) + ' -> ' + divisor.half.toFixed(0) + ' min)',
       divisor.halfSpeed * 2 === divisor.freshSpeed && near(divisor.half, divisor.fresh * 2, 0.01));

    /* --- CLAUSE 4: the floor, and the ceiling it implies --- */
    const ceiling = await page.evaluate(() => {
      const L = window.LAB, job = L.ACTIONS[2], o = {};
      L.reset(); o.base = L.costMinutes(job);
      L.setCondition({ overloadPct: 2000, pain: 60, thirst: 120 });
      o.wrecked = L.costMinutes(job); o.atFloor = L.atFloor(); o.mult = L.worstMultiplier();
      L.setCondition({ overloadPct: 200000, pain: 60, thirst: 120 });
      o.absurd = L.costMinutes(job);
      return o;
    });
    ok('C4 clause 4 LIVE: there IS a floor and it holds (' + ceiling.mult + 'x ceiling)',
       ceiling.atFloor === true && ceiling.mult > 1 &&
       near(ceiling.wrecked, ceiling.base * ceiling.mult, 0.01));
    ok('C5 clause 4 LIVE: A HUNDRED TIMES THE PENALTY CHANGES NOTHING — a bad day ' +
       'cannot become an infinite one', near(ceiling.absurd, ceiling.wrecked, 0.001));

    /* --- CLAUSE 5: thresholds, not slopes --- */
    const thresh = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); L.setCondition({ thirst: L.CDDA.THIRST_PENALTY_AT }); o.at = L.speed();
      L.setCondition({ thirst: L.CDDA.THIRST_PENALTY_AT + 20 }); o.past = L.speed();
      L.reset(); L.setCondition({ overloadPct: 0 }); o.underCap = L.carryPenalty();
      L.setCondition({ overloadPct: 100 }); o.overCap = L.carryPenalty();
      return o;
    });
    ok('C6 clause 5 LIVE: under the line is FREE, over it costs (thirst ' + thresh.at +
       ' -> ' + thresh.past + ', weight ' + thresh.underCap + ' -> ' + thresh.overCap + ')',
       thresh.at > thresh.past && thresh.underCap === 0 && thresh.overCap > 0);

    /* --- CLAUSE 6: the day burns on actions, which is the half that is ours --- */
    const day = await page.evaluate(() => {
      const L = window.LAB, o = {};
      L.reset(); o.before = L.spent();
      L.doAction('medium'); o.afterAction = L.spent();
      L.reset(); L.setCondition({ pain: 50 }); L.doAction('medium');
      o.wrecked = L.spent();
      return o;
    });
    ok('C7 clause 6 LIVE: pressing a button spends the DAY, and spends more of it ' +
       'when you are wrecked', day.before === 0 && day.afterAction > 0 &&
       near(day.wrecked, day.afterAction * 2, 1));

    await ctx.close();
  } finally {
    await browser.close();
  }

  console.log('='.repeat(74));
  console.log('  ACTION COST SHAPE GATE: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
