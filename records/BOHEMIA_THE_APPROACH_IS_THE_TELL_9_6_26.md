# BOHEMIA — THE APPROACH IS THE TELL (ANIMATION lane, 9/6/26)

Row: `[walks at you]` THE-APPROACH-IS-THE-TELL. Tab: **RUN** (walk a street where
somebody has a reason to want you).

---

## THE BRIEF

DIRECTION judged the shipped hostiles at phone size, in the densest Cartel spot in
the valley: two bodies at WAR, rank 3, in frame, and all three questions came back
NO. They do not read as dangerous, as Cartel, or at all. **They are the crowd.**

The coordinator's research says the cheapest fix is free: vision finds a target by
CONTRAST in a preattentive channel, motion is one of those channels, and *everybody
else walks past — a hostile walks AT YOU*. No pixels, no palette, no new art.

## MEASURED FIRST, AND IT IS WORSE THAN THE BRIEF ASSUMED

Walking a crew down from ten cells out, on the real surface:

| player distance | state | where the bodies are |
|---|---|---|
| 10 – 9 | idle | at their corner |
| 8 – 4 | **watch** | at their corner, **still**, facing you |
| 3 | close | **four bodies teleport** to `[-1,0] [-1,1] [1,0] [0,1]` |
| 3, 2, 1, 0 | close | **those offsets never change again** |

**There is no approach anywhere in it.** One step across `closeAt` and four bodies
appear glued around you — one of them on the far side, which nothing walked past you
to reach — and then they are stuck to you like a decal.

And `hostilePass` drew every one of them with `set.idle`, **a single still frame**.
So since `__THE_VALLEY_KEEPS_BREATHING__` shipped last round, the residents breathe
and the hostiles do not: **the most static bodies on the street were the dangerous
ones.** The read, exactly backwards.

## WHERE THE TELL GOES, AND WHY IT IS THE WATCH WINDOW

`streetFightOnStep` posts the encounter on the **same step** the state turns
`close`. There is no beat between closing and fighting in which an approach could be
seen at all.

But `watch` runs from eight cells out to four — **five cells of walking** where the
crew is on screen, looking at you, and not yet a fight. That is where a player can
still find them, and that is where this belongs.

## WHAT SHIPPED

**The bodies step off their corner toward you, and walk while they do it.**

- The lean grows as you close and **gives ground back if you widen it again**, so
  walking toward them *or* away from them both produce motion along the line between
  you. That direction is the whole cue.
- **A leash of 1.5 cells, deliberately shorter than `closeAt` (3).** A watching body
  can never be standing on top of you while the state still says watch.
- **0.34 cells per beat** — a third of the player's pace. At the player's own 1.0 the
  entire lean was covered in a *single beat* and there was nothing to watch: measured,
  the bodies hit their target before the second frame and the walk cycle never played.
- **A moving body is drawn walking.** The player bake already ships a four-frame walk
  per facing and this pass had been drawing `set.idle` in every state. No new art.
- A body first seen starts **on its corner**, not on its target, so the step off the
  corner is a thing that happens rather than a thing already done.

Measured after, walking in from the far edge of watch:

```
dist 8  body 0.0 cells off corner   8.0 from you
dist 7               0.3            6.7
dist 6               0.6            5.4
dist 5               0.9            4.1
dist 4               1.2            2.8
dist 3  (close)      2.0            1.0
```

Continuous. No jump anywhere in it.

## WHAT THIS DELIBERATELY DOES NOT TOUCH

The crew's cell is still `crew.at` and `stateOf` still measures from it, so **the
fight triggers on exactly the beat it did before**. This lane decides what the
approach *looks* like; where the crew *is* stays RUN's, and inventing a second answer
to that question is the ONE ID ONE WHOLE PERSON mistake with a different noun. That
is what the leash is for.

## THE RULER THAT WAS SATISFIED BY THE PLAYER'S OWN LEGS

The gate's first claim compared nearest-body-to-player at the start of the walk-in
against the end. **That shrinks whether or not anybody approaches, because the player
is the thing walking.** Mutated to leash 0 — the exact old behaviour, four bodies
glued to a corner — and it still passed.

The honest measure is **the gap they open on their own corner**: how much nearer to
the player the bodies are than their corner is. Standing still that gap is zero at
every distance; only walking toward him grows it. Same shape as last round's gate,
where *time* supplied the variety instead of the offset.

## GATE

`gates/the_approach_is_the_tell_gate.js` — 9 claims, **3 mutations proven caught**:
the approach deleted (leash 0), the approach done by **teleporting** (step 99), and
the approach drawn as a **still frame**. Registered as APPROACH TELL.

## BOUNCED TO RUN, NOT PATCHED FROM HERE

1. **The ring is a teleport.** At `closeAt` the four bodies are placed on cells
   adjacent to the player, including behind him, with no travel. This lane now walks
   them onto it, which hides the worst of it, but the placement itself is the
   engine's.
2. **The fight fires on the same step the state turns close**, so nothing that
   happens in the closing beat can ever be seen. If a crew is meant to *arrive*, the
   trigger wants a beat or two of daylight after the state flips.
