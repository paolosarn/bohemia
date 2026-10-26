# TUNING 10/26: THE JOB'S STARS, THE CUT-OFFS (rule 208(b)(f), the coordinator's NOTE [the job's stars, the cut-offs]; research only)

Paolo 10/25 (rule 208): "make sure on the job the stars are red... depending on how difficult the job is, especially if it's gonna
be super overpowered like wolves... that's one of the weak points of Battle Brothers, not really accurate, so try to be accurate."
Rule 208(b): one to three red stars from the chance he comes home clean (nobody of his dead or down); the cut-offs a COORDINATOR'S
DEFAULT (rule 205): one star at nine in ten or better, three worse than six in ten; TUNING's to set from its own fights. The gate,
208(f): 200 rolled jobs, the stars against 100 AUTO plays each: one star clean at least 85 in 100, three stars under 65.
WORLD builds the stars ([the job tells the truth, in blood], CLAIMED 10/26); nothing here is built. The numbers are rows in the one
table, section L. Instrument: tools/bohemia_tuning_the_job_stars.js; bank banks/BOHEMIA_TUNING_THE_JOB_STARS_10_26_26.json.

## 1. HOW IT WAS MEASURED
200 jobs the map could hand: six crews at their points of a game (A New Crew from the door on day 1; his crew, a rifle and two
spear-and-car-door men, day 10; the Lone Wolf from the door, day 1; six men at level 3 on day 20; nine at level 5 in the town shelf
on day 50; twelve at level 8 in the city shelf on day 90), one to three skulls, every faction (brigands half), a district and a
cell; the party counted by WORLD's own job math (records/target/bb/party_math.json job_bb: Battle Brothers' contract multiplier on
his strength, the first day held to his crew plus one) and dressed for his strength. Each job set up on the live fight (rules
print 64d2fbf44e2e) and frozen the way the calculator freezes it, then played: THE READ, the calculator's way (each run thawed
from the frozen board, AUTO both sides, a standoff counted lost), 48 runs kept one by one so the read at 8, 12, 24 (the fight's
own ODDS_RUNS) and 48 runs can be tried; a second read of 24 on other dice (does the star flicker?); THE TRUTH, 100 more plays.
Clean is the calculator's own: won, and no man of his dead, down or fled.

## 2. WHAT THE JOBS ARE (the truth, 100 plays each)
The jobs do not spread evenly: 82 of 200 come home clean under 30 in 100, 66 at 90 or better, only 52 in between (27 at 30 to 60,
5 at 60 to 65, 17 at 65 to 85, 3 at 85 to 90). By crew and skulls (clean / won in 100, the party's mean size):
| crew | 1 skull | 2 skulls | 3 skulls |
|---|---|---|---|
| A New Crew (3) | 67 / 91, 2.6 | 41 / 73, 3.5 | 53 / 87, 3.4 |
| his crew (3) | 36 / 67, 2.6 | 7 / 30, 4.2 | 3 / 23, 5.3 |
| the Lone Wolf (1) | 90 / 90, 1.8 | 95 / 95, 1.7 | 82 / 82, 1.9 |
| six at level 3 | 68 / 100, 2.6 | 58 / 94, 4.1 | 17 / 57, 5.2 |
| nine at level 5 | 84 / 100, 5.3 | 65 / 100, 8.0 | 23 / 83, 10.1 |
| twelve at level 8 | 45 / 97, 8.7 | 38 / 71, 11.1 | 41 / 92, 10.9 |
Three things the stars will say that the skulls do not:
- HIS CREW LOSES TWO- AND THREE-SKULL JOBS: won 30 and 23 in 100 (his 'overpowered in 75 percent of the quests', rule 192, is still
  true for his own three; WORLD's job math sizes his three like A New Crew's three, and his crew is weaker: one shooter, two spears).
- THE SKULLS DO NOT ORDER THE DANGER: A New Crew's three-skull jobs are cleaner than its two-skull jobs (53 against 41), the
  twelve's three-skull cleaner than its two (41 against 38), the Lone Wolf's two-skull the cleanest of his (95).
- A BIG CREW IS RARELY CLEAN EVEN WHEN IT WINS: the twelve wins a one-skull job 97 in 100 and comes home with nobody down 45; the
  nine 100 and 84. On the reading as ruled, a routine job for the twelve wears three red stars (section 4).

## 3. THE CUT-OFFS, TRIED ON THE READ (all 200 jobs; a LIE is a one-star job whose truth is under 85, or a three-star job whose truth is 65 or more)
| read | cut-offs | one star: jobs, clean, lies | two: jobs, clean | three: jobs, clean, lies | the star flickers between two reads | 208(f) |
|---|---|---|---|---|---|---|
| 8 runs | 0.90 / 0.60 | 63, 98, 4 | 33, 70 | 104, 16, 4 | 16 in 100 | pass |
| 12 runs | 0.90 / 0.60 | 72, 97, 6 | 15, 67 | 113, 19, 6 | 14 in 100 | pass |
| 24 runs (the fight's own) | 0.90 / 0.60 | 67, 97, 4 | 21, 78 | 112, 18, 2 | 10 in 100 | pass |
| 48 runs | 0.90 / 0.60 | 63, 98, 0 | 25, 78 | 112, 18, 2 | 7 in 100 | pass |
| 24 runs | 0.95 / 0.50 | 61, 99, 0 | 43, 69 | 96, 12, 0 | 9 in 100 | pass |
| 24 runs | 0.85 / 0.50 | 71, 97, 5 | 33, 63 | 96, 12, 0 | 9 in 100 | pass |
| 24 runs | 0.90 / 0.75 | 67, 97, 4 | 11, 86 | 122, 22, 9 | 9 in 100 | pass |
FINDINGS:
- THE COORDINATOR'S DEFAULT PASSES THE GATE at every read size (one star 97 to 98 clean, three stars 16 to 19), but it lies on 6
  of 200 jobs at the calculator's 24 runs: 4 one-star jobs read at 22 of 24 (0.92) that come home clean 81 or 82 in 100 (A New
  Crew one and two skulls, the nine one, the six three), and 2 three-star jobs of the six at two skulls that come home clean 67 and 72. The gate's pooled numbers cannot see a lie: the jobs are so split that any cut passes it.
- 0.95 / 0.50 LIES ON NONE of the 200 at 24 runs: a one-star read means 23 or 24 clean runs of 24, and every such job came home
  clean 85 or more in 100 (pooled 99); a three-star read means 11 or fewer of 24, and every such job came home clean under 65
  (pooled 12). The two-star band holds 43 jobs, pooled 69, the jobs that really are a coin-weighted risk.
- THE FLICKER: two independent 24-run reads of the same job give it different stars 9 to 11 times in 100 jobs at any cut-off; at 8
  runs (the colour's first show) 16. A button that changes colour on a second look is a button that lies; the read should not be
  shown before its 24 runs, and once shown it is kept for the day (208(d): worked out again only when his crew changes).
- THE CUT-OFFS: ONE STAR AT 0.95 OR BETTER, THREE UNDER 0.50, on the fight's own 24-run read (row job.stars_cut_one,
  job.stars_cut_three). It moves the coordinator's 0.90 up and 0.60 down, both toward the truth's own gap.

## 3b. THE ODDS KEEP UP (the standing row [the odds keep up], rule 178(c), this round's check on the same 200 jobs)
The calculator's clean read against the truth, by what it said (said / the truth, in 100):
| read | 0-20 | 20-40 | 40-60 | 60-80 | 80-95 | 95-100 | mean bias | mean miss |
|---|---|---|---|---|---|---|---|---|
| 8 runs | 3 / 6 (71 jobs) | 29 / 36 (24) | 50 / 46 (9) | 69 / 61 (22) | 88 / 88 (11) | 100 / 98 (63) | -0.1 | 7.5 |
| 24 runs | 4 / 5 (71) | 28 / 29 (18) | 51 / 48 (23) | 70 / 72 (14) | 88 / 87 (13) | 99 / 99 (61) | +0.1 | 4.7 |
| 48 runs | 5 / 5 (75) | 31 / 32 (16) | 52 / 51 (21) | 69 / 72 (12) | 87 / 86 (18) | 99 / 99 (58) | -0.1 | 3.6 |
THE CALCULATOR IS TRUE on the brain as it plays today (rules print 64d2fbf44e2e): at its own 24 runs every band within 3 points, no
bias. At 8 runs (the colour's first show) the 60 to 80 band reads 8 points high and the 20 to 40 band 7 low: the first colour should
not be the star. Re-checked when COMBAT TWO's brain lands (the calculator plays the same brain, rule 201(f)).

## 4. THE BIG CREW: 'NOBODY DOWN' TURNS A ROUTINE JOB RED
On the reading as ruled (208(a): someone dead or down), a crew of nine or twelve almost never comes home clean, so its stars stop
reading the job and start reading its size. On the 200 jobs: the twelve's one-skull jobs are won 97 in 100 and clean 45 (three red
stars at 0.50); the nine's two-skull jobs won 100, clean 65 (two stars). In the watch's 600 fights (round one, by crew size):
| crew | fights | won | clean (nobody down) | won with nobody dead | men down a fight | dead a fight |
|---|---|---|---|---|---|---|
| 2 to 3 | 334 | 241 | 136 | 220 | 1.27 | 0.17 |
| 6 | 33 | 26 | 17 | 22 | 2.03 | 0.52 |
| 12 | 133 | 110 | 36 | 81 | 3.69 | 0.61 |
A man down is laid up 30 to 40 days and dies one time in five (rule 36b); with twelve men that is the cost of a routine day, and
Battle Brothers' own skulls never count it. PROPOSED (a change to 208(a)'s words, so the coordinator's, then his): the star's number
is the chance he comes home with NOBODY DEAD AND NO MORE THAN ONE MAN IN SIX LAID UP (a crew under six: nobody down, the reading as
ruled; six to eleven men: one; twelve: two). For a crew under six the two readings are the same number.
THE SECOND PASS (the six, the nine and the twelve's 99 jobs played again, deaths and downs counted run by run; bank fields readOk, ok,
deaths): clean / the proposed reading / won / a man of his DEAD, in 100 plays:
| crew | 1 skull | 2 skulls | 3 skulls |
|---|---|---|---|
| six at level 3 | 68 / 84 / 100 / 8 | 58 / 74 / 94 / 14 | 17 / 26 / 57 / 49 |
| nine at level 5 | 84 / 94 / 100 / 4 | 65 / 80 / 100 / 12 | 23 / 40 / 83 / 38 |
| twelve at level 8 | 45 / 68 / 97 / 24 | 38 / 46 / 71 / 45 | 41 / 53 / 92 / 35 |
- THE CUT-OFFS HOLD ON THE PROPOSED READING: at 24 runs, 0.95 / 0.50 gives 75 one-star jobs (pooled 98, no lie), 41 two-star (72),
  84 three-star (14, one borderline at 65); the draft 0.90 / 0.60 lies on 6. One pair of cut-offs serves both readings.
- AND THE BIG CREW BLEEDS: in its big-crew jobs a man of his dies in 25.5 of 100 plays (the twelve 35, the nine 18, the six 24); the
  twelve's routine one-skull job, won 97 in 100, kills one of his men 24 times in 100. The proposed reading keeps every death in the
  star (nobody dead is part of it), so that job reads two red stars (68), not one and not three: the truth.


## 5. WHAT PROVES US WRONG
The gate 208(f) as written passes every cut-off from 0.80 to 0.97, so it cannot tell a good cut from a bad one: it checks pooled
means on jobs that are mostly all-clean or all-bloody. The gate that bites is the LIE count (no one-star job under 85, no
three-star job at 65 or more, on 200 rolled jobs), and the flicker (two reads, the same star, at least 90 in 100 jobs).

## ROUTED
- THE ONE TABLE, section L: job.stars_cut_one 0.95, job.stars_cut_three 0.50, job.stars_read_runs 24, job.stars_flicker, the gate's
  lie count; and rule 201's auto.named_share, auto.hurt_standing, auto.spread_rounds by crew size (from the watch's round one).
- WORLD [the job tells the truth, in blood]: the cut-offs, the 24-run read before the button colours, the day's star kept, the big
  crew's reading (section 4), and his crew's two- and three-skull jobs (won 30 and 23).
- THE COORDINATOR: the cut-offs replace a COORDINATOR'S DEFAULT (rule 205); the big-crew reading is a change to 208(a)'s words.
