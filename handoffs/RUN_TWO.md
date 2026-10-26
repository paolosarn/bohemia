RUN TWO (run-two, the town screen, the shop, the crew's gear): 10/26 LATEST -- BUILD 10/26zze - THE TOWN TURNS WITH YOU.
All BUILT, NOT YET SEEN (rule 179) unless said.

SHIPPED THIS SESSION (in order, each on the board with its sha):
- [what you buy goes on the man] ddb0d6e0 (rule 210): BUY puts it on the card's man (best fit or the face he tapped), the old piece
  to the stash; 'to the stash' beside it. engine/bohemia_shop_wear.js (bohemia.wear.v1) carries a buy to the crew screen and the
  fight's door. Gate WHAT YOU BUY GOES ON THE MAN.
- [two jobs at once] 30372e16 (rule 228(b)): both held jobs on the board; a third offer says two is the most and offers the swap.
- [tape at every stall] 86629373, LIVE (rules 265, 276(b)): ECONOMY's tape shelf at every stall, a roll and a stack of 20.
- [the smith mends] 406e098e (rule 277): MEND YOUR GEAR at the smith, the armourer and a camp's GUNS AND PLATE, ECONOMY's
  mendPrice, an hour on the map's clock.
- [the town fits the screen] + [the town frames around the phone] + [pinch out to the map] + [the towns wired tall and wide] +
  [the company takes his own name] + [the Lone Wolf gets Recover]: this ship (see the board for the sha).

WHAT IS LIVE IN THE TOWN SCREEN (slices/BOHEMIA_SETTLEMENT_SCREEN.html, marked blocks):
- __THE_TOWN_FITS_THE_SCREEN__: the whole town fitted to the open area (the glass less UI TWO's BOH_PHONE_RECT band); nothing
  slides; the sheet above or beside the band; townLeaveUp(): with the phone up LEAVE is the phone's, no room kept for the town's.
- __THE_TOWNS_WIRED_TALL_AND_WIDE__: townShape() (the top window upright = tall), townComp(), compVar(): a home base's own
  composition with ITS hotspots/boxes/doors/look; townOk() holds back a composition whose doors stand inside its walls (Reds'
  wide, its smith); spreadFolk() (nobody on anybody), plates off other buildings and bodies (signRect), leadHome off people.
- __THE_FLIP_GLIDES__: flipCheck() at the end of layout(); flipSnap/flipDraw/flipPeople; a beat from MOTION's clock, Material's
  standard curve, a stall never skips more than a twelfth; LESS = a dissolve; BohemiaSettlement.flip() for gates (log, trace).
- __PINCH_OUT_TO_THE_MAP__: two fingers zoom to zoom_max, together shrink the town over the map, let go past 0.75 leaves.
- walkGrid: a wall stays a wall under a standing man (fortress_0's clinic corner).

GATES (mine): THE TOWN FITS THE SCREEN, PINCH OUT TO THE MAP, THE FLIP GLIDES, THE COMPANY TAKES HIS NAME, WHAT YOU BUY GOES ON
THE MAN, THE SHOP SAYS, TAPE AT EVERY STALL, THE SMITH MENDS, DROP A JOB, THE WALK-UP (+ ON THE GROUND), THE PEOPLE OF THE PLACE
(red only on PORTRAIT's person_woman_2 wound file, red on main too). Helpers: tools/bohemia_open_the_crew.js (the one CREW).

NEXT, IN THE BOARD'S ORDER: the shop rows [one tap selects, two taps buy] (249), [nothing moves while he browses] (250), [the shop
shows only what changes] (251), [the shop lights upgrades] (282), [sell at the stall] (242), [what you sell sits on their shelf]
(248); [eyes: prices under the phone]; rule 224's icons on my screens; CAMP TWO's camp tiers tall and wide when they land.
[bb Battle Brothers' town is one still panorama; ours turns with the phone, every building sliding to its new place.]
[analog horror: the ground slips out of focus on a turn like a tape finding its tracking, the buildings sharp as they slide.]
