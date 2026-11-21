# COMBAT FOUR: STANDING WATER IS SWAMP (BUILD 11/21c - STANDING WATER IS SWAMP)

11/21/26. COMBAT FOUR, picked up by the coordinator's routine after the lane sat blocked on an approval tap (rule 461(c) amended 11/21: a lane
never calls a tool that waits for a person; this lane schedules nothing from now). Rule 461's content order: 'more boards, more ground, every
floor tile from Battle Brothers with its cost and its effect' (rule 59). Rules 465 and 454(a): no line rewritten. Ask row 651.

## WHAT WAS WRONG (measured on main 2bb6386d9)
WORLD's one ground table (records/target/BOHEMIA_GROUND_EFFECTS.json) carries Battle Brothers' SWAMP row, 'Swamp, murky water -- 4 AP and a
melee-defence malus', and says 'NOTHING HERE: the valley is dry. Not one wet cell on any ground.' The fight has carried that row's rules all
along (stepCost: 4 AP from rules.json, ap.move_cost.murky_water_swamp; chanceWith: a man in water at 0.75 of his melee skill, his melee
defence and his ranged defence, rules.json hit_chance.terrain_swamp, Battle Brothers' own -25%), but no board laid a tile of it. The cell
block's FLOODED FLOOR (this lane's BUILD 11/20w) is standing water and was laid as rough ground: 3 AP and nothing else.

## WHAT SHIPPED
- `slices/fight_ground/prison/prison.json`: the flooded floor is the swamp row (terrain 'water'): 4 AP a step, and a man standing in it
  fights worse. Its tap line is unchanged, letter for letter (rule 465): 'Flooded floor: slow going, open ground.'
- `slices/BOHEMIA_FIGHT.html` `drawStanding` (__STANDING_WATER_IS_SWAMP__): any tile a board lays as water reads as water on the glass, a
  dark still sheet with its glints (the flash flood's own look, nothing moving: standing water is still). Before it the flooded floor was a
  slightly darker concrete nobody could tell from the dry floor. The tunnels' flood is still drawn by drawFlood alone.
- `gates/the_big_insides_gate.js` leg I11 STANDING WATER IS SWAMP, for any inside with a swamp row: the fight reads the tile as swamp, a man
  of his in it is struck more easily than the same man dry, and a plant (the water read as rough ground) is caught. The cell block: struck
  at 20% in the water, 10% dry; planted 10%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:prison,jail)
Before the drawing (the rule alone): the demo upright 2 fights, the demo on its side 2, the alpha on its side 2, the alpha upright 2, all
ended, the flooded floor tapped on the page with its line, one step onto it 4 AP (two steps of dry floor 4). After the drawing: the demo
upright 5 fights over three runs, the demo on its side 1, the alpha on its side 1, the alpha upright 1: all ended, 0 page errors.
TAPS, SAID PLAINLY: one run's five taps all answered 'Tap a chalk tile to walk.' (the finger came while the turn was changing hands; the
same cell run twice more: 18 of 19); and twice this round a finger aimed at a tile next to a mattress barricade was answered with the
neighbour's line (the barricade tapped for the flood, the floor for the barricade). FOR EYES: if a player's tap on a tile beside a tall
cover piece picks the piece's tile, that is a find; the driver cannot tell its own aim from the game's pick.

## NOT DONE
The powerhouse's seep and the hospital's slick floor are wet, not standing water: they stay rough (3 AP). The open map's wet ground (the
lake shore, the wash after rain) is WORLD's and COMBAT TWO's boards, not this lane's.
