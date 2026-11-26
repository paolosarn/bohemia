# TEN, THEN TWENTY, FIGHTS HOLD MEMORY FLAT (PLUMBER 8, 11/26/26; ask row 744, rule 484(a), rule 480(c), rule 441)

FOUND BY BESTIARY 2 (row 744): the same road fight won ten times on the demo, the renderer 1.36 GB -> 5.5 GB, about 340 MB a fight; a phone
tab dies near 1 to 1.5 GB, so a few dozen fights: the likely cause of the brown town on his iPhone after long play (the finish line's
item 1). They pointed at the dive's pictures (slices/bohemia_motion.js picOf).

## HOW IT WAS MEASURED

The same road fight (the die pinned) won again and again on the demo upright, a forced garbage collection (twice) after each, and:
every canvas any page makes, kept as a WeakRef by the top page with the function that made it (made in the top page's own context:
a registry whose entries were made inside each page kept every page alive itself, which this round found and fixed in its own probe);
the documents (the browser's DOM counters); the JS heap by the browser's own count (Runtime.getHeapUsage: the page's
performance.memory is rounded and rarely updated, so 'the heap stayed flat' read off it proves nothing); the renderer's and the GPU
process's memory (ps). Then a heap snapshot's retaining paths (the shortest strong path from a root to each detached picture).

## WHAT HELD IT

The dive's pictures of EVERY fight stayed alive: picOf 17 -> 31 -> 45 -> 59 canvases over four fights, turnIn and diveUp one more each,
about 23 megapixels a fight (about 90 MB at four bytes a pixel), the GPU process about 156 MB a fight. The retaining path:
`DocumentTimeline -> Animation -> KeyframeEffect -> <div class="band"> -> <div class="cam"> -> the canvases`. Every animation the dive
plays holds its last frame (play()'s fill 'both') and was never cancelled, only dropped from DIVE.anims; the page's animation timeline
keeps such an animation, its effect keeps its target in the removed dive layer, and the target keeps the whole layer: the map's
photographs at each zoom stop (780 x 1562), the board's picture (1170 x 2532), the grid, the clouds, the bands.

## THE CUT: __THE_DIVE_LETS_ITS_PICTURES_GO__

The dive's end (diveEnd) cancels every animation inside its layer, and any of its own whose target is off the page, before the layer
comes off; an animation on something still on the glass is left as it is. Switch: window.__DIVE_KEEPS_ITS_ANIMATIONS (the way it was).

## AFTER (the same tree, the switch off and on)

| after fight | 1 | 2 | 3 | 4 |
|---|---:|---:|---:|---:|
| the old way: canvases alive (megapixels) | 54.4 | 76.8 | 100.6 | 123.2 |
| now | 43.4 | 47.4 | 50.9 | 50.9 |
| the old way: the dive's own pictures | 19 | 37 | 54 | |
| now | 9 to 10, flat | | | |

THE GATE'S TEN FIGHTS (now): canvases 41.8 -> 47.7 megapixels from the second fight to the tenth, flat from the fourth (the map's caches
filling); the dive's pictures 10 -> 10; documents 17 -> 17 (the last fight's page and its loot screen, replaced by the next); the JS heap
106 -> 108 MB; the renderer 1,711 -> 1,685 MB and the GPU process 1,270 -> 1,095 MB (flat; BESTIARY 2's walk climbed to 5.5 GB). The
dive ended 20 times (down and up) and cancelled 807 animations. The plant (the old way) grew 22.4 megapixels in one fight.

## TWENTY FIGHTS EACH WAY (rule 484(a), the same round)

Rule 484(a) (Paolo 11/26, 'it crashes going into a fight') asked for the check the way his phone dies: twenty fights in a row entered
from the map on the slowed phone, upright and sideways, memory flat, no crash, no reload. The gate is now TWENTY FIGHTS HOLD MEMORY FLAT
(gates/twenty_fights_hold_memory_flat_gate.js), two suite entries, one per side:

| | fight 1 | fight 2 | fight 10 | fight 20 | the most | the heap 2 -> 20 | documents 2 -> 20 |
|---|---:|---:|---:|---:|---:|---:|---:|
| upright, CPU 4x, canvases alive | 156 MB | 172 MB | 188 MB | 194 MB | 229 MB (fight 3, gone by fight 4) | 107 -> 109 MB | 17 -> 17 |
| sideways, CPU 4x | 160 MB | 178 MB | 186 MB | 186 MB | 191 MB | 106 -> 110 MB | 17 -> 17 |
| the old way (the leak put back), no slowdown | 200 MB | 296 MB | | | 386 MB at fight 3 | | |

No crash and no reload on either side; the dive ended 40 times a side and cancelled 1,647 animations. THE IPHONE LINE: Safari gives a page
a fixed canvas allowance (384 MB on the phones that first ran into it); past it a new canvas gets no pixels and draws nothing, so the
ground shows through. The old way crossed 256 MB at the second fight and 384 MB at the third: that is the brown town. Now the most is
229 MB, and 186 to 194 MB is where it sits. The new check C2 holds every fight under 256 MB; its plant P2 proves it bites.

THE TIME: the phone's own way in at 4x is about 25 s a fight (the board's page built and the dive played on the slowed CPU, the thing
measured). The count's garbage collections and the loot and the way home run unslowed (memory does not care how fast the CPU is), and a
side is still about 540 s. Cut to fit 600 s it would not be the walk the rule names, so this one gate gets its own 900 s cap (the suite's
_CAP_FOR); every other gate keeps 600 s.

STILL OPEN (the next lead): 186 to 194 MB of canvases alive on the map at rest is most of an iPhone's allowance by itself. A few more
pictures (a camp, a bigger town, a sideways turn mid-dive) could tip it. The biggest holders are the map's photographs at each zoom stop
and the board's picture; that cut is next.

## THE PICTURES AT REST (the same round, BUILD 11/26zq)

The open lead above, measured by maker (every canvas alive after the third fight, grouped by the function and page that made it) and
then by a heap snapshot's retaining paths. The dive still held one fight's worth between fights, five ways:
- DIVE.keptPics: the map's photographs at each zoom stop, kept at twice a point for the way back up, dropped only when the NEXT fight's
  way down made new ones;
- DIVE.push: the camera's slow push, an animation cancelled by letGo but still named, and an animation names its target: the camera
  and every picture under it (the board's picture 1170 x 2532, the map's 1170 x 2343, the grid 780 x 1688);
- DIVE.cam, DIVE.bands, DIVE.mapPic: the layer's own pieces, named after the layer came off.
And the phone's ammo card (bohemia_phone.js, window.__PHONE_CARD_SAYS, a checker's look) copied the fight's rounds with R0.slice(),
which makes the copy in the FIGHT page's realm, so the record kept that closed page's whole context alive.

THE CUT: __THE_WAY_HOME_LETS_ITS_KEPT_PICTURES_GO__ (bohemia_motion.js keptGo where the way home ends, and the leftovers named null in
diveEnd; switch window.__DIVE_KEEPS_KEPT); the card's copies made in its own page (Array.prototype.slice.call).

| twenty fights from the map, CPU 4x | the most alive | after fight 2 | after fight 20 | the dive's pictures between fights |
|---|---:|---:|---:|---:|
| upright, 11/26zp | 229 MB | 172 MB | 194 MB | 10 |
| upright, now | 147 MB | 119 MB | 140 MB | 0 |
| sideways, 11/26zp | 191 MB | 178 MB | 186 MB | 10 |
| sideways, now | 134 MB | 128 MB | 133 MB | 0 |

About 50 MB less on the map at rest, 80 MB less at the worst moment: from three quarters of the 256 MB line to about half. The gate
gains M6 (none of the dive's pictures alive between fights, at every fight), its plant P3 (__DIVE_KEEPS_KEPT, two fights: 9 and 10
alive), and C3, a ratchet: at most 176 MB at every fight (the most seen + 20%), which may only come down.

What is left on the map at rest (about 133 to 140 MB), biggest first, all the map's own (WORLD 13's draw): two 2400 x 2400 pictures
(BOHEMIA_CITY_WORLD.html cv at about line 53200, 46 MB together), 13 tiles up to 1025 x 1025 (24 MB), the land view 1602 x 2775
(18 MB), 7 tiles at 992 x 992 (12 MB), the ground 1170 x 2343 (11 MB). Filed as an ask row to WORLD 13.

## LEFT, NAMED

- The pop-up watcher (slices/bohemia_ui_nothing_pops.js DOCS) holds the last closed page or two until it arms the next (bounded); its
  MutationObserver on a closed page is never disconnected (UI).
- The materials' kept pictures (window.top.__BM_KEPT) keep objects made inside the first page that put each one (bounded: one page).
- The motion layer's screen-to-screen morphs (bohemia_motion.js m.anim, fill 'both') were not seen to grow on this walk.

Gates: TWENTY FIGHTS HOLD MEMORY FLAT (new, in the suite, two entries) upright 8/0, sideways 8/0, its plants 2/0 (the first cut, ten
fights upright unslowed, was 6/0 and 1/0); THE ZOOM DOWN INTO THE BOARD 32/0; THE WHOLE LOOP PLAYS
11/0; EVERY FIGHT HANDS HIM BACK 10/0; MAKE CAMP FROM THE FIGHT 11/0; THE CAMP LETS GO WHEN HE LEAVES 7/0.
