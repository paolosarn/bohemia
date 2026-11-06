# COMBAT 8: THE SHIELDS SHOW, AUTO KNOWS ITS MAN, THE COMPANY TAKES BATTLE BROTHERS' CAP (11/5, rule 409's first wave)

Opened by the coordinator for one round (rule 409(a)): rule 408's two bugs (ask line 456), rule 394 and its two amendments
(ask lines 429, 431, 432), rule 378 as amended (ask line 413). File: slices/BOHEMIA_FIGHT.html, one data row in
records/target/bb/ours.json (model_carries). Not the map (WORLD 9), not frame-rate work (PLUMBER 4).

## 1. RULE 408: THE SHIELDS NOT DRAWN, THE TWO WEAPONS DRAWN WRONG (ask line 456)

His words (11/4): 'the shields were disappearing recently, I can't see the shields... the two weapons, it's just all fucked up'.

ROOT CAUSE, ONE FOR BOTH. The fight drew a shield, a two-handed weapon and a bow ONLY through a look's own posed keys (the shield
arm SIdle..., the two-handed grip T2Idle..., the bow hand BIdle... in slices/rig_melee/<look>.json), and when a look had none the
draw fell back to the man WITHOUT the thing ('never a man without what he holds: as before until it is in' meant, in practice,
'a man without what he holds'). Every rolled man of nine gangs (cartel, remnants, blues, church, volunteers, caravans, trades,
network, colorful: no melee keys of their own, a 'bare' entry), seven cast looks and four factions (no shield keys), and the thug,
the poacher, the caravans and the wide brim (their shield layer held back, 'withhold' s1) went into the fight with a door on his arm
and none on the glass, and a man with a sledge, a pitchfork or a bow swung it from empty hands. That is why it came 'recently': the
rolled valley people became his hires, his main man (the barber's chair) and the enemy pools, and they are exactly the looks with
no keys.
SECOND CAUSE, 'THE TWO WEAPONS': the thug's and the poacher's own models carry a weapon baked in (the thug's pipe, the poacher's
hatchet; rig_melee 'held'), and the fight dealt those bodies to any man: a thug with a woodcutter's axe, a pitchfork or a shortsword
was drawn with his pipe, a poacher with a bow drawn holding a hatchet. The same flag (held) also hid the Heavy's weapon (his 'held'
is his exo battery on its strap, not a weapon).

THE FIX (Battle Brothers' way: a shield and a weapon are their own sprites laid on the body, whatever its pose):
- __WHAT_HE_CARRIES_IS_DRAWN__ (laidCell, laidOf, laidDraw): what his own keys cannot hold is LAID on his body off the layer of the
  man who has it (his own look's sheet, then his gang's, then YOU's), the cell moved by the difference of their feet (the way a
  rolled man's things already were), on the key of the pose he is in (stand, walk, the blow, the shot, the hit, cover), over or
  under his gun by the facing (shield_over), behind him where the layer is behind; never while he lies down, never on a machine, a
  ghost, a beast, a boss's own kit or the Heavy's own crash bar. In meleeDraw the laid shield joins his weapon's layer in the same
  order rule.
- modelFits / freeLook (the rules): a look whose model carries a weapon (ours.model_carries: tier_thug mace, tier_poacher axe) is
  dealt only to a man whose weapon is a one-hander of that class.
- modelCarries: 'held' means a carried WEAPON only for the looks ours.model_carries names; the Heavy's weapon is drawn again.

MEASURED, the gate's P4 over every human look (121), all eight facings, main 7889d375 -> this tree:
  the car door with a pistol       25 -> 114
  the car door with a pipe         44 -> 110
  the sledge in both hands         40 -> 113
  (the 7 to 11 left are the six bosses' own kits, the robot, the thug and the poacher: their own models carry their things)
  P2 (YOU's pistol and door, a town man's pipe and door, the machete and the crash bar): 7/8 facings -> 8/8 each
  H2 (the deal): a body that carries its own weapon given to a man holding another kind: 47 of 60 -> 0 of 13
  The posed row (eight men, the same camera, records/target/COMBAT_8_THE_SHIELDS_SHOW.webp): 2 of 6 shields drawn -> 6 of 6;
  the sledge man bare-handed -> the sledge in his hands; the pitchfork and the bow in their hands.
  Probe: tools/bohemia_combat_what_he_carries_is_drawn_probe_11_5_26.js (frames drawn with the thing, by man, and why not).

THE CHECK THAT STAYS (rule 408(d)): gates/the_fight_draws_what_he_wears_gate.js
  P5 WHAT HE CARRIES IS DRAWN: the door with a pipe, the door with a pistol and the sledge in all eight facings on EVERY human look
     but those whose own model carries its own (106 of 106 each);
  H2 a body that carries its own weapon goes only to a man who holds that kind;
  P4's floors raised to what it draws now (5/5/0 -> 114/110/113), so it can only grow;
  the instrument now also counts what laidDraw lays (it watched only meleeDraw).
  WHAT IT IS NOT: the laid layer is YOU's thing in YOU's pose on another man's body (his arm is not raised behind the door, the
  sledge sits across a man whose hands hang). It is every man's shield on the glass, the Battle Brothers way, today; each look's own
  keys (ANIMATION's, COOK THREE's paint) replace it look by look the day they land, with no change here.

## 2. RULE 394: AUTO SWITCHES WEAPONS LIKE IT KNOWS ITS MAN (ask lines 429, 431, 432)

THE CAUSE (the coordinator's read, e0356a002, confirmed): next turn was worth ONE blow on the men where they stand now, so a club
saw nothing to hit while they were still walking at him and the pistol shot now looked free; the swap back next turn cost nothing
(it is 4 of his 9 AP: his second blow); kitWorth counted a two-hander as one blow, never its sweep; the bag's shield was skipped.

THE FIX (__AUTO_KNOWS_ITS_MAN__ in planTurn, only for a man with something to change to; a man with nothing to change to is weighed
exactly as before, gate leg K1):
- turnCore / turnWith / turnWorth: his whole next turn with a weapon in his hands from a tile is his best action there as many
  times as his AP and breath carry it, against the men beside him then (in reach now; for a club, the club men of theirs walking at
  him who will be beside him by then, and the men his own walk reaches); the other weapons he carries at his AP less the swap
  (Quick Hands' free first swap counted); a one-hander with a shield he could put on counts the hurt the shield saves him, that
  round and the next.
- a swap's next turn = holding his weapon's next turn + the difference his whole next turn makes with what the swap leaves in his
  hands (394 (b)(c)(f)); kitWorth is that whole turn (was one blow).
- closing in (394 (a)): a club man who carries something to change to may walk to a tile that gives no blow this turn, scored like
  the climb (next turn from it against what he takes there); before the lines meet only up TO his line, never past the middle of his
  melee men (AUTO HOLDS THE FORMATION, rule 70b: measured, a free close-in walked 3 of 16 walks past the line).
- the shield (394 (i)): it goes on when the hurt it saves him over this round and the next beats the blows its 4 AP cost him this
  turn, never in a turn a kill is on offer; over a two-hander it cannot, so the one-hander comes first, weighed with the shield it
  lets him put on.

MEASURED, gates/auto_knows_its_man_gate.js (new, 11 legs), main 7889d375 -> this tree: 7/3 (8/3 with H2) -> 11/0.
  E1 a club-strong man (melee 85, ranged 25), two club men walking at him from four tiles: main swaps to the pistol and shoots;
     now he keeps the club (holds for them: 'rests: next turn ... beats swap 18 now').
  E2 a man good at both (melee 60, ranged 80): draws and shoots while they come (main and now).
  E3 the club-strong man against a shooter who stands off: draws and shoots (main and now; B3's lesson stays).
  H1/H2 a crossbow or the lever rifle in hand, the man splitter in the bag, three beside him: the man splitter in his hands on the
     first turn (main too on these seeds; now the shot first, then the swap); never a reload first.
  I1 a club and a car door in the bag, three armoured clubs beside him: main never; now on the first turn.
  I2/J2 nothing near him: the shield and the sledge stay as they are that turn.
  I3 a kill on offer: the blow first.
  J1 a poor fighter (melee 30) with a sledge, a club and a door in the bag, four strong clubs on him: main never; now the club on
     turn one and the door on turn two (Battle Brothers' two swaps).
  K1 a man with nothing to change to: the same pick and the same scores as before.
IN THE FIGHTS, tools/bohemia_combat_auto_plays_smart_probe_11_2_26.js, 120 fights (wolves, raiders, robots, the bosses), main ->
now (the shipped brain): won 75 -> 75, lost 44 -> 44; turns with a club in hand 995 -> 1,271 and with a gun 2,899 -> 2,517 (the
bench companies' melee men carry the kit's pistol); idle when a walk gave a hit next turn 8 -> 1; idle not resting 357 -> 289; his men
down on the ground 191 -> 190, on high ground 45 -> 44; 'chose another' swaps 9 -> 40; one club turn of 1,271 ended with no blow when
a tile gave one (0 before), the probe's own count, AUTO PLAYS SMART's legs green. About 4% more time per AUTO step (4.7 -> 4.9 ms).
GATES: in the commit's list. THE REBUILT FIGHT PLAYS 145/10, the same ten red on clean main 7889d375; its AUTO HOLDS THE FORMATION leg
AMENDED: a walk is his club's only when he walked with it (measured: NENA walked up with throwing axes, threw, then swapped to her
club for next turn, rule 394(c)'s 'the throwing weapons then the axe', and the leg read the end-of-turn club as a club man's walk past
the line: 1 of 14).
(d) 'what he carries is his': the game's company always hands his bag (engine/bohemia_roster.js bag1, bag2), so the fight's
stand-in kit (ours.bag) is never his in the game; AUTO draws only what is in it.

## 3. RULE 378 AS AMENDED: HIS COMPANY TAKES BATTLE BROTHERS' CAP, THE ENEMY DOES NOT (ask line 413)

Battle Brothers (bb_all/1533_Peasant Militia.txt): 12 into a fight, 20 kept; the Peasant Militia origin 16 and 25. Ours: the Block
Watch (origins.json 'watch': field_cap 16, roster_cap 25, as the file already had).
MEASURED BEFORE (main): 14 handed with no cap, all 14 on the board (COMBAT 7's no-cap reading of 378(a)); a company past the door's
cap (12, or 16 for the Block Watch) lost the rest from the list without a word.
NOW (__THE_COMPANY_TAKES_BATTLE_BROTHERS_CAP__ in setup): the cap is the caller's (the alpha's door hands the origin's,
BOH_START.picks().cap from origins.json field_cap), else ours.field_size (12). The men past it WAIT IN THE RESERVE (Battle
Brothers' third row): never on the board, named in S.reserve, said at the open ('4 wait in the reserve: 16 is the most that
fight.', draft), sent home in BOHEMIA_FIGHT_OVER's reserve list and never in its crew, so the map keeps them as they were; the main
man always stands. Their side keeps no cap.
GATE (gates/no_cap_on_how_many_fight_gate.js, re-aimed and grown): N4 14 handed with no cap -> 12 stand, 2 named in the reserve;
N6 the Block Watch at its door's 16: 20 handed, 16 stand, 4 in the reserve; N7 12 of his against 40 of theirs, all 52 on the
board; N8 the reserve is the rest of his line by name; N1-N3 (30 against 40, the board grows, a line of 24) unchanged.
Not this lane's: the company's 20/25 kept (the hire screen, RUN), the numbers in TUNING's table.

[bb] Battle Brothers: shields and weapons are separate sprites on the body; its AI weighs a weapon swap by the turn it buys and a
shield by the hits it turns; its formation screen's third row is the reserve that does not fight. [analog horror] the laid door is
the same tape-worn car door, in his own moonlight at night.
