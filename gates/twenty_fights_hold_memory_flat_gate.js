#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE READS THE BROWSER'S MEMORY, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   ============================================================================
   TWENTY FIGHTS HOLD MEMORY FLAT (PLUMBER 8, 11/26/26; ask row 744, FOUND BY BESTIARY 2: 'the page grows every fight until a phone would
   drop it', about 340 MB a fight; the finish line's item 1, the brown town on his iPhone after long play; rule 480(c), rule 441; and
   VAMILY rule 484(a), Paolo 11/26 'it crashes going into a fight': 'twenty fights in a row entered from the map on the slowed phone,
   upright and sideways, memory flat, no crash, no reload').
   MEASURED (the same road fight again and again on the demo, a forced collection after each, every canvas any page makes counted alive by
   the function that made it; a heap snapshot's retaining paths): the dive's pictures of every fight stayed alive, about 23 megapixels a
   fight (about 90 MB at four bytes a pixel), held by the page's animation timeline: every animation the dive played held its last frame
   and was never cancelled, and each kept its target in the removed dive layer, and the layer every picture in it. NOW the dive's end
   cancels them (slices/bohemia_motion.js __THE_DIVE_LETS_ITS_PICTURES_GO__). records/BOHEMIA_PLUMBER_TEN_FIGHTS_HOLD_MEMORY_FLAT_11_26_26.md
   The same road fight entered from the map and won twenty times in a row on the demo, one page, the CPU slowed 4x for the way in, upright
   (390 x 844) and sideways (844 x 390), a forced collection after each; read from the second fight to the last (the first fills the caches
   every game fills once):
     C1 no crash and no reload over the twenty fights
     C2 an iPhone's canvas budget: the canvases alive under 256 MB at every fight (Safari gives a page a fixed canvas allowance; past it a
        new canvas draws nothing and the ground shows through)
     M1 the canvases alive grow at most 8 megapixels in all (the old way: about 23 a fight)
     M2 the dive's own pictures (picOf, turnIn, diveUp) alive no more after the last fight than after the second
     M3 the documents alive no more after the last than after the second (+1)
     M4 the JS heap (the browser's own count, not the page's rounded one) grows at most 15 MB in all
     M5 the dive let its animations go: it ended at least once a fight and cancelled what it played
     P1 PLANT the old way (window.__DIVE_KEEPS_ITS_ANIMATIONS), three fights: the canvases grow past M1's line for the same span (it bites)
     P2 PLANT the same three fights cross C2's iPhone line (measured: 200 -> 296 -> 386 MB; C2 bites)
   The processes' own memory (the page's renderer, the GPU process) is printed, not judged: this box draws through a software GPU whose
   process keeps what it was given. --upright / --sideways: one side alone; --no-plant / --plant-only: the halves alone.
   BOHEMIA_MEM_FIGHTS=n: a shorter walk for a quick look. One side is about 9 minutes, the plant about 1.5.
   ============================================================================ */
'use strict';
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const FIGHTS = +(process.env.BOHEMIA_MEM_FIGHTS || 20), M1_MPX = 8, M4_MB = 15;
/* AN IPHONE'S CANVAS BUDGET: Safari caps the canvas memory one page may hold (384 MB on the phones that first hit it; past it a new
   canvas gets no pixels and draws nothing, the town's brown ground showing through). The line: 256 MB of canvases alive, at every fight */
const IPHONE_CANVAS_MB = 256;
/* every canvas any page makes, kept as a WeakRef by the top page (made in the top page's own context, so the registry never keeps a
   page alive itself) with the function that made it */
const REG = "(function(){ var T = window.top; if (window === T) { T.__CVREG = { list: [] }; T.__cvAdd = function (e, w, p) { T.__CVREG.list.push({ r: new WeakRef(e), w: w, p: p }); }; } var ce = Document.prototype.createElement;"
  + " var who = function () { try { return String(new Error().stack || '').split('\\n').slice(2, 4).map(function (l) { return l.trim().replace(/^at /, '').replace(/\\(?(https?|file):[^ )]*\\//, '(').replace(/:\\d+\\)?$/, ')'); }).join(' < ').slice(0, 120); } catch (e) { return '?'; } };"
  + " Document.prototype.createElement = function (n) { var e = ce.apply(this, arguments); try { if (String(n).toLowerCase() === 'canvas' && T.__cvAdd) T.__cvAdd(e, who(), String(location.pathname).split('/').pop()); } catch (x) {} return e; };"
  + " })();";
const DIVE_PICS = /\b(picOf|turnIn|diveUp)\b/;
function procMem() {
  try { let ren = 0, gpu = 0; execSync('ps -eo rss,args --no-headers', { encoding: 'utf8', maxBuffer: 64e6 }).split('\n').forEach(l => { const m = l.trim().match(/^(\d+)\s+(.*)$/); if (!m || !/chrom/i.test(m[2])) return;
      if (/--type=renderer/.test(m[2])) ren += +m[1]; else if (/--type=gpu-process/.test(m[2])) gpu += +m[1]; });
    return { ren: Math.round(ren / 1024), gpu: Math.round(gpu / 1024) }; } catch (e) { return { ren: null, gpu: null }; }
}

async function loop(n, arm, label, side, throttle) {
  const d = await D.open({ profile: side ? 'phone_landscape' : 'phone_portrait', door: 180000, engage: true, pages: true, gpu: true, throttle: throttle || 1, arm: REG + (arm || '') });
  const p = d.page, fr = d.fr, M = (fn, a) => p.evaluate(fn, a), rows = [];
  let crashed = 0, loads = 0; p.on('crash', () => { crashed++; }); p.on('load', () => { loads++; }); rows.crash = () => crashed; rows.loads = () => loads;
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; };
  const fightFrame = async () => { const h = await p.$('#fightFrame'); const c = h && await h.contentFrame(); return c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false) ? c : null; };
  /* the count is the measurement's own work, not the game's: the slowed CPU is lifted for the collection and the count and put back
     (a collection at 4x took up to 11 s a fight and would push twenty fights past the suite's ten minutes) */
  const slow = async (r) => { if ((throttle || 1) > 1) await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: r }).catch(() => {}); };
  const census = async () => {
    await slow(1);
    await d.cdp.send('HeapProfiler.enable').catch(() => {}); for (let i = 0; i < 2; i++) { await d.cdp.send('HeapProfiler.collectGarbage').catch(() => {}); await sleep(300); }
    const c = await M((re) => { const R = window.__CVREG, RE = new RegExp(re); if (!R) return null; let mp = 0, dive = 0, n = 0;
      R.list = R.list.filter(x => !!x.r.deref());
      R.list.forEach(x => { const e = x.r.deref(); n++; mp += (e.width | 0) * (e.height | 0); if (RE.test(x.w)) dive++; });
      let lg = null; try { lg = BohemiaMotion.dive.letGo ? BohemiaMotion.dive.letGo() : null; } catch (e) {}
      return { n, mp: +(mp / 1e6).toFixed(1), dive, letGo: lg }; }, DIVE_PICS.source);
    try { c.heap = Math.round((await d.cdp.send('Runtime.getHeapUsage')).usedSize / 1048576); } catch (e) {}
    try { c.docs = (await d.cdp.send('Memory.getDOMCounters')).documents; } catch (e) {}
    c.proc = procMem(); return c; };
  const t0 = Date.now(), T = () => Math.round((Date.now() - t0) / 1000) + ' s';
  try {
    await sleep(3000); await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await sleep(3000);
    for (let k = 1; k <= n; k++) {
      await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} }); await sleep(500);
      await fr.evaluate(() => { const pm = partyMath('job', { skulls: 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
        cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why: 'party:memflat', at: { gx: city.x + 2, gy: city.y + 1 }, __deal: 424242 }); });
      const f = await waitFor(fightFrame, 120000); if (!f) { rows.push({ err: 'fight ' + k + ' never came' }); break; }
      await waitFor(() => M(() => !window.NFC || NFC.state === 'off'), 15000); await sleep(800);
      /* the way IN is on the slowed phone (rule 484(a): 'going from the map into a fight never crashes'); the win, the loot and the way
         home run unslowed so twenty fights a side fit the suite's ten minutes. Memory does not care how fast the CPU is: what is made is
         made either way. The slowed CPU goes back on before the next fight is asked for. */
      await slow(1);
      await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} });
      await waitFor(() => M(() => !!(window.SPOILS && SPOILS.frame) || !document.getElementById('fightFrame')), 60000); await sleep(800);
      await M(() => { try { if (window.SPOILS && SPOILS.frame && typeof spoilsLeave === 'function') spoilsLeave(); else if (typeof nfHome === 'function') nfHome(); } catch (e) {} });
      await waitFor(() => M(() => !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on') && (!window.BohemiaMotion || BohemiaMotion.dive.state() === 'off')), 90000); await sleep(800);
      const c = await census(); await slow(throttle || 1); c.crashed = crashed; c.loads = loads; rows.push(c);
      console.log('  ' + label + ' fight ' + k + ' (' + T() + '): canvases ' + c.n + ' (' + c.mp + ' Mpx = ' + Math.round(c.mp * 4) + ' MB; the dive\'s ' + c.dive + '), documents ' + c.docs + ', JS heap ' + c.heap + ' MB; renderer ' + c.proc.ren + ' MB, gpu ' + c.proc.gpu + ' MB');
    }
  } finally { try { await d.close(); } catch (e) {} }
  return rows;
}

(async () => {
  const a = process.argv.slice(2);
  const sides = a.includes('--upright') ? [false] : a.includes('--sideways') ? [true] : [false, true];
  if (!a.includes('--plant-only')) for (const side of sides) {
    const tag = side ? 'sideways' : 'upright';
    const R = await loop(FIGHTS, '', tag + ',', side, 4);
    const good = R.filter(r => !r.err), r2 = good[1], rN = good[good.length - 1];
    const walked = good.length === FIGHTS;
    ok(tag + ': the same road fight entered from the map and won ' + FIGHTS + ' times in a row on the slowed phone (CPU 4x)', walked, (R.filter(r => r.err)[0] || {}).err || good.length + ' fights');
    ok(tag + ': C1 NO CRASH, NO RELOAD: the page never died and never loaded again over the ' + FIGHTS + ' fights', R.crash() === 0 && good.every(r => r.loads === good[0].loads), 'crashes ' + R.crash() + ', page loads ' + R.loads());
    const worst = good.reduce((q, r) => Math.max(q, r.mp), 0);
    ok(tag + ': C2 AN IPHONE\'S CANVAS BUDGET: the canvases alive under ' + IPHONE_CANVAS_MB + ' MB at every fight', good.length > 0 && worst * 4 <= IPHONE_CANVAS_MB, 'the most ' + Math.round(worst * 4) + ' MB (' + worst + ' Mpx)');
    if (walked) {
      ok(tag + ': M1 the canvases alive grow at most ' + M1_MPX + ' megapixels from the second fight to the last', rN.mp - r2.mp <= M1_MPX, r2.mp + ' -> ' + rN.mp + ' Mpx (' + r2.n + ' -> ' + rN.n + ' canvases)');
      ok(tag + ': M2 the dive\'s own pictures alive no more after the last fight than after the second', rN.dive <= r2.dive, r2.dive + ' -> ' + rN.dive);
      ok(tag + ': M3 the documents alive no more after the last than after the second (+1)', rN.docs <= r2.docs + 1, r2.docs + ' -> ' + rN.docs);
      ok(tag + ': M4 the JS heap grows at most ' + M4_MB + ' MB from the second fight to the last', rN.heap - r2.heap <= M4_MB, r2.heap + ' -> ' + rN.heap + ' MB');
      const lg = rN.letGo;
      ok(tag + ': M5 the dive let its animations go (it ended at least once a fight, and cancelled what it played)', !!lg && lg.ends >= FIGHTS && lg.cancelled > 0, JSON.stringify(lg));
      console.log('  (printed, not judged: the renderer ' + r2.proc.ren + ' -> ' + rN.proc.ren + ' MB, the GPU process ' + r2.proc.gpu + ' -> ' + rN.proc.gpu + ' MB from the second fight to the last)');
    }
  }
  if (!a.includes('--no-plant')) {
    const Q = await loop(3, 'window.__DIVE_KEEPS_ITS_ANIMATIONS = true;', 'the old way');
    const g = Q.filter(r => !r.err), grew = g.length === 3 ? g[2].mp - g[1].mp : null;
    /* M1's line for the same span: 8 megapixels over eight fights, one fight's share of it */
    ok('P1 PLANT the old way (__DIVE_KEEPS_ITS_ANIMATIONS): the canvases grow past M1\'s line for the same span (one fight: ' + (M1_MPX / 8) + ' Mpx)', grew != null && grew > M1_MPX / 8 * 4,
      grew != null ? g[1].mp + ' -> ' + g[2].mp + ' Mpx in one fight; the dive\'s ' + g[1].dive + ' -> ' + g[2].dive : 'the plant\'s fights never came');
    /* the same old way read against C2: the leak alone carries the page past an iPhone's canvas allowance inside three fights */
    const top = g.reduce((q, r) => Math.max(q, r.mp), 0);
    ok('P2 PLANT the old way: the canvases alive cross C2\'s iPhone line (' + IPHONE_CANVAS_MB + ' MB) inside three fights (C2 bites)', g.length === 3 && top * 4 > IPHONE_CANVAS_MB,
      g.map(r => Math.round(r.mp * 4) + ' MB').join(' -> '));
  }
  console.log('\nTWENTY FIGHTS HOLD MEMORY FLAT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('\nTWENTY FIGHTS HOLD MEMORY FLAT: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); });
