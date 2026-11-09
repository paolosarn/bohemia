# BOSSES, 11/8/26: THE FIRST BOSS CHANGES THE MAP, END TO END (rule 437(a); ask lines 167, 346, 522)

PAOLO 10/26 (rule 243): "think about Valheim's map and how Battle Brothers' map is, let's do the best of both worlds... there are
supposed to be bosses in this game where you're able to alter the map and what's going on in the world around you, that's gonna be
super important." Rule 437(a), 11/8: the first boss end to end, found on the map by a sign, fought, his verb handed over, and killing
him CHANGES THE MAP and the world around him, for real (the ground his people held, the roads they closed, the feed), kept after a
reload. Never the map's generation (WORLD 13's), never the fight's boards (COMBAT TWO's).

THE FIRST BOSS is THE POT (the ladder, records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md row 1: holds the last sound cookware; besting him
grants COOK; "the FIRST boss, played absurdly straight").

## MEASURED FIRST (origin/main a0182e99, the demo on an upright phone, the fog on, real taps)

The six-boss walk (gates/bosses_act_one_gate.js) cut to THE POT: 17 passed, 2 failed.
- The sign, the asker, the flyer read out, the fight, the kill's beat, the pot flying into the phone, COOK used: all there.
- RED, A2 and A2b: at his place THE FIGHT OPENED WITH NO CARD. RUN's door shows the meet card (his face, his title, his tip, ENGAGE or
  FALL BACK) only for what his WALKING meets (MEET.walk > 0), and WORLD TWO's tick starts a boss's fight between steps. So the stranger
  never saw who held the place before the fight and could never fall back. Battle Brothers always shows you who holds a place first.
- WHAT HIS DEATH CHANGED: his row (records/target/bb/boss_map.json) says lights 3 and THE KITCHEN. One picture (his kitchen, before and
  after) and a lights row. His crew held no street, closed no road, owned nothing anybody could lose, and the map worked the same
  after him as before: the route anywhere was the same route. One post on the feed (the radio). "The change is real" was not true.

## WHAT CHANGED

1. HIS GROUND (slices/bohemia_bosses.js section (8), data records/target/bb/boss_act_one.json THE POT 'ground', a modder's row).
   The moment WORLD TWO stands him somewhere (his sign in the world), his crew holds the ring of streets 3 blocks out from his door:
   every street block on that ring with a street on its inside (a way IN) is shut by his line cooks' CHECKPOINT, all but his FRONT
   (the ring blocks on the map's own route from where the sign is). Worked out once off the game's seed and his place, kept in the
   game's state. Never a shut that cuts the player off: from where he stands his door and every town he could reach must still be
   reachable, or the shut is pared back. A street that only runs PAST his ground stays open (measured: the first cut shut a whole
   seven-block street along the east side that blocked nothing; now only ways in).
   THE WALK REFUSES A SHUT STREET through the map's own walk: cityWalkable is wrapped in this file the way WORLD 7's shut roads
   already wrap it (slices/bohemia_world_state_map.js), so the party's route, the tap, the hunters and every road the map works out
   go round his ground. The bench (fog off, every other lane's checker) gets none of it.
2. THE PICTURE (rule 337, assets with the content): tools/bohemia_bosses_the_pots_ground_11_8_26.py paints THE CHECKPOINT in the map's
   own look, the first three places' way (the district factory's parts, COOK's rig render through the master rig, bpy 4.2): shopping
   carts chained across the street, his kitchen's speed rack on its side, a burned sedan, pallets, a burn barrel burning on the beat,
   a kitchen towel on a pole with his red band for a flag, two of his line cooks in whites. AFTER: the carts shoved nose to tail at
   the kerb, the car still there (nobody tows anything in this valley), the towel down in the road, the barrel cold, nobody. A street
   along x and a street along y, before and after, two beat frames: slices/boss_places/checkpoint_{x,y}_{before,after}_{0,1}.png.
   One street block across, no ground of its own (the map's street shows through). Measured: the rig sizes a scene off its ground
   plate; with none it read 0.3 units, made the carts 300 m tall and put the camera inside them (a black blob); the scene now carries
   an unpainted plate the size of THE KITCHEN's pad, so it gets the kitchen's metres, dents, grime and light.
   Drawn on each shut block (dark through the static if his place is known and the block unseen), under his place.
3. WHEN HE FALLS (the same file, on WORLD TWO's 'bohemia:boss-fell'; WORLD TWO's fallen flag is the truth if they ever disagree):
   - the camera goes to his place (BOSSES FIX's beat) and his checkpoints roll from shut to shoved on the same tape as his kitchen;
   - his crew is gone: every checkpoint opens, the walk goes through, the way across his ground is shorter;
   - HIS TILL PAYS (Battle Brothers pays a big fight with what the place held): +30 batteries through the purse's own ledger
     ('boss-till:THE POT', once, kept with the game, never paid twice by a reload);
   - TÍA CARMEN's card says it under his pot, one line with its numbers: "HIS LINE COOKS RAN. 5 STREETS OPEN ON THE MAP. HIS TILL:
     +30 BATTERIES.";
   - the feed posts it: @strip_eats ("The carts are off the streets on the Colorful side. His line cooks ran with their aprons on. 5
     streets open, walk through, nobody stops you.") beside the radio's kitchen post, and your company's ("His till was under the
     stove: +30 batteries.").
   - Kept after a reload: his state is the bosses' save (bohemia.bosses.v1) beside WORLD TWO's map save; the reopened game rebuilds
     the walk from it, draws the kerb and the kitchen after, and does not pay again.
4. HIS CARD FIRST AGAIN (slices/bohemia_his_map.js, one marked line in WORLD TWO's startFight): the fight at his place goes through
   RUN's own meetWalk, so the door treats it as what his walk met and the meet card shows (his face, title, tip, ENGAGE, FALL BACK).
5. THE FLYER SAYS IT: RAUL now reads "...His line cooks shut the streets round it with carts, only his front is open. I marked it."

## THE GATE: THE FIRST BOSS CHANGES THE MAP (gates/the_first_boss_changes_the_map_gate.js, registered)

18 passed, 0 failed on an upright phone (390 x 844, the demo, the fog, real taps), the second run (run 1 was 15/2: the map's walk
answers 1 for a street, the gate asked for true; fixed in the gate, not the game). The run, in his order:
- F1 THE POT's flyer at 57,45, his place 63,36, his rumour on the feed. G1 before he falls: 4 of 5 ways in shut, the walk refuses each,
  a way across his ground (59,36 to 67,36) goes 18 blocks round against 8 straight, his front 63,39 open, 14 of 14 towns reachable.
- F2 TÍA CARMEN asks; RAUL reads the flyer, the shut streets in it; marked. G2 4 checkpoints painted closed on exactly the 4 blocks the
  walk refuses. B0 his card first: his face (boss_pot_0), KEEPER OF THE LAST GOOD POT, KILL HIM FIRST: HIS COOKS BREAK, FALL BACK and
  ENGAGE. B1 his fight, the man himself, won by AUTO.
- B2 the beat glide > hold > wipe > show with 4 checkpoints on the tape; her card: the valley's line, HIS POT, and "HIS LINE COOKS RAN.
  4 STREETS OPEN ON THE MAP. HIS TILL: +30 BATTERIES."
- C1 every shut street walks; across his ground 18 blocks then, 8 now (8 straight); the kerb pictures on the glass, none closed; the
  till once in the purse's ledger (+30, 290 to 322 with the fight's own pay); @strip_eats and @valleyradio on the feed.
- R1 the same phone opens the game again (CONTINUE): still down, COOK still his, all 4 streets still walk, 1 till entry, the kitchen
  after and 4 kerb pictures drawn.
- PLANTS, each red under its own check: P1 one checkpoint shut again after the fall (the walk false on all 4), P2 a ground that shut
  nothing, P3 the strip's post off the feed, P4 a phone that forgot the save (not fallen, no COOK, a new ground of 10 shut).
- C0 nothing threw.
Phone pictures (the stranger's seconds, webp): records/target/the_first_boss_changes_the_map/ (0 she asks, 1 the flyer read out, 2 his
checkpoints on the way in, 3 his place and his card, 4 his fight, 5 she says what changed, 6 the map after, 7 opened again).
THE VOTE card's picture is the kill's own camera beat: records/target/bosses_the_pots_ground_11_8/ (before: the carts shut the streets
round THE KITCHEN, black smoke, the tape tracking in; after: the kitchen lit, the junk at the kerb; her card), made by
tools/bohemia_bosses_the_pots_ground_vote_11_8_26.js.

ALSO RUN (rule 13: the gates that read what this diff touched):
- THE FIRST THREE BOSSES (all six), gates/bosses_act_one_gate.js: 108 passed, 1 failed. THE POT 18 of 18 (it was 17/2 on main a0182e99:
  A2 and A2b, the missing card, are green now). THE ONE RED IS C1 'nothing threw': TypeError in drawImage at chipBlit
  (slices/BOHEMIA_FIGHT.html:8954) < blitMan (8861), inside the fight, a file this round did not touch; named for COMBAT. AUTO lost to
  THE FILTER, THE BURN, THE SURVEYOR and THE CLIMB (the checker ended those fights and said so); named for COMBAT and TUNING.
- HIS MAP (WORLD TWO's, phone), gates/his_map_gate.js: 21 passed, 0 failed (its boss leg through the restored card: it opens with
  engage).
- Full suite unmeasured since this sha (rule 13); the demo re-cut (tools/bohemia_cut_the_demo.js), the stamp BUILD 11/9b.

## [bb] BATTLE BROTHERS FIRST: HOW A BIG FIGHT IS FOUND AND PAID

- FOUND: a location is seen when it is in the party's sight and stays revealed once found; a legendary location is unique, mostly one
  time, some a hard fight for a named item (reference/library/battle_brothers/01_WORLDMAP.md "LEGENDARY LOCATIONS"; the Grok page
  reference/library/grok/GROK_ASK_122_SIXTY_MINI_BOSSES_2026_10_25.md, unverified, the wiki copy agrees; about a dozen a campaign).
  Ours: the flyer is the sign (Valheim's runestone, his half); reading it marks his place for good; his checkpoints are seen from
  the road like any location.
- WHO HOLDS IT: you see the defenders before you choose to fight (the location's tooltip); a location's men hold the land round it
  and a location sends parties because it holds (the home bases file's note on dev blog #66: a camp buys its parties out of what it
  has and is weaker until they return). Ours: his card first (restored), his line cooks hold the streets round him until he falls.
- PAID: the fight pays with what the place held plus the named thing. Ours: HIS POT (the named thing, the verb COOK) and HIS TILL
  (30 batteries, TUNING's number).
- One finding that proves us wrong: in Battle Brothers a destroyed location is simply gone from the map; nothing reopens, because the
  map has no roads a camp can close. Our streets are the map's walk, so a crew that holds a place can close its streets, and its fall
  can open them; that is our own way, not theirs.

## ANALOG HORROR (rule 9 of the law)

Ordinary things made into a wall: shopping carts nobody pushes, a kitchen towel for a flag, two men in cook's whites at a burning
barrel in the middle of the road, day and night. After, the street is a street again with the junk at the kerb, which is how a real
road reopens; nothing is cleaned.

## NOTES (agreed in handoffs/BOSSES.md; nobody else's file was edited except the one marked line in WORLD TWO's)

- WORLD 13 (the map's generation): untouched. The ground reads the map only through cityWalkable, cityRoute, om.at and townDoor at
  run time; a new street layout gives a new ring on its own. If the generator ever wants to know where a boss's crew holds the
  streets: window.BohemiaBosses.ground(n) and BohemiaBosses.shutAt(x, y).
- COMBAT TWO (the fight's boards): untouched. Seam offered: a fight cut from a block next to a shut checkpoint could stand his
  carts on the board's street edge (BohemiaBosses.shutAt(x, y) says which blocks; the pictures are slices/boss_places/checkpoint_*).
  Not needed for anything shipped: nobody stands on a shut block.
- WORLD TWO: one marked line (meetWalk round cityHandOver in startFight, __THE_BOSSES__).
- TUNING: radius 3, till 30 (records/target/bb/boss_act_one.json THE POT ground).
- HOME BASE: his till lands in the purse; rule 343's 'the boss's prize lives in your settlement' is that lane's (his pot already is
  the kitchen there).
- FEED: the strip's post is pushed like every other (BOHEMIA_FEED.push); the feed itself is a moment (14 posts in memory), so the
  post is not on the phone after a reload; the change it reports is.

## WEAK, SAID OUT LOUD

- The checkpoints are small at the map's far stop (one street block each); close, they read as junk across the road.
- Only THE POT has 'ground'. The other five take a row each (a crew word, a radius, a till, the words); the code does not name a boss.
- The sign is still placed a few blocks from where he stands (WORLD TWO's), so his ground appears near you; that is the Valheim
  runestone's way, not a fixed map.
- His crew does not walk the map as a party; their ground is the shut streets and the two men drawn at each checkpoint.
