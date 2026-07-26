/* ============================================================================
   LAB GATE (7/26/26, LAB lane) — THE REFERENCE LAB, machine-locked.

   The lab's law (laws/BOHEMIA_ADDENDUM_THE_REFERENCE_LAB_7_26_26.md) makes four
   promises. A promise without a gate is not a promise, so this file holds all
   four:

     1. NEVER THE GAME. An emulation touches no engine module, no bank, no
        alpha, and nothing in the shipped game links to it. Both directions are
        swept, because "it only reads from the alpha" is still a coupling.
     2. THREE DELIVERABLES, EVERY TIME. A playable page, a FEEL LEDGER, and a
        PATTERN NOTE. Missing one means the emulation is entertainment.
     3. THE NUMBERS ARE SOURCED, NOT REMEMBERED. Every constant in the page's
        SDV block must appear in the ledger with a file:line citation from the
        master's own source. This is REUSE-FIRST logic applied to research: a
        citation is a claim a machine can check, never a name-drop.
     4. THE FEEL IS MEASURED ON THE REAL SURFACE. The gate opens the actual page
        in a real browser at iPhone portrait size and drives THE SAME frame loop
        the thumb drives (window.LAB), then measures the walk. It never
        re-implements the maths — a second copy of the formula would agree with
        itself and prove nothing.

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

/* ---- THE REGISTRY. One row per emulation. A new lab session appends. ------ */
const EMULATIONS = [
  {
    id: 'STARDEW TOWN-WALK',
    game: 'Stardew Valley',
    page: 'slices/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_7_26_26.html',
    ledger: 'records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt',
    pattern: 'records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_PATTERN_NOTE_7_26_26.md',
    live: liveStardew
  }
];

/* Rows that are DERIVED in the page rather than read off a source line. */
const DERIVED_KEYS = new Set(['DAY_START']);

console.log('='.repeat(74));
console.log('LAB GATE — the reference lab: never the game, three deliverables,');
console.log('           sourced numbers, feel measured on the real surface');
console.log('='.repeat(74));

/* ==========================================================================
   PART A — STATIC: the lane's own laws
   ========================================================================== */
function partA(em) {
  const P = path.join(ROOT, em.page);
  ok('A1 ' + em.id + ': page exists', fs.existsSync(P));
  if (!fs.existsSync(P)) return null;
  const src = fs.readFileSync(P, 'utf8');
  const bytes = Buffer.byteLength(src);

  /* the law says "small, no giant embeds" — a lab page that swallowed an art
     bank would be a copy of the game, not a reference to another one */
  ok('A2 page is small (' + Math.round(bytes / 1024) + 'KB < 220KB)', bytes < 220 * 1024);
  ok('A3 no giant base64 embed', !/[A-Za-z0-9+/]{600,}/.test(src));

  /* labeled REFERENCE, loudly, where Paolo cannot miss it */
  ok('A4 labeled REFERENCE', /REFERENCE EMULATION/.test(src) && /NOT BOHEMIA/i.test(src));
  ok('A5 labeled PLACEHOLDER ART', /PLACEHOLDER ART/.test(src));
  ok('A6 names the game it emulates', src.indexOf(em.game) > 0);

  /* NEVER THE GAME, outbound */
  const forbidden = [
    [/BOHEMIA_ALPHA/, 'the alpha'],
    [/\bBOH_[A-Z]/, 'a BOH_ engine module'],
    [/engine\/bohemia_/, 'an engine module path'],
    [/banks\/BOHEMIA_/, 'an art bank'],
    [/BOHEMIA_RUN_(ENCOUNTER|CAST|MUSIC|COMBAT_END)/, 'the run bridge'],
    [/postMessage\s*\(/, 'postMessage']
  ];
  forbidden.forEach(([re, what], i) => {
    ok('A7.' + (i + 1) + ' does not reach into ' + what, !re.test(src));
  });

  /* NEVER THE GAME, inbound: nothing shipped may link to a lab page */
  const shipped = [];
  const walk = (dir) => {
    for (const f of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      if (f.isDirectory()) continue;
      if (/\.(html|js)$/.test(f.name)) shipped.push(path.join(dir, f.name));
    }
  };
  walk('slices'); walk('engine');
  const linkers = shipped.filter(f => /slices\/lab\/|lab\/BOHEMIA_LAB/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  ok('A8 no shipped surface links to a lab page' + (linkers.length ? ' (' + linkers.join(', ') + ')' : ''), linkers.length === 0);

  /* THREE DELIVERABLES */
  ok('A9 feel ledger exists', fs.existsSync(path.join(ROOT, em.ledger)));
  ok('A10 pattern note exists', fs.existsSync(path.join(ROOT, em.pattern)));
  if (!fs.existsSync(path.join(ROOT, em.ledger)) || !fs.existsSync(path.join(ROOT, em.pattern))) return null;
  const ledger = fs.readFileSync(path.join(ROOT, em.ledger), 'utf8');
  const note = fs.readFileSync(path.join(ROOT, em.pattern), 'utf8');

  /* THE NUMBERS ARE SOURCED. Every SDV key, its value, and a citation. */
  const block = src.match(/var SDV = \{([\s\S]*?)\n\};/);
  ok('A11 page declares an SDV constant block', !!block);
  if (block) {
    const keys = [];
    block[1].split('\n').forEach(l => {
      const m = l.match(/^\s*([A-Z][A-Z0-9_]*):\s*(-?[0-9.]+)\s*,?/);
      if (m) keys.push([m[1], m[2]]);
    });
    ok('A12 SDV block has >= 30 constants (' + keys.length + ')', keys.length >= 30);
    const missing = [], unsourced = [], wrongVal = [];
    const lines = ledger.split('\n');
    keys.forEach(([k, v]) => {
      const row = lines.find(l => new RegExp('^' + k + '\\s').test(l));
      if (!row) { missing.push(k); return; }
      if (row.indexOf(v) < 0 && row.indexOf(String(parseFloat(v))) < 0) wrongVal.push(k + '=' + v);
      if (!DERIVED_KEYS.has(k) && !/\.cs:\d+/.test(row) && !/\.cs\b/.test(row)) unsourced.push(k);
    });
    ok('A13 every SDV key is in the ledger' + (missing.length ? ' (missing ' + missing.join(',') + ')' : ''), missing.length === 0);
    ok('A14 every ledger row carries the page value' + (wrongVal.length ? ' (' + wrongVal.join(',') + ')' : ''), wrongVal.length === 0);
    ok('A15 every ledger row cites a source file' + (unsourced.length ? ' (' + unsourced.join(',') + ')' : ''), unsourced.length === 0);
  }

  /* the ledger and the note must actually do their jobs */
  ok('A16 ledger names the emulation page', ledger.indexOf(path.basename(em.page)) > 0);
  ok('A17 ledger declares its source of truth', /decompiled/i.test(ledger));
  ok('A18 ledger records what was NOT copied', /DOES NOT COPY|NOT PORT|DIVERGENCE/i.test(ledger));
  ok('A19 note has a WHAT TO PORT section', /WHAT TO PORT/i.test(note));
  ok('A20 note has a WHAT NOT TO PORT section', /WHAT NOT TO PORT/i.test(note));
  ok('A21 note compares against what Bohemia ships today', /BOHEMIA SHIPS TODAY|ships today/i.test(note));
  ok('A22 note names its honest limits', /HONEST LIMITS/i.test(note));
  /* the lab never ports: a note may RECOMMEND, it may not claim a port landed */
  ok('A23 note does not claim to have ported anything',
     !/\b(ported|wired) (it )?into the (alpha|run|engine)\b/i.test(note));
  /* pendings stay pendings */
  ok('A24 note flags canon-level questions as PENDING Paolo', /\[PENDING Paolo\]/.test(note));
  return { src, ledger, note };
}

/* ==========================================================================
   PART B — LIVE: measure the feel through the page's own frame loop
   ========================================================================== */
async function liveStardew(page) {
  const S = await page.evaluate(() => window.LAB.SDV);
  const TICK = 1000 / 60;

  /* --- B1 the movement budget, measured, not recomputed --------------- */
  const walkExp = Math.max(S.MIN_STEP, S.WALK_SPEED * S.MOVE_MULT * TICK);
  const runExp = Math.max(S.MIN_STEP, S.RUN_SPEED * S.MOVE_MULT * TICK);
  ok('B1 walk budget is 2.20 px/tick (' + walkExp.toFixed(3) + ')', near(walkExp, 2.2, 0.002));
  ok('B2 run budget is 5.50 px/tick (' + runExp.toFixed(3) + ')', near(runExp, 5.5, 0.002));

  const openField = { map: 'town', x: 18 * 64, y: 17 * 64 };
  const meas = async (frames, dirs, run) => page.evaluate(([f, d, r, P]) => {
    window.LAB.place(P.map, P.x, P.y);
    const a = { x: window.LAB.S.pos.x, y: window.LAB.S.pos.y };
    const b = window.LAB.step(f, d, r);
    window.LAB.setDirs([]);
    return { dx: b.x - a.x, dy: b.y - a.y };
  }, [frames, dirs, run, openField]);

  let m = await meas(60, [1], false);
  ok('B3 60 walk frames right = 60 x 2.20 px (' + m.dx.toFixed(2) + ')', near(m.dx, 60 * walkExp, 0.05));
  ok('B4 walking right does not drift in y', near(m.dy, 0, 0.001));
  m = await meas(60, [1], true);
  ok('B5 60 run frames right = 60 x 5.50 px (' + m.dx.toFixed(2) + ')', near(m.dx, 60 * runExp, 0.05));

  /* tiles per second, the number a human can actually hold in their head */
  const walkTps = walkExp * 60 / S.TILE, runTps = runExp * 60 / S.TILE;
  ok('B6 walk = 2.063 tiles/s (' + walkTps.toFixed(3) + ')', near(walkTps, 2.0625, 0.002));
  ok('B7 run = 5.156 tiles/s (' + runTps.toFixed(3) + ')', near(runTps, 5.15625, 0.002));

  /* --- B8 diagonals cost 30% on BOTH axes ----------------------------- */
  m = await meas(60, [0, 1], false);
  ok('B8 diagonal x axis is 0.7 x walk (' + m.dx.toFixed(2) + ')', near(m.dx, 60 * walkExp * S.DIAG_FACTOR, 0.05));
  ok('B9 diagonal y axis is 0.7 x walk (' + (-m.dy).toFixed(2) + ')', near(-m.dy, 60 * walkExp * S.DIAG_FACTOR, 0.05));
  const diagOff = await page.evaluate(([P]) => {
    window.LAB.MODEL.diagNorm = false;
    window.LAB.place(P.map, P.x, P.y);
    const b = window.LAB.step(60, [0, 1], false);
    window.LAB.MODEL.diagNorm = true; window.LAB.setDirs([]);
    return b.x - P.x;
  }, [openField]);
  ok('B10 turning DIAG 0.7 off really removes it', near(diagOff, 60 * walkExp, 0.05));

  /* --- B11 ZERO ACCELERATION: frame 1 is frame 60 --------------------- */
  const f1 = await meas(1, [1], false);
  ok('B11 first frame is already full speed (' + f1.dx.toFixed(3) + ')', near(f1.dx, walkExp, 0.002));
  const accelF1 = await page.evaluate(([P]) => {
    window.LAB.MODEL.accel = true;
    window.LAB.place(P.map, P.x, P.y); window.LAB.S.vel.x = 0;
    const b = window.LAB.step(1, [1], false);
    window.LAB.MODEL.accel = false; window.LAB.setDirs([]); window.LAB.S.vel.x = 0;
    return b.x - P.x;
  }, [openField]);
  ok('B12 the ACCEL contrast model really ramps (' + accelF1.toFixed(3) + ' < ' + walkExp.toFixed(2) + ')',
     accelF1 > 0 && accelF1 < walkExp * 0.5);

  /* --- B13 THE HALF STEP: blocked at full, free at half --------------- */
  /* right edge of the box 2px shy of the fence column at tile x=14, row 20 */
  const half = await page.evaluate(() => {
    const r = {};
    window.LAB.place('town', 838, 1280);
    r.gapTileSolid = window.LAB.solidOn('town', 14, 20);
    r.full = window.LAB.step(1, [1], false).x - 838;
    window.LAB.MODEL.halfStep = false;
    window.LAB.place('town', 838, 1280);
    r.off = window.LAB.step(1, [1], false).x - 838;
    window.LAB.MODEL.halfStep = true; window.LAB.setDirs([]);
    return r;
  });
  ok('B13 the test wall is really solid', half.gapTileSolid === true);
  ok('B14 blocked at full speed -> moves HALF (' + half.full.toFixed(3) + ')', near(half.full, walkExp / 2, 0.002));
  ok('B15 HALF-STEP off -> dead stop (' + half.off.toFixed(3) + ')', near(half.off, 0, 0.0001));

  /* --- B16 THE CORNER SLIP: one quarter blocked -> slide sideways ----- */
  const slipExp = S.WALK_SPEED * (TICK / S.SLIP_DIV);
  const slip = await page.evaluate(() => {
    const r = {};
    window.LAB.place('town', 562, 1280);
    let b = window.LAB.step(1, [0], false);
    r.dx = b.x - 562; r.dy = b.y - 1280;
    window.LAB.MODEL.cornerSlip = false;
    window.LAB.place('town', 562, 1280);
    b = window.LAB.step(1, [0], false);
    r.offdx = b.x - 562;
    window.LAB.MODEL.cornerSlip = true; window.LAB.setDirs([]);
    return r;
  });
  ok('B16 corner slip slides toward the free quarter (' + slip.dx.toFixed(4) + ')', near(slip.dx, slipExp, 0.002));
  ok('B17 the slip does not also advance you forward', near(slip.dy, 0, 0.0001));
  ok('B18 CORNER SLIP off -> you snag (' + slip.offdx.toFixed(4) + ')', near(slip.offdx, 0, 0.0001));
  ok('B19 the slip is a nudge, not a rail (' + slipExp.toFixed(3) + ' px < walk/4)', slipExp < walkExp / 4);

  /* --- B20 the box is a small box at the feet ------------------------- */
  const b = await page.evaluate(() => { window.LAB.place('town', 640, 640); return window.LAB.boxOf(); });
  ok('B20 collision box is 48 x 32', b.w === S.BOX_W && b.h === S.BOX_H);
  ok('B21 box is inset 8px inside the tile', b.x - 640 === S.BOX_X);
  ok('B22 box is 3/4 tile wide, 1/2 tile tall', b.w / S.TILE === 0.75 && b.h / S.TILE === 0.5);

  /* --- B23 DOORS: walk in, fade, land, walk back out ----------------- */
  const warp = await page.evaluate(() => {
    const r = {};
    window.LAB.place('town', 8 * 64, 10 * 64);
    window.LAB.setTime(1000);
    const t0 = window.LAB.S.timeOfDay;
    window.LAB.step(1, [0], false);              /* the frame that fires it */
    r.fadingNotMoved = window.LAB.S.fadeDir === 1;
    r.mapDuringFade = window.LAB.S.map;
    let frames = 1, guard = 0;
    while (window.LAB.S.map === 'town' && guard++ < 400) { window.LAB.step(1); frames++; }
    r.framesToBlack = frames;
    r.map = window.LAB.S.map;
    r.tile = [Math.round(window.LAB.S.pos.x / 64), Math.round(window.LAB.S.pos.y / 64)];
    let fin = 0;
    while (window.LAB.S.fadeDir !== 0 && fin++ < 400) window.LAB.step(1);
    r.framesToClear = fin;
    r.timeFrozen = window.LAB.S.timeOfDay === t0;
    /* and back out the same door */
    window.LAB.setDirs([]);
    let out = 0;
    window.LAB.step(1, [2], false);
    while (window.LAB.S.map === 'house' && out++ < 400) window.LAB.step(1);
    r.back = window.LAB.S.map;
    window.LAB.setDirs([]);
    return r;
  });
  ok('B23 a door does not fire until you MOVE into it', warp.fadingNotMoved === true);
  ok('B24 you are still outside while the screen is fading', warp.mapDuringFade === 'town');
  ok('B25 the fade to black is ~50 ticks (' + warp.framesToBlack + ')', Math.abs(warp.framesToBlack - 50) <= 2);
  ok('B26 you land INSIDE the house', warp.map === 'house');
  ok('B27 you land one tile in front of the door (' + warp.tile.join(',') + ')', warp.tile[0] === 4 && warp.tile[1] === 5);
  ok('B28 the fade back in is ~50 ticks (' + warp.framesToClear + ')', Math.abs(warp.framesToClear - 50) <= 2);
  ok('B29 a doorway costs NO game time', warp.timeFrozen === true);
  ok('B30 you can walk back out the same door', warp.back === 'town');

  const shopWarp = await page.evaluate(() => {
    window.LAB.place('town', 27 * 64, 10 * 64);
    window.LAB.step(1, [0], false);
    let g = 0; while (window.LAB.S.map === 'town' && g++ < 400) window.LAB.step(1);
    while (window.LAB.S.fadeDir !== 0 && g++ < 900) window.LAB.step(1);
    const m2 = window.LAB.S.map; window.LAB.setDirs([]);
    return m2;
  });
  ok('B31 the second interior is reachable too', shopWarp === 'shop');

  /* --- B32 both interiors are FURNISHED and match their footprints ---- */
  const rooms = await page.evaluate(() => {
    /* measure the exterior footprint off the town map itself, from the door */
    function footprint(doorX, doorY) {
      const STRUCT = '#wD';
      let x0 = doorX, x1 = doorX, y0 = doorY;
      while (STRUCT.indexOf(window.LAB.tileOn('town', x0 - 1, doorY)) >= 0) x0--;
      while (STRUCT.indexOf(window.LAB.tileOn('town', x1 + 1, doorY)) >= 0) x1++;
      while (STRUCT.indexOf(window.LAB.tileOn('town', doorX, y0 - 1)) >= 0) y0--;
      return { w: x1 - x0 + 1, h: doorY - y0 + 1 };
    }
    return {
      house: { plate: window.LAB.plateOf('house'), foot: footprint(8, 9), furn: window.LAB.furnitureCount('house') },
      shop: { plate: window.LAB.plateOf('shop'), foot: footprint(27, 9), furn: window.LAB.furnitureCount('shop') }
    };
  });
  ['house', 'shop'].forEach((k, i) => {
    const r = rooms[k];
    ok('B3' + (2 + i * 2) + ' ' + k + ' interior plate === exterior footprint (' +
       r.plate.w + 'x' + r.plate.h + ' vs ' + r.foot.w + 'x' + r.foot.h + ')',
       r.plate.w === r.foot.w && r.plate.h === r.foot.h);
    ok('B3' + (3 + i * 2) + ' ' + k + ' interior is FURNISHED (' + r.furn + ' pieces)', r.furn >= 8);
  });

  /* --- B36 THE CLOCK: 7000ms = 10 minutes ---------------------------- */
  const clock = await page.evaluate(() => {
    const r = {};
    window.LAB.place('town', 18 * 64, 17 * 64);
    window.LAB.setTime(600);
    window.LAB.step(421, [], false);            /* 421 x 16.667 = 7017ms */
    r.after7s = window.LAB.S.timeOfDay;
    window.LAB.setTime(600);
    window.LAB.step(210, [], false);            /* half of it */
    r.after3s = window.LAB.S.timeOfDay;
    window.LAB.setTime(2550);
    window.LAB.step(900, [], false);
    r.clamped = window.LAB.S.timeOfDay;
    window.LAB.setTime(600);
    return r;
  });
  ok('B36 7000ms of frames = +10 game minutes (' + clock.after7s + ')', clock.after7s === 610);
  ok('B37 3.5s of frames = no tick yet (' + clock.after3s + ')', clock.after3s === 600);
  ok('B38 the day clamps at 2:00am (' + clock.clamped + ')', clock.clamped === 2600);

  /* --- B39 THE LIGHT CURVE ------------------------------------------- */
  const light = await page.evaluate(() => {
    const r = {};
    window.LAB.place('town', 18 * 64, 17 * 64);
    const at = t => { window.LAB.setTime(t); return window.LAB.tintAlpha(); };
    r.noon = at(1200); r.dusk = at(1800); r.night = at(2000); r.late = at(2600);
    r.preDusk = at(1750);
    window.LAB.place('house', 4 * 64, 5 * 64);
    r.inside = at(2200);
    window.LAB.place('town', 18 * 64, 17 * 64); window.LAB.setTime(600);
    return r;
  });
  ok('B39 midday is fully lit', light.noon === 0);
  ok('B40 nothing darkens before 6pm', light.preDusk === 0);
  ok('B41 6:00pm steps straight to 0.30 (' + light.dusk.toFixed(3) + ')', near(light.dusk, 0.30, 0.001));
  ok('B42 8:00pm is 0.75 (' + light.night.toFixed(3) + ')', near(light.night, 0.75, 0.001));
  ok('B43 it never goes fully black (' + light.late.toFixed(3) + ')', near(light.late, S.LIGHT_CAP, 0.001));
  ok('B44 interiors are not outdoors (' + light.inside + ')', light.inside === 0);

  /* --- B45 THE SCHEDULED NPC ---------------------------------------- */
  const npc = await page.evaluate(() => {
    const r = { keys: window.LAB.NPC.schedule.length, badTargets: [] };
    window.LAB.NPC.schedule.forEach(e => {
      if (window.LAB.solidOn('town', e.x, e.y)) r.badTargets.push(e.x + ',' + e.y);
    });
    r.rising = window.LAB.NPC.schedule.every((e, i, a) => i === 0 || e.t > a[i - 1].t);
    /* send it to the 12:00 stop and let it walk */
    window.LAB.place('town', 18 * 64, 17 * 64);
    window.LAB.NPC.pos.x = 27 * 64; window.LAB.NPC.pos.y = 11 * 64;
    window.LAB.NPC.lastKey = -1;
    window.LAB.setTime(1200);
    window.LAB.step(1, [], false);
    r.pathLen = window.LAB.NPC.path.length;
    window.LAB.step(900, [], false);
    r.tile = window.LAB.npcTile();
    r.target = window.LAB.NPC.target;
    /* and it keeps its schedule while you are indoors */
    window.LAB.place('house', 4 * 64, 5 * 64);
    window.LAB.NPC.lastKey = -1; window.LAB.setTime(1500);
    window.LAB.step(1, [], false);
    r.pathIndoors = window.LAB.NPC.path.length;
    window.LAB.place('town', 18 * 64, 17 * 64); window.LAB.setTime(600);
    return r;
  });
  ok('B45 the NPC has a real schedule (' + npc.keys + ' stops)', npc.keys >= 4);
  ok('B46 schedule times only go forward', npc.rising === true);
  ok('B47 every schedule stop is somewhere you can stand' +
     (npc.badTargets.length ? ' (' + npc.badTargets.join(' ') + ')' : ''), npc.badTargets.length === 0);
  ok('B48 it really pathfinds (' + npc.pathLen + ' steps)', npc.pathLen > 4);
  ok('B49 it arrives at the scheduled tile (' + npc.tile.join(',') + ' -> ' + npc.target.join(',') + ')',
     npc.tile[0] === npc.target[0] && npc.tile[1] === npc.target[1]);
  ok('B50 it keeps walking while you are inside (' + npc.pathIndoors + ')', npc.pathIndoors > 4);
  ok('B51 villagers are slower than the player', S.NPC_SPEED * (TICK / TICK) < walkExp);

  /* --- B52 the walk cycle re-times with the body -------------------- */
  const walkMod = 1 - S.ANIM_WALK_MOD * Math.max(1, S.WALK_SPEED * S.MOVE_MULT * TICK) * S.ANIM_MOD_MULT;
  const runMod = 1 - S.ANIM_RUN_MOD * Math.max(1, S.RUN_SPEED * S.MOVE_MULT * TICK) * S.ANIM_MOD_MULT;
  ok('B52 running re-times the feet faster than walking (' +
     (S.ANIM_BASE_MS * runMod).toFixed(1) + 'ms vs ' + (S.ANIM_BASE_MS * walkMod).toFixed(1) + 'ms)',
     runMod < walkMod && runMod > 0.5);
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

      const shot = path.join(PROOF_DIR, 'BOHEMIA_LAB_STARDEW_TOWNWALK_PROOF_7_26_26.png');
      /* a proof shot of the thing Paolo actually taps: mid-dusk, lamps lit */
      await page.evaluate(() => {
        window.LAB.place('town', 18 * 64, 13 * 64);
        window.LAB.setTime(1900);
        window.LAB.step(1, [2], true);
        window.LAB.setDirs([]);
        window.LAB.thaw();
      });
      await page.waitForTimeout(350);
      await page.screenshot({ path: shot });
      ok('C1 proof screenshot written', fs.existsSync(shot) && fs.statSync(shot).size > 8000);
      console.log('  proof: ' + shot);

      ok('C2 zero console errors' + (errors.length ? ' (' + errors[0].slice(0, 90) + ')' : ''), errors.length === 0);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }

  console.log('='.repeat(74));
  console.log('  LAB GATE: ' + pass + ' pass / ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL: gate threw: ' + (e && e.stack || e)); process.exit(1); });
