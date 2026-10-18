# QD-C02: THE COLD BOX
ACT: 1
KIND: contract
CRISIS: none
ECONOMY: bust
PLACE: a clinic run out of a tyre shop on a paved road, and a squatted apartment block three streets away (the job's place; one house tile if it comes to a fight)
STATUS: draft:true, research only, nothing built (rule 35)
CHECKLIST: passes all 32 (QR-AC line-by-line run, 10/1). Fixed in place: 1 (the lie has a tell), 5 and 18 (the act 2 landing and its floor), 10 and 23 (a lost fight at the squat), 15 (the compressor hum), 28 (flags and saves named). (QR-AM 10/10: lines 31 and 32 run, pass as written)
TWIST: T23 THE THING YOU WERE SENT FOR IS A PERSON (bank: questbook/research/QR_C_THE_TWIST_BANK_9_27_26.md). Costs A PERSON. Lands MID-JOB.

## THE SITUATION
A clinic had a medical fridge stolen: a small cold box on a trolley, battery-backed. The clinic's owner pays 10 batteries to get it back from the squat where it was seen. At the squat, the player finds the box on the fourth floor, plugged into a car battery. It is keeping insulin cold for a boy who is asleep next to it. The "stolen goods" are a child's next month.

## THE PERSON AND THE FIRST LINE
Dra. Ines Vela, fifties, a white sculpted coat with the hem burned, sitting on a stack of tyres with a ledger on her knee. She speaks when the player taps the clinic on the settlement screen.
First line: "Somebody took my cold box. Diez baterías if it comes back. I don't need to know how."

## THE SETTLEMENT AND THE OFFER SCREEN
(Added 9/28, Paolo's ruling: contracts are the Battle Brothers settlement contract screen. records/BOHEMIA_PAOLO_QUESTS_ARE_THE_SETTLEMENT_CONTRACT_SCREEN_9_28_26.md. The job after the yes is unchanged; only the front door moved. Research: questbook/research/QR_P_THE_FRONT_DOOR_MOVED_9_28_26.md.)
- SETTLEMENT: a paved-road settlement grown around a tyre shop (a small home base whose one trade is the clinic).
- BUILDING: the clinic (the hall for this place).
- CLIENT PORTRAIT: Dra. Ines Vela, white sculpted coat with the hem burned, ledger on her knee.
- THE SCREEN'S LINES:
  - "Somebody took my cold box. Diez baterías if it comes back."
  - "The squat three streets over. I don't need to know how."
- PAY, SHOWN BEFORE ACCEPT: 10 batteries when the box comes back.
- NEGOTIATION: ASK FOR MORE: "Diez. The box is worth twelve and I am not paying you twelve." ADVANCE: 1 battery if asked, "for the stairs".
- ACCEPT / DECLINE: ACCEPT puts the squat on the map as the job's place. DECLINE, or closing the screen, or never tapping the building, writes nothing: no row, no line, no look, and the offer sits in the same building on the next visit while the job is still real.

## THE CHOICES
- A. TAKE THE BOX BACK. The fee is paid in full. Cost: A PERSON (the boy's mother cannot keep the insulin cold; the boy is not seen again in this act). The clinic's standing rises.
- B. LEAVE THE BOX, REPORT IT LOST. Cost: 10 batteries of fee; the lie to Vela is written TOLD and HAPPENED (she may learn it later). The contract closes as FINISHED with a false report.
- C. BRING THE MOTHER TO THE CLINIC. Tell Vela the truth and walk the mother over. Cost: TIME (a day on the map) and 4 batteries: Vela takes the boy on as a patient but charges for the cold. The fee is paid, minus the charge. Closes as FINISHED.

A LOST FIGHT (QR-AC, lines 10 and 23; `Q095.X3`): if it comes to a fight at the squat and the company loses, it is put down the stairs; the box stays; Vela pays nothing and the contract closes FAILED WHILE TRYING.

## WHAT THE LEDGERS REMEMBER
A: Vela's standing up, the boy's household gone from the block. B: a told/happened pair against the player, discoverable later with a small chance (a clinic worker sees the box in the squat). C: the boy is a clinic patient; in act 2 he is an adult with Vela's clinic, derived from this ledger. DECLINING LEAVES NOTHING: nobody remembers the no; the box stays where it is.

THE LIE HAS A TELL (QR-AC, line 1; `Q128.X2`): if a clinic worker sees the box, the player meets it at the clinic: Vela turns one page back in her ledger and says the squat's address, nothing else.
THE LANDING AND THE FLOOR (QR-AC, lines 5 and 18; `Q121.X1`, `Q022.X2`): the act 2 landing is drawn on arrival at Vela's clinic, the boy grown and at the counter. If the row is unset (act 1 never reached this job), or A or B, a different young clerk sits there and nothing reads it.

FLAGS AND SAVES (QR-AC, line 28; `Q123.X1`, `Q116.X1`, `Q040.X3`): writes cold_box = returned | reported_lost | mother_brought | failed; told_happened pair on B. A play-forward test sets each value and walks to every place that reads it (the clinic worker's chance, Vela's ledger, the act 2 clinic counter); the save lands only at clean states: the offer screen closed, the hand-in, and the map between legs; never mid-fight and never mid-screen.

## THE SIGN (the world testifies first)
In the squat's stairwell there are insulin pen caps on the landing, one per floor, all the way up.

The cold box's compressor hums down the stairwell, louder each floor (QR-AC, line 15; `Q141.X3`: the sign is seen and heard).

## THE ONE WRONG DETAIL
The boy is sleeping with his arm around the cold box like it is a dog.

## CITED FROM
- `Q016.W1`: the MacGuffin is a person; you came for goods, you found a soul.
- `Q148.W6`: mercy made practical by the people it protects (the mother helps you finish C).
- `Q148.P2`: the false report in B writes two entries and can surface later.
- `Q149.W6`: the clean exit costs the player's own coin (C's charge).
- `Q148.P4`: this is the rarest twist in the bank and must stay rare.

## FLAWS IT AVOIDS
- `Q148.X3`: the monster-is-somebody shape is rationed, not the house style.
- `Q148.X1`: B's lie is discoverable, so mercy is not laundered.
- `Q107.X1`: every choice does what it says; "report it lost" is a lie and is labelled as one.
