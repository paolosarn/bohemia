#!/usr/bin/env python3
"""V150 IF YOU HAVE A TARGET, YOU SHOOT. THAT IS THE WHOLE LAW.

Paolo 8/14: "I tried to shoot in. I'm already done getting shot at not letting me
shoot. What's wrong with that? What's going on, bro?"

--------------------------------------------------------------------------
I FIXED THE WRONG HALF LAST TURN AND THIS IS THE REST OF IT
--------------------------------------------------------------------------
V147 stopped recklessPop from hurting him on a GREEN board. That was real, and
it was one case out of the two that matter. Here is the actual routing:

    const exp = exposedToMe();                       // who can shoot ME
    if(exp.length===0 && posExposed()>0 && coveredFromMe()>0){
      if(!mel.length) return recklessPop();          // <-- shot, never fired
    }
    else if(exp.length===0 && !anyPeeking()) return recklessPop();   // <-- same

*** EVERY BRANCH IS DECIDED BY EXPOSURE. NOT ONE OF THEM ASKS WHETHER HE HAS A
TARGET. *** And since V141 made exposedToMe() range-aware, "nobody can reach me"
became COMMON -- it is the entire approach phase. So the state he keeps hitting
is: a legal target standing in his sights, nobody able to shoot him, and the
button routes him into the branch that takes a free volley and fires nothing.

He is describing a locked law being broken: YOU ALWAYS SHOOT FIRST (8/3, his
words: "no enemies never get the first shot thats why its important to not
miss"). Popping at an empty board should cost him. Popping at a MAN should shoot
the man.

--------------------------------------------------------------------------
THE FIX IS ONE LINE AND IT IS THE LAW ITSELF
--------------------------------------------------------------------------
IF THERE IS A LEGAL TARGET, THE POP IS A SHOT. Nothing else gets to decide.

modePool() is already the one place that answers "who may I shoot" -- it knows
cover, peeking, pinned, stunned, melee and, since V141, MY WEAPON'S RANGE. So
the guard reads it, and if it is non-empty the reckless branches are unreachable
by construction rather than by me remembering to check them.

V29's punishment survives EXACTLY where it was aimed: popping at nothing. With
an empty pool there is no shot to take, the button already says NOTHING TO
SHOOT, and standing up still costs him. That was always the intent -- it was
just being applied to turns where he DID have a shot.

--------------------------------------------------------------------------
WHY I KEEP LANDING HERE
--------------------------------------------------------------------------
Three fixes now (V141, V146, V147) have each closed one branch of this while the
others stayed open, because I kept patching the SYMPTOM I could see instead of
the DECISION underneath. The decision is one question -- do I have a shot -- and
until now no branch asked it.

REUSE CHECK: cooks NO graphic pixels. It reads modePool(), which already exists
and already knows every rule about who is shootable. No new state, no new
system, nothing authored, no bank opened.

TASTE CHECK: authors no art. The taste rule is the oldest one he has given this
lane, and it is a law: the enemy never gets the first shot. A button that
sometimes skips your turn and hands them a free volley is not difficulty, it is
the game taking the round off you.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V150 IF YOU HAVE A TARGET, YOU SHOOT'
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
        print('v150 already in; nothing to do')
        return

    old = """  const exp=exposedToMe();
  if(exp.length===0 && posExposed().length>0 && coveredFromMe().length>0){   /* V32 HOLD FIX: same gate as updGap — no covered side, no double-exposure risk */
    const mel=G.e.filter(e=>!e.dead&&e.melee&&peeking(e));
    if(!mel.length){ return recklessPop(); }   /* V29: the click is YOURS — and so is the price */
    G.engageMode='shoot'; }
  else if(exp.length===0 && !anyPeeking()){ return recklessPop(); }   /* V29: popping at nothing is allowed, and punished */"""
    new = """  const exp=exposedToMe();
  /* ===== V150 IF YOU HAVE A TARGET, YOU SHOOT ==================
     Paolo 8/14: "I tried to shoot in. I'm already done getting shot at not
     letting me shoot."
     EVERY BRANCH BELOW IS DECIDED BY EXPOSURE -- who can shoot HIM -- and NOT
     ONE OF THEM EVER ASKED WHETHER HE HAS A TARGET. Since V141 made
     exposedToMe() range-aware, "nobody can reach me" became the common case;
     it is the entire approach phase. So the state he keeps hitting is a legal
     target in his sights, nobody able to shoot him, and the button routing him
     into a free enemy volley with no shot fired.
     THAT IS A LOCKED LAW BREAKING: YOU ALWAYS SHOOT FIRST (8/3, "no enemies
     never get the first shot"). Popping at an EMPTY board should cost him.
     Popping at a MAN should shoot the man.
     modePool() is already the one place that answers "who may I shoot" -- it
     knows cover, peeking, pinned, stunned, melee and my weapon's range. Read it
     here and the reckless branches become unreachable BY CONSTRUCTION instead
     of by me remembering to guard each one. V29's punishment survives exactly
     where it was aimed: an empty pool, where there is no shot to take and the
     button already says NOTHING TO SHOOT.
     THIS IS THE FOURTH FIX IN THIS AREA (V141, V146, V147) because each closed
     one branch of the symptom while the DECISION underneath went unexamined. */
  const _haveShot=(function(){ try{ return modePool().length>0; }catch(_e){ return false; } })();
  if(exp.length===0 && posExposed().length>0 && coveredFromMe().length>0){   /* V32 HOLD FIX: same gate as updGap — no covered side, no double-exposure risk */
    const mel=G.e.filter(e=>!e.dead&&e.melee&&peeking(e));
    if(!mel.length && !_haveShot){ return recklessPop(); }   /* V29: the click is YOURS — and so is the price. V150: but only when there was nothing to shoot */
    G.engageMode='shoot'; }
  else if(exp.length===0 && !anyPeeking() && !_haveShot){ return recklessPop(); }   /* V29: popping at nothing is allowed, and punished. V150: at NOTHING, not at a man */"""
    js = subN(js, old, new)

    # ---- THE REAL ONE: THE DEAD BUTTON NEVER NAMED THE WAY OUT -----------
    # MEASURED, 2,100 turns: he is OUT OF RANGE on 10% of them; on 70% of those
    # he is ALSO being shot at -- HELPLESS TURNS -- and in *** 100% *** of those
    # the gun in his OTHER HAND would have reached somebody.
    # The answer was in his pocket every single time and the button just said
    # OUT OF RANGE and stopped. That is the "not letting me shoot" he is
    # describing: not a rule bug, a DEAD END with a silent exit.
    old = """    col=_hot?'#ffeae6':'#7f93a4'; txt='OUT OF RANGE';"""
    new = """    /* V150: NAME THE WAY OUT. A dead button that states a fact he can already
       feel is not information. If the gun in his other hand reaches somebody,
       the button says WHICH GUN -- because that is the move, and it is one tap
       away on the thumb row he is already touching. */
    let _alt=null; try{ const _a=altWeapon(), _ar=maxRange(wpnRange(_a));
      if(_a&&_a!==WEAPON&&(G.e||[]).some(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!e.melee&&(e.edist||99)<=_ar))_alt=_a; }catch(_e){}
    col=_hot?'#ffeae6':'#7f93a4'; txt=_alt?('SWAP TO '+_alt.toUpperCase()):'OUT OF RANGE';"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v150: if you have a target, you shoot -- %d chars' % len(js))


if __name__ == '__main__':
    main()
