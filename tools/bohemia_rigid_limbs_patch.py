#!/usr/bin/env python3
"""
BOHEMIA — THE JOINT WELD DIES: half the invented pixels, gone
(Paolo 7/26/26 — laws/BOHEMIA_ADDENDUM_ANIMATION_REJECTED_7_26_26.md)

His words: "the biggest problem is where the torso is and the arm was sitting,
and then the arm moves and then it's just like morphing and glitching and
PROVIDING EXTRA PIXELS and it's looking like dog shit."

MEASURED FIRST (records/BOHEMIA_ANIM_FABRICATION_AUDIT_7_26_26.txt): across the
whole clip set, 72.8% of frames contain pixels that were never painted -- 34,636
of them. 84% of those are the two ARMS. The only parts that never invent a pixel
are the HEAD and FACE: the two protected by the HEAD RIGID STAMP LAW.

WHAT THIS PATCH KILLS: the JOINT WELD pass. It stamped limb pixels a SECOND time
under the parent bone's frame near the shoulder and elbow -- duplicate pixels,
sprayed at exactly the torso/arm junction Paolo named. Removing it halves the
fabrication (32,222 -> 16,325 across 6,528 frames) and, on the render, cleans up
the blobby shoulder lumps without costing a single pixel of silhouette.

It also retires the MINIMUM HAND SLIVER stamp, which drew a 2x4 block of hand
pixels the pose never put there -- the "hand feature" he says clips wrong.

WHAT THIS PATCH DELIBERATELY DOES *NOT* DO -- two dead ends, both measured and
both rejected on the render (kept here so nobody re-pitches them):
  - ONE SOURCE, ONE PIXEL (veto a painted pixel landing twice in the backwards
    sample): invented hits exactly 0, and the legs come out SHREDDED -- notched
    outlines, dotted edges. Worse than what it fixes.
  - PIXEL CONSERVATION (forward-splat every painted pixel to its own cell,
    nearest free cell on collision): also exactly 0 invented, and the silhouette
    goes lumpy and speckled. Worse again.
  Both prove the same thing: you cannot get zero invention AND a coherent
  silhouette out of continuous bone deformation of pixel art. Zero invention
  needs the limbs to stop being resampled at all -- a quantised angle atlas or
  painted frames. That is the real rebuild, and it is not this patch.

SHIPS AS AN A/B: G.rigidLimbs defaults ON with a RIG chip in the character box,
so the change is judged against the old renderer on the real surface, animating,
one tap apart.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO new pixels. This
patch only REMOVES pixels that were never painted.

Idempotent.

  python3 tools/bohemia_rigid_limbs_patch.py

RIG CHECK (RIG IS LAW, Paolo 7/26/26): Kills the joint weld: a limb moves as one rigid piece from its own bone rather
  than being meshed between joints. Uses the rig chain as-is.
  built on: SKINNER_API
  joints: handL, handR
  parts: none
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(msg):
    print('  ! ' + msg)
    sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()
orig = src
did = []

# ---------------------------------------------------------------------------
# 1. the switch
# ---------------------------------------------------------------------------
RIGID_CORE = '''/* ===========================================================================
   LIMB RIGID STAMP, STEP ONE: NO INVENTED PIXELS AT THE JOINT
   laws/BOHEMIA_ADDENDUM_ANIMATION_REJECTED_7_26_26.md (Paolo 7/26/26, LOCKED)
   ---------------------------------------------------------------------------
   RIGID.on retires the two passes that draw pixels nobody painted:
     JOINT WELD        stamped limb pixels a SECOND time under the parent bone
                       near the shoulder/elbow -- duplicates, sprayed exactly at
                       the torso/arm junction Paolo named as the worst of it.
     MIN HAND SLIVER   stamped a 2x4 block of hand pixels when a head-on pose
                       buried a hand -- drawing a hand the pose does not contain.
   Measured on the real surface over 6,528 frames: 32,222 invented pixels with
   the weld, 16,325 without, and the silhouette does not lose a pixel.
   NOT a full fix. The remaining half is inherent to resampling pixel art
   through a continuous bone transform, and only stops when limbs stop being
   resampled -- see the addendum's order of work.
   =========================================================================== */
const RIGID = { on: true };
'''
if 'const RIGID = { on: true };' not in src:
    anchor = 'const REFINE_STATS={adds:0,drops:0};'
    if anchor not in src:
        die('REFINE_STATS anchor not found -- skinner layout changed')
    src = src.replace(anchor, RIGID_CORE + anchor, 1)
    did.append('RIGID switch added to the skinner')

# ---------------------------------------------------------------------------
# 2. the weld dies
# ---------------------------------------------------------------------------
OLD_WELD = "        /* JOINT WELD pass: true-pixel double-stamp near arm joints */\n        for (const bn of this.candFor(p)) {"
NEW_WELD = ("        /* JOINT WELD pass: true-pixel double-stamp near arm joints.\n"
            "           RETIRED under RIGID (Paolo 7/26): a 'true pixel' drawn TWICE is an\n"
            "           invented pixel wherever the second copy lands, and it landed on the\n"
            "           shoulder. Half of all fabrication in the clip set came from here. */\n"
            "        if (!RIGID.on) for (const bn of this.candFor(p)) {")
if 'RETIRED under RIGID (Paolo 7/26)' not in src:
    if OLD_WELD not in src:
        die('JOINT WELD anchor not found')
    src = src.replace(OLD_WELD, NEW_WELD, 1)
    did.append('JOINT WELD retired under RIGID')

OLD_EXP = "  return { Skinner, REFINE_STATS, derive,"
NEW_EXP = "  return { Skinner, REFINE_STATS, RIGID, derive,"
if 'REFINE_STATS, RIGID,' not in src:
    if OLD_EXP not in src:
        die('SKINNER_API export anchor not found')
    src = src.replace(OLD_EXP, NEW_EXP, 1)
    did.append('RIGID exported from SKINNER_API')

# ---------------------------------------------------------------------------
# 3. the hand sliver dies
# ---------------------------------------------------------------------------
OLD_SLIVER = "  if(headOn(d)&&!NS_CLAMP_EXEMPT[clip]){\n    for(const [pid,jn] of [[7,'handL'],[8,'handR']]){"
NEW_SLIVER = ("  /* THE HAND SLIVER IS RETIRED UNDER RIGID (Paolo 7/26: the hand feature\n"
              "     \"sometimes they're clipping wrong and it's all bad\"). It stamped a 2x4\n"
              "     block of hand pixels the pose never put there. If a pose buries a hand,\n"
              "     the hand is buried; the answer is a better pose or a painted frame,\n"
              "     never a rectangle drawn on top of the body. */\n"
              "  if(!SKINNER_API.RIGID.on && headOn(d)&&!NS_CLAMP_EXEMPT[clip]){\n"
              "    for(const [pid,jn] of [[7,'handL'],[8,'handR']]){")
if 'THE HAND SLIVER IS RETIRED UNDER RIGID' not in src:
    if OLD_SLIVER not in src:
        die('min hand sliver anchor not found')
    src = src.replace(OLD_SLIVER, NEW_SLIVER, 1)
    did.append('MINIMUM HAND SLIVER stamp retired under RIGID')

# ---------------------------------------------------------------------------
# 4. state, cache hash, and the A/B chip
# ---------------------------------------------------------------------------
if 'rigidLimbs:' not in src:
    OLD_G = "const G={dir:'S',clip:'idle',charClip:'idle',charT0:0,"
    if OLD_G not in src:
        die('G state anchor not found -- run bohemia_char_preview_patch.py first')
    src = src.replace(OLD_G, OLD_G + "rigidLimbs:true,", 1)
    did.append('G.rigidLimbs added')

if 'G.rigidLimbs,' not in src:
    OLD_H = "const parts=[G.equipped,G.tints,G.swing,G.bodyVar,"
    if OLD_H not in src:
        die('frameLookHash anchor not found')
    src = src.replace(OLD_H, "const parts=[G.equipped,G.tints,G.swing,G.bodyVar,G.rigidLimbs,", 1)
    did.append('frameLookHash sees the renderer switch')

if 'RIGID_AB_CHIP' not in src:
    OLD_CHIP = '        <button id="charShuf" class="opt"'
    if OLD_CHIP not in src:
        die('character box anchor not found -- run bohemia_char_preview_patch.py first')
    src = src.replace(OLD_CHIP,
        '        <button id="rigidChip" class="opt" style="position:absolute;right:7px;top:7px;'
        'line-height:1;padding:5px 9px;background:rgba(20,18,26,.72)">RIG: NEW</button>\n' + OLD_CHIP, 1)
    WIRE = '''/* RIGID_AB_CHIP (Paolo 7/26/26): one tap flips the whole character between the
   renderer with the invented pixels and the one without, so the change is
   judged side by side against the thing he called dog shit -- on the real
   surface, animating. The switch is in the frame-cache hash, so what he is
   looking at is always the renderer the chip names. */
function rigidToggle(){
  G.rigidLimbs=!G.rigidLimbs;
  SKINNER_API.RIGID.on=G.rigidLimbs;
  const b=document.getElementById('rigidChip');
  if(b)b.textContent='RIG: '+(G.rigidLimbs?'NEW':'OLD');
  if(typeof refresh==='function')refresh();
}
{const b=document.getElementById('rigidChip');if(b)b.onclick=rigidToggle;
 SKINNER_API.RIGID.on=G.rigidLimbs;}
/* CHAR_SHUFFLE_WIRE'''
    src = src.replace('/* CHAR_SHUFFLE_WIRE', WIRE, 1)
    did.append('RIG: NEW/OLD A/B chip added to the character box')

if src == orig:
    print('JOINT WELD PATCH: already applied, nothing to do.')
    sys.exit(0)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('JOINT WELD PATCH applied to slices/BOHEMIA_ALPHA_0_9.html')
for d in did:
    print('  - ' + d)
