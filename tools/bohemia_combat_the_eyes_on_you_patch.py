#!/usr/bin/env python3
"""
V179 THE EYES ON YOU -- RF4-53 layer 2, the awareness state, on the field.

  "THREE-LAYER AWARENESS TURNS STEALTH INTO A FIGHT-START TRIGGER. Not one
   stealth stat, three rules. Layer 1 DETECTION RADIUS, drawn on the map AS RINGS
   so it is COUNTABLE. Layer 2 AWARENESS STATE. Layer 3 PROPAGATION...
   A BINARY SPOTTED/UNSPOTTED SYSTEM HAS NO DECISIONS IN IT."

Our diff: "ABSENT... note the readout discipline: RINGS ON THE MAP, which is
RF4-02 and RF4-48 again -- information ON THE FIELD, never in a menu."

*** LAYER 3 IS ALREADY SHIPPED *** as V175's first-sight alarm (a 50% yell on
gaining sight, reaching further than the routine shout). This is LAYER 2.

MEASURED FIRST, TWICE, AND THE SECOND MEASUREMENT CHANGED THE BUILD.

  1. DOES DISTANCE EVER DECIDE ANYTHING? Our SIGHT_TILES is 17, not RF4's 6,
     because this is a gun game -- so a detection ring might be a circle nobody
     is ever near. Broke every "he cannot see me" into WHY, over 278 real fight
     states and 1177 living men:
         he CAN see you        414
         TOO FAR               132   (17.3% of every blind man)
         BLOCKED BY COVER      631   (82.7%)
     Distance binds, but cover decides. The median man stands at 9.2 tiles and
     the 90th percentile at 17.2, so the sight edge sits exactly where men are.

  2. IS "HE CAN SEE ME" ALREADY ON SCREEN? V165 made vision the master switch --
     it gates the bead, the volley, the press, the shout and the spotter's pin --
     so this is the one fact the player most needs. What exists: a green wash for
     peeking, a red wash for firing, a red line for a held bead. Measured:
         men who can see you                           450
         of those, already marked on screen            450  (100%)
         MEN MARKED ON SCREEN WHO CANNOT SEE YOU       707 of 1157  (61%)

*** SO THE SIGNAL IS NOT MISSING, IT IS OVER-INCLUSIVE. *** The washes are
honest about HIS STANCE -- he is up, he is shooting -- and say nothing about
whether he has a line on YOU, because your cover is what breaks it. Three of
every five marked men cannot see you at all. That is worse than the binary the
row complains about: it is a signal that is wrong more often than right, and the
player cannot tell which.

WHAT SHIPS: A RING ON THE GROUND UNDER EVERY MAN WHO ACTUALLY HAS EYES ON YOU.
Not a new number, not a HUD, not a menu -- the awareness state where RF4-02 and
RF4-48 insist it goes, on the floor. It reads seesMe(), the shipped predicate
that already gates five systems, so the ring cannot disagree with the game: it IS
the game's own answer, drawn.

AND IT MAKES COVER LEGIBLE, which is the whole point. The stone takes 73% of the
guns off you (measured 8/21) and until now that happened invisibly. Step behind a
rock and rings go out.

45 DEGREE ART LAW: an ELLIPSE, not a circle -- the ground is seen at the world's
three-quarter view, and every other ground mark in this file (blood, shadows,
pillar tops) is already squashed the same way. This matches their proportion
rather than inventing one.

COLOUR: bone, deliberately. Green is the peek wash, red is firing and the held
bead, amber is the melee telegraph, blue is the way out, and PURPLE IS RESERVED
FOR THE AMALGAMATION. Bone collides with none of them and reads as attention
rather than threat.

NO DAMAGE BEFORE THE DIAL: draws pixels, changes no rule. Not one damage,
accuracy, hp or behaviour number moves -- the fight plays exactly as it did, and
the player can finally see the switch it has been running on since V165.

REUSE CHECK: cooks no graphic pixels and opens no bank -- there is nothing to
cook, it is one stroked ellipse in the enemy pass, sized off the same `er` the
body uses and squashed on the same axis as the shadow beneath it.

TASTE CHECK: no new button, no new HUD, no tutorial, and a [DIAL] to switch it
off. Thin and quiet: it marks, it does not shout.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel. It is
drawn UNDER the body, before the sprite, so nothing of his art is covered.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V179 THE EYES ON YOU'


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
        print('v179: already applied')
        return

    d = sub(d,
        """    const _cov=false;   /* V18: the baked take-cover frames carry the crouch now */""",
        """    /* ===== V179 THE EYES ON YOU (RF4-53 layer 2) ==================
       "A BINARY SPOTTED/UNSPOTTED SYSTEM HAS NO DECISIONS IN IT."
       V165 made vision the master switch: it gates the bead, the volley, the
       press, the shout and the spotter's pin. So WHO HAS EYES ON YOU is the one
       fact the player most needs, and measured over 278 real fight states it was
       the one fact the screen would not tell him. The washes that exist are
       honest about a man's STANCE -- green he is up, red he is shooting -- and
       say nothing about whether he has a line on YOU, because your cover is what
       breaks it: 707 of 1157 marked men, THREE IN FIVE, could not see you at all.
       A signal wrong more often than right, with no way to tell which.
       THIS IS THE GAME'S OWN ANSWER, DRAWN. It reads seesMe(), the same
       predicate the five systems above run on, so the ring can never disagree
       with the fight. Step behind a rock and the rings go out -- which is the
       73% the stone takes off you, finally visible.
       AN ELLIPSE, NOT A CIRCLE (45 DEGREE ART LAW): the ground is seen at the
       world's three-quarter view, and this is squashed on the same axis and in
       the same proportion as the shadow already under his feet.
       BONE, deliberately: green is the peek wash, red is firing and the held
       bead, amber is the melee telegraph, blue is the way out, and PURPLE IS
       RESERVED FOR THE AMALGAMATION. */
    if(EYES_RING&&!e.dead&&!e.downed){ let _eyes=false;
      try{ _eyes=seesMe(e); }catch(_x){}
      if(_eyes){ x.save();
        /* STRONGER THAN THE FIRST WRITE, AND THE REASON IS THE SCREEN. At 0.55
           alpha and a hairline it was correct, squashed, in the right place --
           and at the zoom he actually plays, where a man is about eight pixels,
           it barely read at all. Same lesson as V170's smoke, which shipped too
           pale and had to be darkened after looking at it. A DARK SEAT UNDER THE
           BRIGHT LINE so it holds against light ground as well as asphalt. */
        x.beginPath(); x.ellipse(ex,ey+er*0.66,er*1.15,er*0.42,0,0,7);
        x.strokeStyle='rgba(24,20,16,0.55)'; x.lineWidth=Math.max(2,er*0.30); x.stroke();
        x.strokeStyle='rgba(240,232,208,0.95)'; x.lineWidth=Math.max(1,er*0.16); x.stroke();
        x.restore(); } }
    const _cov=false;   /* V18: the baked take-cover frames carry the crouch now */""",
        what='the ring')

    d = sub(d,
        "const SHOUT_TILES=8;   /* [DIAL] a man yells across a lot, not across the district */",
        """const EYES_RING=true;   /* [DIAL] V179: draw the ring under men who have eyes on you */
const SHOUT_TILES=8;   /* [DIAL] a man yells across a lot, not across the district */""",
        what='the dial')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v179: the eyes on you -- %d chars' % len(d))


if __name__ == '__main__':
    main()
