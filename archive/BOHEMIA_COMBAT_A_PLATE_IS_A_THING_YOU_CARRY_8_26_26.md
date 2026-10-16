# V184 — A PLATE IS A THING YOU CARRY
### COMBAT lane, 8/26/26. He overruled Rogue Fable on realism, hours after I shipped its number.

---

## THE RULING

> *"I know in Rogue Fable four, the armor will regenerate after a couple of turns
> or whatever. But if I wanted this to be, like, **fun but realistic**, like, it'd
> probably have to be, like, **once a day** or something. I don't know. **You can
> absorb a free shot** or something."*

V182 had shipped RF4-05 verbatim that same day: a 20-point pool, 5 back every 5
turns, on the beat clock. **He invoked REALISM FIRST on his own, against the one
number I imported without questioning it.**

He was right. A ceramic plate is not a shield spell. **It stops a round by
breaking.** Nothing puts it back but another plate.

**RF4 IS THE REFERENCE, NOT THE SPEC.** "Rogue Fable 4 with 120 BPM everything" is
the brief; where RF4's fiction and ours disagree, ours wins. That is REALISM FIRST
working exactly as written — the realistic option leads, and the trade is his.

---

## WHAT CHANGED

| | before (V182) | now |
|---|---|---|
| shape | 20-point pool | **one plate = one object** |
| a hit | eaten whole while a point stood | **eaten whole, then the plate is gone** |
| regen | 5 every 5 turns, forever | **none, ever** |
| source | the clock | **bodies** |

**"You can absorb a free shot" is his wording and it is the better mechanic.** The
pool made armour a passive buffer you never thought about — roughly four free hits
a fight, forever. One plate is **a decision every turn**, because it *will* eat the
next thing that touches you, so the question becomes *which* hit you spend it on.
Step into the open now while you still have it, or hold it for the push. That is
the "abilities read the room" shape RF4-18 is about, arriving through the armour.

---

## MEASURED ON THE REAL SURFACE

| | |
|---|---|
| walk in with | 1 plate, carry up to 3 |
| 1 plate vs a **250** | **0 hp lost** |
| no plate vs a 30 | 30 hp lost |
| a hit of **3** | still spends a whole plate, 0 hp lost |
| one tick of the clock | **plates 0, legs 3** |
| **thirty turns** | **plates 0** |
| bodies wearing one | 26% (dial 0.22) |
| walking over one | picked up, capped at 3 |
| page errors | 0 |

**The clock keeps the legs and lets go of the vest.** Your legs come back because
you caught your breath. A plate comes back because somebody handed you another one.

---

## AND IT MAKES HIS OWN LOOT RULING MATTER MECHANICALLY

On 8/25 he ruled: *"YOU GET EXPERIENCE AND LOOT OFF THEIR BODIES."* V181 built the
walk to the body — and the loot was **flavour**. A folded twenty, half a pack of
smokes. Real words he can edit, but **nobody crosses a firing line for half a pack
of smokes.**

**A plate is something you would cross open ground for.** So plates drop on bodies
alongside the rest, and V180 already measured what that ground costs: **56% of
open-ground turns have a gun that can reach you, against 17% everywhere else.**

Three rulings from three different days close into one loop, with no new rule:
**V180** makes standing in the open pay and hurt, **V181** puts the reward on the
corpse, **V184** makes the reward worth the walk.

---

## WHAT IS NOT BUILT, AND WHY

**"Once a day" is not built and not refused.** He said *"or something, I don't
know"* — that is uncertainty, not a ruling. The in-fight rule is decided here
(nothing regenerates); a day-cycle refill waits for the world clock to reach
combat. A plate you looted persists.

---

## GATES

- `fight_moves_you_gate.js` — **101 pass / 0 fail** (was 98)
- `combat_lab_gate.js` — **931 pass / 0 fail**

One V182 claim was rewritten rather than re-pointed, because **V184 reverses half
of what it asserted.** It claimed the plate mends on the speed clock; that is now
false by design. Its surviving half — that Speed Points were already built as
`G.stam` and are credited rather than rebuilt — is the part that was always the
finding, and the clock keeping the legs while letting go of the vest is now the
point instead of a loose end. **A claim that describes superseded behaviour is
rewritten, never quietly loosened.**

---

## WHERE HE FINDS IT

**COMBAT tab.** You start each fight with one plate. The next thing that hits you
bounces off it, whatever it is, and then it is gone until you take one off a body.
