#!/usr/bin/env node
/* ============================================================================
   THE FIGHT WEIGHT (RUN 10/25/26, rows [the crash before the fight] and [only the final look loads], rules 173, 174)

   Paolo 10/25: 'the game keeps crashing at random times, usually right before a fight loads up; maybe it's because of
   the amount of people on the screen.' And: 'you say you're loading, I press go, and it's still loading ghost month-old
   bullshit before I see the 3-D maps.'

   ONE MEASUREMENT FOR BOTH ROWS (rule 174(d)). The demo boots through the one driver on a profile (the phone held
   upright, or his computer), as a stranger: NEW GAME with the widest company the door builds (THE BLOCK WATCH, twelve
   men) on OUTLIVED IT, so every fight is the biggest the game rolls. Then, fight after fight, the way he plays it:

     map      on the map, before the fight (garbage forced, then counted)
     card     the MEET card stands (who, their stars, the ground): his walking walked into them
     load     ENGAGE: the clouds roll in, the fight's frame builds; the HIGH WATER of the whole tab is watched every
              100 ms through the load (a phone kills a tab at its peak, not after a collection)
     fight    the board stands and the fight plays on AUTO (a few rounds: the held, kneeling and reloading sheets decode)
     end      the end screen (the spoils) over the fight
     back     LEAVE: the map again, the fight's frame gone (garbage forced, then counted)

   At every step, in every frame (the counters armed before any page script, tools/bohemia_run_the_crash_hunt.js's ARM):
   decoded pictures (one copy per file), canvases' backing stores, decoded bitmaps, audio buffers, the JS heap, DOM nodes;
   and the tab's REAL resident memory, read from the operating system for every renderer process of the browser (the one
   number that does not trust the game's own bookkeeping). Every request the page makes is logged with the step it fell
   in, so 'what loads under the map' and 'what the fight fetches and never draws' are lists, not feelings.

     node tools/bohemia_run_the_fight_weight.js [--profile phone_portrait|computer] [--fights 3] [--auto 12000]
                                                [--file BOHEMIA_DEMO.html] [--out records/run/THE_FIGHT_WEIGHT.json]
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const D = require('./bohemia_drive_the_demo.js');
const { ARM } = require('./bohemia_run_the_crash_hunt.js');

const ROOT = path.dirname(__dirname);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const PROFILE = arg('profile', 'phone_portrait');
const FIGHTS = +arg('fights', 3);
const AUTO_MS = +arg('auto', 12000);
const PRESS = process.argv.indexOf('--press') > 0;   /* read the tab again after a critical memory notification */
const FILE = arg('file', 'BOHEMIA_DEMO.html');
const OUT = arg('out', path.join(ROOT, 'records/run/THE_FIGHT_WEIGHT_' + PROFILE + '.json'));
/* the factions a fight can deal (records/target/bb/enemies.json), so the seventeen new enemies and the beasts come too */
const FACTIONS = (arg('factions', 'brigands,kids,machines,heavies')).split(',');

/* the widest company the door builds, on the hard end: the biggest fights the game rolls */
const BIG = `try { if (!localStorage.getItem('bohemia.start')) localStorage.setItem('bohemia.start', JSON.stringify({ combat: 'out', econ: 'full', origin: 'watch', name: 0, reveal: 1 })); } catch (e) {}`;

/* THE TAB'S REAL MEMORY: every process under the browser, from /proc (resident set, MB), split by kind */
function procTree(rootPid) {
  const kids = {};
  for (const p of fs.readdirSync('/proc')) {
    if (!/^\d+$/.test(p)) continue;
    try { const st = fs.readFileSync('/proc/' + p + '/stat', 'utf8'); const pp = +st.slice(st.lastIndexOf(')') + 2).split(' ')[1]; (kids[pp] = kids[pp] || []).push(+p); } catch (e) {}
  }
  const out = [], q = [rootPid];
  while (q.length) { const p = q.shift(); out.push(p); (kids[p] || []).forEach((k) => q.push(k)); }
  return out;
}
function rss(rootPid) {
  const r = { renderer: 0, gpu: 0, browser: 0, other: 0 };
  for (const p of procTree(rootPid)) {
    try {
      const cmd = fs.readFileSync('/proc/' + p + '/cmdline', 'utf8');
      const m = /VmRSS:\s+(\d+)/.exec(fs.readFileSync('/proc/' + p + '/status', 'utf8')); if (!m) continue;
      const mb = +m[1] / 1024;
      if (/--type=renderer/.test(cmd)) r.renderer += mb; else if (/--type=gpu-process/.test(cmd)) r.gpu += mb;
      else if (/chrom/i.test(cmd)) r.browser += mb; else r.other += mb;
    } catch (e) {}
  }
  Object.keys(r).forEach((k) => { r[k] = Math.round(r[k]); });
  return r;
}

async function main() {
  const d = await D.open({ file: FILE, arm: BIG + '\n' + ARM, keepCards: false, profile: PROFILE, fog: false });
  const page = d.page, fr = d.fr;
  const pid = process.pid;   /* the browser is this process's child; every renderer and the GPU process under it */
  const cdp = await d.ctx.newCDPSession(page);
  await cdp.send('Performance.enable');
  const H = { file: FILE, profile: PROFILE, when: new Date().toISOString(), box: 'Playwright Chromium, ' + PROFILE + ', full CPU', fights: [], steps: [] };
  let step = 'boot';
  H.crashed = null; page.on('crash', () => { H.crashed = H.crashed || { step, at: new Date().toISOString() }; });   /* the tab dying is the thing measured */
  const reqs = [];
  page.on('request', (r) => { const u = r.url(); if (/^data:|^blob:|^about:/.test(u)) return; reqs.push({ step, url: u.replace(/^https?:\/\/[^/]+/, '').split('?')[0], t: Date.now() }); });
  /* the high water, sampled every 100 ms while a step runs (no collection forced: what the phone would see) */
  let peak = null, sampler = null;
  const watch = () => { peak = { renderer: 0, gpu: 0 }; if (sampler) clearInterval(sampler);
    sampler = setInterval(() => { if (!pid) return; const r = rss(pid); if (r.renderer > peak.renderer) peak.renderer = r.renderer; if (r.gpu > peak.gpu) peak.gpu = r.gpu; }, 100); };
  const snap = async (label, gc) => {
    if (gc !== false) { await cdp.send('HeapProfiler.collectGarbage').catch(() => {}); await page.waitForTimeout(300); await cdp.send('HeapProfiler.collectGarbage').catch(() => {}); }
    const m = {}; (await cdp.send('Performance.getMetrics')).metrics.forEach((x) => { m[x.name] = x.value; });
    const frames = [];
    for (const f of page.frames()) { try { const s = await f.evaluate(() => window.__LEAK ? window.__LEAK.snap() : null); if (s) frames.push(s); } catch (e) {} }
    const sum = (fn) => +frames.reduce((s, x) => s + fn(x), 0).toFixed(1);
    const os = pid ? rss(pid) : null;
    /* AND WHAT THE PHONE CANNOT TAKE BACK: a phone short of memory first throws away every decoded picture nothing is drawing,
       then kills the tab; the browser is told memory is CRITICAL (the same notification), and the tab is read again */
    let pressed = null;
    if (PRESS && pid) { await cdp.send('Memory.simulatePressureNotification', { level: 'critical' }).catch(() => {}); await page.waitForTimeout(700);
      await cdp.send('HeapProfiler.collectGarbage').catch(() => {}); await page.waitForTimeout(300); pressed = rss(pid); }
    const row = { label, step, rssMB: os, pressedMB: pressed, peakMB: peak ? Object.assign({}, peak) : null,
      heapMB: +(m.JSHeapUsedSize / 1048576).toFixed(1), domNodes: m.Nodes, documents: m.Documents, frames: m.Frames,
      imagesMB: sum((x) => x.images.MB), imageFiles: sum((x) => x.images.files), canvasMB: sum((x) => x.canvas.MB), canvasAlive: sum((x) => x.canvas.alive),
      bitmapMB: sum((x) => (x.bitmaps ? x.bitmaps.MB : 0)), audioBufMB: sum((x) => x.audio.bufMB),
      perFrame: frames.map((x) => ({ url: x.url, imagesMB: x.images.MB, files: x.images.files, byDir: x.images.byDir, biggest: x.images.biggest, canvasMB: x.canvas.MB, canvasAt: x.canvas.MBAt, bitmapMB: x.bitmaps ? x.bitmaps.MB : 0, bitmapDir: x.bitmaps ? x.bitmaps.byDir : null, audioMB: x.audio.bufMB })) };
    row.pixelsMB = +(row.imagesMB + row.canvasMB + row.bitmapMB).toFixed(1);
    row.heldMB = +(row.pixelsMB + row.audioBufMB + row.heapMB).toFixed(1);
    row.lockedMB = +(row.canvasMB + row.bitmapMB).toFixed(1);   /* canvases and bitmaps: Safari's canvas cap counts these, and no pressure frees them */
    console.log('  ' + label.padEnd(22) + ' rss ' + (os ? os.renderer + '+' + os.gpu + 'gpu' : '?') + (pressed ? ' pressed ' + pressed.renderer : '') + (peak ? '  peak ' + peak.renderer : '') + '  canvas+bmp ' + row.lockedMB + '  | pixels ' + row.pixelsMB + ' MB (img ' + row.imagesMB + ' in ' + row.imageFiles + ' files, canvas ' + row.canvasMB + ', bmp ' + row.bitmapMB + ')  heap ' + row.heapMB + '  dom ' + row.domNodes + '  docs ' + row.documents);
    H.steps.push(row);
    return row;
  };
  const fightCw = async () => { const h = await page.$('#fightFrame'); return h ? h.contentFrame() : null; };
  try {
    await page.waitForTimeout(6000);
    /* the widest company on the hard end, set on the door's own picks: the driver's knock while the door waits is a tap in the middle of
       the screen, and on the new-company picks it lands on an origin card (measured 10/25: A NEW CREW, three men) */
    await page.evaluate(() => { try { BOH_START.state.origin = 'watch'; BOH_START.state.combat = 'out'; } catch (_e) {} });
    step = 'map'; watch();
    await snap('the map, first');
    for (let i = 0; i < FIGHTS; i++) {
      const fac = FACTIONS[i % FACTIONS.length];
      const F = { n: i + 1, faction: fac };
      const t0 = Date.now();
      /* the biggest party the math rolls: day 100 (its cap), the hard end; his walking walks into it, so the card asks first */
      step = 'card'; watch();
      const want = await fr.evaluate((fac) => { DAY.day = 100; if (LOOP.start) LOOP.start.combat = 'out'; try { contactClear(); } catch (_e) {} try { CITY_CONTACT_POSTED = false; } catch (_e) {}
        const P = partyMath('roaming', { x: city.x, y: city.y });
        /* the faction for this fight, on the map's own hand-over (the fight reads party.faction) */
        const pm = window.partyMath; window.partyMath = function (k, o) { const r = pm(k, o); if (r) r.faction = fac; return r; };
        try { meetWalk(function () { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); }); } finally { window.partyMath = pm; }
        return { count: P.count, word: P.word }; }, fac);
      F.party = want;
      for (let k = 0; k < 40; k++) { if (await fr.evaluate(() => !!(window.MEET && MEET.up))) break; await page.waitForTimeout(150); }
      F.card = await fr.evaluate(() => !!(window.MEET && MEET.up));
      if (i < 2 || i === FIGHTS - 1) await snap('fight ' + (i + 1) + ': the card'); else await page.waitForTimeout(200);
      /* ENGAGE, the way he presses it */
      step = 'load'; watch();
      const tEngage = Date.now();
      await fr.evaluate(() => { if (window.MEET_DONE && MEET.up) MEET_DONE(true); });
      let cw = null;
      for (let k = 0; k < 400; k++) {
        cw = await fightCw();
        if (cw && await cw.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0 && (() => { const l = document.getElementById('load'); return !l || l.style.display === 'none'; })()).catch(() => false)) break;
        cw = null; await page.waitForTimeout(100);
      }
      F.loadMs = Date.now() - tEngage;
      if (H.crashed) { F.error = 'the tab crashed'; H.fights.push(F); console.log('  fight ' + (i + 1) + ': THE TAB CRASHED'); break; }
      if (!cw) { F.error = 'the fight never stood'; F.why = await page.evaluate(() => ({ frame: !!document.getElementById('fightFrame'), cityfight: typeof CITYFIGHT !== 'undefined' ? CITYFIGHT : '?', nf: window.NF ? { opened: NF.opened, over: !!NF.over } : null })).catch((e) => String(e));
        F.whyMap = await fr.evaluate(() => ({ meetUp: !!(window.MEET && MEET.up), last: window.__MEET_LAST || null, posted: typeof CITY_CONTACT_POSTED !== 'undefined' ? CITY_CONTACT_POSTED : '?' })).catch((e) => String(e));
        const c2 = await fightCw(); if (c2) F.whyFight = await c2.evaluate(() => ({ F: typeof FIGHT !== 'undefined', S: typeof FIGHT !== 'undefined' && !!FIGHT.S, board: typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board, units: typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units ? FIGHT.S.units.length : 0, load: (document.getElementById('load') || {}).style ? document.getElementById('load').style.display : null, txt: (document.getElementById('load') || {}).textContent })).catch((e) => String(e));
        console.log('  why: ' + JSON.stringify([F.why, F.whyMap, F.whyFight])); H.fights.push(F); console.log('  fight ' + (i + 1) + ': NEVER STOOD'); break; }
      F.handed = await page.evaluate(() => ({ handed: window.__NF_HANDED || null, company: NF.opts && NF.opts.company ? NF.opts.company.length : null, party: NF.opts && NF.opts.party || null }));
      F.packed = await cw.evaluate(() => window.__PACKED ? { used: __PACKED.used, whole: __PACKED.whole } : null).catch(() => null);
      F.men = await cw.evaluate(() => ({ ours: FIGHT.S.units.filter((u) => u.side === 'you').length, theirs: FIGHT.S.units.filter((u) => u.side === 'them').length, kinds: [...new Set(FIGHT.S.units.filter((u) => u.side === 'them').map((u) => u.kind))] }));
      const atLoad = await snap('fight ' + (i + 1) + ': loaded', false);
      F.loadPeakMB = atLoad.peakMB;
      /* the fight plays: the formation is taken, AUTO to the end at the top pace */
      step = 'fight'; watch();
      await cw.evaluate(() => { try { if (FIGHT.S.deploy) { const b = document.getElementById('bstart') || document.getElementById('bready'); if (typeof startFight === 'function') startFight(); else if (FIGHT.startFight) FIGHT.startFight(); else if (b) b.click(); } } catch (_e) {} });
      await cw.evaluate(() => { try { if (FIGHT.S.deploy && FIGHT.startFight) FIGHT.startFight(); } catch (_e) {} try { const b = document.getElementById('bauto'); if (b) b.click(); } catch (_e) {} });
      const tA = Date.now();
      while (Date.now() - tA < AUTO_MS) { if (await cw.evaluate(() => !!FIGHT.S.over).catch(() => true)) break; await page.waitForTimeout(500); }
      F.rounds = await cw.evaluate(() => FIGHT.S.round | 0).catch(() => null);
      const inFight = await snap('fight ' + (i + 1) + ': in the fight', false);
      F.fightPeakMB = inFight.peakMB;
      /* the end: won (forced when AUTO has not finished it inside the time) */
      step = 'end'; watch();
      await cw.evaluate(() => { if (!FIGHT.S.over) { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); } }).catch(() => {});
      for (let k = 0; k < 60; k++) { if (await page.evaluate(() => !CITYFIGHT || !!(window.SPOILS && SPOILS.frame))) break; await page.waitForTimeout(250); }
      await page.waitForTimeout(1200);
      if (i < 2 || i === FIGHTS - 1) await snap('fight ' + (i + 1) + ': the end screen', false);
      step = 'back'; watch();
      await page.evaluate(() => { try { if (typeof spoilsLeave === 'function') spoilsLeave(); else nfHome(); } catch (_e) {} });
      for (let k = 0; k < 60; k++) { if (await page.evaluate(() => !CITYFIGHT && !document.getElementById('fightFrame'))) break; await page.waitForTimeout(250); }
      await page.waitForTimeout(2500);
      const back = await snap('fight ' + (i + 1) + ': back on the map');
      F.backRss = back.rssMB; F.ms = Date.now() - t0;
      H.fights.push(F);
      console.log('  fight ' + F.n + ' ' + fac + ': ' + F.men.ours + ' v ' + F.men.theirs + ' (' + F.men.kinds.slice(0, 6).join(' ') + ')  load ' + F.loadMs + ' ms, peak ' + (F.loadPeakMB && F.loadPeakMB.renderer) + ' MB load / ' + (F.fightPeakMB && F.fightPeakMB.renderer) + ' MB fight, ' + F.rounds + ' rounds');
    }
    H.errors = d.errs.slice(0, 30);
  } finally {
    if (sampler) clearInterval(sampler);
    /* every request by step, and the files fetched more than once */
    const by = {}; reqs.forEach((r) => { (by[r.step] = by[r.step] || {}); by[r.step][r.url] = (by[r.step][r.url] || 0) + 1; });
    H.requests = Object.fromEntries(Object.entries(by).map(([k, v]) => [k, Object.entries(v).sort((a, b) => b[1] - a[1])]));
    H.requestCount = reqs.length;
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(H, null, 1));
    console.log('  wrote ' + path.relative(ROOT, OUT));
    await d.close();
  }
}
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
module.exports = { rss, procTree };
