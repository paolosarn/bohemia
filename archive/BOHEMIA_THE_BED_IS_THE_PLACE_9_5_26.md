# THE BED IS THE PLACE (9/5/26, SOUNDS lane)

VAMILY line for this lane: **[district sound] BB-THE-BED-IS-THE-PLACE**. Its own
acceptance line is *"the bed varies by district on the walked surface"*, and the
row says it **rides behind BB-THE-CITY-SENDS-WHERE** — which shipped earlier this
round. Until the walked surface said where you were standing, the ambience bed
knew three facts about the world (day, night, indoors) and picked from the same
weighted list wherever you stood.

## THE AISLE

Schafer's **keynote sounds** are the background bed, named for the key of a piece
of music: *not listened to consciously, but they deeply imprint a sense of
place.* This game shipped only signals. This is its first keynote.

## THE HONEST WORRY, AND IT SHAPED THE WHOLE THING

The bed speaks once every 40 to 95 seconds. **A player crossing three districts
in ninety seconds hears ONE sound.** Re-weighting which sound that is would be a
change no human could perceive, and shipping it as "the district sounds
different" would be true in a table and false in a pair of ears.

So there are two levers, and the second is the one that matters:

1. **WHICH rare sound.** A generator belongs to a substation, a lit sign to the
   strip, a gust to open ground.
2. **HOW OFTEN THE BED SPEAKS AT ALL.** A lit block speaks every 25 to 60
   seconds. Open desert every 60 to 130. **The strip feels busy and the desert
   feels empty**, and that is a thing anybody can hear.

The gate holds the two claims **separately**, so nobody can claim this feature on
the half that cannot be heard.

## FOUR GROUPS, SEVENTY-NINE DISTRICTS, COUNTED NOT ASSUMED

Seventy-nine rules is not a mechanism, it is a table nobody can hold in their
head. Four is a thing you can hear.

    MACHINE  25   something here still runs, or ran      the generator leads
    LIT      19   the 12% with power, and the strip      a sign leads
    OPEN     18   desert, wash, freeway, water           the wind leads
    LIVED    17   people sleep here and it is quiet      mostly just the air

Counted against the game's own `DISTRICT` enum, because a table that only checks
itself will always agree with itself. Nothing ungrouped, nothing invented, no
district in two groups.

## GROUNDED IN THIS REPO, NOT IN TASTE

- **LIGHT=TERRITORY.** 12% of the valley has power, clustered and owned. A lit
  block is rare, and a rare thing audible from the next street is what makes it
  territory.
- **The lockdown finding**, already quoted in BB-A-LIT-BLOCK-HUMS: the 2020
  shutdowns cut human high-frequency ground noise by up to 50%, the largest drop
  ever recorded and largest in the *densest* cities, and signals previously
  buried became clearly audible. **Dead is not silent, dead is a different bed.**
  A working generator four blocks away in a dead valley is loud.

## MECHANISM MINE, CONTENTS HIS, AND THE ROW SAYS SO

> "MECHANISM-MINE / CONTENTS-PAOLO'S: **WHICH place sounds like WHAT is canon and
> is his.**"

The four groups and the numbers are **my attempt**, not his ruling, and they ship
rather than wait because EVERYTHING IS A THUMB (8/9): he meets them while playing
and corrects what he hates. The whole mapping is one table, published as
`window.__ambPlaces`, and moving a district from one group to another is one
word.

## TWO THINGS IT DELIBERATELY DOES NOT CHANGE

**An ungrouped place is exactly what it was yesterday.** If the report carries no
district — the run slice's own report does not — the bed uses the odds and the
gap he has been hearing since 8/12, untouched. Measured, not asserted: generator
12.5%, wind 25%, gap 40 to 95. **A new field must never change the thing it does
not describe.**

**And the four unapproved names keep their row.** The bed's existing list carries
`dog_far`, `dog_cry`, `dog_calls`, `neon_buzz`, `neon_hum` and `metal_ticks`,
none of them in the bank, all guarded so an unapproved name is skipped and the air
plays. A place-aware pick that simply returned early would **skip that list**, so
the day he approves a dog it would be silent everywhere — a new feature quietly
deleting an old wire, which is the exact shape this repo keeps finding. Each place
now carries a `dog` and a `metal` weight behind the same guard, costing nothing
until he says yes.

## THE GATE

`gates/bed_is_the_place_gate.py`, 20 claims, on the real surface.

    A  every place given identical odds and gaps  -> RED x4
    B  the city stops reporting its district      -> RED x2
    C  one district dropped from the table        -> RED (names it: apartment)
       restored                                      20 passed, 0 FAILED

**One instrument mistake, mine, and it is the two-documents one again.** The first
cut armed the message listener in the **shell** and then called `__ctWhere()` in
the **shell** too — but `__ctWhere` lives in the **city**, so nothing was ever
posted and the intercept came back empty on a build that was sending the field
perfectly. *The listener belongs where the message arrives and the trigger
belongs where it is sent.* Same shape as the `autoSave` probe on 8/29 that looked
for a run-slice function in the city frame.

**And a number I had wrong in my own docstring**: I wrote 78 districts twice. It
is 79. Counted and corrected in the tool, the gate and the shipped comment.

## REUSE CHECK

Cooks nothing. No bank, no candidate, no pixel, no new sound. It uses `air_day` /
`air_night` / `air_inside` (five of five thumbs up each, fifteen of fifteen),
`generator` (four of five) and `sign_alive`, all already approved and all already
in the bed's own pick list. `wind_gust` rides its approved sibling pool.

## WHAT HE WOULD NOTICE

Walk from the suburbs onto the strip and the valley starts talking to you more
often — a sign somewhere, a generator, closer together. Walk out into the desert
and it goes quiet for a minute at a time, and when it does speak it is the wind.

Tab: **RUN** (the walked city). Nothing to judge — no sound was cooked.
