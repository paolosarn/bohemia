#!/usr/bin/env python3
"""
I WROTE "THE FOUR GATES THAT NEED THE FRAME LIVE ASK FOR IT BY NAME" AND NEVER
SWEPT FOR THE REST (8/23/26, RUN lane. Cleaning up after myself.)

On 8/21 this lane stopped the alpha downloading BOHEMIA_RUN_CURRENT.html on boot
-- 17.8 MB fetched on every visit for a panel the shell never displays. That was
right and it stays. The loader was deliberately kept and EXPORTED, with a note in
the shipped file saying exactly this:

    THE DEPENDENCY IS EXPLICIT INSTEAD OF IMPLICIT: nothing in the product calls
    this, and the four gates that need the frame live ask for it by name.

I taught the four I happened to find (first_bytes, navcluster, run_gate,
touch_guard, sfx_wired -- five, in fact) and I never went looking for the rest.
MEASURED NOW, mechanically: TEN gates open the alpha, hunt the frame list for
RUN_CURRENT, and never ask the loader for it.

AND THE FAILURE THEY PRODUCE IS A LIE, WHICH IS WHY THIS WAS SLOW TO SEE. The
common line is

    const fr = p.frames().find(f => f.url().includes('RUN_CURRENT')) || p.frames()[1];

so when the run frame is not there, the fallback silently hands them THE CITY --
a real, live, working frame that simply has no openDoor and no run SLEEP verb. The
gate then reports "the run exposes openDoor: FAIL" and "the run offers SLEEP as
its own contextual action ('')". Both read as the RUN being broken. Neither is
about the run at all. A fallback that substitutes a different surface without
saying so turns a missing dependency into a false accusation against working code.

THE FIX IS THE ONE THE NOTE ALREADY PROMISED: ask by name. Each gate calls
window.__loadRunSlice() after the alpha is up and waits for the frame to finish
loading before it goes looking. Nothing about the product changes; the boot stays
clean and the 17.8 MB stays unfetched for players.

THE FALLBACK IS KEPT, deliberately. Deleting it would be a second change riding
along on a fix, and with the loader in front of it the fallback stops being
reachable in the normal case anyway. If it ever fires again the gate fails the
same way it does today -- but now that failure means something.

Idempotent. Reports what it changed and what it could not find.
"""
import os
import sys

MARK = '__ASK_FOR_THE_RUN_SLICE__'

ASK = """  /* """ + MARK + """ (8/23). The alpha stopped downloading the 17.8 MB run
     slice on boot (8/21) and this gate never got told. Without this the frame
     lookup below falls through to p.frames()[1] -- THE CITY -- and every claim
     about "the run" is then measured against a surface that was never asked to
     carry them. Ask the exported loader by name, which is what it was exported
     for, and wait for the frame to finish rather than guessing a duration. */
  await p.evaluate(() => { if (window.__loadRunSlice) window.__loadRunSlice(); });
  for (let _i = 0; _i < 120 && !p.frames().find(f => f.url().includes('RUN_CURRENT')); _i++)
    await p.waitForTimeout(500);
  { const _rf = p.frames().find(f => f.url().includes('RUN_CURRENT'));
    if (_rf) await _rf.waitForLoadState('load').catch(() => {}); }
"""

# every one of these is the SAME line, which is what made the sweep mechanical
TARGETS = [
    ('gates/doors_fresh_gate.py',
     "  const fr = p.frames().find(f => f.url().includes('RUN_CURRENT')) || p.frames()[1];"),
    ('gates/time_pass_gate.py',
     "  const fr = p.frames().find(f => f.url().includes('RUN_CURRENT')) || p.frames()[1];"),
    ('gates/voice_gate.py',
     "  const fr2 = p.frames().find(f => f.url().includes('RUN_CURRENT')) || p.frames()[1];"),
    ('gates/every_voice_surface_gate.py',
     "  const rf = p.frames().find(f => f.url().includes('RUN_CURRENT'));"),
]


# ---------------------------------------------------------------------------
# AND ONE FIXED SLEEP THAT THE FIX ABOVE EXPOSED.
#
# every_voice_surface waited a FLAT 46 SECONDS for the cold open and then read
# how far it got. That was fine while the run slice loaded on a boot timer and
# had long since settled; now the slice loads a few lines earlier, in the same
# tab, and the cold open plays on a page carrying 17.8 MB more than it used to.
# The beats run behind and 46s stops being enough -- "the cold open runs to the
# end (beat 92)".
#
# THE DURATION WAS ALWAYS THE BUG AND THE LOAD ONLY MADE IT VISIBLE. A fixed
# sleep encodes a guess about how fast the machine is; under any load it either
# wastes time or lies. This waits for THE CONDITION -- storyState says done --
# with a ceiling well above the old guess, so a genuinely stuck cold open still
# fails and a merely slow one does not.
SLEEP_OLD = """  await p.waitForTimeout(46000);   /* the cold open grew to ~40 beats on 8/12 */"""

SLEEP_NEW = """  /* """ + MARK + """ (8/23): was `await p.waitForTimeout(46000)`, a flat
     guess that only held while the run slice happened to be loaded long before
     this point. THE CONDITION, NOT A DURATION -- and the ceiling is generous so
     a slow box reads as slow rather than as a broken cold open. */
  await p.waitForFunction(() => {
    const e = document.getElementById('cutState') || document.getElementById('storyState');
    return !!(e && /done/.test(e.textContent || ''));
  }, null, { timeout: 150000 }).catch(() => {});"""


def main():
    changed, noop, missing = [], [], []
    for path, anchor in TARGETS:
        if not os.path.exists(path):
            missing.append(path + ' (no such file)')
            continue
        s = open(path, encoding='utf8').read()
        if MARK in s:
            noop.append(path)
            continue
        n = s.count(anchor)
        if n != 1:
            missing.append('%s (anchor matched %d times, expected 1)' % (path, n))
            continue
        open(path, 'w', encoding='utf8').write(s.replace(anchor, ASK + anchor, 1))
        changed.append(path)

    vs = 'gates/every_voice_surface_gate.py'
    if os.path.exists(vs):
        s = open(vs, encoding='utf8').read()
        if SLEEP_NEW.split('\n')[0] in s:
            noop.append(vs + ' (cold-open wait)')
        elif s.count(SLEEP_OLD) == 1:
            open(vs, 'w', encoding='utf8').write(s.replace(SLEEP_OLD, SLEEP_NEW, 1))
            changed.append(vs + ' (cold-open wait: a condition, not 46 seconds)')
        else:
            missing.append(vs + ' (cold-open sleep anchor not found)')

    for p in changed:
        print('PATCHED  ' + p + ' -- asks the loader by name')
    for p in noop:
        print('NOOP     ' + p + ' -- already asks')
    for p in missing:
        print('MISSED   ' + p)
    if missing:
        sys.exit(1)


if __name__ == '__main__':
    main()
