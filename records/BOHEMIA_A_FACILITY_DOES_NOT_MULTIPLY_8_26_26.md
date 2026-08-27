# A FACILITY DOES NOT MULTIPLY WHEN YOU GIVE IT MORE GROUND

**8/26/26 — WORLD lane. Three more districts stopped building themselves once per cell —
FOUR STADIUM BOWLS in a 2x2, four weighbridges inside one landfill fence, four chapels in one
burial ground. But the shipped thing is not the three districts. It is that this was the sixth
time in three days, so it stopped being a bug and became a MECHANISM in the district kit and a
GATE FOR THE CLASS that needs no list of districts and no magic numbers. And separately: every
load number this lane ever printed was measured on a host that does not exist.**

---

## SIX TIMES IS NOT A BUG, IT IS A CLASS

A district generator is handed ONE cell and draws 128x128 tiles. When the same district covers
a blob of cells, every cell builds a complete copy of the whole facility.

```
solar      265 cells   265 fenced plants, 265 substations        8/24
wash        51 cells   51 tunnel mouths in ONE river             8/25
railyard     6 cells   6 engine sheds, 6 gantry cranes           8/26
stadium      4 cells   FOUR STADIUM BOWLS in a 2x2               8/26
landfill     4 cells   4 weighbridges inside one fence line      8/26
cemetery     4 cells   4 chapels in one burial ground            8/26
```

The first three were fixed by hand, each growing its own copy of the same code. Copying it a
fourth time is how one mechanism rots into four slightly different mechanisms, so it went into
the district kit as `K.blob(seed, opts)` — valley-coordinate writers (`vset`, `vrect`, `vell`,
`vring`, `vline`, `vframe`), a `rnd` that belongs to the BLOB rather than the cell, `firstAt`
for loops that must land on the same rows in every cell, `dress` that keeps confetti off the
seam, and `gates` that only fire on the district's own edge.

The three districts after it are about thirty lines each instead of a hundred and thirty.

## AND THE TWO SHAPES ARE DIFFERENT, WHICH IS THE PART WORTH KEEPING

**An AREA district takes the blob's BOUNDS.** Solar, railyard, stadium, landfill, cemetery: one
hero structure at one end, content filling the ground between.

**A LINE district takes its NEIGHBOURS.** The wash is a channel that turns a corner; the
bounding box of that corner run is 4x7 cells and a straight line drawn through it misses most
of the cells that are actually wash. Extent is the wrong question for a line — what it needs is
which sides it arrives and leaves on.

Naming those as two different problems is what let the same kit serve both.

## THE STADIUM WAS ALSO THE WRONG SIZE, AND ONLY THIS COULD FIX IT

A real stadium bowl is 200-250 m across. One cell is 96 m. The single-cell build therefore
draws a **72 m toy** — not a bug in the drawing, a bug in the ground it was given. Across a 2x2
blob the bowl is **138 m** with the lots around it, as they are in life.

The canonical proportions are held exactly (facade at R, concourse at R-2/48 of R, stands at
R-5/48, field at R-20/48). Holding the RATIOS rather than the numbers is what lets the same
bowl be a toy in one cell and a real stadium across four.

## THE GATE FOR THE CLASS, AND WHY IT HAS NO CONSTANTS

`gates/one_district_per_blob_gate.js` reads the valley, finds every multi-cell blob, and builds
each one **both ways** — as one district, and the old way, a cell at a time, each handed only
its own bounds, which is exactly the path a lone cell still takes. Then it counts the
district's own HERO STRUCTURES in each: connected runs of whatever tile its `body` predicate
names, which every district already declares to the kit.

**That comparison IS the mutation test, run every time, against the exact defect it guards.**
It cannot go quietly green the way a hardcoded expectation can.

```
  landfill    4 cells: hero structures  4 if built per cell ->  2 as one district
  railyard    6 cells:                 12                   ->  2
  convention  6 cells:                  6                   ->  1
  wash        8 cells:                 16                   ->  4
  prison      4 cells:                 40                   -> 10
  stadium     4 cells:                  4                   ->  1
  cemetery    4 cells:                 16                   ->  6
  dam         4 cells:                 28                   ->  7
ONE DISTRICT PER BLOB GATE: 5 passed, 0 failed
```

It also prints the backlog it cannot fix: `farm:9 · golf:9 · town:9 · datafort:6 · speedway:6`.

### three things the gate got wrong first, and each one is a lesson

**It exited 0 and printed nothing.** Requiring every file in `engine/` to populate the registry
loaded a module that self-tests at require time and ends with `process.exit`. An exit code
cannot be caught, so the answer is not to load the file: it now loads only what contains
`K.register(`.

**It reported that the world model declares no clusters, with six of them in the file.** The
regex was `\{[^}]*cluster:true` and every DISTGEN row carries
`foot:function(r){return r.footprints;}` — the first `}` ends the class before `cluster:true`
is ever reached.

**It failed the wash, which had been fixed the day before.** It handed every district BOUNDS,
so the wash fell through to its lone-cell build and the gate read 14 tunnel mouths either way.
*A gate that cannot construct the thing it is judging is measuring itself.* It computes the
neighbour set from the blob now.

**And the rule is "does not scale with cells", not "at least halves".** A three-cell wash goes
6 -> 4, because a run has two ends whatever its length. That is the fix working perfectly and
it is not a halving.

## THE PAGE, WHICH IS THE THIRD TIME THIS WEEK

Every one of these was fixed in the model, gated, mutation-tested — and the walked surface
still drew the old thing, because `world.js` is not on that page and the page carries its own
inlined copy of all ninety-five engine modules.

`walked_surface_gate` now sweeps the one-facility districts on the page directly:

```
one-facility districts on the page (cells/hero structures):
  railyard 6c/2r   landfill 4c/2r   stadium 4c/1r   cemetery 2c/6r
WALKED SURFACE GATE: 14 passed, 0 failed
```

Mutation-tested by un-wiring the page: stadium 1 -> 4, landfill 2 -> 4, cemetery 6 -> 8.

**The first cut of that sweep was too greedy and had to be narrowed.** Applied to every
multi-cell blob it flagged a hundred of them — and every one was right to have what it had. A
COMMERCIAL strip is twenty-four separate stores per cell BY DESIGN; a TOWN is three hundred
houses; a FARM has five barns. "One facility per blob" is not a fact about districts, it is a
fact about the handful that ARE one facility, and a rule that fires on the rest is noise a
reader learns to scroll past.

The cemetery ceiling is 7 and not 8 for the same reason: measured 6 as one ground and 8 built
per cell, so 8 would sit exactly on the wrong side of the defect. **A ceiling that does not
fail the bug it was written for is decoration.**

## AND EVERY LOAD NUMBER THIS LANE PRINTED WAS A PHONE THAT DOES NOT EXIST

The test server sent every byte raw. **GitHub Pages compresses text on the fly** — gzip, not
brotli, which has been asked for since 2019 and still is not there. So the gate was measuring a
host nobody uses, and it was pessimistic by whatever these files happen to compress to:

```
BOHEMIA_CITY_WORLD.html   2.68 MB -> 0.99 MB   (37%)
BOHEMIA_CITY_TILES_01.js  1.75 MB -> 1.26 MB   (72%)
BOHEMIA_CITY_PROPS.js     1.72 MB -> 1.29 MB   (75%)
```

Base64 art barely compresses — it is already-compressed PNG bytes spelled out in letters — and
the page, which is source and comments, compresses hard.

With the server behaving like the real host, and the accounting counting what actually crossed
the wire rather than what sits on disk:

```
                    before        after
total to play      40.76 MB     25.88 MB
after the tap       2.84 MB      1.05 MB
weak 4G, tapping
at once                11.1 s        8.4 s
```

**Nothing in the game changed to earn any of that.** Three ratchets came down with it: total
44 -> 30 MB, after-the-tap 6 -> 2 MB, the wait 16 -> 12 s. All three mutation-tested.

## AND THEN THE TWO BIGGEST ONES, THE SAME DAY

**GOLF: NINE COURSES IN A 3x3, AND THE ARITHMETIC IS THE NICE PART.** Every cell built a
complete course — three holes, a clubhouse, a pro shop, a driving range, two car parks. Nine
clubhouses inside one boundary.

A 3x3 blob is 288 m square, about **83 hectares**. A real eighteen-hole course is **50 to 75**.
The ground was always there for the actual thing; it was being cut into nine pieces with a
three-hole pitch-and-putt on each. It is **one course, eighteen holes, one clubhouse**, routed
the way courses are routed: two loops of nine, each leaving the clubhouse and coming back to
it, so 9 and 18 finish where 1 and 10 started. That is not decoration — it is why a clubhouse
sits where it sits, and it falls out for free once the course is allowed to be one course.

```
45 hero structures if built per cell  ->  1 as one district
THE COURSE: 9 cells, 18 holes, 1 clubhouse       GOLF GATE: 16 passed, 0 failed
```

**And the hole count was wrong twice, silently.** A pin is ONE TILE. Set beside its own green
it gets painted over by the next hole's fairway — the back nine crosses the front nine, which
is exactly what a real routing does. Eighteen holes measured **EIGHT**. Moved after the
fairways: **SIXTEEN**. Only drawn absolutely last, after the ponds and the clubhouse and the
cart path, are there eighteen. Nothing anywhere complained either time, which is why the count
is now a gate line.

**And the cart path did not join up.** The spine ran from the north ring down to the clubhouse
— and **the clubhouse is solid**, so it stood between the spine and the south ring and
stranded every path tile north of it. One cell of nine came back unreachable from any gate.

**FARM: THIRTEEN BLOBS, AND THIRTEEN IS RIGHT.** This is the one where "one per blob" had to be
checked rather than assumed: separate parcels really are separate farms. What was wrong is
INSIDE a parcel — every cell built a farmhouse, a barn, three silos, an equipment shed, a
farmyard and its own fence ring, so a nine-cell farm had **nine farmhouses and nine barns**.

The arithmetic settles it again: nine cells is about **8 hectares**, which is ONE SMALL FARM.
Nine farmsteads on eight hectares is not a hamlet, it is a rendering bug.

```
all 13 blobs: 45 -> 3, 20 -> 3, 15 -> 3, 10 -> 3 ...   FARM GATE: 11 passed, 0 failed
```

The furrows run the full length of the parcel now instead of stopping at every cell boundary —
the difference between a ploughed field and a patchwork quilt. **And the centre cell of a 3x3
had no road at all**: a headland ring round the parcel is what a one-cell farm has, and it
never reaches the middle. A tractor could not get to the middle of the farm from any gate. Real
farms have a track between every pair of fields; that is what a ditch bank IS.

## AND TWO MORE, WITH THE GATE'S OWN BACKLOG CORRECTED

**THE GATE WAS WRONG ABOUT THE AIRPORT, AND IT WAS MY REGEX.** It decided which districts are
cluster-built by reading `cluster:true` out of the world model's DISTGEN. That is only ONE of
the two places a district can be cluster-fed: **the airfields are SURFACES, not districts** —
they live in a different table in the same file, which passes bounds too, and their own dossier
has said *"built across the CLUSTER, not the cell — a per-cell airport would have been thirty
runway stubs"* since 7/26. So the gate listed the valley's **24-cell airport** as unfixed
backlog while it had been correct for a month, **and never once tested it**.

It asks the generator now instead of parsing a table: hand a district bounds spanning several
cells and bounds spanning one, and see whether it draws something different. A behavioural test
cannot drift from the thing it describes, which is more than can be said for a regex over
somebody else's file. The airport is now measured — **8 structures per cell → 1** — and the
interchange came into scope with it.

**SPEEDWAY: SIX OVALS, AND THE SIZE WAS THE REAL INSULT.** Each cell drew an oval 54 tiles by
40 — about **81 by 60 metres**. That is a go-kart circuit. A short track, the smallest thing
anyone calls a speedway, is a half-mile lap: roughly **250 m** across. Across the blob the oval
is 200 m and the lap comes out near half a mile, which is the thing the district is named
after. Same story as the stadium: the drawing was never wrong, the ground it was given was.

```
speedway  6 cells: 84 hero structures if built per cell  ->  22 as one district
lone cell 25 of 25 byte-identical · void 0.016 · legend and drive clean
```

**AND THE LOAD RATCHET CAUGHT ME.** The wait went 8.4 s → **14.2 s** and the gate went red on
my own tree. The cause was not the districts: **rebasing onto main brings back a 4.47 MB
blocking chunk**, because main still carries the fat one from another lane's hero bake, and the
merge prefers it. Re-running the chunker puts it back to 1.75 MB and the wait back to 8.4 s.
Two gates guard this — `late_art` holds the blocking chunk at 2 MB and `time_to_play` holds the
wait — so the machine catches it, but **the chunker has to run after every rebase** and that is
now written down.

## WHAT COMES AFTER

The gate prints its own backlog, which is the point of it. What is left is roads, terrain, and
districts that are SUPPOSED to have many buildings:

```
mountain:40 · arterial:35 · airport:24 · interchange:16 · resort:16 · water:16
rail:13 · desert:13 · downtown:9 · town:9 · datafort:6 · speedway:6
```

**Airport turned out to be already correct and speedway is now done, which leaves the UTILITY
FAMILY.** `datafort:6`, `basin:4` and `watertreat:4` all come out of ONE generic builder in
`engine/bohemia_utility.js` — `buildCanonical(type, seed)` serving arsenal, datafort, basin,
reclaim, radio, granary, reservoir, pumpstation and intake off a per-type layout table. **One
change there covers every one of them**, which makes it the best-value item left and also the
one that deserves its own turn rather than the tail of this one.

downtown, town, commercial and ballpark are NOT this defect and must not be treated as it:
those are supposed to be many buildings. Roads and terrain have no facility to duplicate at
all. The gate's own list is where that distinction lives.
