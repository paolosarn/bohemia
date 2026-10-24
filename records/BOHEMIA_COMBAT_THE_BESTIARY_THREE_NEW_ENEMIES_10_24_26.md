# COMBAT [bestiary]: THREE NEW ENEMIES, ONE LESSON EACH, AND THE ROSTER FILE (10/24/26, combat-bestiary)

The coordinator's round on Paolo 10/24 ('Let's have fun. Let's be creative. Let's keep doing awesome things.'), rule 112 (no
check-in), rule 127 (no card: he meets them in his next fights), rule 133 (quicker and funner for normies, sized to the crew),
rule 120 (guns first), rule 134(b) (a weight per act). Source of the three: the 9/29 draft,
records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_BESTIARY_COUNT_9_29_26.md, section 2 ('his example leads').

## HOW BATTLE BROTHERS DID IT (the library, reference/library/grok/wiki/PAGES_ALL.tar.gz)
- Necromancer (bb_all/1409): stays far behind his dead; Raise Undead (1631) stands a wiederganger back up with 50% of its
  hitpoints, 3 AP, twice a turn, unlimited range, not if its head was smashed or somebody stands on the body; no spells while
  engaged in melee; the counter the page names is sniping. In Battle Brothers his dead fight on when he falls.
- Goblin Skirmisher (0872): throwing weapons and nets, 'will Footwork often'; fragile but evasive. Throwing Net (2004): 3 tiles,
  roots the target, -45% initiative and both defences, break free on melee skill -10, +10 per failed try. Wolfrider (0877): 13 AP.
- Orc Warrior (1501): slow and heavy, disrupts formations to reach backliners; Line Breaker (1182) knocks the target 1 tile back,
  never misses, 4 AP, 10 fatigue; Shield Bash (1776) adds 10-25 with 50% armour damage; 'They can't push a brother if there is
  nowhere to push.'

## OURS
THE MECHANIC (kill him first). The necromancer named MECHANIC wearing the Trades with a pistol (rule 120); his machines are the
Wiederganger and the Armored Wiederganger (MACHINE, PLATED MACHINE), the valley's rolled dead from the rig cast run on a chip:
drained grey-green, a red diode at the nape on the beat, a one-pixel tic, a tape-sync roll for a beat after a reboot (SOUNDS'
approved power_on). OURS, HIS WORDS: when the last mechanic falls every machine of his drops where it stands and never gets up.
A killing head shot keeps a machine down (the page's 'head was smashed'). The company's brain and AUTO shoot the mechanic first
(the page's sniping), so the lesson is shown as well as taught. Veteran: 'Oye, shoot the one in back first. His machines drop.'

THE KIDS AND RUNNERS (don't chase them, shoot them). KID: the skirmisher's bolas as the sling (2-4 tiles, six throws, a whoosh
and SOUNDS' stone_bite, never a gunshot), the blade beside it when the stones run out, a net half the time (the page's 50%):
the man coming for them is rooted under a rope mesh and cut 45 in 100 until he tears free at the start of his own turn (no AP:
the library has no Break Free page; rule 117(b)); after a throw the kid steps back out of every blade's reach. RUNNER: the
Wolfrider, 13 AP. Veteran: 'Those kids throw and run. Do not chase them. Shoot them.'

THE HEAVY (put your back to a wall). HEAVY: the orc warrior in 280-400 of plate with the crash-bar always on his arm; once a
turn he shoves the man in cover first, then the man between him and a shooter, one tile back, and walks into the hole; the
crash-bar adds 10-25, half on the armour; a man with nowhere behind him (a wall, a house, another man, the edge) stays put.
Heard as block and door_drag. BRUISER: the orc young beside him. Veteran: 'Big suit shoves. Put your back to a wall.'

## SIZED TO THE CREW (rule 133), MEASURED, AUTO both sides, a new crew of farmhands
ours.enemy_tiers.count_scale (the map counts a party in brigands; a tougher family fields fewer):
| family   | at the crew's count          | scale | at the scaled count                    |
|----------|------------------------------|-------|----------------------------------------|
| machines | 31/40 (3), 30/40 (6), 20/40 (12) | 0.85 | 31/40 (3 v 3), 36/40 (6 v 5), 33/40 (12 v 10) |
| kids     | 5/30 (3 v 3), 4/30 (6 v 6)   | 0.6   | 22/30 (3 v 2), 20/30 (6 v 4), 24/30 (12 v 7) |
| heavies  | 3/30 (3 v 2)                 | 0.45  | 19/30 (3 v 1), 21/30 (6 v 3), 22/30 (12 v 5) |
The gate re-plays it every run (20 seeds a cell, 60 in 100 the floor): machines 17/17/17, kids 15/13/15, heavies 14/14/14.

## THE ROAD SETS THE ENEMY (rule 75; ours.road_factions)
The map hands every roaming party as 'brigands' (slices/BOHEMIA_DEMO.html nfOpts: q.faction || 'brigands'), so without this
he would never meet them. From his second fight on this phone (the screen's count, bohemia.fight.met.v1), a party handed as
brigands is drawn by the act: act one brigands 4, kids 1.5, machines 1, heavies 0.5; act two 4/1/1.5/1; act three 4/0.5/2/1.5
(measured over 120 fights: act one 27 kids, 16 machines, 6 heavies). His first fight stays brigands. A party the map names
(ghosts, beasts) keeps its faction. The hand-over object is never changed (the kept fight's key reads it).

## THE ROSTER FILE (MODS' line)
records/target/bb/roster.json, tools/bohemia_combat_the_roster.py: 14 families, 131 types (18 in the fight), 17 beasts, 5 bosses,
21 champions against his floor of 12 / 75 / 17 / 3 / champions; each family's skin and lesson from the draft; each type's name,
act weights and the factions that field it, read off ours.json so it cannot disagree; --check says when it is stale.

## GATES
THE BESTIARY 10/0 (new, registered in gates/bohemia_gates.py). Green on the final tree: SOURCED NUMBERS 10/0, GHOSTS AND
APPARITIONS 18/0, FIRST FIGHT TEACHES 10/0, GUNS FROM THE FIRST FIGHT 12/0, HOLDS THE WHOLE GRID 17/0, BY HAND QUICKER 18/0,
ONE TAP 16/0, TURN ENDS 8/0, SAYS WHAT IS WEAK 10/0. Full suite unmeasured (rule 13).

## WEAK, SAID OUT LOUD
- Stand-in bodies: the mechanic, the kids and the heavies wear rolled people (Trades, Colorful and Anarchists, Remnants and Blues)
  until CHARACTER [the enemies' looks] packs its three types on the 3D man; the fight wears those the moment ours.people_looks.band
  carries 'mechanic', 'runner', 'heavy' (ours.bestiary.look_pools). No quad is drawn under a runner and no exo frame on a heavy yet.
- The net lands without a roll (the library carries no hit chance for Throw Net).
- Possess Undead, the orc young's Charge, the wolfrider's wolf and Wolf Bite, Battle Brothers' damage multipliers on the stat_modifiers
  line: not in.
- The road roll belongs to the map's spawner the day the map's parties carry their faction (RUN, WORLD).

## ROUTED
FOR RUN / WORLD: hand party.faction from the map ('machines', 'kids', 'heavies' by ours.road_factions and act_weights) and the fight
stops rolling. FOR CHARACTER: your band keys 'mechanic', 'runner', 'heavy' are read first. FOR SOUNDS: power_on (the reboot),
cloth_on (the net), stone_bite (the sling), block and door_drag (the shove) are your approved bank; a reboot and a shove of their own
would be better. FOR TUNING: count_scale, road_factions, the new act_weights, all tuned:false. FOR WORDS: MECHANIC, MACHINE, PLATED
MACHINE, KID, RUNNER, HEAVY, BRUISER and the three veteran lines, draft:true. FOR ANIMATION / COOK: a machine through the rig goes
under chipBlit; the net is drawn by netOver.

[bb]: Battle Brothers' roster teaches one thing a family (kill the necromancer first, goblins kite and net, orcs shove); its
necromancer's dead fight on without him, ours drop (his words); its nets and shoves are the same numbers here.
ANALOG HORROR: a dead man's diode blinking on the beat, the body catching sync like a tape when it reboots, and dark for good when
the man who ran it falls.
