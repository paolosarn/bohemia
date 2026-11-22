#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- M5 MEASURES TIME, SO THIS GATE RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   ============================================================================
   A MAN IS DRAWN ONCE (COMBAT FOUR 11/22/26; ask row 699, FOUND BY PLUMBER 8: 'THE FIGHT ON AUTO DRAWS EVERY MAN EVERY FRAME... a man
   who has not moved or changed pose since the last frame is drawn again'; records/BOHEMIA_PLUMBER_THE_FIGHT_ON_AUTO_PROFILED_11_22_26.md;
   rule 441(a)(c): no freeze over half a second).
   The fight's page (slices/BOHEMIA_FIGHT.html, __A_MAN_IS_DRAWN_ONCE__): a man is taken down before he is drawn, and if what he would
   draw is what he drew last frame his own kept picture is laid on the glass in one draw; __THE_HELD_SHEETS_DECODE_OFF_THE_PAGE__: the
   sheets of what a man holds are decoded from their files, off the page's thread.
   THE LEGS (the fight page alone, his phone upright, the census's own CPU canvas):
     M1 KEPT ON AUTO: a 20-man fight on AUTO for 6 s: most men's draws are a kept picture (kept at least half of all, and some made)
     M2 THE SAME MAN BY DAY: at four moments of the fight every man on the field drawn the old way, then made, then kept, on the same
        ground: each the same picture (every pixel within 2 of 255, or at most 64 pixels past it: a turned weapon's edge picking its
        neighbour), and at least three in four exactly the same to the pixel
     M2n THE SAME MAN AT NIGHT: the same on a night board (the night's own cells; every man within 2, or at most 64 pixels past it)
     M3 THE HIT'S RED: three men flashing red from a blow are drawn straight (never kept: the red is made in one scratch canvas for
        every layer) and are the same picture as the old way
     M4 THE HELD SHEETS DECODE OFF THE PAGE: over 8 s of AUTO no held, melee or carried sheet is copied from a decoded <img> on the
        page's thread, and the sheets came (bitmaps in hand)
     M5 THE MEN COST LESS: the CPU slowed 4x, AUTO at 4x, the same fight the old way and the new way, a CPU profile of 6 s each: the
        men's drawing (drawMan) a frame at most 0.8 of the old way's
     M6 THE GLASS PICKS THE CHEAPER WAY: there, the glass timed the men both ways and chose to keep them (the legs above keep always,
        window.__MAN_KEPT_ALWAYS; the old way wins over it)
     planted: P1 the old way on (window.__MAN_DRAWN_EVERY_FRAME): M1 reads nothing kept (caught); P2 a kept picture laid a pixel off
     (window.__MANC_PLANT_OFF): M2 reads men not the same (caught); M4p the held sheets taken the old way
     (window.__HELD_SHEETS_ON_THE_PAGE): copies on the page's thread counted (caught)
     E1 nothing threw
   node gates/a_man_is_drawn_once_gate.js
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const leg = (ok, name, msg) => { ok ? pass++ : fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const BASE = { seed: 5, speed: 1, kind: 'freeway', deploy: false, formation: null, teach: false };
/* every createImageBitmap of a decoded <img> from a held, melee or carried sheet, counted from the page's start */
const CIB = "(function(){var c=window.createImageBitmap;window.__CIB_IMG=0;if(!c)return;window.createImageBitmap=function(a){try{if(typeof HTMLImageElement!=='undefined'&&a instanceof HTMLImageElement&&/rig_hold\\/|rig_melee\\//.test(a.src||''))window.__CIB_IMG++;}catch(e){}return c.apply(window,arguments);};})();";
const up = (p) => p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 120000 });
const auto = (p, speed) => p.evaluate((sp) => { try { handSpeed(sp); } catch (e) {} const b = document.getElementById('bauto'); if (b && !/ON|STOP/i.test(b.textContent)) b.click(); }, speed);
/* every man on the field: the old way, made, kept, each on the same opaque ground; per man the pixels past 2 and the worst */
const SAME = () => {
  const now = performance.now(), W = cx.canvas.width, H = cx.canvas.height, r = [];
  const wipe = () => { cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#6b6258'; cx.fillRect(0, 0, W, H); cx.restore(); };
  const grab = () => cx.getImageData(0, 0, W, H).data;
  const cmp = (A, B) => { let px = 0, worst = 0, over = 0; for (let i = 0; i < A.length; i += 4) { let d = 0; for (let j = 0; j < 3; j++) d = Math.max(d, Math.abs(A[i + j] - B[i + j])); if (d) px++; if (d > 2) over++; if (d > worst) worst = d; } return { px, over, worst }; };
  const st = window.__MANCACHE_STATS;
  FIGHT.S.units.filter(v => FIGHT.onField(v) && !v.ghost && !v.machine).forEach(v => {
    const X = sx((dx(v) + .5) * UI.tw), feet = sy((dy(v) + .9) * UI.th), m0 = st.made, k0 = st.kept, p0 = st.plain;
    window.__MAN_DRAWN_EVERY_FRAME = true; wipe(); blitMan(v, X, feet, now, 1); const A = grab();
    window.__MAN_DRAWN_EVERY_FRAME = false; v._mc = null; wipe(); blitMan(v, X, feet, now, 1); const B = grab(); wipe(); blitMan(v, X, feet, now, 1); const C = grab();
    const made = cmp(A, B), kept = cmp(A, C);
    r.push({ id: v.id, made, kept, how: st.plain > p0 ? 'straight' : st.kept > k0 && st.made > m0 ? 'made+kept' : 'odd' });
  });
  wipe(); return r;
};
const fine = (m) => m.made.worst <= 2 || m.made.over <= 64;
const fineBoth = (m) => fine({ made: m.made }) && fine({ made: m.kept });
(async () => {
  const errs = [];
  /* ---- the day page: M1, M2, M3, M4, P1, P2 ---- */
  {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: CIB + 'window.__MAN_KEPT_ALWAYS=true;window.FIGHT_OPTS=' + JSON.stringify(BASE) });
    const p = d.page; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    try {
      await up(p);
      const cib0 = await p.evaluate(() => window.__CIB_IMG);
      await auto(p, 1);
      await p.waitForTimeout(2000);
      await p.evaluate(() => { const s = window.__MANCACHE_STATS; window.__S0 = { kept: s.kept, made: s.made, plain: s.plain }; });
      await p.waitForTimeout(6000);
      const m1 = await p.evaluate(() => { const s = window.__MANCACHE_STATS, a = window.__S0; return { kept: s.kept - a.kept, made: s.made - a.made, plain: s.plain - a.plain, why: s.why }; });
      const all1 = m1.kept + m1.made + m1.plain;
      leg(m1.kept > 50 && m1.made > 0 && m1.kept >= all1 / 2, 'M1 KEPT ON AUTO', 'over 6 s on AUTO: ' + m1.kept + ' of ' + all1 + ' man-draws laid as his kept picture (' + Math.round(100 * m1.kept / Math.max(1, all1)) + '%), ' + m1.made + ' made again, ' + m1.plain + ' straight (' + JSON.stringify(m1.why) + ')');
      /* M4 over the AUTO above and a little more */
      await p.waitForTimeout(2000);
      const m4 = await p.evaluate(() => { let bm = 0, all = 0; Object.keys(HOLD.ims).forEach(k => { all++; if (typeof ImageBitmap !== 'undefined' && HOLD.ims[k].b instanceof ImageBitmap) bm++; }); return { img: window.__CIB_IMG, bm, all }; });
      leg(m4.img - cib0 === 0 && m4.bm > 0, 'M4 THE HELD SHEETS DECODE OFF THE PAGE', 'held, melee and carried sheets copied from a decoded <img> on the page\'s thread during AUTO: ' + (m4.img - cib0) + '; sheets in hand ' + m4.bm + ' bitmaps of ' + m4.all);
      /* M2 at four moments, AUTO running between */
      const rows = [];
      for (let k = 0; k < 4; k++) { await p.waitForTimeout(1500); rows.push(...(await p.evaluate(SAME))); }
      const exact = rows.filter(m => m.made.px === 0 && m.kept.px === 0).length, bad = rows.filter(m => !fineBoth(m));
      leg(rows.length > 20 && !bad.length && exact >= rows.length * .75, 'M2 THE SAME MAN BY DAY', rows.length + ' men at four moments: ' + exact + ' the same to the pixel, ' + (rows.length - exact - bad.length) + ' within 2 of 255 or a turned edge (worst ' + Math.max(0, ...rows.map(m => m.made.worst)) + ', at most ' + Math.max(0, ...rows.map(m => m.made.over)) + ' pixels past 2), ' + bad.length + ' not the same' + (bad.length ? ': ' + bad.slice(0, 3).map(m => m.id + ' ' + JSON.stringify(m.made)).join('; ') : ''));
      /* P2: the kept picture a pixel off */
      await p.evaluate(() => { window.__MANC_PLANT_OFF = 1; });
      const off = await p.evaluate(SAME); await p.evaluate(() => { window.__MANC_PLANT_OFF = 0; });
      const offBad = off.filter(m => !fine({ made: m.kept }));
      leg(offBad.length >= off.length / 2, 'P2 planted: his kept picture laid a pixel off is caught', offBad.length + ' of ' + off.length + ' men read not the same');
      /* M3: three men flashing red */
      const m3 = await p.evaluate((SAMEs) => { const SAME = eval('(' + SAMEs + ')'); const men = FIGHT.S.units.filter(v => FIGHT.onField(v) && !v.ghost && !v.machine).slice(0, 3); UI.flash = UI.flash || {}; const now = performance.now(); men.forEach(v => { UI.flash[v.id] = now; });
        const r = SAME().filter(m => men.some(v => v.id === m.id)); men.forEach(v => { delete UI.flash[v.id]; }); return r; }, SAME.toString());
      leg(m3.length === 3 && m3.every(m => m.how === 'straight' && fineBoth(m)), 'M3 THE HIT\'S RED', m3.map(m => m.id + ' ' + m.how + ' worst ' + Math.max(m.made.worst, m.kept.worst) + ' (' + Math.max(m.made.over, m.kept.over) + ' px past 2)').join('; '));
      /* P1: the old way on, nothing kept */
      await p.evaluate(() => { window.__MAN_DRAWN_EVERY_FRAME = true; const s = window.__MANCACHE_STATS; window.__S1 = { kept: s.kept, made: s.made }; });
      await p.waitForTimeout(2500);
      const p1 = await p.evaluate(() => { const s = window.__MANCACHE_STATS, a = window.__S1; window.__MAN_DRAWN_EVERY_FRAME = false; return { kept: s.kept - a.kept, made: s.made - a.made }; });
      leg(p1.kept === 0 && p1.made === 0, 'P1 planted: the old way on reads nothing kept (caught)', 'kept ' + p1.kept + ', made ' + p1.made + ' in 2.5 s of AUTO the old way');
    } catch (e) { leg(false, 'the day page', String(e).slice(0, 200)); }
    await d.close();
  }
  /* ---- the night page: M2n, and M4p (the held sheets the old way) ---- */
  {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: CIB + 'window.__MAN_KEPT_ALWAYS=true;window.__HELD_SHEETS_ON_THE_PAGE=true;window.FIGHT_OPTS=' + JSON.stringify(Object.assign({}, BASE, { seed: 7, night: true })) });
    const p = d.page; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    try {
      await up(p); const cib0 = await p.evaluate(() => window.__CIB_IMG); await auto(p, 1);
      const rows = [];
      for (let k = 0; k < 3; k++) { await p.waitForTimeout(2500); rows.push(...(await p.evaluate(SAME))); }
      const night = await p.evaluate(() => !!FIGHT.S.night), bad = rows.filter(m => !fineBoth(m)), exact = rows.filter(m => m.made.px === 0 && m.kept.px === 0).length;
      leg(night && rows.length > 15 && !bad.length, 'M2n THE SAME MAN AT NIGHT', (night ? 'night' : 'NOT NIGHT') + ', ' + rows.length + ' men at three moments: ' + exact + ' the same to the pixel, ' + (rows.length - exact - bad.length) + ' within 2 of 255 or a turned edge (worst ' + Math.max(0, ...rows.map(m => m.made.worst)) + ', at most ' + Math.max(0, ...rows.map(m => m.made.over)) + ' pixels past 2), ' + bad.length + ' not the same' + (bad.length ? ': ' + bad.slice(0, 3).map(m => m.id + ' ' + JSON.stringify(m.made)).join('; ') : ''));
      const n = await p.evaluate(() => window.__CIB_IMG) - cib0;
      leg(n > 0, 'M4p planted: the held sheets taken the old way are caught', n + ' copies of a decoded <img> on the page\'s thread');
    } catch (e) { leg(false, 'the night page', String(e).slice(0, 200)); }
    await d.close();
  }
  /* ---- M5: the old way and the new way, the CPU slowed 4x, AUTO at 4x ---- */
  const prof = async (old) => {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', throttle: 4, arm: (old ? 'window.__MAN_DRAWN_EVERY_FRAME=true;' : '') + 'window.FIGHT_OPTS=' + JSON.stringify(BASE) });
    const p = d.page; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    try {
      await up(p); await auto(p, 4);
      await p.evaluate(() => { window.__T = 0; const f = () => { window.__T++; requestAnimationFrame(f); }; requestAnimationFrame(f); });
      await p.waitForTimeout(5000);
      const cdp = await p.context().newCDPSession(p);
      await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start');
      const t0 = await p.evaluate(() => window.__T); await p.waitForTimeout(6000); const t1 = await p.evaluate(() => window.__T);
      const { profile } = await cdp.send('Profiler.stop');
      const by = new Map(profile.nodes.map(n => [n.id, n])), parent = new Map(); profile.nodes.forEach(n => (n.children || []).forEach(c => parent.set(c, n.id)));
      let man = 0;
      profile.samples.forEach((id, i) => { const ms = (profile.timeDeltas[i] || 0) / 1000; let q = id; while (q !== undefined) { if (by.get(q).callFrame.functionName === 'drawMan') { man += ms; break; } q = parent.get(q); } });
      const picked = await p.evaluate(() => (window.__MANCACHE_STATS || {}).picked || []);
      await d.close(); return { frames: t1 - t0, man, per: man / Math.max(1, t1 - t0), picked };
    } catch (e) { await d.close(); return { err: String(e).slice(0, 160) }; }
  };
  const o = await prof(true), n = await prof(false);
  leg(!o.err && !n.err && n.per <= o.per * .8, 'M5 THE MEN COST LESS', o.err || n.err || ('the CPU slowed 4x, AUTO at 4x, 6 s: the men drawn ' + o.per.toFixed(1) + ' ms a frame the old way (' + o.frames + ' frames), ' + n.per.toFixed(1) + ' ms the new (' + n.frames + ' frames): ' + Math.round(100 * n.per / Math.max(.01, o.per)) + '%'));
  const pk = (n.picked || []);
  leg(!n.err && pk.length > 0 && pk.every(q => q.mode === 'keep'), 'M6 THE GLASS PICKS THE CHEAPER WAY', 'the CPU slowed 4x: the glass timed the men both ways ' + pk.length + ' time(s) and kept the cheaper: ' + pk.map(q => 'straight ' + q.straight + ' ms a man, kept ' + q.kept + ' -> ' + q.mode).join('; ') + ' (at full speed on a big night fight it keeps them straight when that is cheaper: AUTO AT 4X NEVER CRASHES A3 holds the middle frame)');
  leg(!errs.length, 'E1 nothing threw', errs.slice(0, 3).join(' | ') || 'no page error');
  console.log('\nA MAN IS DRAWN ONCE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
