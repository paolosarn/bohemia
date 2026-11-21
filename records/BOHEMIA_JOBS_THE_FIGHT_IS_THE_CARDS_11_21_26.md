# JOBS: THE FIGHT IS THE ONE THE CARD SAID, 11/21/26 (VAMILY rules 461, 441, 454(a), 465; the handoff's [a job that changes after the yes])

THE ASK: the coordinator's routine 'JOBS: do less, show the clout' ('ship, then your handoff's next job'); the handoff's next since
Build K: '[a job that changes after the yes] ... qd-ap01's guards 2 then 4 (water people read, brigands met), qd-s01's camp met 7
coyotes where the card says water people.' No line a person speaks is new or rewritten; no number moved.

## 1. MEASURED FIRST
Build K's walk (tools/bohemia_jobs_the_card_reads_the_night_on_the_phone.js --hour 990: every job with a sure fight, its card read in
its town at 16:30, taken, the clock moved on by the card's own minutes, the game's own roll read off the hand-over) left four fights,
three jobs, where the crowd that came was not the card's. Read fight by fight (the card at the yes, the card at the hand-over, the roll's
inputs), each was one cause:
- THE CAMP AT THE DAM (qd-s01, the alpha, both ways): the camp stands at Hoover Dam, a spot on no district. The card read the camp's
  own spot (no district: the road's own crowd, 4 water people at night); the fight handed over no district of the card's place (the
  hand-over sent 'rollDistrict' only when it had one), so the roll fell back to where he stands, the suburb road beside the dam: 7
  coyotes.
- THEY MOVED IT (qd-ap01, the alpha sideways): the recover job's twist 'they moved it' carries the thing two to four blocks on. The
  card read the guards at the pump station (2 water people); the thing moved onto the freeway and the fight rolled the freeway's
  crowd: 4 brigand thugs. The ones holding it are the ones who carried it.
- THE SALCEDOS AT THE FARM (qd-ar10, the demo sideways; a 'find' job): the card read the ones holding them at the middle of the search
  ring (3 house men); the fight puts them at the farm itself (holdBy at the job's spot), up to three blocks away, the district beside
  it: 4 kids.
- THE PATROL'S BANDS (jk-patrol-dam, found while this round's gates ran; the walk never brought a patrol to its bands): a probe on the
  demo upright (the job taken, each post walked, the walk stepped on till the band was on the road, each band walked to) read the card
  at two bands of 3 asked (2 kids each) and met each band asked 4: 2 ancient bison, then a feral bull. The card splits the contract
  between the bands it had (shareOf(jm, bands) each); the band was sized after the post had counted one band down (shareOf(n, bands
  left): one left, the whole contract). And the fight read its crowd where the band stood on the road, not at the post the card read
  it at. The one-band patrol (jk-patrol-wash) matched.
- The spot a job picks is not the same upright and sideways (the pump station [15,91] upright, [15,89] sideways): a job's place is
  picked on the glass he can see (spotOut's glass, WORLD's), so the two shapes deal two places. By design; not changed.

## 2. THE BUILD
HOW BATTLE BROTHERS DOES IT: a contract names who it is against before it is signed, and that is who comes; a twist ('they moved
camp') changes where, not who.
OURS:
- slices/bohemia_job_kinds.js fight(): the card's place is read even when it has no district: the hand-over carries 'no district'
  (null) for the roll, never nothing (undefined, which fell back to the road beside it). A fight whose crowd is from somewhere else
  ('ground') reads that ground.
- slices/bohemia_job_danger.js (WORLD's reader, two marked lines): the hand-over's roll honours a 'no district' it is handed
  (msg.rollDistrict !== undefined); fightsFor reads a fight's crowd off its ground when it has one.
- __THE_ONES_WHO_MOVED_IT__ (bohemia_job_kinds.js): when they move it, the job keeps where they took it from (job.ground); the card
  of a held job reads the fight where it comes (the moved spot, the trip's own tracks leg, which the held job's time already
  counted) and the crowd from the ground they took it from. The board's card before the yes does not spoil the twist (it reads the
  first spot; the stars say the twist's chance as before).
- The find jobs (find-person's guards, find-place's ambush): the card reads the ones holding it at the place itself (ground: the
  job's spot), where holdBy puts them, not the ring's middle.
- The patrol (bohemia_job_kinds.js): the bands the contract had are kept (job.bandsOf) and every band is that share; a band due after
  a post comes off that post's ground (job.bandPost, the band's ground), and the card of a held patrol lists the band due as well.
- slices/BOHEMIA_CITY_WORLD.html (RUN's map, the marked line of Build K): the map's own crew job with a mark on no district hands over
  none, as its card reads it.

## 3. PROOF
GATE: THE CARD READS THE NIGHT, new R6 (the files, the patrol's among them) and R5 tightened (no misses: the crowd is the card's on
every fight; the patrols' bands walked).
BEFORE (Build K's gate runs, the old reader, the demo and the alpha, upright and sideways, 30 jobs each, 31 fights each):
  demo up 31 of 31 the card's; demo side 30 (not qd-ar10); alpha up 30 (not qd-s01); alpha side 29 (not qd-ap01, qd-s01).
AFTER (the same walk, the same 30 jobs): 31 of 31 on all four phones, every fight at the card's hour, 7 or 8 after nightfall.
  qd-s01 card 4 water people, came 4 water people; qd-ap01 sideways card 2 water people, came 2 water people (the move walked, the
  held card's minute 113 with the tracks' leg, the fight at 18:08 at night); qd-ar10 sideways card 4 kids, came 4 kids.
  THE PATROL (the probe, the demo upright): before, card two bands of 2 kids (3 asked each), met 2 ancient bison then a feral bull
  (4 asked each); after, met 2 kids and 2 kids (3 asked each). The walk (tools/bohemia_jobs_the_card_reads_the_night_on_the_phone.js)
  now steps on after a patrol's post till its band is on the road and walks to it, so R5 reads the patrols' bands too.
  And the map's own crew job (qd-s10), whose arrival is the map's (loopArrived), not the job file's: the walk now arrives the map's
  way, so every job is walked to its fight (before, three never were).
THE VOTE PICTURE (records/target/JOBS_THE_FIGHT_IS_THE_CARDS.jpg): the demo upright, a new crew, the camp at the dam read in
Anarchists at 16:05 ('the camp: 8 block watch'), taken, the clock run on by the card's own 419 minutes, the real arrival at 22:59 and
the real fight's board: a watch captain and 7 neighbours, the 8 the card named, at night.
RESULT: THE CARD READS THE NIGHT 6/0 (R1, R4, R6 files; R2 the night, 4 phones, five night jobs each the card's; R5 the hour, 4 phones:
32 of 32 fights at the card's hour, 7 or 8 after nightfall, the crowd the card's 32 of 32 on each; R3 nothing threw). That run's walk
reached the crew job but stepped past a patrol's band (it jumped to the next post, a town, where no band comes); the walk learned to
stay on the post's road, and the same hour walk run again on the four phones: every job walked to its fight, 37 fights on each phone,
37 of 37 the crowd of the card he reads on the board, 35 of 35 at the held card's hour (8 after nightfall). Also run: EVERY FIGHT WON
COUNTS files 2/0 (C1 follows the hand-over's line), A NAME FADES 2/0, A HUNT FITS THE CREW 3/0, THE NEW KINDS 6/0, THE NIGHT, THE TURN
AND THE BID 7/0, THE TOWN'S BOOK 10/0 (files), DEMO BUILD, PAGES PUBLISH, HANDOFF green. The full suite was started and stopped: here it
runs every phone walk one at a time for hours, and the container lacks two image libraries eight art gates need.

## 4. FOUND, NOT CHANGED
- The board's card of a 'they moved it' job reads the first spot's minute (the twist is a surprise); the held card reads the move.
  Measured: qd-ap01's board card said the fight comes in 102 minutes (17:57, day), the held card 161 (18:56, night); the crowd was the
  same both ways here (the water people's ground by day and by night). A twist that turns the hour can change who walks; Battle
  Brothers' twists change a contract after it is signed too.
- A camp for a new crew of three on day two is 8 of the Block Watch (the camp's size, 'bigger than a crew', MAKE clear-camp): the card
  says so and the stars read it; the camp's size is TUNING's.

[bb Battle Brothers names who a contract is against before it is signed; when the brigands move camp, they are the same brigands]
[analog horror: the tracks went on two blocks into the freeway, and the same two people were waiting at the end of them]
