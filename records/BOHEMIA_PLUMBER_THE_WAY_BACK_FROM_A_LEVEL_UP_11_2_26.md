# THE WAY BACK FROM A LEVEL-UP (PLUMBER, 11/2/26, ask line 313, rule 317)

Paolo 11/2: "the leveling up after the combat victory screen, when I press level up, I don't know if there's an easy way for me to
get back into the world map... or get back into the camp screen... make sure if I do do it at the combat screen, I'm able to get
back into the [victory] screen." The coordinator's decision: level up from the fight's end screen AND from the phone's crew screen
any time; from the end screen LEVEL UP opens the man's level-up over it, and a pick or BACK (always visible, big, on the phone) lands
him on the SAME end screen as he left it; the end screen's own LEAVE goes on to the map (or the camp). Checked together with ask
line 309 (records/BOHEMIA_PLUMBER_THE_FIGHT_THAT_OPENED_THE_CREW_SCREEN_11_2_26.md): a different cause, the same family (a screen
that opens with no way back to where he was).

## MEASURED BEFORE (main 1983fcdb, the demo, 390 x 844, real touches)
Two men with levels waiting, a fight won, the end screen up. A finger on SPEND HIS 3 LEVELS:
- the company screen opened over the end screen (inside the end screen's own page),
- its DONE was `display:none` (UI round 2 moved it onto the phone: `html.boh-phone-on body:has(#bag) #done{display:none}`),
- the phone stayed on its HOME face (no DONE on it) and stood at z 70 under the end screen (the shell's #spoilsdoor, z 8000).
Nothing on the glass closed it. That is his "I don't know if there's an easy way to get back".

## THE CAUSE
slices/bohemia_phone.js tick(): the phone took its YOUR COMPANY face (the one carrying DONE) only when the screen was not a fight
(`if (on && scr !== 'fight') crewUp = rosterWin()`), and a fight's end screen still counts as the fight (the fight frame stands
under it, nf-on). So a company screen opened from the end screen, or from the phone's CREW in the middle of a fight, had its DONE
hidden on the screen and never shown on the phone. And the phone stood under anything above z 70.

## THE FIX
- slices/bohemia_phone.js: a company screen up ANYWHERE is the phone's face first (the map, a town, over the fight, over its end
  screen), and while it is, the phone stands on top (z 999995) because it carries that screen's DONE. Back from the company screen
  to a fight still going, his abilities come straight back (fightIn(back): no second COMBAT strike card in the middle of a fight).
- slices/BOHEMIA_SPOILS_SCREEN.html openCrew(): DONE (BACK) brings him to the same end screen and re-reads every man's levels (the
  man he spent shows what is left, the others still wait); once the man he came for has nothing left to spend (his last perk
  taken), the company screen lets him go back by itself a beat (600 ms) after the pick, through its own DONE (the company kept).
- The end screen's head (WORDS' lane) is untouched.

## THE GATE
Added to gates/the_fight_opens_the_fight_gate.js (THE FIGHT OPENS THE FIGHT), every press a real touch:
L1 LEVEL UP on the end screen opens the company screen over it with its DONE on the phone, on top, a thumb tall (44+ points);
L2 BACK (DONE on the phone, nothing picked): the SAME end screen (its seq), every LEVEL UP still there; L3 every level of the man
picked by taps (the stats the level asks, four now, RAISE THEM, a perk): back on the same end screen by himself, his LEVEL UP gone, the other man's still
there; L4 the end screen's LEAVE: the map; L5 a fight from the camp, won, LEAVE: the map or the camp, nothing left over him;
L6 the phone's CREW in the middle of a fight, DONE on the phone: his abilities straight back, no second strike card.

## RESULTS
- BEFORE (main 1983fcdb, measured by a probe with real touches): SPEND HIS 3 LEVELS -> the company screen up, its DONE
  `display:none`, the phone on its HOME face (`phoneDone: null`) under the end screen. No way out.
- AFTER, THE FIGHT OPENS THE FIGHT on the demo, upright: 17 passed, 0 failed (F1-F11 and L1-L6). L1: the phone's DONE 102 x 46,
  on top. L2: the same end screen (its seq), DESI: SPEND HIS 6 LEVELS | RAUL: SPEND HIS 3 LEVELS as before. L3: 13 picks for DESI
  by real taps, back on the same end screen by himself, only RAUL: SPEND HIS 3 LEVELS left. L4 and L5: the map. L6: the company
  screen over a live fight, DONE on the phone, his abilities back with no second strike card.
- THE PHONE (UI's gate, it reads the phone's faces), run side by side: this tree 256 passed, 2 failed; main's phone file served in
  its place 257 passed, 1 failed. Every red is a known flake on both: 'RELOAD is big' fails when the man whose turn it is carries a
  blade (no RELOAD to show; it passed 4 of 6 profiles here and failed 2 of 6 in an earlier run of either), 'the side changed in a
  town' and 'THE BEAT IS SEEN' are timing legs that fail under two browsers at once. None reads the company screen's face.
- Rebased on main c1d531dd and run again as shipped (BUILD 11/3zl): THE FIGHT OPENS THE FIGHT 17 passed, 0 failed.

## FOR OTHER LANES (seen, not this round's to change)
- WORDS: the end screen says "Pick three stats and a perk, then DONE" (BOHEMIA_SPOILS_SCREEN.html openCrew) while a level asks
  for FOUR (records/target/bb/rules.json attributes_raised 4; the company screen's own head says PICK 4 TO RAISE).
- After a camp attack the camp breaks (by design) and the end screen's LEAVE lands on the map; MAKE CAMP on the end screen makes it
  again where he stands. The coordinator's "or the camp if the fight came from the camp" is that button today, not LEAVE.
