#!/usr/bin/env node
/* BOHEMIA -- BOSSES gate, 11/26, rule 480(b) and (c) (Paolo 11/26: 'improve on what we already have. And make sure fps is never choppy
   for nothing'; the coordinator's routine 'BOSSES: rule 480'). What THE WHOLE LADDER, WALKED FOR REAL found and fixed stays fixed
   (tools/bohemia_bosses_the_whole_ladder_11_26_26.js, records/BOHEMIA_BOSSES_RULE_480_THE_WHOLE_LADDER_11_26_26.md):

     D1  every boss's change on the map has its card's line AND a line for when there is nothing to count (THE INK fell before his stain
         reached a town and his card said nothing: 'null'; twelve rows had no such line)
     B1  his beat draws every phase, even on a phone whose frame is longer than a phase (THE BARBER on the slowed phone went glide > wipe
         with his place never held on the glass): a 1.8 s frame planted in the glide, the beat still holds his place
     B2  through that hold his place is on the glass
     G1  the next boss's sign waits while his beat plays and his card is up (the map's placing landed inside the camera's move)
     G2  once his card is answered the next sign turns up, and the timer that placed it took under 40 ms on the phone (its redraw moved to
         the next frame, merged: it was 63 to 81 ms, 235 to 282 on the slowed phone)
     F1  his fall draws nothing in its own frame: under 60 ms on the phone (this lane's listener and the map's fell() each forced a whole
         map's draw: 455 ms slowed, 74 after)
   Planted fails for each. One phone, the demo upright, about 3 minutes.
*/
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

/* ---------- D1: the data ---------- */
const ROWS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/boss_act_one.json'), 'utf8')).bosses;
const SKIP = ['verb', 'lead', 'after', 'place', 'boss', 'board', 'crew'];
const changes = (rows) => { const out = []; rows.forEach(b => Object.keys(b).forEach(k => { const v = b[k]; if (v && typeof v === 'object' && !Array.isArray(v) && 'card' in v && SKIP.indexOf(k) < 0) out.push({ n: b.n, k, card: v.card, none: v.card_none }); })); return out; };
const D1 = (rows) => { const c = changes(rows); return c.length > 0 && c.every(x => typeof x.card === 'string' && x.card && typeof x.none === 'string' && x.none); };   /* the line for nothing may still carry a sum (THE POT's till) */
const ch = changes(ROWS);
ok('D1 every boss\'s change on the map has its card\'s line and one for when there is nothing to count (' + ch.length + ' rows)', D1(ROWS), ch.filter(x => !x.none).map(x => x.n + '.' + x.k).join(', ') || 'all ' + ch.length);
const planted = JSON.parse(JSON.stringify(ROWS)); delete planted.filter(b => b.n === 'THE INK')[0].ink.card_none;
ok('P1 planted: THE INK without his line for nothing turns D1 red', !D1(planted), 'THE INK.ink');

/* ---------- the page ---------- */
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const PHASES = (ph) => Array.isArray(ph) && ['glide', 'hold', 'wipe', 'show'].every((p, i) => ph.indexOf(p) >= 0 && (i === 0 || ph.indexOf(p) > ph.indexOf(['glide', 'hold', 'wipe', 'show'][i - 1])));

(async () => {
  console.log('\nEVERY BOSS HOLDS ITS FRAMES (rule 480(b)(c))  the demo, phone_portrait\n');
  const d = await open({ profile: 'phone_portrait', fog: true });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  try {
    const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
    for (let i = 0; i < 120; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data() && FOG.ready).catch(() => false)) break; }
    await fr.evaluate(() => { window.__BOSSES_TALK = true; });
    const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
    for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
    for (let k = 0; k < 6 && await inTown(); k++) { await page.waitForTimeout(900); if (!await tapEl(await page.$('#bohphone .bpctx.town .lv'))) { const sfr = page.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapEl(await sfr.$('#leave')); } await page.waitForTimeout(1500); }
    const guard = setInterval(() => { fr.evaluate(() => { window.__BOSSES_TALK = true; try { if (MEET.up && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
    const st = () => fr.evaluate(() => JSON.parse(JSON.stringify(BohemiaHisMap.state().boss)));
    const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} travelTo(0, 0, c); try { travelGoes(); } catch (e) {} }, c);
    const card = () => fr.evaluate(() => window.__BOSS_CARD && document.getElementById('roadcard') ? JSON.parse(JSON.stringify(window.__BOSS_CARD)) : null).catch(() => null);
    const press = async (i) => { await page.waitForTimeout(700); return tapEl(await fr.$('#roadcard button[data-road="' + i + '"]')); };
    /* THE POT: his sign, walked to, found */
    let s = null; for (let i = 0; i < 120; i++) { await page.waitForTimeout(500); s = await st(); if (s.sign && s.sign.n === 'THE POT') break; }
    for (let k = 0; k < 4 && s.sign && !s.found['THE POT']; k++) { await go([s.sign.x, s.sign.y]); for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); const c = await card(); if (c) { await press(c.kind === 'thing' ? 1 : 0); await page.waitForTimeout(900); } s = await st(); if (s.found['THE POT']) break; } }
    /* the camera leads to his place first (__THE_SIGN_LEADS_TO_HIM__, rule 482), then his card is read out: answered like a player */
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(400); const c = await card(); if (c) { await press(c.kind === 'thing' ? 1 : 0); await page.waitForTimeout(900); continue; }
      const lc = await fr.evaluate(() => window.__BOSS_LEAD_CAM ? !!window.__BOSS_LEAD_CAM.done : true).catch(() => true); if (lc && i > 4) break; }
    s = await st(); const found = !!s.found['THE POT'];
    /* the placing timer, timed where it runs; one 1.8 s frame planted in his beat's glide */
    await fr.evaluate(() => { const ST = window.setTimeout; window.__PS_T = [];
      window.setTimeout = function (fn, ms) { if (typeof fn === 'function' && /placeSign/.test(String(fn))) { const f = fn; fn = function () { const t = performance.now(); try { return f.apply(this, arguments); } finally { window.__PS_T.push(+(performance.now() - t).toFixed(1)); } }; }
        return ST.apply(this, [fn, ms].concat([].slice.call(arguments, 2))); };
      const B = BohemiaBosses, D0 = B.draw; B.draw = function (ox, oy) { const out = D0.apply(this, arguments);   /* read inside the draw that paints the hold */
        try { const b = window.__BOSS_BEAT; if (b && !b.done && !window.__GATE_HOLD && b.phases[b.phases.length - 1] === 'hold') { const p = iso(b.at[0], b.at[1], ox, oy), gy = p.sy + TH / 2;
          window.__GATE_HOLD = { sx: Math.round(p.sx), sy: Math.round(gy), W: Math.round(CVW), H: Math.round(CVH), on: p.sx >= 0 && p.sx <= CVW && gy >= 0 && gy <= CVH }; } } catch (e) {}
        return out; };
      window.__GATE_HOLD = null; window.__GATE_STALLED = 0; window.__GATE_SIGN_IN_BEAT = [];
      (function w() { try { const b = window.__BOSS_BEAT;
          if (b && !b.done && b.phases.length === 1 && !window.__GATE_STALLED) { window.__GATE_STALLED = performance.now(); const t = performance.now(); while (performance.now() - t < 1800) {} }
          if (b && !b.done) window.__GATE_SIGN_IN_BEAT.push(!!BohemiaHisMap.state().boss.sign);
        } catch (e) {} requestAnimationFrame(w); })(); });
    const fellMs = await fr.evaluate(() => { const t = performance.now(); BohemiaHisMap.fell('THE POT'); return +(performance.now() - t).toFixed(1); });
    let af = null, signWhileCard = [];
    for (let i = 0; i < 160 && !af; i++) { await page.waitForTimeout(250); const c = await card(); if (c && c.kind === 'after' && c.n === 'THE POT') af = c; }
    for (let i = 0; i < 12; i++) { await page.waitForTimeout(500); signWhileCard.push(!!(await st()).sign); }
    const bt = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_BEAT || null)));
    const hold = await fr.evaluate(() => window.__GATE_HOLD);
    const inBeat = await fr.evaluate(() => window.__GATE_SIGN_IN_BEAT.slice());
    ok('B1 his beat draws every phase with a 1.8 s frame planted in its glide (glide, hold, wipe, show, in order)', found && !!bt && PHASES(bt.phases), JSON.stringify({ found, phases: bt && bt.phases, caught: bt && bt.caught, stalled: !!(await fr.evaluate(() => window.__GATE_STALLED)) }));
    ok('P2 planted: a beat that went glide > wipe > show turns B1 red', !PHASES(['glide', 'wipe', 'show']), 'glide>wipe>show');
    const F1 = (ms) => typeof ms === 'number' && ms < 60;
    ok('F1 his fall (the map\'s fell() and this lane\'s listener) draws nothing in its own frame: under 60 ms on the phone (a whole map drawn there was 455 ms slowed)', F1(fellMs), fellMs + ' ms');
    ok('P6 planted: a fall that drew the whole map (120 ms) turns F1 red', !F1(120), '120 ms');
    ok('B2 through the hold his place is on the glass', !!hold && hold.on, JSON.stringify(hold));
    ok('P3 planted: a place drawn past the glass\'s edge turns B2 red', !(hold && Object.assign({}, hold, { on: false }).on), 'off');
    const G1 = (beat, cardUp) => beat.length > 0 && beat.every(x => !x) && cardUp.length > 0 && cardUp.every(x => !x);
    ok('G1 the next sign waits while his beat plays (' + inBeat.length + ' frames) and his card is up (6 s)', !!af && G1(inBeat, signWhileCard), JSON.stringify({ card: !!af, signInBeat: inBeat.filter(Boolean).length, signWhileCard: signWhileCard.filter(Boolean).length }));
    ok('P4 planted: a sign placed during the beat turns G1 red', !G1(inBeat.concat([true]), signWhileCard), 'a sign in the beat');
    if (af) await press(0);
    let sign2 = null; for (let i = 0; i < 60 && !sign2; i++) { await page.waitForTimeout(500); await fr.evaluate(() => { try { render(); } catch (e) {} }); s = await st(); if (s.sign && s.sign.n !== 'THE POT') sign2 = s.sign; }
    const ps = await fr.evaluate(() => window.__PS_T.slice());
    const G2 = (sg, t) => !!sg && t.length > 0 && Math.max.apply(null, t) < 40;
    ok('G2 once his card is answered the next sign turns up, and the timer that placed it took under 40 ms (its redraw on the next frame)', G2(sign2, ps), JSON.stringify({ next: sign2 && [sign2.n, sign2.x, sign2.y], ms: ps }));
    ok('P5 planted: a placing that drew the whole map in its timer (70 ms) turns G2 red', !G2(sign2, ps.concat([70])), '70 ms');
    clearInterval(guard);
    ok('C0 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) { ok('the gate ran', false, String(e && e.stack || e).slice(0, 300)); }
  await d.close();
  console.log('\nEVERY BOSS HOLDS ITS FRAMES: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
