# WORLD: THE JOB TELLS THE TRUTH, IN BLOOD (rule 208), A DONE JOB IS GONE, THE ROSTER COUNTS WHO CAN FIGHT, A JOB'S TIME COUNTS THE WAY BACK (10/26)

Session world-job-blood. Rows: [the job tells the truth, in blood] (rule 208, first on the board), [eyes: a done job comes back]
(EYES line 114), EYES' NOTE on line 79 [the roster scales the enemy]. Rule 179: every row here is BUILT, NOT YET SEEN until EYES
marks it in the live demo.

## HIS WORDS (10/25)
'make sure on the job the stars are red, and the button itself looks bloody depending on how difficult the job is, especially if
it's gonna be super overpowered like wolves... I did a couple two-star quests... that's one of the weak points of Battle Brothers,
not really accurate, so try to be accurate... depending on the chance of an encounter and how dangerous the encounters are... the
button looking like some crashbox blood filter.' And: 'not Crash Bandicoot, Crashbox.'

## 1. MEASURED FIRST
- The stars were the contract's skulls on the company's strength (53acbf78, rule 192). Nothing ever asked what the fight would do
  to HIS men as they stood. EYES (line 114): two beasts 'SOME' killed the Lone Wolf alone on day one; eight raiders against the Block
  Watch's twelve won with three dead, the same job again wiped; the rescue sent eight at YOU alone.
- THE '4 MEN' FOR TWO BEASTS, found: the map's job kinds handed the fight a party of four (the pack's size) and the shell's door then
  held the first day's line (the company plus one: the Lone Wolf's two). The card said what was asked, the fight dealt what was
  held. Two more lies of the same kind were waiting: the fight re-rolls a brigand party into the road's factions after the first
  fight (kids, machines, heavies), and a tougher faction fields fewer (kids x0.6, heavies x0.45), so '5 MEN' could be three kids.
- THE ROAD, MEASURED (tools/bohemia_world_road_rate.js, the live demo, his computer): 260 game hours of travel over 130 trips town to
  town: ONE crew came for him (the map's forced road events, huntSpawn), and none reached him while he kept walking. The road is
  nearly empty today; the stars count it at that rate (records/target/bb/job_danger.json road_per_hour 0.0038) and follow it the
  day the road sends more (re-run the tool).

## 2. BUILT
- slices/bohemia_job_danger.js (new, WORLD's). THE FIGHT'S OWN RULES: it reads BOHEMIA_FIGHT.html itself (its fight-data and
  fight-rules scripts and its oddsRunValue, never a copy), so COMBAT TWO's AUTO brain gets better here the moment it lands there.
  A worker plays; a phone with no worker plays the fight's own six milliseconds a frame.
- EVERY FIGHT A JOB BRINGS (BohemiaJobKinds.fightsOf, slices/bohemia_job_kinds.js): the sure fights as the yes would make them
  (plan() is make() on a copy: a crew, a camp, the caravan's raids, the hunt's packs until the count, the stand's waves, the
  patrol's bands, the guards), each twist that is a fight at the kind's own rate (never the rolled twist: the stars say the chance,
  they do not spoil the surprise), and the road's (the trip's hours at the measured rate). A held job lists what is left of it.
- EACH ROLLED BY THE FIGHT'S OWN SETUP (the road's faction, a tougher faction's fewer, the graveyard's dead, the first day's line)
  and PLAYED ON AUTO against his crew as the fight's own door would hand it (the shell's nfOpts: who is able, laid up, the line,
  what each man wears): 32 plays a fight (8 for one that only might come), a fight plainly lost stops after 12.
- WHAT A PLAY IS WORTH is the AUTO button's own count (rule 144(e)(f)): home with nobody down 1, with men down half the share still
  standing, any death or a loss 0. (Measured first with 'nobody down' taken literally: twelve men read three stars on every job,
  one man of twelve knocked down counting the same as a wipe.) That is 'the chance he comes home with someone dead or down, weighted by how bad' (the ruling's
  own words in records/BOHEMIA_PAOLO_THE_JOB_TELLS_THE_TRUTH_IN_BLOOD_10_25_26.md (a)), and it is the very number the AUTO button's
  colour shows, so the job's stars and the AUTO colour never disagree. The job is the product over its fights of (1 - p x (1 -
  worth)). ONE red star at 0.95 or better, THREE under 0.50: TUNING's measured cut-offs (records/BOHEMIA_TUNING_THE_JOBS_STARS_CUT_OFFS_10_26_26.md:
  the coordinator's draft 0.90 / 0.60 lied on 6 of their 200), in job_danger.json. A fight whose read lands within 0.12 of a line
  plays 32 more before the star is decided (measured: one shared read of 32 came out 0.60 for a fight worth 0.80, and every Lone Wolf
  job with that fight read three stars); a fight plainly lost (under 0.42 after 12) stops early.
- THE STARS ARE RED: BohemiaMaterials.stars(n, {red: true}) (UI's file, one option and one variable, marked): red with a pixel of
  bone round it, so it reads on paper, on tin and on the blood. While a job is still being played its stars show dim.
- THE BUTTON BLEEDS, CRASHBOX: tools/bohemia_world_job_blood.py models the clay in Blender (bpy 5.2) under the kit's own sun (155.4
  degrees, 40 up, slices/ui_kit/kit.json): metaball drips that swell and pinch and end in a bead, a finger's drag, a thumb pressed in
  with ridges in the bump, flecks; wet red going to dried brown-black where the clay turns from the eye; its own shadow on the tin
  through a shadow catcher; six stages, cumulative; each twice (a and b, every lump nudged a hair) shown a beat each, the stop-motion
  hold; three widths (2.5, 4 and 10 to one) so a drip is never stretched. slices/job_blood, 72 pictures, 468 KB. On the page the
  stage under and the next over it crossfade with the danger, and it darkens as it rises: one continuous scale, clean below 4 in 100,
  soaked at 65. It sits under the words; past a third of the way the words get a hard pixel of bone round each letter.
  WHERE: the town's board rows, the offer's TAKE IT (and the client's name carries the red stars), the phone's job cards, and the meet
  card's ENGAGE (its stars are that fight's own read).
- THE MEET CARD COUNTS TRUE: every encounter's party is rolled once at RUN's one door (cityHandOver -> BohemiaJobDanger.rollInto),
  the band rides through the shell's door (nfOpts carries party.band) and the fight deals it as rolled (COMBAT's bandOf, roadOpts and
  the graveyard's line each take a rolled band whole: three lines, marked). The card says it by kind: '2 DIRE WOLVES', '4 BEASTS',
  '1 KID', 'MEN'. Its YOU is the men the fight's own door stands on the board.
- WORKED OUT AGAIN WHEN HIS CREW CHANGES: a read is keyed on the crew the door would hand over (names, levels, backgrounds, the four
  slots, the line, the day); a hire, a death, a man laid up, a new coat, and it reads again the next time he looks.

## 3. LINE 114'S OTHER NOTES AND LINE 79
- A FINISHED JOB IS GONE FOR GOOD: the town's board was handed only the jobs he held, never the ones he finished (the phone already
  skipped them), so 'Bring the Salcedo family home', paid, was offered again at once. The map now hands the board every job he
  finished (loopPostOpen 'done'), the board skips them (RUN TWO's boardHere, marked), and the list keeps 500, not 60.
- THE ROSTER COUNTS WHO CAN FIGHT (line 79): the enemy was sized to every man on the crew screen, the dead ones the screen still
  listed, the men the enemy had taken after a wipe and the laid-up. Now: never the dead (the fight's rows and the crew screen's own),
  never the taken (bohemia.taken.v1), never a man laid up until his day; so after three dead and four laid up of twelve it sizes to
  five, and the rescue after a wipe sizes to YOU alone (three, where EYES met eight). NOT MINE: the map's bar said 12/25 and 13/25
  while the crew screen said 9/25 (RUN's [eyes: the dead, again]).

## 4. A JOB'S TIME COUNTS THE WAY BACK (rule 222, second on the board, built the same round)
His words, 10/26: 'you have to include the time it takes to get back, if you need to get back; if you don't need to get back it doesn't
count.' MEASURED: the trip said 'and back' after a one-way time ('The patrol: 26 blocks round 2 posts, about 2 hours, and back.').
NOW a job paid in the client's town (find, hunt, recover, patrol) is there and back: the map's own road home from the last place it
sends him (cityRoute, cityStepMins), added to the way out; a job that ends where it happens (a crew, a camp, a caravan or a delivery
to the far town) is only there. His words: 'about 4 hours there and back' / 'about 7 hours, paid there' on the offer, '4 H TO X, THERE
AND BACK' / 'PAID THERE' on the phone, '45 batteries · 4 H ROUND TRIP' on the board's row; the danger reads the road on the whole trip.
FOUND on the walk: the road's own moments (the encounter director's events) sometimes eat minutes even when no fight comes (a step of
26 minutes where the cell costs 5); that is the road's luck, not its length, and the card says the length.

## 5. PROOF (the live demo; rebased on main 10/26)
- gates/the_job_tells_the_truth_gate.js, 200 jobs (the Lone Wolf on day one, a new crew of three, six at level 3 by day 20, twelve at
  level 6 by day 50, 50 each off the valley's boards), each read in the page and played 100 more times in node with fresh dice:
  PHONE 7/0: one star 31 jobs worth 96 in 100 (the worst 91), two stars 49 jobs 83, three stars 120 jobs 24 (nobody down at all: 96,
  79, 17); the blood ranks with what happened (rank 0.95); twelve meet cards through the one door, every count and kind dealt id for
  id; the read follows the crew (7 of 10). COMPUTER 7/0: one star 33 jobs 97 (worst 91), two 45 jobs 82, three 122 jobs 25, rank 0.95.
  Those runs used the draft cut-offs; the same 200 phone reads re-starred at TUNING's 0.95 / 0.50: one star 17 jobs worth 98 (worst 93),
  two 80 jobs 81, three 103 jobs 17 (best 68); single jobs off their line 10 at the draft, 1 at TUNING's.
- gates/the_roster_counts_who_can_fight_gate.js computer 6/0, phone 6/0 (R1-R3 line 79, D1-D2 line 114).
- gates/a_jobs_time_counts_the_way_back_gate.js computer 6/0 (100 jobs, 72 back and 28 paid there, worst gap 0.00 min; a walk out and
  home on the clock, 118 shown, 118 walked).
- gates/the_trip_before_the_yes_gate.js 7/0, every_job_kind 37/0, meet_before_you_fight 8/0 (its card regex reads the kinds),
  demo_build 25/0. My lane's eight gates registered in gates/bohemia_gates.py (seven were orphans); the suite's floor and pages publish's
  two reds are red on main the same.

## 6. NOTES LEFT
UI (the blood belongs in the kit: the clay is rendered beside it, slices/job_blood; the red star option in their file), TUNING (the
cut-offs adopted, theirs; the blood's two ends; a big company reads three stars often (twelve at level six: 37 of 50), because with twelve
men somebody usually goes down: the AUTO button's own count; their proposed reading, nobody dead and at most one in six laid up, is the
coordinator's call), COMBAT (three marked lines in the fight; the band is dealt whole), COMBAT TWO (the
calculator reads the fight's own rules, so their AUTO brain moves the stars), RUN (four marked lines in its files), RUN TWO (the two
board hooks and S.done), EYES (what to look for).
