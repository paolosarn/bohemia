# IN AND OUT THE IPHONE'S WAY (PLUMBER 8, 11/27/26; VAMILY rule 484(a) amended, ask row 761, with COMBAT FIVE; rule 441)

Paolo 11/27: 'combat keeps crashing, like when I get into combat and then when I finish it, it's insane'. After the leak fix
(11/26zp, zq). His phone is Safari on an iPhone: it kills a page on far less memory than this box's Chromium, and it counts every
canvas's pixels against the page until the canvas is emptied or collected.

## HOW IT WAS MEASURED (the iPhone's count)

The demo upright, CPU 4x, the canvas on a GPU process; the same road fight from the map, won, the spoils, home. NOTHING COLLECTED BY
FORCE. Every 300 ms through every step (the map, the way in, the fight, the spoils, the way out, the map again): every canvas alive in
every page (made in code, kept by weak reference, or written in the page; width x height x 4), every ImageBitmap not closed, every
decoded picture (an img's natural size x 4); the renderer's memory; each canvas and bitmap by the page and function that made it.
Probe: the scratchpad's inout.js, now the gate.

## WHAT IT FOUND (before, three fights)

| step | canvases | bitmaps | pictures | all |
|---|---:|---:|---:|---:|
| the map, first | 146 MB | 306 to 456 MB | 211 to 230 MB | 663 to 831 MB |
| the way in, the most | 277 to 356 MB | 505 to 575 MB | 92 to 234 MB | 868 to 1,032 MB |
| back on the map | 263 to 308 MB | 233 to 375 MB | 87 to 161 MB | 583 to 844 MB |

Back on the map, the canvases still alive were the zoom-down's layers (78 to 120 MB, removed, never emptied), the fight page's
written-in canvases (its board #cv 1170 x 2532 and four more; its own let-go empties only what it made in code), and the map's two
photographs of the glass for its fight zoom (fzSnap, 10 MB each), all waiting on a collector.

## THE CUT: __AN_IPHONE_COUNTS_EVERY_CANVAS_UNTIL_IT_IS_EMPTIED__ (with COMBAT FIVE's __THE_DIVE_FITS_AN_IPHONE__)

- The zoom-down's own canvases: COMBAT FIVE emptied them in the dive's file in the same round (__THE_DIVE_FITS_AN_IPHONE__: every
  picture the dive laid emptied as it comes off, the kept ones when the way home is over, the zoom stops kept rather than copied).
  This lane's own cut of the same thing (emptied a beat later, never in a dive's frame) was merged out in their favour: their file.
  NOTED FOR THEM: emptying the map's two glass-sized photographs in the middle of the dive stalled one frame 170 to 470 ms at 4x
  (THE ZOOM DOWN INTO THE BOARD P4, three runs; 32/0 with it held until the dive is over); their emptying at the dive's end passed
  P4 32/0 on the merged tree.
- The shell (BOHEMIA_ALPHA_0_9.html nfHome): the fight page's written-in canvases emptied 400 ms after it closes, the way home's
  picture already taken. Switch window.__FIGHT_KEEPS_ITS_PAGE.
- The map (BOHEMIA_CITY_WORLD.html fzLetGo): its zoom's two photographs emptied once the zoom down is over, on idle time.
  Switch window.__FZ_KEEPS_ITS_SNAPS.

## AFTER

| | before | now |
|---|---:|---:|
| canvases back on the map after a fight, nothing collected | 263 to 308 MB | 117 to 140 MB |
| the zoom-down's canvases alive back on the map | 78 to 120 MB | 1 MB |
| canvases at the way in, the most | 277 to 399 MB | 259 to 275 MB |
| the old way in the gate's plant (one fight) | | 212 to 316 MB (the zoom-down's 112) |

## THE IPHONE BUDGET (from the research, 11/27)

- WebKit capped the canvases of one page at a share of the phone's memory (maxActivePixelMemory): 256 MB reported on an iPad on iOS
  12, 288 MB on an iPhone X, 384 MB on iOS 15; the fix the reports name is the one this round ships (a canvas's width and height set
  to 0 before it is dropped). WebKit took the cap out in June 2023 because pages were killed for memory first (bugs.webkit.org 190280,
  195325; trac.webkit.org r193500; pqina.nl's write-up).
- An iPhone's tab process (WebContent) is killed by jetsam past a soft limit of about 1.5 GB (WebKit engineers on bugs.webkit.org
  277848 and Apple's developer forums; logs show 1,536 MB soft and 2,048 MB hard on a 12 GB phone; lower on phones with less memory).
  When it is killed the page goes white or reloads: his answer A.
- THE BUDGET: canvases at most 256 MB at every step (the lowest cap reported, for an older iOS); every live picture (canvases, bitmaps,
  decoded pictures) at most 768 MB at every step, half the tab's soft limit, the rest for the code, the heap, the page and the sound.
- MEASURED NOW (the gate's run): canvases 220 MB at the most, INSIDE; every live picture 1,027 MB at the most, OVER BY 259 MB, 747 MB
  of it bitmaps: the fight's (ask row 768, COMBAT FIVE) and the map's 233 MB (ask row 769, CHARACTER 2 and WORLD 13). Printed by the
  gate each run; its ratchets (I4 1,250 MB, I5 300 MB) may only come down to it.
- The spoils page's canvases are emptied as it closes too (__SPOILS_PAGE_EMPTIED), so every fight page is let go at LEAVE.

## THE MAP LETS ITS SHEETS GO UNDER THE FIGHT (BUILD 11/27n; ask row 769, the coordinator's to this lane)

The map's people sheets were bitmaps held the whole session, under the fight too (151 MB in 10 after one fight; 14 to 17 sheets,
about 200 to 260 MB, after two, as more people come on the glass), and its idle sheets 82 MB.
- __THE_MAP_LETS_ITS_SHEETS_GO_UNDER_THE_FIGHT__ (BOHEMIA_CITY_WORLD.html __mapSheetsLetGo / __mapSheetsAgain): when the zoom down has
  landed on a fight (the shell's NFC state goes 'off' with a fight up, read by a setter in BOHEMIA_ALPHA_0_9.html, so the dive's file
  is untouched), every sheet bitmap is closed and its sheet marked to be asked again, the idle module's release drops its sheets, and
  no sheet loads while held (rigSheetLoad; engine/bohemia_idles.js sheet() under __IDLES_HELD). nfHome asks for every one again while
  the way up plays; their landings draw the map once, after the dive (no whole-map draw under the climb for each sheet). A frame still
  naming a closed sheet draws nothing and takes the new sheet when it lands (rigSheetLive over a WeakMap of the closed ones).
  Switch window.__MAP_SHEETS_KEEP.
- MEASURED (the gate, two fights): let go 3 and 17, asked again 3 and 17, every one back. The most alive in and out 907 to 1,018 MB
  (it was 1,027 to 1,100): over the 768 budget by 139 to 250 MB, the swing being the landing itself, where the fight's sheets (decoded
  at the meet card) and the map's (still drawn by the dive's zoom stops) are both alive for a moment. THE ZOOM DOWN INTO THE BOARD
  32/0 (no stall on the way in or back), THE WHOLE LOOP PLAYS 11/0, MAKE CAMP FROM THE FIGHT 11/0.
- WHAT IS LEFT OF THE OVER: the fight's own bitmaps (ask row 768, COMBAT FIVE: decoded at the meet card, 400 to 600 MB at the most);
  the map's sheets at rest (CHARACTER 3, the sheets smaller); letting the map's go at the dive's last zoom stop instead of the landing
  would take the overlap out (the dive's file, COMBAT FIVE's).

## WHAT IS LEFT: THE BITMAPS (the most of the peak; filed)

At the most of a fight, nothing collected, about 1,000 to 1,100 MB in all, and 570 to 750 MB of it is ImageBitmaps. An iPhone can
throw away a decoded picture's pixels when memory runs low and decode it again; a bitmap it cannot: they stay until closed.
- THE FIGHT'S (COMBAT FIVE, ask row 768): four block pictures of 2575 x 1820 (18 MB each, 72 MB: BOHEMIA_FIGHT.html about line 6676),
  thirteen sheets 2048 x 799 and up (47 MB, about line 10349), ten idle sheets (30 MB, bohemia_idles.js 149), one 16256 x 128 (8 MB);
  and its canvases: ringCanvas 48 MB (about line 7224), bakeBoard 21 MB (6638), draw 11 MB (9729), #cv 11 MB. Closed and emptied
  when the fight goes (RUN's __fightLetGo), so they are the way in's and the fight's, not the map's.
- THE MAP'S (CHARACTER 2 and WORLD 13, ask row 769): its people sheets made bitmaps to decode off the frame (11/26,
  __A_SHEET_DECODES_OFF_THE_FRAME__): 151 MB in 10 (BOHEMIA_CITY_WORLD.html about line 50012); its idle sheets 82 MB in 12
  (bohemia_idles.js 149). Held the whole session, under the fight too. And its pictures at rest (ask row 751): vbCityLand two
  2400 x 2400 (44 MB), vbViewLand 17 to 35 MB, vbTileLand 13 MB, vbLand 12 MB, the ground 10 MB.

## TAKEN BACK: 11/26zr's wake (ask row 724)

THE MAP ANSWERS AFTER BEGIN went 9/3 (M1 his first tap on the map never taken, M3, M11) on main's own files this round. The alpha's
block-a-time wake (11/26zr) was the first suspect; with the map from before it the gate went 12/0 once, then 9/3 again with it taken
out: the gate fails in about 6 of 10 runs on this box at 4x whatever the tree. The evidence on the wake is mixed, and a tap that does
nothing is worse than a freeze, so the wake is taken back (the door's longest freeze is 4.6 s at 4x again) until the gate is steady.
Filed: ask row 770 (THE MAP ANSWERS AFTER BEGIN is unsteady on main, its first tap).

Gate: IN AND OUT THE IPHONE'S WAY (gates/in_and_out_the_iphones_way_gate.js, solo, in the suite): two fights in and out, I1 the
zoom-down emptied, I2 the fight page's written-in canvases and the map's zoom photographs emptied, I3 back on the map at most 170 MB of
canvas with nothing collected (the merged tree 130 and 140), I4 a ratchet on the most at any step (1,250 MB, only down), P1 the old way past I3. 6/0.
THE ZOOM DOWN INTO THE BOARD 32/0, MAKE CAMP FROM THE FIGHT 11/0, THE WHOLE LOOP PLAYS 11/0, EVERY FIGHT HANDS HIM BACK 10/0,
TWENTY FIGHTS (four fights) 10/0.
