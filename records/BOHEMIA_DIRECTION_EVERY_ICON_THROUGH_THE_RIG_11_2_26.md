# DIRECTION -- EVERY ICON THROUGH THE RIG (11/2/26)

Paolo: 'all the icons look like dog shit, why do all the icons you made have to be five pixels by five pixels'; 'a fabric
icon looks like someone is getting hung by a noose'; 'all your icons suck'; 'you're making 3D-looking 2D sprites, I think we
have to do that for the rest of the game' (rule 115); 'no AI slop' (274); 'more new graphics across the board' (290, 267).
The coordinator's brief: every icon the demo shows remade through the rig the way the robot and the truck were, one style.

## 1. MEASURED FIRST (the demo on a phone, 390 x 844 at 3x, tools/bohemia_drive_the_demo.js, BUILD 11/2 before this round)

| where he sees it | what it was | size on his phone | made by |
|---|---|---|---|
| THE MAP: pins (boss sign, boss skull, fallen boss, places, open ground, crosses for the dead, his own pins, best-price battery, the unknown '?') | 16 hand grids of 6 to 9 cells (slices/bohemia_his_map.js GLYPHS), each cell 2 points | 12 to 18 points tall: a 7 x 9 mosaic of 6-device-pixel squares | BY HAND. These are the 'five by five' icons. |
| THE TOP BAR: batteries, food (can + bottle), tape, meds, rounds | pack tiles copied as-is (his UP 10/17 over the grids) | 32 points (96 device px), food 42 | THREE DIFFERENT PAINTERS' PACKS, three lights, not ours |
| PRICE MARKS: the battery beside every price (town, phone board, settlement), the 10-point supply marks | supplyIcon(): a 10 x 10 grid | 10 points | BY HAND (the grid the noose came from) |
| THE SHOP: the stall's supplies (s_food, s_food_can, s_meds, s_rounds, s_water) | pack tiles | 40 points | packs |
| THE SHOP: the smith, the armourer | COOK's rig renders (10/20) | 40 points | RIG, kept |
| THE SHOP / CREW: weapons and armour | COOK's rig renders + the 22-cell grid for armour | 26 to 44 points | ARMORY's (left to them) |
| THE PHONE: 15 apps | stone tiles through the rig, flat black pictograms on them (UI TWO, rule 212) | 24 to 44 points | RIG tile, flat glyph: next |
| CREW CARD: 50 perks | COOK's rig renders on plates (10/26) | 32 points | RIG, kept |
| CREW CARD: 9 stats | hand-shaded solids (UI 10/25) | 24 points | BY HAND: next |
| TOP BAR: the DAY chip's sun arc, NIGHTS' moon | small canvas drawings | 10 to 12 points | BY HAND: next |

## 2. WHAT SHIPPED (tools/bohemia_direction_every_icon_through_the_rig_11_2_26.py)
Twenty-four icons, each a small model in real metres put through DIRECTION's master rig (one camera at 45 degrees, one sun
from the upper left, the source pass's wear and grime, the population snap toward his prop family, the ring), COOK's icon
settings (40 denoised samples, wear 0.3, snap 0.35, rendered at three times the icon and cut down with a real filter, one
dark pixel round the silhouette). One rig, one sun, one style.
- THE MAP'S 16 PINS -> slices/map_markers/*.png (96 high), drawn 26 points tall on a phone (34 on a big screen), smoothed:
  a ridge tent (camp), a yellow warning sign on a post (danger), an open crate of goods (loot), a striped market stall
  (shop), a flag (word), a grave cross on its mound (cross), a red skull (the boss alive), a bone skull cracked (the boss
  fallen), a board sprayed with a red X (tag), a flyer pinned to a post (flyer), a field radio with its aerial (radio), a
  beer mug with its head (bar), a rubble heap with rebar (rubble), a door ajar in a wall (door), a D cell (battery, the best
  price), a gold question mark on a post (ask). The hand grid stays only as the picture for the second before a file loads.
- THE TOP BAR'S SUPPLIES -> slices/supply_icons/*.png: three D cells (batteries), a can with a bottle of water beside it
  (food, the bottle beside, never behind: rule 240), the can alone, the bottle alone, a roll of duct tape turned to show its
  hole and core with NO TAIL (the noose is in the graveyard and stays there), a first-aid tin with its handle and red
  cross, five rounds standing (rounds), a crate of scrap.
- THE STALL'S COPIES -> slices/market_icons/s_*.png, each in its own canvas (s_food is the bar's own picture, the six gate).
- THE PRICE MARKS -> slices/supply_icons/small/*.png at 30 px (10 points, one to one); supplyIcon() returns them for the six
  and keeps the grid for NIGHTS only.
- The ledger records/target/direction_icons_rig/swapped.json (a sha1 per file); THE SIX ON THE BAR and THE MARKET'S PACK
  ART gates now pass a picture that is his pack tile byte for byte OR the rig's render byte for byte from this ledger.

## 3. PROOF
- records/target/direction_icons_rig/BEFORE_AFTER_EVERY_ICON_11_2_26.png: every icon, before and after, at its real size
  on a 3x phone.
- records/target/direction_icons_rig/DEMO_PHONE_11_2_26.png: the demo on a phone (390 x 844 at 3x), the town and then the map
  after a real tap on LEAVE: the top bar's five in place on both; the map's pins draw only where a pin stands (the gates'
  B1/B2/P4 legs prove each kind drawn), so the map half shows the bar, not a pin.
- GATES RUN: THE SIX ON THE BAR 9/0, THE MARKET'S PACK ART 7/0, THE MAP'S BAR 7/0, WHERE IT SELLS BEST 14/0 (the battery
  pins), HIS MAP 18/2 (the two reds are its held-finger leg P1 throwing on 'held.menu.at'; run on main's own files with
  this round's two files swapped out it fails the same 18/2: not this round's), PIXEL FLOOR and REFERENCE CHECK red on main before this round on other lanes' files, none of these files in them.
- REFERENCE CHECK (reference_check_gate.py, the 9/4 standing duty): the twins are the rig's own props in the towns and the
  camp (the same camera and sun) and the old icon of the same subject; every model is the real thing at its real size (a D
  cell 34 x 61 mm, a 400 g can, a half-litre bottle, a 48 mm roll, 7.62 rounds). No reference game.

## 4. NEXT (DIRECTION's row, in this order)
1. THE STAT ICONS (9) through the rig: a heart, two lungs, a taped fist, a bolt, a machete, a reticle, a shield, sandbags.
   They are hand-shaded and read small; the look-alike gate holds them apart and must hold the remakes too.
2. THE PHONE'S APP GLYPHS: the tiles are rig renders, the pictograms on them are flat black: model the glyphs as relief on
   the tile (a raised tent, a raised gear) so the phone reads like the rest.
3. THE DAY CHIP's sun arc and NIGHTS' moon (10-point canvas drawings).
4. THE BOSSES' PLACE MARKERS on the travel map (slices/bohemia_bosses.js glyph(): the kitchen, the tanks, the main, drawn as
   13-cell hand grids, about 40 points of 3-pixel squares; seen on the demo's map this round). Landed by the bosses' lane the
   same hour (08ec2328), so left to them this round: the same tool takes three more names when that file is free.
5. THE SETTLEMENT'S PROPS that still read placeholder (the brief's second half): measured, not started this round.
