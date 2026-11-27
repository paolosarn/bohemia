#!/usr/bin/env node
/* ============================================================================
   THE CAMP COMES ALIVE (CAMP FOUR, 11/27/26; VAMILY rules 482, 487, 472(b)(e), 484 amended, 441).
   The coordinator's round (11/27, rule 482): 'camp better again: time passing in camp ties to the clock now moving to the top of the
   screen (rule 487, UI FIVE), HEAL never slow, and the crew idling looks alive.' Paolo 11/27 (rule 487): 'take it off the phone and
   put it at the top of the screen cause I feel like people aren't connecting'; 11/22 (rule 472): 'just breathing and idling around...
   see them chilling'.
   On the demo:
     C1 ONE CLOCK AT THE TOP (upright and on its side): HEAL at 16:00 with his men hurt: UI FIVE's clock stands on the map's bar (BUILD
        11/27f THE CLOCK UP TOP) and the camp draws no clock of its own: the tape's line hangs under that clock and counts the hours while
        they run, STOP and EVERYONE WHOLE at the stop, its words gone after; the camp's time is handed to the top page (top.__CAMP_TIME,
        running then stopped)
     C2 NO CLOCK ON THE BAR, THE CAMP'S OWN (upright and on its side): UI FIVE's clock taken off the bar (planted): the camp's own clock
        stands at the top in the middle (its middle within 12 px of the glass's, its top within 40 px), 'DAY n HH:MM', the sun by day and
        the moon from six, and stays once they are whole
     C3 THE CREW LIVES (upright, a camp made whole by day, the drift hurried to 700 ms for the gate only): within twenty drifts his men
        (never YOU) are seen in at least three of ANIMATION's idle acts the camp never used before (talk, smoke, drink, sit) or the pot,
        two of them talking face to face (a stride apart, each turned to the other) at least once, drawn in ANIMATION's own act
        ('anim:talk'), and no two men ever on one spot (40 px)
     C4 HEAL IS WARM (upright): a road fight won, his men hurt on the loot screen, LEAVE: no camp page is read while the fight's page is
        alive (rule 484 amended); on the map, once it is quiet, the camp's page is read; HEAL takes it (the board says so) and the camp is
        drawn; a fight's card lets a warm page go (one hidden fight page at a time)
     P1 PLANTED (upright): window.__CAMP_IDLE_PLAIN turns C3 red (none of the new acts); window.__HEAL_COLD turns C4 red (no page read,
        HEAL reads it cold)
   node gates/the_camp_comes_alive_gate.js [--way upright|side]
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const K = require(path.join(ROOT, 'tools/bohemia_camp_is_the_board.js'));
const WAY = (() => { const i = process.argv.indexOf('--way'); return i > 0 ? process.argv[i + 1] : null; })();
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + String(x).slice(0, 700) + ']' : '')); };
const WAYS = [{ name: 'upright', profile: 'phone_portrait' }, { name: 'on its side', profile: 'phone_landscape' }].filter(w => !WAY || w.name.indexOf(WAY === 'side' ? 'side' : WAY) >= 0);
const REST = () => { try { loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} };
const SET = ([minute, cut]) => { try { for (let k = 0; k < 8; k++) { const dm = ((minute - T.min) + 1440) % 1440; if (dm < 3) break; advance(Math.min(dm, 300)); } } catch (e) {}   /* five hours a step, read back: a long advance is not one step on the map */
  const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null') || { men: {}, dead: [] }; s.men = s.men || {}; s.dead = s.dead || [];
  BohemiaCondition.company(LOOP.start && LOOP.start.company).names.forEach((k) => { s.men[k] = Object.assign(s.men[k] || {}, { shown: (s.men[k] && s.men[k].shown) || k, main: k === 'YOU', hpMax: 60, lostHp: 60 * cut, armHMax: 20, lostH: 20 * cut, armBMax: 80, lostB: 80 * cut, wound: null }); });
  localStorage.setItem(KEY, JSON.stringify(s)); const W = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}'); W.tape = 400; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(W));
  return { mending: BohemiaMapCamp.mending(), min: T.min }; };
const HURT = (cut) => { const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null') || { men: {}, dead: [] }; s.men = s.men || {}; s.dead = s.dead || [];
  BohemiaCondition.company(LOOP.start && LOOP.start.company).names.forEach(k => { s.men[k] = Object.assign(s.men[k] || {}, { shown: (s.men[k] && s.men[k].shown) || k, main: k === 'YOU', hpMax: 60, lostHp: 60 * cut, armHMax: 20, lostH: 20 * cut, armBMax: 80, lostB: 80 * cut, wound: null }); });
  localStorage.setItem(KEY, JSON.stringify(s)); return BohemiaMapCamp.mending(); };
const settle = (p) => p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url()));
const READ = () => { try { const L = BohemiaCampLook.state(); return { tape: L.tape, whole: L.whole, pitch: L.pitch ? (L.pitch.on ? 'on' : 'done') : null, spots: L.spots, drawnBy: L.drawnBy || null, W: innerWidth, H: innerHeight, top: (function () { try { return window.top.__CAMP_TIME || null; } catch (e) { return null; } })() }; } catch (e) { return null; } };
async function campRun(d, minute, cut, n) {
  const p = d.page, fr = d.fr;
  await fr.evaluate(REST); await fr.evaluate(D.offTheTown); await p.waitForTimeout(600);
  await fr.evaluate(SET, [minute, cut]);
  const pressed = await p.evaluate(() => { try { return BohemiaPhone.press('heal'); } catch (e) { return false; } });
  const S = []; let wholeAt = null;
  for (let i = 0; i < (n || 400); i++) { await p.waitForTimeout(150);
    const f = settle(p), r = f ? await f.evaluate(READ).catch(() => null) : null; if (!r) continue; r.t = i * 150; S.push(r);
    if (r.whole && wholeAt == null) wholeAt = S.length - 1;
    if (wholeAt != null && S.length - 1 - wholeAt > 40) break; }
  return { pressed, S, wholeAt };
}
async function campOff(d) { await d.fr.evaluate(() => { try { BohemiaMapCamp.road(); } catch (e) {} try { BohemiaMapCamp.break(); } catch (e) {} }).catch(() => {}); await d.page.waitForTimeout(2500); }

/* UI FIVE's clock on the map's bar (BUILD 11/27f THE CLOCK UP TOP): its box in the top page and its minute */
const BAND = () => { try { const f = document.getElementById('cityFrame'), fr = f.getBoundingClientRect(), w = f.contentWindow, e = w.document.querySelector('#bmtb .s.clk[data-f=clock]'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 ? { left: fr.left + r.left, right: fr.left + r.right, bottom: fr.top + r.bottom, min: +e.getAttribute('data-min'), day: +e.getAttribute('data-day') } : { hidden: true }; } catch (e) { return null; } };
async function clockLeg(d, tag) {
  const p = d.page;
  const C = await campRun(d, 960, 0.45), S = C.S, W = C.wholeAt, band = await p.evaluate(BAND);
  const run = S.filter((r, i) => r.pitch === 'done' && r.tape && !r.whole && (W == null || i < W));
  const after = W != null ? S[Math.min(S.length - 1, W + 38)] : null, atW = W != null ? S[Math.min(S.length - 1, W + 7)] : null;
  const under = (r) => r && r.tape && r.tape.under && r.tape.band && !/DAY/.test(String(r.tape.clock)) && (!band || band.hidden || r.tape.pageY >= band.bottom - 1);
  const hrs = run.map(r => +((String(r.tape.l1).match(/\+(\d+)/) || [])[1] || -1));
  const told = S.map(r => r.top).filter(Boolean), toldRun = told.some(t => t.running), toldStop = told.some(t => t.whole && !t.running);
  ok('C1 ' + tag + ': ONE CLOCK AT THE TOP: UI FIVE\'s clock on the bar, the camp draws none of its own; the tape hangs under it and counts the hours while they run, STOP and EVERYONE WHOLE at the stop, its words gone after; the time handed to the top page',
    C.pressed && !!band && !band.hidden && run.length >= 3 && run.every(under) && hrs[hrs.length - 1] > hrs[0] && !!atW && /STOP/.test(String(atW.tape && atW.tape.l1)) && /WHOLE/.test(String(atW.tape && atW.tape.l2)) && !!after && !!after.tape && !after.tape.l1 && toldRun && toldStop,
    JSON.stringify({ band, reads: run.length, first: run[0] && run[0].tape, hours: [hrs[0], hrs[hrs.length - 1]], atWhole: atW && atW.tape, after: after && after.tape, told: told.length && told[told.length - 1] }));
}
async function ownLeg(d, tag) {
  const p = d.page;
  await p.evaluate(() => { const w = document.getElementById('cityFrame').contentWindow, st = w.document.createElement('style'); st.id = 'gateNoBandClock'; st.textContent = '#bmtb .s.clk{display:none!important}'; w.document.head.appendChild(st); });
  const C = await campRun(d, 960, 0.45), S = C.S, W = C.wholeAt;
  await p.evaluate(() => { const w = document.getElementById('cityFrame').contentWindow, st = w.document.getElementById('gateNoBandClock'); if (st) st.remove(); });
  const run = S.filter((r, i) => r.pitch === 'done' && r.tape && !r.whole && (W == null || i < W));
  const after = W != null ? S[Math.min(S.length - 1, W + 38)] : null;
  const atTop = (r) => r && r.tape && r.tape.top && !r.tape.under && Math.abs((r.tape.x + r.tape.w / 2) - r.W / 2) <= 12 && r.tape.y <= 40;
  const sun = run.find(r => /^DAY \d+\s+1[0-7]:/.test(r.tape.clock) && r.tape.night === false), moon = S.find(r => r.tape && /^DAY \d+\s+(1[89]|2\d|0[0-5]):/.test(r.tape.clock) && r.tape.night === true);
  ok('C2 ' + tag + ': NO CLOCK ON THE BAR, THE CAMP\'S OWN: with UI FIVE\'s clock off the bar, the camp\'s own clock stands at the top in the middle, DAY and the time, the sun by day and the moon from six, and stays once they are whole',
    run.length >= 3 && run.every(atTop) && !!sun && !!moon && !!after && atTop(after) && /^DAY \d+\s+\d\d:\d\d$/.test(after.tape.clock),
    JSON.stringify({ reads: run.length, first: run[0] && run[0].tape, sun: sun && sun.tape.clock, moon: moon && moon.tape.clock, after: after && after.tape }));
  await campOff(d);
}
async function livesLeg(d, plant) {
  const p = d.page;
  await p.evaluate((pl) => { window.__CAMP_IDLE_PLAIN = !!pl; [...document.querySelectorAll('iframe')].forEach(x => { try { x.contentWindow.__CAMP_IDLE_PLAIN = !!pl; } catch (e) {} }); }, plant);
  await d.fr.evaluate(REST); await d.fr.evaluate(D.offTheTown); await p.waitForTimeout(600);
  const set = await d.fr.evaluate(SET, [600, 0]);   /* ten in the morning, nobody hurt: the camp is made whole, its clock stopped */
  await p.evaluate(() => { try { BohemiaPhone.press('heal'); } catch (e) {} });
  let f = null; for (let k = 0; k < 200; k++) { f = settle(p); const st = f ? await f.evaluate(() => { try { const P = BohemiaCampLook.state().pitch; return BohemiaCampLook.drawn() && P && !P.on; } catch (e) { return false; } }).catch(() => false) : false; if (st) break; await p.waitForTimeout(150); }
  await f.evaluate((pl) => { window.__CAMP_DRIFT_MS = 700; window.__CAMP_IDLE_PLAIN = !!pl; }, plant).catch(() => {});
  const seen = {}, talkPairs = [], stacked = [], anims = {};
  for (let i = 0; i < 70; i++) { await p.waitForTimeout(220);
    const r = await f.evaluate(READ).catch(() => null); if (!r || !r.spots) continue;
    const men = r.spots.filter(q => q.name !== 'YOU');
    men.forEach(q => { seen[q.act] = (seen[q.act] | 0) + 1; });
    const T = men.filter(q => q.act === 'talk');
    for (let a = 0; a < T.length; a++) for (let b = a + 1; b < T.length; b++) { const A = T[a], B = T[b], dd = Math.hypot(A.x - B.x, A.y - B.y);
      const faceTo = (P, Q) => { const ang = Math.atan2((Q.y - P.y) * 2, Q.x - P.x), k = Math.round(ang / (Math.PI / 4)); return ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'][((k % 8) + 8) % 8]; };
      if (dd < 120 && A.face === faceTo(A, B) && B.face === faceTo(B, A)) talkPairs.push({ a: A.name, b: B.name, d: Math.round(dd) }); }
    const all = r.spots; for (let a = 0; a < all.length; a++) for (let b = a + 1; b < all.length; b++) if (Math.hypot(all[a].x - all[b].x, all[a].y - all[b].y) < 40 && all[a].act !== 'lie' && all[b].act !== 'lie') stacked.push([all[a].name, all[b].name]);
    Object.entries(r.drawnBy || {}).forEach(([k, v]) => { anims[v] = (anims[v] | 0) + 1; });
  }
  await f.evaluate(() => { window.__CAMP_DRIFT_MS = 0; window.__CAMP_IDLE_PLAIN = false; }).catch(() => {});
  await p.evaluate(() => { window.__CAMP_IDLE_PLAIN = false; [...document.querySelectorAll('iframe')].forEach(x => { try { x.contentWindow.__CAMP_IDLE_PLAIN = false; } catch (e) {} }); });
  await campOff(d);
  const NEW = ['talk', 'smoke', 'drink', 'sit'], kinds = NEW.concat(['cook']).filter(k => seen[k]);
  return { at: set && set.min, seen, kinds, newSeen: NEW.filter(k => seen[k]), talkPairs: talkPairs.length, pair: talkPairs[0] || null, stacked: stacked.length, anims };
}
async function warmLeg(d, cold) {
  const p = d.page, fr = d.fr;
  await p.evaluate((c) => { window.__HEAL_COLD = !!c; }, cold);
  const made0 = await p.evaluate(() => window.CW ? CW.made : 0);
  await fr.evaluate(REST); await fr.evaluate(D.offTheTown).catch(() => null);
  const r = await K.oneFight(d, { fam: '^suburb$', end: 'won', lootMs: 5000, leave: true, onLoot: () => fr.evaluate(HURT, 0.5) });
  const atLeave = r.warmAtLeave;
  const tw = Date.now(); let cw = null;
  for (let k = 0; k < 60; k++) { cw = await p.evaluate(() => window.CW ? { made: CW.made, on: !!CW.fr, loaded: !!CW.loaded, why: CW.why } : null); if (cw && cw.loaded) break; await p.waitForTimeout(250); }
  const waited = Date.now() - tw;
  await fr.evaluate(REST); await p.waitForTimeout(600);
  const sf0 = settle(p), heal0 = sf0 ? await sf0.evaluate(() => { try { return BohemiaCampBoard.state().heal.warm | 0; } catch (e) { return 0; } }).catch(() => 0) : 0;
  const t0 = Date.now(); await fr.evaluate(() => BohemiaMapCamp.make());
  let first = null, cb = null;
  for (let k = 0; k < 400; k++) { const sf = settle(p); const st = sf ? await sf.evaluate(() => { try { const C = BohemiaCampBoard.state(), L = BohemiaCampLook.state(); return { st: C.state, drawn: BohemiaCampLook.drawn() && !!L.drawnAt, warm: C.heal, ms: C.ms }; } catch (e) { return null; } }).catch(() => null) : null;
    if (st && st.st === 'in' && st.drawn) { first = Date.now() - t0; cb = st; break; } await p.waitForTimeout(100); }
  const after = await p.evaluate(() => window.CW ? { made: CW.made, taken: CW.taken, on: !!CW.fr } : null);
  await campOff(d);
  /* a fight's card lets a warm page go */
  let card = null;
  if (!cold) { await p.evaluate(() => { campWarm('gate'); }); for (let k = 0; k < 40; k++) { if (await p.evaluate(() => !!(CW.fr && CW.loaded))) break; await p.waitForTimeout(250); }
    await p.evaluate(() => { try { nfWarm('gate'); } catch (e) {} });
    card = await p.evaluate(() => ({ on: !!CW.fr, why: CW.droppedWhy, fightWarm: !!(window.NFW && NFW.fr) }));
    await p.evaluate(() => { try { nfWarmDrop('gate'); } catch (e) {} }); }
  await p.evaluate(() => { window.__HEAL_COLD = false; });
  return { err: r.err || null, left: r.left, atLeave, madeAtLeave: atLeave ? atLeave.made - made0 : null, madeOnMap: cw ? cw.made - made0 : null, cw, waited, first, warm: cb && cb.warm, healTaken: cb && cb.warm ? (cb.warm.warm | 0) - heal0 : null, after, card };
}

async function run(way) {
  let d; try { d = await D.open({ profile: way.profile, door: 180000, engage: true }); }
  catch (e) { ok('the demo opened ' + way.name, false, String(e.message).slice(0, 160)); return; }
  const p = d.page, tag = way.name;
  try {
    await p.waitForTimeout(2500);
    await clockLeg(d, tag); await campOff(d);
    await ownLeg(d, tag);
    if (way.profile === 'phone_portrait') {
      const L = await livesLeg(d, false);
      ok('C3 upright: THE CREW LIVES: his men in ANIMATION\'s idle acts (three or more of talk, smoke, drink, sit, the pot), two talking face to face, drawn in its talk, and never two on one spot',
        L.newSeen.length >= 2 && L.kinds.length >= 3 && L.talkPairs >= 1 && (L.anims['anim:talk'] | 0) > 0 && L.stacked === 0, JSON.stringify(L));
      const W = await warmLeg(d, false);
      ok('C4 upright: HEAL IS WARM: nothing read on the loot screen, the camp\'s page read on the quiet map, HEAL takes it and the camp is drawn, a fight\'s card lets it go',
        !W.err && W.left && W.madeAtLeave === 0 && W.madeOnMap >= 1 && W.cw && W.cw.loaded && W.cw.why === 'heal' && W.first != null && W.healTaken >= 1 && W.after && W.after.taken >= 1 && W.card && !W.card.on && /card/.test(String(W.card.why)),
        JSON.stringify(W));
      const PL = await livesLeg(d, true), PW = await warmLeg(d, true);
      ok('P1 PLANTED: __CAMP_IDLE_PLAIN turns C3 red (none of the new acts) and __HEAL_COLD turns C4 red (no page read, HEAL reads cold)',
        PL.newSeen.length === 0 && PW.madeOnMap === 0 && PW.healTaken === 0, JSON.stringify({ plain: PL.seen, cold: { made: PW.madeOnMap, warm: PW.warm, first: PW.first }, plainAt: PL.at }));
      console.log('  (HEAL\'s first frame: warm ' + W.first + ' ms, cold ' + PW.first + ' ms, this box at full speed)');
    }
  } catch (e) { ok('the run ' + tag, false, String(e && e.stack || e).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
}
(async () => {
  console.log('THE CAMP COMES ALIVE (the demo)');
  for (const w of WAYS) await run(w);
  console.log('\nTHE CAMP COMES ALIVE: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();
