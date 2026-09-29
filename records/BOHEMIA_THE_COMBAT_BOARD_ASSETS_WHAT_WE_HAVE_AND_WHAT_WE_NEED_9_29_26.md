# THE COMBAT BOARD: WHAT WE HAVE, WHAT WE NEED, TERRAIN BY TERRAIN (coordinator 9/29/26; Paolo: 'think about all the assets you're gonna need for the combat board... no single combat map is exactly the same... different terrains, nature zones, tile blockers')
# Counts of what we HAVE are from the board's STATE lines and the banks folder (174 bank files, 49 district kits
# registered, 71 dossiers, the 7/28 street bank, the recooked car, the fortress buildings, COOK's map markers and
# land cut, 65 sounds); COOK [board assets] counts them exactly. The NEED column is the manager's first list.

## 1. HOW BATTLE BROTHERS BUILDS A BATTLE MAP (the model)
The world tile's terrain picks a tileset (plains, steppe, forest, swamp, hills, mountains, snow, desert, beach); a
settlement or camp fight adds its buildings; blockers (trees, rocks, tents, fences, walls, carts) are scattered
with rules (forests dense, plains open, hills stepped); elevation is a height map (hills and mountains give the
high-ground bonus); weather and night change the light and sight range; a seed makes each map unique. Roughly a
dozen terrain sets, three or four blocker kinds each, three heights, day/night/rain/snow.

## 2. OUR TERRAINS (the valley's, real; each is a KIND the map cell carries and the board is cut from)
 T1 THE SUBURB BLOCK (houses, yards, streets, sidewalks, cars, walls, sheds)          HAVE: the 7/28 street bank, the
    house tiles, the car from above, 49 district kits. NEED: roof tiles as standable high ground (37g), burnt and
    collapsed variants, fences and gates as blockers.
 T2 THE STRIP (casino fronts, the boulevard, fountains, signs, the Sphere, the tower)  HAVE: fortress buildings, the
    seven landmarks (partly), signs. NEED: the boulevard's width as two tiles of road, marquee blockers, a fountain
    tile, planters, the porte-cochere as cover.
 T3 INDUSTRIAL / WAREHOUSE (loading docks, containers, fences, yards)               HAVE: some district kits.
    NEED: container stacks (blockers, climbable), dock edges, tank farms, a rail siding.
 T4 OPEN DESERT (creosote flats, washes, a dirt road, Joshua trees, rocks)             HAVE: 'sand is dirt', the
    desert pools bank. NEED: the whole set: creosote clumps (blockers), Joshua trees, boulders, a wash (a
    low tile), a dune (the mound), a dead sign, a wreck.
 T5 THE WASH AND THE SHORE (the Las Vegas Wash, Lake Mead's edge, tamarisk thicket, mud)  HAVE: water tiles
    (LIFE+CITY's honest water). NEED: the tamarisk thicket (a blocker that spawns), mud (a slow tile? NO: the mound
    is the only terrain effect; mud is a look), a boat wreck, the shore's water tile where the hippo lives.
 T6 THE HILLS AND MOUNTAINS (Frenchman, the Spring Mountains, Red Rock: stepped rock, scrub, a road cut)   HAVE:
    the map's mountains (COOK's land cut). NEED: rock steps as mounds (the accuracy bonus, several heights read as
    one rule), scrub blockers, a cave mouth, a pylon.
 T7 THE FREEWAY (the I-15 and the 215: overpass, on-ramp, jammed cars, barriers)   HAVE: cars, the freeway on the
    map. NEED: the overpass as high ground, jersey barriers as cover, a jackknifed truck, an exit sign.
 T8 THE PARKING LOT AND THE BIG BOX (Walmart-scale lots: open with car islands, cart corrals, a loading side)
    HAVE: lots in the kits. NEED: cart corrals and light poles as blockers, the big box's roof as high ground.
 T9 THE TRAILER PARK (tight, many blockers, propane tanks, fences)                  HAVE: little. NEED: trailer
    tiles (a trailer is a tile), propane tanks, chain-link, a laundry line.
T10 THE GOLF COURSE AND THE PARK (open grass, water hazards, sand traps, palms)      HAVE: pools bank. NEED: grass
    tile (dead and reclaimed), a pond tile, sand trap (a look), palms as blockers, a clubhouse.
T11 THE RUIN (a burnt block, a collapsed tower, rubble)                              HAVE: grime pass (held), slab
    tiles. NEED: rubble heaps as mounds, a collapsed floor (a blocker), scorched variants of T1's tiles.
T12 THE AIRPORT (apron, hangars, a dead plane)                                       HAVE: a district kit. NEED:
    the plane as a multi-tile blocker, fuel trucks, the terminal's roof.
T13 THE CASINO FLOOR (indoor; the indoor fight exists)                               HAVE: the indoor fight, room
    tilesets. NEED: slot banks as cover blockers, the pit, the cage, escalators as a mound.
T14 THE SOLAR FARM AND THE PUMPS (panel rows, the switchgear fence, the pump house)  HAVE: pumps, the switchgear
    district. NEED: panel rows as long blockers (cover in lines), the inverter shed, the fence.
T15 THE LANDFILL AND THE SCRAP YARD (mounds everywhere, car stacks, the hog's home)  HAVE: little. NEED: trash
    mounds (the accuracy rule), car stacks, a crusher.

## 3. THE KINDS EVERY TERRAIN NEEDS (the board's grammar; each kind is a data row, MODS' line)
FLOOR (the walkable ground look: 3 to 5 per terrain) | BLOCKER (a tile you cannot enter: 3 to 6 per terrain,
some destructible) | COVER (a tile that is half a blocker, cars, barriers, counters) | MOUND / ROOF (the one
terrain effect, high ground, 1 to 3 per terrain) | EDGE (what the board's border looks like: a road, water, a
fence, a cliff) | DRESSING (the small things that sell the place with no rule: signs, bones, trash, tracks) |
LIGHT (day, night, dusk; the sodium lamp, the fire) | WEATHER (dust, rain, the monsoon flood, heat shimmer;
looks only). Fifteen terrains x eight kinds is the inventory sheet COOK fills with HAVE / NEED counts.

## 4. THE COUNT, HONEST (CORRECTED BY HIM THE SAME HOUR, records/BOHEMIA_PAOLO_MOSTLY_CITY_A_BLOCK_WAR_PISTOL_IS_A_DAGGER_9_29_26.md: 'most of it will be city-based terrain... every combat fight damn near like a block war'; the order below is REVERSED: CITY GAPS FIRST, the nature terrains after, because nature is the valley's edge and the beasts' ground, a minority of fights)
We have the CITY half well (T1, T2 partly, T8, T13, T14 partly) and the NATURE half almost not at all (T4, T5,
T6, T9, T11, T15). Battle Brothers is mostly nature; our valley is mostly desert and ruin around a city, so the
nature half looked like the bigger cook. BUT HE RULED MOST FIGHTS ARE BLOCK WARS, so the FIRST cook is the CITY'S GAPS: T1's roofs as high ground, burnt and collapsed variants, fences and gates; T7's barriers and the overpass; T8's cart corrals and the big-box roof; T9's trailers and tanks; T11's rubble mounds; T3's containers; THEN T4 OPEN DESERT, T5 THE SHORE, T6 THE HILLS, T15 THE LANDFILL for the beasts.
Every cook goes through DIRECTION's card and the reference check (compare to the real Mojave, real freeways,
real landfills), and every tile is house-sized (rule 38h).

## 5. THE GENERATOR (COMBAT [board generator] with WORLD's kits)
Input: the map cell (its terrain kind, its district kit if any, the time, the weather, a seed). Output: a board
cut from the district's own layout where there is one (rule 38h: it still reads as that block), or built from the
terrain's floor/blocker/mound rules where there is not; the edge from the neighbouring cells; the beasts' and the
enemies' spawn rules per terrain (hyenas at the landfill, the hippo at T5, the lion at T10's water). Never the
same twice; always readable as the place he tapped on the map.
