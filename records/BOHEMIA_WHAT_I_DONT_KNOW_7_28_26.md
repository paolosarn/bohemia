# BOHEMIA — WHAT I DON'T KNOW YET (7/28/26, ART lane)

Paolo: **"GO TO SCHOOL SOME MORE KNOW WHAT YOU DONT KNOW YET"**

Two research passes today taught me things. This one is different: it is the map
of my own ignorance, written down so it stops being invisible. The second half is
the part that matters, because a gap you have named is a gap somebody can fix.

---

# PART A — FOUR THINGS I DID NOT KNOW THIS MORNING

## A1. NORMAL MAPS ARE HOW "LIGHT IS RUNTIME" ACTUALLY GETS DELIVERED

> *"Dead Cells uses normal maps not for small surface detail like in 3D art, but
> to 'sculpt' the large obvious shapes of the pixel art instead."*
> *"Lights in their game are dynamically lit only and don't dynamically shadow at
> all, making them very cheap performance-wise."*
> *"Do the diffuse art first and then create the normals afterwards using the
> diffuse as a reference."*

**Why this matters here, specifically.** The mobile render contract has said since
7/26 that **art is material and light is runtime**. I have been treating that as a
rule about what NOT to bake. It is also a rule about what the runtime should then
DO, and I had no idea how that is actually done. This is how: a second image per
tile saying which way each pixel faces, and the engine lights it.

Three things follow immediately for us:

1. **LIGHT=TERRITORY becomes real light.** The 12%-lit clustered-power law is
   currently a colour tint. With normals, a claimed block is genuinely lit from
   its own lamps and the unclaimed dark is genuinely dark. That is the single
   biggest atmosphere upgrade available to this project and it needs no new art.
2. **It is cheap because you skip dynamic shadows.** Dead Cells does not cast
   them. Neither should we — we already have a separate baked-shadow pass.
3. **Normals derive FROM the diffuse.** Our 42 tiles could get them without
   being redrawn, and the 18 forms can produce them as a second output of the
   same cook.

**[NOT MINE TO BUILD ALONE: this is a renderer change and lands with RUN/CITY.
Filed here, not started.]**

## A2. PIXEL CRAWL HAS A NAME AND A CAUSE, AND WE HALF-FIXED IT BY ACCIDENT

> *"Shimmer is the unstable, flickering appearance of pixel art textures when the
> camera moves, occurring because traditional texture mapping samples texels at
> screen-space positions that shift sub-pixel with camera movement."*
> Fix: *"pair nearest filtering with integer scaling"* and a whole-pixel camera.

The CITY lane fixed exactly this on 7/27 (TPX 16→22, whole-pixel camera) and I
read that handoff without understanding what class of bug it was. Now I do — and
the open question it raises is one nobody has checked: **does the walked world's
camera also land on whole pixels, or only the city's?** A sub-pixel camera makes
every tile I am about to cook shimmer, no matter how well it is drawn.

**[OPEN QUESTION, FILED: verify the RUN camera quantises. Not this lane's file.]**

## A3. EVEN TIMING IS WHAT MAKES ANIMATION LOOK AMATEUR — AND OUR OWN LAW MANDATES EVEN TIMING

> *"Playing every frame at the same duration makes an animation feel mechanical
> and lifeless, and uneven timing is what separates amateur sprite animation from
> professional work."*
> *"Hold key poses for 3-4 frames... run through transition frames in just 1-2."*
> *"8-12 FPS is the standard for pixel art."*

This is a genuine tension with a Bohemia law and I am not going to pretend it
isn't. **The 120 BPM LAW quantises everything to BEAT = 0.5s.** That is the
game's identity and it is not up for debate. But quantising the BEAT is not the
same as flattening every frame inside it: a clip can still hold its key pose for
most of the beat and snap through its transitions, and land on the beat exactly.

**[FLAGGED FOR THE ANIMATION/CHARACTER LANES, NOT DECIDED HERE. It is their law
and their clips. I am naming a conflict, not resolving one.]**

## A4. MOST ASSETS MUST BE DELIBERATELY SUBORDINATE

> *"If every asset is screaming for attention, then the player won't know where to
> look. The majority of the assets made for an environment must intentionally be
> subordinate to the focal point or hero asset."*
> *"Landmarks and set pieces use strong silhouettes so players can identify
> locations at a glance from afar."*

This is M3 (contrast is a budget) scaled up from one tile to a whole district, and
it settles how the 18 forms should be cooked: **almost all of them are background.**
CMU block, corrugated metal, stucco, asphalt, striping, turf — subordinate, quiet,
supporting. The focal points are the district HEROES and the openings you can walk
through. A warehouse wall cooked as beautifully as a courthouse portico makes the
courthouse stop being a courthouse.

It also explains a debt already on the board in different words: the cemetery has
no map icon, and *"landmarks use strong silhouettes so players can identify
locations at a glance"* is exactly why that gap hurts.

---

# PART B — WHAT I STILL DON'T KNOW (the honest list)

**B0. THE STRUCTURAL ONE: I HAVE NEVER DRAWN A PIXEL BY HAND.**
Everything I have made in this project was generated by code I wrote. I have no
trained eye — I have measurements, and I have been wrong every time a measurement
was green and the picture was bad (the camouflage tile, the empty sidewalks, the
0.8 MB "loaded" alpha, the 33x seam that meant nothing). This is not false
modesty, it is the thing that makes Paolo's thumb load-bearing and it is why
every gate I write says out loud that it is not a taste machine.

**B1. Sprite and character craft.** The rig is Paolo's and sacrosanct, and I have
never studied sprite anatomy, posing, or how a body reads at 56px. If I am ever
asked to touch a character I should say this first.

**B2. Colour harmony above the ramp level.** I can build a ramp. I do not know how
to choose a whole game's colour STRATEGY — complementary schemes, temperature
zoning across districts, when to break harmony on purpose.

**B3. Atmospheric depth in 2D.** How distance is cued without a 3D camera — value
compression, saturation falloff, haze. Our render contract mentions depth haze in
passing and I have never researched it.

**B4. Water, fire, glass and other "hard" materials.** Every material I have
studied is opaque and static. The waterpark, the wash, the pools and the camp fire
are all in the backlog and I know nothing about animating or shading any of them.

**B5. Sub-pixel animation.** Named in Pixel Logic's chapter list. Never studied.

**B6. UI and HUD pixel art.** A different discipline with different rules
(legibility at small size, no ambiguity, accessibility). The game has a phone, a
map and a nav ring. I have never studied any of it.

**B7. How to critique my own work without a number.** Every judgement I have made
today reduced to a measurement. Paolo's do not. I do not know how to look at a
tile and say "that's wrong" without first computing something — which is exactly
why I keep needing him for the last step.

**B8. Master study.** I can name Saint11, Slynyrd, Azzi, Waneella, Mark Ferrari.
I have never analysed a single piece by any of them pixel by pixel and asked why
each decision was made. Naming an artist is not studying one.

**B9. PIXEL LOGIC, still unread.** The network policy 403s every fetch, so both
law files are built from search summaries of it. Buying it (~$9) is on the board
as ART -1c and it is the single cheapest upgrade available to this lane.

**B10. Whether any of this survives contact with Paolo's eye.** Everything above
is theory I read today. None of it has been thumbed. The measure of this school
run is whether the eighteen families come back approved, not whether the laws
read well.

---

## WHAT I DID WITH IT

The four things I learned are in `laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md`
where they change what I do (A4 binds all eighteen forms immediately). A1 and A2
are filed as cross-lane items I did not start, because they are renderer changes
and the RUN and CITY lanes were shipping in those files tonight. A3 is a conflict
with an existing law and it is flagged, not resolved — that is the animation
lanes' call.

Part B is not a plan. It is a list of holes, kept where the next session can find
it, so nobody has to rediscover my blind spots by shipping something bad.
