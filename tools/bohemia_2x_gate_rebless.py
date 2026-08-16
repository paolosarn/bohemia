#!/usr/bin/env python3
"""BOHEMIA 2X -- RE-BLESSING THE RULERS, NOT RELAXING THEM (8/16/26, CHARACTER lane)

The flip turned three gates red. NONE of them found a defect in the character. All
three are rulers that were told the rig is 56 pixels wide, and it is now 112.

*** A GATE MUST NEVER OUTRANK A RULING, AND A BROKEN RULER IS NEVER FIXED BY MOVING
    THE TARGET. *** (8/1 law.) So every change here keeps the rule EXACTLY as
    written and corrects only the coordinate it reads it at. Nothing is loosened,
    no threshold is nudged to make a red go green, and the proof is that each gate
    is re-run at 56 FIRST and must return the identical verdict it returned before
    this file existed.

WHAT WAS ACTUALLY WRONG, and it is the same line in two of them:

    const at = (x, y) => { const i = ((y * 2) * PL + (x * 2)) * 4; ... }
                                        ^^^^^          ^^^^^
Both gates walk HIS RIG's painted cells and look up what the renderer drew there.
The rig was 56 and the render is 112, so they doubled. Now the rig is 112 too --
and doubling a 112-space coordinate reads at 224, off the end of the canvas, so
every lookup came back null. That is why CHIN LAW C reported "0/0 rows" and rule A
reported 0: not a chin that vanished, a ruler that was measuring past the edge of
the picture. The scale factor is now derived from the rig itself (PL / BAKED.W), so
it is 2 at 56 and 1 at 112 and can never be wrong again.

The chin gate had a second one: the mouth row comes from a 24-grid PD layer via
G24_OY, which lands in 56-space, and was then compared against rig rows in 112-
space. It is converted with RIG_RS, exactly like the renderer's own chin clamp is.

And rig_is_law counted bodies with /BAKED\\s*=\\s*\\{/ -- which no longer matches
because the one body is now wrapped in the load-time doubler, RIG2X({...}). There is
still EXACTLY ONE body and the rule is unchanged; the pattern just has to know the
wrapper exists. It still counts, so a second body is still caught.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): touches no art whatsoever -- it edits GATES.
  It appears here because it writes the word BAKED into rulers that must read the
  rig's real size instead of a hard-coded 56. No rig file, no joint and no painted
  pixel is read or written by this tool.
  built on: BAKED
  joints: none named
  parts: none named

    python3 tools/bohemia_2x_gate_rebless.py
"""
import sys

EDITS = [
    # ------------------------------------------------------------------ chin law
    ('gates/chin_law_gate.js',
     'the chin gate samples the render at the rig\'s own scale',
     """      const at = (x, y) => { const i = ((y * 2) * PL + (x * 2)) * 4; return D[i + 3] < 40 ? null : [D[i], D[i + 1], D[i + 2]]; };""",
     """      /* RIG SPACE -> RENDER SPACE, derived rather than assumed. This was a hard
         `* 2` because the rig was 56 and the render 112. At a 112 rig that doubling
         reads at 224 -- off the canvas -- and every lookup returns null, which is
         precisely how this gate reported "0/0 rows" for a head whose jaw was fine.
         PL / BAKED.W is 2 at 56 and 1 at 112, and cannot go stale again. */
      const SC = PL / W;
      const at = (x, y) => { const i = ((y * SC) * PL + (x * SC)) * 4; return D[i + 3] < 40 ? null : [D[i], D[i + 1], D[i + 2]]; };"""),

    ('gates/chin_law_gate.js',
     'the chin gate reads the mouth row in rig space',
     """      let mouthY = -1;
      if (FL) for (const i in FL.px) if (FL.px[i] === 2) {
        const y = ((+i / (FL.w || 24)) | 0) + G24_OY; if (y > mouthY) mouthY = y;
      }""",
     """      /* the mouth comes off a 24-grid PD layer, so G24_OY puts it in 56-space and
         RIG_RS puts it in rig space -- the same conversion the renderer's own chin
         clamp does. Left unconverted it was a 56-space row compared against
         112-space rig rows, and every comparison after it was meaningless. */
      const _rs = (typeof RIG_RS !== 'undefined') ? RIG_RS : 1;
      let mouthY = -1;
      if (FL) for (const i in FL.px) if (FL.px[i] === 2) {
        const y = (((+i / (FL.w || 24)) | 0) + G24_OY) * _rs; if (y > mouthY) mouthY = y;
      }"""),

    # ------------------------------------------------------- head follows the rig
    ('gates/head_follows_rig_gate.js',
     'the head gate samples the render at the rig\'s own scale',
     """    const at = (x, y) => { const i = ((y * 2) * PL + (x * 2)) * 4; return D[i + 3] < 40 ? null : [D[i], D[i + 1], D[i + 2]]; };""",
     """    /* see chin_law_gate: rig space -> render space is DERIVED, never assumed. A
       hard `* 2` reads at 224 on a 112 rig and returns null for every pixel, which
       reads as "the head has no edge" when the head is fine. */
    const _SC = PL / (BAKED.W || 56);
    const at = (x, y) => { const i = ((y * _SC) * PL + (x * _SC)) * 4; return D[i + 3] < 40 ? null : [D[i], D[i + 1], D[i + 2]]; };"""),

    ('gates/head_follows_rig_gate.js',
     'the head gate scans the WHOLE character, not the left half of it',
     """      let a = 99, b = -1;
      for (let x = 0; x < 56; x++) if (isSkin(at(x, ys))) { if (x < a) a = x; if (x > b) b = x; }""",
     """      /* *** SCAN THE WHOLE CHARACTER. *** This loop stopped at x<56, which was the
         width of the rig when it was written. At a 112 rig the head sits around
         x=40..75, so the ruler walked off its own measurement halfway across his
         face and reported the skin as HALF as wide as the rig paints it -- 20 vs
         10, every row, which reads exactly like a catastrophic regression and is
         nothing but a tape measure that stops at 56. */
      let a = 99, b = -1;
      for (let x = 0; x < BAKED.W; x++) if (isSkin(at(x, ys))) { if (x < a) a = x; if (x > b) b = x; }"""),

    ('gates/head_follows_rig_gate.js',
     'the edge check scans the whole character too',
     """      const xs = [];
      for (let x = 0; x < 56; x++) if (isSkin(at(x, ys))) xs.push(x);""",
     """      const xs = [];
      for (let x = 0; x < BAKED.W; x++) if (isSkin(at(x, ys))) xs.push(x);   /* whole character, see above */"""),

    # ---- the edge rules compare a pixel with its NEIGHBOUR. at 112 the neighbour
    # ---- is RIG_RS cells away, not one -- see the long note in the chin gate edit.
    ('gates/chin_law_gate.js',
     'the chin edge rule compares real neighbours, not two halves of one pixel',
     """          for (const [e, inn] of [[skinXs[0], skinXs[1]], [skinXs[skinXs.length - 1], skinXs[skinXs.length - 2]]]) {""",
     """          /* *** STEP BY A RIG PIXEL, NOT BY A CELL. *** His art is block-doubled, so
             at 112 two adjacent cells are the two halves of ONE painted pixel and are
             necessarily the same colour. Asking "is the edge darker than the cell
             beside it" then compares a pixel with itself and is false by
             construction -- which is why this reported exactly 20/40: every real
             comparison passed and every within-block comparison could not. The edge
             was perfect the whole time. Neighbour = _st cells away. */
          const _st = (typeof RIG_RS !== 'undefined') ? RIG_RS : 1;
          const _lo = skinXs[0], _hi = skinXs[skinXs.length - 1];
          for (const [e, inn] of [[_lo, _lo + _st], [_hi, _hi - _st]]) {"""),

    ('gates/head_follows_rig_gate.js',
     'the head edge rule compares real neighbours too',
     """      const a = xs[0], b = xs[xs.length - 1];
      for (const [e, inn] of [[a, a + 1], [b, b - 1]]) {""",
     """      /* neighbour = one RIG pixel away; at 112 that is RIG_RS cells. Comparing
         adjacent CELLS compares two halves of the same painted pixel -- see the
         long note in chin_law_gate. */
      const _st = (typeof RIG_RS !== 'undefined') ? RIG_RS : 1;
      const a = xs[0], b = xs[xs.length - 1];
      for (const [e, inn] of [[a, a + _st], [b, b - _st]]) {"""),

    ('gates/chin_law_gate.js',
     'the chin gate reports the resolution it measured at',
     """    const out = { facings: [], mul: mul };""",
     """    const out = { facings: [], mul: mul, rs: (typeof RIG_RS !== 'undefined') ? RIG_RS : 1 };"""),

    ('gates/chin_law_gate.js',
     'the throat cap is his ONE ROW OF A 56 FACE, at any resolution',
     """    ok('CHIN LAW B — ' + f.d + ': the THROAT takes at most ONE row of his face (' + f.throatRows +
       ') — at two it paints the jaw AND the chin the neck\\'s own tone and they read as one slab',
       f.throatRows <= 1);""",
     """    /* HIS RULING IS A DEPTH, NOT A ROW COUNT. "the throat keeps a row" was said
       about a 56-tall face; at 112 that same band of throat IS two rig rows, and it
       is the exact conversion the renderer's own _tRows makes. Capping at a literal
       1 here would halve the throat tone he approved on 7/27 and 8/11 -- a gate
       quietly overruling a ruling, which is the thing that is never allowed. */
    const _rsB = (typeof R.rs !== 'undefined') ? R.rs : 1;
    ok('CHIN LAW B — ' + f.d + ': the THROAT takes at most ONE ROW OF HIS 56 FACE (' + f.throatRows +
       ' rig rows at RIG_RS ' + _rsB + ') — at two it paints the jaw AND the chin the ' +
       'neck\\'s own tone and they read as one slab',
       f.throatRows <= _rsB);"""),

    # ---------------------------------------------------------------- rig is law
    ('gates/rig_is_law_gate.js',
     'the one-body count knows about the load-time doubler',
     """const topLevel = (src.match(/\\bBAKED\\s*=\\s*\\{/g) || []).length;""",
     """/* THE RULE IS UNCHANGED: exactly one body, because the whole failure this gate
   exists for was a second copy nobody knew about. The one body is now wrapped in
   the load-time doubler -- BAKED = RIG2X({...}) -- so the pattern has to allow the
   wrapper. It still COUNTS, so a second body is still caught; what it no longer
   does is miss the only one. */
const topLevel = (src.match(/\\bBAKED\\s*=\\s*(?:RIG2X\\()?\\{/g) || []).length;"""),
]


def main():
    applied, missed = [], []
    files = {}
    for path, label, old, new in EDITS:
        src = files.get(path)
        if src is None:
            src = files[path] = open(path, encoding='utf8').read()
        if new in src:
            applied.append('(already) %s [%s]' % (label, path)); continue
        n = src.count(old)
        if n != 1:
            missed.append('%s [%s] -- expected exactly 1 match, found %d' % (label, path, n)); continue
        files[path] = src.replace(old, new, 1)
        applied.append('%s [%s]' % (label, path))

    for l in applied: print('  ok   ' + l)
    for l in missed:  print('  MISS ' + l)
    if missed:
        print('GATE REBLESS: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        return 1
    for path, src in files.items():
        open(path, 'w', encoding='utf8').write(src)
    print('GATE REBLESS: rewrote %d gate(s). Re-run them at 56 FIRST -- same verdict, '
          'same numbers, or the fix is not a fix.' % len(files))
    return 0


if __name__ == '__main__':
    sys.exit(main())
