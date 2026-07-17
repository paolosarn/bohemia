# BOHEMIA ADDENDUM: WHAT ONE GRID CELL MEANS
7/3/26. Paolo's directive for the next build: think through the grid
before building it. This is the design brief, grounded in the locked
addenda (I MOVE YOU MOVE time model, WORLD MODEL LOD, CITYBUILDER MODEL,
CAMERA TIMESTEP FUSED). Engineering facts are stated; every fork that
needs taste is tagged [PENDING, Paolo's call].

## THE ONE SENTENCE
A grid cell is the atom of POSITION, OWNERSHIP, and CHANGE: the player
moves cell to cell (grid position is the only thing that waits for the
player), every tile is a cell, every persistent world change (the
Mayor-consequence system) keys "layer:x,y" to a cell, and the fold
serializes cells. Animation, ragdolls, and the dial never touch the grid
clock; they live on the 120 BPM real-time clock. Two clocks, one map.

## CELL SIZE, the engineering read
The character is 56px art. Stardew's read: the character stands ONE tile
wide, roughly two tall. The natural cell is therefore 32px of world
(character occupies 1x1 cells footprint-wise, drawn 56px tall overlapping
the cell above, classic top-down overdraw) OR 56px cells (character fits
one cell whole). 32px cells give finer building placement and denser city
texture per screen; 56px cells make sprite==tile trivial but the city
reads coarse. RECOMMENDATION on the numbers: 28px cells (exactly half the
sprite, integer-clean with 56 art, integer-clean at Scale2x 2x = 56
screen px, and the two-scale camera law gets clean 1x/2x/4x steps).
[PENDING, Paolo's call: 28 vs 32 vs 56.]

## MOVEMENT, what the clips already give us
walk and run are 2-beat cycles at 120 BPM (1 second per cycle). One cell
per HALF-CYCLE (one footfall per cell, 0.5s walk step) reads naturally
and quantizes to the beat grid by construction. Run = one cell per
quarter-cycle (0.25s per cell, double speed, same law). The I MOVE YOU
MOVE scheduler advances the world one tick per PLAYER CELL ENTERED, while
the clip plays continuously between cells (animation never stops). The
gait never foot-slides if cell traversal time equals the footfall
interval, which the numbers above guarantee. Diagonals: a diagonal step
is 1.41x the distance; either forbid diagonals (pure 4-way, chunky) or
allow 8-way with 1.41x traversal time (the clips already face all 8).
[PENDING, Paolo's call: 4-way vs 8-way movement.]

## THE TILE REPLACEMENT SYSTEM
Three layers per cell, bottom up: GROUND (terrain, walkable flags),
STRUCTURE (buildings, walls, cover objects, the citybuilder writes here),
DECAL (blood, scorch, corpse-persist, the consequence system writes
here). A tile replacement = writing a cell in a layer + a dirty-rect
redraw of that cell only. The persistent-consequence store already keys
changes as "layer:x,y", so the replacement system IS the runtime face of
that store: boot = worldgen paints the base, then the recorded changes
replay on top, deterministic. Corpses from combat land as DECAL entries
(recorded:true, gunfire is loud), which makes bodies persistent world
memory the Amalgamation can read, exactly the two-ledger design.

## CHUNKING + LOD (the numbers that matter)
Cells group into 16x16 chunks. A chunk renders to ONE cached canvas;
scrolling blits chunks, never per-tile draws (the frame budget math from
the perf addendum: per-tile draws die on iPhone, chunk blits are free).
Zoomed-out city view renders chunks at 1/4 scale from the same caches,
and the two-scale camera law (big steps skip small things) means the far
view never even queries the DECAL layer. Dirty chunks re-render on tile
replacement, one chunk per change, memory-flat.

## WHAT BUILDS FIRST (next build's concrete first step)
A GRID TAB in the alpha: a 24x16 test field of ground tiles, the player
character walking cell to cell with the real walk/run clips on the real
clocks, tap-to-move, one togglable wall type to prove tile replacement
and walkability. No city systems, no save, just the atom proven: grid
position waits, animation never stops, tiles replace, chunks redraw.
Everything above it (citybuilder, consequences, LOD) already has its
contract written.

---

## 7/3/26 WRAP ADDITION: COVER-TO-COVER MOVEMENT (Paolo's thinking, PENDING, not locked)
Paolo's session-end design direction for grid combat movement, structured
from his words, every fork tagged:

**THE COVER CRAWL.** Behind or beneath or beside a long cover object (a
counter, a wall run), you are NOT at risk, and you can spend ONE MOVE to
slide from one covered grid cell to another covered cell along it.
Position changes, exposure does not. This makes long cover a lateral
highway: work the counter's length to change your angle without ever
eating a shot. [PENDING Paolo: whether the slide is limited to adjacent
cells or any connected covered cell.]

**POPPING OUT = THE EXISTING POP, POINTED.** Leaving cover deliberately
follows the same pop mechanics that already exist (the green window, the
exposure trade), but translated into MOVEMENT: you pop in a direction,
and the direction is the anti-flank tool. Getting flanked is the
punishment for standing still; popping toward the flanker is the answer.

**WALK vs RUN, the real-world math.** The grid brief's beat law: walking
is one cell per footfall, 0.5s per cell at 120 BPM. A real human walking
step is ~0.75m at ~1.4 m/s, so ONE CELL is approximately 0.75 METERS of
world. Real running is ~3 to 5 m/s with a ~1.5 to 2m stride: almost
exactly DOUBLE the ground per step at double-time cadence. So the honest
run mechanic is: RUN COVERS TWO CELLS PER MOVE where walk covers one,
and the run clip's cycle already runs double-time on the same beat grid.
The realism and the beat math agree, which is why it feels right.
[PENDING Paolo: whether running costs exposure, noise on the recorded
ledger, or aim penalty on arrival, all three are real-world honest.]
