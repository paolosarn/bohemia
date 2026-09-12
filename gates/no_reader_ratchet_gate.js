/* BOHEMIA -- NO-READER RATCHET GATE  (EYES AND EARS, E11 [pixels only], 9/6/26)
 *
 * WHAT IT HOLDS
 *   A ruling of Paolo's is STRANDED when nothing the shipped game loads can turn
 *   it into a value without a human looking at it. tools/bohemia_eyes_no_reader.py
 *   counts four kinds of that. This gate does not re-count them (the sweep takes
 *   75 seconds and the suite has 543 gates to get through). It holds the RATCHET:
 *
 *       every frozen number may go DOWN and may never go UP
 *
 *   E3 measured why: a checker that fails on absolute badness gets muted inside a
 *   week; a checker that fails only on GROWTH survives, because green means
 *   "you did not make it worse", which is a claim a team can actually keep.
 *
 * THE STALENESS CHECK, AND WHY IT IS NOT OPTIONAL
 *   This gate reads a result file somebody else wrote. A result file from before
 *   the last ship is a green light for a game that no longer exists, which is
 *   worse than no gate at all. So it re-measures ONE cheap thing itself: the total
 *   byte size of the reader set (17 files, one stat each). If that moved, the
 *   shipped bundle moved, the saved result is stale, and this gate goes RED and
 *   says re-run the sweep. It never trusts a number it cannot date.
 *
 * RULE ZERO (E9): a zero needs a positive control. --selftest proves the gate
 *   actually fails on a grown count and on a stale result, rather than passing
 *   because it read nothing.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const RESULT = path.join(ROOT, 'records', 'BOHEMIA_EYES_NO_READER_9_6_26.json');
const BASE = path.join(ROOT, 'records', 'BOHEMIA_EYES_NO_READER_BASELINE_9_6_26.json');

function readerBytes(result) {
  let n = 0;
  for (const rel of result.reader_set) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) return -1;
    n += fs.statSync(p).size;
  }
  return n;
}

function run(result, base) {
  const out = [];
  const ok = (name, good, detail) => out.push({ name, good, detail });

  // 1. the result must actually be about the game that is on disk right now.
  //
  //    FIXED THE MOMENT IT SHIPPED, AND THE FIX IS THE POINT OF THE GATE:
  //    the first cut demanded a BYTE-EXACT match and went red within a minute of
  //    landing, because another lane shipped 60 KB into the alpha between the
  //    measurement and the push. The lanes push to main about every thirteen
  //    minutes. A byte-exact staleness check is therefore red almost permanently,
  //    for everybody, over changes that are the same game -- which is precisely the
  //    false-alarm death school warned about, except worse, because it reds the
  //    whole fleet's suite over another lane's unrelated work.
  //
  //    So: drift is always PRINTED, and it only FAILS past 1% of the reader set
  //    (about 455 KB of the 45.5 MB the game fetches). That threshold is a
  //    judgement call and it is written down as one: under it the shipped bundle is
  //    the same game and the saved numbers still mean something; over it, the game
  //    has really moved and a green would be a green for something that no longer
  //    exists.
  const nowBytes = readerBytes(result);
  // THE RESULT'S OWN ANCHOR WINS. Dating the bundle against the BASELINE meant a
  //    re-run could never clear a stale flag: the sweep refreshed every count and the
  //    anchor it was compared against stayed frozen at 9/6. The baseline freezes COUNTS.
  const baseBytes = result.reader_set_stat_bytes || base.reader_set_stat_bytes;
  const drift = baseBytes ? Math.abs(nowBytes - baseBytes) / baseBytes : 1;
  const allThere = result.reader_set.every(r => fs.existsSync(path.join(ROOT, r)));
  ok('the saved sweep still describes the bundle on disk (drift under 1%)',
     allThere && drift <= 0.01,
     'reader set ' + result.reader_set.length + ' files, ' + nowBytes + ' bytes now, ' + baseBytes +
     ' when measured, drift ' + (drift * 100).toFixed(3) + '%' +
     (allThere && drift <= 0.01 ? '' : '  <- THE SHIPPED BUNDLE REALLY MOVED. re-run: python3 tools/bohemia_eyes_no_reader.py'));

  // 2. the ratchet -- ONLY on the two numbers that cannot grow from honest work.
  //    engine_orphan and laws_ungated BOTH grow legitimately (a lane writes a new
  //    module before wiring it; a lane writes a new law before anyone gates it), so
  //    ratcheting them would red the suite for other people's work in progress, and
  //    school's clearest warning was that a checker which cries wolf gets muted.
  //    They are REPORTED here, never ratcheted.
  for (const k of Object.keys(base.frozen)) {
    const now = result.counts[k], froze = base.frozen[k];
    ok('ratchet ' + k, now <= froze, now + ' now, ' + froze + ' frozen' + (now < froze ? '  (went DOWN, good, lower the baseline)' : ''));
  }

  // 3. the sweep must have proved it bites, or its numbers mean nothing
  for (const k of (base.reported || [])) {
    out.push({ name: 'reported (not ratcheted) ' + k, good: true, detail: String(result.counts[k]) });
  }

  ok('the sweep declares its blind spots instead of counting them clean',
     Array.isArray(result.blind_spots) && result.blind_spots.length >= 3,
     (result.blind_spots || []).length + ' blind spots written down');
  ok('the ignore list is in the open, not hidden in the tool',
     Array.isArray(result.ignore_list) && result.ignore_list.length >= 1,
     (result.ignore_list || []).join(' | '));
  return out;
}

function selftest() {
  const result = JSON.parse(fs.readFileSync(RESULT, 'utf8'));
  const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
  const grown = JSON.parse(JSON.stringify(result));
  grown.counts.banks_orphan = base.frozen.banks_orphan + 1;
  const a = run(grown, base).find(r => r.name === 'ratchet banks_orphan');
  // the anchor now lives in the RESULT, so the stale case has to move with it, or the
  // selftest proves the gate bites on a field the gate no longer reads. (9/12, E17: the
  // selftest caught exactly that the moment the anchor moved, which is what it is for.)
  const staleResult = JSON.parse(JSON.stringify(result));
  staleResult.reader_set_stat_bytes = 1;
  const staleBase = JSON.parse(JSON.stringify(base));
  staleBase.reader_set_stat_bytes = 1;
  const b = run(staleResult, staleBase).find(r => r.name.startsWith('the saved sweep still describes'));
  const checks = [
    ['one more stranded data bank than the baseline goes RED', a && !a.good],
    ['a result measured against a wholly different bundle goes RED', b && !b.good],
  ];
  console.log('SELFTEST -- RULE ZERO: a zero needs a positive control');
  let ok = true;
  for (const [n, good] of checks) { console.log((good ? '   PASS  ' : '   FAIL  ') + n); ok = ok && good; }
  return ok;
}

if (process.argv.includes('--selftest')) process.exit(selftest() ? 0 : 1);

if (!fs.existsSync(RESULT) || !fs.existsSync(BASE)) {
  console.log('=== NO-READER RATCHET GATE: 0 passed, 1 failed ===');
  console.log('    no sweep result on disk. run: python3 tools/bohemia_eyes_no_reader.py');
  process.exit(1);
}
if (!selftest()) { console.log('=== NO-READER RATCHET GATE: 0 passed, 1 failed ===\n    the gate cannot prove it bites, so its green would mean nothing'); process.exit(1); }
const result = JSON.parse(fs.readFileSync(RESULT, 'utf8'));
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
const rows = run(result, base);
const bad = rows.filter(r => !r.good);
for (const r of rows) console.log('    ' + (r.good ? 'ok   ' : 'FAIL ') + r.name + '  --  ' + r.detail);
console.log('=== NO-READER RATCHET GATE: ' + (rows.length - bad.length) + ' passed, ' + bad.length + ' failed ===');
console.log('    a ruling nobody can read is a ruling that gets asked again. these numbers only go down.');
process.exit(bad.length ? 1 : 0);
