# THE WATER STILL RUNS
FACTIONS lane · [horror signs] round two · rule 22 (cook every round) · 9/21/26

## THE ONE LINE
**One crew holds one hundred percent of the running water in this valley and nothing has
ever told the player.** The game has computed that every night since 9/13. This round made
the sign that says it, and the sign is the valley's water authority: still lit, still
reporting, correctly, to nobody.

Nothing went to the demo or the alpha's play tabs. Rule 18(b) holds; rule 22(b) says the
making does not.

## MEASURED FIRST, AND THE HANDED-DOWN PREMISE WAS HALF WRONG
The row came down from ECONOMY Q47 as: *one faction holds 100% of the valley's running
water, and it is Remnants, Homeless or Church, never Mob or Cartel; 40% of valleys boot
dry.* Rule 12 says a dependency is a premise, not a gate, so it got driven before it got
drawn. One boot of the one driver, the real demo:

| what | where | power | whose wire |
|---|---|---|---|
| reservoir | 60,10 | dead | Network |
| reservoir | 10,29 | dead | Mob |
| reservoir | 87,60 | dead | Remnants |
| **pump station** | 24,75 | **ON** | **Anarchists** |
| **treatment plant** | 19,80 | **ON** | **Anarchists** |
| **treatment plant** | 20,80 | **ON** | **Anarchists** |

**The 100% half is TRUE. The named-faction half is wrong.** It is ANARCHISTS, on all three
live stations. The three factions the row named hold only dead reservoirs, which is the
prettiest possible way to be wrong: they own water that does not move.

And the game already has the sentence. `BohemiaPumps.say()` returns *"The pumps are
running. ANARCHISTS hold the water."* right now, on the shipped build. **No surface has
ever shown it.**

## WHY THIS IS THE RIGHT SECOND SIGN
Round one drew six shops. A shop closing is sad. **A water authority closing is the end of
a city**, and Las Vegas only exists because water is lifted 987.5 feet out of Lake Mead by
pumps that need power. That physics is already in the engine, measured, not invented.

So this is the one sign in the valley that is about whether anyone lives here at all, and
the only one whose colour band has teeth: the crew on that band can turn off your water.

It is also not decoration. `pumpStations()` in the city already asks the power grid and the
turf map which crew feeds each plant, on the rule *whoever can switch it off owns it* —
the same reading `[lights bill]` makes about a bill. The sign draws an answer the game
works out; it does not invent one.

## THE SHAPE IS DELIBERATELY NOT ROUND ONE'S
A shop builds a pole sign. A public agency builds a **monument**: low, wide, masonry
plinth, metal cabinet, and a **status panel** in the middle — the kind that reads STAGE 2
WATER RESTRICTIONS at a real water district.

Ours is still wired to the pumps and still reporting. That is the tone without a costume:
**the agency is gone and its sign is still doing its job.** Nothing is on the lens, nothing
is a filter, nothing darkens. The wrong thing in the ordinary frame is that it still works.

Two silhouettes in the set means you can tell a shop from an institution at a distance
without reading a word.

## FOUR STATES, EVERY ONE REAL
1. **The pumps are running, Anarchists hold the water** — the actual valley.
2. **Every pump is dark** — the 40%-boot-dry case; the module's own `say()` covers it.
3. **Nobody holds it yet** — the agency's own PUBLIC WORKS seal still bolted on.
4. **A grey crew holds it** — round one's answer carried forward.

## THE TWO FAULTS, BOTH FOUND BY LOOKING
**1. The crew's colour was the smallest and most occluded thing in the picture.** It shipped
as a 6 px band on the cabinet with the plinth hiding half of it. COLOUR IS TERRITORY, so the
territory cannot be the part you notice last — that is the law inverted. It is a **bolted
plaque on the plinth** now, which is also what is really on an agency monument: the seal,
bolted, replaceable. That fixed a second thing for free: a painted stripe on concrete cannot
be "taken down", and a plaque can, so the grey crews' answer is now physically true here too.

**2. The dead panel's words vanished.** NO SERVICE was mixed into its own panel and
disappeared. It feels moody and it breaks the rule this whole thing stands on: analog horror
is **not an excuse to darken**, and an unlit sign is still legible in daylight. A dead
acrylic panel in the sun is dark letters on a dull face, not a blank. **The horror is the
message, not the exposure.**

## THE KIT
`slices/bohemia_sign_kit.js`. Round one's drawing parts pulled out so a second *kind* of
sign costs a page instead of a rewrite: the two type faces, the colour mixer, the
three-quarter box, the diamond ground, the hardpan.

It carries the laws in its own comments so a later sign cannot lose them by accident: the
45 DEGREE ART LAW (every solid has a front, a sky-lit top and a turned-away side; the ground
is a diamond), the readable type (round one shipped SUNRAY **H**OTEL and VACA**H**CY before
the name face went to 5x7 and the small face gave M, N and W a fourth column), never true
black.

**Round one's page is untouched on purpose.** It is already registered and he may be looking
at it; editing a registered item to pull in a new dependency risks breaking the thing he is
judging. Everything from here reads the kit.

## A CONVERGENCE WORTH WRITING DOWN
UI hit the identical defect in the same window, independently, in the game's own button
face: *"the N on every button in this game is an H."* They measured every pair of capitals
and H/N came back the **closest pair in the alphabet**, 10.6% of the ink. Their cause is the
casing cut's 25% overlap swallowing the diagonal; their fix is a softer cut and it is theirs
— this lane does not touch the shipped face.

Two lanes, two surfaces, one week, same letter. At small sizes **N is the letter that breaks
first**, and any face this game draws should be checked on it before anything else.

## WHERE HE SEES IT
The **VOTE tab**, in the alpha, behind the gear. Registered as
`factions-the-water-still-runs-9-21`.

## ROUTED, NOT CHASED
**FOR WORLD [water lifted]:** the pumps report lifting **zero litres**, because the valley's
thirst reads zero (`needPerDay` returns 0). The stations are running and the sentence is
true; the quantity is not. Not this row and not touched.

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched. One real thing made and registered where
he votes. PLUMBER's new cook gate reads *"FACTIONS has cooked at least as recently as it has
coded."*

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**The best cook is the one that draws an answer the game already has.** Six invented shops
were a good picture. One water sign that reads `holdersOf()` is a picture *and* a fact the
player has never been able to learn, and it cost less to make because the hard part was
already built and nobody had looked at it.
