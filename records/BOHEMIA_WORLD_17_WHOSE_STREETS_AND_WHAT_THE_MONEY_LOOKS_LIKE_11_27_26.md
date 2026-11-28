# WHOSE STREETS, AND WHAT THE MONEY LOOKS LIKE (WORLD 17, 11/27/26)

VAMILY rule 485(a) (Paolo 11/26: 'Lets go cyberpunk vibes but their world has a running economy vibes!'): every district reads who
lives there and why without a word (the money it has or lost, whose streets they are), the dead Strip beside the blocks that still have
power, each gang's streets carrying its look (COLOUR IS TERRITORY). Rule 485(b), ECONOMY FOUR's call
(records/BOHEMIA_ECONOMY_FOUR_A_PLACE_EARNS_OR_GOES_DARK_11_27_26.md s5): a broke town and a well-off one can LOOK it. Rule 495: built in
the owning module, the cause fixed where it lives, the page's patch count down, not up. WORLD 15's handoff (handoffs/WORLD_FOURTEEN.md,
HANDOFF READY 26f19abd4): the next districts, ECONOMY FOUR's calls, out of WORLD 16's roads and caravan.

BUILD 11/27zzg - WHOSE STREETS, WHAT THE MONEY LOOKS LIKE. VOTE world17-whose-streets-and-what-the-money-looks-like-11-27 (tile, STAND-IN).

## 1. MEASURED FIRST (the demo, its default valley)

- THE PAINTER NEVER SAW A POWERED BUILDING. The grid's wires (engine/bohemia_powergrid.js) run only down the roads: of 9,216 blocks,
  420 read `live`, every one an arterial (291), the freeway (127) or the Strip's boulevard (2). The painter asked `live` of each block it
  paints, so: (a) WORLD 15's dead Strip by day (11/27p) dulled EVERY casino and tower in the valley, there was no lit one to stand
  beside; (b) at night not one tower, casino or house window was lit: only the street lamps.
- WHOSE WIRE: of the 420 lit road blocks, 136 name a faction on the wire itself (a faction's own circuit, or the Network's grid);
  the rest are 'a neighbourhood's own lights'. ECONOMY FOUR's book counts every lit wire as the faction's whose ground it runs under
  (placeWires, BohemiaTowns.holderOf): that faction keeps it lit, collects there, and loses it when it cannot feed its men. One answer
  is taken here: the wire's own faction first, else, on a lit or lost wire, its ground's (418 road blocks named, 12 factions).
- THE TOWNS: the book's verdicts after ten map days on this valley: broke Reds, Trades, Volunteers; well off Church, Homeless, Mob,
  Network, Remnants; the rest getting by. Before this build the painting read none of it.

## 2. RESEARCH (cited)

- CYBERPUNK 2077 (rule 485: its world's construction and its running economy, nothing else): Night City's districts are read by their
  gangs' colour and light before a word is said: each gang's turf carries its own palette on the street, its neon and its signs (the
  design team's own description of the districts as 'territories' of the gangs, CD PROJEKT RED's world-building talks, 2020). We take
  the reading, not the content: no icons, no billboards (rule 464), no ads.
- REAL STREETS: gang colour is how a group projects presence without a word and is read at a distance (COLOUR IS TERRITORY, 8/26, its
  own research); tags mark the foot of the walls on held blocks; in a blackout economy the lit blocks are the ones somebody pays to keep
  lit (Lebanon's generator blocks sold power by the amp, Human Rights Watch 2023; ECONOMY FOUR s2).
- BATTLE BROTHERS: a town looks as rich as it is, and its stock follows its resources ('a really wealthy town will have top tier equip';
  the developers' posts, reference/library/grok/wiki PAGES_ALL bb_all/0626_Developer Posts.txt). Ours shows it on the roofs.
- THE ONE FINDING THAT PROVED US WRONG: the obvious build, tag the blocks on a faction's wire, changed ZERO pixels (measured: 20 marked
  blocks in an 8 x 8 box, 0 texels different) because every wire is a road. The marks have to reach the buildings that face the street,
  and so does the power, which is section 1's bug.

## 3. BUILT (one module, engine/bohemia_district_look.js; the painter calls it)

- grids(pal, n, cellAt, streetAt, deadAt): one pass over the valley. A building has power when a street it faces (a road or the Strip's
  boulevard; never the freeway, its lamps are its own) carries a live wire; a burned shell or a frame the money left never takes power
  (WORLD 15's 'never powered'); a street keeps its own lamps as before. A building is its street's: the mark of the lit street it faces,
  else of any marked street it faces. Measured: 842 blocks have power against 420 before; 0 buildings with power away from a lit street.
- palette(names, colourOf): the map's own faction colours (mapFactionColour, MAP_ART.fac banners, his wardrobe's answer), each the tag;
  a drab faction (saturation under 0.22: Cartel, Homeless, Mob, Volunteers) has no light of its own, its drabness is its statement.
- vbDistrictDay (runs in the painter's worker as source; self-contained): (1) the dead Strip by day, moved pixel for pixel (4,000 of
  4,000 texels the same); (2) the gang's tags in dashes along the foot of the walls facing its street (two storeys of paint at most,
  sprayed, a few texels of wall through), and its colour faded on 12% of its roofs (the way every town already wears its own); never on a
  burned block, a frame or a town's box; (3) a BROKE town: boarded windows (weathered plywood, never a warm colour), holes and tin sheets
  in its roofs, the colour gone out of its tarps, its walls grimed; a WELL-OFF town: panels going up on half its roofs (the rebuilt
  blocks' own panels), its walls kept; getting by: exactly as before. vbDistrictLit: a town's tall floors lit at night 0.12 / 0.3 / 0.55.
- At night, where a gang's street has power, its neon and its casino floors glow in its own hue (70% of its neon; a drab gang's stay the
  street's light).
- THE PAGE (slices/BOHEMIA_CITY_WORLD.html, no patch block and no hook line added; the hook count went DOWN 1792 -> 1791 because WORLD
  15's marked dead-Strip lines left the page): the module's script tag; the worker's source takes BohemiaDistrictLook.WORKER; vbCityCore
  calls DLD once; vbCityInput and vbBoxInput cut live and turf from the same valley grids (VB_DL), so a tile and the whole painting agree;
  vbTownsInput hands each home base its verdict (vbTownWealth -> placeWealth, ECONOMY FOUR's), and the town key carries it only when it
  is not 'getting by', so every painting that was right stays the same key.
- COST: the valley's 5-second input 7 to 11 ms; the painter 28,182 ms against 28,248 for the same tiles (THE MAP'S LIGHTS gate, E4).

## 4. THE GATE

gates/whose_streets_gate.js (WHOSE STREETS, in the suite): S1 to S7 static (the palette, whose street, the grids with a planted old
reading and a planted frame, the dead Strip pixel for pixel, the tags, the money, the page wiring); P1 to P4 on the demo upright (the
real grids, the painting's key and pixels and night lights, the towns reading the book, the input cheap, nothing threw). 13/0.
THE MONEY WALKED AWAY D3 re-aimed to the module (where the dead Strip now lives): 15/0. THE MAP'S LIGHTS READ AS LIGHTS 9/0. THE PATCH
LAYERS ONLY GO DOWN 10/0 (tightened). DEMO BUILD 25/0. PAGES PUBLISH 30/0. A PLACE EARNS OR GOES DARK (data) 8/0. EVERY TOWN LOOKS ITS
OWN 7/1, the same red on main's page ('THE HEART LOOKS LIKE THE CITY', the town plans' heights; not this build). INLINED FRESH 2/1, the
same on main (PLUMBER 9's drift line).

## 5. THE PICTURES

tools/bohemia_world17_whose_streets_card_11_27_26.js: the demo on his phone upright, valley VEGAS7, the camera still between BEFORE
(main's way) and AFTER: the Network's street by day and at night (block 54 px), then ten map days of the book and the nearest broke town
beside a well-off one (the Volunteers beside the Network, block 72 px). Sheet records/target/WORLD17_WHOSE_STREETS_11_27.webp, first
picture records/target/vote_first/world17-whose-streets-and-what-the-money-looks-like-11-27.webp. The broke look is plain on a walled
town's boxes and quieter on a camp (low tents and shacks, little roof to show it on): named, the next pass.

## 6. ROUTED

- WORLD 16 (the map's people, not this lane's): 'what they wear and do' on a gang's street is the map's walkers; the turf grid is
  VB_DL.turf (a faction's palette index a block) for them to read, one module, no second answer.
- ECONOMY FOUR: the wire's faction and its ground's can differ (the Network's grid runs under other factions' ground); this build takes the
  wire's own first; the book charges the ground's. One of the two is the truth for 'whose street'; theirs to say, both read one rule here.
- DIRECTION: the tags are a first cut at a texel band; the golden pass when its turn comes (a sprayed tag reads at 54 px, not at the far
  stop, where the roofs' colour carries it).
- COLOUR IS TERRITORY (his): Cartel and Mob are the same charcoal on the map (#434042, #454142), so their streets read the same; Caravans,
  Anarchists and Trades share the brown hue 30. The machine does not fix taste; named.
- NEXT ON THIS LANE (482): the broke camp reads plainer (its tents' cloth faded and torn, its yard's junk); a place GROWING by more than
  its roofs (a lot that fills in when a well-off place keeps it a month: Battle Brothers' 'a party that founds a new location', on the
  plan the town already has); the gang colour on the street's own curb at the far stop.

[bb Battle Brothers' towns look as rich as they are; ours show it on the roofs, and whose they are on the walls.]
[analog horror: by day the paint at the foot of the walls tells you whose block you are on; at night their colour is the only light left
on the street.]
