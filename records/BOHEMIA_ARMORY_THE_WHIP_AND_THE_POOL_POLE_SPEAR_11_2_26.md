# ARMORY 2: THE WHIP AND THE POOL POLE SPEAR (Paolo 11/2, rule 320, ask lines 316 and 317; BUILD 11/3zn)

Paolo 11/2: "Pool pole spear: this is so fire and so funny, I love the idea of this, I want this in the game... a two tile
weapon... it would be a whip kind of vibe... in Battle Brothers I think the range is three... the whip would be a range of two
tiles... not going to be the most damage ever, but Battle Brothers creates a bleeding effect, and maybe we can do a little more
damage... slightly more." Rule 320 dropped the poles' two-tile reach ('dog shit' on house tiles); the whip is the one melee weapon
that reaches past the next tile. Every other melee weapon stays one tile (rule 170(b)).

## MEASURED FIRST
- Battle Brothers' whips are in the data already as CLEAVERS: the Battle Whip (15-30, 25% vs armour, 10% through, 450) and the
  Thorned Whip (the barbarian's, 15-25, 30%, 20%, 400), each with Whip (range 3, two stacks of 5 bleeding for 2 turns when it takes 6
  or more) and Disarm (range 3, -20 to hit, no weapon skill for 1 turn). The fight read them as one-tile cleavers, held as a cleaver.
- The fight had NO bleeding, NO disarm, and a 'stunned' that it read in five places and nothing ever set.
- The coordinator's brief named the whip's skills 'Lash (aims the head, 30% straight through)': that is Battle Brothers' FLAIL skill
  Lash (its page, 1143_Lash: '100% chance to hit the head, 30% Direct Damage'), not the whip's. Ours keeps the whip's own page (the
  Whip skill's reach and bleeding) and calls it LASH, the word on his button; the flail's head and 30% are not put on the whip.

## WHAT SHIPPED
records/target/bb/armory.json (the modder's file, five new entries and five new keys: 'starter', 'prop', 'lash', 'tune', 'whip'),
written by tools/bohemia_armory.py into the rows the game already reads. records/target/bb/ours.json 'whip': the reach (2), the skills
that make a whip, Disarm, Battle Brothers' bleeding, AUTO's two weights, each with its source and his quote.

| piece | made from (Battle Brothers) | damage | vs armour | batteries | where | what it does |
|---|---|---|---|---|---|---|
| Pool Pole Spear | militia spear / ancient spear | 25-35 | 95% | 17 | every camp smith; road militia, caravan hands, debtors carry it | a one-tile spear: THRUST, SPEARWALL |
| Extension Cord | battle whip / thorned whip, +5 top | 15-35 | 30% | 18 | every camp smith (the starter whip); a town now and then | LASH two tiles, bleeding; DISARM; the plug at the tip |
| Live Wire | battle / thorned, +5 each end | 20-35 | 30% | 62 | towns and fortresses by its price; the brigand leader carries it | a landed lash stuns one time in four (he loses his next turn); every lash burns one battery from the purse |
| Barbed Wire | thorned / battle, +5 each end | 20-35 | 20% | 36 | towns and fortresses by its price; the beastmaster (the lab handler) carries it | three stacks of bleeding (the most); every lash cuts his own bare hands 1 to 2 |
| Rodeo Bullwhip | battle / thorned, +5 each end | 20-35 | 30% | 98 | fortresses by its price; nomad outlaws and bounty hunters carry it | LASH +10 to hit (the most accurate); every lash cracks, a nerve check on the man 20 easier than a wound's |

The numbers: the mean of the two Battle Brothers whips (the first round's rule), then 'tune', each move with its why in the row's
source: his 'a little more damage' is +5 at one or both ends (Battle Brothers' battle whip is 15-30); the cord is priced and worn as
a cord off a garage wall; the wire is softer on armour than leather; the bullwhip is built to last and dear.

THE FIGHT (slices/BOHEMIA_FIGHT.html):
- REACH: a whip strikes from one or two tiles (ours.whip.reach), never three; every other melee weapon from the next tile (the card's
  REACH says two for a whip). Battle Brothers' own two whips reach two as well: the reach is the family's.
- LASH, landed and taking 6 or more: Battle Brothers' bleeding, two stacks of 5 a turn (the barbed wire three), ticking when the
  bleeding man's turn closes, two turns; a man it drops is the whip man's kill. The live wire's stun: he starts his next turn with no AP.
- DISARM rides the sweep's button (its square: him and the man two off): no damage, and his next turn he cannot use his weapon
  (the strike says why: 'disarmed'); it lasts that one turn. Beasts and the wiki's Disarm-immune shrug it off.
- EVERY LASH, landed or not: the live wire's cell (counted in the fight, taken from the purse by the shell at the end, never more than
  it holds); the barbed wire's cut on his hands (never his last health; heavy armour of 150 or more, the plate carrier and the riot
  gear, counts as gloves, because the game draws no gloves yet); the bullwhip's crack (a nerve check, one rung down if he fails).
- THE PREVIEW (rule 312, COMBAT 3's 'every skill lights the tiles it hits'): on a whip man's turn his two tiles are taped off like a
  gun's ground; a man picked two tiles off has his tile lifted and ringed and his hurt tag over him; DISARM armed lights every man
  it reaches, his tag saying DISARM, not a number.
- AUTO (COMBAT 4's brain): a whip man scores a tile two off every melee man of theirs higher (ours.whip.auto_second_tile), counts a
  tile in the named man's face as half a ring more (auto_face_ring), and never steps in to his face: in four real fights, half his
  lashes came from the second tile.
- THE LASH ON THE GLASS: the cord drawn from his hand to the man, one tile or two, over the swing's beat, SIX DRAWN KEYS A BEAT and
  nothing between: wound back, rolled overhead, OUT TO THE MAN ON THE KEY THE BLOW LANDS, the tip dropping, slack on the ground,
  drawn back in. Each point of the cord turns at most 80 degrees between two drawn keys (the envelope law's limit is 120). Whole
  pixels with the ink shadow; the orange cord and its plug, the live wire's black and its spark, the barbed wire's barbs, the
  bullwhip's leather and its crack. The whips are held as the chain prop (the flail's hanging chain, a stand-in until COOK models the coil; never the cleaver Battle Brothers' rows used).
- THE WORDS over the men (draft:true): BLEEDING, -N blood, STUNNED, DISARMED, -1 cell, -N hands, CRACK, each with its line.

THE SHOPS (slices/BOHEMIA_SETTLEMENT_SCREEN.html): a row marked 'starter' sits on every camp's smith shelf whatever the roll (the
camp's junk): the pool pole spear and the extension cord, on all 12 camps rolled. The rest are rolled by price like every row.
THE ICONS (slices/bohemia_ui_materials.js): five cut by hand: the pool pole with its taped knife, the orange cord coiled with its
plug, the battery pack and its sparking wire, the barbed wire on a taped handle, the plaited bullwhip.
THE PURSE (slices/BOHEMIA_ALPHA_0_9.html): the fight's cellsBurned leaves the purse once at the fight's end, 'the live wire: a cell a
lash'.

## PROOF (tools/bohemia_armory_whip_proof.js, at phone size through the one driver; records/target/armory/whip_proof.json)
- Each whip's man two tiles from a brigand on his own turn: canStrike true at 2, LASH's second tile lit (the shapeLit record:
  'reach 2'), the lash struck by the fight's own strike, its cord drawn and held on the crack key for the still
  (whip_<id>_lash.webp), the six keys clipped round the two men, each held for its frame with the swing clip held at the same point of its beat, played on the beat as one moving picture (whip_<id>_lash_keys.webp, 83 ms a key at 120 BPM, then a rest): the VOTE tab's card.
  The live wire's lash said '-1 cell'; the bullwhip's said 'CRACK'. 0 page errors.
- DISARM armed on the extension cord: its button is on the bar and the man two off lit, tagged DISARM, 42% (whip_disarm_preview.webp).
- The pool pole spear thrusts at the man beside him (whip_pool_pole_spear_lash.webp); two tiles off it cannot.
- The five icons at real pixels (whip_icons.webp).
- Twelve camps: both starters on every smith's shelf (12 of 12); 24 towns and fortresses rolled the live wire, the barbed wire, the bullwhip and the cord by price. The shot of a camp smith's open shelf came back empty in the bare settlement page (the door's click opened nothing there); the 12-camp roll is the proof, not the picture.
- gates/the_whip_reaches_two_tiles_gate.js (new, 13/0): the rows, the reach (one and two, never three; the pole one), the bleeding
  and its tick, the barbed wire's three stacks, the live wire's stun (103 of 400, 26%) and its 400 cells, the hands (bare -2, gloved
  0), the crack and the +10, DISARM (no health, his strike refused 'disarmed', back after his turn), AUTO from the second tile (32 of
  64 lashes in four real fights), the lash keys (six, the crack on the landing's key, worst turn 80 degrees).

## CHECKS RUN (the ones this change touches)
Green: the whip reaches two tiles (13/0, new); melee is one tile, cover is what is on the tile (10/0, amended for rule 320: a whip
reaches two and never three, a new leg); every item has a model (206/0); the melee in his hand (green).
RED BEFORE THIS ROUND, NOT ARMORY'S: the fight reads only sourced numbers, leg 1 (dealHash's hash constants, COMBAT; the two numbers
this round typed into the rules were moved into ours.whip before ship) and its drawing leg ('.fat = ', six writes, the same six on
clean main).

## OWED (honest)
- OWN 3D MODELS for the five (COOK): today the pole is drawn as the rebar spear in his hand and the whips as the chain; the lash's
  cord is its own drawing.
- GLOVES: the barbed wire's 'without gloves' reads heavy body armour until CHARACTER draws gloves (a glove row would replace the
  150 line in armory.json).
- The live wire in an ENEMY's hand stuns but burns no purse (they have none); the cell is the company's cost only.
- The other six of the coordinator's ten whips (the velvet rope, the fire hose, the choke-chain leash, the charger cable, the
  seatbelt, the lab-beast hide) are entries away: armory.json carries every key they need except their own effects.
- SOUNDS owns a crack and a cord's hiss; the lash plays the swing's sound today.
