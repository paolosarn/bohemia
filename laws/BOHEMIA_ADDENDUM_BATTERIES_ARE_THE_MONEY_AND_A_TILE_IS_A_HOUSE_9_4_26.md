# BOHEMIA ADDENDUM -- BATTERIES ARE THE MONEY, AND A COMBAT TILE IS A HOUSE
# (Paolo 9/4/26, LOCKED. Three rulings in one message, recorded the same turn
# by the coordinator. Newest date wins on exactly what is written here.)

## HIS WORDS
> "keep in mind i dont want there to be money money maybe electronics like
> batteries are the currency. For one aa battery a bag of rice and so on so
> forth"
>
> "I need a simpl keyboard shortcut where they know what they are supposed
> to do and be incorporated into the beta and run"
>
> "maybe for combat maybe we can have the same combat as rogue fable 4 and
> battle brotbers combined and shit but instead of each combat tile being
> the size a human maybe each combat tile is the same size as the house and
> a pistol is like a dagger compared to the range of battle brothers and a
> rifle can do two tiles am I making sense???"

## 1. BATTERIES ARE THE MONEY. THERE IS NO "MONEY MONEY".
- There is NO abstract currency. No coins, no crowns, no credits, no score
  called money. **The thing you trade with is a BATTERY.**
- Prices are stated IN BATTERIES: *"one AA battery, a bag of rice."* Under
  EVERYTHING COSTS ONE (8/15) that is literally the first price table: a
  bag of rice costs one battery, and so on, until he tunes.
- THIS DOES NOT ADD A FOURTH CURRENCY. The three (7/26, LOCKED) stand:
  RESOURCES (apple, duct tape), ELECTRICITY, CLOUT. What changes is the
  ROLE of electricity: **it is the medium of exchange.** Food and tape are
  what you BUY; batteries are what you buy them WITH; clout is what you
  cannot buy. The market's trading currency moves from `resources` to
  `electricity`.
- AND IT DOUBLES THE DRAIN. Day 23's "the night eats power" now means
  **your lights burn your money.** Holding a lit block costs the same thing
  a bag of rice costs. That is the tightest economy loop in the design and
  it needed no new mechanism.
- REALISM FIRST, and this one is very real: when money dies, people settle
  on a commodity that is durable, divisible, universally useful and hard to
  fake. Cigarettes in the 1945 POW camps (Radford), bottle caps, detergent
  in modern barter economies. A battery is all four: it keeps for years,
  it comes in fixed sizes (AAA, AA, D), everybody needs one, and you cannot
  counterfeit a charge. It even decays slowly (alkaline self-discharge is a
  few percent a year), which is the old "rusting money" idea that keeps
  people spending instead of hoarding.
- WHAT STAYS HIS: which goods exist, what any of them costs above 1, and
  whether battery SIZES are different denominations. Not decided here.

## 2. ONE WORD STARTS A CHAT, AND WHAT IT BUILDS LANDS IN THE BETA
- The "simple shortcut" is the lane word: type `world`, `sound`, `run`,
  `combat`, `quests`, `people`, `ui`, and the chat pops the top row of its
  queue. That exists (the AUTONOMY DOCTRINE's GO procedure, and the 9/4
  reorder that put the study rows at the top of every lane).
- **AND THE RESULT MUST REACH THE PLAYER, NOT JUST THE BENCH.** A row is
  not shipped until it is in the walked surface AND the demo build (THE
  DEMO IS ITS OWN LINK, 8/25). Every lane banner now says so: when you
  ship, re-cut the demo. Changes inside the walked city flow through by
  `src` (day 21 measured this); changes to the shell need the re-cut.

## 3. A COMBAT TILE IS A HOUSE, NOT A BODY
- The rules stay: ROGUE FABLE 4 on the beat (8/26) and the Battle Brothers
  study's takes. **THE BOARD ZOOMS OUT.** A combat tile is the size of a
  building lot, not a person.
- Ranges compress with it. **A PISTOL IS A DAGGER: adjacent tile only.** A
  RIFLE REACHES TWO TILES. Shotgun and SMG fall between; a scoped rifle may
  reach further, and where it stops is his.
- WHY IT IS GOOD, in the study's own terms: it makes GUNS BAD IN CLOSE (day
  3) true by geometry; it gives the map a GRAIN (day 19) because streets
  become lanes and buildings become cover; it makes INTERIOR = EXTERIOR
  (7/19) a combat verb, because a house is a tile you can go INTO; and it
  makes a two-on-eight fight (8/31) readable, because every body is on a
  lot, not a floor tile.
- REALISM NOTE, recorded so nobody thinks it was missed: a real pistol
  fight happens inside 3-7 yards, so pistol = adjacent lot is realistic. A
  real rifle reaches 300 m and more, which is ten lots or more. **His two
  is a legibility trade, made on purpose, and REALISM FIRST says that trade
  is his to make.** It is made.
- HOW IT SHIPS, per HE MUST BE ABLE TO DIRECT IT (8/12): NOT by ripping out
  the human-scale board. **As a dial in the COMBAT tab's DEMO SETTINGS,
  beside SHE FIGHTS WITH YOU: `TILE = A BODY / A HOUSE`.** He flips it and
  plays both. No accuracy or damage number moves (NO DAMAGE BEFORE THE
  DIAL); only distances change.
- 120 BPM (his 9/4 order on every row): a step is still one beat. A step
  is now one house.
### 3b. THE PLAYER STAYS THE SAME SIZE. ONLY THE GROUND ZOOMS OUT.
His follow-up, same day: *"the size of the 'ground' changes but the
player is the same size just what they 'walk' on is a more zoomed out
city so it really feels like war is spilling in the streets type shit
when its a combat shit."*
- The character sprite is drawn at its normal size (the 56 rig, 112 on
  screen). **The FLOOR under it is the city at a zoomed-out scale**, so a
  person stands bigger than the houses they are fighting over. Figures on
  a war map. That is the look: **war spilling into the streets.**
- REUSE-FIRST, and it is already built: the walked city has a zoomed-out
  CITY mode (the same surface the pad moves across at "ninety-six metres
  and ten minutes" a press, day 19). **The combat floor is that render,
  centred on the block you are standing on**, not a new board. ONE SEED,
  same coordinates, so the fight happens on the actual streets you walked
  to get there.
- What this settles for the COMBAT lane: the board is a VIEW of the city,
  the sprites do not shrink, and cover is the buildings that are really
  there. Interiors stay INTERIOR = EXTERIOR (7/19): step onto a house
  tile and you go inside it.

### 3c. ALWAYS A GROUP, AND GUNS ARE THE NEW MELEE (same day, sharpened)
His words: *"I can't imagine anyway that there's no more like a little
small individual battles with just like single entities... I think that's
for the better... I still want combat to still play out the same just the
tiles are zoomed out... each house could be the size of like a medium
house, the size of one grid... you're always either fighting a group of
something... and guns are just like the new melee shit... realistically
like skill levels with ranges... a pistol that becomes like a dagger and
it's like one tile away and shit reliably."*
- **THERE ARE NO SINGLE-ENTITY FIGHTS.** A fight is always against a GROUP.
  ENC_SIZES already ships [3,4,5,6] and a boss is a man with a job inside
  a group; a lone-enemy encounter is not a thing this game has. Encounter
  authoring (PEOPLE's roadside director, QUESTS' @DO) never spawns a fight
  of one.
- **THE RULES DO NOT CHANGE. ONLY THE GROUND.** RF4 on the beat, the
  companion, the bosses, the nerve roll, the perk tree: all identical. A
  tile is one grid square of the zoomed-out city, about one medium house.
- **GUNS ARE THE NEW MELEE.** Ranges read like a fighter's reach, not a
  ballistics table: a PISTOL IS A DAGGER, one tile, RELIABLE at one. A
  rifle is a spear or a bow, two tiles. Reliability drops with the tile,
  the way melee skill would, and the readout still shows ONE NUMBER, theirs
  on you (day 17). No accuracy or damage number moves (NO DAMAGE BEFORE THE
  DIAL); what changes is the distance a weapon's existing accuracy applies
  over.
- "Skill levels with ranges": a perk that extends a weapon's reliable
  tile is a VERB, not a stat (day 9): you can now do a thing at two tiles
  you could not. That is how the perk tree touches this without a number.

### 3d. THE TILE IS WIDER THAN THE PERSON, SO THE GROUND CAN SHOW WHAT IT IS
His words: *"tiles are actually wider now... to give the art more room to
cook with... even if the player character stays the same... the length and
width of a single tile could be bigger so it gives more room for the art
to show what the fuck is underneath... a house with a large backyard is now
one by two tiles big... when the player character is standing in the
middle of a tile... there's more space between characters because of it...
a single tile could be instead of a 2x2 maybe a little smaller than that."*
- **THE TILE IS DRAWN WIDER THAN THE SPRITE.** The sprite stays its normal
  size and stands in the MIDDLE of its tile. The tile on screen is about
  one and a half to two sprite-widths across, so the ground under and
  around a body has room to read as a house, a yard, a street, a lot.
- **BUILDINGS SPAN TILES.** A house with a big backyard is 1 by 2 tiles.
  A fortress is more. The town's footprint on the combat board is the
  same footprint it has on the map (INTERIOR = EXTERIOR, 7/19, now in a
  third place).
- **MORE SPACE BETWEEN BODIES.** Which is exactly what makes a pistol at
  one tile read as close and a rifle at two read as reach: the distance
  is visible.
- **THE EXACT RATIO IS BY EYE, HIS.** It ships as a DIAL beside the TILE
  dial in COMBAT's DEMO SETTINGS (TILE WIDTH, in sprite-widths, default
  about 1.75) so he moves it by looking, never by a number in a file.
- **THIS IS ART'S ROOM TO COOK.** A combat ground tile at that size is a
  real canvas on the 45-degree corpus: the house, the yard, the street,
  cover that reads. DIRECTION's style card covers it; ART cooks it.

## 4. RULED 9/5: BATTERIES ARE MONEY ONLY, AND BUILDINGS MAKE THEM (Paolo, LOCKED)
"This game is hardcore but it's also fun and simplified... do you need batteries to
turn a laptop on, or do you need batteries to do things? Normally I have nothing to
do with batteries, but if it's electricity, it's the new currency, so we're gamifying
it a little bit and that's OK because it's a fucking game... you kind of asked me do
groups or people sell currency... there could be ways where you auto-mine batteries,
maybe set up certain buildings wherever you're doing and that's just more batteries."
- **BATTERIES ARE MONEY AND NOTHING ELSE.** No action needs a battery to happen. A
  laptop turns on. A light is on. There is no power meter, no fuel gauge, no
  "out of charge" state anywhere in the game. A battery is spent only the way a coin
  is spent: to buy, to pay, to be owed.
- **NOBODY SELLS CURRENCY.** The coordinator's 9/5 question ("does the player charge
  it or does a faction sell it") was the wrong shape and is withdrawn. Money is not
  sold; money is MADE.
- **BUILDINGS MAKE BATTERIES.** A player who sets up a power building on their land
  auto-mines batteries: the building sits on the map and pays into the purse on the
  production tick, one battery per day per building to start (everything costs one).
  More buildings, more batteries. A faction's territory does the same for the faction,
  which is what makes land worth fighting for. The list of power buildings, their
  yields and any cap are WORLD's to define and ECONOMY's to stress-test (a currency
  anyone can farm is the oldest way money dies; Q13).
- **GAMIFIED IS FINE.** "It's a fucking game." Realism first still holds for how the
  economy behaves; the fact that a battery is the coin is a chosen simplification and
  is never re-litigated.

## 5. RULED 9/6: HOW THE FIGHT BEGINS, AND THE CLOUD (Paolo, LOCKED)
He asked how the walked world becomes a fight now that a combat tile is a house, and
was given three shapes. HE PICKED THE PULL-BACK: "Yes definitely, and the map will
zoom out nicely, maybe a cloud opacity somewhere."
- **THE WALKED WORLD NEVER CHANGES SCALE.** The house-sized tile is the FIGHT BOARD
  only, on the COMBAT tab's dial. Walking stays person-scale, one small cell a step.
- **THE FIGHT IS ENTERED BY CAMERA, NOT BY SCREEN.** When a fight starts the view
  pulls back from person-scale to house-scale over the SAME ground, on the beat at
  120 BPM, and comes back in when it ends. No hard cut, no separate arena, no
  loading, no text.
- **THE CLOUD IS HIS AND IT IS THE POINT.** A soft opacity layer passes across the
  turn, so the change of scale reads as weather moving over the block rather than as
  a loading screen. Both directions, in and out.
- **IT IS THE SAME MOVE EVERYWHERE.** A street bump and a walk through a front door
  use one transition; only the board underneath differs (a STREET board where you
  stood, or THAT ROOM with its real walls as cover), which the code already decides
  with one field.

## ROUTING
- WORLD: BB-BATTERIES-ARE-THE-MONEY, top of the lane, folded into
  BB-THE-LETTER-IS-ONE's work (PRICES are in `electricity`, at 1).
- COMBAT: BB-A-TILE-IS-A-HOUSE, top of the lane, as the dial above.
- ALL LANES: the banner line "when you ship, re-cut the demo".
- Gate: the existing placeholder_number_gate holds the ones; combat's
  fight_moves_you_gate should assert the dial exists and both settings
  run. A law without a machine gate is not enforced.
