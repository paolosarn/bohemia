#!/usr/bin/env python3
"""
BOHEMIA -- THE RUNWAY COOK, BATCH 5: THE TWO SHAPES THE CARD ASKS FOR BY NAME
(9/5/26, COOK lane, cook-mce6r5). Fifth round of [runway clothes] WARDROBE-REMAKE.

*** AND IT STARTS BY CORRECTING MY OWN CONCLUSION FROM LAST ROUND. *** I wrote that
the job could not be finished without a coordinator ruling, because "every garment to
the card" would mean repainting his approved art. THE CARD ALREADY ANSWERS THAT and I
had not read it closely enough:

    "the runway register is monochrome and dust, so new cooks land inside the palette
     below and THE WARDROBE DRIFTS DARK AS BATCHES REPLACE."

The mechanism is REPLACEMENT BY NEW COOKS, not migration of old ones. No ruling is
needed and none was ever needed; the job continues by cooking. That correction is
written into the handoff too, because a blocker that does not exist is worse than a
real one -- it stops work for nothing.

SO: WHAT DOES THE CARD ASK FOR THAT THE WARDROBE DOES NOT HAVE? Section 2 names its
shapes with reference ids, and two of them have no garment at all:

  RNWY-02  POLE A offers TWO shoulders and we built one. "EITHER cut square (corner
           rounding <= 1 px) OR A FULL COCOON ARC, ONE CURVE NECK TO ELBOW WITH NO
           SHOULDER POINT." The oversized shoulder from batch 1 is the SQUARE option
           and measures 0 px of corner rounding. THE ARC DOES NOT EXIST anywhere in
           the wardrobe -- every top on this rig has a shoulder POINT where the
           torso's edge meets the arm's.
  RNWY-05  POLE B wants "at least 2 visible hem lines stacked, each >= 3 px apart at
  /08      112 (>= 2 at 56), lower layer longer". Measured last round: a composed FIT
           stacks (a shirt over trousers), but NO SINGLE GARMENT DOES. Nothing in
           this wardrobe carries its own second hem, and a stack you can only get by
           putting two things on is not the garment the card is describing.

REFERENCE CHECK (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md).
  * BALENCIAGA's cocoon and egg-shouldered outerwear -- taken: THE SHOULDER HAS NO
    CORNER. The line runs from the neck out to the elbow as one curve, so the eye
    reads a dome rather than a box. It is the opposite treatment to the square pad
    and the card explicitly offers both, which is why this is a second shape and not
    a variant of the first.
  * RICK OWENS layering -- taken: THE HEM YOU CAN SEE TWICE. A longer, narrower
    under-layer showing below a shorter outer one, so the body has two horizontal
    lines instead of one. It is the single most recognisable thing that register
    does, and at 56 pixels two hem lines two cells apart is enough to read it.
  * THE PIXEL AISLE: black it out. The arc changes the top of the outline; the
    double hem changes the bottom of it. Both are outline, neither is texture.
THE CARD'S PALETTE: both ship on CHARCLOTH, ASHGREY and FADEDBLK (cloth saturation
0.037, 0.054, 0.077, all well inside the 0.25 ceiling); no garment here is an outer,
so the runway-black value band does not bind. No colour invented.

REUSE CHECK: cooks ZERO new graphic pixels and opens no bank for pixels -- two
geometry branches in the alpha's existing genTop, spending ramps already in the file.
banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt is opened and read.

GRAVEYARD, READ BEFORE COOKING: the only clothing kill is the V-NECK, a neckline. No
arc shoulder and no layered hem has ever been killed.

AND THE LESSON THIS LANE HAS PAID FOR TWICE, APPLIED UP FRONT: a hem does not hang
off a forearm (the longline ran down the arms and its sleeve length changed when the
body turned), and a garment must own EVERY facing (the one-shoulder drape existed
only from the front). Both new shapes are derived from the body per row and neither
returns early on a facing.

  python3 tools/bohemia_runway_cook_5_9_5_26.py
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
print('=== THE RUNWAY COOK, BATCH 5 (canon bank: %d bytes read) ===' % len(_canon))

sub("""    var wideSh=(opt.shoulder==='wide'), longline=(opt.cut==='long');""",
    """    var wideSh=(opt.shoulder==='wide'), longline=(opt.cut==='long');
    /* THE CARD ASKS FOR BOTH SHOULDERS AND WE HAD BUILT ONE (9/5, batch 5).
       RNWY-02: pole A is reached EITHER by a square cut OR by "a full cocoon arc,
       one curve neck to elbow with NO shoulder point". The pad above is the square
       one. This is the arc: the outer edge leaves the neck, swells over the
       shoulder and comes back in at the elbow as a single curve, so there is no
       corner anywhere on it. A dome, not a box.
       RNWY-05/08: pole B wants two visible hem lines, lower layer longer. A fit
       stacks -- a shirt over trousers -- but NO SINGLE GARMENT in this wardrobe
       carries its own second hem, and a stack you can only get by putting two
       things on is not what the card is describing. */
    var arcSh=(opt.shoulder==='arc'), layered=(opt.cut==='layered');""",
    'genTop: the arc shoulder and the layered hem declared')

sub("""    var aTop=CH; for(i=0;i<g.length;i++){var pB=g[i];if((pB===5||pB===6)){var yB=(i/CW)|0;if(yB<aTop)aTop=yB;}}""",
    """    var aTop=CH; for(i=0;i<g.length;i++){var pB=g[i];if((pB===5||pB===6)){var yB=(i/CW)|0;if(yB<aTop)aTop=yB;}}
    /* THE ARC. Its swell follows a half-ellipse over the shoulder rows, so the
       outline has a continuous curve and never a step: e(y) = round(peak *
       sqrt(1 - t^2)) with t running -1 to 1 across the band. Derived per row off
       the body's OWN edge, the fix this lane already paid for once when a square
       pad grown off the arm's widest row floated in mid-air. */
    var arcTopY=tTop, arcBotY=aTop+6*S, arcPeak=2*S;
    if(arcSh&&aMx>=0){
      /* *** THE FIRST CUT STILL HAD A POINT, AND THE GATE MEASURED IT AT 4 PX. ***
         A swell added to each row's own edge cannot remove a corner, because THE
         CORNER IS IN THE BODY: the torso is 10 cells across and the arms make it
         16, so the outline jumps three cells each side on the row the arms begin.
         Adding fabric outboard of that jump keeps the jump.
         SO THE ARC IS BUILT AS AN ABSOLUTE TARGET EDGE PER ROW, ramping IN above
         the shoulder so the outline has arrived at the arm's width before the arms
         do, then swelling and closing below it -- and the whole column is smoothed
         so no two neighbouring rows differ by more than one cell. That is what "no
         shoulder point" means as a measurement: no step. */
      var tgtL=[],tgtR=[],rowsA=[];
      for(var yA=arcTopY;yA<=arcBotY;yA++){
        var rMnA=CW,rMxA=-1;
        for(var xA=0;xA<CW;xA++){var gA=g[yA*CW+xA]; if(gA===4||gA===5||gA===6){if(xA<rMnA)rMnA=xA;if(xA>rMxA)rMxA=xA;}}
        if(rMxA<0)continue;
        rowsA.push(yA);
        if(yA<aTop){
          /* ABOVE THE SHOULDER THE RAMP IS EXPLICIT, not left to the clamp. The
             clamp only FORBIDS a step bigger than one cell; it does not MAKE the
             outline widen, so the rows above the arms stayed at torso width and the
             jump simply moved down a row. Here each row above the arms sits exactly
             one cell inside the row below it, so the outline has arrived at the
             arm's width by the time the arms do. The neck row is left alone: a bar
             of cloth up there is a collar shelf, not a shoulder. */
          tgtL.push(aMn+(aTop-yA)); tgtR.push(aMx-(aTop-yA)); continue; }
        var tA=((yA-arcTopY)/Math.max(1,(arcBotY-arcTopY)))*2-1;         /* -1 .. 1 */
        var eA=Math.round(arcPeak*Math.sqrt(Math.max(0,1-tA*tA)));
        tgtL.push(rMnA-eA); tgtR.push(rMxA+eA); }
      /* smooth: walk down, then back up, clamping every neighbour to one cell */
      for(var q=1;q<tgtL.length;q++){ if(tgtL[q]<tgtL[q-1]-S)tgtL[q]=tgtL[q-1]-S; if(tgtR[q]>tgtR[q-1]+S)tgtR[q]=tgtR[q-1]+S; }
      /* THE BACKWARD PASS HAD THE FORWARD PASS'S COMPARISON and so did nothing: it
         is the one that must WIDEN the rows ABOVE the shoulder, so the outline has
         already reached the arm's width before the arms arrive. Without it the body
         still jumped and the gate still measured a point. */
      for(var q2=tgtL.length-2;q2>=0;q2--){ if(tgtL[q2]>tgtL[q2+1]+S)tgtL[q2]=tgtL[q2+1]+S; if(tgtR[q2]<tgtR[q2+1]-S)tgtR[q2]=tgtR[q2+1]-S; }
      for(var q3=0;q3<rowsA.length;q3++){ var yR=rowsA[q3];
        for(var xR=tgtL[q3];xR<=tgtR[q3];xR++){
          if(xR<0||xR>=CW)continue; var iR=yR*CW+xR, gR=g[iR];
          if(gR===1||gR===2||gR===7||gR===8)continue; w[iR]=1; } } }""",
    'genTop: the arc geometry')

sub("""    var llBot=tBot;
    if(longline){ var leL=pExt(g,9),reL=pExt(g,10);""",
    """    /* THE SECOND HEM. The outer layer stops just past the waist and a NARROWER,
       LONGER under-layer shows below it, so the body carries two horizontal lines
       two cells apart instead of one. Narrower on purpose: if both hems were the
       same width the upper one would sit on the lower one's silhouette and vanish,
       which is the card's own warning that a stack "stays readable or it is a blob".
       AND IT NEVER RUNS DOWN AN ARM -- the lesson the longline cost this lane. */
    var layBot=tBot, layMid=tBot;
    if(layered){ var leY=pExt(g,9),reY=pExt(g,10);
      /* THE OUTER HEM SITS AT THE WAIST, NOT BELOW IT, and the gate is why: with the
         outer at tBot+2 and the under at 0.35 of the leg, this garment's OUTLINE was
         within 14% of the LONGLINE's, which is the dead V-NECK's failure between two
         of my own shapes. A layered top is a SHORT outer over a LONG under; a
         longline is one long hem. Making the outer shorter and the under longer is
         what makes them two garments instead of two names. */
      layMid=tBot+2*S;                                                   /* the outer hem: it needs a BAND to be a hem. Set flush to the waist
                                                                            it had no rows of its own, so the only steps in the outline were the
                                                                            arms ending and the under layer ending -- two, where a stack is three. */
      /* 0.35, NOT 0.22, AND MEASURING SAID SO. At 0.22 the two hems landed on rows
         34 and 35 -- ONE ROW APART -- and the only visible step in the silhouette
         was the ARMS ending, not either hem. The card wants the lines >= 2 cells
         apart at 56 and the stack "readable or it is a blob". At 0.35 they sit on
         34 and 37 with the under layer a cell narrower each side, so the outline
         steps twice and both steps belong to the garment. */
      layBot=tBot+fr(Math.min(leY.mn,reY.mn),Math.max(leY.mx,reY.mx),0.50);   /* the under hem, well past the longline's 0.30 */
      for(var yV=tBot+1;yV<=layBot;yV++){
        var insV=(yV>layMid)?S:0;                                        /* the under layer is a cell narrower each side */
        for(var xV=tMn+insV;xV<=tMx-insV;xV++){
          if(xV<0||xV>=CW)continue; var gV=g[yV*CW+xV];
          if(gV===1||gV===2||gV===5||gV===6||gV===7||gV===8)continue; w[yV*CW+xV]=1; } } }
    var llBot=tBot;
    if(longline){ var leL=pExt(g,9),reL=pExt(g,10);""",
    'genTop: the layered hem geometry')

sub("""      if(longline&&y>tb){ if(!inG(x,y+1))c=r.dk;                         /* the long hem */""",
    """      /* THE ARC IS SHADED AS ONE CURVED MASS: its edge dark, its crown lit, and NO
         hard horizontal anywhere -- a drop line would put back the corner the shape
         exists to remove. */
      if(arcSh&&y<=arcBotY&&(g[ii]!==4&&g[ii]!==5&&g[ii]!==6)){
        if(!inG(x-1,y)||!inG(x+1,y))c=r.dk;
        else if(x<cx)c=r.lt; }
      /* THE TWO HEMS, each drawn as its own line so both read */
      if(layered&&y>tb){ if(y>=layMid-(S-1)&&y<=layMid)c=r.dk;           /* the outer hem */
        else if(!inG(x,y+1))c=r.dk;                                      /* the under hem */
        else if(!inG(x-1,y)||!inG(x+1,y))c=r.dk;
        else if(y>layMid)c=mix(r.mid,0.85);                              /* the under layer sits back in shadow */
        else if(x<cx)c=r.lt; }
      if(longline&&y>tb){ if(!inG(x,y+1))c=r.dk;                         /* the long hem */""",
    'genTop: the arc and the two hems shaded')

sub("""    {n:'ASH FACE WRAP',st:'canon',fresh:true,layer:'face',gen:function(g){return wear(genAcc(g,{ramp:ASHGREY,kind:'facewrap'}),ASHGREY,12);}},
  ];""",
    """    {n:'ASH FACE WRAP',st:'canon',fresh:true,layer:'face',gen:function(g){return wear(genAcc(g,{ramp:ASHGREY,kind:'facewrap'}),ASHGREY,12);}},
    /* ---- THE RUNWAY, BATCH 5 (9/5/26) -- THE TWO SHAPES THE CARD ASKS FOR BY NAME
       AND THE WARDROBE DID NOT HAVE. RNWY-02: pole A offers a square shoulder OR a
       cocoon ARC, and we had built only the square one. RNWY-05/08: pole B wants two
       visible hem lines with the lower layer longer, and while a FIT stacks, no
       single garment carried its own second hem. ---- */
    {n:'ARC SHOULDER TEE',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:CHARCLOTH,sleeves:'short',neck:'crew',shoulder:'arc'}),CHARCLOTH,12);}},
    {n:'ASH ARC SHIRT',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:ASHGREY,sleeves:'long',neck:'crew',shoulder:'arc'}),ASHGREY,12);}},
    {n:'LAYERED JERSEY',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:FADEDBLK,sleeves:'long',neck:'crew',cut:'layered'}),FADEDBLK,12);}},
    {n:'ASH LAYERED TEE',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:ASHGREY,sleeves:'short',neck:'crew',cut:'layered'}),ASHGREY,12);}},
    {n:'ARC LAYERED SHIRT',st:'canon',fresh:true,layer:'base',gen:function(g){return wear(genTop(g,{ramp:CHARCLOTH,sleeves:'long',neck:'crew',shoulder:'arc',cut:'layered'}),CHARCLOTH,12);}},
  ];""",
    'GARMENTS: five entries on two new shapes')

open(ALPHA, 'w', encoding='utf-8').write(src)
print('\n%s: %d -> %d bytes' % (ALPHA, len(orig), len(src)))
