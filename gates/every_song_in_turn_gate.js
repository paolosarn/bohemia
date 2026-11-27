#!/usr/bin/env node
/* BOHEMIA -- EVERY SONG IN TURN, gate (SOUNDS THREE 11/27/26, rule 488(b)(c)).

   PAOLO 11/27: 'I keep hearing the same songs. I thought we had lots of songs.' 488(b): enough songs that a long session
   does not repeat; (c) the rotation plays them all, no song twice in a row, the least-played next.

   MEASURED BEFORE (11/27, the alpha's own CITYMUS.pick, 400 hours of 25 picks, a song every 144 s): 13 songs, 11.5
   different an hour, 13.5 repeats an hour, the first repeat a median 12 minutes in, a song back after 4.8 minutes.

     E1  engine/bohemia_every_song_in_turn.js inlined byte for byte in the alpha and the demo
     E2  the hook at the head of the street's pick (CITYMUS.pick) and the opening's (MENUMUS.pick), in both
     E3  in the page (both, a phone's glass): SONGTURN stands, the fence's pick and the faction song's hand-off are its
     E4  *** SIX HOURS OF THE STREET *** from a clean browser, every pick started as the game starts it (a song every 144 s):
         no song twice in a row; every song in the pool plays once before any plays twice; the first repeat at the pool's
         size; and the pool is big enough that AN HOUR NEVER REPEATS (25 songs or more: 488(b))
     E5  THE PLANT: the same walk with SONGTURN's choice taken away (the old draw) must break E4's turn, or this gate is blind
     E6  a song he took out in the MUSIC tab (verdict 0) never plays while another is left
     E7  a one-song pool still plays (the street never goes silent)
     E8  a choice that never sounded is not a play (the music off: nothing counted); the music on: one count per song started
     E9  THE NEXT SESSION: a reload keeps when each song was last heard; the opening's first pick is the one heard longest ago
   node gates/every_song_in_turn_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const SL = path.join(ROOT, 'slices');
function pw() { for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) { try { return require(path.join(g, 'playwright')); } catch (e) {} } return require('playwright'); }
let P = 0, F = 0;
const leg = (ok, what, why) => { if (ok) P++; else F++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const KEY = 'bohemia.songs.in.turn.v1';
const START = '<!-- __EVERY_SONG_IN_TURN__ (SOUNDS THREE 11/27, rule 488) -->';
const HOOK = ' if(window.SONGTURN&&SONGTURN.choose)return SONGTURN.choose(cs);';
const SHELLS = ['BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_DEMO.html'];

/* the street, walked: hours x 25 picks, each started (MUS.cur, and the transport's own read of it) */
const WALK = ({ hours, plant }) => {
  const name = fi => MUS.lib()[fi].n, PER = 144, per = Math.floor(3600 / PER);
  const keep = window.SONGTURN && SONGTURN.choose;
  if (plant && window.SONGTURN) SONGTURN.choose = null;
  const played = [];
  try {
    for (let i = 0; i < hours * per; i++) {
      const c = CITYMUS.pick(); MUS.cur = c.fi; MUS.curSlot = c.slot;
      const pl = MUS.playing; MUS.playing = true; try { if (window.SONGTURN) SONGTURN.tick(); } finally { MUS.playing = pl; }
      played.push(name(c.fi));
    }
  } finally { if (window.SONGTURN) SONGTURN.choose = keep; }
  const pool = SONGFENCE.pool().length;
  let b2b = 0, firstRepeat = null; const seen = {};
  played.forEach((n, i) => { if (i && played[i - 1] === n) b2b++; if (seen[n] != null && firstRepeat == null) firstRepeat = i; seen[n] = i; });
  /* every window of the pool's size holds every song once (the turn) */
  let brokenTurns = 0; for (let i = 0; i + pool <= played.length; i += pool) { if (new Set(played.slice(i, i + pool)).size !== pool) brokenTurns++; }
  let minGap = Infinity; const last = {}; played.forEach((n, i) => { if (last[n] != null) minGap = Math.min(minGap, i - last[n]); last[n] = i; });
  const hourDistinct = []; for (let h = 0; h < hours; h++) hourDistinct.push(new Set(played.slice(h * per, (h + 1) * per)).size);
  return { pool, plays: played.length, b2b, firstRepeatMin: firstRepeat == null ? null : +(firstRepeat * PER / 60).toFixed(1), minGapMin: +(minGap * PER / 60).toFixed(1),
    brokenTurns, turns: Math.floor(played.length / pool), hourDistinct, first: played.slice(0, 6) };
};

async function open(b, f) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(SL, f));
  await p.waitForTimeout(1500);
  await p.evaluate(() => { try { MUS.build(); } catch (e) {} });
  return { p, errs };
}

(async () => {
  /* E1, E2: the files */
  const body = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_every_song_in_turn.js'), 'utf8');
  for (const f of SHELLS) {
    const s = fs.readFileSync(path.join(SL, f), 'utf8');
    leg(s.includes(START) && s.includes(body), 'E1 ' + f + ': the engine inlined byte for byte', s.includes(START) ? 'block in' : 'no block');
    const hook = obj => { const o = s.indexOf(obj); if (o < 0) return false; const i = s.indexOf('pick(){', o); return i > 0 && s.slice(i, i + 200).includes(HOOK); };
    leg(hook('const CITYMUS={') && hook('const MENUMUS={'), 'E2 ' + f + ': the street\'s and the opening\'s picks ask SONGTURN first', 'CITYMUS ' + hook('const CITYMUS={') + ', MENUMUS ' + hook('const MENUMUS={'));
  }
  const { chromium } = pw();
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  for (const f of SHELLS) {
    const { p, errs } = await open(b, f);
    await p.evaluate(k => { try { localStorage.removeItem(k); } catch (e) {} }, KEY);
    await p.reload(); await p.waitForTimeout(1500); await p.evaluate(() => { try { MUS.build(); } catch (e) {} });
    const st = await p.evaluate(() => window.SONGTURN ? SONGTURN.state() : null);
    leg(!!st && st.hooked.fence && st.hooked.fight, 'E3 ' + f + ': SONGTURN stands, the fence\'s pick and the fight\'s hand-off are its', JSON.stringify(st && st.hooked));
    if (!st) continue;
    const A = await p.evaluate(WALK, { hours: 6, plant: false });
    leg(A.b2b === 0 && A.brokenTurns === 0 && A.firstRepeatMin >= +(A.pool * 2.4 - 0.05).toFixed(1),
      'E4 ' + f + ': *** SIX HOURS OF THE STREET: EVERY SONG ONCE BEFORE ANY TWICE, NEVER TWICE IN A ROW ***',
      A.pool + ' songs, ' + A.plays + ' plays, back to back ' + A.b2b + ', turns broken ' + A.brokenTurns + ' of ' + A.turns + ', first repeat ' + A.firstRepeatMin + ' min, closest repeat ' + A.minGapMin + ' min, different songs each hour ' + A.hourDistinct.join('/'));
    leg(A.pool >= 25 && A.minGapMin >= 60, 'E4 ' + f + ': *** AN HOUR NEVER REPEATS *** (488(b): 25 songs or more, every repeat at least 60 minutes after the last time)',
      A.pool + ' songs in the pool, the closest repeat ' + A.minGapMin + ' min');
    const B = await p.evaluate(WALK, { hours: 6, plant: true });
    leg(B.brokenTurns > 0 || B.firstRepeatMin < A.firstRepeatMin, 'E5 ' + f + ': THE PLANT (the old draw): the same walk breaks the turn, so E4 can see it',
      'the old draw: turns broken ' + B.brokenTurns + ' of ' + B.turns + ', first repeat ' + B.firstRepeatMin + ' min, closest repeat ' + B.minGapMin + ' min, different songs each hour ' + B.hourDistinct.join('/'));
    const E6 = await p.evaluate(() => {
      const cs = SONGFENCE.pool(), n = MUS.lib()[cs[0].fi].n, key = n + '#1', v0 = MUS.V[key]; MUS.V[key] = 0; let hit = 0;
      try { for (let i = 0; i < cs.length * 3; i++) { const c = CITYMUS.pick(); MUS.cur = c.fi; MUS.curSlot = c.slot; const pl = MUS.playing; MUS.playing = true; SONGTURN.tick(); MUS.playing = pl; if (MUS.lib()[c.fi].n === n) hit++; } }
      finally { MUS.V[key] = v0; }
      return { n, hit, picks: cs.length * 3 };
    });
    leg(E6.hit === 0, 'E6 ' + f + ': a song taken out in the MUSIC tab (verdict 0) never plays while another is left', E6.n + ' played ' + E6.hit + ' times in ' + E6.picks + ' picks');
    const E7 = await p.evaluate(() => { const real = CITYMUS.candidates; const one = SONGFENCE.pool()[0]; CITYMUS.candidates = () => [one]; MUS.cur = one.fi; MUS.curSlot = one.slot;
      try { const c = CITYMUS.pick(); return !!c && c.fi === one.fi; } finally { CITYMUS.candidates = real; } });
    leg(E7, 'E7 ' + f + ': a one-song pool still plays (the street never goes silent)');
    const E8 = await p.evaluate(() => {
      /* two songs that are not the one counted last (the leg before may have left either of them counted: a flake, 11/27) */
      const last = SONGTURN.order[SONGTURN.order.length - 1], all = SONGFENCE.pool(), cs = all.filter(c => MUS.lib()[c.fi].n !== last && c.fi !== MUS.cur);
      const s0 = SONGTURN.started; const pl = MUS.playing;
      MUS.playing = false; MUS.cur = cs[0].fi; SONGTURN.tick(); const off = SONGTURN.started - s0;
      MUS.playing = true; SONGTURN.tick(); SONGTURN.tick(); const on = SONGTURN.started - s0 - off; MUS.cur = cs[1].fi; SONGTURN.tick(); const on2 = SONGTURN.started - s0 - off;
      MUS.playing = pl; return { off, on, on2 };
    });
    leg(E8.off === 0 && E8.on === 1 && E8.on2 === 2, 'E8 ' + f + ': a choice that never sounded is not a play; one count per song started', JSON.stringify(E8));
    /* E8b: picks with the music off (nothing counted as played) still go round the whole pool, even over a stored order
       that would otherwise send every pick to the two heard longest ago */
    const E8b = await p.evaluate(() => {
      const cs = SONGFENCE.pool(), name = fi => MUS.lib()[fi].n, pl = MUS.playing; MUS.playing = false;
      const keepLast = SONGTURN.last, keepChosen = SONGTURN.chosen, keepSession = SONGTURN.session; SONGTURN.last = {}; SONGTURN.chosen = {}; SONGTURN.session = {};   /* a fresh session */
      cs.forEach((c, i) => { SONGTURN.last[name(c.fi)] = i; });
      const got = {};
      try { for (let i = 0; i < cs.length * 2; i++) { const c = CITYMUS.pick(); MUS.cur = c.fi; MUS.curSlot = c.slot; got[name(c.fi)] = (got[name(c.fi)] || 0) + 1; } }
      finally { MUS.playing = pl; SONGTURN.last = keepLast; SONGTURN.chosen = keepChosen; SONGTURN.session = keepSession; }
      const v = Object.values(got); return { pool: cs.length, distinct: v.length, most: Math.max.apply(null, v) };
    });
    leg(E8b.distinct === E8b.pool && E8b.most === 2, 'E8b ' + f + ': picks with the music off still go round the whole pool (twice round, every song twice)', JSON.stringify(E8b));
    /* E9: a stored order, a reload, the opening's pick */
    const order = await p.evaluate(() => { const L = MENUMUS.candidates().map(c => MUS.lib()[c.fi].n); return L; });
    if (order.length >= 2) {
      const last = {}; order.forEach((n, i) => { last[n] = 100 + i; }); const oldest = order[order.length - 1]; last[oldest] = 1;
      await p.evaluate(([k, v]) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }, [KEY, { seq: 200, last }]);
      await p.reload(); await p.waitForTimeout(1500);
      const r = await p.evaluate(() => { try { MUS.build(); } catch (e) {} const keep = SONGTURN.seq; MUS.cur = -1; const c = MENUMUS.pick(); return { seq: keep, got: c ? MUS.lib()[c.fi].n : null, session: Object.keys(SONGTURN.session).length }; });
      leg(r.seq === 200 && r.session === 0 && r.got === oldest, 'E9 ' + f + ': the next session keeps when each song was last heard; the opening opens on the one heard longest ago',
        'seq ' + r.seq + ', session plays ' + r.session + ', the opening chose ' + r.got + ' (heard longest ago: ' + oldest + ')');
    } else leg(false, 'E9 ' + f + ': the opening has songs to choose from', order.length + ' songs');
    await p.evaluate(k => { try { localStorage.removeItem(k); } catch (e) {} }, KEY);
    leg(errs.length === 0, f + ': nothing threw', errs.slice(0, 3).join(' | '));
    await p.close();
  }
  await b.close();
  console.log('EVERY SONG IN TURN: ' + P + ' passed, ' + F + ' failed');
  process.exit(F ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
