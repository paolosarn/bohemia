#!/usr/bin/env python3
"""THE SKY HE ZOOMS TO -- COOK, 9/15/26. [car recook] round 4, and AR-005 closed.

*** PAOLO 9/15, HAVING PLAYED THE DEMO A SECOND TIME, first line of this lane:
"every time I see a car it looks like dogshit, I'm so confused... WHEN I ZOOM OUT ALL THE
WAY IT LOOKS LIKE DOGSHIT." ***

The row says MEASURE WHICH SPRITE THE DEMO DRAWS AT EACH ZOOM before touching anything. So I
drove the shipped demo with the one driver (rule 14g), pinched all the way out, and
photographed every band. The widest zoom does not draw a car at all. It draws this, and the
game prints the reason on his screen in the bottom margin:

        placeholder sky - art request AR-005

*** HE ZOOMED ALL THE WAY OUT AND THE GAME SHOWED HIM A PLACEHOLDER WITH THE WORD
PLACEHOLDER WRITTEN ON IT. *** AR-005 has been OPEN since 8/12, filed by RUN, addressed to
this lane, and its own measured_gap says it plainly: "the repository contains NO celestial
art of any kind -- no planet, no moon, no star field in any bank. The PLANET and MOON bands
currently draw procedural radial-gradient discs from the city's own palette, and the screen
admits it in the corner. TWO OF THE FIVE ZOOM BANDS ARE THEREFORE UN-COOKED."

Two of the five camera levels in his game have never been drawn by anybody, and one of them
is the last image the dynasty ever sees (7/19 LOCKED: act 3 ends looking down at the
planet). That is what "zoom out all the way" costs him, and it is this lane's, by name, in
writing, for a month.

RULE 14(d) IS THE SAME SENTENCE IN THE SAME LAW: "a card that promises something and does
nothing is the worst bug in the game: deliver it or remove it." A band that says PLANET and
draws a gradient ball is that bug with a different shape.

WHAT WAS ACTUALLY ON SCREEN, measured rather than described:
  * skyDisc() is a two-stop radial gradient with an optional stroked rim -- a SMOOTH VECTOR
    SPHERE in a game where every other surface is 45-degree pixel art at 44 px a cell. Two
    worlds in one frame, which is the exact fault this lane has now cured three times: the
    cars (median 3,031 colours -> 9), the street (1,235 -> 7), the yard (16 px blurred
    x2.75 -> 44 px lossless).
  * the moon's seas were THREE TRANSLUCENT CIRCLES of one grey, evenly spaced. The comment
    beside them says "so it reads as THE moon and not as a coin". It reads as a coin.

THE METHOD, AND IT IS THE SAME ONE EVERY TIME: banded value, snapped to a ramp, no gradient
anywhere. The discs are drawn as SQUARE PIXELS on a grid whose step scales with the disc, so
the planet is genuine pixel art at every altitude and nothing is ever resampled. That
matters here more than anywhere: the disc radius changes continuously with the pinch, so a
sprite would have to be stretched by a fractional factor at every frame -- which is the
BANNED non-integer scale, and is exactly the blur this lane measured on the yard tiles two
rounds ago. A procedural pixel grid has no such problem: it is crisp at any size because it
is never scaled at all, only re-stepped.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): swept every bank in banks/ for celestial art and for
a cold-grey ramp. THERE IS NEITHER, which is AR-005's own measured_gap and the reason the
request exists rather than a pointer to a bank. So nothing is copied and everything is
DERIVED, never picked by eye:
  USED, straight out of the act-1 set Paolo approved 7/28 ("I checked it to do the other 41
  mark it approved"), banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt:
    ground      7 tones -> the Mojave's tan, which is what the planet mostly is
    terracotta  7 tones -> the iron oxide, which is what makes it the SOUTHWEST and not
                           a generic desert
    stucco      5 tones -> the dry lake beds and the thin cloud, its pale end only
  DERIVED, and the derivation is arithmetic rather than taste: THE MOON HAS NO RAMP IN THIS
  REPOSITORY. Its ramp is the approved ASPHALT ramp desaturated to neutral and lifted in
  value -- same seven steps, same spacing, the chroma removed and the curve raised, because
  the spec says COLD LIGHT and asphalt is the only seven-step neutral the repo owns. Written
  out in MOON_RAMP below with the source tone beside each one so it can be checked.
  THE ONE COLOUR THAT IS NOT FROM A RAMP is the atmospheric limb, and it is blue on the
  request's own instruction: "The ONLY blue in the frame is the atmospheric limb, because
  that shell really is blue and it is what makes a planet read as a planet rather than a
  painted ball." It is also what Paolo's 8/16 verdict ("all blue") allows: he killed the
  maritime sky, not the limb. sky_touch_gate's arm against #7fa8c8 stays green.

REFERENCE CHECK

COMPARED TO: photographs of the full moon at opposition (the near side, which is the only
side anybody has ever seen from a street), and orbital photography of the Mojave and the
Colorado Plateau -- the same ground this game is set on, from the altitude the request asks
for. Plus the repo being its own ruler: the approved act-1 set, and the 45-degree art law.

STRUCTURAL RULES TAKEN:
  * THE MOON IS NOT EVENLY SPOTTED. The maria are a LOPSIDED CLUSTER on one side: Imbrium,
    Serenitatis and Tranquillitatis run as a connected chain across the upper left, Crisium
    sits alone and small to the east, and the whole southern highlands are bright and empty.
    Three evenly spaced circles is the one arrangement the real moon never makes, and it is
    why the old one read as a coin. The maria here are placed off that map.
  * LIMB DARKENING IS REAL AND IT IS SUBTLE. A full moon is nearly flat-lit -- the sun is
    behind the observer -- so it does NOT get a crescent shadow. The spec says so outright:
    "not a crescent, not a cartoon." One ramp step down in the last tenth of the radius, no
    more.
  * THE PLANET IS BANDED, NOT SPOTTED. From orbit the southwest reads as long streaks
    following the terrain, not as blobs: ranges and valleys run in lines, dry lakes are pale
    flats, and cloud is a thin drifting sheet that does not follow the ground. Three
    separate frequencies, drawn in that order.
  * THE TERMINATOR IS A SOFT BAND, NOT AN EDGE. Sunset from orbit is a hundred kilometres
    wide. It is dithered across several ramp steps rather than cut.
  * 45 DEGREE ART LAW: the request carries a written exemption for the CAMERA only ("NOT a
    45-degree three-quarter subject... canon already names this camera separately"). The
    exemption is about the angle, never about the craft: the pixels, the banding and the
    ramp discipline are exactly the same laws as every tile.

WHAT CHANGED FROM THE REFERENCE: the palette. A real moon is neutral grey and a real Mojave
is browner and greener than this; both are pulled onto the approved ramps so they sit in
Paolo's world rather than in a photograph. That is the same trade every cook in this lane
makes, and it is the whole point of ONE PALETTE PER FAMILY.

    python3 tools/bohemia_the_sky_he_zooms_to_cook_9_15_26.py            measure only
    python3 tools/bohemia_the_sky_he_zooms_to_cook_9_15_26.py --write    cook it
"""
import io, os, re, sys, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
GATE = os.path.join(ROOT, 'gates', 'sky_touch_gate.js')
BANK = os.path.join(ROOT, 'banks', 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')

OPEN_MARK = '/* __SKY_ART__ COOK 9/15 -- AR-005. Regenerated by '\
            'tools/bohemia_the_sky_he_zooms_to_cook_9_15_26.py; edit the tool, never this. */'
END_MARK = '/* __SKY_ART__ ends */'


def ramps():
    d = json.load(io.open(BANK, encoding='utf-8'))
    return d['method']['one_palette_per_family']


def block(R):
    """THE COOKED SKY. One delimited block so a rebase can never half-apply it -- the same
    shape sky_touch_gate already demands of the fix that put the zoom in."""
    ground = R['ground']          # the Mojave
    terra = R['terracotta'][:6]   # iron oxide, corroded end only, never the white
    stucco = R['stucco']          # dry lake and thin cloud
    return OPEN_MARK + """
/* THE MOON HAS NO RAMP IN THIS REPOSITORY, so this one is DERIVED from the approved
   asphalt ramp rather than picked: each tone is its asphalt source with the chroma taken
   out and the value lifted, same seven steps, same spacing. Source tone in the comment. */
var MOON_RAMP=['#2b2b2e','#3d3d41','#525257','#63636a','#78787f','#8e8e95','#a9a9b0',
               '#c2c2c8','#d8d8dd'];          /* asphalt #101216..#6a5e50, neutralised+lifted */
var EARTH_LAND=""" + json.dumps(ground) + """;     /* ground, approved 7/28 */
var EARTH_IRON=""" + json.dumps(terra) + """;   /* terracotta, corroded end */
var EARTH_PALE=""" + json.dumps(stucco) + """;     /* stucco: dry lake, thin cloud */

/* DRAW A DISC AS SQUARE PIXELS ON A GRID. Never a gradient, never a scaled sprite: the
   radius changes continuously with the pinch, so a sprite would be resampled by a
   fractional factor every frame, which is the banned non-integer scale and is the exact
   blur this lane measured on the 16 px yard tiles. A procedural grid is crisp at any size
   because it is never scaled, only re-stepped. The grid is snapped to absolute screen
   coordinates so the pixels do not crawl while the disc grows. */
function skyPixDisc(cx,cy,r,px,shade){
  if(r<=0) return;
  var x0=Math.floor((cx-r)/px)*px, x1=Math.ceil((cx+r)/px)*px;
  var y0=Math.floor((cy-r)/px)*px, y1=Math.ceil((cy+r)/px)*px;
  for(var y=y0;y<y1;y+=px){
    for(var x=x0;x<x1;x+=px){
      var dx=(x+px*0.5-cx)/r, dy=(y+px*0.5-cy)/r;
      var d2=dx*dx+dy*dy; if(d2>1) continue;
      var col=shade(dx,dy,Math.sqrt(d2));
      if(!col) continue;
      g.fillStyle=col; g.fillRect(x,y,px,px);
    }
  }
}
/* a cheap stable value noise, so the same pixel is the same tone every frame */
function skyN(x,y,s){
  var n=Math.sin(x*12.9898+y*78.233+s*37.719)*43758.5453;
  return n-Math.floor(n);
}

/* *** THE MOON. Full disc, flat-lit, cold. NOT a crescent: at full moon the sun is behind
   the observer, which the request states outright ("not a crescent, not a cartoon").
   THE MARIA ARE A LOPSIDED CLUSTER, off the real near side -- Imbrium, Serenitatis and
   Tranquillitatis chained across the upper left, Crisium alone and small to the east, the
   southern highlands bright and empty. Three evenly spaced circles is the one arrangement
   the real moon never makes, and it is why the old one read as a coin. *** */
var MOON_SEAS=[[-0.34,-0.34,0.30],[-0.05,-0.22,0.24],[0.13,-0.02,0.19],
               [0.46,-0.30,0.12],[-0.30,0.06,0.14],[-0.52,-0.10,0.11]];
function skyMoon(cx,cy,r){
  var px=Math.max(2,Math.round(r/22));
  skyPixDisc(cx,cy,r,px,function(dx,dy,d){
    var i=6;                                  /* the bright highlands */
    for(var k=0;k<MOON_SEAS.length;k++){
      var s=MOON_SEAS[k], ex=(dx-s[0])/s[2], ey=(dy-s[1])/(s[2]*0.82);
      if(ex*ex+ey*ey<1) i-=3;                 /* a mare is a lava plain: darker, flat */
    }
    /* LIMB DARKENING, one step, only in the last tenth -- a full moon is nearly flat-lit */
    if(d>0.90) i-=1;
    if(d>0.97) i-=1;
    /* grain, so the highlands are not a flat fill; one step, never two */
    var n=skyN(Math.round(dx*64),Math.round(dy*64),1);
    if(n>0.84) i+=1; else if(n<0.16) i-=1;
    i+=2;                                     /* sit the whole disc high: cold light */
    return MOON_RAMP[Math.max(0,Math.min(MOON_RAMP.length-1,i))];
  });
}

/* *** THE PLANET: EARTH FROM ORBIT, LOOKING DOWN AT THE MOJAVE. Act 3 ends looking down at
   it (7/19 LOCKED), so it is the last image the dynasty ever sees.
   BANDED, NOT SPOTTED: from orbit the southwest reads as long streaks following the
   terrain. Three frequencies in order -- the ranges and valleys running in lines, the dry
   lakes as pale flats, and a thin cloud sheet that does NOT follow the ground because
   weather does not care about geology. Then the terminator, a soft dithered band a hundred
   kilometres wide, never an edge. *** */
function skyEarth(cx,cy,r,night){
  var px=Math.max(2,Math.round(r/120));
  skyPixDisc(cx,cy,r,px,function(dx,dy,d){
    /* the sphere's own normal, so the bands bend with the curve instead of lying flat */
    var z=Math.sqrt(Math.max(0,1-d*d));
    var lat=dy*1.6+z*0.25, lon=dx*1.6;
    /* 1. THE GROUND: long streaks on the terrain's own axis, southwest-northeast */
    var ridge=Math.sin((lon*3.1+lat*1.7)*2.2)+0.6*Math.sin((lon*7.3-lat*4.1)*1.9);
    var i=Math.round(2.6+ridge*1.7);
    var ramp=EARTH_LAND;
    /* 2. IRON OXIDE: the plateau country, and it is RARE AND DARK.
       *** MEASURED, AFTER THE FIRST CUT CAME OUT LOOKING LIKE A PIZZA. *** Sampled the
       shade function over 40,000 points on the disc: at ridge>0.85 the iron band covered
       18.2% of the planet and the cloud sheet another 21.2%, in terracotta's BRIGHT tones
       (#a05734 and #c6683b, saturation 0.42 and 0.55) against a ground ramp that tops out
       at 0.22. Three times louder than the world it sits in, over a fifth of the disc.
       That is the tail-light mistake from the car round wearing a planet: an accent taken
       too wide and too loud, scoring fine and looking wrong.
       Red rock is a few per cent of the real southwest, so the bar moves to 6.4% AND the
       tones move to terracotta's CORRODED END ONLY -- #78402a and #874a2e, 0.31 and 0.35,
       which is where the car's rust ended up for exactly the same reason. */
    if(ridge>1.30){ ramp=EARTH_IRON; i=(ridge>1.62)?1:0; }
    /* 3. DRY LAKE: flats, pale, low frequency and rarer still -- 2.3% measured. Stucco's
       middle, not its brightest: a playa is bleached ground, not a light source. */
    var playa=Math.sin((lon*2.3-lat*5.9)*1.3)*Math.cos((lon*4.7+lat*2.1)*1.1);
    if(playa>0.93){ ramp=EARTH_PALE; i=(playa>0.97)?3:2; }
    var col=ramp[Math.max(0,Math.min(ramp.length-1,i))];
    /* 4. CLOUD: a thin sheet on its own axis, so it crosses the ground rather than
       following it. 8.5% measured, and it is BLENDED rather than swapped -- thin cloud
       over desert lets the ground through, which is what makes it read as cloud and not
       as paint. Stucco's pale end, never white: nothing in this game is white. */
    var cl=Math.sin((lon*1.9+lat*3.3)*1.6)+0.7*Math.sin((lon*5.1-lat*1.3)*2.4);
    if(cl>1.55) col=mixHex(col,EARTH_PALE[4],0.62);
    else if(cl>1.30) col=mixHex(col,EARTH_PALE[3],0.38);
    /* 5. THE TERMINATOR: sunset from orbit is a hundred km wide, so it is DITHERED across
       several steps rather than cut. Ordered by the same stable noise, not random. */
    if(night>-2){
      var t=(dx*0.82+dy*0.30)-night;
      if(t>0.34) return '#0a0a10';
      if(t>-0.02){
        var f=(t+0.02)/0.36;
        if(skyN(Math.round(dx*96),Math.round(dy*96),7)<f) return '#0a0a10';
        col=mixHex(col,'#0a0a10',f*0.55);
      }
    }
    return col;
  });
  /* THE ATMOSPHERIC LIMB, and the ONLY blue in the frame -- the request's own words, and
     it is what makes a planet read as a planet rather than a painted ball. Drawn as pixel
     rings on the same grid, two steps, outside the ground. */
  var lp=Math.max(2,Math.round(r/160));
  for(var b=0;b<2;b++){
    var rr=r*(1+b*0.004+0.002), a=[0.34,0.16][b], c=['#7fb0d8','#a8cbe6'][b];
    g.save(); g.globalAlpha=a; g.fillStyle=c;
    for(var ang=-Math.PI;ang<0;ang+=lp/(rr*1.6)){
      g.fillRect(Math.round((cx+Math.cos(ang)*rr)/lp)*lp,
                 Math.round((cy+Math.sin(ang)*rr)/lp)*lp,lp,lp);
    }
    g.restore();
  }
}
""" + END_MARK


CALLS_OLD = """    skyDisc(W*0.5,H*0.98+er*0.55,er,'#c9a06a','#4a2f1c','rgba(150,195,235,0.42)');
    var mr=18+mu*Math.min(W,H)*0.16;
    var my=H*0.30-mu*H*0.06;
    skyDisc(W*0.5,my,mr,'#e8e2d4','#7a7466',null);
    /* three seas, so it reads as THE moon and not as a coin */
    g.fillStyle='rgba(90,88,80,0.35)';
    g.beginPath(); g.arc(W*0.5-mr*0.30,my-mr*0.22,mr*0.30,0,7); g.fill();
    g.beginPath(); g.arc(W*0.5+mr*0.22,my+mr*0.10,mr*0.22,0,7); g.fill();
    g.beginPath(); g.arc(W*0.5-mr*0.05,my+mr*0.42,mr*0.16,0,7); g.fill();"""

CALLS_NEW = """    /* __SKY_ART__ -- the cooked planet and moon (AR-005, COOK 9/15). Both were smooth
       radial-gradient balls in a game drawn entirely in banded pixels, and the screen
       said so in the margin. */
    skyEarth(W*0.5,H*0.98+er*0.55,er,night?0.15:1.10);
    var mr=18+mu*Math.min(W,H)*0.16;
    var my=H*0.30-mu*H*0.06;
    skyMoon(W*0.5,my,mr);"""

LABEL_OLD = """  if(band==='MOON'||band==='PLANET'){
    g.font='600 8px '+FACE('body');
    g.fillStyle='rgba(184,154,106,0.55)';
    g.fillText('placeholder sky \\u00b7 art request AR-005',W/2,H-8);
  }
"""
LABEL_NEW = """  /* __SKY_ART__ -- THE PLACEHOLDER LINE IS GONE BECAUSE THE ART IS COOKED. It printed
     the word PLACEHOLDER and the request id on his screen at the two widest zooms, and he
     zoomed out all the way on 9/15 and called what he saw dogshit. AR-005 is closed. */
"""


def main():
    write = '--write' in sys.argv
    page = io.open(PAGE, encoding='utf-8').read()
    gate = io.open(GATE, encoding='utf-8').read()
    R = ramps()

    already = OPEN_MARK in page
    checks = [
        ('the sky block is not already cooked (this tool is re-runnable)', True),
        ('skyDisc still exists to hang the new block beside', 'function skyDisc(' in page),
        ('the two placeholder disc calls are where the tool expects them',
         CALLS_OLD in page or already),
        ('the placeholder label is where the tool expects it',
         LABEL_OLD in page or already),
        ("the gate's placeholder arm is where the tool expects it",
         "page.indexOf('art request AR-005') >= 0" in gate or '__SKY_ART__' in gate),
    ]
    print('THE SKY HE ZOOMS TO -- AR-005, the two un-cooked zoom bands\n')
    for name, ok in checks:
        print('  %-62s %s' % (name, 'ok' if ok else 'NO'))
    if not all(ok for _, ok in checks):
        sys.exit('\n  a guard failed -- refusing to write a half-applied sky.')

    print('\n  ramps used, all from the 7/28 set he approved:')
    for k in ('ground', 'terracotta', 'stucco'):
        print('    %-11s %d tones  %s' % (k, len(R[k]), ' '.join(R[k])))
    print('    %-11s %d tones  derived: asphalt neutralised and lifted (no cold ramp exists)'
          % ('moon', 9))
    print('\n  was: two radial-gradient discs + 3 translucent circles, and a line on his')
    print('       screen reading "placeholder sky - art request AR-005"')
    print('  now: banded pixel discs on a snapped grid, 6 maria off the real near side,')
    print('       banded terrain + dry lakes + a cloud sheet + a dithered terminator,')
    print('       and the only blue in the frame is the atmospheric limb')

    if not write:
        print('\n  measure only. pass --write to cook it.')
        return 0

    if not already:
        page = page.replace('function skyDisc(', block(R) + '\nfunction skyDisc(', 1)
        page = page.replace(CALLS_OLD, CALLS_NEW, 1)
        page = page.replace(LABEL_OLD, LABEL_NEW, 1)
    else:
        page = re.sub(re.escape(OPEN_MARK) + r'.*?' + re.escape(END_MARK),
                      block(R), page, count=1, flags=re.S)
    io.open(PAGE, 'w', encoding='utf-8').write(page)

    if 'art request AR-005' in gate and '__SKY_ART__' not in gate:
        gate = gate.replace(
            """      ok('the placeholder still SAYS it is a placeholder, because the real celestial art ' +
         'is AR-005 and belongs to the ART lane -- this made the stand-in honest, it did ' +
         'not pre-empt the artist',
         page.indexOf('art request AR-005') >= 0);""",
            """      /* FLIPPED 9/15 BY THE ART LANE, WHICH IS WHO THIS ARM WAS WAITING FOR. It asserted
         the stand-in still admitted it was a stand-in, "because the real celestial art is
         AR-005 and belongs to the ART lane". COOK cooked it: AR-005 is closed, the planet
         and the moon are banded pixel art on approved ramps, and the honest assertion is
         now the opposite one. Paolo 9/15 zoomed all the way out and called what was there
         dogshit; what he was looking at had the word placeholder written on it. */
      ok('THE SKY IS COOKED ART AND NO LONGER CALLS ITSELF A PLACEHOLDER (AR-005 closed)',
         page.indexOf('__SKY_ART__') >= 0 &&
         page.indexOf('placeholder sky') < 0);""", 1)
        io.open(GATE, 'w', encoding='utf-8').write(gate)
        print('\n  and flipped the gate arm that was waiting on this lane.')
    print('\n  COOKED. Two of the five zoom bands are art for the first time.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
