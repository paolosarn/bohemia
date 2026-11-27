# FIXES 4 -- LEAVE LIGHTS ON THE GLASS (11/27/26, BUILD 11/27zc, ask row 747 FOUND BY JOBS 2)

The row (FIGHT SCREEN 3's, FIXES 3's measurement left open): 'AFTER A FIGHT, A FINGER ON LEAVE MAY NOT REACH THE END SCREEN ... prove a
real finger on LEAVE always lands right after a fight, or find what takes the touch.' FIXES 3 (11/27) found the end screen grows in out
of the phone and asked whether a real thumb tapping the drawn LEAVE mid-grow ever misses. COMBAT FIVE's 11/27g (LEAVE ANSWERS) moved the
way home since, so this was measured fresh on main before anything was said.

## 1. THE INSTRUMENT

tools/bohemia_fixes_four_leave_mid_grow.js: the demo upright (390 x 844), one road fight a boot on AUTO. On the top page, every frame
from the moment #spoilsdoor is on the page: where LEAVE is DRAWN (its box inside the end screen carried through the frame's own drawn
box), whether the page's hit test there reaches LEAVE, whether LEAVE is lit (sp-live), the door's display/visibility/opacity/transform,
and whether anything under the door is animating. Then the thumb: the first frame LEAVE is lit, one real tap (touchscreen) at its drawn
middle; what took the pointerdown (top page and end screen both listened); whether it went home; if not, a second tap later.
`--before` lights LEAVE the old way (window.__LEAVE_LIGHTS_AT_ONCE on the top page) for an A/B on the same walk.

## 2. MEASURED BEFORE

- LEAVE lit 232 to 332 ms after the door was on the page at 1x (1,022 ms at 4x). At that moment the door was still INVISIBLE
  (opacity 0: MOTION 3's door, slices/bohemia_motion.js watchSpoils, holds it under the board until this page is drawn) and the screen
  had not come up yet; MOTION's door then grew it out of the phone's corner (a 156 x 185 box at 227,82 jumping to the full glass, 1.03
  overshoot, landing at about 0.45 to 1.07 s at 1x, 2.3 to 2.6 s at 4x).
- So the frame LEAVE lit, its spot on the glass showed the fight and the phone, not LEAVE. A thumb there pressed what it saw: the
  phone's fight-row button (#bohphone .app.sm: 4 traced first taps, 1x and 4x) or the bare page (1), and nothing went home.
- First taps the frame LEAVE lit, the old way: 6 of 8 missed (5 at 1x, 1 at 4x; two more 1x runs unrecorded); the second tap,
  seconds later, went home every time.
- ALSO SEEN, NOT THIS LANE'S (routed below): the end screen grows in TWICE. UI's __NOTHING_POPS__ ('end screen' row,
  slices/bohemia_ui_nothing_pops.js) pops #spoilsdoor out of the phone the moment it is on the page, a 263 ms stepped grow with
  will-change on a full-glass layer, while MOTION 3's door still holds it at opacity 0: that first grow is never seen. Then MOTION's
  door grows it again from its own box. Two owners for one door.

## 3. THE FIX (FIXES' own block, slices/BOHEMIA_SPOILS_SCREEN.html __LEAVE_LIGHTS_ON_THE_GLASS__)

LEAVE and MAKE CAMP light when the screen stands on the glass: this page's frame at its full box (its drawn box equal to its layout
box within a pixel), every element up its door opaque, nothing under the door animating, two frames running; 3 s at most (never
stranded), a timer behind the frame loop (a hidden page still lights), a page with no frame at once. LEAVE's own rule is FIXES 3's,
unchanged (open is enough), so no checker that presses LEAVE by script changes; only the light waits, and lit now means a thumb
there presses LEAVE. state.litAt and state.litWaits say how long and why (box, faint, moving).

## 4. MEASURED AFTER (the same walk)

- 1x: LEAVE lit at 1,012 to 1,089 ms (the frame the screen lands, its 1.03 overshoot the last thing waited on), on the glass every
  time ([0,0,390,844], opaque); the first tap went home 8 of 8.
- 4x: lit at 2,305 to 2,562 ms, on the glass; the first tap went home 3 of 3.
- To a person: LEAVE lights the moment the screen lands instead of before it is visible; nothing else moves.

## 5. PROVEN (rule 441)

- LEAVE LIGHTS ON THE GLASS (new, gates/leave_lights_on_the_glass_gate.js) 3/0: L1 the page; L2 the demo upright, two road fights:
  lit on the glass, the first tap home; L3 the phone slowed 4x, one fight, the same. PLANTED (lit at once): L2 red, lit at 300 and
  302 ms at a 156 x 185 box.
- LEAVE WAITS FOR THE SCREEN 5/0 (FIXES 3's); THE WHOLE LOOP PLAYS 11/0; MAKE CAMP FROM THE FIGHT 11/0.
- THE SPOILS 18/1 and THE AFTERMATH 17/3: the same on clean main (A/B run here): THE SPOILS's walk (main's since 11/14), THE
  AFTERMATH's D2 NEVER BLACK (quarantined, ask row 578).

## 6. ROUTED

- UI FIVE (slices/bohemia_ui_nothing_pops.js) and MOTION 3 (slices/bohemia_motion.js watchSpoils): one owner for the end screen's
  door. The pop's 'end screen' row animates a door MOTION holds invisible; either the row defers to MOTION's door (the row's own
  `moving()` check cannot see a door that has not started moving yet) or MOTION's door drops its hold. Filed as an ask row.
- FIGHT SCREEN 3 (the row's owner): told on the row; nothing of its end screen moved but the light.
