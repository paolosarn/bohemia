# COOK -- [streets fixed] ROUND 1: THE STREET IS A PHOTOGRAPH

**Lane 16 COOK (the Production Artist), 9/13/26. Board row: `[streets fixed]`
THE-STREET-AND-THE-SIDEWALK-AS-HE-WOULD-KNOW-THEM, first line of this lane under rule 14.**

> *"it looks like shit... **the streets don't look like streets**... glitchy, buggy,
> nothing's complete... I would like to see [the tiny parts] come more together."*
> -- Paolo 9/13, having played the demo on his phone (rule 14, THE FIVE MINUTES, LOCKED,
> laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md)

---

## 1. MEASURE FIRST (rule 12), AND THE ROW SAID START ON THE BIGGEST LIE BY SCREEN AREA

Rendered the walked city at phone size (390x844, device scale 3, the profile the rest of
the repo's gates use) and read the canvas. Then asked the ART, which is the measurement
that decides anything.

**THE CRAFT LAW CEILING IS 64 COLOURS IN ONE TILE** (`gates/pixel_craft_gate.py`).
`SA_TILES`, chunk 1 of the tile bank, is every ground tile the walked city stands on:

| pool | tiles | size | median colours | worst | over the ceiling |
|---|---|---|---|---|---|
| street | 18 | 44x44 | 1,235 | 1,478 | 18 (100%) |
| side | 36 | 44x44 | 1,485 | 1,626 | 36 (100%) |
| lane_h / lane_v | 4 | 44x44 | 1,031 | 1,077 | 4 (100%) |
| median_h / median_v | 6 | 44x44 | 1,131 | 1,171 | 6 (100%) |
| cross_ns / cross_ew | 6 | 44x44 | 1,083 | 1,122 | 6 (100%) |
| shoulder | 4 | 16x16 | 248 | 255 | 4 (100%) |
| **THE WHOLE STREET** | **74** | | | | **74 (100%)** |

**Seventy-four tiles make every street in the game and every one of them was a
photograph.** The road he stands on was 19 times over the ceiling; the sidewalk beside it
23 times over; the person standing on both is drawn in six tones. Two worlds in one frame.

That is the same sentence this lane already wrote on 9/7 about the CARS -- median 3,031
colours down to 9 -- except the ground covers far more of his screen than the cars ever
did, and nobody had measured it.

## 2. THE REGISTRY MISTAKE THAT NEARLY SHIPPED

The first version of this cook measured `TP_TILES["street"]`: 97 tiles, 536 median colours,
100% over the ceiling. Clean, consistent, and **completely wrong**.

`TP_TILES["street"]` is STREET FURNITURE -- the STOP sign, KEEP OUT, the DANGER placards,
the warning triangles, the traffic signal, the cones. The road is `SA_TILES["street"]`, a
**different container in the same bank with the same key name**. The cook was one flag away
from turning every road sign in the game grey, and the only thing that caught it was
rendering a before/after contact sheet and LOOKING at it.

This lane has now learned the same lesson five times: **a clean measurement from the wrong
registry looks exactly like a fact.** The tool therefore parses the `SA_TILES` object
literal by brace-matching and JSON -- never by "nearest key above" -- and names its
container in every line it prints.

## 3. THE METHOD IS HIS AND IT IS UNCHANGED

Paolo 7/28, verbatim, in `banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt`:

> *"every pixel snapped to the family ramp by value, then orphans absorbed"*
> *"accents: up to two per tile, taken from that tile's OWN out-of-range pixels"*

ONE PALETTE PER FAMILY, out of that same approved bank: asphalt 7 tones, concrete 7,
ground 7. Which family each pool takes is the MATERIAL, not a preference:

- `street`, `lane_*`, `cross_*`, `median_*` -> **asphalt** (a road is asphalt)
- `side` -> **concrete** (a sidewalk is concrete)
- `shoulder` -> **ground** (the shoulder is hardpan)

### The two accents, and why the second one is the whole job

"Out of range" means outside the ramp, and a pixel can leave a ramp in two directions:

1. **OUT OF RANGE IN COLOUR** -- the weeds in the sidewalk cracks, the rust on the median.
2. **OUT OF RANGE IN VALUE** -- **LANE PAINT**. The asphalt ramp tops out at luminance 96
   and a lane line is white. Snapping by value alone crushes every lane line, every
   crosswalk stripe and every stop bar into the top asphalt tone. **A road with no
   markings on it is literally why he says the streets don't look like streets.**

Cluster floor: an accent blob under four pixels goes back to the ramp, or the tile scores
clean and looks like static (Paolo's DESERT DOMINANCE ruling, 7/14: coherent clusters,
never a per-cell shuffle).

## 4. THREE WRONG ACCENT RULES, EACH CAUGHT BY THE PICTURE AND NONE BY THE NUMBERS

Every one of these scored a perfect 74 -> 0 over the ceiling. The colour count never moved.

| the rule | what it did | how it was caught |
|---|---|---|
| saturation over the ramp's max + 0.12 | On the already-warm concrete ramp the bar lands at 0.35, so a weed scored 2 to 9 pixels, failed the four-pixel floor, and **every weed came out black** | contact sheet |
| plain RGB distance from the ramp tone | Dark cracks qualified as "out of range", so the 90th percentile landed light and **the sidewalk came out speckled white** | contact sheet |
| distance with brightness removed | Right idea, but pure black scores 77 -- scaling (0,0,0) to any brightness stays (0,0,0) -- so **every crack still qualified and the accent came back black** | measured the gaps |

**The rule that holds:** distance from the pixel's own ramp tone with brightness scaled out,
**plus a chroma floor, because a grey pixel has no colour to be out of range in.** One test
that separates all four things in a street tile at once:

```
a black crack      grey, dark     -> near the ramp    stays a crack
grey aggregate     grey, mid      -> near the ramp    stays asphalt
white lane paint   grey, bright   -> near the ramp    kept by the VALUE accent
a yellow weed      yellow-green   -> FAR              colour accent
median rust        orange, loud   -> FAR              colour accent
```

Calibrated on the shipped art once the greys stopped polluting it: gap > 45, floor 6 pixels.
`street` (pure grey asphalt) has **zero** out-of-range pixels at every threshold, which is
the right answer. `median_h` has 90 to 141, which is the rust. `side` has 2 to 46, which is
the weeds, and only 5 of its 36 tiles carry one.

## 5. RESULT

| pool | was median | now median | now worst |
|---|---|---|---|
| street | 1,235 | **7** | 7 |
| side | 1,485 | **7** | 8 |
| lane_h / lane_v | 1,031 | **8** | 8 |
| cross_ns / cross_ew | 1,083 | **8** | 9 |
| median_h / median_v | 1,131 | **8** | 8 |
| shoulder | 248 | **3** | 8 |

**Over the ceiling: 74 -> 0, of 74 tiles.** Every tile keeps its own cracks, its own weeds,
its own lane paint, its own crosswalk stripes, pixel for pixel. This is a RE-COLOUR, not a
re-draw: nothing new was drawn and no tone was invented. Chunk 1 of the bank went 1.8 MB ->
1.62 MB (fewer colours compress harder), and the blocking part of the bank dropped to
1.54 MB, which is a load win nobody asked for.

## 6. VERIFIED ON THE REAL SURFACE

Booted the alpha in a phone-shaped browser, walked into the suburb, and looked. Before:
photographic cracked asphalt and photographic cream concrete under six-tone people. After:
the ground is pixel asphalt and pixel concrete, the crack network is intact, the sidewalk
weeds read yellow, and **the people standing on the street now belong to the same world as
the street.** The top five colours on that canvas are `#443f3b`, `#383632`, `#504840` --
asphalt ramp tones, straight out of his 7/28 bank.

Pictures: `records/target/COOK_STREET_AS_HE_SEES_IT_9_13_26.png` (before, his phone).

## 7. WHAT IS STILL WRONG WITH THE STREET, MEASURED, AND WHOSE IT IS

Looking at the same phone frame honestly, three things are still broken and **none of them
is a palette problem**, so none of them was fixed by this cook:

1. **THE SIDEWALK REPEATS, AND I FOUND THE LINE.** The same weed sprite lands about ten
   times down one column at a fixed period -- the most obviously "glitchy" thing on that
   screen. **Measured: the pool holds 36 DISTINCT sidewalk tiles and 18 distinct road
   tiles.** The art has the variety. The renderer does not spend it:

   ```
   slices/BOHEMIA_CITY_WORLD.html:36538   c.gArtPool='side'; c.gArtVariant=_sw%3;
   slices/BOHEMIA_CITY_WORLD.html:36577   c.gArtPool='side'; c.gArtVariant=_sw%3;
   ```

   **`% 3`. The suburb sidewalk draws 3 of the 36 tiles that exist and has never touched
   the other 33.** Every other ground variant pick in that file is `% 2`, `% 3` or
   `% _fam[1]` (a pool length) -- only the ones that read a real pool length spend what
   they have. The per-PLOT seed beside it is correct and must stay: that is Paolo's
   DESERT DOMINANCE ruling (7/14, "too much diversity with the desert tiles"), and a
   per-cell shuffle would turn a run of pavement into a checkerboard. The fix is the
   modulus, not the seed. **ROUTED: LIFE + CITY / WORLD.** This is not a palette problem
   and no amount of cooking touches it.

   **AND A KERB CELL IS DRAWN AS FLAT SIDEWALK, ON PURPOSE, AT LINE 36268:**

   ```
   if(/\bcurbs?\b|\bkerbs?\b|gutter/.test(_nm)) _pool='side';
   ```

   The layout already knows which cells are kerb and gutter -- it names them -- and the
   renderer correctly decides a kerb is concrete, then hands it a flat sidewalk tile
   because **there is no kerb art to hand it**. That is COOK's, and it is round 2.
2. **THERE IS NO KERB.** The sidewalk meets the asphalt at a dead straight vertical seam.
   `SA_TILES` has no kerb pool at all -- roof, wallface, wallwin, pocket_v, pocket_h,
   cross_ns, cross_ew, lane_h, lane_v, street, side, shoulder, median_h, median_v, and
   nothing else. The board row names "kerb" in this lane's job, so **this is COOK's next
   round.**
3. **`shoulder` IS 16x16 WHILE EVERYTHING BESIDE IT IS 44x44.** The shoulder is drawn at
   2.75x the pixel size of the road it borders. That is a resolution mismatch inside one
   frame and it cannot be fixed by recolouring. **COOK, after the kerb.**

## 8. PROOF

- tool: `tools/bohemia_the_street_is_a_photograph_cook_9_13_26.py` (measure / `--write` / `--sheet`)
- art: `slices/BOHEMIA_CITY_TILES_01.js`, `SA_TILES`, 74 tiles, all 14 pools and every index unchanged
- pre-push pass green: PIXEL CRAFT 30/0, ART 45 16/0, PURITY ratchet holds, REUSE-FIRST
  205/4 (the 4 are other lanes' files, identical on main), REFERENCE CHECK 9/0,
  ALPHA LOADS 20/0, CITY TAB 64/0, BLOCKING CHUNK 4/0, BANKS-USED 24/2 (identical on main,
  verified by stashing this diff and re-running)
- full suite unmeasured since 9d0c8a4e (rule 13: PLUMBER has not posted THE SUITE LINE yet)
- the tool was renamed to carry `_cook` so REUSE-FIRST actually sweeps it; on its first
  name the law could not see it at all, which is a hole this lane was about to walk through
