# BOHEMIA ADDENDUM — THE FIGHT HAS TO MOVE YOU (Paolo 8/15/26, LOCKED)

> "It's still kind of felt like I just found some cover and I stayed in the same
> place just shooting people at the same location like nothing changed. **There's no
> movement. There's no movement whatsoever and I hate it.**"

## THE RULING

**A FIGHT THAT LETS YOU WIN FROM ONE SPOT IS A BROKEN FIGHT.** The player must be
made to leave cover — repeatedly, under pressure, as the *cheapest* way to survive,
not as a stunt. If holding one piece of cover and firing is ever the optimal play,
the encounter has failed regardless of how the guns feel.

This is direction-class ("I hate it"), it is about the CORE COMBAT LOOP, and it is
**demo-critical**: the demo opens on the family-defense fight. If the centrepiece
fight is static, the demo is static.

## WHY THIS IS NOT A TUNING NOTE

He is not asking for faster bullets or more enemies. He is describing a **structural**
property: the encounter has no term that punishes staying. Damage numbers cannot fix
that — a stationary player with more incoming damage is still a stationary player,
just a dead one. Something in the encounter has to make *the spot itself* stop being
good.

## THE RESEARCH — HOW SHIPPED GAMES FORCE MOVEMENT

He asked for the research, so here it is as a **menu of mechanisms**, not a design.
Every one of these is a way to make the cover you are standing behind stop being the
answer. These are the standard, well-proven levers:

1. **THE POSITION EXPIRES.** Cover degrades, burns, or is destroyed. The spot that
   was safe is gone in N seconds. (Gears, Rainbow Six, Battlefield destruction.)
2. **FLANKERS.** At least one enemy type whose whole job is to walk around the
   player's cover and make the angle worthless. This is the single most common
   answer in cover shooters and the cheapest to author.
3. **THE FLUSH.** A thrown object — grenade, molotov, gas — that denies an area
   rather than dealing damage. Its purpose is not the kill, it is the eviction.
   (Halo grenades, XCOM, Last of Us bottles/bombs.)
4. **RUSHERS.** Something that closes distance and cannot be handled at range, so
   the range fight has to break. (Left 4 Dead specials, Doom Eternal pressure.)
5. **THE OBJECTIVE MOVES.** You are not there to kill, you are there to reach, carry,
   protect, or hold a thing that is somewhere else. Movement is the win condition
   rather than a survival tax.
6. **THE RESOURCE IS ELSEWHERE.** Ammo, cover, or the wounded ally is across the
   room. Staying put means running dry. (Resident Evil, Last of Us scavenging.)
7. **THE CLOCK.** Reinforcements arrive on a timer, so a stalemate is a slow loss.

**Which of these Bohemia uses is a design decision and it is HIS or the COMBAT
lane's normal process — not something to be assumed from this list.** Mechanism is
ours; contents are his. But "do nothing" is no longer on the menu: the ruling says
the current encounter shape is rejected.

**FIT IT TO THE GAME, NOT TO A GENRE.** Bohemia is a post-economic-collapse survival
RPG, not a military shooter. Options 5 and 6 (the objective moves, the resource is
elsewhere) sit naturally with a world about scarcity and people; 1 and 2 (cover
expires, flankers) are the cheapest to author against the existing rig. Nothing here
argues for a set-piece action game.

## THE LANE

**COMBAT owns this.** Routed to the top of the COMBAT queue in `BOHEMIA_BACKLOG.md`
and marked demo-critical.

**WHAT IT OWES THE CHARACTER LANE, named so it is not discovered late:** if the
answer involves the player or the enemies repositioning under fire, the *clips* have
to exist and read at 56px — break-from-cover, move-and-fire, dive/roll, or whatever
the chosen mechanism needs. CHARACTER authors those on request; they do not exist
today beyond the general locomotion set. Ask before the encounter design is frozen,
not after.

## THE TEST

Not "does the fight have more stuff in it". The test is:

> **Can the player win this encounter without leaving the first piece of cover they
> reach?** If yes, it is not fixed.

That is machine-checkable in a headless run — hold position, fire, and see whether
the encounter can be completed. A gate that plays a fight from one spot and requires
it to FAIL is the honest check, and it is what should prove this ruling is satisfied.

---

## STATUS 8/16/26 — ATTEMPTED WITH AMMO, AND IT COLLIDED WITH A NEWER RULING

**SUPERSEDED BY THE 8/16 ENTRY BELOW. He picked the mechanism and it is built.**
Kept because the reasoning is the record of how it was got wrong first.

**What was tried (v157):** mechanism 6, *the resource is elsewhere*. The game had
no ammo at all — infinite bullets since day one — so guns got magazines, shots
started spending rounds, and every man you drop leaves his rounds on the ground
where he fell. It worked: the one-spot test went to **0 of 40**.

**Why it does not stand:** it only reached zero because the starting load was
three rounds in a pistol. Paolo played it on 8/16 and ruled:

> *"I hate that I ran out of ammo... I thought it was unrealistic like I only had
> like eight bullets on that I did not like it."*

He is right, and v158 gave the guns real magazines (pistol 15, smg 30, rifle 20,
shotgun 6, starting full). **Measured across a band of hit rates, fights cleared
without ever moving:**

```
hit rate   100%   90%    80%    70%    60%    50%
cleared    13/20  12/20  12/20  13/20  12/20  14/20
```

**AMMO CANNOT BE BOTH REALISTIC AND THE THING THAT MOVES HIM.** Scarcity does not
bite until a player is missing roughly half his shots. Those are two of Paolo's
own rulings and they conflict on this exact number.

**How the conflict was resolved, and by which laws:** newest date wins, and the
ammo ruling (8/16) is newer than this law (8/15) — so realistic magazines ship.
And A GATE MUST NEVER OUTRANK A RULING: keeping the one-spot check blocking would
have forced the fiction back to three bullets to keep a green check, which is the
exact inversion that produced the bad number.

**What the machine does now:** `gates/fight_moves_you_gate.js` still runs the
one-spot test every time and prints it as `[LAW UNMET, PENDING PAOLO]` with the
live number, but it no longer blocks. Everything the ammo mechanism *does* still
blocks (rounds are spent, drops are world state, the button is honest). **The
check goes back to blocking the moment a mechanism is chosen — the printed number
is the one that has to reach 0.**

**Still on the menu, untried:** 4 (rushers), 5 (the objective moves), 7 (the
clock). 1, 2 and 3 are built and were rejected four times as insufficient on
their own. The ammo mechanism from v157 stays — it is good, and it is real — it
simply is not load-bearing for this law.

**This is Paolo's call and was not decided for him.**


---

## STATUS 8/16/26 (LATER) — SATISFIED. HE PICKED THE MECHANISM HIMSELF.

> *"I like that in rogue fable four you have to go down the dungeon so from one
> second to another so it is a movement goal for stuff so I think that's
> important."*

That is **mechanism 5, THE OBJECTIVE MOVES**, and it is now built (v159).

**EVERY FIGHT HAS A WAY OUT, AND REACHING IT IS THE WIN.** Killing every man on
the board no longer ends the encounter. That is the RF4 shape exactly: clearing a
floor does not advance you, taking the stairs does.

**Why this one works where 1, 2 and 3 did not.** Cover decay, flankers and the
flush all make standing still *worse*, and a good player eats all three — which is
what he was reporting, four times. A destination is not a punishment for staying.
From one spot the win condition is not unlikely, it is **unreachable**, and no
amount of player skill converts standing still into a victory.

**Derived, never designed (MAP LAW).** Placed on the bearing the threat is coming
from, at the range the nearest man is holding, clamped to 10–18 tiles. It reads
where they already are and authors nothing. Bounded because the first cut put it
beyond the *furthest* man and measured 32.8 tiles, which is a hike with a gunfight
at the start.

**MEASURED, one policy, two arms:**

```
NEVER MOVES     won  0 / 16      (11 of those emptied the board and still had not won)
WALKS TO IT     won 16 / 16      after ~13 tiles
```

**The gate BLOCKS again.** `gates/fight_moves_you_gate.js` was downgraded to a
printed warning for exactly one turn while the law sat unmet; it now enforces.
Mutation-tested: restoring "killing everyone wins" makes the never-moves arm win
10 of 16 and takes it red. That mutation also exposed a hole in the gate itself —
the harness was killing men behind the engine's back so `checkClear` was never
called and the mutation changed nothing. Fixed.

**Ammo (v157) is OFF**, by his second rejection on the same day, behind one dial
with the mechanism intact. It was only ever scarce because it was carrying this
law; it is not needed for that any more.
