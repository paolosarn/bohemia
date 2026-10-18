# WHAT A FACTION WANTS DECIDES WHERE ITS PARTIES GO
FACTIONS lane, round 61, 10/18/26. Row [wants send parties] (WORLD [parties move] BUY half).
Opened by the coordinator under rule 112; no check-in, no question. The lane is under the rule-88 hold
(pages without sheets): a page, a data file, a module nothing live reads yet, and a gate. Nothing drawn,
nothing in VOTE, nothing in the demo. NOT IN A TAB.

## THE ONE-LINE ANSWER
Battle Brothers does not send raiders at the strongest enemy. It sends them at the NEAREST village and at
the caravans on the roads near the camp. So now our road crews go at whatever stands nearest the freeway on
their way, whatever its size, and the dead go at the nearest place, a raided one first. Camps and towns get
hit for the first time.

## MEASURED FIRST (rule 12)
- The valley's parties module (engine/bohemia_parties.js) sends 28 parties; 4 are crews. On five seeds
  (12345, 1, 7, 42, 999) all 4 go at a FORTRESS: Cartel twice, Remnants once, Caravans once. The reason:
  hostilesOf() ranks targets by the worst canon blood, and his graph's only feuds are between those three
  fortresses (Cartel/Remnants permanent war, Cartel/Caravans prey-tax). A camp or a town has never been a
  target.
- Handed the region's eight wild locations (records/target/bb/region_bases.json) beside the valley, the
  road crews, the dead and the beasts all send CARAVANS (two each), because between() has never heard of
  them. One road crew's caravan was going to the nomads' camp.

## HOW BATTLE BROTHERS DOES IT (every quote re-read out of the wiki tarball by the gate)
| what | the line | page |
|---|---|---|
| raiders hit the nearest village | "You will face either Brigands or Zombies, whichever has a closer distance to the settlement." | Defend Settlement Bandits |
| a raid hits the outlying places | "enemies raiding their Attached Locations" | Defend Settlement Bandits |
| a camp harasses a village | "a spawnpoint that sends out parties to harass a village" | Developer Posts |
| raiders live off the roads | "a spawnpoint of enemies close to trade routes ... reduced the frequency of caravans getting raided" | Developer Posts |
| a camp grows on what it takes | "An Orc camp sends out raiders that successfully raid a couple of caravans ... Now the camp buys even more raiders" | Developer Posts |
| ambush by the road | "the AI prefers to lay in ambush in the forest tiles near roads" | Developer Posts |
| castles patrol the roads | "the guard towers and castles send out patrols to secure roads" | Developer Posts |
| the house lives on supply | "watchtowers and castles rely on military supply caravans" | Developer Posts |
| the dead raid for bodies | "undead will not raid caravans for the money, but to create more corpses for their army" | Developer Posts |
| what a raid leaves | "This place has been recently raided!" (-50% items, -50% recruits) | Raided (Settlement Situation) |
| beasts roam | "Various wild beasts roam the lands." | Beasts |

The wiki never prints a target-picking formula. What it prints is: nearest first, roads matter, castles
guard roads, the dead want bodies. That is the whole rule we took.

## OURS (records/target/bb/wants.json, no new numbers)
| want (factions.json) | sends | goes at | order |
|---|---|---|---|
| hold-the-freeway (road crews) | crews, REACH[tier] of them | any place of another faction, ANY SIZE | the trip: camp to place plus place to the nearest freeway cell, shortest first |
| hold-the-depot (the House) | one patrol first, the rest is the parties module's | the nearest industrial ground (warehouse, railyard, storage lot) | nearest |
| finish-the-work (the dead) | crews | the nearest places, any size | raided places first (our ruin is a condition, not a ground), then nearest |
| keep-the-ground (the beasts) | patrols | never a place: a den on its own ground holds it, else the nearest open desert or wash | nearest |

Who goes first is the map's own distance. How many go is BohemiaTowns.REACH. The grounds are
BohemiaBoardTerrain's kinds. A wild seat goes at every settlement and never at another wild seat; a settled
seat with a want only goes at its own canon feuds.

## AFTER (the gate, real valley seed 12345 plus the region's rows)
- Road crews: 2 crews (were 2 caravans). Railroad Pass goes at Henderson (the Trades' town); Sloan quarry
  goes at the Cartel's storage fortress in the valley's south-west, 3 blocks off the freeway.
- The dead: 2 crews (were 2 caravans): Apex goes at the Volunteers' medical camp in the valley, Nelson at
  Searchlight (a camp).
- The beasts: 2 patrols holding their own dens (were 2 caravans into town).
- The wanting crews' marks: 2 camps, 1 town, 1 fortress. Before: 0 camps, 0 towns.
- The valley's fourteen seats and every other seat without a want: byte for byte unchanged.

## WHAT IT IS AND IS NOT
- engine/bohemia_wants.js COMPOSES with the parties module: BohemiaWants.all(towns, opts) is
  BohemiaParties.all with the want deciding a wanting seat's parties. WORLD's file is not edited. The parties
  it makes have exactly the parties module's shape plus one field, `want`, so advance(), legOf() and say()
  take them unchanged (the gate drives all three).
- For RUN: call BohemiaWants.all(seats.concat(regionRows), { n, data: { factions, wants }, cells }) where
  you call BohemiaParties.all today. `cells` is BohemiaWants.cellsOf(om, BohemiaBoardTerrain) for the valley
  plus, on the region, every passAt(x, y) === 1 cell as { x, y, kind: 'freeway' }. Pass `raided` as
  { 'x,y': 1 } for places carrying the raided trait ([raids make traits], arrival_traits.json) and the dead
  go there first.
- The gaps (written in the data file): ancient_dead, nomads and mercenaries have no want yet ([more banners]
  gives them one); the valley's fourteen canon factions have no want of their own and this lane does not
  invent one from his notes, so their crews still go at their worst feud's seat; outside the valley the
  freeway distance is only as good as the road cells RUN hands in (the gate uses the valley's freeway, so a
  region place's trip is honest but long).

## [bb wants send parties]
Battle Brothers' camps are not aimed: they are near. The wiki's whole targeting story is distance and roads,
and a camp that raids well grows (it buys more raiders). Ours keeps the near and the road, and lets the want
say WHICH road: a crew that wants the freeway hits what stands by the freeway.

## [better than bb] (not built)
In Battle Brothers you never know why a party is going where it is going. Ours carries `want` on every
party, so the map card can say it in one face-and-line: "the road crew is going for Henderson, because it
wants the freeway". When the hold lifts, the card reads p.want and the faction's voice line.

## Analog horror line
A crew's target is never shown as an arrow. It is a town that goes quiet on the map a day before the crew
arrives: its light flickers on the far stop, the feed stops posting from it (rule 9/4 feed). That is for RUN
and SOUNDS when the hold lifts; nothing drawn here.

## Routed
- RUN [parties on the map] / [the map at Battle Brothers' size]: swap BohemiaParties.all for BohemiaWants.all
  with the region's road cells as freeway (the seam above).
- WORLD [parties move]: no edit to your file. hostilesOf's wild:true one-liner is no longer needed for the
  four wanting factions; it still matters for the three without a want.
- TUNING [the one table]: nothing; no number added.
- COMBAT (my lead, rule 113a): FACTIONS, a page and a gate, NOT IN A TAB, COOKING.

## Proof
gates/wants_send_parties_gate.js (WANTS SEND PARTIES, registered): 75/0; red on ten mutations of the module
(trip order, raided first, wild-at-wild, den holds, REACH cap, agenda, the want field, the want lookup) and on
a false quote and a false ground in the data file.
