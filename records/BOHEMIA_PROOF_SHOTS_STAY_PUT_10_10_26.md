# PROOF SHOTS STAY PUT (PLUMBER 10/10/26, row [proof shots churn])

The coordinator, 10/9: "five commits in seven minutes (148dab55 to e5330501) re-committed RUN TWO's
settlement proof shots (1.8 MB PNGs) because the gate re-shoots on every rebase and the bytes differ by a
few hundred; the repo grows and the log drowns." The row's two halves: proof shots out of git (or
byte-stable) with a gate, and the handoff gate refusing committed conflict markers (SOUNDS found them,
ed11dc55).

## THE ANSWER FIRST

**A gate run no longer changes anything git tracks.** Five gates wrote their screenshots straight into
slices/vote/ (published, tracked) on every run. They now write to a scratch folder unless asked:

    node gates/settlement_screen_gate.js            # pictures to os.tmpdir()/bohemia_proof_shots/
    node gates/settlement_screen_gate.js --shoot    # the VOTE picture, on purpose
    BOHEMIA_SHOOT=1 node gates/...                  # the same, for a gate run by another tool

**And half a merge conflict in the handoff is now caught.** The 10/5 commit SOUNDS cleaned up had the
middle and end markers without the start; the old test needed all three.

## WHAT WAS MEASURED FIRST

Re-commits of a single picture in the clone's last five days (git log, every image path):

| picture | re-committed |
|---|---|
| RUN2_THE_SETTLEMENT_SCREEN_BARBER_10_1.png | 13 |
| RUN2_THE_SETTLEMENT_SCREEN_SMITH_10_5.png | 12 |
| RUN2_THE_SETTLEMENT_SCREEN_RAIDED_10_5.png, _MARKET_DAY_10_5.png | 9 each |
| RUN2_THE_SETTLEMENT_SCREEN_10_1.png, _FORTRESS_10_1.png | 5 each |
| RUN2_THE_LOOP_PAID / FIGHT / BOARD _10_1.png | 4 each |
| RUN2_THE_ROSTER_10_9.png | 3 (once by SOUNDS, f5b94ea, who had only run the gate) |

The five writers: settlement_screen_gate.js (nine pictures), one_file_loop_gate.js (four), climbing_gate.js
(two), roster_screen_gate.js (one), the_rebuilt_fight_plays_gate.js (five). None of them reads its picture
back, so where it lands changes no leg.

**Byte-stable is not on offer.** The roster gate run twice on one tree, nothing changed between, writes two
different files (255,184 bytes against the committed one's): a screenshot of a living page carries its
clock and its motion. So the honest place is outside git, and the picture in VOTE is refreshed by the
lane that owns it when what it shows has changed.

## WHAT WAS BUILT

- **tools/bohemia_proof_shot.js**: `proofShot(trackedPath)` returns a scratch file by default and the
  tracked path with `--shoot` or BOHEMIA_SHOOT=1. The pattern was already in the fleet (people, camp_dial
  and lab take a PROOF_DIR that defaults to the tmpdir); this makes it one helper.
- **The five gates** route every shot through it: one import and one wrapped path each. Their own legs are
  unchanged.
- **gates/proof_shots_gate.js, in the suite as PROOF SHOTS STAY PUT**, about 5 s, 9/0:
  - S1-S6, the detector planted both ways (a direct path, through a const, through an arrow that builds
    the name, an image written by hand; proofShot, the tmpdir and a tmpdir-default PROOF_DIR are clean);
  - P1, every gate swept (840 files, 15 put pictures somewhere): 0 into git. Main before this row: **21**,
    all five gates, caught by planting their old text;
  - P2, a real roster-screen run leaves every tracked picture's git status as it was, and its picture is in
    the scratch folder. With main's roster gate put back, P1 and P2 both went red and the committed
    picture was rewritten (restored);
  - P3, BOHEMIA_SHOOT=1 hands back the tracked path, and without it the scratch one.
- **gates/handoff_gate.js**: any two of the three conflict markers in order is a conflict (start then
  middle, middle then end, start then end). Replayed on acc8757's own copy of the handoff: the old rule
  read it clean, the new one reads it conflicted; today's handoff and the one record that quotes a marker
  (8/27, a lone end line) read clean. Five planted cases; HANDOFF 10/0.

## THE FIVE GATES, RUN AFTER THE CHANGE

ROSTER 13/0 (4 s), CLIMBING 15/0, THE REBUILT FIGHT PLAYS 118/0, SETTLEMENT SCREEN 58/1, ONE-FILE LOOP
12/1, and git's picture status unchanged across all five. The two reds are identical with main's own,
unmodified versions of those gates (the keeper's first line; hire one at the hall), so they are RUN TWO's,
one line in its section.

## NO VOTE ITEM THIS ROUND, AND WHY

Nothing he can see or hear changed: the pictures in VOTE are the same files. Rule 29 (text items are
boring) and the queue of sheets already waiting for his thumb say a sheet about git would be noise in his tab.
