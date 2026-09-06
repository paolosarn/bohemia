/* ============================================================================
   ASKS VISIBLE GATE (9/6/26, QUESTS lane) -- VAMILY [asks exist],
   THE-WORLD-DOES-THE-ASKING.

   THE ONE RULE THIS GUARDS, from the 9/6 unpark ruling:

        *** AN ASK THAT CHANGES NOTHING VISIBLE IS NOT AN ASK. ***

   The research the ruling rests on is blunt: generated quests read as filler for
   exactly one reason, which is that finishing one changes nothing the player can
   see. So the visible change is the admission ticket, not the prize, and this
   gate exists because A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.

   WHAT IT HOLDS, AND WHY EACH ONE IS HERE:

   1. THE LAW ITSELF. A candidate with no visible change, or a change that is not
      on his list, is never offered. Not ranked low. Never offered.

   2. *** THE PROOF IS OPENED, NOT TRUSTED. *** Every wired change names a file
      and a symbol, and this gate READS THAT FILE AND FINDS THAT SYMBOL. This is
      the check that matters most, because the cheap way to pass rule 1 is to
      write a confident `proof` field pointing at a system that does not exist.
      A visible change we cannot point at in running code is a lie about the
      world, and it is the exact failure this whole row was created to prevent.

   3. NO NEW VERBS. The same ruling: the verbs are the ones we have, and an ask
      that needs a new one is a boss, not a quest. So every change's verb is
      checked against the verbs bohemia_quest_runtime.js actually runs, parsed
      out of the runtime rather than typed in here.

   4. THE UNWIRED ONES STAY REFUSED. Two of his six (a debt clearing, somebody
      moving house) have no system behind them. They ship listed and refused. If
      somebody wires one, this gate makes them prove it the same way as the rest.

   5. NOTHING INVENTED. MECHANISM-MINE / CONTENTS-PAOLO'S: the generator holds no
      threshold, count or price of its own. Every number in an ask came out of
      the live snapshot. A digit in the table is a ruling somebody skipped.

   6. AN EMPTY WORLD IS QUIET. No world state means no ask, not a placeholder ask.
      This is the failure mode that turns a generator into filler on day one.

   7. AND THE LIST IS HIS. Six changes, from the ruling, word for word. A seventh
      is a ruling, not a commit.
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

/* ---- 7. THE LIST IS HIS ------------------------------------------------- */
const RULING = path.join(ROOT, 'records/BOHEMIA_RULING_QUESTS_ARE_UNPARKED_9_6_26.md');
ok('7a the unpark ruling this table comes from is in the repo', fs.existsSync(RULING));
const all = A.changes();
ok('7b six visible changes, no more (' + all.length + ')', all.length === 6);
if (fs.existsSync(RULING)) {
  /* NORMALISE WHITESPACE FIRST. The ruling is a wrapped markdown file, so
     "a person moves house" is split across a newline in the source. Matching
     raw text made this gate fail on a phrase that is genuinely there, which is
     a bug in the checker, not in the table. */
  const txt = fs.readFileSync(RULING, 'utf8').toLowerCase().replace(/\s+/g, ' ');
  /* each change has to be traceable to a phrase in his own ruling */
  const traces = {
    block_changes_hands: 'block changes hands',
    light_comes_back:    'light comes back on',
    shelf_refills:       'shelf refills',
    rumour_turns:        'rumour about you changes',
    debt_moves:          'debt clears or is called in',
    person_moves_house:  'person moves house'
  };
  const untraceable = all.map(c => c.id).filter(id => !traces[id] || txt.indexOf(traces[id]) < 0);
  ok('7c every change traces to a phrase in his ruling (' + untraceable.length + ' do not)',
     untraceable.length === 0, untraceable.join(' '));
}

/* ---- 2. THE PROOF IS OPENED, NOT TRUSTED -------------------------------- */
const wired = A.wired();
ok('2a something is actually wired (' + wired.length + ' of 6)', wired.length >= 1);
let badProof = [];
wired.forEach(c => {
  const f = path.join(ROOT, c.proof.file);
  if (!fs.existsSync(f)) { badProof.push(c.id + ': no file ' + c.proof.file); return; }
  const src = fs.readFileSync(f, 'utf8');
  if (src.indexOf(c.proof.symbol) < 0) badProof.push(c.id + ': ' + c.proof.file + ' has no ' + c.proof.symbol);
});
ok('2b *** every wired change points at a real system, opened and read ('
   + badProof.length + ' lies) ***', badProof.length === 0, badProof.join(' | '));

/* ---- 3. NO NEW VERBS ---------------------------------------------------- */
const RT = fs.readFileSync(path.join(ROOT, 'engine/bohemia_quest_runtime.js'), 'utf8');
const runtimeVerbs = new Set(
  (RT.match(/case '([a-z_]+)'/g) || []).map(s => s.slice(6, -1)));
const newVerbs = A.changes()
  .filter(c => c.does)
  .filter(c => !runtimeVerbs.has(c.does))
  .map(c => c.id + ' wants ' + c.does);
ok('3a every ask uses a verb the runtime already runs (' + runtimeVerbs.size
   + ' known, ' + newVerbs.length + ' new)', newVerbs.length === 0, newVerbs.join(' | '));

/* ---- 1. THE LAW ITSELF -------------------------------------------------- */
ok('1a a candidate naming no change is refused',
   A.refuse({ who: 'somebody', where: 'somewhere' }) !== null);
ok('1b a candidate naming a change that is not on his list is refused',
   A.refuse({ changes: 'a_new_idea', who: 'x', where: 'y' }) !== null);
ok('1c a candidate with nobody asking is refused',
   A.refuse({ changes: 'shelf_refills', where: 'y' }) !== null);
ok('1d a candidate that happens nowhere is refused',
   A.refuse({ changes: 'shelf_refills', who: 'x' }) !== null);
ok('1e a whole candidate is an ask',
   A.refuse({ changes: 'shelf_refills', who: 'x', where: 'y' }) === null);

/* AND THE REAL TEST: drive the generator with a world that produces a candidate
   for EVERY change, wired and unwired, and prove only the wired ones come out. */
const fullWorld = {
  shelves:  [{ empty: true,  who: 'p1', where: 'd1', good: 'g' }],
  circuits: [{ live: false,  who: 'p2', where: 'd2', id: 'c1' }],
  borders:  [{ blocked: true, who: 'p3', where: 'd3', owner: 'f1' }],
  talk:     [{ against: true, who: 'p4', where: 'd4', about: 'p9' }]
};
const cands = A.candidates(fullWorld);
const offered = cands.filter(c => !c.refused);
ok('1f with a full world, every candidate offered names a visible change ('
   + offered.length + ' offered of ' + cands.length + ')',
   offered.length > 0 && offered.every(c => !!A.CHANGES[c.changes] && !!A.CHANGES[c.changes].proof));
const one = A.offer(fullWorld);
ok('1g offer() hands back an ask with the visible change on it',
   !!one && !!one.visible && one.visible.length > 0 && one.draft === true);
ok('1h and why() is never empty for something that was offered',
   !!one && A.why(one).length > 0);

/* ---- 4. THE UNWIRED ONES STAY REFUSED ----------------------------------- */
const unwired = A.unwired();
ok('4a the unwired changes are listed, not hidden (' + unwired.length + ')', unwired.length >= 1);
ok('4b and every one of them says WHY it is unwired',
   unwired.every(c => typeof c.unwired === 'string' && c.unwired.length > 10));
const unwiredOffered = unwired.filter(c => A.refuse({ changes: c.id, who: 'x', where: 'y' }) === null);
ok('4c and not one of them can ever be offered (' + unwiredOffered.length + ' leaked)',
   unwiredOffered.length === 0, unwiredOffered.map(c => c.id).join(' '));

/* ---- 5. NOTHING INVENTED ------------------------------------------------ */
/* A number inside the change table is a threshold nobody ruled. The whole table
   is read back as text and any bare digit fails. */
const tableText = JSON.stringify(A.CHANGES);
const digits = tableText.match(/\d/g) || [];
ok('5a no number lives in the table (' + digits.length + ' found)', digits.length === 0,
   digits.slice(0, 8).join(''));
/* And the module itself holds no scoring weights: the only ordering is the
   order the world handed things in, which is stated in the source. */
const SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_asks.js'), 'utf8');
ok('5b the module says out loud that it does not rank asks',
   /which one to offer\s*\n?\s*\* *first when several are live is a ruling nobody has made|ruling nobody has made/.test(SRC));
ok('5c and every ask is a draft attempt, never presented as approved words',
   all.every(c => c.draft === true));

/* ---- 6. AN EMPTY WORLD IS QUIET ----------------------------------------- */
ok('6a nothing running means nothing asked', A.offer({}) === null);
ok('6b and a missing snapshot does not crash it', A.offer() === null && A.offer(null) === null);
ok('6c a world where every shelf is full asks nothing',
   A.offer({ shelves: [{ empty: false, who: 'p', where: 'd', good: 'g' }] }) === null);
ok('6d and refusals can be read back rather than swallowed',
   Array.isArray(A.refusals({ shelves: [{ empty: true, where: 'd' }] })));

/* ---- PLAN: names the move, never performs it ---------------------------- */
ok('P1 plan() names the system that must move and the file it lives in',
   (() => { const p = A.plan(one); return !!p && !!p.file && !!p.symbol && !!p.visible; })());
ok('P2 plan() is null for anything unwired',
   A.plan({ changes: 'debt_moves' }) === null);
ok('P3 the generator writes into no other system (no assignment into a foreign module)',
   !/Bohemia(Standing|Economy|Brownout|Engine)\s*\.[A-Za-z]+\s*=/.test(SRC));

/* ======================================================================== */
/*  THE REAL SURFACE (7/18 VERIFY ON THE REAL SURFACE)                       */
/*                                                                           */
/*  A generator that only ever runs in node is a generator nobody plays. The  */
/*  whole point of this row is somebody standing in front of you IN THE       */
/*  WALKED CITY, so the gate opens the alpha, walks into the city frame, and  */
/*  drives the seam that the player's world actually feeds.                   */
/* ======================================================================== */
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
    const tapped = await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (!t) return false;
      t.click(); return true;
    });
    ok('R1 the RUN tab exists in the alpha and was tapped', tapped === true);
    await SETTLE(page, 16000);

    let city = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof ctAskNow === 'function')) { city = f; break; } }
      catch (_e) {}
    }
    ok('R2 *** the ask generator reached the frame the player looks at ***', !!city);

    if (city) {
      /* R3: the module itself is alive in there, not just the seam. */
      const live = await city.evaluate(() => ({
        hasMod: typeof BohemiaAsks !== 'undefined',
        wired: (typeof BohemiaAsks !== 'undefined') ? BohemiaAsks.wired().length : -1,
        changes: (typeof BohemiaAsks !== 'undefined') ? BohemiaAsks.changes().length : -1
      }));
      ok('R3 the generator is running in the city, not only in node ('
         + live.wired + ' of ' + live.changes + ' wired)',
         live.hasMod === true && live.wired === wired.length && live.changes === 6);

      /* R4: THE SEAM READS THE REAL WORLD. The snapshot has to come back in the
         generator's shape from the live valley without throwing. */
      const snap = await city.evaluate(() => {
        try { const s = ctAskSnapshot();
              return { ok: true, keys: Object.keys(s).sort().join(','),
                       counts: Object.keys(s).map(k => k + ':' + s[k].length).join(' ') }; }
        catch (e) { return { ok: false, err: String(e.message) }; }
      });
      console.log('  [live valley] ' + (snap.counts||snap.err));
      ok('R4 the seam reads the live valley without throwing (' + (snap.counts || snap.err) + ')',
         snap.ok === true && snap.keys === 'borders,circuits,shelves,talk');

      /* R4b: *** THE SEAM IS WIRED TO THE PEOPLE THE CITY CAN SEE. ***
         This check exists because of a real bug this gate did NOT catch on its
         first run: the seam asked for people with CELL coordinates when people
         are keyed by NEIGHBOURHOOD, so it found nobody in 289 cells around the
         player and the whole feature read as "the valley is quiet". Everything
         was green, because quiet is a legal answer. So quiet is no longer
         allowed to be un-explained: if the city can see people, the seam must
         see somebody too. */
      const seam = await city.evaluate(() => {
        let everyone = -1, who = null, dark = null;
        try { everyone = (ctEveryone() || []).length; } catch (e) {}
        try { const s = ctAskSnapshot();
              who = (s.circuits[0] || s.shelves[0] || s.borders[0] || s.talk[0] || {}).who || null;
              dark = s.circuits.length; } catch (e) {}
        return { everyone, who, dark };
      });
      ok('R4b the seam sees the people the city sees (' + seam.everyone + ' on screen)',
         seam.everyone > 0);
      ok('R4c and when the city has people, the seam names one (' + (seam.who || 'nobody') + ')',
         seam.everyone <= 0 || !!seam.who);

      /* R5: AND THE LAW HOLDS ON THE REAL SURFACE. Whatever the live world
         produced, an ask that came out of it names a visible change, and if it
         produced nothing then nothing was offered. Both are correct; silently
         offering something empty is the only failure. */
      const asked = await city.evaluate(() => {
        const a = ctAskNow();
        if (!a) return { none: true };
        return { none: false, changes: a.changes, visible: a.visible,
                 does: a.does, draft: a.draft, who: !!a.who, where: !!a.where };
      });
      console.log('  [live ask] ' + JSON.stringify(asked));
      /* R5a: THE IMPLICATION, NOT A HARD-CODED EXPECTATION. If the valley put a
         want in front of the player, an ask has to come out of it. A generator
         that goes quiet while its own snapshot is full is the silent failure. */
      ok('R5a a want in the live snapshot produces an ask (' + seam.dark + ' dark, '
         + (asked.none ? 'no ask' : asked.changes) + ')',
         !(seam.dark > 0 && seam.who) || asked.none === false);
      ok('R5 *** on the real surface, nothing is ever offered without a visible'
         + ' change *** (' + (asked.none ? 'the valley is quiet here' : asked.changes) + ')',
         asked.none === true ||
         (!!asked.visible && asked.visible.length > 0 && asked.draft === true
          && asked.who && asked.where && runtimeVerbs.has(asked.does)));

      /* R6: AND IT IS NOT DEAD CODE. Hand the live frame a world that HAS a want
         and prove the same generator, in the browser, produces the ask. This is
         the difference between "the seam did not throw" and "it works". */
      const forced = await city.evaluate(() => {
        const a = BohemiaAsks.offer({
          circuits: [{ live: false, who: 'P:city:test', where: '1,1', id: 7 }]
        });
        return a ? { changes: a.changes, visible: a.visible, does: a.does } : null;
      });
      ok('R6 a dark block with somebody on it produces an ask in the browser ('
         + (forced ? forced.visible : 'nothing') + ')',
         !!forced && forced.changes === 'light_comes_back' && !!forced.visible);

      /* R7: and the browser refuses the unwired ones exactly like node does. */
      const refused = await city.evaluate(() =>
        BohemiaAsks.refuse({ changes: 'debt_moves', who: 'x', where: 'y' }));
      ok('R7 and an unwired change is refused in the browser too', typeof refused === 'string');
    }

    ok('R8 nothing threw while the valley was asked', errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('ASKS VISIBLE GATE: ' + pass + ' passed, ' + fail + ' failed'
    + '  (' + wired.length + ' of 6 changes wired, ' + runtimeVerbs.size + ' runtime verbs known)');
  process.exit(fail ? 1 : 0);
})();
