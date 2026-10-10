# THE TRAIL FILE, ROUND 1: THE MACHINE AND ITS DRY RUN (PLUMBER 10/10/26, row [the trail file]; rule 96)

THE ROW'S END STATE: "at every VAMILY a machine shows the coordinator which rules, rows, records and handoff
blocks no lane has cited for their set number of sweeps, folds them as rule 96 says, and the START file holds
two blocks per lane with the rest in a per-lane archive; the first run is a dry run the coordinator reads."
CONSTRAINT: "a move is never a deletion (the handoff gate changes in the same commit), and no field in the
trail file is ever written by hand."

## THE ANSWER FIRST

**The machine exists and this is its first run, dry: nothing has moved.** It reads 3,795 commits (since 8/26)
in about four seconds, counts 30 sweeps (B on 10/1 to AH on 10/10), and writes 5,361 marks into
records/target/BOHEMIA_TRAIL.json, sealed. If the coordinator answers CORRECT, round 2 makes the moves.

| mark | now | after the moves | what moves |
|---|---|---|---|
| handoff file | 135,428 lines, 1,837 blocks | 9,467 lines, 51 blocks | 1,786 blocks to handoffs/<LANE>_ARCHIVE.md |
| rules on the front page | 100 | 67 on the page (9 of them folded) | 33 leave, 9 fold |
| OPEN rows | 262 | 106 | 156 to records/BOHEMIA_EVAPORATED_ROWS.md, 4 marked STALE |
| records and laws in the canon | 2,407 | 2,017 | 390 records (no laws) to archive/ |
| the SUITE, CUT, BREAK, COOK lines | one sweep each | unchanged | nothing: the coordinator's hand fold already holds |

    node tools/bohemia_trail_sweep.js            (writes the trail file, prints the dry run)
    node tools/bohemia_trail_sweep.js --no-write (prints only)

## FIVE THINGS THE COORDINATOR SHOULD READ BEFORE SAYING CORRECT

1. **THE CLOCK RUNS FAST.** Rule 96 counts in sweeps, and there were 18 in the last 7 days (9 on 10/9 alone).
   So "14 silent sweeps" is 5.4 days and "7" is 2.7. That is why 33 rules would leave the page, 39 of the 42
   rules that act quote Paolo, and rule 0 (VAMILY is a keyword), rule 1 and rule 4 are among them: lanes obey
   the first rules without naming them. The machine does what the rule says; whether the manual (rules 0 to
   13) is exempt, or the rates move to days, is the coordinator's NEGATIVE to give.
2. **156 OPEN rows would leave**, UI 29, PLUMBER 29, RUN 26, COMBAT 18, ANIMATION 12, SOUNDS 11, COOK 8, LIFE
   + CITY 7, the rest 16. Many sit in lanes rule 88 holds, where nobody may touch them, so nobody names them.
   A row's clock starts when it went OPEN, so the rows rule 95 turned back this sweep are not on the list.
3. **THE HANDOFF SPLIT IS NEARLY SAFE, NOT SAFE.** The lanes write five head shapes: `LANE (slug): date
   LATEST` (most), `## LANE (` (RUN TWO, COOK TWO, COOK THREE), `=== LANE: ... (date` (COOK FOUR, now read),
   and two the machine cannot see as heads: COMBAT's, DIRECTION's and DYNASTY's newest work is written inside
   their standing-instruction blocks (2,318, 1,104 and 2,157 lines), and some lanes add `- LANE date` bullets
   wherever they are. A moving block that holds a line naming a lane with a date of the last three days is a
   HAZARD and the split is refused while one exists. Today: 1, a false alarm (PLUMBER's own sentence naming
   RUN TWO, in PLUMBER's own old block). Four giant blocks are most of what the START file keeps.
4. **390 records would leave the canon index, no laws.** A record stays if a lane commit named or touched it
   in 30 days (830) or if a live file reaches it (1,187): reachability from the roots (CLAUDE.md, the board, the
   code, the kept handoff blocks, every recently cited record), so two dead records that cite each other stay
   dead. The generated canon index and the blocks that would move do not count as citing.
5. **WHAT A CITE IS, MEASURED.** A lane commit's message, or a record or law it touched. Not its diff: reading
   every file's contents for a month is about 500 MB; messages and file names are 5 MB. The coordinator is
   every session that wrote a lettered sweep, a COORDINATOR or a PAOLO commit (2 sessions); its cites never
   count. 19 lane commits had no lane name and their session wrote none either: counted as lanes.

## HOW IT WAS PROVED (THE TRAIL FILE gate, 5 passed, 0 failed, under a second)

- T1 the seal is the hash of the marks as the tool wrote them; one "silent" changed by hand on a copy breaks it.
- T2 a lane from a subject (COOK THREE is not COOK, RUNWAY is not RUN), 8 of 8.
- T3 cites: "rules 82 and 82a" is 82, "(rule 89)" and "the rule-89 reds" are 89, a [label], a record, a STOP.
- T4 silence is the sweeps after the last cite.
- T5 the split keeps a lane's two newest, moves the third, the fourth and the July document, reads COOK
  FOUR's shape, and names a planted bullet of another lane inside an old block as the hazard.
- RED CASE: the order of the lane list broken (COOK before COOK THREE) turns T2 red; keeping three blocks a
  lane instead of two turns T5 red; both restored and green.
- Found and fixed before this ran: ripgrep's -I means "no file name" (grep's means "skip binaries"), which
  dropped every reference's source and read 411 of 462 laws as unreached; and the lettered sweeps restart on
  10/1, so a commit under the same letter twice is one sweep.

## ROUND 2, ON THE COORDINATOR'S CORRECT

The moves, each in its own commit: the handoff split with the handoff gate reading handoffs/ in the same
commit (the gate's fleet and size legs count the archive); the row moves; the rule folds; the record moves with
their registry lines. Not before: the row says the first run is read first, and point 1 may change the rates.

## THE DRY RUN, AS PRINTED

```
THE TRAIL SWEEP (rule 96), DRY RUN: nothing moves until the coordinator answers CORRECT
  THE PACE: 18 sweeps in the last 7 days, so 14 silent sweeps is 5.4 days and 7 is 2.7. The rates are counted in sweeps (rule 96); read every list below with that in mind.
  the clock: 30 sweeps (B to AH); 3795 commits since 2026-08-26, 3140 by lanes (19 with no lane name, counted as lanes)
  RULES: 100 on the front page; 9 fold to one line, 33 leave the page; 3 already folded
    rule 34 (silent 12): FOLDS TO ONE LINE -- TWO SCALES, ONE GAME: THE TINY CHARACTER ON AN HON
    rule 54 (silent 12): FOLDS TO ONE LINE -- THREE CHATS RUN RIGHT NOW (PAOLO 10/1: 'Right now 
    rule 66 (silent 12): FOLDS TO ONE LINE -- ONE MAN IS NOT A WALL, TWO ARE; THE CHARACTERS LAR
    rule 67 (silent 11): FOLDS TO ONE LINE -- THE SIXTH VOTES (PAOLO 10/2 in the tab, 91 verdict
    rule 70 (silent 9): FOLDS TO ONE LINE -- THE FAR STOP LOSES THE LAND; PASS ONE OF YOUR OWN,
    rule 75 (silent 9): FOLDS TO ONE LINE -- THE ORIGIN SETS THE COMPANY, AND THE ROAD SETS THE
    rule 76 (silent 12): FOLDS TO ONE LINE -- THE INVENTORY (PAOLO 10/5: 'I still can't buy weap
    rule 79 (silent 7): FOLDS TO ONE LINE -- THE BOARD FITS THE PARTY (PAOLO 10/9: 'the actual 
    rule 81 (silent 7): FOLDS TO ONE LINE -- WHAT A BATTLE BROTHERS MONSTER BECOMES (coordinato
    rule 0 (silent 30): LEAVES THE PAGE (lives in its record) -- VAMILY is a keyword. It has nothing to do with fam
    rule 1 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- Paolo talks ONLY to the coordinator (00 MASTER COO
    rule 4 (silent 30): LEAVES THE PAGE (lives in its record) -- Every job carries a TWO-WORD label in [brackets], 
    rule 14 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE FIVE MINUTES (PAOLO 9/13, LOCKED; laws/BOHEMIA
    rule 15 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- ONE VOTE TAB (PAOLO 9/14, LOCKED; laws/BOHEMIA_ADD
    rule 16 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE STEP IS A HOUSE (PAOLO 9/15, LOCKED; laws/BOHE
    rule 17 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE FIGHT LOOKS LIKE THE GAME (PAOLO 9/18, LOCKED;
    rule 20 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- ANALOG HORROR FOR EVERY PIXEL AND EVERY SOUND (PAO
    rule 23 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE FIGHT IS BATTLE BROTHERS, QUICKER, AND THE DIA
    rule 24 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- ONE GAME MODE, NO TELEPORT (PAOLO 9/21 IN THE TAB,
    rule 25 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE VOTE TAB SHOWS THE THING (PAOLO 9/21, LOCKED; 
    rule 26 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- SLIDE, NOW (PAOLO 9/21: "I want slide immediately"
    rule 27 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE PLAYER DOES NOT SPEAK SPANGLISH (PAOLO 9/21: "
    rule 28 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE ALPHA'S UI IS FROZEN AND THE PICKS STAND (PAOL
    rule 30 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- MORE ANALOG HORROR, AND THE RUNWAY NAMES (PAOLO 9/
    rule 32 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE SECOND VOTES (PAOLO 9/23 in the tab, 31 verdic
    rule 33 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE OVERWORLD IS BATTLE BROTHERS (PAOLO 9/24, "an 
    rule 35 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- QUESTS IS RESEARCH ONLY (PAOLO 9/27: 'I don't want
    rule 40 (silent 22): LEAVES THE PAGE (keeps its law file; registry line) -- THE HOURS GO TO THE WORLD, NOT THE CHESS BOARD (PA
    rule 41 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE MANAGER ADDS WHAT HIS WORDS IMPLY (PAOLO 9/29:
    rule 42 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE BEASTS ARE LAB-MADE, AND BATTLE BROTHERS' BEST
    rule 44 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE PAD IS TRAVEL SPEED, THE PORTRAIT IS THE MENU,
    rule 45 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- THE TWO VOICES: THE AI-SLOP NARRATOR AND THE SQUIG
    rule 48 (silent 20): LEAVES THE PAGE (keeps its law file; registry line) -- EVERYTHING IN BATTLE BROTHERS HAS A PROPER TRANSLA
    rule 49 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- AN OUTSIDE RESEARCH HELPER (PAOLO 9/30: he pays fo
    rule 50 (silent 18): LEAVES THE PAGE (keeps its law file; registry line) -- THE ZOOM RANGE IS A PILLAR (PAOLO 9/30, five Pocke
    rule 52 (silent 30): LEAVES THE PAGE (keeps its law file; registry line) -- BIGGER JUMPS: COMBAT AND THE RUN SPRINT TO THE DEM
    rule 57 (silent 23): LEAVES THE PAGE (keeps its law file; registry line) -- HE PLAYED THE DEMO: THE FIGHT NEVER ENDED, AND WHY
    rule 58 (silent 24): LEAVES THE PAGE (keeps its law file; registry line) -- THE ONE-FILE LOOP (Paolo, LOCKED; folded to one li
    rule 61 (silent 22): LEAVES THE PAGE (keeps its law file; registry line) -- THE DEMO BLOCKERS, IN HIS ORDER (PAOLO 10/1: 'how 
    rule 62 (silent 14): LEAVES THE PAGE (keeps its law file; registry line) -- THE SCREEN DECIDES THE LAYOUT, AND THE FIGHT OPENS
    rule 64 (silent 16): LEAVES THE PAGE (keeps its law file; registry line) -- THE NEW FIGHT IN THE DEMO NOW, AND ONE SONG AT A T
    rule 72 (silent 17): LEAVES THE PAGE (keeps its law file; registry line) -- THE DEMO'S BAR AND THE BLIND SPOTS (PAOLO 10/4: 'I
  ROWS: 1013 labelled rows, 262 OPEN; 3 STALE, 156 move out
    [the powered blocks] LIFE + CITY (silent 11): STALE
    [the feed] LIFE + CITY (silent 11): STALE
    [one engine boot] PLUMBER (silent 13): STALE
    [act two] QUESTS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [the narrator] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [dead battery] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [squiggle variations] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [read aloud] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [enemy heard] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [fight music] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [rumour heard] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [pump hum] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [eyes: bed unplayed] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [quiet floor] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [into the vote tab] SOUNDS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [horror city] LIFE + CITY (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [tiles not slabs] LIFE + CITY (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [buildings appear] LIFE + CITY (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [power buildings] LIFE + CITY (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [owner shown] LIFE + CITY (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [bill lands] LIFE + CITY (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [shelves seen] LIFE + CITY (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [bestiary] COMBAT (silent 26): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [unregistered] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [formation] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [gambits] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [fight feel] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [horror fight] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [armour morale] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [what lives] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [sixty bosses] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [rf4 checklist] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [bb checklist] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [cover honest] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [era fights] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [perks see] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [downed body] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [cover costs one] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [party arrives] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [third door] COMBAT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [demo end] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [a stranger plays] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [the reel] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [the sign fix] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [release list] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [zoom range] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [sighting stops] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [road events] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [eyes: two squeezes] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [excavate the walk] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [open reachable] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [browser lines] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [demo pinned] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [dead cards] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [wake near] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [zoom meets] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [one question] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [first world] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [zoom teaches] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [death handoff] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [day one] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [five minutes] RUN (silent 26): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [a shift] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [a day is] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [map on beat] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [slice rebuilt] RUN (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [horror motion] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [bake approved] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [clips redone] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [hurt death] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [clips checked] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [enemy walks] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [hurt shows] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [zoom beat] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [cloud turn] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [cheap cloud] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [eyes: loop flag] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [beat steps] ANIMATION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [the plague] PEOPLE (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [heirs backgrounds] PEOPLE (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [recruit at the place] PEOPLE (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [deeds and memory] PEOPLE (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [deal sticks] FACTIONS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [pursuit strength] FACTIONS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [deeds weigh] FACTIONS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [take them on] FACTIONS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [danger line] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [portrait menu] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [market screen] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [roster] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [bougie phone] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [door fixes] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [faces blank] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [warning clipped] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [inner votes] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [one hud] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [registry split] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [vote plays sound] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [three d ui] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [analog horror ui] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [talk panel] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [fight hud] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [three acts] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [skin swap] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [show options] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [tutorial ask] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [no text box] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [hostiles read] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [colour reaches] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [where was i] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [what you know] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [footprints] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [what you notice] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [loading look] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [eyes: mode button] UI (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [judge the old] DIRECTION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [ratchet sixty] DIRECTION (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [map floor] COOK (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [missing districts] COOK (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [strip ruling] COOK (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [unplaced tiles] COOK (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [boxcar order] COOK (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [landmark check] COOK (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [keep cooking] COOK (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [seven landmarks] COOK (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [eyes: ticker overlap] EYES AND EARS (silent 16): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [where the minutes go] EYES AND EARS (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [sun gate] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [flaky gate] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [event gate] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [travel gate] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [flash light] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [native map] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [grid budget] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [three valleys] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [slim build] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [deep history] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [horror gate] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [mode chip] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [suite line] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [pre-push pass] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [cannot fail] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [one way rulers] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [spelling gates] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [suite runs] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [fight headroom] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [dead gates] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [handoff cut] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [backlog archive] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [owed checker] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [board checker] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [stamp stripped] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [beat latency] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [scale gate] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [tap gate] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [late loads] PLUMBER (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [front page] PORTRAIT (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [loop wired] SHARED (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
    [acts real] SHARED (silent 30): MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md
  HANDOFF: 1837 blocks, 135428 lines; 1786 blocks (125961 lines) move to handoffs/<LANE>_ARCHIVE.md; the START file keeps 9467 lines, two blocks a lane
    NOT SAFE TO SPLIT YET: 1 moving blocks hold 1 lane lines dated in the last three days (RUN TWO 1): those lanes write heads the split cannot see, so their newest state would leave the START file, some of it under another lane's archive.
  RECORDS AND LAWS: 2407; 830 named by a lane in 30 days, 1187 reached from a live file, 390 leave the canon index (0 laws, 390 records)
  the trail file: records/target/BOHEMIA_TRAIL.json, 5361 marks, seal 8ac514a27c6f2a7d
```
