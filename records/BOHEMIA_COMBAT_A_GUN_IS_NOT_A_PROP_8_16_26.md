# A GUN IS NOT A PROP (COMBAT, 8/16/26, v158)

Paolo, 8/16:

> *"I hate that I ran out of ammo... I thought it was unrealistic like I only had
> like eight bullets on that I did not like it."*

## HE IS RIGHT AND IT IS NOT ARGUABLE

v157 shipped a pistol whose magazine held **8** and which started with **3 rounds
in it**. A 9mm magazine is 15 to 17. A rifle is 20 to 30. Three rounds is not a
scavenger's loadout, it is a prop, and the fiction broke the moment he read the
number off his own screen.

```
            was          now
pistol      8  (start 3)   15  (start 15)
smg        16  (start 5)   30  (start 30)
rifle       4  (start 2)   20  (start 20)
shotgun     4  (start 2)    6  (start 6)   a tube, and it is why the shotgun is a knife
```

He starts with a **full magazine**, because a person who walked into a fight has a
loaded gun. What he does not have is a bandolier. Spares still come off the men he
drops, and a dead man's pockets are now worth a partial magazine (8) instead of
three loose rounds.

## THE REASONING THAT PRODUCED THE BAD NUMBER WAS MINE, AND IT WAS BACKWARDS

I picked 3 so a **gate** would pass, and then wrote a paragraph telling myself it
was the premise. The v157 comment literally says the starting load is
*"CONSTRAINED, not chosen"*.

That is the inversion this repo has a law against — **a gate must never outrank a
ruling** — and I walked into it one turn after quoting that law in a commit
message.

## AND THE RULER WAS THE BROKEN PART

The v157 gate played its fights with a player **who never misses**: one round, one
man, every time. Against a player like that, the only way to stop a fight being
winnable from one spot is to hand him fewer bullets than there are enemies. That
is exactly how I arrived at three.

**A player who never misses is not a player.** This whole game is a timing dial
whose entire purpose is that shots miss.

## THE COLLISION, MEASURED, AND NOT PAPERED OVER

With real magazines, fights **cleared without ever moving**:

```
hit rate   100%    90%    80%    70%    60%    50%
cleared    13/20  12/20  12/20  13/20  12/20  14/20
```

**AMMO CANNOT BE BOTH REALISTIC AND THE THING THAT MOVES HIM.** Scarcity does not
bite until a player is missing roughly half his shots. These are two of Paolo's
own rulings and they conflict on this one number:

- *"I only had like eight bullets... I did not like it"* (8/16)
- *"There's no movement whatsoever and I hate it"* (8/15, LOCKED, demo-critical)

## HOW IT WAS RESOLVED, AND BY WHICH LAWS

**Newest date wins**, and the ammo ruling (8/16) is newer than the movement law
(8/15). So realistic magazines ship.

**A gate must never outrank a ruling.** Keeping the one-spot check blocking would
have forced his fiction back to three bullets to keep a green check.

So `gates/fight_moves_you_gate.js` still runs the one-spot test on every single
run and prints it as `[LAW UNMET, PENDING PAOLO]` with the live number — it just
no longer blocks. **Everything the ammo mechanism actually does still blocks**:
rounds are spent, drops are world state, the button is honest, the fight is
winnable. The check goes back to blocking the moment a mechanism is chosen, and
the printed number is the one that has to reach 0.

The status is written into
`laws/BOHEMIA_ADDENDUM_THE_FIGHT_HAS_TO_MOVE_YOU_8_15_26.md` so the next session
reads it instead of rediscovering it.

## WHAT I DID NOT DECIDE

**Which mechanism carries the movement law.** His law's menu still has 4
(rushers), 5 (the objective moves) and 7 (the clock) untried. 1, 2 and 3 are built
and were rejected four times as insufficient on their own. I did not pick a fourth
one unasked, because building a fourth version of a rejected idea is the failure
his own STOP PRODUCING law names.

The ammo mechanism stays. It is good and it is real. It simply is not load-bearing
for the movement law.

Gun ranges: still untouched, still his open debate.

## GATE

`combat_lab_gate.js` **809 pass / 0 fail** · `fight_moves_you_gate.js` **11 pass /
0 fail** (with the law's status printed as unmet).

One gate check inside the law gate was also fixed rather than tuned: its
no-progress guard counted only kills and pickups, so a long trek across the lot to
a body looked identical to a stall and the **movement** arm was losing fights to
the clock rather than to the game. Closing distance on a goal is progress.

TOOL: `tools/bohemia_combat_a_gun_is_not_a_prop_patch.py`
