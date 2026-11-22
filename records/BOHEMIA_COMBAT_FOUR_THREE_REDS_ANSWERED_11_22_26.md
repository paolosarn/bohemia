# COMBAT FOUR: THE THREE REDS PLUMBER ROUTED HERE, ANSWERED (BUILD 11/22 - A FLING'S BREATH IS SAID)

11/22/26. PLUMBER 8's full suite (rule 461, ask row 679) routed three new reds to this lane (filed under COMBAT THREE, the lane's old
name). Each run again alone here, its cause found, and fixed at the root. Rules 461, 313, 333, 441, 465. Ask rows 679, 651.

## 1. THE BIG INSIDES: 'timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP was killed'
CAUSE, MEASURED: this lane's own boards. Twenty insides one after another took 825 s (the gate's own clock on main, 314 legs), past the
suite's 600 s cap. Every inside adds about 40 s.
FIX (gates/the_big_insides_gate.js): with no inside named, each inside runs as a child process of the gate (the same legs, nothing
shared), four at a time (the box's cores, four at most); the gate runs the legs that are no inside's own (I0, G1), prints every child's
lines in the list's order and adds their counts; a child that does not answer is a FAIL with its name. `node gates/the_big_insides_gate.js
<id>` runs one inside in the process, as before. MEASURED: 314 passed, 0 failed in 224 s (3 min 44 s), against 825 s: the same 314.

## 2. SEE EVERY HIT, S3 THE PACK'S CAP, AND EVERY BIT SAID: 'unsaid changes 9 (c1 30->40 said 0 back 0 ...)'
CAUSE, FOUND: a BUG HE CAN FEEL. The fling (the bear's and the ground sloth's throw, Battle Brothers' unhold: 'target gets 10 Fatigue')
put its 10 straight on the thrown man (`t.fat += F.target_fatigue`), so his breath dropped with nothing said over him and past the pack's
cap (ours.fatigue_from_them_between_turns, rule 313: Paolo 11/2, 'they had an attack that took stamina away from me... I didn't like
that'). Every other blow's breath goes through `tire()`, which caps it and says it.
FIX (slices/BOHEMIA_FIGHT.html, the fling): `tire(t, F.target_fatigue, 'flung', u)`: said over him ('-10 HIT' on his card's feed, as a
shove's is), under the cap. MEASURED: S3 1156 breath events over 1828 turns, over the cap 0, unsaid 0 (was 9).

## 3. SEE EVERY HIT, P2 AIMED EAST, THEN SWUNG: '1 sounds after the swing'
CAUSE, FOUND: not the swing. The swing was heard on both men: 'swing_air block miss' (one blow stopped by a shield, one missed). The
leg counted hit, vital, melee_hit, hurt and miss, and a shield's block has had its own sound since 11/18 (wBlockSound). And its way of
reading 'what since' was the list's length, which stops growing at 40 (the page keeps its last 40).
FIX: the leg counts a block too (a blow the swing caught, stopped by a shield), and reads 'since' by a running count the page now keeps
(FIGHT_UI.heardAll, one counter beside the list in sfx(); nothing heard changes). MEASURED: SEE EVERY HIT 10 passed, 0 failed.

## 4. THE FORMATION IS KEPT [re-run alone pending]
Run alone here: 23 passed, 0 failed. Green alone: off the row by PLUMBER's own rule.

## ON THE PAGE (rule 441)
The fling's change is the fight's own rule (both pages load the same fight); S3 proves it over 30 rolled fights on the live rules, and
P1 to P6 on his phone through real taps. The changed fight page played on the demo and the alpha, upright and on its side (the
library's cells, district:library): 4 fights, all ended on AUTO, 16 of 16 tile taps, 0 page errors.

## SAID PLAINLY
No VOTE card: a gate made faster and a gate's ear are nothing he sees; the fling's breath is a line he will now read when a bear throws
one of his men ('-10 HIT'), nothing new to vote on. No dialogue line rewritten (465): the line is the feed's own, as for every blow.
