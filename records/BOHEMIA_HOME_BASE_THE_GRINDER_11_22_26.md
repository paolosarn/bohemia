# HOME BASE 3, 11/22/26: THE GRINDER (BUILD 11/22zm; VAMILY rule 469, his 'C' and 'Ppl dont eat the brain tho'; rules 456, 460, 455, 466(c), 441; ask row 638) AND THE CAMERAS, STEPS 2 TO 4 (rule 466(a), ask row 663)

His answer to rule 456(c)'s one question (11/21): **'C'** (his own crew grinds the human dead at his place too, and he can sell it) and
**'Ppl dont eat the brain tho'**. The coordinator's real check, the same reply: the shakes are real (kuru), carried in the brain and the
spinal cord; muscle carries little to none; so the cost stays, rare and with a cause, and it shows late.

## WHAT HE PLAYS (simple, rule 466(c)'s lesson: one building, one tap, nothing explained)
- **THE GRINDER** is his fourth building of his own at his place, beside the forge: on the BUILD desk, `GRINDER  1 BATTERY 3 TAPE  NOTHING
  GOES TO WASTE`; it goes up tonight and stands tomorrow, on a lot of the middle row, in the security footage as its own piece (a block
  smokehouse with a stovepipe, a butcher's table with a hand-crank grinder clamped at its end, a rail of hanging links, a 40-pound bag of
  pool salt, a lidded drum; working: a shape under a grey tarp on the table, the links on the rail, the stove lit and smoke from the pipe;
  nothing under the tarp is ever shown, rule 455). A man of his stands at it.
- **THE DEAD COME HOME**: with the grinder standing, a fight he wins brings its people home, as many as his company carries. A kill he
  takes on the map still gives the company what it eats before it turns (WORLD 12's, untouched); the rest of its meat comes home too.
- **ONE TAP**: tap the grinder, its sheet has one line in a mouth, `Head comes off first. Every fucking time.`, and one button,
  `GRIND  1 BODY → 26 FOOD`. Tap it: the food in the top bar goes up by that much, the button reads `NOBODY TO GRIND`, the line
  `Ground. +26 food in the stores.`
- **HIS PEOPLE EAT IT**: the sausage is FOOD, the one count the night eats first (rule 209). **ANY TOWN BUYS IT** at the stall's food line,
  as food. Nothing on the stall changed.

## WHAT RUNS UNDER IT, NEVER SAID (engine/bohemia_grinder.js; every number records/target/bb/home_base.json grinder, with its source)
| rule | number | source |
|---|---|---|
| THE CARRY: a body on a litter over a long walk | 0.34 bodies a man (3 men bring 1, 6 bring 2, 12 bring 4); the rest are left | US Army FM 4-25.11 (four bearers taking turns; a drag takes three) |
| a body | 62 kg | US adult mean ~80 kg (CDC NHANES), a famine takes a quarter (Keys 1950) |
| boneless meat the hand strips | 0.27 of the body | a hunter's boneless yield ~27% of a deer's live weight (Penn State Extension); ceiling 24 of 66 kg muscle (Cole 2017) |
| cured, smoked | 0.8 of the meat | USDA FSIS, smoked sausage loses 10 to 20% |
| a night of food | 0.5 kg | read from records/target/bb/carcass.json (one number for meat in this game) |
| ONE BODY | 26 food (62 x 0.27 x 0.8 / 0.5) | a crew of six brings two: about four days' food for six, ~52 batteries at the counter's 2, against a routine contract's 30 |
| THE HEAT: the dead keep on the road | 24 game hours, then thrown out, quietly | USDA danger zone; the hot-weather hunter's same-day rule; rule 460 |
| THE HEAD COMES OFF FIRST | always (head_out) | his words; said once, in the grinder's line |
| THE BAD CUT (spine split, cord or brain in the batch) | 3 in 100 batches with people in them | ours, draft; the BSE-era bans on spinal cord in separated meat |
| A CARELESS CAN bought at a stall | 1 in 100 food purchases | ours, draft: 'a batch bought from someone who does not care' |
| a man's night out of a bad batch gives him the shakes | 10 in 100 | ours, draft; Alpers 2008, Collinge 2006 (the brain and cord carry it; muscle little to none) |
| it shows | 4.5 to 50 years, mean 12 (drawn per man) | Collinge 2006, Alpers 2008. Acts are 35 years apart, so it shows in a LATER ACT: the family meets what the father ground |
| it kills | 1 year after the first tremor | Alpers 2008 |
| never HIM | the main character never dies (the third votes) | |
| A TOWN FINDS OUT IT WAS PEOPLE | 15 in 100 sales with people in them; his name there takes 'minor offensive action' (-10) | the Battle Brothers Relations ladder; legal nowhere, done everywhere: the Leningrad siege markets (Bidlack and Lomagin 2012) |
| A HUNGRY TOWN never asks | its stall short of food: no roll | the famine record |
| A TOWN HE SOLD A BAD BATCH TO | finds out when its own people shake, a later act, once: 'offensive action' (-20) | through JOBS' own settle queue |

A man who carries it and later lives at his place (a man who leaves the company goes to live there) shakes in his place's story when it
shows: `{name} got the shakes. Everybody knows which batch.` (draft). COMBAT and CHARACTER can read the marks (BohemiaHomeMap.grinderState()
.marks, .shown) when they want a man's hand to shake on the dial; that is theirs, not built here.

Rule 460 holds: the smokehouse and the salt are in the picture; sausage in the stores is cured and smoked, and keeps like any food.

## THE CAMERAS (rule 466(a), HOME BASE 2's steps 2 to 4)
- **STEP 2, THE SKEWED BOARD'S CODE IS OUT**: about 245 lines of the town screen (the lens, its tape and wrong clock, the CAM switch and
  readout, the chalked lots and the hammer's plate, the taps mapped through the lens, the camera turning on a tap, their CSS) moved to
  graveyard/home_base_the_skewed_board_11_17_26/screen_the_skewed_board.js.txt (post-mortem written by HOME BASE 2:
  graveyard/POSTMORTEM_HOME_BASE_THE_SKEWED_BOARD_11_21_26.txt). What stays: the door under the finger, his men at his buildings on the
  footage. Nothing in any gate or tool read what went (measured: no reader of the lens, __HOME_LOT_AT, BohemiaSettlement.lens). Gate F1
  still holds it dead (no lens, no switch on his place).
- **STEP 3, THE CAMERAS' SOUND**: the 11/3 page he said YES to played crashbox/feed_b.mp3 (the starred night feed's hum, loop, volume 0.25,
  after a tap). SOUNDS owns the mix, so it is ASKED, not wired: ask row 720 names the file, the volume, and where the feed says it is on
  (window.__HOME_FEED.on in his place's town screen).
- **STEP 4, THE OVERFLOW** (BUILD 11/22zt, a21c89ea6): a piece whose row is full now stands on a free lot of a row behind it, with
  its own picture for that lot (the pipeline's `piece <id> --behind-only`, merged by post_add; each row behind stands higher and allows taller,
  never a row in front). Every piece takes its own row first, the leftovers after, so the overflow never takes a back lot from a back piece.
  The desk greys a build only when its row and every row behind that has its picture are full. RENDERED: the seven middle pieces (grinder,
  forge, shed, pump, garden bed, water tank, solar panel) on the four back lots; and (BUILD 11/22zy, fe3a7fa6c) the front five (wall,
  stall, yard, main, purifier) on the middle and back lots: every piece he can build or be given now has a picture on every row it fits. Gate F7: nine more middle buildings, four in the middle, the
  rest on the back with their own pictures; planted: the pictures behind taken off, none drawn. Upright 136/0, sideways 133/0; with the front five, upright 136/0, sideways 133/0.

## SEEN ON THE GLASS (the demo, real taps, BUILD 11/22zm)
Upright (390 x 844) and sideways (844 x 390): a new game, day 2, planted, the grinder and the forge put up, the next day a fight won with
five people dead brought one home (three men carry one), his place opened: the grinder on lot 5 of the footage (89 px wide upright, 79
sideways), a real tap opened its sheet, a real tap on GRIND: food 12 -> 38. tools/bohemia_home_base_the_grinder_card_11_22_26.js,
pictures records/target/home_base/the_grinder_*.webp, the card records/target/home_base/vote_the_grinder.webp.
Gate YOUR PLACE, PLANTED: engine 47/0 (G0 to G9 new: the carry, the heat, one tap, the brain out, the bad cut, the sale, the late shakes,
the stores, three planted); demo legs D22 (built from the desk by a real tap, standing, seen on its row, the dead home, GRIND by a real tap,
a sale found out moves the town's bar -10, the stall's own SELL NOW as a real click). Upright 134/0, sideways 131/0, upright 134/0 again on main 39306f8ac merged (WORLD 15's fog in the map).

## DECIDED HERE (his to correct, one word)
- His own men who die are NOT ground (only the enemy dead of a fight he wins): he did not say, and it is the heaviest thing to decide
  silently; it is one line in grindFightHome if he wants it.
- The town finding out costs -10 (the ladder's minor offence), not a fight or a ban: it is done everywhere.
- The shakes never touch HIM.
