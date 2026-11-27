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
     I2 the fight page's written-in canvases and the spoils page's emptied as they close (__FIGHT_PAGE_EMPTIED, __SPOILS_PAGE_EMPTIED),
        the map's zoom photographs (__FZ_LET_GO)
     I3 back on the map after each fight, nothing collected, the canvases alive at most 170 MB (117 to 127 measured; the old way 212 to 316)
     I4 THE IPHONE BUDGET: the most alive at any step in or out (canvases + bitmaps + pictures, nothing collected) at most 768 MB
        (671 to 677 measured 11/27, after 11/27x, CHARACTER 3's packed people and COMBAT FIVE's half-width ground; it was 1,027 to 1,100); the most of each step printed, and the bitmaps by page: they are the most of what is left (the fight's
        sheets and block pictures, COMBAT FIVE; the map's people and idle sheets, CHARACTER 2 and WORLD 13: ask rows 768, 769)
     I5 THE IPHONE BUDGET: the canvases alive at any step at most 256 MB (205 to 219 measured)
     I6 the map lets its sheet bitmaps go under each fight (closed at the landing) and has every one back after (__THE_MAP_LETS_ITS_SHEETS_GO_UNDER_THE_FIGHT__)
     P1 PLANT the old way (__DIVE_KEEPS_KEPT, __DIVE_FULL_PIXELS, __FIGHT_KEEPS_ITS_PAGE, __FZ_KEEPS_ITS_SNAPS, __MAP_SHEETS_KEEP), one fight:
        I1, I2 and I6 all red
   The demo upright, the CPU slowed 4x. About 6 minutes.
   ============================================================================ */
'use strict';
const path = require('path'), { execSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const REST_MB = 170;
/* THE IPHONE BUDGET, FROM THE RESEARCH (records/BOHEMIA_PLUMBER_IN_AND_OUT_THE_IPHONES_WAY_11_27_26.md): WebKit capped the canvases of a
   page at a share of the phone's memory (256 MB reported on an iPad on iOS 12, 288 MB on an iPhone X, 384 MB on iOS 15; the cap was
   taken out of WebKit in June 2023 because pages were killed for memory first); an iPhone's tab process is killed past a soft limit
   of about 1.5 GB (WebKit's engineers; lower on phones with less memory). The budget: canvases at most 256 MB at every step, and
   every live picture (canvases, bitmaps, decoded pictures) at most 768 MB, half the tab's limit, the rest for the code, the heap, the
   page and the sound. PRINTED against what is measured, with the owners of the gap; I4 and I5 judge it. */
const BUDGET_CANVAS_MB = 256, BUDGET_ALL_MB = 768;
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
  const counts = () => M(() => { let fz = 0, sh = null; try { const cw = document.getElementById('cityFrame').contentWindow; fz = cw.__FZ_LET_GO | 0; const H = cw.MAP_SHEETS_HELD; if (H) { const last = H.last || [], live = last.filter(S => S && S.state === 2).length, all = last.length; sh = { rel: H.rel, again: H.again, on: H.on, live, all }; } } catch (e) {} return { page: window.__FIGHT_PAGE_EMPTIED | 0, spoils: window.__SPOILS_PAGE_EMPTIED | 0, fz, sh }; });
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
      /* every sheet the map let go is asked again as the way up plays: wait for the last to land (10 s at most), then count */
      await waitFor(() => M(() => { try { const cw = document.getElementById('cityFrame').contentWindow, H = cw.MAP_SHEETS_HELD; return !H || !H.last || H.last.every(S => !S || S.state === 2 || S.state === 3); } catch (e) { return true; } }), 10000);
      const s = await M(SAMPLE), c1 = await counts();
      const dive = s ? Object.keys(s.by).filter(k => /^BOHEMIA_DEMO\.html \| .*bohemia_motion\.js/.test(k)).reduce((q, k) => q + s.by[k], 0) : null;
      rows.push({ rest: s ? s.cv : null, by: s ? s.by : {}, dive, d: { page: c1.page - c0.page, spoils: c1.spoils - c0.spoils, fz: c1.fz - c0.fz, rel: c1.sh && c0.sh ? c1.sh.rel - c0.sh.rel : -1, again: c1.sh && c0.sh ? c1.sh.again - c0.sh.again : -1, held: c1.sh ? c1.sh.on : null, live: c1.sh ? c1.sh.live + ' of ' + c1.sh.all : '?' } });
      console.log('  ' + label + ' fight ' + k + ': back on the map ' + (s ? s.cv + ' MB of canvas, ' + s.bm + ' MB of bitmaps, ' + s.im + ' MB of pictures' : '?') + '; the zoom-down\'s canvases alive ' + rows[rows.length - 1].dive + ' MB; emptied: the spoils page ' + rows[rows.length - 1].d.spoils + ', the fight page ' + rows[rows.length - 1].d.page + ', the map\'s zoom ' + rows[rows.length - 1].d.fz + '; the map\'s sheets let go ' + rows[rows.length - 1].d.rel + ', asked again ' + rows[rows.length - 1].d.again + ', back ' + rows[rows.length - 1].d.live + (s ? '; by page and maker: ' + Object.entries(s.by).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([k, v]) => v + ' ' + k.replace(/^BOHEMIA_/, '').slice(0, 70)).join(', ') : ''));
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
    ok('I2 the fight page\'s and the spoils page\'s canvases emptied as they closed, and the map\'s zoom photographs, every fight', good.length > 0 && good.every(r => r.d.page > 0 && r.d.spoils > 0 && r.d.fz > 0), good.map(r => 'page ' + r.d.page + ', spoils ' + r.d.spoils + ', zoom ' + r.d.fz).join('; '));
    ok('I3 back on the map after each fight, nothing collected, at most ' + REST_MB + ' MB of canvas alive (the old way 263 to 308)', good.length > 0 && good.every(r => r.rest != null && r.rest <= REST_MB), good.map(r => r.rest + ' MB').join(', '));
    ok('I6 the map let its sheet bitmaps go under each fight and had them back after (none held, every sheet it let go back)', good.length > 0 && good.every(r => r.d.rel > 0 && r.d.again === r.d.rel && r.d.held === false && /^(\d+) of \1$/.test(r.d.live)), good.map(r => 'let go ' + r.d.rel + ', again ' + r.d.again + ', back ' + r.d.live).join('; '));
    const P = R.peak, most = Object.keys(P).reduce((q, k) => Math.max(q, P[k].sum), 0);
    Object.keys(P).forEach(k => console.log('  (the most of ' + k.padEnd(6) + ': canvases ' + P[k].cv + ' MB, bitmaps ' + P[k].bm + ' MB, pictures ' + P[k].im + ' MB, all ' + P[k].sum + ' MB; the renderer ' + P[k].ren + ' MB)'));
    ok('I4 THE IPHONE BUDGET: every live picture at any step in or out at most ' + BUDGET_ALL_MB + ' MB (canvases + bitmaps + pictures, nothing collected; 671 to 677 measured 11/27, it was 1,027 to 1,100)', most > 0 && most <= BUDGET_ALL_MB, most + ' MB');
    const mostCv = Object.keys(P).reduce((q, k) => Math.max(q, P[k].cv), 0), mostBm = Object.keys(P).reduce((q, k) => Math.max(q, P[k].bm), 0);
    ok('I5 THE IPHONE BUDGET: the canvases alive at any step in or out at most ' + BUDGET_CANVAS_MB + ' MB (205 to 219 measured 11/27; it was 259 to 399)', mostCv > 0 && mostCv <= BUDGET_CANVAS_MB, mostCv + ' MB');
    console.log('  THE IPHONE BUDGET: canvases ' + mostCv + ' of ' + BUDGET_CANVAS_MB + ' MB' + (mostCv > BUDGET_CANVAS_MB ? ' (over by ' + (mostCv - BUDGET_CANVAS_MB) + ')' : ' (inside)')
      + '; every live picture ' + most + ' of ' + BUDGET_ALL_MB + ' MB' + (most > BUDGET_ALL_MB ? ' (over by ' + (most - BUDGET_ALL_MB) + ', ' + mostBm + ' MB of it bitmaps: the fight\'s, ask row 768 COMBAT FIVE; the map\'s 233 MB, ask row 769 CHARACTER 2 and WORLD 13)' : ' (inside)'));
  }
  if (!a.includes('--no-plant')) {
    const Q = await trip(1, 'window.__DIVE_KEEPS_KEPT = true; window.__DIVE_FULL_PIXELS = true; window.__FIGHT_KEEPS_ITS_PAGE = true; window.__FZ_KEEPS_ITS_SNAPS = true; window.__MAP_SHEETS_KEEP = true;', 'the old way');
    const g = Q.filter(r => !r.err);
    ok('P1 PLANT the old way (nothing emptied, nothing let go): I1, I2 and I6 all turn red (the zoom-down\'s canvases past 12 MB, no page emptied, no sheet let go)', g.length === 1 && g[0].dive > 12 && g[0].d.page === 0 && g[0].d.spoils === 0 && g[0].d.fz === 0 && g[0].d.rel <= 0,
      g.map(r => 'the zoom-down\'s ' + r.dive + ' MB, pages emptied ' + r.d.page + '/' + r.d.spoils + '/' + r.d.fz + ', sheets let go ' + r.d.rel + '; back on the map ' + r.rest + ' MB').join(', ') || 'the fight never came');
  }
  console.log('\nIN AND OUT THE IPHONE\'S WAY: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('\nIN AND OUT THE IPHONE\'S WAY: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); });
