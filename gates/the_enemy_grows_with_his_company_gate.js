#!/usr/bin/env node
/* THE ENEMY GROWS WITH HIS COMPANY, AND A CHAMPION IS ROLLED (BESTIARY 4 11/27; VAMILY rules 491(a), 493(a)(c)(d); Paolo 11/27: 'I have five
   combat people [that] were absolute killers and there's no more challenges, nothing else to do').
   G1 THE DATA     party_math.json job_bb.grows (like_men, small's ramp); bohemia_enemies.json numbers.grows and numbers.champion sourced;
                   champions.by_faction names every human faction a road deals; the three wiki champion kinds out of the late mixes
   G2 THE MAP      the map's job math (BOHEMIA_CITY_WORLD.html partyMath, its anchors) and the bench's copy of it: five men of level 11 are
                   dressed for the late men and sized nearer a company of twelve like them; three recruits are sized and dressed as before
   G3 THE BAND     the live fight's partyFor: a brigand band handed over > 1 sends men up a rung (more marauders, same count); a thinned
                   faction (the House) fills toward what the math wanted; a beast pack does not grow; over 1 changes nothing
   G4 THE CHAMPION Battle Brothers' roll on the live fight: none on a one-star job; a three-star late band carries one 25 to 85 in 100; never
                   two rolled; the same band, stars and day name the same man whatever the fight's seed; a kind with no champion row takes
                   his numbers (health x hp_x) and his row's armour at its top; a brigand leader becomes the wiki's champion row
   G5 THE PRIZE    engine/bohemia_spoils.js found(): a dead champion's weapon drops when every die misses, his batteries counted
   G6 THE CARD     the danger reader and the alpha's door carry the stars and the over (the card's band and the fight's band, one man)
   G7 MEASURED     banks/..._BEFORE/_AFTER: five killers won every job before; after, the hardest brigand job is never an easy win (under
                   60 in 100) and a one-star brigand job is still easy (80 or more)
   node gates/the_enemy_grows_with_his_company_gate.js [--plant]   (--plant: three planted reds must each go red) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const PLANT = process.argv.includes('--plant');
const G = require(path.join(ROOT, 'tools/bohemia_tuning_the_whole_grid.js'));
const K = require(path.join(ROOT, 'tools/bohemia_bestiary_four_five_killers.js'));
let pass = 0, fail = 0;
const ok = (name, cond, detail) => { if (cond) pass++; else fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (detail ? ' -- ' + detail : '')); return cond; };

async function run(plant) {
  const out = {};
  /* G1 */
  const PM = J('records/target/bb/party_math.json'), NE = J('records/target/bb/bohemia_enemies.json'), O = J('records/target/bb/ours.json');
  const gr = PM.job_bb.value.grows, ng = NE.numbers.grows, nc = NE.numbers.champion, CH = NE.champions;
  const BL = O.beast_looks.value || O.beast_looks, beastKind = k => !!BL[k] || !!(NE.rows.filter(r => r.id === k)[0] || {}).beast;
  const humans = Object.keys(NE.factions).filter(f => Object.keys(NE.mix[f] || {}).length && !Object.values(NE.mix[f]).some(m => Object.keys(m).some(beastKind))).concat(['brigands', 'kids', 'heavies']);
  const unnamed = humans.filter(f => !(CH.by_faction || {})[f]);
  const lateCh = ['brigands', 'kids', 'heavies'].filter(f => Object.keys(O.enemy_tiers.value.mix[f].late).some(k => /champion/.test(k) && O.enemy_tiers.value.mix[f].late[k] > 0));
  out.g1 = ok('G1 the data', gr && gr.like_men === 12 && gr.small && gr.small.exp > 0 && ng && ng.source && nc && nc.source && nc.value.one_skull_pct <= -90 && !unnamed.length && !lateCh.length,
    'like_men ' + (gr && gr.like_men) + ', small ' + JSON.stringify(gr && gr.small) + '; champion ' + JSON.stringify(nc && { b: nc.value.base_pct, e: nc.value.elite_pct, three: nc.value.three_skulls_pct, one: nc.value.one_skull_pct }) + '; human factions unnamed: ' + (unnamed.join(',') || 'none') + '; champion kinds still in a late mix: ' + (lateCh.join(',') || 'none'));
  /* G2 */
  const CW = T('slices/BOHEMIA_CITY_WORLD.html');
  const anchors = ['rule 491(a), job_bb.grows.small', 'B.k * Math.pow(strC / 100, B.exp)', '__dress = str * Math.pow(__G0.like_men / __c0.counted, __t)', 'over: over, skulls:'].filter(a => CW.indexOf(a) < 0);
  const killers = K.grown(G.companyOf(5, 'late').map(m => Object.assign({}, m, { level: 11 }))), recruits = K.grown(G.companyOf(3, 'early').map(m => Object.assign({}, m, { level: 1 })));
  const kc = K.strengthOf(killers), rc = K.strengthOf(recruits);
  const k3 = K.jobParty(kc, 3, 90), r1 = K.jobParty(rc, 1, 20), r1x = (() => { const save = PM.job_bb.value.grows; K.PM.job_bb.value.grows = null; const x = K.jobParty(rc, 1, 20); K.PM.job_bb.value.grows = save; return x; })();
  out.g2 = ok('G2 the map', !anchors.length && k3.days >= 60 && k3.raw > 13 && r1.count === r1x.count && r1.days === r1x.days,
    'missing anchors: ' + (anchors.join(' | ') || 'none') + '; five killers (strength ' + kc.strength + '): three stars ' + k3.count + ' men (the math ' + k3.raw + ', over ' + k3.over + '), dressed for day ' + k3.days + '; three recruits: ' + r1.count + ' men dressed day ' + r1.days + ' (without the rule ' + r1x.count + ', day ' + r1x.days + ')');
  /* the live fight */
  const ctx = await G.engine(true, null), F = ctx.FIGHT, DB = ctx.DB;
  if (plant === 'over') DB.newEnemies.numbers.grows.value.rungs_max = 0;
  if (plant === 'one') DB.newEnemies.numbers.champion.value.one_skull_pct = 0;
  const band = (party, seed, men) => { ctx.setSeed(seed); F.setup({ auto: true, formation: null, company: men || killers, cap: 12, party: party, days: party.days }); return F.S.units.filter(u => u.side === 'them'); };
  /* G3 */
  let mar1 = 0, mar2 = 0, n1 = 0, n2 = 0, h1 = 0, h2 = 0, b1 = 0, b2 = 0;
  for (let s = 1; s <= 20; s++) {
    const a = band({ faction: 'brigands', count: 13, days: 90, difficulty: 1, over: 1 }, s), b = band({ faction: 'brigands', count: 13, days: 90, difficulty: 1, over: 1.7 }, s);
    mar1 += a.filter(u => u.kind === 'brigand_marauder').length; mar2 += b.filter(u => u.kind === 'brigand_marauder').length; n1 += a.length; n2 += b.length;
    h1 += band({ faction: 'house', count: 13, days: 90, difficulty: 1, over: 1 }, s).length; h2 += band({ faction: 'house', count: 13, days: 90, difficulty: 1, over: 1.7 }, s).length;
    b1 += band({ faction: 'bison', count: 6, days: 90, difficulty: 1, over: 1 }, s).length; b2 += band({ faction: 'bison', count: 6, days: 90, difficulty: 1, over: 1.7 }, s).length;
  }
  out.g3 = ok('G3 the band', mar2 > mar1 * 1.3 && n1 === n2 && h2 > h1 && b1 === b2,
    '20 bands of 13 brigands on day 90: marauders ' + mar1 + ' at over 1, ' + mar2 + ' at over 1.7 (' + n1 + ' and ' + n2 + ' men); the House ' + h1 + ' -> ' + h2 + ' men; bison ' + b1 + ' -> ' + b2);
  /* G4 */
  const C = { one: 0, three: 0, two: 0, twice: 0, n: 120 };
  let sameOk = 0, sameN = 0, numbers = null, leader = 0;
  for (let s = 1; s <= C.n; s++) {
    const one = band({ faction: 'brigands', count: 13, days: 90, difficulty: 1, skulls: 1 }, s); if (F.S.champions.some(c => c.rolled)) C.one++;
    band({ faction: 'house', count: 12, days: 1 + (s % 7), difficulty: 1, skulls: 3 }, s); if (F.S.champions.some(c => c.rolled)) C.week1 = (C.week1 | 0) + 1;
    const th = band({ faction: 'house', count: 12, days: 90, difficulty: 1, skulls: 3 }, s), rolled = F.S.champions.filter(c => c.rolled);
    if (rolled.length) C.three++; if (rolled.length > 1) C.twice++;
    if (rolled.length && sameN < 6) { sameN++; const kinds = th.map(u => u.kind), cn = rolled[0].name, ci = th.findIndex(u => u.id === rolled[0].id);
      band({ faction: 'house', count: kinds.length, band: kinds, days: 90, difficulty: 1, skulls: 3 }, s + 5000);
      const again = F.S.champions.filter(c => c.rolled)[0]; if (again && again.name === cn && F.S.units.filter(u => u.side === 'them').findIndex(u => u.id === again.id) === ci) sameOk++;
      if (!numbers) { const u = F.S.units.filter(v => v.side === 'them')[ci], row = DB.enemies.rows.filter(r => r.id === u.kind)[0];
        band({ faction: 'house', count: 1, band: [u.kind], days: 90, difficulty: 1, skulls: 0 }, 1); const plain = F.S.units.filter(v => v.side === 'them')[0];
        const top = v => { const m = String(v == null ? 0 : v).match(/\d+/g); return m ? Math.max.apply(null, m.map(Number)) : 0; };
        numbers = { kind: u.kind, hp: u.hp, plainHp: plain.hp, armH: u.armH, armB: u.armB, topH: top(row.armor_head), topB: top(row.armor_body) }; } }
    const lb = band({ faction: 'brigands', count: 13, band: ['brigand_leader'].concat(Array(12).fill('brigand_thug')), days: 60 + (s % 41), difficulty: 1, skulls: 3 }, s);   /* the roll is off the band, its stars and its day: the day moves it */
    if (lb[0].kind === 'brigand_leader_champion' && lb[0].champion) leader++;
  }
  const hpx = J('records/target/bb/bohemia_enemies.json').numbers.champion.value.hp_x;
  out.g4 = ok('G4 the champion', C.one === 0 && !C.week1 && C.three >= 0.25 * C.n && C.three <= 0.85 * C.n && C.twice === 0 && sameN > 0 && sameOk === sameN && numbers && numbers.hp >= Math.round(numbers.plainHp * hpx) - 1 && numbers.armH === numbers.topH && numbers.armB === numbers.topB && leader > 0,
    C.n + ' bands: one-star brigands ' + C.one + ' with a rolled champion; three-star House in the first week ' + (C.week1 | 0) + '; three-star House late ' + C.three + ', two rolled in one band ' + C.twice + '; the same man in a new fight ' + sameOk + ' of ' + sameN + '; ' + JSON.stringify(numbers) + '; a three-star leader became the wiki champion ' + leader + ' times');
  /* G5 */
  const SP = require(path.join(ROOT, 'engine/bohemia_spoils.js')), LOOT = J('records/target/bb/loot.json');
  const body = { name: 'OLD VEGAS', kind: 'house_shield', dead: true, champion: !(plant === 'prize'), prize: plant === 'prize' ? null : { batteries: 7 }, weapon: { id: 'arming_sword', cls: 'sword', durability: 56 }, shield: null, body: null, head: null };
  const f = SP.found({ faction: 'house', bodies: [body] }, LOOT, () => 0.999), got = f.items.filter(i => i.kind === 'weapon' && i.id === 'arming_sword').length;
  out.g5 = ok('G5 the prize', got === 1 && f.counts.batteries >= 7, 'every die missing: his weapon found ' + got + ' time(s), batteries ' + f.counts.batteries);
  /* G6 */
  const JD = T('slices/bohemia_job_danger.js'), AL = T('slices/BOHEMIA_ALPHA_0_9.html'), DM = T('slices/BOHEMIA_DEMO.html');
  const need = [[JD, 'over: +party.over || 1, skulls: party.skulls | 0'], [JD, "over: f.road ? 1 : +party.over || 1, skulls: f.road ? 0 : job.skulls | 0"], [JD, 'skulls: f.skulls | 0 }, f.at);'],
    [AL, "skulls: (q.skulls | 0) || ((q.ctx && q.ctx.skulls) | 0), over: +q.over || 1"], [DM, "skulls: (q.skulls | 0) || ((q.ctx && q.ctx.skulls) | 0), over: +q.over || 1"]].filter(x => x[0].indexOf(x[1]) < 0);
  out.g6 = ok('G6 the card', !need.length, need.length ? 'missing: ' + need.map(x => x[1]).join(' | ') : 'the reader rolls with the stars and the over; the alpha and the demo hand them to the fight');
  /* G7 */
  const B = J('banks/BOHEMIA_BESTIARY_FOUR_FIVE_KILLERS_BEFORE_11_27_26.json').rows, A = J('banks/BOHEMIA_BESTIARY_FOUR_FIVE_KILLERS_AFTER_11_27_26.json').rows;
  const cell = (R, c, s, f) => (R.filter(r => r.company === c && r.skulls === s && r.faction === f)[0] || {}).won_in_100;
  const bmin = Math.min.apply(null, B.filter(r => r.company === 'killers').map(r => r.won_in_100));
  out.g7 = ok('G7 measured', bmin >= 95 && cell(A, 'killers', 3, 'brigands') < 60 && cell(A, 'killers', 1, 'brigands') >= 80,
    'five killers before: the worst job won ' + bmin + ' in 100; after: brigands one star ' + cell(A, 'killers', 1, 'brigands') + ', two ' + cell(A, 'killers', 2, 'brigands') + ', three ' + cell(A, 'killers', 3, 'brigands') + ' (the House ' + cell(A, 'killers', 3, 'house') + ', the hired guns ' + cell(A, 'killers', 3, 'hired') + ': still easy, the next job)');
  return out;
}
(async () => {
  if (PLANT) {
    const reds = [];
    for (const p of ['over', 'one', 'prize']) { pass = 0; fail = 0; console.log('--- plant: ' + p); const o = await run(p); reds.push({ p, red: (p === 'over' ? !o.g3 : p === 'one' ? !o.g4 : !o.g5) }); }
    const all = reds.every(r => r.red); console.log((all ? 'PASS' : 'FAIL') + ' PLANTS ' + reds.map(r => r.p + (r.red ? ' red' : ' GREEN')).join(', '));
    process.exit(all ? 0 : 1);
  }
  await run(null);
  console.log('THE ENEMY GROWS WITH HIS COMPANY ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e.stack || e); process.exit(1); });
