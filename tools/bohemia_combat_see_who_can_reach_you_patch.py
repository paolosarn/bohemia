#!/usr/bin/env python3
"""V148 YOU CAN SEE WHO CAN REACH YOU.

Paolo 8/12: "I think we to be able to see the range of all the Enemies weapons
would be really nice just to know when"

--------------------------------------------------------------------------
HE IS ASKING FOR THE THING THE WHOLE RANGE SYSTEM WAS MISSING
--------------------------------------------------------------------------
Every gun has a maximum range now, on both sides. A goon's pistol reaches 8
tiles after dark, a SEC-BOT's rifle reaches 22, a sniper 32. Those numbers
decide the entire fight -- and NOTHING ON SCREEN HAS EVER SAID ANY OF IT.

So the fight does this to him: he stands somewhere, takes fire, and cannot tell
whether he is being hit by one man or three, whether the man he is looking at can
even touch him, or whether one more step forward walks him into a second gun. He
told me two messages ago he was getting shot and could not answer; the reason
that felt arbitrary is that the board never showed the geometry it was using.

--------------------------------------------------------------------------
THE RESEARCH: INTO THE BREACH, AND WHY IT IS THE RIGHT MODEL
--------------------------------------------------------------------------
Into the Breach's central design is that enemy intent is COMPLETELY TRANSPARENT
BEFORE THE PLAYER COMMITS -- every attack telegraphed, so a turn is a puzzle you
can actually solve instead of a guess you get punished for. XCOM does the same
job with plain military iconography rather than prose.

The lesson both share, and the one this needs: THE INFORMATION MUST BE ON THE
BOARD, NEXT TO THE THING IT IS ABOUT, BEFORE THE DECISION. Not in a menu, not in
a log line after the damage.

--------------------------------------------------------------------------
WHAT SHIPS: ONE MARK PER MAN, AND IT ANSWERS ONE QUESTION
--------------------------------------------------------------------------
The question is his: CAN THIS ONE REACH ME, RIGHT NOW.

  SOLID RED PIP   he can shoot you where you stand
  HOLLOW PIP      he cannot -- he is still walking
  and the pip sits over his head, on him, not in a corner of the screen

EIGHT RANGE RINGS WOULD BE NOISE, WHICH IS WHY THERE ARE NONE. Six or eight
overlapping circles on a phone is a worse board, not an informed one. The ring is
drawn for ONE man only -- the one you have selected or are aiming at -- so you
can ask "what does HIS reach look like" without every other man shouting.

AND THE COUNT IS SAID IN WORDS, once, where the other readouts live: how many
guns have you right now, out of how many are on the field. That is the number he
was actually missing when he could not tell whether to move.

REUSE CHECK: cooks NO graphic pixels. It draws with the canvas primitives the
board already uses (the same arc/stroke shapes as the cover ring and the grenade
marker) and reads inHisRange/maxRange/foeRange, which V138 and V141 already
built. No bank is opened because no art is authored -- this is instrumentation on
existing geometry.

TASTE CHECK: authors no art. The taste risk is CLUTTER, and it is the reason
this is one small pip per man instead of eight rings: the board is already busy
with cover, blood, litter and bodies, and he has thrown out screens for being
noisy. One mark, one question, one answer.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region. The pip is drawn above the sprite and never
  touches it.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V148 YOU CAN SEE WHO CAN REACH YOU'
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
        print('v148 already in; nothing to do')
        return

    # ---- 1. the pip over each man ---------------------------------------
    old = """    if(e.gcov){ const _my=ey+MASS_DY;   /* V101: on HIM, not on the floor under him */
      const fa=Math.atan2(cy-_my,cx-ex); x.strokeStyle='rgba(150,170,205,0.7)'; x.lineWidth=3;
      x.beginPath();x.arc(ex,_my,er*1.6,fa-0.7,fa+0.7);x.stroke(); }"""
    new = """    if(e.gcov){ const _my=ey+MASS_DY;   /* V101: on HIM, not on the floor under him */
      const fa=Math.atan2(cy-_my,cx-ex); x.strokeStyle='rgba(150,170,205,0.7)'; x.lineWidth=3;
      x.beginPath();x.arc(ex,_my,er*1.6,fa-0.7,fa+0.7);x.stroke(); }
    /* ===== V148 YOU CAN SEE WHO CAN REACH YOU ====================
       Paolo 8/12: "I think we to be able to see the range of all the Enemies
       weapons would be really nice just to know when."
       Every gun has had a maximum range on both sides since V138 and NOTHING ON
       SCREEN EVER SAID ANY OF IT. He took fire and could not tell whether one
       man or three could touch him, or whether a step forward walked him into a
       second gun. The geometry decided the fight and stayed invisible.
       INTO THE BREACH IS THE MODEL: enemy intent transparent BEFORE the commit,
       on the board, next to the thing it is about -- not in a menu and not in a
       log line after the damage.
       ONE PIP, ONE QUESTION: can THIS one reach me right now.
         solid = he can shoot you where you stand
         hollow = he cannot, he is still walking
       EIGHT RANGE RINGS WOULD BE NOISE, so there are none -- the ring is drawn
       for the ONE man you are aiming at, below. */
    /* SIZED OFF THE TILE PITCH, NOT OFF THE SPRITE. The first cut scaled the pip
       from the body radius and came out ~2px on the zoomed-out board -- drawn,
       and completely unreadable, which is the same as not shipping it. It gets
       a dark halo too, because it has to read on pale sand and on dark asphalt. */
    if(!e.melee){ const _hot=inHisRange(e), _pr=Math.max(3,ring*0.22), _py=ey+MASS_DY-ring*0.85;
      x.save();
      x.fillStyle='rgba(0,0,0,0.55)'; x.beginPath(); x.arc(ex,_py,_pr+1.6,0,7); x.fill();
      if(_hot){ x.fillStyle='rgba(240,70,48,0.98)'; x.beginPath(); x.arc(ex,_py,_pr,0,7); x.fill();
        x.strokeStyle='rgba(255,190,175,0.9)'; x.lineWidth=1; x.beginPath(); x.arc(ex,_py,_pr,0,7); x.stroke(); }
      else { x.strokeStyle='rgba(210,220,235,0.75)'; x.lineWidth=Math.max(1.5,_pr*0.42);
        x.beginPath(); x.arc(ex,_py,_pr*0.82,0,7); x.stroke(); }
      x.restore(); }"""
    js = subN(js, old, new)

    # ---- 2. the ring, for ONE man only ----------------------------------
    old = """  if(!aimo&&G.hold){"""
    new = """  /* V148: THE RING IS FOR ONE MAN. Six or eight overlapping circles on a phone
     is a worse board, not an informed one -- so the reach bubble is drawn only
     for the man you have selected or are aiming at, and only while he is alive.
     Ask what HIS reach looks like without every other man shouting. */
  if(!aimo){ const _ri=(G.selTarget!=null)?G.selTarget:G.fireTarget;
    const _re=(_ri!=null&&_ri>=0)?G.e[_ri]:null;
    if(_re&&!_re.dead&&!_re.downed&&!_re.broken&&!_re.fleeing&&!_re.melee){
      const _rp=fieldPos(_re,W,H,cx,cy), _rr=maxRange(foeRange(_re))*ring;
      x.save(); x.strokeStyle='rgba(232,60,40,0.30)'; x.lineWidth=2; x.setLineDash([6,7]);
      x.beginPath(); x.arc(_rp[0],_rp[1],_rr,0,7); x.stroke(); x.setLineDash([]); x.restore(); } }
  if(!aimo&&G.hold){"""
    js = subN(js, old, new)

    # ---- 3. and the count, in words, once -------------------------------
    old = """function updGap(){ try{updRangeRead();}catch(_e){}   /* V88: the trade is on screen whenever the board is */"""
    new = """/* V148: THE NUMBER HE WAS ACTUALLY MISSING. How many guns have you right now,
   out of how many are on the field -- said in words, once, where the other
   readouts already live. That is what tells him whether to move. */
function threatCount(){ let hot=0,tot=0;
  for(const e of (G.e||[])){ if(!e||e.dead||e.downed||e.broken||e.fleeing||e.melee)continue;
    tot++; if(inHisRange(e))hot++; }
  return [hot,tot]; }
function updGap(){ try{updRangeRead();}catch(_e){}   /* V88: the trade is on screen whenever the board is */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v148: you can see who can reach you -- %d chars' % len(js))


if __name__ == '__main__':
    main()
