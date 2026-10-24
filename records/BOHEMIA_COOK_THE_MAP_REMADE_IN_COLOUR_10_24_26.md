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

ALL 69 IN (pushed in nine swaps, the last aea0a744). Per picture: theme, faces recoloured, faces added (pools, trees, bushes), the picture's own sand / green / blue / red share after, and the registration to the old picture's pixels (IoU):

| district | theme | recoloured | added | sand | green | blue | red | IoU |
|---|---|---|---|---|---|---|---|---|
| apartment | house | 555 | 33 | 26% | 0% | 0% | 1% | 1.0 |
| arsenal | industry | 409 | 54 | 0% | 1% | 1% | 13% | 1.0 |
| arterial | road | 70 | 0 | 0% | 0% | 0% | 0% | 1.0 |
| arterial_x | road | 20 | 0 | 0% | 0% | 0% | 3% | 1.0 |
| ballpark | green | 4174 | 243 | 10% | 25% | 0% | 3% | 0.9958 |
| basin | water | 205 | 81 | 3% | 6% | 0% | 10% | 0.9895 |
| battery | block | 178 | 81 | 1% | 6% | 7% | 6% | 0.995 |
| boneyard | glitz | 330 | 168 | 14% | 16% | 2% | 8% | 1.0 |
| campus | green | 879 | 243 | 12% | 11% | 0% | 6% | 0.9973 |
| casino | glitz | 461 | 168 | 32% | 6% | 12% | 10% | 1.0 |
| cemetery | green | 566 | 135 | 10% | 55% | 0% | 8% | 0.9788 |
| chapel | glitz | 420 | 168 | 9% | 9% | 7% | 0% | 1.0 |
| cityhall | block | 458 | 81 | 4% | 6% | 1% | 17% | 0.9989 |
| commercial | block | 257 | 81 | 6% | 3% | 0% | 18% | 1.0 |
| convention | block | 496 | 81 | 2% | 3% | 1% | 0% | 1.0 |
| courthouse | block | 586 | 81 | 1% | 4% | 1% | 1% | 1.0 |
| dam | water | 417 | 81 | 3% | 0% | 1% | 12% | 1.0 |
| datafort | block | 44 | 81 | 0% | 1% | 4% | 1% | 0.9964 |
| desert | desert | 386 | 176 | 39% | 14% | 0% | 18% | 0.9993 |
| downtown | block | 171 | 0 | 0% | 1% | 0% | 4% | 1.0 |
| drivein | block | 150 | 81 | 12% | 6% | 0% | 2% | 0.9998 |
| farm | field | 92 | 0 | 9% | 45% | 0% | 30% | 1.0 |
| firestation | block | 157 | 81 | 5% | 4% | 0% | 21% | 1.0 |
| fort | industry | 413 | 54 | 1% | 2% | 1% | 22% | 1.0 |
| freeway | road | 66 | 0 | 0% | 1% | 0% | 8% | 1.0 |
| fueldepot | industry | 427 | 54 | 0% | 3% | 10% | 5% | 1.0 |
| golf | green | 275 | 243 | 11% | 62% | 0% | 0% | 0.9926 |
| granary | field | 446 | 0 | 2% | 28% | 0% | 36% | 1.0 |
| gypsum | gypsum | 431 | 110 | 8% | 0% | 3% | 0% | 1.0 |
| industrial | industry | 89 | 54 | 7% | 1% | 0% | 1% | 1.0 |
| intake | water | 220 | 81 | 2% | 0% | 14% | 7% | 1.0 |
| interchange | road | 240 | 108 | 14% | 2% | 0% | 9% | 0.9965 |
| jail | block | 412 | 81 | 2% | 30% | 0% | 5% | 1.0 |
| landfill | dump | 85 | 88 | 18% | 3% | 0% | 30% | 1.0 |
| library | block | 474 | 81 | 1% | 4% | 1% | 1% | 0.9977 |
| mall | block | 47 | 81 | 0% | 11% | 6% | 3% | 1.0 |
| medical | block | 279 | 0 | 0% | 0% | 0% | 0% | 1.0 |
| minigp | glitz | 176 | 168 | 24% | 8% | 2% | 15% | 1.0 |
| mountain | rock | 258 | 110 | 1% | 1% | 0% | 43% | 1.0 |
| park | park | 200 | 243 | 1% | 60% | 0% | 0% | 0.9858 |
| policestation | block | 63 | 0 | 1% | 0% | 0% | 0% | 1.0 |
| prison | block | 339 | 81 | 1% | 4% | 12% | 0% | 1.0 |
| pumpstation | water | 195 | 81 | 2% | 0% | 4% | 6% | 0.9993 |
| quarry | rock | 342 | 110 | 0% | 0% | 0% | 47% | 0.9999 |
| radio | block | 1204 | 81 | 2% | 16% | 1% | 10% | 1.0 |
| rail | industry | 126 | 54 | 1% | 5% | 9% | 11% | 1.0 |
| railyard | industry | 289 | 54 | 2% | 1% | 15% | 0% | 1.0 |
| reclaim | green | 114 | 243 | 18% | 24% | 0% | 11% | 0.9965 |
| reservoir | water | 59 | 81 | 1% | 0% | 1% | 4% | 0.9984 |
| resort | glitz | 467 | 168 | 16% | 4% | 14% | 4% | 0.9969 |
| school | block | 1633 | 81 | 4% | 4% | 2% | 15% | 0.9997 |
| solar | industry | 105 | 54 | 0% | 3% | 9% | 1% | 0.9993 |
| speedway | block | 530 | 81 | 1% | 16% | 0% | 5% | 0.9981 |
| stadium | block | 929 | 0 | 0% | 1% | 0% | 55% | 1.0 |
| storage | industry | 40 | 54 | 0% | 4% | 0% | 10% | 1.0 |
| strip | glitz | 246 | 0 | 6% | 0% | 2% | 9% | 1.0 |
| strip_x | glitz | 180 | 0 | 0% | 0% | 1% | 12% | 1.0 |
| substation | industry | 627 | 54 | 2% | 2% | 0% | 10% | 1.0 |
| suburb | house | 109 | 170 | 7% | 21% | 1% | 18% | 0.9954 |
| swapmeet | glitz | 122 | 168 | 8% | 11% | 11% | 6% | 0.9907 |
| terminal | block | 458 | 81 | 2% | 5% | 0% | 38% | 0.9958 |
| town | house | 655 | 170 | 9% | 23% | 1% | 9% | 1.0 |
| trailer | house | 222 | 170 | 14% | 29% | 1% | 14% | 0.9965 |
| truckstop | road | 100 | 0 | 1% | 0% | 0% | 2% | 1.0 |
| warehouse | industry | 203 | 54 | 0% | 1% | 1% | 24% | 1.0 |
| wash | water | 262 | 81 | 4% | 1% | 1% | 32% | 0.9858 |
| water | water | 99 | 81 | 2% | 1% | 1% | 10% | 0.9916 |
| waterpark | water | 110 | 81 | 3% | 0% | 0% | 23% | 0.9996 |
| watertreat | water | 549 | 81 | 1% | 0% | 27% | 2% | 1.0 |

## 4. AFTER

| map | far | district | opening | step | near |
|---|---|---|---|---|---|
| before | 78.8% | 66.0% | 46.0% | 42.7% | 39.7% |
| 13 pictures in, the pictures still drawn from a block 27 px (batch2) | 78.7% | 65.9% | 45.8% | 34.4% | 31.4% |
| all 69 in, after RUN's one map (after) | 78.5% | 65.5% | 41.9% | 42.1% | 35.0% |

THE HONEST READ: with the pictures drawing, the step and near stops fell from 43% and 40% to 34% and 31% with 13 of 69 in. Then RUN's BUILD 10/24h (rule 142, `__ONE_MAP_AT_EVERY_ZOOM__`) made the PAINTING the map at every zoom and stopped drawing the per-block pictures, so on the map he plays the 69 coloured pictures are not on screen; what is on screen is the painting's palette (VB_CCOL) and the far land (VB_COL), both code, both tan. The bar (a third or less at every zoom) is NOT met on the map, and it cannot be met from pictures alone now: the painting's keys re-read off the new pictures are in RUN's note, section 2b, ready to paste (RUN's row [the far land in colour]). The pictures are still the map's source of truth for colour (rule 142c), the settlement and fight lanes' reference, and what any zoom that draws them shows.

## 5. FOR THE OTHER LANES

- FOR RUN: `records/BOHEMIA_COOK_NOTE_FOR_RUN_THE_MAP_IN_COLOUR_10_24_26.md` and the row [the far land in colour] in your
  section: the far land and the painted far city are the flood at the far and opening zooms, and they are code. Every
  proposed colour is checked against the measure.
- FOR PLUMBER: the measure could be the gate 137(b) asks for ('every art lane checks a new picture's colour spread before
  it ships'); the per-picture check is `sand_share` in the colour tool.
- FOR DIRECTION: the rig's DUST constant is a beige on every flat top; on the map it is swapped for a grey by this tool's
  wrapper after the source pass (the rig file is untouched). If the beige wash is to go from ALL art (137b says for ALL
  art from now), the rig's own constant is yours.
- FOR COOK FOUR / RUN TWO: the settlement pictures and the map's settlement stops (the plates with flags) were not
  touched this round; 143(f) moves the stops into the ground (RUN's [the wipe, the marker, no flags]); their colour is the
  next thing for this row once they sit in the ground.

## 6. WHAT FOUGHT BACK

- The mosaic grounds first came out as hard blobs of far colours: camouflage, his NO on the casino carpet. Now LINEAR
  between close colours, pulled 0.32 to their own mean.
- The commercial block came out all cream (36% sand): cream and yellow stucco are IN the sand family; they stay in the
  houses' list as one choice of nine, and left the block, road and industry themes.
- The freeway's sound wall came out sign green, the park's tiered trees came out pink and cream stucco, the gypsum works
  red rock: a sound wall is block, the park has its own foliage theme, gypsum its own white theme.
- The pool colour was hashed and three pools of four came out algae: now they cycle (blue, blue, algae, blue, drained).
- The capture's crop is 1 to 2 px off on a rig picture (its alpha fit was against the factory's plastic): registered to
  the old picture's own alpha now, IoU 0.995 to 1.0.
- `pkill -f` on the render's own name killed this lane's shell (the 10/19 handoff warned); and three wait loops never
  ended because `pgrep -f` matched their own command line: about twenty minutes lost. Kill by PID.
