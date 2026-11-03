# FIXES: SIX SMALL THINGS FROM EYES' BROKEN LIST (11/3/26)

Session: FIXES (small-fixes lane, started by the coordinator), BUILD 11/3zzzf SIX SMALL FIXES. Source: EYES' walk,
records/BOHEMIA_EYES_THE_SEVENTY_ROWS_WALKED_11_3_26.md, BROKEN items 3 to 8. Tested on the upright phone (390 x 844, touch, 3x)
with tools/bohemia_eyes_live_session.js, served from disk at the real address. No VOTE card (fixes he never asked to see).

3. ROW 17, THE DOWN DO NOT TALK (rule 143(d)). FIXED. The survivor's word fell back to a man on the ground when only YOU stood
   (engine/bohemia_survivor_word.js speakerOf). Now: a man on his feet, else nobody, and the end screen keeps its own word (YOU WON);
   never YOU, as WORDS built it; only a wipe hears from the ground (the first man to wake in town, 143(e)). Gate THE SURVIVOR'S
   WORD re-aimed: 3,000 end screens, a down man speaking outside a wipe is a fail (6/0).
4. ROW 311, THE HELD FINGER. FIXED IN THE CREW SCREEN, ON PURPOSE NOT IN THE FIGHT. His vote 11/2 on this very tally: 'Only in the
   crew menu not any other menu' (records/BOHEMIA_VOTE_FIXES_11_2_26.md), newer than the ask line's 'a long press of him on the
   phone'; so the long press lives where he allowed it. A finger held 450 ms on a man in the crew screen's line opens his card (his
   face, KILLS and FIGHTS, BEST: the strongest foe; engine/bohemia_kill_tally.js card); the lift does not pick him; the next touch
   closes it; a plain tap still picks; the browser's long-press menu is held back. Measured on the phone: DESI held, '0 KILLS ·
   0 FIGHTS, NOBODY WORTH NAMING YET', the card at 53,97 clear of the strip. The fight, end screen, camp and map still have no
   tally card (the gate's wires, now 11, prove both halves).
5. ROW 315, THE VALLEY CODE STUCK ON BUILDING... FIXED. REPRODUCED: NEW GAME over a save, then ANOTHER: the box went blank for good
   (the map's seed from 'old_save', code ''). CAUSE: the map behind the new-game door writes the fresh valley's day-1 save before
   BEGIN; ANOTHER (and a typed code) took the valley code away and reloaded, so the next boot read that save as a game from before
   codes and rolled none, ANOTHER after ANOTHER. FIX (slices/BOHEMIA_ALPHA_0_9.html go(), the start screen untouched): the door's
   background save goes the way NEW GAME's does (slots marked dead, the page's last snapshot held back); the company's picks stay.
   Measured after: restart 4NK-YD9, ANOTHER ZHT-FXM, ANOTHER TF2-XVP, a typed code builds (from 'typed'), BEGIN starts and saves.
   (Note: the code alphabet has no 1, so '7QX912' reads 7QX-92; that is the alphabet, not this bug.)
6. ROW 294, THE SCAR'S WORDS. FIXED FOR ALL ELEVEN MARKS, not only DESI's. Every scar's line was Battle Brothers' own flavor, and
   each one said what the mark takes from him, which rule 304(b) ended. Now each mark has our own line in his own mouth, a story
   that costs nothing, draft:true, no he or she (engine/bohemia_long_injury.js SCAR_LINES). DESI's: 'Nine fingers now. They didn't
   take the trigger one.' The wiki's name stays the scar's name. Gate THE LONG INJURY re-aimed (section D: ours, short, no penalty
   word, never the flavor); its one other fail ('the penalties list both parts') fails on main the same.
7. ROW 292, THE PHONE COVERED THE INJURY CARD. FIXED. Measured: the card 24 to 366, the phone from 256, rows 558 to 834. The phone
   runs that screen (DONE, the stash's tabs), so it stays; the card stands beside it (slices/BOHEMIA_ROSTER_SCREEN.html
   besidePhone: its edge 6 px short of the phone's, either side, re-run when the phone moves; 700 wide and up untouched). After:
   24 to 250, every word of it readable.
8. ROW 300, TWO JOB WORDS AGAINST THE CARD. FIXED. The salt run (haul-caravan, PAID THERE): 'Ride shotgun with me as far as the
   camp, and {pay} batteries are yours when the sacks are down.' The same fault on the sealed letter (carry, paid when signed for
   there, said 'back here in six days'): 'signed for inside six days... {pay} batteries wait for you when they sign.' The feed's
   job-done posts: four said the crew came back or got paid at the board; now true for a job paid there or back home. Fixed in
   the generator tools too (tools/bohemia_run2_board_shelf.py, tools/words_feed/*), so a re-bake keeps them. New check in THE
   BOARD'S QUESTS ARE PEOPLE: WORDS FOLLOW THE CARD (17/0). THE FEED'S WORDS 5018/0; THE FEED GATE's 8 fails are main's own.

Proof line: BUILD 11/3zzzf; gates THE SURVIVOR'S WORD 6/0, THE LONG INJURY 56/1 (main's), THE BOARD'S QUESTS ARE PEOPLE 17/0,
THE FEED'S WORDS 5018/0; phone walk steps 1 to 16 in the FIXES session (no page error).
