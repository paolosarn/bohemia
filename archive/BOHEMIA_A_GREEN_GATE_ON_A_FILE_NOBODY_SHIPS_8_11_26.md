# A GREEN GATE ON A FILE NOBODY SHIPS (8/11/26, WORLD lane)

## THE SHORT VERSION FOR EVERY OTHER LANE

**If you edit anything in `engine/`, run this before you believe your own gate:**

```
python3 tools/bohemia_city_module_resync.py --check
```

The app carries **43 engine modules inlined verbatim**. Every `tools/*_patch.py`
that put one there is **one-shot**: it checks for its own marker and prints a
cheerful `no-op` forever after. Editing the engine file does not change the app.
Nothing told anyone. As of today `gates/inlined_fresh_gate.js` is in the suite
and does.

## WHAT ACTUALLY HAPPENED

Paolo ruled (8/11): *"especially in act one I wanna see lots of corpses ... in
abandoned parts of streets and abandoned buildings in abandoned houses clusters
where it's really creepy. The cemetery can become like a body dumping pit."*

I built it in `engine/bohemia_dead.js`: clustered placement, seeds biased away
from the drive network, act-1 density 2.2x, cemetery at cluster 34.

Then I did all of this, in this order, and every single step reported success:

1. Ran `tools/bohemia_city_dead_patch.py` -> *"the dead are already wired into
   the walked world. no-op."* exit 0.
2. Ran `tools/bohemia_city_dead_pool_patch.py` -> *"no-op."* exit 0.
3. Ran `gates/dead_gate.js` -> **48 passed, 0 failed**, 62 districts,
   4,360 bodies, cemetery weight asserted against his ruling.
4. Ran the LOOK shot tool to photograph the pit -> **MISS**.

Four green signals and one red one, and **the red one was the only honest
signal in the set.**

## THE PART I GOT WRONG BEFORE I GOT IT RIGHT

I guessed at the MISS. My hypothesis was the realization guard: scanning an
unrealized cell returns nothing, so I prefixed the search with `tileMeta(tx,ty)`.
It still missed. **That is the second time this session I attributed a symptom
instead of measuring it** (the first was blaming the dead pass for 35-55ms of
frame time that instrumentation showed was 0.1-3.5ms).

So I measured. A probe in the real page, asking the real world two questions:

```
cemetery cells on this seed:  (40,17), (57,67), (58,67)   <- three, on 9,216 cells
deadForCell(40,17):           total 4, outdoor 3
```

The engine said 34. The app said 3. **The app was a build behind.**

`bohemia_city_module_resync.py --check`, which has existed since 7/26 and which
nothing in the suite ever ran:

```
CITY MODULE RESYNC: 43 embedded, 41 already fresh
  STALE: engine/bohemia_dead.js
  STALE: engine/bohemia_vista.js
```

Two lanes' work, both silently unshipped. After resync: `total 68, outdoor 34`,
story string `"the pit. they stopped digging graves and started digging one hole"`.

(The MISS had a *second*, unrelated cause, found the same way: the shot's scan
window was `20..80` and the pit is at `ty=17`. Three cemetery cells on the whole
board means a narrow window can miss a district that exists. Widened to the
full 96.)

## WHY THIS IS THE WORST CLASS OF BUG IN THIS REPO

It is a **FALSE GREEN**, and `gates/bohemia_city_app.js` already says in its own
header that a false green is worse than a false red. `dead_gate.js` was not
lying and it was not badly written. It was **reading `engine/bohemia_dead.js`,
which is not a file Paolo can ever see.**

This is **VERIFY ON THE REAL SURFACE (7/18)** biting again. That law was written
about art -- "a side-door probe is a lie" -- and the lesson generalizes exactly:
*a gate that measures a source file measures a source file.* The surface is
`slices/BOHEMIA_CITY_WORLD.html`. If the claim is about the game, the
measurement has to happen in the game.

It is also **A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED** applied to a tool
instead of a law. `bohemia_city_module_resync.py` correctly diagnosed this two
weeks before it bit me, and it did not matter, because **a tool nobody runs is
worth exactly as much as a law nobody gates.**

## THE GATE, SAME TURN

`gates/inlined_fresh_gate.js` (registered in the suite, placed BEFORE `THE DEAD`
on purpose -- it tells you whether the gates after it are looking at the shipped
page at all).

It **delegates** the measurement to `bohemia_city_module_resync.py` rather than
re-deriving it. That is deliberate. The resync tool finds the body the app
carries by walking git history until it finds the matching revision, precisely
because module sources contain comment banners that fool any boundary scan.
Re-implementing that here would be a **second, worse ruler for the same
measurement** -- the exact mistake that produced 51 invented scatter violations
on 8/9. **One ruler.** The tool owns the measurement; the gate owns whether the
answer is allowed to ship.

Self-tested by breaking it on purpose (appended one comment line to
`engine/bohemia_dead.js`):

```
FAIL EVERY INLINED MODULE IS ITS ENGINE CANON, byte for byte (42/43 fresh)
       STALE: engine/bohemia_dead.js
       FIX: python3 tools/bohemia_city_module_resync.py
exit 1
```

A gate that has never been seen to go red is not a gate, it is a decoration.

## THE STANDING RULE THIS LEAVES BEHIND

**Green gates are not evidence that the work shipped.** They are evidence about
whatever file they opened. Before claiming a change is in the game, the
measurement has to come from the page Paolo taps -- a probe, a screenshot, a
count read out of the running world. This is why the LOOK tab exists, and it is
why the LOOK tool's MISS was more valuable than the 48-0 gate that preceded it.
