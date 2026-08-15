#!/usr/bin/env python3
"""
BOHEMIA — HIS APPROVED COMBAT SOUNDS, IN COMBAT (7/31/26, SOUNDS lane)

Paolo 7/31: "make sure any of the combat sound effects you made you put them
into the combat too, please thank you."

He approved 2 HIT candidates and 5 KILL candidates on 7/30. They were banked and
playable and combat was still beeping its own placeholder oscillators at you.
APPROVED-BUT-UNUSED IS A DEFECT.

WHERE IT ATTACHES, and this is why it is a small patch: the demo already HAS a
sound layer. sndHit() and sndKill() are single functions called from 26+ sites
(every clean hit, every incidental kill, every killshot, the last-man nerve
break). So this rewrites the TWO FUNCTIONS and never touches a call site. Every
place combat already decided a hit or a kill happened now plays the sound he
picked, and the timing stays exactly where combat put it -- most of those calls
are already inside onBeat()/onOffbeat() wrappers, so scheduling them again on
the next downbeat would double-quantise and drag them late.

  sndHit()   -> playSFX('hit')    2 approved
  sndKill()  -> playSFX('kill')   5 approved, one of his five per kill

BLOCK IS NOT WIRED, ON PURPOSE. He approved one BLOCK sound, but this demo has
no block: `blocked` in here means a pillar is in your path, and sndReturn() is
you TAKING return fire, which is the opposite of blocking. The nearest real
candidate is cover absorbing a shot. Picking one of those and calling it a block
would be inventing a mechanic to justify a sound, which is exactly what
MECHANISM-MINE / CONTENTS-PAOLO'S forbids. It waits for his word.

ONE AUDIOCONTEXT, THE PARENT'S: the demo is a srcdoc iframe with an AudioContext
of its own (pre-existing, not this lane's to rip out). His sounds do NOT play on
it -- combat posts the event name and the parent renders it on the MUSIC studio's
context and brickwall limiter, same as the run. The old tone() stays ONLY as a
fallback for the demo opened standalone with no parent to ask.

AND IT REPORTS ITS TOUCHES. A finger inside this iframe never reaches the
parent's document, so the parent can be sitting with no audio at all while you
play a whole fight. Combat now posts BOHEMIA_GESTURE on pointerdown, same as the
run, so the audio is already started before the first shot lands.

REUSE CHECK: zero graphic pixels are cooked here, so no banks/ art bank applies
and none was opened. It opens banks/BOHEMIA_SFX_APPROVED_7_30_26.json only
indirectly -- the parent's playSFX owns that table, and this patch deliberately
does NOT duplicate it, so there is exactly one place that knows which candidate
he approved. It reuses the demo's existing sndHit/sndKill call graph (26+ sites,
none edited), the existing parent postMessage channel, and the parent's
AudioContext, master and limiter. It creates no context, no bus, no second
sound engine and no new sound.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md sec 4 MUSIC): adds no voice and no
feedback path, so the screech rulings are untouched. It REMOVES sound rather than
adding it -- the placeholder square/sawtooth beeps stop being what you hear. The
120 BPM LAW is respected by NOT re-quantising: combat already places these calls
on the beat, and stacking playSFX's own beat scheduling on top would push them
off it.

Idempotent (guarded by the BOHEMIA_SFX marker inside the demo source).

  python3 tools/bohemia_combat_sfx_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

MARK = 'BOHEMIA_SFX'

# the demo's placeholder sound layer, verbatim
OLD_KILL = "function sndKill(){ tone(140,0.20,0.12,'square'); tone(70,0.30,0.10,'sine'); tone(280,0.10,0.06,'triangle'); }"
OLD_HIT = "function sndHit(){ tone(240,0.07,0.06,'sine'); }"
# his 8/1 verdict added two more: shot.3 and hurt.2 (the only survivors of 25)
OLD_SHOT = "function sndShot(){ tone(180,0.08,0.10,'sawtooth'); tone(90,0.10,0.08,'sine'); }"
OLD_RETURN = "function sndReturn(){ tone(90,0.22,0.12,'sawtooth'); }"

NEW = r"""/* === HIS APPROVED COMBAT SOUNDS (7/31/26) ==============================
   Paolo approved 2 HIT and 5 KILL candidates on 7/30 and combat was still
   beeping oscillators. These two functions are called from 26+ sites, so
   rewriting them here puts his sound on every hit and every kill without
   touching a single call site or moving any timing.
   ONE AUDIOCONTEXT, THE PARENT'S: we post the event name; the parent renders
   it on the music studio's context and limiter. The old tones remain ONLY as
   a fallback for this demo opened standalone, with no parent to ask.
   NOT RE-QUANTISED: most of these calls already sit inside onBeat/onOffbeat,
   so asking the parent to schedule them onto the next downbeat as well would
   double-quantise and drag them late. */
function sfxAsk(ev){
  try{
    if(window.parent && window.parent!==window){
      window.parent.postMessage({type:'BOHEMIA_SFX',ev:ev,when:null},'*');
      return true;
    }
  }catch(_e){}
  return false;
}
function sndKill(){ if(sfxAsk('kill'))return;
  tone(140,0.20,0.12,'square'); tone(70,0.30,0.10,'sine'); tone(280,0.10,0.06,'triangle'); }
function sndHit(){ if(sfxAsk('hit'))return;
  tone(240,0.07,0.06,'sine'); }
/* 8/1: THE GUN AND THE HIT YOU TAKE. He judged 25 combat candidates and only
   two lived -- shot.3 and hurt.2, both ash, both at the bottom of their pitch
   range and the top of their drive range. sndShot is the most-called sound in
   the whole game; sndReturn is every way the fight lands on YOU. */
function sndShot(){ if(sfxAsk('shot'))return;
  tone(180,0.08,0.10,'sawtooth'); tone(90,0.10,0.08,'sine'); }
function sndReturn(){ if(sfxAsk('hurt'))return;
  tone(90,0.22,0.12,'sawtooth'); }
/* 8/2: BLOCKED. THE DEMO DOES HAVE A BLOCK, IT JUST WAS NOT CALLED ONE.
   The 7/31 note in this file said combat had no block mechanic and that
   inventing one was Paolo's call. That note was WRONG about the code, and the
   right fix is to correct the claim rather than keep quoting it: every return
   volley rolls each enemy against your cover, and a shot that fails its roll
   BECAUSE you were behind something is scored as a cover save -- the game
   already draws a spark on the cell that ate it. That is his BLOCKED exactly:
   "the hit that did not land". No mechanic is being invented; a sound is being
   put on one that has been in the fight all along.
   ONE SAVE PER VOLLEY. A firefight resolves several enemies in the same frame
   and three of them can all be eaten by the same wall, which would fire his
   single approved block sound three times in one tick and turn it into a
   rattle. The window is a fifth of a second, which is shorter than any real
   volley gap and longer than one resolution loop. */
var _blkAt=0;
function sndBlock(){
  var now=(typeof performance!=='undefined'&&performance.now)?performance.now():Date.now();
  if(now-_blkAt<200)return;
  _blkAt=now;
  if(sfxAsk('block'))return;
  tone(300,0.06,0.05,'triangle');
}
/* A FINGER IN HERE IS STILL A FINGER. It never reaches the parent's document,
   so the parent could sit with audio that was never started through a whole
   fight. Tell it on the gesture itself, ahead of any sound. */
(function(){
  function gesture(){
    try{ if(window.parent&&window.parent!==window)
      window.parent.postMessage({type:'BOHEMIA_GESTURE'},'*'); }catch(_e){}
  }
  ['pointerdown','touchstart','mousedown','keydown'].forEach(function(t){
    try{ document.addEventListener(t, gesture, {capture:true, passive:true}); }catch(_e){}
  });
})();"""



# WHERE THE BLOCK SOUND GOES, AND WHY IT MOVED.
# First attempt put it on the CALL SITE, so the sound could not be killed by the
# R juice toggle:  else if(cov){ sndBlock(); onOffbeat(...) }
# combat_lab_gate.js pins that exact line, comment and spacing included, as its
# proof that Paolo's V42 cover revert is still intact. That is ANOTHER LANE'S
# gate guarding HIS ruling, and rewriting their assertion to fit my sound would
# be exactly the move this repo keeps punishing. So the sound moved instead.
# It now sits on the FIRST STATEMENT of fxCoverSave, AHEAD of the `if(!JUICE.R)
# return`, which keeps the two properties that mattered:
#   - a VISUAL toggle can never mute a sound he approved (it runs before it), and
#   - the byte-exact call site the other lane pinned is untouched.
# It also lands the sound where the spark lands: the call is wrapped in
# onOffbeat, so the block now hits on the beat WITH its own flash instead of a
# frame early. 120 BPM LAW, for free.
COV_OLD = "function fxCoverSave(ea){ if(!JUICE.R)return;"
COV_NEW = ("function fxCoverSave(ea){ sndBlock();"
           "   /* HIS block (7/30): the shot your cover ATE, on the beat with its spark.\n"
           "      BEFORE the JUICE.R return on purpose -- a visual toggle must never be\n"
           "      able to mute a sound he approved. */\n"
           "  if(!JUICE.R)return;")


# THE FIRST ATTEMPT'S EDIT, WHICH HAS TO BE UNDONE WHERE IT ALREADY LANDED.
# This tool ran once with the call-site version before the pin was discovered, so
# a build can be carrying it. A patch tool that only knows how to move FORWARD
# leaves its own mistakes welded into every tree it already touched, which is the
# fence-orphan defect this repo has a gate for. So the repair is part of the tool.
STALE_CALL = ("    else if(cov){ sndBlock(); onOffbeat(()=>fxCoverSave(e.ea)); }"
              "   /* R: your cover ate that one, and 8/2 it is AUDIBLE */ }")
PINNED_CALL = ("    else if(cov)onOffbeat(()=>fxCoverSave(e.ea));"
               "   /* R: your cover ate that one */ }")


# ---- 8/15: THE MISS AND THE VITAL, WHICH COMBAT ALREADY HAD NAMES FOR ------
# He swept miss_past FIVE OF FIVE and kept three of five vital_deep. Both
# moments are already first-class verdicts in this fight -- showVerd('MISS') and
# showVerd('VITAL') -- and both have had a placeholder oscillator on them since
# before this lane existed. So this is the block wire again, exactly: no
# mechanic invented, no call site moved, a real moment that was beeping now
# plays what he chose.
#
# WHY THE HEADERS AND NOT THE INJECTED BLOCK. sndVital and sndMiss are the
# COMBAT lane's own functions, defined well below the block this tool owns.
# Copying them into my block would define them twice; wrapping them at runtime
# would put a reassignment in somebody else's scope for no gain. Editing the
# first statement of each is the same move that put the block on fxCoverSave,
# and it leaves every one of their bodies intact as the standalone fallback.
#
# THE LIMITER IS ON THE MISS AND NOT THE VITAL, ON PURPOSE. sndMiss has five
# call sites and two of them run inside per-enemy loops (the nerve break, the
# blast dodge), so one frame can ask for it three times; a vital is one shot
# resolving against one man and cannot double. Same 200 ms window as the block.
VITAL_OLD = ("function sndVital(){ tone(360,0.12,0.08,'triangle'); "
             "tone(540,0.08,0.05,'sine'); }")
VITAL_NEW = ("function sndVital(){ if(sfxAsk('vital_deep'))return;"
             "   /* HIS 8/15: 3 of 5 kept, modal at 74 Hz -- worse than a hit,\n"
             "      not yet a kill, and it lands in the body. */\n"
             "  tone(360,0.12,0.08,'triangle'); tone(540,0.08,0.05,'sine'); }")

MISS_OLD = "function sndMiss(){ if(!AC)return;"
MISS_NEW = ("var _missAt=0;\n"
            "function sndMiss(){\n"
            "  var _n=(typeof performance!=='undefined'&&performance.now)?performance.now():Date.now();\n"
            "  if(_n-_missAt<200)return;\n"
            "  _missAt=_n;\n"
            "  if(sfxAsk('miss_past'))return;"
            "   /* HIS 8/15 SWEEP, 5/5 -- the cleanest verdict in any batch\n"
            "      since the demo set. There is nothing to strike in a miss,\n"
            "      which is why every struck-object candidate for it died. */\n"
            "  if(!AC)return;")


def wire_miss_vital(demo):
    """His 8/15 miss and vital onto the two verdicts combat already scores."""
    ok = True
    for name, old, new in (('vital_deep', VITAL_OLD, VITAL_NEW),
                           ('miss_past', MISS_OLD, MISS_NEW)):
        if new.split('\n')[0] in demo and ("sfxAsk('%s')" % name) in demo:
            continue
        if demo.count(old) != 1:
            print('FAIL: the %s call site is not present exactly once (%d)'
                  % (name, demo.count(old)))
            ok = False
            continue
        demo = demo.replace(old, new, 1)
    return demo, ok


def wire_block(demo):
    """Put his BLOCKED sound on the cover save. Idempotent, and loud on failure."""
    if STALE_CALL in demo:
        demo = demo.replace(STALE_CALL, PINNED_CALL, 1)
        print('  reverted the first attempt at the call site (it is pinned by '
              'combat_lab_gate as proof of his V42 cover revert)')
    if COV_NEW in demo:
        return demo, True
    if demo.count(COV_OLD) != 1:
        print('FAIL: the cover-save call site is not present exactly once (%d)'
              % demo.count(COV_OLD))
        return demo, False
    return demo.replace(COV_OLD, COV_NEW, 1), True


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i0 = src.index(key) + len(key)
    j0 = src.index("'", i0)
    demo = base64.b64decode(src[i0:j0]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))

    # IDEMPOTENT BY REPLACEMENT, NOT BY REFUSAL. The first version bailed out the
    # moment it saw its own marker, which meant that once combat carried the
    # 7/31 two-function wire this tool could never UPGRADE it -- his 8/1 gun and
    # hurt verdicts would have silently never landed. A tool that cannot re-apply
    # itself is not idempotent, it is stuck.
    HEAD = '/* === HIS APPROVED COMBAT SOUNDS'
    TAIL = "  ['pointerdown','touchstart','mousedown','keydown'].forEach(function(t){\n" \
           "    try{ document.addEventListener(t, gesture, {capture:true, passive:true}); }catch(_e){}\n" \
           "  });\n})();"
    if HEAD in demo:
        i = demo.index(HEAD)
        if TAIL not in demo[i:]:
            print('FAIL: the injected block is present but its end marker is gone -- hand-edited?')
            return 1
        j = demo.index(TAIL, i) + len(TAIL)
        demo = demo[:i] + NEW + demo[j:]
        # any placeholder this build had not yet swallowed goes now
        for dead in (OLD_HIT, OLD_SHOT, OLD_RETURN, OLD_KILL):
            demo = demo.replace(dead, '', 1)
        for fn in ('sndHit', 'sndKill', 'sndShot', 'sndReturn'):
            if demo.count('function %s(' % fn) != 1:
                print('FAIL: %s is defined %d times after re-inject'
                      % (fn, demo.count('function %s(' % fn)))
                return 1
        demo, ok = wire_block(demo)
        if not ok:
            return 1
        demo, ok = wire_miss_vital(demo)
        if not ok:
            return 1
        b64 = base64.b64encode(demo.encode('utf8')).decode('ascii')
        src = src[:i0] + b64 + src[j0:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  re-injected (idempotent upgrade): hit, kill, shot, hurt, '
              'block, vital_deep, miss_past')
        return 0

    for old in (OLD_KILL, OLD_HIT, OLD_SHOT, OLD_RETURN):
        if demo.count(old) != 1:
            print('FAIL: expected exactly one\n  %s\nfound %d' % (old[:70], demo.count(old)))
            return 1

    # kill first, then hit -- replace the pair with the one new block
    demo = demo.replace(OLD_KILL, NEW, 1)
    for dead in (OLD_HIT, OLD_SHOT, OLD_RETURN):
        demo = demo.replace(dead, '', 1)

    for fn in ('sndHit', 'sndKill', 'sndShot', 'sndReturn'):
        if demo.count('function %s(' % fn) != 1:
            print('FAIL: %s is not defined exactly once (%d)'
                  % (fn, demo.count('function %s(' % fn)))
            return 1

    demo, ok = wire_block(demo)
    if not ok:
        return 1
    demo, ok = wire_miss_vital(demo)
    if not ok:
        return 1
    b64 = base64.b64encode(demo.encode('utf8')).decode('ascii')
    src = src[:i0] + b64 + src[j0:]
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  HIS APPROVED COMBAT SOUNDS ARE IN COMBAT NOW.')
    print('    sndHit  -> playSFX("hit")   2 approved')
    print('    sndKill -> playSFX("kill")  5 approved, never the same one twice')
    print('    sndShot -> playSFX("shot")  shot.3, the only survivor of five')
    print('    sndReturn -> playSFX("hurt") hurt.2, the only survivor of five')
    print('    sndBlock -> playSFX("block") on the shot your cover ATE')
    print('    sndVital -> playSFX("vital_deep") 3 of 5 kept 8/15')
    print('    sndMiss  -> playSFX("miss_past")  5 of 5 kept 8/15')
    print('OK -> ' + ALPHA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
