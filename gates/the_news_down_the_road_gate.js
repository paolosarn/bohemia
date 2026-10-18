#!/usr/bin/env node
/* ============================================================================
   THE NEWS DOWN THE ROAD  (WORLD, 10/18/26; row [the news down the road, as data], the coordinator, from
   ECONOMY's 10/18 finding: 'the next town has news 94 percent of the time and the bar names none of it';
   RUN TWO carries [the bar names the news]).
   Record: records/BOHEMIA_WORLD_THE_NEWS_DOWN_THE_ROAD_10_18_26.md

   engine/bohemia_region_news.js runs the region's own business (the 35 places of engine/BOHEMIA_REGION_LAND.json,
   Battle Brothers' way: settlements send caravans and patrols, lairs send crews, holds patrol) and says, for any
   place and day, what happened there lately, as data.

   IT REFUSES:
   A. THE SOURCES: a number that is not its table's (BohemiaTowns.REACH; the price table's situation
      multipliers; the raid card's items; the situation's week; his 20 percent; the bar's reach; the dice's week).
   B. THE ROW'S CHECK, on the game's seed (read out of the CITY frame) and its compass: a place with nothing to
      say on any day after a week of play (days 7 to 371, every one of the 35); a kind the row names (a raid, a
      price jump, a crew passing, a death) missing from the year.
   C. EVERY ITEM IS A REAL EVENT: a 'left' with no party leaving; a 'passing' with the party not within two blocks
      of the town at that moment; an arrival or a raid that is not the party's last block at its last minute; an
      ambush or a stop where the two parties are not on one block or the next; a death with no fight; a price
      with no situation beginning or ending; a field of words (the words are a mouth's, RUN TWO's); a place or a
      town that is not on the land.
   D. THE RULES: a hold that sends a crew; a camp's crew raiding a town; a party whose clock disagrees with the
      land's minutes along its road; a raid on a town already raided when the crew set out.
   E. TWENTY SEEDS, BOTH COMPASSES: the row's check the same (eight weeks each); a valley that gets the same
      traffic on every seed.
   F. PURE: two worlds, asked in different orders, the same answer.
   M. MUTATIONS, EACH RED: a raid planted where no crew went (C); every departure dropped (B); a line of words
      planted (C).
   P. SPEED: the world and a year under three seconds in node.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const P = p => path.join(ROOT, p);
const read = p => fs.readFileSync(P(p), 'utf8');
const RL = require('../engine/bohemia_region_land.js');
const RN = require('../engine/bohemia_region_news.js');
const OM = require('../engine/bohemia_overmap.js');
const TOWNS = require('../engine/bohemia_towns.js');
const JSON_ = JSON.parse(read('engine/BOHEMIA_REGION_LAND.json'));
const TRAITS = JSON.parse(read('records/target/settlement_traits.json'));

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };
console.log('THE NEWS DOWN THE ROAD: what each of the region\'s places is talking about, from its own events');

/* the game's seed, out of the CITY frame (as THE ONE RULER and THE FREEWAY IS ONE ROAD read it) */
const frame = read('slices/BOHEMIA_CITY_WORLD.html');
let seed = 2691674296;
{
  const st = frame.match(/const BOH_SEED_TEXT='([^']+)'/), hs = frame.indexOf('function BOH_HASH_SEED(');
  if (st && hs >= 0) seed = new Function(frame.slice(hs, frame.indexOf('return (h^(h>>>16))>>>0; }', hs) + 27) + '\nreturn BOH_HASH_SEED;')()(st[1]);
}
const compassOf = sd => { const L = OM.buildOvermap(sd).layout; return { e: L.fwyX < L.stripX ? 'x1' : 'x0' }; };
const land = RL.load(JSON_);
const NAMES = new Set(JSON_.places.map(p => p.name).concat((JSON_.inValley || []).map(p => p.name)));
const WORDS = ['line', 'text', 'words', 'say', 'said', 'quote', 'message'];

/* every item backed by the world's own parties and fights */
function verify(W, events) {
  const bad = [], at = nm => W.byName[nm];
  const fightAt = {}; events.forEach(e => { if (/^(raid|ambush|stopped)$/.test(e.kind)) fightAt[e.party + '@' + e.day] = 1; if (e.kind === 'ambush' || e.kind === 'stopped') fightAt[e.victim + '@' + e.day] = 1; });
  const sitAt = {}; events.forEach(e => { if (e.kind === 'raid' || e.kind === 'arrived') sitAt[e.place + '@' + e.day] = 1; if (e.kind === 'ambush') { sitAt[(W.parties[e.victim] || {}).from + '@' + e.day] = 1; sitAt[(W.parties[e.victim] || {}).to + '@' + e.day] = 1; } });
  const sitEnd = nm => (W.sit[nm] || []).map(s => s.until);
  for (const e of events) {
    const p = W.parties[e.party], why = m => bad.push(e.kind + ' at ' + e.place + ' day ' + (+e.day).toFixed(2) + ': ' + m);
    if (RN.KINDS.indexOf(e.kind) < 0) { why('kind not in the list'); continue; }
    if (!NAMES.has(e.place) || !at(e.place)) { why('not a place on the land'); continue; }
    if ((e.from && !NAMES.has(e.from)) || (e.to && !NAMES.has(e.to))) { why('a town not on the land'); continue; }
    if (Object.keys(e).some(k => WORDS.indexOf(k) >= 0) || Object.keys(e).some(k => typeof e[k] === 'string' && e[k].length > 48)) { why('a field of words'); continue; }
    if (e.kind === 'price') { if (!(sitAt[e.place + '@' + e.day] || sitEnd(e.place).some(u => Math.abs(u - e.day) < 1e-9))) why('no situation began or ended'); continue; }
    if (!p) { why('no such party'); continue; }
    if (e.kind === 'left') { if (p.from !== e.place || Math.abs(p.t0 - e.day) > 1e-9) why('the party did not leave from here then'); }
    else if (e.kind === 'passing') { const q = RN.posAt(p, e.day), pl = at(e.place); if (!q || Math.max(Math.abs(q[0] - pl.x), Math.abs(q[1] - pl.y)) > RN.SEEN_BLOCKS) why('the party was not within sight'); }
    else if (e.kind === 'arrived' || e.kind === 'raid') { const last = p.sched[p.sched.length - 1], pl = at(e.place);
      if (p.stoppedAt != null || p.home || last[0] !== pl.x || last[1] !== pl.y || Math.abs(p.t1 - e.day) > 1e-9) why('not the party\'s last block at its last minute');
      if ((e.kind === 'raid') !== (p.agenda === 'crew')) why('a raid by a ' + p.agenda); }
    else if (e.kind === 'ambush' || e.kind === 'stopped') { const v = W.parties[e.victim], a = RN.posAt(p, e.day), b = v && RN.posAt(v, e.day);
      if (!a || !b || Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) > RN.MEET_BLOCKS) why('the two parties were not together'); }
    else if (e.kind === 'death') { if (!fightAt[e.party + '@' + e.day]) why('no fight'); }
  }
  return bad;
}
const yearOf = W => { const ev = []; for (let w = 0; w < 53; w++) RN.week(W, w).events.forEach(e => ev.push(e)); return ev; };

section('A. the numbers are their tables\'', () => {
  ok('A1 who sends how many is BohemiaTowns.REACH', JSON.stringify(TOWNS.REACH) === JSON.stringify({ fortress: 3, town: 2, camp: 1 }), JSON.stringify(TOWNS.REACH));
  const SM = JSON.parse(read('records/target/bb/price_table.json')).situationMultipliers, AT = JSON.parse(read('records/target/bb/arrival_traits.json'));
  ok('A2 a caravan in is Well Supplied, buy -10% (the price table)', RN.SITUATIONS.well_supplied.buy === -SM.wellSupplied.buyCut, String(SM.wellSupplied.buyCut));
  ok('A3 an ambushed road is Ambushed Trade Routes, sell +10% (the price table)', RN.SITUATIONS.ambushed_trade_routes.sell === SM.ambushedTradeRoutes.sellBonus, String(SM.ambushedTradeRoutes.sellBonus));
  ok('A4 a raid is the raid card: items -50%', RN.SITUATIONS.raided.items === AT.traits.raided.effects.items_mult.value - 1, String(AT.traits.raided.effects.items_mult.value));
  ok('A5 a situation lasts the raid ledger\'s week', RN.SITUATION_DAYS === AT.duration_days.value, String(AT.duration_days.value));
  ok('A6 one in five of the struck dies, his 9/27 words', RN.DEATH_CHANCE === 0.2 && /20% they die/.test(read('laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md')));
  ok('A7 the reach is the bar\'s', RN.REACH_BLOCKS === JSON.parse(read('records/target/BOHEMIA_BAR_NEWS_PLACES.json')).reach_cells, String(RN.REACH_BLOCKS));
  ok('A8 the week is the dice\'s week', RN.PERIOD === TRAITS.roll.period_days);
  ok('A9 draft and untuned (TUNING owns every one)', RN.draft === true && RN.tuned === false);
});

let W = null, EV = null;
section('B. the game\'s seed: the row\'s check', () => {
  const C = compassOf(seed), t = Date.now();
  W = RN.world(land, C, seed); EV = yearOf(W);
  const ms = Date.now() - t;
  ok('B1 the region\'s 35 places, every one', W.places.length === 35 && W.places.every(p => NAMES.has(p.name)), W.places.length + ' places, compass east ' + C.e + ', seed ' + seed);
  let empty = [], emptyND = 0;
  for (let d = 7; d <= 371; d++) for (const p of W.places) { const it = RN.items(W, p.name, d, 7, { traits: TRAITS }); if (!it.length) empty.push(p.name + '@' + d); if (!it.some(e => !e.dice)) emptyND++; }
  ok('B2 every place has something to say on every day after a week of play (35 places x 365 days)', empty.length === 0, empty.length ? empty.slice(0, 6).join(', ') : '0 quiet place-days; ' + emptyND + ' without the dice');
  const k = {}; EV.forEach(e => k[e.kind] = (k[e.kind] || 0) + 1);
  ok('B3 the year carries what the row names: a raid, a price jump, a crew passing, a death', k.raid > 0 && EV.some(e => e.kind === 'price' && e.price.move > 0) && EV.some(e => e.kind === 'passing' && e.agenda === 'crew') && k.death > 0,
     Object.keys(k).map(x => x + ' ' + k[x]).join(', '));
  const raids = {}; EV.filter(e => e.kind === 'raid').forEach(e => raids[e.place] = (raids[e.place] || 0) + 1);
  const worst = Object.keys(raids).sort((a, b) => raids[b] - raids[a])[0];
  ok('B4 nowhere is raided more than every other week (the news is news, not weather)', !worst || raids[worst] <= 26, worst ? worst + ' ' + raids[worst] + ' raids in the year' : 'no raids');
  console.log('  NOTE  JEAN on day 30: ' + RN.items(W, 'JEAN', 30, 7, { traits: TRAITS }).map(e => e.kind + (e.agenda ? ' ' + e.agenda : '') + (e.from && e.from !== 'JEAN' ? ' from ' + e.from : '') + (e.to && e.to !== 'JEAN' ? ' to ' + e.to : '') + ' ' + e.ago + 'd').join('; '));
  ok('P1 the world and a year in under three seconds', ms < 3000, ms + ' ms');
});

section('C. every item is a real event', () => {
  const bad = verify(W, EV);
  ok('C1 every one of the year\'s items is backed by a party, a fight or a situation', bad.length === 0, bad.length ? bad.slice(0, 4).join('; ') : EV.length + ' items');
  const dice = []; for (const p of W.places) for (let d = 7; d <= 63; d += 7) RN.items(W, p.name, d, 7, { traits: TRAITS }).filter(e => e.dice).forEach(e => dice.push([p.name, d, e.kind]));
  const LM = require('../engine/bohemia_livingmap.js');
  ok('C2 the dice\'s news is the settlement screen\'s own roll (traitsFor)', dice.every(([n, d, kd]) => LM.traitsFor(TRAITS, n, d).some(t => t.id === kd)), dice.length + ' dice items');
});

section('D. the rules', () => {
  const holds = W.places.filter(p => p.role === 'fight' && p.tier === 'fortress').map(p => p.name);
  ok('D1 a hold never sends a crew (the dam, the hangars, the gate, the solar fields, the intake guard their prize)', !Object.values(W.parties).some(p => p.agenda === 'crew' && holds.indexOf(p.from) >= 0), holds.join(', '));
  const bad = EV.filter(e => e.kind === 'raid' && RN.TIER[W.byName[e.place].tier] > RN.TIER[W.byName[e.from].tier]);
  ok('D2 a camp\'s crew never raids a town', bad.length === 0, bad.map(e => e.from + '>' + e.place).join(', ') || 'none');
  let clock = 0; const minsAt = (x, y) => { const a = land.at(x, y, W.compass); return (a && a.minutes != null && a.pass !== 3) ? a.minutes : 19.354; };
  for (const p of Object.values(W.parties)) {
    let m = 0; for (let i = 1; i < p.sched.length; i++) m += minsAt(p.sched[i][0], p.sched[i][1]) * (p.home && i >= p.sched.length / 2 ? 0 : 1);
    const outEnd = p.home ? p.sched[Math.floor((p.sched.length - 1) / 2)][2] : p.t1;
    if (Math.abs((outEnd - p.t0) * 1440 - m) > 1e-3 * Math.max(1, m)) clock++;
  }
  ok('D3 every party\'s clock is the land\'s minutes along its road', clock === 0, clock + ' of ' + Object.keys(W.parties).length + ' off');
  const raidedAtStart = EV.filter(e => e.kind === 'raid').filter(e => { const p = W.parties[e.party]; return (W.sit[e.place] || []).some(s => s.id === 'raided' && s.from < p.t0 && s.until > p.t0 && s.from < Math.floor(p.t0 / 7) * 7); });
  ok('D4 no crew sets out for a town that stood raided when its week began', raidedAtStart.length === 0, raidedAtStart.length + ' of ' + EV.filter(e => e.kind === 'raid').length);
});

section('E. twenty seeds, both compasses', () => {
  const seeds = [seed]; for (let i = 1; i < 20; i++) seeds.push(i * 7919);
  let quiet = 0, same = 0, cps = {}, prev = null, bad = 0;
  for (const sd of seeds) {
    const C = compassOf(sd); cps[C.e] = (cps[C.e] || 0) + 1;
    const G = RN.world(land, C, sd), ev = []; for (let w = 0; w < 9; w++) RN.week(G, w).events.forEach(e => ev.push(e));
    for (let d = 7; d <= 63; d++) for (const p of G.places) if (!RN.items(G, p.name, d, 7).length) quiet++;
    bad += verify(G, ev).length;
    const sig = ev.filter(e => e.kind === 'raid').map(e => e.place + e.day.toFixed(3)).join();
    if (prev === sig) same++; prev = sig;
  }
  ok('E1 every seed: every place has news every day of weeks two to nine (with no dice at all)', quiet === 0, quiet + ' quiet place-days');
  ok('E2 every seed: every item backed', bad === 0, bad + ' unbacked');
  ok('E3 the two compasses both ran, and seeds differ', Object.keys(cps).length === 2 && same === 0, JSON.stringify(cps) + ', ' + same + ' seeds like the one before');
});

section('F. pure', () => {
  const A = RN.world(land, W.compass, seed), B = RN.world(land, W.compass, seed);
  const a = [RN.items(A, 'PRIMM', 60), RN.items(A, 'JEAN', 20), RN.items(A, 'MOAPA', 200)];
  const b0 = RN.items(B, 'MOAPA', 200), b1 = RN.items(B, 'JEAN', 20), b2 = RN.items(B, 'PRIMM', 60);
  ok('F1 two worlds asked in different orders give the same answer', JSON.stringify(a) === JSON.stringify([b2, b1, b0]));
  const n = RN.near(W, { x: 48, y: 48 }, 30);
  ok('F2 near() from the valley\'s middle: every place within the reach, nearest first', n.length > 0 && n.every((q, i) => q.dist <= RN.REACH_BLOCKS && (!i || n[i - 1].dist <= q.dist)), n.length + ' places, nearest ' + (n[0] && n[0].place));
});

section('M. mutations, each must go red', () => {
  const lie = EV.concat([{ kind: 'raid', place: 'SEARCHLIGHT', day: 40.5, agenda: 'crew', from: 'GASS PEAK', to: 'SEARCHLIGHT', party: 'GASS PEAK/5/0' }]);
  ok('M1 a raid planted where no crew went is caught', verify(W, lie).length > 0);
  const G = RN.world(land, W.compass, seed); for (let w = 0; w < 9; w++) { const wk = RN.week(G, w); wk.events = wk.events.filter(e => e.kind !== 'left'); }
  G.weeks.forEach(wk => wk.events = wk.events.filter(e => e.kind !== 'passing' && e.kind !== 'left'));
  let quiet = 0; for (let d = 7; d <= 63; d++) for (const p of G.places) if (!RN.items(G, p.name, d, 7).length) quiet++;
  ok('M2 drop every departure and every sighting: places fall quiet, and B2 would say so', quiet > 0, quiet + ' quiet place-days');
  const words = EV.slice(0, 5).concat([Object.assign({}, EV[0], { line: 'You hear about Jean?' })]);
  ok('M3 a line of words planted in the data is caught', verify(W, words).length > 0);
});

console.log('\n' + (fail ? 'THE NEWS DOWN THE ROAD: RED' : 'THE NEWS DOWN THE ROAD: GREEN') + '  ' + pass + '/' + fail);
process.exit(fail ? 1 : 0);
