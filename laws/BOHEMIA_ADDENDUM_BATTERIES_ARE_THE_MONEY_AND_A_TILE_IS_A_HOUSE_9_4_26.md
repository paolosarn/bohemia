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

## ROUTING
- WORLD: BB-BATTERIES-ARE-THE-MONEY, top of the lane, folded into
  BB-THE-LETTER-IS-ONE's work (PRICES are in `electricity`, at 1).
- COMBAT: BB-A-TILE-IS-A-HOUSE, top of the lane, as the dial above.
- ALL LANES: the banner line "when you ship, re-cut the demo".
- Gate: the existing placeholder_number_gate holds the ones; combat's
  fight_moves_you_gate should assert the dial exists and both settings
  run. A law without a machine gate is not enforced.
