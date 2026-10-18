#!/usr/bin/env python3
"""WHO THE FACE IS -- the sheet and the talking faces (PEOPLE, 10/18/26).

Row [a name for every starred face], rule 115(h). Reads banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json
(written by tools/bohemia_people_who_the_face_is.js) and PORTRAIT's own head renders, and draws:

  records/people/WHO_THE_FACE_IS.png          the fifteen faces at 1:1, each with the person behind it
  records/people/WHO_THE_FACE_IS_TALKING.gif  the fifteen faces saying their lines on PORTRAIT's own
                                              mouth keys, one key every 125 ms (a sixteenth at 120 BPM)

Cooks zero face pixels: every face frame is PORTRAIT's render, pasted unedited (the thug and the
poacher heads fitted into the 128 square the crew faces already are). Words in the project's own
fonts (slices/fonts). A page under the hold (rule 88): nothing here reaches the game or the VOTE tab.

  python3 tools/bohemia_people_who_the_face_is_sheet.py
"""
import json
import os
import textwrap

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json')
OUT = os.path.join(ROOT, 'records/people')
FONT_NAME = os.path.join(ROOT, 'slices/fonts/BohemiaCasing-Regular.ttf')
FONT_BODY = os.path.join(ROOT, 'slices/fonts/BohemiaBody-Regular.ttf')

INK = (226, 214, 190)
DIM = (150, 140, 122)
TAG = (196, 120, 84)
BG = (22, 20, 18)
CARD = (34, 31, 27)
SIDE = 128


def face_frame(path):
    """PORTRAIT's render for one key, fitted into the 128 square (crew faces already are)."""
    path = path.replace('{64|128}', '128')
    im = Image.open(os.path.join(ROOT, path)).convert('RGBA')
    if im.size == (SIDE, SIDE):
        return im
    w, h = im.size
    s = SIDE / max(w, h)
    im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.BOX)
    sq = Image.new('RGBA', (SIDE, SIDE), (0, 0, 0, 0))
    sq.paste(im, ((SIDE - im.size[0]) // 2, SIDE - im.size[1]), im)
    return sq


def main():
    bank = json.load(open(BANK))
    faces = bank['faces']
    order = list(faces.keys())
    os.makedirs(OUT, exist_ok=True)
    f_name = ImageFont.truetype(FONT_NAME, 17)
    f_body = ImageFont.truetype(FONT_BODY, 13)
    f_head = ImageFont.truetype(FONT_NAME, 26)

    frames = {k: {key: face_frame(p) for key, p in faces[k]['face_files'].items()} for k in order}

    # ---- the sheet ----
    cols, cw, ch, pad, top = 5, 300, 330, 14, 96
    rows = (len(order) + cols - 1) // cols
    W, H = pad + cols * (cw + pad), top + rows * (ch + pad) + 40
    sheet = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(sheet)
    d.text((pad, 18), 'WHO THE FACE IS', font=f_head, fill=INK)
    d.text((pad, 54), 'every face PORTRAIT built the starred way, and the person behind it: a name from the names mix, '
           'where they live, what they do, one line in their own voice. 1:1. draft, not final.', font=f_body, fill=DIM)
    for i, k in enumerate(order):
        p = faces[k]
        x, y = pad + (i % cols) * (cw + pad), top + (i // cols) * (ch + pad)
        d.rectangle([x, y, x + cw, y + ch], fill=CARD)
        im = frames[k]['rest']
        sheet.paste(im, (x + (cw - SIDE) // 2, y + 10), im)
        ty = y + 10 + SIDE + 8
        d.text((x + 12, ty), p['name']['full'].upper(), font=f_name, fill=INK)
        ty += 24
        for ln in textwrap.wrap(p['who'].split(', ', 1)[1], 38):
            d.text((x + 12, ty), ln, font=f_body, fill=DIM)
            ty += 17
        ty += 6
        for ln in textwrap.wrap('"' + p['line']['text'] + '"', 38):
            d.text((x + 12, ty), ln, font=f_body, fill=INK)
            ty += 17
        tag = {'en': 'ENGLISH', 'spanglish': 'ENGLISH AND SPANISH', 'es': 'SPANISH, SOME ENGLISH'}[p['line']['register']]
        if p['line']['speaker_is_player']:
            tag = 'YOU  -  ' + tag + ', ALWAYS'
        elif p['does']['tier']:
            tag = 'ENEMY HEAD  -  ' + tag
        d.text((x + 12, y + ch - 24), tag + '   %.1f s' % p['mouth']['seconds'], font=f_body, fill=TAG)
    d.text((pad, H - 30), 'faces: PORTRAIT (records/target/portrait), unedited.  people: banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json', font=f_body, fill=DIM)
    sheet.save(os.path.join(OUT, 'WHO_THE_FACE_IS.png'), optimize=True)

    # ---- the talking faces: one key every 125 ms, everybody at once, then a beat of rest ----
    gcols, gw, gh = 5, SIDE + 24, SIDE + 30
    GW, GH = pad + gcols * (gw + pad), pad + rows * (gh + pad)
    n = max(len(faces[k]['mouth']['keys']) for k in order) + 8
    out = []
    for t in range(n):
        fr = Image.new('RGB', (GW, GH), BG)
        dd = ImageDraw.Draw(fr)
        for i, k in enumerate(order):
            keys = faces[k]['mouth']['keys']
            key = keys[t] if t < len(keys) else 'rest'
            x, y = pad + (i % gcols) * (gw + pad), pad + (i // gcols) * (gh + pad)
            im = frames[k][key]
            fr.paste(im, (x + 12, y), im)
            dd.text((x + 12, y + SIDE + 6), faces[k]['name']['given'].upper(), font=f_name, fill=INK)
        out.append(fr.convert('P', palette=Image.ADAPTIVE, colors=255))
    out[0].save(os.path.join(OUT, 'WHO_THE_FACE_IS_TALKING.gif'), save_all=True, append_images=out[1:],
                duration=125, loop=0, optimize=True, disposal=1)
    print('wrote records/people/WHO_THE_FACE_IS.png (%dx%d) and WHO_THE_FACE_IS_TALKING.gif (%d frames, %.2f s)'
          % (W, H, len(out), len(out) * 0.125))


if __name__ == '__main__':
    main()
