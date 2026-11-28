#!/usr/bin/env node
/* ==========================================================================
   HIS PLACE: ONE CAMERA, AND IT BUILDS  (11/28/26, ask row 788; built by ARMORY 3 in HOME BASE's own code, rule 495)

   PAOLO 11/28: 'one camera angle from that angle from now on... one intimate security camera perspective... I clicked, but I couldn't
   build anything... I could just like move things and then the plots aren't even on the correct part of the land'.
   His words and what was measured: records/BOHEMIA_PAOLO_HIS_PLACE_ONE_CAMERA_AND_IT_BUILDS_11_28_26.md.
   The build: records/BOHEMIA_HOME_BASE_ONE_CAMERA_AND_IT_BUILDS_11_28_26.md.

   DATA (records/target/home_settlement/manifest.json ground_px, written by tools/bohemia_home_settlement_pipeline_11_3_26.py ground):
     G1  every plot's ground in every camera and shape is the plot's own ground seen through that camera's lens (recomputed here from
         the manifest's cams and lots, within half a pixel), and it stands at the foot of the plot's own tap box (Blender's render):
         PLANTED: a plot's ground moved 12 px reads red.
     G2  MEASURED, the old test answered wrong: points on the plots' own ground fed to the old tallest-box test (tap_px, the smallest
         box) answer another plot or nothing, and the walk between the two middle front plots answers nothing.
   ON THE DEMO, a phone upright and sideways, a fresh place planted on day 2, EVERYTHING BY A REAL TAP:
     O1  ONE CAMERA: forty seconds on the old cut's clock and eight on the old patrol's, CAM 1, 1x, the frame where it was.
         PLANTED: a cut to CAM 2 reads red.
     O2  THE PLOTS ON THE LAND: all twelve empty plots painted on the footage, open (he can build), each plot's middle inside the
         footage on the glass.
     O3  A TAP IS THE PLOT: a real tap on each plot's middle that the glass shows (the feed under the finger) opens BUILD for that plot;
         ten or more of the twelve are on the glass.
     O4  THE DESK FITS THE PLOT: on a front plot every middle and back piece is greyed 'GOES FURTHER BACK', the front ones open.
     O5  IT STANDS WHERE HE TAPPED: the water tank bought on a middle plot stands on that plot, taped off for the night; the training yard
         bought on a front plot stands on that one.
     O6  THE NEXT MORNING: both stand where he put them, built, no tape.
     O7  MOVE ON THE GROUND: MOVE on the tank lights exactly the plots it can go to, on their ground; a real tap on one moves it there.
     O8  THE CAMERA NEVER PUSHES IN: with the desk open on a plot, and with a thing's sheet open, the whole picture at 1x or smaller
         (it steps back above the sheet).
   Run: node gates/one_camera_it_builds_gate.js [--data] [--only phone_portrait]
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && !g ? '  [' + String(x).slice(0, 600) + ']' : '')); };
const done = () => { console.log('ONE CAMERA, AND IT BUILDS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };

/* ---------------- DATA ---------------- */
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/home_settlement/manifest.json'), 'utf8'));
console.log('DATA');
/* the camera, as the pipeline shoots it (an equisolid fisheye on a 36 mm sensor fitted to the longer side), from the manifest's own cams */
function lens(cn, sh, p) {
  const C = M.cams[cn], [W, H] = M.sizes[sh], loc = C.loc, at = C.at[sh];
  let f = [0, 1, 2].map(i => at[i] - loc[i]); const nf = Math.hypot(...f); f = f.map(x => x / nf);
  const d = f[2]; let up = [-d * f[0], -d * f[1], 1 - d * f[2]]; const nu = Math.hypot(...up); up = up.map(x => x / nu);
  const rt = [f[1] * up[2] - f[2] * up[1], f[2] * up[0] - f[0] * up[2], f[0] * up[1] - f[1] * up[0]];
  const v = [0, 1, 2].map(i => p[i] - loc[i]), dot = a => a[0] * v[0] + a[1] * v[1] + a[2] * v[2];
  const cx = dot(rt), cy = dot(up), cz = dot(f), th = Math.acos(Math.max(-1, Math.min(1, cz / Math.hypot(cx, cy, cz)))), ph = Math.atan2(cy, cx);
  const r = 2 * C.f[sh] * Math.sin(th / 2), k = Math.max(W, H) / 36;
  return [W / 2 + r * Math.cos(ph) * k, H / 2 - r * Math.sin(ph) * k];
}
function groundOf(cn, sh, L, per) {
  const [x0, y0, x1, y1] = L.box_m, z = L.z, out = [];
  for (const [a, b] of [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]])
    for (let t = 0; t < per; t++) { const u = t / per; out.push(lens(cn, sh, [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, z])); }
  return out;
}
const inPoly = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
const mid = P => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
function groundTrue(G) {
  const bad = [];
  for (const key of Object.keys(M.tap_px)) { const [cn, sh] = key.split('_'), per = (G[key] && G[key]['1'] ? G[key]['1'].length : 16) / 4;
    for (const L of M.lots) { const P = G[key] && G[key][String(L.n)], Q = groundOf(cn, sh, L, per), T = M.tap_px[key][String(L.n)];
      if (!P || P.length !== Q.length) { bad.push(key + ':' + L.n + ' missing'); continue; }
      const off = Math.max(...P.map((p, i) => Math.hypot(p[0] - Q[i][0], p[1] - Q[i][1])));
      const ys = P.map(p => p[1]), feet = Math.abs(Math.max(...ys) - T[3]);   /* the plot's near edge is the foot of its tallest box */
      if (off > 0.5 || feet > 6) bad.push(key + ':' + L.n + ' off ' + off.toFixed(2) + ' feet ' + feet.toFixed(1)); } }
  return bad;
}
const g1 = groundTrue(M.ground_px || {});
ok('G1 every plot\'s ground, every camera and shape (' + Object.keys(M.ground_px || {}).length + ' x ' + M.lots.length + '), is the plot seen through that camera\'s lens and stands at the foot of its tap box', !!M.ground_px && g1.length === 0, JSON.stringify(g1.slice(0, 8)));
const moved = JSON.parse(JSON.stringify(M.ground_px || {})); if (moved['1_tall']) moved['1_tall']['6'] = moved['1_tall']['6'].map(p => [p[0] + 12, p[1]]);
ok('G1 planted: plot 6 moved 12 px reads red on the leg above', groundTrue(moved).length > 0);
/* the old test: every plot's tallest box, the smallest under the point */
const oldAt = (key, x, y) => { let best = null, ba = 1e9; for (const n of Object.keys(M.tap_px[key])) { const b = M.tap_px[key][n]; if (x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3]) { const a = (b[2] - b[0]) * (b[3] - b[1]); if (a < ba) { ba = a; best = +n; } } } return best; };
const G1t = (M.ground_px || {})['1_tall'] || {}, wrong = {}; let pts = 0, miss = 0;
for (const n of Object.keys(G1t)) { const P = G1t[n], xs = P.map(p => p[0]), ys = P.map(p => p[1]);
  for (let i = 1; i < 8; i++) for (let j = 1; j < 8; j++) { const x = Math.min(...xs) + (Math.max(...xs) - Math.min(...xs)) * i / 8, y = Math.min(...ys) + (Math.max(...ys) - Math.min(...ys)) * j / 8;
    if (x < 0 || x > M.sizes.tall[0] || !inPoly(P, x, y)) continue; pts++; const o = oldAt('1_tall', x, y); if (o !== +n) { miss++; wrong[n] = (wrong[n] | 0) + 1; } } }
const P2 = G1t['2'], P3 = G1t['3'], street = P2 && P3 ? [(Math.max(...P2.map(p => p[0])) + Math.min(...P3.map(p => p[0]))) / 2, (mid(P2)[1] + mid(P3)[1]) / 2] : null;
const streetOld = street ? oldAt('1_tall', street[0], street[1]) : 'x';
ok('G2 MEASURED, the old tallest-box test on CAM 1 upright: ' + miss + ' of ' + pts + ' points on the plots\' own ground answered another plot or nothing (by plot ' + JSON.stringify(wrong) + '); the walk between plots 2 and 3 answered ' + streetOld + '. The ground test answers each of them its own plot.',
   pts > 100 && miss > 0 && streetOld === null, JSON.stringify({ miss, pts, wrong, street, streetOld }));
if (process.argv.includes('--data')) done();

/* ---------------- ON THE DEMO ---------------- */
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !arg('--only') || p === arg('--only'));
(async () => {
  for (const prof of PROFS) {
    console.log('ON THE DEMO, ' + prof);
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr;
    for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data())).catch(() => false)) break; await P.waitForTimeout(250); }
    const openHis = async () => {
      await F.evaluate(() => { try { loopClose(); } catch (e) {} const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
      let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on) && !!window.__HOME_PLOTS_DRAWN(); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
      if (fr) { for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => { const a = document.getElementById('arrive'); return !(a && a.classList.contains('on')); }).catch(() => false)) break; await P.waitForTimeout(250); } await P.waitForTimeout(2500); }
      return fr; };
    await F.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = 2; const x0 = city.x, y0 = city.y; let at = null;
      for (let r = 2; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && ch.g.ok) { at = [ch.x, ch.y]; break; } }
      BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = Math.max(w.tape | 0, 30); wagonPut(w); });
    let fr = await openHis();
    if (!fr) { ok('his place opened on the demo', false); await d.close(); continue; }
    let fb = await (await fr.frameElement()).boundingBox();
    const plot = n => fr.evaluate(n => window.__HOME_PLOT_AT(n), n);
    const view = () => fr.evaluate(() => { const v = window.__HOME_FEED_VIEW() || { z: 1, X: 0, Y: 0 }; return { cam: window.__HOME_FEED.cam, z: +(+v.z).toFixed(2), X: Math.round(v.X), Y: Math.round(v.Y) }; });
    const closeS = async () => { const c = await fr.evaluate(() => { const x = document.getElementById('close'); if (!x || !document.getElementById('sheet').classList.contains('on')) return null; const r = x.getBoundingClientRect(); return r.width > 1 ? [r.left + r.width / 2, r.top + r.height / 2] : null; }); if (c) { await P.touchscreen.tap(fb.x + c[0], fb.y + c[1]); await P.waitForTimeout(800); } };
    const tapPlot = async n => { const p = await plot(n); if (!p) return null; await P.touchscreen.tap(fb.x + p.x, fb.y + p.y); await P.waitForTimeout(1400); return p; };
    const row = q => fr.evaluate(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, dis: !!e.disabled, em: ((e.querySelector('em') || {}).textContent || '').trim() }; }, q);

    /* O1 one camera */
    const v0 = await view(); const o1 = [v0];
    await fr.evaluate(() => window.__HOME_FEED_AGE(21000)); await P.waitForTimeout(1500); o1.push(await view());
    await fr.evaluate(() => window.__HOME_FEED_AGE(21000)); await P.waitForTimeout(1500); o1.push(await view());
    await fr.evaluate(() => window.__HOME_FEED_TOUR_AT(8000)); await P.waitForTimeout(3800); o1.push(await view());
    const still = vs => vs.every(v => v.cam === 1 && v.z === 1 && v.X === vs[0].X && v.Y === vs[0].Y);
    ok('O1 ONE CAMERA: on the old cut\'s clock twice and the old patrol\'s once, ' + o1.map(v => 'CAM ' + v.cam + ' ' + v.z + 'x').join(', ') + ', the frame where it was', still(o1), JSON.stringify(o1));
    ok('O1 planted: a cut to CAM 2 reads red on the leg above', !still(o1.concat([Object.assign({}, v0, { cam: 2 })])));
    /* O2 the plots on the land */
    const dr = await fr.evaluate(() => window.__HOME_PLOTS_DRAWN());
    const plots = []; for (let n = 1; n <= 12; n++) plots.push(Object.assign({ n }, await plot(n)));
    const feedBox = await fr.evaluate(() => { const r = document.getElementById('hfeed').getBoundingClientRect(), v = window.__HOME_FEED_VIEW(); return v ? [r.left + v.X, r.top + v.Y, r.left + v.X + v.W, r.top + v.Y + v.H] : [r.left, r.top, r.right, r.bottom]; });
    const inFeed = plots.filter(p => p.x >= feedBox[0] && p.x <= feedBox[2] && p.y >= feedBox[1] && p.y <= feedBox[3]);
    ok('O2 THE PLOTS ON THE LAND: ' + dr.plots.length + ' empty plots painted on the footage, open ' + dr.open + ', on CAM ' + dr.cam + '; ' + inFeed.length + ' of 12 plot middles inside the footage', dr.plots.length === 12 && dr.open && dr.cam === 1 && inFeed.length === 12, JSON.stringify({ dr, feedBox, plots: plots.map(p => [p.n, Math.round(p.x), Math.round(p.y)]) }));
    /* O3 a tap is the plot */
    const o3 = [];
    for (const p of plots) { const vis = await fr.evaluate(p => { const e = document.elementFromPoint(p.x, p.y); return !!e && e.id === 'hfeed'; }, p);
      if (!vis) { o3.push({ n: p.n, vis: false }); continue; }
      await tapPlot(p.n); const o = await fr.evaluate(() => ({ open: BohemiaSettlement.state.open, lot: (window.__HOME_PLOTS_DRAWN() || {}).lot }));
      o3.push({ n: p.n, vis: true, open: o.open, lot: o.lot }); await closeS(); }
    const seen3 = o3.filter(o => o.vis), right3 = seen3.filter(o => o.open === 'build' && o.lot === o.n);
    ok('O3 A TAP IS THE PLOT: ' + right3.length + ' of the ' + seen3.length + ' plots the glass shows opened BUILD for that plot (' + o3.map(o => o.n + (o.vis ? (o.open === 'build' && o.lot === o.n ? '' : '!' + o.open + '@' + o.lot) : ' under') ).join(' ') + ')',
       seen3.length >= 10 && right3.length === seen3.length, JSON.stringify(o3));
    /* O4 the desk fits the plot (a front plot the glass shows) */
    const front = seen3.map(o => o.n).filter(n => n >= 1 && n <= 4)[0] || 2;
    await tapPlot(front);
    const desk4 = await fr.evaluate(() => [...document.querySelectorAll('#sbody .act[data-build], #sbody .act[data-place]')].map(e => ({ id: e.dataset.build || e.dataset.place, dis: !!e.disabled, em: ((e.querySelector('em') || {}).textContent || '').trim() })));
    const z4 = await view();
    const rowOf = id => { const pid = ({ garden: 'garden_bed', tank: 'water_tank', solar: 'solar_panel', roof: 'house_plain', wall: 'wall', shed: 'shed', pump: 'pump', stall: 'stall', yard: 'yard', forge: 'forge', lookout: 'lookout', grinder: 'grinder' })[id]; return pid && M.pieces[pid] ? M.pieces[pid].row : null; };
    const fits4 = desk4.length >= 8 && desk4.every(r => rowOf(r.id) === 'front' ? !(r.dis && /FURTHER BACK|NOT ON THIS/.test(r.em)) : r.dis && r.em === 'GOES FURTHER BACK');
    ok('O4 THE DESK FITS THE PLOT: front plot ' + front + ': open ' + desk4.filter(r => !r.dis).map(r => r.id).join(', ') + '; greyed ' + desk4.filter(r => r.dis).map(r => r.id + ' "' + r.em + '"').slice(0, 3).join(', ') + '...', fits4, JSON.stringify(desk4));
    ok('O8 THE CAMERA NEVER PUSHES IN: the desk open on plot ' + front + ', the whole picture at ' + z4.z + 'x above it', z4.z <= 1 && z4.cam === 1, JSON.stringify(z4));
    /* O5 it stands where he tapped: the yard on the front plot, the tank on a middle plot */
    const yd = await row('#sbody .act[data-place="yard"]'); if (yd && !yd.dis) { await P.touchscreen.tap(fb.x + yd.x, fb.y + yd.y); await P.waitForTimeout(1600); }
    const l5a = await fr.evaluate(() => window.__HOME_LANDED); await closeS();
    const midPlot = seen3.map(o => o.n).filter(n => n >= 5 && n <= 8).sort((a, b) => Math.abs(a - 6.5) - Math.abs(b - 6.5))[0] || 7;
    await tapPlot(midPlot); const tk = await row('#sbody .act[data-build="tank"]'); if (tk && !tk.dis) { await P.touchscreen.tap(fb.x + tk.x, fb.y + tk.y); await P.waitForTimeout(1600); }
    const l5b = await fr.evaluate(() => window.__HOME_LANDED); await closeS(); await P.waitForTimeout(900);
    const dr5 = await fr.evaluate(() => { const d = window.__HOME_PLOTS_DRAWN(), f = window.__HOME_FEED_DRAWN() || {}; return { slots: d.slots, going: (f.going || []).slice() }; });
    const at5 = (id, n) => dr5.slots.indexOf(n + '=' + id + '~') >= 0 && dr5.going.indexOf(n) >= 0;
    ok('O5 IT STANDS WHERE HE TAPPED: the training yard bought on front plot ' + front + ' (' + JSON.stringify(l5a) + '), the water tank on middle plot ' + midPlot + ' (' + JSON.stringify(l5b) + '); on the footage ' + dr5.slots.join(', ') + ', taped off ' + dr5.going.join(','),
       !!l5a && l5a.at === front && !!l5b && l5b.at === midPlot && at5('yard', front) && at5('tank', midPlot), JSON.stringify({ l5a, l5b, dr5 }));
    /* O7 MOVE on the ground (the tank) */
    await tapPlot(midPlot);
    const mvb = await fr.evaluate(() => { const e = [...document.querySelectorAll('#sbody [data-look]')].filter(e => /^MOVE/.test((e.innerText || '').trim()))[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    const z8 = await view();
    ok('O8 a thing\'s sheet open (the tank): the whole picture at ' + z8.z + 'x on CAM ' + z8.cam, z8.z <= 1 && z8.cam === 1, JSON.stringify(z8));
    let o7 = null, moved7 = null;
    if (mvb) { await P.touchscreen.tap(fb.x + mvb.x, fb.y + mvb.y); await P.waitForTimeout(1300);
      o7 = await fr.evaluate(() => ({ mv: window.__HOME_MOVE, drawn: window.__HOME_PLOTS_DRAWN().plots }));
      const to = o7.mv && o7.mv.can.filter(n => seen3.some(o => o.n === n))[0];
      if (to) { await tapPlot(to); moved7 = await fr.evaluate(() => window.__HOME_MOVED); } }
    ok('O7 MOVE ON THE GROUND: the plots the tank can go to ' + (o7 && o7.mv ? o7.mv.can.join(',') : '?') + ' are the plots lit on the ground (' + (o7 ? o7.drawn.join(',') : '?') + '); a real tap on one moved it (' + JSON.stringify(moved7) + ')',
       !!o7 && !!o7.mv && o7.mv.can.slice().sort((a, b) => a - b).join() === o7.drawn.slice().sort((a, b) => a - b).join() && !!moved7 && o7.mv.can.indexOf(moved7.to) >= 0, JSON.stringify({ o7, moved7 }));
    await closeS();
    /* O6 the next morning */
    const tankAt = moved7 ? moved7.to : midPlot;
    await F.evaluate(() => { const bk = lotBookFor(BohemiaBetween.mine()); for (const k in bk.lots) bk.lots[k].done = true; DAY.day = DAY.day + 1; try { lotWake(); } catch (e) {} try { BohemiaHomeMap.morning(); } catch (e) {} });
    fr = await openHis(); fb = fr ? await (await fr.frameElement()).boundingBox() : fb;
    const dr6 = fr ? await fr.evaluate(() => { const d = window.__HOME_PLOTS_DRAWN(), f = window.__HOME_FEED_DRAWN() || {}; return { slots: d.slots, going: (f.going || []).slice() }; }) : null;
    ok('O6 THE NEXT MORNING: ' + (dr6 ? dr6.slots.join(', ') : 'his place did not open') + ' (the yard on ' + front + ', the tank on ' + tankAt + '), standing, nothing taped' + (dr6 && dr6.going.length ? ' (taped ' + dr6.going.join(',') + ')' : ''),
       !!dr6 && dr6.slots.indexOf(tankAt + '=tank') >= 0 && dr6.slots.some(s => s.indexOf(front + '=yard') === 0) && dr6.slots.indexOf(front + '=yard~') < 0, JSON.stringify(dr6));
    await d.close();
  }
  done();
})().catch(e => { console.error(e); ok('the demo ran', false, e && e.message); done(); });
