# TEN SECONDS TO PLAY, ROUND FOUR: THE MAP PEOPLE COME BAKED (RUN, 10/13/26, [ten seconds to play])

> **PAOLO 10/5:** *"I feel like I gotta wait 40 seconds for this shit to load."* The row's end state: from the tap on the
> link to the first tap that moves the party, under ten seconds at 4x.

## THE NUMBERS (the row's own stopwatch, THE MAP ANSWERS AFTER BEGIN M1: the link, NEW GAME, BEGIN when it lights, one
## tap on open ground a second later, the clock stops when the party crosses its first block; 4x, served like Pages)
| from the link, at 4x | round two (main 68e70d5b) | round three (10/11f) | now |
|---|---|---|---|
| BEGIN lit | 18 to 30 s | 14.5 to 15.8 s | **11.4 to 12.4 s** |
| HIS FIRST BLOCK CROSSED | 32.5 to 34.7 s | 19.1 to 21.5 s | **15.9 to 16.8 s** |

BEGIN ready at full speed (a CPU profile from the link): 3.8 s to **2.5 to 2.7 s**.

## MEASURED FIRST
The profile from the link to BEGIN ready at full speed, 3.8 s: the biggest single cost was the cast for the map, 1.0 s:
six people, each put on and baked in eight facings (their stills), the same 48 pictures every boot (hashed since round
two, THE DEMO BOOTS LIGHT B10). Their breath (192 pictures) was another 1.2 s after it, and the crowd after the door
(six more people and twelve walks, 576 pictures) about 6 s more, all the same pictures every boot.

## THE CUT
- **The cut bakes them once.** tools/bohemia_bake_the_demo_cast.js opens the demo just cut in a browser with the
  one-piece bake on (`__BOH_CAST_WHOLE`), catches the cast, the later people and the walks as the shell sends them to
  the map, and writes `slices/BOHEMIA_DEMO_CAST.json` (the six: 192 frames, 544 KB, 157 KB on the wire) and
  `slices/BOHEMIA_DEMO_CROWD.json` (the crowd: 576 frames, 1.6 MB, 508 KB on the wire). tools/bohemia_cut_the_demo.js
  runs it after every cut (about 15 s), skips it when the files already match the cut, and removes them when a bake
  fails, so a stale file can never stay.
- **THE KEY.** The cut writes a fingerprint of the workshop it cut from into the demo's first line
  (`window.__DEMO_CAST.key`) and the bake writes the same key into both files. A file from any other cut is refused
  and the demo bakes live, exactly as before. The cut's `--check` refuses a committed file with another key.
- **The demo asks for the six in its first line** (`#demo-cast-early`, a fetch that gives up after 6 s); the cast
  waits for it and puts the six straight into the breath store the split bake already reads (`demoCastAdopt`), so no
  body is put on and the breath after the door has nothing left to do. The crowd's two passes ask for the second file
  on their first step after the door (`demoCrowd`) and post a baked person the same way they post one they baked.
- **The deploy re-cuts the demo on every push**, so after any lane's push the key changes and the cut must bake again:
  .github/workflows/pages.yml now installs a browser (playwright 1.56.1, chromium) before the cut, in a step that can
  never fail the deploy; without it the demo bakes its people live, correct and slower.

## THE SAME PICTURES
THE DEMO BOOTS LIGHT B10: the map's 280 frames (the six's stills and breath, his stills and walk) hash the same as the
workshop's live one-piece bake. THE MAP ANSWERS AFTER BEGIN M7: the crowd's later people and twelve walks, person by
person, the same as the workshop's live bake.

## WHAT IS LEFT (16 s against 10)
- BEGIN lights at about 11 s at 4x: parsing the two pages (0.9 s at full speed), the city frame's boot and first paints
  (about 0.8 s), his own body (0.2 s).
- From BEGIN to his first block, about 4 s: the BEGIN tap takes about 1.4 s to answer, a person's second, then 1 to 2 s
  from the tap to the first block at 1x travel.
- After BEGIN the screen is still 68 to 80% frozen for 20 s at 4x. Now the largest piece is the browser reading the late
  street-sprite files (eight script files of 1.6 to 4.2 MB, one freeze each, up to 2 s at 4x); next the ring's street a
  block a task (up to 1.6 s each), then repaints when each person lands. NEXT ROUND: smaller sprite files
  (tools/bohemia_city_chunk_tile_bank.py's chunk size, WORLD's tool) and none of them while he travels.

## CHECKS
THE DEMO BOOTS LIGHT 13/0: B11 new (the six come from the cut's file, all six, the cast before BEGIN 23 ms, was about
1,000); B9 re-aimed (the breath from the cut's file or after the door, never at the boot); B3 measures the live bake on
purpose (the path with no file). THE MAP ANSWERS AFTER BEGIN 11/0: M10 new (the crowd from the cut's file, 18 of 18).
Mutations: see the commit.
