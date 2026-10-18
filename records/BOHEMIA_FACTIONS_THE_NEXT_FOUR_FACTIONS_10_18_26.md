# THE NEXT FOUR FACTIONS: THE WATER PEOPLE, THE HIRED GUNS, THE HEAD TAKERS, THE FLOCK
FACTIONS lane, round 62, 10/18/26. Row [more banners] (THE-NEXT-FACTIONS-WITH-FACES).
Opened by the coordinator under rule 112; no check-in, no question. The lane is under the rule-88 hold
(pages without sheets): data, a gate, this page. Nothing drawn, nothing in VOTE, nothing in the demo.
NOT IN A TAB. The row's VOTE half (eight banners with their parties) is owed the round the hold lifts.

## THE ONE-LINE ANSWER
The valley had four factions in its table. It has eight now. The four new ones are Battle Brothers'
nomads, mercenaries, bounty hunters and cultists, each in a Bohemia skin, each with a banner ink, a party,
a home ground, a want that moves its parties, a face slot and three draft lines. Every one of the board's
fifteen grounds now has somebody who holds it (five had nobody).

## THE FOUR

| id | our name | banner | home ground | want (moves its parties) | early party -> late party |
|---|---|---|---|---|---|
| nomads | The water people | #a06400 dry ochre | solar_and_pumps | hold-the-water: crews at what stands nearest the pumps | 8 (6 cutthroats, 2 slingers) -> 9 (a leader late) |
| mercenaries | The hired guns | #6e7dff cornflower | the_strip, casino_floor | take-the-contract: walk to the nearest ground with money on it | 6 -> 9 (a hedge knight, a swordmaster, a master archer join late) |
| bounty_hunters | The head takers | #aacd32 bile lime | airport | collect-the-head: patrol the road crews' ground (freeway, hills) | 4 -> 6 |
| cultists | The flock | #ff417d raw crimson | trailer_park | gather-the-flock: hold the trailer park; a chapel off it walks to it | 6 -> 25 (the wiki's own 25) |

## WHAT BATTLE BROTHERS SAYS (every quote re-read out of the wiki tarball by a gate)
| who | the line | page |
|---|---|---|
| nomads raid | "Nomads are basically southern Brigands." | Nomads |
| nomads' ground and want | "They travel the barren desert from one source of water to the next" | Nomads |
| nomad camps | "Their camps have no walls" | Nomads |
| mercenaries roam | "Various mercenary companies can be found roaming around on the Global map and are also actively looking for and accepting Contracts from settlements." | Mercenary Companies |
| mercenaries' late men | "Some companies spawn together with Hedge Knights, Swordmasters, Master Archers or Wardogs." | Mercenary Companies |
| bounty hunters' want | "They demand the bandit leader's head and attack if you refuse." | Bounty Hunter |
| cultists come in events | "You can encounter Cultists only in the Religious Peasants and Come Across Ritual events." | Cultist (Enemy) |
| the flock's size | "Both feature exactly 25 of them." | Cultist (Enemy) |
| the flock's want | "Find more followers, acquire riches" | Davkul Cultists |

## WHAT IS OURS (marked ours/draft in the data, his to correct)
- THE GROUNDS. Only the nomads' has a wiki line (water). The Strip and the casino floor for the hired guns
  (the money in this valley is there), the airfield for the head takers (the last door out, so everyone
  with a price on them tries it), the trailer park for the flock (the people nobody counts).
- THE INKS. Picked by machine, not by eye: inside a hue band that fits each crew, the hex farthest from the
  thirteen canon inks and the three shipped banners by the gate's own colour distance, with strength held
  between 35 and 75 and lightness between 35 and 80. Without that limit the farthest four were pure blue,
  hot magenta, pure green and navy, screaming primaries that fail the analog horror look. Never purple.
  Closest pair now: the head takers' lime at 33.6 from its nearest neighbour (the gate's floor is 25).
- THE MAKE-UPS. Ours, read across from the brigands' early/late split, except the flock's 25.
- THE LINES. Spanglish, draft, a cold, a neutral and a warm line each; said only when PORTRAIT puts a face
  in the slot (WITHOUT A PORTRAIT NOTHING IS SAID, the existing gate).

## MEASURED
- The region's nomad camp on Jean Dry Lake (seed 12345): BEFORE it sent a caravan to the Cartel's storage
  fortress (the parties module has no idea what a nomad is); AFTER it sends a crew at the Network's
  substation, the place with the shortest trip to the pumps. The road crews, the dead and the beasts are
  unchanged; the valley's fourteen seats are byte for byte unchanged on three seeds.
- The valley's ground (seed 12345): pumps 310 cells, Strip 244, airport 102, trailer park 10, casino floor 0
  (so the hired guns walk to the Strip).
- The ancient dead's LOST CITY row is the last wild row with no want; it is not one of the eight.

## THE GATES
- FACTIONS (gates/factions_gate.js): 679/0. Now asks for eight factions and the row's four by id, and that
  every board ground is held; the old 'no faction holds the strip' check became 'a made-up ground answers by
  name'. Red on a false quote, a purple ink, two factions on one ground, an unheld ground.
- WANTS SEND PARTIES (gates/wants_send_parties_gate.js): 111/0, a new leg G: the water people send crews
  and the first has the shortest trip to the pumps; the hired guns walk to the nearest Strip; the head takers
  patrol the nearest freeway or hills and go at no place; a chapel off the trailer park walks to the nearest
  one and a chapel on it holds it; all eight have a want with a rule. Red when the water's ground is swapped
  to the airport, or the head takers' to the Strip.
- REGION BASES 244/0 unchanged.

## ROUTED
- RUN: nothing new to swap; the same BohemiaWants.all call now moves the nomads too.
- PORTRAIT: four new face slots (face-nomads-water-keeper, face-mercenaries-captain,
  face-bounty-hunters-marshal, face-cultists-preacher), portrait null.
- COOK THREE / DIRECTION: four new banner inks for the rig's look; the VOTE sheet (eight banners with their
  parties) is owed when the hold lifts.
- TUNING: the four make-ups are ours and draft.

## [bb more banners] SCHOOL LINE
Battle Brothers ships about a dozen factions on the map and most are a flag and a unit list. Its nomads are
"basically southern Brigands"; its mercenaries are a rival company you can meet anywhere; its bounty hunters
and cultists exist only inside contracts and events. Ours give each of them a ground, a want that moves them,
and a face that will talk.
