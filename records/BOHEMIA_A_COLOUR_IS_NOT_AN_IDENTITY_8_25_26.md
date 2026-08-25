
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
