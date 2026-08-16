#!/usr/bin/env python3
"""BOHEMIA RE-BLESSING THE GATES THE BORDER MOVE STALED (8/16/26, CHARACTER lane)

Moving the border pass to display size (tools/bohemia_outline_at_display.py) turned
three gates red. NONE of them found a defect. All three assert on the SHAPE OF THE
SOURCE, and the source moved while the rule it encodes did not.

*** A GATE MUST NEVER OUTRANK A RULING, AND A STALE ANCHOR IS NOT A FINDING. ***
Every rule below is preserved word for word. Only the place it looks changed. And
none of these is being loosened on trust: gates/border_gate.js now asserts the same
law ON THE REAL SURFACE -- 1px against skin on all 8 facings, the body provably
unchanged, the border still closing, COMBAT agreeing -- which is strictly stronger
than any of these source patterns. The source patterns stay because they catch the
SCOPE and ORDER mistakes a pixel measurement cannot see.

  1. CHARACTER OUTLINE -- three anchors, all of them positional
       `function buildFrame(d,clip,ph){`  the signature grew a 4th parameter
                                          (_noOutline), so the anchor missed and
                                          took two assertions with it.
       `if(CHAR_OUTLINE.on){`             is now `if(CHAR_OUTLINE.on && !_noOutline)`
       the pass body                      lives in applyCharOutline() so it can be
                                          run at 56 or at 112. Same code, same
                                          snapshot, same void close, same 4-neighbour
                                          rule -- every assertion about its CONTENT
                                          still runs, against the function instead of
                                          against an inline block.
     The ORDER assertions are the point of that gate and they still bite: the call
     sits after the floater cull, after the separation line, immediately before the
     return.

  2. CLOTHES FOLLOW -- `const _CW = 56;`
     The lesson is "use a LOCAL, not the skinner closure's CW" (the third closure
     boundary to cost a round). It is still a local. It just derives its value from
     the rig now instead of hard-coding 56, so the pattern asks for the declaration
     rather than for the literal.

  3. FROZEN POSES -- the frame cache key
     The key gained a bordered/borderless segment, because the cache now holds both
     kinds of frame and serving one as the other would hand a borderless sprite to
     the city bake. The rule being guarded -- KEYS ON THE RESOLVED POSE SIGNATURE,
     NOT THE PHASE INDEX -- is untouched and still asserted.

    python3 tools/bohemia_border_gate_rebless.py
"""
import sys

EDITS = [
    # ---------------------------------------------------------- character outline
    ('gates/character_outline_gate.js',
     'the buildFrame anchor tolerates the signature it grew',
     "const iFn = src.indexOf('function buildFrame(d,clip,ph){');",
     """/* SIGNATURE-AGNOSTIC. buildFrame took a 4th parameter (_noOutline) when the
   border moved to display size; anchoring on the exact old signature missed and
   silently failed two assertions that were about SCOPE, not about arity. */
const iFn = src.indexOf('function buildFrame(d,clip,ph');"""),

    ('gates/character_outline_gate.js',
     'the pass is found where it now lives, with every content rule intact',
     """const m = src.match(/if\\(CHAR_OUTLINE\\.on\\)\\{[\\s\\S]*?\\n  \\}/);
ok('the outline pass is present in buildFrame', !!m);""",
     """/* THE PASS IS A FUNCTION NOW, so it can run at 56 or at 112 -- that is the whole
   fix for "the black border has to be thinner, like half as thin" (it was drawn at
   56 and then DOUBLED by the Scale2x that takes the frame to 112). Not one line of
   its logic changed, so every assertion below about its CONTENT still runs, against
   applyCharOutline instead of against an inline block. */
const m = src.match(/function applyCharOutline\\(px,CW,CH\\)\\{[\\s\\S]*?\\n  return px;\\n\\}/);
ok('the outline pass exists and is callable at any frame size', !!m);"""),

    ('gates/character_outline_gate.js',
     'the ORDER anchor follows the call, which is what has to be last',
     "const iPass = src.indexOf('if(CHAR_OUTLINE.on){');",
     """/* the CALL is what must come last inside buildFrame; the definition can live
   anywhere. `if(CHAR_OUTLINE.on && !_noOutline)` is that call site. */
const iPass = src.indexOf('if(CHAR_OUTLINE.on');"""),

    # ------------------------------------------------------------ clothes follow
    ('gates/clothes_follow_gate.js',
     'the LOCAL-not-closure rule stops demanding a hard-coded 56',
     """ok('the map build uses a LOCAL 56, not the skinner closure\\'s CW',
  /const _CW = 56;/.test(src) && /\\(idx\\/_CW\\)\\|0/.test(src));""",
     """/* THE RULE IS "A LOCAL, NOT THE SKINNER CLOSURE'S CW" -- the third closure
   boundary to cost a round -- and it still holds. The local now DERIVES its value
   from the rig instead of hard-coding 56, so this asks for the declaration and for
   the local actually being the thing divided by, which is the part that was ever
   in doubt. Demanding the literal would have made the gate a vote against reading
   the rig's real size. */
ok('the map build uses a LOCAL, not the skinner closure\\'s CW',
  /const _CW = /.test(src) && /\\(idx\\/_CW\\)\\|0/.test(src));"""),

    # -------------------------------------------------------------- frozen poses
    ('gates/frozen_poses_gate.js',
     'the cache-key rule allows the bordered/borderless segment',
     """ok('the frame cache keys on the resolved pose signature, not the phase index',
  /const k=d\\+'\\|'\\+clip\\+'\\|'\\+\\(_ph\\?_ph\\.sig:q\\)\\+'\\|'\\+frameLookHash\\(d\\)/.test(src));""",
     """/* THE RULE IS UNCHANGED: key on the RESOLVED POSE SIGNATURE, not the phase index
   -- that is what makes every frame of a hold literally the same pixels instead of
   a recomputation that merely ought to match. The key gained one more segment when
   the border moved to display size, because the cache now holds bordered AND
   borderless frames and serving one as the other would hand a borderless sprite to
   the city bake. `_ph?_ph.sig:q` is still the part being guarded. */
ok('the frame cache keys on the resolved pose signature, not the phase index',
  /const k=d\\+'\\|'\\+clip\\+'\\|'\\+\\(_ph\\?_ph\\.sig:q\\)\\+'\\|'/.test(src) &&
  /frameLookHash\\(d\\)/.test(src));"""),
]


def main():
    files, applied, missed = {}, [], []
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
        print('BORDER GATE REBLESS: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        return 1
    for path, src in files.items():
        open(path, 'w', encoding='utf8').write(src)
    print('BORDER GATE REBLESS: rewrote %d gate(s).' % len(files))
    return 0


if __name__ == '__main__':
    sys.exit(main())
