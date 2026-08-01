# THE ORANGE (10TH REPORT) AND THE SECOND-STOREY RESEARCH (8/2/26)

Paolo, with a screenshot: *"that orange part of the dead shot dial is not going
away during the cinematic camera shit I don't know why it's so difficult to get
rid of that please I've asked like 10 times."*

He is right that it is ridiculous. **The reason I kept missing it is a flaw in my
method, not bad luck**, and that is worth more than the fix.

---

## THE ORANGE — IT WAS MY OWN CAR HEAT SLAB, FROM v108

Every time I instrumented the canvas I **ranked the results by CALL COUNT.** That
finds things drawn hundreds of times a frame — which is exactly how I caught the
eight ghost needle arms (v107) and the deck kick rail stroked 232 times (v110).

**The thing in his screenshot is ONE BIG RECTANGLE DRAWN ONCE PER FRAME.** Twenty
calls across a whole killshot. It sat near the bottom of every list I ever
printed, through three separate investigations, and I never looked at it.

Ranked by **AREA** instead, it was the top warm object on the first run:

```
maxArea 32062   n=20   fillRect rgb(232,71,40)   drawField   146x219 @763,127
maxArea 32062   n=20   drawImage                 drawField   146x219
```

146×219 at ring=73 is **exactly 2 tiles by 3** — a car — with the car sprite
drawn underneath at the identical size. `rgb(232,71,40)` is literally
`'rgba(232,'+Math.round(120-70*_ht)+',40,…)'` at 70% heat.

**It is the car heat glow I added four turns ago in v108.** A solid orange
rectangle exactly the size and shape of the one in his photo.

### TWO THINGS WERE WRONG WITH IT, NOT ONE

1. **It was `globalCompositeOperation='lighter'`, which ADDS light.** That is why
   dimming never touched it. v110 moved the killshot dim to after the entire
   environment and darkened every warm highlight at the source — and **you cannot
   subtract an additive layer with a black wash.** It survived the one fix built
   to catch precisely this.

2. **A full-body slab is wrong even when nobody is dying.** Additive orange at
   0.21 over a dark car sprite is a flat orange rectangle. Hot metal does not
   look like a coloured rectangle laid on a car — **it glows at its edges and it
   is hottest where the fire is**, and the fire is the tank, which is in the boot.

**FIXED BOTH WAYS:** the heat never draws during a kill, and the full-body slab is
deleted. What is left is the rim (always the readable part) plus a soft radial
bloom at the tank end only. No `lighter` anywhere. MEASURED AFTER: zero
`rgb(232,71,40)` draws; the car sprite is visible inside its own glow.

**THE MECHANIC IS UNTOUCHED** — heat still accumulates, still cooks off, still
kills. Only the drawing changed.

### THE METHOD LESSON

**RANK BY AREA, NOT BY COUNT.** A thing drawn once a frame can still be the
biggest thing on the screen. That is now how this lane instruments.

---

## THE SECOND-STOREY RESEARCH — AND BOHEMIA IS DOING THE OPPOSITE

> *"you need to work long and hard do big brain online video game pixel
> asymmetric research of how games create second stories and it just works and
> makes sense because right now your shit is broken"*

### THE FINDING, AND IT IS UNANIMOUS

Across Unreal, Unity, Godot and Roblox floor-system threads, the More Mountains
TopDown Engine docs, Larian's own camera-height forum and the Princeton *Adaptive
Cutaways* paper, every source lands on one sentence:

> **AN UPPER FLOOR CANNOT BE FULLY VISIBLE AT ALL TIMES, BECAUSE IT OBSTRUCTS THE
> CAMERA. HIDE OR FADE THE FLOOR THE PLAYER IS NOT ON.**

The standard implementation is a raycast from camera to player that culls every
floor except the player's. Cutaway rendering — the academic name — is defined as
*"omitting portions of secondary objects to expose objects of interest"*, and the
operative word is **portions**: you cut what occludes, not everything.

And Project Zomboid's answer to the stair case specifically is **draw order, not
transparency**: *"when characters were stood on stairs, tiles behind would already
be drawn before the character, so he would draw correctly and not be cut off."*

### WHAT BOHEMIA WAS DOING INSTEAD

Both floors drew at **full strength, always**, and then we ghosted the **bodies**
— v93's blue x-ray silhouette, v105's per-tile thinning.

**That is backwards.** It fades the thing he is trying to look AT and leaves the
thing in the way at full contrast. That is the honest reason no amount of tuning
the ghost ever made it read, across three rejections.

### WHAT SHIPPED (v113)

`floorFocus(lvl)` → 1 for the floor you are standing on, `FLOOR_OFF` for the
other. **On the lot, the whole deck recedes** — every tile, not just the ones
that happen to have a body beneath them, because per-tile opacity reads as a
glitch rather than as a storey.

Both older reads survive as backstops, so a man under the deck is now legible
**three independent ways**. The v105 scaffold structure (legs, X-bracing, slatted
boards, kick rail) is untouched — value contrast is the height cue, and that was
never the problem.

### WHAT DID NOT SHIP, AND WHY I AM SAYING SO

**The other direction — standing ON the deck, the lot receding.** The lot's floor,
blood, pillars and cars are drawn at four different points in `drawField`, some of
them *after* the deck, so doing it honestly means reordering the renderer rather
than dropping in one `fillRect`. **A half-dimmed lot would read worse than an
undimmed one.** It is the next step.

**JUMPING OFF THE DECK** is a verb he named and has not ruled on. v106 already
answered the edge ("am I not allowed to move in a certain direction") by refusing
a step into air and making the stairs walk both ways. Jumping is not invented here.

---

## SOURCES

**Multi-floor rendering and occlusion**
- [What is the best way to realize a floor system for a top-down game? — Unreal](https://forums.unrealengine.com/t/what-is-the-best-way-to-realize-a-floor-system-for-a-top-down-game/670623)
- [2D top-down games with different floor heights — Godot Forum](https://forum.godotengine.org/t/working-with-2d-top-down-games-with-different-floor-heights/76001)
- [Top-down world with multiple floors — Unity Discussions](https://discussions.unity.com/t/how-to-handle-it-top-down-world-with-multiple-floors/575795)
- [2D Topdown hiding floors between player and camera — Unity](https://forum.unity.com/threads/2d-topdown-hiding-floors-between-player-and-camera.292726/)
- [Adaptive Cutaways (Princeton, PDF)](https://pixl.cs.princeton.edu/pubs/Burns_2008_ACF/adaptive_cutaways.pdf)
- [Rooms — TopDown Engine Documentation](https://topdown-engine-docs.moremountains.com/rooms.html)
- [Roofs and walls transparent between player and camera — Roblox DevForum](https://devforum.roblox.com/t/top-down-view-game-roofs-and-walls-go-transparent-when-in-between-player-and-camera/2582202)
- [Moving camera to different heights — Larian Studios forums](https://forums.larian.com/ubbthreads.php?ubb=showflat&Number=779500)

**Isometric readability and Project Zomboid's floor/stair handling**
- [Isometric Development — PZwiki](https://pzwiki.net/wiki/Isometric_Development)
- [Tile properties — PZwiki](https://pzwiki.net/wiki/Tile_properties)
- [Fundamentals of Isometric Pixel Art — Pixel Parmesan](https://pixelparmesan.com/blog/fundamentals-of-isometric-pixel-art)
- [Pixelblog 41: Isometric Pixel Art — SLYNYRD](https://www.slynyrd.com/blog/2022/11/28/pixelblog-41-isometric-pixel-art)
