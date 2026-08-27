# V193 — THE GROUND IS A DECISION AND IT WAS INVISIBLE (COMBAT lane, 8/27/26)

Two of his three remaining 8/25 play notes, both measured before anything was
built, and both turned out to be one sentence: **the fight already had the thing
he was asking for, and the screen never said so.**

---

## NOTE THREE: "THERE DOESN'T FEEL LIKE THERE'S ANY STRATEGIC REASON"

> "I just keep testing out this street with **bullshit pillars and bullshit
> stairs** that I could climb, and **there doesn't feel like there's any
> strategic reason to do so**. This combat has a long way to go." — Paolo, 8/25

### MEASURED FIRST, 40 FIGHTS, MID-FIGHT, ON THE SHIPPED PREDICATES

| | |
|---|---|
| guns that can reach you where you stand | **1.38** |
| the best tile within three steps | **0.00** |
| the worst tile within three steps | 2.10 |
| fights with a strictly better tile | **30 of 40** |
| fights where every tile is identical | 3 of 40 |

**HE IS RIGHT, AND FOR THE OPPOSITE OF THE OBVIOUS REASON.** In three fights in
four there is a place within three steps that takes **every gun** off you. The
ground pays enormously. The only way to find that in this build was to walk there
and see what happened.

He walked in circles for many turns, said "it felt decent", and could not see
that two steps left was zero incoming. **The decision was always there. It was
never on the screen.** RF4-48 states that as pass/fail: *"if a mechanic can only
be understood from a menu, the recreation has failed on RF4's own terms."* This
one could not be understood from a menu. It took a script.

### AND THE FIRST RUN OF THE PROBE SAID THE OPPOSITE

At the bell it read **0.28 guns on you** and a better tile in 9 of 40 — which
would have "proved" the ground is safe and the complaint imaginary. V140 and V145
deliberately spawn every man outside your reach, so **turn one measures a design
decision, not a fight.** Ten turns of the shipped AI walking in and the number
inverted. *A measurement taken before the thing being measured has started is not
a measurement.*

### WHAT SHIPS: THE READ

The reachable tiles are scored by the **fight's own geometry** — `gunsOnTile` is
`coverPillarAgainst` plus `posExposed` with the origin moved — and the **equal-best
set** is painted on the floor, with the nearest of them naming what it is worth.

- **`gunsOnTile(0,0)` equals `posExposed()` in 30 of 30 fights.** The paint can
  never be a second opinion about who can shoot you.
- **It names ground in ~22 of 30 fights, and walking there delivers exactly what
  it promised**: 1.68 guns promised off against 1.68 actually taken off, the
  promise holding in every offer but the rare boundary case where a man sits
  exactly at the edge of his own reach.
- **Silent when there is nothing to decide.** Nothing on you, nothing painted.
- **Computed once per board state** (23–25 tile tests on the first call, still 23–25
  after four), because 24 tiles against 60 rocks every frame is item 7 of his own
  dispatch.
- **He can switch it off.** COMBAT tab, DEMO SETTINGS, THE READ.

---

## NOTE ONE: "I'M KINDA CONFUSED ABOUT WHAT AMMO DOES"

**BECAUSE THE GAME HAS BEEN LABELLING EVERY CORPSE "AMMO" WITH AMMO SWITCHED OFF
SINCE 8/16.**

`AMMO_ON` is false on his own **second** rejection (V159). The floor marker V157
wrote for loose rounds still drew the literal word AMMO. Then V181 put
**experience** on every body, V184 put **plates** there, V190 put **boss keys**
there — all through the same drops array, all still labelled AMMO.

So the thing he walked over said AMMO, held experience, and belonged to a system
that does nothing. **He was not confused about ammo. He was reading a label three
features out of date.** It says what is actually on the tile now, and a KEY
outranks everything else because it is the only thing on that board you cannot
get anywhere else.

---

## THE PIXEL ARM TOOK SEVEN ATTEMPTS AND EVERY FAILURE WAS THE SAME MISTAKE

Trying to find a small mark inside a moving picture, from outside the renderer.

1. **Blue over the whole canvas:** 79 → 70 on one run, 51 → 72 on the next. The
   way-out marker is blue and it **pulses**.
2. **Boxes at coordinates the gate computed itself:** 0 → 0. `fieldPos` runs
   inside `drawField` with a centre and a pixel ratio the gate does not have.
   **The gate should not be recomputing where the game drew.**
3. **A frame diff calling the difference noise:** 400 to 3,800 pixels of noise,
   because the whole board animates.
4. **The clock pinned, `renderBoard()` called three times:** a perfect zero for
   the control *and* the signal. `renderBoard()` does not put pixels down; the
   animation frame does. **A clean control with a dead signal is what measuring
   nothing looks like.**
5. **The clock pinned with the frame allowed to run:** still 116–1,691 of noise,
   because letting the frame run lets the game run.
6. **Instrumenting the real context, reading immediately:** zero marks — attempt
   four's mistake in new clothes.
7. **Instrumenting the real context and keeping it on across a frame:** works.

**THE DEFECT WAS ALPHA, SO ALPHA IS WHAT THE ARM CHECKS.** 0 marks with the read
off, one per painted tile with it on, at alpha **0.15 to 0.357**. The original
0.075 fails that line by construction.

### AND THE FIRST CUT OF THE FEATURE FAILED ITS OWN ARM

It painted every *merely better* tile — **19 of 24 at once** — and to keep that
many marks from shouting they were drawn at 0.075 alpha and moved **fifteen
pixels** on the real canvas. Painted and invisible, which is V129's stamina-fluid
finding word for word. **A board with the lights on is not an answer.** The
equal-best set is painted instead: fewer marks, loud enough to see, and it points
in a **direction** rather than naming one square.

## AND ONE BRACE KILLED THE WHOLE SCRIPT

Tightening the tile filter left an extra `}` that closed `readGround` early. The
tail then ran at load, `key` was undefined, and **nothing in combat existed** —
`node --check` passed, because the file was still valid JavaScript. Same class as
V189's comment-inside-a-comment: *spelled correctly, in the wrong place.*

---

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **136 pass / 0 fail** (was 130/0), three runs, stable |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the one red is another session's fight-music ladder) |
| `boss_ladder_gate.js` | 87 / 0 |
| `one_engine_gate.js` | 3 / 0 |
| `tool_idempotent_gate.js` | 6 / 0 |
| page errors | **0** |

One anchor re-pointed for structure, never outcome: **V157's marker claim**
matched the literal string `fillText('AMMO')`, and its actual claim is that the
marker was *reused* rather than reinvented. It asks for the label draw at the
marker's own position now, not for one particular word inside it.

## WHAT COMES AFTER

Of his ten-item 8/25 dispatch, COMBAT's rows are now down to one: **"it could be
more hardcore if you wanted it to be."** That is permission, not a ruling, and it
sits behind the difficulty package he already has. The pillars-and-stairs note is
answered from both ends — the stairs are something you take off THE CLIMB (V190),
and the ground now says what it is worth.

Everything else left on his list belongs to other lanes: the demo build itself,
the front door, the first morning, the feedback card and the twenty-four seconds
to first play.
