#!/usr/bin/env node
/* ============================================================================
   HIS MAP GATE (WORLD TWO [the best of both maps], 10/26, rule 243(c)).

   PAOLO 10/26: 'think about Valheim's map and how Battle Brothers' map is, let's do the best of both worlds... there are
   supposed to be bosses in this game where you're able to alter the map and what's going on in the world around you, that's
   gonna be super important.' Record: records/BOHEMIA_WORLD_TWO_THE_BEST_OF_BOTH_MAPS_10_26_26.md. Code: slices/bohemia_his_map.js.

   THE STRANGER'S GAME (fog: true) on the live demo, phone and computer, through the one driver; a new game, then the same
   game opened again in a new tab (the same storage), the way he reopens the link.
   (1) THE MAP FILLS IN
     F1 the unseen city is not a void and its shape is there: unseen pixels (blocks whose fog is the same three blocks round)
        are neither black nor bright, and their light follows the painting's own light (the same pixels with the fog lifted),
        at the default stop and at the stop where the whole valley fits the glass
     F2 MUTATION: with this file's look off (RUN's dark comes back) the shape is gone: the light no longer follows the painting
     F3 the detail is gone: no colour in the unseen pixels where the painting has colour
     F4 the seen city stays painted: seen pixels are the painting's own
     F5 the whole valley fits one screen at a stop the zoom reaches
     F6 after a trip the new ground is painted; at the closest stop (rule 258) ground he has not seen is still the grey tape
   (2) HIS PINS
     P1 a held finger (the computer: a held button) opens the pin box, never under the phone or the bar, and does not travel
     P2 CAMP lands on the held block and is drawn at the near stop, the default stop and the whole-valley stop
     P3 A WORD: typed on the keyboard, pinned with his word
     P4 a man who dies in a fight gets a cross where the fight was handed over, with his name
     P5 reopened in a new tab: the pins and the cross are where he left them
     P6 holding a pin and TAKE IT OFF takes it off, and it stays off
   (3) THE BOSS IS FOUND
     B1 a new game has the next boss's sign inside what he sees, drawn, and no boss marked yet
     B2 walking to the sign marks the boss on the map: drawn, the static cleared round his place, his place one of the row's
        district kinds (or said to be the fall-back)
   (4) THE BOSS CHANGES THE MAP
     B3 stopping on his place hands a fight through the one door ('boss:<name>'), the fight stands
     B4 every one of theirs down, the fight's own end, LEAVE: he has fallen and his district is different on the glass the next
        time the map is drawn (the row's changes drawn)
     B5 every kind of change the table knows works (lights, a place, a wall down that the walk goes through, the map opened,
        a base changing hands 'by boss'): the other rows dealt by the gate through the same fell()
     B6 the next boss's sign turns up near where he fell
     B7 reopened: the fallen boss, his lights and the open wall are still there
   COST
     C1 a frame with the faint city costs at most 6 ms more than RUN's dark (the middle of six rounds; RUN's own line for a map
        feature), and this file's canvases hold at most 2 MB
     C2 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const W8 = (ms) => new Promise(r => setTimeout(r, ms));

/* in the map's frame: one frame's light at the given blocks (each read as a 5 x 5 patch of the glass, the size an eye reads at
   arm's length on a phone, so one grain of snow is not a block), with this file's look, with RUN's dark, and with the fog lifted.
   Unseen: blocks whose fog is the same three blocks round. Seen: the blocks two and three from him, inside the clear middle of his
   circle (RUN's circle is soft from half its radius). */
const SAMPLE = () => {
  const n = om.n, out = { seen: [], unseen: [] };
  const uni = (x, y, r) => { const s = fogSeen(x, y); for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) if (fogSeen(x + a, y + b) !== s) return null; return s; };
  const cx = cv.getContext('2d'), sc = cv.width / CVW;
  const grab = () => cx.getImageData(0, 0, cv.width, cv.height).data;
  const frames = {};
  render(); frames.his = grab();
  BohemiaHisMap.faint(false); render(); frames.dark = grab(); BohemiaHisMap.faint(true);
  /* the fog lifted RUN's own way for a game from before it (FOG.all): the painting, the towns and the walkers everywhere, and this
     file's own marks still drawn in both frames (FOG.on off is the bench, which also takes them away) */
  FOG.all = true; render(); frames.open = grab(); FOG.all = false; render();
  const L2 = BohemiaHisMap.last(), W = cv.width;
  const patch = (f, gx, gy) => { let r = 0, g = 0, b = 0, c = 0; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { const k = ((gy + j) * W + gx + i) * 4; r += f[k]; g += f[k + 1]; b += f[k + 2]; c++; } return [r / c, g / c, b / c]; };
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const near = Math.max(Math.abs(x - city.x), Math.abs(y - city.y));
    let s;
    if (near >= 2 && near <= 3) s = true; else { s = uni(x, y, 3); if (s !== false) continue; }
    const p = iso(x, y, L2.ox, L2.oy), gx = Math.round(p.sx * sc), gy = Math.round((p.sy + TH * 0.5) * sc);
    if (gx < 6 || gy < 6 || gx >= cv.width - 6 || gy >= cv.height - 6) continue;
    (s ? out.seen : out.unseen).push({ x, y, his: patch(frames.his, gx, gy), dark: patch(frames.dark, gx, gy), open: patch(frames.open, gx, gy) });
  }
  return out;
};
const lum = (c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
const sat = (c) => { const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]); return mx ? (mx - mn) / mx : 0; };
const corr = (a, b) => { const n = a.length; if (n < 3) return 0; const ma = a.reduce((s, v) => s + v, 0) / n, mb = b.reduce((s, v) => s + v, 0) / n;
  let sab = 0, saa = 0, sbb = 0; for (let i = 0; i < n; i++) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; } return saa && sbb ? sab / Math.sqrt(saa * sbb) : 0; };
const mean = (a) => a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0;
const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map(v => (v - m) ** 2))); };
const thin = (a, n) => a.length <= n ? a : a.filter((_, i) => i % Math.ceil(a.length / n) === 0);

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  const d = await open({ profile: prof, fog: true, engage: true });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaHisMap && !!BohemiaHisMap.data()).catch(() => false)) break; }
  /* RUN THREE's start (rule 236): his squad up close, then the closest town's screen; he leaves it the way a player does, a real tap on LEAVE */
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(250); }
  const sfr = page.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
  if (sfr && await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false)) {
    await page.waitForTimeout(1500);
    const lv = await sfr.$('#leave'), bx = lv && await lv.boundingBox();
    if (bx) { if (prof === 'computer') await page.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); else await page.touchscreen.tap(bx.x + bx.width / 2, bx.y + bx.height / 2); }
    await page.waitForTimeout(1500);
  }
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!BohemiaHisMap.state().boss.sign)) break; }
  await page.waitForTimeout(600);
  const st = () => fr.evaluate(() => { const S = BohemiaHisMap.state(); return JSON.parse(JSON.stringify({ at: [city.x, city.y], boss: S.boss, pins: S.pins, crosses: S.crosses, open: S.open, lit: S.lit, places: S.places, fighting: S.fighting, drew: BohemiaHisMap.last().drew })); });
  const settle = async () => { for (let i = 0; i < 120; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) break; } await page.waitForTimeout(800); };
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return r; }, c);
  const frameBox = await (await fr.frameElement()).boundingBox();
  const zb = await fr.evaluate(() => zoomBounds());
  /* the stop where the whole valley fits the glass: the largest zoom at which its four corners are on it */
  const whole = await fr.evaluate(() => { const zb = zoomBounds(); let best = null; const n = om.n;
    for (let z = zb[0]; z <= 1; z *= 1.06) { setZoomAt(z); panX = 0; panY = 0; render(); const L = BohemiaHisMap.last();
      const inside = [[0, 0], [n, 0], [n, n], [0, n]].map(p => iso(p[0], p[1], L.ox, L.oy)).every(p => p.sx >= -2 && p.sx <= CVW + 2 && p.sy >= -2 && p.sy <= CVH + 2);
      if (inside) best = z; else if (best) break; }
    setZoomAt(1); panX = 0; panY = 0; render(); return best; });

  /* ---------- (3) B1 first: the new game's first frame ---------- */
  const SHOTS = process.env.HIS_MAP_SHOTS || null, shot = async (name) => { if (SHOTS) { try { await d.shot(path.join(SHOTS, prof + '_' + name + '.png')); } catch (e) {} } };
  await shot('1_new_game');
  const s0 = await st();
  const signSeen = s0.boss.sign ? await fr.evaluate((s) => fogSeen(s.x, s.y), s0.boss.sign) : false;
  ok('B1 ' + prof + ': the next boss\'s sign is in his first sight and drawn, no boss marked yet', !!s0.boss.sign && signSeen && !!(s0.drew && s0.drew.sign) && !Object.keys(s0.boss.found).length,
     s0.boss.sign ? s0.boss.sign.n + ' (' + s0.boss.sign.kind + ') at ' + s0.boss.sign.x + ',' + s0.boss.sign.y + ', he is at ' + s0.at.join(',') + ', drawn ' + JSON.stringify(s0.drew && s0.drew.sign) : 'no sign');

  /* ---------- (1) the faint city ---------- */
  const faintAt = async (z) => {
    await fr.evaluate((z) => { setZoomAt(z); panX = 0; panY = 0; try { camHold(); } catch (e) {} render(); }, z);
    await page.waitForTimeout(300);
    const r = await fr.evaluate(SAMPLE);
    /* a pixel the fog does not touch (a mountain's name, a place's plate, his pin: drawn over the fog) looks the same in every frame
       and says nothing about the fog: only the unseen pixels RUN's dark actually covers are read */
    const covered = r.unseen.filter(q => Math.abs(lum(q.dark) - lum(q.open)) > 20);
    const u = thin(covered, 600), s = thin(r.seen, 600);
    const uHis = u.map(q => lum(q.his)), uOpen = u.map(q => lum(q.open)), uDark = u.map(q => lum(q.dark));
    const colourful = u.filter(q => sat(q.open) > 0.18);
    /* THE SHAPE ON THE GLASS is the part of the unseen light that follows the painting, in steps of light (0 to 255): how
       closely it follows times how much it varies. A dark that lets 5% through follows closely and varies by nothing. */
    const cH = corr(uHis, uOpen), cD = corr(uDark, uOpen);
    return { n: [u.length, s.length], lum: mean(uHis), corr: cH, shape: cH * sd(uHis), shapeDark: cD * sd(uDark), shapeOpen: sd(uOpen),
      satHis: mean(colourful.map(q => sat(q.his))), satOpen: mean(colourful.map(q => sat(q.open))), satCorr: corr(colourful.map(q => sat(q.his)), colourful.map(q => sat(q.open))), nColour: colourful.length,
      painted: s.length ? s.filter(q => Math.max(Math.abs(q.his[0] - q.open[0]), Math.abs(q.his[1] - q.open[1]), Math.abs(q.his[2] - q.open[2])) <= 10).length / s.length : 0 };
  };
  const fd = await faintAt(1); await shot('2_default_stop');
  const fw = whole ? await faintAt(whole) : null; await shot('3_whole_valley');
  /* at the default stop a block is 18 px and the shape is the city's (6 steps at least); with the whole valley on the glass a block
     is two or three pixels, the region's mountains and roads carry most of it and his crew stands over the valley, so 3 (F2 still
     wants it twice RUN's dark) */
  const shape = (f, min) => f && f.n[0] >= 40 && f.lum >= 18 && f.lum <= 150 && f.shape >= min;
  ok('F1 ' + prof + ': the unseen city is not a void and its shape is there (default stop, whole valley)', shape(fd, 6) && shape(fw, 3),
     [fd, fw].map(f => f ? f.n[0] + ' unseen: light ' + f.lum.toFixed(0) + ', the painting\'s shape on the glass ' + f.shape.toFixed(1) + ' steps (it varies ' + f.shapeOpen.toFixed(1) + ' painted; follows ' + f.corr.toFixed(2) + ')' : 'no stop').join(' | '));
  ok('F2 ' + prof + ': MUTATION: RUN\'s dark back, the shape is gone (under half of this file\'s at both stops)', fd.shapeDark < 3 && fd.shapeDark <= 0.5 * fd.shape && (!fw || fw.shapeDark <= 0.5 * fw.shape),
     'the shape under the dark ' + fd.shapeDark.toFixed(1) + (fw ? ' / ' + fw.shapeDark.toFixed(1) : '') + ' steps, under the tape ' + fd.shape.toFixed(1) + (fw ? ' / ' + fw.shape.toFixed(1) : ''));
  ok('F3 ' + prof + ': the detail is gone: no colour where the painting has colour', fd.nColour >= 10 && fd.satHis <= 0.06 && fd.satHis <= 0.15 * fd.satOpen,
     fd.nColour + ' coloured patches: saturation ' + fd.satOpen.toFixed(2) + ' painted, ' + fd.satHis.toFixed(2) + ' under the static');
  ok('F4 ' + prof + ': the seen city stays painted', fd.n[1] >= 10 && fd.painted >= 0.9, fd.n[1] + ' seen patches, ' + Math.round(fd.painted * 100) + '% the painting\'s own');
  ok('F5 ' + prof + ': the whole valley fits one screen at a stop the zoom reaches', !!whole && whole >= zb[0] && whole <= zb[1], 'zoom ' + (whole ? whole.toFixed(3) : 'none') + ' of ' + zb[0].toFixed(3) + ' to ' + zb[1].toFixed(2));

  /* C1: the cost, at the default stop */
  const cost = await fr.evaluate(() => { setZoomAt(1); render();
    /* six rounds, on and off in turn, ten frames each; the middle of each side (one slow frame from the box is not the game) */
    const time = (on) => { BohemiaHisMap.faint(on); const t0 = performance.now(); for (let i = 0; i < 10; i++) render(); return (performance.now() - t0) / 10; };
    time(true); time(false); const a = [], b = [];
    for (let k = 0; k < 6; k++) { a.push(time(true)); b.push(time(false)); }
    BohemiaHisMap.faint(true);
    const mid = (v) => { v = v.slice().sort((x, y) => x - y); return (v[2] + v[3]) / 2; };
    const z = BohemiaHisMap.size(); return { on: mid(a), off: mid(b), mb: z ? z.bytes / 1048576 : 99, w: z && z.w, h: z && z.h }; });
  ok('C1 ' + prof + ': the faint city costs at most 6 ms a frame over RUN\'s dark (RUN\'s own line for a map feature, THE MAP STANDS TALLER C1), its canvases at most 2 MB', cost.on - cost.off <= 6 && cost.mb <= 2,
     cost.on.toFixed(1) + ' ms against ' + cost.off.toFixed(1) + ' ms; ' + cost.mb.toFixed(2) + ' MB (' + cost.w + ' x ' + cost.h + ')');

  /* ---------- (3) B2: walk to the sign ---------- */
  await go([s0.boss.sign.x, s0.boss.sign.y]); await settle();
  for (let i = 0; i < 10; i++) { const q = await st(); if (Object.keys(q.boss.found).length) break; await page.waitForTimeout(500); }
  await fr.evaluate(() => render());
  await shot('4_boss_marked');
  /* F6: after the trip, the new ground is painted; and at the closest stop (rule 258: RUN takes the pinch down to the street), ground he
     has not seen is still the grey tape, never black, never colour */
  const trip = await fr.evaluate(SAMPLE);
  const tripPainted = trip.seen.length ? trip.seen.filter(q => Math.max(Math.abs(q.his[0] - q.open[0]), Math.abs(q.his[1] - q.open[1]), Math.abs(q.his[2] - q.open[2])) <= 10).length / trip.seen.length : 0;
  const close = await fr.evaluate((SAMPLE_SRC) => {
    const zb = zoomBounds(), n = om.n; let tgt = null, bd = -1;
    for (let y = 4; y < n - 4; y += 2) for (let x = 4; x < n - 4; x += 2) { let far = 99;
      for (let a = -6; a <= 6 && far > 0; a++) for (let b = -6; b <= 6; b++) if (fogSeen(x + a, y + b)) { far = 0; break; }
      if (far && Math.abs(x - city.x) + Math.abs(y - city.y) < 40) { const d = 40 - (Math.abs(x - city.x) + Math.abs(y - city.y)); if (d > bd) { bd = d; tgt = [x, y]; } } }
    if (!tgt) return null;
    try { camLetGo(); } catch (e) {}
    setZoomAt(zb[1]); render();
    for (let k = 0; k < 3; k++) { const L = BohemiaHisMap.last(), p = iso(tgt[0], tgt[1], L.ox, L.oy); panX += CVW / 2 - p.sx; panY += CVH / 2 - (p.sy + TH * 0.5); try { clampPan(); } catch (e) {} render(); }
    const sc = cv.width / CVW, cx = cv.getContext('2d'), L = BohemiaHisMap.last(), p = iso(tgt[0], tgt[1], L.ox, L.oy), gx = Math.round(p.sx * sc), gy = Math.round((p.sy + TH * 0.5) * sc);
    const f = cx.getImageData(Math.max(0, gx - 40), Math.max(0, gy - 40), 80, 80).data; let lum = 0, sat = 0, c = 0;
    for (let i = 0; i < f.length; i += 4) { const r = f[i], g2 = f[i + 1], b = f[i + 2], mx = Math.max(r, g2, b), mn = Math.min(r, g2, b); lum += 0.299 * r + 0.587 * g2 + 0.114 * b; sat += mx ? (mx - mn) / mx : 0; c++; }
    return { tgt, z: zb[1], tw: TW, lum: lum / c, sat: sat / c, onGlass: gx > 40 && gy > 40 && gx < cv.width - 40 && gy < cv.height - 40 };
  });
  await shot('4b_close_end_unseen');
  await fr.evaluate(() => { setZoomAt(1); panX = 0; panY = 0; try { camHold(); } catch (e) {} render(); });
  ok('F6 ' + prof + ': after a trip the new ground is painted; at the closest stop, ground he has not seen is the grey tape', tripPainted >= 0.9 && !!close && close.onGlass && close.lum >= 15 && close.lum <= 150 && close.sat <= 0.06,
     Math.round(tripPainted * 100) + '% of ' + trip.seen.length + ' newly seen patches painted; the closest stop (block ' + (close ? close.tw.toFixed(0) + ' px' : '?') + ') on unseen ground: light ' + (close ? close.lum.toFixed(0) + ', saturation ' + close.sat.toFixed(2) : 'no ground found'));
  const s1 = await st(), bn = s0.boss.sign.n, f = s1.boss.found[bn];
  const row = await fr.evaluate((n) => BohemiaHisMap.data().bosses.filter(b => b.n === n)[0], bn);
  const fogCleared = f ? await fr.evaluate((f) => fogSeen(f.x, f.y), f) : false;
  const drawnB = f && s1.drew && (s1.drew.boss || []).some(b => b.n === bn) || (s1.drew && s1.drew.edge > 0);
  ok('B2 ' + prof + ': walking to the sign marks the boss on the map', !!f && fogCleared && drawnB && (row.district.indexOf(f.dk) >= 0 || f.fallback),
     f ? bn + ' at ' + f.x + ',' + f.y + ' (' + f.dk + (f.fallback ? ', the fall-back' : '') + '), the static cleared ' + fogCleared + ', drawn ' + JSON.stringify(s1.drew.boss || s1.drew.edge) : 'not found');

  /* ---------- (2) his pins: a held finger ---------- */
  const spot = await fr.evaluate(() => { const L = BohemiaHisMap.last();
    for (let r = 2; r < 6; r++) for (let a = -r; a <= r; a++) { const x = city.x + a, y = city.y + r; const p = iso(x, y, L.ox, L.oy); const sy = p.sy + TH * 0.5;
      if (p.sx > 40 && p.sx < CVW - 40 && sy > CVH * 0.35 && sy < CVH - 120) return { x, y, sx: p.sx, sy }; } return null; });
  let held = null;
  if (spot) {
    const px = frameBox.x + spot.sx * frameBox.width / (await fr.evaluate(() => CVW)), py = frameBox.y + spot.sy * frameBox.height / (await fr.evaluate(() => CVH));
    if (prof === 'computer') { await page.mouse.move(px, py); await page.mouse.down(); await page.waitForTimeout(900); await page.mouse.up(); }
    else { await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: px, y: py, id: 1 }] }); await page.waitForTimeout(900); await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
    await page.waitForTimeout(700);
    held = await fr.evaluate(() => ({ menu: window.__HIS_MAP_MENU, moving: !!(TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length), at: [city.x, city.y], hits: BohemiaHisMap.last().menuHits, obs: BohemiaHisMap.last().menuObs }));
  }
  ok('P1 ' + prof + ': a held ' + (prof === 'computer' ? 'button' : 'finger') + ' opens the pin box, never under the phone or the bar, and does not travel', !!held && held.menu && held.menu.open && !held.moving && held.hits === 0,
     held ? 'box at ' + JSON.stringify(held.menu.at) + ', over ' + held.obs + ' corner things by ' + held.hits + ' px, travelling ' + held.moving : 'no spot on the glass');
  const tapIn = async (sel) => { const b = await fr.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel);
    if (!b) return false; if (prof === 'computer') await page.mouse.click(frameBox.x + b[0], frameBox.y + b[1]); else await page.touchscreen.tap(frameBox.x + b[0], frameBox.y + b[1]); await page.waitForTimeout(500); return true; };
  await shot('6_pin_box');
  await tapIn('#hismapmenu button[data-k="camp"]');
  const pinDraw = await fr.evaluate((stops) => { const out = []; for (const z of stops) { setZoomAt(z); panX = 0; panY = 0; render(); out.push(BohemiaHisMap.last().drew.pins | 0); } setZoomAt(1); render(); return out; }, [zb[1], 1, whole || zb[0]]);
  const s2 = await st(), camp = s2.pins.filter(p => p.k === 'camp')[0];
  ok('P2 ' + prof + ': CAMP lands on the held block, drawn at the near stop, the default stop and the whole valley', !!camp && held && held.menu.at && camp.x === held.menu.at[0] && camp.y === held.menu.at[1] && pinDraw.every(n => n >= 1),
     camp ? 'at ' + camp.x + ',' + camp.y + ', drawn ' + pinDraw.join('/') : 'no pin');
  /* P3: a word */
  let word = null;
  if (spot) {
    await fr.evaluate((c) => BohemiaHisMap.menu([c[0] + 1, c[1]], 120, 400), [spot.x, spot.y]);
    await tapIn('#hismapmenu button[data-k="word"]');
    await fr.evaluate(() => { const e = document.getElementById('hismapword'); if (e) e.focus(); });
    await page.keyboard.type('water here'); await page.waitForTimeout(200);
    await tapIn('#hismapmenu button[data-k="wordok"]');
    word = (await st()).pins.filter(p => p.k === 'word')[0];
  }
  ok('P3 ' + prof + ': A WORD, typed, pinned with his word', !!word && word.w === 'WATER HERE', word ? JSON.stringify(word) : 'none');
  /* P4: a man dies in a fight: CAMP's list gets him the way the fight's end gives it, and the fight's end comes home */
  const cross = await fr.evaluate(async () => {
    const at = [city.x, city.y]; window.__LAST_HANDOVER = { why: 'gate', at: performance.now() }; render();
    const name = 'GATE ' + (Date.now() % 1000);
    BohemiaCondition.afterFight([{ name: name, dead: true }], { day: 1 });   /* CAMP's own door, the call the fight's end makes */
    window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: { result: 'win', victory: true, alive: 0, dead: 3 } }, '*');
    await new Promise(r => setTimeout(r, 900)); render();
    return { at, name, crosses: BohemiaHisMap.crosses(), drew: BohemiaHisMap.last().drew.crosses | 0 }; });
  const cr = cross.crosses.filter(c => c.name === cross.name.toUpperCase())[0];
  ok('P4 ' + prof + ': a man who dies gets a cross where the fight was, with his name', !!cr && cr.x === cross.at[0] && cr.y === cross.at[1] && cross.drew >= 1, cr ? JSON.stringify(cr) + ', drawn ' + cross.drew : 'no cross');

  /* ---------- (4) B3: stop on his place ---------- */
  let fightUp = null;
  if (f) {
    await go([f.x, f.y]);
    for (let i = 0; i < 200 && !fightUp; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame');
      if (h) { const ff = await h.contentFrame(); if (ff && await ff.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) fightUp = ff; } }
  }
  const lh = await fr.evaluate(() => window.__LAST_HANDOVER && window.__LAST_HANDOVER.why);
  ok('B3 ' + prof + ': stopping on his place hands his fight through the one door', !!fightUp && lh === 'boss:' + bn, 'the door: ' + lh + ', the fight stands ' + !!fightUp);
  /* B4: every one of theirs down, the fight's own end, LEAVE */
  let before = null;
  if (fightUp) {
    await fightUp.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
    await page.waitForTimeout(800);
    await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); const q = await st(); if (q.boss.fallen[bn]) break; }
    await page.waitForTimeout(1500);
  }
  await fr.evaluate(() => render()); await shot('5_boss_fell');
  const s3 = await st(), down = s3.boss.fallen[bn];
  const end = await fr.evaluate(() => window.__HIS_MAP_LAST_END || null);
  const changed = down ? await fr.evaluate((r) => { render(); const D = BohemiaHisMap.last().drew; return { lit: D.lit | 0, places: D.places | 0, open: D.open | 0, boss: (D.boss || []).filter(b => b.down).length }; }, row) : null;
  const want = Object.keys(row.falls || {});
  const drawnAll = changed && want.every(k => k === 'lights' ? changed.lit > 0 : k === 'place' ? changed.places > 0 : k === 'wall' ? changed.open > 0 : true);
  ok('B4 ' + prof + ': he falls and his district is different on the map the next time it is drawn', !!down && drawnAll && changed.boss >= 1,
     down ? bn + ' fell (' + (down.did || []).join(', ') + '); drawn ' + JSON.stringify(changed) : 'not fallen; the fight said ' + JSON.stringify(end));
  /* B5: every kind of change, the other rows through the same fell() */
  const kinds = await fr.evaluate(() => {
    const D = BohemiaHisMap.data(), S = BohemiaHisMap.state(), res = {};
    const take = (kind) => D.bosses.filter(b => b.falls && b.falls[kind] && !S.boss.fallen[b.n])[0];
    for (const kind of ['wall', 'reveal', 'holds']) {
      const r = take(kind); if (!r) { res[kind] = 'no row'; continue; }
      const at = [city.x, city.y]; let spotB = null;
      for (let rr = 3; rr < 12 && !spotB; rr++) for (let a = -rr; a <= rr && !spotB; a++) for (const b of [-rr, rr]) { if (cityWalkable(at[0] + a, at[1] + b)) { spotB = [at[0] + a, at[1] + b]; break; } }
      S.boss.found[r.n] = { x: spotB[0], y: spotB[1], dk: 'gate', bx: spotB[0], by: spotB[1] };
      const before = { hb: null, towns: Object.keys(ctBases()).filter(n => fogSeen(ctBases()[n].x, ctBases()[n].y)).length };
      const did = BohemiaHisMap.fell(r.n) || [];
      const S2 = BohemiaHisMap.state(), fl = S2.boss.fallen[r.n];
      if (kind === 'wall') { const n = om.n; const k = S2.open[S2.open.length - 1]; res.wall = { did, open: k != null && cityWalkable(k % n, Math.floor(k / n)) }; }
      if (kind === 'reveal') { const bs = ctBases(); res.reveal = { did, towns: Object.keys(bs).filter(n => fogSeen(bs[n].x, bs[n].y)).length, of: Object.keys(bs).length, was: before.towns }; }
      if (kind === 'holds') { res.holds = { did, h: fl.holds, now: fl.holds ? BohemiaHomeBases.heldBy(hbRec(), fl.holds.base, hbRec().act) : null }; }
    }
    return res; });
  const k5 = kinds.wall && kinds.wall.open && kinds.reveal && kinds.reveal.towns === kinds.reveal.of && kinds.holds && kinds.holds.h && kinds.holds.now === 'you';
  ok('B5 ' + prof + ': every kind of change works: a wall down the walk goes through, the map opened, a base changing hands by boss (plus B4\'s lights and place)', !!k5, JSON.stringify(kinds));
  /* B6: the next sign near where he fell */
  for (let i = 0; i < 16; i++) { await fr.evaluate(() => render()); await page.waitForTimeout(500); if ((await st()).boss.sign) break; }
  const s4 = await st();
  const nearFall = s4.boss.sign && down ? Math.max(Math.abs(s4.boss.sign.x - s3.at[0]), Math.abs(s4.boss.sign.y - s3.at[1])) : null;
  ok('B6 ' + prof + ': the next boss\'s sign turns up near where he fell', !!s4.boss.sign && nearFall !== null && nearFall <= 6, s4.boss.sign ? s4.boss.sign.n + ' ' + nearFall + ' blocks from him' : 'no sign');

  /* ---------- P6: hold the pin, TAKE IT OFF ---------- */
  if (camp) {
    await fr.evaluate((c) => BohemiaHisMap.menu([c.x, c.y], 120, 400), camp);
    await tapIn('#hismapmenu button[data-k="remove"]');
  }
  const s5 = await st();
  const gone = camp && !s5.pins.some(p => p.x === camp.x && p.y === camp.y);

  /* ---------- reopened: the same phone, a new tab ---------- */
  const keep = { pins: s5.pins.length, crosses: s5.crosses.length, fallen: Object.keys(s5.boss.fallen).length, open: s5.open.slice(), lit: s5.lit.length };
  const e = await open({ again: d, fog: true });
  for (let i = 0; i < 60; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !!window.BohemiaHisMap && !!BohemiaHisMap.data() && typeof city !== 'undefined').catch(() => false)) break; }
  await e.page.waitForTimeout(2500);
  const r1 = await e.fr.evaluate(() => { render(); const S = BohemiaHisMap.state(), n = om.n; return { pins: S.pins.length, word: S.pins.filter(p => p.k === 'word').map(p => p.w), crosses: S.crosses.length, fallen: Object.keys(S.boss.fallen).length,
    open: S.open.every(k => cityWalkable(k % n, Math.floor(k / n))), lit: S.lit.length, drewLit: BohemiaHisMap.last().drew.lit | 0 }; });
  ok('P5 ' + prof + ': reopened in a new tab, the pins and the cross are where he left them', r1.pins === keep.pins && r1.crosses === keep.crosses && r1.word.indexOf('WATER HERE') >= 0, JSON.stringify({ was: keep, now: r1 }));
  ok('P6 ' + prof + ': TAKE IT OFF takes the pin off and it stays off', !!gone && r1.pins === keep.pins, 'camp gone ' + gone + ', ' + r1.pins + ' pins after the reopen');
  ok('B7 ' + prof + ': reopened, the fallen bosses, the lights and the open wall are still there', r1.fallen === keep.fallen && keep.fallen >= 4 && keep.open.length > 0 && r1.open && r1.lit === keep.lit,
     r1.fallen + ' fallen, ' + keep.open.length + ' blocks of wall down, open ' + r1.open + ', ' + r1.lit + ' lit districts');
  ok('C2 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 2).join(' | '));
  await e.close().catch(() => {});
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait', 'computer'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nHIS MAP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
