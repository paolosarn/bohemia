# THE PEOPLE ARE NOT COPIES OF HIM — 8/3/26, PEOPLE lane

Paolo, after seeing the first neighbour he could actually talk to:

> "I saw it very good. Maybe we can do more with that but we have so much work.
> We need to do thanks for having one person that I can see. **Now we have
> character models just shuffle that character model every time the game looks
> and have it not be a copy of me**"

He was describing the code exactly.

---

## WHAT IT WAS DOING

The city frame drew every resident as `PLAYER_CV` — **his own baked body** — run
through `pplTinted()`, which is a colour shift over his finished sprite. Same
rig, same clothes, same silhouette, different hue.

Six weeks of wardrobe work, and every person in the valley was him with the
saturation turned.

## AND THE ANSWER WAS ALREADY IN THE GAME, ONE IFRAME AWAY

`runSendCast()` in the alpha has been baking **six real townsfolk** for the run
since 7/26. It swaps `G.tints` (jacket / shirt / pants / shoes) and
`G.equipped.hat`, re-bakes the actual rig through `bake56`, and ships them. Those
are genuinely different people: their own clothes, their own colourways, a durag
on every third one — all from his own approved rig and his own approved wardrobe.

**The city frame simply never received them.**

| | |
|---|---|
| alpha side | `citySendCast()` bakes the same six looks and posts `BOHEMIA_CITY_CAST`. Same `withLook` + `bake56` mechanism, not a second one. **Idle only** — that is all the city's people pass draws, so 48 frames instead of 288 |
| city side | the people pass draws `cast[person.look % N]` instead of tinting the player, and falls back to the old tinted body if the bake has not landed, so nobody vanishes waiting |

Which body a person wears was **already decided and already stable**:
`personFields` gives every person a `look` from their own hash. So the shuffle is
deterministic per person — a body keeps its clothes instead of flickering as you
watch, which would be a glitch and not a citizen. The six colourways themselves
re-roll each load, which is the "shuffle every time" half.

**REUSE CHECK: zero pixels cooked, no bank opened.** Every frame is baked by the
alpha's own `bake56` from art he already approved. The only thing that changed is
*which* already-approved body each already-existing person wears.

---

## THE GATE, AND THE CLAIM THAT ACTUALLY MATTERS

`gates/city_cast_gate.js`, 8 claims, driving the alpha and tapping the tab.

"There is a cast" would pass on six copies of him. "A message was sent" would
pass on a message that arrived empty. So it **hashes the real pixels** of every
baked body and of the player's, and requires that all of them are distinct **and
that not one of them is his**.

Measured: **6 bodies, 6 distinct, 0 matching his.**

### A vacuous check I caught in my own gate

`PLAYER_CV` and `CAST_CV` are `let` at the top of the frame's script — global
**lexical** bindings, *not* properties of `window`. My first measurement read
`window.PLAYER_CV`, got `undefined`, and "none of them is the player" passed by
comparing every body against `null`. **A check that could not fail.** B3 now
asserts the player's body was measurable at all, precisely so that the important
claim can never go vacuous the same way again.

### Mutations

| mutation | result |
|---|---|
| the cast never reaches the draw (back to tinted copies) | B6 red |
| the six bodies baked without swapping clothes, so they *are* him | B4 red (1 of 6 distinct), **B5 red (6 matches his pixels)**, B6 red |

Neighbours held: CITY TALK 18, CITY PEOPLE 18, HUMAN START 9.

## WHERE PAOLO CAN SEE IT

**RUN tab.** The person standing outside is wearing their own clothes now. Walk
around and the others are not him either.

## WHAT HE PARKED

*"Maybe we can do more with that but we have so much work."* Deeper conversation
is **parked by him** — not blocked, not forgotten, not to be built unasked.
