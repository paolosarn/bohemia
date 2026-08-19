#!/usr/bin/env python3
"""BOHEMIA THE DRUNK WALK TELEPORTED SIDEWAYS ONCE A BAR (8/18/26, CHARACTER lane)

FOUND BY MEASURING, AND ONLY AFTER THE FIRST MEASUREMENT WAS THROWN OUT.

Building the field surgery clips turned up a real defect in two of my own three: a
cyclic clip whose last pose does not match its first SNAPS once per bar, forever. The
gate swept every other clip as information and reported THIRTY-ONE with an open loop,
which I wrote into the handoff as a repo-wide finding for the next lane.

THAT NUMBER WAS WRONG AND IT WAS MY NUMBER. It measured hand travel in rig-space,
which says nothing about whether anybody watching would see it: a 3px hand offset at
the seam is invisible in a clip whose normal motion is 2,000 pixels a frame.
tools/bohemia_loop_seam_audit.js measures the thing that decides it instead -- the
pixels that change at the wrap, against the biggest change the clip makes anywhere
else -- and the answer is:

    102 of 103 cyclic clips FLOW.  ONE snaps.

So the sweep I was about to do would have been 31 fixes to 30 clips that were fine.
The audit's own first cut was wrong too, in a way worth keeping: it used the MEDIAN
step as the denominator, and POSEHOLD holds each pose for a whole key, so every second
sample is EXACTLY ZERO and the median of the series is 0. `run` scored 2617. A summary
statistic has to fit the shape of the signal.

THE ONE THAT IS REAL IS `drunk`, and it is one character:

    const w = Math.sin(ph*Math.PI + 1.3);          <- HALF a period over the bar
              ^^^^^^^^^^^^^^^^^^^

Every sibling term in that pose uses ph*2*Math.PI and closes correctly. `w` alone
runs at half the frequency, so it starts at sin(1.3) = +0.96 and ends at
sin(pi+1.3) = -0.96: IT FLIPS SIGN ACROSS THE WRAP. w drives `hipOff:[w*1.8, ...]`,
so the hips teleport 3.5px sideways every two seconds, and on the head-on facings it
drives the spine lean as well. Measured seam ratio 1.72 -- the wrap is nearly twice
the biggest move the clip makes anywhere else.

THE FIX KEEPS WHAT MAKES IT READ DRUNK. The sway must stay OUT OF PHASE with the
gait -- that offset is the whole staggering effect -- so the 1.3 radian offset is
untouched and only the frequency is corrected to a full period. The sway still leads
and lags the steps; it just stops teleporting.

NOT A REDESIGN, AND DELIBERATELY NOT ONE. This changes no amplitude, no offset, no
joint and no timing. It makes an existing clip do what it already reads as doing
between the seams, which is a correctness fix on a clip he has already seen.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): touches no painted pixel and no region. It
  edits one arithmetic term in one POSE entry -- the sanctioned way every clip in the
  game is authored.
  built on: POSE
  joints: none named
  parts: none named

REUSE CHECK: cooks ZERO graphic pixels. It is a one-token arithmetic correction.

    python3 tools/bohemia_drunk_seam_fix.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """ drunk:(d,ph)=>{const s=Math.sin(ph*2*Math.PI),w=Math.sin(ph*Math.PI+1.3),"""

NEW = """ /* THE SWAY USED TO RUN AT HALF THE FREQUENCY OF EVERYTHING ELSE AND FLIP SIGN AT
    THE WRAP (fixed 8/18). `w` was sin(ph*PI+1.3) while every sibling term here is
    ph*2*PI: it started at +0.96 and ended at -0.96, and since w drives hipOff the
    hips TELEPORTED 3.5px sideways once a bar, forever. Measured seam ratio 1.72 --
    nearly twice the biggest move this clip makes anywhere else, and the only clip
    in the game that snapped (tools/bohemia_loop_seam_audit.js, 102 of 103 flow).
    The 1.3 radian offset is KEPT, deliberately: the sway being out of phase with
    the steps is the whole staggering read. Only the frequency is corrected. */
 drunk:(d,ph)=>{const s=Math.sin(ph*2*Math.PI),w=Math.sin(ph*2*Math.PI+1.3),"""


def main():
    alpha = open(ALPHA, encoding='utf8').read()
    if NEW in alpha:
        print('  ok   (already) the drunk sway closes its loop')
        return 0
    n = alpha.count(OLD)
    if n != 1:
        print('  MISS the drunk sway -- expected exactly 1 match, found %d' % n)
        print('DRUNK SEAM FIX: refused to write')
        return 1
    open(ALPHA, 'w', encoding='utf8').write(alpha.replace(OLD, NEW, 1))
    print('  ok   the drunk sway is a full period now, so the bar does not snap')
    print('DRUNK SEAM FIX: applied to %s' % ALPHA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
