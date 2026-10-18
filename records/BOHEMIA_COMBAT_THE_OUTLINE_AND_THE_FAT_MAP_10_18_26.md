# COMBAT [the outline and the fat map] -- 10/18 (rule 115f; the new age round, rules 112 to 116)

His words (10/17, the thirteenth votes): a NO on the lit fight, "a weird blue or orange outline
around people"; a YES note on both teams, "the map should just be really fat and change the view
however the screen is oriented".

## THE CAUSES, FOUND AND NAMED (measured on the fight, seed 31, the strip, 390x844 at 3x, 844x390 at 3x, 1440x900)

1. THE BLUE. nightAtlas() drew every man standing in the dark with his own silhouette filled in
   cold moonlight, MOON_RIM rgb(196,212,246), one ART pixel out on five sides (three at full
   strength, two at 55 percent), behind him. The atlas is 112 px a frame and a man stands about
   104 css px on a 3x phone, so one art pixel is about three device pixels: a pale blue line round
   every man in the dark. The atlases themselves are clean (every edge pixel opaque black, zero
   semi-transparent pixels in you.webp and cast_longcoat.webp), so the fringe was the code's.
2. THE ORANGE. The side ring under each man was 0.72 of his height across (h * 0.36 radius) in
   bright gold #d9a85a (yours) or orange-red #c4553f (theirs); his figure is 0.41 of his height
   wide (figure_bbox 42 of 102). A bright arc stood out past both his sides: an orange outline.
3. THE HOLES IN THE MAP. The map around the board (SURROUND_BLOCKS, two blocks on every side) is
   dealt from the board's kinds, which includes blocks the board itself does not use. bakeBoard()
   loaded only the board's own blocks, so a ring block like corner.2 never loaded and left a hole:
   the night pass paints a transparent hole moon blue, the day leaves it black. Upright the holes
   sat off the glass; sideways they were two flat blue-grey slabs left and right of the fight. The
   old NO BLACK leg missed it because it looked for the background colour only, by day only.

## WHAT CHANGED (slices/BOHEMIA_FIGHT.html)

- ONE RIM FOR EVERY LIGHT: the night rim is now the day rim, dark ink rgba(16,11,6,.9), one pixel,
  four sides (rimOf, RIM_AT, shared with dayAtlas). The moon still lifts the man (MAN_MOON 0.5), so
  he still reads off the night's ground; the sun test's man-off-ground leg stays green.
- THE RING UNDER HIS FEET: RING_W 0.27 (0.54 of his height across, his figure plus a little), in
  the side's colour with the shine out (RING_YOU #b0925e, RING_THEM #a65a46). The reach ring on
  the board (RING_FILL, RING_EDGE) is untouched; [the marks on the board] owns their redraw.
- THE FAT MAP LOADS WHOLE: bakeBoard() loads every block surround() deals. Sideways the screen is
  city edge to edge at the open and pinched all the way out, upright and on a laptop too.
- Rule 104a's numbers stand (four tiles north and south upright: 4.9 measured; both teams on the
  glass on every screen); no number of the fight moved.

## THE GATE (gates/the_rebuilt_fight_plays_gate.js, outlineFatMap, three new legs, red on the old file)

- NO COLOURED FRINGE ON ANY MAN: every pixel the rim adds is dark (luminance 40 or less) with no
  colour (channel spread 24 or less), in the dark and in the light, on three screens. After: 0 bad
  of 14,168 rim pixels, the brightest 12. Before: the moon rim at about 210.
- THE SIDE RING SITS UNDER HIS FEET: the ring's width at most the figure's plus 0.15 of his height.
  After 0.54 against 0.41; before 0.72.
- THE FAT MAP HAS NO HOLES: every dealt block loaded, the ring canvas with no transparent pixel
  outside the board, under a thousandth of background on the glass, three screens, night and day,
  pinched all the way out. Before: corner.2 missing at eight places sideways.

## THE VETERAN'S TEN PERCENT (the coordinator's note, sweep AM; TUNING's table c07dfff9)

The fight does not read ours.veteran_death_chance, ON PURPOSE. The third votes (9/28) said a
veteran of about twenty fights dies at 10 percent; the fifth votes (10/1,
laws/BOHEMIA_ADDENDUM_THE_FIFTH_VOTES_10_1_26.md item 5) ruled WHO DIES again: "a flat 20% when
no perk is in play; a little more per debilitating trait or injury carried". Newest date wins: the
veteran row is dead, and the fight's fall() reading ours.struck_down_death_chance (0.2) is the
ruling. Nothing in the repo reads the row (engine/bohemia_long_injury.js names it in a comment
only). The row now carries superseded_by and read_by in records/target/bb/ours.json so TUNING's
table can mark it. OWED, not built this round: the fifth votes' "a little more per debilitating
trait or injury carried" has no number yet; that number is TUNING's to research (how Battle
Brothers' death roll moves with a carried injury), then the fight reads it.

## IN VOTE

combat-no-coloured-outline-10-18 (slices/vote/COMBAT_NO_COLOURED_OUTLINE_10_18.jpg, night, the
same frame before and after at one art pixel to one phone pixel) and combat-the-fat-map-sideways-10-18
(slices/vote/COMBAT_THE_FAT_MAP_SIDEWAYS_10_18.jpg, the phone turned, before over after).
