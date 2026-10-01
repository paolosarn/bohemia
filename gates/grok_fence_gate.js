/* ============================================================================
   GROK FENCE -- A GROK COMMIT ON MAIN STAYS IN ITS FOLDER
   (PLUMBER 10/1/26, row [grok fence], rule 49d)

   Paolo connected Grok's own GitHub connector to this repo (rule 49d). Grok is told
   (reference/BOHEMIA_GROK_PASTE.md) to write only in reference/library/grok/, only on
   the branch named grok, with every commit message starting "GROK:". The coordinator
   brings that folder onto main every VAMILY. Grok is a research helper, never a writer
   of law (rule 49b): a Grok commit that touched VAMILY.md, laws/ or a slice would be an
   outside writer editing the rules.

   HOW A GROK COMMIT IS KNOWN, MEASURED 10/1 BEFORE WRITING THIS: the three commits on the
   grok branch are authored and committed under Paolo's own GitHub account, because the
   connector pushes as him. So "author says Grok" finds NOTHING. The one mark that is
   Grok's is the message: it starts with "GROK:". A coordinator commit that merely
   MENTIONS Grok ("PAOLO 10/1: Grok writes into the repo...") is the coordinator, not
   Grok, and is not fenced. An author or committer whose name or email says grok is
   fenced too, in case the connector ever signs as itself.

   LEGS
     S1-S4  SELF-TEST on a planted repository: a GROK: commit inside the folder passes; a
            GROK: commit that touches VAMILY.md is caught; a coordinator commit that only
            mentions Grok is NOT fenced; a commit signed by a "grok" author outside the
            folder is caught.
     L1     every Grok commit reachable from main touches only reference/library/grok/.
            The clone is shallow; how many commits were read is printed, never hidden.
     WARN   a Grok commit on the branch grok, not yet on main, that touches anything
            outside the folder (the coordinator reverts it before bringing the folder in).
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const FOLDER = 'reference/library/grok/';

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

/* The Grok commits in a range, and for each the paths outside the folder. */
function fenceBreaks(cwd, range) {
  const SEP = '\u001e';
  /* GIT FILTERS FIRST. Listing every commit's files over 2,552 commits took 30 s; asking
     git for only the candidates (message, author or committer says grok) and then
     judging those exactly is the same answer in about a second. */
  const read = +execFileSync('git', ['rev-list', '--count', '--no-merges', range], { cwd, encoding: 'utf8' }).trim();
  const raw = ['--grep=^[[:space:]]*grok[[:space:]]*:', '--author=grok', '--committer=grok'].map(f =>
    execFileSync('git', ['log', '--no-merges', '-i', '--extended-regexp', f, '--name-only',
      '--format=' + SEP + '%H%x09%an%x09%ae%x09%cn%x09%ce%x09%s', range],
      { cwd, encoding: 'utf8', maxBuffer: 1 << 28 })).join('');
  const out = { read, grok: 0, breaks: [] };
  const seen = new Set();
  for (const block of raw.split(SEP).slice(1)) {
    const lines = block.split('\n');
    const [sha, an, ae, cn, ce, subj] = lines[0].split('\t');
    if (seen.has(sha)) continue; seen.add(sha);
    const isGrok = /^\s*grok\s*:/i.test(subj || '') || /grok/i.test([an, ae, cn, ce].join(' '));
    if (!isGrok) continue;
    out.grok++;
    const outside = lines.slice(1).map(s => s.trim()).filter(Boolean).filter(p => !p.startsWith(FOLDER));
    if (outside.length) out.breaks.push({ sha: sha.slice(0, 8), subj, outside });
  }
  return out;
}

console.log('='.repeat(74));
console.log('GROK FENCE: a Grok commit on main stays in reference/library/grok/ (rule 49d)');
console.log('='.repeat(74));

/* ---- S: the planted repository -------------------------------------------- */
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grokfence-'));
  const g = (args, env) => execFileSync('git', args, { cwd: tmp, encoding: 'utf8',
    env: Object.assign({}, process.env, { GIT_AUTHOR_NAME: 'paolosarn', GIT_AUTHOR_EMAIL: 'owner@example.invalid',
      GIT_COMMITTER_NAME: 'paolosarn', GIT_COMMITTER_EMAIL: 'owner@example.invalid' }, env || {}) });
  const put = (f, s) => { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.writeFileSync(path.join(tmp, f), s); };
  g(['init', '-q', '-b', 'main']);
  put('VAMILY.md', 'board\n'); g(['add', '-A']); g(['commit', '-qm', 'start']);
  const base = g(['rev-parse', 'HEAD']).trim();
  put(FOLDER + 'GROK_01.md', 'source: Grok, unverified\n'); g(['add', '-A']); g(['commit', '-qm', 'GROK: THE BEAST TABLE']);
  const r1 = fenceBreaks(tmp, base + '..HEAD');
  ok('S1 a GROK: commit inside its folder passes', r1.grok === 1 && r1.breaks.length === 0, JSON.stringify(r1));
  const b2 = g(['rev-parse', 'HEAD']).trim();
  put('VAMILY.md', 'board, edited by an outside writer\n'); g(['add', '-A']); g(['commit', '-qm', 'GROK: a better board']);
  const r2 = fenceBreaks(tmp, b2 + '..HEAD');
  ok('S2 a GROK: commit that touches VAMILY.md is caught', r2.breaks.length === 1 && r2.breaks[0].outside.includes('VAMILY.md'), JSON.stringify(r2));
  const b3 = g(['rev-parse', 'HEAD']).trim();
  put('VAMILY.md', 'board, coordinator\n'); g(['add', '-A']); g(['commit', '-qm', 'PAOLO 10/1: Grok writes into the repo through its connector']);
  const r3 = fenceBreaks(tmp, b3 + '..HEAD');
  ok('S3 a coordinator commit that only MENTIONS Grok is not fenced', r3.grok === 0 && r3.breaks.length === 0, JSON.stringify(r3));
  const b4 = g(['rev-parse', 'HEAD']).trim();
  put('laws/X.md', 'a law\n'); g(['add', '-A']);
  g(['commit', '-qm', 'notes'], { GIT_AUTHOR_NAME: 'Grok', GIT_AUTHOR_EMAIL: 'grok@x.ai' });
  const r4 = fenceBreaks(tmp, b4 + '..HEAD');
  ok('S4 a commit signed by a grok author outside the folder is caught', r4.breaks.length === 1, JSON.stringify(r4));
  fs.rmSync(tmp, { recursive: true, force: true });
}

/* ---- L1: main ----------------------------------------------------------------- */
let mainRef = 'origin/main';
try { execFileSync('git', ['rev-parse', '--verify', '-q', 'origin/main'], { cwd: ROOT }); } catch (e) { mainRef = 'HEAD'; }
const shallow = fs.existsSync(path.join(ROOT, '.git', 'shallow'));
const m = fenceBreaks(ROOT, mainRef);
console.log('  (read ' + m.read + ' commits reachable from ' + mainRef + (shallow ? ', a SHALLOW clone: older history is not in reach' : '')
  + '; ' + m.grok + ' of them are Grok\'s)');
ok('L1 every Grok commit on main touches only ' + FOLDER + ' (' + m.grok + ' Grok commits)', !m.breaks.length,
   m.breaks.slice(0, 5).map(b => b.sha + ' "' + b.subj + '" touched ' + b.outside.slice(0, 4).join(', ')).join('\n         ')
   + '\n         Rule 49: Grok informs, the coordinator writes. Revert what it wrote outside its folder.');

/* ---- WARN: the branch grok, ahead of main -------------------------------------- */
let branchNote = '';
try {
  execFileSync('git', ['fetch', '-q', 'origin', 'grok:refs/remotes/origin/grok'], { cwd: ROOT, stdio: 'pipe', timeout: 30000 });
  const gb = fenceBreaks(ROOT, mainRef + '..origin/grok');
  branchNote = gb.read + ' commit(s) on grok not yet on main, ' + gb.breaks.length + ' outside the folder';
  if (gb.breaks.length) console.log('  WARN the branch grok carries commits outside ' + FOLDER + ': '
    + gb.breaks.map(b => b.sha + ' "' + b.subj + '" ' + b.outside.slice(0, 3).join(', ')).join(' | ')
    + ' -- the coordinator reverts these before bringing the folder in');
} catch (e) { branchNote = 'could not read the branch grok (' + String(e.message || e).split('\n')[0].slice(0, 80) + ')'; }
console.log('  NOTE: ' + branchNote);

console.log('\n=== GROK FENCE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
