# BOHEMIA LAW — HE CAN BUILD HIS OWN FACE (8/28/26, LOCKED)

## WHERE THIS CAME FROM

Paolo, 8/25, THE PLAYTEST DISPATCH, item 10:

> "animations get an audit and **FACE CUSTOMISATION, never built,** is on the board."

And HE MUST BE ABLE TO DIRECT IT (8/12, LOCKED): every system he has to make decisions
about ships with an **instrument for making them, IN A TAB, the same turn.**

> **THE TEST: WHERE DOES HE CHANGE THIS HIMSELF?**
> If the answer is "he tells me and I edit a file", it is not shipped.

---

## WHAT WAS ACTUALLY THERE

There **was** a thing called a face editor, reached by tapping the portrait in the
CHARACTER tab. It had five swatch rows — skin, hair, eyes, lips, brows — and a pad for
nudging feature offsets per facing.

**Not one control touched the shape of the head.**

At 64 pixels, **identity is size and spacing, not detail** (8/27, and it is what face
recognition calls the identity channel too). So the thing called a face editor could not
change a face. It could change what colour that one face was.

**And everything it needed already existed and none of it was reachable.** `faceFor` has
rolled a full grounded shape vocabulary for every stranger in the valley since 8/27 —
length, cranium, forehead, cheek, jaw, chin, and where the brow, eyes, nose and mouth sit
on them. **The player was the one person in Bohemia who could not have a different head.**

---

## WHAT SHIPPED

**Tab: CHARACTER.** Tap the portrait.

- **Fourteen shape sliders** — face length, cranium, forehead, cheeks, jaw, chin, brow
  height, eye height, nose height, mouth height, eye spacing, brow length, mouth width,
  nose width. The portrait redraws as he drags.
- **The haircut**, picked from **the body's own fifteen**. Choosing one writes the same
  five dials the crowd's portraits read (8/28), so the head he builds and the people he
  meets are described in one vocabulary rather than two.
- **Four hair textures** — wavy, coiled, locs, smooth — each of which moves pixels.
- **ROLL A FACE**, which is `faceFor` itself, the same generator every stranger in the
  valley comes out of. The button cannot produce anything the game could not already
  produce; it is a way of *seeing* the space, not a second generator.
- **BACK TO PUNK**, which restores the approved face exactly and keeps the colours he
  picked, because rerolling a choice he just made under him is not a reset.
- **EXPORT THIS FACE**, a `.txt` — the verdict workflow, and a face he cannot send me is a
  face he cannot keep.

---

## THE ANATOMY IS MINE, THE FACE IS HIS

MECHANISM-MINE / CONTENTS-PAOLO'S. Every slider re-clamps against the same rules `faceFor`
obeys for every stranger:

- the **cheeks** are the widest part of the head
- the **jaw** is narrower than the cheeks
- the **chin** is narrower than the jaw
- the brow, eyes, nose and mouth keep their order down the face, and the mouth stays above
  the chin
- the four row positions are stored as a **fraction of the face**, so lengthening the head
  moves the eyes with it instead of stranding them near the jaw

**He cannot build a head that is not a head, and inside that he can build any head he
likes.** Nothing is rejected — the neighbour gives way — so a slider always does something.

---

## THE GATE

`gates/face_maker_gate.js` — **13 checks, and it drives the real panel.** It opens the
CHARACTER tab, clicks the portrait the way he does, finds the sliders that are actually in
the DOM, moves each one and re-renders the player's face to see whether the pixels moved. A
gate that read the source for the word "slider" would pass on a panel that does nothing
(VERIFY ON THE REAL SURFACE, 7/18).

1. it is in a tab, and the tab is CHARACTER
2. tapping the portrait opens it
3. there are shape controls at all (14; before this turn: **zero**)
4. **every slider moves the pixels** — each tested from a clean PUNK, at both ends
5. **he cannot build a head that is not a head** — every slider driven to both extremes,
   anatomy asserted, and it still renders
6. all fifteen canon haircuts are pickable, and picking one changes his face
7. ROLL A FACE gives a different face, and a different one each time
8. **BACK TO PUNK restores the approved face by hash**, not by intention
9. he can export what he built

### And the harness had to be fixed before it was worth anything

The first version swept the sliders in order without resetting between them, and reported
**MOUTH HEIGHT as a dead dial.** It was not: maxing FACE LENGTH earlier in the loop had
already pushed the mouth to its own ceiling through the anatomy clamp, and restoring the
length does not pull it back — so by the time the mouth was tested it was already at the
value the test was about to set.

**A harness with state in it measures the state, not the thing.** Fourth broken ruler in a
week, and the fourth time the failure was flattering-shaped rather than alarming-shaped.

---
Tab: **CHARACTER** — tap the portrait.
Record: `records/BOHEMIA_HE_CAN_BUILD_HIS_OWN_FACE_8_28_26.txt`.
