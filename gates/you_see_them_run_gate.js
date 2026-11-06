#!/usr/bin/env node
/* YOU SEE THEM RUN (COMBAT 9, rule 415, Paolo 11/6: 'while retreating, I don't see my people actually run, they kind of just disappear.
   I think it's because you have the retreat edge of the screen less than four tiles away from our back line, so maybe that's part of
   it too'; rule 256, his floor: 'in Battle Brothers every time I retreated I watched my people run tile to tile and they always made
   it, they got that head start'; records/BOHEMIA_COMBAT_9_YOU_SEE_THEM_RUN_11_6_26.md).
   MEASURED BEFORE (main 7d9c2883): his back line stood 2 tiles from his own edge in 299 of 300 rolled fights; on the glass, from the
   lineup, every one of his four men was drawn on ONE tile, the one he stood on, and never again (the board drew only the men the
   rules have on the field, and the rules take a man off in the same act as his last walk); mid-fight the same, and a man who walked
   three tiles vanished one short of the edge. Rule 256's number: 97.7% of his men out, beasts 92.6%, a first-turn melee blow in 9.
   Legs:
   Y1 ROOM TO RUN (headless, 300 rolled fights, every faction, every district's board): his back line stands at least four tiles from
      his own edge in every one (rule 415(b));
   Y7 THE RUN FROM THE LINEUP STAYS SURE (headless, the same 300 rolled fights, RETREAT on the lineup): rule 253 'before the enemy, no
      matter what': every one ends WITHDREW, no man of theirs acts (no turn, no free shot) while the run lasts, none stalls (measured on
      the map's own board before the hold: their marksman shot a man between his two turns and the run ended LOST);
   Y2 FROM THE LINEUP, his phone upright (390 x 844, touch), the real RETREAT on the lineup: every man of his gets out, and each is
      drawn on three tiles or more between where he stood and the edge, the last tile on the board he is drawn on is an edge tile,
      he is drawn past the edge (the short run off the glass), walking (his own walk, nine moving frames in ten or more), inside the
      open area of the glass on nine of ten frames or more on the board (the camera holds them); the fight ends WITHDREW;
   Y3 MID-FIGHT, his computer (1440 x 900): AUTO into round 2, the real RETREAT on a turn of his: every man of his who gets out the
      same (three tiles between, the edge his last tile, the run off, walking);
   Y6 ON THE MAP'S OWN BOARD (the demo, his upright phone): a road crew met through the map's own door (cityHandOver), the board laid
      from the map's block (COMBAT TWO's __THE_BOARD_IS_THE_CITY_AT_THAT_SPOT__), RETREAT on its lineup: his back line four tiles or
      more from his edge and every man of his watched as in Y2;
   Y4 THE EARLY RETREAT STILL GETS OUT (rule 256's number, tools/bohemia_combat_early_retreat.js, 1,000 rolled fights, RETREAT the
      moment his first man is up): his men out at least as often as before this rule (97.7%), against beasts 95 in 100 or more, and
      no man of theirs closes to melee on his own first turn;
   Y5 nothing threw.
   Run: node gates/you_see_them_run_gate.js [--n 1000] [--fast] (--fast skips Y4) [--nodemo] (skips Y6) */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const argv = process.argv, N = Number(argv[argv.indexOf('--n') + 1]) || 1000, FAST = argv.indexOf('--fast') > 0, NODEMO = argv.indexOf('--nodemo') > 0;
const BEFORE_OUT = 0.977;   /* rule 256's number on main 7d9c2883, the round before this rule */

/* Y1 headless */
{
  const ctx = engine(), F = ctx.FIGHT, districts = ctx.DB.boardKinds.districts;
  const FACTIONS = ['brigands', 'beasts', 'kids', 'machines', 'heavies'], SIZES = [3, 6, 12];
  let fights = 0, short = 0, worst = Infinity, broke = 0; const eg = [];
  for (let k = 0; k < 300; k++) {
    const fac = FACTIONS[k % 5], size = SIZES[Math.floor(k / 5) % 3], count = 2 + ((k * 7) % 9), days = 1 + ((k * 13) % 90), d = districts[(k * 11 + 3) % districts.length];
    const company = []; for (let i = 0; i < size; i++) company.push({});
    try {
      ctx.setSeed(7000 + k);
      F.setup({ seed: 7000 + k, company, cap: size, formation: null, party: { faction: fac, count, days }, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 });
      const back = Math.min.apply(null, F.S.units.filter(v => v.side === 'you' && F.onField(v)).map(v => v.x));
      fights++; worst = Math.min(worst, back); if (back < 4) { short++; if (eg.length < 3) eg.push(d.district + ' ' + fac + ' x' + back); }
    } catch (e) { broke++; }
  }
  /* Y7 the same fights, RETREAT on the lineup */
  {
    const R7 = { n: 0, withdrew: 0, acts: 0, stuck: 0, late: 0, broke: 0 }, run = require('vm').runInContext("Math.floor(R('ap.per_turn') / R('ap.move_cost.flat'))", ctx);
    for (let k = 0; k < 300; k++) {
      const fac = FACTIONS[k % 5], size = SIZES[Math.floor(k / 5) % 3], count = 2 + ((k * 7) % 9), days = 1 + ((k * 13) % 90), d = districts[(k * 11 + 3) % districts.length];
      const company = []; for (let i = 0; i < size; i++) company.push({});
      try {
        ctx.setSeed(7000 + k);
        F.setup({ seed: 7000 + k, company, cap: size, formation: null, deploy: true, party: { faction: fac, count, days }, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 });
        const S = F.S, hold = Math.ceil(S.cols[0] / run) + 1; F.retreatFromLine();
        let g = 0; while (!S.over && g++ < 5000) { const u = F.current(); if (!u) break; F.aiStep(u); S.events = []; }
        R7.n++; if (S.result === 'withdrew') R7.withdrew++; if (!S.over) R7.stuck++; if (S.round > hold) R7.late++;
        R7.acts += S.log.filter(e => ['step', 'attack', 'skill', 'reload'].indexOf(e.t) >= 0 && F.byId(e.id) && F.byId(e.id).side === 'them').length;
      } catch (e) { R7.broke++; }
    }
    var Y7 = R7;
  }
  leg(fights === 300 && short === 0 && broke === 0, '*** Y1 ROOM TO RUN: HIS BACK LINE STANDS FOUR TILES OR MORE FROM HIS OWN EDGE *** (rule 415(b))',
    fights + ' fights, the nearest back line ' + worst + ' tiles, short of four in ' + short + (eg.length ? ' (' + eg.join(', ') + ')' : '') + (broke ? ', broke ' + broke : ''));
  leg(Y7.n === 300 && Y7.withdrew === 300 && Y7.acts === 0 && Y7.stuck === 0 && Y7.late === 0 && Y7.broke === 0,
    '*** Y7 THE RUN FROM THE LINEUP STAYS SURE: EVERY ONE WITHDREW, NONE OF THEIRS ACTS WHILE IT LASTS, NONE STALLS *** (rules 253, 365, 415(b))',
    Y7.withdrew + ' of ' + Y7.n + ' withdrew; acts of theirs ' + Y7.acts + ', stalled ' + Y7.stuck + ', past the hold ' + Y7.late + (Y7.broke ? ', broke ' + Y7.broke : ''));
}

const watched = m => m.out && m.between >= 3 && m.lastInEdge && m.off >= 3 && m.walk >= 0.9;
const said = m => m.name + ' ' + m.stood + '->' + m.edge + ' between ' + m.between + ' last ' + m.lastIn + (m.lastInEdge ? '(edge)' : '(INSIDE)') + ' off ' + m.off + ' walk ' + m.walk + ' glass ' + m.onGlass;
(async () => {
  const P = require(path.join(ROOT, 'tools/bohemia_combat_you_see_them_run_probe_11_6_26.js'));
  const errs = [];
  /* Y2 the lineup, upright phone */
  {
    const company = []; for (let i = 0; i < 6; i++) company.push({});
    const r = await P.probe({ profile: 'phone_portrait', mode: 'lineup', company });
    errs.push.apply(errs, r.errs.map(e => 'Y2: ' + e));
    const bad = r.men.filter(m => !(watched(m) && m.onGlass >= 0.9));
    leg(!r.err && r.men.length === 6 && bad.length === 0 && r.result === 'withdrew',
      '*** Y2 FROM THE LINEUP [phone upright, touch]: EVERY MAN RUNS TILE TO TILE TO THE EDGE, SEEN, AND RUNS OFF THE GLASS; WITHDREW *** (rule 415(a)(c))',
      (r.err ? r.err + '; ' : '') + 'result ' + r.result + '; ' + r.men.map(said).join(' | '));
  }
  /* Y3 mid-fight, the computer */
  {
    const r = await P.probe({ profile: 'computer', mode: 'mid' });
    errs.push.apply(errs, r.errs.map(e => 'Y3: ' + e));
    const outs = r.men.filter(m => m.out), bad = outs.filter(m => !watched(m));
    leg(!r.err && r.stood && r.stood.round >= 2 && outs.length > 0 && bad.length === 0,
      '*** Y3 MID-FIGHT [computer]: EVERY MAN WHO GETS OUT RUNS TILE TO TILE TO THE EDGE, SEEN, NONE VANISHES INSIDE THE BOARD *** (rule 415(a)(c))',
      (r.err ? r.err + '; ' : '') + 'ordered in round ' + (r.stood && r.stood.round) + ', ' + outs.length + ' of ' + r.men.length + ' out; ' + r.men.map(m => m.out ? said(m) : m.name + ' caught').join(' | '));
  }
  /* Y6 the map's own board, through the demo's door */
  if (!NODEMO) {
    const r = await P.probe({ profile: 'phone_portrait', mode: 'demo' });
    errs.push.apply(errs, r.errs.map(e => 'Y6: ' + e));
    const bad = r.men.filter(m => !(watched(m) && m.onGlass >= 0.9 && m.own >= 4));
    leg(!r.err && r.board && r.board.street && r.men.length > 0 && bad.length === 0 && r.result === 'withdrew',
      '*** Y6 ON THE MAP\'S OWN BOARD [the demo, phone upright]: HIS LINE FOUR BACK, EVERY MAN RUNS TILE TO TILE TO THE EDGE, SEEN, AND OFF THE GLASS *** (rule 415(a)(b)(c))',
      (r.err ? r.err + '; ' : '') + 'board ' + JSON.stringify(r.board || null) + ', result ' + r.result + '; ' + r.men.map(m => said(m) + ' own ' + m.own).join(' | '));
  }
  /* Y4 rule 256's number */
  if (!FAST) {
    const T = require(path.join(ROOT, 'tools/bohemia_combat_early_retreat.js')).measure(N), B = T.byKind.beasts || { out: 0, men: 1 };
    leg(T.outShare >= BEFORE_OUT && B.out / B.men >= 0.95 && T.firstBlow === 0 && T.broke === 0,
      '*** Y4 THE EARLY RETREAT STILL GETS OUT: AT LEAST AS OFTEN AS BEFORE, BEASTS 95 IN 100, NOBODY CLOSES ON HIS FIRST TURN *** (rules 256(a), 415(b))',
      T.out + ' of ' + T.men + ' (' + (100 * T.outShare).toFixed(1) + '%, before ' + (100 * BEFORE_OUT).toFixed(1) + '%), beasts ' + (100 * B.out / B.men).toFixed(1) + '%, a first-turn blow in ' + T.firstBlow + ', broke ' + T.broke);
  }
  leg(errs.length === 0, 'Y5 nothing threw', errs.slice(0, 3).join(' | ') || 'none');
  console.log('=== YOU SEE THEM RUN GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); console.log('=== YOU SEE THEM RUN GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ==='); process.exit(1); });
