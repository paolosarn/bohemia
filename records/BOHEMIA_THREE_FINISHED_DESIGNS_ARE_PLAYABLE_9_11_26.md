# THREE FINISHED DESIGNS ARE PLAYABLE
## VAMILY round 26, QUESTS lane, row [designs playable] DESIGNS-TO-BQ
### 9/11/26, chat 19 QUESTS (held by the DYNASTY chat, dynasty-vamily-w4yxiz)

---

## THE ROW

> convert prose designs 001, 002, 013 to playable .bq; the designs are done, only
> the machine layer is missing

It was right. Three complete production designs, 738 lines between them, written
7/10 to the dialogue and scene production spec, with cast, node trees, branch
patterns, presentation passes and fold consequences all finished. Nobody could
play a word of any of them.

## WHY I SKIPPED THE ROW ABOVE IT, WITH A MEASUREMENT

[map moves] BB-TERRITORY-FLAG sits above this one. Its backlog row says it depends
on SHARED BB-LOOPLESS and WORLD BB-TURF. BB-TURF shipped 9/5. I re-measured the
other half on today's tree instead of trusting my own note from last round:

- `bohemia_loop.js` is inlined in NEITHER the city nor the alpha. Zero hits each.
- The city's own comment still says it: "walked city loads BohemiaClout and NOT
  BohemiaLoop, so LOOP is null there."
- The only code in the whole repo that reads `s.advanceTerritory` is
  `engine/bohemia_loop.js` line 681.

So ten quests still say the map changes hands and nothing is listening. Which way
that goes is an explicit decision SHARED owns, not a thing to fix quietly inside a
quest file.

## WHAT SHIPPED

| file | from | pays | silences |
|---|---|---|---|
| `D001_MOTHS_AROUND_THE_LAST_LIGHT.bq` | QUEST_001 LAST LIGHT | nothing, on purpose | 15 |
| `D002_THE_HOUSE_HAS_GONE_BUST.bq` | QUEST_002 BLOOD FEUD | electricity / clout / resources, one each | 11 |
| `D013_LONG_WALK_HOME.bq` | QUEST_013 LONG WALK HOME | clout 1 | 7 |

All three: zero parse warnings, lossless round trip, zero errors, zero warnings,
every declared ending reachable, every objective raised.

## *** THE REAL WORK WAS NOT TYPING. THE DESIGNS PREDATE THREE LAWS. ***

These documents were written 7/10. Since then the parser banned stat gates, the
name law landed, caps died and the three currencies locked. A straight
transcription would have produced three files that cannot parse.

So every disagreement between the design and today's law is resolved IN FAVOUR OF
THE LAW, and written into the head of each file in plain words rather than dropped
quietly. A future chat reading `D001` finds out in its first twenty lines exactly
what was changed and why.

**1. NO HARDCODED NAMES.** The designs name ETHAN, VANCE OKONKWO-REED, SETH
MARROW, ORA MENDEZ, AGA HOLT and ESROM. Every one is now a `@ROLE` cast at runtime:
the KEEPER, the BROKER, WATER and POWER, the WIDOW, the WARDEN. Names are canon
Paolo has not given and a side quest is the worst place to invent one. The two crew
heads became WATER and POWER because what each one keeps running is the only thing
about them that matters mechanically, which is also the fastest way to understand
the quest.

**2. NO STAT GATES, AND THE REPLACEMENT IS BETTER.** The designs gate their best
lines on `[MEDICINE]`, `[TRADES]`, `[BARTER]`, `[READ]` and `[INTIMIDATE]` skill
levels. The parser bans stat gates outright, and INTIMIDATE is a banned word.

Every one of them became the rule the seven act-one asks already run on: **you earn
the line by going and looking.**

- 001: stand close enough to hear the lanterns and you learn the hum went thin;
  sit with him long enough and you see what he will not say. `knows:the_hum_went_thin`,
  `knows:he_is_not_well`.
- 002: visit both blocks and you can say that neither crew moved first, which is
  the line that unlocks the accusation scene. The design's own Landsmeet note asks
  for exactly this: evidence wins the room, overreach loses it. It just asked for
  it with a skill number.
- 013: hear the warden out and you learn what he has actually been doing in that
  ruin, which is the only thing that opens the way past him without hurting anybody.

A thing you noticed, never a number on your sheet. The designs wanted attention to
be the mechanic; a skill check is the opposite of that.

**3. NO CAPS, EVERYTHING COSTS ONE.** 002's route A pays "a generation of income."
Now every ending pays exactly one unit of one of his three: take the job and you
hold the block's power, broker it and you get a working block's goods, expose him
and you get what people say about you. Which ending is richest is his thumb; the
shape is here and the dial is not mine.

**4. NO STANDING NUMBER TO ENTER.** 002 required standing >= 15 with a faction.
Fifteen is a number nobody ruled, so it is not in the file.

**5. NO DAMAGE BEFORE THE DIAL.** 013's provoke road handed to a fight. Going
through the warden is still a choice with a name and a consequence, and there is
not one damage number in the file.

## WHAT WAS KEPT WHOLE, BECAUSE THE DESIGNS ARE GOOD

- **001's refusal.** Offering to fix the cells is honoured as DECLINED, in his own
  words: "I do not want them to last. I want them to shine, then rest. Same as me."
  The quest is about letting go, so the fix has to be refused or there is no quest.
- **001's anti-saviour beat.** Offering to take him somewhere safe gets "her door is
  HERE. I am not leaving the door." The save you want is not the save he wants.
- **001's ending.** No prompt, no timer, no score at the top of the marquee. The
  player stands there as long as they like and is never told what it meant.
- **002's filthy road is fully built,** with its own planting scene, its own ending
  and its own payment. An evil path that is also worse for you is a tax, not a
  temptation.
- **002's walk-away costs something.** The broker says the arithmetic finds somebody
  else, and he is telling the truth. Clean hands do not save the block.
- **013's carry is the mechanic.** The stage that matters is the one where nothing
  happens except walking, and nothing in the file can interrupt it.

## THE CITATIONS

Ten, across four studies and two masters, every id and title verified verbatim
against the 3,672-finding index. The ones that shaped the conversion:

- **Q001.W6 PEREGRINATION (duration AS emotion)** is the law 013 is made of: the
  botchling carry is slow on purpose so grief is felt through time and distance.
- **Q001.W1 TRANSACTION-CARRIES-EMOTION**: 001 opens as an errand about cords, never
  as a sad story, and the grief arrives underneath the job.
- **Q002.W5 THE VILLAIN ROUTE IS FULLY BUILT** and **Q002.W7 THE ENDING IS A BRANCH
  TOO**: the reward in 002 is not a pile at the bottom, it is which currency you
  walked out holding.
- **Q004.W3 NO CLEAN OPTION**: walking away from 002 saves nobody.
- **Q003.W8 THE WITNESS WHO KNOWS**: the warden in 013 has actually been out there,
  so the truth comes from him and not from the person asking.
- **Q004.P1 hidden load and delayed displaced consequence**: all three plant a flag
  the player never sees, read a generation later by somebody who will never know
  who set it.

## A GATE I FIXED ON THE WAY, AND IT IS THE THIRD TIME THIS EXACT BUG HAS BITTEN

`gates/the_job_pays_gate.js` scanned the RAW quest file for a pay line. D001's
header explains, in a sentence, why it does not use the pay verb. That sentence
contains the words "the @DO pay verb here," and the gate read it as a pay line
paying the currency "verb" the amount "here,".

Third time this lane has been bitten by prose read as code (round 20's rollBoss
sentence in the ladder gate, round 24's quoted research figures in the fold gate),
and the fix is the same one both times: strip the comments before you scan. A .bq
comment is a whole line starting with `#`, so it is exact rather than a guess.

Four self-tests were added underneath it, because a stripper that ate too much
would hide every real pay line and this gate would go quietly green on a game where
nothing pays, which is the exact disease it exists to catch. It must see a real pay
line, must not see a commented one, must treat an indented comment as a comment,
and must still find a pay line that follows one. 99 passed, 0 failed.

## RULE 7: IN THE WALKED SURFACE AND IN THE DEMO

- The alpha's DIRECT quest array: 39 to **42**, spliced with the direct tab tool's
  own parser as a one line diff, never by re-running that tool (it is a whole block
  replace and it clobbered another lane in round 21).
- The city's `DEMO_BQ`, the copy that actually PLAYS: 34 to **37**, same surgical
  splice.
- Demo re-cut from the workshop.
- Build stamp: **BUILD 9/11f - THREE FINISHED DESIGNS ARE PLAYABLE**.

## WHAT IS STILL HIS

Every word is `draft:true`. The prose designs stay exactly where they are; nothing
was deleted and nothing was rewritten. These files are the machine layer under them,
and a sentence from him replaces any line for free.

