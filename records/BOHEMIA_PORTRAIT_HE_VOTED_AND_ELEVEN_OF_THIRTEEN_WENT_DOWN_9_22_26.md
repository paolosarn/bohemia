# HE VOTED. ELEVEN OF THIRTEEN WENT DOWN.
## PORTRAIT lane, round 4 (9/22/26)

Verdicts verbatim: `records/BOHEMIA_PAOLO_VERDICTS_ON_THE_PORTRAIT_9_22_26.txt`

---

## WHAT HE APPROVED, AND IT IS IN THE GAME THIS TURN

NOTES ARE RULINGS. Both went into the shipped renderer the same turn, not into another
candidate card. Build **9/22a**. Tab: **CHARACTER**, and every person in the RUN and CITY.

**THE SHADES** — voted UP, no complaint. Measured after folding in: **74 of 74**
glasses-wearers now wear them in the portrait. Was 0 of 70.

**THE EYES** — approved by name: *"I kinda like the direction of the eyes not being all
white around it. You know everyone's looking less of a frog like that and I guess the eyes
are going pretty good."* The sclera was `[230,231,228]`, **brighter than every skin tone in
the game**. It is tied to each face's own lightest skin step now and the lid casts on the
top row. Measured: the old value is gone from **all 200** faces.

---

## WHAT HE KILLED, AND IT STAYS KILLED

All eight lighting cards. Post-mortem:
`graveyard/POSTMORTEM_THE_PORTRAIT_LIGHTING_9_22_26.txt`. STOP PRODUCING: a second
rejection ends the feature for the session. **There is no third lighting version.**

The measurements behind it were all true and are still on file. **It died because it was
the wrong shape of work**, which is a running-order mistake and mine: he asked for the
SYSTEM to have range before anybody hands him a finished face, and I handed him eight
finished faces across two rounds.

---

## THE CENSUS THAT SHOULD HAVE BEEN THIS LANE'S FIRST ROUND

*"we need like way more face and portrait customizations bro like before we start trying to
hand me shit"*

So I counted every dial the face carries, across 400 people, by how many **distinct values**
each one ever takes:

| dial | distinct values |
|---|---|
| **eyes.w** | **1** |
| eyes.h, eyes.hood, brows.arch, details.stubble | 2 |
| face.top, brows.thick, nose.w, mouth.fullLower, hair.part, hair.len, age | 3 |
| ... | ... |
| face.len, face.jawW, face.jawCornerY, face.mouthY | 13 |

**Eye width had ONE value. Six. For everybody who has ever existed in this game.** The old
comment said "six is the whole budget", which was a drawing decision that quietly became a
population decision. Width, height and hood between them gave the entire valley **four
combinations** on the feature that carries identity.

**Widened:** `eyes.w` 1 → 3 (five, six or seven), `eyes.h` 2 → 3. Two clamps, both on the
face's own bones: the pair plus the gap must fit inside the cheekbones, and a five-tall eye
is only kept when the nose leaves room. THE RANGE MAKES PEOPLE DIFFERENT, THE CLAMPS KEEP
THEM PEOPLE — 8/27's words.

**Three rounds of this lane went into making four faces better while the generator that
makes faces had one eye width for the whole population.** The census took ten minutes.

---

## AND THE GATE THAT SAYS "NO TWO ARE THE SAME PERSON" CANNOT SEE A DARK FACE

`talking_portrait_gate`'s face-distance floor went red. I guessed at the cause twice and was
wrong twice, so I rendered the pair it names and looked.

`gate:crowd:0` and `gate:crowd:35` **differ on 21 of 44 fields** — different skull, hair,
eyes, nose, mouth, brows. They are the closest pair in the crowd. **Both are ebony.**

The metric is mean absolute *luminance* difference per pixel. On a near-black face every
feature lives inside a narrow band, so a completely different person scores as a twin. It is
a measurement bias against dark skin, inside a gate whose title is EVERYBODY IN BOHEMIA HAS
A FACE, AND NO TWO ARE THE SAME PERSON.

**Measured:**

| | |
|---|---|
| correlation, pair brightness vs measured difference | **0.473** |
| mean brightness of the 20 "most identical" pairs | **46.5** |
| mean brightness of the whole crowd | 57.9 |

It also explains the red: taking the bright white out of the eye removed one of the few
high-luminance features a dark face had.

**I did not ship a fix and I did not lower the floor.** I tried mean-removal (0.473 → 0.42,
same pair still closest: not enough) and then contrast normalisation, whose test harness had
a bug of mine. Three iterations into re-rulering a gate is where this lane stops and writes
it down. **The floor stays where it is and the gate stays red, named as mine**, because
lowering it would hide a real bias behind a smaller number, and because the gate is now
saying the same thing the client said: the faces need more range.

---

## GATES

```
talking_portrait   28/1   <- MINE, named above, deliberately left red
portrait_haircut   12/0   portrait_matches_body 11/0   face_maker 13/0
family             15/0   hairline 12/0   clothes_4x 13/0 (1,744 pinned hashes unmoved)
vote_tab           27/1   <- IDENTICAL 27/1 on a clean origin/main worktree. Not mine.
become             15/13  <- IDENTICAL 15/13 on a clean origin/main worktree. Not mine.
```

Full suite: 107 red at ad23d875; of those, none are named as this lane's.

---

## IN THE VOTE TAB

`portrait-eye-range-9-22`, and its card says on its face **THIS IS NOT A FACE TO APPROVE**.
It is the system getting wider, which is what he asked for. Sheet:
`records/target/BOHEMIA_THE_EYES_HAVE_RANGE_9_22_26.png`.

**The standing note for next round:** he said "more analog horror" five separate times in
one sitting. That is the loudest thing anybody has said to this lane and it is still not
answered. It is `[horror face]`, and it is not another lighting pass.
