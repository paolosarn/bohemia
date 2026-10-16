# YOU COULD NOT LEAVE THE BLOCK YOU SPAWN IN (8/19/26, WORLD lane)

**From the player's start, three cells of nine thousand two hundred and sixteen were
reachable on foot. There was a wall down the west side of every street in the game.**

> "the streets have to touch the streets bro... make sure I cant be locked in any certain
> district ever again." — Paolo, 8/1/26, LOCKED

---

## THE MEASUREMENT NOBODY HAD TAKEN

I have changed how every road and every district draws itself over the last two days, and
nothing had asked the walked surface the only question that matters: **can a body get
anywhere?** Flooding the valley from the player's spawn, crossing a cell boundary only where
a walkable tile faces a walkable tile:

**3 of 9,216 cells. 0.0%.**

## THE CAUSE

`bohemia_arterial.js`, the last line of its band table:

```
if (b <= SET) return 7;   // margin, not a setback -- and never a wall (Paolo 8/11)
if (b <= ROW) return 8;   // <- the block wall
```

With `WALK = SET = 63` and `ROW = 64`, that second line matches **exactly one value** —
`b === 64`, which is `ox === -64`: **the west edge of every arterial cell.** A one-tile block
wall, 128 tiles tall, down the west side of **all 2,434 of them**. You could not cross a
street westward anywhere in the valley.

It contradicted this module's own comment forty lines above:

> AND NO BLOCK WALL. A street is public ground all the way to the boundary, so the
> neighbouring district's own edge starts exactly where this cell stops.

The 8/11 pass widened `ROW` from 63 to 64 to kill a one-tile **dirt seam** between
neighbouring road cells and left this row behind. The seam became a **wall** instead of a
gap, and the comment saying so was written in the same commit.

## WHY IT SAT THERE FOR EIGHT DAYS

**The walked surface never used this module until 8/18.** It drew streets from its own
four-number table, which has no wall in it. Routing streets through their real module — the
fix that took arterials from 8.6% drawn to 100% — is what made this bug *reachable*, and the
reachability check is what caught it. Every gate that reads `engine/` was green throughout:
the wall was correct according to the band table, and the band table was the thing that was
wrong.

## THE FIX

`if (b <= ROW) return 6;` — the sidewalk runs to the boundary. That is all the line ever
needed to say, and it is what the module's own dossier already claimed it did.

**3 cells → 7,616. 0.0% → 82.6%.**

## GATED

`walked_surface_gate.js` now floods the valley from the player's spawn on every run and
fails below **75%**. Mountain, freeway and walled subdivisions are legitimately not walkable,
so this is not 100% and should not be — **but the floor may only rise.**
