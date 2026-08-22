# THE BREACHER (v177, RF4-28) — and a shipped mechanic that could never fire

COMBAT lane, 8/21/26. **TAB: COMBAT.**

> *"**Enemies are designed as counters to effective player actions**, deliberately,
> to force tactical adaptation and increase the overall tactical scope of
> gameplay."*

Our diff: *"ABSENT as a design rule. Nothing in the roster is built to punish a
specific player habit. **Our cover system is strong enough that a cover-destroying
body would be a real counter.**"*

## THE EFFECTIVE PLAYER ACTION WAS ALREADY MEASURED

Yesterday, causally, over 280 frozen fight states: **the stone takes 73% of the
guns off you.** Cover is the largest system in the fight, so it is the thing
RF4-28 says to counter.

## AND WHILE CHECKING WHETHER IT NEEDED ONE, A SHIPPED MECHANIC TURNED OUT TO BE IMPOSSIBLE

V152 added `if(covP)chewCover(covP)` — *"and the stone takes it too"* — so cover
carries HP and is eaten by the rounds it stops. It has never once run.

| measured | |
|---|---|
| `chewCover` calls across 309 turns of real play | **0** |
| pillars destroyed or even knocked down, 24 fights | **0** |
| guns in the volley across 264 states | 85 |
| **of those, with a pillar covering you from them** | **0** |

**Not rare — impossible.** A pillar that covers you is precisely what removes a
man from the volley, so the chew waits on a condition its own geometry forbids.
**Cover in this game had never degraded once**, and that 73% held for the entire
fight, forever.

*(The first cut of this measurement wrapped `chewCover` and read 0 — which proves
nothing until you check the wrapper. Calling it directly showed 1 call seen, so
the zero was the game's, not the hook's.)*

## WHAT SHIPS

**A body whose turn goes into the stone you are behind, not into you.** He is the
counter RF4-28 asks for, and he is also **the only caller `chewCover` can ever
have** — putting rounds into a position you cannot see into is what suppressing
*is*, and it is the one case the volley's line-of-sight test was never going to
reach.

Against a player who finds cover and holds it — his own 8/15 complaint verbatim,
*"I just found some cover and I stayed in the same place just shooting people"*:

| 10 fights | breacher working | breacher pinned every turn |
|---|---|---|
| bites taken out of stone | **68** | 0 |
| pillars destroyed | **5** | 0 |
| turns the player held cover | 74-81 | 58-75 |

## AND A NEGATIVE RESULT, RECORDED RATHER THAN QUIETLY DROPPED

**He does not measurably push a camper off the lot.** The gate carried a claim
that he did — turns-held-in-cover 68 against 75 — and on the merged tree it
flipped and stayed flipped: **81 against 71, then 74 against 58**, the player
holding cover *more* with the breacher working.

The first two readings were noise pointing the way I wanted, which is exactly how
a wanted conclusion gets shipped. **The reason is 65 rocks an arena:** destroying
one moves the man to the next one. That is a step, not an eviction.

The mechanism is real and gated. The *consequence* the counter was reached for is
not there yet, and the gate now says so in those words rather than carrying a
claim that flips run to run.

**He costs no damage while he works** — his turn goes into the rock instead of
into you, so incoming fire *drops* while he is busy. The bill arrives as geometry
when the cover goes. **He is a goon with a job**, the V173 pattern: hp, accuracy
and damage copied from `ARCH.human`, so a whole new archetype sets no damage
number and the measurement has nothing to point at but behaviour.

**And pinning him is the answer to him** — the same answer the medic has — so the
counter has a counter rather than being a wall. There are also about 65 other
rocks on the lot.

## THREE HARNESS CUTS BEFORE THE NUMBER WAS TRUE

Each measured a different player and reported a different lie:

1. **A walker.** His cover changes every turn, so no single rock ever takes the
   ten bites it needs: 74 chews, 1 knockdown.
2. **A camper at spawn.** He is not behind anything at all — `inRealCover()` is
   false for him — so the breacher had no rock to work on: 2 chews.
3. **Find cover, then hold.** The actual habit, and the only one the counter is
   about.

## GATES

`fight_moves_you` **79 pass / 0 fail** (5 new) · `combat_lab` **913 pass / 0
fail** (6 new).

**Seven mutations, all caught** — but only after one of them exposed a
mis-specified test of my own: "put him ahead of the blades" actually moved him
ahead of the *medic*, and both already fill after the blades, so it tested
nothing. The corrected mutation also revealed the ordering claim could be
defeated by a duplicate push sitting in front of the one `indexOf` finds —
**exactly the hole V174's car-tap claim had, found the same way** — so it now
also asserts there is exactly one.

**RF4-28 moves SPECED → BUILT.** One star, 5 of 8.
