#!/usr/bin/env python3
"""
V189 THE EXPERIENCE GOES INTO THE BUTTON -- he remembered a feature correctly and
it was half-connected.

  PAOLO 8/27: "BRO WHEN U KILLED PEOPLE OR DROPPED THEM BACK A MONTH AGO THE
  EXPERIENCE WOULD LOAD INTO YOUR BAR INTO YOUR CHARACTER INTO THE ACTION BUTTON
  WHERE YOUR FACE IS WHATS UP WITH THAT?"

*** HE IS RIGHT, HE IS PRECISE, AND THE FLIGHT WAS NEVER REMOVED. *** The GHOST
CHIP (Paolo 7/3/26) is a gold experience mote that arcs out of a body and homes on
the fire button, and the code says so in its own words:

    const ex2=W-92, ey2=H-92;   // the fire-button corner: you

It even accelerates on the way in. Nothing about that was deleted. TWO THINGS
WERE MISSING AND BOTH ARE THE SAME OMISSION -- the loop was built from both ends
and never joined in the middle:

  1. THE CHIP FIRES ON THE KILLSHOT CINEMATIC, NOT WHERE THE EXPERIENCE LANDS.
     V181 (8/25) moved the experience ONTO THE BODY and made you walk to it, on
     his own ruling -- "you get experience and loot OFF THEIR BODIES". The chip
     kept spawning at the moment of the kill. So the mote and the money came
     apart: you see gold fly at the instant of a kill and you collect the
     experience thirty seconds later by walking, with nothing on screen.

  2. THE BUTTON NEVER GOT ITS METER. The 7/3 comment ends "THE GREEN METER IS
     XP-BOUND LATER; this is its currency in flight." Later never came. The fire
     button carries his FACE, his HEALTH and a stamina orb (V129) and has never
     carried experience at all -- so the chips have been flying home to a button
     with nothing to fill for nearly two months.

AND UNTIL YESTERDAY THERE WAS NOTHING TO BIND IT TO. V188's tree is the first
thing in this game that gives experience a destination and a next level to be a
fraction of. THE METER COULD NOT HAVE BEEN BUILT BEFORE IT.

-------------------------------------------------------------------------
WHAT SHIPS
-------------------------------------------------------------------------
  * THE CHIPS FLY WHEN THE EXPERIENCE ACTUALLY LANDS -- out of the body you just
    walked onto, one per five points, homing on the button exactly as they always
    have. The killshot chip is untouched: that one is the KILL, this one is the
    PAYMENT, and V85 already ruled they are separate moments ("the stop belongs
    to the kill, the reward comes after it").
  * A GOLD RIM ON THE BUTTON, filling clockwise as you close on the next level.
    GOLD, matching the chip that feeds it, so the thing arriving and the thing
    filling are visibly the same substance -- and NOT green, because the green
    fluid in that button is stamina and two greens is the mush he complained
    about in the music.
  * AND THE CACHE KEY LEARNS ABOUT IT, which is the whole reason this could look
    finished and do nothing: the painted button is CACHED on a key of backdrop,
    wash, hp tier, stamina and lean. A meter that is not in the key repaints
    never. Same class as V129's own discovery that drawing the fluid behind an
    opaque portrait produced a BYTE-IDENTICAL button at zero and at full.

NO DAMAGE BEFORE THE DIAL: draws pixels and moves nothing. Not one damage,
accuracy, hp, armour or resource number changes.

REUSE CHECK: cooks no graphic pixels and opens no bank. The mote is the shipped
chip with its shipped flight; the rim is one arc on the 64x64 button canvas V129
already paints; the fraction comes from V188's tree.

TASTE CHECK: no new button, no new HUD, no number on screen. It fills the thing
his thumb is already on and his eye is already locked to.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel. The
rim is drawn on the button's own canvas, outside the portrait.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V189 THE EXPERIENCE GOES INTO THE BUTTON'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:160]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v189: already applied')
        return

    # ---- 1. HOW FULL THE RIM IS ----
    d = sub(d,
        "function treeLevel(){ return 1+Math.floor((TREE.xp||0)/XP_PER_LEVEL); }",
        """function treeLevel(){ return 1+Math.floor((TREE.xp||0)/XP_PER_LEVEL); }
/* ===== V189 THE EXPERIENCE GOES INTO THE BUTTON ====================
   Paolo 8/27: "WHEN U KILLED PEOPLE OR DROPPED THEM BACK A MONTH AGO THE
   EXPERIENCE WOULD LOAD INTO YOUR BAR INTO YOUR CHARACTER INTO THE ACTION BUTTON
   WHERE YOUR FACE IS WHATS UP WITH THAT?"
   HE IS RIGHT AND HE IS PRECISE. The 7/3 ghost chip already arcs out of a body
   and homes on the fire button, and the code says so in its own words: it sets
   the target to ex2=W-92, ey2=H-92 and labels that "the fire-button corner: you".
   What was missing is that its comment ends "THE GREEN METER IS XP-BOUND LATER",
   and later never came. The
   button has carried his face, his health and a stamina orb since V129 and has
   never carried experience, so the chips have been flying home to a button with
   nothing to fill.
   AND IT COULD NOT HAVE BEEN BUILT BEFORE NOW: V188's tree is the first thing in
   this game that gives experience a destination and a NEXT LEVEL to be a
   fraction of. */
function xpFrac(){ const x=(TREE.xp||0)%XP_PER_LEVEL; return Math.max(0,Math.min(1,x/XP_PER_LEVEL)); }""",
        what='xpFrac')

    # ---- 2. THE RIM, ON THE BUTTON HIS THUMB IS ON ----
    d = sub(d,
        "  if(stateWash){x.fillStyle=stateWash;x.fillRect(0,0,64,64);}",
        """  /* ===== V189 THE GOLD RIM =========================================
     Filling clockwise from the top as you close on the next level. GOLD, the
     same gold as the chip that feeds it, so the thing arriving and the thing
     filling are visibly one substance -- and deliberately NOT green, because the
     fluid behind it is STAMINA and two greens in one circle is exactly the mush
     he complained about in the music. Drawn last so nothing sits on top of it,
     and INSET so it never touches his portrait's pixels. */
  { const _xf=(typeof xpFrac==='function')?xpFrac():0;
    x.save();
    x.beginPath(); x.arc(32,32,29.5,0,Math.PI*2);
    x.strokeStyle='rgba(40,32,14,0.55)'; x.lineWidth=3; x.stroke();
    if(_xf>0){ x.beginPath();
      x.arc(32,32,29.5,-Math.PI/2,-Math.PI/2+Math.PI*2*_xf);
      x.strokeStyle='rgba(255,200,70,0.95)'; x.lineWidth=3;
      x.lineCap='round'; x.stroke(); }
    x.restore(); }
  if(stateWash){x.fillStyle=stateWash;x.fillRect(0,0,64,64);}""",
        what='the gold rim')

    # ---- 3. AND THE CACHE LEARNS ABOUT IT ----
    d = sub(d,
        "const key=portraitBackdrop()+'|'+(stateWash||'')+'|'+_hpTier+'|'+_stam+'|'+_lean;",
        """/* V189: THE FRACTION IS IN THE KEY, and that is the whole reason a meter can
     look finished and do nothing. This button is CACHED -- backdrop, wash, hp
     tier, stamina, lean -- and anything not in the key repaints NEVER. Same class
     as V129's own finding that drawing the fluid behind an opaque portrait gave a
     BYTE-IDENTICAL button at zero stamina and at full. Quantised to 40 steps so a
     single point of experience does not repaint the button. */
  const _xpK=Math.round(((typeof xpFrac==='function')?xpFrac():0)*40);
  const key=portraitBackdrop()+'|'+(stateWash||'')+'|'+_hpTier+'|'+_stam+'|'+_lean+'|'+_xpK;""",
        what='the cache key')

    # ---- 4. THE CHIPS FLY WHEN THE MONEY LANDS ----
    d = sub(d,
        "                try{ treeEarn(d.xp); }catch(_x){} }",
        """                try{ treeEarn(d.xp); }catch(_x){}
                /* V189: *** AND THE GOLD COMES OFF THE BODY YOU JUST WALKED ONTO. ***
                   The chip has always flown to the fire button; it fired at the
                   KILLSHOT, and V181 moved the experience onto the corpse and made
                   you walk to it. So the mote and the money came apart -- gold at
                   the kill, payment thirty seconds later with nothing on screen.
                   This is the payment. The killshot chip stays exactly as it was:
                   V85 already ruled they are separate moments, "the stop belongs
                   to the kill, the reward comes after it". */
                try{ const _n=Math.max(1,Math.min(6,Math.round(d.xp/5)));
                  const _sp=worldToScreen(Math.cos(d.ea)*d.edist,Math.sin(d.ea)*d.edist-0.4);
                  for(let _c=0;_c<_n;_c++)G._fx.push({type:'chip',
                    x:_sp[0]+(Math.random()-0.5)*14, y:_sp[1]+(Math.random()-0.5)*10,
                    t:-_c*0.07, life:1.05+_c*0.06}); }catch(_x){} }""",
        what='chips on pickup')

    # ---- 5. AND A LEVEL IS A MOMENT ----
    d = sub(d,
        "function treeEarn(n){ if(!n)return; TREE.xp=(TREE.xp||0)+n; treeSave();\n  try{ updTree(); }catch(_e){} }",
        """function treeEarn(n){ if(!n)return;
  const _was=treeLevel();
  TREE.xp=(TREE.xp||0)+n; treeSave();
  /* V189: a level is a MOMENT, not a number that quietly ticks over. */
  if(treeLevel()>_was)try{ setRead('LEVEL '+treeLevel(),'a point to spend, and the ring starts again','#e8c88a'); }catch(_e){}
  try{ updTree(); }catch(_e){} }""",
        what='the level moment')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v189: the experience goes into the button -- %d chars' % len(d))


if __name__ == '__main__':
    main()
