/* ==========================================================================
   A JOB HAS ONE DOOR  (JOBS 2, 11/26/26, ask row 698, rules 425, 441, 335)

   FOUND BY PLUMBER 8 (EVERY CHANGE AT SIXTY C2): 'THE BOARD DEALS A JOB TO A DIFFERENT TOWN DEPENDING ON WHEN ITS DANGER READ COMES
   IN': one valley, one day, the same jobs; the new way (reads over 90 s) put qd-s04 at Caravans, the old way (every read at once) at
   the Mob. The ask: the place a job is dealt to depends on the valley and the day only, never on how fast a phone read its danger.
   NOW (slices/bohemia_board_shelf.js __A_JOB_HAS_ONE_DOOR__): THE DRAFT (the valley and the day, never a read) gives every place its
   own list and is all MEMO keeps; THE POSTING, from the reads as they stand: each place its own that the floor lets through, then a
   place left short takes work no place posts (rule 255), then never empty (rule 335). Nothing read while reading is remembered.

   The deal itself, run in Node on the real shelf (records/target/BOHEMIA_BOARD_SHELF.json and the job file's board people), a valley
   of twelve places (camps, towns, fortresses, one raided), day 4 (the floor at its highest), the danger reader played by a stand-in
   whose read of a job at a place is fixed (its clean number from the job and the place) and comes in when it is told to:
     O1  the boards asked again and again while the reads come in, in three different orders (one at a time, shuffled two ways, and
         every read at once): once every read is in, every place's board is the same job for job, whichever order they came in
     O2  no job stands at two doors (a place whose own list is all gone may show one job another place shows, rule 335's last pass)
     O3  no board is empty (rule 335), and no job the floor keeps back is posted unless it is its place's only one
     O1p PLANTED: main's deal before this build (c373aa657: the draft asks the floor, MEMO keeps what reading posted) fails O1
   (the deal's other laws, the floor and never empty, are THE BOARDS ALWAYS HAVE WORK's W1 to W6)
   node gates/a_job_has_one_door_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 600) + ']' : '')); };
const SHELFJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_BOARD_SHELF.json'), 'utf8'));
const KINDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_JOB_KINDS.json'), 'utf8'));
const PLACES = [['Caravans', 'town'], ['The Mob', 'fortress'], ['The Network', 'town'], ['Church', 'camp'], ['Trades', 'town'], ['Anarchists', 'camp'],
  ['The Co-op', 'camp'], ['Primm', 'town'], ['Boulder', 'fortress'], ['The Dry Camp', 'camp'], ['Remnants', 'camp', ['raided']], ['Henderson', 'town']]
  .map(([name, tier, traits]) => ({ name, tier, traits: traits || [] }));
const DAY = 4;
function seed(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* one session of the deal: a fresh page (its own storage), the reads coming in the order given */
function session(src, order) {
  const store = {}, READ = {};   /* (job|place) -> read in */
  let ver = 0;
  const clean = (o, place) => (seed(o.id + '@' + place) % 1000) / 1000;
  const W = { MAIN: true,
    fits(o, place, day, have, size) { if (!o || !o.id) return true; const k = o.id + '|' + place; if (!READ[k]) { W.asked[k] = 1; return null; } return clean(o, place) >= 0.35; },
    peek(o, place) { const k = o.id + '|' + place; return READ[k] ? { state: 'read', clean: clean(o, place) } : { state: 'reading' }; },
    fitVer() { return 'v' + ver; }, rare() { return true }, asked: {} };
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, isNaN, parseInt, parseFloat, setTimeout: () => 0, clearTimeout() {},
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    BohemiaJobDanger: W, WORLD_SEED: 'K7QM9X', fetch: () => Promise.reject(new Error('no fetch')) };
  ctx.window = ctx; ctx.parent = ctx; ctx.top = ctx;
  vm.createContext(ctx); vm.runInContext(src, ctx);
  const S = ctx.BohemiaBoardShelf, doc = JSON.parse(JSON.stringify(SHELFJ)), have = {};
  doc.offers.forEach(o => { have[o.id] = 1; });
  ((KINDS.board_people && KINDS.board_people.rows) || []).forEach(o => { if (o && o.id && !have[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); });
  S.set(doc);
  const ask = () => { const m = {}; PLACES.forEach(p => { m[p.name] = (S.pick(p, DAY, { places: PLACES, held: [], done: [] }) || []).map(o => o.id); }); return m; };
  ask();   /* the phone and the boards ask before any read is in */
  const want = Object.keys(W.asked);
  /* the reads every board could ask: every job at every place (the order decides when each lands) */
  const all = []; doc.offers.forEach(o => PLACES.forEach(p => all.push(o.id + '|' + p.name)));
  const seq = order === 'once' ? [all] : (order === 'one' ? all.map(k => [k]) : (() => { const a = all.slice(); let x = seed(order) || 1; for (let i = a.length - 1; i > 0; i--) { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; const j = (x >>> 0) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } const out = []; for (let i = 0; i < a.length; i += 7) out.push(a.slice(i, i + 7)); return out; })());
  seq.forEach(batch => { batch.forEach(k => { READ[k] = 1; }); ver++; ask(); });
  return { final: ask(), clean, READ, asked: want.length };
}
const NOW = fs.readFileSync(process.env.SHELF_SRC || path.join(ROOT, 'slices/bohemia_board_shelf.js'), 'utf8');
function check(src) {
  const runs = ['one', 'shuffle-a', 'shuffle-b', 'once'].map(o => ({ o, r: session(src, o) }));
  const sig = m => PLACES.map(p => p.name + ':' + m[p.name].join(',')).join(' ; ');
  const base = sig(runs[0].r.final), diff = runs.filter(x => sig(x.r.final) !== base).map(x => x.o);
  const where = {}; runs[0].r.final && PLACES.forEach(p => runs[0].r.final[p.name].forEach(id => { (where[id] = where[id] || []).push(p.name); }));
  return { runs, diff, where, base };
}
const A = check(NOW);
const firstDiff = (X) => { if (!X.diff.length) return ''; const o = X.runs.find(x => x.o === X.diff[0]).r.final, b = X.runs[0].r.final; const p = PLACES.find(p => b[p.name].join() !== o[p.name].join()); return p ? p.name + ': ' + b[p.name].join(',') + ' (one at a time) vs ' + o[p.name].join(',') + ' (' + X.diff[0] + ')' : ''; };
ok('O1 the boards asked again and again while the reads come in, four ways (one at a time, shuffled twice, all at once): once every read is in, every place\'s board is the same',
  !A.diff.length, A.diff.length ? 'differs: ' + A.diff.join(', ') + '; ' + firstDiff(A) : PLACES.length + ' places, ' + Object.keys(A.where).length + ' jobs posted, the same four ways');
const twice = Object.keys(A.where).filter(id => A.where[id].length > 1);
const r0 = A.runs[0].r, f0 = r0.final, own = {};
/* a dup is allowed only for a place whose own list is all gone (one job) */
const dupBad = twice.filter(id => A.where[id].filter(n => f0[n].length > 1).length > 1);
ok('O2 no job stands at two doors (a place left with nothing may show one another place shows, rule 335)', !dupBad.length, dupBad.length ? dupBad.slice(0, 4).map(id => id + ' at ' + A.where[id].join(' and ')).join(' | ') : twice.length + ' shown twice by an empty place\'s last pass');
const empty = PLACES.filter(p => !f0[p.name].length).map(p => p.name);
const floored = []; PLACES.forEach(p => { if (f0[p.name].length > 1) f0[p.name].forEach(id => { if (r0.clean({ id }, p.name) < 0.35) floored.push(id + ' at ' + p.name); }); });
ok('O3 no board is empty, and no job the floor keeps back is posted beside another', !empty.length && !floored.length, (empty.length ? 'empty: ' + empty.join(', ') + ' ' : '') + floored.slice(0, 4).join(' | '));
let OLD = null; try { OLD = cp.execSync('git show c373aa657:slices/bohemia_board_shelf.js', { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 24 }); } catch (e) { OLD = null; }
if (OLD) { const B = check(OLD); ok('O1p planted: the deal before this build (the draft asks the floor) fails O1', B.diff.length > 0, B.diff.length ? 'differs: ' + B.diff.join(', ') + '; ' + firstDiff(B) : 'BLIND: the old deal was the same four ways'); }
else ok('O1p planted: the deal before this build', false, 'git show failed');
console.log('\nA JOB HAS ONE DOOR: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
