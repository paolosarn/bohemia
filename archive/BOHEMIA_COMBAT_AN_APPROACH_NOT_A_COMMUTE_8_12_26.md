# AN APPROACH, NOT A COMMUTE

**8/12/26 — COMBAT lane. Finishes Paolo: "the game can kinda become wait where
Im at until mfs wanna get in my range type shit."**

---

## I MEASURED IT AND THE NUMBER WAS WORSE THAN THE FEELING

60 arenas, pressing nothing but WAIT:

- **14.9 turns** before anything was shootable
- **49.3 damage** taken while it happened
- 10.2 turns spent exposed to a live gun

So waiting was never free — it cost half your health. But that was never really
the complaint. **Fifteen turns is the complaint.** An approach is a phase.
Fifteen turns of it is a commute.

## TWO CAUSES, BOTH MINE

**1. I overcorrected the gap.** Two messages ago you told me everyone was
already in range, so I pushed the spawn band out to 1.8×–2.6× your gun's reach.
With a pistol reaching 8 tiles after dark, that put men 14–21 tiles out with
nearly all of it to walk before anybody could do anything.

**2. Half the line stood still while nobody could shoot.** Fire-and-movement —
half bound, half cover them — is exactly right *under fire*. But when not one man
on the field can reach anybody, there is nothing to cover and nothing to be
covered from. Half the line was holding a firing position against a threat that
does not exist yet, which doubled the walk for no reason a person would
recognise.

## TUNED BY MEASURING, ONE BAND AT A TIME

| spawn band | turns of walking | damage getting there |
|---|---|---|
| 1.80× (what shipped) | 14.9 | 49.3 |
| 1.30× | 8.7 | — |
| **1.15× (ships)** | **4.0** | **11.9** |

**And the rule you asked for survives untouched.** Nobody is in range at the
bell — 0%, and the real SHOOT button refuses on turn one in **60 of 60** arenas.
I verified that by pressing the button, not by trusting the number, because
trusting the number is how I got this wrong the first time.

A line under no fire now advances whole. The instant one gun can reach one man,
fire-and-movement snaps straight back.

## WHY THIS SHAPE, NOT A NEW MECHANIC

The first XCOM had this exact problem — squad movement so slow the approach
dragged — and the fix in the sequel was **pressure to advance**, not a bigger
map. Shortening the walk and letting an unopposed line actually walk are the
same medicine: the fight starts sooner and the dead turns go away.

**I deliberately did not add verbs to the approach.** Suppress, RUN, the grenade
and cover all already work during it. What you named was the *length*. Inventing
a mechanic for a problem I had not proven is how three earlier turns today went
wrong.

Tool: `tools/bohemia_combat_an_approach_not_a_commute_patch.py`
Gate: `gates/combat_lab_gate.js`, 760 → 761 checks.

**WHERE TO SEE IT: the COMBAT tab.** The fight starts about four turns in now
instead of fifteen, and you get there with your health.

---

Sources:
- [Encounter — The Level Design Book](https://book.leveldesignbook.com/process/combat/encounter)
- [Combat Design, Mechanics and Systems](https://gamedesignskills.com/game-design/combat-design/)
- [Game pacing — Shardpunk devlog](https://bryqu.itch.io/shardpunk/devlog/56214/game-pacing)
