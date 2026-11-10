#!/usr/bin/env node
/* ============================================================================
   THE FREEZE CENSUS (PLUMBER 8, 11/10/26; rule 441(a)(c): 'no step that freezes over half a second', rule 400).
   ONE WALK THROUGH THE WHOLE DEMO ON A CHEAP PHONE, the way he plays it, and EVERY FREEZE OVER HALF A SECOND named with the step
   it happened in. The phone: 390 x 844 at 3, touch, the CPU slowed 4 times (DevTools' knob), the canvas on a GPU process (gpu: true,
   SwiftShader: a phone draws its canvas off the page's thread; this box's software canvas would charge every pixel to it).
   A FREEZE is a gap between two frames of the top page's clock (requestAnimationFrame; every frame of the game shares that thread),
   so it is what his thumb feels, whatever drew it. Each freeze carries the long tasks inside it and the frame (file) that ran them.
   THE WALK: the town he wakes in, out to the map, the map standing, travelling at the slowest and the fastest speed, the pinch in
   and out, into a town, a shop, an item, the sheet shut, the lot, SEARCH THE LOT (the minigame), out of it, back to the map, camp
   made and broken, a fight's start, AUTO at 1x and at 4x, its end and the spoils, a boss's fight start and end, a home base planted
   and opened, a save, and the game reopened after the tab died (the reload).
   USE: node tools/bohemia_freeze_census.js [--throttle 4] [--cpu] [--json out.json] [--arm 'js'] [--only step,step]
        --cpu  the software canvas (no gpu: true)        --arm  JavaScript armed before every page (a planted fail, an old way)
   It is the measuring half of gates/no_freeze_over_half_a_second_gate.js.
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
/* BOHEMIA_CENSUS_ROOT=<another checkout>: walk THAT tree's demo (its driver serves its files), for a before taken on main itself */
const ROOT = process.env.BOHEMIA_CENSUS_ROOT || path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* the clock: armed before any page script, kept in the TOP page only (one thread, one clock) */
const CLOCK = "(function(){ if (window.top !== window || window.__FZ) return; var F = window.__FZ = { t: [], marks: [], long: [] };"
  + " F.mark = function (n) { F.marks.push([performance.now(), n]); };"
  + " requestAnimationFrame(function tick(t) { F.t.push(t); requestAnimationFrame(tick); });"
  + " try { new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { var a = e.attribution && e.attribution[0];"
  + " F.long.push([e.startTime, e.duration, (a && (a.containerSrc || a.containerName || a.containerId)) || '']); }); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}"
  + " })();";

/* every PNG made of a canvas and every read of its pixels, in every page, kept on the top page's clock with whether the canvas was on
   the CPU (willReadFrequently): where a GPU draws a canvas, either one waits for the GPU to finish all it was given */
const READS = "(function(){ try { var T = window.top, C = HTMLCanvasElement.prototype, X = CanvasRenderingContext2D.prototype, td = C.toDataURL, gi = X.getImageData;"
  + " var put = function (kind, cv, g) { try { var F = T.__FZ; if (!F) return; if (!F.reads) F.reads = []; var a = g && g.getContextAttributes ? g.getContextAttributes() : null;"
  + " F.reads.push([T.performance.now(), kind, a && a.willReadFrequently ? 1 : 0, (cv.width * cv.height) | 0, String(location.pathname).split('/').pop()]); } catch (e) {} };"
  + " C.toDataURL = function () { var g = null; try { g = this.getContext('2d'); } catch (e) {} put('png', this, g); return td.apply(this, arguments); };"
  + " X.getImageData = function () { put('read', this.canvas, this); return gi.apply(this, arguments); }; } catch (e) {} })();";

const FREEZE = 500;

/* every step's frames from the clock: frames a second, worst frame, the freezes over half a second and the long tasks in each */
function census(fz, endAt) {
  const t = fz.t, marks = fz.marks.slice().sort((a, b) => a[0] - b[0]), out = [];
  const bounds = [[0, 'boot (the page opening to the first mark)']].concat(marks);
  for (let i = 0; i < bounds.length; i++) {
    const a = bounds[i][0], b = i + 1 < bounds.length ? bounds[i + 1][0] : endAt;
    const ts = t.filter(x => x >= a && x <= b);
    const gaps = []; for (let k = 1; k < ts.length; k++) gaps.push([ts[k - 1], ts[k] - ts[k - 1]]);
    /* the gap that spans the mark itself belongs to the step that starts at it (the press is what froze it) */
    const prev = t.filter(x => x < a).pop(), first = ts[0];
    if (prev != null && first != null && first - prev > FREEZE) gaps.unshift([prev, first - prev]);
    const rd = (fz.reads || []).filter(r => r[0] >= a && r[0] <= b), gpuReads = rd.filter(r => !r[2]);
    const freezes = gaps.filter(g => g[1] > FREEZE).map(g => ({ at: Math.round(g[0] - a), ms: Math.round(g[1]),
      tasks: fz.long.filter(l => l[0] < g[0] + g[1] && l[0] + l[1] > g[0]).map(l => ({ ms: Math.round(l[1]), frame: String(l[2]).split('/').pop() || 'top' })) }));
    const span = ts.length > 1 ? ts[ts.length - 1] - ts[0] : 0;
    const ds = gaps.map(g => g[1]).sort((p, q) => p - q);
    out.push({ step: bounds[i][1], ms: Math.round(b - a), frames: Math.max(0, ts.length - 1), fps: span ? +(1000 * (ts.length - 1) / span).toFixed(1) : 0,
      p50: ds.length ? +ds[Math.floor(ds.length / 2)].toFixed(1) : null, worst: ds.length ? Math.round(ds[ds.length - 1]) : null,
      over33: ds.filter(x => x > 34).length, reads: rd.length, pngs: rd.filter(r => r[1] === 'png').length, gpuReads: gpuReads.length, gpuPx: gpuReads.reduce((q, r) => q + r[3], 0), freezes });
  }
  return out;
}

async function walk(opts) {
  opts = opts || {};
  const throttle = opts.throttle || 4, only = opts.only || null;
  const base = { profile: 'phone_portrait', door: 180000, engage: true, pages: true, throttle };
  if (!opts.cpu) base.gpu = true;
  const d = await D.open(Object.assign({ arm: CLOCK + READS + (opts.arm || '') }, base));
  const p = d.page, fr = d.fr, M = (fn, a) => p.evaluate(fn, a);
  const steps = [], said = []; let curStep = 'boot';
  /* every page error with the step it came in and where it threw (the page and line), so a red names a place */
  const errAt = (e) => String(e && e.message || e).slice(0, 110) + ' [' + curStep + '] @ ' + String(e && e.stack || '').split('\n').slice(1, 4).map(x => x.trim().replace(/^at /, '').replace(/https?:\/\/[^/]+\//g, '')).join(' < ').slice(0, 220);
  const errs = []; p.on('pageerror', e => errs.push(errAt(e)));
  const log = (s) => { said.push(s); if (!opts.quiet) console.log(s); };
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; };
  const mark = (n) => M(n => window.__FZ && __FZ.mark(n), n);
  /* one step: its mark, its press, its settle; a step that could not be pressed is said, never counted as smooth */
  const step = async (name, press, settle) => {
    if (only && !only.some(o => name.indexOf(o) >= 0)) { try { await press(); } catch (e) {} await sleep(settle || 2500); return true; }
    await mark(name); curStep = name; let ok = true, why = '';
    try { const r = await press(); if (r === false) { ok = false; why = 'not pressed'; } } catch (e) { ok = false; why = String(e && e.message || e).slice(0, 120); }
    await sleep(settle || 2500);
    steps.push({ name, ok, why }); if (!ok) log('  (step ' + name + ': ' + why + ')');
    if (opts.stopAfter && name.indexOf(opts.stopAfter) === 0) { const e = new Error('stop'); e.stop = true; throw e; }
    return ok;
  };
  const tap = (x, y) => p.touchscreen.tap(x, y);
  const phoneBtn = (sel, re) => M(([sel, re]) => { const e = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width > 0 && (!re || new RegExp(re, 'i').test(x.textContent || ''))); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, [sel, re || null]);
  const app = async (a) => { const b = await phoneBtn('#bohphone.on .app[data-app=' + a + ']'); if (!b) return false; await tap(b[0], b[1]); return true; };
  const leave = async () => { const b = await phoneBtn('#bohphone.on .lv, #bohphone.on .app[data-app=leave]'); if (b) { await tap(b[0], b[1]); return true; }
    return fr.evaluate(() => { try { loopClose(); return true; } catch (e) { return false; } }); };
  const townOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block'));
  const quiet = () => fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} try { if (window.MEET && MEET.up && window.MEET_DONE && !/^boss:/.test((MEET.up.msg && MEET.up.msg.why) || '')) MEET_DONE(false); } catch (_e) {} });
  const fightFrame = async () => { const h = await p.$('#fightFrame'); const c = h && await h.contentFrame(); return c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false) ? c : null; };
  const home = async () => { await waitFor(() => M(() => !!(window.SPOILS && SPOILS.frame) || !document.getElementById('fightFrame')), 60000); await sleep(800);
    await M(() => { try { if (window.SPOILS && SPOILS.frame && typeof spoilsLeave === 'function') spoilsLeave(); else if (typeof nfHome === 'function') nfHome(); } catch (e) {} });
    return !!(await waitFor(() => M(() => !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on')), 90000)); };
  const win = (f) => f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} });
  const encounter = (why, boss) => fr.evaluate(([why, boss]) => { const pm = partyMath('job', { skulls: boss ? 3 : 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: boss || 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why, at: { gx: city.x + 2, gy: city.y + 1 } };
    if (boss) { try { const r = BohemiaBosses.data().bosses.filter(b => b.n === boss)[0]; if (r && BohemiaBosses.dress) BohemiaBosses.dress(msg, r); } catch (e) {} }
    return !!cityHandOver(msg); }, [why, boss || null]);
  const out = { throttle, gpu: !opts.cpu, steps, said, errs };
  try {
    out.says = d.says(); out.tappableMs = d.tappableMs();
    /* THE FIRST LOAD: every file the page took before a finger could press, on the wire (gzipped like GitHub Pages) and unpacked */
    out.firstLoad = await M(() => { const all = []; const v = (w, dd) => { if (dd > 4) return; try { all.push(...w.performance.getEntriesByType('resource')); for (let i = 0; i < w.frames.length; i++) v(w.frames[i], dd + 1); } catch (e) {} }; v(window, 0);
      const nav = performance.getEntriesByType('navigation')[0]; return { biggest: all.map(e => [e.name.replace(/^https?:\/\/[^/]+\//, ''), e.transferSize || 0, e.decodedBodySize || 0]).sort((a, b) => b[1] - a[1]).slice(0, 15), files: all.length + 1, wire: all.reduce((a, e) => a + (e.transferSize || 0), 0) + (nav ? nav.transferSize : 0), body: all.reduce((a, e) => a + (e.decodedBodySize || 0), 0) + (nav ? nav.decodedBodySize : 0) }; });
    await waitFor(() => fr.evaluate(() => !!document.getElementById('bmtb')), 20000);
    await sleep(1500);
    const town = await fr.evaluate(() => { const bs = ctBases(); const L = (window.MAP_TOWN_HIT || []).map(t => t.name).filter(n => bs[n]); return L[0] || Object.keys(bs)[0] || null; });
    if (await townOpen()) { await step('the town he wakes in', async () => true, 3000); await step('town > map (his LEAVE)', leave, 3500); }
    await quiet();
    await step('the map, standing', async () => true, 4000);
    const speeds = await fr.evaluate(() => TRAVEL_SPEEDS.filter(n => n > 0));
    const setOut = () => fr.evaluate(() => { try { travelStop(); } catch (e) {} const N = om.n, C = [];
      for (let y = 2; y < N - 2; y += 2) for (let x = 2; x < N - 2; x += 2) { const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd >= 60 && dd <= 130 && cityWalkable(x, y) && !loopTownAt(x, y, 2)) C.push([x, y, dd]); }
      C.sort((p, q) => p[2] - q[2]); for (const c of C.slice(0, 40)) { const r = travelTo(0, 0, [c[0], c[1]]); if (r && TRAVEL && TRAVEL.path && TRAVEL.path.length >= 60) return TRAVEL.path.length; try { travelStop(); } catch (e) {} } return 0; });
    await step('the map travelling, slowest speed (' + speeds[0] + ')', async () => { if (!(await setOut())) return false; await fr.evaluate(n => travelSpeedSet(n), speeds[0]); await quiet(); }, 8000);
    await step('the map travelling, fastest speed (' + speeds[speeds.length - 1] + ')', async () => { if (!(await fr.evaluate(() => !!TRAVEL)) && !(await setOut())) return false; await fr.evaluate(n => travelSpeedSet(n), speeds[speeds.length - 1]); await quiet(); }, 8000);
    await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
    await step('the pinch in, to the street', async () => { for (let i = 0; i < 3; i++) await d.pinchIn(); }, 2000);
    await step('the pinch out, to the far stop', async () => { for (let i = 0; i < 4; i++) await d.pinchOut(); }, 2000);
    await fr.evaluate(() => { try { if (typeof SKY !== 'undefined' && SKY && typeof skyExit === 'function') skyExit(); } catch (e) {} setZoomAt(1); try { camHold(); } catch (e) {} render(); });
    await quiet(); await sleep(1500);
    /* ---- the town ---- */
    out.town = town;
    await step('map > town', () => fr.evaluate(n => { const bs = ctBases(); loopOpenTown({ name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }); return true; }, town), 1500);
    const sfH = await fr.waitForSelector('#settleFrame', { timeout: 30000 }).catch(() => null), sf = sfH && await sfH.contentFrame();
    if (sf) await waitFor(() => sf.evaluate(() => BohemiaSettlement.ready() && !!BohemiaSettlement.state.place), 30000);
    await sleep(2000);
    const sbox = async () => M(() => { const b = BohemiaMotion.box(document.getElementById('cityFrame').contentWindow.LOOP.frame); return [b.x, b.y]; });
    const tapWhere = async (k) => { if (!sf) return false; const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (!w) return false; const b = await sbox(); await tap(b[0] + w.x, b[1] + w.y); return true; };
    const tapSel = async (sel, re) => { if (!sf) return false; const c = await sf.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].find(x => !re || new RegExp(re, 'i').test(x.textContent || '')); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return r.width ? [r.x + r.width / 2, r.y + r.height / 2] : null; }, [sel, re || null]);
      if (!c) return false; const b = await sbox(); await tap(b[0] + c[0], b[1] + c[1]); return true; };
    const shut = () => sf && sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); });
    let shopK = null; if (sf) for (const k of ['smith', 'arms', 'armourer', 'market', 'stall']) if (await sf.evaluate(k => (BohemiaSettlement.state.stock[k] || []).length > 0 && !!BohemiaSettlement.where(k), k)) { shopK = k; break; }
    await step('town > shop (' + shopK + ')', () => shopK ? tapWhere(shopK) : false, 2500);
    /* the sheet comes up a beat after the tap (the town's arrival tag eats the first one): wait for what a finger presses */
    const seen = (sel, re, ms) => waitFor(() => sf && sf.evaluate(([sel, re]) => [...document.querySelectorAll(sel)].some(x => x.getBoundingClientRect().width > 0 && !x.disabled && (!re || new RegExp(re, 'i').test(x.textContent || ''))), [sel, re || null]), ms || 20000);
    await step('shop > an item', async () => { if (!(await seen('#shelfgrid .slot'))) { if (shopK) await tapWhere(shopK); if (!(await seen('#shelfgrid .slot'))) return false; } return tapSel('#shelfgrid .slot'); }, 2000);
    await step('the sheet shut', () => tapSel('#close'), 2000);
    await shut(); await sleep(500);
    const lot = sf ? await sf.evaluate(() => ['lot', 'scavenge'].find(k => !!BohemiaSettlement.where(k)) || null) : null;
    const SEARCH = 'Search the lot';
    await step('town > the lot', async () => { if (!lot) return false; for (let i = 0; i < 4; i++) { await tapWhere(lot); if (await seen('#sbody .act', SEARCH, 7000)) return true; } return false; }, 1500);
    /* the minigame is its own page in the town's frame (#scavgame): its state is read there */
    const scav = async () => { if (!sf) return null; const h = await sf.$('#scavgame'); const f = h && await h.contentFrame(); return f && await f.evaluate(() => !!(window.SCAV && SCAV.state)).catch(() => false) ? f : null; };
    const scavAt = async () => { const h = sf && await sf.$('#scavgame'); if (!h) return null; const b = await h.boundingBox(); return b ? [b.x, b.y] : null; };
    let scavSt = null;
    await step('SEARCH THE LOT (the minigame opens)', async () => { if (!(await tapSel('#sbody .act', SEARCH))) return false;
      scavSt = await waitFor(async () => { const f = await scav(); if (!f) return null; const st = await f.evaluate(() => SCAV.state()).catch(() => null); return st && ['play', 'empty', 'failed'].includes(st.phase) ? st : null; }, 90000);
      return !!(scavSt && scavSt.phase === 'play'); }, 3000);
    await step('the minigame played (a spot tapped, its dial)', async () => { const f = await scav(), at = await scavAt(); if (!f || !at || !scavSt || !scavSt.spots || !scavSt.spots.length) return false;
      const sp = scavSt.spots.find(q => q.kind !== 'car') || scavSt.spots[0]; await tap(at[0] + sp.px, at[1] + sp.py); await sleep(2500); await tap(at[0] + sp.px, at[1] + sp.py); return true; }, 4000);
    await step('the minigame left', async () => { const f = await scav(); if (!f) return false; const b = await f.evaluate(() => { const l = document.getElementById('leave'); if (!l) return null; const r = l.getBoundingClientRect(); return r.width ? [r.x + r.width / 2, r.y + r.height / 2] : null; }); const at = await scavAt();
      if (b && at) { await tap(at[0] + b[0], at[1] + b[1]); return true; } return f.evaluate(() => { const l = document.getElementById('leave'); if (l) { l.click(); return true; } return false; }); }, 4000);
    await shut(); await sleep(600);
    await step('town > map (his LEAVE)', leave, 3500);
    await quiet(); await sleep(800);
    /* ---- camp ---- */
    await step('map > camp', async () => { if (await app('heal')) return true; const c = await M(() => { const e = BohemiaMotion.find('camp'); const b = e && BohemiaMotion.box(e); return b ? [b.x + b.w / 2, b.y + b.h / 2] : null; }); if (!c) return false; await tap(c[0], c[1]); }, 3500);
    await step('camp > map', async () => { const on = await waitFor(() => fr.evaluate(() => !!(window.__CAMP && __CAMP.on) || !!(window.BohemiaMapCamp && BohemiaMapCamp.on && BohemiaMapCamp.on()) || !!(LOOP.open && LOOP.open.camp)), 12000); if (!on) return false; return leave(); }, 3500);
    await quiet(); await sleep(800);
    /* ---- a fight ---- */
    let f = null;
    await step('a fight starts (the way in)', async () => { if (!(await encounter('party:freeze-census'))) return false; f = await waitFor(fightFrame, 120000); if (!f) return false;
      await waitFor(() => M(() => !window.NFC || NFC.state === 'off'), 15000); return true; }, 2500);
    await step('the fight on AUTO at 1x', async () => { if (!f) return false; await f.evaluate(() => { try { handSpeed(1); } catch (e) {} const b = document.getElementById('bauto'); if (b && !/ON|STOP/i.test(b.textContent)) b.click(); }); }, 12000);
    await step('the fight on AUTO at 4x', async () => { if (!f) return false; await f.evaluate(() => { try { handSpeed(4); } catch (e) {} }); }, 12000);
    await step('the fight ends (won, the spoils)', async () => { if (!f) return false; await win(f); return !!(await waitFor(() => M(() => !!(window.SPOILS && SPOILS.frame) || !document.getElementById('fightFrame')), 60000)); }, 2500);
    await step('the spoils > map', home, 3000);
    await quiet(); await sleep(800);
    /* ---- a boss ---- */
    const bossN = await fr.evaluate(() => { try { return BohemiaBosses.data().bosses[0].n; } catch (e) { return null; } });
    out.boss = bossN; f = null;
    await step('a boss fight starts (' + bossN + ')', async () => { if (!bossN || !(await encounter('boss:' + bossN, bossN))) return false; f = await waitFor(fightFrame, 120000); if (!f) return false;
      await waitFor(() => M(() => !window.NFC || NFC.state === 'off'), 15000); return true; }, 2500);
    await step('the boss fight on AUTO', async () => { if (!f) return false; await f.evaluate(() => { const b = document.getElementById('bauto'); if (b && !/ON|STOP/i.test(b.textContent)) b.click(); }); }, 8000);
    await step('the boss fight ends (won)', async () => { if (!f) return false; await win(f); return !!(await waitFor(() => M(() => !!(window.SPOILS && SPOILS.frame) || !document.getElementById('fightFrame')), 60000)); }, 2500);
    await step('the boss spoils > map', home, 3000);
    await quiet(); await sleep(800);
    /* ---- a home base: planted where he can, then opened ---- */
    /* the spot is found first, outside the clock (a player stands where he plants; the search is this walk's, not the game's) */
    const homeAt = await fr.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = Math.max(2, DAY.day | 0); const x0 = city.x, y0 = city.y;
      for (let r = 1; r < 30; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const g = BohemiaHome.grade(BohemiaHomeMap.probe(x0 + dx, y0 + dy)); if (g && g.ok && cityWalkable(x0 + dx, y0 + dy)) return [x0 + dx, y0 + dy]; }
      return null; }).catch(() => null);
    if (homeAt) { await fr.evaluate(a => { city.x = a[0]; city.y = a[1]; try { render(); } catch (e) {} }, homeAt); await sleep(1500); }
    await step('a home base planted', () => homeAt ? fr.evaluate(() => { const res = BohemiaHomeMap.plant(); try { render(); } catch (e) {} return !!(res && res.ok); }) : false, 3000);
    await step('map > the home base', () => fr.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(); if (!n || !bs[n]) return false; city.x = bs[n].x; city.y = bs[n].y; loopOpenTown({ name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }); return true; }), 4500);
    await step('the home base > map', leave, 3500);
    await quiet(); await sleep(800);
    /* ---- the save, and the game reopened after the tab died ---- */
    out.saveMs = null;
    await step('a save', async () => { out.saveMs = await fr.evaluate(() => { const t = performance.now(); saveNow('freeze-census'); return Math.round(performance.now() - t); }); }, 2500);
    out.kept = await M(() => ({ made: window.__BM_KEPT ? window.__BM_KEPT.made | 0 : null, hits: window.__BM_KEPT ? window.__BM_KEPT.hits | 0 : null, marks: window.__ACT_MARKS_KEPT ? Object.keys(window.__ACT_MARKS_KEPT).length : 0 }));
    out.inkReads = await fr.evaluate(() => (typeof mapInkTop === 'function' && mapInkTop.reads) | 0);
    out.walk = census(await M(() => window.__FZ), await M(() => performance.now()));
    if (opts.noReload) { const e = new Error('stop'); e.stop = true; throw e; }
    let d2 = null;
    try {
      await p.goto('chrome://crash').catch(() => {});
      d2 = await D.open(Object.assign({ again: d }, base));
      curStep = 'the reload'; d2.page.on('pageerror', e => errs.push(errAt(e)));
      await d2.page.evaluate(() => window.__FZ && __FZ.mark('back in the game after the reload'));
      await sleep(5000);
      out.reloadTappableMs = d2.tappableMs();
      out.reload = census(await d2.page.evaluate(() => window.__FZ), await d2.page.evaluate(() => performance.now()));
      out.reload[0].step = 'the reload (the page opening again, a saved game)';
    } catch (e) { out.reloadErr = String(e && e.message || e).slice(0, 160); }
  } catch (e) {
    if (!e || !e.stop) throw e;
    if (!out.walk) out.walk = census(await M(() => window.__FZ), await M(() => performance.now()));
  } finally {
    try { await d.close(); } catch (e) {}
  }
  const all = (out.walk || []).concat(out.reload || []);
  out.freezes = []; all.forEach(s => s.freezes.forEach(z => out.freezes.push(Object.assign({ step: s.step }, z))));
  out.freezes.sort((a, b) => b.ms - a.ms);
  return out;
}

function report(o) {
  const L = [], all = (o.walk || []).concat(o.reload || []);
  L.push('THE FREEZE CENSUS: the demo, phone upright, CPU slowed ' + o.throttle + 'x, canvas ' + (o.gpu ? 'on a GPU process' : 'in software') + '; ' + (o.says || ''));
  if (o.firstLoad) L.push('  first load: ' + o.firstLoad.files + ' files, ' + (o.firstLoad.wire / 1e6).toFixed(2) + ' MB on the wire (gzip), ' + (o.firstLoad.body / 1e6).toFixed(2) + ' MB unpacked; a finger could press at ' + o.tappableMs + ' ms');
  const row = (s) => '  ' + s.step.slice(0, 50).padEnd(50) + String(s.fps).padStart(6) + ' fps  median ' + String(s.p50).padStart(6) + '  worst ' + String(s.worst).padStart(6) + ' ms  ' + String(s.gpuReads).padStart(3) + ' GPU reads ' + String(s.pngs).padStart(3) + ' PNGs  ' + (s.freezes.length ? s.freezes.length + ' FREEZE(S): ' + s.freezes.map(z => z.ms + ' ms').join(', ') : '');
  (o.walk || []).forEach(s => L.push(row(s)));
  (o.reload || []).forEach(s => L.push(row(s)));
  if (o.kept) L.push('  the materials\' pictures: ' + o.kept.made + ' made, ' + o.kept.hits + ' taken kept; the fight\'s marks kept: ' + o.kept.marks + '; the map\'s ink line read ' + o.inkReads + ' times');
  L.push('  the save: ' + o.saveMs + ' ms in one piece; the reload tappable at ' + o.reloadTappableMs + ' ms' + (o.reloadErr ? ' (' + o.reloadErr + ')' : ''));
  L.push('  over the walk: ' + all.reduce((q, x) => q + (x.gpuReads || 0), 0) + ' reads and PNGs from a canvas on the GPU (each a wait for the GPU), ' + all.reduce((q, x) => q + (x.pngs || 0), 0) + ' PNGs made');
  L.push('  ' + o.freezes.length + ' freeze(s) over half a second' + (o.freezes.length ? ', worst first:' : ''));
  o.freezes.forEach(z => L.push('    ' + String(z.ms).padStart(6) + ' ms  ' + z.step + ' (+' + z.at + ' ms)  ' + z.tasks.map(t => t.ms + ' ms in ' + t.frame).join(', ')));
  const miss = o.steps.filter(s => !s.ok); if (miss.length) L.push('  NOT WALKED: ' + miss.map(s => s.name + ' (' + s.why + ')').join('; '));
  if (o.errs.length) L.push('  page errors: ' + o.errs.slice(0, 3).join(' | '));
  return L.join('\n');
}
module.exports = { walk, census, report, CLOCK, READS, FREEZE };

if (require.main === module) {
  const a = process.argv.slice(2), arg = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  (async () => {
    const o = await walk({ throttle: +(arg('--throttle') || 4), cpu: a.includes('--cpu'), arm: arg('--arm') || '', only: arg('--only') ? arg('--only').split(',') : null, quiet: true });
    console.log(report(o));
    if (arg('--json')) fs.writeFileSync(arg('--json'), JSON.stringify(o, null, 1));
    process.exit(0);
  })().catch(e => { console.error(e); process.exit(1); });
}
