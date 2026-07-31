#!/usr/bin/env python3
"""
BOHEMIA — EVERY PART IS ALREADY PAINTED, BY ITSELF (Paolo 7/26/26, LOCKED)

His words: "imagine when you're making the animations, like if you turned the
arms on and off, what would the torso be doing already? That's why I made the
whole rig bro, so everything should already be painted for their individual body
parts first. That goes for clothing, that goes for the skin."
Then, asked whether he wanted to paint the tones himself: "fix the renderer at
all costs."

WHAT WAS WRONG. buildFrame threw part identity away and recomputed EVERY skin
pixel's tone on EVERY frame from the COMBINED deformed grid: a dark anatomy line
wherever an orthogonal neighbour was empty or belonged to a different limb group,
a light sky top-light wherever the two cells above were empty. So the torso's
shading was drawn from wherever the arm happened to be standing that frame. In
profile the arm sits inside an 8px torso, so a one-pixel swing reclassified whole
runs between skin tone and line tone and back: 88% of all E/W strobe was that one
pair of tones flipping.

WHAT THIS DOES. Each limb group is shaded against ITS OWN COMPLETE DEFORMED
SHAPE, and nothing else's:

  1. skin() already computes, for every part, every screen cell that part's
     pixels land on -- then throws away the ones a nearer part claimed. Those
     discarded cells ARE the torso under the arm. It now keeps them, in
     `fullOut`, at essentially zero extra cost (the sample was already computed;
     one array write happens before the claim test instead of after it).
  2. buildFrame unions those per-part shapes into limb groups and runs HIS EXACT
     anatomy rules -- line, waist blend, shoulder blend, sky top-light -- against
     each group's own shape. The torso is classified as a whole 116-pixel torso,
     including every pixel the arm is standing on.
  3. The visible cell then just takes its own part's tone.

TWO EARLIER ATTEMPTS ARE RECORDED HERE BECAUSE THEY WERE WRONG AND THE REASON
MATTERS. (a) Classifying once at rest off a single combined grid: the torso
pixels under the arm never appear in a combined rest grid at all, so when the arm
swung away they came back wearing the ARM's tone -- the exact complaint, rebuilt.
Strobe went UP, 6,266 -> 7,524. (b) Classifying per part at rest and carrying the
tone through the inverse sample by source pixel: correct ownership, but a 1px
outline cannot survive a resample -- the line breaks into dashes that shimmer.
Also up, 6,735. The line has to be derived from the DEFORMED shape to stay a
continuous 1px line; the fix is that it must be derived from that part's OWN
deformed shape, never from everything on screen at once.

His approved look is preserved deliberately: the shoulder blend and waist blend
still run, they just consult the other group's shape instead of whatever won the
pixel.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO new pixels. It
reuses his existing anatomy rules verbatim and his existing skin ramp; the only
change is WHAT they are allowed to look at.

Idempotent.

  python3 tools/bohemia_parts_are_painted_patch.py

RIG CHECK (RIG IS LAW, Paolo 7/26/26): Enforces that every part is already painted by Paolo and is drawn as painted.
  Reads the rig's part grid; invents no pixels for any part.
  built on: rigSkel, SKINNERS
  joints: neck, shL, shR
  parts: 3=neck
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(m):
    print('  ! ' + m); sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()
orig = src
did = []

# ---------------------------------------------------------------------------
# 1. skin() keeps each part's FULL deformed shape, not just the cells it won.
#    The occluded cells are the torso under the arm -- the thing the shading
#    rules have to be able to see in order to stop guessing.
# ---------------------------------------------------------------------------
OLD_OUT = ("    const out = new Uint8Array(CW*CH);     // 0 = empty; else part id\n"
           "    const claim = new Uint8Array(CW*CH);   // screen ownership")
NEW_OUT = ("    const out = new Uint8Array(CW*CH);     // 0 = empty; else part id\n"
           "    /* PARTS ARE PAINTED (Paolo 7/26): every part's FULL deformed shape, kept\n"
           "       even where a nearer part covers it. Occlusion decides what is SEEN; it\n"
           "       must never decide what a part IS. The torso under the arm lives here. */\n"
           "    const fullOut = this.fullOut || (this.fullOut = new Uint8Array(13*CW*CH));\n"
           "    fullOut.fill(0);\n"
           "    const claim = new Uint8Array(CW*CH);   // screen ownership")
if 'this.fullOut' not in src:
    if src.count(OLD_OUT) != 1:
        die('skin() out/claim anchor found %d times (need exactly 1)' % src.count(OLD_OUT))
    src = src.replace(OLD_OUT, NEW_OUT, 1)
    did.append("skin() now keeps every part's full deformed shape (fullOut)")

OLD_CLAIM = ("          const sc=oy*CW+ox;\n"
             "          if (claim[sc] || mask[sc]) continue;            // screen cell already owned")
NEW_CLAIM = ("          const sc=oy*CW+ox;\n"
             "          fullOut[p*CW*CH+sc]=1;   /* PARTS ARE PAINTED: recorded BEFORE occlusion */\n"
             "          if (claim[sc] || mask[sc]) continue;            // screen cell already owned")
if 'recorded BEFORE occlusion' not in src:
    if src.count(OLD_CLAIM) != 1:
        die('skin() claim-test anchor found %d times (need exactly 1)' % src.count(OLD_CLAIM))
    src = src.replace(OLD_CLAIM, NEW_CLAIM, 1)
    did.append('the shape is recorded before the occlusion test, not after')

# ---------------------------------------------------------------------------
# 2. render: each group shaded against its OWN shape. His rules, unchanged.
# ---------------------------------------------------------------------------
OLD_LOOP = '''  const GROUP={1:0,2:0,3:5,4:5,5:1,7:1,6:2,8:2,9:3,11:3,10:4,12:4};
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
    }
    /* NECK SHADOW LAW (Paolo 7/2/26): the neck skin is very subtly darker
       than the body skin, the head's shadow living on it. 10% darker, applied
       to the neck's base tone everywhere, every clip, every direction. Border
       pixels keep the anatomy tone. */
    if(shade===2){ const by2=(i/CW)|0, up1=by2>0?grid[i-CW]:0, up2=by2>1?grid[i-2*CW]:0; if(!up1||!up2) shade=3; }   /* SKY TOP-LIGHT (Paolo 7/18 revamp, amends ANATOMY v2 2->3 tones): forms facing up catch the sky, using the light skin tone the flat shading never used. Borders (shade 1) untouched. */
    if(pid===3&&shade===2){const b=sramp[2];px[i]=[Math.round(b[0]*0.9),Math.round(b[1]*0.9),Math.round(b[2]*0.9)];}
    else px[i]=sramp[shade];}'''

NEW_LOOP = '''  const GROUP={1:0,2:0,3:5,4:5,5:1,7:1,6:2,8:2,9:3,11:3,10:4,12:4};
  /* =========================================================================
     PARTS ARE PAINTED, BY THEMSELVES (Paolo 7/26/26, LOCKED)
     "If you turned the arms on and off, what would the torso be doing already?
      That's why I made the whole rig bro, so everything should already be
      painted for their individual body parts first."

     Every limb group is shaded against ITS OWN COMPLETE SHAPE and nothing
     else's. GFULL is that shape per group, unioned from the per-part masks
     skin() kept BEFORE occlusion -- so the torso here is a whole torso, all of
     it, including every pixel the arm is standing on. A limb swinging past can
     no longer reclassify a single torso pixel, because the torso's rules never
     look at the arm at all.

     His anatomy rules are unchanged and still his: the line, the waist blend,
     the shoulder blend, the sky top-light. The only difference is what they are
     allowed to read.
     ========================================================================= */
  const FULL=SKINNERS[d].fullOut, GN=CW*CH;
  const GFULL={};
  if(FULL){for(let p=1;p<=12;p++){const g=GROUP[p];
    let m=GFULL[g]||(GFULL[g]=new Uint8Array(GN));
    const b=p*GN; for(let i=0;i<GN;i++) if(FULL[b+i]) m[i]=1;}}
  /* which OTHER group covers a cell -- consulted ONLY to apply his blend
     exceptions, never to decide that a line exists */
  const otherG=(i,g)=>{for(const q in GFULL){const k=+q; if(k!==g&&GFULL[k][i])return k;} return -1;};
  const RSk=rigSkel(d), SHY=Math.min(RSk.shL[1],RSk.shR[1])+rigHeightDY(d);
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
        if((g===1||g===2)&&ng===5){if(by<=SHY+1)continue;}
        border=true;break;                                    // limb vs torso / limb vs limb
      }
      if(border)shade=1;                                      // the ONE darker tone, never black
    }
    /* SKY TOP-LIGHT (Paolo 7/18 revamp, amends ANATOMY v2 2->3 tones): forms
       facing up catch the sky. Read on MY OWN form, so the torso does not lose
       its top light just because an arm passed over it. Borders untouched. */
    if(shade===2&&own){const by2=(i/CW)|0;
      const u1=by2>0?own[i-CW]:0, u2=by2>1?own[i-2*CW]:0; if(!u1||!u2) shade=3; }
    /* NECK SHADOW LAW (Paolo 7/2/26): the neck skin is very subtly darker
       than the body skin, the head's shadow living on it. 10% darker, applied
       to the neck's base tone everywhere, every clip, every direction. Border
       pixels keep the anatomy tone. A property of the NECK, not of its
       neighbours. */
    if(pid===3&&shade===2){const b=sramp[2];px[i]=[Math.round(b[0]*0.9),Math.round(b[1]*0.9),Math.round(b[2]*0.9)];}
    else px[i]=sramp[shade];}'''

if 'PARTS ARE PAINTED, BY THEMSELVES' not in src:
    if src.count(OLD_LOOP) != 1:
        die('the per-frame shading loop was not found verbatim (found %d)' % src.count(OLD_LOOP))
    src = src.replace(OLD_LOOP, NEW_LOOP, 1)
    did.append("each group is now shaded against its OWN complete shape")

if src == orig:
    print('PARTS ARE PAINTED: already applied, nothing to do.')
    sys.exit(0)
open(ALPHA, 'w', encoding='utf-8').write(src)
print('PARTS ARE PAINTED applied to slices/BOHEMIA_ALPHA_0_9.html')
for d in did:
    print('  - ' + d)
