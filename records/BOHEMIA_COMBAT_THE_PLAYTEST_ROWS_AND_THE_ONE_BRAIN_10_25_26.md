# COMBAT, 10/25 (combat-pc2): THE PLAYTEST ROWS AND THE ONE BRAIN

Opened by the coordinator (rule 112), no check-in. The order given: (1) [eyes: men on men]; (2) COMBAT TWO's two rows, carried
while COMBAT TWO is closed: [eyes: board seams] and [eyes: toy town]; (3) the fight board more organic, no glitches (rule 164
item 13); (4) the rest of the board, his words first. Rule 164 and records/BOHEMIA_EYES_THE_PLAYTEST_ROUND_2_10_25_26.md read
first. Last round's last push (33bdb785, the club under a roof, RETREAT) confirmed live first: pages run 3806 SUCCESS on
64c2139c, which contains it.

## THE SHIPS
| row | sha | gate |
|---|---|---|
| [eyes: men on men] | 501930de | NOBODY ON ANYBODY, THE WATER RUNS ON; THE REBUILT FIGHT PLAYS re-aimed |
| [eyes: board seams] (COMBAT TWO's) | a62d5bce | NOBODY ON ANYBODY, THE WATER RUNS ON |
| [eyes: toy town] (COMBAT TWO's) | HALF, 501930de | the men's side only; NOTE on COOK FOUR's board |
| [melee is one tile] + [cover is what is on the tile] (rule 170) | d5327c5a | MELEE IS ONE TILE, COVER IS WHAT IS ON THE TILE |
| [the PC playtest: the fight's part] (7), rule 164 item 13 | 89064c94 (+ a62d5bce) | NOBODY ON ANYBODY, THE WATER RUNS ON (THE GROUND RUNS ON) |
| [AUTO never wastes a turn] + rule 180 | e0f39941, CLAIMED (the brain in; four bars still open) | AUTO NEVER WASTES A TURN |

## 1. NOBODY STANDS ON ANYBODY (his first votes 9/21: 'why are so many people on top of each other... looks like complete dogshit')
MEASURED FIRST, his phone's open (390 x 844, four of his in one column, EYES' own case): a tile 53 x 37 px on the glass under a
98 px man (2.65 rows), each body over the two behind it; DANTE covered 62% of JAMAL (body box: feet to head, 0.3 of his height
across, the rig's man).
- THE MAN IS NEVER TALLER THAN 1.8 ROWS OF HIS OWN GROUND, on every glass (it was 2.8 on a wide glass and no cap upright), never
  under half his size; a whole rig size a hair over the cap (6%) is taken, so the phone's open shows the rig's whole two device
  pixels a pixel, 65 px, crisp (the man is blitted with smoothing off: a non-whole scale is mixels). Pinched in to the near stop
  he is 98 again: rule 21 where the ground holds him.
- THE FILE STANDS STAGGERED: a man stands a quarter tile left of his tile's middle on an even row and right on an odd one
  (Battle Brothers' hexes set every other row half a hex over), drawn, hit-tested and framed the same way (dx(), manBox, the
  three hit tests, fitBoth); the rules never see it; on a walk he eases across it (a cosine of his row).
- TRIED AND TAKEN OUT: spreading the line a tile apart (a breathe() over the crew screen's slots and the enemy's place()). It cost
  AUTO's tactics on THE REBUILT FIGHT PLAYS' own legs: AUTO's men alone in 26% of their fighting turns against the gate's 20,
  and the pike lost its two-tile strike from behind a friend. Battle Brothers' tight line is the tactics; the fix is the drawing's.
- The camera's fit (fitBoth) reads the same law for head room (it did not know the half floor: on a flipped phone against a
  nine-deep line a head went off the glass, measured).
MEASURED AFTER: worst body cover 0% at the open, phone upright (65 px on 34-37 px rows), phone on its side (65 on 36), tablet and
computer (98 on 55 to 121): two men of one column stand 0.50 of a tile apart sideways.

## 2. [eyes: board seams]: THE WATER RUNS ON, THE MAP AROUND THE BOARD COMES IN SOFTLY
MEASURED FIRST, on the art (block_shore_0/1.webp, 2,575 x 1,820): both shore blocks bend their water band down into a wall along
their own left edge (24 art px) and right edge (12 px); their banks sit 45 art px higher on the right edge than the left (688 vs
643 at 28 px in), so any two side by side broke in a straight seam with the bank jumping (EYES k10: x 807 of 1440); a shore
block beside sand ended the canal in a straight cut (EYES p18); the map above the board was another block of the board's kinds,
a flat 22% darker, meeting the board along a straight line (EYES q16). COOK's colour-back (bc076ba3) changed no shape: re-measured.
- THE DEAL: a board dealt with the shore has it on its top row end to end and nowhere else, the block beside its own MIRROR (A,
  A mirrored, A, A mirrored), its terrain, cover and lamps mirrored with it (libOf: a cover piece keeps its place inside its
  tile, a lamp's foot is a point); a lower row that held a shore block takes a dry block of the deal's kinds, the twin rule kept;
  no die thrown (the fight's dice are the ones they were).
- THE DRAWING: the curled columns left out (EDGE_INSET 28 art px a side, 1.1%); the ring around the board takes the KIND of the
  board block nearest it (another block of that kind), and the shore is the board's water mirrored back across the edge, so the
  canal on the top row has its far bank above it and runs on left and right; the ring's shade (SURROUND_DIM) comes in over the
  tile next to the board from nothing (dimCell: linear on the sides, radial at the corners).
MEASURED AFTER (computer, a shore board): the bank either side of each join 353 | 353, 371 | 372, 353 | 353 px; the far bank
over every block of the top row; the shade step at the board's top edge 22% -> 2.8%.

## 3. [eyes: toy town], THE MEN'S SIDE (HALF)
At the open a man stands 1.86 rows of his ground (was 2.65): about 1.9 of the suburb's tract houses tall (was 2.7; EYES said
'about four'). THE HOUSES' SIDE IS ART and stays open: the suburb blocks draw a one-storey house about one row tall on its 12 m
tile ('a tile is a house', 9/28), so beside a readable man it reads as a model; a house at the men's scale is taller on its
tile, not wider (more wall and roof on the same footprint, the rig way, rule 115): a NOTE on COOK FOUR's board.

## 4. RULE 170: MELEE IS ONE TILE, COVER IS WHAT IS ON THE TILE
His words, playing a fight: 'if you're in the middle of the street you have no cover unless that street tile has crazy car
wreckage... enemies using pipes, melee weapons, but they're able to attack for more than one tile'.
MEASURED FIRST: a melee weapon's reach was the biggest digit in its weapons.json range text, which carries the wiki's skill
numbering and ranges: '1 (1) Slash 1-2 (2) Split 1 (3) Swing' read 3 (four swords), '1/1 (Split Man) 1/6 (Round Swing)' read 6
(four axes), the pipe's '1-2' read 2, polearms' and spears' '1 - 2' read 2. Over six AUTO fights 312 of 1,040 kneeling frames
were a man on bare raised ground with nothing on it, 65 a man standing ON the outcrop.
- ours.melee_reach 1 (sourced), one test in inRange; a blow's shape (a split's man behind) still lands where it says; the card
  says 1 tile.
- Cover is what a man hides behind: a tile's cover count is the pieces of COMBAT TWO's kinds COVER and LOW_COVER on it, never a
  rock he stands on (MOUND) or a dock (HEIGHT); one test, hides(), for the tile's defence, the shot's 'he stands in cover', the
  shove's pick, the first fight's lesson and the kneel. The kneel (ANIMATION's block, one line): only where the rules say cover,
  or in a building (his 10/24: 'when they're in a building... they should look like they're in cover'); NOTE on ANIMATION's board.
- THE REBUILT FIGHT PLAYS' 'the raider with a pike strikes from two tiles' re-aimed to rule 170(b) (it asserted the wiki's pike):
  he waits behind his line and strikes from the next tile.
MEASURED AFTER: 36 headless fights over every faction at three points of the act, 20 kinds of enemy, 1,905 blows all from the
next tile (Line Breaker's bash read where it shoved); 1,295 shots none closer than two; 104 melee weapons of the data, none
past one; 4,200 tiles on 14 dealt boards, the cover count exactly the hide pieces; 506 kneels over three AUTO fights, 0 in the open.

## 5. RULE 164 ITEM 13: THE GROUND RUNS ON ('a little glitching... more organic... I'm getting the procedurally generated vibes')
Where two blocks of the valley's open ground meet (COMBAT TWO's edge family: scrub, wash, shore, landfill) and are not the same
picture, each side carries the other's edge mirrored back across the seam; the two sides meet in the same colour (w + (1 - w) = 1
at the seam) while w wanders along it in two slow waves, nothing a third of a tile out. Read once off the board's own blocks
(flips and trims as drawn) into strips at the board's size, laid on the board the camera opens on and drawn close in. A
half-size first try read as grey smudges close in on the computer: thrown out. City blocks keep their streets' straight lines.
MEASURED: the seam under the canal's bank on the computer shifted the row's brightness 19.7 across it, against 2.4, 1.1 and 1.3
across the rows further on; now 3.4. The gate's leg fails with the soft joins switched off (checked).

## 6. [AUTO never wastes a turn] + RULE 180: THE ONE BRAIN (CLAIMED: the brain is in, four bars open)
Built from records/BOHEMIA_TUNING_A_BETTER_AUTO_BRAIN_AND_A_TRUE_CALCULATOR_10_25_26.md (TUNING's prototype, 600 fights, its
splices' anchors all still matching the live brain when read), as real code in aiStep for his side (the calculator plays the
same rules, so its odds are this brain's):
- rule 180: AUTO moves, fires and strikes, nothing else (aiFirst and aiLast return at once; no footwork, no bag swap, no
  special swing); a reload only to keep firing (the shot before the reload: 118 shots lost topping up).
- CAN I ACT (PROTO2): a man who cannot strike stands when a foe is within two tiles; a man in a ring with a club or a blade
  never walks out through the free swings.
- STAYING IS A PLAN, THE UNDO VETO: his own tile is scored with the rest (plus the step it saves); after a turn with nothing done
  he never walks back to where that turn began unless he can strike from there (u.lastTurn, kept with the fight).
- THE ROOF: a roof two storeys up is worth two steps to a gunman who still has a shot; with no shot where he stands he takes it
  even with no AP left to fire.
- FOCUS: his side's blow worth 1.25 a strike more on a man his friends already struck this round (rule 180(h)); theirs spreads.
- THE STANDOFF ENDS: once the fight began, when THEY land nothing for five rounds they break off for good (never rallying).
  Counting all blows left 4 of 300 to the cap (their bows at the 5% floor at his man two storeys up); counting what lands, 0.
  The fight keeps firstBlow and lastHitBy (KEPT_STATE) so the calculator plays it too.
Numbers in records/target/bb/ours.json auto_brain (focus_per_strike 1.25, roof_steps 2, near_tiles 2, standoff_rounds 5).

MEASURED, TUNING's bench (tools/bohemia_tuning_auto_brain.js --dance), the same 300 fights (k 0..299):
| | old brain | TUNING's proto2 | NEW |
|---|---|---|---|
| won | 202 | 217 | **239** |
| stalled to the 60-round cap | 11 | 16 | **0** |
| wasted turns | 150 | 0 | **0** |
| off-and-back, no swing in either | 27 | 30 | **11** |
| a strike in reach never swung | 1.44% | 0.15% | 0.28% |
| free swings his men take a fight | 7.03 | 2.60 | 2.55 (theirs 1.06) |
| gunmen who could take a roof and did | 38.5% | 45.3% | 44.3% |
| rounds a fight | 11.6 | 13.6 | **10.3** |
(Note: the old-brain and proto2 columns are TUNING's bank, measured before this round's rule 170 changes; the NEW column has them.)
STILL OPEN on the row: the last 11 dances (3 nothing to shoot, 8 could act: a climb then a move, a move then a climb, which the
undo veto does not see); free swings to theirs; roofs to TUNING's 60%; the calculator's bands against real AUTO fights (176(c):
TUNING's --odds run, [the odds keep up]).
Re-aimed to rule 180 (newer than the legs): THE PC PLAYTEST's 'AUTO swaps an empty gun from the bag' (now never) and THE REBUILT
FIGHT PLAYS' 'AUTO spreads its swings' (his side focuses, theirs spreads).

## GATES (rule 13: the ones that read my files, run this round, alone where the box was crowded)
NOBODY ON ANYBODY, THE WATER RUNS ON 14/0 (new); MELEE IS ONE TILE, COVER IS WHAT IS ON THE TILE 7/0 (new); AUTO NEVER WASTES A
TURN 9/0 (new); THE PC PLAYTEST: THE FIGHT 27/0; THE FORMATION IS KEPT 23/0; ONE TAP 16/0; LOSS 15/0 (alone; 11/4 in a crowd,
timing); GROUND REMEMBERS 8/0; LITTLE THINGS 7/0; TWO HANDS 9/0; EVERY FLOOR TILE 19/0; PERKS ARE LIVE 47/0; EDGE 7/0; GHOSTS
18/0; FIRST FIGHT TEACHES 10/0; WHAT A MAN HOLDS 15/0 (quick); BY HAND QUICKER 20/0; TURN ENDS 8/0; RELOAD 17/0. THE REBUILT FIGHT
PLAYS: every leg green before its page died at the AUTO sweep's start twice (the coordinator's NOTE on RUN's board names the same
death on main, rule 173); its AUTO sweep, enemy brains, formation and table sections green alone after (5/0, 10/0, 1/0). HIT
CHANCE LOOK 24/1 red on main the same (bspeed). GATE REGISTRY and NO ORPHAN SCRIPT red on main (other lanes' orphans; the loading
screen). THE FIGHT HOLDS THE WHOLE GRID: not read this round (it runs past 28 minutes and prints only at its end). Full suite
unmeasured (rule 13).
