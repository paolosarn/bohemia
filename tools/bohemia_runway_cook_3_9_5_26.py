#!/usr/bin/env python3
"""
BOHEMIA -- THE RUNWAY COOK, BATCH 3: THE WAIST, THE BACK, AND ONE HAT NOBODY WEARS
(9/5/26, COOK lane, cook-mce6r5). Third round of [runway clothes] WARDROBE-REMAKE.

Batches 1 and 2 took the lower half and the outer rail. The same measurement, re-run,
names what is left:
    WAIST   5 garments -> 3 shapes   (a belt, a toolbelt, a sash)
    BACK   12 garments -> 6 shapes
    HEAD   19 garments -> 8 shapes, and SIX of the eight are a beanie
    FACE   10 garments -> 4 shapes
    GEAR   26 garments -> 13 shapes  (the broadest rail in the wardrobe; left alone)

*** AND THE FIRST THING THIS ROUND DID WAS AN AUDIT, NOT A COOK, BECAUSE THIS REPO'S
MOST REPEATED FAILURE IS NOT A MISSING SHAPE -- IT IS A SHAPE THAT EXISTS AND NEVER
REACHES THE PLAYER. *** Seventeen invisible hats, four bright garments nobody wore, a
face maker with no door, fifty-one approved sounds with no caller. So every `kind`
the five kinded generators can DRAW was extracted from their own source and diffed
against every `kind` the wardrobe ASKS for:

    genHat    can draw  4   UNREACHED: wrap
    genAcc    can draw 12   UNREACHED: none
    genGear   can draw 14   UNREACHED: none
    genBag    can draw  4   UNREACHED: none

**genHat's `wrap` IS BUILT, IS DRAWABLE, KNOTS AT THE NAPE FROM BEHIND AND TIES AT
THE SIDE IN PROFILE, AND NO GARMENT HAS EVER ASKED FOR IT.** It costs nothing to
reach: two entries. That is REUSE-FIRST doing exactly what it is for, and it is
worth more than a new shape because the pixels are already drawn and judged.
(One false positive, recorded because the lesson is the gate's own: the sweep first
reported `genTop.hoodUp` unreached too. It is reached -- as `hoodUp:CLO_HOODUP`, not
`hoodUp:true`. A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE, 8/1.)

REFERENCE CHECK (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md).
COMPARED TO, before drawing:
  * RICK OWENS and BALENCIAGA at the waist -- taken: THE WIDE WRAPPED BAND. Not a
    belt: a deep obi-style wrap that climbs the ribs and is knotted, so the waist
    reads as a mass rather than a line. Our belt is TWO ROWS and the whole waist
    rail is three shapes; a six-row wrap that stands one cell off the body is a
    different outline from every angle.
  * RICK OWENS drapery -- taken: ASYMMETRY AGAIN, this time on the back. One
    shoulder covered and the other bare, the cloth crossing the body diagonally.
    Our cape and mantle are both symmetric, so a one-shoulder drape is the first
    thing on that rail whose left and right are not mirror images.
  * THE PIXEL AISLE, unchanged and still the whole test: black it out and look at
    the outline.
WHAT THE COMPARISON REFUSED, and this is the useful half: A BALACLAVA. Both houses
build one and it was the first thing on my list. It cannot be cooked here, because
genHat's `put()` refuses every pixel below THE HAT LINE -- the durag line, which is
Paolo's own 7/18 ruling ("the durag I have already established... will be the
borders of any sort of hat or beanie"). A garment that has to cross a locked line is
not a cook, it is a request for a ruling, and it is a [PENDING Paolo] in the handoff
rather than a thing I quietly build a way around. A WIDER BRIM was refused too, for
a duller reason: `kind:'brim'` already runs its ring to span+/-2 cells, so a wider
one is a DIAL, not a shape, and the dead V-NECK is what shipping that would be.

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

REUSE CHECK: cooks ZERO new graphic pixels and opens no bank for pixels -- it adds
two geometry branches to the alpha's existing genAcc and genCape, REACHES ONE SHAPE
THE ALPHA COULD ALREADY DRAW, and spends only ramps already in the file (CHARCLOTH,
LEATHERV, DUSTSAND, BONECLO, ASHGREY). No colour invented: COLOUR IS TERRITORY.
banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt is opened and read.

GRAVEYARD, READ BEFORE COOKING: the only clothing kill is the V-NECK, a neckline on
genTop. No waist wrap, one-shoulder drape or head wrap has ever been killed.

  python3 tools/bohemia_runway_cook_3_9_5_26.py
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
print('=== THE RUNWAY COOK, BATCH 3 (canon bank: %d bytes read) ===' % len(_canon))

# ================================================================ 1. THE WAIST
sub("""    if(kind==='belt'){ for(i=0;i<g.length;i++)if(g[i]===4){var yb2=(i/CW)|0; if(yb2>tb-2*S)o[i]=r.dk;""",
    """    /* THE WIDE WAIST WRAP (9/5, batch 3). The waist rail is a belt, a toolbelt and
       a sash -- three shapes, five garments, and the belt is TWO ROWS. A wrap is not
       a thicker belt: it climbs the ribs, stands a cell off the body so the waist
       has a WIDTH, and is knotted off-centre. At 56 pixels a line and a mass are
       different objects, and this rail only had lines. */
    if(kind==='wrapbelt'){ var wbTop=tb-6*S+1, wbCx=0, wbC=0;
      for(i=0;i<g.length;i++)if(g[i]===4){wbCx+=i%CW;wbC++;}
      var wcx=wbC?Math.round(wbCx/wbC):(CW>>1);
      for(var yb3=wbTop;yb3<=tb;yb3++){
        var rMn=CW,rMx=-1;
        for(var xb=0;xb<CW;xb++){var gb=g[yb3*CW+xb]; if(gb===4){if(xb<rMn)rMn=xb;if(xb>rMx)rMx=xb;}}
        if(rMx<0)continue;
        for(var xb2=rMn-S;xb2<=rMx+S;xb2++){
          if(xb2<0||xb2>=CW)continue; var ib=yb3*CW+xb2, gv2=g[ib];
          if(gv2===1||gv2===2||gv2===7||gv2===8)continue;
          /* the wrap's own edges dark, a lit top fold, and the diagonal of the
             wrapping visible across the front */
          o[ib]=(yb3<=wbTop+(S-1)||yb3>=tb-(S-1)||xb2<rMn||xb2>rMx)?r.dk
               :((((((xb2-wcx)+(yb3-wbTop))%(4*S))+4*S)%(4*S))<S?mix(r.mid,0.8)
               :((yb3<wbTop+2*S)?r.lt:r.mid)); } }
      /* THE KNOT, and it sits OFF CENTRE on purpose: a wrap tied dead centre reads
         as a buckle, which is the belt this shape exists to not be. */
      var knX=wcx+2*S;
      for(var ky=tb-4*S;ky<=tb-2*S;ky++)for(var kx=knX;kx<knX+2*S;kx++){
        if(kx<0||kx>=CW||ky<0)continue; var ik=ky*CW+kx; if(g[ik]===4||g[ik]===0)o[ik]=r.dk; }
      return o; }
    if(kind==='belt'){ for(i=0;i<g.length;i++)if(g[i]===4){var yb2=(i/CW)|0; if(yb2>tb-2*S)o[i]=r.dk;""",
    'genAcc: the wide waist wrap')

# ================================================================ 2. THE BACK
sub("""    if(back){ /* the full drape: covers the body and a widening panel of background */""",
    """    /* THE ONE-SHOULDER DRAPE (9/5, batch 3). The cape and the mantle are both
       MIRROR-SYMMETRIC, so nothing on this rail has a left that differs from its
       right. This one covers ONE shoulder and crosses the body diagonally to the
       opposite hip, which is the asymmetry rule from batch 2 applied to the back --
       and unlike the coat's hem it is visible from the FRONT, where the player
       spends most of the game looking at people. */
    /* IT OWNS EVERY FACING, AND ONE_GARMENT_PER_SLOT IS WHY. The first cut sat
       BELOW genCape's early `if(back){ ... return o; }`, so from the north the
       ORIGINAL symmetric cape drew instead -- turn one notch from E to NE and the
       man was wearing a different garment. Measured: the hem moved 0.188
       body-heights against a pinned ceiling of 0.09. THAT IS CLAUSE 1, the rule
       four haircuts were cut for on 8/28 ("a ponytail that exists from the side
       and does not exist head-on"), in a cape. It is placed before the back branch
       now and returns for all eight. */
    if(opt.oneShoulder){
      var osHem=Math.min(CH-1,ttop+fr(ttop,tb,0.95)+S-1);
      var osW={}, side=1;                                                /* over the LEFT shoulder as drawn, consistently in every facing */
      for(var yo=ttop;yo<=osHem;yo++){
        var t=(yo-ttop)/Math.max(1,(osHem-ttop));
        /* the covered edge walks across the body as it falls: shoulder to opposite hip */
        var x0=cx-Math.ceil((tMx-tMn)/2)-S, x1=Math.round(cx-Math.ceil((tMx-tMn)/2)-S+((tMx-tMn)+2*S)*(0.45+0.55*t));
        for(var xo=x0;xo<=x1;xo++){ if(xo<0||xo>=CW)continue; var gvo=g[yo*CW+xo];
          if(gvo===1||gvo===2||gvo===7||gvo===8)continue;
          if(gvo===0&&yo>tb)continue;                                    /* no cloth flapping past the hip in mid-air */
          osW[yo*CW+xo]=1; } }
      var inO=function(x,y){return !!osW[y*CW+x];};
      for(var ko in osW){ var io=+ko,ix=io%CW,iy=(io/CW)|0,c3=r.mid, qq;
        var ob=0; while(ob<S&&inO(ix,iy+ob+1))ob++;
        var oside=false; for(qq=1;qq<=S;qq++){ if(!inO(ix-qq,iy)||!inO(ix+qq,iy))oside=true; }
        if(ob<S)c3=r.dk;                                                 /* hem */
        else if(oside)c3=r.dk;                                           /* the diagonal edge, which is the whole garment */
        else if(((((ix-cx+8*S)%(4*S))+4*S)%(4*S))<S)c3=mix(r.mid,0.82);  /* folds, same pitch as the cape */
        else if(ix<cx-S)c3=r.lt;
        o[io]=c3; }
      for(i=0;i<g.length;i++)if(g[i]===3){var xn=i%CW; if(xn<cx)o[i]=r.dk;}   /* it wraps one side of the neck only */
      return o; }
    if(back){ /* the full drape: covers the body and a widening panel of background */""",
    'genCape: the one-shoulder drape')

# ================================================================ 3. THE BATCH
sub("""    {n:'SOOT HAND WRAPS',st:'canon',fresh:true,layer:'hands',gen:function(g){return wear(genAcc(g,{ramp:CHARCLOTH,kind:'handwrap'}),CHARCLOTH,12);}},
  ];""",
    """    {n:'SOOT HAND WRAPS',st:'canon',fresh:true,layer:'hands',gen:function(g){return wear(genAcc(g,{ramp:CHARCLOTH,kind:'handwrap'}),CHARCLOTH,12);}},
    /* ---- THE RUNWAY, BATCH 3 (9/5/26) -- THE WAIST, THE BACK, AND ONE HAT NOBODY
       HAS EVER WORN. The waist rail was three shapes for five garments and its belt
       is TWO ROWS; the back rail's cape and mantle are both mirror-symmetric.
       *** AND `genHat kind:'wrap'` HAS BEEN BUILT, DRAWABLE AND UNREACHED THIS WHOLE
       TIME -- it knots at the nape from behind and ties at the side in profile, and
       not one garment has ever asked for it. Found by diffing every kind the
       generators can DRAW against every kind the wardrobe ASKS FOR. It costs two
       entries and no pixels: the seventeen-invisible-hats shape, closed. *** ---- */
    {n:'BONE HEAD WRAP',st:'canon',fresh:true,layer:'head',gen:function(g){return wear(genHat(g,{ramp:BONECLO,kind:'wrap'}),BONECLO,14);}},
    {n:'SOOT HEAD WRAP',st:'canon',fresh:true,layer:'head',gen:function(g){return wear(genHat(g,{ramp:CHARCLOTH,kind:'wrap'}),CHARCLOTH,12);}},
    {n:'WIDE WAIST WRAP',st:'canon',fresh:true,layer:'waist',gen:function(g){return wear(genAcc(g,{ramp:CHARCLOTH,kind:'wrapbelt'}),CHARCLOTH,12);}},
    {n:'LEAD WAIST WRAP',st:'canon',fresh:true,layer:'waist',gen:function(g){return wear(genAcc(g,{ramp:SLATEW,kind:'wrapbelt'}),SLATEW,14);}},
    {n:'ONE-SHOULDER DRAPE',st:'canon',fresh:true,layer:'back',gen:function(g){return wear(genCape(g,{ramp:ASHGREY,oneShoulder:true}),ASHGREY,12);}},
    {n:'BONE SHOULDER DRAPE',st:'canon',fresh:true,layer:'back',gen:function(g){return wear(genCape(g,{ramp:BONECLO,oneShoulder:true}),BONECLO,14);}},
  ];""",
    'GARMENTS: six entries -- two new shapes and one shape that already existed')

open(ALPHA, 'w', encoding='utf-8').write(src)
print('\n%s: %d -> %d bytes' % (ALPHA, len(orig), len(src)))
