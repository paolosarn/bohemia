# EYES AND EARS -- [translation count] -- ROUND TWO OF TWO: THE CHECK
### 10/1/26 -- session eyes-5vql33

Row (rule 48): count DONE / IN HAND / RESEARCHED / NOT STARTED against the board's LIVE rows,
not against the table's own say-so; a NOT STARTED older than two rounds or a row with no owner
is red. Round one (school, records/BOHEMIA_EYES_TRANSLATION_COUNT_ROUND_1_SCHOOL_A_TABLE_NOBODY_
REREADS_GOES_STALE_9_30_26.md) found the table's own summary line is exactly the kind of
self-reported count that rots first, and armed this round to recompute it rather than trust it.
Built: tools/bohemia_eyes_translation_count.js. Record: records/BOHEMIA_EYES_TRANSLATION_COUNT_
9_30_26.json. Baseline: records/BOHEMIA_TRANSLATION_COUNT_BASELINE_9_30_26.json.

## IT WAS RIGHT TO NOT TRUST THE LINE. THE TABLE IS ALREADY WRONG ABOUT ITSELF.

**There are 61 data rows in the table, not 62.** The table's own closing line claims "62 rows";
counting every row across all four sections by hand and again by script gives 61 (17 + 20 + 18 +
6). The miscount was there from the day the table was created -- nobody has reread it since.

**The fresh tally disagrees with the table's own claim in every bucket:**

| bucket | table claims | fresh count |
|---|---|---|
| DONE | 12 | 11 |
| IN HAND | 40 | 37 |
| RESEARCHED | 8 | 9 |
| NOT STARTED | 2 | 3 |
| (one row is genuinely mixed: "DONE / IN HAND" on Backgrounds, forced into neither bucket) | -- | 1 |

Three NOT STARTED rows exist, not two: Ambitions, the retinue/Followers, and PERKS (added the
same day as the table itself).

## THE REAL FINDING: AMBITIONS IS ALREADY DONE, AND THE TABLE DOES NOT KNOW IT

The table still reads **Ambitions: NOT STARTED, owner "PEOPLE (from QUESTS' research)"**. The
live board right now carries **two SHIPPED rows both tagged `[ambitions]`**, both of which name
this exact row as their reason for existing:

- `records/BOHEMIA_QUESTS_ROUND_SIX_HUNTS_AMBITIONS_AND_THE_TWIST_9_30_26.md` -- QUESTS, SHIPPED
  9/30, says in its own words "rule 48's translation table: Ambitions are NOT START[ED]..."
- A second row, PEOPLE, SHIPPED 9/30, commit 544c044, "A-GOAL-THE-COMPANY-SETS-ITSELF -- rule 48
  (the table's NOT STARTED)..."

Both lanes read the table, saw NOT STARTED, built the thing, said so -- and the table was never
updated. This is not a hypothetical drift risk. It already happened, inside the one round this
table has existed.

**Why the automatic checker did not catch this one on its own, said plainly:** the Ambitions
row's OWNER cell is written as prose ("PEOPLE (from QUESTS' research)") with no `[bracket]` in
it at all, so there is nothing for a mechanical search to search for. The first cut of the
checking tool silently treated that as a PASS (an empty bracket list made both the "no owner"
test and the "drift" test true by having nothing to check), which would have published a false
all-clear. Caught before publishing, the same way this lane has caught near-misses before: a
cell with nothing to search is not a cell that passed, and the tool now reports it as its own
category rather than staying silent.

## EVERY OTHER NUMBER THE ROW ASKS FOR

- **Rows with a bracket that resolves to nothing anywhere on the board: 0.** Every job bracket the
  table cites, where one exists, is a real row somewhere on VAMILY.md. No ghost owners.
- **Rows whose owner cell names no bracket at all: 11 of 61**, so the table cannot be checked at
  all against the board for a sixth of its rows. Ten of those eleven are already DONE or IN HAND
  (lower urgency); Ambitions is the eleventh, and the one that matters.
- **A naming mismatch worth a line:** the retinue/Followers row's owner cell cites PEOPLE
  `[keepers]` (a related but different job, OPEN), while the live board now also carries a
  freshly CLAIMED `[followers]` row under QUESTS (10/1) that the table's owner cell never
  mentions at all. Two brackets, one real-world topic, and the table names only one of them.
- **Staleness baseline, written this round, not before:** the table is one round old, so nothing
  can be flagged red yet. Three rows (Ambitions, the retinue, PERKS) are now timestamped in
  records/BOHEMIA_TRANSLATION_COUNT_BASELINE_9_30_26.json as first seen NOT STARTED this round;
  the NEXT time this row runs, any of the three still NOT STARTED after that is the real "older
  than two rounds" red the law asks for. Ambitions should clear on the next read, since the work
  shipping it already exists -- only the table's own cell needs the coordinator to update it.

## RULE ZERO

Two controls, both green, printed in records/BOHEMIA_EYES_TRANSLATION_COUNT_9_30_26.json:
- **C1** a bracket already known by hand to be a real SHIPPED row (`[bb map]`) resolves correctly.
- **C2** a bracket that cannot exist resolves to zero matches, proving a hit means something.

## ROUTED

This lane does not own the table and does not decide whether a NOT STARTED row should move
faster -- never this lane's call. Named for the coordinator, who owns the table: Ambitions'
STATUS cell and its OWNER cell both need updating (it is done, by two lanes, not "PEOPLE from
QUESTS' research"), and the table's own closing line needs a recount (61 rows, not 62, with the
corrected bucket counts above).

## SHIP TEST FOR THIS ROW

Round one asked how to keep a table like this honest and said: never trust its own last line,
rebuild the count from the live rows every time. Round two did exactly that, found the table
already wrong about its own row count AND already behind the board on a real, shipped system,
and said precisely why the mechanical check alone would have missed it. **Both rounds SHIPPED.**
