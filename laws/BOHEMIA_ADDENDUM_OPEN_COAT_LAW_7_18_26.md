# BOHEMIA — OPEN-COAT LAW (7/18/26, Paolo, LOCKED)

## The law
If a garment is a **jacket or a trenchcoat (the OUTER / jacket layer)**, there
HAS to be a **middle part where you can see the clothes underneath it.** The coat
is worn OPEN down the front; the slit reveals the shirt (and the pants below it).

Paolo, verbatim: *"if it's a jacket or a trenchcoat there has to be a middle part
where you can see the clothes underneath it. I refuse to have you just make any
dogshit overalls."*

## Why it's right
A coat that covers everything reads as a onesie / overalls, not outerwear. Real
outerwear is a LAYER: you see the collar, the shirt at the chest, the belt, the
pants — the coat frames them. The open front is what makes it read as a jacket
worn over an outfit instead of a sack. It also makes the character legible: the
under-layer (faction color, salvage, whatever Paolo rules) stays visible.

## Mechanism (how it's built)
- **LAYERS.** Every garment declares a layer: `base` (shirts/tanks/henleys),
  `legs` (pants), `feet` (shoes), `outer` (coats/jackets). Draw order is
  base → legs → feet → outer.
- **The coat is OPEN.** `genCoat` builds two front flaps with an unpainted slit
  down the center (below the collar), through torso AND skirt. The collar stays
  closed; the flaps get dark inner edges (lapels).
- **The slit reveals a real outfit.** `previewGen` composes an under-outfit
  (shirt over pants) beneath any `outer` garment, so the slit shows actual
  clothes, not skin or background. In game this is whatever base layers the
  character is wearing.
- **The coat still drapes** (OPEN-COAT does not repeal the v2 drape): one A-line
  panel from the hips to the ankle, filling the gap between the legs via the
  additive buildFrame preview hook.
- **FRONT-FACING ONLY** (Paolo 7/18, same law): the open slit shows only when you
  FACE the front (S / SE / SW). From the side or back (E / W / N / NE / NW) a
  trenchcoat is a SOLID silhouette — a slit running down a profile is wrong. The
  gen reads the render facing (`curDir`) and closes the coat for non-front views.

## The gate (a law without a machine gate is not enforced)
`gates/open_coat_gate.js` (wired into `bohemia_gates.py`, always-run). It does not
trust the comment: it extracts the REAL `genCoat` + its pure helpers from the
alpha, runs it on a synthetic body, and asserts the coat renders as a **left
flap + right flap with an OPEN, unpainted center slit** (clothes show through).
It also asserts every `layer:'outer'` garment routes through `genCoat` and that
`previewGen` composes an under-outfit for outer. Close the coat → gate goes red.

## Graveyard
The v1 (closed, mid-thigh "shorts") and v2 (closed, full-drape) coats are
graveyard-final. This law governs every coat/jacket cooked from here on.
