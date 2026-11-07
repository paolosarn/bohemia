#!/usr/bin/env node
/* ============================================================================
   THE MAP'S LIGHTS READ AS LIGHTS (PLUMBER 7, 11/7/26; rule 393(a)(b)(c), rule 427(d), ask line 428).
   PAOLO 11/4, his screenshot of the valley at night (records/target/coordinator_11_4/the_map_red_and_yellow_specks.webp): 'wtf are
   the yellow lights and red lights looking stuff, I zoomed in and when it didn't disappear it was looking like hella red sand, ugly'.
   MEASURED BEFORE in the painter (vbCityCore): a burned block's ember was a roll on every roof texel (3.5 in 100), so the closer the
   zoom the more specks (a carpet of red sand); a street lamp was its whole strip of kerb lit flat in the lamp's yellow (a dash).
   NOW (__THE_MAP_S_LIGHTS_READ_AS_LIGHTS__): a few real embers a burned block at every zoom, a lamp's pool of light on the ground,
   a lit window's glow. Read here from the painter's own pictures on a stranger's valley (its burned blocks are the campaign's), at
   the whole painting's detail and at the tiles' (36, 60, 96 and 128 texels a block: the far, the opening and the street stops):
     E1 A BURNED BLOCK'S EMBERS ARE FEW AND THE SAME AT EVERY ZOOM: the painter's own count (stand.lights) over the tiles round the
        burned blocks: at most 3 embers a burned block at every detail, the counts within a factor of 2 from 36 to 128
     E2 NEVER RED SAND: the embers' light (each lit texel by its strength) at most 2% of a burned block's char at every detail, and
        at the street's detail (96, 128) each ember a core of 3 texels or more, never a speck
     L1 A LAMP LIGHTS THE GROUND: on a lit arterial, light lies on the ground round each lamp (texels of the walk and the street with
        a partial warm light, not the lamp's flat yellow), at least 40 of them a block at 96 and 128
     L2 NEVER THE FLAT YELLOW DASH: no texel of the walk carries the lamp's flat yellow at full strength (the old dash), and the
        lamp's head still burns on its post
     L3 NO LAMP IS LEFT DARK: every lamp spot on a powered block (the arterial's, a house street's every other lot, WORLD
        THIRTEEN's; a town's pad and ramp) carries a pool, at every detail (the painter's own count)
     W1 A LIT WINDOW GLOWS: on lit houses, texels beside a lit window carry a faint warm light (the painter's count)
     P1 THE PLANTED FAIL: the same tiles painted the old way (inp.lightsOld) turn E1, E2 and L1 red
     E4 NO FRAME COST: the painter's own time for the same tiles at most 15% over the old way's (it runs in its worker, off the
        page's thread)
     E3 nothing threw
   node gates/the_map_s_lights_read_as_lights_gate.js
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x != null ? '  [' + x + ']' : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* in the page: paint the tiles round the burned blocks and a lit arterial, the new way or the old, and read the lights */
const READ = ([old, Ss]) => {
  const N = om.n, WS = window.__WS_CELL, out = { burned: 0, lamps: 0, at: {} };
  const burned = [], lamps = [];
  for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
    if (WS && WS[y * N + x] === 1) burned.push([x, y]);
    const t = om.at(x, y); if (t && /arterial|strip/.test(t.district) && vbClassOf(t.district) === VB_CLASS.road && POWER && POWER.at(x, y).live) lamps.push([x, y]); }
  out.burned = burned.length; out.lamps = lamps.length;
  const tilesOf = (L, n) => { const seen = new Map(); L.forEach(c => { const k = Math.floor(c[0] / VB_TILE) + ',' + Math.floor(c[1] / VB_TILE); if (!seen.has(k)) seen.set(k, []); seen.get(k).push(c); });
    return [...seen.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, n); };
    const lampY = vbHex(VB_CCOL.lamp);
  Ss.forEach(S => {
    const row = { blocks: 0, embers: 0, core: 0, light: 0, burnTex: 0, pool: 0, poolBlocks: 0, flatLamp: 0, head: 0, glow: 0, ms: 0, lampTex: 0, darkLamp: 0 };
    tilesOf(burned, 3).forEach(([k]) => { const [tx, ty] = k.split(',').map(Number), inp = vbTileInput(tx, ty, S); inp.lightsOld = old; const c = vbCityCore(inp), L = c.stand.lights; row.ms += c.ms;
      let nb = 0; for (let i = 0; i < inp.wst.length; i++) if (inp.wst[i] === 1) nb++;   /* every burned block the tile paints, its margin's too */
      row.blocks += nb; row.embers += L.embers; row.core += L.emberCore; row.light += L.emberLight; row.burnTex += L.burnTop; });
    tilesOf(lamps, 2).forEach(([k, cells]) => { const [tx, ty] = k.split(',').map(Number), inp = vbTileInput(tx, ty, S); inp.lightsOld = old; const c = vbCityCore(inp), P = c.P; row.ms += c.ms; row.lampTex += c.stand.lights.lampTex | 0; row.darkLamp += c.stand.lights.darkLamp | 0;
      cells.forEach(([gx, gy]) => { const bx = gx - inp.org[0], by = gy - inp.org[1]; let pool = 0;
        for (let v = 0; v < S; v++) for (let u = 0; u < S; u++) { const o = (((by) * S + v) * P + (bx) * S + u) * 4, a = c.lights[o + 3]; if (!a) continue;
          const isY = c.lights[o] === lampY[0] && c.lights[o + 1] === lampY[1] && c.lights[o + 2] === lampY[2];
          if (isY && a < 255) pool++; else if (isY && a === 255) row.flatLamp++; else if (a === 255) row.head++; }
        row.pool += pool; row.poolBlocks++; }); });
    /* the windows' glow: a tile of houses with its power on in the painter's input (few houses have power on a valley; the painter
       is what is asked here: a lit window, wherever one burns, glows), the painter's own count */
    const houses = []; for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) { const t = om.at(x, y); if (t && vbClassOf(t.district) === VB_CLASS.houses) houses.push([x, y]); }
    tilesOf(houses, 1).forEach(([k]) => { const [tx, ty] = k.split(',').map(Number), inp = vbTileInput(tx, ty, S); inp.lightsOld = old; inp.live.fill(1); const c = vbCityCore(inp); row.glow += c.stand.lights.glow; row.lampTex += c.stand.lights.lampTex | 0; row.darkLamp += c.stand.lights.darkLamp | 0; });
    out.at[S] = row; });
  return out;
};

(async () => {
  console.log('\nTHE MAP\'S LIGHTS READ AS LIGHTS (rule 393, ask line 428)\n');
  const d = await D.open({ profile: 'phone_portrait', fog: true });   /* a stranger's game: the campaign's burned blocks */
  const errs = []; d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => !!window.__WS_CELL && typeof vbCityCore === 'function' && !!(window.om && om.n)).catch(() => false)) break; await sleep(500); }
    const Ss = [36, 60, 96, 128];
    const A = await d.fr.evaluate(READ, [false, Ss]);
    const B = await d.fr.evaluate(READ, [true, Ss]);
    console.log('  the valley: ' + A.burned + ' burned blocks, ' + A.lamps + ' lit arterial blocks');
    const per = (R, S) => R.at[S].blocks ? R.at[S].embers / R.at[S].blocks : 0, share = (R, S) => R.at[S].burnTex ? R.at[S].light / R.at[S].burnTex : 0, coreOf = (R, S) => R.at[S].embers ? R.at[S].core / R.at[S].embers : 0;
    Ss.forEach(S => console.log('    ' + String(S).padStart(3) + ' texels a block: now ' + per(A, S).toFixed(2) + ' embers a block (' + coreOf(A, S).toFixed(1) + ' core texels each), ' + (100 * share(A, S)).toFixed(2) + '% of the char lit; lamps ' + (A.at[S].poolBlocks ? Math.round(A.at[S].pool / A.at[S].poolBlocks) : 0) + ' pool texels a block, ' + A.at[S].flatLamp + ' flat yellow, ' + A.at[S].head + ' heads; ' + A.at[S].glow + ' window glow'
      + '  |  before ' + per(B, S).toFixed(1) + ' embers a block, ' + (100 * share(B, S)).toFixed(2) + '% lit, ' + (B.at[S].poolBlocks ? Math.round(B.at[S].pool / B.at[S].poolBlocks) : 0) + ' pool, ' + B.at[S].flatLamp + ' flat yellow'));
    const okE1 = (R) => Ss.every(S => per(R, S) <= 3) && (() => { const v = Ss.map(S => per(R, S)).filter(x => x > 0); return v.length >= 2 && Math.max(...v) / Math.min(...v) <= 2; })();
    const okE2 = (R) => Ss.every(S => share(R, S) <= 0.02) && [96, 128].every(S => coreOf(R, S) >= 3);
    const okL1 = (R) => [96, 128].every(S => R.at[S].poolBlocks > 0 && R.at[S].pool / R.at[S].poolBlocks >= 40);
    ok('E1 a burned block\'s embers are few and the same at every zoom: at most 3 a block, within a factor of 2 from 36 to 128 texels a block', A.burned > 0 && okE1(A),
      Ss.map(S => S + ': ' + per(A, S).toFixed(2)).join(', ') + ' (before: ' + Ss.map(S => per(B, S).toFixed(1)).join(', ') + ')');
    ok('E2 never red sand: the embers\' light at most 2% of a burned block\'s char at every detail, and each ember a core of 3 texels or more up close (never a speck)', A.burned > 0 && okE2(A),
      Ss.map(S => S + ': ' + (100 * share(A, S)).toFixed(2) + '%').join(', ') + '; core texels an ember at 96/128: ' + coreOf(A, 96).toFixed(1) + '/' + coreOf(A, 128).toFixed(1) + ' (before ' + Ss.map(S => (100 * share(B, S)).toFixed(1) + '%').join(', ') + ')');
    ok('L1 a lamp lights the ground: at least 40 texels of partial warm light round the lamps a lit arterial block, at 96 and 128', A.lamps > 0 && okL1(A),
      [96, 128].map(S => S + ': ' + (A.at[S].poolBlocks ? Math.round(A.at[S].pool / A.at[S].poolBlocks) : 0)).join(', '));
    ok('L2 never the flat yellow dash: no texel of the walk in the lamp\'s flat yellow, and the lamp\'s head still burns on its post', A.lamps > 0 && Ss.every(S => A.at[S].flatLamp === 0) && [96, 128].every(S => A.at[S].head > 0),
      'flat yellow ' + Ss.map(S => A.at[S].flatLamp).join('/') + ' (before ' + Ss.map(S => B.at[S].flatLamp).join('/') + '); heads ' + [96, 128].map(S => A.at[S].head).join('/'));
    ok('L3 no lamp is left dark: every lamp spot on a powered block (the arterial\'s, a house street\'s every other lot, a town\'s pad) has its pool, at every detail', Ss.every(S => A.at[S].lampTex > 0 && A.at[S].darkLamp === 0),
      Ss.map(S => S + ': ' + A.at[S].lampTex + ' lamp texels, ' + A.at[S].darkLamp + ' dark').join(', '));
    ok('W1 a lit window glows into the texels round it (a tile of houses with its power on)', [96, 128].every(S => A.at[S].glow > 0) && [96, 128].every(S => B.at[S].glow === 0), [96, 128].map(S => S + ': ' + A.at[S].glow).join(', ') + ' (before ' + [96, 128].map(S => B.at[S].glow).join('/') + ')');
    /* NO FRAME COST: the painter runs in its worker, off the page's thread; its own time for the same tiles, the new way against the
       old, warmed and taken in turns (the first paint of a kind pays the page's warm-up: timed in a row, the first way read 45% slower) */
    const T = await d.fr.evaluate((Ss) => { const N = om.n, WS = window.__WS_CELL, L = { b: null, l: null, h: null };
      for (let y = 1; y < N - 1 && !(L.b && L.l && L.h); y++) for (let x = 1; x < N - 1; x++) { const t = om.at(x, y); if (!L.b && WS && WS[y * N + x] === 1) L.b = [x, y];
        if (t && !L.l && /arterial|strip/.test(t.district) && vbClassOf(t.district) === VB_CLASS.road) L.l = [x, y]; if (t && !L.h && vbClassOf(t.district) === VB_CLASS.houses) L.h = [x, y]; }
      const tiles = [L.b, L.l, L.h].filter(Boolean).map(c => [Math.floor(c[0] / VB_TILE), Math.floor(c[1] / VB_TILE)]);
      const one = (old) => { let ms = 0; Ss.forEach(S => tiles.forEach(([tx, ty], i) => { const inp = vbTileInput(tx, ty, S); inp.lightsOld = old; if (i === 2) inp.live.fill(1); const t = performance.now(); vbCityCore(inp); ms += performance.now() - t; })); return ms; };
      one(true); one(false); let a = 0, b = 0; for (let r = 0; r < 2; r++) { b += one(true); a += one(false); } return { now: a, old: b }; }, [60, 128]);
    const msA = T.now, msB = T.old;
    ok('E4 no frame cost: the painter (in its worker, off the page\'s thread) takes at most 15% longer for the same tiles than the old way', msA <= msB * 1.15 + 20,
      'the painter ' + Math.round(msA) + ' ms now, ' + Math.round(msB) + ' ms the old way, the same tiles at 60 and 128, warmed and in turns (' + ((msA >= msB) ? '+' : '') + Math.round(100 * (msA / Math.max(1, msB) - 1)) + '%)');
    ok('P1 THE PLANTED FAIL: painted the old way (inp.lightsOld) the embers and the lamps go red', B.burned > 0 && !okE1(B) && !okE2(B) && !okL1(B),
      'the old way: E1 ' + (okE1(B) ? 'green' : 'red') + ', E2 ' + (okE2(B) ? 'green' : 'red') + ', L1 ' + (okL1(B) ? 'green' : 'red'));
  } catch (e) { ok('the gate ran', false, String(e && e.stack || e).slice(0, 300)); }
  ok('E3 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
  console.log('\nTHE MAP\'S LIGHTS READ AS LIGHTS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
