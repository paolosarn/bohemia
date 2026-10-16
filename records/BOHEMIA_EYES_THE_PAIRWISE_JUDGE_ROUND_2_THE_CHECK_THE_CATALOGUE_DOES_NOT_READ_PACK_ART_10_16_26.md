# EYES AND EARS -- [the pairwise judge] -- ROUND TWO: THE CHECK
### 10/16/26 -- session eyes-5vql33

Row (rule 108 ROUND TEN (3) and (4)): build the judging recipe every art lane calls -- two
candidates and the pack twin on one strip, one plain question, EYES answers, never the maker,
never a score; the squint (8x8, 16x16) on every card; a fault tag from the catalogue on a NO.
Round one found the catalogue and the strip-compositing shape already built. This round connects
them and proves it on three real pending cards.

## THE TOOL: tools/bohemia_eyes_pairwise_judge_10_16_26.py

Given candidate A, candidate B and a twin (three images), it composites a one-art-pixel-to-one-
phone-pixel strip plus a literal 8x8/16x16 squint of each candidate (round one's own finding: NOT
the Gaussian blur tools/bohemia_look_again.py already calls "squint" under the same word), runs
the eight-fault catalogue on A and B (imported from tools/bohemia_pixel_craft_audit.py and this
lane's own tools/bohemia_eyes_pixel_tells.py, never re-measured), and computes the real YIQ
perceptual distance from each candidate to the twin as the proof line. The verdict -- which
candidate, the one fault tag on a clear loser -- is written by EYES looking at the strip; the tool
arms the decision, it does not make it.

## TWO REAL BUGS CAUGHT BEFORE TRUSTING ANY NUMBER

**FIRST, a background-compositing mismatch.** The pack twin files are RGBA with a fully
TRANSPARENT background; a naive `.convert('RGB')` keeps whatever colour happened to sit under
alpha=0 (here, pure black), while the composited card the candidates were cut from fills its
background with the sheet's own colour. Comparing those two backgrounds as if they were art gave
batteries a false 47.7% "distance to its own twin" on a pixel-identical cut. FIXED: composite the
twin onto the exact background colour the card itself uses (read from the sheet's own manifest)
before any distance is computed. After the fix: 0.00% for both batteries and both water, confirmed
pixel-identical, direct cuts (rule 82a's own promise, verified rather than assumed).

**SECOND, bigger: the fault catalogue does not transfer to real pack-sourced art.** Run on the
real pack tiles, orphan share read 87-94% -- almost every pixel "an orphan." Before reporting that
as eight real faults, RULE ZERO controls were run first (this lane's own standing law): a flat
solid-colour square reads 0.0, random per-pixel noise reads 1.0 -- the function itself is sane. A
pack tile's own numbers (2,978 unique colours across 4,163 opaque pixels, an average colour used
1.4 times) show WHY: these are continuous-tone, softly shaded HD renders, not flat colour-block
pixel art. Orphan share, pillow score and banding were all built and calibrated to catch defects
in CODE-DRAWN, flat-shaded pixel art (this lane's own tools say so in their own docstrings) --
applied to painterly pack cuts, a real, approved, zero-defect asset reads as "almost entirely
faulty," which cannot be right, because rule 82a makes these pack tiles THE REFERENCE everything
else is judged against. NAMED, NOT HIDDEN: the catalogue is the right tool for code-drawn
candidates and the wrong one for pack-sourced cuts; for the two icon cards below, the fault
numbers are reported but flagged as not meaningful, and the real signal is the 0.00%
distance-to-own-twin (confirmed fidelity) plus the eye.

## THE THREE REAL CARDS, FROM ONE GENUINELY PENDING VOTE ITEM

ui-the-six-at-pack-pixels-10-13 (records/target/BOHEMIA_VOTE_REGISTRY.json, sha "pending",
verdicts list checked -- no verdict landed yet; a real undecided card, not staged for this round).

**THE CREW BUTTON** (records/eyes_pairwise_judge/crew_button_strip.png): A sits CREW as bare text on
dark glass; B sits it on a cream receipt card, the same material NOTES already ships on this bar.
The raw YIQ number (A 88.3% from twin, B 90.5%) says A is marginally closer -- WRONG TO TRUST HERE,
NAMED PLAINLY: the NOTES crop's margin happens to share A's dark background by coincidence, which
drags the number toward A for a reason that has nothing to do with the button itself. Looking at
the strip settles it: B has a real card shape, a visible outline and NOTES' own cream material; A
is text floating with no button object at all. **VERDICT: B, clearly, by eye, with the number's
own limit stated rather than followed blindly.**

**THE BATTERIES ICON**: A, two loose rolling cylinders; B, a bundled 4-pack with visible + terminal
nubs on top. Both are confirmed real, faithful pack cuts (0.00% from their own twin, the fault
numbers not meaningful per the finding above). At the 8x8 squint, A reads as a diagonal streak that
could be almost any cylindrical object; B reads as a solid, blocky unit with a more specific
silhouette. **VERDICT: B, a closer call than the button, on silhouette legibility at the squint.**

**THE WATER ICON**: A, a stockier bottle; B, a taller, slimmer bottle closer to the common
commercial water-bottle proportion. Both confirmed faithful cuts. At the squint, B's elongated
silhouette reads more specifically as "a bottle" than A's blockier one. **VERDICT: B, also a
closer call, same reasoning.**

## WHAT THIS IS, AND WHAT IT IS NOT

This is NOT a FINAL for Paolo (rule 100: FINAL is his word alone) and not a kill -- these verdicts
are this lane's own proof that the recipe works end to end on real material, for the pending card
he will still see and still pick A, B or NO on himself. Nothing here overrides his own choice.

## ROUTED

- UI: this lane's own read on the pending ui-the-six-at-pack-pixels-10-13 card leans B on all
  three sub-comparisons judged -- informational, his own pick still decides it.
- PLUMBER / DIRECTION: the fault catalogue (orphan share, pillow score, banding) is well-built for
  code-drawn pixel art and gives false, meaningless high-fault readings on real pack-sourced cuts;
  before rule 108 (4) wires a NO's fault tag into an automatic measured check, the catalogue needs
  a pack-art exemption or a second, separate calibration, or every pack cut will auto-fail a check
  built for a different art style entirely.

## SHIP TEST FOR THIS ROUND

A real, reusable tool built from pieces this lane already had, proven on three genuinely pending
cards from one live VOTE item, two real bugs caught and fixed or named before any number was
trusted (a background-compositing mismatch, fixed; a tool/subject-matter mismatch, named and
routed, not silently worked around), three honest verdicts with the strips attached, and the
eye overriding a misleading number exactly once, explained rather than hidden. [the pairwise judge]
IS ANSWERED for this round; it stays open as a standing recipe, called again the next time two
real candidates exist to judge.
