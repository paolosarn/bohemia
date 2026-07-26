#!/usr/bin/env python3
"""BOHEMIA - COMBAT v74: THE GROOVE CHAIN + ON-BEAT MOVEMENT IS FREE.

Paolo: "think of more ways to make combat more fun, looking into Rogue Fable IV
for big brain research. I need you to take big swings to make combat more fun,
more punchy, more feeling like a rhythm based game."

RESEARCH, and what it says Bohemia is missing:

  ROGUE FABLE IV (its own design pages + devlog): "your skill as a player is
  vastly more important than your character's raw stats", and movement is the
  game -- "you should be in a state of near constant motion", dodging,
  sidestepping, running circles, diving into the back line. Combat is ability
  driven with a deliberate mix of passive / active / cooldown / charged verbs.
  -> Bohemia's fight now has free, safe movement (v73) but NO REWARD for moving
     well. Motion is permitted, not encouraged.

  CRYPT OF THE NECRODANCER (the Groove Chain): every kill landed without missing
  a beat compounds a multiplier; it resets the moment you miss a beat OR take
  damage, and the indicator goes RED at max. That one loop is what makes a
  rhythm game feel like a rhythm game -- not that the game is on a grid, but
  that STAYING on the grid pays and falling off it costs.
  -> Bohemia graded your press (v69) and then did nothing with the grade. A
     grade with no stake is a scoreboard, not a mechanic.

TWO BIG SWINGS:

1. THE GROOVE CHAIN. Every on-beat action compounds. x1 -> x2 at 2 -> x3 at 5
   -> x4 at 9, and the chain BREAKS on an off-beat press or the moment you take
   a hit. What the chain buys is real, not cosmetic:
     - THE DIAL WIDENS 10% per level (up to +30%): playing in the pocket makes
       the kill window bigger, so rhythm literally makes you a better shot.
     - THE SONG CLIMBS ON RHYTHM ALONE. The music ladder used to key only off
       bodies; groove x2 now lifts it like two kills and x3 like four. You can
       take the song up by playing well before you have killed anybody.
     - It is LOUD on screen: GROOVE xN on the timing strip, hot orange at max,
       and CHAIN BROKEN flashed the instant you fall off.

2. ON-BEAT MOVEMENT IS FREE. A stamina move whose press lands PERFECT refunds
   its pip. Move in the pocket and you can keep moving; move sloppily and the
   bar drains. This is the RF4 "constant motion" ideal married to the beat: the
   reward for rhythm is MOBILITY, which is the currency that matters in a
   tactical fight, and it costs the player nothing but skill.

Both swings key off the SAME graded press v69 already computes, so there is one
definition of "on the beat" in the whole fight.

REUSE CHECK: no assets cooked. The chain reuses the shipped grade (beatErrMs /
gradeOf), the shipped timing strip, the shipped showVerd flash and the shipped
music ladder; the refund reuses spendStam/updStam.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_groove_patch.py
Gate:  node gates/combat_lab_gate.js   (section 13 executes the chain + refund)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V74 THE GROOVE CHAIN'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


GROOVE_CORE = r"""/* ===== V74 THE GROOVE CHAIN (pure, gate-simmed) ==========================
   Paolo: "take big swings to make combat more fun, more punchy, more feeling
   like a rhythm based game."
   Straight off Crypt of the NecroDancer's Groove Chain, which is the loop that
   makes a rhythm game a rhythm game: every action landed ON the beat compounds
   a multiplier, and it resets the moment you miss a beat OR take a hit. v69
   already graded every press and then did nothing with the grade -- a grade
   with no stake is a scoreboard, not a mechanic. Now the chain pays.
   The tiers are kill counts of on-beat actions, not seconds, so a slow careful
   player and a fast one are judged the same way. */
var BohemiaGroove=(function(){
  var TIERS=[0,2,5,9];                       /* x1 / x2 / x3 / x4 */
  function level(g){ g=g|0; var L=1;
    for(var i=1;i<TIERS.length;i++)if(g>=TIERS[i])L=i+1;
    return L; }
  function next(g){ g=g|0; for(var i=1;i<TIERS.length;i++)if(g<TIERS[i])return TIERS[i]-g; return 0; }
  /* WHAT THE CHAIN BUYS: the dial window opens 10% per level, to +30% at x4.
     Playing in the pocket makes you a better shot -- the reward for rhythm is
     capability, never a cosmetic badge. */
  function dialBonus(g){ return 1+(level(g)-1)*0.10; }
  /* AND THE SONG CLIMBS ON RHYTHM ALONE: the music ladder's rungs sit at 2 and
     4, so x2 lifts it like two kills and x3 like four. You can take the track
     up before you have put anybody down. */
  function musicFloor(g){ return (level(g)-1)*2; }
  function hit(g,grade){ return (grade==='PERFECT'||grade==='GOOD')?Math.min(99,(g|0)+1):0; }
  function broke(g,grade){ return (g|0)>0 && !(grade==='PERFECT'||grade==='GOOD'); }
  return { TIERS:TIERS, level:level, next:next, dialBonus:dialBonus,
           musicFloor:musicFloor, hit:hit, broke:broke }; })();
if(typeof module!=='undefined'&&module.exports)module.exports=BohemiaGroove;
/* ===== V74 GROOVE CORE END ===== */
"""


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # the pure core, right after the grade it feeds on
    demo = sub1(demo,
        "/* V69 THE SHOT IS AN INSTRUMENT.",
        GROOVE_CORE + "/* V69 THE SHOT IS AN INSTRUMENT.",
        'groove core')

    # -- the chain reacts to every graded press ------------------------------
    demo = sub1(demo,
        """    try{ if(_gr==='PERFECT')G._perfects=(G._perfects||0)+1; updTiming(); }catch(_e){} }""",
        """    /* V74: the grade now has a STAKE. On-beat compounds the chain; off-beat
       breaks it, loudly, because a chain you can lose silently teaches nothing. */
    try{
      if(BohemiaGroove.broke(G.groove,_gr)){ G.groove=0; showVerd('CHAIN BROKEN','#e8593a'); try{sndMiss();}catch(_e2){} }
      else { const _wasL=BohemiaGroove.level(G.groove); G.groove=BohemiaGroove.hit(G.groove,_gr);
        const _nowL=BohemiaGroove.level(G.groove);
        if(_nowL>_wasL){ showVerd('GROOVE x'+_nowL,'#8fe89a'); try{sndGreen();}catch(_e2){} } }
    }catch(_e){}
    try{ if(_gr==='PERFECT')G._perfects=(G._perfects||0)+1; updTiming(); }catch(_e){} }""",
        'grade feeds the chain')

    # -- taking a hit breaks it (the NecroDancer rule) -----------------------
    demo = sub1(demo,
        "function hurtFlash(){ const v=D('cvig');",
        """function hurtFlash(){
  /* V74: a hit BREAKS THE CHAIN. NecroDancer's rule and the right one -- the
     chain has to be losable by getting hurt or it is just a press counter. */
  if((G.groove||0)>0){ G.groove=0; try{showVerd('CHAIN BROKEN','#e8593a');}catch(_e){} try{updTiming();}catch(_e){} }
  const v=D('cvig');""",
        'hit breaks the chain')

    # -- the dial widens with the chain -------------------------------------
    demo = sub1(demo,
        "  const _pinW=(G.e[G.fireTarget]&&pinned(G.e[G.fireTarget]))?1.35:1;",
        """  /* V74: THE CHAIN WIDENS THE DIAL -- 10% per groove level, +30% at x4.
     Rhythm makes you a better shot, which is the whole promise. */
  const _grW=BohemiaGroove.dialBonus(G.groove);
  const _pinW=((G.e[G.fireTarget]&&pinned(G.e[G.fireTarget]))?1.35:1)*_grW;""",
        'chain widens the dial')

    # -- the song climbs on rhythm alone ------------------------------------
    demo = sub1(demo,
        "  const _sk=(G._demo&&G._demo.k==='J')?4:((JUICE.J&&!G.over)?(G.e?G.e.filter(e=>e.dead||e.downed||e.broken||e.fleeing).length:0):0);",
        """  /* V74: the ladder takes the HIGHER of bodies-taken-out and what the groove
     chain has earned, so the track can climb on pure rhythm before a single
     man is down. Rungs are at 2 and 4; x2 reads as two, x3 as four. */
  const _sk=(G._demo&&G._demo.k==='J')?4:((JUICE.J&&!G.over)?Math.max(
      (G.e?G.e.filter(e=>e.dead||e.downed||e.broken||e.fleeing).length:0),
      BohemiaGroove.musicFloor(G.groove)):0);""",
        'song climbs on rhythm')

    # -- ON-BEAT MOVEMENT IS FREE ------------------------------------------
    demo = sub1(demo,
        "function spendStam(n){ if((G.stam||0)<n)return false; G.stam-=n; G._stamSpent=true; updStam(); return true; }",
        """function spendStam(n){ if((G.stam||0)<n)return false; G.stam-=n; G._stamSpent=true; updStam(); return true; }
/* ===== V74 ON-BEAT MOVEMENT IS FREE ====================================
   Rogue Fable IV's ideal is that "you should be in a state of near constant
   motion" and that player SKILL matters more than stats. v73 made movement free
   of turn cost and free of return fire; this makes it free of PRICE too, but
   only if you move in the pocket. A stamina move whose press lands PERFECT
   refunds its pip, so a player on the beat can keep moving all turn, and a
   sloppy one drains the bar. The reward for rhythm is MOBILITY -- the currency
   that actually decides a tactical fight. It also compounds the groove chain,
   because moving well is playing well. */
function spendMove(n){
  if(!spendStam(n))return false;
  var ms=0, gr='LATE';
  try{ ms=beatErrMs(beatNow()); gr=gradeOf(ms); }catch(_e){}
  G._lastGrade={grade:gr,ms:Math.round(ms)};
  if(gr==='PERFECT'){
    G.stam=Math.min(STAM_MAX,(G.stam||0)+n); G._stamSpent=false; updStam();
    try{ showVerd('IN THE POCKET','#8fe89a'); sndOnBeatStab('GOOD'); }catch(_e){}
  }
  try{
    if(BohemiaGroove.broke(G.groove,gr)){ G.groove=0; showVerd('CHAIN BROKEN','#e8593a'); }
    else G.groove=BohemiaGroove.hit(G.groove,gr);
  }catch(_e){}
  try{ updTiming(); }catch(_e){}
  return true; }""",
        'spendMove')

    # route the three mobility verbs through it
    demo = sub1(demo,
        "  if(_sprinting){ spendStam(1); G.sprintArm=false; updMoveMode(); }",
        "  if(_sprinting){ spendMove(1); G.sprintArm=false; updMoveMode(); }   /* V74: on the beat, the pip comes back */",
        'sprint uses spendMove')
    demo = sub1(demo,
        "function doDashMove(d){ if(G.phase!=='cover'||G.over)return;   /* V56: the armed dash fires in the ring direction you tapped */\n  if(!spendStam(2))",
        "function doDashMove(d){ if(G.phase!=='cover'||G.over)return;   /* V56: the armed dash fires in the ring direction you tapped */\n  if(!spendMove(2))",
        'dash uses spendMove')
    demo = sub1(demo,
        "  if(!spendStam(1)){ setRead('NO STAMINA','vault needs 1 pip','#8a7d66'); return; }",
        "  if(!spendMove(1)){ setRead('NO STAMINA','vault needs 1 pip','#8a7d66'); return; }   /* V74: on the beat, the pip comes back */",
        'vault uses spendMove')

    # -- the chain is LOUD on the strip -------------------------------------
    demo = sub1(demo,
        "  t.textContent=g.grade+'  '+sign+g.ms+'ms'+((G._perfects||0)?('   \u00b7   '+G._perfects+' PERFECT'):''); }",
        """  /* V74: the chain rides the strip, hot orange at max, because a multiplier
     you cannot see is a multiplier nobody plays for. */
  var _gl=BohemiaGroove.level(G.groove), _max=(_gl>=BohemiaGroove.TIERS.length);
  var _chain=(G.groove||0)>0?('   \u00b7   GROOVE x'+_gl+(_max?' MAX':'')):'';
  if((G.groove||0)>0)t.style.color=_max?'#ff8a3a':(_gl>=3?'#e8c88a':'#8fe89a');
  t.textContent=g.grade+'  '+sign+g.ms+'ms'+_chain+((G._perfects||0)?('   \u00b7   '+G._perfects+' PERFECT'):''); }""",
        'chain on the strip')

    # a fresh fight starts with no chain
    demo = sub1(demo,
        "G.suppCd=0; G._fireReq=null; G._grades=[]; G._lastGrade=null; G._pressBeat=null; G._perfects=0; G._oneStreak=0;",
        "G.suppCd=0; G._fireReq=null; G._grades=[]; G._lastGrade=null; G._pressBeat=null; G._perfects=0; G.groove=0; G._oneStreak=0;",
        'fresh fight clears the chain')
    demo = sub1(demo,
        "    _lastErr:null, _demo:null, _spawnLayout:null, _fireReq:null };",
        "    _lastErr:null, _demo:null, _spawnLayout:null, _fireReq:null, groove:0 };   /* V74: no chain survives a fight */",
        'handoff clears the chain')

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
