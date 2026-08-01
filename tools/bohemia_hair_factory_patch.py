#!/usr/bin/env python3
"""BOHEMIA -- THE HAIR FACTORY (8/1/26). Idempotent alpha patch.

Paolo 8/1: "cook me a hairstyles and think about how to put it in properly so I
can thumbs up and thumbs it down all your attempts into the UI ... cook up as
many hairstyles as you possibly can".

WHY THIS IS A FACTORY AND NOT 26 DRAWINGS (FACTORY LAW): a hairstyle is not a
picture, it is a set of DIALS over the skull his rig already defines -- how much
volume sits above the crown, how far the mass falls down the sides, where the
front line crosses the forehead, whether it flares, whether it is tied, and
whether the mass is solid or broken into ropes. Every style below is those dials
with different numbers. Adding the 27th is one line, not one drawing.

STRUCTURE-NOT-COLOR (7/19, LOCKED): these are SHAPES. Every style is a distinct
silhouette -- a recolour would be filler and is never the headline. Colour ramps
exist only so a shape can be seen; the progress here is 26 new geometries in a
category that previously had exactly ONE.

WHAT IT IS BUILT ON, and why it cannot fight the rig: genHair measures the head
from the PART GRID the way genHat does -- part 1 (skull) and part 2 (face) give
the bounds, the per-row span and the face centroid, per facing, AFTER the body
dials have warped it. So hair fits a tall thin citizen and a short broad one
without knowing either exists. It never reads or writes rig pixels.

THE FACE IS SACRED, exactly as it is to a hat. On FRONT facings hair may cross
the forehead down to its front line and NOT ONE ROW FURTHER -- it can never
reach the eyes. On BACK facings it covers the whole skull, which is the existing
HAIR COVER LAW already in the alpha. Below the jaw, hair on a front facing may
only paint BACKGROUND: long hair hangs BEHIND the shoulders, so it must not
paint over the body. On a back facing it may paint over the back.

REUSE CHECK: (REUSE-FIRST, Paolo 7/22) before cooking, I read the existing
garment generators in the alpha -- genHat (slices/BOHEMIA_ALPHA_0_9.html, the
head-region idiom: hMn/hMx/hTop/hBot from parts 1|2, span(y), fcx, front/back
by facing, and put() refusing to paint the body) and genAcc (zone-locking). This
generator is genHat's measurement code reused wholesale; only the mass rules are
new, because a hat stops at the durag line and hair does not. Colour: the
existing HAIR_COLORS constant already in the alpha (Paolo's 7 values) is reused
for the ramps rather than inventing a palette. Nothing was copied from banks/
because no hair art exists there -- that is the entire reason for this file.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads the part grid, never the rig
package; writes an overlay dict, never a rig pixel. It cannot reshape a painted
region because it never has one in hand.
  built on: genHat
  joints: none named
  parts: 1=skull, 2=face
"""
import sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
ALPHA = ROOT / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
src = ALPHA.read_text()

if 'function genHair(' in src:
    print('HAIR FACTORY: already applied, nothing to do')
    sys.exit(0)

# --------------------------------------------------------------- 1. GENERATOR
GEN_ANCHOR = "  function genAcc(g,opt){"
GEN = r'''  /* ===== THE HAIR FACTORY (Paolo 8/1: "cook up as many hairstyles as you
     possibly can"). A hairstyle is DIALS over the skull the rig already gives
     us, measured per facing after the body dials have warped it:
       vol    rows of mass above the crown        (0 flat .. 3 pompadour)
       side   how far the mass falls, as a multiple of head height
              (0.30 cap, 0.62 ear, 1.0 jaw, 1.7 shoulder, 2.6 long)
       front  how far down the forehead it crosses on FRONT facings. Hard
              ceiling: it may never reach the eye line. A hat's law is the
              durag line; hair's law is the brow.
       flare  extra half-width per row down (afro/shag)
       back   extra rows at the BACK only (mullet, tail)
       strip  narrow the mass to a centre band (mohawk)
       tie    'pony' | 'bun' | 'top' -- a bound mass with an ornament
       tex    'solid' | 'locs' | 'braid' -- ropes/rows instead of a mass
     STRUCTURE-NOT-COLOR: these are silhouettes. The ramp only makes them
     visible. ===== */
  function genHair(g,opt){
    var r=opt.ramp,i,o={};
    var hMn=CW,hMx=-1,hTop=CH,hBot=-1;
    for(i=0;i<g.length;i++){var p=g[i]; if(p===1||p===2){var x=i%CW,y=(i/CW)|0;
      if(x<hMn)hMn=x; if(x>hMx)hMx=x; if(y<hTop)hTop=y; if(y>hBot)hBot=y;}}
    if(hMx<0)return {};
    var fTop=CH,fsx=0,fsc=0,fBot=-1;
    for(i=0;i<g.length;i++)if(g[i]===2){var fy=(i/CW)|0; if(fy<fTop)fTop=fy; if(fy>fBot)fBot=fy; fsx+=i%CW; fsc++;}
    var fcx=fsc?fsx/fsc:(hMn+hMx)/2;
    var dir=(typeof curDir!=='undefined')?curDir:'S';
    var front=(dir==='S'||dir==='SE'||dir==='SW'), back=(dir==='N'||dir==='NE'||dir==='NW');
    var hH=Math.max(1,hBot-hTop), hcx=Math.round((hMn+hMx)/2);
    var span=function(y){ var mn=CW,mx=-1; for(var x=0;x<CW;x++){var gv=g[y*CW+x];
      if(gv===1||gv===2){if(x<mn)mn=x;if(x>mx)mx=x;}} return mx<0?null:[mn,mx]; };
    /* THE BROW CEILING. On a front facing the eyes are the top of the painted
       face region; hair stops ABOVE them, always, whatever the style asks for. */
    var brow=(fsc&&front)?Math.max(hTop+1,fTop+1):hTop+Math.round(hH*0.34);
    var frontLine=Math.min(brow, hTop+Math.round(hH*(opt.front!=null?opt.front:0.22)));
    var vol=opt.vol||0, sideF=(opt.side!=null?opt.side:0.62), flare=opt.flare||0;
    var backEx=(back||!front)?(opt.back||0):0, strip=opt.strip||0, tie=opt.tie||null, tex=opt.tex||'solid';
    var sideBot=hTop+Math.round(hH*sideF);
    var put=function(x,y,col){ if(x<0||x>=CW||y<0||y>=CH)return;
      var hi=y*CW+x, gv=g[hi];
      if(y<=hBot){ /* ON the head: skull + background always; the face only from behind */
        if(gv===0||gv===1){ o[hi]=col; return; }
        if(gv===2&&(back||y<=frontLine)){ o[hi]=col; return; }
        return; }
      /* BELOW the jaw hair may paint the body. THE FIRST VERSION FORBADE THIS and
         every long style silently rendered as a short one: below the jaw there is
         no empty space, there is TORSO, so "background only" gave the fall nowhere
         to go. LONG LOOSE, SHOULDER LENGTH, WOLF CUT and LOCS all came out looking
         like crops. It is also just wrong -- hair falls IN FRONT of the shoulders.
         What keeps it honest is the curtain rule below, which allows only the two
         lateral masses past the jaw on a front facing, never a sheet across the
         chest. */
      o[hi]=col; };
    /* --- the mass ------------------------------------------------------- */
    var topRow=hTop-vol;
    for(var y=topRow;y<=sideBot+backEx;y++){
      var s=span(Math.max(hTop,Math.min(y,hBot)));
      if(!s)continue;
      var mn=s[0],mx=s[1];
      if(y<hTop){ mn+=1; mx-=1; }                                  /* the crown tapers as it rises */
      var grow=Math.round(flare*Math.max(0,y-hTop));
      mn-=grow; mx+=grow;
      if(strip){ mn=hcx-strip; mx=hcx+strip; }
      if(y>hBot){                                                  /* past the jaw: the fall narrows */
        var t=y-hBot; mn+=Math.min(2,(t/3)|0); mx-=Math.min(2,(t/3)|0); }
      if(front&&y>frontLine){
        /* front facing, below the front line: the mass is only at the SIDES --
           never across the face, and never a sheet down the chest. Two curtains,
           left and right, all the way down however far the style falls. (The
           first version capped this at the jaw, which is why nothing long read
           as long.) */
        var fs=span(Math.min(y,hBot)); if(!fs)continue;
        var w=Math.max(1,Math.round((fs[1]-fs[0]+1)*0.22));
        for(var xl=mn;xl<fs[0]+w;xl++) put(xl,y,(xl===mn)?r.dk:r.mid);
        for(var xr=fs[1]-w+1;xr<=mx;xr++) put(xr,y,(xr===mx)?r.dk:r.mid);
        continue; }
      for(var x=mn;x<=mx;x++){
        if(tex==='locs'&&((x-mn)%3===2))continue;                  /* ropes with gaps between */
        if(tex==='braid'&&y>hTop&&((y-hTop)%2===1)&&((x-mn)%2===1))continue;
        var edge=(x===mn||x===mx||y===topRow);
        put(x,y, edge?r.dk : (y===topRow+1?r.lt:r.mid)); } }
    /* --- the tie: a bound mass reads as an ornament plus a fall ---------- */
    if(tie){
      var tx=hcx, ty=hTop+Math.round(hH*0.2);
      if(tie==='top'){ for(var by=topRow-3;by<topRow;by++)for(var bx=hcx-2;bx<=hcx+2;bx++)
          put(bx,by,(bx===hcx-2||bx===hcx+2||by===topRow-3)?r.dk:r.mid); }
      else if(tie==='bun'&&!front){ for(var uy=ty;uy<ty+5;uy++)for(var ux=hcx-3;ux<=hcx+3;ux++)
          put(ux,uy,(ux===hcx-3||ux===hcx+3)?r.dk:r.mid); }
      else if(tie==='pony'&&!front){ var pl=Math.round(hH*1.2);
        for(var py=hBot;py<hBot+pl;py++){ var pw=(py<hBot+2)?2:1;
          for(var px=tx-pw;px<=tx+pw;px++) put(px,py,(px===tx-pw||px===tx+pw)?r.dk:r.mid); } } }
    return o; }
'''
if GEN_ANCHOR not in src:
    sys.exit('HAIR FACTORY: genAcc anchor not found')
src = src.replace(GEN_ANCHOR, GEN + GEN_ANCHOR, 1)

# --------------------------------------------------------------- 2. THE RAMPS + THE STYLES
RAMP_ANCHOR = "  var GARMENTS=window.GARMENTS=["
RAMPS = r'''  /* HAIR RAMPS. Reused from the alpha's own HAIR_COLORS (Paolo's 7 values)
     plus the greys a lived-in city needs. Colour is NOT the progress here --
     STRUCTURE-NOT-COLOR -- these exist so a silhouette can be read. */
  var H_BLK={dk:[16,15,13],mid:[32,30,27],lt:[54,50,45]};
  var H_BRN={dk:[46,32,22],mid:[82,58,38],lt:[116,86,58]};
  var H_SND={dk:[96,74,40],mid:[150,120,80],lt:[196,166,112]};
  var H_RUS={dk:[74,32,20],mid:[124,58,34],lt:[168,88,52]};
  var H_GRY={dk:[62,62,68],mid:[104,104,112],lt:[148,148,156]};
  var H_WHT={dk:[130,130,138],mid:[186,186,194],lt:[228,228,236]};
  var H_ACD={dk:[58,88,26],mid:[110,164,52],lt:[158,208,96]};
'''
STYLES = r'''    /* ===== HAIR (8/1): 26 SHAPES. The category had exactly ONE (his painted
       curtain-bob, which stays his and is untouched). STRUCTURE-NOT-COLOR:
       every entry below is a different SILHOUETTE, not a recolour. ===== */
    {n:'BUZZ CUT',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:0,side:0.30,front:0.16});}},
    {n:'SHAVED FADE',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BRN,vol:0,side:0.22,front:0.12});}},
    {n:'CROP',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BRN,vol:1,side:0.44,front:0.20});}},
    {n:'FLATTOP',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:2,side:0.30,front:0.10});}},
    {n:'POMPADOUR',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:3,side:0.40,front:0.08});}},
    {n:'SLICK BACK',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:1,side:0.52,front:0.06});}},
    {n:'SIDE PART',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_SND,vol:1,side:0.50,front:0.26});}},
    {n:'BOWL CUT',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BRN,vol:1,side:0.66,front:0.32});}},
    {n:'FRINGE',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:0,side:0.58,front:0.34});}},
    {n:'SHAG',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BRN,vol:1,side:0.82,front:0.30,flare:0.10});}},
    {n:'CHIN BOB',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:0,side:1.02,front:0.26});}},
    {n:'SHOULDER LENGTH',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_SND,vol:0,side:1.60,front:0.24});}},
    {n:'LONG LOOSE',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BRN,vol:0,side:2.40,front:0.22});}},
    {n:'MULLET',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_RUS,vol:1,side:0.46,front:0.18,back:9});}},
    {n:'WOLF CUT',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:2,side:1.30,front:0.30,back:8,flare:0.08});}},
    {n:'MOHAWK',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:3,side:0.34,front:0.10,strip:2});}},
    {n:'LIBERTY SPIKES',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_ACD,vol:3,side:0.28,front:0.08,strip:3,tex:'locs'});}},
    {n:'HAIR AFRO',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:3,side:0.72,front:0.24,flare:0.30});}},
    {n:'HIGH TOP',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:3,side:0.32,front:0.12,strip:4});}},
    {n:'HAIR LOCS',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:1,side:2.10,front:0.20,tex:'locs'});}},
    {n:'CORNROWS',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:0,side:0.50,front:0.16,tex:'braid'});}},
    {n:'BRAIDED TAIL',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BRN,vol:0,side:0.48,front:0.18,tex:'braid',tie:'pony'});}},
    {n:'PONYTAIL',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_SND,vol:1,side:0.46,front:0.20,tie:'pony'});}},
    {n:'TOP KNOT',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_BLK,vol:0,side:0.40,front:0.16,tie:'top'});}},
    {n:'LOW BUN',st:'dead',layer:'hair',gen:function(g){return genHair(g,{ramp:H_GRY,vol:0,side:0.60,front:0.22,tie:'bun'});}},
    {n:'GREY WISPS',st:'canon',layer:'hair',gen:function(g){return genHair(g,{ramp:H_WHT,vol:0,side:0.56,front:0.10});}},
'''
if RAMP_ANCHOR not in src:
    sys.exit('HAIR FACTORY: GARMENTS anchor not found')
src = src.replace(RAMP_ANCHOR, RAMPS + RAMP_ANCHOR + '\n' + STYLES, 1)

# --------------------------------------------------------------- 3. COMPOSITE ORDER
OLD_ORD = "    const ORD=['base','legs','feet','outer','waist','gear','back','neck','hands','head','face'];"
NEW_ORD = ("    /* HAIR sits UNDER headwear and OVER the body: a hat covers hair, hair covers\n"
           "       a collar. Inserted before 'head' for exactly that reason. */\n"
           "    const ORD=['base','legs','feet','outer','waist','gear','back','neck','hands','hair','head','face'];")
if OLD_ORD not in src:
    sys.exit('HAIR FACTORY: composite ORD not found')
src = src.replace(OLD_ORD, NEW_ORD, 1)

ALPHA.write_text(src)
print('HAIR FACTORY: applied (genHair + 26 shapes + composite order)')
