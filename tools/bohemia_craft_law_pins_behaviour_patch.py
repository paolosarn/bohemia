#!/usr/bin/env python3
"""
THE CRAFT LAW GATE PINNED FOUR STRINGS AND THE CODE OUTGREW THEM (8/20/26, RUN
lane, P0-SUITE red sweep).

CRAFT LAW came up 35/4. All four failures are the SAME EVENT, and it is not a
regression -- it is the 4X hair pass. Hair used to be drawn one screen pixel per
hair; at 112 and 224 it draws a CELL of S=CW/56 pixels per hair, so every
expression that used to be written in pixels is now written in cells:

    _ph=prof?(y-hTop):(x-hMn)          ->  _ph=((prof?(y-hTop):(x-hMn))/S)|0
    _pq=prof?(x-hMn):(y-hTop)          ->  _pq=((prof?(x-hMn):(y-hTop))/S)|0
    hcx=Math.floor((hMn+hMx)/2)        ->  hcx=hMn+(((hMx-hMn+1)-S)>>1)
    mn=ceil(_d2/2)-strip               ->  mn=ceil(_d2/2)-strip*S

Every one of those is the SAME BEHAVIOUR at S===1 and the correct generalisation
above it. The phase is still anchored to the head and still rotates with the
view; the centre is still the left column of the centre cell; the strip still
takes its parity from the head. Nothing about clause 4 or clause 5 stopped being
true. The gate went red because it was reading the code as TEXT.

THIS IS THE THIRD TIME THIS EXACT GATE HAS DONE IT, and it says so itself, twice,
in its own comments:

    "The gate pinned the literal inline expressions, so refactoring them read as
     removing them. PIN THE BEHAVIOUR."
    "THIS PINNED THE BROKEN FIX."

and the law it enforces contains the rule it keeps breaking: A CHECKER THAT
CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE, and FIX THE RULER, NEVER THE
TARGET. A regex over source is a checker that can only see mentions.

SO THE FOUR CLAUSES NOW RUN THE CODE. The gate lifts each expression out of the
alpha with a capture, compiles it with `Function`, and evaluates it over a sweep
of head widths, scales and coordinates:

  clause 4 (anchor)   _ph(x=hMn) is 0 on a front view and _ph(y=hTop) is 0 in
                      profile; the phase is flat in the OTHER axis; and neither
                      expression mentions `mn`, the moving row start that was the
                      original bug.
  clause 4 (rotation) _pq is _ph with the axes swapped, checked by evaluation,
                      so a profile really does band the other way.
  clause 5 (centre)   at S===1 the centre equals floor((hMn+hMx)/2) EXACTLY --
                      the literal the old regex wanted -- for every width from 3
                      to 40; above S===1 the S-wide centre CELL sits within half
                      a pixel of the head's true centre, which is the most an
                      integer grid allows.
  clause 5 (parity)   mn+mx === s[0]+s[1] exactly, for every strip width and
                      every scale. That IS the parity law: the strip's centre is
                      the head's centre, whatever the widths' parities are.

THIS IS STRICTLY STRONGER THAN WHAT IT REPLACES. The old check passed on a file
that merely CONTAINED the right characters; the new one fails if the arithmetic
is wrong even when the text looks perfect -- and it would have caught the
off-by-one on the mohawk that started clause 5, which the first version of that
check did not (it pinned the broken fix and shipped).

NOT WEAKENED TO MAKE A NUMBER GREEN (the GOODHART GUARD): the claim count goes
UP, from 4 assertions to 4 assertions each sweeping tens of cases, and every one
of them is the same clause it was before.

WHAT THIS PATCH DOES NOT TOUCH: genHat centres with Math.round and lands a pixel
right of centre on an even-width skull, which is the same shape as the bug clause
5 exists for. Hats are CHARACTER's, the fix is not a one-liner (hcxL shifts with
it), and this lane does not silently reshape another lane's art. Written down
here so it is a known red-in-waiting and not a thing nobody saw.

Idempotent.
"""
import os
import sys

GATE = 'gates/craft_law_gate.js'

OLD = """ok('clause 4 in code: the phase is anchored to the HEAD, not the moving row start',
  /_ph=prof\\?\\(y-hTop\\):\\(x-hMn\\)/.test(src) && !/\\(x-mn\\)%3/.test(src));
ok('clause 4 in code: and the pattern ROTATES with the view (rows run the right way in profile)',
  /_pq=prof\\?\\(x-hMn\\):\\(y-hTop\\)/.test(src));
"""

NEW = r"""/* PIN THE BEHAVIOUR, NOT THE CHARACTERS (8/20, RUN lane). These four clauses
   used to be regexes over the source, and the 4X hair pass turned every hair
   distance from PIXELS into CELLS of S=CW/56 -- so `(x-hMn)` became
   `((x-hMn)/S)|0` and four true clauses reported false. Third time this gate has
   done that to itself; it says so twice in its own comments ("pin the
   behaviour", "THIS PINNED THE BROKEN FIX") and the law it enforces says A
   CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE. A regex over
   source can only ever see mentions. So the clauses now LIFT the expression out
   of the alpha, compile it, and run it. Stricter, not looser: the old check
   passed on a file that merely contained the right characters. */
const grab = (re, what) => { const m = src.match(re); if (!m) { f++; console.log('  > FAIL cannot find ' + what + ' in the alpha'); } return m; };
const fn = (expr, args) => Function(...args, 'return (' + expr + ');');

const mPh = grab(/var _ph=([^,]+), _pq=([^;]+);/, 'the hair texture phase');
if (mPh) {
  const A = ['prof', 'x', 'y', 'hTop', 'hMn', 'S'];
  const ph = fn(mPh[1], A), pq = fn(mPh[2], A);
  let anchored = true, flat = true, rotates = true;
  for (const S of [1, 2, 4]) for (const hMn of [0, 7, 22]) for (const hTop of [0, 5, 19]) {
    /* the phase must READ ZERO at the head's own edge -- that is what "anchored
       to the head" means, and the bug it replaced read zero at the row start,
       which moves every row. */
    if (ph(0, hMn, hTop + 9, hTop, hMn, S) !== 0) anchored = false;
    if (ph(1, hMn + 9, hTop, hTop, hMn, S) !== 0) anchored = false;
    for (let d = 0; d < 24; d++) {
      /* and it must not move at all along the OTHER axis, or the stripe bends */
      if (ph(0, hMn + 5, hTop + d, hTop, hMn, S) !== ph(0, hMn + 5, hTop, hTop, hMn, S)) flat = false;
      if (ph(1, hMn + d, hTop + 5, hTop, hMn, S) !== ph(1, hMn, hTop + 5, hTop, hMn, S)) flat = false;
      /* ROTATION: in profile the quadrature phase is the front-view phase and
         vice versa, so cornrows band the other way when you look along them */
      if (pq(1, hMn + d, hTop, hTop, hMn, S) !== ph(0, hMn + d, hTop, hTop, hMn, S)) rotates = false;
      if (pq(0, hMn, hTop + d, hTop, hMn, S) !== ph(1, hMn, hTop + d, hTop, hMn, S)) rotates = false;
    }
  }
  ok('clause 4 in code: the phase is anchored to the HEAD, not the moving row start',
    anchored && flat && !/\bmn\b/.test(mPh[1]) && !/\bmn\b/.test(mPh[2]));
  ok('clause 4 in code: and the pattern ROTATES with the view (rows run the right way in profile)',
    rotates);
}
"""

OLD5 = """ok('clause 5 in code: the head centre floors instead of rounding',
  /hcx=Math\\.floor\\(\\(hMn\\+hMx\\)\\/2\\)/.test(src));
"""

OLD5B = """ok('clause 5 in code: a strip takes its parity from the head, so the centre is exact',
  /var _d2=s\\[0\\]\\+s\\[1\\];/.test(src)
  && /mn=Math\\.ceil\\(_d2\\/2\\)-strip; mx=Math\\.floor\\(_d2\\/2\\)\\+strip;/.test(src));
"""

NEW5 = r"""const mCx = grab(/var hH=Math\.max\(1,hBot-hTop\), hcx=([^,]+), hcxR=/, "the hair's head centre");
if (mCx) {
  const hcx = fn(mCx[1], ['hMn', 'hMx', 'S']);
  let exact = true, cellCentred = true;
  for (let w = 3; w <= 40; w++) for (const hMn of [0, 6, 22]) {
    const hMx = hMn + w - 1;
    /* AT S===1 THIS IS THE LITERAL THE OLD REGEX WANTED, verified by arithmetic:
       floor, never round. Math.round breaks .5 upward and puts the mohawk one
       pixel right of centre, forever, which is the note that made this clause. */
    if (hcx(hMn, hMx, 1) !== Math.floor((hMn + hMx) / 2)) exact = false;
    for (const S of [2, 4]) {
      /* above S===1 the centre is a CELL, and the cell's own centre must sit on
         the head's centre within the half pixel an integer grid allows */
      if (Math.abs((hcx(hMn, hMx, S) + (S - 1) / 2) - (hMn + hMx) / 2) > S / 2) cellCentred = false;
    }
  }
  ok('clause 5 in code: the head centre floors instead of rounding', exact && cellCentred);
}

const mStrip = grab(/var _d2=s\[0\]\+s\[1\];\s*mn=([^;]+); mx=([^;]+);/, 'the strip edges');
if (mStrip) {
  const A = ['_d2', 'strip', 'S'];
  const lo = fn(mStrip[1], A), hi = fn(mStrip[2], A);
  let parity = true;
  for (let a = 0; a < 40; a++) for (let w = 1; w <= 24; w++) for (let strip = 1; strip <= 6; strip++) for (const S of [1, 2, 4]) {
    const b = a + w - 1, d2 = a + b;
    /* THE WHOLE CLAUSE IN ONE LINE: the strip's centre is the head's centre,
       exactly, whatever the two widths' parities are. An odd strip cannot centre
       on an even head, so the strip is the one that gives -- both edges come off
       the DOUBLED centre so mn+mx lands back on s[0]+s[1] every time. */
    if (lo(d2, strip, S) + hi(d2, strip, S) !== d2) parity = false;
  }
  ok('clause 5 in code: a strip takes its parity from the head, so the centre is exact', parity);
}
"""


def main():
    if not os.path.exists(GATE):
        sys.exit('FAIL: ' + GATE + ' not found')
    s = open(GATE, encoding='utf8').read()
    if 'PIN THE BEHAVIOUR, NOT THE CHARACTERS' in s:
        print('NOOP: craft_law_gate.js already runs the expressions')
        return
    n = 0
    # OLD5 is deleted and both clause-5 checks are rebuilt at OLD5B's address, so
    # the long "THIS PINNED THE BROKEN FIX" post-mortem stays attached to the
    # parity check it is actually about instead of being orphaned above nothing.
    for old, new in ((OLD, NEW), (OLD5, ''), (OLD5B, NEW5)):
        if old not in s:
            sys.exit('FAIL: cannot find the block to replace:\n' + old[:120])
        s = s.replace(old, new, 1)
        n += 1
    open(GATE, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- %d clause blocks now evaluate the code instead of matching it' % (GATE, n))


if __name__ == '__main__':
    main()
