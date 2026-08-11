# THE GUNS MOVE NOW

**8/11/26 — COMBAT lane. Answers Paolo 8/8: "right now kinda just feels like I
could stand still and kill everybody right now it's kind of weird."**

---

## HE WAS RIGHT, AND IT WAS ONE LINE

There was exactly one piece of code in this whole game that ever moved a man
with a gun, and it started with this:

```js
if(e.gcov)continue;
```

Translated: **once a shooter finds a rock, he never moves again for the rest of
the fight.** Not toward you. Not around your cover. Nowhere. Every gunman on the
board jogged to the nearest bit of stone one time and then stood there like a
lamp post until you shot him.

So standing still was not a bug in the difficulty. It was the correct play, and
it was correct because nothing in the game had ever had a reason to make you
leave your tile.

**The game already knew how to do this and only did it for knives.** The melee
turn has advanced blades toward you every single turn since 7/19. Only the guns
were nailed down.

---

## WHAT THEY DO NOW

Every turn, each shooter looks at every tile he could walk to and takes the best
one, or stays put if none of them beat standing there. Three things are worth
moving for, in the order a real person would weigh them:

**1. GETTING AN ANGLE ON YOU.** Worth the most by a mile. A shooter you are
covered from does not have a reduced chance to hit you, he has *no* chance at
all, so walking eight feet sideways is the single most valuable thing he can do
with his turn. This is the one that makes the tile under your feet go bad while
you stand on it.

**2. GETTING CLOSER.** Worth exactly what the game already says it is worth, and
that is not a figure of speech: the code asks the same range function the enemy
volley asks, so nobody can disagree with anybody about how far is far.

**3. ENDING UP BEHIND SOMETHING.** A move that finishes behind cover beats the
same move finishing in the open, so they go rock to rock instead of jogging
across the lot like idiots.

**Half the line moves, the other half shoots.** That is how it actually works and
it is also the difference between pressure and noise. If all eight men slide
every turn, it reads as a mob. The men with the most to gain bound; the rest
hold their angle and fire.

**They are shooters, not blades.** They stop at a shooter's distance. Nobody
walks into your lap. That is what melee is for.

**Nobody gets two moves.** A man caught in the open still runs for stone first,
and if he did, he is done for the turn.

---

## MEASURED ON THE REAL BUILD, NOT ASSERTED

**120 different arenas**, 6 turns each, player standing perfectly still the whole
time. Average 6.27 guns per fight:

| | turn 0 | after 6 turns of not moving |
|---|---|---|
| guns you are COVERED from | 1.86 | **0.78** |
| average range | 10.35 tiles | **7.74 tiles** |
| guns with a clean line on you | 4.41 | **5.49 of 6.27** |
| damage per volley coming at you | 83.2 | **120.7 (+45%)** |

**In plain words: stand still for six turns and you lose more than half the
cover you had, they walk two and a half tiles closer, nearly every gun ends up
with a clean shot, and the incoming goes up by about half.** Move and you reset
it. That is the whole point.

Safety numbers from the same run: 1.65 men move per turn (never the whole
board), the longest single step was 1.83 tiles (the cap, so nobody teleports),
**0** men ended up standing inside a rock, **0** got closer than the standoff.
Zero errors.

**A CORRECTION, BECAUSE THE FIRST NUMBERS I TOOK WERE NOT REAL.** The first pass
ran 120 samples and reported clean whole numbers like "3.00 guns" and "5.00
guns", which is not something 120 random arenas do. The arena dice are seeded
once per page load, so every one of those 120 arenas was **the same arena
measured 120 times.** The table above re-seeds before each one and is 120
genuinely different fights. The direction and the size of the effect held up;
the precision did not, and a number I cannot stand behind is worse than no
number.

---

## WHAT IT DOES NOT DO

- It does not touch damage numbers. He ruled there is no room to grow there.
- It does not steal the damage readout. "RETURN FIRE, 3 of 5 hit you" is the
  most important thing on screen, so the movement notice grows the small line
  underneath it in that line's own colour instead of replacing it.
- It does not decide anything he reserved. This is behaviour, not content.

---

## WHY THIS DID NOT COME WITH A QUESTION

Paolo 8/11, LOCKED: *"IF IT MAKES THE GAME FUNNER AND REALISTIC DO IT."*

**Funner:** your position stops being a puzzle you solve once and starts being
one you have to keep re-earning.
**Realistic:** nobody in a real gunfight stands behind the same rock at forty
metres for six minutes. They bound, they flank, they close, because being closer
is the biggest thing you can do to hit a man.

Both keys turned. There was never a question there.

Law: `laws/BOHEMIA_ADDENDUM_STOP_ASKING_IF_IT_IS_FUNNER_AND_REAL_DO_IT_8_11_26.md`
Gate: `gates/no_bullshit_questions_gate.py`
Tool: `tools/bohemia_combat_they_come_for_you_patch.py`
Gate: `gates/combat_lab_gate.js`, 713 → 722 checks.

**WHERE TO SEE IT: the COMBAT tab.** Start a fight, hold your ground on purpose,
and watch the men who cannot hit you walk around the thing that was stopping
them.
