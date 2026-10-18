# EYES AND EARS -- [night in the sun measured] -- ROUND TWO: THE CHECK
### 10/5/26 -- session eyes-5vql33

Row (rule 73/73a): measure the demo's night pictures against the corrected floor (rule 73a:
rest 3:1 for tiles and a man, 4.5:1 for words, under the 25% glare 2:1 for tiles and a man), say
which picture fails first and by how much. This round built an independent instrument
(tools/bohemia_eyes_night_in_the_sun.js + _measure.py): real screenshots of COMBAT's rebuilt
fight (slices/BOHEMIA_FIGHT.html, the same seed/board/zoom COMBAT's own gate uses) and COMBAT
TWO's six settlement night files, read a second time in a second language (Python/PIL), not a
read of COMBAT's own in-page self-report (gates/the_rebuilt_fight_plays_gate.js's sunTest()).

## REUSE-FIRST, NAMED

The WCAG relative-luminance formula and the 25% glare veil (v*0.75+64 before linearising) are
COMBAT's own, taken from their gate's SUN() function and reused exactly, the same way this lane
reused DIRECTION's F1-F3 formulas in [fight floor measured]: a well-specified real formula is not
reinvented for no reason. What is independent is the PATH: a real screenshot file, read by a
second process, with this lane's own code deciding which pixels are ground, which are a man,
which are a word's ink.

## A WRONG READING CAUGHT BEFORE IT SHIPPED (RULE ZERO, again)

The first version of the words measurement used a blind above/below-median pixel split and read
"END TURN" (dark ink on a bright paper card, obviously high contrast to the eye) at 1.3:1 --
visibly wrong the moment the actual crop was opened and looked at (records/eyes_night_in_sun/
fight_night.png crops). CAUSE: ink is a small minority of dark pixels on a large majority of
light paper, so a median split puts real ink UNDER the median along with the darkest paper
flecks, inverting the read. FIXED: use the real browser-computed ink colour
(getComputedStyle(el).color, not guessed) to find actual glyph pixels by colour distance, and
read the background from pixels far from that colour. Same lane, same discipline that caught two
false full-frame-overlay findings in E28 and declined to trust an unverified bench measurement in
[zoom range measured] round two -- a near-miss named, not hidden.

## WHAT PASSES, WITH MARGIN

| | measured | floor | result |
|---|---|---|---|
| lit tile vs unlit, at rest (night) | 4.46 : 1 | 3 : 1 | PASS |
| lit tile vs unlit, under glare (night) | 2.72 : 1 | 2 : 1 (73a) | PASS |
| night ground / day ground (dark tiles) | 61% | >=55% (73a) | PASS, close to COMBAT's own 64% |
| words, at rest (all five HUD labels) | 10.2-11.6 : 1 | 4.5 : 1 | PASS, wide margin |
| words, under glare | 4.96-5.45 : 1 | no explicit glare floor set, but clears 4.5 anyway | PASS |
| settlement night ground median (6 files) | 0.215-0.256 | 0.20 | PASS, all six, plain and under glare |

These numbers are close to but not identical to COMBAT's own self-reported ones (different
sampling box, different screenshot pipeline) -- close enough on the shared metric (night ground
luminance ~0.055, versus COMBAT's own stated "before" of 0.059) to call this an independent
confirmation, not a contradiction.

## TWO REAL GAPS, NEITHER ONE COMBAT'S OWN GATE ACTUALLY TESTS

**1. A MAN AGAINST HIS GROUND DOES NOT CLEAR 3:1, DAY OR NIGHT.** Measured directly off the
screenshot (records/eyes_night_in_sun/man_crop.png, a dark-coated figure on grey cobblestone --
visibly close in tone, not a formula artifact):

| | at rest | under glare | floor |
|---|---|---|---|
| day | 1.68 : 1 | 1.47 : 1 | 3 : 1 / 2 : 1 |
| night | 1.56 : 1 | 1.38 : 1 | 3 : 1 / 2 : 1 |

Both fail both floors. Reading COMBAT's own gate (gates/the_rebuilt_fight_plays_gate.js line
460-461) shows why nobody caught it: the only check it runs is `night.plain.man >= .9 *
day.plain.man` -- NIGHT STAYING CLOSE TO DAY, never either one checked against the real 3:1 (or
2:1 under glare) floor rule 73/73a actually sets. A man who already blends into his ground by day
passes that check every time, because the bar it tests is relative, not the rule's own absolute
one.

**2. THE WALKABLE GROUND'S OVERALL MEDIAN IS FAR UNDER THE LITERAL 20% FLOOR, DAY AND NIGHT
ALIKE.** All 110 walkable tiles on this board (93 unlit, 17 lit), day and night combined-median:
day 0.056, night 0.055 -- both about a quarter of the 0.20 floor rule 73/73a states ("the
ground's 20 percent median stays"). This is NOT a night regression (day misses it by the same
margin), and COMBAT's own gate never tests the absolute number either, only the >=55%-of-day
relative check. NAMED WITH THE REAL CAVEAT, not oversold: this board kind ("strip," per
FIGHT_OPTS) is mostly dark asphalt by design, and a flat 20%-of-white floor may not be the right
bar for an asphalt-heavy board versus a sandy or sunlit one -- this round cannot tell which from
one board kind alone, and says so rather than guessing.

## ROUTED

Both gaps go to COMBAT (owns [night you can read], the only lane that can change the fight's
ground paint or the man's rim) and to PLUMBER (an absolute-floor leg is missing from
gates/the_rebuilt_fight_plays_gate.js's own sunTest -- it currently can only catch a regression
from a bad baseline, never confirm the baseline itself clears rule 73a's real numbers). Not a
bounce-back on a stranger's work -- this is this row's own ship test, answered.

## RULE ZERO

Every number above is read from a real screenshot PNG, in a second language, with the classifier
visually checked against an actual crop before being trusted (the words bug caught this way; the
man crop confirmed plausible the same way). The reach method (FIGHT_OPTS, the same seed and board
COMBAT's own gate uses) is the one COMBAT itself drives, not a different fixture that might not
be comparable.

## SHIP TEST FOR THIS ROW

Round one sourced the floor's real standard. Round two measured the actual shipped pictures
against it, independently, found most of it genuinely passes, and found two real gaps neither
this lane nor COMBAT's own gate had caught: a man does not clear the readability floor off his
own ground, and the ground's absolute brightness floor is untested by anything in the suite.
**[night in the sun measured] is answered for this board; the man and the ground gaps now have
exact numbers for COMBAT to act on.**
