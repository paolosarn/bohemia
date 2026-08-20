# THE OPEN BOOK (V169, 8/19/26, COMBAT lane)

**RF4-55 (machine 7), RF4-65 and RF4-68. SPECED -> BUILT.**
**TAB: COMBAT**, the SETTINGS panel, at the top: *THE OPEN BOOK.*

---

## THE ONE SENTENCE THIS IS BUILT ON

> *"Deterministic AI plus published rules equals **a game about knowledge**.
> Hidden AI plus randomness equals a game about adaptation. These are opposite
> promises and a game has to pick one."* — his capture

RF4-55's diff column says our substrate is already there: `bohemiaDice`, armor 0
on all 320 bodies so there is no hidden mitigation anywhere, and *"patterns are
deterministic and learnable"* locked back in June.

**So the machine was never the determinism. It was the publishing, and we had
none.** In four days this lane shipped five mechanics — an acquisition delay, a
sight ceiling with a per-gun reach, a shout that carries between men, a
free-movement budget on a world clock, an encounter band — and **not one number in
any of them was written anywhere a player could see it.** A game about knowledge
where the knowledge cannot be obtained is a game about guessing.

---

## WHAT THE PAGE SAYS

```
A GUN NEEDS 2 TURNS ON YOU BEFORE IT CAN FIRE.
  Breaking his line resets it to zero. So does a sprint.

YOU SEE 17 TILES. NOTHING SHOOTS PAST 16.
  There is always a band you can watch a man cross and not touch him.
    SHOTGUN best inside 5, cannot reach past 9
    PISTOL  best inside 6, cannot reach past 12
    SMG     best inside 10, cannot reach past 15
    RIFLE   best inside 16, cannot reach past 16
    SNIPER  best inside 16, cannot reach past 16
  The dark shortens every one of these by the same amount.

A MAN WHO SEES YOU TELLS EVERYONE WITHIN 8 TILES.
  They come without ever seeing you themselves.

SPEED REFILLS EVERY 5TH TURN OF THE WORLD, NOT ON A COOLDOWN.
  Spend it all on turn 4 and it is back on turn 5. Hoarding earns nothing.

A FIGHT IS 3 TO 6 BODIES, AND ONE OF THEM IS THE WORST.
  Bigger than that is a boss, and you can pin the number yourself above.
```

---

## THE HARD PART IS WHAT IS *NOT* ON IT

RF4-68 is fleet-wide law and it is a **decision procedure**, not a preference:

> *"The teaching register should be chosen by whether the player **could derive**
> the rule unaided. **Tell** them what they cannot derive. **Hint** at what they
> could. **Show** them what the room can demonstrate. **Never explain something
> the floor could have shown.**"*

So three of the five things shipped this week are **deliberately absent**:

| mechanic | why it is not on the page |
|---|---|
| the heavy moves orthogonally (V164) | the floor shows it — cut a corner, watch it fail to |
| cover turns the guns off (V165) | one rock, one try, done |
| the spotter takes your legs (V168) | the refusal already names it **in the moment**, which beats any book entry |

The temptation with a rules page is to put everything on it, and everything on it
is what makes nobody read it. **A gate check fails the build if any of the three
leaks onto the page.**

---

## EVERY NUMBER IS READ OUT OF THE LIVE CONSTANT. NONE IS TYPED.

This is the engineering idea and it is the difference between a feature and a text
file. **A published rule that can drift from the code is worse than no published
rule, because it is not merely stale — it is a lie told by the game to the player
who trusted it.**

Every figure is interpolated from the constant that governs the behaviour:
`ACQ_TURNS`, `SIGHT_TILES`, `REACH_CEIL`, `SHOUT_TILES`, `SP_TICK`, `ENC_SIZES`,
`WEAPON_RANGE`. Tune any one of them and the page changes with it.

The gun band goes through the **same two doors the fight uses** — `effRange()` and
`maxRange()` — asked with the night multiplier set aside so the page states the
*rule*. Writing the clamp out a second time in the book would **be** the drift this
feature exists to prevent, so both doors took an optional multiplier instead.

---

## AND MY FIRST GATE PASSED WHILE THE PAGE PRINTED NONSENSE

The first draft shipped this, and every check was green:

```
    RIFLE   best inside 20, cannot reach past 8
    SNIPER  best inside 30, cannot reach past 8
```

An effective range **larger than the gun's own maximum**, printed directly under a
headline saying *nothing shoots past 16* — because raw `R.eff` was being set
beside a **night-scaled** max.

**The gate passed because it compared the page to the same function the page had
used to build itself.** That is a consistency check, and a consistency check is
not a truth check. Two things agreeing with each other proves nothing when one of
them is derived from the other.

The fix is a second check that reads the page **alone** and asks whether what it
says can possibly be true: no gun is *best inside* further than it can reach, and
no gun reaches past the ceiling the same page states. That check catches the
original nonsense, and a mutation restoring it turns the gate red.

---

## THE GATES

`gates/fight_moves_you_gate.js` — **33 claims** (was 30). It opens the panel in a
real browser and reads the text a player would read.

`gates/combat_lab_gate.js` — **864 claims**. The shape, both disciplines, and the
standing obligation. Three older claims re-pointed because `maxRange`/`effRange`
gained an optional multiplier; their laws are byte-identical with no argument.

### MUTATION-TESTED, FOUR WAYS, EACH PUT BACK

| mutation | result |
|---|---|
| one number typed instead of read (`8` -> `10`) | **red** |
| the weather printed as the rule again (the original nonsense) | **2 red**, including the sense check |
| a floor-taught mechanic leaked onto the page | **red** |
| the page never built at all | **2 red** |

---

## THE STANDING OBLIGATION, IN HIS OWN DOCUMENT

RF4-55's diff column carries the warning: determinism *"buys depth on first
contact and **spends it over time**, so new deterministic rules must keep
arriving."*

**Publishing is not a row that closes.** Every future rule a player cannot derive
belongs on this page, and that sentence is written into the panel's own header
comment so the next session inherits it rather than rediscovering it.
