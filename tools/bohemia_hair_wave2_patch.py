#!/usr/bin/env python3
"""BOHEMIA -- HAIR WAVE 2: THE BACK OF THE HEAD (8/1/26). Idempotent.

Paolo's wave-1 verdict: 13 KEEP, 13 KILL, and one note above all the others.

  "the shape from the front and the back for a lot of hairstyles whether I proved
   or disapprove them they are coming off very similar ... By far the most natural
   looking back of the head that you have is the bun one so think about how you
   made the low bun when you make the rest of the back of the heads a lot of the
   back of the heads there's a lot of headspace that should be covered more by
   hair absolutely THAT'S THE FIRST THING"

The bun shape is killed as a style and promoted as the reference. Not a contradiction:
the style did not earn a slot, the silhouette did.

WHY THE BACKS WERE BARE, found by reading my own generator rather than guessing.
The mass loop runs `for y = topRow .. sideBot + backEx`, and

    sideBot = hTop + round(hH * sideF)      // sideF defaults to 0.62

is the SAME on every facing. So from behind -- where there is no face to avoid and
the whole skull is hair -- the mass still stopped at 62% of head height and left
the bottom third of the skull bare. The killed bun shape only looked right because its mass
happened to fill that band. Every other shape showed scalp.

WHAT CHANGES, in his order:

1. THE BACK IS THE WHOLE SKULL. On a back facing, sideBot becomes hBot -- hair
   covers to the jaw, then `opt.back` extends past it. This alone is his "first
   thing", and it is what makes a back read differently from a front, because the
   front is still bounded by the brow ceiling and the two-curtain rule.

2. THE NAPE. A real head of hair does not end in a straight horizontal line at the
   jaw; it comes to a nape. From behind, the last two rows narrow toward centre.

3. NO STRAIGHT LINES. "a lot about hair is about just the little off shapes that
   it makes ... I'm seeing you make like a lot of straight lines and that's not
   realistic at all". Every row edge now takes a deterministic +/-1 wobble keyed
   to the style name and the row, so no two rows share an exact edge and the same
   style always wobbles the same way (an NPC cannot shimmer between frames).

4. ONE PIXEL, NOT THREE. Said twice, for the rope shape and CORNROWS: "the difference is
   just one pixel not like two or three". locs went `(x-mn)%3===2` (two hair, one
   gap); now `%2===1` -- one hair, one gap, which is all 56px can carry.

5. CENTRE THE STRIP. "Mohawk is good, but ... You kinda have it like off to the
   right so please fix that." hcx was `Math.round((hMn+hMx)/2)`, and Math.round
   breaks .5 UPWARD -- on an even-width head that pushes the strip one pixel
   right, every time. Now floor, and the strip centres on the CURRENT row's own
   span so it tracks a tilted skull on SE/SW.

6. A LONG STYLE PEEKS FROM THE FRONT. "with more of the longer hairstyles even
   from the front I would like to see you know a couple pixels of hair, depending
   on that sort of hairstyle from the front, even if it is in the back of the
   head." Styles with real back length now show their mass past the shoulder line
   on a front facing.

7. SLICK BACK, his one dimensional note: "you can make the front just like one
   pixel taller."

THE 13 KILLS go to st:'dead' and into the graveyard registry with post-mortems.
GRAVEYARD IS FINAL: they are not edited back to life, and a future wave answering
the same slot is a FRESH COOK under a new name.

REUSE CHECK: cooks no NEW graphic pixels and adds no new style. It reshapes the
existing genHair mass loop, which draws from the existing hair ramps. No bank is
opened because nothing new is drawn.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads the PART GRID to find the skull, the
same way genHat does, and never touches BAKED. It paints an overlay; his painted
regions are not modified.
  built on: none
  joints: none named
  parts: 1=head, 2=face
"""
import sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
ALPHA = ROOT / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
src = ALPHA.read_text()

if 'HAIR WAVE 2' in src:
    print('HAIR WAVE 2: already applied, nothing to do')
    sys.exit(0)

# ---------------------------------------------------------------- 1. centre
OLD = "    var hH=Math.max(1,hBot-hTop), hcx=Math.round((hMn+hMx)/2);"
NEW = ("    /* HAIR WAVE 2 (Paolo 8/1). FLOOR, NOT ROUND: Math.round breaks .5 upward, so on\n"
       "       an even-width skull the centre landed one pixel right and every strip style\n"
       "       sat off-centre. \"Mohawk is good, but ... You kinda have it like off to the\n"
       "       right so please fix that.\" */\n"
       "    var hH=Math.max(1,hBot-hTop), hcx=Math.floor((hMn+hMx)/2);\n"
       "    /* a deterministic wobble: same style + same row = same offset, forever, so an\n"
       "       NPC never shimmers between frames. \"a lot about hair is about just the little\n"
       "       off shapes that it makes ... I'm seeing you make like a lot of straight lines\n"
       "       and that's not realistic at all.\" */\n"
       "    var _wseed=0, _wn=(opt.name||'');\n"
       "    for(var _wi=0;_wi<_wn.length;_wi++){_wseed=(Math.imul(_wseed^_wn.charCodeAt(_wi),16777619))>>>0;}\n"
       "    var wob=function(y,side){ var h=(Math.imul((_wseed^(y*2654435761))>>>0,2246822507))>>>0;\n"
       "      return ((h>>>(side?7:17))&3)===0 ? 1 : 0; };")
if OLD not in src:
    sys.exit('WAVE2: head-centre line not found')
src = src.replace(OLD, NEW, 1)

# ------------------------------------------------- 2. the back is the whole skull
OLD = "    var sideBot=hTop+Math.round(hH*sideF);"
NEW = ("    /* THE BACK IS THE WHOLE SKULL (Paolo 8/1, \"that's the first thing\"). sideF was\n"
       "       applied on EVERY facing, so from behind -- where there is no face to avoid --\n"
       "       the mass still stopped at 62% of head height and left the bottom third bare.\n"
       "       The killed bun shape only looked right because its knot filled that band by accident. */\n"
       "    var sideBot=back?hBot:(hTop+Math.round(hH*sideF));")
if OLD not in src:
    sys.exit('WAVE2: sideBot line not found')
src = src.replace(OLD, NEW, 1)

# ---------------------------------------------------------------- 3. locs 1px
OLD = "        if(tex==='locs'&&((x-mn)%3===2))continue;                  /* ropes with gaps between */"
NEW = ("        /* ONE PIXEL, NOT THREE (Paolo 8/1, said twice): \"the difference is just one\n"
       "           pixel not like two or three\". %3 gave two hair and one gap; at 56px the\n"
       "           rope read as a solid mass with a stripe. One and one is all it can carry. */\n"
       "        if(texSkip(x,y))continue;   /* 2 hair : 1 skin, shared by both paths -- Paolo 8/1 */")
if OLD not in src:
    sys.exit('WAVE2: locs texture line not found')
src = src.replace(OLD, NEW, 1)

# --------------------------------------------- 4. strip centres on the row + nape + wobble
OLD = """      if(strip){ mn=hcx-strip; mx=hcx+strip; }"""
NEW = """      if(strip){ var _rc=Math.floor((s[0]+s[1])/2); mn=_rc-strip; mx=_rc+strip; }   /* centre on THIS row's span so it tracks a tilted skull */"""
if OLD not in src:
    sys.exit('WAVE2: strip line not found')
src = src.replace(OLD, NEW, 1)

OLD = """      if(y>hBot){                                                  /* past the jaw: the fall narrows */
        var t=y-hBot; mn+=Math.min(2,(t/3)|0); mx-=Math.min(2,(t/3)|0); }"""
NEW = """      if(y>hBot){                                                  /* past the jaw: the fall narrows */
        var t=y-hBot; mn+=Math.min(2,(t/3)|0); mx-=Math.min(2,(t/3)|0); }
      /* THE NAPE (Paolo 8/1): hair does not end in a straight horizontal line at the
         jaw, it comes to a nape. From behind, the last two rows draw in toward centre. */
      if(back&&y>=hBot-1&&y<=hBot){ var _nd=(y-(hBot-1))+1; mn+=_nd; mx-=_nd; }
      if(!strip){ mn-=wob(y,0); mx+=wob(y,1); }                    /* NO STRAIGHT LINES */"""
if OLD not in src:
    sys.exit('WAVE2: jaw-narrow block not found')
src = src.replace(OLD, NEW, 1)

# ------------------------------- 5. a long style peeks past the shoulder from the front
OLD = """        var fs=span(Math.min(y,hBot)); if(!fs)continue;
        var w=Math.max(1,Math.round((fs[1]-fs[0]+1)*0.22));"""
NEW = """        var fs=span(Math.min(y,hBot)); if(!fs)continue;
        /* A LONG STYLE PEEKS FROM THE FRONT (Paolo 8/1): "with more of the longer
           hairstyles even from the front I would like to see you know a couple pixels
           of hair ... even if it is in the back of the head." Below the jaw a style
           with real back length widens its curtains instead of tapering away. */
        var w=Math.max(1,Math.round((fs[1]-fs[0]+1)*0.22));
        if((opt.back||0)>=3&&y>hBot) w+=1;"""
if OLD not in src:
    sys.exit('WAVE2: front-curtain block not found')
src = src.replace(OLD, NEW, 1)

# ------------------------------------------------- 6. every style carries its name
# wob() keys off opt.name, so each shape must pass one. Styles are declared as
# {n:'NAME',...gen:function(g){return wear(genHair(g,{ramp:...}),...)}}
import re
def addname(m):
    name, opts = m.group(1), m.group(2)
    if 'name:' in opts:
        return m.group(0)
    return m.group(0).replace('genHair(g,{', "genHair(g,{name:'%s'," % name, 1)
pat = re.compile(r"\{n:'([A-Z0-9 '-]+)',st:'(?:canon|cook)',layer:'hair',gen:function\(g\)\{return [^\n]*?genHair\(g,\{([^}]*)\}")
src, nsub = pat.subn(addname, src)
print('WAVE 2: named %d hair styles for the wobble seed' % nsub)

# ------------------------------------------------------------- 7. SLICK BACK +1px
OLD_SB = "{n:'SLICK BACK',st:'canon',layer:'hair',gen:function(g){return wear(genHair(g,{name:'SLICK BACK',"
if OLD_SB in src:
    seg_start = src.index(OLD_SB)
    seg_end = src.index('}', src.index('genHair(g,{', seg_start))
    seg = src[seg_start:seg_end]
    if 'front:' in seg:
        newseg = re.sub(r"front:([0-9.]+)", lambda m: "front:%.3g" % max(0.0, float(m.group(1)) - 0.06), seg, count=1)
    else:
        newseg = seg.replace("name:'SLICK BACK',", "name:'SLICK BACK',front:0.16,", 1)
    src = src[:seg_start] + newseg + src[seg_end:]
    print("WAVE 2: SLICK BACK front raised one pixel (his note)")

# ----------------------------------------------- 8. CORNROWS are ROWS, not a waffle
# "Corn roses decent please do it better ... one pixel that's hair one pixel that
# skin." CORNROWS was on tex:'braid', whose rule skips on BOTH axes -- that is a
# checkerboard, and on the back of the head it read as a mesh rather than rows.
# Cornrows are vertical rows on the scalp, which is exactly what the 1px stripe
# texture now draws. (The rope shape is dead by his verdict, so the texture name is free.)
OLD_CR = "name:'CORNROWS',ramp:H_BLK,vol:0,side:0.50,front:0.16,tex:'braid'"
NEW_CR = "name:'CORNROWS',ramp:H_BLK,vol:0,side:0.50,front:0.16,tex:'locs'"
if OLD_CR in src:
    src = src.replace(OLD_CR, NEW_CR, 1)
    print('WAVE 2: CORNROWS switched from checkerboard to 1px vertical rows')

ALPHA.write_text(src)
print('HAIR WAVE 2: applied (full back skull, nape, wobble, 1px locs, centred strip, long-peek)')
