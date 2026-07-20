#!/usr/bin/env python3
"""
BOHEMIA CITY LIGHTS PATCH (7/20/26, LIFE+CITY-SURFACE session) - the lights
at night, IN the city.

Paolo: "we spent so much time working on the streets, even the lights at
night - when do I see that implemented into the city?" The powergrid canon
(CLUSTERED POWER LAW: 12% of circuits live, feeder-sized runs, every live
circuit owned, LIGHT = TERRITORY) existed as engine/bohemia_powergrid.js and
was designed to run ON the overmap - but the city builder never consumed it.

This patch marries it in, the same way the streets were married:
  1. embeds the CANON powergrid body verbatim into the city page
  2. builds POWER = powerMap(om, seed) beside the overmap, and REBUILDS it
     wherever the city rebuilds its world (reroll / save restore) - the 12%
     lottery re-rolls with the world, exactly like the V11 slice
  3. at NIGHT, every LIVE arterial cell glows lamp-amber in the iso render:
     a lamp point + a soft pool. Dead circuits stay dark. Freeways stay
     dark (highway lighting died first; nobody patrols the dark). The Strip
     keeps its own glow (casino canon, untouched).
From the city view at night you can now READ territory by light, which is
the whole law: light = territory, the dark is nobody's.

Idempotent; city_tab_gate locks the powergrid body + glow marker so the
lights can never silently fall out of the city again.

  python3 tools/bohemia_city_lights_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
POWERGRID = 'engine/bohemia_powergrid.js'

pg = open(POWERGRID, encoding='utf8').read()
assert 'powerMap' in pg and 'BOH_POWERGRID' in pg

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

V2_CASE = ("case 'arterial': { dia(p,'#8a8a86');"
           " /* LIGHT=TERRITORY (7/20): live circuits queue their lamps; the"
           " pass after the night wash draws them so light cuts the dark and"
           " neighbors' tiles never occlude a lamp (the occlusion law). */"
           " if(night){ const pw=POWER.at(x,y); if(pw.live){"
           " (window.__LAMPQ=window.__LAMPQ||[]).push({sx:p.sx,sy:p.sy}); } } break; }")
LAMP_PASS_OLD = "if(night){ g.fillStyle='rgba(10,18,40,0.25)'; g.fillRect(0,0,cv.width,cv.height); }"
LAMP_PASS_NEW = (LAMP_PASS_OLD +
    " if(window.__LAMPQ){ const ga2=g.globalAlpha; g.globalAlpha=1;"
    " for(const q of window.__LAMPQ){"
    " g.fillStyle='rgba(255,170,60,0.25)';"
    " g.beginPath(); g.ellipse(q.sx,q.sy+TH*0.5,TW*0.55,TH*0.55,0,0,7); g.fill();"
    " g.fillStyle='rgba(255,205,100,0.95)';"
    " g.fillRect(q.sx-1.5,q.sy+TH*0.35,3,3); }"
    " g.globalAlpha=ga2; window.__LAMPQ=null; }")
NIGHT_DECL = "const night=isNight();"

# the probe surface: read-only hooks so gates + humans can interrogate the
# REAL surface (everything in the page is let/const scope, invisible outside).
# Defined right after POWER (same scope); closures resolve the later lets.
PROBE = ("\nwindow.__CITY={power:function(){return POWER;},night:function(){return isNight();},"
         "rerender:function(){render();},"
         "state:function(){return {seed:seed,TW:TW,TH:TH,cx:city.x,cy:city.y,panX:panX,panY:panY,mode:MODE};},"
         "isoAt:function(x,y){var ox=cv.width/2-(city.x-city.y)*TW/2+panX,"
         "oy=cv.height/2-(city.x+city.y)*TH/2+panY;return iso(x,y,ox,oy);}};\n")

if 'BOH_POWERGRID' in decoded:
    print('already lit. no-op.')
    sys.exit(0)

# 1) canon powergrid body, verbatim, before the game script
MARK = '/* ============ dual traversal proof ============ */'
assert MARK in decoded
decoded = decoded.replace(MARK, '/* ==== %s (canon, married 7/20) ==== */\n%s\n%s' % (POWERGRID, pg, MARK), 1)

# 2) POWER beside the world, rebuilt wherever the world rebuilds
FIRST = 'let seed=2026, om=OM.buildOvermap(seed);'
assert FIRST in decoded
decoded = decoded.replace(FIRST, FIRST + '\nlet POWER=BOH_POWERGRID.powerMap(om,seed);' + PROBE, 1)
REBUILD = 'om=OM.buildOvermap(seed);'
n = decoded.count(REBUILD) - 1          # the declaration line already handled
decoded = decoded.replace(REBUILD, REBUILD + 'POWER=BOH_POWERGRID.powerMap(om,seed);')
# undo the double-append on the declaration line
decoded = decoded.replace(
    FIRST + 'POWER=BOH_POWERGRID.powerMap(om,seed);\nlet POWER=BOH_POWERGRID.powerMap(om,seed);',
    FIRST + '\nlet POWER=BOH_POWERGRID.powerMap(om,seed);', 1)

# 3) LIGHT=TERRITORY: live arterials glow at night
OLD_CASE = "case 'arterial': dia(p,'#8a8a86'); break;"
assert OLD_CASE in decoded
decoded = decoded.replace(OLD_CASE, V2_CASE, 1)

# 4) queue reset at renderCity start (renderCity's night decl is the file's first)
assert decoded.count(NIGHT_DECL) >= 1
decoded = decoded.replace(NIGHT_DECL, NIGHT_DECL + ' window.__LAMPQ=null;', 1)

# 5) THE LAMP PASS: after the night wash, light cuts through the dark
assert LAMP_PASS_OLD in decoded
decoded = decoded.replace(LAMP_PASS_OLD, LAMP_PASS_NEW, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('lit: powergrid married into the city (%d world-rebuild hooks), arterial night glow in' % (n + 1))
