# TERRITORY SURVIVES THE REBUILD
FACTIONS lane · round 44, off rule 34 · 9/27/26

## THE ONE LINE
**Rule 34 rebuilds the fine grid inside one lot. It does not touch the 9,216 lots
themselves, or who owns them.** Checked on the actual code, not assumed.

Nothing went to the demo or the alpha's play tabs. Rule 18(b) holds.

## WHY THIS ROUND
Rule 34 (Paolo 9/27, LOCKED) landed and it is a real rebuild: THE STEP IS A HOUSE (9/15) and
A COMBAT TILE IS A HOUSE (9/4) are both superseded, the player is one cell not one lot, a
house becomes ~4x4 cells, and the revamp order puts the fight board and the walked surface
on REBUILD. His own words in the law: *"I don't know if we have to restart the whole
enchilada."*

Territory is this lane's layer, so before doing anything else this round the honest question
was: **does this touch it?**

## MEASURED, NOT ASSUMED
| | |
|---|---|
| the valley, in district cells (this lane's layer) | **9,216** (`om.n` = 96, confirmed by running `bohemia_overmap.js`) |
| crews holding those cells | **14** |
| old fine-cell count per district cell (`FN`) | **128** (confirmed live in round 41's own measurement, `6218 / 128 = 48`) |
| rule 34's new cell, his own default | **~32 px, a house 4×4 of them** |
| does rule 34 rename or resize a district cell | **no** — the law's text names WALKING and THE FIGHT only |
| does `bohemia_turfledger.js` change coordinates | **no** — `x,y` there are always district cells |

**Rule 34 redefines what is *inside* one district cell** (floor, wall, door, cover, a
house). It never mentions the district grid, the overmap, or `turf` anywhere in its own
text. Two nested scales, and only the inner one moved.

## SO WHAT ACTUALLY SURVIVES
Everything this lane has shipped keeps working exactly as it is, because none of it is keyed
on the grid that changed:

- Who owns the 9,216 lots (`[who holds]`, 9/6).
- The territory ledger (`[territory ledger]`, 9/24) — a block can change hands and be
  remembered, per act.
- The measurement that 3,415 of 9,216 lots change hands between act 1 and act 3.
- The map's own blindness (`[bb houses]` round one, 9/27) — the map still asks `turfAt` zero
  times, and that is a fact about the map's drawing code, not about the coordinate system
  underneath it.

**None of it needs to be rebuilt when the honest grid lands.** It needs to be *read* by
whatever draws the new grid, same as before.

## CHECKED AGAINST A REAL DOWNSTREAM CONSUMER
WORLD's `[future city]` shipped this round and its `bohemia_future.js` calls
`BohemiaTurfLedger.netFor(ledgers.turf, act)` directly — the exact function this lane's own
gate caught a bug in two rounds ago (the middleman `from`). Read the call: it sums only
positive net entries, which is correct against the fixed function. **Nothing in this lane
needed to change for that consumer, and nothing in it is broken.**

Also confirmed: **nothing anywhere in the game calls `.took()` yet.** The ledger is still
genuinely empty on the real surface, so the no-op property this lane's gate proves is not a
theoretical claim — it is what is actually shipping right now.

## THE COOK
`slices/vote/FACTIONS_TERRITORY_SURVIVES_THE_REBUILD_9_27.html`, registered
`factions-territory-survives-the-rebuild-9-27`. A diagram (the 9,216-lot grid, one lot
picked out, blown up into rule 34's own grid inside it) beside a real frame off the map
(rule 32f), with the numbers.

## WHAT THIS ROUND DELIBERATELY DID NOT DO
Not UI wiring, not standing-on-the-map work, and not a second pass at `[bb houses]` round
two. The walked surface is mid-rebuild under rule 34's own revamp order (honest grid, then
the tiny walker, then the fight, then first person, then the demo) and touching that surface
now — even to check reachability of the STANDING panel — would be building against ground
that is about to move, and risks the ONE-SYSTEM-ONE-SESSION line with WORLD, RUN and LIFE+CITY
who own that rebuild. This lane's own [bb houses] round two (standing per crew) is safer and
more honest after that rebuild lands, not before.

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**A big rule landing is not automatically a big rule for every lane.** The instinct on
seeing "supersede rule 9/15 and rule 9/4, restart the whole enchilada" is to assume the worst
and start auditing everything. Two greps and one node command answered it in under five
minutes: the new rule names its own scope (WALKING, THE FIGHT) and never mentions the layer
this lane owns. Reading what a law actually says beats reacting to how big it sounds.
