# EYES AND EARS -- E7 [reference score]: TEN YES/NO QUESTIONS, SEVEN OF THEM MACHINE
## 9/5/26, lane 17 (eyes-5vql33). MODE: RESEARCH, plus this lane's own instruments.

E7 asked for a scoring sheet for the compare-to-the-world law: given a cook and its
reference side by side, ten yes/no questions a machine or a fresh chat can answer, so that
a comparison is a measurement and not an opinion.

**Ten questions. Seven a machine answers, three only a person can.**
Sheet: `banks/eyes/BOHEMIA_EYES_REFERENCE_SCORE_SHEET_9_5_26.json` (draft:true).
Tool: `tools/bohemia_eyes_reference_score.py COOK REF` -- a file path, or `BANK.txt:id` for
art that lives in a bank.

**REUSE CHECK.** `gates/texture_match_gate.py` already derives a ruler from the packs Paolo
BOUGHT and holds painted tiles to four numbers -- colours per tile, edge energy, grain,
saturation. This does not re-measure those for tiles. It generalises the idea to ANY pair of
pictures (a garment, a face, a whole screen) and adds the four that gate does not ask: value
band, grain SCALE, light direction, and whether the thing still reads at play size.

## THE SEVEN A MACHINE ANSWERS
1. **Same detail order?** local contrast within 2.5x of the reference.
2. **Same colour density?** unique colours per 1,000 px within 3x.
3. **Same saturation budget?** median saturation within 0.10.
4. **Same value band?** the 5th-95th percentile luminance bands overlap by 60%.
5. **Same grain scale?** the structure repeats at a similar size.
6. **Same light?** the lit corner agrees.
7. **Does it still read at play size?** shrink both to 24 px; the surviving contrast within 2x.

## THE THREE ONLY A PERSON ANSWERS
8. **Is it the same MATERIAL?** Name what each picture is made of. Two different words means
   the numbers do not matter.
9. **Does it belong to THIS world?** The law's real question. No machine answers it.
10. **What would a stranger call each picture, in one word?** If the words differ, look again.

## VALIDATED BEFORE IT WAS USED
- a picture against itself: **7 of 7**
- a water tile against a wall tile: **3 of 7** (colour density, saturation, value band and
  read-at-size all say no)
- the act-1 re-cook against the art Paolo actually approved, all 42 shared tiles:
  **median 6 of 7**

## AND THE FINDING THAT CAME OUT OF THE VALIDATION

Running the sheet across those 42 tiles says where the re-cook and the approved art part
company, and it is not where anyone would have guessed:

| question | fails |
|---|---|
| same colour density | **32 of 42** |
| same light | **10 of 42** |
| same value band | 4 |
| same grain scale | 4 |
| same detail order | 3 |
| same saturation | 3 |
| still reads at play size | 1 |

**THE RE-COOK CARRIES ABOUT ONE SIXTH THE COLOUR DENSITY OF THE ART HE APPROVED** (median
0.16x). The sidewalk tiles are at **0.03x** -- three percent. Some of that is the craft
working on purpose: law 0 says a tile is decisions, not a shrunk painting, and the re-cook
was built to those thresholds. But the texture-match gate's own finding, from a completely
different direction, is that painted art here is too smooth and too clean beside the packs
he BOUGHT. **Two instruments, built months apart for different reasons, now point the same
way.** That is worth a ruling from DIRECTION rather than another quiet cook.

**AND TEN OF THE FORTY-TWO TILES READ AS LIT FROM A DIFFERENT CORNER than the approved tile
of the same name** -- road_0, road_1, road_2, road_centre, dirt, garage_bottom, roof_slope,
roof_hipTL, roof_hipBR, roof_deck. The craft law says one key from the upper left. The
pixel-craft gate checks that by PAIRS (wall_end_l brighter than wall_end_r), which is the
right test for a form; this is a different question -- whether the tile agrees with the
tile it replaced -- and nothing was asking it.

## HONEST LIMITS
- **The reference library is URLs, not pixels.** `reference/library/` holds INDEX.md entries
  pointing at real-world and pixel references on the web, so the machine half of this sheet
  cannot be run against most of them from in here. It runs today against anything in the
  repo -- his bought packs, any bank, any screenshot -- and for a library entry the same ten
  questions go to a fresh chat with both pictures in front of it. That is why the sheet is
  written to be answerable BY EITHER.
- **Seven yes does not mean good.** It means built to the same recipe. Questions 8, 9 and 10
  are the ones that decide, and they are deliberately not a machine's.

## ROUTED
- **DIRECTION**: the colour-density gap (0.16x median, 0.03x on sidewalks) against the art
  he approved, now confirmed from two independent instruments.
- **COOK**: the ten tiles whose light disagrees with the tile they replaced.
- **SHARED / whoever takes REFERENCE-CHECK-GATE**: this sheet is the scoring half of that
  row. The gate sweeps for a `REFERENCE CHECK:` block; this says what a passing check
  should contain.
- **EYES AND EARS**: E5 [missing sound] next, then E8 [first minute], then E9's standing duty.
