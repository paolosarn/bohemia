# HOME, 11/3/26: YOUR SETTLEMENT THROUGH ITS OWN CAMERAS (rule 354; ask lines 352, 356, 368, 369)

His pick (11/3): "it was always going to be A". His idea on top: your settlement, and only yours, is seen through its own security
cameras in PS1-era footage, the loading screen's look and pipeline, the cameras upgrading through the acts; the rest of the game stays at
45 degrees; it works the same (tap a lot). "Be token friendly." His words in full: records/BOHEMIA_PAOLO_YOUR_SETTLEMENT_THROUGH_ITS_OWN_CAMERAS_11_3_26.md.

## STEP 1, THE LOOK TEST (this push)
Tool: tools/bohemia_home_cameras_11_3_26.py (render under Blender; post and card in any Python). Pictures: records/target/home_cameras/
(cam<N>_<tall|wide>_<frame>.png at the source size, lots.json, the VOTE card vote_look_test.webp). VOTE card: home-cameras-look-test-11-3.

THE BLOCK, BUILT ONCE IN 3D FROM THE KIT WE HAVE: a walled Las Vegas cul-de-sac 60 m square. An 8-inch block wall 1.8 m high runs all the
way round, with a pilaster every 6 m and a rolling steel gate in the south wall. One drive comes in to a turning circle. Round it stand five
of COOK's ranch houses (garage, porch, plain, wing, carport; built by the modeller exactly as the town screens build them). Behind them,
backyards out to the wall. COOK PROPS' empty pool is cut into the ground the way COOK PROPS cuts it, with its swing and trampoline. A burned
lot with rubble and a wreck. The game's truck, trailer, shed, drums, tyres, propane, street light and stop sign. The floor tool's ground
(caliche, the asphalt drive and circle, a concrete walk ring, rough backyards). The master rig's source pass, dents and sun. Only the block
wall and the gate are boxes, like every town's walls.

THE TWELVE LOTS (metres on the 60 m square; each is a box, and its outline is projected into every camera as the place you tap):
1 THE GATE, 2 WEST VERGE, 3 THE DRIVE, 4 HOUSE SW, 5 HOUSE SE, 6 HOUSE W, 7 HOUSE E, 8 HOUSE N, 9 THE CIRCLE, 10 WEST YARDS,
11 THE BURNED LOT, 12 THE POOL YARD.

THE THREE CAMERAS (rule 354(e)), placed where real ones go:
- CAM 1 THE GATE: a 7 m pole behind the gate's east pier, looking up the drive.
- CAM 2 THE YARDS: a pole in the pool yard's north-west corner, looking down the backyards. The north house's eave was tried first and
  showed only two or three lots.
- CAM 3 THE ROOFS: a 14 m pole in the north-east corner, looking over the roofs.
Each was aimed by measuring, not by eye. A lot counts as "a thumb wide" when its ground plus its height (a house's roof) covers at least 11
percent of the picture both ways (44 points of a 390-point phone).

| camera | upright 9:16 | sideways 16:9 |
|---|---|---|
| CAM 1 THE GATE | 1, 2, 3, 4, 9 | 1, 2, 3, 4, 5, 9 |
| CAM 2 THE YARDS | 4, 6, 10, 12 | 4, 6, 10, 12 |
| CAM 3 THE ROOFS | 3, 5, 7, 8, 9, 11 | 5, 7, 8, 9, 11 |
Every one of the twelve lots is a thumb wide in at least one camera.

ACT ONE'S LOOK, MADE AT THE SOURCE (rule 354(e): a dying system):
- RENDERED SMALL: 180 x 320 upright and 320 x 180 sideways (the PS1 era drew 320 x 240), at 5 samples with no denoiser. The grain is the
  render's own, and it moves from frame to frame (a new seed each frame).
- THE FEEDS' OWN CCTV TAPE: the starred loading screen's tape() for its scene B (mono, interlace, the head-switching tear), imported and
  never edited, after the rig's population snap.
- THE PS1'S COLOUR DEPTH: 32 levels a channel through a 4 x 4 ordered dither.
- THE CAMERA'S OWN TEXT: drawn in a bitmap font at the source size. The time stamp is wrong: 01-01-80, because the clock reset when the
  power died.
- CAM 3 IS THE DYING ONE: it drops a stop and a half on one frame, at the render.
- SIX PICTURES A SECOND (the feeds' CCTV rate), shown at whole multiples of its pixels and never smoothed.

## WHAT THIS IS NOT YET
Not in the game. It is the look, for his eye. The pieces (step 2), the screen (step 3) and the acts (step 4) follow, each its own push.
The pieces are modelled once and rendered from each camera as their own layers (same sun), so a built piece appears in every camera that
sees its lot.

## STEP 1 REDONE, MODULAR, AND STEP 2 BY THE SAME SCRIPT (rule 354 (g) to (o); ask lines 371, 373)
His two corrections, the same round: "each camera angle has to show all 12 lots... just cycle through it and you can't even choose what the
next camera angle is gonna be... I care about people's time a lot" and "this has to be modular and work no matter what... we can't be
cooking up 30 angles of a building type... be token efficient". The first look test above is SUPERSEDED: three cameras that each saw four
to six lots, aimed by hand per lot. Its render was stopped, its pictures removed, its unjudged card withdrawn.

THE ONE PIPELINE: tools/bohemia_home_settlement_pipeline_11_3_26.py makes every picture, by machine (records/target/home_settlement/).
- ONE LOT TEMPLATE: twelve lots, three rows of four, 11 x 10 m, 1 m walks. Each row is a step back and a step UP (0, 0.9, 1.8 m, block
  retaining walls, a stepped foothill grade). A height limit per row: front 2.6 m, middle 3.8 m, back 8.0 m. A settlement type changes only
  its BASE PLATE (the walled block's: the walls, the gate, the street, the steps).
- THREE FIXED CAMERAS, the same for every settlement: CAM 1 THE GATE, CAM 2 THE POLE, CAM 3 THE ROOF ACROSS. All high, steep and from the
  front half (16 degrees left, straight on, 16 degrees right; 52, 60 and 48 degrees down), at the long lens's limit (orthographic), so a
  piece looks the same on every lot. One square render per camera; the upright 9:16 and sideways 16:9 shapes are its two centre crops.
- A PIECE COSTS ONE MODEL: the script builds it once and renders each state from each camera. That is 3 pictures for a piece with one
  state, 9 for a piece with built and working (working moves on two beats). Every lot of its row then uses those same pictures, placed by
  the lot's anchor. Ten pieces, 66 pictures: the six (main, purifier, kitchen, garden bed, water tank, solar panel) and four of COOK's
  ranch houses (found on the back row when you plant).
- THE ACTS' LOOK IS A SETTING (LOOKS act1, act2, act3). Act one is rendered: the render's own grain, the starred feeds' CCTV tape, 32
  levels through a 4 x 4 dither. Every piece's grid lands on the plate's (anchors on multiples of four), so a piece on a plate is the
  same pixel the medium would make of the whole picture.
- Two pieces broke the rules and the rules won. The kitchen's smoke rises to 5 m, over the middle row's limit, so it lives on the back row.
  The carport house was 10.3 m deep on a 10 m lot, so it is seated at 9.8 m wide.

THE GATE, gates/home_settlement_gate.py (in the suite as YOUR SETTLEMENT, ALL TWELVE): 9 passed, 0 failed.
- S2: exactly the three fixed cameras.
- S3: every piece, every state, every camera, made by the script (66 pictures, no hand step).
- S4: no piece over its row's height.
- S5: every camera, upright and sideways, with every lot at its row's tallest, still shows all 12 lots. The worst lot is 99.7% seen and the
  smallest tap box is 52 points (44 needed).
- It can fail: a planted fourth camera fails S2, a planted picture fails S3, and a wall painted over lot 10 fails S5.

VOTE: home-cameras-all-twelve-11-3 (the default block through the three cameras, upright and sideways, the twelve tap boxes, the gate's
numbers). The data file records/target/bb/home_lots.json is on the template (lots by row, each piece's row, the houses as found).

## STEP 3, THE SCREEN (slices/BOHEMIA_YOUR_SETTLEMENT.html; VOTE home-your-settlement-screen-11-3)
- THE PICTURE: the camera's crop as big as the glass allows, never smoothed. Below it upright, or beside it sideways, the console: the
  daily bill (the people times the company's per-man night from nightly_bill.json, minus what works pays back) and the phone's own
  ground, where nothing answers a tap but the phone.
- THE CYCLE: a cut every 20 seconds on its own (a monitor's roll and one frame of static), held while a card is open or a finger is down.
  There are no camera buttons.
- THE TAP: each lot's tap box is the gate's own measure of what that camera sees of it. A tap opens the lot's card: what stands, its
  level, its look, what can stand there (by row), and where it comes from (a boss's prize, found, or you build it).
- PLANTING: the first visit asks "Are you sure? This is permanent." (PLANT HERE, NOT YET).
- Pieces are drawn back row first, anchor on anchor, from the pipeline's pictures. The save is the phone's own storage.
- Driven at 390 x 844 and 844 x 390 with touch: plant, tap lot 3, its card. 60 frames a second, 0 page errors.

## NOT DONE / WHERE I STOPPED
- Step 4, THE ACTS: act two's inside camera (CAM 4) and the cameras' upgrade per act are settings already written in LOOKS, but not yet
  rendered, and the inside base plate is not built.
- The screen is its own page, reached from its VOTE card. It is not yet the game's settlement screen for a planted place, because the
  planting on the map is the next round of the coordinator's list.
- Levels and looks per piece show "LEVEL 1 of 3, LOOK: AS FOUND". The next levels are the next pieces through the same script.
- The upright crop leaves ground above and below the block. The one-square-per-camera rule keeps a piece at nine pictures, so the crop is
  the price.

## THE CAMERAS MADE INTIMATE (rule 373; ask line 399)
His votes on the two cards: the screen "Nah these camera angles aren't intimate bro, it's shit"; the three cameras "Looks like shit". Both
are graveyard: the far, high, flat map view is dead. Measured against the bar he starred (the loading screen's feed B, the night camera,
tools/bohemia_ui_the_first_minute_feeds.py): it is night, low, close and dark, a 24 mm lens on a pole about 8 m up, a dying sodium head,
a lamp post right in front of the lens, a coyote looking round, mono CCTV tape, its own hum. Ours was a bright plan seen from a plane.

WHAT CHANGED, ALL IN THE ONE PIPELINE (tools/bohemia_home_settlement_pipeline_11_3_26.py; still one template, three fixed cameras, one script):
- THE LENS: Cycles' own equisolid fisheye (a real wide CCTV lens with its barrel bend), 14.8 to 16.8 mm, at the source, upright and
  sideways each their own framing from the same mount.
- THE NIGHT: the starred feed's film: a cold low moon, sodium heads (the gate's lamp, two on each side wall, one on the back wall, so none
  stands in front of a lot), 24 samples and the denoiser (the feed's own way), the feed's CCTV tape and the PS1's 32 levels after it.
- THE NEAR WORLD: the gate's lamp post in front of the lens, the street and its kerb, a wreck at the kerb, a hydrant, a hand-painted sign
  board on the wall, the power line sagging to the gate's lamp, the dead billboard's board over CAM 2's head; and THE COYOTE looking round
  in the front yard, posed on its own clip, three frames (it came in 82 m tall at first: its mesh hangs from its skeleton, which the
  props' seat skips; it is imported the feed's way now and measured posed, 1.1 m nose to tail).
- THE TEMPLATE, STEEPER AND NARROWER: rows step up 1.4 m each (0, 1.4, 2.8 m: a foothill tract's retaining walls), lots 9 m wide (an
  older Vegas tract), so the cameras can stand close and every lot still shows.
- THE CAMERAS: CAM 1 THE STREET LIGHT (13 m), CAM 2 THE POWER POLE (13.6 m), CAM 3 THE BILLBOARD (14.8 m), all across the street within
  10 m of the front wall, looking up the block.
- PIECES: with perspective a piece looks different on every lot, so the script renders each piece on every lot of its row, from every
  camera, both shapes, in the full scene (the block holding out, the ground catching its shadow under the same sodium light). Still one
  model, every picture by machine, nothing by hand.
- THE HONEST PART: his "about 3 to 4 m" was measured and does not hold 12 lots. From 4 m the back rows shrink to a strip on the horizon and
  the front pieces hide the rows behind them (the first try: lots 0% to 16% seen, tap boxes 0 to 8 points). The cameras went up the
  street's own poles until every lot held: 13 to 14.8 m, which is a Vegas street light's or power pole's height; the starred feed's pole
  is 8.4 m. The intimacy comes from the lens, the near world, the night and the life, not from a low mount.
- THE MEASURE WAS MADE HONEST ON THE WAY: a lot half outside the frame used to count as fully seen (its "alone" picture was cut by the
  same frame). Each lot alone is now drawn on a canvas twice as big through the same lens, so what the frame cuts off counts as unseen.
- AND THE THREE ARE CLOSE: twelve lots a thumb wide in an upright frame (a 9:16 fisheye covers about 45 degrees each side) pulls all three
  cameras near the middle of the street, so they differ by height, lens, what hangs in front and CAM 3's dying frame, not by side.

THE GATE (gates/home_settlement_gate.py, YOUR SETTLEMENT, ALL TWELVE): S5 every camera, upright and sideways, with every lot at its row's
tallest: worst lot 65% seen, smallest tap box 47.7 points; S6 (new) every camera a wide barrel lens under 20 mm, under 16 m, within 20 m
of the front wall. The screen draws the new pictures, cycles the cameras every 20 s on its own, and plays the starred feed's hum low
after the first tap.

### THE SECOND LOOK, BEFORE IT WENT TO HIM (the brief: "look at it yourself next to the starred feeds before you register it")
Side by side with the starred feed B, the first intimate render FAILED the bar: the block was a thin band across the middle (the lots
filled 26% of the upright picture, rows 120 to 226 of 320), the bottom a third was empty street bent by the lens, the top a third black
sky. Feed B is one building from close, its pole and its car in front of the lens. It was not registered like that.

MEASURED, NOT GUESSED (tools in the scratchpad, flat renders through the same lens, every lot at its tallest):
- 300 mounts on the block's middle (3 to 13 m up, -6 to +2.5 m from the kerb, three aims, five lenses) and 128 on its corner: with every
  lot keeping a 44-point tap box upright, NO corner mount holds all twelve (the far lots shrink under a thumb), and the best middle mount
  fills 30% of the picture against our 26%.
- 900 more on three smaller blocks (lots 6.5 m by 5.5 m, three rows of four or four rows of three, steps of 1.4 and 2.2 m): best 33% to
  34%. The block's size does not change it: twelve thumb-sized lots in a 9:16 frame keep any camera 11 to 13 m up with the lots a band
  across the middle. Closer means the far lots go under a thumb; lower means the front pieces hide the rows behind them.
So the closeness had to come from the camera's own world, the way feed B's pole and car make it close:
- THE NEAR SET (one set for the whole street, seen by all three cameras from where it stands, so a cut never makes a thing appear or
  vanish): CAM 1's street light arm and its dead cobra head over the lens, a Washingtonia beside it, a dead pickup at its kerb; CAM 2's
  crossarm out over the street and its two insulators, two lines sagging across the street, a pair of sneakers thrown over the low one, a
  shopping cart on the far kerb; CAM 3's two gooseneck lamps reaching out from the billboard, a strip of its torn vinyl caught on one, a
  torn web in the housing's corner. Lit by the night and by each camera's own infrared ring (90 W at the lens, inverse square): what is
  nearest glows, the real night camera's look. Its own layer (records/target/home_settlement/near/), drawn over every lot's piece.
- THE TRACT BEYOND THE BACK WALL, in the plate only (behind every lot, so no piece is touched): the grade steps up twice more, two rows of
  the next street's dead ranch houses with their backs to our wall, four old palms over them, the city's glow faint on the haze low over
  the ridge (a far card inside the lens's 600 m: the first one stood at 900 m and never drew; the second was a hard white stripe).
- THE GATE MADE STRICTER ON THE WAY: a lot's "alone" picture used to keep the walls and poles in front of it, so a real thing standing in
  front of a lot never counted against it (only a painted one did). The alone picture is now the lot with nothing else in the world;
  the near set stands in the full picture as an occluder. Still 12 of 12 in every camera, upright and sideways: worst lot 65% seen,
  smallest tap box 47.7 points. S7 (new): every camera has its near layer, both shapes, three frames, by the script.
- Only the near layer (18 pictures), the plate (18) and the gate were rendered again; the 528 piece pictures stand (the cameras did not move).
THE HONEST LINE FOR HIM: the cameras could not come lower or closer and keep all twelve lots big enough to tap upright (measured on
about 1,300 mounts); what is new is the camera's own world in front of it and the street around the block.
