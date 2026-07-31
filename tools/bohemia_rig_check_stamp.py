#!/usr/bin/env python3
"""
BOHEMIA - STAMP THE RIG CHECK ONTO EVERY TOOL THAT TOUCHES THE RIG (7/30/26)

laws/BOHEMIA_ADDENDUM_THE_RIG_IS_LAW_7_26_26.md item 2 has been law since 7/26
and had no machine gate, which by this repo's own FACTORY LAW means it was not
enforced. Measured 7/30: 22 tools touch the rig, ZERO documented what they built
on. The woman-rig v1-v4 arc (four versions of inventing new anatomy instead of
adjusting the one rig) is the post-mortem for exactly this.

WHAT A RIG CHECK IS, and why it is shaped like REUSE CHECK: a claim the machine
can check, never a name-drop. Each block carries
  - an AUTHORED sentence: what this tool does to the rig, in plain words
  - a DERIVED `built on:` line: the rig APIs, joints and part IDs the tool
    actually references, extracted from its own source by this script
The gate (gates/rig_check_gate.py) re-derives that line and fails if a block
names a joint, part or API the source does not really use. Because the line is
generated FROM the source, it cannot start out false; because the gate re-derives
it, it cannot drift false later.

Idempotent: a tool that already carries a RIG CHECK is left alone.

  python3 tools/bohemia_rig_check_stamp.py
"""
import glob
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

RIG = re.compile(r'\bBAKED\b|posedSkel|SKINNERS?\b|SKINNER_API|rigSkel|BODY_PKG|BOH_BODYVAR|bakedFor')
JOINTS = ['neck', 'shL', 'shR', 'elL', 'elR', 'waA', 'waB', 'waC', 'knA', 'knB',
          'headTop', 'handL', 'handR', 'footA', 'footB']
API = ['BAKED.pose', 'BAKED.layers', 'BAKED.skeleton', 'BAKED.layerOverride', 'BAKED',
       'posedSkel', 'rigSkel', 'SKINNERS', 'SKINNER_API', 'BODY_PKG', 'BOH_BODYVAR', 'bakedFor']
PARTNAME = {1: 'head', 2: 'face', 3: 'neck', 4: 'torso', 5: 'arm-L', 6: 'arm-R',
            7: 'hand-L', 8: 'hand-R', 9: 'thigh-A', 10: 'thigh-B', 11: 'foot-A', 12: 'foot-B'}

# The AUTHORED half: one honest sentence per tool about what it does to the rig.
# Written by reading each tool, not generated.
SAID = {
 'bohemia_anim_fabrication_audit.js':
   'Audits how much of an animated frame is NOT in the rest art, by re-running the\n'
   '  real render path (posedSkel -> SKINNERS) rather than re-implementing it. Reads\n'
   '  the rig; changes nothing in it.',
 'bohemia_apply_rig_chin_neck_7_28.py':
   "Applies Paolo's own 7/28 rig export verbatim, replacing the BAKED package with\n"
   '  the one he painted. It does not reshape anything: his chin and neck edits are\n'
   '  transcribed, never interpreted (RIG LAW: painted regions are sacrosanct).',
 'bohemia_arm_hold_patch.py':
   'Holds the arm joints at their keyed pose between beats instead of interpolating\n'
   "  every frame. Operates on the rig's existing arm chain; adds no joints.",
 'bohemia_bodyvar_capture.js':
   'Capture harness for the variation sliders: drives BOH_BODYVAR across dial values\n'
   '  and screenshots the real surface. Read-only with respect to the rig.',
 'bohemia_bodyvar_patch.py':
   'Wires the one-rig variation sliders. Every dial is a re-map of the ONE painted\n'
   '  body: BOH_BODYVAR.apply(BAKED, dials) returns BAKED itself at neutral, and the\n'
   '  warps move existing joints and existing painted pixels. No second rig, no new\n'
   '  anatomy -- that is the whole point of the 7/25 one-rig ruling.',
 'bohemia_character_outline_patch.py':
   'Draws the 1px border around the composited silhouette as the last pass in\n'
   '  buildFrame. It reads the finished frame, so it inherits whatever the rig\n'
   '  produced and never consults a body definition of its own.',
 'bohemia_clothes_follow_the_body_patch.py':
   'Fits a garment to the body the dials made, by measuring the flank of the\n'
   '  warped body and shifting cloth to match. Sources the body from BODY_PKG /\n'
   '  BOH_BODYVAR (the rig plus dials), never from a garment-side body guess.',
 'bohemia_combat_dial_cover_patch.py':
   'Combat cover/dial rendering draws the same BAKED body the character tab does,\n'
   '  so the fighter and the wardrobe figure are one rig.',
 'bohemia_dress_the_back_limb_patch.py':
   'Gives the FAR arm its own deform pass so the sleeve stops riding only the near\n'
   "  arm. Binds the garment pixels already on the far arm's own footprint to the\n"
   "  rig's own arm bones. Arms only (parts 5/6) -- not legs, not hands.",
 'bohemia_invented_color_audit.js':
   'Measures near-vs-far limb garment coverage through the real render path. Reads\n'
   '  the rig; changes nothing.',
 'bohemia_key_poses_patch.py':
   'Keys the extremes of a clip and holds between them. The extremes are poses of\n'
   "  the one rig's joints; no clip defines its own skeleton.",
 'bohemia_limb_separation_patch.py':
   'Draws the limb separation line ON TOP of the clothing, positioned from the\n'
   "  rig's own shoulder joints rather than a guessed seam.",
 'bohemia_neck_tone_patch.py':
   'Gives the neck its own skin TONE (not a shadow). Finds the throat from the\n'
   '  painted face skin each frame rather than hardcoding rows, so it follows the\n'
   '  rig wherever the head goes.',
 'bohemia_own_shading_patch.py':
   "Shades each part on its OWN shape using the rig's part grid, instead of one\n"
   '  body-wide gradient that ignores where parts actually are.',
 'bohemia_parts_are_painted_patch.py':
   'Enforces that every part is already painted by Paolo and is drawn as painted.\n'
   "  Reads the rig's part grid; invents no pixels for any part.",
 'bohemia_pose_hold_patch.py':
   'Makes a clip a small set of FROZEN poses, each frame of a hold resolving to the\n'
   '  same cache entry. The poses are the rig posed; the holds add no geometry.',
 'bohemia_profile_depth_audit.js':
   'Measures whether the far arm/hand read as further away on E and W. Reads the\n'
   '  rig through the real render path; changes nothing.',
 'bohemia_profile_morph_audit.js':
   'Measures per-frame morph in profile against the rest art. Read-only.',
 'bohemia_render_like_the_rig_patch.py':
   'Makes the game render the way the rig tool does, so the surface Paolo poses in\n'
   '  and the surface he plays in agree. It aligns the render path TO the rig.',
 'bohemia_rig_is_law_patch.py':
   'The patch that made BAKED.pose the render base for everything. This is the tool\n'
   '  that installed the law the rest of them obey.',
 'bohemia_rig_sync_audit.js':
   'Asks whether the game is actually drawing the BAKED rig, or a drifted copy of\n'
   '  it. Read-only; it exists to catch exactly the divergence this law forbids.',
 'bohemia_rigid_limbs_patch.py':
   'Kills the joint weld: a limb moves as one rigid piece from its own bone rather\n'
   '  than being meshed between joints. Uses the rig chain as-is.',
}


def evidence(src):
    ap = [a for a in API if a in src]
    # keep the most specific BAKED.* and drop bare BAKED if a dotted form matched
    if any(a.startswith('BAKED.') for a in ap) and 'BAKED' in ap:
        ap.remove('BAKED')
    js = [j for j in JOINTS if re.search(r'\b%s\b' % j, src)]
    ids = sorted({int(g) for g in
                  re.findall(r'(?:part|grid\[[^\]]*\]|P|pid)\s*===?\s*(\d{1,2})\b', src) +
                  re.findall(r'\[\s*(\d{1,2})\s*,\s*\d{1,2}\s*\]', src)
                  if 1 <= int(g) <= 12})
    return ap, js, ids


def block(name, src, comment):
    ap, js, ids = evidence(src)
    said = SAID.get(name)
    if not said:
        return None
    parts = ', '.join('%d=%s' % (i, PARTNAME[i]) for i in ids) if ids else 'none'
    lines = ['RIG CHECK (RIG IS LAW, Paolo 7/26/26): ' + said,
             '  built on: %s' % (', '.join(ap) if ap else 'the BAKED package'),
             '  joints: %s' % (', '.join(js) if js else 'none named'),
             '  parts: %s' % parts]
    pre = '  ' if comment else ''
    return '\n'.join(pre + l for l in lines)


stamped, skipped = [], []
for f in sorted(glob.glob('tools/*.py') + glob.glob('tools/*.js')):
    src = open(f, encoding='utf8', errors='replace').read()
    if not RIG.search(src):
        continue
    name = os.path.basename(f)
    if 'RIG CHECK' in src:
        skipped.append(name)
        continue
    b = block(name, src, f.endswith('.js'))
    if b is None:
        skipped.append(name + ' (no authored sentence -- add one to SAID)')
        continue
    if f.endswith('.py'):
        m = re.search(r'^"""', src, re.M)
        if not m:
            skipped.append(name + ' (no module docstring)')
            continue
        end = src.index('"""', m.end())
        src = src[:end] + '\n' + b + '\n' + src[end:]
    else:
        m = re.search(r'/\*', src)
        if not m:
            skipped.append(name + ' (no header comment)')
            continue
        end = src.index('*/', m.end())
        src = src[:end] + '\n' + b + '\n' + src[end:]
    open(f, 'w', encoding='utf8').write(src)
    stamped.append(name)

print('RIG CHECK stamped onto %d tools' % len(stamped))
for s in stamped:
    print('  + ' + s)
if skipped:
    print('skipped %d:' % len(skipped))
    for s in skipped:
        print('  - ' + s)
