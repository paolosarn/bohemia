#!/usr/bin/env python3
"""
BOHEMIA CITY DEAD-WORLD PREFAB FIX (7/22/26) - a live standing-law violation
found while tracing district texture routing: the generic lot-prefab
decoder ('g' and 't' ascii codes in PREFABS, e.g. park's 'grove' prefab and
downtown's 'tower_plaza') painted LIVE GRASS GREEN ('#7aa05a') and TREE
GREEN ('#3a6a2a') - a direct DEAD WORLD LAW violation (CLAUDE.md: "ACT 1 IS
A DEAD WORLD: no vegetation ever"). Suburb's own 'g'/'t' PREFABS entries
are dead code (SUB_RES intercepts before this path runs for suburb/gated/
estate), so the live blast radius is 'park' (heavy - the whole 'grove'
prefab) and 'downtown' (light - one tile in 'tower_plaza').

Fix: 'g' becomes dead dirt (the same tone family the suburb's dead ground
already uses); 't' becomes a dead prop (a dry stump/rock silhouette, not
deleted - the decay tell is a DEAD planter, not an erased one, per the
7/21 desert-house research: "dead pools and dry planters are the decay
tells, not dead grass").

Idempotent (marker 'DEAD WORLD PREFAB FIX'). city_tab_gate locks it in.

  python3 tools/bohemia_city_deadworld_prefab_patch.py
"""
import base64
import sys
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'DEAD WORLD PREFAB FIX' in decoded:
    print('the prefab decoder already refuses live vegetation. no-op.')
    sys.exit(0)

OLD = """    else if(ch==='p'){ c.g='#c8c4b8'; }
    else if(ch==='g'){ c.g='#7aa05a'; }
    else if(ch==='t'){ c.s='#3a6a2a'; c.walk=false; }
    else if(ch==='w'){ c.g='#3a6a8a'; c.walk=false; }"""
assert OLD in decoded
NEW = """    else if(ch==='p'){ c.g='#c8c4b8'; }
    /* DEAD WORLD PREFAB FIX (7/22): 'g'/'t' used to paint live grass/tree
       green - a standing-law violation (park's 'grove' prefab, downtown's
       'tower_plaza'). Dead dirt + a dry dead-prop silhouette instead. */
    else if(ch==='g'){ c.g='#8a7a5e'; }
    else if(ch==='t'){ c.s='#6a5c48'; c.walk=false; }
    else if(ch==='w'){ c.g='#3a6a8a'; c.walk=false; }"""
decoded = decoded.replace(OLD, NEW, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('dead world holds: prefab grass/tree codes no longer paint live green')
