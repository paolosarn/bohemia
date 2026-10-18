# THE BAR ON ONE TOWN
FACTIONS lane, row [beef] RELATIONS-BANDS-FROM-THE-WIKI. 10/9/26. MODE: BUILD, data + pure module + gate + one VOTE page. Nothing in the alpha changed.

## Measured first (rule 12)
ECONOMY's contract_terms.json already carried 9 of the Relations page's 15 rows and 4 of its 9 bands. This round does not copy it: records/target/bb/relations.json is the whole page (nine bands, all fifteen rows, start 50, drift 0.25 toward 50, fortified seats share the house bar), each with source and quote, and the gate checks ECONOMY's copy agrees where they overlap.

## Built
- records/target/bb/relations.json; engine/bohemia_relations.js (band, apply, dawn, crime, guardsDraw); gates/relations_gate.js (suite: RELATIONS, 66 checks). The gate extracts the wiki page from the tarball and compares every band and every row to the file, so the data cannot drift from the source. Red 33 ways over data and engine (one first-draft mutation, drift overshooting 50, was silent because integers land on 50 exactly; a fractional leg was added).
- VOTE: THE BAR ON ONE TOWN (slices/vote/FACTIONS_THE_BAR_ON_ONE_TOWN_10_9.html): one town after a job (+10, Open), a seen loaf of bread (-10) and an attack (-30, Unfriendly); the sell percent is ECONOMY's price table for a village (13.6, 14, 13.6, 12.4).

## Ours, marked draft in the file
- CRIME: the wiki lists no theft. Bread maps to Minor Offensive Action (-10), a battery or a car to Offensive Action (-20); only a SEEN theft writes (bohemia_standing's witness rule). No new number.
- GUARDS: the wiki states no guard rule. They draw at 9 or below (the hostile band). A bread thief alone never gets there (50-30=20 after three loaves); it takes betrayal or repeated attacks.

## Better than Battle Brothers (rule 80)
BB's bar is a number on a screen you read. Ours is told by the town's own face once PORTRAIT draws it (the factions file carries the memory bands per faction).

## Routed
- RUN TWO [the market]/[settlement screen]: read relations.json for the bar and the band; price effect stays in price_table.json.
- RUN/COMBAT: guardsDraw(score) decides whether a town's guards fight you; a kill is -0.5 each.
- LIFE+CITY: where a theft is seen (witnesses) calls crime(rec, town, kind, seen).
- ECONOMY: contract outcomes call apply(); its nine-row subset can now point here.
- Still open: [beef] A-SETTLEMENT-COMES-FOR-YOU (parties hunt you at low standing), [raids make traits].
