#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [the VOTE cards] (11/2/26, rule 330): one card per boss for the VOTE tab, his look and his place.
For THE POT, THE TAP and THE FILTER: the man himself from the front and turned (the people's rig, tools/bohemia_bosses_the_three_men.py),
his face, and his place on the map before and after he falls (tools/bohemia_bosses_paint_their_places_11_2_26.py), each at a whole
pixel scale on the map's dark ground, a plain caption under each. Registers the three cards in records/target/BOHEMIA_VOTE_REGISTRY.json.
  python3 tools/bohemia_bosses_vote_sheets_11_2_26.py [sha]
REUSE CHECK: no art is made here; the renders, cropped and laid side by side. TASTE CHECK: old beside new at the same size.
REFERENCE CHECK: none needed, no pixel is made.
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(R, 'records/target/bosses_act_one')
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
BOSSES = [('THE POT', 'pot', 'kitchen', 'THE KITCHEN'), ('THE TAP', 'tap', 'tower', 'THE PUMP HOUSE'), ('THE FILTER', 'filter', 'tanks', 'THE SETTLING TANKS')]


def sheet(n, pid, place, pname):
    d = os.path.join(R, 'records/target/character/bosses/boss_%s_0' % pid)
    men = [Image.open(os.path.join(d, 'rig_%s.png' % f)).convert('RGBA') for f in ('S', 'SE')]
    face = Image.open(os.path.join(d, 'face/rest_128.png')).convert('RGBA')
    pl = [Image.open(os.path.join(R, 'slices/boss_places/%s_%s_0.png' % (place, s))).convert('RGBA') for s in ('before', 'after')]
    k = 3
    tiles = [(m.resize((m.width * k, m.height * k), Image.NEAREST), cap) for m, cap in zip(men, (n, 'TURNED'))]
    tiles.append((face.resize((256, 256), Image.NEAREST), 'HIS FACE'))
    tiles += [(p.resize((p.width * 2, p.height * 2), Image.NEAREST), cap) for p, cap in zip(pl, ('BEFORE', 'AFTER HE FALLS'))]
    f = ImageFont.truetype(FB, 24)
    W = sum(t.width for t, _ in tiles) + 24 * (len(tiles) + 1); H = max(t.height for t, _ in tiles) + 24 * 2 + 40
    s = Image.new('RGBA', (W, H), (34, 31, 27, 255)); dr = ImageDraw.Draw(s); x = 24
    for t, cap in tiles:
        s.alpha_composite(t, (x, 24 + (H - 88 - t.height)))
        dr.text((x, H - 52), cap, font=f, fill=(242, 228, 198)); x += t.width + 24
    os.makedirs(OUT, exist_ok=True)
    fn = os.path.join(OUT, 'vote_%s.png' % pid); s.convert('RGB').save(fn, optimize=True)
    return fn


def register(sha):
    p = os.path.join(R, 'records/target/BOHEMIA_VOTE_REGISTRY.json'); J = json.load(open(p))
    have = set(i['id'] for i in J['items'])
    W = {'THE POT': ('a casino line cook who took the last good kitchen: grey chef\'s whites, a half apron, a wrapped cook\'s cap',
                     'his kitchen on the map: black smoke and dark windows; after he falls the fire is out, the windows are lit and the pot steams'),
         'THE TAP': ('the waterworks man who keeps the valve key: a utility vest over his work shirt, the work cap, shades, a tool belt',
                     'his pump house: a dry rusted tower with a red lamp blinking; after he falls the water pours out into a trough'),
         'THE FILTER': ('the last man who knows the water plant: work coveralls, a rubber respirator, a tool belt with his remote',
                        'his settling tanks: glowing green sludge and green fumes; after he falls the tanks are clean blue water')}
    for n, pid, place, pname in BOSSES:
        i = 'bosses-%s-look-and-place-11-2' % pid
        if i in have: continue
        man, pl = W[n]
        J['items'].append({'id': i, 'kind': 'outfit', 'lane': 'bosses', 'sha': sha, 'made': '11/2', 'draft': True,
                           'title': n + ': HIS OWN LOOK AND HIS PLACE, BEFORE AND AFTER',
                           'said': "each one has to have their own aesthetic... there's a bunch of bright pixels on the part of the map where I killed the boss... I'm so confused",
                           'why': 'The boss is ' + man + '. He wears it in the fight and on his card. ' + pl[0].upper() + pl[1:] + ', painted like the rest of the map (no more bright dots).',
                           'options': ['A, yes, like this', 'B, no, not like this'],
                           'show': {'how': 'image', 'src': '../records/target/bosses_act_one/vote_%s.png' % pid}})
    with open(p, 'w') as f: f.write(json.dumps(J, indent=1, ensure_ascii=False))


if __name__ == '__main__':
    for b in BOSSES: print(sheet(*b))
    register(sys.argv[1] if len(sys.argv) > 1 else 'pending')
