#!/usr/bin/env python3
"""
ONE SNAPSHOT, NOT TWO (8/15/26, RUN lane). A BUG FOUND BY THE DEMO GATE, AND IT
WAS MINE.

The city saves its state through TWO functions:

    reportState()   the ordinary path. Debounced 800ms, fires as you play.
    flushState()    the EMERGENCY path. Fires on pagehide / freeze / blur /
                    visibilitychange, and it exists specifically because "inside
                    an iframe on iOS [pagehide] is the event least likely to ever
                    run: Safari backgrounds and then reaps a tab" (its own
                    header, 8/11). This is the phone path. Paolo demos on a phone.

They serialized the same state, and the second was A HAND-MAINTAINED COPY OF THE
FIRST. So when THE DAY PAYS added `purse` on 8/12 and THE TRADING HUB added
`market` on 8/14, both landed in reportState and neither landed in flushState.
I wrote both of those and I did not look at the other function.

WHAT THAT ACTUALLY DID TO A PLAYER, and it is worse than losing the save:

    switch apps mid-run -> flushState fires -> day and quest are written,
    purse and market are NOT -> come back -> you are on the right day, on the
    right quest, WITH AN EMPTY PURSE and a valley whose stocks reset to base.

The save looked like it worked. A day's pay and everything he bought vanished
silently, and every price in the market snapped back to its opening number,
because the stocks the prices are computed from went with it. A save that
restores four fields out of six is not a partial save, it is a lie, and the
ordinary 800ms debounce hid it on every surface except the one he demos on.

THE FIX IS NOT "ADD TWO FIELDS TO flushState". That would leave the same trap
armed for the next lane that adds a field -- and that is exactly how this got
here. There is now ONE snapshot function and both callers use it, so a field
cannot be added to the save on one path and not the other. Same disease and same
cure as the shared city-app resolver and the shared publish resolver: A VALUE
COPIED BY HAND WHERE A VALUE COULD BE DERIVED.

Gate: demo_gate.js plays a real day, buys something, and RELOADS THE WHOLE ALPHA,
asserting the day, the purse AND the valley's stocks all came back. It went red
on this the first time it ran, which is the entire reason the gate exists.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It removes a duplicated object literal rather than adding
anything, and both existing callers keep their own names and behaviour.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__ONE_SNAPSHOT__'

OLD_REPORT = """function reportState(){
  if(_svT)return; _svT=setTimeout(()=>{ _svT=null;
    try{ if(window.parent&&window.parent!==window)window.parent.postMessage({bohemiaCityState:{
      v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,
      riding:(typeof RIDING!=='undefined')?RIDING:false,hzoom:HZOOM,
      loop:DAY.serialize(),quest:DQ.serialize(),      /* __DAY_LOOP__ */
      purse:(function(){ try{ return BohemiaPurse.save(purseGet()); }catch(_e){ return null; } })(),
      market:MKT_LEDGER?{ledger:MKT_LEDGER,bought:MKT_BOUGHT}:null   /* __THE_TRADING_HUB__ */   /* __THE_DAY_PAYS__ */
    }},'*'); }catch(_e){}
  },800);
}"""

NEW_REPORT = """/* """ + MARK + """ -- ONE SNAPSHOT, USED BY BOTH SAVE PATHS.
   THE BUG THIS KILLS, and it was mine: reportState (debounced, ordinary) and
   flushState (pagehide/freeze/blur/visibilitychange, THE PHONE PATH) each built
   their own copy of this object. purse landed in one on 8/12 and market on 8/14,
   and neither ever landed in the other -- so switching apps mid-run restored the
   right day and the right quest with an EMPTY PURSE and a valley whose stocks
   snapped back to base, which reset every price in the market. A save that
   restores four fields out of six is not partial, it is a lie, and the debounce
   hid it everywhere except the surface Paolo actually demos on.
   Adding two fields to the copy would have left the trap armed for the next lane.
   A FIELD CANNOT NOW BE ADDED TO ONE PATH AND NOT THE OTHER. */
function citySnapshot(){
  return { v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,
    riding:(typeof RIDING!=='undefined')?RIDING:false,hzoom:HZOOM,
    loop:DAY.serialize(),quest:DQ.serialize(),      /* __DAY_LOOP__ */
    purse:(function(){ try{ return BohemiaPurse.save(purseGet()); }catch(_e){ return null; } })(),
    market:MKT_LEDGER?{ledger:MKT_LEDGER,bought:MKT_BOUGHT}:null   /* __THE_TRADING_HUB__ */ };
}
function reportState(){
  if(_svT)return; _svT=setTimeout(()=>{ _svT=null;
    try{ if(window.parent&&window.parent!==window)
      window.parent.postMessage({bohemiaCityState:citySnapshot()},'*'); }catch(_e){}
  },800);
}"""

OLD_FLUSH = """function flushState(){ if(_svT){clearTimeout(_svT);_svT=null;}
  try{ if(window.parent&&window.parent!==window)window.parent.postMessage({bohemiaCityState:{
    v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,
    riding:(typeof RIDING!=='undefined')?RIDING:false,hzoom:HZOOM,
    loop:DAY.serialize(),quest:DQ.serialize()        /* __DAY_LOOP__ */
  }},'*'); }catch(_e){} }"""

NEW_FLUSH = """function flushState(){ if(_svT){clearTimeout(_svT);_svT=null;}
  /* """ + MARK + """ -- the SAME snapshot the debounced path writes. This
     function used to carry its own hand-copied literal and it was two fields
     behind, so the emergency path (the phone path) silently dropped the purse
     and the market. */
  try{ if(window.parent&&window.parent!==window)
    window.parent.postMessage({bohemiaCityState:citySnapshot()},'*'); }catch(_e){} }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [('reportState', OLD_REPORT, NEW_REPORT),
                           ('flushState', OLD_FLUSH, NEW_FLUSH)]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
