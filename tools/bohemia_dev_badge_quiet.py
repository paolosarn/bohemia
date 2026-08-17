#!/usr/bin/env python3
"""BOHEMIA A DEV STATUS LINE WAS SITTING ON THE PLAY SURFACE (8/17/26, CHARACTER lane)

Screenshotted the walked city the way a friend meets it -- boot, tap the splash,
land in the game -- and across the top of the screen, above the day card, sat:

    rig sync: waiting for a rig edit

That is the CHARACTER lane's rig-rebuild indicator (ALPHA:5028 writes it when a rig
edit re-bakes the sprites). It is genuinely useful ON THE WORKBENCH. It is developer
language, and it was on RUN.

WHY IT LEAKED, and it is a placement thing, not a logic thing: #syncBadge sits
BETWEEN THE TAB BAR AND #stage -- outside every panel. Panels swap; it never does.
So it renders on all sixteen tabs including the one the game is played on, and no
amount of correct tab-switching could ever hide it.

THE FIX KEEPS THE WHOLE FEATURE AND REMOVES THE WHOLE PROBLEM: the badge says
NOTHING at rest and still flashes its green confirmation when a rig rebuild lands,
then fades back to nothing. Its entire job is "a rebuild just happened" -- a job
that is finished the moment you have read it.

The old behaviour dimmed the COLOUR after 900ms and kept the TEXT forever, so once
any rig edit had happened the player carried
"RIG SYNC ✓ 14:22:07 - character + animation rebuilt" across the top of the game
for the rest of the session, in dim brown. Fading a colour is not clearing a
message.

Nothing in gates/ or tools/ reads this element or its text (checked before touching
it), so there is no contract to break.

    python3 tools/bohemia_dev_badge_quiet.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

EDITS = [
    ('the badge starts empty, so a player never meets it',
     '  <div id="syncBadge">rig sync: waiting for a rig edit</div>',
     '  <div id="syncBadge"></div><!-- EMPTY AT REST: this is the rig-rebuild '
     'indicator and it lives OUTSIDE #stage, so it renders on every tab including '
     'RUN. It speaks only when a rebuild lands, then goes quiet again. -->'),

    ('an empty badge takes up no room',
     '#syncBadge{text-align:center;padding:2px;font-size:9px;letter-spacing:1px;color:#3a3020;transition:color .3s;pointer-events:none}',
     '#syncBadge{text-align:center;padding:2px;font-size:9px;letter-spacing:1px;color:#3a3020;transition:color .3s;pointer-events:none}'
     '#syncBadge:empty{padding:0;height:0}'),

    ('the confirmation CLEARS instead of just going dim',
     """  if(b){b.textContent='RIG SYNC \\u2713 '+new Date().toLocaleTimeString()+' - character + animation rebuilt';b.style.color='#8fe89a';setTimeout(()=>{b.style.color='#3a3020';},900);}""",
     """  /* SPEAK, THEN GO QUIET. This used to dim the COLOUR after 900ms and keep the
     TEXT forever -- so after the first rig edit the player carried
     "RIG SYNC ... character + animation rebuilt" across the top of the GAME for
     the rest of the session, in dim brown. Fading a colour is not clearing a
     message. The badge lives outside #stage and therefore shows on every tab
     including RUN, so anything it leaves behind is on the play surface. */
  if(b){b.textContent='RIG SYNC \\u2713 '+new Date().toLocaleTimeString()+' - character + animation rebuilt';b.style.color='#8fe89a';
    clearTimeout(G._syncBadgeT);
    G._syncBadgeT=setTimeout(()=>{b.style.color='#3a3020';b.textContent='';},1800);}"""),
]


def main():
    alpha = open(ALPHA, encoding='utf8').read()
    applied, missed = [], []
    for label, old, new in EDITS:
        if new in alpha:
            applied.append('(already) ' + label); continue
        n = alpha.count(old)
        if n != 1:
            missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
        alpha = alpha.replace(old, new, 1)
        applied.append(label)
    for l in applied: print('  ok   ' + l)
    for l in missed:  print('  MISS ' + l)
    if missed:
        print('DEV BADGE QUIET: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        return 1
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('DEV BADGE QUIET: applied to %s' % ALPHA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
