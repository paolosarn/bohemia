# HIS COLOUR ANSWER WAS LOCKED IN A BROWSER
FACTIONS lane · VAMILY row `[colours fixed]` COLOUR-AUDIT · 9/6/26
Law: `laws/BOHEMIA_LAW_COLOUR_IS_TERRITORY_8_26_26.md`

## THE ONE LINE
Every faction already had a colour — he ruled it on 8/26 and answered it garment
by garment — and it existed **only as rendered pixels**. Three rows were stopped
on a number nothing outside the wardrobe could reach. It is measured, written
down, carried by the walked surface, and the map now paints each faction's ground
in it.

## WHAT WAS ACTUALLY WRONG
Not the colours. **The reachability.**

`faction_colour_gate` could get at a faction's colour by launching a browser,
dressing a body thirteen times and counting cloth pixels. Nothing in the game
could. The RGB ramps that `COBALT SNEAKERS` and `RUST BOOTS` resolve to live
inside `slices/BOHEMIA_ALPHA_0_9.html` and the city file carried **a grep count of
nought**. So:

- FACTIONS `[who holds]` drew its territory borders in a two-colour language
  (yours / theirs) because there was no hue to use — and said so in the code.
- UI `[owner shown]` wants *"the owner of every district in its colour"* — blocked
  on the board.
- COOK `[border marked]` wants the edge painted *"in the holder's colour, on the
  wall, the fence, the underpass"* — blocked on the board.

## WHAT SHIPPED, AND IT TAKES NO COLOUR DECISION
`tools/bohemia_faction_colour.js` runs the gate's own measurement on his own
shipped wardrobe and writes the answer to `engine/BOHEMIA_faction_colours.json`,
then inlines it into the city beside the faction graph. Every number in it is a
**measurement of a garment he chose**. Re-dress a faction and the number moves
with it.

COLOUR IS TERRITORY is explicit: *"which faction owns which hue is HIS."* Nothing
here picks one. All that changed is that his answer is no longer locked inside a
browser.

| faction | hue | hex | strength | share |
|---|---|---|---|---|
| Blues | 210 | `#2d5fb3` | 0.72 | 94% |
| Colorful | 90 | `#60a136` | 0.64 | 57% |
| Mob | 0 | `#572f2a` | 0.60 | 53% |
| Reds | 0 | `#773229` | 0.56 | 78% |
| Church | 30 | `#826c3e` | 0.49 | 45% |
| Anarchists | 30 | `#573f2a` | 0.48 | 90% |
| Caravans | 30 | `#6c5b41` | 0.33 | 67% |
| Remnants | 60 | `#4c5238` | 0.32 | 46% |
| Network | 210 | `#465362` | 0.31 | 62% |
| Homeless | drab | `#968b82` | 0.31 | 44% |
| Trades | 150 | `#496558` | 0.30 | 48% |
| Cartel | drab | `#434042` | 0.27 | 39% |
| Volunteers | drab | `#c1bdb5` | 0.17 | 69% |

**Thirteen, not fourteen.** `Custom` — the player's own faction — has no
`FACTION_LOOKS` entry, because its identity is meant to emerge from three
generations of play. On the map it keeps the "that one is mine" ink.

### The map wears it
The territory border drawn last round in two colours now uses the holder's own.
The **hue is untouched** — that is the part that is his; only value and saturation
are lifted, because the measured average is the colour of *cloth*, dyed to be worn
in daylight, and the Mob's `#572f2a` is nearly black against a night overmap. A
drab faction keeps the map's gold, because a border painted in their average grey
would be invisible — which is the law's own exemption, not a shortcut.

Measured on a real canvas rather than grepped for: **14 factions' ground painted
in 11 distinct inks.** Blues `#0052db`, Reds `#db1900`, Colorful `#56db00`,
Trades `#4ddb99`.

## THE AUDIT, AND WHY I FIXED ALMOST NONE OF IT
The row says *"the gate holds contradictions, this row fixes them."* The law says
what I am allowed to touch: *"What the machine may fix without him is a
CONTRADICTION — a faction named COLORFUL dressed in bone, a faction named BLUES
dressed in red. 'The Mob should own charcoal' is TASTE, and it waits for his
thumb."*

**Four clashes exist**, two factions sharing a dominant hue:

    hue  30   Caravans / Anarchists / Church
    hue 210   Blues / Network
    hue   0   Reds / Mob

**And not one of them is between two factions his canon puts in any relation at
all.** Measured against his graph: every clashing pair is `none`. That matters,
because the law's own research is that colour choice is *oppositional* — the
Bloods took red deliberately against the Crips' blue — so two **enemies** in one
hue is a lie about his graph, and two strangers in one hue is a coincidence. His
authored pairs (Remnants/Cartel permanent-war, Cartel/Caravans prey-tax,
Reds/Network adjacent, Mob/Remnants respect) are all clear.

So no clash is urgent, and **who moves and to what is taste**. It waits.

Test 4 already resolves the two that would matter most if he ever does move them:
**Blues owns 210 and Reds owns 0 by name**, so it is Network and Mob squatting,
not the other way round.

### The one thing I did fix
`PINNED_CLASH` was 5 and the true count is 4. The gate has been printing *"FEWER
CLASHES THAN THE PIN. Lower PINNED_CLASH to 4 so it cannot slide back"* and nobody
had. A ratchet that has slipped is not a ratchet. It is 4.

### And the one I found and did NOT fix
**The gate's drab exemption names three factions and the law names two.**

> Law: *"Drab is legal, but only when drabness IS the statement (the Volunteers,
> the Homeless)."*
> Gate: `DRAB_ON_PURPOSE = { Volunteers, Homeless, Cartel }`

The Cartel was added to the list and not to the law, and the law's stated reason —
*"the Volunteers own nothing and the Homeless bought nothing"* — does not describe
a faction whose note is *"organized human predation. Supply chains mirror Caravan
routes."* It owns plenty.

But *a predator not advertising* is a real reading too, and a good one. So this is
taste, not a contradiction, and the honest move is to **name it out loud every
run** instead of leaving it sitting silently inside an exemption as though the law
had authorized it. The gate prints it and asserts the list cannot quietly grow
while it waits for him.

## THE THING THIS MAKES POSSIBLE
The clashes are now **visible instead of documented**. On the map the Mob's ground
is `#db1800` and the Reds' is `#db1900`; the Network's is `#4a8ddb` and the Blues'
is `#0052db`. He can look at the valley and see two factions wearing each other's
colour, which is a far better way to get a ruling than a paragraph asking for one.

## GATES
`faction_colour_gate` 17/0, up from 9/0 — the ratchet tightened to 4, the
published number re-measured against the render every run so it cannot rot, the
walked surface proved to carry the same numbers, the clash-versus-relations audit,
and a real canvas checked for what it actually painted rather than grepped for the
function name.

## [PENDING Paolo]
1. **Four colour clashes.** Nobody is at war over them, so nothing is urgent. If
   he wants them apart: Blues owns blue and Reds owns red by name, so Network and
   Mob are the ones that move, and hue 30 has three sitting on it.
2. **Is the Cartel drab on purpose?** The law names two drab factions and the gate
   carries three.
