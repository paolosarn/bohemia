# V181 — EXPERIENCE AND LOOT OFF THEIR BODIES (RF4-36)
### COMBAT lane, 8/25/26. His ruling, and the oldest open question in this lane closed.

---

## THE RULING

Asked *"when you win a fight, what do you get?"* — a question that had been on the
shelf, unanswered, blocking the last three-star row in the teardown:

> **"YOU GET EXPERIENCE AND LOOT OFF THEIR BODIES FUCK YOU MEAN?"**

NOTES ARE RULINGS. Built the same turn.

---

## IT LANDED ON A MACHINE THAT WAS ALREADY THREE QUARTERS BUILT

This is the part worth knowing. His answer did not start a system — **it closed a
wire that has been live at the other end since 3 July:**

- **THE GHOST CHIP (Paolo 7/3)** is a gold experience mote that already **arcs
  from the body into you**, glowing, trailing afterimages. Its own comment reads:
  *"the green meter is XP-bound later; this is its currency in flight."*
- **The walk readout** has said, in these exact words, for weeks:
  *"WALKING THE FIELD — yours now, **loot comes later**."*
- **`EXEC_XP_PCT = 0.03`** — his own 8/2 number, *"maybe only +2% or +3%"* for
  finishing a man on the floor — was **the only thing in this game that paid
  experience at all.**
- **`dropRounds` / `sweepDrops`** already drop a pile on the tile a man fell on
  and hand it over when you walk there. *"The dead are the supply."*
- **`[real XP numbers PENDING Paolo]`** was sitting in the receipt code, waiting.

The game has been promising this for two months.

---

## "OFF THEIR BODIES" IS THE LOAD-BEARING PHRASE

He did not say experience for **winning**. He said **off their bodies** — so it
sits on the corpse and you walk to it, through the same sweep that has handed over
ammunition since V157. **A kill you never walk to pays nothing.**

That is a decision on the ground instead of a number in a menu, it is the geometry
RF4-18 and RF4-48 are both about, and it is exactly what the ghost chip has been
drawing all along.

### AND IT CLOSES A LOOP WITH V180, SHIPPED HOURS EARLIER, WITH NO NEW RULE

The body lies where you shot him — frequently **on open ground under their eyes**.
That is the state V180 now pays a finisher charge for standing in, and the state
where **56% of turns have a gun that can reach you against 17% everywhere else.**
Going to collect is the risk. The reward for taking it shipped this morning.

---

## MEASURED ON THE REAL SURFACE

| | |
|---|---|
| xp left by each death path | gunshot 15, blast 15, execution 15, incidental 15 |
| wipe 3 men and **walk away** | ledger **0**, **41 xp lying on the ground** |
| then walk over every body | ledger **41**, items taken, **0 piles left** |
| loot chance | 61% measured against a 0.55 dial |
| page errors | 0 |

---

## A DEFECT FOUND ON THE WAY IN: FIVE OF SIX DEATHS DROPPED NOTHING

`dropRounds` had **exactly one caller** — the pistol lethality roll. A man killed
by a grenade, by a car cooking off, by an execution, or by an incidental hit left
an **empty tile**.

*"The dead are the supply"* was true of **one death in six**, and had been since
V157 shipped. Every death now goes through one owner, `bodyFell()`, so a body is a
body however it fell.

---

## THE LAWS IT HAD TO SATISFY

**NO DAMAGE BEFORE THE DIAL** — untouched. Experience is not damage, no item
carries a combat effect, and every number introduced is a `[DIAL]`:
`KILL_XP_PCT 0.25`, `LOOT_CHANCE 0.55`, `EXEC_XP_PCT 0.03` (his).

**MECHANISM MINE / CONTENTS HIS, in the 8/11 shape.** The pile, the walk, the
sweep and the ledger are mechanism. The item **names are WORDS**, so they ship as
a real attempt tagged `draft:true` — *an empty field is a blank page, and he
edits, he does not write from nothing.* Eight items, every one a draft, one of
them carrying the Spanglish the 8/25 law asks for (*un rosario, worn smooth*).

**REUSE-FIRST.** Cooks no pixels, opens no bank. The pile is `G.drops`; the
walk-over is `sweepDrops`; the marker on the tile is already drawn (V157 reused
the grenade marker byte for byte); the ledger is `G.ledger`/`G.rc`, which
`execXP` already filled. Nothing new is drawn or stored.

---

## THE GATES

- `fight_moves_you_gate.js` — **94 pass / 0 fail** (was 91), three new arms
- `combat_lab_gate.js` — **931 pass / 0 fail** (was 925), six new claims

Two existing claims re-pointed for structure, neither for substance: **V157**'s
anchor now names `bodyFell` (which calls `dropRounds` as its first act, and is now
true of all six death paths rather than one), and **V114**'s window outgrew 1800
characters because `finishHim` gained a call — the same shape as V136's window
earlier today. An execution's 3% token is now **on top of** what the man was
carrying rather than the only experience in the game.

---

## WHERE HE FINDS IT

**COMBAT tab.** Drop a man, then walk onto the tile where he fell. The readout
says **OFF THE BODY** with the rounds, the XP and whatever he was carrying. Walk
away instead and it stays on the floor.

**RF4-36 moves SPECED -> BUILT.** It was the last unbuilt three-star row.
