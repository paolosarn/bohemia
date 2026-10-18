# THE POACHER'S BODY AGAIN, UNDER THE STARRED FACE (COOK THREE, [the poacher's body again], 10/18/26)

His fourteenth votes (records/BOHEMIA_PAOLO_THE_FIRST_STAR_AND_EASIER_THAN_BATTLE_BROTHERS_10_18_26.md): the poacher's
BODY a NO, no words; the same poacher's FACE (PORTRAIT, a 3D head on this lane's body model) his FIRST STAR; the thug YES
('analog horror AI slop and I love it'); the marksman YES ('finally they're all pale face from Batman').
Rule 115(a)(c)(h). Cook only (rule 100): nothing in slices/, engine/ or the demo. Opus 5.5 (rule 116), opened by the
coordinator (rule 112).

## Why round 2's body was a NO (read off the sheet, since he gave no words)
1. ONE MUD: a saddle coat (clay_mustard 1) the colour of the ground board, tan skin, a tan hat. Nothing dark, nothing pale;
   the thug and the marksman he liked both carry a dark mass against a pale piece.
2. A MUSHROOM ON A BOX: the wide field hat sat on the test body's box head and swallowed it from the 45-degree camera.
3. No trade: nothing on him says poacher.

## What changed (tools/bohemia_cook3_the_tiers_through_the_rig.py POACHER, whole())
- THE COAT: the same geometry (four skirt panels on their own thigh bones, the tails swing; knee length, TRENCHCOATS ARE
  FOR BADASSES 8/27), now BLACK OILCLOTH, cloth_black[2]: the runway's black, the thug's cloth.
- THE PELT: a pale coyote pelt (tape_grey[3]) slung over the shoulders, the body's shoulder and back faces lifted 1.9 to
  3.4 cm with tufts pressed in, and its tail a tapered tube down the back on the chest bone. The light end of the card
  and the tier's one silhouette feature: you read his trade at a glance. Cycle 1 ran it down the front and the upper
  arms and it read as a grey shirt; cycle 2 keeps it on the shoulders and the back.
- PALE BELOW: khaki trousers metal_painted[3] (the marksman's light area), a bone shirt clay_bone[3] in the opening.
- THE HEAD IS THE STARRED HEAD: no hat of this lane's. --whole calls PORTRAIT's own tool (read, never edited) with its
  POACHER row pointed at this body, so the face, the curls and the field hat pushed back are exactly what he starred,
  on the same model (ONE ID, ONE WHOLE PERSON). The hands keep the face's skin, skin_deep[3]. The hatchet stays.
- 8 materials on the body (skin, eyes, coat, shirt, trousers, boots, pelt, hatchet); the head's own are PORTRAIT's.

## The card (S still, class person): 0 of 8 out
long side 132, colours 1,403 vs 676, top 8 2.4%, value span 142 (round 2: 141), saturation 0.124 (was 0.394: the
vibrance down, his 9/23), light top minus bottom 46.8, edge -13.8, grain 1.58.

## The sheet
records/target/cook3/COOK3_THE_POACHERS_BODY_AGAIN.png: eight facings, the S and SE walk (6 keys = 2 beats at 120), beside
the game's flat poacher at 1:1 and 4x. 57 px a metre, one pixel size; palette records/target/BOHEMIA_STYLE_PALETTE.json;
one light, the rig's sun upper left. VOTE: cook3-the-poachers-body-again-10-18. Round 2's files are kept as they were
(records/cook3/rig/poacher.glb is still what PORTRAIT's poacher head reads; the voted card's sheet is unchanged).

## Findings
- TO PLUMBER: gates/vote_tab_gate.js times out on main with or without this commit ('#list .row textarea.note' never
  appears in 30 s); it is not this row's.
- TO PLUMBER / DIRECTION: bpy 4.2 segfaults on exit after writing its files (the build, --whole and the rig all did it
  here); the outputs are whole, but a script that checks the exit code will call it a failure.
- TO PORTRAIT: when the starred method reaches the thug and the marksman, --whole is the pattern for the body lane to
  wear your head without either lane editing the other's file.

## Next
The RAIDER: mail as geometry (DIRECTION's mail HOLD: rows, lit shoulder, darker hem), the head via --whole once
PORTRAIT has a raider row.

REFERENCE CHECK: the twin is the game's own poacher (records/cook3/enemy_tiers_repainted.png); the thug and marksman he
voted up; PORTRAIT's starred face; the card of numbers. No reference game.
