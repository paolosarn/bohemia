#!/usr/bin/env python3
"""
BOHEMIA -- THE RUNWAY COOK, BATCH 6: THE LAST TWO SHAPES THE CARD NAMES
(9/5/26, COOK lane, cook-mce6r5). Sixth round of [runway clothes] WARDROBE-REMAKE.

Five batches in, the style card's section 2 has been worked through id by id. What
is left, after RNWY-01 (square shoulder), -02 (arc shoulder), -05/-08 (the stack),
-07 (asymmetry), -11 (the tapering leg) and -12 (the pedestal boot):

  RNWY-09  "the cocoon hem falls in an arc, LONGER BEHIND THAN IN FRONT -- the
           profile reads as A COMMA, NOT A RECTANGLE." Our cocoon coat's hem is
           dead level in every facing, so in profile it is exactly the rectangle
           the card names as the failure.
  RNWY-10  "the leg is a SINGLE COLUMN, ANKLE BREAK-FREE (pant-boot)." Every fit in
           this wardrobe breaks at the ankle: the trouser stops, the boot starts,
           and the two have different widths and different tones. Nothing reads as
           one unbroken column from hip to floor.
  RNWY-03 and the pole shoulder span are NOT buildable and are not attempted -- the
           card writes them against the paperdoll torso while a dressed sprite's
           shoulder is its ARMS. Reported to DIRECTION, not worked around.
  RNWY-06  "the stack stays readable at the collar" is a property of the layered
           top already built, not a separate garment; it is measured, not cooked.

REFERENCE CHECK (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md).
  * RICK OWENS outerwear in profile -- taken: THE BACK HEM HANGS LOWER THAN THE
    FRONT. Side on, the garment's bottom edge is not a horizontal line; it sweeps
    down toward the back, which is what makes the silhouette read as a comma rather
    than a box on legs. It is the one thing our coats have never done.
  * BOTH HOUSES' pant-boot and stacked column -- taken: NO BREAK AT THE ANKLE. The
    leg and the foot are one continuous mass of the same width and the same tone,
    so the eye reads a column standing on the ground rather than a leg wearing a
    shoe. At 56 pixels this is the strongest lower-body statement available,
    because it removes a line rather than adding one.
  * THE PIXEL AISLE: black it out. The comma changes the bottom edge's ANGLE; the
    column removes a step from the side. Both are outline.
THE CARD'S PALETTE: CHARCLOTH, FADEDBLK, SLATEW and ASHGREY, cloth saturation 0.037
to 0.163, inside the 0.25 ceiling. The comma ships at THIGH length (0.56) so the
10% long-coat cap is untouched. No colour invented.

AND THE FACING LESSON THIS LANE PAID FOR, APPLIED AS A BUDGET RATHER THAN A HOPE:
the one-shoulder drape failed one_garment_per_slot at 0.188 body-heights of hem
movement across one notch against a pinned 0.09. The comma is DELIBERATELY facing-
dependent -- that is what "longer behind than in front" means -- so its extension is
ramped ONE ROW PER NOTCH (S 0, SE/SW 1, E/W 2, NE/NW 3, N 4). One row on a 56 rig is
0.018 body-heights, a fifth of the pin. The shape the card asks for and the gate
another lane wrote are both satisfied, and the number was checked before cooking
rather than after being told.

REUSE CHECK: cooks ZERO new graphic pixels and opens no bank for pixels -- two
geometry branches in the alpha's existing genCoat and genPants, spending ramps
already in the file. banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt is opened and read.

GRAVEYARD, READ BEFORE COOKING: the only clothing kill is the V-NECK, a neckline. No
comma hem and no pant-boot has ever been killed.

  python3 tools/bohemia_runway_cook_6_9_5_26.py
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
print('=== THE RUNWAY COOK, BATCH 6 (canon bank: %d bytes read) ===' % len(_canon))

# ---------------------------------------------------------------- RNWY-09
sub("""    var wrapC=!!opt.wrap, asymC=!!opt.asym, cocoon=!!opt.cocoon;""",
    """    var wrapC=!!opt.wrap, asymC=!!opt.asym, cocoon=!!opt.cocoon;
    /* RNWY-09, THE COMMA (9/5, batch 6). "The cocoon hem falls in an arc, LONGER
       BEHIND THAN IN FRONT -- the profile reads as a comma, not a rectangle." Every
       coat in this wardrobe has a dead level hem, which side on is exactly the
       rectangle the card names as the failure.
       ITS FACING RAMP IS A BUDGET, NOT A GUESS: one_garment_per_slot pins hem
       movement across ONE NOTCH at 0.09 body-heights and this lane already blew
       that once at 0.188 with the one-shoulder drape. One row on a 56 rig is 0.018,
       so a one-row-per-notch ramp costs a fifth of the pin and the card still gets
       four rows of difference between facing you and facing away. */
    var commaC=!!opt.comma;""",
    'genCoat: the comma declared')

sub("""    var asymRise=asymC?Math.max(4*S,Math.round(span*0.55)):0;""",
    """    var asymRise=asymC?Math.max(4*S,Math.round(span*0.55)):0;
    /* how much lower the hem hangs, by how far the body has turned away */
    var _cd=(typeof curDir!=='undefined')?curDir:((opt&&opt.dir)||'S');
    var commaDrop=0;
    if(commaC){ commaDrop=(_cd==='S')?0:((_cd==='SE'||_cd==='SW')?S:((_cd==='E'||_cd==='W')?2*S:((_cd==='NE'||_cd==='NW')?3*S:4*S))); }""",
    'genCoat: the comma drop per facing')

sub("""    var hemAt=function(x){ if(!asymC)return hemY;""",
    """    var hemAt=function(x){ if(commaC&&!asymC)return Math.min(CH-1,hemY+commaDrop);
      if(!asymC)return hemY;""",
    'genCoat: the comma hem')

sub("""    if(!vest&&!jacket)for(var y2=tb+1;y2<=hemY;y2++){""",
    """    var hemLim=hemY+(commaC?commaDrop:0); if(hemLim>CH-1)hemLim=CH-1;
    if(!vest&&!jacket)for(var y2=tb+1;y2<=hemLim;y2++){""",
    'genCoat: the skirt runs to the dropped hem')

# ---------------------------------------------------------------- RNWY-10
sub("""    var isDrop=(opt.cut==='drop'), isWide=(opt.cut==='wide'),
        isStack=(opt.cut==='stack'), isCrop=(opt.cut==='crop');""",
    """    var isDrop=(opt.cut==='drop'), isWide=(opt.cut==='wide'),
        isStack=(opt.cut==='stack'), isCrop=(opt.cut==='crop');
    /* RNWY-10, THE COLUMN (9/5, batch 6). "The leg is a SINGLE COLUMN, ANKLE
       BREAK-FREE (pant-boot)." Every fit in this wardrobe breaks at the ankle: the
       trouser stops, the boot starts, and the two have different widths and
       different tones. This one runs the same width and the same cloth from the
       waist to the floor, over the foot, so the eye reads a column standing on the
       ground rather than a leg wearing a shoe.
       IT IS THE ONLY SHAPE IN SIX BATCHES THAT WORKS BY REMOVING A LINE RATHER THAN
       ADDING ONE, which is why it is the strongest thing available down there: at 56
       pixels the ankle break is one of very few horizontals the lower body has.
       *** AND IT SITS IN THE FEET SLOT, NOT THE LEGS SLOT, WHICH LOOKING CAUGHT. ***
       The composite draws base, then legs, then FEET -- so a column in the legs slot
       is painted over by whatever boot the person is wearing, and the ankle break
       survives in the one garment that exists to remove it. A pant-boot IS the boot;
       it occupies the boot's slot and covers the leg on its way up. The generator
       stays genPants because the geometry is a trouser's; only the slot moves. */
    var isColumn=(opt.cut==='column');""",
    'genPants: the column declared')

sub("""    if(isCrop){ for(var yC=cutY-2*S+1;yC<=cutY;yC++)for(var dC=1;dC<=2*S;dC++){
      if(lgMn-dC>=0)w[yC*CW+(lgMn-dC)]=1; if(lgMx+dC<CW)w[yC*CW+(lgMx+dC)]=1; } }""",
    """    if(isCrop){ for(var yC=cutY-2*S+1;yC<=cutY;yC++)for(var dC=1;dC<=2*S;dC++){
      if(lgMn-dC>=0)w[yC*CW+(lgMn-dC)]=1; if(lgMx+dC<CW)w[yC*CW+(lgMx+dC)]=1; } }
    /* THE COLUMN: one constant-width mass from the waist over the foot. It takes the
       foot's own cells too, so nothing of the shoe's outline survives underneath --
       an ankle break you can still see is not break-free. */
    /* *** ONE COLUMN PER LEG, NOT ONE COLUMN FOR BOTH, AND LOOKING CAUGHT IT. ***
       The first cut filled everything between the outermost leg columns and produced
       a solid slab from hip to floor -- which does remove the ankle break, and also
       removes the legs. It read as a skirt. The card says "THE LEG is a single
       column", and a leg that has merged with the other leg is not a leg. Each side
       is now its own column, from the top of its own leg over its own foot, at that
       leg's own width, with the gap between them left alone. What goes is the ANKLE
       LINE; what stays is the man having two legs. */
    var colSeam=-99;
    if(isColumn){ for(i=0;i<g.length;i++)if(g[i]===9){var xS9=i%CW; if(xS9>colSeam)colSeam=xS9;}
      colSeam=colSeam+1-((S-1)>>1);                                      /* the boundary between the two legs */
      [[9,11],[10,12]].forEach(function(pr){
      var lg=pr[0],ft=pr[1],cMn=CW,cMx=-1,cBot=-1,cTop=CH;
      for(var q=0;q<g.length;q++){ var pq=g[q]; if(pq!==lg&&pq!==ft)continue;
        var xq=q%CW,yq=(q/CW)|0;
        if(xq<cMn)cMn=xq; if(xq>cMx)cMx=xq; if(yq>cBot)cBot=yq; if(yq<cTop)cTop=yq; }
      if(cMx<0)return;
      for(var yK=cTop;yK<=cBot;yK++)for(var xK=cMn;xK<=cMx;xK++){
        if(xK<0||xK>=CW)continue; var iK=yK*CW+xK, gK=g[iK];
        if(gK===1||gK===2||gK===7||gK===8)continue; w[iK]=1; } }); }""",
    'genPants: the column geometry')

sub("""      if(isCrop&&y>=cutY-(2*S-1)){ c=(y>=cutY-(S-1))?r.dk:r.lt;          /* the turn-up: a lit face with a dark edge under it */
        if(!inG(x-1,y)||!inG(x+1,y))c=r.dk; }""",
    """      if(isCrop&&y>=cutY-(2*S-1)){ c=(y>=cutY-(S-1))?r.dk:r.lt;          /* the turn-up: a lit face with a dark edge under it */
        if(!inG(x-1,y)||!inG(x+1,y))c=r.dk; }
      /* THE COLUMN IS SHADED AS ONE PIECE: edges dark, sky-lit flank, a sole line at
         the very bottom, and NO HORIZONTAL ANYWHERE ELSE. A cuff, a hem or an ankle
         line would put back the break the shape exists to remove. */
      /* AND THE INNER SEAM STAYS, WHICH LOOKING CAUGHT TWICE. On this rig the two
         legs are ADJACENT -- there is no gap between them, only a seam -- so filling
         each leg's own box still produces one contiguous mass, and shading that mass
         as a single piece deleted the only thing saying "two legs". It read as a
         skirt both times. THE CARD FORBIDS A HORIZONTAL BREAK AT THE ANKLE; a
         VERTICAL seam between the legs is not that break, it is the legs. */
      if(isColumn&&y>wb+3*S){ if(!inG(x,y+1))c=r.dk;                      /* the ground line */
        else if(!inG(x-1,y)||!inG(x+1,y))c=r.dk;
        else if(x>=colSeam&&x<colSeam+S)c=mix(r.dk,0.85);                 /* the inner seam: two columns, not one slab */
        else if(x<cx)c=r.lt;
        else c=r.mid; }""",
    'genPants: the column shaded as one piece')

# ---------------------------------------------------------------- the batch
sub("""    {n:'ARC LAYERED SHIRT',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:CHARCLOTH,sleeves:'long',neck:'crew',shoulder:'arc',cut:'layered'}),CHARCLOTH,12);}},
  ];""",
    """    {n:'ARC LAYERED SHIRT',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:CHARCLOTH,sleeves:'long',neck:'crew',shoulder:'arc',cut:'layered'}),CHARCLOTH,12);}},
    /* ---- THE RUNWAY, BATCH 6 (9/5/26) -- THE LAST TWO SHAPES THE CARD NAMES.
       RNWY-09, the comma: the hem hangs LOWER BEHIND than in front, so side on the
       coat reads as a comma instead of the rectangle the card names as the failure.
       RNWY-10, the column: one unbroken mass from waist to floor, over the foot --
       the only shape in six batches that works by REMOVING a line. ---- */
    {n:'COMMA COAT',st:'canon',fresh:true,layer:'outer',gen:function(g){return wear(genCoat(g,{ramp:CHARCLOTH,cocoon:true,comma:true,len:0.56}),CHARCLOTH,12);}},
    {n:'SLATE COMMA COAT',st:'canon',fresh:true,layer:'outer',gen:function(g){return wear(genCoat(g,{ramp:SLATEW,comma:true,len:0.56}),SLATEW,13);}},
    {n:'COLUMN PANT-BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genPants(g,{ramp:CHARCLOTH,cut:'column'}),CHARCLOTH,12);}},
    {n:'COAL COLUMN',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genPants(g,{ramp:FADEDBLK,cut:'column'}),FADEDBLK,12);}},
    {n:'ASH COLUMN',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genPants(g,{ramp:ASHGREY,cut:'column'}),ASHGREY,13);}},
  ];""",
    'GARMENTS: five entries on two new shapes')

open(ALPHA, 'w', encoding='utf-8').write(src)
print('\n%s: %d -> %d bytes' % (ALPHA, len(orig), len(src)))
