# WORLD [the PC playtest: the jobs' part] -- A PLACE YOU CAN FIND, A JOB YOU CAN DROP, AN ENEMY THAT SCALES (10/25/26, rule 164 items 3, 8, 26)

Paolo 10/24, playing on his PC (records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md):
- item 3: 'take three carts to Prim, and it's really just the blue settlement.'
- item 8: 'it's not clear how to cut a quest off... let's say I don't wanna do it anymore.'
- item 26: 'Battle Brothers matches you with opponents by the amount of people on your roster... if I fill up my roster, the
  opponents go up too.'

Plus the two EYES round 2 rows on this board (rule 150): [eyes: paid before it lands], [eyes: a place that is nothing].

## 1. MEASURED FIRST

- ITEM 26. The map's party math (RUN's __A_FEW_NOT_TWELVE__, 10/5) already carried Battle Brothers' numbers from the library
  (GROK_111; bb_all/0828_Game Mechanics.txt:105-111: a contract scales with the ROSTER, the 12 strongest at 10 + 2 a level
  past 1, gear not counted; roaming parties only 'slightly'; a camp already on the map not at all). It read
  LOOP.start.company, the ORIGIN's three men, and nothing else. Measured in the demo: nine men hired at the hall by a finger
  on HIRE changed no party by one.
- ITEM 3. The board's words name places (Primm, the dam, the lodge on the mountain, the fossil beds, the pass, the pump
  station, the nursery on Rainbow...) and the job went wherever the dice put it: the escort to the nearest town in range (his
  'blue settlement' was the Blues), its plate 'ESCORT TO HERE'. The client's town was named on the map only when he stood
  next to it or zoomed in close. Primm is a real place on the region map (WORLD's own land, engine/BOHEMIA_REGION_LAND.json,
  34 places), 148 blocks from the Church.
- ITEM 8. No way to drop a held job anywhere. The towns already keep a standing bar each (RUN TWO's [the opinion moves],
  FACTIONS' engine/bohemia_relations.js, bohemia.relations.v1) with Battle Brothers' contract rows, and the map never told
  them how a job ended, so no job ever moved a bar.
- FOUND ON THE WAY, a bug under item 3: the region (every place past the valley, the roads out) turned on only if
  bohemia_region.js had wrapped vbLand before the land's painting came back from its worker; on this box the painting won
  three runs in five and BOH_REGION.ready stayed false for the whole sitting (no PRIMM, no HOOVER DAM, no road out).
- FOUND ON THE WAY: a board job taken at a town out in the region (PRIMM, RAILROAD PASS) did nothing at all: the map looked
  for the job's block inside the valley's 96 x 96 grid only.

## 2. WHAT IS BUILT

### (3) THE ROSTER SCALES THE ENEMY
BohemiaJobKinds.roster() (slices/bohemia_job_kinds.js) is every man he has, the way the fight's door finds them (the alpha's
__WHO_YOU_HIRE_FIGHTS__): the crew screen's line (bohemia.company.v1), its bench (Battle Brothers counts the wounded and the
reserve too), the men it knows and keeps off the line, every hire it has not seen yet; less the dead (bohemia.fight.after.v1)
and the walked. One hook in RUN's partyRosterStrength (__THE_ROSTER_SCALES_THE_ENEMY__). The math itself is unchanged: a job
scales hard with the roster, a roaming party a little, as the wiki says.

### (1) EVERY PLACE A JOB NAMES IS NAMED AND MARKED
- records/target/BOHEMIA_JOB_KINDS.json: 31 rows carry 'place', the place their words name. {name, real}: a real one
  (PRIMM, HOOVER DAM twice, RAILROAD PASS, MT CHARLESTON LODGE, TULE SPRINGS for 'the fossil beds'), and the job GOES THERE;
  {name}: a made one ('THE PUMP STATION', 'THE NURSERY ON RAINBOW'), a block the dice pick carrying that name; 'way': the
  words' own direction ('the south road' is south). No place: the words name none, the job's place is the client's town.
- The take line says the place, which way and how far: 'walk three carts under tarps to PRIMM, south-west, about 148 blocks.'
- On the map: every place a held job names is named (the client's town and where it goes, at every zoom: hooks in the town
  plates and in the region's places, __A_JOB_NAMES_ITS_PLACE__); the NEXT place wears the lit ring on its ground; a made
  place's name sits on its ground; off the glass, its name waits at the glass's edge on the line from the middle of the glass,
  with a small point aimed at it, the act first ('ESCORT TO PRIMM', 'GET PAID · CHURCH'). A tap walks there. No flag, no road
  line (rule 164 item 10).
- A real place not on the map yet (the region still arriving): the job waits for it ('PRIMM is out past the valley; the map
  shows it in a moment.') and is made there when it comes; never a made place wearing a real name.
- Fixed: __THE_REGION_NEVER_MISSES_THE_LAND__ (bohemia_region.js re-asks the land once, quietly, if it came first);
  __A_JOB_FROM_A_TOWN_OUT_THERE__ (loopTarget counts the region's blocks when the region is on).

### (2) DROP A JOB, BATTLE BROTHERS' WAY
- The library: 'You can manually cancel contracts by clicking the X button on the contract scroll' (bb_all/0626_Developer
  Posts.txt); Relations: cancelling -10, failing a civilian contract -20, done +10, poorly done +5 (bb_all/1670_Relations.txt);
  Renown: cancelling -100, worse than failing's -75 (bb_all/1679_Renown.txt). Bohemia has no renown (three currencies, none
  of them renown), so the standing is the whole cost.
- BohemiaJobKinds.dropCost(id): { place, act, delta -10, before, after, band, bandAfter }, for the button to show before the
  tap. BohemiaJobKinds.drop(id): the job is gone, nobody pays, refused in the middle of its own fight; the line: 'Dropped:
  Bring back the light regulator. Nobody pays, and CHURCH thinks less of you: 50 to 40, neutral.'
- Every way a job ends now moves the client town's bar (done +10, part +5, dropped -10, failed -20), so dropping is never
  worse than failing. The acts wait in bohemia.job.settled.v1 and the next town the map opens takes them (open({settled}),
  one hook in loopPostOpen; the crew job's end too, __A_DROPPED_JOB_COSTS_STANDING__).
- THE BUTTON IS UI's (UI [the PC playtest: the UI's part] (5), 'UI is open and draws the button'). NOTE on UI's board with the
  two calls. Until it is drawn, the rule is in the game and nothing on the phone reaches it.

### THE EYES ROWS
- [eyes: paid before it lands]: UI's voice said the client's '+45, like we said' on any won fight carrying a job's id, so an
  escort's road fight 'paid' while the carts still walked. A job of a kind is not paid by a road fight: its own end dispatches
  'bohemia-job-paid' {job, paid, of} and the client says it then, once, with the number that lands; a part says WORDS' new
  draft line client_pay_part ('{pay} batteries, for what got here. Gracias.').
- [eyes: a place that is nothing]: a click on a region place's NAME (or building) walked to the ground under the finger
  (SLOAN's name: block 50,96, six blocks off Sloan), so nothing opened on arrival. The 34 places answer a tap the way a valley
  town does now (MAP_TOWN_HIT: the building, then the name): the click goes to the gate and the screen opens. Their names are
  drawn after every building, a job's places first, and the names' overlap test was off by ten (two 13-pixel names could
  overlap by 10: PRIMM under IVANPAH SOLAR); it is exact now.

## 3. PROVED IN THE DEMO (gates/the_jobs_part_gate.js, his computer's screen 1440 x 900; real clicks where a finger can)

- R roster 8/0: 3 men, strength 30; nine hired at the hall by a click on HIRE; 12 men, strength 120: a two-skull job 3 -> 10
  (MANY), three skulls 3 -> 13, a roaming party 2 -> 3; a crew job walked to: 8 in the fight against his 12 (on the rebased
  tree, COMBAT's road factions dressed the same 8 as kids x0.6 = 5, their design).
- N names 9/0: the Primm carts go to PRIMM at 99,199 (the real place), the take line says 'south-west, about 148 blocks', the
  name waits at the glass's edge ('ESCORT TO PRIMM'), a click on it sets out, PRIMM comes on the glass lit and ringed, the
  carts ARRIVE IN PRIMM and pay 135 of 135 (two road fights, ended by the gate); THE PUMP STATION named where it is; every
  real place a row names is on this map. A pump-station job taken AT PRIMM plays (the region-town fix).
- D drop 7/0: the cost shown before (Church 50 to 40), dropped, the line says it, its marks off the map, not back on the
  phone, the cost waits, the town's bar is 40 when the town opens, refused in its own fight, a done job +10.
- P pay 3/0 (EYES' own step: the salt camp, a road fight, on): nothing said mid-job; '45 batteries, like we said' when the 45
  lands.
- E place 3/0: at the far stop a click on SLOAN's name goes to Sloan and its screen opens; PRIMM's name clear of IVANPAH
  SOLAR's.
- gates/every_job_kind_gate.js (last round's) 37/0 after this round's changes (E7 re-aimed: a made place is where he stands,
  no town to open).
- Static gates that read the touched files (55): the same 11 red as a clean main worktree, plus reachability's census, a
  file-time check (green on a fresh checkout).

## 4. WHAT I COULD NOT DO, SAID

- The DROP button on the phone and on the job card is UI's row (5); the phone today shows the two best-paid open jobs and no
  held job. The rule is in; the button is owed by UI.
- COMBAT's road factions dress a party as a tougher faction that fields fewer (kids 0.6, heavies 0.45): a full roster's 8 can
  meet 5. That is COMBAT's design, kept; the count handed over grows with the roster every time.
- A land label (FRENCHMAN MOUNTAIN, BLACK MOUNTAINS) is a name on the land, not a place; a click there still walks to the
  ground under it. EYES' list of 'about 40' names was the region's places, all of which now open.
