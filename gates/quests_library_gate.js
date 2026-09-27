/* quests_library_gate.js -- QUESTS IS RESEARCH ONLY, machine-enforced (Paolo 9/27/26, rule 35).

   WHY THIS EXISTS. Chat 19 implements nothing now. Its whole product is pages and designs that the
   building lanes (RUN, WORLD, PEOPLE, WORDS) cite when they build events and contracts. A research
   page is only worth something if every claim in it can be walked back to a real finding in the
   152-quest library. The QUEST STUDY LAW gate holds the .bq files to that; nothing held the research
   pages. A page that cites an id that does not exist is worse than no page: a builder trusts it.

   PROVES:
     1) every Qnnn.[WPXN]n id cited in questbook/research/ and questbook/designs/ RESOLVES in
        records/BOHEMIA_QUESTBOOK_LAW_INDEX.json (no invented ids),
     2) every research page cites >= 40 distinct ids from >= 20 distinct studies (a page, not a note),
     3) every design carries the shelf header (ACT, KIND, CRISIS, ECONOMY, PLACE, STATUS draft:true),
        sits on the shelf its ACT names (act1/act2/act3/across), and cites >= 4 ids from >= 3 studies
        with >= 1 flaw (X) id,
     4) no em dash in any of them (CLAUDE.md, never use em dashes),
     5) questbook/designs/INDEX.md is current: it lists every design and nothing else
        (regenerate: python3 tools/quests_designs_index.py),
     6) NEGATIVE CONTROLS: a planted invented id and a design missing its STATUS line are both caught.

   Run: node gates/quests_library_gate.js
   Registered in gates/bohemia_gates.py as QUESTS LIBRARY. */
'use strict';
var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var IDX = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'BOHEMIA_QUESTBOOK_LAW_INDEX.json'), 'utf8')).laws;
var RES = path.join(ROOT, 'questbook', 'research');
var DES = path.join(ROOT, 'questbook', 'designs');
var SHELVES = ['act1', 'act2', 'act3', 'across'];
var ID_RE = /\bQ\d{3}\.[WPXN]\d+\b/g;

var pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (cond) { pass++; } else { fail++; console.log('  FAIL ' + name + (detail ? '  ' + detail : '')); }
}

function ids(text) {
  var m = text.match(ID_RE) || [];
  var seen = {};
  m.forEach(function (i) { seen[i] = 1; });
  return Object.keys(seen);
}
function studies(list) {
  var s = {};
  list.forEach(function (i) { s[i.split('.')[0]] = 1; });
  return Object.keys(s).length;
}
function unresolved(list) { return list.filter(function (i) { return !IDX[i]; }); }

function checkDesign(rel, text) {
  var errs = [];
  var head = {};
  ['ACT', 'KIND', 'CRISIS', 'ECONOMY', 'PLACE', 'STATUS'].forEach(function (k) {
    var m = text.match(new RegExp('^' + k + ':\\s*(.+)$', 'm'));
    if (!m) errs.push('no ' + k + ' line'); else head[k] = m[1].trim();
  });
  if (head.STATUS && !/draft:true/.test(head.STATUS)) errs.push('STATUS is not draft:true');
  if (head.ECONOMY && !/^(boom|bust|either)\b/i.test(head.ECONOMY)) errs.push('ECONOMY not boom|bust|either');
  if (head.KIND && !/^(event|contract|main-beat|across-acts)\b/i.test(head.KIND)) errs.push('KIND unknown: ' + head.KIND);
  var shelf = rel.split('/')[0];
  if (head.ACT) {
    var a = head.ACT;
    var want = /->|across/i.test(a) ? 'across' : ('act' + (a.match(/[123]/) || ['?'])[0]);
    if (shelf !== want) errs.push('ACT "' + a + '" but filed on ' + shelf);
  }
  var l = ids(text);
  if (l.length < 4) errs.push('cites ' + l.length + ' ids (< 4)');
  if (studies(l) < 3) errs.push('cites ' + studies(l) + ' studies (< 3)');
  if (!l.some(function (i) { return /\.X\d+$/.test(i); })) errs.push('no flaw (X) id');
  var bad = unresolved(l);
  if (bad.length) errs.push('unresolved ids: ' + bad.join(' '));
  if (text.indexOf('—') >= 0) errs.push('em dash');
  return errs;
}

// 1-2) research pages
var pages = fs.existsSync(RES) ? fs.readdirSync(RES).filter(function (f) { return /\.md$/.test(f); }) : [];
ok('research: at least one page exists', pages.length > 0);
pages.forEach(function (f) {
  var t = fs.readFileSync(path.join(RES, f), 'utf8');
  var l = ids(t);
  var bad = unresolved(l);
  ok('research ' + f + ': every id resolves', bad.length === 0, bad.slice(0, 12).join(' '));
  ok('research ' + f + ': >= 40 ids', l.length >= 40, 'has ' + l.length);
  ok('research ' + f + ': >= 20 studies', studies(l) >= 20, 'has ' + studies(l));
  ok('research ' + f + ': no em dash', t.indexOf('—') < 0);
});

// 3-4) designs
var designs = [];
SHELVES.forEach(function (s) {
  var d = path.join(DES, s);
  if (!fs.existsSync(d)) return;
  fs.readdirSync(d).filter(function (f) { return /^QD_.*\.md$/.test(f); }).forEach(function (f) { designs.push(s + '/' + f); });
});
var stray = fs.existsSync(DES) ? fs.readdirSync(DES).filter(function (f) { return /^QD_/.test(f); }) : [];
ok('designs: none left off a shelf', stray.length === 0, stray.join(' '));
ok('designs: at least one design exists', designs.length > 0);
designs.forEach(function (rel) {
  var errs = checkDesign(rel, fs.readFileSync(path.join(DES, rel), 'utf8'));
  ok('design ' + rel, errs.length === 0, errs.join('; '));
});

// 5) the shelf index is current
var idxPath = path.join(DES, 'INDEX.md');
var idxText = fs.existsSync(idxPath) ? fs.readFileSync(idxPath, 'utf8') : '';
var listed = (idxText.match(/\((?:act1|act2|act3|across)\/QD_[^)]+\.md\)/g) || []).map(function (s) { return s.slice(1, -1); });
var missing = designs.filter(function (d) { return listed.indexOf(d) < 0; });
var ghost = listed.filter(function (d) { return designs.indexOf(d) < 0; });
ok('designs INDEX.md lists every design', missing.length === 0, missing.join(' '));
ok('designs INDEX.md lists nothing that is gone', ghost.length === 0, ghost.join(' '));

// 6) negative controls: the checks can fail
var fake = 'Q001.W4 Q002.W1 Q003.W1 Q004.X999999';
ok('control: an invented id is caught', unresolved(ids(fake)).indexOf('Q004.X999999') >= 0);
var planted = 'ACT: 1\nKIND: contract\nCRISIS: none\nECONOMY: bust\nPLACE: a pump house\n`Q001.W1` `Q002.W1` `Q003.W1` `Q001.X1`';
ok('control: a design with no STATUS line is caught', checkDesign('act1/QD_Z99_X.md', planted).some(function (e) { return /STATUS/.test(e); }));
ok('control: a design on the wrong shelf is caught', checkDesign('act3/QD_Z99_X.md', planted + '\nSTATUS: draft:true').some(function (e) { return /filed on/.test(e); }));

console.log('quests_library_gate: ' + pass + ' pass, ' + fail + ' fail (' + pages.length + ' pages, ' + designs.length + ' designs)');
process.exit(fail ? 1 : 0);
