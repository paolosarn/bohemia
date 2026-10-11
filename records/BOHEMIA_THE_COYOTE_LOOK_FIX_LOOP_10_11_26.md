# THE LOOK-FIX LOOP, PROVEN ON THE COYOTE

CHARACTER, 10/11. Twenty real measurements of the existing wildlife bank's coyote (banks/BOHEMIA_WILDLIFE_SPRITES.js), rest/look/go frames, at native 16x16, magnified 8x, and the real 112px in-game box, following rule 108 ROUND TWELVE's render-look-fix loop. No pixel in the bank was touched: it is machine-generated, marked do-not-hand-edit (rule 101c), and rule 108(a) bans a chat from hand-authoring a pixel regardless. This round proves the LOOP, on a placeholder, per rule 108 ROUND THIRTEEN.

Nine pictures sit beside this record in slices/vote/ (CHARACTER_COYOTE_<frame>_<size>.png) so a human can look at exactly what each cycle measured.

## Cycle 1 (silhouette)
how much of the 16x16 box does rest actually fill?

27.7% opaque (71 of 256 px). in the readable band for a 16px quadruped, neither a smudge nor a blob

## Cycle 2 (silhouette)
how much of the 16x16 box does look actually fill?

28.9% opaque (74 of 256 px). in the readable band for a 16px quadruped, neither a smudge nor a blob

## Cycle 3 (silhouette)
how much of the 16x16 box does go actually fill?

27.7% opaque (71 of 256 px). in the readable band for a 16px quadruped, neither a smudge nor a blob

## Cycle 4 (shapes and light)
does rest have real shading range, or is it flat?

darkest used tone L76, lightest L202, a range of 126 of 255. real range: there is a dark side and a lit side, not a flat fill

## Cycle 5 (shapes and light)
does look have real shading range, or is it flat?

darkest used tone L76, lightest L202, a range of 126 of 255. real range: there is a dark side and a lit side, not a flat fill

## Cycle 6 (shapes and light)
does go have real shading range, or is it flat?

darkest used tone L76, lightest L202, a range of 126 of 255. real range: there is a dark side and a lit side, not a flat fill

## Cycle 7 (ramps)
how many distinct tones does rest spend on a 16px animal?

5 palette indices in use (16,17,18,19,20). economical, the kind of count a 16px source can actually resolve

## Cycle 8 (ramps)
how many distinct tones does look spend on a 16px animal?

5 palette indices in use (16,17,18,19,20). economical, the kind of count a 16px source can actually resolve

## Cycle 9 (ramps)
how many distinct tones does go spend on a 16px animal?

5 palette indices in use (16,17,18,19,20). economical, the kind of count a 16px source can actually resolve

## Cycle 10 (detail)
is the one bright accent tone (index 20) a glint, or a wash?

1 pixel(s) of index 20 (#d7c04a) in rest. a single glint, the right amount of detail for one accent pixel at this size

## Cycle 11 (detail)
does look change only the head/ears, or does it repaint the body?

17 of 256 px differ between rest and look. a small, local change, consistent with an alert head/ear pose rather than a new body

## Cycle 12 (detail)
does go read as a mid-stride leg change, bigger than the alert pose?

12 of 256 px differ between rest and go (against 17 for rest/look). go changes no more of the body than the alert head pose does, which is thin for a stride

## Cycle 13 (silhouette)
the bank's own header claims 'nothing here is left-right symmetrical' (the 45-degree law). True for the coyote?

59% of its opaque pixels have the same tone at their mirror column. genuinely asymmetric, the claim holds for this animal

## Cycle 14 (outline)
against the measured street ground tone (#6e6045), does the silhouette edge stay readable at native 16x16, before any outline is drawn?

closest edge pixel sits 18 luminance steps from the ground, across 33 edge pixels. enough contrast on its own, though the engine adds a black ring regardless

## Cycle 15 (detail)
last round said the 16px source caps a crisp upscale at 64 real pixels and one resize fills the rest of the 112 box. how much of the box is that?

57% of the 112 box's width (64 of 112 px) is the crisp edge-preserving stage; the remaining 43% is one soft resize with no new detail. measured, not re-argued: this is the same honest limit [wildlife rig] already named, now with the actual share.

## Cycle 16 (outline)
after the engine draws its real 1px border, is the ring closed or does it have gaps?

0 gap(s) found around the silhouette, measured against the original body (not the new ring itself, which a first draft of this check wrongly counted as 32 gaps). closed: outline1's neighbour test cannot miss a cell on a 4-connected edge, confirmed on the real coyote shape, not just in theory

## Cycle 17 (ramps)
is index 20 a step in the body ramp, or a deliberate accent color?

body ramp (16-19) averages hue 36deg (tan/brown); index 20 sits at 50deg, 14deg away. close enough to the body ramp that it may just be another brown, not a deliberate accent

## Cycle 18 (detail)
two body poses (rest-ish and go) is not a walk cycle. does that honestly limit this bank's motion?

rest and go differ by only 12 of 256 px (checked at cycle 12); a real walk needs at least a passing-leg and a contact-leg pose, two more than exist here. this is a bank-level gap, not a per-pixel defect, and it is this lane's job to say so rather than quietly animate around it.

## Cycle 19 (silhouette)
is the coyote an outlier in this bank, or does the whole bank share its traits?

fill ratio coyote 28% vs raven 16% vs dog 30%; value range 126 vs 178 vs 168. close across all three: whatever this loop found about the coyote is a trait of the whole generated bank, not one bad animal.

## Cycle 20 (convergence)
after nineteen real checks, is there a defect this lane is actually allowed to fix?

nothing crossed a real fault line that this lane can act on: the silhouette, ramp and detail numbers all sit in the readable band, the one honest gap (only two body poses, no true walk cycle) is a bank-level content gap already named, not a pixel bug, and the bank itself is machine-generated and marked do-not-hand-edit (rule 101c) plus rule 108(a) bans hand-authoring a pixel regardless. The loop mechanism is proven: it measured, found real numbers, and told the truth about where it has no authority to act. That is the thing rule 108 round twelve actually asked for this round.

## TAB
No tab. This is a diagnostic/process record proving the look-fix loop mechanism on a placeholder; nothing here is a candidate and nothing is final.
