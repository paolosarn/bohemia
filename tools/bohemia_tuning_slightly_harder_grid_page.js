#!/usr/bin/env node
// TUNING [slightly harder, measured] ON THE GRID 10/18 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 117(e)).
// Reads the 70 lines (banks/BOHEMIA_TUNING_SLIGHTLY_HARDER_GRID_10_18_26.json, tools/bohemia_tuning_slightly_harder_grid.js) and
// the grid (banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json) and writes:
//   records/BOHEMIA_TUNING_SLIGHTLY_HARDER_ON_THE_GRID_10_18_26.md   for every company size and gear stage: how many of them you
//        beat 70 times in 100 at the rule 117 start, beside what our map sends and what Battle Brothers' map sends; the proposal
//   slices/BOHEMIA_TUNING_SLIGHTLY_HARDER_10_18_26.html               the VOTE page (rule 88: a page, no sheet)
// THE PROPOSAL, rule 117(a) kept: the map sends the 70 line, never more than Battle Brothers' map sends that company at that stage
// on a three-skull job, never fewer than its two. Every number DRAFT: THE GEAR IS NOT IN.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const GRID = require('./bohemia_tuning_the_whole_grid.js');
const GB = J('banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json');
const HB = J('banks/BOHEMIA_TUNING_SLIGHTLY_HARDER_GRID_10_18_26.json');
const PM = J('records/target/bb/party_math.json');
const BGS = new Map(J('records/target/bb/backgrounds.json').rows.map(r => [r.id, r]));
const STAGES = ['early', 'middle', 'late'], SN = { early: 'EARLY', middle: 'MIDDLE', late: 'LATE' };
const KINDS = Array.from(new Set(Object.keys(HB.lines).map(k => k.split('|')[0])));
const KN = k => k === 'humans' ? 'PEOPLE' : 'DIRE WOLVES';
function levelOf(c, s) {
  const st = GB.stages[s]; if (st.level) return st.level;
  const men = GRID.companyOf(c, s);
  return men.reduce((a, m) => { const sl = BGS.get(m.background).starting_level; return a + (m.level || (sl[0] + sl[sl.length - 1]) / 2); }, 0) / men.length;
}
function sends(c, s, skulls, mult, cap) {
  const P = PM.job.value, rs = PM.roster_strength.value, lv = levelOf(c, s);
  const str = Math.min(c, rs.strongest_wide) * (rs.per_man + rs.per_level * (lv - 1));
  return Math.max(P.min, Math.min(cap || 1e9, Math.floor(str / P.strength_per_enemy * P.skull_mult[String(skulls)] * mult + 0.5)));
}
const cell = (k, c, e, s, t) => GB.cells[[k, c, e, s, t].join('|')] || null;
const rows = [];
KINDS.forEach(k => GB.companies.forEach(c => STAGES.forEach(s => {
  const L = HB.lines[[k, c, s].join('|')]; if (!L) return;
  const mp = cell(k, c, 'map', s, 'start');
  const bbHi = sends(c, s, 3, 1), bbLo = sends(c, s, 1, 1);
  const proposed = Math.max(Math.min(L.line, bbHi), 0);
  rows.push({ kind: k, company: c, stage: s, line: L.line, won_at_line: L.won_at_line, won_one_more: L.won_one_more, note: L.note || '',
    map_now: mp ? mp.enemies : null, map_now_won: mp ? mp.won_in_100 : null, bb_lo: bbLo, bb_hi: bbHi, proposed: proposed,
    capped_by_bb: L.line > bbHi, level: Math.round(levelOf(c, s) * 10) / 10 });
})));
/* a party sized by the roster score: enemies per point of score that lands on the 70 line, per stage (people only: the map
   sends people; the wolves are a stand-in until the fight has animals) */
const fit = {};
STAGES.forEach(s => {
  const pts = rows.filter(r => r.kind === 'humans' && r.stage === s && r.line >= 2);
  const per = pts.map(r => { const lv = r.level; return r.line / (Math.min(r.company, PM.roster_strength.value.strongest_wide) * (PM.roster_strength.value.per_man + PM.roster_strength.value.per_level * (lv - 1))); });
  per.sort((a, b) => a - b);
  fit[s] = per.length ? { median_enemies_per_score_point: Math.round(per[Math.floor(per.length / 2)] * 1000) / 1000, from: per.length, spread: [Math.round(per[0] * 1000) / 1000, Math.round(per[per.length - 1] * 1000) / 1000] } : null;
});
fs.writeFileSync(path.join(ROOT, 'banks/BOHEMIA_TUNING_SLIGHTLY_HARDER_GRID_10_18_26.json'), JSON.stringify(Object.assign(HB, { rows: rows, fit: fit }), null, 1) + '\n');

/* ---------- the record ---------- */
const md = [];
md.push('# TUNING [slightly harder, measured], set across the grid (10/18)');
md.push('');
md.push('RESEARCH ONLY (rule 38g). DRAFT: THE GEAR IS NOT IN (rule 117(e)). Nothing in the game reads this page or its bank.');
md.push('');
md.push('## His words and the rule');
md.push('');
md.push('His YES on EASIER, MEASURED (tuning-easier-measured-10-18) with: "Make it just slightly harder than that." The coordinator: a small step, not halfway, about 70 in 100, the player still mostly winning (rule 117). '
  + 'Then his "what are you even testing?" and rule 117(e): set it across the grid, never on one average. So "slightly harder" is not one number: it is, for each company size and gear stage, the fight a player wins about 70 times in 100.');
md.push('');
md.push('## How');
md.push('');
md.push('- Battle Brothers moves how hard a fight is through HOW MANY come (records/BOHEMIA_TUNING_THE_DIFFICULTY_STEPS_EXACTLY_10_9_26.md; GROK_60: the count and the tier), so the dial here is the party\'s size. Every per-fight lever stays at THE START he said YES to (your roll +5, theirs -5, a bad streak ends, their nerve 0.9, your breath 18).');
md.push('- THE 70 LINE: for each company (1, 3, 6, 12, 14) and stage (early, middle, late), the most of them you beat 70 or more times in 100, found by halving between two of the grid\'s columns, ' + HB.fights_per_step + ' seeded fights a step (tools/bohemia_tuning_slightly_harder_grid.js on the grid\'s own bench). The noise at 100 fights is about 5 in 100 either way, so a line is "about".');
md.push('- Beside it: what OUR MAP sends today at the start (party_math\'s job count at Beginner\'s 0.85, capped at 13) and what BATTLE BROTHERS\' MAP sends (the same job count from one skull to three at Veteran, no cap).');
md.push('- THE PROPOSAL keeps rule 117(a): the map sends the 70 line, never more than Battle Brothers\' three-skull count for that company at that stage.');
md.push('');
md.push('## The 70 line');
md.push('');
md.push('| who | your men | stage | your level | THE 70 LINE (won at it / one more) | OUR MAP SENDS today (won) | BATTLE BROTHERS SENDS | PROPOSED |');
md.push('|---|---|---|---|---|---|---|---|');
rows.forEach(r => md.push('| ' + KN(r.kind) + ' | ' + r.company + ' | ' + SN[r.stage] + ' | ' + r.level + ' | ' + (r.line ? r.line + ' (' + r.won_at_line + ' / ' + (r.won_one_more === null ? '-' : r.won_one_more) + ')' : '0: ' + r.note)
  + ' | ' + r.map_now + ' (' + r.map_now_won + ')' + ' | ' + r.bb_lo + ' to ' + r.bb_hi + ' | ' + (r.kind === 'humans' ? r.proposed + (r.capped_by_bb ? ' (Battle Brothers\' cap)' : '') : 'no map yet') + ' |'));
md.push('');
md.push('## What moved, in the one table');
md.push('');
md.push('- party_math job.max (13, ours draft) becomes the 70 line at the largest company and stage; the rows below are the people\'s proposal.');
STAGES.forEach(s => { const f = fit[s]; if (f) md.push('- ' + SN[s] + ': enemies per point of roster score at the 70 line, median ' + f.median_enemies_per_score_point + ' (from ' + f.from + ' companies, spread ' + f.spread.join(' to ') + '); party_math\'s job today is 0.1 a point at two skulls.'); });
md.push('');
md.push('[bb Battle Brothers makes a fight harder by sending more of them, and grows the party with your company; the 70 line is that dial set so the player still mostly wins.]');
md.push('[analog horror: the fight a player wins 70 times in 100 still loses a man in some of them; the loss is the scene, named for SOUNDS.]');
fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_SLIGHTLY_HARDER_ON_THE_GRID_10_18_26.md'), md.join('\n') + '\n');

/* ---------- the VOTE page: one table a stage, people first ---------- */
const h = [];
h.push('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">');
h.push('<title>SLIGHTLY HARDER, EVERY SIZE</title>');
h.push('<style>:root{--bg:#f4efe4;--ink:#1b1711;--line:#8a7d66;--g:#bfd8a8;--a:#f0d79a;--r:#e7a593}body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font:15px/1.4 Georgia,serif}'
  + 'h1{font-size:20px;margin:0 0 6px}h2{font-size:16px;margin:18px 0 6px}p,li{max-width:72ch}.w{overflow-x:auto}table{border-collapse:collapse;font-size:13px}'
  + 'th,td{border:1px solid var(--line);padding:5px 7px;text-align:center}th{background:#e8dfcd;font-weight:normal}td.big{font-size:17px;font-weight:bold}'
  + '.g{background:var(--g)}.a{background:var(--a)}.r{background:var(--r)}.k{font-size:11px;color:#5b5244;overflow-wrap:anywhere}</style></head><body>');
h.push('<h1>SLIGHTLY HARDER, EVERY SIZE</h1>');
h.push('<p>TUNING, research only. You said "just slightly harder". So for every size of company, early, middle and late, we found the fight you win about 70 times in 100: how many of them can come. <b>DRAFT: the gear is not in yet.</b></p>');
const band = w => w === null || w === undefined ? '' : w >= 75 ? 'g' : w >= 60 ? 'a' : 'r';
KINDS.forEach(k => {
  h.push('<h2>' + KN(k) + (k === 'humans' ? '' : ' <small>(a stand-in: the fight has no animals yet)</small>') + '</h2><div class="w"><table><tr><th>your men</th>'
    + STAGES.map(s => '<th colspan="3">' + SN[s] + '</th>').join('') + '</tr><tr><th></th>' + STAGES.map(() => '<th>about 70 in 100</th><th>the game sends now</th><th>Battle Brothers sends</th>').join('') + '</tr>');
  GB.companies.forEach(c => {
    h.push('<tr><th>' + c + '</th>' + STAGES.map(s => { const r = rows.filter(x => x.kind === k && x.company === c && x.stage === s)[0];
      if (!r) return '<td>-</td><td>-</td><td>-</td>';
      return '<td class="big">' + (r.line || '0') + '</td><td class="' + band(r.map_now_won) + '">' + (k === 'humans' ? r.map_now + ' <small>(you win ' + r.map_now_won + ')</small>' : '-') + '</td><td>' + r.bb_lo + ' to ' + r.bb_hi + '</td>'; }).join('') + '</tr>');
  });
  h.push('</table></div>');
});
h.push('<p>Green: the game sends a fight you win 75 or more in 100 (easier than the line). Amber: 60 to 74 (about right). Red: under 60 (harder than the line).</p>');
h.push('<p class="k">Every line, how it was found and what moved: records/BOHEMIA_TUNING_SLIGHTLY_HARDER_ON_THE_GRID_10_18_26.md. Our start\'s levers stay as you said YES to them; only the party size moves. draft:true; nothing in the game reads this page.</p>');
h.push('</body></html>');
fs.writeFileSync(path.join(ROOT, 'slices/BOHEMIA_TUNING_SLIGHTLY_HARDER_10_18_26.html'), h.join('\n') + '\n');
console.log(JSON.stringify(fit));
rows.forEach(r => console.log([r.kind, r.company, r.stage, 'line', r.line, 'map', r.map_now, r.map_now_won, 'bb', r.bb_lo + '-' + r.bb_hi].join(' ')));
