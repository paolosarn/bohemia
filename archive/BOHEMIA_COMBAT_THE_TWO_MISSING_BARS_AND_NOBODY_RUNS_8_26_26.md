# V182 + V183 — THE TWO MISSING BARS, AND NOBODY RUNS FROM A NOBODY
### COMBAT lane, 8/26/26. Built off his rulings the same turn he gave them.

---

## WHAT HE RULED

After the fourth *"this doesn't feel like Rogue Fable 4 at all"*, he suspended the
one-question rule — **"YOU NEED TO ASK ME ALL THE QUESTIONS YOU NEED TO ASK ME
NOW"** — and answered four at once. Then he played it and sent more.

1. **"JUST IMAGINE ROGUE FABLE 4 WITH 120 BPM EVERYTHING BRO LIEK THATS ALL?"**
2. **ALL THREE BARS.**
3. **A real kit of abilities.**
4. **"BRO THERE ARE NO RUNS. IT IS A FULL GAME THAT WILL TAKE YOU 100 HOURS."**
5. Playing: **"I don't wanna see anyone run away anymore unless I have a perk...
   YOU'RE NOT SCARY ENOUGH."**

Full law: `laws/BOHEMIA_ADDENDUM_THERE_ARE_NO_RUNS_AND_COMBAT_IS_RF4_ON_THE_BEAT_8_26_26.md`

---

## THE DIAGNOSIS THAT PRECEDED IT

Two measurements explain all four rejections, and neither is about missing
mechanics:

- **The thumb decides the fight.** Perfect dial timing clears **7 of 10** fights
  and dies twice; sloppy timing clears **2 of 10** and **dies 8 times**.
- **RF4's economy does not exist here.** Of the **15** teardown rows describing
  Protection / Power / Speed, abilities, talents and upgrades, **zero were built.**

Everything shipped 8/20–8/25 (medic, car, alarm, finisher, breacher, eyes ring,
open ground, xp/loot) is a decision layered on a fight with no economy underneath.

---

## *** IT IS TWO BARS, NOT THREE. THE THIRD WAS ALREADY BUILT. ***

Before writing a line: **Speed Points already exist, under the name stamina.**

- `G.stam` is a **three-pip bar**
- sprint spends one **and your turn keeps going** — RF4-08's *"mobility as a
  spendable resource that BUYS ACTIONS"*, word for word
- dash spends two; a **PERFECT** press refunds one
- it refills on a turn clock whose constant is **literally named `SP_TICK`**
- `STAM_MAX=3` is RF4-09's *"deliberately hard to stack"*
- and the comment above it already reads **"V163 THE FREE-MOVEMENT BUDGET
  (RF4-08, machine 1)"**

The code knew. Building a second speed bar beside it would have been the
duplicate-system disease this project keeps paying for. **Credited, not rebuilt.**

---

## V182 — PROTECTION POINTS (RF4-05)

> *"a separate HP bar which **cannot be punched through** while a single point
> still stands."*

That clause is the bar's entire character: a hit landing on **one** remaining
point is eaten **whole**, however big. It makes the bar a **timer you manage**
rather than a sponge, which is why RF4 players count turns instead of hit points.

| | |
|---|---|
| 1 plate vs a 99-damage hit | **0 hp lost** |
| no plate vs a 30 | 30 hp lost |
| 20 plate vs a 7 | plate 13, **0 hp lost** |
| on the clock | plate 0→5, legs 0→3, **one clock** |

### AND IT NEEDED ONE DOOR FIRST

**Eight separate sites** did their own `G.pHP=Math.max(0,G.pHP-dmg)` — the volley,
the holders, the peekers, melee, the grenade, the car blast, the self-blast band.
A bar sitting *above* hp must stand in front of **all** of them or it is
decoration. Same repair as V181's `bodyFell`, which found five deaths in six
dropping nothing. **A rule with seven doors and one lock is not a rule.**

---

## V182 — POWER (RF4-07 + RF4-42), AND IT MOVES THE DIAL, NOT THE DAMAGE

> *"One unified offensive stat... anything modifying Power now modifies ALL power."*

**NO DAMAGE BEFORE THE DIAL is law.** So Power is not a flat adder beside the dial
— it is a term **inside** it, joining the forgiveness, the weapon width, the
groove and the pin on the line that already decides the kill window.

| | |
|---|---|
| Power 0 → 5 | window **1.0 → 1.4** |
| damage at 0 vs 99 Power | **40 → 40, unchanged** |

His ruling and his law both hold, and it is the *more* RF4 answer: one stat, every
weapon. Every gun gets easier to **kill** with; none of them **hit** for more.

---

## V183 — NOBODY RUNS FROM A NOBODY

> *"I don't wanna see anyone run away anymore unless I have a perk that allows
> them to start running away. And by default, I don't want that on... **YOU'RE
> NOT SCARY ENOUGH.**"*

**The fiction and the mechanic in one sentence.** A man who has just started
frightens nobody. Being someone people run from is a thing you *become* — which
puts it in the perk tree he ruled on in the same conversation, and makes it the
best possible first entry, because it changes how every fight reads without
touching one damage number.

### AND "SO MANY PEOPLE" WAS THE DESIGN, NOT BAD LUCK

V35's nerve check fires the moment **half** the room is down, then rolls for
**every** man still standing, **every turn**, at 10% + 5% per body past halfway. In
a five-man fight that is four men rolling every turn from the third body onward.
**The back half of nearly every fight was a rout.**

| across 20 fights, 65 bodies | men who broke or ran |
|---|---|
| **default (no perk)** | **0** |
| with the perk on | 4 |

**V35 is gated, not graveyarded.** He did not say the mechanic is wrong, he said
it is **not earned yet**. The graveyard is for dead things; this one is asleep.

---

## TWO GATE CLAIMS RE-POINTED, AND ONE OF THEM IS WORTH READING

**V62** simply gained `_pwr` in the dial string. Claim unchanged.

**V163 is the interesting one.** It does not read the refill block as a *string* —
it **slices that block out and executes it** in a `new Function` bound only to
`G/STAM_MAX/SP_TICK/setRead/updStam`, because a per-use refund and a global clock
are indistinguishable by string and the whole ruling is *which one it is*. My PP
regen, placed inside that block, referenced `PP_MAX` and threw ReferenceError in
the harness — **taking a correct, unrelated claim about stamina red.**

The plate now mends from its own guarded block one line later, carrying its own
copy of the condition. **A gate that runs code is stronger than one that reads it,
and it is also a gate you can break by standing in the wrong place.**

---

## GATES

- `fight_moves_you_gate.js` — **98 pass / 0 fail** (was 94), four new arms
- `combat_lab_gate.js` — **931 pass / 0 fail**

---

## STILL OPEN FROM HIS PLAY NOTES, NOT BUILT THIS TURN

1. **"I'm kinda confused about what ammo does."** — a readability problem, not a
   mechanics one. Unbuilt.
2. **"There doesn't feel like there's any strategic reason"** to use the pillars
   and the stairs. This is RF4-19/RF4-54 and it is the biggest one left.
3. **"It could be more hardcore if you wanted it to be"** — he walked circles
   around enemies for many turns to see how long it took to get shot, and it took
   too long. Permission, not a ruling.
