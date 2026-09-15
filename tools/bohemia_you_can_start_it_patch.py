#!/usr/bin/env python3
"""
V217 -- YOU CAN START IT  (COMBAT lane, VAMILY [start a fight])

*** PAOLO 9/15: "I don't even know how to engage in combat and when that shit
    starts." ***

THE ROW HAS TWO HALVES AND BOTH ARE HERE:
  (1) ON PURPOSE   a hostile body is on the glass and TAPPING IT STARTS THE FIGHT.
  (2) IT SAYS SO   when the fight starts the screen says so, and says what to press.

WHAT WAS MEASURED FIRST, ON THE ALPHA, BEFORE A LINE WAS WRITTEN. Three numbers
say why he could not start one and why he never met one:

  A TAP ON THE WALKED STREET DOES NOTHING.   Measured: a real tap in the middle of
  the glass produced ZERO encounters. In MODE 'human' the canvas handler does pinch
  zoom, a double-tap zoom reset, and a drag test -- and tpTap was removed at the
  trigger in 8/24 (correctly: it rebuilt a dead judge panel). So the most obvious
  gesture a person has was wired to nothing. There was NO input anywhere in the
  game that means "fight them". Bumping a body works (V201) and bumping is not a
  decision; it is something that happens to you.

  NOTHING IS ON THE GLASS AT THE DOOR.       hostilePass asks for crews inside
  seeR = ceil(max(canvas)/C/2)+6, and at the house-scale zoom the real numbers are
  C 44, canvas 418x861, SO seeR IS 16 FINE CELLS. The nearest hostile crew to where
  he wakes is at 24, then 31, then 32. Zero bodies drawn at the door, zero after a
  minute of walking. The crews are real, RUN placed them, and they are 8 cells
  outside the radius that can draw one. THAT HALF IS NOT MINE and it is routed: the
  spacing between crews is 90 cells and the spawn is RUN's [wake near].

  THE STREET IS FORBIDDEN TO FIGHT HIM FOR THE FIRST TWO MINUTES.  SF_GRACE is 40
  steps and the measured walk rate is 20 fine cells a minute, so V201's own dial
  rules out a street fight for exactly the window the row is about.

SO THE SPLIT THIS SHIPS, AND IT IS THE HONEST ONE: GRACE IS ABOUT BEING JUMPED.
SF_GRACE exists for the __NOT_YOUR_OWN_HOUSE__ lesson -- nobody should be ambushed
on his own doorstep -- and that is untouched. A fight HE STARTS is not an ambush, so
the tap does not wait out the grace. The cooldown still applies (one bad block is
not a corridor of fights) and one crew is still one fight, both through the same
SF_DONE / SF_LAST the bump path uses, so the two paths cannot disagree.

AND IT GOES THROUGH THE ONE DOOR. cityHandOver is the single seam all four fight
entries use, so the tap inherits the two-beat camera pull-back and the cloud (V205),
the save at the bell (V215), the day (V207) and the plate charge (V211) with no new
wire. That reuse is the whole reason the door exists.

WHAT THE SCREEN SAID AT THE BELL, MEASURED THROUGH THE SHIPPED DOOR:
    "READY  --  read the horizon, pop on green"
That is fullResetCombat's bench line. It does not say a fight has started, and
"pop on green" names a mechanic a first-time player has never seen. Worse, it is
not even meant to be there: V202 reserved the readout for the teaching fight, and
BOTH worldRead and plateRead stand down with the comment "the lesson owns the
readout" -- AND THE LESSON NEVER WROTE A LINE. A reservation nobody filled. So the
first fight of the game has been telling him to read a horizon.
Now the lesson writes the line it reserved: A FIGHT HAS STARTED, and what to press.
The button in the cover phase is labelled FIRE and pressing it pops the dial open,
so the line names FIRE, twice, which is what a thumb actually does. [draft:true --
the words are an attempt, WORDS owns them.]

NO DAMAGE BEFORE THE DIAL: nothing below touches a number in a fight. The roster
size is the crew's OWN count, which RUN decided, exactly as the bump path reads it.

RULE 14(a): the city half reaches the demo immediately (it is loaded by path); the
blob half is inside the demo's frozen shell and waits for RUN's cut. Routed.
"""
import base64
import re
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__YOU_CAN_START_IT__'

# ---------------------------------------------------------------- city: record the blit
OLD_RESET = """function hostilePass(ox, oy, C){
  HOST_DREW = [];"""

NEW_RESET = """function hostilePass(ox, oy, C){
  HOST_DREW = [];
  HOST_HIT = [];   /* V217 __YOU_CAN_START_IT__: cleared with HOST_DREW, same frame, same rule */"""

OLD_BLIT = """      try { g.drawImage(pplTinted(dir, (k * 37 + 11) % 97, img), dx0, dy0, lad, lad); }
      catch(_e) { g.drawImage(img, dx0, dy0, lad, lad); }
      drawn++;"""

NEW_BLIT = """      try { g.drawImage(pplTinted(dir, (k * 37 + 11) % 97, img), dx0, dy0, lad, lad); }
      catch(_e) { g.drawImage(img, dx0, dy0, lad, lad); }
      drawn++;
      /* V217 __YOU_CAN_START_IT__ (COMBAT): AND WHAT WAS BLITTED IS RECORDED, so a
         tap can be tested against the rectangle this frame really used. The
         alternative was a second copy of this geometry in another function -- lad
         switches on C, the sprite hangs UP from the cell (dy0 = sy + C - lad) and
         is centred on it -- and a hit test derived from a copy is a hit test that
         drifts. Same rule as HOST_SPR three lines up: record the thing that
         happened, never the flag that chose it. One line, no behaviour. */
      HOST_HIT.push({ crew: cw, x: dx0, y: dy0, w: lad, h: lad });"""

# ---------------------------------------------------------------- city: the tap and the line
OLD_TAIL = """function cityFightOnEnter(){
  if(!INSIDE||!cityFightRoll())return false;"""

NEW_TAIL = """/* ===== V217 __YOU_CAN_START_IT__ -- A FIGHT YOU CHOOSE ======================
   PAOLO 9/15: "I don't even know how to engage in combat and when that shit
   starts." Measured before writing this: a real tap on the walked street produced
   ZERO encounters, because in MODE 'human' the canvas handler only pinches, resets
   the zoom on a double tap, and measures drag. There was no input anywhere in the
   game that means "fight them". Bumping a body works (V201) and bumping is not a
   decision, it is something that happens to you.
   ONE CREW IS STILL ONE FIGHT and the cooldown still holds, both through the same
   SF_DONE and SF_LAST the bump path uses, so the two paths cannot disagree about
   what has already happened.
   AND IT DOES NOT WAIT OUT SF_GRACE, on purpose. Grace is the
   __NOT_YOUR_OWN_HOUSE__ lesson: nobody gets JUMPED on his own doorstep. A fight he
   walks up to and taps is not an ambush. Measured, that distinction is the whole
   row: grace is 40 steps and the real walk rate is 20 fine cells a minute, so the
   street cannot start a fight for the first two minutes of the game. The bump path
   keeps every step of its grace. */
var TAP_FOE_SAID = {};

/* WHICH BODY DID HE TAP. HOST_HIT is the rectangle the frame actually blitted, so
   this asks the drawing and never a copy of it. Back to front, because the last
   body drawn is the one on top. */
function streetTapFoe(sx, sy){
  try{
    if(typeof HOST_HIT==='undefined' || !HOST_HIT || !HOST_HIT.length) return null;
    for(var i=HOST_HIT.length-1;i>=0;i--){
      var r=HOST_HIT[i]; if(!r||!r.crew||!r.crew.at) continue;
      if(sx>=r.x && sx<=r.x+r.w && sy>=r.y && sy<=r.y+r.h) return r.crew;
    }
  }catch(_e){}
  return null;
}

/* THE TAP IS THE FIGHT. The same message the bump sends, with no room, so it lands
   on a street board -- and through cityHandOver, the one door, which is where the
   camera pull-back, the cloud, the save, the day and the plate charge already live.
   why:'tapped' so every downstream reader can tell a chosen fight from an ambush. */
function streetTapFight(sx, sy){
  if(typeof INSIDE!=='undefined' && INSIDE) return false;
  if(!(window.parent&&window.parent!==window)) return false;
  try{ if(CITY_CONTACT_POSTED) return false; }catch(_e){}
  var crew=streetTapFoe(sx, sy);
  if(!crew || !crew.at) return false;
  var ck='crew:'+crew.at[0]+','+crew.at[1];
  try{ if(SF_DONE[ck]) return false; }catch(_e){}
  try{ if(SF_STEPS - SF_LAST < SF_COOLDOWN) return false; }catch(_e){}
  var cn=Math.max(1,Math.min(8,crew.count|0)), roster=[];
  for(var i=0;i<cn;i++) roster.push({arch:(i%4===3)?'bot':'human'});
  var fac=null; try{ fac=(typeof cityFactionHere==='function')?cityFactionHere():null; }catch(_e){}
  if(!cityHandOver({type:'BOHEMIA_CITY_ENCOUNTER',
    label:'out on the block', faction:fac, draft:true, roster:roster,
    street:true, why:'tapped',
    at:{gx:hx|0, gy:hy|0}})) return false;
  try{ SF_DONE[ck]=1; SF_LAST=SF_STEPS; }catch(_e){}
  try{ CITY_CONTACT_POSTED=true; }catch(_e){}
  return true;
}

/* AND HE IS TOLD, ONCE PER CREW, BECAUSE A CONTROL NOBODY MENTIONS IS NOT A
   CONTROL. It reads the state the crew's own model decided (close beats watch
   beats idle) rather than inventing a second opinion about how close they are, and
   it speaks through streetSay, the street's one shared line, which already clears
   itself after the director's own gap.
   [draft:true] the wording is an attempt; WORDS owns it. */
function streetFoeSeen(){
  if(typeof INSIDE!=='undefined' && INSIDE) return false;
  try{ if(CITY_CONTACT_POSTED) return false; }catch(_e){}   /* a fight outranks a line about one */
  if(typeof HOST_DREW==='undefined' || !HOST_DREW || !HOST_DREW.length) return false;
  var rank={close:3,watch:2,idle:1}, cw=null, best=0;
  for(var i=0;i<HOST_DREW.length;i++){
    var c=HOST_DREW[i]; if(!c||!c.at) continue;
    var r=rank[c.state]||1;
    if(r>best){ best=r; cw=c; }
  }
  if(!cw) return false;
  var ck=cw.at[0]+','+cw.at[1];
  if(TAP_FOE_SAID[ck]) return false;
  try{ if(SF_DONE['crew:'+ck]) return false; }catch(_e){}
  TAP_FOE_SAID[ck]=1;
  var n=Math.max(1,cw.count|0), who=(n===1)?'ONE OF THEM':(n+' OF THEM');
  var txt=(cw.state==='close')?(who+' ARE COMING FOR YOU. TAP ONE AND IT STARTS.')
        :(cw.state==='watch')?(who+' HAVE CLOCKED YOU. TAP ONE AND IT STARTS.')
        :(who+' AND THEY ARE NOT FRIENDLY. TAP ONE AND IT STARTS.');
  if(n===1) txt=txt.replace('ARE COMING','IS COMING').replace('HAVE CLOCKED','HAS CLOCKED');
  return !!streetSay(txt);
}
/* ===== /V217 __YOU_CAN_START_IT__ ===== */
function cityFightOnEnter(){
  if(!INSIDE||!cityFightRoll())return false;"""

OLD_STEP = """      try { streetFightOnStep(); } catch(_e){}"""

NEW_STEP = """      try { streetFightOnStep(); } catch(_e){}
      /* V217 __YOU_CAN_START_IT__: and if nobody jumped him, the street says who is
         standing there and that tapping one starts it. After the fight check, never
         before it: a line about a fight must not cover a fight. */
      try { streetFoeSeen(); } catch(_e){}"""

OLD_TAP = """    if(typeof TP!=='undefined'){ TP._tapStart=null; }
    pts.delete(e.pointerId);"""

NEW_TAP = """    /* V217 __YOU_CAN_START_IT__: A TAP ON A HOSTILE BODY STARTS THE FIGHT. It reuses
       the walked view's OWN tap-versus-drag test (TP._tapMoved, set by the same
       handler pair above) rather than inventing a second one, so a drag still looks
       around and a pinch is still a pinch. A tap on anything else is unchanged and
       does nothing, which is what it did before. */
    if(MODE==='human' && typeof TP!=='undefined' && TP._tapStart && TP._tapMoved<8 && pts.size<=1){
      try{ streetTapFight(TP._tapStart.x, TP._tapStart.y); }catch(_e){}
    }
    if(typeof TP!=='undefined'){ TP._tapStart=null; }
    pts.delete(e.pointerId);"""

OLD_HOSTVARS = "var HOST_DREW = [], HOST_DENSITY = 1.0, HOST_DANGER = null, HOST_OWNER = {};"
NEW_HOSTVARS = ("var HOST_DREW = [], HOST_DENSITY = 1.0, HOST_DANGER = null, HOST_OWNER = {};\n"
                "var HOST_HIT = [];   /* V217 __YOU_CAN_START_IT__ (COMBAT): the rectangles this frame blitted, so a tap can be tested against the drawing */")

# ---------------------------------------------------------------- blob: the line at the bell
OLD_CHAIN = "    try{ if(!plateRead())worldRead(); }catch(_e){} },"
NEW_CHAIN = """    /* V217 __YOU_CAN_START_IT__: AND FIRST OF ALL, THAT A FIGHT HAS STARTED. Paolo
       9/15: "I don't even know how to engage in combat and when that shit starts."
       Ahead of both of these because it is the one line a person who has never been
       in a fight can act on, and it only speaks on the teaching fight, so nothing
       later loses its plate warning or its weather. */
    try{ if(!fightStartRead() && !plateRead())worldRead(); }catch(_e){} },"""

OLD_BLOBTAIL = "/* ===== /V211 __PLATE_COSTS_TAPE__ ===== */"
NEW_BLOBTAIL = """/* ===== /V211 __PLATE_COSTS_TAPE__ ===== */
/* ===== V217 __YOU_CAN_START_IT__ -- THE SCREEN SAYS A FIGHT HAS STARTED =====
   MEASURED THROUGH THE SHIPPED CITY DOOR, on the first fight of a fresh game:
       "READY  --  read the horizon, pop on green"
   That is fullResetCombat's bench line. It does not say a fight has started, and
   "pop on green" names a mechanic a first-time player has never seen.
   AND IT IS NOT EVEN MEANT TO BE THERE. V202 reserved this line for the teaching
   fight and BOTH readers stand down for it -- worldRead and plateRead each carry
   the comment "the lesson owns the readout" -- AND THE LESSON NEVER WROTE ONE. A
   reservation nobody filled, so the first fight of the game has been telling him to
   read a horizon.
   WHAT TO PRESS, NAMED OFF THE REAL BUTTON: in the cover phase #fire is labelled
   FIRE and pressing it opens the dial, then the release is the shot. So the line
   says FIRE twice, which is what a thumb actually does. On the teaching board the
   dial does not decide and the PRESS does (V202: off the beat nothing touches him),
   which is why the second half of the line is the beat and not the aim.
   [draft:true] the words are an attempt; WORDS owns them. */
function fightStartRead(){
  if(!G.teachBeat)return false;
  try{ setRead('A FIGHT HAS STARTED','press FIRE, then FIRE again on the beat','#e8593a'); }
  catch(_e){ return false; }
  return true; }
/* ===== /V217 __YOU_CAN_START_IT__ ===== */"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES.

    V214 shipped a font swap that terminated a JS string and stopped the fight
    defining G, and my own guard missed it because it only checked that the words
    were gone. The first cut of THIS tool left a block comment unterminated and the
    whole last script of the fight went silent -- same class, one round later. A
    guard that checks the text it wrote rather than whether the file still runs is
    not a guard. So: node --check every script.
    """
    import os
    import subprocess
    import tempfile
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def sub(s, old, new, what):
    n = s.count(old)
    if n != 1:
        sys.exit('ANCHOR %s: expected 1, found %d' % (what, n))
    return s.replace(old, new, 1)


def main():
    city = open(CITY, encoding='utf-8').read()
    if MARK in city:
        print('  the city already lets him start it')
    else:
        city = sub(city, OLD_HOSTVARS, NEW_HOSTVARS, 'city/HOST_DREW vars')
        city = sub(city, OLD_RESET, NEW_RESET, 'city/hostilePass reset')
        city = sub(city, OLD_BLIT, NEW_BLIT, 'city/hostilePass blit')
        city = sub(city, OLD_TAIL, NEW_TAIL, 'city/cityFightOnEnter')
        city = sub(city, OLD_STEP, NEW_STEP, 'city/stepOnce street fight hook')
        city = sub(city, OLD_TAP, NEW_TAP, 'city/pointerup')
        open(CITY, 'w', encoding='utf-8').write(city)
        print('V217 applied to', CITY)

    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the fight already says a fight has started')
        return
    blob = sub(blob, OLD_CHAIN, NEW_CHAIN, 'blob/readout chain')
    blob = sub(blob, OLD_BLOBTAIL, NEW_BLOBTAIL, 'blob/fightStartRead')
    if blob.count('function fightStartRead()') != 1:
        sys.exit('GUARD: fightStartRead is not defined exactly once')
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V217 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
