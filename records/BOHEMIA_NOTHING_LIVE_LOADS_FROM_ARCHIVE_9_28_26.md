# NOTHING LIVE LOADS FROM ARCHIVE (PLUMBER 9/28/26, row [excavate], rule 33h)

Row: the excavation gate from THE EXCAVATION RULE in records/BOHEMIA_THE_REVAMP_LIST_9_24_26.md
("nothing in slices/ or engine/ loads from archive/ (PLUMBER gates it)"), every CUT row's move
checked, and the old weight off the site. KEPT CLAIMED, ABOUT 2 OF 3 (rule 6): the gate and the
checks are built and in the suite; the move of the old weight was refused by this session's
permission check and waits on Paolo.

## THE ANSWER FIRST

- **The game loads 616 of the 1,039 files the site publishes.** 423 files, 90.2 MB of 288.5 MB,
  are published and nothing a phone can reach ever names them.
- **Nothing live loads from archive/.** Zero reachable files name any of the 18 archived files.
- **146 of the 423 (32.6 MB) are proven safe to move** and are listed, one per line, in
  gates/excavate_move_list.txt. They are NOT moved. The move was refused by the permission check
  and is Paolo's to allow.
- **The site has been over its own size cap for four rounds.** PAGES PUBLISH caps the published
  surface at 260 MB; main is at 288.5 MB and was already at 270.6 MB on 9/24, growing about 4 MB a
  round. The 146-file move alone takes it to about 256 MB, under the cap.

## WHAT WAS BUILT

1. **tools/bohemia_what_loads.js**, the sweep. From the alpha, the demo and the service worker it
   walks everything a phone can reach, through page source AND data files (the VOTE tab loads its
   pictures through records/target/BOHEMIA_VOTE_REGISTRY.json, not through page source), plus a
   STEM rule, so a name built at run time ('..._0' + n + '.js') still counts. Generous on purpose:
   calling a live file dead breaks the game, calling a dead file live only leaves weight behind.
   Two cuts never finished (every stem against every page was about 38 GB of scanning; then one
   filename pattern re-scanned a 2,178,392-character inline image from every starting point).
   One combined stem pattern and stripping inline image data first took it to 1.5 s warm.

2. **gates/excavate_gate.js, in the suite as EXCAVATE**, no browser, about 2 s:
   - S1-S4, a self-test on a planted tree: follows page to script to a run-time chunk name, calls
     an orphan page dead, catches a live script naming an archived file, and comes back clean when
     that line is removed.
   - L1 the three entries and the VOTE registry are reached.
   - L2 no reachable file names a file that lives only in archive/ (the site never publishes
     archive/, so that is a 404 on his phone).
   - L3 every file under archive/ has a GRAVEYARD registry line.
   - L4 every rule-33h CUT line in the registry is really cut: gone from where it lived, present in
     archive/.
   - L5 the weight nothing loads can only fall: every unreached published file is on
     gates/excavate_baseline.txt (423 lines, frozen this round). A new one is refused by name, with
     where it belongs instead (a picture for a record goes under records/, never records/target/).
   Mutation-checked four ways on the real tree, each restored: a live file naming a cut module
   (L2 red), an archive file with no line (L3 red), a cut module back at its old path (L4 red), a
   new unreached picture on the site (L5 red). 8 passed 1 failed each time, 9/0 restored.

## HOW THE SWEEP WAS CHECKED BEFORE ANYTHING TRUSTED IT

The sweep is a reading of source, and a reading can miss a name assembled from pieces. So it was
checked against the truth: a phone-shaped boot of the alpha and of the demo through the one driver
(tools/bohemia_drive_the_demo.js), through the door, out to the map and back in, every response
logged. The alpha fetched 18 files, the demo 16, zero page errors, and **zero of the fetched files
were on the unreached list**, zero fetched from outside the three published folders, zero 404s.

What that does NOT prove, stated: the boot did not open every workshop tab or play every VOTE item.
That is why the move list below is held to four more tests on top of "the sweep calls it dead".

## THE 423, SORTED BY WHO STILL NAMES THEM

| group | files | MB |
|---|---|---|
| a gate or a tool names it (moving it breaks a checker) | 170 | about 42 |
| only the handoff, the board or the backlog names it (prose) | 45 | about 5 |
| only a law or a record names it | 56 | 25.6 |
| named by nothing at all | 152 | 18.1 |

From the ones no gate or tool names (253, 49.0 MB) the move list dropped: 15 whose full path a law
or record cites (11.2 MB; moving them would raise the canon rot count), 90 that are assets (4.9 MB:
fonts, sprite sheets, floor tiles, logos, the combat and vote folders, and everything under engine/,
because rule 38e keeps every asset), and 2 whose name a tool builds from a stem. **146 remain,
32.6 MB: 100 old screenshots in records/target, 29 proof pictures and 15 retired judge pages in
slices/, 2 photos.** None is the game, a checker's input, or an asset.

The row also named "the 29 unloaded engine modules". Not touched: this lane's own [dead modules]
(9/11) found that premise wrong once already (the biggest "dead" module was live, word for word),
engine/ holds 39 unreached files worth 0.5 MB in all, and rule 38e keeps assets. The risk is
larger than the weight.

## WHAT THE GATE FOUND ON ITS FIRST RUN

**A registry line nobody had ever read.** The 7/31 line for the YOU HAVE TO ASK addendum was
written with an arrow ("  ->  ") where every other line has a pipe. The carry gate, the canon index
and the master builder all split on the pipe, so for eight weeks all three skipped it. Rewritten with
the pipe: the carry gate now checks it (57 to 58 passed) and the canon index lists it.

**Four archive files had no line at all**: the handoff pile before the 7/26 diet, the two 9/4 token
diet copies, and the blocks this lane recovered on 9/13. Each now has one, written from its own
header.

## RED ON MAIN BEFORE THIS ROUND, AND WHOSE (measured on a clean copy of main, 191d9408)

- **CANON ROT C2, 10 against a ceiling of 6.** WORLD's rule-33h cut (0c24c0cb) moved the notice
  module, its tool and its gate to archive/; four citations in
  records/BOHEMIA_WORLD_THE_FIRST_NOTICE_9_21_26.md (3) and
  records/BOHEMIA_WORLD_A_PLACE_IS_A_BLOCK_9_27_26.md (1) still name them with none of the gate's
  words (archive, superseded, retired, dead, killed, no longer) nearby. One line on WORLD's board.
  Every future cut will do the same to older records; the fix is a note beside the citation, not a
  looser gate ("cut" is not added to the words, because "the demo cut" sits beside live citations
  all over this repo).
- **CANON ROT C3, 66 against a ceiling of 62.** One was MINE: my own 9/24 record wrote a filename
  shortened with "...", and the gate read the dots as a path. Fixed to the full name
  (records/BOHEMIA_I_WAS_WRONG_ABOUT_THE_FONT_AND_HE_WAS_RIGHT_ABOUT_SHOWING_8_27_26.md); 65 now. The
  other three, one line each on their boards: COMBAT's cell-board record cites the cells gate its own
  V230 undo removed (4e6b0931); ECONOMY's day-52 record cites a grid-cook tool under tfcook that no
  commit in reach ever had; MODS' Battle Brothers school cites a weapons data file under slices'
  data folder that does not exist yet (a proposed file written as a path).
- **PAGES PUBLISH, 289 MB against a 260 MB cap.** The cap is not raised. The move above is the fix.

## WHAT IS LEFT ON THE ROW

1. The move, when Paolo allows it: the 146 files to archive/old_pages/ at the same paths, one
   registry folder line, and their lines off the baseline (EXCAVATE prints which). Then PAGES
   PUBLISH is re-run, and the alpha and the demo booted once more through the one driver.
2. The prose CUT rows (the cold open, the city builder mode, the asks as text, the walked city from
   rule 38b) do not map to files mechanically. The gate checks what the registry DECLARES; each
   cutting lane's registry line is what makes a cut checkable, and L4 holds every such line to it.
