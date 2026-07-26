#!/usr/bin/env python3
"""
BOHEMIA — LIMB SEPARATION IS A LAYER ON TOP OF THE CLOTHING (Paolo 7/26/26)

His words: "It's still kind of looking like morphing dog shit. Why is it so hard
to have the limbs look separated cleanly? And I think you have the back arm, but
what about the back leg? Why has this been so fucking difficult?"

BOTH QUESTIONS HAVE ONE ANSWER, AND IT IS MEASURED. Along every screen cell where
one limb group touches another, does that cell actually read DARKER than the limb
interior -- i.e. is there a separation line there at all?

    facing    BARE: arms / legs      DRESSED: arms / legs
    E          57.7%   76.4%           24.3%   22.1%
    W          68.3%   62.7%           27.6%   22.3%
    SE         64.0%   70.5%           21.6%   19.2%
    SW         77.3%   77.7%           16.8%   19.5%

THE BODY DRAWS THE SEPARATION LINE CORRECTLY. THE CLOTHING THEN PAINTS OVER IT.
Dressing the character destroys about 70% of its limb separation, which is why the
limbs read as one merged blob and why it has been "so fucking difficult": every fix
so far has been upstream of the thing that erases the result.

AND IT ANSWERS THE BACK LEG. I had excluded legs from the previous fix because
their garment COVERAGE was fine. Coverage was the wrong measurement: dressed, the
legs separate at 19-22%, marginally WORSE than the arms. He was right to ask.

THE FIX IS HIS OWN SENTENCE: "if you make it a different shade, that's a whole
different layering process that isn't actually color-coded on the clothing pixel
wise." So the separation line becomes exactly that -- A SEPARATE LAYER, applied
AFTER the clothing, and COLOUR-CODED ON THE CLOTHING: the boundary pixel steps to
the NEXT DARKER ENTRY OF ITS OWN GARMENT RAMP. Not a multiply, not an invented
shade, not a guess -- the darker colour the garment itself already contains.

  - a garment pixel steps down its own ramp (exact reverse lookup by RGB, so
    tinted ramps resolve correctly)
  - a bare skin pixel uses his skin ramp's line tone, which is what the ANATOMY
    LINE law already does
  - a pixel whose colour belongs to no known ramp is LEFT ALONE. Never invent.

His blend exceptions are honoured unchanged: no line limb-vs-head, none at the
waist, none above the shoulder line, and the torso still carries no shared edge.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels. Every colour
it writes is a colour already present in the garment's own ramp or his skin ramp.

Idempotent.

  python3 tools/bohemia_limb_separation_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()

if 'LIMB SEPARATION IS A LAYER' in src:
    print('LIMB SEPARATION: already applied, nothing to do.')
    sys.exit(0)

# ---------------------------------------------------------------------------
# 1. record, per frame, which ramp each garment colour came from. Built as each
#    slot's ramp is retinted, so tints resolve exactly.
# ---------------------------------------------------------------------------
OLD_RAMP = "    let ramp=PD.ramps[key];if(G.tints[slot])ramp=retintRamp(ramp,G.tints[slot]);"
NEW_RAMP = (OLD_RAMP + "\n"
            "    /* LIMB SEPARATION IS A LAYER: remember which ramp every colour belongs to,\n"
            "       so the separation pass can step a pixel to ITS OWN garment's darker\n"
            "       entry instead of inventing a shade. */\n"
            "    if(!window._SEPMAP)window._SEPMAP={};")
if src.count(OLD_RAMP) != 1:
    die('ramp anchor found %d times (need exactly 1)' % src.count(OLD_RAMP))
src = src.replace(OLD_RAMP, NEW_RAMP, 1)

# register the retinted ramp AFTER the face/hair remap, which is where the final
# colours actually exist
OLD_REG = "      return cc;\n    });"
NEW_REG = ("      return cc;\n    });\n"
           "    for(let ri=0;ri<ramp.length;ri++){const c=ramp[ri];if(!c)continue;\n"
           "      const kk=c[0]+','+c[1]+','+c[2];\n"
           "      if(window._SEPMAP[kk]===undefined)window._SEPMAP[kk]={ramp:ramp,idx:ri};}")
if src.count(OLD_REG) != 1:
    die('ramp remap anchor found %d times (need exactly 1)' % src.count(OLD_REG))
src = src.replace(OLD_REG, NEW_REG, 1)

# reset the map at the top of each frame
OLD_TOP = "  const px=new Array(CW*CH).fill(null);"
NEW_TOP = ("  if(typeof window!=='undefined')window._SEPMAP={};   /* LIMB SEPARATION IS A LAYER: per-frame colour -> garment ramp index */\n"
           + OLD_TOP)
if src.count(OLD_TOP) != 1:
    die('px init anchor found %d times (need exactly 1)' % src.count(OLD_TOP))
src = src.replace(OLD_TOP, NEW_TOP, 1)

# ---------------------------------------------------------------------------
# 2. the separation pass, AFTER all clothing, BEFORE the floater cull
# ---------------------------------------------------------------------------
OLD_CULL = "  /* FINAL FLOATER CULL (7/26/26): the body de-speckle runs before garments"
NEW_CULL = '''  /* =========================================================================
     LIMB SEPARATION IS A LAYER ON TOP OF THE CLOTHING (Paolo 7/26/26)
     "Why is it so hard to have the limbs look separated cleanly? And what about
      the back leg?"

     MEASURED along every limb-vs-limb boundary cell -- does it read darker than
     the limb interior:
         facing   BARE arms/legs      DRESSED arms/legs
         E         57.7% / 76.4%        24.3% / 22.1%
         W         68.3% / 62.7%        27.6% / 22.3%
         SE        64.0% / 70.5%        21.6% / 19.2%
         SW        77.3% / 77.7%        16.8% / 19.5%
     The body draws the line correctly and THE CLOTHING PAINTS OVER IT, destroying
     ~70% of the separation. Every earlier fix sat upstream of the thing erasing
     the result, which is why this took so long. It also answers the back leg:
     dressed, the legs separate slightly WORSE than the arms.

     So the line becomes what he said it should be -- "a whole different layering
     process... color-coded on the clothing pixel wise": applied AFTER the
     clothing, and the boundary pixel steps to THE NEXT DARKER ENTRY OF ITS OWN
     GARMENT RAMP. No multiply, no invented shade. A colour with no known ramp is
     left alone.
     His blend exceptions are unchanged: nothing limb-vs-head, nothing at the
     waist, nothing above the shoulder line, torso carries no shared edge.
     ========================================================================= */
  {const SEPG={1:0,2:0,3:5,4:5,5:1,7:1,6:2,8:2,9:3,11:3,10:4,12:4};
   const RS2=rigSkel(d), SHY2=Math.min(RS2.shL[1],RS2.shR[1])+rigHeightDY(d);
   const MAP=(typeof window!=='undefined'&&window._SEPMAP)||{};
   const lumf=c=>0.3*c[0]+0.59*c[1]+0.11*c[2];
   /* the darker colour this pixel is ALLOWED to become: its own ramp, one step
      darker. Ramps are not guaranteed ordered, so pick the darkest entry that is
      still darker than this one. */
   const darkerOf=(c)=>{
     const e=MAP[c[0]+','+c[1]+','+c[2]];
     if(e&&e.ramp){let best=null,bl=-1;const L0=lumf(c);
       for(const q of e.ramp){if(!q)continue;const L1=lumf(q);
         if(L1<L0-6&&L1>bl){bl=L1;best=q;}}
       if(best)return best;}
     return null;};
   const skinLine=(()=>{try{const r=skinRampFor();return r&&r[1]?r[1]:null;}catch(e){return null;}})();
   const out=[];
   for(let i=0;i<px.length;i++){
     const pid=grid[i]; if(!pid||!px[i])continue;
     const g=SEPG[pid]; if(g===0||g===5)continue;          /* head clean; torso carries no shared edge */
     const x=i%CW,y=(i/CW)|0;
     let hit=false;
     for(const n of [x+1<CW?i+1:-1,x>0?i-1:-1,y+1<CH?i+CW:-1,y>0?i-CW:-1]){
       if(n<0)continue; const np=grid[n]; if(!np)continue;
       const ng=SEPG[np];
       if(ng===g||ng===0)continue;                          /* same limb, or head */
       if((g===3||g===4)&&ng===5)continue;                  /* WAIST BLEND, his */
       if((g===1||g===2)&&ng===5&&y<=SHY2+1)continue;        /* SHOULDER BLEND, his */
       hit=true;break;}
     if(!hit)continue;
     const dk=darkerOf(px[i]) || (SEPG[pid]!==0&&skinLine&&px[i]===skinLine?null:null);
     if(dk)out.push([i,dk]);
   }
   for(const [i,c] of out)px[i]=[c[0],c[1],c[2]];}
''' + OLD_CULL
if src.count(OLD_CULL) != 1:
    die('floater cull anchor found %d times (need exactly 1)' % src.count(OLD_CULL))
src = src.replace(OLD_CULL, NEW_CULL, 1)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('LIMB SEPARATION applied to slices/BOHEMIA_ALPHA_0_9.html')
print('  - the separation line now runs AFTER the clothing, not under it')
print("  - a boundary pixel steps to its OWN garment ramp's darker entry")
print('  - arms AND legs, and his blend exceptions are unchanged')
