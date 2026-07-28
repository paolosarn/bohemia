# ONE VEGAS — the run and the city were two different cities (7/28/26)

> "for the run I still wanna start off in a suburb that you choose the location
>  for in Vegas and I want that reflected when I'm in the city menu the UI is all
>  fucked up... I just want you to incorporate all of these things together like
>  that's what the run is supposed to be and you're making it difficult"
> — Paolo, 7/28

He was not asking for a feature. He was describing two worlds, and he was right.

---

## THE MEASUREMENT

| surface | how it builds the valley | overmap seed |
|---|---|---|
| the game (run, phone map) | `BohemiaLoop.buildRealWorldMap('bohemia')` → `World.world(hashSeed('bohemia'))` | **2691674296** |
| the city builder frame | `let seed=2026, om=OM.buildOvermap(seed)` | **2026** |

Read off both surfaces at once, at the same coordinate:

    overmap cell 12,4  is  SUBURB    in the run  (it is where the run spawned him)
    overmap cell 12,4  is  ARTERIAL  in the city builder

Same coordinates, same generator, two different cities. **Nothing could be
"reflected in the city menu" because the city menu was not the same place.**

## IT IS A LOCKED LAW, BROKEN IN A THIRD PLACE

`laws/BOHEMIA_ADDENDUM_ONE_MAP_7_27_26.md` (Paolo 7/27, LOCKED):

> "There is ONE valley map. ... A player who opens the phone in the run and a
>  player who opens the builder are looking at the SAME PLACE. If those two can
>  drift — different seed, different district, different anything — the map is
>  decoration, not information."

That law's own write-up names the previous instance: *"the MAP tab sat on the
literal seed 1337 for months while the game booted the text seed 'bohemia'"*.
The MAP tab was fixed. **The city builder was never checked**, and had been on
2026 the entire time.

## AND THE REASON HE IS LOOKING AT THE CITY UI AT ALL

Another session, the same day, in response to a different request of his
("Can you put the city in the run tab?"), wired:

```js
var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;
```

Tapping RUN opens the CITY panel. That is why his message is about the city's UI
being outdated and about travel zooming out — he taps RUN and gets the builder.
**Not reversed here**: it is his own instruction to that lane. Recorded so the
two asks can be reconciled by him rather than fought over by two sessions.

---

## WHAT SHIPPED

**1. ONE SEED** — `tools/bohemia_one_seed_patch.py`. The builder takes the seed
from the game's own hash of the game's own seed text, inlined verbatim from
`bohemia_engine.js`, so a copy-paste cannot drift it again. Verified: cell 12,4
now reports `suburb` on both surfaces.

**2. THE CITY OPENS WHERE YOU ARE** — `tools/bohemia_run_city_sync_patch.py`.
The only run→shell traffic was `citySendPlayer()`, which sends his *sprite* and
not one byte of position; the city opened on the Strip every time because nothing
had ever told it otherwise. Now: the run posts `BOHEMIA_RUN_WHERE` from
`loadCell` (so it fires on boot **and** on every edge crossing — exactly when his
location really changes), the shell remembers it, and the city camera goes there
on open. Verified: header reads **SUBURB**, camera on his cell.

**3. A HOME THAT WAS CHOSEN** — he said *"a suburb that YOU choose the location
for"*. The old rule was "first suburb cell in scan order", which is
deterministic and MAP-LAW-clean and is also, mathematically, **always the cell
nearest the top-left corner of the valley** — the rim. Open the city on it and
half the screen is the blue nothing outside the map. It is scored now: the most
DIFFERENT KINDS OF PLACE within a short walk, minus a penalty for map edge.
Picked **cell 39,23 — 23 district types within 6 cells, zero edge**. Nothing is
placed or invented; the generator built the valley and this reads it and picks a
doorstep.

## THREE BUGS I CAUSED AND CAUGHT BEFORE HE DID

- **The scoring loop would have taken minutes to boot on his phone.**
  `WORLD.tile()` REALIZES the 128×128 district it lands in; scoring every suburb
  over a 13×13 window would have generated a large part of the valley before the
  first frame. `WORLD.at()` is the overmap rung — the district of a cell, no
  realization. Boot is **1087 ms**.
- **The run's message log killed the run.** `window.__RUN_SENT = []` is declared
  at the bottom of the file while `bridgePost` is hoisted, so the first
  boot-time caller found it undefined and took the whole script down. The log is
  a gate affordance; it must never break the game it watches.
- **A stale probe reported a false negative.** My first sync probe timed out on a
  hidden `#runFrame` and I nearly called the bridge broken — the frame was hidden
  because the RUN tab routes to the city panel now.

## TWO GATES THAT ONLY PASSED BECAUSE OF WHICH CITY WAS LOADED

Pointing the builder at the real world made both fail immediately. Neither was a
defect in the game:

- `banks_used_gate.js` (mine) reported his 13 border walls as never drawn. They
  draw **207** times. It sampled five spots near the front door and the wall is
  twenty tiles away on this block. It sweeps the whole cell now and stands
  beside every tile code that owns art.
- `wallheight_gate.js` (the city lane's) could not find a wall to measure. It
  took the **first suburb in scan order** and committed to it — the identical
  "first in scan order is always the rim" bug as the spawn. It searches for a
  suburb that actually has a facade now.

**The old seed was hiding fragility in two separate gates.** That is worth more
than the fix itself.
