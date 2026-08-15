#!/usr/bin/env python3
"""V151 THE DAMAGE FACES, FOR REAL THIS TIME. AND HIS RANGE RULING.

Paolo [T17]: "I still didn't see my character's face change at all while I took
way less and way more damage in Health went down so I didn't see that."
Paolo [T17], a ruling: "can we just say for right now like whatever the
characters maximum range is for right now it just a couple tiles bigger than all
the Enemies... so I want to see more movement."

--------------------------------------------------------------------------
1. THE FACE. THIRD REPORT. THE BUG WAS MY LAST FIX.
--------------------------------------------------------------------------
Traced end to end this time instead of reading strings:
  the parent BUILDS ten frames        -- verified, 10 returned
  the parent SENDS them               -- verified, BOHEMIA_SPRITES carries
                                         portraits {you, dying, dmg:[10]}
  the frame RECEIVES them             -- and SPR.portraits came back NULL
So the receiver was eating them. Here is the receiver, in order:

    SPR.portraits=null;
    if(d.portraits&&d.portraits.you){
      if(...dmg...){ SPR.portraits=SPR.portraits||{};
                     SPR.portraits.dmg=...map(...); }      <- V146, my fix
      SPR.portraits={you:mkAt(...), dying:mkAt(...)};       <- ONE LINE LATER
    }

*** THE LINE AFTER MY FIX REPLACES THE WHOLE OBJECT WITH A FRESH LITERAL THAT
HAS NO dmg. *** I decoded ten frames and then threw them away one statement
later, and shipped it as the fix. He has now reported this three times and every
report was right.

WHY THE GATE WAS GREEN THROUGH ALL OF IT: it asserted the ASSIGNMENT EXISTS. A
string check cannot see that the next statement undoes it. That is the same
class as inMyRange being defined and never called -- code that is present and
dead -- and it is the third time this exact shape has cost him a session.

FIXED BY BUILDING THE OBJECT ONCE, with every face in the same literal, so there
is no window between filling it and replacing it.

--------------------------------------------------------------------------
2. HIS RANGE RULING: THE PLAYER OUTRANGES EVERYBODY, FOR NOW
--------------------------------------------------------------------------
"whatever the characters maximum range is for right now it just a couple tiles
bigger than all the Enemies... I want to see more movement."

That is a ruling and it is also, mechanically, the movement he keeps asking for.
If he outranges every gun on the field, THEY have to come to him -- and the men
walking in is exactly the movement he says he never sees. Standing still stops
being a way to avoid the fight and becomes the thing that starts it.

So his max range is floored at (the longest reach on the field) + RANGE_EDGE.
It is a FLOOR, never a cap: a rifle that already outreaches everyone keeps its
own number. And it reads the actual men in this fight, so it is right whatever
he is carrying and whoever showed up.

*** HE MARKED THIS TEMPORARY IN THE SAME BREATH *** -- "maybe we can work on
that in like the perk system or their statistics or whatever that they level up
that they get longer range capability". So the edge is one constant with his
words on it, ready to be replaced by earned range rather than granted range.

REUSE CHECK: cooks NO graphic pixels. Reuses mkAt, maxRange, foeRange and the
existing portrait message. Nothing authored, no bank opened.

TASTE CHECK: authors no art -- it rescues art that was already made and thrown
away. The taste failure being fixed is mine: ten damage faces were built to his
spec and never once reached his screen.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V151 THE DAMAGE FACES SURVIVE THE NEXT LINE'
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
        print('v151 already in; nothing to do')
        return

    old = """    if(d.portraits&&d.portraits.dmg&&d.portraits.dmg.length){
      /* V146: this used to land in SPR._dmgRaw, WHICH IS READ NOWHERE. The
         consumer reads SPR.portraits.dmg, so ten decoded damage faces were
         dropped on the floor on every handoff and his face never changed. */
      try{ SPR.portraits=SPR.portraits||{}; SPR.portraits.dmg=d.portraits.dmg.map(fr=>mkAt(fr,64,64)); SPR._dmgRaw=SPR.portraits.dmg; }
      catch(_e){ SPR._dmgRaw=null; if(SPR.portraits)SPR.portraits.dmg=null; } }
    SPR.portraits={you:mkAt(d.portraits.you,64,64),
                   dying:mkAt(d.portraits.dying,64,64)};"""
    new = """    /* ===== V151 THE DAMAGE FACES SURVIVE THE NEXT LINE ==========
       Paolo, THIRD report: "I still didn't see my character's face change at
       all while... Health went down."
       TRACED END TO END: the parent BUILDS ten frames, SENDS them (verified on
       the wire -- portraits {you, dying, dmg:[10]}), and SPR.portraits still
       came back NULL. The receiver was eating them, and the receiver was mine:
       V146 filled SPR.portraits.dmg and THE VERY NEXT STATEMENT replaced the
       whole object with a fresh {you, dying} literal that has no dmg. I decoded
       ten frames and threw them away one line later, then shipped it as the fix.
       AND THE GATE STAYED GREEN because it asserted the ASSIGNMENT EXISTS -- a
       string check cannot see the next statement undoing it. Same class as a
       function defined and never called: present, and dead.
       BUILT ONCE NOW, every face in one literal, so there is no window between
       filling it and replacing it. */
    let _dmgF=null;
    if(d.portraits.dmg&&d.portraits.dmg.length){
      try{ _dmgF=d.portraits.dmg.map(fr=>mkAt(fr,64,64)); }catch(_e){ _dmgF=null; } }
    SPR.portraits={you:mkAt(d.portraits.you,64,64),
                   dying:mkAt(d.portraits.dying,64,64),
                   dmg:_dmgF};
    SPR._dmgRaw=_dmgF;"""
    js = subN(js, old, new)

    # ---- his range ruling ------------------------------------------------
    old = """function myRange(){ return wpnRange(typeof WEAPON!=='undefined'?WEAPON:'pistol'); }"""
    new = """/* ===== V151 HIS RANGE RULING ==================================
   Paolo [T17]: "can we just say for right now like whatever the characters
   maximum range is for right now it just a couple tiles bigger than all the
   Enemies... so I want to see more movement."
   THAT IS THE MOVEMENT HE KEEPS ASKING FOR, mechanically. If he outreaches
   every gun on the field, THEY have to come to him -- and men walking in is
   exactly the movement he says he never sees. Standing still stops being a way
   to avoid the fight and becomes the thing that starts it.
   A FLOOR, NEVER A CAP: a rifle that already outreaches everyone keeps its own
   number. And it reads the men actually in THIS fight, so it is right whatever
   he is carrying and whoever turned up.
   *** HE MARKED IT TEMPORARY IN THE SAME BREATH *** -- "maybe we can work on
   that in like the perk system or their statistics or whatever that they level
   up that they get longer range capability" -- so this is one constant with his
   words on it, waiting to be replaced by EARNED range instead of granted. */
const RANGE_EDGE=3;   /* [DIAL] how many tiles he beats the whole field by, for now */
function longestFoeReach(){ let r=0;
  for(const e of (G.e||[])){ if(!e||e.dead||e.downed||e.broken||e.fleeing||e.melee)continue;
    const R=maxRange(foeRange(e)); if(R>r)r=R; }
  return r; }
function myRange(){ const base=wpnRange(typeof WEAPON!=='undefined'?WEAPON:'pistol');
  const need=longestFoeReach()+RANGE_EDGE;
  const mine=maxRange(base);
  if(!(need>mine))return base;
  /* express the floor in RAW tiles so maxRange's night scaling still applies to
     it the same way it applies to every other gun -- his edge must not quietly
     become an exemption from the dark. */
  const mult=(mine>0)?(maxRange(base)/Math.max(0.0001,base.max)):1;
  return {eff:base.eff, max:need/Math.max(0.0001,mult)}; }"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v151: the faces survive, and he outranges the field -- %d chars' % len(js))


if __name__ == '__main__':
    main()
