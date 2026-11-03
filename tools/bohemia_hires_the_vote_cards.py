#!/usr/bin/env python3
"""BOHEMIA -- HIRES [more rare hires] VOTE cards (rule 351(a); rule 25 THE VOTE TAB SHOWS THE THING; rule 29 make the pixels).

  lineup  slices/vote/HIRES_THE_FOURTEEN_RARE_MEN_11_3.webp: the fourteen as he meets them, each his face (the head rendered off
          his own model), his whole body standing three quarters on (his own render), his trade and the perk he walks in with
  cards   slices/vote/HIRES_THE_RARE_CARD_ON_THE_PHONE_11_3.webp: four of their hire cards as the post shows them on his
          phone (390 px, the seeded test's own shots: BOHEMIA_SHOT_DIR=<dir> node gates/more_rare_hires_gate.js), side by side
Run: python3 tools/bohemia_hires_the_vote_cards.py lineup
     python3 tools/bohemia_hires_the_vote_cards.py cards <shot dir> [kind,kind,kind,kind]
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BARBER = os.path.join(ROOT, 'records/target/character/barber')
OUT = os.path.join(ROOT, 'slices/vote')
TRADE = {'road_knight': 'ROAD KNIGHT', 'gun_for_hire': 'GUN FOR HIRE', 'blade_master': 'BLADE MASTER', 'contract_man': 'CONTRACT MAN',
         'lab_hunter': 'LAB HUNTER', 'old_guard': 'OLD GUARD', 'pit_fighter': 'PIT FIGHTER', 'casino_heir': 'CASINO HEIR',
         'static_hunter': 'STATIC HUNTER', 'dune_rider': 'DUNE RIDER', 'desert_wild': 'DESERT WILD', 'casino_guard': 'CASINO GUARD',
         'oath_keeper': 'OATH KEEPER', 'road_raider': 'ROAD RAIDER'}


def font(n, bold=False):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',
              '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf'):
        if os.path.exists(f): return ImageFont.truetype(f, n)
    return ImageFont.load_default()


def lineup():
    R = json.load(open(os.path.join(ROOT, 'records/target/bb/rare_recruits.json')))['men']
    perks = {p['id']: p['name'] for p in json.load(open(os.path.join(ROOT, 'records/target/bb/perks.json')))['rows']}
    cols, cw, ch = 7, 230, 470
    W, H = cols * cw + 40, 2 * ch + 110
    im = Image.new('RGB', (W, H), (18, 14, 10)); d = ImageDraw.Draw(im)
    d.text((20, 18), 'THE FOURTEEN RARE MEN, EACH HIS OWN LOOK', font=font(30, True), fill=(244, 207, 124))
    d.text((20, 58), 'his face off his own model, his whole body, his trade, the perk he walks in with (draft)', font=font(17), fill=(170, 150, 120))
    for i, m in enumerate(R):
        x0, y0 = 20 + (i % cols) * cw, 100 + (i // cols) * ch
        d.rectangle([x0 + 4, y0, x0 + cw - 8, y0 + ch - 14], fill=(28, 22, 16), outline=(70, 56, 38))
        face = Image.open(os.path.join(BARBER, m['look'], 'face', 'rest_128.png')).convert('RGBA').resize((150, 150), Image.LANCZOS)
        im.paste(face, (x0 + (cw - 150) // 2 - 2, y0 + 10), face)
        body = Image.open(os.path.join(BARBER, m['look'], 'rig_SE.png')).convert('RGBA')
        bb = body.getbbox(); body = body.crop(bb)
        s = min(200 / body.height, 150 / body.width) * 1.0; s = min(s, 2.0)
        body = body.resize((max(1, int(body.width * s)), max(1, int(body.height * s))), Image.NEAREST)
        # the lit spot he stands in on his card
        spot = Image.new('RGBA', (170, 40), (0, 0, 0, 0)); sd = ImageDraw.Draw(spot)
        for k in range(10, 0, -1): sd.ellipse([85 - 8 * k, 20 - 2 * k, 85 + 8 * k, 20 + 2 * k], fill=(244, 207, 124, 10))
        by = y0 + 170 + (210 - body.height)
        im.paste(spot, (x0 + (cw - 170) // 2 - 2, by + body.height - 22), spot)
        im.paste(body, (x0 + (cw - body.width) // 2 - 2, by), body)
        t = TRADE.get(m['kind'], m['kind'].upper())
        d.text((x0 + 14, y0 + 392), t, font=font(19, True), fill=(244, 207, 124))
        d.text((x0 + 14, y0 + 420), perks.get(m['perk'], m['perk']).upper(), font=font(15), fill=(232, 220, 196))
    os.makedirs(OUT, exist_ok=True)
    f = os.path.join(OUT, 'HIRES_THE_FOURTEEN_RARE_MEN_11_3.webp'); im.save(f, 'WEBP', quality=86, method=6)
    print('wrote', os.path.relpath(f, ROOT), im.size, os.path.getsize(f) // 1024, 'KB')


def cards(shots, kinds):
    ims = [Image.open(os.path.join(shots, 'rare_%s.png' % k)).convert('RGB') for k in kinds]
    w = 390; ims = [x.resize((w, int(x.height * w / x.width)), Image.LANCZOS) for x in ims]
    H = max(x.height for x in ims) + 70
    out = Image.new('RGB', (len(ims) * (w + 16) + 16, H), (18, 14, 10)); d = ImageDraw.Draw(out)
    d.text((16, 16), 'RARE MEN ON THE HIRE CARD, HIS PHONE (390 px)', font=font(24, True), fill=(244, 207, 124))
    for i, x in enumerate(ims): out.paste(x, (16 + i * (w + 16), 56))
    f = os.path.join(OUT, 'HIRES_THE_RARE_CARD_ON_THE_PHONE_11_3.webp'); out.save(f, 'WEBP', quality=86, method=6)
    print('wrote', os.path.relpath(f, ROOT), out.size, os.path.getsize(f) // 1024, 'KB')


if __name__ == '__main__':
    if sys.argv[1:2] == ['lineup']: lineup()
    elif sys.argv[1:2] == ['cards']: cards(sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else 'road_knight,pit_fighter,lab_hunter,casino_heir').split(','))
    else: print(__doc__)
