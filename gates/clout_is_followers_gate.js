/* ==========================================================================
   CLOUT IS FOLLOWERS  (JOBS 2, 11/22/26, VAMILY rules 470(b), 466(c), 441)

   PAOLO 11/22, on the card jobs-do-less-show-the-clout (YES): 'Put followers, this was an idea at the very beginning where it's kind
   of like your reputation... You can put followers type shit.' His 7/21 word (laws/BOHEMIA_ADDENDUM_CLOUT_RECKLESS_BEATS_QUIET_7_21_26.md:
   'FOLLOWERS is the visible reputation metric'; 'one number or two' left pending) is answered: ONE count, the company's name in the
   valley (engine/bohemia_renown.js, Battle Brothers' Renown), shown as its FOLLOWERS where he looks: the map's top bar and the FEED's own
   page, the company's profile. It goes up with every fight won (five a man) and every job done, falls with the days (3 a day) and a
   dropped or failed job; the numbers stay in the background (rule 466(c)): no '+N', no card that explains it.

     F1  the files: renown.json's word is FOLLOWERS citing 470(b); the engine's own first-frame copy says it too; the bar's chip, the
         board's line and the card read the count's word; the phone's profile reads the count (it asked a .get() that never existed);
         no player-facing 'CLOUT' left in the four files he reads it from; PLANTED: the old chip and the old profile line are caught
     F2  on his phone (tools/bohemia_jobs_the_towns_book_on_the_phone.js --build F), the demo and the alpha, upright and sideways, a new
         crew: the bar and the FEED's profile (opened with a finger) read the same count as FOLLOWERS, on the glass, at 0, at 245,
         after a fight won against three (+15, the bar flickers up), five days' fade (-15) and a dropped job (-100)
     F3  nothing threw
   node gates/clout_is_followers_gate.js        JOBS_FILES=1 the files only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nCLOUT IS FOLLOWERS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* what a player can read: a string literal that says CLOUT, comments stripped (the code's own names, CLOUT_WEIGHTS and the like, are
   not strings); returns the offending literals */
function cloutSaid(src) {
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"])\/\/[^\n]*/g, '$1');
  return (code.match(/'[^'\n]*\bCLOUT\b[^'\n]*'|"[^"\n]*\bCLOUT\b[^"\n]*"/g) || []).filter(s => !/CLOUT_|CT_DEED_CLOUT|__CLOUT/.test(s));
}
{
  const RJ = JSON.parse(T('records/target/bb/renown.json')), EN = T('engine/bohemia_renown.js'), UIM = T('slices/bohemia_ui_materials.js'), PH = T('slices/bohemia_phone.js');
  const SS = T('slices/BOHEMIA_SETTLEMENT_SCREEN.html'), JK = T('slices/bohemia_job_kinds.js');
  const settleJs = (SS.match(/<script[^>]*>[\s\S]*?<\/script>/g) || []).join('\n');
  const said = { ui: cloutSaid(UIM), phone: cloutSaid(PH), settlement: cloutSaid(settleJs), jobs: cloutSaid(JK) };
  const f1 = [RJ.word && RJ.word.value === 'FOLLOWERS' && /470\(b\)/.test(RJ.word.why || '') && /Put followers/.test(RJ.word.why || ''),
    /word: 'FOLLOWERS',/.test(EN) && /__CLOUT_IS_FOLLOWERS__/.test(EN),
    /fn = RN\.score\(\), fw = RN\.WORD \|\| 'FOLLOWERS'/.test(UIM) && /hudEsc\(fw\) \+ '<\/i><b>' \+ fn \+ '<\/b>/.test(UIM) && /#bmtb \.s\.clout\.up b,#bmtb \.s\.clout\.down b\{animation:bmFolFlick/.test(UIM) && /@media \(max-width:480px\)\{#bmtb \.g:has\(\.s\.clout\.fol\)\{gap:7px\}\}/.test(UIM),
    /o\.clout = BohemiaRenown\.score\(\); o\.word = BohemiaRenown\.WORD \|\| 'FOLLOWERS';/.test(PH) && !/BohemiaRenown\.get\b/.test(PH) && /'<span class="fol" data-n="' \+ esc\(co\.clout\) \+ '"><b>' \+ esc\(co\.clout\) \+ '<\/b> ' \+ esc\(co\.word \|\| 'FOLLOWERS'\)/.test(PH) && /cw\.BohemiaRenown\.score\(\)/.test(PH),
    /'MORE WORK HERE AT ' \+ WN\.need \+ ' ' \+ \(\(window\.BohemiaRenown && BohemiaRenown\.WORD\) \|\| 'FOLLOWERS'\)/.test(SS) && /CW = \(root\.BohemiaRenown && BohemiaRenown\.WORD\) \|\| 'FOLLOWERS';/.test(JK),
    Object.keys(said).every(k => !said[k].length)];
  ok('F1 the files: the count\'s word is FOLLOWERS (his 470(b), in the file a modder edits and the engine\'s first frame); the bar, the board\'s line and the card read it; the FEED\'s profile reads the count; no player-facing CLOUT left',
    f1.every(Boolean), f1.map(b => b ? 1 : 0).join('') + ' ' + JSON.stringify(said));
  /* PLANTED: the old chip and the old profile line, each must be caught */
  const oldChip = "g += '<span class=\"s clout\" data-f=\"clout\"><i>' + hudEsc(RN.WORD || 'CLOUT') + '</i><b>' + RN.score() + '</b></span>';";
  const oldProf = "(co.clout != null ? ' &middot; CLOUT ' + esc(co.clout) : '')";
  ok('F1p planted: the old chip\'s CLOUT and the old profile\'s CLOUT are caught by the same reader', cloutSaid(oldChip).length > 0 && cloutSaid(oldProf).length > 0 && !cloutSaid('/* CLOUT */ var x = CT_DEED_CLOUT;').length,
    JSON.stringify([cloutSaid(oldChip), cloutSaid(oldProf)]));
}
if (process.env.JOBS_FILES) done();

function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'fol_' + tag + '_' + process.pid);
  fs.mkdirSync(out, { recursive: true });
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_the_towns_book_on_the_phone.js'), '--out', path.relative(ROOT, out), '--tag', tag, '--build', 'F'].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 3600000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'towns_book_' + tag + '.json'), 'utf8'));
}
try {
  const runs = [walk([], 'gate_demo'), walk(['--alpha'], 'gate_alpha')];
  const rows = [].concat(...runs.map(R => [].concat(...R.walks.map(w => (w.rows || []).map(r => Object.assign({ shape: w.shape, alpha: R.alpha }, r)))))).filter(r => r.build === 'F');
  const errs = [].concat(...runs.map(R => [].concat(...R.walks.map(w => w.errs || []))));
  ok('F2 on his phone, the demo and the alpha, upright and sideways, a new crew: the bar and the FEED\'s profile read the one count as FOLLOWERS on the glass; a fight won against three +15 (the bar flickers up), five days -15, a dropped job -100',
    rows.length === 4 && rows.every(r => !r.err && r.ok),
    rows.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : (r.seen || []).map(o => o.score + '/' + (o.bar ? o.bar.n : '-') + '/' + (o.prof ? o.prof.n : '-')).join(' ') + ' fight +' + r.fightGain + (r.flickUp ? ' flick' : ' NO FLICK') + ' fade -' + r.fade + ' drop -' + r.drop + (r.ok ? '' : ' NOT OK'))).join(' | '));
  ok('F3 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
