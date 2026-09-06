# A FACTION SITS WHERE ITS OWN CANON SAYS IT LIVES
FACTIONS lane · VAMILY row `[faction homes] FACTION-SEATS` · 9/5/26

## THE ONE LINE
Every faction now sits on the kind of ground its own note in
`BOHEMIA_faction_graph.json` names, the boot and the walked city name the same
fourteen seats because one module decides them, and the three factions his canon
calls non-territorial were given nothing invented.

## WHAT WAS WRONG, AND IT IS WORSE THAN IT LOOKS
The placer was two lines: zip the SORTED faction ids to an evenly-strided sample
of the district list. The district list is 100% ordered by y, so an even stride
marches straight down the map. Measured on the real boot, seed `bohemia`:

    correlation(alphabetical rank, seat y) = 0.9966

Anarchists at y=2, Volunteers at y=83, for no reason except their initials.
**The alphabet was deciding the geography of the valley.**

And the ground it landed on was nobody's home: the Church on a suburb, the
Cartel on a solar farm, while the generated map holds a chapel, an arsenal, a
police station, six dataforts and a hundred and eighteen resorts that nothing
ever used.

`worldMap.factionSlots` was a ghost on top of that. `bohemia_engine.js` computes
`_spreadPoints(14, beltway, ...)` under a comment calling it "Faction base
placements", and TWO files (`bohemia_agents.js`, the walked city) carried a
comment asserting `bootFactions` seats factions on it. It never did; the live
worldMap does not carry the key at all — measured, `factionSlots: 0`. Both
comments are corrected rather than deleted, so the next reader gets the warning
instead of the promise.

## WHAT SHIPPED
`bohemia_towns.js` gained `HOMES` and `placeHomes()`, and `derive()` now uses
them. `bootFactions` calls the same `placeHomes`.

**It landed in the towns module, not in the loop, and that is the point.** The
walked surface reads its seats through `BohemiaTowns.derive()` (`powerSeats` →
`turfAt` → who owns every cell → the power grid). Fixing the placement in
`bohemia_loop.js` would have rebuilt the exact defect FACTION-TOWNS had just
spent a round killing one layer up: `ctBases()` saying the Mob lives on a resort
while `turfAt()` still answered by the alphabet. ONE BODY, TWO CALLERS.

### HIS NOTES ARE THE PLACEMENT
Every row of `HOMES` quotes the words it rests on. A wrong seat is a MISREADING
somebody can check against his file, not a taste that has to be argued. MAP LAW
is intact: this picks which KIND of already-generated ground an outfit belongs
on; it designs no layout, and one line in `BohemiaTowns.SEATS` overrides all of
it.

| faction | his note | ground |
|---|---|---|
| Mob | "Controls the Strip. Ownership/protection/tribute." | resort casino convention downtown |
| Remnants | "Military/law-enforcement survivors incl Nellis." | arsenal policestation prison firestation |
| Network | "Only faction with a manufactured origin." | datafort radio substation |
| Cartel | "Organized human predation. Supply chains mirror Caravan routes." | boneyard landfill quarry railyard, then storage warehouse terminal swapmeet |
| Caravans | "Neutral outside-world trade." | truckstop terminal swapmeet warehouse |
| Church | "Best crisis organization." / evangelical | chapel cemetery school |
| Reds | "Economic engine, compound-interest faction." | downtown cityhall courthouse mall |
| Blues | "Environmentalist." | reservoir watertreat farm park |
| Trades | "Best for vehicle/solar/construction." | industrial solar battery warehouse |
| Volunteers | "Healthcare/education/food/knowledge." | medical campus granary school |
| Homeless | "Sewer/tunnel HQ under the King Hobo." | intake pumpstation reclaim basin wash |

The Cartel's second row is the one that needed a second reading. Measured on the
shipped seed: not one boneyard, landfill, quarry or railyard in the valley fronts
a road, so on its first four kinds alone his third-strongest faction (power 12)
fell through to a random suburb. Loosening the road rule to rescue it would have
cost what the WORLD lane measured (unreachable seats 7 → 2 → 0). Reading his next
sentence — "supply chains mirror Caravan routes" — cost nothing. The Cartel
outranks the Caravans, so it picks off that shared list first and the Caravans
take the next one, which is what "mirror" looks like.

### WHERE HIS NOTE NAMES NO PLACE, NOTHING WAS INVENTED
Three factions are absent from `HOMES` on purpose, in his own words:

- Anarchists — "Culturally huge, **territorially inconsistent**"
- Colorful — "**Community-based not territorial**. Members across friendly factions"
- Custom — "Player faction. **No preset philosophy.** Identity emerges from three
  generations of action"

They get a seat by spread alone, because the row asks every faction to have one.

**[PENDING Paolo]** A faction his canon calls non-territorial probably should not
hold ground the way the Mob does. That is a ruling, not a bug, and it is not one
this lane gets to make.

### THE THREE RULES ON TOP, IN PRECEDENCE ORDER
1. **His override.** One line in `SEATS` wins over everything, including his notes.
2. **His power column.** `act1_power` orders the picking: Remnants (14), Mob (13),
   Cartel (12), Network (11) take their homes before the Volunteers (3). Nothing
   here invents a priority.
3. **Mine, and they all yield to his canon.** Six cells apart minimum; five cells
   off the boundary; and prefer the site with the most city around it. If the only
   ground his note names breaks one of mine, HIS WINS and the seat goes there.

Rule 3's density term is the one that mattered. The first cut picked the right
KIND and stopped, which put the Homeless on the only intake in the valley and the
Caravans on the only truckstop — both real canon reads, both in empty corners.
Membership is computed from proximity to a base, so a seat where nobody lives is
a faction with no members, and `faction_arc`'s coverage claims went red: five act
mechanics have members in the valley and the walk could only reach three. Density
is the count of districts within eight cells, read off the very list the caller
passed, because the loop's `zone` field comes out of `bohemia_world.js` and the
walked surface cannot load that module at all. Cells are the shared currency.

## THE NUMBERS
| | before | after |
|---|---|---|
| correlation(alphabetical rank, seat y) | 0.9966 | 0.62 (printed, no longer judged — see below) |
| on ground his own note names, 5 seeds | 1 of 55 | **53 of 55** |
| seats on the valley boundary row | 4 | 0 |
| fewest residential districts within 8 cells of a seat | 0 | 23 |
| seats the boot and the walked surface disagree on | — | 0 |
| deterministic across boots | yes | yes |

## THE RULER, AND WHAT IT COST TO GET RIGHT
The first version of the gate claim was `correlation < 0.5`. It caught the
defect. Then it went RED on a change with nothing alphabetical in it: adding the
density preference moved the number to 0.6227 while the rule reads power, kind,
density and a hash of the id, and nothing else.

On fourteen points a correlation over 0.5 turns up by chance about one seed in
fifteen. The instrument was noise at that sample size, and 0.5 was a bound I
picked, not one the world gave me. The wrong move was obvious and available:
nudge the bound to 0.7 and go green.

The claim is now CAUSAL and it is HARDER, not looser: run the old rule and the
new rule over the SAME district lists on five seeds and compare how often each
lands a faction on ground its own note names. **53 of 55 against 1 of 55.** A
correlation can go quiet by luck; the old rule has no way to read his notes, so
it can only score by accident. A second claim hands the placer the same fourteen
factions in three different orders and demands the same fourteen seats, because
the defect was never "the ids were sorted" — it was that the sorted POSITION was
used as an index.

Same shape as the other three broken rulers this job found: the arc gate's SPARSE
dial set to 1 (a population where half the outfits do not exist), the fold button
measured at 0px behind a splash it was hidden by, and `commitment_gate`'s D11
calling `whoHears` with `{ties}` alone when both real call sites in the city pass
`keyOf: ctVKey` too — without which every "H1-1" in the valley is one person and
the social graph collapses to 241 names for 5194 people. Four times this job, the
measurement was wrong and the target was fine.

## GATES
- `faction_between_gate.js` — pass U, eleven claims (U1–U11) including the
  five-seed causal comparison, the order-invariance test, and the demo file
- `faction_arc_gate.js` — 101/0
- `commitment_gate.js` — 72/0
- `faction_towns_gate.js` — the seats the walked surface trades on
