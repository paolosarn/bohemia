# THE MAIN QUEST IS IN THE GAME (9/18/26, QUESTS lane)

VAMILY row `[main quest live]` THE-MAIN-QUEST-IS-NOT-IN-THE-GAME, raised by
FACTIONS (cf48caed) and queued by the coordinator 9/15.

> "quests/ is on the publish EXCLUDE list on purpose because a .bq quest reaches
> a player only by being INLINED into the slice at build time, and M01..M05, the
> main quest line ('THE FIRST MAIN-QUEST FILE THIS REPO HAS EVER HAD'), are
> inlined into NO surface. Nobody could ever play them. Inline the five into the
> walked city the way the side quests are, drafts under THERE IS NO STORY YET,
> and prove M01 opens on the demo with the one driver."

## WHAT WAS MEASURED BEFORE ANYTHING WAS BUILT

Counting each quest id in each built surface:

| quest | walked city | alpha | demo |
|---|---|---|---|
| M01..M05 | **0** | 1 | 1 |
| S01_THE_METER_READER | 2 | 1 | 1 |

The one alpha hit is inside `BOHEMIA_QUESTS`, the DIRECT tab's EDITING table
(added round 28). **So the main quest line could be EDITED and never PLAYED.**

The row is sharper than it states, and two things were missing rather than one:

- the city's `DEMO_BQ`, which is the playable set, carried **37 quests and zero
  main ones**
- the city's `var DAYS`, which is the day table the one driver reads, carried
  **five rows and zero main ones**

Inlining the text alone would have put five unreachable quests in a file.

## AND THE DEMO IS ONE DAY LONG

`CT_DEMO_DAYS = 1` in the walked city, and `ctDemoOver()` ends the demo cut after
day one. No amount of inlining puts a later day in front of a demo player. **WHICH
DAY THE STORY STARTS ON IS THE RUN'S CUT** (Paolo 9/13 rule 14a: only the run
re-cuts the demo), so this round did the half that is this lane's: the surface the
demo loads now carries the five, and the one driver opens them there. In the
ALPHA, where `CT_IS_DEMO` is false and days roll, day six really is M01 by play.

## WHAT SHIPPED

**The five quest files, verbatim, into the walked city's `DEMO_BQ`.** 37 quests
became 42. Byte for byte against `quests/bq/*.bq`; the gate re-reads both and
compares. The demo build and the alpha both load `BOHEMIA_CITY_WORLD.html` BY
PATH and carry no second copy, so nothing had to be re-cut and nothing can go
stale.

**The main line as days 6 to 10, through the ONE driver.** `DAYS` is untouched at
five rows. `ACTS` is the new five. `TRACK = DAYS.concat(ACTS)` is what
`specForDay` reads, so the phone that rings, the offer card, the haggle, the
save, the objective line and the resolution card all reach the main line without
a second code path. There is still exactly one opener in the module.

**Days 6 to 10 and not 1 to 5, deliberately.** EYES, PEOPLE, the haggle work and
this lane's own first-ask work all measure against day one right now, and the
running order is the run's to cut.

## TWO SHAPES THE SIDE QUESTS NEVER HAD, BOTH THE AUTHORS', NEITHER INVENTED

1. **M01 has three beats before its choice** (10 the table, 20 they are already
   in the house, 30 room to room to the back). `advance` was one step because
   every side quest has one; it is a LIST now, and a bare object is read as a
   list of one, so days 1 to 5 behave identically. Verified: same steps, same
   nightfall, same buttons as before the change.

2. **M01, M03 and M05 have NO FAIL STAGE.** Their authors wrote three or four
   ways the night can END and no way for it to be LOST. Before this round a null
   fail stage went to `setStage(undefined)` and the quest fell into a stage that
   does not exist. Inventing a failure instead would be writing his story, so
   nightfall now leaves those jobs OPEN and the next morning they are still there.

Where a quest has no beat between the ask and the answer, none was invented.
Three of the five are somebody standing in front of you wanting an answer, and
that is what the file says.

## THERE IS NO STORY YET

Every line is the author's own `.bq` text, `draft:true`. The cold open's cast and
place are still blank and nothing here waits on them. No story hole was surfaced
as a question.

## THE GATE, AND IT IS PROVED TO BITE THREE WAYS ON THE REAL REPO

`gates/main_quest_live_gate.js`, 37 checks, registered as MAIN QUEST LIVE.

- cut M01 out of the city's `DEMO_BQ`: **11 checks go red by name**
- add one byte to M03's copy: **verbatim goes red**
- cut M01's advance back to one step: **7 checks go red**

It plays M01 in a real browser on the real city file: the phone rings with THE
NIGHT THEY CAME, the brief is the quest's own opening line, the objective runs
10 to 20 to 30 as the player walks into buildings, all three branch buttons are
the `.bq` file's own lines, and resolving fires ACT ONE's real verbs
(`act1_open_done`, `the_family_holds`) with zero page errors.

**THE FIRST CUT OF THE GATE CRASHED ON ITS OWN PLANTED BUG.** With M01 missing,
`DQ.rt` is null and `DQ.rt.state.stage` threw, so the gate reported two failures
and then died instead of reporting the other nine. A gate that hides the rest of
its own row is worse than a gate that fails. The browser half reads the stage
through a guard now, and the planted bug reports eleven failures by name.

## WHAT IS STILL SOMEBODY ELSE'S

Which day the story starts on, and whether the demo cut should open on M01
instead of the meter reader, is **THE RUN's**. The fight inside M01 is COMBAT's.
Nothing here touches either.
