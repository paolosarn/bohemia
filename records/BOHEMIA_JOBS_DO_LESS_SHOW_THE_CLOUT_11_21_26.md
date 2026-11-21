# JOBS: DO LESS, SHOW THE CLOUT, 11/21/26 (VAMILY rule 466(c), his votes of 11/21; rules 441, 454(a), 461)

THE ASK: the coordinator's routine 'JOBS: do less, show the clout', from his votes (records/BOHEMIA_PAOLO_VOTE_11_21_26.txt):
- jobs-push-the-pay-11-17, NO: 'Doing way too much I don't like it'.
- jobs-paid-into-your-place-11-17, NO: 'This mechanic is so fucking confusing. I don't know what the fuck this shit.'
- jobs-what-walking-away-costs-11-17, NO: 'Doing way too much doing way too much, bro you can have the data and the values in the
  background, but you don't need to explain that obviously dropping a job drop your relation with the settlement'.
- jobs-every-fight-won-counts-11-20, YES, with: 'Where tf do you see your clout????'

## 1. KILLED, GRAVEYARDED
- PUSH THE PAY (BUILD 11/17u): the card's 'Ask +7%' button, the pushed pay, the client who walks off the board; the town screen's
  hag* block and its two-wide row CSS, the shelf's walkedOut, its row in ECONOMY TWO's battery table (relations.json haggle.step);
  TUNING's relations.haggle rows marked DEAD (relations.json keeps the numbers as FACTIONS' data). graveyard/POSTMORTEM_JOBS_PUSH_THE_PAY_11_21_26.txt.
- PAID INTO YOUR PLACE (BUILD 11/17za): the card's 'Into your place' button, the build's worth off the pay (the town screen's into*
  block and payOf; the map's take), the pay-out that stood the build at his place (bohemia_job_kinds.js paid); records/target/bb/
  job_into_place.json moved to graveyard/jobs_paid_into_your_place_11_17_26/; its TUNING rows and its battery table rows and copies out.
  graveyard/POSTMORTEM_JOBS_PAID_INTO_YOUR_PLACE_11_21_26.txt.
The VOTE cards and their pictures stay as voted.

## 2. THE CARD STOPS EXPLAINING
WHAT WALKING AWAY COSTS (BUILD 11/17z): the card's 'DROP IT 50→40 · CLOUT 300→200 / FAIL IT ...' lines are gone (costOf, costWords,
the .trip.quit line and its CSS). The numbers stay in the background exactly as before the build: a dropped job costs its town 10 of its
bar and 100 CLOUT, a failed one 20 and 75 (relations.json acts, renown.json gains; bohemia_job_kinds.js settle, BohemiaRenown.fromAct).

## 3. CLOUT IS SEEN
HOW BATTLE BROTHERS DOES IT: renown belongs to the company, shown with the company on the world map's top.
OURS (slices/bohemia_ui_materials.js __CLOUT_ON_THE_BAR__, UI's bar, one marked line and its CSS): the bar he reads at the top of the map
and the town (batteries, food, tape, meds, rounds) ends with CLOUT and the company's number (BohemiaRenown.score, its own word), repainted
with the bar every half second. One number, no picture of it, no second word.

## 4. PROOF
GATE THE TOWN'S BOOK, rewritten for this: B1 PUSH THE PAY IS DEAD, D1 PAID INTO YOUR PLACE IS DEAD (files: nothing of either in the town
screen, the shelf, the map or the job file; the file and the post-mortems in the graveyard; out of TUNING's table), C1 (the background
numbers, the card's lines gone, the bar's CLOUT), C3 ON HIS PHONE (tools/bohemia_jobs_the_towns_book_on_the_phone.js --build C; the demo
and the alpha, upright and sideways): a job's card with no cost lines, no ask and no build; one taken and dropped in the town with a
finger, and the job that changes halfway walked away from at its turn, still move the bar and CLOUT by the game's own numbers; the map's
bar shows CLOUT on the glass, the company's own number, before and after each. THE BATTERY IS REAL 53/0; RELATIONS 67/0.
RESULT: THE TOWN'S BOOK with JOBS_BUILD=C: 12/0 (B1, D1, C1 files; C3 the four phones: the card [Take it / Not now] on each; dropped
50 to 40 (43.75 on the demo's run: the town's dawn drift back toward 50 while the map's clock ran, relations.json drift, allowed up to 5),
CLOUT 300 to 200; failed (the job that changes halfway, walked away from at its turn) 20 more, CLOUT 200 to 125; the bar on the glass 300,
200, 125, the company's own number each time). Earlier runs this round, said: the test first asked the town screen for a variable it does
not expose (it reads relations.json now), then held the dawn drift as a fault, then wanted three buttons on a card that now has two.
THE VOTE PICTURE: the demo upright, the top bar ending 'CLOUT 145'.

[bb Battle Brothers keeps renown with the company, and a contract is offered, not argued]
[analog horror: the number at the top of the screen is the only thing anyone remembers about you]
