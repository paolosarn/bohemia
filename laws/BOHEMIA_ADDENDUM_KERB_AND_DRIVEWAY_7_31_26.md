# ADDENDUM — THE KERB AND THE DRIVEWAY (Paolo 7/31/26, LOCKED)

> "New rule all drive ways [2] tiles wide not three and Im upset your sururbs
> dont have a 1 grid sidewalk next to the streets whata wrong with you bro"

He sent a screenshot of the block with a yellow line traced along the road edge,
showing exactly where the walk belongs, and a circle around a driveway that was
too wide.

## THE TWO RULES

1. **EVERY DRIVEWAY IS 2 TILES WIDE.** Exactly two, everywhere, no exceptions.
   (It stays 3 long. Two wide, three long, 2x3, every home, every district.)

2. **EVERY STREET WEARS A ONE-GRID SIDEWALK.** One tile, both sides, hugging the
   kerb, wherever a street meets buildable ground. It breaks only where a
   driveway apron crosses it, which is what a real street does.

## WHY THE SIDEWALK ONE HID, AND THE LESSON UNDER IT

The RUN's renderer already drew a kerb band. `groundTile()` asked "is this ground
cell next to a road?" and laid the approved `walk_kerb` tile if so. Measured on
the real surface, all 709 ground-touching-road cells came back `walk_kerb`. On
the one screen anybody looked at, it appeared handled.

It was a costume. `engine/bohemia_suburb.js` had codes 0,1,2,3,4,5,6,9 and not one
of them was a sidewalk. So:

- the **CITY tab** drew no walk at all — different renderer, same world
- the **tilespec dossier** had no sidewalk row for the tiling phase to work from
- the **world model** reported no walk surface to anything that asked it
- and **no gate could ever fail**, because there was nothing in the world to check

**A FEATURE THAT LIVES INSIDE ONE RENDERER'S IF-STATEMENT IS NOT IN THE GAME.**
This is the same shape as the two-sources-of-truth scale bug from the day before:
something looked right on the surface being watched while the model underneath
never knew about it.

## WHAT IT MEANS MECHANICALLY

The sidewalk is **code 10**, laid by the generator in a final pass after homes and
driveways are stamped, on every dead-ground cell orthogonally adjacent to a road.
Not 7 or 8: those are the GRAVEYARDED tree and pool codes and the dead-world law
forbids them outright. `suburb_modular_gate` caught my first attempt using 7 within
the hour, which is the graveyard doing exactly its job.

`kind:'walk'`, so the district kit resolves it to layer `ground`, `solid:false` —
walkable, flat, no declaration needed anywhere else. Every consumer gets it free.

The run's inference trick is **deleted, deliberately**. Left in as a fallback it
would silently re-fake the walk the moment the generator regressed, which is the
exact mechanism that hid this for weeks. The run reads `c===10` and nothing else.

## THE GATE

`gates/suburb_street_gate.js`, wired into the suite as SUBURB STREET. It checks the
**world model**, never the renderer, so it would have caught the original bug:

- zero bare ground touches a road (the assertion the old trick made unfalsifiable)
- the walk is one grid, never a plaza: no walk cell sits in a second rank
- no floating walk: every walk cell touches a street
- every driveway blob is exactly 2x3, measured as BLOBS not scanlines (a
  side-facing driveway's 3-tile length shows as a 3-run in a horizontal scan, so a
  scanline check reports a false failure)
- the run reads the world's cell and the inference trick has not come back

Proven able to fail three ways before being trusted: driveway width back to 3, the
sidewalk pass disabled, and the renderer inferring the walk again — each turned its
own assertions red and nothing else.

Measured on the real surface after the fix: the band renders 35 px between asphalt
and yard, which is exactly one tile at that zoom.
