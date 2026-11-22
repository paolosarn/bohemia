# COMBAT FOUR: THE FIGHT'S REDS ON PLUMBER 8'S ROWS 679 AND 684, ANSWERED (11/22/26)

11/22/26. PLUMBER 8's re-check (ca83c6f00, 'red alone too') filed SEE EVERY HIT red again under COMBAT THREE (row 679) and nine fight
gates red under COMBAT (row 684; three of them already struck green by PLUMBER's own re-check). COMBAT's last block is 11/6 and no
COMBAT session has committed since; COMBAT FOUR is the fight's lane now, so these are answered here. Each was run alone on main
(c18c0b2e1) first, its cause found, and fixed at the root. Rules 461, 441, 465. Ask rows 679, 684.

## 1. SEE EVERY HIT (row 679): GREEN ALONE ON MAIN
Run alone on main: 10 passed, 0 failed. The re-check ran before this lane's fix of the same round (records/
BOHEMIA_COMBAT_FOUR_THREE_REDS_ANSWERED_11_22_26.md: the leg read 'what since' by a list that stops at 40, and a shield's block was not
counted as a sound). Off the row by PLUMBER's own rule.

## 2. WEAPON SHAPES, THE SWEEP SQUARE: '1 sounds after the swing' -- THE SAME TWO CAUSES, IN ANOTHER GATE
CAUSE: the leg read the sounds since the swing as the list's length (the page keeps its last 40) and counted hit, vital, melee_hit,
hurt and miss, not a shield's block (wBlockSound, 11/18). FIX (gates/weapon_shapes_gate.js, both the shotgun's and the sledge's legs):
'since' by the page's running count (FIGHT_UI.heardAll), a block counted. MEASURED: 9 passed, 0 failed ('3 sounds after the swing').

## 3. THE FIGHT DRIVES THE MUSIC, EVERY HIT, KILL AND FALL IS HEARD: 'misses 33 of 36'
CAUSE: the three were misses a shield stopped, heard as 'block' (the sound plays only on a miss: e.hit false and wBlocked). FIX
(gates/the_fight_drives_the_music_gate.js): a miss's sound is a miss or a block. MEASURED: 10 passed, 0 failed ('misses 36 of 36 (3 of
them a shield's block)').

## 4. THE FIRST FIGHT TEACHES (three legs) AND THE LOSS IS UNDERSTOOD (THE DOWN DO NOT TALK): the veteran never spoke
CAUSE, MEASURED (a probe at the first aim): 4.7 s into the fight the opening WHY line (FIGHT SCREEN 11/14, __THE_WHY_LINE__) was still
up: it types its sentence and holds eight beats, so it is on screen until about ten seconds in, and teach() rightly waits for it ('the
fight's one sentence first'). Both gates asked for the lesson while the sentence was up: the aim, the empty gun and the cover lines
never came, and the loss gate's line never went up to be cut. The fight is right; the gates were written before the why line.
FIX: the first-fight gate aims once the why line is said and gone (as on his phone), in both of its fights; the loss gate marks the
sentence said before it asks for the line its leg is about. MEASURED: THE FIRST FIGHT TEACHES 10 passed, 0 failed; THE LOSS IS
UNDERSTOOD 15 passed, 0 failed.
FOR FIGHT SCREEN (not changed here): an aim made while the why line is up teaches nothing at that aim; the lesson comes on the next aim
after the sentence is gone. If the first aim's lesson should wait and come after the sentence, that is the teach queue's (teachSoon).

## 5. FATIGUE COMES BACK EVERY TURN, F6: '"9 AP+30" -> "9 AP+30 HEAVY KIT: BREATH HELD AT 20"'
CAUSE: rule 435(e) (__THE_WINDED_MAN_ACTS__, newer than 283(c)) put a breath floor under a heavy kit, so the gate's kit, which left no
swing under 283(c), is now held at the floor and the card says 'HEAVY KIT: BREATH HELD AT 20'. The card says it; the leg only knew the
older words. FIX (gates/fatigue_comes_back_every_turn_gate.js): the card says 'TOO HEAVY TO SWING' when even the floor cannot hold the
kit, else 'HEAVY KIT: BREATH HELD AT n' at the fight's own number; the light kit says neither. MEASURED: 8 passed, 0 failed.

## 6. EVERY MAN HAS A JOB EACH TURN, J3 AND J4: MEASURED, NOT FIXED, ROUTED
Main: J3 TUNING's crews 30 of 2839 turns parked (1.06%, the cap 1%); J4 AUTO won 153 of 300 (the floor 158, set 11/2 on rule 321's board).
MEASURED, WHAT IT IS NOT:
- not the big insides: the same 300 and 150 fights with every fight kept outside (inside: false) read the same 30 of 2839 and 153 of 300;
- not BESTIARY's new enemy types (11/18 to 11/20): the fight, its data and its tools as they stood at the parent of 17a03d648 (BESTIARY 11/18i), before the
  smoker, the darter and the grenadier, played on the same bench, read WORSE: 32 of 2738 (1.17%) and 148 of 300.
So it predates 11/18 21:27, the first commit this session's clone holds (a shallow clone), and today is better than then. A bisect needs
the history between 11/2 (the floor) and 11/18, which this clone does not have.
NOT DONE HERE: the floor is not lowered and the cap not widened (a gate made green by moving its bar is the forbidden shortcut). The
gate's own notes route the AUTO brain's points to COMBAT TWO and their weight to TUNING. FOR COMBAT TWO / TUNING: the four parked turns
named (20:OSO@r1 5->5, 32:MARISOL@r9 3->3, 32:OSO@r12 3->3, 38:RAUL@r1 5->6), 20 more in a net excused; a bisect from 11/2 on a full clone.

## SAID PLAINLY
No VOTE card: five gates' ears and clocks, nothing he sees changed (the fight is the same; the gates now read it right). No dialogue
line rewritten (465).
