# D1 SWEPT THE WHOLE REGISTRY -- "NEVER ON THE SIDEWALK, ANYWHERE" (8/3/26, RUN lane)

Paolo 7/31, LOCKED, his caps: **"houses or buildings should NEVER SIT ON THE SIDEWALK
EVER ANYWHERE IN THE WORLD."** `laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md` clause D1.

It was true in ONE district out of forty, and the reason was an ADDRESS, not a design:
`layWalks()` lived PRIVATE inside `engine/bohemia_suburb.js`, unexported, so no other
generator could lay a sidewalk even if it wanted to. 33 of 40 buildable districts have
no `kind:'walk'` legend row at all -- no code, no palette swatch, nothing for the dossier
or the CITY renderer to draw.

## WHAT SHIPPED

1. **The primitive is shared now.** `K.streetCodes` / `K.layWalks` / `K.canPlaceMass` /
   `K.D1_EXEMPT` live in `engine/bohemia_district_kit.js`. The suburb's own copy is
   deleted and it calls the kit one (ENGINE SYNC LAW: one canonical body).
2. **PROVED IT MOVES NOTHING.** 36 suburb blocks (6 seeds x 6 street configs),
   589,824 cells, generated against `HEAD` and against the promoted primitive:
   **0 differing blocks, identical md5 `5c584f8aa55016c8d32e1fbf51b41a91`.**
3. **The public street is DECLARED, never guessed.** A legend `kind:'drive'` row that
   says `street:true` is a public right-of-way and wears a walk. The suburb's code 1
   (road) declares it; code 3 (the driveway apron) deliberately does not, because D1's
   own text lets the apron cross the walk. Without that declaration the only rule you
   could write FAILS THE SUBURB, the one district that is correct, on 1,928 legal
   garage-to-apron adjacencies. Default is false: a district that declares nothing is
   unchanged and ungated.
4. **`gates/d1_kerb_gate.js`, registered in the suite.** Sweeps `K.types()` -- 36
   non-exempt districts -- never one module. Three assertions, all on the WORLD MODEL,
   never a renderer: ORDER (no generator write puts mass over walk), GEOMETRY (no mass
   cell orthogonally adjacent to a `street:true` tile), COVERAGE (no bare ground at a
   declared kerb). Reading today: **0 on the kerb, 0 bare frontage, 46 assertions green.**
   EXEMPT list is his, verbatim ("OK, freeways and railyards do not get sidewalks"), and
   the gate never widens it.

## THE RATCHET, AND WHY IT IS NOT A RUBBER STAMP

Six districts write mass over their own walk code TODAY, and did long before this gate
existed. They all have the SAME defect, and their own legend text says it out loud:
**one code doing double duty -- the public walk AND the thing the building stands on.**

| district | code | legend name | its own act1 |
|---|---|---|---|
| library | 13 | `terrace / walk` | "the raised concrete **terrace the whole building sits on**, and the walks across it" |
| cityhall | 13 | `walk / podium` | "the raised concrete **podium the building stands on** and the walks across it" |
| courthouse | 13 | `walk` | the setback walks, built across |
| chapel | 12 | `churchyard walk` | the entrance **arcade columns** stand on it (32,94 .. 96,96) |
| commercial | -- | -- | the same shape, smaller (834) |
| downtown | -- | -- | the same shape, smaller (108) |

A plinth, a podium and an arcade footing are not sidewalks, and a portico standing on
paving is architecture, not the defect he described. But splitting one code into two is
a CLASSIFICATION RULING, and rulings are his. So each of the six carries a CEILING
measured 8/3/26 -- library 23514, courthouse 14382, cityhall 13266, commercial 834,
downtown 108, chapel 60 -- that can only ever go DOWN. **The list is CLOSED**: the gate
fails if a seventh district is added to it and fails if any ceiling is raised. Every
other district reads zero and stays zero.

Registering the gate red instead would have blocked every other lane from shipping, and
the thing blocking it is one word from Paolo.

## WHAT IS STILL OPEN, NAMED HONESTLY

- **[PENDING, Paolo's call]** Is a civic terrace / podium / arcade base a SIDEWALK, or
  the PLINTH the building stands on? One ruling clears all six ratcheted districts.
- **[PENDING, Paolo's call]** 23,256 of 89,136 non-exempt cells are STORAGE -- unit rows
  fronting their own aisle wall-to-wall, which is the density reference he blessed under
  WALKABLE-LAND. Same shape: industrial dock doors on a truck court (8,070), solar
  switchgear on a gravel road (7,968), stadium facade on a parking field (6,452), campus
  (3,432), ballpark (2,568), landfill haul road (2,448). Is a private aisle / truck court
  / parking field "a street a person walks beside"? Until he rules, those districts
  declare no `street:true` and the gate correctly says nothing about them.
- **LAYOUT, not plumbing (MAP LAW):** mall's ring road is drawn on top of both anchors
  (4,344 kerb cells) and trailer's lot stride puts a row on its own entrance spine
  (1,984). Both need authored coordinates moved, which is deciding where a road goes.
- **The other 33 districts still have no sidewalk to build off.** The primitive now
  exists for them; each district's own lane opts in with a legend row, a palette row and
  a `street:true` declaration, then re-runs `walkable_gate` (a walk counts as FILLER, so
  content% falls) and its drive-network gate. A blanket road-to-walk carve is BANNED:
  measured, it drops trailer's driveNetworkReach from 0.9773 to 0.4256 because its
  entrance spine is one tile wide.

## PROOF

```
node gates/d1_kerb_gate.js
D1 KERB GATE: 46 passed, 0 failed  (36 districts, 1 declaring a public street,
  52164 mass-over-walk writes, 0 on the kerb, 0 bare frontage)
```
Plus `python3 tools/bohemia_city_module_resync.py` -- the kit and the suburb were BOTH
stale inside `CITY_B64`. A kit fix that skips the resync is a fix he cannot see, and
"I didn't see nothing new" is a complaint this repo has already eaten twice.
