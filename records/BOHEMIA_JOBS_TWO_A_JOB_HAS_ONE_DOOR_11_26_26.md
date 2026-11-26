# JOBS 2 -- A JOB HAS ONE DOOR (BUILD 11/26t - A JOB HAS ONE DOOR), 11/26/26

Ask row 698 (FOUND BY PLUMBER 8 11/22, EVERY CHANGE AT SIXTY C2), owner JOBS. VAMILY rule 482 (no lane stops at done). Rules 425, 255,
335, 441.

## THE FIND
'THE BOARD DEALS A JOB TO A DIFFERENT TOWN DEPENDING ON WHEN ITS DANGER READ COMES IN. The same valley, the same day, the same rules,
the same 21 jobs; the new way (a new crew's plans made over frames, its reads coming in over 90 s) put qd-s04 at Caravans, qd-s03 at
the Mob and jk-meat-vultures at the Network, the old way (every plan at once) put jk-meat-vultures at Caravans, qd-s04 at the Mob and
qd-s03 at the Network.' The ask: the place a job is dealt to depends on the valley and the day only, never on how fast a phone read its
danger.

## MEASURED
slices/bohemia_board_shelf.js dealt() drafted the valley's jobs across its places in rounds and asked the day's floor
(BohemiaJobDanger.fits, rule 255) of every job as it drafted. The floor answers null while a job's read is still coming (posted,
'reading') and false once its read is under the floor. So:
1. a job the floor kept from one place went on to the NEXT place in the draft, and which place that was depended on which reads were in;
2. what a place posted while its jobs were still reading was written to MEMO (__A_POSTED_JOB_STAYS_POSTED__) and kept first on every
   later deal, so the boards after the reads were in still carried the order the reads had come in.
Reproduced in Node on the real shelf (the job file's board people in it, 102 jobs), twelve places, day 4, the danger reader played by a
stand-in whose read of a job at a place is fixed and lands when told: the boards asked after every read, the reads landing one at a
time, shuffled two ways and all at once. On main's deal (c373aa657) the boards once every read was in were NOT the same: Boulder posted
jk-biggame-sabre, jb-collect-rent, qd-s17 one way and jk-biggame-sabre, jb-collect-rent, jb-escort-clinic another.

## BUILT (__A_JOB_HAS_ONE_DOOR__)
- THE DRAFT, from the valley and the day only (the places, their tiers, traits and bars, his name, what he holds and has done, the
  window, the rare roll, which is the valley's own dice): never a read. In rounds every place drafts its board's count, then four more
  of its own; a job is in one place's list and no other's. MEMO keeps these lists, so nothing posted while reading is remembered.
- THE POSTING, on every ask, from the reads as they stand: (1) each place posts from its own list what the floor lets through; (2) a
  place the floor left short then takes, the floor asked, work no place posts (rule 255: 'a job under the floor is not posted: the place
  posts its next'); (3) a place with nothing posts the least dangerous of what was kept back (rule 335, the original last pass, so its
  mutation still bites).
- slices/bohemia_job_danger.js exports its rare roll (rare: rareUp) so the draft asks only the valley's dice, never a read.

## MEASURED NOW
- A JOB HAS ONE DOOR (new, gates/a_job_has_one_door_gate.js): O1 the boards the same all four ways (12 places, 21 jobs posted); O2 no
  job at two doors; O3 no board empty, nothing under the floor beside another; O1p main's deal planted: differs (Boulder above). 4/0.
- THE BOARDS ALWAYS HAVE WORK (PLUMBER 3, rule 335): the deal's W1 to W6 6 of 6 (W6, the floor still stands, went red on a first cut
  that posted only a place's own list, a red job where a safe one stood unposted elsewhere: that cut is why the posting has step 2).
  With its phone legs (a new game, a typed code, an old save, every place raided): 24 of 24.
- THE TOWN'S BOOK files 10/0; THE NIGHT, THE TURN AND THE BID files 7/0.
- EVERY CHANGE AT SIXTY (PLUMBER 8's, the real proof on his phone, the demo both ways, a new crew's reads over 90 s against every read
  at once): 7 of 7, and C2, red since 11/22 for this row, GREEN: 21 asks now, 21 the old way, the same place and job once the
  reads are in (C1 133 ms, C3 every job read in 72 s, C5 133 ms).
- THE BOARD'S QUESTS ARE PEOPLE 16/1: its red ('THE PHONE lists exactly what each place's board offers that day', COPPER SH qd-ap07,
  THE WASH qd-s17 and jk-find-out-stew, THE FORT qd-ap02, jk-biggame-sloth, jk-biggame-lion) is the same on main without this build,
  word for word: not this build's; named here for the board's owner (RUN TWO).

[bb Battle Brothers posts a contract at one settlement; another town's board never shows it, whatever you knew when you looked]
[analog horror: the same notice on the same nail, whichever night you walk past it]
