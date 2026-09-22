# THE BLOCK STOPPED SEEING YOU — TWO RIGHT NUMBERS THAT DO NOT OVERLAP
9/22/26 · found by 19 QUESTS while chasing a red in its own gate ·
**NOT THIS LANE'S SYSTEM TO FIX. Named for the lane that owns it.**

## WHAT IS BROKEN
**Nobody in the walked city remembers seeing you any more.** `CT_MINDS` — the
city's memory of who has witnessed what — stays empty while you walk.

That is not one feature. Everything downstream of a witness is dark:
standing and reputation, who vouches for you and who will not, deed barks,
familiarity, the missing-persons organ, and **the picket count in WORLD's brand
new strike** (`held()` counts the block's minds, so every block reads NOT_KNOWN
forever).

## THE MEASUREMENT
The one driver, the alpha, twenty presses of the pad, three runs per commit:

| commit | minds after 20 presses |
|---|---|
| `121c776` (9/22, before) | 10 |
| `5ca10f2` ANIMATION slide is the feel | **17 · 17 · 17** |
| `e9f3091` [no clumping] nobody stands on anybody | **1 · 0 · 2** |
| `207df29` clean `origin/main` | 1 |

Seventeen every single time on one side of one commit and zero to two every
single time on the other. That is not browser drift.

## THE CAUSE, AND BOTH HALVES OF IT ARE RIGHT
`[no clumping]` is Paolo's own vote, built correctly. It stops people being
drawn inside each other by giving each body its own footprint:

    __room = round(bodyLadder(HZOOM) / HZOOM) = round(112 / 11) = 10 cells
    the rings now step by __room instead of by 1

The city's memory records a witness inside:

    BohemiaMemory.RADIUS = 8 (Manhattan)

**Ten is bigger than eight.** The crowd is now laid out on a grid whose spacing
is wider than the distance at which anybody can see anything, so the witness pass
runs every game minute, finds the roster, and every single body on it is out of
range. Measured on current main: closest drawn body 9, 16 and 29 cells away;
`ctWitnessPass()` forced by hand returns **0**, with `BohemiaMemory` loaded,
`PLAYER_CV` true, 61 people alive and 5 bodies on the glass.

Neither number is wrong on its own. A body really is ten cells across (rule 21),
and eight cells really is a plausible eyeshot. Nobody measured the pair.

## WHAT IT IS NOT
- Not the player's body failing to load: `PLAYER_CV` is true.
- Not an empty street: 61 people, 5 to 7 bodies drawn per frame.
- Not the 9/15 trap this fleet already wrote down (a city opened on its own,
  never sent a body, drawing nobody). Bodies are drawn. They are just far away.
- Not a throttle bug: `CT_SAW_MIN` equals the current minute, so the pass ran.

## FOR THE OWNING LANE
The choice is a ruling, not a patch, and it is not this lane's to make:
either the spacing and the eyeshot are brought into the same world, or the
witness pass stops asking "is this body within 8" and starts asking "is this body
within a few of his own footprints". `__room` is already the game's own
arithmetic, so the second reads naturally: a radius expressed in bodies rather
than in cells survives any camera change, which is exactly why `__room` is
derived and not typed.

**It should not be closed by widening RADIUS to a number somebody picked.**

## THE RED THIS CAME OUT OF
`gates/haggle_like_bb_gate.js` went 20/0 -> 18/2 on the two legs that need a
witness: "a faction-less mark REACHES people (0 saw it)" and "pushing too far
really costs reputation". Identical 18/2 on a clean `origin/main` worktree, so
it is not the change that was in flight. **The gate is staying red.** It is
reporting a real thing about the game, and a checker that is quietened to make a
round look finished is worse than no checker.
