#!/usr/bin/env node
/* COMBAT 3 [see every hit, fair stamina, zone of control] 11/2 -- THE PROBE (a measuring instrument; the gate is
   gates/see_every_hit_gate.js). Paolo 11/2 (rules 312 to 314): 'when I was fighting the wolves, they had an attack that took
   stamina away from me... I'm out of stamina, then I do the stamina thing and it still didn't work'; 'if they hit you but it does
   zero damage, then it's a mess'.
   It plays the LIVE fight headless (slices/BOHEMIA_FIGHT.html's own rules and data) on AUTO for both sides, against the wolves
   (beasts: direwolves and hyenas), brigands and the heavies, and logs every change to the fatigue of his men and its cause:
     own     his own swing, skill or reload
     struck  a blow that landed on him (Battle Brothers' 5; a mace 10 or 20)
     dodge   a melee blow he dodged or blocked (Battle Brothers' 2)
     skill   an enemy skill that tires (a hook, a shove)
     owed    what a rest kept back, landing when his next turn that spends closes
     back    what came back at the start of his turn (15, 30 after a rest)
   and counts: winded turns (his own blow costs more breath than he has), the longest run of them, hits that took 0 health,
   zone-of-control free swings that hit and whether the walk stopped, the fight's length in rounds and minutes (2 beats a turn
   that acts, half a beat one that passes, 120 a minute: the tuning bench's own sum).
     node tools/bohemia_combat_see_every_hit_probe_11_2_26.js [--n 30] [--json out.json]   */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const G = require('./bohemia_tuning_the_whole_grid.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('--n', 30)), OUT = arg('--json', null);
const KINDS = [
  { faction: 'beasts', why: 'the wolves (direwolves and hyenas), his fight' },
  { faction: 'brigands', why: 'the road crews' },
  { faction: 'heavies', why: 'the heavies (maces among them)' }
];
(async () => {
  const ctx = await G.engine(true), F = ctx.FIGHT, districts = ctx.DB.boardKinds.districts;
  const EVENTS = /emit\(\{ t: 'fat'/.test(fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8'));
  const out = { at: new Date().toISOString(), n: N, kinds: {} };
  for (const K of KINDS) {
    const T = { fights: 0, won: 0, rounds: 0, beats: 0, turns: 0, winded: 0, longest: 0, lockedFights: 0,
      cause: { own: 0, struck: 0, dodge: 0, skill: 0, owed: 0, back: 0 }, perRoundFromThem: [], maxRoundFromThem: 0,
      zeroHits: 0, hits: 0, zocSwings: 0, zocHits: 0, zocHitButWalked: 0, shownFat: 0, fatEvents: 0, errs: [] };
    for (let k = 0; k < N; k++) {
      try {
        const size = [3, 6][k % 2], stage = ['early', 'middle'][Math.floor(k / 2) % 2];
        const d = districts[(k * 7 + 3) % districts.length];
        ctx.setSeed(5100 + k);
        F.setup({ auto: true, formation: null, company: G.companyOf(size, stage), cap: size,
          party: { faction: K.faction, count: Math.round(size * (K.faction === 'beasts' ? 1.5 : 1.2)), days: stage === 'early' ? 1 : 30 },
          days: stage === 'early' ? 1 : 30, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 });
        const S = F.S; S.deploy = false;
        if (F.startFight) try { F.startFight(); } catch (e) { /* the bench's own setups start on their own */ }
        const mine = S.units.filter(u => u.side === 'you'), ids = new Set(mine.map(u => u.id));
        const run = {}, from = {}; mine.forEach(u => { run[u.id] = 0; from[u.id] = 0; });
        let g = 0, seen = 0, lastRound = S.round, locked = false;
        const idle = G.idleWatch(F);
        while (!S.over && g < 200000) {
          const u = F.current(); if (!u) break;
          if (ids.has(u.id) && !u._seenTurn) {   /* the start of a turn of his: read his breath */
            u._seenTurn = true; T.turns++;
            const foeNear = S.units.some(v => v.side === 'them' && F.onField(v) && Math.max(Math.abs(v.x - u.x), Math.abs(v.y - u.y)) === 1);
            if (F.winded(u) && !F.tooHeavy(u)) { T.winded++; run[u.id]++; T.longest = Math.max(T.longest, run[u.id]); if (run[u.id] >= 3 && foeNear) locked = true; } else run[u.id] = 0;
          }
          const before = {}; mine.forEach(m => { before[m.id] = { fat: m.fat, owed: m.restOwed || 0 }; });
          const L0 = S.log.length, actor = u, round0 = S.round;
          F.aiStep(u); g++;
          if (S.round !== round0) S.units.forEach(v => { v._seenTurn = false; });
          const evs = S.log.slice(L0);
          /* what moved each man's breath in this step, and why. EVENTS (the fight from 11/2 says every change they make: 'fat',
             and the breath comes back as his turn opens: 'turn'); DIFFS (the fight before: the round's 15 at 'round', a rest's
             hits owed) */
          mine.forEach(m => {
            const b = before[m.id], df = m.fat - b.fat;
            const fatEv = evs.filter(e => e.t === 'fat' && e.id === m.id), took = fatEv.reduce((t, e) => t + e.n, 0);
            if (EVENTS) {
              T.fatEvents += fatEv.length; T.shownFat += took;
              fatEv.forEach(e => { const k = e.why === 'dodge' || e.why === 'block' ? 'dodge' : /^(struck|bite|mace|bash)$/.test(e.why) ? 'struck' : 'skill'; T.cause[k] += e.n; from[m.id] += e.n; });
              const opened = evs.some(e => e.t === 'turn' && e.id === m.id);
              if (opened) { T.cause.back += m.fatBack || 0; if (F.onField(m)) { T.perRoundFromThem.push(from[m.id]); T.maxRoundFromThem = Math.max(T.maxRoundFromThem, from[m.id]); } from[m.id] = 0; }
              if (actor === m) T.cause.own += Math.max(0, df - took + (opened ? m.fatBack || 0 : 0));
              return;
            }
            const dOwed = (m.restOwed || 0) - b.owed, hitOn = evs.filter(e => e.t === 'attack' && e.to === m.id && e.id !== m.id);
            if (actor === m) {
              const back = evs.filter(e => e.t === 'round').length ? (m.fatBack || 0) : 0;
              const owedLanded = b.owed > 0 && (m.restOwed || 0) === 0 ? b.owed : 0;
              T.cause.owed += owedLanded; T.cause.own += Math.max(0, df - owedLanded + back);
            } else if (hitOn.length || dOwed > 0) {
              const add = Math.max(0, df) + Math.max(0, dOwed);
              const struck = hitOn.filter(e => e.hit).length, dodged = hitOn.filter(e => !e.hit).length;
              if (struck) T.cause.struck += add * struck / (struck + dodged); if (dodged) T.cause.dodge += add * dodged / (struck + dodged);
              from[m.id] += add;
            } else if (df > 0 && evs.some(e => e.t === 'skill' || (e.t === 'step' && e.id === m.id && e.shoved))) { T.cause.skill += df; from[m.id] += df; }
          });
          if (!EVENTS && evs.some(e => e.t === 'round')) {
            mine.forEach(m => { if (F.onField(m)) { T.perRoundFromThem.push(from[m.id]); T.maxRoundFromThem = Math.max(T.maxRoundFromThem, from[m.id]); T.cause.back += m.fatBack || 0; } from[m.id] = 0; });
          }
          evs.forEach(e => {
            if (e.t === 'attack' && e.hit) { T.hits++; if ((e.hp | 0) <= 0) T.zeroHits++; }
            if (e.t === 'attack' && e.free && ids.has(e.to)) { T.zocSwings++; if (e.hit) T.zocHits++; }
          });
          /* a free swing that hit him, then a step of his in the same walk: the move should have failed */
          for (let i = 0; i < evs.length; i++) {
            const e = evs[i]; if (!(e.t === 'attack' && e.free && e.hit && ids.has(e.to))) continue;
            const j = evs.slice(i + 1).findIndex(x => x.t === 'step' && x.id === e.to && !x.shoved);
            const brk = evs.slice(i + 1).findIndex(x => x.t === 'held' || x.t === 'turn' || x.t === 'end');
            if (j >= 0 && (brk < 0 || j < brk)) T.zocHitButWalked++;
          }
          if (idle()) break;
        }
        T.fights++; if (S.result === 'won') T.won++; T.rounds += S.round; if (locked) T.lockedFights++;
        let open = false, acted = false;
        S.log.forEach(e => { if (e.t === 'turn') { if (open) T.beats += acted ? 2 : 0.5; open = true; acted = false; } else if (/^(step|attack|reload|skill)$/.test(e.t)) acted = true; });
        if (open) T.beats += acted ? 2 : 0.5;
      } catch (e) { T.errs.push(String(e.message).slice(0, 140)); }
    }
    const r1 = x => Math.round(x * 10) / 10, srt = T.perRoundFromThem.slice().sort((a, b) => a - b), q = p => srt.length ? srt[Math.min(srt.length - 1, Math.floor(p * srt.length))] : 0;
    out.kinds[K.faction] = { why: K.why, fights: T.fights, won: T.won, rounds_per_fight: r1(T.rounds / Math.max(1, T.fights)), minutes_on_auto: r1(T.beats / Math.max(1, T.fights) / 120),
      his_turns: T.turns, winded_turns: T.winded, winded_share_in_100: Math.round(100 * T.winded / Math.max(1, T.turns)), longest_winded_run: T.longest, fights_with_a_man_locked_out_3_turns: T.lockedFights,
      fatigue_by_cause: Object.fromEntries(Object.entries(T.cause).map(([k, v]) => [k, Math.round(v)])),
      from_them_per_man_per_round: { median: q(0.5), p90: q(0.9), p99: q(0.99), max: Math.round(T.maxRoundFromThem) },
      hits: T.hits, hits_for_zero_health: T.zeroHits, zoc_free_swings_on_his_men: T.zocSwings, zoc_hits: T.zocHits, zoc_hit_but_he_walked_on: T.zocHitButWalked,
      fatigue_events_shown: T.fatEvents, fatigue_shown_total: Math.round(T.shownFat), errors: T.errs.slice(0, 5) };
    console.log(K.faction.toUpperCase(), JSON.stringify(out.kinds[K.faction]));
  }
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
