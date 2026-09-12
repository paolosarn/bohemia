#!/usr/bin/env python3
"""BOHEMIA DOWN NOT DEAD (9/12/26, PEOPLE lane).
VAMILY [down not dead], row YOUR-PEOPLE-DO-NOT-DIE-FOR-GOOD.

PAOLO 9/11, LOCKED: "I don't want anyone to permanently die, or even have
permanent debuffs. There could be debuffs that are a lot longer than others."

MEASURED FIRST, in the two files that ARE the game, comments stripped: no company
roster, no companion state, no downed state, no injury model, and nothing that
can kill a person you keep. The law is true today BY ACCIDENT, because there is
nobody to lose -- and the first system that can hurt a companion breaks it
silently with no check saying a word.

WHAT THIS WIRES:
  1. engine/bohemia_down.js inlined and fenced, so the resync sweeps it.
  2. THE BOOK of who is hurt, saved, and read back off the clock rather than
     remembered -- a save that sat on a shelf comes back healed.
  3. ctFall(id), THE PUBLISHED SEAM. COMBAT's [downed body] row owns what puts a
     body on the floor; this is what that call lands in. One line for them.
  4. The card he already opens says who is down and for how long, and the morning
     says it too, because "a long time" is the whole feeling of this law and it
     has to be somewhere he cannot miss.

WHO CAN FALL: the people you KEEP. Today that is the family tree -- the one you
married and the children you had -- because that is the only roster of kept
people the played game has. The companion joins the same seam the round COMBAT
lands the downed body; nothing here needs changing for that, which is why it is a
seam and not a special case.

  python3 tools/bohemia_city_down_not_dead_patch.py

Gate: gates/down_not_dead_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MOD = 'engine/bohemia_down.js'
MARK = '__CITY_DOWN_NOT_DEAD__'

FENCE_AFTER = '/* ==== /engine/bohemia_obligation.js (WHO IS WAITING ON YOU) ==== */'

# ---------------------------------------------------------------------------
# THE BOOK AND THE SEAM. Hung off the obligation block, because the list of
# people you keep is the same list both of them read.
F_OLD = """/* WHO ACTUALLY WENT. The module decides; this is the write, because a pure
   module does not reach out and remove somebody from the world. */
function ctOblApply(ids){"""

F_NEW = r"""/* ============================================================================
   __CITY_DOWN_NOT_DEAD__ (9/12) -- YOUR PEOPLE DO NOT DIE FOR GOOD.

   PAOLO 9/11, LOCKED: "I don't want anyone to permanently die, or even have
   permanent debuffs. There could be debuffs that are a lot longer than others."

   Measured before this existed: no roster, no downed state, no injury model,
   nothing that could kill a person you keep. The law held BY ACCIDENT. This is
   the promise built on purpose, so the first thing that can hurt a companion
   cannot break it quietly.

   THE BOOK IS READ AGAINST THE CLOCK, NOT REMEMBERED. Nothing has to tick it and
   nothing has to clear it: a save that sat on a shelf for a year comes back with
   everybody healed, because "are they down" is the game day against a number
   written when they fell.
   ========================================================================== */
var CT_DOWN = {}, CT_DOWN_KEY = 'boh.city.down';
function ctDownLoad(){
  try{ var raw = JSON.parse(localStorage.getItem(CT_DOWN_KEY) || 'null');
       if(raw && typeof raw === 'object') CT_DOWN = raw; }catch(_e){ CT_DOWN = {}; }
  return CT_DOWN;
}
function ctDownSave(){
  try{ localStorage.setItem(CT_DOWN_KEY, JSON.stringify(CT_DOWN)); }catch(_e){}
}

/* *** THE SEAM. COMBAT'S [downed body] ROW CALLS THIS AND NOTHING ELSE. ***
   Their half is the body on the floor: out of the fight, reachable, carried,
   never a corpse. This half is what is true about the PERSON afterwards. One
   line for them, and it is deliberately the only door -- a second way in is how
   two rules about the same thing start to disagree. */
function ctFall(id){
  if(id == null) return null;
  ctDownLoad();
  var r = null;
  try{ r = BohemiaDown.fall(CT_DOWN, String(id), (T.day|0)); }catch(_e){ return null; }
  if(r) ctDownSave();
  return r;
}
/* AND THE QUESTIONS, for any surface that wants to ask. */
function ctIsDown(id){
  try{ return BohemiaDown.isDown(ctDownLoad(), String(id), (T.day|0)); }
  catch(_e){ return false; }
}
function ctDownSay(id){
  try{ return BohemiaDown.say(ctDownLoad(), String(id), (T.day|0)); }
  catch(_e){ return null; }
}
/* WHO OF YOUR OWN PEOPLE IS DOWN RIGHT NOW. The people you KEEP, which today is
   the family tree -- the one you married and the children you had. The companion
   lands on the same seam the round COMBAT ships the downed body, and nothing
   here changes for it. */
function ctDownMine(){
  var out = [];
  try{
    var t = famTree() || [];
    for (var i = 0; i < t.length; i++){
      var n = t[i];
      if (!n || !n.alive) continue;
      if (n.rel !== 'spouse' && n.rel !== 'child') continue;
      if (ctIsDown(n.id)) out.push(n);
    }
  }catch(_e){}
  return out;
}

/* WHO ACTUALLY WENT. The module decides; this is the write, because a pure
   module does not reach out and remove somebody from the world. */
function ctOblApply(ids){"""

# ---------------------------------------------------------------------------
# THE CARD HE ALREADY OPENS SAYS WHO IS DOWN.
C_OLD = """      if(_kd.length){
        h += '<div class="rrow"><span class="rk">YOUR CHILDREN</span><span class="rv">'"""

C_NEW = r"""      /* __CITY_DOWN_NOT_DEAD__ -- AND WHO IS HURT, AND FOR HOW LONG. It goes
         with the family because these are the people you keep, and the LENGTH is
         the whole feeling of his law: "debuffs that are a lot longer than
         others". A bar would not carry that; a season would. draft:true. */
      try{
        var _dn = ctDownMine();
        for(var _di = 0; _di < _dn.length; _di++){
          h += '<div class="rrow"><span class="rk">'
             + esc(BohemiaFamily.say(_t, _dn[_di]) || 'ONE OF YOURS')
             + ' IS DOWN</span><span class="rv">'
             + esc(ctDownSay(_dn[_di].id) || '') + '</span></div>';
        }
        if(_dn.length)
          h += ctNote('Down, not gone. Nobody you keep is lost for good.');
      }catch(_e){}
      if(_kd.length){
        h += '<div class="rrow"><span class="rk">YOUR CHILDREN</span><span class="rv">'"""

# ---------------------------------------------------------------------------
# AND THE MORNING SAYS IT TOO, beside who is waiting on him.
W_OLD = """  try{
    var _ob = (DAY.history && DAY.history.length)
            ? DAY.history[DAY.history.length-1].obligation : null;"""

W_NEW = r"""  /* __CITY_DOWN_NOT_DEAD__ -- WHO IS STILL HURT THIS MORNING. Above the
     obligation line, because somebody being hurt is why they could not be there.
     Absent entirely on a morning with nobody down, which is the honest empty
     state and not a zero. draft:true. */
  try{
    var _dwn = ctDownMine();
    if(_dwn.length){
      var _tt = famTree();
      for(var _dw = 0; _dw < _dwn.length; _dw++){
        h += '<p>'+esc((BohemiaFamily.say(_tt,_dwn[_dw]) || 'ONE OF YOURS')
             + ' IS STILL DOWN. ' + (ctDownSay(_dwn[_dw].id) || ''))+'</p>';
      }
    }
  }catch(_e){}
  try{
    var _ob = (DAY.history && DAY.history.length)
            ? DAY.history[DAY.history.length-1].obligation : null;"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    if FENCE_AFTER not in html:
        sys.exit('FAILED: the obligation fence is not in %s.' % CITY)
    for name, anchor in [('the obligation block', F_OLD), ('the card rows', C_OLD),
                         ('the morning', W_OLD)]:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))

    src = open(MOD, encoding='utf-8').read()
    block = ('\n/* ==== engine/bohemia_down.js (DOWN, NOT DEAD, inlined verbatim) ==== */\n'
             + src
             + '\n/* ==== /engine/bohemia_down.js (DOWN, NOT DEAD) ==== */\n')
    html = html.replace(FENCE_AFTER, FENCE_AFTER + block, 1)
    html = html.replace(F_OLD, F_NEW, 1)
    html = html.replace(C_OLD, C_NEW, 1)
    html = html.replace(W_OLD, W_NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  [down not dead]')


if __name__ == '__main__':
    main()
