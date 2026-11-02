# WORDS -- the handoff block (written only by WORDS; newest on top; older rounds in handoffs/WORDS_ARCHIVE.md)

WORDS (voices-session_01GKDyuvuNaCKi3knSrxnmUL): 11/2 (a) LATEST -- [the survivor's word] (rule 315, ask line 310) and [kills and the
strongest foe] (rule 316, ask line 311) SHIPPED (BUILD 11/3za - THEY SAY HOW IT WENT), NOT YET SEEN.
WHAT IS IN THE DEMO NOW:
- THE END SCREEN (slices/BOHEMIA_SPOILS_SCREEN.html): YOU WON is gone; one of his men still standing (else one alive on the ground,
  never YOU) says one line with his face (his mouth moves) and his name. Picked by engine/bohemia_survivor_word.js off WORDS' bank:
  his type (the fight's own pick off his look), how it went (lost_one, boss, man_down, outnumbered, close, flawless, else plain),
  the kind they beat (raiders, machine, kids, heavies, beast, wolves, ghost, boss, camp: the camp read off the shell's
  __FIGHT_START_SENT.why ':camp'), the result (lost, ran, wipe). The head under him names who fell (a boss by name now).
- THE BANK (records/target/bb/crew_voices.json, built by tools/words_personalities/build_bank.py from bank_part1-4.py; part 4 is
  this round): per type win 7 + 2 sp, win.<how> 2 each (6 hows), lost 2 + 1 sp, ran 2 + 1 sp; enemy.<kind>.win for 9 kinds; the
  'after' block (how order, kinds map, numbers flawless_hp 0.9 / close_hp 0.35 / enemy_share 0.35 / 0.6 not people, the
  people_only filter). The build refuses a line of 12 words or more.
- THE KILL TALLY (engine/bohemia_kill_tally.js): the fight keeps the best foe at every kill (bestFoe, experience value) and sends
  kills + best on each crew row; the shell's nfAfterKeep queue keeps them; the crew screen folds them into bohemia.climb.v1[name].tally
  (saveClimb/loadClimb/afterFight) and shows '23 KILLS, BEST: ...' under his level; a hold (450 ms) opens the card in the fight (on
  the weapon card), the camp/town (settlement screen), the map (on him: the whole company) and the end screen. Old saves start at 0.
- GATES: THE SURVIVOR'S WORD (new, in the suite, node only, 6 legs); THE SPOILS re-aimed E1/E2/S2; LANGUAGE's stale veteran leg
  re-aimed (TEACH[k] -> base). VOTE: words-the-survivors-word-11-2, words-the-kill-tally-11-2.
- Record: records/BOHEMIA_WORDS_THE_SURVIVORS_WORD_AND_THE_KILL_TALLY_11_2_26.md (the research with sources, the five rules).
- FOUND, NOT MINE (for PLUMBER): THE SPOILS gate stops at 'the walk ran to the end' (the perk tap, #pick in the crew door inside the
  spoils door, times out after D5's four stats) with main's own crew screen too, so its E2 does not run; THE CREW'S COMMENTARY gate's
  'a better enemy is called by name' flakes on main's own fight (1 of 3 runs failed there, 2 of 3 with this build's).
OWED / NEXT:
- EYES: the camp and map holds on a real phone (proven by wires, not by a finger).
- Spanglish twins for close, man_down, lost_one, outnumbered, boss (English only now; the dial falls back).
- SOUNDS: the shell's one voice still says the fight's own win call; the end screen's line is mouth-only.
- His VOTE picks retune the voice (darker / lighter).
