# YOU CAN DIRECT A QUEST NOW
## VAMILY round 28, QUESTS lane, row [edit quests] DIRECT-COVERS-QUESTS
### 9/12/26, chat 19 QUESTS (held by the DYNASTY chat, dynasty-vamily-w4yxiz)

---

## THE LAW THIS ANSWERS

Paolo, 8/11, in `laws/BOHEMIA_ADDENDUM_HE_MUST_BE_ABLE_TO_DIRECT_8_12_26.md`:

> **"Bro this is the same fucking problem we had with the questing shit!
> I CANT DIRECT QUESTS OR CUTSCENES RN WTF IS WRONG WITH YOU."**

The law names eight verbs for anything ordered (a scene, a quest, a conversation):
SEE, ADD, DELETE, MOVE, RETARGET, RELOCATE, PLAY IT IMMEDIATELY, KEEP IT. And it
names one test:

> "where does he change this himself? If the answer is 'he tells me and I edit a
> file', the system is not shipped yet."

## MEASURED ON THE REAL ALPHA BEFORE A LINE WAS WRITTEN

A cutscene got all eight. A quest got five and a half.

| verb | cutscene | quest, before |
|---|---|---|
| SEE | yes | yes, 57 rows |
| ADD | yes | words only: LINE, CHOICE, JOURNAL |
| DELETE | yes | yes |
| MOVE | yes | yes |
| RETARGET | yes | a choice's route only |
| RELOCATE | yes, 1142 bytes of controls | **nothing. 0 bytes.** |
| PLAY IMMEDIATELY | yes | **"Quests do not play in here yet"** |
| KEEP | yes | yes |

Two of the three gaps were in the alpha's own words. `dirWhere()` opened with
`if(DIR_MODE!=='cutscene') return;`. `dirPlay()` printed the sentence above.

And the third gap was the biggest: the ADD row offered LINE, CHOICE and JOURNAL, so
**the half of a quest that decides how it ENDS was not in the tab in any form.** Is
this ending a COMPLETE or a FAIL? How loud was it (his own 7/21 ruling: clout rides
HOW you resolve it)? What does it pay (shipped 9/11)? For all three, the only
channel he had was telling me, which the law calls not-shipped by name.

## *** AND THE REASON WAS HONEST, WHICH IS WHY THE FIX IS WHAT IT IS ***

The old row reader said so about itself, in its own comment:

> "Deliberately not a full parser -- a director does not need @DO effects, and
> pretending to edit something that DOES NOT ROUND-TRIP would be worse than not
> showing it."

That was the right call with a lossy reader. So the fix is not to show more of a
lossy thing. **It is to make the rows lossless, and then everything else is
allowed.**

`engine/bohemia_direct_bq.js`: one row per source line, each carrying its own line
verbatim. An untouched row gives back the bytes it came from, so a file nobody
edited round-trips byte-identical BY CONSTRUCTION rather than by care. A row he has
edited is rebuilt from its fields.

The quest array in the alpha now carries **his source**, not a generated copy of
part of it, and the rows are parsed in the browser by one parser. Nothing to drift,
nothing that cannot be written back.

## WHAT HE CAN DO NOW

- **THE STAGE IS A CONTROL.** Three pickers on every stage: does it end the job
  (COMPLETE / FAIL / neither), how loud it was (his four clout words, a picker over
  canon and never a free text box that could invent a fifth), and what it pays (one
  of his three, or nothing). EVERYTHING COSTS ONE, so the amount is not a control.
- **+ STAGE and + OBJECTIVE.** He could add words to a quest and never add a way for
  it to end. The next stage number is read off his own file, so adding one to a
  quest whose stages are 10/20/30/31 lands at 32 and not at 5.
- **RELOCATE, HONESTLY.** A cutscene has a room. A quest does not: its people are
  `@ROLE`s cast at runtime and where it happens IS the condition on the role. Giving
  a quest a room picker would have been inventing a field the language does not
  have. The role's condition is the control: on this block, another block, in the
  family.
- **AND IT PLAYS.** In the tab, through the SAME parser and the SAME runtime the
  city plays it with. Not a preview: his rows are written back to `.bq` text, parsed,
  started, and walked with pressable options. If it disagrees with the game, the
  game is what is wrong.

## THE BUGS I MADE, BOTH CAUGHT BY FOLLOWING THE ARTEFACT

1. **I called `load()` and read `view()`.** A runtime that has not been STARTED
   returns `{ended:true}`, so his quest would have opened on the words "It ends
   here" every single time, and the quest would have been fine. A runtime needs
   `start()`, then `available()`, then `begin()`.
2. **I chose options by screen position.** `view()` drops the options whose gate
   does not hold, so the fourth thing he can see is often not the fourth option in
   the file. Choosing by position would have quietly pressed a different line than
   the one he tapped. It passes the option's own index now.

## THE CHECK THE NEGATIVE CONTROLS EARNED

`gates/direct_quests_gate.js`, **37 passed, 0 failed**, registered the same round.

It holds that every quest rebuilds byte-identical, and that a FORCED rebuild of
every line of every quest still parses and validates at zero errors and zero
warnings.

**Then a mutation proved that was not enough.** Deleting `COMPLETE` from a stage
produces a stage that is still perfectly legal `.bq` — so the validity check stayed
green while the rebuilder was quietly throwing away whether the job succeeded, and
only an unrelated check about the clout tag noticed.

A rebuilder that loses meaning without losing legality is the worst possible failure
here: his file comes back looking fine and playing differently. So the gate now
compares the rebuild to the original for **what it means** — same stages, same
outcomes, same clout tags, same effects, same routes — through the real parser,
quest by quest.

| mutation | caught by |
|---|---|
| make the rows lossy again | 1a, 0/42 byte-identical |
| drop a stage's outcome | **2b (meaning)**, 3c |
| drop an option's route | 2a, 2b |
| make PLAY run the shipped quest | **R12**, R13 |

## RULE 7

In the workshop and in the demo, driven on the real alpha: the tab opens, the stage
pickers are there, ADD covers stages and objectives, an untouched quest still is his
file on the surface, a quest plays with pressable options that walk, his edit reaches
the thing that runs, and a quest he breaks is reported in the machine's own words
rather than repaired.

Build stamp: **BUILD 9/12h - YOU CAN DIRECT A QUEST**.

## WHAT IS STILL HIS

The tab does not make decisions and does not invent canon. What he builds with it IS
the ruling, which is NOTES ARE RULINGS with a steering wheel attached. Every word it
puts in a new row is a placeholder he overwrites.

