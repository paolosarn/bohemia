#!/usr/bin/env node
/* JOBS 2 11/27 -- THE KINDS HE MEETS (VAMILY rule 494(a), Paolo 11/27: 'in Battle Brothers there's so many different quest types...
   I haven't seen one caravan quest... go from one city to another').
   A RUN LIKE HIS, ON THE REAL BOARDS: the real board code (slices/bohemia_board_shelf.js, run as the page runs it), the real shelf and
   the job kinds' people (records/target/BOHEMIA_BOARD_SHELF.json + BOHEMIA_JOB_KINDS.json board_people, the way withMore() adds them),
   the valley's real places for campaign K7QM9X with each day's news (sick, market day, raided: dumped from the demo,
   records/BOHEMIA_JOBS_TWO_THE_VALLEY_PLACES_K7QM9X_11_27_26.json), the real rare roll and the real day's floor (rampFloor, rampReds,
   rareUp, sliced out of slices/bohemia_job_danger.js, never a copy), and the company's name growing the way BohemiaRenown counts it
   (records/target/bb/renown.json: a job done 100, five a man beaten).
   THE STAND-IN, SAID ON ITS FACE: the read of a job is the fight's own AUTO measured by tools/bohemia_world_most_jobs_fit.js for a
   company like his on that day, by the job's skulls (weak day 1, early day 20, middling day 50, his five killers at day 90; straight
   lines between). The real reader plays each job's own enemies; this tool asks only which KINDS the boards post, and the floor
   sees the skulls the same way.
   HIS RUN: he does one job every two days, the best-paying one he would win (green), the way a Battle Brothers player picks.
   Usage: node tools/bohemia_jobs_the_kinds_he_meets.js [--days 45] [--counts camp:2,town:3,fortress:4] [--no-kinds] [--json out.json] [--quiet]
*/
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] != null ? process.argv[i + 1] : d; };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const DAYS = +arg('--days', 45), QUIET = process.argv.indexOf('--quiet') > 0;
const SHELF_SRC = fs.readFileSync(path.resolve(ROOT, process.env.SHELF_SRC || 'slices/bohemia_board_shelf.js'), 'utf8');
const DANGER = fs.readFileSync(path.join(ROOT, 'slices/bohemia_job_danger.js'), 'utf8');
const SH = J('records/target/BOHEMIA_BOARD_SHELF.json'), K = J('records/target/BOHEMIA_JOB_KINDS.json');
const PLACES = J(process.env.KINDS_PLACES || 'records/BOHEMIA_JOBS_TWO_THE_VALLEY_PLACES_K7QM9X_11_27_26.json');
const RENOWN = (J('records/target/bb/renown.json').gains || {}).value || { civilian_contract_done: 100, fight_won_per_enemy: 5 };
const CLOUT = J('records/target/bb/job_clout.json');
const BUILT9 = ['haul-caravan', 'find-place', 'find-person', 'hunt-kind', 'clear-camp', 'carry', 'hold-defend', 'recover-return', 'patrol'];
const SAY = { 'haul-caravan': 'escort a caravan', 'find-place': 'find a place', 'find-person': 'find a person', 'hunt-kind': 'hunt a kind', 'clear-camp': 'clear a camp', carry: 'carry', 'hold-defend': 'hold and defend', 'recover-return': 'recover and return', patrol: 'patrol' };

/* the shelf as the page holds it (withMore) */
const doc = JSON.parse(JSON.stringify(SH)), have = {};
doc.offers.forEach(o => { have[o.id] = 1; });
((K.board_people && K.board_people.rows) || []).forEach(o => { if (o && o.id && !have[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); });
if (CLOUT.needs && CLOUT.needs.value) doc.clout_needs = CLOUT.needs.value;
if (arg('--counts', '')) arg('--counts', '').split(',').forEach(kv => { const [k, v] = kv.split(':'); doc.counts[k] = +v; });   /* --counts camp:2,town:3 measures another board size */
const byId = {}; doc.offers.forEach(o => { byId[o.id] = o; });

/* which kind (slices/bohemia_job_kinds.js kindOf, on the same data) */
function kindOf(o) { const row = K.offers && K.offers[o.id]; if (row && row.kind) return row.kind; if (o.kind && K.kinds && K.kinds[o.kind]) return o.kind;
  const t = String(o.title || '').toLowerCase(); for (const g of (K.guess || [])) { try { if (new RegExp(g.re, 'i').test(t)) return g.kind; } catch (e) {} } return K.default || 'clear-crew'; }

/* the real floor and rare roll, sliced from the danger reader */
const DCFG = (() => { const m = /var CFG = (\{[^;]*\});/.exec(DANGER); return Function('return ' + m[1])(); })();
try { const jd = J('records/target/bb/job_danger.json'); Object.keys(jd).forEach(k => { if (jd[k] && typeof jd[k] === 'object' && 'value' in jd[k] && k in DCFG) DCFG[k] = jd[k].value; }); } catch (e) {}
const D = {}; { const a = DANGER.indexOf('  function rampFloor('), b = DANGER.indexOf('  function fits('), s0 = DANGER.indexOf('  function seedOf(');
  const ctx = { CFG: DCFG, Math }; vm.createContext(ctx); vm.runInContext(DANGER.slice(s0, DANGER.indexOf('\n', s0)) + '\n' + DANGER.slice(a, b) + '\nthis.rampFloor = rampFloor; this.rampReds = rampReds; this.rareUp = rareUp;', ctx);
  D.rampFloor = ctx.rampFloor; D.rampReds = ctx.rampReds; D.rareUp = ctx.rareUp; }

/* a company like his, by day: won in 100 for one, two, three skulls (tools/bohemia_world_most_jobs_fit.js --math bb --kit 1, n 24) */
const RUN = [[1, [96, 79, 79]], [20, [96, 63, 42]], [50, [96, 75, 29]], [90, [96, 50, 21]]];
function cleanOf(o, day) { const s = Math.max(1, Math.min(3, (o.skulls | 0) || 1)) - 1; let a = RUN[0], b = RUN[RUN.length - 1];
  for (let i = 0; i < RUN.length - 1; i++) if (day >= RUN[i][0] && day <= RUN[i + 1][0]) { a = RUN[i]; b = RUN[i + 1]; break; }
  const t = b[0] === a[0] ? 0 : Math.max(0, Math.min(1, (day - a[0]) / (b[0] - a[0]))); return (a[1][s] + (b[1][s] - a[1][s]) * t) / 100; }
const fitsOf = day => ({
  fits: (o, place, d, have, size) => { if (o && !D.rareUp(o, place, d)) return false; const c = cleanOf(o, d); if (c < D.rampFloor(d)) return false; if (c >= DCFG.cut_one) return true;
    const reds = (have || []).filter(h => cleanOf(h, d) < DCFG.cut_one).length; return reds < D.rampReds(d, size); },
  peek: (o) => ({ state: 'read', clean: cleanOf(o, day) }), fitVer: () => 'd' + day, rare: (o, p, d) => D.rareUp(o, p, d), cfg: () => DCFG });

/* the board code, as the page runs it, one campaign's storage kept across the days */
const store = {}, renown = { score: 0 };
const ctx = { console, Math, JSON, Date, Object, Array, String, Number, isNaN, parseInt, parseFloat, RegExp, setTimeout: () => 0, clearTimeout() {},
  localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
  WORLD_SEED: PLACES.seed || 'K7QM9X', BohemiaRenown: { score: () => renown.score } };
/* the job kinds' own reader of a job's kind, as the map hands it (BohemiaJobKinds.kindOf, built: the nine and every kind played by its legs);
   --no-kinds measures the boards without it (the deal before __EVERY_KIND_HE_MEETS__) */
if (process.argv.indexOf('--no-kinds') < 0) ctx.BohemiaJobKinds = { kindOf, data: () => K, built: k => !!(K.kinds && K.kinds[k]) && (BUILT9.indexOf(k) >= 0 || (Array.isArray(K.kinds[k].legs) && K.kinds[k].legs.length > 0)) };
ctx.window = ctx; ctx.parent = ctx; vm.createContext(ctx); vm.runInContext(SHELF_SRC, ctx); ctx.BohemiaBoardShelf.set(doc);

const done = [], log = [], firstDay = {}, perDay = [];
let jobsDone = 0;
for (let day = 1; day <= DAYS; day++) {
  const places = PLACES.days[String(Math.min(day, Object.keys(PLACES.days).length))];
  ctx.BohemiaJobDanger = fitsOf(day);
  const opt = { places, held: [], done: done.slice() };
  const boards = {}; places.forEach(p => { boards[p.name] = (ctx.BohemiaBoardShelf.pick(p, day, opt) || []).map(o => o.id); });
  const kinds = {}, mix = [], offered = [];
  places.forEach(p => { const ks = boards[p.name].map(id => kindOf(byId[id])); ks.forEach(k => { kinds[k] = (kinds[k] || 0) + 1; if (firstDay[k] == null) firstDay[k] = day; });
    mix.push({ place: p.name, tier: p.tier, n: ks.length, kinds: [...new Set(ks)].length, ks, ids: boards[p.name].slice() }); boards[p.name].forEach(id => offered.push({ id, place: p.name })); });
  perDay.push({ day, clout: renown.score, total: offered.length, kinds, mix, sweat: ctx.__SWEAT_JOB || null });
  ctx.__SWEAT_JOB = null;
  if (day % 2 === 0) {   /* his run: one job done every two days, the best paying he would win */
    const pick = offered.map(x => Object.assign({ o: byId[x.id] }, x)).filter(x => cleanOf(x.o, day) >= DCFG.cut_one).sort((a, b) => (+b.o.pay || 0) - (+a.o.pay || 0) || (a.id < b.id ? -1 : 1))[0]
      || offered.map(x => Object.assign({ o: byId[x.id] }, x)).sort((a, b) => cleanOf(b.o, day) - cleanOf(a.o, day))[0];
    if (pick) { done.push(pick.id); jobsDone++; renown.score += (RENOWN.civilian_contract_done || 100) + (RENOWN.fight_won_per_enemy || 5) * 6; log.push({ day, id: pick.id, kind: kindOf(pick.o), place: pick.place }); }
  }
}
/* the measures */
const win = d => Math.floor(d / 3);
const sum = (days) => { const k = {}; perDay.filter(r => r.day <= days).forEach(r => Object.keys(r.kinds).forEach(x => { k[x] = (k[x] || 0) + r.kinds[x]; })); return k; };
const perWindow = []; perDay.forEach(r => { const w = win(r.day); if (!perWindow[w]) perWindow[w] = { from: r.day, to: r.day, kinds: {}, total: 0, built: {} }; const W = perWindow[w]; W.to = r.day;
  if (r.day === W.from) { W.total = r.total; W.kinds = r.kinds; } });
const boardsTwoPlus = perDay.flatMap(r => r.mix.filter(m => m.n >= 2).map(m => Object.assign({ day: r.day }, m)));
const oneKind = boardsTwoPlus.filter(m => m.kinds < 2);
const out = { days: DAYS, seed: PLACES.seed, firstDay, built9: BUILT9.map(k => ({ kind: k, say: SAY[k], first: firstDay[k] == null ? null : firstDay[k] })),
  offers_by_kind_first_15: sum(15), distinct_first_15: (() => { const k = {}, seen = {}; perDay.filter(r => r.day <= 15).forEach(r => r.mix.forEach(m => m.ids.forEach((id, i) => { if (seen[id + '@' + m.place]) return; seen[id + '@' + m.place] = 1; k[m.ks[i]] = (k[m.ks[i]] || 0) + 1; }))); return k; })(), offers_by_kind_all: sum(DAYS), boards_two_plus: boardsTwoPlus.length, boards_one_kind: oneKind.length,
  one_kind_examples: oneKind.slice(0, 6).map(m => m.day + ' ' + m.place + ' ' + m.ks.join('+')), per_town: perDay.map(r => ({ day: r.day, total: r.total, places: r.mix.length })),
  per_day_ids: perDay.map(r => ({ day: r.day, ids: [].concat.apply([], r.mix.map(m => m.ids)) })), per_day_mix: perDay.filter(r => r.day <= 15).map(r => ({ day: r.day, mix: r.mix.map(m => ({ place: m.place, tier: m.tier, n: m.n, ks: m.ks })) })),
  done: log, clout_end: renown.score, perWindow: perWindow.filter(Boolean).map(W => ({ days: W.from + '-' + W.to, total: W.total, kinds: Object.keys(W.kinds).length })) };
if (!QUIET) {
  console.log('THE KINDS HE MEETS: campaign ' + (out.seed || 'K7QM9X') + ', days 1 to ' + DAYS + ', ' + PLACES.days['1'].length + ' places, his run does a job every two days (clout ' + out.clout_end + ' at the end)');
  console.log('\nthe nine built kinds, the first day a board offered each:');
  out.built9.forEach(b => console.log('  ' + (b.say + ' ').padEnd(22, '.') + ' ' + (b.first == null ? 'NEVER' : 'day ' + b.first) + '   ' + (out.distinct_first_15[b.kind] || 0) + ' jobs of it posted in days 1-15'));
  console.log('\noffers on the valley\'s boards each window (a window is ' + (SH.refresh_days || 3) + ' days): ' + out.perWindow.map(w => w.days + ': ' + w.total + ' jobs, ' + w.kinds + ' kinds').join(' | '));
  console.log('\nboards with two or more jobs: ' + out.boards_two_plus + ' board-days; all one kind: ' + out.boards_one_kind + (oneKind.length ? '  e.g. ' + out.one_kind_examples.join('; ') : ''));
  console.log('\nhis run: ' + log.map(l => 'd' + l.day + ' ' + l.kind).join(', '));
}
if (arg('--json', '')) fs.writeFileSync(arg('--json', ''), JSON.stringify(out, null, 1));
module.exports = out;
if (process.env.DD) [1, 2, 3, 6].forEach(d => { const dd = ctx.__DD && ctx.__DD[d]; if (!dd) return; console.log('DAY', d); Object.keys(dd.own).forEach(n => console.log('  ', n, dd.want[n], dd.own[n].map(id => kindOf(byId[id]) + (byId[id].skulls > 1 ? byId[id].skulls : '')).join(' '))); });
