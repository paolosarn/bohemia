RUN SEVEN (chat 01g, the thing you play; opened 11/6 by the coordinator for one URGENT round, session_01GKDyuvcamz4yzWiSEekyc4). Files
this round: one marked block and marked lines in slices/BOHEMIA_CITY_WORLD.html (__EVERYONE_IN_THE_FIGHT_HOLDS__), marked lines in
slices/bohemia_job_kinds.js and slices/bohemia_road_events.js, the alpha's #buildstamp, the demo cut, gates/everyone_in_the_fight_holds_gate.js
(new, in the suite). Record: records/BOHEMIA_RUN7_EVERYONE_IN_THE_FIGHT_HOLDS_11_7_26.md.

11/7 LATEST -- BUILD 11/7c EVERYONE IN THE FIGHT HOLDS, BUILT, NOT YET SEEN (rule 413(h)-(k), rule 381; ask line 476):
THE BUG (Paolo 11/6, on 11/6n): 'I retreated from this battle and the enemies are still on my ass... they're all on my ass, to the point I
can't even enter a settlement'; his clue: 'this red number... it's underneath me as I walk, even throughout the whole city'.
REPRODUCED on the demo with real taps: a caravan job's raiders, ENGAGE, RETREAT: RAIDERS · 5 stood ON HIS BLOCK every step of the walk to
Mob (distance 0, their red plate under his marker) and the town never opened.
THE CAUSE: (1) a retreat never ends a job's fight, so the band the job sent (raiders, thieves, a patrol crew) stays and closes a block on
every block of his (closeIn), onto his block; RUN SIX's hold matched only its CARD, so it never asked and never stopped coming; (2) arriving
at a town asks the held jobs first and a band within a block 'is a fight' (raidFight || true): the hold refused it and the town stayed
shut; (3) only the one crew or pack that opened the fight was held (the job's other packs, the hunters, the next ambush kept coming);
(4) the hunters' red plate stayed up counting the blocks to him as he walked off; (5) the map's plate layout steps any plate that
would cover his crew to just under his feet, so an enemy's count near him (the glued raiders, or a crew a few blocks off at the far zoom)
was drawn UNDER HIM: his clue word for word; (6) the half-day hold was read on a clock that jumps a day ahead at 22:00, so it ended at
nightfall (or ran 23 hours, WORLD 11's measure).
THE FIX: every retreat (the card's FALL BACK, the lineup's RETREAT, the run for the edge) holds EVERYONE in or near the fight: every band a
held job has on the map, every pack within 8 blocks of the fight or of him, the hunters wherever they stand: each holds its field half a
game day, never a step toward him, never a fight with him on its own, then back to its business (a band leaves the job, a pack roams and
never smells him again); the same half day draws nothing new (no hunters, no job ambush, no pack's scent, no road card, no street crew; any pack keeps two
blocks off and never starts a fight from its own step); a
walk into a town is aimed at nobody and the town opens even when a held crew stands at its door; no band ever steps onto his block or a
town's ground; a held band wears the calm plate, held hunters have no always-up red plate; an enemy's count is never stepped under his feet; the
holds read the day loop's own minute (forward only). The save carries the quiet half day.
413(c) (the beast packs) is RUN SEVEN's now, built ON WORLD 11's __A_PACK_HE_RAN_FROM_LETS_HIM_GO__ (2c860bc3, pushed mid-round and
rebased onto): a pack he got away from stands its field the half day and still gives ground if he walks past; the carcass gate's P legs are
RUN SEVEN's (P2c re-aimed: beside the pack on a side with room to give ground).
GATE: EVERYONE IN THE FIGHT HOLDS (new, in the suite): the whole gate 54/1 on the phone before the last rebase (the 1 the gate's yardstick,
fixed); on the merged tree --quick every after leg green on the phone and the computer (24/1 each, the 1 THE BEFORE's own measure, fixed: 4/0
on both). Kept: A RETREAT GETS HIM AWAY 14/0, A TOWN
IS ALWAYS A DOOR 7/0, THE TOWN SHOWS 10/0, THE CARCASS AND THE VULTURES 23/0, DEMO BUILD 25/0. ROUTED (red on main's files too, not mine):
PAID ONLY FOR THE WORK 7/3 (A4, G4: ENGAGE after the card again never opens the fight; C1 cascades), WORLD's.

DECISIONS WRITTEN DOWN (no questions asked):
- 'Near the fight' for a pack is 8 blocks (twice a pack's smell of 4) from the fight or from him; every band of every held job is in it
  wherever it stands (a band on the map is a band coming at him). RETREAT_NEAR, TUNING's to move.
- After the half day a NEW crew on the same job (the caravan's second ambush) is a new crew: it can come; the one he ran from is gone.
- The quiet half day also silences road cards (faces with choices), so the walk he makes to get away is never stopped by a card.
- A street crew never reaches the map on its own (its crews are drawn on the walk's surface); the gate sends one through the street's door.

WHAT IS NEXT: nothing open in this lane's brief. If he still feels chased after this, read the hunters (the only party not tied to a job)
and the far packs' random roam first.
[bb Battle Brothers: the party you fled stays on the world map doing its own business; it never follows you into a town, and a town is
always a place you can enter.]
[analog horror: the crew you ran from is still standing where the fight was, small on the map, a calm plate over them, not moving.]
