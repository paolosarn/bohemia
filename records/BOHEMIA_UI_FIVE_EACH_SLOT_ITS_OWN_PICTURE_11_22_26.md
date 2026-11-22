# UI FIVE -- EACH SLOT ITS OWN PICTURE (11/22/26; VAMILY rule 474, ask row 714)

PAOLO 11/22: 'when I buy something from any shop, especially when it's weapons and armor, if I buy that one item then the UI of the
slots gets fucked up. The icon will be the icon for something else, like the list doesn't get fixed... if I buy the most expensive
item and there's something else I wanna buy that's the second most expensive item, it will still have the icon of that first item...
it's just so strange'.

## THE CAUSE, MEASURED

A shop slot is built fresh on every change (slices/BOHEMIA_SETTLEMENT_SCREEN.html iconTile/shopTile): each tile is made from its own
piece and carries it (tile.__it), and a weapon (or a trade good) gets its pack tile or its own model there. Armour has no pack tile,
so its picture is laid on afterwards by the materials' shop painter (slices/bohemia_ui_materials.js, 10/11). That painter took slot i
as THE i-TH PIECE OF THE SHOP'S RAW LIST (S.stock[open] for the shelf, S.stash for the bag). True when it was written; false since:
- the shelf stands dearest first (rule 452, __DEAREST_FIRST__) and keeps a bought piece's place EMPTY for the visit (shelfView), and
- the bag stands dearest first by what it fetches.
So pictures sat on the wrong pieces, and after a buy the raw list was one shorter while the shelf kept its gap: every drawn picture
after the gap slid one slot, and the empty place wore the next piece's picture (the 'ghost' he saw: the dearest one's place, and the
second dearest wearing a picture that was not its own). The weapons he named wore their own pack tiles, but the painter could still
lay a drawn icon of another piece on any weapon without a pack tile; the rule names weapons, armour, the stall, the shelves, the hall:
the stall's goods and gear rows and the hall's men draw nothing by place, so the two grids were the whole of it.

MEASURED WITH THE OLD PAINTER PUT BACK (the gate's plant, the demo upright, Caravans): 60 slots wearing another piece's picture across
the walk, e.g. 'shelfgrid[0] adorned_closed_flat_top wears the drawn reinforced_leather_armor' as he walks in, and 'shelfgrid[0] an
empty place wears the drawn reinforced_leather_armor' after the first buy.

## THE FIX, AT THE ROOT

slices/bohemia_ui_materials.js __EACH_SLOT_ITS_OWN_PICTURE__: every slot is drawn from ITS OWN piece (the tile's __it), never from its
place in a list; an empty place draws nothing and loses any picture it had; a drawn icon of another piece is taken off; a slot with its
pack tile keeps it and wears no drawn icon. Since every change (a buy, a sell, a re-sort, a restock) rebuilds the tiles from the
shop's own order, each slot always paints its own piece. slices/BOHEMIA_SETTLEMENT_SCREEN.html iconTile: every pack tile or own model
now carries its piece's id (data-id), so a picture always says whose it is (the check reads it; the town screen's script is closed, so
the check cannot ask its icon chooser). The quality frame (bohemia_ui_three_items.js pieceOf) already read the tile's own piece.

## PROOF (rule 441: the page he plays, the way he gets there, a phone upright and sideways)

GATE EACH SLOT ITS OWN PICTURE (gates/each_slot_its_own_picture_gate.js, new, in the suite): the demo and the alpha, upright and on its
side, the map's own door into Caravans, its ARMOURER and its SMITH, money enough to buy several: S1 as he walks in every slot of THEIR
SHELF and YOUR BAG wears its own piece's picture and name (10 armour, 11 weapons); S2 he buys the dearest and then each next with a
double tap (the armourer: adorned_closed_flat_top, assassin_s_robe, decayed_closed_flat_top_with_mail; the smith: pump_shotgun,
longsword, rusty_warblade), every slot the same after every buy; S3 he sells one back, the same; S4 nothing threw. PLANT (the demo
upright, the service worker off so the route reaches the town's frame): the painter by place put back: 60 wrong.
ON THE WAY, A FAULT IN THE CHECK, NOT THE GAME: on the alpha on its side the town is a frame inside the city's frame inside the
workshop's page, and adding the frames' boxes by hand put the finger 44 px above the slot (on the keeper's line), so nothing was bought;
the check now asks the browser for the slot's own box. On the same page a real finger lights and buys the slot.

A CHECKER THAT AGREED WITH THE BUG, RE-AIMED: gates/every_item_has_an_icon_gate.js read 'shelf slot i is stock[k][i], bag slot i is
stash[i]', the painter's own wrong mapping, so it was green over the bug and went red on the fix ('the same item always draws the same
picture'): it now reads each slot against the piece it holds. Its buy leg (red on main: 'WHAT YOU BUY LANDS IN THE BAG', an empty bag)
took the dearest piece, which costs more than the 900 it hands over, and pressed 'Buy it', which since rule 210 puts a wearable piece on a
man: it now buys the cheapest piece with the shop's own 'to the stash'. EVERY ITEM HAS AN ICON 10/0 (main 9/1). RED ON MAIN, NOT THIS
BUILD'S: EQUIP FROM THE STASH 6/1 (the crew door's DONE), THE VOTE TAB 5 (other lanes' cards, the alpha's landing). EVERY SHOP DEAREST
FIRST, THE ITEM CARD AND THE ITEM BOX, THE SHOP KEEPS ITS ARMOUR: green.

VOTE ui5-each-slot-its-own-picture-11-22 (STAND-IN): the armourer after one buy, the old painter on top (the ghost in the bought place,
the next pieces wearing their neighbours' pictures), now below. Made by tools/bohemia_ui_five_each_slot_its_own_picture_card.js and .py.

[bb Battle Brothers' market grid: every cell is drawn from the item in it, so a sale never leaves a picture behind]
[analog horror: a pawn shop's shelf where the price tags stay put after the goods are sold, and the next thing slides under the wrong tag]
