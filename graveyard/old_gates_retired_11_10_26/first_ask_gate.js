/* ============================================================================
   FIRST ASK GATE (9/13/26, QUESTS lane) -- VAMILY [first ask],
   THE-FIRST-ASK-A-STRANGER-MEETS.

   THE ROW: "with the cold open deferred and [wake near] moving the spawn, the
   first thing a player meets that wants something is now an ASK from the world,
   not a scene. Author the first three that can fire in the first ten minutes
   from what already runs (a shelf that emptied, a bill that came due, a person
   who owes), each checkable by walking somewhere and each changing something
   visible. No story needed; these are mechanism."

   *** WHY THIS GATE EXISTS AT ALL, AND IT IS NOT THE PART YOU WOULD GUESS. ***

   The generator and its gate were already green. 38 checks, zero failures, and
   the one ask a stranger actually met in the first ten minutes was this:

       { changes:'light_comes_back', about:-1, where:'6205,6271' }

   A circuit numbered MINUS ONE. The first sentence the world says to a new
   player was about a thing that does not exist, and every gate in the repo was
   green while it said it. Two separate bugs made that, and both are the same
   bug wearing different clothes:

   1. POWER.at answers {live:false, id:-1} for EVERY coordinate in existence --
      measured by asking it about NaN and about a cell a million cells away. So
      "the grid said this block is dark" is not evidence of anything. id:-1 is
      the grid's own way of saying THERE IS NO CIRCUIT HERE.

   2. AND THE SEAM WAS ASKING IN THE WRONG SPACE ENTIRELY. hx,hy are the
      player's FINE coordinates; the power grid and the turf map are both keyed
      by MAP CELL, and the city converts one to the other the same way in eight
      other places in that file: (hx/FN)|0. FN is 128. The player's feet are
      6205,6271 and the cell is 48,48. Asking a 96-wide map about cell 6,205 is
      asking about nothing, forever, for every player in every seed.

   That is how I concluded, out loud and in a shipped comment, that this valley
   had no circuits after probing 120,801 cells. In the right space the same grid
   holds 3,494 circuits, 3,136 of them dark, one of them a single cell from the
   waking block. THE MEASUREMENT WAS NOT WRONG. THE QUESTION WAS.

   So the lesson this gate is built around, and the reason half its checks look
   paranoid:

       *** A READER THAT ANSWERS "NOTHING" EVERYWHERE IS NOT A QUIET WORLD.
           IT IS A WRONG QUESTION. AND "QUIET IS A LEGAL ANSWER" IS EXACTLY
           WHAT LETS IT HIDE. ***

   WHAT IT HOLDS:

   1. THE THREE FIRE. At minute one, on the real walked surface, the valley has
      three asks and they are three DIFFERENT changes. Not one. Not a list with
      a hole in it.

   2. *** EACH ONE IS A PLACE YOU WALK TO. *** His words: "each checkable by
      walking somewhere." An ask about the cell under your feet is checkable by
      standing still, which is a label and not a want. So no ask may name the
      player's own cell.

   3. *** AND THE PLACE IS REAL WHEN YOU GET THERE. *** This is check 2's teeth
      and the one that would have caught the shipped bug. Every place an ask
      names is re-opened against the live world: the dark block's circuit id has
      to be THAT id at THAT cell and still dark; the border cell has to be held
      by THAT faction and a different one from the ground underfoot; the market's
      good has to be on the real shelf with the smallest daysLeft on it.

   4. THE SPACE IS NAMED AND CHECKED. Every place an ask names is inside the map
      (0..n-1). A seam that regressed to fine coordinates cannot satisfy this for
      one single ask, which is the regression guard for the whole bug above. The
      gate also measures the fine-coordinate answer directly and states it, so
      the failure is recorded as a number and not as a memory.

   5. NOTHING IS INVENTED, AND THE MISSING ONE STAYS MISSING. His three examples
      were a shelf, a bill, and a person who owes. The shelf is real. The other
      two are NOT here and are not faked: debt_moves carries proof:null in the
      generator because nothing in the repo owns a balance with a name on it
      that anybody can clear. The gate asserts it is still unwired, so nobody
      can quietly satisfy this row by writing a confident table row.

   6. NEGATIVE CONTROLS, because a check that cannot fail is decoration. Each of
      the three readers is fed a world with its fact removed and must go silent,
      and fed a world with its fact present and must speak.
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};

global.window = global;
const A = require(path.join(ROOT, 'engine/bohemia_asks.js'));

/* ========================================================================== */
/*  PART ONE -- THE MODULE, IN NODE, WITH CONTROLS                            */
/* ========================================================================== */

/* ---- 5. THE MISSING ONE STAYS MISSING ----------------------------------- */
ok('1a a debt clearing is still NOT wired, so it cannot be faked into this row',
   A.CHANGES.debt_moves && A.CHANGES.debt_moves.proof === null);
ok('1b and the generator refuses it by name',
   typeof A.refuse({ changes: 'debt_moves', who: 'x', where: '1,1' }) === 'string');
ok('1c somebody moving house is still not wired either',
   A.CHANGES.person_moves_house && A.CHANGES.person_moves_house.proof === null);

/* ---- the three this row ships are all wired ------------------------------ */
const THREE = ['shelf_refills', 'light_comes_back', 'block_changes_hands'];
THREE.forEach((id, i) => {
  ok('1d' + i + ' ' + id + ' is wired, so an ask made of it is real',
     !!(A.CHANGES[id] && A.CHANGES[id].proof && A.CHANGES[id].proof.file));
  const f = A.CHANGES[id] && A.CHANGES[id].proof && A.CHANGES[id].proof.file;
  ok('1e' + i + ' and the file it points at exists on disk (' + f + ')',
     !!f && fs.existsSync(path.join(ROOT, f)));
});

/* ---- 6. NEGATIVE CONTROLS, one per reader -------------------------------- */
const HERE = { who: 'P:city:1', where: '48,48' };
const WORLDS = {
  shelf_gone:     { shelves: [{ empty: true,  scarcest: false, good: 'food', ...HERE }] },
  shelf_scarcest: { shelves: [{ empty: false, scarcest: true,  good: 'food', ...HERE }] },
  shelf_neither:  { shelves: [{ empty: false, scarcest: false, good: 'food', ...HERE }] },
  dark:           { circuits: [{ live: false, id: 757, ...HERE }] },
  lit:            { circuits: [{ live: true,  id: 757, ...HERE }] },
  border:         { borders: [{ blocked: true,  owner: 'Church', ...HERE }] },
  noborder:       { borders: [{ blocked: false, owner: 'Church', ...HERE }] },
  empty:          {}
};
const got = k => A.offer(WORLDS[k]);
ok('2a a shelf whose good is GONE asks',            !!got('shelf_gone'));
ok('2b a shelf whose good is merely the SCARCEST asks too (this row added that)',
   !!got('shelf_scarcest') && got('shelf_scarcest').changes === 'shelf_refills');
ok('2c *** a shelf that is neither is SILENT ***',  got('shelf_neither') === null);
ok('2d a dark circuit asks',                        !!got('dark') && got('dark').changes === 'light_comes_back');
ok('2e *** a lit circuit is SILENT ***',            got('lit') === null);
ok('2f a blocked border asks',                      !!got('border') && got('border').changes === 'block_changes_hands');
ok('2g *** an open border is SILENT ***',           got('noborder') === null);
ok('2h *** an empty world is SILENT ***',           got('empty') === null);
/* and nobody asking, or nowhere for it to happen, is refused for each of three */
THREE.forEach((id, i) => {
  ok('2i' + i + ' ' + id + ' with nobody asking is refused',
     typeof A.refuse({ changes: id, where: '48,48' }) === 'string');
  ok('2j' + i + ' ' + id + ' with nowhere to happen is refused',
     typeof A.refuse({ changes: id, who: 'P:city:1' }) === 'string');
});

/* ---- the three together are three, not one ------------------------------- */
const ALL3 = { ...WORLDS.shelf_scarcest, ...WORLDS.dark, ...WORLDS.border };
const cands = A.candidates(ALL3).filter(A.isAsk);
ok('2k a world holding all three facts yields three asks (' + cands.length + ')',
   cands.length === 3);
ok('2l and they are three different changes',
   new Set(cands.map(c => c.changes)).size === 3);

/* ---- the seam's source, read as text: the space is converted, once -------- */
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const SEAM = CITY.slice(CITY.indexOf('function ctAskSnapshot()'),
                        CITY.indexOf('function ctFirstAsks()'));
ok('3a the seam is in the city at all', SEAM.length > 500);
ok('3b *** the seam converts the player to map cells before asking any grid ***',
   /var cx=\(hx\/FN\)\|0, cy=\(hy\/FN\)\|0;/.test(SEAM));
ok('3c and it never asks the power grid in fine coordinates again',
   !/POWER\.at\(hx,\s*hy\)/.test(SEAM));
ok('3d nor the turf map', !/\.at\(hx,\s*hy\)/.test(SEAM));
ok('3e the border no longer hides inside the standing test (it is its own read)',
   SEAM.indexOf('turfGrid()') > SEAM.indexOf('snap.circuits.push'));

/* ========================================================================== */
/*  PART TWO -- THE REAL SURFACE, WHICH IS THE ONLY PLACE THIS ROW IS TRUE    */
/* ========================================================================== */
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await SETTLE(page, 16000);

    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof ctFirstAsks === 'function')) { city = f; break; } }
      catch (_e) {}
    }
    ok('4a *** the first-asks reader reached the frame the player looks at ***', !!city);
    if (!city) throw new Error('no city frame');

    /* 4. THE SPACE, MEASURED AND STATED RATHER THAN REMEMBERED. */
    const space = await city.evaluate(() => {
      const cx = (hx / FN) | 0, cy = (hy / FN) | 0;
      const fine = POWER.at(hx, hy), cell = POWER.at(cx, cy);
      let circ = 0, dark = 0;
      const N = (om && om.n) | 0;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const c = POWER.at(x, y);
        if (c && c.id != null && c.id !== -1) { circ++; if (c.live === false) dark++; }
      }
      return { FN, N, feet: hx + ',' + hy, cell: cx + ',' + cy,
               fineId: fine ? fine.id : null, cellId: cell ? cell.id : null,
               circ, dark };
    });
    console.log('  [space] FN=' + space.FN + ' map=' + space.N + ' feet=' + space.feet
      + ' cell=' + space.cell + ' | circuits=' + space.circ + ' dark=' + space.dark);
    ok('4b the map is square and real (' + space.N + ' cells across)', space.N > 0);
    ok('4c *** asking the grid in FINE coordinates answers id -1, which is the bug'
       + ' this row fixed *** (fine=' + space.fineId + ')', space.fineId === -1);
    ok('4d *** and in the right space the valley has circuits *** ('
       + space.circ + ', ' + space.dark + ' dark)', space.circ > 0 && space.dark > 0);

    /* 1. THE THREE FIRE, ON THE REAL SURFACE, AT MINUTE ONE. */
    const three = await city.evaluate(() => {
      const a = ctFirstAsks();
      return { n: a.length, asks: JSON.parse(JSON.stringify(a)),
               feet: ((hx / FN) | 0) + ',' + ((hy / FN) | 0),
               minute: (typeof ctMinuteNow === 'function') ? ctMinuteNow() : null };
    });
    console.log('  [the first asks] ' + three.asks.map(a =>
      a.changes + ' @' + a.where + ' about ' + a.about).join('  |  '));
    ok('5a *** the valley has three asks at minute one *** (' + three.n + ')', three.n === 3);
    ok('5b and they are three different changes',
       new Set(three.asks.map(a => a.changes)).size === three.asks.length);
    ok('5c the shelf, the dark block and the border are all among them',
       THREE.every(c => three.asks.some(a => a.changes === c)));

    /* 2. EACH ONE IS A PLACE YOU WALK TO. */
    ok('5d *** not one of them names the cell you are standing on ***  (feet '
       + three.feet + ')', three.asks.every(a => a.where !== three.feet));
    /* 4 again: every place is inside the map, which a fine-coordinate seam
       could not manage for a single ask. */
    ok('5e every place an ask names is inside the map',
       three.asks.every(a => {
         const p = String(a.where).split(',');
         const x = parseInt(p[0], 10), y = parseInt(p[1], 10);
         return !isNaN(x) && !isNaN(y) && x >= 0 && y >= 0 && x < space.N && y < space.N;
       }));
    ok('5f every ask is an attempt, names somebody, and names a verb the game runs',
       three.asks.every(a => a.draft === true && !!a.who && !!a.does && !!a.visible));

    /* 3. *** AND THE PLACE IS REAL WHEN YOU GET THERE. *** */
    const walked = await city.evaluate(() => {
      const out = {};
      const at = w => { const p = String(w).split(','); return [parseInt(p[0], 10), parseInt(p[1], 10)]; };
      const asks = ctFirstAsks();
      const dark = asks.find(a => a.changes === 'light_comes_back');
      if (dark) { const [x, y] = at(dark.where); const c = POWER.at(x, y);
        out.dark = { want: dark.about, id: c ? c.id : null, live: c ? c.live : null }; }
      const bor = asks.find(a => a.changes === 'block_changes_hands');
      if (bor) { const [x, y] = at(bor.where); const g = turfGrid();
        const there = g ? g.at(x, y) : null, here = g ? g.at((hx / FN) | 0, (hy / FN) | 0) : null;
        out.border = { want: bor.about, there: there ? there.faction : null,
                       here: here ? here.faction : null }; }
      const sh = asks.find(a => a.changes === 'shelf_refills');
      if (sh) { const rows = (mktShelf() || []).filter(r => r.daysLeft != null);
        let least = null;
        rows.forEach(r => { if (!least || r.daysLeft < least.daysLeft) least = r; });
        const hub = mktHub();
        out.shelf = { want: sh.about, least: least ? least.good : null,
                      days: least ? least.daysLeft : null,
                      where: sh.where, hub: hub ? (hub.x + ',' + hub.y) : null }; }
      return out;
    });
    console.log('  [walked] ' + JSON.stringify(walked));
    ok('6a *** walk to the dark block and the circuit the ask named is THERE, and'
       + ' still dark *** (wanted ' + (walked.dark && walked.dark.want) + ', found '
       + (walked.dark && walked.dark.id) + ')',
       !!walked.dark && walked.dark.id === walked.dark.want && walked.dark.live === false);
    ok('6b and it is a circuit that exists, never the grid\'s -1 for nowhere',
       !!walked.dark && walked.dark.id !== -1 && walked.dark.id != null);
    ok('6c *** walk to the border and the faction the ask named holds it ***  ('
       + (walked.border && walked.border.there) + ')',
       !!walked.border && walked.border.there === walked.border.want);
    ok('6d *** and it is somebody ELSE\'S ground, which is what makes it a border ***'
       + '  (you: ' + (walked.border && walked.border.here) + ')',
       !!walked.border && !!walked.border.here && walked.border.here !== walked.border.there);
    ok('6e *** the good the shelf asks for is the one the real shelf has least of ***'
       + '  (' + (walked.shelf && walked.shelf.want) + ', '
       + (walked.shelf && walked.shelf.days) + ' days)',
       !!walked.shelf && walked.shelf.want === walked.shelf.least);
    ok('6f and the place it names is the market, not wherever you happen to stand',
       !!walked.shelf && walked.shelf.where === walked.shelf.hub);

    /* 6. NEGATIVE CONTROL ON THE LIVE SURFACE. Take the fact away in the browser
       and the ask must go, or the reader is answering from something other than
       the world. */
    const control = await city.evaluate(() => {
      const realAt = POWER.at;
      POWER.at = function () { return { live: false, owner: null, id: -1,
                                        faction: null, ground: null, free: false }; };
      let n = -1, kinds = '';
      try { const a = ctFirstAsks(); n = a.length; kinds = a.map(x => x.changes).join(','); }
      finally { POWER.at = realAt; }
      const back = ctFirstAsks().length;
      return { n, kinds, back };
    });
    ok('7a *** with every circuit gone from the live grid, the dark-block ask goes'
       + ' with it *** (' + control.kinds + ')',
       control.n === 2 && control.kinds.indexOf('light_comes_back') < 0);
    ok('7b and it comes back when the grid does (' + control.back + ')', control.back === 3);

    const control2 = await city.evaluate(() => {
      const g = turfGrid(); const realAt = g.at;
      g.at = function () { return { faction: 'Mob', tier: 'fortress', ruled: false, block: 0 }; };
      let n = -1, kinds = '';
      try { const a = ctFirstAsks(); n = a.length; kinds = a.map(x => x.changes).join(','); }
      finally { g.at = realAt; }
      return { n, kinds };
    });
    ok('7c *** when the whole valley is one faction there is no border to cross,'
       + ' and the border ask goes quiet *** (' + control2.kinds + ')',
       control2.n === 2 && control2.kinds.indexOf('block_changes_hands') < 0);

    ok('8a nothing threw while the valley was asked three times over',
       errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('FIRST ASK GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
