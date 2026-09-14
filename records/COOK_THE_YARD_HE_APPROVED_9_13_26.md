# COOK -- [streets fixed] ROUND 2: 72% OF HIS SCREEN, AND HE APPROVED THE FIX ON 7/28

**Lane 16 COOK (the Production Artist), 9/13/26. Board row: `[streets fixed]`, round 2.**

> *"it looks like shit... the streets don't look like streets... glitchy, buggy, nothing's
> complete... **I would like to see [the tiny parts] come more together.**"*
> -- Paolo 9/13, having played the demo (rule 14, THE FIVE MINUTES, LOCKED)

---

## 1. THE ROW SAYS START ON THE BIGGEST LIE BY SCREEN AREA. SO I ASKED THE SCREEN.

Round 1 cooked the road and the sidewalk. Then I stopped guessing and asked the running
game which pool every cell around the player is drawn from, in a phone-shaped browser, in
the demo's first five minutes.

| pool | cells | share | what it is |
|---|---|---|---|
| **`hyard`** | **605** | **72%** | **three tiles, 16x16** |
| no pool ON THE CELL | 127 | 15% | **CORRECTED 9/14: these DO get a tile, resolved from their colour at draw time. See below.** |
| `street` | 70 | 8% | the 18 tiles round 1 cooked |
| `side` | 28 | 3% | the 36 tiles round 1 cooked |

**The street is 8% of his screen. The yard is 72%, and it is three sixteen-pixel tiles.**

I spent a whole round on 8% of the picture because I assumed the street was the street.
The street IS what he named, and it was genuinely broken, and round 1 was worth doing. But
the row said biggest by screen area and I did not measure screen area until round 2.

## 2. AND THEY ARE NOT DRAWN AT SIXTEEN PIXELS, WHICH IS WHAT MAKES IT LOOK BROKEN

`saTex()` bakes every tile into a 44px cell:

```js
const c2=document.createElement('canvas'); c2.width=TPX; c2.height=TPX;
c2.getContext('2d').drawImage(im,0,0,TPX,TPX);
```

A 44x44 tile lands **1:1, lossless**. A 16x16 tile is blown up **x2.75** -- a non-integer
scale, which this repo's own mobile render contract calls **BANNED** -- and that context
never turns smoothing off, so it arrives **bilinear-blurred**. Three-quarters of his screen
was a blurred 16-pixel tile sitting beside a crisp 44-pixel road. That is "the tiny parts
don't come together", exactly.

### He already ruled on this, in these words, and the fix missed the yard

The comment sitting on `TPX` quotes him from 8/1:

> *"the pixel quality... of the terrain **of the ground of the houses**... it's so bad"*

`TPX` was raised 22 -> 44 so his 44-pixel art would reach the glass at 1:1. **The street art
is 44px and got the benefit. The ground of the houses is 16px and never did.** He named the
ground of the houses, and the ground of the houses is the one thing the fix did not reach.

## 3. WHAT `hyard` IS: A SUPERSEDED FALLBACK THAT BECAME THE DEFAULT

It comes from `banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt`, the 7/21 house-skin
verdict. `gates/banks_used_gate.js` already carries a waiver saying that set was
**SUPERSEDED ON 8/1** and is *"kept loaded as the fallback"*. Meanwhile the walked city's
pool table ends:

```js
:(_k==='water')?null:'hyard';
```

Every cell that is not a road, a walk or water falls through to it. **A superseded 7/21
fallback is the default surface of the game.**

## 4. THE MEASUREMENT THAT SHOULD EMBARRASS ALL OF US

I compared all 42 tiles of Paolo's approved act-1 set against every tile the walked city
actually draws, by pixel hash, and then rendered them side by side and looked, because a
hash cannot see a recolour.

**All forty-two tiles Paolo personally approved on 7/28 are drawn by the walked city
exactly zero times.** Every road, walk, yard, wall, roof, door and garage tile in the set
he signed off is sitting in a bank nobody reads. His approval, verbatim, is the bank's own
authority line:

> *"I checked it to do the other 41 mark it approved."* -- Paolo 7/28/26

**That set includes `walk_kerb` and `road_gutter`. The kerb this row asks for already
exists, at 44 pixels, approved, and has never been drawn.**

## 5. WHAT SHIPPED

`SA_TILES.hyard`'s three tiles swapped for the bank's `yard_0 / yard_1 / yard_2`.

| | was | now |
|---|---|---|
| size | 16x16 | **44x44** |
| scale into the 44px bake | **x2.75, blurred** | **x1.00, lossless** |
| colours | 89 / 110 / 108 (over the 64 ceiling) | **5 / 5 / 5** |
| source | 7/21 house skins, superseded 8/1 | **7/28 act-1 recook, his approval verbatim** |

**Nothing was drawn. Not one pixel.** This is a placement, not a cook: the art is his, it
was already the right size, and it was already inside the craft law with room to spare.

**It needs no renderer change at all**, which is why it is safe: the pool key stays
`hyard`, the count stays three so `bh%3` picks exactly as before and no index moves, and
only the bytes change -- to the size `saTex` was already asking for. The tool touches an
**art payload**, a base64 array, and not one line of logic.

**Newest date wins, and it is not close:** the tileset recook is 7/28 and carries his
approval verbatim; the house-skin set is 7/21 and is documented as superseded on 8/1. The
16-pixel yard was older, superseded, blurred, and 72% of his screen.

## 6. VERIFIED ON THE REAL SURFACE

Booted the alpha in a phone-shaped browser and looked. The flat blurred cream field is now
crisp tan hardpan with scattered gravel, at 1:1. The whole frame reads as one material
family for the first time: tan hardpan, grey asphalt, grey-tan sidewalk, six-tone people.

## 7. REFERENCE CHECK

**Compared to:** TG-03 (the yard tile: *"a Vegas yard is GRAVEL OR HARDPAN inside a block
wall, no lawn in act 1"*), CGRD-03 (*"the ground alphabet is HOUSE / YARD / STREET / LOT and
almost nothing else"*), and the approved act-1 starter tileset.

- TG-03 says a yard is **hardpan with gravel on it**. Rendered both sets at 3x and looked:
  `yard_0/1/2` are tan hardpan with scattered darker gravel, crisp at 44. The 16px set is
  three near-flat blobs, and **one of them is terracotta red**, which is not a Vegas yard
  in any season.
- CGRD-03 -- the ground alphabet is short, and YARD is one of its four letters. It should
  be the letter he approved.

**What changed from the reference: nothing. The reference IS the art.**

## 8. TWO REGISTRY TRAPS DODGED THIS ROUND (the fifth and sixth in this lane)

1. `tf_cu` in the tileform pools looked exactly like a curb tile at the right size. **It is
   a COOLING UNIT.** Caught by reading the name table instead of trusting the abbreviation.
2. The 42-tile "all undrawn" result came from a pixel-hash comparison, which would report
   the same thing for art that is drawn in a **recoloured** form. I rendered the bank and
   the live pools side by side and looked before believing it.

## 9. WHAT IS STILL WRONG, MEASURED, AND WHOSE IT IS

1. **`walk_kerb` and `road_gutter` are approved, 44px, and undrawn.** The suburb has 15 cell
   codes and not one is a kerb -- Paolo's 7/31 ruling put the walk **hard against the kerb**
   (*"Im upset your suburbs dont have a 1 grid sidewalk next to the streets"*), so the kerb
   is an EDGE on the road-side of the walk, not its own cell. The walked city's marking pass
   already resolves oriented pools from neighbours (`c.markPool`, line 40481) and
   `__rotTex` already exists, so the hookup is that pass plus a pool key. **Art: COOK, and
   it already exists. Placement: LIFE + CITY / WORLD.**
2. **Every house pool is still 16x16**: `hroof` 14 tiles, `hwall` 4, `hwindow` 3, `hdoor` 3,
   `hboarded` 3 -- all blurred x2.75, all from the same superseded 7/21 set, and the bank
   has 44px approved `wall_*`, `roof_*`, `door_*`, `garage_*` for all of them. Not swapped
   this round because the roof pool has 14 members against the bank's 7 named hip/ridge/eave
   roles, so the counts do not line up and a blind swap would move an index. **COOK, next,
   and it needs the role mapping worked out first.**
3. ~~**138 of 841 cells (16%) draw with no pool at all**, by flat colour through `texFor`.~~
   *** WRONG, AND CORRECTED BY ROUND 3 ON 9/14. THIS WAS A PROBE ARTIFACT AND I PUBLISHED
   IT AS A FACT. *** My probe read `c.markPool || c.gArtPool || 'flat '+c.g` and called
   everything that fell through "flat colour, no pool at all". But a cell carrying no pool
   is not a cell carrying no tile: `texFor(col)` resolves the colour to a pool through
   `SA_MAP` at DRAW time, and anything it does not know falls to `texForKind`, which
   generates its texture procedurally AT 44px. Round 3 asked the page's own `texFor` for
   every one of the 841 cells: **841 tiled, 0 flat. Not one cell in his first five minutes
   is a flat fill.** The 105 cells of `#8a8a86` are the STREET pool (round 1 cooked them)
   and the 22 of `#8a7a5e` are the procedural dirt kind, already at full resolution.
   A clean number from a probe that asked the wrong question looks exactly like a finding.
4. Round 1's finding stands: the sidewalk spends 3 of its 36 tiles
   (`BOHEMIA_CITY_WORLD.html:36538` and `:36577`, `c.gArtVariant=_sw%3`). **LIFE + CITY.**

## 10. PROOF

- tool: `tools/bohemia_the_yard_he_approved_cook_9_13_26.py` (measure / `--write`, reads
  back what it wrote and refuses on a count mismatch)
- art: `slices/BOHEMIA_CITY_WORLD.html`, `SA_TILES.hyard`, three tiles, art payload only
- pre-push pass green: PIXEL CRAFT 30/0, ART 45 16/0, PURITY ratchet holds, REUSE-FIRST
  206/4, REFERENCE CHECK 11/0, CITY TAB 64/0, ALPHA LOADS 20/0, WALL CLASS 24/0, PAGES
  PUBLISH 18/0, BANKS-USED 24/2 -- the 4 and the 2 are other lanes' files and are
  **byte-identical on main**, verified by stashing this diff and diffing the failure lines
- full suite unmeasured since 9d0c8a4e (rule 13: PLUMBER has not posted THE SUITE LINE)
- did not re-cut the demo (rule 14a)
