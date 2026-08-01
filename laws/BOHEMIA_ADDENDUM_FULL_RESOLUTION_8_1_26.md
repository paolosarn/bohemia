# FULL RESOLUTION LAW (Paolo 8/1/26, LOCKED)

> "WHY WHEN I ZOOM IN ARE ALL THE QUALITY OF THE PIXELS OF THE TILES SO DOGSHIT???
> WHY IS THE PIXEL QUALITY NOT AT FULL BRO WTF" (7/31)
>
> "when I say pixel quality, I mean of the terrain of the ground of the houses it
> looks. It's it's not. It's so bad" (8/1)
>
> "I NEED YOU TO MAKE PERMANAENT AWESOME CHANGES TO THIS GAME RIGHT NOW AND MAKE
> LAWS EVERY OTHER SESSION has to listen to... we cant be doing one off shit"

## THE LAW

**THE BAKE EQUALS THE ART. EVERY WORLD DRAW IS 1:1.**

1. Any texture cache, chunk bake, atlas or intermediate surface that his art passes
   through is authored at **the art's own pixel size**, never smaller. A tile bank
   at 44px means the bake is 44px.
2. The on-screen cell size at the default zoom **equals the art size**, so a tile
   blits 1:1 and the device-pixel upscale is a clean integer.
3. Zoom stops stay a power-of-two family **relative to the art**, never relative to
   a smaller bake.
4. These three move **together**. Fixing one alone is not a partial fix, it is a
   pure cost: a 44px bake blitted into a 22px cell is identical pixels at 4x the
   memory, and a 44px cell fed by a 22px bake is a 2x upscale of thrown-away data.
5. Memory is rebalanced in the same change (`CVCAP`), against the iOS ceiling the
   render contract already names. Never silently blow the budget to buy sharpness.

## WHAT IT ACTUALLY WAS

The ground baked into chunk textures at `TPX=22` while his approved street pools
are `44x44`. Every tile he judged was **decimated 2:1 before it was ever
composited**. Because the zoom stops `[11,22,44,88]` multiplied that already-halved
bake, **there was no zoom at which his art had ever been on screen at 1:1. Not
once.** That is why zooming IN looked worse rather than better, exactly as he said.

Measured on the surface he plays:

| | source -> destination | distinct colours in a 140px ground sample |
|---|---|---|
| before | `22x22 -> 22x22` | 803 |
| after | `44x44 -> 44x44` | 1441 |

Nothing was wrong with the art, the compositing, or the upscale.

## THE THREE PLACEBOS, NAMED SO NOBODY SHIPS A FOURTH

Every one of these passed a source-reading check and changed nothing he could see.
A "fix" for this complaint that is not verified by **measuring blit sizes in a real
browser** is presumed to be placebo number four.

1. **devicePixelRatio on the run slice.** He does not open that file. The RUN tab
   opens the CITY blob. Invisible to him.
2. **devicePixelRatio on the city.** The city sizes its backing store 1:1 with the
   CSS box *on purpose* so the phone does a pure integer x3. Raising it produced
   identical pixels at 9x the memory and broke a locked contract.
3. **`ctx.imageSmoothingEnabled`.** Already set false in three render paths. A grep
   that omits the `g.` prefix will "prove" it is missing. It is not.

Also not the bug, and correct as it stands: `screenFilter()` (CITY lane, 7/27)
sets `pixelated` for the walked world and deliberately leaves `auto` for the
city-builder overview. A probe reads `auto` only because the frame boots in
overview mode.

## FOOTSTEPS SIT UNDER THE MUSIC

> "relative to like the music it should be like a lot quieter like A LOT A LOT
> quieter -- the noise that makes for me stepping in different terrain should be
> quieter"

Footsteps get their **own bus**, and that bus is the only knob. His approved sound
vectors are never edited to change loudness: **his verdict is on the SOUND, not on
how loud the game chooses to play it.** Footsteps are ambience under the score,
never an instrument in it. `STEP_GAIN <= 0.25` of the music master, gate-locked.

## THE GATE

`gates/full_res_gate.js`, registered as **FULL RES**. It:

- derives the art size from **his own bank**, never a typed constant, and asserts
  the bake equals it
- asserts the chunk budget stays under the iOS ceiling the render contract names
- asserts `STEP_GAIN <= 0.25` and that it is a bus, not a re-cook of his sound
- and **drives a real browser, wraps `drawImage` on the world canvas, and fails if
  ANY world draw is resampled**

That last check is the point. A constant can be read and misread; a blit ratio has
to be earned. Sabotage-tested: restoring `TPX=22` takes it to 98.2% scaled draws
and the gate goes red.
