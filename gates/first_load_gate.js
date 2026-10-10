/* ============================================================================
   FIRST LOAD -- THE TITLE IN TWO SECONDS, NEW GAME READY IN EIGHT, NOTHING TWICE
   (PLUMBER 10/9/26, row [first load], rule 66a, rule 72 release line 12)

   PAOLO 10/5: "I feel like I gotta wait 40 seconds for this shit to load."
   The demo, opened in a FRESH browser (a stranger's first visit: cold cache, no service
   worker yet), through the one driver with nobody touching the glass, on a phone-shaped
   CPU (4x throttle). Measured from inside the page, in ms since the tap on the link
   (tools/bohemia_first_load.js): the title on screen, its buttons on screen, and
   __LOAD_READY (the loading bar goes, NEW GAME is live).

   MEASURED 10/9, SERVED LIKE GITHUB PAGES (cache rules and gzip; tools/bohemia_drive_the_demo.js
   opts.pages): title 3.4 to 3.6 s, NEW GAME ready 83 to 86 s, 29.7 MB downloaded by then.
   Two things in RUN's page spend bytes before the player can start: a warm-up that pulls every
   map tile (20 MB) during the boot, written for a city that once loaded only on the first tap,
   and a build watcher that re-downloads the whole page (2.4 MB) 15 s in and every 2 minutes to
   read one line. A patch measured on a copy served in the page's place: 9.0 MB before ready,
   nothing twice. Handed to RUN as a review file (its file, its cut). THE READY TIME DID NOT
   MOVE: the wall is the processor (a CPU profile is in the record), not the download.
   AN EARLIER CUT OF THIS COUNT WAS WRONG: without caching rules the test server made every
   repeat request a full download, and the first reading said "everything twice, 69 MB".
   ROUND 2 (10/9), THE PROCESSOR: the boot's biggest cost is the skinner binding bodies it has
   already bound (1,256 binds before ready, 174 different). Four more hunks, bit for bit the same
   binding, take the page's own boot work from 13.0 s to 6.8 s at full speed; all six hunks are
   one command for RUN (tools/bohemia_first_load_hunks.py), and H1 below keeps them fitting.

   LEGS
     S1-S3  SELF-TEST on a planted page served in the demo's place: a title shown at once
            reads under a second; a page that declares itself ready at 1.5 s reads about
            1.5 s; a file fetched twice is caught, and a clean page has nothing twice.
     T1     the title is on screen within 2 s of the tap (rule 66a).
     T2     NEW GAME is ready within 8 s (the row's budget).
     D1     no file is downloaded twice before NEW GAME is ready (data: URLs are inline,
            not downloads). Timings on a shared box swing by a third run to run; whether
            a file arrived twice does not.
     R1     NEVER WORSE: the bytes before NEW GAME is ready stay under the ceiling (today's
            worst plus room; LOWER IT when the fixes land, never raise it).
     H1     THE HANDED-OVER HUNKS STILL FIT (round 2, no browser): tools/bohemia_first_load_hunks.py
            dry-runs on the alpha and every hunk either applies once or is already in. A hunk
            whose old text drifted is PLUMBER's to refresh, said here before RUN meets a refusal.
   It lands RED on purpose: T1, T2 and D1 are the gap between his 40 seconds and the
   budget, and green would be the lie. About two minutes.
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const F = require(path.join(ROOT, 'tools/bohemia_first_load.js'));

const TITLE_MS = 2000, READY_MS = 8000;
const CEIL_MB = 10;          /* 10/10 RUN [first load]: the hunks, the demo seated on the map, no 15 s build check and no first-visit reload: 3.2, 3.2 and 8.8 MB before ready at 4x over three runs (what lazy fetches land before ready swings), the worst +10%. Was 30. 10/9 round 3: the cut empties the frozen fight on the demo; 27.1 MB before ready at 4x served like Pages, +10%. Was 33 (29.7 before). RUN's hunks measured 9.0 MB: LOWER THIS again when they land */

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };
const sec = (ms) => ms == null ? 'never' : (ms / 1000).toFixed(1) + ' s';

const PLANT = (twice) => `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#000">
<div id="front"><div id="title" style="position:absolute;inset:0;background:#040705;color:#cfe9c4">
<div class="menu" style="position:absolute;left:16px;right:16px;bottom:40px;height:60px">NEW GAME</div></div></div>
<script>
  fetch('__fl_x.bin').then(r => r.arrayBuffer());
  ${twice ? "setTimeout(() => fetch('__fl_x.bin', { cache: 'no-store' }).then(r => r.arrayBuffer()), 300);" : ''}
  setTimeout(() => { window.__LOAD_READY = true; }, 1500);
</script></body></html>`;

(async () => {
  console.log('='.repeat(74));
  console.log('FIRST LOAD: the title in 2 s, NEW GAME ready in 8 s, nothing downloaded twice');
  console.log('='.repeat(74));

  /* ---- H1: the hunks handed to RUN still fit the page they were written for -------- */
  { const h = require('child_process').spawnSync('python3', [path.join(ROOT, 'tools/bohemia_first_load_hunks.py')], { encoding: 'utf8' });
    const rows = (h.stdout || '').split('\n').filter(l => /^\s+(applied|already in|REFUSED)/.test(l));
    /* the status is the first word of the row: a hunk's own words can say "already in" too (the warm-up's does) */
    ok('H1 the handed-over hunks still fit the alpha (' + rows.filter(l => /^\s+applied\s/.test(l)).length + ' to apply, '
       + rows.filter(l => /^\s+already in\s/.test(l)).length + ' already in)', h.status === 0 && rows.length >= 6,
       (h.stdout || '') + (h.stderr || '') + '\n         PLUMBER refreshes the hunk from the page as it is now (records/BOHEMIA_THE_CAST_BAKE_IS_A_THIRD_OF_THE_BOOT_10_9_26.md).'); }

  /* ---- S: planted pages ------------------------------------------------------ */
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'firstload-'));
  try {
    fs.writeFileSync(path.join(tmp, 'twice.html'), PLANT(true));
    fs.writeFileSync(path.join(tmp, 'once.html'), PLANT(false));
    /* random bytes: a planted file that compresses to nothing would slip under the 4 KB "real download" line */
    fs.writeFileSync(path.join(tmp, 'x.bin'), require('crypto').randomBytes(20000));
    const serve = (page) => ({ '/slices/BOHEMIA_DEMO.html': path.join(tmp, page), '/slices/__fl_x.bin': path.join(tmp, 'x.bin') });
    const a = await F.readOnce(open, { throttle: 1, serve: serve('twice.html'), wait: 15000 });
    ok('S1 a title shown at once reads under a second (' + sec(a.title) + ', buttons ' + sec(a.buttons) + ')',
       a.title != null && a.title < 1000 && a.buttons != null, JSON.stringify(a));
    ok('S2 a page ready at 1.5 s reads about 1.5 s (' + sec(a.ready) + ')', a.ready != null && a.ready >= 1400 && a.ready < 3500, JSON.stringify(a));
    const b = await F.readOnce(open, { throttle: 1, serve: serve('once.html'), wait: 15000 });
    ok('S3 a file fetched twice is caught (' + a.twice.map(t => t.url + ' x' + t.times).join(', ')
       + '), a clean page has nothing twice (' + b.twice.length + ')',
       a.twice.some(t => /__fl_x\.bin$/.test(t.url) && t.times === 2) && b.twice.length === 0, JSON.stringify({ a: a.twice, b: b.twice }));
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }

  /* ---- the demo, a stranger's first open, 4x CPU ----------------------------- */
  const r = await F.readOnce(open, { throttle: 4 });
  console.log('  ' + F.line(r) + ' | all: ' + (r.bytesAll / 1048576).toFixed(1) + ' MB');
  ok('T1 the title is on screen within ' + sec(TITLE_MS) + ' of the tap (' + sec(r.title) + ')',
     r.title != null && r.title <= TITLE_MS, 'rule 66a: the title paints within two seconds, the world loads behind it (RUN [first load] owns the order)');
  ok('T2 NEW GAME is ready within ' + sec(READY_MS) + ' (' + sec(r.ready) + ')', r.ready != null && r.ready <= READY_MS,
     'Paolo 10/5: "I gotta wait 40 seconds." The world must load behind the title, and the bytes it waits for must shrink. [bind once] takes about 20 s of it at this speed: python3 tools/bohemia_first_load_hunks.py --write (records/BOHEMIA_THE_CAST_BAKE_IS_A_THIRD_OF_THE_BOOT_10_9_26.md)');
  ok('D1 no file is downloaded twice before NEW GAME is ready (' + r.twice.length + ' files twice)', !r.twice.length,
     r.twice.slice(0, 12).map(t => t.url + ' x' + t.times + ' (' + t.mb + ' MB)').join('\n         ')
     + '\n         The fix is handed to RUN as one command: python3 tools/bohemia_first_load_hunks.py --write (records/BOHEMIA_WHY_THE_DEMO_MAKES_A_PHONE_WAIT_10_9_26.md)');
  const mbReady = r.bytesBeforeReady == null ? null : r.bytesBeforeReady / 1048576;
  ok('R1 NEVER WORSE: ' + (mbReady == null ? '?' : mbReady.toFixed(1)) + ' MB before NEW GAME is ready, ceiling ' + CEIL_MB + ' MB',
     mbReady != null && mbReady <= CEIL_MB, 'the page got heavier before the player can start. Lower the ceiling when it falls; never raise it.');
  if (mbReady != null && mbReady < CEIL_MB * 0.8) console.log('  NOTE: ' + mbReady.toFixed(1) + ' MB is well under the ceiling of ' + CEIL_MB + ': lower CEIL_MB in this gate to lock the win in.');

  console.log('\n=== FIRST LOAD GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  if (fail) console.log('    Red on purpose while the demo is slower than his budget (rule 66a). RUN orders the title; PLUMBER cuts the bytes.');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FIRST LOAD GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
