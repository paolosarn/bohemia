/* ============================================================================
   GROK FILTER -- A CITED GROK PAGE MUST BE STAMPED PASSED FILTER
   (PLUMBER 10/1/26, row [grok filter gate], rule 49b; the law's s5:
   laws/BOHEMIA_ADDENDUM_AN_OUTSIDE_HELPER_KNOWS_EVERYTHING_9_30_26.md)

   Grok's pages are "source: Grok, unverified" until the eyes-and-ears chat reads each one
   against rule 6 (no game he has not named, each named game in its department), the
   newest dated ruling, and a source on every number, and stamps it. The folder's own
   README sets the shape: line 1 says where it came from, LINE 2 is "PASSED FILTER" or
   "FAILED FILTER" with the reason. "No lane cites a file whose second line is not PASSED
   FILTER." A law without a machine gate is not enforced; this is the machine.

   LEGS
     S1-S5  SELF-TEST on a planted repository: a citation of a stamped page passes; of an
            unstamped page is caught; of a page stamped FAILED is caught; of a page that
            is not there is caught; a mention of the FOLDER itself (no page) is not a
            citation.
     L1     every file outside reference/library/grok/ that names a page inside it names a
            page that exists and whose second line starts PASSED FILTER.
     NOTE   how many citations were judged; zero is printed as zero, never as a pass over
            something.
   Static, a second or two.
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const FOLDER = 'reference/library/grok/';
/* a PAGE: the folder plus a file name, never the bare folder */
/* git grep speaks POSIX extended patterns: no (?: ). The first cut used the JavaScript form and git refused it. */
const CITE_ERE = 'reference/library/grok/[A-Za-z0-9_][A-Za-z0-9_./-]*[.](md|txt|json)';

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

function judge(root) {
  let hits = '';
  try {
    hits = execFileSync('git', ['grep', '-I', '-o', '-E', CITE_ERE, '--', '.', ':!' + FOLDER],
      { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 });
  } catch (e) { if (e.status !== 1) throw e; }       /* status 1 = no match */
  const cites = [];
  for (const line of hits.split('\n').filter(Boolean)) {
    const i = line.indexOf(':'); cites.push({ from: line.slice(0, i), page: line.slice(i + 1) });
  }
  const bad = [];
  for (const c of cites) {
    const f = path.join(root, c.page);
    if (!fs.existsSync(f)) { bad.push(c.from + ' cites ' + c.page + ', which is not on this branch'); continue; }
    const second = (fs.readFileSync(f, 'utf8').split('\n')[1] || '').trim();
    if (!/^PASSED FILTER\b/.test(second))
      bad.push(c.from + ' cites ' + c.page + ', whose second line is "' + second.slice(0, 60) + '", not PASSED FILTER');
  }
  return { cites, bad };
}

console.log('='.repeat(74));
console.log('GROK FILTER: a Grok page is cited only once it is stamped PASSED FILTER (rule 49b)');
console.log('='.repeat(74));

/* ---- S: a planted repository --------------------------------------------- */
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grokfilter-'));
  const put = (f, s) => { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.writeFileSync(path.join(tmp, f), s); };
  execFileSync('git', ['init', '-q'], { cwd: tmp });
  put(FOLDER + 'GOOD.md', 'source: Grok, unverified\nPASSED FILTER (EYES 10/1)\n# good\n');
  put(FOLDER + 'RAW.md', 'source: Grok, unverified\n# raw\n');
  put(FOLDER + 'FAILED.md', 'source: Grok, unverified\nFAILED FILTER: names a game he never named\n');
  const run = (body) => { put('records/R.md', body); execFileSync('git', ['add', '-A'], { cwd: tmp }); return judge(tmp); };
  const a = run('see ' + FOLDER + 'GOOD.md for the table');
  ok('S1 a citation of a stamped page passes', a.cites.length === 1 && !a.bad.length, JSON.stringify(a));
  const b = run('see ' + FOLDER + 'RAW.md for the table');
  ok('S2 a citation of an unstamped page is caught', b.bad.length === 1, JSON.stringify(b));
  const c = run('see ' + FOLDER + 'FAILED.md');
  ok('S3 a citation of a page stamped FAILED is caught', c.bad.length === 1, JSON.stringify(c));
  const d = run('see ' + FOLDER + 'NOT_THERE.md');
  ok('S4 a citation of a page that is not there is caught', d.bad.length === 1 && /not on this branch/.test(d.bad[0]), JSON.stringify(d));
  const e = run('Grok writes in ' + FOLDER + ' on its own branch');
  ok('S5 naming the folder itself is not a citation', e.cites.length === 0, JSON.stringify(e));
  fs.rmSync(tmp, { recursive: true, force: true });
}

/* ---- L1: this tree ---------------------------------------------------------- */
const r = judge(ROOT);
console.log('  (' + r.cites.length + ' citation(s) of a Grok page outside its folder'
  + (r.cites.length ? '' : ': nothing to judge yet, which is not a pass over something') + ')');
ok('L1 every Grok page cited outside its folder is on main and stamped PASSED FILTER', !r.bad.length,
   r.bad.slice(0, 6).join('\n         ') + '\n         The eyes-and-ears chat stamps a page on its second line '
   + '(PASSED FILTER or FAILED FILTER, with the reason) after reading it against rule 6, the newest ruling '
   + 'and a source on every number. Until then nothing cites it.');

console.log('\n=== GROK FILTER GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
