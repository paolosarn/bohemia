# UI [item icons]: EVERY ITEM IS AN ICON (10/5/26, ui-kmqmrf)

Paolo 10/5 (rule 76): 'a standardized way where you buy things and they end up in your inventory, like in Battle
Brothers there's inventory space with icons'. The row: one icon per item, drawn in the materials, 44 pt in the bag
and on a man's slots, the same icon on the market's card; a gate that every item id has one.

BUILT in slices/bohemia_ui_materials.js:
- itemIcon(item, cssPx): 310 icons, one per row of weapons.json (126) and armor.json body (78), head (87), shields
  (19). Drawn on a 22x22 pixel grid at 6x (132 device px = 44 pt), cut by hand per OBJECT, the 23 things the
  market calls them in our world (pistol, shotgun, rifle, pipe, sledge, bottles, machete, fire axe, rebar spear,
  cleaver, chain, pole hook, compound bow; work jacket, padded vest, plate carrier, full riot armour; rag hood, hard
  hat, riot helmet, full riot helm; car door, riot shield). Lit where the top-left is open, shadowed where the
  bottom-right is, a hard dark outline. THIS item by its own id: the handle's material, a pixel longer or shorter,
  where the tape wraps and the rust took, a chip, scratches, a tint; the quality decides the wear (beat-up rusts and
  gets taped, good gets one glint). Loud and crude on purpose; nothing shines but the glint.
- itemFromRow(kind, row, all): the item made from a data row, mirroring RUN TWO's names word for word.
- RUN TWO's [the inventory] (5ba404c) landed mid-round: the shop is THEIR SHELF and YOUR BAG, 36 slots, each with a
  placeholder mark. Every slot now wears its item's drawn icon (30 pt, so the short name and price still fit),
  matched by position through RUN TWO's own API (BohemiaSettlement.state); RUN TWO's file untouched; the slots
  dressed as glass cells and cardboard pockets.

MEASURED: gates/every_item_has_an_icon_gate.js 10/0 (a real buy lands in the bag wearing the same icon): 310 of 310 drawn, outlined, 132 px, 310 distinct, 23 objects;
names agree with the market's on 272 different items stocked across 36 places of every size; every smith and
armourer line wears the icon of the object its name says, the same picture every time. FOUND ON THE WAY: my first
naming mirror drifted from RUN TWO's in two places (no article on 'full riot armour'; a one-item class ranks
beat-up, not solid), and lines with the same name ('beat-up bottles' twice) drew the wrong item's icon until the
match went by shelf order. Five mutations caught (see the commit).

NOT DONE: the bag itself and a man's slots (RUN TWO [the inventory]); icons for our own items beyond the data files
(none exist yet); traits (no trait list).
