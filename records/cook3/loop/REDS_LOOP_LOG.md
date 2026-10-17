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

# 10/17 round (rule 110's swing): looks 13 to 40 ON THE RIG'S RENDERED MAN (DIRECTION's master rig round two, 564e1b1)
The wall of looks 10 to 12 was the source: three shades a ramp in the code-drawn body. The rig now renders a 1.72 m man
(a mannequin, the pipe's proof) in eight facings with a walk at six keys, so the same loop moved to that body:
tools/bohemia_cook3_the_loop_on_the_rigs_man.py reads the render's shading, strips the decal, maps it through the Reds
materials, lays his dirt tile's grain in place as the weave. One knob a look; every look's knobs are saved beside it
(cook3_rigman_reds_NN.knobs.json); look.py judged every one (cycles 5 to 32 of cook3_person_reds.loop.jsonl).
L13 one flat salmon body: the mannequin is white, so every pixel read as lit. L14 gamma 2: nothing. L15 less bone:
nothing, so the bone was never the root. L16 accent #c0392b -> #7a2a22: THE BASE WAS THE FAULT; oxblood at last.
L17 black 0.5 (the read stretched): FORM, the arm lit on top and dark under. L18 shade .15: span 96. L19 white 1.0:
the lit clamp was 12.7% of the body as one colour; gone. L20 black .35: the dark clamp gone; top 8 at 11.4.
L21 tex .15: nothing visible; AND the measurement: 1,664 opaque pixels can never hold the card's 2,330 colours (a
96x96 tile's number); the honest row for a sprite is DENSITY, his 0.81 colours a pixel. L22 tex .6: THE CLOTH HAS A
SURFACE; DETAIL passes. L23 sun_y .3: the hem falls to shade; by band, a dark coat tops out at 80 of 255, so the span
comes from skin and highlights. L24 hi .30: the highlights back without salmon, because the stretch keeps them to the
pixels that earn them. L25 gamma 1.4: daylight. L26 tex_rgb 1.0: 1,405 colours, 0.84 a pixel, OVER HIS DENSITY, but
hot specks. L27 tex_rgb .4: specks gone, 0.76 a pixel. L28 hair to the brow. L29 skin floor .5: still a brown face
under a bone cap; the strip of all 14 frames showed why: THE SKIN SAMPLE HIT THE TWIN'S BROW. L30 skin_band .09-.17:
a pale face; THE SPAN ROW PASSES. L31 head .18: the collar stops cutting the lower head like a blindfold. L32 (N) the
collar off the back of the neck. L33 (N) hand_mode 1: the hand measured from the shoulder; a hanging arm stops
reading as skin to the elbow. L34 hair_cap .6: a brown taper, not khaki. L35 skin floor .3: the face takes the
light. L36 (E) passes 4 of 5; the hem is a ruler line: the model's coat mesh, not a knob. L37 (walk k2) the knobs hold
across keys. L38 edge_k .85: the render's own rim was darker than a soft ring; -19 -> -11. L39 the strip of 14. L40 the
sheet beside the game's own Reds.
## WHERE IT ENDS
Every frame: 4 of 5 stages pass (silhouette, light, detail, edge); in RAMPS the span passes, top 8 sits at 11.3 against
11, and the colours row is the tile's number a sprite cannot hold (density 0.74 a pixel against his 0.81). The best
this lane has had on any body: the Reds' order of colours (taper, face, black collar, oxblood duster, boots) on a man
who turns and walks, with a weave. WHAT ONLY THE MODEL FIXES: the face (a logo plank; PORTRAIT's, a model with a
face), the garment cut (a hem by height is a ruler line; a coat mesh ends where it ends), the hand (a band, not a
shape). All three are on the rig page: records/BOHEMIA_COOK3_WHAT_THE_RIG_NEEDS_FOR_A_PERSON_10_17_26.md.
## WHAT THESE 28 LOOKS TAUGHT (into skills/bohemia-pixel-art/SKILL.md as lessons 8 to 12)
8. Read a render's shading stretched between its own dark and its own white, or the clamps make flats (L18, L19, L20).
9. When a colour is wrong, test the BASE before the light: the salmon was the base colour, and two light knobs did
   nothing (L14 to L16).
10. The colour count on a sprite is DENSITY, colours a pixel, against his 0.81; the card's 2,330 is a tile's number (L21).
11. A weave is his tile's detail with its fill taken out, laid in place, its colour at a low strength (L22, L26, L27).
12. Look at every facing before trusting one: two faults (the skin sample, the hand rule) were invisible from the
    front (L29, L32, L33).
## HONEST COUNT
40 looks on this body across two rounds (12 on the code-drawn Reds, 28 on the rig's man), each with its words. Nothing
in the game; the paint is a tool and a data file the engine never reads (rule 100). The sheet is in VOTE as a
PLACEHOLDER with its twin (cook3-the-reds-loop-on-the-rigs-man-10-17), never as FINAL (ROUND THIRTEEN).
