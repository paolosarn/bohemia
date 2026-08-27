# BOHEMIA LAW — EVERYBODY HAS A FACE, AND IT TALKS (Paolo, 8/26/26, built 8/27)

## HIS WORDS

> "every time you speak to someone, their portrait will pop up on screen so you
> feel like you're relating to them. Maybe their portrait will pop up in your
> action button. maybe to keep that part of the UI decent and composed... from
> animation to the faces to... now we have more pixels to play with. Like, I said
> facial animations too, bro, like talking and shit and, like... I mean, from
> eyebrows moving."

## WHAT WAS ACTUALLY WRONG, AND IT WAS NOT THE ANIMATION

The 8/26 turn built the performance: `facePerform(id, ms, line)` returns what a
face should be doing at any millisecond, `renderFace(spec, {mouth, blink, brow})`
draws it, four visemes driven by the letters, blinks on measured human timing. It
was gated and correct.

**Nothing in the game called it.** The turn ended with a feature nobody could see,
and the handoff said so.

Here is why, and it took one grep to find and one turn to miss: **`renderFace` has
been invoked exactly one way in this entire codebase — `renderFace(buildSpec())` —
and `buildSpec()` is a clone of `pface`, the PLAYER's face.**

Only the player had a face. The family cast had bodies (`dials` and `worn`) and no
face. Every stranger in the valley had a body and no face. So "their portrait pops
up" had nothing to pop up, and the performance had nobody to perform.

**THE MISSING PIECE WAS NEVER THE ANIMATION. IT WAS A FACE FOR SOMEBODY WHO IS NOT
YOU.**

## WHAT CARRIES IDENTITY AT 64×64

Not detail — there is no room for detail. It is the **size and spacing of the
features**, which is also what the face-recognition literature calls the identity
channel: the shape of the face and the relative position of the organs. So
`faceFor(id)` dials exactly those, and `renderFace` is untouched:

| channel | fields |
|---|---|
| head shape | `craniumH`, `foreheadW`, `cheekW`, `jawW`, `chinW`, `len` |
| spacing | `browY`, `eyeY`, `noseY`, `mouthY`, `eyes.gap` |
| weight | brow `thick` / `len` / `angle` — the loudest feature this small |
| colour | skin, iris, lips, brow, hair |

Every one of those already existed as a field on the spec. **Nothing about
`renderFace` changed to make this work.**

## GROUNDED, NOT RANDOM (REALISM FIRST)

A rolled face has to be a PERSON, not a monster. The sampling holds the
proportions real faces hold:

- the face divides in vertical **thirds** (hairline→brow, brow→nose, nose→chin),
  and `browY`/`noseY`/`mouthY` are jittered *inside* their third, never across it
- the **gap between the eyes is about one eye wide**
- the **mouth is a fraction of the face it is in** (~⅓ of the cheek width), never a
  fixed number, and never wider than the jaw
- a jaw may not be wider than the cheek it hangs from; a chin may not be wider than
  the jaw (without these two lines the dice eventually roll a triangle standing on
  its point)
- **a child is not a small adult**: bigger cranium, rounder jaw, features lower.
  `FAMILY_CAST` already carried `age`, so it drives this.

## DETERMINISTIC, ALWAYS

Same id → same face, forever, on any device, with nothing stored. A person you met
yesterday has the face you remember. **No `Math.random` anywhere in the face or the
performance** — a person who shimmers is not a person.

## MECHANISM-MINE / CONTENTS-PAOLO'S

This decides how a face is **built**. It never decides who anybody **is**. A named
character can be handed an explicit spec and it wins outright over the roll
(`faceFor(id, over)`), which is how the family will carry whatever he rules about
their faces — put a `face` block on the `FAMILY_CAST` row and it lands with no code
change.

## WHERE IT SHOWS UP

**The cold open** — the first thing anybody sees in the demo. The caption already
had a speaker and a line and no face. Now the speaker's portrait sits beside the
words and performs while they talk.

- the face is **beside** the words, not above them: on a phone held in portrait the
  caption is already near the bottom and a head on top pushes the words into the
  thumb
- **a title card has no speaker, so it has no face.** A head next to "TEN YEARS
  LATER" is the game claiming a line has an owner when it does not
- **a repaint is not a new line.** The cold open repaints its caption several times
  per beat — the SOUNDS lane measured it speaking 58 times for 7 lines — so `say()`
  dedupes on speaker+text exactly the way `cutVoice` does. Same bug, same shape,
  and it would have been the third time
- it does **not** re-render 60 times a second: four mouths × a blink in eighths ×
  three brow positions is a couple of dozen images, rendered once and reused

## THREE THINGS LOOKING CAUGHT THAT MEASURING DID NOT

1. **A CLOWN PARADE.** `HAIR_COLORS` lists pink and violet beside black, and a
   uniform pick treats them as equally likely — sixteen generated people, three
   pink heads. *That is the trenchcoat bug of 8/27 exactly, one day later:* uniform
   over a list whose contents are not uniform in life. Now weighted to real
   distribution, dye ~5%, and grey is dealt from **age** because grey is not a
   colour anybody picks.
2. **DIALS THAT COULD NOT MOVE THE PIXELS.** The first cut rolled five hair-style
   names when `renderFace` tests for two, and jittered `eyeY` by ±0.7px so all
   forty people had *identical* eyes. Both looked like variety in the source and
   were nothing on screen. **A dial that cannot move the pixels is not a dial, it
   is a comment** — which was written eighty lines above and then broken in the
   very next block.
3. **A STRAIGHT LINE DOWN EVERY HEAD.** The hair part was a perfectly ruled dotted
   column, which is HOW HAIR AND SHAPE WORK (8/1) clause 3 broken in one line. It
   survived because the player is one face; the day everybody grew a face it became
   the same mark repeated hundreds of times, which is what a machine tell looks
   like. Same fix as the 8/25 strand barcode: drift it a pixel in short segments,
   deterministic off the head it is drawn on. **Cost to the approved player face: 8
   pixels of 4096 (0.20%), all of them the part line.**

## AND ONE THE GATE CAUGHT, WHICH IS THE WORST ONE

`faceHash` **already existed**, taking one argument, and it is what the 8/26 blink
scheduler calls. This turn declared a second `function faceHash(id, salt)` eighty
lines below it. Two function declarations with the same name in one scope is not an
error and not a warning: **the last one silently wins for the whole file.** So my
hash quietly became the one `facePerform` was calling, with `salt` undefined —
still deterministic, still no crash, **every check still green**, and every person
in the game blinking to a clock nobody measured.

Nothing reads as a bug when it is spelled correctly and sits in the wrong place.
That is the 8/16 border lesson (*a pass can be individually right and still be wrong
because of where it is in the pipeline*) wearing a different hat. It is now a gate:
**no two top-level functions share a name.** On its first run it also found two
pre-existing collisions — `CombatBridge` and `clampPkg`, each inlined twice,
byte-identical, from another lane. Identical copies make last-wins a no-op so
nothing is broken today, but the day somebody fixes one copy and not the other the
fix silently loses. Pinned at 2 and handed over as a row.

## THE GATE

`gates/talking_portrait_gate.js` — 23 checks, registered as TALKING PORTRAIT.
Mutation-proved three ways: flatten the roll and *everybody is the same person*
fires; stop showing the canvas and *the portrait pops up* fires; restore the ruled
part and *no straight line down the crown* fires (60 of 60).

Measured: closest of 60 faces **0.0135**, mean **0.091**, dyed hair **6.0% of 600**,
ruled parts **4 of 60**, mouth shapes **closed/mid/open/wide**, pixels moved
mouth **16/21/22**, blink **56**, brow **34**.

## WHAT IS STILL MISSING, SAID OUT LOUD

The face has **three hair lengths and two textures** and that is the entire
wardrobe on a head. Real cuts — a fade, a ponytail, a shaved side — are a cook of
their own. The portrait is wired into the **cold open** only; the RUN's person-card
and the action-button idea he floated in the same message are the next two.

---
Tab: **RUN** (the opening scene), **LOOK** (the picture).
Record: `records/BOHEMIA_EVERYBODY_HAS_A_FACE_8_27_26.txt`.
