#!/usr/bin/env python3
"""BOHEMIA CITY HERO WIRE PATCH (7/24/26) — married the approved DISTRICT HERO
sprites into the CITY tab's zoomed-out render.

Paolo 7/24 approved the matched heroes and asked for "the same treatment" across
the walkable district roster. So the city-view render draws each district's baked
hero PNG on its tile instead of a crude dia+prism block. The mechanism is ONE
format-agnostic guard on the render switch:

    switch(d){ ... }   ->   if(!(HERO_IMG[d]&&drawHero(d,p)))switch(d){ ... }

so any district that HAS a hero (and whose sprite has decoded) draws the sprite
and skips the block; every other district — and the first frame before images
load — falls through to the existing block unchanged (zero-risk, additive). The
sprite is anchored on the cell ground-center, scaled so its plate == one cell
diamond (TW wide).

REUSE CHECK: reuses the approved hero bank verbatim
(banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt, opened + read here) — no new
pixels cooked. Sprites are matched to each walkable district by the hero factory.

Idempotent (markers HERO_WIRE_START/END + the guarded switch). Decodes the alpha
CITY_B64, injects, re-encodes. Rerun after the factory re-bakes / adds districts.

  python3 tools/bohemia_city_hero_wire_patch.py
"""
import base64
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
# THE CITY MOVED OUT OF THE ALPHA (8/2, the payload-wall pass in another lane): the city app
# is its own file now and the alpha loads it in an iframe. This tool follows the file rather
# than assuming where the city lives, so a lane moving a payload cannot silently stop the
# heroes being drawn. Both paths are tried; whichever carries CITY_B64 gets patched.
CITY_FILES = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ALPHA_0_9.html']
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'


def main():
    bank = json.load(open(BANK))
    heroes = {h['district']: h for h in bank['heroes']}
    districts = sorted(heroes)
    src = {d: 'data:image/png;base64,' + heroes[d]['b64'] for d in districts}
    anch = {d: {'bx': heroes[d]['bx'], 'by': heroes[d]['by']} for d in districts}

    # THE CITY MOVED, AND IT ALSO STOPPED BEING BASE64. The payload-wall pass put the city
    # app in its own file with its source INLINE. So this handles both shapes: a CITY_B64
    # blob to decode and re-encode, or plain text to patch in place. Following the artefact
    # instead of assuming its shape is the only way a tool survives another lane's refactor.
    target, alpha, m, inline = None, None, None, False
    for cand in CITY_FILES:
        if not os.path.exists(cand):
            continue
        txt = open(cand, encoding='utf8').read()
        mm = re.search(r"const CITY_B64='([^']+)'", txt)
        if mm:
            target, alpha, m = cand, txt, mm
            break
        if 'function renderCity(){' in txt:
            target, alpha, inline = cand, txt, True
            break
    if not target:
        print('no city app found in: ' + ', '.join(CITY_FILES)); sys.exit(1)
    dec = alpha if inline else base64.b64decode(m.group(1)).decode('utf8')

    # ---- 1. the HERO block: sprite images + anchors + drawHero(), before renderCity
    block = (
        "/*HERO_WIRE_START*/\n"
        "var HERO_ANCH=" + json.dumps(anch, separators=(',', ':')) + ";\n"
        "var HERO_SRC=" + json.dumps(src, separators=(',', ':')) + ";\n"
        "var HERO_IMG={};(function(){for(var k in HERO_SRC){var im=new Image();im.src=HERO_SRC[k];HERO_IMG[k]=im;}})();\n"
        "function drawHero(name,p){var im=HERO_IMG[name];if(!im||!im.complete||!im.naturalWidth)return false;"
        "var plate=im.naturalWidth-28,sc=TW/plate,a=HERO_ANCH[name];"
        "g.drawImage(im,p.sx-a.bx*sc,p.sy+TH/2-a.by*sc,im.naturalWidth*sc,im.naturalHeight*sc);return true;}\n"
        "/*HERO_WIRE_END*/\n"
    )
    dec = re.sub(r"/\*HERO_WIRE_START\*/.*?/\*HERO_WIRE_END\*/\n", "", dec, flags=re.S)  # strip old
    anchor = "function renderCity(){"
    if anchor not in dec:
        print('renderCity not found'); sys.exit(1)
    dec = dec.replace(anchor, block + anchor, 1)

    # ---- 2. guard the render switch (idempotent). Older builds may have per-case
    #         drawHero wraps from the first version; the guard supersedes them
    #         (harmless dead paths), so we only need to ensure the guard is present.
    GUARD = "if(!(HERO_IMG[d]&&drawHero(d,p)))switch(d){"
    if GUARD not in dec:
        # the switch lives right after `const d=t.district, r=OM.rng(t.seed);`
        idx = dec.find("const d=t.district")
        sw = dec.find("switch(d){", idx)
        if idx < 0 or sw < 0:
            print('render switch not found'); sys.exit(1)
        dec = dec[:sw] + GUARD + dec[sw + len("switch(d){"):]

    if GUARD not in dec or "function drawHero(" not in dec:
        print('FAILED to wire the switch guard'); sys.exit(1)

    new_b64 = base64.b64encode(dec.encode('utf8')).decode('ascii')
    alpha = (dec if inline else
             alpha[:m.start(1)] + base64.b64encode(dec.encode('utf8')).decode() + alpha[m.end(1):])
    open(target, 'w', encoding='utf8').write(alpha)
    print('HERO WIRE: %d district heroes wired via switch-guard; CITY_B64 %d KB' % (len(districts), len(dec) // 1024))
    print('   ', ' '.join(districts))


if __name__ == '__main__':
    main()
