#!/usr/bin/env python3
"""
BOHEMIA — ONE BLACK PIXEL AROUND THE WHOLE CHARACTER (Paolo 7/27/26)

His words: "I want there to be a one pixel one black pixel border around the whole
character. You know just wrap around no matter what direction they're facing. I
think it would help fit them in the world a lot better."

WHAT IT DOES. After everything else is composited -- body, clothing, the limb
separation layer, the floater cull -- every EMPTY cell that orthogonally touches a
character pixel is painted black. One pixel, all the way around, every facing,
every frame.

It is computed from a SNAPSHOT of the finished sprite, so the outline never grows
on itself: an outline pixel is never treated as a body pixel when deciding the
next one. That is the difference between a 1px border and a creeping 2-3px one.

WHY IT IS THE LAST PASS. It must sit outside everything, including the limb
separation line, or a garment drawn afterwards would cover it -- the exact bug
that made the separation line worthless for a whole session. It also runs AFTER
the floater cull so it never outlines a speck that is about to be deleted.

THE BODY GRID IS NOT TOUCHED. The outline is colour only; `grid` stays 0 there, so
occupancy, hit-testing and every measurement tool still see the true silhouette.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks no art. It writes one
colour, pure black, into cells that were empty.

ONE THING HE SHOULD KNOW, flagged not hidden: the visual constitution's tile rules
forbid a black KEYLINE on art banks. This is not that -- it is a character/world
separation outline, drawn at render time, outside the sprite, and it is what he
asked for by name. If it reads too hard against the pale desert ground the honest
alternative is the constitution's darkest ground value instead of pure black, and
that is his call, not a thing to decide for him.

Behind CHAR_OUTLINE so it can be A/B'd and switched off in one line.

Idempotent.

  python3 tools/bohemia_character_outline_patch.py

RIG CHECK (RIG IS LAW, Paolo 7/26/26): Draws the 1px border around the composited silhouette as the last pass in
  buildFrame. It reads the finished frame, so it inherits whatever the rig
  produced and never consults a body definition of its own.
  built on: SKINNER_API
  joints: none named
  parts: none
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()

if 'ONE BLACK PIXEL AROUND THE WHOLE CHARACTER' in src:
    print('CHARACTER OUTLINE: already applied, nothing to do.')
    sys.exit(0)

# SCOPE, THE HARD WAY. The flag went next to RIGID for one build. RIGID lives
# INSIDE the SKINNER_API closure and buildFrame lives OUTSIDE it, so every frame
# threw ReferenceError and the alpha never finished booting -- the page looked
# hung, which reads as a Playwright timeout and sends you hunting the wrong bug.
# The flag is declared in buildFrame's OWN scope, immediately above it.
FLAG_ANCHOR = 'function buildFrame(d,clip,ph){'
FLAG = ('/* ONE BLACK PIXEL AROUND THE WHOLE CHARACTER (Paolo 7/27/26): a 1px border\n'
        '   wrapping the finished sprite on every facing, so he reads against the world.\n'
        '   Drawn as the very last pass in buildFrame -- so it is declared HERE, in\n'
        "   buildFrame's own scope. It lived next to RIGID for one build, which is\n"
        '   INSIDE the SKINNER_API closure, and buildFrame is outside it: every frame\n'
        '   threw ReferenceError and the alpha never finished booting. */\n'
        'const CHAR_OUTLINE = { on: true, color: [0,0,0] };\n' + FLAG_ANCHOR)
if 'const CHAR_OUTLINE' not in src:
    if src.count(FLAG_ANCHOR) != 1:
        die('buildFrame flag anchor found %d times (need exactly 1)' % src.count(FLAG_ANCHOR))
    src = src.replace(FLAG_ANCHOR, FLAG, 1)

ANCHOR = "  return {px,CW,CH};"
OUTLINE = '''  /* =========================================================================
     ONE BLACK PIXEL AROUND THE WHOLE CHARACTER (Paolo 7/27/26)
     "I want there to be a one pixel one black pixel border around the whole
      character, just wrap around no matter what direction they're facing. I think
      it would help fit them in the world a lot better."

     THE LAST PASS IN THE FRAME, deliberately. It has to sit outside everything --
     body, clothing, the limb separation layer -- or something drawn afterwards
     covers it, which is precisely the bug that made the separation line worthless
     for a whole session. It also runs after the floater cull, so it never
     outlines a speck that is about to be deleted.

     Computed from a SNAPSHOT, so the outline cannot grow on itself: an outline
     pixel is never counted as a character pixel when deciding the next one. That
     is the difference between a 1px border and a creeping 2-3px one.

     The body GRID is untouched -- colour only -- so occupancy, hit-testing and
     every measurement tool still see the true silhouette.
     ========================================================================= */
  if(CHAR_OUTLINE.on){
    const solid=new Uint8Array(CW*CH);
    for(let i=0;i<px.length;i++) if(px[i]) solid[i]=1;
    const C=CHAR_OUTLINE.color;
    for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){
      const i=y*CW+x;
      if(solid[i])continue;
      if((x+1<CW&&solid[i+1])||(x>0&&solid[i-1])||
         (y+1<CH&&solid[i+CW])||(y>0&&solid[i-CW])) px[i]=[C[0],C[1],C[2]];
    }
    /* CLOSE 1PX VOIDS (found 7/29 by the new SHOULDERS dial, but not its bug).
       A gap exactly ONE pixel wide between two parts is open to the outside when
       the interior hole-fill runs, so it survives that pass; then this outline
       paints both its WALLS and leaves the middle cell empty, because at snapshot
       time that cell's neighbours were empty too. The result is a black ring with
       a hole punched in it -- measured at (33,15) on SE and (22,15) on SW at
       shoulders +1, all four neighbours black, the cell itself null.
       Any empty cell now fully enclosed by the FINISHED sprite is closed with the
       outline colour. It cannot eat real space: a cell with even one empty
       neighbour is left alone, so armpits, crotch gaps and every intentional
       concavity are untouched. */
    for(let y=1;y<CH-1;y++)for(let x=1;x<CW-1;x++){
      const i=y*CW+x;
      if(px[i])continue;
      if(px[i+1]&&px[i-1]&&px[i+CW]&&px[i-CW]) px[i]=[C[0],C[1],C[2]];
    }
  }
''' + ANCHOR
if src.count(ANCHOR) != 1:
    die('buildFrame return anchor found %d times (need exactly 1)' % src.count(ANCHOR))
src = src.replace(ANCHOR, OUTLINE, 1)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('CHARACTER OUTLINE applied to slices/BOHEMIA_ALPHA_0_9.html')
print('  - 1px black border, every facing, drawn as the LAST pass')
print('  - snapshot-based, so it cannot grow on itself')
print('  - grid untouched: occupancy and hit-testing still see the true silhouette')
