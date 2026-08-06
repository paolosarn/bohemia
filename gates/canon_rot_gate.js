/* ============================================================================
   CANON ROT GATE (8/4/26, LAB lane)

   THE PROBLEM NOBODY OWNS. Nine sessions write canon in parallel. There are 338 law
   files and 245 record files, and they cite each other constantly. Nothing has ever
   checked that those citations RESOLVE. A law that points at a file which does not
   exist is worse than a law with no citation, because a session follows the path,
   finds nothing, and concludes the thing was never built.

   CLAUDE.md's TRUTH HIERARCHY already makes this a standing job -- "a contradiction
   between two live files is a BUG, not an interpretation choice: fix it if mechanical,
   flag it [PENDING Paolo] if canon-level." This gate is the mechanical half, run by a
   machine instead of by whoever happens to notice.

   WHAT IT CHECKS
     1. SELF-TEST FIRST. See the bug note below. The gate proves its own regex is sound
        before it is allowed to judge anybody's files.
     2. EXTENSION DRIFT -- a citation that fails to resolve while the same filename
        exists in the same directory under a different extension. Always a typo, always
        mechanical, HARD FAIL.
     3. ARCHIVED-AS-LIVE -- citing a file that lives in /archive without saying near the
        citation that it is superseded. /archive is history, never current.
     4. A RATCHET ON TRULY-GONE citations. There are already ~80 of these, spread across
        six lanes' documents and mostly pointing at genuinely deleted June/July tools.
        Failing the build on all of them would red-gate five other lanes for debt this
        lane cannot verify, so the number is RATCHETED instead: it may fall, never rise.
        No new rot, and no lane is blocked by somebody else's.

   ★★ THE BUG THIS GATE WAS BORN FROM, WHICH WAS MINE, AND IT IS WHY CHECK 1 EXISTS.
   The first version of this audit used the citation regex
       /(?:...)\/[A-Za-z0-9_\/.]+\.(?:md|txt|js|py|json|html)/
   Regex alternation is FIRST-MATCH, not longest-match, so "js" wins before "json" ever
   gets tried: every real `.json` path in the repo was captured as a `.js` path, reported
   as a broken citation, and my fixer then "repaired" 40 CORRECT paths into `.jsonon`.
   Reverted before commit, nothing shipped. The lesson is now a permanent check:
   LONGEST EXTENSION FIRST, plus a negative lookahead so a path can never be captured as
   a prefix of itself. This is the same family as the bug this repo keeps shipping -- a
   checker that cannot tell a thing from a lookalike -- and it is the first one where the
   CHECKER's own pattern was the lookalike.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('CANON ROT GATE — every citation in canon resolves, or it is rot');
console.log('='.repeat(74));

/* LONGEST EXTENSION FIRST + a boundary. Do not reorder this alternation. */
const CITE = /(?:laws|records|gates|engine|banks|slices|tools)\/[A-Za-z0-9_\/.-]+?\.(?:json|html|md|txt|js|py)(?![A-Za-z0-9])/g;

/* ---- 1. THE SELF-TEST. The gate earns the right to judge. ------------------ */
{
  const probe = 'see records/target/BOHEMIA_MASTER_PALETTE.json and gates/x.js here';
  const got = probe.match(CITE) || [];
  ok('A1 the regex captures a .json path WHOLE, never as .js + leftovers',
     got.indexOf('records/target/BOHEMIA_MASTER_PALETTE.json') >= 0 &&
     got.indexOf('records/target/BOHEMIA_MASTER_PALETTE.js') < 0);
  ok('A2 and still captures a genuine .js path', got.indexOf('gates/x.js') >= 0);
  ok('A3 exactly two citations found in the probe, no phantom third', got.length === 2);
  /* The negative control: the BROKEN pattern must actually fail this test, or the test
     is not testing anything. If someone "simplifies" the regex back, A1 goes red. */
  /* FAITHFUL to what I actually shipped: GREEDY +, dot inside the class, and NO lookahead.
     My first negative control accidentally kept the lazy quantifier and the lookahead, which
     FIXES the bug -- so the control passed and proved nothing. A negative control that does
     not reproduce the failure is not a control. */
  const BROKEN = /(?:laws|records|gates|engine|banks|slices|tools)\/[A-Za-z0-9_\/.]+\.(?:md|txt|js|py|json|html)/g;
  const bad = probe.match(BROKEN) || [];
  ok('A4 the negative control proves the test bites: the old alternation order ' +
     'truncates .json (it captured ' + JSON.stringify(bad) + ')',
     bad.indexOf('records/target/BOHEMIA_MASTER_PALETTE.json') < 0 &&
     bad.indexOf('records/target/BOHEMIA_MASTER_PALETTE.js') >= 0);
}

function walk(dir, out, ext) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, f.name);
    if (f.isDirectory()) { walk(rel, out, ext); continue; }
    if (ext.test(f.name)) out.push(rel);
  }
  return out;
}

/* THE AUDIT RECORD IS EXEMPT, BY EXACT PATH. It is the document ABOUT rot, so it QUOTES
   broken paths as examples -- and a sweep that cannot tell a quoted specimen from a live
   citation would flag the post-mortem for describing the bug it fixed. Exempted by path
   and never by pattern, because "looks like a document about rot" is a hole anything
   could crawl through. */
const EXEMPT = new Set(['records/BOHEMIA_CANON_ROT_AUDIT_8_4_26.md']);
const docs = walk('laws', [], /\.(md|txt)$/).concat(walk('records', [], /\.(md|txt)$/))
  .filter(f => !EXEMPT.has(f));
ok('B1 the canon corpus is present (' + docs.length + ' law/record documents)', docs.length > 400);

const all = ['laws', 'records', 'gates', 'engine', 'tools', 'slices', 'banks']
  .reduce((a, d) => walk(d, a, /./), []);
const byStem = new Map();
all.forEach(f => {
  const stem = path.basename(f).replace(/\.[a-z0-9]+$/i, '');
  if (!byStem.has(stem)) byStem.set(stem, []);
  byStem.get(stem).push(f);
});
const archived = new Set(fs.existsSync(path.join(ROOT, 'archive'))
  ? fs.readdirSync(path.join(ROOT, 'archive')) : []);

let drift = [], archLive = [], gone = [];
docs.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  [...new Set(src.match(CITE) || [])].forEach(c => {
    if (fs.existsSync(path.join(ROOT, c))) return;
    const base = path.basename(c), stem = base.replace(/\.[a-z0-9]+$/i, '');

    if (archived.has(base)) {
      /* SCOPED TO THE CITATION, not to the file. A document can legitimately talk about
         being superseded elsewhere while citing this one as if live -- a file-wide grep
         would call that clean and be wrong. Same per-item-scoping rule the other gates
         in this repo learned the hard way. */
      let described = false;
      let i = src.indexOf(c);
      while (i >= 0 && !described) {
        const near = src.slice(Math.max(0, i - 300), i + 300);
        if (/superseded|archive|retired|dead|killed|no longer/i.test(near)) described = true;
        i = src.indexOf(c, i + 1);
      }
      if (!described) archLive.push(f + ' -> ' + c);
      return;
    }
    const sameDir = (byStem.get(stem) || []).filter(x => path.dirname(x) === path.dirname(c));
    if (sameDir.length) drift.push(f + ': ' + c + ' -> ' + sameDir.join(', '));
    else gone.push(f + ' -> ' + c);
  });
});

/* ---- 2. EXTENSION DRIFT: always mechanical, always a hard fail ------------- */
ok('C1 no citation points at a wrong extension while the real file sits beside it' +
   (drift.length ? ' -> ' + drift.slice(0, 4).join(' | ') : ''), drift.length === 0);

/* ---- 3. ARCHIVED CITED AS LIVE -------------------------------------------- */
/* RATCHETED, NOT ZEROED, AND HERE IS WHY. Six citations of an /archive file are not
   contextualised as superseded near the citation. The load-bearing one is real rot:
   laws/BOHEMIA_PAOLO_TASTE_CANON.md cites the KILLED woman-rig addendum as the source for a
   LIVE preference ("the whole wardrobe carries to the woman rig") -- and the woman rig was
   killed on 7/25, so that premise is dead. But that is CANON-LEVEL, not mechanical: whether
   the preference survives the one-rig ruling is Paolo's call, not a path I can retype. So
   CLAUDE.md's rule applies exactly -- fix it if mechanical, FLAG IT if canon-level. It is
   flagged here, printed on every single run so it cannot be buried, and left for its lane. */
const ARCH_CEILING = 6;
ok('C2 archived-as-live citations have not increased (' + archLive.length + ' of ceiling ' +
   ARCH_CEILING + ')', archLive.length <= ARCH_CEILING);
if (archLive.length) {
  console.log('  FLAGGED [PENDING Paolo / owning lane] — cites /archive as if live:');
  archLive.forEach(x => console.log('    ' + x));
}

/* ---- 4. THE RATCHET ON PRE-EXISTING DEBT ---------------------------------- */
/* Six lanes' documents cite tools and surfaces that were genuinely deleted, most of them
   legitimate tombstones ("this was killed, here is the post-mortem"). This lane cannot
   tell a tombstone from a stale reference in another lane's history, and guessing would
   either red-gate five lanes or quietly delete their record of what died. So: HOLD THE
   LINE. Lower this number whenever a lane cleans its own up; never raise it. */
const CEILING = 80;  /* measured 8/4; lower it whenever a lane cleans its own */
ok('C3 truly-gone citations have not increased (' + gone.length + ' of ceiling ' +
   CEILING + ')' + (gone.length > CEILING ? ' -> NEW ROT: ' +
   gone.slice(CEILING).slice(0, 4).join(' | ') : ''), gone.length <= CEILING);
if (gone.length < CEILING) {
  console.log('  NOTE: truly-gone is down to ' + gone.length + ' from a ceiling of ' +
              CEILING + ' — lower CEILING in this gate to lock the win in.');
}

/* ---- 5. THE AUDIT RECORD MUST EXIST AND STAY HONEST ----------------------- */
const AUDIT = 'records/BOHEMIA_CANON_ROT_AUDIT_8_4_26.md';
ok('D1 the audit record exists', fs.existsSync(path.join(ROOT, AUDIT)));
const audit = fs.existsSync(path.join(ROOT, AUDIT))
  ? fs.readFileSync(path.join(ROOT, AUDIT), 'utf8').replace(/[*`]/g, '').replace(/\s+/g, ' ')
  : '';
ok('D2 it records that the first run of this audit was WRONG, and how',
   /alternation is FIRST-MATCH/i.test(audit) && /jsonon/i.test(audit));
ok('D3 and that the bad fix was reverted before anything was committed',
   /Reverted before commit/i.test(audit) && /nothing shipped/i.test(audit));
ok('D4 it states the real finding honestly -- ONE drift, not 43',
   /ONE real extension drift/i.test(audit));
ok('D5 the 80 truly-gone are listed as OTHER LANES\' to clean, not silently ignored',
   /ratchet/i.test(audit) && /not this lane's to guess at/i.test(audit));

console.log('='.repeat(74));
console.log('  CANON ROT GATE: ' + pass + ' pass / ' + fail + ' fail   (' +
            docs.length + ' docs, ' + drift.length + ' drift, ' + archLive.length +
            ' archived-as-live, ' + gone.length + ' gone)');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
