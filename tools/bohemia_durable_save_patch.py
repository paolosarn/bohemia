#!/usr/bin/env python3
"""
A SAVE THAT SURVIVES A WEEK OFF (8/6/26) — asking the browser to keep it.

THE LANDMINE, which has been sitting in THE BIG MISSING (item 7) since 7/29 and
which nobody owned:

    "iOS WebKit EVICTS script-writable storage (localStorage/IndexedDB) after
     ~7 days of site inactivity for Safari-tab web apps - a player who puts the
     game down for a week can come back to DELETED SAVES."

RESEARCHED 8/6, because the note was a year-old summary and this policy moves:

  * IT IS REAL AND IT IS CURRENT. Since iOS 13.4 / Safari 13.1, WebKit deletes
    localStorage, IndexedDB, SessionStorage AND SERVICE WORKER REGISTRATIONS
    after seven days with no user interaction with the origin. The counter
    resets every visit, so it only bites the player who stops playing - which
    is exactly the player you want back.
  * THE SERVICE WORKER GOING IS ITS OWN SECOND INJURY. slices/sw.js is what
    makes the ONE-LINK LAW work (network-first, so the one URL always serves
    the newest deploy). It is on the same eviction list as the save.
  * THERE IS A ONE-CALL FIX AND WE HAVE NEVER MADE IT. Eviction "skips over
    origins that have been granted data persistence by using
    navigator.storage.persist()". Supported since Safari 17 / iOS 17.
  * HOME-SCREEN WEB APPS get their own counter tied to real app use rather than
    Safari-tab use, which is more forgiving but is NOT a substitute: it is the
    player's choice to install, not ours, and most players never do.

MEASURED ON THE REAL SURFACE BEFORE WRITING A LINE (7/18 law), by booting the
alpha and tapping RUN:

    localStorage keys : 3        bohemia.save.v1  9,351 bytes
                                 bohemia:look     1,507 bytes
                                 bohemia_sfxvol       1 byte
    total             : 10,859 bytes  (quota 1,041,232,462 - not a quota problem)
    navigator.storage.persisted() : FALSE   <- never granted
    navigator.storage.persist     : present <- and never called

So the game is tiny, well inside every cap, and completely unprotected.

WHAT THIS DOES, AND WHAT IT CAREFULLY DOES NOT. It adds ONE request at boot and
touches NO save code: nothing about how a save is written, read, migrated or
exported changes, because that is the RUN lane's system and this is not a change
to it. It asks the browser to keep what is already there.

  - it is fire-and-forget: persist() returning false changes nothing and breaks
    nothing, so the worst case is exactly today's behaviour
  - it never blocks boot and never throws into the boot path
  - it records the answer on window.__BOH_DURABLE so a gate can MEASURE the
    request really happened instead of trusting that the line exists

WHY IT IS NOT A PROMPT. Safari grants or denies on its own heuristics without
asking the user; there is no dialog to design and nothing for Paolo to judge.

REUSE CHECK: cooks no graphic pixels and opens no bank. Pure durability
plumbing - it stores nothing new and decides nothing.

Idempotent: marker-fenced, a re-run reports NOOP.
Gate: gates/durable_save_gate.js
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__BOH_DURABLE__'
ANCHOR = "if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(function(reg){"

BLOCK = """/* """ + MARKER + """ (8/6/26): ASK THE BROWSER TO KEEP THE SAVE.
   iOS WebKit deletes localStorage, IndexedDB AND service worker registrations
   after SEVEN DAYS with no interaction with the origin. Every Bohemia save lives
   in localStorage (measured: bohemia.save.v1, 9,351 bytes), and sw.js - the
   worker the ONE-LINK LAW depends on - is on the same eviction list. So a player
   who puts the game down for a week comes back to a deleted save AND a stale
   link. That is THE BIG MISSING item 7, and it had never been acted on.
   Eviction SKIPS origins granted persistence. This is that request, and it is
   the whole fix. It touches no save code: nothing about how a save is written,
   read, migrated or exported changes - it asks the browser to keep what is
   already being written.
   FIRE AND FORGET BY DESIGN: false changes nothing, an exception changes
   nothing, and boot never waits on it. The worst case is exactly today.
   Safari decides on its own heuristics with no user prompt, so there is nothing
   here for anybody to judge. The answer is parked on window.__BOH_DURABLE so
   the gate can MEASURE that the request really happened. */
(function(){ try{
  if(navigator.storage && navigator.storage.persist){
    navigator.storage.persisted().then(function(already){
      window.__BOH_DURABLE={api:true,already:already,granted:null};
      if(already) { window.__BOH_DURABLE.granted=true; return; }
      return navigator.storage.persist().then(function(ok){
        window.__BOH_DURABLE.granted=!!ok;
      });
    }).catch(function(){ window.__BOH_DURABLE={api:true,error:true}; });
  } else { window.__BOH_DURABLE={api:false}; }
}catch(_bd){ window.__BOH_DURABLE={api:false,error:true}; } })();
"""


def main():
    src = open(ALPHA, encoding='utf8', errors='ignore').read()
    if MARKER in src:
        print('NOOP: the alpha already asks the browser to keep the save')
        return 0
    n = src.count(ANCHOR)
    if n != 1:
        print('FAIL: the boot anchor resolves %d times, not 1' % n)
        return 1
    src = src.replace(ANCHOR, BLOCK + ANCHOR, 1)
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('wrote %s' % ALPHA)
    print('  the save now asks to survive a week off the game')
    return 0


if __name__ == '__main__':
    sys.exit(main())
