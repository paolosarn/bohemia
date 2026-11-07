# LIGHT AS A FLASH GAME, AND THE PUBLISH NEVER BREAKS HIS FLOW (PLUMBER 6, chat 18, 11/6-11/7/26; rule 418, ask line 475)

Paolo 11/6: 'why can't we try to make this work like a flash website... what are the normal flash website limits, I'll be
understanding of that, but I need to be able to play it too, and you're fucking with the flow... my idea of this game was that it
was always not taxing on any system, international, this is how the African kids can play it, on a little laptop.'

## THE ANSWER IN SIX LINES (for him, eighth grade)
- The website deploy kept dying on GitHub's side (stuck "syncing files" for its full 10 minutes). Now it tries three times by
  itself, then sends itself again once, and if that fails too it says so in plain words. It happened for real this round:
  GitHub hung four times in a row, the deploy kept going by itself, and the site landed 54 minutes later with no one touching it.
- Before he could play, a stranger downloaded 48.9 MB in 633 files. Now 15.3 MB in about 400-450 files (phone, phone speed).
- Most of the waste was hidden: the map was loading 22 MB of people behind the title screen, which covers the whole glass.
- Songs, voices, fight sounds and the map's people now load right after he can play, behind the town he starts in.
- The game's memory: 78 MB when he can play, 95.5 MB at its most (just after a won fight), 72 MB after a reload. Under 200 MB.
- Two new checkers keep it that way: FIRST PLAY IS LIGHT (20 MB budget, 8 MB goal) and THE HEAP STAYS FLAT (under 200 MB).

## PART 1, RULE 418(e): THE PUBLISH NEVER BREAKS HIS FLOW

### WHAT WAS MEASURED
- actions/deploy-pages hit its 10-minute limit on runs 4270, 4272, 4274 (before PLUMBER 5's list cut, 1.8 GB) and 4287, 4288
  (after it, 823 MB). Every one sat at `Current status: syncing_files` for the whole ten minutes, then `Timeout reached,
  aborting!` and `Canceled deployment with ID <sha>`. The upload itself took 20-25 s every time.
- 4288's upload was 822,892,244 bytes; 4286's, which landed in under a minute, 822,723,708 (0.02% apart). Same size, same
  content shape: the hang is on GitHub's side, not in the artifact.
- The 10 minutes cannot be raised. actions/deploy-pages v4, src/internal/deployment.js: `const MAX_TIMEOUT = 600000`, and the
  timeout input is `Math.min(timeoutInput, MAX_TIMEOUT)`. At the limit it cancels its own deployment.
- Re-running a failed run (42209558695 attempt 2) failed in one second: `Multiple artifacts named "github-pages" were
  unexpectedly found for this workflow run. Artifact count is 2.` The first attempt's upload stays in the run.
- What is known outside: community reports of the same `syncing_files` timeout on large artifacts (a 910 MB one in
  orgpedia/site.cabsec; GetTechAPI/TechEngine's fix was cutting files from the artifact) and on a 6.6 KB one (community
  discussion #200798, unanswered): size makes it likelier, it is not the only cause, and there is no documented limit.
- A deployment of a commit that is ALREADY live succeeds in about a second (run 4291: `Reported success!` on the first poll),
  so a rehearsal has to run on a commit that is not yet deployed.

### WHAT THE WORKFLOW DOES NOW (.github/workflows/pages.yml)
1. The upload is named for its attempt (`github-pages-<run_attempt>`), so a re-run of a failed run works.
2. Three deploy tries in one run (continue-on-error), each a fresh deployment of the same upload, four minutes apart (see the
   proof: a try sooner than that after a cancel can read the cancelled deployment back).
3. No try landed: the workflow sends itself again ONCE, on main's newest commit (`workflow_dispatch`, `retry_of=<run id>`; a run
   carrying `retry_of` never sends another, so it cannot loop), and the run goes red with `THE SITE IS BEHIND FOR NOW... A FRESH
   RUN WAS SENT`, which build is live and which it built. A sent run that also fails says `THE SITE IS BEHIND. Six tries over two
   runs... timed out on GitHub's side`, the live build, and to check githubstatus.com.
4. The site carries `BOHEMIA_SITE_SHA.txt` at its root (written at deploy, never in the repo). The live check now asks it past the
   CDN's copy and goes red unless the live site IS this run's commit, besides the eleven pages answering 200.
5. `rehearse_timeouts` (a dispatch input): the first N tries give up after one second, to prove the path on a real run.

### THE PROOF ON REAL RUNS
- Run 4289 (push b9f6e926, the change itself): try 1 landed in 22 s; the live check read `b9f6e926...` back. The site had been
  stuck on b993d35d since 10:43 (4287 and 4288 died); COMBAT 9's two commits went live with it.
- Run 4291 (dispatch, rehearse 1, on d7ede736, already live): landed on try 1 in 3 s, the already-live shortcut above.
- Run 4292 (dispatch, rehearse 1, on 06ca3ec2, not yet live): try 1 gave up at 1 s (`deployment_queued`) and cancelled; try 2,
  30 s later, read the cancelled deployment back (`Deployment cancelled.` in 7 s: the deployment's id IS the commit); try 3, 90 s
  later, landed; the live check read `06ca3ec2...`. THE PAUSE WAS TOO SHORT, so both pauses are two minutes now.
- THE WHOLE FAILURE, FOR REAL (no rehearsal needed): run 4295 (push 2eb939b4, this round's ship). Try 1 02:22:03 -> 02:32:08
  timed out at 'syncing_files'; two minutes; try 2 02:34:08 -> 02:44:12 timed out; two minutes; try 3 02:46:12 -> 02:56:18 timed
  out. At 02:56:19 the run sent itself again (run 4298, started by github-actions[bot], workflow_dispatch on main's newest commit
  5992a448, which also carried MOTION's 11/7b; MOTION's own pending run 4297 gave its place to it) and went red with:
  'THE SITE IS BEHIND FOR NOW. GitHub's deploy step gave up 3 times on its own side. A FRESH RUN WAS SENT (it deploys main's newest
  commit). The live site is still 9e2508336803...; this run built 2eb939b4b00e...'
  RUN 4298 (the re-send, retry_of 4295): try 1 02:58:53 -> 03:08:58 hung and timed out; try 2 at 03:10:58 read the cancelled
  deployment back in 6 s ('Deployment cancelled.', two minutes after the cancel); try 3 at 03:13:04 went deployment_in_progress ->
  syncing_files -> 'Reported success!' in 33 s; the live check read 5992a448 back at 03:13:59. SUCCESS. The site is this round's
  build (and MOTION's 11/7b with it). Four lane pushes in that hour waited in the queue; none was lost.
  SO THE PAUSE IS FOUR MINUTES NOW: the read-back outlived two minutes (it cleared by 90 s in run 4292 and by 246 s here).
- THE LIVE SITE'S OWN WEIGHT (weight run 3, GitHub's runner, CPU 1x, the live site was still 9e250833, the build BEFORE this round):
  the demo on a phone 39.58 MB in 495 files before first play (17.2 s), on a computer 45.62 MB in 531 files (13.9 s), the alpha on a
  phone 43.15 MB in 409 files (the workshop's eight extra tile banks, 22 MB of them); heap 77 MB (the demo), 108 MB (the alpha).
  This box's served-like-Pages count of the same build read 48.9 MB: the real host's gzip and cache land within 20%.
  (weight run 2 failed: ubuntu-latest is Ubuntu 26.04 and Playwright 1.56 will not install there; the workflow is pinned to 24.04.)
- AND AFTER (weight run 7, after deploy 4299 of 3086885e, the live site this round's build): the demo on a phone 15.36 MB in 447
  files before first play (19.7 s at 1x on the runner; was 39.58 MB in 495), on a computer 16.55 MB in 493 (was 45.62 MB in 531),
  24 MB streaming in the 20 s after; the alpha on a phone 36.80 MB in 344 (was 43.15 MB in 409). Heap at first play 75.9 MB (the
  demo), 114 MB (the alpha). Nothing downloaded twice on the real host either.
- THE ALPHA IS HIS LINK AND STILL 36.8 MB: 22 MB of it is the old street tile banks BOHEMIA_CITY_TILES_02..09.js, which the workshop
  loads at boot for the walk that died 9/28 and the demo cut already drops (RUN's rule 174). Holding or dropping them in the alpha is
  the next cut (RUN's file and RUN's call: a workshop tab may still read them), not done here.

## PART 2, RULE 418(a)(b): LIGHT AS A FLASH GAME

### THE INSTRUMENT (tools/bohemia_first_play.js)
A stranger's first visit: a fresh browser, no cache, no save, NEW GAME with a finger, the page served LIKE GitHub Pages (gzip on
text, max-age=600, ETag), the browser's own network events in every frame (wire bytes, compressed where the server compressed).
FIRST PLAY by the glass alone: the town a new game starts in is shown, its picture DRAWN (BohemiaSettlement.picIn, added read-only
for this), and a LEAVE is on the glass. The service worker is blocked for the count (it claims the page mid-visit and its downloads
happen in its own target, where a page session cannot weigh them; it is network-first with no cache of its own, so the files are
the same). `--base https://paolosarn.github.io/bohemia` weighs THE LIVE SITE (GitHub's runner only: .github/workflows/weight.yml,
after every deploy that lands).

### BEFORE (main at 06ca3ec2, the demo, the phone held upright, CPU 1x, served like Pages)
48.9 MB on the wire in 633 files before first play (73.2 MB unzipped); heap 76 MB held at first play. By folder: slices/rig_idles
14.6 MB (48 files: the map's idle sheets, map.webp 1.3 MB and map_town*.webp about 0.9 MB each), slices/rig_mix 7.3 MB (33: the gangs'
rolled people), slices/vote 5.5 MB (17: the songs' three levels, `THE SONGS GO IN`), slices/settlement_ground_towns 2.8 MB (10: every
shape of the one town, day and night), the map's page 2.2 MB, voices 2.1 MB, the barber's faces 1.8 MB, the demo's page 1.3 MB, the
map's tiles 1.1 MB, the fight's sounds 1.8 MB (fight_death, fight_heard, fight_punch), boss places 0.5 MB, the camp kit 0.3 MB.
The coordinator's 47.5 MB / 647 files agrees (his count: performance entries in every frame, no gzip).
WHY: (1) the title covers the whole glass (its camera feed) while the map boots behind it, and the map drew 72 standing people and
asked for 15 gang sheets nobody could see; RUN's rule 174(b) then held BEGIN until every one was in. (2) Four of SOUNDS' loaders
wait '<N> s after the music first runs', and the title's own tap runs the music now, so the fight's sounds and the voices came during
the title. (3) the songbook held every playing song's fight levels from the first second. (4) the town asked for all eight shapes
of its picture (tall, wide, left, right, by day and night) before he turned the phone.
NOTHING WAS DOWNLOADED TWICE in this count (with the cache rules a real host sends). The coordinator's 'level_2/level_3 fetched
twice' is the worker: it re-asks every file `no-cache`, so a song the page asks twice answers twice (304s on a real host).

### WHAT CHANGED (all marked __FIRST_PLAY_IS_LIGHT__; no art touched, rule 404)
- THE SHELL (slices/BOHEMIA_ALPHA_0_9.html, cut into the demo): one signal. FIRST PLAY is reached when the town a NEW GAME starts in
  is drawn and up 1.5 s, or the map is his first screen (2.5 s after BEGIN, no town), or CONTINUE is pressed (a saved game can open
  on the map), or 45 s after BEGIN (120 s after the page opened if nobody begins). `bohemiaFirstPlayHeld()`,
  `bohemiaAfterFirstPlay(fn)`, `window.__FIRST_PLAY_OFF` (the before).
- THE SONGBOOK (SOUNDS' __THE_SONGS_GO_IN__): plan() fetches no recording before first play; his engine plays live until then,
  exactly as it does while a recording decodes.
- SOUNDS' four late loaders (the bullet, the deaths, the punch, the voice bank): 'the music first runs' counts from first play.
  squiggleSay's own lazy load waits too (his 8/11 voice says it until then, as on a slow line).
- THE MAP (slices/BOHEMIA_CITY_WORLD.html): a gang sheet (rig_mix) and an idle sheet wait for first play; a standing man is his
  still until then; while held or under a town the map draws no COOK mark in a held sheet's place (174(b): no dead layer after GO);
  mapFinalLook asks for the land and the painting, not the people, while held (a NEW GAME opens in a town that covers the map;
  CONTINUE is never held, so a saved game that opens on the map still waits for every person). FIRST PLAY redraws once, so the
  sheets stream in behind the town.
- THE TOWN (slices/BOHEMIA_SETTLEMENT_SCREEN.html): the shapes he is not holding come after first play (the one on his glass is
  asked as before; a turn before they are in keeps the town as it was, flipCheck); BohemiaSettlement.picIn (read only).
- THE BOSSES' 39 place pictures and THE CAMP's kit: after first play (both already draw nothing until their picture is in).

### AFTER (this tree; gates/first_play_is_light_gate.js, CPU 4x, served like Pages)
- THE PHONE: 15.37 MB in 401 files before first play (35.9 MB unzipped); first play 31.2 s at 4x (title 1.7 s, BEGIN 15.5 s).
  24.8 MB streamed in the 30 s after it, behind the town: the map's people, the songs, the fight's sounds, the voices.
  The rerun after the machine party's hold: 15.26 MB, 445 files. Biggest left: the map's page 2.28 MB, the demo's page 1.28 MB,
  the map's tiles 1.15 MB, the cast sheet 0.92 MB, the people sheet 0.47 MB, the town's tier picture 0.47 MB.
- A COMPUTER: 16.27 MB in 410 files.
- THE BEFORE (the hold switched off, the same tree, the same 4x): 38.16 MB in 571 files, 22.8 MB more. Main measured at 1x read
  48.9 MB; the two are different readings (at 4x the boot is slower and the timers land differently), so the gate only compares
  readings it took itself, the same way.
- Nothing downloaded twice, before first play or the 30 s after.
- THE 8 MB GOAL: 7.3 MB to go. What is left is the first screen's own: the three pages (4.7 MB gzipped), the map's tiles and cast,
  the town and its people. The next cuts are a look call or a code split, not a hold: the map's page carries 6.4 MB of text that
  the town screen never runs (it is the map); the tiles could come at LEAVE if the door stopped asking the map's land (rule 174's
  'the land and the painting'); the cast sheet is two sheets in one.

### THE HEAP (gates/the_heap_stays_flat_gate.js, the whole loop on the demo, phone; LIVE as read, HELD after a forced collection)
title 85.9/78.4, new game 78.7/78.4, town 81.0/79.5, map 79.2/78.8, travel 81.9/79.8, event 83.7/80.2, fight 87.5/84.7,
victory 95.5/92.0, save 92.2/91.8, reload 75.0/71.6, end 71.6/71.8 MB; planted 64 MB -> 135.7 MB (the reader sees it).
THE HEAP STAYS FLAT 5/0: peak 95.5 MB of 200; the fight leaves 12.2 MB behind on the map (the end screen's spoils, a fight's
pictures); the reload holds 7.2 MB less than the first boot's map. First play held 76.1 MB before this round's change and 76-78
after (the held sheets are pictures, decoded outside the script heap).
THE 212 MB: not reproduced on this box by any reading (live or held, any step). The coordinator's reading was taken 'in every
frame'; the shell, the map and the town are one origin and share ONE heap, so a per-frame read reports the same heap once per
frame (three frames x about 70 MB is about 212). That is this lane's reading of it, not a measurement of his instrument.

### SEEN ON THE GLASS
After BEGIN he sees the barber, then his squad's tape (YOU, RAUL, A NEW CREW), then the town arriving with its elder talking, then
the town drawn: the map is not on the glass until LEAVE, so nothing held is ever missing where he looks (screens taken every 1.5 s
from BEGIN, the demo on the phone).
RISK, SAID PLAINLY: a player who LEAVEs the town within a few seconds on a slow line can meet the map before all its people are in:
RIG_MIX's own rule then holds (a gang's one rig look stands in until its sheet arrives). On this box they were in 3 s after first play.

### FOUND ON THE WAY, NOT FIXED (for the coordinator)
- THE DRIVER'S DEAD WAIT: tools/bohemia_drive_the_demo.js waits for the world as `MODE === 'human'` with eight walk-pad buttons,
  the walk that died 9/28. It never comes, so every open() without `world:` sits out its full 120 s ceiling. Measured: the demo's
  door at 12-15 s, open() returning at 144-147 s. About 290 gates open the game this way: two minutes of nothing each. A fix is a
  suite-wide timing change (gates that lean on the 2-minute settle would move), so it is a row, not a drive-by.
- BEGIN lit about 5 s sooner (6.9 s against about 12 s at 1x), because the door no longer waits for 22 MB of people.
