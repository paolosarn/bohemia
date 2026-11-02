# ARMORY: FOURTEEN WEAPONS AND NINE ARMOURS OF THE VALLEY'S OWN (Paolo 11/2, rule 302, ask line 289)

Paolo 11/2: "more clothing, more weapons, the whole thing." His rulings this round carries: melee works one tile away, guns
reach two tiles or more (rule 185: and fire at the man beside him); guns spend rounds, melee spends nothing; Battle Brothers'
families and armour layers are the model, easier than Battle Brothers; weapons held properly, two hands for long guns; the
armour he wears shows (rule 272); nothing that looks AI-made. CHARACTER owns clothes and hair, SOUNDS the gun and hit sounds:
not touched here.

## MEASURED FIRST (before this round)
- Weapons: 126 rows, every one a Battle Brothers wiki row named by its class word and a quality word ('beat-up pipe', 'good
  rifle'). All 14 Battle Brothers classes had a Bohemia word (pistol=dagger, pipe=mace, sledge=hammer, rifle=crossbow,
  shotgun=firearm, bottles=throwing, machete=sword, fire axe=axe, rebar spear=spear, cleaver, chain=flail, pole hook=polearm,
  compound bow=bow). What was MISSING was the valley's own pieces: not one weapon had a name of its own, the guns were thin
  (6 pistols that were all one drawn object, 4 rifles, ONE shotgun because Battle Brothers has one firearm), and the drawn
  objects were 13 weapons (18 shapes in the fight's hands).
- Armour: 78 body, 87 head, 19 shields, all wiki rows with house names (rule 202(d)); 11 head looks and 6 body looks drawn on
  the man (engine/bohemia_wear.js), among them a welder's mask, a motorcycle helmet and a gas mask that no piece of the
  valley's own wore.

## WHAT SHIPPED
records/target/bb/armory.json, the file a modder edits (one entry a piece), written into the files the game already reads by
tools/bohemia_armory.py (idempotent; every written row carries 'armory'): weapons.json rows, armor.json body/head rows,
armour_names.json, armour_looks.json, ours.json pistol_shot.by_row (a new pistol's shot, rule 195), slices/rig_melee by_row
(held as its family's prop), reference/models/bohemia/items.json (the model that draws it today).

THE NUMBERS: each piece sits BETWEEN two Battle Brothers rows of its family (the mean of the two: damage and percents to the
nearest 5, value to the nearest 10) and fights with the lower row's own skills, reach and rounds, so every number traces to two
wiki pages and no piece is a copy of an old one (the tool refuses a duplicate). The shotguns take the rifle family as their
second row because Battle Brothers has one firearm (stated in the row). Easier than Battle Brothers is TUNING's sliders over
every row, not these.

| piece | family (Battle Brothers role) | hands | damage | vs armour | batteries | tier |
|---|---|---|---|---|---|---|
| Zip Gun (improvised) | pistol (knife) | 1 | 15-30 | 55% | 11 | camp |
| Snub Revolver (pre-collapse) | pistol (rondel dagger) | 1 | 20-35 | 65% | 38 | town |
| Lever Rifle | rifle (crossbow) | 2 | 35-55 | 65% | 53 | town |
| Scoped Deer Rifle | rifle (heavy crossbow) | 2 | 45-65 | 75% | 198 | fortress |
| Sawed-Off Shotgun (improvised) | shotgun (handgonne) | 2 | 35-65 | 75% | 165 | town |
| Pump Shotgun (police) | shotgun (handgonne) | 2 | 45-75 | 85% | 310 | fortress |
| Crowbar | pipe (mace) | 1 | 30-40 | 100% | 25 | camp |
| Bike-Lock Chain | chain (flail) | 1 | 15-35 | 65% | 17 | camp |
| Box Cutter | cleaver | 1 | 25-35 | 80% | 23 | camp |
| Framing Hammer | sledge (one-hand hammer) | 1 | 20-35 | 175% | 51 | town |
| Broom Bayonet (improvised) | rebar spear (spear) | 1 | 30-35 | 95% | 47 | camp |
| Pawn-Shop Katana | machete (sword) | 1 | 45-50 | 80% | 208 | fortress |
| Splitting Maul | fire axe (two-hand axe) | 2 | 55-80 | 140% | 120 | town |
| Sign-Post Halberd | pole hook (polearm) | 2 | 50-80 | 125% | 105 | town |

| armour | drawn on him as | holds | weight | batteries |
|---|---|---|---|---|
| a football-pad padded vest | padded vest | 55 | 5 | 12 |
| a duct-taped carpet padded vest | padded vest | 70 | 7 | 17 |
| a licence-plate padded vest | plated jacket | 85 | 9 | 19 |
| a riot-gear plate carrier | riot armour | 150 | 18 | 98 |
| road-sign full riot armour | the strapped-on panel | 180 | 24 | 115 |
| a goalie-mask hard hat | gas mask | 60 | 3 | 12 |
| a football riot helmet | motorcycle helmet | 110 | 6 | 39 |
| a welding-mask riot helmet | welder's mask | 140 | 11 | 60 |
| a gas-visor full riot helm | riot helmet | 195 | 12 | 125 |

Every line a piece says in the shop is draft:true, eighth-grade (armory.json 'line').

WHERE HE MEETS THEM:
- THE SHOPS: every piece is a row like any other, so the smith, the armourer and the arms dealer roll it by value (a camp the
  cheap 40 percent, a town the middle, a fortress the top), priced at ten to one. A weapon of the valley's own wears its own
  name and its own hand-cut icon (22 cells, 132 device pixels, 14 new drawings in slices/bohemia_ui_materials.js), never its
  family's pack tile; it is never counted in its family's beat-up/solid/good ranking, so no old name moved.
- THE FIGHT: held through the fight's own layers, by family: the pistols one-handed (PIdle/PAim), the rifles and shotguns in
  both hands, the melee in its family's prop (crowbar as the pipe, katana as the machete, maul as the two-hand fire axe,
  halberd as the pole hook). The armour is drawn on him by its class (welder's mask, gas mask, motorcycle helmet, plated jacket,
  riot armour). Melee reach stays one tile (ours.melee_reach), a gun reaches two or more and spends rounds.
- THE LOOT: in a fight, every second brigand of a kind whose wiki gear holds a piece's lower row carries the piece instead
  (armory.json carried_by: thugs the zip gun, chain, box cutter, hammer, bayonet and maul; marksmen the revolver and rifles;
  raiders the halberd and maul; raiders and marauders the katana). Same family and hands, so no other roll in the fight moves;
  it drops like anything he holds (engine/bohemia_spoils.js).

## WHAT IS STILL OWED (honest)
- OWN 3D MODELS: in a man's hands a new weapon is drawn as its family's model (the fight's held layers are rendered per look in
  Blender and this container has none). COOK models each piece (a glb per piece, reference/models/bohemia/items.json lists them
  under their family today) and ANIMATION renders them into the hand layers. That is the next job for this ask line.
- ARMOUR ICONS draw their weight class's picture (rule 202(d)'s object word), so the three vests share one shape in the bag;
  the man himself wears the piece's own look. Own icons per armour class is a UI line.
- Enemies do not wear the armour pieces (an enemy's armour is numbers on the wiki row, not a row); they reach him through the
  armourer.

## PROOF (tools/bohemia_armory_proof.js, the shipped pages at phone size, 390 by 844 at 3x, through the one driver)
- COUNTS: weapons 126 -> 140 rows (guns 11 -> 17: pistols 6 -> 8, rifles 4 -> 6, shotguns 1 -> 3; melee +8), drawn weapon
  objects 13 -> 27; body armour 78 -> 83, head 87 -> 91; looks on the man in use by a piece of the valley's own 0 -> 8.
- THE FIGHT, two real fights playing themselves (AUTO), his seven men each holding one new weapon and wearing a new helmet and
  body piece: both won (7 rounds, 4 rounds), 0 page errors. Every one of the 14 new weapons struck at least once (the fight's own
  log: zip gun 8 swings 4 hits, snub revolver 8/6, lever rifle 6/2, scoped deer rifle 5/2, sawed-off 7/4, pump shotgun 6/2,
  crowbar 4/2, bike-lock chain 4/4, box cutter 4/3, framing hammer 5/5, broom bayonet 4/3, katana 2/2, splitting maul 2/1,
  sign-post halberd 3/3). The six guns are guns (rounds, two hands for the long ones); the melee held as their family's prop
  (the maul and the halberd in two hands). All eight looks drawn on the men (padded vest, plated jacket, riot armour, the
  strapped panel; gas mask, motorcycle helmet, welder's mask, riot helmet). Brigand thugs carried the broom bayonet and the
  framing hammer against him (the loot path).
- THE SHOPS, 36 places of every size: 20 of the 23 pieces on a shelf somewhere, each at its tier (camp: the bayonet, chain,
  zip gun, crowbar, box cutter, the pads and the carpet; town: the lever rifle, maul, halberd, riot-gear; fortress: the deer
  rifle, pump, sawed-off, revolver, road-sign armour, welding mask). The katana, the goalie mask and the gas-visor helm did not
  come up in those 36 rolls (rare by value, there to be found). shop_smith.webp: the crowbar and the lever rifle on a town
  smith's shelf in their own icons beside the pack tiles.
- icons.webp: every piece's icon at real pixels (22 cells, 132 device pixels).

## CHECKS RUN (only the ones this change touches)
Green: every item has a model (206/0), every item has an icon (10/0), a two-hander wears its own name (8/0), weapon shapes (9/0),
god gear (37/0), the guns on the crew screen (7/0), the armour he wears shows (18/0), the spoils (28/0), melee is one tile (9/0),
the thing in his hand (29/0).
RED BEFORE THIS ROUND, NOT ARMORY'S (measured on clean origin/main 938555f2 where it matters):
- the shop says what it does, W1 WORN: the crew screen never opens after the shield buy (null), the same on clean main. RUN TWO.
- the market in the pack's art: the food tile (slices/market_icons/s_food.png) is no longer the pack's or COOK's file byte for
  byte (rule 240's can and bottle). UI. This round's own leg there (the valley's own pieces wear their drawn icon) is green.
- the fight reads only sourced numbers, leg 1: dealHash types its hash constants in the rules script (6dd42aea). COMBAT.
