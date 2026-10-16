# COVER IS A PLACE YOU STAND (COMBAT, 8/15/26, v156)

Paolo, 8/15: *"I'll be in the middle of nowhere and then it will still tell me to
pop out like I don't even have Cover and then the action button still says pop
out what's up with that are Enemies even trying to get into an angle where you
will not be undercover but exposed to them like are they even trying to get an
exposed shot on you or what?"*

Two complaints. **One root cause**, and it is the same shape he caught me on with
v153: the rule ran one way.

## THE ASYMMETRY, IN THE FILE'S OWN CODE

What an **enemy** has to satisfy to count as covered (`realCoverPillar`):

```js
segNear(0,0,exy[0],exy[1],pxy[0],pxy[1],P.r*0.85)      // blocks the line
  && Math.hypot(pxy[0]-exy[0],pxy[1]-exy[1])<1.8       // AND HE IS AT IT
```

What the **player** has to satisfy (`myCoverAgainst` → `coverPillarAgainst`):

```js
Math.sin(dA)*P.edist < P.r*0.9                         // blocks the line
                                                       // and that is all
```

**There is no proximity test on his side at all.** A man has to be hugging his
stone. A rock six tiles away, sitting anywhere on the sightline, counted as the
player's cover. That is not cover, that is scenery.

## MEASURED

60 arenas, 360 samples of where he actually stands:

```
game says YOU ARE IN COVER            94.4% of the time
with no hard stone within 1.5 tiles   83.8% of those
median distance to that "cover"       2.8 tiles
worst                                 6.0 tiles
```

And over 400 turns of a fight where he never walks to a stone, the button offered
POP OUT on **370 of them, every one a lie**. He is describing this exactly.

## AND IT IS WHY HE COULD NOT TELL IF THEY WERE FLANKING

The flank notice fires when a man's move turns a blocked angle into a clean one.
With ghost cover in the map the "before" was blocked almost everywhere, so:

```
"N came around your cover" fired on 98.8% of turns
```

A warning that fires every single turn communicates nothing. It has been crying
wolf at him all week, which is precisely why the answer to *"are they even
trying"* was invisible on his screen.

**THEY ARE TRYING, AND IT WORKS.** 40 fights, he never moves, men with a clean
shot on him:

```
turn    0    1    2    3    4    5    6    7    8    9   10
clean  3.9  4.1  4.2  4.4  4.5  4.6  4.7  4.8  4.9  5.0  5.0
```

Real flanking he could not see because the notice was noise. (First harness I
wrote said they stopped moving after turn one — that was **my bug**, not the
game's: `pressAI` skips anyone who already moved this turn and I never advanced
the turn counter. Fixed the harness, re-measured, reported the real numbers.)

## THE FIX, AND THE LINE IT DRAWS

There are two different facts and the file had one word for both:

- **BEING SHIELDED** — a rock on the line stops a bullet at any distance. Real
  physics. **Unchanged.** He keeps every bit of protection he had.
- **BEING IN COVER** — a place you are standing, that you can pop out *of*.

`inRealCover()` is the second one, and its reach is not invented: `COVER_REACH`
is 1.8 tiles, the number `realCoverPillar` has demanded of every enemy body since
v108. **The rule runs both ways now.**

This also settles a fight between two of his own rulings. v52 asked *"is any
stone near me"*. v123 replaced it with *"is anything between me and anyone"* and
threw the proximity away. **Neither half alone was ever right.** It is the
conjunction now, which is what both of his complaints were always asking for.

## MEASURED AFTER

Standing in the open, 400 turns:

```
button says POP OUT                    0    (was 370, all lies)
notice claims a flank                  0    (was 98.8% of turns)
notice says what actually happened     400
```

Standing behind a real stone, 400 turns:

```
button says POP OUT                    100%   (correct, he is in cover)
somebody came around that cover        100%   (correct, and now it is TRUE)
```

So the notice did not get switched off. It got made true, and behind real cover
somebody works your angle **every single turn**. That is the answer to his
question, and now it reads.

## NOTHING GOT HARDER, AND THAT IS MACHINE-CHECKED

A sim could not prove this — the damage harness saturates and floors both arms at
zero, so I am not dressing up noise as evidence. The proof is **containment**:
every value v156 changed reaches only the screen. `nearCov` feeds the button text
and its glow. `onCov` feeds the run readout. `flanked`/`closed` feed one sentence.
The gate strips comments (a checker that cannot tell a mention from a use is the
broken one) and fails if any of them ever touches damage, the dial or a pool.
**Mutation-tested**: wiring `nearCov` to HP takes it red.

## GATE

`gates/combat_lab_gate.js` — **800 pass / 0 fail**. The new checks RUN the
predicate: a stone at 0.9 and 1.7 tiles is cover, the same stone at 2.8 and 6.0
is scenery.

Three checks were re-pointed, and one was **the ruler being broken**: *"every
enemy-facing cover call carries its level"* used exact counts (`=== 9`, `=== 1`),
so adding a correct new call that carries its level took the gate red for a
reason unrelated to the law. The comments beside them had already said so twice
in their own words. They are floors now, and the invariant is asserted directly
across every form including `coverPillarAgainst`. **Fix the ruler, never the
target.**

TOOL: `tools/bohemia_combat_cover_is_a_place_you_stand_patch.py`
