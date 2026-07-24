#!/usr/bin/env python3
"""BOHEMIA CITY HERO WIRE PATCH (7/24/26) — married the approved DISTRICT HERO
sprites into the CITY tab's zoomed-out render.

Paolo 7/24 approved the v7 heroes ("that looks so good so much better frfr") —
NOTES ARE RULINGS, so they get built into the real thing. The city-view render
(renderCity's switch(d)) drew cityhall/battery/terminal as crude dia+prism
blocks (cityhall had NO case at all, battery even painted a DEAD-WORLD-illegal
green stripe). This patch drops the baked hero PNG on each of those tiles
instead, anchored on the cell's ground-center, scaled so the sprite's ground
plate == one cell diamond (TW wide). Falls back to the old block if the image
has not decoded yet (zero-risk, additive).

REUSE CHECK: reuses the approved hero bank verbatim
(banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt, opened + read here) — no
new pixels cooked. The sprites themselves are matched to each walkable district
by the hero factory.

Idempotent (markers HERO_WIRE_START/END + the drawHero-wrapped cases). Decodes
the alpha's CITY_B64, injects, re-encodes. Rerun after the factory re-bakes to
refresh the embedded sprites.

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
DISTRICTS = ['cityhall', 'battery', 'terminal']


def main():
    bank = json.load(open(BANK))
    heroes = {h['district']: h for h in bank['heroes']}
    src = {d: 'data:image/png;base64,' + heroes[d]['b64'] for d in DISTRICTS}
    anch = {d: {'bx': heroes[d]['bx'], 'by': heroes[d]['by']} for d in DISTRICTS}

    alpha = open(ALPHA, encoding='utf8').read()
    m = re.search(r"const CITY_B64='([^']+)'", alpha)
    if not m:
        print('CITY_B64 not found'); sys.exit(1)
    dec = base64.b64decode(m.group(1)).decode('utf8')

    # ---- 1. the HERO block: sprite images + anchors + drawHero(), injected once
    #         before renderCity. Re-injected fresh each run (sprites may change).
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

    # ---- 2. wire the switch cases (idempotent: only if not already wrapped)
    if "drawHero('terminal'" not in dec:
        dec = dec.replace(
            "case 'terminal': { dia(p,'#a8a49a'); prism(p, 6, '#e8e4dc', '#c85028'); break; }",
            "case 'terminal': { if(!drawHero('terminal',p)){ dia(p,'#a8a49a'); prism(p, 6, '#e8e4dc', '#c85028'); } break; }", 1)
    # battery case (drop the dead-world-illegal green stripe from the fallback too)
    bat = re.search(r"case 'battery': \{[^\n]*?break; \}", dec)
    if bat and "drawHero('battery'" not in bat.group(0):
        dec = dec.replace(bat.group(0),
            "case 'battery': { if(!drawHero('battery',p)){ dia(p,'#8a8a82'); prism(p,4,'#c8c4b8','#6a6a72'); } break; }", 1)
    # cityhall has NO case -> insert one before the battery case
    if "drawHero('cityhall'" not in dec:
        marker = "case 'battery': {"
        dec = dec.replace(marker,
            "case 'cityhall': { if(!drawHero('cityhall',p)){ dia(p,'#b0aa9a'); prism(p,8,'#e8e4dc','#8a7f5e'); } break; }\n        " + marker, 1)

    for d in DISTRICTS:
        if ("drawHero('%s'" % d) not in dec:
            print('FAILED to wire case:', d); sys.exit(1)

    new_b64 = base64.b64encode(dec.encode('utf8')).decode('ascii')
    alpha = alpha[:m.start(1)] + new_b64 + alpha[m.end(1):]
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('HERO WIRE: %d heroes drawn on their city tiles (cityhall/battery/terminal); CITY_B64 %d KB' % (len(DISTRICTS), len(dec) // 1024))


if __name__ == '__main__':
    main()
