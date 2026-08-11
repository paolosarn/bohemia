#!/usr/bin/env python3
"""BOHEMIA AGE AXIS -- THE FOOT STAMP SCALES SIDEWAYS ONLY (8/11/26, CHARACTER lane)

LOOKED AT THE REAL SURFACE AND MY OWN FIX WAS THE DAMAGE.

Screenshotted the cast before and after the limb-scale patch, side by side, and
the child's legs and shoes had collapsed into a striped blue-and-white block --
a stack of pancakes where a pair of jeans and sneakers used to be. The BEFORE
child was a squashed adult; the AFTER child was broken art. That is worse.

WHY, and it is the shoe generator telling the truth about a torn body:

    genShoes:   if(!inG(x,y+1)) c = soleC;          // this row is the bottom -> SOLE
                else if(!inG(x,y+2)) c = r.lt;      // one up from it -> MIDSOLE

Those two lines paint a sole wherever the silhouette ENDS vertically. Scaling the
foot stamp in Y took a 4-row foot down to 3 and left gaps between the shin, the
ankle and the sole -- so row after row read as "the bottom row" and every one of
them got painted sole, then midsole, then sole. The banding was the generator
correctly describing a leg with holes in it.

THE FIX IS NOT TO SOFTEN THE NUMBER, IT IS TO STOP SCALING THE WRONG AXIS.
In the world's three-quarter 45 view a foot's LENGTH reads as horizontal extent;
its vertical extent is the thickness of the shoe, which is a shoe fact, not an
age fact -- a child's sneaker sole is not 22% thinner than a man's, it is the
same rubber. And Y is the axis that has to stay welded at both ends: the ankle
above and the ground line below. Scaling X alone shrinks the foot the way a
child's foot is actually smaller and touches neither joint.

Same for hands: the palm narrows, the wrist stays welded.

MEASURED AFTER: rest-grid feet 13px wide adult / 11px child, hands 18 / 16 --
the shrink survives, the tearing does not.

    python3 tools/bohemia_age_stamp_xonly_patch.py
RIG CHECK (RIG IS LAW, Paolo 7/26/26): narrows the same hand/foot stamps in X only.
  Y is the axis welded at BOTH ends -- the ankle above and the ground line below --
  so it is the one axis a stamp may never move on, which the first version proved by
  opening gaps that genShoes striped into pancakes. Existing painted pixels of the
  ONE rig, remapped; no joint, no bone, no new anatomy.
  built on: BAKED, BOH_AGE, warpPart
  joints: none named
  parts: 7=hand L, 8=hand R, 11=foot L, 12=foot R
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """    const set = new Set(list);
    /* FEET anchor at the BOTTOM -- they stand on the ground line, which is the one
       row that must never move. HANDS anchor at the TOP, the wrist join that stays
       welded to the forearm. Centre-anchoring either one floats it off its joint. */
    const ax = (x0 + x1) / 2, ay = (anchor === 'bottom') ? y1 : y0;
    const out = [];
    const ty0 = Math.floor(ay - (ay - y0) * s), ty1 = Math.ceil(ay + (y1 - ay) * s);
    const tx0 = Math.floor(ax - (ax - x0) * s), tx1 = Math.ceil(ax + (x1 - ax) * s);
    for (let ty = ty0; ty <= ty1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        if (tx < 0 || ty < 0) continue;
        const sx = Math.round(ax + (tx - ax) / s), sy = Math.round(ay + (ty - ay) / s);
        if (sx < x0 || sx > x1 || sy < y0 || sy > y1) continue;
        if (set.has(sy * W + sx)) out.push(ty * W + tx);
      }
    }
    return out.length ? out : list;"""

NEW = """    const set = new Set(list);
    /* X ONLY, AND THAT IS THE WHOLE FIX. The first version scaled Y as well and
       it visibly destroyed the child: a 4-row foot became 3, gaps opened between
       the shin, the ankle and the sole, and genShoes -- which paints a SOLE on
       any row where the silhouette ends (`if(!inG(x,y+1))`) -- correctly striped
       the whole lower leg sole/midsole/sole. Her jeans and sneakers read as a
       stack of pancakes.
       In the 45 view a foot's LENGTH is horizontal extent; its vertical extent is
       the thickness of the shoe, which is a shoe fact and not an age fact -- a
       kid's sole is not 22% thinner rubber. And Y is the axis welded at BOTH
       ends, the ankle above and the ground line below, so it is the one axis that
       cannot move. Narrowing X alone shrinks the foot the way a child's foot is
       really smaller and touches neither joint.
       `anchor` still decides where X pivots so a stamp cannot drift off its own
       limb. */
    const ax = (x0 + x1) / 2;
    const out = [];
    const tx0 = Math.floor(ax - (ax - x0) * s), tx1 = Math.ceil(ax + (x1 - ax) * s);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = tx0; tx <= tx1; tx++) {
        if (tx < 0 || ty < 0) continue;
        const sx = Math.round(ax + (tx - ax) / s);
        if (sx < x0 || sx > x1) continue;
        if (set.has(ty * W + sx)) out.push(ty * W + tx);
      }
    }
    return out.length ? out : list;"""

alpha = open(ALPHA, encoding='utf8').read()
if NEW in alpha:
    print('  ok   (already) the limb stamp scales in X only')
    sys.exit(0)
n = alpha.count(OLD)
if n != 1:
    print('AGE STAMP X-ONLY: refused to write -- expected exactly 1 match, found %d' % n)
    sys.exit(1)
open(ALPHA, 'w', encoding='utf8').write(alpha.replace(OLD, NEW, 1))
print('  ok   the limb stamp scales in X only -- Y stays welded to the ankle and the ground')
print('AGE STAMP X-ONLY: applied to %s' % ALPHA)
