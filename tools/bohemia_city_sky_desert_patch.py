#!/usr/bin/env python3
"""
THE MOJAVE IS NOT AN OCEAN WORLD, AND A STRAIGHT HORIZON IS NOT A PLANET (8/16, WORLD lane).

    "as I'm zooming out like all blue and it doesn't even look like it's moving out from
     the Earth. It's really bad."                                        -- Paolo, 8/16

HE IS RIGHT TWICE, AND BOTH ARE DEFECTS RATHER THAN TASTE. THE FINAL CELESTIAL ART IS NOT
THIS LANE'S AND IS NOT TOUCHED: the sky is a declared placeholder, the screen says so, and
AR-005 is filed with the ART lane (marker __SKY_ART__). What this fixes is a placeholder
that is actively WRONG, which is a different thing from a placeholder that is unfinished.

1. "ALL BLUE". The record for this feature claims the sky is "drawn from the palette the
   city already uses". IT IS NOT. It runs #3a6a8a -> #7fa8c8: temperate, maritime, powder
   blue, in a game whose every surface is Mojave tan (#8a7a58, #d8c08a, #b89a6a). The claim
   and the code disagreed and nobody had looked.
   REAL DESERT SKY, which is why this is correctness and not a repaint: a Mojave sky is deep
   blue at the ZENITH and turns dust-TAN at the horizon, because you are looking through a
   hundred miles of suspended silt. The blue belongs at the top. The bottom was never blue.
   And climbing out of the atmosphere it should go to black FASTER than it does -- airglow
   is a thin shell, not a gradient across the whole frame.

2. "DOESN'T LOOK LIKE IT'S MOVING OUT FROM THE EARTH". Because the ground is a RECTANGLE.
   `g.fillRect(0,horizon,W,H-horizon)` with a dead straight top edge that slides down and
   darkens. A STRAIGHT HORIZON READS AS STANDING ON A PLAIN AT EVERY ALTITUDE -- it is the
   one cue that says "flat", and no amount of shrinking the city underneath overrides it.
   THE FIX IS THE CURVE. As you rise, the horizon bows: barely at street level, decisively
   by the planetary band, until the ground is a LIMB you are looking over rather than a
   floor you are standing on. That is the whole difference between a slab fading out and
   leaving somewhere, and it is geometry, not art direction.

WHAT IS DELIBERATELY NOT DONE HERE: no new celestial pixels, no moon rework, no starfield
art, no new palette invented. The moon disc, the stars and the placeholder label all stay
exactly as the ART lane left them, because AR-005 is theirs and his verdict on the LOOK
routes to them, not to me. This makes the stand-in honest; it does not pre-empt the artist.

REUSE CHECK: cooks no banked pixels and opens no bank -- it is procedural canvas in the
page's own render path. Colours are taken from the CITY'S OWN existing constants rather than
chosen: #8a7a58, #d8c08a and #b89a6a all already appear in this file.

  python3 tools/bohemia_city_sky_desert_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'

# ---- 1. THE SKY ITSELF: blue at the zenith, DUST at the horizon -----------------------
# The city's own tan (#d8c08a) is the haze colour, so the sky and the ground it hangs over
# are finally the same world. The night pair keeps its blues -- a night sky IS that colour,
# and he did not complain about the night.
SKY_OLD = ("  var skyTop=mixHex(night?'#101826':'#3a6a8a','#05060b',t);\n"
           "  var skyLow=mixHex(night?'#1a2436':'#7fa8c8','#05060b',Math.min(1,t*1.15));")
SKY_NEW = ("  /* __SKY_DESERT__ -- a MOJAVE sky, which is deep blue at the zenith and dust-TAN\n"
           "     at the horizon, because the horizon is a hundred miles of suspended silt. It\n"
           "     used to run #3a6a8a -> #7fa8c8, a maritime powder blue, in a game whose every\n"
           "     surface is desert tan -- \"all blue\" (Paolo 8/16), and he was right. The haze\n"
           "     colour is the city's OWN #d8c08a, not a new one. And it goes to black FASTER\n"
           "     on the way up (t*1.45) because airglow is a thin shell, not a whole-frame\n"
           "     gradient: past the atmosphere there should be no blue left to see. */\n"
           "  var skyTop=mixHex(night?'#101826':'#33607f','#05060b',Math.min(1,t*1.45));\n"
           "  var skyLow=mixHex(night?'#1a2436':'#d8c08a','#05060b',Math.min(1,t*1.25));")

# ---- 2. THE GROUND: a LIMB, not a rectangle -------------------------------------------
GND_OLD = ("    var horizon=H*(0.42+u*0.36);\n"
           "    g.fillStyle=mixHex('#8a7a58','#3a3226',Math.min(1,u/0.5));\n"
           "    g.fillRect(0,horizon,W,H-horizon);\n"
           "    g.save(); g.globalAlpha=Math.max(0,0.55-u); g.fillStyle='#d8c08a';\n"
           "    g.fillRect(0,horizon-3,W,3); g.restore();")
GND_NEW = ("""    var horizon=H*(0.42+u*0.36);
    /* __SKY_CURVE__ -- THE HORIZON BOWS, AND THAT IS THE WHOLE FIX. Paolo 8/16: "it doesn't
       even look like it's moving out from the Earth." It never could: this was a fillRect
       with a dead straight top edge, and A STRAIGHT HORIZON READS AS STANDING ON A PLAIN AT
       EVERY ALTITUDE. It is the single cue that says "flat", and shrinking the city
       underneath it cannot argue with it.
       So the edge is an ARC now. Its sagitta -- how far the middle rises above the sides --
       grows with altitude: imperceptible down low, decisive by the planetary band, until he
       is looking OVER a limb rather than across a floor. Geometry, not art direction, and
       the same reason a real horizon looks flat from a rooftop and curved from a jet. */
    var bow=H*0.34*u*u;                     /* quadratic: nothing early, obvious late */
    var edgeY=function(x){ var d=(x-W/2)/(W/2); return horizon+bow*(d*d); };
    g.fillStyle=mixHex('#8a7a58','#3a3226',Math.min(1,u/0.5));
    g.beginPath();
    g.moveTo(0,edgeY(0));
    for(var sx=0;sx<=W;sx+=8) g.lineTo(sx,edgeY(sx));
    g.lineTo(W,H); g.lineTo(0,H); g.closePath(); g.fill();
    /* the lit rim of the limb, following the same curve rather than a straight bar */
    g.save(); g.globalAlpha=Math.max(0,0.55-u); g.strokeStyle='#d8c08a'; g.lineWidth=3;
    g.beginPath(); g.moveTo(0,edgeY(0));
    for(var rx=0;rx<=W;rx+=8) g.lineTo(rx,edgeY(rx));
    g.stroke(); g.restore();""")

# ---- 3. THE EARTH ITSELF, WHICH IS THE ACTUAL "ALL BLUE" ------------------------------
# The disc he is leaving was #7fa8c8 with a rgba(180,220,255) rim: an OCEAN WORLD. Seen from
# above Las Vegas you are looking at the MOJAVE -- ochre, iron-oxide, dry lake white -- with
# a thin cold shell of atmosphere at the edge, and that shell is the ONLY blue in the frame.
# This was the half I missed on the first pass: I fixed the sky BEHIND the planet and left
# the planet itself maritime, which is precisely the thing he was pointing at.
# The body colours are the city's own (#c9a06a is a shade of the same tan family as
# #d8c08a / #b89a6a); only the RIM stays blue, because atmospheric limb genuinely is.
EARTH_OLD = ("    skyDisc(W*0.5,H*0.98+er*0.55,er,'#7fa8c8','#16283a',"
             "'rgba(180,220,255,0.35)');")
EARTH_NEW = ("    /* __SKY_EARTH__ -- THE MOJAVE FROM ABOVE, not an ocean world. It was #7fa8c8\n"
             "       with a pale blue rim, which is the \"all blue\" he was actually pointing at\n"
             "       (8/16) -- the sky behind the planet was only half of it. From orbit over\n"
             "       Las Vegas you see ochre, iron oxide and dry-lake white. The ONLY blue in\n"
             "       the frame is the atmospheric limb, because that shell really is blue and\n"
             "       it is what makes a planet read as a planet rather than a painted ball. */\n"
             "    skyDisc(W*0.5,H*0.98+er*0.55,er,'#c9a06a','#4a2f1c',"
             "'rgba(150,195,235,0.42)');")


# ---- 4. THE BLUE AROUND THE CITY, which is not the sky at all -------------------------
# Paolo 8/16, with a screenshot: "still in blue around the city as I zoom out". He was
# looking at the CITY view, not the sky -- and that blue is not rendered at all, it is CSS.
# The canvas is transparent and #stage{background:#1a2a38} shows through around the iso
# diamond, over a #2a4a62 page. Two slate blues framing a Mojave valley, and no amount of
# work on renderSky could ever have touched them, which is why the first pass did not.
# THE VOID AROUND THE VALLEY IS DESERT NIGHT, NOT OCEAN. #1c1a15 is the city's own
# second-most-used colour (28 uses in this file) -- reused, not invented.
BODY_OLD = "html,body{background:#2a4a62;"
BODY_NEW = "html,body{background:#1c1a15;/*__SKY_VOID__*/"
STAGE_OLD = "overflow:hidden;background:#1a2a38}"
STAGE_NEW = "overflow:hidden;background:#1c1a15}"

# ---- 5. THE GRID POKING OUT THE SIDE OF THE EARTH -------------------------------------
# Paolo 8/16: "the cities like this like square grid that's poking out the side of the
# Earth when I zoom out even more, it's kind of weird."
# HE IS DESCRIBING A BUG I CREATED YESTERDAY. Curving the horizon made the ground a LIMB,
# but the valley is still painted as a flat diamond on top of it -- so its corners hang off
# into empty space past the planet's edge. The straight horizon hid this, because nothing
# could stick out of a floor that spanned the whole frame.
# THE FIX IS A CLIP, not a redraw: the valley is painted INSIDE the limb silhouette, so the
# planet's edge cuts it exactly the way a real horizon cuts a city.
VALLEY_OLD = ("    var k=Math.max(0.06,1-u*3.2);\n"
              "    var tw=TW,th=TH; TW=TW0*zoomBounds()[0]*k; TH=TH0*zoomBounds()[0]*k;\n"
              "    try{ skyValley(horizon); }catch(_e){}\n"
              "    TW=tw; TH=th;")
VALLEY_NEW = ("""    var k=Math.max(0.06,1-u*3.2);
    var tw=TW,th=TH; TW=TW0*zoomBounds()[0]*k; TH=TH0*zoomBounds()[0]*k;
    /* __SKY_CLIP__ -- THE VALLEY IS ON THE PLANET, NOT FLOATING BESIDE IT. Paolo 8/16:
       "the square grid that's poking out the side of the Earth... it's kind of weird."
       That was a bug I introduced the day before: curving the horizon turned the ground
       into a LIMB, but the valley kept being painted as a flat diamond on top, so its
       corners hung off into space past the planet's edge. The straight horizon had hidden
       it, because nothing can stick out of a floor that spans the whole frame -- a fix can
       expose a fault that was always there but had nowhere to show.
       Clipped to the limb silhouette, so the planet's edge cuts the city exactly the way a
       real horizon cuts one. */
    g.save();
    g.beginPath();
    g.moveTo(0,edgeY(0));
    for(var cx2=0;cx2<=W;cx2+=8) g.lineTo(cx2,edgeY(cx2));
    g.lineTo(W,H); g.lineTo(0,H); g.closePath();
    g.clip();
    try{ skyValley(horizon); }catch(_e){}
    g.restore();
    TW=tw; TH=th;""")


# ---- 6. THE CITY WAS FLOATING IN WATER --------------------------------------------------
# Paolo 8/16, with a screenshot: "still in blue around the city as I zoom out."
# THE FIRST PASS FIXED THE SKY AND MISSED THIS ENTIRELY, because it is not the sky: the CITY
# view clears its whole canvas to a flat colour before drawing the valley diamond, and that
# colour was #3a6a8a.
# #3a6a8a IS THIS GAME'S WATER. Line ~16045: `if(col==='#3a6a8a') return 'water'`. The valley
# has been sitting in an ocean, in the Mojave, in every whole-map view, and it looked like a
# background so nobody read it as one.
# BEYOND THE MAPPED VALLEY IS MORE DESERT. That is the only honest answer: the 96x96 is a
# window onto the Mojave, not an island. Day gets the desert floor the sky render already
# uses (#8a7a58); night gets the city's own warm dark (#241f1a). Both reused from this file.
# THE WATER COLOUR ITSELF IS NOT TOUCHED -- only the backdrop that was borrowing it.
VOID_OLD = "  else { g.fillStyle=night?'#101826':'#3a6a8a'; g.fillRect(0,0,cv.width,cv.height); }"
VOID_NEW = ("  /* __CITY_VOID__ -- the valley sits in the MOJAVE, not in the sea. This used to\n"
            "     clear to #3a6a8a, which is literally this game's WATER colour, so the whole-map\n"
            "     view showed a city floating in an ocean -- \"still in blue around the city\"\n"
            "     (Paolo 8/16). Beyond the mapped 96x96 there is more desert, because the map is\n"
            "     a window onto the Mojave and not an island. */\n"
            "  else { g.fillStyle=night?'#241f1a':'#8a7a58'; g.fillRect(0,0,cv.width,cv.height); }")

if not os.path.exists(WORLD):
    sys.exit('SKY DESERT: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()

done = []
for name, old, new, marker in (('sky palette', SKY_OLD, SKY_NEW, '__SKY_DESERT__'),
                               ('horizon curve', GND_OLD, GND_NEW, '__SKY_CURVE__'),
                               ('the earth itself', EARTH_OLD, EARTH_NEW, '__SKY_EARTH__'),
                               ('the void around the city', BODY_OLD, BODY_NEW, '__SKY_VOID__'),
                               ('the stage backdrop', STAGE_OLD, STAGE_NEW, None),
                               ('the valley clipped to the limb', VALLEY_OLD, VALLEY_NEW,
                                '__SKY_CLIP__'),
                               ('the city floating in water', VOID_OLD, VOID_NEW,
                                '__CITY_VOID__')):
    if marker and marker in src:
        done.append(name + ' (already)')
        continue
    if marker is None and old not in src and new in src:
        done.append(name + ' (already)')
        continue
    if old not in src:
        sys.exit('SKY DESERT: could not find the %s to replace. Refusing to guess -- the '
                 'sky render has moved and this patch must be re-aimed deliberately.' % name)
    src = src.replace(old, new, 1)
    done.append(name)

open(WORLD, 'w', encoding='utf-8').write(src)
print('SKY DESERT: patched %s' % ', '.join(done))
print('    "all blue" -> Mojave: blue at the zenith, the city\'s own dust tan at the horizon')
print('    "doesn\'t look like leaving Earth" -> the horizon BOWS with altitude')
print('    the moon, the stars and the placeholder label are UNTOUCHED -- AR-005 is ART\'s')
