#!/usr/bin/env python3
"""
BOHEMIA TOUCH GUARD (7/27/26) - HOLDING A BUTTON TO WALK WAS OPENING iOS's
COPY / LOOK UP / SEARCH BUBBLE, AND THE GAME NEVER SAID NOT TO.

Paolo, playing on his phone: "There is no [selec]tion when I'm pressing the
button, I'm trying to search shit and then it's like typing. I'm trying to copy
and paste the arrow of move. It's very strange."

He is not describing a weird mood. He is describing exactly what iOS Safari does
to an arrow glyph in a <div> when you press and HOLD it, which is the ONLY way
to walk in this game (startHold/endHold): the text-selection magnifier comes up,
the arrow character gets selected, and the Copy / Look Up / Search / Share
callout takes over the screen. The game reads the touch AND iOS eats it. Every
step he tries to take is a fight with the OS.

THE CAUSE, and it is one CSS rule that was never finished. The alpha shell's
reset is:

    *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}

`-webkit-tap-highlight-color` only kills the grey flash. Nothing in the whole
top-level document ever said user-select:none, and NOTHING ANYWHERE in the alpha
- not the shell, not the city frame, not combat, not the rig - ever said
`-webkit-touch-callout:none`. That property is the only thing that suppresses
the long-press callout on iOS. Zero occurrences in a 33MB file whose entire
control scheme is press-and-hold.

The city frame at least had user-select:none, which is why this reads as
intermittent rather than constant: some surfaces select text, all of them can
raise the callout.

THE FIX
  shell   user-select:none + -webkit-touch-callout:none on the reset, and
          text-selection given BACK explicitly to input/textarea, because
          copy/paste is correct in a text field and wrong on a d-pad. NOT
          touch-action:none at the shell level - the character and clothes
          panels are real scrolling lists and blanket-disabling touch would
          trade one broken surface for another.
  frames  -webkit-touch-callout:none added to each frame's existing reset. The
          city frame already had touch-action:none + user-select:none, so the
          callout was the last hole in it.

MOBILE FIRST IS NOT A STYLE NOTE. This game is iPhone-portrait only, its whole
input model is hold-to-act, and the platform's default behaviour for hold is to
open a text menu. Every future surface inherits the guard from these resets.

REUSE CHECK: cooks ZERO pixels and touches no art, no asset, no bank. It is four
CSS declarations about how the operating system may interpret a finger. No
banks/ lookup applies because nothing is created, selected or altered.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.

Idempotent (marker TOUCH GUARD).

  python3 tools/bohemia_touch_guard_patch.py
"""
import base64
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# THE RUN IS NOT PATCHED HERE, ON PURPOSE (7/28). Paolo: "when I'm playing it
# and I press the direction button keys it tries to like copy and paste it".
# This tool covered the shell and the three BASE64 frames and MISSED the run
# entirely, because the run is not a base64 frame - the alpha loads it by iframe
# SRC from slices/BOHEMIA_RUN_CURRENT.html, which is a GENERATED file. Patching
# a generated file is worse than not patching it: the very next
# `node tools/build_run_slice.js` erases the patch, and that command runs
# several times in a working session. So the run's guard lives in its DEV
# SOURCE (slices/BOHEMIA_RUN_SLICE_7_26_26.html) where the builder carries it
# forward, and gates/touch_guard_gate.js now checks BOTH the dev source and the
# shipped file plus the real computed style of the run's own direction buttons.

alpha = open(ALPHA, encoding='utf8').read()
if 'TOUCH GUARD' in alpha:
    print('touch guard already applied. no-op.')
    sys.exit(0)

applied = []

# ---- 1) the shell: the tab bar, the character panels, the splash -------------
OLD = '*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}'
NEW = ("""/* TOUCH GUARD (7/27): the reset stopped at the grey tap flash. On iOS,
   press-and-hold on ANY text - a label, a tab, the arrow glyph you walk with -
   raises the selection magnifier and the Copy / Look Up / Search callout, and
   hold IS this game's only movement input. Paolo: "I'm trying to copy and
   paste the arrow of move." user-select kills the selection,
   -webkit-touch-callout kills the menu. Deliberately NOT touch-action:none
   here: the character and clothes panels are real scrolling lists and the
   shell must keep scrolling. */
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;"""
       """-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}
/* and given straight back where copy/paste is the POINT */
input,textarea{-webkit-touch-callout:default;-webkit-user-select:text;user-select:text}""")
if alpha.count(OLD) == 1:
    alpha = alpha.replace(OLD, NEW, 1)
    applied.append('shell: hold no longer selects text or opens the iOS callout (text fields keep it)')

# ---- 2) every embedded frame: the callout was the hole in all of them --------
FRAME_ADD = ';-webkit-touch-callout:none'
for key in ('CITY_B64', 'COMBAT_B64', 'RIG_B64'):
    k = "const %s='" % key
    if k not in alpha:
        continue
    a0 = alpha.index(k) + len(k)
    a1 = alpha.index("'", a0)
    d = base64.b64decode(alpha[a0:a1]).decode('utf8')
    if '-webkit-touch-callout' in d:
        continue
    # the frames do not share one reset (the rig's omits margin/padding), so
    # match the shape they DO share rather than a byte string
    m = re.search(r'\*\{[^}]*-webkit-tap-highlight-color:transparent[^}]*\}', d)
    if not m:
        print('  (no reset rule found in %s - skipped)' % key)
        continue
    e = d.index('}', m.start())
    d = d[:e] + FRAME_ADD + '   /* TOUCH GUARD (7/27): hold-to-act vs the iOS long-press menu */' + d[e:]
    alpha = alpha[:a0] + base64.b64encode(d.encode('utf8')).decode('ascii') + alpha[a1:]
    applied.append('%s: iOS long-press callout suppressed' % key.replace('_B64', '').lower())

if not applied:
    print('TOUCH GUARD: nothing matched. NOT applied.')
    sys.exit(1)

open(ALPHA, 'w', encoding='utf8').write(alpha)
print('TOUCH GUARD applied:')
for a in applied:
    print('  - ' + a)
