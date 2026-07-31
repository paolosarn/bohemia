/* BOHEMIA PURSE GATE (7/31/26) — the money is auditable, and the numbers stay Paolo's.
 *
 * WHY. records/BOHEMIA_THE_BIG_MISSING_7_29_26.md ranks THE GAME DAY as the #1 organ the
 * game does not have, and it is blocked on #3, THE ECONOMY: "no system anywhere PAYS a
 * quest, PRICES a good, runs a market day, or gives currency a sink." engine/bohemia_purse.js
 * is the player half of that. This is its regression gate (FACTORY LAW: every system ships
 * with its own).
 *
 * THE TWO THINGS IT REALLY GUARDS:
 *
 * 1. THE LEDGER IS THE TRUTH. Balances are a SUM of entries, never a field, so a number
 *    can always be explained. The gate fuzzes thousands of random movements and asserts
 *    the invariants over the WHOLE HISTORY, not the end state — "it balances now" hides a
 *    balance that went negative on day three.
 *
 * 2. THE TABLES STAY EMPTY, AND THIS IS THE CLAIM THAT MATTERS MOST. MECHANISM-MINE /
 *    CONTENTS-PAOLO'S says build tables ship EMPTY except what he has ruled. PAYOUT,
 *    PRICES and PRODUCTION are pure canon — what a quest pays, what a thing costs, what a
 *    building makes. The realistic failure is not malice, it is a future session adding
 *    "a sensible default so the loop can be tested" and that placeholder quietly becoming
 *    canon by shipping. A comment cannot stop that. This gate can, and it is why an empty
 *    table must answer NO_RULING rather than zero: silence is honest, zero is a number
 *    nobody ruled.
 *
 * ALSO ASSERTED: exactly THREE currencies with the LOCKED names (a fourth breaks the
 * anti-spreadsheet ruling in the same addendum); no anonymous money; refusals are inert;
 * convert is atomic; hard sinks are distinguished from soft transfers, which is the whole
 * reason the ledger carries kinds; save/load round-trips the truth.
 *
 *   node gates/purse_gate.js
 */
const P = require('../engine/bohemia_purse.js');

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : fails.push(n); };

/* ---- the locked shape ---------------------------------------------------- */
ok('EXACTLY THREE CURRENCIES, and they are the locked ones — resources, electricity, clout ' +
   '(Paolo 7/26; a fourth would be the spreadsheet-simulator feel he banned in the same ruling)',
   P.CURRENCIES.length === 3 &&
   ['resources', 'electricity', 'clout'].every(c => P.CURRENCIES.indexOf(c) >= 0));

/* ---- THE TABLES ARE EMPTY ------------------------------------------------ */
for (const t of ['PAYOUT', 'PRICES', 'PRODUCTION']) {
  ok(`${t} SHIPS EMPTY — what things are worth is Paolo's ruling, and a placeholder that ` +
     `ships is canon nobody made (found ${Object.keys(P[t]).length} row(s))`,
     Object.keys(P[t]).length === 0);
}
{
  const p = P.create();
  const q = P.payQuest(p, { outcome: 'COMPLETE', questId: 'Q021' });
  const s = P.spend(p, 'anything');
  const b = P.produce(p, 'anything');
  ok('an unruled payout says NO_RULING and pays NOTHING — silence, never a guessed number',
     q.applied === false && q.reason === P.NO_RULING && P.balance(p, 'resources') === 0);
  ok('an unruled price says NO_RULING and is NOT free', s.applied === false && s.reason === P.NO_RULING);
  ok('an unruled building produces NO_RULING, not zero', b.applied === false && b.reason === P.NO_RULING);
}

/* ---- no anonymous money, no bad movement --------------------------------- */
{
  const p = P.create();
  ok('a movement with no reason is REFUSED — no anonymous money in the ledger',
     P.credit(p, 'resources', 5).applied === false && p.entries.length === 0);
  ok('a made-up currency is refused', P.credit(p, 'bottlecaps', 5, 'x').applied === false);
  ok('a zero / NaN / infinite amount is refused',
     !P.credit(p, 'resources', 0, 'x').applied &&
     !P.credit(p, 'resources', NaN, 'x').applied &&
     !P.credit(p, 'resources', Infinity, 'x').applied);
  ok('a refused movement leaves the ledger completely untouched', p.entries.length === 0);
}

/* ---- you cannot spend what you do not have ------------------------------- */
{
  const p = P.create();
  P.credit(p, 'resources', 10, 'test', 'T');
  const before = JSON.stringify(p.entries);
  const r = P.debit(p, 'resources', 25, 'test', 'T');
  ok('overspending is REFUSED and says how short you are (short=' + r.short + ')',
     r.applied === false && r.reason === 'INSUFFICIENT' && r.short === 15);
  ok('the refused debit wrote nothing', JSON.stringify(p.entries) === before);
  ok('spending exactly the balance is allowed and lands on zero',
     P.debit(p, 'resources', 10, 'test', 'T').applied === true && P.balance(p, 'resources') === 0);
}

/* ---- convert is atomic --------------------------------------------------- */
{
  const p = P.create();
  P.credit(p, 'resources', 8, 'seed', 'S');
  const okc = P.convert(p, 'resources', 4, 'electricity', 1, 'swap', 'C1');
  ok('a good convert moves both legs', okc.applied === true &&
     P.balance(p, 'resources') === 4 && P.balance(p, 'electricity') === 1);
  const n = p.entries.length;
  const bad = P.convert(p, 'resources', 999, 'clout', 1, 'swap', 'C2');
  ok('a convert that cannot afford its first leg does nothing at all',
     bad.applied === false && p.entries.length === n);
  /* the leg-two unwind: force it by converting to a bogus currency */
  const bad2 = P.convert(p, 'resources', 2, 'nonsense', 1, 'swap', 'C3');
  ok('a convert whose SECOND leg fails UNWINDS the first — currency is never burned silently',
     bad2.applied === false && p.entries.length === n && P.balance(p, 'resources') === 4);
}

/* ---- hard sinks vs soft transfers ---------------------------------------- */
{
  const p = P.create();
  P.credit(p, 'resources', 100, 'faucet', 'F');
  P.debit(p, 'resources', 30, 'burned', 'D');
  P.transferOut(p, 'resources', 20, 'paid a trader', 'T');
  const f = P.flow(p).resources;
  ok('flow separates the HARD SINK from the SOFT TRANSFER — the one number that says ' +
     `whether an economy inflates (source ${f.source}, drain ${f.drain}, transferOut ${f.transferOut})`,
     f.source === 100 && f.drain === 30 && f.transferOut === 20 && f.net === 50);
}

/* ---- THE FUZZ: invariants over a whole random history -------------------- */
{
  let rng = 1234567;
  const rnd = () => (rng = (rng * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  let negativeEver = false, mismatch = false, anonymous = false, applied = 0, refused = 0;
  for (let trial = 0; trial < 40; trial++) {
    const p = P.create();
    const running = { resources: 0, electricity: 0, clout: 0 };
    for (let i = 0; i < 120; i++) {
      const c = P.CURRENCIES[Math.floor(rnd() * 3)];
      const amt = Math.floor(rnd() * 40) + 1;
      const pick = rnd();
      const r = pick < 0.45 ? P.credit(p, c, amt, 'fuzz', i)
              : pick < 0.75 ? P.debit(p, c, amt, 'fuzz', i)
              : pick < 0.9  ? P.transferOut(p, c, amt, 'fuzz', i)
              : P.convert(p, c, amt, P.CURRENCIES[Math.floor(rnd() * 3)], amt, 'fuzz', i);
      r.applied ? applied++ : refused++;
      for (const cur of P.CURRENCIES) if (P.balance(p, cur) < 0) negativeEver = true;
    }
    const a = P.audit(p);
    if (!a.ok) mismatch = true;
    for (const e of p.entries) if (!e.reason) anonymous = true;
    for (const cur of P.CURRENCIES) {
      let sum = 0;
      for (const e of p.entries) if (e.currency === cur) sum += e.amount;
      if (sum !== P.balance(p, cur)) mismatch = true;
      running[cur] = sum;
    }
  }
  ok(`FUZZ (40 purses x 120 movements, ${applied} applied / ${refused} refused): a balance ` +
     'NEVER went negative at any point in any history', !negativeEver);
  ok('FUZZ: every balance always equals the sum of its own entries — the ledger IS the truth',
     !mismatch);
  ok('FUZZ: not one anonymous movement got in', !anonymous);
  ok('FUZZ: the run actually exercised both outcomes (a fuzz that never refuses proves nothing)',
     applied > 200 && refused > 50);
}

/* ---- audit catches a tampered ledger ------------------------------------- */
{
  const p = P.create();
  P.credit(p, 'resources', 10, 'real', 'R');
  ok('audit passes a clean ledger', P.audit(p).ok === true);
  p.entries.push({ currency: 'resources', amount: 5, kind: 'source', reason: '', ref: null, day: 0, seq: 99 });
  const a = P.audit(p);
  ok('audit CATCHES a hand-edited entry (anonymous + sequence broken): ' +
     a.problems.length + ' problem(s) named', a.ok === false && a.problems.length >= 2);
}

/* ---- save / load --------------------------------------------------------- */
{
  const p = P.create({ id: 'player', day: 4 });
  P.credit(p, 'clout', 7, 'viral', 'Q1');
  P.debit(p, 'clout', 3, 'spent', 'X1');
  const back = P.load(JSON.parse(JSON.stringify(P.save(p))));
  ok('save/load round-trips the ledger exactly, balances and all',
     JSON.stringify(P.balances(back)) === JSON.stringify(P.balances(p)) &&
     back.entries.length === p.entries.length && P.audit(back).ok);
}

/* ---- act one only -------------------------------------------------------- */
{
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'engine', 'bohemia_purse.js'), 'utf8');
  ok('ACT ONE ONLY (Paolo 7/28): the century rule is named as parked, and no act-2/3 ' +
     'compounding is modelled here',
     /ACT ONE ONLY/.test(src) && !/act\s*2|act\s*3/i.test(src.replace(/Act-2\/3 design is parked[^\n]*/g, '')
       .replace(/[^\n]*deliberately NOT[^\n]*/g, '').replace(/[^\n]*three acts[^\n]*/g, '')));
}

for (const f of fails) console.log('  > FAIL ' + f);
console.log(`=== PURSE GATE: ${pass} passed, ${fails.length} failed ===`);
process.exit(fails.length ? 1 : 0);
