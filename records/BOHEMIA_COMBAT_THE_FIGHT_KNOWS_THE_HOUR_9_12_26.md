# V207 — THE FIGHT KNOWS WHAT TIME IT IS (COMBAT lane)

VAMILY job: **[loot kept]**, third of three. `BB-THE-FIGHT-KNOWS-THE-DAY`, the
**inbound** half of the pipe V206 opened outbound.

> *"EVERY PIPE FINDING IN THIS STUDY SO FAR HAS BEEN OUTBOUND. THIS IS THE FIRST
> INBOUND ONE: NOTHING GOES IN EITHER... THE DESERT IS THE SETTING OF THIS WHOLE
> GAME AND THE FIGHT TAKES PLACE IN A CLIMATE-CONTROLLED ROOM."*

Tab: **COMBAT** — the fight says what it is standing in, on the bell.

---

## WHAT WENT IN BEFORE THIS

`enter(G,d,env)` received the player's HP, a roster, a package id and a stamina
max. **No hour. No weather. No shade.** And the first thing it did was
`cleanSlate(G)` — *"nothing from the last fight survives."*

Meanwhile the walked city organises its entire day around the heat: outdoor labour
runs early because of the afternoon, every person carries a `heatTol`, and the
valley has weather, wet ground that dries out, a sun with a bearing, and shadows
painted on the ground.

**RE-MEASURED 9/12 AND STILL TRUE,** which is why this row was four days old. The
positive control in the original record still holds and it nearly fooled me too:
the word `heat` appears **42 times** in the decoded fight and **every one is muzzle
heat** (shots stacking inside 2.5 seconds) or a car cooking off. Not one is
temperature.

## EVERY NUMBER IS THE CITY'S OWN, AND THAT IS THE WHOLE DISCIPLINE

| what | where it comes from |
|---|---|
| the clock | `T.min`, `T.day` — the city's own minute clock |
| night | `isNight()` — the city's own function |
| the weather | `BohemiaWeather.at(seed, day, t)` — sunny / cloudy / rain, and raining now |
| wet ground | `BohemiaWeather.wetness(...)`, which the city already dries out |
| the heat window | **`BohemiaPopulation.HEAT_FROM` / `HEAT_TO`, read off the module, not copied** |
| shade | `sunVec()` plus **the same cell test that paints the shadows** |

**THE HEAT WINDOW IS READ AND NOT COPIED ON PURPOSE.** 11:00 to 16:00 is the window
every person's `heatTol` is already judged against. A second copy of those two
numbers is a second truth, and it drifts the first time either one moves. The gate
asserts the payload's window **equals the population module's exported constants**,
so a future copy-paste goes red.

**AND SHADE MEANS THE SHADOW HE CAN SEE.** It walks back along the sun direction and
asks whether a solid cell is close enough for its shadow to reach you — the same
test `shadowPass` uses to paint them. Two separate rules for one shadow would
disagree the first time either moved.

## THERE IS NO TEMPERATURE IN DEGREES, ON PURPOSE

Nothing in this repo holds one. *"Summer 40C+ afternoons"* is a sentence in a
comment, and the heat is a **window**, not a reading. `MECHANISM-MINE /
CONTENTS-PAOLO'S`: putting `41C` in a patch tool is authoring the climate of his
valley. The field is there and it is `null`, and the gate holds it `null`.

## WHAT SHIPPED

| | |
|---|---|
| the stamp | one place: every entry already comes through the same door, so all four carry it |
| the ride | its own message ahead of the encounter, so the shared engine contract is untouched |
| the keep | `G.world` survives `cleanSlate` the same way the room does |
| the line | the fight says what it is standing in, once, on the bell |
| the echo | it goes back out with the result, so a quest can see the fight knew |
| tools/bohemia_fight_knows_the_day_patch.py | replayable, MARK `__FIGHT_KNOWS_DAY__` |
| gates/fight_knows_day_gate.js | **11 pass / 0 fail**, suite-registered as **FIGHT KNOWS DAY** |

**IT IS STAMPED ONCE BECAUSE OF V205.** All four ways into a fight — a street bump,
a crew closing on you, a road party and a door into a room — already go through one
door, so the hour rides with every one of them without four copies of anything, and
an entry built after this gets it without knowing it exists.

**AND IT RIDES AS ITS OWN MESSAGE, WHICH IS V200's PATTERN AND ITS REASON IS GOOD:**
the handoff core is a **shared engine module**, and a new field in its contract
would make this an engine change instead of a combat one.

## MEASURED AT TWO DIFFERENT HOURS, BECAUSE A PAYLOAD THAT IS RIGHT ONCE CAN BE A CONSTANT

```
  13:00  clock 13:00   night false   in the heat true    shade false (open ground)
  23:00  clock 23:00   night true    in the heat false   shade true  (the sun is down)
  the heat window      [660, 960]  ==  BohemiaPopulation [660, 960]
  degrees              null
```

**AND THE SHADE GENUINELY VARIES BY PLACE, which is the proof it is not a
decoration:** the same 13:00 reads **shade** at a sample point beside a building
and **open ground** where the fight actually started. It is sampled at the
encounter's own `at`, so it answers for where the fight is, not where the camera is.

**MUTATION-PROVED:** delete the stamp → **5 arms red** (the wire, the fight at both
hours, the echo). Replace the heat window with a local copy that disagrees → **1
arm red**, naming it.

## `NO DAMAGE BEFORE THE DIAL`

**The fight now knows the hour and does nothing with it, and that is the row rather
than a shortfall.** The row asks for the payload to carry the world. What heat
*does* to a fight is a damage dial this lane is not allowed to touch. So it is
carried, said once, and echoed out — and nothing reads it to move a number. The
gate checks that too.

## THE ROW IS CLOSED

All three findings on that one message are in: the takings come out (V206), the keys
can be routed and the city sees your hand (V206), and the world goes in (V207).
