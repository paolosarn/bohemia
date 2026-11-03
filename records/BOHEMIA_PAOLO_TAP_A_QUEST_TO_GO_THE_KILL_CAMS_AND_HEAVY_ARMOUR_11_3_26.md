# TAP A QUEST TO GO THERE, THE KILL CAMS, AND HEAVY ARMOUR COSTS A TILE (Paolo 11/3; VAMILY rules 376 and 377; ask lines 404 to 406)

## HIS WORDS (verbatim, transcription kept)
"A couple more things before I sleep tonight but long story short I should be able to click the quest on my phone and my people auto
move towards it... maybe like Auto zooms in as much as I can too just so it looks cooler as you walk through the city... when you get
to quest you hop on the settlement... if... multiple markers... like I have to hunt down animals... it will just take me to the closest
one... zoom as much as I can so... I get more detailed view of the city"
"Also, I asked you about the kill cam shit you never there, bro I want that too"
"if you're wearing the heaviest [armour]... maybe it's gonna be like -2 [AP]... you can only walk one time less please check the code
in the Numbers... please make sure that this does not make it impossible to do any sort of attack or abilities. If you didn't move that
turn... you get one less tile... there's weights... categories and genres of armor... maybe like an endgame light armor is better than
most of the heavy armor"

## RULE 376. TAP A QUEST, YOUR PEOPLE GO
1. A quest on the phone is a button. Tap it and the party sets off on the map toward it, the Battle Brothers way (tap to travel, the
   clock runs, roads faster than dirt, the road's events still happen).
2. MANY MARKERS, THE CLOSEST: a quest with several places (hunt the animals, find three caches) takes you to the one nearest by travel
   time on the map's roads, not by a straight line. The next tap goes to the next closest.
3. THE CAMERA COMES IN CLOSE: while the party travels, the map eases in to its closest zoom that still follows the marker (the close end
   of the Pocket City 2 zoom range, rule 9/30), so the city goes by in full detail. A pinch or a tap takes the camera back at once
   (nothing is forced, the second votes). On arrival it stays where it is.
4. ON ARRIVAL THE SETTLEMENT OPENS: a quest at a place opens that place's settlement screen (places are settlement screens, the third
   votes). A quest out in the open (a beast in the desert) is the encounter itself when you reach it.
5. GATE: tap a quest on the phone in the demo: the party marker moves, the zoom is at its closest while it travels, a quest with many
   markers picks the nearest by travel time, the settlement screen opens on arrival, a pinch mid-trip takes control back.
6. LANES: WORLD 8 builds the travel, the nearest marker and the camera as one call on the map; UI 7 makes the phone's quest card the
   button that calls it. Neither edits the other's file.
7. [bb] Battle Brothers: you click a contract's destination and the company walks there on its own, the clock running; tracked
   contracts show their target on the map. Ours adds the close camera and the phone as the button.

## THE KILL CAMS (rule 351(f), ask lines 364 and 365): SHIPPED THIS ROUND
- COMBAT 7 shipped them at 5d1d0766 (BUILD 11/3zzzzac THE KILL CAMS ARE BACK), minutes before he asked again: the first combat
  module's styles (sharp, hammer, follow, orbit, x-ray, held breath, chain, last stand) on today's fight, on the beat, only on a kill
  that earns it, a tap skips, no frame lost (16.7 ms a frame with the cams vs 18.9 without). The camera never moves: the punch-in is a
  camcorder zoom. Gate: THE KILL CAMS, 7 legs. VOTE card: combat-7-the-kill-cams-11-3.
- His "you never did it" was true for a long stretch: the ask sat at item 4 of COMBAT 7's list behind the retreat and the smarts.

## RULE 377. HEAVY ARMOUR COSTS A TILE OF WALKING, NEVER A SWING
1. THE NUMBERS TODAY (records/target/bb/rules.json, read by slices/BOHEMIA_FIGHT.html): every man has 9 AP a turn; a flat tile costs 2
   AP to cross, rough 3; a one-handed strike costs 4, a two-handed 6; rally 5; the recover perk 9. No armour weighs anything in the
   fight right now: armor.json carries no weight for body armour (its fatigue field is empty), and armor_tiers.json sorts the rows
   into four tiers (padded, leather, mail, plate) by durability only.
2. THE RULE: armour has a WEIGHT CLASS (light, medium, heavy, heaviest; the body piece and the helmet add up). The heaviest class costs
   2 AP OF MOVEMENT: on flat ground a man walks one tile less (3 instead of 4). Heavy costs a little (TUNING's number, under a tile).
   Light and medium cost nothing to walk.
3. NEVER A SWING: the cost comes off what he can spend on WALKING, never off what he can spend on attacks and abilities. A man who does
   not move still has all 9 AP for strikes, shots, rallies and perks; nothing he owns becomes impossible from a standing start (the
   recover perk at 9 still works). Walk then strike still fits: 2 + 4 under the cap.
4. WEIGHT IS NOT QUALITY: the weight class and the quality tier are two different ladders. An endgame light armour (rare, costly, a
   champion's drop) protects better than most heavy armour and costs no tile. Heavy is cheap protection that slows you; light at the
   top is the prize.
5. IT SHOWS: the shop and the crew card name the weight class and say "one less tile"; on the board the lit walking reach is one tile
   shorter. The player sees it before he buys.
6. GATE: a man in the heaviest class who has not moved can do every attack and ability he has; his lit reach on flat is one tile
   shorter than the same man in light; at least one endgame light piece out-protects most heavy pieces; every armour row has a class.
7. LANES: TUNING 2 puts the classes, the walking costs and the endgame light pieces in the one numbers table (ours.json) and runs them
   through its closeness sim (rule 370); COMBAT 7 reads them in the fight (the walking cap, the lit reach, the shop and crew labels).
8. [bb] Battle Brothers: armour has a weight that costs maximum fatigue (and initiative); heavy plate tires a man so he acts less over a
   fight, while famed and named light pieces can out-protect common heavy ones. Ours puts the cost on walking, one clear tile.
