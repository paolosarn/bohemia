# BOHEMIA — COMBAT: ANSWERING WHAT HE ASKED (7/29/26)

Paolo, 7/29, in one message:

> "i didnt notice my rule where whatever how many killshots u have after it
> becomes extremely hard implemented i didnt see that. the arenas are better but
> u have like a 4th grade level of understanding when i say arenas fr. if the
> combat happens at night should all players and enemies have a harder time with
> accuracy because its dark. i want to start working on combat mechanics for
> companions and sneaking before combat is in full swing too. when can i start
> throwing grenades or molotovs?"

Five things. One is built (the allowance, v95, see the correction block in
records/BOHEMIA_COMBAT_THE_KILLSHOT_ALLOWANCE_7_27_26.md). The other four are
answered here. **Nothing in this file was built.**

---

## 1. NIGHT ACCURACY: MY ANSWER IS NO, AND THEN A BETTER YES

**A flat accuracy penalty on everyone is the tally mistake again.**

If darkness makes me 20% worse and it makes them 20% worse, the relative maths is
identical and nothing about my decision changes. The fight just takes longer. By
the rule this lane wrote the day he killed the tally: **if it does not change a
decision the player makes, it is not a mechanic.** A symmetric difficulty tax
changes no decision. It is a number that exists to be noticed.

**The version that IS a mechanic: darkness should shrink RANGE, not accuracy.**

The game already has exactly one lever for this and it is the best one it owns:

```js
function distPkg(e){ return Math.round(distT(e) * (G.userPkg||0)); }
```

The dial gets harder with DISTANCE. That is the whole reason closing to point
blank is the offensive play, which he ruled on 7/27. So at night you do not add a
penalty, you **multiply the distance term**. The consequences fall out for free:

- **At night, far shots get much worse and point blank is untouched.** So the
  ruling he already made gets LOUDER after dark instead of being taxed flat.
- **Holding a long angle stops working at night.** Now the time of day changes
  where you want to stand, which is the north star word for word: positioning.
- **It costs nothing to build.** One multiplier on a term that already exists. No
  new system, no new number on screen, no new UI.

**And it makes LIGHT=TERRITORY into a tactical map instead of set dressing.**
12% of the city is lit, the light is owned, and nobody patrols the dark. If dark
shrinks everyone's effective range, then standing in a lit patch means you can be
hit from across the lot, and standing in the dark means they have to come to you.
That is a real choice with a real cost, made out of a law that already exists and
currently affects nothing in a fight.

**RECOMMENDATION: no accuracy penalty. A night multiplier on the distance term.**
The size of that multiplier is [PENDING Paolo] because it is balance, and balance
is contents.

---

## 2. GRENADES AND MOLOTOVS: THE HONEST STATE

**You cannot throw anything. There is no player throw in the file.**

What exists is `grenadeTurn()`, and it is an ENEMY action:

```js
function grenadeTurn(){ ...
  G.grenade={ea:a,edist:dd,fuse:2,r:1.5,...}; G._grenadeThrown=true;
  setRead('GRENADE IN!','2 beats — MOVE off the marked tile ...');
```

One grenade per encounter, thrown AT you, 2-beat fuse, a pulsing danger tile with
the count on it, and you either move off the tile or you eat it. That is a
movement-forcer aimed at the player. **Molotovs do not exist at all, in any
direction.**

So the honest answer to "when can I start throwing" is: not today, and I am not
going to pretend the enemy's grenade counts.

**WHAT IS ALREADY BUILT AND WOULD BE REUSED, which is most of it:**
- the thrown object with a fuse that ticks on the beat
- the pulsing danger tile with the countdown drawn on it
- the blast ring
- the "you moved off it, so you dodged" resolution, which is already the good part
- **the approved fire art nobody consumes**: `o_fx_flame_burst_00` in the particle
  bank plus 34 banked fire-flicker loops, flagged in the approved index as having
  had ZERO consumers until the mobile camp took some

**WHAT IS ACTUALLY MISSING, and it is three things:**
1. a way to pick the tile you are throwing at
2. blast damage applied to ENEMIES (today the blast only measures YOUR distance)
3. a ruling on what a throw costs: your whole turn, or a shot off the allowance

**MY RECOMMENDATION: build the MOLOTOV first, not the grenade.** A grenade is a
one-beat damage event, and damage is the thing he has ruled there are almost no
ways to increase. A molotov leaves FIRE ON THE GROUND for a few beats, and fire
on the ground is AREA DENIAL: it takes tiles away from both sides and forces
somebody to move. That is a positioning mechanic, which is the north star, and it
consumes an approved bank that currently draws nothing.

---

## 3. ARENAS: I AM STOPPING, NOT GUESSING AGAIN

> "the arenas are better but u have like a 4th grade level of understanding when
> I say arenas fr"

Taking that at face value. What I have built when he said "arena" is: a seeded
dice so a fight can be replayed, a density/bulk/clump vocabulary for scattering
cover, and a two-storey deck with a stair. All of that is **a scatter of blocks
on a field.** It has no place, no purpose, no reason for the fight to be
happening there, and nothing about it says Las Vegas.

Reading it back, the thing I have never built is the part that would make it an
arena instead of a cover-density parameter: **an arena is a PLACE with a shape
that makes one plan better than another.** A drainage wash you fight along the
bottom of. A parking structure with one ramp in. A casino loading dock with a
single choke. A motel court with two floors of walkway looking down into it.
Those are arenas. Mine are a field with rocks on it.

**But I am not going to build a fourth version of an arena on a guess.** STOP
PRODUCING names writing a fourth version of anything as the tell that the attempt
already failed, and this would be the fourth. The next arena work starts from him
telling me what he means, and it is the first thing in WHAT I NEED FROM YOU.

---

## 4. COMPANIONS AND SNEAKING: SCOPED, NOT STARTED

> "i want to start working on combat mechanics for companions and sneaking before
> combat is in full swing too"

Recorded as the lane's next direction. Two features, and the second one is the
bigger change:

**SNEAKING / BEFORE THE FIGHT.** Today an encounter begins with everyone already
aware and already placed. There is no approach, no detection, no state before
combat. That means every fight starts at maximum information for both sides,
which is the flattest possible opening. A pre-combat state is where positioning
matters MOST, because it is the only moment you get to choose the ground for
free. It also gives the night rule above something to be good for.

**COMPANIONS.** The occupancy law (one body per cell, including the player) and
the 120 BPM I-MOVE-YOU-MOVE grid already carry everything a second friendly body
needs. The open question is not code, it is design: does a companion take its own
turn, or does it act on yours? [PENDING Paolo]

Both are named on the board and neither is started, because he said "start
working on" and the arena question is upstream of both: a companion and a sneak
approach are only interesting on a map with a shape.
