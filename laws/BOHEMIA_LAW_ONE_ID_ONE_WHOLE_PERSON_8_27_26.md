# BOHEMIA LAW — ONE ID, ONE WHOLE PERSON (Paolo, 8/26/26, built 8/27, LOCKED)

## HIS WORDS

> "Eye colors matching the portrait again."

Five words. He was right, and the honest answer was much worse than eyes.

## MEASURED BEFORE TOUCHING ANYTHING, OVER 200 CITIZENS

Comparing the portrait that pops up when somebody talks against the body standing in front
of you:

| | agreed |
|---|---|
| SKIN | **8.0%** |
| HAIR | **0.0%** — not one person in two hundred |
| EYES | the portrait had 6 colours. The body had **ONE, THE PLAYER'S, for everybody.** |

**The portrait was a different human being from the body.** He noticed the eyes because
eyes are what you look at. The eyes were the smallest of the three.

## TWO DIFFERENT CAUSES, AND ONLY ONE WAS A MISSING FEATURE

**SKIN AND HAIR: TWO MECHANISMS EXISTED.** `NPCFactory` has owned both since 7/2 and is
what the RUN dresses the crowd from. `faceFor` rolled its own on 8/27 because I wrote it
without looking for one. That is an ENGINE SYNC LAW violation with a face on it, and the
law is not "reconcile them", it is **the younger one is deleted**. `faceFor` reads the
body now.

**EYES: NO MECHANISM EXISTED.** The body's facial ramp remap read `pface` — the player's
own face — directly, by name, for every body in the game. So this is not a second bug of
the same kind; it is the **first** one of its kind, and the fix is a new thing rather than
a deletion: `G.faceAs` is *the face a body wears*, null means the player, and the ramp
reads it.

> **THE TEST, before adding any per-person trait: DOES SOMETHING ALREADY PICK THIS?**
> If yes, read it. If no, build it once and let everything read that. A second picker for
> a thing that is already picked does not produce variety, it produces two people.

## AND THE CITY'S OWN HAIR WAS A CLOWN PARADE

Only visible once the portrait started reading from it. `NPCFactory` picked **uniformly**
over seven colours:

| | before | after |
|---|---|---|
| bright red | **16.2%** | 2.0% |
| pink | **12.8%** | 3.0% |
| black | **12.7%** — the rarest | **34.2%** |

That is the trenchcoat bug for a third time, in the oldest of the three places, and it
governed **every body in the RUN**, not just the portraits: *uniform over a list whose
contents are not uniform in life.* A list is not a distribution.

Skin was proved **byte-identical** across the change — one `rng.next()`, same order — so
the valley's complexions did not move while its hair did. **Who lives in the valley is a
demographic question and therefore HIS** (MECHANISM-MINE / CONTENTS-PAOLO'S); the skin
tones stay uniform across nine until he rules.

## WHAT STAYS HIS

An explicit spec beats the roll outright. `faceFor(id, over)` takes an override, and a
named character's face is whatever his ruling says. The roll is for strangers.

## THE GATE

`gates/talking_portrait_gate.js` — 27 checks, measured on rendered pixels.

The one worth naming: **`bodyTakesAFace` was vacuous when I first wrote it.** It tested the
*input* — that `G.faceAs` had been set — instead of the *output*. A mutation that deleted
the entire feature passed 27 of 27. It counts rendered iris pixels now, and fires at 0
against 8. **That was the second vacuous check I wrote that day**, which is why the rule
is written here and not just fixed: a check that reads what you handed it is not a check.

---
Tab: **RUN** (talk to anybody) / **LOOK** ("THE FACE AND THE BODY ARE THE SAME PERSON").
Picture: `slices/look/one-id-one-person.png`.
Record: `records/BOHEMIA_EVERYBODY_HAS_A_FACE_8_27_26.txt`.
