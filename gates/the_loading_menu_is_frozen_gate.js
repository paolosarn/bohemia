/* THE LOADING MENU IS FROZEN  (UI 6, 11/3/26; rule 358, ask line 380)

   PAOLO 11/3: 'I'm in love with the loading menu, I can already see a lot of this being final final final... I don't say it
   lightly, good fucking job.' Rule 358: what was still owed (rules 348 and 357) is built; then it FREEZES: nobody redesigns the
   menu, the type, the four words or how the feeds roll. More feeds stay welcome (rule 342) at the same bar, composed for the same
   four words. Any other change waits for his word.

   WHAT IS HELD (a fingerprint of each, against records/target/ui_the_loading_menu_frozen.json):
     F1 THE FOUR WORDS: the line under his letters and the two choices, as startScreen writes them (slices/bohemia_ui_materials.js)
     F2 THE TYPE AND THE OVERLAY: every rule of the start screen's look in the feed's sheet (slices/bohemia_ui_crashbox.js, the block
        from 'RULE 357 (Paolo 11/3' to the NOTES line): the colours, the sizes, nothing behind the words, the per-feed places
     F3 HOW THE FEEDS ROLL: the roll's own numbers in slices/crashbox/crashbox.json (the random roll's key, the 40 s cut, the
        preload, the roll and the snow, the fade, the two shapes)
     F4 NO FEED TAKEN AWAY: every feed of the baseline is still in the roll, tall and wide, with its words placed (new feeds welcome)
   A CHANGE TO F1, F2 OR F3 FAILS unless a commit since the baseline that touched the file cites a new ruling with the words
   'NEW RULING' (his words, the rule number); whoever lands that ruling re-records the baseline with --freeze in the same commit.
   PLANTED (each must turn its leg red, every run): NEW GAME renamed, the cut moved to 30 s, a size in the look changed, a feed
   taken away.

   node gates/the_loading_menu_is_frozen_gate.js            (the check)
   node gates/the_loading_menu_is_frozen_gate.js --freeze   (re-record the baseline: only with a new ruling) */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const BASE = path.join(ROOT, 'records/target/ui_the_loading_menu_frozen.json');
const F = { mat: 'slices/bohemia_ui_materials.js', cbx: 'slices/bohemia_ui_crashbox.js', json: 'slices/crashbox/crashbox.json' };
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const H = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

function prints(src) {
  const mat = src.mat, cbx = src.cbx, J = JSON.parse(src.json).feed;
  const sub = (/sub\.textContent = opts\.sub \|\| '([^']*)'/.exec(mat) || [])[1] || '';
  const choices = (mat.match(/<b>(NEW GAME|CONTINUE)<\/b>/g) || []).join('|') + '|' + ((/n\.querySelector\('b'\)\.textContent = '([^']*)'; n\.querySelector\('i'\)\.textContent = '';/.exec(mat) || [])[1] || '');
  const a = cbx.indexOf('/* RULE 357 (Paolo 11/3'), b = cbx.indexOf("'html body #title .notes,html body #notebtn{display:none!important}'");
  const look = a >= 0 && b > a ? cbx.slice(a, b).split('\n').map(l => l.trim()).filter(l => /^'/.test(l)).join('\n') : '';
  const roll = JSON.stringify({ key: J.key, last_key: J.last_key, cycle_s: J.cycle_s, preload_s: J.preload_s, roll_holds: J.roll_holds, snow_holds: J.snow_holds, fade_holds: J.fade_holds, size: J.size });
  const feeds = Object.keys(J.options).filter(k => J.options[k].on !== false && J.options[k].tall && J.options[k].wide && J.options[k].words && J.options[k].words.tall && J.options[k].words.wide);
  return { words: { text: sub + '|' + choices, h: H(sub + '|' + choices) }, look: { lines: look.split('\n').length, h: H(look) }, roll: { text: roll, h: H(roll) }, feeds };
}
const now = () => prints({ mat: read(F.mat), cbx: read(F.cbx), json: read(F.json) });

if (process.argv.includes('--freeze')) {
  const p = now(); let sha = ''; try { sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch (e) {}
  fs.writeFileSync(BASE, JSON.stringify({ _readme: 'THE LOADING MENU, FROZEN (rule 358, Paolo 11/3: final final final). Re-record only with a NEW RULING: node gates/the_loading_menu_is_frozen_gate.js --freeze', frozen_at: sha, ruling: 'rule 358', prints: p }, null, 1) + '\n');
  console.log('frozen at ' + sha + ': words ' + p.words.h + ', look ' + p.look.h + ' (' + p.look.lines + ' rules), roll ' + p.roll.h + ', ' + p.feeds.length + ' feeds');
  process.exit(0);
}

function judge(cur, base, rulingOk) {
  const B = base.prints, out = {};
  out.words = cur.words.h === B.words.h || rulingOk;
  out.look = cur.look.h === B.look.h && cur.look.lines > 5 || rulingOk;
  out.roll = cur.roll.h === B.roll.h || rulingOk;
  out.feeds = B.feeds.every(k => cur.feeds.indexOf(k) >= 0);
  return out;
}
/* a commit since the baseline that touched a held file and cites a NEW RULING */
function ruled(base) {
  try {
    const log = execFileSync('git', ['log', '--format=%H%x09%s%x09%b%x1e', base.frozen_at + '..HEAD', '--', F.mat, F.cbx, F.json], { cwd: ROOT, encoding: 'utf8' });
    return log.split('\x1e').some(c => /NEW RULING/.test(c));
  } catch (e) { return false; }
}

console.log('THE LOADING MENU IS FROZEN  (rule 358)\n');
if (!fs.existsSync(BASE)) { ok('the baseline exists (records/target/ui_the_loading_menu_frozen.json)', false); console.log('\nTHE LOADING MENU IS FROZEN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
const base = JSON.parse(fs.readFileSync(BASE, 'utf8')), cur = now(), R = ruled(base), j = judge(cur, base, R);
ok('F1 THE FOUR WORDS are as frozen' + (R ? ' (or a NEW RULING moved them)' : ''), j.words, cur.words.text);
ok('F2 THE TYPE AND THE OVERLAY are as frozen (' + cur.look.lines + ' rules)', j.look, cur.look.h + ' vs ' + base.prints.look.h);
ok('F3 HOW THE FEEDS ROLL is as frozen', j.roll, cur.roll.text);
ok('F4 NO FEED TAKEN AWAY: every frozen feed still rolls, tall and wide, its words placed (' + cur.feeds.length + ' now, ' + base.prints.feeds.length + ' frozen)', j.feeds, base.prints.feeds.filter(k => cur.feeds.indexOf(k) < 0).join(' ') || 'all there');
/* PLANTED, on copies of the files in memory */
const src = { mat: read(F.mat), cbx: read(F.cbx), json: read(F.json) };
const P1 = prints(Object.assign({}, src, { mat: src.mat.replace('<b>NEW GAME</b>', '<b>START</b>') }));
ok('PLANTED: NEW GAME renamed is caught', !judge(P1, base, false).words);
const jj = JSON.parse(src.json); jj.feed.cycle_s = 30;
ok('PLANTED: the cut moved to 30 s is caught', !judge(prints(Object.assign({}, src, { json: JSON.stringify(jj) })), base, false).roll);
ok('PLANTED: a size in the look changed is caught', !judge(prints(Object.assign({}, src, { cbx: src.cbx.replace('font-size:20px!important;letter-spacing:4px!important', 'font-size:23.333px!important;letter-spacing:4px!important') })), base, false).look);
const jk = JSON.parse(src.json); delete jk.feed.options[base.prints.feeds[0]];
ok('PLANTED: a feed taken away is caught', !judge(prints(Object.assign({}, src, { json: JSON.stringify(jk) })), base, false).feeds);
console.log('\nTHE LOADING MENU IS FROZEN: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
