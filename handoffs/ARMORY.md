# ARMORY (the lane's own block; newest on top, written only by ARMORY)

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
