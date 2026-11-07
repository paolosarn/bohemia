#!/usr/bin/env node
/* COMBAT 10 [auto never crashes] 11/6 -- THE PROBE (a measuring instrument; the gate is gates/auto_at_4x_never_crashes_gate.js).
   Paolo 11/6 (rule 417(a)): 'when I put the combat on auto at four times speed and I have like 11 people and they have like 16 people
   the game crashes, so you gotta do what you gotta do to handle that.'
   It plays ONE fight on AUTO at 4x, the way he does (the AUTO button and the speed pane pressed, or set before the board on the
   fight's own page), on a profile (his upright phone, or his computer), either on the fight's own page (mode 'bare') or through the
   demo's map and its own door (mode 'demo': through the title, off the town, cityHandOver with a rolled band, his company of N), and
   samples every 2 s until the fight is over:
     the fight      round, the men still on the board, over / result, FIGHT_UI.broke (a turn that threw)
     the clock      timers alive (every setTimeout wrapped before any page script), motions queued (FIGHT_UI.anim): does 4x stack
     the thread     every frame's length (rAF to rAF), every long task (the browser's own longtask entries), AUTO's own thinks
                    (FIGHT_UI.thinks); only after the board stands (the load under the clouds is PLUMBER's)
     the memory     the fight's decoded pictures (window.FIGHT_PICS: body, pose, night cells, whole night sheets, the ground), the
                    JS heap after a forced collection at the start and the end, the tab's real resident memory (every renderer
                    process from the OS)
   and every page error.
     node tools/bohemia_combat_auto_at_4x_probe_11_6_26.js [--his 16] [--theirs 30] [--profile phone_portrait|computer]
                                                            [--mode bare|demo] [--night] [--seed 7] [--secs 420] [--json out.json]
   Module: require(...).probe({ his, theirs, profile, mode, night, seed, secs }) -> the summary. */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

/* armed before any page script, in every frame */
const ARM = `(() => {
  const live = new Set(); const st = window.setTimeout, ct = window.clearTimeout;
  window.setTimeout = function (f, ms) { const args = [].slice.call(arguments, 2); let id; id = st(function () { live.delete(id); if (typeof f === 'function') f.apply(this, args); }, ms); live.add(id); return id; };
  window.clearTimeout = function (id) { live.delete(id); return ct(id); };
  window.__A4 = { timers: () => live.size, frames: [], long: [] };
  let last = 0; const rf = (n) => { if (last) window.__A4.frames.push(n - last); last = n; requestAnimationFrame(rf); }; requestAnimationFrame(rf);
  try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__A4.long.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: true }); } catch (e) {}
})();`;
const rss = kind => { try { return Math.round(+cp.execSync("ps -eo rss,args | grep -i 'type=" + kind + "' | grep -v grep | awk '{s+=$1} END {print s}'").toString().trim() / 1024); } catch (e) { return -1; } };
/* his company and their band: a third of his with a crossbow, a third with a pipe and a car door (the shield and the club sheets), the
   rest as dealt; theirs the road crew's thugs with a marksman in four */
function sides(nm, nb) {
  const company = [], band = [];
  for (let i = 0; i < nm; i++) company.push(i % 3 === 2 ? { background: 'militia', gear: { main: 'crossbow' } } : i % 3 === 1 ? { background: 'militia', gear: { main: 'pipe', off: 'car_door' } } : {});
  for (let i = 0; i < nb; i++) band.push(i % 4 === 3 ? 'brigand_marksman' : 'brigand_thug');
  return { company, band };
}
const SAMPLE = () => { const S = FIGHT.S, U = FIGHT_UI, A = window.__A4, F = A.frames.splice(0), L = A.long.splice(0), th = (U.thinks || []).slice();
  return { r: S.round, over: !!S.over, res: S.result || null, hand: U.hand || 1, auto: !!U.auto, anim: U.anim.length, animTimed: U.anim.filter(a => a.dur > 0).length, animKinds: U.anim.length > 8 ? U.anim.reduce((m, a) => { const k = a.k + (a.e && a.e.t ? ':' + a.e.t : '') + (a.dur > 0 ? '' : ':0'); m[k] = (m[k] || 0) + 1; return m; }, {}) : null, timers: A.timers(), broke: U.broke || 0,
    alive: S.units.filter(u => FIGHT.onField(u)).length, frames: F, long: L, thinkMax: th.length ? Math.round(Math.max.apply(null, th)) : 0, pics: window.FIGHT_PICS ? FIGHT_PICS() : null, night: !!S.night }; };

async function probe(o) {
  o = Object.assign({ his: 16, theirs: 30, profile: 'phone_portrait', mode: 'bare', night: false, seed: 7, secs: 420 }, o || {});
  const P = sides(o.his, o.theirs), errs = [], out = { opts: o, rows: [], errs };
  const fightOpts = { seed: o.seed, kind: o.kind || 'suburb', night: o.night, deploy: false, formation: null, auto: true, company: P.company, cap: o.his, band: P.band, party: { band: P.band, count: o.theirs, rolled: true } };
  const d = o.mode === 'demo'
    ? await D.open({ keepCards: true, profile: o.profile, arm: ARM, beforeTap: async (pg) => { await require(path.join(ROOT, 'tools/bohemia_through_the_title.js')).throughTheTitle(pg); } })
    : await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: o.profile, arm: ARM + ';try{localStorage.setItem("bohemia.fight.speed","4")}catch(e){};window.FIGHT_OPTS=' + JSON.stringify(fightOpts) + ';' });
  const p = d.page; p.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); p.on('crash', () => errs.push('THE PAGE CRASHED'));
  const cdp = await p.context().newCDPSession(p); await cdp.send('Performance.enable'); await cdp.send('HeapProfiler.enable');
  const heap = async () => { await cdp.send('HeapProfiler.collectGarbage'); const m = (await cdp.send('Performance.getMetrics')).metrics; return +((m.find(x => x.name === 'JSHeapUsedSize') || {}).value / 1048576).toFixed(1); };
  let f = p.mainFrame();
  try {
    if (o.mode === 'demo') {
      await p.waitForTimeout(3500);
      out.mapRss = rss('renderer');
      const settle = () => p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url()));
      if (await d.fr.evaluate(() => !!(LOOP.open && LOOP.open.name)).catch(() => false)) { await require(path.join(ROOT, 'tools/bohemia_leave_the_town.js')).leaveTown(p, settle(), { ms: 5000 }); await p.waitForTimeout(2500); }
      if ((await d.fr.evaluate(() => MODE).catch(() => 'city')) !== 'city') { await d.fr.evaluate(() => { try { swapMode(); } catch (e) {} }); await p.waitForTimeout(1500); }
      /* his company of N: the origin's men to N, the door's field cap (12; 16 past twelve, the Block Watch's) */
      out.company = await p.evaluate(([nm]) => { try { localStorage.removeItem('bohemia.company.v1'); localStorage.removeItem('bohemia.company.line.v1'); } catch (e) {}
        const real = BOH_START.picks; BOH_START.picks = function () { const r = real.apply(this, arguments), base = r.company && r.company.length ? r.company : [{ background: 'militia' }];
          r.company = Array.from({ length: nm }, (_, i) => Object.assign({}, base[i % base.length], { name: undefined })); r.cap = nm > 12 ? 16 : 12; return r; };
        const r = BOH_START.picks(); return { n: r.company.length, cap: r.cap }; }, [o.his]);
      out.door = await d.fr.evaluate(([band]) => { try { if (LOOP.open) loopClose(); } catch (e) {} try { contactClear(); } catch (e) {}
        for (let r = 2; r < 14 && townSafeAt(city.x, city.y); r++) { const x0 = city.x, y0 = city.y; for (const q of [[r, 0], [-r, 0], [0, r], [0, -r]]) { city.x = x0 + q[0]; city.y = y0 + q[1]; if (!townSafeAt(city.x, city.y)) break; city.x = x0; city.y = y0; } }
        try { TOWN_EXIT = null; } catch (e) {}
        try { return !!cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', why: 'gate:auto4x', label: 'A BIG CREW', __met: true, party: { count: band.length, faction: 'brigands', band: band }, roster: band.map(() => ({ arch: 'human' })), street: true, at: { gx: city.x + 2, gy: city.y } }, null); } catch (e) { return 'threw ' + e; } }, [P.band]);
      let ff = null; const t0 = Date.now();
      while (!ff && Date.now() - t0 < 120000) { const h = await p.$('#fightFrame'); const c = h && await h.contentFrame();
        if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!window.FIGHT_UI && FIGHT_UI.board).catch(() => false)) ff = c; else await p.waitForTimeout(300); }
      if (!ff) throw new Error('the demo\'s fight never stood');
      f = ff;
      await f.waitForFunction(() => performance.now() > FIGHT_UI.openUntil, null, { timeout: 30000 }).catch(() => {});
      const { fightPress } = require(path.join(ROOT, 'tools/bohemia_fight_press.js'));
      if (await f.evaluate(() => FIGHT.S.deploy)) { await fightPress(p, f, 'bend', { ms: 8000 }); await p.waitForTimeout(1500); }
      if (!(await f.evaluate(() => FIGHT_UI.auto))) { await fightPress(p, f, 'bauto', { ms: 8000 }); await p.waitForTimeout(600); }
      for (let i = 0; i < 3 && (await f.evaluate(() => FIGHT_UI.hand || 1)) !== 4; i++) { await fightPress(p, f, 'bspeed', { ms: 4000 }); await p.waitForTimeout(400); }
    } else {
      await f.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 120000 });
      await f.evaluate(() => { try { handSpeed(4, true); } catch (e) {} });
    }
    out.stood = await f.evaluate(() => ({ his: FIGHT.S.units.filter(u => u.side === 'you' && FIGHT.onField(u)).length, theirs: FIGHT.S.units.filter(u => u.side !== 'you' && FIGHT.onField(u)).length,
      board: FIGHT.S.w + 'x' + FIGHT.S.h, hand: FIGHT_UI.hand, auto: FIGHT_UI.auto, night: !!FIGHT.S.night }));
    await p.waitForTimeout(1000); await f.evaluate(() => { window.__A4.frames = []; window.__A4.long = []; });
    out.heap0 = await heap(); out.rss0 = rss('renderer');
    const t1 = Date.now();
    for (;;) {
      await p.waitForTimeout(2000);
      const s = await f.evaluate(SAMPLE).catch(e => ({ gone: String(e.message).slice(0, 100) }));
      s.t = Math.round((Date.now() - t1) / 1000); s.rss = rss('renderer'); out.rows.push(s);
      if (s.gone || s.over || (Date.now() - t1) / 1000 > o.secs) break;
    }
    out.heap1 = await heap().catch(() => null); out.rss1 = rss('renderer');
  } catch (e) { errs.push('PROBE: ' + String(e.message).slice(0, 200)); }
  await d.close().catch(() => {});
  /* the summary */
  const R = out.rows.filter(r => !r.gone), fr = [].concat(...R.map(r => r.frames || [])).sort((a, b) => a - b), lt = [].concat(...R.map(r => r.long || []));
  const pick = q => fr.length ? +fr[Math.min(fr.length - 1, Math.floor(fr.length * q))].toFixed(1) : null, last = R[R.length - 1] || {};
  const held = R.map(r => r.pics ? r.pics.held : 0);
  out.sum = { his: o.his, theirs: o.theirs, profile: o.profile, mode: o.mode, night: !!(out.stood && out.stood.night), stood: out.stood, over: !!last.over, result: last.res || null, rounds: last.r || 0, secs: last.t || 0,
    errors: errs.length, broke: Math.max(0, ...R.map(r => r.broke || 0)), hand: out.stood && out.stood.hand, auto: out.stood && out.stood.auto,
    timersMax: Math.max(0, ...R.map(r => r.timers || 0)), animMax: Math.max(0, ...R.map(r => r.anim || 0)), animSeries: R.map(r => r.anim), timedMax: Math.max(0, ...R.map(r => r.animTimed || 0)), drains: R.every((r, i) => i === 0 || !(r.anim > 16 && R[i - 1].anim > 16)), animBig: R.filter(r => r.animKinds).map(r => r.animKinds).slice(0, 4),
    frames: fr.length, frameMed: pick(.5), frameP95: pick(.95), frameMax: fr.length ? +fr[fr.length - 1].toFixed(1) : null, longMax: lt.length ? Math.max(...lt) : 0, longN: lt.length,
    thinkMax: Math.max(0, ...R.map(r => r.thinkMax || 0)),
    heldPeak: Math.max(0, ...held), heldEnd: held.length ? held[held.length - 1] : 0, pics: last.pics || null, picsPeak: (R.slice().sort((a, b) => (b.pics ? b.pics.held : 0) - (a.pics ? a.pics.held : 0))[0] || {}).pics || null,
    heap0: out.heap0, heap1: out.heap1, rss0: out.rss0, rss1: out.rss1, rssPeak: Math.max(0, ...R.map(r => r.rss || 0)), mapRss: out.mapRss || null, firstErrors: errs.slice(0, 3) };
  return out.sum;
}
module.exports = { probe, sides };
if (require.main === module) {
  const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
  probe({ his: +arg('his', 16), theirs: +arg('theirs', 30), profile: arg('profile', 'phone_portrait'), mode: arg('mode', 'bare'), night: process.argv.indexOf('--night') > 0, seed: +arg('seed', 7), secs: +arg('secs', 420) })
    .then(s => { console.log(JSON.stringify(s, null, 1)); const J = arg('json', null); if (J) fs.writeFileSync(J, JSON.stringify(s, null, 1)); })
    .catch(e => { console.error(e); process.exit(1); });
}
