#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [the flock in its own clothes] (11/17, rule 453; BESTIARY's list in handoffs/CHARACTER.md, 'the Flock first'):
THE VOTE CARD'S PICTURE. The flock is a new faction (BESTIARY's 'waiting': Battle Brothers' cultists as the trailer park's people),
so there is no BEFORE: the bar's man, then each of its three men, south, south-east, east, north, 2:1, and what he wears.

    python3 tools/bohemia_character_the_flock_card.py [register <ship sha>]
-> records/target/character/the_flock/CHARACTER_THE_FLOCK.webp        (lossless WebP, PLUMBER 8's rule 2)
   records/target/character/the_flock/CHARACTER_THE_FLOCK_FIRST.webp  its top, for the tab's first look
The men are records/character/BOHEMIA_THE_NINE_ENEMIES_ROLL.json's 'Flock Faithful' (tools/bohemia_character_the_nine_enemies.py).
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OD = os.path.join(ROOT, 'records/target/character/the_flock')
STREET = 'records/character/enemies_nine_street'
FAC = ('S', 'SE', 'E', 'N')
GROUND, INK, DIM = (118, 106, 88, 255), (24, 22, 20, 255), (60, 54, 46, 255)
CARD_ID = 'character-the-flock-11-17'


def men():
    return [p for p in json.load(open(os.path.join(ROOT, 'records/character/BOHEMIA_THE_NINE_ENEMIES_ROLL.json'))) if p['gang'] == 'Flock Faithful']


def still(lk, f):
    im = Image.open(os.path.join(ROOT, STREET, lk, 'rig_%s.png' % f)).convert('RGBA'); return im.crop(im.getbbox())


def card():
    bar = Image.open(os.path.join(ROOT, 'records/target/cook3/rig/thug/rig_S.png')).convert('RGBA'); bar = bar.crop(bar.getbbox())
    rows = [(p, [still('enemy_' + p['id'], f) for f in FAC]) for p in men()]
    ims = [bar] + [i for _, r in rows for i in r]
    cw = max(i.width for i in ims) + 8; ch = max(i.height for i in ims) + 18; S = 2; LW = 190
    W = (LW + cw * 4 + 14) * S; H = (ch * (len(rows) + 1) + 10) * S
    sh = Image.new('RGBA', (W, H), GROUND); dr = ImageDraw.Draw(sh)
    BIG, SMALL = ImageFont.load_default(size=13 * S), ImageFont.load_default(size=9 * S)
    def put(im, x, y): sh.alpha_composite(im.resize((im.width * S, im.height * S), Image.NEAREST), (int((x + (cw - im.width) / 2) * S), int((y + ch - 14 - im.height) * S)))
    put(bar, LW - cw - 6, 0); dr.text((6 * S, 8 * S), 'THE BAR:\nthe thug', fill=INK, font=BIG)
    dr.text((LW * S + 8, 8 * S), 'THE FLOCK', fill=INK, font=BIG); dr.text((LW * S + 8, 26 * S), 'south, south-east, east, north', fill=DIM, font=SMALL)
    for j, (p, r) in enumerate(rows):
        y = ch * (j + 1)
        dr.text((6 * S, (y + 6) * S), p['id'].upper().replace('FLOCK_FAITHFUL_', 'FAITHFUL '), fill=INK, font=BIG)
        w = json.load(open(os.path.join(ROOT, 'records/character/rig/person_%s.json' % p['id'])))['worn']
        lines = [w[k].lower() for k in ('head', 'outer', 'mid', 'base', 'neck', 'back', 'waist', 'hands', 'gear', 'legs', 'feet') if isinstance(w.get(k), str)]
        for k, ln in enumerate(lines[:9]): dr.text((6 * S, (y + 24 + 10 * k) * S), ln, fill=DIM, font=SMALL)
        for i, im in enumerate(r): put(im, LW + cw * i, y)
    os.makedirs(OD, exist_ok=True)
    sh.convert('RGB').save(os.path.join(OD, 'CHARACTER_THE_FLOCK.webp'), 'WEBP', lossless=True, method=6, exact=True)
    box = [0, 0, W, int(ch * 2 * S)]
    sh.crop(box).convert('RGB').save(os.path.join(OD, 'CHARACTER_THE_FLOCK_FIRST.webp'), 'WEBP', lossless=True, method=6, exact=True)
    print('card', sh.size, 'first box', box); return box


def register(sha):
    rp = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'); R = json.load(open(rp))
    box = card()
    it = dict(
        id=CARD_ID, kind='outfit', lane='character', made='11/17', sha=sha, draft=True,
        title='THE FLOCK IN ITS OWN CLOTHES: THE TRAILER PARK\'S CONGREGATION, HOODED AND ROBED',
        said='do a full sweep / the clothes look good: leather and layering',
        why=('The Flock (Battle Brothers\' cultists as the trailer park\'s people) could not be fought because nobody had clothes for it; '
             'now three of its faithful wear a hooded poncho, a long sand robe-coat and a leather wrap robe over their own house clothes, '
             'each with the same charcoal cowl, nothing blue. You see it on this card now, and on the road once BESTIARY puts the Flock '
             'into the fights.'),
        options=['A, yes, send the Flock out like this', 'B, close, change something (say which one and what)', 'C, no, not like this'],
        show=dict(how='image', src='../records/target/character/the_flock/CHARACTER_THE_FLOCK.webp',
                  first='../records/target/character/the_flock/CHARACTER_THE_FLOCK_FIRST.webp', firstAt=box),
        twin=dict(src='records/target/cook3/rig/thug/rig_S.png', diffs=[
            'A NEW FACTION\'S OWN LOOK: robes and hoods (Battle Brothers\' cultist: a leather robe and a hood) made from what a trailer park owns, a dust poncho with its hood up, a sand cocoon coat, a leather wrap coat.',
            'ONE MARK FOR ALL: the same charcoal cowl on every one of them, so a band of them reads as one congregation across a fight.',
            'THE RECIPE: their own house clothes under it (a bone shirt, a henley, a tank), hand wraps, bracers, a cord belt, head wraps, no blue cloth, no trench.']),
        stage='made_from', golden='character-the-nine-enemies-their-own-clothes-11-7',
        recipe=('the nine enemies\' frozen recipe (layers that read apart, leather where it fits, no blue, no trench added), the new type '
                'in tools/bohemia_character_the_nine_enemies.py (TYPES[\'Flock Faithful\'], roll-more, make, pack)'))
    txt = open(rp).read(); line = '  ' + json.dumps(it, ensure_ascii=False)
    if any(x.get('id') == CARD_ID for x in R['items']):
        old = next(l for l in txt.split('\n') if ('"id": "%s"' % CARD_ID) in l and l.strip().startswith('{"id"'))
        txt = txt.replace(old, line + (',' if old.rstrip().endswith(',') else ''))
    else:
        k = txt.index('\n ],\n "verdicts"'); txt = txt[:k] + ',\n' + line + txt[k:]
    json.loads(txt)
    with open(rp, 'w') as f: f.write(txt)
    print('registered', CARD_ID)


if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[1] == 'register': register(sys.argv[2])
    else: card()
