# THE CAST BAKE IS A THIRD OF THE BOOT (PLUMBER 10/9/26, row [first load], round 2; rule 66a, rule 72 line 12)

PAOLO 10/5: "I feel like I gotta wait 40 seconds for this shit to load."
Round 1 (records/BOHEMIA_WHY_THE_DEMO_MAKES_A_PHONE_WAIT_10_9_26.md) proved the wait is the processor, not
the download. This round goes after the processor. KEPT CLAIMED (rule 6): the cut is proven on a copy and
handed over as one command; the live demo changes when RUN runs it.

## THE ANSWER FIRST

The single biggest cost in the boot is binding bodies to their skeletons (the skinner: `cohereBind` and
`_rebind`, inside the demo page). It is about a third of the page's own work, and almost all of it is
repeated work:

| measured on the demo's boot (fresh browser, nobody touching the glass) | |
|---|---|
| skeleton binds before NEW GAME is ready | **1,256** |
| different bodies among them (body x direction) | **174** |
| binds that redo a body already bound | **1,082 (86%)** |
| the most-repeated body | bound **73** times |

The street cast, the family builds and the outfit builds each call `rebuildFromRig`, which binds all eight
directions from scratch.

THE PATCH (four hunks, `tools/bohemia_first_load_hunks.py`, row [bind once]):
1. `cohereBind` counts with two small typed arrays instead of a fresh `{}` per painted pixel, and walks
   only the painted pixels. 2.6 ms -> 0.43 ms a call.
2. `_rebind` reads each candidate bone's segment once per part instead of once per pixel per bone.
3. and 4. a bind cache: the same painted pixels, rest skeleton and candidate bones give back the binding
   they gave before. The key is a hash; the painted pixels are kept and compared in full before a hit is
   used, so a collision is a miss, never a wrong body. At most 256 bodies (about 4 MB).

| | as it is | with [bind once] |
|---|---|---|
| NEW GAME ready, full speed (two runs each, alternating) | 21.3 s | **16.5 s** |
| the demo page's own processor time in the boot (profile) | 13.0 s | **6.8 s** |
| NEW GAME ready, phone speed (4x), served like GitHub Pages | 87.3 s (85.9, 88.6) | **66.6 s (66.2, 67.1)** |
| the title, phone speed | 3.6 s | 3.7 s (not this patch's job) |

## IT DRAWS EXACTLY WHAT IT DREW

"Faster" is worthless if one pixel of one body moves; the rig is ANIMATION's law and the bodies are
Paolo's paintings. Three proofs, none of them self-report:
- **Fuzz:** the new `cohereBind` against the old on 1,600 random grids (four sizes, up to four different
  negative bones, so the order a for-in walks keys is really tested): 0 differences.
- **Every real bind:** a check copy ran the old and the new `_rebind` side by side on every one of the
  1,256 binds of a real boot and compared every bone of every pixel and every box, key order included:
  0 differences.
- **Every cache hit:** the same check copy re-bound each of the 1,082 cache hits from scratch with the OLD
  code and compared: 0 differences.

The one subtle thing, written down so nobody "simplifies" it back: the old vote walked an object with
for-in, which visits integer keys in ascending order and then the negative ones (-1, unbound) in the order
they were first met, and its ">" means that order breaks ties. The new code walks the same order by hand.

## WHAT ELSE THIS ROUND MEASURED (named, not cut: not this lane's file)

- **The frozen fight is half the page's download.** `COMBAT_B64` (the old Dead Eye Dial fight, frozen by
  rule 63) is 2.67 MB of the page's text, **1.31 MB of its 2.50 MB gzipped**. The title waits for the whole
  page to be read, so it is also half of what stands between the tap and the title. It is NOT dead code yet:
  `cityEncounterIn` tries the rebuilt fight first (`nfOpen`) and falls back to the frozen one if that fails,
  and `warmTheFight` builds the frozen fight's frame on the first tap of the start screen. RUN's own
  [first load] row already says "cut the frozen fight's code (63: unreachable, dead weight)"; the fallback
  is the one line that makes it reachable. Retire the fallback and the cutter can drop it.
- **What is left after [bind once]** (full speed, profile): drawing a street person in the map
  (`renderHuman`) 1.5 s, `buildFrame` 1.2 s, the rest-pose `skin` 1.2 s (also repeated per body: the same
  cache shape would take most of it), the map's cells (`realizeCell`, `chunkCanvas`) 1.8 s.

## HOW RUN TAKES IT

    python3 tools/bohemia_first_load_hunks.py                 # dry run: lists the six hunks
    python3 tools/bohemia_first_load_hunks.py --write         # all six: [load patch] and [bind once]
    python3 tools/bohemia_first_load_hunks.py --only "bind once" --write

then re-cut the demo as always. A hunk whose old text is gone refuses the run and writes nothing; a hunk
already in is skipped. The measured copy was made from the same hunks (it differs only by one blank line and the words of one comment).
FIRST LOAD (in the suite, red on purpose) shows the ready time fall when it lands; this lane lowers its
ceilings then.

## WHAT WAS BUILT

- `tools/bohemia_first_load_hunks.py`: the six hunks, dry run by default, refuses on drift, idempotent.
- This record. The VOTE item `plumber-bind-once-10-9`.
- Rule 80's line for this lane in records/BOHEMIA_BETTER_THAN_BATTLE_BROTHERS_10_9_26.md (19).
- Housekeeping: last round's [load patch] row had landed in RUN TWO's section (a heading match on "## RUN"
  caught "## RUN TWO" first); it now sits in RUN's, beside RUN's own [first load], folded into one row.
