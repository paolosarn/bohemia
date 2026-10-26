# COMBAT 10/26: THE FIGHT IS BROKEN LIVE (the coordinator's emergency, rule 112)

## HIS WORDS (10/26, about 03:50 UTC, through the coordinator)
"the auto combat started tweaking out on me and not working during combat... then I was trying to fight manually and it was
tweaking on that too... that needs to get fixed immediately." ('tweaking' is his word for glitching: a thing jumping, stalling or
not answering.)

## WHAT IT WAS, IN ONE PARAGRAPH
The fight page and its rules file came from two different deploys. The service worker (slices/sw.js) fetches every PAGE fresh
(cache 'no-store'), but every file a page fetches (the fight's rules in records/target/bb/ours.json, the engine's .js) came out of
the phone's own HTTP cache, which GitHub Pages lets keep a copy for ten minutes (Cache-Control: max-age=600). Five deploys landed in
the twenty minutes before he played (pages runs: 03:22 range bands, 03:35 COMBAT TWO's AUTO brain, 03:39 CAMP, 03:43 SOUNDS, 03:46
ANIMATION). So for up to ten minutes after each, a NEW fight page ran on an OLD ours.json. The new code read rows the old file did not
have, threw, and the fight's frame loop caught the throw BEFORE it drew, on every frame: the board froze in place and nothing moved.
No gate could see it: every gate serves the files fresh from disk.

## REPRODUCED (Chromium, his phone's profile 390 x 844 at 3x touch, and the computer's 1440 x 900; the demo through the game's door)
- Today's fight page with the ours.json from just before COMBAT TWO's brain (50d5cba1^): AUTO stood on RAUL's first turn for 40 s,
  'Cannot read properties of undefined (reading forEach)' 19 times (the old auto_brain row has no damage_quantiles; killOdds calls
  q.forEach on it). AUTO NOT WORKING.
- Today's fight page with the ours.json from just before the range bands (34e0a072^), BY HAND: their MARKSMAN's first turn threw
  'no sourced row at ours.range_bands' 30 times in 60 s; round 1 never ended; his men never got a turn. BY HAND TWEAKING TOO.
- The same with matching files: every fight plays to its end.
- The gate below, run on main's own fight page and worker (served in place of the fixed ones): 0 passed, 5 failed (the fight read
  the old file; AUTO frozen in round 1, 8.2 s still; the board stopped drawing at 25 frames; 45 throws).

## WHAT IT WAS NOT (each measured before the cause was found, so the next lane does not chase them)
- CAMP's damage handoff (the coordinator's first suspect): a new game and an OLD save (built on the 01:58 build, be085c78, two
  fights played there, its whole localStorage carried into today's build, CONTINUE), three fights in a row with damage carried,
  a man at 1 HP and at 5 HP, AUTO and by hand: every fight ended, 0 errors. The men walk in at hpMax - lostHp, never under 1.
- COMBAT TWO's brain: 60 AUTO fights on the real fight page at 4x across the five road factions with damage carried in, then 45
  more with every origin's rolled company and gear (all 15 origins: the twelve, the Lone Wolf, spears and car doors, guns) and 12 by
  hand: 0 throws, 0 stalls of 10 s, every fight ended. Its cost on a 4x-slowed CPU, 12 against 10: the median turn 4 ms (2 before),
  the worst 240 ms; frames the same as before it (115 ms median either way under that throttle).
- SOUNDS' one beat (ababfaa2) and the songs in the fight (ef450c9c): the beat the fight reads stayed 500 ms through every fight; 4 to
  5 song decodes a fight, no re-decode loop; frames on the demo at a 4x-slowed CPU 135 ms median today vs 134 on the 01:58 build.
  ONE BEAT FOR EVERYTHING 12/0, THE HEAL BUTTON 16/0, MEET BEFORE YOU FIGHT 8/0, EVERY FIGHT ENDS 10/0, AUTO NEVER WASTES A TURN 9/0
  on this tree; THE FIGHT BY HAND QUICKER 19/1 under six gates at once (its tap-skip leg is timing), 20/0 alone.
- The camera (zoom travel 1.57 to 1.77 and 1 to 2 reversals a minute either build), the landscape phone, the road-party door with
  the meet card, the alpha: all clean.
- A NOTE FOR SOUNDS, not the cause: every effect makes a new 1-second DelayNode (createDelay(1)) left connected to its bus, 966 in
  three minutes of AUTO at 4x; Chromium frees them (the live count fell back to 0 or 1 every fight), WebKit frees them only when its
  garbage collector gets round to the wrapper, about 384 KB each meanwhile. A maxDelayTime of a sixteenth and a disconnect when the
  sound is done would cost nothing.

## THE FIX (root, then the floor under it)
1. THE FIGHT READS THE DEPLOY IT CAME WITH (slices/BOHEMIA_FIGHT.html, loadAll and the rig/voice JSON): every data file is fetched
   with { cache: 'no-cache' }: the phone asks the server whether the file changed, a 304 when it did not (one round trip; the copy
   kept), never a rule from another deploy.
2. ONE DEPLOY FOR EVERY PAGE (slices/sw.js, a marked block __ONE_DEPLOY__): the worker now also answers every same-origin script,
   data file, stylesheet and page that a page fetches the same way (offline, the copy the phone holds); pictures and sound pass
   straight through as before. This closes the whole class, not only the fight: the map, the town, the crew screen and the shell had
   the same ten-minute window. NOTE: a new worker takes over at the next load and the page reloads once (RUN's controllerchange
   rule, 10/10): once per phone after this deploy.
3. WORLD's job stars engine (slices/bohemia_job_danger.js, a marked line __ONE_DEPLOY__): it reads the fight's page by fetch to play
   jobs on AUTO; that read is fresh now too, so the stars never play an old fight against new rules.
4. A TURN THAT THROWS PASSES; THE BOARD ALWAYS DRAWS (the floor): a man's turn that throws (any cause, any future bug) ends his turn
   instead of throwing again every frame (turnBroke: the error still goes to the page once a turn, so every gate still sees it;
   UI.broke counts them), and a throw in the director no longer skips the draw (frame() draws in its own try). A broken rule now
   costs a man a turn, never the whole fight.

## THE GATE: THE FIGHT ON THE LIVE PATH (gates/the_fight_on_the_live_path_gate.js, in the suite)
The demo on his phone and his computer, the test server answering as GitHub Pages does (max-age=600, an ETag, 304s: the driver's
pages option), and a DEPLOY between the map and the fight: the phone boots and walks the map while the server holds a rules file
one deploy behind (today's with its newest fight rows taken out and a mark in), then the server takes today's file, then:
L1 the fight reads the server's file, never the copy the phone held; L2 AUTO by a real tap to its end, never 8 s still; L3 by hand
with real taps, every turn of his answers (14 of 14 on the phone); L4 the damage carried, each man in at what the condition says
(RAUL 21/55 on the phone); L5 AUTO at 4x by the speed button; L6 an old save (the condition forgotten), the tab killed, the link
opened again, CONTINUE, a fight on AUTO; L7 the bare page on the old file: the turn that throws passes, the fight reaches its end,
the board drew 550 frames, the throw reached the page 38 times; L8 nothing threw on the live path.
RESULTS: phone 8/0 and computer 8/0 with the fix (by hand 14 of 14 and 43 of 43 of his turns answered a tap; L7 the board drew 550 and 520 frames through 38 thrown turns); main's own fight page and worker: 0/5.

## WHAT I COULD NOT CHECK
His iPhone (WebKit) itself: only Chromium is in this box, and the live site is blocked from it. The mechanism is the browser's HTTP
cache and GitHub Pages' header, which WebKit honours the same way; EYES watches it on the live link after the deploy.

## ROUTED
- PLUMBER and RUN: the worker's __ONE_DEPLOY__ block (their pipe); the one reload per phone it brings.
- WORLD: the marked line in bohemia_job_danger.js.
- SOUNDS: the DelayNode note above (hygiene, not this bug).
- CAMP, COMBAT TWO, SOUNDS, UI, RUN TWO: cleared as causes (above); nothing of theirs was changed but the two marked lines.
- EYES: one fight on AUTO and one by hand on the live link within ten minutes of the next deploy that touches ours.json.
