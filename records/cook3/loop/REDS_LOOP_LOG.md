# THE LOOP ON ONE APPROVED BODY: REDS (rule 108 ROUND TWELVE 1, coordinator sweep AI)
Body: FACTION_LOOKS Reds (the 9/23 runway set he approved: 'Fire'). Each look: 1x before, 1x after, 6x after, 16 px thumbnail. Paint data only; the rig is CHARACTER's.
L01 reds_00.png: (1) the red shirt under the coat went to a dead grey slab, worst thing on him; (2) no light direction, flat brick; (3) vertical scratch dashes left from the source texture; (4) face a blank oval (PORTRAIT's, noted). FIX: inner shirt to Owens black, one light from upper left, median radius 2 -> 3.
L02 reds_01.png: black inner shirt reads (kept). Light too weak to see; the 'scratches' are MY folds: 1px vertical dashes. FIX: light side .28->.45 top .14->.18; folds slant outward .35 and 2px dark, 1px lit.
L03 reds_02.png: light now reads (left lit, right falls off), kept. Slanted folds cross into a lattice: read as stitched seams, worse. Chest ticks persist (source texture). FIX: no drawn folds; median taken fully (clamp .6-1.6 -> .2-3).
L04 reds_03.png: scratches gone, one coat in one light. Now mushy: sleeve-to-body line erased (median crossed rig parts), shading a smear not bands. FIX: median only inside the same rig part; luminance snapped to 8 steps (1/8).
L05 reds_04.png: REAL STEP: crisp bands, the lit left arm reads as its own form, the coat's open front reads. Wrong: the right half and hem fall to one black block (light too strong); hot pink specks at shoulder tip and hand. FIX: light .45->.32, 10 steps, highlights over lum .45 desaturate.
L06 reds_05.png: value balance right, no black block, the coat's front split reads top to bottom. Wrong: a long salmon stripe down the lower left panel, still hot. FIX: highlight desat from lum .45 -> .36.
L07 reds_06.png: no visible change: the stripe is under the highlight threshold. ROOT CAUSE: light is a MULTIPLY, so a lit red gets brighter AND redder = salmon. FIX: the lit side blends toward bone (the light's colour), the shade side stays a multiply.
L08 reds_07.png: the stripe is dusty rose, not salmon. KEEP. State: oxblood coat in one soft upper-left light, a black inner shirt, the lit arm its own crisp form, the coat's open front a clean dark line, no scratches, no pink. Best this body has looked.
## WHAT THE LOOP TAUGHT (rules for the skill file, each earned by a look above)
1. Light is a BLEND TOWARD THE LIGHT'S COLOUR on the lit side and a multiply on the shade side; multiplying a red brighter makes it pink (L07).
2. Smooth INSIDE a body part, never across it; the sleeve edge is drawn by the rig's parts (L04).
3. Snap the shading to steps (8 to 10); a smooth gradient reads as a smear at 112 px (L04, L05).
4. Drawn folds failed twice (1px dashes = scratches, slanted = seams). On a coat at this size the LIGHT makes the form; folds wait for a garment that needs them (L02, L03).
5. A loud shirt under a coloured coat goes BLACK, not grey: grey reads dead (L01).
## HONEST COUNT
8 looks this round, not the 40 the sweep asked. Each look changed one thing and the log says why; the next round continues from L08 on the same body. Still owed: the page on what the master rig needs for a person in real metres from the 112 rig. The face (blank oval) is PORTRAIT's. Nothing in the game; the paint files stay draft and unread by the engine (rule 100).

# 10/16 round: looks 9-12 through the rulebook's look.py (family prop: no person family exists; no pack twin: the packs hold no people)
L09: 113 colours, top 8 at 49%: MY L04 SNAP WAS WRONG by his packs' numbers (crisp to my eye, posterized to the card). Steps off.
L10: 491 colours, top 8 24%; grain 3.9 px (his 1.6-2.2): median radius 3 ate the grain. Radius 1.
L11: grain 3.5, reads as worn wool. Colours stuck near 470: the WALL, 3 shades per garment ramp in the code-drawn source. Edge -36 (black line). Outline to the neighbour x0.8.
L12: EDGE PASSES. 3 of 5 stages pass (silhouette, light, edge). Ramps and detail stop at the source wall. STOPPED: the wall is not a knob.
Total 12 looks on this body. Lessons 4-7 written into skills/bohemia-pixel-art/SKILL.md. The loop's verdict on the method: a paint layer over code-drawn people tops out at 3 of 5; the master rig (camera route) is the road, as the sweep said.
