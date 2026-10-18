# WHO GUARDS THE SIX PLACES
FACTIONS lane, row [who guards] WHO-GUARDS-THE-GOD-GEAR. 10/10/26. MODE: BUILD. Nothing in the alpha changed.

## Verdict read first
THE BAR ON ONE TOWN: thumbs up, "You cant even steal bread wtf are you talking about but I like the rest". Read as: he likes the bar and the bands; his line is his old complaint that the game has no theft, which the card's own bread row answers only on paper (nothing in the live game lets you steal yet). No change made; the crime rows stay as drafts and the routing to RUN (witnessed theft calls R.crime) stands.

## A BUG IN MY OWN EARLIER DATA, found while doing this row (rule 12)
factions.json's `ground` lists used names I made up (road, interchange, depot, town, graveyard, scrub, wash): SEVEN of ELEVEN were not terrain kinds the game has (BohemiaBoardTerrain has 15). Nothing read them, so no gate caught it. Now: every ground is a real kind, the gate checks it, every wiki quote (behaviour and ground) is re-read from the tarball (it also found that the Brigands "woods, hills and wilderness" line lives on Factions and Relations, not on the Brigands page where my note put it).

## Built
- factions.json: grounds now real kinds (brigands freeway and hills; the house industrial, suburb block, lot and big box, golf and park; the dead ruin and landfill; beasts open desert and wash and shore), each ours with a note and a verified wiki quote where one exists; `leaders` per faction (one to a band, ours).
- engine/bohemia_factions.js guardFor(kind, total, phase): the holder of that ground, its own make-up scaled to exactly `total` men by largest remainder (leaders stay at one), or NO_FACTION_HOLDS_THIS_GROUND by name. Gaps list the five kinds nobody holds (the strip, trailer park, airport, casino floor, solar and pumps).
- gates/factions_gate.js: 153 to 214 checks; red 33 ways (the original 23 plus 10 new data mutations and 6 engine mutations; three first-draft survivors, an unheld-ground that no leg required to be written down, a tie-break nobody tested, a default phase nobody tested, each got a leg).
- VOTE: WHO GUARDS THE SIX PLACES.

## The honest result
All six legendary places (WORLD's) stand on industrial or suburb block, which the table gives to the House. So one banner guards all six and only the size changes (10 to 60). That is what the ground says; the cure, if it is boring, is one line (move a ground) or WORLD giving places a second claim, not a thing to fake here.

## Routed
- WORLD: GUARDED_BY in engine/bohemia_godgear.js can now be fed by F.guardFor(BT.kindOf(district), guard) instead of answering NO_RULING.
- COMBAT: the party is real enemy ids from enemies.json.
- PORTRAIT/PEOPLE: the House's man could be the guard captain (the leader slot).
