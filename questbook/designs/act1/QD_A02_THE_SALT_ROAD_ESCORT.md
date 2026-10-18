# QD-A02: THE SALT ROAD ESCORT
ACT: 1
KIND: contract
CRISIS: none
ECONOMY: boom
PLACE: a truck stop on the old interstate at the valley's north edge; the escort runs on the map to a salt flat camp
STATUS: draft:true, research only, nothing built (rule 35). Names and lines are attempts; Paolo's to change.
CHECKLIST: passes all 32 (QR-AC line-by-line run, 10/1). Fixed in place: 9 (three ways past the gun truck), 10 and 23 (a lost fight pays half and rolls on), 12 (the halfway well), 15 (headlights with the horn), 22 and 26 (the feed post, the salted fish), 28 (flags and saves named). (QR-AM 10/10: lines 31 and 32 run, pass as written)
SHOWS: the "TOO STRONG FOR YOU" no, made safe by an honest offer; and a spoken, audible window (C3, C7, C11, C13)

## THE SITUATION
A short boom inside the anarchy decade: somebody found salt, and salt keeps meat. Caravans run north daily and pay
well, because the road has a crew with a gun truck. This job is priced for people with more than one companion.

## THE PERSON AND THE FIRST LINE
Yesenia Ochoa, caravan boss, cropped silver jacket over a welder's apron, stands at the diesel pumps with a clipboard
made of a car door. When the player taps the diesel office on the truck stop's settlement screen:
"Doce baterías to ride shotgun to the salt camp. I tell you straight: ocho hombres on that road, and a truck with a
gun bolted on. We roll at first light. The horn goes twice before we move."

## THE SETTLEMENT AND THE OFFER SCREEN
(Added 9/28, Paolo's ruling: contracts are the Battle Brothers settlement contract screen. records/BOHEMIA_PAOLO_QUESTS_ARE_THE_SETTLEMENT_CONTRACT_SCREEN_9_28_26.md. The job after the yes is unchanged; only the front door moved. Research: questbook/research/QR_P_THE_FRONT_DOOR_MOVED_9_28_26.md.)
- SETTLEMENT: a truck-stop settlement on the old interstate at the valley's north edge (a trade stop, not one of the big home bases).
- BUILDING: the diesel office by the pumps (the hall).
- CLIENT PORTRAIT: Yesenia Ochoa, cropped silver jacket over a welder's apron, the car-door clipboard in frame.
- THE SCREEN'S LINES:
  - "Doce baterías to ride shotgun to the salt camp."
  - "I tell you straight: ocho hombres on that road, and a truck with a gun bolted on."
  - "We roll at first light. The horn goes twice before we move."
- PAY, SHOWN BEFORE ACCEPT: 12 batteries at the salt camp. The screen shows the danger (eight men, a gun truck) next to the pay, so a too-strong job reads as too strong before the yes.
- NEGOTIATION: ASK FOR MORE: she will not move on the pay ("Doce is the road's price"), but the one push gets an ADVANCE of 2 batteries, which turns a missed horn into a debt. The player chooses whether to carry that risk.
- ACCEPT / DECLINE: ACCEPT puts the dawn horn on the map's clock. "Too much for me" is the decline button's line. DECLINE, or closing the screen, or never tapping the building, writes nothing: no row, no line, no look, and the offer sits in the same building on the next visit while the job is still real.

## THE CHOICES
1. **"Too much for me."** She does not argue and does not talk down. "Claro. The road will be here." COST: nothing.
   No line anywhere ever reads this answer (C7). The player who comes back in Act 1 with a bigger company hears the
   same offer, at the day's price (C18).
2. **"Deal."** TAKEN. The window is stated: first light. The night before, the horn is tested once, loud, from the
   lot (the audible clock). At dawn it sounds twice, and the lead truck's headlights flash twice with it, drawn at the lot on the map (QR-AC, line 15; `Q141.X3`: the clock is heard and seen). If the player is at the lot, the party marker joins the convoy on
   the map; time passes as it rolls; on the road an EVENT stops it (the gun truck across the lane, a face, two or
   three choices) and the fight is on the fight board around the trucks. Win: twelve batteries at the salt camp.
   COST: a map day each way, and real danger.
3. **"Deal", then not being there at dawn.** The horn sounds twice from the lot and the convoy goes without him. That
   is a DROP, heard, never a pop-up. COST: no advance was paid, so no debt; Yesenia does not offer again; the
   drivers who went short-handed tell it at the pumps (C13). If the convoy is hit because it went one gun short, that
   loss is a world event, and it names the empty seat.

THREE WAYS PAST THE GUN TRUCK (QR-AC, line 9; `Q087.X4`): fight on the fight board around the trucks; let Yesenia pay the road crew a sack of salt off the load (her call, the same 12 to him); or turn the convoy down the dry wash, a map day longer, behind the crew's lookout.
A LOST FIGHT (QR-AC, lines 10 and 23; `Q095.X3`, `Q146.W1`): the crew takes one truck's salt and lets the rest roll; Yesenia pays half, 6, at the camp. FAILED WHILE TRYING, never a reload.
THE PRICED EXIT (QR-AC, line 12; `Q139.P2`): at the halfway well he may say he rides no further; she pays 4 there and takes on a gun from the well camp. FINISHED, not dropped.

## WHAT THE LEDGERS REMEMBER
- Declined: nothing. The convoy rolls with whoever else took the seat.
- Done: a deed ("rode the salt road with Ochoa"), and a door that stays open: she offers the next run first.
- Dropped by missing the horn: a deed, with the drivers' story travelling at walking speed.

THE FREE NO HAS A FLOOR (QR-A C19, rule 47): declining costs nothing on the treasury either; SCAVENGE on this settlement screen covers the company's keep in FOOD and WATER at a thin margin, so one declined offer never forces the next yes (`Q236.X4`).

DONE, SHOWN (QR-AC, lines 22 and 26; `Q078.X2`, `Q030.X2`): the feed carries a driver's post from the salt camp, and at the camp the cook tries to teach the companion to salt a fish, badly, and they both laugh.

FLAGS AND SAVES (QR-AC, line 28; `Q123.X1`, `Q116.X1`, `Q040.X3`): writes ochoa_salt = done | half | halfway | dropped. A play-forward test sets each value and walks to every place that reads it (her next run's offer, the drivers' story at the pumps, the convoy world event that names the empty seat); the save lands only at clean states: the offer screen closed, the hand-in, and the map between legs; never mid-fight and never mid-screen.

## THE ONE WRONG DETAIL
Strapped to the roof of the lead truck is a child's car seat, buckled, facing backward, empty every trip.

## CITED FROM
- `Q060.W1`: perfect information; the danger is told before the yes, so a no is informed and shameless.
- `Q051.W6`: no level-scaling; jobs too strong for you exist and are meant to be walked past.
- `Q040.W9`: the hard content is opt-in and signposted.
- `Q119.X3`: a timer nobody feels is not there; the horn makes the window audible.
- `Q011.P3`: a missed window reroutes (the convoy goes on), it does not softlock.
- `Q087.W9`: the world executes on the clock; the convoy leaves at dawn whether you are there or not.
- `Q094.W4`: one broken promise travels through a trust economy; the drivers carry it.

## FLAWS IT AVOIDS
- `Q095.X1`: no silent expiry; the window is spoken and heard, and no other quest can close it.
- `Q038.X1`: no hard countdown on the screen; the clock is a horn and a dawn.
