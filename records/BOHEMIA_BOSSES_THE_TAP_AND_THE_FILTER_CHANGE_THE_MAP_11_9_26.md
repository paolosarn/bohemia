# BOSSES, 11/9/26: THE TAP AND THE FILTER CHANGE THE MAP, EACH HIS OWN WAY (rule 440(b); ask lines 167, 522)

PAOLO 11/9: "More everything pls" (rule 440). The coordinator's line for this lane: the next two bosses of the ladder
(records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md rows 2 and 3), each found by its own sign, each handing its verb, each changing the map
ITS OWN WAY (not a copy of THE POT's), kept after a reload; never the map's generation (WORLD 13's), never the fight's boards (COMBAT
TWO's). The first boss: records/BOHEMIA_BOSSES_THE_FIRST_BOSS_CHANGES_THE_MAP_11_8_26.md.

THREE BOSSES, THREE WAYS THE MAP CHANGES (each read off his own ladder row and his own words, none a copy):

| | what he holds (the ladder) | WHILE HE STANDS, ON THE MAP | WHEN HE FALLS, ON THE MAP |
|---|---|---|---|
| THE POT | the last sound cookware | his line cooks SHUT the streets into his block (a wall: the walk goes round) | the carts at the kerb, the streets open, his till pays |
| THE TAP | the pressure, and who is allowed any | his watchers sit on HIS PIPE with crossbows: the walk is not refused, it COSTS (a bolt a block) | the pipe is a LINE OF TAPS: every block a main for his own verb, +6 each |
| THE FILTER | the last clean-water setup, the plant's robots | his MACHINES stand their posts round the tanks: walk up to one and it FIGHTS | every machine DROPS WHERE IT STANDS (his lesson): wrecks you strip for tape |

## MEASURED FIRST (origin/main d42868958, the demo on an upright phone)

What THE TAP's and THE FILTER's deaths changed before this round (their rows in records/target/bb/boss_map.json and boss_act_one.json):
THE TAP lit 2 blocks and handed the nearest home base to you (WORLD TWO's 'holds'); THE FILTER put a place called CLEAN WATER on the map.
Neither held anything on the map while he stood: nothing in the valley worked differently with them alive, so nothing could change when
they died. Their signs (a tag on a pipe, a radio on a pole), their askers (EL CHINO, DOC REYES), their fights and their verbs (TURN THE
WATER ON, CLEAN THE WATER) were already whole and gated (gates/bosses_act_one_gate.js, 108/1 at d901bce27).

## THE TAP: HIS PIPE

BUILD 11/9i THE TAP'S PIPE (1dfea7892). Code: slices/bohemia_bosses.js section (9); data: THE TAP's 'pipe' row in
records/target/bb/boss_act_one.json (a modder's row: length 7, bolt 6, the words); art: tools/bohemia_bosses_the_taps_pipe_11_9_26.py.
- HIS PIPE: the moment WORLD TWO stands him somewhere, a water main runs from his door 7 blocks along the map's own route toward the
  nearest town (worked out once, kept with the game). His rumour already said it: "His boys sit up on the pipes with crossbows, bro.
  Don't run at them in the open." Raul at the tag now says it too: "his watchers sit on the pipe with crossbows: don't walk under it."
- WHILE HE STANDS: the pipe is painted with one of his watchers crouched on it with a crossbow over the street, his red tag on the pipe,
  bolts in the road. THE WALK IS NOT REFUSED (that was THE POT's wall); IT COSTS: every new pipe block the crew steps onto, a bolt takes
  6 blood off one of his men in turn (never the last of it; a man no fight has seen yet is missed: A BOLT MISSES), the number rising
  off the crew (BOLT: -6 BLOOD), El Chino posting it the first time and the map's own line saying who was hit.
- WHEN HE FALLS: the kill's camera rolls the pipe over to taps on the same tape as his pump house; his watchers are gone; every pipe
  block is a water main for his own verb (TURN THE WATER ON with his wrench: once each, +6 batteries), painted with a standpipe, a brass
  tap running into a trough and two jugs; EL CHINO's card says it under the wrench: "HIS PIPE WATCHERS CAME DOWN. HIS PIPE TO CARAVANS
  IS 7 TAPS: TURN THE WATER ON AT EACH, +6 BATTERIES."; @la_vecina posts it beside the radio. WORLD TWO's own change for him stands (2
  blocks lit, the nearest home base handed to you).
- KEPT AFTER A RELOAD: the pipe, the taps, the ones opened; no bolt on it again.
THE GATE: THE TAP CHANGES THE MAP (gates/the_tap_changes_the_map_gate.js, registered), the stranger's game on an upright phone with THE
POT first (the ladder's order). Run 1: 16 passed, 1 failed, the red the gate's own count (it walked the pipe out and back, 12 bolts on 13
steps, against a cap of 7; fixed to two a block each way). In run 1: the tag at 49,58, his place 34,54; the pipe 33,54 to 27,54 toward
Caravans, all 7 walkable; 12 bolts of 6 shared by YOU, DESI and RAUL, the rise BOLT: -6 BLOOD, the post; his card first, his fight (the
checker ended it: AUTO lost); the beat with 7 pipe blocks on the tape; 0 bolts walking it after; all 7 mains, a real tap paid 6 (325 to
331), marked; painted with taps; the feed; the reopen held (still down, 6 more taps open to the verb, the opened one opened, 0 bolts);
planted P2p (no bolt), P3 (the pipe guarded again after the fall: all 7 not mains) and P4 (a forgotten save) each red. Run 2, on the committed tree (e21c58e26, before the rebase onto WORLD 14 and COMBAT TWO; the re-run on a9bcb9650, the tree with WORLD 14's places and COMBAT TWO's 11/9g fight: 17 passed, 0 failed; rebased onto HOME BASE's 11/9h as 1dfea7892, whose map change is its own home-base functions only): 17 passed, 0 failed (the tag at 49,8, his place 57,7, the pipe 58,7 to 59,12 toward Homeless and round a corner, 10 bolts of 6 on the walk out and back, his fight ended by the checker: AUTO lost; P3's plant left 3 pipe blocks that are mains anyway beside the water works and 4 not: red).
THE VOTE card's picture is the kill's own camera beat (tools/bohemia_bosses_vote_the_change_11_9_26.js "THE TAP"): records/target/bosses_vote_tap_11_9/.
Phone pictures (webp): records/target/the_tap_changes_the_map/ (0 he asks, 1 the tag read out, 2 under the pipe, 3 his card, 4 he says
what changed, 5 the pipe after, 6 opened again).
WEAK: the bolt is 6 a block, and walking the length of his pipe costs 42 blood across the crew (TUNING owns it); the pipe follows the
map's own route, so it can turn a corner, and its picture is a straight block each time.

## THE FILTER: HIS MACHINES

NEXT, this round, its own build: the plant's robots stand guard round his tanks and fight anybody who walks up; when he falls every one drops where it stands, the wrecks stay for the crew to strip for tape. This section is written when it ships.

## [bb] BATTLE BROTHERS FIRST

- A location's men hold the ground round it, and a location SENDS parties because it holds (the home bases file's note on dev blog #66:
  a camp buys its parties out of what it has and is weaker until they return). THE FILTER's machines are that: they exist because he
  keeps them walking, and they stop when he stops.
- Roads in Battle Brothers are safe or unsafe by who roams them, never by a toll a man takes for walking a street. THE TAP's pipe is
  our own way: a street that costs blood while a man sits over it with a crossbow, the danger read at a glance by look (rule 243(b)5).
- A big fight pays with what the place held (the legendary locations' named items, the camps' loot). THE TAP pays in taps along his
  pipe; THE FILTER in the wrecks' tape (Battle Brothers' tools: what mends armour).
- The finding that proves us wrong: in Battle Brothers a destroyed location vanishes and nothing it held is left on the map. Ours leave
  their mark where they stood (the pipe's taps, the wrecks), because the map is a city a person crosses, not a board of icons.

## ANALOG HORROR

THE TAP: one man sitting very still on a pipe over an empty street, a red tag that says who drinks; after, people's jugs under a
dripping tap. THE FILTER: a machine still standing its post with nobody left to tell it the plant died, one lamp eye blinking the colour
of bad water; after, a dead machine across a street and kids pulling wire out of it.
