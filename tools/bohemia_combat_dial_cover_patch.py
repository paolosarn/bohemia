#!/usr/bin/env python3
"""BOHEMIA - COMBAT v102: THE NEEDLE IS HIS BODY.

Paolo 7/29: "when the deadshot dial is on someone and they have cover. i want
their cover animation to be tied to where there deadshot dial lands perfectly in
the center. so that killshot they better be out of cover. and when its in miss
territory they are under cover if that makes sense! i still like how they animate
already just keep in mind when its deadshot dial time i want them to pop out when
its supposed to be the killshot type shit."

--- WHY THIS IS THE BEST IDEA IN THE MESSAGE -----------------------------
Today the dial is an abstraction sitting ON TOP of the fight. The needle sweeps,
you press, a number decides. The man you are shooting is doing his own thing on
his own timer and the two have nothing to do with each other.

Tying his body to the needle makes the dial A PICTURE OF THE TRUTH: the needle is
not a skill check drawn over him, it IS how exposed he is right now. So the
player stops reading a gauge and starts reading a man, which is the whole
difference between a minigame and a fight.

--- THE MAPPING, AND IT IS EXACT ----------------------------------------
*** HE IS OUT OF COVER EXACTLY WHEN THE RETICLE GOES GREEN. ***

That is not an approximation chosen to feel right, it is the same expression:

    if(!G.ks&&Math.abs(G.angle)<=G.W.hZ*fgv*KILL_GRACE*ARC_MULT){ retCol=GREEN }

has been the live kill-zone test since the dial shipped. v102 reads that same
zone. So the invariant a player can learn and trust is:

    RETICLE GREEN  <=>  HE IS UP, OUT OF THE STONE, killable
    MISS TERRITORY <=>  HE IS TUCKED, behind it

and between them he is on the way up. Which is exactly what he described.

--- AND THE NEEDLE SCRUBS AN ANIMATION THAT ALREADY EXISTS ---------------
Every enemy look already bakes `rise112`: the clip of a body coming UP OUT OF THE
CROUCH. It is already used when a man gets off the deck (`e._roseAt`).

So there is nothing to animate. The needle INDEXES that clip. Frame 0 at the far
edge of miss territory, last frame at dead centre. His cover animation is
literally tied to where the dial lands, which is the sentence he wrote.

He also said "i still like how they animate already" -- so nothing else changed.
This branch only fires for THE ONE MAN being aimed at, only while the dial is
live, and only if he is actually in cover. Every other body animates exactly as
it did.

--- THE BODY LAGS THE NEEDLE, ON PURPOSE --------------------------------
The needle sweeps fast and reverses. Mirroring it frame-for-frame would make him
vibrate. So exposure FOLLOWS the needle with a short lag (EXPO_FOLLOW, settling
in about a fifth of a second) instead of tracking it exactly.

That is the hysteresis, and it is also better fiction: a man reacting to your
aim is half a beat behind it, because he is a man. Nobody snaps.

--- IT IS A READ, NOT A RULE CHANGE -------------------------------------
Same contract the under-deck x-ray shipped under. This changes WHICH FRAME IS
DRAWN and nothing else. `e.gcov` is untouched, so cover, damage, exposure and
every AI decision resolve exactly as before. If it changed who could be hit it
would be a second, invisible difficulty system, and the whole point is that the
picture finally agrees with the maths that were always there.

--- THE BAND EXPRESSION IS NOW DEFINED ONCE ------------------------------
The multiplier the bands are drawn with was an inline const, which the pose would
have had to COPY. It is now dialFgv(), defined once and called by both, so his
body can never drift from the band you are aiming at. A read computed from a
second copy of an expression is the bug this gate already warns about.

TO BE PRECISE, because the first draft of this said "one expression, not two" and
that was wrong: there have always been TWO different multipliers in this file and
only one of them is unified here.
    fgv = what the BANDS DRAW      (difficulty, steady aim, kill streak)
    fg  = what the SHOT RESOLVES ON (all of that PLUS the on-the-one bonus and
          the groove width) -- deliberately MORE than the band shows you
That is a designed difference, not drift, and it stays.

REUSE CHECK: no art or audio is cooked, read or written. NOTHING IS ANIMATED.
This selects among frames that are already baked (rise112, cfire112, cover112)
using a value the dial already computes. It touches no rig, no clip, no BAKED
pose and no bank, which also keeps it clear of the animation revamp running in
another session.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_dial_cover_patch.py
Gate:  node gates/combat_lab_gate.js   (section 36)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V102 THE NEEDLE IS HIS BODY'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # ---- one expression, shared by the band and the body -------------------
    demo = subN(demo,
        "function enemyFrame(e,now){",
        "/* ===== V102 THE NEEDLE IS HIS BODY ================================\n"
        "   Paolo: \"i want their cover animation to be tied to where there deadshot dial\n"
        "   lands perfectly in the center. so that killshot they better be out of cover.\n"
        "   and when its in miss territory they are under cover.\"\n"
        "   The dial used to be an abstraction sitting ON TOP of the fight: the needle\n"
        "   swept, you pressed, a number decided, and the man was doing his own thing on\n"
        "   his own timer. Now the needle IS how exposed he is, so you stop reading a\n"
        "   gauge and start reading a man.\n"
        "   *** HE IS OUT EXACTLY WHEN THE RETICLE GOES GREEN. *** Not an approximation\n"
        "   picked to feel right -- the same expression that has driven the green reticle\n"
        "   since the dial shipped. One invariant a player can learn and trust. */\n"
        "/* ONE EXPRESSION, NOT TWO: the bands' forgiveness multiplier was an inline\n"
        "   const. Defined once here and called by both the band draw and the pose, so\n"
        "   the body can never drift from the band you are aiming at. */\n"
        "function dialFgv(){ return (G.pkgDiff>=1?1.10:1)*(G.pkgDiff===4?1.10:G.pkgDiff===3?1.05:1)*(1+((G._steadyAtPop||0)*0.05))*(1+Math.min(0.15,(JUICE.AW?(G.killStreak||0):0)*0.03)); }\n"
        "function dialKillZone(){ return G.W.hZ*dialFgv()*KILL_GRACE*ARC_MULT; }\n"
        "function dialHitZone(){ return G.W.hitZ*dialFgv()*ARC_MULT; }\n"
        "function dialLive(){ return G.phase==='aim' && !G.ks && (G.fireTarget!=null&&G.fireTarget>=0); }\n"
        "/* 1 at dead centre (killable, out of the stone), 0 out in miss territory\n"
        "   (tucked), and the climb between them is him coming up. */\n"
        "function dialExposure(){ if(!dialLive())return null;\n"
        "  const h=dialHitZone(); if(!(h>0))return null;\n"
        "  const k=dialKillZone();\n"
        "  const a=Math.abs(G.angle||0);\n"
        "  if(a<=k)return 1;\n"
        "  if(a>=h)return 0;\n"
        "  return Math.max(0,Math.min(1,1-(a-k)/Math.max(1e-6,h-k))); }\n"
        "/* THE BODY LAGS THE NEEDLE ON PURPOSE. It sweeps fast and reverses; mirroring\n"
        "   it frame for frame would make him vibrate. A man reacting to your aim is half\n"
        "   a beat behind it, because he is a man. */\n"
        "const EXPO_FOLLOW=0.18;\n"
        "function enemyFrame(e,now){",
        'the dial exposure, from the same expression the reticle uses')

    # ---- the band draw now calls the shared one ----------------------------
    demo = subN(demo,
        "  const fgv=(G.pkgDiff>=1?1.10:1)*(G.pkgDiff===4?1.10:G.pkgDiff===3?1.05:1)*(1+((G._steadyAtPop||0)*0.05))*(1+Math.min(0.15,(JUICE.AW?(G.killStreak||0):0)*0.03));   // bands SHOW the true forgiven window (high-tier forgiveness + JUICE.L steady)",
        "  const fgv=dialFgv();   // V102: ONE expression, shared with the pose, so the body can never drift from the band you are aiming at   // bands SHOW the true forgiven window (high-tier forgiveness + JUICE.L steady)",
        'the band draw uses the shared expression')

    # ---- and the needle scrubs his rise clip -------------------------------
    demo = subN(demo,
        "  if(firing(e)&&e.gcov&&L.cfire112)return L.cfire112[Math.floor((JUICE.A?_bpmClock:now)/250)%4];   /* covered gun up = peek-and-snap, never a stand */",
        "  /* V102: THE ONE MAN UNDER THE DIAL WEARS THE NEEDLE.\n"
        "     rise112 is already baked -- it is the clip of a body coming UP OUT OF THE\n"
        "     CROUCH, already used when a man gets off the deck. So nothing is animated\n"
        "     here: the needle INDEXES it. Frame 0 out in miss territory, last frame at\n"
        "     dead centre. His cover animation is tied to where the dial lands, which is\n"
        "     the sentence he wrote.\n"
        "     ONLY the aim target, ONLY while the dial is live, ONLY if he is really in\n"
        "     cover -- \"i still like how they animate already\", so every other body is\n"
        "     untouched.\n"
        "     AND IT IS A READ, NOT A RULE CHANGE: e.gcov is not written here, so cover,\n"
        "     damage, exposure and every AI decision resolve exactly as before. */\n"
        "  if(e.gcov&&dialLive()&&e===G.e[G.fireTarget]){\n"
        "    const _xt=dialExposure();\n"
        "    if(_xt!=null){\n"
        "      e._expo=(e._expo==null)?_xt:(e._expo+(_xt-e._expo)*EXPO_FOLLOW);\n"
        "      const R=L.rise112;\n"
        "      if(R&&R.length)return R[Math.max(0,Math.min(R.length-1,Math.round(e._expo*(R.length-1))))];\n"
        "      if(e._expo>0.5&&L.cfire112)return L.cfire112[0];\n"
        "      if(L.cover112&&L.cover112.length)return L.cover112[0]; } }\n"
        "  if(firing(e)&&e.gcov&&L.cfire112)return L.cfire112[Math.floor((JUICE.A?_bpmClock:now)/250)%4];   /* covered gun up = peek-and-snap, never a stand */",
        'the needle scrubs his rise clip')

    # ---- a fresh dial is a fresh body --------------------------------------
    # ANCHOR UNIQUENESS IS NOT ANCHOR CORRECTNESS: the line below is the FIRST HALF
    # of an if/else. Inserting after it orphans the else and breaks the whole demo,
    # which is exactly what the first version of this patch did. It goes BEFORE.
    demo = subN(demo,
        "  if(!isChain){G._chainN=1;G._poppedOut=false;}   /* V23: track whether this turn ever left the stone */",
        "  /* V102: a new dial starts him TUCKED, never mid-rise from the last one */\n"
        "  for(const _e of (G.e||[]))_e._expo=null;\n"
        "  if(!isChain){G._chainN=1;G._poppedOut=false;}   /* V23: track whether this turn ever left the stone */",
        'a fresh dial starts him tucked')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
