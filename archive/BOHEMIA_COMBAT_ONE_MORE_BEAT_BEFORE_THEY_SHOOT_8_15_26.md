# ONE MORE BEAT BEFORE THEY SHOOT (COMBAT, 8/15/26, v154)

Paolo, 8/15: *"OK, I think whatever it's at right now at one extra turn it takes
for Enemies to shoot at you and I think this might be more survival potentially
fun."*

That is a ruling. It shipped the same turn.

## WHAT CHANGED

A man does not get to shoot you the instant he sees you. He has to hold a bead
first, and only then does his gun enter the volley. That delay has been ONE turn
since the day it was written (V24, 7/19).

It is TWO now.

## WHY HE IS RIGHT, AND HE DID NOT HAVE TO SPELL IT OUT

Every single change this week made the board more dangerous:

- V152: cover decays, so the tile he is sitting on expires
- V152: the grenade came off its one-per-fight leash
- V153: their cover decays too, and a moving man is harder to hit
- V138: guns have real reach, and the board got big enough to use it
- V136/V137: they press, they flank, they hold a line, they bound

The one thing that never moved in any of it was HOW LONG HE HAS TO REACT. An
extra beat is the cheapest possible way to make all of that survivable without
undoing any of it. Nothing gets weaker. He just gets one more turn to answer,
which is exactly what "more survival potentially fun" means.

## AND THE NUMBER STOPPED BEING SCATTERED

The threshold was the literal `>= 1`, written out **ELEVEN TIMES** across the
volley, the wait-exposed path, the reckless path, suppression, the three
line-break counters, the pressure count and the RED-LINE DISPLAY.

Eleven copies of one rule is the exact shape that has cost him all week: a number
that has to be found everywhere before it can be changed, and a display that can
quietly disagree with the rule it is drawing. It is ONE DIAL now, `ACQ_TURNS`,
read through one predicate, `acquired(e)`.

**THE RED LINE MOVES WITH IT.** The bead he watches now appears on the exact turn
the rule uses. If the display had kept the old number he would see a red line and
not get shot, which teaches him to ignore the display.

## MEASURED, BEFORE AND AFTER

Same seeded arenas, standing still 14 turns, `git stash` between runs:

```
BEFORE   HP left 53.6   first time they hurt you: turn 7.0
AFTER    HP left 56.8   first time they hurt you: turn 7.7
```

Not a nerf, a breath. They still come, they still shoot, they still win if he
sits there. He just gets the turn back that this week took from him.

## GATE

`gates/combat_lab_gate.js` — **795 pass / 0 fail** (783 at the moment v154 landed; v155 ships in the same commit). Five assertions pinned the old
literal and were re-pointed by the same substring swap, plus two new checks: the
dial exists and is 2, and the display reads it. COMBAT RUNS (the real-browser
smoke), COMBAT ANIM and COMBAT POOL all green.

**Full suite, honestly**: 14 gates are RED on `origin/main` right now — DISTRICT
FILL, ROUND + DOORS, HAIR, RIG CHECK, PARTS PAINTED, BODY VARIATION, ROAD CELLS,
SQUINT, HUE, THE RUN, ONE WORLD TAB, NAV CLUSTER, INTERIORS, REUSE FIRST. **None
of them is combat's**, and this is proven rather than assumed: my work was
stashed, the tree reduced to clean `origin/main`, and every one of them ran again
and failed identically with nothing of mine present. (Membership shifted while I
worked — RUN BEAT went green on main, RIG CHECK went red on `tools/bohemia_rig_double.js`,
which is the CHARACTER lane's file and has never been touched here.) This ship
changes one base64 blob (COMBAT) and one build stamp.

## WHAT I DID NOT DECIDE

The range numbers. He said *"this isn't the final range version of the guns"* and
opened a debate. Nothing here touches `WEAPON_RANGE`.

## NEXT

The killshot chain still ignores facing. He said *"I already told you if I'm
facing one way the next person that I can kill shot can't be like directly on the
other side"* and he had told me. That is next.

TOOL: `tools/bohemia_combat_one_more_beat_before_they_shoot_patch.py`
