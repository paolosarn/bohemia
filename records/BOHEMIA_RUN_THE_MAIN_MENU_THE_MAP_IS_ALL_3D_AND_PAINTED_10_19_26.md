# RUN, 10/19 (run-3d-10-19): THE MAIN MENU, THE MAP IS ALL 3D, THE MAP HE OPENS IS PAINTED

Opened by the coordinator (rule 112), rule 121's work week: RUN's three rows in order, implementation of what exists, no new art.
His words (records/BOHEMIA_PAOLO_THE_WORK_WEEK_FOUR_LANES_AND_THE_3D_MODELS_IN_10_19_26.md): 'fix the main menu screen on the demo...
we have to do a full implementation of the 3D models, that's top priority... it's just looking so fucking bad... the main map is
looking so bad, bro, it's really sad.'

## 1. [the main menu] SHIPPED d6fe63d0 (pages run 3465 SUCCESS), BUILD 10/19a - THE BARE FRONT
- Branch run-cut (run-opus-cut2, cut off by the cap) held two unpushed-to-main commits: the bare front screen on (CUE 6.95, his
  'just the crazy font, no card'), the title's desert wind, real shoes under travel (CUE 7.1), the turned-up truck on the I-15.
  Replayed onto main; main's rig cast kept (CHARACTER had re-baked it in each gang's own skin since, 5e83eb13).
- Looked at on 390 x 844: NEW GAME opens the crew picker; the long stamp ('THE BARE FRONT, THE DESERT WIND, ALL THIRTEEN WALK')
  wrapped onto itself over BEGIN, so the stamp is one line now.
- The front gate's classic leg opened the alpha 'switch untouched' expecting classic; after the flip it sets classic itself (42/0).
- Stopwatch (rule 94): 10/19a title 1.7 s, the door 13.4 s, median of 5 (12.5 to 14.4) on this box.

## 2. [the 3D models in the demo] 770b305e (pages run 3469 SUCCESS), BUILD 10/19b - THE MAP IS ALL 3D
- MEASURED FIRST: on the demo's map only a gang's roaming party wore the rig. HIM (PLAYER_CV, the old baked body), his two men,
  every crowd, every gate crowd, the crew on a job and a party with no gang were the street's old flat cast (CAST_CV).
- tools/bohemia_bake_the_rig_cast.py bakes a second sheet, slices/BOHEMIA_RIG_PEOPLE (392 frames, 473 KB, 98 x 143 cells, feet
  at 135), from cards he voted up: body (CHARACTER's 3D twin of his own flat body), coil_crown / temple_taper / layered_fall (the
  barber's 3D man), thug / marksman / poacher_again (COOK THREE). All render at 57 px a metre, the gangs' scale. The gangs' sheet
  comes out byte-identical.
- __THE_MAP_IS_ALL_RIG__ (slices/BOHEMIA_CITY_WORLD.html): him = body (walks, eight facings); his two men = coil_crown and
  temple_taper; crowds = the three cuts; a gate crowd = the place's own gang between the cuts; a job's crew and a gangless party =
  the tiers. Rule 121(e): nobody is drawn from either sheet until both are in; until then the map draws nobody (him: his old body,
  alone, for that second); COOK's flat marks only if a sheet FAILED. __RIG_CAST_OFF still puts the old cast back for a before
  picture. On the opening screen: 62 rig people drawn, his 'how' reads rig3d.
- No beast is drawn on the map at all, so there was nothing to swap.
- VOTE run-the-map-is-all-3d-10-19 (before and after, 390 x 844, 1:1). Stopwatch 10/19b: door 13.6 s (13.2 to 14.6).

## 3. [the main map looks good] BUILD 10/19c - THE MAP IS PAINTED
- MEASURED: on his opening screen (a block 18 CSS px) every block was its pack picture shrunk to 18 px, one speckle for every
  district, the freeway a string of separate tiles; and 247 glowing beads over the arterials BY DAY: the power grid's lit cells
  (__THE_MAP_HAS_NEVER_DRAWN_THE_LIGHTS__, 9/13), drawn at every hour. His words on it: 'the freeway... should be unified, it
  doesn't look unified, it looks really bad' (run-the-streets-join-10-18), 'the districts are looking like shit... doesn't look
  connected' (sounds-the-map-hears-the-desert-10-18), 'what are the peach colored dots' (9/22).
- THE PLACING: the painted city he said YES to at the far end ('good as long as it procedurally generates with the rest',
  run-the-far-end-is-painted-10-2) now carries the opening zoom: the freeway one band, the streets one net, the districts apart.
  All painting below a block 16 px, 0.89 painting over the pack tiles at the opening 18, the tiles alone past 34 (the blocks' own
  art comes back when he pinches in). The grid's dots only after dark.
- PAOLO'S PIXEL FLOOR HELD (rule 38a, MAP DENSITY G2, a painted unit at most 1.5 device px at the opening zoom): the painting at
  its old 12 texels a block read 2.38 x 1.55 and was never shipped. The painter now scales every size with its resolution (Q =
  S / 12: the same nine houses a block, the same road markings; at 12 it draws exactly what it drew) and paints at 24 texels a
  block: alone it read 1.50 x 1.24, on the line. With the pack tiles' grain at 0.11 under it, 1.23 x 1.15 (main read 1.39 x
  1.42). Said plainly: part of that reading is his pack tiles showing through at 11 percent; on the glass it reads as a faint
  grain on the freeway and the yards.
- COST: the painting is baked in the worker (1.4 to 1.8 s there) and lands 1.1 s after BEGIN (3.3 s on the 4x profile), under the
  clouds; the pictures are 2400 px square (three of them, about 69 MB, was 17). The far stop averages a texel under a device pixel
  down (smoothing on minification only, never on magnification).
- Gates: MAP DENSITY 13/0, THE FAR END IS PAINTED 11/0 (F7 re-aimed: painting at the far stop and the opening zoom, none at the
  near stop), THE VALLEY HAS AN EDGE 14/0 (E13 ONE LIGHT is red on main, green here), THE FAR END AT THE PHONE'S PIXELS 8/0, THE
  MAP AT THE PHONE'S PIXELS 16/0, THE NEAR END IS THE BLOCK 9/0. faction_towns_gate reads the grid at night now (it crashes on
  main identically on '#daycardIn .dcgo').
- VOTE run-the-map-he-opens-is-painted-10-19 (before and after, 390 x 844, 1:1).

## RED ON MAIN, NOT THIS ROUND'S (each run against main's own files)
one_engine_gate and demo_gate (their taps never pass the front door, classic or bare); THE FACE ON THE MAP IS HIS A2 (the bridge
regex) and B2 (its page's map canvas is 1 x 1); THE ZOOM GOES THROUGH CLOUDS C1 (411 to 548 ms against 400, both trees);
faction_towns_gate (crash); VOTE TAB (DYNASTY's two whys). The full suite was not run (rule 13).

## WEAK
- Crowds and his two men are the same barber man in three cuts, dark tank tops on dark ground; RUN TWO's [no two people alike]
  (rule 121(i)) brings the mix, and RIG_POOLS is where it plugs in (a NOTE on RUN TWO's board).
- The demo's DEMO_CAST / DEMO_CROWD bakes (the old cast, 2.2 MB) are still made and fetched though the map no longer draws them.
- At night the grid's beads are back on top of the painting's own lit windows and lamps.
