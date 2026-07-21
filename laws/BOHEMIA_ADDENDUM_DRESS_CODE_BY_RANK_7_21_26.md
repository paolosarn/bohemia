# BOHEMIA ADDENDUM — DRESS CODE BY RANK (Paolo 7/21/26, LOCKED)

Paolo's ruling, two passes converging on one rule: "rookies of the faction
can wear whatever as long as half their body is a certain color... veteran
faction members actually have to wear most of the clothes we give them."

## THE LAW
- **ROOKIE**: a free draw off the whole canon wardrobe (identical to the
  unranked draw today), nudged only until at least 50% of BODY SURFACE
  AREA reads the faction's ruled color. The nudge only ever swaps to
  another CANON item already legal for that layer -- never invents a
  garment, never forces a color the wardrobe doesn't carry.
- **VETERAN**: every layer Paolo specifies in his kit is FORCED to one of
  his named canon garments (hashed pick if he lists options). Layers he
  didn't specify still draw free -- "most of what we give them," not a
  full costume snap. A free-drawn outer may never cover a kit-governed
  base (a stray coat cannot hide the identity his kit assigned); if he
  wants the outer locked too, he lists it and it's honored exactly like
  any other governed layer.
- Both tables (FACTION_COLOR, FACTION_VETERAN_KIT) ship EMPTY. Nothing
  here guesses which faction gets which color or which exact pieces a
  veteran wears -- that is his ruling alone, the same MECHANISM-MINE /
  CONTENTS-PAOLO'S split as every other table in this repo. An agent
  with no faction color or kit ruled dresses EXACTLY as before: zero
  regression to the existing LIFE population.

## "HALF THE BODY," DEFINED ONCE
Body-surface weights are derived from the same part-pixel geometry the
clothing structure gate already uses to prove garment shapes (head,
torso+neck, two legs, two feet). Torso 0.437, legs 0.322, head 0.161,
feet 0.080 -- sums to 1.0, so "half the body" means the same thing
everywhere it's ever asked. A coat or shirt covering the torso and legs
alone (0.759) already clears the bar; a rookie is never forced into
gear he doesn't need to represent.

## MACHINERY
`engine/bohemia_dress.js`: `rookieOutfit`, `veteranOutfit`,
`outfitForRanked` (the entry point `dressAll` now calls, keyed on an
optional `agent.rank`). `coverageFor` / `regionColor` / `colorDist` /
`matchesFamily` (95-unit RGB tolerance -- a color FAMILY, not a hex-exact
match, so "the faction's red" covers every red-family canon item, not one
specific hex). Gate: `gates/dress_gate.js`, 23 checks -- tables proven
empty, rank functions proven inert with no ruling, rookie coverage proven
>=50% across 40 seeds with a throwaway test color, an unmatchable color
proven to degrade to "legal but uncovered" rather than fabricate, veteran
kit proven forced every seed, unspecified layers proven still free, and
the no-stray-cover-up law proven both ways (silent when ungoverned,
honored when he explicitly locks the outer too).

## NEXT (his call, whenever)
Paolo rules `FACTION_COLOR[faction]` and `FACTION_VETERAN_KIT[faction]`
per faction; LIFE's population wears it the same session the tables land,
no engine changes required.
