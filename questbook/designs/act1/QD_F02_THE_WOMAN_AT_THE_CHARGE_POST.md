# QD-F02: THE WOMAN AT THE CHARGE POST
ACT: 1
KIND: contract
CRISIS: none
ECONOMY: bust
PLACE: a ruined street corner: a street with its sidewalks, a crushed car, a public charge post with six sockets, a pump house down the road (on the fight board, about five house-sized tiles: the corner, the car, two street tiles, the pump house)
STATUS: draft:true, research only, nothing built (rule 35)
CHECKLIST: passes all 32 (QR-AC line-by-line run, 10/1). Fixed in place: 1 (the cord has a tell), 10 and 23 (a lost push has a result), 12 (stop at the car), 22 and 26 (the full drum, the companion drinks first), 28 (flags and saves named). (QR-AM 10/10: lines 31 and 32 run, pass as written)

## THE SITUATION
(9/28: the second-by-second walk was the round-one front door. Swept 9/29 for VAMILY rules 38 to 40: the walk is dead; the first sixty seconds are the settlement screen, and the push after ACCEPT is played on the fight board, house-sized tiles cut from this corner. See QR-P and QR-W.)
The corner is drawn on the settlement screen in one view. Across the street a woman in a long draped coat (the
runway rule) sits on an upturned bucket beside a hand cart. On the cart: a water drum and a cart battery.
She is at the charge post, which has six sockets; five are dark. She is waiting for the one lit socket,
which somebody else's cable holds.

SECOND BY SECOND (on the settlement screen):
- 0-10 s: the corner drawn; tapping the crushed car rocks it on its springs. A generator somewhere
  down the block.
- 10-30 s: the post and its five dead sockets are in the picture. SCAVENGE on the corner turns up, in
  the car's footwell, a cable with two good clamps. The wrong detail is on the post.
- 30-60 s: the silent choice: TAKE the cable (a thing that charges things), or leave it. Down the street,
  three scavengers pry at a pump-house shutter; they do not turn. The woman does not look up.
- 60-180 s: if he taps the charge post, she speaks (below). The scavengers are only met if he takes
  the job; nothing on this screen starts a fight.

## THE PERSON AND THE FIRST LINE
Only after 60 s and only when he taps the charge post on the settlement screen, portrait on. She is NINA (one of the four people the revamp list
keeps as people you meet; the name is Paolo's to change): "Soy Nina. That one works. The man whose cord
that is has been charging for six hours. I don't have six hours. Can you push?"

## THE SETTLEMENT AND THE OFFER SCREEN
(Added 9/28, Paolo's ruling: contracts are the Battle Brothers settlement contract screen. records/BOHEMIA_PAOLO_QUESTS_ARE_THE_SETTLEMENT_CONTRACT_SCREEN_9_28_26.md. The job after the yes is unchanged; only the front door moved. Research: questbook/research/QR_P_THE_FRONT_DOOR_MOVED_9_28_26.md.)
- SETTLEMENT: a ruined-corner home base (the first place in reach of the start; one of the fourteen, the one nearest the family's).
- BUILDING: the public charge post (a building-slot on the settlement screen: six sockets drawn, five dark, all six showing the full-charge icon: the wrong detail is visible from the menu).
- CLIENT PORTRAIT: Nina, long draped coat, on an upturned bucket beside a hand cart with a water drum and a cart battery.
- THE SCREEN'S LINES:
  - "Soy Nina. That one works."
  - "The man whose cord that is has been charging for six hours. I don't have six hours."
  - "Push my cart to the pump house. Una batería."
- PAY, SHOWN BEFORE ACCEPT: 1 battery at the pump house.
- NEGOTIATION: ASK FOR MORE: "I have one." ADVANCE: none. If the cable from the corner has been SCAVENGED (the settlement screen's scavenge button can turn it up), a third option shows: jump her battery yourself, 1 battery, she stays.
- ACCEPT / DECLINE: ACCEPT opens the corner on the fight board for the push (the job's ground, with the scavengers at the pump-house shutter). 'Walk on' is the decline. DECLINE, or closing the screen, or never tapping the building, writes nothing: no row, no line, no look, and the offer sits in the same building on the next visit while the job is still real.

## THE CHOICES
1. TAKE THE CONTRACT: push her cart down the road to the pump house (a slow push, one house tile every
   two beats, past the scavengers). Pays 1 battery. Time: a routine fight's length at most, 2 to 4 minutes.
   If the scavengers are still there, she waits behind him while he deals with them or goes the long way
   round (two more tiles).
2. TAKE IT, AND USE THE CABLE: if he took the cable, he can jump her battery off the working socket
   himself instead. Pays 1 battery and she stays; the man whose cord it was will notice later.
3. DECLINE (walk on). Nothing. She is on her bucket the next time he opens the settlement, same building, same line.

A LOST PUSH (QR-AC, lines 10 and 23; `Q095.X3`): the scavengers take her cart battery; she keeps the drum; nothing is paid; FAILED WHILE TRYING, and she is on her bucket at the post next visit.
THE PRICED EXIT (QR-AC, line 12; `Q139.P2`): he may push her as far as the crushed car and stop; she pays nothing, pushes the rest herself, and the contract closes FINISHED.

## WHAT THE LEDGERS REMEMBER
The cable (taken or left) and, if taken, whether it was used on the post. The contract: taken and
finished, or taken and dropped (a deed: she is not at the post again). DECLINING LEAVES NOTHING: no row,
no line, no look.

THE CORD HAS A TELL (QR-AC, line 1; `Q128.X2`): if he used the cable, the next visit shows the man at the post holding his unplugged cord, asking the corner, out loud, who did it.
DONE, SHOWN (QR-AC, lines 22 and 26; `Q078.X2`, `Q030.X2`): on the next visit her drum is full in the pump house line, and she lets the companion drink first.

FLAGS AND SAVES (QR-AC, line 28; `Q123.X1`, `Q116.X1`, `Q040.X3`): writes corner_cable = taken | left; cable_used = yes | no; nina_push = done | jumped | half | failed | dropped. A play-forward test sets each value and walks to every place that reads it (the man with the cord, Nina at the post or in the pump line); the save lands only at clean states: the offer screen closed, the hand-in, and the map between legs; never mid-fight and never mid-screen.

## THE ONE WRONG DETAIL
The charge post's little screen shows the full-charge icon on all six sockets, five of them with nothing
plugged in.

## CITED FROM
- `Q013.W6`: the job starts by walking past a person; after 9/28 the walk-past is the building he does not tap.
- `Q095.W3`: she is introduced by what she is doing (waiting for a socket), not by speech.
- `Q126.W3`: declining costs nothing and the offer stays standing in the same building.
- `Q050.W9`: the scavengers are visible and fought in place, never a random ambush.
- `Q140.W8`: the fight has a real off-ramp: one tile back.

## FLAWS IT AVOIDS
- `Q087.X4`: not a fetch; it is a person with a situation and a queue.
- `Q131.X7`: the dignity of the no is that she is still there, not a speech.
- `Q081.X4`: no faction names; the first name is hers, after 60 s.
