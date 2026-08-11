# RUN RUNS NOW, IN THE DIRECTION YOU TAPPED

**8/12/26 — COMBAT lane. Answers Paolo: "I NEED YOU TO FIX THE RUN BUTTON BRO
BECAUSE IT KEEPS TRYING TO SNAP ME TO COVER LIKE 5 TILES AWAY AN IT PREVENTS ME
FROM RUNNING IN A CERTAIN DIRECTION AND ITS SO CONFUSING BRO"**

---

## YOU WERE DESCRIBING EXACTLY WHAT I BUILT

RUN had **one** behaviour: look for a rock inside a 45° wedge of the direction
you tapped, out to **six tiles**, and take you all the way to it.

**That is the snap.** You tap a direction meaning "go that way" and you get
hauled five tiles to a rock you never aimed at, because the rock happened to be
in the wedge. The direction was being used as a *hint for choosing a
destination* instead of as the thing you actually asked for.

**And that is why directions went dead.** Once it found cover down a line, every
other path out of the function was a refusal:

- too close → ALREADY ON IT → you don't move
- another rock near the stopping point → BLOCKED → you don't move
- a body near it → SOMEBODY IS THERE → you don't move

So a direction with a rock in it could be **completely unusable** while the open
ground right beside it was fine, and nothing on screen told you why.

I wrote a cover-seeking verb and put it on a button labelled RUN.

---

## THE RULE NOW: THE DIRECTION IS THE INSTRUCTION

You go the way you tapped, as far as the line is clear, stopping short of the
first thing in the way. Up to 3 tiles.

- **It never moves you to something you didn't aim at.**
- **A direction can't go dead because of something five tiles away.** The only
  refusal left is that the very first tile is blocked — and that's a fact about
  the world you can see, not a rule you can't.
- **One word to learn.** Every refusal is BLOCKED and every one means the same
  thing: something is right in front of you that way. NO ROOM and SOMEBODY IS
  THERE were two more phrases for the same fact.

**What survived, because it was right:** the vault. If the thing directly in
front of you is duck-height, running that way means going over it. That's the
only special case now instead of one of four.

**Your two-pip number survived honestly.** It was your ruling on "running to
cover" — and cover-running is gone, so the cost rides distance instead: one tile
is one pip, a real run is two. Ending up behind cover is a reward for aiming
well now, not a teleport and not a surcharge.

## MEASURED, 960 TAPS ACROSS 120 ARENAS

| | |
|---|---|
| moves that went somewhere other than where you tapped | **0** (max deviation 0.00 tiles) |
| average run | 2.68 of 3 tiles |
| taps that did nothing | 106 of 960 (11%) — **all of them** "something is right in front of you" |

Under the old RUN a direction could die because of a rock five tiles away that
you had no way of knowing about. Now the only thing that stops you is something
you can see, standing right there.

## AND I FIXED A BROKEN CHECK OF MY OWN, THE SECOND TODAY

A gate assertion "no run ever lands on a body or in a wall" was implemented by
**counting how many times the words OCCUPANCY LAW appeared in a comment.** This
change deleted two branches that carried the comment while keeping every real
guard, so the count fell and the invariant didn't. It tests the actual guards
now. A checker that can't tell a mention from a use is the broken one.

Tool: `tools/bohemia_combat_run_runs_where_you_point_it_patch.py`
Gate: `gates/combat_lab_gate.js`, 753 → 757 checks.

**WHERE TO SEE IT: the COMBAT tab.** Arm RUN and tap any direction. You go that
way. That's all it does now.
