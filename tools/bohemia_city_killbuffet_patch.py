#!/usr/bin/env python3
"""
BOHEMIA KILL THE TILE-BUFFET BUTTONS (7/29/26)

Paolo, 7/29, on the three chips he had circled an hour earlier: "I dont want those
button anymore." BUFFET ON / PLACE / TILES are gone.

A KILL IS NOT A HIDE. The bar is never built, so there is nothing to un-hide, nothing
to reach by tapping in the dark, and nothing rendering off-screen costing layout. Any
bar left over from an older build is torn out on sight.

AND THE SYSTEM BEHIND THEM GOES DORMANT, WHICH IS WHY THIS IS SAFE: TP already
defaults to { on:false, scatter:false }, and those buttons were the ONLY way to flip
either one. With the buttons gone nothing can ever turn placement or the scatter on,
so the buffet stops being a thing that can happen to his screen. The TP internals stay
in place rather than being ripped out mid-session — gates/city_tab_gate.js asserts the
scatter default is false, and that check should keep holding a real object, not pass
because the object vanished.

THE GATE I WROTE AN HOUR AGO NOW SAYS THE OPPOSITE. gates/bottomleft_gate.py demanded
those three chips EXIST and not overlap. It is flipped in the same turn: it now demands
they are ABSENT and that the chrome still down there does not collide. A gate that
enforces a ruling he has since reversed is worse than no gate.

REUSE CHECK: no graphic pixels cooked — this deletes UI chrome, so no banks/ lookup
applies (reuse-first governs cooking NEW art; nothing is drawn here).

Idempotent (marker BUFFET BUTTONS KILLED). Patches CITY_B64 in the alpha in place.

  python3 tools/bohemia_city_killbuffet_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'BUFFET BUTTONS KILLED' in decoded:
    print('buffet buttons already killed. no-op.')
    sys.exit(0)

OLD = 'function tpInitButtons(){\n  if(document.getElementById(\'tpModeBtn\'))return;'
NEW = """function tpInitButtons(){
  /* BUFFET BUTTONS KILLED (Paolo 7/29: "I dont want those button anymore").
     Build nothing, and tear out anything a stale build left behind. The bar is
     not hidden - it does not exist, so there is no invisible tap target and no
     off-screen node paying for layout. */
  ['tpScatBtn','tpModeBtn','tpJudgeBtn'].forEach(function(id){
    const e=document.getElementById(id); if(e&&e.parentNode)e.parentNode.removeChild(e); });
  ['tpPal','tpJudge'].forEach(function(id){
    const e=document.getElementById(id); if(e&&e.parentNode)e.parentNode.removeChild(e); });
  /* the two flags these chips toggled can no longer be reached by anyone, so pin
     them where they already default: OFF. The buffet cannot happen to his screen. */
  if(typeof TP!=='undefined'){ TP.on=false; TP.scatter=false; }
  return;
  /* eslint-disable no-unreachable -- the original builder is kept below, dead and
     visible, rather than deleted: the graveyard entry points here, and a reader
     should be able to see exactly what was removed. */
  if(document.getElementById('tpModeBtn'))return;"""

assert decoded.count(OLD) == 1, decoded.count(OLD)
decoded = decoded.replace(OLD, NEW, 1)

out = alpha[:a0] + base64.b64encode(decoded.encode('utf8')).decode('ascii') + alpha[a1:]
open(ALPHA, 'w', encoding='utf8').write(out)
print('BUFFET BUTTONS KILLED: BUFFET ON / PLACE / TILES are never built, and the')
print('placement + scatter flags are pinned off because nothing can reach them.')
