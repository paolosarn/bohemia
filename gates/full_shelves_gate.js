#!/usr/bin/env node
/* BOHEMIA — FULL SHELVES GATE (9/21/26, WORLD lane, row [full shelves])
 *
 * Holds THE DAY AFTER THE MONEY DIES.
 *
 *  A  *** THE VALLEY REALLY RUNS OUT, DRIVEN NOT ASSUMED. *** Stock the valley
 *     the way the game stocks it, then spend every holder down through the
 *     game's own payday.buy(). A purchase is a CONVERT, so the battery is
 *     destroyed to make the good and the supply falls with every sale. Measured:
 *     the valley reaches 0 across 19 hands, nobody minted one, the shelves still
 *     hold goods, and every purchase answers CANNOT_AFFORD. The first half of
 *     the row was already true; what was missing is that NOTHING MOVES AT ALL
 *     once it is.
 *
 *  B  *** YOUR EMPTY POCKET IS NOT A DEAD CURRENCY. *** An empty purse and an
 *     empty valley look identical from inside a shop -- both say CANNOT_AFFORD
 *     -- and the rules only change for one of them. If being broke flipped the
 *     world into barter, the game would announce the collapse of money on a
 *     player's first bad afternoon. So state() has three answers and this gate
 *     proves all three are reachable and distinct.
 *
 *  C  AND AN UNSTOCKED GAME IS NOT A COLLAPSED ONE. Zero batteries across ZERO
 *     hands is a save nobody has counted yet. Calling that DEAD would fire the
 *     beat on the first frame. This is the same reading that made the night card
 *     say 0 on the first night; it cost a card once and it does not get to cost
 *     a beat.
 *
 *  D  NOTHING IS RE-IMPLEMENTED. Swapping is bohemia_barter and owing is
 *     bohemia_lend, both already shipped by this lane with no caller for this.
 *     The module routes; it does not invent a second economy. Checked by taking
 *     each module away and watching the way it carried disappear.
 *
 *  E  THE POSTED PRICE LIST, and its refusals.
 *
 *   node gates/full_shelves_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const A  = R('engine/bohemia_aftermoney.js');
const KO = R('engine/bohemia_pockets.js');
const CE = R('engine/bohemia_cells.js');
const PD = R('engine/bohemia_payday.js');
const EC = R('engine/bohemia_economy.js');
const PU = R('engine/bohemia_purse.js');
const N  = R('engine/bohemia_notice.js');
const G  = R('engine/BOHEMIA_faction_graph.json');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

/* ---- C. AN UNSTOCKED GAME IS NOT A COLLAPSED ONE (first, before stocking) - */
section('C an unstocked game is not a collapsed one', () => {
  const s = A.state();
  ok('*** ZERO ACROSS ZERO HANDS IS NOT KNOWN, NEVER DEAD ***',
     s.known === false && s.why === 'NOBODY_HAS_BEEN_COUNTED_YET', JSON.stringify(s));
  ok('and a caller-supplied reading with no holders is refused too',
     A.state({ total: 0, holders: 0 }).known === false);
  ok('nothing is decided from a state that is not known',
     A.ways(A.state(), { goods: 9 }).known === false &&
     A.quote(1, A.state()).good === false);
});

/* ---- A. THE VALLEY RUNS OUT, DRIVEN ------------------------------------- */
let dead = null;
section('A the valley really runs out', () => {
  const heads = {}; Object.keys(G.factions).forEach(f => heads[f] = 3); heads.player = 2;
  const put = KO.stock(heads, 'electricity', 1);
  ok('the valley stocks the way the game stocks it (' + put.put + ' across ' + put.holders + ')',
     put.applied && put.put > 0 && put.holders > 1);

  const before = CE.count();
  ok('and the money is really there', before.total > 0 && before.holders > 1,
     JSON.stringify(before));

  const led = EC.makeLedger(40);
  let burned = 0;
  for (const h of KO.holders()) {
    const w = KO.worth(h, 'electricity');
    for (let i = 0; i < w; i++) { const r = PD.buy(KO.of(h), led, 'food', 1, 1); if (r.applied) burned++; }
  }
  const after = CE.count();
  console.log('    [measured] ' + burned + ' batteries burned buying food; the valley went '
    + before.total + ' -> ' + after.total + ' across ' + after.holders + ' hands');
  ok('*** BUYING DESTROYS THE BATTERY, so the valley can be spent to nothing ***',
     after.total === 0 && burned > 0, JSON.stringify(after));
  ok('and nobody minted one on the way down', CE.made(CE.purses()) === 0);
  ok('the shelves still hold goods', (PD.shelf(led) || []).length > 0);
  ok('while every purchase answers CANNOT_AFFORD',
     PD.buy(KO.of('player'), led, 'food', 1, 2).reason === 'CANNOT_AFFORD');

  dead = A.state();
  ok('*** AND THE MODULE CALLS IT: THE MONEY IS DEAD ***',
     dead.known && dead.state === A.DEAD && dead.holders > 0, JSON.stringify(dead));
});

/* ---- B. BROKE IS NOT DEAD ------------------------------------------------ */
section('B your empty pocket is not a dead currency', () => {
  const live = { total: 40, holders: 19 };
  ok('money in the valley and money on you is WORKS',
     A.state(Object.assign({ mine: 3 }, live)).state === A.WORKS);
  ok('*** MONEY IN THE VALLEY AND NONE ON YOU IS BROKE, NOT DEAD ***',
     A.state(Object.assign({ mine: 0 }, live)).state === A.BROKE,
     JSON.stringify(A.state(Object.assign({ mine: 0 }, live))));
  ok('only an empty valley is DEAD',
     A.state({ total: 0, holders: 19 }).state === A.DEAD);
  ok('the three answers are distinct words',
     A.WORKS !== A.BROKE && A.BROKE !== A.DEAD && A.WORKS !== A.DEAD);

  /* *** THE ONE THAT MATTERS: being broke must NOT change the rules. *** */
  const brokeSt = A.state(Object.assign({ mine: 0 }, live));
  ok('*** BEING BROKE DOES NOT TURN THE WORLD INTO BARTER ***',
     A.ways(brokeSt, { goods: 9, lender: 'Mob' }).dead === false &&
     A.trade({ total: 40, holders: 19, mine: 0, price: 1, has: { goods: 9 } }).why
       === 'THE_MONEY_STILL_WORKS');
  ok('and a price still means something while money works',
     A.quote(1, brokeSt).good === true && A.quote(1, brokeSt).price === 1);
});

/* ---- D. NOTHING IS RE-IMPLEMENTED --------------------------------------- */
section('D swapping and owing are the modules that already exist', () => {
  const st = { known: true, state: A.DEAD, total: 0, holders: 19 };
  ok('with goods you can swap', A.ways(st, { goods: 3 }).ways.join() === 'SWAP');
  ok('with a lender you can owe', A.ways(st, { lender: 'Mob' }).ways.join() === 'OWE');
  ok('with both, both', A.ways(st, { goods: 3, lender: 'Mob' }).ways.join() === 'SWAP,OWE');
  ok('*** WITH NEITHER, THE TRADE IS REFUSED and the shelves stay full ***',
     A.ways(st, {}).ways.length === 0 &&
     A.ways(st, {}).why === 'NOTHING_TO_SWAP_AND_NOBODY_TO_OWE');

  /* *** TAKE THE MODULE AWAY AND THE WAY IT CARRIED MUST DISAPPEAR. That is how
     "it routes, it does not re-implement" is proved rather than claimed. */
  const g = (typeof globalThis !== 'undefined') ? globalThis : global;
  const realB = R('engine/bohemia_barter.js'), realL = R('engine/bohemia_lend.js');
  const keyB = require.resolve(path.join(ROOT, 'engine/bohemia_barter.js'));
  const keyL = require.resolve(path.join(ROOT, 'engine/bohemia_lend.js'));
  delete require.cache[keyB];
  require.cache[keyB] = { id: keyB, filename: keyB, loaded: true, exports: null };
  g.BohemiaBarter = null;
  const noSwap = A.ways(st, { goods: 3, lender: 'Mob' });
  require.cache[keyB] = { id: keyB, filename: keyB, loaded: true, exports: realB };
  g.BohemiaBarter = realB;
  ok('*** WITH THE BARTER MODULE GONE, SWAP IS GONE, so it is not re-implemented here ***',
     noSwap.ways.indexOf('SWAP') < 0, JSON.stringify(noSwap.ways));

  delete require.cache[keyL];
  require.cache[keyL] = { id: keyL, filename: keyL, loaded: true, exports: null };
  g.BohemiaLend = null;
  const noOwe = A.ways(st, { goods: 3, lender: 'Mob' });
  require.cache[keyL] = { id: keyL, filename: keyL, loaded: true, exports: realL };
  g.BohemiaLend = realL;
  ok('and with the lending module gone, OWE is gone',
     noOwe.ways.indexOf('OWE') < 0, JSON.stringify(noOwe.ways));
  ok('both are back', A.ways(st, { goods: 3, lender: 'Mob' }).ways.length === 2);

  /* PRICES ARE HIS. A collapse must not re-tariff the valley. */
  const q = A.quote(1, st);
  ok('*** A DEAD CURRENCY DOES NOT CHANGE THE PRICE, it stops it meaning anything ***',
     q.good === false && q.wouldHaveBeen === 1 &&
     q.why === 'THE_PRICE_IS_IN_A_CURRENCY_NOBODY_HOLDS', JSON.stringify(q));
  const body = fs.readFileSync(path.join(ROOT, 'engine/bohemia_aftermoney.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  ok('and the module invents no price and no rate of its own',
     !/\b\d{2,}\b/.test(body), (body.match(/\b\d{2,}\b/g) || []).join(','));
});

/* ---- E. THE POSTED PRICE LIST ------------------------------------------- */
section('E the list is still on the wall', () => {
  const L = (x) => N.priceList(Object.assign({
    by: "Ruben's", at: [75, 5], street: 'freeway', day: 9, clock: '08:05' }, x || {}));
  const l = L({ dead: true });
  ok('the shop posts its schedule', l.issued, l.reason || '');
  ok('every good on it comes from the economy, not from a list typed in the notice',
     l.goods.length === Object.keys(PU.PRICES).length && l.goods.length > 3,
     l.goods.length + ' vs ' + Object.keys(PU.PRICES).length);
  ok('and every line is his ONE', l.goods.every(g => g.amount === PU.PAYOUT.COMPLETE.electricity));
  ok('it says prices are payable in the lawful currency',
     /PAYABLE IN THE LAWFUL CURRENCY/.test(l.en.join(' ')));
  ok('*** AND IT DOES NOT KNOW NOBODY CAN PAY IT: the list carries that beside'
   + ' itself, never in its own words ***',
     l.payable === false && !/nobody|worthless|cannot pay/i.test(l.en.join(' ')));
  ok('with the money alive the same list is payable', L({ dead: false }).payable === true);
  ok('and asked nothing it claims nothing', L({}).payable === null);

  ok('a shop with nothing for sale gets no list, rather than a blank page',
     L({ prices: {} }).reason === 'NOTHING_IS_FOR_SALE');
  ok('and a list with no seller on it is refused', L({ by: null }).reason === 'NO_SELLER');
});

console.log('FULL SHELVES GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (the valley really spends to nothing, broke is not dead, an uncounted save'
  + ' is neither, and swapping and owing are the modules that already existed)');
process.exit(fail ? 1 : 0);
