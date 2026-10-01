# WHAT A TILE IS

WORLD lane (chat 02), 10/1/26. Row `[tile options]`, the half that is mine.

---

## 0. THE JOB

The coordinator, 9/28, after the row was retired as a fight-ground job and the
surviving half handed here:

> the list of tile KINDS at house size is yours: every kind the city has, from the
> block's own layout; the board must still read as the city

COOK owns what a tile **looks** like. This owns **what a tile can be**.

It sits directly on top of `[board terrains]` from last round: a terrain kind says
what kind of **board** you get; a tile kind says what the **squares on it** are.

---

## 1. HARVESTED, NOT INVENTED

REUSE-FIRST, and it is not close: the city already declares this vocabulary.

**52 district kits** each carry a legend whose every entry names a `kind`. Across
them there are **19 distinct kinds over 922 entries**. Not one was invented here.

The gate re-harvests the kits off disk **every run** and refuses if a kit ever
declares a kind the table has not heard of, so the list cannot quietly fall behind
the city it is supposed to describe. Same shape as `[board terrains]`' own leg, for
the same reason.

---

## 2. **THE FINDING: MOST OF WHAT THE CITY DRAWS IS NOT A TILE AT HOUSE SIZE**

This is rule 38(e) turned into a count instead of a promise.

The kits were drawn for **the walk**, at 0.75 m a cell. So their legend kinds are
at the walk's resolution. At **house size**, most of them stop being a square you
stand on and become something that happens *on* one:

> A painted lane line is paint. **A sidewalk is not a tile** — his words, 9/28:
> *"never a fight where one tile is one sidewalk."* A parked car is not a tile; it
> is the cover **on** one, which is exactly what makes it useful.

So all nineteen are classified, and **only ten are TILES**:

| class | kinds | legend entries |
|---|---|---|
| **TILE** | ground, drive, building, structure, water, water_dead, turf_dead, court, play, panel | 552 |
| **DRESSING** | marking, walk | 71 |
| **BLOCKER** | prop, vehicle, tree_dead, fence | 213 |
| **EDGE** | gate, portal | 70 |
| **OVERHEAD** | overhead | 16 |

**40.1% of what the city draws is not a tile at house size.** Nothing is thrown
away — rule 38(e) said the walk's assets dress the house tiles, and this is that,
stated as a table a generator can read.

---

## 3. HOW BIG A HOUSE TILE IS, MEASURED

**A COMBAT TILE IS A HOUSE** (9/4, 9/24, 9/28) is a ruling in *houses*, not metres.
So the metres had to be measured, not chosen. Off our own suburb kit, 128 cells of
0.75 m square, seed 1337:

- a house footprint is **21 × 12 cells = 15.8 m × 9.0 m**
- **the lot pitch** — nearest house centre to nearest house centre — is
  **26 cells = 19.5 m**, over a range of 18.0 to 21.8 m

**The pitch is the number that matters**, because what tiles a city is not the
house, it is the house plus its yard and half its driveway. So a house tile is
about **twenty metres square**, and a 96 m block is **five tiles across**.

The gate re-measures it every run, so the number cannot drift from the city. Faking
it in the module turns the gate red.

That number is the suburb's. A strip tile or an industrial tile is not forced to
match it and nothing here says it must.

---

## 4. THE COOK: THE SAME BLOCK, TWICE

`tools/bohemia_house_size_cook_10_1_26.js` →
`slices/vote/WORLD_WHAT_A_TILE_IS.png`. VOTE tab, `world-what-a-tile-is-10-1`.

Left is what the city actually draws: our own suburb block, every cell the walk
ever needed. Right is **the same block at house size**, cut on the measured
19.5 m pitch — 5 × 5 tiles, 676 kit cells each, and **15 of the 25 came out a
building**.

The whole point is what disappears between them. The left panel is the inventory;
the right panel is the board.

**AH-01, and the wrong thing is that the right one is a game board.** Two site
plans of a cul-de-sac is the ordinary part. The same houses, squared off, with the
one way in marked.

---

## 5. THREE THINGS I GOT WRONG, ALL CAUGHT BEFORE HE SAW THEM

**The census read one kit while the text claimed 52.** The picture's own file said
"52 kits, 922 entries" beside a census built from the suburb's own fifteen legend
entries. A number in a file that did not come from the thing it described. It
harvests all 52 now, the same way the gate does, so the claim and the measurement
are one number.

**Houses were losing their own tiles to their yards.** The first cut took the
commonest tile kind in each square, and only **2 of 16** came out a building — in a
block with twenty houses in it. A measured house is 252 of a tile's 676 cells, so
the yard around it wins a headcount. That is not what *a combat tile is a house*
means. The threshold came off the measurement rather than being picked: a real
house fills 37% of a tile, so a quarter is comfortably under a whole house and
comfortably over a neighbour's clipped corner. **15 of 25 now.**

**The file claimed the doors were marked and not one door pixel was drawn.** The
suburb kit declares exactly one EDGE kind, `gate`, and **places it zero times in
its cells** — the block's one gate lives in the kit's own `gates` list as
`{edge, x, y}`. So my AH-01 line described a picture the picture did not contain.
It is read from where it really lives now and marked on both panels, and the tool
refuses if not one door pixel lands.

That last one is the useful kind of wrong: the data was there, in a place I had not
looked, and the sentence I wrote about the image was true of my intention and false
of the file.

---

## 6. WHAT IS NOT MINE

`LOOKS` ships empty. What a tile kind is **drawn** as is COOK's, and what it does in
a fight — cover, reach, the mound — is COMBAT's. Asking answers `NO_RULING` by name
and says whose it is. The gate holds that the module carries **no colour, no pixel
and no damage number**.

**One data file** (MODS' line): `records/target/BOHEMIA_TILE_KINDS.json` — the
classification, the tile list, the census and the measured tile size, generated
from the module so COMBAT and COOK read one count instead of two that can disagree.

---

## 7. ROUTED

- **COMBAT** `[board generator]` — the ten tile kinds are what a square can be; the
  blockers and edges are what goes on and between them. With `[board terrains]`,
  that is the full input: the terrain kind picks the board, the tile kinds fill it.
- **COOK** `[board assets]` — the running order is the entry counts. Ground,
  structure and building are 90% of everything the city draws.
- **COMBAT / TUNING** — a door is an EDGE, which means it is a property of a
  boundary, not a square. Whatever a door costs to go through is a rule about
  crossing between two tiles.
- **PLUMBER** — the kit legends are the only place this vocabulary lives, and
  nothing enforced a kind list before this round. A kit can still invent a kind; it
  just goes red now.

---

`[bb tiles]` **Battle Brothers has one tile kind and dresses it.** Its board is a
hex field of ground with props scattered on it, and whether a hex is "forest" or
"swamp" changes your numbers, not what the hex *is*. Everything else — a rock, a
tree, a wall — is decoration or an obstacle placed on top. **OUR TWIST, so nobody
can call it a rip-off** (rule 39b): ours has **ten** kinds of square because ours
is a city, and a city is made of different *things*, not different *ground*. A BB
hex is somewhere to stand. **One of our tiles is somebody's house** — it has an
inside, a door that is the only way in, and an owner who is either dead or watching
you. That is the difference between fighting in a landscape and fighting in a place.
