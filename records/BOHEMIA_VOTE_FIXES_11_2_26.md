# VOTE FIXES (Paolo 11/2 in the VOTE tab, rule 336, ask line 336; BUILD 11/3zu - HIS VOTES IN)

His words (records/BOHEMIA_THE_VOTES_11_2_26.txt): on the barbed wire "Bro just animate... don't do the stat shit"; on the live
wire "just animate, fuck these weird debuffs, ammo shit"; on the extension cord "Disarm is a low luck ability vibe and all whips
can have them"; the kill tally "Only in the crew menu not any other menu"; the pills on the march NO, "Not good looking enough".

## 1. THE WHIPS: their animation and their numbers, no debuffs
- OUT of the fight (slices/BOHEMIA_FIGHT.html): the live wire's stun (one lash in four) and its battery a lash; the barbed wire's
  1 to 2 off its own man's bare hands; the rodeo bullwhip's crack nerve check. lashCosts() and disarmOn() are gone; the shell's
  purse line for cellsBurned is left and reads 0 (nothing counts a cell any more).
- DISARM is no button of its own (ours.whip.other is empty; tools/bohemia_armory.py drops the Disarm skill from the four whip rows
  in weapons.json). Every whip's landed lash (Battle Brothers' own two whips too) rolls ours.whip.disarm_pct = 10: one landed lash
  in ten takes his weapon out of play for his next turn (the DISARMED pop over him). Beasts and the Disarm-immune shrug it off.
  Why 10: his "low luck"; it costs nothing and needs no pick, so it is rarer than Battle Brothers' skill would land at -20.
- KEPT, the numbers: damage (cord 15-35, the other three 20-35), the bleeding (two stacks, the barbed wire three), reach 2, the
  bullwhip's +10 to hit, the prices. The lash's six drawn keys, the cords, the barbs, the spark and the crack on the glass unchanged.
- armory.json: the whips' 'whip' blocks keep only bleed_stacks (the barbed wire) with the why; the three lines rewritten
  (draft:true). The four VOTE cards' words say the same.

## 2. THE KILL TALLY: the crew screen only
- OUT: the hold card on the MAP (slices/BOHEMIA_CITY_WORLD.html), in the CAMP and towns (BOHEMIA_SETTLEMENT_SCREEN.html), on the
  END screen (BOHEMIA_SPOILS_SCREEN.html), and the tally row on the FIGHT's weapon card (the weapon card itself stays: the hold
  there is the card, not the tally). Those four pages no longer load engine/bohemia_kill_tally.js.
- KEPT: the crew screen's line under his level and wage ("23 KILLS, BEST: ..."), his record, the fight's best-foe count, the
  shell's queue. UI 4's tooltips are not touched (none were on these holds on main when this shipped).

## 3. THE PILLS: off the march
- records/target/bb/march_acts.json 'acts_off': ["pills"], with his NO as the source; engine/bohemia_march_acts.js drops an act
  in it from the rotation (and keeps the pills off if the file fails to load). An aching man (60 to 99% health) now does nothing
  on the march; the bandage (under 60%), the tape and the helmet stay. The pills' pictures stay in the pack until one is redone.

## CHECKS RUN (the ones this change touches)
- THE WHIP REACHES TWO TILES 13/0 (re-aimed: no whip stuns, burns a cell, cuts its man or cracks a nerve check in 400 landed and 40
  missed lashes each; Disarm a luck roll near 10% on all four, 0/100 on a beast, no Disarm button; the disarmed turn).
- THE SURVIVOR'S WORD 6/0 (the wires re-aimed: the tally on the crew screen only, no hold card in the fight, end screen, camp, map).
- THEY MEND ON THE MARCH 14/0 (new M4f: pills off in the file, none played over 400 bars, the bandage still plays).
- MELEE IS ONE TILE 10/0; PLACEHOLDER NUMBER 14/0. THE FIGHT READS ONLY SOURCED NUMBERS 8/2 and ONE NUMBER (a page error,
  'G is not defined') fail the same on main without this change: not this round's.
