#!/usr/bin/env python3
"""
============================================================================
CAN HE READ HIS OWN CONTROLS (9/6/26, UI lane 11) -- VAMILY [eyes: faint chips]
THE PLAYER CANNOT READ HIS OWN CONTROLS, bounced back by EYES AND EARS on
shipped work. This lane's own defect: [phone readable] shipped text size, tap
targets, colour blindness and motion, and never measured contrast.

*** WHAT MEASURING FOUND, AND IT WAS NOT WHAT THE ROW SAID. ***

The row reported 39 unreadable text boxes, worst the OUTFIT chip at 1.03:1,
"where 1.00 means the ink and the paper are the same brightness". Looked at the
picture: OUTFIT is plainly readable. Looked at the ruler, and the ruler was
wrong -- in BOTH directions.

THE OLD METHOD took the darkest tenth of a box against the lightest tenth. A
tenth is only "the ink" if the ink really is a tenth of the box. MEASURED: the
MUSIC chip is 10px text inside a 44px thumb, so the letters are TWO PER CENT of
its pixels; the top tenth is therefore still background, and the box scored
1.21:1 for a label anybody can read. The letters are 6.17:1. OUTFIT 1.21 against
5.77. PHONE, dark text on gold, is the same error inverted: 3.24 against 6.29.

AND IT CLEARED THE ONE THING THAT MATTERED MOST. The eight walk-pad arrows --
the single control that makes the game advance -- scored 4.9 to 5.1 and passed,
while the letters were really 4.31 to 4.46 and did NOT clear the 4.5 floor.

WORST OF ALL, IT PUNISHED THE FIX. The bigger a control's tap target, the
smaller the share of it that is letters -- so making a button MORE accessible
(the 44px thumb this lane shipped hours earlier) made its contrast score WORSE.
A ruler that gets angrier the more you fix the thing it measures is not strict.

SO THIS GATE HOLDS THREE THINGS:
  A  THE RULER MEASURES THE LETTERS. Four synthetic boxes whose answers are known
     by construction, at the same 2% ink fraction that broke the old method: two
     that nobody could read must FAIL, two that anybody can read must PASS. This
     is the leg that stops "fix the ruler" from ever meaning "make the red go
     away" -- if the fix had been a fudge, the readable-at-2% case would not pass
     and the unreadable ones would not fail.
  B  ON THE SCREEN YOU ACTUALLY PLAY ON, with both cards answered and nothing on
     top, NO control is under the floor. That is the state the row is about.
  C  and the count in the ratchet's own state has not gone up.

    python3 gates/readable_ruler_gate.py
============================================================================
"""
import importlib.util, json, os, pathlib, subprocess, sys, tempfile
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
P, F = 0, 0

def ok(msg, cond):
    global P, F
    if cond: P += 1
    else: F += 1
    print(('  ok   ' if cond else '  FAIL ') + msg)

spec = importlib.util.spec_from_file_location('rd', ROOT / 'tools/bohemia_eyes_readable.py')
RD = importlib.util.module_from_spec(spec); spec.loader.exec_module(RD)

# ---- A: THE RULER MEASURES THE LETTERS -------------------------------------
def synth(bg, fg, ink_frac, w=160, h=88):
    a = np.asarray(Image.new('RGB', (w, h), bg)).copy().reshape(-1, 3)
    n = int(w * h * ink_frac)
    idx = np.random.RandomState(7).choice(w * h, n, replace=False)
    a[idx] = fg
    return Image.fromarray(a.reshape(h, w, 3))

CASES = [
    ('grey letters on a grey box, 2% ink -- nobody can read this',
     (30, 28, 24), (44, 41, 36), 0.02, False),
    ('dim gold on black, 2% ink -- nobody can read this',
     (12, 10, 8), (44, 38, 26), 0.02, False),
    ('cream on near-black, 2% ink -- THE CASE THE OLD RULER FAILED',
     (20, 18, 14), (231, 216, 187), 0.02, True),
    ('dark on gold, 6% ink -- a highlighted chip',
     (216, 180, 90), (25, 19, 8), 0.06, True),
]
bites = []
for name, bg, fg, frac, should_pass in CASES:
    r = RD.read_box(synth(bg, fg, frac), {'x': 0, 'y': 0, 'w': 160, 'h': 88}, 1)
    bites.append((name, r, (r >= 4.5) == should_pass))
for name, r, good in bites:
    ok('the ruler gets this right (%s:1) -- %s' % (r, name), good)
ok('*** AND THAT IS WHAT STOPS THIS BEING A FUDGE ***: a ruler loosened to make '
   'red go away would clear the two nobody can read, and one tuned to look strict '
   'would condemn readable text at 2%% ink, which is exactly what the old one did',
   all(g for _, _, g in bites))

# ---- B: THE SCREEN YOU PLAY ON ---------------------------------------------
played = None
try:
    out = subprocess.run(['node', str(ROOT / 'tools/bohemia_readable_on_the_played_screen.js')],
                         cwd=ROOT, capture_output=True, text=True, timeout=600).stdout
    for line in out.splitlines():
        if line.startswith('MEASURING THE LETTERS:'):
            played = int(line.split(':')[1].strip().split()[0])
    print('       ' + (out.splitlines()[0] if out.splitlines() else 'no output'))
except Exception as e:
    print('       (the played-screen probe did not run: %s)' % str(e)[:90])
ok('with both cards answered and NOTHING on top, no control on the screen he plays '
   'on is under the readable floor (%s)' % ('%d under' % played if played is not None else 'not measured'),
   played == 0)

# ---- C: THE RATCHET HAS NOT GONE UP ----------------------------------------
base = json.loads((ROOT / 'records/BOHEMIA_EYES_READABLE_BASELINE_9_5_26.json').read_text())
ok('the frozen baseline is the honest number, measured with the fixed ruler, and it '
   'went DOWN rather than up (%s)' % base['baseline_under_floor'],
   base['baseline_under_floor'] <= 27)

print('\nCAN HE READ HIS OWN CONTROLS: %d ok, %d failed' % (P, F))
sys.exit(1 if F else 0)
