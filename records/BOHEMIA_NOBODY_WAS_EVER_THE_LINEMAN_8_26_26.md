# NOBODY IN THIS VALLEY WAS EVER THE LINEMAN
# (8/26/26, PEOPLE lane. His playtest dispatch, item 2, the PERSON half.)

## HIS COMPLAINT
> "THE QUESTS ARE SO BAD AND NOT WIRED TO ANY LOCATIONS OR PEOPLE IN THE CITY.
> AND THE ART FOR THE QUEST LOGS IS SO FUCKING BAD WHEN ITS ON MY FEED"

The dispatch made it demand-side, not [PENDING]: **"A QUEST THAT IS NOT ATTACHED
TO A PLACE AND A PERSON IS NOT A QUEST."**

## WHAT WAS TRUE, AND THE CITY SAID SO ITSELF

The walked city carries this comment, written by whoever built the demo day loop:

> "**SCAFFOLD** -- the casting. The real system casts @ROLE against people who
> actually exist in the world and places the quest where they are. This binds
> stages to **WORLD EVENTS** instead."

So `@ROLE lineman REQ faction=TRADES` resolved to the string `"lineman"`. Nobody
in the valley had ever been the lineman. The honest note was right there in the
file the whole time, which is its own lesson: **a comment that admits a gap is
not the same as a gate that fails on it.**

## THE DESIGN CAME OUT OF COUNTING, NOT GUESSING

Every `@ROLE` condition across the nine canon quests:

| condition | uses | can the world answer it? |
|---|---|---|
| `faction=X` | **53** | **YES** |
| `keeps_the_tunnel`, `reads_the_sky`, `found_the_stairwell`, `speaks_for_the_crew`, ~56 more | **1 each** | no, and never will |

That split is the whole design. The faction is a **REAL DEMAND** and is matched
against people who really run with that outfit. The sixty one-off predicates are
the quest **describing the person it needs**, and nothing in the sim computes
them or ever will, because each is bespoke to one quest.

So they are **CONFERRED, NOT MATCHED**. The quest does not hunt for somebody who
already keeps the tunnel; it makes the person it cast **into** the one who keeps
it. That is how casting works everywhere, and it is the only reading that does
not require inventing sixty new simulation facts.

## MEASURED BEFORE ANYTHING WAS WRITTEN

```
people walked in the city        2,661
people who run with an outfit      204   (7.7%)
outfits with real people            11 of 13
quest factions with nobody           2   (REDS, BLUES)
```

Nine of the eleven outfits the quests demand have real people standing on real
ground. **NULL is the honest answer for the other two** -- faking one would put a
stranger in a part the story says belongs to an insider.

The first sweep read **zero of 1,282**, and that was my wrong field, not the
world: the city derives affiliation through its own bridge, not off the record.
Checked before filing rather than after.

## ON THE CARD HE OPENS

```
SCAVENGER
NAME       Clemencia Munoz
SPEAKS     ENGLISH AND SPANISH
THE JOB    The Meter Reader wants the fixer. On this block, that is them.
LIVES      Right about here
...
RUNS WITH  NETWORK
```

Clemencia Munoz runs with NETWORK. The `fixer` role demands `faction=NETWORK`.
**The two rows agree, and the gate's strongest claim is exactly that** -- the
card printing "wants the fixer" over somebody whose own card says CARTEL would be
worse than no row at all.

The row is English on purpose: it tells him which door to knock on, which is
required information, which under the hard rule is always English.

## WHAT THIS DOES NOT CLAIM, SAID PLAINLY

**THE PLACE HALF.** `bohemia_loop.js castTarget()` has picked a real district
cell out of each quest's own faction demand **since 7/26**, and the demo day loop
binds to world events instead. That wiring belongs to the day loop, not here.

The row says "on this block" because that is exactly what it is: casting runs
against the people standing here. Pretending this closes item 2 would be worse
than the row not existing.

## MUTATIONS

| break | result |
|---|---|
| **M15** the faction demand ignored (anybody plays any part) | **5 red**, including `NOBODY OF THAT OUTFIT HERE MEANS NULL, NOT A FAKE` and `576 / 576` blocks casting, which is the tell |
| **M16** the dedupe deleted (one person, two parts) | **2 red**: `part_a, part_b from a block of one person` |
| **M17** the card row deleted (the state that shipped) | **2 red**, printing the card that is missing it |

## AND A DEFECT IN MY OWN WORK, FOUND BY M15

The cast was cached on `hx,hy` and the roster **length**. Taking one step
re-cast the quest. Harmless while the pool is two or three affiliated people --
the caster is deterministic, so it came out the same -- and **not harmless the
moment the roster shifts under you**: the person whose card you opened stops
being the person the quest wants, mid-conversation. **A CAST THAT MOVES WHILE YOU
WALK TOWARD IT IS NOT A CAST.** Keyed on the block now, which is what the roster
actually belongs to.

## AND TWO VACUOUS ATTEMPTS AT ONE CLAIM

`ONE PERSON NEVER HOLDS TWO PARTS` was written twice before it worked:

1. **lineman vs fixer.** Different factions cannot land on one person, so it
   passed with the dedupe deleted.
2. **two roles wanting the SAME outfit.** On nine eligible people they land apart
   **by luck**, so it passed too.
3. **a block of ONE person.** Now the dedupe is the only thing that can make it
   pass, and M16 turns it red.

The lesson is the one this lane keeps paying for: **a claim has to be built so
that the rule it names is the only thing that can make it pass.**

## THE MACHINE

| file | what |
|---|---|
| `engine/bohemia_people.js` | `castRole`, `castQuest`, `roleFaction`, `roleTraits` |
| `tools/bohemia_city_casting_patch.py` | `ctCast` and the THE JOB row |
| `gates/casting_gate.js` | 27 claims, registered as CASTING |
