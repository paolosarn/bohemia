#!/usr/bin/env node
/* ONE PACE, ON THE BEAT, FOR EVERY TURN (COMBAT [one pace, on the beat], rule 274, Paolo 10/26: 'the combat still isn't in sync
   with the music, and when I do the auto combat it's not the same pace, it speeds up and slows down however it wants... really
   fast, then back to normal, really fast... I want it consistent with the BPM of the music... do the math, it has to go to the
   BPM, we need a formula for it'; records/BOHEMIA_PAOLO_A_TOWN_IS_SAFE_ONE_PACE_ON_THE_BEAT_PAID_AT_THE_EDGE_10_26_26.md).
   MEASURED BEFORE: beatMs() divided the song's beat by paceNow() too, THEIRS_PACE 2 on every turn of theirs and FINISH_PACE 4
   once AUTO was finishing it: on AUTO the board ran at the beat on his men's turns, twice as fast on theirs, back, twice as
   fast..., then four times as fast at the end.
   THE FORMULA: an action starts at t0 + k x (60000 / BPM) / s, k whole, BPM the song's, s his speed (1, 2 or 4).
   Legs, on the fight's own page (no shell: the fight keeps its own 120), his phone (390 x 844 at 3x, touch) and his computer:
   P1 AUTO AT 1x, ROLLED FIGHTS: every motion that shows something, his men's and theirs, on one grid, the beat (500 ms): its
      moment on t0 + k x 500 within 20 ms (a walk's first foot, a fall's first key; a blow's landing, the kick, rule 158), the
      same grid for both sides, the end's too;
   P2 BY HAND: his own turns through the by-hand door (AUTO off), theirs as they come: both sides on the same grid;
   P3 FASTER IS THE SAME GRID FINER: at 2x and 4x every motion of both sides on 250 and 125 ms;
   P4 THE FINISH KEEPS THE TEMPO: AUTO finishing the fight (the green tin's one tap) moves on the grid it had before;
   P5 NEVER BUNCHES OR STALLS: no two motions start on one grid point; a CHOICE that came after its grid point took the next
      (never begun inside itself), at most 2 in 100 motions on his phone's profile and his computer, and at most 5 in 100 on his
      phone's CPU at a quarter speed (AUTO's think of every act reported);
   P6 the page began each motion within 20 ms of its grid point past the device's own frame (a timer cannot fire inside a frame:
      on this machine his phone's profile draws a 1170 x 2532 board in software), 95 in 100 or more on his phone's profile and
      his computer; the raw count within 20 ms and the quarter-speed CPU's reported;
   P7 nothing threw.
   Run: node gates/one_pace_on_the_beat_gate.js [--profile phone_portrait|computer] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== ONE PACE ON THE BEAT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const argv = process.argv, ONLY = argv.indexOf('--profile') > 0 ? argv[argv.indexOf('--profile') + 1] : null;
const TOL = 20;   /* rule 274(d) */
const BEAT = 500;  /* the fight's own 120 */
const ARM = "window.__fe=[];addEventListener('error',function(e){try{window.__fe.push(String(e.message||e).slice(0,160))}catch(_){}});";
const CREW = [{ background: 'companion_2hand' }, { background: 'companion_1hand' }, { background: 'companion_ranged' }, { background: 'companion_1hand' }];
/* how far a start sits off the grid t0 + k x g, t0 the song's anchor the fight held when it booked it */
const offGrid = (t, x, g) => {   /* t: the motion's moment (x.land) */ const ph = (((t - x.songAt) % g) + g) % g; return Math.min(ph, g - ph); };

async function fight(profile, o, drive, extra) {
  const opts = Object.assign({ speed: 1, formation: null, teach: false, odds: false, deploy: false, cap: 4, company: CREW }, o);
  const d = await D.open(Object.assign({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: ARM + 'window.FIGHT_OPTS=' + JSON.stringify(opts) + ';' }, extra || {}));
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
    if (o.hand) await p.evaluate(h => handSpeed(h, true), o.hand);
    await p.evaluate(() => { FIGHT_UI.onBeat = []; FIGHT_UI.thinks = []; });
    await drive(p);
    const r = await p.evaluate(() => ({ log: (FIGHT_UI.onBeat || []).slice(), thinks: (FIGHT_UI.thinks || []).slice(), over: FIGHT.S.over, result: FIGHT.S.result, beat: songBeat(), hand: FIGHT_UI.hand, speed: FIGHT_UI.speed, fe: window.__fe || [] }));
    r.errs = (d.errs || []).concat(r.fe);
    return r;
  } finally { await d.close().catch(() => {}); }
}
/* AUTO until the fight ends or n motions are in, whichever first */
const autoUntil = (n, ms, mid) => async p => {
  await p.evaluate(() => { FIGHT_UI.auto = true; });
  if (mid) { await p.waitForFunction(k => (FIGHT_UI.onBeat || []).length >= k || FIGHT.S.over, mid.after, { timeout: ms }).catch(() => {}); await p.evaluate(mid.then); }
  await p.waitForFunction(k => FIGHT.S.over && !FIGHT_UI.anim.length || (FIGHT_UI.onBeat || []).length >= k, n, { timeout: ms }).catch(() => {});
};
/* by hand: AUTO off; on each turn of his, his man does what the brain would, through the page's own by-hand door (the act, then
   take()), never AUTO's; theirs come as they come */
const byHand = (n, ms) => async p => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const st = await p.evaluate(k => {
      if (FIGHT.S.over || (FIGHT_UI.onBeat || []).length >= k) return 'done';
      const u = FIGHT.current(); if (!u || !crewControlled(u) || FIGHT_UI.anim.length) return 'wait';
      const r0 = FIGHT.S.round, i0 = FIGHT.S.idx; FIGHT.aiStep(u); take(); hud();
      if (FIGHT.current() === u && FIGHT.S.round === r0 && FIGHT.S.idx === i0 && !FIGHT_UI.anim.length) { FIGHT.endTurn(u); take(); hud(); }
      return 'acted';
    }, n);
    if (st === 'done') return;
    await p.waitForTimeout(st === 'acted' ? 60 : 90);
  }
};
/* the motions that show something, on a grid */
const shown = r => r.log.filter(x => x.g > 0);
function gridRead(r, want) {
  const q = shown(r), off = q.filter(x => offGrid(x.land, x, x.g) > TOL), wrong = q.filter(x => Math.abs(x.g - want) > 1e-6);
  const sides = {}; q.forEach(x => { const s = x.side || '-'; (sides[s] = sides[s] || new Set()).add(Math.round(x.g * 100) / 100); });
  return { n: q.length, off: off.length, wrong: wrong.length, sides, both: !!(sides.you && sides.them), wrongEx: wrong.slice(0, 3).map(x => (x.side || '-') + ' ' + x.k + ' ' + Math.round(x.g)) };
}
const sideStr = s => Object.keys(s).map(k => k + ' ' + [...s[k]].join('/')).join(', ');

(async () => {
  const errs = [], late = [], stalls = [], bunched = [], thinks = [], counted = { n: 0 }, slow = { n: 0, late: 0, off: 0 }, slowLate = [];
  for (const profile of ['phone_portrait', 'computer']) {
    if (ONLY && ONLY !== profile) continue;
    const tag = profile === 'computer' ? 'COMPUTER' : 'PHONE';
    const keep = (r, slowCpu) => { errs.push.apply(errs, r.errs.map(e => tag + ': ' + e)); shown(r).forEach(x => { if (x.real !== undefined) (slowCpu ? slowLate : late).push({ d: x.real - x.at, f: x.frame || 0 }); }); };
    /* P1 */
    {
      const rows = [], bad = [];
      for (const [fac, seed] of [['brigands', 41], ['beasts', 42], ['kids', 43]]) {
        try {
          const r = await fight(profile, { seed, party: { faction: fac, count: 4, days: 20 } }, autoUntil(70, 120000));
          keep(r); const g = gridRead(r, BEAT);
          rows.push(fac + ' ' + g.n + ' motions (' + sideStr(g.sides) + ')' + (r.over ? ' ' + r.result : ''));
          if (!(g.n >= 20 && g.both && !g.off && !g.wrong)) bad.push(fac + ': ' + g.n + ' motions, both sides ' + g.both + ', off the grid ' + g.off + ', wrong grid ' + g.wrong + ' ' + g.wrongEx.join(' | '));
          const q = shown(r).slice().sort((a, b) => a.at - b.at);
          for (let i = 1; i < q.length; i++) if (Math.abs(q[i].at - q[i - 1].at) < 1 && q[i].g > 0) bunched.push(tag + ' ' + fac + ' ' + q[i - 1].k + '+' + q[i].k);
          /* a stall: a choice that came after its grid point and took the next */
          counted.n += shown(r).length; shown(r).forEach(x => { if (x.late) stalls.push(tag + ' ' + fac + ' ' + (x.side || '-') + ' ' + x.k); });
        } catch (e) { bad.push(fac + ' ran: ' + String(e.message).slice(0, 140)); }
      }
      leg(bad.length === 0, '*** P1 ' + tag + ': AUTO AT 1x, EVERY MOTION OF BOTH SIDES ON ONE GRID, THE BEAT (500 ms) *** (rule 274(a)(b))', rows.join('; ') + (bad.length ? ' | ' + bad.slice(0, 2).join('; ') : ''));
    }
    /* P2 */
    try {
      const r = await fight(profile, { seed: 44, party: { faction: 'brigands', count: 4, days: 20 } }, byHand(50, 120000));
      keep(r); const g = gridRead(r, BEAT);
      leg(g.n >= 15 && g.both && !g.off && !g.wrong, '*** P2 ' + tag + ': BY HAND, HIS TURNS AND THEIRS ON THE SAME GRID *** (rule 274(a): the same s for both sides)', g.n + ' motions (' + sideStr(g.sides) + '), off ' + g.off + ', wrong ' + g.wrong + (g.wrongEx.length ? ' ' + g.wrongEx.join(' | ') : ''));
    } catch (e) { leg(false, 'P2 ' + tag + ' ran', String(e.message).slice(0, 160)); }
    /* P3 */
    {
      const rows = [], bad = [];
      for (const hand of [2, 4]) {
        try {
          const r = await fight(profile, { seed: 45 + hand, hand, party: { faction: 'brigands', count: 4, days: 20 } }, autoUntil(60, 90000));
          keep(r); const g = gridRead(r, BEAT / hand);
          rows.push(hand + 'x: ' + g.n + ' (' + sideStr(g.sides) + ')');
          if (!(g.n >= 15 && g.both && !g.off && !g.wrong)) bad.push(hand + 'x off ' + g.off + ' wrong ' + g.wrong + ' ' + g.wrongEx.join(' | '));
        } catch (e) { bad.push(hand + 'x ran: ' + String(e.message).slice(0, 120)); }
      }
      leg(bad.length === 0, '*** P3 ' + tag + ': 2x AND 4x, BOTH SIDES ON A HALF AND A QUARTER OF THE BEAT *** (rule 274(d))', rows.join('; ') + (bad.length ? ' | ' + bad.join('; ') : ''));
    }
    /* P4 */
    try {
      const r = await fight(profile, { seed: 48, party: { faction: 'brigands', count: 3, days: 10 } }, autoUntil(80, 120000, { after: 12, then: () => { FIGHT_UI.finish = true; } }));
      keep(r);
      const q = shown(r), before = q.filter(x => !x.finish), after = q.filter(x => x.finish);
      const gs = [...new Set(q.map(x => Math.round(x.g * 100) / 100))];
      leg(before.length >= 4 && after.length >= 4 && gs.length === 1 && gs[0] === BEAT && !q.some(x => offGrid(x.land, x, x.g) > TOL),
        '*** P4 ' + tag + ': AUTO FINISHING THE FIGHT KEEPS THE TEMPO IT HAD *** (rule 274(b): FINISH_PACE gone)',
        before.length + ' motions before the finish, ' + after.length + ' after, grids ' + gs.join('/') + ' ms' + (r.over ? ', ' + r.result : ''));
    } catch (e) { leg(false, 'P4 ' + tag + ' ran', String(e.message).slice(0, 160)); }
    /* P5's think, his phone's CPU at a quarter speed */
    if (profile === 'phone_portrait') try {
      const r = await fight(profile, { seed: 49, party: { faction: 'kids', count: 5, days: 30 } }, autoUntil(70, 180000), { throttle: 4 });
      keep(r, true); thinks.push.apply(thinks, r.thinks);
      slow.n += shown(r).length; slow.late += shown(r).filter(x => x.late).length; slow.off += gridRead(r, BEAT).off;
    } catch (e) { errs.push('P5 throttled ran: ' + String(e.message).slice(0, 140)); }
  }
  const th = thinks.slice().sort((a, b) => a - b), pc = f => th.length ? Math.round(th[Math.min(th.length - 1, Math.floor(th.length * f))]) : 0;
  leg(bunched.length === 0 && stalls.length <= counted.n / 50 && slow.off === 0 && slow.late <= slow.n / 20, '*** P5 NEVER BUNCHES OR STALLS *** (rule 274(c)): no two motions on one grid point; a late choice takes the next grid point, at most 2 in 100',
    'bunched ' + bunched.length + (bunched.length ? ' (' + bunched.slice(0, 2).join(', ') + ')' : '') + ', late ' + stalls.length + ' of ' + counted.n + (stalls.length ? ' (' + stalls.slice(0, 3).join(', ') + ')' : '') + '; his phone at a quarter CPU: late ' + slow.late + ' of ' + slow.n + ', off the grid ' + slow.off + ', AUTO\'s think median ' + pc(.5) + ' ms, 95th ' + pc(.95) + ', worst ' + (th.length ? Math.round(th[th.length - 1]) : 0) + ' over ' + th.length + ' acts');
  const ls = late.map(v => v.d).sort((a, b) => a - b), within = late.filter(v => Math.abs(v.d) <= TOL + v.f).length, raw = late.filter(v => Math.abs(v.d) <= TOL).length;
  const fr = late.map(v => v.f).sort((a, b) => a - b), frMid = fr.length ? Math.round(fr[Math.floor(fr.length / 2)]) : 0;
  const sl = slowLate.map(v => v.d).sort((a, b) => a - b), slowIn = slowLate.filter(v => Math.abs(v.d) <= TOL + v.f).length;
  leg(late.length > 0 && within / late.length >= .95, '  P6 the page began each motion within 20 ms of its grid point past the device\'s own frame, 95 in 100 or more', within + ' of ' + late.length + ' (within 20 ms flat ' + raw + '; the frame a middle ' + frMid + ' ms), the worst ' + (ls.length ? Math.round(ls[ls.length - 1]) : 0) + ' ms; at a quarter CPU ' + slowIn + ' of ' + slowLate.length + ', the worst ' + (sl.length ? Math.round(sl[sl.length - 1]) : 0) + ' ms');
  leg(errs.length === 0, 'P7 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
