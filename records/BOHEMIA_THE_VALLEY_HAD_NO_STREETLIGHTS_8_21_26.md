# THE VALLEY HAD NO STREETLIGHTS

8/21/26 — WORLD lane. Tab: **CITY** (the walked city, and the SLICE tab that reaches it).

---

## WHAT WAS TRUE THIS MORNING

Three approved streetlight sprites. Forty-two district legends declaring a light tile.
A renderer that draws them correctly, including a night head glow gated on the POWER
network. **Zero lamps on screen anywhere in the world.**

Measured on the running page, and the instrument was proved before the number was
believed:

```
CONTROL (a synthetic lamp injected into every chunk) : 25 draws
approved lamp sprites decoded and resident           :  3
lamp DRAWS across a 36-district sweep                :  0
lamp CELLS, per district, 3 plots each               :  suburb 0   arterial 0
                                                        commercial 0  downtown 0
                                                        strip 0   industrial 0
CONTROL (walkable cells, same sweep, same cells)     :  36,089 in the suburb alone
```

The art is Paolo's, passed 7/14: `banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt`, the
blessed V11 dark lamp bodies. They have been inlined in the city page since 7/20, decoded
into memory on every boot, and put on screen exactly never.

## WHY

There was one producer of `c.lamp` in the entire world, and it lived in the **parametric
road path**:

```js
else if(rel<laneZone+xs.side){ c.g='#c8c4b8';
  /* LAMP POSTS: staggered law - every 8 along, alternating sides, curb row */ ... }
```

which runs under `if(m.road)`. On 8/18 the roads got their own generator modules, and
`tileMeta` sets `m.road=false` the moment a road routes to its kit. `KIT_ROAD` today is
`{strip, arterial, freeway, rail, interchange}` — **which is every road class in `RD`**.
So `m.road` is false for every road in the valley, that whole path is dead code, and the
only thing that ever set `c.lamp` went dark with it.

**This is the same shape as the traffic signals, three days earlier, in the same file.**
`__A_ROAD_IS_STILL_A_ROAD__` (8/18) found the 348-sprite signal set drawing zero times for
exactly this reason and fixed it by giving road identity its own flag. The lamp was
standing in the same room and nobody asked it.

### The lesson that generalises

> When a path stops running, everything that only lived on that path stops with it — and a
> renderer that draws nothing is **silent**. A lamp that is not drawn looks exactly like a
> lamp that was never authored, which is why three days of green gates never noticed.
>
> After a routing change the question to sweep is not "does the new path work". It is
> **"what else was only on the old one"**.

## WHAT SHIPPED

**One rule, whole valley, on the consumer side.** Not a new lamp system: `realizeCell` now
recognises a light standard **by its legend name** and raises the approved body. Forty-two
district modules already declared one — `streetlight` on the arterial and the strip,
`pole light` in forty others — every one of them gated by `tilespec_gate`, every one in a
dossier, every one rendering as a flat square of palette colour until today.

```
before : 0 draws / 36 districts
after  : 46 draws / 36 districts
         suburb 11 lamp cells in 3 plots · downtown 18 · strip 23 · arterial 6
```

Two things it deliberately does **not** draw:

1. **Light towers and floodlight masts.** speedway (100 tiles, blobs of 25), ballpark (54),
   school (40), stadium, airport, airbase. A stadium mast is a different object from a
   cobra head; the sprite would be a lie on it, and a 25-tile blob would stand twenty-five
   overlapping poles. Excluded by name until they get art of their own.
2. **The second tile of a blob.** A pole is one tile in forty of the forty-two; `town` runs
   blobs of two. Only the top-left tile of a blob raises a body.

### The suburb, which is where he spawns

That district is not on the kit path at all (`m.sub`, a hand-written per-code branch), and
it had **eleven codes, every single one of them flat on the ground** — road, walk, drive,
dirt, gravel, debris, and the house masses. Nothing on the plot stood up except the
buildings, which is why the spawn read as a floor plan seen from above instead of a street
you are standing in.

`bohemia_suburb.js` now authors **code 12, a street light**, and it stands at the **back of
walk**: Paolo's 7/31 ruling puts the sidewalk hard against the kerb, so there is no amenity
strip and the pole goes on the property line behind it. The walk is never blocked — a solid
cell in a one-grid walk does not narrow it, it severs it, and the gate refuses any pole on
the kerb line.

**Spacing is researched, not invented.** Local residential practice puts successive heads
200-300 ft apart, staggered on alternate sides, which is 400-600 ft same-side. `TILE=0.75 m`,
so 500 ft = 204 tiles same-side with the other kerb offset by half of that. Result: 10-12
poles per plot, the same order as every other district that authors one.

**And it is a greedy walk, not a modulo.** The first cut asked `along % SPACE === phase`,
which nominates one cell per street and throws the pole away if that exact cell has a
driveway behind it. Measured: **one light in the whole plot**. A real crew does not abandon
a pole because the target station is somebody's drive apron; it walks on and sets it at the
next place it fits. The number is a target the street honours on average, not a lottery a
cell has to win.

### Two districts that authored no light at all

`commercial` and `industrial` — the two most common built district types in a city — had no
light tile in their legends at all, so the sweep found them dark and there was nothing to
turn on.

- **commercial**: `23 pole light` on the kerbed islands and the ends of the median bands.
  Every *other* median, on purpose: islands sit 19 tiles (14 m) apart and a pole on each
  would be a 47-ft grid, half again as tight as the 100-120 ft parking-lot practice this is
  built to. Skipping one puts them at ~94 ft. Six per plot.
- **industrial**: `12 pole light` on the **fence line**, ~120 ft apart. That is a
  circulation decision as much as a realism one: a pole is a solid cell, and a solid cell
  in a backing apron is something a 53-foot trailer has to route around. Real yards mount
  them on the perimeter and light inward. `driveConnected` still true.

### Dead is default

Not one head lights itself. The night glow belongs to the POWER network and only a live
circuit turns one on — CLUSTERED POWER (12% lit, owned, the network eerily perfect) and
LIGHT=TERRITORY, untouched. The gate asserts that the `POWER.at(...).live` check is still
standing between the pole and the glow.

## THE GATE

`gates/lamp_gate.js`, 19 checks, registered in the suite as **LAMP**.

Both halves of this were individually correct the whole time. What was broken was that
nothing connected them and nothing was watching the connection, so the gate checks the
**join**:

- **the producers still exist** — 42 districts author a light, ≥150 tiles in one plot of each
- **the rule still recognises them** — `__lampTile` is read *out of the page* and executed,
  never re-implemented in the gate (a gate carrying its own copy of the thing it checks is
  checking itself). It must accept every authored light name and refuse every tower and mast.
- **both consumers are still wired** — the kit branch, the suburb branch, the `ch2.posts`
  collection, the `LAMP_IMG` draw, and the POWER check before the glow
- **the suburb half** — poles exist, the one-grid sidewalk survives intact, no pole stands
  on the kerb line, and the streets still reach every lot

Proved red by breaking the `ch2.posts` hook: 18 passed, 1 failed, exit 1.

## HOUSEKEEPING FOUND ON THE WAY

The city page carried the 8/20 sidewalk block **twice** — the second copy unreachable dead
code behind the first `else if(v===10)`. Its patch tool reversed only the *first* occurrence
before re-applying, so once two copies existed the tool preserved two copies forever and
reported success both times. A reversal capped at one occurrence cannot converge; an
uncapped one always does, because the state it reverses to is "none". Tool fixed, duplicate
cut.

## THE SWEEP THIS OPENS (measured the same turn, not shipped)

The lamp was one instance of a general question, so the general question got asked: **which
authored props are STANDING OBJECTS in their legend and lie flat on the screen?**

Props only — a legend `structure` or `building` already gets a ¾ front face and is not
flat. A `prop` gets `c.s=pal`: one coloured square, no height, no silhouette.

```
barricade post        1356   arsenal:10
transmission tower     120   dam:9
light tower            100   speedway:12      +54  ballpark:12
speaker pole            61   drivein:7
fallen sign             20   town:14
signal mast             16   rail:8           +4 arterial_x:12   +4 strip_x:12
post                     8   fort:9
sign standard            6   casino:9
light mast               4   airbase:15       +4 airport:15
power pole               4   arterial:10      +2 arterial_x:10
high-mast light          4   freeway:9        +3 interchange:9
mile post                3   rail:18
                    ------
18 declarations, 1,773 tiles
```

The lamp took **one rule** to fix forty-two districts at once, so the shape of the answer
is known. What is not known is which of these deserve the same treatment and which need
art of their own — a transmission tower, a speaker pole and a barricade post are three
different silhouettes and none of them is a cobra head. REUSE-FIRST: measure what the
banks already hold before cooking a single pixel.
