# THE DEFENCE IS REAL NOW: YOU CAN LOSE WITHOUT BEING TOUCHED

**8/11/26 — COMBAT lane. Finishes Paolo 8/8: "build a tutorial-tier
family-defense encounter for the cold open."**

---

## I SHIPPED THE PAPERWORK AND CALLED IT A FIGHT

Three days ago I built the cold open and wrote, in the tool's own notes, that
the whole point of a defence is a **second way to lose**: a place behind you
that they can reach. Then I shipped the paperwork and stopped.

The defence contract existed. It was never sent to the fight. Nothing in combat
ever read it, and no man walking past you could cost you anything. **It was a
duel with the word "defence" written on it.**

That is mine, it was not a small miss, and this is the actual fight.

---

## WHAT IT TAKES TO LOSE A FIGHT YOU ARE WINNING

Four things had to be true, and none of them were:

**1. THE PLACE HAS TO BE A REAL SPOT ON THE GROUND.** It is anchored to its tile
and carried by the world, exactly like a rock or a bloodstain. Step backward and
you really are between them and it. Step forward and you really have left it
open. If it just floated behind you, every step would drag the thing you are
defending along with you and there would be nothing to defend.

**2. IT HAS TO SIT SOMEWHERE HONEST.** It goes opposite the direction the threat
comes in from, six tiles out. That is read off where they already are, not
drawn by me. **I did not decide what the place is or who is in it.** The marker
says HOLD. It does not say whose house it is. That is still yours and still
empty.

**3. THEY HAVE TO ACTUALLY WANT IT.** A man who only ever duels you is no threat
to anything behind you. So they get a pull toward it, and a step aimed straight
at it, which is the move that walks them past you instead of trading shots.

**4. THEY HAVE TO BE ABLE TO GET BY YOU.** The shooters hold at 3.2 tiles so
nobody walks into your lap. At 3.2 tiles it is geometrically impossible to get
around you to something 6 tiles behind. Without one number letting a runner
brush past, this entire feature could not work while still looking like it did.

---

## MEASURED, 80 DIFFERENT ARENAS

| | result |
|---|---|
| stand there and ignore them | **77 of 80 defences LOST** |
| average time it took | 8.6 turns |
| **your health when you lost** | **100 out of 100** |
| kill them instead | **0 of 80 lost** |

**You lose at full health, having taken nothing, because they walked past you.**
That is the whole lesson, and it is the harder version of the thing you called
out on 8/8: cover is worthless if it is not between them and the thing that
matters.

The 3 that survived all had a knife man left alive. Blades run their own turn
from 7/19 and I did not touch it, because that is a locked law and 3 in 80 is
not a reason to open it. Worth knowing, not worth breaking.

---

## THE MISTAKE IN THE MIDDLE, WRITTEN DOWN SO IT DOES NOT REPEAT

My first attempt made it **worse**: 5 defences lost out of 60, and every single
man stalled at exactly 2.6 tiles from the place.

I had given them a bonus for being "committed" once they got close. Which meant
**taking the last step INTO that zone cost them the bonus they had for holding
an angle on you**, so every one of them stood one stride short of winning,
forever. I built a wall and called it a magnet.

The fix was not another number on top. It was deleting the boundary: a man who
is here for the place is not here for you, full stop, all the way in. **Measure
the thing, never stack a second number on a broken one.** That is now a gate
check so it cannot come back.

**And a duel is completely untouched.** With no place to defend, every number is
exactly what shipped this morning. The defence scales the fight; it never
rewrites it.

---

Tool: `tools/bohemia_combat_hold_the_line_patch.py`
Gate: `gates/combat_lab_gate.js`, 722 → 736 checks.

**WHERE TO SEE IT: the COMBAT tab.** The blue ring behind you with HOLD in it is
what you are defending. It turns red when somebody is nearly on it. Let them
reach it and the fight ends while you are still standing.
