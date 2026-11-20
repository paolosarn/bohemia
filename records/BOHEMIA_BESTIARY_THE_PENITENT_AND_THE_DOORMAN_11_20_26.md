# BESTIARY: THE PENITENT AND THE DOORMAN -- TWO MORE TYPES, 72 OF ABOUT 75 -- 11/20/26
# The coordinator's routine 'BESTIARY: the whole enchilada' (VAMILY rule 461, Paolo 11/20: 'full sweep, whole enchilada, dont forget
# nothing'; rules 441, 454(a)). Bugs first: none filed against this lane (EYES' 11/18 walk saw the mammoth at its size; FIXES and
# FIGHT SCREEN hold no BESTIARY row). One found by this round's own count and fixed (section 3).

## 1. THE FLOOR, ONE TABLE
| floor | his number | the fight fields | short |
|---|---|---|---|
| factions | 12 | 12 | 0 |
| enemy types | about 75 | 72 (70 before this build) | 3 |
| beasts | 17 | 18 lab-made (23 fielded), each its size against a man (F11, F11b) | 0 |
| bosses | 3 | 10 | 0 |
| champions | some | 3 kinds, each a named man | 0 |
FURTHEST FROM THE FLOOR, MEASURED: the flock 2 types, the eye in the sky 2, the hired guns 3, the head takers 3, the machines 2
(robot art first). So the flock's third and the eye in the sky's third.

## 2. THE TWO (records/target/bb/bohemia_enemies.json, added_by BESTIARY 11/20; words drafts for WORDS, numbers for TUNING)
| type | party (where met) | rides (wiki) | the one thing only he does | his lesson | measured (10 AUTO fights, a crew of 6) |
|---|---|---|---|---|---|
| PENITENT | the flock, from the early phase (1 in 5) | cultist (never breaks) | the BOND (the Hexe's Hex, bb_all/0991_Hexe.txt): he binds the most hurt man of yours inside 4 tiles for two rounds; every hurt a blow does him, the bound man takes too, straight through his armour | Hurt him and your bound man bleeds too. Drop him in one blow, or leave him. | 50 binds, 27 hurts shared; crew wins 10/10 (8 without him) |
| DOORMAN | the eye in the sky, from the early phase (1 in 4) | assassin, a shamshir | the BACK DOOR (the Necrosavant's Darkflight, bb_all/1412_Necrosavant.txt; the Assassin's Footwork onto 'someone vulnerable'): once a fight he comes out beside a shooter of yours with no friend beside him, inside 6 tiles, past every line | He comes out of a door beside your shooter. Keep a man by every shooter. | 6 doors; 8/10 (8) |
The words (rule 454(a)): 'X binds Y.' 'Y bleeds with him.' 'X comes out behind Y.' Nothing standing was touched.
The engine (slices/BOHEMIA_FIGHT.html): bondTarget/bond/bondHurt (apply), doorTarget/backDoor; on the page the doorman stands where
he was until his note plays, then he is out of the door (no glide through the houses).

## 3. A BUG FOUND AND FIXED (the spotter's, BUILD 11/17zi)
The live-rules count gave the doorman a 'called ground hit' he never called. MEASURED: setup() cleared the fire and the smoke between
fights but not the spotter's called ground (S.calls), so a call left standing when a fight ended landed in the next fight on whoever
had that spotter's number. On the page a fight is its own frame, so it showed only where one frame plays two fights; now setup() clears
S.calls with the fire and the smoke. Re-measured: the doorman 0 calls, the spotter 10 calls, 9 hit.

## 4. THE CLOTHES (STAND-INS; CHARACTER has the list)
The penitent wears faction_homeless (no enemy band wore it: the flock is the trailer park's people); the doorman person_mob_2 (taken
from the raiders' pools, each keeps five or more). Their own clothes: the penitent (sackcloth and a rope belt, ash on his face), the
doorman (casino security's black suit and an earpiece).
[bb Battle Brothers' Hexe makes a brother pay for every blow she takes; ours is a man of the flock who asked for it.]
[analog horror: a man you never touched falls down bleeding in the back row, and across the street the penitent smiles.]

## 5. PROOF
On the page (gates/the_bestiary_floor_fight.js, ONLY_MEN, the two): on the demo and the alpha, a phone upright and sideways, each
fielded in his clothes, named and armed, his party's words, the win home, and HIS MOVE PLAYED ON THE PAGE on AUTO with the phone's own
buttons: the penitent's bound man bled with him in round 4 to 9, the doorman came out beside a shooter in round 2; 8 of 8, the page
threw nothing. The champion leg went empty once (the alpha on its side, an encounter whose band carried none); re-run, BIG CHUY, THE
ROAD CREW'S CHAMPION on his card. THE BESTIARY FLOOR --no-browser 13/0 (F2 ratchet 72). The card:
records/target/BESTIARY_THE_PENITENT_AND_THE_DOORMAN.jpg (VOTE bestiary-the-penitent-and-the-doorman-11-20, STAND-IN: the clothes
are borrowed; two frames re-picked where a battery vest's white flash covered the board).
