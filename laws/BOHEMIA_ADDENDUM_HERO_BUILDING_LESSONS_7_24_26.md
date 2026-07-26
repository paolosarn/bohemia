# BOHEMIA ADDENDUM — DISTRICT HERO BUILDING: THE FAILURES, AND WHEN IT TURNED (7/24/26, LOCKED)

Paolo, 7/24: "you shouldn't be making any buildings if you can't talk about and
write about all the parts of the buildings you said you made — that's a rule and
you haven't. And think about all the failures and all the thumbs down I've gotten,
and think about when I started giving things positive feedback, and write that in
the notes for you."

This is that note. It is written for the NEXT session so the hero-building arc is
never re-walked from zero. Two laws come out of it (both gated):
1. DOSSIER-OR-DON'T: no hero building ships without every part documented.
2. HERO = THE WALKABLE DISTRICT: the sprite mirrors the tile you actually walk.

---

## THE THUMBS-DOWN ARC (what failed, and why)

- **v1 — "they were all dogshit."** Procedural pixel faces hand-drawn in code.
  CAUSE: hand-painting building faces caps out at programmer-art. Not iconic, not
  distinct, no real light.
- **v2 / v3 — "kind of ass. the windows aren't on the walls. they look the same
  as before. look at the real Las Vegas City Hall."** CAUSE: detail drawn OFF the
  wall plane (overlap), buildings not visually distinct from each other, and NOT
  researched against the real thing.
- **v4 — "it's looking better it still kind of looks like dog shit."** CAUSE:
  still the same procedural approach, iterated. A capped method doesn't uncap by
  polishing. Paolo's call: **RETHINK THE APPROACH.**

## THE PIVOT THAT UNCAPPED IT (necessary, not sufficient)

- Built `tools/bohemia_iso3d.py` — a tiny software 3D→iso baker. Model the
  building as real 3D volumes, light it, bake to a sprite (how Pocket City 2
  actually does it). Real projection **killed the whole window-overlap class of
  bug** and gave real lighting. Direction approved: *"it's looking better tho."*
- But it STILL drew notes, one per turn, each a real miss:
  - *"the gray-brown plot does nothing... make the buildings bigger."* — a small
    building stranded in a big apron. FILL THE BLOCK.
  - *"I gotta be able to see the doors."* — doors must sit at GROUND on the outer
    front face (a base that stuck out past the tower made the door float).
  - *"you made it so I can't see the whole square tile."* — the frame cropped the
    plot. Auto-fit the canvas to the whole scene.
  - *"if you can tell me what each item is it shouldn't be there."* — ambiguous
    gray blobs (vents, a stick "marquee"). EVERY PART MUST READ ON ITS OWN. If it
    needs explaining, cut it or make it iconic.

## WHEN THE POSITIVE FEEDBACK STARTED (the real lesson)

The turn Paolo said **"bro that looks so good so much better man frfrfrfr good
shit"** was the turn I stopped INVENTING buildings and made each hero **resemble
the actual walkable district** — pulling the PALETTE and the KEY LANDMARKS straight
from that district's own engine module (`engine/bohemia_<district>.js`). One
canonical body, two renders.

That single move fixed the deepest, oldest complaints at once, because the earlier
heroes were *wrong*, not just ugly:
- City Hall had been an invented glass tower. The walkable district is an admin
  BLOCK + a CLOCK TOWER + a forecourt PLAZA + a DRY FOUNTAIN. Matched it.
- Battery had SMOKESTACKS — a power plant. The district is a grid BATTERY-STORAGE
  yard (containers + inverters + a control building). Matched it.
- Terminal had a teal canopy + a corner "marquee." The district is a waiting HALL
  + a SCHEDULE-BOARD CLOCK + a gray CANOPY over a BUS ROW. Matched it.

**THE LAW: the hero is the walkable district, seen from the city.** Do not invent.
Open the district's engine module, read its LEGEND (the named landmarks) and its
PALETTE, and build the hero from THOSE parts in THOSE colors. Then hold the
readability bar (every part legible) and the block bar (building dominates,
pavement is connective). Paolo's words, 7/24: *"as long as it kind of resembles
the actual walking map of that district then I'm so happy."*

## THE RULES THAT CRYSTALLIZED (each bought with a thumbs-down)

1. **DON'T INVENT — MATCH THE WALKABLE.** Palette + landmarks from the engine module.
2. **EVERY PART READS.** If Claude has to tell Paolo what a blob is, it's out.
3. **FILL THE BLOCK.** Building + purposeful content dominate; pavement connects.
4. **DOORS AT GROUND, WHOLE TILE IN FRAME.** No floating doors, no cropped plot.
5. **ONE CONSTANT VEHICLE SIZE.** One car, one bus, one trailer — everywhere
   (`CAR/BUS/TRAILER` + `_vehicle`, gated). Paolo: *"there can only be one
   consistent car size."*
6. **BUILDINGS ON PAVEMENT, NOT GRASS.** Grass only where it IS the point (a park's
   turf); the building still sits on a paved pad. (Farm is dirt/fields — agricultural,
   not lush grass.)
7. **DOSSIER-OR-DON'T.** No hero ships whose every part isn't written up
   (`records/BOHEMIA_DISTRICT_HERO_DOSSIER.md`, gated by `hero_dossier_gate.py`).
   Paolo, 7/24: *"you shouldn't be making any buildings if you can't talk about and
   write about all the parts."*

## WHY THIS IS A NOTE, NOT JUST A MEMORY

Six of nine gated laws were found already broken on 7/16 — memory rots, gates hold.
Rules 5 and 7 have machine gates (`vehicle_size_gate.py`, `hero_dossier_gate.py`).
Rules 1–4 and 6 are judgment held against the render-and-look bar; this note is
their record so the judgment carries forward instead of being re-earned in
thumbs-downs.
