# V208 — A GUN IS IN ITS OWN WAY UP CLOSE (COMBAT lane)

VAMILY job: **[guns close]** = `BB-GUNS-CLOSE`, which jumped the queue on the
coordinator's running order.

> *"GUNS ARE BAD IN CLOSE. Forever, on every weapon. IT IS A CONSTRAINT, NOT A
> FEATURE, IT COSTS NOTHING TODAY, AND EVERY WEAPON WRITTEN BEFORE IT IS WRITTEN
> IS REWORK."*

Its reason is history, not taste: guns and melee coexisted for two centuries and it
only ended when the bayonet let a gun fight up close. If our guns are good in close
the positional game dies and the fight becomes stand-and-shoot. The genre's usual
answer — cover plus hold-fire — is refused, because its documented result is
turtling, and that is **his own acceptance test failing in somebody else's game**:
*"not a 40 MINUTE LONG CHESS MATCH."*

Tab: **COMBAT**.

---

## THE BUILD WAS THE EXACT OPPOSITE OF THE ROW, AND IT SAID SO IN ITS OWN COMMENT

`rangeT(d,R)` returns **zero** for any distance inside point blank and rises toward
one as you back off. Both things that read it made close the *best* place to shoot:

| | |
|---|---|
| the dial's pattern tier | *"point blank pulls EASIER patterns, even on Bohemian"* |
| the men's accuracy | *"point blank ~.97, far ~.37 (they rarely miss up close)"* |

So a gun was at its most forgiving with a man in your face. That is the
stand-and-shoot fight this row exists to prevent, shipped as a feature.

## AND HALF OF THAT IS PAOLO'S OWN RULING, SO IT IS NOT TOUCHED

The men's up-close accuracy carries his ruling in the code beside it: *"up close
nothing moves, because up close was already lethal and that is his 7/27 ruling."*

**A backlog row is OUR mechanism. His ruling is CONTENTS and it wins.** And once you
read what the row is actually for — the player choosing to stand still and trade
shots — the two are not in conflict at all:

> **A man in your face still hits you** (his 7/27 ruling, untouched), **and your own
> gun is at its worst at that distance** (this row).

Both sides now point the same way: do not be there. That is the positional pressure
the row asked for, and it took nothing away from him to get it.

## "EVERY WEAPON" CANNOT MEAN A FLAT PENALTY, BECAUSE THE SHIPPED GUNS SAY OTHERWISE

`WEAPON_ID`, in the game, calls the shotgun **"brutal up close"**. `WEAPON_RANGE`
calls it **"a knife with a bang"**, effective range 5, against the rifle's 20. And
`REALISM FIRST` is a law: a shotgun is the one gun that is genuinely good in a
doorway.

So the constraint is read the only way that satisfies the row **and** the shipped
weapons **and** the world:

> **The penalty is proportional to how unwieldy the gun is at that distance, and it
> is derived from each weapon's own effective range.**

Nothing is exempt — which is the row's *"every weapon"* — and the bands come out
where a person would expect:

```
  shotgun   eff  5  ->  band 2.25 tiles     least bothered by a man in its face
  pistol    eff  6  ->  band 2.7
  smg       eff 10  ->  band 4.5
  rifle     eff 20  ->  band 9              a rifle at two feet is a club
```

**THIS READING IS THE ONE JUDGEMENT IN THE PATCH AND IT IS FLAGGED FOR THE
COORDINATOR.**

## WHAT SHIPPED

| | |
|---|---|
| the band | a fraction of each weapon's own effective range, one constant, `[DIAL]` |
| the dial | hard at **both** ends now, so every gun has a best distance |
| the readout | inside the band the target says **TOO CLOSE** |
| tools/bohemia_guns_close_patch.py | replayable, MARK `__GUNS_CLOSE__` |
| gates/guns_close_gate.js | **10 pass / 0 fail**, suite-registered as **GUNS CLOSE** |

```
  every gun's best distance, walking the whole curve at the hardest difficulty:
    shotgun  best tier 0 at 2.2 tiles    contact 2
    pistol   best tier 0 at 2.6          contact 3
    smg      best tier 0 at 4.6          contact 3
    rifle    best tier 0 at 9.4          contact 4
```

## AND HE CAN SEE IT

A dial that quietly gets mean is a bug to the man holding it. The target readout
already named the range band; inside a gun's close band it now says **TOO CLOSE**,
and at the gun's own range it reads the band it always did. `draft:true` — the words
are WORDS'.

## TWO THINGS I GOT WRONG, BOTH CAUGHT BY THE FIRST RUN

**1. THE BAND SCALED WITH THE LIGHT, AND THAT MADE IT UNFEELABLE.** The first cut
read it through `rangeMult()` like every other distance in the file, which on the
bench halved it: a shotgun's band came out at **1.1 tiles** and a pistol's at 1.35,
against a point-blank anchor of 4. The constraint existed and could not be felt. It
is also wrong on its own terms — **how unwieldy a gun is in a doorway is physical,
and the dark does not change it.** Reach shrinks at night; length does not.

**2. MY OWN GATE ASKED AN IMPOSSIBLE QUESTION.** It demanded that contact be harder
than the gun's **stated effective range** — and that cannot be true for a pistol,
because the shipped far curve already clamps to its hardest tier at 4.8 tiles while
the pistol's effective range is 6. Nothing can be harder than "hardest". The claim
was impossible rather than wrong about the build.

The row's own sentence is that a gun's effectiveness **falls off close**, and the
honest shape of that is: **the gun has a best distance, and it is not in contact.**
The arm now walks the whole curve per weapon and checks exactly that. *An arm that
cannot pass on correct code is not strict, it is broken.*

**MUTATION-PROVED:** take the close end off the dial → the dial arm red. Give every
weapon one flat band → the "the order comes out of the weapons themselves" arm red.

## `NO DAMAGE BEFORE THE DIAL`

Not one damage number, hit value or roll is authored here. It is one constant
deciding how much of a gun's own range is too close to use it, and the band is
derived from the weapon table rather than a second private table of per-gun numbers
— which is what keeps this a **constraint** instead of a balance pass. The gate
checks that too.
