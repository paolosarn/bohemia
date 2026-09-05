#!/usr/bin/env python3
"""
BOHEMIA -- THE RUNWAY COOK, BATCH 4: THE FACE, THE LAST RAIL WITH ROOM
(9/5/26, COOK lane, cook-mce6r5). Fourth round of [runway clothes] WARDROBE-REMAKE.

Three batches took the lower half, the outer rail, the waist and the back. The
measurement, re-run, leaves exactly one rail with room, and it says so with a
NEGATIVE result that is worth as much as the positive ones:

    GEAR   26 garments -> 13 kinds.  All 13 rendered and run against each other
           through runway_gate's own four-axis ruler: 78 OF 78 PAIRS PASS. The
           broadest rail in the wardrobe and it has no disguised-colourway problem
           at all. IT GETS NOTHING. Padding a healthy rail is volume for its own
           sake, which is the thing STOP PRODUCING is named after.
    FACE   10 garments -> 4 shapes, and its 4 pass 6 of 6 against each other too.
           Thin in COUNT, honest in SHAPE. This is the one rail left.

TWO NEW SHAPES, and the face is the hardest place in this wardrobe to put one,
because three separate rulings already live on it.

REFERENCE CHECK (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md)
and THE STYLE CARD (records/BOHEMIA_STYLE_CARD_9_5_26.md, DIRECTION 9/5).
  * BALENCIAGA eyewear -- taken: THE SHIELD. Not a pair of lenses on a face: one
    continuous band that runs PAST the head on both sides, so the head's own
    outline gets wider at the eye line. Our two pairs of shades sit inside the
    silhouette; nothing in the wardrobe widens the head.
  * RICK OWENS and the whole covered-face register -- taken: WRAPPED BULK. Cloth
    that goes round the jaw rather than lying flat on it, so the jaw reads THICKER
    than the skull rather than the same width. Our dust mask is a flat plane
    inside the head's outline by construction.
  * THE PIXEL AISLE: black it out and look. Both of these change the blacked-out
    head. A mask that does not is a colourway with a name.
THE CARD: both ship on CHARCLOTH and ASHGREY, cloth saturation 0.037 and 0.054,
well inside the card's 0.25 ceiling, and neither is an outer so the runway-black
value band does not bind them.

WHAT THE RULINGS ALLOW, CHECKED FIRST, BECAUSE THE FACE IS FENCED:
  1. "NEVER at/above the eyes" is the DUST MASK'S OWN rule, not the rail's -- the
     gasmask's own comment says so in as many words ("the dust mask's
     below-the-eyes law stays its own; this is a different garment class") and the
     gasmask covers the eyes. So an eye-covering class is legal, with the gasmask
     as the standing precedent, and the WRAP below still starts under the eyes
     because it is a mask-class garment and inherits that rule.
  2. THE FACE PERFORMS / EVERYBODY HAS A FACE, AND IT TALKS: shades are canon and
     cover the eyes, so a shield does not break anything the portrait needs.
  3. THE DURAG LINE is genHat's, and neither of these is a hat.
AND WHAT THEY REFUSE, unchanged from batch 3: A BALACLAVA. It would have to cross
the durag line, which is his 7/18 ruling. It stays [PENDING Paolo] rather than
becoming a thing I found a way around.

REUSE CHECK: cooks ZERO new graphic pixels and opens no bank for pixels -- two
geometry branches in the alpha's existing genAcc, spending ramps already in the
file (CHARCLOTH, ASHGREY). No colour invented: COLOUR IS TERRITORY.
banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt is opened and read.

GRAVEYARD, READ BEFORE COOKING: the only clothing kill is the V-NECK, a neckline on
genTop. No visor and no face wrap has ever been killed.

  python3 tools/bohemia_runway_cook_4_9_5_26.py
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
print('=== THE RUNWAY COOK, BATCH 4 (canon bank: %d bytes read) ===' % len(_canon))

sub("""    if(kind==='shades'){ if(back)return o;                               /* invisible from behind */""",
    """    /* THE SHIELD (9/5, batch 4). Both pairs of canon shades sit INSIDE the head's
       outline -- they are a dark band on a face. A shield is a band that runs PAST
       the head on both sides, so the blacked-out head is WIDER at the eye line than
       a bare one, and that is the only kind of change a face can make at this size.
       It keeps the eye band the calibrated shades already found, so it never drifts
       onto the brow the way fraction math used to. */
    if(kind==='visor'){
      var vTop=Math.max(hTop+S,eyeA-S), vBot=Math.min(hBot,eyeB+S);
      if(back){                                                          /* from behind: the strap, so the garment is never ABSENT from a facing */
        for(var ys=vTop;ys<=vBot;ys++)for(var xs=hMn;xs<=hMx;xs++){
          var isb=ys*CW+xs; if(g[isb]!==1&&g[isb]!==2)continue;
          o[isb]=(ys<=vTop+(S-1))?r.lt:mix(r.dk,0.9); }
        return o; }
      for(var yv=vTop;yv<=vBot;yv++)for(var xv=hMn-2*S;xv<=hMx+2*S;xv++){
        if(xv<0||xv>=CW)continue; var iv=yv*CW+xv, gv=g[iv];
        if(gv!==1&&gv!==2&&gv!==0)continue;                              /* head, face, or the air beside them -- never a shoulder */
        if(gv===0&&(yv<vTop||yv>vBot))continue;
        o[iv]=(yv<=vTop+(S-1))?r.lt                                      /* lit top edge of the shield */
             :((xv<hMn||xv>hMx)?r.dk                                     /* the overhang: the new outline */
             :((yv>=vBot-(S-1))?r.dk:mix(r.mid,0.85))); }                /* the lens face, and its shadowed lower rim */
      return o; }
    /* THE FACE WRAP (9/5, batch 4). The dust mask is a flat plane, drawn only on
       head and face pixels, so by construction it can never change the head's
       outline -- it is paint on a jaw. A wrap goes ROUND the jaw: it takes the same
       rows the mask does, and adds a cell of cloth OUTSIDE the head on each side of
       them, so the jaw reads THICKER than the skull. Same rows as the mask, so it
       inherits the mask class's below-the-eyes rule and never touches the eyes. */
    if(kind==='facewrap'){
      for(var yw=mouthY;yw<=hBot;yw++){
        var wMn=CW,wMx=-1;
        for(var xw=0;xw<CW;xw++){var gw=g[yw*CW+xw]; if(gw===1||gw===2){if(xw<wMn)wMn=xw;if(xw>wMx)wMx=xw;}}
        if(wMx<0)continue;
        for(var xw2=wMn-S;xw2<=wMx+S;xw2++){
          if(xw2<0||xw2>=CW)continue; var iw2=yw*CW+xw2, gv2=g[iw2];
          if(gv2!==1&&gv2!==2&&gv2!==0)continue;
          o[iw2]=(xw2<wMn||xw2>wMx)?r.dk                                 /* the bulk, outside the head: the new outline */
                :((yw<=mouthY+(S-1))?r.dk                                /* the top edge where the cloth folds over */
                :((((((yw-mouthY)/S)|0)%2)===0)?r.mid:mix(r.mid,0.82))); }  /* wrapped layers, two cells apart */ }
      for(i=0;i<g.length;i++)if(g[i]===3)o[i]=mix(r.mid,0.9);            /* it carries on down onto the neck, every facing */
      if(!front){                                                        /* the tail of the wrap, tucked at the side or nape */
        var kx=(dir==='E'||dir==='NE'||dir==='SE')?hMn-S:hMx+S;
        for(var kt=0;kt<2*S;kt++){ var ik=(hBot-kt)*CW+kx;
          if(kx>=0&&kx<CW&&(g[ik]===0||g[ik]===1))o[ik]=r.dk; } }
      return o; }
    if(kind==='shades'){ if(back)return o;                               /* invisible from behind */""",
    'genAcc: the shield and the face wrap')

sub("""    {n:'BONE SHOULDER DRAPE',st:'canon',fresh:true,layer:'back',gen:function(g){return wear(genCape(g,{ramp:BONECLO,oneShoulder:true}),BONECLO,14);}},
  ];""",
    """    {n:'BONE SHOULDER DRAPE',st:'canon',fresh:true,layer:'back',gen:function(g){return wear(genCape(g,{ramp:BONECLO,oneShoulder:true}),BONECLO,14);}},
    /* ---- THE RUNWAY, BATCH 4 (9/5/26) -- THE FACE, THE LAST RAIL WITH ROOM.
       GEAR was measured and left alone: all 13 of its kinds pass 78 of 78 pairs
       against each other, so it is the healthiest rail in the wardrobe and padding
       it would be volume for its own sake. FACE is thin in COUNT (10 garments over
       4 shapes) while every shape it has is real -- so it gets shapes, not
       colourways. Both of these change the BLACKED-OUT HEAD, which is the only
       kind of change a face can make at 56 pixels: the shield runs past the head
       at the eye line, the wrap thickens the jaw past the skull. ---- */
    {n:'SHIELD VISOR',st:'canon',fresh:true,layer:'face',gen:function(g){return wear(genAcc(g,{ramp:CHARCLOTH,kind:'visor'}),CHARCLOTH,10);}},
    {n:'ASH SHIELD',st:'canon',fresh:true,layer:'face',gen:function(g){return wear(genAcc(g,{ramp:ASHGREY,kind:'visor'}),ASHGREY,10);}},
    {n:'FACE WRAP',st:'canon',fresh:true,layer:'face',gen:function(g){return wear(genAcc(g,{ramp:CHARCLOTH,kind:'facewrap'}),CHARCLOTH,12);}},
    {n:'ASH FACE WRAP',st:'canon',fresh:true,layer:'face',gen:function(g){return wear(genAcc(g,{ramp:ASHGREY,kind:'facewrap'}),ASHGREY,12);}},
  ];""",
    'GARMENTS: four entries on two new shapes')

open(ALPHA, 'w', encoding='utf-8').write(src)
print('\n%s: %d -> %d bytes' % (ALPHA, len(orig), len(src)))
