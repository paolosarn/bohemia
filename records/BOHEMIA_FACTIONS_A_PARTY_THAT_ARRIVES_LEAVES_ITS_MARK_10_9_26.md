# A PARTY THAT ARRIVES LEAVES ITS MARK
FACTIONS lane, row [raids make traits]. 10/9/26. MODE: BUILD, data + pure module + gate + one VOTE page. Nothing in the alpha changed.

## Measured first (rule 12)
- The wiki's Raided page says -50% items available and -50% recruits available, and NOTHING about prices. RUN TWO's settlement_traits.json has raided at price x1.25, stock x0.6, recruits -1: three numbers that are not the page's. FINDING, routed to RUN TWO (their file, their call; mine reads the wiki).
- Well Supplied (wiki): -10% buying prices, -10% selling prices, +15% items. RUN TWO's file has no such trait; it has raided, sickness and market day.
- In Battle Brothers both are caused by YOUR contracts: Raided when you fail to protect the place or fail the contract (Defend Settlement pages), Well Supplied when you finish an Escort Caravan. Our valley has no contract behind its parties, so the cause is the party. That is the one deliberate difference and it is marked ours in the file with Battle Brothers' own sentence beside it.
- On the real valley (seed 12345, two waking days of arrivals) all three agendas arrive and only crews raid: the crews' targets are the three fortresses, so only fortresses ever read Raided (round five's finding again; WORLD's [parties move] BUY half).

## Built
records/target/bb/arrival_traits.json; engine/bohemia_arrivaltraits.js (traitsFrom, active, effects); gates/arrivaltraits_gate.js (suite: ARRIVAL TRAITS, 41 checks; red 22 ways, mutation script in scratch; three first-draft survivors fixed by adding legs or deleting dead code: an own-home arrival leg, a duplicate-mark leg, and a rounding line that nothing needed). It reads the advanceWatching events my homebases module already hands back, so the clock call that opens raids also writes the marks.

## Ours, draft
A week's duration (RUN TWO's own period); a repeat arrival refreshes and never doubles; patrols, a stopped party, your own base and a party at its own home set nothing.

## Better than Battle Brothers (rule 80)
BB's towns change only when you act. Ours change when the world acts, and the loop closes: stopping the crew on the road (68a) is what keeps the town whole.

## Routed
- RUN (the clock): call H.advanceWatching, then A.traitsFrom(events, seats, rec, day, {stopped, yours}); RUN TWO's town screen reads A.active/A.effects beside its own roll.
- RUN TWO: reconcile settlement_traits.json raided with the wiki page (see above); add well_supplied.
- COMBAT TWO: the burnt variant when a place carries raided.
- WORLD: crews only target fortresses (so camps and towns can never be raided here).
