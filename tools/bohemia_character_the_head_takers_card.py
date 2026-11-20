#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [the head takers in their own clothes] (11/20, rule 461 the whole enchilada; BESTIARY's stand-in list in
handoffs/CHARACTER.md: the head taker in faction_volunteers, the smoker in person_volunteers_1, the darter in person_volunteers_2):
THE VOTE CARD'S PICTURE. Per type: what it fought in until now (the stand-in's own fight sheet, standing, south and south-east), then
each of its men, south, south-east, east, north, 2:1, and what he wears.

    python3 tools/bohemia_character_the_head_takers_card.py [register <ship sha>]
-> records/target/character/the_head_takers/CHARACTER_THE_HEAD_TAKERS.webp        (lossless WebP, PLUMBER 8's rule 2)
   records/target/character/the_head_takers/CHARACTER_THE_HEAD_TAKERS_FIRST.webp  its top, for the tab's first look
The men are records/character/BOHEMIA_THE_NINE_ENEMIES_ROLL.json's 'Head Taker', 'Smoker' and 'Darter' (tools/bohemia_character_the_nine_enemies.py).
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OD = os.path.join(ROOT, 'records/target/character/the_head_takers')
STREET = 'records/character/enemies_nine_street'
FAC = ('S', 'SE', 'E', 'N')
GROUND, INK, DIM, MARK = (118, 106, 88, 255), (24, 22, 20, 255), (60, 54, 46, 255), (96, 30, 26, 255)
CARD_ID = 'character-the-head-takers-11-20'
HATS = {}
FEATHER = {}
TYPES = (('Head Taker', 'THE HEAD TAKER', 'faction_volunteers', 'the Volunteers\' one-piece'),
         ('Smoker', 'THE SMOKER', 'person_volunteers_1', 'a Volunteers hall man\'s'),
         ('Darter', 'THE DARTER', 'person_volunteers_2', 'a Volunteers hall man\'s'))


def men(t):
    return [p for p in json.load(open(os.path.join(ROOT, 'records/character/BOHEMIA_THE_NINE_ENEMIES_ROLL.json'))) if p['gang'] == t]


def still(lk, f):
    im = Image.open(os.path.join(ROOT, STREET, lk, 'rig_%s.png' % f)).convert('RGBA'); return im.crop(im.getbbox())


def stand_in(look, row):
    I = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'))); L = I['looks'][look]
    sh = Image.open(os.path.join(ROOT, 'slices/fight_rig', L['file'])).convert('RGBA')
    im = sh.crop((0, row * L['h'], L['w'], (row + 1) * L['h'])); return im.crop(im.getbbox())


def card():
    blocks = []
    for t, title, look, said in TYPES:
        blocks.append((t, title, look, said, [stand_in(look, 0), stand_in(look, 1)], [(p, [still('enemy_' + p['id'], f) for f in FAC]) for p in men(t)]))
    ims = [i for b in blocks for i in b[4]] + [i for b in blocks for _, r in b[5] for i in r]
    cw = max(i.width for i in ims) + 8; ch = max(i.height for i in ims) + 18; S = 2; LW = 196
    nrows = sum(1 + len(b[5]) for b in blocks)
    W = (LW + cw * 4 + 14) * S; H = (ch * nrows + 10) * S
    sh = Image.new('RGBA', (W, H), GROUND); dr = ImageDraw.Draw(sh)
    BIG, SMALL = ImageFont.load_default(size=13 * S), ImageFont.load_default(size=9 * S)
    def put(im, x, y): sh.alpha_composite(im.resize((im.width * S, im.height * S), Image.NEAREST), (int((x + (cw - im.width) / 2) * S), int((y + ch - 14 - im.height) * S)))
    y = 0; first_end = None
    for t, title, look, said, before, rows in blocks:
        dr.text((6 * S, (y + 8) * S), title, fill=INK, font=BIG)
        dr.text((6 * S, (y + 26) * S), 'UNTIL NOW, in the fight:\n' + said + ' look\n(a stand-in, ' + look + ')', fill=MARK, font=SMALL)
        for i, im in enumerate(before): put(im, LW + cw * i, y)
        dr.text(((LW + cw * 2 + 6) * S, (y + 8) * S), 'NOW, his own\nclothes:', fill=INK, font=BIG)
        dr.text(((LW + cw * 2 + 6) * S, (y + 42) * S), 'south, south-east,\neast, north', fill=DIM, font=SMALL)
        y += ch
        for p, r in rows:
            dr.text((6 * S, (y + 6) * S), p['id'].upper().replace('HEAD_TAKER_', 'HEAD TAKER ').replace('TAKER_SMOKER_', 'SMOKER ').replace('TAKER_DARTER_', 'DARTER '), fill=INK, font=BIG)
            w = json.load(open(os.path.join(ROOT, 'records/character/rig/person_%s.json' % p['id'])))['worn']
            hat = HATS.get(p.get('hat'), (p.get('hat') or '').replace('HAT ', '').lower())
            lines = ([hat] if hat else []) + [w[k].lower() for k in ('outer', 'mid', 'base', 'neck', 'back', 'waist', 'hands', 'gear', 'legs', 'feet') if isinstance(w.get(k), str)]
            if p.get('eyewear'): lines.insert(1, p['eyewear'].replace('FACE ', '').lower())
            for k, ln in enumerate([l for l in lines if l][:10]): dr.text((6 * S, (y + 24 + 10 * k) * S), ln, fill=DIM, font=SMALL)
            for i, im in enumerate(r): put(im, LW + cw * i, y)
            y += ch
            if first_end is None: first_end = y
    os.makedirs(OD, exist_ok=True)
    sh.convert('RGB').save(os.path.join(OD, 'CHARACTER_THE_HEAD_TAKERS.webp'), 'WEBP', lossless=True, method=6, exact=True)
    box = [0, 0, W, int(first_end * S)]
    sh.crop(box).convert('RGB').save(os.path.join(OD, 'CHARACTER_THE_HEAD_TAKERS_FIRST.webp'), 'WEBP', lossless=True, method=6, exact=True)
    print('card', sh.size, 'first box', box); return box


def register(sha):
    rp = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'); R = json.load(open(rp))
    box = card()
    it = dict(
        id=CARD_ID, kind='outfit', lane='character', made='11/20', sha=sha, draft=True,
        title='THE HEAD TAKERS IN THEIR OWN CLOTHES: MEN WHO HUNT MEN, IN THE HUNTER\'S BLAZE',
        said='full sweep, whole enchilada, dont forget nothing / the clothes look good: leather and layering',
        why=('The head takers fought in the Volunteers\' one-piece look and two hall men\'s clothes; now three head takers in work coats '
             'with plate strapped over them, two smokers in ponchos and dust masks with a satchel of pots, and two darters in field coats '
             'with a bolt quiver, every one with a hunter\'s blaze scarf in the head takers\' own yellow-green. You see it in every fight '
             'against the head takers, and on this card.'),
        options=['A, yes, the head takers look like this', 'B, close, change something (say which one and what)', 'C, no, not like this'],
        show=dict(how='image', src='../records/target/character/the_head_takers/CHARACTER_THE_HEAD_TAKERS.webp',
                  first='../records/target/character/the_head_takers/CHARACTER_THE_HEAD_TAKERS_FIRST.webp', firstAt=box),
        twin=dict(src='records/target/cook3/rig/thug/rig_S.png', diffs=[
            'BOUNTY HUNTERS\' OWN LOOK (Battle Brothers\' bounty hunters: a hunter\'s coat and plate): a rust work coat, a chore coat, an oxblood drifter\'s coat, a soot or a scrap chest plate strapped over, a shell bandolier.',
            'ONE MARK FOR ALL SEVEN: a blaze scarf in the head takers\' own banner ink (yellow-green), what a hunter wears so his own side does not shoot him; it reads at the throat from every facing.',
            'THE SMOKE AND THE SLEEP: the smokers in an oxblood or a dust poncho, a dust mask and a satchel of pots; the darters in a charcoal car coat or a barn coat with a bolt quiver on the back.']),
        stage='made_from', golden='character-the-nine-enemies-their-own-clothes-11-7',
        recipe=('the nine enemies\' frozen recipe (layers that read apart, leather where it fits, no blue, no trench added), the three new types in '
                'tools/bohemia_character_the_nine_enemies.py (TYPES[\'Head Taker\'], [\'Smoker\'], [\'Darter\'], the BLAZE SCARF, roll-more, make, pack)'))
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
