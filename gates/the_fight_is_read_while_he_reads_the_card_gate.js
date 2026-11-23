#!/usr/bin/env node
/* ============================================================================
   THE FIGHT IS READ WHILE HE READS THE CARD GATE (PLUMBER 8, 11/22/26; VAMILY rule 472(e), rule 441).

   PAOLO 11/22 (of the camp): 'it's just like the combat map, it freezes for like 10 seconds and then everything's populated in.'
   MEASURED (the demo upright, CPU 4x, the GPU canvas, a phone's 100 ms round trip): from ENGAGE the map's camera comes down, then the
   fight's page was made, read and run (2.2 to 5.0 s after the tap), its files read, its board dealt, its ground asked, and the board up.
   NOW the fight's page is opened hidden the moment the meet card is up (BOHEMIA_ALPHA_0_9.html nfWarm), read and its files loaded
   while he reads, and it waits (BOHEMIA_FIGHT.html fightGo); the fight takes it. records/BOHEMIA_PLUMBER_THE_FIGHT_IS_READ_WHILE_HE_READS_THE_CARD_11_22_26.md

   Plays the demo on his phone (upright 390 x 844, CPU 4x, the GPU canvas, the real map's fog), the card shown the way the map shows it
   (a road crew handed over, the card first), every answer to it by a finger:
     W1 the card up: a hidden fight page in the fight's own place (#p-combat, unseen, no finger reaches it), told it is warm
     W2 it reads its files and WAITS: no board, no fight started (the phone's fight count unchanged), no fight frame, nothing it said
        to the shell, no song
     W3 FALL BACK: the hidden page goes (its frame gone), no fight
     W4 a second card read 5 s, ENGAGE: the fight's frame IS the page that waited (the same window), it was waiting before the fight
        took it, it was handed the fight's own options (never warm), the board up, men on it, ONE fight started (the count +1)
     W5 ENGAGE the moment the card is up (the checkers' own tap, inside the beat the page waits for): no hidden page is made at all, the
        fight's page made at the camera's stop as before: the fight's own options, the board up, men on it, one fight started
     W6 ENGAGE a second in (the hidden page made and still reading): it goes (read while the camera comes down it would cost the dive a
        frame: 434 ms measured at 4x) and the fight's page is made at the stop as before, once; or, already waiting, it is the fight
     P1 PLANT: the old way (window.__NO_FIGHT_WARM): the card up 5 s and W1 finds no hidden page (the gate's own check turns red)
     X  nothing threw
   About 6 min.
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const MET_KEY = 'bohemia.fight.met.v1';
/* the page's errors, counted by the shell's own window and every frame of it */
const ARM = "window.__GATE_ERR = []; window.addEventListener('error', function (e) { try { (window.top.__GATE_ERR || window.__GATE_ERR).push(String(e.message || e).slice(0, 160) + ' @' + String(location.pathname).split('/').pop()); } catch (_e) {} });"
  + "if (window === window.top) { window.__WARM_SAID = 0; window.addEventListener('message', function (e) { try { var f = document.getElementById('fightWarm'); if (f && e.source === f.contentWindow) window.__WARM_SAID++; } catch (_e) {} }); }";

async function session(label) {
  const d = await open({ profile: 'phone_portrait', door: 180000, engage: false, pages: true, throttle: 4, gpu: true, fog: true, arm: ARM });
  const p = d.page, fr = d.fr, M = (fn, a) => p.evaluate(fn, a);
  await sleep(3000);
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
  await sleep(4000);
  await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
  await sleep(2000);
  const card = (why) => fr.evaluate((why) => { try { MEET.on = true; if (!(MEET.walk > 0)) MEET.walk = 1; } catch (e) {}
    const pm = partyMath('job', { skulls: 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why, at: { gx: city.x + 2, gy: city.y + 1 }, __deal: 424242 };
    cityHandOver(msg); return !!(MEET.up && document.getElementById('meetcard')); }, why);
  const tapCard = async (which) => {
    const b = await fr.evaluate((w) => { const e = document.querySelector('#meetcard [data-meet="' + w + '"]'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, which);
    if (!b) return false; const off = await M(() => { const f = document.getElementById('cityFrame'); const r = f.getBoundingClientRect(); return [r.x, r.y]; });
    await p.touchscreen.tap(off[0] + b[0], off[1] + b[1]); return true; };
  const warm = () => M((K) => { const f = document.getElementById('fightWarm'), pc = document.getElementById('p-combat'); if (!f) return null; let w = null; try { w = f.contentWindow; } catch (e) {}
    const o = {}; try { o.inCombat = !!(pc && pc.contains(f)); o.hidden = getComputedStyle(f).visibility === 'hidden' || !pc.classList.contains('on'); o.noFinger = getComputedStyle(f).pointerEvents === 'none';
      o.warmOpts = !!(w && w.FIGHT_OPTS && w.FIGHT_OPTS.warm); o.waiting = !!(w && w.__FIGHT_WARM_WAITING); o.board = !!(w && w.FIGHT_UI && w.FIGHT_UI.board); o.started = !!(w && w.FIGHT_UI && w.FIGHT_UI.pageStarted);
      o.met = localStorage.getItem(K); o.said = window.__WARM_SAID | 0; o.fightFrame = !!document.getElementById('fightFrame'); } catch (e) { o.err = String(e); }
    return o; }, MET_KEY);
  const fight = () => M(() => { const f = document.getElementById('fightFrame'); let w = null; try { w = f && f.contentWindow; } catch (e) {} if (!w) return null; const o = {};
    try { const l = w.document.getElementById('load'); o.up = !!(l && l.style.display === 'none' && w.FIGHT_UI && w.FIGHT_UI.board); o.same = !!(window.__W && w === window.__W);
      o.warmOpts = !!(w.FIGHT_OPTS && w.FIGHT_OPTS.warm); o.theirs = !!(window.NF && w.FIGHT_OPTS === NF.opts); o.why = window.__FIGHT_NOW && __FIGHT_NOW.why || null; o.units = w.eval('typeof FIGHT!=="undefined"&&FIGHT.S&&FIGHT.S.units?FIGHT.S.units.length:0');
      o.waitEpoch = w.__FIGHT_WARM_WAITING ? w.performance.timeOrigin + w.__FIGHT_WARM_WAITING : null; o.takenEpoch = window.NFW && NFW.takenAt ? performance.timeOrigin + NFW.takenAt : null;
      o.restarted = window.NF ? (NF.restarted | 0) : null; o.kind = window.NF && NF.opts ? NF.opts.kind : null; try { o.kinds = w.eval('FIGHT.S.boardDef ? FIGHT.S.boardDef.kinds : null'); o.startedOwn = !!(w.FIGHT_UI && w.FIGHT_UI.startedWith === NF.opts); } catch (_e) {}
      o.used = window.NFW ? NFW.used : null; o.made = window.NFW ? NFW.made : null; o.dropped = window.NFW ? NFW.dropped + ':' + NFW.droppedWhy : null; o.ready = window.NFW ? NFW.ready : null; o.go = window.NF ? NF.warmGo : null; } catch (e) { o.err = String(e); }
    return o; });
  const met = () => M((K) => Number(localStorage.getItem(K)) || 0, MET_KEY);
  const waitUp = async (ms) => { const t = Date.now(); let f = null; while (Date.now() - t < ms) { f = await fight().catch(() => null); if (f && f.up) return f; await sleep(250); } return f; };
  return { d, p, fr, M, card, tapCard, warm, fight, met, waitUp, label };
}

(async () => {
  /* ---- the first game: FALL BACK, then a card read and ENGAGE ---- */
  let S = await session('one');
  const met0 = await S.met();
  ok('the card is up (a road crew handed over the way the map hands one)', await S.card('party:gate-a'));
  await sleep(1300);   /* the hidden page is opened a beat after the card */
  let w = await S.warm();
  ok('W1 the card up: a hidden fight page in the fight\'s own place, unseen, no finger reaches it, told it is warm', !!(w && w.inCombat && w.hidden && w.noFinger && w.warmOpts), JSON.stringify(w));
  for (let i = 0; i < 60 && !(w && w.waiting); i++) { await sleep(250); w = await S.warm(); }
  const met1 = await S.met();
  ok('W2 it reads its files and waits: no board, no fight started, no fight frame, nothing said to the shell', !!(w && w.waiting && !w.board && !w.started && !w.fightFrame && w.said === 0 && met1 === met0),
    JSON.stringify(w) + ' fights counted ' + met0 + ' -> ' + met1);
  ok('W3a FALL BACK by a finger', await S.tapCard('back'));
  await sleep(1500);
  w = await S.warm();
  const nfw = await S.M(() => window.NFW ? { dropped: NFW.dropped, why: NFW.droppedWhy } : null);
  ok('W3 FALL BACK: the hidden page goes, no fight', w === null && !!(nfw && nfw.dropped >= 1) && !(await S.fight()), JSON.stringify(nfw));
  await S.fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
  await sleep(1500);
  ok('the second card is up', await S.card('party:gate-b'));
  await sleep(5000);
  w = await S.warm();
  await S.M(() => { const f = document.getElementById('fightWarm'); window.__W = f ? f.contentWindow : null; });
  const metB = await S.met();
  ok('W4a read 5 s: the page waits (its files read while he read the card)', !!(w && w.waiting && !w.started), JSON.stringify(w));
  ok('W4b ENGAGE by a finger', await S.tapCard('go'));
  let f = await S.waitUp(45000);
  const metB1 = await S.met();
  ok('W4 the fight\'s frame IS the page that waited, it waited before the fight took it, the fight\'s own options, the board up, men on it, ONE fight started',
    !!(f && f.same && f.up && !f.warmOpts && f.theirs && f.why === 'party:gate-b' && f.units > 0 && f.used === 1 && f.go === true && f.waitEpoch && f.takenEpoch && f.waitEpoch < f.takenEpoch && metB1 === metB + 1),
    JSON.stringify(f) + ' fights counted ' + metB + ' -> ' + metB1);
  const err1 = await S.M(() => (window.__GATE_ERR || []).slice(0, 4));
  await S.d.close();

  /* ---- the second game: the plant, then ENGAGE at once ---- */
  S = await session('two');
  await S.M(() => { window.__NO_FIGHT_WARM = true; });
  ok('P1a the card is up (the old way)', await S.card('party:gate-p'));
  await sleep(5000);
  w = await S.warm();
  const planted = !!(w && w.inCombat && w.hidden && w.warmOpts);
  ok('P1 PLANT the old way (__NO_FIGHT_WARM): W1\'s check finds no hidden page (it bites)', !planted, JSON.stringify(w));
  ok('P1b FALL BACK by a finger', await S.tapCard('back'));
  await sleep(1500);
  await S.M(() => { window.__NO_FIGHT_WARM = false; });
  await S.fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
  await sleep(1500);
  const metC = await S.met();
  const made5 = await S.M(() => window.NFW ? NFW.made : null);
  ok('W5a the card is up', await S.card('party:gate-c'));
  const w5 = await S.M(() => window.NFW ? { made: NFW.made, fr: !!NFW.fr, el: !!document.getElementById('fightWarm'), no: !!window.__NO_FIGHT_WARM } : null);
  const atOnce = await S.fr.evaluate(() => { try { if (window.MEET && MEET.up && window.MEET_DONE) { MEET_DONE(true); return true; } } catch (e) {} return false; });   /* the checkers' own tap: the moment the card is up */
  f = await S.waitUp(60000);
  await sleep(1500);
  const metC1 = await S.met();
  ok('W5 ENGAGE the moment the card is up: no hidden page made, the fight\'s page made at the stop as before: its own options, the board up, men on it, one fight started',
    !!(atOnce && f && f.up && !f.warmOpts && f.theirs && f.why === 'party:gate-c' && f.units > 0 && f.used === 0 && f.made === made5 && metC1 === metC + 1), JSON.stringify(f) + ' at the card ' + JSON.stringify(w5) + ' fights counted ' + metC + ' -> ' + metC1);
  const err2 = await S.M(() => (window.__GATE_ERR || []).slice(0, 4));
  await S.d.close();

  /* ---- the third game: ENGAGE a second in, the hidden page still reading ---- */
  S = await session('three');
  const metD = await S.met();
  ok('W6a the card is up', await S.card('party:gate-d'));
  let wd = null; for (let i = 0; i < 40 && !wd; i++) { await sleep(100); wd = await S.warm(); }
  const waitingAt = !!(wd && wd.waiting);
  const inSec = await S.fr.evaluate(() => { try { if (window.MEET && MEET.up && window.MEET_DONE) { MEET_DONE(true); return true; } } catch (e) {} return false; });
  f = await S.waitUp(60000);
  await sleep(1500);
  const metD1 = await S.met();
  ok('W6 ENGAGE with the hidden page made and still reading: it goes and the fight is made at the stop as before, once (already waiting: it is the fight)',
    !!(inSec && wd && f && f.up && !f.warmOpts && f.theirs && f.why === 'party:gate-d' && f.units > 0 && metD1 === metD + 1 &&
      (waitingAt ? f.used === 1 : (f.used === 0 && /engaged before it was read/.test(String(f.dropped))))),
    'made ' + !!wd + ', waiting when ENGAGE came ' + waitingAt + ' ' + JSON.stringify(f) + ' fights counted ' + metD + ' -> ' + metD1);
  const err3 = await S.M(() => (window.__GATE_ERR || []).slice(0, 4));
  await S.d.close();
  const errs = err1.concat(err2).concat(err3).filter(e => !/ResizeObserver|Script error/.test(e));
  ok('X nothing threw', errs.length === 0, errs.join(' | '));
  console.log('\nTHE FIGHT IS READ WHILE HE READS THE CARD GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('\nTHE FIGHT IS READ WHILE HE READS THE CARD GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); });
