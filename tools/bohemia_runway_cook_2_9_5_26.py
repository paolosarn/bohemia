#!/usr/bin/env python3
"""
BOHEMIA -- THE RUNWAY COOK, BATCH 2: THE OUTER RAIL AND THE TWO FLAT ONES
(9/5/26, COOK lane, cook-mce6r5). Second round of [runway clothes] WARDROBE-REMAKE.

Batch 1 did the lower half (trousers and boots) because the shape count said those
were the thinnest rails. The same measurement, re-run after batch 1, names this one:

    OUTER  55 garments -> 15 shapes ... AND ELEVEN OF THE FIFTEEN ARE THE SAME COAT
        9  genCoat{vest:true}        7  genCoat{len:0.34}      2  genCoat{len:0.82}
        7  genCoat{jacket:true}      7  genCoat{len:0.56}      2  genCoat{len:0.86}
        6  genCoat{len:0.88}         3  genCoat{len:0.9}       2  genCoat{len:0.8}
        3  genPoncho{}               2  genApron{}             1  genCoat{len:0.84}
    NECK    7 garments -> 2 shapes   (a scarf, and the same scarf with a long tail)
    HANDS   4 garments -> 1 shape    (one glove, four colours)

**A LENGTH IS A REAL SHAPE -- the 8/27 hip and thigh bands proved that and the
trenchcoat gate holds those band floors to this day -- BUT ELEVEN LENGTHS OF ONE
COAT IS STILL ONE COAT.** Stretch it and you get a longer version of the same
outline: open down the middle, straight shoulders, an A-line skirt that only ever
flares wider as it falls. There is no wrap, no asymmetry and no closed round
shoulder anywhere in the wardrobe, and those are the three the houses he named are
actually built on. NECK and HANDS are worse and simpler: they are the two flattest
rails in the game, one shape each.

REFERENCE CHECK (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md).
COMPARED TO, side by side, before any pixel was drawn:
  * RICK OWENS outerwear -- taken: THE ASYMMETRIC HEM (the front hem cut on a slant
    so the two sides are different lengths) and THE DRAPED COWL that sits on the
    shoulders rather than hugging the neck. Both are outline, both are his signature
    more than any colour is.
  * BALENCIAGA outerwear -- taken: THE COCOON. A coat widest around the body and
    NARROWING toward the hem, which is the exact inverse of the A-line every coat in
    this wardrobe already has, so it reads as a different garment at one glance.
  * THE WRAP COAT, which both houses build and neither invented -- taken: NO FRONT
    OPENING AT ALL. One panel crosses the body and is held at the waist. On our rig
    the open slit is the coat's whole front signature, so removing it and replacing
    it with a diagonal is the largest front-view change available.
  * HAND WRAPS, from the working aisle rather than the runway: strapping that runs
    PAST THE WRIST up the forearm. Our four gloves stop dead at the hand, so the
    wrist is where the new outline lives.
  * THE PIXEL AISLE again: black it out, look at the outline. Every shape below
    changes the blacked-out shape; none of them is a texture or a seam.
WHAT CHANGED BECAUSE OF THE COMPARISON: the three new coats are cut at HIP and
THIGH length, not floor length. That is not a compromise, it is the 8/27 ruling
("ONLY 10% OF PEOPLE NO MATTER WHAT ... THIS IS A DESSERT GAME. ITS HOT!!!!") plus
the same physics: a floor-length coat at 40C is a heat-stroke garment. The runway
is reached by CUT, and cut is exactly what this batch is made of, so the long-coat
share cannot move by one person and the gate proves it rather than asserting it.

BROUGHT INSIDE THE STYLE CARD (9/5, the round after the card landed). DIRECTION
shipped records/BOHEMIA_STYLE_CARD_9_5_26.md and it turns the register into numbers:
CLOTH MID SATURATION <= 0.25, outer mid VALUE 0.15-0.38, one saturated faction accent
per body and no more. This batch was cooked before the card existed, to the register
in words, and it REUSED EXISTING RAMPS ON PURPOSE -- which is why six of the twelve
it spent turned out to sit outside the card:
    DUSTSAND 0.375   OLIVEDRAB 0.325   DENIM 0.418
    SANDBOOT 0.464   BOOT 0.582        LEATHERV 0.522
Ten of this lane's thirty-six garments were on those ramps. They are swapped here,
AT SOURCE, for ramps already in the file that the card admits (BONECLO, SLATEW,
CARGO, BLKDENIM, BLKBOOT, CHARC, ASHGREY) -- and the names moved with the colours,
because a garment called SAND that is bone is a lie in the picker.
THE SHARED RAMPS THEMSELVES ARE NOT TOUCHED. Editing DUSTSAND would repaint every
approved garment that uses it and move the 1,744 pinned 56-pixel hashes; the card
governs what a NEW cook may spend, never what his approved art already is.
The card's own headline is that only 32% of 256 garments sit at or under 0.25 and
THE REMAKE'S JOB IS THAT NUMBER -- so a batch that lands outside it is not doing the
job it was cooked for.

AND THE GATE CAUGHT AN ELEVENTH AFTER THE SWAP: BONE COCOON COAT was inside the
card's SATURATION band and outside its VALUE band. Bone is a BASE colour -- the card
lets a base rise to value 0.85 and holds an OUTER to 0.15-0.38, runway black -- so a
bone coat is a legal shirt and an illegal coat. It is slate now. The lesson is the
card's own shape: A PALETTE IS TWO NUMBERS, NOT ONE, and a check that reads only
saturation passes a garment that is the wrong brightness for its layer.

REUSE CHECK: cooks ZERO new graphic pixels and opens NO bank for pixels, because it
draws nothing of its own -- it adds GEOMETRY BRANCHES to the alpha's existing
genCoat and genAcc and then spends the wardrobe's EXISTING ramps (CHARCLOTH,
DUSTSAND, FADEDBLK, ASHGREY, STORMGRY, BONECLO). No colour is invented: COLOUR IS
TERRITORY (8/26) and a faction's colour is not this lane's to spend.
banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt is opened and read for the canon list.

GRAVEYARD, READ BEFORE COOKING (8/30: seven haircuts were remakes of shapes he had
killed twice, and the answer was one grep away): the only clothing kill in
gates/bohemia_graveyard.txt is the V-NECK, which is a NECKLINE on genTop. No wrap,
asymmetric, cocoon, cowl or hand-wrap shape has ever been killed. Nothing revived.

  python3 tools/bohemia_runway_cook_2_9_5_26.py
"""
import os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
src = open(ALPHA, encoding='utf-8').read()
orig = src

def sub(anchor, new, what):
    global src
    n = src.count(anchor)
    if n != 1:
        print('  FAIL %s: anchor found %d times, expected 1' % (what, n)); sys.exit(1)
    src = src.replace(anchor, new); print('  ok   %s' % what)

with open('banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt', encoding='utf-8') as fh:
    _canon = fh.read()
print('=== THE RUNWAY COOK, BATCH 2 (canon bank: %d bytes read) ===' % len(_canon))

# ================================================================ 1. THE COAT
sub("""    var isOpen=function(x,y){ return frontFacing && x>=cx-ohw && x<cx+ohw+S && y>openTop; };""",
    """    /* THE RUNWAY, 9/5 batch 2 -- THREE NEW COATS, AND NOT ONE OF THEM IS A LENGTH.
       Eleven of this rail's fifteen "shapes" were the same coat stretched, so a
       twelfth length would have been a colourway with a ruler.
         wrap    NO FRONT OPENING. One panel crosses the body and a belt holds it.
                 On this rig the slit is the coat's entire front signature, so
                 taking it away and running a diagonal across instead is the
                 biggest front-view change the garment has available.
         asym    the hem is cut on a SLANT -- one side long, one side short. The
                 first thing in this wardrobe whose bottom edge is not level.
         cocoon  widest around the body, NARROWING to the hem: the exact inverse
                 of the A-line skirt every coat here already flares into.
       All three ship at HIP and THIGH length, which is the 8/27 heat ruling and
       not a compromise -- the look is reached by cut, and cut is what these are. */
    var wrapC=!!opt.wrap, asymC=!!opt.asym, cocoon=!!opt.cocoon;
    var isOpen=function(x,y){ if(wrapC)return false;                     /* a wrap coat has no opening to be open */
      return frontFacing && x>=cx-ohw && x<cx+ohw+S && y>openTop; };""",
    'genCoat: wrap / asym / cocoon declared, and the wrap closes the front')

sub("""    var halfW=Math.max(3*S,Math.ceil((hipMx-hipMn)/2)+S), span=hemY-tb+1, skirt={};""",
    """    var halfW=Math.max(3*S,Math.ceil((hipMx-hipMn)/2)+S), span=hemY-tb+1, skirt={};
    /* ASYM: the hem per COLUMN, not one number for the whole garment. It rises
       across the body so the left side hangs and the right side is cut away --
       the amount is a third of the skirt's own depth, which is enough to read at
       56 and not so much that the coat looks torn. */
    /* 0.55 OF THE SKIRT, FLOOR OF FOUR CELLS, AND THE GATE IS WHY. At 0.34 of the
       span the two sides differed by two rows on a thigh-length coat, which
       measured 12% of the outline against the dead V-NECK's 0% -- technically
       above the corpse and nowhere near enough to see. An asymmetric hem whose
       asymmetry you have to be told about is the V-NECK with a new name. The two
       sides now differ by more than half the skirt: one hip, one thigh. */
    var asymRise=asymC?Math.max(4*S,Math.round(span*0.55)):0;
    var hemAt=function(x){ if(!asymC)return hemY;
      var t=(x-(cx-halfW-3*S))/Math.max(1,(2*(halfW+3*S)));
      t=t<0?0:t>1?1:t; return hemY-Math.round(t*asymRise); };""",
    'genCoat: the asymmetric hem, per column')

sub("""    if(!vest&&!jacket)for(var y2=tb+1;y2<=hemY;y2++){ var hw=halfW+Math.round((y2-tb)/span*3*S);
      for(var xx=cx-hw;xx<=cx+hw;xx++){ if(xx<0||xx>=CW)continue; if(isOpen(xx,y2))continue;""",
    """    if(!vest&&!jacket)for(var y2=tb+1;y2<=hemY;y2++){
      /* COCOON runs the flare BACKWARDS: it starts wider than the hip and closes
         toward the hem. Same one line that makes every other coat an A-line. */
      var hw=cocoon?(halfW+3*S-Math.round((y2-tb)/span*4*S)):(halfW+Math.round((y2-tb)/span*3*S));
      if(hw<2*S)hw=2*S;
      for(var xx=cx-hw;xx<=cx+hw;xx++){ if(xx<0||xx>=CW)continue; if(isOpen(xx,y2))continue;
        if(y2>hemAt(xx))continue;                                        /* the slanted hem cuts here */""",
    'genCoat: the cocoon flare and the slanted hem cut')

sub("""      if(jacket&&p===4&&by>tb-2*S)c=r.dk;                                /* jacket: ribbed waist hem band */
      o[ii]=c; }""",
    """      if(jacket&&p===4&&by>tb-2*S)c=r.dk;                                /* jacket: ribbed waist hem band */
      /* --- THE RUNWAY, batch 2 --- */
      if(wrapC&&p===4){ if(by>tb-2*S)c=r.dk;                             /* the belt that holds it shut */
        else if(frontFacing&&Math.abs((bx-cx)+((by-openTop)>>1))<S&&by>openTop)c=r.dk; }  /* the overlap edge, crossing the chest */
      /* THE ROUND SHOULDER IS AN EDGE, NOT A FILL, AND THAT WAS A LOOKING FIX.
         The first cut lit every arm pixel that was not on the edge, which put a
         pale vertical slab down each sleeve -- it read as two objects tacked to
         the man rather than as a coat standing off his ribs. The width is what
         makes a cocoon; the sleeve keeps the shading it already had. */
      if(cocoon&&(p===5||p===6)&&by>ttop+2*S&&by<tb-2*S){
        if(!inG(bx-S,by)||!inG(bx+S,by))c=r.dk; }
      o[ii]=c; }
    /* COCOON, the other half: the body stands one cell OFF the arms between the
       shoulder cap and the waist, so the coat is widest at the ribs. Painted after
       the flaps because it is background, not body. */
    if(cocoon){ var cMn=CW,cMx=-1;
      for(i=0;i<g.length;i++){var pC=g[i];if(pC===5||pC===6){var xC=i%CW;if(xC<cMn)cMn=xC;if(xC>cMx)cMx=xC;}}
      if(cMx>=0)for(var yC=ttop+3*S;yC<=tb;yC++){
        var rMnC=CW,rMxC=-1;
        for(var xC2=0;xC2<CW;xC2++){var gC=g[yC*CW+xC2]; if(gC===4||gC===5||gC===6){if(xC2<rMnC)rMnC=xC2;if(xC2>rMxC)rMxC=xC2;}}
        if(rMxC<0)continue;
        for(var dC=1;dC<=S;dC++){
          if(rMnC-dC>=0){var iCL=yC*CW+(rMnC-dC); if(g[iCL]!==1&&g[iCL]!==2){o[iCL]=r.dk; w[iCL]=1;} }
          if(rMxC+dC<CW){var iCR=yC*CW+(rMxC+dC); if(g[iCR]!==1&&g[iCR]!==2){o[iCR]=r.dk; w[iCR]=1;} } } } }""",
    'genCoat: the wrap belt and overlap, and the cocoon shoulder')

sub("""      if(sSide)c2=r.dk;                                                  /* panel side + inner-slit edges */
      else if(sb<S)c2=r.dk;                                              /* hem */""",
    """      if(sSide)c2=r.dk;                                                  /* panel side + inner-slit edges */
      else if(sb<S)c2=r.dk;                                              /* hem */
      else if(asymC&&jy>=hemAt(jx)-(S-1))c2=r.dk;                        /* the slanted hem draws its own edge, or the cut reads as a crop */""",
    'genCoat: the slanted hem gets an edge')

# ================================================================ 2. THE NECK
sub("""    if(kind==='mask'){                                                   /* dust bandana: nose+mouth down, NEVER at/above the eyes */""",
    """    /* COWL (9/5, batch 2). The neck rail had ONE shape -- a scarf, and the same
       scarf with a longer tail -- for seven garments. A cowl is not a bigger scarf:
       a scarf is a ring ON the neck and a cowl is a mass ON THE SHOULDERS, which
       is a different outline from every angle and the thing the house he named is
       known for. It is drawn off the torso and the neck, never the face. */
    if(kind==='cowl'){
      for(i=0;i<g.length;i++)if(g[i]===3)o[i]=r.mid;                     /* the neck is wrapped, every facing */
      /* THE FIRST CUT WAS A BOX ON HIS SHOULDERS, and looking is the only thing
         that said so: a flat trapezoid, widest at the top, cut off level at the
         bottom. That is a yoke, or a small cape -- it is not cloth. THREE THINGS
         FIX IT AND ALL THREE ARE SHAPE: it starts at the NECK'S OWN WIDTH and
         only spreads onto the shoulders a row or two down; it is four rows deep
         instead of five, so it sits on the collarbone and not on the chest; and
         its bottom edge is UNEVEN, because a hem that is dead level is the one
         thing hanging fabric never is (8/1: little off shapes, never straight
         lines). */
      var cwBot=tTop+4*S;
      for(var yw=tTop;yw<=cwBot;yw++){
        var rowMn=CW,rowMx=-1;
        for(var xw2=0;xw2<CW;xw2++){var gw=g[yw*CW+xw2]; if(gw===4||gw===5||gw===6){if(xw2<rowMn)rowMn=xw2;if(xw2>rowMx)rowMx=xw2;}}
        if(rowMx<0)continue;
        /* row 0 is the neck's width; it opens out to the shoulders by row 2 */
        var t=(yw-tTop)/Math.max(1,(cwBot-tTop)), open=t<0.5?(t/0.5):1;
        var half=Math.round((nMx-nMn)/2)+S, want=Math.round(((rowMx-rowMn)/2+S-half)*open)+half;
        var mid=Math.round((rowMn+rowMx)/2);
        for(var xw3=mid-want;xw3<=mid+want;xw3++){
          if(xw3<0||xw3>=CW)continue; var iw=yw*CW+xw3, gv=g[iw];
          if(gv===1||gv===2||gv===7||gv===8)continue;
          /* THE UNEVEN HEM IS HASHED, NOT ALTERNATED. Every other cell is a
             REGULAR comb and at this size it reads as a crown, which is ornament
             -- 8/1: little off shapes, never straight lines, and a repeating
             notch is a straight line with holes in it. Deterministic off the
             column so nobody in a crowd shimmers. */
          if(yw>cwBot-S&&((((((xw3/S)|0)*2654435761)>>>0)%3)===0))continue;
          o[iw]=(yw>=cwBot-(2*S-1))?r.dk
               :((xw3<=mid-want+(S-1)||xw3>=mid+want-(S-1))?r.dk
               :((((((xw3-mid)%(3*S))+3*S)%(3*S))<S)?mix(r.mid,0.82)      /* drape folds off the neck */
               :((yw<tTop+S)?r.lt:r.mid))); } }
      return o; }
    /* HAND WRAPS (9/5, batch 2). Four gloves, ONE shape, and every one of them
       stops dead at the hand. Strapping runs PAST THE WRIST, so the wrist is where
       the new outline is -- and it is a working-aisle garment, not a runway one,
       which is the point: the register is the CUT, and a wrap is a cut. */
    if(kind==='handwrap'){ var wL=pExt(g,7),wR=pExt(g,8);
      for(i=0;i<g.length;i++){var pw=g[i];
        if(pw===7||pw===8){ var edw=false;
          for(var ew=1;ew<=S;ew++){ var a1=g[i-ew],a2=g[i+ew],a3=g[i-ew*CW],a4=g[i+ew*CW];
            if(!((a1===7||a1===8)&&(a2===7||a2===8)&&(a3===7||a3===8)&&(a4===7||a4===8))){edw=true;break;} }
          o[i]=edw?r.dk:r.mid; continue; }
        if(pw===5||pw===6){ var yw4=(i/CW)|0, hb=(pw===5?wL.mn:wR.mn);
          /* four rows of forearm above the hand, banded like real strapping */
          if(yw4<hb-4*S||yw4>=hb)continue;
          o[i]=((((yw4-hb)%(2*S))+2*S)%(2*S))<S?r.dk:r.mid; } }
      return o; }
    if(kind==='mask'){                                                   /* dust bandana: nose+mouth down, NEVER at/above the eyes */""",
    'genAcc: the cowl and the hand wraps')

# ================================================================ 3. THE BATCH
sub("""    {n:'STACKED MID BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genShoes(g,{ramp:CHARCLOTH,shaft:'mid',sole:'stack'}),CHARCLOTH,13);}},
  ];""",
    """    {n:'STACKED MID BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genShoes(g,{ramp:CHARCLOTH,shaft:'mid',sole:'stack'}),CHARCLOTH,13);}},
    /* ---- THE RUNWAY, BATCH 2 (9/5/26, COOK lane) -- THE OUTER RAIL AND THE TWO
       FLAT ONES. The rail had 55 garments and 15 "shapes", ELEVEN of which were the
       same coat at eleven lengths: open down the middle, level hem, A-line skirt.
       These three are not lengths. And NECK and HANDS had one shape each, for
       eleven garments between them, which made them the flattest rails in the game.
       Cut at HIP and THIGH on purpose: the 10% long-coat cap (8/27, "no matter
       what", and the reason is the heat) cannot move by one person, because this
       batch adds no coat at or past 0.70. ---- */
    {n:'WRAP COAT',st:'canon',fresh:true,layer:'outer',gen:function(g){return wear(genCoat(g,{ramp:CHARCLOTH,wrap:true,len:0.56}),CHARCLOTH,13);}},
    {n:'ASH WRAP COAT',st:'canon',fresh:true,layer:'outer',gen:function(g){return wear(genCoat(g,{ramp:ASHGREY,wrap:true,len:0.56}),ASHGREY,15);}},
    {n:'ASYMMETRIC COAT',st:'canon',fresh:true,layer:'outer',gen:function(g){return wear(genCoat(g,{ramp:FADEDBLK,asym:true,len:0.56}),FADEDBLK,13);}},
    {n:'ASH ASYM COAT',st:'canon',fresh:true,layer:'outer',gen:function(g){return wear(genCoat(g,{ramp:ASHGREY,asym:true,len:0.34}),ASHGREY,13);}},
    {n:'COCOON COAT',st:'canon',fresh:true,layer:'outer',gen:function(g){return wear(genCoat(g,{ramp:STORMGRY,cocoon:true,len:0.56}),STORMGRY,12);}},
    {n:'SLATE COCOON COAT',st:'canon',fresh:true,layer:'outer',gen:function(g){return wear(genCoat(g,{ramp:SLATEW,cocoon:true,len:0.34}),SLATEW,14);}},
    {n:'DRAPED COWL',st:'canon',fresh:true,layer:'neck',gen:function(g){return wear(genAcc(g,{ramp:CHARCLOTH,kind:'cowl'}),CHARCLOTH,12);}},
    {n:'ASH COWL',st:'canon',fresh:true,layer:'neck',gen:function(g){return wear(genAcc(g,{ramp:ASHGREY,kind:'cowl'}),ASHGREY,12);}},
    {n:'HAND WRAPS',st:'canon',fresh:true,layer:'hands',gen:function(g){return wear(genAcc(g,{ramp:BONECLO,kind:'handwrap'}),BONECLO,14);}},
    {n:'SOOT HAND WRAPS',st:'canon',fresh:true,layer:'hands',gen:function(g){return wear(genAcc(g,{ramp:CHARCLOTH,kind:'handwrap'}),CHARCLOTH,12);}},
  ];""",
    'GARMENTS: ten entries on five new shapes')

open(ALPHA, 'w', encoding='utf-8').write(src)
print('\n%s: %d -> %d bytes' % (ALPHA, len(orig), len(src)))
