# THEY SAY IT OUT LOUD (8/21/26, PEOPLE lane)

## WHERE TO SEE IT: the **RUN** tab. Do something in front of somebody and walk
## on. They say what they saw, out loud, over their head. You do not open anything.

---

## A DEED THAT ONLY EXISTS ON A CARD IS A DEED MOST PLAYERS NEVER SEE

Four turns of this lane built witnessing, gossip, hearsay decay and loudness. All
of it was reachable **only by walking up to somebody and opening their card.** My
own note on turn one said why that is fatal, quoting the reputation literature: a
system the player cannot SEE working is indistinguishable from no system at all.
I wrote that down and then built four turns of exactly that.

## BACKLOG 0r, AND IT NAMES THIS LANE'S ORGANS AS THE CHANNEL

> "Hades ships ~4 boss fights but **21,020 voice lines** across 30 characters
> (305k words, more than the Iliad + Odyssey), roguelite replayability is bought
> with **REACTIVITY per encounter**, not roster size... EVERY boss ships with an
> AFTERMATH REACTION SET... **flowing through the witness organ + introductions +
> memory systems already live.**"

And their trick, copied literally: *"their system never repeats a line until every
unused option is spent."*

## WHAT IT DOES

A witness standing near you says what they saw, in the bubble the street already
uses. It **preempts** the ordinary bark exactly the way the two-person
conversation above it does, so with nobody having seen anything the street sounds
precisely as it did before.

**SAW and HEARD say different things**, which is the whole payoff of modelling a
route the news could take and has been invisible outside the card until now:

| | line |
|---|---|
| watched it | *Told them no. Right to their face.* |
| only heard | *Heard somebody turned them down.* |

An eyewitness is specific. A retelling is vague and hedged. Sixteen drafted lines,
four acts by two modes by two variants, cycling Hades-style so no line repeats
until its pool is spent. A witness never repeats the same sighting at you, because
that is a broken record, not reactivity.

**The lines are deliberately pronoun-free.** Who the player is is his, and a bark
that guesses is a bark that is wrong half the time. The gate asserts it: zero
gendered pronouns across all sixteen.

## I FILED A BUG THAT DID NOT EXIST, AND THE WAY I GOT THERE IS THE LESSON

Mid-turn I measured that `ctDeed` recorded **zero witnesses** after a render, and
concluded that the claim, favour and commit deeds had never recorded anybody in
real play. I wrote the fix, wrote the comment, and was about to write the record.

**It was wrong twice over.**

**First: I measured the wrong surface.** The probe loaded
`BOHEMIA_CITY_WORLD.html` directly. Standalone, the city never receives
`PLAYER_CV` from the alpha, so `peoplePass` returns early and draws **nobody** --
`playerCV: false`, zero bodies, forever. Every number I read was the number you
get from a frame with no people in it. VERIFY ON THE REAL SURFACE is not a slogan
about screenshots; the city frame *is* a different surface when it is not inside
the alpha.

**Second: I misread which function owns the reset.** A comment inside `barkPass`
says "consume it, then clear for the next", which I read as barkPass clearing
`BARK_DREW`. It does not. `BARK_DREW = []` is the **first line of `peoplePass`**,
confirmed by walking the file rather than the comment. The list persists between
renders, and a click sees the street the player was just looking at, exactly as it
always did.

Re-measured through the alpha: `drewAfterRender: 1`, `witnessesRecorded: 1`. **No
bug.** So the machinery I had added is reverted, including a comment that would
have sat in the codebase asserting a falsehood about a bug that never happened.
A layer added "just in case" is speculative complexity; a loud comment describing
an imaginary bug is worse, because the next person believes it.

## ONE REAL THING CAME OUT OF THAT DETOUR

**The net-deletion guard could not tell my lines from anybody else's.** Written as
`if (grew < 0) refuse`, it also forbade the tool from ever SHRINKING its own
block, so the moment a block genuinely needed removing, the tool refused, and the
only way back was by hand. It now measures the file **outside** the region it
owns, which is the thing 8/17's 2,607-line accident actually destroyed. A guard
that blocks the correct move as readily as the dangerous one gets routed around,
and a guard that gets routed around is not a guard.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_city_deeds_patch.py` | the reaction table, Hades cycling, the bark preempt |
| `tools/bohemia_city_memory_patch.py` | the deletion guard, fixed |
| `gates/city_deeds_gate.js` | 30 -> 36 claims |

Both tools idempotent together, md5-identical over repeated runs.

| mutation | result |
|---|---|
| let a witness repeat the same sighting forever | **1 red** |
| make SAW and HEARD say the same thing | **1 red** |

## WHAT COMES AFTER

1. **THE AFTERMATH SET PROPER.** 0r asks for reactions *different for killed vs
   spared*. That needs a boss, which is COMBAT's; the channel is now built and
   waiting for one. **Theirs to trigger, this lane's to word.**
2. **THE OTHER DIALS.** `SEE_RANGE`, the gossip window, the halflives, all with
   the same wrong answer to "where does he change this himself". **This lane's.**
3. **HE TURNS THE STANDING DIAL.** One row makes all of this judge him. **His.**
4. **Walking is silent**, 97 approved sounds unplayed. SOUNDS.
