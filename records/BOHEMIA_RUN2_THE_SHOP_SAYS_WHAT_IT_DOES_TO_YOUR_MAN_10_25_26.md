# RUN TWO: THE SHOP SAYS WHAT IT DOES TO YOUR MAN (10/25, rule 202, BUILT)

HIS WORDS (10/25): "in the shop, you cannot just say how many batteries it cost without saying like the stat that it does... I
know when you wear the shield like it just reflects and like your stats bro."
THE RULING: records/BOHEMIA_PAOLO_THE_SHOP_SAYS_WHAT_IT_DOES_TO_YOUR_MAN_10_25_26.md (a) to (f).

## MEASURED BEFORE (main at ebbfb6b0)
- A shield's card: 'holds 16  weight 10'. Its melee and ranged defence (armor.json has both) never reached a screen.
- Every shield under 40 durability was 'a car door', every one over it 'a riot shield': 12 rows wore one name, 6 the other.
  The same for armour (4 names for 78 rows) and helmets (4 names for 87 rows).
- Nothing on the card said what the thing would do to one of his men.
- The crew screen showed his own numbers only: a shield on his arm moved nothing on it, while the fight added it.
- A pistol's card said the dagger row's damage; the fight shoots the row ours.pistol_shot rides.

## WHAT IS BUILT (__THE_SHOP_SAYS_WHAT_IT_DOES__)
1. **ONE SOURCE** (engine/bohemia_roster.js `worn(man)` and `wearing(man, item)`): his melee and ranged defence, fatigue and
   initiative WITH what he wears, read the way the fight's makeUnit reads them: the shield's defences (Shield Expert's
   quarter more), the weapon's and the shield's weight, the armour's and helmet's weight (Brawny's 30 percent off), half the
   weight of what rides in his bag (rules.json; Bags and Belts: only a two-hander weighs), initiative less the same weight,
   a two-hander putting the shield on his back. A pistol's damage is its shot's row (`fightWeapon`), its weight its own.
2. **THE CARD (a)**: tapping a thing on THEIR SHELF shows its own numbers in chips, UI's stat icons on the stats, before the
   Buy button and its price:
   - a shield: MELEE DEF +15, RANGED DEF +15, HOLDS 16, FATIGUE -10, INITIATIVE -10
   - armour and helmets: ARMOUR, FATIGUE, INITIATIVE (the weight comes off both, Battle Brothers' way)
   - a weapon: DAMAGE, VS ARMOUR, THROUGH ARMOUR, TO HIT, HEAD, its reach and rounds (the crew screen's own line), A SWING
     (fatigue a use), WEIGHT
3. **ON A MAN (b)**: under the numbers, 'ON RAUL, it suits him best' and his lines, 'MELEE DEF 12 to 27 +15', green better,
   red worse, 'same' in grey. A strip of his men's faces under it; one tap shows it on that man, and the man he picked stays
   picked for the next card. Unpicked, it shows on the man it helps most. A shield on a man with a two-hander says 'His
   two-hand rebar spear takes both hands: it would wait in the stash.' A two-hander bought for a man with a shield says his
   shield goes to the stash and shows his defences falling. 'He carries one just like it.' when he does.
   His men are the fight's: the crew screen's hand-over, else the company his origin rolled (named as the crew screen names
   them), and anyone hired since.
4. **THE CREW SCREEN (c)** (RUN TWO's marked lines in UI's file, NOTE on UI's board): MELEE DEF, RANGED DEF, FATIGUE and
   INITIATIVE show WITH what he wears; the gear's part sits beside the number in green or red; tapping it says 'MELEE DEF 27
   (12 his own, +15 from what he wears)'.
5. **EVERY ROW ITS OWN NAME (d)**: records/target/bb/armour_names.json, 184 rows (19 shields, 78 armour, 87 helmets), none
   alike, draft:true. Each is a word of its own and then the object it is drawn as, so COOK's model and UI's icon still read
   the object: 'a hatchback car door' (the Buckler), 'a hearse car door' (the coffin shield), 'a cop car door' (the heater),
   'a police riot shield' (the kite), 'a crash-bar riot shield' (the heavy metal one, COOK's crash bar), 'a Lake Mead riot
   shield' (the kraken's); 'a stage-magic work jacket', 'a dire-wolf-hide plate carrier', 'gang-painted full riot armour';
   'a showgirl-feather rag hood', 'a gas-mask hard hat', 'a T-visor full riot helm'. The shop, the crew screen
   (BohemiaRoster.itemOf) and UI's icons (itemFromRow, one marked line) read the same file; the starting door wears its row's
   name too. WORDS may better any; a modder may rename any row in the file.
   Weapons keep rule 194's names (a quality word in their kind, never shared across hands); (d) names shields, armour and
   helmets.

## THE GATE
THE SHOP SAYS WHAT IT DOES TO YOUR MAN (gates/the_shop_says_what_it_does_gate.js) 10/0, on the demo through Church's door:
N1 184 rows, none alike, each the object it is drawn as, the shop, the crew screen and UI's icons agreeing; C1 a police riot
shield's card MELEE DEF +15, RANGED DEF +25, HOLDS 48, FATIGUE -16, INITIATIVE -16 with UI's icons, before the price; C2 ON DESI
(his car door is better up close): MELEE DEF 32 to 27 (-5, red), RANGED DEF 25 to 35 (+10, green), FATIGUE 78 to 76, INITIATIVE
76 to 74, every number equal to the sum the gate does from the files; C3 a tap on YOU's face shows it on YOU; C4 a plate
carrier's card and a pistol's (DAMAGE 35-50, the shot it fires, REACH 1 TO 4 TILES, 5 ROUNDS); W1 bought and put on DESI by real
taps: the crew screen says MELEE DEF 27, RANGED DEF 35, as the shop said; F1 the fight stands DESI with the riot shield, 27, 35,
fatigue 76, initiative 74; K1 the computer, a face clicked; nothing threw.
RE-AIMED: EVERY ORIGIN STARTS LIKE ITSELF reads the Lone Wolf's kit by the object at the end of its name (it is 'a police riot
shield' now, still a riot shield).

## NOT DONE HERE
- The fight's own words still call every shield 'car door' (BAG_SAYS, the card's 'Car door on his back'): COMBAT's, NOTE on
  its board to read the row's name.
- The loot screen names through BohemiaRoster.itemOf, so it carries the new names with nothing of its own.
- Weapons' per-row names (140 rows) were not asked by (d); they keep the quality word.

[bb Battle Brothers: every item's tooltip lists its own numbers, and the character screen's bars move the moment it is worn]
[analog horror: numbers in worn chips on cracked plate, a dead man's car door with its defence printed on it]
