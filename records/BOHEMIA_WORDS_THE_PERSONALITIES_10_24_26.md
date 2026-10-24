# WORDS 10/24: SPANGLISH AT TEN PERCENT, AND THE PERSONALITIES (rule 143(a)(c)(d))

Row: WORDS [spanglish at ten percent, and the personalities]. Session words-spanglish.

## HIS WORDS
"there's a lot of Spanish going on, the Spanglish... I mentioned it one time that I want like 10% of
spoken conversation being Spanglish, and now all my crew members are in Spanglish; it should be 10 to 15%
randomized... it's shoving it in my face." And: "everyone gets assigned a personality, lots of different
personality types, and they work together... depending on the enemy or how many enemies, like how UFC the
video game does its commentary, that people can read, reacting to shit: if someone dies, oh fuck they got
shot." (UFC's game: his named reference for the commentary feel only, rule 139.)

## WHAT WAS WRONG, MEASURED FIRST
The dial lived on the PERSON (engine/bohemia_people.js langOf: English or Spanglish for life) and every
line with no person behind it was simply written in Spanglish:
- the veteran who teaches every fight: 10 of his 13 lines carried Spanish (Ándale, Mira, Cuidado, Oye, compa, mijo, carnal, güey);
- the five keeper price lines: 5 of 5;
- the settlement keepers: 15 lines (mijo, Bueno, carnal, pues, gracias a Dios);
- the busy town's mutters: 6 of 11 day lines, 4 of 6 answers, all 3 day greetings;
- the hostile crews' button: 2 of 6.
So the voice he hears most, the man teaching the fight, was Spanglish about three lines in four.

## WHAT SHIPPED
1. ONE DIAL, EVERY MOUTH: engine/bohemia_spanglish.js. Every spoken line rolls. A man leans 10 percent,
   one in five leans 25 percent; a person the valley rolled as a Spanish speaker always leans; the player
   never (rule 27). plain() takes the tag Spanish out of a line written in Spanglish; flavour() puts one word
   in a line written in English, in that man's own habit (his word, where it sits). The English sentence is
   never touched, so LANGUAGE NEVER GATES REQUIRED INFORMATION holds. say() for a line written one way;
   regFor() for a mouth that holds both forms. The spread is sized for a crew: a crew of eleven with no
   leaner says 10 percent, with four leaners about 15.5.
2. WIRED: the fight's veteran (teach()) and COMBAT's crew commentary (regFor, already calling it); the
   settlement's speak() (every keeper, the elder's arrival line); the busy town's six banks (English with a
   Spanglish twin, the twin on the face's roll); people.js linesFor (the register rolled per speaking;
   opts.lang still forces); quirk lineFor (rolls unless exact); the asker's lines (say(), his answers never);
   the hostile button (English, its twin about 1 in 8).
3. THE GATE, RE-AIMED: language_gate section H, a long play over every mouth the game has, read off the
   files that ship, counted with the one ruler (esWordsIn): 12.2 percent of 87,800 lines; the veteran
   13.6, the keepers 12.7, the mutters 13.9, the valley's people 10.1, the quirks 12.2, the hostile button
   12.7, the crew's commentary 13.1. Some lean: the middle man 11 percent, the top tenth 25; nobody says
   every line in it (most 41); the player never. Every Spanglish line the veteran and the keepers hold has a
   plain twin. GREEN 104/0. keeper_lines_gate and the_arrival_gate re-aimed to read the English under both
   forms.
4. THE PERSONALITY BANK: records/target/bb/crew_voices.json in COMBAT's shape (the fight speaks it with no
   code change), 18 types, every type all ten moments (hit, miss, dodged, kill, man_down, outnumbered,
   superior, their_turn, win, and COMBAT's retreat), 679 English lines and 183 Spanglish twins, every man-down
   and better-enemy line names the man, short enough to read at a glance (64 characters at most), no dashes.
   The types: Hothead, Deadpan, Worrier, Joker, Old Hand, Hype Man (the booth: "AND HE CONNECTS!"), Hustler,
   Quiet One, The Kid, Believer (prays under his breath, never a sermon), Sergeant, Snob (the runway), Truther
   (the lab, the chips), Bruiser, Mother Hen, Gambler, Shell-Shocked (the static; the analog horror line),
   Dreamer. Waiting for a caller: 'near' (said by the man who stood beside the fallen), the 'enemy' block
   (ghosts, beasts, machines), last_stand (the last man up, before he falls) and wipe (the first man to wake
   in the nearest town, {by} who beat you; rule 143(e)). Source: tools/words_personalities/ (the build
   refuses a line that breaks the shape). the_crews_commentary_gate 9/0; the_edge_is_the_way_out_gate 7/0.

## THE DIAL'S OWN BUG, FOUND BY THE COUNT
regFor with no register named read every man as 'en', so nobody leaned: COMBAT measured 6.8 and 6.9
percent and the long play's crew count read 9.9. Fixed in the same round.

## ROUTED
- COMBAT: a NOTE on its board (the extras to wire, and key the roll by v.look so the same man leans the
  same every fight).
- The 8/25 law carries an AMENDED 10/24 section.
- Not touched: the dead walk (slices/BOHEMIA_CITY_WORLD.html) carries inlined copies of people, quirk,
  hostiles and the ask module; its resync tool refuses on main (inlined_fresh_gate red before this round,
  bohemia_followers' banner), and the walk is dead (9/28).

draft:true, every line (ALWAYS MAKE AN ATTEMPT, 8/11).
