# THE THIRTEEN THROUGH THE RIG (CHARACTER, [the thirteen through the rig], 10/18/26)

Rule 115(a)(c): every character is MODELLED at the source and rendered through DIRECTION's master rig; CHARACTER models
the runway clothes ON the rig's body, never cut from flat art. His NO that started it, on [the texture set] (98500aa):
'the whole shit looked glitchy and fucked up'. Cutting the formula's flat garments into pieces is dead; this round the
thirteen gang looks and the body under them are 3D models, every garment a shape on the man's bones. Cook only (rule
100): nothing in slices/, engine/ or the demo; the old flat sprites stay in the game until a replacement passes VOTE.

## What was made
- tools/bohemia_character_the_thirteen_through_the_rig.py (bpy 4.2): one glTF per look built from the rig's man
  (reference/models/khronos/CesiumMan.glb, the body DIRECTION's rig renders and COOK THREE's thug stands on), then the
  sheet. Fourteen models: THE BODY (the man under every look) and the thirteen of FACTION_LOOKS, in its order, each
  wearing its own slots (base, outer, back, head, legs, feet, waist, hair).
- THE BODY BY THE LOOK'S DIALS: height becomes the real height handed to the rig (1.72 m x (1 + 0.05 x height), the
  ruler from [the body in meters]); shoulders widen the yoke, belly fills the torso, hips the seat. Vertices move, bones
  do not, so the skin keeps its weights.
- THE SKULL (COOK THREE's finding routed to this lane: 'the head is the test body's head mesh, a box'): the head pulled
  75% onto an egg, the jaw 18% narrower than the brow, by its weight on the head bone so the neck blends. The box head
  is gone from all fourteen.
- FITTED PIECES are the body's own skin lifted (COOK THREE's lift, generalised): faces picked by the BONE that owns them,
  not a box in space; coat bodies and sleeves, mantles, wide trousers, boots, caps, hair (combed grooves 1.6 cm apart,
  4 mm deep).
- HANGING PIECES are tubes cut to a pattern: rings round the body's own measured cross-section from the waist to the hem,
  a flare, the pattern's openings cut (the Reds duster open at the front with a split tail, the Trades split tail, the
  Anarchists' torn hem, the Remnants' asymmetric hem, a V at the neck that shows the shirt), weights blended from the
  hips onto each thigh by the side the cloth hangs on, so the skirt PARTS ROUND THE STRIDE. That is the trenchcoat action
  his 10/10 NO asked for, in geometry, and it reads from all eight facings (the sheet's eight-facings rows and the walk).
  Capes hang from the shoulders, never wider than them.
- HATS: the Caravans' rice farmer's cone (with its weave pressed in) and the Trades work cap's visor are solids on the
  head bone; knit, watch and skull caps are lifted skin with a folded brim.
- A STANDING POSE: an action 'Stand' on every model (legs at rest, upper arms swung down about 56 degrees off the rest
  pose's droop, elbows a little bent), so the still is a man standing, not caught mid-stride (COOK THREE's finding).
- THE COLOURS: the runway paint as the street wears it (records/cook3/thirteen_repainted.png, row AFTER, sampled per
  region), so the twin and the model wear the same cloth. Palette named in the caption (rule 114c).
- Models: records/character/rig/<look>.json (meshes, materials, real height). The .glb files (3.5 MB each, 49 MB for
  fourteen) are NOT committed: the build is deterministic and takes 5 s a look; rebuild with the tool.
- Renders: records/target/character/rig/<look>/ (eight stills, rig.json with the card; the walk in eight at six keys for
  Reds, Anarchists, Trades and Cartel).
- Sheet: records/target/character/CHARACTER_THE_THIRTEEN_THROUGH_THE_RIG.png: the fourteen standing at 1:1, his twin
  (the flat thirteen, halved to 1:1 from that sheet's 2x) under them, eight facings each, the walk of four coats.
- VOTE: character-the-thirteen-through-the-rig-10-18, a candidate (rule 108), redo of the texture set.

## The cycles (each read off the render)
1. Reds alone: the duster read as a duster from every side; but the head was the test body's box, the dark hair rendered
   as a grey felt lid, and the 'passing pose' was mid-stride on every facing. -> the skull, the Stand action.
2. All fourteen: Cartel's and Mob's capes stood out past the arms like wings from the front (the section included the
   arms); the Trades visor poked out of the skull as ears. -> cape measured off the torso, capped at the shoulders;
   visor smaller and further forward.
3. THE DUST ON A DARK HEAD, measured: the rig's source pass mixes every up-facing surface toward a pale dust (1.1 x wear
   x a noise mask, up to about 0.66 at wear 0.6), so a near-black crown (26,20,17) and a charcoal watch cap (54,52,54)
   rendered the same grey: every dark head looked old and a cap could not be told from hair. -> strand normals on dark
   head pieces (the stylised hair shading: custom normals tilted out from the skull's axis, z held under 0.5), the hair
   a dark brown (38,28,22). Dark hair now reads dark and the caps read as caps.
4. Under 0.35 the crowns went dark enough that the prop card read the light from below on three pale coats; held at 0.5.

## The card (skills/bohemia-pixel-art through the rig, the person class, the S still)
Body 0, Homeless 0, Colorful 1, Blues 1, Church 1, Reds 1, Cartel 1, Trades 1, Mob 1, Remnants 1, Caravans 2,
Anarchists 2, Network 2, Volunteers 2 out of 8; none BACK. The common OUT is value span (5th to 95th under 118): a look
in one coat colour is a narrow ramp; two pale coats also read 'light from below' because their hair is darker than their
skirt (a colour fact, not a light fact; see findings). The prop card (the rig's verdict line) puts two (Anarchists, Volunteers) at 3 of 8, all
by the colours row, which the rig page already measured a sprite cannot meet (a tile's count).

## Findings (routed; not this lane's files)
- TO DIRECTION (the master rig), SECOND LANE TO HIT IT: the up-face dust has no per-material weight. A dark accent on a
  head (COOK THREE's oxblood cap, every dark crown here) bleaches to grey. This lane worked round it in the MODEL (strand
  normals, a legitimate hair technique) without touching the rig; the real fix is a `bohemia_wear` weight per material.
- TO DIRECTION: the card's light row (top half minus bottom half) reads a dark-haired man in a pale coat as lit from
  below. For the person class it needs the light measured per material (the id pass exists) or within a surface.
- TO COOK THREE: the tool takes any skinned glTF body with CesiumMan's joint names; the skull and the Stand action are in
  it for the tiers to reuse (build(name) is data-driven: a look is one entry in LOOKS).
- His 9/23 'make sure shit doesn't clip into places it shouldn't': every garment is skinned to the same bones as the skin
  under it; the skirts' centre lines blend both thighs, so they stretch between the legs on the stride rather than clip.

## Next
The faces (PORTRAIT renders the HD face from the same model, rule 115c order); a real person body with hands (the
CesiumMan hands are mitts); the walk of every look; then the barber's cuts as sculpted hair on the skull.

REFERENCE CHECK: the twin is the game's own thirteen as last painted (records/cook3/thirteen_repainted.png, AFTER);
DIRECTION's rendered man; the card through skills/bohemia-pixel-art; the runway names; analog horror AH-01. No reference
game.
