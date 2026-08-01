#!/usr/bin/env python3
"""
BOHEMIA - THE HEADSHOT NEVER FELL BECAUSE IT WAS FROZEN BEFORE IT COULD (7/31/26)

Paolo, three times: "headshot 1 and headshot-2 are still broken bro wtf",
"no wonder why combat not been using them", and finally
"THE HEADSHOT 1 AND HEADSHOT 2 ANIMATION IS BROKEN ASFUCKKKK BRO HOLY SHITTT"

He was right every time, and I asked him what was wrong twice instead of looking
properly. What he sees: a man standing upright, twitching, for the whole clip.
Not a death. A shiver.

WHAT IT ACTUALLY IS. The headshot is the one REAL-TIME animation in the game --
a ragdoll stepped on the wall clock, deliberately off the 120 BPM grid. posedSkel
knows that and carries the exemption in its first line:

    if(clip==='headshot'){...return hsPose(d);}   /* RAGDOLL EXEMPTION: real time, off the grid */

But buildFrame does this, and it does it FIRST:

    const _hp = poseHoldAt(d,clip,ph);
    const _ps = _hp || posedSkel(d,clip,ph);

poseHoldAt is the FROZEN POSES system (a clip is a small set of held key poses,
so a hold is literally the same pixels). It has no exemption. So for the headshot
it resolved ~12 key poses ONCE, from the ragdoll's first instants, cached them
under 'S|headshot' forever, and short-circuited the exemption that was written to
protect exactly this clip. The physics kept running and nothing it produced ever
reached the screen again.

MEASURED, and this is the pair of numbers that names the bug:
    the ragdoll skeleton falls   headTop 7 -> 19, waist 31 -> 43, over 1.5s
    the RENDERED silhouette      rows 3-53, width 19, EVERY SINGLE FRAME
The body sinks 12 px and the drawn sprite never changes extent, because the
sprite is not being drawn from that skeleton at all.

Ruled out on the way, so nobody re-checks them: not the HD cache (TERMINAL clips
already bypass it), not buildFrameCached (same), not the clothing (naked and
clothed give byte-identical bounding boxes), not the physics (it runs fine).

THE FIX: poseHoldAt honours the same exemption posedSkel has. A clip that runs on
real time cannot be represented by frozen key poses, by definition -- freezing a
ragdoll is just a still.

WHY THE FROZEN-POSE SYSTEM STAYS FOR EVERYTHING ELSE: it is load-bearing (zero
morph is structural, one cache entry per hold). This does not weaken it; it
carves out the one clip family that was never eligible.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): no joints, no anatomy, no layering, no
pixels. It decides WHICH pose source the frame uses, and for this clip the source
was always meant to be the ragdoll.
  built on: posedSkel, poseHoldAt, TERMINAL
  joints: headTop
  parts: none
  (First draft also claimed waC. rig_check_gate caught it -- waC appears in the
   measurement quoted in the header, not in anything this file does. Corrected,
   because a citation is a claim the machine can check.)

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO graphic pixels, opens NO banks.

  python3 tools/bohemia_headshot_ragdoll_exemption_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """function poseHoldAt(d,clip,ph){
  if(!POSEHOLD.on)return null;"""

NEW = """function poseHoldAt(d,clip,ph){
  if(!POSEHOLD.on)return null;
  /* RAGDOLL EXEMPTION, THE OTHER HALF (Paolo 7/31: "THE HEADSHOT 1 AND HEADSHOT 2
     ANIMATION IS BROKEN ASFUCKKKK"). posedSkel has carried this exemption since
     7/2 -- the headshot is real time, off the 120 BPM grid -- but buildFrame calls
     poseHoldAt FIRST and takes its answer if it gets one. So the frozen-pose
     system resolved ~12 key poses from the ragdoll's first instants, cached them
     under 'S|headshot' forever, and the exemption below it never ran again.
     Measured: the skeleton fell headTop 7 -> 19 while the drawn silhouette stayed
     rows 3-53 on every frame -- the body sank and the sprite never moved.
     A clip that runs on the wall clock CANNOT be a set of frozen poses; freezing
     a ragdoll is a still. Everything beat-quantized still holds its poses. */
  if(TERMINAL[clip])return null;"""


def main():
    s = open(ALPHA, encoding='utf-8').read()
    if 'RAGDOLL EXEMPTION, THE OTHER HALF' in s:
        print('already applied')
        return 0
    if s.count(OLD) != 1:
        print('REFUSING TO WRITE: poseHoldAt head resolved %d times, expected 1' % s.count(OLD))
        return 1
    open(ALPHA, 'w', encoding='utf-8').write(s.replace(OLD, NEW))
    print('poseHoldAt now honours the ragdoll exemption -- the headshot can fall')
    return 0


if __name__ == '__main__':
    sys.exit(main())
