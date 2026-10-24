# COOK [the map remade, in colour] (10/24/26)

Rule 137 (Paolo 10/24, LOCKED: 'the map still looks like shit, so we have to remake all the map assets, and let's be
careful having everything look like a grey yellow sand color, I don't want that to flood all of our art'); rule 128
(every asset carries three acts: the scene kept, an era a re-render); rules 123 and 127 (no card, straight into the game);
rule 142 (the same hour: one map at every zoom; COOK's remade pictures are what it shows). Opened by the coordinator,
rule 112; Opus 5.5 at Extra; pushed to main every swap.

## 1. THE MEASURE FIRST

`tools/bohemia_cook_map_colour_spread_10_24_26.js <label>`: the demo on the driver's phone (the one driver), the map's
own canvas at six stops of the pinch (the far stop, the whole valley, the district zoom, where he opens, one step in,
the near stop where a block's art is one pixel to one pixel), each pixel put in a CIELAB family. THE SAND FAMILY,
written so a lane can argue with it: L* 30 to 86, chroma 5 to 40, hue 45 to 105 degrees (tan, beige, khaki, ochre-grey).
The bar (137b): a third or less at every stop. Results: `records/target/cook_map_colour/<label>/spread.json` + the shots.

BEFORE (`before/spread.json`):

| stop | czoom | sand | neutral | dark | green | blue | red |
|---|---|---|---|---|---|---|---|
| far / whole valley | 0.214 | 78.8% | 1.0% | 18.5% | 0.5% | 0.7% | 0.1% |
| district | 0.5 | 66.0% | 4.5% | 26.8% | 1.1% | 0.9% | 0.1% |
| opening | 1 | 46.0% | 10.3% | 39.8% | 2.1% | 1.2% | 0.3% |
| step | 2.6 | 42.7% | 14.9% | 40.7% | 0.4% | 0.3% | 0.1% |
| near | 4.74 | 39.7% | 14.9% | 42.9% | 0.3% | 0.0% | 0.1% |

WHAT READS WORST, in order of pixels on his glass:
1. THE FAR LAND past the city (79% of the far stop): code, not a picture (`VB_COL`; thirteen of its fourteen colours are
   sand). One tan desert, brown-tan ranges, no red rock, no black basalt, Lake Mead a sliver.
2. THE PAINTED FAR CITY (the opening zoom and out, below a block of 26 to 30 px): code (`VB_CCOL`), painted 10/23 from the
   tan palette of COOK's 10/23 pictures (yards #8c7b63, roofs #bba98e and #aa997f: all sand).
3. THE DISTRICT PICTURES (from the step in, and everywhere rule 142 makes the map one): the suburb (28% of the valley's
   cells) a field of tan yards under tan roofs over tan walls; the mountain rim (10%) the same brown-tan as the desert;
   the desert one ochre plate. The factory's scenes are the walkable engine's palettes, warm greys and tans; the rig laid
   a beige dust (0.66, 0.60, 0.50 linear) on every flat top; the snap pulled 15% toward his packs, which are mostly tan.

BESIDE THE REFERENCES: Battle Brothers' map (his 9/24 reference for the overworld) lets value do the work and one marker
be the saturated thing, but its ground is green plains, darker forest, grey hills, white snow and blue water, with the
steppe's tan only in the south: a colour per terrain. Pocket City 2 (9/30, the pinch) reads at every zoom because its lots
carry colour (green yards, blue pools, coloured roofs). The real valley from the air: terracotta tile roofs, a pool in
every third yard, gravel yards in red and grey, golf courses, red Calico Hills, black basalt, Lake Mead's bathtub ring.
Ours was one tan at every zoom.

## 2. THE REMAKE: EVERY DISTRICT PICTURE THROUGH THE RIG, IN COLOUR

`tools/bohemia_cook_the_map_in_colour_10_24_26.py` (render / finish / bank / sand). The SAME GEOMETRY: the district
factory's scenes, captured face by face (`tools/bohemia_cook_the_map_capture_10_20_26.py`) and now KEPT
(`records/target/cook_map_colour/scenes.pkl.gz`, 0.7 MB, rule 128), rendered through the master rig with the 10/20 map
tool's build, camera and render (imported, never edited). THE DIALS are data a modder edits and an era re-renders:
`banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json` (the palette, eleven themes, the district -> theme map, the dust, the snap).
What changes:

1. Every face in the sand family takes its colour from its district's THEME. A building (the faces above the plate whose
   footprints touch: a house, its gable, its garage) gets ONE stucco and ONE roof, so the cul-de-sac is a cream house
   with terracotta tile beside a sage one with charcoal shingle beside a blue one with slate; the shaded sides keep the
   factory's value against the lit ones. The ground is a soft field of close colours in metres (lawns gone wild, weeds,
   grey and red gravel; concrete and asphalt patches; caliche and varnish), LINEAR between them and pulled a third toward
   its own mean so it never reads as the camouflage he killed on the casino carpet. The rock is banded by height: black
   basalt and desert varnish at the foot, red rock through the middle, limestone on top. Water is Lake Mead blue. A face
   that was not sand (the asphalt, the glass, the barn's red, the freeway's green sign) keeps its colour, 25% more
   saturated so the rig's old-paint rule leaves it a colour.
2. What lies on the free ground is ADDED to the scene where nothing stands: pools in the yards (most blue, one gone to
   algae, one drained), palms and olive trees (a wide crown with a narrow one on it), creosote and rocks on the desert.
3. The rig's dust is concrete grey on the map (0.50, 0.50, 0.49), and the snap toward his packs is 0.06 and none at all on
   a pixel with chroma past 18. The grime, the film, the dents and the one sun are the rig's, untouched (137b).
4. SAME ANCHOR: the capture's crop is fitted against the old picture's own alpha (`ref_alpha/`), IoU 0.995 to 1.0, so
   every new picture lays on the old one's pixels: same file, same size, same anchor.

Into the game: the bank (`banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt`, indexed by hue family), the wire's 256 px
map copies, the chunker; then `tools/bohemia_cook_map_colour_keep_hero_from_10_24_26.py` puts the world page back to
HEAD but for its HERO_FROM line and the alpha back to HEAD (the chunker moves UI's two script tags and rewrites RUN's
warm-up comment; the 10/23 record).

## 3. WHAT WENT IN (the ledger: `records/target/cook_map_colour/ledger.json`, each picture's sand share after)

(filled family by family below; the log is the commits)

## 4. AFTER

(the measure again at the end of the round)

## 5. FOR THE OTHER LANES

- FOR RUN: `records/BOHEMIA_COOK_NOTE_FOR_RUN_THE_MAP_IN_COLOUR_10_24_26.md` and the row [the far land in colour] in your
  section: the far land and the painted far city are the flood at the far and opening zooms, and they are code. Every
  proposed colour is checked against the measure.
- FOR PLUMBER: the measure could be the gate 137(b) asks for ('every art lane checks a new picture's colour spread before
  it ships'); the per-picture check is `sand_share` in the colour tool.
- FOR DIRECTION: the rig's DUST constant is a beige on every flat top; on the map it is swapped for a grey by this tool's
  wrapper after the source pass (the rig file is untouched). If the beige wash is to go from ALL art (137b says for ALL
  art from now), the rig's own constant is yours.
