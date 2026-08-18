# THE STRIP WAS NEVER BUILT (8/18/26, WORLD lane)

**212 cells of the most famous street on earth generated nothing, and the reason was one
sentence in a comment that everybody obeyed and nobody re-read.**

---

## WHAT THE COMMENT SAID

`engine/bohemia_world.js`, written 7/18:

> GAMING & RESORT is BESPOKE (Paolo 7/18): casinos/resorts get individual hand-crafted
> love, NOT the auto-factory. No DISTGEN entry — they stay landmark placeholders until
> built by hand.

That is a correct ruling. It says *don't run these through the generic factory*. Every
session after it read the first half — "no DISTGEN entry" — and stopped. So for a month:

| type | cells in the seed valley | what generated |
|---|---|---|
| `resort` | **118** | nothing |
| `strip` | **81** | nothing |
| `casino` | **5** | nothing |
| named landmarks (highroller, sphere, luxor, strat, sign, springs) | 8 | nothing |

**212 cells.** They fell through to the placeholder path in the city renderer — the branch
that literally reads `const noStreets=(d==='resort'||d==='mall'||d==='casino')` and drops
one flat coloured box on the tile. That is the flat diamond on the map. That is why hero
art for the Strip was impossible: **the hero factory reads a district's own palette off its
engine module, and there was no module.**

`strip` was worse than the other two, because it was half-wired in a way that hid it.
`strip` has been in **ROADSET** since the overmap was written — every district beside it has
always correctly treated it as the street it fronts onto, so the neighbours all looked
right — and it has been in **SURFACEGEN** never. A road every other cell believes in, that
draws nothing.

---

## WHAT SHIPPED

Three modules, each researched off real Las Vegas, each a **different building** from the
other two. That difference is the whole point: three gaming types that all came out as the
same tan box was the failure mode.

### 1. `engine/bohemia_resort.js` — THE STRIP MEGA-RESORT
Podium + tower, off Encore/Wynn, Paris Las Vegas and Circa site plans. A four-storey
**podium** carrying the casino floor wall-to-wall on the plot; the **guest tower** standing
on it and owning the silhouette; a **porte cochere** you walk and drive UNDER into the
lobby; an open-deck **parking garage** on one end; a dry **pool basin** behind, screened by
the building. Three enterable volumes.

### 2. `engine/bohemia_strip.js` — LAS VEGAS BOULEVARD ITSELF
A **surface**, not a lot — a network tile like the arterial. Off the RTC of Southern Nevada
revitalisation record, Clark County Public Works and the FHWA Las Vegas Pedestrian Safety
Project:
* **eight lanes** divided by a wide **landscaped palm median** (the county lifted the palms
  out during construction and re-planted them — the median is not decoration, it is the
  street);
* the walk is a **promenade at the back of curb**, no amenity strip, no buffer — the exact
  opposite of the valley arterial, which detaches its sidewalk;
* **no block wall, ever**: a tract wall backs an arterial, a resort podium fronts this;
* and the signature of the corridor, the **enclosed pedestrian bridges** over the boulevard
  on their stair/escalator towers. Layer OVERHEAD: you walk across them and you pass under
  them.

Registered twice — `strip` (the run) and `strip_x` (the crossing, which carries the
bridges) — for the same reason the arterial was split on 8/11: a run and a crossing are two
different things and the ICON LAW needs two icons.

### 3. `engine/bohemia_casino.js` — THE DOWNTOWN CASINO
Fremont Street, and deliberately the **opposite** of the Strip resort. **No setback at all**
— the casino floor meets the sidewalk on a block platted before anybody parked a car. The
mass is **low and wide** with a slender **hotel wing** on the back, never a podium and
tower. **The frontage is sign**: marquee towers floor to roof and a neon canopy over the
pavement, because downtown sold itself with light rather than architecture. The car is
banished to a **self-park deck on the alley** and a short **valet lane** off the side
street.

---

## FOUR THINGS THIS TURN GOT WRONG FIRST AND MEASURED SECOND

Every one of these was invisible until something was rendered and looked at.

1. **ONE MASS, ONE FOOTPRINT.** `K.footprints()` takes connected components, so asking it
   for *(podium OR tower OR garage)* in one pass returned **one bounding box swallowing the
   whole plot** — and under INTERIOR-MATCHES-EXTERIOR that would have built a single 84 x 49 m
   interior instead of three real volumes. Each mass now carries its own roof code so the
   roof never cuts its body in half. Resort: 3 buildings. Casino: 5.

2. **A STREET THAT DEAD-ENDS INSIDE A BLOCK.** The registered `strip` accepts the caller's
   mask so the boulevard turns with the cell — but a caller passing `{streets:['S']}` means
   "there is a road on my south side", and taking that literally left **the northern 30
   tiles of every cell as bare dirt with a hard line across it.** Exactly the defect the
   arterial spent 7/26 fixing. A mask that names one end of an axis now gets the other end
   too: it still turns, it just never stops halfway.

3. **THE ROOF WAS A BLANK SLAB, AND THEN IT STILL WAS.** The first pass drew the podium as
   one flat plate — the "they all look exactly the same" Paolo has been calling out. The fix
   was a roof plant field with skylights punched over the casino floor. The fix **did not
   work**, because it ran *before* the tower and the garage were drawn and they painted over
   two thirds of it. Only the strip of podium west of the tower survived. Found on the grid
   sheet, not by reading the code.

4. **SEVENTY-EIGHT PEDESTRIAN BRIDGES IN A ROW.** Paolo, 8/16, about the freeway: *"you
   gotta recognize when the freeway is two grids wide two tiles wide that it has to **work
   together**."* It is the identical defect here and I walked straight into it. **The Strip
   runs TWO CELLS ABREAST for its whole length**, so every one of its 81 cells has a road
   neighbour on all four sides — its continuation ahead and behind, and *its own sibling
   half to the side*. Keyed off "is there a road next to me", **78 of the 81 built a full
   signalised junction**: seventy-eight sets of crosswalks, signal masts and pedestrian
   bridges in an unbroken row down Las Vegas Boulevard. Measured, not imagined.

   The module cannot see the map, so the caller now tells it three different things and
   never confuses them:
   * `streets` — the axis it **runs** on, from `roadAxis()`, which measures **run length**.
     The same machinery the freeway ribbon already uses. Not from adjacency.
   * `cross` — roads that are **not this boulevard**. Only these make a crossing.
   * `spanThrough` — my sibling half has the crossing, so its **bridge keeps going across
     me**, and the stair towers stay on the half that owns them. A bridge over an eight-lane
     boulevard does not stop halfway. *That* is the halves working together.

5. **A CACHE THAT NEVER EXPIRES IS A LIE.** `tools/bohemia_district_grid_sheet.py` loaded
   its dump with `if not os.path.exists(DUMP)`. I changed three engine modules, re-ran it,
   and got a **byte-identical sheet back with a cheerful success line.** That is the "a tool
   that silently no-ops is worse than one that fails" failure this repo keeps paying for,
   and it nearly cost this whole verification pass. It now regenerates whenever any engine
   module is newer than the dump.

---

## AND TWO THINGS IN THE RENDERER

* **A ROAD WITH ITS OWN MODULE DRAWS ITSELF.** The city page drew every road from a
  parametric table of four numbers — lanes, median, side, colour. Four numbers cannot say
  *palm median*, *promenade at the back of curb*, or *enclosed pedestrian bridge over eight
  lanes*. `strip` cells now route through the same district-kit path every district uses.
  Arterial, freeway, rail and interchange are untouched.

* **AN OVERHEAD IS A THING, NOT A HOLE.** The kit render branch drew every canopy, deck and
  bridge span as `slotGround(d)` — the district's bare **dirt** — so from above a truck-stop
  canopy and a bridge over a boulevard both read as a patch of desert laid across whatever
  they cover. From a ¾ camera the overhead is the thing you SEE and the ground under it is
  the thing you do not. It draws its own colour now, and stays walkable, which is the whole
  point of the layer.

---

## WHAT IS STILL NOT DONE

* **The hero icons for these three.** The factory can build them now — it reads each
  district's own palette live — and it could not before, because there was no palette. That
  is the next thing.
* **The eight named landmarks** (highroller, sphere, luxor, strat, sign, springs). Still
  nothing. They are single cells and they are IDENTITY, so what each one *is* stays Paolo's.
* **Freeway art.** Frozen this session on its second rejection, per STOP PRODUCING.
