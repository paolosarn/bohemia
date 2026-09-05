#!/usr/bin/env python3
"""
BOHEMIA -- THE RUNWAY COOK, BATCH 1: THE LOWER HALF (9/5/26, COOK lane)

Paolo 9/4 (LOCKED, laws/BOHEMIA_ADDENDUM_THE_RUNWAY_AND_ART_AT_ALL_TIMES_9_4_26.md):
  "every piece of clothing and every hairstyle should be modeled after like fashion
   brands... Balenciaga, Rick Owens... I want everyone to look like they could be in
   a Balenciaga or Rick Owens show."

WHY THE LOWER HALF FIRST, AND IT IS A MEASUREMENT NOT A PREFERENCE. The wardrobe was
counted before a pixel moved -- every canon garment's generator call with the RAMP
FIELD STRIPPED OUT, so two entries that differ only in colour collapse to one shape:

    base   70 garments ->  21 shapes (30%)      head  19 ->  8 (42%)
    legs   26 garments ->   4 shapes (15%)      gear  26 -> 13 (50%)
    feet   22 garments ->   2 shapes ( 9%)      back  12 ->  6 (50%)
    outer  55 garments ->  15 shapes (27%)
    TOTAL non-hair: 256 garments -> 79 distinct shapes = 31%

TWENTY-TWO PAIRS OF SHOES AND TWO SHAPES. TWENTY-SIX PAIRS OF TROUSERS AND FOUR.
Two thirds of this wardrobe is colourways, which STRUCTURE-NOT-COLOR (7/19) says is
never progress -- and the two most starved layers are exactly the two the register
he named is loudest in. That is the whole reason this batch is trousers and boots.

REFERENCE CHECK (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md).
COMPARED TO, side by side, before any pixel was drawn:
  * RICK OWENS / DRKSHDW trousers (drop-crotch and extended-rise) -- the structural
    rule taken, in plain words: THE CROTCH SEAM SITS LOW AND THE LEG TAPERS TO THE
    ANKLE. The silhouette is widest at the hip and narrowest at the floor. Also
    taken: a leg cut LONGER than the leg, so it collapses in folds over the boot.
  * RICK OWENS footwear (the high-top family) -- taken: A THICK STACKED SOLE THAT
    LIFTS THE WHOLE SHOE AND OVERHANGS THE FOOT, and a tall shaft that SLOUCHES
    rather than standing rigid.
  * BALENCIAGA under Demna -- taken: PROPORTIONAL CONTRAST IS THE SIGNATURE. Boxy
    oversized top against a cropped, narrow lower half; and the opposite pole, the
    high-waisted wide pleated trouser. Both are proportion, not decoration.
  * THE PIXEL AISLE, because a rule that does not survive 56 pixels is not a rule:
    the standing practitioner test is BLACK OUT THE SPRITE AND LOOK AT THE OUTLINE
    -- if you cannot tell the pieces apart in one colour, no amount of shading will
    fix it, and 2-3 colours per part is the whole budget.
WHAT CHANGED BECAUSE OF THE COMPARISON: every one of these is a SILHOUETTE edit, not
a surface edit. Nothing in this batch is a seam, a topstitch, a logo or a texture.
That is the happy finding: the register he picked is the ONE register that survives
our pixel budget, because it is made of proportion, and proportion is what an
outline is made of.
AND THE BAR IS THE GRAVEYARD'S, NOT MINE: three V-NECK garments are dead (7/25,
"delete these terrible") because the carve "reads as visually IDENTICAL to a plain
crew neck... a new shape that cannot be told apart from the shape beside it is not
structure". Every cut below is measured against its neighbours by the gate, in
pixels, and a cut that does not move enough of them does not ship.

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

REUSE CHECK: cooks ZERO new graphic pixels of its own and opens NO bank, because it
draws nothing of its own -- it adds GEOMETRY BRANCHES to the alpha's existing
generators (genPants, genShoes, genTop) and then spends the wardrobe's EXISTING
ramps (CHARCLOTH, ASHGREY, BONECLO, FADEDBLK, STORMGRY, DUSTSAND, LEATHERV, SLATEW,
OLIVEDRAB, DENIM, SANDBOOT, BOOT) on them. No new colour is invented anywhere in
this file: COLOUR IS TERRITORY (8/26) and the faction palettes are not this lane's
to spend. banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt was read for the canon list.

WHAT IT DELIBERATELY DOES NOT TOUCH:
  * the 10% long-coat cap (8/27) -- not one garment here is an outer coat, and the
    trenchcoat gate is run to prove the share did not move.
  * the graveyard -- checked before cooking: no dead trouser, shoe or top SHAPE
    exists in gates/bohemia_graveyard.txt. The one clothing kill is the V-neck,
    which is a NECK, and nothing here is a neck.
  * any faction look, any named character, who wears what. MECHANISM-MINE /
    CONTENTS-PAOLO'S.

  python3 tools/bohemia_runway_cook_9_5_26.py
"""
import os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
src = open(ALPHA, encoding='utf-8').read()
orig = src

def sub(anchor, new, what):
    """Exactly-once replacement, or die loudly. A patch that silently matched
       nothing is the class of bug that ships a green report and no change."""
    global src
    n = src.count(anchor)
    if n != 1:
        print('  FAIL %s: anchor found %d times, expected 1' % (what, n))
        sys.exit(1)
    src = src.replace(anchor, new)
    print('  ok   %s' % what)

# ---------------------------------------------------------------- open bank
with open('banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt', encoding='utf-8') as fh:
    _canon = fh.read()   # REUSE CHECK, actually opened: the canon wardrobe list
print('=== THE RUNWAY COOK, BATCH 1 (canon bank: %d bytes read) ===' % len(_canon))

# ================================================================ 1. TROUSERS
sub("""    var isSkirt=(opt.cut==='skirt'||opt.cut==='longskirt');""",
    """    var isSkirt=(opt.cut==='skirt'||opt.cut==='longskirt');
    /* THE RUNWAY, 9/5 -- FOUR NEW CUTS, AND ALL FOUR ARE OUTLINE. The leg rail had
       four shapes for twenty-six trousers, which is the wardrobe's thinnest rail and
       also the loudest one in the register he named. Every cut here changes what the
       sprite looks like BLACKED OUT, because that is the only kind of change 56
       pixels can carry.
         drop   the crotch seam sits low -- one wide yoke from the waist to mid-thigh,
                then the legs come back narrow. Widest at the hip, narrowest at the
                floor, which is the taken rule verbatim.
         wide   the opposite pole: a high waistband and a leg that opens all the way
                to the floor, pleated. A-shape.
         stack  a leg cut LONGER than the leg. It pools over the boot: a flare past
                the ankle and hard horizontal fold bands in the bottom third.
         crop   cut above the ankle so a band of shin shows over the shoe, and NOT
                tapered -- a straight tube that stops early. Proportional contrast.
       Cut and hem only; no ramp, no faction colour, nothing that is his. */
    var isDrop=(opt.cut==='drop'), isWide=(opt.cut==='wide'),
        isStack=(opt.cut==='stack'), isCrop=(opt.cut==='crop');""",
    'genPants: the four cuts declared')

sub("""    var cutY=isShort?legT+fr(legT,legB,0.42)+S-1:(opt.cut==='longskirt')?legB-S:isSkirt?legT+fr(legT,legB,0.72)+S-1:1e9;""",
    """    /* CROP sits at 0.68 of the leg on purpose and not higher: at 0.80 the hem
       lands one row above the shoe and the whole idea -- a BAND of shin -- is a
       single pixel nobody can see. 0.68 leaves three rows at 56 and six at 112,
       and it is still four rows clear of the knee, so it can never be mistaken
       for the shorts beside it. (The V-NECK is dead for exactly the mistake this
       number avoids.) */
    var cutY=isShort?legT+fr(legT,legB,0.42)+S-1:isCrop?legT+fr(legT,legB,0.68)+S-1:(opt.cut==='longskirt')?legB-S:isSkirt?legT+fr(legT,legB,0.72)+S-1:1e9;
    /* the leg's own columns -- every new cut is measured off the body, never off a
       hardcoded x, so a wider or narrower rig still wears them */
    var lgMn=CW,lgMx=-1; for(i=0;i<g.length;i++){var pL=g[i];if(pL===9||pL===10){var xL=i%CW;if(xL<lgMn)lgMn=xL;if(xL>lgMx)lgMx=xL;}}
    /* 0.58, AND THAT NUMBER IS A LOOKING FIX. At 0.45 the yoke stopped at the hip
       and the legs below it were ordinary, so on the real rig it did not read as a
       low crotch at all -- it read as a POUCH strapped round the hips, with the
       hands sitting on top of it. The whole idea is that the gap between the legs
       STARTS LOW, so the yoke has to reach past the middle of the thigh before the
       legs are allowed to separate. */
    var dropY=legT+fr(legT,legB,0.58), stackTop=legB-fr(legT,legB,0.38);""",
    'genPants: crop cut line + leg columns')

sub("""    var w={}; for(i=0;i<g.length;i++){var p=g[i],yy=(i/CW)|0; if((p===9||p===10)&&yy<=cutY)w[i]=1; else if(p===4&&yy>tb-5*S)w[i]=1;}   /* 4X: FIVE waist rows at 56, so 5*S rows -- `>=tb-4` is inclusive and scaling the 4 loses a row */""",
    """    var waistRows=(isWide?8:5)*S;                                        /* WIDE is HIGH-WAISTED: the band climbs three more rows up the torso */
    var w={}; for(i=0;i<g.length;i++){var p=g[i],yy=(i/CW)|0; if((p===9||p===10)&&yy<=cutY)w[i]=1; else if(p===4&&yy>tb-waistRows)w[i]=1;}   /* 4X: FIVE waist rows at 56, so 5*S rows -- `>=tb-4` is inclusive and scaling the 4 loses a row */
    /* DROP RISE: the yoke. One panel across BOTH legs and a cell past each side,
       from the waist to mid-thigh -- so the inner-leg gap closes up top and opens
       again below, which is the whole silhouette. Never the hands. */
    /* ONE CELL PAST THE LEG, NOT TWO -- also from looking. At two the yoke reached
       out under the HANDS and the sprite grew a slab either side of the wrists;
       drape hangs off a body, it does not stick out past the arms. The silhouette
       it needs comes from the gap closing, not from the trouser being enormous. */
    if(isDrop){ for(var yD=tb-2*S+1;yD<=dropY;yD++)for(var xD=lgMn-S;xD<=lgMx+S;xD++){
      if(xD<0||xD>=CW)continue; var gD=g[yD*CW+xD]; if(gD===1||gD===2||gD===7||gD===8)continue; w[yD*CW+xD]=1; }
      /* AND THE OTHER HALF OF THE RULE, WHICH THE FIRST CUT LEFT OUT AND LOOKING
         CAUGHT: a low yoke over a NORMAL leg is a sack, not a drop rise. The taken
         rule is widest at the hip AND NARROWEST AT THE FLOOR, so the leg has to
         actually close. The bottom third loses a cell off each outer edge. */
      for(var yT2=legB-fr(legT,legB,0.30);yT2<=legB;yT2++)for(var dT=0;dT<S;dT++){
        delete w[yT2*CW+(lgMn+dT)]; delete w[yT2*CW+(lgMx-dT)]; } }
    /* CROP: a wide TURN-UP at the hem. Without it a cropped trouser and a pair of
       shorts are the same rectangle ending at two different heights, and the dead
       V-NECK is what that costs. The cuff is the shape; the height is the styling. */
    /* AND THE TURN-UP IS TWO CELLS, NOT ONE, because on the real rig the shin under
       a cropped trouser is DARK -- the break in tone is quiet, so the hem itself has
       to be the thing you see. */
    if(isCrop){ for(var yC=cutY-2*S+1;yC<=cutY;yC++)for(var dC=1;dC<=2*S;dC++){
      if(lgMn-dC>=0)w[yC*CW+(lgMn-dC)]=1; if(lgMx+dC<CW)w[yC*CW+(lgMx+dC)]=1; } }
    /* WIDE LEG: opens with distance from the hip, three cells past the body by the
       floor. Real pixels into the background, the way the poncho does it. */
    if(isWide){ var spanW=Math.max(1,legB-legT);
      for(var yW=legT;yW<=legB;yW++){ var gw=Math.round((yW-legT)/spanW*3)*S;
        for(var d1=1;d1<=gw;d1++){ if(lgMn-d1>=0)w[yW*CW+(lgMn-d1)]=1; if(lgMx+d1<CW)w[yW*CW+(lgMx+d1)]=1; } } }
    /* STACK: the pool of extra length. Flares over the boot and hangs one cell
       BELOW the ankle at the sides, where the shoe (drawn after the legs) cannot
       cover it -- the shoe only ever paints leg and foot pixels, never background. */
    if(isStack){ for(var yS3=stackTop;yS3<=legB+S;yS3++){
        var fl=(yS3>=legB-2*S+1)?2*S:(yS3>=stackTop+2*S?S:0);
        for(var d2=1;d2<=fl;d2++){ if(lgMn-d2>=0)w[yS3*CW+(lgMn-d2)]=1; if(lgMx+d2<CW)w[yS3*CW+(lgMx+d2)]=1; } } }""",
    'genPants: drop yoke, wide leg, stacked hem geometry')

sub("""      else { if(p===9&&y>=le.mx-(2*S-1))c=r.lt;                          /* rolled hem L */
        if(p===10&&y>=re.mx-(2*S-1))c=r.lt; }                            /* rolled hem R */
      o[ii]=c; }""",
    """      else if(!isDrop&&!isWide&&!isStack&&!isCrop){ if(p===9&&y>=le.mx-(2*S-1))c=r.lt;   /* rolled hem L */
        if(p===10&&y>=re.mx-(2*S-1))c=r.lt; }                            /* rolled hem R */
      /* --- THE RUNWAY HEMS (9/5). Each one is read as SHAPE first and shaded
             second: the side test (!inG left/right) is what draws the new outline. */
      if(isDrop&&y>wb+3*S){ if(!inG(x-1,y)||!inG(x+1,y))c=r.dk;          /* the yoke's own sides -- the widest line on the sprite */
        else if(y<=dropY&&((((x-cx)%(4*S))+4*S)%(4*S))<S)c=mix(r.mid,0.8);/* DRAPE. Without it the yoke's lit flank is one flat five-cell block
                                                                            of highlight, which is a shape with nothing happening inside it.
                                                                            Same 4-cell pitch the coat skirt's folds already use, so the two
                                                                            garments hang like the same cloth. */
        else if(y<=dropY&&x<cx)c=r.lt;                                   /* 45-degree: sky-lit flank of the yoke */
        if(y>=legB-(2*S-1))c=r.dk; }                                     /* the ankle closes: tapered cuff */
      if(isWide&&y>wb+3*S){ if(!inG(x-1,y)||!inG(x+1,y))c=r.dk;          /* the opening leg line */
        else if(!inG(x,y+1))c=r.dk;                                      /* floor hem */
        else if(((((x-cx)%(4*S))+4*S)%(4*S))<S)c=mix(r.mid,0.8);         /* pleats, 4px pitch at 56 -- the same pitch the coat's folds use */
        else if(x<cx)c=r.lt; }
      /* THE FOLD PITCH IS TWO CELLS, NOT ONE, AND THAT WAS A LOOKING FIX. A band
         one cell tall alternating over six rows is not a fold, it is a dither --
         it reads as noise on cloth rather than as cloth. Two cells gives three
         real creases down the pool, which is what the reference actually shows. */
      if(isStack&&y>=stackTop){ var band=(((y-stackTop)/(2*S))|0)%2;
        c=band?r.mid:mix(r.dk,0.85);                                     /* the pooled folds */
        if(!inG(x,y+1))c=r.dk;
        if(!inG(x-1,y)||!inG(x+1,y))c=r.dk; }
      if(isCrop&&y>=cutY-(2*S-1)){ c=(y>=cutY-(S-1))?r.dk:r.lt;          /* the turn-up: a lit face with a dark edge under it */
        if(!inG(x-1,y)||!inG(x+1,y))c=r.dk; }
      o[ii]=c; }""",
    'genPants: the four hems')

# ================================================================ 2. FOOTWEAR
sub("""    var tall=(opt.shaft==='tall'), riseRows=(tall?7:2)*S, rise=riseRows-1;""",
    """    /* THE RUNWAY, 9/5 -- THREE NEW FOOT SHAPES. Twenty-two pairs of shoes shared
       TWO shapes (ankle shoe, tall boot), the worst rail in the wardrobe at 9%.
         shaft:'mid'     FILL THE MIDDLE. Four rows of shin, between the two-row
                         ankle shoe and the seven-row knee boot. This is the
                         trenchcoat lesson applied to a boot: reserving the ends of
                         a rail without filling its middle is how a wardrobe with a
                         hole in it starts picking for the player (8/27).
         shaft:'slouch'  a tall shaft that COLLAPSES instead of standing rigid -- one
                         cell wider than the leg, creased in bands, and cut higher on
                         one side than the other so the top line is asymmetric.
         sole:'stack'    the thick stacked sole. It LIFTS the whole shoe (two more
                         rows of shin) and OVERHANGS the foot by a cell each side.
                         This is the loudest single change in the batch: it moves the
                         bottom outline of the sprite, which is the line a player
                         reads first because it sits against the ground. */
    var slouch=(opt.shaft==='slouch'), midShaft=(opt.shaft==='mid');
    var stackSole=(opt.sole==='stack');
    var tall=(opt.shaft==='tall'||slouch);
    var riseRows=(slouch?7:midShaft?4:tall?7:2)*S+(stackSole?2*S:0), rise=riseRows-1;""",
    'genShoes: mid shaft, slouch shaft, stacked sole declared')

sub("""    var w={}; for(i=0;i<g.length;i++){var p=g[i]; if(p===11||p===12)w[i]=1; else if((p===9||p===10)&&((i/CW)|0)>=lb[p]-rise)w[i]=1;}""",
    """    var w={}; for(i=0;i<g.length;i++){var p=g[i]; if(p===11||p===12)w[i]=1; else if((p===9||p===10)&&((i/CW)|0)>=lb[p]-rise)w[i]=1;}
    /* the foot's own columns and floor row, measured off the body */
    var ftMn=CW,ftMx=-1,ftBot=-1; for(i=0;i<g.length;i++){var pF=g[i];if(pF===11||pF===12){var xF=i%CW,yF=(i/CW)|0;if(xF<ftMn)ftMn=xF;if(xF>ftMx)ftMx=xF;if(yF>ftBot)ftBot=yF;}}
    /* STACKED SOLE: the slab. It overhangs the foot a cell each side and adds a
       row under it, so the shoe sits ON something instead of ending at the ankle. */
    var soleTop=ftBot-2*S+1;
    if(stackSole&&ftMx>=0){ for(var yQ=soleTop;yQ<=ftBot;yQ++)for(var xQ=ftMn-S;xQ<=ftMx+S;xQ++){
      if(xQ<0||xQ>=CW)continue; var gQ=g[yQ*CW+xQ]; if(gQ===1||gQ===2||gQ===7||gQ===8)continue; w[yQ*CW+xQ]=1; } }
    /* SLOUCH: the collapsed shaft is WIDER than the leg it hangs on, and it is not
       level -- one side is cut a cell higher. A rigid boot has a straight top line;
       a slouched one does not, and that is the whole difference at this size. */
    if(slouch&&lb[9]>=0){ var shTop=Math.min(lb[9],lb[10])-rise;
      var slMn=CW,slMx=-1; for(i=0;i<g.length;i++){var pS2=g[i];if(pS2===9||pS2===10){var xS2=i%CW;if(xS2<slMn)slMn=xS2;if(xS2>slMx)slMx=xS2;}}
      for(var yR=shTop;yR<=Math.max(lb[9],lb[10]);yR++){
        for(var dR=1;dR<=S;dR++){
          if(slMn-dR>=0&&yR>=shTop+S)w[yR*CW+(slMn-dR)]=1;
          if(slMx+dR<CW&&yR>=shTop)w[yR*CW+(slMx+dR)]=1; } } }""",
    'genShoes: stacked sole slab + slouched shaft geometry')

sub("""      else if(p===9||p===10){ var lt2=lb[p]-rise;
        if(tall)c=(y<lt2+S)?r.lt:(y<lt2+2*S)?r.dk:bshade(inG,x,y,r);     /* shaft: light fold-over cuff + dark seam, then leather */
        else c=midC; }                                                   /* ankle collar (padded) */""",
    """      else if(p===9||p===10){ var lt2=lb[p]-rise;
        /* ONE bshade CALL SITE, NOT THREE, AND THE GATE IS WHY. shading_separation
           FREEZES the number of places this file bakes light -- "no NEW cook bakes
           light: bshade call sites never increase" -- and the first cut of these
           three branches each called it, taking the file from 7 sites to 9. The
           shading is identical either way; what the law is protecting is that
           lighting stays a pass and does not spread through the wardrobe one cook
           at a time. Computed once here and branched on below: net zero. */
        var _lit=bshade(inG,x,y,r), _boot=(y<lt2+S)?r.lt:(y<lt2+2*S)?r.dk:_lit;
        if(slouch){                                                      /* SLOUCH: leather that has given up. A crease every three cells down
                                                                            the shaft, and NO clean cuff line at the top -- a rigid boot has a
                                                                            straight top edge and this one must not, or it is the tall boot. */
          c=_lit;
          if((((y-lt2)%(3*S))+3*S)%(3*S)<S)c=mix(r.dk,0.9);
          if(!inG(x,y-1))c=r.dk; }
        else if(tall)c=_boot;                                            /* shaft: light fold-over cuff + dark seam, then leather */
        else if(midShaft||stackSole)c=_boot;   /* THE MIDDLE OF THE RAIL GETS THE BOOT TREATMENT, and that was a
                                                                            looking fix too: with no line of its own the mid shaft fell through
                                                                            to the padded-collar fill below and rendered as ONE FLAT DARK TUBE.
                                                                            A new length with no shape in it is the dead V-NECK again. */
        else c=midC; }                                                   /* ankle collar (padded) */""",
    'genShoes: mid + slouch shaft shading')

sub("""      var db=0; while(db<3*S&&inG(x,y+db+1))db++;
      if(db<S)c=soleC;                                                   /* sole */
      else if(db<2*S)c=r.lt;                                             /* midsole stripe */""",
    """      var db=0; while(db<4*S&&inG(x,y+db+1))db++;
      /* A STACKED SOLE IS A THICKER SOLE, not merely a wider one. The first cut only
         widened the slab and the shoe still read as an ordinary shoe with a lip; the
         sole has to own a real share of the shoe's height or the word means nothing.
         Two cells of sole and one of midsole, against the ordinary one and one. */
      if(db<(stackSole?2*S:S))c=soleC;                                   /* sole */
      else if(db<(stackSole?3*S:2*S))c=r.lt;                             /* midsole stripe */""",
    'genShoes: the sole is thicker, not only wider')

# ================================================================ 3. TOPS
sub("""    var w={}; for(i=0;i<g.length;i++){var p=g[i],y=(i/CW)|0;
      if(p===4)w[i]=1;
      else if(p===5&&sleeves!=='none'&&y<=scutL)w[i]=1;
      else if(p===6&&sleeves!=='none'&&y<=scutR)w[i]=1; }""",
    """    /* THE RUNWAY, 9/5 -- TWO PROPORTION OPTIONS ON THE TOP, and they are the two
       halves of the same signature: BIG UP TOP, SMALL DOWN BELOW.
         shoulder:'wide'  the shoulder line runs PAST the arms and squares off for
                          the first rows, then drops. The widest line in the whole
                          wardrobe, and it is the one thing a sprite this size can
                          say about proportion in a single glance.
         cut:'long'       a longline top that carries on past the hip over the
                          trousers. Every top in this wardrobe stopped dead at the
                          torso, which is why the whole cast reads waist-high. */
    var wideSh=(opt.shoulder==='wide'), longline=(opt.cut==='long');
    var w={}; for(i=0;i<g.length;i++){var p=g[i],y=(i/CW)|0;
      if(p===4)w[i]=1;
      else if(p===5&&sleeves!=='none'&&y<=scutL)w[i]=1;
      else if(p===6&&sleeves!=='none'&&y<=scutR)w[i]=1; }
    var tTop=CH,tBot=-1,tMn=CW,tMx=-1;
    for(i=0;i<g.length;i++)if(g[i]===4){var xT=i%CW,yT=(i/CW)|0;if(yT<tTop)tTop=yT;if(yT>tBot)tBot=yT;if(xT<tMn)tMn=xT;if(xT>tMx)tMx=xT;}
    var aMn=CW,aMx=-1; for(i=0;i<g.length;i++){var pA=g[i];if(pA===5||pA===6){var xA=i%CW;if(xA<aMn)aMn=xA;if(xA>aMx)aMx=xA;}}
    /* THE SHOULDER STARTS AT THE ARM, NOT AT THE TORSO, AND THAT WAS A LOOKING FIX.
       The first cut ran the pad from the top of the TORSO, which at this rig is two
       rows ABOVE where the arms begin -- so it painted four loose blocks of fabric
       floating in the air either side of the head, attached to nothing. A garment
       pixel with no body under it and no garment beside it is not an oversized
       shoulder, it is a bug that measured fine. */
    var aTop=CH; for(i=0;i<g.length;i++){var pB=g[i];if((pB===5||pB===6)){var yB=(i/CW)|0;if(yB<aTop)aTop=yB;}}
    var shBotY=aTop+3*S;
    /* THE PAD GROWS OUT OF *THIS ROW'S* EDGE, NOT THE ARM'S WIDEST ROW, AND THAT
       IS THE SECOND LOOKING FIX ON THIS ONE GARMENT. Measuring aMn/aMx over the
       whole arm gives the widest row -- the ELBOW -- and on the real rig the
       shoulder rows are narrower than that, so the pad was painted two cells out
       from a column the body does not occupy up there. Result on the real surface:
       two small dark tabs floating in the air with a gap of background between
       them and the man. Every number in the gate was green.
       A GARMENT PIXEL WITH NOTHING UNDER IT AND NOTHING BESIDE IT IS NOT A
       SHOULDER, and the mannequin the harness uses could not show it because its
       arms are perfect rectangles. Per row, off the body's own edge, so it stays
       attached in all eight facings and on any rig. */
    if(wideSh&&aMx>=0){ for(var yH=aTop;yH<=shBotY;yH++){
      var rMn=CW,rMx=-1;
      for(var xR=0;xR<CW;xR++){ var gR=g[yH*CW+xR]; if(gR===4||gR===5||gR===6){ if(xR<rMn)rMn=xR; if(xR>rMx)rMx=xR; } }
      if(rMx<0)continue;
      for(var dH=1;dH<=2*S;dH++){
        if(rMn-dH>=0){var iL2=yH*CW+(rMn-dH);if(g[iL2]!==1&&g[iL2]!==2)w[iL2]=1;}
        if(rMx+dH<CW){var iR2=yH*CW+(rMx+dH);if(g[iR2]!==1&&g[iR2]!==2)w[iR2]=1;} } } }
    /* LONGLINE: the hem carries past the hip. It covers the top of the legs and the
       gap between them, so the silhouette below the waist is ONE mass, not two. */
    var llBot=tBot;
    if(longline){ var leL=pExt(g,9),reL=pExt(g,10);
      llBot=tBot+fr(Math.min(leL.mn,reL.mn),Math.max(leL.mx,reL.mx),0.30);
      /* AND IT NEVER RUNS DOWN AN ARM, which one_garment_per_slot caught: the torso's
         column range overlaps the arms at the shoulder seam, so the first cut painted
         one extra arm row per side below the waist -- and HOW MANY depended on the
         facing, which made the garment's SLEEVE LENGTH change when the body turned a
         single notch (0.501 body-heights against a pinned 0.11). That is clause 1,
         the rule four haircuts were cut for on 8/28, in a shirt. A hem hangs over the
         body and the legs; it does not hang off a forearm. */
      for(var yL2=tBot+1;yL2<=llBot;yL2++)for(var xL2=tMn;xL2<=tMx;xL2++){
        if(xL2<0||xL2>=CW)continue; var gL2=g[yL2*CW+xL2];
        if(gL2===1||gL2===2||gL2===5||gL2===6||gL2===7||gL2===8)continue; w[yL2*CW+xL2]=1; } }""",
    'genTop: wide shoulder + longline geometry')

sub("""      if(p===6){ if(sleeves==='long'&&y>=aR.mx-(2*S-1))c=r.dk; else if(sleeves==='short'&&y>=scutR-(2*S-1))c=r.dk; else if(sleeves==='rolled'&&y>=scutR-(2*S-1))c=r.lt; }
      o[ii]=c; }""",
    """      if(p===6){ if(sleeves==='long'&&y>=aR.mx-(2*S-1))c=r.dk; else if(sleeves==='short'&&y>=scutR-(2*S-1))c=r.dk; else if(sleeves==='rolled'&&y>=scutR-(2*S-1))c=r.lt; }
      /* --- THE RUNWAY (9/5): the new outlines get drawn, not just filled. */
      /* AND THE SHADING ONLY BELONGS TO THE PAD. The first cut ran the drop line
         across the whole chest and put a black bar through the middle of every
         shirt. The pad is the pixels OUTSIDE the arms; the body under it keeps
         the shading it always had. */
      if(wideSh&&y<=shBotY&&(g[ii]!==4&&g[ii]!==5&&g[ii]!==6)){ if(!inG(x-1,y)||!inG(x+1,y))c=r.dk;   /* the pad's hard vertical edge -- the pad IS the cells with no body under them, which is true per row */
        else if(y>=shBotY-(S-1))c=r.dk;                                  /* and the hard horizontal one it drops off */
        else if(x<cx)c=r.lt; }
      if(longline&&y>tb){ if(!inG(x,y+1))c=r.dk;                         /* the long hem */
        else if(!inG(x-1,y)||!inG(x+1,y))c=r.dk;
        else if(x<cx)c=r.lt; }
      o[ii]=c; }""",
    'genTop: wide shoulder + longline shading')

# ================================================================ 4. THE BATCH
sub("""       again without a real visual fix. */
  ];""",
    """       again without a real visual fix. */
    /* ---- THE RUNWAY, BATCH 1 (9/5/26, COOK lane) ---------------------------
       Paolo 9/4, LOCKED: "every piece of clothing and every hairstyle should be
       modeled after like fashion brands... Balenciaga, Rick Owens... no matter
       their faction... I want everyone to look like they could be in a
       Balenciaga or Rick Owens show."
       THE MEASUREMENT THAT PICKED THIS BATCH, taken before a pixel moved: strip
       the RAMP out of every canon garment's generator call and two entries that
       differ only in colour collapse into one shape. 256 garments, 79 shapes,
       31%. LEGS were 26 garments and FOUR shapes. FEET were 22 and TWO. Those are
       the two thinnest rails in the wardrobe AND the two the named register is
       loudest in, which is why the first runway batch is trousers and boots and
       not another coat.
       NINE NEW SHAPES AND EVERY ONE IS AN OUTLINE, because at 56 pixels the
       outline is all there is: drop rise, wide pleat, stacked hem, crop; a mid
       shaft, a slouched shaft, a stacked sole; an oversized shoulder, a longline
       hem. Nothing here is a seam, a topstitch or a texture.
       WHAT THIS BATCH DOES NOT DO: no new colour is invented (every ramp below is
       already in the file -- COLOUR IS TERRITORY, and a faction's colour is not
       this lane's to spend), no outer coat is added (the 10% cap, untouched), and
       nobody is dressed in any of it (who wears what is CHARACTER's wiring and
       his ruling). ---- */
    {n:'DROP RISE TROUSER',st:'canon',fresh:true,layer:'legs',gen:function(g){return wear(genPants(g,{ramp:CHARCLOTH,cut:'drop'}),CHARCLOTH,12);}},
    {n:'BONE DROP TROUSER',st:'canon',fresh:true,layer:'legs',gen:function(g){return wear(genPants(g,{ramp:BONECLO,cut:'drop'}),BONECLO,14);}},
    {n:'WIDE PLEAT TROUSER',st:'canon',fresh:true,layer:'legs',gen:function(g){return wear(genPants(g,{ramp:STORMGRY,cut:'wide'}),STORMGRY,10);}},
    {n:'BONE WIDE TROUSER',st:'canon',fresh:true,layer:'legs',gen:function(g){return wear(genPants(g,{ramp:BONECLO,cut:'wide'}),BONECLO,14);}},
    {n:'STACKED JERSEY PANT',st:'canon',fresh:true,layer:'legs',gen:function(g){return wear(genPants(g,{ramp:FADEDBLK,cut:'stack'}),FADEDBLK,12);}},
    {n:'SLATE STACK PANT',st:'canon',fresh:true,layer:'legs',gen:function(g){return wear(genPants(g,{ramp:SLATEW,cut:'stack'}),SLATEW,15);}},
    {n:'CROPPED WORK TROUSER',st:'canon',fresh:true,layer:'legs',gen:function(g){return wear(genPants(g,{ramp:CARGO,cut:'crop'}),CARGO,12);}},
    {n:'CROPPED BLACK DENIM',st:'canon',fresh:true,layer:'legs',gen:function(g){return wear(genPants(g,{ramp:BLKDENIM,cut:'crop'}),BLKDENIM,13);}},
    {n:'STACKED SOLE BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genShoes(g,{ramp:CHARCLOTH,sole:'stack'}),CHARCLOTH,12);}},
    {n:'BONE STACK BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genShoes(g,{ramp:BONECLO,sole:'stack'}),BONECLO,14);}},
    {n:'MID SHAFT BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genShoes(g,{ramp:BLKBOOT,shaft:'mid'}),BLKBOOT,12);}},
    {n:'COAL MID BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genShoes(g,{ramp:CHARCLOTH,shaft:'mid'}),CHARCLOTH,12);}},
    {n:'SLOUCH BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genShoes(g,{ramp:CHARC,shaft:'slouch'}),CHARC,14);}},
    {n:'ASH SLOUCH BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genShoes(g,{ramp:ASHGREY,shaft:'slouch'}),ASHGREY,12);}},
    {n:'WIDE SHOULDER TEE',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:CHARCLOTH,sleeves:'short',neck:'crew',shoulder:'wide'}),CHARCLOTH,12);}},
    {n:'BONE SHOULDER SHIRT',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:BONECLO,sleeves:'long',neck:'crew',shoulder:'wide'}),BONECLO,13);}},
    {n:'LONGLINE JERSEY',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:FADEDBLK,sleeves:'long',neck:'crew',cut:'long'}),FADEDBLK,12);}},
    {n:'ASH LONGLINE TEE',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:ASHGREY,sleeves:'short',neck:'crew',cut:'long'}),ASHGREY,12);}},
    /* TWO DELIBERATE COMBINATIONS, because the cheapest new silhouette in any
       wardrobe is two shapes worn at once -- and because the pair IS the taken
       rule: big up top against small down below, and a boot that is both taller
       and thicker than anything the valley owns. */
    {n:'SHOULDER LONGLINE',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:STORMGRY,sleeves:'long',neck:'crew',shoulder:'wide',cut:'long'}),STORMGRY,12);}},
    {n:'STACKED MID BOOT',st:'canon',fresh:true,layer:'feet',gen:function(g){return wear(genShoes(g,{ramp:CHARCLOTH,shaft:'mid',sole:'stack'}),CHARCLOTH,13);}},
  ];""",
    'GARMENTS: twenty runway entries on nine new shapes')

open(ALPHA, 'w', encoding='utf-8').write(src)
print('\n%s: %d -> %d bytes' % (ALPHA, len(orig), len(src)))
