# EYES AND EARS -- [a stranger's five minutes judged] -- ROUND TWO: THE CHECK
### 10/9/26 -- session eyes-5vql33

Row (rule 78, his 10/5 "vibe code dog shit"; rule 77a adds a tenth frame). Round one (shipped
7e152a6) sourced three lenses and named the tenth frame blocked. This round builds the instrument
(`tools/bohemia_eyes_strangers_five_minutes.js`, real touches, reused from
`gates/the_loop_plays_on_the_map_gate.js`'s own proven map->settlement->board->job->fight path and
`tools/bohemia_through_the_title.js`), walks the real demo fresh (storage cleared, a true
first-ever visit), and scores what it actually found.

## THE HEADLINE FINDING: TWO OF THE NINE NAMED SCREENS DO NOT EXIST IN THIS BUILD

The row assumes title and picks are their own screens. Checked with storage fully cleared (a true
stranger): the title element never became visible. Two screenshots taken seconds apart at the
start of the walk (where title, then picks, were supposed to be) are byte-identical to each other
AND to the map screenshot taken after them -- all three are the exact same frame: the city map,
already loaded, with the phone feed already open, 240 batteries already on the counter, a
settlement ("Church") already in range. `localStorage` had already been written to
(`bohemia.keys`, `boh.city.family`, `boh.demo.card`, `bohemia.pocket`) within about two seconds of
a clean boot. Nothing was tapped to cause this -- it happened before any input.

This is not a visual-polish finding, it is a rule violation this lane can point at by name:
- Second Votes (Paolo 9/23, LOCKED): "NOTHING IS FORCED AND NOTHING HAPPENS IN THE FIRST SECOND"
  and "THE GAME STARTS IN THE RUIN." A stranger's first frame is a mid-game city with resources
  already spent, not a ruin, not a first second with nothing forced.
- Two Scales, One Game (Paolo 9/27, LOCKED): "THE FIRST SIXTY SECONDS ARE A GAME." A stranger who
  never saw a title or made a pick has had zero seconds of game before landing mid-session.

NOT IN A TAB YET -- this is a measurement off the real demo file, not a judged art piece. Routed to
RUN (owns the demo into a friend's hands and the boot flow) to root-cause: whether this is a
title-screen render bug (the CSS for `#title` is `position:absolute;inset:0`, so it should fill the
frame -- something at runtime is collapsing or skipping it before paint) or an auto-continue from a
leftover save that outlives a clear, since fresh keys were being written within 2 seconds of a
blank-storage boot. Scored 0/10 each for title and picks: not reached, not faked.

## THE BAG-IS-THE-MARKET, CONFIRMED BY SIGHT NOW, NOT JUST BY TEXT

`00_START_HERE_NEXT_SESSION.md`'s own shipped-row text for [the inventory] and [the market] already
said the bag is "two grids, THEIR SHELF of icons over YOUR BAG of 36 slots" in one screen. The walk
confirms it visually: tapping the smith opened one frame showing both the shop's six items for sale
("THEIR SHELF") and the player's 36-slot bag ("YOUR BAG 0/36") stacked in the same view. The row's
nine-screen list should read eight: bag is not a screen of its own, it is the bottom half of market.

## WHAT WAS ACTUALLY REACHED THIS ROUND, HONEST ABOUT THE REST

| named screen | reached? | what happened |
|---|---|---|
| title | NO | 0x0, never painted; see headline finding |
| picks | NO | same frame as title and map, see above |
| map | YES | real shot, 3 captures, same state |
| settlement | YES | Church, real street-level shot |
| market | YES | smith's shop, with the bag folded in |
| bag | N/A | not a separate screen, see above |
| fight | NO | the walk never held a contract this run (see below) |
| recap | NO | depends on fight being reached |
| home | NO | depends on fight being reached |
| freeway vs I-15 (10th, rule 77a) | BLOCKED | see below, unchanged from round one |

Why fight/recap/home were not reached: the tool opened the board, but its scripted tap never found
contract text ending in "battery" in the sheet that opened (`board offer: null` in the run log,
`held contracts: []`). This may be the board sheet rendering under a different selector than the
loop gate's own proven pattern expects, or the Church board's contracts this run not being
battery-denominated. Named as a real gap in this round's own reach, not forced past with a fake
screenshot. Fight, recap, and home are un-scored this round, not scored at 0 for quality -- 0/10
above is reserved for title/picks, which were confirmed NOT TO EXIST, a different finding than NOT
YET REACHED.

## THE TENTH FRAME: STILL BLOCKED, RECONFIRMED

Round one found no I-15 photo existed yet. Checked again now that COMBAT TWO's [the freeway redone]
has shipped (8db8c97, same day): that commit's own message says it plainly -- "I-15 photo OWED
(network policy blocks photo hosts)." The freeway itself now exists on the street's kit (Jersey
barrier, chain-link, no wall on the road), but the comparison photo this lane needs is blocked at
the network level, not a missing task. Reported as blocked, not skipped, same as round one.

## SCORING THE THREE REAL SCREENS

Lenses: the analog horror bible's ten rules (only R1, R4, R5, R7, R8, R10 are checkable from a
still frame; R2, R3, R6, R9 need a time window this round has no instrument for, so they are
written UNMEASURED per the bible's own stated convention, not forced), the row's own tells
("flat boxes, centred words, default fonts, a thing that reads as a button, a seam that breaks"),
and Nielsen's heuristics (sourced round one) where a static frame can show them.

### MAP (6/10)
R1 ordinary-frame-one-wrong-thing: mostly holds -- dense isometric debris city, the phone overlay
is the one deliberate wrong thing doing its job. R4 every light names its fixture: FAILS -- strings
of glowing dots run along several streets with no lamp, bulb, or wire drawn to explain what is
lighting them; they read as abstract path markers, not a named fixture. R5 no decorative type:
passes, all labels are plain and functional. R8 diegetic or dead: passes, the phone reads as a held
object, not a flat modal. R10 grime baked not shaded: passes, roof and wall wear looks baked into
the texture. Tells: the five speed buttons (II/1X/2X/3X/5X) are one uniform row of identical flat
rounded rectangles, and the settings gear (top-left) and NOTES button (top-right) are both flat
dark rounded boxes with centred content -- a direct, exact match for the row's own list ("flat
boxes, centred words... a thing that reads as a button"). Nielsen: status is visible (clock,
resources), but five near-identical buttons with only a label distinguishing them is a recognition
cost, not a strength.

### SETTLEMENT -- CHURCH (8/10)
Best of the three. R1 holds well: a boarded clinic with a hand-painted-feeling red cross is a real
story detail, not a generic prop. R4 passes here where map failed: two street lamps are fully
modeled fixtures (post, arm, bulb housing), visibly the thing making the light. R5 passes, "Church"
and "240 BATTERIES" are plain functional type. R8 passes, no overlay at all on this frame. R10
passes, brick and roof wear reads as baked texture. Tells: the single "LEAVE" button is a flat
rounded box too, but alone, not in a uniform row, so it reads less like templated chrome and more
like one button doing one job.

### MARKET + BAG -- the smith (4/10)
Weakest of the three, and the clearest tell match. The "YOUR BAG 0/36" grid is five rows of six
totally identical dark slots with a diagonal scratch texture -- the single most literal match in
the whole walk for "a uniform grid of identical cards" from round one's AI-slop sourcing, more
extreme than the shelf above it since every slot is empty and indistinguishable. The shelf itself
(axe, chain, chain, hook, pistol, cleaver) is icon-over-label-over-price in six identical card
frames, the same pattern one size up. Separately, and worse: Rubén the smith's portrait is a blank
square face, two dots for eyes, no mouth, no feature detail -- this is a direct hit against the
locked law EVERYBODY HAS A FACE, AND IT TALKS, not a style note. R5 still technically passes (the
item labels are plain type), but R8 is a partial fail: the dialogue card ("Half the block is
coughing...") sits as a flat rounded overlay with no visual tie to a speaking mouth beyond the tiny
blank portrait box, reading closer to a dead modal than a diegetic conversation.

## THE WORST THREE, NAMED WITH THE OWNING LANE

1. **Title and picks do not happen.** A stranger's first frame is a mid-game city, not a ruin, not
   a first second with nothing forced -- a direct conflict with two LOCKED rules (Second Votes
   9/23, Two Scales One Game 9/27). Owning lane: RUN.
2. **The smith's blank portrait in market.** Two dots on a square, talking. Direct conflict with
   the locked law EVERYBODY HAS A FACE, AND IT TALKS. Owning lane: PORTRAIT.
3. **The bag's 30-identical-slot grid and the map's 5-identical-button row.** The two most literal
   matches anywhere in the walk for the row's own tells list and round one's sourced AI-slop
   pattern (a uniform grid of identical cards). Owning lane: UI (chrome), DIRECTION (the bible).

## ROUTED

- RUN: root-cause the title/picks skip -- `#title` is styled to fill the frame
  (`position:absolute;inset:0`) in the alpha's own CSS, so something at runtime is hiding or
  skipping it before a stranger ever sees it, and fresh keys are being written within ~2 seconds of
  a cleared boot.
- PORTRAIT: the smith's blank face is a named, located instance of the thing the law already bans.
- UI / DIRECTION: the speed-button row and the bag grid are the two clearest AI-slop matches found;
  the fix pattern this lane's own round one sourced (commit to one direction instead of the
  statistically safe average) applies directly to both.
- COMBAT (board sheet): this lane's own tool could not find a battery-priced contract to tap this
  run -- worth a look from whoever owns the board's contract list, independent of my tool's own
  reach, since the loop gate's own proven pattern was reused as-is.

## SHIP TEST FOR THIS ROUND

A real instrument, reused from proven reach patterns, walked the live demo with real taps from a
true cleared-storage first visit and reported exactly what it found, including what it could not
reach. Three of nine named screens were genuinely captured and scored against all three lenses with
exact rule citations (R1/R4/R5/R8/R10, the row's own tells wording, Nielsen). Two named screens were
found NOT TO EXIST in the current build, which is a bigger finding than a bad score, and is tied to
two LOCKED rules by name. One screen (bag) was confirmed to not be a separate screen at all. Three
screens (fight, recap, home) were honestly reported as not reached this run, with the specific cause
named, not faked. The tenth frame's block was reconfirmed against the lane that owns it.
