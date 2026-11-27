#!/usr/bin/env node
/* ============================================================================
   THE CAMP READS AT A GLANCE (CAMP FOUR, 11/26/26; VAMILY rules 482 and 480(b) on rule 472(b), rule 441).
   The coordinator's round (11/26, rule 482): 'camp as it is, better: the crew idling and healing reads at a glance, the time passing
   feels like time, zooming in on a man in camp looks good'. Paolo 11/22 (rule 472): 'I want time to go by until everyone's healed...
   What if I want to zoom in on my character, see them chilling?'
   On the demo upright and on its side: HEAL on the map at 16:00 with his men hurt, watched every 150 ms to the stop, then two fingers in.
     G1 THEIR BARS AT A GLANCE: while they mend, the fight's two bars over every man of his (YOU too), and a man's blood rises on them
     G2 WHOLE: the hour they are whole every bar reads full, and five seconds later the bars are gone (the camp is his men idling)
     G3 THE TAPE RUNS: while they mend the tape counts the hours gone, rising; at whole it reads STOP and EVERYONE WHOLE; five seconds
        later its words are gone (RE-AIMED 11/27, CAMP FOUR, rule 487: the tape is the line under the camp's clock at the top, and the clock
        stays; gates/the_camp_comes_alive_gate.js holds the clock)
     G4 THE HOURS ON THE GROUND: each man's shadow moves with the hour (the sun's swing) while the hours run
     G5 THE DUSK COMES OVER: the hours crossing five to seven, the night's picture is laid over the day's part of the way (never a swap)
     G6 THE NIGHT LAID IN: by nightfall the screen's own picture slots hold the camp's day and its night, two pictures (the look's '+'
        swap reaches them: before 11/26 it looked for them where they are not, and a camp that stood on its first light kept it)
     G7 THE PINCH FINDS A MAN: two fingers in at the camp's middle end with one of his men on the glass, his ground softened past twice
        its pixels (a camcorder's digital zoom), never a mosaic
     P1 PLANTED (upright, once): the bars and the tape switched off turn G1 and G3 red
   node gates/the_camp_reads_at_a_glance_gate.js [--alpha] [--way upright|side]
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const ALPHA = process.argv.indexOf('--alpha') > 0;
const WAY = (() => { const i = process.argv.indexOf('--way'); return i > 0 ? process.argv[i + 1] : null; })();
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + String(x).slice(0, 600) + ']' : '')); };
const WAYS = [{ name: 'upright', profile: 'phone_portrait' }, { name: 'on its side', profile: 'phone_landscape' }].filter(w => !WAY || w.name.indexOf(WAY === 'side' ? 'side' : WAY) >= 0);
const REST = () => { try { loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} };
/* the clock moved to the minute asked (the map's own advance), every man hurt, tape for it */
const SET = ([minute, cut]) => { try { const dm = ((minute - T.min) + 1440) % 1440; if (dm) advance(dm); } catch (e) {}
  const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null') || { men: {}, dead: [] }; s.men = s.men || {}; s.dead = s.dead || [];
  BohemiaCondition.company().names.forEach((k, i) => { s.men[k] = Object.assign(s.men[k] || {}, { shown: (s.men[k] && s.men[k].shown) || k, main: k === 'YOU', hpMax: 60, lostHp: 60 * cut, armHMax: 20, lostH: 20 * cut, armBMax: 80, lostB: 80 * cut, wound: null }); });
  localStorage.setItem(KEY, JSON.stringify(s)); const W = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}'); W.tape = 400; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(W));
  return BohemiaCondition.company().names.length; };
const settle = (p) => p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url()));
const READ = () => { try { const L = BohemiaCampLook.state(); return { men: L.men | 0, bars: L.bars, sun: L.sun, tape: L.tape, whole: L.whole, hour: L.hour, night: L.night, nightIn: L.nightIn | 0, twoLights: (function () { const P = window.__SETTLE_PIC; return !!(P && P.day && P.night && P.day !== P.night); })(), pitch: L.pitch ? (L.pitch.on ? 'on' : 'done') : null, dusk: window.__CAMP_DUSK || null, soft: window.__CAMP_SOFT | 0, man: window.__PINCH_MAN || null, drawnAt: L.drawnAt, W: innerWidth, H: innerHeight }; } catch (e) { return null; } };
async function camp(d, minute, cut, plant) {
  const p = d.page, fr = d.fr;
  await fr.evaluate(REST); await fr.evaluate(D.offTheTown); await p.waitForTimeout(600);
  const n = await fr.evaluate(SET, [minute, cut]);
  if (plant) await p.evaluate(() => { const f = [...document.querySelectorAll('iframe')]; window.__CAMP_NO_BARS = true; window.__CAMP_NO_TAPE = true; f.forEach(x => { try { x.contentWindow.__CAMP_NO_BARS = true; x.contentWindow.__CAMP_NO_TAPE = true; } catch (e) {} }); });
  const pressed = await p.evaluate(() => { try { return BohemiaPhone.press('heal'); } catch (e) { return false; } });
  const S = []; let wholeAt = null;
  for (let i = 0; i < 400; i++) { await p.waitForTimeout(150);
    const f = settle(p); if (plant && f) await f.evaluate(() => { window.__CAMP_NO_BARS = true; window.__CAMP_NO_TAPE = true; }).catch(() => {});
    const r = f ? await f.evaluate(READ).catch(() => null) : null; if (!r) continue; r.t = i * 150; S.push(r);
    if (r.whole && wholeAt == null) wholeAt = S.length - 1;
    if (wholeAt != null && S.length - 1 - wholeAt > 40) break; }   /* six seconds past the stop */
  return { n, pressed, S, wholeAt };
}
async function run(way) {
  let d; try { d = await D.open({ profile: way.profile, door: 180000, engage: true, alpha: ALPHA || undefined }); }
  catch (e) { ok('the ' + (ALPHA ? 'alpha' : 'demo') + ' opened ' + way.name, false, String(e.message).slice(0, 160)); return; }
  const p = d.page, tag = way.name;
  try {
    await p.waitForTimeout(2500);
    const C = await camp(d, 960, 0.45, false), S = C.S, W = C.wholeAt;
    const mend = S.filter((r, i) => r.pitch === 'done' && !r.whole && (W == null || i < W));
    const menN = Math.max(1, ...S.map(r => r.men | 0)), mendBars = mend.filter(r => r.bars && r.bars.shown >= menN);
    const keys = mend.length ? Object.keys(mend[mend.length - 1].bars.at || {}) : [];
    const rose = keys.some(k => { const a = mend.find(r => r.bars.at && r.bars.at[k]), b = [...mend].reverse().find(r => r.bars.at && r.bars.at[k]); return a && b && b.bars.at[k].b > a.bars.at[k].b + 0.03; });
    ok('G1 ' + tag + ': THEIR BARS AT A GLANCE: while they mend the bars stand over every man of his and a man\'s blood rises on them', C.pressed && mend.length >= 3 && mendBars.length >= mend.length * 0.8 && rose,
      JSON.stringify({ men: menN, mendReads: mend.length, withAllBars: mendBars.length, rose, last: mend.length ? mend[mend.length - 1].bars.at : null }));
    const atW = W != null ? S[Math.min(S.length - 1, W + 7)] : null, after = W != null ? S[Math.min(S.length - 1, W + 38)] : null;
    ok('G2 ' + tag + ': WHOLE: every bar full at the stop, and the bars gone five seconds on', !!atW && Object.values(atW.bars.at || {}).every(v => v.b >= 0.98 && v.a >= 0.98) && atW.bars.shown >= Math.max(1, ...S.map(r => r.men | 0)) && !!after && after.bars.shown === 0,
      JSON.stringify({ wholeRead: W, atWhole: atW && atW.bars, after: after && after.bars && { shown: after.bars.shown, alpha: after.bars.alpha } }));
    const tapes = mend.map(r => r.tape).filter(Boolean), hrs = tapes.map(t => +((String(t.l1 + ' ' + t.l2).match(/\+(\d+)/) || [])[1] || -1));   /* RE-AIMED 11/27: the hours on the tape's line under the clock */
    ok('G3 ' + tag + ': THE TAPE RUNS: the hours gone counted while they mend, STOP and EVERYONE WHOLE at the stop, its words gone five seconds on (the clock stays)',
      tapes.length >= 3 && hrs[hrs.length - 1] > hrs[0] && !!atW && !!atW.tape && /STOP/.test(atW.tape.l1) && /WHOLE/.test(atW.tape.l2) && !!after && (!after.tape || (!after.tape.l1 && !after.tape.l2 && !!after.tape.clock)),   /* RE-AIMED 11/27 (CAMP FOUR, rule 487): the tape's words go, the camp's clock stays at the top */
      JSON.stringify({ first: tapes[0], last: tapes[tapes.length - 1], atWhole: atW && atW.tape, after: after && after.tape }));
    const dxs = mend.map(r => r.sun && r.sun.shadowDx).filter(v => v != null);
    ok('G4 ' + tag + ': THE HOURS ON THE GROUND: the men\'s shadows swing with the hour while it runs', dxs.length >= 3 && Math.max(...dxs) - Math.min(...dxs) >= 5, JSON.stringify({ min: Math.min(...dxs), max: Math.max(...dxs), reads: dxs.length }));
    const dusks = S.filter(r => r.dusk && r.dusk.mix > 0.05 && r.dusk.mix < 0.95);
    ok('G5 ' + tag + ': THE DUSK COMES OVER: from five to seven the night laid over the day part of the way, never a swap', dusks.length >= 2, JSON.stringify({ seen: dusks.length, mixes: dusks.slice(0, 6).map(r => r.dusk.mix), hours: [S[0] && S[0].hour, S[S.length - 1] && S[S.length - 1].hour] }));
    const last = S.length ? S[S.length - 1] : null;
    ok('G6 ' + tag + ': THE NIGHT LAID IN: by nightfall the screen\'s own slots hold the camp\'s day and its night, two pictures (the look\'s swap reaches them)', !!last && last.twoLights, JSON.stringify({ twoLights: last && last.twoLights, swaps: last && last.nightIn, night: last && last.night }));
    /* G7: two fingers in at the camp's middle */
    const box = await p.evaluate(() => { const f = document.getElementById('cityFrame').getBoundingClientRect(); return [f.left + f.width / 2, f.top + f.height * 0.42]; });
    const cdp = await p.context().newCDPSession(p), pts = (dx) => [{ x: box[0] - 30 - dx, y: box[1], id: 1 }, { x: box[0] + 30 + dx, y: box[1], id: 2 }];
    for (let r = 0; r < 3; r++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts(0) });
      for (let j = 1; j <= 12; j++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pts(j * 16) }); await p.waitForTimeout(30); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(400); }
    await p.waitForTimeout(700);
    const f = settle(p), z = f ? await f.evaluate(READ).catch(() => null) : null;
    const who = z && z.man && z.man.who, at = who && z.drawnAt ? (z.drawnAt['m:' + who] || null) : null;
    const lead = who === 'YOU' && f ? await f.evaluate(() => { const l = BohemiaSettlement.lead(); const v = BohemiaSettlement.campView(); return [v.ox + l.x * v.s, v.oy + l.y * v.s]; }).catch(() => null) : null;
    const pos = at || lead, onGlass = !!pos && pos[0] > 0 && pos[0] < z.W && pos[1] > 40 && pos[1] < z.H;
    ok('G7 ' + tag + ': THE PINCH FINDS A MAN: two fingers in at the middle end with one of his men on the glass, his ground softened, never a mosaic', !!who && onGlass && z.soft > 0,
      JSON.stringify({ man: z && z.man, at: pos && pos.map(Math.round), glass: z && [z.W, z.H], soft: z && z.soft }));
    if (way.profile === 'phone_portrait') {
      await fr(d).evaluate(() => { try { BohemiaMapCamp.road(); } catch (e) {} }).catch(() => {}); await p.waitForTimeout(2500);
      const P = await camp(d, 600, 0.3, true), PM = P.S.filter(r => r.pitch === 'done' && !r.whole);
      ok('P1 PLANTED: the bars and the tape off turn G1 and G3 red', PM.length >= 1 && PM.every(r => !r.bars || !r.bars.shown) && PM.every(r => !r.tape), JSON.stringify({ reads: PM.length, bars: PM.map(r => r.bars && r.bars.shown).slice(0, 5), tape: PM.map(r => !!r.tape).slice(0, 5) }));
    }
  } catch (e) { ok('the run ' + tag, false, String(e && e.stack || e).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
}
function fr(d) { return d.fr; }
(async () => {
  console.log('THE CAMP READS AT A GLANCE' + (ALPHA ? ' (the alpha)' : ' (the demo)'));
  for (const w of WAYS) await run(w);
  console.log('\nTHE CAMP READS AT A GLANCE: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();
