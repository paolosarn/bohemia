#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [more enemy types, their own art] 11/7: THE VOTE CARD'S PICTURES (rule 427(b); rule 89: a look item is a
before and after of the same thing at one pixel to one pixel; rule 408: the bar's man beside it).

    python3 tools/bohemia_character_the_nine_enemies_card.py
-> records/target/character/the_nine_enemies/CHARACTER_THE_NINE_ENEMIES.png      every type: BEFORE (the borrowed person he
                                                                                 stood in, his fight sheet's stand, south) and
                                                                                 AFTER (his own men: the first in five turns,
                                                                                 the rest facing south), 2:1, the bar's thug first
   records/target/character/the_nine_enemies/CHARACTER_THE_NINE_ENEMIES_FIRST.png the top of it, for the tab's first look
   records/target/character/the_nine_enemies/CHARACTER_THE_NINE_ENEMIES_PHONE.jpg the four factions' fights on his phone,
                                                                                 before (borrowed) above, after (their own) below
"""
import json, os, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_the_nine_enemies as NE  # noqa: E402

OD = os.path.join(ROOT, NE.SHEET_DIR)
GROUND, INK, DIM, BG = (118, 106, 88, 255), (24, 22, 20, 255), (60, 54, 46, 255), (22, 21, 20, 255)


def fight_cell(look, row=0, col=0):
    I = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    L = I['looks'][look]
    im = Image.open(os.path.join(ROOT, 'slices/fight_rig', L['file'])).convert('RGBA')
    return im.crop((col * L['w'], row * L['h'], (col + 1) * L['w'], (row + 1) * L['h']))


def trim(im):
    b = im.getbbox(); return im.crop(b) if b else im


def borrowed(t):
    """the first borrowed person the type stood in (the row's looks before this round)"""
    E = json.load(open(NE.ENEMIES)); row = next(r for r in E['rows'] if r['id'] == NE.POOL[t])
    was = row.get('looks_borrowed') or row['looks']
    return next((l for l in was if not l.startswith('enemy_' + NE.POOL[t])), was[0])


def card():
    roll = json.load(open(NE.ROLL)); S = 2
    bar = trim(Image.open(os.path.join(ROOT, 'records/target/cook3/rig/thug/rig_S.png')).convert('RGBA'))
    rows = []
    for t in NE.ORDER:
        men = [p for p in roll if p['gang'] == t]
        d0 = NE.frames_of(men[0]['id'])
        turns = [trim(Image.open(os.path.join(d0, 'rig_%s.png' % f)).convert('RGBA')) for f in ('S', 'SE', 'E', 'N', 'NW')]
        rest = [trim(Image.open(os.path.join(NE.frames_of(p['id']), 'rig_S.png')).convert('RGBA')) for p in men[1:]]
        before = trim(fight_cell(borrowed(t)))
        rows.append((t, before, turns, rest))
    cw = max(im.width for r in rows for im in [r[1]] + r[2] + r[3] + [bar]) + 6
    ch = max(im.height for r in rows for im in [r[1]] + r[2] + r[3] + [bar]) + 18
    ncol = 2 + 5 + max(len(r[3]) for r in rows)
    LW = 150
    W = (LW + cw * ncol + 24) * S; H = (ch * (len(rows) + 1) + 10) * S
    sh = Image.new('RGBA', (W, H), GROUND); dr = ImageDraw.Draw(sh)

    def put(im, x, y):
        im2 = im.resize((im.width * S, im.height * S), Image.NEAREST)
        sh.alpha_composite(im2, (int((x + (cw - im.width) / 2) * S), int((y + ch - 14 - im.height) * S)))

    # the header row: the bar's man, then the column names
    put(bar, LW, 0)
    dr.text((6 * S, 8 * S), 'THE BAR: the thug', fill=INK)
    dr.text(((LW + cw) * S + 6, 8 * S), 'BEFORE:\nthe borrowed\nperson he\nstood in', fill=INK)
    dr.text(((LW + cw * 2 + 24) * S, 8 * S), 'AFTER: his own garments, the first man five turns, then the rest of his type', fill=INK)
    for j, (t, before, turns, rest) in enumerate(rows):
        y = ch * (j + 1)
        T = NE.TYPES[t]
        dr.text((6 * S, (y + 8) * S), t.upper(), fill=INK)
        words = T['what'].split(': ')[-1]
        lines, cur = [], ''
        for w_ in words.split():
            if len(cur) + len(w_) > 26: lines.append(cur); cur = w_
            else: cur = (cur + ' ' + w_).strip()
        lines.append(cur)
        for k, ln in enumerate(lines[:6]): dr.text((6 * S, (y + 22 + 11 * k) * S), ln, fill=DIM)
        put(before, LW + cw, y)
        dr.line([((LW + cw * 2 + 10) * S, (y + ch / 2) * S), ((LW + cw * 2 + 20) * S, (y + ch / 2) * S)], fill=INK, width=S)
        for i, im in enumerate(turns): put(im, LW + cw * 2 + 24 + cw * i, y)
        for i, im in enumerate(rest): put(im, LW + cw * 7 + 24 + cw * i, y)
    os.makedirs(OD, exist_ok=True)
    out = os.path.join(OD, 'CHARACTER_THE_NINE_ENEMIES.png'); sh.convert('RGB').save(out, optimize=True)
    first = sh.crop((0, 0, W, int(ch * 4 * S))); first.convert('RGB').save(os.path.join(OD, 'CHARACTER_THE_NINE_ENEMIES_FIRST.png'), optimize=True)
    print(os.path.relpath(out, ROOT), sh.size, 'first box', [0, 0, W, int(ch * 4 * S)])
    return [0, 0, W, int(ch * 4 * S)]


def phone():
    B, A = os.path.join(OD, 'phone_before'), os.path.join(OD, 'phone_after')
    fs = ['house', 'watch', 'keepers', 'water']
    # the shots are FACTIONS' tool's PNGs saved as JPEG (a phone shot is 1 MB as PNG)
    ims = [[Image.open(os.path.join(d, f + '_deal.jpg')).convert('RGB') for f in fs] for d in (B, A)]
    w, h = ims[0][0].size; sc = 0.5
    W = int(w * sc) * 4 + 5 * 8; H = int(h * sc) * 2 + 3 * 8 + 40
    sh = Image.new('RGB', (W, H), (22, 21, 20)); dr = ImageDraw.Draw(sh)
    for r in range(2):
        for c in range(4):
            sh.paste(ims[r][c].resize((int(w * sc), int(h * sc)), Image.LANCZOS), (8 + c * (int(w * sc) + 8), 20 + r * (int(h * sc) + 20)))
        dr.text((8, 4 + r * (int(h * sc) + 20)), ('BEFORE: borrowed people' if r == 0 else 'AFTER: their own garments') + ' -- the House, the Block Watch, the Keepers, the Water People (his phone, 390 x 844)', fill=(220, 214, 200))
    out = os.path.join(OD, 'CHARACTER_THE_NINE_ENEMIES_PHONE.jpg'); sh.save(out, quality=84, optimize=True); print(os.path.relpath(out, ROOT), sh.size)


CARD_ID = 'character-the-nine-enemies-their-own-clothes-11-7'


def register(sha):
    """the one VOTE card (rule 408(c): GOLDEN, a man's body; one golden of a kind waiting at a time, so the nine are one card)"""
    rp = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'); R = json.load(open(rp))
    box = card()
    it = dict(
        id=CARD_ID, kind='outfit', lane='character', made='11/7', sha=sha, draft=True,
        title='NINE ENEMY TYPES IN THEIR OWN CLOTHES: THE HOUSE, THE BLOCK WATCH, THE KEEPERS, THE WATER PEOPLE',
        said='more enemy types with their own art / the clothes look good: leather and layering, quality before count',
        why=('The nine enemy types that stood in other people\'s clothes now wear their own, 30 men on the 3D man: the House in a '
             'casino-carpet tabard with a hubcap helmet or a mail hood, the Block Watch in faded hi-vis with floor mats on their shins, '
             'the Keepers in a coyote pelt or a cloak of bleached strips, the Water People with an amber water jug or a bandolier of syringes. '
             'You see it in every fight against those four gangs, and in the VOTE tab beside the borrowed person each one stood in.'),
        options=['A, yes, this is what they look like: make the rest of the enemies this way',
                 'B, close, change something (say which one and what)', 'C, no, not like this'],
        show=dict(how='image', src='../records/target/character/the_nine_enemies/CHARACTER_THE_NINE_ENEMIES.png',
                  first='../records/target/character/the_nine_enemies/CHARACTER_THE_NINE_ENEMIES_FIRST.png', firstAt=box),
        twin=dict(src='fight_rig/faction_remnants.webp', diffs=[
            'WHO THEY ARE: before, a House shield man was a Remnant in the Remnants\' clothes and a Water needle was one of the Kids; now each type wears one shape nobody else in the valley wears (the hubcap kettle, the mail hood, the bolt case, the hi-vis, the coyote\'s head, the strips, the water jug, the syringes).',
            'THE LAYERS: every man wears four to eight layers that read apart (a shirt, leather or cloth over it, the new piece over that, his kit), and 27 of the 30 wear leather; the borrowed people were one or two.',
            'THE GANG READS AS A GANG: the House all wear the same black-and-brass casino tabard, the Watch the same faded vest, so a band reads as one group at the fight\'s size, the way the bar\'s thug reads as one man.']),
        before_after=dict(before='the borrowed person each type stood in (BEFORE, his fight sheet\'s stand)',
                          after='his own men: the first in five turns, the rest facing you, 2:1; and the four fights on the phone',
                          scale='2:1 sheet; the phone at 390 x 844'),
        stage='golden', art_kind='body', bar='body_thug_S', real='RNWY-06',
        surface='records/target/character/the_nine_enemies/CHARACTER_THE_NINE_ENEMIES_PHONE.jpg',
        direction=dict(verdict='PASS', by="CHARACTER holding its own piece to the bar (the coordinator's brief, rule 427(b) and 408(b)); DIRECTION's eye may overturn it",
                       line=('beside the bar: SAME, because every man is the thug\'s way (his clay model through the master rig, one camera, one sun, '
                             'the fight sheet\'s 64 colours) and each type carries one silhouette nobody else has that reads at 1x on the phone; '
                             'weaker: the badge and the syringes are under two pixels at 1x, and a kettle\'s brim shades the face from the fight\'s camera')),
        recipe=('tools/bohemia_character_the_nine_enemies.py (roll, look, batch, pack) on the barber and the body build (pieces modelled on '
                'his body and skull), RUN TWO\'s render over the master rig, COMBAT\'s fight poses; the roll '
                'records/character/BOHEMIA_THE_NINE_ENEMIES_ROLL.json; four look loops on one man of each type, logged in the tool'))
    # one line appended to items[], as text (every lane appends here; nobody else's lines move)
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
    what = sys.argv[1] if len(sys.argv) > 1 else 'card'
    if what == 'card': card()
    elif what == 'phone': phone()
    elif what == 'register': register(sys.argv[2])
