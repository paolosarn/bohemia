# CHARACTER 11/21: THE EYE IN THE SKY IN ITS OWN CLOTHES (rule 461 as amended 11/21; row 286; BESTIARY's stand-in list)

The coordinator's routine 11/21 ('CHARACTER: unstuck, carry on'): 'Pick up where you stopped (after BUILD 11/20g THE HEAD TAKERS:
checking BESTIARY's enemies file for stand-ins, so the four newest enemies wear real clothes), then your handoff's next job: more people,
the runway.' BESTIARY's enemies file on main carries eight rows in a stand-in: the casino gunner (faction_reds), the spotter
(faction_network), the doorman (person_mob_2), the preacher (faction_church), the penitent (faction_homeless), the grenadier
(person_caravans_2), the siren (person_reds_2), the battery man (person_trades_2). The eye in the sky's three are one faction:
this build (BUILD 11/21h). MADE FROM the nine enemies' recipe he passed (VOTE character-the-nine-enemies-their-own-clothes-11-7, YES 11/8).
Rule 461(c) as amended 11/21: no send_later, nothing that waits on a tap; the lane keeps going in the same turn.

## WHAT THEY WEAR
BESTIARY's notes: the gunner 'a security vest and a gunner's hat', the spotter 'casino security: a vest, a radio, an earpiece', the
doorman 'casino security's black suit and an earpiece'. Ours are the casino floor's men still in the house's black, a black shirt, and
ONE mark on all six, a TIE in the casino's own banner ink (factions.json city_states #af9b5a, a value down and dusted to 150, 134, 76:
the brass-gold of its signs).
| man | his coat | under it | the rest |
|---|---|---|---|
| gunner 0 (olive, grease back) | a TACTICAL VEST, a dust work cap | a soot button-up | a shell bandolier, leather gloves, drop-rise trousers, tall moto boots |
| gunner 1 (olive, grease back) | a LEATHER VEST | a soot button-up | a shell bandolier, soot gloves, charcoal crop trousers, charcoal boots |
| spotter 0 (tan, temple taper) | a charcoal CAR COAT, wraparound shades | a soot button-up | leather gloves, drop-rise trousers, charcoal boots |
| spotter 1 (brown, temple taper) | a charcoal COMMA COAT, grey wraparounds | a soot button-up | soot gloves, a leather belt, charcoal crop trousers, tall moto boots |
| doorman 0 (chalk, grease back) | a charcoal SPLIT-TAIL COAT to the knee (the tailcoat) | a soot button-up | leather gloves, drop-rise trousers, tall moto boots |
| doorman 1 (pale, razor skull) | a charcoal SPLIT-TAIL COAT, wraparound shades | a soot button-up | oxblood gloves, charcoal crop trousers, charcoal boots |
NEW IN THE TOOL: the SOOT BUTTON-UP (the base's own button-up cut in charcoal cloth, registered in memory as its HI-VIS VEST and BLAZE
SCARF are) and the TIE (a body piece: a blade down the middle of the chest from the collar to the belt, widening to a point, a knot at
the throat, in its type's 'tie' colour). THE OUTFIT is off for these three types (as for the Keepers): a black shirt under a black coat
is the look, and the tie is the contrast. Strict blue 0 in 100 on all six; cool pixels 1.7 to 12.8 in 100, the black cloth's shadow.
LOOPS: (1) on a white shirt the gold tie, 2.4 to 3.8 cm wide, was a pale one-pixel line and on the gunners nothing: black shirts, a tie
3.8 to 5.8 cm wide; (2) and (3) a vest's padded front stood over the tie (the tactical vest's pouches up to 5.5 cm): the tie stands
5.8 cm further out on a vest. Seen honestly: it reads on five of the six from the front; on gunner 1 the leather vest still closes over
most of it (a gold line at the collar), and his bandolier and black shirt carry the house. Stopped at three loops (rule 7/26's tell).

## THE PIPE (tools/bohemia_character_the_nine_enemies.py)
- TYPES['Gunner'] (2, row casino_gunner), ['Spotter'] (2, row casino_spotter), ['Doorman'] (2, row casino_doorman); stream Reds, cell
  faction_reds (its guns) for all three; CASINO_GOLD, the SOOT BUTTON-UP, the tie.
- roll-more for each, look, make, pack: the three rows' looks (looks_borrowed keeps faction_reds, faction_network, person_mob_2) and the
  stand-in notes dropped.

## PROOF
- ONLY THE SIX ADDED, NOBODY DROPPED (every index counted on main ed219cd2c and on this tree after the last pack): the fight's enemy
  looks 62 -> 68, its faces 178 -> 184, the packed atlases 229 -> 235; every other count the same (crew 13, faction 13, tier 2, beast 23,
  person 69, robot 1, boss 18; the idles, the map's people, the town's, the held clips, the melee, the map's mix, the walk sheets). The
  forty-five earlier nine-enemies men were packed again on this box and came out byte-identical. In records/target/bb/bohemia_enemies.json
  only the casino_gunner, casino_spotter and casino_doorman lines changed (looks, looks_borrowed, the stand-in note dropped).
- THE WEIGHT: the publish list on a clean checkout, 865.6 MB in 14,263 files against main's 862.3 MB in 14,245; the card lossless WebP,
  161 and 41 KB; the street pass and the phone shots in records/character/, never served.
- GATES on this tree: THE BESTIARY FLOOR --no-browser 13/0, THE SHEETS ARE PACKED 4/0, DEMO BUILD 25/0, TRENCHCOAT 12/0, THE PACKERS
  MERGE 4/0, THE FACE IS HIS OWN FACE 18/0, HANDOFF 10/0, ATTEMPT 15/0. Main's reds, the same on clean main ed219cd2c: EVERYBODY IDLES
  --quick 35/3 (P1 the enemies with no idles yet, ANIMATION's, now naming these six too; C3; R5) and NO TWO PEOPLE ALIKE 22/1 ('every
  file loads': slices/fight_ground/homecenter/homecenter_art.json and the hospital's, the big insides whose art is not in yet).
  VOTE TAB on the card's tree: the five reds clean main carries; this card's why and mark checked with the gate's own split.
- ON HIS PHONE (gates/the_bestiary_floor_fight.js with ONLY_TYPES=casino_gunner,casino_spotter,casino_doorman and its SHOTS; before on
  main ed219cd2c, after on this build): the demo and the alpha, upright 390 x 844 and on its side: BEFORE the gunner fielded in
  faction_reds, the spotter in faction_network, the doorman in person_mob_2; NOW each in his own sheet ('own' and 'drawn' true), named,
  armed with his row's gear, the win home, 0 page errors, all four. The spotter's call (the ground marked, then hit) seen on three passes
  at the first or third fight; on the alpha upright the first run's four fights saw no call, and run again alone it called in round 4 and
  landed in round 5 of its second fight (AUTO's chance, the call is BESTIARY's). The doorman's party deals one doorman and the page dealt
  doorman 1 every time; doorman 0 is on the fight sheet and the card. Shots: records/character/the_eye_in_the_sky/.

## NEXT
- The rest of BESTIARY's stand-ins: the flock's preacher (its robe with a stole and a staff) and penitent (sackcloth, a rope belt, ash on
  his face), the hired guns' grenadier (a company jacket, bottles in a bandolier, the company's sash), the block watch's siren (a
  neighbour's housecoat, the crank siren on a strap), the machines' battery man (a work suit hung with taped cells, gloves eaten through).
- The bosses' crews in their own trades, once BOSSES gives each boss a looks list; the thirteen 'faction_*' tunics; nine hall men at
  three layers, homeless_1, mob_2. DESI (row 633) untouched until his word.
