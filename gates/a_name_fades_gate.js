/* ==========================================================================
   A NAME FADES, AND A NEW COMPANY IS A STRANGER  (JOBS [a name fades], 11/20/26, VAMILY rules 461, 441)

   A NAME FADES: Battle Brothers' 'Daily Renown Decay -3' (bb_all/1679): every day the map's clock passes takes
   records/target/bb/job_clout.json fade CLOUT (3), never under 0, counted on his next step (slices/bohemia_job_kinds.js __A_NAME_FADES__,
   through BohemiaRenown.add); the big work a name opened waits again (records/target/bb/job_clout.json needs, 11/18). The board's line
   is now worked out each time it is asked (bohemia_board_shelf.js waits(name, tier, day)): a board held whole from what it posted for
   its window showed none before.
   A NEW COMPANY IS A STRANGER (found on the way, a bug he can feel): a new game forgot the old company's CLOUT but not the towns'
   opinion of it (bohemia.relations.v1: its prices and its board since 11/17), the clients it pushed away (bohemia.haggle.v1), its
   finished jobs still on their way to their towns (bohemia.job.settled.v1) or the fade's day; the start screen's forget list now
   carries all four.

     N1  the files: the fade and its quote, TUNING's row, the step's code, the shelf hands the number, the board's own line, the forget list
     N2  the fade itself, lifted out and run: nothing the first step, nothing twice a day, 15 after five days, never under 0, a new
         campaign or a clock behind it starts the count again
     N3  on his phone (tools/bohemia_jobs_a_name_fades_on_the_phone.js), the demo and the alpha, upright and sideways: 260 CLOUT, five
         days on the map's own clock, a step: 245, Caravans' board says MORE WORK HERE AT 250 CLOUT; on the demo the old company's four
         records and a save, NEW GAME tapped twice on the title: all four gone (the workshop, the alpha, has no title: it opens on VOTE)
     N4  nothing threw
   node gates/a_name_fades_gate.js        NAME_FILES=1 the files and the node leg only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nA NAME FADES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const JC = JSON.parse(T('records/target/bb/job_clout.json')), JK = T('slices/bohemia_job_kinds.js'), SH = T('slices/bohemia_board_shelf.js'), SS = T('slices/BOHEMIA_SETTLEMENT_SCREEN.html'), AL = T('slices/BOHEMIA_ALPHA_0_9.html');
const TABLE = T('records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md'), Y = TABLE.indexOf('## Y. ') >= 0 ? TABLE.slice(TABLE.indexOf('## Y. ')) : '';
const rowOf = id => { const m = Y.split('\n').filter(l => l.indexOf('| ' + id + ' |') === 0)[0]; return m ? m.split('|')[2].trim() : null; };
const FORGET = ['bohemia.relations.v1', 'bohemia.haggle.v1', 'bohemia.job.settled.v1', 'bohemia.clout.fade.v1'];

/* N1 */
{ const F = JC.fade || {}, wiki = (() => { try { return cp.execSync('tar -xzOf ' + path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz') + ' bb_all/1679_Renown.txt', { encoding: 'utf8', maxBuffer: 1 << 24 }); } catch (e) { return ''; } })();
  const fl = (AL.match(/\[[^\]]*'bohemia\.renown\.v1'[^\]]*\]/) || [''])[0];
  const n1 = [F.value === 3 && /bb_all\/1679/.test(F.source || '') && /Daily Renown Decay\|\|<span style="color:red">-3/.test(wiki),
    rowOf('job_clout.fade') === '3',
    /function fadeName\(\)/.test(JK) && /try \{ fadeName\(\); \} catch \(e\) \{\}/.test(JK) && /RN\.add\(-n, 'the name fades', null\)/.test(JK),
    /d\.clout_fade = \+c\.fade\.value/.test(SH) && /function waits\(name, tier, day\)/.test(SH) && /BohemiaBoardShelf\.waits\(S\.place\.name, S\.place\.tier, buildDay\(\)\)/.test(SS),
    FORGET.every(k => fl.indexOf("'" + k + "'") >= 0)];
  ok('N1 the files: 3 CLOUT a day (the wiki\'s Daily Renown Decay -3, read out of the tarball), TUNING\'s row, the step fades it, the shelf hands the number, the board works out its own line, and a new game forgets the towns\' bars, the pushed-away clients, the settled queue and the fade\'s day', n1.every(Boolean), n1.map(x => x ? 1 : 0).join('')); }

/* N2: the fade, lifted out and run */
{ const i = JK.indexOf("  var FADEKEY = 'bohemia.clout.fade.v1';"), j = JK.indexOf('  function step() {', i), src = JK.slice(i, j);
  const store = {}, R = { score: 100, log: [] }, D = { d: 1 };
  const W = { root: { localStorage: { getItem: k => store[k] == null ? null : store[k], setItem: (k, v) => { store[k] = String(v); } }, WORLD_SEED: 'A',
      BohemiaRenown: { add: (n) => { R.score = Math.max(0, R.score + n); R.log.push(n); return R.score; } }, BohemiaBoardShelf: { shelf: () => ({ clout_fade: 3 }) } } };
  W.day = () => D.d; vm.createContext(W); vm.runInContext(src + '\nthis.fadeName = fadeName;', W);
  const seq = [];
  seq.push(W.fadeName(), R.score);                 /* the first step: nothing, the count starts */
  seq.push(W.fadeName(), R.score);                 /* again the same day: nothing */
  D.d = 6; seq.push(W.fadeName(), R.score);        /* five days on: 15 */
  D.d = 6; seq.push(W.fadeName(), R.score);        /* the same day again: nothing */
  D.d = 40; seq.push(W.fadeName(), R.score);       /* 34 days: 102, never under 0 */
  W.root.WORLD_SEED = 'B'; D.d = 41; seq.push(W.fadeName(), R.score);   /* a new campaign: the count starts again */
  D.d = 2; seq.push(W.fadeName(), R.score);        /* a clock behind it (a new game on day 1 or 2): starts again */
  ok('N2 the fade, lifted out: nothing on the first step or twice a day, 15 after five days, 85 to 0 after 34 more (never under 0), a new campaign or a clock behind it starts the count again', JSON.stringify(seq) === JSON.stringify([0, 100, 0, 100, 15, 85, 0, 85, 102, 0, 0, 0, 0, 0]), JSON.stringify(seq)); }

if (process.env.NAME_FILES) done();

function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'nf_' + tag + '_' + process.pid);
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_a_name_fades_on_the_phone.js'), '--out', out, '--tag', tag].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 1500000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'name_fades_' + tag + '.json'), 'utf8'));
}
try {
  const runs = [walk([], 'gate_demo'), walk(['--alpha'], 'gate_alpha')], rows = [], errs = [];
  runs.forEach(r => r.walks.forEach(w => { rows.push(w); (w.errs || []).forEach(e => errs.push(e)); }));
  const bad = rows.filter(w => w.err || !w.fade || w.fade.c0 !== 260 || w.fade.c1before !== 260 || w.fade.day1 - w.fade.day0 !== 5 || w.fade.c1 !== 245 || w.fade.c1again !== 245 ||
    !/MORE WORK HERE AT 250 CLOUT/.test(w.fade.label || '') || !w.forget ||
    (w.alpha ? !w.forget.workshop : (!w.forget.saved || !FORGET.every(k => w.forget.before[k] && !w.forget.after[k]))));   /* the workshop has no title: NEW GAME is the demo's */
  ok('N3 on his phone, the demo and the alpha, upright and sideways: 260 CLOUT, five days on the map\'s clock and a step: 245, and Caravans\' board says MORE WORK HERE AT 250 CLOUT; the old company\'s four records over a save, NEW GAME tapped twice on the demo: all four gone (the alpha, the workshop, has no title: it opens on VOTE)',
    rows.length === 4 && !bad.length,
    rows.map(w => (w.alpha ? 'alpha ' : 'demo ') + (w.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (w.err ? 'ERR ' + w.err : 'day ' + w.fade.day0 + ' -> ' + w.fade.day1 + ', CLOUT ' + w.fade.c0 + ' -> ' + w.fade.c1 + ' [' + w.fade.label + ']' + (w.forget.workshop ? '; no title (the workshop)' : '; new game: ' + FORGET.filter(k => !w.forget.after[k]).length + '/4 gone'))).join(' | '));
  ok('N4 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
