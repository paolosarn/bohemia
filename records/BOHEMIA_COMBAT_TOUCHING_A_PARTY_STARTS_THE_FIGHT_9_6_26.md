# V203 — TOUCHING A PARTY STARTS THE GROUP FIGHT (COMBAT lane)

VAMILY job: **TOUCHING-A-PARTY-STARTS-THE-GROUP-FIGHT** `[contact fight]`.

> "contact on the travel map opens the fight we already built, with THAT party's
> real people in it, on the ground you met them on."

---

## THE GAME HAS BEEN SAYING IT OUT LOUD SINCE 8/27

The road director has put parties in front of the player for a week and a half —
his approved twelve, on the map and on the walked street — and the card printed,
in words, at the bottom of the options:

> **"Fighting is not in this build yet."**

**That sentence was TRUE when it was written**, and the reason is three lines
above `ROAD_CHOICES` in the same file:

> "THE ARMS THAT ARE MISSING ARE MISSING ON PURPOSE and the card says so:
> 'drop', 'fight', 'join' and 'third-party' are all kills, and NO DAMAGE BEFORE
> THE DIAL."

It stopped being true when the fight got **a door** (V161), **a street** (V201)
and **a first lesson** (V202). Handing an encounter to the shipped fight authors
**no damage number at all** — the fight owns every one of them already. Same
shape as the four rows before it: *the material was built and nothing consumed
it.*

## WHO IS IN THE PARTY IS HIS, READ OFF THE WORDS HE APPROVED

| his words, verbatim from `ROAD_WORDS` | the party |
|---|---|
| "**Four of them** have the ramp" | 4 |
| "**Three of them**, spread wide" | 3 |
| "**A guy** steps out with a length of pipe" | 1 |
| "**A man** comes up the middle of the road" | 1 |
| "**It** rolls out from under the porte cochere" | 1, and a **machine** |
| "**Six, maybe eight**" | 6 to 8 |

**Nothing here invents a headcount and nothing here invents a hostility.** The
range is read as the range it is, deterministic off the encounter's own `seq`
exactly like the cab's heading, so it rolls no seeded stream.

**AND THE ANIMALS ARE NOT IN IT.** The dog pack, the coyote and the snake are
parties too, and **CREATURES** is an open row with nobody on it: what they are
and how they fight is canon this lane does not hold. Their tokens fall through
exactly as they do today — the pack still fires, still shows his card, and
starts nothing.

## A FORCED PARTY DOES NOT ASK

`forced` is **his own class** out of the approved verdict and it already means
*this happens to you*: he does not slow down, they have done this before, it
keeps coming. So contact starts the fight and there is **no card to press** —
which is also what the row is called. *A card with one button on it is a choice
pretending it is not.* The three that are a real choice keep his card and get
the fight as a real arm on it, priced **A FIGHT** rather than in salvage or
minutes.

Measured end to end: the door's own message reaches the shell, the fight builds
a **street** board — the ground you met them on — room **null**, and the
objective names who it is.

## AND THE PARTY THAT ARRIVES IS THE PARTY THAT WAS SENT, WHICH WAS NOT TRUE

The row's own sentence, and there were **three** writers of the number, not two:

1. `enter()` takes it from the roster.
2. `setupEnemies` **writes over that** with `rollEncounterSize()` — recorded as a
   pre-existing defect on 9/5; a four-man toll crew arrived as **three to six
   strangers**.
3. **The boss line writes over that.** The first cut of this row only knew about
   the first two, and a one-man encounter arrived as **seven**.

And a fourth hole beside them: `applyRoster` only ever copied name, hp and eid,
so the **archetype rode all the way in from the city and was dropped at the
door** — the one machine in the game turned up as a man with a pistol. Proved by
mutation: with the fix cut out, the toll crew is **3 men** and the machine is a
**sniper at 45 hp**.

It also took a default **out** of `startEncounter`, where `hp:60` was invented at
the door for a body whose own table already had one — that 60 was being written
over the machine's 160.

**BOTH DRAWS STILL HAPPEN AND BOTH ANSWERS ARE DISCARDED**, never skipped: a
feature that costs a seeded stream one draw rewrites every board behind it.

## ONE STEP MAKES AT MOST ONE FIGHT

`streetFightOnStep` (V201) and `roadInterrupt` both run on the walked step, in
that order, and neither knows about the other — **which is correct and is exactly
why they must not be merged**, but two entries that cannot see each other can
post two encounters for one footfall. They share one thing and it is not a merge,
it is a **fuse**, armed by `stepOnce`, the one function every step in either mode
goes through.

## IS IT ACTUALLY REACHABLE

Every test above stubs the **director** — the right thing to stub, because it is
the input — but a row that only fires for a stub is a row nobody meets. Walked
**201 map steps with the real director**: **19 road moments**, five kinds, and
**three of them parties**. Two became fights without a card.

## `NO DAMAGE BEFORE THE DIAL`

This row moves **no damage, accuracy, range or resource number**. It is an entry
and a roster.

## THE FLAKE THIS LANE HAS BEEN CARRYING WAS MINE, AND IT TOOK A BASELINE TO SEE

`fight_moves_you_gate` went red two runs in three, on **three different arms**
(V171, V197, V199) — exactly the shape of the flake my own handoff has described
since 9/5 as "about one run in four, never captured". So I captured it, and then
**ran the same gate three times on `origin/main`: 170/0, 170/0, 170/0.**

**It was not the old flake. It was this row.** `G._rosterN` and `G._rosterArch`
were written by `enter()` and never cleared, and a **bench** fight never goes
through `enter()` — so every later fight on the bench inherited the last
encounter's roster and was pinned to its size. The same latch pattern V202 shipped
one row earlier, and I did not use it here. They are consumed and cleared now,
and the gate is **170/0 three runs in a row**, matching main.

*A gate that goes red on your own tree and green on main is not a flake. Assuming
it was one would have shipped this.*

Two other checkers were wrong before the code was:

- **My V203 arms flaked on my own gate** because the bench can leave the **boss
  dice armed**, and a boss REPLACES the archetype and the size — one run read the
  machine as a **BAT at 187 hp**. The dice are off for these arms now, the same
  switch `fight_moves_you_gate` throws at boot.
- **The fuse check stringified `stepOnce`**, which is REASSIGNED by the interiors
  wrapper — the exact lesson V201 paid for and wrote down, walked into again one
  row later. It is checked in the source.

And one genuine ruler fix: `fight_moves_you_gate`'s "a far-off blade does not hold
the line" arm used a **two-sided** null band, so it punished noise that argues
*for* the claim (a far shiv leaving the line **lower** is not evidence of a
blanket buff). One-sided now; the discriminating half — the 1.5-tile separation
between a closing blade and a parked one — is untouched.

## WHAT THIS ROW DID NOT BUILD, AND WHY

The row also says *"relative strength decides who chases whom: the weaker you
look, the more likely they come for you, and breaking line of sight is the
escape"*, and *"a camp fire is seen from far off and brings company."*

**None of that is measurable today and it was not faked.** There are no parties
standing on the map to have a strength (that is RUN `[travel map]` and
`[parties move]`), and `bohemia_standing.js` — the one thing that could say how
strong you look — ships with `DEED_WEIGHT` **empty by his own ruling**, so every
standing is NEUTRAL and will be until he rules. What exists today instead is his
own `forced` class, which already decides who comes for you without a number.
The escape that exists is the one on his card: GO AROUND, WALK ON.

Also noted, not fixed: **`bounty_squad` can never fire**, because its
precondition is `murders` and `roadCan` answers false — *"NO DAMAGE BEFORE THE
DIAL means there is no kill count to read."* The fight has a kill ledger now, but
what counts as a **murder** is canon, not arithmetic.

## GATES AT CLOSE

| gate | |
|---|---|
| `combat_entry_gate.js` | **42 pass / 0 fail** (was 36/0), stable over two runs |
| `fight_moves_you_gate.js` | **170 / 0**, three runs in a row |
| `combat_lab_gate.js` | 931 / 1 (the red is another lane's KILLMUS rungs, pre-existing) |
| `demo_build_gate.js` | 25 / 0 (demo re-cut) |
| `blob_integrity_gate.js` | 107 / 0 |
| `there_are_enemies_gate.js` (RUN's) | 27 / 0 |
| `boss_ladder_gate.js` | 87 / 0 |
| page errors | **0** |

Mutations: the roster is not the last word → 1 red (3 men, a sniper at 45 hp);
remove the fuse → 2 red (its own arm, plus a later arm reading a board that a
second in-flight encounter had already replaced, which is the fuse's own
argument).

## WHAT COMES AFTER

1. **RUN `[travel map]`** puts real parties on the map. This entry reads `ev.name`
   and the party table, so a party that arrives with its own people needs one
   table row, not a second wire.
2. **Relative strength and the chase** wait on a party having a strength.
3. **CREATURES** owns the animals; three of his twelve are waiting on it.
