# COMBAT SIX: THE FIGHT HOLDS WHAT IT SHOWS (11/27/26, BUILD 11/28a)

VAMILY rule 484 as amended 11/27 (Paolo: "combat keeps crashing, like when I get into combat and then when I finish it, it's
insane"; his answer A: the page goes white or reloads by itself, which is Safari on his iPhone killing the tab for memory), job (1)
of COMBAT FIVE's handoff: "the fight's held art by day: hold only what a fight shows, let it go at LEAVE". Built the rule 495 way:
the fix lives in the module that owns the fight's sheets (the packed sheets' block of slices/BOHEMIA_FIGHT.html), no new patch block,
no hook line, no special case for one screen.

## MEASURED FIRST (main 1caf2cd64)

The fight's own page, phone upright, 11 of his against 16 (27 looks), sampled every 2.5 s of AUTO play
(scratch probe: every entry of FIGHT_UI.imgs and HOLD.ims at its real decoded size, the atlas's own pixels for a packed sheet):

| what the fight held | MB at its most |
|---|---|
| body sheets (27 looks, packed atlases) | 106.7 |
| held sheets (rig_hold) | 92.4 |
| melee sheets (rig_melee) | 44.7 |
| ground blocks (half width on a phone) | 40.2 |
| street board houses | 28.1 |
| face strips | 12.3 |
| guns (body, held, own) | 14.1 |
| the kit | 6.5 |
| all | 346.3 |

COMBAT FIVE's 17.7 MB a body sheet was the sheet's virtual size (a PackedSheet answers the whole sheet's width and height); the atlas
it holds is 3.7 to 4.0 MB. The real waste was elsewhere:

1. THE FACE STRIPS: 12.3 MB decoded (faces.webp 16,256 x 128, faces_more 6,528 x 128, the camp's and the bosses') for the 6 to 27
   faces a fight shows. Three of the four strips held no face of anybody on the board.
2. THE DEAD'S LOOKS: when 15 of the 27 looks were worn only by men on the ground, their whole sheets stayed (body stayed at 106.67 MB
   from the first second to the last while the men alive went 27 -> 12). A man on the ground is drawn from one cell: his fall's last
   key at his facing (poseOf; the crawl is drawn off its own sheets; campBodies lays the same cell).
3. UNDER THE END SCREEN: the board rests (it is never drawn again; LEAVE and MAKE CAMP take the page away), and every held, melee and
   body sheet stayed alive until LEAVE. Through the demo the fight page's pictures at 'out' (LEAVE pressed, the way home) were the same
   as in the fight: 209.9 MB and 172.1 MB in two fights.

## THE CUT (slices/BOHEMIA_FIGHT.html, the packed sheets' block)

- sheetCut(P, keep): the same grid and the same table over a new atlas of only the cells kept (shelves, tallest first); a cell not
  kept is 0 by 0 and the cut remembers it was there (Q.whole). packedDraw, the night (nightCell through sheetDraw), the machine's chip,
  campBodies (it reads the table) and wearOver read a cut exactly as before. The night's id and the pick's light (NIGHT.ids, NIGHT.lum)
  carry over, so the darkened cells and the moon a man is given are the same.
- gridSheet(pic, cw, ch): a whole picture as a packed sheet of its own cells (the face strips), drawn exactly as the picture was.
- sheetsWanted(now, resting): per sheet, 'all' or the cells it must still hold: every face strip only the faces of the men on the board
  (a strip nobody here wears a face of: none); a look nobody standing wears: the cells its dead and struck-down lie in (after their
  fall has played two beats); a look of men who ran off the board (their run drawn to its end): none; a gun sheet nobody standing holds:
  none. Resting under the end screen: a body sheet only the dead the camp lays (campFromFight), a gun sheet none. A machine (it can
  reboot) and a decoy are never cut.
- sheetsHeldSweep: one cut every 2 s in play (a few cells drawn into one small canvas and one bitmap, never two in a frame); one a
  frame while the board rests.
- sheetsRest: the end screen covers the board: poseSweep(now, 0) lets every held and melee sheet go at once (poseSweep took an idle
  argument; 0 is every sheet, one still coming too), then the body sheets are cut a frame at a time.
- sheetMissed: a cut cell that is drawn after all (a man raised, a ghost in a dead man's look, the board drawn again) has the whole
  sheet asked back the way it came (the atlas or the file, decoded off the glass, sheetAgain), once; a sheet that had to come back twice
  is never cut again in that fight.
- window.__SHEETS_WHOLE: the old way (a gate's switch, never set by the game). FIGHT_PICS() now says cuts and back.

## AFTER

| | before | after |
|---|---|---|
| fight page alone, demo fight 1, in the fight (4x, upright) | 209.8 MB | 177.7 MB |
| fight page alone, demo fight 1, LEAVE pressed (out) | 209.9 MB | 102.3 MB |
| fight page alone, demo fight 2, in the fight | 172.0 MB | 144.1 MB |
| fight page alone, demo fight 2, out | 172.1 MB | 95.9 MB |
| the whole page at 'out', fight 1 / fight 2 | 447.7 / 421.0 MB | 348.1 / 350.4 MB |
| 11 v 16 bare, body sheets with 12 looks on the ground | 108 MB | 77.2 MB |
| 11 v 16 by night, the night's held peak (AUTO 4x) | 358.3 MB | 328.2 MB |
| the men's pictures under the end screen (gate H6) | 95.9 MB | 0.6 MB |
| IN AND OUT THE IPHONE'S WAY, the most alive at any step | 671 to 686 (PLUMBER 8) | 496 of 768 |
| TWELVE FIGHTS IN AND OUT upright, every live picture at its most | 711 to 774 over twenty (PLUMBER 8) | 703 |

(The demo's map side moves about 100 MB between runs with the people on its glass, so the fight page is counted alone:
tools/bohemia_combat_five_canvas_census.js with the page of each canvas and bitmap; before = the same build with __SHEETS_WHOLE.)

## GATES

- THE FIGHT HOLDS WHAT IT SHOWS (new, in the suite, gates/the_fight_holds_what_it_shows_gate.js): 12/0. H1 the faces (27 of 27, the
  three other strips 0, 0 channels differ over 27 faces), H2 the dead (cut to their cells, 0 channels differ, body 96 -> 79.7 MB), H3
  the night (0 channels differ at two moons, the moons the same), H4 a cut cell drawn brings the whole back (112 to 298 ms, the same
  pixels), H5 AUTO plays on twenty seconds, H6 through the demo at 4x (the end screen lets go, 95.9 -> 0.6 MB, LEAVE home), P1 the
  old way cuts nothing. About 6 minutes.
- MAKE CAMP FROM THE FIGHT 11/0; IN AND OUT THE IPHONE'S WAY 8/0; TWENTY FIGHTS HOLD MEMORY FLAT upright at 12 fights
  (BOHEMIA_MEM_FIGHTS=12, the twenty does not fit a 10-minute foreground call) 12/0; THE WHOLE LOOP PLAYS 11/0; LEAVE WAITS FOR THE
  SCREEN 7/0; EVERY ENEMY READS AT NIGHT 4/0; THE PATCH LAYERS ONLY GO DOWN R1 to R3 at the ratchet (FIGHT 29/428/3).
- RED THE SAME ON CLEAN MAIN, not this change: AUTO AT 4X NEVER CRASHES 6/1 (A3's 'the night no longer doubles the fight' is a ratio
  at 0.5: main 358.3 / 701.6 = 0.511 red; this build 0.500 to 0.503, the cut lowers both sides); THE FIGHT DRAWS WHAT HE WEARS 18/1
  (H2: 0 men dealt a body that carries its own weapon over 60 deals; the deal, not the drawing); THE PATCH LAYERS R5 pasted copies 42
  against 41 (hz and rngOf in bohemia_big_inside.js, bohemia_casino_floor.js, bohemia_flood_tunnels.js, bohemia_parking_garage.js;
  COOK SEVEN's insides and PLUMBER 9's).

## NOT DONE / NEXT

- The held and melee sheets IN PLAY (92 + 45 MB in the 11 v 16): a held sheet is irregular cells (x, y, w, h), not a grid, so the cut
  above does not reach it; a man with a long gun draws only 31% of his look's held sheet (CoverLong, CoverLongAim, CoverHit, LReload,
  CoverLReload), a pistol man 68%. The next cut: the held sheet's cells by the kinds his men carry (rig_hold.json guns), a table of
  their own over a cut atlas, the same miss path.
- The fight's own canvases (60 to 66 MB: the ring 24, the bake 21, the glass's ground sheet 11, the outline 13): COMBAT FIVE's ring
  is one canvas already; the bake and the ring are what MAKE CAMP stands on.
- The ground blocks (40 MB half width) and the street board's houses (28 MB) stay: the ring and the pinch read them.
- The idle sheets inside the fight page (engine/bohemia_idles.js, ~30 MB): ANIMATION's module, let go by __fightLetGo at LEAVE.

[bb Battle Brothers keeps a dead man's body on the field and nothing else of him]
[analog horror: the tape keeps the last frame of the dead and lets the rest of the reel go dark]
