# A THIRD OF THE DAM WAS WATER YOU COULD STAND ON
# LIFE + CITY, 9/27/26, row [honest grid] — rule 34(b), and the gate it was owed
# ONE KIND IN 1,171 CELLS WAS MISSING FROM ONE TABLE, AND IT COST 5,863 CELLS OF RESERVOIR

---

## 1. THE ROW, AND WHY THIS LANE TOOK IT INSTEAD OF CONTINUING ITS CLAIM

Paolo 9/27, rule 34, LOCKED: *"one house doesn't equal one tile, it's all fucked up."*
`laws/BOHEMIA_LAW_TWO_SCALES_ONE_GAME_9_27_26.md` s2: **THE GRID IS HONEST** — every cell
is FLOOR, WALL, DOOR, COVER or PROP and the drawing agrees with it cell for cell.

Rule 5 says a claimed job means continue it. `[three cities]` stays CLAIMED and is **parked
behind its own measurement, not abandoned**: its look half shipped and is in the VOTE tab,
and its wiring half needs an act value that does not exist anywhere in the world, measured
twice. Rule 34 then superseded the tile law this lane's whole ground rested on, and 34(e)
puts `[honest grid]` **first** in his own order. Drawing three acts on a grid that is about
to be rebuilt cell by cell would be drawing the wrong ground three times. Claimed and
pushed before the work (c3b028d8), as rule 5 requires.

## 2. THE PREMISE IN THE ROW WAS HALF WRONG, AND MEASURING SAID SO

The row reads *"the block generator emits CELLS (floor, wall, door, cover, prop), never a
picture over cells."* Measured before building anything:

**IT ALREADY EMITS CELLS.** Every district legend gives each code a `kind`, and one table —
`KIND_LAYER` in the district kit — turns that kind into `{layer, solid}`. The walked
surface asks `solidAt()`, which asks `tileLayer()`, which reads that table. **One source of
truth, already wired.** There is no picture-over-cells to fix.

Two other things measured along the way, both killed before they became findings:

- `kind:'garage'` and `kind:'crypt'` looked like unknown cell kinds in a grep. They are
  **return-object types** (what a generated building IS), not legend cells. Checked, not
  assumed.
- `move`, `outcome`, `wait`, `choice`, `site`, `scav` are loop and scheduler words, not
  cell kinds.

## 3. WHAT WAS ACTUALLY WRONG, AND IT IS ONE WORD

`tileLayer()` falls back to `{layer:'ground', solid:false}` for a kind the table has never
heard of. **The fallback is silent.** A typo or a new word does not fail; it becomes
ordinary walkable floor.

Swept every registered district:

    DISTRICTS                        72
    LEGEND ENTRIES                1,171
    DISTINCT KINDS IN USE             19
    KINDS THE TABLE DID NOT KNOW       1     <-- `water`

Three entries carried it: the dam's **reservoir**, the dam's **tailrace**, the fort's
**creek**. On generated blocks:

    dam   128x128    reservoir 3,977 + tailrace 1,352 = 5,329 cells   32.5% OF THE BLOCK
    fort  128x128    creek                               534 cells     3.3%
    TOTAL                                               5,863 cells of standable water

**A THIRD OF THE DAM BLOCK WAS WATER A BODY COULD STAND ON.**

## 4. AND IT IS FAIR TO THE AUTHOR, WHICH IS WHY THE FIX IS SHAPED LIKE THIS

All three entries declare `solid: false`. **That is true and it is half the answer**: a
lake does not stop you. There was no way in the vocabulary to say the other half, that
nothing walks into it. The author said the half they could say.

The other half already exists in the same file. The kit declared a **third state** on 8/20
for the quarry lip, the intake shaft and the crusted pond:

> solid NO — it does not stop you. A hole cannot block anything.
> walkable NO — pathing refuses it. You do not stroll into a shaft by accident.
> **DECLARED, NEVER DERIVED.**

Deep water is the same shape as a crust that will not hold you, one substance over. So:

1. **`water` is now a KNOWN kind** in `KIND_LAYER`, with values **byte-identical to the
   fallback those three were already getting**. That change is provably inert, and that is
   the point: the fix is not the line, it is that the kind is now known so the gate can
   refuse the next one.
2. **The three deep cells declare `'void': true`** on the entries themselves, because a
   void is declared, never derived.

**AND THE OTHER 20 WATER CELLS WERE ALREADY RIGHT AND ARE UNTOUCHED.** A drained pool, a
dry font, a dry fountain basin, seepage, a coolant leak, a low-flow trickle — those are
genuinely floor and stay floor. A fix that drowned every empty fountain would be worse than
the bug, so the gate checks that leg too.

## 5. THE CONTRADICTION THE SWEEP ALSO SURFACED

Two live files disagree about the same substance, which the truth hierarchy calls a bug,
not an interpretation:

    water:0   'open water'    solid TRUE     -- you bounce off it like a wall
    intake:8  'lake water'    solid false    -- you stroll across it

Not touched this round: both are `water-dead`, neither is a silent fallback, and picking
between them is a ruling about what water DOES, not about whether a cell has a class.
Named here and on the board so it is not lost.

## 6. THE GATE, AND IT BITES

`gates/every_cell_has_a_class_gate.js`, in the suite as **EVERY CELL CLASS**.

**IT READS THE TABLE, IT DOES NOT KEEP A COPY.** My first scratch sweep hardcoded the list
of legal kinds, and it kept reporting `water` as unknown *after* I had fixed it — the exact
"a checker holding its own copy of a rule" trap this lane warned about one round earlier,
caught on myself within the hour. The gate requires `KIND_LAYER` out of the kit and
**refuses rather than passing vacuously** if that export ever disappears.

    on clean main, before the fix     8 ok, 4 FAILED
    with the fix                     12 ok, 0 failed
    MUTATION: an invented kind (`lagoon`) is detected, and the gate proves the danger by
              showing it resolves to walkable floor

Nothing else moved. Run before and after, identical both ways:

    OCCUPANCY 16/0 · DISTRICT KIT 24/0 · LANDLOCKED 16/0 · INTERIOR GROUND 21/0
    HAZARD 70 pass / 4 fail — the SAME four, byte for byte, on clean main. NOT MINE.

Engine files changed, so the derived city slice was resynced with the repo's own tool in
the same commit (duty 8). It also picked up two modules other lanes had left stale.

## 7. THE COOK (rule 22), AND IT IS THE FINDING ITSELF

`slices/vote/LIFECITY_THE_WATER_YOU_COULD_STAND_ON_9_27.png`, in the **VOTE tab**.

Rule 32(f), *show it from the game's camera*: the dam block off **its own generator**, one
fixed seed, every cell coloured by one question — may a body stand here. Nothing
illustrated. Top panel is what the game believed before this round; bottom is after.

    BEFORE  standable  14,141  (86.3%)   of which WATER 5,329  (32.5%)
    AFTER   standable   8,812  (53.8%)   void (water)   5,329
            solid       2,243 in BOTH — nothing moved, only what you may do

**THE ANALOG HORROR LINE** (rule 30): the wrong thing is not a monster, it is **a surface
that agrees with you**. Bible rule 1 is an ordinary frame with one thing wrong, and a
reservoir you can walk out onto is exactly that — it looks like water, the game says
pavement, and nothing warns you. It shipped, and it was green.

Two defects found by looking at the picture, both mine, both the same shape: the caption
strings **collided**, then **ran off the right edge**, because I sized text by eye twice.
The factory now measures the label and refuses to write a picture with its own title cut in
half. A label that does not fit its band is the same defect as a cell that does not match
its drawing, one layer out.

## 8. WHAT IS NOT DONE ON THIS ROW

- **Every floor region connects to the street**, for every district. This lane proved it
  for the suburb (1,857 doorstep cells, 0 sealed, gate NO YARD IS SEALED 13/0). Rule 34(b)
  wants it everywhere, and making 5,863 cells unwalkable is exactly the kind of change that
  should be re-checked against it. Next round's first job.
- **A press into a wall is never a dead pad** — the third leg of 34(b).
- **[PENDING Paolo]** what deep water DOES. A void means you do not walk in and you can be
  put in. Whether being put in a reservoir is survivable, and whether anything swims, is a
  ruling about the game, not a mechanism. Nothing waits on it: the cells are honest either
  way.
