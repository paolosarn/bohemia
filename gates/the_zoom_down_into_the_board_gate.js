#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE MEASURES FRAMES, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   ============================================================================
   THE ZOOM DOWN INTO THE BOARD (MOTION 11/6/26; rule 407(g) STEP TWO, rule 417(b), ask line 450).
   PAOLO 11/4: 'I don't want even a real loading transition between combat, I low-key just wanna see it zoom in... as you zoom in
   that's what starts to unfold.' Rule 407(b): contact, and the camera zooms down into those streets from wherever he was; the grid
   lights up on the ground and the fight starts; after it the grid fades and the zoom goes back out. 407(c): the zoom turns from the
   map's diamond to the fight's square on the way down. 407's own gate: the way in shows the map's own ground in every frame and no
   loading picture; the board's houses and streets match the map's at the fight's spot; frames in budget on the phone profile; the
   way out climbs back. Rule 405(a): the clouds are deleted in the push that replaces them.

   DRIVEN ON THE DEMO, a road crew met two blocks off his crew (the door the map's contact calls, the meet card answered as the
   budget gate answers it), phone (390 x 844 at 3) and computer. A sampler in the page reads, EVERY ANIMATION FRAME, what covers
   the glass (the map's live canvas, the zoom's own frame of the map, the board, or the fight's loading line), never the zoom's log:
     Z1 THE WAY IN SHOWS THE MAP'S OWN GROUND IN EVERY FRAME: every frame from the door to the fight is the live map, the map's own
        frame held by the zoom, or the board; never the fight's loading line uncovered, never a cloud, never nothing
     Z2 THE CAMERA CAME DOWN: the map's own zoom climbs frame after frame (never back) from where he was to the stop, the fight's
        block at the map's focus at the end of it
     Z3 THE TURN LANDS ON THE BOARD: the map's frame and the board turn together and finish with the fight's block on the same pixel
        of the glass (within 2 px), the turn from the map's diamond to the fight's square (the map's aspect 0.5 to the board's own)
     Z4 THE BOARD IS THE MAP AT THAT SPOT: the board was laid from the map's own block (COMBAT TWO's step one, its own gate proves
        tile for tile: gates/the_board_is_the_city_at_that_spot_gate.js) and that block is the contact's
     Z5 THE GRID LIGHTS UP: the board's own tile lines scan on during the turn and are gone after it
     F1 FRAMES: the zoom's own work in a frame (everything but the map's own draw) under 5 ms at worst; the turn's frames (the
        fight's own draw under the turned pictures, the map resting) median under 60 ms, worst under 200 (the fight alone after it
        printed beside it); the come-down (the map's own draw every frame, its cost WORLD's and PLUMBER's, OVER_BUDGET in
        smooth_is_a_budget_gate.js) median under 100 ms and worst under 320 ms, the pinch's own ratchet. THIS BOX DRAWS WITH A
        SOFTWARE GPU (SwiftShader): the frame ratchets are this box's truth and may only come down; the own-work line travels
     O1 THE WAY OUT: every frame is the board, the zoom's frames, or the live map; never a loading line, never a cloud, never nothing
     O2 THE CLIMB BACK: the map's zoom back where he had it (2%), the camera holding his crew again, the map's bar on the glass
     R1 REDUCED MOTION (the phone's reduce-motion; the gear's MOTION LESS): no zoom, no turn: the map's frame held, a fade under 250 ms
     M1 MUTATION 'bare' (no frame held over the build): Z1 goes red   M2 MUTATION 'offset' (the board 40 px off): Z3 goes red
     S1 THE CLOUDS ARE GONE FROM THE SOURCE (rule 405(a)): no cloud layer, no nfcIn in the shell, the demo or the motion layer
     E1 nothing threw
   node gates/the_zoom_down_into_the_board_gate.js [--profile phone_portrait|computer]   (both when none is named)
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const ai = process.argv.indexOf('--profile'), only = ai > 0 ? process.argv[ai + 1] : null;
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x != null ? '  [' + x + ']' : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const RING = +((fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8').match(/const STREET_RING = (\d+)/) || [])[1] || 10);   /* COMBAT TWO's ring round a laid board */
const med = (a) => { if (!a.length) return null; const b = a.slice().sort((p, q) => p - q); return b[Math.floor(b.length / 2)]; };

/* the sampler: every animation frame, what covers the glass */
const SAMPLER = () => {
  if (window.__ZD) { window.__ZD.rows = []; return; }
  const Z = window.__ZD = { rows: [], on: true };
  const vis = (el) => { try { return !!el && getComputedStyle(el).display !== 'none'; } catch (e) { return false; } };
  const coversGlass = (c) => { try { const r = c.getBoundingClientRect(); return r.left <= 1 && r.right >= innerWidth - 1 && r.height >= innerHeight * 0.85; } catch (e) { return false; } };
  (function loop() {
    if (!Z.on) return;
    try {
      const dv = document.getElementById('bmdive');
      const cv = dv ? [...dv.querySelectorAll('canvas')].filter(c => c.className !== 'grid').map(c => ({ cls: c.className, op: +getComputedStyle(c).opacity, full: coversGlass(c), tf: getComputedStyle(c).transform })) : [];
      const grid = dv ? !!dv.querySelector('canvas.grid') : false;
      const mapCover = cv.some(c => /^map/.test(c.cls) && c.op > 0.01), boardCover = cv.some(c => c.cls === 'board' && c.op > 0.01);
      const fullMap = cv.some(c => /^map/.test(c.cls) && c.op >= 0.99 && c.full && (c.tf === 'none' || /^matrix\(1, 0, 0, 1,/.test(c.tf)));
      const fullBoard = cv.some(c => c.cls === 'board' && c.op >= 0.99 && c.full);
      const cityOn = vis(document.getElementById('p-city')), pf = document.getElementById('p-combat'), ff = document.getElementById('fightFrame');
      let load = null, board = false, z = null;
      try { const fd = ff && ff.contentDocument, l = fd && fd.getElementById('load'); load = !!(l && getComputedStyle(l).display !== 'none'); board = !load && !!(ff.contentWindow.FIGHT_UI && ff.contentWindow.FIGHT_UI.board); } catch (e) {}
      try { z = document.getElementById('cityFrame').contentWindow.eval('CZOOM'); } catch (e) {}
      const fightOn = !!(ff && vis(pf));
      let what;
      if (document.getElementById('nfclouds')) what = 'CLOUDS';
      else if (fightOn && load && !fullMap && !fullBoard) what = 'LOADING';
      else if (fullMap || mapCover) what = 'map frame';
      else if (fullBoard || boardCover) what = 'board frame';
      else if (fightOn && board) what = 'board';
      else if (cityOn && !fightOn) what = 'map';
      else what = 'NOTHING';
      Z.rows.push({ t: performance.now(), st: window.BohemiaMotion && BohemiaMotion.dive ? BohemiaMotion.dive.state() : '?', nfc: window.NFC ? NFC.state : '?', what, z, grid });
    } catch (e) { Z.rows.push({ t: performance.now(), what: 'ERR ' + String(e.message).slice(0, 60) }); }
    requestAnimationFrame(loop);
  })();
};

async function fight(d, label, mutate) {
  const M = (fn, a) => d.page.evaluate(fn, a);
  await M((m) => { window.__DIVE_MUTATE = m || null; }, mutate || null);
  await M(SAMPLER);
  const z0 = await d.fr.evaluate(() => ({ z: CZOOM, camf: CAMF.on, city: [city.x, city.y] }));
  const at = { gx: z0.city[0] + 2, gy: z0.city[1] + 1 };
  const n0 = await M(() => BohemiaMotion.dive.log.length);
  await d.fr.evaluate((at) => { try { if (window.MEET) MEET.walk = 0; } catch (e) {} const pm = partyMath('job', { skulls: 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
    cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why: 'party:zoom-gate', at }); }, at);
  /* in: until the fight is his and the zoom is done */
  let t0 = Date.now();
  while (Date.now() - t0 < 45000) { const s = await M(() => ({ st: BohemiaMotion.dive.state(), nfc: NFC.state, ff: !!document.getElementById('fightFrame'), n: BohemiaMotion.dive.log.length }));
    if (s.ff && s.st === 'off' && s.nfc === 'off' && s.n > 0) break; await sleep(150); }
  const inRows = await M(() => window.__ZD.rows.splice(0));
  await sleep(1500);
  const after = await M(() => window.__ZD.rows.splice(0));
  const own = []; for (let i = 1; i < after.length; i++) own.push(after[i].t - after[i - 1].t);
  const gridAfter = after.filter(x => x.grid).length;
  const down = await M((n0) => JSON.parse(JSON.stringify(BohemiaMotion.dive.log.slice(n0).filter(r => r.kind === 'down').pop() || null)), n0);
  const fsx = await (async () => { try { const h = await d.page.$('#fightFrame'); const f = h && await h.contentFrame(); return f && await f.evaluate(() => { const S = FIGHT.S, bd = S.boardDef || {}; return { laid: !!bd.laid, cell: bd.street ? bd.street.cell : null, X0: bd.street ? bd.street.X0 : null, Y0: bd.street ? bd.street.Y0 : null, w: S.w, h: S.h }; }); } catch (e) { return null; } })();
  /* out: the fight won, the end screen's LEAVE */
  const out = { rows: [], up: null, after: null };
  if (!mutate) {
    const h = await d.page.$('#fightFrame'), f = h && await h.contentFrame();
    if (f) await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} }).catch(() => {});
    for (let k = 0; k < 120 && !(await M(() => !!(window.SPOILS && SPOILS.frame))); k++) await sleep(250);
    await sleep(600);
    const n1 = await M(() => BohemiaMotion.dive.log.length);
    await M(SAMPLER);
    await M(() => { try { spoilsLeave(); } catch (e) {} });
    t0 = Date.now();
    while (Date.now() - t0 < 30000) { const s = await M(() => ({ st: BohemiaMotion.dive.state(), nfc: NFC.state, ff: !!document.getElementById('fightFrame'), n: BohemiaMotion.dive.log.length }));
      if (!s.ff && s.st === 'off' && s.nfc === 'off' && s.n > 0 && Date.now() - t0 > 800) break; await sleep(150); }
    await sleep(1500);
    out.rows = await M(() => window.__ZD.rows.splice(0));
    out.up = await M((n1) => JSON.parse(JSON.stringify(BohemiaMotion.dive.log.slice(n1).filter(r => r.kind === 'up').pop() || null)), n1);
    out.after = await d.fr.evaluate(() => { const b = document.getElementById('bmtb'); return { z: CZOOM, camf: CAMF.on, bar: b ? +getComputedStyle(b).opacity : null, left: window.top.document.getElementById('bmdive') ? 1 : 0 }; });
  } else {
    /* a mutated fight is put away without measuring its way home */
    await M(() => { window.__DIVE_MUTATE = null; });
    const h = await d.page.$('#fightFrame'), f = h && await h.contentFrame();
    if (f) await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} }).catch(() => {});
    for (let k = 0; k < 120 && !(await M(() => !!(window.SPOILS && SPOILS.frame))); k++) await sleep(250);
    await sleep(600); await M(() => { try { spoilsLeave(); } catch (e) {} });
    for (let k = 0; k < 120 && await M(() => !!document.getElementById('fightFrame') || NFC.state !== 'off' || BohemiaMotion.dive.state() !== 'off'); k++) await sleep(250);
    await sleep(1500);
  }
  return { label, at, z0, inRows, down, fsx, out, fightOwn: med(own), gridAfter };
}

/* Z3 without this file's geometry: the map frame's CSS transform at the turn's end, applied to where the map drew the block; and the
   board's own tile for that block (COMBAT TWO's X0 plus its ring) through the fight's own camera functions at that frame */
function landing(F) {
  const e = F.down && F.down.end, fx = F.fsx;
  if (!e || !fx || fx.X0 == null) return { dx: null, why: !e ? 'no end of turn' : 'no laid board' };
  const m = (e.tf.match(/matrix\(([^)]+)\)/) || [])[1]; if (!m) return { dx: null, why: 'no transform' };
  const [a, b, c, d, tx, ty] = m.split(',').map(Number), lx = e.map0.x - e.box.x, ly = e.map0.y - e.box.y;
  const p1 = [e.box.x + a * lx + c * ly + tx, e.box.y + b * lx + d * ly + ty];
  const u = F.at.gx + 0.5, v = F.at.gy + 0.5, X = 3 * u - (fx.X0 + RING), Y = 3 * v - (fx.Y0 + RING);
  const p2 = [e.fx + e.sx0 + X * e.tw, e.fy + e.sy0 + Y * e.th];
  return { dx: Math.hypot(p1[0] - p2[0], p1[1] - p2[1]), p1: p1.map(Math.round), p2: p2.map(Math.round) };
}
function inLegs(p, F, quiet) {
  const R = F.inRows, bad = R.filter(r => /LOADING|CLOUDS|NOTHING|ERR/.test(r.what));
  const seen = {}; R.forEach(r => { seen[r.what] = (seen[r.what] || 0) + 1; });
  if (quiet) return { z1: R.length > 10 && !bad.length, bad: bad.length, frames: R.length };
  ok(p + 'Z1 THE WAY IN SHOWS THE MAP\'S OWN GROUND IN EVERY FRAME (no loading line, no cloud, never nothing)', R.length > 10 && !bad.length,
    R.length + ' frames: ' + Object.entries(seen).map(([k, v]) => k + ' ' + v).join(', ') + (bad.length ? '; first bad at ' + bad[0].st + ': ' + bad[0].what : ''));
  const r = F.down || {}, come = R.filter(x => x.st === 'come' && x.z != null).map(x => x.z);
  let back = 0; for (let i = 1; i < come.length; i++) if (come[i] < come[i - 1] - 1e-6) back++;
  ok(p + 'Z2 THE CAMERA CAME DOWN: the map\'s own zoom climbs every frame from where he was to the stop', come.length >= 3 && back === 0 && come[come.length - 1] >= Math.max(r.z1 * 0.85, F.z0.z) && (r.z1 || 0) > F.z0.z,
    'zoom ' + (F.z0.z).toFixed(2) + ' -> ' + (r.z1 || 0).toFixed(2) + ' over ' + come.length + ' frames, ' + back + ' frames back; come-down ' + r.comeMs + ' ms, the painter asked ahead ' + r.prepaint + ' tiles');
  const t3 = landing(F), al = r.align || {};
  ok(p + 'Z3 THE TURN LANDS ON THE BOARD: where the map\'s frame ends its turn, the fight\'s own camera draws the same block (2 px)', t3.dx != null && t3.dx <= 2 && r.phases && r.phases.turn > 0,
    t3.dx != null ? 'the map frame\'s own transform puts the block at ' + t3.p1 + ', the fight\'s camera on COMBAT TWO\'s board at ' + t3.p2 + ' (' + t3.dx.toFixed(1) + ' px); the map\'s block ' + al.scale + 'x the board\'s, turned in ' + ((r.phases.grid || 0) - r.phases.turn) + ' ms' : 'no turn measured: ' + t3.why);
  ok(p + 'Z4 THE BOARD IS THE MAP AT THAT SPOT: laid from the map\'s own block, the contact\'s', !!F.fsx && F.fsx.laid && !!F.fsx.cell && F.fsx.cell[0] === F.at.gx && F.fsx.cell[1] === F.at.gy,
    F.fsx ? 'laid ' + F.fsx.laid + ', cell ' + F.fsx.cell + ' (contact ' + F.at.gx + ',' + F.at.gy + '), ' + F.fsx.w + ' x ' + F.fsx.h + ' tiles' : 'no fight');
  const gridTurn = R.filter(x => x.st === 'turn' && x.grid).length, gridAfter = F.gridAfter;
  ok(p + 'Z5 THE GRID LIGHTS UP: the board\'s own lines on through the turn and gone after it', gridTurn > 0 && gridAfter === 0 && r.phases && r.phases.grid > 0, gridTurn + ' turn frames with the grid, ' + gridAfter + ' after');
  const gaps = (st) => { const a = []; for (let i = 1; i < R.length; i++) if (R[i].st === st && R[i - 1].st === st) a.push(R[i].t - R[i - 1].t); return a; };
  const gc = gaps('come'), gt = gaps('turn');
  const mc = med(gc), wc = gc.length ? Math.max(...gc) : null, mt = med(gt), wt = gt.length ? Math.max(...gt) : null;
  /* THE RATCHET, this box's truth (11/6, three runs: own 3.8 to 4.2 ms; the turn's median 46 to 50 ms against the fight alone 20 to 22,
     the difference the software GPU compositing the turned full-glass pictures, which a phone's GPU does for nothing; the computer's
     glass 47 against 17 once the covered layers are skipped (106 before); the come-down
     39 to 45 ms median, 120 to 142 worst, the map's own draw): it may only come down */
  const fo = F.fightOwn || 0, turnCap = 60;
  ok(p + 'F1 FRAMES: the zoom\'s own work under 5 ms a frame; the turn median under 60 ms, worst under 200 ms; the come-down median under 100 and worst under 320 ms (the map\'s own draw, the pinch\'s ratchet)',
    r.ownMax != null && r.ownMax < 5 && mt != null && mt <= turnCap && wt < 200 && mc != null && mc < 100 && wc < 320,
    'own ' + r.ownMax + ' ms at worst (the map\'s draw up to ' + r.drawMax + ' ms); turn median ' + (mt || 0).toFixed(1) + ' (the fight alone after it ' + fo.toFixed(1) + '), worst ' + (wt || 0).toFixed(1) + ' ms over ' + gt.length + '; come-down median ' + (mc || 0).toFixed(1) + ', worst ' + (wc || 0).toFixed(1) + ' ms over ' + gc.length + '; the fight built under the map\'s frame in ' + r.built + ' ms');
}
function outLegs(p, F) {
  const R = F.out.rows, bad = R.filter(r => /LOADING|CLOUDS|NOTHING|ERR/.test(r.what)), seen = {}; R.forEach(r => { seen[r.what] = (seen[r.what] || 0) + 1; });
  ok(p + 'O1 THE WAY OUT: the board, the zoom\'s frames, the live map; never a loading line, a cloud or nothing', R.length > 10 && !bad.length,
    R.length + ' frames: ' + Object.entries(seen).map(([k, v]) => k + ' ' + v).join(', ') + (bad.length ? '; first bad at ' + bad[0].st + ': ' + bad[0].what : ''));
  const a = F.out.after || {}, up = F.out.up || {};
  ok(p + 'O2 THE CLIMB BACK: the map\'s zoom where he had it, his crew held again, the bar on the glass, nothing left over', !!F.out.up && !up.plain && Math.abs(a.z - F.z0.z) <= F.z0.z * 0.02 && a.camf === F.z0.camf && a.bar >= 0.99 && !a.left,
    'zoom ' + (a.z || 0).toFixed(3) + ' (was ' + F.z0.z.toFixed(3) + '), held ' + a.camf + ', bar ' + a.bar + ', phases ' + JSON.stringify(up.phases) + ', ' + up.ms + ' ms');
}

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await D.open({ profile });
  const errs = []; d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    console.log('  ' + d.says());
    for (let i = 0; i < 160; i++) { if (await d.fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'city' && typeof cityHandOver === 'function' && !!(window.om && om.n)).catch(() => false)) break; await sleep(500); }
    await sleep(2500);
    const p = profile === 'computer' ? 'C ' : 'P ';
    const F = await fight(d, 'first', null);
    inLegs(p, F); outLegs(p, F);
    if (profile !== 'computer') {
      await sleep(1500);
      const m1 = await fight(d, 'mutation bare', 'bare'); const q1 = inLegs(p + '(M1) ', m1, true);
      await sleep(1500);
      const m2 = await fight(d, 'mutation offset', 'offset');
      const l2 = landing(m2), dx = l2.dx == null ? 0 : l2.dx;
      ok(p + 'M1 MUTATION bare (no frame held over the build): Z1 goes red', !q1.z1, q1.bad + ' bad frames of ' + q1.frames);
      ok(p + 'M2 MUTATION offset (the board 40 px off): Z3 goes red', dx > 2, 'the turn ended ' + dx.toFixed(1) + ' px apart');
      await sleep(1500);
      await d.page.evaluate(() => BOHEMIA_SETTINGS.setMotion(true));   /* the gear's MOTION: LESS */
      const rd = await fight(d, 'reduced', null);
      const r = rd.down || {}, zs = rd.inRows.filter(x => x.z != null).map(x => x.z), moved = zs.length ? Math.max(...zs) - Math.min(...zs) : 0;
      const badR = rd.inRows.filter(x => /LOADING|CLOUDS|NOTHING|ERR/.test(x.what)).length;
      const fadeMs = r.phases && r.phases.fade != null ? (r.ms - r.phases.fade) : null;
      ok(p + 'R1 REDUCED MOTION: no zoom, no turn, the map\'s frame held over the build, a fade under 250 ms', !!r.reduced && !!r.plain && moved < 1e-6 && !badR && fadeMs != null && fadeMs < 250,
        'reduced ' + r.reduced + ', zoom moved ' + moved.toFixed(4) + ', ' + badR + ' bad frames, the fade ' + fadeMs + ' ms');
      await d.page.evaluate(() => BOHEMIA_SETTINGS.setMotion(false));
    }
    ok(p + 'E1 nothing threw', !errs.length, errs.slice(0, 3).join(' | ') || 'none');
  } catch (e) { ok(profile + ' ran to the end', false, String(e && e.stack || e).slice(0, 300)); }
  await d.close();
}

(async () => {
  console.log('\nTHE ZOOM DOWN INTO THE BOARD (rule 407(g) step two, rule 417(b), ask line 450)');
  /* S1, from the source */
  const shell = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8'), demo = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8'), mo = fs.readFileSync(path.join(ROOT, 'slices/bohemia_motion.js'), 'utf8');
  const dead = /nfclouds|function nfcIn|nfcIn\(|nfcPart\(|nfcHoldUntilReady/;
  ok('S1 THE CLOUDS ARE GONE FROM THE SOURCE: no cloud layer, no nfcIn, in the shell, the demo or the motion layer; the dive hands the build',
    !dead.test(shell) && !dead.test(demo) && !/getElementById\('nfclouds'\)/.test(mo) && /BohemiaMotion\.dive\.down\(d, go\)/.test(shell) && /__THE_ZOOM_DOWN_INTO_THE_BOARD__/.test(mo),
    ['shell', 'demo', 'motion'].map((k, i) => k + ' ' + (dead.test([shell, demo, mo][i]) ? 'HAS CLOUDS' : 'clear')).join(', '));
  for (const prof of only ? [only] : ['phone_portrait', 'computer']) await run(prof);
  console.log('\nTHE ZOOM DOWN INTO THE BOARD: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
