# FIGHT SCREEN THREE: EVERY WEAPON DROPS -- 11/26/26
BUILD 11/26zd - EVERY WEAPON DROPS. Ask row 742 (FOUND BY BESTIARY TWO 11/26, rule 480(b): 'FIVE KINDS OF MEN NEVER LEAVE
THEIR WEAPON'), owner FIGHT SCREEN 3 (the end screen's loot); VAMILY rules 482, 480(b), 441.

## WHAT WAS WRONG (BESTIARY TWO's find, read again here)
The kids' three skirmishers (a bundle of spiked bolas), the keepers' thrall (a bundle of throwing axes) and the water people's slinger (a nomad
sling) left nothing on the end screen, 10 fights in 10. engine/bohemia_spoils.js found(): a thrown bundle has no wear in weapons.json
(durability null), so partFound read it as WRECKED (a roll of tape, not the weapon); the sling carries no round count (ammo null), so 'spent'
read it as GONE. Battle Brothers drops a throwing weapon with uses left, and a sling like any weapon.

## WHAT CHANGED: __EVERY_WEAPON_DROPS__ (engine/bohemia_spoils.js)
SPENT only when the weapon carries a count and it is at none (w.ammoMax != null && !(w.ammo > 0)); a piece with no wear is found on the
weapon's roll alone (rollOnly: the same 90% die and the same second look as partFound), never wrecked. Nothing else moves: a worn weapon still
reads its wear, a spent bundle still leaves nothing.

## ON THE PAGE (rule 441)
RESULT: the end screen alone (its own SAMPLE fight, the three dead carrying the bundle of spiked bolas with 4 of 6 uses, the throwing axes with
3 of 5, the nomad sling): before, in 39 seeds of the dice, none of the three ever lay on the ground; now, on seed 3 all three do, beside the
vest, the hat and the door, and every tile reads whole at five phone shapes (THE LOOT READS L1). In our skin the throwing class is BOTTLES
(engine/bohemia_roster.js CLASSNAME: the fight throws bottles), so the three read 'bottles' on the end screen as they do in the fight.
FOR CHARACTER / ARMORY (not this lane's): the sling is Battle Brothers' throwing class, so it reads BOTTLES too; a sling of its own name is the
roster's word.
Picture: records/target/FIGHT_SCREEN_EVERY_WEAPON_DROPS_11_26.webp (what they left, before and now, on its side).

## GATES
EVERY TYPE THROUGH A FIGHT (BESTIARY TWO's) E3 green: 53 of 53 kinds of men can leave a piece; THE DEBT paid and emptied (the list only shrinks).
THE LOOT READS 6/0 (L3 EVERY WEAPON DROPS new; plant DROP_PLANT, the old rule: none of the three in 39 seeds, L3 red). OPTIMIZE LOOT 22/0.
Red on main too, not this build's: THE SPOILS 18/1 (the crew screen's #pick walk), THE BATTERY IS REAL T2 (a battery number in ours.json
act_weights for the machines' battery man, outside the table: another lane's data).
[bb Battle Brothers drops a throwing weapon with uses left and a sling like any weapon; ours now does]
[analog horror: what they threw at you lies on the ground after, still half full]
