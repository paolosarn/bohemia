# COMBAT THREE: THE STADIUM (BUILD 11/18m - THE STADIUM)

11/18/26. The coordinator's round of 11/18 (rule 453: the next jobs on my own list, one build each), the second build of the round: the ninth big inside of
row 468. Rules 416, 59, 428, 451(a), 441, 454(a). Ask rows 468, 627.

## HIS WORDS
- 11/6 (row 468): "what are some large ass interiors that we could fight... I still want this to be a block and turf war."
- The list's line (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md): "THE STADIUM (Allegiant): the field, the concourse ring, the stands as high ground."

## MEASURED BEFORE (main 47f73d0b4, BUILD 11/18g)
A fight at the stadium (the map's kind 'stadium') was the parking garage on four cells in ten and the lots outside on the rest.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/stadium/stadium.json`, the sixth in `slices/fight_ground/insides.json`, laid by `slices/bohemia_big_inside.js`: no new
rule code. The only code is the ceiling's painter (`ceilingSheet`, kind `dome`).
- WHERE: the stadium's own cells, 0.7 of what the garage leaves there, by the cell's dice (the gate: 20 of 40).
- THE BOARD: 20 by 15 house tiles: THE FIELD (eleven rows of dead turf: the world is dry, the turf is the golf course's own dead ground, never green) and
  A STAND ALONG EACH LONG SIDE (one row of tiles each, high ground, its seats low cover, stairs at both ends, the rail along the field a climb).
  `the_bowl`: relief left on the field (pallets, tents, wrecks, the teams' benches). `the_last_show`: the last show's rig still up at midfield (speaker
  stacks, the desk, crowd barriers in rings).
- 15 KINDS OF TILE, EACH ITS COST AND ITS EFFECT (rule 59): the field (open ground, and the stands look down on it), under the roof's ring (open ground,
  and by day a man there is seen), torn turf (3 AP), supplies on pallets and a wreck and the show's rig (cover), crowd barriers and the bench (low cover), a
  relief tent (a blocker), a tunnel's mouth (open ground, the day), a drum fire, the stands' aisle and seats (high ground; the seats low cover), the stairs.
- THEY HOLD THE STANDS (start 'gallery', the hall's way): a third of the band starts up in the stands over their own side (the gate: 36 of 108); his line
  starts on the field.
- THE DAY COMES THROUGH THE ROOF: a light on every midfield tile by day (no window in a bowl); at night only the drum fires.
- ITS CEILING AT 10% (rule 451(a)): the translucent roof's panels, its cables from the ring out, the clear ring over midfield with panes out, the dead
  scoreboard. The fight draws it until COOK FIVE's `stadium/stadium_ceiling.webp` is in.
- EVERY PICTURE IS A STAND-IN: 15 pieces drawn as finished pieces of other kits. Names in the handoff.
- RULE 454(a): no line of dialogue is rewritten; the tiles' tap lines are new, draft, the fewest words.

## THE GATE (gates/the_big_insides_gate.js: 93 passed, 0 failed; six insides; 15 legs for the stadium; about six minutes now)
I1 20 of 40 fights at the stadium go inside. I2 the floor joined on 24 of 24 boards, all four dealt shapes seen. I3 the stairs the walk and the rail a climb.
I4 lit by day by its roof and tunnels, at night by its fires only. I5 15 kinds of piece each with its picture and size, all stand-ins. I6 24 of 24 fights
ended on AUTO inside 30 rounds (6.9 a fight), nobody of 288 stood a whole fight. I7 15 kinds of tile each with its row. I8 (rule 428) after round one 8% of
248 men bare on the open field against 36% with the rule off; on cover or high ground 115 of his 144 and 99 of their 104; 36 of 108 of the band (33%) up in
the stands at the bell, 102 men up after round one. I9 its ceiling: dome at 0.1. I10 a road cell beside it inside on 0 of 40. Six plants caught.
MY FIRST CUT, MEASURED AND CHANGED: each stand was two rows deep (60 tiles of high ground, every one with cover). 163 of 249 men were up in the stands after
round one and 2% on the field: the field did not matter. Each stand is one row now (30 tiles, half of them seats): 102 up, and the field's cover is used.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js, C3_PLAIN=1 C3_INSIDE=stadium: through the map's own door)
- the demo upright (390 x 844): 1 fight on the field, ended on AUTO in 11 rounds; 3 of 3 tile taps (the field, crowd barriers, torn turf); the ceiling
  measured: dome at 0.1, a pixel moves 3.53 of 255 on average, 14 or less on 99 pixels in 100.
- the demo on its side (844 x 390): 1 fight, ended; 6 of 6 taps.
- the alpha upright: 1 fight, ended; the ceiling 3.74 of 255.
- the alpha on its side: 1 fight, ended; 4 of 4 taps.
4 fights on the stadium's field, 4 ended, 13 of 13 taps, 0 page errors (and 11 garage and lot fights at the same cells, all ended).

## SAID PLAINLY
- ONLY the_last_show WAS DEALT BY THE MAP in the valleys these runs opened; the_bowl is proven by the gate (8 of 24 boards) and looked at on the fight page
  opened alone (the card's 'scale' line says so).
- THE STANDS ARE ONE ROW DEEP: a real stand is forty rows. One house tile of stand stands for its whole lower bowl; a second level is not in the fight's
  rules (one level of high ground).
- 'The concourse ring' of his line is not on the board: the fight is the field and the stands. A concourse layout is a third layout's worth of data.

## NEXT
The dam's powerhouse (the generator hall, the galleries in the concrete), then the Sphere.
