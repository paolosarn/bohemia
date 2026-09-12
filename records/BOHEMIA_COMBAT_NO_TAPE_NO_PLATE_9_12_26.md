# V211 — NO TAPE, NO PLATE (COMBAT lane, `[plates cost]` BB-THE-FIGHT-EATS-TAPE)

**The row:** *"THE PLATE YOU WEAR AT EVERY BELL IS FREE, AND IT SHOULD COST TAPE."*
In the game he named, tools drain after every fight to fix what the fight broke, and
that is the single resource a player manages most — spent by the **verb of fighting**,
never from a menu. His duct-tape icon is that resource.

**Its ship test, in its own words:** *"the bell debits one tape and a purse at zero
rings with no plate."*

---

## MEASURED FIRST, AND HALF THE ROW WAS ALREADY BUILT BY ANOTHER LANE

Driven through the shipped door with the pocket emptied:

| | |
|---|---|
| the purse's verb | `fight:plate` spends `resources`, amount 1 |
| at zero | **REFUSED**: `{applied:false, reason:INSUFFICIENT, have:0, wanted:1, short:1}` |
| the debit | **already happens**, in the city's own handler when the fight comes home — live since 8/21, and another lane's gate asserts it |
| **the bell** | ***`pp:1` with an empty pocket.*** `PLATE_START=1`, handed over unconditionally |
| the fight blob | **zero** mentions of a purse, tape or `fight:plate`. It has never been able to ask |

So the missing half is the half that makes this a **cost** rather than a tax. **A bill
you always pay and never fail is not a resource you manage.**

## AND THE RESET THE ROW ASSUMED EXISTED DOES NOT

The row quotes day 10: *"G.pp=PLATE_START runs at the top of every fight, so plates
crack and come back full at the next bell."* **That is only true on the test bench.**

That line lives in `resetFightState`, which V107 wrote for this exact class of bug —
its own comment is *"EVERY PER-FIGHT FIELD LIVES HERE NOW, and both doors call it"* —
and **the city is a third door that calls neither.**

Measured on **clean main, before any of this**, driven twice through a real street
bump with the plate cracked to 0 in between:

```
fight 2 from the city    pp 0, against PLATE_START 1, kit sentinel SURVIVED
NEW ENCOUNTER (bench)    pp 1, kit cleared -- the reset works where it is called
```

> **Armour has never come back at a real bell.** "The plate you wear at every bell is
> FREE" describes the bench, not the game — and the real state was worse for the
> player than the row thought. **You have to build the reset to be able to charge for
> it**, which is why this row carries both halves.

The same hole is leaking more than the plate: the kit survives a city bell, and so
does power. **Those are measured and routed, not quietly fixed on the way past a row
about armour.** A row that moves a stat nobody asked it to move is how a lane loses
the right to be trusted with the next one. The gate asserts the kit sentinel is still
sitting there afterwards, so the boundary is held on the glass and not just claimed.

## THE AMOUNT IS NEVER WRITTEN DOWN ANYWHERE IN THIS ROW

The door does **not** ask "is the balance at least one." That would copy his 8/15 ONE
into a second place, and a copy drifts the day he tunes it.

Instead it builds a **throwaway purse** holding exactly what you hold, runs the
purse's **own** `upkeep('fight:plate')` on it, and reads the answer. The currency is
read off the purse's own verb table. Your real purse is never touched — the gate
proves that too: five in the pocket, three questions asked, still five.

**And the gate tunes the purse to prove it.** With `upkeep` charging two instead of
one, a pocket holding one starts refusing and a pocket holding two pays — **with not
one line of the fight or the door edited.** That arm is what would catch somebody
replacing the dry run with `have >= 1`, and it does: the mutation turns it red.

## AND THE BELL DELIBERATELY DOES NOT DEBIT

This is the one place the build departs from the row's own sentence, and it is named
here rather than hidden. The debit is built, shipped, owned by the purse lane, and
held by that lane's gate. **A second debit at the bell would charge you twice for one
plate**, which is a worse bug than charging at the far end of the fight.

**The bell reads. The existing handler spends.** The row's intent — the plate is not
free, and no tape means no plate — is met whole. Measured: starting a fight moves the
pocket by nothing, 2 before the bell and 2 after.

## WHAT HAPPENS AT THE BELL

Every branch is a state the game already reaches.

- **Can pay** — nothing changes. The plate is exactly what it always was.
- **Cannot pay** — `G.pp=0`. Not a new number: a cracked plate already leaves 0, and
  the fight already has a line for it (*PLATE GONE*).
- **No stamp** — nothing changes beyond the reset. A fight that did not come from the
  city cannot know your purse, and punishing the test bench for a wire it has no
  access to would be this tool inventing a rule.
- **The lesson** — nothing changes. The teaching fight is never made harder by an
  empty pocket, the same stand-down V207 wrote for the same reason. The gate proves
  it is a stand-down and not a broken wire by running the identical stamp with the
  lesson off and watching it bite.

**And the plate perks go with it**, which is a decision and not an oversight. Three
reasons: the row's words are absolute; PLATE CARRIER is the first BODY perk at level
1, so sparing perks would stop this row biting almost immediately and leave it
decoration; and *"no tape, no armour"* is a rule a player can say out loud. The perk
is not taken away, it is unpayable for this one fight — buy one tape and it is back.
**The readout names how many it cancelled**, because a thing he cannot know about does
not exist (V210's rule, one round old in this same lane).

The allowance is computed with **no perk list duplicated**: `applyPerks` is idempotent
for everything except `pp` and `power`, so the base pair plus the game's own perk
applies *is* the answer, and power is put straight back.

## A BUG IN MY OWN V207, FOUND BECAUSE IT WAS EATING THIS ROW'S LINE

The NO PLATE line did not appear. The cause was one condition I had written a round
earlier: `worldRead` stood down when the fight carried an objective, commented *"his
objective owns it."*

**That premise is false.** `showObjective` writes its own chip (`#objchip`) and never
touches the readout. And **every city fight carries a label**, so that one condition
meant V207's weather line could not speak on **any of the four real entries** — a row
that only ever spoke on the test bench, which is exactly where I measured it.

Fixed in both places. The gate now asserts the NO PLATE line speaks **while an
objective is present**, and the mutation that puts V207's condition back turns it red.

> Two rounds running, the defect has been the same shape: **a thing that works when
> you call it yourself and never happens in the game.** Last round it was a gate arm
> calling the function directly. This round it was a stand-down guarding nothing.

## THE DIAL

No damage value, no hit chance and no roll is authored. `PLATE_START` is still 1,
`PP_MAX` still 3, `applyDamage` knows nothing about tape or a purse, and the bell
authors no comparison against an amount. The only thing that moves is **how many
plates you are handed, between two numbers the game already uses.**

## PROOF

`gates/plate_costs_tape_gate.js` — **15 passed, 0 failed**, registered in the suite as
**PLATE COSTS TAPE**. Mutation-proved four ways, each landing on the right arm:

| mutation | result |
|---|---|
| the tape rule never bites | **4 red** |
| the amount copied into the door instead of asked | **1 red**, the tune arm |
| the bell stops resetting the plate | **3 red** |
| an objective silences the line again (V207's bug) | **1 red**, the readout arm |

---

**Tool:** `tools/bohemia_plate_costs_tape_patch.py` (MARK `__PLATE_COSTS_TAPE__`,
replayable onto fresh main, touches the alpha and the city slice) · **Tab:** COMBAT.

**ROUTED, not fixed here:** the city door does not run the per-fight reset, so the
**kit** and **power** carry over between fights as well. The plate was fixed because it
is this row's subject. Both are measured above and named in the handoff.
