# THE SPOTTER (V168, 8/19/26, COMBAT lane)

**RF4-37, the other half. SPECED -> BUILT.**
**TAB: COMBAT.** Try to sprint while the SNIPER can see you.

---

## THE GAP, NAMED BY THE SPEC ITSELF

> **RF4-37 PRIORITY TARGETS ARE THE CORE PUZZLE.** *"Rather than simply blasting
> away at whichever enemy is closest the player often needs to plan a few turns
> ahead, **ignore the nearest enemies** and somehow manoeuvre himself into
> position to kill the Priority-Target **who is often hiding in the back**."*
>
> PARTIAL. `threatRank` / `threatWeight` mean priority is **computable**, so the
> information exists. **What is missing is a target worth crossing the room for.**

V167 built the precondition yesterday: every fight has exactly one sniper and he
sits on the back slot. That only guarantees somebody *is* the priority target. A
priority target who is merely the highest-damage body is not a puzzle, he is the
guy you shoot first if he happens to be convenient.

**What makes RF4's priority targets worth the trip is that they COMPOUND.** Every
example in that row is a support — a shaman placing totems, a summoner calling
allies, a healer healing. None is dangerous by damage. They are worth crossing
for because ignoring them makes the fight worse over time. That shape transfers;
the fantasy class list does not.

---

## THE FIRST VERSION WAS DECORATION AND THE MEASUREMENT SAID SO

The obvious build: give his **shout** infinite reach, so while the man on the hill
sees you, breaking line of sight from anyone else buys nothing. It reads
beautifully. Measured over 30 arenas, 12 turns of walking each:

| | turns with the whole board blind |
|---|---|
| spotter **alive** | 22.5% |
| spotter **dead** | 25.0% |
| flag **off** (what he already was) | 20.8% |

**Noise.** And the reason is arithmetic I should have seen first: a long shout
only matters when the spotter is the *only* man who can see you, and in a group
of three to six standing within eight tiles of each other, somebody else almost
always can. Killing him changed nothing because he was never the load-bearing
pair of eyes.

**A dead dial is worse than no dial**, so it was cut rather than shipped as
flavour.

---

## WHAT SHIPPED: HE DENIES YOU THE THING THE FIGHT IS ABOUT

Back to the research, which says what the man is actually **for**. A sniper on a
fixed overwatch position *"carries out surveillance… providing the team leader
with real-time intelligence"*, and such a team *"can be highly effective without
ever firing a shot."* A designated marksman *"provides overwatch and covering
fire"* and by doing so *"facilitates safe movement"* for his own side.

Read that from the other side and it is the whole feature. **The marksman's job
is to deny the enemy movement.** He is not there to kill you. He is there to stop
you going anywhere.

And movement is exactly what this fight is about now. V159 made **reaching the way
out** the win condition. V163 made a step cost your turn and the **sprint** the one
exception that does not.

> **While the spotter has a line on you, you cannot sprint.**

You can still walk — one tile, ending your turn, as always. What is gone is
covering ground *while still fighting*, which is the ground you need to reach the
door. Every turn he lives is ground you do not make.

**No damage number is touched.** His hp, acc and dmg are exactly what they were.
The whole feature is one boolean and one guard.

### Two answers, and only one of them is spelled out

| | |
|---|---|
| **put him down** | cross the room, which is RF4-37's sentence exactly |
| **break HIS line** | he lives, unharmed, and the pin lifts anyway |

The second needs no new geometry: `spotterOnMe` asks `seesMe`, which already
requires a clear line. It is **never mentioned** anywhere in the game. He will
find it the first time he puts a truck between himself and the hill, and what it
teaches is durable: **cover gives you your legs back.**

---

## MEASURED, ON THE SHIPPED `doMove`

```
the spotter has a line on him 16.1% of walking turns, in 13 of 30 fights
under the pin        sprint REFUSED, world does not move
spotter killed       sprint goes through
spotter ALIVE,
  one rock on his line   sprint goes through
```

So it bites in about four fights in ten and roughly one turn in six — a recurring
condition, not constant and not rare.

---

## THE GATES

`gates/fight_moves_you_gate.js` — **30 claims** (was 26). Both answers driven
through the real `doMove`, plus a check that the pin **bites at all**, written
because the version before this one did not.

`gates/combat_lab_gate.js` — **860 claims**. The shape, and a check that the cut
feature stayed cut.

### MUTATION-TESTED, AND ONE ESCAPED FOR AN INTERESTING REASON

| mutation | result |
|---|---|
| the `spotter` flag removed | **4 red** |
| the pin unhooked from `doMove` | **1 red** |
| the pin stops asking whether he can SEE you | **2 red** — kills answer two |
| the pin stops asking whether he is ALIVE | **green** |

**That last one is not a hole in the gate. It found a redundant guard in my own
code.** `spotterOnMe` was written `!e.dead && … && seesMe(e)`, and `seesMe`
already rejects the dead, the downed, the broken and the fleeing on its first
line. Deleting `!e.dead` changed nothing because it could never fire.

A guard that cannot fail is not caution, it is a second opinion about a rule that
already has one home — and the day the two disagree, nobody will know which is
the law. It is gone: `spotterOnMe` asks `seesMe` and nothing else.

### AND TWO HARNESS BUGS WORTH WRITING DOWN

1. **I measured the wrong thing.** `trySprint` returned *stamina before minus
   stamina after*, and V163's global SP clock refills the budget every fifth turn
   — so a sprint that succeeded perfectly read as **0 spent** because the tick
   landed on it. The game's own readout said `SPRINTED E` while my number said
   nothing happened. A step **is** the world shifting under him, so that is what
   is counted now.

2. **Tests share one page.** The V166 block opens the dial through the shipped
   `enterAim`, which leaves `G.inc` set and can arm a chain prompt, and `doMove`'s
   very first line is `if(G.inc)return`. Later tests now clear what earlier ones
   armed.

Both of these produced a red on a build where the feature worked perfectly, which
is the less dangerous direction — but both were me, not the game.
