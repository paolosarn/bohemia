#!/usr/bin/env node
// TUNING [slightly harder, measured] ON THE GRID 10/18 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 117(e)).
// His YES on 'easier, measured' with 'make it just slightly harder than that' (about 70 in 100, the player still mostly
// winning), and rule 117(e): set it across the grid, never on one average. Battle Brothers' own dial for how hard a fight is
// is HOW MANY come (the difficulty page, records/BOHEMIA_TUNING_THE_DIFFICULTY_STEPS_EXACTLY_10_9_26.md: its difficulty is
// felt in group count, arrival and money), so this finds, for every company size and gear stage, THE 70 LINE: how many of
// them you beat 70 times in 100 at the rule 117 start (his YES), and sets it beside what our map sends and what Battle
// Brothers' map sends. The fight's own rules, played by tools/bohemia_tuning_the_whole_grid.js --cell.
//
//   node tools/bohemia_tuning_slightly_harder_grid.js           bisects every (kind, company, stage) from the grid's bracket
//   --n 100 fights a step; --jobs 4; --kinds humans,direwolf
// Every step is cached in banks/BOHEMIA_TUNING_SLIGHTLY_HARDER_GRID_10_18_26.json, so a run that dies resumes.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const BENCH = path.join(ROOT, 'tools/bohemia_tuning_the_whole_grid.js');
const GRID = require(BENCH);
const GB = JSON.parse(fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_TUNING_THE_WHOLE_GRID_10_18_26.json'), 'utf8'));
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_SLIGHTLY_HARDER_GRID_10_18_26.json');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('--n', 100)), JOBS = Number(arg('--jobs', 4)), KINDS = arg('--kinds', 'humans,direwolf').split(',');
const TARGET = 70, SETTING = 'start';
let bank = fs.existsSync(BANK) ? JSON.parse(fs.readFileSync(BANK, 'utf8')) : { steps: {} };
/* the steps are kept only for the fight they were played on (the grid's fingerprint) */
const FP = GRID.fightPrint();
if (bank.fp !== FP) bank = { steps: {}, fp: FP };
/* a step with 30 or more men on the board plays half (the grid's own rule, GRID.fightsFor), so the big companies' lines finish */
const nFor = (c, e) => GRID.fightsFor({ kind: 'humans', company: c, enemies: e }, N);
const skey = (k, c, s, e) => [k, c, s, e, SETTING, nFor(c, e)].join('|');
function save() {
  bank._readme = 'TUNING [slightly harder, measured] on the grid 10/18 (rule 117(e); rule 38g research only). draft:true. DRAFT: THE GEAR IS NOT IN. '
    + 'NOTHING IN THE GAME READS THIS FILE. steps: kind|company|stage|enemies|setting|fights -> won in 100 and the felt numbers, each the live fight played '
    + 'headless by tools/bohemia_tuning_the_whole_grid.js --cell; lines: the 70 line per (kind, company, stage). Written by tools/bohemia_tuning_slightly_harder_grid.js.';
  bank.draft = true; bank.schema = 1; bank.target_won_in_100 = TARGET; bank.setting = SETTING; bank.fights_per_step = N; bank.fights_rule = 'half for a step of 30 or more men on the board';
  fs.writeFileSync(BANK, JSON.stringify(bank, null, 1) + '\n');
}
const sfile = path.join(os.tmpdir(), 'bohemia_harder_strikes_' + process.pid + '.json');
fs.writeFileSync(sfile, JSON.stringify(GB.strikes));
function play(k, c, s, e) {
  const K = skey(k, c, s, e);
  if (bank.steps[K]) return Promise.resolve(bank.steps[K]);
  return new Promise((ok, no) => cp.execFile(process.execPath, [BENCH, '--cell', JSON.stringify({ kind: k, company: c, enemies: e, stage: s, setting: SETTING }), String(nFor(c, e)), sfile],
    { maxBuffer: 1 << 24 }, (err, out) => { if (err) return no(err); bank.steps[K] = GRID.felt(JSON.parse(out)); save(); ok(bank.steps[K]); }));
}
/* the grid's own cells give the first bracket: the largest measured count still at 70 or more, the smallest under it */
function bracket(k, c, s) {
  const won = e => { const x = GB.cells[[k, c, e, s, SETTING].join('|')]; return x ? x.won_in_100 : null; };
  let lo = 1, hi = null;
  GB.counts.filter(e => e !== 'map').forEach(e => { const w = won(e); if (w === null) return; if (w >= TARGET) lo = Math.max(lo, e); else if (hi === null || e < hi) hi = e; });
  return { lo: lo, hi: hi === null ? 60 : hi };
}
/* bisect: lo wins 70+, hi wins under 70; stop when they touch. lo = 1 is checked (a lone man against one) */
async function line(k, c, s) {
  let { lo, hi } = bracket(k, c, s);
  if (lo === 1) { const one = await play(k, c, s, 1); if (one.won_in_100 < TARGET) return { kind: k, company: c, stage: s, line: 0, note: 'one of them already beats you more than 3 times in 10', at1: one.won_in_100 }; }
  while (hi - lo > 1) { const m = Math.floor((lo + hi) / 2); const r = await play(k, c, s, m); if (r.won_in_100 >= TARGET) lo = m; else hi = m; }
  return { kind: k, company: c, stage: s, line: lo, won_at_line: (await play(k, c, s, lo)).won_in_100, won_one_more: hi <= 60 ? (await play(k, c, s, hi)).won_in_100 : null };
}
(async () => {
  const todo = [];
  KINDS.forEach(k => GB.companies.forEach(c => ['early', 'middle', 'late'].forEach(s => todo.push([k, c, s]))));
  bank.lines = bank.lines || {};
  let next = 0; const t0 = Date.now();
  async function worker() { while (next < todo.length) { const [k, c, s] = todo[next++]; const L = await line(k, c, s); bank.lines[[k, c, s].join('|')] = L; save();
    process.stderr.write(k + ' ' + c + ' ' + s + ': the 70 line ' + L.line + ' (' + Math.round((Date.now() - t0) / 1000) + 's)\n'); } }
  await Promise.all(Array.from({ length: JOBS }, worker));
  fs.unlinkSync(sfile);
  console.log('kind'.padEnd(10) + 'company'.padStart(8) + ['early', 'middle', 'late'].map(s => s.padStart(10)).join(''));
  KINDS.forEach(k => GB.companies.forEach(c => console.log(k.padEnd(10) + String(c).padStart(8) + ['early', 'middle', 'late'].map(s => String(bank.lines[[k, c, s].join('|')].line).padStart(10)).join(''))));
})().catch(e => { console.error(e); process.exit(1); });
