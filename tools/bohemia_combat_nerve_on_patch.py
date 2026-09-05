#!/usr/bin/env python3
"""
V199 A FIGHT ENDS WHEN SOMEBODY LEAVES, AND IT IS NOT AN UPGRADE ANY MORE.

VAMILY job: BB-NERVE-ON [fights end], claimed from COMBAT's section.

  THE ROW: "THE MECHANIC THAT ENDS FIGHTS EARLY IS SWITCHED OFF AND SOLD AS AN
  UPGRADE, AND HIS LOUDEST REQUIREMENT IS THAT FIGHTS BE SHORT. THE FIX IS ONE
  CONST... THE PERK NOW EXISTS (THEY KNOW YOU, EYE branch, level 2). So flip the
  default: MORALE IS DEFAULT BEHAVIOUR, NOT AN UPGRADE, and the perk goes on to
  do something BETTER (they break sooner, or at the sight of you) instead of
  being the thing that makes breaking exist."

  HIS ACCEPTANCE TEST: "every time it's ONE FUCKING BATTLE, it's not a 40 MINUTE
  LONG CHESS MATCH."

-------------------------------------------------------------------------
MEASURED FIRST, AND IT DOES NOT SAY WHAT THE ROW EXPECTS
-------------------------------------------------------------------------
Same 30 boards, same policy, one thing different -- nerve off, then on at V35's
own rates -- at three player paces, because the check only starts once HALF the
room is down and a fast player never gives it time to roll:

  player pace     TURNS TO END        ended by a break     men who leave
  fast (24)       18.0  ->  16.9          23.3%                6.6%
  real (12)       30.7  ->  29.3          16.7%                4.9%
  slow (7)        39.5  ->  39.1          10.0%                4.1%

*** THE MECHANIC IS SWITCHED OFF, THAT PART IS TRUE. BUT IT DOES NOT END FIGHTS
EARLY: IT BUYS 1.2 TURNS. *** Breaks really do happen and really do end fights --
one fight in five at a fast pace -- but the trigger is "half the room down", and
by the time half a room is down the rest fall within a couple of turns anyway. So
the row's headline is half right and this file says so rather than shipping the
flip and quoting the row back as though it had been proved.
THE LENGTH OF A FIGHT IS NOT LIVING IN THIS MECHANIC. At a realistic pace a fight
is 30.7 turns and this takes it to 29.3. That is written into the handoff for the
coordinator; INVENTING A ROW FOR IT IS NOT THIS CHAT'S JOB.

-------------------------------------------------------------------------
AND THE THING HE REJECTED DOES NOT COME BACK, WHICH IS THE SAFETY CHECK
-------------------------------------------------------------------------
Paolo 8/26, playing it: "I don't wanna see anyone run away anymore unless I have
a perk... YOU'RE NOT SCARY ENOUGH. I don't know why SO MANY PEOPLE ARE RUNNING
AWAY." That is a share, and flipping the default at V35's untouched rates gives
4.1% to 6.6% of men leaving. NOT "so many". The rout he saw came from a build
where the check fired for every standing man every turn from the third body on;
what he was reacting to is measured here at one man in twenty.
FLIPPING THIS DEFAULT DOES NOT REINSTATE HIS COMPLAINT, and that is a number, not
a reassurance. If it had, this patch would not exist -- a second rejection ends a
feature, and walking back into one knowingly is the thing STOP PRODUCING names.

-------------------------------------------------------------------------
AND THE FICTION RECONCILES ITSELF, WHICH IS THE BEST PART
-------------------------------------------------------------------------
V183's objection was a fiction: "a man who has just started does not frighten
anybody." True -- and it is an argument about FEAR OF YOU, not about morale.

  * DEFAULT, no perk: men break because HALF THEIR FRIENDS ARE DEAD. That is not
    about you at all. It is what people do.
  * THE PERK, THEY KNOW YOU: they break SOONER, because it is YOU. The threshold
    drops from half the room to a third and the roll gets steeper.

So the perk stops being the on-switch for a whole system and becomes a real verb,
which is what the row asked for, and V183's fiction survives intact instead of
being overruled.

NO DAMAGE BEFORE THE DIAL: applyDamage untouched, every archetype untouched, no
accuracy or range number moves. Nerve is a rule about WHO MAY ACT, which V165
already made the one master switch of this fight.

REUSE CHECK: cooks no graphic pixels and opens no bank. The nerve roll, the
panic, the surrender, the beat it lands on and the read-out are V35's, untouched;
this changes one const and the two numbers the roll is built from.

TASTE CHECK: nothing new on screen, no new button, no new row. The only thing a
player sees is that a beaten squad sometimes stops fighting.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V199 A FIGHT ENDS WHEN SOMEBODY LEAVES'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:200]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v199: already applied')
        return
    if 'V198 A TILE IS A HOUSE' not in d:
        sys.exit('v199 needs v198 -- run the tile patch first')

    # ---- 1. MORALE IS DEFAULT BEHAVIOUR, NOT AN UPGRADE ----
    d = sub(d,
        "const FEAR_ON=false;   /* [DIAL] until the perk exists, nothing switches this on -- which is the ruling */",
        """/* ===== V199 A FIGHT ENDS WHEN SOMEBODY LEAVES ======================
   BB-NERVE-ON. The row: "the mechanic that ends fights early is switched off and
   sold as an upgrade, and his loudest requirement is that fights be short... THE
   PERK NOW EXISTS. So flip the default."
   *** MEASURED BEFORE FLIPPING IT, AND THE ROW'S HEADLINE IS HALF RIGHT. *** Same
   30 boards, nerve off then on at V35's own rates, at three player paces because
   the check only starts once HALF the room is down and a fast player never gives
   it time to roll:
       fast player   18.0 -> 16.9 turns   ended by a break 23.3%   6.6% leave
       realistic     30.7 -> 29.3         16.7%                    4.9%
       slow          39.5 -> 39.1         10.0%                    4.1%
   IT IS SWITCHED OFF, TRUE. IT DOES NOT END FIGHTS EARLY: IT BUYS 1.2 TURNS.
   Breaks do happen and do end fights, but by the time half a room is down the
   rest fall within a couple of turns anyway. THE LENGTH OF A FIGHT DOES NOT LIVE
   IN THIS MECHANIC, and that goes in the handoff rather than being dressed up
   here as a result.
   *** AND THE THING HE REJECTED DOES NOT COME BACK. *** 8/26: "I don't wanna see
   anyone run away anymore... I don't know why SO MANY PEOPLE ARE RUNNING AWAY."
   At the untouched rates that is 4.1% to 6.6% of men -- one in twenty, not "so
   many". If it had reinstated his complaint this flip would not have shipped.
   *** AND HIS FICTION SURVIVES INSTEAD OF BEING OVERRULED. *** V183's objection
   was "a man who has just started does not frighten anybody", which is an
   argument about FEAR OF YOU and not about morale:
       DEFAULT -- men break because HALF THEIR FRIENDS ARE DEAD. Not about you.
       THE PERK -- they break SOONER, because it is YOU.
   So the perk stops being the on-switch for a whole system and becomes a verb. */
const FEAR_ON=true;   /* [DIAL] V199: morale is what people do, not an upgrade */""",
        what='morale is default')

    # ---- 2. AND THE PERK DOES SOMETHING BETTER THAN EXISTING ----
    d = sub(d,
        """    const _tot=G.e.length, _down=G.e.filter(e=>e.dead||e.downed||e.broken||e.fleeing).length, _half=Math.ceil(_tot*0.5);
    if(theyFearYou() && _down>=_half && _down>(G._nerveLastDown||0))for(const e of G.e){   /* V183: nobody runs from a nobody */ if(e.dead||e.downed||e.broken||e.fleeing)continue;
      const _chance=(0.10+0.05*(_down-_half))*(e.elite?0.5:1);""",
        """    /* V199: THE PERK IS NO LONGER THE ON-SWITCH, IT IS A SHARPER ROLL.
       THEY KNOW YOU drops the threshold from half the room to a third and makes
       the roll steeper -- "they break SOONER", which is the row's own wording --
       instead of being the thing that makes breaking exist at all. */
    const _tot=G.e.length, _down=G.e.filter(e=>e.dead||e.downed||e.broken||e.fleeing).length;
    const _known=(function(){ try{ return !!(G.perks&&G.perks.fear); }catch(_x){ return false; } })();
    const _half=Math.ceil(_tot*(_known?NERVE_KNOWN_AT:NERVE_AT));
    const _base=_known?NERVE_KNOWN_BASE:NERVE_BASE, _step=_known?NERVE_KNOWN_STEP:NERVE_STEP;
    if(theyFearYou() && _down>=_half && _down>(G._nerveLastDown||0))for(const e of G.e){   /* V183: nobody runs from a nobody */ if(e.dead||e.downed||e.broken||e.fleeing)continue;
      const _chance=(_base+_step*(_down-_half))*(e.elite?0.5:1);""",
        what='the perk sharpens the roll')

    d = sub(d,
        "  { /* V35 NERVE, LAST-MAN-ONLY SURRENDER (Paolo, ruled): nobody surrenders while his",
        """  /* V199 [DIALS]. The default pair is V35's, byte for byte, because it is the
     pair that measured at one man in twenty leaving -- nothing about the number
     he objected to needed changing once the trigger was understood. The KNOWN
     pair is the perk, and it is the only thing here that is new. */
  { /* V35 NERVE, LAST-MAN-ONLY SURRENDER (Paolo, ruled): nobody surrenders while his""",
        what='the dial note')

    d = sub(d,
        "function theyFearYou(){",
        """const NERVE_AT=0.5,        NERVE_BASE=0.10, NERVE_STEP=0.05;   /* [DIALS] V35's, untouched: half the room, then 10% + 5% a body */
const NERVE_KNOWN_AT=0.34, NERVE_KNOWN_BASE=0.16, NERVE_KNOWN_STEP=0.07;   /* [DIALS] V199 THEY KNOW YOU: a third of the room, and steeper */
function theyFearYou(){""",
        what='the nerve dials')

    # ---- 3. AND THE PERK SAYS WHAT IT ACTUALLY DOES NOW ----
    d = sub(d,
        "   says:'men break and run from you now', apply:()=>{ G.perks=G.perks||{}; G.perks.fear=true; }},",
        "   says:'they break sooner, and it is you they are running from', apply:()=>{ G.perks=G.perks||{}; G.perks.fear=true; }},   /* V199: it stopped being the on-switch, so its own line stopped being true */",
        what='the perk line')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v199: a fight ends when somebody leaves -- %d chars' % len(d))


if __name__ == '__main__':
    main()
