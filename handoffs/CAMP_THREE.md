CAMP THREE (chat 24c, the camp; opened by the coordinator for one round, rule 411's third wave): 11/6 LATEST -- RULE 406 THE CAMP IS
PITCHED ON THE FIGHT BOARD, SHIPPED (this ship's commit), BUILT, NOT YET SEEN (rule 179), BUILD 11/6m - THE CAMP ON THE BOARD. Ask line 449.
Record: records/BOHEMIA_CAMP_THREE_THE_CAMP_ON_THE_BOARD_11_6_26.md.

WHAT MAKING CAMP LOOKS LIKE NOW (the demo: LEAVE the start town, step off its doorstep, HEAL on the phone):
- The camp screen opens dark (the moments-between fade), and about 2 s later the ground is the FIGHT BOARD OF THE BLOCK HE STANDS ON,
  the very board a fight there deals (the fight's own dealer, the shell's own door, the camp's die = the block's), with CAMP TWO's camp
  on its tiles: one house tile to three men, two side by side to eight, a 2 by 2 past that, never more than four connected (rule
  406(h), amended this round; the pickup two at least). The pitch then plays on it.
  Upright or on its side, the same tiles. The hours, the healing, the doors, the acts, the compass, the ghosts, the turn: unchanged.
- The crew screen opened at camp sees the camp screen's own picture (UI 7's code), so the board.
- A crew that finds him at camp (while it stands, or five minutes after it broke if he has not moved): the fight deals the camp's board
  (byte for byte) and the camp stands on its square under his men, the fire burning; each piece 1.6 times its camp size there.
- In a town, or on its doorstep: the town's own screen, no board asked (rule 273, unchanged).
- RULE 406 AMENDED 11/6 (f)(g), ask line 469: win a fight, press MAKE CAMP on the end screen: the camp stands on that fight's own board
  (the fight's options and die handed over before its page goes; the same fingerprint), the dead drawn where they fell at the camp's
  size with a pool under each, the camp pitched on the tiles where most of them lie; by day his men with an easy job go through them
  (act 'loot'), never more than half the company. A crew that finds that camp fights him on that same board.

RETIRED (rule 405(a)): CAMP TWO's sand, slices/camp_two/plate*.webp, in graveyard/the_camp_sand_11_6_26/ (POSTMORTEM_THE_CAMP_SAND_11_6_26.txt);
kit.json's plate entries gone; tools/bohemia_camp2_cook_the_camp.py no longer writes them. DIRECTION's 11/2 wrongness tool
(tools/bohemia_direction_the_wrongness_11_2_26.py) read plate.webp and plate_tall*.webp as a twin; it is a finished round's tool, it
would need the graveyard path if run again.

FILES (406(f)(g) too: campFromFight and campBodies in the fight's block, campFromFightKeep in the shell's __THE_SPOILS__ door, one marked
call; BohemiaMapCamp.fromFight and CAMP.fight in the map; the loot act in the camp look): slices/bohemia_camp_board.js (new: the bake host, the square's picture, the hand-over to the fight); engine/bohemia_camp_life.js
(square, pitchOn, marked); slices/bohemia_camp_look.js (marked: the ground is the board, nothing drawn before it, the pitch waits; ready()
no longer waits on the kit, so the settlement's own camp pictures never stand in); slices/BOHEMIA_FIGHT.html (__THE_CAMP_ON_THE_BOARD__:
campBoardBake, campOnBoard; the boot line and one line in draw(); THE DEALER IS NOT TOUCHED); slices/BOHEMIA_CITY_WORLD.html
(__THE_CAMP_ON_THE_BOARD__: campDie, campBoardAsk, campFightAt, BohemiaMapCamp.boardAsk/pitched; one line in campMake, campBreak and
cityHandOver); slices/BOHEMIA_ALPHA_0_9.html (one marked line in nfOpts: d.camp -> o.camp; the stamp); gates/the_camp_is_pitched_on_the_board_gate.js
(new, registered); gates/the_camp_is_his_own_gate.js (K1 re-aimed at the board).

FOR RUN FIVE: THE MOMENTS BETWEEN's camp fade-in (btwCampIn) is NOT retired by this change; the camp screen still opens through it.
Its first frames show the last place's picture behind opacity 0 until the camp's OPEN lands (measured: the town's town_1.webp for a few
reads), then the dark wait, then the board.

HOOKS ASKED:
- COMBAT TWO (407(g), where a board's layout comes from): rebased on your b6f4215c THE BOARD IS THE CITY. The camp's hidden fight page is
  a child of the shell, like nfBuild's #fightFrame, so your streetHost (window.parent's #cityFrame) finds the map and lays the same board;
  if streetHost ever finds the map another way, the camp's page must still find it. The camp bakes your board with your bakeBoard, whole,
  and cuts its window out (no state of yours is touched). The camp asks with campBoardAsk (BOHEMIA_CITY_WORLD.html), a copy of what
  cityHandOver adds to choose a board (district from om.at, at, world, BohemiaWorldStateMap.handOver). When a new field of the hand-over
  starts choosing the board, add it to campBoardAsk too, or give one function both call (fightBoardAsk(x, y)); the gate's B1 compares the
  camp's board with a fight dealt in the shell by fingerprint (campBoardSig) and goes red the moment the two disagree. If a tent should be cover or block a step, the camp's pieces are FIGHT_OPTS.camp.pieces
  ({sprite, u, v} in board tiles, k the tiles a rig pixel).
- UI: on the map with no camp the crew screen still draws COOK FOUR's camp pictures (settlement_ground_packs camp_0/camp_1, 'on the map
  or in a fight'); BohemiaCampBoard can give it the board of his block if rule 369's 'where they are' should mean that there too.
- DIRECTION: the camp in the fight is drawn 1.6x its camp size (CAMP_FIGHT_GROW in the fight's block); the size against the fight's
  men is a look call. The camp's ground is your board baked whole at 237 px a tile (held under 12 M pixels for a phone), shown about
  4 times bigger at camp: chunky pixels close in; a bake of the camp's window alone at the art's 515 would need bakeBoard to take a
  window (COMBAT TWO's file).

GATES (each run alone, on the cut from this tree): see the commit message for the numbers.

NOT DONE, NEXT, IN ORDER: (1) 406(g)'s rest: his men leaning on the buildings next to the camp's tiles; the carcass haul (rule 392) as its
own act at a beast's body; the wreck as it lay (the camp re-deals the fight's board, so cover blown up in the fight comes back whole;
a hook for COMBAT TWO: the fight's boardDef.cover at the end, handed with the dead); the bodies in a fight at that camp later (it gets
the board, not the dead); (2) 406(h)'s three tiles (an L: the camp's layout must leave the missing corner empty); (3) the board's first bake costs the fight page's data download (about 1 s on a free line, up to 10 s measured while the
map fetched new blocks' pictures); a warm hidden fight page kept between camps would take it to the deal and bake alone (about 1 s).
[bb Battle Brothers: camping is the party's state on the world map, and a night attack on it is a battle on the ground where it stood;
ours is that ground from the first hour.]
[analog horror: the tile you sleep on is the tile they come for; the fire is still lit when the grid comes up.]
