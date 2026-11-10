# MOTION 3: THE CAMP IS SET UP ON THE BOARD WHILE HE WATCHES (11/10/26)

VAMILY rule 444(a)(b) and 441 (FULLY BAKED), ask lines 568 and 569. Paolo 11/10: "the camping right after combat still is kind of
fucked and ugly: you start the timer up so time is going forward as it's getting set up, but maybe it should be the other way around:
you watch them set up the camp on the combat map itself, not pull out into the big map and then try to zoom back in, and then once the
camp is set up, then time fast forwards, just so you feel that little bit of love, getting to see your guys on the combat map next to the
rotten corpses... never putting any of our camp shit on top of any buildings."

## MEASURED BEFORE (main 04ead582a, the gate's own watch, P2: the order as it was)

(filled from the gate)

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
   Never longer than 15 s from the camp's first hour; a rest in a town has no set-up. window.__CAMP_CLOCK_DURING_SETUP = the way it was.
3. NOTHING OF THE CAMP ON A BUILDING (slices/bohemia_camp_board.js, inside __THE_CAMP_IS_THE_FIGHTS_BOARD__). Every piece was already laid
   on the board's open ground (the fight's own grid) when a spot was clear; when none was, it fell back to its own spot wherever that was.
   Now a piece with no open ground for it is left out (B.fvLeft, said by the gate), and a crowded man is moved to the nearest open ground,
   never onto a house, a roof or a wall. fvWhere reads where the camp stands, tile by tile, for the gate.

## MEASURED AFTER

(filled from the gate)

## THE GATE

gates/the_camp_is_set_up_on_the_board_gate.js (THE CAMP IS SET UP ON THE BOARD, SOLO, registered).

## [bb] and [analog horror]

[bb] Battle Brothers' camp is a toggle on the world map and the world keeps time while it stands; ours keeps the fight's street and stops
the clock until the camp is up, then lets the hours go.
[analog horror] the same frame held: the bodies where they fell, the living starting a fire beside them, and only then the tape runs.
