#!/usr/bin/env python3
"""
V183 NOBODY RUNS FROM YOU YET -- his 8/26 ruling, from actually playing it.

  PAOLO 8/26, playing: "I don't wanna see anyone run away anymore unless I have a
  perk that allows them to start running away. And by default, I don't want that
  on. It's obviously gonna... it cannot be just, like, the default for a new new
  player. Right? YOU'RE NOT SCARY ENOUGH. I don't know why so many people are
  running away."

*** THE FICTION IS THE MECHANIC AND HE HANDED BOTH OVER IN ONE SENTENCE. *** A man
who has just started does not frighten anybody. Nobody breaks and runs from a
nobody. Being the kind of person people run from is something you BECOME, so it
belongs in the perk tree he ruled on in the same conversation -- and it is the
best possible first entry in that tree, because it changes how every fight in the
game reads without touching a single damage number.

WHAT WAS ACTUALLY HAPPENING, and it explains "so many people": V35's nerve check
fires the moment HALF the room is down, then rolls for EVERY man still standing,
every turn, at 10% plus 5% for each body past halfway. In a five-man fight that is
four men rolling every turn from the third body onward. It compounds, so the back
half of nearly every fight was a rout. He was not seeing a rare event; he was
seeing the design.

WHAT SHIPS: the whole nerve check is gated behind FEAR_ON, which is FALSE. Nobody
flees, nobody surrenders, nobody breaks -- they fight until they are down. The
perk turns it on, and until that perk exists nothing turns it on, which is exactly
what he asked for.

*** V35 IS NOT DELETED AND THAT IS DELIBERATE. *** He did not say the mechanic is
wrong, he said it is not EARNED YET. It stays whole, gated, ready for the tree.
THE GRAVEYARD IS FOR DEAD THINGS; this one is asleep.

MECHANISM MINE, CONTENTS HIS: the switch and the flag are mine. The perk's NAME,
where it sits in the tree and what it costs are his.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy, hp or armour number moves.
It is one boolean in front of a behaviour check.

REUSE CHECK: cooks no graphic pixels, opens no bank, adds no drawing. It reads
G.perks, the shape the tree will fill.

TASTE CHECK: nothing new on screen. What changes is what he STOPS seeing.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V183 NOBODY RUNS FROM YOU YET'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:160]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v183: already applied')
        return

    d = sub(d,
        "const PP_MAX=20;",
        """/* ===== V183 NOBODY RUNS FROM YOU YET ===============================
   Paolo 8/26, playing it: "I don't wanna see anyone run away anymore unless I
   have a perk that allows them to start running away. And by default, I don't
   want that on... YOU'RE NOT SCARY ENOUGH. I don't know why so many people are
   running away."
   THE FICTION IS THE MECHANIC. A man who has just started does not frighten
   anybody, so nobody breaks and runs from him. Being someone people run from is
   a thing you BECOME -- which puts it in the perk tree he ruled on in the same
   conversation, and makes it the best first entry in that tree, because it
   changes how every fight reads without touching one damage number.
   AND "SO MANY PEOPLE" WAS THE DESIGN, NOT BAD LUCK: V35's check fires the
   moment HALF the room is down and then rolls for EVERY man still standing,
   EVERY TURN, at 10% plus 5% per body past halfway. In a five-man fight that is
   four men rolling every turn from the third body on. The back half of nearly
   every fight was a rout.
   V35 IS GATED, NOT DELETED. He did not say it is wrong, he said it is NOT
   EARNED YET. The graveyard is for dead things; this one is asleep. */
const FEAR_ON=false;   /* [DIAL] until the perk exists, nothing switches this on -- which is the ruling */
function theyFearYou(){
  if(FEAR_ON)return true;
  try{ return !!(G.perks&&G.perks.fear); }catch(_e){ return false; } }
const PP_MAX=20;""",
        what='FEAR_ON')

    d = sub(d,
        "    if(_down>=_half && _down>(G._nerveLastDown||0))for(const e of G.e){",
        "    if(theyFearYou() && _down>=_half && _down>(G._nerveLastDown||0))for(const e of G.e){   /* V183: nobody runs from a nobody */",
        what='nerve gate')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v183: nobody runs from you yet -- %d chars' % len(d))


if __name__ == '__main__':
    main()
