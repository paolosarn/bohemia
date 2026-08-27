# THE DEAD VALLEY WAS STILL GREEN, AND IT HAD BEEN FIXED THREE TIMES ALREADY
# 8/27/26, WORLD lane. Found by looking at one photograph of a level crossing.

## THE COLOUR

`#3a4520` is an olive green. It was the palette entry for tiles named, in their own
legends:

> dead brush &nbsp;·&nbsp; dead tree &nbsp;·&nbsp; weed / brush &nbsp;·&nbsp; windbreak tree
> &nbsp;·&nbsp; dead landscaping &nbsp;·&nbsp; dead lawn &nbsp;·&nbsp; outfield (dead turf)
> &nbsp;·&nbsp; dead field turf &nbsp;·&nbsp; field (dead turf) &nbsp;·&nbsp; green (putting surface)

in a game whose entire first act is a valley where the irrigation died thirty years ago.
On a real frame it reads as a healthy shrub. **The name was a promise and the pixel did
not keep it.**

## IT HAD ALREADY BEEN FIXED THREE TIMES, ONE FILE AT A TIME

| when | where | what the comment says |
|---|---|---|
| earlier | `bohemia_strip.js` | picked `#4d4a38`, a grey brown, and was simply right |
| 8/23 | `bohemia_jail.js` | "CODE 3 WAS GREEN AND CODE 3 IS DEAD BRUSH" |
| 8/26 | `bohemia_arterial.js` | "THE DEAD PALM WAS GREEN, AND ACT ONE HAS NOTHING GREEN IN IT" |

Read the 8/26 one again. It **names the strip as already having the answer** and calls out
that "two modules that deliberately share one code vocabulary were painting it two different
colours." The author knew it was a CLASS of bug, wrote that down, and still changed one file.

Three fixes, three post-mortems, eighteen modules still green. **A LAW WITHOUT A MACHINE
GATE IS NOT ENFORCED**, and this law had three post-mortems and no gate.

## THE MEASUREMENT

One frame at a rail crossing, before and after, counting pixels where green leads:

| | green pixels |
|---|---|
| before | **25,024** of 1,316,640 |
| after | **1,980** |

92% gone. What is left is paint on abandoned cars.

## WHAT WAS SWEPT — 26 TILES, 24 MODULES

- **dead wood, brush, weed, palm, landscaping** → `#4d4a38`, the strip's grey brown, already
  shipped and already re-derived twice. 15 modules.
- **dead lawns** (campus quad, fire station, school) → `#524b38`. A dead lawn is straw.
- **dead turf plates** — ballpark outfield, stadium field, school field, the golf putting
  surface — → bleached straw, **luminance held and hue rotated out of green** so the
  composition of each district is unchanged and only the colour is.
- **dead planters** at the swap meet and the truck stop → `#605844`.

## WHAT STAYS GREEN, AND EVERY REASON IS WRITTEN DOWN

Living green is not banned in this valley. **A LIVING PLANT is.**

- **CREEK GRASS AT THE MORMON FORT.** Authored canon: *"the last grass in the valley, along
  the creek, because the spring never stopped."* The fort is there BECAUSE the spring is
  there. It is the one deliberate living plant in Act One and it carries the reason a city
  exists here at all. Untouched.
- **CREOSOTE AND DESERT SHRUB.** *Larrea tridentata* is the dominant plant of the Mojave and
  it is on nobody's irrigation. REALISM FIRST: the open desert is not watered by the city, so
  it is not killed by the city. Kept alive, muted to real dusty olive rather than lawn.
- **WATER CHEMISTRY.** Sulfate turquoise in the gypsum pit water, dyed glycol under a
  datafort cooling unit, algae in the basin trickle that runs even when it has not rained.
  Each of those act1 texts already says outright that it is the only colour on its site.
- **PAINT AND FABRIC.** A faded green 1930s Arts District storefront, teal awnings, a teal
  gym block. Paint does not need water.
- **EXIT MARKERS.** The crypt and garage entrances, drawn the colour every exit sign on earth
  is drawn.

## THE GATE — `gates/dead_valley_gate.js`, 10 checks

- **A. VEGETATION BY NAME** — resolve every palette entry to its legend; if the tile is a
  plant it may not be a living green (hue 65–175 at saturation ≥ 0.15).
- **B. ANY VIVID GREEN NEEDS A WRITTEN REASON** — the backstop, because check A is blind to
  tiles with **no legend at all**, which is exactly what the crypt and garage entrance
  markers are.
- **C. THE WALKED SURFACE** — the alpha inlines a copy of every engine module. A colour fixed
  in `engine/` and never resynced is a colour Paolo still sees.
- **D. MUTATION TEST** — put `#3a4520` back on dead brush in memory and the checker must go
  red. A negative result is a claim about your instrument until you have shown the instrument
  could have seen a positive one.

## THE GATE FOUND SIX MODULES MY OWN HAND SCAN HAD MISSED

I swept by hand first with a crude channel filter, `g > r + 8 and g > b + 8`. `#49512e` —
the dead lawn under three separate districts — is r73 g81 b46. **g − r is exactly 8.** It
fell one point outside my threshold, three times, and I would have shipped it.

The gate uses hue and saturation, which is what "green" actually means, and it caught all
six on the first run: campus quad, fire station lawn, school field, desert creosote, mountain
shrub, water-district brush.

**The instrument was the broken part. Again.**

## AND TWO OF THE GATE'S OWN DRAFTS WERE WRONG, BOTH WRITTEN INTO IT

1. **IT DIED SILENTLY.** Some engine modules run a self-test on `require`, and one of them
   calls `process.exit`. The first draft printed its own heading, then a quest gate's 29
   lines, then stopped — **exit code 0, no findings, and it would have read as a pass.** A
   checker another module can kill is not a checker. Requires now run with the console muted
   and exit disarmed.
2. **IT WENT RED ON PROSE.** Check C matched the bare literal and flagged four hits that were
   all COMMENTS — the strip's, the jail's 8/23 and the arterial's 8/26 post-mortems for this
   very bug, inlined along with their modules. It matches a quoted palette value now.
   **A checker that cannot tell a mention from a use is the broken one** (8/1 law, and this
   is the second time it has applied this month).

## THE LESSON

**A FIX THAT IS NOT A SWEEP IS A FIX THAT WILL BE MADE AGAIN.** Three sessions found this
bug, three wrote it up properly, and none of them asked the only question that ends it:
*how many other files say the same thing?* The answer was eighteen, and it takes one command
to count.

When a post-mortem says the words "two modules that share one code vocabulary", the work is
not done until the sweep has run and the gate exists.
