# ECONOMY 2: A JOB PAYS FOR THE TIME AND THE RISK (11/2/26, rule 323 and its amendment, ask lines 320 and 321)

PAOLO 11/2, playing: "I don't have any problem with the hunt the dogs quest, but I just don't think it's giving me enough
money for the amount of time that I'm doing for it... for most of the quests I want you to feel properly compensated with
how difficult it was... it's a bit tedious to chase 11 dogs on the map nearby... it would just be a little bit more... I'm
sure there's a system where it's like how friendly you are with the settlement, with a faction."
AMENDED THE SAME ROUND (rule 323, ask line 321): "quests that don't have any combat, you shouldn't be getting as much
batteries... every time we had to pay for someone to get killed... a quest with no killing is just not as much...
imagine you order something today but you gotta pay an extra 5000 to have someone protect and kill for you."
Rule 303 over it: the game never makes you want to cheat; fair, never stingy.

## 1. MEASURED: what a job paid, against what it cost him

Every board job (the 39 on the shelf, records/target/BOHEMIA_BOARD_SHELF.json, and the 11 board people in
records/target/BOHEMIA_JOB_KINDS.json) paid a flat 30 a skull (the shelf's baker, tools/bohemia_run2_board_shelf.py,
`skulls * PAY_PER_SKULL`; the board people hand-set 35 to 90). Nothing about the job moved the pay: not its hours, not its
fights, not the count of targets. The dog hunt (qd-aa01, "Clear the dogs off the back wall") is ONE skull and ELEVEN dogs in
packs of two to four: about four fights and five walks (to each pack, then back to the client), for 30. A one-fight crew
job 8 blocks out paid the same 30. Per fight: the hunt paid 8.2, the crew job 30.

WHAT A MAP HOUR COSTS THE CREW (records/target/bb/nightly_bill.json, 2 a man a night, plus the hired men's wages):
the start's three, 6 a night = 0.25 an hour; TUNING's twelve hired in the first week, about 33 a night = 1.375 an hour.
The bar is set at the top one (1.375), so a job that clears it clears every smaller crew.
WHAT A MAP HOUR COSTS HIM IN REAL TIME: a map hour passes in 2 to 5 real seconds; a fight is 2 to 4 real minutes (9/29).
So his time is in the FIGHTS, and the fights carry the pay.

THE HOURS. WORLD 4's 95-job measurement (records/BOHEMIA_WORLD_A_JOBS_TIME_IS_THE_TRUTH_11_2_26.md) had NOT landed when
this shipped (checked three times on origin/main). So the hours are MODELLED from the same data the map plays the job
with (engine/bohemia_job_pay.js base(): the kind's blocks, packs, posts, legs, waves; the real places' distance), at the
MEASURED 8.5 minutes a block (the carts to PRIMM: 159 blocks at 1.6 pace in a day and a half). When WORLD 4's numbers
land, its hours replace the model's (one number per job; the table below is where they go).

## 2. BATTLE BROTHERS FIRST: how it pays a contract

From our library (bb_all/0441_Contracts.txt, bb_all/1670_Relations.txt, bb_all/1679_Renown.txt, bb_all/0724_Factions and
Relations.txt; reference/library/grok/GROK_ASK_56, GROK_139, GROK_10):
- Pay scales with the contract's TYPE, its DIFFICULTY in skulls ("more skulls means more danger, but a better pay"), the
  company's RENOWN ("the crowns reward increases with your company's Renown"; ours is CLOUT, x1 to x4.5), and a small
  random factor. A longer escort is harder because you meet more parties, and pays for it.
- A contract can pay part on completion, part in ADVANCE and part PER HEAD (the wiki's worked example: 610 after, 10 a head,
  up to 15 heads, 760 in all); haggling moves money between the three.
- RELATIONS: per settlement and per noble house, 0 to 100 on nine bands, start Neutral (50), drift toward 50 by 0.25 a dawn.
  A finished civilian contract +10, poorly done +5, failed -20, cancelled -10. The wiki ties relations to MARKET PRICES
  (good relations lower what you buy and raise what you sell; about 15% off the buy price at the top of the bar) and to
  ACCESS (only a place you are on terms with gives you contracts); it states no relations-to-pay formula. Renown is the
  pay lever in Battle Brothers.
- OURS ON TOP (Paolo asked for it): the client town's bar bends the pay, at most the same 15% a friend's market gives.

## 3. THE FORMULA (records/target/bb/job_pay.json, every number with its reason; engine/bohemia_job_pay.js base())

  time    = map hours x 1.375 (the crew an hour) x (1 + 1.0 margin)          = 2.75 a map hour, KILLING WORK
            a job with no killing: x (1 + 0.5 quiet margin)                    = 2.06 a map hour, THE PEACEFUL BASE
  killing = (planned fights + twist chance) x 26 x skulls (1, 2, 3)            THE VIOLENCE PREMIUM
            a HUNT counts heads: heads / 3 (a pack is 2 to 4) fights, so eleven dogs pay for eleven
            a CAMP's fight is bigger by its two extra men over the party (4, 6, 8 at 1, 2, 3 skulls)
  pay     = round up (time + killing), never under the floor
  floor   = KILLING WORK (planned fights half a fight or more): 30 a skull and never under what the job paid before
            NO KILLING EXPECTED (a find, a carry, a scout, a walk with nobody guarding): only 10 a skull
  offer   = pay x the town's standing (bands below) x clout x the start's bonus (the map's loopJobPay, unchanged)

THE MARGIN, AND WHY: 1.0, the hours pay double what they cost. Battle Brothers' early contract (760 crowns) against a
company burning 150 to 300 a day for a job of two or three days pays one to two and a half times its days of upkeep; the
low middle, double, and the fights are paid on top. A WALK's hours carry half that margin (0.5, the coordinator's brief
11/2: 'they still beat the crew's cost per hour, just with a smaller margin'): 2.06 a map hour. NO killing job pays under
2.75 a map hour, NO walk under 2.06, and both are over the crew's 1.375.
PER FIGHT, AND WHY: 26 at one skull, so the shortest one-fight job (a crew 8 blocks out: 1.1 h x 2.75 = 3 + 26 = 29)
lands on the old 30, and every extra fight is paid like the first.

THE STANDING (records/target/bb/relations.json bands; what the offer says, under the trip on the town's board):
  hostile 0.85 "THEY HATE YOU HERE: -15% PAY" | threatening 0.88 | unfriendly 0.92 | cold 0.96 "COLD HERE: -4% PAY" |
  neutral 1 (says nothing) | open 1.04 "THEY LIKE YOU: +4% PAY" | friendly 1.08 "A FRIEND'S PRICE: +8% PAY" |
  very friendly 1.12 | allied 1.15 "FAMILY HERE: +15% PAY"
Two finished jobs for one town from the start (50 + 10 + 10) make it FRIENDLY: the dog hunt's 116 offers 125 there.
THE OFFER ALSO SAYS WHICH KIND OF MONEY: "KILLING WORK: THE BLOOD PRICE IS IN IT" or "NO KILLING EXPECTED: WALKING PAY".

WIRES (each one marked __A_JOB_PAYS_FOR_THE_TIME_AND_THE_RISK__ or "ECONOMY 2"):
- slices/BOHEMIA_CITY_WORLD.html loopJobPay(base, place, st): the standing in the pay (the board's number when it hands one,
  else the town's own bar, drifted and with the settled jobs still on their way); loopTakeContract passes the town and the
  board's number, so what he is shown is what he is paid.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html: payShown() bends by the town's bar (the arrival's own number), the offer says the
  killing word and the standing word under the trip, the contract carries {standing:{mult}} to the map.
- slices/bohemia_phone_board.js: the phone passes the place, so its list shows the bent pay.
- tools/bohemia_run2_board_shelf.py reads job_pay.json 'pays'; tools/bohemia_economy_job_pay.js writes it.

## 4. THE TABLE, BEFORE AND AFTER (neutral standing, before clout)

Every job (hrs = modelled map hours, fts = fights in it, the twist's chance included; /h = batteries a map hour,
/ft = batteries a fight; the crew burns 1.375 a map hour at the top of the first month, 0.25 for the start's three):

```
job            kind            sk   hrs   fts  was  now  was/h  now/h was/ft now/ft
qd-ae10        hunt-kind        3   6.0  2.33   90  199   15.0   33.2   38.6   85.4
qd-ap01        recover-return   1   2.8  1.00   30   34   10.7   12.1   30.0   34.0
qd-ap03        hunt-kind        1   4.5  1.33   30   47    6.7   10.4   22.6   35.3
qd-ap07        recover-return   1   2.8  1.00   30   34   10.7   12.1   30.0   34.0
qd-ap10        recover-return   2   2.8  1.00   60   60   21.4   21.4   60.0   60.0
qd-ap11        find-place       1   3.8  0.20   30   14    7.9    3.7  150.0   70.0
qd-ap16        recover-return   1   2.8  1.00   30   34   10.7   12.1   30.0   34.0
qd-ae09        haul-caravan     1   4.3  1.00   30   38    7.0    8.8   30.0   38.0
qd-ar03        hunt-kind        2   4.5  2.00   60  117   13.3   26.0   30.0   58.5
qd-r01         hold-defend      1   6.0  2.00   30   69    5.0   11.5   15.0   34.5
qd-ap13        recover-return   2   2.8  1.00   60   60   21.4   21.4   60.0   60.0
qd-aq03        recover-return   2   2.8  1.00   60   60   21.4   21.4   60.0   60.0
qd-s08         recover-return   1   2.8  0.00   30   10   10.7    3.6      -      -
qd-s10         clear-crew       1   1.1  1.00   30   30   27.3   27.3   30.0   30.0
qd-s17         find-place       2   3.8  0.20   60   20   15.8    5.3  300.0  100.0
qd-ar10        find-person      3   4.1  0.25   90   30   22.0    7.3  360.0  120.0
qd-ar08        carry            2   5.7  0.20   60   23   10.5    4.0  300.0  115.0
qd-aa01        hunt-kind        1   7.4  3.67   30  116    4.1   15.7    8.2   31.6
qd-s01         clear-camp       2  17.4  1.33   60  118    3.4    6.8   45.1   88.7
qd-s03         haul-caravan     1   4.3  1.00   30   38    7.0    8.8   30.0   38.0
qd-ap02        hold-defend      2   6.0  2.00   60  121   10.0   20.2   30.0   60.5
qd-ap05        find-person      2   4.1  0.25   60   22   14.6    5.4  240.0   88.0
qd-ap08        recover-return   3   2.8  1.00   90   90   32.1   32.1   90.0   90.0
qd-ap09        recover-return   1   2.8  0.00   30   10   10.7    3.6      -      -
qd-ap19        clear-camp       2   1.1  1.33   60   73   54.5   66.4   45.1   54.9
qd-aa15        hunt-kind        2   3.0  0.67   60   60   20.0   20.0   89.6   89.6
qd-ar02        haul-caravan     2  27.9  1.00   60  129    2.2    4.6   60.0  129.0
qd-ap15        recover-return   2   2.8  1.00   60   60   21.4   21.4   60.0   60.0
qd-t02         hold-defend      2   6.0  2.00   60  121   10.0   20.2   30.0   60.5
qd-s15         hold-defend      3   6.0  3.00   90  251   15.0   41.8   30.0   83.7
qd-ar09        hold-defend      2   6.0  2.00   60  121   10.0   20.2   30.0   60.5
qd-t06         clear-camp       3   1.1  1.25   90  101   81.8   91.8   72.0   80.8
qd-s06         haul-caravan     1   4.3  1.00   30   38    7.0    8.8   30.0   38.0
qd-aa09        find-place       1  10.5  0.20   30   27    2.9    2.6  150.0  135.0
qd-ar06        find-place       2  25.5  0.20   60   63    2.4    2.5  300.0  315.0
qd-c02         recover-return   1   2.8  1.00   30   34   10.7   12.1   30.0   34.0
qd-s04         haul-caravan     1   4.3  1.00   30   38    7.0    8.8   30.0   38.0
qd-ar05        haul-caravan     3  33.5  2.00   90  249    2.7    7.4   45.0  124.5
qd-a02         haul-caravan     1   4.3  1.00   30   38    7.0    8.8   30.0   38.0
jk-patrol-dam  patrol           2   5.1  2.00   60  119   11.8   23.3   30.0   59.5
jk-patrol-wash patrol           1   5.1  1.00   30   41    5.9    8.0   30.0   41.0
jk-ambush-cut  ambush           2   4.7  1.20   60   76   12.8   16.2   50.0   63.3
jk-envoy-clerk envoy            1   2.6  0.40   40   16   15.4    6.2  100.0   40.0
jk-bounty-chuy bounty           2   9.4  1.00   70   78    7.4    8.3   70.0   78.0
jk-scout-wells scout            1   3.9  0.00   35   10    9.0    2.6      -      -
jk-burn-tires  burn             2   2.6  1.00   55   60   21.2   23.1   55.0   60.0
jk-collect-betocollect          1   2.3  1.00   40   40   17.4   17.4   40.0   40.0
jk-biggame-lionbig-game         3   4.3  1.00   90   90   20.9   20.9   90.0   90.0
jk-signal-voicesignal           1  10.3  0.00   45   22    4.4    2.1      -      -
jk-free-pen    free             2   3.0  1.00   65   65   21.7   21.7   65.0   65.0
```

Every kind (averaged over its jobs):
```
kind            jobs    hrs   fts   was   now  was/h  now/h was/ft now/ft crew/h
ambush             1    4.7  1.20    60    76   12.8   16.2   50.0   63.3   1.38
big-game           1    4.3  1.00    90    90   20.9   20.9   90.0   90.0   1.38
bounty             1    9.4  1.00    70    78    7.4    8.3   70.0   78.0   1.38
burn               1    2.6  1.00    55    60   21.2   23.1   55.0   60.0   1.38
carry              1    5.7  0.20    60    23   10.5    4.0  300.0  115.0   1.38
clear-camp         3    6.5  1.30    70    97   10.7   14.9   53.7   74.7   1.38
clear-crew         1    1.1  1.00    30    30   27.3   27.3   30.0   30.0   1.38
collect            1    2.3  1.00    40    40   17.4   17.4   40.0   40.0   1.38
envoy              1    2.6  0.40    40    16   15.4    6.2  100.0   40.0   1.38
find-person        2    4.1  0.25    75    26   18.3    6.3  300.0  104.0   1.38
find-place         4   10.9  0.20    45    31    4.1    2.8  225.0  155.0   1.38
free               1    3.0  1.00    65    65   21.7   21.7   65.0   65.0   1.38
haul-caravan       7   11.8  1.14    43    81    3.6    6.9   37.5   71.0   1.38
hold-defend        5    6.0  2.20    60   137   10.0   22.8   27.3   62.1   1.38
hunt-kind          5    5.1  2.00    54   108   10.6   21.2   27.0   53.9   1.38
patrol             2    5.1  1.50    45    80    8.8   15.7   30.0   53.3   1.38
recover-return    11    2.8  0.82    46    44   16.6   15.8   56.7   54.0   1.38
scout              1    3.9  0.00    35    10    9.0    2.6      -      -   1.38
signal             1   10.3  0.00    45    22    4.4    2.1      -      -   1.38

jobs under the bar (killing work 2.75, a walk 2.06 a map hour): none
```

READ IT: the hunts roughly double (the dogs 30 to 116, the wolves 90 to 198), the holds more than double (each wave is a
fight), the escorts nearly double (the road's raiders were never paid), a one-fight job stays where it was (30, 60, 90),
and the walks drop: a scout 35 to 10, the envoy 40 to 16, a carry 60 to 23, a 3-skull find 90 to 30. A long walk's own
hours still pay (the lodge, 25 map hours away: 60 to 63). A map hour of killing work now pays 14.3; a map hour of
walking 3.3; both over the crew's 1.375.

## 5. THE PURSE, DAYS 1 TO 50 (tools/bohemia_economy_job_pay.js --purse)

A probe, the same for before and after: the company takes the board's 50 jobs in one seeded order, back to back, each its
modelled hours plus 4 hours to the next board; a night's bill at 2 a man plus a hired man's wage of 1; three men, three
more hired at 20 each at the start of weeks two, three and four (twelve by day 22); clout +100 a job and +5 an enemy
(records/target/bb/renown.json) multiplies pay x1 to x4.5 at 4,000; every job won; neutral standing. It is a CEILING (no
gear bought, no fight lost, no day off the treadmill), so read the RATIO, not the size.

```
the purse, days 1 to 50 (start 290, the same jobs in the same order, every job won, neutral standing)
day  before   after  ratio  jobs men clout
  1     497     530   1.07     4   3   465
  5    1543    1579   1.02    15   3  1698
 10    3617    4107   1.14    27   6  3074
 15    5754    7450   1.29    38   9  4382
 20    7569   10424   1.38    48   9  5562
 25    9783   13945   1.43    57  12  6610
 30   11531   16450   1.43    67  12  7756
 40   18290   24940   1.36    96  12 11142
 50   24284   33846   1.39   124  12 14503
a map hour of the job loop pays, before clout: was 5.19, now 6.82 (x1.31)
```

The curve rises by under half (x1.07 on day 1, x1.14 on day 10, x1.43 on day 30, x1.39 on day 50; a map hour of the job
loop x1.31 before clout). It does not explode: no day doubles, and the size of the climb is clout's (TUNING's x4.5), which
this round did not touch. ECONOMY's own 10/18 measure found every purse on main harder than Battle Brothers'
(records/BOHEMIA_ECONOMY_DAY_72_A_WEEK_AT_THE_COUNTER_IS_42_AND_EVERY_PURSE_ON_MAIN_IS_HARDER_THAN_BATTLE_BROTHERS_10_18_26.md),
so a third more for the work that kills is the direction the game already needed. The danger ramp (rule 255, the day-fifty
curve) sends harder jobs later, and harder jobs now pay for every fight in them, so the late board pays more than before
by design, not by drift.

## 6. GATES

- NEW gates/a_job_pays_for_the_time_and_the_risk_gate.js (in the suite, A JOB PAYS FOR THE TIME AND THE RISK): 23 checks,
  PASS. The table is what the formula writes byte for byte; every board job pays its row; every number has its reason; no
  killing job under 2.75 a map hour and no walk under 2.06 (the smaller margin); no killing job under its old pay; every quiet
  job at most three quarters of the same hours with a fight in them, 11 of 12 under their old pay, a killing hour at least twice a walking hour; the offer's words; the
  dog hunt counts 11 heads; the standing bands rise, neutral 1, top 1.15, words with the percent and no em dash; a friendly
  town bends 116 to 125; the drift; the wires; the purse under double.
- gates/the_boards_quests_are_people_gate.js: its "pays 30 a skull" check now reads the table (and never under 30 a skull).
- Re-run, the same result as clean origin/main (their failures are on main without this change, measured side by side in a
  clean worktree): gates/money_teaches_gate.js (M3 and "the money ran", null), gates/the_phones_board_gate.js (the card
  size and finger checks), gates/the_towns_part_gate.js (E8 crowd taps, B1 the crew screen: 16 passed, 3 failed both ways),
  gates/the_ten_changes_the_uis_part_gate.js (T1 to T8, undefined on main). PASS: the board's people (16 of 16), CONTRACTS (24 of
  24), A PLAIN WAY TO DROP A JOB (6 of 6). tools/bohemia_tuning_money_teaches.js itself stops at "THE HALL MOVED: hallPrice changed" on main.

## 7. WHAT IS LEFT

- WORLD 4's measured hours replace the modelled ones when its record lands (job_pay.json 'pays' hours; re-run the tool).
- Battle Brothers' refusal: a town at THREATENING or worse should not offer work at all; here it only pays less.
- The phone's job card shows the bent pay but not the words (UI's card; the words are on the town's board).
- A per-head pay for a CAMP and a PATROL is still their old flat-plus-head split inside the job (slices/bohemia_job_kinds.js
  flat and per_head_share); the total they split is the new pay.
- The no-killing floor (10 a skull) and the two margins (1.0 killing, 0.5 walking) are first numbers for TUNING's one table.
