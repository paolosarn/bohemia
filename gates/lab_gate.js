/* ============================================================================
   LAB GATE (7/26/26, LAB lane) — THE REFERENCE LAB, machine-locked.

   AMENDED THE SAME DAY IT WAS WRITTEN, because the lane got the assignment wrong
   the first time. Paolo: "who said I wanted to test the walking... it was
   supposed to be like the actual game and all its mechanics... you need to get
   the code online and implement it for the different game mechanics like
   marriage and fishing in farming".

   So this gate now holds SIX clauses, not four:

     1. AN EMULATION IS MECHANICS, NOT FEEL. Each registry row DECLARES its
        mechanics; fewer than three fails, and a declared "mechanic" that is
        really plumbing (movement, camera, collision, lighting, transition)
        fails outright. That is clause 1+4 of
        laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md.
     2. THE LOOP CLOSES. Every declared mechanic has a live end-to-end check
        that PLAYS it to completion in a real browser. A demo of step one is not
        a mechanic.
     3. NEVER THE GAME. No engine module, no bank, no alpha, no postMessage —
        and nothing shipped links back to a lab page either.
     4. THREE DELIVERABLES: playable page, record of the numbers, pattern note.
     5. THE NUMBERS ARE SOURCED. Every constant in the page's SDV block appears
        in its record with a file:line citation from the master's own source.
     6. MEASURED, NOT ASSERTED. The live half drives the page's own functions
        through window.LAB, so it tests the shipped code path, never a second
        copy of the maths.

   Requires playwright (installed globally in this environment).
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROOF_DIR = process.env.LAB_GATE_PROOF_DIR
  ? path.resolve(ROOT, process.env.LAB_GATE_PROOF_DIR)
  : require('os').tmpdir();

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const near = (a, b, eps) => Math.abs(a - b) <= (eps === undefined ? 0.01 : eps);

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* Words that are NOT mechanics. Clause 4 of the whole-mechanics addendum: these
   are plumbing inside a mechanic and may never be a lab deliverable again. */
const NOT_A_MECHANIC = ['walk', 'walking', 'movement', 'move', 'camera', 'collision',
  'lighting', 'light', 'transition', 'feel', 'render', 'zoom', 'input'];

/* GRAVEYARDED EMULATIONS. Paolo 7/26: the Zomboid house was KILLED ("really bad
   and not fun") and its per-item time economy is now an ANTI-reference — see
   laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md. Its row is gone and
   the graveyard gate keeps the page from coming back. Its teardown and pattern
   note survive as records of what was measured, marked dead at the top. */

const EMULATIONS = [
  {
    /* LAB-03: the three mechanics standing in a world you walk around. This is
       the shape the lane ships in from now on — mechanics IN A PLACE. */
    id: 'STARDEW ONE WORLD',
    game: 'Stardew Valley',
    mechanics: ['fishing', 'farming', 'marriage'],
    page: 'slices/lab/BOHEMIA_LAB_STARDEW_WORLD_7_26_26.html',
    record: ['records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt',
             'records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt',
             'records/lab/BOHEMIA_LAB_STARDEW_WORLD_NOTE_7_26_26.md'],
    pattern: 'records/lab/BOHEMIA_LAB_STARDEW_WORLD_NOTE_7_26_26.md',
    live: liveWorld,
    shot: { name: 'BOHEMIA_LAB_STARDEW_WORLD_PROOF_7_26_26.png', setup: shotWorld }
  },
  {
    id: 'STARDEW MECHANICS',
    game: 'Stardew Valley',
    mechanics: ['fishing', 'farming', 'marriage'],
    page: 'slices/lab/BOHEMIA_LAB_STARDEW_MECHANICS_7_26_26.html',
    record: 'records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt',
    pattern: 'records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_PATTERN_NOTE_7_26_26.md',
    live: liveMechanics,
    shot: { name: 'BOHEMIA_LAB_STARDEW_MECHANICS_PROOF_7_26_26.png', setup: shotMechanics }
  },
  {
    /* LAB-01. Kept and gated because it exists and Paolo did not kill it, but it
       is SUPERSEDED: its own record says so in its first lines, and it is the
       reason clause 1 exists. It is exempt from the three-mechanic rule and
       carries the exemption explicitly, so nobody reads it as a template. */
    id: 'STARDEW TOWN-WALK (superseded)',
    game: 'Stardew Valley',
    mechanics: [],
    supersededBy: 'laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md',
    page: 'slices/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_7_26_26.html',
    record: 'records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt',
    pattern: 'records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_PATTERN_NOTE_7_26_26.md',
    live: liveTownWalk
  }
];

const DERIVED_KEYS = new Set(['DAY_START']);

console.log('='.repeat(74));
console.log('LAB GATE — mechanics not feel, the loop closes, never the game,');
console.log('           sourced numbers, measured on the real surface');
console.log('='.repeat(74));

/* ==========================================================================
   PART A — STATIC
   ========================================================================== */
function partA(em) {
  const tag = em.id;
  const P = path.join(ROOT, em.page);
  ok('A1 ' + tag + ': page exists', fs.existsSync(P));
  if (!fs.existsSync(P)) return null;
  const src = fs.readFileSync(P, 'utf8');

  /* --- clause 1: mechanics, not feel --- */
  if (em.supersededBy) {
    ok('A2 ' + tag + ': supersession is declared and the law exists',
       fs.existsSync(path.join(ROOT, em.supersededBy)));
    const note = fs.existsSync(path.join(ROOT, em.pattern)) ? fs.readFileSync(path.join(ROOT, em.pattern), 'utf8') : '';
    ok('A3 ' + tag + ': its own record says it was superseded', /RULED 7\/26|SUPERSEDED|superseded/.test(note));
  } else {
    ok('A2 ' + tag + ': declares >= 3 mechanics (' + em.mechanics.length + ')', em.mechanics.length >= 3);
    const bad = em.mechanics.filter(m => NOT_A_MECHANIC.indexOf(m.toLowerCase()) >= 0);
    ok('A3 ' + tag + ': no declared "mechanic" is really plumbing' + (bad.length ? ' (' + bad.join(',') + ')' : ''),
       bad.length === 0);
  }

  const bytes = Buffer.byteLength(src);
  ok('A4 page is small (' + Math.round(bytes / 1024) + 'KB < 220KB)', bytes < 220 * 1024);
  ok('A5 no giant base64 embed', !/[A-Za-z0-9+/]{600,}/.test(src));
  ok('A6 labeled REFERENCE', /REFERENCE EMULATION/.test(src) && /NOT BOHEMIA/i.test(src));
  ok('A7 labeled PLACEHOLDER ART', /PLACEHOLDER ART/.test(src));
  ok('A8 names the game it emulates', src.indexOf(em.game) > 0);

  /* --- clause 3: never the game, outbound --- */
  const forbidden = [
    [/BOHEMIA_ALPHA/, 'the alpha'],
    [/\bBOH_[A-Z]/, 'a BOH_ engine module'],
    [/engine\/bohemia_/, 'an engine module path'],
    [/banks\/BOHEMIA_/, 'an art bank'],
    [/postMessage\s*\(/, 'postMessage']
  ];
  forbidden.forEach(([re, what], i) => {
    ok('A9.' + (i + 1) + ' does not reach into ' + what, !re.test(src));
  });

  /* --- clause 3: never the game, inbound --- */
  const shipped = [];
  const walk = (dir) => {
    for (const f of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      if (f.isDirectory()) continue;
      if (/\.(html|js)$/.test(f.name)) shipped.push(path.join(dir, f.name));
    }
  };
  walk('slices'); walk('engine');
  /* A shipped surface may not LOAD OR LINK a lab PAGE. Note what this is not:
     citing a lab RECORD in a comment is required by
     laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md (a ported mechanism
     carries its provenance), so the test is the page path and the page
     filename, never the word "lab". */
  const LAB_PAGE = /slices\/lab\/|BOHEMIA_LAB_[A-Z0-9_]+\.html/;
  const linkers = shipped.filter(f => LAB_PAGE.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  ok('A10 no shipped surface loads or links a lab PAGE' + (linkers.length ? ' (' + linkers.join(', ') + ')' : ''),
     linkers.length === 0);

  /* --- clause 4: three deliverables --- */
  const recFiles = Array.isArray(em.record) ? em.record : [em.record];
  const recsExist = recFiles.every(f => fs.existsSync(path.join(ROOT, f)));
  ok('A11 numbers record(s) exist (' + recFiles.length + ')', recsExist);
  ok('A12 pattern note exists', fs.existsSync(path.join(ROOT, em.pattern)));
  if (!recsExist || !fs.existsSync(path.join(ROOT, em.pattern))) return null;
  const rec = recFiles.map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  const note = fs.readFileSync(path.join(ROOT, em.pattern), 'utf8');

  /* --- clause 5: the numbers are sourced --- */
  const block = src.match(/var (?:SDV|PZ) = \{([\s\S]*?)\n\};/);
  ok('A13 page declares a sourced-constant block', !!block);
  if (block) {
    const keys = [];
    block[1].split('\n').forEach(l => {
      const m = l.match(/^\s*([A-Z][A-Z0-9_]*):\s*(-?[0-9.]+)\s*,?/);
      if (m) keys.push([m[1], m[2]]);
    });
    const minConsts = em.minConsts || 25;
    ok('A14 constant block has >= ' + minConsts + ' sourced numbers (' + keys.length + ')',
       keys.length >= minConsts);
    const missing = [], unsourced = [], wrongVal = [], ours = [];
    const lines = rec.split('\n');
    keys.forEach(([k, v]) => {
      const row = lines.find(l => new RegExp('^' + k + '\\s').test(l));
      if (!row) { missing.push(k); return; }
      const num = String(parseFloat(v));
      if (row.indexOf(v) < 0 && row.indexOf(num) < 0 && row.indexOf(Math.abs(parseFloat(v)) + '') < 0) wrongVal.push(k + '=' + v);
      /* a row may say "ours (declared)" instead of citing the master — that is
         the CONTENT escape hatch, and it is capped so nobody smuggles invented
         mechanism numbers through it. */
      if (/ours \(declared\)/.test(row)) { ours.push(k); return; }
      if (!DERIVED_KEYS.has(k) && !/\.(cs|lua)\b/.test(row) && !/Utility\./.test(row)) unsourced.push(k);
    });
    ok('A15 every SDV key is in the record' + (missing.length ? ' (missing ' + missing.join(',') + ')' : ''),
       missing.length === 0);
    ok('A16 every row carries the page value' + (wrongVal.length ? ' (' + wrongVal.join(',') + ')' : ''),
       wrongVal.length === 0);
    ok('A17 every row cites a source file' + (unsourced.length ? ' (' + unsourced.join(',') + ')' : ''),
       unsourced.length === 0);
    ok('A17b at most 3 keys are "ours (declared)" (' + ours.length + (ours.length ? ': ' + ours.join(',') : '') + ')',
       ours.length <= 3);
  }

  ok('A18 record names the emulation page', rec.indexOf(path.basename(em.page)) > 0);
  ok('A19 record declares its source of truth', /decompiled|read directly/i.test(rec));
  if (!em.supersededBy) {
    ok('A20 record separates CONTENT from MECHANISM', /CONTENT/.test(rec) && /MECHANISM/.test(rec));
  }
  ok('A21 record says what is NOT implemented', /NOT IMPLEMENTED|NOT PORT|DOES NOT COPY|WHAT IS NOT HERE/i.test(rec));
  ok('A22 note has a WHAT NOT TO PORT section', /WHAT NOT TO PORT/i.test(note));
  ok('A23 note names its honest limits', /HONEST LIMIT/i.test(note));
  ok('A24 note does not claim to have ported anything',
     !/\b(ported|wired) (it )?into the (alpha|run|engine)\b/i.test(note));
  ok('A25 note either flags a pending or records that its question was RULED',
     /\[PENDING Paolo\]/.test(note) || /ruled/i.test(note));

  /* every declared mechanic must be named in both records */
  em.mechanics.forEach(m => {
    const re = new RegExp(m, 'i');
    ok('A26 ' + m + ' is torn down in the record', re.test(rec));
    ok('A27 ' + m + ' appears in the pattern note', re.test(note));
  });
  return { src, rec, note };
}

/* ==========================================================================
   PART B — LIVE: play all three loops
   ========================================================================== */
async function liveMechanics(page) {
  const S = await page.evaluate(() => window.LAB.SDV);
  /* SEED THE WHOLE ROW. This gate went red once inside the full suite and green
     standalone straight after, which is the signature of a coin flip: the catch
     checks below drive the real minigame and against Math.random even a carp
     escapes occasionally. A gate that is right most of the time is not a gate. */
  await page.evaluate(() => window.LAB.seedRNG(20260726));
  const declared = await page.evaluate(() => window.LAB.mechanics);
  ok('B0 the page declares the same mechanics the gate does',
     JSON.stringify(declared) === JSON.stringify(['fishing', 'farming', 'marriage']));

  /* ---------------- FISHING: play it to a catch ---------------- */
  const barH0 = S.BAR_BASE_H;
  const cast = await page.evaluate(() => {
    window.LAB.W.fishingLevel = 0;
    window.LAB.cast(0);
    return { barH: window.LAB.F.barH, prog: window.LAB.F.progress,
             bob: window.LAB.F.bobPos, live: window.LAB.F.live };
  });
  ok('B1 fishing: bar at level 0 is 96px (' + cast.barH + ')', cast.barH === barH0);
  ok('B2 fishing: the cast starts at 0.3 caught (' + cast.prog + ')', near(cast.prog, S.CATCH_START, 0.0001));
  ok('B3 fishing: the fish starts at 508 (' + cast.bob + ')', cast.bob === S.BOBBER_START);

  /* the exact gain rate, with the fish held inside the bar */
  const gain = await page.evaluate(() => {
    window.LAB.F.bobPos = window.LAB.F.barPos + window.LAB.F.barH / 2;
    window.LAB.F.bobSpeed = 0; window.LAB.F.bobTarget = -1; window.LAB.F.motionType = 2;
    const a = window.LAB.F.progress;
    for (let i = 0; i < 10; i++) {
      window.LAB.F.bobPos = window.LAB.F.barPos + window.LAB.F.barH / 2;
      window.LAB.fishTick(1, true);
    }
    return window.LAB.F.progress - a;
  });
  ok('B4 fishing: in the bar gains exactly 1/500 a tick (' + gain.toFixed(5) + ')',
     near(gain, S.CATCH_GAIN * 10, 0.0005));
  const loss = await page.evaluate(() => {
    window.LAB.F.bobPos = 0; window.LAB.F.bobSpeed = 0; window.LAB.F.bobTarget = -1;
    window.LAB.F.barPos = 400; window.LAB.F.motionType = 2;
    const a = window.LAB.F.progress;
    for (let i = 0; i < 10; i++) {
      window.LAB.F.bobPos = 0; window.LAB.F.barPos = 400;
      window.LAB.fishTick(1, false);
    }
    return a - window.LAB.F.progress;
  });
  ok('B5 fishing: out of the bar loses exactly 3/1000 a tick (' + loss.toFixed(5) + ')',
     near(loss, S.CATCH_LOSS * 10, 0.0005));
  ok('B6 fishing: losing is only 1.5x winning, not more', near(S.CATCH_LOSS / S.CATCH_GAIN, 1.5, 0.001));

  /* the loop closes: catch one by actually playing the minigame */
  const caught = await page.evaluate(() => {
    window.LAB.W.fishingLevel = 0; window.LAB.W.gold = 0; window.LAB.F.caught = 0;
    window.LAB.cast(0);
    return window.LAB.autoFish(40000);
  });
  ok('B7 fishing: THE LOOP CLOSES — a fish is landed by playing the bar', caught.live === false && caught.caught === 1);
  ok('B8 fishing: landing it paid gold (' + caught.gold + 'g)', caught.gold > 0);

  /* the whole skill tree is the bar getting taller */
  const level = await page.evaluate(() => {
    window.LAB.cast(0); window.LAB.autoFish(40000);
    const lvl = window.LAB.W.fishingLevel;
    window.LAB.cast(0);
    return { lvl: lvl, barH: window.LAB.F.barH };
  });
  ok('B9 fishing: levelling up really widens the bar (' + level.barH + 'px at level ' + level.lvl + ')',
     level.lvl >= 1 && level.barH === S.BAR_BASE_H + level.lvl * S.BAR_H_PER_LEVEL);
  /* the tolerance is the fish's body inside the bar, and the drawn extent is the
     TESTED extent — a one-unit step across the edge flips the outcome */
  const edge = await page.evaluate(() => {
    const r = {};
    window.LAB.cast(0);
    window.LAB.F.motionType = 2; window.LAB.F.bobTarget = -1; window.LAB.F.bobSpeed = 0;
    window.LAB.F.barPos = 200;
    const hold = (y) => {
      window.LAB.F.bobPos = y; window.LAB.F.barPos = 200;
      const a = window.LAB.F.progress; window.LAB.fishTick(1, false);
      return window.LAB.F.progress - a;
    };
    r.justInside = hold(200 + window.LAB.SDV.FISH_ABOVE);
    r.justOutside = hold(200 + window.LAB.SDV.FISH_ABOVE - 2);
    return r;
  });
  ok('B10 fishing: a fish exactly at the bar edge is INSIDE and gains',
     edge.justInside > 0);
  ok('B10b fishing: two units higher it is OUTSIDE and loses — the drawn edge IS the tested edge',
     edge.justOutside < 0);

  /* difficulty and level are both REAL, measured with one fixed controller */
  const rates = await page.evaluate(() => {
    function play(i, level) {
      window.LAB.W.fishingLevel = level;
      window.LAB.cast(i);
      let t = 0;
      while (window.LAB.F.live && t++ < 30000) {
        const F = window.LAB.F, c = F.barPos + F.barH / 2;
        window.LAB.fishTick(1, (F.bobPos - c - F.barSpeed * 10) < 0);
      }
      return window.LAB.F.progress >= 1;
    }
    const rate = (i, level, n) => { let w = 0; for (let k = 0; k < n; k++) if (play(i, level)) w++; return w / n; };
    return { easy: rate(0, 0, 10), hard: rate(4, 0, 10), hardLevelled: rate(4, 10, 10) };
  });
  ok('B11 fishing: an easy fish is really easier than a hard one (' +
     (rates.easy * 100) + '% vs ' + (rates.hard * 100) + '%)', rates.easy > rates.hard);
  ok('B11b fishing: THE SKILL TREE IS THE BAR — level 10 lands what level 0 cannot (' +
     (rates.hard * 100) + '% -> ' + (rates.hardLevelled * 100) + '%)', rates.hardLevelled > rates.hard);

  /* ---------------- FARMING: till, seed, water, sleep, harvest ---------------- */
  const farm = await page.evaluate(() => {
    const r = {};
    /* a WATERED tile advances exactly one phase-day; a DRY one advances zero */
    window.LAB.farmTool('hoe'); window.LAB.farmTap(0); window.LAB.farmTap(1);
    window.LAB.seedPick(3); window.LAB.fertPick(0);      /* MELON: summer, 12 days */
    window.LAB.farmTool('seed'); window.LAB.farmTap(0);
    r.melonSeasons = window.LAB.tile(0).crop.seasons.slice();
    /* PARSNIP on tile 1, watered */
    window.LAB.seedPick(0); window.LAB.farmTap(1);
    r.parsnipDays = window.LAB.tile(1).crop.phases.reduce((a, b) => a + b, 0);
    window.LAB.farmTool('can'); window.LAB.farmTap(1);
    r.wateredBefore = window.LAB.tile(1).state;
    const p0 = window.LAB.tile(1).crop.phase, d0 = window.LAB.tile(1).crop.dayOfPhase;
    window.LAB.setSeason('SPRING');
    window.LAB.sleep();
    r.advanced = (window.LAB.tile(1).crop.phase - p0) + (window.LAB.tile(1).crop.dayOfPhase - d0);
    r.driedOvernight = window.LAB.tile(1).state === 0;
    r.melonDead = window.LAB.tile(0).crop.dead;          /* summer crop, spring rollover */
    /* the dry tile: zero progress, and NOT dead */
    window.LAB.farmTool('hoe'); window.LAB.farmTap(2);
    window.LAB.farmTool('seed'); window.LAB.seedPick(0); window.LAB.farmTap(2);
    const q0 = window.LAB.tile(2).crop.dayOfPhase;
    window.LAB.sleep();
    r.dryProgress = window.LAB.tile(2).crop.dayOfPhase - q0;
    r.dryAlive = !window.LAB.tile(2).crop.dead;
    return r;
  });
  ok('B12 farming: a watered tile advances exactly one day (' + farm.advanced + ')', farm.advanced === 1);
  ok('B13 farming: soil dries overnight with no retaining soil', farm.driedOvernight === true);
  ok('B14 farming: a DRY tile advances ZERO days (' + farm.dryProgress + ')', farm.dryProgress === 0);
  ok('B15 farming: and a dry crop is NOT dead — a wasted day, not damage', farm.dryAlive === true);
  ok('B16 farming: a summer crop planted in spring dies at the rollover', farm.melonDead === true);
  ok('B17 farming: parsnip is a 4-day crop (' + farm.parsnipDays + ')', farm.parsnipDays === 4);

  /* Speed-Gro removes a percentage of TOTAL days, at planting */
  const speed = await page.evaluate(() => {
    window.LAB.farmTool('hoe'); window.LAB.farmTap(6);
    window.LAB.seedPick(3); window.LAB.fertPick(2);      /* MELON + deluxe speed-gro 25% */
    window.LAB.farmTool('seed'); window.LAB.farmTap(6);
    const withF = window.LAB.tile(6).crop.phases.reduce((a, b) => a + b, 0);
    const base = window.LAB.CROPS[3].phases.reduce((a, b) => a + b, 0);
    return { withF: withF, base: base };
  });
  ok('B18 farming: deluxe Speed-Gro removes 25% of the growth days (' + speed.base + ' -> ' + speed.withF + ')',
     speed.withF === speed.base - Math.ceil(speed.base * S.SPEEDGRO_DELUXE));

  /* THE LOOP CLOSES: grow a parsnip to harvest and sell it */
  const harvest = await page.evaluate(() => {
    window.LAB.farmTool('hoe'); window.LAB.farmTap(12);
    window.LAB.seedPick(0); window.LAB.fertPick(0);
    window.LAB.farmTool('seed'); window.LAB.farmTap(12);
    const gold0 = window.LAB.W.gold;
    let days = 0;
    while (!window.LAB.cropReady(12) && days++ < 30) {
      window.LAB.farmTool('can'); window.LAB.farmTap(12);
      window.LAB.setSeason('SPRING');
      window.LAB.sleep();
    }
    const ready = window.LAB.cropReady(12);
    window.LAB.farmTool('pick'); window.LAB.farmTap(12);
    return { ready: ready, days: days, earned: window.LAB.W.gold - gold0, gone: !window.LAB.tile(12).crop };
  });
  ok('B19 farming: THE LOOP CLOSES — planted, watered, grown and harvested in ' + harvest.days + ' days',
     harvest.ready === true && harvest.earned > 0);
  ok('B20 farming: a non-regrowing crop is consumed by the harvest', harvest.gone === true);

  /* regrowth reuses the same field, counting down */
  const regrow = await page.evaluate(() => {
    window.LAB.farmTool('hoe'); window.LAB.farmTap(18);
    window.LAB.seedPick(2); window.LAB.fertPick(0);      /* GREENBEAN, regrow 3 */
    window.LAB.farmTool('seed'); window.LAB.farmTap(18);
    let d = 0;
    while (!window.LAB.cropReady(18) && d++ < 40) {
      window.LAB.farmTool('can'); window.LAB.farmTap(18); window.LAB.setSeason('SPRING'); window.LAB.sleep();
    }
    window.LAB.farmTool('pick'); window.LAB.farmTap(18);
    const still = !!window.LAB.tile(18).crop;
    const left = still ? window.LAB.tile(18).crop.regrowLeft : -1;
    return { still: still, left: left };
  });
  ok('B21 farming: a regrowing crop survives its harvest', regrow.still === true);
  ok('B22 farming: and comes back in exactly its regrow days (' + regrow.left + ')', regrow.left === 3);

  /* ---------------- MARRIAGE: stranger to married ---------------- */
  const caps = await page.evaluate(() => {
    const r = {};
    window.LAB.L.married = false; window.LAB.L.status = 'FRIEND';
    r.undated = window.LAB.pointCap();
    window.LAB.L.status = 'DATING'; r.dating = window.LAB.pointCap();
    window.LAB.L.married = true; r.spouse = window.LAB.pointCap();
    window.LAB.L.married = false; window.LAB.L.status = 'FRIEND';
    return r;
  });
  ok('B22 marriage: an UNDATED villager caps at (8+1)*250-1 = 2249 (' + caps.undated + ')',
     caps.undated === (S.MAX_HEARTS_UNDATED + 1) * S.PER_HEART - 1);
  ok('B22b marriage: dating moves the cap to 2749 (' + caps.dating + ')',
     caps.dating === (S.MAX_HEARTS_DATING + 1) * S.PER_HEART - 1);
  ok('B22c marriage: marriage moves it to 3749 (' + caps.spouse + ')',
     caps.spouse === (S.MAX_HEARTS_SPOUSE + 1) * S.PER_HEART - 1);

  const gifts = await page.evaluate(() => {
    const r = {};
    window.LAB.setPoints(0);
    window.LAB.L.giftsToday = 0; window.LAB.L.giftsThisWeek = 0; window.LAB.L.talkedToday = false;
    window.LAB.gift(0);                                  /* loved */
    r.afterLove = window.LAB.L.points;
    window.LAB.gift(0);                                  /* blocked: 1 a day */
    r.afterSecondSameDay = window.LAB.L.points;
    window.LAB.L.giftsToday = 0;
    window.LAB.gift(0);                                  /* second of the week: allowed */
    r.afterSecondWeek = window.LAB.L.points;
    window.LAB.L.giftsToday = 0;
    window.LAB.gift(0);                                  /* third: blocked by the ration */
    r.afterThirdWeek = window.LAB.L.points;
    return r;
  });
  ok('B23 marriage: a loved gift is +80 (' + gifts.afterLove + ')', gifts.afterLove === S.GIFT_LOVE);
  ok('B24 marriage: one gift a day — the second is refused', gifts.afterSecondSameDay === gifts.afterLove);
  ok('B25 marriage: two a week is allowed (' + gifts.afterSecondWeek + ')', gifts.afterSecondWeek === S.GIFT_LOVE * 2);
  ok('B26 marriage: the third of the week is RATIONED OUT', gifts.afterThirdWeek === gifts.afterSecondWeek);

  const bday = await page.evaluate(() => {
    window.LAB.setPoints(0);
    window.LAB.L.giftsToday = 0; window.LAB.L.giftsThisWeek = 9;
    window.LAB.setBirthdayToday();
    window.LAB.gift(0);
    return window.LAB.L.points;
  });
  ok('B27 marriage: a birthday gift pays x8 AND beats the ration (' + bday + ')', bday === S.GIFT_LOVE * S.GIFT_BIRTHDAY_X);

  const talkDecay = await page.evaluate(() => {
    const r = {};
    window.LAB.L.birthdaySeason = 'WINTER';
    window.LAB.setPoints(500); window.LAB.L.talkedToday = false;
    window.LAB.talk(); r.afterTalk = window.LAB.L.points;
    window.LAB.talk(); r.afterSecondTalk = window.LAB.L.points;
    window.LAB.L.talkedToday = false;
    window.LAB.sleep(); r.afterIgnoredNight = window.LAB.L.points;
    return r;
  });
  ok('B28 marriage: talking is +20 (' + talkDecay.afterTalk + ')', talkDecay.afterTalk === 520);
  ok('B29 marriage: and only once a day', talkDecay.afterSecondTalk === 520);
  ok('B30 marriage: ignoring a stranger costs -2 a night (' + talkDecay.afterIgnoredNight + ')',
     talkDecay.afterIgnoredNight === 520 - S.DECAY_STRANGER);

  /* THE WALL: unlimited gifts cannot pass 8 hearts while undated */
  const wall = await page.evaluate(() => {
    window.LAB.L.status = 'FRIEND'; window.LAB.L.married = false; window.LAB.L.weddingIn = -1;
    window.LAB.setPoints(1960);
    for (let i = 0; i < 40; i++) { window.LAB.L.giftsToday = 0; window.LAB.L.giftsThisWeek = 0; window.LAB.gift(0); }
    const parked = window.LAB.L.points;
    window.LAB.court();
    return { parked: parked, status: window.LAB.L.status, cap: window.LAB.pointCap() };
  });
  ok('B31 marriage: THE WALL — 40 loved gifts stop dead at the undated cap (' + wall.parked + ')',
     wall.parked === (S.MAX_HEARTS_UNDATED + 1) * S.PER_HEART - 1);
  ok('B32 marriage: the bouquet at 2000 moves you to DATING', wall.status === 'DATING');

  const wed = await page.evaluate(() => {
    const r = {};
    window.LAB.setPoints(2400);
    window.LAB.court(); r.tooEarly = window.LAB.L.status;      /* under 2500: refused */
    window.LAB.setPoints(2500);
    window.LAB.court(); r.engaged = window.LAB.L.status; r.countdown = window.LAB.L.weddingIn;
    for (let d = 0; d < 3; d++) { window.LAB.L.talkedToday = true; window.LAB.sleep(); }
    r.married = window.LAB.L.married; r.status = window.LAB.L.status;
    r.cap = window.LAB.pointCap();
    window.LAB.L.talkedToday = false;
    const before = window.LAB.L.points;
    window.LAB.sleep();
    r.spouseDecay = before - window.LAB.L.points;
    return r;
  });
  ok('B33 marriage: the pendant is refused under 2500', wed.tooEarly === 'DATING');
  ok('B34 marriage: at 2500 it is accepted and the wedding is 3 days out (' + wed.countdown + ')',
     wed.engaged === 'ENGAGED' && wed.countdown === S.WEDDING_DELAY);
  ok('B35 marriage: THE LOOP CLOSES — stranger to MARRIED', wed.married === true && wed.status === 'MARRIED');
  ok('B36 marriage: marriage moves the ceiling to 14 hearts (' + wed.cap + ')',
     wed.cap === (S.MAX_HEARTS_SPOUSE + 1) * S.PER_HEART - 1);
  ok('B37 marriage: and ignoring a spouse costs -20, ten times a stranger (' + wed.spouseDecay + ')',
     wed.spouseDecay === S.DECAY_SPOUSE);

  /* the day is shared by all three mechanics, which is what makes it a game */
  const shared = await page.evaluate(() => {
    const d0 = window.LAB.day(); window.LAB.sleep(); return window.LAB.day() - d0;
  });
  ok('B38 one SLEEP advances the day for every mechanic at once', shared === 1);
  await page.evaluate(() => window.LAB.unseedRNG());
}

/* ==========================================================================
   PART B (LAB-03) — WALK THE WORLD AND PLAY EVERY LOOP STANDING IN IT.
   This is the check that matters: not "does fishing work" but "can you walk
   from your bed to the dock, catch a fish, walk to your plot, grow something,
   walk up to her, court her, and go to bed" — with the real movement code.
   ========================================================================== */
async function liveWorld(page) {
  const S = await page.evaluate(() => window.LAB.SDV);
  await page.evaluate(() => window.LAB.seedRNG(20260726));   /* same reason as above */

  const map = await page.evaluate(() => ({
    soil: window.LAB.soilCount(),
    house: window.LAB.furnitureCount('house'),
    shop: window.LAB.furnitureCount('shop'),
    housePlate: window.LAB.plateOf('house'),
    shopPlate: window.LAB.plateOf('shop')
  }));
  ok('W1 the world has a real plot to farm (' + map.soil + ' soil tiles)', map.soil >= 40);
  ok('W2 the house is furnished and has a bed', map.house >= 8);
  ok('W3 the shop is furnished', map.shop >= 8);

  /* the four contexts: the one button knows where it is */
  const ctx = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.place('town', 28, 24, 2); o.dock = L.context();
    L.place('town', 8, 13, 2);  o.plot = L.context();
    L.place('house', 2, 3, 0);  o.bed = L.context();
    L.place('town', 27, 12, 0);
    L.NPC.pos.x = 27 * 64; L.NPC.pos.y = 11 * 64; L.NPC.path = [];
    o.npc = L.context();
    L.place('town', 18, 17, 2); o.nothing = L.context();
    return o;
  });
  ok('W4 facing the water at the dock offers CAST', ctx.dock === 'FISH');
  ok('W5 facing the plot soil offers USE TOOL', ctx.plot === 'FARM');
  ok('W6 facing the bed offers SLEEP', ctx.bed === 'SLEEP');
  ok('W7 standing next to her offers TALK', ctx.npc === 'TALK');
  ok('W8 standing in an empty field offers nothing', ctx.nothing === null);

  /* THE WALKTHROUGH, one evaluate so the world state is continuous */
  const run = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.place('town', 8, 11, 2);
    L.setPoints(0); L.L.status = 'STRANGER'; L.L.married = false; L.L.weddingIn = -1;
    L.S.gold = 0; L.F.caught = 0; L.S.fishingLevel = 0;

    /* --- 1. walk from the front door to the plot and work it --- */
    o.reachedPlot = L.walkTo(8, 13);
    L.setFacing(2);
    L.tool('hoe'); L.act();   o.tilled = L.farmAt(8, 14).tilled;
    L.tool('seed'); L.seedPick(0); L.fertPick(0); L.act();
    o.planted = !!L.farmAt(8, 14).crop;
    o.phasesTotal = L.farmAt(8, 14).crop.phases.reduce((a, b) => a + b, 0);
    L.tool('can'); L.act();   o.watered = L.farmAt(8, 14).state;

    /* --- 2. walk the length of the map to the dock and land a fish --- */
    o.route = [L.walkTo(8, 11), L.walkTo(18, 11), L.walkTo(18, 21),
               L.walkTo(28, 21), L.walkTo(28, 24)].every(Boolean);
    o.atDock = L.standTile();
    L.setFacing(2);
    o.dockCtx = L.context();
    L.act();
    o.hooked = L.F.live;
    o.hookedName = L.F.fish ? L.F.fish.n : null;
    const fr = L.autoFish(30000);
    o.caught = fr.caught; o.goldFromFish = L.S.gold;

    /* --- 3. she is by the lake at lunchtime; walk up and court her --- */
    L.NPC.pos.x = 28 * 64; L.NPC.pos.y = 23 * 64; L.NPC.path = [];
    L.setFacing(0);
    o.npcCtx = L.context();
    L.setPoints(2000);
    L.act();
    o.modalOpened = L.S.modal;
    L.court();
    o.status = L.L.status;
    L.closeLove();
    o.modalClosed = L.S.modal === null;

    /* --- 4. walk home, in the door, to the bed, and sleep --- */
    o.routeHome = [L.walkTo(28, 21), L.walkTo(18, 21), L.walkTo(18, 11), L.walkTo(8, 11), L.walkTo(8, 10)].every(Boolean);
    let g = 0;
    L.setDirs([0]);
    while (L.S.map === 'town' && g++ < 500) L.step(1, [0], false);
    while (L.S.fadeDir !== 0 && g++ < 1200) L.step(1);
    L.setDirs([]);
    o.walkedInside = L.S.map;
    o.reachedBed = L.walkTo(2, 3);
    L.setFacing(0);
    o.bedCtx = L.context();
    const day0 = L.S.day, phase0 = L.farmAt(8, 14).crop.phase;
    L.act();
    o.dayAdvanced = L.S.day - day0;
    o.cropAdvanced = L.farmAt(8, 14).crop.phase - phase0;
    o.soilDried = L.farmAt(8, 14).state === 0;
    o.timeReset = L.S.timeOfDay;
    return o;
  });

  ok('W9 you can walk from the front door to your plot', run.reachedPlot === true);
  ok('W10 facing the soil and pressing the button TILLS it', run.tilled === true);
  ok('W11 the same button SEEDS it (parsnip, ' + run.phasesTotal + ' watered days)',
     run.planted === true && run.phasesTotal === 4);
  ok('W12 and WATERS it', run.watered === S.WATERED);
  ok('W13 you can walk the length of the map to the dock', run.route === true && run.atDock.x === 28 && run.atDock.y === 24);
  ok('W14 the dock offers CAST and the button hooks a fish (' + run.hookedName + ')',
     run.dockCtx === 'FISH' && run.hooked === true);
  ok('W15 FISHING LOOP CLOSES IN THE WORLD — landed and paid (' + run.goldFromFish + 'g)',
     run.caught === 1 && run.goldFromFish > 0);
  ok('W16 walking up to her opens the courtship, not a menu button', run.npcCtx === 'TALK' && run.modalOpened === 'love');
  ok('W17 MARRIAGE LOOP ADVANCES IN THE WORLD — the bouquet lands', run.status === 'DATING');
  ok('W18 and you can walk away from her again', run.modalClosed === true);
  ok('W19 you can walk home and in through your own front door', run.routeHome === true && run.walkedInside === 'house');
  ok('W20 you can reach your bed', run.reachedBed === true && run.bedCtx === 'SLEEP');
  ok('W21 SLEEPING ADVANCES THE DAY for the whole world at once', run.dayAdvanced === 1);
  ok('W22 FARMING LOOP RESOLVES AT SLEEP — the crop advanced a phase', run.cropAdvanced === 1);
  ok('W23 and the soil dried overnight, so tomorrow is another chore', run.soilDried === true);
  ok('W24 the clock resets to 6:00am (' + run.timeReset + ')', run.timeReset === S.DAY_START);

  /* the day is the ONLY thing the three mechanics share */
  const shared = await page.evaluate(() => {
    const L = window.LAB, o = {};
    L.place('town', 18, 17, 2);
    L.setPoints(600); L.L.talkedToday = false; L.L.status = 'FRIEND'; L.L.married = false;
    const p0 = L.L.points, d0 = L.S.day;
    L.sleep();
    o.friendshipDecayed = p0 - L.L.points;
    o.dayMoved = L.S.day - d0;
    o.npcScheduleReset = L.NPC.lastKey;
    return o;
  });
  ok('W25 one sleep also decays a friendship you ignored (-' + shared.friendshipDecayed + ')',
     shared.friendshipDecayed === S.DECAY_STRANGER);
  ok('W26 and resets her schedule for the new day', shared.npcScheduleReset === -1);

  /* the walk is still Stardew's walk, because that is what it is for */
  const walk = await page.evaluate(() => {
    const L = window.LAB;
    L.place('town', 18, 17, 2);
    const a = L.S.pos.x;
    L.step(60, [1], false);
    L.setDirs([]);
    return L.S.pos.x - a;
  });
  const walkExp = Math.max(S.MIN_STEP, S.WALK_SPEED * S.MOVE_MULT * (1000 / 60)) * 60;
  ok('W27 the walk underneath is still the measured 2.20 px/tick (' + (walk / 60).toFixed(2) + ')',
     Math.abs(walk - walkExp) < 0.5);
  await page.evaluate(() => window.LAB.unseedRNG());
}

async function shotWorld(page) {
  await page.evaluate(() => {
    const L = window.LAB;
    L.place('town', 8, 13, 2);
    L.tool('hoe');
    /* dress the plot so the shot shows a worked farm, not bare soil */
    [[7,14],[8,14],[9,14],[7,15],[8,15],[9,15],[7,16],[8,16],[9,16]].forEach(function (t) {
      const c = L.farmAt(t[0], t[1]); c.tilled = true; c.state = 1;
    });
    L.seedPick(0);
    [[7,14],[8,14],[9,14]].forEach(function (t) { L.setFacing(2); L.tool('seed'); L.farmAt(t[0], t[1]); });
    L.setTime(1000);
    L.thaw();
  });
}

async function shotMechanics(page) {
  await page.evaluate(() => {
    window.LAB.thaw();
    document.getElementById('tab_love').click();
  });
}

/* LAB-01, superseded: kept green so it cannot rot, not extended. */
async function liveTownWalk(page) {
  const S = await page.evaluate(() => window.LAB.SDV);
  const TICKMS = 1000 / 60;
  const walkExp = Math.max(S.MIN_STEP, S.WALK_SPEED * S.MOVE_MULT * TICKMS);
  const m = await page.evaluate(([P]) => {
    window.LAB.place(P.map, P.x, P.y);
    const a = window.LAB.S.pos.x;
    const b = window.LAB.step(60, [1], false);
    window.LAB.setDirs([]);
    return b.x - a;
  }, [{ map: 'town', x: 18 * 64, y: 17 * 64 }]);
  ok('B1 (superseded) the walk still measures 2.20 px/tick (' + (m / 60).toFixed(3) + ')',
     near(m, 60 * walkExp, 0.05));
  const rooms = await page.evaluate(() => ({
    house: window.LAB.furnitureCount('house'), shop: window.LAB.furnitureCount('shop')
  }));
  ok('B2 (superseded) both interiors are still furnished', rooms.house >= 8 && rooms.shop >= 8);
}

/* ==========================================================================
   DRIVER
   ========================================================================== */
(async () => {
  const statics = EMULATIONS.map(em => ({ em, r: partA(em) }));

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  try {
    for (const { em, r } of statics) {
      if (!r) { ok('LIVE ' + em.id + ': skipped, static checks failed', false); continue; }
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto('file://' + path.join(ROOT, em.page));
      await page.waitForFunction(() => !!window.LAB, null, { timeout: 15000 });
      await page.evaluate(() => window.LAB.freeze());

      await em.live(page);

      if (em.shot) {
        await em.shot.setup(page);
        await page.waitForTimeout(300);
        const shot = path.join(PROOF_DIR, em.shot.name);
        await page.screenshot({ path: shot });
        ok('C1 ' + em.id + ': proof screenshot written', fs.existsSync(shot) && fs.statSync(shot).size > 8000);
        console.log('  proof: ' + shot);
      }
      ok('C2 ' + em.id + ': zero console errors' + (errors.length ? ' (' + errors[0].slice(0, 90) + ')' : ''),
         errors.length === 0);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }

  console.log('='.repeat(74));
  console.log('  LAB GATE: ' + pass + ' pass / ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL: gate threw: ' + (e && e.stack || e)); process.exit(1); });
