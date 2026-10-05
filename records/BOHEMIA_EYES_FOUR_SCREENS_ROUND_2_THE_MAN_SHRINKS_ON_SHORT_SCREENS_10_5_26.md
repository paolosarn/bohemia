# EYES AND EARS -- [the fight at four screens judged] -- ROUND TWO: THE CHECK
### 10/5/26 -- session eyes-5vql33

Row (rule 62): the rebuilt fight at the four screen classes -- how much of the board each shows,
the bar's touch targets, what is cut off, the man's size in device pixels. Round one found the
real question is whether COMBAT's own numbers follow a Hor+-shaped pattern, found a real rubric
(WSGF) to grade by, and flagged that COMBAT's own screens() gate (gates/
the_rebuilt_fight_plays_gate.js) already measures glass% and tap size well -- so this round's job
is to measure what that gate does NOT: the man's own size across classes, and tap-to-tap spacing.

## WHAT WAS CHECKED FIRST, PER ROUND ONE'S OWN FLAG

COMBAT's [your formation] does not add a separate screen before the board -- the deployment
phase (two columns of nine, drag to set your line) draws directly on the same board canvas this
row already measures. The bd6b3d37 percentages are not stale after all; they describe the same
surface this round reached. Confirmed by real screenshots at all four profiles (records/
eyes_four_screens/*.png), not assumed.

## CONFIRMED, INDEPENDENTLY: COMBAT'S OWN GLASS-PERCENT NUMBERS ARE ACCURATE

Reading the real geometry off a fresh screenshot and FIGHT_UI's live state (not a second read of
their self-report -- a separate reach, separate screenshot, separate arithmetic):

| | portrait | landscape | tablet | computer |
|---|---|---|---|---|
| glass % (board's share of screen height) | 77.5 | 67.2 | 86.9 | 82.9 |
| COMBAT's own claim | 77 | 67 | 87 | 83 |

Matches to within rounding on all four. COMBAT's own instrument is trustworthy on this metric.

## THE REAL GAP: THE MAN'S OWN SIZE, NEVER MEASURED BY ANYONE, SHRINKS BY MORE THAN HALF ON TWO
## OF FOUR SCREENS

Rule 21/34 locks the man at a 112 px box on every walked and fought surface -- "the ground may
zoom, the person may not." COMBAT's own screens() check never measures this at all (it checks
glass%, bar layout and tap size, not the figure). Measured directly off the real screenshots:

| | portrait | landscape | tablet | computer |
|---|---|---|---|---|
| man's height, device px | 110.7 | **45.1** | 111.1 | **42.8** |
| camera zoom in use | 0.379 | 0.155 (= far) | 0.571 | 0.440 (= far) |

Portrait and tablet sit right at the locked 112 px standard. Landscape and computer sit at under
40% of it -- a man on a computer screen is less than half the size rule 21/34 promises everywhere
else in the game.

**THE CAUSE, READ FROM THE SAME DATA, NOT GUESSED: landscape and computer are the two SHORT
screens** (390 px and 900 px tall, against portrait's 844 and tablet's 1180), and both sit exactly
at their OWN "far" zoom -- the most-zoomed-out stop the camera has, the one that guarantees the
whole north-south deployment line (nine men deep, front and back) fits in whatever vertical pixels
are available. A short screen has far fewer vertical pixels to fit that same line into, so the
camera is forced to zoom out further to keep it whole. This is exactly the pattern round one's
school flagged as the WRONG one (Vert-): the picture's effective scale shrinks as the screen gets
shorter, rather than the real industry answer (Hor+: a fixed vertical slice, width does the
adapting). Here the deployment LINE's own vertical extent is acting as the fixed thing being
protected, at the cost of the man's own locked size -- which is the law this game has held since
rule 21.

## A SECOND, SMALLER GAP: BUTTON SPACING, THE STANDARD NOBODY HAD CHECKED

Every tapped element clears the 44pt size floor on all four screens (confirms COMBAT's own
check). But FIGHT and WAIT -- the two buttons a player taps in sequence to resolve a turn -- sit
about 6.9 to 7.5 CSS points apart on EVERY class, consistently, under Google Material's real 8dp
minimum spacing standard (round one's second sourced bar). Visually confirmed (records/
eyes_four_screens/phone_portrait.png, crop at the two cards): a real but narrow gap, not a
measurement artifact. Each button alone is large enough; the two together are packed tight enough
that a hurried thumb could clip the wrong one.

## THE WSGF-STYLE GRADE

Per round one's rubric: no stretching or distortion on any class (confirmed visually, all four
screenshots); the HUD stays legible and sensibly placed on every class (one-row bar on the wide
two, stacked on the narrow two, matching COMBAT's own oneRow claim); nothing gameplay-critical is
cropped off the glass on any class. By WSGF's own shape this would read SILVER, not GOLD: solid
across the board, with the one real blemish (the man's own size) keeping it off a perfect score.

## ROUTED

The man's size gap goes to COMBAT (owns the fight's camera and rule 21's own promise); the button
spacing goes to COMBAT or UI (whoever owns the bar's layout). Not a bounce-back on finished work
elsewhere -- this is this row's own ship test, answered with two things nobody had measured before.

## RULE ZERO

Every number here is read from a real screenshot at a real profile, computed independently in a
second process; the one surprising/validating cross-check (glass% matching COMBAT's own claim to
the percent) is reported alongside the new findings rather than only the new findings, so the
instrument's own trustworthiness is shown, not assumed.

## SHIP TEST FOR THIS ROW

Round one sourced the real standard (Hor+/Vert-) and a real rubric (WSGF). Round two measured the
real screenshots at all four classes, confirmed COMBAT's own numbers independently, and found two
real things nobody had checked: the man's locked size breaks on the two short screens, by more
than half, for a traceable reason (the deployment line's own vertical extent forcing the far
zoom); and the two sequential bar buttons sit under the real spacing standard on every class.
**[the fight at four screens judged] is answered, with the frame, the cause, and exact numbers.**
