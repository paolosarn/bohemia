# ADDENDUM: FAT AND TALL ON THE TILE (Paolo 8/15/26, LOCKED)

## HIS WORDS, on the whole batch of sixty district map icons

> "Somethings are still glitchy looking, but yeah, everything needs to be bigger
> and like whenever you start painting anything it should start like at the
> border of the actual tile itself like super important like I want these things
> to be bigger bigger and taller make the one stories look like two stories make
> the two stories look like three stories make the tallest buildings very tall
> you know like I don't know if you need to look up measurements online you
> might have already done that, but I know I definitely want everything to look
> just taller and wider on the tile itself like whenever you start making a
> building or painting one like it's border should be on the border of the tile.
> It should be that fat and big on the tile."

Plus `@VERDICT chapel YES` — the first YES the icon set has had.

## THE LAW

**Every building painted on a tile is FAT and TALL on that tile.**

1. **FAT — the border is on the border.** When you start painting a building,
   its footprint starts at the edge of the cell. Not a model standing politely
   on a tile: a block that *is* the tile.
2. **TALL — add a storey, then add more the taller it already is.** His three
   examples fix the curve exactly: one storey reads as two, two reads as three,
   and the tallest read as *very* tall.
3. This binds **every** lane that paints a building on a tile, not just the
   icon factory.

## WHY IT IS A CURVE AND NOT A MULTIPLIER

1→2 is ×2. 2→3 is ×1.5. That is a **falling** multiplier, so a single constant
would have *flattened* the very skyline he asked to exaggerate. The shape that
satisfies all three of his statements at once is **add a fixed storey, then
scale**:

```
z' = z × 1.25 + ONE_STOREY
```

| real subject | before | after | reads as |
|---|---|---|---|
| 1 storey | 2.9 | 6.4 | 2.3 storeys ✓ |
| 2 storeys | 5.5 | 9.6 | 3.5 storeys ✓ |
| 12 storeys | 33 | 44 | 16 storeys ✓ *very tall* |

**THE UNIT IS MEASURED, NOT GUESSED.** He said "I don't know if you need to look
up measurements online" — the number that actually mattered was already in our
own factory. A Summerlin house is authored at `2.9` units for its first storey
and `+2.6` for its second, so **one storey = 2.75 units**. Everything above is
expressed in that measured storey rather than in a figure copied off a website.

## WHAT IT SUPERSEDES

`records/BOHEMIA_VERDICT_ICONS_ALL_CBB_8_11_26.txt` recorded the frozen state as
*"each cropped to its own cell, none painting past its boundary."* That still
holds at the **cell** boundary — nothing paints into its neighbour — but the
polite setback **inside** the plate is now dead. NEWEST DATE WINS.

## HOW IT WAS BUILT: ONE TRANSFORM, NOT SIXTY EDITS

`_fat_and_tall(scene)` in `tools/bohemia_district_hero_factory.py`, applied to
every hero before the shared square is measured.

- The widening pushes outward from the **ground plate's** centre, so it moves
  toward the *cell* edges rather than away from wherever the art happens to sit,
  and it is **clamped at the plate edge** — his rule is the border lands *on* the
  border, never past it.
- **The ground is never lifted.** Anything at plate level stays at plate level,
  or the tile peels off its own cell and stops butting up against its neighbour.
- Sixty authored heroes cannot be re-proportioned by hand in a turn, and doing
  it by hand would also lose the real subjects they are matched to. A transform
  states the ruling once, applies it everywhere, and a gate can measure it.

**Ordering bug, caught before it shipped:** the transform was first placed
*after* the loop that measures the one shared square. The square is sized from
the set's own extents, so every hero would have grown straight off its own
frame. It now runs immediately after the ground plate is drawn.

## GATE

`gates/fat_and_tall_gate.js` — the storey curve satisfies all three of his
examples; the ground plate is never lifted; the widening is clamped to the cell;
and the factory applies it before the square is measured.
