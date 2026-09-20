# V222 — ONE TILE, STRETCHED OVER A WHOLE HOUSE (COMBAT lane, `[fight looks]`)

> **Paolo 9/20:** *"the combat is still dogshit, it's not at scale, it feels like it's
> in a different world than the demo, it doesn't even load on the tiles that you're
> on, it wants to take you to a different universe."*
>
> **His friend, on the link he sent:** *"a checkerboard of orange roof tiles for a
> floor, a flat road strip, two tiny figures on a brown aim line, a black bar."*

The row orders a MEASUREMENT before anything is built, on the deployed cut, with the
one driver. I did that first and built nothing until it was done.

---

## THE MEASUREMENT, AND IT IS FOUR NUMBERS

Both surfaces, in one session, on the cut, by wrapping `drawImage` and counting what
was actually blitted:

```
                    source art      drawn at      ground it covers
  THE WALK          44 x 44 px      11 x 11 px    0.75 m
  THE FIGHT         44 x 44 px      66 x 66 px    12 m
```

*** **IT IS THE SAME 44-PIXEL TILE.** The street shrinks it to eleven pixels. The
fight blew it up to sixty-six, and asked it to cover sixteen times more ground in
each direction. ***

So a house lot — a thing the walked city paints with **256** tiles, and even
pre-composes as a single 704x704 chunk — the fight painted with **ONE**, smeared
across twelve metres. That is the continent-sized crack in the asphalt, and the
sidewalk that reads as one stamp repeating. It is his "not at scale" and his
"different universe", and it is one number.

### The bodies were not the bug, and the measurement is what says so

The same 112x112 body canvas is drawn at **112 px** on the street and **37 px** in the
fight — 6.0x smaller, against a camera that is **5.3x** further back (14.7 against
2.75 screen pixels per metre of ground). Within fourteen percent, the people are
already right for the pull-back the row's own ship test allows: *"except that the
camera pulled back."* **The ground was 16x wrong.** So this round moves the ground and
does not touch a body.

### Two theories I had before I measured, both wrong

- **The faction floor.** `drawFloor` paints a flat faction colour, a grid and a
  procedural motif, and one of those motifs is literally `case 'check'` — a
  checkerboard. It looked like the answer. Photographed: it is painted *under* the
  board and completely covered. Not it.
- **A missing renderer.** The fight does render real street tiles per cell. The
  renderer was there. The scale it ran at was the bug.

---

## WHAT SHIPPED

A board cell stops drawing one tile and draws **THE LOT**: a patch of the walked
city's own cells, each with its own variant and its own quarter-turn, composed at the
size the street composes at, and then let down by the camera.

```
  lotSub()     tileMetres() / 0.75      how many walked-city cells are in a board
                                        cell. 0.75 m is the city's own CELL_M,
                                        "metres per fine cell". House board: 16.
                                        Body board: 2.
  LOT_SUBPX    11                       what the walked street was measured drawing
                                        a 44 px tile at.
  the patch    16 x 11 = 176 px         which is exactly the city's own 704 px lot
                                        chunk at its own 4x reduction. Their number.
```

**Measured on the cut after the change:** 211 of about 400 board cells now draw a lot
patch — **54,016 street cells where there were 211.** The rest are markings and roofs,
still one tile across the cell, which is the next paragraph.

### ONLY A MATERIAL TILES. A MARKING DOES NOT.

The first cut of this tiled everything, and the photograph killed it: repeating the
median sixteen times turned the yellow dashes into a fine stripe that downsampled to
nothing, and **the road lost its markings.** median, lane, kerb, gutter, wall and
house are DIRECTIONAL — the tile *is* the thing — which is exactly why V96 kept them
out of `ST_SPIN` with the comment *"isotropic surfaces only"*. That declaration is the
right question already asked, so the patch reads it rather than writing a second list.

### Nothing here is picked, and the body board cannot move

`lotSub()` is the metre door over the city's own cell, so the house board gets 16 and
the body board gets 2 with nobody typing either. The whole patch path is behind
`houseOn()`; turn the house board off and the old line runs, byte for byte. **MAP LAW
held:** this authors no street — `streetKindAt` still decides *what* a cell is, the
patch only decides how finely that one material is drawn. **NO DAMAGE BEFORE THE
DIAL:** not a reach, not a chance, not a hit. It is paint.

---

## PROOF

`lot_is_sixteen_tiles_gate` — **22 passed, 0 failed**, across THE WORKSHOP and THE CUT
HE OPENS. It does not ask whether a function exists; it counts what the floor blits
during one forced rebuild, in a real fight, started the way he starts one.

**Mutation-proved:** against main without the patch, **8 red, four arms on each
surface, symmetrically.**

### And the mutation run caught a lie in my own gate

One arm asked whether a raw 44 px source ever reached the board, and it **passed on a
tree with no patch in it at all** — because `streetTile` composes 44 into a 66 px cache
canvas once and then blits the cache, so after the first frame no 44 px source is drawn
on either tree. A check that cannot go red is not a check. It was replaced with one
that can: every patch is built at 176 px, and changing `lotSub` or `LOT_SUBPX` is what
makes that arm say so.

The first version of the gate also **crashed** on the old tree instead of reporting
red. A gate that dies cannot tell you which way it failed; the readouts are guarded
now and the run reports.

---

## THE PICTURE, FOR DIRECTION

`records/target/combat/FIGHT_LOOKS_9_20_A_THE_WALK.jpg` and
`records/target/combat/FIGHT_LOOKS_9_20_B_THE_FIGHT.jpg`, same session, same phone,
one tap apart. The row asks for this every round and no FIGHT VERDICT has been posted
yet.

## WHAT IS STILL WRONG, MEASURED, NOT FIXED

Each of these is its own ruling and this round is allowed one change:

1. **THE FIGHT SHARES ZERO ART WITH THE STREET.** Its 47 ground tiles were hashed
   against the walked city's 9,451. **Not one byte-identical pair.** The fight carries
   a second, frozen ground bank of its own, and its own header comment claims every
   tile is "lifted from an approved bank" — just not the bank he walks on.
2. **A LANE MARKING IS TWELVE METRES WIDE.** `streetKindAt` places median, lane, kerb
   and gutter per BOARD cell, so one yellow dash line is a whole lot across and the
   road is 96 m wide. Fixing that means declaring the street at fine resolution, which
   is authoring a street, which is MAP LAW's business.
3. **THE STREET HAS NO GRID AND THE FIGHT DRAWS ONE ON EVERY CELL.**
4. **THE TWO SURFACES RENDER AT DIFFERENT SHARPNESS.** The walked canvas is device
   ratio 1; the fight canvas is 2.
5. **THE ROOF READS AS A FLOOR.** `lotSubKind` turns a lot into house/yard/wall, and
   the house tile is drawn flat at ground level with no elevation, no edge and no
   shadow — which is, word for word, his friend's "checkerboard of orange roof tiles
   for a floor". THE_LOT_IS_A_HOUSE is right that a roof is the house's read at combat
   range; what it does not have yet is anything that says *this is above you*.

---

**Tool:** `tools/bohemia_lot_is_sixteen_tiles_patch.py` · **Gate:**
`gates/lot_is_sixteen_tiles_gate.js` (both surfaces) · **Tab:** COMBAT, and any fight
you walk into from CITY.
