#!/usr/bin/env python3
"""
SEVENTEEN MEGABYTES, ON EVERY BOOT, FOR A PANEL THAT IS NEVER SHOWN
(8/21/26, RUN lane, demo board DECISION item 3).

THE DEMO BOARD AUTHORISED THIS AND THEN THE THING IT WAS WAITING ON LANDED:

    "THE PRELOAD OF THE RUN SLICE IS DEFERRED OR DROPPED once the migration
     lands -- 11 MB off the wire, which is most of the time-to-first-play
     problem, for free."

The migration has landed: the sound wiring, the combat entry and the payday call
sites are all in the city world now, each proved by its own gate. So the last
reason to fetch the run slice on a normal boot is gone.

TWO THINGS THE BOARD GOT WRONG, BOTH MEASURED HERE RATHER THAN REPEATED:

  IT IS NOT 11 MB. slices/BOHEMIA_RUN_CURRENT.html is 17.8 MB on disk.

  IT IS NOT "MOST OF" THE PROBLEM. Instrumented against the real alpha, a friend
  fetches FIVE things before he can move:
      BOHEMIA_CITY_TILES.js      28.04 MB     <- the actual headline, WORLD's
      BOHEMIA_RUN_CURRENT.html   17.79 MB     <- 100% waste, this patch
      BOHEMIA_ALPHA_0_9.html      4.02 MB
      BOHEMIA_CITY_WORLD.html     2.50 MB
      fonts.googleapis.com css    (async, media=print onload -- not blocking,
                                   and cold_boot_gate already covers it)
  So the run slice is about a THIRD of the bill, not most of it, and killing it
  does not fix time-to-first-play on its own. Said plainly so nobody reads this
  commit as "the download problem is solved".

AND A NOTE ON HOW THAT WAS MEASURED, because the first instrument lied. A probe
built on playwright's `response`/`body()` reported the total as 34.56 MB and the
run slice as NOT FETCHED AT ALL -- for a file whose iframe src is demonstrably
set at 2.5s and whose frame is live with 72 child nodes. Neither `response` nor
`requestfinished` fires with a size for that large file:// iframe navigation;
only the raw `request` event shows it. A NEGATIVE RESULT IS A CLAIM ABOUT YOUR
INSTRUMENT UNTIL YOU HAVE SHOWN THE INSTRUMENT COULD HAVE SEEN A POSITIVE ONE.

WHAT WAS ACTUALLY THERE, and the second trigger is worse than the timer:

    if(rt2)rt2.addEventListener("click",runLoad);
    setTimeout(runLoad,2500);   /* THE RUN preloads quietly so tapping RUN is instant */

  1. THE TIMER fetches 17.8 MB two and a half seconds into every visit,
     unconditionally, for a panel the shell never displays.
  2. THE CLICK BINDING IS ACTIVELY WRONG NOW. The RUN tab does not show the run
     any more -- `var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;` --
     it shows the CITY. And the splash handler TAPS THE REAL RUN TAB, so the
     fetch fires at the exact moment the player is waiting on the city he is
     about to walk in. The comment "so tapping RUN is instant" describes a
     behaviour that stopped existing when the game moved house.

THE FIX MAKES THE DEPENDENCY VISIBLE INSTEAD OF IMPLICIT, which is the whole
lesson of this week: `window.__loadRunSlice()` is exported, and NOTHING in the
product calls it. Four gates need the frame live inside the alpha (navcluster,
run, surface_truth, touch_guard) and they now ASK FOR IT BY NAME. A thing that
loads because of a timer is a thing nobody can find; a thing that loads because
somebody called a function is a thing you can grep.

NOTHING IS DELETED. The iframe, its data-src, and every runPost/runSendCast call
site are untouched, and the board's own rule stands: "the run slice stays in the
repo as the source of the wiring being migrated." This changes WHEN it loads,
from "always" to "when asked", and nobody in the product asks.

WHAT A PLAYER LOSES: nothing. The panel was never displayed, so the bytes bought
him nothing. If a future surface needs it, it calls the function.

Idempotent.
"""
import os
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---------------------------------------------------------------------------
# AND THE SECOND TRIGGER, WHICH IS THE REAL BUG. Removing the timer was not
# enough -- the run slice was STILL fetched, because of the GENERIC tab loader
# added on 8/4 so a new tab would work without anyone remembering to wire it:
#
#     var pan=document.getElementById("p-"+tab.dataset.p);
#     var f=pan.querySelector("iframe[data-src]"); if(!f.src) f.src=f.dataset.src;
#
# It loads the panel NAMED AFTER the tab. The shell SHOWS a different one:
#
#     var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;   (ALPHA:8241)
#
# TWO MAPPINGS OF THE SAME TAB, DISAGREEING. Tapping RUN displays p-city and
# loads p-run, so the 17.8 MB fetch was not a preload at all by the end -- it was
# the loader faithfully filling in a panel nobody will ever look at. Same family
# as the HOME bug this lane fixed on 8/20 (two surfaces, one marker) and as every
# units bug in the sweep: the checker and the checked were in different rooms.
#
# So the loader borrows the shell's own mapping instead of keeping a second copy
# of the rule. p-city holds no iframe[data-src] -- the city frame is built in the
# splash handler -- so tapping RUN now loads nothing and the panel it displays is
# already there.
GENERIC_OLD = ('t.addEventListener("click",function(e){var tab=e.target.closest?'
               'e.target.closest(".tab"):null; if(!tab)return;'
               'var pan=document.getElementById("p-"+tab.dataset.p);')
GENERIC_NEW = ('t.addEventListener("click",function(e){var tab=e.target.closest?'
               'e.target.closest(".tab"):null; if(!tab)return;'
               '/* __THE_RUN_SLICE_IS_NOT_DOWNLOADED__ -- ONE MAPPING, NOT TWO. This '
               'read document.getElementById("p-"+tab.dataset.p), the panel NAMED after '
               'the tab, while the shell DISPLAYS (t.dataset.p===\'run\')?\'city\':t.dataset.p '
               '(ALPHA:8241). Tapping RUN therefore showed p-city and loaded p-run -- 17.8 MB '
               'of run slice pulled in to fill a panel nobody will ever look at. Two mappings '
               'of one tab, disagreeing, which is the same family as every other bug this week. '
               'Borrow the shell\'s rule rather than keeping a second copy of it. */'
               'var _pid=(tab.dataset.p===\'run\')?\'city\':tab.dataset.p;'
               'var pan=document.getElementById("p-"+_pid);')

OLD = ('if(rt2)rt2.addEventListener("click",runLoad);setTimeout(runLoad,2500);'
       '/* THE RUN preloads quietly so tapping RUN is instant */')

NEW = (
    '/* __THE_RUN_SLICE_IS_NOT_DOWNLOADED__ (8/21). This used to be '
    '`if(rt2)rt2.addEventListener("click",runLoad);setTimeout(runLoad,2500);` -- '
    '17.8 MB fetched on EVERY visit for a panel the shell never displays, and the '
    'click binding was the worse half: the RUN tab shows the CITY now '
    '(PANEL = dataset.p===\'run\' ? \'city\' : ...) and the splash handler taps '
    'that very tab, so the fetch fired at the exact moment the player was waiting '
    'on the city he was about to walk in. "so tapping RUN is instant" described a '
    'behaviour that stopped existing when the game moved house. Demo board '
    'DECISION item 3, unblocked now the sound/combat/payday wiring has migrated. '
    'THE DEPENDENCY IS EXPLICIT INSTEAD OF IMPLICIT: nothing in the product calls '
    'this, and the four gates that need the frame live ask for it by name. A thing '
    'that loads on a timer is a thing nobody can find. */'
    'window.__loadRunSlice=runLoad;')


def main():
    if not os.path.exists(ALPHA):
        sys.exit('FAIL: ' + ALPHA + ' not found')
    s = open(ALPHA, encoding='utf8').read()
    if '__THE_RUN_SLICE_IS_NOT_DOWNLOADED__' in s:
        print('NOOP: the run slice already loads only when asked')
        return
    if OLD not in s:
        sys.exit('FAIL: cannot find the preload. Looked for:\n  ' + OLD)
    out = s.replace(OLD, NEW, 1)
    if GENERIC_OLD not in out:
        sys.exit('FAIL: cannot find the generic tab loader')
    out = out.replace(GENERIC_OLD, GENERIC_NEW, 1)

    # THE THINGS THAT MUST SURVIVE: the frame, its source, and every consumer.
    # A "deferral" that quietly removed the iframe would be a far worse bug.
    for needle, why in (
            ('id="runFrame"', 'the iframe itself'),
            ('data-src="BOHEMIA_RUN_CURRENT.html"', 'where it loads from'),
            ('function runPost(msg)', 'the poster'),
            ('function runSendCast()', 'the cast sender')):
        if needle not in out:
            sys.exit('FAIL: the patch would remove %s (%s)' % (needle, why))
    if 'window.__loadRunSlice=runLoad;' not in out:
        sys.exit('FAIL: the explicit loader was not installed')

    open(ALPHA, 'w', encoding='utf8').write(out)
    print('PATCHED %s -- the run slice loads only when something asks by name' % ALPHA)


if __name__ == '__main__':
    main()
