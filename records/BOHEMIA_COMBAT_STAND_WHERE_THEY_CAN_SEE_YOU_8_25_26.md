# V180 — STAND WHERE THEY CAN SEE YOU (RF4-18)
### COMBAT lane, 8/25/26. The row that was cut four days ago, and the reason it came back.

---

## THE ROW

> **"WALLS ARE MECHANICS, NOT SCENERY.** Infusion-of-Storms grants +1 for ENDING A
> TURN WIDE OPEN, meaning NOT ADJACENT TO ANY WALLS — and depending on balance,
> pillar type objects may also be included in that definition. **ABILITIES READ
> THE ROOM.**"

Our own diff column, written in the teardown: *"ABSENT as a rule. Cover and LOS
are read, but nothing keys off wall adjacency or open-ness. THIS IS THE ITEM
THAT JUSTIFIES HIS INDOOR INSTINCT."*

---

## IT WAS BUILT AND CUT ON 8/21, AND THE CUT WAS RIGHT

That version paid **+1 killshot on the chain** for ending a turn wide open. V62's
per-weapon cap (pistol 8, smg 2, shotgun 2, rifle 1) swallowed it whole on three
guns of four: the readout would have promised *"out here the rifle gets one more
this turn"* and handed over nothing at all.

The record written that day named exactly what the row needed, and then the
feature was killed rather than shipped broken:

> **a reward currency that is NOT weapon-capped.**

**V176 shipped one four days later.** The finisher charge fills identically
whatever gun you are holding. So this is not a fourth version of a wide-open
bonus — it is the first version whose blocker is gone. The handoff line that
carried it forward said so in as many words: *"Revisit with the charge as the
payout. DO NOT write a third version of the wide-open bonus."*

---

## THE FIRST CONDITION WAS MEASURED AND IT WAS TOO CHEAP

**WIDE OPEN ALONE** — no stone within 1.6 tiles — is **55% of turns, 7 a fight**.
At one charge a turn that is **1.33 free finishers per fight in 16 fights of 24**,
and it would have made V176's *"you earn it by shooting"* mean nothing.

**OPEN GROUND UNDER THEIR EYES** — no stone near you AND at least one man who can
actually see you — is **34% of turn ends**. Earned. It stacks with the shooting
feed instead of replacing it.

**AND THE CONDITION IS THE ONE V179 ALREADY DRAWS.** Yesterday's rings light up
under every man who has eyes on you. This pays you for standing on open ground
while they are lit. **The information and the reward are the same thing** — which
is the difference between a rule a player can act on and a rule he has to be told
about. RF4-02 and RF4-48 again: on the field, never in a menu.

---

## WHAT SHIPPED

```js
const WIDE_OPEN_R=1.6;   /* [DIAL] how close a rock has to be to stop counting as open */
function wideOpen(){ ...no pillar within WIDE_OPEN_R... }
function eyesOnMe(){ ...any living man with seesMe(e)... }
function openGroundTick(){
  if(G.over)return;
  if(!wideOpen()||!eyesOnMe())return;
  finisherFeed();
  if(!finisherReady())setRead('OUT IN THE OPEN','they can see you, and the gun is learning something','#e8b04a'); }
function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn(); openGroundTick(); ... }
```

**NO DAMAGE BEFORE THE DIAL:** not one damage, accuracy or hp number moves.

---

## MEASURED ON THE REAL SURFACE

### 1. IT FIRES, AND NOTHING ELSE FEEDS IT
Twenty-four fights, **the trigger never pulled once** — V176's own feed is landed
shots, so with no shooting at all every charge that appears can only have come
from open ground.

| | |
|---|---|
| charge earned from open ground | **75** over 221 turns |
| feeds where BOTH halves were true | **109 of 109** |
| highest charge ever seen | **4** = FINISH_AT |

*(109 calls, 75 gains: the other 34 landed at the cap and finisherFeed refused.)*

### 2. BOTH HALVES BIND, CAUSALLY

| control | charge earned |
|---|---|
| nobody alive to look at him | **0** |
| every rock off the lot (always open) | **95** — 0.572/turn against 0.339 |

### 3. IT IS PAID FOR, AND THE GROUND IS AVOIDABLE

| | at least one gun can reach you | share of all turn ends |
|---|---|---|
| open ground under their eyes | **56%** | **34%** |
| every other turn | **17%** | 66% |

### 4. IT MOVES A REAL FIGHT
For a player who shoots, same boards, one predicate stubbed off in the control:

| | finisher comes up | around turn |
|---|---|---|
| with it | **92% of fights** | **4.5** |
| without it | 50% | 8.3 |

---

## THREE MEASUREMENTS DIED BEFORE THESE ONES, AND EACH DIED DIFFERENTLY

**SAMPLING THE WRONG MOMENT.** The first run classified each turn by reading
`wideOpen()&&eyesOnMe()` **before** the move, and reported that 22 of 75 charges
came from nowhere. The tick runs at turn **END** — which is the row's own wording,
*ending a turn wide open*. Fixed by wrapping `finisherFeed` and recording the
state at the instant of the call.

**A CONTROL THAT WAS VOID.** The first control buried a rock under the player's
feet so `wideOpen()` could never be true. Pillars are stored **relative to the
player** and travel with him when the world shifts, so the rock walked away on the
first step. It read 68 charge and proved nothing.

**A FUNCTION CALLED WITH AN ARGUMENT IT DOES NOT TAKE.** An arm comparing an
open-runner bot against a rock-hugger bot read **3.2 against 3.16** — identical.
`exposedToMe()` **takes no argument and returns an array**, so `exposedToMe(e)`
is truthy every time and that column was counting living men, not guns. And even
corrected, comparing two bots is the wrong shape: hp-per-turn came back
**backwards twice**, because a turn spent open is also a turn spent *walking
away* while a tucked turn is one men spend closing on you. The honest question is
conditioned on the **state**, not on which bot is driving.

**AND THE RATIO IS NOT THE CLAIM.** Guns-per-turn came out 4.29x on one run and
7.11x on the next, on a denominator smaller than one gun. *"How often is at least
one gun on you"* read 50 against 13, then 50 against 9, then 56 against 17. **A
better statistic, never a looser threshold** — fifth time this session.

---

## THE MUTATION TESTS FOUND TWO REAL DEFECTS IN WHAT I WROTE

Four mutations, run against the full browser gate. Two were caught. **Two were
not, and both survivors were my bugs, not the test's.**

**`nocap` SURVIVED — A DEAD TERM.** openGroundTick re-checked `finisherReady()`
itself. Deleting that check left **the entire gate green**, because `finisherFeed`
already refuses to fill past the threshold and the readout below already asks the
same question. A term that changes nothing is **the MEDIC_SHY defect**, caught
this time *before* it shipped instead of a week after. It came out. The cap is
V176's and V176 gates it.

**`wide` SURVIVED — A MISSING HALF OF THE CLAIM.** Winding `WIDE_OPEN_R` from 1.6
down to 0.8 or 0.2 left every arm passing. Measured across the dial:

| WIDE_OPEN_R | share of turns that qualify | guns on you on the OTHER turns |
|---|---|---|
| 0.2 | 48% | **0%** |
| 0.8 | 50% | **0%** |
| **1.6 (shipped)** | **35%** | 13% |
| 2.4 | 18% | 24% |

At 0.8 the state covers half of every fight **and there is no safer place left
that does not also pay** — every turn with a gun on you is an open turn. The rule
would still have fired and would have stopped being a decision. So the dial is
load-bearing, and a new arm asserts the ground is **avoidable**: open ground is a
minority of turn ends. Both mutations are now caught, along with `noeyes`,
`nowide` and `unwired`.

---

## AND A FLAKY GATE THAT MORE EVIDENCE COULD NOT FIX

V178's real-gun arm went red. **It was not V180** — A/B against the previous build
swung the same way (peak 2 with 2 hits in 30 on one run of the *old* file, peak 4
on another). This arm had already been widened 14 shots → 30 for exactly this
reason and it was still flaky, because **a blind timed click lands at an arbitrary
point in the dial's rotation** and the claim being made is about REACHABILITY,
which dial luck has no business deciding.

**Fixed by giving it a steady hand, not more shots.** The arm now presses the real
`#fire` when the dial is actually on target — pointerdown **and pointerup**, on
the shipped element, through the shipped handler, into the real `fireNow` with
V32's coin in place. Nothing is simulated. The first write dispatched pointerdown
alone and read a clean zero across four runs: **the shot fires on the release.**
Four runs since: peak 4 of 4, every time.

---

## WHAT THE GATES SAY

- `fight_moves_you_gate.js` — **89 pass / 0 fail** (was 83), five new V180 arms
- `combat_lab_gate.js` — **925 pass / 0 fail** (was 918), seven new V180 claims
- Mutations `noeyes` / `nowide` / `unwired` / `wide` — **all four caught**

Two existing claims were re-pointed, both for structure and neither for outcome:
V136's ordering anchor outgrew a 40-character window for the third time (widened
to 120), and V180's own no-second-cap claim was **negating a string that belongs
to V176's finisherFeed** — a checker that cannot tell somebody else's line from
your own is the broken one, and it is now scoped to the function body.

---

## WHERE HE FINDS IT

**COMBAT tab.** Walk out from behind the rocks while men have eyes on you (the
bone rings V179 shipped under their feet) and the readout says **OUT IN THE OPEN**
while the finisher charge climbs. Four charges and the next perfect killshot skips
the coin.

**RF4-18 moves SPECED -> BUILT.**
