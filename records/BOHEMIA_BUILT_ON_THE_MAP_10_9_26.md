# BUILT ON THE MAP: THE MAP OWNS THE BUILD LOTS
# LIFE + CITY, 10/9/26, row [built on the map] (rule 40b: on the map, on the board, in the derived future)

## THE GAP [build on the screen] LEFT
The settlement screen kept its own ledger per place: the map's century ledger (the one the derive reads for
acts 2 and 3) never heard a build, the map drew nothing at the base, and pay landed in the screen's purse.

## NOW (tools/bohemia_city_built_patch.py, idempotent, marked; the screen side in
## tools/bohemia_settlement_build_patch.py)
- engine/bohemia_homebases.js and engine/bohemia_lotbuild.js inlined into the map page.
- LOT_BOOK on the map, one site per place; lotBookFor(name) hands the settlement screen the SAME object
  (same origin, window.parent), so there is one truth. The screen only starts a build (its battery syncs back
  on its post, as every act there does); it no longer ticks or saves when it lives inside the game.
- THE MORNING: the day loop's own wake beat (DAY.on('wake')) ticks every site with the map's purse, the map's
  century ledger (centuryGet) and the map's day; whose ground is the map's answer (your outfit's base).
- THE SAVE: citySnapshot() carries `lots` beside `century`; applyRestore() brings them back (LOT_BOOK is
  var-hoisted so a restore that runs first is not wiped).
- THE MAP: what stands is drawn on the base's WEST side (the party's flag is on the east), from the same cut
  sprites the screen stands on its lots, at the map people's scale; going up is faint. MAP_DREW.baseAt records
  where each base sits on the glass for probes.
- Both city patches now rewrite their marked blocks IN PLACE: cut-and-reinsert made the living map's gate crowd
  and this block swap places on every run.

## MEASURED ON THE ALPHA (gates/built_on_the_map_gate.js, suite BUILT ON THE MAP, 12/0)
Your base is Custom. Wall and tank start for one battery each, the Mob's place refuses NOT_HELD; after the
game's own SLEEP and wake both stand, **the map's century ledger 0 -> 2**, the tank's water **0 -> 1** in the
map's purse, 2 drawn at the base; the snapshot holds 2 lots and a restore brings 2 back standing; MUTATION: an
empty book's morning finishes nothing. BUILD ON THE SCREEN still 15/0 (the page alone keeps its own).

## THE COOK
slices/vote/LIFECITY_BUILT_ON_THE_MAP_10_9.png: two crops of the alpha's own map at your base, the same camera
after the morning, the left with the base's lot book emptied for one render (as it was), the right as it is.

## FOUND, NOT MINE
The wake card's button ('#daycardIn .dcgo') is gone; the gate and the cook fall back to DAY.wake() and say so
in code. Same cause as faction_towns_gate's and parties_move_gate's throws.
