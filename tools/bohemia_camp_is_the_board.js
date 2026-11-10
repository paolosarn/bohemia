/* THE CAMP IS THE FIGHT'S BOARD -- the driver (MOTION 3, 11/10/26, rule 442(a) and 441; Paolo voted NO on 11/9l: 'This did not look
   like it was on the combat map'). One fight on the demo as he plays it, then MAKE CAMP on the loot screen, and every number the gate
   and the proof pictures need: the fight's last frame and its camera, the camp's first frame and its camera, both read on the real page.
     const K = require('./tools/bohemia_camp_is_the_board.js');
     const r = await K.oneFight(d, { fam: '^suburb$', end: 'auto' | 'won' })   d = tools/bohemia_drive_the_demo.js open()
       r.fightShot / r.campShot   PNG buffers (the fight's last frame, the camp's first drawn frame)
       r.cam                      the fight's camera at its last frame (zoom, tile size, the board's corner on the glass, a man's height)
       r.camp                     the camp's state at its first frame (its board, its camera, where its men are drawn)
     await K.atRest(d)            the camp by day: who does what where (the board's own grid, walls, bodies, glass)
     await K.same(d, a, b, masks) how alike two frames are on the ground (Pearson, grey, a quarter of a css px; masks in css px)
     await K.breakCamp(d)         the camp broken, back on the map */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);

const settle = (p) => p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url()));
const fightFrameOf = async (p) => { const h = await p.$('#fightFrame'); if (!h) return null; const c = await h.contentFrame(); if (!c) return null; return (await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) ? c : null; };

/* a cell of the map of that district (the most of them, its middle one), off any town */
async function cellOf(fr, re) {
  return fr.evaluate((src) => {
    const R = new RegExp(src, 'i'), N = om.n, cells = {};
    for (let y = 4; y < N - 4; y++) for (let x = 4; x < N - 4; x++) { const t = om.at(x, y), k = t && t.district; if (!k || !R.test(k)) continue;
      let town = false; try { town = townGround(x, y) || townSafeAt(x, y); } catch (e) {} if (town) continue; (cells[k] = cells[k] || []).push([x, y]); }
    const k = Object.keys(cells).sort((a, b) => cells[b].length - cells[a].length)[0]; if (!k) return null;
    const c = cells[k]; return { district: k, cell: c[Math.floor(c.length / 2)], n: c.length };
  }, re);
}
/* the fight's camera, as its own page has it (the gate's read, never the camp's copy) */
const camOf = (ff) => ff.evaluate(() => { const U = window.FIGHT_UI, S = FIGHT.S, fr = window.frameElement ? window.frameElement.getBoundingClientRect() : { left: 0, top: 0 };
  return { z: U.zoom, tw: U.tw, th: U.th, sx0: sx(0), sy0: sy(0), man: manH(), W: innerWidth, H: innerHeight, fx: fr.left, fy: fr.top, w: S.w, h: S.h, board: S.boardDef && S.boardDef.name, family: S.boardDef && S.boardDef.family, sig: window.campBoardSig ? campBoardSig() : null,
    units: S.units.filter(u => !u.fled && !u.ghost).map(u => ({ side: u.side, x: u.x, y: u.y, dead: !!u.dead, main: !!u.main, name: String(u.name || '').toUpperCase() })) }; });

/* THE WATCH (MOTION 3, rule 444(a)): from the MAKE CAMP tap until the camp stands, every tenth of a second on the top page, what the glass
   holds (the fight's page, the board's held picture, the map, the camp's screen and whether its first frame is drawn), the map's clock, and
   the camp's set-up (its pitch); oneFight(d, { watch: true }) also shoots the glass every 150 ms (out.watch.shots) */
const WATCH = function () {
  const W = window.__CAMPWATCH = { s: [], t0: performance.now(), on: true };
  const one = () => { if (!W.on) return; const q = { t: Math.round(performance.now() - W.t0) };
    try { q.fight = !!document.getElementById('fightFrame'); q.spoils = !!(window.SPOILS && SPOILS.frame); } catch (e) {}
    try { q.hold = !!(window.BohemiaMotion && BohemiaMotion.campHold && BohemiaMotion.campHold.on()); q.dive = window.BohemiaMotion ? BohemiaMotion.dive.state() : null; q.busy = window.BohemiaMotion ? BohemiaMotion.busy() : 0; } catch (e) {}
    try { const cw = document.getElementById('cityFrame').contentWindow; q.clock = cw.eval('T.day * 1440 + T.min'); q.campOn = cw.eval('!!CAMP.on'); q.hours = cw.eval('CAMP.hours | 0');
      const f = cw.LOOP && cw.LOOP.frame; q.campShown = !!(f && f.style.display === 'block'); q.campOp = f ? (f.style.opacity === '' ? 1 : +f.style.opacity) : 0;
      const L = f && f.contentWindow && f.contentWindow.BohemiaCampLook; if (L) { q.setting = !!(L.settingUp && L.settingUp()); const st = L.state(); q.open = !!st.open; q.first = !!st.firstFv; q.pitch = st.pitch ? (st.pitch.on ? 'on' : st.pitch.skipped ? 'skipped' : 'done') : null; } } catch (e) { q.err = String(e).slice(0, 60); }
    W.s.push(q); };
  W.iv = setInterval(one, 100); one();
};
async function oneFight(d, o) {
  const p = d.page, fr = d.fr, out = { fam: o.fam, errs: [] };
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
  const at = await cellOf(fr, o.fam); out.at = at; if (!at) { out.err = 'no ' + o.fam + ' on the map'; return out; }
  await p.evaluate(([c, dd]) => { window.nfOpen({ type: 'BOHEMIA_CITY_ENCOUNTER', district: dd, at: { gx: c[0], gy: c[1] }, label: 'the camp is the board', draft: true }); }, [at.cell, at.district]);
  let ff = null; for (let i = 0; i < 300 && !ff; i++) { ff = await fightFrameOf(p); if (!ff) await p.waitForTimeout(200); }
  if (!ff) { out.err = 'the fight never opened'; return out; }
  for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !window.NFC || NFC.state === 'off')) break; await p.waitForTimeout(200); }
  await p.waitForTimeout(1200);
  const { fightPress } = require(path.join(ROOT, 'tools/bohemia_fight_press.js'));
  for (let k = 0; k < 3 && await ff.evaluate(() => FIGHT.S.deploy).catch(() => false); k++) { await fightPress(p, ff, 'bend', { ms: 8000 }).catch(() => {}); await p.waitForTimeout(1500); }   /* his line set: the fight on */
  out.deployed = !(await ff.evaluate(() => FIGHT.S.deploy).catch(() => true));
  let shot = null, cam = null;
  /* a whole fight, AUTO by a real tap, at the fight's own fast-forward ('auto'), or its first rounds ('won': then won where it stands);
     the last frame before it ends is kept */
  if (o.end === 'auto' || o.end === 'won') {
    await ff.evaluate(() => { FIGHT_UI.speed = 4; }); await fightPress(p, ff, 'bauto').catch(() => {});
    const t0 = Date.now();
    while (Date.now() - t0 < (o.autoMs || (o.end === 'won' ? 20000 : 100000))) {
      const st = await ff.evaluate(() => ({ over: FIGHT.S.over, mine: FIGHT.S.units.filter(u => u.side === 'you' && !u.dead).length })).catch(() => ({ over: true }));
      if (st.over || !st.mine) break;
      shot = await p.screenshot(); cam = await camOf(ff).catch(() => cam);
      await p.waitForTimeout(200);
    }
  }
  const res = await ff.evaluate(() => ({ over: FIGHT.S.over, result: FIGHT.S.result, round: FIGHT.S.round })).catch(() => null);
  out.played = res;
  if (!res || !res.over || res.result !== 'won') {   /* the fight won as one that closed in ends: their men fall beside his, its last frame shot */
    await ff.evaluate(() => { const S = FIGHT.S, mine = S.units.filter(u => u.side === 'you' && !u.dead), taken = new Set(S.units.filter(u => !u.dead).map(u => u.x + ',' + u.y));
      const ring = [[1, 0], [1, 1], [1, -1], [0, 1], [0, -1], [-1, 0], [-1, 1], [-1, -1], [2, 0], [2, 1], [2, -1]];
      S.units.filter(u => u.side === 'them' && !u.dead).forEach((u, i) => { const m = mine[i % Math.max(1, mine.length)]; if (!m) return;
        for (const q of ring) { const x = m.x + q[0], y = m.y + q[1]; if (x < 0 || y < 0 || x >= S.w || y >= S.h || taken.has(x + ',' + y)) continue;
          let open = true; try { open = FIGHT._t.passable(x, y) && FIGHT.level(x, y) === FIGHT.level(m.x, m.y); } catch (e) {} if (!open) continue;
          taken.delete(u.x + ',' + u.y); u.x = x; u.y = y; taken.add(x + ',' + y); break; } });
      S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = 0; u.armH = 0; }); });
    await p.waitForTimeout(1200); shot = await p.screenshot(); cam = await camOf(ff);
    await ff.evaluate(() => { const S = FIGHT.S; S.over = true; S.result = 'won'; showOver('won'); });
    out.forced = true;
  }
  out.fightShotPage = shot; out.camLoop = cam;
  const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
  for (let i = 0; i < 120 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await p.waitForTimeout(200);
  await p.waitForTimeout(o.lootMs || 1200);   /* lootMs: he reads the loot first (a player's few seconds on the loot screen) */
  /* the camp held while it is measured: a camp made for mending ends itself the hour his men are whole (CAMP's rule 278(a), the
     game's own; measured: after a fight on AUTO the men were whole in about two seconds of the camp's clock and the camp closed before
     it could be read). The gate reads the camp's look, so the map's campDone is held off for this page (said in the gate) */
  await p.evaluate(() => { try { const w = document.getElementById('cityFrame').contentWindow; w.eval('if (typeof campDone === "function" && !window.__GATE_HELD) { window.__GATE_HELD = campDone; campDone = function () { return false; }; }'); } catch (e) {} }).catch(() => {});
  /* THE FIGHT'S LAST FRAME: the fight's own canvas as it last drew, read the moment MAKE CAMP is pressed (the moment the camp keeps its
     camera), with the camera it was drawn through; the page's own shot from the loop is kept beside it (its camera can still glide
     after a fight's last blow, measured on the Strip) */
  const cvShot = await ff.evaluate(() => { const c = document.getElementById('cv'); return c && c.width ? c.toDataURL('image/png') : null; }).catch(() => null);
  out.cam = await camOf(ff).catch(() => cam);
  out.fightShot = cvShot ? Buffer.from(cvShot.split(',')[1], 'base64') : shot;
  out.fightFromCanvas = !!cvShot;
  let watch = null;
  if (o.watch) { await p.evaluate(WATCH); watch = out.watch = { shots: [], stop: false };
    watch.run = (async () => { const t0 = Date.now(); while (!watch.stop && Date.now() - t0 < 20000) { try { watch.shots.push({ t: Date.now() - t0, png: await p.screenshot() }); } catch (e) {} await p.waitForTimeout(150); } })(); }
  try { await p.frameLocator('#spoilsdoor iframe').locator('#camp').tap({ timeout: 8000 }); out.tapped = true; } catch (e) { out.err = 'no MAKE CAMP on the loot screen'; return out; }
  out.kept = await p.evaluate(() => window.__CAMP_FROM_FIGHT ? { sig: __CAMP_FROM_FIGHT.sig, view: __CAMP_FROM_FIGHT.view || null, dead: __CAMP_FROM_FIGHT.dead } : null).catch(() => null);
  /* the camp's first drawn frame: the camp on, its board in, drawn on the glass */
  const t1 = Date.now();
  let st = null;
  for (let k = 0; k < 400; k++) {
    const sf = settle(p);
    if (sf) st = await sf.evaluate((sig) => { try { const C = BohemiaCampBoard.state(), L = BohemiaCampLook.state(); return { st: C.state, mine: !!(C.board && C.board.sig === sig), fv: C.fv && C.fv.on, drawn: BohemiaCampLook.drawn() && Object.keys(L.drawnAt || {}).length > 0 && !!L.firstFv }; } catch (e) { return null; } }, cam && cam.sig).catch(() => null);
    if (st && st.st === 'in' && st.mine && st.drawn) break;   /* this fight's camp, drawn: never the last camp's board still standing */
    await p.waitForTimeout(100);
  }
  /* the camp screen's own grow (MOTION's) landed: the shot is the camp's first frame at rest on the glass, his men still where they won */
  for (let k = 0; k < 30; k++) { if (!(await p.evaluate(() => { try { return window.BohemiaMotion && BohemiaMotion.busy() > 0; } catch (e) { return false; } }).catch(() => false))) break; await p.waitForTimeout(100); }
  out.campMs = Date.now() - t1;
  out.campShot = await p.screenshot();
  out.why = await p.evaluate(() => { try { const w = document.getElementById('cityFrame').contentWindow, e = (x) => { try { return w.eval(x); } catch (er) { return 'err'; } };
    return { camped: window.SPOILS && SPOILS.camped, mode: e('MODE'), fighting: e('LOOP.fighting'), loop: e('LOOP.frame && LOOP.frame.style.display'), meet: e('!!MEET.up'), meetWho: e('MEET.up && (MEET.up.name || MEET.up.id || true)'), cityfight: !!window.CITYFIGHT, campOn: e('CAMP.on'), at: e('[city.x, city.y]') }; } catch (er) { return String(er); } }).catch(() => null);
  out.camp = await campRead(p);
  if (watch) {   /* the set-up: watched to its end (or tapped through, o.skip), then the hours seen to run */
    const sf0 = settle(p), pitchOf = () => sf0 ? sf0.evaluate(() => { const P = BohemiaCampLook.state().pitch; return P ? (P.on ? 'on' : P.skipped ? 'skipped' : 'done') : null; }).catch(() => null) : null;
    if (o.skip && sf0) { await p.waitForTimeout(o.skipAfter || 600); const box = await p.evaluate(() => { const f = document.getElementById('cityFrame'); const r = f.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * 0.45]; });
      out.skipAt = Date.now(); await p.touchscreen.tap(box[0], box[1]).catch(() => p.mouse.click(box[0], box[1])); }
    for (let k = 0; k < 140; k++) { const ph = await pitchOf(); if (ph && ph !== 'on') break; await p.waitForTimeout(100); }
    out.pitchEnd = Date.now(); await p.waitForTimeout(3500);
    watch.stop = true; await watch.run;
    watch.samples = await p.evaluate(() => { const W = window.__CAMPWATCH; if (!W) return []; W.on = false; clearInterval(W.iv); return W.s; });
  }
  out.on = await p.evaluate(() => { try { const w = document.getElementById('cityFrame').contentWindow; return !!(w.BohemiaMapCamp && w.BohemiaMapCamp.on()); } catch (e) { return false; } }).catch(() => false);
  return out;
}
/* the camp as its own page has it: its board, its camera, where its men stand and are drawn, all on the top glass's css px */
async function campRead(p) {
  const sf = settle(p); if (!sf) return null;
  return sf.evaluate(() => {
    const C = BohemiaCampBoard.state(), L = BohemiaCampLook.state(), F = C.fv, BS = window.BohemiaSettlement, V = BS.campView(), LD = BS.lead(), sc = document.getElementById('scene').getBoundingClientRect();
    let x = 0, y = 0, w = window; try { while (w !== w.top && w.frameElement) { const r = w.frameElement.getBoundingClientRect(); x += r.left; y += r.top; w = w.parent; } } catch (e) {}
    const top = [x + sc.left, y + sc.top];
    const G = BohemiaCampBoard._B.out && BohemiaCampBoard._B.out.grid;
    return { state: C.state, fromFight: C.fromFight, sig: C.board && C.board.sig, wantSig: C.wantSig, board: C.board && C.board.name, dead: C.dead, pitch: C.pitch, fv: F, plates: C.plates,
      view: { s: V.s, ox: V.ox, oy: V.oy, W: V.W, H: V.H, boardKey: V.boardKey, zoom: V.zoom }, top: top, personH: 134, lead: LD ? { x: LD.x, y: LD.y, drawn: LD.drawn || null, look: LD.look } : null,
      drawnAt: L.drawnAt, firstAt: L.firstAt, firstFv: L.firstFv, drawnBy: L.drawnBy, acts: L.acts, spots: L.spots, walls: L.walls, bodies: L.bodies, fire: L.fire, pieces: L.pieces, hour: L.hour, night: L.night, pitchOn: L.pitch, lastFlip: L.lastFlip ? L.lastFlip.n : null, glass: BohemiaCampLook.glass(),
      grid: G ? { w: G.w, h: G.h, ok: G.ok } : null, roof: BohemiaCampBoard._B.fv ? BohemiaCampBoard._B.fv.roof : null,
      anims: (L.acts || []).map(a => { const I = window.BohemiaIdles, now = performance.now(); let r = null; try { r = I && I.activity ? I.activity(a.look, 'camp:' + a.name, now, 0, { act: ({ lie: 'lie', sleep: 'sleep', rest: 'mend', mend: 'repair', tend: 'tend', cook: 'cook', clean: 'clean', loot: 'loot', lean: 'flirt' })[a.act], n: 0, wall: a.act === 'lean' }) : null; } catch (e) {}
        let town = null; try { town = I.town ? !!I.town() : null; } catch (e) {} return { name: a.name, look: a.look, act: a.act, anim: !!r, town: town }; }) };
  });
}
/* the camp by day (the camp's clock runs an hour a beat): morning, then what each man does where */
async function atRest(d) {
  const p = d.page;
  for (let k = 0; k < 160; k++) { const h = await settle(p).evaluate(() => { const L = BohemiaCampLook.state(); return L.night || (L.pitch && L.pitch.on) ? -1 : L.hour; }).catch(() => -1); if (h >= 7 && h <= 11) break; await p.waitForTimeout(150); }
  return campRead(p);
}
/* how alike two frames are on the ground: grey, a quarter of a css px, Pearson over what no mask covers ([x0, y0, x1, y1] css px) */
async function same(d, a, b, masks, W, H) {
  return d.page.evaluate(async ({ a, b, masks, W, H }) => {
    const img = (u) => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = u; });
    const A = await img(a), B2 = await img(b); if (!A || !B2) return null;
    const k = 4, w = Math.round(W / k), h = Math.round(H / k);
    const grey = (im) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.drawImage(im, 0, 0, w, h); const D = g.getImageData(0, 0, w, h).data, o = new Float32Array(w * h); for (let i = 0; i < w * h; i++) o[i] = D[i * 4] * .3 + D[i * 4 + 1] * .59 + D[i * 4 + 2] * .11; return o; };
    const ga = grey(A), gb = grey(B2), use = new Uint8Array(w * h).fill(1);
    masks.forEach(m => { for (let y = Math.max(0, Math.floor(m[1] / k)); y < Math.min(h, Math.ceil(m[3] / k)); y++) for (let x = Math.max(0, Math.floor(m[0] / k)); x < Math.min(w, Math.ceil(m[2] / k)); x++) use[y * w + x] = 0; });
    let n = 0, sa = 0, sb = 0; for (let i = 0; i < w * h; i++) if (use[i]) { n++; sa += ga[i]; sb += gb[i]; }
    if (n < 50) return null; const ma = sa / n, mb = sb / n; let ab = 0, aa = 0, bb = 0;
    for (let i = 0; i < w * h; i++) if (use[i]) { const x = ga[i] - ma, y = gb[i] - mb; ab += x * y; aa += x * x; bb += y * y; }
    return { r: ab / Math.sqrt(aa * bb || 1), n: n, of: w * h };
  }, { a: 'data:image/png;base64,' + a.toString('base64'), b: 'data:image/png;base64,' + b.toString('base64'), masks, W, H });
}
async function breakCamp(d) {
  const p = d.page;
  await p.evaluate(() => { try { const w = document.getElementById('cityFrame').contentWindow; if (w.BohemiaMapCamp && w.BohemiaMapCamp.on()) w.BohemiaMapCamp.break(); } catch (e) {} });
  for (let i = 0; i < 60; i++) { const on = await p.evaluate(() => { try { return document.getElementById('cityFrame').contentWindow.BohemiaMapCamp.on(); } catch (e) { return false; } }); if (!on) break; await p.waitForTimeout(200); }
  await p.waitForTimeout(2500);
}
module.exports = { oneFight, campRead, atRest, same, breakCamp, cellOf, camOf, settle, WATCH };
