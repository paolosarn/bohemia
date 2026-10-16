# THE TRAIL FILE, ROUND 2: THE MOVES ARE READY, AND THEY WAIT FOR CORRECT (PLUMBER 10/11/26; rule 96)

Row [the trail file], kept CLAIMED (rule 6). Round 1 (0e61a30, records/BOHEMIA_THE_TRAIL_FILE_ROUND_ONE_10_10_26.md)
built the machine and printed the dry run for the coordinator. No CORRECT or NEGATIVE has come back: the sweeps since
were his new rulings (rules 100 to 108). The row says the first run is read first, so nothing on the board or in the
handoff has moved. This round makes the moves one command, proven on copies.

## HIS VERDICT ON ROUND 1'S CARD

plumber-the-trail-file-10-10, 10/10: UP, and in his words: "This is so miscellaneous to me I have no fucking clue what's
going on." Read as a ruling (NOTES ARE RULINGS): the card he judged stays as he saw it (this round's redraw was
reverted before landing), and PLUMBER registers a VOTE card only for what he feels in the game: the load, the frames,
something on his screen. Plumbing he cannot see goes in the record and the handoff.

## THE ANSWER FIRST

**When the coordinator answers CORRECT, the whole of rule 96 runs as:**

    node tools/bohemia_trail_sweep.js --apply all --correct <the sweep that said CORRECT>

or one kind at a time (`handoff`, `rules`, `rows`, `records`). Without `--correct` it refuses. It moves what the sealed
trail file says (a hand-edited trail file is refused), re-checks every row against the board as it is (a row claimed
since is not touched), refuses the handoff split while a hazard exists, and writes every removed line somewhere,
verbatim:

| what | where it goes |
|---|---|
| a handoff block older than its lane's two newest | handoffs/<LANE>_ARCHIVE.md, newest first, ahead of anything moved before |
| a rule that folds | one line on the page with its pointer; the full text in records/BOHEMIA_EVAPORATED_<date>.md |
| a rule that leaves | records/BOHEMIA_EVAPORATED_<date>.md; a Paolo rule's law file stays and gets its line in gates/bohemia_superseded.txt |
| an OPEN row past 14 silent sweeps | records/BOHEMIA_EVAPORATED_ROWS.md, one line; past 10 it gets "(STALE <date> by rule 96 ...)" |
| a record no lane named in 30 days and no live file reaches | archive/ by git mv, its line in gates/bohemia_superseded.txt |

## PROVED

- **On a full copy of today's board and handoff** (--apply all --root <copy>): the handoff 136,047 -> 9,395 lines,
  51 blocks kept, 1,852 moved to 25 archive files, **0 lines lost** (every line of the old file is in the new START
  file or an archive, counted line for line); the board 1,785 -> 1,592 lines, 42 rules folded or left, 154 rows out,
  3 STALE; every board line that left is in an evaporated record (the 3 not found verbatim are the STALE rows, changed
  in place).
- **On the real working tree, not committed:** the split applied, the HANDOFF gate 10 passed 0 failed; one archive
  deleted, the gate red naming the lost block heads; restored, the handoff byte for byte as it was.
- **THE TRAIL FILE gate, 9 passed 0 failed:** T6 the split refused on a planted hazard and lossless without it; T7 a
  rule leaves with its indented lines and its registry line, a folded rule is one line with its pointer; T8 a row
  leaves, a row goes STALE, a claimed row is untouched; T9 no move without CORRECT, no move from an edited trail file.
  RED CASE: rows matched as OPEN or CLAIMED turns T8 red; a rule cut at its first line turns T7 red; both restored.

## THE HANDOFF GATE NOW READS THE ARCHIVES

The constraint was "a move is never a deletion (the handoff gate changes in the same commit)". It changed BEFORE the
move, which is stricter: every leg that asks "is it still here" also looks in handoffs/ (and archive/handoffs/, as
before); the bulk leg counts the bytes handoffs/ gained in the commit, so a split is a move and a truncation is still
red; the one-door leg counts files, not the handoffs/ folder.

## FOUND AND FIXED THIS ROUND

- **Paolo's newest rules would have left the page.** A rule or row born after the last sweep was counted silent for
  every sweep instead of none; rules 103, 106 and 107 (his, 10/10) came out leaving on the copy. Fixed: born after the
  last sweep is silent 0; a record is counted from the window's start.
- **The hazard read prose.** "RUN TWO had marked..." in PLUMBER's own old block was the one false alarm. A hazard now
  has to be head-shaped: a lane name followed by "(", ":", "--", "- " or a date. 0 hazards today; the planted bullet
  of another lane still trips it.
- LAB (retired 9/4) is read as a lane so its blocks go to their own archive instead of a neighbour's.

## THE DRY RUN NOW (the trail file, 5,572 marks)

The pace: 18 sweeps in 7 days, so 14 silent sweeps is 5.4 days. Rules 109 on the page: 9 fold, 33 leave (rules 0, 1
and 4 among them; the hearback question of round 1 stands). OPEN rows 302: 154 out, 3 STALE. Handoff 136,047 ->
9,395 lines, safe to split. Records 2,486: 390 leave the canon, no laws.

## STILL OWED BY THE ROW

The moves themselves, on the coordinator's CORRECT (or after its NEGATIVE changes a rate). Then the row ships.

## THE MOVES, AS THEY LANDED ON MAIN (10/16, eeb17de5)

The 10/11 moves were committed but never pushed: a safety check on this session's commands refused the last step (it read
a handoff block that told every lane what to do as an instruction planted in the file every chat reads; this lane's
block now reports this lane only). Paolo's next word was VAMILY and the coordinator's sweep AK asked for this round first,
as one commit. The moves were re-run on 10/16's main, not replayed from the stale commit:

| what | before | after |
|---|---|---|
| the START file | 136,863 lines, 1,931 blocks | 6,540 lines, 51 blocks (two a lane) |
| handoffs/ | none | 26 archive files, 1,880 blocks, newest first |
| rules on the front page | 109 | 37 folded to one line, none left |
| OPEN rows | | 46 to records/BOHEMIA_EVAPORATED_ROWS.md, 1 STALE |
| records | | 459 to archive/, each with its line in gates/bohemia_superseded.txt |

The pace changed in five days: 7 sweeps in the last 7 days, so 14 silent sweeps is now 14 days. Checked before the
push: HANDOFF and THE TRAIL FILE green, EXCAVATE, CANON CONSTANTS and REPLY CONTRACT green on the first 10/16 run;
EVERY RUNNING LANE HAS A JOB red exactly as on clean main (RUN TWO at two rows); CANON ROT red on main (73 truly-gone
citations), 64 after. No gate, tool, engine file, slice, law, ticket, skill or CLAUDE.md names a moved record.
