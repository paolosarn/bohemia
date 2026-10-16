# BOHEMIA — TWENTY-FOUR STRANGERS BEFORE THE FIRST ONE WHO BELONGS TO ANYTHING (8/20/26, FACTIONS lane)

**For the WORLD / MAP / QUESTS lanes and for Paolo. A measurement, not a request.
Nothing was tuned and no dial was touched.**

## 1. THE NUMBER

Measured on a **cold start** of the walked surface — the state a player is
actually in when the game opens:

| | |
|---|---|
| spawn cell | **[48, 48]** (valley centre) |
| people in the valley | 298 |
| affiliated | 32 |
| **nearest person who runs with anybody** | **18 cells** (a Mob member) |
| nearest base | 29 cells (Colorful) |
| **people nearer to you than that first affiliated one** | **24** |

**You can meet twenty-four people before you meet one who belongs to anything.**

## 2. WHY IT MATTERS RIGHT NOW

The faction stack is finished and verified to the bone — 43 claims walk the whole
journey on the real surface: meet, ask their name the way *that outfit* does it,
read their terms, do what they want, hit the wall, take a side, climb further,
take what they offer, owe them, get asked, answer yes or no.

**None of it is anywhere near where the game starts.** A short session — a demo —
can plausibly contain zero contact with any of it. That is not a defect in the
systems; it is a fact about where people and bases sit.

## 3. WHAT I DID NOT DO

**I did not raise `REACH_CELLS`.** The nearest base is 29 cells and reach is 12.
Widening reach to cover the spawn would mean somebody standing at [48,48]
affiliates with a base **29 cells away**, which contradicts the mechanism it was
built on — Kalyvas 2006, *control decays with distance*, which is the whole reason
the pick is distance-weighted. It would buy a number and cost the model.

**I did not move a base.** MAP LAW: Claude never designs map layouts.

**I did not raise `AFFILIATED_RATE`.** It is 0.30 and the realised rate is 10.7%,
because reach — not the roll — is the binding constraint. Raising it would not
put anybody near the spawn.

## 4. WHAT I DID

`gates/faction_arc_gate.js` **part G** measures this **on a cold start, on every
run**, and prints it. It is deliberately **not a ratchet**: base placement is his,
and a gate that goes red when he moves one would be a gate outranking a ruling.

The only thing asserted is that the number **exists** — that somewhere in the
valley there is somebody affiliated and reachable. *"Nobody in Las Vegas runs with
anybody"* is the exact state the game was silently in for thirteen days, and that
is worth a permanent tripwire.

> **AND THE FIRST VERSION OF THAT MEASUREMENT WAS WRONG.** It read `ctCell()` on
> the page the walk had been using — which by then was standing *at* the
> Volunteers base — and reported the nearest affiliated person as **4 cells**.
> A measurement of *"where he starts"* taken after you have walked him somewhere
> is a measurement of nothing. It runs on its own fresh page now.

## 5. THE THREE WAYS THIS CLOSES, ALL OF THEM SOMEBODY ELSE'S

1. **A base nearer the spawn** — MAP LAW, his.
2. **A denser valley** — 32 affiliated of 298, and separately *nobody shares a
   roof* (`BOHEMIA_NOBODY_IN_THE_VALLEY_SHARES_A_ROOF_8_19_26.md`).
3. **A reason to walk 18 cells** — QUESTS / RUN. A demo that routes the player
   past an outfit needs no world change at all, and is probably the cheapest of
   the three.

This lane records the number and stops.

Measured by: `gates/faction_arc_gate.js` part G (prints on every run)
Related: `records/BOHEMIA_NOBODY_IN_THE_VALLEY_SHARES_A_ROOF_8_19_26.md`
