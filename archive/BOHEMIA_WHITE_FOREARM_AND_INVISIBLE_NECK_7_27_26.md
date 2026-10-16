# THE WHITE BLOCK ON THE ARM, AND WHY THE NECK LOOKS UNCHANGED
**7/27/26. Two screenshots from Paolo, one circled in yellow.**

> *"Whats up with this shit? The neck is still not a different color???"*

Both answered by measurement on the shipped build. **Neither one is fixed** — see
§3 for why I stopped instead of shipping a third guess at his character.

---

## 1. THE YELLOW CIRCLE IS NOT A HAND. IT IS THE FOREARM, AND IT IS TOO BRIGHT.

Dumping the actual pixels on E/idle around the circled area:

```
y32 |  armR:46,46,52   armR:224,211,203  armR:224,211,203  armR:224,211,203  armR:28,22,24
y33 |  armR:28,22,24   armR:224,211,203  armR:224,211,203  armR:224,211,203  armR:28,22,24
y34 |  armR:28,22,24   armR:191,175,166  armR:191,175,166  armR:191,175,166  armR:28,22,24
y35 |  handR:153,137,129  handR:191,175,166  handR:191,175,166  handR:191,175,166
y37 |  handR:153,137,129  handR:153,137,129  handR:153,137,129
```

The live skin ramp is `[28,22,24] · [153,137,129] · [191,175,166] · [224,211,203]`.

**The forearm is rendering at 224,211,203 — the LIGHTEST tone on the ramp — while
the hand it connects to renders at 191 and 153.** The limb gets brighter as it goes
*away* from the light, and it sits directly against a coat at luminance ~42.

That is the white block. It is not two hands, it is not clothing, it is not the
outline: it is one limb whose forearm is a full shade lighter than its own hand,
maximum contrast against black, in a 3px-wide patch. At 56x56 that reads as a
separate bright object stuck on the sleeve — exactly what he circled, twice.

**A correction to my own earlier record:** I previously reported "far arm 66.4% bare
skin on E". That number is unsafe and should not be cited. The jacket's own ramp
contains `194,164,142` and `233,210,192` — the `SK_DEF` skin tones — which are
remapped to the live skin tone at composite. So a "skin-coloured" pixel can be a
garment pixel, and a membership test cannot tell them apart. The pixel dump above
does not depend on that test and is the one to trust.

## 2. THE NECK: HE IS RIGHT, AND IT IS NOT THE TONE'S FAULT

Neck cells showing **skin**, with his actual outfit (`shirt/cowl-hoodie` +
`jacket/japanese-fuzz_hoodDown`):

| facing | neck cells | showing SKIN |
|---|---|---|
| S | 8 | **0** |
| SE | 10 | **0** |
| E | 9 | **0** |
| W | 9 | **0** |
| N | 12 | 6 |

**The cowl hoodie covers 100% of the neck on every facing he looks at.** A tone
applied to the neck cannot appear, because no neck pixel is skin. The change is
real and correct and completely invisible. He is not wrong; he is looking at a
part that is not there.

**What he is actually pointing at is the FACE.** Mapping skin vs cloth by part on E,
rows 8-15 are all part **2** (face); part **3** (neck) never appears as skin at all:

```
y13  ##1222##      <- part 2, face
y14  #11222        <- part 2, face
y15  ####2         <- last skin row, still part 2
y16  4#####        <- part 4, torso, cloth
```

The skin he reads as "the neck" — jaw down to the collar — is the bottom rows of
the face part. To give him what he asked for, the tone has to go there, not on
part 3. That is a redefinition of which pixels are "the neck" on his character,
which is his call, not mine to make quietly.

## 3. WHY I STOPPED

This is the **third** round on this area of his character and my last two attempts
both made it worse:

1. I pulled clothing off the far hand → turned a hidden dark hand into a bright blob.
2. I toned part 3 as "the neck" → invisible, because his hoodie covers all of it.

**STOP PRODUCING (7/26)** says a second rejection ends the feature for the session,
that writing a further version means the failure already happened, and that a turn
which stops and names the blocker is a good turn. Both remaining fixes are
one-line changes I can make the moment he says which way:

- **The forearm:** should it render the same tone as its own hand instead of the
  lightest ramp stop? That is a change to how his painted body is shaded, which is
  his art, not a render bug I get to decide.
- **The neck:** should the tone move onto the bottom rows of the FACE (the visible
  throat), given part 3 is 100% covered by the cowl?

**[PENDING, Paolo's call] — both.**
