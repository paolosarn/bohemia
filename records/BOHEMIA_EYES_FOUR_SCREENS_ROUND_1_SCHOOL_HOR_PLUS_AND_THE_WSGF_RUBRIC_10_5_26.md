# EYES AND EARS -- [the fight at four screens judged] -- ROUND ONE: SCHOOL
### 10/5/26 -- session eyes-5vql33

Row (rule 62): the rebuilt fight at the four screen classes (phone portrait, phone landscape,
tablet, computer) -- how much of the board each shows at the opening (COMBAT's own 77/67/87/83
percent claims), the bar's touch targets, what is cut off, the man's size. Rule 54a discipline:
this round is research only, no measuring.

## THE REAL, NAMED PROBLEM: THIS IS "ASPECT RATIO SCALING," A SOLVED QUESTION WITH A WRONG AND A
## RIGHT ANSWER THE WHOLE INDUSTRY ALREADY ARGUED OUT

Four screen classes means four different aspect ratios showing the same board. That is not a new
problem this row invented; it is the exact question PC gaming has fought over for twenty years
under the name Hor+ versus Vert-, and there is a real, convergent industry answer.

**Vert- (the wrong way):** as the screen gets wider, the vertical field stays fixed and the
engine CROPS more off the top and bottom to make room, or stretches the image. A narrower or
taller screen sees MORE of the world than a wider one at the same zoom -- backwards from what a
player expects, and the reason older games look broken on wide monitors.

**Hor+ (the real industry standard today):** the VERTICAL extent of what you see stays fixed
across every aspect ratio; the HORIZONTAL extent expands or shrinks to fill the width. A 16:9
screen and a 21:9 screen see the same vertical slice of the world, the wider one just sees more
to the sides. This is why Hor+ is "usually preferred": most screens are wide, and Hor+ never
punishes a wide screen with a worse view -- a 103-degree field at 16:9 becomes about 117.6 degrees
at 21:9 under Hor+, same vertical cone, more width.
[Field of view in video games, Wikipedia](https://en.wikipedia.org/wiki/Field_of_view_in_video_games)

## WHAT THIS MEANS FOR A FOUR-CLASS BOARD GAME, NOT A FIRST-PERSON CAMERA

The fight is a flat, top-down-ish board, not a 3D camera, but the same principle translates
directly: the real question for round two is NOT "does each class show a big percentage of the
board" in isolation -- it is WHETHER THE FOUR PERCENTAGES FOLLOW A COHERENT RULE. Under a
Hor+-equivalent policy, phone portrait (390x844, the tallest, narrowest class) and phone
landscape (844x390, the widest, shortest) should show roughly the SAME vertical slice of the
board and differ mainly in how much width they add -- not an arbitrary spread. COMBAT's own
claimed numbers (77/67/87/83 percent) are the thing round two checks for a PATTERN, not just a
pass/fail against one floor each.

## THE REAL GRADING RUBRIC, NOT A ROW INVENTED FROM SCRATCH

The Widescreen Gaming Forum (WSGF) is the actual reference body the PC gaming industry itself
uses to grade a game's aspect-ratio support, and its own categories are a four-step scale: Gold
(perfect, "Ultra-Widescreen Certified"), Silver (solid, one blemish keeps it off a perfect score),
Limited (some support, real practical issues), Unsupported (stretched or unplayable). Round two
should grade each of the four classes this way -- not just a raw percentage, but whether the HUD
stays legible and sensibly placed, whether the board is stretched or distorted rather than simply
reframed, and whether anything gameplay-critical (a tile, a man, a button) is cropped off the
glass entirely. A percentage alone can hide a Vert--style crop that happens to look fine in a
screenshot but cuts real information.
[WSGF Certification Requirements](https://www.wsgf.org/article/wsgf-certification-requirements)

## TOUCH TARGETS: TWO REAL STANDARDS, NOT ONE INVENTED NUMBER

Apple's Human Interface Guidelines set 44x44 points as the minimum tappable target -- the exact
number this row and COMBAT's own gate already use, correct for an iPhone-first game. Google's
Material Design sets a close but not identical real bar: 48x48 dp WITH at least 8dp of spacing
between adjacent targets, reasoning that an average fingertip is 0.6 to 0.8 inches wide. Both are
real, both are cited by real platforms, and they are not interchangeable: a layout that clears
Apple's 44pt but packs targets edge to edge could still fail Material's spacing rule on an
Android tablet or a touch-screen computer. Round two should check spacing between the bar's
tapped elements, not only each one's own size.
[Responsive Design for Touch Devices](https://www.uxpin.com/studio/blog/responsive-design-touch-devices-key-considerations/)

## THE SCREEN CLASSES THEMSELVES ARE CLOSE TO REAL INDUSTRY BREAKPOINTS

Modern responsive design commonly breaks at about 360px (small phone), 600px (large phone), 768px
(small tablet), 1024px (large tablet) and 1280px (desktop). PLUMBER's four profiles (390 phone
portrait, 844 phone landscape, 820 tablet, 1440 computer) sit close to these real-world numbers,
not arbitrary picks -- a useful confirmation that the four classes this row judges are themselves
a reasonable set, not a made-up list.
[Responsive UI/UX: Designing Across Screen Sizes](https://www.kisworks.com/blog/designing-for-different-screen-sizes-tips-for-a-responsive-ui-ux/)

## WHAT CHANGED SINCE THIS ROW WAS WRITTEN, NAMED FOR ROUND TWO

COMBAT shipped [your formation] this same round (ba7e36b4): the fight now opens on a formation
screen, two rows of nine, BEFORE the board itself, not directly onto the board. Round two's
"opening" measurement needs to decide whether it reads the formation screen, the first real board
frame after it, or both -- the row's own COMBAT bd6b3d37 numbers (77/67/87/83 percent) predate this
change and may already be stale. Checked, not assumed, at the start of round two.

## WHAT ROUND TWO BUILDS, ARMED BY THIS

1. Real screenshots at all four profiles (phone_portrait, phone_landscape, tablet, computer,
   PLUMBER's own driver profiles), of whatever the fight's actual opening frame now is post-
   [your formation].
2. For each: the board's visible extent as a fraction of the glass, AND whether the four numbers
   follow a Hor+-shaped pattern (portrait and landscape sharing a vertical slice, width doing the
   adapting) rather than an arbitrary spread.
3. A WSGF-style grade per class (not just a percentage): HUD legible and sensibly placed, no
   stretch/distortion, nothing gameplay-critical cropped off the glass.
4. Touch targets: both Apple's 44pt minimum size AND Material's 8dp-equivalent spacing between
   adjacent targets.
5. The man's device-pixel size at each class (rule 21: he never grows with the zoom).

## ROUTED

Nothing to route yet -- school round. The check is round two, once the formation-screen question
above is settled by looking at the real current build.

## SHIP TEST FOR THIS ROUND

The row's own percentages are traced to a REAL, named industry debate (Hor+ vs Vert-) with a
real, convergent answer, not treated as a type of fact to be reported by itself with no test
behind it. A real grading rubric (WSGF) replaces inventing one from scratch. A second real touch-
target standard (Material's spacing rule) is added beside the one already in use. And the row's
own premise (COMBAT bd6b3d37's numbers) is flagged as possibly stale against a same-round ship
(COMBAT [your formation]) BEFORE round two wastes a reading on a frame that no longer opens the
fight. NO MEASURING THIS ROUND, per the lane's own two-round law. Round two next.
