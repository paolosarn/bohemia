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
