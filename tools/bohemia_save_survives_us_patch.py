#!/usr/bin/env python3
"""
THE SAVE HAS TO SURVIVE US, NOT JUST THE PHONE (8/17/26, RUN lane). P0-SAVE.

Demo board row 6, corrected 8/15 and routed here as P0 "before the friends
round":

    "DURABILITY IS NOT COMPATIBILITY: this audit verified that the bytes survive
     the BROWSER and never asked whether they survive US."

MEASURED FIRST, AND THE BOARD'S PHRASING NEEDS ONE CORRECTION. It says "the three
components stamp three different version numbers", which reads as one number
written three ways. It is not. They are THREE DIFFERENT LAYERS and it is correct
that they differ:

    bohemia_save.js   v:1   the ENVELOPE   {v,gen,t,data,prefabs} -- storage format
    citySnapshot()    v:1   the PAYLOAD    what is actually in the save
    bohemia_engine.js   7   the ENGINE SAVE, a different save entirely

The real defect is narrower and worse than three mismatched numbers:

 1. `engine/bohemia_engine.js` carries CURRENT_SAVE_VERSION=7 AND a complete
    migration chain -- walk-forward, refuse-the-future, never-mutate-the-input --
    and BOTH playable surfaces reference it ZERO times. Measured: grep = 0 in the
    alpha and 0 in the city. Another finished thing nothing calls.

 2. AND THE PAYLOAD READER IS AN EXACT-EQUALITY CHECK:

        if(!st||st.v!==1)return false;                    CITY_WORLD:20303

    Both the writer and the reader hardcode 1. So the day any lane does the
    CORRECT thing -- change the save's shape and bump the version -- EVERY
    EXISTING SAVE SILENTLY RETURNS FALSE and the player starts at day 1 with
    nothing. No message, no log, no difference from a wiped save.

    That is not hypothetical. I added `purse` on 8/12 and `market` on 8/14 and
    both got in only because I did NOT bump the version, which meant old saves
    loaded with fields missing and were rescued by scattered `if(st.purse)`
    guards. It worked by luck. The moment somebody does it properly, it breaks.

    The inverse is live too: he plays a new build, then opens a cached older one
    (a service worker, a phone that did not hard refresh), the save is from the
    future, and the older build silently throws it away.

WHAT THIS DOES, reusing the engine's CONTRACT rather than copying its chain:

    CITY_SAVE_V           one constant, written by the snapshot and read by the
                          restore, so the two can never disagree by hand.
    migrateCity(st)       walks ANY save at or below the current version forward,
                          filling what a newer shape expects. Old saves load.
    a future save         is REFUSED OUT LOUD -- reported, counted, and left in
                          storage untouched -- instead of silently becoming a new
                          game. Never mutates the input, exactly like the engine's
                          migrate(), so a failed migration cannot corrupt what is
                          on disk.

The migration table starts EMPTY on purpose: there is one shape today and
inventing steps for shapes that never existed is fiction. What ships is the
MECHANISM, so the next lane to change the save adds one entry instead of
discovering this the way he would have.

REUSE CHECK: cooks no graphic pixels and opens no art bank; nothing here is
drawn. It reuses engine/bohemia_engine.js's migration CONTRACT (its walk-forward
loop, its refuse-the-future branch and its never-mutate rule are quoted in the
code below) rather than duplicating the chain, which operates on a different
save. No new storage, no second format.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_SAVE_SURVIVES_US__'

OLD_SNAP = """function citySnapshot(){
  return { v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,"""

NEW_SNAP = """/* """ + MARK + """ -- ONE CONSTANT, WRITTEN BY THE SNAPSHOT AND READ BY THE
   RESTORE. They both used to hardcode 1 in their own line, and the reader tested
   it with EXACT EQUALITY (st.v!==1), so the first lane to do the correct thing --
   change the shape and bump the version -- would have silently wiped every save
   in existence. BUMP THIS WHEN THE SHAPE CHANGES and add a step to CITY_MIGRATE
   below; that is the whole contract. */
var CITY_SAVE_V = 1;
/* Each entry migrates a save FROM its key version TO the next, applied in order
   until it reaches CITY_SAVE_V -- the same shape as the engine's own chain in
   bohemia_engine.js, which has done this correctly since it was written and is
   called by neither playable surface.
   IT IS EMPTY ON PURPOSE. There is one shape today, and inventing migrations for
   shapes that never existed is fiction. The MECHANISM is what ships, so the next
   lane to change the save adds one line here instead of finding this out the way
   he would have. */
var CITY_MIGRATE = {
  /* 1: function(s){ s.newField = whatever; return s; }, */
};
/* Walk a save forward. NEVER MUTATES THE INPUT, so a failed migration cannot
   corrupt what is already on disk (the engine's rule, and it is a good one).
   Returns null with a REASON rather than a bare false, because "I refused this"
   and "there was nothing there" are different answers and the old code gave the
   same one for both. */
function migrateCity(st){
  if(!st || typeof st!=='object') return {ok:false, why:'EMPTY'};
  var v = (typeof st.v==='number') ? st.v : 0;
  if(v > CITY_SAVE_V){
    /* FROM THE FUTURE: he played a newer build, then opened a cached older one.
       Silently starting a new game here is how a save "disappears". */
    return {ok:false, why:'FROM_A_NEWER_BUILD', have:v, want:CITY_SAVE_V};
  }
  var s = null;
  try{ s = JSON.parse(JSON.stringify(st)); }catch(_e){ return {ok:false, why:'UNREADABLE'}; }
  var guard = 0;
  while(v < CITY_SAVE_V && guard++ < 64){
    var step = CITY_MIGRATE[v];
    if(!step) return {ok:false, why:'NO_MIGRATION_FROM_' + v};
    try{ s = step(s); }catch(_e){ return {ok:false, why:'MIGRATION_THREW_AT_' + v}; }
    v++; s.v = v;
  }
  return {ok:true, st:s};
}
function citySnapshot(){
  return { v:CITY_SAVE_V,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,"""

OLD_RESTORE = """  if(!st||st.v!==1)return false;"""
NEW_RESTORE = """  /* """ + MARK + """ -- was `if(!st||st.v!==1)return false;`, an exact-equality
     test against a hardcoded 1, which meant the first correct version bump would
     have wiped every save in existence without a word. Now it walks forward, and
     a refusal is REPORTED rather than looking exactly like an empty save. */
  var _m = migrateCity(st);
  if(!_m.ok){
    window.__RESTORE_REFUSED = _m.why;
    if(_m.why !== 'EMPTY'){
      try{ console.warn('BOHEMIA: this save was not loaded (' + _m.why + '). '
        + 'It has NOT been deleted.'); }catch(_e){}
    }
    return false;
  }
  st = _m.st;
  window.__RESTORE_OK = (window.__RESTORE_OK||0) + 1;"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [('the snapshot', OLD_SNAP, NEW_SNAP),
                           ('the restore', OLD_RESTORE, NEW_RESTORE)]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
