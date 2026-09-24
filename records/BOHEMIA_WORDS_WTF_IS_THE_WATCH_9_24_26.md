# WORDS 9/24 (b) -- "WTF IS THE WATCH": HE VOTED IT UP AND STILL COULD NOT READ
# THE SUBJECT OF THE SENTENCE

**LANE** WORDS (12). **HIS BUG, AND HIS BUGS BEAT THE QUEUE** (standing duty 8).
This is not a row off the board; rule 32(g) landed between rounds and it names
words this lane shipped.

## 1. HIS WORDS, VERBATIM

On `people-one-story-three-mouths-9-22`, voted **UP**:

> **"Cool accidental story? Dont force this on me wtf is "the watch""**

Three rulings in one line, and they go to three different places:

1. *"Cool accidental story?"* -- the mechanism is liked. Nothing to do.
2. *"Dont force this on me"* -- rule 32(a). **NOT THIS LANE'S** and already
   routed: PEOPLE's first line is `[creditor waits]`, "after the first 60 s of
   play, within reach, one line, once, walk past". Measured and confirmed real
   below, handed over rather than touched.
3. *"wtf is 'the watch'"* -- rule 32(g), **NO JARGON IN A MOUTH.** Mine, entirely.

## 2. MEASURED BEFORE REWRITING, AND THE HOLE IS EXACTLY ONE FUNCTION

The sim has four trade words, and they come from `bohemia_agents.js`'s four life
archetypes: **WORKER, SCAVENGER, KEEPER, WATCH.**

A sweep of every quoted string in the walked city, comments stripped so a
post-mortem describing the bug is not counted as committing it:

```
trade words sitting inside a quoted sentence   3, and all three are comments
                                               or the wristwatch sense
                                               ("winding a watch that does not run")
run-time builders that put one in a sentence   2, both in ctRumourWho
```

**SO THERE IS ONE PLACE IN THE WHOLE GAME WHERE A JOB TITLE REACHES A MOUTH, AND
IT IS THIS LANE'S FUNCTION.** Not a class of defect spread through the corpus: one
function, four words, and **two of the four are titles the game never teaches
anybody.** "Worker" and "scavenger" are ordinary English. "Keeper" and "watch" are
not, and he named the worse of the two.

**AND THE PLATE IS NOT THE BUG.** The name plate over a speaking head reads WATCH,
and that is a LABEL, which rule 19 names as a legal home for a faceless word. The
defect is the same word used as the SUBJECT OF A SENTENCE, where the reader has to
already know it. Changing the plate is PEOPLE's system and this lane did not.

## 3. WHAT IT SAYS NOW, AND WHY EACH PHRASE IS TRUE

A trade in a sentence becomes **what that person does, in a stranger's words.**
Nothing is invented: every phrase is that archetype's own schedule, from the
comments in `bohemia_agents.js`, said in plain English.

| the sim's word | what the schedule actually does | what a neighbour says |
|---|---|---|
| WATCH | "sleeps late, out at dusk", street until 23:30 | the one out at night |
| KEEPER | "barely leaves: tends the house/stock" | the one who never goes out |
| WORKER | "off-block site job, staggered shift", gone 8 h | the one who leaves for work |
| SCAVENGER | "subsistence sweep", out twice, shelters midday | the one who scavenges |

**AND EVERY ONE OF THEM IS CHECKABLE ON A SHORT WALK, WHICH WAS NOT THE GOAL AND
IS THE BEST PART.** The Q17 school's last spec says an unmarked falsehood reads as
a BUG and gets reported as one, and that a rumour must be corroborable by going
and looking. You can go and see who never leaves their house. **You cannot go and
see a "watch".** Fixing the reading level fixed the checkability at the same time.

**THE COLLISION FORM SURVIVES, FOR THE REASON IT WAS WRITTEN.** If the speaker
wears the same plate as the subject, they say "the OTHER one out at night" --
without it, somebody out at night says "the one out at night" under a plate
reading WATCH and appears to be narrating themselves, which is the exact defect
the first version of this function existed to kill. **455 of 1,360 lines hit that
case and 0 of them came out unmarked.**

**AND THE NAME STILL WINS.** The instant the player has asked somebody's name,
`ctPersonName` returns it and none of this runs. Paolo 7/31 keeps the known-at-
start list empty on purpose, so a name is earned by asking. This is only what the
street calls a stranger, which is what it was always supposed to be.

## 4. THE PROOF

Same 1,360 lines as the frames round, on the walked city's own hop budgets:

```
lines built                    1360     dead  0
JARGON LEFT IN A MOUTH            0     <-- rule 32(g)
over the 98-character ceiling     0
"somebody" twice in one line      0
lowercase after a full stop       0
speaker wore the same plate     455     of those unmarked  0
longest / shortest            98 / 50
all six frames still reachable  saw 400, heard 102, where 369, when 108,
                                flat 61, sure 320
```

## 5. AND THE RULING NOW HAS A MACHINE, BECAUSE A LAW WITHOUT ONE IS NOT ENFORCED

A new leg on `rumours_travel_gate.js` reads **what the mouth actually said on the
glass** and fails on a job title in either line.

**IT DELIBERATELY DOES NOT DO WHAT THE LEG ABOVE IT DOES.** That older one greps
the source file for the string `the other ' + word`, which can survive a rewrite
that changed nothing and cannot tell a live rule from a dead one. This is the same
family as the ruler failures this lane keeps recording. The new leg reads output.

**MUTATION PROVED.** Put the job title back in the mouth and the gate goes
`RED: 61 passed, 1 failed`, naming both offending sentences. Restored:
`GREEN: 62 passed, 0 failed`.

## 6. WHAT I DID NOT TOUCH, AND WHY

- **"OUTFIT" STAYS, AND I CHECKED RATHER THAN GUESSED.** "Threw in with an outfit"
  worried me, because in a game where everyone dresses like a runway "outfit"
  could read as clothing. Measured: the game already uses **outfit 33 times** as
  its player-facing word for a faction, including "YOUR OUTFIT AND THEIRS ARE AT
  WAR" in the interface. It is the house word, taught by repetition, and he has
  seen it and not asked. Changing it would be inventing a term he never confirmed
  and breaking 33 other places. **Named here so it is on the record if he ever
  does ask.**
- **THE 60-SECOND RULE IS REAL AND IT IS NOT MINE.** `BARK.next` starts at zero,
  so the first tick after the player acts can speak. That is the shared bark
  scheduler, which governs every bark in the game, not only rumours. PEOPLE holds
  it as `[creditor waits]`. Their fix covers this organ for free.
- **THE NAME PLATE.** Still reads WATCH. It is a label, not a sentence, and it is
  PEOPLE's. Flagged, not touched.

## ROUTED
- **PEOPLE** -- the plate still shows the raw trade word; if he ever asks the same
  question of the plate, the four plain phrases are in `CT_TRADE_SAID` ready to be
  read. And `[creditor waits]`'s 60-second hold covers the rumour bark too,
  because they share `barkTick`.
