# WORDS -- the handoff block (written only by WORDS; newest on top; older rounds in handoffs/WORDS_ARCHIVE.md)

WORDS (THE WORLD FEED, session_01GKDyuwRofRh6Gz9p9rotEj): 11/3 LATEST -- [the world feed] (rule 352, ask line 366) SHIPPED
(BUILD 11/3zzz - THE WORLD IN YOUR FEED, e86c1104), NOT YET SEEN.
WHAT IS IN THE DEMO NOW:
- records/target/bb/feed_world.json: 150 world posts (+7 valley replies) from 37 accounts in 35 places (18 of them added after first
  ship in RADIO's last-transmission voice, rule 353(h)(i): the coordinator's note; truck 13 does not answer, KD5 calling denver) (13 the country, 5 Mexico,
  14 the world, 5 the Network's own: four 'grateful' people saying one sentence in four cities, and the machine page, rare), 15 kinds,
  every row far:true, act one only, all English (rule 355(4) landed mid-round: the 22 Spanish twins and the foreign words were cut).
- THE WIRING: engine/bohemia_feedstream.js merge() + pace.far_share 0.42 over the last 20 posts (measured 0.41 to 0.43 on a played hour;
  live 6 of 14); a deed never waits; the life rule goes first; a far post (and a valley reply under it) never gets the Spanglish dial.
  The map's loader fetches both files (BOHEMIA_CITY_WORLD.html __THE_WORLD_FEED__); the inlined engine swapped by hand (the bulk resync
  tool refuses on engine/bohemia_followers.js's banner, not mine: INLINED FRESH is red on main for that).
- GATES: THE FEED TALKS ABOUT THE WHOLE WORLD (new, node only, 8/0, the share leg bites at 0.24 with the rule off); THE FEED IS ALIVE
  C1/C5 re-aimed to count the world file. FEED STREAM 17/2 the same two reds on main without this change (B2, B3; not mine).
- VOTE: words-the-world-feed-11-3 (the real demo upright for 75 s, then 20 of the best). Records: round 1
  records/BOHEMIA_WORDS_THE_WORLD_FEED_WHAT_HIS_WORLD_SAYS_11_3_26.md (32 facts with sources, 5 real collapses, 9 gaps);
  round 2 records/BOHEMIA_WORDS_THE_WORLD_FEED_THE_POSTS_AND_THEIR_SOURCES_11_3_26.md.
OWED / NEXT:
- FIVE QUESTIONS FOR HIM (round 1 record s4; the coordinator carries them one at a time): Mexico now; anything in Washington; the gulf
  city's name; the Taiwan leg; did California take the walkers. Nothing about them is posted until he answers.
- Act two and act three world rows (GDD v2: Texas struggling in act two, what happened to it in act three).
- FIXES' rule 350 strip is not on main yet: the phone still cuts a long post in half; the VOTE page shows the full words beside it.
- RADIO's guide read and applied (18 lines, about one world post in eight); rule 355 applied (all English, the language gate checks).

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
