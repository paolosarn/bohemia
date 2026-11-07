# COOK: THE PISTOL, RULE 408(b)'s GOLDEN PASS (ROUND TWO). THE CARD IS FIXED; THE PISTOL IS STILL NOT THE BAR (11/7/26)

His words, 11/4 (rule 408): 'I just want the first time you make art to be the final... the shields were disappearing
recently, I can't see the shields... the two weapons, it's just all fucked up.' Rule 421(c), 11/7: the weapon's golden piece:
the pistol shipped as a STAND-IN with four faults (handoffs/COOK.md), fixed until it reaches the bar, judged in the hand in
the fight. Rule 404: the one golden piece only, no batch. Round one: records/BOHEMIA_COOK_THE_GOLDEN_PISTOL_11_6_26.md.

## THE ANSWER, FIRST

- NOT GOLDEN. It stays a STAND-IN. An independent read on DIRECTION's bar page and recipe (pictures only, not my
  conclusion) sent it BACK again: 'beside the bar: WORSE, because in the fight's resting pose it reads at 1x as a pale knife or
  stick that changes shape in every facing and disappears in 5 of 8 with the door, while the thug reads as himself from every side.'
- FAULT 3, THE CARD: FIXED (the read: BETTER; against his own pack tile: SAME weight, the more real gun). It is on the item
  cards now (slices/market_icons/w_pistol.png), so the shop, the bag and the spoils show the same stainless gun his hand holds.
- FAULT 2, HELD LOW: BETTER IN THE PICTURE, SAME IN THE READ. The gun now lies near level in his fist and reads as a pistol from
  the side (E, NE, NW, W); from the front (S) it is end-on, a short stroke, and SE/SW a steel diagonal. Eleven cycles proved the
  gun's line in the fist is spent at 12 pixels (below).
- FAULT 1, THE DOOR: SAME. With the car door it shows at SE and E (a few pixels at NE); behind the door at S, W and SW, behind
  his body at N and NW. The door's carry lays it across his front; that is the shield arm's pose (ANIMATION), not the gun.
- FAULT 4, THE OPENING ZOOM: BETTER BUT NOT READ. WAS and NOW can now be told apart (a dark wedge lost in the sleeve against a
  pale bar over the fist), but the man is 59 points and the pistol a 7-point fleck: nobody sees a pistol there. That is the
  camera's scale (COMBAT), not the gun.
- THE INSTRUMENT WAS WRONG AND IS FIXED: last round's and this round's first eight-facing pictures held two facings that were
  the same picture twice. The fight's turnTo steps a man one notch toward his enemy a beat after his last turn, and that raced
  the proof's facing; the proof now holds the turn clock and retakes a repeated shot (0 duplicates in the final run).

## WHAT CHANGED, AND WHY (the common recipe, DIRECTION part 3)

1. ONE AT A TIME: the one pistol. Nothing else of its kind was made (rule 404).
2. THE BAR BESIDE IT: no weapon bar exists; the twin in the hand is the thug (body_thug_S), the card's twin is his own pack
   tile (pack_12_weapons_and_supplies_006, records/target/cook_golden_pistol/card/w_pistol_pack.png); the robot (robot_S) on
   the bar sheet. records/target/cook_golden_pistol/beside_the_bar_1x.png.
3. THE REAL THING: WPN-01 unchanged (216 mm, stainless). The frame now follows the real Colt 1911C two-tone (a stainless slide
   on a blued frame, the dealer listing already in WPN-01's sources), worn: rubber step 3.
4. ONE SOURCE: reference/models/bohemia/gun_service_pistol.glb rebuilt (slide tape_grey 3, a step down; frame rubber 3), through
   the master rig, wear seed 1, in YOU's hands by the fight's four picture systems (grid 120, held clips 272, idles 152, shield
   arm 144 frames; four workers, about two minutes). YOU's bodies were rebuilt by each tool's own commands (68 s) and the class
   pistol re-rendered through the same pipe lands on the shipped you_guns sheet with 0 of 921 pixels different.
5. THE HOLD (the low ready, this gun only): ANIMATION's line in the fist (fwd 0.75, fore 0.35, up -0.55, about 50 degrees down)
   is replaced in memory, for this gun's renders only, by fwd 1.0, fore 0.05, up -0.25 (about 18 degrees down), in the held
   clips (the hold tool's PLACE) and on the shield arm (the melee tool's place_pistol 'rest'). The body's pose is not touched,
   nothing of ANIMATION's is edited, every other gun keeps ANIMATION's line. 11 degrees read best but asks a wrist for more
   than it bends; realism first.
6. THE CARD: the source pass sizes its grime and dust masks in metres (drift 20 cm, dust 50 cm), so on a 22 cm gun they were
   one flat wash; the card is a close-up, so the masks are laid at the robot's share of the object (card_dirt_k 4, the masks
   only, never the light), and the card takes the fight's own day rim, one pixel (his objects all carry a dark contour: 100 per
   cent of his 784 props, COOK's 10/10 study). Mean value 91 (his tile 56, last round's card 128), darkest 16 (his 19); all five
   look stages pass with his tile as twin (last round's card failed DETAIL, 2.29 against 2.22).

## THE LOOP (cycles 22 to 32, records/target/cook_golden_pistol/loop.jsonl; candidates in cycles/)

- 22 the shipped stand-in on its real surface (YOU's held clips at fight pixels, WAS above NOW): held low it is a pale stroke
  tipped 50 degrees down, a knife at S and SW; the one-hand aim reads as a gun. What reads is the LINE, not the metal.
  (Its numbers were taken over a flat floor and are void; from 23 the candidate is NOW alone on no ground.)
- 23 the line at 28 degrees: E and NW read; S end-on (geometry); SE and W still one bright tapered stroke in a dark rim.
- 24 two-tone frame: almost nothing in the hand (the frame is inside his fist); kept for the card.
- 25 the slide a step down: the knife glint gone, steel not blade; the shape still the line's.
- 26 nearly level (11 degrees): E, NE, NW read as a pistol at 1x; too far for a real wrist.
- 27 THE SHIP: 18 degrees, all four systems, packed, seen in the shipped fight (proof/).
- 28 to 30 THE CARD: two-tone, then the rim (the biggest change on the card), then the dirt at the card's scale.
- 31 the reviewer's lever (the camera sees the gun's side, the heel below the fist): across his body toward his other foot and
  seated 25 mm lower: at S a small hook with the heel, half an L; E and NW lose their level slide.
- 32 the drop with the level line: a pixel of heel at E, no facing changes its read.
- STOPPED (STOP PRODUCING, the tell): five lines in the fist this round, each moving the read a pixel. At 12 pixels the gun
  held low is spent; the lever is beyond the gun.

## WHY IT DID NOT REACH THE BAR, IN NUMBERS (what the next move needs)

- A 216 mm pistol at the rig's 57 px a metre is 12 px on a 98 px man; held low the hand covers the grip, so what shows is a
  slide 12 by 2 to 3 px. From the front it points at the camera. No colour and no line in the fist makes that an L.
- The door's carry (the melee tool's place_shield 'carry': across his front, turned 22 degrees to his left flank) covers his
  right hand from S, SW and W; his body covers it from N and NW. The gun shows with the door in 2 to 3 of 8 facings.
- At the fight's opening zoom (0.29) the man is 59 points tall and the pistol 7.

## ROUTED (one line each; the coordinator hands them out)

- ANIMATION: the shield arm's pistol: the gun hand outside the door's outline (the riot-shield man's way: the pistol at the
  door's edge, over its top or past its side), and the low ready with the gun's side to the camera; measured: with the door it
  shows in 2 to 3 of 8 facings. The car door from the back still draws as two wing-like panels behind his shoulders (11/6 NOTE).
- DIRECTION and the coordinator: a weapon's SIZE is his realism call (REALISM FIRST: the realistic option leads, the trade is
  his): at real size a pistol is 12 px and cannot read held low at 1x from every side; Battle Brothers draws its weapons larger
  than life. The bar for 'a weapon reads at 1x, all eight ways' needs either that call or a pose rule, before any weapon can pass.
- COMBAT: the fight's opening zoom puts a man at 59 points; any held thing under 20 cm is a fleck there.

## IN THE GAME (this push)

- slices/fight_rig/own_guns.json and own_guns/dagger.webp: the pistol re-rendered in all four systems (596 cells, 1024 x 55);
  the six guns untouched; the shift tables recomputed by the same code (94, residual 0.43 px median, 1.52 at the 90th).
- slices/market_icons/w_pistol.png: the new card on every PISTOL row's item card (the picture only; the card's layout is UI's).
- reference/models/bohemia/gun_service_pistol.glb (two-tone, the slide a step down) and items.json (its sha1).
- BUILD 11/7d - THE PISTOL HELD LEVEL, ITS CARD IN THE DIRT; the demo re-cut.
- VOTE: cook-the-pistol-stand-in-11-6 updated in place to this round (stage stand_in, art_kind weapon, bar none:weapon, nearest
  body_thug_S, real WPN-01, this round's BACK line), its sheet records/target/cook_golden_pistol/CARD_THE_PISTOL_STAND_IN_11_7.webp
  (the last round's sheet removed: one card, one moment). It asks him nothing about the look.

## CHECKS RUN (only what this change touches, one at a time)

- THE FIGHT DRAWS WHAT HE WEARS (COMBAT 8's check, gates/the_fight_draws_what_he_wears_gate.js): 19/0 run alone (a first run
  beside the reviewer read 18/1; the failing leg's line was not kept; last round showed the same flake under load).
- every item has a model (gates/every_item_has_a_model_gate.py): 286/0.
- DEMO BUILD (gates/demo_build_gate.js): 25/0.
- REFERENCE CHECK 514/2 and REUSE-FIRST 389/19: both changed tools pass; the reds are other lanes' older tools, unchanged.
- purity (gates/bohemia_purity_gate.py check_png): 0 lava, 0 purple on the gun's sheet and the card.
- THE VOTE TAB (gates/vote_tab_gate.js): in the second commit, with the card.
- The proof (tools/bohemia_cook_the_golden_pistol_proof_11_6_26.js): door and bare, before and after, 0 page errors, the new
  pistol drawn 1,502 to 1,510 times a run, 0 before; 0 stale facings.
- PIL and Blender: both work on this box (bpy 4.2.0 in a python3.11 venv, as the 11/6 record says). No image leg failed for PIL.

## TO REBUILD (a fresh container)

python3.11 -m venv /tmp/v && /tmp/v/bin/pip install bpy==4.2.0 numpy pillow; then YOU's bodies (COMBAT `bodies you`; the
idles and melee tools' `pose`; COMBAT's render() with clips [Stand] pointed at each system's posed folder and render folder);
then `model`, `render`, `pack`, `card_render`, `card` (BOHEMIA_PISTOL_CARD_SHIP=1 writes the item card), `bar`, `sheet stand_in card`;
the loop's views: `held <tag>` with BOHEMIA_PISTOL_REND and BOHEMIA_PISTOL_CLIPS=PIdle,PAim.

[bb Battle Brothers draws a weapon larger than life on a side-on man, so it always reads; ours is real size on eight facings,
and that is the trade this round measured.]
[analog horror: the blued frame worn to grey at the edges, the serial ground off; a gun that has been carried, not bought.]
