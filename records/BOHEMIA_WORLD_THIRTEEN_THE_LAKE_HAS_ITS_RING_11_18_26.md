# WORLD THIRTEEN, ROUND SEVEN, BUILD TWO: THE LAKE HAS ITS RING (11/18/26)

VAMILY rule 453 (round after round: 'every zone itself'; the 11/17 list: 'the works by the rail, the trailer parks by the freeways,
the Strip, the lake shore, the open desert'); rule 429(g); ask 508. BUILD 11/18s - THE LAKE HAS ITS RING. VOTE
world13-the-lake-has-its-ring-11-18 (stand_in).

## 1. MEASURED FIRST (the demo on a phone, the near and street stops)

The lake was flat blue water to a straight block edge, then the desert's pebbles at once: no shore, no bed, nothing that says this is
a lake after the money died. THE REAL LAKE MEAD after the drought: the BATHTUB RING (the white band of minerals the water left on the
canyon rock, a hundred and more feet of it, the valley's most photographed sign of the dry years), the cracked mud flats where the
water went back, the boats left on them and the launch ramps ending in sand.

## 2. THE BUILD (slices/BOHEMIA_CITY_WORLD.html, `__THE_LAKE_HAS_ITS_RING__`, every zoom: the whole painting and every tile)

- VB_SHORE (one table, carried into the painters): bed 0.34, wet 0.05, ring 0.17, wander 0.11 (in block units from the water's old
  edge), crack 0.8 (a twelfth of a block; never under three texels), hull 0.22 (one lake block in that many has a hull on its bed).
- Each lake block knows which of its eight neighbours is the other side of the shore (open ground, the rock; never the dam), and each
  sand or rock block which neighbours are lake. In a lake block, inside 'bed' of that edge (the edge wandering by a noise): the dried
  BED in a paler mud, its CRACKS a hairline cell pattern (a Worley cell, the cell's own crack where its two nearest points are close),
  a HULL run aground along the shore in some, standing a little; then the dark new WATERLINE; then the water. On the sand or rock
  beside it, inside 'ring': the BATHTUB RING, a pale mineral band.
- Five colours in the painter's palette, apart by value (never by hue): mud 133, crack 87, waterline 76 against the water 73; the
  ring 192 against the ground 118 and the pebble 145 (luma).
- The painter counts it (VBC.stand.shore, a tile's stand.shore) as it counts the Strip.

## 3. NUMBERS (the demo valley)

- The whole painting: 81 lake blocks, 47 on the shore; the bed 8,180 texels, cracks 35 in 100 of it, the waterline 1,415, the ring
  3,944, hulls 37; a lake block's middle stays water (28 of 752 middles a bed).
- A close tile on the shore (60 texels a block): 12 shore blocks of 22, the bed 11,048, cracks 27 in 100, the ring 6,822, hulls 102.
- MEASURED AND FIXED IN THE BUILD: the cracks at 1.6 read as paving stones at the near stop (0.8 now); at the whole painting's 24
  texels a block they were 59 in 100 of the bed (the cell under two texels), so the cell never goes under three.

## 4. GATES

- NEW gates/the_lake_has_its_ring_gate.js 8/0: L1 the table and the palette, L2 the whole painting's shore and L2b a close tile's,
  on the demo upright and on the alpha on its side, L3 planted (the shore off: no bed, no ring), L4 nothing threw. In the suite.
- Neighbours green on this tree: the far end is painted 11/0, the map's lights read as lights 9/0, the map stands up 13/0, the Strip
  reads as the Strip 5/0, the houses stand up close 28/0, the generated world holds 8/0, the valley has its zones 9/0, the near end is
  the block 7/0.

## 5. PICTURES (the VOTE card, the phone upright)

Left: the near stop on the lake's south shore with the shore off (the old lake). Right: the same spot now: the cracked bed, the dark
waterline, the white ring on the sand.

## 6. NEXT, MINE

The trailer parks by the freeways (their own look: skirting, awnings, the dirt lanes between the rows); the 15 place boards' layouts
painted onto the map at their cells; the fight on a lake-shore cell handed the bed (FIGHT_OPTS.ground.shore).

[bb] Battle Brothers' map shows a coast by its shallows and its sand; ours shows the lake by what the water left.
[analog horror] the ring is a line the whole valley can read, how high the water stood the last year anyone kept a boat.
