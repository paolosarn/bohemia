#!/usr/bin/env python3
"""BOHEMIA THE THIN BORDER WAS NOT THIN IN THE GAME (8/17/26, CHARACTER lane)

Paolo 8/14: "the black border has to be thinner, like half as thin."

I delivered that on the CHARACTER tab and in COMBAT and wrote the law with a gate.
THE SURFACE HE ACTUALLY PLAYS STILL DOUBLES IT, and this is the exact thing that
law warned about in its own text: "fixing only drawChar would outline him 1px in
CHARACTER and 2px in the next tab."

FOUND BY READING THE LADDER, not by squinting at pixels. Three earlier attempts to
measure this visually all caught the wrong thing -- the desert sand read as skin,
and a motion-diff caught a HUD bar instead of the player -- so the answer came from
the code, where it is not ambiguous. CITY_WORLD, player draw and peoplePass, the
same eight lines in both:

    const lad = C>=64 ? 224 : (C>=32 ? 112 : (C<17 ? 28 : 56));
    if (C>=64){ spr._hd4 = epx2(epx2(spr)); img=spr._hd4; }   // x4
    else if (C>=32){ spr._hd = epx2(spr);   img=spr._hd;  }   // x2
    else if (C<17){ spr._half = half2(spr); img=spr._half; }
                                                              // else raw 56

and `let HC=44` is the DEFAULT walk zoom (CITY_WORLD:16059). 44 >= 32, so at the
zoom the game opens at, every character sprite is EPX-doubled -- and the 1px border
baked into it at 56 arrives TWO pixels thick. Zoom in past 64 and it is FOUR.

The character tab shows him at 1px. The game shows him at 2px. Same character, same
build, two different outlines, which reads as inconsistent art rather than as a bug
and is precisely why the law says every path that draws a character joins it.

THE FIX IS THE SAME ONE THE ALPHA ALREADY USES: draw the border AFTER the upscale,
at the size it will be seen.

  ALPHA   bake56 ships the sprite BORDERLESS. It feeds citySendPlayer AND the city
          cast, so the player and all six resident bodies change together -- there
          is no mixed state where one has an outline and the others do not.
  CITY    a shared spriteAt(spr, C) scales for the tier and borders ONCE, caching
          the bordered canvas exactly where the old code cached the scaled one. Per
          frame this costs nothing: the same drawImage of the same cached canvas.

WHY A SHARED HELPER RATHER THAN EDITING BOTH LADDERS: they were already duplicated
line for line in the player draw and in peoplePass, and a border applied to one and
not the other is worse than no fix at all. One function, both call sites, and the
duplicate ladder disappears with it.

*** THE ONE THING THAT MUST NOT GO WRONG: the raw-56 tier now needs the border TOO,
because the art arriving is borderless. *** The old code passed `spr` straight
through at that tier. If that path is missed, everybody loses their outline
entirely at mid zoom -- which is why the gate measures the border at more than one
zoom rather than only at the default.

_hd0 exists so the x4 tier chains off an UNBORDERED double. Chaining x4 off the
bordered x2 would border a border and put a 2px ring back at the closest zoom,
which is the bug wearing a different hat.

    python3 tools/bohemia_city_border_at_display.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'

# --------------------------------------------------------------- the alpha half
ALPHA_EDITS = [
    ('bake56 ships the city its sprites BORDERLESS',
     """function bake56(d,clip,ph){const f=buildFrame(d,clip,ph);const r=frameToRGBA(f);
  return packIdx(f.CW===56?r:_rgbaHalf(r,f.CW,f.CH),56,56);} /* RAW art: city applies the Scale2x ladder itself (integer scale law) */""",
     """/* BORDERLESS ON PURPOSE (Paolo 8/14, "half as thin"). The city applies its own
   integer ladder to these -- EPX x2 at the default walk zoom (HC=44), x4 past 64 --
   so a border baked in here at 56 reaches the screen 2px or 4px thick, which is the
   exact doubling the ruling removed everywhere else. The city draws the one pixel
   itself, after scaling, at the size it will be seen. This feeds BOTH the player
   and the city cast, so every body in the world changes together. */
function bake56(d,clip,ph){const f=buildFrame(d,clip,ph,true);const r=frameToRGBA(f);
  return packIdx(f.CW===56?r:_rgbaHalf(r,f.CW,f.CH),56,56);} /* RAW art: city applies the Scale2x ladder itself (integer scale law) */"""),
]

# ---------------------------------------------------------------- the city half
CITY_HELPER = """
/* ===== THE BORDER IS DRAWN AT DISPLAY SIZE (Paolo 8/14, CHARACTER lane 8/17) =====
   "the black border has to be thinner, like half as thin."
   The alpha now ships these bodies BORDERLESS, because this file scales them on an
   integer ladder -- EPX x2 at the default walk zoom (HC=44), x4 past 64 -- and a
   1px border baked in at 56 arrived on screen 2px thick, and 4px zoomed in. The
   character tab showed him at 1px and the game showed him at 2px: same character,
   two outlines.
   So the pixel is drawn HERE, once, on the cached scaled canvas. Per frame this
   costs exactly what it used to: one drawImage of one cached canvas.
   Mirrors the alpha's own pass (applyCharOutline): computed from a SNAPSHOT so the
   border cannot grow on itself, orthogonal 4-neighbour so corners stay sharp, and
   it only ever writes cells that were EMPTY -- painted art is untouchable. */
function outline1(src){
  const w=src.width,h=src.height;
  const out=document.createElement('canvas'); out.width=w; out.height=h;
  const g2=out.getContext('2d'); g2.imageSmoothingEnabled=false;
  g2.drawImage(src,0,0);
  const im=g2.getImageData(0,0,w,h), D=im.data;
  const solid=new Uint8Array(w*h);
  for(let i=0;i<w*h;i++) if(D[i*4+3]>8) solid[i]=1;      /* SNAPSHOT first */
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=y*w+x; if(solid[i])continue;
    if((x+1<w&&solid[i+1])||(x>0&&solid[i-1])||
       (y+1<h&&solid[i+w])||(y>0&&solid[i-w])){
      const o=i*4; D[o]=0; D[o+1]=0; D[o+2]=0; D[o+3]=255;
    }
  }
  g2.putImageData(im,0,0);
  return out;
}
/* ONE LADDER, BOTH CALL SITES. The player draw and peoplePass carried the same
   eight lines each; a border applied to one and not the other is worse than none.
   _hd0 is the UNBORDERED double, kept so the x4 tier chains off it -- chaining x4
   off the bordered x2 would border a border and put 2px back at the closest zoom. */
function spriteAt(spr,C){
  if(C>=64){ if(!spr._hd4){ if(!spr._hd0)spr._hd0=epx2(spr); spr._hd4=outline1(epx2(spr._hd0)); } return spr._hd4; }
  if(C>=32){ if(!spr._hd){ if(!spr._hd0)spr._hd0=epx2(spr); spr._hd=outline1(spr._hd0); } return spr._hd; }
  if(C<17){ if(!spr._half)spr._half=outline1(half2(spr)); return spr._half; }
  if(!spr._b)spr._b=outline1(spr);      /* RAW 56 NEEDS IT TOO -- the art arrives borderless */
  return spr._b;
}
"""

CITY_EDITS = [
    ('the player draw goes through the shared bordered ladder',
     """    let img=spr;
    if(HC>=64){ if(!spr._hd4){ if(!spr._hd)spr._hd=epx2(spr); spr._hd4=epx2(spr._hd); } img=spr._hd4; }
    else if(HC>=32){ if(!spr._hd)spr._hd=epx2(spr); img=spr._hd; }
    else if(HC<17){ if(!spr._half)spr._half=half2(spr); img=spr._half; }""",
     """    /* the border is drawn at DISPLAY size now -- see spriteAt/outline1 */
    let img=spriteAt(spr,HC);"""),

    ('the residents go through the same one',
     """      let img = spr;
      if (C >= 64) { if (!spr._hd4) { if (!spr._hd) spr._hd = epx2(spr); spr._hd4 = epx2(spr._hd); } img = spr._hd4; }
      else if (C >= 32) { if (!spr._hd) spr._hd = epx2(spr); img = spr._hd; }
      else if (C < 17) { if (!spr._half) spr._half = half2(spr); img = spr._half; }""",
     """      /* SAME ladder as the player, shared rather than duplicated: an outline on
         one and not the other is worse than none at all. */
      let img = spriteAt(spr, C);"""),
]


def main():
    applied, missed = [], []

    city = open(CITY, encoding='utf8').read()
    if 'function spriteAt(' not in city:
        anchor = 'function epx2(src){'
        if city.count(anchor) != 1:
            missed.append('spriteAt insertion point -- found %d anchors' % city.count(anchor))
        else:
            city = city.replace(anchor, CITY_HELPER.strip() + '\n' + anchor, 1)
            applied.append('outline1 + spriteAt exist in the city')
    else:
        applied.append('(already) outline1 + spriteAt exist in the city')

    for label, old, new in CITY_EDITS:
        if new in city:
            applied.append('(already) ' + label); continue
        n = city.count(old)
        if n != 1:
            missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
        city = city.replace(old, new, 1)
        applied.append(label)

    alpha = open(ALPHA, encoding='utf8').read()
    for label, old, new in ALPHA_EDITS:
        if new in alpha:
            applied.append('(already) ' + label); continue
        n = alpha.count(old)
        if n != 1:
            missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
        alpha = alpha.replace(old, new, 1)
        applied.append(label)

    for l in applied: print('  ok   ' + l)
    for l in missed:  print('  MISS ' + l)
    if missed:
        print('CITY BORDER: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        print('  NOTHING WAS WRITTEN. Both halves land together or the world loses its outlines.')
        return 1
    open(CITY, 'w', encoding='utf8').write(city)
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('CITY BORDER: applied to both files (they only work together)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
