#!/usr/bin/env python3
"""
V212 -- THEY ARE RUNNING, DO I CHASE?  (COMBAT lane, [enemies flee] BB-THE-ROUT)

THE ROW: "*** THE MOST DECISIVE MOMENT IN A REAL BATTLE IS CURRENTLY A DESPAWN. ***
MEASURED: a fleeing man runs one tile a turn straight away, out to a distance of 30,
and that is the end of him. No pursuit, no decision, no body -- so no loot and no XP
either. THE REAL AISLE SAYS THAT IS WHERE EVERYTHING HAPPENS: in pre-modern battle
the WINNERS rarely suffered more than 5% fatalities while the LOSERS averaged 10-15%,
AND MUCH OF THAT WAS INFLICTED DURING THE ROUT AND PURSUIT, not during the fighting.
A battle is decided by a decision to leave, and the killing happens after the
decision. WINNING IS CHEAP AND LOSING IS EXPENSIVE. SO THE INTERESTING QUESTION IN
OUR FIGHT IS NOT 'can I kill all eight', IT IS 'THEY ARE RUNNING -- DO I CHASE?'"

*** MEASURED IN THE DECODED BLOB FIRST, AND THE ROW IS RIGHT ON EVERY COUNT, PLUS
    ONE IT DID NOT KNOW. ***
    the run        `e.edist=Math.min(30,...)` -- one tile a turn, straight out,
                   clamped at 30. He is never removed; he just stands there at 30.
    the target     modePool() filters by peeking() and exposedToMe(), and BOTH
                   exclude `fleeing`. A running man CANNOT BE SHOT AT ALL.
    *** THE ONE THE ROW MISSED, AND IT IS THE REAL DEFECT *** -- aliveEnemies()
                   excludes the fleeing, and FOUR separate end checks read
                   `aliveEnemies().length===0`. SO THE FIGHT ENDS THE INSTANT THE
                   LAST MAN ON HIS FEET TURNS HIS BACK. The question "do I chase?"
                   was not merely unanswerable, IT COULD NOT BE ASKED: the win
                   screen is already up.
    their side     their medic already has the second verb -- medicTurn's `need` is
                   3 for a downed man and 1 for a broken or FLEEING one, and it
                   clears `fleeing` when it reaches him. They talk their runners
                   round. We could not even look at ours.

SO THIS BUILDS THE QUESTION, AND NOTHING ELSE:
    THE FIGHT WAITS   the end check becomes "nobody can fight AND nobody is worth
                      chasing". One idea, fightOver(), replacing the same expression
                      at all four sites, so a fifth end check cannot be written
                      against the old meaning. aliveEnemies() is UNTOUCHED, because
                      the music ladder and the last-man rule mean exactly what it
                      says today.
    HE IS A TARGET    a runner inside your reach enters the target pool. The pool's
                      own range filter and smoke rule already apply, so the DIAL
                      decides whether you hit him -- nothing here makes it easier or
                      harder to shoot a man in the back. A running man leaves the
                      pool the moment he is out of reach, exactly like everybody
                      else.
    THE WINDOW CLOSES he walks a tile a turn, so the window is short and it is his
                      distance and your gun that set it: a pistol gives you two or
                      three turns, a rifle gives you a dozen. That IS the decision,
                      and it costs the thing the study says it costs -- ground and
                      turns, under whatever is still shooting at you.
    AND YOU ARE TOLD  once, when the board goes quiet and men are still running, and
                      once when a man you could have taken passes out of reach. A
                      cost you never learn about is not a cost.

WHAT IS DELIBERATELY NOT BUILT HERE, and it is named so the next round does not
think it was missed: the payload's contract is UNTOUCHED. `fled` is already counted
and already goes out per man, which is what a quest or the standing system reads, and
the outcome shape lives in the shared handoff core -- adding a field would make this
an engine change instead of a combat one, which is V200's rule and it still holds.

NO DAMAGE BEFORE THE DIAL: no damage value, no hit chance, no roll and no accuracy
term is authored. A runner is added to the list of who you MAY shoot; what happens
when you do is the dial that was already there.
"""
import re
import sys
import base64

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_ROUT__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:160]))
    return src.replace(old, new, n)


BLOCK = r"""
/* ===== V212 __THE_ROUT__ -- THEY ARE RUNNING, DO I CHASE? ==================
   BB-THE-ROUT. The study: in pre-modern battle the winners rarely lost more than 5%
   and the losers averaged 10-15%, and MUCH OF IT WAS INFLICTED DURING THE ROUT. A
   battle is decided by a decision to leave and the killing happens after the
   decision. WINNING IS CHEAP AND LOSING IS EXPENSIVE.
   MEASURED HERE FIRST: a runner walks one tile a turn and clamps at 30, he is in no
   target pool because peeking() and exposedToMe() both exclude the fleeing, and --
   the part the row did not know -- aliveEnemies() excludes him too, so the fight was
   ENDING the instant the last man on his feet turned his back. The question could
   not be asked because the win screen was already up. */
function runners(){ return (G.e||[]).filter(e=>e&&e.fleeing&&!e.dead&&!e.downed); }
/* WORTH CHASING = still inside the reach this gun actually has, which is the same
   filter the target pool uses, so there is ONE idea of who you can touch and not
   two. This is what holds the fight open, and it closes by itself: he walks a tile
   a turn, so a pistol gives you two or three turns and a rifle gives you a dozen.
   His distance and your gun set the window; nothing here sets it. */
function chaseable(){ return runners().filter(e=>inMyRange(e)&&!smokeAt(e)); }
/* THE ONE IDEA OF THE FIGHT BEING OVER. It replaces the same expression at all four
   end checks, so a fifth one cannot be written against the old meaning by accident.
   aliveEnemies() itself is untouched: the music ladder and the last-man-surrenders
   rule both mean exactly what it says today. */
function fightOver(){ return aliveEnemies().length===0 && chaseable().length===0; }
/* AND THE QUESTION IS ASKED OUT LOUD, ONCE, at the only moment it exists: the
   shooting has stopped and somebody is still running.
   [draft:true] the words are an attempt; WORDS owns them. */
function routAsk(){
  if(G._routSaid)return false;
  if(aliveEnemies().length>0)return false;
  const n=chaseable().length; if(!n)return false;
  G._routSaid=true;
  try{ setRead('THEY ARE RUNNING', n+(n===1?' still in reach':' still in reach')+', take them or let them go','#c8a23a'); }catch(_e){}
  return true; }
/* ===== /V212 __THE_ROUT__ ===== */
"""


def patch_blob(blob):
    if MARK in blob:
        print('  the fight already asks')
        return blob, False

    # 1. the block, declared right after the function whose meaning it qualifies
    blob = sub(blob,
               "function aliveEnemies(){ return G.e.filter(e=>!e.dead&&!e.downed&&!e.broken&&!e.fleeing); }   /* V30: the FIGHT ends when nobody can fight — the dying crawl, the broken stand */",
               "function aliveEnemies(){ return G.e.filter(e=>!e.dead&&!e.downed&&!e.broken&&!e.fleeing); }   /* V30: the FIGHT ends when nobody can fight — the dying crawl, the broken stand */"
               + BLOCK.rstrip(),
               1, 'blob/block')

    # 2. a runner in reach is a target. The pool's own range and smoke filters still
    #    apply, so the dial decides the shot and nothing here touches it.
    blob = sub(blob,
               "  const _inRange=a=>a.filter(e=>inMyRange(e)&&!smokeAt(e));\n"
               "  if(G.engageMode==='shoot') return _inRange(exposedToMe().concat(mel).concat(pin));\n"
               "  return _inRange(G.e.filter(e=>!e.dead&&(peeking(e)||pinned(e)))); }",
               "  const _inRange=a=>a.filter(e=>inMyRange(e)&&!smokeAt(e));\n"
               "  /* V212 " + MARK + ": AND A MAN WHO IS RUNNING IS SOMEBODY YOU MAY SHOOT AT.\n"
               "     He was in NO pool before this -- peeking() and exposedToMe() both exclude the\n"
               "     fleeing -- so 'do I chase?' had no answer you could act on. His back is to\n"
               "     you and he is in the open, and the pool's own range and smoke filters below\n"
               "     still decide whether he is reachable, so THE DIAL decides the shot. Nothing\n"
               "     here makes shooting a running man easier or harder than shooting anyone\n"
               "     else. Deduped, because a runner could already be in one of the lists. */\n"
               "  const _run=(G.e||[]).filter(e=>e&&e.fleeing&&!e.dead&&!e.downed);\n"
               "  const _add=a=>{ const s=new Set(a); for(const e of _run)s.add(e); return Array.from(s); };\n"
               "  if(G.engageMode==='shoot') return _inRange(_add(exposedToMe().concat(mel).concat(pin)));\n"
               "  return _inRange(_add(G.e.filter(e=>!e.dead&&(peeking(e)||pinned(e))))); }",
               1, 'blob/pool')

    # 3. the window closing is the cost, so it has to be said once, per man
    blob = sub(blob,
               "  for(const e of G.e){ if(!e.fleeing)continue;   /* V35: the fleeing run AWAY every turn. V53: exactly 1 tile per turn, straight out (their back is drawn to you in enemyLook) */\n"
               "    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist, ed=Math.hypot(ex,ey)||1;\n"
               "    const nx=ex+(ex/ed)*1.0, ny=ey+(ey/ed)*1.0;\n"
               "    e.edist=Math.min(30,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx); e._fleeStepAt=performance.now(); }",
               "  for(const e of G.e){ if(!e.fleeing)continue;   /* V35: the fleeing run AWAY every turn. V53: exactly 1 tile per turn, straight out (their back is drawn to you in enemyLook) */\n"
               "    /* V212 " + MARK + ": and the step he takes OUT OF YOUR REACH is the moment the\n"
               "       decision expires, so it is said, once, for a man you could have taken. A\n"
               "       cost nobody tells you about is not a cost. What he is carrying leaves with\n"
               "       him because loot only ever falls off a body (V181), which needed no code\n"
               "       here and is exactly why the row called this free content. */\n"
               "    const _wasNear=inMyRange(e)&&!e.dead&&!e.downed;\n"
               "    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist, ed=Math.hypot(ex,ey)||1;\n"
               "    const nx=ex+(ex/ed)*1.0, ny=ey+(ey/ed)*1.0;\n"
               "    e.edist=Math.min(30,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx); e._fleeStepAt=performance.now();\n"
               "    if(_wasNear && !inMyRange(e) && !e._gone){ e._gone=true;\n"
               "      /* [draft:true] WORDS owns what this says. */\n"
               "      try{ setRead(e.n+' IS GONE','he made it out of your reach, and what he was carrying went with him','#8a7d66'); }catch(_e){} } }",
               1, 'blob/step')

    # 4. the four end checks, all onto the one idea
    blob = sub(blob,
               "  if(aliveEnemies().length===0){ if(!(EXIT_ON&&G.exit))try{winGame();}catch(_e){} } }   /* V159: the way out is the win when there is one */",
               "  if(fightOver()){ if(!(EXIT_ON&&G.exit))try{winGame();}catch(_e){} }else{ try{routAsk();}catch(_e){} } }   /* V159: the way out is the win when there is one */   /* V212 " + MARK + " */",
               1, 'blob/end-grenade')

    blob = sub(blob,
               "function checkClear(){ if(!G.over && aliveEnemies().length===0){",
               "function checkClear(){ if(!G.over && aliveEnemies().length===0 && !fightOver()){ try{routAsk();}catch(_e){} return false; }   /* V212 " + MARK + ": the guns are quiet but somebody is still running, and that is the question this row exists to ask */\n"
               "  if(!G.over && fightOver()){",
               1, 'blob/end-checkclear')

    blob = sub(blob,
               "function afterKill(){ if(aliveEnemies().length===0&&!(EXIT_ON&&G.exit))return winGame();\n"
               "  if(aliveEnemies().length===0)return endTurnReturn(false);   /* V159: board clear, but you still have to leave */",
               "function afterKill(){ if(fightOver()&&!(EXIT_ON&&G.exit))return winGame();   /* V212 " + MARK + " */\n"
               "  if(fightOver())return endTurnReturn(false);   /* V159: board clear, but you still have to leave */\n"
               "  try{routAsk();}catch(_e){}   /* V212 " + MARK + ": the last man turned his back rather than fell */",
               1, 'blob/end-afterkill')
    return blob, True


def main():
    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('no COMBAT_B64')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    blob, changed = patch_blob(blob)
    if not changed:
        return
    s = s[:m.start(1)] + base64.b64encode(blob.encode('utf-8')).decode('ascii') + s[m.end(1):]
    s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
               r'\g<1>BUILD 9/13z - THEY ARE RUNNING, DO I CHASE\g<2>', s, count=1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('V212 applied to', ALPHA)


if __name__ == '__main__':
    main()
