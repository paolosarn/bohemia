#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [the hires dressed] (11/11, rule 427(b)'s 'then the hires', ask 238): THE VOTE CARD'S PICTURES (rule 89: before
and after of the same thing at one pixel to one pixel; rule 408: MADE FROM the nine enemies' recipe he passed, the bar's man beside it).

    python3 tools/bohemia_character_the_hires_dressed_card.py [base sha] [register <ship sha>]
-> records/target/character/the_hires_dressed/CHARACTER_THE_HIRES_DRESSED.png        the bar's thug, then every re-dressed man:
                                                                                     BEFORE (his street still at the base sha) and
                                                                                     AFTER (now), south, south-east, east, north, 2:1
   records/target/character/the_hires_dressed/CHARACTER_THE_HIRES_DRESSED_FIRST.png  its top, for the tab's first look
   records/target/character/the_hires_dressed/CHARACTER_THE_HIRES_DRESSED_PHONE.jpg  the five screens on his phone, upright then on
                                                                                     its side, before above and after below
The men and their added layers are records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json (the 'coat', 'top', 'legs', 'feet' and 'kit' of the six);
the phone's screens are tools/bohemia_character_the_hires_dressed_shots.js.
"""
import io, json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OD = os.path.join(ROOT, 'records/target/character/the_hires_dressed')
BASE = sys.argv[1] if len(sys.argv) > 1 else '2658f42e0'
MEN = ['anarchists_2', 'colorful_0', 'homeless_0', 'reds_0', 'reds_1', 'remnants_0']   # the hall's six thinnest (2 layers each)
FAC = ('S', 'SE', 'E', 'N')
GROUND, INK, DIM = (118, 106, 88, 255), (24, 22, 20, 255), (60, 54, 46, 255)


def still(pid, f, at=None):
    p = 'records/target/character/barber/person_%s/rig_%s.png' % (pid, f)
    if at: im = Image.open(io.BytesIO(subprocess.run(['git', 'show', '%s:%s' % (at, p)], cwd=ROOT, capture_output=True).stdout))
    else: im = Image.open(os.path.join(ROOT, p))
    im = im.convert('RGBA'); return im.crop(im.getbbox())


def card():
    R = {p['id']: p for p in json.load(open(os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')))}
    bar = Image.open(os.path.join(ROOT, 'records/target/cook3/rig/thug/rig_S.png')).convert('RGBA'); bar = bar.crop(bar.getbbox())
    rows = [(pid, [still(pid, f, BASE) for f in FAC], [still(pid, f) for f in FAC]) for pid in MEN]
    ims = [bar] + [i for r in rows for i in r[1] + r[2]]
    cw = max(i.width for i in ims) + 6; ch = max(i.height for i in ims) + 18; S = 2; LW = 150
    W = (LW + cw * 8 + 30 + 14) * S; H = (ch * (len(rows) + 1) + 10) * S
    sh = Image.new('RGBA', (W, H), GROUND); dr = ImageDraw.Draw(sh)
    BIG, SMALL = ImageFont.load_default(size=13 * S), ImageFont.load_default(size=9 * S)
    def put(im, x, y): sh.alpha_composite(im.resize((im.width * S, im.height * S), Image.NEAREST), (int((x + (cw - im.width) / 2) * S), int((y + ch - 14 - im.height) * S)))
    put(bar, LW - cw - 6, 0); dr.text((6 * S, 8 * S), 'THE BAR:\nthe thug', fill=INK, font=BIG)
    dr.text((LW * S + 8, 8 * S), 'BEFORE', fill=INK, font=BIG); dr.text(((LW + cw * 4 + 30) * S + 8, 8 * S), 'AFTER', fill=INK, font=BIG); dr.text(((LW + cw * 4 + 30) * S + 8, 26 * S), 'what he wears now', fill=DIM, font=SMALL)
    dr.text((LW * S + 8, 26 * S), 'south, south-east, east, north', fill=DIM, font=SMALL)
    for j, (pid, before, after) in enumerate(rows):
        y = ch * (j + 1)
        dr.text((6 * S, (y + 6) * S), pid.upper(), fill=INK, font=BIG)
        # what he wears now, off his own build record (the outfit's last word, not the roll's ask), outside in
        w = json.load(open(os.path.join(ROOT, 'records/character/rig/person_%s.json' % pid)))['worn']
        lines = [w[k].lower() for k in ('outer', 'mid', 'base', 'neck', 'back', 'waist', 'hands', 'gear', 'legs', 'feet') if isinstance(w.get(k), str)]
        for k, ln in enumerate(lines[:8]): dr.text((6 * S, (y + 24 + 10 * k) * S), ln, fill=DIM, font=SMALL)
        for i, im in enumerate(before): put(im, LW + cw * i, y)
        for i, im in enumerate(after): put(im, LW + cw * (4 + i) + 30, y)
        dr.line([((LW + cw * 4 + 8) * S, (y + ch / 2) * S), ((LW + cw * 4 + 22) * S, (y + ch / 2) * S)], fill=INK, width=S)
    os.makedirs(OD, exist_ok=True)
    sh.convert('RGB').save(os.path.join(OD, 'CHARACTER_THE_HIRES_DRESSED.png'), optimize=True)
    box = [0, 0, W, int(ch * 4 * S)]
    sh.crop(box).convert('RGB').save(os.path.join(OD, 'CHARACTER_THE_HIRES_DRESSED_FIRST.png'), optimize=True)
    print('card', sh.size, 'first box', box); return box


def phone():
    rows = []
    for d in ('before', 'after'):
        for prof in ('phone_portrait', 'phone_landscape'):
            rows.append((d, prof, [Image.open(os.path.join(OD, d, '%s_%s.jpg' % (prof, s))).convert('RGB') for s in ('hall', 'hallweek', 'crew', 'map', 'fight')]))
    sc = {'phone_portrait': 0.22, 'phone_landscape': 0.18}
    tiles = [[im.resize((int(im.width * sc[p]), int(im.height * sc[p])), Image.LANCZOS) for im in ims] for _, p, ims in rows]
    W = max(sum(t.width + 8 for t in r) for r in tiles) + 8; H = sum(max(t.height for t in r) + 24 for r in tiles) + 8
    sh = Image.new('RGB', (W, H), (22, 21, 20)); dr = ImageDraw.Draw(sh); y = 8
    for (d, prof, _), r in zip(rows, tiles):
        dr.text((8, y), '%s, %s: the hall as he arrives, the same hall in the week most of the six stand there, the crew screen with the man he hired, the map, a road fight (THE BLOCK WATCH)' % (d.upper(), 'upright' if prof == 'phone_portrait' else 'on its side'), fill=(220, 214, 200))
        x = 8; y += 16
        for t in r: sh.paste(t, (x, y)); x += t.width + 8
        y += max(t.height for t in r) + 8
    sh.save(os.path.join(OD, 'CHARACTER_THE_HIRES_DRESSED_PHONE.jpg'), quality=84, optimize=True); print('phone', sh.size)




CARD_ID = 'character-the-hires-dressed-11-11'


def register(sha):
    """one line appended to the registry's items, as text (MADE FROM the nine enemies' card he passed, rule 408(c) F5)"""
    rp = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'); R = json.load(open(rp))
    box = card()
    it = dict(
        id=CARD_ID, kind='outfit', lane='character', made='11/11', sha=sha, draft=True,
        title='SIX MEN AT THE HALL IN LAYERS AND LEATHER: THE THINNEST HIRES DRESSED',
        said='the clothes look good: leather and layering, quality before count / then the hires',
        why=('Six of the men you can hire wore two layers each and two wore cloth that reads blue (a storm grey tee, coal pant-boots, denim shorts); now each wears four that read '
             'apart (a leather wrap coat, a leather vest open over a tank, a red shirt under a shell bandolier, a quilted vest under a '
             'scrap pauldron), in warm colours, nothing blue. You see them whole on this card and at the hall, once hired on the crew '
             'screen and in every fight, and in the road gangs you fight, where all six stand.'),
        options=['A, yes, dress the rest of the hall this way', 'B, close, change something (say which man and what)', 'C, no, not like this'],
        show=dict(how='image', src='../records/target/character/the_hires_dressed/CHARACTER_THE_HIRES_DRESSED.png',
                  first='../records/target/character/the_hires_dressed/CHARACTER_THE_HIRES_DRESSED_FIRST.png', firstAt=box),
        twin=dict(src='records/target/character/the_hires_dressed/before/phone_landscape_crew.jpg', diffs=[
            'THE LAYERS AND THE LEATHER: before, every one of the six wore two layers on the body; now every one wears four, the new piece over the old one (a coat or a vest over the shirt, gloves, bracers, a sash, a bandolier, a pauldron), leather on four (a wrap coat, a vest, an apron, gloves and boots).',
            'NO BLUE: reds_0\'s cutoff denim shorts (4.7 in 100 of his pixels read blue) are soot cargos now, and anarchists_2\'s storm grey tee and coal pant-boots a bone tank and column pant-boots; 0 in 100 on all six.',
            'THE SAME MEN: the same faces, haircuts, builds and heights; only the clothes moved, and nobody else in the valley changed.']),
        before_after=dict(before='each man\'s street still before (BEFORE), and the five screens on the phone on main without this change',
                          after='the same man now (AFTER), and the same five screens on this build, upright and on its side', scale='2:1 sheet; the phone at 390 x 844 and 844 x 390'),
        stage='made_from', golden='character-the-nine-enemies-their-own-clothes-11-7',
        recipe=('the nine enemies\' frozen recipe (layers that read apart, leather where it fits, no blue, no trench added), the source in '
                'RUN TWO\'s roll, every sheet set re-made by its owner\'s own one-man command (tools/bohemia_character_the_company_dressed_remake.sh)'))
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
    if len(sys.argv) > 2 and sys.argv[2] == 'register': register(sys.argv[3])
    else:
        card()
        if os.path.isdir(os.path.join(OD, 'after')): phone()
