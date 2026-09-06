#!/usr/bin/env python3
"""
V202 -- THE FIRST FIGHT TEACHES THE BEAT  (COMBAT lane, VAMILY row [first fight])

  "one lesson per encounter, and the obstacle must be impossible to pass
   without the thing being taught"
   -- records/BOHEMIA_COORDINATOR_RESEARCH_THE_FIRST_FIGHT_TEACHES_9_6_26.md

A stranger opens the demo link with no manual. Four rules have to be learned
(the beat, it is a group, a tile is a house, the companion acts) and NOTHING
teaches any of them. This row authors the FIRST encounter as a lesson in THE
BEAT ALONE:

  one man, on a street, with nowhere to hide, who cannot be touched off the
  beat and goes down on it -- and no companion, no group, no range problem,
  no text box, because a first fight that teaches four things teaches none.

REPLAYABLE, like every tool in this lane: it decodes COMBAT_B64 fresh, asserts
an exact anchor count for every substitution, and re-encodes. MARK makes it
idempotent, so it can be replayed onto a fresh main after a rebase.

Replay order for this lane: v197 -> v198 -> v199 -> v200 -> street(v201) -> THIS.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__FIRST_FIGHT_TEACHES_THE_BEAT__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:110]))
    return src.replace(old, new, n)


# ---------------------------------------------------------------- THE BLOB ---
def patch_blob(b):
    if MARK in b:
        print('  blob already patched')
        return b

    # 1. THE FLAG ARRIVES ON ITS OWN MESSAGE, exactly like V200's room, and for
    #    the same reason: postMessage from one window is ORDERED, so the flag is
    #    in hand before setup runs, and the HANDOFF CORE's contract -- a shared
    #    engine module -- stays untouched.
    b = sub(b,
            "try{ window.addEventListener('message',function(ev){\n"
            "  var q=ev&&ev.data; if(!q||q.type!=='BOHEMIA_FIGHT_ROOM')return;\n"
            "  G.cityRoom=q.room||null; G._roomFree=null; }); }catch(_e){}",
            "try{ window.addEventListener('message',function(ev){\n"
            "  var q=ev&&ev.data; if(!q||q.type!=='BOHEMIA_FIGHT_ROOM')return;\n"
            "  G.cityRoom=q.room||null; G._roomFree=null; }); }catch(_e){}\n"
            "/* ===== V202 " + MARK + " ==========================\n"
            "   THE REQUEST IS A LATCH, NOT A MODE. setupEnemies consumes it and\n"
            "   clears it, so a fight built without a fresh message is never a\n"
            "   teaching fight -- which is what keeps the COMBAT bench's own FOES\n"
            "   buttons, and every fight after the first, ordinary. */\n"
            "try{ window.addEventListener('message',function(ev){\n"
            "  var q=ev&&ev.data; if(!q||q.type!=='BOHEMIA_FIRST_FIGHT')return;\n"
            "  G._teachReq=!!q.teach; }); }catch(_e){}\n"
            "/* THE WINDOW YOU CAN SEE IS THE WINDOW THAT IS JUDGED. Derived from\n"
            "   GOOD_MS and the 120 grid, never a second number: a tell that can\n"
            "   drift from the rule is a lie with a nice animation on it. */\n"
            "function teachBeatOpen(){ const w=GOOD_MS/(60000/120), ph=beatPhase();\n"
            "  return (ph<=w)||(ph>=1-w); }\n"
            "function teachAlpha(){ return teachBeatOpen()?1:0.34; }",
            1, 'blob/listener')

    # 2. ONE MAN, ON A STREET. Consumed here so it lands before the arena kind is
    #    decided (a room is the door's fight; the lesson is on the block).
    b = sub(b,
            "  if(G._bossOn&&G.encCurve!==false)G.numEnemies=6+Math.floor(Math.random()*3);\n"
            "  G.e=[]; const N=G.numEnemies;",
            "  if(G._bossOn&&G.encCurve!==false)G.numEnemies=6+Math.floor(Math.random()*3);\n"
            "  /* ===== V202 THE FIRST FIGHT IS ONE MAN ON A STREET ==============\n"
            "     Consumed and cleared HERE, above everything the board is built\n"
            "     from, so the arena kind, the cover, the deck and the spawn band\n"
            "     all read one flag that is already settled. IT IS A GROUP is the\n"
            "     SECOND lesson and it does not get to turn up in the first. */\n"
            "  G.teachBeat=!!G._teachReq; G._teachReq=false;\n"
            "  if(G.teachBeat){ G.numEnemies=1; G.cityRoom=null; }\n"
            "  G.e=[]; const N=G.numEnemies;",
            1, 'blob/one-man')

    # 3. NOWHERE TO HIDE. Cover, cars and the upper deck are all the SAME lesson
    #    (use the board), and it is not this one. The deck's own die is still
    #    thrown, so a normal fight's seeded stream is bit-for-bit untouched.
    b = sub(b,
            "  if(G.arenaKind==='warehouse'){ buildWarehouse(); } else if(G.arenaKind!=='room'){",
            "  if(G.arenaKind==='warehouse'){ buildWarehouse(); }\n"
            "  else if(G.arenaKind==='street'&&G.teachBeat){ /* V202: nowhere to hide */ }\n"
            "  else if(G.arenaKind!=='room'){",
            1, 'blob/no-cover')
    b = sub(b,
            "  if(G.arenaKind!=='room')scatterCars(G.arenaKind);",
            "  if(G.arenaKind!=='room'&&!G.teachBeat)scatterCars(G.arenaKind);   /* V202: a car is cover, and cover is a later lesson */",
            1, 'blob/no-cars')
    # the die is thrown FIRST so a fight with no lesson leaves the seeded stream
    # exactly where it found it -- V190's rule, one row along.
    b = sub(b,
            "  if(G.arenaKind==='warehouse'||Math.random()<0.72){\n"
            "    const dw=2+Math.floor(Math.random()*3)",
            "  if((G.arenaKind==='warehouse'||Math.random()<0.72)&&!G.teachBeat){\n"
            "    const dw=2+Math.floor(Math.random()*3)",
            1, 'blob/no-deck')

    # 4. A PLAIN MAN. composeRoster can hand back a blade or a machine; both are
    #    a different fight, and neither teaches timing.
    b = sub(b,
            "  const _roster=composeRoster(N);\n",
            "  const _roster=composeRoster(N);\n"
            "  /* V202: the teaching fight is a man with a gun. A blade closing on\n"
            "     you is a movement lesson and a machine is a durability one. */\n"
            "  if(G.teachBeat){ for(let _q=0;_q<_roster.length;_q++)_roster[_q]='human'; }\n",
            1, 'blob/plain-man')

    # 5. HE STANDS WHERE YOU CAN ALREADY SHOOT HIM. The whole spawn band exists to
    #    make the approach a phase; an approach is a lesson of its own and it is
    #    not this one.
    b = sub(b,
            "    e.beatOffset=Math.round((i/Math.max(1,N))*cycBeats());",
            "    /* V202: inside your reach at the bell, on purpose. NOBODY IS IN\n"
            "       RANGE ON TURN ONE is a real rule and it is teaching RANGE, which\n"
            "       is lesson three. Clamped by the same sight/board terms the band\n"
            "       above uses, so no ruler is invented here. */\n"
            "    if(G.teachBeat)e.edist=Math.min(sightTiles(), contentR(), Math.max(hd(PT_BLANK+2), _R*0.60));\n"
            "    e.beatOffset=Math.round((i/Math.max(1,N))*cycBeats());",
            1, 'blob/in-reach')

    # 6. NO COMPANION. She takes her own turn and she would win this fight for
    #    you, which deletes the lesson. THE COMPANION ACTS is the fourth one.
    b = sub(b,
            "function allyOn(){ return G.allyOff?false:ALLY_ON_DEFAULT; }",
            "function allyOn(){ return (G.allyOff||G.teachBeat)?false:ALLY_ON_DEFAULT; }   /* V202: the first fight is yours alone; THE COMPANION ACTS is a later lesson */",
            1, 'blob/no-ally')

    # 7. THE RULE ITSELF. Off the beat nothing lands. On the beat he goes down.
    b = sub(b,
            "  let kind; if(d<=hz)kind='kill'; else if(d<=vz)kind='vital'; else if(d<=hitz)kind='hit'; else kind='miss';",
            "  let kind; if(d<=hz)kind='kill'; else if(d<=vz)kind='vital'; else if(d<=hitz)kind='hit'; else kind='miss';\n"
            "  /* ===== V202 THE FIRST FIGHT: THE BEAT IS THE ONLY THING THAT COUNTS\n"
            "     The research is blunt -- the first encounter holds exactly ONE\n"
            "     obstacle that cannot be passed except by using the thing being\n"
            "     taught, and nothing else new. So on the teaching board the DIAL\n"
            "     does not decide, the PRESS does: off the beat nothing touches him,\n"
            "     on the beat he goes down. The grade is the SAME grade the groove\n"
            "     chain already reads (G._lastGrade, written eleven lines up), so\n"
            "     there is one judge of what on-the-beat means and not two. */\n"
            "  if(G.teachBeat){ const _tg=(G._lastGrade&&G._lastGrade.grade)||'';\n"
            "    kind=(_tg==='PERFECT'||_tg==='GOOD')?'kill':'miss'; }",
            1, 'blob/the-rule')

    # 8. AND YOU CAN SEE IT WITHOUT BEING TOLD. He is solid inside the window and
    #    a ghost outside it, off teachAlpha, which is GOOD_MS on the 120 grid.
    #    No text box, ever -- the row says so and the research says why.
    #
    #    PUT ON THE CALLER, NOT INSIDE drawEnemySprite, AND THAT IS THE WHOLE
    #    POINT. The first cut wrapped the sprite draw, and MEASURED ON THE REAL
    #    SURFACE drawEnemySprite was called 23 times in a second and a half and
    #    RETURNED FALSE EVERY TIME -- enemyLook() has no baked look for this man
    #    yet, so what a stranger actually sees is the fallback DISC one line
    #    below. The tell was in one of two draw paths and it was the path nobody
    #    was on. This is the one door both go through.
    b = sub(b,
            "    const _cov=false;   /* V18: the baked take-cover frames carry the crouch now */\n"
            "    if(!drawEnemySprite(x,e,ex,ey,nowMs)){",
            "    const _cov=false;   /* V18: the baked take-cover frames carry the crouch now */\n"
            "    /* ===== V202 HE IS ONLY THERE ON THE BEAT, AND YOU CAN SEE IT =====\n"
            "       Diegetic or nothing: the lesson is a property of the man, not a\n"
            "       tooltip about him. The same window the shot is graded by, and it\n"
            "       covers the sprite AND the disc, because which one you get depends\n"
            "       on whether a look has been baked yet. */\n"
            "    const _tbG=(G.teachBeat&&!e.dead&&!e.downed);\n"
            "    if(_tbG){ x.save(); x.globalAlpha=x.globalAlpha*teachAlpha();\n"
            "      /* WHERE HE LANDED ON THE GLASS, in device pixels, so a checker can\n"
            "         look at the PICTURE instead of asking the function what it would\n"
            "         have returned. Same shape as V197's ally draw record. */\n"
            "      try{ const _m=x.getTransform();\n"
            "        G._teachDraw={dx:_m.a*ex+_m.c*ey+_m.e, dy:_m.b*ex+_m.d*ey+_m.f,\n"
            "          r:Math.max(3,er*Math.abs(_m.a)), a:teachAlpha()}; }catch(_e){} }\n"
            "    if(!drawEnemySprite(x,e,ex,ey,nowMs)){",
            1, 'blob/ghost-open')
    b = sub(b,
            "    }\n"
            "    if(_cov)x.restore();\n",
            "    }\n"
            "    if(_tbG)x.restore();   /* V202 */\n"
            "    if(_cov)x.restore();\n",
            1, 'blob/ghost-close')
    return b


# --------------------------------------------------------------- THE SHELL ---
def patch_shell(s):
    if MARK in s:
        print('  shell already patched')
        return s

    # WHO REMEMBERS. The shell owns startEncounter and it owns the only storage
    # backend in the file that already has a memory fallback for the launchers
    # that throw on localStorage. Reuse-first: no second store, no save schema
    # touched (the run's save belongs to another lane).
    s = sub(s,
            "function cityEncounterIn(d){",
            "/* ===== V202 " + MARK + " =========================\n"
            "   THE LESSON REPEATS UNTIL IT IS LEARNED, and \"learned\" means WON.\n"
            "   Losing the first fight and coming back gives you the first fight\n"
            "   again, which is the research's own shape: an obstacle you cannot\n"
            "   pass except by using the thing being taught. It rides PERSIST's\n"
            "   backend, which already falls back to memory where a launcher\n"
            "   throws on localStorage, and it touches no other lane's save. */\n"
            "const FIRSTFIGHT_KEY='bohemia_first_fight_v1';\n"
            "function beatTaught(){ try{ return PERSIST.backend.getItem(FIRSTFIGHT_KEY)==='1'; }catch(_e){ return false; } }\n"
            "function markBeatTaught(){ try{ PERSIST.backend.setItem(FIRSTFIGHT_KEY,'1'); }catch(_e){} }\n"
            "function cityEncounterIn(d){",
            1, 'shell/store')

    # DECIDED BEFORE G.encounter IS BUILT, not next to the post. The first cut put
    # the const down by the postMessage and read it in the object literal above,
    # which is a temporal dead zone: startEncounter threw on every fight and the
    # flag never went out. It went red on the real surface, which is the only
    # reason it is not shipping.
    s = sub(s,
            "  const inv=BohemiaEngine.Inventory.fresh();",
            "  /* V202: decided ONCE, up here, because G.encounter below carries it\n"
            "     and the message further down sends it -- two readers, one answer.\n"
            "     AND AN AUTHORED FIGHT IS NEVER THE LESSON. A quest step or a hold-\n"
            "     line defence is a fight somebody wrote, with its own roster and its\n"
            "     own way to lose; replacing it with one man on an empty street would\n"
            "     break the thing that asked for it. The lesson waits for a fight the\n"
            "     world produced on its own, which is what a stranger meets anyway. */\n"
            "  const _teach=!beatTaught()&&!spec.questId&&!spec.defend;\n"
            "  const inv=BohemiaEngine.Inventory.fresh();",
            1, 'shell/decide')

    s = sub(s,
            "  combatPost({type:'BOHEMIA_FIGHT_ROOM',room:(spec.room||null)});",
            "  combatPost({type:'BOHEMIA_FIGHT_ROOM',room:(spec.room||null)});\n"
            "  /* V202: sent on EVERY encounter, true or false, so a fight that\n"
            "     follows the first one clears the flag instead of inheriting it. */\n"
            "  combatPost({type:'BOHEMIA_FIRST_FIGHT',teach:_teach});",
            1, 'shell/post')

    s = sub(s,
            "    defend:spec.defend||null,   /* V135: a second lose condition rides with the encounter */",
            "    defend:spec.defend||null,   /* V135: a second lose condition rides with the encounter */\n"
            "    taughtBeat:_teach,          /* V202: this one was the lesson */",
            1, 'shell/enc-flag')

    s = sub(s,
            "      if(enc.onEnd)try{enc.onEnd(enc.outcome);}catch(_e){}",
            "      /* V202: the beat is taught the moment the teaching fight is WON.\n"
            "         Marked on the outcome, never on the bell, so quitting or dying\n"
            "         in the middle of the lesson leaves the lesson standing. */\n"
            "      if(enc.taughtBeat&&enc.victory)markBeatTaught();\n"
            "      if(enc.onEnd)try{enc.onEnd(enc.outcome);}catch(_e){}",
            1, 'shell/learned')
    return s


def main():
    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('COMBAT_B64 not found')
    blob = base64.b64decode(m.group(1)).decode('utf-8')

    nb = patch_blob(blob)
    if nb is not blob and nb != blob:
        enc = base64.b64encode(nb.encode('utf-8')).decode('ascii')
        s = s[:m.start(1)] + enc + s[m.end(1):]

    s = patch_shell(s)

    # BUILD STAMP: he has to SEE which build he is on.
    s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
               r'\g<1>BUILD 9/6p - THE FIRST FIGHT TEACHES THE BEAT\g<2>', s, count=1)

    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('V202 applied to', ALPHA)


if __name__ == '__main__':
    main()
