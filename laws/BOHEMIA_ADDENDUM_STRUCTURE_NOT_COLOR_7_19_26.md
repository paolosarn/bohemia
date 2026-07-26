# BOHEMIA ADDENDUM — STRUCTURE-NOT-COLOR LAW (Paolo 7/19/26, LOCKED)

## The ruling (his words, deciphered)
"I approved the alternate colorways -- for the color scheme established for the
game there's no issue -- but that's not really what I want to see. STOP just
putting different colors on things and saying you're making progress. I need to
see ACTUAL DIFFERENT CLOTHES, not just different colorways."

## The law
1. COLORWAYS ARE LEGAL BUT THEY ARE NEVER PROGRESS. A recolor of an approved
   structure may ship as filler volume, but it must never be presented as the
   work of a turn, and never counted as advancing the wardrobe.
2. PROGRESS = NEW STRUCTURES. A clothing turn's headline is a garment SHAPE
   that did not exist before: new geometry, new silhouette, new body coverage,
   new category. If the diff only changes which ramp a gen receives, it is not
   clothing progress.
3. Every new structure ships with machine teeth, same turn (FACTORY LAW):
   gates/structure_gate.js locks each new shape's geometry so it can never
   silently degrade into a recolor of an existing structure.

## Born under this law (cook batch 15, same turn as the ruling)
- JACKET (genCoat jacket:true): waist-length open outer with a ribbed hem band.
  Not a short coat -- no skirt, stops at the waist, sleeves on, open front.
- PONCHO (genPoncho, a NEW GARMENT CLASS): one diamond of fabric draped from
  the shoulder line, wider than the body, fringed hem below the waist, neck
  wrapped, head/face never touched, radiating front folds, 45-degree sky-lit
  flank.
- TALL BOOTS (genShoes shaft:'tall'): the leather climbs ~6 rows of shin with
  a fold-over cuff. Regular shoes stay at the ankle.
- ROLLED SLEEVES (genTop sleeves:'rolled'): a real third sleeve length, cut
  mid-forearm with a light rolled bulge. short < rolled < long, machine-checked.
- GEAR (genGear, a NEW CATEGORY): scavenger equipment worn over clothes --
  kneepads (knee band only), scrap pauldron (one shoulder + torso lip),
  chest rig (diagonal strap + pouches, torso only). Zone-locked like
  accessories.

## Post-mortem, same turn (VERIFY ON THE REAL SURFACE paid again)
- The tall boots rendered BLANK from the east: cloth palettes carry no
  .sole/.mid2, the undefined color detonated the frame only when the
  deterministic wear pass landed on a sole pixel -- probabilistic per facing,
  so the front looked fine and the profile died. genShoes now falls back
  (sole->dk, mid2->dimmed mid). The six colorway shoes carried the same
  latent bomb; all verified in all 8 facings after the fix.
- The poncho's first cut started narrow at the top and the under-shirt's
  shoulders poked out like backpack straps. The drape now covers the
  shoulders from its first row.

## Standing consequence
The wardrobe roadmap reads structures-first from here: new shapes lead every
clothing turn (aprons, skirts/wraps, bags/backpacks, hood-up variants, tattered
hems, suspenders are open structure territory). Colorway waves only ever ride
behind them as quiet filler, never as the headline.
