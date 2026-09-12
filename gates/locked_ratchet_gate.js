/* BOHEMIA -- LOCKED-RULING RATCHET GATE  (EYES AND EARS, E17 [locked ignored], 9/12/26)
 *
 * WHAT IT HOLDS
 *   EROSION: a ruling of Paolo's marked LOCKED that the shipped game contradicts, with
 *   no newer ruling anywhere in laws/ releasing it. tools/bohemia_eyes_locked.py finds
 *   them. This gate does not re-find them -- that sweep decodes 9,556 tile pictures and
 *   drives a real browser, which is minutes, and the suite has 600 gates to get through.
 *   It holds the one thing that cannot grow from honest work:
 *
 *       EROSION may go DOWN and may never go UP.
 *
 *   DRIFT and NOT-BUILT are deliberately NOT ratcheted. A law going stale because he
 *   ruled again is the system working, and a ruling about a feature nobody has built
 *   yet is not anybody's defect. Ratcheting either would red the fleet's suite over
 *   correct work, which is how a checker gets muted inside a week (E3 measured it).
 *
 * AND IT HOLDS THE CLASSIFIER HONEST TOO
 *   The sweep's headline numbers rest on a rules-based classifier that decides whether
 *   a line saying "locked" is a ruling at all. That classifier is scored against fifty
 *   lines read by hand, and the only clean score is sample C, read after the rules were
 *   last repaired. If C drops, every count above it is worth less, so C is floored.
 *
 * STALENESS, THE SAME WAY NO READER DOES IT
 *   This reads a result file somebody else wrote. A result from before the last ship is
 *   a green light for a game that no longer exists. So it re-measures one cheap thing:
 *   the byte size of the 17-file reader set. Printed always; RED past 1% drift, because
 *   the lanes push to main about every thirteen minutes and a byte-exact check would be
 *   permanently red over other people's unrelated work.
 *
 * RULE ZERO (E9): a zero needs a positive control. --selftest proves this gate goes red
 *   on grown erosion, on a dropped classifier score and on a stale result, rather than
 *   passing because it read nothing.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const RESULT = path.join(ROOT, 'records', 'BOHEMIA_EYES_LOCKED_9_12_26.json');
const BASE = path.join(ROOT, 'records', 'BOHEMIA_EYES_LOCKED_BASELINE_9_12_26.json');
const CLASSIFIER_FLOOR = 85;   /* sample C measured 90. one miss of twenty is the slack. */

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

  const bytes = readerBytes(result);
  const drift = bytes < 0 ? 1 : Math.abs(bytes - result.reader_bytes) / result.reader_bytes;
  ok('the saved sweep still describes the game on disk',
     bytes > 0 && drift <= 0.01,
     bytes < 0 ? 'a file the game loads is gone' :
       (drift * 100).toFixed(3) + '% byte drift across the 17 files the game fetches');

  ok('every control in the sweep passed',
     result.controls.every(c => c.pass),
     result.controls.filter(c => !c.pass).map(c => c.name).join('; ') || 'all ' + result.controls.length);

  const c = result.classifier_agreement && result.classifier_agreement.C;
  ok('the held-out classifier score holds',
     !!c && c.pct >= CLASSIFIER_FLOOR,
     c ? c.agree + ' of ' + c.n + ' hand-read lines (' + c.pct + '%), floor ' + CLASSIFIER_FLOOR : 'no held-out sample');

  ok('erosion has not grown',
     result.counts.erosion <= base.erosion,
     result.counts.erosion + ' now, frozen at ' + base.erosion +
     ' (drift ' + result.counts.drift + ' and not-built ' + result.counts.not_built + ' are not ratcheted, on purpose)');

  return out;
}

function report(rows) {
  let bad = 0;
  for (const r of rows) {
    if (!r.good) bad++;
    console.log((r.good ? '  ok   ' : '  RED  ') + r.name + ' -- ' + r.detail);
  }
  return bad;
}

if (process.argv.includes('--selftest')) {
  const result = JSON.parse(fs.readFileSync(RESULT, 'utf8'));
  const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
  const cases = [
    ['erosion grew by one', () => {
      const r = JSON.parse(JSON.stringify(result)); r.counts.erosion = base.erosion + 1; return [r, base];
    }],
    ['the held-out classifier score fell under the floor', () => {
      const r = JSON.parse(JSON.stringify(result)); r.classifier_agreement.C.pct = CLASSIFIER_FLOOR - 1; return [r, base];
    }],
    ['a control in the sweep failed', () => {
      const r = JSON.parse(JSON.stringify(result)); r.controls[0].pass = false; return [r, base];
    }],
    ['the saved result is stale', () => {
      const r = JSON.parse(JSON.stringify(result)); r.reader_bytes = Math.round(r.reader_bytes * 0.5); return [r, base];
    }],
  ];
  let fail = 0;
  for (const [name, make] of cases) {
    const [r, b] = make();
    const bad = run(r, b).filter(x => !x.good).length;
    console.log((bad > 0 ? '  BITES ' : '  BLIND ') + name);
    if (bad === 0) fail++;
  }
  const clean = run(result, base).filter(x => !x.good).length;
  console.log((clean === 0 ? '  PASSES' : '  WRONGLY RED') + ' the real result');
  if (clean !== 0) fail++;
  process.exit(fail === 0 ? 0 : 1);
}

if (!fs.existsSync(RESULT) || !fs.existsSync(BASE)) {
  console.log('RED: the locked sweep has never been run. node/python3 tools/bohemia_eyes_locked.py');
  process.exit(1);
}
const result = JSON.parse(fs.readFileSync(RESULT, 'utf8'));
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
const bad = report(run(result, base));
console.log(bad === 0
  ? 'LOCKED RATCHET ok -- ' + result.counts.his + " of his locks harvested, " + result.counts.checked +
    ' checked on the shipped surface, erosion ' + result.counts.erosion
  : 'LOCKED RATCHET RED -- ' + bad + ' check(s) failed');
process.exit(bad === 0 ? 0 : 1);
