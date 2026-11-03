# RUN TWO: NO TAPE ROUND THE PHONE, ITS GROUND THE TOWN'S OWN (11/3/26)

Brief: the coordinator's routine (trig_016YJpjqajxcdJjuJdPRFfNK) after Paolo voted THE TOWNS: NOTHING YOU TAP UNDER THE PHONE a YES.
Rule 356(g), ask line 376. His words: 'Everything's looking good. Just get rid of the duct tape [round the phone]... you're duct
taping the phone to the [town]... make sure it looks like it's naturally a part of what the settlement would look like, no AI slop
fade transition.'

## WHAT IT WAS (measured on the demo, 11/3, main 566f7f4d)
1. THE TAPE. A strip of tan tape with a scrap of dark cardboard stood just over the phone's top corner in every town, upright and on
   its side, and in the camp. Asked of the page: it is #bmcorner, UI's holder for the town's LEAVE (slices/bohemia_ui_materials.js,
   TOWN_CSS: a cardboard box with a ::before strip of --bm-tape). Since UI TWO moved LEAVE onto the phone (bohemia_phone.js hides the
   town's #leave while the phone is up), the holder stood there EMPTY: its padding and its tape, over the phone's corner.
2. THE PHONE'S GROUND, UPRIGHT. The coordinator's four layouts (10/27, ask line 253 'organic') painted an old parking lot into every
   town's phone corner (tools/bohemia_four_layouts_tall_render_10_27_26.py organic_lot): dark asphalt with bay lines and stains, its
   rim 'broken' at random over 26 px, so in a dirt town like Blues a black patch with a torn, smudged edge stood under the phone. It is
   not the town's own ground. And the nights of those drawings were made from COOK's old night with the corner blended in under a
   Gaussian-feathered mask (night_from, blur 14): a soft fade at night.
3. THE PHONE'S GROUND, ON ITS SIDE. The screen lays the town's own ground beside the picture in the phone's strip (padDraw), with six
   soft rings 18 px out over the picture: a fade where the town meets the strip.
4. THE PICTURE'S EDGE FADES. An 18 px dark gradient at the picture's top and bottom edges was drawn even where the picture runs past
   the glass: upright it darkened the last 8 points of the glass under the phone.

## WHAT CHANGED
1. slices/BOHEMIA_SETTLEMENT_SCREEN.html __NO_TAPE_ROUND_THE_PHONE__: html.boh-phone-on body:has(#sbody) #bmcorner{display:none}
   (the holder goes with its LEAVE; it mirrors the phone's own rule that hides #leave). In my lane's file; UI's and UI TWO's untouched.
2. The four layouts re-rendered WITHOUT the lot (the tool's default now; --lot draws the old one): the phone's corner is the town's
   own floor going on under it, as the plan lays it (Blues' sand, Church's slab, the street where a street runs), the things cleared
   as before, nothing painted on top. Day AND night rendered (no night_from feathering); the data records night_drawn and own_ground.
3. padDraw: one hard edge, no rings.
4. The top and bottom fades only where the picture's edge is on the glass.

## THE GATE
NOTHING TAPPABLE UNDER THE PHONE gains N6 (no tape round the phone, every town, both ways, both sides: #bmcorner not shown) and N7
(every upright drawing's phone ground is the town's own, no lot, day and night rendered; padDraw one hard edge, source).

## SHOW HIM
VOTE card run2-no-tape-round-the-phone-11-3: three towns before and now from the game's camera on his phone.

## AFTER (measured 11/3)
- The re-render: 28 upright drawings (14 towns x the phone left and right), each day AND night rendered in Blender 4.2 (16 samples,
  denoised), about 4 minutes a side, no night made from COOK's night; shipped with --ship-only: settlement_ground.json tall_left /
  tall_right lot false, night_drawn 'rendered', phone_ground.own_ground true; settlement_walk.json the same outlines. Church keeps its
  landmark_in_pad (the church is wider than its corner; it answers no tap). Reds' wide smith door (1044, 1062) kept.
- Blues: the black lot and its torn edge gone, its own sand under the phone. Caravans: its own concrete under the phone, a dirt yard
  of its plan in the far corner (mostly behind the phone). The old nights showed a blurred dark block where the corner was blended in;
  the new nights are clean.
- Gates: NOTHING TAPPABLE UNDER THE PHONE 22/0 (N6 no tape in every town, both ways, both sides; N7 28 of 28 drawings the town's own
  ground, day and night rendered, the side strip one hard edge); EVERY TOWN TALL AND WIDE 11/0; EVERY TOWN SCREEN ITS OWN 8/0.

## LEFT
- On its side the phone's strip is the town's own ground sampled beside the phone and tiled (COOK's wide pictures end at the strip);
  its edge is hard now, a straight line where the picture stops. A wide drawn with its own phone strip is the next step if he wants
  more (COOK's wides, a re-render like this one).
- The tool's old lot is kept behind --lot (graveyard: never default again without his word).
