# RUN SEVEN (chat 01g): EVERYONE IN THE FIGHT HOLDS, AND THE TOWN IS ALWAYS A DOOR (rule 413(h)-(k), rule 381; ask line 476; 11/7/26)

PAOLO 11/6, on the live build that carries RUN SIX's 11/6n: 'I retreated from this battle and the enemies are still on my ass. I think
they're all on my ass, to the point I can't even enter a settlement. This is fucked.' His clue, relayed by the coordinator: 'as I walk
around, the enemy number that it shows, I think it's like 11, 12, 13, 14, how many enemies there are, it's this red number, and it's
underneath me as I walk, even throughout the whole city, I can't enter any settlements.'

## REPRODUCED ON THE REAL SURFACE FIRST (the demo, phone held up, tools/bohemia_drive_the_demo.js)

A caravan job (qd-s03) taken at the nearest town, walked; its raiders came; the meet card; ENGAGE (a real tap); RETREAT at the lineup;
home 'You pulled back'; then the walk to the nearest town (Mob, 5 blocks):

    at 17,45  RAIDERS · 5 at 17,45  distance 0   (their plate drawn 7 px right, 6 px down of his marker: under his feet)
    at 18,45  RAIDERS · 5 at 18,45  distance 0
    at 18,44  RAIDERS · 5 at 18,44  distance 0
    at 18,43  RAIDERS · 5 at 18,43  distance 0
    at 18,42  RAIDERS · 5 at 18,42  distance 0   the walk ended at Mob's edge; the town never opened; a second tap: nothing

That is his clue exactly: the red count of the party he fought (it is RAIDERS · 11 to 14 on a later company) rides under his own marker
wherever he walks, and no settlement opens.

## EVERY WAY IT FAILED (measured in the code and on the demo)

1. A RETREAT NEVER ENDS A JOB'S FIGHT, SO THE BAND STAYS AND KEEPS CLOSING. The map's job listener reads withdrew/retreated as 'the job is
   still yours' and returns before the job's own end runs, so the band the job sent (a caravan's RAIDERS, the THIEVES after the package,
   the CREW on the patrol road) stays on the map. On every block of his it closes one block (closeIn in slices/bohemia_job_kinds.js)
   and nothing stopped it stepping ONTO his block. RUN SIX's hold matched the contact's CARD (MEET_BACK by key), so the card never came,
   and the band never stopped coming: it rode under him across the map.
2. ARRIVING AT A TOWN ASKED THE HELD JOBS FIRST, AND A BAND WITHIN A BLOCK 'IS A FIGHT'. loopArrived -> BohemiaJobKinds.arrived ->
   ARRIVE['haul-caravan'] (and carry, patrol, the hunt's packs, a held band at the job's place, a job's leg in a town): 'raidFight(job) ||
   true'. The hold (or the town's own door, rule 381(b)) refused the fight, the arrival still answered 'a fight started', and the town
   stayed shut. That is the 'I can't enter any settlements'.
3. ONLY THE ONE THAT OPENED THE FIGHT WAS HELD. The job's other packs, the hunters out on the road, a crew he was chasing, and the job's
   next ambush kept coming (the 'they're ALL on my ass').
4. THE HUNTERS' RED PLATE STAYED UP, counting the blocks to him (11, 12, 13, 14 as he walked off), red, even while they held the field.
5. NOTHING STOPPED THE FIGHT FROM DRAWING SOMEBODY NEW at once: a forced road event spawns the next hunters, a job's ambush fires on its
   walked count, a far pack picks up his scent, a road card stops the walk.
6. THE COUNT UNDER HIS FEET, READ ON THE GLASS. The map's plate layout (__NOTHING_IS_DRAWN_OVER_THE_CREW__) steps any plate that would
   cover his crew to just BELOW HIS FEET. An enemy's count is one of those plates, so a crew within a few blocks (at the far zoom, a
   block is 6 px) had its RAIDERS / THIEVES / CREW count laid out under him, and when the crew rode on his block the count was under his
   feet on every step across the city: his clue word for word. Screenshot on the demo after the fix's first half: THIEVES · 4 held
   three blocks off, its plate drawn under his crew.
7. THE HOLD'S CLOCK JUMPED A DAY AT 22:00. day * 1440 + the clock's minute jumps a day ahead at 22:00 (__THE_NIGHT_IS_PLAYED__: a new day
   starts at 22:00 of the evening before) and comes back at midnight; RUN SIX's half day was read on it, so a hold set in the afternoon
   ended at the night's start (WORLD 11 measured the other face of it: a crew holding 23 game hours once). The holds now read the day
   loop's own minute (DAY.day * 1440 + DAY.min), which only goes forward.
8. A STREET CREW never reaches the map on its own (its crews are drawn on the walk's surface, HOST_DREW from hx,hy); the gate sends it
   through the street's own door (why 'crew') so its hold is measured the same way.
9. Checked and NOT broken: the hold's key does not change after a fight (a pack's key carries its id; the hunters are keyed by their id,
   a roaming party is only ever met by his own chase); the save carries MEET_BACK (RUN SIX) and every job's band with it.

## THE FIX (one marker, __EVERYONE_IN_THE_FIGHT_HOLDS__)

- slices/BOHEMIA_CITY_WORLD.html, retreatHoldAll(from, key), called from meetFallBack on every retreat (the card's FALL BACK, the
  lineup's RETREAT, the run for the edge): EVERY band a held job has on the map (raiders, thieves, a patrol crew, the ones holding the
  job's thing), EVERY pack within RETREAT_NEAR (8) blocks of the fight or of him, the hunters wherever they stand: each holds the field
  where it stands for half a game day (RETREAT_HOLD_MIN, RUN SIX's 720), never a step toward him, and none starts a fight with him on its
  own, ever (MEET_BACK away, each by its own key). His own chase ends with the retreat.
- (i) RETREAT_QUIET, the same half day: no hunters spawn (huntSpawn), no road card (bohemia_road_events.js step), no street crew, no
  road contact; in the jobs no ambush, thief or patrol crew comes, no pack smells him, and any pack (in the fight or not) keeps two
  blocks off and never starts a fight from its own step (it follows WORLD 11's PACK_LETS_GO switch). After the half day the road works
  again.
- (j) loopArrived: a walk that ends in a town is aimed at nobody (MEET_INTO_TOWN in meetBackHolds), and when a held job's fight was
  refused (window.__JOB_REFUSED, counted in the jobs' fight()) and nothing else came of it, the town opens. A fight or a card that really
  came still comes first. And no road card on a town's ground (rules 381, 273).
- slices/bohemia_job_kinds.js: a held band stands (closeIn), goes back to its own business after the half day (heldBand: it leaves the
  job, its hold forgotten so a NEW crew on the same job later is a new crew), wears the calm plate, not the red one; no band ever steps
  onto his block or onto a town's ground (381(c)); a held pack stands the half day, then roams, never smelling him again.
- The hunters' plate: HOLDING THE FIELD in words, and a crew holding its field has no always-up red plate (only when he taps them).
- An enemy's count is never stepped under his feet (mapPlatesDraw): it stays over the enemy, where they are (the job's plates carry foe).
- The holds read retreatNow(), the day loop's own minute (RUN SIX's hunters' hold too); RUN SIX's gate reads the same clock (re-aimed).
- 413(c), the beast packs, built on WORLD 11's __A_PACK_HE_RAN_FROM_LETS_HIM_GO__ (2c860bc3, rebased onto): a pack he got away from
  stands its field the half day (no wander) and still gives ground if he walks past; neither starts a fight from its own step; its hold
  follows PACK_LETS_GO.on, so WORLD 11's before still shows; their gate's P2c re-aimed (beside it on a side with room to give ground).
- The save: run.quiet carries the quiet half day; the bands' holds ride inside the held jobs; MEET_BACK as RUN SIX left it.
- window.__RETREAT_ALL_OFF is the mutation (the before). RUN SIX's __RETREAT_AWAY_OFF and MEET_BACK.steps 0 still give their befores.

The real floor, as RUN SIX wrote it: winners stop to plunder rather than chase (Edgehill, 1642). Battle Brothers: a retreat that gets off
the map ends that battle; the parties on the world map do not follow you into the next town.

## THE GATE: EVERYONE IN THE FIGHT HOLDS (gates/everyone_in_the_fight_holds_gate.js, in the suite)

Every contact kind (a job's raiders, the thieves, a crew on the patrol road, a beast pack on a hunt with the job's other pack near, a
job's crew, the hunters, a roaming party he chased, a street crew), with the hunters out on the road near the fight when it is not
theirs, both retreats (ENGAGE and RETREAT real taps where the glass takes them), then ten blocks walking away READING WHAT HE SEES
(every enemy with a count on the map and every enemy count drawn this frame, in blocks from his marker), then the walk into the nearest
settlement: no card, the town opens on its own arrival, nobody closes. Plus THE BEFORE, the quiet half day, two game days camped near
the raiders' field, and the save opened again on the same phone.

RESULTS (rule 13: the gates this change touches, by name):
- EVERYONE IN THE FIGHT HOLDS, the whole gate on the phone (8 kinds x 2 retreats, B, Q, F, S, C): 54 passed, 1 failed on the tree before
  the last rebase; the one red was the gate's own yardstick (a band 2 blocks off on a raised freeway, his marker gliding, read as 0.7 of
  a block drawn), fixed in the gate (drawn ON him = under half a block, or laid under his feet; within a block is read on the blocks).
- On the merged tree (over WORLD 11's 2c860bc3 and PLUMBER 6's ac7c3c78), --quick (raiders, beasts, hunters, both retreats, Q, F, S):
  phone 24 passed, 1 failed, computer 24 passed, 1 failed: every after leg green on both; the 1 was THE BEFORE's own measure (it had
  stopped counting unheld raiders' steps), fixed and re-run: THE BEFORE 4/0 on both. (A pack never in the fight roaming one step closer
  at 17 blocks is its own business, read by its block.)
- THE BEFORE (__RETREAT_ALL_OFF): the raiders step toward him 15 to 16 times in 10 blocks and the town stays shut (his bug).
- F: two game days camped three blocks from the raiders' field, 0 cards, they leave the job 12 to 13 game hours after; S: opened again,
  the raiders still hold, the quiet half day still runs; Q: no hunters, no ambush, no road card, then all three again after.
- Kept green: A RETREAT GETS HIM AWAY 14/0 (re-aimed onto the forward clock), A TOWN IS ALWAYS A DOOR 7/0, THE TOWN SHOWS 10/0, THE
  CARCASS AND THE VULTURES 23/0 (P2c re-aimed), DEMO BUILD 25/0, HANDOFF 10/0.
- RED ON MAIN, NOT MINE: PAID ONLY FOR THE WORK 7/3, the same 7/3 on main's files swapped in (A4 and G4: after FALL BACK and the card
  again, ENGAGE never opens the fight; C1 cascades, two jobs still held). WORLD's gate; routed in the handoff.
- Full suite unmeasured (rule 13).

[bb Battle Brothers: the party you fled from stays on the world map doing its own business; it does not follow you into a town, and a
town is always a place you can enter.]
[analog horror: the crew you ran from is still standing where the fight was, small on the map, a calm plate over them, not moving.]
