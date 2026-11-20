# COMBAT FOUR: THE POWERHOUSE (BUILD 11/20j - THE POWERHOUSE)

11/20/26. COMBAT FOUR's first build, taking over COMBAT THREE's handoff (rule 462: COMBAT THREE's model hit its weekly limit; this lane was opened
fresh on the same handoff and the same job). Rule 461 THE WHOLE ENCHILADA: bugs he can feel first, then content. EYES marked rows 623 and 624 SEEN
on 11/20 with nothing found (records/BOHEMIA_EYES_THE_WHOLE_ENCHILADA_11_20_26.md), and no FOUND BY EYES row names this lane, so the job is
COMBAT THREE's next: the tenth big inside of row 468. COMBAT THREE's pushed branch (claude/combat-three-01gkdyuu, cf1cf0174) is wholly on main:
nothing to pick up. Rules 416, 59, 428, 451(a), 441, 454(a). Ask rows 468, 651.

## HIS WORDS
- 11/6 (row 468): "what are some large ass interiors that we could fight... I still want this to be a block and turf war."
- The list's line (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md): "THE DAM'S POWERHOUSE (Hoover): the generator hall, the galleries in the concrete."

## MEASURED BEFORE (main 86ea8c638, BUILD 11/18v)
A fight at the dam (the map's kind 'dam') was fought on the shore's blocks (lakebed, marina, pass); a fight at the gas plant ('powerplant') on the
works' blocks. Neither ever went inside.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/powerhouse/powerhouse.json`, the seventh in `slices/fight_ground/insides.json`, laid by `slices/bohemia_big_inside.js`:
no new rule code. The only code is the ceiling's painter (`ceilingSheet`, kind `crane`).
- WHERE: the dam's own cells, six in ten by the cell's dice (the gate: 32 of 40); the gas plant's turbine hall is the same kind of room, about a third
  of its fights (share_by_district 0.35; the gate: 19 of 40). The rest are fought outside as before.
- THE BOARD: 20 by 15 house tiles, one wing's length of the generator floor (a wing is about 198 m, about 16 tiles; Reclamation).
  `the_generator_floor`: four generators down the middle of the hall, a control board north and south of each, two lanes either side with crated spares,
  cable reels, tool carts, the crane's hook let down; the visitors' balcony along the north wall; the river doors in the south wall.
  `the_service_bay`: six generators in a line ACROSS the hall with their boards as the only gaps (the line is the fight: the gap is where it happens),
  a rotor on its stand in the bay (twice), a column, the doors at both ends, the balcony along the south wall crossing the line overhead.
- 17 KINDS OF TILE, EACH ITS COST AND ITS EFFECT (rule 59), each a Battle Brothers ground: the generator floor (flat, open ground), a generator and a
  rotor on its stand (blockers: its boulder), the crane's hook and crated spares (cover), a unit's board, tool carts, somebody's bedding (low cover),
  cable reels (low cover AND 3 AP: its brush), wet floor where the dam weeps (open AND 3 AP: its swamp), a column, a drum fire, the river doors (open,
  lit by day), the balcony and its benches (high ground: its hill; the benches low cover), the stairs.
- THE BALCONY IS NOBODY'S AT THE BELL (start null, the mall's way): both lines start on the floor; whoever takes the stairs first owns the floor under it.
- THE DARK: under a roof it is night; by day the river doors light their tiles, at night only the drum fires.
- ITS CEILING AT 10% (rule 451(a)): the hall's roof far up in panels, the crane runways along both long walls, two bridge cranes spanning the hall with
  their trolleys and hooks, the hanging lamps nearly all dead. The fight draws it until COOK's `powerhouse/powerhouse_ceiling.webp` is in.
- EVERY PICTURE IS A STAND-IN: 22 pieces drawn as finished pieces of other kits (the generator as the garage's core, a unit's board as the casino's dead
  screens, cable reels as tyres). Names for COOK in the handoff.
- RULE 454(a): no line of dialogue is rewritten; the tiles' tap lines are new, draft, the fewest words.
- WHAT THE WORLD DOES NOT SAY YET: whether the units still turn is not set (rule 459(e), who holds working power). The board is dark like every inside
  and its tile lines say nothing about power either way.

## THE GATE (gates/the_big_insides_gate.js: 108 passed, 0 failed over seven insides; the powerhouse 18 of them)
I1 51 of 80 fights at its districts go inside (dam 32 of 40, the gas plant 19 of 40). I2 the floor joined on 24 of 24 boards, all four dealt shapes seen.
I3 the stairs the walk and the rail a climb. I4 lit by day by its doors, at night by its fires only. I5 22 kinds of piece each with its picture and size,
all stand-ins. I6 24 of 24 fights ended on AUTO inside 30 rounds, nobody of 288 stood a whole fight. I7 17 kinds of tile each with its row; 902 of 902
tiles with a line said it. I8 (rule 428) after round one 26% of 250 men bare on the open floor against 52% with the rule off; on cover or high ground
111 of his 144 and 73 of their 106; nobody on the balcony at the bell, 32 up after round one. I9 its ceiling: crane at 0.1. I10 a road cell beside it
inside on 0 of 40. Six plants caught.
MY FIRST CUT, MEASURED AND CHANGED: I spread the cover to the board's edges and 35% of men stood bare after round one (the bound is 30%). Read off the
gate's own deal: the fight stands his line at columns 4 and 5 and theirs at column 11, so the edges were cover nobody reached. The cover moved into the
middle band: 26%. The balcony's end rail was never dealt (a one-row balcony has stairs at both ends), so that piece came out, the stadium's way.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:dam, C3_INSIDE=powerhouse: through the map's own door)
- the demo upright (390 x 844): 2 fights in the powerhouse (the service bay), both ended on AUTO; 7 of 7 tile taps (the floor, spares, cable, the hook);
  the ceiling: crane at 0.1, a pixel moves 1.26 of 255 on average, 9.7 or less on 99 pixels in 100.
- the demo on its side (844 x 390): 5 fights (both layouts), all ended; 2 of 2 taps.
- the alpha upright: 6 fights (both layouts), all ended; 3 of 3 taps.
- the alpha on its side: 5 fights, all ended; 4 of 4 taps; the ceiling 1.84 of 255 on average.
19 fights in the powerhouse, 19 ended, 18 of 18 taps (one of them, on the demo upright, run again on the tree merged with main: 2 of 2 taps), 0 page errors (and the shore's and the works' fights at the same cells, all ended).
THE DRIVER, TWO FIXES (tools/bohemia_combat_three_on_the_page.js): its tile taps came back empty on three of four ways. Measured with a probe: 16 tiles in
reach and on the glass, and every one skipped, because the fight was still drawing a move when the finger came. The finger now waits for the glass to
be clear and the move to finish before each tap. The tap count above is from after the fix.

## SAID PLAINLY
- THE GALLERIES IN THE CONCRETE ARE NOT ON THE BOARD: a real inspection gallery is a corridor a few metres wide. A fight tile is a house (rule 416: 'never
  a man in a hallway'), so a gallery on house tiles would be a hallway wider than a road. The generator hall is the board; the flood tunnels already fight
  the long concrete run.
- THE UNITS STAND FARTHER APART THAN THE REAL ONES (about one every 1.7 tiles in a real wing): every third tile here, so a man can pass between them.
- NO GAS PLANT FIGHT WENT INSIDE ON THE PAGE: the valleys these runs opened had two of its cells and the cell's dice sent both outside. The gate deals it
  (19 of 40).
- Only the dam's south valley cells were opened on the page; both layouts were dealt there.

## NEXT
The Sphere (the dead bowl under the biggest screen in the world), then the list's twelfth (the home center, the hospital, the prison's cell blocks).
