# THE CRASH, THE SAVE, AND ONE MAP (RUN, 10/24/26, rows [the crash and the save] and [one map at every zoom], rules 141, 142, 146(a))

PAOLO 10/24: 'I love the auto fight system, especially letting me know your percentage of victory. I didn't like the game
crashing, and when it crashes and I reload, it doesn't remember what I just got done.' And: 'it's crashing for different
reasons... I was in the settlement menu, I just talked to everyone, and then it crashed.' And: 'the map zoomed out looks a
certain way, and when it zooms in it fades to the 2D shit we had previously... it's like three maps... when the map blows up
I see the skeleton, ugly old 2D rough-draft horseshit.'

AUTO and the chance of victory are untouched (rule 141(a)): nothing in the fight's files moved.

## 1. THE CRASH: MEASURED, FOUR CAUSES, ALL FIXED

The instrument: `tools/bohemia_run_the_crash_hunt.js` (the one driver, his phone's profile, every frame armed before its own
scripts: every audio node and whether it is still connected, every AudioContext and decoded buffer, every canvas and its
backing store, every picture and its decoded size ONE COPY PER FILE, intervals, animation frames; the garbage collector forced
before every count). It walks into the nearest town and talks to every keeper and every man in the crowd, round after round.
And `tools/bohemia_run_the_town_weight.js` (the settlement screen alone, hosted in a frame the way the map hosts it, a camp, a
town and a fortress, every door and every person tapped; then LEAVE).

BEFORE (BUILD 10/24c, records/run/THE_CRASH_HUNT_BEFORE_10_24.json):

| where | held |
|---|---|
| the map, before any town | 9,646 picture files, 436 MB decoded; 3,585 canvases, 283 MB of backing store |
| one town after talking to everyone | +209 picture files, 340 MB (the men at the post: 184 MB of fight sheets) |
| talks after the first round | nothing more: a CLIFF, not a drip |
| three places, every door and person (town weight) | 416 files, 634 MB; after LEAVE still 634 MB |

So 'I talked to everyone and it crashed' is a tab crossing the phone's memory line in one go (about 1.1 GB of pixels plus 70 MB
of audio and heap), the way a phone kills a tab; and 'it crashes any time' (146(a)) is the same high water anywhere.

THE FOUR CAUSES AND THE FIXES:

1. **The hire post fetched whole fight sheets for one small figure** (`hireTick`, RUN TWO's file): every man's fight sheet AND
   gun sheet (up to 2250 x 3960, 34 MB each decoded) were fetched every tick even when his idle drew him, cached forever.
   `__THE_TOWN_LETS_GO__`: fetched only when the idle cannot draw him, let go once his card is drawn.
2. **The settlement screen never let go** (it is hidden on LEAVE, never unloaded): every place's sheets stacked on the last.
   `__THE_TOWN_LETS_GO__`: hidden, the screen draws nothing and lets go of the men at the post, the idles
   (`BohemiaIdles.release()`, ANIMATION's engine, additive) and the 3D bodies (`BohemiaRigBodies.release()`).
   Town weight: **634 MB -> 268 MB with three places open, 634 MB -> 27.5 MB after LEAVE.**
3. **The map cut every man's every frame into a canvas of its own** (`rigSheetSet`, the idles one canvas per pose per facing
   per man, all kept). `__THE_MAP_DRAWS_FROM_THE_SHEET__`: a frame is its rectangle on the sheet (`rigFrame`), drawn straight
   from it (`rigBlit`); a reader that needs a real canvas gets one from a cache of 48 (`rigCanvas`, and the frame answers
   `getContext` for ANIMATION's gate). **The map's canvases 283 MB -> 142 MB**, 0 page errors. The unused night painting
   (a 2,400-square canvas nothing draws, 22 MB) is gone. The old street tiles (8,833 pictures, 54 MB decoded) are no longer
   made on the demo's map (`__TILES_LEAN`; the hero pictures, the towns' own bases, still are).
4. **'NEW BUILD READY - TAP TO RELOAD' lay over the town's LEAVE button.** It sat across the top 40 px of the screen at
   z-index 9999 and showed whenever the stamp file merely DIFFERED from the page (another lane's cut left the stamp file at
   10/24e under a 10/24f page, so it stood on every load): a tap on LEAVE reloaded the whole game, which with the old save was
   'it crashed and forgot'. `__THE_BANNER_WAITS__` (the alpha, so the demo): only a NEWER build (the stamp's date and letter),
   and in the demo only while the title or the door is up, never over play.

Gates on the town screen after the change: THE HIRE SHOWS THE WHOLE MAN 10/0, EVERY SPEAKER HAS A FACE 10/0, THE BUSY TOWN
TALKS 20/0, THE PEOPLE OF THE PLACE 40/0, THE SETTLEMENT IS BUSY 10/0, THE TOWN AND THE HIRE 11/0, THE FACE IS HIS OWN FACE
18/0, NO TWO PEOPLE ALIKE 23/0.

## 2. THE SAVE REMEMBERS

MEASURED: on the map the save was written only on a zoom, a mode change or a new morning (`reportState`'s callers are the old
walk's), the jobs held and done and the bill were not in it at all, and a killed tab runs no pagehide, so a crash went back
to the last morning with no job on the map.

`__THE_SAVE_REMEMBERS__` (the map file): the save BEATS every 1.5 s when anything he would miss changed (the day and the half
hour, where the party stands, batteries, the jobs held and done, the crew, the men hired and walked) and writes at once on a
town reached, a hire, a buy, a job taken, the way out of a town, a fight's end and the night, through the shell's two-slot
save (`engine/bohemia_save.js`, unchanged); never before the old save has been read back. The snapshot carries `run` (the jobs
held with where each waits, the jobs done and finished, last night's bill) and the restore puts it back.

THE PROOF (`tools/bohemia_run_the_save_survives.js`, records/run/THE_SAVE_SURVIVES.json): a stranger on his phone walks to the
nearest town with a touch, hires a man, takes a job off the board, leaves; the tab is KILLED (`chrome://crash`: no pagehide,
no unload, no last word); the link opens again on the same phone (the one driver's new `opts.again`), CONTINUE; then walks to
the job, wins the fight, killed again, reopened again.

| leg | before the crash | after CONTINUE |
|---|---|---|
| the town | day 1, 06h, at 48,49, 265 batteries, job qd-a02 held, 0 done, GARRETT CARRASCO hired, crew 4 | the same, every field |
| the fight | day 1, 07h, at 54,44, 310 batteries, no job held, 1 done, the hire, crew 4 | the same, every field |

THE SAVE SURVIVES THE CRASH: YES. Save gates: SAVE IPHONE 78/0, SAVE COMPAT 16/0, DURABLE SAVE 13/0, SAVE BEFORE THE BELL
8/0, THE PEOPLE RIDE THE SAVE 14/0, HOME SCREEN IS THE SAVE 27/0; THE FRONT DOOR 7/0, A FRESH PHONE SEES THE DOOR 9/0, DEMO
BUILD 25/0.

## 3. ONE MAP AT EVERY ZOOM

`tools/bohemia_run_the_zoom_ladder.js`: the demo on his phone, the camera stepped fifteen times from the far stop (a block 3.9
px) to the near stop (85 px) through the map's own zoom call, then one real spread past the near stop; a contact sheet.

BEFORE (slices/vote/RUN_THE_ZOOM_LADDER_BEFORE_10_24.webp): the painting to a block 22 px; at 28 it faded under the old
per-block pictures and from 30 they were alone (stacked towers, parking-lot grids, the purple saucer: his 'fade to the 2D');
past the near stop the old block close-up (LOOK: flat tan ground, white shacks: his 'skeleton').

AFTER (slices/vote/RUN_THE_ZOOM_LADDER_AFTER_10_24.webp), `__ONE_MAP_AT_EVERY_ZOOM__`: the painting at full weight at every
zoom; the per-block pictures never drawn once it is in (that whole loop skipped, which is also work the phone no longer does);
no close-up past the near stop on the demo (the camera stops, like any camera). AND IT GETS SHARPER, NOT DIFFERENT: past a
block 27 px the same painter (`vbCityCore`, now taking a tile's corner and the valley's size, every roll made on the valley's
own coordinates, so every house stands where it stood in the whole painting) repaints the blocks on the glass in tiles of 8 x
8 at about one texel to a CSS pixel (36 to 96 texels a block, on the painting's 12-grid), in the worker, nearest the middle
first; the whole painting shows under a tile until it lands; each tile is drawn as its own inner 8 x 8 so two tiles meet
texel for texel; the last 20 are kept. At the near stop: gabled houses, towers, roads, the town and its people, one painting,
no seam found at 1:1.

WHAT IS LEFT, SAID PLAINLY:
- COOK's colour remake (rule 137) is recolouring the per-block district pictures, which the one map no longer draws (only the
  towns' bases on the map use them). For COOK's colour to be what the map shows (142(c)), the painting has to wear COOK's
  colour dials (banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json); that is RUN's code: NOTE on COOK's board, row on RUN's.
- A near tile takes the worker a moment; on a phone the closest zoom sharpens over a second or two after a pinch.
- The long play with fights and nights was walked through the save proof (a town, a fight) and the hunt (towns); a two-hour
  play on a real phone has not been run.
