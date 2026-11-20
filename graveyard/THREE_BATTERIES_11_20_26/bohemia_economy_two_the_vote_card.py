#!/usr/bin/env python3
"""BOHEMIA -- ECONOMY TWO [the battery is real] (rule 459, ask line 645; 11/18/26). THE VOTE CARD.

'Its VOTE card SHOWS the ladder and three everyday prices beside the real objects.' One picture, nothing drawn by hand:
  1. THE LADDER: the four pictures the rig made (slices/battery_ladder/), each over what it is worth in AA's and in bags of
     rice (the sack is the pack's own prop, reference/art_bank/prop/pack_16_loot_and_survival_props_020.png, no pixel changed)
  2. THREE EVERYDAY PRICES BESIDE THE REAL OBJECTS: the stall's own rows, cut from the phone walk of the demo
     (walk_demo_portrait_3_stall.png, the gate's own shot: node gates/the_battery_is_real_gate.js demo phone_portrait --shots=<folder>): a stack of tape, a night of food
     and water, a dose of meds, six rounds, each beside its price in batteries
  3. WHAT HE MET, NOW: the job board and the bar at the top of CLOUT (walk_demo_portrait_8_top_board.png): the job that
     read 1,121 batteries reads 4 car batteries, 6 tool packs and 1 AA
The numbers are read from records/target/bb/battery_table.json; the words on it are the table's own names (draft).
REFERENCE CHECK: the twins are the game's own screens it is cut from (the same pixels he plays) and the bar's old pile.
REUSE CHECK: the pictures are slices/battery_ladder's; the fonts the game's own (slices/fonts); no new art.

    python3 tools/bohemia_economy_two_the_vote_card.py <the gate's --shots folder>
writes records/target/economy_two/VOTE_THE_BATTERY_IS_REAL.webp and its first picture for the card.
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open(os.path.join(R, 'records/target/bb/battery_table.json')))
OUTD = os.path.join(R, 'records/target/economy_two')
WALK = sys.argv[1] if len(sys.argv) > 1 else os.path.join(__import__('tempfile').gettempdir(), 'bohemia_the_battery_walk')   # the gate's --shots folder
W = 1170
INK, BONE, GOLD, DIM, BG = (233, 220, 196), (240, 226, 196), (240, 196, 106), (150, 135, 110), (22, 17, 12)
font = lambda n, s: ImageFont.truetype(os.path.join(R, 'slices/fonts', n), s)
CAS, ROM = lambda s: font('BohemiaCasing-Regular.ttf', s), lambda s: font('BohemiaROM-Regular.ttf', s)


def ladder_strip():
    H = 560; im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    d.text((40, 26), 'ONE AA BUYS A BAG OF RICE', font=CAS(44), fill=GOLD)
    d.text((40, 84), 'A BIG SUM IS PAID IN BIG BATTERIES', font=CAS(30), fill=INK)
    L = sorted(T['ladder']['value'], key=lambda k: k['worth'])
    sack = Image.open(os.path.join(R, 'reference/art_bank/prop/pack_16_loot_and_survival_props_020.png')).convert('RGBA')
    colw = (W - 80) // 4
    for i, k in enumerate(L):
        x0 = 40 + i * colw
        pic = Image.open(os.path.join(R, 'slices', k['icon'])).convert('RGBA')
        s = min(200 / pic.width, 200 / pic.height); pic = pic.resize((round(pic.width * s), round(pic.height * s)), Image.LANCZOS)
        im.paste(pic, (x0 + (colw - pic.width) // 2, 150 + (200 - pic.height)), pic)
        nm = k['name']; tw = d.textlength(nm, font=CAS(26)); d.text((x0 + (colw - tw) / 2, 366), nm, font=CAS(26), fill=BONE)
        w = ('1 AA' if k['worth'] == 1 else '%d AA' % k['worth']); tw = d.textlength(w, font=CAS(40)); d.text((x0 + (colw - tw) / 2, 402), w, font=CAS(40), fill=GOLD)
        sk = sack.resize((44, 53), Image.LANCZOS); lab = '%d' % k['worth']; tw = d.textlength(lab, font=ROM(30))
        bx = x0 + (colw - (44 + 8 + tw)) / 2; im.paste(sk, (round(bx), 458), sk); d.text((bx + 52, 470), lab, font=ROM(30), fill=INK)
        wh = 'about %s Wh' % (('%g' % k['wh'])); tw = d.textlength(wh, font=ROM(20)); d.text((x0 + (colw - tw) / 2, 522), wh, font=ROM(20), fill=DIM)
    return im


def cut(name, box):
    p = os.path.join(WALK, name)
    return Image.open(p).convert('RGB').crop(box)


def head(text, sub=None):
    im = Image.new('RGB', (W, 96 if sub else 70), BG); d = ImageDraw.Draw(im)
    d.text((40, 18), text, font=CAS(30), fill=GOLD)
    if sub: d.text((40, 58), sub, font=ROM(22), fill=DIM)
    return im


def main():
    parts = [ladder_strip(), head('EVERYDAY PRICES, AT THE STALL', 'the game\'s own screen, a phone upright')]
    st = Image.open(os.path.join(WALK, 'walk_demo_portrait_3_stall.png')).convert('RGB')
    # the stall's rows: found by their paper (bone) bands, never by a typed y
    px = st.load(); rows = []; y = 0; Hs = st.height
    is_paper = lambda yy: sum(1 for xx in range(60, 1100, 40) if px[xx, yy][0] > 190 and px[xx, yy][1] > 180 and px[xx, yy][2] > 150) > 12
    while y < Hs:
        if is_paper(y):
            y0 = y
            while y < Hs and is_paper(y): y += 1
            if y - y0 > 90: rows.append((y0, y))
        y += 1
    rows = rows[:4]
    if rows: parts.append(st.crop((0, rows[0][0] - 8, W, rows[-1][1] + 8)))
    wk = json.load(open(os.path.join(WALK, 'walk_demo_portrait.json')))
    parts.append(head('WHAT HE MET: A JOB AT THE TOP OF CLOUT', 'the first job read {:,} batteries; the purse above it read {:,}'.format(wk['jobs'][0]['pay'], wk['purse'])))
    tb = Image.open(os.path.join(WALK, 'walk_demo_portrait_8_top_board.png')).convert('RGB')
    parts.append(tb.crop((0, 0, W, 190)))
    px = tb.load(); rows = []; y = 400; Hs = tb.height
    is_paper = lambda yy: sum(1 for xx in range(60, 1100, 40) if px[xx, yy][0] > 190 and px[xx, yy][1] > 180 and px[xx, yy][2] > 150) > 12
    while y < Hs:
        if is_paper(y):
            y0 = y
            while y < Hs and is_paper(y): y += 1
            if y - y0 > 120: rows.append((y0, y))
        y += 1
    if rows:   # the first job's row, the one the line above names: from its paper's top to the dark gap under it
        y0 = rows[0][0]; y1 = y0 + 150
        while y1 < tb.height - 1 and not all(sum(px[xx, y1]) < 200 for xx in range(200, 1000, 100)): y1 += 1
        parts.append(tb.crop((0, y0 - 8, W, min(tb.height, y1 + 4))))
    H = sum(p.height for p in parts) + 30
    out = Image.new('RGB', (W, H), BG); y = 0
    for p in parts: out.paste(p, (0, y)); y += p.height
    os.makedirs(OUTD, exist_ok=True)
    dst = os.path.join(OUTD, 'VOTE_THE_BATTERY_IS_REAL.webp'); out.save(dst, 'WEBP', quality=90, method=6)
    first = out.crop((0, 0, W, 560)); fd = os.path.join(R, 'records/target/vote_first'); os.makedirs(fd, exist_ok=True)
    first.save(os.path.join(fd, 'economy-two-the-battery-is-real-11-18.webp'), 'WEBP', quality=88, method=6)
    print('wrote', os.path.relpath(dst, R), out.size, os.path.getsize(dst), 'bytes; first [0, 0, %d, 560]' % W)


if __name__ == '__main__':
    main()
