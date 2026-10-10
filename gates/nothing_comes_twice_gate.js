/* ==========================================================================
   NOTHING COMES TWICE  (RUN, 10/10/26, VAMILY [ten seconds to play], rule 94: the STOP block's restart gate)

   THE STOP (the coordinator, 10/10): on the 4x phone profile, five minutes of the 10/10l demo: "every city tile file
   02 to 09 DOWNLOADED TWICE ... the demo page RELOADING ITSELF at 76 s, 196 s and 316 s".
   THE CAUSE, MEASURED WITH THE BROWSER'S OWN NETWORK LOG, SERVED LIKE GITHUB PAGES (tools/bohemia_drive_the_demo.js
   pages + netlog, 400 s at 4x): each tile file crossed the wire ONCE, as the city frame's script; the second copy was
   the shell's warm-up (__TILE_WARM__) fetching the same file after the city frame already had it, answered from the
   cache, 0 bytes on the wire but a 25 MB re-read on the phone's processor; and the "reloads" were the build watcher
   reading the demo page to its stamp every two minutes and cancelling (128, 32 and 151 KB on the wire). The
   five-minutes tool counts every response at its size on disk, so both read as whole downloads.
   NOW: the warm-up stops the moment there is a city frame; the demo's watcher reads BOHEMIA_DEMO_STAMP.txt (one
   line the cut writes beside the demo), never the page.

   LEGS, on the demo served like Pages, the browser's own network log, 135 s (one watcher check):
     N1 *** NO FILE IS FETCHED BY SCRIPT THAT THE PAGE ALREADY LOADED *** (the warm-up's re-reads)
     N2 *** NOTHING CROSSES THE WIRE TWICE ***
     N3 *** THE DEMO PAGE IS REQUESTED ONCE *** (the watcher's check reads the stamp file)
     N4 the stamp file is read and says the demo's own stamp
     N5 nothing threw
   node gates/nothing_comes_twice_gate.js
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('NOTHING COMES TWICE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SECS = 135;

(async () => {
  let d; const t0 = Date.now();
  try { d = await drive.open({ keepCards: true, pages: true, netlog: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    const left = Math.max(0, SECS * 1000 - await d.page.evaluate(() => performance.now()));
    await d.page.waitForTimeout(left + 1500);
    const n = d.netlog.filter(r => !/^data:/.test(r.url));
    const by = {}; n.forEach(r => { (by[r.url] = by[r.url] || []).push(r); });
    const refetched = [], wire2 = [];
    for (const u in by) { const a = by[u];
      if (a.length > 1 && a.slice(1).some(r => r.type === 'Fetch' || r.type === 'XHR')) refetched.push(u.split('/').pop() + ' x' + a.length);
      if (a.filter(r => (r.bytes || 0) > 4096).length > 1) wire2.push(u.split('/').pop() + ' ' + a.map(r => Math.round((r.bytes || 0) / 1024) + 'KB').join('+')); }
    ok('*** N1 NO FILE IS FETCHED BY SCRIPT THAT THE PAGE ALREADY LOADED *** (' + (refetched.length ? refetched.slice(0, 6).join(', ') : 'none') + '; ' + n.length + ' requests in ' + SECS + ' s)', refetched.length === 0);
    ok('*** N2 NOTHING CROSSES THE WIRE TWICE *** (' + (wire2.length ? wire2.slice(0, 6).join(', ') : 'none') + ')', wire2.length === 0);
    const page = (by['/slices/BOHEMIA_DEMO.html'] || []), stamp = (by['/slices/BOHEMIA_DEMO_STAMP.txt'] || []);
    ok('*** N3 THE DEMO PAGE IS REQUESTED ONCE *** (' + page.length + ' in ' + SECS + ' s; the watcher read the stamp file ' + stamp.length + ' time(s))', page.length === 1 && stamp.length >= 1);
    const file = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO_STAMP.txt'), 'utf8').trim();
    const live = await d.page.evaluate(() => (document.getElementById('buildstamp') || {}).textContent.trim());
    ok('N4 the stamp file says the demo\'s own stamp ("' + file + '" / "' + live + '")', !!file && file === live);
    ok('N5 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) { ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();
  done();
})();
