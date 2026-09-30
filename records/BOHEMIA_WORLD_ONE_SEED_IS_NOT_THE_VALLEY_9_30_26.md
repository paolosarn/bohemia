# ONE SEED IS NOT THE VALLEY

WORLD lane (chat 02), 9/30/26. Row `[board terrains]`, rule 46.

---

## 0. THE JOB

Paolo, 9/29:

> think about all the assets you're gonna need for the combat board... no single
> combat map in Battle Brothers is exactly the same... different terrains, nature
> zones, tile blockers... let's just recreate Battle Brothers with our whole swag

And the correction that shapes the whole thing:

> **most fights are block wars** — most cells are CITY kinds, nature kinds are the
> edge.

The narrow job: **every map cell carries one terrain kind** from the fifteen in the
combat-board inventory. The kind is what COMBAT's board generator reads and what
COOK cooks assets for. It is **not** the board — the board is cut from the kind
plus the district's own layout, seeded, never the same twice, and that is COMBAT's.

---

## 1. **THE FINDING: ONE SEED IS NOT THE VALLEY**

I built the table against seed 1337. It came out at **75 districts and 9,216 of
9,216 cells mapped**. A clean sweep. Zero holes.

And it was wrong.

Rule 40(g) says the valley is **rolled per new game**. So the only honest
vocabulary is the one across many rolls. Ten seeds found three districts seed 1337
never places. A hundred seeds settle it:

| | districts |
|---|---|
| seed 1337 alone | 75 |
| **100 seeds** | **78** |

The three that hid: **`drivein`, `library`, `fort`**.

Each one would have been a cell a fight could start on **with no board under it**.
And that failure does not announce itself. It is not a crash on the first run. It
is the one player in twenty who taps the wrong block and falls through, in a game
where the whole point of the map is that no two valleys are the same.

They are mapped now — drive-in to the parking lot and big box, library to the
suburb block with the other civic buildings, fort to industrial because a
fortified compound is walls, yards and containers. **And the gate sweeps ten seeds
rather than one**, so the next district the generator learns to make is caught by
the machine instead of by him.

That is the thing worth carrying out of this round: *a green sweep over one seed is
not a measurement of a procedural world, it is a measurement of one instance of it.*

---

## 2. **TWO OF THE FIFTEEN ARE NOT MAP KINDS AT ALL**

The inventory lists fifteen kinds side by side as though the generator will hand
over cells for each. It will not, for two of them, and the reason is not an
oversight in the list — it is that they are different sorts of thing.

**T11 THE RUIN IS A CONDITION.** No district generates "ruin", and none can:
**act one *is* the ruin.** A burnt block is a *state* that a suburb or strip cell
is in, not a kind of ground the map makes. Quietly handing it a few cells would
have COOK building a fifteenth tileset that nothing would ever select. Named as
`CONDITION`, the right work is obvious instead: **scorched variants of T1 and T2.**

**T13 THE CASINO FLOOR IS AN INTERIOR.** You do not travel to a casino floor on the
map. You arrive at a strip cell and go *in*. The indoor fight already exists. Named
as `INTERIOR`, reached through a T2 cell, and the map never assigns it.

So **thirteen kinds come off the map; two come off what happens to it and what is
inside it.** The gate holds both at zero across every seed, forever — if either
ever gets cells, somebody has turned a state or a room into ground.

---

## 3. HIS PROPORTION, MEASURED

Across ten valleys, 92,160 cells:

**city 80.8% — nature 19.2%**

His ruling holds without anything being nudged to make it hold. On seed 1337:

| cells | kind |
|---|---|
| 2,980 | lot and big box |
| 2,667 | suburb block |
| 942 | freeway |
| 902 | hills |
| 611 | open desert |
| 311 | solar and pumps |
| 250 | the strip |
| 171 | golf and park |
| 142 | wash and shore |
| 126 | industrial |
| 95 | airport |
| 15 | trailer park |
| 4 | landfill |
| **0** | **ruin — a condition** |
| **0** | **casino floor — an interior** |

**The biggest kind of ground a gunfight starts on, by a mile, is the parking lot.**
That is not a design decision, it is what Las Vegas is, and it tells COOK exactly
where the first asset hours go.

---

## 4. THE COOK: THE FIFTEEN GROUNDS

`tools/bohemia_board_terrains_cook_9_30_26.js` →
`slices/vote/WORLD_FIFTEEN_GROUNDS.png`. VOTE tab, `world-fifteen-grounds-9-30`.

The whole valley painted by the kind of ground a fight would start on, **one pixel
per cell on the same 96×96 grid the game uses** — so what he is looking at *is* the
assignment, not a drawing of it. The tool refuses if its count and the module's
disagree.

Why the valley and not a swatch sheet: his ruling is a **proportion**, and a
proportion is the one thing a row of labelled squares cannot show. Painted on the
real map it is a single glance — the city is the middle, and the nature kinds
really are a rim around it.

**AH-01, and the wrong thing is what it is for.** A land-use map of Las Vegas is
the ordinary part; it is the thing a city planner would print and pin up. Every
colour on it is a kind of ground a gunfight starts on.

---

## 5. **THE FIRST PALETTE HAD SEVEN PAIRS THE EYE READS AS ONE COLOUR**

On a picture whose entire job is showing a proportion, that is the whole defect.

The two biggest kinds — **61% of the valley between them** — came out at hue 36
against hue 42 with a lightness gap of 0.027. Then the check I wrote found a worse
pair I could not see at all, because they are rarely next to each other:
**suburb block against open desert, hue gap 4, lightness gap 0.002.** Effectively
the same paint.

This is the **9/24 sand correction** again, generalised. That round found sand at
the same hue as the desert at twice the lightness, and the lesson written into that
tool was that *a hue check alone would have passed the version he rejected*. So the
rule here is a gap in **lightness or hue**, held for every pair of kinds that really
gets drawn — and `open_desert` keeps `#6e6045`, because that is the walked city's
own desert colour and this lane already fixed it once. Everything else moved around
it.

Closest surviving pair: lot-and-big-box against solar-and-pumps, lightness gap
0.057.

---

## 6. WHAT IS MINE AND WHAT IS NOT

**Mine:** which kind a cell is. That is a reading of the valley, and the valley
already decided it.

**Not mine, and it ships empty:** what a kind's board *looks* like. The blockers,
the mounds, the roofs, the spawn rules are COMBAT's and COOK's. `ASSETS` is empty,
asking answers `NO_RULING` and names whose it is, and the gate holds that the module
carries **no colour, no pixel and no size** — so nothing in it can quietly become
art direction.

**One data file** (MODS' line): `records/target/BOHEMIA_BOARD_TERRAINS.json`,
generated from the module, carrying the table, the census and the two
not-on-the-map declarations, so COMBAT and COOK read one count instead of
re-deriving two that can disagree.

---

## 7. ROUTED

- **COMBAT** `[board generator]` — the kind is the input. Thirteen real kinds, and
  the two that are not kinds are named so no generator waits on cells that are not
  coming.
- **COOK** `[board assets]` — the cell counts are the running order. The parking lot
  and the suburb block are 61% of every fight in the game; the landfill is four
  cells.
- **COMBAT / COOK** — `ruin` is scorched *variants* of the suburb and strip sets,
  not a tileset. `casino_floor` is the existing indoor fight, entered from a strip
  cell.
- **MODS** — the data file follows their line: one file, a `_readme`, generated,
  no code.

---

`[bb terrain]` **Battle Brothers picks a tileset from the world tile's terrain —
plains, steppe, forest, swamp, hills, mountains, snow, desert, beach — nine kinds,
and every one of them is nature.** It has no "parking lot". That is the whole
difference in one line: BB's board asks *what part of the wilderness is this*, and
ours asks *what part of the city is this*. **OUR TWIST, so nobody can call it a
rip-off** (rule 39b): BB's nine kinds are terrain and ours are **land use**. Its
terrain was there before anybody; ours was **built, and then abandoned**, which
means every one of our kinds carries a second fact BB's cannot — who put it there
and what it was for. A fight in a forest is a fight in a forest. A fight in a
Walmart parking lot is a fight somewhere a person used to park.
