# COOK [every 2D asset into 3D] + [the floor, not final]: ROUND TWO (10/22 and 10/23/26)

Rule 123 (Paolo 10/20, LOCKED: 'all that energy has to be spent towards just revamping all the 2-D assets into these
3-D sprites... analog horror Crashbox vibes, go crazy'); 121(j)(k)(l); rule 127 (10/23: no votes needed, spend on what he
loves, the 3D Crashbox look and the conversions first). No card, no sheet, no picture made for him. Every family goes
straight into the game file it replaces (same file, same size, same anchor). The count is
`records/target/cook_3d_inventory.json`, recomputed from the game files' hashes after every family by
`tools/bohemia_cook_3d_inventory_count_10_20_26.py`; its `log` is the round's history line by line.

Round one's record: `records/BOHEMIA_COOK_EVERY_2D_ASSET_INTO_3D_ROUND_ONE_10_20_26.md`. The 10/22 round (the
town blocks' tool, the futures tool, the odd blocks' tool, ten icons, corner.0 and lots.0) wrote no record and no
handoff block; this one carries it.

## THE COUNT

193 at the start of this round. THE MAP (69 of 69), THE SETTLEMENT BACKDROPS (14 of 14), THE COVER (51 of 51), THE ICONS
(18 of 18) and THE LIGHTS (4 of 4) are all 3D. What is left is the fight floor's present-day blocks (rendering, one
every 7 to 20 minutes) and their 70 futures. The live number is the inventory's `total_flat`.

## WHAT WENT IN, FAMILY BY FAMILY

### The item icons (18 of 18)

The market and the crew screen's `slices/market_icons/`. 10/22 made ten through the rig (two tins, the rounds on a clip,
the jug, the med case, the anvil, the armourer's bench, the machete, the cleaver, the pipe, the pistol) and held the
eight long weapons: as thin sticks at 96 px they read worse than the old pack tiles, and its fix (fatten the whole
object across its length, up to 2.2x) made every one a log: the spear, the pole and the flail came out the same brown
cylinder.

This round they are built as ICONS, the way every inventory draws a long thing: a TURNED haft (a lathe profile: the knob,
the grip's swell, the taper) at about 1.5x its girth, a HEAD at 1.5 to 1.7x its real size, a bright ground edge on a dark
body, and a silhouette that says what it is. The axe: a wedge head flaring from the eye to a bearded bit. The sledge:
chrome striking faces on a dark head. The spear: a leaf of spring steel lashed to a pipe with wire, a rag tied under
it. The polearm: a glaive cut from a mower blade, two bolts, a rebar hook behind. The flail: a club handle, a chain of
oval links off its head, a spiked iron ball. The Molotov: a turned brown bottle, its label, tape at the neck, a rag
stuffed in and hanging down the shoulder, its tip burnt black. The guns keep COOK's own models at 1.6x girth (the old
global fatten is kept for the guns only). Tool: `tools/bohemia_cook_the_icons_through_the_rig_10_20_26.py` (LONG,
`lathe`, `loft`, `link`).

### The fight's cover (51 of 51)

rubble_11, found never committed on 10/22, went in. Then ALL TWELVE rubble heaps were redone: looking at them on the
fight's own ground colour, every heap HOVERED over its own shadow with daylight under it (its lumps were stacked to a
0.85 m top over nothing). A wall's fall is mostly fines and broken block: now a mound of fines (a flattened, knocked-about
sphere, its underside cut at grade, because the master rig seats a model on its lowest point) with the lumps through it
from the ground to a 1 m top. Tool: `tools/bohemia_cook_the_cover_through_the_rig_10_20_26.py` (build_rubble).

### The map's district pictures (69 of 69)

The factory's own scenes (`tools/bohemia_cook_the_map_capture_10_20_26.py`, 69 captured, every crop fit 0.996 or
better) rendered through the rig (`tools/bohemia_cook_the_map_through_the_rig_10_20_26.py`), into the bank, through the
wire's 256 px map copies and the chunker. What the looking and the gates caught on the way:

- THE ROAD STAYS ASPHALT: at the ground's 0.3 wear the rig's sun-bleached dust on every flat top turned the strip's dark
  road the plate's pale grey (his map roads, rule 77b). A dark flat paving at grade takes a quarter of the dust.
- THE WATER STAYS WATER: the water district's lake had gone a dusty blue-grey. A flat cool surface at grade takes the
  road's share (the school, the cemetery, the water works, the water park, the wash, the resort, the dam, the fort, the
  water district, the gypsum works, the reservoir, the pump station rendered again).
- THE BANK WOULD NOT FIT: fifteen truecolour masters took the district bank from 28.5 MB to 56.9 MB (GitHub warns at 50
  and refuses a file at 100; all 69 would have been about 162 MB). The master now goes into the bank as an indexed PNG
  (`tools/bohemia_cook_master_to_palette.py`), the bank is 40.3 MB with all 69, and the map copies differ from the
  truecolour by about 1 of 255.
- THE HUE GATE WENT RED on the first indexed batch (eight icons monochrome, the best down from 9 hue families to 6): an
  octree palette spends its entries on the grey-brown bulk and merges every rare coloured pixel (a yellow door, a red
  cross, a teal pool) into the browns. The palette now gives each hue family present its own entries, and only the
  coloured pixels look for their nearest entry again; the pull toward his colours is 0.15 for a district picture (a
  landmark keeps its hue), not the props' 0.35. The set's median went from 3 hue families to 4; the school holds 9.
- THE SQUARE ICONS GATE (padding, floating): alpha cut at half left the edge's faint row clear; any ink is now ink.
- THE ICON GATE COULD NOT READ AN INDEXED PNG (its reader knew RGB and RGBA only): taught colour type 3 through PLTE and
  tRNS, the test unchanged.
- The medical campus nests one material inside another in the factory: unwrapped.
- The plates move from the factory's warm ochre toward the fight floor's own dirt (the desert's pad 126,101,60 ->
  about 150,133,110; the fight's ground median about 161,150,128): the map and the fight are the same ground. RUN
  answered the same hour (0352200): the painted far map now wears the 3D palette so the zoom's hand-over is one city.

Real surface, measured: the demo opened on the driver's phone profile shows the map with the rig's districts (the
mountain, the grid of blocks), no page error.

### The settlement backdrops (14 of 14)

`tools/bohemia_cook_the_settlements_through_the_rig_10_20_26.py`: the two towns, the home block, the two camps and the
two fortresses, day and night, each a scene in metres on the fight's camera, every hotspot's building or thing seated in
its own box (checked by drawing the hotspot boxes over each render: the pawn shop in the barber's box, the chapel in the
clinic's, the stall, the hitching rail, the board, the hall's porch, the lot's wreck). Two fixes after the first look:
THE NIGHT read as a grey dusk (the moon at 0.16 of the sun, the sky at 0.3): his old nights are near black with warm pools
under the lamps, so the moon is 0.045 and blue, the sky 0.08, the lamps 1,600 W and the fires 900 W. THE FORTRESS'S
PALISADE stood at 46.6 m, 1.4 m from the picture's far edge, so only its foot showed: at 43.6 m its whole height reads
across the top the way the old picture's stakes did. `COOK_NIGHT_ONLY=1` renders a night over a day already made.

### The fight floor

(the blocks as they land; see the log)

### THE FINDING THAT CHANGED THE FLOOR: THE OPEN BLOCKS HAD NEVER BEEN REBUILT

scrub.1 came back from the not-final tool BYTE-IDENTICAL to the old block. The floor tool's plan carries `keep`: per
pixel, whether the shipped picture still equals COMBAT TWO's maker, so a pixel a later round painted is never
overwritten. COOK TWO's 10/19 recolour of the desert (his 'camouflage' NO) moved every desert pixel off the maker's
orange, so on the open blocks keep is almost nothing (scrub.1 2.6%, scrub.0 3%, wash.0 2.5%, freeway.0 5.6%, lots.0
15%), and the compose laid the render on that sliver and the OLD FLAT PICTURE everywhere else. lots.0, swapped on 10/22
and counted 3D, measured 87% its old pixels. The house and town blocks were never hit: their compose replaces everything
but the plan's not-ground.

The fix (`tools/bohemia_cook_the_floor_not_final_10_20_26.py`, OPEN_KINDS, open_plan, open_things): on the open kinds
(scrub, wash, scrubroad, freeway, freewayo, lots) nothing was painted over the maker but the recolour, so the plan's
grounds are the truth and every pixel is the render. What the maker drew that is not ground becomes a THING: each
cluster of its green shrub dots a creosote bush (a dusty olive crown of many small leaf lumps on splayed stems, the
cluster's footprint, its own shadow), each run of its fence wire on the desert kinds a ranch fence (posts every 2.4 m,
three strands, a span cut and gone here and there); the freeway's patches and the wash's bank line are the nearest
ground. lots.0, scrub.1 and scrub.2 are rendered again.

### THE LANDFILL'S CELLS ARE FULL

The odd blocks' first cut (10/22) made each old piece one thing and read as a few boxes on a swept lot; the maker's
black discs came out pebble-sized. A working cell of the Apex landfill is a field of split bags, cardboard and scrap in a
crust of dirt: the discs are now TYRES (a real torus, flat or stacked two and three), and the cells' rough ground is
filled with bags, boxes and scrap at about one a square metre, a fridge on its back, a mattress, a pallet. The odd tool
takes `--region` (a test window) and a future state.

### The futures

(as they land)

## FOR THE OTHER LANES

- FOR RUN TWO / PLUMBER: `gates/market_pack_art_gate.js` leg 'every market icon is his pack tile byte for byte' (RUN
  TWO's 10/11 gate) is red since 10/22's icons; rule 121(l) and 123 are newer. The leg could read the converter's ledger
  (`records/target/cook_icons_rig/swapped.json`) the way the inventory count does. Running that gate rewrites two VOTE
  pictures (`slices/vote/RUN2_THE_MARKET_IN_THE_PACKS_*`): never commit them by accident.
- FOR PLUMBER: the map's hero chunk (`slices/BOHEMIA_CITY_TILES_02.js`) is 5.05 MB with all 69 rig pictures (2.74 MB
  before; the grain costs bytes in the wire's 256 px PNGs), past the chunker's 4 MB target and under the 6 to 8 MB cache
  wall. The chunker also moves UI's two script tags out of its region in the world page and rewrites RUN's comment in the
  alpha's warm-up list: this lane keeps only HERO_FROM from each wire run and leaves both files' other lines as they were.
- FOR PLUMBER: `gates/icon_gate.js` now reads indexed PNGs (colour type 3); the test is unchanged.
- FOR COMBAT: the fight's ground, cover and settlement pictures changed under you, same names, sizes and feet.
- FOR RUN: the district bank and the map copies changed; HERO_ANCH and HERO_PLATE are the same numbers.

## THE LOG

(the inventory's own log)
