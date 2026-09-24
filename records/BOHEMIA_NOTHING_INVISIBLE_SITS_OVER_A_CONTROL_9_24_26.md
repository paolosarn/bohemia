# NOTHING INVISIBLE SITS OVER A CONTROL

PLUMBER, row `[covered controls]`, 9/24. Four times in two rounds a lane spent a whole round on
a control that was alive underneath something invisible: the loading canvas `#loadgl`, the VOTE
landing, the hidden fight frame, and the opening banner `#openInvite`.

This lane has hit it from the other side too. 17 dead presses of 24 turned out to be the **city
frame being asked whether its own button was topmost**, while the card covering it lived in the
parent page. And rule 14(h) is the other half: a dead button is indistinguishable from a close
button, so "did the screen change" proves nothing in either direction.

**The only honest question is where a finger actually lands, and the browser answers it exactly.**

## THE GATE, TWO LEGS, ON BOTH SURFACES

For every named control, on the alpha and the demo, through the one driver, after the door:

1. the TOP page's `elementFromPoint` returns that control, or the frame holding it
2. and for a control inside the frame, the **frame's own** `elementFromPoint` returns it too

**Leg 2 is not in the row and it is half the bug.** The top page hands a finger to
`iframe#cityFrame` for *everything* inside it, so a card sitting over the pad **inside** the
frame passes leg 1 with room to spare. That in-frame overlay is exactly the 9/21 finding where
the first card of the game sat over all eight direction buttons and **544 presses moved him zero
cells.** One leg catches an overlay above the frame; the other catches one below it.

## THE FIRST CUT REPORTED 24 COVERED OF 29, AND IT WAS ENTIRELY WRONG

It found the frame with `querySelector('iframe')`.

```
every iframe on the alpha page:
  voteOver 0x0   uiFrame 0x0   looksFrame 0x0  voteFrame 0x0  runFrame 0x0
  sliceFrame 0x0 lifeFrame 0x0 lookFrame 0x0   wordsFrame 0x0 artFrame 0x0
  combatFrame 0x0                              cityFrame 390x802   mapFrame 0x0
```

**Thirteen iframes, twelve of them 0×0 shells**, and the first in document order is `#voteOver`
at 0×0. So every offset was computed against the wrong box and every containment test compared
against the wrong element. The number it printed was specific, plausible and false, which is the
shape this lane keeps finding in its own instruments.

The fix is to stop guessing: **ask playwright which frame it is driving** (`fr.frameElement()`).
It cannot be wrong about the frame it is already talking to.

## AND THE ROW'S OWN WORDING GOES RED ON THE WALKING PAD, WHICH WORKS

The row says "at the control's own centre". Rule 12 says a dependency on a line is a premise, so
I measured it before building to it.

`#pad` is a **90×90 ring** (its only child is `svg#padring`) with the canvas `#modeFace` in the
hole. A centre-only rule calls that covered, on **both** the alpha and the demo. So I pressed it
like a finger, through the top page, and read his coordinates:

```
12 presses at the pad's TOP EDGE    hy 6268 -> 6145    HE MOVED
12 presses at the pad's CENTRE      hy 6145 -> 6145    nothing, correctly
```

The centre of a D-pad is a dead zone by design. **A gate that goes red on the working walk pad is
a gate the fleet switches off within a round**, and then it protects nothing. That is the same
lesson as the marker check that went red on a record quoting a marker.

So the question is not "is this control topmost at one pixel", it is **can a finger reach this
control at all.** Nine points across each control, and it passes if a finger reaches it at any of
them. That is also what the four incidents actually were: a full-surface overlay, not a speck.

**The row's suggested mutation tests the wrong thing.** "Park a 1×1 transparent div over the pad,
red" would fail a centre-only rule and pass this one, and this one is right: one transparent pixel
does not stop anybody pressing a 90×90 ring. It is kept below as a deliberate **negative** that
must stay green. The mutation that matches the bug is a full-size overlay, which is what the
loading canvas, the VOTE landing, the fight frame and the banner each were.

## FLOORS, BECAUSE A CHECK THAT FINDS NOTHING MUST NEVER PASS

- **red if the door is still in front of us.** Everything under a splash answers happily, and the
  answers are about a screen nobody is looking at. The driver's own comment already documents
  this for the door; the gate refuses to report anything measured there.
- **red if fewer than 8 controls are found.** An empty sweep passes every test inside it.

## MUTATION-CHECKED THREE WAYS, BOTH SURFACES, EXIT CODES READ WITHOUT A PIPE

| plant | result |
|---|---|
| full-size invisible div over the pad, **inside** the frame | red on leg 2, both surfaces, `div#plantedOverlay` named |
| the same over the whole city frame, on the **page** | red on leg 1, both surfaces, culprit named |
| **one transparent pixel** at the pad's centre | **stays green**, as it must |
| clean tree | 8 passed, 0 failed, 102 s for both surfaces |

## WHAT IT FOUND ON THE CURRENT BUILD

Nothing. 25 controls on the alpha (5 on the page, 20 in the frame) and 9 on the demo, all
reachable. That is the correct result for a standing check on the round it lands, and it is worth
saying plainly rather than hunting for something to report: the four incidents were all fixed by
the lanes that owned them. What did not exist until now is the machine that notices the fifth.
