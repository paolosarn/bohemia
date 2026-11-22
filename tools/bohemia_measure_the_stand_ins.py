#!/usr/bin/env python3
"""THE STAND-INS, MEASURED (COMBAT FOUR 11/22/26; VAMILY rules 416, 59, 441).

An inside's piece is drawn AS a finished piece of another kit (its 'like') until COOK's own picture is in. On house tiles a stand-in
is drawn at its own size, so a shopping cart is 1% of a tile and a tile the table calls cover reads as bare floor (measured on the
campus's labs, 11/22). This tool measures every picture an inside may borrow: the share of one tile's pixels it actually paints
(alpha over 40), and writes gates/the_stand_ins_measured.json, which gates/the_big_insides_gate.js leg I13 reads.

Run it again when a kit gains a picture: python3 tools/bohemia_measure_the_stand_ins.py
"""
import json, os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FG = os.path.join(ROOT, 'slices', 'fight_ground')
OUT = os.path.join(ROOT, 'gates', 'the_stand_ins_measured.json')


def painted(path):
    a = Image.open(path).convert('RGBA').getchannel('A')
    h = a.histogram()
    return sum(h[41:])


def main():
    G = json.load(open(os.path.join(FG, 'fight_ground.json')))
    tw, th = G['tile_px']
    pics = {}
    dress = json.load(open(os.path.join(FG, 'street_board', 'dressing.json')))['kit']
    for k, v in dress.items():
        if isinstance(v, dict) and v.get('src'):
            pics[k] = v['src']
    ga = json.load(open(os.path.join(FG, 'garage', 'garage_art.json')))['kit']
    for k, v in ga.items():
        if isinstance(v, dict) and v.get('src'):
            pics[k] = v['src']
    for kit, pre in (('casino', 'casino_'), ('tunnels', 'tunnel_')):
        sz = json.load(open(os.path.join(FG, kit, 'sizes.json')))
        for k, v in sz.items():
            if isinstance(v, dict) and v.get('src'):
                pics[pre + k] = v['src']
    out = {}
    for k in sorted(pics):
        f = os.path.join(FG, pics[k])
        if os.path.exists(f):
            out[k] = round(painted(f) / float(tw * th), 4)
    doc = {
        'what': "The share of one fight tile's pixels each borrowable picture paints (alpha over 40), measured from the picture on disk.",
        'tile_px': [tw, th],
        'made_by': 'tools/bohemia_measure_the_stand_ins.py',
        'read_by': 'gates/the_big_insides_gate.js I13 (a cover tile drawn with a stand-in paints at least 10% of a tile)',
        'share': out,
    }
    json.dump(doc, open(OUT, 'w'), indent=1)
    print('measured', len(out), 'pictures ->', os.path.relpath(OUT, ROOT))


if __name__ == '__main__':
    main()
