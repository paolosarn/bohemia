# THE RING IS THERE AND IT IS CALLED A FREEWAY (9/22/26, WORLD lane)

Board row **[beltway placed] / KNOWN-EVERYWHERE-PLACED-NOWHERE**, plus rule 22
and rule 29. **Nothing shipped to a play surface** — rule 18 holds; the cook went
to the VOTE tab and it is drawn.

---

## 1. THE ROW OFFERED TWO DOORS AND THE ANSWER IS NEITHER

The row: *"'beltway' is in the graphics engine, the district kit's road set and
the arterial module, and on ZERO cells of a real 96x96 map. Decide by measuring:
either the overmap places it, or the name is retired from all three registries
with a record."*

Measured first, and the row's own count is right: **zero beltway cells across
five seeds.**

```
seed 1337  beltway 0   freeway 914   arterial 2511
seed    7  beltway 0   freeway 989   arterial 2353
seed   42  beltway 0   freeway 973   arterial 2455
seed 2026  beltway 0   freeway 947   arterial 2450
seed   99  beltway 0   freeway 939   arterial 2522
```

**But it is not unplaced.** The overmap's resolver carries a block commented, in
its own words:

```js
// BELTWAY: a RECTANGLE ring with square corners, 2 wide, snapped mid-block
{
  const {lft,rgt,top,bot}=L.beltRect;
  const onV=(x===lft||x===lft+1||x===rgt-1||x===rgt)&&y>=top&&y<=bot;
  const onH=(y===top||y===top+1||y===bot-1||y===bot)&&x>=lft&&x<=rgt;
  if(onV||onH)return DISTRICT.FREEWAY;      // <-- here
}
```

**It draws the ring on every seed and labels it freeway.**

## 2. HOW BIG, AND HOW MUCH OF IT IS REALLY THE RING

Separating the I-15 spine, the exits and the mountain passes that legitimately
cross a ring road, because counting those as beltway would be the easy lie:

```
seed 1337   ring 532 cells   spine 16  exits 12  passes 12   PURE RING 492
seed    7   ring 568 cells   spine 16  exits 12  passes 30   PURE RING 510
seed   42   ring 568 cells   spine 16  exits 16  passes 24   PURE RING 512
```

**About five hundred cells a seed are the Las Vegas Beltway and every one of them
reports as freeway.**

## 3. THE DECISION: PLACE IT

Retiring the name was never really on the table once the geometry was read.

- **A ring road is real Las Vegas geography.** CC-215 is one of the things that
  makes the valley's shape what it is: the old grid inside it, the tract suburbs
  outside it.
- **`beltRect` is load-bearing.** The map already uses it to site the airbase,
  the datafort, the freeway exits and the speedway, and to decide what "outside
  the beltway" means. Retiring the name would leave a rectangle the whole map
  reasons about with nothing at the end of it.
- **MAP LAW is not in the way.** *Claude never designs map layouts.* Nothing here
  designs one. The layout exists, Paolo's canon put it there, and this is the
  label on it.
- `beltway` is **already** a ROAD in the overmap's own table and **already** in
  its BIG set, so nothing about drivability or plot size changes.

## 4. *** AND THE FIX IS NOT ONE LINE, WHICH IS THE REAL FINDING ***

The obvious move is to change `DISTRICT.FREEWAY` to `DISTRICT.BELTWAY` in that
block. **On its own that would break five hundred cells.**

```
bohemia_powergrid   STREETS = [... 'freeway','residential','beltway']   READY
BOH_OMBRIDGE        STREET_DISTRICTS = [...'freeway','residential_street']
                                                          NO BELTWAY, 3 copies
```

The power grid lane was ready — its street list already carries the name, and it
has simply never matched, because no cell has ever been one. **The bridge's list
is not**, in all three copies.

So a lone rename would, silently and at once, stop five hundred cells being
**streets** to the district kit, to the plot generator's street-edge detection,
and to the landlocked law. **A one-line fix to a two-line problem is how a rename
becomes an outage.**

The gate pins both halves and fails if they are ever out of step: renamed but not
streeted, or streeted but not renamed. It cannot be done half-way now.

## 5. NOT SHIPPED, AND WHY

The rename touches `engine/bohemia_overmap.js`, which is the walked world's map
generator and is inlined into what he plays. Rule 18 lets only loading, walking
and the fight reach the alpha. **So this is measured, gated and ready, and the
two lines are named exactly.** Same as every row this lane has built under the
hold.

## 6. THE COOK, AND IT IS DRAWN

**THE RING ROAD.** `slices/vote/WORLD_THE_RING_ROAD.png`. The thing the name has
never had a picture of: one cell of the beltway.

The real cross-section, top to bottom: desert, sound wall, graded shoulder, three
lanes, median barrier, three lanes, shoulder, desert. It runs across the tile so
one cell tiles with the next one round the ring.

Compared to the world before calling it done (TG-05, PROP-02, PROP-03, AH-01):

- **TG-05** — a big paved surface reads by what **breaks** it, never by the
  paving. So the lane lines, the joints and the drift edge do the work.
- **PROP-02** — the real shapes. A Jersey barrier has a flat top and a sloped
  foot, not a slab. A sound wall is precast panels with posts at a regular pitch.
- **AH-01** — ordinary frame, one thing wrong. Six lanes of empty motorway is the
  ordinary part. The wrong thing is that **the sand has crossed the white line
  and nobody has swept it**, and it is the only shape on the tile that does not
  run parallel to everything else. 4.27% of the tile.

**THE FIRST CUT WAS BAD AND IT IS WORTH SAYING HOW.** I drew the pavement joints
every eleven pixels in near-black, and **the tile read as a cattle grid.** The
joints became the loudest thing on a surface whose whole rule is that the breaks
must be quiet. A real slab joint is a hairline you only notice in raking light.
Half as many now, one value step off the asphalt. The median barrier was a flat
grey stripe with no read at all; it has a lit top, a shaded foot and a shadow
both sides now, so it sits **above** the deck. Same for the wall.

## 7. THE GATES

```
BELTWAY PLACED   new, and it holds the finding and both halves of the fix
```

## 8. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** One row, a picture: **THE RING ROAD**.

## 9. ROUTED

**TO WHOEVER LIFTS THE HOLD**, and it is two lines, named:

1. `engine/bohemia_overmap.js`, the BELTWAY block: `return DISTRICT.BELTWAY;`
2. `BOH_OMBRIDGE.STREET_DISTRICTS`: add `'beltway'`, in all three copies, under
   the engine sync law.

Do both or neither. The gate will say so either way.
