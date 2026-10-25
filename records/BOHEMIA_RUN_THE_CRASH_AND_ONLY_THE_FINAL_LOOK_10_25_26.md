# THE CRASH BEFORE THE FIGHT, AND ONLY THE FINAL LOOK (RUN, 10/25/26, rows [the crash before the fight] and [only the final look loads], rules 173, 174)

PAOLO 10/25, playing on his computer: 'the game keeps crashing at random times, usually right before a fight loads up; maybe
it's because of the amount of people on the screen.' And: 'I'm still seeing the months-ago 2-D character skins underneath
everything... I'm sure that takes up memory... just have things that are going to be final visuals load... we don't need a
whole 2-D world underneath it... you say you're loading, I press go, and it's still loading ghost month-old bullshit before I
see the 3-D maps.'

One measurement served both rows (rule 174(d)). The method is the 10/24 crash round's
(records/BOHEMIA_RUN_THE_CRASH_THE_SAVE_AND_ONE_MAP_10_24_26.md), extended to the fight.

## THE INSTRUMENTS

- `tools/bohemia_run_the_fight_weight.js`: the demo as a stranger through the one driver, the widest company the door builds
  (THE BLOCK WATCH, twelve men) on OUTLIVED IT, and the biggest fights the game rolls (day 100, the party math's cap, the four
  road factions in turn), each the way he plays it: the map, the MEET card, ENGAGE, the fight's load, AUTO, the end screen,
  LEAVE, the map. At every step, in every frame: decoded pictures (one copy a file), canvases, decoded bitmaps, audio, the
  JS heap, DOM; the tab's real resident memory from the operating system for every renderer process; the high water every
  100 ms through each step; every request by step. `--press` reads the tab again after a CRITICAL memory notice, which is
  what a phone does before it kills a tab (it throws away every picture nothing is drawing): the number that matters.
- Chrome's own memory dumps (memory-infra) on the map and in the fight, to say WHICH memory.
- A screencast of every painted frame from GO, with the requests and a census of every drawImage in every frame by what the
  picture is (`gates/only_the_final_look_gate.js` carries it).

The phone's line, researched: an iPhone's WebContent process is killed near 1.5 GB (WebKit's own number, lower on phones with
less memory: [WebKit bug 279637](https://bugs.webkit.org/show_bug.cgi?id=279637)), and Safari refuses canvases past 224 to
576 MB by version, 384 MB on iOS 15 ([WebKit bug 195325](https://bugs.webkit.org/show_bug.cgi?id=195325),
[pqina](https://www.pqina.nl/blog/total-canvas-memory-use-exceeds-the-maximum-limit/)).

## 1. THE CRASH, NAMED IN NUMBERS

BEFORE (BUILD 10/25o, his phone's profile, twelve of his against thirteen brigands):

| step | tab (OS) | after the notice | pictures | canvases + bitmaps |
|---|---|---|---|---|
| the map | 1,086 MB | 694 MB | 546 MB | 134 MB |
| the fight loaded | 1,944 MB | 1,478 MB | 1,392 MB (bitmaps 547) | 771 MB |
| the end screen | 2,073 MB | 1,509 MB | 1,401 MB (bitmaps 567) | 785 MB |
| back on the map | 1,310 MB | 774 MB | 548 MB | 135 MB |

THE CAUSE: the people. Every man in a fight brought his look's sheet (25 drawn keys x 8 facings, 144 x 161 a cell: 17.7 MB
decoded) and his gun's (three gun classes x 8 facings x 15 keys: 33 MB decoded), held as full-size bitmaps, which nothing
can take back. The figures fill 18 to 21 percent of a body sheet and 2 PERCENT of a gun sheet: a gun sheet is 57 KB on the
wire and 34 MB in the phone. 127 such sheets, 2,584 MB decoded. Twenty-five men put the tab at the kill line after the
notice (1.5 GB) and its canvases and bitmaps at twice Safari's canvas line. His guess was right.

THE FIXES, AT THE SOURCE, NO MAN AND NO ART TAKEN OUT:

1. `__THE_SHEETS_ARE_PACKED__` (`tools/bohemia_run_the_sheets_packed.py`, `slices/fight_rig/packed/`, a block in the fight):
   every look and gun sheet is cut to the box its pixels fill, laid edge to edge in one atlas with a table. The fight holds
   the atlas; a PackedSheet answers as the whole sheet did and the canvas's drawImage reads the table, so every caller (a man,
   his gun, the night copy, the machine's chip, the red flash, the ghost's tape, ANIMATION's tear) draws the same cell into
   the same box. 2,584 MB -> 419 MB decoded. THE SAME PIXELS: eight sheets re-assembled from their atlases equal the sheets
   pixel for pixel (gate S2); the same seeded fight drawn both ways differs on 29,613 pixels, two unpacked runs of it on
   38,564 (the idles breathe; nothing else moved). IT CAN NEVER SHOW OLD ART: the fight asks the server for the sheet's size
   (a HEAD, nothing downloaded) and uses the atlas only when it is the size it was cut from; a sheet re-rendered since is
   drawn from its own new file, whole, until the packer runs (the gate names it).
2. `__THE_FIGHT_LETS_GO__`: when a fight is over the shell asks it to close every bitmap and empty every canvas it made,
   before its frame is emptied.
3. `__THE_MAP_RESTS_UNDER_THE_FIGHT__`: the map drew about 108 times a second under every fight, in a panel the fight hides;
   it now draws nothing until the fight is over.
4. The map's own dead layers (section 2) leave it lighter going into every fight.

AFTER (the same fights):

| step | tab (OS) | after the notice | canvases + bitmaps |
|---|---|---|---|
| the map | 975 to 1,001 MB | 586 to 614 MB | 90 MB |
| the fight loaded (12 v 13) | 917 to 990 MB | 907 to 978 MB | 263 to 322 MB |
| the end screen (12 v 13) | 951 to 963 MB | 943 to 956 MB | 276 to 318 MB |

TWENTY OF THE BIGGEST FIGHTS IN A ROW, his phone's profile (records/run/TWENTY_FIGHTS_phone_portrait.json when the gate runs;
the round's run is the same tool): 20 of 20 stood and ended, NO CRASH, no page error; twelve of his every time against 6 to
13; the most the tab held after the notice 1,240 MB (fight 19, in the fight; 260 MB under the line), canvases and bitmaps
at most 345 MB (under 384). His computer's profile: in the record's addendum line below when its run finishes.

WHAT IS LEFT, SAID PLAINLY:
- THE TAB KEEPS ABOUT 35 MB A FIGHT FOR THE FIRST EIGHT OR SO, then stops: after the notice the map read 595, 682, 719, 752,
  782, 812, 837, 855, then 850 to 892 through fight 20. Chrome's dumps put it in Blink's buffer memory (Vector and string
  backings). Ruled out by measurement: the packed sheets (it grows the same with packing off), AUTO play, the odds worker,
  the test server's caching (the same served like GitHub Pages), time on the map (no growth in a minute with no fight),
  the console, the save. It scales with the fight's size (13 MB after a small fight). It levels off, and the twenty-fight
  gate holds it to 60 MB over the last five (T5), but its cause is not named yet. Next.
- A fight's ground blocks are 2,575 x 1,820 (18 MB decoded each, eight a board): drawn at their own pixels close in, so they
  stay; the held, kneeling and reloading sheets (91 MB as bitmaps in the biggest fight) are already tight (39 to 49 percent
  solid) and stay bitmaps for draw speed.
- The map's people (rig_mix, the rig cast, the idles: about 380 MB decoded) are the next biggest weight on the map.

## 2. ONLY THE FINAL LOOK

BEFORE (BUILD 10/25o, his computer's profile, every painted frame from GO, the old build failing 4 of 5 legs of the new gate):
for 2.9 s after GO his OLD 2-D BODY (the black coat, the flat face) stood on the OLD PER-BLOCK PICTURES (red roofs, flat
blocks) under the fog; at 2.9 s the 3-D crew appeared on the old blocks; at 4.8 s the painted map replaced them. The first
frames came in a narrow phone-shaped column of the old city (the bench's start, no fog), then his corner. AFTER GO the demo
fetched the old street-tile bank (BOHEMIA_CITY_TILES_02 to 09 and READY, 28.5 MB) and the baked 2-D crowd
(BOHEMIA_DEMO_CROWD.json, 1.6 MB); before it, the baked 2-D cast (BOHEMIA_DEMO_CAST.json, 0.56 MB) and the towns' stand-in
pictures. The shell baked his old 2-D body, his walk a facing at a time all through play, the six of the crowd and their
breath, the rest of the crowd and the gangs' casts; the map decoded every one. BEGIN lit when five shallow stages passed (a
canvas, the clock, a party). The first frame after GO against the scene 3 s later: mean difference 53.7 of 255.

WHAT WAS TAKEN OUT OF THE DEMO (`__ONLY_THE_FINAL_LOOK__`: FINAL_ONLY in the map, OLD_2D_GONE in the shell, the demo only; the
workshop is unchanged):
- the late street-tile bank: never pulled (`BOHEMIA_CITY_TILES_LATE.js` and its generator); its building pictures, door
  clips and street families never made;
- the old per-block pictures: never drawn, not even before the painting lands;
- his old 2-D body, the crowd's and the gangs': never baked, never sent, never a stand-in (the map draws nobody rather than a
  stand-in, and the door waits, below);
- COOK's old flat marks for a failed sheet, and the towns' stand-in pictures (the towns are the painting's);
- the two baked 2-D files, to the graveyard: graveyard/old_2d_cast_10_25_26/ (POSTMORTEM there).

THE LOADING SCREEN TELLS THE TRUTH: a sixth stage, DEVELOPING THE PICTURE (draft:true), holds BEGIN until the map says its
final look is in (`mapFinalLook`: the land, the painted city with its towns, a 3-D person on the glass and every people sheet
the opening view asked for; a sheet that failed is not waited on; a 60-second ceiling the gate reads, never hit). On BEGIN the
shell hands the map its new game BY NAME before the screen lifts (`mapStartIn`), and lifts the screen two frames later once
the bar has the batteries and the place: measured, the first frame had read 0 batteries and the bench's SUBURB.

AFTER (`gates/only_the_final_look_gate.js`, both profiles, 5 of 5 each):

| | computer | phone |
|---|---|---|
| dead files requested, title to 12 s after GO | 0 of 195 | 0 of 186 |
| BEGIN held until the final look | yes, never timed out | yes |
| dead layers drawn after GO | 0 (400 draws, 23 sources) | 0 (240 draws, 22 sources) |
| first frame after GO | +75 ms, the scene he plays (0.34 against +3.5 s) | +3 ms (1.16) |
| title to GO | 10.9 s (was 5.3 s, then 4.8 s of old art) | 13.0 s |
| after GO, fetched | 2.3 MB (sounds, a face) | |

THE MEMORY IT SAVED (feeds rule 173): the map after the notice 694 -> about 595 MB; the map's canvases 134 -> 90 MB; its
counted pictures 546 -> 488 MB; 30.7 MB of old files never downloaded or parsed.

## 3. THE GATES, AND WHAT THEY CHANGED

New: `gates/twenty_fights_no_crash_gate.js` (T1 to T6 above, both profiles, about 15 min a profile),
`gates/only_the_final_look_gate.js` (F1 to F5), `gates/the_sheets_are_packed_gate.js` (S1 to S4, 4/0).

The driver: a file sent whole now says its size (GitHub Pages does; the fight's HEAD needs it), and A KNOCK IS NEVER A PICK
(while the door waits, the driver's tap in the middle of the screen landed on an origin card and started THE FRONT DOOR's
game as A NEW CREW: D5 and D6 red until fixed, 7/0 after).

RE-AIMED (RUN's own legs that measured the old 2-D bake on the demo now measure its absence): THE DEMO BOOTS LIGHT B3, B9,
B10, B11 (12/0); THE MAP ANSWERS AFTER BEGIN M6, M7, M9, M10 (10/2: M2 and M11, the 4x freeze legs, red on main too, frozen
46% where main reads 69%); THE FAR END IS PAINTED F12 reads the rig's people (11/0); THE FACE ON THE MAP IS HIS A1 reads the
demo's 3-D-only line (15/3, the same three as main).

Run on this tree, green: A STRANGER OPENS IT 18/0, APPROVED ART ARRIVES 7/0, DEMO BUILD 25/0, DURABLE SAVE 13/0, HERO WIRE
145/0, HOME SCREEN IS THE SAVE 27/0, MAP DENSITY 13/0, MEET BEFORE YOU FIGHT 8/0, SAVE IPHONE 78/0, THE LOADING SCREEN 29/0,
THE MAP STANDS UP 13/0, THE WIPE WAKES IN TOWN 8/0, A FRESH START AND A FOG OF WAR 8/0, THE FRONT DOOR 7/0, ONE MAN ONE LOOK
8/0, TWO HANDS 9/0. The same reds as main: A FRESH PHONE SEES THE DOOR 7/2, THE MAP AT THE PHONE'S PIXELS 15/1, FACTION
BETWEEN 80/2, THE FIGHT READS ONLY SOURCED NUMBERS 8/2.

OTHER LANES' GATES THAT MEASURE THE OLD 2-D BAKE ON THE DEMO (red now by rule 174, each a NOTE on its owner's row): CITY CAST
and CITY CAST SILHOUETTE (the cast reaching the demo's map), LATE ART (the late bank), TRADE FIT (the bake's names), THE
PARTIES WALK (its first leg waits for the 2-D walk bake; in a real walk his two men are drawn and walking on every frame,
measured), PEOPLE GATHER B4 (the walked street's crowd), VALLEY BREATHES (one leg), THE ZOOM GOES THROUGH CLOUDS C1 and C5
(C5 reads the clouds as pixel art, which 10/24's smooth clouds already changed). COMBAT's whole-grid gate ran 40 minutes and
was stopped: 6 ok, its one red the simulation's step cap (standoffs), not the drawing.
