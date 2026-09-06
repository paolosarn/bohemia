# EYES AND EARS -- E1 [pixel tells]: THE CHECKLIST, WHO HOLDS EACH LINE, AND THE TWO
# THIS LANE ADDED
## 9/5/26, lane 17 (eyes-5vql33). MODE: RESEARCH, plus this lane's own instruments.

E1 asked: how is the best pixel art judged, what are the objective tells of bad pixel art
(banding, pillow shading, jaggies, orphan pixels, inconsistent light direction, mixed
resolutions), and build a checklist a machine can partly run against our 45-degree corpus.

**THE REUSE CHECK CAME FIRST AND IT CHANGED THE JOB.** This repo already went to school on
7/27: `laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md` and the 7/28 mastery laws, with
`gates/pixel_craft_gate.py` holding **six** of the tells by machine -- orphan share,
single-use colours, pixel block size, pillow score, light agreement, cluster density. Six
of E1's list were already built. So this round did not rebuild them. It measured the
COVERAGE, added the two big tells nobody holds, and wrote down what is still open.

Checklist: `banks/eyes/BOHEMIA_EYES_PIXEL_TELLS_CHECKLIST_9_5_26.json` -- **15 tells, 6
held before today, 2 added today, 5 still open, 2 human.**
Numbers: `records/BOHEMIA_EYES_PIXEL_TELLS_9_5_26.json` (450 pieces across 16 banks).

---

## FINDING 1: THE CRAFT MACHINE IS POINTED AT 5.7% OF THE ART

| | |
|---|---|
| banks in `banks/` that hold base64 art | **17** |
| pieces of art in them | **1,465** |
| banks the craft audit reads | **2** |
| pieces the craft audit reads | **84 (5.7%)** |

Nothing is wrong with the six measures. They are simply aimed at the act-1 starter set and
its re-cook, which is what they were built for on 7/27, and nobody has widened them since.
The 605-piece seam-fixed surfaces bank, the 330-piece perimeter bank, the 114-piece texture
match bank and the hair sheets have never been through any craft measure at all.

## FINDING 2: THE HAIR IS THE MOST BANDED ART IN THE REPO, AND IT AGREES WITH WHAT MY EYES SAID

Banding, measured across every bank (the ground excluded, so this is the subject and not
the sheet it sits on):

| bank | banding |
|---|---|
| **the face and hair candidates** | **62.0%** |
| the CMU block | 31.8% |
| the act-1 re-cook | 0.7% |
| every other bank, tiles included | 0.0% |

The tile banks read zero because a grimy 45-degree texture has no smooth ramp to band --
that is the craft working, not the detector failing (a deliberately banded ramp reads 31.2%
on the same instrument). **The hair is the outlier by a wide margin**, and it lines up with
what this lane found by eye in round one: the player's own head, seen from behind, is a flat
cream mass with one straight black mark on it. Two different instruments, five hours apart,
pointing at the same art.

Routed to CHARACTER and COOK, with the numbers, not as taste.

## THE TWO TELLS ADDED, AND WHAT THEY COST TO GET RIGHT

**BANDING (craft law 5).** Two colour bands running parallel for their whole length, so the
eye reads a contour the artist never drew. Measured as: the gaps between consecutive colour
boundaries in a row, compared row to row; a band is a median gap that holds within one pixel
for six rows or more.

**IT TOOK FOUR VERSIONS AND THREE OF THEM WERE WRONG. All four are in the tool's own
docstring**, because this lane has now shipped a blind instrument once and nearly shipped
three more:
1. keyed the streak on a run's exact start column -- a band marching diagonally broke its
   own streak every two rows, and a deliberately banded ramp scored **0.0%**.
2. looked for a different colour directly underneath a run -- on a diagonal ramp what is
   underneath is the SAME colour, shifted, so it never fired. Also 0.0%.
3. worked (31.2% on the ramp, 0.0% on noise) but measured the BACKGROUND of a hair sheet:
   four views on near-black, stable gaps row after row, **88% banding on a picture whose
   subject is a few hundred pixels of hair**.
4. dropped any colour covering over 40% as "ground" -- which killed the detector's own bite
   test, because the widest band of a five-band ramp is 40% of a small tile AND IS THE ART.
**The rule that finally works: ground is what SURROUNDS the subject.** A colour is ground
only if it covers over 40% of the picture AND owns over 70% of the border. Bite test after
the fix: banded ramp 31.2%, hand-broken ramp 21.9%, noise 0.0%, two-tone 0.0%, a noisy
subject on black 0.0%.

**JAGGIES AND DOUBLES (craft law 3), and it is PARTIAL, which is stated in the checklist
rather than discovered later.** Run lengths along the drawn silhouette; a step that agrees
with neither neighbour is a jaggy. **It only works on art that HAS a silhouette.** A
full-bleed tile has no outline, so 13 of the 16 banks return nothing -- and the tool prints
`-` for them, never `0.0`, because a checker that reports a clean zero for something it
cannot see is the worst kind of green.

## WHAT IS STILL OPEN, NAMED SO NOBODY THINKS THE LIST IS FINISHED
Anti-aliasing where it does not belong; dithering used as a gradient; corpus-wide seams;
broken outline weight; detail level that does not match across a set (mastery law M5); hue
that does not shift with light (M6). Two more -- contrast spent on the wrong thing, and
whether a piece belongs to this world -- are HUMAN, and E7 is the sheet that turns the
second one into a measurement.

## ROUTED
- **COOK / CHARACTER**: the hair and face sheets at 62% banding, against 0.0% for every
  tile bank. The strand method the 8/27 law describes is what fixes a band.
- **WHOEVER OWNS THE CRAFT GATE**: it reads 5.7% of the art. Widening `BANKS` in
  `tools/bohemia_pixel_craft_audit.py` is a one-line change per bank; the ratchet shape
  already exists so the older banks can be frozen at their own baselines rather than
  condemned.
- **EYES AND EARS**: E6 [walk tells] next, then E7 [reference score].

## SOURCES
- `laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md` (sections 3 jaggies and doubles, 5 banding,
  7 shading and light, 9 resolution and mixels) and `laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md`
  (M3 contrast budget, M5 detail level, M6 hue shift) -- this repo's own school, cited so the
  next chat reads them before building a seventh measure.
- The craft canon those laws are drawn from: the pixel-art community's standard tells --
  banding, pillow shading, jaggies and doubles, orphans, mixels, AA misuse.
