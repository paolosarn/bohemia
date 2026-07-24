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
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'


def main():
    bank = json.load(open(BANK))
    heroes = {h['district']: h for h in bank['heroes']}
    districts = sorted(heroes)
    src = {d: 'data:image/png;base64,' + heroes[d]['b64'] for d in districts}
    anch = {d: {'bx': heroes[d]['bx'], 'by': heroes[d]['by']} for d in districts}

    alpha = open(ALPHA, encoding='utf8').read()
    m = re.search(r"const CITY_B64='([^']+)'", alpha)
    if not m:
        print('CITY_B64 not found'); sys.exit(1)
    dec = base64.b64decode(m.group(1)).decode('utf8')

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
    alpha = alpha[:m.start(1)] + new_b64 + alpha[m.end(1):]
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('HERO WIRE: %d district heroes wired via switch-guard; CITY_B64 %d KB' % (len(districts), len(dec) // 1024))
    print('   ', ' '.join(districts))


if __name__ == '__main__':
    main()
