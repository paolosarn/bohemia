# ADDENDUM — AN ICON SHIPS WITH EVERY BUILD (Paolo 7/27/26, LOCKED)

## HIS WORDS, VERBATIM

> "And anytime you build something like this you have to make a city builder icon
> as well like for real"

Said immediately after the WORLD lane shipped the railway and the interchange: two
new pieces of ground with full tile generators, full dossiers, and two new machine
gates — and not one thing you could point at in the city builder.

## THE LAW

**A district or surface is not finished until it has a CITY BUILDER ICON.** The tile
grid is what you stand on. The icon is what Paolo *picks up*. Shipping the first
without the second ships half a thing, and the half that is missing is the half he
actually touches, because the city builder is a builder: you choose a district from
a palette and you place it. A type with no icon cannot be chosen.

"like for real" is the operative clause. It is not satisfied by:

- a coloured square, a letter, or the district's initial
- reusing the map-tab cell colour and calling it an icon
- a downscaled screenshot of the tile grid (a 128x128 plot shrunk to 48px is mush,
  not a symbol — the whole point of an icon is that it reads at a glance)
- a placeholder with a TODO
- "the icon is the next item on the backlog"

It is satisfied by a real drawn symbol that reads instantly at icon size and says
what the thing IS.

## SCOPE

Every type that a player could place or select in the city builder. That is every
DISTGEN auto-factory district and every SURFACEGEN surface. It applies **the same
turn the ground ships**, not as a follow-up item — the whole reason for this
addendum is that "I will do the icon later" is what produced the gap.

## THE BACKFILL

The lane owes icons for everything it already shipped without one. That debt is
real and is tracked in BOHEMIA_BACKLOG.md until it is zero.

## THE GATE

A law without a machine gate is not enforced (7/16, proven). `icon_gate.js`:
every registered district and surface type resolves to an icon; the icon is real
art and not a flat fill; it obeys the visual constitution; and a new type
registered without one turns the gate red the same turn it lands.

## WHY HE IS RIGHT, IN THE PROJECT'S OWN TERMS

This is the FACTORY LAW applied to the thing that was quietly exempt from it. Every
system here is supposed to be a mass-production factory: typed spec, generator,
batch output, kill/approve pipeline, its own regression gate. The district tile
generators have all five. The icons had none of it, so they simply did not get
made, forty-four types deep, and nobody noticed because no gate was looking.

It is also the REUSE-FIRST law's precondition. He ruled 7/22 that a tool checks the
approved banks before cooking new pixels. An icon set that does not exist cannot be
reused, so every surface that wants a symbol invents one — which is exactly the
"two art styles meeting" failure the interchange module was written to avoid.

And it is the same complaint as STOP PRODUCING, from the other side. That law is
about not surfacing things he did not ask for. This one is about not withholding
the one thing he needs to actually use what was built.

## RELATED

- laws/BOHEMIA_ADDENDUM_WORLD_BEFORE_QUESTS_7_26_26.md — build ground, not plumbing
- laws/BOHEMIA_ADDENDUM_REUSE_FIRST_LOCKED_7_22_26.md — check the banks before cooking
- records/target/BOHEMIA_VISUAL_CONSTITUTION.json — the palette and value bands
- laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md — a word from him is a ruling, recorded
  the same turn
- laws/BOHEMIA_ADDENDUM_DEATH_MATH_AND_ICONS_7_5_26.md — the 7/5 icon canon is about
  named MAP LANDMARKS (the Welcome sign, the Strat, the Luxor beam, Red Rock) and is a
  DIFFERENT set, still [PENDING Paolo]. This addendum is the district/surface palette
  and does not touch those four.
