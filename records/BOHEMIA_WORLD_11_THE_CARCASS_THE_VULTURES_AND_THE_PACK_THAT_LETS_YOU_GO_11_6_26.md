# WORLD 11 (chat 02, the map): THE CARCASS, THE VULTURES, AND THE PACK THAT LETS YOU GO (11/6/26)
VAMILY rules 392, 386, 413(c)(f), 417(b); ask lines 427, 418, 465. BUILD 11/6s. BUILT, NOT YET SEEN.

## HIS WORDS
- 392 (11/4): 'I just killed some lions right in this quest and like their corpse has so much meat that could feed people... can we put it
  in a shopping cart and haul his ass back... all the games they just have them explode into beautiful bite-size meat pieces... this
  could really help you get some extra batteries... letting them know the location of the corpses for immediate retrieval and then you
  get extra batteries'.
- 386 (11/4): 'My sister said vultures don't forget it so turn up'.
- 413 (11/6): 'if I retreat and run away, I should be fully able to get away from a battle'. RUN SIX built it for crews and left beast
  packs untested (413(c)).

## WHAT HE CAN DO WITH A CARCASS NOW (draft:true, his to change; slices/bohemia_carcass.js, records/target/bb/carcass.json)
1. A FIGHT WITH BEASTS ENDS: what of theirs died lies on the map on the block beside where the fight was, one heap: the animal's own
   fight sheet laid flat on its side, darkened, a pool under it. Never pieces in the bag. The shell now sends home WHAT died and how
   cleanly (one marked line in nfOverIn: each body's kind, whether a beast, its wounds); men's dead leave a stain and the birds for a day.
2. ITS PLATE says what it is, the meat, and the clock: '1 AMERICAN LION · 135 KG · FRESH 6H', then TURNING, then GONE, then bones.
   Mojave hours: fresh 6 h, turning to 24 h, gone, bones at 48 h; a cool night runs the clock at half; meat in the cart at 0.6.
3. A TAP ON THE PLATE gives three plates under it (never a card):
   - HAUL IT · 3H (beside it): the knives take an hour a hundred kilos of animal (1 to 5 h), an hour a beat on the clock, and the world
     walks its hours (the camp's way: a crew can come; a walk or a card cuts it short with what was cut). The meat rides in the camp's
     shopping cart, 120 kg at most; the rest stays for the birds. The company walks slower with it: x1.5 full.
     The cart's plate over his crew ('CART · 120 KG AMERICAN LION · FRESH 5H') opens EAT IT: the company eats what it can before it
     turns, two nights of food for every man (a food a half kilo), the rest stays in the cart.
     ANY TOWN HE REACHES BUYS IT: the butcher (0.45 a kilo fresh, 0.15 turning), or the Mob's stew (0.35 fresh, 0.30 turning: it
     does not ask). Measured: 117 kg fresh at the Church, 53 batteries.
   - TELL <the nearest town> (from anywhere, even blocks off): their own hunters walk out with carts (12 min a block), bring it in,
     and he is paid when it comes in, by how fresh it was when they got there (0.18 a kilo fresh). Their carts are on the map, out and
     back, with a plate. Measured: a sabre-tooth, 99 kg, the Church's carts 0.8 h out, 18 batteries, no hours lost.
   - LEAVE IT: the birds and the coyotes have it; when it is bones (about two and a half game days with the nights) something hungry
     moves in: a den on that block (coyotes; hyenas past 200 kg of animal; wolves past 600), drawn with two animals on the bones, a feed
     post, and the next hunt from a town in reach starts its first pack at the den (bohemia_job_kinds.js spawnPack, one marked line).
4. A CLEAN KILL KEEPS MORE MEAT: every wound the animal took spoils 12 in 100 of its meat, never under half. An American lion clean
   135 kg, with three wounds 86 kg.
5. EARLY GAME IT IS REAL MONEY: one American lion to the butcher is 54 batteries, a two-skull job's pay (job_pay.json); a mountain lion
   13; three coyotes 8. A new crew starts with about 290.

THE REAL FLOOR (in the data file, every number sourced): live weights (American lion 300 kg, sabre-tooth 220, mountain lion 65, short-
faced bear 750, Shasta ground sloth of Gypsum Cave 250, Camelops 800, Bison antiquus 900, Ice Age horse 450, dire wolf 65, cave hyena
95, coyote 14, feral hog 90, bull 700); 45 in 100 of live weight is meat (a field-dressed deer gives about 40); a man eats half a kilo
of meat a day; food left out above 32 C is unsafe after an hour (USDA); a supermarket cart is built for 100 to 150 kg. Battle
Brothers: its beasts leave trophies for the taxidermist and nobody hauls the meat; ours adds the meat because this valley is starving.

## THE VULTURES (rule 386; their picture is a STAND-IN, marked as one, rule 408(c))
- They circle over the dead: a carcass (one at first, more every hour and a half, up to seven; they land when it turns, three at most),
  a fight's dead men (a stain and the birds for a game day), a boss's yard (three, over a found boss still standing and over his sign,
  rule 243's way).
- They follow a company that leaves bodies behind: a bird over his marker for every four killed in two game days, five at most; two
  quiet days and they are gone. While they follow him, now and then a wing's shadow slides across the whole glass.
- They never attack the living: no card, no fight, measured.
- When he comes to the dead, the circling birds lift higher and one stays on the heap and does not fly, its red head turned to him.
- Size is real: a turkey vulture's wings (1.7 m) are drawn about as wide as the map's man is tall. The picture is a few pixels: a
  shallow V, black wings with the silver trailing edge, a red head (data: vultures.stand_in true; the VOTE card is stage stand_in).
- THEY TURN ON THEIR OWN LAYER. MEASURED first: turning them by redrawing the map cost 33 ms a redraw on the gate's box, eight a second,
  for as long as one bird was on the glass (the map draws only on events). Now the circling birds are drawn on a thin canvas over the map
  (#vulturesky, no touches), placed through the map's own transform (the street's turn and the zoom honoured), at the glass's plain points
  (390 x 781, 1.22 MB on a phone held up; the glass itself is 1170 x 2343, which would have been 11 MB against RUN's 8 MB map budget):
  181 sky frames in 3 s at under 0.1 ms each, and the map redrew 0 times in those 3 s for them.

## RULE 413(c): A PACK HE RAN FROM LETS HIM GO
- MEASURED BEFORE (PACK_LETS_GO.on false, the gate's P4): RUN SIX's hold made a pack he fell back from stop SMELLING him (shy 1e9), but
  it still wandered every second step, and a wander that ended beside him opened its fight from its own step: walking past it held (the
  meet card's hold), but standing or camped beside it the card came back (standing still beside them reads as aimed in meetBackHolds):
  8 cards in 12 steps.
- NOW (bohemia_job_kinds.js __A_PACK_HE_RAN_FROM_LETS_HIM_GO__): the pack never steps to within two blocks of him; when he walks up near
  it, it gives ground, a block a step; it never starts a fight from its own step. Only his own chase (a tap on it) or a walk aimed at it
  meets it again, and that asks: one marked line in meetBackHolds (BOHEMIA_CITY_WORLD.html) makes his chase count as aimed wherever the
  pack stepped (measured: his chase on a pack that stepped a block reached it and was HELD, no card; now the card asks).

## THE GATE: THE CARCASS AND THE VULTURES (gates/the_carcass_and_the_vultures_gate.js, the demo, phone held up)
23 passed, 0 failed: C0 a beast fight through the one door (cityHandOver, the fight page, the shell's own nfOverIn, the spoils, home):
1 American lion, 135 kg, on the block beside the fight; C1 clean 135 against torn 86; C2 drawn with its plate and a bird; C3 FRESH ->
TURNING (6 game h) -> GONE (30 game h, its own clock 24 with the nights), 1 -> 5 circling, 3 landed; C4 a real tap on the plate and
on HAUL IT: 180 game minutes of knives, 120 kg in the cart, 15 left, a block takes x1.5; C5 EAT IT: 6 food for 3 men, the cart 120 ->
117; C6 the Church's butcher paid 53; C7 TELL from 8 blocks: the Church's carts drawn, paid 18 on the purse's own line; C8 LEAVE IT: a
den of hyenas on its block, Blues' next hunt starts its first pack there; V1 men's dead (4 circling); V2 from five blocks 4 circling,
beside it 3 circling and 1 still on it; V3 nine dead: 2 over him, thirty: 5, two quiet days: 0; V4 no card, no fight; V5 the layer
(above); P1 the pack he fell back from is shy for good; P3 four walks past it at his speed, no card; P5 his chase on it: the meet card
asks; P2 camped two blocks off 69 game hours: no card, never within two; P2b 1500 world steps standing two off: no card; P2c he stands
beside it: it gives ground 2 3 4 ... 6, no card; P2d its wander ends beside him twelve times: no card; P4 THE BEFORE: 8 cards in 12; R
nothing threw.

## OTHER GATES ON THIS CHANGE (each alone)
A TOWN IS ALWAYS A DOOR 7/0; CONTACT STOPS HIM DEAD 18/0; DEMO BUILD 25/0; ATTEMPT 15/0; LANGUAGE 107/0; PAGES PUBLISH 28/0.
EVERY JOB KIND 36/1 then the escort alone 10/0: E5 went red once on this tree when AUTO LOST the caravan's fight (the reload did not put
the second cart back); main's files WON that fight (10/0), so the lost branch was not exercised there; nothing in this change touches the
save or the cargo; worth one look by RUN (the save at the bell). A RETREAT GETS HIM AWAY 13/1 and THE SAME ON MAIN'S FILES 13/1 (mid-fight
R5: the crew held the field 23 game hours, not about 12; RUN SIX's record saw '23 game hours once'; RUN SEVEN's rule 413(h)-(k) is on it).
THE VOTE TAB 62/4, THE SAME 62/4 ON MAIN'S FILES (two dynasty whys, three legs of the alpha landing on VOTE); this card is clean in it
(kind animation, art_kind beast, stage stand_in, two sentences). RED ON MAIN, NOT MINE (main's files swapped in, the same reds): BUILD SIZE 14/7 (the demo 3.78 MB raw against 3.74, the alpha, the fight's block, the
reachable-from-nothing line; PLUMBER's), INLINED FRESH 0/1 (its resync tool does not run here). DERIVED FRESHNESS could not make its
scratch copy of the tree on this box (no verdict).

## OWED, ROUTED (nothing here waits on them)
- ECONOMY: the butcher's, the stew's and the finder's prices (pay.*); whether a town's hunger moves them; the Mob's stew towns list
  (pay.stew_towns names 'Mob', the Mob's own town on the map; the gate sold at the nearest town, the Church, so the stew's price is
  in the code and the data but not yet measured on a walk into Mob).
- TUNING: the rot clock, the cart's slowness, the dress hours, the share a wound spoils.
- CAMP: the dressing as the men's own act on the camp's board (rule 406(g)'s 'the carcass haul's own act'; today the hours pass on the
  map with a plate); the cart as one of the camp's pieces.
- UI (the phone): TELL from the phone's own screen (today the plate on the map, the post in the feed); a phone card for the cart.
- ANIMATION: the men butchering, the cart pushed. SOUNDS: wings landing on a roof, the knives, the cart's wheel. BEASTS / DIRECTION:
  the golden vulture (the stand-in is three-pixel steps); the carcass on its side is the beast's own sheet pressed flat (a lying frame
  would be better).
- WORLD next: a hunt job that asks for the meat up front (more pay if the meat comes home, rule 392 (3b)); a carcass that a crew or a
  pack comes to (rule 392 (2): 'coyotes come to it, so a carcass left too long draws a fight').

[bb Battle Brothers: a beast hunt pays by contract and the beasts leave trophies for the taxidermist; nobody hauls the meat, and a
party you retreat from is one you choose to meet again or not.]
[analog horror: the birds were there before you were; one does not move when you come, and its shadow was on the glass first.]
