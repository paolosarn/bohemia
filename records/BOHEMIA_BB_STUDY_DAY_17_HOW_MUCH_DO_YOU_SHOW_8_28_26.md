# BB STUDY — DAY 17: HOW MUCH DO YOU SHOW?
# (coordinator, on his trigger. Days 1-16: records/BOHEMIA_BB_STUDY_DAY_*.md)
# THE SECOND COLLISION BETWEEN HIS OWN TWO NAMED GAMES. Day 9 found the
# first one, about growth. This one is about INFORMATION.

## 0. THE QUESTION
A fight is only as good as what the player can see. So: **how much of the
machinery do you put on screen?** His two named tactical references answer
this in opposite directions, both are locked, and nobody has said so.

## 1. THE COLLISION, STATED
**BATTLE BROTHERS SHOWS YOU THE MATH.** Hover an enemy and the tooltip
gives you the hit chance, and the game's numbers are public and
learnable: hit chance is your attack minus their defence; **elevation is
+10% from above and -10% per level from below**; a shield adds its value
to their defence; a blocked ranged shot takes a **75% penalty**, reduced
to 50% with a perk. Players discuss it as arithmetic because it IS
arithmetic, and the community even documents where the tooltip is
incomplete (it does not account for scatter).
**ROGUE FABLE 4 DOES THE OPPOSITE, AND WE ALREADY WROTE THAT DOWN.** From
our own RF4 dossier, the designer's stated approach: the game is
*"deliberately free of stat and formula bloat, most of the critical
information presented in the world and on the field of battle itself."*
Speed is a WORD. Size is a CATEGORY. Six numbers and two verbs is a whole
monster.
**AND HIS OWN LINE SITS ON THE RF4 SIDE:** *"spreadsheet simulators and
I'm not a fan."*
**SO: ONE OF HIS REFERENCES PUTS THE INFORMATION IN A TOOLTIP AND THE
OTHER PUTS IT IN THE WORLD.** Same shape as day 9, where a Cyberpunk-style
tree and a Battle Brothers fight disagreed about growth. Both are locked.
Somebody has to write down which way we go.

## 2. THE MEASUREMENT — WE ALREADY BUILT THE ANSWER AND NOBODY WROTE IT
## DOWN
The fight has one readout line, and this is what it actually prints:
> **DARK · UNDER THE DECK · HE IS ABOVE YOU · no cover counts ·
> [RANGE TIER] · his dial: [NAME] · he hits you 62%**
Read what that is made of:
- **The world, in WORDS.** Dark. Under the deck. He is above you. The
  range as a tier, not a distance. What kind of shooter he is, by name.
- **Exactly ONE number.**
- And the line colours that number by threat: green, amber, red.
### *** AND THE NUMBER IS NOT THE ONE THE OTHER GAME SHOWS. ***
BB's tooltip answers **"what is my best move?"** — your chance to hit
him. Ours answers **"how much trouble am I in?"** — *he hits you 62%*.
**ONE IS AN EFFICIENCY DISPLAY. OURS IS A DANGER DISPLAY.**
That is not a small difference and it is not an accident of the code: it
is the correct choice for this specific game, because our whole tactical
design is about EXPOSURE. Day 3 refused cover-and-hold and named the
anti-turtle kit; V180 measured that **56% of open-ground turns have a gun
that can reach you**; the fight's own arm is *"who COULD line you up."*
**A DANGER DISPLAY MAKES THE PLAYER MOVE. AN EFFICIENCY DISPLAY MAKES THE
PLAYER CALCULATE.**
### AND THE GAME TALKS
`setRead(...)` — the plain-words line that says what just happened, with a
subtitle — is called **160 times** in the fight. NERVE BROKE, *he drops
the gun, hands up*. PLATE CRACKED, *that one is spent, 2 left*. SECOND
WIND, *the clock came round, your legs are back*. **The fight explains
itself in sentences rather than in a log of numbers**, and it keeps the
last six for a replay of the turn.

## 3. THE OTHER AISLE — WHAT A PERSON CAN ACTUALLY HOLD
- Working memory is not seven items. The modern reanalysis puts the
  realistic limit for adults at **about FOUR CHUNKS** of novel
  information, held for roughly fifteen to thirty seconds without
  rehearsal.
- The interface rule that follows is **RECOGNITION RATHER THAN RECALL**:
  make the options and the state visible, rather than requiring the
  player to remember or reconstruct them.
- And day 9's finding is the other half of the same thing: **a chunk is
  bigger for an expert.** Chess masters have ordinary memory and read a
  board in a few large learned groups. **So the same display carries more
  to a veteran than to a newcomer, automatically — IF it is made of
  things you recognise.**
**OUR LINE IS FOUR TO SIX CHUNKS, ALMOST ALL OF THEM WORDS YOU RECOGNISE
RATHER THAN QUANTITIES YOU COMBINE.** That is inside budget on the day
you start and it grows with you, which is exactly what a hundred-hour
game needs.

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
**I OPENED THIS DAY EXPECTING TO CONCLUDE "SHOW LESS".** That is the
usual lesson and it is the wrong one here. The measurement says the
opposite:
**THE ONE NUMBER WE SHOW IS THE RIGHT NUMBER, AND THE RISK IS NOT THAT WE
SHOW TOO MUCH TODAY. IT IS THAT SOMEBODY ADDS A SECOND ONE.**
Here is why the second number is the dangerous one, and it is arithmetic
rather than taste: **one number is a reading. Two numbers is a
comparison, and a comparison invites optimisation.** The moment a player
is holding "he hits me 62%" against "I hit him 71%", the turn stops being
a decision about ground and becomes a sum — which is the forty-minute
chess match he named, arriving through the interface instead of through
the rules.
**AND THE STUDY ITSELF IS THE THREAT.** Sixteen days have routed
fifty-five rows. Several of them want to say something on screen: the
heat and the pip budget (day 15), the standing web (day 1), the circuit
owner (day 6), who you owe (day 7), why your side did that (day 3's
BB-WHY), the buildup before an act turns (day 11). **Every one of those is
a candidate for a number on the fight screen, and together they would
undo the thing we already got right.**
### THE RULE THAT FALLS OUT
**WORDS FOR THE WORLD. ONE NUMBER. AND THE NUMBER IS THEIRS, NOT YOURS.**
Anything that wants to be a second number has to argue its way past that
sentence, in front of somebody, on purpose.

## 5. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** the discipline of publishing the RULES so the world is
learnable — BB is right that a hidden system cannot be played, and our
words do that job (HIGH GROUND, no cover counts, DARK) without printing a
formula; and the read line's habit of saying what happened in a sentence.
**REFUSE:** the hover breakdown; a second percentage; any per-factor
arithmetic on screen; and a stat sheet in the fight. **The tell stays on
the battlefield** (the RF4 lift, already law), and *"spreadsheet
simulators and I'm not a fan"* is his own sentence about this exact
question.

## 6. ROUTED
- **UI / COMBAT — BB-ONE-NUMBER.** Write the rule down and hold it:
  **WORDS FOR THE WORLD, ONE NUMBER, AND THE NUMBER IS HIS CHANCE ON
  YOU.** It is already true and it is undefended, which is how it will get
  lost. Any proposed second number on the fight screen argues against this
  row first. Note for the UI lane: this is a rule about the FIGHT, and the
  same logic is worth testing on the phone and the reckoning card.
- **UI — BB-READ-LINE-AUDIT.** `setRead` is called **160 times**. That is
  a lot of sentences competing for one line, and I have NOT measured how
  many a player actually sees, whether two fire in the same beat, or
  whether the important ones get overwritten by cosmetic ones. **This row
  is a measurement, not a fix** — count what actually reaches the screen
  in a real fight before anybody changes a word.
- **COMBAT — BB-NO-BREAKDOWN.** A refusal, written down so it does not
  arrive by accident: no hover tooltip that decomposes the roll into
  factors. If a factor matters it becomes a WORD in the line or a thing
  you can see on the ground. This is the RF4 lift applied to the interface
  rather than to the rules.
**RUNNING ORDER:** behind the demo, but BB-ONE-NUMBER should be read by
anybody who takes a UI row, because it costs nothing today and prevents a
rebuild later.

## 7. CONFIDENCE
- The readout line's contents, the single percentage, its threat
  colouring, and the 160 `setRead` calls: **MEASURED** in the decoded
  combat payload.
- BB's hit-chance tooltip and the modifier values (+10% elevation, -10%
  per level below, the 75% blocked-ranged penalty, shields adding
  defence): wiki and player discussion, consistent. The dev blog is
  proxy-blocked here and was NOT read directly. **MEDIUM-HIGH**, and the
  exact values are illustrative rather than something we would ever copy.
- RF4's information stance and his "spreadsheet simulators" line: quoted
  from our own RF4 dossier, which is second-hand within our repo and
  flagged as such. **MEDIUM-HIGH.**
- The ~4-chunk working memory limit and recognition-over-recall: the
  modern reanalysis and standard interface practice. **HIGH** for the
  direction; the exact number is still argued over and depends on what is
  being counted, so it is a budget, not a constant.
- §4's conclusion and §6: **MY ARGUMENT AND MY ROUTING.** The claim that
  a danger display is correct for THIS game rests on his own refusals, not
  on a general principle.

## SOURCES
Battle Brothers wiki (Hit Chance) and Steam gameplay discussion on the
hover tooltip, the attack-minus-defence formula, elevation and shield
modifiers, the blocked-ranged penalty, and the tooltip's scatter
limitation. Nelson Cowan, "The Magical Number 4 in Short-Term Memory: A
Reconsideration of Mental Storage Capacity", and the interface literature
on recognition rather than recall and cognitive load as a budget.
IN-REPO: the decoded `COMBAT_B64` payload inside
slices/BOHEMIA_ALPHA_0_9.html (the readout line, `setRead`, the exposure
percentage and its threat colours), records/BOHEMIA_RF4_ENEMY_DOSSIER_
8_25_26.md (the stat block that is six numbers and two verbs, "most of
the critical information presented in the world and on the field of
battle itself", and his "spreadsheet simulators" line),
laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md,
laws/BOHEMIA_SESSION_BRIEF_UI_8_25_26.md, and days 1-16 of this study.
