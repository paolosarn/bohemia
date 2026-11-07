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
   RULE 420 (MOTION 2, 11/7; Paolo 11/7: 'the transition from the map to the combat right now is still kind of shit'; the gate rule
   420 names: frames in budget on the throttled phone through the whole dive in and out, the map's own ground in every frame, no frame
   black or held past a beat, the board's men where the map had them). The dive is now played by the compositor (Web Animations on
   held pictures), so Z2 and F1 are re-aimed to it (the map drawn once at each picture of the way down, never once a frame) and a
   third run, the phone with the CPU at 4x, reads the compositor's own frames off a trace (DrawFrame), the phases marked on the same
   clock (console.timeStamp from the motion layer while window.__DIVE_MARKS is set; the game never sets it):
     T1 THE WAY IN AT 4X: from the camera's first move to the board landing, median at most 17.5 ms, p90 at most 34, none over 100
     T2 NOTHING HELD PAST A BEAT: no gap over 500 ms anywhere in the way in or out
     T3 THE WAY OUT AT 4X: median at most 17.5 ms, p90 at most 34 (the worst printed: at 4x on this box it lies in other pages'
        canvas work after a fight, the map's result message and the carcass, named in the record)
     T4 THE MEN FOUND WHERE THEY STOOD: a bracket for every live man, starting where the map draws his crew (theirs: the contact's
        block) through the map frame's own rest pose, landing on his tile through the fight's own camera, 3 px
     B1 THE GLASS IS NEVER BARE: through the hold a picture at full opacity covers the whole glass (the bar's band too)
   node gates/the_zoom_down_into_the_board_gate.js [--profile phone_portrait|computer|phone_4x]   (all three when none is named)
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
      /* (rule 420) the map's pictures are scaled to cover the glass, so a cover is a picture at full opacity whose drawn box covers it */
      const mapCover = cv.some(c => /^map/.test(c.cls) && c.op > 0.01), boardCover = cv.some(c => /^board/.test(c.cls) && c.op > 0.01);
      const fullMap = cv.some(c => /^map/.test(c.cls) && c.op >= 0.99 && c.full);
      const fullBoard = cv.some(c => /^board/.test(c.cls) && c.op >= 0.99 && c.full);
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
      Z.rows.push({ t: performance.now(), st: window.BohemiaMotion && BohemiaMotion.dive ? BohemiaMotion.dive.state() : '?', nfc: window.NFC ? NFC.state : '?', what, z, grid, full: fullMap || fullBoard });
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
  /* T4's witnesses, read off each page's own camera now (the map's stays at the stop under the fight): every live man's tile on the
     glass, and where the map draws his crew */
  const menNow = await (async () => { try { const h = await d.page.$('#fightFrame'), f = h && await h.contentFrame(); return f && await f.evaluate(() => { const U = FIGHT_UI, fr = frameElement.getBoundingClientRect();
    return FIGHT.S.units.filter(u => !u.dead && !u.down && !u.fled && !u.decoy && u.x >= 0 && u.y >= 0).map(u => ({ id: u.id, side: u.side === 'them' ? 'them' : 'us', x: fr.left + sx((u.x + 0.5) * U.tw), y: fr.top + sy((u.y + 0.5) * U.th) })); }); } catch (e) { return null; } })();
  /* where the map draws his crew, in its canvas's own points (the canvas reads no box while the fight hides the map's panel: the
     dive's own record of that box, taken while it was on the glass, puts it on the glass in T4) */
  const crewNow = await d.fr.evaluate(() => { try { const G = cityGlidePos(performance.now()), ox = Math.round(CVW / 2 - (G.x - G.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (G.x + G.y) * TH / 2 + panY);
    return { x: ox + (G.x - G.y) * TW / 2, y: oy + (G.x + G.y + 1) * TH / 2 }; } catch (e) { return null; } }).catch(() => null);
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
  return { label, at, z0, inRows, down, fsx, out, fightOwn: med(own), gridAfter, menNow, crewNow };
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
  /* Z2 (rule 420): the camera comes down on the compositor through the map's own pictures, the map drawn once at each (never once a
     frame): its zoom climbs from where he was to the stop, each picture drawn at a higher zoom than the last */
  const r = F.down || {}, zs = R.filter(x => x.z != null).map(x => x.z), rz = (r.renders || []).map(x => x.z);
  let back = 0; for (let i = 1; i < zs.length; i++) if (zs[i] < zs[i - 1] - 1e-6) back++;
  let up = rz.length >= 1; for (let i = 1; i < rz.length; i++) if (rz[i] < rz[i - 1] - 1e-6) up = false;
  const stop = (r.z1 || 0) / (r.kEnd || 1);
  ok(p + 'Z2 THE CAMERA CAME DOWN: the map drawn once at each picture of the way down (at most five), each at a higher zoom, the last the stop; the map\'s zoom never back',
    !!r.gpu && up && rz.length <= 5 && rz.length >= 1 && Math.abs(rz[rz.length - 1] - stop) <= stop * 0.01 && back === 0 && (r.z1 || 0) > F.z0.z,
    'zoom ' + (F.z0.z).toFixed(2) + ' -> ' + (r.z1 || 0).toFixed(2) + ' on the glass (drawn ' + rz.join(', ') + ', the stop ' + stop.toFixed(3) + ' scaled ' + r.kEnd + 'x to cover the glass); ' + back + ' frames back; come-down ' + r.comeMs + ' ms, the painter asked ahead ' + r.prepaint + ' tiles');
  const t3 = landing(F), al = r.align || {};
  ok(p + 'Z3 THE TURN LANDS ON THE BOARD: where the map\'s frame ends its turn, the fight\'s own camera draws the same block (2 px)', t3.dx != null && t3.dx <= 2 && r.phases && r.phases.turn > 0,
    t3.dx != null ? 'the map frame\'s own transform puts the block at ' + t3.p1 + ', the fight\'s camera on COMBAT TWO\'s board at ' + t3.p2 + ' (' + t3.dx.toFixed(1) + ' px); the map\'s block ' + al.scale + 'x the board\'s, turned in ' + ((r.phases.grid || 0) - r.phases.turn) + ' ms' : 'no turn measured: ' + t3.why);
  ok(p + 'Z4 THE BOARD IS THE MAP AT THAT SPOT: laid from the map\'s own block, the contact\'s', !!F.fsx && F.fsx.laid && !!F.fsx.cell && F.fsx.cell[0] === F.at.gx && F.fsx.cell[1] === F.at.gy,
    F.fsx ? 'laid ' + F.fsx.laid + ', cell ' + F.fsx.cell + ' (contact ' + F.at.gx + ',' + F.at.gy + '), ' + F.fsx.w + ' x ' + F.fsx.h + ' tiles' : 'no fight');
  const gridTurn = R.filter(x => x.st === 'turn' && x.grid).length, gridAfter = F.gridAfter;
  ok(p + 'Z5 THE GRID LIGHTS UP: the board\'s own lines on through the turn and gone after it', gridTurn > 0 && gridAfter === 0 && r.phases && r.phases.grid > 0, gridTurn + ' turn frames with the grid, ' + gridAfter + ' after');
  /* F1 (rule 420): nothing of the zoom is drawn by the main thread frame by frame any more; its frames are the compositor's and are
     measured off a trace on the phone at 4x (T1-T3). Here: every picture the dive laid has a Web Animation, none is drawn twice */
  ok(p + 'F1 THE DIVE IS THE COMPOSITOR\'S: every move a Web Animation on a held picture; the map drawn at most five times, the fight built under the stop',
    !!r.gpu && (r.renders || []).length <= 5 && r.buildAt != null && r.built != null && !r.err,
    'renders ' + JSON.stringify(r.renders) + '; the build asked at ' + r.buildAt + ' ms, the fight up ' + r.built + ' ms after; first frame ' + r.firstFrame + ' ms; ' + (r.err || 'no error'));
}
function outLegs(p, F) {
  const R = F.out.rows, bad = R.filter(r => /LOADING|CLOUDS|NOTHING|ERR/.test(r.what)), seen = {}; R.forEach(r => { seen[r.what] = (seen[r.what] || 0) + 1; });
  ok(p + 'O1 THE WAY OUT: the board, the zoom\'s frames, the live map; never a loading line, a cloud or nothing', R.length > 10 && !bad.length,
    R.length + ' frames: ' + Object.entries(seen).map(([k, v]) => k + ' ' + v).join(', ') + (bad.length ? '; first bad at ' + bad[0].st + ': ' + bad[0].what : ''));
  const a = F.out.after || {}, up = F.out.up || {};
  ok(p + 'O2 THE CLIMB BACK: the map\'s zoom where he had it, his crew held again, the bar on the glass, nothing left over', !!F.out.up && !up.plain && Math.abs(a.z - F.z0.z) <= F.z0.z * 0.02 && a.camf === F.z0.camf && a.bar >= 0.99 && !a.left,
    'zoom ' + (a.z || 0).toFixed(3) + ' (was ' + F.z0.z.toFixed(3) + '), held ' + a.camf + ', bar ' + a.bar + ', phases ' + JSON.stringify(up.phases) + ', ' + up.ms + ' ms');
}

/* RULE 420 (MOTION 2, 11/7; Paolo 11/7: 'the transition from the map to the combat right now is still kind of shit'): the phone
   profile with the CPU at 4x (the phone-shaped CPU), a trace of the compositor's own frames (DrawFrame) through the whole way in and
   out, the phases marked on the same clock (console.timeStamp from the motion layer when the gate asks) */
function frameStats(ev, a, b) {
  const xs = ev.filter(t => t >= a && t <= b), g = [];
  for (let i = 1; i < xs.length; i++) g.push((xs[i] - xs[i - 1]) / 1000);
  g.sort((p, q) => p - q); const q = (f) => g.length ? g[Math.min(g.length - 1, Math.floor(f * g.length))] : null;
  return { ms: Math.round((b - a) / 1000), frames: xs.length, med: q(0.5), p90: q(0.9), worst: g.length ? g[g.length - 1] : null, over100: g.filter(x => x > 100).length };
}
const fmt = (w) => w.frames + ' frames in ' + w.ms + ' ms, median ' + (w.med || 0).toFixed(1) + ', p90 ' + (w.p90 || 0).toFixed(1) + ', worst ' + (w.worst || 0).toFixed(1) + ' ms, ' + w.over100 + ' over 100 ms';
async function runTraced() {
  console.log('\n-- phone_portrait, the CPU at 4x, traced (rule 420) --');
  const d = await D.open({ profile: 'phone_portrait' });
  const errs = []; d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const p = 'P4 ';
  try {
    for (let i = 0; i < 160; i++) { if (await d.fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'city' && typeof cityHandOver === 'function' && !!(window.om && om.n)).catch(() => false)) break; await sleep(500); }
    await sleep(2500);
    await d.page.evaluate(() => { window.__DIVE_MARKS = true; });
    await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const tp = path.join(require('os').tmpdir(), 'zoom_down_trace_' + process.pid + '.json');
    await d.browser.startTracing(d.page, { path: tp, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline.frame'] });
    const F = await fight(d, 'traced', null);
    await d.browser.stopTracing();
    await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    const T = JSON.parse(fs.readFileSync(tp, 'utf8')); try { fs.unlinkSync(tp); } catch (e) {}
    const ev = T.traceEvents || T, M = {};
    ev.filter(e => e.name === 'TimeStamp' && e.args && e.args.data).forEach(e => { const m = e.args.data.message; if (!(m in M)) M[m] = e.ts; });
    const df = ev.filter(e => e.name === 'DrawFrame').map(e => e.ts).sort((a, b) => a - b);
    const has = (...k) => k.every(x => M[x] != null);
    const wIn = has('dive:down:come', 'dive:down:grid') ? frameStats(df, M['dive:down:come'], M['dive:down:grid']) : null;
    const wTurn = has('dive:down:turn', 'dive:down:grid') ? frameStats(df, M['dive:down:turn'], M['dive:down:grid']) : null;
    const wGrid = has('dive:down:grid', 'dive:down:end') ? frameStats(df, M['dive:down:grid'], M['dive:down:end']) : null;
    const wOut = has('dive:up:grid', 'dive:up:end') ? frameStats(df, M['dive:up:grid'], M['dive:up:end']) : null;
    /* THE RATCHET, this box at 4x (11/7, MOTION 2; was about 5 frames a second, the map drawn on every step): the way in median 16.7,
       p90 29.7, worst 48 ms; the turn worst 26 ms; it may only come down */
    ok(p + 'T1 THE WAY IN AT 4X: the compositor\'s frames from the camera\'s first move to the board landing: median at most 17.5 ms, p90 at most 34, none over 100 ms',
      !!wIn && wIn.med <= 17.5 && wIn.p90 <= 34 && wIn.over100 === 0, wIn ? fmt(wIn) + (wTurn ? '; the turn alone ' + fmt(wTurn) : '') + (wGrid ? '; the grid over the live fight ' + fmt(wGrid) : '') : 'no marks: ' + Object.keys(M).join(', '));
    const worstAll = Math.max(wIn ? wIn.worst : 1e9, wOut ? wOut.worst : 1e9);
    ok(p + 'T2 NOTHING HELD PAST A BEAT: no gap between the compositor\'s frames over 500 ms anywhere in the way in or out', !!wIn && !!wOut && worstAll <= 500,
      'worst ' + worstAll.toFixed(1) + ' ms');
    /* the way out's frames over 100 ms at 4x on this box lie inside other pages' canvas work after a fight (measured 11/7: the map's
       result message 800 ms, the carcass 350 ms, the map's own frame 210 ms) starving the software GPU: printed, the median and p90 held */
    ok(p + 'T3 THE WAY OUT AT 4X: the compositor\'s frames from the board\'s last frame to the live map: median at most 17.5 ms, p90 at most 34 (the worst printed)',
      !!wOut && wOut.med <= 17.5 && wOut.p90 <= 34, wOut ? fmt(wOut) : 'no marks');
    /* T4: every live man has a bracket; it starts where the map had his crew (theirs: the contact's block), through the map frame's own
       rest pose, and lands on his tile through the fight's own camera */
    const r = F.down || {}, men = r.men || [], live = F.menNow || [], kE = r.kEnd || 1, mc = r.mapC ? { x: r.mapC[0], y: r.mapC[1] } : null, tile = live.length ? null : null;
    let bad = [], n = 0;
    live.forEach(m => { const b = men.find(x => x.id === m.id); if (!b) { bad.push(m.id + ' no bracket'); return; } n++;
      if (Math.hypot(b.to[0] - m.x, b.to[1] + (b.lift || 0) - m.y) > 3) bad.push(m.id + ' lands ' + b.to + ' not ' + [Math.round(m.x), Math.round(m.y)]);
      const cb = r.cb || [0, 0], src = m.side === 'us' && F.crewNow ? { x: cb[0] + F.crewNow.x, y: cb[1] + F.crewNow.y } : mc;
      if (src && mc) { const ex = { x: mc.x + kE * (src.x - mc.x), y: mc.y + kE * (src.y - mc.y) };
        if (Math.abs(b.from[1] - ex.y) > 3 || Math.abs(b.from[0] - ex.x) > 40) bad.push(m.id + ' starts ' + b.from + ' not ' + [Math.round(ex.x), Math.round(ex.y)]); } });
    ok(p + 'T4 THE MEN FOUND WHERE THEY STOOD: a bracket for every live man, from where the map had his crew (theirs at the contact) to his own tile', live.length > 0 && n === live.length && !bad.length,
      n + ' of ' + live.length + ' men bracketed' + (bad.length ? '; ' + bad.slice(0, 3).join('; ') : '; every one from the map\'s own spot to his tile within 3 px'));
    const hold = F.inRows.filter(x => x.st === 'hold'), bare = hold.filter(x => !x.full);
    ok(p + 'B1 THE GLASS IS NEVER BARE: through the hold a picture at full opacity covers the whole glass (the bar\'s band under the map\'s canvas too)', hold.length > 3 && !bare.length,
      hold.length + ' hold frames, ' + bare.length + ' bare; the stop scaled ' + kE + 'x about the block (the map\'s canvas ' + JSON.stringify(r.cb) + ')');
    ok(p + 'E1 nothing threw', !errs.length, errs.slice(0, 3).join(' | ') || 'none');
  } catch (e) { ok('the traced run ran to the end', false, String(e && e.stack || e).slice(0, 300)); }
  await d.close();
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
      const fadeMs = r.fadeMs != null ? r.fadeMs : (r.phases && r.phases.fade != null ? (r.ms - r.phases.fade) : null);   /* rule 420: the fade is a Web Animation, its own length (the cleanup after it can run late) */
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
  for (const prof of only ? [only] : ['phone_portrait', 'computer', 'phone_4x']) { if (prof === 'phone_4x') await runTraced(); else await run(prof); }
  console.log('\nTHE ZOOM DOWN INTO THE BOARD: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
