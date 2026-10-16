# THE BORDERS WERE PAINTING THE STREETS
FACTIONS lane · THE FIVE MINUTES (rule 14), round three · 9/13/26

## THE ONE LINE
Paolo: *"the streets don't look like streets."* This lane draws every faction
border along a road — because `[who holds]` deliberately put them there — and at
full weight that is a bright green, red and blue stripe painted down the middle of
every street in the valley. They are drawn faint now. The roads read as roads and
the territory is still there.

## WHAT WAS MEASURED, AND IT TOOK THREE GOES TO BE SURE
`[same lender]` is still **CLAIMED AND HELD** under 14b. The round went on the five
minutes, and the handoff named the map as the next thing nobody had asked about.

**FIRST: on foot, this lane paints nothing.** Borders 0, tracks 0, lights 0 on the
walked street. His street complaint is not this lane's layers.

**And the first version of that probe said the opposite** — 14 borders and 163
lights on a sidewalk. `__TURF_INK` and `__GRID_DRAWN` are published by the map pass
and never cleared, so reading them after a street draw reports **the last map
draw**. Cleared before every draw, the real answer appeared.

**SECOND: in CITY, the same frame rendered four ways** — everything, borders off,
lights off, neither. With the lights off the map is still a lattice of colour; with
the borders off the road grid appears. **The borders were the noise. The lights were
never the problem.**

**THIRD, AND THIS IS THE PART WORTH KEEPING: I DOUBTED THAT AND THE DOUBT WAS
WRONG.** A later frame came back in daylight with red roofs and no visible borders
at all, so I assumed the dark neon frame had been a half-loaded screen, and I
**reverted the change**. Then I tested the assumption instead of trusting it: all
520 tile chunks are loaded at three seconds and the frame is unchanged at twenty-
eight. The dark view is the real, finished CITY view; the daylight one was a
different zoom tier reached by forcing the mode instead of pressing the chip.

The measurement was right, my second-guess was wrong, and the only reason I know
which is which is that I checked rather than picked.

## THE CHANGE
    alpha   0.62 -> 0.26 on other people's ground, 0.9 -> 0.55 on your own
    width   up to 3 px -> up to 1.5 px, and 4 -> 2 for yours

**The hue is untouched, and so is `__holderInk`**, which the tracks share and a gate
pins. Only the shout comes down. Yours stays brighter than theirs, which was always
deliberate: *that one is mine* is the first thing anybody looks for.

Proved with the one comparison that is not an opinion: **one session, one camera,
one clock, the border weight the only thing that moved**, loud then quiet then loud
again.

## GATES
`faction_towns_gate` 203/0. Two new claims pin the two things that must not come
back: the shout on somebody else's ground, and a line thick enough to be the
street's paint. Neither touches the hue, which is his.

## RULE 14, OBSERVED
No demo cut, no alpha touched, no build stamp. The change is in the city file,
which both surfaces load by reference. Third round running.

## [PENDING Paolo] — NOTHING NEW
