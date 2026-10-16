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

---

# THE UTILITY FAMILY AND THE PLANT — 8/27/26 (WORLD/CITY lane)

The turn above ended by naming the utility family the best-value item left. It was, and it
came in cheaper than anything before it.

## THIRTEEN DISTRICTS, ONE CHANGE

| | before, on a 3x2 blob | after |
|---|---|---|
| car gates, every one of the twelve | **6** | **1** |
| fence segments | 6 to 48 | one fence, largest piece spans the whole plot |
| datafort, on the walked page | **6 of 6 cells** | **1 of 6** |
| basin, on the walked page | **4 of 4** | **1 of 4** |
| reclaim, on the walked page | **2 of 2** | **1 of 2** |
| watertreat, on the walked page | **6 buildings over 2 cells** | **3** |
| lone cells | — | byte-identical, every type, all four facings |

Solar, wash, railyard, stadium, landfill, cemetery, golf, farm and speedway each needed their
own blob-scale rewrite, because each draws its own thing its own way. **The utility factory
did not.** Twelve landmarks already shared one frame, one layout dispatch, one dressing pass
and one drive connector, and every one of them talks to the grid through `get/set/rect/W/H`
and nothing else. So the whole blob is built as a SINGLE OVERSIZED DISTRICT — `K.grid` already
took a width and a height — and all nine layout primitives ran against it **completely
unchanged**.

That is the FACTORY LAW paying out three weeks after it was obeyed. The law promised that the
thirteenth landmark would be a spec and not a file. It turned out the same was true of the FIX
for all twelve at once, which nobody had thought to claim.

## THE RULE THAT CAME OUT OF IT: REPEAT THE UNITS, NEVER THE NAME

A bigger site is a bigger facility, not a sparser one, and there are three honest ways to grow
one. Which one applies is a property of how the plan was written:

- **Proportional** — the plan positions against W and H (`W*0.16`, `Math.round(W*0.62)`).
  A three-cell quarry is genuinely a three-cell pit. Nothing to do. Seven of the nine.
- **Grow the count** — the plan spreads a fixed number of units over whatever ground it has,
  so the number scales with the blob. Tank columns, silos, pond grids, quarry benches.
- **Repeat the unit** — the plan is written at literal coordinates and would otherwise draw
  one small cluster in the corner of an enormous empty yard. The magazine rows of an
  ammunition depot, the masts of an antenna farm, the treatment trains of a plant.

**The line that decides it: repeat the units a bigger site HAS MORE OF, and never the thing it
is named after.** A depot twice the size honestly has twice the magazines. Nobody names an
antenna farm after one mast. But there is exactly one control house, one fence, one gate, and
the moment you repeat those you have rebuilt the defect inside the fix.

Which is not hypothetical: **the first cut tiled the reclamation ponds and took the control
building along with them**, and `one_district_per_blob_gate` went red on `reclaim (2 -> 2)`.
Ponds are a grid, so they grow, and the plant stays one plant.

`K.shift(G,dx,dy)` is where that lives now — in the kit, not in two districts, with the rule
written on it.

## A HASH CAUGHT WHAT READING THE CODE COULD NOT

Lifting the plant's process train into its own function left the scum-drift loop running
**twice**. It was invisible: the original bounds are `W-16` and `H-40`, which on a 128 grid are
exactly the 112 and 88 the extracted copy used, so the duplicate drew the same shape — it just
consumed the rng twice and shifted every later draw. Nothing looked wrong. Seven md5s over
four seeds and four facings noticed on the first run.

**A byte-identity check on the path you did not mean to change is worth more than an inspection
of the path you did.**

## AND THE CLARIFIER THAT WAS PRETENDING TO BE A BUILDING

The gate would not go green on `watertreat 24 -> 15` after the plant had genuinely stopped
multiplying. Chasing the number that refused to fall found something five weeks old and
nothing to do with blobs: **every CLARIFIER was counted as a BUILDING.**

The generator drew each clarifier's centre core as code 2 — *"building (control / blower /
chem)"*, the ENTERABLE one — while this district's own legend has said since the day it was
written that code 6 is *"clarifier wall / core"*, *"the concrete wall + centre core of a
circular clarifier tank"*. A three-clarifier plant reported six buildings, and three of them
were round concrete drums you could walk into and find a control room inside.

A generator contradicting its own recorded legend is a **BUG, not a reading** (TRUTH
HIERARCHY). The core is code 6 now and a lone plant has three footprints instead of six.

It was invisible for five weeks and surfaced only because a gate measuring something else
refused to go green. **That is the argument for gates that assert a PROPERTY rather than a
number somebody wrote down** — a property gate keeps pointing at the discrepancy until you
understand it, and a threshold gate would have been retuned and forgotten.

## THE PAGE LEG ASKS A BETTER QUESTION THAN THE OLD ONES

Every existing ceiling in `walked_surface_gate` is a constant somebody measured on one valley.
That works, and it is brittle: a different seed makes a bigger blob, a road splits one building
into two runs, and a green gate goes red over nothing.

**The defect was never "more than N". It was "one per cell".** So ask that directly: a facility
built once has strictly FEWER structures than its ground has cells; one built per cell has
EXACTLY as many. `1 of 6` passes at any size and `6 of 6` fails at any size. Mutation-tested by
un-clustering the data fort on the page (6c/6r, red) and the plant (2c/6r, red), both restored.

The constant still wins where the property does not hold — a plant has exactly three buildings
however big it gets, so `fewer than cells` would go red on a correct two-cell plant. **Pick the
ruler from the shape of the claim, not from habit.**

## WHAT COMES AFTER

The debt list went from 20 families to 14, and **every one left is out of scope by definition**:

```
mountain:40 · arterial:35 · resort:16 · water:16 · rail:13 · desert:13
downtown:9 · town:9 · commercial:4 · ballpark:4 · campus:4 · industrial:3 · park:3 · medical:2
```

Roads and terrain have no facility to duplicate. downtown, town, commercial, ballpark, campus,
industrial, park and medical are **supposed** to be many buildings, and treating them as this
defect would be the mistake this record exists to prevent.

**So this class of bug is closed.** It ran from 8/24 (solar) to 8/27 and took twenty-two
districts. The gate stays as the net.

---

## POSTSCRIPT, SAME DAY: THE TWO THINGS THE GATES FOUND THAT NOBODY WAS LOOKING FOR

### A TOOL WAS DELETING ANOTHER LANE'S WORK ON EVERY RUN

`tools/bohemia_city_chunk_tile_bank.py` rewrote the whole `__TILE_BANK__` region of the
walked page and **discarded whatever else lived inside it**. The ART lane's room-floor data
loads from one line in there. So `slices/BOHEMIA_CITY_FLOORS.js` stayed tracked, stayed in
the deploy list, and **nothing loaded it** — `FLOOR_POOL_B64` undefined on the page Paolo
walks, every interior floor falling back to the default.

**I diagnosed it as a rebase eating the tag and fixed it as one.** It came straight back
the next time the chunker ran. That second failure is the only reason the real cause
surfaced, and it is the lesson: *a fix that works once and does not survive the tool that
caused it was never a fix.*

**THE FILE SURVIVING IS WHY THIS IS INVISIBLE.** A deleted file is loud — git says so, the
diff says so, a build says so. A file that still exists with nothing pointing at it looks
exactly like a file that works.

Two changes, because one of them is the net and the other is the hole:
- the chunker **carries foreign tags forward**, unrecognised ones kept rather than dropped,
  because when a tool cannot tell whose a tag is, the safe answer is the one that does not
  delete somebody's work. Proved stable over three consecutive runs.
- `gates/no_orphan_script_gate.js` — **every `.js` in `slices/` must be NAMED by something
  that can load it.** A name check and not a tag check, deliberately: eight chunks load by
  URL construction and have no tag anywhere. It caught the recurrence **live**, minutes
  after it was written.

### A RULER THAT PREDATES THE CHANGE IT MEASURES IS THE BROKEN PARTY

`valley_census` calls a type flat when **every** sampled plot has no building. Correct while
every generator got one cell; the **wrong question** for a clustered one, where a six-cell
data fort is one cell with the hall and five without *by design*. It was measuring the fix
and calling it damage. 11/3 → 14/0, with the clustered types read from the `cluster:true`
declarations rather than a hand-list so they cannot drift.

**And the fix exposed a hole in the gate written that same morning.** A leg meant to stop
the exemption hiding a vanished facility failed on solar — and was **wrong**: the census
*samples*, and a solar farm is hundreds of cells with one control building, so *"does not
exist"* and *"the sample missed it"* are the same reading there. Looking for where the
guarantee belonged found that **nowhere held it**: `nBlob < nCell` is satisfied by
`nBlob === 0`, so *stopped multiplying* and *disappeared* are the same number, and
vanishing is the worse failure.

**Put the check where the evidence is, not where the symptom showed.**

### AND THE PROCESS FAILURE THAT COST THE MOST HOURS

I ran diagnostic browser gates **from a git worktree while the suite was running browser
gates in the main tree** — two Chromiums, four cores — and then spent an hour concluding
that four gates were "intermittent."

`ONE SUITE AT A TIME` exists for precisely this. Its lock keys on the **repo root**, and a
worktree is a different root, so it never fired. On a clean run with nothing else touching
the machine, LOOK NOT TRAVEL, COMBAT SOUND, WALK FEEL and VISTA EXIT all came back green.

**If you are diagnosing a suite red, kill the suite first, or your answer is about you.**

### WHOSE EVERY RED WAS, MEASURED ON UNTOUCHED MAIN RATHER THAN ASSUMED

| gate | on main | verdict |
|---|---|---|
| FLOOR | 18/0 | **mine** — fixed |
| VALLEY CENSUS | 11/3 | **mine** — ruler fixed, 14/0 |
| GRAVEYARD | same 10 live refs | pre-existing |
| FULL RES | 12/1, same 15.2% | pre-existing |
| XRAY | 3/2 at the same coordinate | pre-existing |
| SEE-THROUGH MOVE | 9/1, same leg | pre-existing |
| INSTALL CARD | 22/1 | pre-existing |
| NO CANOPIES | same parapet | pre-existing |
| LOOK | — | **not a real red**: see below |

**LOOK measures the age of the working tree, not staleness.** It clocks each picture's
mtime against its surface, every ship touches the alpha by law, so any tree older than six
hours trips it. Reproduced on untouched main by ageing the pictures seven hours and touching
the alpha: 23/1, the identical failure.

---

## AND THE DEMO, SAME DAY — WHAT THE GATES CAUGHT AFTER THE DISTRICTS WERE DONE

### NOBODY HAD EVER MEASURED THE DEMO'S LOAD

`THE DEMO IS ITS OWN LINK` (8/25) makes the demo a **separate published build at a separate
url**, and says plainly that the workshop link is never given to a player. Every load number
this repo has produced was measured on the **workshop**: `time_to_play` opens
`BOHEMIA_ALPHA_0_9.html` three times and had never once opened the demo.

Measuring one surface and asserting the other matches is what **VERIFY ON THE REAL SURFACE**
exists to stop — and here it is a live risk, not a theoretical one, because the demo is **cut
by a tool**, and a cut can drop the progressive-loading wiring while dropping no visible
feature at all.

| surface | world | wait after the tap |
|---|---|---|
| workshop | 10.1s | 9.1s |
| **demo** (what a friend taps) | 10.5s | **9.0s** |

The wiring survived the cut. **But that was luck until something checked it.**

And the demo was a **stale cut** — `demo_build_gate` 24/1 on *"it is a CUT OF THE CURRENT
WORKSHOP, not a fork"*. It carried none of the day's city. Re-cut: **25/0**.

### I HAD TO FIX MY OWN NEW LEG TWICE, BOTH TIMES BECAUSE I TESTED IT

**First, I wrote it as a clock.** "The demo's wait must be within 3s of the workshop's." It
**failed its own mutation test**: stripping the warm-up out of the demo moved it 9.0s → 9.8s
— a full second of a stranger's patience — and the leg stayed green. Tightening the tolerance
is not the fix either: run-to-run noise here is a few tenths, so a threshold small enough to
catch one second is a threshold that goes red on nothing, and today already proved what a
crying-wolf gate costs.

> **The claim is "the cut kept the wiring", so check the wiring.** Pick the ruler from the
> shape of the claim, not from what is easy to measure.

**Second, the replacement was two legs that were one leg written twice.** I checked for the
late loader by name — and that name occurs **inside the warm-up block's own queue** (char
2780128, inside 2777786..2781610). Stripping the warm-up failed both legs for a single
reason.

> **Two checks that die together are one check.**

Replaced with the failure that can happen *separately*: a cut that keeps the block and
**empties the queue**, which looks identical from the outside. Both legs are now
mutation-tested **independently** — strip the block and only the block leg reds; empty the
queue and only the queue leg reds.

### THE BLOCKING CHUNK GATE EARNED ITS KEEP ON ITS FIRST DAY

Written this morning after a merge handed the world's one blocking file another lane's
4.35 MB hero bake, twice. On the very next rebase it happened **again**, and the gate went red
in **0.085s** — where the day before, noticing it cost a 43-second three-browser gate, or
shipped silently.

That is the whole argument for a cheap guard beside an expensive one: *a guard nobody can
afford to run before every push is a guard that runs after the damage.*

### AND THE STEP A NOTE COULD NOT ENFORCE IS NOW IN THE LOOP

"Run the chunker after every rebase" was a standing note in the handoff, followed correctly
all day, and it still shipped the slow load once — because the rebase that undid it happened
inside an **automated push loop**, where there is nobody to read a note. The loop now re-runs
the chunker **and** re-cuts the demo after any rebase, and refuses to push if the blocking
chunk is still fat.
