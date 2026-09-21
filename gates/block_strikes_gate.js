#!/usr/bin/env node
/* BOHEMIA — BLOCK STRIKES GATE (9/21/26, WORLD lane, row [block strikes])
 *
 * Holds THE BLOCK HOLDS THE DOOR: the owner's cut only sticks if he can replace
 * you, and he cannot replace a door the block is holding.
 *
 * WHAT IT IS ACTUALLY GUARDING:
 *
 *  A  *** SILENCE IS NOT A NO, AND THIS ROW DIED IN THAT GAP FOR SIX ROUNDS. ***
 *     Early in the game almost nobody has seen you do anything. A block where no
 *     resident holds an opinion DOES NOT KNOW YOU; it has not decided against
 *     you. A counter that collapses those two facts reports "the strike failed"
 *     on day one, forever. So held() has three answers, and this gate proves all
 *     three are reachable and that the empty one is never a verdict.
 *
 *  B  NOT ONE WEIGHT IN THE MODULE. A majority is the SHAPE of a picket, not a
 *     number anybody tuned, and the opinions come from bohemia_standing off his
 *     own CLOUT_WEIGHTS. The price of getting the light back is his ruled ONE,
 *     read off PAYOUT and refused when the table is gone.
 *
 *  C  *** AND THE PROOF IS ON THE DEMO HE PLAYS, BECAUSE THAT IS THE MISTAKE
 *     THAT COST THIS ROW SIX ROUNDS. *** On 9/15 this lane measured the walked
 *     city opened on its own, found CT_MINDS empty, and concluded the game had
 *     no minds. PLAYER_CV is set ONLY by a postMessage from the parent frame, so
 *     a standalone city is never sent a body -- and peoplePass() returns 0 on
 *     its first line with no body, so it draws NOBODY. I measured a city with no
 *     people in it. So this gate drives the real demo through the one driver
 *     (rule 14g), checks the player actually MOVED before trusting any sample,
 *     and runs the whole chain: minds are born, the weight table is filled from
 *     his quest corpus, the block's own people witness a deed, the door holds,
 *     and the cut stops sticking.
 *
 *   node gates/block_strikes_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const K = R('engine/bohemia_strike.js');
const PU = R('engine/bohemia_purse.js');
const MEM = R('engine/bohemia_memory.js');
const N = R('engine/bohemia_notice.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};
const done = () => {
  console.log('BLOCK STRIKES GATE: ' + pass + ' passed, ' + fail + ' failed'
    + '  (silence is never a verdict, no weight is typed, and the door is proved'
    + ' holding on the demo he plays)');
  process.exit(fail ? 1 : 0);
};

const block = (n) => {
  const m = {};
  for (let i = 0; i < n; i++) m['12:12:' + i] = MEM.makeMind('12:12:' + i);
  for (let i = 0; i < 3; i++) m['9:4:' + i] = MEM.makeMind('9:4:' + i);
  return m;
};

/* ---- A. SILENCE IS NOT A NO ---------------------------------------------- */
section('A silence is never a verdict', () => {
  const m = block(6);
  const h = K.held(m, '@', 10, { nx: 12, ny: 12 });
  ok('a block that has never seen you is NOT_KNOWN, not BROKEN',
     h.held === K.NOT_KNOWN && h.asked === 0, JSON.stringify(h));
  ok('and it still says how many people are there (' + h.people + ')', h.people === 6);
  ok('the three answers are distinct words',
     K.HELD !== K.BROKEN && K.BROKEN !== K.NOT_KNOWN && K.HELD !== K.NOT_KNOWN);

  ok('a block with nobody on it is NOT_KNOWN and says so',
     K.held(m, '@', 10, { nx: 77, ny: 77 }).why === 'NOBODY_LIVES_HERE_THAT_ANYONE_HAS_SEEN');
  ok('no actor to decide about is NOT_KNOWN',
     K.held(m, null, 10, { nx: 12, ny: 12 }).held === K.NOT_KNOWN);

  /* *** AND NOT_KNOWN MUST NOT STOP THE CUT. A strike you win by not playing is
     not a strike, so an unknown block falls through to the cut sticking. */
  const c = K.cutSticks(m, '@', 10, { nx: 12, ny: 12 });
  ok('*** AN UNKNOWN BLOCK DOES NOT STOP THE CUT ***',
     c.sticks === true && c.because === 'NOBODY_HERE_KNOWS_YOU_YET', JSON.stringify(c.because));

  /* *** THE MAJORITY RULE ITSELF, WHICH THE FIRST CUT OF THIS GATE NEVER TESTED.
     Proved by mutation: replacing (vouch > wont) with something always true left
     this gate at 33/0. A gate that never builds the case it is guarding is a
     decoration. So the two lopsided blocks are constructed here, through the
     real standing module, and both directions are checked. */
  const S = R('engine/bohemia_standing.js');
  const lop = (good, bad) => {
    const m = block(good + bad);
    const list = Object.keys(m).filter(k => k.indexOf('12:12:') === 0).map(k => m[k]);
    const pos = {}; list.forEach(x => { pos[x.owner] = { x: 0, y: 0 }; });
    S.DEED_WEIGHT['gate:good'] = 1; S.DEED_WEIGHT['gate:bad'] = -1;
    S.witness(list.slice(0, good), 10, '@', 'gate:good', 0, 0, o => pos[o] || null);
    S.witness(list.slice(good), 10, '@', 'gate:bad', 0, 0, o => pos[o] || null);
    const h = K.held(m, '@', 11, { nx: 12, ny: 12 });
    const c = K.cutSticks(m, '@', 11, { nx: 12, ny: 12 }).sticks;
    delete S.DEED_WEIGHT['gate:good']; delete S.DEED_WEIGHT['gate:bad'];
    return { h: h, sticks: c };
  };
  const more = lop(4, 1), fewer = lop(1, 4);
  ok('*** MORE OF THE BLOCK WITH YOU THAN AGAINST: THE DOOR HOLDS ***',
     more.h.held === K.HELD && more.h.vouch === 4 && more.h.wont === 1 && more.sticks === false,
     JSON.stringify(more));
  ok('*** MORE AGAINST THAN WITH: THE DOOR IS BROKEN AND THE CUT STICKS ***',
     fewer.h.held === K.BROKEN && fewer.h.vouch === 1 && fewer.h.wont === 4 && fewer.sticks === true,
     JSON.stringify(fewer));
  const tied = lop(2, 2);
  ok('a tie is not a majority, so a tied block does not hold',
     tied.h.held === K.BROKEN && tied.h.vouch === tied.h.wont, JSON.stringify(tied.h));

  ok('it only counts this block, never the valley',
     K.onBlock(m, 12, 12).length === 6 && K.onBlock(m, 9, 4).length === 3);
  ok('and it reads a list of minds as well as a map',
     K.onBlock(Object.keys(m).map(k => m[k]), 12, 12).length === 6);
});

/* ---- B. NO WEIGHT IS TYPED, AND THE PRICE IS HIS ------------------------- */
section('B no weight is typed', () => {
  const body = fs.readFileSync(path.join(ROOT, 'engine/bohemia_strike.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  ok('no number bigger than one appears in its code',
     !/\b\d{2,}\b/.test(body), (body.match(/\b\d{2,}\b/g) || []).join(','));
  ok('it names no faction and no deed kind', !/Mob|Cartel|Reds|Network|commit|favour/.test(body));

  const was = PU.PAYOUT.COMPLETE.electricity;
  ok('the price of the light coming back is his ruled ONE', K.backOn().costs === was);
  PU.PAYOUT.COMPLETE.electricity = 5;
  ok('*** MOVE HIS ONE AND THE PRICE FOLLOWS IT ***', K.backOn().costs === 5);
  const row = PU.PAYOUT.COMPLETE;
  delete PU.PAYOUT.COMPLETE;
  const no = K.backOn();
  PU.PAYOUT.COMPLETE = row; PU.PAYOUT.COMPLETE.electricity = was;
  ok('and with no ruling it REFUSES rather than relighting for free',
     no.can === false && no.why === 'NO_RULING', JSON.stringify(no));
  ok('the price is back where it was', K.backOn().costs === was);
});

/* ---- C. THE NOTICE THE BLOCK HOLDS THE DOOR AGAINST ---------------------- */
section('C the notice to quit', () => {
  const q = N.toQuit({ at: [75, 5], street: 'freeway', holder: 'Mob', day: 2, clock: '07:40', out: 3 });
  ok('a notice to quit issues with a landlord on it', q.issued, q.reason || '');
  ok('*** AND REFUSES WITHOUT ONE, because a notice with no landlord is a threatening letter ***',
     (() => { const r = N.toQuit({ at: [1, 2], street: 'x', day: 1, clock: '08:00' });
              return !r.issued && r.reason === 'NO_LANDLORD'; })());
  ok('it names the premises, the ground and the day they must be out',
     /PREMISES: FREEWAY 75-5/.test(q.en.join(' ')) &&
     /GROUND: ARREARS OF 1 BATTERY/.test(q.en.join(' ')) &&
     /GIVE UP POSSESSION OF THESE PREMISES ON DAY 5/.test(q.en.join(' ')));
  ok('the ground is his ONE, not a number typed here',
     q.amounts.owed === PU.PAYOUT.COMPLETE.electricity);
  ok('it goes out in both languages', /AVISO DE DESALOJO/.test(q.es.join(' ')));
});

/* ---- D. THE DOOR HOLDS, ON THE DEMO HE PLAYS ----------------------------- */
(async () => {
  let D;
  try { D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js')); }
  catch (e) { ok('the one driver is available', false, e.message); return done(); }

  let d = null;
  try { d = await D.open(); } catch (e) { ok('the demo opens', false, e.message); return done(); }

  try {
    await d.fr.evaluate(fs.readFileSync(path.join(ROOT, 'engine/bohemia_strike.js'), 'utf8'));
    const pad = await d.fr.evaluate(() => {
      const e = document.getElementById('pad'); if (!e) return null;
      const r = e.getBoundingClientRect();
      return { cx: Math.round(r.x + r.width / 2), cy: Math.round(r.y + r.height / 2),
               rad: Math.round(r.width / 2) };
    });
    if (!pad) { ok('the walk pad is on the glass', false); await d.close(); return done(); }

    const start = await d.fr.evaluate(() => ({ hx: hx, hy: hy }));
    /* PRESS OFF CENTRE. The pad is a ring: tapping its middle is not a direction,
       and the first cut of this walked nowhere and reported a still player's
       numbers as a walk. Same shape as PLUMBER's player-against-a-wall. */
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (let r0 = 0; r0 < 4; r0++) {
      const off = Math.round(pad.rad * 0.7);
      for (let k = 0; k < 12; k++) await d.tapAt(pad.cx + dirs[r0][0] * off, pad.cy + dirs[r0][1] * off);
      await d.page.waitForTimeout(450);
    }

    const r = await d.fr.evaluate((start) => {
      const O = { moved: (hx !== start.hx || hy !== start.hy) };
      const KK = window.BohemiaStrike, S = window.BohemiaStanding, M = window.CT_MINDS || {};
      const now = ctMinuteNow();
      const NB = BohemiaPopulation.NB, nx = (((hx / FN) | 0) / NB) | 0, ny = (((hy / FN) | 0) / NB) | 0;
      const blk = KK.onBlock(M, nx, ny);
      O.playerCV = typeof PLAYER_CV !== 'undefined' ? !!PLAYER_CV : false;
      O.drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW.length : -1;
      O.minds = Object.keys(M).length;
      O.onBlock = blk.length;
      O.weights = Object.keys(S.DEED_WEIGHT || {}).length;
      O.before = KK.held(M, '@', now, { nx: nx, ny: ny });
      O.cutBefore = KK.cutSticks(M, '@', now, { nx: nx, ny: ny }).sticks;

      /* A DEED THE BLOCK IS STANDING RIGHT THERE FOR, through the game's own
         witness(), with the game's own filled table and the block's own minds. */
      const good = Object.keys(S.DEED_WEIGHT).filter(k => S.DEED_WEIGHT[k] > 0)[0];
      const bad = Object.keys(S.DEED_WEIGHT).filter(k => S.DEED_WEIGHT[k] < 0)[0];
      O.haveKinds = !!(good && bad);
      const pos = {}; blk.forEach(m => { pos[m.owner] = { x: hx, y: hy }; });
      O.seenGood = S.witness(blk.slice(0, 4), now, '@', good, hx, hy, o => pos[o] || null);
      O.afterGood = KK.held(M, '@', now + 1, { nx: nx, ny: ny });
      O.cutAfterGood = KK.cutSticks(M, '@', now + 1, { nx: nx, ny: ny }).sticks;
      O.seenBad = S.witness(blk.slice(4), now + 1, '@', bad, hx, hy, o => pos[o] || null);
      O.afterBoth = KK.held(M, '@', now + 2, { nx: nx, ny: ny });
      return O;
    }, start);

    section('D the door holds on the demo', () => {
      /* THE VALIDITY FLOOR FIRST: a sample from a player who never moved is not a
         slow sample, it is a broken one. */
      ok('*** THE PLAYER ACTUALLY MOVED, so this sample is a walk ***', r.moved === true);
      ok('the demo sends the body in, so people are drawn (' + r.drew + ' on screen)',
         r.playerCV === true && r.drew > 0, JSON.stringify({ cv: r.playerCV, drew: r.drew }));
      ok('*** MINDS EXIST IN THE GAME (' + r.minds + '), WHICH THE 9/15 MEASUREMENT SAID THEY NEVER DO ***',
         r.minds > 0);
      ok('and some of them live on the block the player is standing on (' + r.onBlock + ')',
         r.onBlock > 0);
      ok('his quest corpus fills the weight table (' + r.weights + ' kinds)', r.weights > 0);
      ok('there is both a good deed kind and a bad one in it', r.haveKinds === true);

      ok('before anyone has seen anything the block is NOT_KNOWN',
         r.before.held === 'NOT_KNOWN', JSON.stringify(r.before.held));
      ok('and the cut sticks while nobody knows you', r.cutBefore === true);

      ok('a good deed is witnessed by the block (' + r.seenGood + ')', r.seenGood > 0);
      ok('*** AND THE BLOCK HOLDS THE DOOR ***',
         r.afterGood.held === 'HELD' && r.afterGood.vouch > r.afterGood.wont,
         JSON.stringify(r.afterGood));
      ok('*** SO THE OWNER\'S CUT STOPS STICKING ***', r.cutAfterGood === false);

      ok('a bad deed is witnessed too (' + r.seenBad + ')', r.seenBad > 0);
      ok('and it is counted against you without breaking a majority',
         r.afterBoth.wont > 0 && r.afterBoth.asked === r.afterBoth.vouch + r.afterBoth.wont,
         JSON.stringify(r.afterBoth));
    });
    ok('nothing threw on the demo', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  } catch (e) {
    fail++; console.log('  > FAIL D the door holds on the demo could not be measured  [' + e.message + ']');
  }
  try { await d.close(); } catch (e) {}
  done();
})();
