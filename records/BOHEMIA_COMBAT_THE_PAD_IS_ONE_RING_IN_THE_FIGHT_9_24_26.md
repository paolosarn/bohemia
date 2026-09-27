# V226 — THE FIGHT'S PAD IS THE ONE CUT RING (COMBAT lane, `[one mode]`, round 1)

**Paolo 9/21 in the vote tab, LOCKED, rule 24:**

> *"teleporting shit not part of the universe, **the buttons changing**, no consistency…
> one game mode, not teleporting to different game modes."*
> *"a UI that's not consistent for every second of the game."*

---

## FIRST, THE BOARD WAS WRONG AND IT WAS ABOUT MY OWN ROW

The board read `SHIPPED 9/24 648afbe [one mode]` while `[fight looks]` was still CLAIMED.
`648afbe` is V225, which is the `[fight looks]` work. The coordinator's own round record
routes it the other way: *"COMBAT [fight looks] -> SHIPPED (V225, 112 at every frame
width) … Next: [one mode]."* Nothing in V225 makes the fight stop being a second document.
Rule 6 says a half-done job marked SHIPPED is worse than an open one, so the marker moved
to the row it belongs to and `[one mode]` is claimed and started.

---

## THE MEASUREMENT, AND IT IS THE ROW IN ONE NUMBER

On the one driver (rule 14g), walking into a real fight on the alpha, photographed one tap
apart:

```
  THE WALK    cityFrame   shown 390x802    13 things he can read
  THE FIGHT   combatFrame shown 390x802    19 things he can read
  WORDS THAT SURVIVED THE START OF THE FIGHT:  0
```

**Not one thing on his screen is the same.** The city frame is not covered, it is torn down
to 0x0 and another document is put up in its place.

---

## AND ONE OF THE THINGS THAT CHANGED IS A RULING HE LOCKED

The two photographs put the two movement controls side by side, and they are the same
control drawn twice:

```
  THE WALK    ONE ring around his face, sawn into eight segments with hairline cuts
  THE FIGHT   EIGHT LOOSE CIRCLES, 28 px each, lettered N NE E SE S SW W NW
```

**Paolo 9/7, LOCKED**, picking option 1 off his own judge sheet:

> *"I want the action button to be only surrounded by **one** other circle, and that circle
> is **cut into** how many parts of the directions that we need. **I don't want them to be
> independent circles.**"*

The walked city built it that round. **The fight never got the ruling** — the shape he
rejected on 9/7 was still the first thing his thumb met the moment a fight started, and it
is `buildMoveRing`, Paolo 7/3/26, older than the ruling. Newest date wins, and the ruling is
about the control, not about which document it happens to be drawn in.

## WHAT SHIPPED

The fight's mover is now **the city's control, not a lookalike**. Every constant is lifted
out of `slices/BOHEMIA_CITY_WORLD.html`'s own ring builder rather than re-picked here
(REUSE-FIRST): the 180 box, `C=90 R0=50 R1=86 N=8 GAP=3.5`, the wedge maths, the walk arrows
in position order, `#1e1a13` on `#2a2418` with a `#d8c49a` arrow. A value re-picked here
would drift from his the first time either lane tuned one.

**The fire button keeps everything it says.** Its colour is not decoration — red means
somebody has a clean line on you, amber means one gun is up, green means a real lull, and
the word changes between SHOOT, HOLD, ENGAGE, POP OUT and NOTHING TO SHOOT. Rule 24 allows
what the fight *adds*; it forbids a different object. It was already wearing the city's face
styling byte for byte (same radial gradient, same box-shadow), which is why only the ring
was out of step.

**The verb buttons were re-measured, not nudged.** V122's comment says the offset was
measured against pips at `R=66` and that anything wider ate two of his directions. The same
sum is done again against the new outer radius of 86.

---

## WHAT IS NOT DONE, WITH THE NUMBERS, BECAUSE THIS IS ROUND 1 OF THE ROW

```
  THE WALK   ring box  90    face 40    centre 57 right, 51 up from the corner
  THE FIGHT  ring box 180    face 80    centre 96 right, 96 up
```

**The control is the same shape and the same paint and it is twice the size.** A control
that doubles when a fight starts *is* the buttons changing, and he ordered the walked screen
halved. It is not a size tweak: the walk's face is 40 px and says one short label, while the
fight's says `NOTHING TO SHOOT` and `ENGAGE · 2 PINNED`, so matching the walk is a decision
about **where those words live**, not about a number. That is the next thing in this row,
with UI `[one hud]`.

And the big one is untouched: **the fight is still a second document that takes the whole
panel.** `cityFightIn` clicks the COMBAT tab, which is the teleport itself.

## THE GATE, AND IT IS RED ON PURPOSE

`gates/one_mode_gate.js`, **7 passed, 4 failed**, and the four reds are the row:

```
  PASS  one ring, cut into eight, and zero loose circles          (his 9/7 ruling)
  PASS  the walk still has the same eight
  PASS  the fight paints it with THE WALK'S OWN VALUES, read off both documents in one run
  FAIL  the same size                    walk box 90, fight ring 180
  FAIL  the face in the same place       walk [57,51], fight [96,96]
  FAIL  nothing on his screen is replaced    0 of 13 survived
  FAIL  the walked world is still on the glass behind the fight
```

A gate that only held the finished half would be a gate that forgot the rest. The colour
legs are **compared frame to frame in the same run** rather than against a constant typed
into the gate, because a typed constant goes stale the first time either lane tunes a colour
and then the gate is green about two controls that no longer match.

**And it is built ON the one driver.** Rule 14(g), third round this lane asked for it: two
of my older gates read a loading screen and an unsized frame for rounds because each rolled
its own front door. This is the first new gate on the right side of that.

## RULE 22

In the VOTE tab as `combat-the-button-your-thumb-finds-9-24`: three crops of the same corner
of the same phone — the fight before, the walk, the fight now — off the real glass, with what
is still wrong said on the card rather than hidden.

---

**Tool:** `tools/bohemia_the_pad_is_one_ring_in_the_fight_patch.py` · **Gate:**
`gates/one_mode_gate.js` · **Stamp:** 9/24u · **Tab:** COMBAT, and any fight you walk into
from CITY; the picture is in VOTE.
