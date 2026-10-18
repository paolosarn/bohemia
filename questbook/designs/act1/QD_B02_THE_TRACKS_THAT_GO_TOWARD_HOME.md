# QD-B02: THE TRACKS THAT GO TOWARD HOME
ACT: 1
KIND: event
CRISIS: the Destroyers
ECONOMY: bust
PLACE: a fork on the old frontage road where a dirt track leaves toward the settlement the family sleeps in
STATUS: draft:true, research only, nothing built (rule 35)
CHECKLIST: passes all 32 (QR-AC line-by-line run, 10/1; lines 3, 9 and 12 read as not applicable to a road event; 11 is the free KEEP MOVING). Fixed in place: 23 (a lost fight at home has a result), 26 (the youngest asks for something sweet), 28 (flags and saves named); rule 51 applied (both slots can be made late). (QR-AM 10/10: lines 31 and 32 run, pass as written)
SHAPE: E3, THE TRACKS AT THE FORK (QR-B)

## THE SITUATION
Late act 1, while the Destroyers are moving. The party is heading out on a contract. At a fork the tracks of a large
party leave the highway and turn down the dirt toward home. The tracks are real: a Destroyer band crossed here within
the last day, and the map has shown their marks for two trips. The contract is the other way, and it was TAKEN, so
dropping it is a deed.

## THE PERSON AND THE FIRST LINE
The companion kneels in the dirt. Portrait close, one hand flat on a tyre mark.
First line: "Twelve, maybe fifteen. Boots and one cart. Going where we sleep."

## THE CHOICES
1. FOLLOW THE TRACKS HOME. Costs the rest of the day. The contract you took is now late; if you do not finish it,
   it is a dropped contract, which is a deed (standing down with the client's faction). At home: the Destroyer band,
   or nothing (they turned off), depending on where the party really is when you arrive.
2. SEND ONE OF THE COMPANY BACK ALONE. Costs one person out of the company for two days and 2 FOOD for the
   runner (rule 47). The contract stays on time. The runner may arrive in time, may arrive late, may not arrive.
3. KEEP TO THE CONTRACT. Costs nothing now. What happens at home is decided by the simulation, not by a script.

A LOST FIGHT AT HOME (QR-AC, line 23; `Q095.X3`, `Q146.W1`): if the band is there and the fight is lost, they take half the FOOD and WATER at home and burn one lot; the family lives (the main character never dies), and the climax generator counts one Destroyer gain.
TWO SLOTS (QR-AC, rule 51): the company may hold two taken contracts. The fork names the one that lies the other way; if both slots are full, following the tracks makes both late, and the companion says so before the choice: "Both jobs wait if we go."

## WHAT THE LEDGERS REMEMBER
- Time and the contract ledger (choice 1).
- People: the runner (choice 2), and what the runner found.
- The Destroyers' ledger: whether this band reached the settlement feeds the act 1 climax generator, which is
  shaped by how the player played (the builders against the Destroyers).
- The echo: the feed, the next time the player opens the city view, from someone at home.
- Keep to the contract writes nothing about the choice itself; only what the world does.

- One warm beat (QR-AC, line 26; `Q030.X2`): if the band turned off, the youngest at home asks why the company came back early and whether it brought anything sweet.

FLAGS AND SAVES (QR-AC, line 28; `Q123.X1`, `Q116.X1`, `Q040.X3`): writes fork_tracks = followed | runner | kept; runner_fate = on_time | late | lost; band_reached_home = yes | no. A play-forward test sets each value and walks to every place that reads it (the act 1 climax generator, the feed at home, both contract slots' ledgers); the save lands only at clean states: before the event screen opens and after it closes; never mid-choice and never mid-fight.

## THE NARRATOR
Read over the event screen in the machine voice (rule 45: too even, tape and room, a little wrong; never in the first minute; people on the screen still speak in the squiggle): "Twelve sets of boots, and one set that is smaller. They are all going the same way. So are you, eventually."

## THE ONE WRONG DETAIL
Between the boot prints, every few metres, there is one small bare footprint, a child's, and it never falls behind.

## CITED FROM
- `Q089.W6` paths form as people walk them: tracks are traffic written on the ground.
- `Q148.W3` evidence built to be misread once: the band may have turned off, the tracks do not say.
- `Q065.W6` clocks tick for the world whether you engage: home is on its own clock.
- `Q021.W5` triage: every save is a loss somewhere else.
- `Q087.W9` the world executes on its clock: ignore the warning and the town may be sacked.
- `Q038.W3` navigate by reading the land.

## FLAWS IT AVOIDS
- `Q038.X3` hints too subtle (the companion says the count and the direction plainly).
- `Q148.X2` a trail that cannot be misread (this one can lead to an empty settlement and a late contract).
- `Q044.X1` pure random (the band is a real party, shown on the map for two trips).
