/* BOHEMIA DIALOGUE CATALOGUE GATE (8/11/26) — dialogue never waits on a thumb,
 * so the CORPUS holds the bar in his place, and "I will edit it later" has a
 * place for later.
 *
 * Paolo 8/11, LOCKED:
 *   "I HAVE A WHOLE 170 QUEST FILE WITH DIALOGUE I DONT HAVE TIME TO APPROVE THE
 *    DIALOGUE THIS SLOW LIKE THIS I WILL EDIT IT LATER JUST DIALOGUE ALWAYS
 *    REFER TO THE BEST QUESTS EVER CATALOGUE OKAY WRITE THAT DOWN AS A RULE
 *    BROTHER. READ THE QUEST SHIT AND GET INSPIRED"
 *
 * WHAT THIS IS ACTUALLY GUARDING. He took dialogue off the approval queue. The
 * thumb WAS the quality control, so removing it without replacing it is how a
 * game ends up with two thousand lines nobody ever held to a standard. What
 * replaces it is questbook/: 152 of the best-written quests ever shipped, mined
 * into 3,672 citable findings. Every authored line now cites the findings it was
 * built on, in the QUEST STUDY LAW's own vocabulary, and a citation is a claim
 * this file can check. "READ THE QUEST SHIT" becomes a precondition of writing a
 * line rather than a suggestion.
 *
 * AND THE OTHER HALF, which is not decoration: he does not dig in files. A line
 * in records/BOHEMIA_SCENE_*.json is a line he cannot edit, so "I will edit it
 * later" would quietly become never. The WORDS tab is checked here too, and
 * checked for BEING CURRENT — a stale tab is the same failure wearing a green.
 *
 * PROVES:
 *   1) the ruling is on disk, quoted, and in the file every session reads
 *   2) dialogue-bearing artifacts are DISCOVERED, not read off a hardcoded list
 *   3) every one of them carries catalogue citations; scenes cite PER LINE
 *   4) every cited id RESOLVES in the index (no invented ids)
 *   5) every cited title is the corpus's own, VERBATIM (what makes it checkable)
 *   6) every 'applied:' is a real sentence, not a name-drop
 *   7) each scene spans >= 2 studies and >= 2 masters
 *   8) the WORDS tab exists, is wired into the alpha, and lives where Pages
 *      actually publishes
 *   9) the WORDS tab is CURRENT with its sources (source-byte fingerprint)
 *  10) and nobody has quietly put dialogue back in front of him for a verdict
 *
 * Law: laws/BOHEMIA_ADDENDUM_DIALOGUE_REFERS_TO_THE_CATALOGUE_8_11_26.md
 *   node gates/dialogue_catalogue_gate.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; } else { fail++; console.log('  FAIL: ' + m); } }

var LAW = 'laws/BOHEMIA_ADDENDUM_DIALOGUE_REFERS_TO_THE_CATALOGUE_8_11_26.md';

/* ---- 1. THE RULING IS WRITTEN DOWN. He said "WRITE THAT DOWN AS A RULE". --- */
ok(fs.existsSync(LAW), 'the 8/11 catalogue ruling is written down as a law');
var law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
ok(/ALWAYS REGER TO THE BEST QUESTS EVER CATLOUGUE/.test(law),
  'the law quotes him VERBATIM, garbles and all, so nobody re-reads it softer');
ok(/REGER = REFER/.test(law) && /CATLOUGUE = CATALOGUE/.test(law),
  'and decodes the transcription, so a future session does not invent a term out of a typo');
ok(/never waits on a thumb/i.test(law) && /questbook/i.test(law),
  'the law states BOTH halves: no approval queue, and the corpus holds the bar instead');
ok(/who dies/i.test(law) && /which faction holds/i.test(law),
  'the law restates the half that did NOT change (decisions still wait for him)');

var claude = fs.readFileSync('CLAUDE.md', 'utf8');
ok(/DIALOGUE ALWAYS REFERS TO THE CATALOGUE/.test(claude),
  'CLAUDE.md carries the rule, so every session reads it before writing a line');
ok(claude.indexOf('DIALOGUE_REFERS_TO_THE_CATALOGUE') >= 0,
  'and CLAUDE.md points at the full law');

/* ---- 2. THE INDEX THE CITATIONS RESOLVE AGAINST -------------------------- */
var IDX_PATH = 'records/BOHEMIA_QUESTBOOK_LAW_INDEX.json';
ok(fs.existsSync(IDX_PATH), 'the questbook law index exists (tools/bohemia_questbook_index.py)');
if (!fs.existsSync(IDX_PATH)) {
  console.log('DIALOGUE CATALOGUE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(1);
}
var LAWS = JSON.parse(fs.readFileSync(IDX_PATH, 'utf8')).laws;
ok(Object.keys(LAWS).length > 3000,
  'the index holds the whole corpus (' + Object.keys(LAWS).length + ' citable findings)');

/* ---- 3. DISCOVERY, NOT A HARDCODED LIST ---------------------------------- */
/* A hardcoded list is exactly how a law stops being enforced without anybody
   noticing: a lane invents a new dialogue file and the machine never looks at
   it. Same discovery rule as the harvester, stated independently here. */
var bqFiles = fs.existsSync('quests/bq')
  ? fs.readdirSync('quests/bq').filter(function (f) { return /\.bq$/.test(f); })
    .sort().map(function (f) { return 'quests/bq/' + f; })
  : [];
var sceneFiles = fs.readdirSync('records')
  .filter(function (f) { return /^BOHEMIA_SCENE_.*\.json$/.test(f); })
  .sort().map(function (f) { return 'records/' + f; });
var SRC = bqFiles.concat(sceneFiles);

ok(bqFiles.length > 0, 'dialogue-bearing quests were discovered on disk (' + bqFiles.length + ' .bq)');
ok(sceneFiles.length > 0, 'dialogue-bearing scenes were discovered on disk (' + sceneFiles.length + ')');

/* ---- 4/5/6. EVERY CITATION IS REAL --------------------------------------- */
var badId = [], badTitle = [], thin = [], uncited = [];

function checkCite(where, c) {
  var e = LAWS[c.id];
  if (!e) { badId.push(where + ' -> ' + c.id); return; }
  /* VERBATIM. A citation whose title does not match the corpus is a name-drop
     with a real id stapled to it, which is worse than no citation at all
     because it reads as checked. */
  if (String(e.title || '').trim() !== String(c.title || '').trim()) {
    badTitle.push(where + ' -> ' + c.id + ' says "' + c.title + '", corpus says "' + e.title + '"');
  }
  if (String(c.applied || '').trim().length < 40) thin.push(where + ' -> ' + c.id);
}

/* .bq quests cite at the FILE level (QUEST STUDY LAW, 7/26 vocabulary). */
var bqStudies = {}, bqMasters = {};
bqFiles.forEach(function (f) {
  var txt = fs.readFileSync(f, 'utf8').split('\n');
  var cites = [], pend = null;
  txt.forEach(function (ln) {
    var m = /^#\s*@STUDY\s+(Q\d+\.[A-Z]+\d+)\s+(.*?)\s*$/.exec(ln);
    if (m) { pend = { id: m[1], title: m[2], applied: '' }; cites.push(pend); return; }
    var a = /^#\s*applied:\s*(.*?)\s*$/.exec(ln);
    if (a && pend) { pend.applied = a[1]; pend = null; }
  });
  if (!cites.length) { uncited.push(f); return; }
  cites.forEach(function (c) {
    checkCite(f, c);
    var e = LAWS[c.id];
    if (e) { bqStudies[e.study] = 1; bqMasters[e.kind] = 1; }
  });
});

/* Scenes cite PER LINE. A scene is four lines and each one is its own craft
   decision, so a file-level citation would not say which finding produced
   which line — and that is the whole thing the citation is for. */
var sceneLineCount = 0, hisOwn = 0, sceneUncited = [], sceneSpanFail = [];
sceneFiles.forEach(function (f) {
  var d = JSON.parse(fs.readFileSync(f, 'utf8'));
  var says = (d.beats || []).filter(function (b) { return b.kind === 'say'; });
  var studies = {}, masters = {};
  says.forEach(function (b) {
    sceneLineCount++;
    /* HIS OWN WORDS DO NOT CITE THE CATALOGUE, and requiring it would be the
       gate outranking the ruling. The corpus exists to hold a LANE'S writing to
       a standard in his place; a line he wrote himself needs no stand-in for his
       judgement, it IS his judgement. draft:false lines carry a `source` naming
       the ruling they were quoted from instead, which attempt_gate checks. */
    if (b.draft === false) { hisOwn++; return; }
    var cs = b.study || [];
    if (!cs.length) { sceneUncited.push(f + '#' + b.id); return; }
    cs.forEach(function (c) {
      checkCite(f + '#' + b.id, c);
      var e = LAWS[c.id];
      if (e) { studies[e.study] = 1; masters[e.kind] = 1; }
    });
  });
  if (says.length && (Object.keys(studies).length < 2 || Object.keys(masters).length < 2)) {
    sceneSpanFail.push(f + ' (' + Object.keys(studies).length + ' studies, ' +
      Object.keys(masters).length + ' masters)');
  }
});

ok(uncited.length === 0, 'every .bq carries catalogue citations' +
  (uncited.length ? ' — UNCITED: ' + uncited.join(', ') : ''));
ok(sceneUncited.length === 0, 'every SCENE LINE carries its own citation' +
  (sceneUncited.length ? ' — UNCITED: ' + sceneUncited.join(', ') : ''));
ok(badId.length === 0, 'every cited id RESOLVES in the corpus index' +
  (badId.length ? ' — ' + badId.join(' | ') : ''));
ok(badTitle.length === 0, 'every cited title is the corpus\'s own, VERBATIM' +
  (badTitle.length ? ' — ' + badTitle.slice(0, 3).join(' | ') : ''));
ok(thin.length === 0, 'every citation says what it APPLIED, not just a name' +
  (thin.length ? ' — ' + thin.slice(0, 5).join(' | ') : ''));
ok(sceneSpanFail.length === 0, 'each scene spans >= 2 studies and >= 2 masters' +
  (sceneSpanFail.length ? ' — ' + sceneSpanFail.join(' | ') : ''));
ok(Object.keys(bqStudies).length >= 20,
  'the quest corpus leans on real breadth (' + Object.keys(bqStudies).length + ' distinct studies)');

/* ---- 7. THE WORDS TAB EXISTS AND HE CAN REACH IT ------------------------- */
var TAB = 'slices/BOHEMIA_WORDS_CURRENT.html';
ok(fs.existsSync(TAB), 'the WORDS tab page exists');
var tab = fs.existsSync(TAB) ? fs.readFileSync(TAB, 'utf8') : '';
var alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
ok(/data-p="words"[^>]*>WORDS</.test(alpha), 'WORDS is a real tab in the alpha tab bar');
ok(/id="p-words"/.test(alpha) && /BOHEMIA_WORDS_CURRENT\.html/.test(alpha),
  'and the WORDS panel loads that page');
/* NAME THE TAB / ONE-LINK: it must live where Pages actually publishes, or the
   tab is blank in production and works perfectly on disk — the exact 8/6 bug. */
var cfg = fs.readFileSync('_config.yml', 'utf8');
ok(TAB.indexOf('slices/') === 0 && !/^\s*-\s*slices\//m.test(cfg),
  'the tab lives in slices/, which _config.yml publishes (a records/ fetch would 404 live)');
ok(!/fetch\(|XMLHttpRequest/.test(tab),
  'the page fetches NOTHING at runtime — payload is inlined, so it cannot 404 in production');
ok(/EXPORT/.test(tab) && /\.txt/.test(tab),
  'and it exports as .txt (verdict workflow: .txt, never .json)');

/* ---- 8. AND THE TAB IS CURRENT ------------------------------------------- */
/* A stale tab is the same failure as no tab, wearing a green: he opens WORDS,
   edits yesterday's line, and the edit lands on something that moved. */
var h = crypto.createHash('sha256');
SRC.forEach(function (f) {
  h.update(Buffer.from(f, 'utf8')); h.update(Buffer.from([0]));
  h.update(fs.readFileSync(f)); h.update(Buffer.from([0]));
});
var want = h.digest('hex').slice(0, 16);
var got = (/WORDS_FINGERPRINT = '([a-f0-9]+)'/.exec(tab) || [])[1];
ok(got === want, 'the WORDS tab is CURRENT with its sources' +
  (got === want ? '' : ' — baked from ' + got + ', sources now hash ' + want +
    ' (run: python3 tools/bohemia_words_book.py)'));

var BOOK = fs.existsSync('records/BOHEMIA_WORDS_BOOK.json')
  ? JSON.parse(fs.readFileSync('records/BOHEMIA_WORDS_BOOK.json', 'utf8')) : null;
ok(BOOK !== null, 'the machine copy of the words book exists');
if (BOOK) {
  /* An INDEPENDENT count, measured here off the raw sources rather than trusted
     from the generator's own summary — a number a tool reports about itself is
     one measurement written twice. */
  var mine = sceneLineCount;
  bqFiles.forEach(function (f) {
    fs.readFileSync(f, 'utf8').split('\n').forEach(function (ln) {
      if (/^\s*@SAY\s+\S/.test(ln) || /^\s*@LOG\s+\S/.test(ln)) mine++;
      else if (/^\s*@OPT\s+["(]/.test(ln)) mine++;
      else if (/^@OBJ\s+\d+\s+"/.test(ln)) mine++;
    });
  });
  ok(BOOK._meta.lines === mine, 'the book holds EVERY line on disk (book ' +
    BOOK._meta.lines + ', counted here ' + mine + ')');
  ok(BOOK._meta.fingerprint === want, 'and the machine copy is current too');
  /* every scene line's CURRENT text is actually in the page he opens */
  var missing = [];
  sceneFiles.forEach(function (f) {
    var d = JSON.parse(fs.readFileSync(f, 'utf8'));
    (d.beats || []).filter(function (b) { return b.kind === 'say'; }).forEach(function (b) {
      if (b.text && tab.indexOf(JSON.stringify(b.text).slice(1, -1)) < 0) missing.push(f + '#' + b.id);
    });
  });
  ok(missing.length === 0, 'every scene line he can edit is actually ON the page' +
    (missing.length ? ' — MISSING: ' + missing.join(', ') : ''));
}

/* ---- 9. NOBODY PUT DIALOGUE BACK IN FRONT OF HIM ------------------------- */
/* The failure mode this law names by hand is not bad dialogue, it is ASKING.
   The judge surfaces are where asking happens, so that is where it is checked. */
var judged = [];
['slices/BOHEMIA_VOTE_CURRENT.html', 'slices/BOHEMIA_ART_CURRENT.html'].forEach(function (f) {
  if (!fs.existsSync(f)) return;
  var t = fs.readFileSync(f, 'utf8');
  sceneFiles.forEach(function (sf) {
    var d = JSON.parse(fs.readFileSync(sf, 'utf8'));
    (d.beats || []).filter(function (b) { return b.kind === 'say' && b.text; }).forEach(function (b) {
      if (t.indexOf(b.text) >= 0) judged.push(f + ' <- ' + sf + '#' + b.id);
    });
  });
});
ok(judged.length === 0, 'no dialogue line is sitting on a JUDGE surface awaiting his thumb' +
  (judged.length ? ' — ' + judged.join(', ') : ''));

console.log('DIALOGUE CATALOGUE GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  (BOOK ? BOOK._meta.lines : '?') + ' lines across ' + SRC.length +
  ' sources, all sourced to the catalogue; ' + (sceneLineCount - hisOwn) +
  ' cited per line, ' + hisOwn + ' are HIS OWN WORDS and cite nothing)');
process.exit(fail ? 1 : 0);
