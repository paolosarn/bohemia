#!/usr/bin/env python3
"""COOK [the accessories through the rig] (10/19): a VOTE sheet per family, laid for his phone (1,170 px wide). For every
prop of the family: what the game draws for it today (the fight's own cover picture, or his pack tile where the fight
draws none) beside the model through the master rig, each at its own pixels, the rig's on his caliche over its own
shadow; then the eight facings at the men's size. Nothing is drawn: the rig's renders and his pictures, laid out.
  python3 tools/bohemia_cook_accessories_through_the_rig_sheet_10_19_26.py
  -> records/target/COOK_ACCESSORIES_<FAMILY>.webp (six sheets)

REUSE CHECK (REUSE-FIRST, 7/22): no art made here; the rig's renders, the fight's cover pictures (slices/fight_ground/)
and his tiles from the approved corpus (reference/art_bank/CORPUS.json), the props sheet's way of reading them.
TASTE CHECK: old beside new, one question a sheet, eighth-grade words (his 8/24).
REFERENCE CHECK (the 9/4 standing duty): the compare law; the twins named per row; the caption fields (rule 114c). No
reference game.
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(R, 'reference/art_bank'); FG = os.path.join(R, 'slices/fight_ground')
W, PAD, BG = 1170, 18, (14, 13, 12)
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f_title, f_head, f_body, f_small = ImageFont.truetype(FB, 42), ImageFont.truetype(FB, 30), ImageFont.truetype(FR, 26), ImageFont.truetype(FR, 21)
GROUND = (168, 157, 136)
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
# family -> (title, [(rig name, label, old: 'cover:<name>' or 'pack:<key>', the one wrong thing)], question)
FAMILIES = {
    'CARS': ('THE CARS, MODELLED IN 3D', [
        ('wreck', 'THE DEAD SEDAN (THE FIGHT\'S CAR IN THE LANE)', 'cover:car_lane', 'one front wheel gone, the nose down on its rim'),
        ('rolled', 'THE SEDAN ON ITS ROOF (THE FREEWAY)', 'cover:car_kerb', 'the same car, rolled over'),
        ('patrol', 'THE DEAD PATROL CAR (THE FIGHT\'S CAR ON THE DRIVE)', 'cover:car_drive', 'a tow chain on the push bar, its free end in the road, nobody on the other end')],
        'ONE QUESTION: are these the cars? (YES, or NO and which)'),
    'LAMPS_AND_SIGNS': ('THE LAMPS AND THE SIGNS, MODELLED IN 3D', [
        ('lamp', 'THE STREET LAMP, 3.2 m', 'pack:18. Light sources and fire barrels#3', 'a flyer taped round the pole, the shade knocked off true'),
        ('streetlight', 'THE ARTERIAL\'S STREET LIGHT, 9.5 m', 'pack:18. Light sources and fire barrels#3', 'the handhole open, the copper pulled out of it in a coil'),
        ('stop_sign', 'THE STOP SIGN AND THE STREET NAME', 'pack:14. Warning Signs#24', 'the post bent over by a car, five bullet holes, still facing the road'),
        ('gantry', 'THE FREEWAY SIGN COME DOWN', 'pack:17. Warning Signs and road props#10', 'the truss down across the lanes')],
        'ONE QUESTION: are these the lamps and signs? (YES, or NO and which)'),
    'BARRIERS': ('THE BARRIERS, MODELLED IN 3D', [
        ('barrier', 'THE JERSEY BARRIER, 3 m', 'cover:jersey', 'a chunk knocked out of its end'),
        ('sandbags', 'THE SANDBAG WALL', 'pack:5. Barricades and defenses#2', 'the top bag burst, its sand in a pile'),
        ('drums', 'THE LANE CLOSURE NOBODY TOOK DOWN', 'pack:17. Warning Signs and road props#23', 'four drums and five cones still standing guard')],
        'ONE QUESTION: are these the barriers? (YES, or NO and which)'),
    'FENCES_AND_WALLS': ('THE FENCES AND THE BLOCK WALLS, MODELLED IN 3D', [
        ('fence', 'THE CHAIN-LINK RUN AND ITS GATE', 'cover:fence', 'the gate open, the chain cut, the padlock still shut'),
        ('wall', 'THE BLOCK WALL, 6 m', 'cover:wall', 'a tally scratched in it, groups of five, a long run'),
        ('wall_corner', 'THE BLOCK WALL, CORNER', 'cover:wall_corner', 'a child\'s handprint in house paint at waist height'),
        ('wall_broken', 'THE BLOCK WALL, KNOCKED THROUGH', 'cover:wall_broken', 'a doormat laid in the gap')],
        'ONE QUESTION: are these the walls? (YES, or NO and which)'),
    'CONTAINERS_AND_SHEDS': ('THE CONTAINERS, THE SHED AND THE TRAILER, MODELLED IN 3D', [
        ('container', 'THE SHIPPING CONTAINER', 'pack:Cargo, crates and containers#36', 'a window torch-cut in its side, a blanket for a curtain'),
        ('dumpster', 'THE DUMPSTER', 'cover:dumpster', 'its lid open'),
        ('propane', 'THE PROPANE TANK', 'pack:Cargo, crates and containers#22', 'the valve open, a cut hose off it'),
        ('shed', 'THE TIN SHED (IT BLOCKS A MAN)', 'cover:shed', 'the door open on the dark, the padlock still locked on the open hasp'),
        ('trailer', 'THE 40-FOOT TRAILER', 'cover:trailer', 'the rear door up a metre and a mattress inside')],
        'ONE QUESTION: are these the containers? (YES, or NO and which)'),
    'CARTS_AND_DRUMS': ('THE CARTS, THE TYRES AND THE JUNK, MODELLED IN 3D', [
        ('cart', 'THE SHOPPING CART', 'pack:15. Street props#21', 'a bag left in it'),
        ('corral', 'THE CART CORRAL', 'pack:15. Street props#21', 'one cart left outside on its side'),
        ('tyres', 'THE TYRE STACKS', 'pack:3. Barricades and blockades#5', 'two stacks, one leaning'),
        ('bales', 'THE CRUSHED-CAR BALES', 'pack:7. Trash and debris#3', 'stacked in steps you can climb')],
        'ONE QUESTION: are these right? (YES, or NO and which)'),
}


def wrap(d, text, font, width):
    out, line = [], ''
    for w in text.split(' '):
        t = (line + ' ' + w).strip()
        if d.textlength(t, font=font) > width: out.append(line); line = w
        else: line = t
    return out + [line]


def his(key):
    for r in json.load(open(os.path.join(BANK, 'CORPUS.json')))['tiles'].values():
        if r['key'] == key: return Image.open(os.path.join(BANK, r['family'], r['file'])).convert('RGBA')
    import base64, io, glob                                  # a never-judged tile: decoded whole from his bank text files
    sys.exit('%s is not in the corpus' % key)


def old(src):
    a = Image.open(os.path.join(FG, 'cover_%s.webp' % src[6:])).convert('RGBA') if src.startswith('cover:') else his(src)
    g = Image.new('RGBA', (a.width + 12, a.height + 12), GROUND + (255,)); g.alpha_composite(a, (6, 6)); return g.convert('RGB')


def rig(name, f):
    d = os.path.join(R, 'records/target/master_rig/cook_%s' % name)
    body = Image.open(os.path.join(d, 'rig_%s.png' % f)).convert('RGBA')
    shp = os.path.join(d, 'shadow_%s.png' % f)
    g = Image.new('RGBA', (body.width + 12, body.height + 12), GROUND + (255,))
    if os.path.exists(shp): g.alpha_composite(Image.open(shp).convert('RGBA'), (6, 6))
    g.alpha_composite(body, (6, 6)); return g.convert('RGB')


def row(ims, width, gap=10):
    k = min(1.0, (width - gap * (len(ims) - 1)) / sum(i.width for i in ims))
    if k < 1: ims = [i.resize((max(1, int(i.width * k)), max(1, int(i.height * k))), Image.LANCZOS) for i in ims]
    im = Image.new('RGB', (sum(i.width for i in ims) + gap * (len(ims) - 1), max(i.height for i in ims)), BG); x = 0
    for i in ims: im.paste(i, (x, im.height - i.height)); x += i.width + gap
    return im, k


def tag(im, text):
    d = ImageDraw.Draw(im); d.text((8, 4), text, font=f_small, fill=(240, 226, 196), stroke_width=3, stroke_fill=(14, 13, 12)); return im


def sheet(fam, title, rows, question):
    blocks = [('title', title), ('text', 'Each thing the fight and the map draw, now built in 3D at its real size and lit by the same lamp and camera '
                                          'as the robot, the truck and the people. LEFT is what the game draws today (or your own tile where it draws '
                                          'nothing), RIGHT is the 3D one at the men\'s size. Under it, the same thing turned all eight ways.')]
    for name, label, src, odd in rows:
        rj = os.path.join(R, 'records/target/master_rig/cook_%s/rig.json' % name)
        if not os.path.exists(rj): continue
        meta = json.load(open(rj)); dims = meta.get('real_dims_m') or meta.get('dims_m')
        blocks.append(('head', label))
        pr, k = row([tag(old(src), 'NOW'), tag(rig(name, 'S'), 'NEW')], W - 2 * PAD, PAD)
        card = meta.get('card_guide') or {}
        out = card.get('out', card.get('outs'))
        blocks.append(('small', 'The one wrong thing: %s.%s' % (odd, '' if k >= 0.999 else ' Both at %d%% to fit.' % round(k * 100))))
        blocks.append(('img', pr))
        eight, k2 = row([rig(name, f) for f in FACINGS], W - 2 * PAD, 6)
        blocks.append(('small', 'All eight ways, N to NW%s.' % ('' if k2 >= 0.999 else ', at %d%%' % round(k2 * 100))))
        blocks.append(('img', eight))
    blocks.append(('q', question))
    blocks.append(('cap', 'PIXEL SIZE 57 px a metre, the men\'s (the rig\'s), the fight\'s cover pictures at their own 42.9 and his tiles at their own '
                          '| PALETTE records/target/BOHEMIA_STYLE_PALETTE.json, snapped toward his prop family at 0.6 | LIGHT the rig\'s one sun, upper '
                          'left, the contact shadow its own layer'))
    d0 = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    FONT = {'title': f_title, 'head': f_head, 'text': f_body, 'small': f_small, 'q': f_head, 'cap': f_small}
    def hgt(k, v):
        if k == 'img': return v.height + PAD
        return len(wrap(d0, v, FONT[k], W - 2 * PAD)) * int(FONT[k].size * 1.3) + PAD
    H = PAD + sum(hgt(k, v) for k, v in blocks)
    sh = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sh); y = PAD
    for k, v in blocks:
        if k == 'img': sh.paste(v, (PAD, y)); y += v.height + PAD; continue
        col = {'title': (240, 226, 196), 'head': (226, 170, 96), 'text': (226, 222, 214), 'small': (190, 186, 178), 'q': (240, 200, 120), 'cap': (170, 190, 220)}[k]
        for l in wrap(d, v, FONT[k], W - 2 * PAD): d.text((PAD, y), l, font=FONT[k], fill=col); y += int(FONT[k].size * 1.3)
        y += PAD
    out = 'records/target/COOK_ACCESSORIES_%s.webp' % fam
    sh.save(os.path.join(R, out), quality=84, method=6); print(out, sh.size, os.path.getsize(os.path.join(R, out)))


if __name__ == '__main__':
    for fam, (title, rows, q) in FAMILIES.items():
        if len(sys.argv) > 1 and fam not in sys.argv[1:]: continue
        sheet(fam, title, rows, q)
