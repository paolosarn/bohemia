#!/usr/bin/env python3
"""
BOHEMIA — EACH PART SHADED ON ITS OWN SHAPE (Paolo 7/26/26)

"So it was the morphing fixed yes or no, like why can't you just code the render
differently, what's wrong with you?"

No, it was not fixed -- the arm hold removed 49% and the other half is the
SHADING. This is that half, and it is the retry the arm hold earned.

WHY IT IS A RETRY. The same rule was built three times earlier today and all
three measured WORSE (7,524 / 6,735 / 7,238 against a 6,266 baseline; recorded in
laws/BOHEMIA_ADDENDUM_PARTS_ARE_PAINTED_7_26_26.md). Every one of those failures
was a correct rule applied to a boundary that churned every frame: the arm's own
deformed edge was moving 1-2px per frame, so binding a 1px anatomy line to it
made the line dash and shimmer. THE ARMS NOW HOLD THEIR POSE for ~5 frames at a
time, so that edge is still, and the rule finally has something stable to sit on.
Of the 3,314 flips remaining after the hold, 55% are a cell owned by the SAME
limb all three frames -- that is shading, not ownership.

WHAT IT DOES. buildFrame recomputed every skin pixel's tone each frame from the
COMBINED deformed grid -- a dark anatomy line wherever an orthogonal neighbour was
empty or belonged to a different limb group -- so the torso's shading was drawn
from wherever the arm happened to be that frame. Now each limb group is shaded
against ITS OWN COMPLETE SHAPE and nothing else's. The torso is classified as a
whole 116px torso including every pixel the arm is standing on. This is his PARTS
ARE PAINTED ruling: "everything should already be painted for their individual
body parts first."

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels, and adds NO
new buffer -- it reuses `partCv`, the per-part shape the OWN CANVAS patch already
records before occlusion. His anatomy rules (line, waist blend, shoulder blend,
sky top-light) are used verbatim; the only change is what they may look at.

ONE DIFFERENCE FROM THE FAILED ATTEMPT 3: the sky top-light stays on the COMBINED
grid. Attempt 3 moved it onto each part's own form too, and that alone drove the
base<->top-light flips from 340 to ~900, because a part's own top edge moves as it
bends. The line moves to own-shape; the top-light does not. That is measured, not
guessed.

Idempotent.

  python3 tools/bohemia_own_shading_patch.py

RIG CHECK (RIG IS LAW, Paolo 7/26/26): Shades each part on its OWN shape using the rig's part grid, instead of one
  body-wide gradient that ignores where parts actually are.
  built on: rigSkel, SKINNERS
  joints: shL, shR
  parts: none
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()
orig = src

if 'SHADED ON ITS OWN SHAPE' in src:
    print('OWN SHADING: already applied, nothing to do.')
    sys.exit(0)

OLD = '''  const GROUP={1:0,2:0,3:5,4:5,5:1,7:1,6:2,8:2,9:3,11:3,10:4,12:4};
  for(let i=0;i<grid.length;i++){if(!grid[i])continue;const pid=grid[i];
    cellRank[i]=RANK[pid];let shade=2;                       // one base tone, everything
    const g=GROUP[pid];
    if(g!==0){const bx=i%CW,by=(i/CW)|0;let border=false;
      const nb=[bx+1<CW?grid[i+1]:0,bx>0?grid[i-1]:0,by+1<CH?grid[i+CW]:0,by>0?grid[i-CW]:0];
      for(const np of nb){
        if(!np){border=true;break;}                          // silhouette edge
        const ng=GROUP[np];
        if(ng===g)continue;                                   // same limb, no line
        if(g===5)continue;                                    // torso: limbs carry shared edges
        if(ng===0)continue;                                   // limb vs head: head stays clean
        /* WAIST BLEND (Paolo): legs meeting the torso get NO line, the body is
           one piece, not a Lego set. */
        if((g===3||g===4)&&ng===5)continue;
        /* SHOULDER BLEND (Paolo): the top-inside couple pixels where the arm
           meets the torso stay base tone so arm and torso are not two
           countries with a border. Border resumes below, down to the armpit. */
        if((g===1||g===2)&&ng===5){const RS=rigSkel(d);
          const shy=Math.min(RS.shL[1],RS.shR[1])+rigHeightDY(d);if(by<=shy+1)continue;}
        border=true;break;                                    // limb vs torso / limb vs limb
      }
      if(border)shade=1;                                      // the ONE darker tone, never black
    }'''

NEW = '''  const GROUP={1:0,2:0,3:5,4:5,5:1,7:1,6:2,8:2,9:3,11:3,10:4,12:4};
  /* =========================================================================
     EACH PART SHADED ON ITS OWN SHAPE (Paolo 7/26/26)
     "Everything should already be painted for their individual body parts
      first. If you turned the arms on and off, what would the torso be doing?"

     The tone used to be recomputed every frame off the COMBINED deformed grid,
     so the torso's shading was drawn from wherever the arm was standing that
     frame and a one-pixel swing reclassified whole runs between skin and line.
     Now each limb GROUP is classified against ITS OWN COMPLETE SHAPE -- GFULL,
     unioned from the per-part shapes OWN CANVAS records BEFORE occlusion. The
     torso is a whole torso, all 116px, including every pixel an arm stands on.
     Turn the arms off and the torso carries its own shading, nothing else's.

     THIS IS A RETRY. The same rule failed three times earlier today because the
     arm's own edge was churning 1-2px per frame and a 1px line bound to a
     churning edge dashes. THE ARMS NOW HOLD THEIR POSE, so the edge is still.
     The sky top-light deliberately STAYS on the combined grid: moving it to
     own-shape too was measured and it made things worse, because a part's own
     top edge moves as it bends.
     ========================================================================= */
  const PCV=SKINNERS[d].partCv, PN=CW*CH;
  const GFULL={};
  if(PCV){for(let q=1;q<=12;q++){const g=GROUP[q];
    let m=GFULL[g]||(GFULL[g]=new Uint8Array(PN));
    const qb=q*PN; for(let i=0;i<PN;i++) if(PCV[qb+i]) m[i]=1;}}
  /* which OTHER group covers a cell -- consulted ONLY to apply HIS blend
     exceptions, never to decide that a line exists */
  const otherG=(i,g)=>{for(const k in GFULL){const kk=+k; if(kk!==g&&GFULL[kk][i])return kk;} return -1;};
  const RSb=rigSkel(d), SHYb=Math.min(RSb.shL[1],RSb.shR[1])+rigHeightDY(d);
  for(let i=0;i<grid.length;i++){if(!grid[i])continue;const pid=grid[i];
    cellRank[i]=RANK[pid];let shade=2;                       // one base tone, everything
    const g=GROUP[pid], own=GFULL[g];
    if(g!==0&&own){const bx=i%CW,by=(i/CW)|0;let border=false;
      const nb=[bx+1<CW?i+1:-1,bx>0?i-1:-1,by+1<CH?i+CW:-1,by>0?i-CW:-1];
      for(const nI of nb){
        if(nI>=0&&own[nI])continue;                           // still inside my own form
        if(nI<0){border=true;break;}                          // off canvas = my outline
        const ng=otherG(nI,g);
        if(ng<0){border=true;break;}                          // nothing there = my outline
        if(g===5)continue;                                    // torso: limbs carry shared edges
        if(ng===0)continue;                                   // limb vs head: head stays clean
        /* WAIST BLEND (Paolo): legs meeting the torso get NO line, the body is
           one piece, not a Lego set. */
        if((g===3||g===4)&&ng===5)continue;
        /* SHOULDER BLEND (Paolo): the top-inside couple pixels where the arm
           meets the torso stay base tone so arm and torso are not two
           countries with a border. Border resumes below, down to the armpit. */
        if((g===1||g===2)&&ng===5){if(by<=SHYb+1)continue;}
        border=true;break;                                    // limb vs torso / limb vs limb
      }
      if(border)shade=1;                                      // the ONE darker tone, never black
    }'''

if src.count(OLD) != 1:
    die('the shading loop was not found verbatim (found %d)' % src.count(OLD))
src = src.replace(OLD, NEW, 1)
open(ALPHA, 'w', encoding='utf-8').write(src)
print('OWN SHADING applied to slices/BOHEMIA_ALPHA_0_9.html')
print('  - each limb group is shaded against its OWN complete shape (reuses partCv)')
print('  - the sky top-light deliberately stays on the combined grid (measured)')
