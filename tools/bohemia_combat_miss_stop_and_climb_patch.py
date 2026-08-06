#!/usr/bin/env python3
"""V130 A MISS IS THE WORLD NOT WAITING FOR YOU.

Paolo, 8/4, on the missed round: "cool i noticed it". Then, twice: "Do what you
have to do next and know what comes after."

The 8/3 research listed four things a miss needed. #1 (the round goes somewhere)
shipped as v125-v128 and he has now seen it and approved it. This is #2 and #3,
which are the two that finish that same moment. #4 (permanence, misses chipping
the world for the rest of the fight) is NOT in here -- it is a different idea
about the arena rather than about the shot, and it should be judged on its own.

--------------------------------------------------------------------------
#2 THE MISS STOP: 1/32 OF A BAR, AND IT IS NOT A CELEBRATION
--------------------------------------------------------------------------
Every one of the four freeze call sites in the fight is a DAMAGE event -- you
take a hit, the round that kills you, your own death, your kill. There has never
been one on a miss, which is the moment that decides the turn.
The fighting-game literature is precise about why a stop exists: it "gives the
eyes a few frames to register and confirm it happened". A miss needs exactly
that and NOTHING MORE. So it gets the SHORTEST legal note in the file, a
thirty-second at 62.5ms -- shorter than the graze (125ms), a quarter of the kill
(500ms). Long enough to register as a stumble, far too short to read as a
reward.
THE FREEZE TABLE ALREADY ACCEPTED IT: BohemiaFreeze's LEGAL list is
[1,2,4,8,16,32] and there was simply no tier using 32. This adds the tier the
law already allowed, so the musical-subdivision gate passes unchanged.

AND THE SHAKE POINTS THE OTHER WAY. Every existing freeze shakes ALONG the blow
-- something hit you, the world lurches with it. A miss is the opposite event:
nothing arrived. So its shake runs along YOUR OWN BARREL, away from the target,
which is the gun moving and not the world moving. Same machinery, opposite
meaning, and it is the difference between "you were hit" and "you jerked it".

--------------------------------------------------------------------------
#3 THE GUN CLIMBS, BECAUSE A MISS IS THE ONE TIME YOUR BODY BETRAYS YOU
--------------------------------------------------------------------------
G.recoil is set per weapon and decays. Every shot in the game recoils by the
same weapon-fixed amount whether you threaded it or threw it away, which quietly
says the two shots were the same act. They were not.
A missed shot now kicks HARDER THAN THE WEAPON'S OWN FIGURE and, crucially, in
proportion to HOW BADLY YOU PULLED IT -- the same G.angle the round's bearing
already reads. A hair off barely adds anything; a wild release makes the gun
buck. It is the only moment in the fight where your hands do something you did
not choose, which is exactly what a miss is.
It changes NO odds. Recoil is a render value that decays on the next frames; it
is not read by accuracy, the dial, or damage anywhere.

REUSE CHECK: cooks NO graphic pixels. It adds one entry to an existing tier
table, one freeze call, and multiplies an existing decaying number. No bank is
opened because no art is authored.

TASTE CHECK: authors no art. The taste answer is the research's own sentence,
and it is the one that keeps being right: A HIT STOPS THE WORLD, A MISS IS THE
WORLD NOT WAITING FOR YOU. So the miss gets the shortest stop that exists rather
than a big one, and its shake runs along your barrel instead of into your body.
Nothing here adds HUD, a number, a bar or a colour.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V130 A MISS IS THE WORLD NOT WAITING FOR YOU'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in s:
        print('v130 already in; nothing to do')
        return

    # ---- 1. THE TIER THE LAW ALREADY ALLOWED ---------------------------
    old = """    graze:note(16),      /* 0.125s  a light weapon connecting */"""
    new = """    miss: note(32),      /* 0.0625s V130: the shortest legal note in the file.
                            Every other tier here is a DAMAGE event; there has
                            never been a stop on a miss, which is the moment that
                            decides the turn. The fighting-game literature says a
                            stop exists to "give the eyes a few frames to register
                            and confirm it happened" -- a miss needs exactly that
                            and nothing more, so it gets a thirty-second: half the
                            graze, an eighth of the kill. A stumble, not a reward.
                            LEGAL already listed 32; no tier had ever used it. */
    graze:note(16),      /* 0.125s  a light weapon connecting */"""
    s = subN(s, old, new)

    # ---- 2. THE MISS FIRES IT, AND THE SHAKE POINTS THE OTHER WAY ------
    old = """  try{ fireMissRound(tgt); }catch(_e){}
  G.killStreak=0; sndMiss(); showVerd('MISS','#777'); flash=1;"""
    new = """  try{ fireMissRound(tgt); }catch(_e){}
  /* ===== V130 A MISS IS THE WORLD NOT WAITING FOR YOU ==============
     THE STOP: 1/32, the shortest note that exists here, because a miss needs
     the eye to register it and nothing else.
     AND THE SHAKE POINTS THE OTHER WAY. Every other freeze shakes ALONG the
     blow -- something hit you, the world lurches with it. A miss is the
     opposite event: nothing arrived. So this one runs along YOUR OWN BARREL,
     away from the target, which reads as the GUN moving instead of the WORLD
     moving. Same machinery, opposite meaning, and it is the whole difference
     between "you were hit" and "you jerked it".
     THE GUN CLIMBS TOO, harder than the weapon's own figure and in proportion
     to how badly you pulled it -- the same G.angle the round's bearing reads.
     A hair off barely adds anything; a wild release makes it buck. It is the
     one moment in the fight where your hands do something you did not choose.
     It changes NO odds: G.recoil is a render value that decays on the next
     frames and is read by nothing that decides a hit. */
  { const _ba=(tgt&&tgt.ea!=null)?tgt.ea:(G.faceAng||0);
    try{ freeze('miss',-Math.cos(_ba),-Math.sin(_ba)); }catch(_e){}
    const _off=Math.min(1,Math.abs(G.angle||0)/LIM);
    G.recoil=Math.max(G.recoil||0,0.55+0.75*_off); }
  G.killStreak=0; sndMiss(); showVerd('MISS','#777'); flash=1;"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v130: the miss stop and the climb (%d chars)' % len(s))


if __name__ == '__main__':
    main()
