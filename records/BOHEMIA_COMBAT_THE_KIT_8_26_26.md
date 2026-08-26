# V185 — THE KIT
### COMBAT lane, 8/26/26. Six abilities, six verbs, and the verbs are the point.

---

## WHY THIS ONE

> *"I really need you to take big turns and big swings for the combat. I can't
> be... you can't just be doing one thing at a time like, bro, I really need this
> shit to look like Rogue Fable four RIGHT NOW."*

He had already ruled **a real kit** hours earlier and I had not built it. It was
the last big thing he approved that was still missing, and it is the one that
matters most:

**The bars are what you spend and lose. The kit is what you DO.** Without it,
every turn in this game is still *shoot, or walk* — which is exactly why eight
mechanics shipped across six days and none of them changed the feel.

---

## SIX ABILITIES, SIX DIFFERENT VERBS

> **RF4-13:** *"Recharge conditions are unique per item, and they are **verbs, not
> timers**. Armor-of-Repulsion recharges based on damage taken."*

| ability | recharged by | what it does |
|---|---|---|
| **PLATE UP** | **take a hit** | +1 plate. *RF4's own example, near enough verbatim.* |
| **BREAK CONTACT** | **move two tiles** | smoke at your feet; every line on you dies |
| **STEADY** | **end a turn in cover** | one shot with a much wider dial |
| **SLIP** | **put a man down** | two free tiles to the nearest stone, no pip |
| **CALL IT** | **land a shot** | the man with the best line on you puts his head down |
| **READ THE ROOM** | **end a turn wide open under their eyes** | a pip back and a turn of Power |

**A timer recharges whatever you do, so it teaches nothing. A verb recharges only
if you played a certain way** — so the kit itself tells you how the game wants to
be played.

**And the six were chosen to conflict.** Taking a hit, tucking behind stone and
standing wide open cannot all be true in one turn. **No single style keeps
everything lit.** That is the difference between depth and a bigger menu.

`READ THE ROOM` runs on V180's exact condition, so standing where they can see you
now pays twice.

---

## MEASURED ON THE REAL SURFACE

| | |
|---|---|
| abilities / distinct verbs | **6 / 6** |
| charged at the start of a fight | **0** |
| each verb charges | **only its own ability**, 1:1 |
| every verb has a real caller | **hit ✓ kill ✓ move2 ✓ cover ✓ open ✓** |
| PLATE UP spent | plates 1 → 2, then uncharged |
| an uncharged ability | refuses |
| damage before/after firing all six | **40 → 40** |
| page errors | 0 |

---

## *** ONE VERB HAD NO CALLER, AND THAT IS THE FOURTH TIME TODAY ***

The first write of this kit hooked **five** verbs and left `move2` with **none**.
`BREAK CONTACT` could never have charged in a played fight — shipped, correct, and
**structurally unreachable.**

That is the same defect as:
- **V152's `chewCover`** — zero callers possible, for months
- **V176's threshold** — set at 6 when a fight earned 5
- **V181** — five deaths in six left an empty tile

`spendMove()` is the one owner of a two-tile move (sprint spends 1 pip, dash
spends 2, both pass through), so one hook covers both. **A gate arm now drives
every verb from a real event**, so this cannot happen again quietly.

---

## NO DAMAGE BEFORE THE DIAL SURVIVES A WHOLE ABILITY KIT

Not one of the six deals damage, adds damage, or changes an accuracy number. They
**move you, hide you, pin a man, hand you a plate, widen one dial, or give back a
pip.** Every effect is POSITION, STATE or RESOURCE, and every one drives a machine
that already existed — the shipped smoke, the shipped pin, the shipped plate
count, the shipped power term, the shipped speed pips.

Firing all six back to back leaves `applyDamage` at **40 → 40**.

---

## TASTE

**A button only exists while it is charged.** The row is empty at the start of a
fight and never becomes furniture.

**And every ability is self-contained.** V122 pulled DASH and VAULT off the top
menu because they *"lived at the TOP of the screen and acted at the BOTTOM, on the
ring, with his thumb."* Nothing here asks for a direction. You press it, it
happens.

**The names are drafts.** Six real attempts he can rewrite, tagged `draft:true`,
rather than six blanks.

---

## FOUR GATE CLAIMS RE-POINTED, AND ONE WAS A REAL BUG IN THE GATE

Three were ordinary: V176's anchor gained the kit's verb on the same line; V180's
slice bound grew.

**The fourth was a genuine defect.** V175's claim prints, in capitals, *"THE CLAIM
RESTS ON THE FIRST TWO AND NOT THE THIRD, DELIBERATELY... the pull count is its
noisiest estimator"* — and then the code required the third anyway. It went red on
**15 against 14** while both load-bearing measures held comfortably (1.25 against
1.5 ignorant men, 19 rooms alerted against 9).

**The prose had learned the lesson and the code had not** — the same split that let
`tool_idempotent_gate` promise it never threw away a lane's work while a line six
below it did exactly that. The count is still printed as context; it is no longer
a veto.

---

## GATES

- `fight_moves_you_gate.js` — **104 pass / 0 fail** (was 101)
- `combat_lab_gate.js` — **931 pass / 0 fail**

---

## WHERE HE FINDS IT

**COMBAT tab.** Play a turn. When an ability charges, its button appears next to
SUPPRESS and the readout says what it is for. Press it.
