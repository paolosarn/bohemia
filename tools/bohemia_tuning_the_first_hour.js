#!/usr/bin/env node
// TUNING [the first hour's numbers] 10/19 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 117).
// The row: every felt number a player meets in the first hour of a new game (starting purse, first wages, the first fight's
// enemies and their gear, the first injury, the first price) beside Battle Brothers' first hour, each marked easier, the same
// or harder, with the proposed value. Battle Brothers and his 'Nintendo-simple' are the whole frame.
//
// The most felt first-hour number is whether he wins his first fight, so that one is MEASURED, origin by origin: each of the
// fifteen origins' own men (records/target/bb/origins.json) against the party our map sends that company on day one
// (party_math's job count at one skull, tools/bohemia_tuning_the_whole_grid.js mapCount), in today's kit and in the draft guns
// (tools/bohemia_tuning_the_first_kit_is_guns.js, the rows and the butt), at Battle Brothers' Veteran (its count, its rules)
// and at our start (rule 117's levers, the Beginner count). The live fight, AUTO on both sides, seeded 9000+k.
// The guns are handed THE WAY THE GUNS PAGE ROUTED: the main man keeps the line; the best fighters among the rest keep the
// line's other places; the best eyes among the rest take the rifles, then the pistols, then the shotguns. The Lone Wolf keeps
// his blade (measured on the guns page: one man loses with a gun). Every number DRAFT; nothing in the game reads the outputs.
//
//   node tools/bohemia_tuning_the_first_hour.js [--n 200] [--jobs 2]
// writes banks/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.json, records/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.md and
// slices/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.html
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const GRID = require('./bohemia_tuning_the_whole_grid.js');
const GUNS = path.join(ROOT, 'tools/bohemia_tuning_the_first_kit_is_guns.js');
const OUT = 'banks/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.json';
const REC = 'records/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.md';
const PAGE = 'slices/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.html';
const ORIG = J('records/target/bb/origins.json').origins;
const BG = new Map(J('records/target/bb/backgrounds.json').rows.map(r => [r.id, r]));
const mid = (bg, k) => { const s = BG.get(bg).stats[k]; return (s[0] + s[s.length - 1]) / 2; };
const SETS = ['bb', 'start'], KITS = ['today', 'draft'];

/* ---------- the guns, handed by the man (the guns page's routing) ---------- */
const CYCLE = ['rifle', 'pistol', 'line', 'rifle', 'shotgun', 'line'];
function slotsFor(men) {
  const n = men.length; if (n === 1) return null;
  const want = Array.from({ length: n - 1 }, (_, i) => CYCLE[i % CYCLE.length]);
  const lines = want.filter(x => x === 'line').length;
  const guns = want.filter(x => x !== 'line').sort((a, b) => ['rifle', 'pistol', 'shotgun'].indexOf(a) - ['rifle', 'pistol', 'shotgun'].indexOf(b));
  const rest = men.map((m, i) => i).slice(1);
  const byFight = rest.slice().sort((a, b) => mid(men[b].background, 'melee_skill') - mid(men[a].background, 'melee_skill') || a - b);
  const out = men.map(() => 'line');
  const onLine = new Set(byFight.slice(0, lines));
  rest.filter(i => !onLine.has(i)).sort((a, b) => mid(men[b].background, 'ranged_skill') - mid(men[a].background, 'ranged_skill') || a - b)
    .forEach((i, k) => { out[i] = guns[k]; });
  return out;
}
function levelOf(men) { return men.reduce((s, m) => { const sl = BG.get(m.background).starting_level; return s + (m.level || (sl[0] + sl[sl.length - 1]) / 2); }, 0) / men.length; }
const LEV = id => GRID.SETTINGS.filter(s => s.id === id)[0].L;

function cells() {
  const out = [];
  ORIG.forEach(o => {
    const men = o.men.map(m => ({ background: m.background, level: m.level || undefined })), n = men.length, lv = levelOf(men);
    SETS.forEach(s => KITS.forEach(k => {
      if (k === 'draft' && n === 1) return;
      const count = GRID.mapCount(n, lv, 1, LEV(s).pick);
      out.push({ origin: o.id, name: o.name, d: o.d, kit: k, setting: s, C: { kind: 'humans', company: n, enemies: count, kit: k, setting: s, men: men, slots: k === 'draft' ? slotsFor(men) : null } });
    }));
  });
  return out;
}

async function main() {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
  const N = Number(arg('--n', 200)), JOBS = Number(arg('--jobs', 2));
  const sfile = path.join(os.tmpdir(), 'bohemia_first_hour_strikes_' + process.pid + '.json');
  fs.writeFileSync(sfile, JSON.stringify(GRID.wikiStrikes(Object.keys(GRID.BEASTS))));
  const work = cells(), res = {};
  let next = 0, running = 0; const t0 = Date.now();
  await new Promise(done => {
    const pump = () => { while (running < JOBS && next < work.length) { const w = work[next++]; running++;
      cp.execFile(process.execPath, [GUNS, '--cell', JSON.stringify(w.C), String(N), sfile], { maxBuffer: 1 << 26 }, (err, out) => {
        running--; if (err) { console.error('cell failed', w.origin, w.kit, w.setting, err.message); process.exit(1); }
        const T = JSON.parse(out), f = GRID.felt(T);
        res[[w.origin, w.kit, w.setting].join('|')] = { origin: w.origin, kit: w.kit, setting: w.setting, company: w.C.company, enemies: w.C.enemies, slots: w.C.slots,
          won_in_100: f.won_in_100, your_men_struck_down_per_fight: f.your_men_struck_down_per_fight, your_men_dead_per_100_fights: f.your_men_dead_per_100_fights,
          whole_company_down_in_100: f.whole_company_down_in_100, minutes_on_auto: f.minutes_on_auto, stalled_in_100: f.stalled_in_100,
          guns_share_of_the_killing_in_100: T.allDmg ? Math.round(100 * T.gunDmg / T.allDmg) : null };
        process.stderr.write(Object.keys(res).length + '/' + work.length + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
        if (next >= work.length && running === 0) done(); else pump(); }); } };
    pump();
  });
  fs.unlinkSync(sfile);
  fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify({
    _readme: 'TUNING [the first hour\'s numbers] 10/19 (rule 117; rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. Each origin\'s first fight: '
      + 'its own men against the party our map sends that company on day one at one skull (party_math), today\'s kit and the draft guns (handed by the man), at '
      + 'Battle Brothers\' Veteran and at our start; the live fight headless (tools/bohemia_tuning_the_first_kit_is_guns.js --cell), seeded 9000+k. Key: origin|kit|setting.',
    draft: true, schema: 1, fights_per_cell: N, cells: res
  }, null, 1) + '\n');
  write(res, N);
}

/* ---------- the other first-hour numbers, each beside Battle Brothers' first hour (sourced rows, marked) ---------- */
function others() {
  const o = id => ORIG.filter(x => x.id === id)[0];
  const nc = o('newcrew'), rb = o('rebuild');
  return [
    { what: 'the starting purse (A NEW CREW, the middle money)', ours: nc.batteries.thin + ' batteries (' + nc.crowns.medium + ' crowns at ten a battery)', bb: rb.crowns.medium + ' crowns (Rebuilding a Company, Medium funds; bb_all/1651)', mark: 'EASIER', proposed: 'as is', src: 'records/target/bb/origins.json' },
    { what: 'the first wages (three men, a day)', ours: '0 (hire.wage_charged: the screens charge no wage)', bb: '42 crowns a day (three companions at a base wage of 14; bb_all/0427)', mark: 'EASIER', proposed: 'as is in the first hour; PEOPLE and ECONOMY owe the wage itself (a company that never pays never feels the purse)', src: 'banks/BOHEMIA_TUNING_EASIER_ROWS_10_18_26.json hire.wage_charged' },
    { what: 'the first fight\'s enemies', ours: 'brigands of the early tier (thugs 8 to raiders 2), as many as the map\'s job count for your company at one skull, the Beginner count at our start', bb: 'thugs and sometimes raiders (bb_all/0299_Brigands), sized by the company\'s strength at Veteran', mark: 'EASIER at our start (the count x0.85), the same at Veteran', proposed: 'as measured below', src: 'ours.enemy_tiers, records/target/bb/party_math.json' },
    { what: 'the first fight\'s enemy gear', ours: 'the early tier\'s rows: Thug body 5-70, head 0-45, a club or a pitchfork; no bows before day 20 (25 at our start)', bb: 'the same rows (the wiki\'s Brigand Thug)', mark: 'the same, and later at our start', proposed: 'as is', src: 'records/target/bb/enemies.json, ours.enemy_tiers' },
    { what: 'the first gun in his hands', ours: 'none in 14 of 15 origins (the seventh man is the first rifle)', bb: 'a ranged companion with his bow or crossbow from the first day', mark: 'HARDER, NO WORD (and against rule 120(a))', proposed: 'the draft guns handed by the man (records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md)', src: 'the guns page, finding 1' },
    { what: 'the first man struck down: does he die', ours: '20 in 100 (+5 a mark carried)', bb: '67 in 100 (survival 33)', mark: 'EASIER', proposed: 'as is', src: 'ours.struck_down_death_chance' },
    { what: 'the first man struck down who lives: how long he is out', ours: '30 to 40 days laid up', bb: '0 days: he fights on with a permanent injury', mark: 'HARDER, HIS WORD (9/27)', proposed: 'as is (his)', src: 'ours.struck_down_laid_up_days' },
    { what: 'the first hire\'s price (a militiaman, level one)', ours: 'up to 225 batteries', bb: '49 batteries by the wiki\'s formula (base plus 1.25 x the kit)', mark: 'HARDER, NO WORD (4.6 times)', proposed: '49 (engine/bohemia_pricetable.js hireCostRange, already in the repo, loaded by no screen)', src: 'records/BOHEMIA_TUNING_THE_SCREENS_AROUND_THE_FIGHT_IN_THE_ONE_TABLE_10_18_26.md' },
    { what: 'the first hire\'s stars', ours: 'one starred stat', bb: 'three starred stats (60/30/10 for one to three stars)', mark: 'HARDER, NO WORD', proposed: 'three, as Battle Brothers', src: 'hire.starred_stats' },
    { what: 'the first sale (what a town pays for your loot)', ours: '1/7 of its worth', bb: '0.136 at a town hall, neutral (0.109 a camp, 0.177 a city)', mark: 'EASIER (a hair)', proposed: 'as is', src: 'market.sell_cut' },
    { what: 'the first doctor', ours: '20 plus a fifth a level, halves the days', bb: 'the same (the Temple: 20, x0.2 a level, halves)', mark: 'the same', proposed: 'as is', src: 'clinic.base_price' },
    { what: 'the first haircut', ours: '1 battery', bb: 'free', mark: 'HARDER, HIS WORD', proposed: 'as is (his)', src: 'barber.price' },
    { what: 'the first job\'s pay (one skull)', ours: '30 batteries', bb: 'one sourced anchor: 760 crowns (76 batteries) for a fifteen-head job; nothing per skull', mark: 'NO TWIN', proposed: 'as is until ECONOMY prices a job by its heads (contractPayBatteries, in the repo)', src: 'contract.pay_one_skull' },
    { what: 'jobs he may hold at once', ours: '2', bb: '1', mark: 'EASIER', proposed: 'as is', src: 'contract.slots' },
    { what: 'the first level up (experience)', ours: 'the wiki\'s table, -15 in 100 at Veteran, -5 at our start', bb: 'the same table, -15 at Veteran (bb_all Experience)', mark: 'EASIER at our start', proposed: 'as is', src: 'experience.global_modifier' },
    { what: 'his first swing\'s roll', ours: '+5 for you, -5 for them at our start (Battle Brothers\' Beginner roll)', bb: '0 at Veteran', mark: 'EASIER', proposed: 'as is', src: 'the rule 117 levers (banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json)' }
  ];
}

function write(res, N) {
  const get = (o, k, s) => res[[o, k, s].join('|')] || null;
  const OTH = others();
  const md = [], P = x => md.push(x);
  const nm = id => ORIG.filter(x => x.id === id)[0];
  const rows = ORIG.map(o => ({ o, today: get(o.id, 'today', 'start'), draft: get(o.id, 'draft', 'start'), bbT: get(o.id, 'today', 'bb'), bbD: get(o.id, 'draft', 'bb') }));
  const worst = rows.slice().sort((a, b) => (a.draft || a.today).won_in_100 - (b.draft || b.today).won_in_100);
  P('# TUNING [the first hour\'s numbers]: what he meets first, beside Battle Brothers\' first hour (10/19)');
  P('');
  P('RESEARCH ONLY (rule 38g). DRAFT: THE GEAR IS NOT IN (rule 117(e)). Nothing in the game reads this page or its bank. Battle Brothers and his "Nintendo-simple" are the whole frame (rule 117).');
  P('');
  P('## Why');
  P('');
  P('Rule 117 (Paolo 10/18): "I want you to be easier than Battle Brothers... like Nintendo simplified... let\'s just make the people feel that they\'re successfully doing it." The first hour decides whether a player feels successful. And rule 120 (10/18): "the combat is still so fucking ass... so fucking hard... I wanna start off with the guns."');
  P('');
  P('## THE FIRST FIGHT OF EVERY ORIGIN (measured: won in 100)');
  P('');
  P('Each origin\'s own men against the brigands our map sends that company on day one (party_math\'s job count at one skull: Battle Brothers\' Veteran count, and the Beginner count at our start), the early tier\'s dress. TODAY = the kit of each man\'s place in the line. GUNS = the draft guns '
    + '(records/BOHEMIA_TUNING_THE_FIRST_KIT_IS_GUNS_10_19_26.md) handed by the man: the main man and the best fighters keep the line, the best eyes take the rifle, then the pistol, then the shotgun; the Lone Wolf keeps his blade. ' + N + ' seeded fights a cell, AUTO on both sides.');
  P('');
  P('| origin | men | difficulty | their men (Veteran / our start) | BATTLE BROTHERS\' VETERAN, today\'s kit | OUR START, today\'s kit | OUR START, THE GUNS | your men struck down a fight (start: today / guns) | dead in 100 fights (start: today / guns) | minutes on AUTO (start, guns) | the guns\' hands |');
  P('|---|---|---|---|---|---|---|---|---|---|---|');
  rows.forEach(r => {
    const g = r.draft || r.today;
    P('| ' + r.o.name + ' | ' + r.o.men.length + ' | ' + r.o.difficulty + ' | ' + (r.bbT ? r.bbT.enemies : '-') + ' / ' + (r.today ? r.today.enemies : '-') + ' | ' + (r.bbT ? r.bbT.won_in_100 : '-') + ' | ' + (r.today ? r.today.won_in_100 : '-') + ' | ' + (r.draft ? r.draft.won_in_100 : 'keeps his blade') + ' | '
      + (r.today ? r.today.your_men_struck_down_per_fight : '-') + ' / ' + (r.draft ? r.draft.your_men_struck_down_per_fight : '-') + ' | ' + (r.today ? r.today.your_men_dead_per_100_fights : '-') + ' / ' + (r.draft ? r.draft.your_men_dead_per_100_fights : '-') + ' | ' + g.minutes_on_auto + ' | '
      + (r.draft && r.draft.slots ? r.draft.slots.map((s, i) => s === 'line' ? null : r.o.men[i].background.replace(/_/g, ' ') + ' ' + s).filter(Boolean).join(', ') : '-') + ' |');
  });
  P('');
  const under = rows.filter(r => (r.draft || r.today) && (r.draft || r.today).won_in_100 < 70);
  P('**THE FIRST FIGHTS UNDER 70 IN 100 WITH THE GUNS, AT OUR START (rule 117: a first fight he should mostly win):** ' + (under.length ? under.map(r => r.o.name + ' ' + (r.draft || r.today).won_in_100 + ' (' + r.o.men.length + ' against ' + (r.draft || r.today).enemies + ')').join('; ') : 'none') + '.');
  P('');
  P('Battle Brothers\' own first fight is the Veteran column with today\'s kit: its numbers, its count. Every origin\'s first fight at our start with the guns is easier than it in ' + rows.filter(r => r.bbT && (r.draft || r.today).won_in_100 >= r.bbT.won_in_100).length + ' of ' + rows.length + ' origins.');
  P('');
  P('## EVERY OTHER NUMBER HE MEETS IN THE FIRST HOUR');
  P('');
  P('| what he meets | ours | Battle Brothers\' first hour | mark | proposed | source |');
  P('|---|---|---|---|---|---|');
  OTH.forEach(x => P('| ' + x.what + ' | ' + x.ours + ' | ' + x.bb + ' | ' + x.mark + ' | ' + x.proposed + ' | ' + x.src + ' |'));
  P('');
  const harderNo = OTH.filter(x => /HARDER, NO WORD/.test(x.mark));
  P('**HARDER THAN BATTLE BROTHERS WITH NO WORD FROM HIM (rule 117(d): a NO before he sees it): ' + harderNo.length + '.** ' + harderNo.map(x => x.what + ': ' + x.ours + ' against ' + x.bb + '; proposed ' + x.proposed).join('. ') + '.');
  P('');
  P('## The finding that proves us wrong');
  P('');
  P('My EASIER, MEASURED page (78 wins in 100 at our start) played four fights with the twelve. No origin starts with twelve but THE BLOCK WATCH; nine of the fifteen start with three men or fewer. The first fight a player actually meets is the table above, and it is a different game: the small crews\' first fights are where the hardness lives.');
  P('');
  P('## WHAT CANNOT BE TESTED YET');
  P('');
  P('1. THE GUNS ARE THE BENCH\'S: the draft rows, the row\'s own distance numbers and the butt are in memory only until COMBAT builds them.');
  P('2. THE MAP\'S FIRST JOB: the count is party_math\'s one-skull job for the company; the demo\'s map may send a roaming party first (RUN\'s [a few, not twelve]); a roaming party is sized the same way.');
  P('3. AUTO PLAYS BOTH SIDES: a player does better; the comparison between kits and settings is fair, the absolute number a floor.');
  P('4. WAGES AND FOOD: the first hour charges none, so nothing here can be felt yet (ECONOMY, PEOPLE).');
  P('');
  P('## ROUTED');
  P('');
  P('- COMBAT + RUN: each origin\'s first fight with the guns handed by the man (the table\'s last column); the origins under 70 above want a smaller first job or a better first hand.');
  P('- RUN TWO + ECONOMY: the first hire\'s price, 49 by the wiki\'s formula against 225 (engine/bohemia_pricetable.js is in the repo and no screen loads it); three starred stats, not one.');
  P('- PEOPLE + ECONOMY: wages are charged nowhere, so the first hour\'s purse never moves on its own.');
  P('');
  P('Bank: ' + OUT + '. Tool: tools/bohemia_tuning_the_first_hour.js (the bench is the guns page\'s, --cell with an origin\'s own men).');
  P('');
  P('[bb Battle Brothers\' first hour is three companions, 2000 crowns, 42 a day in wages and a band of six thugs; it is hard on purpose, and the purse moving every day is half of why.]');
  P('[analog horror: the first fight is the first thing he hears the gun do; named for SOUNDS, not moved.]');
  fs.writeFileSync(path.join(ROOT, REC), md.join('\n') + '\n');

  /* the VOTE page */
  const band = w => w === null || w === undefined ? '' : w >= 70 ? 'g' : w >= 40 ? 'a' : 'r';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const h = [];
  h.push('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">');
  h.push('<title>YOUR FIRST FIGHT</title>');
  h.push('<style>:root{--bg:#f4efe4;--ink:#1b1711;--line:#8a7d66;--g:#bfd8a8;--a:#f0d79a;--r:#e7a593}body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font:15px/1.4 Georgia,serif}'
    + 'h1{font-size:20px;margin:0 0 6px}h2{font-size:16px;margin:18px 0 6px}p,li{max-width:72ch}.wrap{overflow-x:auto}table{border-collapse:collapse;font-size:13px}th,td{border:1px solid var(--line);padding:4px 5px;text-align:center}'
    + 'th{background:#e8dfcd;font-weight:normal}td:first-child{text-align:left}td.g{background:var(--g)}td.a{background:var(--a)}td.r{background:var(--r)}.key span{display:inline-block;padding:2px 6px;margin-right:4px;border:1px solid var(--line);font-size:12px}.k{font-size:11px;color:#5b5244;overflow-wrap:anywhere}</style></head><body>');
  h.push('<h1>YOUR FIRST FIGHT</h1>');
  h.push('<p>TUNING, research only. Every start, its own crew, against the bandits the map sends on day one. How many fights in 100 you win. <b>DRAFT.</b></p>');
  h.push('<p class="key"><span style="background:var(--g)">70+ you mostly win</span><span style="background:var(--a)">40 to 69 a coin toss</span><span style="background:var(--r)">under 40 you mostly lose</span></p>');
  h.push('<div class="wrap"><table><tr><th>start</th><th>crew v bandits</th><th>Battle Brothers</th><th>ours, pipes</th><th>ours, guns</th></tr>');
  rows.forEach(r => h.push('<tr><td>' + esc(r.o.name) + '</td><td>' + r.o.men.length + ' v ' + (r.today ? r.today.enemies : '-') + '</td>'
    + [r.bbT, r.today, r.draft].map((x, i) => '<td class="' + band(x ? x.won_in_100 : (i === 2 && r.today ? r.today.won_in_100 : null)) + '">' + (x ? x.won_in_100 : (i === 2 ? 'blade' : '-')) + '</td>').join('') + '</tr>'));
  h.push('</table></div>');
  h.push('<p>Starts still under 70 with guns: <b>' + (under.length ? under.map(r => esc(r.o.name.toLowerCase())).join(', ') : 'none') + '</b>.</p>');
  h.push('<h2>The rest of the first hour</h2><ul>');
  OTH.filter(x => /HARDER|EASIER/.test(x.mark)).slice(0, 8).forEach(x => h.push('<li><b>' + esc(x.what) + ':</b> ' + esc(x.ours) + ' (Battle Brothers: ' + esc(x.bb.replace(/ \(.*\)$/, '')) + '). ' + esc(x.mark.split(' (')[0].toLowerCase()) + '.</li>'));
  h.push('</ul>');
  h.push('<p class="k">Every number, its source and the proposal: ' + REC + '. ' + Object.keys(res).length + ' cells, ' + N + ' fights each, the computer playing both sides. draft:true.</p>');
  h.push('</body></html>');
  fs.writeFileSync(path.join(ROOT, PAGE), h.join('\n') + '\n');
  console.log('first fights at our start, guns: ' + rows.map(r => r.o.id + ' ' + (r.draft || r.today).won_in_100).join(', '));
  console.log('wrote ' + REC + ' and ' + PAGE);
}
if (require.main === module) {
  if (process.argv.includes('--page')) write(J(OUT).cells, J(OUT).fights_per_cell);
  else main().catch(e => { console.error(e); process.exit(1); });
}
