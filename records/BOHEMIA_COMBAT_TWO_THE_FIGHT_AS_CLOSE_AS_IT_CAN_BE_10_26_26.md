# COMBAT TWO 10/26: THE FIGHT AS CLOSE AS IT CAN BE (rows [the fight frames around the phone] and [the fight's camera follows the fight]; rules 288(b)(c)(d), 230(a), 213(c)(e))

## HIS WORDS
'from the map into combat we always want everyone, the enemies to the crew, as zoomed in as possible until we start touching and
moving the camera... so even in combat, as it gets smaller and smaller, it fits the screen and you see the details and your
characters bigger than when they were zoomed out' (records/BOHEMIA_PAOLO_OFF_CENTRE_ON_THE_MAP_AND_THE_FIGHT_AS_CLOSE_AS_IT_CAN_BE_10_26_26.md).

## MEASURED BEFORE (the camera on main 0c37e364, the same fights, the phone put up the way the shell puts it)
- The fight framed both teams at the open and then only ever let go: a new round refit only when a man left the glass or the
  lines came 15% closer, so as men fell the frame grew looser. Computer, AUTO, 21 fighters to 10: zoom 0.607 -> 0.501 (it went
  OUT as the fight drew together). Phone upright 0.303 -> 0.309, the man 65 px both times.
- The man was capped at 98 css px (rule 21's 'the person may not grow'): on the computer he was 98 px at the open and 98 px at the
  end, whatever the zoom.
- The phone was not a margin: the fight centred on the glass between the strip and the bar, so on the upright phone the bottom
  ~106 points of the frame (558 to 664) were under the phone's band; on its side the right 122 points.
- A pinch or a pan took the camera for good (UI.pinched was never set back); a pan with one finger did not take it at all.

## WHAT IT DOES NOW (slices/BOHEMIA_FIGHT.html, THE FIGHT'S CAMERA block and THE AUTO-FRAME AND HIS TOUCH block; view code only)
1. THE OPEN AREA: the glass under the turn strip, over the bar at its tallest, and off UI TWO's BohemiaPhone.padding() while the
   phone is up (upright the band from the phone's top down; on its side the band beside it). The world point the camera holds is
   drawn at the open area's centre (OX, OY), so every aim, fit, follow, pinch and wheel anchors there, off the glass's centre away
   from the phone; the left/right setting and a turned device move it at once ('bohemia-phone' event and resize).
2. AS CLOSE AS IT CAN BE: every frame the camera's aim is the tightest frame of every fighter he can see, his and theirs: every
   man's figure (feet on his tile, head MAN_ROWS rows up, his body's width), where he stands, where he waits to walk from and every
   tile of a walk still to play; a falling man until he lies down; plus a tile (half a tile of ground past the outermost man on
   every side). Never closer than the near stop (the ground's art at its own pixels), never so far out the ring runs out.
3. IT FOLLOWS THE FIGHT: when the aim moves (a walk, a fall, a man coming out of the dark, the bar standing taller, the phone
   flipping) the camera glides there, in a beat when it closes in and half a beat when it eases out; the glide moves the glass's
   edges in straight lines (the reach is eased in one over the zoom), so a man inside the frame it left and the one it goes to is
   inside every frame between; a glide asked again for where it is already going keeps going (the turn's follow, a walk's start and
   a new round all asked for the same aim and each restarted it from a standstill); a glide asked from the frame starts on the
   frame's own clock (a late frame lost a beat of the re-fit).
4. THE MAN GROWS WITH THE GROUND: he is MAN_ROWS (1.8) rows of his own ground at every zoom, the size he already stood at the
   phone's open; never under half his size (EYES 10/5); near a whole number of device pixels to the rig's pixel he eases onto it,
   so he is crisp at rest and never jumps a whole size mid-glide. MAN_IDLE is no longer his ceiling.
5. HIS TOUCH: a pinch, a one-finger pan, the wheel, the keys and Shift are his; nothing moves the camera (no glide, no follow) until
   the start of his next man's turn (a turn of his men after the one he touched it in; while he sets his line, his first turn),
   then the auto-frame takes it back in a beat.

## NUMBERS (the gate's last run on the ship's tree, 51/0: rolled fights on AUTO at speed 3, the phone up; and the real demo)
- Phone upright (390 x 844, the open area 390 x 558): the open frame zoom 0.274, the man 55.9 px (main's camera on the same roll:
  0.255, 52 px, held out by the eleventh votes' four tiles); as the fights drew in, 0.311 and 0.354, the man 65 and 72 px.
- Computer (1440 x 900, the open area 1275 x 753): the open 0.520 and 0.617, the man 106 and 126 px; drawn in, 0.736 and 0.660,
  the man 150 and 134 px. (Before rebasing, a fight of the same kind on main's camera went OUT: 0.607 -> 0.501, the man 98 px all
  the way.) At the open the tile of margin costs the computer about a twentieth against main (0.396 against 0.416 on the formation).
- Phone on its side (844 x 390, the open area 722 x 234 to 255): the open 0.202 and 0.182, the man at his floor 49 px; drawn in,
  0.265 and the man 54 px; the other fight never came in past the floor (it ended 0.182, the box 80 -> 54 tiles).
- THE REAL DEMO (the demo's road fight with the toll crew, the real phone, the shell's top bar): upright the open 0.291, the man
  59 px, nobody under the phone; three left, 0.686 and the man 140 px. Computer 0.896 -> 1.07 (the near stop), the man 182 -> 218
  px. On its side 0.248, the man 51 px; the bar stood taller later (the open 191 -> 179 points tall), 0.229, the man 49 px.
- The flip (phone right to left while he decides): the open centre 361 -> 483 (on its side) and 803 -> 638 (computer), the frame
  the tightest again on the first frame after it, 55 to 73 ms; upright the open area does not move with the corner.
- His touch: a real two-finger pinch 0.274 -> 0.933 upright and 0.166 -> 0.563 on its side, the wheel 0.520 -> 0.840 on the
  computer; the camera did not move a point through END TURN and 9 to 13 frames of their turns; the tightest frame again 247 to
  277 ms after his next man's turn began.
- THE MAP'S EDGE: when the fighters stand near the board's side and the phone pushes the open centre over, the camera stops where
  the map around the board ends (no black, his eleventh votes) and the frame sits up to 64 points off the open centre, every man
  still inside the open area (the phone on its side, left: 520 settled frames held this way in one fight).
- The auto-frame costs 0.14 ms a frame (fitBoth 0.07, the bar's read 0.05) against a 12 to 20 ms draw (headless, measured).

## THE GATE
gates/the_fight_as_close_as_it_can_be_gate.js (THE FIGHT AS CLOSE AS IT CAN BE, registered). The open area is read off the glass
(#top, #bot at its tallest, the phone's rectangle), never off the page's sums; every frame of every fight is read through the
page's own draw. Legs per screen and corner: the open is the tightest frame plus a tile, centred, off-centre away from the phone;
no living fighter's body outside the open area on any frame (a man walking out of the dark read from half a beat after his crew
first sees him, counted); every frame a beat and two frames after the last walk, fall or change of who stands where is the
tightest frame again, centred; the camera never moves outside a glide; where the fight draws in a tenth the man is drawn bigger
(the law's one exception said in the line: a man at his floor both times); the phone flipped while he decides re-centres inside
two beats; a real pinch (two touch points through the browser's own input) or the wheel holds through END TURN and their turns and
lets go at his next man's turn. Three plants bite (the phone's margin ignored, a frame a sixth too wide, a touch that never lets go).

## FENCE KEPT
No line of the turn loop, newRound, beatMs/paceNow, fatigue, AP, retreat or any rule was touched (rule 288(e)); the turn loop's own
calls (follow, keepAll, the new round's refit, the walk's and the blow's glides) are unchanged and land on the auto-frame's aim.

## A CAMERA SET BY HAND IS HIS TOUCH
A bench, a gate or a tool that sets the camera straight (the zoom or the centre written, not glided) is read the way his touch is:
the auto-frame keeps its hands off until his next man's turn. 16 lines in gates and tools set FIGHT_UI.zoom or its centre to take
a picture; without this the auto-frame pulled every one of them back to the fighters on the next frame.

## ON THE NEWEST MAIN (rebased onto COMBAT's [one pace, on the beat] and [fatigue comes back every turn], UI TWO's phone pieces)
THE FIGHT AS CLOSE AS IT CAN BE 51/0, ONE PACE ON THE BEAT 11/0 (COMBAT's new gate: the camera holds no turn it did not hold),
THE FIGHT BY HAND QUICKER 20/0, NOBODY ON ANYBODY 14/0, THE PC PLAYTEST: THE FIGHT 27/0, THE FORMATION IS KEPT 23/0, ONE TAP TO SEE
16/0, THE PHONE 219/0 (the demo, the real phone: no press of the fight under it, combat time on the glass); EVERY ACTION ON THE BEAT
7/1 (the song's own beats leg: COMBAT's record names it, the grid's anchor moves run to run, main and here alike). COMBAT's camThere
(the follow holds no turn when the camera is already there) merged beside the auto-frame and reads its fitBoth.

## THE OTHER GATES THAT READ THE FIGHT (run on this tree before the last rebase; rule 13)
Green: NOBODY ON ANYBODY 14/0, THE FORMATION IS KEPT 23/0, HEIGHTS YOU CAN READ 4/0, ONE TAP TO SEE 16/0, THE PC PLAYTEST: THE
FIGHT 27/0 (its ladder leg now reads the ladder's top as the page draws it: the tighter frame put a low roof's ladder top past the
glass while a whole tile's top was not), THE LOSS IS UNDERSTOOD 15/0, THE GROUND REMEMBERS 8/0, WHAT THE CREW CAN'T SEE 7/0, A HOUSE
IS NEVER SMALLER THAN A MAN 7/0, THE FIGHT BY HAND QUICKER 20/0, WALK THROUGH YOUR OWN MEN 8/0, THE FIRST FIGHT TEACHES 10/0, THE AURA
29/0, THE FIGHT ON THE LIVE PATH 14/0 (the fight in the demo), SOURCED NUMBERS 10/0, A FAR TILE 5/0, HIS HEAD IS IN THE FRAME 12/0.
Red on main before this ship and the same legs red after (measured on main's fight file, not mine): THE HIT CHANCE LOOK 24/1 (H4-H9
covers bspeed), EVERY WEAPON HAS ITS RANGE BANDS 6/1 (B4, the same numbers both), EVERY ACTION ON THE BEAT 6/2 (his tapped walk NONE
on both; the motions-off count swings run to run on this machine: main 0 and 15 off, mine 29 and 13).
THE REBUILT FIGHT PLAYS, THE ART AT ITS OWN PIXELS pair: it measures the one tile at the glass's centre, and the new framing put the
centre half a row higher (tile 6,6 instead of 6,7 on seed 9's strip). Tile for tile the drawing is the same to the hundredth (day
1.06 and 1.38, night 0.41 and 0.74 on both builds), so on main the DAY half was the red one (1.38 at 6,7 against 1.2) and on this
build the NIGHT half is (0.41 at 6,6 against 0.5). A NOTE to COMBAT: a measure over the tiles on the glass would hold still.

## RE-AIMED BY THIS SHIP (the law moved under them, rule 288(b))
- gates/the_rebuilt_fight_plays_gate.js sizeOk and THE MAN READS AS A MAN: he is 1.8 rows of his ground at every zoom, never under
  half his size; at the near stop his size or more (was: MAN_IDLE exactly).
- gates/nobody_on_anybody_the_water_runs_on_gate.js leg 2: at the near stop 1.8 rows of his ground (was: MAN_IDLE again).
- gates/the_rebuilt_fight_plays_gate.js, the bank leg: ANIMATION's rig_melee and rig_hold sheets (the same rig model) count as the
  bank's frames; it counted only fight_rig and rig_idles and sat on its line at a headless 35 to 40 frames a second on main and
  here alike (main 28 blits at 14 frames, this build 23 to 30 at 11 to 15; the frame rate the same within the noise, measured).
- gates/the_pc_playtest_the_fight_gate.js ITEM 14: a roof is on the glass by its ladder's top as drawLadders draws it (was: a whole
  tile's top, looser than the drawing).

## WEAK, SAID PLAINLY
- THE MAP AROUND THE BOARD is two blocks (SURROUND_BLOCKS); zoomed out with the phone on one side it is not enough to centre a
  fight near the board's edge in the open area (above). A wider ring is memory (RUN's crash before the fight, 10/25), not mine.
- THE PHONE ON ITS SIDE: the bar stands 135 to 156 of the 390 points, so the open area is 722 x 234 and the frame holding two
  ten-man lines is zoom 0.20; there the man stands at his floor (49 px, half his size, NOBODY STANDS ON ANYBODY) and only grows
  past zoom 0.24. The lever is the bar's height on a phone on its side, not the camera (a NOTE to COMBAT and UI TWO).
- A MAN OUT OF THE DARK is drawn where his walk starts the moment his crew sees him, outside the frame, and the camera eases out to
  him in half a beat; the frame cannot know him before the rules show him.
- The four tiles past the line upright (his eleventh votes, 10/10) are no longer a rule of the frame: 288(b) asks for the tightest
  frame (newest wins). Upright the frame is held by the lines' width, so the rows above and below come from the glass's height; the
  rebuilt gate's FOUR TILES NORTH AND SOUTH leg still holds on its fight.
- EYES has not seen it (line 134, 152).

[bb Battle Brothers leaves the camera to the player on the tactical map (the library's keyboard shortcuts: W A S D pan, Page Up
and Page Down and the wheel zoom, Shift centres on the man acting); it never frames the fight for you. Ours frames everyone he
can see, as close as it can, and gives the camera to his fingers until his next man's turn.]
[analog horror: the fight is watched the way a night guard watches a lot on one monitor: the frame tightens on what still moves,
and widens, late and smooth, when something walks in from the dark at its edge.]
