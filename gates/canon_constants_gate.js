/* ============================================================================
   CANON CONSTANTS GATE (8/5/26, LAB lane)

   Registry: records/BOHEMIA_CANON_CONSTANTS.md

   WHY THIS EXISTS, AND WHY IT IS NOT THE MACHINE I PROMISED. Yesterday's canon-rot gate
   proved every citation across 757 canon documents RESOLVES. I said the next machine
   would prove they AGREE. I built that sweep today and it does not work: it flagged six
   numeric disagreements across fourteen quantities and ALL SIX WERE FALSE POSITIVES --
   Skyrim's 37 km2 read as our 37 km2 built, a questbook corpus quote about "FOUR
   CURRENCIES" read as a Bohemia claim, a 7/10 pre-ruling recommendation of "10-15% lit"
   read as a conflict with the locked 12%, and three different measurements in one table
   read as three answers to one question.

   THE ROOT PROBLEM IS NOT THE REGEX, IT IS THAT PROSE NUMBERS ARE SUBJECT-BLIND. "37 km2"
   is Skyrim in one file and our built area in another, and the difference lives in the
   meaning, not the text. A gate on that sweep would cry wolf every run, which this repo
   has already paid for nine times over.

   SO THE FIX IS THE OPPOSITE OF A SMARTER SWEEP: DECLARE THE CONSTANTS. A declared number
   carries its subject, so a machine can check it. This gate does exactly that and nothing
   more -- it makes no attempt to judge narrated numbers, on purpose.

   WHAT IT PROVES
     1. Every declared value is REALLY IN the law it cites. The registry cannot drift from
        canon in either direction: change the law and this goes red, or fudge the registry
        and this goes red.
     2. Every cited source exists.
     3. The registry declares itself SUBORDINATE to the laws. It is an index, never the
        authority, and it has to keep saying so.
     4. The honest limits stay written down, including that the semantic sweep failed and
        why -- so the next session does not spend a day rebuilding it.
     5. No shipped engine module contradicts a declared constant.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const REG = 'records/BOHEMIA_CANON_CONSTANTS.md';

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('CANON CONSTANTS GATE — fourteen locked numbers, one declared home,');
console.log('                       each one proved against the law that says it');
console.log('='.repeat(74));

ok('A1 the registry exists', fs.existsSync(path.join(ROOT, REG)));
if (!fs.existsSync(path.join(ROOT, REG))) process.exit(1);
const raw = fs.readFileSync(path.join(ROOT, REG), 'utf8');
const norm = raw.replace(/[*`]/g, '').replace(/\s+/g, ' ');

const block = (raw.match(/```constants([\s\S]*?)```/) || [, ''])[1];
const rows = block.trim().split('\n').filter(Boolean).map(l => l.split('|').map(s => s.trim()));
ok('A2 the machine block parses (' + rows.length + ' constants)', rows.length >= 10);
ok('A3 every row has all four fields (key | value | source | meaning)',
   rows.every(r => r.length === 4 && r[0] && r[1] && r[2] && r[3]));
ok('A4 no duplicate keys',
   new Set(rows.map(r => r[0])).size === rows.length);

/* ---- 1 + 2. THE VALUE MUST REALLY BE IN THE LAW IT CITES ------------------- */
/* Matched against the source's TEXT, tolerant of thousands separators and of a trailing
   .0, because a law writes "12,288" and "37.0" where the registry stores 12288 and 37.0.
   Deliberately NOT tolerant of a different number: that is the whole point. */
let missingSrc = [], notInSrc = [];
rows.forEach(([key, val, src]) => {
  const p = path.join(ROOT, src);
  if (!fs.existsSync(p)) { missingSrc.push(key + ' -> ' + src); return; }
  const text = fs.readFileSync(p, 'utf8');
  const n = parseFloat(val);
  const forms = new Set([val, String(n)]);
  if (Number.isInteger(n) && n >= 1000) forms.add(n.toLocaleString('en-US'));  /* 12,288 */
  if (Number.isInteger(n)) forms.add(n + '.0');                                 /* 37.0   */
  const hit = [...forms].some(f => text.indexOf(f) >= 0);
  if (!hit) notInSrc.push(key + '=' + val + ' not found in ' + src);
});
ok('B1 every cited source file exists' +
   (missingSrc.length ? ' -> ' + missingSrc.join('; ') : ''), missingSrc.length === 0);
ok('B2 every declared value is actually present in the law it cites' +
   (notInSrc.length ? ' -> ' + notInSrc.slice(0, 4).join('; ') : ''), notInSrc.length === 0);

/* THE CONSTANTS THAT MUST BE THERE. A registry that silently loses the beat or the
   currency count is worse than none, so the load-bearing keys are named. */
const need = ['CELLS_PER_SIDE', 'TILES_PER_CELL_SIDE', 'METRES_PER_TILE', 'BEAT_SECONDS',
              'BPM', 'LIT_PERCENT', 'CURRENCIES', 'GENERATIONS'];
const have = new Set(rows.map(r => r[0]));
const gone = need.filter(k => !have.has(k));
ok('B3 the load-bearing constants are all declared' +
   (gone.length ? ' -> missing ' + gone.join(', ') : ''), gone.length === 0);

/* AND THE ARITHMETIC HAS TO CLOSE. 96 x 128 = 12,288 is the one relationship in here that
   a lane could break by changing one number and not the other. */
const get = k => parseFloat((rows.find(r => r[0] === k) || [])[1]);
ok('B4 the grid arithmetic closes: CELLS_PER_SIDE x TILES_PER_CELL_SIDE = FINE_TILES_PER_SIDE (' +
   get('CELLS_PER_SIDE') + ' x ' + get('TILES_PER_CELL_SIDE') + ' = ' + get('FINE_TILES_PER_SIDE') + ')',
   get('CELLS_PER_SIDE') * get('TILES_PER_CELL_SIDE') === get('FINE_TILES_PER_SIDE'));
ok('B5 and the metric one does too: FINE_TILES x METRES_PER_TILE squared ~ VALLEY_KM2 (' +
   ((get('FINE_TILES_PER_SIDE') * get('METRES_PER_TILE')) ** 2 / 1e6).toFixed(1) + ' vs ' +
   get('VALLEY_KM2') + ')',
   Math.abs(((get('FINE_TILES_PER_SIDE') * get('METRES_PER_TILE')) ** 2 / 1e6) - get('VALLEY_KM2')) < 0.5);
ok('B6 built and on-foot are both inside the total',
   get('BUILT_KM2') < get('VALLEY_KM2') && get('ONFOOT_KM2') < get('VALLEY_KM2'));

/* ---- 3. THE REGISTRY IS SUBORDINATE, AND SAYS SO -------------------------- */
ok('C1 it states it is NEVER the authority and the law wins on conflict',
   /This registry is NEVER the authority/i.test(norm) &&
   /the law wins and this file is the thing that is\s*wrong/i.test(norm));
ok('C2 and that no number in it is new',
   /No number in this file is new/i.test(norm));

/* ---- 4. THE FAILURE THAT PRODUCED IT STAYS WRITTEN DOWN ------------------- */
/* This is the check that saves the next session a day. The finding is NEGATIVE -- the
   obvious machine cannot be built -- and negative findings are exactly what gets quietly
   deleted as "not a result". */
ok('D1 it records that the promised semantic sweep FAILED, and does not hide it',
   /I BUILT THAT SWEEP TODAY AND IT DOES NOT WORK/i.test(norm));
ok('D2 and the reason: prose numbers are subject-blind',
   /PROSE NUMBERS ARE SUBJECT-BLIND/i.test(norm));
ok('D3 and all six false positives are itemised rather than summarised away',
   /questbook corpus quote/i.test(norm) && /pre-ruling recommendation/i.test(norm) &&
   /different subjects/i.test(norm) && /different measurements in one table/i.test(norm));
ok('D4 and the good news is stated: zero real numeric contradictions in canon',
   /ZERO real numeric contradictions/i.test(norm));
ok('D5 and it warns the next session off rebuilding it',
   /do not spend a day trying/i.test(norm));
ok('D6 the deliberate omissions are explained, not left looking like oversights',
   /WHAT I LEFT OUT, AND WHY/i.test(norm) && /A range is not a value/i.test(norm) &&
   /not a\s*constant/i.test(norm));

/* ---- 5. NO SHIPPED CODE CONTRADICTS A DECLARED CONSTANT ------------------- */
/* Scoped to constants whose NAME appears as an identifier in code, so this checks a
   declaration against a declaration and never against narrated prose -- the same
   discipline the rest of the gate is built on. */
function walk(dir, out) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, f.name);
    if (f.isDirectory()) { walk(rel, out); continue; }
    if (/\.js$/.test(f.name)) out.push(rel);
  }
  return out;
}
const code = walk('engine', []);

/* ★ STRIP COMMENTS BEFORE READING DECLARATIONS, and require a real declaration keyword.
   The first version of E1 flagged engine/bohemia_engine.js for "BPM=2" -- which is a
   COMMENT on line 139 explaining that "120 BPM = 2 beats/second", while the actual
   declaration on line 144 is `const BPM = 120` and agrees perfectly.

   So the gate built entirely around "a DECLARED number carries its subject, a NARRATED one
   does not" read narration as declaration on its first run. Same bug family as the other
   nine in this repo, and the joke is that avoiding it was the gate's whole premise. The
   fix is structural: comments out, and only const/let/var/property forms count.
   MUTATION FOUND WHICH HALF ACTUALLY DOES THE WORK: reverting the comment-stripping alone
   does NOT bring the false positive back, because the comment says a bare "BPM = 2" and the
   DECLARATION-FORM requirement already rejects it. So the form requirement is the fix and
   the comment-stripping is defence in depth. Both stay -- but the note is here so nobody
   later removes the form requirement believing decomment() is carrying it. */
const decomment = (t) => t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
let clash = [];
rows.forEach(([key, val]) => {
  code.forEach(f => {
    const src = decomment(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    const re = new RegExp('(?:const|let|var)\\s+' + key + '\\s*=\\s*([0-9.]+)|' +
                          '\\b' + key + '\\s*:\\s*([0-9.]+)', 'g');
    let m;
    while ((m = re.exec(src)) !== null) {
      const got = m[1] !== undefined ? m[1] : m[2];
      if (parseFloat(got) !== parseFloat(val)) {
        clash.push(f + ': ' + key + '=' + got + ', registry says ' + val);
      }
    }
  });
});
ok('E1 no engine module declares a constant that disagrees with the registry (' +
   code.length + ' modules swept)' + (clash.length ? ' -> ' + clash.slice(0, 3).join('; ') : ''),
   clash.length === 0);

console.log('='.repeat(74));
console.log('  CANON CONSTANTS GATE: ' + pass + ' pass / ' + fail + ' fail   (' +
            rows.length + ' constants, all proved against source)');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
