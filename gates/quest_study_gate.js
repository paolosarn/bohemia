/* quest_study_gate.js — THE QUEST STUDY LAW, machine-enforced (7/26/26).

   WHY THIS EXISTS. Paolo's questbook is 240 files: 152 quests studied to the bone,
   distilled into four masters holding 1,527 craft findings, 693 flaw findings,
   1,276 ports and 176 dissected dialogue nodes. The S10-S21 batch was written from
   the summary bullets in CLAUDE.md instead, and nobody would ever have known,
   because nothing in the machine cared. That is the exact hole REUSE-FIRST closed
   on the art side ("a claimed reuse must actually OPEN that bank in code, not just
   say so"). This is its quest-side twin.

   THE LAW: a canon .bq quest must CITE the corpus laws it is built on, and the
   citation must be REAL — a live id, the corpus's own verbatim title, and a
   sentence saying what was actually applied. A name-drop fails. A wrong title
   fails. A missing citation fails.

   PROVES:
     1) the law index exists and is CURRENT with the corpus (its per-master law
        counts equal the counts the masters themselves declare in their headers,
        so a corpus batch appended without reindexing is caught here),
     2) every .bq carries >= 3 @STUDY citations,
     3) every cited id RESOLVES in the index (no invented ids),
     4) every cited title matches the corpus VERBATIM (no id/title mismatch —
        this is what makes a citation checkable rather than decorative),
     5) each citation carries an 'applied:' line of real length (no name-drops),
     6) a quest's citations span >= 2 distinct STUDIES and >= 2 distinct MASTERS,
        so no quest leans on one study or one dimension of craft,
     7) corpus-wide breadth: the .bq corpus cites >= 20 distinct studies.

   Run: node gates/quest_study_gate.js
   Registered in gates/bohemia_gates.py as QUEST STUDY. */
'use strict';
var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var IDX_PATH = path.join(ROOT, 'records', 'BOHEMIA_QUESTBOOK_LAW_INDEX.json');
var BQ_DIR = path.join(ROOT, 'quests', 'bq');
var QB = path.join(ROOT, 'questbook');

var pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; } else { fail++; console.log('  FAIL: ' + m); } }

ok(fs.existsSync(IDX_PATH), 'the questbook law index exists (python3 tools/bohemia_questbook_index.py)');
if (!fs.existsSync(IDX_PATH)) { console.log('QUEST STUDY GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
var IDX = JSON.parse(fs.readFileSync(IDX_PATH, 'utf8'));
var LAWS = IDX.laws;

/* 1) INDEX IS CURRENT. Each master states its own finding count on line 2
   ("1527 findings / 152 files", "693 findings", "1276 ports", "176 nodes / 54 v2 files").
   If a corpus batch is appended and the index is not regenerated, these diverge. */
var MASTERS = [
  ['craft',  'BOHEMIA_CRAFT_MASTER_7_16_26.txt'],
  ['flaws',  'BOHEMIA_FLAWS_MASTER_7_16_26.txt'],
  ['ports',  'BOHEMIA_PORTS_MASTER_7_16_26.txt'],
  ['convos', 'BOHEMIA_CONVERSATIONS_MASTER_7_16_26.txt'],
];
MASTERS.forEach(function (m) {
  var kind = m[0], file = path.join(QB, m[1]);
  ok(fs.existsSync(file), 'corpus master present: ' + m[1]);
  if (!fs.existsSync(file)) return;
  var head = fs.readFileSync(file, 'utf8').split('\n').slice(0, 3).join(' ');
  var declared = /(\d+)\s+(findings|ports|nodes)/.exec(head);
  var indexed = Object.keys(LAWS).filter(function (k) { return LAWS[k].kind === kind; }).length;
  ok(!!declared, m[1] + ': declares its own finding count in its header');
  if (declared) {
    ok(parseInt(declared[1], 10) === indexed,
       m[1] + ': the index is CURRENT with the corpus (master declares ' + declared[1] +
       ', index holds ' + indexed + ' — regenerate with tools/bohemia_questbook_index.py)');
  }
});

/* 2-7) THE CITATIONS */
var CITE_RE = /^#\s*@STUDY\s+(Q\d{3}\.[WXPN]\d+)\s+(.+?)\s*$/;
var APPLIED_RE = /^#\s*applied:\s*(.+?)\s*$/;

function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

var files = fs.readdirSync(BQ_DIR).filter(function (f) { return /\.bq$/.test(f); }).sort();
ok(files.length > 0, 'canon .bq quests exist');

var allStudies = {};
files.forEach(function (f) {
  var lines = fs.readFileSync(path.join(BQ_DIR, f), 'utf8').split('\n');
  var cites = [];
  for (var i = 0; i < lines.length; i++) {
    var m = CITE_RE.exec(lines[i]);
    if (!m) continue;
    var applied = '';
    for (var j = i + 1; j < lines.length && j <= i + 3; j++) {
      var a = APPLIED_RE.exec(lines[j]);
      if (a) { applied = a[1]; break; }
      if (CITE_RE.test(lines[j])) break;
    }
    cites.push({ id: m[1], title: m[2], applied: applied, line: i + 1 });
  }

  ok(cites.length >= 3, f + ': cites at least 3 questbook laws (found ' + cites.length + ')');

  var studies = {}, kinds = {};
  cites.forEach(function (c) {
    var law = LAWS[c.id];
    ok(!!law, f + ' line ' + c.line + ': @STUDY ' + c.id + ' resolves to a real law in the corpus index');
    if (!law) return;
    ok(norm(law.title) === norm(c.title),
       f + ' line ' + c.line + ': ' + c.id + ' title matches the corpus VERBATIM (corpus says "' +
       norm(law.title).slice(0, 60) + '", quest says "' + norm(c.title).slice(0, 60) + '")');
    ok(c.applied.length >= 40,
       f + ' line ' + c.line + ': ' + c.id + ' says what was APPLIED, not just the name (found ' +
       c.applied.length + ' chars)');
    studies[law.study] = true;
    kinds[law.kind] = true;
    allStudies[law.study] = true;
  });

  ok(Object.keys(studies).length >= 2, f + ': draws on at least 2 distinct STUDIES (found ' + Object.keys(studies).length + ')');
  ok(Object.keys(kinds).length >= 2, f + ': draws on at least 2 distinct MASTERS — craft/flaws/ports/convos (found ' + Object.keys(kinds).join(',') + ')');
});

ok(Object.keys(allStudies).length >= 20,
   'CORPUS BREADTH: the .bq quests draw on at least 20 distinct studies (found ' +
   Object.keys(allStudies).length + ' of ' + Object.keys(IDX.studies).length + ')');

console.log('QUEST STUDY GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            files.length + ' quests, ' + Object.keys(allStudies).length + ' studies cited, ' +
            Object.keys(LAWS).length + ' citable laws indexed)');
if (fail > 0) process.exit(1);
