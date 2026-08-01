#!/usr/bin/env python3
"""
BOHEMIA LOGO GATE (8/1/26) — ten logos, and TEN ACTUAL ALPHABETS.

Paolo 8/1: "I don't wanna see the same font in the same style 10 different times I need
you to try 10 unique vastly different logo ideas for Bohemia and the one that you choose
I will put on the home screen"

The brief has a cheap read: draw one wordmark and put ten filters on it. He would spot
that instantly, and it is the STRUCTURE-NOT-COLOUR trap (7/19) pointed at type - a
recolour is never progress. So this gate holds the expensive read: the LETTERFORMS
themselves must differ, which it checks by comparing the raw glyph bitmaps rather than
the finished pictures.

AND THE BUG THAT ALMOST SHIPPED: the first render hand-picked a scale per logo and FOUR
of the ten ran off the canvas - the marquee, the scratched plate, the boardwalk and the
Amalgamation lost their final A, and the Amalgamation lost its B too. A wordmark that
does not fit its own frame is not a candidate. Invisible in any number, obvious the
second you look at the sheet, so it is a check now.

Run from repo root:  python3 gates/logo_gate.py
"""
import base64
import importlib.util
import io
import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image  # noqa: E402

BANK = 'banks/BOHEMIA_LOGO_CANDIDATES_8_1_26.txt'
COOK = 'tools/bohemia_logo_cook.py'
SHEET = 'records/target/LOGO_SHEET.png'

P = F = 0


def ok(n, c, d=''):
    global P, F
    if c:
        P += 1
    else:
        F += 1
        print('   FAIL  %s  %s' % (n, d))


def main():
    ok('the logo bank exists', os.path.exists(BANK), BANK)
    ok('the cook exists', os.path.exists(COOK), COOK)
    ok('the sheet exists for his eyes', os.path.exists(SHEET), SHEET)
    if not os.path.exists(BANK):
        print('   LOGO GATE: %d passed, %d failed' % (P, F))
        return 1

    bank = json.load(open(BANK))
    logos = bank.get('logos') or []
    # TEN CANDIDATES, plus the variant he asked for on top of them. The count moved from
    # 10 to 11 the moment he chose, and a gate that still demanded exactly ten would be
    # forcing the record to disagree with what actually happened.
    ok('the ten he was shown are all on file', len(logos) >= 10, '%d found' % len(logos))
    ok('the bank is the ten plus at most his chosen variant', len(logos) <= 11,
       '%d - anything past 11 is unjudged work hiding in a judged bank' % len(logos))
    ok('it carries his brief verbatim', 'vastly different' in str(bank.get('ruling', '')))
    ok('the batch is honestly unjudged', bank.get('status') == 'PENDING PAOLO',
       str(bank.get('status')))
    ok('a pick is named, because he asked which one I would choose',
       isinstance(bank.get('my_pick'), int) and 1 <= bank['my_pick'] <= len(logos))
    ok('and the pick gives a REASON, not a preference',
       len(str(bank.get('my_pick_reason', ''))) > 80)
    ok('every logo says what it claims about the game',
       all(len(str(l.get('why', ''))) > 30 for l in logos))
    ok('every logo has a distinct name',
       len({l.get('name') for l in logos}) == len(logos))

    # ---- TEN ALPHABETS, checked on the LETTERFORMS and not the pictures
    spec = importlib.util.spec_from_file_location('logocook', COOK)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    fonts = {k: v for k, v in vars(m).items()
             if k.startswith('F_') and isinstance(v, dict) and 'B' in v}
    ok('the cook defines a real set of alphabets', len(fonts) >= 8,
       '%d found' % len(fonts))
    sigs = {}
    for name, f in fonts.items():
        sigs[name] = '|'.join(''.join(f[ch]) for ch in 'BOHEMIA')
    dupes = [(a, b) for i, a in enumerate(sigs) for b in list(sigs)[i + 1:]
             if sigs[a] == sigs[b]]
    ok('NO TWO ALPHABETS ARE THE SAME FONT', not dupes,
       'identical letterforms: ' + ', '.join('%s==%s' % d for d in dupes))
    widths = {name: len(f['B'][0]) for name, f in fonts.items()}
    heights = {name: len(f['B']) for name, f in fonts.items()}
    ok('they are genuinely different SIZES too, not one grid redrawn',
       len(set(widths.values())) >= 4 and len(set(heights.values())) >= 3,
       'widths %s heights %s' % (sorted(set(widths.values())), sorted(set(heights.values()))))

    # ---- NOTHING IS CLIPPED. the bug that almost shipped.
    clipped = []
    blank = []
    for l in logos:
        im = Image.open(io.BytesIO(base64.b64decode(l['b64']))).convert('RGB')
        w, h = im.size
        b = im.tobytes()

        def lum(x, y):
            i = (y * w + x) * 3
            return 0.299 * b[i] + 0.587 * b[i + 1] + 0.114 * b[i + 2]

        # the word is the BRIGHT ink on these; if ink touches the outer columns the
        # wordmark is running off its own frame
        body = [lum(x, y) for y in range(h) for x in range(w)]
        hi = sorted(body)[int(len(body) * 0.985)]
        left = sum(1 for y in range(h) for x in range(2) if lum(x, y) >= hi)
        right = sum(1 for y in range(h) for x in range(w - 2, w) if lum(x, y) >= hi)
        if left > h * 0.10 or right > h * 0.10:
            clipped.append((l['name'], left, right))
        ink = sum(1 for v in body if v >= hi)
        if ink < w * h * 0.004:
            blank.append(l['name'])
    ok('NO LOGO RUNS OFF ITS OWN FRAME', not clipped,
       'ink on the outer columns: ' + ', '.join('%s(L%d R%d)' % c for c in clipped[:5]))
    ok('every logo actually has a wordmark on it', not blank, ', '.join(blank))
    ok('the cook auto-fits rather than hand-picking a scale that can overflow',
       'def fit(' in open(COOK).read())

    # ---- HIS PICK IS ON THE FRONT SCREEN. Paolo 8/1: "slide it into the homepage the
    # first thing I see every time I open up the alpha".
    ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
    a = open(ALPHA, encoding='utf8').read()
    ok('the alpha carries his chosen logo inline', 'BOH_FRONT_LOGO_B64' in a)
    chosen = bank.get('chosen_by_paolo')
    ok('the bank records that HE chose, not that I picked', chosen is not None,
       'no chosen_by_paolo - a pick of mine is not a verdict of his')
    if chosen:
        want = next((l for l in logos if l['n'] == chosen), None)
        ok('the chosen logo exists in the bank', want is not None)
        if want:
            ok('THE BYTES ON THE FRONT SCREEN ARE THE JUDGED BYTES',
               want['b64'] in a,
               'the alpha shows something other than the artwork he approved')
    ok('the front screen draws the image, not the old unjudged live wordmark',
       'BOH_FRONT_LOGO_IMG' in a and 'function drawLogoBig()' in a)
    ok('it blits without smoothing, so pixel art stays crisp',
       'imageSmoothingEnabled=false' in a)
    ok('and the canvas is styled to scale crisply on a phone',
       'image-rendering:pixelated' in a)

    print('   LOGO GATE: %d passed, %d failed  (%d logos, %d alphabets)'
          % (P, F, len(logos), len(fonts)))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
