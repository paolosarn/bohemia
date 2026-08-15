#!/usr/bin/env python3
"""V154 ONE MORE BEAT BEFORE THEY SHOOT.

Paolo 8/15: "whatever it's at right now, one extra turn it takes for Enemies to
shoot at you and I think this might be more survival potentially fun."

--------------------------------------------------------------------------
THE RULING, AND WHY IT IS THE RIGHT ONE
--------------------------------------------------------------------------
A man does not get to shoot you the instant he sees you. He has to hold a bead
first -- the acquisition the game already models -- and only then does his gun
enter the volley. That delay has been ONE turn since it was written.

He wants two, and he is right for a reason he did not have to spell out: every
other change this week made the board more dangerous. Cover decays. Guns have
reach. They flank, they close, they bound. Grenades come more than once. The
one thing that never moved was HOW LONG HE HAS to react to any of it.

An extra beat is the cheapest possible way to make all of that survivable
without undoing any of it. Nothing gets weaker. He just gets one more turn to
answer, which is exactly what "more survival potentially fun" means.

--------------------------------------------------------------------------
AND THE NUMBER STOPS BEING SCATTERED
--------------------------------------------------------------------------
The threshold was the literal `>= 1`, written out EIGHT TIMES across the volley,
the wait-exposed path, the reckless path, the suppression, the two line-break
counters and the red-line display. Eight copies of one rule.

That is the exact shape that has cost him all week -- a number living in many
places so that changing it means finding all of them, and a display that can
quietly disagree with the rule it is drawing. It is ONE DIAL now, ACQ_TURNS,
read through one predicate, so the warning he sees and the rule that shoots him
can never drift apart again.

*** THE RED LINE MOVES WITH IT. *** The bead he watches now appears on the same
turn the rule uses, so the thing on screen and the thing that kills him are the
same fact. If the display had kept the old number he would see a red line and
not get shot, which teaches him to ignore the display.

REUSE CHECK: cooks NO graphic pixels. It renames a threshold into a constant and
routes eight existing tests through one predicate. Nothing authored, no new
system, no bank opened.

TASTE CHECK: authors no art. The taste rule is his: "I'm trying to make this
fun." Everything this week added pressure; this is the first change that gives
time back, and it does it without weakening a single thing that was making the
fight good.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V154 ONE MORE BEAT BEFORE THEY SHOOT'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v154 already in; nothing to do')
        return

    # the constant + the one predicate every test now goes through
    anchor = "const PT_BLANK=4, FAR_TILE=26,"
    if anchor not in js:
        sys.exit('range constants not found')
    decl = """/* ===== V154 ONE MORE BEAT BEFORE THEY SHOOT ======================
   Paolo 8/15: "whatever it's at right now, one extra turn it takes for Enemies
   to shoot at you and I think this might be more survival potentially fun."
   A man does not get to shoot you the instant he sees you -- he holds a bead
   first, and only then does his gun enter the volley. That delay has been ONE
   turn since it was written.
   HE IS RIGHT AND THE REASON IS THE WHOLE WEEK: cover decays now, guns have
   reach, they flank and close and bound, grenades come more than once. Every
   change made the board more dangerous and the one thing that never moved was
   HOW LONG HE HAS TO REACT. An extra beat makes all of it survivable without
   weakening any of it -- nothing gets softer, he just gets one more turn to
   answer.
   AND THE NUMBER STOPS BEING SCATTERED. This threshold was the literal >= 1,
   written out EIGHT TIMES across the volley, the wait-exposed path, the
   reckless path, suppression, two line-break counters and the red-line display.
   Eight copies of one rule is the exact shape that has cost him all week: a
   number that must be found everywhere to be changed, and a DISPLAY THAT CAN
   QUIETLY DISAGREE WITH THE RULE IT IS DRAWING. One dial now, one predicate, so
   the bead he watches and the rule that shoots him can never drift apart. */
const ACQ_TURNS=2;   /* [DIAL] beats a man must hold a bead before his gun counts */
function acquired(e){ return !!e && (e.acq||0)>=ACQ_TURNS; }
"""
    js = js.replace(anchor, decl + anchor, 1)

    # route every threshold through it
    n1 = js.count('(e.acq||0)>=1')
    n2 = js.count('(e2.acq||0)>=1')
    if n1 + n2 < 6:
        sys.exit('expected the scattered >=1 threshold, found %d+%d' % (n1, n2))
    js = js.replace('(e.acq||0)>=1', 'acquired(e)')
    js = js.replace('(e2.acq||0)>=1', 'acquired(e2)')

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v154: one more beat (%d call sites unified) -- %d chars' % (n1 + n2, len(js)))


if __name__ == '__main__':
    main()
