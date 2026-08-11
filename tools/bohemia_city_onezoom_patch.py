#!/usr/bin/env python3
"""
ONE ZOOM, ALL THE WAY TO THE MOON (8/12/26).

Paolo: "in the run how do we combine the city builder map with the map in the
phone. my original intention was that is was this zoom out vibe you could keep
zooming out and zooming out until it showed the moon you know. that was my
original philosophy and i want to stick with that thats my flavor."

THIS IS NOT A NEW IDEA. IT IS A DEFERRED ONE, AND THE FILE THAT DEFERRED IT SAYS
SO IN ITS LAST LINE. laws/BOHEMIA_ADDENDUM_CITYBUILDER_TOP_DOWN_ONLY_7_25_26.md,
LOCKED, his words:

    "As you zoom out on your character then at some point it organically becomes
     the city builder, and then if you keep zooming out you could see the rest of
     the world." ... keep it all "on this diamond isometric 45 degree angle view."

    STILL TO COME: the third zoom band (keep zooming out to see the rest of the
    world) - that touches the MAP surface (another lane), so coordinate, don't jam.

Two of the three bands were built on 7/25 and the third was parked pending a
coordination that never happened. Eighteen days.

AND IT IS THE SPINE OF THE GAME, not a vibe. laws/BOHEMIA_ADDENDUM_ACT3_MOONSHOT_
STRUCTURE_7_19_26.md, LOCKED: "the generations are Animal / Human / Angel and the
camera levels are street / city / planetary zoom. Act 3 was always Angel, always
the planetary level." Act 3 IS the one-way moonshot, and "the dynasty ends looking
down at the planet." So the zoom-out he is describing is the same axis as the
three generations, and the last thing the camera can reach is the place the story
ends. Pulling back to the moon on day 1 is the whole game, foreshadowed, in a
gesture.

WHAT WAS ACTUALLY IN THE WAY, and it was one line:

    z = Math.max(zmin, Math.min(zmax, z));      // setZoomAt

zmax already had a seam: pinch in at the closest city zoom and __ZOOM_SEAM__ hands
you to your character. zmin had a WALL. The valley fit the screen and that was the
end of the world.

WHAT SHIPS: the same seam, the other way. Keep pinching out at the full-valley fit
and the camera KEEPS GOING -- the valley diamond shrinks, the Mojave opens around
it, the atmosphere thins, the stars come out, the earth becomes a disc, and the
moon comes up into frame. Pinch back in and every one of those reverses down to
your own feet. ONE camera, ONE scalar, no second map, and the diamond never breaks
because it is the same iso projection the whole way -- his 7/25 law, honoured.

HOW THE PHONE'S MAP IS "COMBINED", which was his actual question. NOT by merging
two renderers into one file -- the phone's map SHOULD look like a phone's map,
that is what a phone is. They are combined by being the SAME WORLD AND THE SAME
CAMERA: tap a cell on the phone and the run's camera goes there. The phone stops
being a picture OF the valley and becomes a way INTO it, which is the only kind of
"one map" that means anything. (tools/bohemia_phone_jump_patch.py is that half.)

THE BANDS, by how far out you have pulled (u = 0 at the valley fit, 1 at the moon):
    u < 0.25   REGION    the Mojave floor around the valley, haze on the horizon
    u < 0.55   PLANET    the curve, the atmosphere rim going thin, first stars
    u <= 1.0   MOON      space, the earth a disc below, the moon up in frame

THE ART IS A PLACEHOLDER AND IT SAYS SO ON SCREEN. The earth and the moon here are
drawn procedurally from the palette this file already uses -- no bank has a planet
in it, because nobody has ever cooked one. AR-005 is filed in the art request queue
for real celestial art. The MECHANISM is the deliverable; the pixels are the ART
lane's, and when they land they drop into two functions.

THE 45 DEGREE ART LAW IS NOT BROKEN BY THIS. It governs objects seen in the
world's three-quarter view. A planet from orbit is not an object in the valley,
and canon already names this camera separately: "street / city / PLANETARY zoom"
(7/19, LOCKED). The valley diamond itself stays on the 45 the entire way out.

REUSE CHECK: opens no bank because none applies -- banks/ holds street props,
lamps, signs, walls and characters; there is no celestial art in the repository to
reuse, which is exactly why AR-005 is filed rather than cooked here. The sky
gradient, the desert floor and the haze reuse this file's own existing colour
constants (the night sky #101826 and the day sky #3a6a8a that renderCity already
fills with, and the desert tones in the valley palette).

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__ONE_ZOOM_TO_THE_MOON__'

# ---- the wall comes out of setZoomAt ---------------------------------------
OLD_CLAMP = """  if(z>zmax&&Math.abs(CZOOM-zmax)<1e-4&&typeof swapMode==='function'){ swapMode(); return; }
  z=Math.max(zmin,Math.min(zmax,z));"""
NEW_CLAMP = """  if(z>zmax&&Math.abs(CZOOM-zmax)<1e-4&&typeof swapMode==='function'){ swapMode(); return; }
  /* """ + MARK + """ -- THE SEAM RUNS THE OTHER WAY TOO (Paolo 8/12: "you could
     keep zooming out and zooming out until it showed the moon... that's my flavor").
     zmax already had a seam: pinch in at the closest city zoom and you become your
     character. zmin had a WALL -- the valley fit the screen and that was the end of
     the world. This is the same seam, outward: keep pulling out and the camera
     leaves the valley behind. The 7/25 law called this the third zoom band and
     parked it; the moonshot law (7/19) says the camera levels ARE street / city /
     planetary, so this axis is the game's spine, not a flourish. */
  if(z<zmin&&Math.abs(CZOOM-zmin)<1e-3){ skyEnter(); return; }
  z=Math.max(zmin,Math.min(zmax,z));"""

# ---- the sky itself ---------------------------------------------------------
GLUE = """
/* """ + MARK + """ -- THE THIRD BAND, and then two more.
   ONE SCALAR. SKYU runs 0 (the valley exactly fits the screen, which is where the
   city builder already lived) to 1 (the moon is up in frame). Every band is the
   SAME iso projection with a smaller tile, so the diamond never breaks -- that is
   his 7/25 law, "keep it all on this diamond isometric 45 degree angle view",
   and it is why this is a zoom rather than a cut to a different picture. */
var SKY=false, SKYU=0;
var SKY_BANDS=[[0.25,'REGION'],[0.55,'PLANET'],[1.01,'MOON']];
function skyBand(){ for(var i=0;i<SKY_BANDS.length;i++) if(SKYU<SKY_BANDS[i][0]) return SKY_BANDS[i][1]; return 'MOON'; }
function skyEnter(){ if(SKY)return; SKY=true; SKYU=0; window.__SKY_ENTER=(window.__SKY_ENTER||0)+1; updHud(); render(); }
function skyExit(){ if(!SKY)return; SKY=false; SKYU=0; window.__SKY_EXIT=(window.__SKY_EXIT||0)+1; updHud(); render(); }
/* one step of the same gesture that got him here. OUT raises SKYU; IN lowers it,
   and at 0 it hands back to the city builder, which hands back to his feet. */
function skyZoom(dir){
  if(!SKY)return;
  SKYU=Math.max(0,Math.min(1,SKYU+(dir>0?-0.06:0.06)));
  if(SKYU<=0&&dir>0){ skyExit(); return; }
  updHud(); render();
}

/* a star field that is the SAME stars every time -- a sky that reshuffles when you
   breathe on it reads as noise, not as a sky. Seeded off the valley's own seed. */
var SKY_STARS=null;
function skyStars(){
  if(SKY_STARS)return SKY_STARS;
  var s=(seed^0x5EED)>>>0, out=[];
  function r(){ s=(s*1103515245+12345)>>>0; return s/4294967296; }
  for(var i=0;i<220;i++) out.push([r(),r(),0.35+r()*0.65]);
  SKY_STARS=out; return out;
}

/* THE EARTH AND THE MOON ARE PLACEHOLDERS AND THEY SAY SO ON SCREEN.
   No bank in this repository has a planet in it, because nobody has ever cooked
   one -- ART REQUEST AR-005 is filed for the real thing. These two functions are
   where it drops in. Drawn from this file's own palette, nothing new invented. */
function skyDisc(cx,cy,r,lit,dark,rim){
  var gd=g.createRadialGradient(cx-r*0.35,cy-r*0.4,r*0.1,cx,cy,r);
  gd.addColorStop(0,lit); gd.addColorStop(1,dark);
  g.fillStyle=gd; g.beginPath(); g.arc(cx,cy,r,0,7); g.fill();
  if(rim){ g.strokeStyle=rim; g.lineWidth=Math.max(1,r*0.02); g.stroke(); }
}

function renderSky(){
  var W=cv.width,H=cv.height,u=SKYU,band=skyBand();
  var night=isNight();
  /* THE GROUND FALLS AWAY. Below u=0.25 you are still over the Mojave: the desert
     floor fills the frame and the valley sits in it. Past that the horizon curves
     and the sky darkens toward space. */
  var t=Math.min(1,u/0.55);                       /* 0 = atmosphere, 1 = space */
  var skyTop=mixHex(night?'#101826':'#3a6a8a','#05060b',t);
  var skyLow=mixHex(night?'#1a2436':'#7fa8c8','#05060b',Math.min(1,t*1.15));
  var gd=g.createLinearGradient(0,0,0,H);
  gd.addColorStop(0,skyTop); gd.addColorStop(1,skyLow);
  g.fillStyle=gd; g.fillRect(0,0,W,H);

  /* stars fade in as the air thins */
  var sa=Math.max(0,(u-0.18)/0.40); if(sa>0){
    var st=skyStars(); g.save(); g.globalAlpha=Math.min(1,sa);
    for(var i=0;i<st.length;i++){ g.fillStyle='rgba(232,226,207,'+st[i][2].toFixed(2)+')';
      g.fillRect(Math.round(st[i][0]*W),Math.round(st[i][1]*H*0.82),1,1); }
    g.restore(); }

  if(band==='MOON'){
    /* SPACE. The earth is a disc below and the moon comes up into frame -- the
       place Act 3 goes, and the place the dynasty ends looking back from. */
    var mu=(u-0.55)/0.45;
    var er=Math.max(28,H*0.62*(1-mu*0.72));
    skyDisc(W*0.5,H*0.98+er*0.55,er,'#7fa8c8','#16283a','rgba(180,220,255,0.35)');
    var mr=18+mu*Math.min(W,H)*0.16;
    var my=H*0.30-mu*H*0.06;
    skyDisc(W*0.5,my,mr,'#e8e2d4','#7a7466',null);
    /* three seas, so it reads as THE moon and not as a coin */
    g.fillStyle='rgba(90,88,80,0.35)';
    g.beginPath(); g.arc(W*0.5-mr*0.30,my-mr*0.22,mr*0.30,0,7); g.fill();
    g.beginPath(); g.arc(W*0.5+mr*0.22,my+mr*0.10,mr*0.22,0,7); g.fill();
    g.beginPath(); g.arc(W*0.5-mr*0.05,my+mr*0.42,mr*0.16,0,7); g.fill();
  } else {
    /* still over the world: the desert floor, and the valley drawn on it by the
       CITY's own renderer at a smaller tile, so this is the same picture the city
       builder draws -- not a second map of the same place. */
    var horizon=H*(0.42+u*0.36);
    g.fillStyle=mixHex('#8a7a58','#3a3226',Math.min(1,u/0.5));
    g.fillRect(0,horizon,W,H-horizon);
    g.save(); g.globalAlpha=Math.max(0,0.55-u); g.fillStyle='#d8c08a';
    g.fillRect(0,horizon-3,W,3); g.restore();
    var k=Math.max(0.06,1-u*3.2);
    var tw=TW,th=TH; TW=TW0*zoomBounds()[0]*k; TH=TH0*zoomBounds()[0]*k;
    try{ skyValley(horizon); }catch(_e){}
    TW=tw; TH=th;
  }

  /* THE LABEL, and the honest one about the art. */
  g.save();
  g.font='700 10px "Space Grotesk",system-ui,sans-serif'; g.textAlign='center';
  g.fillStyle='rgba(12,14,10,0.85)'; g.fillText(band,W/2+1,19);
  g.fillStyle='#b89a6a'; g.fillText(band,W/2,18);
  if(band==='MOON'||band==='PLANET'){
    g.font='600 8px "Space Grotesk",system-ui,sans-serif';
    g.fillStyle='rgba(184,154,106,0.55)';
    g.fillText('placeholder sky \\u00b7 art request AR-005',W/2,H-8);
  }
  g.restore();
  window.__SKY_DRAWN=(window.__SKY_DRAWN||0)+1;
}
/* the valley, drawn small, by the city's own projection */
function skyValley(horizon){
  var N=om.n;
  var ox=Math.round(cv.width/2-(city.x-city.y)*TW/2);
  var oy=Math.round(horizon-((city.x+city.y)*TH/2)+ (N*TH)/2*0 );
  for(var y=0;y<N;y++)for(var x=0;x<N;x++){
    var t=om.at(x,y); if(!t)continue;
    var p=iso(x,y,ox,oy);
    if(p.sx<-8||p.sy<-8||p.sx>cv.width+8||p.sy>cv.height+8)continue;
    g.fillStyle=skyTone(t.district);
    g.fillRect(p.sx-TW/2,p.sy,Math.max(1,TW),Math.max(1,TH));
  }
}
function skyTone(d){
  d=String(d||'');
  if(/strip|downtown/.test(d))return '#d8a742';
  if(/mountain/.test(d))return '#3b352b';
  if(/water|reservoir|lake/.test(d))return '#2f4a5e';
  if(/desert|wash|gypsum/.test(d))return '#8a7a58';
  if(/freeway|arterial|beltway|interchange|rail/.test(d))return '#33333c';
  return '#6a6258';
}
function mixHex(a,b,t){
  t=Math.max(0,Math.min(1,t));
  function h(s){ return [parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)]; }
  var A=h(a),B=h(b),o='#';
  for(var i=0;i<3;i++){ var v=Math.round(A[i]+(B[i]-A[i])*t); o+=('0'+v.toString(16)).slice(-2); }
  return o;
}
"""

# ---- render() and the gestures ---------------------------------------------
OLD_RENDER = "function render(){ try{ dayDistrictCheck(); }catch(_e){}   /* __DAY_LOOP__ */"
NEW_RENDER = ("function render(){ try{ dayDistrictCheck(); }catch(_e){}   /* __DAY_LOOP__ */\n"
              "  if(SKY){ screenFilter('city'); renderSky(); return; }   /* " + MARK + " */")

OLD_WHEEL = """    if(MODE!=='city')return; e.preventDefault();
    const c=toCv(e);
    setZoomAt(CZOOM*(e.deltaY<0?1.14:0.877), c.x, c.y);"""
NEW_WHEEL = """    if(SKY){ e.preventDefault(); skyZoom(e.deltaY<0?1:-1); return; }   /* """ + MARK + """ */
    if(MODE!=='city')return; e.preventDefault();
    const c=toCv(e);
    setZoomAt(CZOOM*(e.deltaY<0?1.14:0.877), c.x, c.y);"""

# the WHOLE MAP button becomes the way back down without a pinch
OLD_FIT = """document.getElementById('fitbtn').addEventListener('click',()=>{
  if(MODE!=='city')return;"""
NEW_FIT = """document.getElementById('fitbtn').addEventListener('click',()=>{
  if(SKY){ skyExit(); return; }   /* """ + MARK + """: one tap back down to the valley */
  if(MODE!=='city')return;"""

# the HUD says where you are
OLD_HUD = "function updHud(){"
NEW_HUD = ("function updHud(){\n"
           "  if(typeof SKY!=='undefined'&&SKY){   /* " + MARK + " */\n"
           "    try{\n"
           "      document.getElementById('hmode').textContent=skyBand();\n"
           "      document.getElementById('hslot').textContent='ZOOM OUT';\n"
           "      document.getElementById('hclock').textContent=clockStr();\n"
           "      const ml=document.getElementById('modeLbl'); if(ml)ml.textContent='\\u2193 BACK';\n"
           "    }catch(_e){}\n"
           "    return;\n"
           "  }")


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [
        ('the zmin wall', OLD_CLAMP, NEW_CLAMP),
        ('render', OLD_RENDER, NEW_RENDER),
        ('wheel', OLD_WHEEL, NEW_WHEEL),
        ('whole map button', OLD_FIT, NEW_FIT),
        ('hud', OLD_HUD, NEW_HUD),
    ]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)

    anchor = 'function applyRestore(st){'
    if anchor not in s:
        sys.exit('FAIL: applyRestore not found')
    s = s.replace(anchor, GLUE + '\n' + anchor, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
