# THE RECEIPT IS THE END SCREEN (RUN FIVE, 11/6/26; VAMILY rule 405(a)(c), ask line 448; rule 411 opened the round)

## HIS WORDS (11/4)
"we still have that receipt gambling shit, and I actually like the idea of that, the gambling receipt at the end of the fight
populates, but it's only there for one second before the victory screen appears... why don't we combine this, maybe make the receipt
look like it's hanging off the edge of the screen a little bit, incorporate it in a fun way"

## MEASURED BEFORE
- A won or lost fight in the game showed TWO screens. The fight (slices/BOHEMIA_FIGHT.html showOver) put up its recap card (#over:
  receipt paper, the head, rounds and time, a WHO / KILLS / BLOOD / TAKEN / XP table filling in) and posted BOHEMIA_FIGHT_OVER; the
  shell (slices/BOHEMIA_ALPHA_0_9.html __THE_SPOILS__) opened the end screen at once, but its frame takes about a second to load, so
  the card was seen for that second and then covered: "only there for one second before the victory screen appears".
- The end screen then printed the same numbers a second time: the rounds, time, down and ran in the bar (#tally) and each man's
  kills, blood drawn and taken on his card (.nums), read off the card's own text (recapOf).

## WHAT CHANGED (one moment, one screen)
1. THE OLD ONE GOES (405(a)): showOver marks the card `handed` (visibility hidden, no taps) whenever the game's end screen takes the
   fight: the parent is the game (window.parent.SPOILS) and the fight was won or lost. It is still written (the end screen reads its
   words through recapOf), never seen. The bench (the fight on its own) and a pull-back from the lineup (withdrew, no end screen)
   keep the card as before. Marked __ONE_END_SCREEN__ in COMBAT's file: one CSS line and three lines in showOver, nothing else.
2. THE RECEIPT PRINTED INTO THE END SCREEN (405(c)), slices/BOHEMIA_SPOILS_SCREEN.html __THE_RECEIPT__:
   - a till roll fed out from under the bar, hanging off the glass's right edge (inside #tillclip, a box that ends AT the glass edge,
     so the glass cuts the overhang and the page is never wider than the glass: measured 390 of 390 on a phone; an overhang left loose
     had widened the phone's page to 408), tilted 2 degrees, its foot curled;
   - it prints a line every quarter beat at 120 BPM: BOHEMIA and a receipt number, the fight's head, the rounds and time (#tally keeps
     its name), down and ran, then WHO K BLD TKN XP and one line a man (data-man, data-kills, data-dealt, data-taken);
   - THE LOOT COUNTED ONTO IT: every piece he takes prints with what a town pays for it, a piece put back prints VOID, the pay (the
     batteries, the rounds, the tape) prints when it is taken (tillSync, after every stash and counts draw);
   - a tap unrolls it (74 percent of the glass), a second rolls it back;
   - LEAVE and MAKE CAMP: the TOTAL prints, the roll is torn off (300 ms), and only then does the game hear `leave`, once (a second tap
     during the tear does nothing);
   - a lost fight prints NOTHING TAKEN; an arena fight THE PURSE IS PAID AT THE ROPE (draft:true).
   - the bar's tally and the crew cards' kills line are DELETED: the receipt is the one place they print.
   - a computer (1100 px and wider): the columns leave the receipt a margin of its own, so it hangs over nothing he presses.
   - it hangs from the bar's real foot, measured as it prints (in the game UI's map bar stands over the end screen's own).
3. The look is at final (rule 404: paper, curl, tear, sound); the merge and the cut of the double are now.

## GATES
- NEW gates/the_receipt_is_the_end_screen_gate.js: 9 passed, 0 failed (R1 hangs off the edge, prints a line at a time, the fight's
  own numbers, no second copy; R2 loot and VOID; R3 unroll; R4 total, torn, leave once after the tear; R5 a lost fight; D1 THE DEMO:
  a road fight won through the map's door, the fight's card seen on 0 of 32 frames and the end screen carrying the receipt; D2 the
  bench keeps its card; Z).
- gates/the_spoils_gate.js RE-AIMED: E1 reads YOUR kills off your line on the receipt; and its road fight now steps off the town's
  ground first ('a town is always a door' held every road fight back while the party stood on its start town, so on main D1 failed
  and nothing after it ran). 18 passed, 1 failed: the one red is the crew screen's perk pick after D5 (a tap that times out inside
  slices/BOHEMIA_ROSTER_SCREEN.html), past where the gate could reach on main; NOTE for the crew screen's owner.
- RED ON MAIN, NOT MINE, SAME CAUSE: gates/no_top_bar_in_the_fight_gate.js and gates/make_camp_from_the_fight_gate.js start their
  road fights the same way (the two steps, then roadContactFight) and the town's door holds them back; the fix is the one above.

## [bb] Battle Brothers' after-battle screen is one panel (the loot) after one report; ours is one screen with the report printed
on a receipt that keeps counting what he takes.
## [analog horror] a thermal till roll that prints on its own, a line a quarter beat, VOID struck through, torn off when he goes.
