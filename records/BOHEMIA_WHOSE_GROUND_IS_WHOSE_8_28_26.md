# WHOSE GROUND IS WHOSE

**8/28/26 — FACTIONS lane. The missing half of a bearing.**

## THE HOLE

Yesterday the OUTFIT board learned to say **COLORFUL, NORTHWEST, A LONG WAY
OFF**, and what they want, and what they pay. That is a bearing, and a bearing
is the right shape for a thing a person carries in their head.

**But a remembered compass word is not navigation across twenty-nine cells.**

The open-world research's working middle — *see something in the distance,
travel toward it, spot the next thing from the new vantage point* — **assumes
you can see it.** In a top-down valley 3,712 tiles wide you cannot. Close the
board and you have nothing.

And the game already had the surface that answers it.

**MEASURED: `renderCity()` did not call `ctBases()` once.** Every `ctBases()`
call in the file sat in the faction code between lines 43160 and 44166. You
could open the map of the entire valley and nothing on it said that anybody held
any of it.

### WHICH CONTRADICTS THIS GAME'S OWN CANON

- **LIGHT = TERRITORY**
- **CLUSTERED POWER** — 12% lit, *owned*, the network eerily perfect
- **NOBODY PATROLS THE DARK**

Territory in Bohemia is a thing you can *see*, by construction. The map was the
one place that never admitted it.

## WHAT IT IS NOT

**MAP LAW: nothing is placed here.** Every position drawn is one
`bohemia_loop.boot()` decided and the city baked. If a base moves tomorrow the
map follows without a line changing.

**And it is not a HUD pin.** It does not follow the player, it is not on the
walking screen, and it points at no quest. It is a map you *choose to open*,
showing a fact that is true whether or not you are looking. That is the
distinction the research draws between signposting and waypoint-marker design,
and it is the same one the board already respects.

## IT COMPOSES WITH THIS MORNING'S GUARD FOR FREE

The map asks `ctBases()`, which now knows when the world has been rerolled out
from under the bake. So after a reroll it draws **nothing**, rather than
confidently painting the last valley's borders over this one.

One organ, one answer. This feature got that for free by asking the same
question everything else asks.

## TWO DEFECTS THAT WERE CORRECT IN THE SOURCE AND WRONG IN THE RENDER

### 1. THE MARKERS WERE SIZED IN TILES

At the ⤢ WHOLE MAP zoom the whole 96×96 valley fits on a phone, so **`TW` is
3.74 pixels** — measured on the real canvas. Every marker was a four-pixel
smudge on the one screen a person opens to plan a walk.

It read perfectly well in the source. Found by screenshotting it. Sizes are
clamped in **screen** pixels now: legible zoomed all the way out, growing with
the tiles as you zoom in.

**VERIFY ON THE REAL SURFACE.**

### 2. TWO LABELS LANDED ON TOP OF EACH OTHER

CUSTOM and COLORFUL are nine cells apart, about twenty pixels at that zoom, and
CUSTOM's plate painted straight over the front of COLORFUL's name. Both labels
were "drawn". One was unreadable.

Labels nudge upward now, with a leader line back to the ground they name.

## WHAT IT LOOKS LIKE — **RUN TAB**, then **⤢ WHOLE MAP**

Every outfit's ground is marked. Yours reads differently from theirs. Your
ground and the nearest one are named even zoomed all the way out; the rest name
themselves as you zoom in, because fourteen labels on a 350px diamond is a wall
of text.

## GATE

`gates/faction_between_gate.js` — **88 claims, 0 failed** (was 81). Part M is
new, and **every claim in it reads pixels off the real canvas.** This is drawn
art on a surface, so a source check is a lie.

| mutation | went red |
|---|---|
| tile-sized markers | M2 |
| the map stops consulting `ctBases()` | M1, M2, M3, M5 |
| the label collision avoidance removed | M5 |

## AND TWO OF MY OWN CLAIMS WERE DECORATION UNTIL MUTATION PROVED IT

Both are worth writing down because pixel-counting claims are *especially* good
at looking rigorous while proving nothing.

**M2** asserted the markers are screen-sized — by checking they were **painted**,
which is exactly what M1 already says. Reverting to tile-sized left it green:
the marker was still painted, just four pixels of smudge, and *present* is not
the property that matters. It counts **area** now, against a floor that was
measured rather than picked:

| | min px per marker | avg | max |
|---|---|---|---|
| screen-sized (shipped) | **24** | 31 | 44 |
| tile-sized (the bug) | **11** | 15 | 25 |

Twenty sits between the two minima with margin on both sides.

**M5** asserted no label is buried under another — by counting text-coloured
pixels in a band above each marker. Removing the collision avoidance entirely
left it green, because the band is 90px wide and **the neighbour's label is the
same colour**, so one label's pixels were being counted as the other's. It was
measuring "is there any label near here", which both the fixed and the broken
render satisfy.

The only thing that can answer it is what the render says it **drew**, so
`renderCity` publishes its label boxes — `window.__GROUNDLABELS`, the same idiom
it already uses for `window.__LAMPQ` — and the claim checks them for overlap
directly.

**A claim that cannot fail is not a claim.**

## WHAT COMES AFTER

Unchanged, and still not mine to decide. 837 people stand within six cells of
the spawn and not one runs with anybody; the nearest base is 29 cells.

The board makes the system **findable**, gives a **reason** to go, and the map
now shows **where**. None of that makes it **near**.

1. **The spawn and the bases come from two systems that have never heard of each
   other.** `bohemia_loop.boot()` returns `factionBases` and no player position
   at all, so reconciling them means *deciding* placement.
2. **Or the dials move**: `AFFILIATED_RATE` (0.30), `REACH_CELLS` (12), both
   `[PENDING Paolo]`.
3. **Or outfits get people who travel.** Needs a new dial, so it needs a ruling.
