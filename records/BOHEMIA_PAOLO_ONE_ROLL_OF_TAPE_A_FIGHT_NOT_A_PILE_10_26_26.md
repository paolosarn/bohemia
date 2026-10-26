# PAOLO 10/26: ONE ROLL OF TAPE A FIGHT, NOT A PILE (LOCKED, rule 284; an economy-breaker)

## HIS WORDS (verbatim, voice to text)
"And also bro you're about fucking crash my economy OK so now you made the shit duct tape that was scrap but like now I'm winning
way too much duct tape bro after each fight like what were you trying to do with that scrap idea for stuff and now that it's deduct
like you're crashing, you can't be doing this. You gotta get your number if it feels better. Then just make it so I get one duct tape
or something like that as a baseline if u have no clue but bro u about to crash my fucking economy with this shit"
('deduct' is 'duct tape'; 'you gotta get your number if it feels better' is 'if you have a number that feels better, use it'.)

## WHAT HAPPENED (coordinator, read on main)
Two ships an hour apart stacked:
- 5209dead (RUN FOUR [scrap is tape], rule 276(a)): every wrecked piece in the loot became tape. ECONOMY's
  records/target/bb/tape_income.json salvage.tape_per_scrap set it at TWO rolls a piece.
- 958f0f6a (RUN FOUR [tape in the loot], rule 271(a)): every man killed carries TWO OR THREE rolls
  (tape_income.json loot_tape.per_kill [2, 3], a mean of 2.5).
One road fight on the live demo took the company's tape from 40 to 53: thirteen rolls from one fight. A stall sells a roll for
one battery and a stack is twenty, so one fight paid most of a stack, and at five fights a map day (264(f)) that is about 65 rolls
a day out of the loot alone. ECONOMY's model said the loot alone should cover the wear; on the live game it buries it.

WHAT SCRAP WAS: 'scrap' was the leftover of an enemy piece too broken to keep. It went into an old resources count nothing read,
so it did nothing (his 276 question). Rule 276 made it tape; the two-a-piece number is what made it a flood.

## BATTLE BROTHERS
bb_all/2014 Tools and Supplies: 'Can be bought at a Marketplace... Can be looted after battle... The Scavenger recovers some
Tools and Supplies from every armor completely destroyed.' The loot gives tools now and then; the real source is the market,
200 crowns for 20. Tools are a money cost, and that cost is half of Battle Brothers' economy. bb_all/1972 The Scavenger: '0.5-1%
of maximum durability of destroyed enemy armor... capped at 60 tools', and only when she is hired.

## THE RULE
(a) A won fight gives ONE roll of tape, his baseline, whatever the kills and the wrecked pieces. A lost or fled fight gives none.
(b) The per-kill rolls (loot_tape.per_kill) go to 0, the two a wrecked piece (salvage.tape_per_scrap and loot.json's fallback
    per_wrecked_piece) go to 0. Nothing else in the loot makes tape. The word 'scrap' stays gone.
(c) The rest of a run's tape is BOUGHT: every stall, a battery a roll, a stack of 20 (265); the smith and the armourer mend for
    batteries (277). Battle Brothers' way: tape costs money.
(d) The Scavenger (270) keeps Battle Brothers' own number when she is hired; she is the only way the field gives more.
(e) [COORDINATOR'S DEFAULT, rule 205] The one moves only in TUNING's one table, only on a measurement of the live game, and never
    above three a fight without his word.
(f) [COORDINATOR'S DEFAULT, rule 205] Tape already in a save stays; nothing is taken back. The old-save scrap conversion converts
    nothing more.
(g) AMENDS 271(a) (the loot's 'scaled to kills' is dead) and 271(b) (the bar 'a run never ends for want of tape' is measured on
    the loot's one roll plus the stall plus the smith, with the batteries a fight pays); AMENDS 276(a) (a wrecked piece adds no
    tape past the fight's one).
(h) The gate: 400 rolled fights on real enemy rows: every won fight +1 tape, a lost or fled fight +0, the kills and the wrecked
    pieces change nothing; the end screen says +1 TAPE; ECONOMY's no-run-ends gate re-aimed on the new sources over 30 rolled days.
(i) RUN FOUR [one roll a fight] FIRST, before [every level waits for him]; ECONOMY [the tape bar re-aimed]; NOTE TUNING; NOTE
    EYES; line 224 of the list.
