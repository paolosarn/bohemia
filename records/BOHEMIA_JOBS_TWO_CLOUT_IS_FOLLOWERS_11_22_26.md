# JOBS 2 -- CLOUT IS FOLLOWERS (BUILD 11/22zf - YOUR FOLLOWERS), 11/22/26

VAMILY rules 470(b), 466(c), 461, 441, 465. Ask row 702. Owner JOBS 2 (with UI for the bar's chip).

## HIS WORDS
On the card jobs-do-less-show-the-clout-11-21 (YES, records/BOHEMIA_PAOLO_VOTE_11_22_26.txt):
'Put followers this was an idea at the very beginning where it's kind of like your reputation but you can. You can put followers type shit.'
Rule 470(b): the company's fame is shown as its followers on the feed, one number. The coordinator's brief: going up with every fight won
and the deeds the feed already posts, falling the way CLOUT falls; the numbers in the background, no explanations on cards (466(c)).

## THE IDEA AT THE VERY BEGINNING (read, not invented)
laws/BOHEMIA_ADDENDUM_SOCIAL_FEED_QUEST_LOG_7_20_26.md: 'FOLLOWERS is the visible reputation metric grown by notable deeds.'
laws/BOHEMIA_ADDENDUM_CLOUT_RECKLESS_BEATS_QUIET_7_21_26.md left one thing pending: 'Whether FOLLOWERS and CLOUT end up as one number or
two.' His 11/22 answer is one: the company's name in the valley (engine/bohemia_renown.js, Battle Brothers' Renown, the count that opens
the retinue's places, the big work at 250 and 1050 and bends a job's pay) IS its followers. No second count, nothing in the math moved.

## MEASURED FIRST
- The count already moves the way the brief asks. Up: a fight won, 5 a man beaten (renown.json fight_won_per_enemy, keyed by the fight's
  hand-over since 11/20t); a job done +100, done in part +50; a place put down +10; a boss's gifts once a day. Down: 3 a day the map's
  clock passes (11/20p, Battle Brothers' Daily Renown Decay -3); a dropped job -100, a failed one -75.
- The feed's own deeds about the company (records/target/bb/feed_kinds.json, source 'mine'): job taken, job done, dropped or failed,
  fight won, lost, fled, a man hired, let go, hurt, dead, a town entered, a rare man seen, a wipe, the start, the crew ate, a man walked.
  The ones that are fame (a fight won, a job done, a job dropped or failed) are the ones that move the count; nothing new was added.
- THE FEED'S OWN PAGE NEVER SHOWED IT: the phone's company profile asked BohemiaRenown.get(), which never existed, so the profile read
  '3 MEN' and nothing else since the phone was built (slices/bohemia_phone.js P.company).
- On an upright phone (390 wide) the bar is full: the word FOLLOWERS (nine letters where CLOUT had five) at the old size ran the chip
  10 px past the glass after five days (the batteries counting down, food at three figures): 354 to 392 against a glass ending at 382.

## BUILT
- records/target/bb/renown.json word FOLLOWERS (its why quotes him and 470(b)); engine/bohemia_renown.js's first-frame copy says the same
  (__CLOUT_IS_FOLLOWERS__). Every screen that names the count reads this word: the bar, the town board's 'MORE WORK HERE AT 250
  FOLLOWERS · YOU HAVE 200', the card's 'Your name: about +140 FOLLOWERS.', the camp's 'FOLLOWERS 245 ... THE NEXT AT 250'.
- THE BAR (slices/bohemia_ui_materials.js, the 11/21 chip): FOLLOWERS over the number; label 7.5 px, and on screens under 480 wide the
  glass's gap is 7 px while the chip is there (measured: 339 to 373 in the worst state, 9 px inside the glass). For a second after the
  count moves the number flickers like a tape counter (up a pale amber, down a dried red). No '+N'.
- THE FEED (slices/bohemia_phone.js): the company's profile on THE FEED's page reads the count: the name, '3 MEN', and under it '260
  FOLLOWERS' with the number big, the way a profile says it; it repaints when the count moves with no new post (a day's fade).
- The game's last 'CLOUT' fallbacks (when the engine is not up yet) say FOLLOWERS (slices/bohemia_job_kinds.js, the settlement screen).

## ON HIS PHONE (tools/bohemia_jobs_the_towns_book_on_the_phone.js --build F; gate CLOUT IS FOLLOWERS)
The demo and the alpha, upright and sideways, a new crew (K7QM9X). The bar read off the glass (what a finger there hits is the chip) and
THE FEED opened with a finger on the phone's feed:
  a new company 0 | 0 | 0; set 245 | 245 | 245; a fight won against three 260 | 260 | 260 (the bar flickered up); five days on the
  clock and a step 245 | 245 | 245; a job dropped 145 | 145 | 145 (count | bar | feed), on all four.
The one shortcut, said: 245 is set in the game's own record, and the fight's +15 is BohemiaRenown.fightWon(3, key), the call the map's
fight-end hook makes (EVERY FIGHT WON COUNTS proves the real fights on AUTO pay it).

## NOT DONE, SAID
- The phone's home face (the newest post over the wallpaper) does not carry the count: the feed's own page and the bar do. Rule 286(c)
  puts the feed on the face; the face's strip is one post wide (about 100 px) and a number there read as the poster's.
- The 7/21 lock 'reckless beats quiet' is the old quest layer's: a job's +100 is flat by its skulls (TUNING's, renown.json gains).
  Not moved: his 466(c) says the jobs do too much.
- Battle Brothers' 'Retreat from Combat -15' (bb_all/1679) is not ours; a fled fight posts on the feed and costs nothing. Not added for
  the same reason; TUNING's to weigh.

## GATE
gates/clout_is_followers_gate.js, in the suite as CLOUT IS FOLLOWERS: F1 the files (planted: the old chip and the old profile line are
caught), F2 the four phones, F3 nothing threw. THE TOWN'S BOOK's C1 and E1 and its E3 walk, A NAME FADES' N3 and THE NEW KINDS' card
leg read the new word.

[bb Battle Brothers keeps one Renown number for the company, on the world map, and it decays when you sit still]
[analog horror: the number in the corner of the phone ticks up after the shooting stops, and you never see who is watching]
