# COOK [the armour's art] (rule 272(b)(d)): THE POLICE RIOT HELMET AND THE POLICE VEST FIRST, AND EVERY PIECE THROUGH THE REAL RIG
# SHIPPED 10/26 79250901, BUILT, NOT YET SEEN (rule 179)

## THE ASK
Rule 272, Paolo 10/26: 'the weapons and the shield show, but the good armour I have on me doesn't show, like a police helmet... I know
it's a lot of placeholder, we're gonna have to cook up so much art... it's not visually shown.' (b): each named piece its own art over
the rounds; (d) COOK [the armour's art], the police riot helmet first. CHARACTER's NOTE: 'Your real art drops in file for file:
slices/wear/wear.json pieces[<class or class+extra>] = {S..SW, drop, portrait: [x, y, w, h, dx, dy]} on wear.webp / wear_face.webp...
Render each through the master rig at ppm 57 with his head as a holdout... The police riot helmet and the police vest first (his words).'

## MEASURED FIRST
CHARACTER drew every helmet and body armour as one of 17 placeholder classes (and their extras: 27 pieces) with a small numpy ray
marcher over signed distances, 'the rig's recipe run by a small ray marcher, not DIRECTION's master rig in Blender: a placeholder, said
so on every card'. No bounce light, no source pass in the surface (the grime, dust, drift and grain), no family snap.

## WHAT IS BUILT
tools/bohemia_cook_the_armour_through_the_rig_10_26_26.py (Blender's Python) and tools/bohemia_cook_surface_nets.py:
- THE SAME SHAPES: every piece is CHARACTER's own (head_parts, body_parts, imported, never redrawn), turned into a mesh by surface
  nets (half a pixel a cell; watertight, every face out), its paint read at each vertex from CHARACTER's own patterns (the vest's
  band, the moto helmet's stripe, the car door's rust and window, the mail's links).
- THE REAL RIG: rendered in Blender with the master rig's own light and film and its SOURCE PASS (tools/bohemia_direction_master_rig.py
  light_and_film, source_pass), the guide's camera (orthographic, 45 degrees, facing north) on the rig's stretched space at 57 px a
  metre, the eight facings the fight draws; a helmet also knocked off on the ground and at portrait size (tilt 80, three times the
  pixels). His head, neck and trunk are HOLDOUTS (CHARACTER's proxies), so his own pixels show where the piece does not cover him.
  Then the rig's post on every picture: the hard alpha, the family snap (prop), the ring.
- THE VISOR IS GLASS: a see-through part is rendered as its own mask and laid as smoked polycarbonate at partial alpha over his face,
  the sky in its top; where it crosses the shell it tints it.
- THE POLICE RIOT HELMET'S OWN ART: two vent ribs over the crown, the visor's pivot bolts bright on their bosses, a lift tab at the
  shield's foot, the chin strap's run under the jaw (a real riot helmet: a black shell, a clear visor on side pivots with a lift tab,
  a neck curtain, vent ribs).
- THE POLICE VEST'S OWN ART: three webbing rows (MOLLE) across the front, a radio pouch high on the left chest with its stub aerial,
  the shoulder straps' buckles; the pale POLICE band kept front and back (a patrol plate carrier).
- wear.webp, wear_face.webp and wear.json in CHARACTER's own format (its packer's code, the same anchors and keys): the game
  (engine/bohemia_wear.js) draws them with nothing changed.

## MEASURED
- 27 pieces (11 head classes, 6 body classes and their extras: chain, closed chain, spike, horns), 1.28 million faces meshed
  from CHARACTER's distances (the riot helmet 65,592 with its own art, the police vest 34,460), each 8 facings, the helmets also
  dropped and at portrait size: wear.webp 512 x 605 (160 kB), wear_face.webp 512 x 435; a few seconds a piece on the CPU.
- Every facing sits where CHARACTER's placeholder put it: the worst middle 2.5 px off (the riot helmet's new chin strap). Every
  piece's fullest view 114 colours or more (the dust mask, a small cloth); the police pair a few hundred each.
- THE GLASS: the riot visor shows his face through smoked polycarbonate, 33 see-through pixels in the front facing and 1,218 in
  the portrait; the welder's lens stays solid.
- THE DUST: at the rig's full share every dome came out the dust's grey (the riot helmet a mid grey, the oxblood moto shell pink,
  the olive steel pot sage); armour takes 0.15 of it, the share the guide gives caps (the rig's own wear_by_material, as COOK's
  floor added the road's). The sun's bleach of upward faces is not in that share: the moto helmet's oxblood still fades to a rose
  on its crown, said plainly; the police pair read black.
- Gate THE ARMOUR THROUGH THE RIG 5/0.

## THE GATE
THE ARMOUR THROUGH THE RIG (gates/the_armour_through_the_rig_gate.py): file for file (every class and extra in use, eight facings, a
helmet's drop and portrait, every cell on its sheet with a body); made by the rig (no setting moved, 120 colours or more a facing); the
police pieces carry their own art; the riot visor is glass (partial alpha) and the welder's lens is not; the anchors hold.
CHARACTER's own gate THE ARMOUR HE WEARS SHOWS on the new sheets: THE ARMOUR HE WEARS SHOWS 18/0 on the new sheets (the crew card, the fight, the camp, the map and the portrait, phone and computer).

## SAID PLAINLY
- Where he sees it: every screen that draws a man in his gear: the CREW card, the FIGHT, the CAMP, the MAP, his portrait (the
  helmet). Put the police riot helmet and the police vest on a man in the shop to see them first.
- The other 25 pieces are CHARACTER's shapes through the real rig; each gets its own art the way the police two did, round by round.

## REFERENCE CHECK (the 9/4 standing duty)
A real police riot helmet (a black ABS shell, a clear polycarbonate visor on side pivots with a lift tab, a fabric neck curtain, vent
ribs over the crown) and a patrol plate carrier (navy or black, PALS/MOLLE webbing rows, a radio pouch high on the chest, a reflective
POLICE panel front and back). The twins: CHARACTER's placeholder sheet (the same shapes, side by side in records/target/cook_armour_rig/)
and the rig's man they sit on. No reference game.
