# BOHEMIA — LEARNED RULES FROM PAOLO'S AUDIT (7/10/26)

## The directive (Paolo, memory-locked)
Paolo's item feedback = training data. Claude generalizes and propagates
automatically. He teaches once; Claude applies library-wide, forever.

## Rules extracted from the 90 verdicts (permanent)
1. **FENCE ≠ WALL** — fences (metal/iron/chain) are their own category.
2. **PATH tiles are DIRECTIONAL** — grass-stone paths read N-S (or E-W);
   direction is part of the tile's identity, like door facings.
3. **PLANTS ARE OVERLAYS** — vegetation sits ON a real ground texture, never
   baked into a fake grass square of its own.
4. **RUBBLE IS FLOOR OVERLAY** — debris reads as on-the-ground.
5. **ROCK ≠ DIRT** — texture identity over category convenience.
6. **ALPHA TILES VIOLATE THE LAWS** — lava tiles and purple glowing bricks
   live inside the alpha's baked categories. Purity applies to STRUCTURAL
   surfaces (walls/floors/roofs/doors); emissive PROPS (torches, fire barrels)
   are legal. Gate scoped accordingly.
7. **ITEMS are a real category** — hand objects (broom, crowbar, pickax, map,
   diamond, ingot, suitcase, coffee pot) don't belong in building categories.
   Concept group: propagates by suggestion only, Paolo's eye finalizes.
8. **STREET SIGNS**: stop signs / triangle signs belong to a street-sign
   family (wall-signs vs standing-signs distinction noted).
9. **SHOW IT BIG** — several verdicts were "too tiny to tell." All future
   interactives show tiles large / tap-to-zoom. (memory-locked)
10. **Fountain-scale objects are MULTICELL** (A69) — big props span cells.
11. **Delete junk glyphs** — tiles that are just a number/letter graphic die.

## What was executed (same turn)
- Scoped purity sweep of alpha structural categories: 1,387 gate-suspects
  recorded (alpha_struct_violations) — suspects, not auto-kills (gate over-
  fires on warm rust; Paolo-exemplar matching is the trusted detector).
- Exemplar propagation with per-group thresholds, one group per tile:
  AUTO-APPLY tier 591 corrections (lava 6, purple-brick 24, fence 17, bones 11,
  rubble 72, path 181, plants 280); SUGGEST tier 2,947 (items+signs).
- Raw 90 verdicts saved verbatim in the verdicts file (permanent training set).

## New categories proposed (one-tap approval pending Paolo)
fence (exists — gets the moved tiles), path (NEW), item (NEW), street_sign (NEW)
