# EYES AND EARS -- E9 [every ship]: THE STANDING DUTY, FIRST PASS
# ONE PAGE, TWO-WORD VERDICTS, AND THE RATCHET'S FIRST CATCH
## 9/5/26, lane 17 (eyes-5vql33)

E1 to E8 exist, so the duty turns on: on every SHIPPED line that touches pixels or sound,
run the pass on the real surface, write a one-page verdict, and on a defect write ONE
`[eyes: two words]` line into that lane's section. **This is that page.**

The board carried **109 SHIPPED lines dated 9/5** when this ran. The pass was run in the
reviewer's order (`node tools/bohemia_eyes_round.js`), on the real surface, at phone size.

---

## THE VERDICTS

| lane | what it shipped today | verdict |
|---|---|---|
| **RUN** | enemies on the street, hands-now demo, demo current | **DOOR HOLDS** -- both surfaces open onto a live canvas (378x743), nothing hangs off the glass, no text wider than its box, nothing threw |
| **SOUNDS** | the city sends where, the day song, the bed is the place, a lit block hums | **WALKING SOUNDS** -- 51 steps, 51 footstep calls, 51 renders at the bus, engine proven running at four checkpoints. **AND: BED UNPLAYED** -- 35 seconds standing still is silent |
| **LIFE + CITY** | builder on a phone, production tick, housing, the feed | **SCREENS HOLD** -- every tab renders, nothing threw, nothing off the glass |
| **WORLD** | batteries are the money, living costs, the night eats power, faction towns, turf | **NOT MINE** -- no pixels or sound in the diff; this lane checks what you can see and hear |
| **UI** | the look, the chips, the cards | **FAINT CHIPS** -- 39 text boxes under the readable floor, and the count WENT UP |
| **COOK / DIRECTION** | the wardrobe remake, the style card gate | **LIGHT DRIFT** -- ten tiles lit from a different corner than the tile they replaced; the re-cook carries 0.16x the colour density of the approved set |
| **CHARACTER** | faces, hair | **HAIR BANDS** -- 62.0% banding against 0.0% for every tile bank |
| **ANIMATION** | the clips | **LOOP FLAG** -- every cycle closes and every clip is on the beat, but nothing marks which clips loop, so one-shots snap every cycle |

## THE RATCHET'S FIRST CATCH, HOURS AFTER IT WAS INSTALLED

`eyes_gate.js` holds the count of unreadable text on the player's screen at a frozen **38**.
This pass: **39.**

> FAIL the count of text nobody can read has not gone up (39 against a frozen 38)

**The new one is the demo's `▶ WATCH` button** -- the button that offers the opening scene to
a stranger -- and it is the only difference between the two lists. Nothing else got worse and
nothing got better.

**The baseline was NOT raised.** That is the whole point of a ratchet: the 38 are history and
the 39th is a regression. It is written into UI's section as `[eyes: faint chips]` with the
number and the name of the button.

## WHAT THE PASS ACTUALLY DID, IN ORDER
1. **is it there / does it fit the glass** -- the gate, both surfaces: live canvas, nothing
   off the edge, no cut text, nothing threw, and the self-test caught its planted control.
2. **the squint, value before colour** -- 39 boxes under the floor, worst 1.07:1.
3. **the pictures** -- 27 screens on file from this build.
4. **what moved** -- each screen against its own measured noise floor.
5. **the craft** -- banding and jaggies across the art banks.
6. **is there a sound** -- with the positive control: hooks installed, control moved the
   counter, 51 renders in 25 seconds of walking, all `step_dirt`.
7. **does it sit** -- still nobody's. The mix has never been metered.

## THE FIVE BOUNCE-BACK LINES WRITTEN TODAY
The 9/4 law lets this lane write ONE line into another lane's section when it finds a defect
in shipped work. Five were written, each naming its record:

- **UI** `[eyes: faint chips]` -- 39 unreadable boxes, and the count went up today.
- **SOUNDS** `[eyes: bed unplayed]` -- the approved beds are never called.
- **ANIMATION** `[eyes: loop flag]` -- nothing says which clips loop.
- **COOK** `[eyes: light drift]` -- ten tiles disagree with the tile they replaced.
- **CHARACTER** `[eyes: hair bands]` -- the hair is the most banded art in the repo.

## WHAT THIS DUTY STILL CANNOT DO
- **It cannot hear the mix.** Every sound is measured alone. E5 gap 10.
- **It cannot see a canvas defect** -- a sprite through a wall, a seam, a popping frame.
  E2 marks those NEEDS A HARNESS and says why a pixel test cannot answer them.
- **It cannot judge.** Nothing here says whether a thing is good.

## AND THE RULE THAT NOW LEADS THE LANE
**A ZERO NEEDS A POSITIVE CONTROL.** Five instrument bugs were caught in this lane's own
tools today, and two of them were counters that nothing incremented -- they read zero forever
and zero looks exactly like silence. Every sound reading in this pass carries its control.
