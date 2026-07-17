# BOHEMIA QUESTBOOK — BATCH LAW
Locked 7/16/26 by Paolo: "I can't be doing one quest at a time with you anymore. You better start doing
big fucking batches."

## WHAT WAS WRONG
One file per turn, at v1 depth, with no conversation machine. 126 files of research and not one of them
was implementable. The corpus was a library Paolo could not read and Claude never compiled.

## THE FIX — FACTORY LAW APPLIED TO QUESTS

### 1. "MORE" = A BATCH, NEVER ONE
A batch is N individual quests at v2 depth, cooked in one turn, gated automatically, banked, presented
together. Never one. Never a check-in mid-batch.

### 2. CONTINUOUS COOKING
Do NOT stop Paolo for judgment every few files. Cook the batch, run the gate, ship the batch, ship the
updated ARCHIVE. Judgment happens at rare milestones, in one interactive, when Paolo opens it.

### 3. THE CORPUS IS A DATABASE, NOT A PILE
Every ship turn regenerates:
- BOHEMIA_QUESTBOOK_ARCHIVE.html   <- all findings, searchable, one tap. THE deliverable.
- BOHEMIA_CRAFT_MASTER_*.txt       <- every craft finding
- BOHEMIA_FLAWS_MASTER_*.txt       <- every flaw + its law
- BOHEMIA_PORTS_MASTER_*.txt       <- every port. THIS IS THE BUILD QUEUE.
- BOHEMIA_QUESTBOOK_GAP_MATRIX_*.txt <- what every file is and lacks, audited BY NUMBER
The extraction is machine-generated from the .md corpus. It is never hand-maintained and never drifts.

### 4. TWO POOLS, TWO TREATMENTS (the audit finding, 7/16/26)
The corpus is NOT 126 individual quests. Audited by number:
- **42 files** have a stage-by-stage event flow. These are the individual-quest teardowns.
- **84 files** are WHOLE-GAME teardowns. They are a MINING POOL.
- **1 file** (#126) is at v2 depth.

**BACKFILL QUEUE = the 41 files with a flow but no v2 payload.** Upgrade in place: add CAST, THE
CONVERSATIONS (node trees), THE BRANCH MAP. Do not rewrite what is there. Do not touch W1-W10.

**MINING POOL = the 84 whole-game teardowns.** NEVER upgrade in place. Mine each for its single best
quest and build THAT as a new numbered v2 file. A whole-game teardown is raw ore, not a draft.

### 5. THE OUTPUT IS IMPLEMENTABLE OR IT DOESN'T COUNT
Every v2 file's ports section ships **.bq node trees in Bohemia's own voice**, not prose descriptions of
what a conversation could be. The research is done when Paolo can open BOHEMIA_QUEST_LAB.html, paste the
tree, and see it validate.
**A port that cannot be pasted into the lab is not a port. It is a wish.**

### 6. THE GATE (every file, every batch, automatic)
- exactly 10 craft points  (grep -cE '^W[0-9]+\.')
- >0 option lines in THE CONVERSATIONS  (grep -cE '^> ')
- CAST + THE CONVERSATIONS + THE BRANCH MAP sections all present
- branch count stated
- END marker present
- index patched the SAME TURN
- audited BY NUMBER, never by filename
A file that fails the gate does not ship. The batch ships without it and the failure is named.

### 7. BATCH SIZE
Set by Paolo. Default: as many as the turn holds, never one. Report the count, never the fullness of
anything else.

## THE STANDING ORDER
"more" -> next BATCH of individual quests at v2 depth, mined from the pool or backfilled from the queue,
gated, banked, ARCHIVE regenerated, everything presented in one turn.
