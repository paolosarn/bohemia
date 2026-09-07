#!/usr/bin/env python3
"""THE CAR IS SQUASHED FLAT -- COOK, VAMILY [car recook], the last art clause. 9/7/26.

PAOLO 9/7: "this is ass, is that the car model, c'mon bro." The row reads his complaint back
as "a smeared photograph SQUASHED FLAT". The photograph half shipped at 9/7b and 9/7c. This
is the squash, and it is a number, not an impression:

    the car master           45 x 96 px      aspect 1 : 2.13
    the stall it is drawn in  2 x 3 cells    aspect 1 : 1.50
    ->  EVERY CAR IN THE CITY IS DRAWN AT 70% OF ITS OWN LENGTH

WHERE THE 2x3 COMES FROM, AND WHY IT IS NOT A BUG TO FIX THERE. engine/bohemia_suburb.js
paints code 16 as a SOLID RECTANGLE of 2x3 or 3x2, cell by cell, and only over bare yard or
gravel -- so the patch is honest ground, correctly checked, and the car is not sitting on a
wall. (That was worth checking: the row also says "on the GROUND not on a wall", and the
placement turns out to be right. What the screenshot shows is the car's rectangle meeting a
wall band beside it, which is draw order and LIFE + CITY's.) The city then asks for a 4x2 or
2x4 stall and CLAMPS it to the patch, which is also right -- a car may not overhang its drive.

So the stall is 3 cells long and the master is 2.13 wide, and the draw call stretches one to
the other. THE DISTORTION IS IN THE PRESENTATION, WHICH IS A COOK'S, AND NOWHERE ELSE.

THE FIX IS THE ONE ANY GALLERY USES: fit the master inside its stall at its OWN aspect and
centre it. A car then reads as a car at every stall size, and nothing about the ground, the
footprint, the clamp or the walkable land moves. It cannot overhang, because fitting only
ever makes the drawn rectangle SMALLER than the stall it was already confined to.

    python3 tools/bohemia_car_not_squashed_9_7_26.py
"""
import io, sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__A_CAR_IS_NOT_SQUASHED__'

OLD = """          const _mx=bx+px2*C+(C*pw)/2, _my=by+py2*C+(C*ph)/2;
          g.save(); g.translate(_mx,_my); g.rotate(Math.PI/2);
          g.drawImage(im, -(C*ph)/2, -(C*pw)/2, C*ph, C*pw);
          g.restore();
        } else {
          g.drawImage(im, bx+px2*C-C*(_fp[0]-1)/2*(pw?0:1), by+(py2-_fp[2])*C, C*_fp[0], C*_fp[1]);
        }"""

NEW = """          const _mx=bx+px2*C+(C*pw)/2, _my=by+py2*C+(C*ph)/2;
          g.save(); g.translate(_mx,_my); g.rotate(Math.PI/2);
          /* """ + MARK + """ -- FIT, DO NOT STRETCH: a 45x96 master in a 2x3 stall was
             drawn at 70% of its own length. The why is in the tool. AND IT SITS AFTER THE
             ROTATE ON PURPOSE: props_gate asserts the rotate follows its branch inside 400
             characters, and that is a real claim, so the comment moves rather than the gate. */
          const _fitR=fitProp(im, C*ph, C*pw);
          g.drawImage(im, -_fitR[0]/2, -_fitR[1]/2, _fitR[0], _fitR[1]);
          g.restore();
        } else {
          const _fw=C*_fp[0], _fh=C*_fp[1], _fit=fitProp(im, _fw, _fh);
          g.drawImage(im, bx+px2*C-C*(_fp[0]-1)/2*(pw?0:1)+(_fw-_fit[0])/2,
                      by+(py2-_fp[2])*C+(_fh-_fit[1])/2, _fit[0], _fit[1]);
        }"""

HELPER = """/* """ + MARK + """ -- the largest rectangle of the master's OWN shape that fits a
   stall. One helper, both branches, so the rotated car and the upright one cannot drift. */
function fitProp(im, w, h){
  var iw=im.naturalWidth||im.width||1, ih=im.naturalHeight||im.height||1;
  var s=Math.min(w/iw, h/ih);
  return [iw*s, ih*s];
}
"""

ANCHOR = "    if(ch.posts&&ch.posts.length)for(const [px2,py2,pfam,pvar,pw,ph] of ch.posts){"


def main():
    src = io.open(CITY, encoding='utf-8').read()
    if MARK in src:
        print('  already done (mark present)')
        return 0
    if src.count(OLD) != 1:
        print('  the prop draw is not where I left it (%d matches) -- REFUSING' % src.count(OLD))
        return 1
    if src.count(ANCHOR) != 1:
        print('  no single post loop to hang the helper on -- REFUSING')
        return 1
    if 'function fitProp(' in src:
        print('  fitProp already exists -- REFUSING to write a second one')
        return 1
    src = src.replace(ANCHOR, HELPER + ANCHOR, 1)
    src = src.replace(OLD, NEW, 1)
    for needle, why in ((MARK, 'the mark'),
                        ('function fitProp(', 'the helper'),
                        ('fitProp(im, C*ph, C*pw)', 'the rotated branch uses it'),
                        ('fitProp(im, _fw, _fh)', 'the upright branch uses it')):
        if needle not in src:
            print('  verify failed, missing ' + why)
            return 1
    if src.count('function fitProp(') != 1:
        print('  verify failed: fitProp is not exactly once')
        return 1
    io.open(CITY, 'w', encoding='utf-8').write(src)
    print('  %s: patched (a car is fitted to its stall, never stretched into it)' % CITY)
    return 0


if __name__ == '__main__':
    sys.exit(main())
