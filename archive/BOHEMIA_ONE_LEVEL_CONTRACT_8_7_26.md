# THE WORD "LEVELS" MEANT TWO DIFFERENT THINGS
**8/7/26. WORLD lane. One reader, three interiors, 391 links, every storey walked.
Machine: `gates/interior_levels_gate.js` 12/0.**

---

## THE LANDMINE

Buildings got stairs this morning. The next thing anybody does with that is **write a walker** —
and the moment they do, they step on this:

| module | `levels` is | `.levels.length` returns |
|---|---|---|
| `bohemia_floorplan.js` | an **ARRAY** of plates | a number |
| `bohemia_garage.js` | a **NUMBER** of decks | `undefined` |
| `bohemia_crypt.js` | absent entirely | `undefined` |

**Same word. Two meanings. Plus a third interior that does not use it at all.**

And neither mistake throws. A walker written against the floorplan reads `undefined` off a
garage and quietly walks zero decks. One written against the garage gets an array where it
expects a count and quietly does arithmetic on it. **Nothing goes red. It just behaves
wrong, in a place nobody is looking.**

This is the same shape as every expensive bug in this repo — the district list kept by hand
in three places, a file name standing in for a type — and it had not bitten **only because
no walker existed yet.** So it gets defused before it is load-bearing, rather than after
three lanes have written against it.

## WHAT WAS BUILT

`engine/bohemia_interior_levels.js` — **one reader, and it renames nothing.**

Both existing shapes stay exactly as they are, because the shipped city app reads them. It
adds no field to any interior. It is a *reader*: hand it any interior and it answers the
four questions a walker actually asks.

> **how many storeys · what is on storey i · can a body stand here · where does this
> storey connect to the next**

**The link is the whole point.** A floorplan joins storeys with a **stair** — one cell,
floor on both plates. A garage joins decks two ways, and both are real: the **ramp** a car
drives up, and the **stair/elevator core** a person walks. A crypt is one storey and joins
nothing. All three answer the same `links(i)`.

And `walk(interior)` is the flood a renderer or an actor needs: in at the entrance, across
every storey, following the links, reporting coverage per storey. **Written once here
instead of three times in three lanes.**

## WHAT THE GATE PROVES, BY WALKING RATHER THAN READING

- **One code path reads all three.** Not three branches in a test — the same `walk()` call
  over a floorplan, a garage, a crypt, and world.js's *wrapped* floorplan.
- **Every storey fully walked.** 100% of standable cells on every storey of all eight cases,
  from the entrance, **through** the links.
- **Every link is standable on BOTH storeys it joins** — 391 of them. A ramp or a stair that
  lands in a wall is exactly what this is built to make impossible.
- **The collision is still described.** If somebody later "tidies" `garage.levels` into an
  array, the reader must move with it, so the gate asserts each module still has the shape
  the reader was written against. A silent tidy-up is how this class of bug returns.
- **It holds on the real valley** — 52 interiors the world model actually handed out, 8 of
  them multi-storey, all fully walkable.

## WHAT THE GARAGE TURNED OUT TO BE

Worth recording because it is a good result and I expected a bad one: **the decks were
already correct.** Walked headlessly across five configurations from 12×10/2-deck to
60×44/6-deck, **every stall, every ramp and every core is reachable on every deck, with zero
unreachable cells.** The generation was never the problem. It has simply been generating
into a void since 7/19, with nothing able to read it.

## WHAT THIS UNBLOCKS, AND FOR WHOM

The render half of verticality belongs to the **RUN** and **CITY** lanes. This is the piece
they need and could not have had: a single, gated way to ask an interior how tall it is and
how you get up it, so neither of them has to guess which meaning of `levels` they were
handed. **[Not this lane's to render — flagged, built, and left where they can pick it up.]**

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
