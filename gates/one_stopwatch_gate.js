#!/usr/bin/env node
/* ============================================================================
   THE ONE STOPWATCH -- ONE NUMBER FOR THE LOAD, AND EVERY OTHER NUMBER IS REFUSED
   (10/17/26, PLUMBER lane, VAMILY row [the one stopwatch]; rule 94's poka-yoke; rule 90 round 6)

   WHY: four lanes quoted four load numbers for one demo (85, 67, 48, 22 s) and Paolo could not tell
   which was the demo. Each was true of a different instrument, build or box. tools/bohemia_one_stopwatch.js
   now opens the COMMITTED demo on the 4x phone profile several times through the one instrument and
   writes ONE line to records/target/BOHEMIA_THE_ONE_STOPWATCH.json, stamped with the demo's build
   stamp and file hash. This gate makes that line the only one.

   LEGS
     W1  the stopwatch file parses, carries at least three readings, a median, the demo's stamp and hash.
     W2  THE NUMBER IS OF THIS DEMO: the hash in the file is the hash of slices/BOHEMIA_DEMO.html on
         disk. A re-cut demo with last cut's number is STALE and red; the fix is the one command. RUN
         runs it in the same commit as a cut.
     W3  THE SPREAD IS A SPREAD: the readings' low and high are within 60% of each other; wider than
         that, one run was broken and the median is not a number yet (re-run).
     W4  NO OTHER NUMBER: a load number quoted where the fleet reads it -- THE DEPLOY LINE on the front
         page, the LIVE cue rows of BUILD_CALLING_SCRIPT.md, the first block of 00_START_HERE_NEXT_SESSION.md, and every
         commit message on main since the stopwatch was taken -- names the door, the title or NEW GAME
         with a time in seconds that disagrees with the stopwatch (title within 1.0 s, door within 20%)
         is red with the line that said it. History older than the stopwatch is not held; this is a
         fence forward.
     S1  SELF-TEST both ways on planted lines: "the door at 85 s" is refused, "the door 9.1 s" passes,
         a BEGIN or walk number is not this stopwatch's and is not held.

     node gates/one_stopwatch_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const FILE = path.join(ROOT, 'records/target/BOHEMIA_THE_ONE_STOPWATCH.json');
const DEMO = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
const CMD = 'node tools/bohemia_one_stopwatch.js 5';

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

/* a load number in prose: "<the door|title|NEW GAME ready|the load> ... 12.3 s" or "12.3 s to the door" */
const LOAD_WORDS = /(the door|NEW GAME( is)? (ready|live)|the title|time to (the )?(door|title)|first load|the load\b)/i;
const NUM_S = /(\d+(?:\.\d+)?)\s*(?:s|sec|secs|seconds)\b/g;
function loadNumbers(text) {
  const out = [];
  for (const sentence of text.split(/(?<=[.;|])\s|\n/)) {
    if (!LOAD_WORDS.test(sentence)) continue;
    if (/BEGIN|walk|fps|frame|stall|freeze|five minutes/i.test(sentence) && !/the door|the title|NEW GAME/i.test(sentence)) continue;
    let m;
    NUM_S.lastIndex = 0;
    while ((m = NUM_S.exec(sentence))) {
      const n = +m[1];
      /* the load word has to sit NEAR the number (45 characters either side): "0.9 s ... his body before the
         door" is a draw time that happens to share a sentence with the door, not a door time */
      const near = sentence.slice(Math.max(0, m.index - 45), m.index + m[0].length + 45);
      if (!LOAD_WORDS.test(near)) continue;
      const what = /title/i.test(near) && !/door|NEW GAME/i.test(near) ? 'title' : 'door';
      out.push({ n, what, line: sentence.trim().slice(0, 160) });
    }
  }
  return out;
}
function disagreements(text, sw) {
  const title = sw.median.titleMs / 1000, door = sw.median.doorMs / 1000;
  return loadNumbers(text).filter(x => x.what === 'title' ? Math.abs(x.n - title) > 1.0 : Math.abs(x.n - door) > 0.2 * door);
}

(function main() {
  process.chdir(ROOT);
  console.log('\nTHE ONE STOPWATCH -- one number for the load, every other number refused (rule 94, rule 90 round 6)\n');
  let sw = null;
  try { sw = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) {
    ok('W1 the stopwatch file parses (' + path.relative(ROOT, FILE) + ')', false, String(e.message).slice(0, 120) + '\n         Run: ' + CMD);
    console.log('\n=== THE ONE STOPWATCH GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    process.exit(1);
  }
  const readings = Array.isArray(sw.readings) ? sw.readings : [];
  const whole = sw.median && sw.median.doorMs != null && sw.median.titleMs != null && sw.demo && sw.demo.hash && sw.demo.stamp;
  ok('W1 the stopwatch carries ' + readings.length + ' readings, a median, the demo\'s stamp and hash', whole && readings.length >= 3,
    'a number from fewer than three readings is one run, and one run is not a number (the door read 50.9, 29.9, 31.7, 20.0 on four runs). Run: ' + CMD);
  if (whole) console.log('       ' + sw.line);

  let hash = '';
  try { hash = crypto.createHash('sha1').update(fs.readFileSync(DEMO, 'utf8')).digest('hex').slice(0, 8); } catch (e) {}
  ok('W2 THE NUMBER IS OF THIS DEMO: the stopwatch hash (' + (sw.demo && sw.demo.hash) + ') is the committed demo\'s (' + hash + ')', !!hash && sw.demo && sw.demo.hash === hash,
    'STALE: the demo was re-cut and the number is last cut\'s. RUN runs the stopwatch in the same commit as a cut: ' + CMD);

  const doors = readings.map(r => r.doorMs).filter(x => x != null);
  const lo = Math.min(...doors), hi = Math.max(...doors);
  ok('W3 THE SPREAD IS A SPREAD: the door read ' + (lo / 1000).toFixed(1) + ' to ' + (hi / 1000).toFixed(1) + ' s over ' + doors.length + ' readings (high within 60% of low)',
    doors.length >= 3 && hi <= lo * 1.6, 'one reading is broken, not slow; re-run: ' + CMD);

  /* W4 */
  const since = sw.taken || '2026-10-17T00:00:00Z';
  let where = [];
  const add = (name, text) => { if (text) where.push([name, text]); };
  try {
    const v = fs.readFileSync(path.join(ROOT, 'VAMILY.md'), 'utf8').split('\n');
    add('VAMILY.md THE DEPLOY LINE', v.find(l => l.startsWith('THE DEPLOY LINE')) || '');
  } catch (e) {}
  try { /* the calling script's LIVE cue rows (not LANDED, not SCRUB); its reports under them are history */
    const rows = fs.readFileSync(path.join(ROOT, 'BUILD_CALLING_SCRIPT.md'), 'utf8').split('\n')
      .filter(l => /^CUE /.test(l) && !/STATE:\s*(LANDED|SCRUB)/.test(l));
    add('BUILD_CALLING_SCRIPT.md live cues', rows.join('\n')); } catch (e) {}
  try { add('00_START_HERE first block', fs.readFileSync(path.join(ROOT, '00_START_HERE_NEXT_SESSION.md'), 'utf8').split('\n\n')[0]); } catch (e) {}
  try {
    const log = execFileSync('git', ['log', '--since=' + since, '--format=%h %s%n%b%x00'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    for (const c of log.split('\x00')) if (c.trim()) add('commit ' + c.trim().slice(0, 7), c);
  } catch (e) {}
  const bad = [];
  if (whole) for (const [name, text] of where) for (const d of disagreements(text, sw)) bad.push(name + ': "' + d.line + '" (' + d.n + ' s is not the stopwatch\'s ' + (d.what === 'title' ? (sw.median.titleMs / 1000).toFixed(1) : (sw.median.doorMs / 1000).toFixed(1)) + ')');
  ok('W4 NO OTHER NUMBER: the deploy line, the calling script, the handoff\'s first block and ' + Math.max(0, where.length - 3) + ' commits since the stopwatch quote no door or title time but the stopwatch\'s (' + bad.length + ' do)',
    !bad.length, bad.slice(0, 8).join('\n         ') + '\n         The only load number is the stopwatch\'s line; re-run it (' + CMD + ') rather than quoting another instrument.');

  /* S1 */
  const fake = { median: { titleMs: 1400, doorMs: 9100 } };
  const refused = disagreements('the door opens at 85 s at 4x on his phone.', fake).length === 1;
  const passes = disagreements('the door (NEW GAME ready) 9.1 s on the 4x phone profile; the title 1.4 s.', fake).length === 0;
  const notHeld = disagreements('BEGIN at 4x about 11.5 s; the walk at 40.6 fps with a 9.1 s freeze.', fake).length === 0;
  const titleRefused = disagreements('the title shows at 3.4 s.', fake).length === 1;
  ok('S1 "the door at 85 s" is refused, the stopwatch\'s own line passes, a BEGIN or walk number is not held, a wrong title time is refused',
    refused && passes && notHeld && titleRefused, JSON.stringify([refused, passes, notHeld, titleRefused]));

  console.log('\n=== THE ONE STOPWATCH GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
