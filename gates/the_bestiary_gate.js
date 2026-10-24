#!/usr/bin/env node
/* THE BESTIARY (COMBAT [bestiary], rule 42a, Paolo 9/29: 'every BB archetype keeps its lesson in a Bohemia skin'; the coordinator's
   round on his 10/24 'let's have fun, let's be creative'). Three new enemy families in the fight, each teaching ONE lesson the
   way Battle Brothers' roster does, from the 9/29 draft (records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_BESTIARY_COUNT_9_29_26.md):
   THE MECHANIC (the Necromancer: kill him first and his machines drop), THE KIDS AND RUNNERS (the goblins: they net you and
   run), THE HEAVY (the orcs: they shove you off your tile). Every number is a page's (racial_skills.json, enemies.json).

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. THE PAGES: Raise Undead, the Throwing Net, Line Breaker and Shield Bash carry their pages' own words and numbers, and each
      page is in the library;
   2. THE MECHANIC REBOOTS: a fallen machine stands back up at half its hitpoints for 3 AP, twice a turn and not three times,
      never on a body somebody stands on, never one whose head was smashed, never with a blade on him;
   3. KILL HIM FIRST: when the last mechanic falls every machine of his drops and none ever gets up; with a second mechanic
      standing they fight on;
   4. THE NET: 3 tiles, 4 AP, the man is rooted (no tile in his reach but his own), his initiative and both defences cut by
      45 in 100, and he tears free on his own turn;
   5. THE KIDS RUN: after a throw, with a blade coming, the kid steps to more room and out of every blade's reach;
   6. THE SHOVE: one tile straight back, never misses, 4 AP, 10 fatigue on the man; a man with a wall behind him is not moved;
   7. THE ROSTER: every new kind has its name, its brain, its act weights and a look pool; the mechanic heads his party, never two;
   8. SIZED TO THE CREW (rule 133): a new crew of three, six and twelve beats each family at its sized count at least 60 in 100
      (AUTO both sides, 20 seeds a cell);
   9. THE ROAD SETS THE ENEMY: his first fight stays brigands; from the second a brigand party can be any of the three, by the act.
   Run: node gates/the_bestiary_gate.js */
'use strict';
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB;
const RS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/racial_skills.json'), 'utf8')).rows;
const TAR = path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz');
const page = src => { const m = String(src || '').split(':')[1]; if (!m) return ''; try { return execSync('tar -xzOf ' + JSON.stringify(TAR) + ' ' + JSON.stringify(m), { maxBuffer: 1 << 24 }).toString().replace(/<[^>]*>|\[\[File:[^\]]*\]\]|\[\[|\]\]/g, '').replace(/\s+/g, ' '); } catch (_e) { return ''; } };
const crew = n => { const c = []; for (let i = 0; i < n; i++) c.push({ background: 'farmhand', level: 1 }); return c; };
const setup = (o, seed) => { ctx.setSeed(seed || 5); F.setup(Object.assign({ kind: 'ruin', deploy: false, formation: null, flat: true }, o)); return F.S; };
const field = (S, keep) => { S.units.forEach(u => { u.fled = keep.indexOf(u) < 0; u.morale = 'Steady'; }); S.events = []; S.over = false; };
const turn = (S, u) => { S.order = [u.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true; u.raised = 0; u.threw = false; u.kited = false; u.shoved = false; };

/* 1 */
{ const rd = RS.raise_undead, nt = RS.throw_net, lb = RS.line_breaker, sb = RS.shield_bash;
  const pr = page(rd.source), pn = page(nt.source), pl = page(lb.source), pb = page(sb.source), pnec = page(RS.no_spells_in_melee.source), pw = page(lb.nowhere_source), psk = page(nt.carry_source);
  const ok = /with 50% of their/.test(pr) && /can be used 2 times a turn/.test(pr) && /someone is standing on the corpse/.test(pr) && rd.hp_pct === 50 && rd.per_turn === 2 && rd.ap === 3 && rd.fatigue === 10
    && pnec.indexOf("They can't cast spells if engaged in melee.") >= 0
    && /Roots a target in place/.test(pn) && /by 45%/.test(pn) && /initially has -10 points penalty/.test(pn) && /give \+10 points/.test(pn) && /range=3 tiles/.test(pn) && nt.cut_pct === 45 && nt.free_penalty === -10 && nt.free_per_fail === 10 && nt.range_tiles === 3
    && /Throwing Net \(50% chance\)/.test(psk) && nt.carry_chance_pct === 50
    && /knock a target 1 tile back, never misses/.test(pl) && /target suffers 10\b/.test(pl) && /\| ?4 ?\|/.test(pl.replace(/align="[^"]*" ?\|/g, '|')) && lb.ap === 4 && lb.target_fatigue === 10
    && pw.indexOf("They can't push a brother if there is nowhere to push.") >= 0
    && /inflict 10-25 with 50%/.test(pb) && sb.damage_min === 10 && sb.damage_max === 25 && sb.armor_pct === 50;
  leg(ok, '*** THE PAGES ***: Raise Undead, the Throwing Net, Line Breaker and Shield Bash in their pages\' own words and numbers', ok ? 'every number is the page\'s' : 'a number is not its page\'s'); }

/* 2 + 3 */
{ const S = setup({ company: crew(3), party: { count: 6, days: 1, difficulty: 0, faction: 'machines' } });
  const them = S.units.filter(u => u.side === 'them'), mech = them.filter(u => u.kind === 'necromancer'), ms = them.filter(u => F.isMachine(u)), mine = S.units.filter(u => u.side === 'you');
  const m = mech[0], a = ms[0], b = ms[1], c = ms[2], man = mine.filter(u => !u.main)[0];
  const blade = mine.filter(u => !F.isRanged(u.weapon))[0] || man; if (F.isRanged(blade.weapon)) blade.weapon = ms[0].weapon;
  field(S, [m, a, b, c, man]); m.x = 14; m.y = 5; a.x = 9; a.y = 3; b.x = 9; b.y = 5; c.x = 9; c.y = 7; man.x = 2; man.y = 2;
  [a, b, c].forEach(u => { u.hp = 0; u.dead = true; u.headGone = false; });
  turn(S, m); const ap0 = m.ap;
  const r1 = F.raise(m, a), hpA = a.hp, r2 = F.raise(m, b), r3 = F.canRaise(m, c);
  const spent = ap0 - m.ap;
  m.raised = 0; m.ap = m.apTurn; c.headGone = true; const headless = F.canRaise(m, c); c.headGone = false;
  man.x = c.x; man.y = c.y; const covered = F.canRaise(m, c); man.x = 2; man.y = 2;
  field(S, [m, a, b, c, man, blade]); [a, b, c].forEach(u => { u.fled = false; }); blade.x = m.x - 1; blade.y = m.y; const busy = !F.canRaise(m, c); blade.fled = true; blade.x = 0; blade.y = 0;
  leg(r1 && r2 && !r3 && hpA === Math.round(a.hpMax / 2) && !a.dead && spent === 6 && !headless && !covered && busy && F.canRaise(m, c),
    '*** THE MECHANIC REBOOTS ***: half its hitpoints, 3 AP a reboot, twice a turn not three; never a smashed head, never under a man, never with a blade on him',
    'up at ' + hpA + ' of ' + a.hpMax + ', 2 reboots cost ' + spent + ' AP, a third: ' + r3 + '; smashed head ' + headless + ', a man on it ' + covered + ', a blade on him stops it: ' + busy);
  /* kill him: the machines drop */
  turn(S, man); const kill = F._t.fall; S.order = [man.id]; kill(m, man);
  const dropped = [a, b].every(u => u.dead && u.unplugged), later = (() => { m.dead = true; return [a, b, c].some(u => { const mm = Object.assign({}, m); return false; }); })();
  /* a second mechanic keeps them running */
  const S2 = setup({ company: crew(3), party: [{ kind: 'necromancer', count: 2 }, { kind: 'wiederganger', count: 2 }] });
  const m2 = S2.units.filter(u => u.kind === 'necromancer'), w2 = S2.units.filter(u => u.kind === 'wiederganger');
  F._t.fall(m2[0], null); const still = w2.every(u => !u.dead); F._t.fall(m2[1], null); const gone = w2.every(u => u.dead && u.unplugged);
  leg(dropped && still && gone && !F.canRaise(m2[1], w2[0]),
    '*** KILL HIM FIRST ***: the last mechanic down, every machine of his drops and never gets up; a second mechanic standing keeps them running',
    'one mechanic: ' + (dropped ? 'his machines dropped' : 'they fought on') + '; two: the first down ' + (still ? 'they stand' : 'they dropped') + ', the second down ' + (gone ? 'they dropped' : 'they stand')); }

/* 4 + 5 */
{ const S = setup({ company: crew(3), party: { count: 8, days: 1, difficulty: 0, faction: 'kids' } });
  const kid = S.units.filter(u => u.side === 'them' && F.racial(u, 'throw_net'))[0], man = S.units.filter(u => u.side === 'you' && !u.main)[0];
  field(S, [kid, man]); kid.x = 10; kid.y = 5; man.x = 7; man.y = 5; kid.nets = 1; turn(S, kid);
  const ini0 = F._t.curIni(man), md0 = man.mdef, far = (() => { man.x = 6; const c = F.canNet(kid, man); man.x = 7; return c; })();
  const ap0 = kid.ap, ok = F.throwNet(kid, man), cost = ap0 - kid.ap;
  turn(S, man); const reach = Object.keys(F.reach(man, null, true).best).length, ini1 = F._t.curIni(man);
  const cut = F.netCut(man) === 1 - 45 / 100 && ini1 < ini0;
  let freed = false; for (let i = 0; i < 40 && !freed; i++) { S.order = [man.id]; S.idx = 0; man.begun = false; F.S.events = []; F._t.beginTurn ? F._t.beginTurn(man) : null; freed = !man.netted; if (!F._t.beginTurn) break; }
  leg(ok && !far && cost === 4 && reach === 1 && cut && md0 === man.mdef && freed,
    '*** THE NET ***: from 3 tiles not 4, 4 AP, he is rooted (his own tile is all his reach), his initiative and defences at 55 in 100, and he tears free on his own turn',
    'from 4 tiles ' + far + '; cost ' + cost + ' AP; his reach ' + reach + ' tile(s); initiative ' + Math.round(ini0) + ' -> ' + Math.round(ini1) + '; ' + (freed ? 'torn free' : 'NEVER FREE'));
  /* the kite: a throw, a blade coming, the step back */
  const S2 = setup({ company: crew(3), party: { count: 8, days: 1, difficulty: 0, faction: 'kids' } });
  const k2 = S2.units.filter(u => u.side === 'them' && u.weapon.class === 'throwing')[0], blade = S2.units.filter(u => u.side === 'you' && !u.main)[0];
  blade.weapon = S2.units.filter(u => u.side === 'them' && u.sideArm)[0].sideArm;   /* a man with a blade coming for him */
  field(S2, [k2, blade]); k2.x = 10; k2.y = 5; blade.x = 8; blade.y = 5; k2.nets = 0; turn(S2, k2); k2.threw = true;
  const before = Math.max(Math.abs(k2.x - blade.x), Math.abs(k2.y - blade.y)); F.aiStep(k2);
  const after = Math.max(Math.abs(k2.x - blade.x), Math.abs(k2.y - blade.y)), safe = !F.zocOn(k2, k2.x, k2.y).length;
  leg(after > before && safe, '*** THE KIDS RUN ***: after the throw, with a blade coming, the kid steps to more room, out of his reach', 'from ' + before + ' tiles to ' + after + (safe ? ', out of reach' : ', STILL IN REACH')); }

/* 6 */
{ const S = setup({ company: crew(3), party: { count: 9, days: 1, difficulty: 0, faction: 'heavies' } });
  const hv = S.units.filter(u => u.side === 'them' && F.racial(u, 'line_breaker'))[0], man = S.units.filter(u => u.side === 'you' && !u.main)[0];
  field(S, [hv, man]); hv.x = 8; hv.y = 5; man.x = 7; man.y = 5; turn(S, hv);
  const ap0 = hv.ap, f0 = man.fat, ok = F.shove(hv, man), cost = ap0 - hv.ap;
  const moved = man.x === 6 && man.y === 5, tired = man.fat >= f0 + 10;
  /* the wall: a man with his back to the board's edge and his two corners blocked stays put */
  hv.x = 2; hv.y = 5; man.x = 1; man.y = 5; turn(S, hv);
  const blk = [5, 4, 6].map(y => ({ x: 0, y })), others = S.units.filter(u => u !== hv && u !== man).slice(0, 3);
  others.forEach((o, i) => { o.fled = false; o.dead = false; o.x = blk[i].x; o.y = blk[i].y; o.side = o.side; });
  const walled = !F.canShove(hv, man) || !F.pushTile(hv, man);
  man.x = 0; man.y = 5; hv.x = 1; hv.y = 5; others.forEach(o => { o.fled = true; }); const edge = F.pushTile(hv, man);
  leg(ok && cost === 4 && moved && tired && walled && !edge,
    '*** THE SHOVE ***: one tile straight back for 4 AP and 10 fatigue, never a miss; a man with nowhere behind him stays put',
    'cost ' + cost + ' AP, he went ' + (moved ? 'one tile back' : 'NOWHERE') + ', fatigue ' + f0 + ' -> ' + man.fat + '; boxed in: ' + (walled ? 'not moved' : 'MOVED') + ', at the edge: ' + (edge ? 'MOVED' : 'not moved')); }

/* 7 */
{ const O = DB.ours, B = O.bestiary.value, AW = O.act_weights.value.by_kind, mix = O.enemy_tiers.value.mix, band = O.people_looks.value.band, kinds = new Set();
  ['machines', 'kids', 'heavies'].forEach(f => Object.keys(mix[f]).forEach(ph => Object.keys(mix[f][ph]).forEach(k => kinds.add(k))));
  kinds.add('necromancer');
  const miss = [...kinds].filter(k => !B.names[k] || !AW[k] || AW[k].length !== 3 || !DB.ai.kinds[k] || !(band[k] || band[B.look_pools[k]]) || !DB.enemies.rows.some(r => r.id === k));
  let heads = 0, two = 0; for (let s = 1; s <= 30; s++) { ctx.setSeed(s); F.setup({ kind: 'ruin', deploy: false, formation: null, flat: true, party: { count: 8, days: 30, difficulty: 0, faction: 'machines' } });
    const t = F.S.units.filter(u => u.side === 'them'), n = t.filter(u => u.kind === 'necromancer').length; if (n === 1 && t[0].kind === 'necromancer') heads++; if (n > 1) two++; }
  leg(!miss.length && heads === 30 && !two, '*** THE ROSTER ***: every new kind has its name, its brain, three act weights and a look pool; the MECHANIC heads every machine party, never two',
    kinds.size + ' kinds' + (miss.length ? ', missing: ' + miss.join(', ') : '') + '; mechanic first ' + heads + '/30, two of him ' + two); }

/* 8 */
{ const cells = [], line = n => { const L = DB.ours.fallback_band_by_company.value.line; let a = L[0], b = L[1]; for (let i = 1; i < L.length; i++) { a = L[i - 1]; b = L[i]; if (n <= b[0]) break; } return Math.max(1, Math.round(a[1] + (n - a[0]) * (b[1] - a[1]) / (b[0] - a[0]))); };
  ['machines', 'kids', 'heavies'].forEach(f => [3, 6, 12].forEach(men => {
    let won = 0; for (let s = 1; s <= 20; s++) { ctx.setSeed(s); F.setup({ auto: true, formation: null, kind: ['ruin', 'suburb', 'strip'][s % 3], deploy: false, company: crew(men), party: { count: line(men), days: 1, difficulty: 0, faction: f } });
      let g = 0; while (!F.S.over && g < 200000) { const u = F.current(); if (!u) break; F.aiStep(u); F.S.events = []; g++; } if (F.S.result === 'won') won++; }
    cells.push({ f, men, won }); }));
  leg(cells.every(c => c.won >= 12), '*** SIZED TO THE CREW (rule 133) ***: a new crew of 3, 6 and 12 beats each family at its sized count 60 in 100 or better (AUTO, 20 seeds)',
    cells.map(c => c.f + ' ' + c.men + ': ' + c.won + '/20').join(', ')); }

/* 9 */
{ const t = [1, 2, 3].map(act => { const n = {}; for (let s = 1; s <= 120; s++) { ctx.setSeed(s); F.setup({ kind: 'ruin', deploy: false, formation: null, flat: true, act, met: 2, party: { count: 5, days: 5, difficulty: 0, faction: 'brigands' } }); const f = F.S.roadFaction || 'brigands'; n[f] = (n[f] || 0) + 1; } return n; });
  ctx.setSeed(3); F.setup({ kind: 'ruin', deploy: false, formation: null, flat: true, party: { count: 5, days: 5, difficulty: 0, faction: 'brigands' } });
  const first = F.S.roadFaction === null && F.S.units.filter(u => u.side === 'them').every(u => /brigand/.test(u.kind));
  ctx.setSeed(3); F.setup({ kind: 'ruin', deploy: false, formation: null, flat: true, met: 5, party: { count: 4, days: 5, difficulty: 0, faction: 'ghosts' } });
  const kept = F.S.roadFaction === null;
  leg(first && kept && t.every(n => n.machines && n.kids && n.heavies) && (t[0].kids > t[2].kids) && (t[2].machines > t[0].machines) && (t[2].heavies > t[0].heavies),
    '*** THE ROAD SETS THE ENEMY ***: his first fight stays brigands; from the second a brigand party is any of the three by the act (kids early, machines and heavies late); a party with its own faction keeps it',
    'first fight ' + (first ? 'brigands' : 'ROLLED') + '; ghosts ' + (kept ? 'kept' : 'ROLLED') + '; ' + t.map((n, i) => 'act ' + (i + 1) + ' ' + JSON.stringify(n)).join(' '));
}
console.log('THE BESTIARY: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
