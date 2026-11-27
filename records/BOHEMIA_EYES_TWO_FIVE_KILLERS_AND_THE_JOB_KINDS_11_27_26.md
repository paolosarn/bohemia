# EYES 2, 11/27/26: FIVE KILLERS, THE JOB KINDS, THE SLOWED PHONE (rules 493(d), 494(a), 492, 480; main 9f1b4b65a, then ab9089272 for the lairs and the slowed walk)

Paolo 11/27: 'I have five combat people [that] were absolute killers and there's no more challenges, nothing else to do.'
Paolo 11/27: 'I haven't seen one caravan quest... go from one city to another.'
The routine 'EYES: play a company like his'. Data: records/eyes_five_killers_11_27/ (every number below is in a file there).

## THE COMPANY LIKE HIS (how it was made, never by hand)
tools/bohemia_eyes_five_killers.js: the first five of the crew list (YOU, DESI, RAUL, TITO, BOOKIE: three melee, two guns), each made by
the crew screen's own code (engine/bohemia_roster.js manOf), climbed by its own grant() to level 8, 11 or 14, every level's rolls
RAISED on his kind's plan (the recruit-ceiling plan: melee or gun), every perk point on a killer's pick in the tier order the screen
allows (colossus, nine lives, steel brow, brawny, the mastery for his weapon, underdog, battle forged, killing frenzy, indomitable,
berserk; the gun build bullseye, quick hands, footwork, head hunter), in TUNING's 'late' kit (reinforced mail, bascinet, winged mace,
two-handed hammer, qatal dagger, heavy crossbow, heater shield). Level 11: YOU melee 85, 89 HP; DESI ranged 73; RAUL melee 72, 102 HP.
Company strength (slices/bohemia_job_kinds.js strength(), kit counted): L8 141, L11 171, L14 201.

## 493(d): WHAT IS LEFT TO DO, AND THE ODDS OF THE HARDEST THING

### ON THE PAGE HE PLAYS (the demo, 390x844, a new game through the door, then his company swapped for the five)
tools/bohemia_eyes_five_killers_on_the_page.js: in the map's own frame, every place's board as the shelf deals it, each job read for HIS
crew by the danger reader (the fight's own AUTO, 32 runs a job, the crew the fight's door would hand over).

    company / day / CLOUT          places  jobs  1 / 2 / 3 skulls   red (under 0.8)   worst read   the sweat job
    five L8, day 40, CLOUT 0         13     21   16 / 4 / 1            0               clean 100    never posted
    five L11, day 60, CLOUT 0        13     22   16 / 5 / 1            0               clean 100    never posted
    five L11, day 60, CLOUT 1,500    13     27   13 / 7 / 7            0               clean 100    never posted
    five L11, day 63, CLOUT 1,500    13     27   11 / 9 / 7            0               clean 100    never posted

RED (rule 493(d)): THE HARDEST JOB ON ANY BOARD IS AN EASY WIN. 97 jobs read, every one a clean win (about 3,100 AUTO fights on the
page). JOBS 2's 'one job to sweat for' (__ONE_JOB_TO_SWEAT_FOR__) can never fire for this company: it posts a red only when a place's own
list holds one, and nothing on the shelf reads red for five killers. The top pay on any board is 249.

### THE BIGGEST JOB THE MAP CAN DEAL THEM (headless, the fight's own rules and brain both sides, seeded, n 16)
The map's own job math (party_math.json job_bb: Battle Brothers' contract multiplier on the strength, dressed for the day that strength
stands at), brigands (the human forces) and beasts:

    five L8  (str 141, dressed day 42):  1 skull 5 men won 100 | 2: 8 won 100 | 3: 10 won 94 | the job's most, 13 at day 100: won 13
    five L11 (str 171, dressed day 53):  1 skull 6 men won 100 | 2: 9 won 100 | 3: 12 won 100 | 13 at day 100: won 63
    five L14 (str 201, dressed day 62):  1 skull 7 men won 100 | 2: 10 won 81 | 3: 13 won 56  | 13 at day 100: won 56
    beasts, every level, every size, 13 at day 100 included: won 100 in 100

So the math sizes five killers like nine middling men (L11's 171 against nine of level 5 in mail at 162 to 189), and their three-skull
job (12 at day 53, the middle tier) is won 100 in 100 with a quarter of a man struck down. Only the late tier (day 60 and up) bites, and
it is dealt to them only past level 13. A beast job never threatens them.

### THE HARD PLACES (BOSSES BUILD 11/27zu, seen headless: his band as the map hands it, the boss made the fight's own way)
'Whether five killers at their best win it is EYES' measure' (the BOSSES record). Won in 100, AUTO both sides:

    lair (boss n)       L8 (n 8)   L11 (n 12)   L14 (n 8)   men stood   hoard
    THE PLATE (10)         88         75           88          11        300
    THE TOOTH (11)          0         42           38          11        330
    THE LENS (12)          63        100          100          11        360
    THE BARBER (13)         0         17           38          11        390
    THE INK (14)           38         42           50          11        420
    THE DOGS (15)          38         67          100          12        450
    THE WARD (16)          13         75           50          12        480
    THE CISTERN (17)       88        100           88          11        510
    THE SMITH (18)          0          0            0          11        540

GREEN for the hardest thing on the map: the lairs are real danger for five killers (seven of nine lost at least a quarter of the time at
L11). THREE FINDS FOR BOSSES: THE LENS and THE CISTERN are easy wins at L11 and L14 (100 and 88 to 100, half a man down); the ladder does
not climb (THE BARBER, the 13th, is harder than every lair after it but THE SMITH); THE SMITH is never won by five, at any level.
Not measured: by hand (he may do better than AUTO), the lair's own board, CHAMPIONS on the road (not built: BESTIARY 3's research only).

### WHAT IS LEFT TO DO ON THE MAP FOR HIM
Bosses 1 to 9 and the nine lairs (found by a sign, each after the one before). The boards: nothing that costs him a man. Champions, named
gear and a man who joins: not built yet (BOSSES' record names ARMORY and HIRES).

## 494(a): WHICH JOB KINDS HIS BOARDS OFFER

    a new crew (the origin's three, CLOUT 0), each board window, read before it is counted (tools/..._on_the_page.js EYES_DAYS):
    day 1: 24 jobs, caravan 6 | day 4: 21, caravan 7 | day 7: 20, caravan 5 | day 10: 21, caravan 6 | day 13: 21, caravan 5
    every window from day 1 to 88 as the shelf deals it (EYES_SWEEP): CLOUT 0: 640 jobs; CLOUT 1,500: 810 jobs

    built kind (BUILT)    the pool holds   dealt days 1-88, CLOUT 0   dealt, CLOUT 1,500
    haul-caravan               13               191 (30%)                207
    find-place                  4                58                       58
    find-person                 5                38                       49
    recover-return             11                58                       35
    carry                       4                30                        2
    hunt-kind                   5                 0                        5
    clear-camp                  6                 0                        4
    hold-defend                 8                 0                        6
    patrol                      2                 0                        0

RED (rule 494(a)): FOUR BUILT KINDS NEVER REACH A BOARD in his first hours (hunt, camp, hold, patrol: 0 of 640 jobs over 30 windows);
with a big name they come 15 times in 810; PATROL NEVER COMES AT ALL. 17 of the pool's 31 kinds are never dealt with no name (ambush,
envoy, bounty, scout, burn, big game, signal, free, lair, investigate, follow, farm among them). What holds them back is not measured
here: the kinds are in the pool at every tier; the deal's filters are the town's trust (relations.json max_skulls by band), the name
(job_clout.json: a fortress's 2 skulls at 250, 3 at 1050; a town's and a camp's 3 at 250) and the day's floor (rule 255).
THE CARAVAN IS OFFERED, A LOT: 5 to 7 jobs in every window from day 1 (30 in 100 of everything dealt). The board calls it ESCORT, never
'caravan'; the phone's two best-paid jobs (where he may take most of his work) were not measured, and a caravan pays 38 of most boards'
84 to 249. So 'I haven't seen one' is not 'none is dealt'. WORLD 16's BUILD 11/27zs (THE CARAVAN DRIVES): NOT SEEN on the glass this round.

## 492: YOUR PLACE AS A STRANGER
NOT WALKED, measured first (rule 12): HOME BASE 5's fixes have not landed. Its stranger's walk (0766832ea, twelve unclear moments) is the
last word; its plan A to H went to a fresh HOME BASE (0c074b700). Walk it the round the first fix lands.

## THE SLOWED PHONE (rule 480): every build to 11/27zu in one walk
tools/bohemia_frame_walk.js --no-alpha --stop 'the spoils > map' (PLUMBER 8's walk, 390x844, CPU 4x), main ab9089272: 28 steps walked,
none missed, 0 page errors. Against the frame walk gate's own lines (gates/never_choppy_the_frame_walk_gate.js KNOWN): ALL 28 INSIDE,
none past. Rule 480 itself: 0 of 28 (this box draws in software). What travels to his phone (frames with the page's own code in them):
the boot 70, the worst 3.3 s; the map dragged 61 (a 580 ms task in the top page), the pinch out 94; the spoils > map worst 1,244 ms
(row 725's LEAVE, still about 1.2 s); a job read 447 ms; the map standing 57.5 fps (row 731's map, inside the bar now). The map
travelling 2.1 to 2.7 fps is drawing only (no page task).
IN AND OUT THE IPHONE'S WAY (foreground, alone): 8 passed, 0 failed (row 778 FIXED: its plant now bites); canvases 218 of the iPhone's
256 MB, every live picture 509 of 768 MB.
NOT WALKED: sideways, the boss fight, his place, the save and reload (the walk was stopped at the spoils to fit ten minutes).

## FILED
783 (JOBS 2, BESTIARY 3): five killers, nothing on any board is hard. 784 (JOBS 2): four built kinds never dealt. 785 (BOSSES): the lairs'
ladder. Marked: 774 (EYES' (d) measured), 775 and 776 the 494 pair (EYES' (a) measured), 778 FIXED.

[bb Battle Brothers sizes a contract to the twelve strongest men; five maxed men read like nine green ones, which is why its late game
leans on the crisis and the legendary places, not the contracts]
[analog horror: a board of work that never costs you anything is its own kind of wrong]
