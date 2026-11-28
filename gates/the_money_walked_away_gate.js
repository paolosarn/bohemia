#!/usr/bin/env node
/* THE MONEY WALKED AWAY (WORLD 15, 11/26; VAMILY rule 485(a): 'the dead Strip and the half-built luxury the money walked away from beside
   the blocks that still have power'; built into what exists (480(b)), no icons, no billboards, no words).
   A fourth kind of block in the valley's state (records/target/bb/world_state.json scars.unfinished, engine/bohemia_world_state.js code 4):
   a luxury or downtown tower left as a frame when the dollar died, painted by the map's own painter (wsTint st 4: bare floor slabs, open
   bays with no glass between the columns, rust on the rebar, the lot graded dirt) and never powered.
     STATIC
     D1 the data row and the engine's code; the page carries the data and the engine as they are
     D2 the painter's rule (st 4) and its floors (the call hands liftk)
     ON THE PAGE (the demo, a phone upright, three staged valleys)
     G1 every valley gets frames (1 to 5 towers), each on a luxury or downtown block, none round a base
     G2 never powered: no frame block sits on a live circuit
     G3 the painting carries the state (its key holds the valley's), and the other kinds are still there
     G4 nothing threw
   Run: node gates/the_money_walked_away_gate.js [static] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 400) + ']' : '')); };
const KINDS = ['highroller', 'luxor', 'resort', 'casino', 'convention', 'downtown'];

function statics() {
  console.log('\n-- static --');
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'bb', 'world_state.json'), 'utf8')), U = data.scars && data.scars.unfinished;
  const W = require(path.join(ROOT, 'engine', 'bohemia_world_state.js'));
  const page = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8'), m = page.match(/var BOHEMIA_WORLD_STATE_DATA = (\{.*?\});\n/);
  const mod = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_world_state.js'), 'utf8').trimEnd();
  ok('D1 the row (on the luxury and downtown kinds, dark) and the engine\'s code 4; the page carries both as they are',
     !!U && U.dark === true && JSON.stringify(U.on) === JSON.stringify(KINDS) && W.CODES.unfinished === 4 && W.NAMES[4] === 'unfinished' && !!m && JSON.stringify(JSON.parse(m[1])) === JSON.stringify(data) && page.indexOf(mod) >= 0,
     U ? U.name : 'no row');
  ok('D2 the painter paints it (st 4: the slabs, the open bays, the rust) and hands it the floors', /if \(st === 4\) \{/.test(page) && /function wsTint\(b0, st, top, c2, h, u, v, lk\)/.test(page) && /qu \+ XS, qv \+ YS, liftk\); \}/.test(page));
  /* 11/27 (rule 485(a), THE DEAD STRIP BY DAY): a casino or a tower on a block with no power reads dead in daylight, off the same grid the night reads */
  /* 11/27 WORLD 17 (rule 495(b)): the dead Strip moved, pixel for pixel, into the module the painter asks how a district looks
     (engine/bohemia_district_look.js vbDistrictDay); the page calls it with the block's power, the valley's state and the dust grey */
  const DL = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_district_look.js'), 'utf8');
  ok('D3 the dead Strip by day: an unpowered casino or tower is dulled (its gold and neon dust, its windows black, its walls grimed), read off the night\'s own grid (engine/bohemia_district_look.js, the painter calls it)',
     /if \(!ws && !lit && \(K === 1 \|\| K === 2\)\) \{/.test(DL) && /b = DLD\(b, dK, part2 === PART\.neon, part2 === PART\.window, top, top && Hq >= 2 \* T, liftk, Q, dbi < 0 \|\| live\[dbi\] \? 1 : 0, wsv,/.test(page) && !/__THE_DEAD_STRIP_BY_DAY__/.test(page));
}

async function pageRun() {
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  for (const code of ['vegas7', 'dust42', 'nevada']) {
    console.log('\n-- the demo upright, valley ' + code.toUpperCase() + ' --');
    const d = await open({ profile: 'phone_portrait', fog: true, arm: "try { localStorage.setItem('bohemia.world.next.v1', '" + code + "'); } catch (e) {}" });
    const fr = d.fr, pg = d.page, errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    try {
      for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.BohemiaWorldStateMap && BohemiaWorldStateMap.state() && typeof MODE !== 'undefined' && MODE === 'city'))) break; await pg.waitForTimeout(500); }
      try { await d.toMap(); } catch (e) {}
      const r = await fr.evaluate(async (KINDS) => {
        const S = BohemiaWorldStateMap.state(), n = om.n, bs = ctBases(), out = { code: S.code, count: S.count, frames: [], bad: [], live: [] };
        S.scars.filter(x => x.kind === 'unfinished').forEach(x => out.frames.push([x.x, x.y, x.cells]));
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { if (S.cell[y * n + x] !== 4) continue; const t = om.at(x, y);
          if (!t || KINDS.indexOf(t.district) < 0) out.bad.push([x, y, t && t.district]);
          for (const k in bs) if (Math.max(Math.abs(bs[k].x - x), Math.abs(bs[k].y - y)) <= 3) out.bad.push([x, y, 'by ' + k]);
          try { if (POWER.at(x, y).live) out.live.push([x, y]); } catch (e) {} }
        for (let i = 0; i < 40; i++) { MAP_GROUND.key = ''; render(); await new Promise(r => setTimeout(r, 250)); if (VBC.key && VBC.key.indexOf(':ws' + window.__WS_KEY) >= 0) break; }
        out.key = !!(VBC.key && window.__WS_KEY && VBC.key.indexOf(':ws' + window.__WS_KEY) >= 0);
        return out; }, KINDS);
      ok(code.toUpperCase() + ' G1 the frames: ' + r.frames.length + ' towers (' + r.count.unfinished + ' blocks), each on a luxury or downtown block, none round a base',
         r.frames.length >= 1 && r.frames.length <= 5 && !r.bad.length, JSON.stringify({ frames: r.frames, bad: r.bad.slice(0, 4) }));
      ok(code.toUpperCase() + ' G2 never powered: no frame block on a live circuit', !r.live.length, JSON.stringify(r.live.slice(0, 4)));
      ok(code.toUpperCase() + ' G3 the painting carries the state, and the other kinds are still there (burned ' + r.count.burned + ', looted ' + r.count.looted + ', rebuilt ' + r.count.reclaimed + ')',
         r.key && r.count.burned > 0 && r.count.looted > 0 && r.count.reclaimed > 0);
      ok(code.toUpperCase() + ' G4 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
    } finally { await d.close(); }
  }
}

(async () => {
  statics();
  if (process.argv[2] !== 'static') { try { await pageRun(); } catch (e) { ok('the page ran', false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTHE MONEY WALKED AWAY: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
