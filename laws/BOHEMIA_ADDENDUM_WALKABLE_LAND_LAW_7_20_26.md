# BOHEMIA ADDENDUM — WALKABLE-LAND LAW (Paolo 7/20/26, LOCKED, "this has to be a new rule")

Paolo, judging the first big district batch: "if you do something that's worth this big of a
slot of walkable land it can't mostly be you know a parking lot or a car driveway... the firehouse
is so tiny." He liked the self-storage (packed with unit rows); he hated the fire station (a tiny
building marooned in a huge empty apron).

## THE LAW
A district occupies a FULL PLOT of walkable land (one overmap cell = 96m x 96m). That land is
precious. It CANNOT be mostly parking lot / driveway / apron with a tiny building stranded in it.
The BUILDINGS and PURPOSEFUL CONTENT must dominate the plot — the cars' pavement is connective
tissue between content, never the main event. "A big slot of walkable land" is a place, not a
parking lot.

- PURPOSEFUL CONTENT = buildings, structures, and used features (a sports field, a track, courts,
  market stalls, storage units, panels, a playground, a plaza people stand in). It is what the
  place IS FOR.
- FILLER = drivable pavement (parking/driveway/apron), bare desert, and undifferentiated bare
  ground (plain lawn/dirt with nothing on it).
- The rule: on a walkable district, drivable pavement must NOT dominate purposeful content. A tiny
  building in a sea of apron is a FAILURE, full stop.

## THE DELIBERATE EXCEPTION — VEHICULAR VENUES
Some districts ARE a vehicle surface by nature: a DRIVE-IN theater (the parking field facing the
screen IS the venue), a GAS / TRUCK STOP (the fuel forecourt IS the function), a future PARKING
STRUCTURE. These declare `vehicular:true` in their spec and are exempt from the pavement-dominance
cap — BUT they still may not be an empty void: the vehicle surface must be dressed with purpose
(arced rows facing a screen, pumps + islands + canopy, abandoned cars, markings). "Vehicular" is
not a license to ship a black rectangle.

## THE MACHINE (a law without a gate is not enforced)
`gates/walkable_gate.js` sweeps EVERY registered district and asserts, per district:
- `drivePct <= contentPct + MARGIN` (drivable pavement does not dominate purposeful content),
  UNLESS the district's spec declares `vehicular:true`.
- content/drive/filler are computed by `K.landStats(grid, legend)` (shared, so the gate and the
  builder measure the same thing): drive = legend kind 'drive'; filler = drive + desert + bare
  ground (name matches the filler set); content = everything else (buildings + used features).
- Vehicular districts still must not be a monster void (a floor on dressed features).
The gate is registered in `gates/bohemia_gates.py`. Green or it does not ship.

## THE SPIRIT (what the number can't fully catch — hold the render-and-look bar)
The gate catches the egregious "tiny building, huge apron" case. It does NOT catch "too much bare
lawn / looks incomplete" (a park SHOULD be mostly lawn — that's correct; a school that is mostly
empty lawn is NOT). That is a RENDER-AND-LOOK judgment: a walkable district must read as FINISHED
and USED — dense with buildings and purpose, not a few thin features stranded in empty ground. The
self-storage (unit rows wall-to-wall) is the reference for "used land done right." When you build a
walkable district, fill it like someone actually built a place there.

## RECORDED FAILURES (train on these — the batch that triggered the law)
- FIRE STATION v1: an 8%-of-plot building + a 52% empty apron. The exact failure. FIXED: a big
  station (bays + 2-storey quarters + training rooms), a training ground with a drill tower + burn
  building + hose racks (the open space now has PURPOSE), a small apron. Building/content dominates.
- SCHOOL v1: "dog shit... incomplete." The field+track was OK; the rest was thin features stranded
  in ~44% empty lawn. FIXED: a full 2-storey school complex with a courtyard quad, more wings +
  a cafeteria/library annex + portables, more courts + gardens, the field kept. Reads finished.
- SWAP MEET v1: "not sure if it's indoor or outdoor." FIXED: committed to OUTDOOR open-air — visible
  tent poles + peaks, open-sky aisles, only a small indoor hall, so it reads unambiguously al-fresco.
- (SELF-STORAGE: the one Paolo liked — kept as the density reference.)
```
