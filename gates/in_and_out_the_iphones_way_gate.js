#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE READS THE BROWSER'S MEMORY THROUGH EVERY STEP, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py).
   ============================================================================
   IN AND OUT THE IPHONE'S WAY (PLUMBER 8, 11/27/26; VAMILY rule 484(a) AMENDED, Paolo 11/27: 'combat keeps crashing, like when I get
   into combat and then when I finish it, it's insane'; ask row 761, with COMBAT FIVE; rule 441).
   THE IPHONE'S COUNT: Safari kills a page on far less memory than this box's Chromium and counts every canvas's pixels against the
   page until the canvas is emptied or collected. So nothing is collected by force here: every 300 ms through a fight from the map
   (the map, the way in, the fight, the spoils, the way out, the map again) it counts every canvas alive in every page (made in code or
   written in the page; width x height x 4), every ImageBitmap, every decoded picture.
   MEASURED (records/BOHEMIA_PLUMBER_IN_AND_OUT_THE_IPHONES_WAY_11_27_26.md): after a fight the map still held 263 to 308 MB of canvas,
   the zoom-down's layers (78 to 120 MB), the fight page's written-in canvases, the map's two photographs of the glass for its fight
   zoom (20 MB), none emptied, all waiting on a collector.
   NOW (__AN_IPHONE_COUNTS_EVERY_CANVAS_UNTIL_IT_IS_EMPTIED__, with COMBAT FIVE's __THE_DIVE_FITS_AN_IPHONE__ in the dive): the shell empties the fight page's written-in canvases as it closes it (its own
   let-go already empties what it made in code); the map empties its zoom's photographs as the zoom ends.
     I1 the zoom-down's canvases emptied once it is over: at most 12 MB of them alive back on the map, nothing collected (COMBAT FIVE's
        __THE_DIVE_FITS_AN_IPHONE__ empties them in the dive's own file, 11/27; this checks what is alive, whoever empties it)
     I2 the fight page's written-in canvases emptied as it closes (__FIGHT_PAGE_EMPTIED grows), the map's zoom photographs (__FZ_LET_GO)
     I3 back on the map after each fight, nothing collected, the canvases alive at most 170 MB (117 to 127 measured; the old way 212 to 316)
     I4 the most alive at any step in or out (canvases + bitmaps + pictures, nothing collected) at most 1250 MB (956 to 1144 measured;
        a ratchet, only down); the most of each step printed, and the bitmaps by page: they are the most of what is left (the fight's
        sheets and block pictures, COMBAT FIVE; the map's people and idle sheets, CHARACTER 2 and WORLD 13: ask rows)
     P1 PLANT the old way (__DIVE_KEEPS_KEPT, __DIVE_FULL_PIXELS, __FIGHT_KEEPS_ITS_PAGE, __FZ_KEEPS_ITS_SNAPS), one fight: I3 turns red
   The demo upright, the CPU slowed 4x. About 6 minutes.
   ============================================================================ */
'use strict';
const path = require('path'), { execSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const REST_MB = 170, MOST_MB = 1250;
const REG = "(function(){ var T = window.top; if (window === T) { T.__R = { cv: [], im: [], bm: [] }; T.__radd = function (k, e, w) { T.__R[k].push({ r: new WeakRef(e), w: w }); }; }"
  + " var who = function () { var st = ''; try { st = String(new Error().stack || '').split('\\n').slice(3, 5).map(function (l) { return l.trim().replace(/^at /, '').replace(/\\(?(https?|file):[^ )]*\\//, '(').replace(/:\\d+\\)?$/, ')'); }).join(' < ').slice(0, 100); } catch (x) {} return String(location.pathname).split('/').pop() + ' | ' + st; };"
  + " var ce = Document.prototype.createElement; Document.prototype.createElement = function (n) { var e = ce.apply(this, arguments); try { var t = String(n).toLowerCase(); if (t === 'canvas') T.__radd('cv', e, who()); else if (t === 'img') T.__radd('im', e, who()); } catch (x) {} return e; };"
  + " try { var I0 = window.Image; var I1 = function (a, b) { var e = new I0(a, b); try { T.__radd('im', e, who()); } catch (x) {} return e; }; I1.prototype = I0.prototype; window.Image = I1; } catch (x) {}"
  + " try { var cib = window.createImageBitmap; if (cib) window.createImageBitmap = function () { var st = ''; try { st = String(new Error().stack || '').split('\\n').slice(2, 4).map(function (l) { return l.trim().replace(/^at /, '').replace(/\\(?(https?|file):[^ )]*\\//, '(').replace(/:\\d+\\)?$/, ')'); }).join(' < ').slice(0, 110); } catch (x) {} return cib.apply(window, arguments).then(function (b) { try { T.__radd('bm', b, who() + ' | ' + st); } catch (x) {} return b; }); }; } catch (x) {}"
  + " })();";
const SAMPLE = () => {
  const T = window, R = T.__R; if (!R) return null;
  const cs = new Set(), is = new Set(), by = {};
  const walk = (w) => { try { const d = w.document; d.querySelectorAll('canvas').forEach(c => cs.add(c)); d.querySelectorAll('img').forEach(i => is.add(i)); for (let i = 0; i < w.frames.length; i++) walk(w.frames[i]); } catch (e) {} };
  walk(T);
  R.cv = R.cv.filter(x => { const e = x.r.deref(); if (e) { cs.add(e); e.__w = e.__w || x.w; } return !!e; });
  R.im = R.im.filter(x => { const e = x.r.deref(); if (e) { is.add(e); e.__w = e.__w || x.w; } return !!e; });
  R.bm = R.bm.filter(x => !!x.r.deref());
  let cv = 0, im = 0, bm = 0;
  cs.forEach(c => { const px = (c.width | 0) * (c.height | 0); cv += px; const k = (c.__w || ((c.ownerDocument && String(c.ownerDocument.location.pathname).split('/').pop()) + ' | in the page' + (c.id ? ' #' + c.id : '')) || '?'); by[k] = (by[k] || 0) + px; });
  is.forEach(i => { if (i.complete && i.naturalWidth) im += i.naturalWidth * i.naturalHeight; });
  const bby = {}; R.bm.forEach(x => { const b = x.r.deref(); if (b && b.width) { bm += b.width * b.height; bby[x.w] = bby[x.w] || [0, 0, '']; bby[x.w][0] += b.width * b.height; bby[x.w][1]++; if (!bby[x.w][2]) bby[x.w][2] = b.width + 'x' + b.height; } });
  T.__BBY = bby;
  const MB = (px) => Math.round(px * 4 / 1048576);
  const byMB = {}; Object.keys(by).forEach(k => { const m = MB(by[k]); if (m) byMB[k] = m; });
  return { cv: MB(cv), im: MB(im), bm: MB(bm), by: byMB };
};
function ren() { try { let r = 0; execSync('ps -eo rss,args --no-headers', { encoding: 'utf8', maxBuffer: 64e6 }).split('\n').forEach(l => { const m = l.trim().match(/^(\d+)\s+(.*)$/); if (m && /chrom/i.test(m[2]) && /--type=renderer/.test(m[2])) r += +m[1]; }); return Math.round(r / 1024); } catch (e) { return null; } }

async function trip(n, arm, label) {
  const d = await D.open({ profile: 'phone_portrait', door: 180000, engage: true, pages: true, gpu: true, throttle: 4, arm: REG + (arm || '') });
  const p = d.page, fr = d.fr, M = (fn, a) => p.evaluate(fn, a);
  let phase = 'map', run = true; const peak = {}, rows = [];
  const sampler = (async () => { while (run) { try { const s = await M(SAMPLE); if (s) { const P = peak[phase] = peak[phase] || { cv: 0, im: 0, bm: 0, sum: 0, ren: 0 };
        P.cv = Math.max(P.cv, s.cv); P.im = Math.max(P.im, s.im); P.bm = Math.max(P.bm, s.bm); P.sum = Math.max(P.sum, s.cv + s.im + s.bm); P.ren = Math.max(P.ren, ren() || 0); } } catch (e) {} await sleep(300); } })();
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(200); } return null; };
  const fightFrame = async () => { const h = await p.$('#fightFrame'); const c = h && await h.contentFrame(); return c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false) ? c : null; };
  const counts = () => M(() => { let fz = 0; try { fz = document.getElementById('cityFrame').contentWindow.__FZ_LET_GO | 0; } catch (e) {} return { page: window.__FIGHT_PAGE_EMPTIED | 0, fz }; });
  try {
    await sleep(3000); await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await sleep(3000);
    for (let k = 1; k <= n; k++) {
      phase = 'map'; await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} }); await sleep(1500);
      const c0 = await counts();
      phase = 'in';
      await fr.evaluate(() => { const pm = partyMath('job', { skulls: 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
        cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why: 'party:iphone', at: { gx: city.x + 2, gy: city.y + 1 }, __deal: 424242 }); });
      const f = await waitFor(fightFrame, 120000); if (!f) { rows.push({ err: 'fight ' + k + ' never came' }); break; }
      await waitFor(() => M(() => !window.NFC || NFC.state === 'off'), 20000);
      phase = 'fight'; await sleep(2000);
      await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} });
      phase = 'spoils'; await waitFor(() => M(() => !!(window.SPOILS && SPOILS.frame) || !document.getElementById('fightFrame')), 60000); await sleep(1200);
      phase = 'out';
      await M(() => { try { if (window.SPOILS && SPOILS.frame && typeof spoilsLeave === 'function') spoilsLeave(); else if (typeof nfHome === 'function') nfHome(); } catch (e) {} });
      await waitFor(() => M(() => !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on') && (!window.BohemiaMotion || BohemiaMotion.dive.state() === 'off')), 90000);
      /* the emptying waits until no dive plays and the page is idle (emptying mid-dive stalled a frame), so the count is taken 4 s on */
      phase = 'back'; await sleep(4000);
      const s = await M(SAMPLE), c1 = await counts();
      const dive = s ? Object.keys(s.by).filter(k => /^BOHEMIA_DEMO\.html \| .*bohemia_motion\.js/.test(k)).reduce((q, k) => q + s.by[k], 0) : null;
      rows.push({ rest: s ? s.cv : null, by: s ? s.by : {}, dive, d: { page: c1.page - c0.page, fz: c1.fz - c0.fz } });
      console.log('  ' + label + ' fight ' + k + ': back on the map ' + (s ? s.cv + ' MB of canvas, ' + s.bm + ' MB of bitmaps, ' + s.im + ' MB of pictures' : '?') + '; the zoom-down\'s canvases alive ' + rows[rows.length - 1].dive + ' MB; emptied: the fight page ' + rows[rows.length - 1].d.page + ', the map\'s zoom ' + rows[rows.length - 1].d.fz + (s ? '; by page and maker: ' + Object.entries(s.by).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([k, v]) => v + ' ' + k.replace(/^BOHEMIA_/, '').slice(0, 70)).join(', ') : ''));
    }
  } finally { run = false; await sampler; try { await d.close(); } catch (e) {} }
  rows.peak = peak; return rows;
}

(async () => {
  const a = process.argv.slice(2);
  if (!a.includes('--plant-only')) {
    const R = await trip(2, '', 'now');
    const good = R.filter(r => !r.err);
    ok('the same road fight entered from the map and left twice on the slowed phone (CPU 4x)', good.length === 2, (R.filter(r => r.err)[0] || {}).err || good.length + ' fights');
    ok('I1 the zoom-down\'s canvases emptied once it is over: at most 12 MB of them alive back on the map, nothing collected, every fight (the old way 78 to 120)', good.length > 0 && good.every(r => r.dive != null && r.dive <= 12), good.map(r => r.dive + ' MB').join(', '));
    ok('I2 the fight page\'s written-in canvases emptied as it closed, and the map\'s zoom photographs, every fight', good.length > 0 && good.every(r => r.d.page > 0 && r.d.fz > 0), good.map(r => 'page ' + r.d.page + ', zoom ' + r.d.fz).join('; '));
    ok('I3 back on the map after each fight, nothing collected, at most ' + REST_MB + ' MB of canvas alive (the old way 263 to 308)', good.length > 0 && good.every(r => r.rest != null && r.rest <= REST_MB), good.map(r => r.rest + ' MB').join(', '));
    const P = R.peak, most = Object.keys(P).reduce((q, k) => Math.max(q, P[k].sum), 0);
    Object.keys(P).forEach(k => console.log('  (the most of ' + k.padEnd(6) + ': canvases ' + P[k].cv + ' MB, bitmaps ' + P[k].bm + ' MB, pictures ' + P[k].im + ' MB, all ' + P[k].sum + ' MB; the renderer ' + P[k].ren + ' MB)'));
    ok('I4 THE RATCHET: the most alive at any step in or out at most ' + MOST_MB + ' MB (canvases + bitmaps + pictures, nothing collected; only down)', most > 0 && most <= MOST_MB, most + ' MB');
  }
  if (!a.includes('--no-plant')) {
    const Q = await trip(1, 'window.__DIVE_KEEPS_KEPT = true; window.__DIVE_FULL_PIXELS = true; window.__FIGHT_KEEPS_ITS_PAGE = true; window.__FZ_KEEPS_ITS_SNAPS = true;', 'the old way');
    const g = Q.filter(r => !r.err);
    ok('P1 PLANT the old way (nothing emptied): back on the map past I3\'s ' + REST_MB + ' MB (I3 bites)', g.length === 1 && g[0].rest > REST_MB, g.map(r => r.rest + ' MB').join(', ') || 'the fight never came');
  }
  console.log('\nIN AND OUT THE IPHONE\'S WAY: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('\nIN AND OUT THE IPHONE\'S WAY: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); });
