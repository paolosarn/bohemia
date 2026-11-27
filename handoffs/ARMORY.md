# ARMORY (the lane's own block; newest on top, written only by ARMORY)

## ARMORY 3, 11/27 round three: THE PRIZES NO STALL SELLS (rule 493(c), 495; BUILD 11/27zy)
BUILT, NOT YET SEEN. The record's ROUND THREE section. armory.json 'named' + 'named_of' (eight prizes, one per boss: the Locksmith, the
Machinist, the Plate, the Tooth, the Lens, the Cistern, the Smith, the Dogs); boss_act_one.json names each as the boss's weapon; the
shelf's pick passes named rows (settlement restock); engine/bohemia_spoils.js drops a named piece every time; the fight's spoils report
marks it. Icons in bohemia_ui_materials.js. Gate THE GUNS GROW UP 28/0. Proof ONLY=bosses. VOTE armory3-the-named-prizes-11-27.
NEXT: named armour and helmets (Battle Brothers' named armours: the same 'named' key on armory body/head rows); the champions' tier up
with BESTIARY 4 (carried_by on the named or the armory's better rows for each champion kind); a named prize for bosses 13 to 18 that hold
no armory piece yet (THE BARBER needs a kind that shoots, BOSSES' call).
[bb Battle Brothers: champions always carry a named item, and named items always drop]
[analog horror: a hammer worn to a mirror, lying where its smith fell]

## ARMORY 3, 11/27 round two: BEAT-UP GUNS, THE DRONE LIT BEFORE YOU SEND IT (rule 490(e), 482; BUILD 11/27q)
BUILT, NOT YET SEEN. The record's ROUND TWO section. armory.json keys 'worn_of' + 'worn' {hit, value_pct} (six beat-up pieces) and
'own_gun' (COOK's own gun pictures by_row in slices/fight_rig/own_guns.json); the Double Shotgun; fire_shapes 'Launch Drone' (cross),
fire_bands drone flat line; the fight's nextAct says SEND / SPOT and the drone's men ON IT. Gate THE GUNS GROW UP 23/0. Proof ONLY=hands,cross.
VOTE armory3-worn-guns-and-the-drone-lit-11-27. Shops stock by tier with no change (measured).
NEXT: own models for the AR, Kalash, belt-fed, rockets, drone kit (COOK SIX; no Blender here); the whine and blast (SOUNDS 3); the
roles (BESTIARY 3); a worn version for the rockets and the belt if he likes the beat-up ones.
[bb Battle Brothers sells the same weapon at different qualities by its row; ours by its wear]
[analog horror: a beat-up rifle with the paint worn to the metal, taped where it cracked]

## ARMORY 3, 11/27: THE GUNS GROW UP, AND THE DRONE (rules 489(b), 490; ask rows 758, 762, 763; BUILD 11/27h)
BUILT, NOT YET SEEN. records/BOHEMIA_ARMORY_THREE_THE_GUNS_GROW_UP_AND_THE_DRONE_11_27_26.md (PART ONE the cited research: the 393
million guns, 32 million semi-automatic rifles, the switches, the FGC-9 and the Luty, the RPG-7 and the LAW, Ukraine's 1.5 million FPV
drones and the shotguns that drop them, night and heat sights, Battle Brothers' ranged ladders, its gunpowder areas, the Fire Pot,
the Firelance; PART TWO what shipped).
- Sixteen pieces in records/target/bb/armory.json, new key 'fire' {mode semi|burst|belt|rocket|tube|drone|spot, burst, mag, rounds,
  per_shot, consumable, sight}; blocks fire_numbers (-> ours.armory_fire), fire_bands (-> ours.range_bands rocket, drone), fire_shapes
  (-> weapon_shapes.json Traverse, Fire Rocket, marked 'armory'). RUN `python3 tools/bohemia_armory.py write weapons` (NEW: weapons
  only; a full `write` rewrites ORIGINS' armour rows, measured, do not).
- The fight: __ARMORY_THREE__ in slices/BOHEMIA_FIGHT.html (burstOn, launchDrone, droneLands, shootDrone, spotOn, armoryFirst, the
  hooks in strike/canStrike/resolveAttack/shapeTiles/beginTurn/afterAction/sideSees/chanceWith/vision/reach/settleRounds); the
  drawing drawDroneGround, drawDrones, droneIcon, the SHOOT THE DRONE square (its key is in the bar's key).
- Icons: sixteen in slices/bohemia_ui_materials.js. Gate gates/the_guns_grow_up_gate.js (new, 19/0); weapon_shapes_gate.js amended.
- Proof: tools/bohemia_armory_three_proof.js (ONLY=burst,belt,rocket,drone,mine,spot) -> records/target/armory/armory3_*.jpg.
- VOTE: armory3-the-guns-grow-up-11-27 (slices/vote/ARMORY3_THE_GUNS_GROW_UP_11_27.html).
NEXT for this lane (rule 482: improve what is there first): the drone's whine and the blast's sound (SOUNDS); a drone of his own
picked by hand lights its cross before the tap (the preview shows the man's tile only today); the burst's preview says rounds;
variations by condition (beat-up/solid/good) for the armory's guns; the operator, rocket man and gunner roles land with BESTIARY 2.
[bb Battle Brothers: four ranged ladders by worth, the enemy's rank carries the tier, gunpowder hits an area you always see lit]
[analog horror: the drone feed's scan lines crawl down the lit tiles; you hear it before you see it]

## ARMORY 2, 11/2: THE WHIP AND THE POOL POLE SPEAR (rule 320, ask lines 316 and 317; BUILD 11/3zr)
SHIPPED, NOT YET SEEN. records/BOHEMIA_ARMORY_THE_WHIP_AND_THE_POOL_POLE_SPEAR_11_2_26.md.
- Five pieces in records/target/bb/armory.json (written by tools/bohemia_armory.py): the pool pole spear (a one-tile spear, the
  funny starter), the extension cord (the starter whip), the live wire (stun one in four, a cell a lash), the barbed wire (three
  bleeding stacks, cuts bare hands), the rodeo bullwhip (+10, the crack's nerve check). New spec keys: starter, prop, lash, tune, whip.
- The fight: ours.whip (reach 2, Battle Brothers' bleeding and Disarm, AUTO's two weights); isWhip/reachOf; bleeding ticks at the
  bleeding man's turn end; DISARM on the sweep's button; the stun takes his next turn; the preview tapes two tiles and lights the
  man picked or armed; AUTO lashes from the second tile; THE LASH drawn (LASH_KEYS, six keys a beat, the crack on the landing's key).
- The shops: a 'starter' row on every camp's smith shelf. The purse: the fight's cellsBurned leaves it at the end (the alpha).
- Gates: gates/the_whip_reaches_two_tiles_gate.js (new, 13/0); melee_is_one_tile... amended (a whip reaches two, never three).
- Proof: tools/bohemia_armory_whip_proof.js (ONLY=lash for the lashes alone) -> records/target/armory/whip_*.
NEXT for this lane: the other six of the coordinator's ten whips (velvet rope's hook disarm, fire hose knockback, choke-chain pull,
charger cable two lashes, seatbelt bruise, lab-beast hide) as armory.json entries plus their effects in lashCosts/whipLanded; own 3D
models for the five (COOK); gloves when CHARACTER draws them (the barbed wire's 150 line); a crack and a cord sound (SOUNDS).

## ARMORY 1, 11/2: FOURTEEN WEAPONS AND NINE ARMOURS (rule 302, ask line 289)
records/BOHEMIA_ARMORY_TWELVE_GUNS_AND_BLADES_AND_NINE_ARMOURS_11_2_26.md.
