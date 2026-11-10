#!/usr/bin/env node
/* THE NEW ACT-ONE ENEMIES (FACTIONS 11/3, VAMILY rule 302, Paolo 11/2: 'more content... new enemies, new graphics, the whole
   package'; the bestiary floor law, laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md: every Battle
   Brothers archetype keeps its lesson in a Bohemia skin). Nine types in four factions, one file a modder edits
   (records/target/bb/bohemia_enemies.json), each with its own move in the fight. Headless on the live fight's rules
   (tools/bohemia_fight_headless.js).
   1. THE FILE: at least 8 types in at least 3 factions; every row rides on a wiki row, names its lesson, its brain, its board
      name and a look pool of sheets that exist; every gear name is one the fight can find; every word draft; every page cited
      is in the library;
   2. THE FOLD: after a deal every type has its row, brain, name and looks; every faction its make-up and a share of the road in
      every act; the road's grounds are the factions table's own (records/target/bb/factions.json), never a second list;
   3. THE SHIELD WALL: the shield doubles, +5 for each walled man beside him, for 4 AP and 20 fatigue, until his next turn;
   4. THE HOOK: a man two tiles off is pulled to the tile beside the hook on a hit, for 6 AP;
   5. THE CROSSBOWS: the second shoots the man the first one shot;
   6. THE NEIGHBOR RUNS: under half his hitpoints he flees, once; rallied, he fights on;
   7. THE CAPTAIN: a wavering neighbor in reach is rallied the captain's next step, once a turn;
   8. THE FERAL: never wavers, and a kill gives him his 4 AP back (Berserk);
   9. THE CUTTER: unseen past 2 tiles, seen inside them, and seen for good once he strikes;
  10. THE NEEDLE: a hit that draws blood: -1 AP, -10 initiative, -1 vision, for 3 turns, then gone;
  11. SIZED TO THE CREW: a new crew of 3 and 6 beats each new faction at its sized count 6 in 10 or better (AUTO, 10 seeds);
  12. WHERE AND WHEN: on a faction's own ground it is met more often than anywhere else; the block watch is rarer at night.
   Run: node gates/the_new_enemies_gate.js */
'use strict';
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB, T_ = F._t;
const N = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/bohemia_enemies.json'), 'utf8'));
const FA = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/factions.json'), 'utf8')).factions;
const crew = n => { const c = []; for (let i = 0; i < n; i++) c.push({ background: 'farmhand', level: 1 }); return c; };
const setup = (o, seed) => { ctx.setSeed(seed || 5); F.setup(Object.assign({ kind: 'ruin', deploy: false, formation: null, flat: true }, o)); return F.S; };
const field = (S, keep) => { S.units.forEach(u => { u.fled = keep.indexOf(u) < 0; u.morale = 'Steady'; }); S.events = []; S.over = false; };
const turn = (S, u) => { S.order = [u.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true; u.walled = false; u.hooked = false; u.rallied = false; u.swung = false; };
const put = (u, x, y) => { u.x = x; u.y = y; };
const one = (kind, n) => setup({ party: [{ kind, count: n || 1 }] });

/* 1 */
{ const lib = execSync('tar -tzf ' + JSON.stringify(path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz')), { maxBuffer: 1 << 26 }).toString();
  const wnames = new Set(DB.weapons.rows.map(w => w.name)), snames = new Set(DB.armor.shields.map(s => s.name));
  const bad = [], facs = new Set();
  N.rows.forEach(o => { facs.add(o.faction);
    if (!DB.enemies.rows.some(r => r.id === o.from)) bad.push(o.id + ': no wiki row ' + o.from);
    if (!o.lesson || !o.lesson_bb || !o.board_name || o.draft !== true) bad.push(o.id + ': lesson, name or draft');
    if (!N.brains[o.brain]) bad.push(o.id + ': no brain ' + o.brain);
    (o.looks || []).forEach(l => { if (!fs.existsSync(path.join(ROOT, 'slices/fight_rig', l + '.webp'))) bad.push(o.id + ': no sheet ' + l); });
    if (!o.looks || !o.looks.length) bad.push(o.id + ': no looks');
    (o.gear || []).forEach(g => { if (!wnames.has(g) && !snames.has(g)) bad.push(o.id + ': gear ' + g); }); });
  /* PLUMBER 8 11/10: re-aimed to BEASTS 2 11/3 (rule 359, bohemia_enemies.json brains.ambusher): a brain made of two Battle Brothers
     pieces names both pages, '; ' between them, and each must be in the library */
  Object.keys(N.brains).forEach(k => { const src = N.brains[k].source.split(' ')[0] === 'FACTIONS' ? null : N.brains[k].source; if (src) src.split('; ').forEach(s => { if (lib.indexOf(s) < 0) bad.push('brain ' + k + ': page ' + s); }); });
  Object.keys(N.numbers).forEach(k => { const src = N.numbers[k].source; if (/^bb_all\//.test(src) && lib.indexOf(src) < 0) bad.push('number ' + k + ': page ' + src); });
  leg(N.rows.length >= 8 && facs.size >= 3 && !bad.length, '*** THE FILE ***: at least 8 new types in at least 3 factions, each on a wiki row with its lesson, brain, name, looks and gear, every page in the library',
    N.rows.length + ' types, ' + facs.size + ' factions' + (bad.length ? '; ' + bad.slice(0, 6).join('; ') : '')); }

/* 2 */
{ setup({ party: [{ kind: 'house_shield', count: 1 }] });
  const B = DB.ours.bestiary.value, PL = DB.ours.people_looks.value.band, T = DB.ours.enemy_tiers.value, RF = DB.ours.road_factions.value;
  const miss = N.rows.filter(o => !DB.enemies.rows.some(r => r.id === o.id) || !DB.ai.kinds[o.id] || !B.names[o.id] || !PL[o.id]).map(o => o.id);
  /* PLUMBER 8 11/10: re-aimed to BEASTS 2 11/3 (rule 345 amended (b), records/BOHEMIA_BEASTS_THE_LAB_BEASTS_NOT_A_COYOTE_11_3_26.md piece 2):
     the wolves, the hyenas and the dogs are one-animal parties the MAP deals (BOHEMIA_JOB_KINDS.json beasts_by_ground: a hunt's packs,
     a job that names its animal), not road factions; a faction is folded in when it has its make-up and either a share of the road in
     all three acts or a weight on a ground the map deals beasts from */
  const BG = (JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_JOB_KINDS.json'), 'utf8')).beasts_by_ground) || {};
  const mapDeals = f => !!(N.factions[f] && N.factions[f].beast) && Object.keys(BG).some(g => BG[g] && typeof BG[g] === 'object' && BG[g][f] > 0);
  const fmiss = Object.keys(N.factions).filter(f => !T.mix[f] || (RF.by_act.some(w => !(w[f] > 0)) && !mapDeals(f)));
  const drift = Object.keys(N.road.holds).filter(f => { const fa = FA.filter(x => x.id === N.road.holds_mirror[f])[0]; return !fa || JSON.stringify(fa.ground.slice().sort()) !== JSON.stringify(N.road.holds[f].slice().sort()); });
  leg(!miss.length && !fmiss.length && !drift.length, '*** THE FOLD ***: every new type dealt has its row, brain, name and looks; every faction its make-up and a share of the road in all three acts; the road\'s grounds are the factions table\'s',
    (miss.length ? 'types missing: ' + miss.join(', ') + '; ' : '') + (fmiss.length ? 'factions missing: ' + fmiss.join(', ') + '; ' : '') + (drift.length ? 'grounds drifted: ' + drift.join(', ') : 'clean')); }

/* 3 */
{ const S = setup({ party: [{ kind: 'house_shield', count: 2 }] }), W = N.numbers.shieldwall.value;
  const a = S.units.filter(u => u.kind === 'house_shield'), me = S.units.filter(u => u.side === 'you')[0];
  field(S, [a[0], a[1], me]); put(a[0], 5, 5); put(a[1], 6, 5); put(me, 5, 3);
  const before = a[0].shield ? a[0].shield.melee_defense : -1;
  turn(S, a[0]); const ap0 = a[0].ap, fat0 = a[0].fat; a[0].ap = ap0 - 1;   /* he has moved */
  F.aiStep(a[0]); const walled1 = a[0].walled, apCost = ap0 - 1 - a[0].ap, fatCost = a[0].fat - fat0;
  a[1].walled = true;
  const sd = (u, k) => { const sh = u.shield; if (!sh) return 0; let n = 0; S.units.forEach(f => { if (f !== u && f.side === u.side && f.walled && Math.max(Math.abs(f.x - u.x), Math.abs(f.y - u.y)) === 1 && !f.fled) n++; }); return n; };
  const allies = sd(a[0]);
  const ch0 = (() => { a[0].walled = false; a[1].walled = false; const c = F.hitChance(me, a[0]).chance; a[0].walled = true; a[1].walled = true; return c; })();
  const ch1 = F.hitChance(me, a[0]).chance;
  T_.beginTurn(a[0]);
  leg(!!a[0].shield && walled1 && apCost === W.ap && fatCost === W.fatigue && allies === 1 && ch1 < ch0 && !a[0].walled,
    '*** THE SHIELD WALL ***: every shield man carries his shield; having moved with a man near he locks it for 4 AP and 20 fatigue; the wall beside him makes him harder to hit; it drops when his turn comes again',
    'shield ' + (a[0].shield && a[0].shield.name) + ', walled ' + walled1 + ', ' + apCost + ' AP ' + fatCost + ' fatigue, walled allies beside ' + allies + ', hit on him ' + ch0 + ' -> ' + ch1); }

/* 4 */
{ let hits = 0, tries = 0, pulled = 0, cost = true;
  for (let s = 1; s <= 30; s++) { const S = setup({ party: [{ kind: 'house_hook', count: 1 }] }, s);
    const h = S.units.filter(u => u.kind === 'house_hook')[0], me = S.units.filter(u => u.side === 'you')[0];
    field(S, [h, me]); put(h, 5, 5); put(me, 7, 5); turn(S, h);
    const ap0 = h.ap; F.aiStep(h); const ev = S.events.filter(e => e.t === 'skill' && e.skill === 'hook')[0];
    if (ev) { tries++; if (ap0 - h.ap !== N.numbers.hook.value.ap) cost = false; if (ev.hit) { hits++; if (me.x === 6 && me.y === 5) pulled++; } } }
  leg(tries >= 25 && hits > 0 && pulled === hits && cost, '*** THE HOOK ***: with a man two tiles off and the tile between free, the hook goes out (6 AP); every hit drags him to the tile beside the hook',
    tries + ' hooks in 30, ' + hits + ' hit, ' + pulled + ' pulled'); }

/* 5 */
{ let same = 0, n = 0;
  for (let s = 1; s <= 10; s++) { const S = setup({ party: [{ kind: 'house_crossbow', count: 2 }], company: crew(3) }, s);
    const c = S.units.filter(u => u.kind === 'house_crossbow'), mine = S.units.filter(u => u.side === 'you');
    field(S, c.concat(mine)); put(c[0], 2, 8); put(c[1], 3, 8); put(mine[0], 2, 4); put(mine[1], 6, 3); put(mine[2], 1, 3);
    S.volley = { them: mine[1].id };
    turn(S, c[1]); c[1].loaded = true; F.aiStep(c[1]);
    const at = S.events.filter(e => e.t === 'attack' && e.id === c[1].id)[0];
    if (at) { n++; if (at.to === mine[1].id) same++; } }
  leg(n >= 8 && same === n, '*** THE CROSSBOWS ***: a crossbow shoots the man the line\'s first bolt went at, not the nearest', same + ' of ' + n + ' shots on the named man'); }

/* 6 */
{ const S = setup({ party: [{ kind: 'watch_neighbor', count: 1 }] }), u = S.units.filter(x => x.kind === 'watch_neighbor')[0], me = S.units.filter(x => x.side === 'you')[0];
  field(S, [u, me]); put(u, 5, 5); put(me, 5, 7);
  turn(S, u); u.hp = Math.floor(u.hpMax / 2) - 1; F.aiStep(u); const ran = u.morale === 'Fleeing';
  u.morale = 'Wavering'; turn(S, u); F.aiStep(u); const again = u.morale === 'Fleeing';
  const S2 = setup({ party: [{ kind: 'watch_neighbor', count: 1 }] }, 7), u2 = S2.units.filter(x => x.kind === 'watch_neighbor')[0], me2 = S2.units.filter(x => x.side === 'you')[0];
  field(S2, [u2, me2]); put(u2, 5, 5); put(me2, 5, 7); turn(S2, u2); u2.hp = Math.ceil(u2.hpMax * 0.6); F.aiStep(u2); const steady = u2.morale !== 'Fleeing';
  leg(ran && !again && steady, '*** THE NEIGHBOR RUNS ***: under half his hitpoints he flees; called back, he does not run a second time; above half he stands',
    'ran ' + ran + ', ran again ' + again + ', stood at 60% ' + steady); }

/* 7 */
{ const S = setup({ party: [{ kind: 'watch_captain', count: 1 }, { kind: 'watch_neighbor', count: 1 }] }), c = S.units.filter(x => x.kind === 'watch_captain')[0], nb = S.units.filter(x => x.kind === 'watch_neighbor')[0], me = S.units.filter(x => x.side === 'you')[0];
  field(S, [c, nb, me]); put(c, 5, 6); put(nb, 5, 5); put(me, 5, 2); nb.morale = 'Wavering';
  turn(S, c); F.aiStep(c); const rallied = S.events.some(e => e.t === 'skill' && e.skill === 'rally_the_troops');
  S.events = []; F.aiStep(c); const twice = S.events.some(e => e.t === 'skill' && e.skill === 'rally_the_troops');
  leg(rallied && !twice, '*** THE CAPTAIN ***: a neighbor wavering in reach is called back on the captain\'s next step, once a turn', 'rallied ' + rallied + ', twice ' + twice); }

/* 8 */
{ const S = setup({ party: [{ kind: 'keeper_feral', count: 1 }] }), u = S.units.filter(x => x.kind === 'keeper_feral')[0];
  const holds = [1, 2, 3, 4, 5].every(() => T_.moraleCheck(u, 'neg', -200));
  const bz = (u.perks || []).some(p => /berserk/i.test(String(p.id || p.name || p)));
  leg((u.immune || []).indexOf('Morale') >= 0 && holds && bz, '*** THE FERAL ***: he never wavers, and he carries Berserk (a kill gives his 4 AP back)', 'immune ' + JSON.stringify(u.immune) + ', berserk ' + bz + ', hp ' + u.hpMax); }

/* 9 */
{ const S = setup({ party: [{ kind: 'water_cutter', count: 1 }] }), u = S.units.filter(x => x.kind === 'water_cutter')[0], me = S.units.filter(x => x.side === 'you')[0];
  field(S, [u, me]); put(u, 5, 5); put(me, 5, 9); u.lurking = true;
  const far = F.sideSees('you', u); put(me, 5, 7); const near = F.sideSees('you', u); put(me, 5, 10); const stays = F.sideSees('you', u);
  u.lurking = true; put(me, 5, 6); turn(S, u); F.aiStep(u); put(me, 5, 10); const struck = !u.lurking;
  leg(!far && near && stays && struck, '*** THE CUTTER ***: unseen four tiles off, seen at two, still seen after; striking shows him', 'far ' + far + ', near ' + near + ', after ' + stays + ', shown by his blow ' + struck); }

/* 10 */
{ const P = N.numbers.poison.value; let ok = false, why = 'no blood drawn in 40 tries';
  for (let s = 1; s <= 40 && !ok; s++) { const S = setup({ party: [{ kind: 'water_needle', count: 1 }] }, s), u = S.units.filter(x => x.kind === 'water_needle')[0], me = S.units.filter(x => x.side === 'you')[0];
    field(S, [u, me]); put(u, 5, 9); put(me, 5, 5); u.lurking = false; me.hp = 999; turn(S, u); u.loaded = true;
    /* PLUMBER 8 11/10: re-aimed to rule 428(d) (Paolo 11/7, THE ENEMY KNOWS WHEN IT IS OUTMATCHED): one needle against his crew is the
       weaker side and falls back to better ground instead of shooting (measured: two steps away, no shot, 40 of 40), so the leg looses
       the needle's own shot at him; what it holds is the shot's poison */
    F.strike(u, me);
    if (me.poison === P.turns) { const p0 = me.poison; me.poison = 0; const ini0b = T_.curIni(me); me.poison = p0; const ini1 = T_.curIni(me); turn(S, me); me.ap = me.apTurn; T_.beginTurn(me); const apCut = me.apTurn - me.ap;
      const t0 = me.poison; T_.turnOver(me); const t1 = me.poison;
      ok = apCut === P.ap && Math.round(ini0b - ini1) === P.initiative && t1 === t0 - 1;
      why = 'AP cut ' + apCut + ', initiative ' + Math.round(ini0b) + ' -> ' + Math.round(ini1) + ' at the same breath' + ', turns ' + t0 + ' -> ' + t1; } }
  leg(ok, '*** THE NEEDLE ***: a hit that draws blood poisons for 3 turns: -1 AP, -10 initiative, counting down', why); }

/* 11 */
{ const cells = [], line = n => { const L = DB.ours.fallback_band_by_company.value.line; let a = L[0], b = L[1]; for (let i = 1; i < L.length; i++) { a = L[i - 1]; b = L[i]; if (n <= b[0]) break; } return Math.max(1, Math.round(a[1] + (n - a[0]) * (b[1] - a[1]) / (b[0] - a[0]))); };
  Object.keys(N.factions).forEach(f => [3, 6].forEach(men => {
    let won = 0; for (let s = 1; s <= 10; s++) { ctx.setSeed(s); F.setup({ auto: true, formation: null, kind: ['ruin', 'suburb', 'strip'][s % 3], deploy: false, company: crew(men), party: { count: line(men), days: 1, difficulty: 0, faction: f } });
      let g = 0; while (!F.S.over && g < 200000) { const u = F.current(); if (!u) break; F.aiStep(u); F.S.events = []; g++; } if (F.S.result === 'won') won++; }
    cells.push({ f, men, won }); }));
  leg(cells.every(c => c.won >= 6), '*** SIZED TO THE CREW ***: a new crew of 3 and 6 beats each new faction at its sized count 6 in 10 or better (AUTO, 10 seeds)', cells.map(c => c.f + ' ' + c.men + ': ' + c.won + '/10').join(', ')); }

/* 12 */
{ const count = (district, night) => { const got = {}; for (let s = 1; s <= 200; s++) { ctx.setSeed(s * 13); F.setup({ kind: 'ruin', deploy: false, formation: null, flat: true, met: 3, act: 1, night: night, roadDistrict: district, party: { count: 4, days: 3, difficulty: 0, faction: 'brigands' } }); got[F.S.roadFaction] = (got[F.S.roadFaction] || 0) + 1; } return got; };
  const sub = count('estate', false), des = count('desert', false), subN = count('estate', true);
  leg((sub.watch || 0) > (des.watch || 0) * 2 && (des.keepers || 0) > (sub.keepers || 0) * 2 && (subN.watch || 0) < (sub.watch || 0),
    '*** WHERE AND WHEN ***: the block watch walks the suburbs, the keepers the open desert, and the watch goes home at night',
    'suburb ' + JSON.stringify(sub) + '; desert ' + JSON.stringify(des) + '; suburb at night watch ' + (subN.watch || 0)); }

console.log('\nTHE NEW ENEMIES: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
