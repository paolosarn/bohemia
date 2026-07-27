# BOHEMIA ADDENDUM — WHAT COMBAT IS FOR (7/27/26, LOCKED)

Paolo, asked what actually makes a fight fun for him. VERBATIM, and this is the
north star every combat decision is measured against from now on:

> "the strategy choice to deal the most damage and take the least amount of damage
> by positioning and abilities and deeper understanding of mechanics. gameplay.
> feeling snappy and violent and human and fun."

---

## 1. THE SENTENCE, BROKEN INTO ITS PARTS

**THE CHOICE:** maximise damage dealt, minimise damage taken. That is the
optimisation the player is actually solving, every turn.

**THE THREE LEVERS, and there are exactly three:**
1. **POSITIONING** — where you stand
2. **ABILITIES** — what you spend
3. **DEEPER UNDERSTANDING OF MECHANICS** — what you know

**THE WORD "GAMEPLAY", said on its own.** It is there because the turn before it he
killed a presentation idea. It means: the thing must be something you DO, not
something you are shown.

**THE FEEL:** snappy, violent, human, fun. Four words, and "human" is the one that
is easy to drop and hardest to earn.

---

## 2. THE TEST EVERY COMBAT ITEM NOW PASSES OR DIES

**DOES IT CHANGE HOW MUCH DAMAGE I DEAL OR TAKE, THROUGH POSITION, SPEND, OR
KNOWLEDGE?**

If no, it is not a combat feature. It may still be a good thing — feedback, art,
sound, readability all matter — but it does not go on a combat pick-list and it
never leads one. This supersedes nothing; it sharpens the rule left by the tally
kill (`records/BOHEMIA_TALLY_KILL_7_27_26.txt`), which said the same thing in the
negative: *if it does not change a decision the player makes, it is not a mechanic.*

---

## 3. WHERE THE GAME ACTUALLY STANDS AGAINST IT (measured 7/27/26)

Full audit with source references:
`records/BOHEMIA_COMBAT_AUDIT_AGAINST_THE_NORTH_STAR_7_27_26.md`

**TAKE THE LEAST DAMAGE BY POSITIONING — IMPLEMENTED, STRONGLY, BUT BINARY.**
Cover is geometry: a pillar on the line to a shooter removes that shooter from the
return volley entirely. Not a modifier. **0% or 100%.** Distance is a real curve on
top of it: enemy accuracy runs `0.97 - distT*0.60`, so 0.97 at point blank down to
0.37 at long range, a 2.6x swing.

**DEAL THE MOST DAMAGE BY POSITIONING — NOT IMPLEMENTED AT ALL.**
A kill-band press applies `KILL_DMG = 100`, flat, from anywhere on the map. There
is no flank, no angle, no closer-is-deadlier, no positional damage term of any
kind. Range touches only *which needle pattern you get* (`distPkg`), never your
output. **Half of Paolo's sentence has no code behind it.**

**ABILITIES — SEVEN VERBS ON THREE PIPS.** Move, dash, vault, sprint, suppress,
shove, grenade, plus wait and hand-peek. Stamina is 3, regenerates 1 per unspent
turn, and a stamina move costs no turn (Paolo 7/26, LOCKED). The spend decision is
real — but every one of those verbs is about MOBILITY or DENIAL. **None of them
increases your damage.**

**DEEPER UNDERSTANDING — PRESENT, AND THE STRONGEST LEG.** Needle patterns per
enemy and range, band widths that widen with steady aim and with a streak, per-
weapon lethality gates, cover geometry you can read off the board, enemy cycle
timing. There is a lot to learn. Most of it is unlabelled, which is a legibility
problem, not an absence.

---

## 4. THE ONE THING THIS IDENTIFIES

**POSITION CONTROLS WHAT YOU SUFFER AND NOTHING ABOUT WHAT YOU DELIVER.**

That asymmetry is why moving reads as defensive housekeeping rather than as
offence. Every tactics game Paolo would name as fun makes the ground itself an
argument for attacking from somewhere specific. Bohemia currently makes it an
argument for hiding.

**WHAT SHAPE THE ANSWER TAKES IS PAOLO'S CALL.** Flanking, elevation, point-blank
lethality, exposure windows, angle-of-fire — each is a different game. Mechanism is
mine; the ruling is his. Nothing is built and nothing is pre-selected here.

Second, smaller, and also his: **cover is binary, so "where do I stand" collapses
to "am I behind stone, yes or no."** A gradient makes a thicker decision than a
switch. Whether cover should have degrees is a design ruling, not a bug.

---

## 5. THE MACHINE GATE

`gates/combat_lab_gate.js` section 23 asserts the audit is TRUE OF THE LIVE CODE,
not just true when it was written: the damage constant, the accuracy curve, the
distance band edges, the binary cover predicate, the stamina ceiling, and the fact
that **no positional term multiplies player damage.** Change the model and the gate
fails, which forces the audit and this addendum to be brought back into line the
same turn.

That last check is the important one. It is a machine that will tell us the day
this document stops being true.
