# COMBAT FOUR: THE MAP'S DICE KEEP THE INSIDES' WORD (BUILD 11/22 - THE MAP'S DICE)

11/22/26. COMBAT FOUR, a bug he can feel first (rule 461), found while proving the Neon Boneyard (BUILD 11/22za): twelve page runs at
the boneyard, twelve fights outside, at a share of 0.4. Rules 416, 461, 441; ask row 651. No line rewritten (465).

## WHAT WAS WRONG
A place's inside is rolled from its cell: the fight seeds its dice with the cell and its ground (seedOf(x,y:ground), BOHEMIA_FIGHT.html
dealBoard) and an inside is dealt when that roll is under its share (bigInside). That is on purpose: the same cell, the same answer, so a
place is the same place every time it is fought. But the map seats most of the big places on ONE cell, and that cell lands on only a
few spots over all the valleys (the boneyard on five, the Mini Grand Prix on two). So each spot either always goes inside or never does,
and a share of 0.7 does not mean seven fights in ten; it means whatever the few spots' rolls happen to be. Measured over 40 valleys of
the map's own generator (engine/bohemia_overmap.js), dealing every real cell through the fight's own setup, leaving out the cells the
parking garage takes first: THE GAS PLANT'S TURBINE HALL WAS NEVER FOUGHT INSIDE (0 of 40 valleys, meant about a third); the truck stop
35% (meant 70%), the aquarium 40% (meant 80%), the stadium 50%, the battery farm 53%; and the other way, the Mini Grand Prix 100%
(meant half), the mall, the Mob Museum, the arsenal and the radio station 100% (meant 70 to 80%).

## WHAT SHIPPED
- 14 data files: each inside whose real cells missed its word by more than 0.15 gets the share its real rolls need (the band of its own
  rolls nearest the meant share, the threshold kept off the band's edges), with 'share_meant' (the word: what the share used to say) and
  'share_dice' (the measurement, in the file) beside it. No new rule code in the fight.

| inside | district | meant | went inside, before | share now | went inside, now | on the map |
|---|---|---|---|---|---|---|
| hall | convention | 0.7 | 89% | 0.647 | 74% | 8 places, 150 cells |
| mall | mall | 0.7 | 100% | 0.5 | 53% | 2 places, 32 cells |
| stadium | stadium | 0.7 | 50% | 0.732 | 79% | 4 places, 80 cells |
| powerhouse | powerplant (the gas plant) | 0.35 | 0% | 0.73 | 42% | 3 places, 40 cells |
| prison | prison | 0.6 | 85% | 0.38 | 49% | 24 places, 159 cells |
| prison | jail | 0.6 | 90% | 0.38 | 60% | 10 places, 20 cells |
| courthouse | mobmuseum | 0.8 | 100% | 0.71 | 82% | 9 places, 40 cells |
| truckstop | truckstop | 0.7 | 35% | 0.76 | 65% | 4 places, 40 cells |
| aquarium | aquarium | 0.8 | 40% | 0.89 | 92% | 6 places, 40 cells |
| firehouse | firestation | 0.8 | 96% | 0.76 | 86% | 10 places, 49 cells |
| arsenal | arsenal | 0.8 | 100% | 0.74 | 72% | 5 places, 40 cells |
| radio | radio | 0.8 | 100% | 0.61 | 84% | 5 places, 38 cells |
| battery | battery | 0.7 | 53% | 0.734 | 65% | 4 places, 40 cells |
| minigp | minigp | 0.5 | 100% | 0.33 | 44% | 2 places, 39 cells |
| boneyard | boneyard | 0.5 | 78% (0.5, BUILD 11/22za) | 0.48 | 70% | 5 places, 40 cells |

- AS NEAR AS THEIR DICE ALLOW, UNCHANGED: the terminal (46%, meant 70%: its rolls jump from 46% to 94%), the shelter (45% against 70%:
  45% or 100%), the police station (99% against 80%), City Hall (100% against 80%: two spots), the mall (53%, the nearest to 70% its
  two spots give). Every other inside was already within 0.15 (the many-celled ones, the warehouse, the school, the storage yard, the
  hangar, the campus, are a slope, not a step, and are left as they are).
- THE GATE, gates/the_big_insides_gate.js: a new leg on every inside, I14 THE MAP'S DICE KEEP ITS WORD: over 40 valleys of the map's
  own generator (built once, about 3 s, shared with the gate's children), every district seated on 40 places or fewer is dealt at each
  real cell through the fight's own setup; the share of its cells that go inside must be within 0.15 of share_meant, or as near as its
  own rolls allow plus 0.05, and never none where something is meant; the gate's copy of the roll must agree with every deal (0
  disagreements on 39 insides); planted: a share read as 0 is caught. I1's upper bound on the gate's own cells is now three sigma
  (at least 0.12, as before): the flat 0.12 on 40 to 80 cells was under two sigma, and the gas plant's raised share showed the dam's own
  80% at 0.6 that the gas plant's never-inside had been averaging away. I1 also reads each district's own share now.

## THE GATE
THE BIG INSIDES 724 passed, 0 failed over thirty-nine insides in three parts (243, 242, 239; the first part alone again after I1's
bound, 201 s); I14 green on all 39. Side by side the three parts take 550 to 573 s, the same as before this leg (561, 573, 550 against
562, 572, 549): I14 costs about a second an inside. FOR PLUMBER: side by side that is close to the suite's 600 s cap; alone each part is
about 200 s.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:<kind>, through the map's own door)
THE GAS PLANT, never fought inside before: 4 fights in its turbine hall (THE POWERHOUSE's generator floor), the demo upright (6 of 6
taps), the alpha on its side (7 of 7), the demo on its side (4 of 4), the alpha upright (3 of 3), all at the cell 28,55; the cell
69,55 rolls outside and was fought in the yard (0 page errors). THE AQUARIUM: the demo upright, the reef halls, 6 of 6. THE TRUCK
STOP: the alpha on its side, the travel store, 5 of 5. 6 fights inside, all ended on AUTO, 31 of 31 tile taps, 0 page errors. Run
two at a time.

## THE ROOT, FOR WORLD
The fight cannot tell one valley from another: the city's hand-over (BOHEMIA_CITY_WORLD.html, msg.ground) carries the cell, its kind
and its ground, not the valley. If it carried the valley's own seed (msg.ground.valley), the fight could mix it into the inside's roll:
the same place the same answer inside one game, and over many games every share would come true as written, a slope and not a step.
That hand-over is WORLD's; nothing of it is touched here. The day it is handed, the fight's roll takes it (COMBAT), each share goes
back to its share_meant, and I14 says so.

## SAID PLAINLY
VOTE card combat4-the-maps-dice-11-22 (stand_in): the truck stop and the aquarium, fought inside far more often now, and the gas plant's
turbine hall, which no fight ever reached before. The pictures are stand-ins until COOK's are in.
