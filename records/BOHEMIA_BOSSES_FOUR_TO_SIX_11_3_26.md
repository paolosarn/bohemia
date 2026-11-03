# BOSSES 4, 11/3/26: THE BURN, THE SURVEYOR, THE CLIMB, EACH WHOLE, ASSETS FIRST (rules 330, 337, 338; ask line 341)

PAOLO 11/3, angry and right: "you build the bosses like shit, we don't have enough assets, and you're not creating assets, weapons,
armor, the vibe, nothing" and "we still don't know what killing them does, and the map effects where his shit is." BOSSES 3 tried
bosses four to six with no assets and was stopped (rule 337). This round makes the ladder's #4, #5 and #6 the whole package the
first three have, each modelled first: his look, a lead-up, a verb that makes sense, what his death does and the map after.
Last rounds: records/BOHEMIA_BOSSES_ACT_ONE_THE_FIRST_THREE_11_2_26.md, records/BOHEMIA_BOSSES_EACH_HIS_OWN_LOOK_A_LEAD_UP_A_VERB_THAT_MAKES_SENSE_11_2_26.md,
records/BOHEMIA_COOK_EVERY_ARMOUR_ON_THE_BODY_AND_THE_BOSSES_11_3_26.md, records/BOHEMIA_BOSSES_WHAT_A_KILL_DOES_11_3_26.md.

## MEASURED FIRST (origin/main 5a6b04d8)

- THE LADDER (records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md): #4 THE BURN holds fuel and who gets warm (the lock: night ends your
  day); #5 THE SURVEYOR holds the last complete map (you only know what you have walked); #6 THE CLIMB holds the last hoist that
  lifts (everything above the ground floor is scenery).
- ON THE MAP (WORLD TWO's records/target/bb/boss_map.json): each has a sign (a door burned WARM IS THE BURN'S; a man at the bar; a
  flyer THE HOIST WORKS), a district, and a change when he falls (THE BURN and THE CLIMB 4 blocks of lights back; THE SURVEYOR every
  town shown and a place, THE SURVEY OFFICE).
- IN THE GAME: no row in records/target/bb/boss_act_one.json, so each was the old hand-over: a 3-skull band of plain men with his
  name on the card, no man, no place art, no lead-up, no verb. No model, no face, no weapon, no place picture existed for any of them.
- THE NIGHT IS REAL (slices/BOHEMIA_CITY_WORLD.html): at night the fog's reach is cut in half (fogRadius) and you see down a street
  only one block where the power is off (mapSees, sightLit). That is the lock THE BURN's verb opens.
- THE PHONE SHOWS ONE VERB (slices/bohemia_phone.js, one band button, verbHere returns one): three more anywhere-verbs would hide
  each other. So each new verb has its own kind of place (below), and the order puts the place-bound ones first.

## WHAT SHIPPED

### 1. THE ASSETS FIRST: each man his own model, his weapon in his hand (tools/bohemia_bosses_four_to_six_11_3_26.py)
The same pipe COOK ARMOUR dressed the first three with: CHARACTER's tool for a new kind of man pointed at three one-man types the
way BOSSES' tool does (its pack, its face strip, PORTRAIT's manifest, imported and never edited), each boss's own pieces modelled on
his body in CHARACTER's kit (cloth lifts, bands, rings, strips, his measured hands; COOK ARMOUR's helper shapes re-stated because
they are closures), his hat through HATS 1's door, the barber, DIRECTION's master rig, COMBAT's fight poses and six clips. His
weapon is part of his model on his hand's bone (own_kit in slices/fight_rig/fight_rig.json, the fight draws nothing over him).
- THE BURN: a TAN TURNOUT COAT (the car coat in turnout tan, in memory) with lime and silver reflective bands round the chest, hem
  and cuffs, soot on the hem and cuffs, a BLACK LEATHER FIRE HELMET (the long back brim, eight ribs, a brass front shield with a
  red roundel), a RED 20-LITRE JERRYCAN on his back (the pressed X, three handles, the spout), a LIT ROAD FLARE in his belt, and THE
  FIRE AXE in his fist (90 cm, yellow fibreglass handle, black grip, red head, bright edge, the pick).
- THE SURVEYOR: a HI-VIS VEST open down the front with two silver bands and the braces, over a storm-grey shirt, khaki cargos, a
  WHITE HARD HAT (its ridge and peak), A MAP TUBE slung across his back on a strap, a brass PLUMB BOB on a cord at his chest, and THE
  RANGE POLE in his fist (1.24 m, red and white bands every 20 cm, a steel shoe for a point, its round bubble level by his hand).
- THE CLIMB: an OXBLOOD BELLHOP'S JACKET (two rows of brass buttons, gold braid at the cuffs) under an ORANGE CLIMBING HARNESS (the
  waist belt, the braces over his shoulders, a chest strap, three steel carabiners), a COIL OF ROPE over his shoulder, a BELLHOP'S
  PILLBOX CAP (oxblood, a gold band and braid), and THE HOIST'S HOOK on a short chain in his fist (safety yellow, its eye, its latch).
- His face in PORTRAIT's manifest (records/target/portrait/crew/boss_<x>_0/, rest and four mouths at 64 and 128), talking on his meet
  card and on the VOTE card.
- Fight numbers (TUNING's shapes, in the file), each lesson the fight's OWN rule (measured: a boss's fight never deals COMBAT MAPS
  3's place boards, slices/BOHEMIA_FIGHT.html placeOwn returns null for opts.boss, so a tip about the flare or the bridge would
  have been a lie): THE BURN a brigand marauder at 1.6x blood with the Woodcutter's Axe row (his fire axe: Round Swing strikes the
  three tiles in front of him), crew 2 thugs and a raider (his stokers), the landfill board; THE SURVEYOR a bounty hunter at 1.6x
  with the Spetum row (his range pole), crew 2 marksmen and a guard (his spotters and chainman), the ruin board (brick, blocked
  sight, height: +1 range and +10% from up high); THE CLIMB a hedge knight at 1.4x with the Battle Whip row (his hook on a chain:
  the fight's whip rule, reach 2, a bleed, a 10% disarm), crew 2 raiders and a marksman (his riggers), the casino board.

Found and fixed on the way, by the stills: hair standing through the fire helmet's dome (the dome lifted 3 cm and raised); the
jerrycan soft as a pillow (no subdivision on a box); THE SURVEYOR's vest invisible (it sat 1.4 cm out, under the shirt's own mesh:
now 3.2 cm, measured in the model: the vest object was there and yellow); THE CLIMB's shoulder straps poking out like spikes (a ray
from his jaw: now one strip a side laid on his surface over the shoulder) and his cap swallowed by his hair (his head shaved, the
cap wider and taller).

### 2. HIS PLACE, BEFORE AND AFTER, IN THE MAP'S OWN LOOK (tools/bohemia_bosses_paint_four_to_six_11_3_26.py)
The way BOSSES painted the first three (the district hero factory's parts, COOK's map render through the master rig, two beat
frames over it; that tool imported, never edited). slices/boss_places/, rows added to boss_places.json, the first three's kept.
- THE FUEL YARD: two storage tanks in a concrete berm, a loading rack, the yard office, drums. BEFORE: ONE BIG FIRE in a pit in the
  yard, black smoke, every window dark. AFTER: the pit out, FOUR BURN BARRELS lit along the street for anybody, the office lit, a lamp
  on the rack.
- THE SURVEY OFFICE: two storeys of county concrete, a survey tripod and a flag on the roof, a fence. BEFORE: dark, ONE WINDOW
  flickering on the beat, the gate shut with razor wire. AFTER: every window lit, the gate open, THE MAP on a board out front, roads
  and a red route on it.
- THE HOIST: a dead casino tower, a work hoist's mast up its face. BEFORE: the cage parked AT THE TOP, a red lamp blinking on the
  roof. AFTER: the cage DOWN at the landing with its work light on, THE TOP FLOORS LIT.
- The marks each verb leaves: a BURN BARREL (lit, the flame on the beat), a SURVEY TRIPOD AND A STAKE (its orange flagging lifts on
  the beat), AN OPENED CRATE OF CELLS AND A COIL OF ROPE.
Compare sheet, the first three beside these three at the same scale: records/target/bosses_places_4_6/compare.png.

### 3. THE THING HE HANDS YOU (tools/bohemia_bosses_what_they_hand_you_11_3_26.py, three new models)
DIRECTION's icon rig, the way the pot, the wrench and the filter were made: HIS FUEL (a red 20-litre jerrycan, the pressed X, three
handles, the spout cap), HIS MAP (the county sheet folded in three, roads and a red route, the tube beside it), HIS HOOK (a yellow
crane hook, its eye, its latch, the chain). slices/boss_places/hand_burn.png, hand_survey.png, hand_climb.png (96 x 96).

### 4. THE LEAD-UP: PEOPLE, PLACES AND THINGS (records/target/bb/boss_act_one.json, draft:true)
CONTENT's mouth card, the first three's way: the one who lost something stops you, one of YOUR men reads the sign, his place is marked.
- THE BURN: ABUELA PAZ (an old woman in a blanket by a cold stove): THE BURN took all the fuel on this side, only his people are warm
  at night. THE MARK on a door, read by one of yours: WARM IS THE BURN'S, the marks go to the fuel yard with the big fire.
- THE SURVEYOR: MANNY (a trucker with no truck, a torn road map): he cannot find a town without paying for a piece of the map. THE
  MAN AT THE BAR, told by one of yours: the old county survey office, the tripod on the roof.
- THE CLIMB: NENA (a scavenger kid with a rope and an empty sack): everything good is up high since the elevators died, and only his
  crew goes up. THE FLYER: THE HOIST WORKS. THE CLIMB DECIDES WHO GOES UP, the tower with the hoist.
Each a rumour on the feed (@abuela_paz, @manny_trucks, @nena_scraps), his meet card his face, title and one tip.

### 5. HIS VERB, WHAT IT HOLDS OVER THE VALLEY AND WHAT YOU TAKE (rule 330), each its own kind of place
- THE BURN held the warmth: at night, only his people could see and stay out. LIGHT A FIRE (his fuel): at night, on a dark block
  outside a town, once a night. The fire stays for good; at night, 2 blocks round any fire you lit, you see like in the day (the
  city's own sight down a street and its fog ask, two marked lines __THE_BOSS_FIRES_LIGHT_THE_NIGHT__ in slices/BOHEMIA_CITY_WORLD.html).
- THE SURVEYOR held the map: you only knew what you had walked. FILL IN THE MAP (his map): standing on a road (a freeway, the Strip,
  a big street), once a day: the fog lifts 10 blocks all round you, for good (the city's own fogReveal). His fall already shows every
  town (WORLD TWO's change, reveal).
- THE CLIMB held the way up: the top floors were scenery. GO UP (his hook): on a street beside a tower (a casino, a resort, a
  high-rise), once a tower: your men climb to the floors nobody reached and bring down 12 batteries.
The phone shows one verb at a time: the order is OPEN, PURIFY, GO UP, FILL IN THE MAP, LIGHT A FIRE, COOK (the place-bound ones
first), and a used-up verb steps aside for the next (a fire lit tonight, a survey done today).

### 6. WHAT HIS DEATH DOES, AND THE MAP AFTER (rule 338), exactly the first three's way
The camera to his place, the BEFORE a beat, the AFTER rolling in on the tape, then the one who asked says one line for the valley and
holds out the thing with one plain line (what, where, how often, the number); TAKE IT flies it onto the phone's button; a minute's
hush. On the map after, his changed place is the mark (no skull, no door, no plate), his name faint over it when close.
- ABUELA PAZ: "There are fires all down the street tonight. Nobody pays him to be warm anymore." HIS FUEL: "LIGHT A FIRE: once a
  night, outside a town. The fire burns for good, and 2 blocks round it you see at night like in the day."
- MANNY: "The whole map is on the wall for anybody to copy. Every town is on it now, no charge." HIS MAP: "FILL IN THE MAP: once a
  day, standing on a road. The fog lifts 10 blocks all round you, for good."
- NENA: "The hoist runs for anybody now. The top floors are open, and the lights are on up there." HIS HOOK: "GO UP: next to a tower
  (a casino, a resort, a high-rise). Your men climb to the floors nobody reached and bring down 12 batteries. Once a tower."

## PROOF

PROOF_PENDING

## WHERE HE SEES IT
The MAP (after THE FILTER falls, THE BURN's sign; ABUELA PAZ stops you; then THE SURVEYOR, then THE CLIMB), the fight at each place,
the phone's button. The VOTE tab: one moving card a boss (records/target/bosses_four_to_six/VOTE_BOSS_BURN.webp, _SURVEYOR, _CLIMB:
the man turning, walking, swinging his weapon and hit in the fight's own sheet; his face talking; the thing he hands you and the
mark; his place before, the tape, after), each with THE POT's dressed card as its twin and three differences.

## REFERENCE CHECK (the 9/4 standing duty)
The twins: the first three bosses at the same cell and their places at the same scale (compare.png; THE POT's dressed card on each
VOTE card). The real things: a structural firefighter's tan turnout coat with lime and silver trim, a traditional leather fire
helmet and its front shield, a 20-litre steel jerrycan, a road flare, a 36-inch fire axe with a pick head; a class-2 hi-vis vest, a
white hard hat, a map tube, a brass plumb bob, a range pole in red and white bands with a circular bubble; a hotel bellhop's jacket
and pillbox cap, a rope-access harness and carabiners, a coil of kernmantle rope, a crane hook with its safety latch; a bulk fuel
terminal's tanks and berm, a county survey office, a rack-and-pinion construction hoist and a red aviation lamp. No reference game.
Never purple: the oxblood is red (the purple share of each sheet measured in the proof).

## NOT DONE / NEXT
- The other thirteen of act one take a row each the same way (a model in this tool, a place and a mark in the paint tool, a thing
  in the hand tool).
- TUNING: 1.6x, 1.4x, 2 blocks, 10 blocks, 12 batteries, once a night, once a day, once a tower are shapes in the file.
- The phone still has one verb button; if he wants every power he holds side by side, that is UI's band, not this file.
