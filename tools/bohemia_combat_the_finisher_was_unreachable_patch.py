#!/usr/bin/env python3
"""
V178 THE FINISHER WAS UNREACHABLE, AND NOTHING KNEW BECAUSE NOTHING HAD EVER
FIRED THE GUN.

V176 shipped a charge that fills on landed shots and, at FINISH_AT, makes the
next killshot skip V32's lethality coin. FINISH_AT was 6, picked off a headless
measurement of turns and bodies per fight.

*** THEN THE GUN GOT FIRED FOR THE FIRST TIME. *** Every combat gate in this
repo -- including V176's own -- reaches the fight by calling applyDamage
directly, which SKIPS fireNow entirely. So the dial, the lethality coin, the
downed state and the finisher's own feed had never once been exercised by a test.
V176's gate fed the counter by calling finisherFeed() six times itself, which
proves the counter counts and says nothing whatever about whether a fight ever
gets there.

Driving the real ENGAGE/FIRE buttons through Playwright:

    a THREE-MAN FIGHT: 11 shots to clear the board, CHARGE EARNED 5 OF 6.
    THE FINISHER NEVER BECAME AVAILABLE, and it never would have.

ENC_WEIGHTS puts 65% of encounters at three or four men, so the ability shipped
yesterday was absent from most fights he plays. That is a DEAD DIAL by a
different route than MEDIC_SHY: not a term that changes nothing, but a threshold
nobody can reach.

WHAT CHANGES: FINISH_AT 6 -> 4. One number. Four landed shots is still real work
-- it is most of a small fight -- but a three-man board earns five, so the thing
can actually happen. Nothing else about V176 moves: same feed, same spend, same
one line touched, same no-op on the shotgun.

AND THE GATE CHANGES WITH IT, WHICH MATTERS MORE THAN THE NUMBER. The V176 arm
that simulated the lethality line is replaced by one that FIRES THE ACTUAL
WEAPON through the real buttons and watches the charge climb, the readouts fire
and the body stay down. A threshold can only be checked by a test that can reach
it.

REUSE CHECK: cooks no graphic pixels, opens no bank, adds no function. It edits a
single [DIAL] constant that V176 declared for exactly this purpose.

TASTE CHECK: nothing new on screen. The readouts V176 wrote finally get to run.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V178: measured by firing the real gun'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:140]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v178: already applied')
        return

    d = sub(d,
        "const FINISH_AT=6;   /* [DIAL] landed shots to earn one, against a fight of about 12 turns */",
        """const FINISH_AT=4;   /* [DIAL] V178: measured by firing the real gun -- see below */
/* ===== V178: SIX WAS UNREACHABLE AND NOTHING KNEW =================
   V176 picked 6 off a headless count of turns and bodies. Then the ENGAGE and
   FIRE buttons got driven for the first time in this repo's history -- every
   combat gate reaches the fight through applyDamage, which SKIPS fireNow, so the
   dial, the lethality coin, the downed state and this counter's own feed had
   never been exercised by a test at all. V176's gate fed the counter by calling
   finisherFeed() six times itself: that proves the counter counts and says
   nothing about whether a fight ever gets there.
   MEASURED ON THE REAL BUTTONS: a THREE-MAN FIGHT takes 11 shots to clear and
   earns FIVE charge of the six needed. The finisher never became available, and
   never would have -- and ENC_WEIGHTS puts 65% of encounters at three or four
   men, so the ability shipped yesterday was absent from most fights he plays.
   A DEAD DIAL BY A DIFFERENT ROUTE than MEDIC_SHY: not a term that changes
   nothing, but a threshold nobody can reach. Four is still most of a small
   fight, and a small fight earns five. */""",
        what='FINISH_AT')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v178: FINISH_AT 6 -> 4 -- %d chars' % len(d))


if __name__ == '__main__':
    main()
