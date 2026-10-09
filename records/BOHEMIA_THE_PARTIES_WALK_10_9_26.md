# THE PARTIES WALK (ANIMATION, [the marker walks], 10/9/26)

## WHY THIS, NOW
Rule 78 put the lane back to work; this was the top OPEN row after [the fight's clips in the new fight] shipped.
The row (rules 65 and 68): the party marker and the roaming parties WALK, three real dressed people, the walk
cycle at the map's scale, a halt when the clock stops, the glide of the third votes.

## WHAT THE MAP DID, MEASURED ON THE REAL ALPHA (the map inside it, the one driver, the clock stubbed)
1. THE CAST CAME TO THE MAP WITHOUT LEGS. The alpha bakes each cast look an idle and a four-beat breath and sends
   NOTHING ELSE (citySendCast, cityBakeRestLater: this lane's own 9/5 [crowd moves] code, which said so: "not walk
   frames"). So every one of the 28 parties crossed the valley standing still and breathing.
2. A PARTY JUMPED. Its cell changed on the clock and it was drawn at the new cell on the next frame: the boom boom
   boom of 9/27, fixed for him on 9/28 and never for anybody else.
3. HIS PARTY WAS ONE MAN, and his legs flipped on a 125 ms WALL CLOCK whatever the travel speed.

## WHAT SHIPPED
THE ALPHA (cityBakeWalkLater): each cast look's walk, the rig's own walk clip, four pictures a facing (ANIMBEATS.walk
is 2: one stride, two steps), eight facings, baked by the same withLook borrow and bakeCast as the breath, ONE LOOK
PER IDLE CALLBACK on the bus cityBakeRestLater proved. Measured: a look's eight facings cost ~285 ms (rebuild 40,
walk 25 a facing, restore 45); the worst long task while it ran was 531-554 ms, which is the rest-of-cast look the
same bus already carried (~530).
THE MAP (BOHEMIA_CITY_WORLD): the walk arrives by the look's NAME (castWalkAttach, the __CITY_TRADEFIT__ lesson);
mapPersonDraw takes a stride phase and draws the walk picture, else it breathes; a party GLIDES (partyGlidePos: the
gap between its steps capped at a beat, his own rule) and walks while it glides, its second man half a stride out
of step; his stride comes from HIS glide (strideOf: two steps a cycle, carried across steps), so his feet keep pace
at every speed; TWO OF HIS COMPANY walk at his shoulders, off his hop, drawn after him when he faces away.

## WHAT LOOKING AND THE GATE CAUGHT
1. THE COMPANY WAS HIDDEN, TWICE. A step back measured in TILES put both behind him at the opening zoom (a tile is
   a few pixels); spaced by the body, one still vanished: walking down-left, the man at his left shoulder stands
   EXACTLY behind him from this camera (logged: (190,376) against his (189,391)). Spread across the glass, all three
   read in every frame.
2. A PARTY CAN COVER TWO BLOCKS IN A TICK (a Mob patrol, 41,29 -> 39,27), and his own cut line (2.5) snapped it:
   the gate read 2.83 blocks in one frame. A party's cut is now more than three blocks any way.
3. MY OWN GATE WAS BLIND TO ONE MUTATION: it read where the party's glide THOUGHT it was, so a glide that drew the
   cell anyway passed. It now reads where the render DREW it (MAP_DREW.partyAt) and the same mutation fails at 2.83.

## PROOF
    THE PARTIES WALK (new, gates/the_parties_walk_gate.js, in the suite) 10/0: every look's walk reaches the map
    (12 of 12, four pictures, eight facings); no bake chunk over the bus's ceiling; CONTROL 28 parties gliding on
    148 frames; walking people drawn on 235 of 277 frames of an eight-block trip; the most any party moved in one
    drawn frame 0.094 of a block; his party is three; four walk pictures from his glide; three seconds after the
    last step NOBODY walks and his company stands and breathes; no page errors.
    MUTATIONS: no walk bake (3 fail), parties drawn at the cell (fails at 2.83), no company (3 fail).
    REGRESSION, the map and the cast, on this tree: MAP GLIDES 14/0, MAP HAS ITS PEOPLE 19/0, LIVING MAP 22/0,
    MAP AT THE PHONE'S PIXELS 16/0, MAP HEARS 8/0, MAP IS HOW YOU TRAVEL 17/0, MARKER ON BEAT 12/0, PAD IS TRAVEL
    SPEED 19/0, MAP MOVES 31/0, CROWD 16/0, CITY CAST SILHOUETTE 6/0. Red here and red identically on the pre-round
    files: CITY CAST (a timeout), THE COMPANY IS A CAST 63/2, THE FACE ON THE MAP IS HIS A2. ONE RED WAS MINE AND IS
    FIXED: FACE ON THE MAP A3 reads the source for 'imageSmoothingEnabled=false' within 4,200 characters of his
    marker's header, and the company code inside that block pushed it out; the company is its own function now
    (mapCompanyDraw) and A3 is green.
    VOTE: animation-the-parties-walk-10-9, the same trip before and now off the map's own canvas, playing.
    ONE RED, NOT EXPLAINED AWAY: on the rebased tree, run three browser gates at a time, PARTIES WALK read 9/1 once;
    alone it read 10/0 twice and with two others alongside 10/0. The claim most sensitive to a loaded machine is the
    600 ms ceiling on a bake chunk (measured 401-554 ms), so a busy CPU can push it over. Named here, not loosened.

## [bb marker] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
Battle Brothers moves "one marker for the company", which "walks in real time" to the click (the library,
01_WORLDMAP); parties within sight are "named by size" with strength badges. One token stands for twelve men. WHAT WE DO DIFFERENTLY: the company is PEOPLE,
him and two of his own at his shoulders, in their clothes, legs on the stride the ground asks for; every party is
two dressed men under their banner, walking while the clock runs and standing to breathe when it stops.

## ANALOG HORROR LINE (rule 30)
A crowd that holds perfectly still while the world moves is the frozen frame of a bad tape; a party that steps
when you step and stops when you stop is the thing in the corner of the footage that is watching back.
