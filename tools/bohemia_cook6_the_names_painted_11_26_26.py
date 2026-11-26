#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the names painted] (11/26/26; VAMILY rule 480(b): this lane's own pieces in the game finished first; COMBAT FOUR's
BUILD 11/22zd THE NAMES COOK ASKED FOR). The pictures are made by the school's and the courthouse's own tools (their 'render' and 'cut'):
the school's floor.court and floor.hall and sc_bleachers_n, the courthouse's floor.carpet and ct_brick_ew / ct_brick_ns. This tool only
builds the VOTE card from the real fight page's shots (tools/bohemia_a_big_inside_on_the_page_11_17_26.js), before and now:

  python3 tools/bohemia_cook6_the_names_painted_11_26_26.py sheet <school_before> <school_now> <court_before> <court_now>
    (each a page tool out dir; the courthouse's museum floor in its 'mf' subfolder)
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FG = os.path.join(R, 'slices', 'fight_ground')
TW, TH = 515, 364


def sheet(sb, sn, cb, cn):
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub):
        im = Image.new('RGB', (WID, 64), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK); d.text((10, 38), sub, font=font(14), fill=DIM); rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0; at = []
        for lab, n in items: n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); at.append(x); x += cw + 10
        rows.append(r); return at
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 140 / 390), n.width, int(n.width * 640 / 390))))(Image.open(fn))
    cw = (WID - 10) // 2; ch = int(500 * cw / 390)
    title('THE BULLET-MARKED BRICK WALL, ON THE MUSEUM FLOOR', "the courthouse's museum floor on his phone, close in on its north run: before (the exhibit wall), now")
    strip((('BEFORE', up(os.path.join(cb, 'mf', 'courthouse_upright_brick_close.png'))), ('NOW', up(os.path.join(cn, 'mf', 'courthouse_upright_brick_close.png')))), cw, ch)
    first_row = len(rows) - 1
    title("THE COURTROOM'S AISLE", 'the carpet from the bar to the doors: before (the terrazzo), now')
    strip((('BEFORE', up(os.path.join(cb, 'courthouse_upright_aisle_close.png'))), ('NOW', up(os.path.join(cn, 'courthouse_upright_aisle_close.png')))), cw, ch)
    title("THE GYM'S SOUTH BLEACHERS", 'before (the north bleachers, facing away from the court), now (stepping up to the south, their back to the camera)')
    strip((('BEFORE', up(os.path.join(sb, 'school_upright_south_bleachers_close.png'))), ('NOW', up(os.path.join(sn, 'school_upright_south_bleachers_close.png')))), cw, ch)
    title('THE COURT, AND THE HALLWAY', "the gym's maple with the lines of its games; the classrooms' hallway in its vinyl squares")
    strip((('THE COURT, NOW', up(os.path.join(sn, 'school_upright_court_close.png'))), ('THE HALLWAY, NOW', up(os.path.join(sn, 'cl', 'school_upright_hallway_close.png')))), cw, ch)
    title('THE NEW PICTURES AT THEIR OWN PIXELS', 'the brick wall; the south bleachers; a tile of the court, the hallway and the aisle')
    def piece(f):
        im = Image.open(f).convert('RGBA'); o = Image.new('RGBA', im.size, (150, 146, 132, 255)); o.alpha_composite(im); return o.convert('RGB')
    b = piece(os.path.join(FG, 'courthouse', 'ct_brick_ew.webp')); rows.append(b.resize((WID, int(b.height * WID / b.width)), Image.LANCZOS))
    sf = Image.open(os.path.join(FG, 'school', 'school_floor_0.webp')).convert('RGB'); cf = Image.open(os.path.join(FG, 'courthouse', 'courthouse_floor_0.webp')).convert('RGB')
    q = (WID - 30) // 4; bl = piece(os.path.join(FG, 'school', 'sc_bleachers_n.webp'))
    strip((('SOUTH BLEACHERS', bl), ('THE COURT', sf.crop((TW, TH * 3, TW * 2, TH * 4))), ('THE HALLWAY', sf.crop((TW, TH * 4, TW * 2, TH * 5))), ('THE AISLE', cf.crop((TW, TH * 4, TW * 2, TH * 5)))), q, int(q * TH / TW))
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_NAMES_PAINTED_11_26.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-names-painted-11-26.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'sheet': sheet(*a[1:5])
    else: print(__doc__)
