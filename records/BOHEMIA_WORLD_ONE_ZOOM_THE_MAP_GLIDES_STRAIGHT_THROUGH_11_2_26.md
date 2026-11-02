# WORLD 11/2: ONE ZOOM, THE MAP GLIDES, STRAIGHT THROUGH A CROSSING (ask lines 276, 272, 250; BUILD 11/2w)

His words (records/BOHEMIA_PAOLO_NOTES_WHILE_THE_KITCHEN_IS_CLOSED_10_27_26.md notes 3 and 6):
- 276: 'when I zoom in even more on the map then I just see a re-printed out combat map... a weird angle... why can't the graphics
  just get better as you zoom in, why does it have to enter a whole second map mode... very annoying'
- 272: 'on the map more things to glide, it feels like nothing on the map is gliding... when you're reversing [traversing] on the map
  it moves block by block at a time... I want things to look less choppy'
- 250: 'if they're coming up to a four-way intersection for them to go all the way to the right they'll go to the north street and
  then go to the east street... they won't go through the intersection when they walk'

All measured on the demo at phone size (390 x 844, 3x) through tools/bohemia_drive_the_demo.js.

## 276 ONE ZOOM, NO SECOND MAP MODE
- WHAT IT WAS: the 10/26 street (__THE_MAP_ZOOMS_IN_TO_THE_STREET__, rule 258). Past the map's closest stop the same pinch went on:
  the camera turned an eighth of a circle and tipped to the fight's straight-on camera, and the painting gave way to the fight's own
  blocks (COMBAT TWO's street_ground). That is his 're-printed combat map at a weird angle'.
- NOW: off (STREET.on false, slices/BOHEMIA_CITY_WORLD.html, __ONE_ZOOM_NO_SECOND_MAP_MODE__). From the far stop to the closest
  one the map is one painting and one corner-on camera, sharpening as he pinches (rule 142's tiles); the pinch stops at the closest
  stop, where a block's 256-px art is one art pixel to one device pixel (__THE_NEAR_STOP_IS_THE_ART_AT_ITS_OWN_PIXELS__), the
  place the map's own art still holds up. The street's code stays, every hook asking streetIsOn(), so his later call on one
  continuous zoom down to the people (the finish line, stage 1 item 3 and 'one world, one camera') can plug in; what comes back
  past the stop must keep THIS camera and get more detailed, never turn.
- GATE: gates/one_zoom_no_second_map_mode_gate.js (replaces archive/the_map_zooms_in_to_the_street_gate.js, superseded line
  written); gates/the_near_end_is_the_block_gate.js N2 amended (the next squeeze at the closest stop changes nothing).
- MEASURED (the gate's own lines, phone): see the commit's proof line.

## 272 THE MAP GLIDES
- MEASURED BEFORE: a 35-block trip at the default 1.22x, turned back half way, every drawn frame sampled. The glide existed
  (ANIMATION 9/27) but lasted 'the gap since the last step', and at 1.22x the clock's extra block lands 73 to 118 ms after the
  beat's own (the spread step, noticed when the frame draws). That block was crossed in under a tenth of a second.
  Before: frame speed top 39.6 blocks/s (median 2.0), 75 frames standing still mid-journey, largest frame move 1.01 block,
  4 frames past 0.6 block (1 going, 3 turned back).
- NOW (__THE_MAP_GLIDES_ALONG_THE_ROAD__): every block he steps to joins a queue of blocks ahead of the picture; the picture walks
  it at ONE speed per step (the pad's own pace, a block every BEAT / TRAVEL_SPEED, nudged three tenths toward keeping six tenths
  of a block behind him), eases in at a journey's start and out on his last block, turns back where it is, and a jump over three
  blocks is still a cut. Where he IS still changes on the step itself. The roaming parties use the same follower at the pace of
  their own steps.
  After: frame speed top 3.75 blocks/s (median 2.17), 6 frames still (all at the turn back), largest frame move 0.34 block
  (one 140 ms frame of this box; 0.046 block a frame at 60 fps in the gate), 0 frames past 0.6 block. Parties: 28 glides, largest
  frame move 0.25 block (was 0.42).
- GATE: gates/the_map_walk_glides_straight_gate.js G1 to G5 (the 1.22x clock's own step times: top speed 1.16 times the median,
  the old glide 11 times with 125 still frames). gates/the_map_glides_gate.js (ANIMATION 9/27) still 14 of 14.
  gates/the_map_at_the_phones_pixels_gate.js P4 and P6 put the glide in flight and land it through the new fields.

## 250 STRAIGHT THROUGH A CROSSING
- MEASURED BEFORE: 226 four-way crossings in the valley; of 904 straight-across trips (an arm to the opposite arm), 678 went up a
  side street and over ([17,5] -> [18,4] -> [19,5]) and 226 through the middle. The cause: the route searches step in eight
  directions in DIRS order (N, NE, E, ...), so at the same length the diagonal that slips round a building's corner was found
  before the straight step.
- NOW (__STRAIGHT_THROUGH_THE_CROSSING__): a diagonal that cuts a corner (one of the two blocks beside it is street, the other is
  not) is never taken; the four straight steps are tried before the diagonals; PLAY's route pays a hair more for a diagonal. Shared
  by every route he walks: a tap (cityRoute), a town's door (townDoorWalk), PLAY (mapBestRoute). A diagonal between two streets
  that touch only at a corner still goes, so nothing reachable was lost.
- After: 904 of 904 straight through the middle, 1808 of 1808 turns through the middle; 400 random trips, 0 corner cuts, 0 lost.
- GATE: gates/the_map_walk_glides_straight_gate.js C1 to C4 (the old search: 226 of 904).

## LEFT
- The alpha (the workshop) still swaps to the old walk past its closest stop (rule 18g, until [no city walk] excavates it); the
  demo is what he plays and it no longer does.
- One continuous zoom past the near stop (Project Zomboid close-up) is HIS decision for later; nothing was built for it.
