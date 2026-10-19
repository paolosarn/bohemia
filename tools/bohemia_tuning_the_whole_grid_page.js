#!/usr/bin/env node
// TUNING [the whole grid] 10/18 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 117(e)).
// Reads banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json (tools/bohemia_tuning_the_whole_grid.js) and writes:
//   records/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.md   the page the building lanes cite: every cell, the worst first, Battle
//                                                        Brothers beside each, what cannot be tested yet and why
//   slices/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.html  the VOTE page: the grid as a picture (rule 88: a page, no sheet)
// Battle Brothers beside a cell is two things: (1) MEASURED, the same fight at Battle Brothers' Veteran (the bench's 'bb'
// setting: today plus a level raising three stats), and (2) WHETHER ITS MAP SENDS IT: party_math's job count for that company
// at that stage from one skull to three at Veteran, WITHOUT our cap of 13 (the cap is ours, draft; Battle Brothers' count
// words go to 'a plethora, 14 or more'). Every number is DRAFT: THE GEAR IS NOT IN.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const GRID = require('./bohemia_tuning_the_whole_grid.js');
const B = J('banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json');
const PM = J('records/target/bb/party_math.json');
const BGS = new Map(J('records/target/bb/backgrounds.json').rows.map(r => [r.id, r]));
const C = B.cells, key = (k, c, e, s, t) => [k, c, e, s, t].join('|');
const get = (k, c, e, s, t) => C[key(k, c, e, s, t)] || null;
const STAGES = ['early', 'middle', 'late'], SETS = ['start', 'today', 'bb'], COUNTS = [3, 6, 12, 20, 38];
const SNAME = { early: 'EARLY', middle: 'MIDDLE', late: 'LATE' };
const TNAME = { start: 'OUR START (rule 117)', today: 'THE GAME TODAY', bb: 'BATTLE BROTHERS (Veteran)' };
const KNAME = k => k === 'humans' ? 'PEOPLE (brigands)' : (k.replace(/_/g, ' ').toUpperCase() + (k === 'direwolf' ? 'S' : ''));

/* ---------- what Battle Brothers' map sends this company at this stage ---------- */
function levelOf(company, stage) {
  const st = B.stages[stage]; if (st.level) return st.level;
  const men = GRID.companyOf(company, stage);
  return men.reduce((s, m) => { const sl = BGS.get(m.background).starting_level; return s + (m.level || (sl[0] + sl[sl.length - 1]) / 2); }, 0) / men.length;
}
function bbSends(company, stage) {
  const P = PM.job.value, rs = PM.roster_strength.value, lv = levelOf(company, stage);
  const str = Math.min(company, rs.strongest_wide) * (rs.per_man + rs.per_level * (lv - 1));
  const n = sk => Math.max(P.min, Math.floor(str / P.strength_per_enemy * P.skull_mult[String(sk)] + 0.5));
  return { lo: n(1), hi: n(3), level: Math.round(lv * 10) / 10 };
}
const band = w => w === null || w === undefined ? '' : w >= 70 ? 'g' : w >= 40 ? 'a' : 'r';

/* ---------- the rows ---------- */
const kinds = Array.from(new Set(Object.values(C).map(c => c.kind)));
const gridKinds = kinds.filter(k => B.companies.every(c => get(k, c, 3, 'early', 'start')));
const rows = [];
Object.values(C).forEach(c => {
  if (c.setting !== 'start' || c.enemies_asked === 'map') return;
  const bb = get(c.kind, c.company, c.enemies_asked, c.stage, 'bb'), td = get(c.kind, c.company, c.enemies_asked, c.stage, 'today');
  const s = bbSends(c.company, c.stage);
  rows.push({ kind: c.kind, company: c.company, enemies: c.enemies_asked, stage: c.stage, start: c.won_in_100, today: td ? td.won_in_100 : null,
    bb: bb ? bb.won_in_100 : null, meets: c.enemies_asked <= s.hi, bbRange: s, down: c.share_of_your_men_struck_down_in_100,
    dead: c.your_men_dead_per_100_fights, minutes: c.minutes_on_auto, stalled: c.stalled_in_100 });
});
const met = rows.filter(r => r.meets && gridKinds.indexOf(r.kind) >= 0);
const worst = met.slice().sort((a, b) => a.start - b.start || b.enemies - a.enemies);
const mapPick = (k, c, s, t) => get(k, c, 'map', s, t);

/* ---------- the record ---------- */
const md = [];
md.push('# TUNING [the whole grid]: every fight he will meet, not four (10/18)');
md.push('');
md.push('RESEARCH ONLY (rule 38g). DRAFT: THE GEAR IS NOT IN (rule 117(e)). Nothing in the game reads this page or its bank.');
const PARTIAL = B.cells_asked && B.cells_played < B.cells_asked;
if (PARTIAL) { md.push(''); md.push('**' + B.cells_played + ' OF ' + B.cells_asked + ' SQUARES PLAYED SO FAR.** The bench is still running (the biggest fights take minutes each); a dash is a fight NOT PLAYED YET, never a guess. It resumes from its cache (banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.cells.ndjson) and this page is re-written when it ends.'); }
md.push('');
md.push('## Why');
md.push('');
md.push('Paolo 10/18: "how are you even testing these fights... against animals, against different group sizes, one person, three, six, up to 14... a 12 man Lone wolf squad, you can go up to 36 or 40 Enemies... we don\'t even have all the equipment in the game... what are you even testing?" '
  + 'He was right: last round\'s 78 in 100 was one average of four fights, all against people, all in the starting kit. Rule 117(e): a tuning number is a grid, never one average. '
  + '(records/BOHEMIA_PAOLO_WHAT_ARE_YOU_EVEN_TESTING_A_TUNING_NUMBER_IS_A_GRID_10_18_26.md)');
md.push('');
md.push('## How it was measured');
md.push('');
md.push('- The LIVE fight (slices/BOHEMIA_FIGHT.html\'s own rules and exactly the data files its loadAll() reads), headless in node by tools/bohemia_tuning_the_whole_grid.js; both sides on the fight\'s own AUTO brain; '
  + B.fights_per_cell + ' seeded fights a cell (half for a cell of 30 or more men on the board, the beast roster 40; each cell carries its own count in the bank), so every setting meets the same fights. The hooks at neutral replay the unhooked fight event for event (--control, 6 of 6).');
md.push('- YOUR COMPANY: 1 (THE LONE WOLF\'s hedge knight, level 4), 3 (A NEW CREW\'s three), 6, 12 (the twelve) and 14 (the twelve and two more, the 16-cap origins). Each man keeps his place in the line\'s job.');
md.push('- THEIR NUMBER: 3, 6, 12, 20, 38, and THE MAP\'S PICK (party_math\'s job count, capped at 13 today).');
md.push('- WHO: people (brigands, dressed by the fight\'s own tiers) and every beast whose fight is a body and one strike (below).');
md.push('- THE GEAR STAGE (the day the enemy is dressed for, your level, your gear): ' + STAGES.map(s => SNAME[s] + ' = ' + B.stages[s].why).join('; ') + '.');
md.push('- The middle and late rows by job: ' + Object.keys(B.gear.middle).map(j => j + ' ' + B.gear.middle[j] + ' -> ' + B.gear.late[j]).join(', ') + '. EARLY is each man\'s own kit.');
md.push('- THE SETTING: ' + B.settings.map(t => t.id.toUpperCase() + ' = ' + t.name).join('; ') + '.');
md.push('- BATTLE BROTHERS BESIDE A CELL: the same fight at its Veteran rules (BB, measured), and whether its map sends that many to that company at that stage: party_math\'s job count from one skull to three at Veteran, '
  + 'without our cap of 13 (Battle Brothers\' count words run to "a plethora, 14 or more", GROK_60). The coefficients are party_math\'s own (ours, draft, calibrated on rule 75b\'s anchor); for twelve men at level 9 on a three-skull job they give '
  + bbSends(12, 'late').hi + ', which is his own "36 or 40".');
md.push('');
md.push('## What Battle Brothers\' map sends each company (one skull to three, Veteran, no cap)');
md.push('');
md.push('| your men | EARLY | MIDDLE | LATE |');
md.push('|---|---|---|---|');
B.companies.forEach(c => md.push('| ' + c + ' | ' + STAGES.map(s => { const r = bbSends(c, s); return r.lo + ' to ' + r.hi + ' (level ' + r.level + ')'; }).join(' | ') + ' |'));
md.push('');
md.push('Our map sends at most 13 (party_math job.max and roaming.max, both "ours (draft)"). A fight past 13 is one the game cannot make today; it is in the grid because Battle Brothers makes it.');
md.push('');
md.push('## THE WORST FIGHTS HE WILL MEET (inside what Battle Brothers\' map sends; our start, won in 100, lowest first)');
md.push('');
md.push('| # | who | your men | their men | stage | OUR START | TODAY | BATTLE BROTHERS | your men down, in 100 | dead in 100 fights | minutes on AUTO |');
md.push('|---|---|---|---|---|---|---|---|---|---|---|');
worst.slice(0, 30).forEach((r, i) => md.push('| ' + (i + 1) + ' | ' + KNAME(r.kind) + ' | ' + r.company + ' | ' + r.enemies + ' | ' + SNAME[r.stage] + ' | ' + r.start + ' | ' + r.today + ' | ' + r.bb + ' | ' + r.down + ' | ' + r.dead + ' | ' + (r.stalled ? 'a standoff in ' + r.stalled + ' of 100 (see below)' : r.minutes) + ' |'));
md.push('');
/* THE STANDOFFS: a fight where both sides hold their line and nobody steps in runs to the bench's step limit; it is counted, and
   it would swell the minutes, so a cell with one shows the standoff, not a minute count */
const stalls = Object.values(C).filter(c => c.stalled_in_100 > 0);
if (stalls.length) {
  md.push('## FIGHTS THAT NEVER END (' + stalls.length + ' of ' + Object.keys(C).length + ' squares hold at least one)');
  md.push('');
  md.push('Both sides hold their line and nobody steps in; the bench stops the fight at 400,000 steps and counts it as neither won nor lost. 1 or 2 fights in 100 of these squares: '
    + stalls.slice().sort((a, b) => b.stalled_in_100 - a.stalled_in_100).map(c => KNAME(c.kind).toLowerCase() + ' ' + c.company + ' v ' + c.enemies_asked + ' ' + SNAME[c.stage].toLowerCase() + ' ' + c.setting + ' (' + c.stalled_in_100 + ')').join(', ')
    + '. The same standoff the guns page found with the dire wolves (seed 9168) and the first-hour page found in the small first fights. A player can walk in; AUTO never does. COMBAT.');
  md.push('');
}
gridKinds.forEach(k => {
  md.push('## ' + KNAME(k) + ': the whole grid, won in 100');
  md.push('');
  STAGES.forEach(s => {
    md.push('### ' + SNAME[s] + ' (' + B.stages[s].why + ')');
    md.push('');
    md.push('| your men | ' + COUNTS.map(e => 'vs ' + e).join(' | ') + ' | THE MAP\'S PICK | BATTLE BROTHERS SENDS |');
    md.push('|---|' + COUNTS.map(() => '---').join('|') + '|---|---|');
    B.companies.forEach(c => {
      const bs = bbSends(c, s);
      md.push('| ' + c + ' | ' + COUNTS.map(e => {
        const v = SETS.map(t => { const x = get(k, c, e, s, t); return x ? x.won_in_100 : '-'; });
        return v.join(' / ') + (e > bs.hi ? ' (past BB)' : '');
      }).join(' | ') + ' | ' + SETS.map(t => { const x = mapPick(k, c, s, t); return x ? x.won_in_100 + ' (' + x.enemies + ')' : '-'; }).join(' / ') + ' | ' + bs.lo + ' to ' + bs.hi + ' |');
    });
    md.push('');
    md.push('Each cell: OUR START / TODAY / BATTLE BROTHERS. "(past BB)": more than Battle Brothers\' map sends this company at this stage.');
    md.push('');
  });
});
/* the roster: every played beast */
const roster = kinds.filter(k => gridKinds.indexOf(k) < 0);
if (roster.length) {
  md.push('## THE BEASTS, ONE BY ONE (40 fights a cell, the dire wolves from the grid above; won in 100 at OUR START / TODAY, a dash where only the start was played)');
  md.push('');
  md.push('| beast | what it loses on the bench | ' + STAGES.map(s => [6, 12].map(c => SNAME[s] + ' ' + c + ' vs 3 / 6 / 12').join(' | ')).join(' | ') + ' |');
  md.push('|---|---|' + STAGES.map(() => '---|---').join('|') + '|');
  roster.concat(['direwolf']).forEach(k => {
    md.push('| ' + KNAME(k) + ' | ' + (B.loses[k] || 'nothing named') + ' | ' + STAGES.map(s => [6, 12].map(c => [3, 6, 12].map(e => {
      const a = get(k, c, e, s, 'start'), b = get(k, c, e, s, 'today'); return a ? a.won_in_100 + '/' + (b ? b.won_in_100 : '-') : '-'; }).join(' . ')).join(' | ')).join(' | ') + ' |');
  });
  md.push('');
}
/* the weight: the endgame armour beside the late armour, the same twelve, the same fights */
if (get('humans', 12, 20, 'endgame', 'start')) {
  md.push('## THE WEIGHT: the twelve in 300 armour against the same twelve in 210 (won in 100, OUR START / TODAY / BATTLE BROTHERS)');
  md.push('');
  md.push('| their men | LATE (210 body, 210 head) | ENDGAME (300 body, 300 head) |');
  md.push('|---|---|---|');
  [12, 20, 38].forEach(e => md.push('| ' + e + ' | ' + ['late', 'endgame'].map(s => SETS.map(t => { const x = get('humans', 12, e, s, t); return x ? x.won_in_100 : '-'; }).join(' / ')).join(' | ') + ' |'));
  md.push('');
  md.push('In the endgame armour a man of ours keeps 8 to 15 of his breath (his fatigue of 87 to 102, less 82 of gear: coat of scales 38, full helm 20, heater shield 14, winged mace 10), so he is spent after one swing. '
    + 'In the fight a level never raises his fatigue (TODAY; the BB setting raises only skill, defence and hitpoints), and Battle Brothers\' late company carries this armour on its level-ups and Brawny. So the late column of the grid is the 210 armour a man can carry, and the best armour in the game today makes your men WORSE. COMBAT + PEOPLE.');
  md.push('');
}
md.push('## WHAT CANNOT BE TESTED YET, AND WHY');
md.push('');
md.push('1. THE BEASTS ARE A BODY AND ONE BITE. Since COMBAT [the fight holds the grid] (ac9722ee) the live fight builds a beast from records/target/bb/beast_attacks.json, read off the same wiki skill pages; the bench hands each beast that same strike as a weapon row in memory (' + Object.keys(B.strikes).length + ' pages), which the fight takes first, so the numbers are the live fight\'s. '
  + 'What is NOT built (COMBAT\'s own list): bleeding, stagger, knockback, the schrat\'s and the unhold\'s three-tile swings, Grow Shield, the pack\'s own brain (they fight as a line), the beasts\' fear of guns. What each one loses is in the table above.');
md.push('2. BEASTS WHOSE SPECIAL IS THE FIGHT, NOT PLAYED: ' + Object.keys(B.not_played).map(k => k.replace(/_/g, ' ') + ' (' + B.not_played[k] + ')').join('; ') + '.');
md.push('3. THE GEAR IS NOT IN. The middle and late rows are mine, from the market\'s own rows (RUN TWO\'s shelves sell every weapons.json and armor.json row by value band); CHARACTER\'s roll-call and COMBAT\'s equipment have not coordinated what a man can own. '
  + 'The shotgun\'s kind (firearm) has one row in the data, the handgonne, so a shotgun never gets better. Named and famed pieces are left out. The LONE WOLF fights in the kit of the line\'s first place (a padded surcoat and a pipe); Battle Brothers starts him with "great equipment".');
md.push('4. ONLY BRIGANDS ARE DRESSED. ours.enemy_tiers has a tier mix for brigands alone; the other factions\' 100-odd rows exist in enemies.json but no party of nobles, nomads, the dead, orcs, goblins or barbarians can be dressed by day. Not in this grid.');
md.push('5. AUTO PLAYS BOTH SIDES. A player who sets the line, picks targets and retreats wins more than these numbers; every number is AUTO against AUTO, the same on every setting, so the comparison between settings is fair and the absolute number is a floor.');
md.push('6. PAST 13 THE GAME CANNOT MAKE THE FIGHT. The 20 and 38 columns are fights our map never sends today (its cap is 13); they are here because Battle Brothers sends them.');
md.push('');
md.push('## ROUTED');
md.push('');
md.push('- COMBAT: (a) the beasts\' specials (the table\'s LOSES column is the list, worst cell first); (b) party_math\'s cap of 13 against Battle Brothers\' plethora (the twelve at level 9 on a three-skull job make ' + bbSends(12, 'late').hi + '); (c) a tier mix for a second faction.');
md.push('- CHARACTER + COMBAT: the gear roll-call; until it lands every number here is DRAFT.');
md.push('- COMBAT + PEOPLE: the weight (above): a level raises no fatigue in the fight, so the 300 armour leaves a man one swing.');
md.push('- RUN + RUN TWO: the lone wolf\'s starting kit (Battle Brothers\' "great equipment").');
md.push('- TUNING (next): [slightly harder, measured] is set across this grid, never on one average.');
md.push('');
md.push('Bank: banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json (draft:true; every cell\'s felt numbers, the strikes with their pages). Tools: tools/bohemia_tuning_the_whole_grid.js (the bench), tools/bohemia_tuning_the_whole_grid_page.js (this page).');
md.push('');
md.push('[bb Battle Brothers sizes a fight by the strength of your twelve best, the job\'s skulls and the days, and lets it grow past forty; ours stops at thirteen.]');
md.push('[analog horror: the 38-man rows are the screen most full of bodies the game can make; named for SOUNDS and COMBAT, not moved.]');
fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.md'), md.join('\n') + '\n');

/* ---------- the VOTE page: the grid as a picture, one look ---------- */
const DATA = {};
gridKinds.forEach(k => { DATA[k] = {}; STAGES.forEach(s => { DATA[k][s] = {}; SETS.forEach(t => {
  DATA[k][s][t] = B.companies.map(c => COUNTS.map(e => { const x = get(k, c, e, s, t); return x ? x.won_in_100 : null; })
    .concat([(x => x ? [x.won_in_100, x.enemies] : null)(mapPick(k, c, s, t))])); }); }); });
const HI = {}; B.companies.forEach(c => { HI[c] = {}; STAGES.forEach(s => { HI[c][s] = bbSends(c, s).hi; }); });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const h = [];
h.push('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">');
h.push('<title>THE WHOLE GRID</title>');
h.push('<style>:root{--bg:#f4efe4;--ink:#1b1711;--line:#8a7d66;--g:#bfd8a8;--a:#f0d79a;--r:#e7a593;--past:#d9d2c3}'
  + 'body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font:15px/1.4 Georgia,serif}h1{font-size:20px;margin:0 0 6px}h2{font-size:16px;margin:18px 0 6px}'
  + 'p,li{max-width:72ch}.tabs{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.tabs button{font:inherit;font-size:13px;padding:6px 10px;border:1px solid var(--line);background:#fff;color:var(--ink);border-radius:0}'
  + '.tabs button.on{background:var(--ink);color:var(--bg)}.panels{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px}'
  + 'table{border-collapse:collapse;font-size:13px}th,td{border:1px solid var(--line);padding:4px 5px;text-align:center;min-width:30px}th{background:#e8dfcd;font-weight:normal}'
  + 'td.g{background:var(--g)}td.a{background:var(--a)}td.r{background:var(--r)}td.past{background:var(--past);color:#6d6455}td.m{font-weight:bold}'
  + '.key span{display:inline-block;padding:2px 6px;margin-right:4px;border:1px solid var(--line);font-size:12px}.k{font-size:11px;color:#5b5244;overflow-wrap:anywhere}</style></head><body>');
h.push('<h1>THE WHOLE GRID</h1>');
if (PARTIAL) h.push('<p><b>' + B.cells_played + ' of ' + B.cells_asked + ' fight sizes played so far.</b> A dash is one the computer has not played yet. This page fills in as it runs.</p>');
h.push('<p>TUNING, research only. Every fight size: one to fourteen of yours against three to thirty-eight, people and dire wolves, early, middle and late gear. Each square is how many fights in 100 you win. <b>DRAFT: the gear is not in yet.</b></p>');
h.push('<p class="key"><span style="background:var(--g)">70+ you mostly win</span><span style="background:var(--a)">40 to 69 a coin toss</span><span style="background:var(--r)">under 40 you mostly lose</span><span style="background:var(--past)">grey: more than Battle Brothers ever sends that company</span></p>');
h.push('<div class="tabs" id="tabs">' + SETS.map((t, i) => '<button data-t="' + t + '"' + (i ? '' : ' class="on"') + '>' + esc(TNAME[t]) + '</button>').join('') + '</div>');
h.push('<div id="grid"></div>');
h.push('<h2>The worst fights you will meet</h2><ol>');
worst.slice(0, 6).forEach(r => h.push('<li><b>' + r.company + ' of yours against ' + r.enemies + ' ' + (r.kind === 'humans' ? 'people' : KNAME(r.kind).toLowerCase()) + ', ' + SNAME[r.stage].toLowerCase() + ':</b> you win ' + r.start + ' in 100 on our start, ' + r.today + ' today, ' + r.bb + ' in Battle Brothers.</li>'));
h.push('</ol>');
h.push('<h2>What we cannot test yet</h2><ul>');
h.push('<li><b>The animals only bite.</b> Each one bites with its Battle Brothers numbers; the bleeding, the knockback and the pack\'s tricks are not built yet. ' + Object.keys(B.not_played).length + ' kinds whose trick is the whole fight (the sleep, the charm, the giant worm) are left out.</li>');
h.push('<li><b>The gear is not in.</b> Middle and late gear here is picked from what the market can sell. The shotgun has only one model, so it never gets better.</li>');
h.push('<li><b>Only bandits come in tiers.</b> No other gang can be dressed for the day yet.</li>');
h.push('<li><b>The game never sends more than 13.</b> The 20 and 38 columns are fights only Battle Brothers makes today.</li>');
h.push('<li>The computer played both sides. You will do better than these numbers.</li>');
h.push('</ul>');
h.push('<p class="k">Every square, the 14 beast bites, Battle Brothers beside each square and the method: records/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.md. ' + Object.keys(C).length + ' squares, ' + B.fights_per_cell + ' fights each (half for the biggest, 40 for the beast roster). draft:true; nothing in the game reads this page.</p>');
h.push('<script>');
h.push('var D=' + JSON.stringify(DATA) + ',HI=' + JSON.stringify(HI) + ',CO=' + JSON.stringify(B.companies) + ',CT=' + JSON.stringify(COUNTS) + ',ST=' + JSON.stringify(STAGES) + ';');
h.push('var KN=' + JSON.stringify(Object.fromEntries(gridKinds.map(k => [k, k === 'humans' ? 'PEOPLE' : 'DIRE WOLVES']))) + ',SN={early:"EARLY",middle:"MIDDLE",late:"LATE"};');
h.push('function band(w){return w===null?"":w>=70?"g":w>=40?"a":"r";}');
h.push('function draw(t){var o="";Object.keys(D).forEach(function(k){o+="<h2>"+KN[k]+"</h2><div class=\\"panels\\">";ST.forEach(function(s){'
  + 'o+="<div><b>"+SN[s]+"</b><table><tr><th>yours</th>"+CT.map(function(e){return "<th>vs "+e+"</th>";}).join("")+"<th>the map sends</th></tr>";'
  + 'CO.forEach(function(c,i){var r=D[k][s][t][i];o+="<tr><th>"+c+"</th>";CT.forEach(function(e,j){var w=r[j];var past=e>HI[c][s];'
  + 'o+="<td class=\\""+(past?"past":band(w))+"\\">"+(w===null?"-":w)+"</td>";});var m=r[CT.length];'
  + 'o+="<td class=\\"m "+(m?band(m[0]):"")+"\\">"+(m?m[0]+" <small>("+m[1]+")</small>":"-")+"</td></tr>";});o+="</table></div>";});o+="</div>";});'
  + 'document.getElementById("grid").innerHTML=o;}');
h.push('var bs=document.querySelectorAll("#tabs button");bs.forEach(function(b){b.onclick=function(){bs.forEach(function(x){x.className="";});b.className="on";draw(b.getAttribute("data-t"));};});draw("start");');
h.push('</script></body></html>');
fs.writeFileSync(path.join(ROOT, 'slices/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.html'), h.join('\n') + '\n');
console.log('cells ' + Object.keys(C).length + ', met cells ' + met.length + ', worst: ' + worst.slice(0, 5).map(r => r.kind + ' ' + r.company + 'v' + r.enemies + ' ' + r.stage + ' ' + r.start).join('; '));
console.log('wrote records/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.md and slices/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.html');
