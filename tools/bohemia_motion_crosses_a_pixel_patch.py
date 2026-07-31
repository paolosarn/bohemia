#!/usr/bin/env python3
"""
BOHEMIA - A MOTION THAT NEVER CROSSES A PIXEL IS NOT A MOTION (7/30/26)

Paolo 7/30: "we gotta COOK ... 11 months of motion not bitching and complaining."

MEASURED FIRST, on the real surface, at the engine's own FRAME_CACHE.buckets=24:
102 clips rendered, and the distinct-rendered-frame count per clip came back
    pray      1 of 24     <- FROZEN. it "animates" at 0.2 px.
    winded    1 of 24     <- FROZEN. being winded is heaving; it moved 0.6 px.
    plus 15 clips at 2-3 of 24
Every one of these has a LARGE static pose and a TINY oscillating term. The pose
is the clip's character; the oscillation is its life. At 0.2-0.8 px on a 56 px
sprite the oscillation never moves a single pixel, so the pose-hold reducer
collapses the whole clip to one or two key frames and the character stands there
like a statue.

WHAT THIS TOOL CHANGES, and deliberately what it does not: only the OSCILLATING
COEFFICIENT of clips whose own name promises visible movement. The static pose is
untouched, so a praying figure still kneels, a cowering figure still cowers, and
nothing about the silhouette or the layering moves.

NOT TOUCHED ON PURPOSE -- stillness is CORRECT for these and raising them would
be a bug, not a fix:
    pistol, two-hand, overwatch   aiming: a steady weapon is the whole point
    brace                         bracing: holding still is the action
    duck, slump                   a fast dip and a settle, both legitimately short

RIG CHECK (RIG IS LAW, Paolo 7/26/26): this tool adds NO joints, NO anatomy and
no new layering. It scales existing oscillation terms that already ride the one
rig's own joints through POSE[clip] -> RT.applyPose -> RIG[d]. Every value it
touches is an amplitude on a joint Paolo already painted and posed.
  built on: RIG, POSE, RT.applyPose
  joints: head, spine (via spF), hipOff, upL, upR, foreL, foreR
  parts: none (no part grid is read or written)

REUSE CHECK (REUSE-FIRST, Paolo 7/22): this tool cooks ZERO new graphic pixels
and opens NO banks. It authors no art, no sprite, no ramp and no colour -- it
edits numeric amplitudes in existing clip functions. There is nothing to shop
for: the motion library already holds 102 clips and the measured defect is that
some of them move too little to see, not that any are missing.

  python3 tools/bohemia_motion_crosses_a_pixel_patch.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# (clip, exact old fragment, new fragment, why)
# Each edit raises ONLY an oscillation coefficient. Static terms are preserved
# verbatim so the pose keeps its character.
EDITS = [
 ('pray',
  "ikR:[mx+0.6,my+br*0.2],bendR:'auto',ikL:[mx-0.6,my+br*0.2]",
  "ikR:[mx+0.6,my+br*1.1],bendR:'auto',ikL:[mx-0.6,my+br*1.1]",
  'the clasped hands breathe; 0.2px could never move a pixel'),

 ('winded',
  "hipOff:[0,2.5+0.6*hv]",
  "hipOff:[0,2.5+2.2*hv]",
  'being winded is HEAVING -- the chest has to visibly pump'),
 ('winded',
  "spine:spF(d)*(0.36+0.04*hv)",
  "spine:spF(d)*(0.36+0.17*hv)",
  'the fold at the waist rides the same heave'),

 ('cower',
  "hipOff:[-(spF(d)||0)*1.5+tr*0.3,3.2]",
  "hipOff:[-(spF(d)||0)*1.5+tr*1.0,3.2]",
  'a tremble you cannot see is not a tremble'),

 ('scratch-back',
  "foreR:ov*(-1.5+0.12*sc)",
  "foreR:ov*(-1.5+0.62*sc)",
  'the forearm is the thing actually scratching'),
 ('scratch-back',
  "hipOff:[sc*0.3,0.3]",
  "hipOff:[sc*0.8,0.3]",
  'the body rocks slightly against the scratch'),

 ('headbang',
  "head:spF(d)*0.28*dn-spF(d)*0.06",
  "head:spF(d)*0.52*dn-spF(d)*0.06",
  'headbanging rendered as 2 frames of 24 is indefensible'),
 ('headbang',
  "hipOff:[0,-0.8*Math.abs(sl)]",
  "hipOff:[0,-2.0*Math.abs(sl)]",
  'the whole body drives the bang, not just the neck'),

 ('nod',
  "return {head:0.03*s,hipOff:[0,0.6*Math.max(0,s)]",
  "return {head:0.15*s,hipOff:[0,1.7*Math.max(0,s)]",
  'head-on nod was 0.03 rad -- a nod that never nods'),

 ('cheer',
  "upL:rL*(2.5+0.15*b),upR:rR*(2.56+0.12*b)",
  "upL:rL*(2.5+0.62*b),upR:rR*(2.56+0.58*b)",
  'cheering arms have to actually pump'),
 ('cheer',
  "hipOff:[0,-1.5*b]",
  "hipOff:[0,-2.7*b]",
  'the bounce under the cheer'),

 ('cough',
  "spine:spF(d)*(0.12+0.18*b)",
  "spine:spF(d)*(0.12+0.40*b)",
  'a cough is a convulsion of the torso'),
 ('cough',
  "hipOff:[0,0.8*b]",
  "hipOff:[0,1.9*b]",
  'the whole body jerks with it'),

 ('taunt',
  "spine:-spF(d)*(0.14+0.05*b),head:-spF(d)*(0.12+0.04*b)",
  "spine:-spF(d)*(0.14+0.17*b),head:-spF(d)*(0.12+0.15*b)",
  'a taunt that does not move does not taunt'),
]


def main():
    src = open(ALPHA, encoding='utf-8').read()
    applied, already, missing = [], [], []
    for clip, old, new, why in EDITS:
        if new in src:
            already.append((clip, why))
            continue
        n = src.count(old)
        if n == 0:
            missing.append((clip, old[:60]))
            continue
        if n > 1:
            missing.append((clip, 'AMBIGUOUS x%d: %s' % (n, old[:50])))
            continue
        src = src.replace(old, new)
        applied.append((clip, why))

    if missing:
        print('REFUSING TO WRITE -- %d edits did not resolve exactly once:' % len(missing))
        for c, o in missing:
            print('   %-14s %s' % (c, o))
        return 1

    open(ALPHA, 'w', encoding='utf-8').write(src)
    print('MOTION AMPLITUDE RAISED on %d terms (%d already applied)'
          % (len(applied), len(already)))
    seen = []
    for c, why in applied:
        if c not in seen:
            seen.append(c)
    for c in seen:
        print('  %-14s %s' % (c, [w for cc, w in applied if cc == c][0]))
    return 0


if __name__ == '__main__':
    sys.exit(main())
