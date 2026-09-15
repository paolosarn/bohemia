# COOK -- [car recook] ROUND 4: HE ZOOMED ALL THE WAY OUT AND THE GAME SHOWED HIM A PLACEHOLDER WITH THE WORD PLACEHOLDER ON IT

**Lane 16 COOK (the Production Artist), 9/15/26. Board row: `[car recook]`, first line of this
lane. Closes ART REQUEST AR-005, open since 8/12.**

> *"every time I see a car it looks like dogshit, I'm so confused... **when I zoom out all
> the way it looks like dogshit.**"*
> -- Paolo 9/15, playing the demo a second time

---

## 1. THE ROW SAID MEASURE WHICH SPRITE THE DEMO DRAWS AT EACH ZOOM. IT DRAWS NO CAR AT ALL.

The row is explicit: *"the art half shipped 9/7 and he still sees dogshit on the 9/14p cut,
so the half that shipped is not what he sees: measure which car sprite the DEMO draws at
walk zoom, city zoom and the widest zoom."*

So I drove the shipped demo with the one driver (rule 14g), pinched all the way out, and
photographed every band. **The widest zoom does not draw a car.** It draws a sky, and the
game prints the reason in the bottom margin of his screen:

```
placeholder sky - art request AR-005
```

**He zoomed all the way out and the game showed him a placeholder with the word PLACEHOLDER
written on it.**

AR-005 was filed 8/12 by RUN, addressed to this lane, and had been OPEN for a month. Its
own `measured_gap` says it plainly:

> *"the repository contains NO celestial art of any kind -- no planet, no moon, no star
> field in any bank. The PLANET and MOON bands currently draw procedural radial-gradient
> discs from the city's own palette, and the screen admits it in the corner. **TWO OF THE
> FIVE ZOOM BANDS ARE THEREFORE UN-COOKED.**"*

Two of the five camera levels in his game had never been drawn by anybody. One of them is
the last image the dynasty ever sees (7/19 LOCKED: act 3 ends looking down at the planet).

**Rule 14(d) is the same sentence in the same law:** *"a card that promises something and
does nothing is the worst bug in the game: deliver it or remove it."* A band that says
PLANET and draws a gradient ball is that bug wearing a different shape.

## 2. WHAT WAS ACTUALLY ON SCREEN

- `skyDisc()` is a **two-stop radial gradient** with an optional stroked rim: a smooth
  vector sphere, in a game where every other surface is 45-degree pixel art at 44px a cell.
  Two worlds in one frame, which is the exact fault this lane has now cured three times --
  the cars (median 3,031 colours to 9), the street (1,235 to 7), the yard (16px blurred
  x2.75 to 44px lossless).
- The moon's seas were **three translucent circles of one grey, evenly spaced.** The comment
  beside them read *"so it reads as THE moon and not as a coin."* It read as a coin.

## 3. THE METHOD

Banded value, snapped to a ramp, no gradient anywhere -- the same method every time.

The discs are drawn as **square pixels on a grid whose step scales with the disc**, snapped
to absolute screen coordinates so the pixels do not crawl as it grows. That matters here
more than anywhere: **the disc radius changes continuously with the pinch**, so a sprite
would have to be stretched by a fractional factor on every frame -- the banned non-integer
scale, and exactly the blur this lane measured on the 16px yard tiles two rounds ago. A
procedural pixel grid has no such problem: it is crisp at any size because it is never
scaled at all, only re-stepped.

### Ramps: nothing copied, everything derived

There is no celestial art and no cold-grey ramp anywhere in `banks/` -- that is AR-005's own
measured gap and the reason the request exists rather than a pointer to a bank.

| band | ramp | source |
|---|---|---|
| the Mojave | `ground`, 7 tones | approved 7/28, verbatim |
| iron oxide | `terracotta`, corroded end only | approved 7/28, verbatim |
| dry lakes, cloud | `stucco`, pale end | approved 7/28, verbatim |
| the moon | 9 tones | **derived**: the approved `asphalt` ramp with the chroma removed and the value lifted, same steps, same spacing |
| atmospheric limb | blue | **the one non-ramp colour**, on the request's own instruction |

The limb is blue because the request says so: *"The ONLY blue in the frame is the
atmospheric limb, because that shell really is blue and it is what makes a planet read as a
planet rather than a painted ball."* That is also what Paolo's 8/16 verdict allows -- he
killed the maritime **sky**, not the limb, and `sky_touch_gate`'s arm against `#7fa8c8`
stays green.

## 4. *** THE FIRST CUT LOOKED LIKE A PIZZA, AND THE PICTURE CAUGHT IT AGAIN ***

I cooked it, photographed it on the glass, and the planet came out covered in **bright
orange blobs**. So I sampled the shade function over 40,000 points on the disc instead of
arguing with it:

| | first cut | real southwest | retuned |
|---|---|---|---|
| iron oxide share | **18.2%** | a few per cent | **6.4%** |
| cloud share | **21.2%** | thin and partial | **8.5%** |
| iron tones | `#a05734`, `#c6683b` (sat 0.42, 0.55) | | `#78402a`, `#874a2e` (sat 0.31, 0.35) |

The ground ramp tops out at saturation 0.22. The first cut put something **three times
louder than the world it sits in over a fifth of the disc.**

**This is the tail-light mistake from the car round wearing a planet.** That round took its
accent from the single most saturated pixel and speckled a wreck scarlet; this one took its
accent too wide and too loud and made a desert look volcanic. Both scored fine. Both looked
wrong. The fix is the same one both times: the accent goes to **terracotta's corroded end**,
which is precisely where the car's rust ended up.

Cloud is now **blended rather than swapped** -- thin cloud over desert lets the ground
through, and that is what makes it read as cloud instead of as paint.

## 5. WHAT THE ART IS NOW

**THE MOON.** Full disc, flat-lit, cold. Not a crescent: at full moon the sun is behind the
observer, which the spec states outright (*"not a crescent, not a cartoon"*). Limb darkening
is one ramp step in the last tenth of the radius, no more. **Six maria placed off the real
near side** -- Imbrium, Serenitatis and Tranquillitatis chained across the upper left,
Crisium alone and small to the east, the southern highlands bright and empty. Three evenly
spaced circles is the one arrangement the real moon never makes, and it is why the old one
read as a coin.

**THE PLANET.** Banded, not spotted. From orbit the southwest reads as long streaks
following the terrain, so three frequencies in order: ranges and valleys running in lines,
dry lakes as pale flats, and a thin cloud sheet on its **own** axis because weather does not
care about geology. The terminator is a **soft dithered band**, not an edge -- sunset from
orbit is a hundred kilometres wide.

## 6. REFERENCE CHECK

**Compared to:** photographs of the full moon at opposition (the near side, the only side
anybody has ever seen from a street), orbital photography of the Mojave and the Colorado
Plateau -- the same ground this game is set on, from the altitude the request asks for --
and the repo as its own ruler: the approved act-1 set and the 45-degree art law.

**Structural rules taken:** the maria are a lopsided cluster, not an even spot pattern;
limb darkening is subtle and a full moon gets no crescent; the planet is banded not spotted;
the terminator is a wide soft band.

**The 45-degree law:** the request carries a written exemption for the **camera** only
(*"NOT a 45-degree three-quarter subject... canon already names this camera separately"*).
The exemption is about the angle and never about the craft -- the pixels, the banding and
the ramp discipline are the same laws as every tile.

**What changed from the reference:** the palette. A real moon is neutral grey and a real
Mojave is browner and greener than this; both are pulled onto the approved ramps so they sit
in Paolo's world rather than in a photograph. That is the trade every cook here makes and
the whole point of ONE PALETTE PER FAMILY.

## 7. VERIFIED ON THE REAL SURFACE, AND IT REACHES HIM WITHOUT A RE-CUT

Driven on **the demo he actually played**, not the alpha: `BOHEMIA_CITY_WORLD.html` is
loaded **by reference** (`const CITY_SRC='BOHEMIA_CITY_WORLD.html'`), so art landing in the
city file reaches both surfaces immediately. **Rule 14(a) is satisfied without the cutter:
no demo was re-cut by this lane.**

Photographed at every band: the placeholder line is gone, the moon is crisp banded pixel art
with a lopsided mare cluster, and the planet reads as tan desert with dark rock outcrops and
pale flats.

## 8. THE GATE ARM THAT WAS WAITING FOR THIS LANE

`sky_touch_gate.js` asserted *"the placeholder still SAYS it is a placeholder, **because the
real celestial art is AR-005 and belongs to the ART lane** -- this made the stand-in honest,
it did not pre-empt the artist."*

I am the art lane. The arm is flipped to assert the opposite: `__SKY_ART__` present and the
placeholder line gone. AR-005 is marked SHIPPED in the request queue with the reasoning.

## 9. WHAT I DID NOT DO, AND WHY

**The car itself was not re-cooked this round.** Measured first: the 20 car sprites in the
prop bank are the cooked art, 10 to 11 colours each, all inside the ceiling. The loudest
rust tone is still `#c6683b` at saturation 0.55 against a body that maxes at 0.21, and the
rust covers a median 8.4% of a car -- **that is a real finding and it is the next round of
this row**, but it is the walk-zoom half of his sentence, and the half he called out
specifically ("*when I zoom out all the way*") was a placeholder, which is worse and was
free to fix.

## 10. PROOF

- tool: `tools/bohemia_the_sky_he_zooms_to_cook_9_15_26.py` (measure / `--write`,
  re-runnable, one delimited block so a rebase cannot half-apply it, five guards that refuse
  rather than write a half-applied sky)
- art: `slices/BOHEMIA_CITY_WORLD.html`, `__SKY_ART__` block
- request: `records/requests/BOHEMIA_ART_REQUEST_QUEUE.json`, AR-005 SHIPPED
- gate: `gates/sky_touch_gate.js`, the placeholder arm flipped
- pre-push pass green: REFERENCE CHECK 11/0, REUSE-FIRST 207/4, PIXEL CRAFT 30/0, ART 45
  16/0, CITY TAB 64/0, ALPHA LOADS 20/0, ART REQUEST 35/0, SKY TOUCH 19/1 -- and that one
  red is a redraw-budget arm that is **byte-identical on main**, verified by stashing this
  diff and re-running, not assumed. The 4 REUSE-FIRST reds are other lanes' files.
- full suite: 107 red at ad23d875 (the suite line); none of those are named as this lane's.
- no demo re-cut (rule 14a) -- and none was needed, per section 7.
