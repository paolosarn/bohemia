#!/usr/bin/env node
/* THE SURVIVOR'S WORD AND THE KILL TALLY (WORDS, rules 315 and 316, ask lines 310 and 311, Paolo 11/2).
   315: 'on the victory screen, one of your surviving characters provides commentary on how the battle went... to replace the you
   won... for the enemy type that you just vanquished, or enemy camp... funny, morbid funny, like real killers'.
   316: 'Battle Brothers keeps track of how many kills a character has and their strongest opponent... on my phone, maybe when I just
   hold on him... display the amount of kills they've gotten'.
   Legs (node only, under a second):
   1. THE BANK: every type has six plain wins or more, two lines for every way it went (a man lost, a boss, a man struck down,
      outnumbered, close, flawless), two for a loss and two for pulling out; every line under 12 words; a man lost and a man down
      named, a boss named; every kind has its own win lines (raiders, robots, kids, heavies, a beast, wolves, the dead, a boss, a camp);
   2. *** NEVER YOU, NEVER THE DEAD ***: 3,000 end screens, the speaker is always one of his men alive, a man on his feet first;
   3. HOW IT WENT IS SAID: a man lost names him; a boss names the boss; wolves never hear about boots or pockets;
   4. SPANGLISH ON THE DIAL: the end screen's lines come out Spanglish 6 to 20 in 100;
   5. *** HIS RECORD ***: a fight's row adds one fight, his kills and the stronger of two foes (Battle Brothers' experience value);
      a renamed man reads his old name's record; the fights still queued count on top; the line reads 'n KILLS, BEST: A ...';
   6. THE WIRES: the fight keeps the best foe at every kill and sends kills and best home; the shell's queue keeps them; the crew
      screen saves the tally in his record and shows the line; the end screen puts the survivor's word in the bar; a hold on one of
      his men opens the card in the fight, the camp, the map and the end screen.
   Run: node gates/the_survivors_word_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const ok = (c, what, why) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const B = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/crew_voices.json'), 'utf8'));
const W = require(path.join(ROOT, 'engine/bohemia_survivor_word.js'));
const HOW = (B.after && B.after.how) || [];
/* 1 */
const holes = [];
Object.keys(B.types).forEach(k => { const L = B.types[k].lines, w = L.win || {};
  if ((w.en || []).length < 6) holes.push(k + '.win<6');
  HOW.forEach(h => { if (!w[h] || (w[h].en || []).length < 2) holes.push(k + '.win.' + h); });
  ['lost', 'ran'].forEach(m => { if (!L[m] || (L[m].en || []).length < 2) holes.push(k + '.' + m); });
  const all = (w.en || []).concat(w.sp || [], ...HOW.map(h => (w[h] ? w[h].en.concat(w[h].sp || []) : [])), ...['lost', 'ran'].map(m => (L[m] ? L[m].en.concat(L[m].sp || []) : [])));
  all.forEach(x => { if (x.split(/\s+/).length >= 12) holes.push('long: ' + x); });
  [['man_down', '{name}'], ['lost_one', '{name}'], ['boss', '{boss}']].forEach(([h, p]) => (w[h] ? w[h].en : []).forEach(x => { if (x.indexOf(p) < 0) holes.push(k + '.' + h + ' names nobody'); })); });
const KINDS = ['raiders', 'machine', 'kids', 'heavies', 'beast', 'wolves', 'ghost', 'boss', 'camp'], noKind = KINDS.filter(k => !(B.enemy[k] && (B.enemy[k].win || []).length >= 3));
ok(Object.keys(B.types).length >= 18 && HOW.length === 6 && !holes.length && !noKind.length && B.draft === true && !!(B.after && B.after.source),
  '*** THE BANK ***: ' + Object.keys(B.types).length + ' types x (6+ wins, 2 for each of ' + HOW.length + ' ways it went, 2 lost, 2 ran), every line under 12 words, every kind its own',
  holes.slice(0, 4).concat(noKind).join(' | ') || 'whole');
/* 2, 3, 4 */
const LOOKS = ['cast_longcoat', 'cast_skirt', 'cast_poncho', 'cast_apron', 'cast_widebrim', 'cast_shortcoat'];
let bad = [], n = 0, sp = 0, lostNamed = 0, lostN = 0, bossNamed = 0, bossN = 0, wolfPeople = [], hows = {};
const people = new RegExp(B.after.people_only, 'i');
for (let i = 0; i < 3000; i++) {
  const r0 = (i * 2654435761) >>> 0, men = [{ name: 'YOU', main: true, look: 'you', hp: 40, hpMax: 60 }];
  const k = 1 + (r0 % 6); for (let j = 0; j < k; j++) men.push({ name: ['MARCO DIAZ', 'TERESA', 'EL GUERO SALAS', 'BIG RAY', 'JOE II', 'LUPE'][j], look: LOOKS[(j + i) % 6], hp: (r0 >> j) % 60, hpMax: 60,
    dead: ((r0 >> (j + 3)) & 7) === 0, down: ((r0 >> (j + 5)) & 7) === 1 });
  const wolves = i % 5 === 0, boss = i % 7 === 0 ? "THE POT'S FOREMAN" : null, result = ['won', 'won', 'won', 'lost', 'ran', 'wipe'][i % 6];
  const ctx = { id: 'g' + i, result, men, theirs: 2 + (r0 % 9), boss, faction: wolves ? 'beasts' : 'brigands', by: 'The road crew',
    bodies: wolves ? [{ kind: 'direwolf', beast: true, dead: true }, { kind: 'direwolf', beast: true, dead: true }] : [{ kind: 'brigand_thug', dead: true }] };
  const r = W.pick(B, ctx); if (!r) { if (men.some(m => !m.main && !m.dead)) bad.push('silent with a man alive #' + i); continue; }
  n++; if (r.sp) sp++; hows[r.how] = (hows[r.how] || 0) + 1;
  const who = men.filter(m => m.name === r.who)[0];
  if (!who || who.main || who.dead) bad.push(r.who + ' spoke #' + i);
  else if (who.down && men.some(m => !m.main && !m.dead && !m.down)) bad.push(r.who + ' spoke from the ground with a man up #' + i);
  if (r.how === 'lost_one') { lostN++; const dead = men.filter(m => m.dead && !m.main).map(m => W.callName(m)); if (dead.some(d => r.line.indexOf(d) >= 0)) lostNamed++; }
  if (r.how === 'boss' && result === 'won') { bossN++; if (/Pot's Foreman/.test(r.line)) bossNamed++; }
  if (wolves && result === 'won' && people.test(r.line)) wolfPeople.push(r.line);
}
ok(!bad.length && n > 2000, '*** NEVER YOU, NEVER THE DEAD ***: ' + n + ' end screens, every word from one of his men alive, a man on his feet first', bad.slice(0, 3).join(' | ') || JSON.stringify(hows));
ok(lostN > 50 && lostNamed === lostN && bossN > 20 && bossNamed >= bossN * 0.9 && !wolfPeople.length, 'HOW IT WENT IS SAID: a man lost is named (' + lostNamed + '/' + lostN + '), the boss is named (' + bossNamed + '/' + bossN + '), wolves never hear about boots', wolfPeople.slice(0, 2).join(' | '));
ok(sp / n >= 0.06 && sp / n <= 0.20, 'SPANGLISH ON THE DIAL: ' + (100 * sp / n).toFixed(1) + '% of the end screen\'s lines (6 to 20), never YOU');
/* 5 */
const store = {}; global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
global.window = global; const K = require(path.join(ROOT, 'engine/bohemia_kill_tally.js'));
let t = K.add(null, { kills: 3, best: { name: 'THUG', kind: 'brigand_thug', xp: 150 } });
t = K.add(t, { kills: 2, best: { name: "THE POT'S FOREMAN", kind: 'brigand_leader', xp: 900, boss: true } });
t = K.add(t, { kills: 4, best: { name: 'DIRE WOLF', kind: 'direwolf', xp: 300 } });
t = K.add(t, { dead: true, kills: 0, best: null });
store['bohemia.climb.v1'] = JSON.stringify({ 'JOE': { level: 3, tally: t } });
store['bohemia.fight.after.v1'] = JSON.stringify([{ rows: [{ name: 'JOE II', kills: 5, best: { name: 'HEAVY', kind: 'orc_warrior', xp: 1200 } }] }]);
const re = K.of('JOE II', 'JOE'), ln = K.line(t);
ok(t.fights === 4 && t.kills === 9 && t.best && t.best.name === "THE POT'S FOREMAN" && re.fights === 5 && re.kills === 14 && re.best.name === 'HEAVY' && ln === "9 KILLS, BEST: THE POT'S FOREMAN"
  && K.bestWord({ name: 'DIRE WOLF' }) === 'A DIRE WOLF' && K.line(null) === 'NO KILLS YET',
  '*** HIS RECORD ***: fights, kills and the strongest foe (experience value) add up, a renamed man reads his old record, the queue counts on top', ln + ' | ' + K.line(re));
/* 6 */
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const F = rd('slices/BOHEMIA_FIGHT.html'), A = rd('slices/BOHEMIA_ALPHA_0_9.html'), RS = rd('slices/BOHEMIA_ROSTER_SCREEN.html'), SPS = rd('slices/BOHEMIA_SPOILS_SCREEN.html'),
  ST = rd('slices/BOHEMIA_SETTLEMENT_SCREEN.html'), CW = rd('slices/BOHEMIA_CITY_WORLD.html');
const wires = {
  'fight: best foe at every kill': (F.match(/bestFoe\(a, [to]\)/g) || []).length >= 2,
  'fight: kills and best go home': /kills: v\.kills \| 0, best: v\.best \|\| null/.test(F),
  'fight: a boss is marked on the bodies': /boss: !!t\.boss, xp: t\.xp/.test(F),
  'fight: the hold card carries his tally': /K\.of\(v\.name, v\.was\)/.test(F) && F.indexOf('bohemia_kill_tally.js') > 0,
  'shell: the queue keeps kills and best': /kills: r\.kills \| 0, best: r\.best \|\| null/.test(A),
  'crew screen: the tally in his record': /tally:m\.tally\|\|null/.test(RS) && /m\.tally = c\.tally/.test(RS) && /BohemiaKillTally\.add\(m\.tally, r\)/.test(RS) && /BohemiaKillTally\.line\(/.test(RS),
  'end screen: the survivor\'s word in the bar': /function survivorWord\(f, kind\)/.test(SPS) && /BohemiaSurvivorWord/.test(SPS) && /crew_voices\.json/.test(SPS),
  'end screen: a hold on a man': /BohemiaKillTally\.hold\(d,/.test(SPS),
  'camp: a hold on one of his men': /BohemiaKillTally\.card\(document/.test(ST) && ST.indexOf('bohemia_kill_tally.js') > 0,
  'map: a hold on him and his company': /BohemiaKillTally\.card\(document, men/.test(CW) && CW.indexOf('bohemia_kill_tally.js') > 0
};
const off = Object.keys(wires).filter(k => !wires[k]);
ok(!off.length, 'THE WIRES: fight, shell, crew screen, end screen, camp and map carry it', off.join(' | ') || Object.keys(wires).length + ' wires');
console.log('=== THE SURVIVOR\'S WORD GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
