# BOHEMIA — STATE OF PLAY (7/17/26)

The repo is born and the chat era is actually over. Everything below is on
`main`, gate-checked, same-day. GIT IS THE MEMORY now and today it started
remembering.

---

## WHAT TODAY WAS

**The repo's first full day.** Sixteen commits on main, and the day broke into
five movements:

### 1. THE BIRTH
The master seed (534 files) landed via 4 part zips + chunk sets. THE ZIP
INCIDENT bit a THIRD time: the zips delivered 480 and dropped 54 — including
bohemia_engine.js and the live slice. The manifest-vs-disk diff caught it in
minutes (THE DIFF IS THE GATE, again), Paolo re-shipped part2+3, and all 534
verified md5-exact. The flat pile became the layout: /engine /gates /laws
/banks /slices /tools /records /questbook /quests /archive, spine docs at
root. Every gate path went repo-aware the same turn.

### 2. THE SLICE TRACK (V11, cleared end to end)
- **LAMPS ON**: 11 dead lamps from real blockgen anatomy, powergrid-ruled
  (all four cells dead, exactly as the handoff recorded), dark pairs 0-4,
  one slot skipped for occupancy. Factory: tools/bohemia_lamps_v11.py.
- **PATROL WIRED**: BOH_PATROL rides V11 verbatim; the roster computes to
  ZERO because nobody patrols the dark — the law visible as absence, gated.
- **MARKINGS ON THE GROUND**: the approved pocket paint drawn into the slice;
  the engine's crosswalk draw MATCHED the bake at the commercial block, so
  the engine grid went in verbatim. The renderer pipeline (cell.mk -> bank ->
  slice) is proven end to end.
- SLICE V11 gate grew 13 -> 33 checks along the way.

### 3. THE ENGINE
blockgen places turn pockets at intersections per the researched Vegas
anatomy (dual left at lanes>=3, right pocket on the curb lane, PL=6, ending
one cell before the crosswalk), markings as cell.mk in the certified
vocabulary. LINE COLOR gate grew 6 pocket checks. ENGINE SYNC caught a stale
inlined copy during the work and the bundle was rebuilt from canon — the
gates earning their keep in real time.

### 4. THE GRAPHICS PIPELINE (a full verdict cycle in one day)
Gap queue art_gaps -> factory -> candidates -> Paolo's thumbs -> volume:
- turn ARROW candidates cooked (48 tiles, white-only, certified bases)
- judged IN CHAT via the marking picker artifact: ALL 84 UP
- volume cooked same turn: BOHEMIA_MARKING_BANK, 14 classes x 16 = 224 tiles,
  no new geometry after approval
- act-1 art_gaps queue is now EMPTY
- WALL BATCH 2 judged: 1 of 48 up (WB4 -> perimeter pool v2). Lesson banked:
  the pack vein is DRY for perimeter walls; variety = variants of the 13
  approved keys.

### 5. THE QUESTBOOK (five batches, its own gate)
- Fresh mines #139-152 at v2 depth: Spec Ops WP, the Undertale corridor, Obra
  Dinn's ledger, MotB's argue-the-god, SH2's verdict engine, Sunless Sea's
  legacy fold, Tyranny's Conquest, Kenshi's unauthored quest + outpost story,
  Sharp and Flat, Deadly Delights, Vampyr's citizen web, Waking Nightmare,
  the Greymarch. **THE 7/16 MINING QUEUE IS CLOSED.** (The "68 of >90" counted
  here originally was RETIRED the same evening: Paolo redefined the target to
  count FULL-MACHINE files only. Real count 65 of >90 after the gate was
  fixed to read option lines the way the format law's template writes them;
  the first post-ruling count of 16 was a gate artifact that hid 49
  law-compliant backfills. The questbook gate prints the number every run.
  laws/BOHEMIA_ADDENDUM_QUESTBOOK_FULL_MACHINE_TARGET_7_17_26.md)
- QUESTBOOK GATE born (gate #16): 10 W-points, option lines, sections, branch
  counts, END markers, .bq blocks parsed through the real parser, numbers
  audited, ARCHIVE freshness enforced.
- The searchable ARCHIVE is back (150+ files, 3,700+ findings) with a
  machine appender; masters + gap matrix machine-appended per batch.
- Law-lock scoreboard: FINALE-IS-A-LEDGER-READ at 5 confirmations (two
  registers); COMPREHENSION-IS-A-BRANCH at 12; the argue-finale has its
  blueprint (#142) and the Network's whisper machine (#150).

## LAWS LOCKED TODAY (Paolo rulings, all gated or recorded same turn)
- **WALL TAXONOMY**: perimeter/community walls vs building walls, pools never
  share; **REJECTION IS PER CLASS** (the 47 batch-2 walls await other classes
  in their own bank). laws/BOHEMIA_ADDENDUM_WALL_TAXONOMY_7_17_26.md.
- Marking verdicts: all 84 UP, volume unlocked (records/BOHEMIA_MARKING_
  VERDICTS_7_17_26.txt).

## THE GATES
16 gates, ~35s full run, ALL GREEN at every commit today. New since the merge:
QUESTBOOK. Grown: SLICE V11 (33), LINE COLOR (24), CARRY (repo-aware),
everything path-fixed for the layout.

## LESSONS BANKED TODAY (the rot-class file)
- THE ZIP INCIDENT, third bite: the diff caught it again. The manifest stays
  at root as the delivery record.
- CARS ARE NOT CROSSWALKS: raw white-pixel detection found parked wrecks;
  row-coverage detection (a zebra spans the road, a car is a blob) fixed it.
  The bake stays ground truth; the engine agreed once the detector did.
- The sync gate flagged its own new gate-file (a regex literal reading as a
  module carrier) and a stale bundle inline — both caught same-session.
- One-shot judging tools stay disposable; verdicts are the record (batch-2
  picker deleted after banking).

## PENDING PAOLO (never decide these)
- **The mining fork**: fresh names / systematic re-mine of the ~72 pool /
  the 136-file backfill queue. RESOLVED same evening: Paolo picked THE
  BACKFILL QUEUE. 65 of >90 full-machine; 84 files remain in the queue;
  26+ graduations to cross the line.
- **The next wall class** (frees the 47 for judging).
- Graphics eye-calls: baked lit lamp at (16,44) + static light at (2,44)
  beside the new grid lamps; patrol owner colors (grays placeholder); the
  101 purple world tiles kill-or-REDMAG; and the rest of the 7/16 forks
  (flashlight color, siren_blue, ASPHALT_BASE rgb, NETWORK zones, suburban
  kit path, alpha absorption session).
- The alpha absorption session (ONE-ALPHA: with Paolo, one session).

## IN FLIGHT / NEXT
- V12-class bake: the next slice generation carries cell.mk markings natively
  (the overlay proved the pipeline; the bake makes it native).
- Blockgen pocket placement could feed the alpha absorption whenever that
  session happens.
- Questbook resumes the moment Paolo picks a lane.

Run everything: `python3 gates/bohemia_gates.py` (~35s) or `--fast` (~20s).
