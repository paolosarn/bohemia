# FOURTEEN PARTS OF VEGAS YOU CAN RAID — SCHOOL ROUND
FACTIONS lane, VAMILY row `[home bases]`, MODE: SCHOOL. 9/28/26.
Implements nothing. Research only, per Paolo's third votes item 5:
"TERRITORY IS NOT A MECHANIC; HOME BASES AND ROAMING PARTIES ARE."
(records/BOHEMIA_PAOLO_THIRD_VOTES_9_28_26.md, laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md)

## WHAT GOT REJECTED
The old shape, shipped round 42: a 9,216-cell map-painted territory ledger,
one crew colour per lot, a border you could see and fight over cell by cell.
Two VOTE cards proved the problem before this — `FACTIONS_YOU_CANNOT_SEE_TERRITORY_9_24`
(you can never see 9,216 painted lots from either the street or the city view;
you saw one orange line) and `FACTIONS_TWO_LADDERS_NEITHER_READS_GROUND_9_27`
(neither trust ladder ever reads what ground you hold). Paolo's own words
killed it outright: "Fourteen crews DOWN. A block changed hands DOWN. You
cannot see territory DOWN."

## AISLE ONE — THE REAL WORLD
Real criminal and paramilitary factions do not hold ground as a filled-in
colour on a map. They hold NAMED PLACES: a clubhouse, a plaza, a safehouse,
a checkpoint. Between those places they move as visible crews you can watch
and choose to engage or avoid — exactly what "roaming parties" already means
in this engine.

Sources:
- [Mexican drug cartels control territory through specific strongholds and checkpoints, not painted zones](https://en.wikipedia.org/wiki/Mexican_drug_trafficking) — cartel power is expressed through named plazas (smuggling corridors) and armed convoys, not a continuous colored map.
- [Favela gangs in Rio hold named community strongholds, not districts as a whole](https://en.wikipedia.org/wiki/Favela) — control is block-by-named-block, anchored to specific buildings and entry points, never a uniform overlay.
- [Prison and street gang "turf" in criminology is modeled as anchor points and patrol routes, not filled territory](https://en.wikipedia.org/wiki/Street_gang) — gang geography research describes "set space" (a handful of named locations) plus roaming, matching home-bases-and-parties far better than a painted grid.

## AISLE TWO — BATTLE BROTHERS
`reference/library/battle_brothers/01_WORLDMAP.md`: the map shows named
settlements and roaming war parties you can see coming from a distance, sized
and armed before you ever fight them. There is no painted-territory layer at
all — control is which settlements are friendly, contested, or hostile, read
off the settlement itself, never off empty ground between settlements.

`reference/library/battle_brothers/09_ENEMIES.md` line 22-24: "THE SHAPE:
every enemy is a rule you must learn; the roster of a fight is telegraphed by
the party's size and kind on the map; fights are chosen, not stumbled into.
(OURS: the factions' crews on the map, sized and named at a distance;
FACTIONS [bb houses], COMBAT [bb fight].)"

## THE FINDING THAT PROVES US WRONG
We assumed the mechanism was broken and needed a bigger, more granular ledger.
Measured live on the running alpha this round: it was never the mechanism.
**28 parties are already roaming the map right now** (14 patrol, 10 caravan,
4 crew — already "way more than fourteen," his own bar). **All 14 crew seats
already carry a real, thematically dead-on district kind and a tier**
(Mob sits a resort at fortress tier, Cartel sits storage at fortress tier,
Church sits a chapel at town tier, Homeless sits a pumpstation at camp tier).
The data this rule needs already exists. What was wrong was never the seats
or the parties. It was the 9,216-cell PAINTED LAYER on top of them and the
promise that a player could ever see or fight over one lot at a time. That
layer is what gets buried. The seats and the parties are what "home bases"
builds on.

## MEASURED AGAINST OUR REPO (live, via tools/bohemia_drive_the_demo.js)
```
parties on the map right now: 28
by agenda: {"patrol":14,"caravan":10,"crew":4}

the 14 seats, already grounded in real district kinds:
  Anarchists  town      suburb
  Blues       town      park
  Caravans    fortress  truckstop
  Cartel      fortress  storage
  Church      town      chapel
  Colorful    camp      suburb
  Custom      camp      suburb
  Homeless    camp      pumpstation
  Mob         fortress  resort
  Network     fortress  radio
  Reds        town      downtown
  Remnants    fortress  prison
  Trades      camp      industrial
  Volunteers  camp      medical
```
Source: `engine/bohemia_towns.js` `derive()` (seats) and `partiesAll()`
(roaming parties), read live off `slices/BOHEMIA_ALPHA_0_9.html`.

## WHAT HAPPENED TO THE OLD LEDGER
`engine/bohemia_turfledger.js` and `gates/turf_ledger_gate.js` are marked
SUPERSEDED 9/28/26 in place, banner at the top of each file, citing this
record. Neither file was moved or deleted: `gates/three_acts_gate.js`
(WORLD's, already shipped) hard-requires the engine file directly, so
deleting it would break a cross-lane gate that is not this lane's to touch.
The empty-ledger-is-a-no-op property already held by the gate means keeping
the file changes nothing a player sees — nothing on the real surface ever
calls `.took()`. No new work builds on that shape again.

## ROUTED
- **WORLD**: your `three_acts_gate.js` keeps passing untouched; no action
  needed from you, this is a heads-up that the module it requires is now a
  dead end for new work.
- **COOK [tile options]**: the 14 seats' `kind`/`tier` are the settlement
  identity a settlement screen needs (rule 37e: "PLACES ARE SETTLEMENT
  SCREENS"). Build the home-base screen off `BohemiaTowns.derive()`, not off
  a repainted lot grid.
- **COMBAT [bb fight]**: the 28 roaming parties (patrol/caravan/crew) are
  already the "roster telegraphed by size and kind on the map" that
  09_ENEMIES.md describes. A fight against a roaming crew is a different
  encounter than a raid on a seated home base — worth a difference in the
  fight itself, his call when he sees it.

## WHAT PAOLO SEES
Nothing new to look at this round. This round is research: it says the old
territory map is buried for good, and it names the two things — the crews'
home turf and the parties already walking around — that the next FACTIONS
build stands on instead.
