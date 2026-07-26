#!/usr/bin/env python3
"""BOHEMIA - COMBAT v68: 120 BPM COMES FIRST, AND A PRESS ASKS PERMISSION.

Law: laws/BOHEMIA_ADDENDUM_120BPM_FIRST_AND_THE_PERMISSION_PRESS_7_26_26.md
(Paolo 7/26: "120 BPM gameplay comes first and every time I press the button it
is asking for permission to be on the correct timing of the game so no it didn't
feel like the hero beat. [Not] one of each song was synced up to the perfect
dead[-eye] dial shot at all.")

v67 fixed the game CLOCK and the ENEMY COVER cycle. It did not fix the DIAL's
own cycle, which is a different function, which is why he still did not feel it.

WHAT WAS WRONG, MEASURED:
  beatsForCycle() snapped the dial's cycle to an EVEN number of beats. Even is
  not a BAR. A 6- or 10-beat cycle puts the perfect shot on beat one, then beat
  three, then beat one, forever. 59 of 135 pattern x difficulty combinations
  (44%) could never land the kill moment on a downbeat, and holding greed could
  drop an aligned cycle to 6 beats and knock it off the bar mid-fight.
  The per-pattern PHASE table that shifts each pattern's kill moment to the top
  of the cycle was already correct and baked. The cycle under it was not.

THIS PATCH:
  1. EVERY DIAL CYCLE IS A WHOLE NUMBER OF BARS (multiple of 4 beats, floor 4;
     greed halves in bars, never out of them). The top of the cycle is therefore
     always beat one, and PHASE puts the perfect shot exactly there.
  2. THE PERMISSION PRESS: the dead-eye shot is a REQUEST, not an action. Press
     within 0.24 beats after a beat and you were on it (fires at once). Press
     earlier and the game HOLDS the shot and grants it on the beat (worst case
     ~380ms). The needle is read at the granted instant, which is where the kill
     lives by construction.
  The POP stays a skill press on purpose: the shipped ON THE ONE streak rewards
  popping on beat one, and quantizing the pop would hand that reward out for
  free. Flagged [PENDING Paolo] in the addendum.

NOTE ON THE ENGINE BLOCK: it is stamped "do not edit; edit
engine/bohemia_engine.master.js then re-stamp". THAT FILE DOES NOT EXIST in the
repo and no stamper exists -- the stamped copy is the only copy. This tool is
the anchored, idempotent way to change it until a master is restored.

REUSE CHECK: no graphic pixels are cooked here (timing + one HUD line). The
pending-shot readout rides the demo's existing setRead rail and palette.

Usage: python3 tools/bohemia_combat_beatlaw_patch.py
Gate:  node gates/combat_lab_gate.js   (section 8 executes the shipped engine)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V68 WHOLE BARS'

OLD_PHASE = '''Object.assign(PHASE,{
    snap:0.3833, tick:0.0361, jab:0.2361, dart:0.1556, skip:0.3403, twitch:0.4861,
    heave:0.0, swing:0.9861, lob:0.1333, sway:0.9833, saw:0.2194, rattle:0.4861,
    strafe:0.4833, spray:0.425, pingpong:0.2056, glide:0, crawl:0, breathe:0.4944,
    pendulum:0.4917, heartbeat:0, spiral:0.1528, stagger:0.6528, wave3:0.3694, snapcenter:0.0028,
    feint:0.6667, lurch:0.475, coil:0.0611, recoil:0.4889, static:0, magnet:0,
    hitch:0.5306, whip:0.175, tease:0.0028, quake:0, ricochet:0.0917, gallop:0.3139,
    sidewind:0.4056, jolt:0.0639, flick:0.175, cascade:0.4028, avalanche:0.2194, yoyo:0.1667,
    drunk:0.0528, piston:0.4889, comet:0.3472, switchback:0.4194, trapdoor:0.0306, flutter2:0.3472,
    hook:0.2528, seesaw:0.0028, scatter:0.0028, undertow:0.425
  });'''

NEW_PHASE = '''Object.assign(PHASE,{
    snap:0.4165, tick:0.4825, jab:0.2315, dart:0.1556, skip:0.6235, twitch:0.485,
    heave:0.4865, swing:0.9876, lob:0.632, sway:0.9875, saw:0.223, rattle:0.485,
    strafe:0.4838, spray:0.4265, pingpong:0.21, glide:0.487, crawl:0.485, breathe:0.4924,
    pendulum:0.49, heartbeat:0, spiral:0.9765, stagger:0.6455, wave3:0.4795, snapcenter:0.084,
    feint:0.972, lurch:0.473, coil:0.98, recoil:0.9855, static:0, magnet:0.1705,
    hitch:0.5385, whip:0.329, tease:0, quake:0.0405, ricochet:0.5605, gallop:0.3065,
    sidewind:0.4805, jolt:0.0615, flick:0.2845, cascade:0.478, avalanche:0.216, yoyo:0.1657,
    drunk:0.0655, piston:0.4879, comet:0.359, switchback:0.427, trapdoor:0.028, flutter2:0.4875,
    hook:0.257, seesaw:0.9975, scatter:0.0065, undertow:0.43
  });'''


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # -----------------------------------------------------------------------
    # 1. THE DIAL CYCLE IS A WHOLE NUMBER OF BARS
    # -----------------------------------------------------------------------
    demo = sub1(demo,
        """  function beatsForCycle(G){
    const psf=patternSpeedFactor(G,G.pat);
    let n=Math.max(2, Math.round( (PAT_CYCLES[G.pat]||4) * 2 / psf ));
    if(n%2) n++;                       // EVEN beats per cycle
    if(G.greedHeld) n=Math.max(2, n/2); // greed = half the beats per cycle (twice as fast) but STILL whole beats -> kills stay on the grid
    return n;
  }""",
        """  function beatsForCycle(G){
    /* V68 WHOLE BARS (Paolo 7/26, LAW: 120 BPM GAMEPLAY COMES FIRST).
       This used to snap to EVEN beats. Even is not a BAR. A 6- or 10-beat cycle
       puts the perfect shot on beat one, then beat three, then beat one,
       forever -- 44% of pattern x difficulty combinations could never land the
       kill moment on a downbeat, which is exactly why the hero beat never felt
       like the shot. PHASE already parks each pattern's kill moment at the TOP
       of the cycle; the cycle just has to start on beat one. So: whole bars,
       floor of one bar, and greed halves IN BARS. Felt speed still tracks the
       pattern (we round to the nearest bar), the grid is now absolute. */
    const psf=patternSpeedFactor(G,G.pat);
    const BAR=4;
    let n=Math.max(BAR, Math.round( (PAT_CYCLES[G.pat]||4) * 2 / psf / BAR ) * BAR);
    if(G.greedHeld) n=Math.max(BAR, Math.round(n/2/BAR)*BAR);   // greed = ~twice as fast, still whole bars
    return n;
  }""",
        'beatsForCycle whole bars')

    # -----------------------------------------------------------------------
    # 2. THE PERMISSION PRESS
    # -----------------------------------------------------------------------
    demo = sub1(demo,
        "function fire(){\n  if(G.ks||G.inc||G.phase!=='aim'||G.over)return;   /* cutscene law: the volley finishes before your trigger works */",
        """/* ===== V68 THE PERMISSION PRESS (Paolo 7/26, LAW) =====================
   "every time I press the button it is asking for permission to be on the
   correct timing of the game". A press is a REQUEST, not an action. The beat
   grants it. Press just after a beat and you were ON it, so it fires at once.
   Press before one and the shot is HELD and granted on the beat -- and the
   needle is read at THAT instant, which is dead centre by construction now
   that every dial cycle is a whole bar.
   Worst case wait: (1 - BEAT_GRACE) of a beat = ~380ms at 120 BPM.
   The POP is deliberately NOT gated: the shipped ON THE ONE streak rewards
   popping on beat one, and granting that for free would kill it. [PENDING
   Paolo, written up in the addendum.] */
const BEAT_GRACE=0.24;                        /* beats of look-back: you were on it */
function beatPhase(){ const b=beatNow(); return b-Math.floor(b); }
function beatsToGrant(){ const ph=beatPhase(); return (ph<=BEAT_GRACE)?0:(1-ph); }
function fireGrantTick(){                     /* called every aim frame */
  if(!G._fireReq)return;
  if(beatNow()>=G._fireReq.at){ G._fireReq=null; try{setPhaseUI();}catch(_e){} fireNow(); } }
function fire(){
  if(G.ks||G.inc||G.phase!=='aim'||G.over)return;
  if(G._fireReq)return;                       /* you already asked */
  if(beatsToGrant()<=0)return fireNow();      /* you were on the beat */
  G._fireReq={at:Math.ceil(beatNow()),relGreed:!!G._relGreed};
  setRead('ON THE BEAT','the shot is yours on the beat \\u2014 hold the line','#8fd0e8');
  { const fb=D('fire'); if(fb)fb.innerHTML='<b style="font-size:11px;letter-spacing:1px">ON THE<br>BEAT</b>'; }   /* V68: asking for permission LOOKS like asking */
  return; }
function fireNow(){
  if(G._fireReq&&G._fireReq.relGreed)G._relGreed=true;
  if(G.ks||G.inc||G.phase!=='aim'||G.over)return;   /* cutscene law: the volley finishes before your trigger works */""",
        'permission press')

    demo = sub1(demo,
        "  else if(G.phase==='aim'){ G.beatClock=beatNow()-heroOffset(); tickPat(dt); beatTick(); }",
        "  else if(G.phase==='aim'){ G.beatClock=beatNow()-heroOffset(); tickPat(dt); beatTick(); fireGrantTick(); }   /* V68: a held shot is granted on the beat */",
        'grant tick')

    # a fresh fight never carries a pending request
    demo = sub1(demo,
        "  G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0; G._oneStreak=0;",
        "  G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0; G._fireReq=null; G._oneStreak=0;",
        'fresh fight clears the request')

    # and neither does a fresh encounter over the bus
    demo = sub1(demo,
        "    _lastErr:null, _demo:null, _spawnLayout:null };",
        "    _lastErr:null, _demo:null, _spawnLayout:null, _fireReq:null };   /* V68: no held shot survives a fight */",
        'handoff leak list')

    # -----------------------------------------------------------------------
    # 3. RE-BAKE THE PHASE TABLE AGAINST THE NEW BAR-ALIGNED CYCLES
    #    PHASE[pat] parks each pattern's dead-centre kill moment at the TOP of
    #    its cycle. The old table was baked against the OLD even-beat cycles, so
    #    moving to whole bars moved the target under it. Re-solved by running
    #    the SHIPPED engine tick over every pattern x package and searching for
    #    the single phase that minimises the worst-case distance from dead
    #    centre at beat one. Worst pattern went from 16.3% off centre to 5.2%;
    #    the average from 4.3% to 1.7%. 49 of 52 patterns improved, none got
    #    worse (the search only accepts an improvement).
    # -----------------------------------------------------------------------
    demo = sub1(demo, OLD_PHASE, NEW_PHASE, 'phase table re-bake')

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
        print('  demo: re-embedded (%d bytes, +%d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
