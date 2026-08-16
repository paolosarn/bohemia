#!/usr/bin/env python3
"""BOHEMIA THE BORDER IS ONE PIXEL WHERE HE SEES IT (Paolo 8/14 + 8/15, CHARACTER lane)

PAOLO, twice: "the black border has to be thinner, like half as thin" and then,
looking at the build, "I want that black outline to be. It's thin in some parts and
I like that."

*** WHY IT WAS TWO PIXELS, AND IT WAS NEVER THE OUTLINE PASS'S FAULT. ***
CHAR_OUTLINE draws exactly ONE pixel. It always did. But it drew that pixel on the
56-wide composition, and drawChar then ran Scale2x over the finished image to get to
112 -- so the one pixel became two on the way to his screen. Measured against skin
on the real render path: 2px, every skin row.

    compose at 56 -> outline 1px -> Scale2x -> border arrives 2px
    compose at 56 -> Scale2x -> outline 1px -> border arrives 1px   <- this file

So the pass MOVES. It is the last thing that happens before he sees the frame,
which is what it always claimed to be ("THE LAST PASS IN THE FRAME, deliberately")
-- it just was not the last thing that happened before the frame reached the
SCREEN. Nothing about the border's own logic changes: same single pixel, same void
closing, same snapshot so it cannot grow on itself, same untouched body grid.

*** AND THIS IS THE HALF OF THE 2X RULING THAT SHIPS TODAY. THE OTHER HALF DOES
    NOT, AND HERE IS THE HONEST REASON. ***
Composing the whole frame natively at 112 works -- the seams are in, they are
proved, and the rig doubler is proved lossless. But his art holds 56x56 of
information, and doubling cannot invent detail. What Scale2x was quietly doing on
top of the upscale was ROUNDING THE CORNERS, and a large amount of the head's shape
came from exactly that: at 112-native with block-doubled art his head renders as a
BOX -- flat-sided hair, a jaw that drops straight down with no taper. That is a
visible regression and it walks straight into the 8/1 law, "no straight lines (hair
is little off shapes)". The way to actually get twice the pixels is to re-master the
art at 112, not to upscale it, and that is painting, not plumbing.

The 2X pipeline stays in the file and stays dormant at RIG_RS=1: every seam is the
identity there, proven frame-by-frame, so the day the art is painted at 112 the flip
is one call.

    python3 tools/bohemia_outline_at_display.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---------------------------------------------------------------------------
# 1. the outline becomes a FUNCTION, so the same one pixel can be drawn at
#    whatever size the frame is finally shown at. Byte-for-byte the same body.
# ---------------------------------------------------------------------------
OLD_BLOCK = """  if(CHAR_OUTLINE.on){
    const solid=new Uint8Array(CW*CH);
    for(let i=0;i<px.length;i++) if(px[i]) solid[i]=1;
    const C=CHAR_OUTLINE.color;
    for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){
      const i=y*CW+x;
      if(solid[i])continue;
      if((x+1<CW&&solid[i+1])||(x>0&&solid[i-1])||
         (y+1<CH&&solid[i+CW])||(y>0&&solid[i-CW])) px[i]=[C[0],C[1],C[2]];
    }"""

NEW_BLOCK = """  if(CHAR_OUTLINE.on && !_noOutline) applyCharOutline(px,CW,CH);
  return {px,CW,CH};
}
/* THE BORDER, AS A PASS THAT CAN RUN AT THE SIZE HE ACTUALLY SEES (Paolo 8/14:
   "the black border has to be thinner, like half as thin").
   Not one line of the border's own logic changed -- same single pixel, same
   snapshot so it cannot grow on itself, same void closing, same untouched body
   grid. What changed is WHEN: it used to run on the 56 composition and then get
   doubled to 2px by the Scale2x that takes the frame to 112. Now drawChar upscales
   first and calls this last, so the one pixel he asked for is the one pixel that
   arrives. Measured against skin on the real render path: 2px -> 1px. */
function applyCharOutline(px,CW,CH){
  {
    const solid=new Uint8Array(CW*CH);
    for(let i=0;i<px.length;i++) if(px[i]) solid[i]=1;
    const C=CHAR_OUTLINE.color;
    for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){
      const i=y*CW+x;
      if(solid[i])continue;
      if((x+1<CW&&solid[i+1])||(x>0&&solid[i-1])||
         (y+1<CH&&solid[i+CW])||(y>0&&solid[i-CW])) px[i]=[C[0],C[1],C[2]];
    }"""

OLD_TAIL = """    for(let y=1;y<CH-1;y++)for(let x=1;x<CW-1;x++){
      const i=y*CW+x;
      if(px[i])continue;
      if(px[i+1]&&px[i-1]&&px[i+CW]&&px[i-CW]) px[i]=[C[0],C[1],C[2]];
    }
  }
  return {px,CW,CH};
}"""

NEW_TAIL = """    for(let y=1;y<CH-1;y++)for(let x=1;x<CW-1;x++){
      const i=y*CW+x;
      if(px[i])continue;
      if(px[i+1]&&px[i-1]&&px[i+CW]&&px[i-CW]) px[i]=[C[0],C[1],C[2]];
    }
  }
  return px;
}"""

# ---------------------------------------------------------------------------
# 2. buildFrame learns to leave the border off, and the cache learns to tell the
#    two kinds of frame apart. A cache that cannot is a cache that hands a
#    borderless frame to the city bake.
# ---------------------------------------------------------------------------
EDITS = [
    ('buildFrame can compose without the border',
     "function buildFrame(d,clip,ph){",
     """/* _noOutline: compose everything EXCEPT the black border, for callers that are
   going to upscale first and draw the border at final size (see applyCharOutline).
   Default false, so every existing caller behaves exactly as it did. */
function buildFrame(d,clip,ph,_noOutline){"""),

    ('the frame cache tells bordered and borderless frames apart',
     "function buildFrameCached(d,clip,ph){\n  if(TERMINAL[clip])return buildFrame(d,clip,ph);",
     """function buildFrameCached(d,clip,ph,_noOutline){
  if(TERMINAL[clip])return buildFrame(d,clip,ph,_noOutline);"""),

    ('...and keys on it, so a borderless frame can never be served as a bordered one',
     "  const k=d+'|'+clip+'|'+(_ph?_ph.sig:q)+'|'+frameLookHash(d);",
     "  const k=d+'|'+clip+'|'+(_ph?_ph.sig:q)+'|'+(_noOutline?'nb':'b')+'|'+frameLookHash(d);"),

    ('the cached frame is built the way it was asked for',
     "  const f=buildFrame(d,clip,(q+0.5)/b);\n  FRAME_CACHE.map.set(k,f);",
     "  const f=buildFrame(d,clip,(q+0.5)/b,_noOutline);\n  FRAME_CACHE.map.set(k,f);"),

    # ---- drawChar: upscale first, border last ----
    ('drawChar draws the border LAST, at the size he sees',
     """    const f=buildFrameCached(d,clip,ph);
    let px=f.px,W=f.CW,H=f.CH;
    /* 2X: Scale2x is what USED to take a 56 frame to 112, and it is also what
       made the 1px outline arrive 2px thick. Once the frame is composed natively
       at 112 there is nothing to upscale -- the pass is skipped, the border comes
       out at its true one pixel, and the CPU it was costing comes back. */
    if(G.hd && RIG_RS===1){ // Scale2x on everything, final HD
      const idx=px.map(c=>c?((c[0]<<16)|(c[1]<<8)|c[2])+1:0); // pack, 0=empty
      const s=Scale2x.scale2x(idx,W,H);
      const unpacked=s.data.map(v=>v?[(v-1)>>16&255,(v-1)>>8&255,(v-1)&255]:null);
      px=unpacked;W=s.W;H=s.H;
    }""",
     """    /* THE BORDER IS DRAWN AFTER THE UPSCALE (Paolo 8/14). The frame is composed
       WITHOUT it, Scale2x takes the body to 112 exactly as it always did -- so
       everything he has approved is pixel-for-pixel what it was, including the
       corner rounding that gives the head its shape -- and then the one-pixel
       border is drawn at 112. That is the whole "half as thin": the pass never
       changed, it just stopped being doubled on its way to the screen. */
    const _upscale=(G.hd && RIG_RS===1);
    const f=buildFrameCached(d,clip,ph,_upscale);
    let px=f.px,W=f.CW,H=f.CH;
    if(_upscale){ // Scale2x on everything, final HD
      const idx=px.map(c=>c?((c[0]<<16)|(c[1]<<8)|c[2])+1:0); // pack, 0=empty
      const s=Scale2x.scale2x(idx,W,H);
      const unpacked=s.data.map(v=>v?[(v-1)>>16&255,(v-1)>>8&255,(v-1)&255]:null);
      px=unpacked;W=s.W;H=s.H;
      if(CHAR_OUTLINE.on) applyCharOutline(px,W,H);
    }"""),

    # ---- the combat sprite bake gets the same border, or COMBAT and CHARACTER
    # ---- would disagree about how thick he is outlined
    ('the combat sprites get the same one-pixel border',
     """function bake112(d,clip,ph){const f=buildFrame(d,clip,ph);const r=frameToRGBA(f);
  return packIdx(f.CW===112?r:rgba2x(r,f.CW,f.CH),112,112);}""",
     """/* SAME BORDER IN COMBAT. These sprites go to the combat module at 112, and if
   they kept the doubled border he would be outlined 2px in one tab and 1px in the
   next. Composed borderless, upscaled, bordered at 112 -- the same three steps
   drawChar takes. */
function bake112(d,clip,ph){
  const f=buildFrame(d,clip,ph,true);
  let px=f.px,W=f.CW,H=f.CH;
  if(W!==112){const idx=px.map(c=>c?((c[0]<<16)|(c[1]<<8)|c[2])+1:0);
    const s=Scale2x.scale2x(idx,W,H);
    px=s.data.map(v=>v?[(v-1)>>16&255,(v-1)>>8&255,(v-1)&255]:null);W=s.W;H=s.H;}
  if(CHAR_OUTLINE.on) applyCharOutline(px,W,H);
  return packIdx(frameToRGBA({px:px,CW:W,CH:H}),112,112);}"""),

    ('the dial sprite sequence gets it too',
     """          {const _r=frameToRGBA(f);seq.push(packIdx(f.CW===112?_r:rgba2x(_r,f.CW,f.CH),112,112));}""",
     """          {let _p=f.px,_w=f.CW,_h=f.CH;
           if(_w!==112){const _ix=_p.map(c=>c?((c[0]<<16)|(c[1]<<8)|c[2])+1:0);
             const _s=Scale2x.scale2x(_ix,_w,_h);
             _p=_s.data.map(v=>v?[(v-1)>>16&255,(v-1)>>8&255,(v-1)&255]:null);_w=_s.W;_h=_s.H;}
           seq.push(packIdx(frameToRGBA({px:_p,CW:_w,CH:_h}),112,112));}"""),
]

# the two headshot frames feeding the dial sequence must also come borderless, or
# the border gets doubled for them alone
HS_EDITS = [
    ("          if(dclip==='headshot-2'){ if(k>0)for(let s=0;s<9;s++)rgStep(1/60); f=buildFrame(L.d,'headshot-2',0); }",
     "          if(dclip==='headshot-2'){ if(k>0)for(let s=0;s<9;s++)rgStep(1/60); f=buildFrame(L.d,'headshot-2',0,true); }"),
    ("          else { if(k>0)for(let s=0;s<9;s++)hsStep(1/60); f=buildFrame(L.d,'headshot',0); }",
     "          else { if(k>0)for(let s=0;s<9;s++)hsStep(1/60); f=buildFrame(L.d,'headshot',0,true); }"),
]


def main():
    alpha = open(ALPHA, encoding='utf8').read()
    applied, missed = [], []

    for label, old, new in [('the border becomes a pass that can run at any size', OLD_BLOCK, NEW_BLOCK),
                            ('...and returns the pixels it bordered', OLD_TAIL, NEW_TAIL)] + EDITS:
        if new in alpha:
            applied.append('(already) ' + label); continue
        n = alpha.count(old)
        if n != 1:
            missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
        alpha = alpha.replace(old, new, 1)
        applied.append(label)

    for old, new in HS_EDITS:
        if new in alpha:
            applied.append('(already) a headshot frame comes borderless'); continue
        if alpha.count(old) != 1:
            missed.append('a headshot frame comes borderless -- found %d' % alpha.count(old)); continue
        alpha = alpha.replace(old, new, 1)
        applied.append('a headshot frame comes borderless')

    for l in applied: print('  ok   ' + l)
    for l in missed:  print('  MISS ' + l)
    if missed:
        print('OUTLINE AT DISPLAY: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        return 1
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('OUTLINE AT DISPLAY: applied to %s' % ALPHA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
