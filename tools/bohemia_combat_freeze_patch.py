#!/usr/bin/env python3
"""BOHEMIA - COMBAT v81: THE QUANTIZED FREEZE. Every stop is a NOTE VALUE.

Paolo: "Lets freeze the game for that snappy satisfying feelings then."

GO on the top juice item from the research
(records/BOHEMIA_COMBAT_RESEARCH_JUICE_VERTICALITY_COMPANIONS_7_26_26.md item 1).

--- WHAT WAS ALREADY THERE, AND WHY IT WAS NOT IT ---------------------------
A hit-stop already existed (JUICE.F, `G._hitstop`) and it was counted in FRAMES:
2, 3, 4, 6, 7, 10 and 14 across seven call sites. Two things were wrong with it,
and the second one is a real bug:

  1. THE DURATIONS WERE ARBITRARY. 7 frames is not a musical length. In a game
     where EVERYTHING quantizes to the beat (120 BPM LAW), the one moment that is
     supposed to feel most deliberate was landing wherever it landed.

  2. IT WAS FRAME-COUNTED, SO IT WAS FRAMERATE-DEPENDENT. 10 frames is 167ms on a
     60Hz screen and 83ms on a 120Hz phone. The freeze was literally HALF AS LONG
     on a newer iPhone, and nobody could have known by reading the code. Every
     stop in the game was a different length depending on the hardware.

--- THE FIX: NOTE VALUES, MEASURED IN SECONDS ------------------------------
Vlambeer's Art of Screenshake -- the canonical juice talk -- freezes the world
for about 0.2 seconds on every hit and calls it barely visible and completely
transformative. That number is arbitrary because in most games it can be. Bohemia
is the one game where it cannot, and that is not a constraint, it is the whole
opportunity:

    1/16 note   0.125s    GRAZE      a light weapon connecting
    1/8  note   0.250s    HIT        a heavy weapon, taking a hit
    1/4  note   0.500s    KILL       one WHOLE BEAT, the world stops dead
    1/2  note   1.000s    LAST       the last man down, the room holds

Every one of those is derived from BEAT (0.5s at 120 BPM), never typed. The
freeze stops fighting the clock and becomes it: the music keeps running
underneath (the audio clock already advanced before the freeze is applied, so the
dial can never drift), and everything drops back in exactly on the grid.

A KILLSHOT IS NOW A REST IN THE MUSIC. That is the thing no other game can do.

PULLED BACK FROM THE RESEARCH ON PURPOSE: the doc proposed a FULL BAR (2.0s) when
the last man drops. Built as a 1/2 note instead -- two seconds of frozen world is
too long to sit through on a phone, and I would rather ship the version that
feels good than the version that matched my own document. It is one constant
(TIERS.last) if he wants the bar.

--- AND THE SHAKE DECAYS INSIDE THE FREEZE --------------------------------
The game-feel literature is specific: screen shake should run along the AXIS of
the hit with a rapid exponential decay so readability comes straight back. Added
as a directional shake whose duration IS the freeze duration, so it always
finishes before the next beat and never smears into the next action.

REUSE CHECK: no art or audio assets are cooked, read or written. This replaces a
frame counter with a seconds clock and adds a camera offset. His songs are
untouched (song_lock_gate proves it every run) and no note, voice or pattern is
edited.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_freeze_patch.py
Gate:  node gates/combat_lab_gate.js   (section 17 executes every tier)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V81 THE QUANTIZED FREEZE'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


CORE = r"""/* ===== V81 THE QUANTIZED FREEZE (pure, gate-simmed) =====================
   Paolo: "Lets freeze the game for that snappy satisfying feelings then."
   THE PROBLEM WITH WHAT WAS THERE: the old hit-stop counted FRAMES (2/3/4/6/7/
   10/14 across seven call sites). Two defects. The durations were arbitrary, in
   a game where the 120 BPM LAW quantizes everything else. And frame counting is
   FRAMERATE-DEPENDENT -- 10 frames is 167ms at 60Hz and 83ms at 120Hz, so every
   freeze in the game was half as long on a newer phone and nothing said so.
   THE RULE: EVERY FREEZE IS A NOTE VALUE, in seconds, derived from the beat.
   The music keeps running underneath (the audio clock advances BEFORE the freeze
   is applied, so the dial cannot drift), so the world stops and drops back in
   exactly on the grid -- A KILLSHOT IS A REST IN THE MUSIC. */
var BohemiaFreeze=(function(){
  var BPM=120, BEAT=60/BPM;                    /* 0.5s -- the 120 BPM law */
  function note(d){ return BEAT*(4/d); }       /* d = denominator: 4=beat, 8=eighth... */
  var TIERS={
    graze:note(16),      /* 0.125s  a light weapon connecting */
    hit:  note(8),       /* 0.250s  a heavy weapon, or taking one */
    kill: note(4),       /* 0.500s  ONE WHOLE BEAT -- the world stops dead */
    last: note(2)        /* 1.000s  the last man down, the room holds */
  };
  /* PULLED BACK FROM THE RESEARCH DOC ON PURPOSE: it proposed a full BAR (2.0s)
     for the last man. Two seconds of frozen world is too long on a phone. One
     constant if Paolo wants the bar. */
  var WPN={pistol:'graze', smg:'graze', rifle:'hit', shotgun:'hit'};   /* scale the stop to the weapon */
  function secs(tier){ var s=TIERS[tier]; return (s===undefined)?0:s; }
  function forWeapon(w){ return secs(WPN[w]||'graze'); }
  /* THE INVARIANT THE GATE ENFORCES: a duration is legal only if it is a REAL
     musical subdivision -- a whole note, half, quarter, eighth, sixteenth or
     thirty-second. Not merely "some integer fraction", which would let 1/60 of a
     bar through and is exactly how the frame-counted version got here. */
  var LEGAL=[1,2,4,8,16,32];
  function denom(sec){ return 4/(sec/BEAT); }
  function isNote(sec){ if(!(sec>0))return false; var d=denom(sec);
    for(var i=0;i<LEGAL.length;i++)if(Math.abs(d-LEGAL[i])<1e-9)return true; return false; }
  function noteName(sec){ return isNote(sec)?('1/'+Math.round(denom(sec))):null; }
  return { BEAT:BEAT, TIERS:TIERS, WPN:WPN, LEGAL:LEGAL, note:note, secs:secs,
           forWeapon:forWeapon, isNote:isNote, noteName:noteName, denom:denom }; })();
if(typeof module!=='undefined'&&module.exports)module.exports=BohemiaFreeze;
/* ===== V81 FREEZE CORE END ===== */
/* THE ONE PLACE A FREEZE IS ARMED. dir is the screen-space axis of the hit, so
   the shake runs ALONG the blow and decays INSIDE the freeze -- readability is
   always back before the next beat (the game-feel literature's rule). */
function freeze(tier,dirX,dirY){
  const s=BohemiaFreeze.secs(tier); if(!(s>0))return 0;
  G._freezeT=Math.max(G._freezeT||0,s);
  G._freezeTier=tier;
  if(JUICE.F===false){ G._freezeT=0; return 0; }
  const m=(tier==='kill'||tier==='last')?5.5:(tier==='hit'?3.2:1.8);
  G._shk={x:(dirX||0),y:(dirY||0),mag:m,t:0,dur:s};
  if(!(G._shk.x||G._shk.y)){ G._shk.x=0.6; G._shk.y=-1; }   /* no axis given: a short vertical thud */
  return s; }
"""


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    demo = sub1(demo, 'function hurtFlash(){', CORE + 'function hurtFlash(){', 'freeze core')

    # THE LOOP: seconds, not frames. The audio clock has already advanced above.
    demo = sub1(demo,
        "  /* JUICE.F HIT-STOP: the sim freezes for the stamped frames; the music\n"
        "     clock above already advanced so the beat NEVER drifts. */\n"
        "  if(G._hitstop>0){G._hitstop--;dt=0;}",
        "  /* V81 THE QUANTIZED FREEZE: the sim freezes for a NOTE VALUE, in SECONDS.\n"
        "     The music clock above already advanced, so the beat can never drift and\n"
        "     the world drops back in exactly on the grid. Counting FRAMES here was\n"
        "     framerate-dependent: the same stop ran half as long on a 120Hz phone. */\n"
        "  if(G._freezeT>0){ G._freezeT=Math.max(0,G._freezeT-dt); if(G._shk)G._shk.t+=dt; dt=0; }\n"
        "  else if(G._shk){ G._shk=null; }",
        'loop freeze')

    # every call site becomes a NAMED TIER. No bare numbers left anywhere.
    demo = sub1(demo,
        "  G._redPunch=1; G._hitstop=Math.max(G._hitstop,7);   /* Paolo 7/3/26: when I get hit the whole fucking world stops. 7 frames vs 3 on kills. */",
        "  G._redPunch=1; freeze('hit',-1,0.35);   /* V81: an eighth note. Paolo 7/3/26 \"when I get hit the whole fucking world stops\" -- it was 7 frames, i.e. 117ms at 60Hz and 58ms at 120Hz */",
        'felt hit')

    demo = sub1(demo,
        "      if(inc.lethal&&i===inc.fireAt.length-1){ G._hitstop=14; G._redPunch=1.5;",
        "      if(inc.lethal&&i===inc.fireAt.length-1){ freeze('kill',-1,0.5); G._redPunch=1.5;   /* V81: the bullet that kills you gets a WHOLE BEAT */",
        'lethal incoming')

    demo = sub1(demo,
        "  G._hitstop=Math.max(G._hitstop||0,10);   /* V31: the death blow lands with weight — the world catches for a beat */",
        "  freeze(checkClearSoon()?'last':'kill', 0, -1);   /* V81: the death blow gets a WHOLE BEAT, and the LAST man gets two -- the room holds */",
        'finish him')

    demo = sub1(demo,
        "  G._hitstop=Math.max(G._hitstop,14); G._redPunch=Math.max(G._redPunch,1.5);",
        "  freeze('last',0,-1); G._redPunch=Math.max(G._redPunch,1.5);   /* V81: your own death holds for two beats */",
        'lose game')

    demo = sub1(demo,
        "      const _wpnStop={pistol:3,smg:2,rifle:4,shotgun:6}[WEAPON]||3;\n"
        "      if(JUICE.F)G._hitstop=_wpnStop;",
        "      /* V81: the stop is scaled to the weapon (the literature's rule) but every\n"
        "         value is a NOTE VALUE -- light guns a sixteenth, heavy guns an eighth. */\n"
        "      if(JUICE.F){ const _ax=Math.cos(ang), _ay=Math.sin(ang);\n"
        "        freeze(BohemiaFreeze.WPN[WEAPON]||'graze',_ax,_ay); }",
        'shot contact')

    demo = sub1(demo,
        "    setTimeout(()=>{G._hitstop=10;},380); }",
        "    setTimeout(()=>{freeze('kill',1,-0.4);},380); }   /* V81 */",
        'demo F')

    demo = sub1(demo,
        "  if(G._hitstop>0&&G._demo&&G._demo.k==='F'){",
        "  if(G._freezeT>0&&G._demo&&G._demo.k==='F'){",
        'demo overlay read')

    # the demo overlay should say WHICH note value is on screen, not just FROZEN
    demo = sub1(demo,
        "    ctx.textAlign='center';ctx.fillText('FROZEN',W/2,H*0.5);ctx.textAlign='left'; }",
        "    ctx.textAlign='center';\n"
        "    ctx.fillText('FROZEN '+(BohemiaFreeze.noteName(BohemiaFreeze.secs(G._freezeTier||'kill'))||'')+' NOTE',W/2,H*0.5);\n"
        "    ctx.textAlign='left'; }",
        'demo overlay text')

    # THE SHAKE, applied on the camera transform, decaying inside the freeze
    demo = sub1(demo,
        "  ctx.translate(W/2,H/2);\n"
        "  ctx.scale(cam.zoom,cam.zoom);\n"
        "  ctx.translate(-cam.x,-cam.y);",
        "  /* V81 DIRECTIONAL SHAKE: along the AXIS of the hit, decaying EXPONENTIALLY\n"
        "     so readability is back before the next beat, and its duration IS the\n"
        "     freeze duration so it can never smear into the next action. */\n"
        "  let _shx=0,_shy=0;\n"
        "  if(G._shk&&G._shk.dur>0){ const k=1-Math.min(1,G._shk.t/G._shk.dur);\n"
        "    if(k<=0){ G._shk=null; } else { const a=G._shk.mag*k*k*S;\n"
        "      const w=Math.sin(G._shk.t*140);\n"
        "      const L=Math.hypot(G._shk.x,G._shk.y)||1;\n"
        "      _shx=(G._shk.x/L)*a*w; _shy=(G._shk.y/L)*a*w; } }\n"
        "  ctx.translate(W/2+_shx,H/2+_shy);\n"
        "  ctx.scale(cam.zoom,cam.zoom);\n"
        "  ctx.translate(-cam.x,-cam.y);",
        'directional shake')

    # a helper so finishHim can tell if this is the LAST man before it resolves
    demo = sub1(demo,
        "function finishHim(t){ /* V30: the death blow — yours to give or withhold */",
        "/* V81: is this the last one standing? finishHim needs to know BEFORE it\n"
        "   resolves, so the room can hold for two beats on the final body. */\n"
        "function checkClearSoon(){ try{ return aliveEnemies().length<=1; }catch(_e){ return false; } }\n"
        "function finishHim(t){ /* V30: the death blow — yours to give or withhold */",
        'last-man helper')

    # state init: the seconds clock replaces the frame counter
    demo = sub1(demo,
        "G._fx=[];G._hitstop=0;",
        "G._fx=[];G._hitstop=0;G._freezeT=0;G._shk=null;   /* V81: _freezeT is SECONDS; _hitstop is dead */",
        'init state')

    demo = sub1(demo,
        "    recoil:0, wound:0, woundShake:0, breathT:0, _hitstop:0, _redPunch:0, _vShakeAt:0,",
        "    recoil:0, wound:0, woundShake:0, breathT:0, _hitstop:0, _freezeT:0, _shk:null, _redPunch:0, _vShakeAt:0,   /* V81 */",
        'fresh fight state')

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
