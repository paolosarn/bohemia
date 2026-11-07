/* FIRST PLAY IS LIGHT (PLUMBER 6, 11/6/26; rule 418(a), ask line 475).
   PAOLO 11/6: 'why can't we try to make this work like a flash website... what are the normal flash website limits, I'll be
   understanding of that, but I need to be able to play it too... this is how the African kids can play it, on a little laptop.'
   THE BARS (rule 418): a Flash game averaged about 1 MB and 97 in 100 were under 5 MB; Poki asks for a first download under
   8 MB; CrazyGames allows 50 MB first (20 MB for its phone homepage), 250 MB in all, 1,500 files. Rule 418(a): the first play
   under 20 MB NOW, under 8 MB as the goal; the rest streams in when it is needed.
   MEASURED BEFORE (11/6, this tool, the demo on the phone, served like GitHub Pages): 48.9 MB in 633 files before the first frame
   he could play; the map's people sheets (22 MB) drawn behind a title that covers the whole glass, the songs' three levels, the
   voices and the fight's sounds all fetched before play. NOW (__FIRST_PLAY_IS_LIGHT__ in the shell, the map, the town, the bosses
   and the camp): they wait for FIRST PLAY and stream in behind the town he starts in.
   FIRST PLAY, by the glass alone (tools/bohemia_first_play.js, never the shell's own signal): the town a new game starts in is
   shown, its picture DRAWN, and a LEAVE is on the glass (or the map is his screen). A stranger's first visit: a fresh browser,
   no cache, no save, NEW GAME pressed with a finger, gzip on text and GitHub's cache rules (opts.pages), the worker blocked so
   every download is weighed once (the tool says why).
     P1 THE PHONE: the bytes before first play are under the budget (20 MB), the 8 MB goal printed beside it
     P2 THE PHONE: the files before first play are under 700 (CrazyGames counts 1,500 for a whole game)
     P3 nothing is downloaded twice, before first play or in the half minute after it
     P4 NOTHING THE FIRST SCREEN DOES NOT NEED: no song recording (slices/vote/songs/), no gang sheet (slices/rig_mix/, its few-KB
        index aside) and no
        map idle sheet (slices/rig_idles/map*) arrives before first play
     P5 ...AND IT STILL COMES: the map's people (a gang sheet and an idle sheet) are in within half a minute after first play,
        behind the town, before he can have left it on a phone
     P6 A COMPUTER: the bytes before first play are under the budget too
     P7 THE BEFORE: with the hold switched off (window.__FIRST_PLAY_OFF, the change's own switch) the first play carries at
        least 10 MB more, so this gate sees a load that comes back
   node gates/first_play_is_light_gate.js [--quick]   (--quick: the phone only, no computer and no before; about two minutes)
   The budget only comes DOWN (the day the goal is met it is 8). */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const FP = require(path.join(ROOT, 'tools/bohemia_first_play.js'));
const BUDGET_MB = 20, GOAL_MB = 8, FILES_MAX = 700, LINGER = 30000, THROTTLE = 4;
const quick = process.argv.includes('--quick');
let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n + (why ? '  [' + why + ']' : '')); } else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };
const has = (r, re) => (r.files || []).filter(f => re.test(f.url));

(async () => {
  console.log('\nFIRST PLAY IS LIGHT (rule 418(a)): the demo, a stranger\'s first visit, CPU ' + THROTTLE + 'x, served like GitHub Pages');
  console.log('  THE BUDGET ' + BUDGET_MB + ' MB NOW; THE GOAL ' + GOAL_MB + ' MB (Poki\'s first download); a Flash game averaged about 1 MB\n');
  const phone = await FP.measure({ profile: 'phone_portrait', throttle: THROTTLE, linger: LINGER });
  FP.print(phone);
  const at = phone.firstPlayMs != null;
  ok('P1 THE PHONE: ' + phone.firstPlay.mb + ' MB before first play, under the ' + BUDGET_MB + ' MB budget (the ' + GOAL_MB + ' MB goal: ' +
     (phone.firstPlay.mb <= GOAL_MB ? 'MET' : (phone.firstPlay.mb - GOAL_MB).toFixed(1) + ' MB to go') + ')', at && phone.firstPlay.mb <= BUDGET_MB,
     at ? 'the biggest: ' + phone.biggest.slice(0, 6).map(b => b.url + ' ' + b.kb + ' KB').join(', ') : 'FIRST PLAY NEVER CAME: ' + phone.where);
  ok('P2 THE PHONE: ' + phone.firstPlay.files + ' files before first play, under ' + FILES_MAX, at && phone.firstPlay.files <= FILES_MAX);
  ok('P3 nothing downloaded twice (before first play and the ' + LINGER / 1000 + ' s after)', phone.twice.length === 0, phone.twice.slice(0, 6).map(t => t.url + ' x' + t.times).join(', '));
  /* the sheets themselves; rig_mix/index.json (a few KB, the crowds' table of contents) may come early */
  const early = [].concat(has(phone, /\/slices\/vote\/songs\//), has(phone, /\/slices\/rig_mix\/(?!index\.json)/), has(phone, /\/slices\/rig_idles\/map/));
  ok('P4 no song recording, gang sheet or map idle sheet before first play', at && early.length === 0, early.slice(0, 6).map(f => f.url + ' @' + (f.endMs / 1000).toFixed(1) + ' s').join(', '));
  const later = (phone.afterList || []);
  const mixIn = later.some(u => /\/slices\/rig_mix\/.+\.png$/.test(u)), idleIn = later.some(u => /\/slices\/rig_idles\/map.*\.webp$/.test(u));
  ok('P5 and they still come: a gang sheet ' + (mixIn ? 'in' : 'NOT IN') + ', a map idle sheet ' + (idleIn ? 'in' : 'NOT IN') + ' within ' + LINGER / 1000 + ' s after first play (' + phone.afterFirstPlay.mb + ' MB streamed behind the town)', mixIn && idleIn);
  if (!quick) {
    const pc = await FP.measure({ profile: 'computer', throttle: THROTTLE, linger: 0 });
    FP.print(pc);
    ok('P6 A COMPUTER: ' + pc.firstPlay.mb + ' MB in ' + pc.firstPlay.files + ' files before first play, under ' + BUDGET_MB + ' MB', pc.firstPlayMs != null && pc.firstPlay.mb <= BUDGET_MB, pc.where);
    const before = await FP.measure({ profile: 'phone_portrait', throttle: THROTTLE, linger: 0, off: true });
    FP.print(before);
    ok('P7 THE BEFORE: with the hold off the first play carries ' + before.firstPlay.mb + ' MB, ' + (before.firstPlay.mb - phone.firstPlay.mb).toFixed(1) + ' MB more (at least 10)', before.firstPlayMs != null && before.firstPlay.mb - phone.firstPlay.mb >= 10);
  }
  console.log('\nFIRST PLAY IS LIGHT: ' + pass + ' passed, ' + fail + ' failed  (the phone ' + phone.firstPlay.mb + ' MB in ' + phone.firstPlay.files + ' files before first play; budget ' + BUDGET_MB + ' MB, goal ' + GOAL_MB + ' MB)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('FIRST PLAY IS LIGHT: ' + pass + ' passed, ' + (fail + 1) + ' failed (threw)'); process.exit(1); });
