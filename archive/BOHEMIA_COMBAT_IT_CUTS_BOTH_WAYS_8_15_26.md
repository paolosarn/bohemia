# IT CUTS BOTH WAYS, AND THE OPEN HAS TO BE CROSSABLE

**8/15/26 — COMBAT lane. Paolo: "so what I'm the only one that gets affected by
this... that's not fair. second being out in the open in this game for more than
two turns like you will die so like I'm trying to make this fun."**

---

## 1. THE UNFAIRNESS WAS NOT A DESIGN POSITION, IT WAS LAZINESS

Cover decay ran on exactly one code path: the enemy volley, where the stone that
stopped *their* round was already sitting in a variable. So only **his** cover
ever degraded. I wired the easy half and shipped it.

**Their cover takes it now too** — his shot that a man's stone eats chews that
stone, same rule, same numbers. Rock to rock, both directions.

## 2. HIS SECOND POINT BREAKS MY OWN FEATURE, AND HE SPOTTED IT IMMEDIATELY

> "being out in the open for more than two turns, you will die"

If that's true — and it is — then **destroying his cover isn't a prompt to move,
it's a death sentence.** Cover decay only works as a mechanic if crossing open
ground is survivable. On its own, last turn's change made the game *worse*.

**So the open becomes crossable the honest way: a moving man is hard to hit.**

This game has never once rewarded movement. Standing still and sprinting across
a lot presented **the same silhouette** to every gun on the board — which is
false to life, and is exactly why camping wins. Now moving costs every gun a
third of its accuracy against you.

Not a shield, not a dodge stat. The difference between shooting at a man and
shooting at a man who is running. It turns both his complaints into one answer:
**cover decays so you must move, and moving is survivable because moving is the
point.**

## A LAW I ALMOST BULLDOZED

The gate stopped me twice, correctly. Difficulty must **divide the miss, never
multiply the hit** — otherwise two difficulty tiers land on the same clamp and
become identical, which is a bug that shipped once already. And `threatMult` must
be read in exactly one place.

My first cut broke both. The version that shipped keeps the difficulty term
byte-identical and applies the movement modifier after it, downward only, so the
clamp failure remains impossible. **The law was intact; only the string pin was
stale** — and I re-pointed the pin rather than the law.

## STILL OPEN, AND YOURS

**The range system.** You said it plainly: *"this isn't the final range version."*
Agreed, and **nothing here touches it.** You opened a debate and the numbers are
yours — my ideas are in the reply, not in a commit.

**The killshot chain ignoring your facing.** Still owed, still next.

Tool: `tools/bohemia_combat_it_cuts_both_ways_patch.py`
Gate: `gates/combat_lab_gate.js`, 779 → 781 checks.

**WHERE TO SEE IT: the COMBAT tab.**
