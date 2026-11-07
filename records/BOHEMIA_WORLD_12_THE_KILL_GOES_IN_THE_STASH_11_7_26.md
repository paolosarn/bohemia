# WORLD 12 (chat 02, the map): THE KILL GOES IN THE STASH, NO VULTURES, AND A CAP ON WHAT LIVES ON THE MAP (11/7/26)
VAMILY rule 426(e) (ask line 496) and rule 431(a)(b) (ask lines 510, 511). BUILD 11/7u. BUILT, NOT YET SEEN.
It replaces WORLD 11's carcass (BUILD 11/6s), which he voted NO, and takes every vulture off the map.
Next on this lane: rule 431(e)(f), ask lines 516 and 517: the teratorn, one more beast he fights, looking like a vulture.

## HIS WORDS
- His NO on WORLD 11's card (world-11-the-carcass-and-the-vultures-11-6, 11/6): 'Maybe you're not really making it like simplified bro
  you're adding information you're making some bullshit for some car shit like I just wanna easy. Quick interaction shit I don't know.
  Maybe they do end up in our storage I don't know. Like I just give you examples like I said something about like a shopping cart to
  pick up the bodies, but like that was an example and you just really ran with him, bro I don't know if I was the answer'.
- What he first asked for (rule 392, 11/4): 'their corpse has so much meat that could feed people... this could help you get some extra
  batteries'.
- Rule 431 (11/7): 'there's too many vultures on screen on the map. They don't even look like vultures... you didn't even put any sort
  of checker... this shit is nonstop... I thought they would be like an enemy type... you made it like this weird map virtue signaling
  shit'; his answer B (the vulture is an enemy) and then 'just another animal we can fight'.
- The coordinator (426(e)): ONE quick tap takes the kill into storage; no cart, no new screen; the cart was an example, never a spec.
  (431(a)): the map's vultures off the map now, every one; the one-tap carcass stays without them. (431(b)): a cap on every ambient thing
  on the map, held by a gate with a planted flood.

## WHAT HE DOES NOW (draft:true, his to change)
1. He wins a fight with beasts in it. The kill lies on the map on the block beside the fight: the animal's own fight picture on its
   side, a dark pool under it. NO plate, no words, no clock, NO BIRDS.
2. ONE TAP on the kill. Its MEAT goes in the company's FOOD (the can-and-bottle number on the top bar: two nights for every man, what
   the company eats before it turns), and its HIDE goes in the STASH as a roll of HIDES, ECONOMY's own trade good ('hides off the escaped
   lab beasts, rolled', Battle Brothers' Furs). The food and hides icons rise off the kill and fade; the kill is gone. The clock does not
   move. No card, no screen.
3. Walked off from it: the same one tap walks the crew back and the walk's end takes it.
4. Stash full: the meat still goes in the food; the hide stays on the kill; the map's one line says 'Your stash is full.'
5. The roll of hides sells at any stall or shop at that town's price (ECONOMY's rule 425(b): where it is made it is cheap, where it is
   not it pays more; the map marks where it sells best). Measured: the Church's armourer, 'Sell it +42 batteries'. The food is food:
   the night's food bill is that much smaller (a man's night is a battery there), and any stall buys food.
6. A kill nobody takes is gone after two game days, quietly. No clock is ever shown.
MEASURED on the phone: a crew of three, one American lion: food 21 -> 27, one roll of hides, batteries 290 -> 290, the clock 1800 -> 1800.

## NO VULTURES, AND THE CAP (rule 431(a)(b))
- Off the map, every one: nothing circles a kill, nothing follows a company that kills, no wing's shadow on the glass, no bird over a
  boss's yard (all WORLD 11's, deleted with the bird drawing from slices/bohemia_carcass.js), and the three birds that circled every lair
  (WORLD 7's world-state layer, bohemia_world_state_map.js birds(), deleted: a map sign of circling birds, which 431(f) drops).
- THE CAP: slices/bohemia_map_ambient.js (BohemiaAmbient) with records/target/bb/map_ambient.json (the mods law). Every thing that moves
  on the map on its own asks it before drawing: frame(kind), allow(kind, want), appear(kind) for things that come and go. A kind not in
  the table never shows. The table: vulture 0, lair_birds 0, camp_smoke 5 at once (the nearest the middle of the glass; a camp past the
  cap keeps its fire on the ground), mast_light 6 (the mast still stands), camp_embers 7 (his fire while he makes camp), kill_rise 2 at
  once and 20 a minute. Towns, parties, jobs and his crew are game objects with their own counts, not in the table.
- MEASURED over the whole valley on the phone (DUST42, three zooms, five places, day and night): camps on the glass up to 5, smoke drawn
  at most 5, mast lights 1. The flood: 303 camps and 61 masts on the glass -> 5 smoke columns and 6 lights drawn (894 and 165 refused);
  25 kills taken in a second -> 20 rises, 5 refused, 2 icons at once; his fire's embers 7. With the cap made to say yes to everything:
  303 smoke columns and 61 lights drawn (the leg goes red).
- A fix found on the way: the rise's clock started at the tap, so a slow phone that missed frames for 0.9 s never saw it; it now starts
  at its first drawn frame.

## STRIPPED (the old build, none of it asked for)
The shopping cart and its 1.5x slower walk (cityStepMins' pace hook deleted); the plate 'N KIND · KG · FRESH 6H'; the FRESH / TURNING /
GONE / bones clock; HAUL IT and its hours of knives; EAT IT; the butcher and the Mob's stew; TELL a town and its carts; LEAVE IT and the
den that seeded the next hunt (spawnPack's den lines deleted in bohemia_job_kinds.js); the clean-kill share; the feed posts; the men's
dead stains; every vulture. The old save key 'bohemia.carcass.v1' is removed on load.
NOT TOUCHED: WORLD 9's job 'FIND THE MEAT' (records/target/BOHEMIA_JOB_KINDS.json kind 'carcass', 11/5): a job he takes on a board, not
the kill's interaction; its own lines mention vultures and carts. Named for the coordinator under 431, not changed.

## THE FILES
- slices/bohemia_carcass.js (rewritten): fightHome (a won fight only: no kill on a retreat, a loss, a withdrawal or the pit), tick (two
  days), tap -> take (food via wagonGet/wagonPut and billPublish; the hide via ECONOMY's BohemiaStallPrices.tradeItem(file, 'hides')),
  arrived (a walk to a kill), draw (the animal and its pool, no words), the rise on its own thin layer (#killrise) under the cap.
- records/target/bb/carcass.json (rewritten): meat (kg_a_night 0.5, nights_a_man 2), hide (good 'hides', rolls_a_kill 1), keep_h 48,
  vultures.on_the_map false, the animals' real weights.
- slices/bohemia_map_ambient.js, records/target/bb/map_ambient.json (new): the cap.
- slices/bohemia_world_state_map.js: the lair birds deleted; the smoke and the masts' lights ask the cap.
- slices/BOHEMIA_CITY_WORLD.html: the cart's pace hook deleted; the embers in btwDraw ask the cap; two script tags (the cap, and
  ECONOMY's engine/bohemia_stall_prices.js so the map makes the same HIDES item the stalls do); the hooks' comments.
- slices/bohemia_job_kinds.js: the den line deleted.
- ECONOMY's own guards keep a trade good off every man (the crew screen's fits/slotOf, the shop's onMan); nothing of theirs edited.

## THE GATES
- THE KILL GOES IN THE STASH (gates/the_kill_goes_in_the_stash_gate.js --plant; the demo, phone held up, real touches): K0 a real
  beast fight through the one door leaves the kill beside it; K1 no words (every plate and painted word the kill's own draw adds: 0);
  K2 one tap: food +6, a roll of hides, no clock, no card, no screen; V1 no vultures, no lair birds, the rise on its own layer, the map
  not redrawn for it; K3 no cart; K4 three hyenas from three blocks off: the walk takes it; K5 a full stash; V3 gone at 49 game hours;
  V2 the cap at nought; V4 no card, no fight; K7 the crew screen puts a trade good on nobody; K6 the Church's armourer sells the roll
  (+42). PLANTED: words on the kill, a tap that leaves the stash empty, the cart's slow walk: each turns its leg red (3 of 3).
- WHAT LIVES ON THE MAP HAS A CAP (gates/the_map_lives_under_a_cap_gate.js --plant): A1 the table, A2 the drawers ask and no bird is
  drawn, A3 the whole valley on the phone, A4 the flood held, A5 the cap taken out turns A4 red.
- A PACK HE RAN FROM LETS HIM GO (gates/the_carcass_and_the_vultures_gate.js): the old file keeps only its pack legs (RUN SEVEN's
  413(c)), renamed in the suite. 9/0.
- ONE AT A TIME ON THE STAMPED BUILD 11/7u: THE KILL GOES IN THE STASH --plant 14/0 (3 of 3 plants); WHAT LIVES ON THE MAP HAS A CAP
  --plant 6/0; DEMO BUILD 25/0; PAGES PUBLISH 28/0; ATTEMPT 15/0; HANDOFF 10/0; A PACK HE RAN FROM LETS HIM GO 9/0; A DIFFERENT VALLEY
  EVERY GAME (the world-state layer's own gate; not in the suite list) 59/1: every landmark leg green (camps 5, lairs, lights, smoke 5,
  the night's lights 6); the one red is V5's state key on a typed new game, 'zgn0pa' against the node summary, and main's own files read
  the same 'zgn0pa' (measured, the four map files swapped in): not this change. VOTE TAB 62/4: the four reds are two old dynasty
  cards' whys and the alpha's landing on VOTE, the same four WORLD 11 measured on main's own files; this card is clean in it (F6 caught a
  stand-in carrying options first; they are off). Earlier in the round, on this change before ECONOMY's goods landed: LANGUAGE 107/0,
  THE CREW SCREEN READS THE STASH 23/0, ROSTER SCREEN 15/0; THE STALL BUYS AND SELLS 12/2 and EVERY JOB KIND 33/3 with the SAME legs
  red on main's own files swapped in (the stall's P1 under the phone; the escort's E4 to E6); INLINED FRESH 0/1 the same on main
  (engine/bohemia_followers.js's banner); DERIVED FRESHNESS could not make its scratch copy of the tree on this box (no verdict).

## OWED, ROUTED (nothing here waits on them)
- WORLD 12 NEXT (431(e)(f), asks 516 and 517): THE TERATORN, one more beast in the roster, met and fought like the others, no special
  systems, no map sign; it reads as a vulture at every size (the bald red head, the ruff, the long fingered wings) on the golden-piece
  recipe, or it does not ship.
- TUNING / ECONOMY: the food a kill gives (meat.nights_a_man 2) and the rolls a kill (hide.rolls_a_kill 1); the HIDES price is
  ECONOMY's own.
- PLUMBER: the map's red specks and yellow dots (427(d)) are painted texels, not moving things; if any of them ever moves, it goes in
  the cap's table.

[bb Battle Brothers: beasts leave pelts and teeth as trophies that go in the stash and sell; food is provisions in the company's
supply. Ours: the kill's hide is the trade good HIDES (Battle Brothers' Furs), its meat is the company's food, one tap.]
[analog horror: nothing circles; the dead animal just lies there in its own dark beside your men until you take it.]
