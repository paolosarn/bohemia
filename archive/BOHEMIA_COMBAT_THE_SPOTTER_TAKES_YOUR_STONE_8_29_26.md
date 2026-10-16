# V195 — THE SPOTTER TAKES YOUR STONE (COMBAT lane, 8/29/26)
# and three corrections to my own work, two of them found by gates I did not write

> "we are trying to create the best funnest **deepest** videogame ever" — Paolo

RF4-37, quoted in the teardown: *"rather than simply blasting away at whichever
enemy is closest the player often needs to plan a few turns ahead, **ignore the
nearest enemies** and somehow maneuver himself into position to kill the
Priority-Target who is often hiding in the back."* Our own column names the gap in
these words: **"what is missing is a target worth crossing the room for."**

---

## CORRECTION ONE: THE MEASUREMENT THAT MOTIVATED THIS WAS AN ARTIFACT

The first probe — same boards, one man removed at the bell, player not shooting —
read:

| removed | damage taken |
|---|---|
| nobody | 81.8 |
| the spotter | 70.6 (saves 11.2) |
| a plain goon | 66.8 (saves 15.0) |

and I wrote down **"killing the priority man is worth less than killing a random
goon."**

**That player has 100 health and was losing 82 to 95 of it in every arm. The ruler
was saturated.** Re-run at 600 health, where the number can actually move, and
killing the spotter came out *ahead* of a goon before this change was written at
all. **The premise did not survive its own instrument.**

**AND WITH THE RULER FIXED, THE QUESTION IS UNDER-POWERED.** A passive player over
twenty turns takes about 266 damage whoever you remove; run-to-run variance on the
same seeds is near 10, because the fight AI draws on unseeded randomness inside
the turn; and the effects being chased are 5 to 15. Removing one man of four does
not move a fixed-length beating enough to read at 37 boards.

**So this ships on the mechanic and NOT on a damage improvement,** and the gate
says so in its own claim text rather than reaching for a threshold that would let
it pretend otherwise.

A second edit that unhooked V168's standoff lane while the call was live was
written, measured, and **reverted**: with the A/B in the noise there was no
evidence for it, and changing shipped AI behaviour on no evidence is exactly what
this file keeps catching itself doing.

---

## WHAT SHIPS, AND IT IS THE THIRD SHAPE OF IT

**While a living spotter has a line on you, the men your stone would have stopped
are shooting anyway.** RF4-28: *"enemies are designed as counters to effective
player actions, deliberately."* V177 measured the effective player action — **the
stone takes 73% of the guns off you** — and built the breacher to shoot the rock.
The spotter does the other thing: **he does not break your cover, he tells them
where you are anyway.**

Measured over the same boards: the call is live on **26%** of turns and takes back
**27%** of the cover that would otherwise have saved you. Stable across five runs
(23–27% and 26–31%).

**AND IT HAS REAL COUNTERS, WHICH IS WHAT SEPARATES A COUNTER-ENEMY FROM A TAX.**
Staged exactly, on a board with a spotter holding a clean line and a goon behind
your stone:

- the stone works on the goon, **and he shoots you anyway** while the call is up
- **put the spotter down** → the call dies and the stone is yours again
- **smoke** kills it outright, so BREAK CONTACT is untouched
- **break his line with stone** → it dies, because he has to see you himself

## CORRECTION TWO: TWO SHAPES OF THIS WERE REFUSED BY A GATE, AND BOTH REFUSALS WERE RIGHT

1. The first cut added **`seesMeRaw`, a second copy of "can he see me"**, to dodge
   a recursion. `combat_lab` refused it: V165's spec is **one door** for sight and
   V170's is **one ask** for smoke, and it holds those as exact counts — one
   `myConcealAgainst` in the whole file, three `smokeAt` mentions. *A second copy
   is how one variable quietly becomes five that disagree.*
2. The second cut put a `_raw` **flag on `seesMe`**. Refused too: the gate holds
   that function's signature and its closing line as exact text.

**Both refusals were right, and the third shape is better than either — the gates
are what found it.** The spotter changes **what your cover is worth**, not what
anybody can see. `seesMe` is not touched by one byte, there is no recursion to
dodge, and smoke still kills the call because it kills the spotter's own line
first.

The exposure filters are left **literally intact** and the called men are added as
a **union on top**, because `combat_lab` holds those filters as exact text *and*
counts the threat filters that exclude a suppressed man. Folding the call into
them broke four unrelated claims at once.

**AND THE FLOOR LEARNED IT IN THE SAME BREATH.** V193's whole claim is that
`gunsOnTile` is the fight's own geometry with the origin moved, gated at 30 of 30
fights agreeing with `posExposed`. That arm now runs with the call **live**, and
it caught a real hole: the tile score skipped the screen question the sight door
asks, and disagreed on one fight in thirty. **The paint and the rules must ask the
same questions — all of them.**

---

## CORRECTION THREE: YESTERDAY'S V194 CLAIM PASSED BY LUCK

V194 asserted that the anti-idle aggregate improved: 66.0% → 70.4% on the run that
shipped. Later runs gave **64.9 → 64.7** and **64.5 → 68.7**. Pinning the boards
does not pin the fights, because the AI draws on unseeded randomness inside the
turn, and a four-point delta sits inside that swing. **It passed three times by
luck.**

What is **not** in the noise is BREAK CONTACT: **30.2 turns to charge against 9.9,
and 17 ready-turns against 90**, every run. So that is what the file stakes a
claim on now, and the aggregate is **reported rather than asserted**. *A number
that passes by luck is a number that will fail somebody else by luck.*

---

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **144 pass / 0 fail**, four runs straight |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the one red is another session's fight-music ladder) |
| `one_engine_gate.js` | 3 / 0 |
| `boss_ladder_gate.js` | 87 / 0 |
| `rf4_teardown_gate.js` | 90 / 4 — all four pre-existing |
| page errors | **0** |

`NO DAMAGE BEFORE THE DIAL` survives: `applyDamage` is 40, and the archetypes are
byte-identical (`32-48/0.72`, `14-26/0.55`). This changes **who may act**, and
nothing about what an action does.

## WHAT COMES AFTER

**The priority-target question is still open and now I know why I could not answer
it:** the instrument. A passive player over a fixed twenty turns cannot resolve a
one-body difference. The honest next step is a *playing* A/B — the same policy
clearing the same boards, measuring **turns to clear and damage taken to clear**
rather than damage over a fixed window — which turns a fixed-length beating into a
race and makes one fewer gun actually show up.

Still open from his 8/25 dispatch and still combat's: **"it could be more hardcore
if you wanted it to be"** — permission, not a ruling.
