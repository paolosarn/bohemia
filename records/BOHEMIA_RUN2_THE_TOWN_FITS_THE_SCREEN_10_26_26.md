# THE TOWN FITS THE SCREEN, FRAMED AROUND THE PHONE, PINCH OUT TO THE MAP, THE TOWNS WIRED TALL AND WIDE, THE FLIP GLIDES (RUN TWO, 10/26/26)

Rows: [the town fits the screen] (rule 218(c)), [the town frames around the phone] (rule 213), [pinch out to the map] (rule
211(c), 220(d)), [the towns wired tall and wide] (rules 186(b), 220, 279, 286, 289: every home base its own picture, TALL upright
and WIDE on its side, and the flip a glide).

Paolo 10/26: 'I don't like sliding... you don't have to scroll, it's too much, it should be zoomed out perfectly the way it's
supposed to be'; 'not directly in the middle of the screen, slightly off center... the phone placement permanent... the
same size'; 'flip my phone and the settlement looks exactly the same'.

## MEASURED BEFORE
- An upright phone showed about 60 percent of the town's width (390 of 676 px) and slid for the rest; EYES 10/26q k23: DEUCE
  off the left edge, GRIZ on the right. A wide glass filled its width and cropped top and bottom.
- The building's sheet ran the full width at the bottom, under the phone's corner; LEAVE rode up over the sheet, and on the
  phone it stood under the phone (EYES 10/26m q10, q11: a tap on LEAVE opened DROP IT / KEEP IT).
- Once UI TWO's phone landed in the town (3cc7cdd77), today's town picture put the ARMOURER in the bottom-right corner under
  the phone on the phone AND the computer: a tap there landed on the phone (THE SHOP SAYS 'the armourer opens' went red).
- Fourteen home bases drew four pictures (each tier's two): Cartel's yard was Mob's and Network's (EYES 10/25 line 106).

## NOW (__THE_TOWN_FITS_THE_SCREEN__, __EVERY_TOWN_ITS_OWN__, slices/BOHEMIA_SETTLEMENT_SCREEN.html)
- The WHOLE town is fitted to the OPEN area: the glass less the phone's band, read live from UI TWO's BOH_PHONE_RECT (Google's
  map padding, as UI TWO reads it: upright the band under the phone's top and LEAVE standing over it; on its side the band
  beside it). Nothing slides; a drag moves nothing. A turn of the device or a flip of the phone ('bohemia-phone') lays it
  out again at once.
- The building's sheet stands above the band upright and beside it on its side; its X is always on the glass; LEAVE stands
  right over the phone (UI TWO's place) and never rides up over the town.
- Every home base draws its own picture, day and night, from COOK's slices/settlement_ground_towns/ (wide: the tier's first
  layout to the pixel, so every door, keeper and lane stands where it stood) and walks its own measured ground
  (settlement_walk.json beside it). A camp or a place with no picture of its own keeps its tier's.
- Every person stands on the town's own ground: a keeper at COOK's door for his place, anybody else on a wall steps to the
  nearest open ground, the walkers' lanes kept where their run is clearest. Measured on Church's own picture first: all eight
  keepers and 9 of 21 in the crowd stood inside its walls. A town's picture is drawn only when its doors stand on its ground
  (within 120 px): eleven of fourteen do; Church (the post 320 px and the bar 328 px inside its walls), Reds (the clinic 168, the
  stall 112) and Remnants (the post 152) keep their tier's picture until COOK's re-lay of the wides (relaid:true) lands.
- TWO FINGERS (__PINCH_OUT_TO_THE_MAP__): spread them and the town zooms in toward them as far as its size earns (COOK's zoom_max:
  a camp 1.5, a town 2, a fortress 2.5), the point between the fingers held, and a finger pans it; bring them together and it
  comes back to its fit, and on past it the town alone shrinks away over the map (the frame see-through); let go past three
  quarters and he is on the map at that town, before that it springs back. ESCAPE was already UI's: it closes an open building,
  then leaves.
- On a wide glass the sheet is centred in the open area (UI's 1040-wide rule laid in the open area, never half off the edge).
- A small sign's 44-point widening never takes another building's own ground (at the fit a fortress's post sign lay over
  the lot and opened the post).
- The valley round a fitted town is a little less sunk (.66, was .78) so the sides read as the valley, not the page.

## GATES
THE TOWN FITS THE SCREEN 21/0 (new): phone upright, phone on its side, the computer, Church through the map's door: T1 the
whole picture in the open area, 10 doors and 21 people inside it and none under the phone; T2 a 180-point drag moves nothing;
T3 every building opens with one real tap where it stands (10 of 10 each); T4 the board open: the sheet, its X, its rows and
LEAVE clear of the phone and on the glass, a tap on LEAVE's middle is LEAVE; T5 the phone flipped left (BohemiaPhone.setSide):
the town lays out of it at once; T6 the band is BOH_PHONE_RECT itself.
PINCH OUT TO THE MAP 8/0 (new): REAL two-finger touches (CDP): P1 spread zooms 1 -> 2.00 (Church's most), the point between
the fingers drifting 0.6 points; P2 a finger pans the zoomed town; P4 a small pinch let go at 0.90 springs back; P5 a tap still
opens a building; P3 fingers together: scale(0.214), the frame transparent, let go: the map up at Church, 0 cells off; K1 the
computer: ESCAPE closes the board, the next ESCAPE leaves.
Green beside them on this tree: THE WALK-UP 8/0, THE WALK-UP ON THE GROUND 7/0 (alone), EVERY TOWN IS BUSY 4/0, YOUR CREW LIVES
IN THE TOWN 9/0, THE PEOPLE OF THE PLACE 40/0, THE SETTLEMENT IS BUSY 10/0, THE SHOP SAYS 10/0 (its armourer back out from under
the phone), ONE HUD EVERYWHERE 71/0 (a press scrolled out of its own sheet is not on the glass), DROP A JOB 9/0, WHAT YOU BUY 12/0,
THE SMITH MENDS 8/0, TAPE AT EVERY STALL 8/0. RED, NOT THIS CHANGE: THE CAMP C5 ('the crew screen's bag of null'), red the same with
main's own town file in place.
Re-aimed: THE SETTLEMENT ON ITS SIDE (the whole picture on the glass, nothing cropped; beside it the valley, never flat page
colour) 13/0; ONE HUD EVERYWHERE keeps UI TWO's LEAVE leg.

## THE TOWNS WIRED TALL AND WIDE (__THE_TOWNS_WIRED_TALL_AND_WIDE__)
- MEASURED: COOK re-laid eleven of fourteen WIDE pictures out of the phone's corners (relaid:true; Blues, Caravans, Cartel, Mob,
  Network, Remnants and the five camps) and the screen still laid its tier's boxes over them, so a keeper stood at COOK's door while
  the tap for his building lay where the tier's picture had it (Blues' drawn armourer 600 px from its box).
- NOW a home base's screen is built from its own composition: the glass upright (the top window taller than wide) draws the TALL
  one (1024 x 1820), on its side or a computer the WIDE one (2060 x 1092); its hotspots, boxes, doors and burnt house are the
  composition's own, so every tap, keeper, sign and bench stands on its building. The tier's lanes are laid into the tall picture
  then onto its own ground. A composition whose doors stand inside its walls keeps the tier's picture for that shape (Church's and
  Reds' wides until COOK re-lays them; their talls draw).
- A door's plate (the pistol over the post, the bottle over the bar) never lies on another building or a man's body in a
  composition: COOK's tall fortresses put the post's plate on the stall's middle, and a tap on the stall opened the post (Caravans,
  Mob upright, measured). The tier pictures' plates stay where they were set by eye.
- Nobody stands on anybody: in a composition the men at the post, then the crowd, step to the nearest open ground a finger (31
  points) from everybody; his own arrival spot is never on somebody's (Blues upright had the stall's knot on the post's rail).
- FIXED ON THE WAY (every picture): the walk's grid marked a man standing by a wall as 'somebody' over the wall itself, so a way
  through people went through the wall (fortress_0: 20 ways through the clinic's corner, seen once the fit moved its crowd).

## THE FLIP GLIDES (__THE_FLIP_GLIDES__, rule 289(b), the coordinator's shared-element default)
- On a turn the old composition is laid on the new glass (the frame he sees the instant it turns), then in ONE BEAT (MOTION's
  clock) every building slides from its old spot to its new one on Material's standard curve, its old pixels dissolving into its
  new; the ground under them goes out of focus and back (a blurred copy of each picture, so nothing is ever a black hole); every
  keeper, man at the post, man in the crowd, walker and his own lead rides from where he stood to where he stands now, at the size
  between, still idling or walking. The beat runs from its first drawn frame and a stalled frame never skips more than a twelfth
  of it. A tap in the beat lands on the new town. MOTION's LESS: a dissolve in place in 167 ms.
- The door he is at and the man he talks to stay his: an open sheet stays open and he stands by the same keeper in the new
  picture; mid-walk he keeps going to the same door. Both shapes' pictures are fetched on arrival; a flip waits for its picture.
- Emphasized-decelerate (MOTION's curve for a piece that arrives) threw a building two thirds of its way in one slow frame; the
  standard curve starts gently.

## GATES (this round, on the tree rebased on main)
THE FLIP GLIDES 9/0 (new): Blues upright draws blues_tall.webp, 10 of 10 buildings by one real tap; turned with the bar open: the
wide, a beat of 500 ms drawn in about a second under four parallel browsers (the stall cap), 12+ frames, 10 buildings on every
frame, the biggest step under 40 percent, the darkest frame 1 percent; the bar still open, he 58 px from its keeper, 17 people
before and after; 10 of 10 on its side; mid-walk to the armourer turned back up, he gets there; LESS 167 ms, nothing travels; the
computer keeps its picture.
THE TOWN FITS THE SCREEN 21/0 (its LEAVE legs re-aimed to UI TWO's phone LEAVE, 52741663e: with the phone up LEAVE is the phone's own
press and the town's own LEAVE is off the glass, so no room is kept for it over the phone). WHAT YOU BUY 12/0 and THE SHOP SAYS 10/0
(their crew legs press the phone's CREW; the bar's crew chip is a readout since 52741663e; tools/bohemia_open_the_crew.js). THE
WALK-UP ON THE GROUND 7/0. THE PEOPLE OF THE PLACE 39/1 (re-aimed: it waits for the town to settle after a sheet closes; red: PORTRAIT's
person_woman_2 wound file 404, red the same on main).

## NEXT
- The camps' tiers (CAMP TWO's [the camp fits the phone]) and COOK's re-lay of Church's and Reds' wides draw the moment they land.
- EYES judges every town tall and wide with no phone first (289(d)).
[bb Battle Brothers' town screen is one panorama that never moves; ours fits the glass it is on and steps out of the phone's way.]
[analog horror: the town sits in the frame like a photograph on a dark table, the valley around it out of focus; on a turn the
ground slips out of focus and back like a tape finding its tracking, the buildings sharp as they slide.]
