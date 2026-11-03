# FIXES ITEMS 10 AND 11: NO TWO MEN SHARE A NAME; THE SPANGLISH FREEZE HAS A GATE (11/3/26)
BUILD 11/3zzzj THE WHOLE POST, ONE NAME EACH.

## ITEM 10: NO TWO MEN SHARE A NAME (rule 351(b), ask line 362; Paolo 11/3: 'I think three of them are named the same thing in my company')
MEASURED, the cause: a hire was already made 'unique' (engine/bohemia_hire_lock.js, rule 295), but by a NUMBER. A town's post rolls its
men's names off the place and the week, so the same name stood at the post visit after visit, and hiring him three times gave
TOMAS REYES, TOMAS REYES II, TOMAS REYES III: three men with one name to anyone reading the roster. And the post showed one name while
the hire wrote another.
THE FIX (engine/bohemia_unique_name.js, new; the hire lock now hands its naming to it):
- A name and the same name with a number count as ONE name. A taken man keeps his first name and gets another surname off the one
  names engine (his heritage, a man's name on a man's body, read off his face); only if the surnames run dry, a nickname in front
  (LEFTY, SLIM... draft:true). 'A STRANGER' and a hire called YOU get a whole new name. YOUR name is taken too; the dead give theirs back.
- THE POST shows the name he is hired under: checked against everyone in the company and the other men at the same post
  (slices/BOHEMIA_SETTLEMENT_SCREEN.html); the hire checks again before he is written (the hire lock's uniqueName).
- A SAVE WITH TWINS is mended where the hire lock already mends (every screen that loads it: the shell, the town, the crew screen):
  across the company and the hired, the first keeps the name, every later twin (numbered copies included) is renamed, his face, his
  hire id and everything else his own, his shared record copied to his new name. One man in both lists is matched by his face.
- The names engine and this engine now load before the hire lock in the shell (and the demo), the town and the crew screen.
- GATE: gates/no_two_men_share_a_name_gate.js, in the suite as NO TWO MEN SHARE A NAME, 9/0: 200 hires into one company (seven
  seeds, so most collide; and 200 who arrive as A STRANGER), no two alike; never YOUR name or a living man's; a save with three
  TOMAS REYES, a TOMAS REYES II and a hire named YOU fixed on load (TOMAS WHITFIELD, TOMAS RUCKER, TOMAS WEBB, ROGELIO MUNOZ), faces
  kept, records copied; the hire lock itself hires a TOMAS REYES as TOMAS CARRASCO and splits an old save's two JOE BRANDT.
- ONE COMPANY, A MAN LET GO IS GONE 9/0 (it caught my first try matching a man by hire id, which renamed a man the crew screen
  kept without one; he is now matched by his face). THE ROSTER SCREEN 15/0, THE CREW SCREEN AT FOURTEEN 21/0. THE COMPANY SCREEN 47/1
  and THE SETTLEMENT SCREEN 73/1: the same single red before this change (the computer's path needs one scroll; a gun's name casing).
- Found, not changed: the old origin rule names men past the twelve-name crew list 'NAME II' (13 men and up); the mender now renames
  such a man if both stand in the company.

## ITEM 11: THE SPANGLISH FREEZE HAS A GATE (rule 355, ask line 372)
gates/language_gate.js section I (GREEN 107/0):
- THE FEED'S TWINS FROZEN: 171 Spanglish twins on the feed's kind lines (records/target/bb/feed_kinds.json) and 46 on its replies and
  follow-ups (38 + 8), today's counts, never one more.
- NO SPANISH TWIN IN ANY OTHER FEED FILE (today: the world feed, records/target/bb/feed_world.json, all English as 355(d) says).
- WHAT HE MEETS AT OR UNDER 15 PERCENT: the spoken long play (89,000 lines) 12.2%, the feed paced through the real dial exactly as THE
  FEED'S WORDS plays it (40,000 posts) 13.6%; each at or under 15, so together at or under 15 at any mix.
- Item 9's rewrites added no Spanglish: twins only shortened, 217 different twins before and after.

## ITEM 12: NOTHING POPS UP, 'THE MORNING IS NOT DELETED' (0 lines) AND PAST 400 s
- A STALE LEG, NOT A LOST MORNING. The leg asked for the morning's recap on the phone (the 9/20 card's words moved there instead of
  deleted). Paolo ruled the recap out on 10/25 (rule 164 item 6: 'a whole daily recap I never asked for'), and RUN stood both recaps
  down behind MAP_DAY_RECAP = false; what the night costs is still charged and said where it happens. So the leg read 0 lines on
  every tree since. Re-aimed to his ruling: no recap on the phone, no card for it, the switch off.
- A SECOND STALE LEG behind it, found on the first full run: 'the demo still ends' asked the demo's last night for its ending card;
  rule 72 superseded the one-day demo and RUN took it out on 10/23 (ctDemoOver false: the refused card had frozen the clock at 22:00).
  Re-aimed: the demo's night turns like the workshop's, with no card.
- THE 400 s IS THE GATE'S OWN LENGTH: it plays five minutes of the map by real touches (113 touches, 0 cards) after the boot; measured
  437 s in all, under the suite's 600 s cap. Not hung.
- NOTHING POPS UP 23/0 (was 21/2).
