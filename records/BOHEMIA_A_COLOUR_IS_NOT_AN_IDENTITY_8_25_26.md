
---

# SECOND MATERIAL: STEEL, AND THE TOOL THAT SHOULD HAVE EXISTED FIRST

## THE MISSING TOOL COST THE LAST FEATURE

Adobe shipped unverified and then got pulled back out because I could not photograph the fort.
I hand-rolled a throwaway probe, it warped the camera and the world did not move with it, and
rather than ship a material I had not looked at I dropped the material.

`bohemia_look_shots.js` could always have taken that picture. But every one of its shots is a
MANIFEST ENTRY -- a titled thing in the LOOK tab that Paolo opens. **There was no way to just
LOOK at something while working on it**, so the answer each time was another throwaway probe,
and there were three of them and all three were wrong in the same three ways:

1. **the zoom is `HC`**, not `setZoomAt()` -- which threw into a swallowed catch
2. **the camera centres on the player**, so centring on the subject puts the body on top of it
3. **the chrome is DOM on top of the canvas** -- the first probe shot the scene under the
   day-one wake card, which is the "money shot rendered UNDER a modal" failure the gates file
   already warns about

`tools/bohemia_material_peek.js` is the missing half: same page, same camera, no manifest, no
tab. **And it proves itself before it is believed** -- `--selftest` photographs the dam wall,
whose answer is already known and already in the LOOK tab, and reports the district the camera
actually landed in. An instrument that has not given a right answer on a known case is not
evidence.

**It immediately caught me being wrong about the other direction too.** The first steel shot came
back showing what I read as "a suburb with parked cars", and I wrote that the instrument was
lying. It was not. Measured at that exact tile: `railyard:13 gantry crane, sTex: steel`. Those
were BOXCARS AND CONTAINERS on the classification tracks, and the crane is a thin structure that
was ten tiles of the frame. **I called the instrument a liar when the instrument was right and my
reading of the picture was wrong**, which is the same error in the opposite direction and worth
writing down next to the others.

## ONE TABLE, MANY MATERIALS

`__concreteTile` became `__materialOf`, a MATERIALS table of rows tried in order, first match
wins. Adding a material is a row, not a mechanism (FACTORY LAW).

## STEEL IS NAMED BY THE OBJECT, NOT BY THE WORD

Concrete legends say "concrete". **Steel legends mostly do not.** `railyard:13` is *"the container
gantry crane spanning the stack -- rails, legs, a seized hoist trolley"* and never uses the word.
A text rule for steel finds 11 candidates and four of them are roofed sheds.

So steel is matched on **the set of objects that are steel by definition**: there is no other
material a container gantry, a switchgear lattice, a catwalk, a conveyor run, a surge tank or a
W-beam guardrail is made of. All 25 were read and eyeballed before they went in the list.

### and the veto earned its keep immediately

**"screen tower" is a rock screen at the quarry and a MOVIE SCREEN at the drive-in.** One name,
two objects, and one of them is a painted sheet that must not become corrugated steel. Vetoed
by name, and the gate checks both halves.

## WHAT STEEL LOOKS LIKE

Metal is **SPECULAR** and concrete is not, and that alternation -- a bright edge where a rib
catches the sky, a dark one where the next rib turns away -- is most of what tells you a thing is
metal at all.

Both halves of the population read the same at 44px: corrugated sheet (a silo, a tank shell) is
parallel ribs at a tight pitch, and structural steel (a gantry, a lattice, a catwalk) is linear
members with sky between them. One painter serves, which is why it is a row and not a second
mechanism.

And it is ten years dead. The thing that makes abandoned steel unmistakable is not the metal, it
is the **RUST RUNS**: orange-brown streaks bleeding DOWNWARD from every fastener and seam,
because that is the direction water carries the oxide. Derived from the tile's own colour rather
than a fixed orange, so a galvanised tank and a painted crane stain in their own register instead
of every steel object in the valley going the same shade.

## THE GATE

`gates/materials_gate.js` -- renamed from concrete_gate, because it gates a TABLE now and a gate
named for the wrong thing is the drift this repo exists to stop. 20 checks, registered as
MATERIALS. 21 concrete, 25 steel, floors on both, and the movie-screen veto asserted from both
sides.

## FOUND BY THE PICTURE, NOT FIXED HERE

The reservoir draws its **buried basin roof slabs with code 6**, which its own legend calls
"water tank" -- so a concrete slab is now wearing steel. One code, two materials, in the
generator rather than in the routing. Same class as the dome-shell/bench-lip collision the quarry
already carries a note about. Named in the handoff; it wants a separate code, not a routing
exception.

---

# THIRD AND FOURTH: CHAIN-LINK, AND ADOBE COMES BACK

## A FENCE YOU CANNOT SEE THROUGH IS A WALL

**31 objects** -- the biggest population of the four, in nearly every district that has a
boundary at all. Every perimeter fence in the valley was a solid band of approved house-roof
shingles ringing the district.

Chain-link is the first material here where **the point is what is NOT drawn.** Every other
painter fills its tile; this one leaves most of it empty, and the ground the renderer already
drew underneath shows straight through. That is not a trick -- it is what a chain-link fence
IS, and it is why a fence has never once read as a fence in this game.

What you see from the world's three-quarter view: the **diamond mesh** as a haze of fine
diagonals crossing both ways, the **top rail** as the one solid line (it is the only part of a
chain-link fence that reads at distance -- every photograph of one is a bright horizontal line
over a grey blur), and the **posts** at a regular bay. And a bay is sometimes simply GONE,
because every one of these legends says so out loud: *"wire sagging"*, *"sagging, some down"*,
*"cut through in places"*, *"pushed over where the last flood shoved a tree into it"*.

### the scale was wrong and the picture caught it

The first cut drew a post every 11 texture pixels. **That is four posts per tile -- one every
19 centimetres.** A chain-link line post is every 3 m; a tile is 0.75 m; a post belongs in
roughly one tile in FOUR, not four times in one. The arithmetic was there to be done and I had
not done it.

(The mesh pitch was right by luck and is right on purpose now: 44 px across 0.75 m is 17 mm a
pixel, and a 50 mm chain-link diamond is three of them.)

### matched on the NAME, and the name must not say wall

Three things would have come in on an act-1 match and all three are wrong:
`prison:12 administration` is a BUILDING that merely mentions a fence; `suburb:4 wall` is
*"block perimeter wall, tan stucco"*; `courthouse:20 secure yard wall` is masonry with wire on
top. `jail:8 razor wire` is a coil on a wall, and `minigp:12 tyre barrier` is a stack of tyres
waiting for its own row. All five stay out, and the gate checks each.

## ADOBE CAME BACK, WITH A PICTURE THIS TIME

It was pulled out of the concrete row a day ago because I could not photograph the fort. It has
its own row now, and its own painter, and **its own picture** -- which is the only thing that
changed about whether it was allowed to ship.

Poured concrete is placed in LIFTS and leaches CALCIUM. Adobe is BRICK, laid in courses, and it
does not leach -- **it melts.** A mud brick is earth and straw dried in the sun, and what a
century and a half of weather does is round every edge off: the courses slump, the corners go
soft, and rain washes shallow vertical runnels into the face. The fort's own legend says it:
*"mud brick under a century of weather, slumped in two places."*

So: **no straight lines.** Paolo 8/1, about hair, and it is the same law -- a course line here
wobbles a pixel because a hand-laid mud course does. And no specular anywhere, which is what
separates adobe from steel at a glance, and warmer and grainier than concrete, which separates
it from that.

**Its row sits ABOVE concrete**, because "adobe wall" matches the concrete row's name pattern and
first match wins. If that ordering is ever lost the fort silently becomes poured concrete, which
is the exact lie the row exists to stop -- so the gate asserts the source order rather than
trusting it.

## THE INSTRUMENT GOT FIXED TWICE MORE, BOTH TIMES BY FAILING

1. **It could not see the edge of a plot.** The search ran 12..FN-12 to keep the camera off the
   cell seam, and reported MISS for `substation:12` -- because a PERIMETER fence lives on the
   perimeter. An instrument that cannot photograph the boundary cannot photograph a fence, a
   wall, a sound wall or a gate: most of the boundary vocabulary of the game. **It failed
   LOUDLY, which is the only reason it was a two-minute fix and not a wrong picture.**
2. **One subject could hang the whole pass.** `vista` opens a camera MOMENT rather than hunting
   a place, and its `open()` sat for thirty minutes without returning or throwing -- so a full
   LOOK pass never finished, every later subject went untaken, and killing it killed the run.
   It is bounded now: a hang becomes a reported MISS, the same contract every other failure in
   that file already has. (Honestly: it completed fine on the retry, so it is INTERMITTENT and
   probably contention, not a known permanent hang. The bound is a guard, not a diagnosis.)

## WHERE THE MATERIALS TABLE STANDS

    chainlink  31      steel  25      concrete  21      adobe  2        = 79 objects

`gates/materials_gate.js`, 30 checks. Adding a material is a ROW.

Still wearing house shingles and named for next time: **wood** (sheds, the drive-in screen,
fencing that is not mesh), **glass** (every storefront and window wall), the **tyre barrier**,
and **razor wire**.
