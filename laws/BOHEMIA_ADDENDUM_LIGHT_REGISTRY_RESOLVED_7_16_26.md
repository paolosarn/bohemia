# BOHEMIA ADDENDUM — LIGHT REGISTRY RESOLVED (7/16/26)

## THE GRID QUESTION WAS ALREADY ANSWERED

The act-1 grid-power ruling has been sitting on the "on the horizon" list. It
does not need to be asked. Two laws Paolo already locked answer it between them:

- **DARK LAMP CANON (7/14 MEGA):** dark lamp variants approved. Act-1 default
  state is DARK. The lit sprite IS the powered state.
- **CLUSTERED POWER LAW (7/14):** ~12% of feeder circuits alive, owned, never
  alternating. Light = territory.

So "are act-1 street lights on?" was never a yes/no about lamps. It is a
question about **circuits**, and the circuit law already answers it. A lamp does
not know whether it is lit. It asks the grid.

`type: electric_PENDING` is **retired**. Every electric row is now:

```
default_state: "dark"      // act-1 dead state canon
powered_by:    "circuit"   // CLUSTERED POWER LAW decides
```

Default with no grid loaded is DARK, always. A lamp lighting up is a claim about
who owns that block.

## THE MODULE — `bohemia_light_registry.js` (BOH_LIGHTREG)

The emitter choke point. Nothing hands an emitter to `BOH_LIGHT` except this.
Same shape as the other resolvers: tilepool answers WHICH TILE, prop_scale
answers HOW BIG, lightreg answers **IS IT LIT AND HOW FAR**.

```
BOH_LIGHTREG.normalize(reg)             -> {sources, radius_classes, report}
BOH_LIGHTREG.indexOf(sources)           -> {source_id: row}
BOH_LIGHTREG.resolve(props, ix, power)  -> {emitters, states}
```

`power` is `BOH_POWERGRID.powerMap(...)` or null. **Null means nothing electric
is lit.** Dark is not a fallback, it is the default.

`resolve` returns two things per prop:
- **emitters** — straight into `BOH_LIGHT.setEmitters()`, the whole-frame
  multiply pass. No per-sprite tint. Light philosophy unchanged.
- **states** — `{lit, sprite:'lit'|'dark', owner}`. The `owner` is stamped from
  the live circuit, so **light = territory** reads directly out of the resolve.
  A lit block tells you whose block it is without a single UI element.

## 16 CORRECTIONS APPLIED

Every one is the old registry disagreeing with a law it quoted in its own note.
No new judgement was introduced.

| what | why |
|---|---|
| `p_camp_firewood_stack_21` emitter stripped, r=0, flicker=0, becomes `fuel` `lights_when: ignited` | UNLIT FUEL NO FLICKER (7/14). A woodpile is not on fire. Fire is a state change. |
| `p_light_flare_road_05` reclassed `electric -> fire`, r 5 -> 4 | A road flare is pyrotechnic combustion. It is not on the grid, and it does not care whether the grid exists. |
| 9 lamps/signals: flat `r=12` -> `r=8` | residential class. Cane posts and ped signals are short poles. |
| `p_street_traffic_light_tall_16`: `r=12` -> `r=15` | highway mast class. |
| `p_light_floodlight_02`: `r=5` -> `r=12` | arterial class. |
| 3 item lights: `r=4` -> `r=3` | item_light class. The registry's own `radius_classes` said 3; the rows said 4. |

Radius is now derived from **pole family**, not stamped. Illuminated width ~=
pole height (real spec, meter-grounded 7/14). Height is a physical fact about
the sprite, so the resolver reads it off the sprite family, not off placement.
Placement stays out of my lane.

**Gate: `lightreg_gate.js`, 25/25 passing.** Covers: unlit fuel silent, ignited
fuel emits at fire radius, no `PENDING` types survive, every electric defaults
dark, per-class radii, fire barrels lit with no grid, beacons battery-lit with
no grid, live circuit -> lit sprite + owner stamp, dead circuit -> dark and
silent, determinism, and normalize purity (source registry untouched).

## OPEN FLAGS — [PENDING, Paolo's call]

Both are color calls, so I did not touch them.

1. **`i_survival_flashlight_36`** is typed `fire`, emits campfire orange
   `255,150,60`, and flickers at `0.22` like an open flame. A battery torch is
   not combustion. It should not breathe. Physically it wants a cool white, near
   zero wobble, and probably a cone rather than a disc.
2. **`p_light_siren_blue_01`** emits `255,120,60`. So does the red siren, the
   floodlight, and the warning strobe. One placeholder color got smeared across
   four different lights, and the blue siren currently glows orange.

## FILES

- `bohemia_light_registry.js` — `e87de82ceba5931ce9a92e69d0b3ad8b`
- `BOHEMIA_ACT1_LIGHT_SOURCES_v5_7_16_26.txt` — `15217da4cb3422104b3780dcbf4a55d0`, 47 rows: 26 fire, 18 electric, 2 beacon, 1 fuel
