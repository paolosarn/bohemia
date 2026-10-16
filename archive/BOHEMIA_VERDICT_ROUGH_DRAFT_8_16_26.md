# PAOLO'S VERDICT, 8/16/26 — "IT'S A GOOD ROUGH DRAFT... IT NEEDS MORE WORK"

His words, verbatim, after riding the zoom out to the moon and back:

> "OK, it's a good rough draft. Off the freeway are so fucked up not going the right
> direction half of them. It's very ugly and then like some rough rough rough draft I
> mean as I'm zooming out like all blue and it doesn't even look like it's moving out
> from the Earth. It's really bad. It needs more work."

NOTES ARE RULINGS (7/19). This is the verdict on the zoom feature and on the streets, and
it splits three ways. Two of the three are NOT this session's ground, and they are routed
here rather than quietly worked, because ONE SYSTEM, ONE SESSION.

---

## 1. THE FREEWAYS POINT THE WRONG WAY — **ROUTED, NOT TOUCHED**

> "Off the freeway are so fucked up not going the right direction half of them."

**OWNER: the other live WORLD session.** `git log` on
`tools/bohemia_district_hero_factory.py` shows that session committing continuously
through 8/15-8/16 — icons, roofs, walls, thin icons — and it landed
*"STREETS NOW FACE THE WAY THEY ACTUALLY RUN (8/15, WORLD lane)"* and *"THE FREEWAY IS A
TWO-WIDE RIBBON, AND IT GOES OVER THE STREET"* the same day. His report says that is still
wrong for about half of them.

**WHAT THEY NEED TO KNOW:** he is looking at the freeway OFF-RAMPS / the freeway as it
meets the streets, at map zoom, and the direction is wrong on roughly half. He calls the
result "very ugly". This is a fresh verdict landing ON TOP of a fix that already shipped,
which usually means the fix covered one orientation case and not the mirrored one.

NOT TOUCHED HERE. Two sessions in the same generator is the one collision the parallel law
names by name.

---

## 2. THE SKY LOOK — **ROUTED TO ART (AR-005), which already owns it**

> "It's really bad."

The sky is a DECLARED PLACEHOLDER and the screen literally says so: *"placeholder sky ·
art request AR-005"*. `records/BOHEMIA_ONE_ZOOM_TO_THE_MOON_8_12_26.md` states the
repository contains **no celestial art of any kind** in any bank, which is why it was
requested rather than invented. The pixels are the ART lane's and drop into two functions
behind the marker `__SKY_ART__`.

**HIS VERDICT IS THE STRONGEST INPUT THAT REQUEST HAS EVER HAD** and should travel with
it: *"all blue"*, *"doesn't even look like it's moving out from the Earth"*, *"really
bad"*. Whoever draws AR-005 should read this file first.

---

## 3. WHAT WAS ACTUALLY WRONG AND WAS FIXED THIS TURN

A placeholder is allowed to be unfinished. It is not allowed to be **wrong**, and two
things in it were wrong rather than merely rough. Both are fixed; neither invents art.

### "ALL BLUE" — the sky contradicted the game's own palette
The record for this feature claims the discs are *"drawn from the palette the city already
uses."* **THEY WERE NOT.** The gradient ran `#3a6a8a -> #7fa8c8`: temperate, maritime,
powder blue, in a game whose every surface is Mojave tan (`#8a7a58`, `#d8c08a`, `#b89a6a`
— all already in that same file). The claim and the code disagreed and nobody had looked.

**A REAL MOJAVE SKY IS BLUE AT THE ZENITH AND DUST-TAN AT THE HORIZON**, because the
horizon is a hundred miles of suspended silt. The blue belongs at the top; the bottom was
never blue. The haze colour is now the city's OWN `#d8c08a`, chosen from the file rather
than picked. It also goes to black FASTER on the way up, because airglow is a thin shell,
not a gradient across the whole frame — past the atmosphere there should be no blue left.

### "DOESN'T LOOK LIKE IT'S MOVING OUT FROM THE EARTH" — because the ground was a rectangle
It was `g.fillRect(0,horizon,W,H-horizon)`: a slab with a **dead straight top edge** that
slid down and darkened. **A STRAIGHT HORIZON READS AS STANDING ON A PLAIN AT EVERY
ALTITUDE.** It is the single cue that says *flat*, and shrinking the city underneath it
cannot argue with it. No amount of art would have fixed this; it is geometry.

**THE HORIZON BOWS NOW.** Its sagitta grows quadratically with altitude: imperceptible
down low, decisive by the planetary band, until he is looking OVER a limb rather than
across a floor. Same reason a real horizon looks flat from a rooftop and curved from a jet.
Verified by screenshot on the real page at five altitudes.

**UNTOUCHED ON PURPOSE:** the moon disc, the starfield, and the placeholder label. Those
are AR-005's, and making the stand-in honest must not pre-empt the artist.

---

## THE STANDING LESSON

A placeholder that is WRONG teaches the wrong thing while it waits. This one told him the
Mojave was an ocean world and that the Earth was flat, for four days, under a label that
said "placeholder" — and the label made both look like things that were merely unfinished.
**"PLACEHOLDER" EXCUSES INCOMPLETE. IT DOES NOT EXCUSE INCORRECT.**


---

# ROUND TWO, 8/16 — HE LOOKED AGAIN

> "It looks a little better. It's still kinda looks like shit though still in blue around
> the city as I zoom out and then the cities like this like square grid that's poking out
> the side of the Earth when I zoom out even more, it's kind of weird."

He sent a screenshot, and the screenshot is why both of these got found. Neither was the
sky. I had fixed the sky and reported it; he was pointing at two other things.

## THE CITY WAS FLOATING IN THE SEA

The blue he means is in **CITY MODE**, around the isometric diamond, in the whole-map view.
It is not rendered by the sky at all. The city view clears its entire canvas to a flat
colour before drawing the valley, and that colour was `#3a6a8a`.

**`#3a6a8a` IS THIS GAME'S WATER.** From the same file:
`if(col==='#3a6a8a') return 'water'`. The Mojave valley has been sitting in an OCEAN in
every zoomed-out view, and because it looked like a background nobody ever read it as
water. Sampled off his screen with a colour picker, not guessed.

Beyond the mapped 96x96 there is **more desert** — the map is a window onto the Mojave, not
an island. Day is now the desert floor the sky render already uses; night is the city's own
warm dark. The water colour itself is untouched; only the backdrop that was borrowing it.

## THE GRID POKING OUT OF THE PLANET — A FAULT MY OWN FIX EXPOSED

> "the square grid that's poking out the side of the Earth"

**This one I caused, the day before.** Curving the horizon turned the ground into a LIMB,
but the valley kept being painted as a flat diamond on top of it, so its corners hung off
into empty space past the planet's edge. The straight horizon had hidden it, because
nothing can stick out of a floor that spans the whole frame.

A FIX CAN EXPOSE A FAULT THAT WAS ALWAYS THERE BUT HAD NOWHERE TO SHOW. The valley is now
clipped to the limb silhouette, so the planet's edge cuts the city the way a real horizon
cuts one.

## THE LESSON FROM ROUND TWO

I fixed the sky, verified the sky, and reported the sky — and both of his remaining
complaints were somewhere else. **HE SAID "AROUND THE CITY" AND I HEARD "THE SKY", because
the sky was what I had just been working on.** The screenshot is what corrected me. When he
describes where something is, that is data, not framing.
