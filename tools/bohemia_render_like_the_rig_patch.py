#!/usr/bin/env python3
"""
BOHEMIA — RENDER LIKE THE RIG (Paolo 7/26/26)

His words: "The east and west animations are still dog shit when it comes to
morph pixels underneath the arms and the back leg in the back arm. All the
pieces are made how they should be made... look at the rig."

So I looked at the rig. The alpha's skinner is commented as "the engine-side
twin of BOHEMIAN_RIG.html's draw loop". It is not. Decoded RIG_B64 and diffed
its draw loop against the alpha's Skinner.skin():

    pass                      his rig      the alpha
    inverse sample (seg)      yes          yes  (identical maths)
    segd / cohereBind         yes          yes
    refineMask / refineSkin   yes          yes
    JOINT WELD                NO           yes  (retired earlier today)
    EVERY PIXEL LANDS         NO           yes  <- this patch
    FAR-ARM DARKENING         NO           yes  <- this patch

Three passes the alpha invented on top of the rig, and the two survivors land
exactly where he says it breaks:

  EVERY PIXEL LANDS forward-splats any painted pixel the inverse sample missed
  into "the nearest FREE cell". In profile the arms and the two legs sit INSIDE
  one another's footprint, so "the nearest free cell" is wherever the overlap
  happens to leave a gap THAT frame. Pixels squirt out from under the arm, and
  land somewhere else the next frame. That is "morph pixels underneath the
  arms", and on the overlapping legs it is "the back leg".

  FAR-ARM DARKENING repaints the far arm at 62% brightness, and DEPTH sets
  farArm on E and W ONLY -- the exact two facings he named. Worse, the mask is
  read off the DEFORMED body grid per pixel per frame (grid[i]), including for
  garment cells, so which pixels are "far arm" changes as the limb swings and a
  dark patch crawls around the back arm. That is "the back arm".

THE RIG IS LAW (laws/BOHEMIA_ADDENDUM_RIG_IS_LAW_7_26_26.md). Both go, behind
one flag so the audit can A/B them on the real surface.

On FAR_DARK specifically: it was written in as "locked canon, wired 7/2/26".
His rig has never done it, and he is pointing at the back arm on E/W today --
newest date wins (TRUTH HIERARCHY), and a depth READ he wants back belongs in
the separate render-time shading layer his 7/26 SHADOWS ARE SEPARATE ruling
describes, not multiplied into the sprite's own pixels mid-composite. Flagged
to him as a DID-NOT-DECIDE, not silently deleted forever.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO pixels. It
removes two passes that relocate and repaint pixels his rig never touched.

Idempotent.

  python3 tools/bohemia_render_like_the_rig_patch.py

RIG CHECK (RIG IS LAW, Paolo 7/26/26): Makes the game render the way the rig tool does, so the surface Paolo poses in
  and the surface he plays in agree. It aligns the render path TO the rig.
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
orig = src
did = []

# ---------------------------------------------------------------------------
# 0. the flag. Sits beside RIGID so both retirements are one switch and the
#    fabrication audit can flip it to A/B on the real surface.
# ---------------------------------------------------------------------------
FLAG_ANCHOR = 'const RIGID = { on: true };'
FLAG_NEW = (FLAG_ANCHOR + '\n'
            '/* RENDER LIKE THE RIG (Paolo 7/26/26, "look at the rig"). ON retires every\n'
            '   render pass the alpha added that BOHEMIAN_RIG.html does not have: EVERY\n'
            '   PIXEL LANDS (forward-splat into the nearest free cell) and FAR-ARM\n'
            '   DARKENING. Both invent or repaint pixels per frame, and both do it worst\n'
            '   in profile, where limbs overlap inside one footprint -- the E/W morphing\n'
            '   he named. The rig is the body law; the renderer now obeys it too. */\n'
            'const RIGFAITH = { on: true };')
if 'RIGFAITH' not in src:
    if FLAG_ANCHOR not in src:
        die('RIGID flag anchor not found')
    src = src.replace(FLAG_ANCHOR, FLAG_NEW, 1)
    did.append('RIGFAITH flag installed beside RIGID')

# the flag lives inside the skinner closure, so it has to be EXPORTED the same
# way RIGID is -- the composite path (far-arm) runs outside that closure and
# reads SKINNER_API.RIGID.on, not a bare identifier.
EXP_OLD = 'return { Skinner, REFINE_STATS, RIGID,'
EXP_NEW = 'return { Skinner, REFINE_STATS, RIGID, RIGFAITH,'
if EXP_NEW not in src:
    if src.count(EXP_OLD) != 1:
        die('SKINNER_API export anchor found %d times (need exactly 1)' % src.count(EXP_OLD))
    src = src.replace(EXP_OLD, EXP_NEW, 1)
    did.append('RIGFAITH exported on SKINNER_API (same as RIGID)')

# ---------------------------------------------------------------------------
# 1. EVERY PIXEL LANDS -- his rig has no such pass
# ---------------------------------------------------------------------------
OLD = '        for (const ri of this.pixList[p]) {'
NEW = ('        /* RETIRED under RIGFAITH (Paolo 7/26, "look at the rig"): his rig has\n'
       '           no forward-splat. This one took every painted pixel the inverse\n'
       '           sample missed and shoved it into the nearest FREE screen cell -- so\n'
       '           in profile, where the arms sit inside the torso footprint and the\n'
       '           legs inside each other, the destination was whatever gap the overlap\n'
       '           happened to leave that frame, and moved the next frame. Pixels\n'
       '           crawling out from under the arm and off the back leg: exactly what\n'
       '           he named, on exactly the facings he named. */\n'
       '        if (!RIGFAITH.on) for (const ri of this.pixList[p]) {')
if 'no forward-splat' not in src:
    if src.count(OLD) != 1:
        die('EVERY PIXEL LANDS anchor found %d times (need exactly 1)' % src.count(OLD))
    src = src.replace(OLD, NEW, 1)
    did.append('EVERY PIXEL LANDS retired (his rig has none)')

# ---------------------------------------------------------------------------
# 2. FAR-ARM DARKENING -- his rig has no such pass, and it is E/W only
# ---------------------------------------------------------------------------
OLD_FAR = '  const farArmParts=(DEPTH[d]&&DEPTH[d].farArm)?'
NEW_FAR = ('  /* RETIRED under RIGFAITH (Paolo 7/26, "the back leg in the back arm").\n'
           '     His rig does not darken the far arm at all, and DEPTH turns this on for\n'
           '     E and W ONLY -- the two facings he called out. The mask is read off the\n'
           '     DEFORMED grid per pixel per frame (and applied to garment cells by the\n'
           '     body part underneath them), so a 1px swing flips whole columns between\n'
           '     62% and 100% brightness and a dark patch crawls around the back arm.\n'
           '     If the depth read comes back it belongs in the separate render-time\n'
           '     shading layer (SHADOWS ARE SEPARATE, 7/26), not multiplied into the\n'
           '     sprite pixels mid-composite. [DID-NOT-DECIDE: flagged to Paolo.] */\n'
           '  const farArmParts=(!SKINNER_API.RIGFAITH.on&&DEPTH[d]&&DEPTH[d].farArm)?')
if 'RETIRED under RIGFAITH (Paolo 7/26, "the back leg' not in src:
    if src.count(OLD_FAR) != 1:
        die('far-arm anchor found %d times (need exactly 1)' % src.count(OLD_FAR))
    src = src.replace(OLD_FAR, NEW_FAR, 1)
    did.append('far-arm darkening retired (his rig has none; E/W only, which is what he named)')

if src == orig:
    print('RENDER LIKE THE RIG: already applied, nothing to do.')
    sys.exit(0)
open(ALPHA, 'w', encoding='utf-8').write(src)
print('RENDER LIKE THE RIG applied to slices/BOHEMIA_ALPHA_0_9.html')
for d in did:
    print('  - ' + d)
