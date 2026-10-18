# COOK [the block war's cover] 10/18/26: SIX THINGS A MAN STANDS BEHIND IN A CITY FIGHT, MODELLED AT THE SOURCE

QUARTERMASTER 10/18 | cooking: a sandbag wall | he owns: 17 tiles in 1 packs that match (16 approved, 1 never judged) | packs: 5. Barricades and defenses 17/16 | nearest: 5. Barricades and defenses#2 96x51 approved | verdict: COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a) | index 2bfdc44b
QUARTERMASTER 10/18 | cooking: a chain-link fence and gate | he owns: 30 tiles in 2 packs that match (29 approved, 1 never judged) | packs: 13. Fences and wire 19/19; 6. Chain link fences 11/10 | nearest: 6. Chain link fences#0 96x73 approved; 13. Fences and wire#10 96x94 approved | verdict: COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a) | index 2bfdc44b
QUARTERMASTER 10/18 | cooking: a shipping container | he owns: 40 tiles in 1 packs that match (25 approved, 15 never judged) | packs: Cargo, crates and containers 40/25 | nearest: Cargo, crates and containers#36 96x96 approved | verdict: COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a) | index 2bfdc44b
QUARTERMASTER 10/18 | cooking: a propane tank | he owns: 75 tiles in 2 packs that match (25 approved, 50 never judged) | packs: Cargo, crates and containers 40/25; 9. Boilers and tanks 35/0 | nearest: Cargo, crates and containers#22 94x96 approved; 9. Boilers and tanks#25 never judged | verdict: COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a) | index 2bfdc44b
QUARTERMASTER 10/18 | cooking: a rubble mound | he owns: 18 tiles in 1 packs that match (18 approved, 0 never judged) | packs: 9. Rubble and debris 18/18 | nearest: 9. Rubble and debris#1 96x75 approved | verdict: COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a) | index 2bfdc44b
QUARTERMASTER 10/18 | cooking: a cart corral | he owns: 0 tiles in 0 packs that match (0 approved, 0 never judged) | packs: none | nearest: 15. Street props#21 66x96 approved | verdict: OWNS ZERO, BUY OR COMMISSION (no cart and no corral in 294 packs; the twin is his wire bin; the carts are last round's model) | index 2bfdc44b
(read from the index by tools/bohemia_quartermaster_line.py through the sheet tool, never typed)

WHY THIS ROW. The two OPEN rows above it on the board were RETIRED by rule 115 (newest date wins): [the hero brief]
asked for a hand-drawn character in eight directions from a paid artist, a road 115a names dead; [generate against the
pack] asked for six generated assets whose roads are now the rig (lamp, wreck, gun, shipped 47e7de8), the starred face
(115h) and the packs (115b). The next on the jump list was [board assets]'s own NEXT: his 9/29 'MOST FIGHTS ARE BLOCK
WARS' city gaps, and its count (records/BOHEMIA_THE_BOARD_ASSET_COUNT_9_30_26.txt): COVER 389 pieces against 2,899
blockers, the thinnest kind on any board. Rule 115a puts every prop on the rig, so the gap is cooked there. Claimed
fcc3b873 before work; each prop committed the moment its card passed (rule 116d).

## HOW THE PACK DID IT (rule 100c), his six twins measured with the same card the rig uses (check.py, family prop)

| twin | size | colours | value p5 to p95 | dark outline on the edge | his own tile on the prop card |
|---|---|---|---|---|---|
| 5. Barricades and defenses#2 (sandbags) | 96x51 | 3,049 | 2 to 199 | 88% | all in |
| 6. Chain link fences#0 | 96x73 | 1,388 | 0 to 125 | 18% | OUT: colours 1,388; top eight 21.3% |
| Cargo, crates and containers#36 | 96x96 | 5,853 | 3 to 184 | 99% | OUT: value span 105 |
| Cargo, crates and containers#22 (gas bottles) | 94x96 | 4,989 | 2 to 192 | 79% | all in |
| 9. Rubble and debris#1 | 96x75 | 3,491 | 0 to 193 | 56% | OUT: stray pixels 19.6% |
| 15. Street props#21 (wire bin) | 66x96 | 3,514 | 0 to 153 | 55% | OUT: top eight 11.7% |

What that says. (1) His pack draws every one of these as a 96 px icon whatever its real size: a 6 m container and a
0.6 m gas bottle land in the same box. The rig draws true size (57 px a metre), so mine run 151 to 358 px. (2) He
closes the silhouette with a near-black line on 55 to 99% of the edge pixels (the fence, all air, 18%); the rig's ring
is a soft 8 values darker by DIRECTION's card. (3) Four of his six twins miss a row of the very card my renders are
held to: the see-through things (his fence, his wire bin) cannot carry 2,330 colours or keep the top eight under 11%,
because most of their pixels are air and wire. Light: every twin is lit from the upper left, the rig's one sun.

## WHAT WAS MADE

tools/bohemia_cook_model_props.py gained six builders (sandbags, fence, container, propane, rubble, corral) and five
helpers: sack (a filled bag: a superellipsoid, the tied end gathered, the bottom pressed flat), tubes (many thin bars as
one mesh: chain-link, razor wire, rails), diamonds (the chain-link weave clipped to a panel), trap (one trapezoid
corrugation of container steel), chunk (a broken lump, every corner knocked its own way, the jitter per axis so a floor
slab breaks in plan and not in thickness), import_model (an earlier prop brought in whole and untouched). The builder now
prints the model's size in metres and its materials. Every model went through tools/bohemia_direction_master_rig.py
unchanged, round six's recipe, with --real-length and --real-dims: zero breaks in every rig.json, every proportion
inside the guide's 12% tolerance, scale 0.99 to 1.01 (true size).

| prop | sha | real size | kind on a fight board | materials | card | out |
|---|---|---|---|---|---|---|
| sandbag wall (cook_sandbags) | a66c2975 | 2.65 x 0.96 x 0.84 m | COVER (under the 1.3 m chest line) | 3 | 1 of 8 | value span 110 |
| chain-link run and gate (cook_fence) | 0fcb8ccc | 5.54 x 0.95 x 2.29 m | BLOCKER you see through (63% of a panel opaque) | 4 | 2 of 8 | colours 2,076; value span 111 |
| shipping container (cook_container) | 3c3a61f0 | 6.06 x 2.63 x 2.57 m | BLOCKER you climb (high ground) | 5 | 2 of 8 | value span 117; grain 2.57 |
| propane tank (cook_propane) | d912d021 | 3.02 x 1.05 x 1.27 m | COVER that stops a man | 5 | 2 of 8 | value span 112; grain 2.47 |
| rubble mound (cook_rubble) | 0cc42d2d | 4.59 x 3.53 x 1.37 m | MOUND (high ground, rule 59) | 5 | 0 of 8 | none |
| cart corral (cook_corral) | 70c84c0e | 6.29 x 2.37 x 2.02 m | COVER that stops a man | 5 | 1 of 8 | value span 112 |

The odd thing on each (the guide's one asymmetric thing): the sandbags' top right bag burst, its sand poured into a pile
at the foot, one bag fallen; the fence's gate standing open, the chain that held it cut and hanging off the latch post
with the padlock still shut; the container's window torch-cut in the side, the panel leaning under it, a pale blanket
half drawn inside (somebody lived in it); the propane tank's dome lid thrown back and a cut hose run off the open valve
(somebody drained it); a white bathtub tipped up at the rubble's foot with two lumps fallen in; one cart left outside the
corral on its side.

The corral holds LAST ROUND'S CART four times nested: reference/models/bohemia/cart.glb imported whole, never remodelled,
the bag taken out of all but the last, same-named materials made one, so the pipe is the cart's own wire and the sign its
handle red and the whole thing stays inside five materials. Two rounds off one table.

## THE LOOP (every cycle looked at, 2x to 3x, beside his tile)

- SANDBAGS: (1) boxy pale slabs with no dark between them (value span 105), two green poly bags that read as grey stones,
  a sand run down the face that stood up as a pole; (2) rounder bags, warmer burlap (the robot's mustard clay), no poly,
  a low pile; the rotted course and the sand still dusted to grey; (3) both on the burlap's own clay, a step down and up.
- FENCE: (1) pale and thin beside his chunky knobbed posts, three barbed strands leaning at the camera that flattened to
  a rusty rail from 45 degrees up; (2) ball caps, heavier posts, the weave a step darker, a razor-wire coil that reads
  from any side; (3) the cut chain's links at 8 cm so the odd thing reads (5 cm links were a smear).
- CONTAINER: (1) from the side a plank shed: 7.5 cm box ribs every 28 cm are boards; real corrugation is a trapezoid
  whose two slopes take the sun and the shade; the roof dusted pale pink over 40% of the picture; a brown blanket filling
  the window read as a framed picture; (2) trapezoids, the roof a step darker, a grey blanket half drawn, but walls and
  roof on one value (span 75); (3) the walls a step down: it read, and the card went BACK on smoothness (top eight 11.0%,
  grain 2.61); (4) rust run down the ribs from the roof and up from the sill, the owner's code stencilled on the doors.
- PROPANE: (1) the lid stood straight up off its hinge like a lollipop sign (and made the tank 1.6 m), five dark stains
  sat on the white like cow spots; (2) the lid thrown over onto the shell, the rust small, lighter and at the seams.
- RUBBLE: (1) the slab broke like a crystal (a corner knocked 22% of 1.7 m is a spike), the heap a smooth beige dome,
  the tub facing away as a white brick; (2) a flat slab and small lumps, but the dome still a dome and the tub an empty
  frame; (3) the fill knobbled by a 12 cm cell texture under 420 small lumps, the slab cracked in two with the rebar
  bridging the crack, the tub an open shell; (4) the tub tipped up out of the fill so its white inside shows.
- CORRAL: (1) read first time; the sign stood edge-on to the camera; (2) turned to the car park.

## FOUND, FOR DIRECTION (the rig and the card are yours; nothing of yours was changed)
1. THE DUST ON UP FACES, A FOURTH TIME (after COOK THREE, CHARACTER and this lane's last round): a big flat roof is the
   worst case. The container's red roof came out pale pink and was 40% of its picture; a step darker paint did not hold
   it (the dust converges every up face to one dusty middle). It was answered in the model (walls a step down so the
   roof's pale reads as sun-bleach), not in the rig.
2. THE CARD AGAINST HIS OWN TWINS: four of his six twins miss a row of the prop card (table above). A see-through thing,
   his fence or his wire bin, can never reach 2,330 colours. My fence misses the same row his does. A thin or
   see-through class on the card (the guide's colour_floor_small, which the last two COOK records named) is your call.
3. HIS OUTLINE: 55 to 99% of his twins' edge pixels are near-black; the rig's ring is 8 values. Recorded, not acted on.

## FOR COMBAT TWO (when he says FINAL; rule 100: not placed by this lane)
Each piece carries its board kind in the table above and its real footprint in its rig.json (real_dims_m). Two are new
kinds on the board: a see-through BLOCKER (the fence: a bullet passes, a man does not) and a climbable BLOCKER (the
container's roof is high ground 2.6 m up). The rubble mound is the first MOUND made off the rig, and its slab is the
standable top.

## THE SHEET
records/target/COOK_THE_BLOCK_WARS_COVER.png (tools/bohemia_cook_props_through_the_rig_sheet.py blockwar): per row the
quartermaster's line, his tile at 1:1, mine at 1:1 on his cracked street tile (the container at SW and the corral at SE,
the three-quarter his pack draws them at, said in the caption), all eight facings trimmed to their own pixels and wrapped
four or five to a line, the round-six truck beside the container. Not doubled (1,724 x 5,552, 4.0 MB): six props at true
size doubled were 49 million pixels, too heavy for his phone; one pixel size holds. The earlier two sets keep their
layout (the fight sheet re-made pixel-identical). VOTE: cook-the-block-wars-cover-10-18, at the top of the queue;
vote_tab_gate 38 ok, the one FAIL is two DYNASTY items with no 'you see it' (not this lane's).

## WHAT IT DOES NOT CLAIM
Not placed on any fight board (COMBAT TWO owns the boards; rule 100: nothing to slices/, engine/ or the demo). Not checked
by the NOT VIBE CODED family. No stencilled words a man could read (the container's code is bars). Nothing is final
before his moodboard (rule 108).

[bb Battle Brothers' battlefields are cut from the world map's terrain with its own clutter; a city fight's clutter is
this: sandbags, fences, boxes, tanks, rubble, the car park's corral, each at its real size.]
[analog horror: every one of these was left by somebody who is gone: the chain cut, the tank drained, the window cut for
a man who lived in a box, a bathtub out in the street.]

REFERENCE CHECK: his tiles named above are the twins at 1:1 on the sheet; the palette is DIRECTION's source palette; the
card is the rig's. No reference game. REUSE CHECK: the modeller is last round's tool with new builders; the corral's
carts are last round's cart.glb imported untouched; the rig is the master rig; the sheet is last round's sheet tool with
a set name. No bank was opened: nothing in banks/ is a 3D model.
