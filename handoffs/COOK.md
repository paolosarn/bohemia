COOK PROPS (rule 341, rule 337, ask line 350, 11/3): BUILD 11/3zzm EVERY PLACE ITS OWN THINGS. BUILT, NOT YET SEEN (rule 179):
- [every place its own things] SHIPPED in threes, worst first: the lab yard, the airport, the golf course (cc33b0fd); the trailer
  park, the desert, Red Rock (8aa791af); the pass, the shore, the wash (5bbf99a0). Each thing a real model through the master rig: reference/models/bohemia/fight_props/<id>.glb
  + its picture from the fight camera with its ground pixel; THE CONTRACT records/target/fight_props/manifest.json (footprint in
  12 m cells, storeys, cover/blocking/none, sees-through, the fight's own kind/tile/flags, hole_m for a pit) for COMBAT MAPS 3 to
  place. VOTE: one card a place, its things on its own ground. tools/bohemia_cook_props_every_place_its_own_11_3_26.py
  (models <place|id> / card <place> / manifest). Record records/BOHEMIA_COOK_PROPS_EVERY_PLACE_ITS_OWN_THINGS_11_3_26.md.
NEXT: the suburbs, the landfill, the Strip; downtown, the works, the marina (built, rendering).
[bb Battle Brothers' blockers read at a glance as what they are; every place's things here do.]
[analog horror: one wrong thing a place: the reefer still running, the same suitcase, the flag in no wind, the white washing, the car's lights, the cairn.]

COOK WEAPONS (rule 337, ask line 344, 11/3): EVERY WEAPON ITS OWN (BUILD 11/3zzd, then 11/3zzj). BUILT, NOT YET SEEN (rule 179):
- [every weapon its own] SHIPPED (this push): the pool pole spear, the extension cord, the live wire, the barbed wire and the rodeo
  bullwhip each its own glb (reference/models/bohemia/item_<name>.glb, COOK's every-item kit) rendered in YOU's hands by ANIMATION's
  own render_props on new layers m4/s4/t4 (records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json; 'hanging' = cords and thongs hang
  like the chain); every other man borrows YOU's pictures (props_ref; the four looks with held-back layers keep them held back:
  'withhold' in their json, the fight's thing()/has() skip them). Shop shelf: slices/market_icons/own_<row>.png. VOTE: one moving
  sheet, WAS beside NOW. Gates: every item has a model 226/0 (amended for own models), the thing in his hand 29/0, the whip 13/0,
  the market's pack art 8/0. tools/bohemia_cook_every_weapon_its_own_11_3_26.py (model, wire, render, pack, shelf, manifest, vote),
  proof tools/bohemia_cook_every_weapon_its_own_proof_11_3_26.js.
- [the last armory round's melee] SHIPPED (second push, BUILD 11/3zzj): crowbar, bike-lock chain, box cutter, framing hammer, broom
  bayonet, pawn-shop katana (row pawn_katana), on layers m5/s5 (m4 would pass 2048 x 1024), splitting maul and sign-post halberd on
  t4. VOTE: a second moving sheet of eight.
- [the six guns] OWED, measured: a gun is drawn by four per-look systems (fight_rig grid, rig_hold, rig_idles, rig_melee's pistol);
  the next round's job (the record says how).
- TO REBUILD THE RENDERS in a fresh container: bpy 4.2 venv; `bohemia_combat_the_fight_wears_the_rig.py bodies you`, the melee tool's
  `pose`, the Stand frame (CF.render you Stand into records/target/animation/melee), then the tool's `render`.
- Record records/BOHEMIA_COOK_EVERY_WEAPON_ITS_OWN_MODEL_11_3_26.md.
NEXT: the six guns (the guns' grid sheet falls through to YOU's like the melee, then render them), then the 107 BB rows by most carried.
[bb Battle Brothers draws every weapon its own sprite in the man's hand on every pose; ours now does for the armory's pieces.]
[analog horror: every weapon is something the valley lost its use for: a pool with no water, a garage with no power.]

COOK ARMOUR (rule 337, ask line 345, 11/3): BUILD 11/3zzc THE BOSSES DRESSED, THE ARMOUR WORN. BUILT, NOT YET SEEN (rule 179):
- [the bosses dressed] SHIPPED c91de519: THE POT (stained chef's whites, a toque, a riot vest cut down to his chest, a red
  neckerchief, a butcher's apron, the copper pot's lid on his left arm, the butcher's cleaver), THE TAP (oil-black coveralls, a fire
  hose across him, a red valve handwheel for a badge, valve keys, the red pipe wrench), THE FILTER (his respirator on two ribbed hoses
  to a filter-yellow pack on his back, a robot's arm plating, shoulder shell and camera eye on him, the Mechanic's cables, a chopper
  cut from a robot's panel), each modelled ON HIS BODY through BOSSES' own pipe (barber, master rig, COMBAT's poses, BOSSES' pack),
  his face and body kept. HIS WEAPON AND SHIELD ARE HIS MODEL'S (hand and forearm bones): fight_rig.json looks[boss_*].own_kit = true
  and BOHEMIA_FIGHT.html meleeDraw draws no second thing over him (one marked line). VOTE: one moving card each.
  tools/bohemia_cook_the_bosses_dressed_11_3_26.py (roll / look <pid> / make <pid> / pack), cards _cards_11_3_26.py.
- [every armour its own] SHIPPED 719de686 (BUILD 11/3zza): the armory's nine (goalie mask, football helmet, welding-mask riot helmet, gas-visor riot
  helm; football pads, casino-carpet vest in duct tape, licence-plate vest, riot plate carrier, road-sign armour) each its own model
  (keys own_<row> in slices/wear, armour_looks.json rows 'own', engine/bohemia_wear.js piece() one marked line), and the five
  placeholder classes the shops sell most their own (moto helmet: darker oxblood, duct-taped crack, smoke visor; hard hat: headlamp,
  stickers; padded vest: a moving blanket with a cargo strap; work jacket: duck canvas, cord collar, reflective strip; scale coat:
  crushed cans). Gate THE ARMOUR THROUGH THE RIG 5/0; CHARACTER's THE ARMOUR HE WEARS SHOWS 18/0. VOTE: two sheets of seven,
  drawn by the game's own player, BEFORE = last round's sheets out of git. tools/bohemia_cook_every_armour_its_own_11_3_26.py
  (--only <rows> --proof; --classes; --classes --pack), cards _cards_11_3_26.js.
- NOTE for COOK WEAPONS: the three boss looks (boss_pot_0, boss_tap_0, boss_filter_0) carry their weapon and shield in their own
  model and are own_kit: do NOT give them held sheets in rig_melee (that would draw a second cleaver over the first).
- Record records/BOHEMIA_COOK_EVERY_ARMOUR_ON_THE_BODY_AND_THE_BOSSES_11_3_26.md.
NEXT: the other placeholder classes their own models the same way (welder's mask, gas mask, brim helmet, chain hood, rag hood, straw
hat, bandana, dust mask; car door, riot armour), then THE BURN, THE SURVEYOR, THE CLIMB dressed the same way when BOSSES 3 restarts.
THE RENDERS: bpy 4.2 in a python3.11 venv (/tmp/v); the three bosses' passes ran side by side, about 15 minutes, four cores.
[bb Battle Brothers draws every helmet and body armour as its own sprite on the man, and the man's silhouette changes with it; ours now does for the nine valley pieces and seven of the seventeen class looks.]
[analog horror: everything on them is something the valley lost: a stop sign, a casino's carpet, a goalie's mask, a cook's toque.]

COOK (cook-town-screens, the towns both ways): 10/26 LATEST -- five rows this round (the coordinator's order and rule 279), each
BUILT, NOT YET SEEN (rule 179) unless said:
- [every enemy reads at night] (line 3, EYES q43) SHIPPED 345af4a9: the fight page picks the night for the MAN on his tile (his own
  sheet's light against the tile's): the old pick where it reads 1.45 to 1, else the gentlest lift that does (MOONLIT, his picture
  screened over itself). The Kids 1.08 -> 1.45 on the strip's darkest tenth, all 86 looks 1.43 or more. Gate EVERY ENEMY READS AT
  NIGHT 4/4. Record records/BOHEMIA_COOK_EVERY_ENEMY_READS_AT_NIGHT_10_25_26.md. NOTE on COMBAT: the sight rule (5 tiles at night
  unlit) is why a far Kid is never drawn; the fight gate's night leg is red before and after (the ground, not the man).
- [the Strip close in] (line 64) SHIPPED 5a8ccafc: the painter's resorts in their shapes (the Y, the arc round its drained lake, the
  slab), their marquees and porte-cocheres on the Boulevard in faded gold, rose and teal, the signs as boards. Gate THE STRIP READS AS
  THE STRIP 5/5. Record records/BOHEMIA_COOK_THE_STRIP_CLOSE_IN_10_25_26.md.
- [the map stands taller] (rule 196): nothing of COOK's to redraw (VB_ONE_MAP: no close-end pictures); NOTE on RUN's board with the
  one place every texel's height lands (HS[o] = lift), so the towns (twPaint's TW_L) and the Strip (stripResort's TH) rise with it.
- [every town looks its own] (line 106) + [every town built for tall and wide] (rule 220, line 142) + [the phone's corner, either
  side] (rule 279, line 219) BUILT 0cc15f6c, cb2c18c6, dc43efc2: all fourteen home bases their own picture, wide 2060 x 1092 and
  upright 1024 x 1820, day and night, in slices/settlement_ground_towns/ (56 pictures, settlement_ground.json towns[name].wide and
  .tall with hotspots, boxes, doors, both street ends, zoom_max; settlement_walk.json blocks for every picture). Nothing he taps
  and no keeper under UI TWO's phone, either side, both ways (no twin needed). Gates EVERY TOWN TALL AND WIDE 10/0 and EVERY TOWN
  SCREEN ITS OWN 8/0, both in the suite. NOT IN A TAB YET: RUN TWO wires them (NOTE on its board). Record
  records/BOHEMIA_COOK_EVERY_TOWN_TALL_AND_WIDE_10_26_26.md; side by side records/target/cook_town_screens/sheet_tall_and_wide.jpg.
- THE GLIDE'S PAIRS (rule 289(b)) SHIPPED 21fc51f5: settlement_ground.json towns[name].glide, 351 pieces across the fourteen, every
  building and tap ONE id in both compositions with both spots (box, foot px, foot metres), the taps that are part of a piece riding
  it, one beat 500 ms. tools/bohemia_cook_every_town_the_glide_10_26_26.py writes it from the scenes' measure; both composers re-run
  it after they ship. Gate EVERY TOWN TALL AND WIDE leg 10 (11/0) fails a stale plan. NOTE on RUN TWO's board. If RUN TWO wants
  cut-outs to the outline, the next step is an id map per picture (Blender, an object-index pass).

THE TOOLS: tools/bohemia_cook_every_town_its_own_screen_10_25_26.py (the wide, 10/25's layout), tools/bohemia_cook_every_town_tall_and_
wide_10_26_26.py (the upright: one plan, the same builders, its own layouts per tier; --layout-only builds and checks without the
render), tools/bohemia_cook_every_town_wide_relaid_10_26_26.py (the wide re-laid out of the phone's corners). ONE BLENDER AT A TIME:
two renders at once ran out of the session's 14.3 GB and were killed four times this round; a wide town is 9.7 GB at its peak.
Renders run about 15 minutes a town (day and night).
GATES: EVERY TOWN SCREEN ITS OWN (the wide half), EVERY TOWN TALL AND WIDE (both ways), EVERY ENEMY READS AT NIGHT, THE STRIP READS AS
THE STRIP.
- THE CAMP THROUGH THE RIG (CAMP TWO's NOTE, rule 289(e)) SHIPPED 304e0bed: CAMP TWO's 35 camp pieces (its own meshes) through the
  master rig into slices/camp_two/kit.png + kit.json (same keys, feet checked against the footprints), and a 4 x 7 ft camp trailer in
  eight facings (records/target/master_rig/cook_camp_trailer/, kit.json camp_trailer_rig). tools/bohemia_cook_the_camp_through_the_rig_
  10_26_26.py (/tmp/v/bin/python). Gate THE CAMP THROUGH THE RIG 5/0. Honest: fewer colours than the numpy recipe (median 1,266 to
  1,901), card 13 of 30 BACK (was 12): the rig's light, one look with the cart and the pickup. NOTE for CAMP TWO in CAMP's section.
- [the fifty perk icons] (rule 252(c)) SHIPPED 79250901: all fifty a model of what the perk does through the master rig on a worn
  tag (gold rim carried, blue pressed, the row in dots), 96 x 96, slices/perk_icons/ + perk_icons.json. The models STAND facing the
  camera (laid back, the source pass dusted every front pink). Gate EVERY PERK A PICTURE 5/0. NOT IN A TAB YET: UI THREE's shared
  perk module draws them (NOTE in UI's section). tools/bohemia_cook_the_fifty_perk_icons_10_26_26.py (--only <ids>, --plates).
- [the armour's art] (rule 272(b)(d)) SHIPPED 79250901: the police riot helmet (police black, vent ribs, pivot bolts, lift tab,
  chin strap, its visor smoked glass his face shows through) and the police vest (webbing, radio pouch and aerial, buckles) their
  own art, and all 27 of CHARACTER's pieces meshed from its own distances (tools/bohemia_cook_surface_nets.py) and rendered through
  the real rig with his head and trunk as holdouts, file for file into slices/wear/ (CHARACTER's format and anchors; the
  placeholder cells kept as the reference in records/target/cook_armour_rig/). Armour takes 0.15 of the dust (the caps' share).
  Gate THE ARMOUR THROUGH THE RIG 5/0; CHARACTER's own gate THE ARMOUR HE WEARS SHOWS 18/0 on the new sheets (the crew card, the fight, the camp, the map and the portrait, phone and computer). Honest: the oxblood moto helmet's crown fades to rose (the
  sun's bleach of upward faces). tools/bohemia_cook_the_armour_through_the_rig_10_26_26.py (--only <keys> --proof).
NEXT: each armour piece its own art the way the police two got theirs (the moto helmet's oxblood first, the shops sell it most),
the id maps for the towns' glide if RUN TWO wants cut-outs, then the next COOK row on the board ([eyes: the dam at dawn] is open:
Hoover Dam's settlement near black at 07:03 on the phone). EYES' word on lines 3, 64, 106, 142, 219 once RUN TWO wires the towns; any town EYES names gets its layout moved in the tool
and re-rendered (python tools/..._tall_and_wide_10_26_26.py <Town> --no-ship, then --swap-only; the wide likewise), the check
refuses a layout before its render. Then the next COOK row on the board.
[bb Battle Brothers' town screen is one landscape panorama; ours turns with the phone and re-lays, never letterboxes.]
[analog horror: the towns are built, not painted: every wall stands where a camera at 45 degrees would find it at noon and at night.]
