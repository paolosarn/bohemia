# BOHEMIA ADDENDUM — ARTICULATION IS NOT FRAGMENTATION
**8/2/26. LOCKED. WORLD lane. Machine: `gates/one_building_gate.js`.**

> "Downtown District that one is looking like at 85%. We can approve it for now.
> That library, I'm just a little confused. It looks like it's in... **there's like
> six different buildings of the library. What's up with that?** I would give it a
> 22%."
> — Paolo, 8/2/26

---

## THE LAW

**A building is ONE building. "No building is a flat rectangle" (7/30) means
ARTICULATE THE MASS. It does not mean SPLIT IT UP.**

A civic landmark is one mass whose *parts* differ — a drum, a tower, a long low
wing — all joined, sharing walls, the roof line stepping between them. That is
articulation. Breaking the same programme into four separate boxes standing near
each other is fragmentation, and it reads as a campus of sheds, not a landmark.

**THE BUILDING TYPE DECIDES, NEVER THE GATE.**

- A **library** is one building, because a library *is* one building.
- A **downtown block** is many buildings, because a street of narrow lots *is*
  many buildings.
- A **strip mall** is a row of separate units, because a strip *is* a row.
- A **school** is a campus, because a school *is* a campus.

There is no universal number. There is only what the thing actually is. Any gate
that names a count without naming the building type is guessing, and the next
section is what happens when it guesses wrong.

---

## THE WORSE HALF: I HAD ENCODED THE MISTAKE IN A GATE

`gates/library_gate.js` asserted:

```js
if (r.footprints.length < 4) anatomy = false;   // WRONG. Deleted 8/2/26.
```

**The machine was REQUIRING the bug.** Every run came back green while drawing
exactly the thing he rejected, and any future session that touched the library
would have been *forced* by the suite to keep it fragmented.

This is a different and worse failure than a bad drawing. A wrong drawing costs
one turn. **A wrong law outlives the turn that made it and teaches every future
session the same error.** A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED is only
half the doctrine; the other half is that a gate asserting the wrong thing is
worse than no gate, because it converts a mistake into policy.

**THE TELL:** when a gate encodes a *count* or a *threshold* that nobody ever
ruled — when the number came from whatever the generator happened to produce the
day the gate was written — that number is a guess wearing a law's clothes. Write
the REASON in the gate, and derive the number from the reason. If you cannot
state the reason in one sentence about the real world, the assertion does not
belong in a gate.

---

## THE MACHINE

`gates/one_building_gate.js`, and it holds **both** directions on purpose:

| direction | districts | assertion |
|---|---|---|
| **SINGLE** | library, chapel, city hall, courthouse, terminal, enclosed mall | the largest connected mass holds **>= 90%** of all building/structure area, worst placement of six |
| **MANY** | downtown block, commercial strip, school campus | the largest mass stays **under 70%**, so nobody "fixes" a street of lots into one blob in the name of this law |

Plus a third check that reads `gates/library_gate.js` itself and fails if a
`footprints.length < N` fragmentation assertion ever reappears.

**Measured as SHARE, not as a footprint count, on purpose.** The library's drum
has an oculus ring around its inner core and the courthouse has an enclosed
atrium, so both report *two* footprints while being one building — a hole in a
roof is not a gap between two structures. Counting masses would have failed the
very buildings that are right. Share does not care about a hole in the middle,
and the small slack under 100% is for free-standing structure-kinded dressing
(plaza lights, a rooftop lantern), never for a second building.

---

## WHAT ELSE THE SAME TURN SURFACED

Two smaller findings, recorded because they are the same class of error:

1. **A COLOUR THAT LIES IS A BUG, like a name that lies is a bug.** The rebuilt
   library's tower was painted end to end in the rooftop-plant grey, and at plot
   zoom it read as a *hole* between the drum and the museum. Seen from above a
   tower is a CAP: a parapet ring round a roof plate with the stair core in it.
   (The 7/31 "a name that lies is a bug" finding, in a different medium.)

2. **JOINING MASSES CAN COST YOU YOUR SILHOUETTE.** The moment the hero icon's
   parts touched, `squint_gate.py` caught the library as a silhouette twin of the
   battery district at 16x16. Articulation has to be legible in OUTLINE, not just
   in plan — the fix was a four-step cone beside a slender needle, which is a
   shape nothing else in the valley has. Two laws pulling opposite ways is normal;
   satisfy both, never trade one off.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins. Indexed
in `BOHEMIA_CANON_INDEX`. The verbatim verdict lives in
`records/BOHEMIA_VERDICT_DOWNTOWN_LIBRARY_8_2_26.txt`; the standing rule is
indexed in `laws/BOHEMIA_PAOLO_FEEDBACK_MASTER.md`.*
