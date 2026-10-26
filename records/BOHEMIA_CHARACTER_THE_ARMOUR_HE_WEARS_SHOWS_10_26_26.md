# CHARACTER [the armour he wears shows] -- NOTHING HE WEARS IS INVISIBLE (rule 272, 10/26/26)

## HIS WORDS (Paolo 10/26, LOCKED; records/BOHEMIA_PAOLO_ALL_EIGHTEEN_FOLLOWERS_TAPE_THAT_KEEPS_A_RUN_ALIVE_AND_THE_ARMOUR_SHOWS_10_26_26.md)
"the weapons and the shield show, but the good armour I have on me doesn't show, like a police helmet... I know it's a lot of
placeholder, we're gonna have to cook up so much art... it's not visually shown"

## MEASURED BEFORE (main a8978753)
No screen drew a helmet or a body armour on anybody. The fight drew his body sheet (slices/fight_rig, rig_hold, rig_melee,
rig_idles), his gun and his shield; the crew card his body and his gun (UI 0bc4824c); the camp and the town his body; the map
his body; every portrait his bare head. Every one of armor.json's 87 head rows and 78 body rows was a number and a name only.
The starting company already wears pieces (YOU: a long padded vest and an open leather hard hat; DESI a gambeson and a hood;
RAUL a padded vest and a headband; the origins' crews aketon caps and lamellar), so every man in every game was wearing
something nobody could see.

## HOW BATTLE BROTHERS DOES IT (rule 33, the school line)
Battle Brothers draws a brother as layers: body, then body armour, then helmet, each item its own sprite on the same frame,
so a bought helmet changes the man on the world map, in the fight and on the roster at once, and a kit reads by tier and
silhouette at a glance (04_ARMOUR_SHIELDS; this lane's [bb gear] 10/9). Ours does the same with one player for every screen.

## WHAT WAS BUILT
1. THE CLASSES (records/target/bb/armour_looks.json, draft:true, a modder may change any row): every row sorted by the object
   its own display name says it is (armour_names.json, RUN TWO's rule 202(d) names), never a durability bucket.
   HEAD (87): moto_helmet 24 (the full riot helms: a full-face motorcycle helmet, oxblood shell, smoked visor, chin bar, one
   pale stripe), riot_helmet 18 (THE POLICE RIOT HELMET: black dome, clear face shield down with a grey rim, neck guard, a pale
   decal), hard_hat 17 (chalky safety yellow, ridge, peak), rag_hood 9, chain_hood 5 (grey links, face open), brim_helmet 5
   (the kettle hats: an old army steel pot), welder_mask 4 (the visors and the bucket: a scorched face plate, dark lens, head
   band, pivot knobs), bandana 2, gas_mask 1, straw_hat 1, dust_mask 1. Extras by name: spike, horns, chain (an open mail
   curtain), chain_closed.
   BODY (78): padded_vest 19 (quilted olive), work_jacket 16 (brown duck canvas, collar, pocket flaps, capped sleeves),
   police_vest 15 (THE POLICE VEST: navy-black plate carrier, a pale band across chest and back, pouches), plated_jacket 14
   (grey scales in rows, shoulder caps), riot_armour 10 (black chest plate, big shoulder pads, collar), car_door 4 (THE CAR
   DOOR STRAPPED ON: a pale old sedan door, rust through it, the dark window in its frame, the handle, straps over the
   shoulders). Extra: chain (a mail hem under the piece).
2. THE PIECES (slices/wear/wear.webp 512x608, wear_face.webp 512x431, wear.json): 27 pieces (class + extras in use) x 8
   facings, a head piece also knocked off and lying on the ground, and at portrait size. MADE IN THE RIG'S LOOK AT THE
   SOURCE (rule 115): tools/bohemia_character_the_armour_shows.py models each piece as a small signed-distance model at the
   rig man's real proportions (his head 25 px across at 57 ppm, measured on all 26 crew and gang looks) and renders it under
   the master rig's own camera (orthographic, tilt 45 from straight down, facing north, the 1/cos 45 height stretch), the style
   guide's sun (sun_rot_deg 40,0,-35 = from the upper left, screen light 155), its sky fill, roughness 1 and no shine, paint
   chalky (paint_sat_mul 0.85), grain from the surface, crevice shade, the ring, the hard alpha (127); the portrait at the
   rig's portrait tilt 80. His own head and trunk are HOLDOUTS: they hide the back of a piece and leave his own pixels
   showing (his face under the riot shield, his face in the hood).
   SAID PLAINLY: Blender is not on this box and this round may install nothing, so it is the rig's recipe run by a numpy ray
   marcher, not DIRECTION's master rig in Blender. They are PLACEHOLDERS, his word; COOK makes each named piece's own art
   through the master rig over the rounds ([the armour's art], NOTE on its board) and drops its cells into wear.json.
3. THE PLAYER (engine/bohemia_wear.js, one for every screen): every picture of a man here is a cell of a sheet laid where it
   stood; his head is found ON THE CELL'S OWN PIXELS, once a cell (the first row a head wide, up to its top, down to the
   neck; at most 24 new cells a frame, never a stall), so a piece sits on him in every clip of every sheet family (fight_rig,
   rig_hold, rig_melee, rig_idles, rig_town, rig_mix, the map's own frames) with no joint table. Checked by eye on contact
   sheets of 368 cells of the fight, hold, melee and idle sheets of seven looks (you, the Mob, the thug, the Church, two
   rolled men, a cast look): 192 of 192 drawn on the last pass, the head found on every upright cell including the
   crouch in cover, the swing, the aim and the stretch. A man lying down (the fall) drops his helmet on the ground beside him
   (Battle Brothers knocks it off); his body piece is not drawn on the ground (the fall has no layer; named below).
   Body piece first, then the helmet; both over his body and UNDER what is in his hands (his gun, his shield, his club). At
   night the piece takes the fight's moon and the town's dusk.
4. THE SCREENS (each a marked block __THE_ARMOUR_HE_WEARS_SHOWS__ in the owner's file, one call into the player):
   the crew card (slices/BOHEMIA_ROSTER_SCREEN.html: the still and the idles, the swap redraws him; UI's figure),
   his portrait on the company's line and everywhere BohemiaCrewFaces paints (engine/bohemia_crew_faces.js paint()),
   the fight (slices/BOHEMIA_FIGHT.html: idleDraw, holdDraw, meleeDraw, blitMan's own sheet; and drawPortrait for the bar,
   the turn strip, the vet and the call; the faces painted again when the helmets' sheet lands),
   the camp and the town (slices/BOHEMIA_SETTLEMENT_SCREEN.html: your men round the fire, their stills, your lead),
   the map (slices/BOHEMIA_CITY_WORLD.html: he and the two of his company at his shoulders, in depth with the painting, at
   every zoom; the lead by his main man's own look (RUN's mapMainLook, rule 263) or 'you'; the door's company read by place
   when the crew screen has saved none, as the fight dresses them). The portrait's helmet rides PORTRAIT's breathing face
   (it is laid inside the same breath, over his marks).

## THE GATE (gates/the_armour_he_wears_shows_gate.js, in the suite as THE ARMOUR HE WEARS SHOWS) -- 18 legs, all green
(run whole on the rebased tree, 16/0; then C and M again after the face's order and the close end were added, 5/0 and 8/0)
D1 every one of the 87 helmets and 78 body armours has a class drawn in all eight facings, lying and in the portrait.
Phone and computer, a man in 'a nose-guard riot helmet' (the police riot helmet) and 'a basic plate carrier' (the police
vest): C1 the crew card draws both (1,081 of his pixels change against the same figure with nothing drawn), C2 his portrait
wears the helmet (11,395 pixels of his face change), F1 the fight draws both facing the glass and facing east, F2 the
fight's own face painter puts it on his face (4,005 of 7,056 pixels), K1 the camp draws him at the fire in both, M1 the
demo's map through its own door draws him in both and the two men at his shoulders in their own (hard hats, padded vests),
M2 at the map's close end (zoom 1.00 to 4.74 on the phone, to 14.22 on the computer) he still wears both;
E1 all 17 classes drawn on the man who wears them; PLANTED: the drawing switched off, C1 catches him bare.

## THE COST, MEASURED
The fight, phone profile, twelve men all in pieces, AUTO, six seconds each way, the drawing on and off in turn: 42.5 and 41.9
frames a second on, 42.5 and 38.3 off (no cost the clock can see; the fight's own ceiling on this box with twelve men is ~42).
At 4x throttle 5.7 and 7.2 on, 7.9 and 6.5 off: noise either way. The sheets: 243 KB and its face sheet, loaded only by a
screen that draws a man.

## IN THE VOTE TAB
character-the-armour-he-wears-shows-10-26 (every class on him bare and wearing it, eight turns at 2:1, his portrait) and
character-the-armour-on-every-screen-10-26 (the police riot helmet and vest on the crew card, in the fight, at camp, on the
map and at its close end, bare above and wearing below, from his phone).

## NOT DONE, NAMED (not invented)
- A MAN ON THE GROUND: his helmet lies beside him, his body piece is not drawn (the fall's frames are a man lying at any of
  eight angles; ANIMATION's gear layers on the rig, rule 177(b), are the real answer).
- HIS FOREARMS IN FRONT OF HIS CHEST (the carry, the pistol held up) go under the vest's placeholder: the piece is laid over
  his whole picture, then his gun over it. The real art as a layer on the rig's skeleton (177(b), ANIMATION and COOK) fixes it.
- ENEMIES: the fight gives an enemy no head or body row (enemyUnit: bodyRow null, headRow null, his armour a number), so an
  enemy is drawn in his model as before. NOTE on COMBAT's board: pick his rows from his own gear list (enemies.json carries
  them) and the same player draws them.
- HIS MARKS GO OVER THE HELMET on the portrait (PORTRAIT's rule 234(c): a wound always shows; THE FACE SHOWS THE WOUND 29/0),
  so an ear tag can sit on a helmet's side until PORTRAIT models marks and headgear together.
- A LOOK WITH A MODELLED HAT (cast_widebrim's straw hat) wears the helmet over it; a long-haired look's hair shows under a
  small piece (the bandana); the work jacket is laid over his runway clothes (it is his armour now).
- THE MAP'S LEAD is whoever RUN's mapMainLook says (rule 263, [your main guy leads the walk], landed while this row ran): the
  fight's own YOU, or his own made look once RUN THREE's maker writes it; the armour follows that look.
- COOK's art for every named piece (172 rows, 17 classes): [the armour's art].

## ROUTED
COOK [the armour's art]; PORTRAIT NOTE (headgear on the face, and rule 246's breathing face: call BohemiaWear.face after each
paint); UI NOTE (the crew card's figure block); COMBAT NOTE (the hook in your file; enemies' rows); RUN NOTE (the map block);
RUN TWO NOTE (the settlement screen, the crew screen and the crew faces); ANIMATION NOTE (gear layers replace the placeholders'
head-finding when they land).
