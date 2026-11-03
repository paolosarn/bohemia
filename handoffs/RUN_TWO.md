RUN TWO (run-two, the town screen, the shop, the stall, the crew's gear): 11/3 LATEST -- BUILD 11/3zzu - THE TOWN JOB.
All BUILT, NOT YET SEEN (rule 179) unless said.

11/3 THE TOWN JOB (the coordinator's VAMILY from FINISHER 2's open asks page s2; record records/BOHEMIA_RUN_TWO_THE_TOWN_JOB_11_3_26.md):
- FOUND: the game already drew the towns' own pictures (FINISHER's 'old pictures' line was EYES R6 at 10/26zzi, before the
  10/27 four layouts); 55 of 56 views (14 towns x upright/sideways x phone left/right). Reds sideways drew town_1 (its smith's
  door on the picture's bottom edge). A man you can tap stood under the phone in 9 of 28 upright views; Caravans' post off the
  bottom edge sideways; the arrival card's bar under the phone; a failed picture never re-asked = his brown town (248).
- SHIPPED 49e90eff (__NOTHING_TAPPABLE_UNDER_THE_PHONE__): FIT.padPic/phonePic/glassPic at the fit; offThePhone() (game only,
  never S.standalone) moves any still man off the phone's ground or back onto the glass; crewGround skips the pad; the folk key
  carries the pad; tapBox stops at the phone; frameTargets keeps the post's men on; the arrival card padded into the open area;
  townIm retries twice then the tier's picture; picIn() guards every tap. Reds' wide smith door (1044, 1062).
- GATE NOTHING TAPPABLE UNDER THE PHONE 17/0 (6 min; every town, both ways, both sides). VOTE run2-the-town-job-11-3.
- Rows 226, 219, 241, 106, 142, 253, 244, 173, 174, 195, 248 marked BUILT, NOT YET SEEN on the ask list.
- NEXT / LEFT: the camp's sizes under the phone (K14, line 291) are CAMP TWO's; Church's church roof runs under the phone's
  edge upright (decor, no tap; the coordinator's landmark_in_pad); SETTLEMENT SIDEWAYS is red on main (it wants the whole
  picture uncropped, the four layouts crop by design): its owner re-aims it.

SHIPPED THIS SESSION (in order, each on the board with its sha):
- [what you buy goes on the man] ddb0d6e0 (rule 210): BUY puts it on the card's man (best fit or the face he tapped), the old piece
  to the stash; 'to the stash' beside it. engine/bohemia_shop_wear.js (bohemia.wear.v1) carries a buy to the crew screen and the
  fight's door. Gate WHAT YOU BUY GOES ON THE MAN.
- [two jobs at once] 30372e16 (rule 228(b)): both held jobs on the board; a third offer says two is the most and offers the swap.
- [tape at every stall] 86629373, LIVE (rules 265, 276(b)): ECONOMY's tape shelf at every stall, a roll and a stack of 20.
- [the smith mends] 406e098e (rule 277): MEND YOUR GEAR at the smith, the armourer and a camp's GUNS AND PLATE, ECONOMY's
  mendPrice, an hour on the map's clock.
- [the town fits the screen] + [the town frames around the phone] + [pinch out to the map] + [the towns wired tall and wide] +
  [the company takes his own name] + [the Lone Wolf gets Recover]: 1bdccfd8 (+ 8787e93e, the walk-up gate's fresh frame box).
- [one tap selects, two taps buy] (the shops) + [nothing moves while he browses] + [the shop shows only what changes] + [the shop
  lights upgrades]: 3c266b41, LIVE (pages 4046), BUILD 10/26zzt.
- [sell at the stall] + [what you sell sits on their shelf] + the stall's half of 249 + [eyes: prices under the phone]: BUILD
  10/26zzw (its sha on the board).

WHAT IS LIVE IN THE TOWN SCREEN (slices/BOHEMIA_SETTLEMENT_SCREEN.html, marked blocks):
- __THE_TOWN_FITS_THE_SCREEN__: the whole town fitted to the open area (the glass less UI TWO's BOH_PHONE_RECT band); nothing
  slides; the sheet above or beside the band (a shop's and the stall's the band's full height); townLeaveUp(): with the phone up
  LEAVE is the phone's.
- __THE_TOWNS_WIRED_TALL_AND_WIDE__: townShape(), townComp(), compVar(): a home base's own composition with ITS hotspots/boxes/
  doors/look; townOk() holds back a composition whose doors stand inside its walls (Reds' wide); spreadFolk(), signRect, leadHome.
- __THE_FLIP_GLIDES__: flipCheck() at the end of layout(); a beat from MOTION's clock; COOK's towns[name].glide pairs.
- __PINCH_OUT_TO_THE_MAP__: two fingers zoom to zoom_max, together shrink the town over the map, let go past 0.75 leaves.
- __ONE_TAP_SELECTS__ (the shops): S.shopSel, shopPick (a double tap inside 450 ms = shopDo), one sticky strip #shopstrip at the
  sheet's foot (shopStripFill: facts, his men via onMan, #buywear/#buystash or #sellit/#keepit), shelfView keeps a bought
  piece's gap for the visit, shopUpFor marks upgrades (.up), contextmenu buys.
- __WHAT_YOU_SELL_SITS_ON_THEIR_SHELF__: bohemia.soldto.v1 per place and delivery; soldToShelf on every sale (one, SELL THE
  JUNK), restock() puts his first; S.visit (a new one each open with a place) decides the buyback price; shopBuy's it.yours path.
- __SELL_AT_THE_STALL__: stallRows/stallPrice (ECONOMY's line/pays/warns), stallSides (BACK lots per visit), stallTap (450 ms
  double tap, a warned food sale needs the box lit first), stallDo, stallRefresh (lines replaced in place), #stallstrip;
  bohemia.stall.need.v1 per place and card week. NEW GAME forgets both new keys (the alpha's forget list).

GATES (mine): THE STALL BUYS AND SELLS, THE SHOP TAPS, THE TOWN FITS THE SCREEN, PINCH OUT TO THE MAP, THE FLIP GLIDES, THE
COMPANY TAKES HIS NAME, WHAT YOU BUY GOES ON THE MAN, THE SHOP SAYS, TAPE AT EVERY STALL, THE SMITH MENDS, DROP A JOB, THE WALK-UP
(+ ON THE GROUND), THE PEOPLE OF THE PLACE (red only on PORTRAIT's person_woman_2 wound file). Helpers: tools/bohemia_open_the_crew.js.
Known reds not mine: THE TOWN'S PART E8 (31 px at the fit; pinch is the remedy), ALSO HERE, B2/B3 (the crew screen's bag picker,
NOTE to CHARACTER and UI); THE UI MORPHS 37/13 and THE MARKET IN THE PACK'S ART's s_food icon, both the same on main.

NEXT: rule 224's icons on my screens (the hall, the board, the clinic: a lone number a picture first, UI's kit); ECONOMY's ALSO
(the save's seed into rollTraits beside LIFE+CITY's traitsFor); CAMP TWO's camp tiers tall and wide when they land.
[bb Battle Brothers' marketplace buys every good it sells, under its price, and keeps what you sold where you can buy it back.]
[analog horror: the stall's strip reads like a till receipt, a green plus for what they pay, a red line when the food runs short.]
