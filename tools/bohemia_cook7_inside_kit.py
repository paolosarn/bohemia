#!/usr/bin/env python3
"""BOHEMIA -- COOK SEVEN [the inside kit] (11/27/26; VAMILY rule 495(b): ONE THING, ONE PLACE).

The cut, the sheet, the ceiling's hand-off and the tile-share measure of a big inside's finished art, ONCE. Until 11/27 every kit tool (the
truck stop's, the police station's, the bank's, the library's, and COOK FIVE's and COOK SIX's before them) carried its own copy of all four;
a kit tool now says only what is its own (its plan, its pieces, its boxes, its names, its words) and calls these.

  cut(K)            the renders -> slices/fight_ground/<kit>/: the floor sheet, every piece by its box and foot (TG.cut_piece), sizes.json,
                    <kit>_art.json in the garage's format, the ceiling's picture and the one agreed edit in COMBAT FOUR's data file (the
                    ceiling entry's "have" and "tile"); prints each piece's share of a house tile (rule 480(b), his 'cover you could not see')
  sheet(K, before, page)   records/target/COOK7_<NAME>_<date>.webp (K['date'], '11_27' unless a kit names its own) and its first picture for the VOTE card
  shares(kit, prefix)      {piece: percent of a tile's pixels it paints (alpha over 40)}, COMBAT FOUR's measure (tools/bohemia_measure_the_stand_ins.py)

K is a dict a kit tool builds (see make()): kit, prefix, version, floor_render, floor_lists, scenes, box, kind, hm, name, shadow, art_for,
how_it_lays, ceiling_key; and for the sheet its words: sheet_name, card_id, heading, sub, off_label, meets_label, close_title, close_sub,
closes, other, pieces_title, pieces_sub, rows, floor_title, floor_sub.
"""
import os, json, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def make(TG, **k):
    k['TG'] = TG; k.setdefault('shadow', {}); k.setdefault('ceiling_key', k['kit']); k.setdefault('date', '11_27'); k.setdefault('version', 'cook7-%s-art-%s' % (k['kit'], k['date'].replace('_', '-')))
    return k


def shares(kit, prefix):
    out = {}; fg = os.path.join(R, 'slices', 'fight_ground', kit)
    for n in sorted(os.listdir(fg)):
        if n.startswith(prefix) and n.endswith('.webp'):
            h = Image.open(os.path.join(fg, n)).convert('RGBA').getchannel('A').histogram(); out[n[len(prefix):-5]] = round(100.0 * sum(h[41:]) / (515 * 364), 1)
    return out


def cut(K):
    TG = K['TG']; kit, pre = K['kit'], K['prefix']; SHIP = os.path.join(TG.FG, kit); REND = TG.REND
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, K['floor_render'] + '.png')).convert('RGB'); fn = os.path.join(SHIP, '%s_floor_0.webp' % kit)
    im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    sz = {}
    for scene, AT in K['scenes']:
        im = Image.open(os.path.join(REND, scene + '.png')).convert('RGBA')
        for key, (x, y) in AT.items():
            b = K['box'][key]; sz[key] = TG.cut_piece(im, (x, y), (x + b[0], x + b[1], y + b[2], y + b[3]), pre + key, kit, K['shadow'].get(key, 1.0))
    for key, v in sz.items():
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, '%s%s.webp' % (pre, key)); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1]) + 1), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    for k, v in sz.items(): v.update(piece=k, src='%s/%s%s.webp' % (kit, pre, k), facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['%s/%s_floor_0.webp#%d,%d' % (kit, kit, c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=K['kind'][k], h=K['hm'][k], name=K['name'][k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    art = {'version': K['version'], 'lane': "cook 7 (COOK FIVE's list, after COOK SIX)", 'stage': 'finished', 'for': K['art_for'],
           'floor': {name: cells(rows) for name, rows in K['floor_lists']}, 'kit': {pre + k: ent(k) for k in sz}, 'how_it_lays': K['how_it_lays'], 'bytes': bytes_}
    path = os.path.join(SHIP, '%s_art.json' % kit)
    TG.keep_ceiling(art, path)
    ck = K['ceiling_key']; cp = os.path.join(REND, 'ceil_%s.png' % ck)
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, '%s_ceiling.webp' % kit); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        mark_ceiling(TG, kit)
        art['ceiling'] = dict(sheet='%s/%s_ceiling.webp' % (kit, kit), bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS],
                              what=TG.CEILINGS[ck][2], contract="%s.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); five bays by five that repeat" % kit)
    json.dump(art, open(path, 'w'), indent=1)
    print('%s: bytes' % kit, bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})
    tot = sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')); print('the folder\'s pictures', tot, 'bytes')
    print('share of a tile (%):', shares(kit, pre))


def mark_ceiling(TG, kit):
    """the one agreed edit in COMBAT FOUR's data file: its ceiling entry's "have" true and "tile" the tiles a picture covers, nothing else"""
    p = os.path.join(TG.FG, kit, '%s.json' % kit); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
    assert '"src": "%s/%s_ceiling.webp"' % (kit, kit) in e
    now = json.loads(s)['ceiling']
    if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):
        e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
        open(p, 'w').write(s[:i] + e + s[j:])


def sheet(K, before_dir, page_dir):
    """before and now on his phone as the fight opens, close in and the other layout, the pieces at their own pixels, the floor, the ceiling"""
    TG = K['TG']; kit, pre = K['kit'], K['prefix']; SHIP = os.path.join(TG.FG, kit); TW, TH = TG.TW, TG.TH
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub):
        im = Image.new('RGB', (WID, 64), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK); d.text((10, 38), sub, font=font(14), fill=DIM); rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0
        for lab, n in items: n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 10
        rows.append(r)
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 150 / 390), n.width, int(n.width * 720 / 390))))(Image.open(fn))
    title(K['heading'], K['sub'])
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, '%s_upright_open_a0.png' % kit))), (K['off_label'], up(os.path.join(page_dir, '%s_upright_open_a0.png' % kit))),
           (K['meets_label'], up(os.path.join(page_dir, '%s_upright_open_a01.png' % kit)))), cw, ch)
    first_row = len(rows) - 1
    title(K['close_title'], K['close_sub'])
    other = os.path.join(page_dir, K['other'][1], '%s_upright_open_a0.png' % kit)
    strip(tuple((lab, up(os.path.join(page_dir, '%s_upright_%s_close.png' % (kit, spot)))) for lab, spot in K['closes']) +
          ((K['other'][0], up(other) if os.path.exists(other) else Image.new('RGB', (390, 570), BG)),), cw, ch)
    title(K['pieces_title'], K['pieces_sub'])
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, '%s%s.webp' % (pre, k))).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    for keys, hgt in K['rows']: row_of(keys, hgt)
    title(K['floor_title'], K['floor_sub'])
    fl = Image.open(os.path.join(SHIP, '%s_floor_0.webp' % kit)).convert('RGB'); ce = Image.open(os.path.join(SHIP, '%s_ceiling.webp' % kit)).convert('RGB')
    t1 = fl.crop((TW, 0, TW * 2, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK7_%s_%s.webp' % (K['sheet_name'], K['date'])); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/%s.webp' % K['card_id']); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)
