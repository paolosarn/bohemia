# WHEN A SETTLEMENT COMES FOR YOU
FACTIONS lane, row [beef] A-SETTLEMENT-COMES-FOR-YOU. 10/10/26. MODE: BUILD, research first as the row says, then data + pure module + gate + one VOTE page. Nothing in the alpha changed.

## Research (how Battle Brothers does it, from the wiki dump, not from Grok)
- Grok's ask 18 came back empty and the wiki dump agrees on the negative: no page gives a theft cost or a hunt threshold for a settlement.
- WHAT THE DUMP DOES SAY, and it is enough for two thresholds (quoted in hunted.json, verified against the tarball by the gate):
  1. Noble Houses: a house's patrols "Can be encountered through the Noble War, Holy War or by just being hostile to one of the houses through one of several ways." So hostility to a house brings its patrols. Our reading: the Hostile band (0 to 9).
  2. Factions and Relations: caravans "can be attacked by the player ... if he doesn't have an active contract and when the player has a low relation with the settlement it originates from (usually a relation with the status 'threatening' or lower)." So the raid-a-caravan door opens at Threatening (0 to 19) and only with no contract.
  3. Fortified houses: patrols "secure the streets between the settlements of their house"; soldiers spawn at a castle when a threat comes near.
- NOT in the wiki: crews hunting you for a bad name. So crews never do, here. Only patrols.

## Built
records/target/bb/hunted.json; engine/bohemia_hunted.js (huntersFor, attackable, contractAgainst), reading bohemia_relations.js's bars and relations.json's bands by NAME so the thresholds live in one place; gates/hunted_gate.js (suite: HUNTED, 35 checks; red 17 ways; two survivors, the fractional edge and the band's upper end, got legs at 5, 9, 9.5, 10 and 15, 19, 19.5, 20). Runs on the real valley's parties (seed 12345).
VOTE: WHEN A SETTLEMENT COMES FOR YOU: one faction through two contracts against it, forty mornings, eighty mornings: who hunts, which caravans open.

## Measured on the real valley
Nobody hunts a company nobody wronged. One contract against a faction (-30) leaves it Unfriendly and changes nothing; two floor it, and exactly its own patrols hunt and its caravans open; forty mornings later the patrols stop and the caravans stay open (10 is Threatening); eighty mornings in the door shuts. Three seen loaves of bread never get there (50 to 20); two seen batteries on top do.

## Ours, draft
Contract against a settlement = the wiki's Attacking Them (-30), mapped not invented. The Hostile reading of "hostile". Crews never hunt for standing.

## Better than Battle Brothers (rule 80)
Battle Brothers hides all of this behind a colour change on a caravan. Ours says in the open why a patrol is after you and how many mornings it takes to cool.

## Routed
- RUN (the clock / the map): call huntersFor on the map's party list each morning; a hunting patrol's agenda turns toward the company's marker. attackable() decides whether the caravan's card offers a raid.
- COMBAT/LIFE+CITY: where a seen theft is witnessed calls R.crime.
- RUN TWO: contract acceptance against a settlement calls contractAgainst.
- Next OPEN rows written from the jump list (rule 74): [who guards], [houses at war], [faces meet again].
