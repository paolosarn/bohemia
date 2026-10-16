# WHAT YOU HEARD (8/17/26, PEOPLE lane)

## THE MECHANIC THE MORNING'S FEATURE WAS MISSING

The street exchanges shipped this morning with **eleven conversations marked
`leaks:true`** — each one saying something true about this valley that is said
nowhere else. You overheard it, the bubble faded, and **the game forgot.**

`Q001.P8 "W8 (reward the listener"` asks to *"gate a solution behind a detail
only an attentive player caught."* A detail that is caught and then dropped gates
nothing. That was atmosphere wearing a mechanic's coat.

## WHAT IT IS NOW

Overhear a conversation to the end and **the fact goes in your log.**

    YOU HEARD        "After five you get what is left in the pipe, and it is warm."
    WHICH LEAVES     The pressure is only up before five. Something else is
                     running it the rest of the day.
    THINGS YOU KNOW  3 ACROSS 3 SUBJECTS

Seven subjects exist in the world to have a thread on: **water, power, salvage,
work, the hill, names, strangers.**

## STAYING IS WHAT PAYS

The fact is recorded **only when the conversation reaches its last turn**, and
the line quoted is that turn, because that is where the payoff sits in all
eleven. Walk off halfway and you heard people talking and learned nothing.

That is `Q001.P8` taken literally: standing still has to buy something, and
leaving has to cost it. It was measured first — quoting the turn you *joined* on
produced rows like `HEARD: "Where then."`, which is a fact about nothing.

## IT NEVER POINTS AT ANYTHING

`Q018.W3 THE RUMOR WEB (curiosity as the quest log)`: *"a growing map of
known-vs-implied that always gives a thread to pull, with **NO waypoints** — the
player follows their own questions."*

So a row carries a **subject** and a **question**, and no cell, no coordinate, no
arrow, ever. MAP LAW says Claude never designs map layouts and the corpus says no
waypoints, and those agree. Where the answer is, if it is anywhere yet, is his.

The gate greps every stored row for a coordinate and fails if it finds one.

## RESEARCHED, AND THE DESIGN THAT ALREADY SOLVED THIS

Outer Wilds' ship log: progression **is** knowledge, and *"the only things locked
to you are locked because you are ignorant of them."* Its rumour mode lays
entries out by how they relate, **differently for every player**, because the
order you learned things in is part of what you know. No marker is ever placed in
the world.

That last point is why re-hearing a fact counts it but never reorders the log.

## WHAT I MEASURED AND THEN DID NOT SHIP

The first cut derived *"what somebody's trade gets talked about"* so the card
could show you what you had heard about **this person's** subject. Measured:
`scav`, `keeper`, `watch` and `worker` each came back with **all seven
subjects**, because most exchanges take `('any','any')` speakers and an `any`
slot matches everybody.

**A function that returns the same answer for every input is not a lookup, it is
a decoration.** It was deleted and the reason written into the factory, and the
log stayed a log — which is what `Q018.W3` asked for in the first place: a
growing map of known-versus-implied, not a dossier per resident.

## WHERE IT LIVES

- `engine/bohemia_known.js` — the log. Records, dedupes, counts, serialises.
- `boh.city.known` — its own localStorage key, the way `CT_MET` already
  persists. It does **not** ride the main save, which belongs to another lane.
- The **talk card** in the RUN tab carries it, through the card's own `ctRow()`
  helper, so it wears the card's face and there is one place to change a row.

## THE MACHINE

`gates/known_gate.js` — 19 assertions, registered as WHAT YOU HEARD. Mutation
tested:

    record on the first turn instead of the last  -> B6 FAIL (2 wrong lines,
                                                     naming both)
    the log stops persisting                      -> B7 + B9 FAIL (1 -> 0
                                                     across a reload)
    a leak loses its subject                      -> A2 FAIL (names rumor-quiet)

**And one flake was found and killed rather than lived with.** B5 ("standing on a
street fills the log on its own") drove a fixed 130 renders and returned 4 facts
one run and 1 the next, because only 11 of 31 conversations leak and which pair
says which is arbitrary from the gate's point of view. A GATE THAT FAILS
INTERMITTENTLY IS WORSE THAN NO GATE: it teaches everybody to re-run until green,
which is how a real failure gets waved through. It now walks a bounded distance
and stops the moment the claim is satisfied.

Tools: `tools/bohemia_city_known_patch.py` (idempotent by md5), and the leaks'
subjects and questions come from `tools/bohemia_exchange_factory.py`, which now
**refuses to build** an exchange that claims to leak and names neither.
