#!/usr/bin/env python3
"""
BOHEMIA CITY BELONG-PERSIST PATCH -- the whole belonging system had no memory.
(8/21/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md (sec 4n)
Gate: gates/faction_arc_gate.js (part Q, new -- the first claim in this lane
      that RELOADS THE PAGE)

REUSE CHECK (REUSE-FIRST): cooks nothing and invents no storage. The city already
persists CT_MET to localStorage 'boh.city.met', hydrates it at boot, and exposes a
wipe() beside it. This is that exact pattern, second key, same seam -- ctSave() is
already called at every moment worth saving.

--------------------------------------------------------------------------
THE TWELFTH, AND IT IS EVERYTHING THIS LANE BUILT ALL WEEK
--------------------------------------------------------------------------
    function ctBelongSave(){
      if(!window.__CT_BELONG) window.__CT_BELONG = { meta:{} };
      return window.__CT_BELONG;
    }

A plain window object. Nothing writes it, nothing reads it back. MEASURED on the
real city page -- do real work for the Cartel, commit all the way, take on a debt,
then reload the tab:

    gave         9  ->  0     LOST
    commitment   burned -> none   LOST
    owed         4  ->  0     LOST
    name asked   true -> true   survived

Eleven times this week an organ computed something and nothing on the walked
surface called it. This is the same shape one level higher and it is the largest:
THE SURFACE CALLS EVERYTHING CORRECTLY AND NOTHING REMEMBERS IT. Standing,
commitment, debt, claims, neglect, the wall, the whole ladder -- every one of them
evaporates when the tab closes.

--------------------------------------------------------------------------
AND THE HALF THAT SURVIVED MAKES IT WORSE, NOT BETTER
--------------------------------------------------------------------------
CT_MET persists. So the game REMEMBERS YOUR NAME AND FORGETS THAT YOU BURNED A
BRIDGE FOR THEM. You walk back up to somebody you bled for and they greet you by
name as a stranger with no standing.

That is A COUNT IS NOT A MEMORY (8/20) one level up, and the same lesson: the
game kept the small fact and dropped the large one, and each half was individually
correct.

--------------------------------------------------------------------------
WHAT IT DOES
--------------------------------------------------------------------------
ONE SEAM, NOT TWENTY. The writers are BohemiaBelonging.record/adjust,
BohemiaCommitment.setState, and the claim and favour ledgers -- hooking each is
five chances to miss one. ctSave() is ALREADY called at every point the city
considers worth saving, so it saves both facts now, and ctBelongSave() hydrates on
first read. One writer, one reader, same law as ctGiveCapped.

IT VERSIONS THE BLOB. A save written by an older shape must not crash a newer
read; an unreadable blob is DISCARDED, never half-applied, because a partially
restored standing is worse than a fresh one -- you cannot see that it is wrong.

AND wipe() TAKES BOTH. The debug wipe next to it removed only 'boh.city.met',
which would have left a player's standing behind after they asked for a clean
slate -- a wipe that leaves half the save is not a wipe.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_BELONGSAVE__'

OLD_SAVE = """function ctSave(){ try{ localStorage.setItem('boh.city.met', JSON.stringify(CT_MET.serialize())); }catch(_e){} }"""
NEW_SAVE = """function ctSave(){
  try{ localStorage.setItem('boh.city.met', JSON.stringify(CT_MET.serialize())); }catch(_e){}
  ctBelongPersist();          /* """ + MARKER + """ */
}
/* """ + MARKER + """ -- THE BELONGING SYSTEM HAD NO MEMORY.
   window.__CT_BELONG was a plain object: nothing wrote it, nothing read it back.
   MEASURED on the real page -- work for the Cartel, commit, take a debt, reload:
   gave 9->0, commitment burned->none, owed 4->0, and the NAME survived. So the
   game remembered your name and forgot that you burned a bridge for them.
   ONE SEAM, NOT TWENTY: the writers are record/adjust/setState and two ledgers,
   and hooking each is five chances to miss one. ctSave() is already called at
   every moment the city thinks worth saving, so it carries both facts. */
var CT_BELONG_KEY = 'boh.city.belong';
var CT_BELONG_VER = 1;
function ctBelongPersist(){
  try{
    var sv = window.__CT_BELONG;
    if(!sv || !sv.meta) return;
    localStorage.setItem(CT_BELONG_KEY,
      JSON.stringify({ v:CT_BELONG_VER, meta:sv.meta }));
  }catch(_e){}
}
function ctBelongHydrate(){
  /* AN UNREADABLE BLOB IS DISCARDED, NEVER HALF-APPLIED. A partially restored
     standing is worse than a fresh one because you cannot see that it is wrong. */
  try{
    var raw = JSON.parse(localStorage.getItem(CT_BELONG_KEY) || 'null');
    if(!raw || raw.v !== CT_BELONG_VER || !raw.meta || typeof raw.meta !== 'object')
      return { meta:{} };
    return { meta: raw.meta };
  }catch(_e){ return { meta:{} }; }
}"""

OLD_READ = """function ctBelongSave(){
  if(!window.__CT_BELONG) window.__CT_BELONG = { meta:{} };
  return window.__CT_BELONG;
}"""
NEW_READ = """function ctBelongSave(){
  /* """ + MARKER + """ -- hydrate on first read. One reader, one writer. */
  if(!window.__CT_BELONG) window.__CT_BELONG = ctBelongHydrate();
  return window.__CT_BELONG;
}"""

OLD_WIPE = """              wipe:function(){ try{localStorage.removeItem('boh.city.met');}catch(_e){}"""
NEW_WIPE = """              wipe:function(){ try{localStorage.removeItem('boh.city.met');}catch(_e){}
                /* """ + MARKER + """ -- A WIPE THAT LEAVES HALF THE SAVE IS NOT A
                   WIPE. This removed only the met-ledger, which would have left a
                   player's standing and commitments behind after they asked for a
                   clean slate. */
                try{localStorage.removeItem(CT_BELONG_KEY); window.__CT_BELONG=null;}catch(_e){}"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((OLD_SAVE, NEW_SAVE, 'the save function'),
                           (OLD_READ, NEW_READ, 'the belong reader'),
                           (OLD_WIPE, NEW_WIPE, 'the debug wipe')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY BELONGSAVE: standing, commitment and debt survive a reload')


if __name__ == '__main__':
    main()
