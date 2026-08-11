# BOHEMIA ADDENDUM — ONE ZOOM, ALL THE WAY TO THE MOON (Paolo 8/12/26, LOCKED)

## HIS WORDS

> "in the run how do we combine the city builder map with the map in the phone. my
> original intention was that is was this zoom out vibe you could keep zooming out
> and zooming out until it showed the moon you know. that was my original
> philosophy and i want to stick with that thats my flavor."

## THIS EXTENDS 7/25 AND FINISHES ITS LAST LINE

`BOHEMIA_ADDENDUM_CITYBUILDER_TOP_DOWN_ONLY_7_25_26.md` already LOCKED the
continuum in his words: *"As you zoom out on your character then at some point it
organically becomes the city builder, and then if you keep zooming out you could
see the rest of the world"*, all of it *"on this diamond isometric 45 degree angle
view."*

Two of its three bands shipped that day. Its final line parked the third:

> STILL TO COME: the third zoom band (keep zooming out to see the rest of the
> world) — that touches the MAP surface (another lane), so coordinate, don't jam.

That coordination never happened, and the band sat unbuilt for eighteen days.
Nothing was blocking it but a note. **A [PENDING] that names no person and no
question is not a pending, it is a dropped stitch.**

## AND IT IS THE SPINE, NOT A FLOURISH

`BOHEMIA_ADDENDUM_ACT3_MOONSHOT_STRUCTURE_7_19_26.md`, LOCKED:

> "the generations are Animal / Human / Angel and the camera levels are street /
> city / planetary zoom. Act 3 was always Angel, always the planetary level."

and

> THE MOONSHOT IS ONE-WAY. The gen-3 (Angel) heir goes and does not come back.
> **The dynasty ends looking down at the planet.**

So the zoom axis and the generation axis are the same axis, and the furthest the
camera can pull back is the exact place the story ends. Pulling out to the moon on
day 1 is the whole game foreshadowed in a gesture. That is why this is canon and
not decoration.

## THE LAW

**1. THERE IS ONE CAMERA AND ONE ZOOM SCALAR.** Not a set of maps you switch
between. Every level is reachable from every other by continuing the same gesture,
and every level is reversible by reversing it. From his character's feet:

```
HUMAN  ->  CITY BUILDER  ->  REGION  ->  PLANET  ->  MOON
  ^                                                    |
  +--------- the same gesture, the other way ----------+
```

**2. NO BAND MAY BE A DEAD END.** A zoom that clamps is a wall, and a wall is the
thing this law exists to forbid. Both ends of every band hand off to the next one.
The failure this replaces was literally one line — `z = Math.max(zmin, ...)` — a
wall at the valley's edge that made the valley the whole world.

**3. THE DIAMOND HOLDS AS LONG AS THERE IS GROUND.** Human, city and REGION are all
the same isometric 45 projection; the valley in the REGION band is drawn by the
city builder's own `iso()`, not by a second renderer. His 7/25 "keep it all on this
diamond" is not negotiable while you are looking at the valley.

**4. ABOVE THE AIR, THE CAMERA IS PLANETARY, AND THAT IS ALREADY CANON.** The 45
DEGREE ART LAW governs objects in the world's three-quarter view. A planet seen
from space is not an object in the valley, and 7/19 already names this camera
separately ("street / city / **planetary** zoom"). PLANET and MOON are that level.

**5. THE PHONE'S MAP IS A DOOR, NOT A SECOND MAP.** "Combine" does not mean merge
the two renderers into one picture — a phone's map *should* look like a phone's
map, because it is a device someone is holding. They are combined by sharing the
**world** and the **camera**: the ONE MAP law (7/27) already made both surfaces read
the same world model; from now on tapping a cell on the phone moves the run's
camera to it. The phone is a way *into* the valley, not a picture *of* it.

**6. THE PHONE NEVER MOVES HIS BODY.** It moves the camera marker, exactly as
tapping a plot in the builder does. His feet stay where the world put them. (This
clause exists because on 8/11 moving the player away from his spawn silently broke
CITY TALK, whose cast is placed by neighbourhood — the same mistake must not come
back through a different door.)

## WHAT IS PLACEHOLDER, SAID OUT LOUD

The earth and the moon are drawn procedurally from the palette the city already
uses, and the screen says so in the corner: *"placeholder sky · art request
AR-005"*. No bank in this repository contains celestial art, because nobody has
ever cooked any — so it is REQUESTED (AR-005), not quietly invented. The MECHANISM
is the law; the pixels are the ART lane's, and they drop into two functions
(`skyDisc`, `renderSky`) when they land.

## THE MACHINE

`gates/onezoom_gate.js`, 16 assertions, driving the real camera in a real browser:
the chain is unbroken outward AND inward, every band actually paints, the pixels
**differ** band to band (a state machine that renders the same frame is not a
zoom), the REGION band still uses the city's own iso projection, and the phone's GO
moves the camera without moving his body.

Built by `tools/bohemia_city_onezoom_patch.py` + `tools/bohemia_phone_jump_patch.py`.
Record: `records/BOHEMIA_ONE_ZOOM_TO_THE_MOON_8_12_26.md`.
