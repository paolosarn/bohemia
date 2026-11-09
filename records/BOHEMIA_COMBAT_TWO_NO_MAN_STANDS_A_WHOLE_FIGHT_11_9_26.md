# NO MAN STANDS A WHOLE FIGHT (COMBAT TWO, 11/9/26)

VAMILY rule 435(c), ask line 540. Paolo 11/9, after 11/8d: "one of my guys is still not doing anything on auto combat." The
coordinator: the 11/8d gate let a man in cover holding with no target count as acting, EYES counted 61 of 61 turns acted, and he
still sees one man idle; hunt a man who never acts in a WHOLE fight, over hundreds of AUTO fights with every crew he can have, on
every board kind; fix the root; the gate: no able man stands a whole fight (holding is allowed for a turn, never a fight).
BUILD 11/9g - NO MAN STANDS A WHOLE FIGHT. BUILT, NOT YET SEEN. VOTE combat2-no-man-stands-a-whole-fight-11-9 (stand_in).

## THE HUNT (headless, the live fight's rules, both sides on AUTO, up to 30 rounds)
Crews of every kind: two-handers, one-handers with a shield, the pistol, the javelin, the bow, the crossbow, the guns, the
throwables (nets, flasks, pots), the sling, the six new one-handers; a man wounded (hit points missing); a man with a second weapon
in his bag; the Lone Wolf alone. Boards: the fifteen place boards, two towns, the casino floor, the freeway, the graveyard, the pool
pit. A man counts when he is on the field two or more of his turns and never moves or strikes before the fight ends.
- BEFORE (main d42868958): 7 of 705 men over 120 fights stood a whole fight (8 to 10 rounds each): six in one lab fight (a hand
  cannon, a pump shotgun, a smoke pot, two flash pots, a lute), one pump shotgun downtown.
- THE CAUSE, traced turn by turn: every one stood on ground CUT OFF ON FOOT from every man of theirs: downtown north of Fremont's
  canopy (the arcade runs edge to edge) while the fight was south of it; in the lab, inside a chain-link pen. AUTO's hunt read
  'out of reach' every turn (the walk to them never existed), and 11/8d's gate called that his right (rule 435(b)'s exception), so
  neither the gate nor EYES' count ever saw him. The weapon did not matter: the shotgun man had a dagger in his bag and no walk.
- WHY HE WAS THERE: the fight's ground (meetMap) was every tile his front column reached; where a wall splits the board, that column
  stands on both sides of it, so the ground was both halves, and his men were dealt onto either.

## THE FIX (slices/BOHEMIA_FIGHT.html meetMap, deployCrew)
- The fight's ground is ONE walkable piece: of the pieces his front column stands on, the one with the most room in his columns
  (then the bigger). His line, the kept formation, the overflow rows and every fallback, their line, the camp and the pincer are
  placed only on it. Every man of either side starts with a walk to the other.
- AFTER: 0 of 1,719 men over 300 fights stood a whole fight.

## GATE
gates/every_man_acts_on_auto_gate.js (EVERY MAN ACTS ON AUTO, registered) 9/0, two new legs: M4 NO MAN STANDS A WHOLE FIGHT (1,263 of
1,263 men over 200 fights, 10 kinds of man, 21 kinds of board; no 'out of reach' excuse) and its plant (one man's AUTO brain answers
'hold' every turn, caught); M5 EVERY MAN STARTS WITH A WALK TO THE OTHER SIDE (2,477 of 2,477 men of both sides) and its plant (a
man put north of the canopy, caught). M1 to M3 as before.
ALSO RUN, ONE AT A TIME: THE FORMATION IS KEPT 23/0, THE OLD LAYOUT THE NEW HOUSES 25/0, EVERY FIGHT ENDS 10/0, THE ENEMY WANTS TO
LIVE 4/0, AUTO PLAYS THE BEST TURN 7/0, THE BOARD IS THE CITY AT THAT SPOT 194/0 (the rest in the commit).

## WEAK, SAID OUT LOUD
- A board whose biggest piece has little room in his columns puts his overflow men further back on that piece, never across a wall.
- The rest of the board (the far side of the canopy, the other pens) is still drawn and still stands in the camera; nobody starts
  there, and a man may still walk there if the piece joins it later (a door, a gap).
- The per-turn leg (M1) still lets a shooter in cover with nobody in reach hold a turn; M4 makes sure no man holds a whole fight.

[bb] Battle Brothers deploys both lines on one open field, so its men always have a walk to each other; ours cuts its fights from a
city with walls edge to edge, so the start now picks the one piece of ground the fight is on.
[analog horror] a man standing alone behind the arcade's shutters, facing the fight he can hear and cannot reach, for ten rounds.
