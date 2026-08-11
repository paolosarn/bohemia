#!/usr/bin/env python3
"""
MAKE THE SAVE IPHONE-PROOF (8/11/26).

Paolo's demo row, verbatim: "make the save iPhone-proof". The demo is played on a
phone, in Safari, and CITYSAVE v1 (7/7/26) loses the run to four things Safari
really does. Every one of them is now driven by gates/save_iphone_gate.js against
a hostile fake browser; the canonical body is engine/bohemia_save.js.

WHAT WAS WRONG WITH v1, measured not guessed:

  1. THE PROBE LIED. `localStorage.setItem('__bp_probe','1')` writes ONE BYTE. A
     one-byte write succeeds in exactly the conditions where a real save throws
     QuotaExceededError, so mode said 'disk' and every autosave after it fell to
     memory in silence. v2 probes with a blob the size of a real save and reads
     it back.

  2. THE TIME MACHINE, under a comment promising there was none. v1 flipped to
     memory on a failed write and LEFT THE OLD SAVE ON DISK. Next launch, the
     one-byte probe passed, mode went back to disk, and the player silently
     resumed an older run. v2 kills the disk copy the moment the live state can
     no longer be written to it.

  3. ONE SLOT. The write that fails is the write that destroys your only copy.
     v2 keeps two slots with a generation counter and always writes the OLDER
     one, so the newest good save is never the target.

  4. NO INTEGRITY. JSON.parse in a try, null on throw: a truncated save was
     indistinguishable from no save, and the game quietly started over. v2 stamps
     a length and an FNV-1a checksum and takes the highest generation that
     VERIFIES, so a torn newest slot falls back to the intact older one.

TWO BUGS THE GATE FOUND THAT READING THE CODE DID NOT:
  - a session that comes up in MEMORY mode because the phone was already full
    plays on and leaves the stale save on disk: same rewind, different door. The
    kill now fires on the first memory-mode save, not only on a failed write.
  - on a device that is FULL and refuses removeItem, nothing can be deleted and
    no tombstone fits. Overwriting each slot with a tiny DEAD marker always fits,
    because replacing a big string with a small one cannot exceed a quota.

AND THE ONE THAT IS NOT A CODE FIX: iOS wipes script-writable storage after 7
quiet days unless the page is installed to the Home Screen. So the save line the
player reads now tells the truth instead of "autosaves survive reload" -- it
names the 7-day wipe and points at Home Screen or EXPORT, while it is still true.

ALSO HERE, because they are the same defect class:
  - the iOS FLUSH. The city flushed its state on `pagehide` only. In an iframe on
    iOS that is the event least likely to fire: Safari backgrounds and reaps tabs
    via visibilitychange/freeze, and the parent gets those, not the frame. The
    flush now also fires on visibilitychange->hidden and on freeze, which is what
    actually happens when he switches apps mid-run.
  - IMPORT dropped the prefabs it was importing. `CITYSAVE.save(sv.data)` ran
    BEFORE `G._prefabApproved=sv.prefabs`, so the re-save captured the OLD
    prefabs. Now they are passed explicitly.

REUSE CHECK: cooks no graphic pixels of any kind. This is storage plumbing; it
opens no bank because there is nothing to draw.

Idempotent: re-running finds the marker and reports NOOP.
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MODULE = 'engine/bohemia_save.js'
MARKER = '__SAVE_V2__'
FLUSH_MARKER = '__SAVE_FLUSH_IOS__'

# ---- the v1 body, replaced whole -------------------------------------------
OLD_START = "const CITYSAVE={KEY:'bohemia_city_save',mode:'memory',mem:null,"
OLD_END = "CITYSAVE.probe();"

OLD_INFO = ("if(cf&&cf.contentWindow)try{cf.contentWindow.postMessage({bohemiaCitySaveInfo:"
            "{mode:CITYSAVE.mode==='disk'?'device storage (autosaves survive reload)':"
            "'memory only in this launcher, use EXPORT SAVE'}},'*');}catch(e){}")
NEW_INFO = ("if(cf&&cf.contentWindow)try{cf.contentWindow.postMessage({bohemiaCitySaveInfo:"
            "{mode:CITYSAVE.status().line,detail:CITYSAVE.status()}},'*');}catch(e){}")

OLD_IMPORT = "if(sv&&sv.data){ CITYSAVE.save(sv.data); if(sv.prefabs)G._prefabApproved=sv.prefabs;"
NEW_IMPORT = ("if(sv&&sv.data){ if(sv.prefabs)G._prefabApproved=sv.prefabs; "
              "CITYSAVE.save(sv.data,sv.prefabs||null);   /* prefabs FIRST: v1 re-saved the OLD ones */")

# ---- the iOS flush, in the city --------------------------------------------
FLUSH_ANCHOR = """window.addEventListener('pagehide',()=>{ if(_svT){clearTimeout(_svT);_svT=null;}
  try{ if(window.parent&&window.parent!==window)window.parent.postMessage({bohemiaCityState:{
    v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,
    riding:(typeof RIDING!=='undefined')?RIDING:false,hzoom:HZOOM
  }},'*'); }catch(_e){} });"""

FLUSH_NEW = """/* """ + FLUSH_MARKER + """ -- THE FLUSH IOS ACTUALLY DELIVERS (8/11/26).
   This was `pagehide` alone. Inside an iframe on iOS that is the event least
   likely to ever run: Safari backgrounds and then reaps a tab through
   visibilitychange and freeze, and those go to the top document, not to the
   frame. Switching apps mid-run therefore lost up to 800ms of play AND, on a
   reap, the whole unflushed delta. All four events now force the same
   synchronous flush, and it is idempotent, so firing three times costs nothing.
   The debounce still covers the ordinary case; this covers the phone. */
function flushState(){ if(_svT){clearTimeout(_svT);_svT=null;}
  try{ if(window.parent&&window.parent!==window)window.parent.postMessage({bohemiaCityState:{
    v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,
    riding:(typeof RIDING!=='undefined')?RIDING:false,hzoom:HZOOM
  }},'*'); }catch(_e){} }
window.addEventListener('pagehide',flushState);
window.addEventListener('freeze',flushState);
window.addEventListener('blur',flushState);
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden')flushState(); });"""


def patch_alpha():
    s = open(ALPHA, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP alpha: ' + MARKER + ' already present')
        return s, False

    i = s.find(OLD_START)
    if i < 0:
        sys.exit('FAIL: the v1 CITYSAVE body was not found in ' + ALPHA)
    j = s.find(OLD_END, i)
    if j < 0:
        sys.exit('FAIL: CITYSAVE.probe() was not found after the v1 body')
    j += len(OLD_END)

    mod = open(MODULE, encoding='utf-8').read()
    new = ('/* ' + MARKER + ' -- THE IPHONE-PROOF SAVE (8/11/26). The whole body is\n'
           '   engine/bohemia_save.js, inlined here verbatim by tools/bohemia_save_v2_patch.py\n'
           '   and driven against a hostile fake browser by gates/save_iphone_gate.js. It\n'
           '   replaces CITYSAVE v1 (7/7/26), which had a one-byte probe, one slot, no\n'
           '   integrity check, and a stale-save time machine under a comment promising\n'
           '   there was none. */\n'
           + mod +
           "const CITYSAVE=BohemiaSave.make({name:'bohemia_city_save',\n"
           "  prefabs:function(){ return (typeof G!=='undefined'&&G._prefabApproved)||null; }});\n"
           'CITYSAVE.probe();')
    s = s[:i] + new + s[j:]

    if OLD_INFO in s:
        s = s.replace(OLD_INFO, NEW_INFO)
    else:
        print('WARN: the save-info line was not the expected one; left alone')
    if OLD_IMPORT in s:
        s = s.replace(OLD_IMPORT, NEW_IMPORT)
    else:
        print('WARN: the import line was not the expected one; left alone')
    return s, True


def patch_city():
    s = open(CITY, encoding='utf-8').read()
    if FLUSH_MARKER in s:
        print('NOOP city: ' + FLUSH_MARKER + ' already present')
        return s, False
    if FLUSH_ANCHOR not in s:
        sys.exit('FAIL: the pagehide flush was not found in ' + CITY)
    return s.replace(FLUSH_ANCHOR, FLUSH_NEW), True


if __name__ == '__main__':
    a, ca = patch_alpha()
    c, cc = patch_city()
    if ca:
        open(ALPHA, 'w', encoding='utf-8').write(a)
        print('PATCHED ' + ALPHA + ' (' + str(len(a)) + ' bytes)')
    if cc:
        open(CITY, 'w', encoding='utf-8').write(c)
        print('PATCHED ' + CITY + ' (' + str(len(c)) + ' bytes)')
    if not ca and not cc:
        print('NOOP: nothing to do')
