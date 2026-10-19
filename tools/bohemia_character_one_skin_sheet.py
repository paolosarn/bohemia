#!/usr/bin/env python3
"""CHARACTER [one skin, one person] (rule 120(d), 10/19/26): THE SHEET FOR THE VOTE TAB.

Every person the fight and the settlement draw, as the game baked him BEFORE (the body in the player's porcelain, the 64
face in a tone of its own) and AFTER (body and face in his one skin, records/target/character/BOHEMIA_ONE_SKIN.json),
at 1:1 and at x3 nearest-neighbour, the fight sheet's own idle frame (SE, column 0) and its own 64 face. With the rig
renders on disk, a third block: the thirteen gangs' 3D bodies before and after (the rig's own S still).

Run (after the bakes): python3 tools/bohemia_character_one_skin_sheet.py <before_fight_people_dir> [<before_rig_dir>]
Out: records/target/character/CHARACTER_ONE_SKIN_ONE_PERSON.png and its twin, CHARACTER_ONE_SKIN_BEFORE_TWIN.png (the game before, 1:1)

REUSE CHECK: every pixel is the game's own bake (tools/bohemia_fight_people_bake.js) or the rig's own render; nothing is
drawn here but the labels. REFERENCE CHECK: the twin is the game's own sheet as it stood before this row, 1:1.
"""
import json
import os
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ONE = json.load(open(os.path.join(ROOT, 'records/target/character/BOHEMIA_ONE_SKIN.json')))['people']
AFTER = os.path.join(ROOT, 'slices/fight_people')
RIG = os.path.join(ROOT, 'records/target/character/rig')
OUT = os.path.join(ROOT, 'records/target/character/CHARACTER_ONE_SKIN_ONE_PERSON.png')
TWIN = os.path.join(ROOT, 'records/target/character/CHARACTER_ONE_SKIN_BEFORE_TWIN.png')
BG = (22, 21, 20); INK = (220, 214, 200); DIM = (150, 144, 130); HEAD = (200, 190, 120); RED = (190, 80, 60); GRN = (120, 170, 90)
X = 3


def person(d, pid):
    sh = Image.open(os.path.join(d, pid + '.webp')).convert('RGBA')
    body = sh.crop((36, 6, 78, 108))                      # the figure box of the SE idle frame
    face = sh.crop((sh.width - 64, 0, sh.width, 64))
    return body, face


def card(pid, before):
    b0, f0 = person(before, pid)
    b1, f1 = person(AFTER, pid)
    w = 2 * (42 + 6 + 42 * X + 6 + 64) + 30
    im = Image.new('RGBA', (w, 102 * X + 40), BG + (255,))
    d = ImageDraw.Draw(im)
    v = ONE[pid]
    d.text((6, 4), '%s  %s' % (pid.replace('cast_', '').replace('faction_', '').upper(), v['who']), fill=INK)
    d.text((6, 16), '%s, skin: %s' % (v['heritage'], v['tone'].upper()), fill=HEAD)
    x = 6
    for lab, b, f, col in (('BEFORE', b0, f0, RED), ('AFTER', b1, f1, GRN)):
        y = 32
        im.alpha_composite(b, (x, y + 102 * X - 102))
        im.alpha_composite(b.resize((42 * X, 102 * X), Image.NEAREST), (x + 48, y))
        im.alpha_composite(f, (x + 48 + 42 * X + 6, y))
        d.text((x + 48 + 42 * X + 6, y + 70), lab, fill=col)
        x += 42 + 6 + 42 * X + 6 + 64 + 18
    return im


def rig_card(look, before_rig):
    a = Image.open(os.path.join(before_rig, look, 'rig_S.png')).convert('RGBA')
    b = Image.open(os.path.join(RIG, look, 'rig_S.png')).convert('RGBA')
    im = Image.new('RGBA', (a.width + b.width + 18, max(a.height, b.height) + 30), BG + (255,))
    d = ImageDraw.Draw(im)
    v = ONE['faction_' + look]
    d.text((4, 2), '%s  %s' % (look.upper(), v['tone'].upper()), fill=INK)
    im.alpha_composite(a, (4, 16)); im.alpha_composite(b, (a.width + 14, 16))
    return im


def main():
    before = sys.argv[1]
    before_rig = sys.argv[2] if len(sys.argv) > 2 else None
    ids = [k for k in ONE if os.path.exists(os.path.join(AFTER, k + '.webp')) and k != 'you']
    cards = [card(k, before) for k in ids]
    cw, chh = cards[0].size
    per = 2
    rows = (len(cards) + per - 1) // per
    rig = []
    if before_rig:
        for k in ids:
            if k.startswith('faction_') and os.path.exists(os.path.join(RIG, k[8:], 'rig_S.png')) and os.path.exists(os.path.join(before_rig, k[8:], 'rig_S.png')):
                rig.append(rig_card(k[8:], before_rig))
    rw = max([c.width for c in rig] or [0]); rh = max([c.height for c in rig] or [0])
    rper = max(1, (per * cw) // (rw + 8)) if rig else 1
    rrows = (len(rig) + rper - 1) // rper if rig else 0
    W = per * cw + 24
    H = 96 + rows * (chh + 8) + (40 + rrows * (rh + 8) if rig else 0)
    out = Image.new('RGBA', (W, H), BG + (255,))
    d = ImageDraw.Draw(out)
    d.text((12, 8), 'CHARACTER: ONE SKIN, ONE PERSON. Every person the fight and the town draw, BEFORE and AFTER, 1:1 and x3.', fill=INK)
    d.text((12, 22), 'BEFORE: every body wore the player\'s porcelain skin while the face beside it had its own. AFTER: one skin per person,', fill=DIM)
    d.text((12, 36), 'the body and the face read the same value (records/target/character/BOHEMIA_ONE_SKIN.json).', fill=DIM)
    d.text((12, 50), 'Mix: 37% white, 33% Hispanic, 15% Black, 7% Asian, 7% mixed (Las Vegas: 40/33/12/7/5). Draft: nothing is final.', fill=HEAD)
    d.text((12, 64), 'one pixel size (the fight sheet\'s 112 frame, 1:1; x3 nearest) | palette: the game\'s SKIN_TONES ladder | light: the sprite\'s own', fill=DIM)
    for i, c in enumerate(cards):
        out.alpha_composite(c, (12 + (i % per) * cw, 96 + (i // per) * (chh + 8)))
    if rig:
        y = 96 + rows * (chh + 8) + 8
        d.text((12, y), 'THE 3D GANG BODIES (the rig\'s own S still): BEFORE, all thirteen one tan  |  AFTER, each his own skin', fill=HEAD)
        for i, c in enumerate(rig):
            out.alpha_composite(c, (12 + (i % rper) * (rw + 8), y + 22 + (i // rper) * (rh + 8)))
    out.convert('RGB').save(OUT, optimize=True)
    # THE TWIN (rule 82): the game's own sheet as it stood before this row, every body and face at 1:1 in one strip
    tw = Image.new('RGBA', (len(ids) * 48 + 8, 102 + 64 + 14), BG + (255,))
    for i, k in enumerate(ids):
        b0, f0 = person(before, k)
        tw.alpha_composite(b0, (4 + i * 48, 4)); tw.alpha_composite(f0.resize((44, 44), Image.NEAREST), (4 + i * 48, 110))
    tw.convert('RGB').save(TWIN, optimize=True)
    print('wrote %s  %dx%d, %d people%s' % (os.path.relpath(OUT, ROOT), W, H, len(cards), (', %d rig bodies' % len(rig)) if rig else ''))


if __name__ == '__main__':
    main()
