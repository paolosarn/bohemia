/* THE ONE STOPWATCH -- ONE NUMBER FOR THE LOAD, FROM ONE INSTRUMENT, ON HIS PHONE'S PROFILE
   (PLUMBER 10/17, VAMILY row [the one stopwatch]; rule 94's poka-yoke; rule 90 round 6: the release
   line's first line is TIME TO PLAY and it needs ONE number from ONE instrument)
   ================================================================================
   WHY: four lanes quoted four load numbers for the same demo (85, 67, 48, 22 s) and he could not
   tell which one was the demo. Each was true of a different instrument, a different build, or a
   different box. The door read 50.9, 29.9, 31.7 and 20.0 on four runs of ONE instrument across two
   builds: one run is not a number.

   WHAT IT DOES: opens the COMMITTED demo (slices/BOHEMIA_DEMO.html, the file RUN cuts) in a fresh
   browser, served like GitHub Pages, on the 4x throttled phone profile, N times, through
   tools/bohemia_first_load.js (the instrument the FIRST LOAD gate already holds), and keeps:
       the title on screen         (ms since the tap)
       the door: NEW GAME ready    (__LOAD_READY: the loading bar goes, NEW GAME is live)
       bytes before the door, and what loads AFTER it (bytes and files)
   It reports the MEDIAN and the spread (low to high) over the N readings, and writes ONE line and
   the readings behind it to records/target/BOHEMIA_THE_ONE_STOPWATCH.json, stamped with the demo's
   BUILD stamp and its file hash, so the number can never be quoted against a different cut.

   THE LINE (the only load number any lane quotes; the gate refuses the others):
       THE DEMO (BUILD 10/13b, demo abcd1234): title 3.4 s, the door (NEW GAME ready) 13.0 s on the
       4x phone profile, median of 5 (11.8 to 14.2); 3.4 MB before the door, 20.1 MB in 31 files in the 20 s after it.

   RUN re-cuts the demo and runs this in the same commit; a stale stopwatch (the demo changed, the
   number did not) is red in the gate until somebody runs it.

   node tools/bohemia_one_stopwatch.js [readings=5]
   ================================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DEMO = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
const OUT = path.join(ROOT, 'records/target/BOHEMIA_THE_ONE_STOPWATCH.json');
const THROTTLE = 4;
const LINGER_MS = 20000;              /* how long the page stays open after the door, to see what loads behind it */

function demoIdentity() {
  const txt = fs.readFileSync(DEMO, 'utf8');
  const m = /id="buildstamp"[^>]*>([^<]{3,80})</.exec(txt) || /BUILD\s+\d{1,2}\/\d{1,2}[a-z]?[^<"]{0,60}/.exec(txt);
  const stamp = m ? (m[1] || m[0]).trim() : 'no stamp found';
  const hash = crypto.createHash('sha1').update(txt).digest('hex').slice(0, 8);
  return { stamp, hash };
}

const median = a => { const s = a.filter(x => x != null).sort((x, y) => x - y); if (!s.length) return null;
  const mid = s.length >> 1; return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2; };
const sec = ms => ms == null ? 'never' : (ms / 1000).toFixed(1);
const mb = b => b == null ? '?' : (b / 1048576).toFixed(1);

function lineFor(r) {
  return 'THE DEMO (' + r.demo.stamp + ', demo ' + r.demo.hash + '): title ' + sec(r.median.titleMs) + ' s, the door (NEW GAME ready) '
    + sec(r.median.doorMs) + ' s on the ' + r.throttle + 'x phone profile, median of ' + r.readings.length
    + ' (' + sec(r.spread.doorMs[0]) + ' to ' + sec(r.spread.doorMs[1]) + '); ' + mb(r.median.bytesBeforeDoor) + ' MB before the door, '
    + mb(r.median.bytesAfterDoor) + ' MB in ' + r.median.filesAfterDoor + ' files in the ' + (LINGER_MS / 1000) + ' s after it.';
}

async function measure(n) {
  const { readOnce } = require(path.join(__dirname, 'bohemia_first_load.js'));
  const { open } = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));
  const readings = [];
  for (let i = 0; i < n; i++) {
    const r = await readOnce(open, { throttle: THROTTLE, linger: LINGER_MS });
    const after = r.bytesAll != null && r.bytesBeforeReady != null ? r.bytesAll - r.bytesBeforeReady : null;
    readings.push({ titleMs: r.title, buttonsMs: r.buttons, doorMs: r.ready, firstPaintMs: r.fcp,
      bytesBeforeDoor: r.bytesBeforeReady, bytesAfterDoor: after, filesAfterDoor: (r.filesAll != null && r.filesBeforeReady != null) ? r.filesAll - r.filesBeforeReady : null,
      bytesAll: r.bytesAll, twice: r.twice.length, errors: r.errs });
    console.log('  reading ' + (i + 1) + '/' + n + ': title ' + sec(r.title) + ' s, door ' + sec(r.ready) + ' s, ' + mb(r.bytesBeforeReady) + ' MB before, ' + mb(after) + ' MB after');
  }
  return readings;
}

async function main() {
  const n = Math.max(1, +process.argv[2] || 5);
  const demo = demoIdentity();
  console.log('THE ONE STOPWATCH: ' + demo.stamp + ' (demo ' + demo.hash + '), ' + n + ' readings at ' + THROTTLE + 'x, served like Pages\n');
  const readings = await measure(n);
  const pick = k => readings.map(r => r[k]);
  const r = {
    what: 'THE ONE STOPWATCH: the only load number any lane quotes. Written by tools/bohemia_one_stopwatch.js (PLUMBER, row [the one stopwatch]).',
    why: 'Four lanes quoted four load numbers (85, 67, 48, 22 s) for one demo. One instrument, one profile, several readings, one line.',
    instrument: 'tools/bohemia_first_load.js readOnce: a fresh browser, cold cache, no service worker, served like GitHub Pages, nobody touching the glass',
    throttle: THROTTLE, lingerMs: LINGER_MS, taken: new Date().toISOString(), demo,
    median: { titleMs: median(pick('titleMs')), doorMs: median(pick('doorMs')), bytesBeforeDoor: median(pick('bytesBeforeDoor')),
      bytesAfterDoor: median(pick('bytesAfterDoor')), filesAfterDoor: median(pick('filesAfterDoor')) },
    spread: { titleMs: [Math.min(...pick('titleMs').filter(x => x != null)), Math.max(...pick('titleMs').filter(x => x != null))],
      doorMs: [Math.min(...pick('doorMs').filter(x => x != null)), Math.max(...pick('doorMs').filter(x => x != null))] },
    readings,
  };
  r.line = lineFor(r);
  fs.writeFileSync(OUT, JSON.stringify(r, null, 1) + '\n');
  console.log('\n  ' + r.line + '\n  written: ' + path.relative(ROOT, OUT));
  return r;
}

module.exports = { demoIdentity, lineFor, median, OUT, DEMO };

if (require.main === module) main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
