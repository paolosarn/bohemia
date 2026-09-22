# EIGHT DIALS THE GAME ALREADY HAD AND HE COULD NOT TOUCH
## PORTRAIT lane, row [customizations first], round 1 (9/22/26)

His verdict, through the coordinator: **HE CAN BUILD HIS OWN FACE comes first. The maker
with the dials, then faces.**

*"we need like way more face and portrait customizations bro like before we start trying to
hand me shit"* — after killing twelve of thirteen faces.

**The face maker went from 14 sliders to 22.** Tab: **CHARACTER**, tap the portrait. Build
9/23f.

---

## THE MEASUREMENT: WHAT HE COULD AND COULD NOT REACH

Every numeric dial the face spec carries, swept floor to ceiling on a real face, with the
changed pixels counted. Not opinion, not a reading of the code.

**13 of 27 dials were not on the panel.** Of those, these eight genuinely move the picture:

| dial | pixels it moves |
|---|---|
| **face.top** | **430** |
| eyes.h | 93 |
| eyes.w | 65 |
| brows.thick | 24 |
| brows.gap | 18 |
| mouth.fullLower | 14 |
| brows.angle | 12 |
| brows.arch | 11 |

`face.top` is the biggest dial in the whole face bar two, and there was no way to touch it.
Driven through the real panel with the clamp running it moves **742 pixels**.

The brows are, in this file's own words, *"the loudest thing on a face this size"* — and he
could only change their **length**. Thickness, spacing, arch and angle were all out of reach.

**Nothing here was invented.** Every one already existed and already moved pixels; it was
simply not on the panel. MECHANISM MINE, CONTENTS HIS, and the contents were already his.

---

## AND FIVE I DELIBERATELY DID NOT ADD, EACH FOR A MEASURED REASON

A thing that promises something and does nothing is the worst bug in the game (rule 14d),
and in slider form that is a dial which cannot move pixels — what this file already calls
*"not a dial, it is a comment"*.

- **`face.cheekY` and `face.jawCornerY`** — `faceClamp` **re-derives both** from `top` and
  `len` on every change, so a slider would snap back the instant he let go. **I nearly
  shipped two dead controls**; reading the clamp before building is the only reason I did
  not. The clamp is right: the skull should stay coherent.
- **`eyes.hood`** — moves **one pixel**. Measured, not estimated.
- **`nose.len` and `details.stubble`** — **move ZERO pixels on twelve adult faces**, and the
  renderer's own source never mentions either name. **Two dead fields the face spec has been
  carrying.** Same class as the 8/28 finding where five style names drew identical pixels.

---

## PROVED THROUGH THE PANEL, NOT THROUGH THE SPEC

Every slider was driven the way the panel drives it — set the value, **run the clamp**,
render — because a dial the clamp undoes reads as fine in the spec and does nothing on
screen. That is exactly how the cheekY trap would have got through.

**All 22 sliders move pixels. Zero dead.** Range low to high, through the clamp:

```
FACE LENGTH 476   FOREHEAD 495   CHEEKS 445   FACE TOP 742   CRANIUM 223
EYE HEIGHT  178   EYE SPACING 110  CHIN 59   EYE OPENING 58   JAW 52
MOUTH HEIGHT 50   BROW HEIGHT 44   BROW SPACING 38   MOUTH WIDTH 32
BROW ANGLE 27     BROW THICK 25   BROW LENGTH 20   NOSE HEIGHT 18
BROW ARCH 16      LOWER LIP 14    EYE WIDTH 48     NOSE WIDTH 8
```

**And I shipped a panel that lied about itself for about a minute:** my new `eyes.h` was
labelled EYE HEIGHT, which `face.eyeY` already owns and which means *how far up the face the
eyes sit*. Two sliders with the same name is a panel that cannot be trusted. Mine is **EYE
OPENING** — how far the eye opens. No two sliders share a label now, and that is checked.

---

## GATES

```
face_maker        13/0      portrait_haircut  12/0
talking_portrait  28/1   <- the face-distance floor, STILL deliberately red from last
                            round: the metric cannot see a dark face (correlation 0.473
                            between a pair's brightness and its measured difference).
                            Unchanged at 0.0116, which is expected -- these eight dials
                            are HIS maker, not the crowd generator.
become            15/13  <- IDENTICAL on a clean origin/main worktree, measured last
                            round. Not mine.
```

Full suite: 107 red at ad23d875; none named as this lane's.

---

## IN THE VOTE TAB

`portrait-eight-dials-9-22`: each new dial at its floor beside its ceiling, so what every
control does is visible rather than described. Sheet:
`records/target/BOHEMIA_EIGHT_DIALS_YOU_COULD_NOT_TOUCH_9_22_26.png`.

**Still unanswered, and still the loudest thing anybody has said to this lane:** "more
analog horror", said fourteen times across the tab. Rule 30 binds it — every re-cook of a
killed item goes through DIRECTION's bible before it comes back as a new id. That is
`[horror face]`, it is next, and it is not another lighting pass.
