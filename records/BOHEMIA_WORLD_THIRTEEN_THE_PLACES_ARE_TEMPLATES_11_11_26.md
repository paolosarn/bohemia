# WORLD THIRTEEN, ROUND FOUR, STEP TWO: THE PLACES ARE TEMPLATES (11/11/26)

VAMILY rules 429(a)(c)(f), 430; ask lines 504, 506, 507. BUILD 11/11b - THE PLACES ARE TEMPLATES. VOTE
world13-the-places-are-templates-11-11 (stand_in).

The coordinator 11/11: '(2) the templates and the 20+ seeds, so it holds on a generated world.' Rule 429(f): the board layouts are
templates the generator places, every rule checked over many seeds. Rule 430: every asset of the 15 boards kept and used; only the
layout, the placement and the rules change.

## 1. MEASURED FIRST (22 valleys)

Every one of the 15 place kinds lands on every valley, but broken up: the suburbs in 464 to 528 lumps (a mile street every few
blocks), the desert in 252 to 305, the golf courses and parks in 22 to 49 (biggest 2 to 9 blocks), the lab, Red Rock and the
landfill once each (1 to 4 blocks). A board is 20 x 15 fight tiles of 12 m; a map block 3 x 3 of them; so a board stands on
7 x 5 blocks.

## 2. THE TEMPLATES

- `records/target/bb/place_templates.json`, a modder's file: for each of the 15 places its board, its kinds (the fight's own
  place_boards districts, word for word), how many a valley (per_valley), the fewest blocks of its kinds under a footprint
  (min_cells), the least distance between two (spacing), mirrored or not, and the Strip's slack.
- `placeTemplates` in engine/bohemia_overmap.js (`__THE_PLACES_ARE_TEMPLATES__`, numbers synced word for word by
  tools/bohemia_world_thirteen_place_templates_sync.js): rarest place first, every 7 x 5 footprint scored by the blocks of its kinds
  it covers (a summed-area table, 16 ms a valley), the best that keeps its spacing stands, up to per_valley; ties by the valley's
  own hash. Every block of its kinds under it is a CELL: the board, and the three by three of its tiles over that block. A pure
  function of the finished valley: no roll moves; buildOvermap answers m.templates and m.templateAt(x, y) when asked, never at a
  boot that does not ask. The map page carries the whole generator (re-inlined) and `vbTemplatesValley()` / `vbTemplateAt(x, y)`
  stand them on the live valley, re-read when a kind changes or a home base lays its square (no cell under a town's square).
- THE STRIP: a narrow north-south stripe always fell in the same two columns of its board, so two of its twelve blocks were never
  under a cell; its slack (4) lets any footprint within four blocks of the best stand, the hash picking, and over 22 valleys every
  block of every board is used (rule 430).
- Per valley: the suburbs 4, the works 3, the desert 3, the trailer park 2 to 3, the pass 2, the wash 1 to 2, the golf course 1 to
  2, one each of the Strip, downtown, the airport, the marina, the shore, the landfill, the lab yard and Red Rock. 589 on 22 valleys.

## 3. GATE

NEW gates/the_places_are_templates_gate.js 11/0: T1 a template for every place board, its kinds the fight's; T2 the generator
carries the file, the page the whole generator; T3 all 15 places on every one of 22 valleys, within per_valley and min_cells;
T4 every cell a block of its kinds, none two places', every cell's tiles on the board, spacing kept; T5 every one of the 180 blocks
of the 15 boards under a cell somewhere; T6 deterministic, no roll moved; T7 planted 4/4 red; P1 the map page on a phone upright and
on its side: 15 of 15 places on the live valley (27 in all, 7 ms), 0 cells under the 13 home bases' squares, 442 of 442 cells
answered with their board and tiles; P2 nothing threw. Also green: the_valley_has_its_zones 9/0 (Z5: the whole generator in the
page), map_joins 23/0.

## 4. NEXT

(3) THE CUT: a fight that starts on a template's cell is fought on that place's board, the cell under the spot it starts (the map
page sends the cell with the fight: cityHandOver; the fight stands the board: COMBAT THREE through the seam); the painter writes the
board's layout into the map at its cells so the map and the fight show the same place.

[bb] Battle Brothers stands its locations by type and terrain on every new world; ours stands each hand-made place board where its
kind of place lands on every generated valley.
[analog horror] the same trailer park in every valley you start, the same three trailers by the same burned one, as if remembered.
