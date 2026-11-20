# JOBS: A HUNT FITS THE CREW, 11/20/26 (row 574; VAMILY rules 461, 441, 454(a); the coordinator's routine 'JOBS: the whole enchilada')

THE ASK: rule 461, 'full sweep, whole enchilada, dont forget nothing': take the handoff's next job, bugs he can feel first. Row 574
(PLUMBER 8, found 11/10; BESTIARY PARTLY 11/11): 'A DAY-ONE HUNT CAN WIPE A NEW CREW ... ONE bison, longhorn, bear or sloth beats a crew
of 3 (2 to 5 in 10), so no size fixes it: TUNING (their act-one numbers) or WORLD/JOBS (a new crew never sent at one; Battle Brothers'
way)'. No line a person speaks is new or rewritten (rule 454(a)); no new words at all in this build.

## 1. MEASURED FIRST (main at 64ab8c777)
- The longhorn, the short-faced bear and the ground sloth are GIANTS (BOHEMIA_JOB_KINDS.json giants.kinds, WORLD 9's
  __THE_GIANTS_ARE_RARE__): never drawn for a pack, a hunt or a job's guards; each is one animal on a named big-game job (three skulls,
  which since 11/18 also wait for 250 or 1050 CLOUT, records/target/bb/job_clout.json).
- The ANCIENT BISON is not a giant: beasts_by_ground draws it for a hunt's pack on the open desert (2 of 19 parts) and the park (1 of 8).
- One of each pack beast against farmhands, day one (tools/bohemia_fight_headless.js, AUTO both sides, 10 seeds; scratch tool beasts.js):
  bison 2/10 at 3 men, 10/10 at 6, 10/10 at 9 and 12; packs of 2 to 4 bison (the fight's own count_scale makes them one or two): 2/10, 2/10,
  0/10 at 3 men; 10/10, 10/10, 8/10 at 6. Every other pack beast (bulls, lions, wolves, hyenas, dogs, coyotes, hogs, horses, stilts,
  llamas, teratorns, goats, shrub oxen) at 1 to 4 animals: 9 or 10 in 10 for 3 men.
- For a brand-new crew of three the day's floor (WORLD's rule 255, BohemiaJobDanger.fits) keeps every hunt off every board: over
  twenty-one windows (days 1 to 61, a fixed crew) no hunt was posted, and the boards dealt 29 different jobs in all, the same ones each
  window. The bison's danger reached a new crew through the jobs that DO get through (a hunt taken once the floor rises, a hunt the map
  hands by its door) and through every job whose 'beasts' foe is drawn from the ground (foeOf).

## 2. THE BUILD
HOW BATTLE BROTHERS DOES IT: a contract is sized to the company and an early company is never sent at an Unhold (BESTIARY's line,
records/BOHEMIA_BESTIARY_THE_FLOOR_TABLE_AND_THE_NEXT_TEN_11_11_26.md s3: 'Battle Brothers' answer is the door, not the count').
OURS: records/target/BOHEMIA_JOB_KINDS.json beast_looks.bison.min_men = 6 (with its measured why; TUNING's one table
beast_looks.bison.min_men); slices/bohemia_job_kinds.js __A_HUNT_FITS_THE_CREW__: beastFor (every pack a hunt draws, and every job whose
foe is 'beasts') leaves out a kind whose min_men is over the company (the map's own crewCount: the men he has, hired, walked, taken and
dead counted). A company of six or more meets bison as before. No count to read (a page without the map): nothing is held back.
The fight itself is not touched (no beast made weaker): the door, not the count.

## 3. PROOF
GATE: gates/the_hunt_fits_the_crew_gate.js, in the suite as A HUNT FITS THE CREW.
- H1 the files. H2 the draw lifted out of the job kinds and run on the real file, 3,000 packs on the bison's own grounds: bison at 3 men
  0, at 5 0, at 6 382, at 12 382; planted (the line taken away) at 3 men 382; every other beast still drawn at 3. H3 the fight again: one
  bison beats 3 farmhands (2/10 won), 6 win 10/10.
- H4 ON HIS PHONE (tools/bohemia_jobs_the_hunt_fits_the_crew_on_the_phone.js; the demo and the alpha, upright and sideways; a new crew,
  K7QM9X): every hunt on the shelf (5) taken at every town (13) by the map's own contract door (loopTakeContract, what a board's Take it
  posts to), its packs read: 65 hunts, 169 packs, no bison with his three men; with the company counted as six (the one shortcut, said:
  the map's crewCount answered 6) bison at Cartel; planted (the line out of the page's data) with three, bison again. Then Cartel's hunt
  (qd-ar03), the one that meets bison at six, taken with his three men and played to the end: packs of dire wolves, ice-age horses and
  coyotes, three fights (their foes read off the fight's own board), paid 176. Because the floor keeps every hunt off a new crew's
  boards, the hunt is taken through the map's door, not a board's finger (said).
RESULT: 5/0 (the demo and the alpha, upright and sideways). With his three men 0 bison in 754 packs over 260 hunts (each hunt taken six
ways, its id marked, so a rare beast cannot hide by chance); at six men 14 upright, 5 sideways; planted 14 and 5. Played: Caravans'
hunt (horses, a mountain lion, coyotes) paid 176; the Anarchists' (hyenas, horses) paid 299.
THE TEST LEARNED (said): the hunt reads its ground from the danger reader's data, which loads behind the page, so the survey waits for
it; a hunt's first pack prefers a spot on the glass, so upright and sideways deal different packs; a pack beside another town's door
is fought only once tapped (a pack he tapped is his chase), so the test taps the pack where the map draws it, and marks the chase the
way the tap would when the pack is off the glass; the city frame is read again after every fight.
ALSO THIS ROUND (rule 459, with ECONOMY TWO's own tool): relations.json haggle.step and the job kinds' pay shares (clear-camp flat and
per_head_share, patrol flat) are in records/target/bb/battery_table.json now (tools/bohemia_economy_two_write_the_table.py 'where',
seed, check); THE BATTERY IS REAL 43/0.

## 4. ROUTED, NOT DONE HERE
- BESTIARY / FACTIONS: THE NEW ENEMIES' leg SIZED TO THE CREW still fights every beast faction (the giants among them) against a crew of 3
  and 6; a giant met only later (three-skull big game behind CLOUT 250 or 1050, never a pack) or a bison met only by six (this build)
  is judged against a crew that never meets it. Row 574's own text names that leg for them.
- WORLD: the road's own beasts (road events, a party met on the map) are the road's; this build is the jobs' door.
- WORLD (observation): for a new crew the boards deal 29 jobs over twenty-one windows, the same ones each window, because the day's floor
  passes few; the boards change once the crew grows (a hire, a level) or a job is done, never on their own.

[bb Battle Brothers never sends a new company at an Unhold; the door, not the count]
[analog horror: the bison are still out on the desert; nobody sends three men for them]
