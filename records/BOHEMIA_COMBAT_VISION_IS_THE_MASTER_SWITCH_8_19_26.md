# VISION IS THE MASTER SWITCH (V165, 8/19/26, COMBAT lane)

**RF4-52, machine 4 of the nine. SPECED -> BUILT.**
**TAB: COMBAT.** Get a rock between you and them and watch the guns go quiet.

---

## WHAT HE ASKED FOR

His own spec row, off his own 83-screen capture, routed here by
`laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md` section 6. Verbatim:

> **[4] VISION IS THE MASTER SWITCH — ONE VARIABLE GATING FIVE ENEMY SYSTEMS.**
> Line of sight gates, at minimum: **ranged enemies cannot shoot without vision;
> ... aggroed enemies only shout if the player is in vision.** So a single wall
> simultaneously disables ranged damage, enemy buffing, reinforcement, healing
> and aggro propagation. *"Pick ONE variable that as many enemy systems as
> possible depend on. Then give the player tools to control that variable. You
> get combinatorial depth without writing combinatorial content."*

And the diff column, which was exactly right and is the whole job: **"What is
missing is that no enemy behaviour is gated on vision."**

---

## WE ALREADY HAD THE GEOMETRY. WE HAD NO VARIABLE.

`myConcealAgainst` has been in the combat file since **V24**, when Paolo ruled
*"it has to be a line of sight thing."* But it was only ever called at seven
scattered event sites — after a step, after a vault, after a run — each one
resetting a bead by hand. Nothing in the game could ask, as a standing question,
whether a given man can see you **right now**. So:

- the bead was set by `peeking(e)||firing(e)`, which is a man's own **cover
  animation phase** and says nothing at all about whether he can see anybody
- the press walked men at **your true position**, whether or not they had any way
  of knowing where that was
- cover-seek ran men to stone to hide from a threat they could not see
- and nobody ever told anybody else anything

`seesMe(e)` is that standing question, and it is the only authority. It asks four
things: can he look, is he on my deck, is he inside the end of his own eyes, and
is there stone in the way.

---

## THE FIVE SYSTEMS

| # | system | what losing sight costs him |
|---|---|---|
| 1 | **acquisition** | the two-turn red line now needs eyes for **both** turns |
| 2 | **ranged fire** | `exposedToMe` is the volley's pool. No sight, no shot |
| 3 | **the press** | he walks to **where he last saw you**, not to where you are |
| 4 | **cover seek** | you do not hide from a man you have lost, you go look for him |
| 5 | **the shout** | a man who **can** see you tells everyone in earshot |

The fifth is what stops "break one line and the whole board goes stupid" from
being the entire game, and it is why **the man with eyes on you is worth shooting
first**. Kill him and the callout stops.

---

## LAST KNOWN POSITION, AND THE MISTAKE IT WOULD HAVE BEEN

`e.lkp` is **world state**, anchored to its tile and carried by `worldShift`
beside the pillars, the blood, the place you defend and the way out. V137 already
wrote the reason down in this same file: *"if it moved with you, every step would
drag the thing you are defending along behind you and there would be nothing to
defend."*

A memory that travelled with the player **would be the player**, and the entire
mechanic would be a no-op that measured perfectly green. Mutation-tested: with the
memory left out of `worldShift`, three tiles of walking leave it **0.00** tiles
behind him and the gate says so by name.

---

## THE RESEARCH, AND THE ONE PLACE I DID NOT IMPORT THE CAPTURE

Last-known-position with a search is the standard documented model for what an
agent does when it loses contact: latch the LKP when the player leaves
perception, move to it, let confidence decay. Squad AI adds the other half — a
single unit alerts the others, and the alerted units get a waypoint to the last
known location. Both halves are built here. Neither is invented.

### The capture says something that is false for a gun game

> "enemies never spot a sprinting player at all"

For guns that is backwards on its face. Movement is the single thing most likely
to get you **seen**. REALISM FIRST is a locked law, so importing it as written
was not available.

**But the mechanic underneath it is real and has a name.** The **3-5 second rush**
is the US Army's individual movement technique, taught since the second world
war, and the reason for that exact window is that it is *shorter than the time an
enemy needs to see you, aim and fire.*

So the realistic form of "sprinting beats vision" is not that they go blind. It is
that **you were only up for less time than acquiring takes** — which lands exactly
on the two-turn red line this game has had since 7/19. One line of code:

> **a sprint drops every bead on the board, line or no line.**

Same outcome the capture describes, through a mechanism that is true. Walking is
untouched and still only breaks the lines you actually broke, which is Paolo's
original ruling.

---

## MEASURED, ON THE REAL FIGHT

```
at the bell across 40 arenas: 166 of 250 gunmen cannot see him
   ...and 0 of those 166 is holding a red line
a blind man with a memory:  gap 8 -> 0 tiles in 10 turns, stepping 8 of them
the same man, no memory:    0 steps in 10 turns
the shout:  a man 18 tiles out who cannot see him is told anyway
            a man 40 tiles out is told nothing
            and with the only seer DEAD, the man at 18 is told nothing
a sprint:   2 beads held -> 0
```

Two thirds of a board cannot see you at the bell. That is the approach phase, and
it is the first time it has meant anything.

### DID IT MAKE THE FIGHT SAFE? NO, AND I CHECKED BEFORE SHIPPING

Turning the guns off is exactly the kind of change that quietly deletes the
difficulty. Twenty-four fights, one fixed policy, driven through the shipped
return-fire path, against a control with the vision gating removed:

| | average HP lost | total hits taken |
|---|---|---|
| with vision gating | 4.2 | 5 |
| control, gating off | 4.2 | 5 |

**Identical.** The reason is the honest one: that policy walks straight down the
middle toward the way out, so men acquire it constantly. Vision does not protect
a player who ignores it. It rewards one who uses it. *(Small sample — 5 hits
across 24 fights is not a precise number. What it establishes is the negative:
the danger did not go away.)*

---

## AND V164'S OWN NUMBER GOT BETTER, BECAUSE THE EXPERIMENT GOT CLEANER

Building this exposed a flaw in yesterday's measurement. The V164 chase rig ran on
arenas **with their rocks in**, so once vision existed a chaser could lose sight
behind one, walk to a memory and park — and the "distance manufactured by
geometry" number stopped being about diagonals at all.

The V164 claim is about **geometry**, so its two arms must differ by the ortho
flag and nothing else. The rig runs on a clear field now:

| | shipped 8/18 (rocks in) | corrected (clear field) |
|---|---|---|
| distance manufactured | 2.28 tiles | **3.59 tiles** |
| trials where the slow one lost ground | 71 of 96 | **96 of 96** |
| steps taken, slow vs fast | 6.1 vs 6.2 of 8 | **7.3 vs 7.3 of 8** |

Same feature, unchanged code, a controlled experiment instead of a noisy one. The
real-arena arm (real roster, real rocks, a flagged body never landing on a
diagonal) is untouched and still there as the ecological check.

---

## THE GATES

**`gates/fight_moves_you_gate.js`** — 23 claims (was 15), all measured in a real
browser. Every V165 claim has a **control**, because "he moved" and "he moved
BECAUSE of this" are different sentences.

**`gates/combat_lab_gate.js`** — 844 claims (was 832). The shape, the five
decision sites counted by name, the turn ORDER (vision resolves before the bead,
or every man spends his turn acting on last turn's eyes), and a sweep asserting
**nobody rolls their own** copy of "can he see me" — one variable quietly becoming
five that disagree is the exact failure the spec exists to prevent.

Four older claims were **re-pointed**, all four for the same reason: the lines
they pinned gained the vision gate. Their claims are unchanged.

### MUTATION-TESTED, SIX WAYS, EACH PUT BACK

| mutation | result |
|---|---|
| vision gating off the bead and the volley | **red** — 153 blind men holding red lines |
| the memory left out of `worldShift` | **red** — it reads 0.00 tiles behind him |
| the press ignores the memory | **red** — the blind man takes 0 steps in 10 turns |
| the shout silenced | **red** — the man at 18 tiles is told nothing |
| cover-seek stops reading vision | **red** — the lab gate names the missing system |
| the sprint stops dropping beads | **red** — 2 held stays 2 |

**And the sprint check was not load-bearing on its first write.** With the arena's
rocks left in, the step that sprints also broke lines the ordinary V24 way, so
deleting the sprint rule entirely still measured 0 beads left and the check passed
a build that did not have the feature in it. It runs on a bare field now. Caught
by mutation testing, which is the only reason that line exists.

---

## NOT HERE, AND NOT MINE

**MANUFACTURING walls** — the spec's steam, sleep bombs and cloud walls — is a
second and larger feature, and half of it is terrain, which is WORLD's system by
the same law's section 6. The variable has to exist before there is anything worth
giving him tools to control. Flagged, not built, and the gate fails if it appears
here.

**Melee** bodies are moved by `BohemiaMelee`, a separate engine module. ONE
SYSTEM, ONE SESSION: `seesMe` is computed for them and wired into none of their
movement.
