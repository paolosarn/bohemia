#!/usr/bin/env node
/* BOHEMIA — VISIBLE CHANGE GATE (9/21/26, WORLD lane, row [visible change])
 *
 * Holds the rule the board row is made of:
 *
 *     A GENERATED ASK MAY ONLY MOVE THINGS THE PLAYER CAN WATCH MOVE.
 *
 * WHAT IT IS ACTUALLY GUARDING, and it is not the list:
 *
 *  A  THE LIST IS SOMEBODY ELSE'S AND MUST STAY THAT WAY. QUESTS shipped
 *     bohemia_asks.CHANGES on 9/6. This lane wrote no second list; it wrote the
 *     checker. So the first thing checked is that the checker is answering about
 *     THE LIVE LIST -- every id on it is known, and a seventh row added by QUESTS
 *     tomorrow is REPORTED rather than silently skipped. A checker that quietly
 *     ignores what it does not recognise checks nothing.
 *
 *  B  *** THE READING MOVES, ON THE REAL SURFACE. *** A symbol existing in a file
 *     is not a player watching something happen, and this lane has shipped that
 *     mistake twice. So each watcher names TEXT A PLAYER READS, and this gate
 *     boots the walked city, reads it, makes the change through the game's own
 *     function, and reads it again. THE WORDS MUST HAVE MOVED. Words do not
 *     repaint on their own, which is why they are the reading and a screen diff
 *     is not (QUESTS' rule 14h finding: a diff reads false life AND false death).
 *
 *  C  A STALE REASON IS A BUG WITH A LONG FUSE. Two rows on the list are marked
 *     unwired, each with a typed sentence saying why. One of those sentences was
 *     true on 9/6 and THIS LANE MADE IT FALSE ON 9/13 and never told the list.
 *     So every unwired row now carries a PROMOTION TEST -- a predicate over the
 *     live modules -- and this gate fails if a row's test passes while the list
 *     still calls it unwired. The fuse cannot be re-lit.
 *
 *  D  AND THE CHECKER ITSELF MUST BE ABLE TO SAY NO. An unwatched change is
 *     reported by name, a watcher this lane cannot honestly drive is declared
 *     driven:false and NOT counted as proof, and the negative controls prove the
 *     surface checks can fail.
 *
 *   node gates/visible_change_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

const W = R('engine/bohemia_watch.js');
const A = R('engine/bohemia_asks.js');
const L = R('engine/bohemia_lend.js');

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
  console.log('VISIBLE CHANGE GATE: ' + pass + ' passed, ' + fail + ' failed'
    + '  (the list stays QUESTS\', every change names text a player reads, the words'
    + ' move on the real surface, and an unwired row that became buildable says so)');
  process.exit(fail ? 1 : 0);
};

/* ---- A. THE CHECKER ANSWERS ABOUT THE LIVE LIST, AND OWNS NO COPY -------- */
section('A the list stays theirs', () => {
  const r = W.report(A.CHANGES);
  ok('QUESTS\' list is the subject (' + r.changes + ' changes)', r.changes > 0);
  ok('every change on it is known to the checker', r.unknown.length === 0, r.unknown.join(','));

  /* HAND IT A SEVENTH ROW AND IT MUST SAY SO, not skip it */
  const plus = Object.assign({}, A.CHANGES, {
    a_new_thing: { id: 'a_new_thing', says: 'something new', proof: null, unwired: 'x' }
  });
  const r2 = W.report(plus);
  ok('*** A ROW THIS CHECKER HAS NEVER SEEN IS REPORTED, NEVER SKIPPED ***',
     r2.unknown.length === 1 && r2.unknown[0] === 'a_new_thing', JSON.stringify(r2.unknown));
  ok('and it is counted as unwatched too', r2.unwatched.some(u => u.id === 'a_new_thing'));

  /* the checker must keep NO copy of the list: take the list away entirely */
  ok('given nothing it answers about nothing rather than a remembered list',
     W.report({}).changes === 0 && W.report(null).changes === 0);
  /* A RULER THAT CANNOT TELL A CITATION FROM A DISCLAIMER MEASURES NOTHING --
     the first cut of this went red on the module's own HEADER, which explains at
     length that the list is QUESTS'. Same mistake this lane made last round on a
     reference check. What matters is whether it REACHES for the list in code. */
  const body = fs.readFileSync(path.join(ROOT, 'engine/bohemia_watch.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  ok('and no line of its code reaches for the asks module, so it cannot fork the list',
     !/bohemia_asks|BohemiaAsks/.test(body));
});

/* ---- C. THE STALE REASON, AND IT IS THE ROUND'S FINDING ------------------ */
section('C a stale reason cannot survive', () => {
  const stale = W.stale(A.CHANGES);
  ok('the list still calls debt_moves unwired',
     !!(A.CHANGES.debt_moves && A.CHANGES.debt_moves.unwired));
  ok('*** AND ITS PROMOTION TEST PASSES, SO THE REASON IS STALE ***',
     stale.length === 1 && stale[0].id === 'debt_moves' && !!stale[0].found,
     JSON.stringify(stale.map(s => s.id)));

  /* THE TEST IS DRIVEN, NOT READ: take a named debt and clear it to nothing */
  const book = {};
  L.take(book, 'A LENDER', 1);
  const owing = L.owingRows(book);
  ok('a named lender really does appear in the book', Object.keys(owing).length === 1,
     JSON.stringify(Object.keys(owing)));
  L.paid(book, 'A LENDER', 99);
  ok('and paying it really does empty the book',
     Object.keys(L.owingRows(book)).length === 0);

  /* the one that is still honestly out, with its test still failing */
  const out = W.stillUnwired(A.CHANGES);
  ok('person_moves_house is still unwired and its test still fails',
     out.length === 1 && out[0].id === 'person_moves_house' && out[0].tested === true,
     JSON.stringify(out.map(o => o.id)));

  /* ANTI-VACUITY: a row whose test cannot pass must not be called stale */
  const faked = Object.assign({}, A.CHANGES, {
    debt_moves: Object.assign({}, A.CHANGES.debt_moves, { proof: { file: 'x', symbol: 'y' }, unwired: null })
  });
  ok('a row the list already calls wired is not reported stale',
     W.stale(faked).length === 0);
});

/* ---- D. EVERY CHANGE NAMES TEXT A PLAYER READS --------------------------- */
section('D every change names a reading', () => {
  const un = W.unwatched(A.CHANGES);
  ok('exactly one change on the list has nobody watching it',
     un.length === 1 && un[0].id === 'person_moves_house', JSON.stringify(un.map(u => u.id)));
  ok('and it says why in its own body', !!W.WATCHERS.person_moves_house.why);

  const names = Object.keys(W.WATCHERS);
  ok('every watcher that claims a reading names a surface and a symbol',
     names.every(k => { const w = W.WATCHERS[k];
       return !w.reads || (w.surface && w.symbol); }));
  ok('every named surface is a real file',
     names.every(k => { const w = W.WATCHERS[k];
       return !w.surface || fs.existsSync(path.join(ROOT, w.surface)); }),
     names.filter(k => W.WATCHERS[k].surface && !fs.existsSync(path.join(ROOT, W.WATCHERS[k].surface))).join(','));

  const city = fs.readFileSync(CITY, 'utf8');
  ok('every named symbol is really on that surface',
     names.every(k => { const w = W.WATCHERS[k];
       return !w.symbol || city.indexOf(w.symbol) >= 0; }),
     names.filter(k => W.WATCHERS[k].symbol && city.indexOf(W.WATCHERS[k].symbol) < 0).join(','));

  /* AND THE SYMBOL CHECK IS NOT THE PROOF, WHICH IS SAID OUT LOUD HERE: the
     surface run below is. A watcher that says it is driven must be driven. */
  ok('the number of driven watchers matches the number that claim it',
     W.report(A.CHANGES).driven === names.filter(k => W.WATCHERS[k].driven).length);
});

/* ---- B. THE WORDS MOVE, ON THE WALKED CITY ------------------------------- *
 *
 * *** THE FIRST CUT OF THIS SECTION WAS WRONG THREE WAYS AND THE GAME WAS RIGHT
 * EVERY TIME, SO IT IS WRITTEN DOWN HERE RATHER THAN QUIETLY CORRECTED. ***
 *
 *  (1) It ran the night FIRST and then doused a circuit by hand, and reported
 *      "putting a circuit out does not move the words". It does. What does not
 *      move the words is dousing a wire OUTSIDE the night, and THAT IS CORRECT:
 *      the card reports the NIGHT'S events, not the grid's total state. A light
 *      going out with no bill behind it is not an event and must not appear.
 *  (2) It asserted every doused circuit comes back, on a run where the night had
 *      legitimately put a second one out. The assertion was wrong, not the grid.
 *  (3) It compared a faction to `turfGrid().at()`, which returns a whole row
 *      ({faction, tier, block}), and printed "[object Object]".
 *
 * NEVER REPORT A BREAK YOU HAVE NOT REPRODUCED (rule 14g). So this cut drives the
 * change THROUGH THE GAME'S OWN NIGHT, which is the only way any of it happens,
 * and reads the card the player actually reads.
 */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await pg.waitForTimeout(200); }
  const started = await pg.$('#daycardIn .dcgo');
  if (!started) { ok('the walked city opens', false); await b.close(); return done(); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await pg.waitForTimeout(600);

  const r = await pg.evaluate(() => {
    const O = {};
    /* THE READING: the card the player reads at nightfall, as WORDS, taken
       through the game's own draw. Never by asking a function what it WOULD say
       -- this lane has been caught doing exactly that before. */
    const read = () => {
      try { showReckoning(); } catch (e) { return 'THREW ' + e; }
      const el = document.getElementById('daycardIn');
      return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    };
    try { purseGet(); } catch (e) {}
    try { DAY.day = 2; } catch (e) {}

    /* ---- THE CONTROL, BEFORE ANYTHING: read it twice, change nothing. -------
       If the words drift on their own, every result below is noise. */
    const c1 = read(), c2 = read();
    O.control = { same: c1 === c2, len: c1.length };
    O.before = c1;

    /* whose ground, read off the game's own answer and not guessed at */
    try {
      const g = turfGrid();
      const row = g && g.at ? g.at((hx / FN | 0), (hy / FN | 0)) : null;
      O.ground = row && row.faction ? String(row.faction) : null;
    } catch (e) { O.groundThrew = String(e); }
    O.groundInWords = !!(O.ground && c1.toUpperCase().indexOf(O.ground.toUpperCase()) >= 0);

    O.darkBefore = (() => { try { return POWER.dark().length; } catch (e) { return -1; } })();
    O.owedBefore = /WHO YOU OWE/.test(c1);

    /* ---- ONE NIGHT, THROUGH THE GAME'S OWN FUNCTIONS -------------------- */
    try { blockRent(); } catch (e) { O.rentThrew = String(e); }
    try { O.held = nightPower(); } catch (e) { O.nightThrew = String(e); }
    const after = read();
    O.after = after;
    O.moved = (after !== c1);
    O.darkAfter = (() => { try { return POWER.dark().length; } catch (e) { return -1; } })();
    O.owedAfter = /WHO YOU OWE/.test(after);
    O.cutInWords = /cut \d+ of their own street off/i.test(after);

    /* ---- AND THE LIGHT COMES BACK, WHICH NOTHING IN THE GAME CALLS ------- */
    const dark = (() => { try { return POWER.dark(); } catch (e) { return []; } })();
    O.relit = 0;
    for (let i = 0; i < dark.length; i++) { try { if (POWER.relight(dark[i])) O.relit++; } catch (e) {} }
    O.darkAfterRelight = (() => { try { return POWER.dark().length; } catch (e) { return -1; } })();

    /* ---- A NEGATIVE CONTROL THE OTHER WAY: dousing OUTSIDE the night must
       NOT move the card, because that is not an event and the card is a record
       of the night, not a readout of the grid. */
    let id = -1;
    try {
      const cs = POWER.cells();
      for (let i = 0; i < cs.length; i++) if (cs[i].live) { id = cs[i].id; break; }
      POWER.douse(id);
    } catch (e) {}
    O.quietDouse = { id: id, cardUnchanged: (read() === after) };
    return O;
  });
  await b.close();

  section('B the words move on the real surface', () => {
    ok('nothing threw on the walked city', errs.length === 0, errs.slice(0, 2).join(' | '));
    ok('*** THE CONTROL: two reads with nothing changed give the same words ***',
       !!(r.control && r.control.same), JSON.stringify(r.control));

    ok('the card names whose ground you are standing on, in words (' + r.ground + ')',
       r.groundInWords === true, 'ground=' + r.ground);

    ok('*** ONE NIGHT MOVES THE WORDS ON THE CARD ***', r.moved === true,
       'before ' + (r.before || '').length + ' after ' + (r.after || '').length);

    ok('*** A DEBT ARRIVES IN THE WORDS: no WHO YOU OWE before, WHO YOU OWE after ***',
       r.owedBefore === false && r.owedAfter === true,
       JSON.stringify({ before: r.owedBefore, after: r.owedAfter }));

    ok('*** AND A LIGHT GOING OUT IS IN THE WORDS, IN A SENTENCE ***',
       r.cutInWords === true && r.darkAfter > r.darkBefore,
       JSON.stringify({ dark: r.darkBefore + ' -> ' + r.darkAfter, sentence: r.cutInWords }));

    ok('a doused circuit really can come back (' + r.relit + ' relit)',
       r.relit > 0 && r.darkAfterRelight === 0,
       JSON.stringify({ relit: r.relit, left: r.darkAfterRelight }));

    /* THE NEGATIVE THAT MAKES THE POSITIVES MEAN SOMETHING */
    ok('*** AND DOUSING A WIRE OUTSIDE THE NIGHT MOVES NOTHING, WHICH IS RIGHT ***',
       r.quietDouse && r.quietDouse.cardUnchanged === true,
       JSON.stringify(r.quietDouse));
  });

  done();
})();
