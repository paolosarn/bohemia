# THE FACE HAS LIGHT ON IT
## PORTRAIT lane, row [faces first] / [horror face], round 2 (9/21/26)

**Rule 22 (Paolo 9/21): a making lane cooks every round.** This is the cook. Four faces,
re-lit. **VOTE** tab, in the alpha, behind the gear, one card per face.

Paolo 9/14: *"a lot of the faces that you've been making are dogshit, very blank."*

---

## THE NUMBER THAT IS THE WHOLE COMPLAINT

Mean luminance of the left half of the face against the right half, on rendered pixels,
skin only:

| face | before L/R | spread | after L/R | spread | lit side |
|---|---|---|---|---|---|
| DENISE | 84.1 / 82.2 | **1.9** | 68.7 / 87.4 | 18.7 | LEFT -> RIGHT |
| RAY | 149.1 / 144.7 | **4.4** | 122.8 / 153.9 | 31.1 | LEFT -> RIGHT |
| MARCO | 123.9 / 121.8 | **2.1** | 103.9 / 128.8 | 24.9 | LEFT -> RIGHT |
| NINA | 127.0 / 125.1 | **1.8** | 106.2 / 131.8 | 25.6 | LEFT -> RIGHT |

**The two halves of a face differed by two points out of 255.** That is not a dim light or
a soft light. It is no light. "Blank" was literal and it had a number all along.

---

## AND THE FACE AND THE WORLD DISAGREED ABOUT WHERE THE SUN IS

`art_45_gate.py` holds the valley's convention in one line: *"a 3/4 iso mass is lit on its
RIGHT face, shadowed on its LEFT."* Every building obeys it, and a gate fails anything that
does not.

`renderFace` fills `cx+7 .. cx+cw` with `ShSoft`. **It shades the RIGHT.** So every wall in
the game turns one way and every face turns the other, and that had never been compared
because nobody had put the two rulers side by side. The cook takes the world's side: the
fixture is the valley sky, the same sun the walls already answer to.

---

## WHAT THE COOK DOES, AND WHY EACH CHOICE IS A LAW AND NOT A PREFERENCE

- **The light has a fixture.** Bible rule 4: *"every lumen has a source you can point at
  ... no mood gradient, ever."* The source is the sky, named, and shared with the walls.
- **No new colours.** Every shaded pixel lands on one of the **four entries that face
  already owns**, its own skin ramp. A terminator in four steps is pixel art; a smooth
  falloff is the gradient rule 4 forbids.
- **Baked, not shaded at runtime.** Bible rule 10. It runs once, into the buffer, where
  `renderFace` already draws.
- **The face still holds.** Bible rule 6, THE STILL FACE. This is form, not expression.
  Nothing here animates and nothing performs.
- **The bones cast, on this face's own numbers**: under the brow across the socket, the
  nose casting to the **left** because the light is on the right, and under the lower lip.
  Every coordinate comes from `f.eyeY`, `f.noseY`, `f.mouthY`, `spec.eyes.gap`,
  `spec.mouth.w` -- nothing measured off a picture.

**The eye stopped glowing.** The sclera was `[230,231,228]`, brighter than every skin tone
in the palette, which is why it read as a bead instead of an eyeball. It is tied to that
face's own light step now, and the top row takes the lid's shadow the way a real eye does.
35 sclera pixels per face.

**The mouth got a seam and corners.** It was a flat rectangle. A flat rectangle is a sticker.

---

## I LOOKED AT THE FIRST CUT AND IT WAS WRONG, AND THE NUMBERS HAD SAID IT WAS RIGHT

The first version guarded every pixel with `Math.max(band, wasBand)` so the pass could never
lighten something the artist drew dark. Well meant, and **it turned the whole thing into a
darkening pass.** RAY went 149/145 to **117/137**: his lit side barely moved and his shadow
side fell 32 points. Every face came out dimmer, and I looked at the sheet and RAY read as
dirty rather than lit.

**The spread number went up the entire time.** 2.1 to 16.4 looks exactly like success. A
face that is uniformly darker scores as "more contrast" on that metric and is worse on the
glass, which is the third time this lane has had a metric agree with a picture that is wrong.

The fix: **the terminator pivots, it does not dim.** The band is relative to what
`renderFace` already drew -- lit side up one step, shadow side down one or two -- so the
face keeps its own value structure and gains a turn, which is what light actually does.

Measured after the fix, and it is even-handed across skin tones rather than a dark-skin
penalty: **shadow side 16-18% down, lit side 5-6% up, on all four.** The pass takes more
than it gives because the ramp has four steps and most face pixels start near the top of
it, so there is more room below than above. Said out loud rather than smoothed over.

---

## WHAT IT DOES NOT DO

**It does not change the shipped renderer.** Rule 18 keeps code off the play surface and
rule 15 says he sees it in the VOTE tab first, so `renderFace` is untouched and the face
Paolo approved has not moved by one pixel. The cook is a tool
(`tools/bohemia_cook_the_face_has_light.js`) that re-lights what `renderFace` draws, using
that face's own bones and its own ramp. When he votes it up it folds into `renderFace` as
one block, and it is written to fold.

**[faces first] stays CLAIMED, not shipped.** Its ship test is the faces a stranger MEETS,
and a stranger still meets none of them: round 1 measured that the only face surface in the
game sits inside `#p-run`, a panel the demo never shows. That is RUN's and UI's, still
routed, still not mine to reach into.

---

## IN THE VOTE TAB

Four cards, `portrait-light-{denise,ray,marco,nina}-9-21`, old beside new at 7x, in
`slices/vote/`. One per face because he speaks along per face. Sheet:
`records/target/BOHEMIA_THE_FACE_HAS_LIGHT_9_21_26.png`. Numbers:
`records/target/BOHEMIA_THE_FACE_HAS_LIGHT.json`.
