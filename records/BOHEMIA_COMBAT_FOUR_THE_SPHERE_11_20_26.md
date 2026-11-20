# COMBAT FOUR: THE SPHERE (BUILD 11/20k - THE SPHERE)

11/20/26. COMBAT FOUR's second build of the round (rule 461: keep going after each ship). The eleventh big inside: the list's tenth line. And
COOK SIX's ask of this lane from its stadium build (handoffs/COOK_FIVE.md, 11/20): the stadium's south stand faces away from the field. Rules 416,
59, 428, 451(a), 441, 454(a). Ask rows 468, 651.

## HIS WORDS
- 11/6 (row 468): "what are some large ass interiors that we could fight... I still want this to be a block and turf war."
- The list's line (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md): "THE SPHERE: the dead bowl under the biggest screen in the world."

## MEASURED BEFORE (main c68573a00, BUILD 11/20j)
A fight at the Sphere (the map's kind 'sphere') was the parking garage on four cells in ten and the plaza outside (the Strip's blocks) on the rest.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/sphere/sphere.json`, the eighth in `slices/fight_ground/insides.json`, laid by `slices/bohemia_big_inside.js`: no new
rule code. The only code is the ceiling's painter (`ceilingSheet`, kind `screen`).
- WHERE: the Sphere's own cells, 0.7 of what the garage leaves there, by the cell's dice (the gate: 16 of 40).
- THE BOARD: 20 by 15 house tiles, the whole bowl (the building is about 157 m across: about 13 tiles). `the_horseshoe`: the tiers along the back wall
  and down both sides, the stage across the front, the floor between with the sound desk in its pen, road cases, crowd barricade, fallen panels and
  speakers. `the_screen_came_down`: one row of tiers along the back, and a section of the screen down across the floor in a long diagonal (whole
  sections you cannot stand on, loose panels as cover along it).
- 16 KINDS OF TILE, EACH ITS COST AND ITS EFFECT (rule 59), each a Battle Brothers ground: the floor (open, and the bowl looks down on it), the stage
  and a section of the screen down (blockers: its boulder), fallen panels, a fallen speaker, road cases, the sound desk (cover), barricade, bedding
  (low cover), broken floor where the rigging came down (open AND 3 AP: its rough ground), a drum fire, the concourse doors (open, lit by day), the
  bowl's aisles and seats (high ground: its hill; the seats low cover), the stairs.
- THEY HOLD THE BOWL (start 'gallery', the stadium's way): a third of the band starts up in the tiers over their own side (the gate: 36 of 108);
  his line starts on the floor and the stairs are his way up.
- THE DARK: under a roof it is night; by day the concourse doors light their tiles, at night only the drum fires.
- ITS CEILING AT 10% (rule 451(a)): the screen from inside, dark: its panels in rows that curve over the bowl from the stage, panels out where the
  steel and the speakers' grilles show, a long tear where a section came down. NOTHING ON IT IS LIT: who holds working power is not set (rule
  459(e)). The fight draws it until COOK's `sphere/sphere_ceiling.webp` is in.
- EVERY PICTURE IS A STAND-IN: 20 pieces drawn as finished pieces of other kits (the stage as the casino's stage, fallen panels as its dead screens).
  Names for COOK in the handoff.
- RULE 454(a): no line of dialogue is rewritten; the tiles' tap lines are new, draft, the fewest words.

## ALSO IN THIS BUILD: THE STADIUM'S SOUTH STAND (COOK SIX's ask)
COOK SIX's stadium art (BUILD 11/20d) draws one seats picture on both stands, so the south stand's seats faced south, away from the field ('a
st_seats_n name would let me turn them'). Now the south stand's row is its own legend letter with the piece `st_seats_n` (stadium.json, both
layouts' row 13; the north stand is unchanged). A piece's 'like' may now name a piece of the SAME inside (`slices/bohemia_big_inside.js` kit):
until COOK paints `st_seats_n`, the south stand is drawn with COOK's own finished north seats, exactly as before; the day the picture is in,
it faces the field with no code. Gate THE BIG INSIDES' stadium 18/0 (168 of the stadium's pieces now count as stand-ins: the borrowed seats, said
so); THE INSIDES WEAR FINISHED ART 63/0.

## THE GATE (gates/the_big_insides_gate.js: 123 passed, 0 failed over eight insides; the Sphere 18 of them)
I1 16 of 40 fights at the Sphere go inside. I2 the floor joined on 24 of 24 boards, all four dealt shapes seen. I3 the stairs the walk and the rail a
climb. I4 lit by day by its doors, at night by its fires only. I5 20 kinds of piece each with its picture and size, all stand-ins. I6 24 of 24 fights
ended on AUTO inside 30 rounds (6.3 a fight), nobody of 288 stood a whole fight. I7 16 kinds of tile each with its row; 860 of 860 tiles with a line
said it. I8 (rule 428) after round one 23% of 246 men bare on the open floor against 41% with the rule off; on cover or high ground 104 of his 144 and
85 of their 102; 36 of 108 of the band (33%) up in the tiers at the bell. I9 its ceiling: screen at 0.1. I10 a road cell beside it inside on 0 of 40.
MY FIRST CUT, MEASURED AND CHANGED: 37% of men stood bare after round one (the bound is 30%): the cover sat where nobody starts. The fight stands his
line at columns 4 and 5 and theirs at 9 to 11 (read off the gate's own deal), so cover moved into that band: 23%. The arms' seats came out (the
seats picture faces one way, and a mirrored board would turn an arm's seats away from the floor); the arms are aisles.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:sphere, C3_INSIDE=sphere: through the map's own door)
- the demo upright (390 x 844): 2 fights in the bowl, both ended on AUTO; 9 of 9 tile taps (the floor, barricade, panels, road cases, broken floor); the
  ceiling: screen at 0.1, a pixel moves 3.15 and 3.44 of 255 on average, 10.3 or less on 99 pixels in 100.
- the demo on its side (844 x 390): 2 fights, both ended; 9 of 9 taps (the stairs among them); the ceiling 7.4 of 255.
- the alpha upright: 2 fights, both ended; 9 of 9 taps (the sound desk among them); the ceiling 3.3 and 3.6 of 255.
- the alpha on its side: 2 fights, both ended; 14 of 14 taps (the bowl's own high ground among them); the ceiling 7.7 of 255.
8 fights in the Sphere, 8 ended, 41 of 41 taps, 0 page errors (and the garage's and the plaza's fights at the same cells, all ended).
TWO OF THE EIGHT RAN LONG (20 and 23 rounds), both at the same cell: DESI and RAUL were struck down in the first rounds and YOU finished the last of
them alone (YOU WON on the end screen). The gate's 24 fights average 6.3 rounds; a one-man finish is the long tail, not a board that stalls.
ONLY the_horseshoe WAS DEALT BY THE MAP at the Sphere's cells these runs opened; the_screen_came_down is proven by the gate (14 of 24 boards) and looked
at on the fight page opened alone (the card's top right).

## SAID PLAINLY
- THE TIERS ARE ONE ROW DEEP: the real bowl is steep and dozens of rows high. One house tile stands for the lower bowl; the fight has one level of
  high ground.
- NOTHING ON THE SCREEN IS LIT, on the board or overhead: rule 459(e) is his to rule.

## NEXT
The list's twelfth: the home center, the hospital, the prison's cell blocks (smaller, still house-tiled), one data file each.
