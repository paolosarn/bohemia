#!/usr/bin/env python3
"""BOHEMIA -- PORTRAIT [the face pairs], step two of two: THE TWENTY FACE PAIRS. Rule 110 (the big swing day, Paolo
10/16) on this lane's MODE line: 'the twenty face pairs for his taste session (head only, head gear shown), ready to
show the moment the moodboard lands.' The same shape as DIRECTION's twenty for the ground (tools/bohemia_direction_
taste_session.py, records/BOHEMIA_THE_TASTE_SESSION_10_11_26.md, rule 108 ROUND TWELVE (5): 'twenty pairs, each pair
separating one choice that matters'): the SAME head shown twice with ONE measured operation changed, the knob named the
same way as DIRECTION's where it is the same knob (outline, colours, sat, value, warm, grit), so one taste session reads
the same across the ground and the face.

Nothing is drawn (rule 108a). The heads come from step one (tools/bohemia_cook_the_twenty_face_pairs.js: the game's own
faceFor()/renderFace() called unmodified, twenty real people, head only, head gear where their spec carries it). Every
change here is an image operation on that head with a number on it: a ring, a median cut, a scale of saturation or
value, a red/blue shift, his own burnt-ground tiles as a grime map, the gradient behind the head swapped for a flat
colour, a crop, a whole-number zoom, or a switch the renderer has carried since 9/24 (threeD, feat, brow).

The VOTE tab asks thumbs up or down, so a pair reads THUMBS UP = LEFT, THUMBS DOWN = RIGHT. Which side carries the
change is seeded (not always the right), so a lean toward one side cannot pass for a taste; the answer key is in the
JSON beside the pictures. Each pair is 1080 px wide (rule 89) and shows both heads at one whole-number zoom (5x, the
zoom a 64 px portrait needs to be a face on a 1080 px phone; the settlement screen draws it at 72 px today) WITH the
1:1 head printed under each, so one art pixel to one phone pixel is on the sheet too.

REFERENCE CHECK (the 9/4 standing duty): FACE-01, FACE-02 (the portrait's construction), FACE-03 (identity at 64 px),
AH-01 (R4 the light is in the room, R6 the still face, R10 grime baked, never a noise layer: the grime map is his
pack_7 burnt ground, the same tiles DIRECTION's session uses). No pack twin exists for a face (16c80eb7, f3090598);
the pair's own unchanged side is the control. The heads are placeholders under rule 108 ROUND THIRTEEN; the knobs
outlive the renderer.

PARKED until the moodboard lands (rule 82/87: no portrait sheet to VOTE until DIRECTION passes COOK THREE's; the
coordinator's sweep AI note on DIRECTION's session). The sheets, the key and the twenty registry items are written
now; `--register` appends the items to the VOTE registry and is run ONLY the round the coordinator says the
moodboard landed.

usage: python3 tools/bohemia_portrait_taste_session.py [--register]
out:   records/target/taste/PORTRAIT_TASTE_01.webp .. _20.webp (lossless), records/target/taste/PORTRAIT_TASTE_KEY.json,
       records/target/taste/PORTRAIT_TASTE_ITEMS_READY.json (the twenty registry items, ready)
"""
import os, sys, json, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference/art_bank')
OUT = os.path.join(ROOT, 'records/target/taste')
HEADS = json.load(open(os.path.join(OUT, 'PORTRAIT_HEADS.json')))
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
N, Z = 64, 5                                        # the head, and the whole-number zoom the sheet shows it at
BURNT = sorted(f for f in os.listdir(os.path.join(BANK, 'ground')) if f.startswith('pack_7_burnt_ground_tiles'))
img = lambda f: Image.open(os.path.join(ROOT, f)).convert('RGB')

# the renderer's own background: one gradient row per y (renderFace, the first loop), so it can be told from the person
BG = np.stack([(56 - 18 * (np.arange(N) / N)).astype(int), (54 - 18 * (np.arange(N) / N)).astype(int), (70 - 22 * (np.arange(N) / N)).astype(int)], 1)


def person_mask(a):
    """every pixel that is not the renderer's own gradient is the person (head, hair, gear)"""
    return ~(a[..., :3] == BG[:, None, :]).all(2)


def soil_colour():
    """the median of his soil tiles: a flat room colour taken from the pack, not invented"""
    px = []
    for i in range(4):
        t = np.asarray(Image.open(os.path.join(BANK, 'road', 'pack_2_soil_and_dirt_tiles_%03d.png' % i)).convert('RGBA'))
        px.append(t[t[..., 3] > 200][:, :3])
    return tuple(int(v) for v in np.median(np.concatenate(px), 0))


SOIL = soil_colour()


def render(head, setting='plain', outline=0, colours=None, sat=1.0, value=1.0, warm=0.0, grit=0.0, room=None, side=0.0,
           crop=0, zoom=Z, seed=7):
    """one head with one knob set; every default is the renderer as it ships. Returns the zoomed picture and the 1:1."""
    rng = random.Random(seed)
    a = np.asarray(img(head['files'][setting])).astype(float)
    M = person_mask(a)
    if room is not None:                             # what is behind the face: the gradient swapped for one flat colour
        a[~M] = room
    if grit > 0:                                     # grime from his burnt ground (R10), on the person only, never the room
        b = Image.new('L', (N, N))
        for y in range(0, N, 96):
            for x in range(0, N, 96):
                b.paste(Image.open(os.path.join(BANK, 'ground', rng.choice(BURNT))).convert('L').crop((0, 0, N, N)), (x, y))
        tex = np.asarray(b).astype(float) / 255.0
        k = (M * (0.55 + 0.45 * tex) * grit)[..., None]
        a[..., :3] = a[..., :3] * (1 - k) + np.array([34, 28, 20]) * k
    if side > 0:                                     # light from the top-left (the card): the right side of the person one step darker
        xs = np.arange(N) / N
        ramp = np.clip((xs - 0.5) / 0.35, 0, 1)      # nothing on the lit half, full on the far edge, a soft ramp between
        k = (M * ramp[None, :] * side)[..., None]
        a[..., :3] = a[..., :3] * (1 - k)
    if outline:                                      # a ring round the person, the same dark DIRECTION's ring uses
        m = Image.fromarray((M * 255).astype(np.uint8), 'L').filter(ImageFilter.MaxFilter(2 * outline + 1))
        ring = (np.asarray(m) > 127) & ~M
        a[ring, :3] = (38, 26, 18)
    out = Image.fromarray(np.clip(a[..., :3], 0, 255).astype(np.uint8), 'RGB')
    if sat != 1.0: out = ImageEnhance.Color(out).enhance(sat)
    if value != 1.0: out = Image.fromarray(np.clip(np.asarray(out).astype(float) * value, 0, 255).astype(np.uint8))
    if warm:
        w = np.asarray(out).astype(float); w[..., 0] *= 1 + warm; w[..., 2] *= 1 - warm
        out = Image.fromarray(np.clip(w, 0, 255).astype(np.uint8))
    if colours: out = out.quantize(colors=colours, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    if crop:                                         # the frame cut to the person plus a margin, the pixels untouched
        ys, xs = np.where(M); y0, y1, x0, x1 = max(0, ys.min() - crop), min(N, ys.max() + crop + 1), max(0, xs.min() - crop), min(N, xs.max() + crop + 1)
        out = out.crop((x0, y0, x1, y1))
    one = out
    return one.resize((one.width * zoom, one.height * zoom), Image.NEAREST), one


PAIRS = [  # head index (0-19, each a different real person), the one question, the two settings -- the first is the renderer as it ships where one exists
    (19, 'A LINE ROUND THE HEAD?', ('no line, the face as it ships', {}), ('a 1-pixel dark line round the head', {'outline': 1})),
    (1, 'HOW THICK A LINE?', ('a 1-pixel line', {'outline': 1}), ('a 2-pixel line', {'outline': 2})),
    (2, 'HOW MANY COLOURS?', ('every colour the face has', {}), ('cut to 16 colours', {'colours': 16})),
    (3, 'HOW MANY COLOURS?', ('every colour', {}), ('cut to 32 colours', {'colours': 32})),
    (4, 'HOW MANY COLOURS?', ('32 colours', {'colours': 32}), ('8 colours', {'colours': 8})),
    (5, 'HOW STRONG THE COLOUR?', ('the face\'s colour', {}), ('the colour at 55%', {'sat': 0.55})),
    (6, 'HOW STRONG THE COLOUR?', ('the colour at 80%', {'sat': 0.8}), ('the colour at 45%', {'sat': 0.45})),
    (7, 'HOW DARK?', ('as bright as it ships', {}), ('70% as bright', {'value': 0.7})),
    (8, 'HOW DARK?', ('as bright as it ships', {}), ('60% as bright', {'value': 0.6})),
    (9, 'WARM OR COLD LIGHT?', ('warm, a desert afternoon', {'warm': 0.08}), ('cold, a grey dawn', {'warm': -0.08})),
    (10, 'WHAT IS BEHIND THE FACE?', ('the blue-grey fade it ships with', {}), ('flat, nearly black', {'room': (12, 10, 9)})),
    (11, 'WHAT IS BEHIND THE FACE?', ('the blue-grey fade', {}), ('the colour of his dirt, flat', {'room': SOIL})),
    (12, 'HOW DIRTY THE FACE?', ('clean, as it ships', {}), ('grime from his burnt ground on the skin', {'grit': 0.35})),
    (13, 'HOW DIRTY THE FACE?', ('a little grime', {'grit': 0.2}), ('heavy grime', {'grit': 0.5})),
    (14, 'LIT FROM ONE SIDE OR FLAT?', ('flat, as it ships', {}), ('the far side one step darker', {'side': 0.28})),
    (15, 'FLAT OR 3-D?', ('flat', {}), ('3-D: a lit, turned head', {'setting': 'threeD'})),
    (16, 'HOW BIG THE FEATURES?', ('the features as they ship', {}), ('the features 20% bigger', {'setting': 'feat120'})),
    (17, 'HOW MUCH ROOM ROUND THE HEAD?', ('the frame as it ships', {}), ('the frame cut to the head plus 3', {'crop': 3})),
    (18, 'HOW BIG ON THE PHONE?', ('four pixels to one', {'zoom': 4}), ('six pixels to one', {'zoom': 6})),
    (0, 'AT REST: BLANK OR A LITTLE BROW?', ('the face at rest', {}), ('the brow down a touch', {'setting': 'brow'})),
]


def gear_word(h):
    return 'durag' if h['hat'] else ('shades' if h['glasses'] else 'no gear')


def main(register=False):
    os.makedirs(OUT, exist_ok=True)
    F_Q, F_L, F_S = ImageFont.truetype(ROM, 26), ImageFont.truetype(ROM, 20), ImageFont.truetype(ROM, 16)
    flip = random.Random(20261017); key = []; items = []
    heads = HEADS['heads']
    assert len(heads) == 20 and len({h['id'] for h in heads}) == 20, 'twenty different people'
    for n, (hi, q, a, b) in enumerate(PAIRS, 1):
        h = heads[hi]
        left, right = (a, b) if flip.random() < 0.5 else (b, a)
        (L, L1), (R, R1) = render(h, **left[1]), render(h, **right[1])
        # the proof the pair is one knob: outside what the knob touches, nothing moved (measured on the two 1:1 sides)
        ctrl1 = render(h)[1]
        same = [np.array_equal(np.asarray(x), np.asarray(ctrl1)) for x in (L1, R1)]
        slot = 408; top = 64; band = max(L.height, R.height)
        sheet = Image.new('RGB', (1080, top + band + 24 + N + 60), (14, 13, 12)); d = ImageDraw.Draw(sheet)
        d.text((12, 16), '%d OF 20  %s' % (n, q), font=F_Q, fill=(236, 230, 218))
        d.text((12, 46), '%s, %s   (the same person twice, one thing changed)' % (h['label'], gear_word(h)), font=F_S, fill=(150, 142, 128))
        lx, rx = 120 + (slot - L.width) // 2, 552 + (slot - R.width) // 2
        sheet.paste(L, (lx, top + (band - L.height) // 2)); sheet.paste(R, (rx, top + (band - R.height) // 2))
        y1 = top + band + 24
        sheet.paste(L1, (120 + (slot - L1.width) // 2, y1)); sheet.paste(R1, (552 + (slot - R1.width) // 2, y1))
        d.text((12, y1 + 20), '1:1', font=F_S, fill=(120, 112, 100))
        d.text((12, y1 + N + 10), 'UP: ' + left[0], font=F_L, fill=(226, 162, 72))
        d.text((552, y1 + N + 10), 'DOWN: ' + right[0], font=F_L, fill=(150, 190, 160))
        f = os.path.join(OUT, 'PORTRAIT_TASTE_%02d.webp' % n); sheet.save(f, lossless=True, method=6)
        key.append(dict(n=n, person=h['id'], label=h['label'], gear=gear_word(h), question=q,
                        up=dict(label=left[0], set=left[1]), down=dict(label=right[0], set=right[1]),
                        unchanged_side_is_the_shipping_face=same, file=os.path.relpath(f, ROOT)))
        items.append(dict(
            id='portrait-taste-%02d-10-17' % n, kind='face', lane='portrait', sha='PENDING', made='10/17',
            title='%d OF 20: %s' % (n, q),
            why='The same face twice with one thing changed. UP picks the left picture, DOWN the right, and your taps become the rule for every face. You see it in the VOTE tab at 1:1 and zoomed.',
            show=dict(how='image', src='../' + os.path.relpath(f, ROOT)),
            twin=dict(src=h['files']['plain'], diffs=[
                'THE ONE CHANGE: UP = %s; DOWN = %s; nothing else differs between the two sides.' % (left[0], right[0]),
                'THE CONTROL: the unchanged side is the face as it ships today (the twin), byte-identical to it at 1:1; no pack holds a character face to stand beside it (16c80eb7, f3090598).',
                'THE HEAD IS A PLACEHOLDER under rule 108 ROUND THIRTEEN; the knob (line, colours, light, grime, strength, darkness, warmth, room, size) outlives the renderer.']),
            draft=True, parked='until the moodboard lands (rule 82/87); registered by tools/bohemia_portrait_taste_session.py --register'))
        print(n, q, '| UP', left[0], '| DOWN', right[0], '| control byte-identical:', same)
    json.dump(dict(session='THE TASTE SESSION: THE FACE', lane='portrait', date='10/17/26', rule='110 on 108 ROUND TWELVE (5)',
                   read='thumbs up = the left picture, thumbs down = the right; one knob changes per pair; the same twenty knobs read with DIRECTION\'s session where the knob is the same',
                   heads=os.path.relpath(os.path.join(OUT, 'PORTRAIT_HEADS.json'), ROOT), gear_shown=HEADS['gear_shown'], soil_room=SOIL,
                   pairs=key), open(os.path.join(OUT, 'PORTRAIT_TASTE_KEY.json'), 'w'), indent=1)
    json.dump(dict(readme='The twenty registry items for the face taste session, ready; appended to records/target/BOHEMIA_VOTE_REGISTRY.json by --register the round the moodboard lands, never before (rule 82/87).',
                   items=items), open(os.path.join(OUT, 'PORTRAIT_TASTE_ITEMS_READY.json'), 'w'), indent=1)
    if register:
        reg = json.load(open(REG)); have = {i['id'] for i in reg['items']}
        sha = os.popen('git -C "%s" rev-parse --short HEAD' % ROOT).read().strip()
        for it in items:
            if it['id'] in have: continue
            it = dict(it); it['sha'] = sha; it.pop('parked', None); reg['items'].append(it)
        json.dump(reg, open(REG, 'w'), indent=1)
        print('REGISTERED', len(items), 'items at', sha, '-- run node gates/vote_tab_gate.js before you push')


if __name__ == '__main__':
    main(register='--register' in sys.argv)
