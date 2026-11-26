#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the terminal, the data fort and the mall again] (11/26/26; his 'Wip' on COOK FIVE's cards cook5-the-terminal-11-18
and cook5-the-three-that-waited-11-18, rule 466(e): a 'Wip' is a YES not finished and the art lanes carry it on; VAMILY rule 480(b):
improve what is already in the game first). The floors are re-made by their own tools (COOK FIVE's, carried by this lane):
  <venv>/bin/python tools/bohemia_cook5_the_terminal_finished_11_18_26.py render tm_floor;  python3 ... recut_floor
  <venv>/bin/python tools/bohemia_cook5_the_data_fort_finished_11_18_26.py render df_floor; python3 ... recut_floor
  <venv>/bin/python tools/bohemia_cook5_the_mall_finished_11_17_26.py render mall_floor;    python3 ... recut_floor
This tool builds the two VOTE cards from the real fight page's shots (tools/bohemia_a_big_inside_on_the_page_11_17_26.js), the fight as he
meets it before and now, and the floors' tiles before and now:
  python3 tools/bohemia_cook6_the_wips_again_11_26_26.py sheet <tm_before> <tm_now> <df_before> <df_now> <ml_before> <ml_now>
    (each before dir also holds old_<floor>.webp, the floor as it was)
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FG = os.path.join(R, 'slices', 'fight_ground')
TW, TH = 515, 364


def card(name, cid, parts):
    """parts: [(title, sub, inside, before_dir, now_dir, floor_folder, floor_file)]"""
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []; first_at = None
    def title(t, sub):
        im = Image.new('RGB', (WID, 64), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK); d.text((10, 38), sub, font=font(14), fill=DIM); rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0
        for lab, n in items: n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 10
        rows.append(r)
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 120 / 390), n.width, int(n.width * 620 / 390))))(Image.open(fn))
    cw = (WID - 10) // 2; ch = int(500 * cw / 390); first_row = None
    for (t, sub, inside, bd, nd, folder, ffile) in parts:
        title(t, sub)
        strip((('THE FIRST, AS HE MEETS IT', up(os.path.join(bd, inside + '_upright_open_a01.png'))), ('NOW', up(os.path.join(nd, inside + '_upright_open_a01.png')))), cw, ch)
        if first_row is None: first_row = len(rows) - 1
        fa = Image.open(os.path.join(bd, 'old_' + ffile)).convert('RGB'); fb = Image.open(os.path.join(FG, folder, ffile)).convert('RGB')
        hh = TH * 2; strip((('ITS FLOOR, THE FIRST (two rows of its tiles)', fa.crop((0, 0, fa.width, hh))), ('NOW', fb.crop((0, 0, fb.width, hh)))), cw, int(cw * hh / fa.width))
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/%s.webp' % name); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/%s.webp' % cid); fst.save(f2, 'WEBP', quality=78, method=6)
    print(name, out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


def sheet(tb, tn, db, dn, mb, mn):
    card('COOK6_THE_TERMINAL_AGAIN_11_26', 'cook6-the-terminal-again-11-26', [
        ('THE AIRPORT TERMINAL AGAIN', "his 'Wip'; on his phone, 390 x 844, the ceiling at his 10%: the floor was the palest thing on the board", 'terminal', tb, tn, 'terminal', 'terminal_floor_0.webp')])
    card('COOK6_THE_FORT_AND_THE_MALL_AGAIN_11_26', 'cook6-the-fort-and-the-mall-again-11-26', [
        ('THE MALL AGAIN', "his 'Wip'; a diamond inlaid on every tile read as wallpaper: now on three tiles of twenty-five, the floor darker", 'mall', mb, mn, 'mall', 'mall_floor_0.webp'),
        ('THE DATA FORT AGAIN', "the raised floor went near white under the lights and drowned the rows: a step darker under its dust", 'datafort', db, dn, 'datafort', 'datafort_floor_0.webp')])


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'sheet': sheet(*a[1:7])
    else: print(__doc__)
