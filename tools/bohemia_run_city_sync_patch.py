#!/usr/bin/env python3
"""
BOHEMIA RUN <-> CITY SYNC (7/28/26, RUN lane / integration) — THE CITY OPENS
WHERE YOU ARE STANDING.

Paolo, 7/28:
  "for the run I still wanna start off in a suburb that you choose the location
   for in Vegas AND I WANT THAT REFLECTED WHEN I'M IN THE CITY MENU... I just
   want you to incorporate all of these things together like that's what the run
   is supposed to be"

Two things had to be true for that sentence to be possible, and neither was:

  1. the run and the city had to be the SAME WORLD. They were not - the builder
     hardcoded overmap seed 2026 while the game boots hashSeed('bohemia') =
     2691674296, so cell 12,4 was the SUBURB he spawns in on one surface and
     ARTERIAL on the other. Fixed first, by tools/bohemia_one_seed_patch.py.
     Until that landed, "reflect my position" was not a feature request, it was
     a coordinate translated between two different cities.

  2. the city had to be TOLD where he is. It never was. The only run->city
     traffic in the whole alpha was citySendPlayer(), which sends his SPRITE -
     the character art and a portrait - and not one byte of position. The city
     opened on the Strip every time, because that is where its camera happened
     to start, on a map that had nothing to do with him.

This patch is the second half: the position bridge.

    RUN     posts BOHEMIA_RUN_WHERE {cell:[x,y], district} on boot and on every
            cell crossing (the run already reloads a cell when you walk off an
            edge, so this fires exactly when his location really changes)
    ALPHA   remembers it, and hands it to the city frame when the CITY tab is
            opened and when that frame finishes loading
    CITY    BOHEMIA_GOTO_CELL {x,y} puts the city camera on that cell and
            re-renders, so the builder opens looking at his block

WHY THE CAMERA AND NOT A TELEPORT: the city tab is a MAP/builder view, not a
second body. Moving its camera is "show me where I am". Moving a player would be
inventing a second position for him, and there is only one of him.

  python3 tools/bohemia_run_city_sync_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()
applied = []

# ---------------------------------------------------------------- the CITY half
KEY = "const CITY_B64='"
if KEY not in alpha:
    print('no CITY_B64 in the alpha; nothing to do.')
    sys.exit(1)
a0 = alpha.index(KEY) + len(KEY)
a1 = alpha.index("'", a0)
city = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'BOHEMIA_GOTO_CELL' in city:
    print('city half already applied.')
else:
    OLD = ("window.addEventListener('message',ev=>{ const d=ev&&ev.data;\n"
           "  if(d&&d.bohemiaCityRestore)applyRestore(d.bohemiaCityRestore);")
    if city.count(OLD) != 1:
        print('FAILED: could not find the city message listener (found %d)' % city.count(OLD))
        sys.exit(1)
    NEW = ("window.addEventListener('message',ev=>{ const d=ev&&ev.data;\n"
           "  /* WHERE HE IS (Paolo 7/28: \"I want that reflected when I'm in the city\n"
           "     menu\"). The only run->city traffic used to be his SPRITE; the city\n"
           "     opened on the Strip every time because that is where its camera\n"
           "     happened to start. This puts the camera on the cell the run has him\n"
           "     standing in. Same world now (ONE SEED), so the coordinate means the\n"
           "     same thing on both surfaces - which is the whole point. */\n"
           "  if(d&&d.type==='BOHEMIA_GOTO_CELL'&&typeof d.x==='number'&&typeof d.y==='number'){\n"
           "    const n=(om&&om.n)||96;\n"
           "    city.x=Math.max(0,Math.min(n-1,d.x|0)); city.y=Math.max(0,Math.min(n-1,d.y|0));\n"
           "    MODE='city'; window.__BOH_LAST_GOTO=[city.x,city.y];\n"
           "    try{ updHud(); render(); }catch(_e){}\n"
           "  }\n"
           "  if(d&&d.bohemiaCityRestore)applyRestore(d.bohemiaCityRestore);")
    city = city.replace(OLD, NEW, 1)
    alpha = alpha[:a0] + base64.b64encode(city.encode('utf8')).decode('ascii') + alpha[a1:]
    applied.append('CITY: BOHEMIA_GOTO_CELL puts the builder camera on the run\'s cell')

# --------------------------------------------------------------- the SHELL half
if 'BOHEMIA_RUN_WHERE' in alpha:
    print('shell half already applied.')
else:
    OLD = ("  if(d.type==='BOHEMIA_RUN_NEED_CAST'){runSendCast();return true;}")
    if alpha.count(OLD) != 1:
        print('FAILED: could not find the run message relay (found %d)' % alpha.count(OLD))
        sys.exit(1)
    NEW = ("  if(d.type==='BOHEMIA_RUN_NEED_CAST'){runSendCast();return true;}\n"
           "  /* WHERE HE IS (7/28). The run tells the shell which valley cell it has\n"
           "     him standing in; the shell remembers it and hands it to the CITY frame\n"
           "     so the builder opens looking at his block instead of the Strip.\n"
           "     Remembered rather than forwarded blind, because the city frame is lazy\n"
           "     and usually does not exist yet when the run boots. */\n"
           "  if(d.type==='BOHEMIA_RUN_WHERE'&&Array.isArray(d.cell)){\n"
           "    G._runCell=d.cell.slice(); cityGoToRunCell(); return true;}")
    alpha = alpha.replace(OLD, NEW, 1)

    OLD2 = "function citySendPlayer(){"
    if alpha.count(OLD2) != 1:
        print('FAILED: could not find citySendPlayer')
        sys.exit(1)
    NEW2 = ("function cityGoToRunCell(){\n"
            "  if(!G._runCell)return false;\n"
            "  const fr=document.getElementById('cityFrame');\n"
            "  if(!fr||!fr.contentWindow)return false;\n"
            "  try{ fr.contentWindow.postMessage({type:'BOHEMIA_GOTO_CELL',\n"
            "    x:G._runCell[0], y:G._runCell[1]},'*'); return true; }catch(e){ return false; }\n"
            "}\n"
            "function citySendPlayer(){")
    alpha = alpha.replace(OLD2, NEW2, 1)

    # and hand it over whenever the city tab is opened / its frame loads
    OLD3 = "  else if(t.dataset.p==='city'){ citySendPlayer(); }"
    if alpha.count(OLD3) == 1:
        alpha = alpha.replace(OLD3,
            "  else if(t.dataset.p==='city'){ citySendPlayer(); setTimeout(cityGoToRunCell,60); setTimeout(cityGoToRunCell,900); }", 1)
    OLD4 = "fr.addEventListener('load',()=>{setTimeout(citySendPlayer,120);"
    if alpha.count(OLD4) == 1:
        alpha = alpha.replace(OLD4,
            "fr.addEventListener('load',()=>{setTimeout(citySendPlayer,120);setTimeout(cityGoToRunCell,300);", 1)
    applied.append('SHELL: remembers the run\'s cell and hands it to the city on open')

open(ALPHA, 'w', encoding='utf8').write(alpha)
for a in applied:
    print('  ' + a)
print('done' if applied else 'nothing to do')
