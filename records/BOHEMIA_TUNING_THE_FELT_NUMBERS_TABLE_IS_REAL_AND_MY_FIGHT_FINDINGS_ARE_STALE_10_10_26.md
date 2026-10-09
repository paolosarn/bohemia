# TUNING ROUND 9 -- [the felt numbers table] THE TABLE IS REAL NOW, AND SIX OF MY FIGHT FINDINGS DESCRIBE A FIGHT THE DEMO NO LONGER USES (10/10/26)
# Row: VAMILY TUNING [the felt numbers table] (rule 21 one numbers table, rule 63d the numbers are theirs as data). RESEARCH (rule 38g).
# Instrument: tools/bohemia_felt_numbers_audit.js (reads slices/BOHEMIA_FIGHT.html and records/target/bb/{rules,ours,ai}.json;
# --write refreshes records/BOHEMIA_TUNING_FELT_NUMBERS_AUDIT_10_10_26.json). VOTE page: slices/BOHEMIA_TUNING_EVERY_NUMBER_THE_FIGHT_FEELS_10_10_26.html.

## 1. THE TABLE I DRAFTED ON 9/28 IS OBSOLETE, BECAUSE COMBAT BUILT THE REAL ONE
The demo no longer fights in the fight tab I measured. Since rule 63, slices/BOHEMIA_DEMO.html loads slices/BOHEMIA_FIGHT.html (BB's
rules rebuilt), which reads 13 data files through ONE door, R('key'), and R throws if a row has no value. The table is
    records/target/bb/rules.json   854 numbers, each with its wiki page and a verbatim quote
    records/target/bb/ours.json    150 numbers, each Paolo's ruling with its law and a quote
    records/target/bb/ai.json      the behaviours
plus enemies, weapons (126 rows), armor, injuries, backgrounds, perks, origins. My draft file and census tool (9/28) are kept as history.

## 2. THE AUDIT (what a player feels in the demo's fight, and where each number comes from)
- 86 distinct static R() keys read (+ 1 dynamic read). 85 resolve (the 86th, 'a.b.c', is an example inside a comment). By source:
  71 from the wiki (page named), 10 are Paolo's rulings (law named), 2 are his recorded words (ours.people_looks, ours.board_mix),
  2 more (ours.board_tiles, ours.cover_tile_blocks_line) cite COMBAT TWO's own board file, slices/fight_ground/fight_ground.json. Rows with no verbatim quote: 0. Rows with no source: 0.
- COMBAT's own rule, "no number is typed in this script but 0, 1 and 100", HOLDS in the fight-rules script: 0 other numeric
  literals in 78,083 characters. This is a better result than I expected and it is COMBAT's.
- WHAT ESCAPES THE TABLE, all small: (a) the drawing script has 999 numbers, nearly all pixels and colours; the felt ones are
  HOLD_MS = 450 (how long you press to open a weapon card) and the 120 BPM beat (which IS in the table, ours.beat_bpm); (b)
  MAN_OF_TILE 0.86 (how tall a man stands in a tile) is a presentation number the ground-may-zoom law governs; (c) the random
  generator's constants are not felt. So the table covers the fight; its two gaps are one input number (450 ms) and the man's height.
- WHAT THE AUDIT DOES NOT COVER: the settlement screen (SELL_CUT = 0.5 is unsourced and marked for TUNING in its own source,
  price = value/10 is GROK_33), contract pay (30/60/60/90, draft:true in the screen), the roster and price-table engines. Wages,
  rations, medicine and repair appear in NO file yet, so the demo shows no such number. Those are [the sell ratio] and ECONOMY's.

## 3. THE FINDING THAT PROVES ME WRONG (a correction to six pages)
My pages from 9/28 to 10/1 measured COMBAT_B64, the old fight in the alpha's COMBAT tab. The demo's fight is a different program:
- FIVE POINTS: the "plate eats one whole hit" finding, the hold proposal and its toy describe the old fight. The new fight uses
  BB's armour as a pool with rows from armor.json and a flat term (my 10/9 check already described that mechanism). RETIRED as a finding about the demo.
- HOW LONG A FIGHT TAKES: the new fight uses initiative order, action points and fatigue per unit (R('ap.per_turn'), 'initiative',
  'fatigue.recovery_per_turn'), and 12 on the field (ours.field_size, roster 20). That is BB's sequential turn structure, so
  "everyone acts on one beat, about 50 seconds" is NOT true of the demo; my BB equation (rounds x units x seconds each) probably
  applies to it. The measured 9.4 rounds and the 50-second figure are old-fight numbers. Nobody has measured the new fight's minutes.
  THIS IS THE ONE THAT MATTERS: his ceiling (never past about 15 minutes) may now be at risk, and the page that said we had 4x headroom is wrong for the demo.
- WHO DIES and THE DIFFICULTY DIALS: the 5% struck-down rate and the accuracy tiers were the old fight's. The death PARAMETERS
  are now rows (ours.struck_down_death_chance 0.2, veteran_death_chance 0.1, laid-up days [30,40], main_character_dies false), so
  the pages' parameters are right and their fight-rate assumptions need the new fight's struck-down rate, which is unmeasured.
- EVERY NUMBER YOU FEEL (the 9/28 VOTE table of 41 cards) is the old fight's constants. Superseded by this page.
- WHAT STANDS: lifespans (a real-world curve), the wiki check (it read the wiki, not the fight), the difficulty steps page, the Grok corrections.
Each affected page gets a one-line pointer to this section. Nothing is deleted.

## 4. WHAT TUNING CAN NOW DO (research only), IN ORDER
1. MEASURE THE NEW FIGHT, with the one driver: turns per fight, minutes at a human pace, struck-down rate per man per fight on the
   first fights (the six road crew, GROK_07). EYES [where the minutes go] owns the human clock; TUNING owns the model.
2. CHECK THE TABLE FOR FEEL, not for source: does a slightly better armour change the outcome of the standard fight (his own test)?
   The numbers are the wiki's, so the answer comes from BB's mechanism, but the 12-man field and the square 20 x 15 board are ours.
3. The gate this audit measures for (every felt number comes from the table) is PLUMBER's; the audit is its measuring half.

## ROUTED
- PLUMBER [numbers gate]: tools/bohemia_felt_numbers_audit.js is the measuring half; the ratchet is 86 keys, 0 stray literals in fight-rules.
- COMBAT: HOLD_MS 450 and MAN_OF_TILE 0.86 as table rows if wanted; confirm the old COMBAT tab is retired so no one measures it again.
- ECONOMY: SELL_CUT 0.5 unsourced; wages, rations, medicine, repair absent; contract pay 30/60/60/90 draft.
- EYES [where the minutes go]: minutes per fight on the new fight (this page predicts it is near BB's, not 50 s).
- Test material: the VOTE table is draft:true.
