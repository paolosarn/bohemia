#!/usr/bin/env python3
"""
THE CITY COULD NOT TALK TO THE SHELL, AND THE SAVE PANEL SAID IT COULD
(8/15/26, RUN lane). Found by demo_gate.js on its first run.

MEASURED IN A REAL BROWSER, twice, both directions, before one line was changed:

    postMessage({bohemiaCityState:{...day:42}})            -> CITYSAVE 0 bytes
    postMessage({type:'X', bohemiaCityState:{...day:42}})  -> CITYSAVE 135 bytes,
                                                              day 42 loads back

The payloads are identical. The only difference is a `.type` field, and the city
does not send one.

THE CAUSE, one line, `ALPHA:7105`:

    function combatMsgIn(d){
      if(!d||!d.type)return false;      <-- everything the city sends dies here

SEVEN handlers live inside that function and ALL SEVEN are keyed off `bohemiaX`
properties with no `.type` at all, so all seven have been unreachable:

    bohemiaCityState        THE AUTOSAVE
    bohemiaCitySfx          the city's sounds crossing to the audio bus
    bohemiaCityMusic        the city music toggle
    bohemiaCitySaveQuery    the save panel's own status line
    bohemiaCitySaveExport   EXPORT SAVE
    bohemiaCitySaveImport   IMPORT SAVE
    bohemiaPrefabApproved   approved prefabs reaching the world

WHAT THIS COST, AND SOME OF IT IS MINE TO OWN:

1. THE CITY HAS NEVER AUTOSAVED THROUGH THE ALPHA. Not once. Every reportState()
   (debounced) and every flushState() (the iOS pagehide/freeze/blur emergency
   path built 8/11 specifically so a phone being reaped does not lose the run)
   posted into a function that returned false on its second line.
2. AND THE GAME SAID OTHERWISE, on the surface he taps. The city's save panel
   reads "Saved to this device. Autosaves survive a reload." That sentence has
   been false for as long as the guard has been there.
3. MY OWN RECORDS REPEAT THE CLAIM. THE DAY PAYS (8/12) and THE TRADING HUB
   (8/14) both say the purse and the market "ride the save", and both gates
   proved it -- ON THE CITY PAGE OPENED DIRECTLY, where the city IS the top
   document and there is no shell to post to. On the alpha, where he plays, the
   message went nowhere. VERIFY ON THE REAL SURFACE (7/18) caught this; my own
   gates were one frame short of the truth.
4. It also silently disabled the SOUND lane's phone buzz across the bridge and
   the prefab bridge. Both come back with this fix; neither lane is being edited
   here, and both are named in the handoff so they can check their own claims.

THE FIX IS DERIVED, NOT A LIST. Adding `bohemiaCityState` to the guard would fix
one of seven and leave the trap armed for the eighth. The guard's real job is to
cheaply ignore postMessages from unrelated frames and extensions, and every
handler in this function answers to either a `.type` or a `bohemia*` key -- so
that is exactly what it now tests. A handler added later works with no further
change, which is the property the old guard lacked.

Gate: demo_gate.js reloads the whole alpha mid-demo and asserts the day, the
purse and the valley's stocks all came back, and city_bridge_gate.js posts every
untyped bohemia* message and asserts each one is actually handled.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It changes one guard and adds no surface.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_CITY_CAN_TALK__'

OLD = """function combatMsgIn(d){
  if(!d||!d.type)return false;"""

NEW = """function combatMsgIn(d){
  /* """ + MARK + """ -- THIS GUARD SILENTLY KILLED THE CITY'S AUTOSAVE.
     It was `if(!d||!d.type)return false;`, and SEVEN handlers below are keyed on
     bohemia* properties with NO .type -- bohemiaCityState (the autosave),
     bohemiaCitySfx, bohemiaCityMusic, the three save panel messages and
     bohemiaPrefabApproved. Every one of them returned false on this line.
     MEASURED 8/15 before changing anything: the same payload saved 0 bytes
     without a .type and 135 bytes with one. So the city has never autosaved
     through the alpha, while the save panel told the player "Autosaves survive
     a reload" -- and my own 8/12 and 8/14 gates missed it because they opened
     the city page DIRECTLY, where it is the top document and there is no shell
     to post to (VERIFY ON THE REAL SURFACE, 7/18).
     DERIVED, NOT A LIST: adding one key would fix one of seven and leave the
     trap armed for the eighth. The guard's job is to ignore postMessages from
     unrelated frames, and every handler here answers to a .type OR a bohemia*
     key, so that is what it tests. A handler added later needs no change. */
  if(!d)return false;
  if(!d.type){
    var _keyed=false;
    for(var _k in d){ if(_k.indexOf('bohemia')===0){ _keyed=true; break; } }
    if(!_keyed)return false;
  }"""


def main():
    if not os.path.exists(ALPHA):
        sys.exit('FAIL: ' + ALPHA + ' not found')
    s = open(ALPHA, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: the combatMsgIn guard is not where this expects it')
    s = s.replace(OLD, NEW, 1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + ALPHA + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
