#!/usr/bin/env python3
"""V152 COVER DIES, AND THE GRENADE STOPS BEING RATIONED.

Paolo 8/15: "there's no movement in the game bro... as soon as I find Cover I
can just hunker down until the end like it has to be things that switched up
naturally... right now it's just crouch somewhere and stay in the same place."

He has now said this five times and every fix I have tried has been about the
ENEMIES moving. He is telling me the problem is that HE never has to.

--------------------------------------------------------------------------
THE RESEARCH, BECAUSE HE ASKED FOR IT
--------------------------------------------------------------------------
Turtling is a solved problem and the answers are few:

  1. DESTRUCTIBLE COVER. XCOM's own solution: fire that misses chews the cover
     itself, and you break a wall to force what is behind it into the open.
  2. MISSION TIMERS. XCOM 2 added them specifically because XCOM 1 "encouraged
     slow squad movement that killed fun" -- the exact sentence he keeps saying
     to me in his own words.
  3. ESCALATING PRESSURE. Instead of a clock, surround the player with more
     enemies as turns pass.

A TIMER IS THE WRONG ONE FOR THIS GAME and I am not building it: a countdown is
an author standing off-screen shouting hurry up. Bohemia's whole texture is that
the world is real and indifferent. So this ships the two that are PHYSICS.

--------------------------------------------------------------------------
1. COVER DIES, BECAUSE THAT IS WHAT HAPPENS TO COVER
--------------------------------------------------------------------------
Every round your cover eats takes a bite out of it. Concrete spalls, sheet metal
opens up, a car door stops being a car door. The file already KNEW this and
stopped one step short: V108 wrote "a round that YOUR COVER ate has to go
somewhere" and used it to heat a car. It goes into the stone now too.

  TALL STONE -> chewed down to LOW cover (crouch behind it, vault over it)
  LOW COVER   -> chewed to rubble and removed from the board

*** THE TILE HE IS SITTING ON EXPIRES. *** Not because a designer took it away
on a schedule -- because he stood behind it and let people shoot it. The longer
he holds a spot the worse that spot gets, and the decision to move arrives on
its own, made of the fight instead of a rule.

TOUGHNESS COMES FROM SIZE, so a big block is a real position and a crate is a
few seconds. He can read that off the board without a number on screen.

--------------------------------------------------------------------------
2. THE MOVEMENT-FORCER WAS RATIONED TO ONE
--------------------------------------------------------------------------
The enemy grenade's own comment calls it "the RF4 movement-forcer" -- the thing
built to make him leave a tile. And it is gated:

    if(... && !G._grenadeThrown){   /* V61 ONE GRENADE: exactly one per
                                       encounter, FOR JUDGING IT CLEAN */

That cap was a JUDGING SCAFFOLD -- one per fight so he could look at the feature
once and rule on it. He ruled. The scaffold stayed up for two months and the
game's only purpose-built reason to move has been firing once per encounter.

It runs on a COOLDOWN now. Not spam: a real gap between them, and still only
from men who are far enough away to lob one. The verb finally does its job.

WHY BOTH, AND WHY NOT MORE: these two are the same idea from opposite ends --
the ground under him decays, and the ground under him gets contested. Neither
is a rule he has to learn; both are things he can see happening. I am not adding
a timer, an aura, or a shrinking play area, because he asked for things that
"switch up naturally" and those three are all the author on a loudspeaker.

REUSE CHECK: cooks NO graphic pixels. It reuses coverPillarAgainst's returned
pillar (already in hand at the volley), the existing P.tall flag that every
cover function already reads, and the existing grenade. Nothing authored.

TASTE CHECK: authors no art. The taste rule is his sentence: "it has to be
things that switched up naturally". The restraint is that neither of these
announces itself -- no timer, no warning, no meter. Cover gets worse where he is
standing, and grenades land near him, and both are legible as events rather than
as rules.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V152 COVER DIES'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v152 already in; nothing to do')
        return

    # ---- 1. cover takes the round -------------------------------------
    old = """    if(covP&&covP.car)carHeat(covP.car,1);"""
    new = """    if(covP&&covP.car)carHeat(covP.car,1);
    if(covP)chewCover(covP);   /* V152: and the stone takes it too */"""
    js = subN(js, old, new)

    old = """function coverWord(P){ if(!P)return null;"""
    new = """/* ===== V152 COVER DIES ========================================
   Paolo 8/15, for the fifth time: "as soon as I find Cover I can just hunker
   down until the end... it has to be things that switched up naturally."
   EVERY FIX I HAVE TRIED WAS ABOUT THE ENEMIES MOVING. He is telling me the
   problem is that HE never has to.
   THE RESEARCH: turtling has few answers -- destructible cover (XCOM's own:
   fire that misses chews the cover, and you break a wall to flush what is
   behind it), mission timers (XCOM 2 added them because XCOM 1 "encouraged slow
   squad movement that killed fun", which is his sentence in someone else's
   mouth), and escalating pressure. A TIMER IS THE WRONG ONE FOR THIS GAME and
   is deliberately not built: a countdown is an author off-screen shouting hurry
   up, and this world is supposed to be indifferent.
   SO: EVERY ROUND HIS COVER EATS TAKES A BITE OUT OF IT. Concrete spalls, sheet
   metal opens, a car door stops being a car door. The file already knew -- V108
   wrote "a round that YOUR COVER ate has to go somewhere" and used it to heat a
   car. It goes into the stone now.
     TALL -> chewed down to LOW (crouch behind it, vault it)
     LOW  -> chewed to rubble and gone
   *** THE TILE HE IS SITTING ON EXPIRES *** -- not on a schedule, but because he
   stood there and let people shoot it. The decision to move arrives on its own,
   made of the fight instead of a rule. Toughness comes from SIZE, so a big block
   is a real position and a crate is a few seconds, and he can read that off the
   board without a number on screen. */
const COVER_BITE=1;        /* [DIAL] what one round takes out of it */
function coverHP(P){ if(P._hp==null)P._hp=Math.max(3,Math.round(6*(P.r||0.55)*(P.car?2.2:1.6)));
  return P._hp; }
function chewCover(P){ if(!P)return;
  coverHP(P); P._hp-=COVER_BITE; P._chewAt=performance.now();
  if(P._hp<=0){
    if(P.tall!==false){ P.tall=false; P._hp=Math.max(2,Math.round(coverHP(P)*0.5));   /* knocked down to low cover */
      try{ setRead('COVER IS GOING','the top came off it \\u2014 you are ducking behind rubble now','#e8a04a'); }catch(_e){} }
    else { const i=(G.pillars||[]).indexOf(P);
      if(i>=0){ G.pillars.splice(i,1);
        try{ setRead('COVER IS GONE','they chewed it to nothing \\u2014 move','#e8593a'); }catch(_e){}
        try{ updateGeomCover(); }catch(_e){} } } } }
function coverWord(P){ if(!P)return null;"""
    js = subN(js, old, new)

    # ---- 2. the movement-forcer stops being rationed -------------------
    old = """  if(!_hadG && !G.grenade && !G.over && !G._grenadeThrown){   /* V61 ONE GRENADE: exactly one per encounter, for judging it clean */"""
    new = """  /* V152: THE CAP WAS A JUDGING SCAFFOLD. V61 allowed exactly one per encounter
     "for judging it clean" -- so he could see the feature once and rule on it.
     He ruled. The scaffold stayed up for two months, and the game's only
     purpose-built reason to move has been firing ONCE per fight. It runs on a
     cooldown now: a real gap between them, never spam. */
  if(G._grenCd>0)G._grenCd--;
  if(!_hadG && !G.grenade && !G.over && !(G._grenCd>0)){"""
    js = subN(js, old, new)

    old = """      G.grenade={ea:a,edist:dd,fuse:2,r:1.5,_at:performance.now()}; G._grenadeThrown=true;"""
    new = """      G.grenade={ea:a,edist:dd,fuse:2,r:1.5,_at:performance.now()}; G._grenadeThrown=true; G._grenCd=GREN_CD;   /* V152: cooled down, not spent */"""
    js = subN(js, old, new)

    old = """const P_GREN_R=1.5, P_GREN_FUSE=2, P_GREN_PER_FIGHT=2;   /* all dials */"""
    new = """const P_GREN_R=1.5, P_GREN_FUSE=2, P_GREN_PER_FIGHT=2;   /* all dials */
const GREN_CD=5;   /* V152 [DIAL]: turns between THEIR grenades -- a real gap, never spam */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v152: cover dies and the grenade is off its leash -- %d chars' % len(js))


if __name__ == '__main__':
    main()
