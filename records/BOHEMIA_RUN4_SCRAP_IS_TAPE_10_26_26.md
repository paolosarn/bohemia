# RUN FOUR: SCRAP IS TAPE (row [scrap is tape]; rule 276(a); 10/26/26)

## HIS WORDS
Rule 276 (Paolo 10/26, LOCKED, the run-killer): 'at the end of the fight it says I won scrap, but what the fuck is scrap, and why am I
not getting more duct tape for my armour... I made it to day four and I couldn't find anywhere to get repair items like duct tape...
this run's over.' Record of the ruling: records/BOHEMIA_PAOLO_SCRAP_IS_TAPE_AND_TAPE_ON_THE_STALL_NOW_10_26_26.md.

## MEASURED BEFORE (main dc57b92c)
- The end screen counted SCRAP ('WHAT WAS LEFT OF IT', a crate icon): one a wrecked piece (engine/bohemia_spoils.js counts.scrap,
  records/target/bb/loot.json counts.scrap 'to resources').
- The screen posted it to the shell inside a 'resources' count (rounds plus scrap); the shell credited the map purse's resources
  ('loot: N rounds, M scrap'). Nothing he uses reads the purse's resources. It never became tape and never mended anything.
- The company's tape (bohemia.supplies.v1 .tape, the count on the bar, the tape camp and the heal button spend) never rose after a fight.

## WHAT IS BUILT
1. THE DATA: loot.json's count is TAPE ('to supplies.tape', 'was scrap'); a wrecked piece leaves ECONOMY's rolls (records/target/bb/
   tape_income.json salvage.tape_per_scrap: TWO, set while this row was in flight, 'every piece worn under the drop line comes home as
   two rolls of straps and plate'); the drop rules leave counts.tape and no scrap key. The screen loads the tape file beside the loot file.
2. THE SCREEN: the count is '+N TAPE', 'MENDS ARMOUR', the roll of tape off the bar beside it (supply_icons/tape.png). Taken (a tap on
   it, LOOT ALL, or LEAVE), it goes straight into the company's tape in bohemia.supplies.v1, once, beside the rounds; the shell is posted
   resources = the rounds alone and tape for the record. The word 'scrap' is on no screen of this file.
3. AN OLD SAVE'S SCRAP CONVERTS (the shell's __THE_SPOILS__ block): every purse entry 'loot: N rounds, M scrap' gives M times ECONOMY's two
   rolls ('an old save's scrap converts at the same two') to the
   company's tape once (the refs kept in bohemia.scrap.tape.v1), as the map comes up and after every fight. The purse's resources are
   left as they were.

## THE GATE: gates/scrap_is_tape_gate.js (in the suite as SCRAP IS TAPE), 10/0 at registration
T1 the data; T2 the screen on a phone and a computer: TAPE with the roll, LOOT ALL (a real tap) raises the company's tape 7 -> 10, LEAVE
does not add it twice, no 'scrap' anywhere on the screen (its words, labels and titles); T3 the live demo on a phone and a computer: a
road fight won with their armour wrecked, TAPE at two a wrecked piece, the company's tape up by it, the purse's resources up by the
rounds alone; T4 an old save's 'loot: 3 rounds, 5 scrap' becomes ten rolls, once. RE-AIMED, said here: THE SPOILS GATE's L1 (tape, not scrap) and its count
leg (the tape into the company's tape; resources the rounds).

## WHAT IS NOT MINE, ROUTED
- Tape on every stall (276(b)) is RUN TWO's [tape at every stall]. The one line on the phone (276(c)) is UI TWO's.
- UI's slices/bohemia_ui_materials.js still carries a dead selector for the old crate icon (.count[data-count=scrap]); nothing matches it.
- [tape in the loot] (rule 271(a): the men he beats carry tape in their kit) is my next row, on top of this.

[bb] Battle Brothers' tools are a supply you buy and loot, and a broken piece leaves nothing; ours leaves the tape that held it together.
[analog horror] what was left of a dead man's vest is the tape that held it on.
