# CAMP: THE INJURY DAYS ON OUR CLOCK (rule 264(h)), 10/26/26

Session camp-session_01FfxbakbC. Row [the injury days on our clock] (the coordinator's NOTE on CAMP's board; TUNING's NOTE
[the injury days on our clock]; EYES [eyes: the wound's days] SIX-TO-EIGHT-OF-OURS), and EYES [eyes: the clinic twice] ONE-HALVING. The coordinator 07:09: after [a town is safe].

RULE 264(h) [COORDINATOR'S DEFAULT, rule 205, his to flip]: 'his 30 to 40 debuff days are 156 to 208 of our fights (Battle Brothers'
30 to 40 days are about 30 to 40 fights). His intent is about a month of Battle Brothers play, so the struck-down debuff's fresh part
lasts 6 to 8 OF OUR DAYS (the same 30 to 40 fights' worth), the clinic still halving it (241); the permanent mark stays for life.
TUNING writes it beside 234(b); CAMP reads it.' TUNING wrote it (records/BOHEMIA_TUNING_STRUCK_DOWN_HE_STILL_FIGHTS_THE_DEBUFF_AND_THE_
CLINIC_10_26_26.md s9, the one table's struck.fresh.days 6 to 8, whole days, each as likely) and routed: 'move ours.json
struck_down_laid_up_days to [6, 8] with engine/bohemia_long_injury.js's LAID_UP_DAYS_MIN/MAX... treat() exact half'.

## 1. MEASURED FIRST
- The fight rolled every struck man's fresh wound 30 to 40 days (BOHEMIA_FIGHT.html fall(): rint over ours.json
  struck_down_laid_up_days [30, 40]); EYES on the live BUILD 10/26zq: 25 to 39 (DESI 39 of 39 on day 1; the clinic's list 25 to 35).
  At five of our fights a day that is 156 to 208 fights carrying the debuff.
- The clinic halved what was left ROUNDED UP (engine/bohemia_condition.js treat, slices/bohemia_injury_card.js after). At 30 to 40 days
  the rounding hid; at 6 to 8 it does not: a 7-day wound became 4 days and kept 4/7 of its debuff (ranged skill -29 of -50, not -25).
  The clinic gate struck for 7, run on the shipped build (c71def86): C2 and C3 red on both profiles (the card's after ranged skill -29
  of -50; the press left 4 days), 6 ok, 6 failed.
- THE CLINIC TWICE (EYES [eyes: the clinic twice] ONE-HALVING, rule 241(b)): on BUILD 10/26zq the treated card still offered 'Treat DESI:
  13 days to 7, half the wound' for 26 more (greyed, but drawn as an offer, the CLINIC > after beside it) and the doc said 'DESI stays
  with me' (nobody is held out, rule 234). The new leg C3b on the shipped build: red on both (offer true, the after drawn, 'stays with me').
- The LONG INJURY gate read ours.json against the module's constants but never which days, so a wrong range passed: new leg A,
  'THE DAYS ARE OURS', red on the shipped build (1 FAILED, 55 ok), green now.

## 2. NOW
- records/target/bb/ours.json struck_down_laid_up_days [6, 8], 264(h) and TUNING's s9 cited, the old [30, 40] kept as was_days;
  engine/bohemia_long_injury.js LAID_UP_DAYS_MIN 6, MAX 8 (the gate reads them byte for byte). The fight rolls 6, 7 or 8, each as
  likely (its own rint); the condition keeps the wound for those days and the map's clock counts them down, the debuff fading in a
  straight line to nothing (unchanged); the mark stays for life (unchanged).
- THE CLINIC'S HALF IS EXACT (BohemiaCondition.halve, one function for the clinic's card and its press): 7 days left become 3.5, the
  debuff exactly half; every clock shows days rounded up, as it always did, so the card reads 7 DAYS > CLINIC > 4 DAYS and the
  arrows are half as long. The hired medic still takes a day more, never under one day or the half, whichever is less.
- ONE HALVING (the settlement's clinic, marked __THE_CLINIC_HALVES_BOTH__): a wound the clinic already cut is drawn as it is now
  (the plain card, no CLINIC > after), its man reads 'TREATED. I already cut this one in half; the rest heals on the road.', and no
  Treat is offered for him. The doc says 'Let me see them... They walk out with you.' and after the press 'Done. TOMAS walks out with
  you. 4 days instead of 7...' (words draft:true; the older list's 'stays with me', which THE CLINIC'S COUGH reads, is untouched).
- THE CLINIC'S PRICE is unchanged (TUNING: at 6 to 8 days today's formula gives 12 to 16 batteries at level one, Battle Brothers'
  weight; its clinic.price_struck proposal withdrawn).
- The surgeon's one day fewer (condition.json surgeon_injury_days 1) is now a sixth to an eighth of a wound, not a thirtieth: TUNING's
  number to look at (NOTE).

## 3. THE GATES, on the cut
- LONG INJURY 56/0 (A: the days are 6 to 8 of ours, rule 264(h) cited; 4000 rolls inside them).
- THE CLINIC HALVES BOTH 12/0 (was 10/0; on the shipped build 6/6), re-aimed and one leg new: the man struck for 7 days (odd, so a rounded half cannot pass for half the debuff); C2 the
  card's after 4 DAYS and every arrow half; C3 the press leaves 3.5 days and exactly half the debuff; C4 the crew card says THE WOUND
  4 OF 7 DAYS with the same arrows; C3b ONE HALVING: after the press the doc says he walks out with you, his card says TREATED, no
  second Treat and no after column.
- STRUCK DOWN, HE STILL FIGHTS reads its range from ours.json (S2: the fight's own fall() gives 6 to 8 now); its words say so.
- THE REBUILT FIGHT PLAYS (COMBAT's) reads the range already; two leg labels said '30 to 40' and now print the range they check.
- STRUCK DOWN, HE STILL FIGHTS 30/0; THE ROSTER SHOWS THE HURT 14/0, re-aimed (its first leg typed 30 to 40: red 13/1 on the new days,
  'DESI down, 6 days' after; it reads the module's range now); THE ROSTER COUNTS WHO CAN FIGHT 6/0; THE CREW SCREEN AT FOURTEEN 21/0;
  THE FACE SHOWS THE WOUND 29/0; THE HEAL BUTTON 16/0.
- THE SETTLEMENT SCREEN 72/2 on this build and 72/2 twice on plain main (c71def86), the same two legs (the hiring posts' count moves
  between runs: fortress 4 then 6, market day 4 then 6; 74/0 on main once, twenty minutes before): RUN TWO's recruitsHere, not the
  clinic; NOTE on RUN TWO's board.
- THE BROWSERLESS TIER (gates/bohemia_gates.py --pure) ran an hour and was stopped at its limit about row 600 of 1119; every red it
  reached is red on main already (BUNDLE, GRAVEYARD, DISTRICT FILL, REPO BUDGET, MAP SIZE, STREET SOURCE, READABLE RULER, THREE BLOCKS,
  FUTURE LEDGERS, PEOPLE CHARGE, THE ZOOM GOES THROUGH CLOUDS) but three speed gates (CLOCK RATE, LOADING IN PLAY, FPS ON A PHONE),
  measured against main one at a time below.

## 4. THE LAST UPLOAD
Paolo 10/26 (records/BOHEMIA_PAOLO_EVERY_CHAT_STOPS_THE_LAST_UPLOAD_10_26_26.md): 'whatever each chat is doing have them finish their
last task and stop'. This is CAMP's last task and its last upload; [the fight saves only at its start] (rule 233) is NOT started (its
plan stays in records/BOHEMIA_CAMP_STRUCK_DOWN_HE_STILL_FIGHTS_AND_THE_CLINIC_HALVES_BOTH_10_26_26.md section 9), nor the EYES rows
still OPEN on CAMP's board.

[bb Battle Brothers: a struck-down man there keeps his permanent injury for life and nothing fresh; its temple's wounds heal in 1 to 9
of its days. Ours keeps the mark for life and a fresh wound for 6 to 8 of our days, about the month of fights Battle Brothers would take.]
[analog horror: the clock on the man is shorter now; the number drops every night you watch it, and the scar is what is left.]
