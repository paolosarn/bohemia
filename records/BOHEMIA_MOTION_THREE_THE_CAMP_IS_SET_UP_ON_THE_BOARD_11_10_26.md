# MOTION 3: THE CAMP IS SET UP ON THE BOARD WHILE HE WATCHES (11/10/26)

VAMILY rule 444(a)(b) and 441 (FULLY BAKED), ask lines 568 and 569. Paolo 11/10: "the camping right after combat still is kind of
fucked and ugly: you start the timer up so time is going forward as it's getting set up, but maybe it should be the other way around:
you watch them set up the camp on the combat map itself, not pull out into the big map and then try to zoom back in, and then once the
camp is set up, then time fast forwards, just so you feel that little bit of love, getting to see your guys on the combat map next to the
rotten corpses... never putting any of our camp shit on top of any buildings."

## MEASURED BEFORE (main 04ead582a, the gate's own watch: P2, the order as it was, and the first build's own runs)

From the MAKE CAMP tap, every tenth of a second on the top page and a shot of the glass every 150 ms (the demo, his phone upright):
- THE GLASS LEFT THE BOARD: the loot screen went at about 1.4 s and the next 1.2 to 1.8 s were the map (the climb out of the board,
  `dive: grid`, 12 to 18 samples with neither the fight, a held frame nor the camp on the glass), then the camp grew back in from the map.
- THE CLOCK RAN THROUGH THE SET-UP: the camp's first hour went at about 1.5 s after the tap, before the camp was even on the glass, and
  the hours ran on through the whole set-up (48 to 53 samples with the clock moved before the set-up ended; on the picture's strip 07:00
  at the tap, 12:00 by 4.2 s, 21:00 by 8.8 s).
- THE WAIT: the camp's first frame came 10.1 s after the tap: the loot screen 1.6 s, the camp made at 2.0 s, then 8.1 s for the camp's
  hidden copy of the fight page (3.7 s of it the page loading, 1.8 s the board's bake, about 2 s the two lights composed and written).
- NOTHING OF THE CAMP ON A BUILDING held where open ground was near; where none was clear the piece fell back to its own spot wherever
  that was (found on the Strip: the fire on a closed tile).

## WHAT CHANGED

1. THE BOARD STAYS ON THE GLASS (slices/bohemia_motion.js, MOTION's file, __THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__). MAKE CAMP on a won
   fight's end screen marks the way home (the shell, one marked line beside CAMP THREE's: window.__CAMP_HOLD_BOARD). The fight's way home
   (AD.home) lays the board's last frame on the glass as it always did for the climb, and HOLDS it: no climb out to the map. The map takes
   the fight home and makes the camp under it; the camp's door (AD.camp) skips its grow back in and lands WORLD's moment between at once
   (btwFinish). The held frame goes on the frame after the camp's first frame is drawn on the fight's own view (11/10g: the same camera,
   every tile within a pixel), so the glass never leaves the board. window.__CAMP_HOLD_OFF = the way it was.
2. THE CLOCK WAITS FOR THE CAMP (slices/BOHEMIA_CITY_WORLD.html, a marked block: campSettingUp in campHour). No hour of the camp is taken
   while the camp's screen is not open yet, or its set-up (CAMP TWO's pitch; on the fight's board after a fight) waits for its ground or
   plays (BohemiaCampLook.settingUp). The set-up done, or tapped through (TAP TO SKIP, CAMP TWO's), the hours run over the same picture.
   Never longer than 15 s from the camp's first hour; only a camp made off a fight (MAKE CAMP on the loot screen, CAMP.fight): HEAL on
   the map and a rest in a town take their hours at once as before (their own gates hold that). window.__CAMP_CLOCK_DURING_SETUP = the way it was.
3. NOTHING OF THE CAMP ON A BUILDING (slices/bohemia_camp_board.js, inside __THE_CAMP_IS_THE_FIGHTS_BOARD__). Every piece was already laid
   on the board's open ground (the fight's own grid) when a spot was clear; when none was, it fell back to its own spot wherever that was.
   Now a piece with no open ground for it is left out (B.fvLeft, said by the gate), and a crowded man is moved to the nearest open ground,
   never onto a house, a roof or a wall. fvWhere reads where the camp stands, tile by tile, for the gate. A piece with no clear spot is
   looked for farther out first (the fire always on open ground); the man going through the dead kneels at his body's side. AND THE
   SQUARE AT THE STREET'S OWN LEVEL FIRST (measured on the Strip on its side, the second fight of a walk: the square fell on a step half
   a storey up, r0 0.45, and the camp, which stands at its square's own height, found open ground for none of its tents: three pieces
   left out, the fire on a closed tile): the square is picked on the street's own level first (CAMP THREE's grid.ok, never a raised
   tile), the raised ground fought on only where the glass has no street under it (the freeway's deck).
4. THE WAIT CUT (slices/bohemia_camp_board.js): the camp's hidden copy of the fight page is opened on a won fight's loot screen (the
   shell's spoilsOpen, a marked line; it bakes nothing: its own campBoardBake finds no square and stops), taken by the camp at MAKE CAMP
   and handed the real options (LEAVE lets it go); the light he stands in lands first, the other light is laid into the camp screen's
   own night slot when written (bohemia_camp_look.js boardLanded: never a re-pick, which moved the camera mid set-up).
5. ONE ON WATCH (slices/bohemia_camp_look.js): after a fight one man with an easy job keeps the watch (the lookout may lean on a house).

## MEASURED AFTER (this build, the same watch)

- The glass: the fight, its held last frame (the tape on PAUSE / MAKING CAMP) or the camp on the fight's own view at every tenth of a
  second, never the map, upright and on its side, on a suburb, the Strip and the freeway; the shots from the loot screen gone alike to
  the fight's last frame (Pearson 0.46 to 0.88 upright).
- The clock: the same from the tap to the set-up's end on all six boards (3.2 to 4.9 s of set-up), the hours running after; a tap mid
  set-up skips it and the hours run.
- The wait: with the hidden page warmed while he reads the loot (5 s, as a player does), the camp's first frame about 6.4 s after the
  tap (was 10.1 s), the held frame up about 5.3 s (was 9.2 s); the bake itself (about 2.4 s) is COMBAT's and unchanged.
- At rest: one man goes through the dead (where the glass shows a body) and one keeps watch on every board; every piece and every man
  on open ground.

## THE GATE

gates/the_camp_is_set_up_on_the_board_gate.js (THE CAMP IS SET UP ON THE BOARD, SOLO, registered).

## [bb] and [analog horror]

[bb] Battle Brothers' camp is a toggle on the world map and the world keeps time while it stands; ours keeps the fight's street and stops
the clock until the camp is up, then lets the hours go.
[analog horror] the same frame held: the bodies where they fell, the living starting a fire beside them, and only then the tape runs.
