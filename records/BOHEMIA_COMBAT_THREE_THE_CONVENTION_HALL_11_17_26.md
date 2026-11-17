# COMBAT THREE: THE CONVENTION HALL (11/17/26) -- BUILD 11/17c - THE CONVENTION HALL

The coordinator's round under VAMILY rule 453 (his words 11/17: 'do a full sweep, let's have some fun'), job 1: 'the next big interior
from the researched list (ask row 468's record) as a fight place, house-sized tiles, each tile its cost and effect, its ceiling at
10% (COOK FIVE makes the art; agree names in your handoffs)'. Rule 454(a) kept: no line of dialogue rewritten; the only words added
are the tiles' own lines, the fewest, marked draft.

## WHICH INSIDE, AND WHY
The research (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md) lists eleven after the first three (the casino floor, the flood
tunnels, the parking garage, all built). The fourth is THE CONVENTION CENTER'S HALLS: 'the biggest roof in the valley; in the
collapse a shelter for thousands (the real floor: New Orleans' Superdome and Convention Center after Katrina, 2005). The people's
fight, the crowd as the board.'

## WHAT IT IS
A fight the map hands from the convention center (the one map kind with halls; six cells on the demo's valley) is fought, for its
share (0.7 of what the parking garage leaves: about four in ten), in ONE CORNER OF ONE HALL turned into a shelter:
- THE SHOW FLOOR: bare aisles (OPEN FLOOR: on AUTO nobody stays on it) between FIELDS OF COTS (low cover), RELIEF PALLETS and
  SANDBAG CHECKPOINTS (cover), rows of folding CHAIRS (slow going, 3 AP a step, and low cover), CROWD BARRIERS and the registration
  DESK (low cover), shipping CONTAINERS off the docks and the hall's COLUMNS (nobody stands on them);
- THE MEZZANINE over the concourse along the north wall: HIGH GROUND (rule 428: a blow or a shot down lands easier, a gun reaches a
  tile more); the STAIRS at its ends are the walk up, over its rail is the fight's climb (rule 328); THEY HOLD IT at the bell;
- THE FOLDING WALL ('the_split_hall'): the air wall left half shut down the middle of the room, a door gap in it and the south third
  open: push through the gap or go round; 'the_long_hall' is the room whole, its columns on their grid, the stores behind a broken
  line of containers;
- THE DARK: under the roof it is night by day and by night; by day the light comes in the rolled-up DOCK DOORS on the south wall (a
  man there is seen); drum fires burn day and night;
- ITS CEILING at 10% (rule 451(a)): the roof trusses, the catwalks, the last show's banners (a kind the fight draws: 'truss').
Every tile kind has its cost and its effect in one table (17 kinds) and says its line when tapped.

## HOW IT IS BUILT: AN INSIDE IS DATA NOW
slices/bohemia_big_inside.js lays any inside from its data file; slices/fight_ground/insides.json lists them ('hall' today);
slices/fight_ground/hall/hall.json is the hall (two layouts of 15 strings of 20 characters, the legend, the tiles' table, the kit, the
lights, the ceiling). The mall, the warehouse, the data fort are each one data file and its art from here: no new module.
The fight side (slices/BOHEMIA_FIGHT.html, __A_BIG_INSIDE_FROM_ITS_DATA__): bigInside(opts) in the board chain after the casino
floor; opts.inside '<id>' asks for one anywhere, false never; never on a cell a place's own board stands on.

## THE PICTURES ARE STAND-INS, AND THE NAMES ARE AGREED
Every piece of the hall is drawn AS a finished piece of another kit (the data's 'like'): cots as the tunnels' camps, pallets and
containers and sandbags as the street board's dressing, chairs and the desk as the casino's, the walls, columns, mezzanine, stairs and
rails as the garage's, the floor as the garage's bare slab. 4,422 of 4,422 pieces laid in the gate are stand-ins. It reads as a big dim
hall with a shelter in it; it does not yet look like its own place. COOK FIVE's kit replaces them with no code: the file and the
names are in handoffs/COMBAT_THREE.md (hall_art.json, the garage's format; hall/hall_ceiling.webp).

## THE GATE: THE BIG INSIDES (gates/the_big_insides_gate.js, registered) 15/0, held for every inside on the list
I1 at the convention center 16 of 40 fights go into the hall (the same cell the same answer), none where it has no district, asked in
4/4 and out 4/4, never on a place's own cell. I2 24 of 24 boards joined, both lines with a walk, both layouts dealt and mirrored;
planted (a wall across the floor). I3 the stairs the only walk up, the mezzanine the fight's roof at level 1; planted. I4 dark but for
the docks by day and the drums. I5 22 kinds of piece, every one with its picture on disk and its size. I6 24 of 24 fights on AUTO
ended (6.7 rounds a fight), no man of his stood a whole fight. I7 17 kinds of tile each with its row; the fight charged the table's AP
on 894 tiles; 886 of 886 lines said; 528 of 528 open tiles the fight's open street; two plants. I8 BOTH SIDES USE ROOFS AND COVER (rule
428): after the first round 18% of the men stand on the bare aisles (43% with the rule off); on cover or high ground 124 of his 144
and 79 of their 105; 44% of the band starts up on the mezzanine, 88 men on it after the first round; planted. I9 its ceiling at 0.1.

## ON THE PAGE (rule 441: this build's stamp; the map's own hand-over at the convention center's cells; AUTO to the end)
- the alpha upright: 4 fights (2 in the hall, 1 in the garage, 1 on the street); the alpha on its side: 4 (2 in the hall);
- the demo upright: 3 (1 in the hall); the demo on its side: 2 (1 in the hall); before the stamp the demo upright 6 (3 in the hall);
- every hall with its ceiling on the glass (a pixel moves 1.5 of 255 on average, 99 in 100 move 12 or less); all ended; 14 of 14 tile
  taps said their line; 0 page errors.

## NOT DONE, SAID PLAINLY
- The art: stand-ins, all of it (above).
- Six convention cells on a valley make this a rare fight. Which other big roofs shelter people (the stadium, the terminal) is one
  word in the data file's districts; left for the insides that are theirs.
- 'The crowd as the board' is cots and pallets today; no people on the cots. People on a board are a CHARACTER and PEOPLE job.

[bb Battle Brothers fights only outdoors; an inside is our own swag (rule 416). What it teaches here is its camp fights: palisades and tents as cover, a gate as the chokepoint; the folding wall is that gate]
[analog horror: four hundred cots in rows under a banner for a trade show that was never taken down]
