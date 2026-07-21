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

## SECOND PASS (7/21, same day): THREE MODES, SIX FACTIONS RULED
Paolo went further, live, faction by faction: "the reds can be the
brightest red possible and cartel can be the darkest red possible, maroon
vibes... the colorful will be fun, they can have a rainbow colorway...
not even a single color, like rainbow literally... just have the church's
gold different than the mob's gold... for the mob I'd like to see gold
STRIPES rather than all gold... for all the factions, just make it
realistic, not everyone is gonna have a long shirt of the single color."

Four things followed from that one paragraph:

1. **Three LOOK modes**, not one. `FACTION_LOOK[faction]` is now
   `{mode:'family',color}` (a color family, his exact hex), `{mode:'stripe',
   color}` (same coverage math, but the torso garment must ALSO carry a
   striped pattern -- MOB's ask), or `{mode:'rainbow'}` (no color at all --
   COLORFUL's ask). `FACTION_COLOR` still works as family-mode shorthand;
   nothing built on the first pass broke.
2. **Realism order, not weight order.** "Not everyone is gonna have a long
   shirt of the single color" reads as: a real outfit states its identity
   with ONE piece plus a small tell (a colored boot, a colored cap), not
   matching separates. The nudge order changed from heaviest-first to
   `torso, feet, head, legs` -- legs (a second full garment) is the LAST
   resort, tried only if nothing small carries the color.
3. **No stray cover-up, generalized.** The same bug the veteran kit caught
   turned up here too: forcing `base` to the right color did nothing if a
   random `outer` was already covering the torso, and forcing `face`
   (a bandana) did nothing if a random `head` hat was already covering that
   region. Both branches now clear the layer they're overriding.
4. **The wardrobe had gaps his asks exposed.** "Brightest red possible" and
   a gold distinct from the mob's didn't exist in the muted 187-item
   corpus. Worse: the ENTIRE wardrobe carried zero real blue, green,
   purple, or yellow -- every "vivid" item was the same red-brown family,
   making a literal rainbow impossible without inventing colors first. Nine
   colorway garments cooked this same turn (zero new geometry, existing
   generators only): SIGNAL RED SHIRT + BOOTS, VESTMENT GOLD SHIRT + BOOTS,
   MOB PINSTRIPE SHIRT, MOSS GREEN SHIRT, TEAL WORK SHIRT, COBALT WORK
   PANTS, ROSE BANDANA. (A violet sash and a first magenta pick were both
   cut mid-build: PURPLE RESERVATION's r+b-over-g test caught them --
   purple-family reads as purple even off pure-hue, and the law holds even
   for a "rainbow." The rose replacing magenta clears it.)

**Six factions ruled, real content, gate-locked:**
REDS family `#dc2820` (the brightest red the corpus can now carry) / CARTEL
family `#5c302a` (the existing OXBLOOD ramp -- already worn by 6+ items,
no new cook needed) / CHURCH family `#ffd75c` / MOB stripe `#b08a2a`
(existing MUSTARD ramp) / CARAVANS family `#caa05a` (unchanged, his call --
blends with the desert on purpose) / COLORFUL rainbow (no color).
REDS-vs-CARTEL and CHURCH-vs-MOB are both gate-asserted >=95 RGB units
apart -- his two named collisions can never silently regress. All five
family/stripe factions gate-proven to clear >=50% coverage across 60 seeds
each; MOB lands an actual striped torso ~90% of the time; COLORFUL never
drops below 3 distinct vivid hues across 60 seeds.

**The other 7 factions (BLUES, ANARCHISTS, NETWORK, TRADES, VOLUNTEERS,
REMNANTS, HOMELESS) stay UNRULED.** Reviewing the full 13-faction color set
turned up real collisions among them (several cluster in the same
tan/rust/olive family within the same 95-unit tolerance that separates
REDS from CARTEL) -- flagged back to Paolo rather than silently baked, per
"we'll go over it together."

**A known limitation, flagged not hidden:** CARTEL's dark-maroon matching
is honest about coverage math but not perfectly hue-pure -- at very low
lightness, plain RGB distance can't fully distinguish "dark red" from
"dark anything," so a CARTEL rookie's matched pieces read as consistently
DARK more reliably than consistently RED-hued. A hue-aware distance
metric (weight hue error more at low lightness) would tighten this; parked
as a possible upgrade, not blocking today's ship.

## NEXT (his call, whenever)
Rule the remaining 7 factions (color collisions above need resolving
first); rule `FACTION_VETERAN_KIT` per faction so veterans wear real
named garments; LIFE's population wears every ruling the same turn it
lands, no engine changes required.
